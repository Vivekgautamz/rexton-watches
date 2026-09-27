import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createRazorpayOrder } from '@/lib/razorpay';
import { generateOrderNumber } from '@/lib/utils';
import { createOrderSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parseResult = createOrderSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.errors[0]?.message || 'Invalid order parameters' },
        { status: 400 }
      );
    }

    const { items, shippingAddress, couponCode, paymentMethod } = parseResult.data;

    // 1. Fetch products from MySQL database to prevent frontend price manipulation
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        status: 'PUBLISHED',
      },
    });

    if (dbProducts.length !== items.length) {
      return NextResponse.json(
        { success: false, error: 'One or more selected timepieces are unavailable' },
        { status: 400 }
      );
    }

    // 2. Validate stock & calculate subtotal
    let subtotal = 0;
    const validatedItems: Array<{
      productId: string;
      title: string;
      sku: string;
      price: number;
      quantity: number;
      image?: string;
    }> = [];

    for (const item of items) {
      const dbProd = dbProducts.find((p) => p.id === item.productId);
      if (!dbProd) {
        return NextResponse.json({ success: false, error: `Product not found` }, { status: 400 });
      }

      if (dbProd.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for "${dbProd.title}". Only ${dbProd.stock} available.`,
          },
          { status: 400 }
        );
      }

      const itemPrice = Number(dbProd.price);
      subtotal += itemPrice * item.quantity;

      validatedItems.push({
        productId: dbProd.id,
        title: dbProd.title,
        sku: dbProd.sku,
        price: itemPrice,
        quantity: item.quantity,
      });
    }

    // 3. Validate coupon if provided
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        const isValidDate = (!coupon.validFrom || now >= coupon.validFrom) && (!coupon.validTo || now <= coupon.validTo);
        const hasUsage = !coupon.usageLimit || coupon.usageCount < coupon.usageLimit;
        const meetsMin = !coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount);

        if (isValidDate && hasUsage && meetsMin) {
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
    }

    const totalAmount = Math.max(0, subtotal - discountAmount);
    const orderNumber = generateOrderNumber();

    // 4. Handle Razorpay Order Creation
    if (paymentMethod === 'RAZORPAY') {
      const razorpayRes = await createRazorpayOrder({
        amountInRupees: totalAmount,
        receipt: orderNumber,
        notes: {
          orderNumber,
          customerEmail: shippingAddress.email,
          customerName: shippingAddress.fullName,
        },
      });

      if (!razorpayRes.success || !razorpayRes.order) {
        return NextResponse.json(
          { success: false, error: razorpayRes.error || 'Failed to initialize payment gateway' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        paymentMethod: 'RAZORPAY',
        orderNumber,
        razorpayOrderId: razorpayRes.order.id,
        amount: totalAmount,
        currency: 'INR',
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
        validatedItems,
        subtotal,
        discountAmount,
      });
    }

    // Cash on delivery / In-boutique wire flow handled directly in payment verification
    return NextResponse.json({
      success: true,
      paymentMethod: 'COD',
      orderNumber,
      amount: totalAmount,
      currency: 'INR',
      validatedItems,
      subtotal,
      discountAmount,
    });
  } catch (error: any) {
    console.error('Create order API error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
