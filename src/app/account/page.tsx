import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import { ShoppingBag, Heart, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [orders, wishlistCount, addressCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { items: true },
    }),
    prisma.wishlist.count({ where: { userId: user.id } }),
    prisma.address.count({ where: { userId: user.id } }),
  ]);

  const totalSpent = orders.reduce((sum, ord) => sum + (ord.paymentStatus === 'PAID' ? Number(ord.totalAmount) : 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-serif uppercase tracking-wider text-black font-medium">
          Collector Overview
        </h2>
        <p className="text-xs text-neutral-500">
          Summary of your active acquisitions, saved references, and private delivery addresses.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FAF9F6] p-5 border border-neutral-200">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Total Acquisitions</span>
          <span className="text-2xl font-serif text-black font-medium mt-1 block">{orders.length}</span>
        </div>
        <div className="bg-[#FAF9F6] p-5 border border-neutral-200">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Acquisition Value</span>
          <span className="text-2xl font-serif text-black font-medium mt-1 block">{formatPrice(totalSpent)}</span>
        </div>
        <div className="bg-[#FAF9F6] p-5 border border-neutral-200">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Saved References</span>
          <span className="text-2xl font-serif text-black font-medium mt-1 block">{wishlistCount}</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4 pt-4 border-t border-neutral-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif uppercase tracking-wider text-black font-semibold">
            Recent Acquisitions
          </h3>
          <Link href="/account/orders" className="text-xs uppercase tracking-wider text-[#C5A880] hover:underline font-semibold flex items-center">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center bg-neutral-50 border border-neutral-200 space-y-2">
            <p className="text-xs text-neutral-500">No timepieces acquired yet.</p>
            <Link href="/shop" className="text-xs font-semibold text-black uppercase tracking-wider hover:text-[#C5A880]">
              Explore Swiss Collection &rarr;
            </Link>
          </div>
        ) : (
          <div className="border border-neutral-200 divide-y divide-neutral-200 text-xs">
            {orders.map((order) => (
              <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-black">{order.orderNumber}</span>
                    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-none ${
                      order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'CONFIRMED' ? 'bg-amber-100 text-amber-800' :
                      'bg-neutral-100 text-neutral-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    {formatDate(order.createdAt)} &bull; {order.items.length} {order.items.length === 1 ? 'Timepiece' : 'Timepieces'}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-black text-sm">
                    {formatPrice(order.totalAmount)}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="px-3 py-1.5 border border-neutral-300 text-black text-[11px] uppercase tracking-wider hover:border-black transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
