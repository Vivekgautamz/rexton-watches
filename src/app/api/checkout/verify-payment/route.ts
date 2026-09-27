import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { getSession } from '@/lib/auth';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { formatPrice } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderData, paymentMethod } = body;

    const session = await getSession();
    const { items, shippingAddress, couponCode } = orderData;

    // 1. Verify Razorpay Signature if paying via Razorpay
    if (paymentMethod === 'RAZORPAY') {
      const isValidSignature = verifyRazorpaySignature({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      });

      if (!isValidSignature) {
        return NextResponse.json(
          { success: false, error: 'Payment signature verification failed. Possible tampering detected.' },
          { status: 400 }
        );
      }
    }

    // 2. Fetch live products from MySQL to calculate authoritative server totals
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      const p = dbProducts.find((dbP) => dbP.id === item.productId);
      if (!p) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 400 });
      }
      const itemPrice = Number(p.price);
      subtotal += itemPrice * item.quantity;
      orderItemsData.push({
        productId: p.id,
        title: p.title,
        sku: p.sku,
        price: p.price,
        quantity: item.quantity,
        total: itemPrice * item.quantity,
      });
    }

    // Validate coupon
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });
      if (coupon && coupon.isActive) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
          if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
            discountAmount = Number(coupon.maxDiscount);
          }
        } else {
          discountAmount = Number(coupon.discountValue);
        }
      }
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    // 3. EXECUTE ATOMIC PRISMA TRANSACTION (All or nothing)
    const transactionResult = await prisma.$transaction(async (tx) => {
      // A. Verify stock inside transaction
      for (const item of items) {
        const currentProd = await tx.product.findUnique({
          where: { id: item.productId },
          select: { id: true, title: true, stock: true },
        });

        if (!currentProd || currentProd.stock < item.quantity) {
          throw new Error(`Timepiece "${currentProd?.title || 'Unknown'}" is out of stock.`);
        }
      }

      // B. Create Order Record
      const orderNumber = `REX-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: session?.id || null,
          guestEmail: !session?.id ? shippingAddress.email : null,
          guestPhone: !session?.id ? shippingAddress.phone : null,
          guestName: !session?.id ? shippingAddress.fullName : null,
          status: paymentMethod === 'RAZORPAY' ? 'CONFIRMED' : 'PENDING',
          paymentStatus: paymentMethod === 'RAZORPAY' ? 'PAID' : 'PENDING',
          paymentMethod: paymentMethod === 'RAZORPAY' ? 'RAZORPAY' : 'COD',
          razorpayOrderId: razorpayOrderId || null,
          razorpayPaymentId: razorpayPaymentId || null,
          subtotal,
          discountAmount,
          shippingAmount: 0,
          totalAmount: finalTotal,
          couponCode: couponCode ? couponCode.toUpperCase() : null,
          shippingAddress: JSON.stringify(shippingAddress),
          items: {
            create: orderItemsData.map((oi) => ({
              productId: oi.productId,
              title: oi.title,
              sku: oi.sku,
              price: oi.price,
              quantity: oi.quantity,
              total: oi.total,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // C. Decrement inventory and record audit logs
      for (const item of items) {
        const updatedProd = await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            changeAmount: -item.quantity,
            previousStock: updatedProd.stock + item.quantity,
            newStock: updatedProd.stock,
            reason: 'ORDER_PLACED',
            referenceId: order.id,
          },
        });
      }

      // D. Record Payment audit if Razorpay
      if (paymentMethod === 'RAZORPAY' && razorpayOrderId) {
        await tx.payment.create({
          data: {
            orderId: order.id,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            amount: finalTotal,
            currency: 'INR',
            status: 'PAID',
            rawResponse: JSON.stringify({ razorpayPaymentId, razorpayOrderId, verifiedAt: new Date() }),
          },
        });
      }

      // E. Update coupon usage count
      if (couponCode) {
        await tx.coupon.updateMany({
          where: { code: couponCode.toUpperCase().trim() },
          data: { usageCount: { increment: 1 } },
        });
      }

      return order;
    });

    // 4. Send Confirmation Email asynchronously
    try {
      await sendOrderConfirmationEmail({
        to: shippingAddress.email,
        customerName: shippingAddress.fullName,
        orderNumber: transactionResult.orderNumber,
        orderDate: new Date().toLocaleDateString('en-US', { dateStyle: 'long' }),
        items: transactionResult.items.map((i) => ({
          title: i.title,
          sku: i.sku,
          quantity: i.quantity,
          price: formatPrice(Number(i.price) * i.quantity),
        })),
        totalAmount: formatPrice(finalTotal),
        shippingAddress,
      });
    } catch (e) {
      console.error('Email dispatch error (non-fatal):', e);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: transactionResult.id,
        orderNumber: transactionResult.orderNumber,
        totalAmount: finalTotal,
      },
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment processing failed' },
      { status: 500 }
    );
  }
}
