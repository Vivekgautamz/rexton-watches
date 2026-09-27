import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import AdminProductForm from '@/components/AdminProductForm';

interface AdminEditProductPageProps {
  params: { id: string };
}

export default async function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const [product, categories, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
    }),
    prisma.category.findMany({ select: { id: true, name: true } }),
    prisma.collection.findMany({ select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
          Atelier Modification
        </span>
        <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
          Edit {product.title}
        </h1>
      </div>

      <AdminProductForm
        initialData={product}
        categories={categories}
        collections={collections}
        isEdit={true}
      />
    </div>
  );
}
