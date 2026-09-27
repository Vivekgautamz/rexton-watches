import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-serif uppercase tracking-wider text-black font-medium">
          Acquisition History
        </h2>
        <p className="text-xs text-neutral-500">
          Complete log of timepieces registered to your collector profile.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF9F6] border border-neutral-200 space-y-4">
          <ShoppingBag className="w-10 h-10 text-neutral-400 mx-auto" />
          <h3 className="text-sm font-serif uppercase tracking-wider text-black">
            No Acquisitions Found
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Your collector registry contains no recorded purchases.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#C5A880] transition"
          >
            Explore Timepieces
          </Link>
        </div>
      ) : (
        <div className="border border-neutral-200 divide-y divide-neutral-200 text-xs">
          {orders.map((order) => (
            <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-black text-sm">{order.orderNumber}</span>
                  <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                    order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'CONFIRMED' ? 'bg-amber-100 text-amber-800' :
                    'bg-neutral-100 text-neutral-800'
                  }`}>
                    {order.status}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                    order.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-500">
                  Ordered on {formatDate(order.createdAt)} &bull; {order.items.length} {order.items.length === 1 ? 'Timepiece' : 'Timepieces'}
                </p>

                <div className="text-neutral-600">
                  {order.items.map((it) => it.title).join(', ')}
                </div>
              </div>

              <div className="flex sm:flex-col sm:items-end justify-between items-center gap-2">
                <span className="font-semibold text-black text-base">
                  {formatPrice(order.totalAmount)}
                </span>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="px-4 py-2 bg-black text-white text-[11px] uppercase tracking-wider hover:bg-[#C5A880] transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
