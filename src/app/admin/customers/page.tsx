import React from 'react';
import prisma from '@/lib/prisma';
import { formatDate, formatPrice } from '@/lib/utils';
import { Users, Mail, Phone, ShoppingBag } from 'lucide-react';

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        where: { paymentStatus: 'PAID' },
        select: { totalAmount: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#242424]">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
          Client Registry
        </span>
        <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
          Registered Collectors ({customers.length})
        </h1>
      </div>

      <div className="bg-[#141414] border border-[#242424] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#242424] bg-[#181818] text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Collector</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Acquisitions</th>
                <th className="py-3 px-4">Cumulative Spend</th>
                <th className="py-3 px-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {customers.map((c) => {
                const totalSpent = c.orders.reduce((sum, ord) => sum + Number(ord.totalAmount), 0);
                return (
                  <tr key={c.id} className="hover:bg-[#1A1A1A] transition">
                    <td className="py-3.5 px-4 font-serif uppercase tracking-wider text-white font-medium">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300 font-mono">{c.email}</td>
                    <td className="py-3.5 px-4 text-neutral-400">{c.phone || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-[#242424] text-[#C5A880] text-[10px] uppercase font-semibold border border-[#333333]">
                        {c.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">{c.orders.length} orders</td>
                    <td className="py-3.5 px-4 font-medium text-white">{formatPrice(totalSpent)}</td>
                    <td className="py-3.5 px-4 text-neutral-500">{formatDate(c.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
