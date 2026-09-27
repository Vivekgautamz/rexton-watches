import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

interface CollectionDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CollectionDetailPageProps) {
  const col = await prisma.collection.findUnique({
    where: { slug: params.slug },
  });

  if (!col) return { title: 'Collection Not Found | REXTON' };

  return {
    title: `${col.name} Collection | REXTON WATCHES`,
    description: col.description || col.tagline || 'Explore the curated collection.',
  };
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const collection = await prisma.collection.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        where: { status: 'PUBLISHED' },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          category: true,
        },
      },
    },
  });

  if (!collection) notFound();

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Hero Header */}
      <div className="relative h-[450px] bg-neutral-900 flex items-center text-white overflow-hidden">
        {collection.bannerImage && (
          <Image
            src={collection.bannerImage}
            alt={collection.name}
            fill
            priority
            className="object-cover object-center opacity-40 mix-blend-luminosity"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
            REXTON Master Series
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-[0.2em] uppercase font-normal text-white">
            {collection.name}
          </h1>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto" />
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            {collection.description || collection.tagline}
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-xs text-neutral-500 uppercase tracking-widest flex items-center space-x-2">
          <Link href="/" className="hover:text-black transition-colors">
            Maison
          </Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-black transition-colors">
            Collections
          </Link>
          <span>/</span>
          <span className="text-black font-semibold">{collection.name}</span>
        </div>
      </div>

      {/* Timepieces Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#EAEAEA]">
          <span className="text-xs uppercase tracking-widest text-neutral-500">
            Featuring <strong className="text-black">{collection.products.length}</strong> Timepieces
          </span>
        </div>

        {collection.products.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 border border-neutral-200 space-y-4">
            <h3 className="text-base font-serif uppercase tracking-widest text-black">
              Timepieces in this series are undergoing master finishing
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Please check back shortly or consult our concierge for private allocations.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors"
            >
              Explore All References
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {collection.products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: Number(product.price),
                  compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
                } as any}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
