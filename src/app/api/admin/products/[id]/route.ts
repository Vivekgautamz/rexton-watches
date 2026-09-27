import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { productSchema } from '@/lib/validations';

// PUT: Update Product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role === 'CUSTOMER') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const parseResult = productSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.errors[0]?.message || 'Invalid product data' },
        { status: 400 }
      );
    }

    const { images, ...productData } = parseResult.data;

    // Check existing product
    const existing = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Timepiece not found' }, { status: 404 });
    }

    // Update Product in Transaction
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Update basic fields
      const updated = await tx.product.update({
        where: { id: params.id },
        data: { ...productData },
      });

      // 2. Re-create images
      await tx.productImage.deleteMany({ where: { productId: params.id } });
      for (let i = 0; i < images.length; i++) {
        await tx.productImage.create({
          data: {
            productId: params.id,
            url: images[i].url,
            altText: images[i].altText || productData.title,
            isPrimary: images[i].isPrimary || i === 0,
            sortOrder: i,
          },
        });
      }

      // 3. If stock changed, record inventory log
      if (existing.stock !== productData.stock) {
        await tx.inventoryLog.create({
          data: {
            productId: params.id,
            changeAmount: productData.stock - existing.stock,
            previousStock: existing.stock,
            newStock: productData.stock,
            reason: 'ADMIN_MANUAL_EDIT',
          },
        });
      }

      return updated;
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete Product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Requires Admin role.' }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete timepiece' }, { status: 500 });
  }
}
