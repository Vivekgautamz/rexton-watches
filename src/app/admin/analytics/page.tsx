import React from 'react';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { BarChart3, TrendingUp, Users, ShoppingBag } from 'lucide-react';

export default async function AdminAnalyticsPage() {
  const [orders, customersCount, productsCount, reviewsCount] = await Promise.all([
    prisma.order.findMany({
      include: { items: true },
    }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { status: 'PUBLISHED' } }),
    prisma.review.count({ where: { isApproved: true } }),
  ]);

  const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#242424]">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
          Performance Telemetry
        </span>
        <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
          Business & Acquisition Analytics
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#141414] border border-[#242424] p-6 space-y-2">
          <span className="text-neutral-400 text-xs uppercase tracking-wider">Gross Settlement</span>
          <p className="text-2xl font-serif text-white font-medium">{formatPrice(totalRevenue)}</p>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-6 space-y-2">
          <span className="text-neutral-400 text-xs uppercase tracking-wider">Average Acquisition Value</span>
          <p className="text-2xl font-serif text-[#C5A880] font-medium">{formatPrice(avgOrderValue)}</p>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-6 space-y-2">
          <span className="text-neutral-400 text-xs uppercase tracking-wider">Conversion Volume</span>
          <p className="text-2xl font-serif text-white font-medium">{paidOrders.length} Paid Acquisitions</p>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-6 space-y-2">
          <span className="text-neutral-400 text-xs uppercase tracking-wider">Verified Collectors</span>
          <p className="text-2xl font-serif text-white font-medium">{customersCount} Accounts</p>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
        <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2">
          Payment Method Distribution
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#1A1A1A] p-4 border border-[#2A2A2A] space-y-1">
            <span className="text-neutral-400 uppercase tracking-wider">Razorpay Gateway (Card/UPI/NetBanking)</span>
            <span className="text-lg font-bold text-white block">
              {orders.filter((o) => o.paymentMethod === 'RAZORPAY').length} Orders
            </span>
          </div>
          <div className="bg-[#1A1A1A] p-4 border border-[#2A2A2A] space-y-1">
            <span className="text-neutral-400 uppercase tracking-wider">Pay on Handover / Wire (COD)</span>
            <span className="text-lg font-bold text-white block">
              {orders.filter((o) => o.paymentMethod === 'COD').length} Orders
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
