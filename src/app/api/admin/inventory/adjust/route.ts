import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role === 'CUSTOMER') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { productId, changeAmount, reason } = body;

    if (!productId || typeof changeAmount !== 'number' || changeAmount === 0) {
      return NextResponse.json({ success: false, error: 'Invalid adjustment parameters' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const newStock = Math.max(0, product.stock + changeAmount);

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      await tx.inventoryLog.create({
        data: {
          productId,
          changeAmount,
          previousStock: product.stock,
          newStock,
          reason: reason || 'MANUAL_INVENTORY_ADJUSTMENT',
        },
      });

      return updated;
    });

    return NextResponse.json({ success: true, product: result });
  } catch (error: any) {
    console.error('Inventory adjust error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
