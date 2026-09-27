import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import { ShoppingBag, Eye, Truck } from 'lucide-react';

interface AdminOrdersPageProps {
  searchParams: {
    status?: string;
  };
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status } = searchParams;

  const where: any = {};
  if (status && status !== 'ALL') {
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="space-y-8">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#242424] gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
            Fulfillment & Logistics
          </span>
          <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
            Orders Management ({orders.length})
          </h1>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 text-xs">
          {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <Link
              key={st}
              href={`/admin/orders${st === 'ALL' ? '' : `?status=${st}`}`}
              className={`px-3 py-1.5 uppercase tracking-wider transition ${
                (!status && st === 'ALL') || status === st
                  ? 'bg-[#C5A880] text-black font-semibold'
                  : 'bg-[#181818] text-neutral-400 hover:text-white border border-[#2A2A2A]'
              }`}
            >
              {st}
            </Link>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#141414] border border-[#242424] overflow-hidden">
        {orders.length === 0 ? (
          <p className="text-xs text-neutral-500 py-12 text-center">No orders match filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#242424] bg-[#181818] text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Collector</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total Settled</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {orders.map((ord) => {
                  let customerName = ord.user?.name || ord.guestName || 'Collector';
                  let customerEmail = ord.user?.email || ord.guestEmail || '';

                  return (
                    <tr key={ord.id} className="hover:bg-[#1A1A1A] transition">
                      <td className="py-3.5 px-4 font-mono font-semibold text-white">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400">{formatDate(ord.createdAt)}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-white block font-medium truncate max-w-[150px]">
                          {customerName}
                        </span>
                        <span className="text-[10px] text-neutral-500 block truncate max-w-[150px]">
                          {customerEmail}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-300">
                        {ord.items.length} {ord.items.length === 1 ? 'unit' : 'units'}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white">
                        {formatPrice(ord.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                          ord.paymentStatus === 'PAID' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40' :
                          'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        }`}>
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                          ord.status === 'DELIVERED' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40' :
                          ord.status === 'SHIPPED' ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40' :
                          ord.status === 'CONFIRMED' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' :
                          'bg-neutral-800 text-neutral-300'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="px-3 py-1 bg-[#1F1F1F] border border-[#333333] text-neutral-300 hover:text-white hover:bg-[#2A2A2A] text-[11px] uppercase tracking-wider inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
