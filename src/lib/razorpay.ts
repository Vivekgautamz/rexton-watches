import Razorpay from 'razorpay';
import crypto from 'crypto';

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder_secret';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_key';

export const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export async function createRazorpayOrder({
  amountInRupees,
  receipt,
  notes = {},
}: {
  amountInRupees: number;
  receipt: string;
  notes?: Record<string, string>;
}) {
  // Amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(amountInRupees * 100);

  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: receipt.slice(0, 40), // Razorpay receipt max 40 chars
    notes,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    return { success: true, order };
  } catch (error: any) {
    console.error('Razorpay order creation failed:', error);
    return { success: false, error: error.message || 'Failed to create payment order' };
  }
}

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!orderId || !paymentId || !signature) return false;

  const generatedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}

export function verifyWebhookSignature({
  rawBody,
  signature,
}: {
  rawBody: string;
  signature: string;
}): boolean {
  if (!rawBody || !signature) return false;

  const generatedSignature = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  return generatedSignature === signature;
}
