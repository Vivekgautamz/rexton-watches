import React from 'react';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { Layers, Plus, Trash2 } from 'lucide-react';
import AdminCollectionCreator from '@/components/AdminCollectionCreator';

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#242424]">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
          Curation Architecture
        </span>
        <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
          Curated Series Collections
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#141414] border border-[#242424] p-6 space-y-4">
          <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2">
            Maison Collections ({collections.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {collections.map((col) => (
              <div key={col.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 space-y-3">
                {col.bannerImage && (
                  <div className="relative h-32 w-full bg-black">
                    <Image src={col.bannerImage} alt={col.name} fill className="object-cover" sizes="200px" />
                  </div>
                )}
                <div>
                  <h4 className="font-serif uppercase tracking-wider text-white text-sm">{col.name}</h4>
                  <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">{col.tagline || col.description}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-[#262626]">
                  <span>{col._count.products} Timepieces</span>
                  <span className="font-mono text-[10px] text-[#C5A880]">/{col.slug}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <AdminCollectionCreator />
        </div>
      </div>
    </div>
  );
}
