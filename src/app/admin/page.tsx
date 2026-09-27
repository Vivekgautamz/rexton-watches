import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  DollarSign,
  ShoppingBag,
  Watch,
  AlertTriangle,
  ArrowRight,
  Plus,
  Boxes,
  Users,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const [
    totalOrdersCount,
    paidOrders,
    productsCount,
    lowStockProducts,
    recentOrders,
    totalCustomers,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      where: { paymentStatus: 'PAID' },
      select: { totalAmount: true },
    }),
    prisma.product.count({ where: { status: 'PUBLISHED' } }),
    prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        stock: { lte: 3 },
      },
      select: { id: true, title: true, sku: true, stock: true, price: true },
      take: 5,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { items: true },
    }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
  ]);

  const totalRevenue = paidOrders.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

  return (
    <div className="space-y-10">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#242424] gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
            Executive Summary
          </span>
          <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
            Atelier Console Overview
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-[#C5A880] text-black text-xs uppercase tracking-wider font-semibold hover:bg-white transition flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Timepiece</span>
          </Link>
          <Link
            href="/admin/inventory"
            className="px-4 py-2.5 bg-[#1F1F1F] border border-[#333333] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#2A2A2A] transition flex items-center space-x-1.5"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Stock Ledger</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-[#141414] border border-[#242424] p-6 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] uppercase tracking-wider font-medium">Secured Revenue</span>
            <DollarSign className="w-4 h-4 text-[#C5A880]" />
          </div>
          <p className="text-2xl font-serif text-white font-medium">
            {formatPrice(totalRevenue)}
          </p>
          <span className="text-[10px] text-emerald-400 block font-medium">
            &bull; Settled across Razorpay & verified wires
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-[#141414] border border-[#242424] p-6 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] uppercase tracking-wider font-medium">Total Acquisitions</span>
            <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
          </div>
          <p className="text-2xl font-serif text-white font-medium">
            {totalOrdersCount}
          </p>
          <span className="text-[10px] text-neutral-500 block">
            Acquisition orders registered
          </span>
        </div>

        {/* Active Products */}
        <div className="bg-[#141414] border border-[#242424] p-6 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] uppercase tracking-wider font-medium">Active References</span>
            <Watch className="w-4 h-4 text-[#C5A880]" />
          </div>
          <p className="text-2xl font-serif text-white font-medium">
            {productsCount}
          </p>
          <span className="text-[10px] text-neutral-500 block">
            Published Swiss models
          </span>
        </div>

        {/* Low Stock Watch */}
        <div className="bg-[#141414] border border-[#242424] p-6 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] uppercase tracking-wider font-medium">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-serif text-amber-400 font-medium">
            {lowStockProducts.length}
          </p>
          <span className="text-[10px] text-neutral-500 block">
            &le; 3 units remaining
          </span>
        </div>
      </div>

      {/* Grid: Recent Orders & Stock Alert Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-[#141414] border border-[#242424] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
            <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium">
              Recent Order Inflow
            </h3>
            <Link href="/admin/orders" className="text-xs uppercase tracking-wider text-[#C5A880] hover:underline flex items-center">
              <span>All Orders</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-neutral-500 py-8 text-center">No orders recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#242424] text-neutral-400 uppercase tracking-wider">
                    <th className="py-2.5">Order Ref</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Items</th>
                    <th className="py-2.5">Amount</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F1F]">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#1A1A1A] transition">
                      <td className="py-3 font-semibold text-white">{ord.orderNumber}</td>
                      <td className="py-3 text-neutral-400">{formatDate(ord.createdAt)}</td>
                      <td className="py-3 text-neutral-300">{ord.items.length} units</td>
                      <td className="py-3 text-white font-medium">{formatPrice(ord.totalAmount)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                          ord.status === 'CONFIRMED' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' :
                          ord.status === 'SHIPPED' ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40' :
                          ord.status === 'DELIVERED' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40' :
                          'bg-neutral-800 text-neutral-300'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="text-[11px] uppercase tracking-wider text-[#C5A880] hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Warning Sidebar */}
        <div className="lg:col-span-4 bg-[#141414] border border-[#242424] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
            <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Low Stock Ledger</span>
            </h3>
            <Link href="/admin/inventory" className="text-xs uppercase tracking-wider text-[#C5A880] hover:underline">
              Adjust
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-emerald-500 py-8 text-center font-medium">
              All timepieces have sufficient atelier stock levels.
            </p>
          ) : (
            <div className="divide-y divide-[#1F1F1F] text-xs">
              {lowStockProducts.map((prod) => (
                <div key={prod.id} className="py-3 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-serif uppercase tracking-wider text-white truncate max-w-[180px]">
                      {prod.title}
                    </span>
                    <span className="px-2 py-0.5 bg-red-950/60 text-red-300 border border-red-800/40 text-[10px] font-semibold uppercase tracking-wider">
                      {prod.stock} Left
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Ref: {prod.sku}</span>
                    <span>{formatPrice(prod.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
