import React from 'react';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { FolderTree } from 'lucide-react';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#242424]">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
          Classification
        </span>
        <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
          Product Categories ({categories.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-[#141414] border border-[#242424] p-5 space-y-3">
            {cat.image && (
              <div className="relative h-28 w-full bg-black">
                <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="200px" />
              </div>
            )}
            <div>
              <h3 className="font-serif uppercase tracking-wider text-white font-medium">{cat.name}</h3>
              <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">{cat.description}</p>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-[#242424]">
              <span>{cat._count.products} Assigned References</span>
              <span className="font-mono text-[#C5A880] text-[10px]">/{cat.slug}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
