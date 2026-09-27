import React from 'react';
import prisma from '@/lib/prisma';
import AdminProductForm from '@/components/AdminProductForm';

export default async function AdminNewProductPage() {
  const [categories, collections] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true } }),
    prisma.collection.findMany({ select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
          Atelier Creation
        </span>
        <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
          Register New Timepiece
        </h1>
      </div>

      <AdminProductForm
        categories={categories}
        collections={collections}
        isEdit={false}
      />
    </div>
  );
}
