import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, orderAmount } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Promo code is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ success: false, error: 'Invalid or inactive promotional code' }, { status: 400 });
    }

    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) {
      return NextResponse.json({ success: false, error: 'Coupon is not yet active' }, { status: 400 });
    }

    if (coupon.validTo && now > coupon.validTo) {
      return NextResponse.json({ success: false, error: 'Coupon has expired' }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, error: 'Coupon usage limit reached' }, { status: 400 });
    }

    if (coupon.minOrderAmount && Number(orderAmount) < Number(coupon.minOrderAmount)) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order value of ₹${Number(coupon.minOrderAmount).toLocaleString('en-IN')} required for this privilege`,
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (Number(orderAmount) * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
        discountAmount = Number(coupon.maxDiscount);
      }
    } else {
      discountAmount = Number(coupon.discountValue);
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        discountPercent: coupon.discountType === 'PERCENTAGE' ? Number(coupon.discountValue) : 0,
      },
      discountAmount,
    });
  } catch (error: any) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ success: false, error: 'Error validating promotional code' }, { status: 500 });
  }
}
