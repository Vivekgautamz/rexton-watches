import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { productSchema } from '@/lib/validations';

// POST: Create Product
export async function POST(request: Request) {
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

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: productData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A timepiece with this slug already exists' },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images.map((img, idx) => ({
            url: img.url,
            altText: img.altText || productData.title,
            isPrimary: img.isPrimary || idx === 0,
            sortOrder: idx,
          })),
        },
      },
      include: { images: true },
    });

    // Record initial stock inventory log
    if (productData.stock > 0) {
      await prisma.inventoryLog.create({
        data: {
          productId: newProduct.id,
          changeAmount: productData.stock,
          previousStock: 0,
          newStock: productData.stock,
          reason: 'INITIAL_STOCK_CREATION',
        },
      });
    }

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
