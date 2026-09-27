import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Curated Swiss Watch Collections | REXTON WATCHES',
  description: 'Explore the curated watch collections by REXTON, including The Sovereign Heritage, Apex Aero Carbon, and Abyssal Deep Diver.',
};

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#0C0C0C] text-white py-20 px-4 border-b border-[#222222]">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
            Maison Reference Series
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-[0.2em] uppercase font-normal text-white">
            Curated Collections
          </h1>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto" />
          <p className="text-xs text-neutral-400 max-w-xl mx-auto font-light leading-relaxed pt-2">
            Each collection explores a distinct dimension of Swiss horological expression, unified by meticulous hand-finishing and mechanical mastery.
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group block relative h-[500px] overflow-hidden bg-neutral-900 border border-neutral-200 shadow-md"
            >
              {col.bannerImage ? (
                <Image
                  src={col.bannerImage}
                  alt={col.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-75 group-hover:brightness-90"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-10 text-white space-y-3">
                <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
                  {col._count.products} Distinct Timepieces
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif tracking-wider font-normal">
                  {col.name}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 font-light line-clamp-2 leading-relaxed">
                  {col.description || col.tagline}
                </p>
                <div className="pt-3 flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880] group-hover:translate-x-2 transition-transform">
                  <span>Explore Series</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
