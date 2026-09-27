import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role === 'CUSTOMER') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, tagline, description, bannerImage, isFeatured } = body;

    const collection = await prisma.collection.create({
      data: {
        name,
        slug: slugify(name),
        tagline: tagline || null,
        description: description || null,
        bannerImage: bannerImage || null,
        isFeatured: !!isFeatured,
      },
    });

    return NextResponse.json({ success: true, collection });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to create collection' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role === 'CUSTOMER') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await prisma.collection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete collection' }, { status: 500 });
  }
}
