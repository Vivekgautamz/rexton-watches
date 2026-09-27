import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { reviewSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = reviewSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.errors[0]?.message || 'Invalid review data' },
        { status: 400 }
      );
    }

    const { productId, authorName, rating, title, comment } = parseResult.data;
    const session = await getSession();

    // Check if user has ordered this product before (verified purchase)
    let isVerifiedPurchase = false;
    if (session?.id) {
      const order = await prisma.order.findFirst({
        where: {
          userId: session.id,
          paymentStatus: 'PAID',
          items: {
            some: { productId },
          },
        },
      });
      if (order) isVerifiedPurchase = true;
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session?.id || null,
        authorName,
        rating,
        title: title || null,
        comment,
        isApproved: true,
        isVerifiedPurchase,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error('Review API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}
