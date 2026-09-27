import React from 'react';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import { Ticket, Plus, Trash2 } from 'lucide-react';
import AdminCouponCreator from '@/components/AdminCouponCreator';

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#242424]">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
          Promotional Engine
        </span>
        <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
          Privilege Codes & Discounts
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List of Coupons */}
        <div className="lg:col-span-8 bg-[#141414] border border-[#242424] p-6 space-y-4">
          <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2">
            Active Privilege Codes
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#242424] text-neutral-400 uppercase tracking-wider">
                  <th className="py-2.5">Code</th>
                  <th className="py-2.5">Benefit</th>
                  <th className="py-2.5">Min Order</th>
                  <th className="py-2.5">Redemptions</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {coupons.map((coup) => (
                  <tr key={coup.id} className="hover:bg-[#1A1A1A] transition">
                    <td className="py-3 font-mono font-bold text-[#C5A880]">{coup.code}</td>
                    <td className="py-3 text-white">
                      {coup.discountType === 'PERCENTAGE'
                        ? `${coup.discountValue}% OFF`
                        : `${formatPrice(coup.discountValue)} OFF`}
                    </td>
                    <td className="py-3 text-neutral-400">
                      {coup.minOrderAmount ? formatPrice(coup.minOrderAmount) : 'None'}
                    </td>
                    <td className="py-3 text-neutral-300">
                      {coup.usageCount} {coup.usageLimit ? `/ ${coup.usageLimit}` : 'uses'}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                        coup.isActive ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40' : 'bg-red-950/60 text-red-300'
                      }`}>
                        {coup.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Coupon Form */}
        <div className="lg:col-span-4 space-y-4">
          <AdminCouponCreator />
        </div>
      </div>
    </div>
  );
}
