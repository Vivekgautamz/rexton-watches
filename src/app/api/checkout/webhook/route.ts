import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    // Verify webhook authenticity
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature({ rawBody, signature });
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    // Handle payment.captured or order.paid events idempotently
    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const paymentEntity = event.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        const existingOrder = await prisma.order.findUnique({
          where: { razorpayOrderId },
        });

        // If order exists and is pending, mark as CONFIRMED & PAID
        if (existingOrder && existingOrder.paymentStatus !== 'PAID') {
          await prisma.order.update({
            where: { id: existingOrder.id },
            data: {
              status: 'CONFIRMED',
              paymentStatus: 'PAID',
              razorpayPaymentId: razorpayPaymentId || existingOrder.razorpayPaymentId,
            },
          });
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
