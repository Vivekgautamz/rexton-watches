import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { Heart } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountWishlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const wishlistItems = await prisma.wishlist.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 2 },
          category: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-serif uppercase tracking-wider text-black font-medium">
          Saved Timepieces (Wishlist)
        </h2>
        <p className="text-xs text-neutral-500">
          Your curated selection of Swiss horological references under consideration.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF9F6] border border-neutral-200 space-y-4">
          <Heart className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-serif uppercase tracking-wider text-black">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Click the heart icon on any masterpiece to save it to your collector portfolio.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#C5A880] transition"
          >
            Explore Timepieces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <ProductCard key={item.id} product={item.product as any} />
          ))}
        </div>
      )}
    </div>
  );
}
