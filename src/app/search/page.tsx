import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { Search } from 'lucide-react';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export const metadata = {
  title: 'Search Timepieces | REXTON WATCHES',
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() || '';

  let products: any[] = [];
  if (query) {
    products = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { sku: { contains: query } },
          { movement: { contains: query } },
          { dialColor: { contains: query } },
        ],
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
      },
    });
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#0C0C0C] text-white py-16 px-4 border-b border-[#222222]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
            Atelier Search Registry
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif tracking-[0.2em] uppercase font-normal text-white">
            {query ? `Search Results for "${query}"` : 'Search Timepieces'}
          </h1>

          {/* Search Form */}
          <form action="/search" method="GET" className="relative max-w-xl mx-auto">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by model, reference SKU, movement, or material..."
              className="w-full px-5 py-3.5 pr-12 text-xs bg-[#181818] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
            />
            <button
              type="submit"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {query ? (
          <div>
            <div className="pb-6 mb-8 border-b border-[#EAEAEA] flex justify-between items-center text-xs">
              <span className="text-neutral-500 uppercase tracking-wider">
                Found <strong className="text-black">{products.length}</strong> matching timepieces
              </span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 border border-neutral-200 space-y-4">
                <h3 className="text-base font-serif uppercase tracking-widest text-black">
                  No Matching Timepieces Found
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try searching for general terms such as &quot;Chronograph&quot;, &quot;Automatic&quot;, &quot;300M&quot;, or a model reference.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors"
                >
                  Explore Complete Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={{
                      ...prod,
                      price: Number(prod.price),
                      compareAtPrice: prod.compareAtPrice ? Number(prod.compareAtPrice) : null,
                    } as any}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-neutral-500 text-xs uppercase tracking-widest">
            Please enter a keyword to begin search.
          </div>
        )}
      </div>
    </div>
  );
}
