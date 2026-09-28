import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const metadata = {
  title: 'Shop All Timepieces | REXTON WATCHES',
  description: 'Explore the full REXTON collection of Swiss-crafted automatic chronographs, tourbillons, diving instruments, and heritage dress watches.',
};

interface ShopPageProps {
  searchParams: {
    category?: string;
    collection?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    movement?: string;
    page?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, collection, sort, minPrice, maxPrice, movement, page = '1' } = searchParams;
  const currentPage = parseInt(page) || 1;
  const pageSize = 12;

  // Build Prisma where clause
  const where: any = {
    status: 'PUBLISHED',
  };

  if (category) {
    where.category = { slug: category };
  }

  if (collection) {
    where.collection = { slug: collection };
  }

  if (movement) {
    where.movement = { contains: movement };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  // Build OrderBy
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-asc') orderBy = { price: 'asc' };
  if (sort === 'price-desc') orderBy = { price: 'desc' };
  if (sort === 'featured') orderBy = { isFeatured: 'desc' };

  // Fetch data
  const [products, totalCount, categories, collections] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
        collection: true,
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany(),
    prisma.collection.findMany(),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#0C0C0C] text-white py-16 px-4 border-b border-[#222222]">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-[11px] tracking-[0.35em] uppercase text-[#C5A880] font-semibold">
            REXTON &bull; SWISS TIMELESS ROOT
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-[0.2em] uppercase font-normal text-white">
            Watches
          </h1>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto" />
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto font-light leading-relaxed pt-2">
            Explore the REXTON collection of precision mechanical instruments, chronographs, and haute horlogerie calibres.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters (Desktop) */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
              <span className="text-xs uppercase tracking-widest font-semibold text-black flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C5A880]" />
                <span>Filter References</span>
              </span>
              {(category || collection || sort || minPrice || maxPrice) && (
                <Link
                  href="/shop"
                  className="text-[11px] uppercase tracking-wider text-neutral-500 hover:text-black font-medium"
                >
                  Reset
                </Link>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-black">
                Categories
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/shop"
                    className={`block transition-colors ${
                      !category ? 'font-semibold text-black' : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    All Categories
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/shop?category=${cat.slug}${sort ? `&sort=${sort}` : ''}`}
                      className={`block transition-colors ${
                        category === cat.slug
                          ? 'font-semibold text-[#C5A880]'
                          : 'text-neutral-500 hover:text-black'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collections */}
            <div className="space-y-3 pt-6 border-t border-neutral-100">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-black">
                Curated Series
              </h4>
              <ul className="space-y-2 text-xs">
                {collections.map((col) => (
                  <li key={col.id}>
                    <Link
                      href={`/shop?collection=${col.slug}${sort ? `&sort=${sort}` : ''}`}
                      className={`block transition-colors ${
                        collection === col.slug
                          ? 'font-semibold text-[#C5A880]'
                          : 'text-neutral-500 hover:text-black'
                      }`}
                    >
                      {col.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter Links */}
            <div className="space-y-3 pt-6 border-t border-neutral-100">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-black">
                Acquisition Value
              </h4>
              <ul className="space-y-2 text-xs text-neutral-500">
                <li>
                  <Link href="/shop?maxPrice=150000" className="hover:text-black transition-colors">
                    Under ₹1,50,000
                  </Link>
                </li>
                <li>
                  <Link href="/shop?minPrice=150000&maxPrice=250000" className="hover:text-black transition-colors">
                    ₹1,50,000 &ndash; ₹2,50,000
                  </Link>
                </li>
                <li>
                  <Link href="/shop?minPrice=250000" className="hover:text-black transition-colors">
                    ₹2,50,000 & Above
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Product Grid Area */}
          <main className="flex-1">
            {/* Top Bar Sort & Count */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-8 border-b border-[#EAEAEA] gap-4">
              <span className="text-xs uppercase tracking-widest text-neutral-500">
                Showing <strong className="text-black">{products.length}</strong> of{' '}
                <strong className="text-black">{totalCount}</strong> Timepieces
              </span>

              {/* Sorting Links */}
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-neutral-400 uppercase tracking-wider">Sort By:</span>
                <Link
                  href={`/shop?${new URLSearchParams({ ...searchParams, sort: 'newest' }).toString()}`}
                  className={`hover:text-black uppercase tracking-wider ${
                    !sort || sort === 'newest' ? 'font-semibold text-black border-b border-black' : 'text-neutral-500'
                  }`}
                >
                  Newest
                </Link>
                <Link
                  href={`/shop?${new URLSearchParams({ ...searchParams, sort: 'featured' }).toString()}`}
                  className={`hover:text-black uppercase tracking-wider ${
                    sort === 'featured' ? 'font-semibold text-black border-b border-black' : 'text-neutral-500'
                  }`}
                >
                  Featured
                </Link>
                <Link
                  href={`/shop?${new URLSearchParams({ ...searchParams, sort: 'price-asc' }).toString()}`}
                  className={`hover:text-black uppercase tracking-wider ${
                    sort === 'price-asc' ? 'font-semibold text-black border-b border-black' : 'text-neutral-500'
                  }`}
                >
                  Price: Low &rarr; High
                </Link>
                <Link
                  href={`/shop?${new URLSearchParams({ ...searchParams, sort: 'price-desc' }).toString()}`}
                  className={`hover:text-black uppercase tracking-wider ${
                    sort === 'price-desc' ? 'font-semibold text-black border-b border-black' : 'text-neutral-500'
                  }`}
                >
                  Price: High &rarr; Low
                </Link>
              </div>
            </div>

            {/* Product Grid */}
            {products.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 border border-neutral-200 space-y-4">
                <h3 className="text-base font-serif uppercase tracking-widest text-black">
                  No Timepieces Match Your Criteria
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Please adjust your filters or contact our concierge for bespoke model availability.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors"
                >
                  View All References
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product) => (
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 pt-12">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <Link
                      key={pNum}
                      href={`/shop?${new URLSearchParams({ ...searchParams, page: pNum.toString() }).toString()}`}
                      className={`w-10 h-10 flex items-center justify-center text-xs font-semibold uppercase tracking-wider border transition-colors ${
                        currentPage === pNum
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                      }`}
                    >
                      {pNum}
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
