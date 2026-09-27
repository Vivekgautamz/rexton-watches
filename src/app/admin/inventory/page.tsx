import React from 'react';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import { Boxes, History, AlertTriangle } from 'lucide-react';
import AdminInventoryAdjuster from '@/components/AdminInventoryAdjuster';

export default async function AdminInventoryPage() {
  const [products, recentLogs] = await Promise.all([
    prisma.product.findMany({
      orderBy: { stock: 'asc' },
      select: {
        id: true,
        title: true,
        sku: true,
        stock: true,
        lowStockThreshold: true,
        price: true,
      },
    }),
    prisma.inventoryLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15,
      include: {
        product: { select: { title: true, sku: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-[#242424]">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
          Warehouse & Atelier Vault
        </span>
        <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
          Timepiece Stock Ledger
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Products Stock Table */}
        <div className="lg:col-span-8 bg-[#141414] border border-[#242424] p-6 space-y-4">
          <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2">
            Current Physical Allocation
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#242424] text-neutral-400 uppercase tracking-wider">
                  <th className="py-2.5">Timepiece</th>
                  <th className="py-2.5">SKU</th>
                  <th className="py-2.5">Units in Vault</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Instant Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1A1A1A] transition">
                    <td className="py-3 font-serif uppercase tracking-wide text-white truncate max-w-[200px]">
                      {p.title}
                    </td>
                    <td className="py-3 font-mono text-neutral-400">{p.sku}</td>
                    <td className="py-3 font-semibold text-white">{p.stock} units</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                        p.stock <= 0 ? 'bg-red-950/60 text-red-300 border border-red-800/40' :
                        p.stock <= 3 ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' :
                        'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                      }`}>
                        {p.stock <= 0 ? 'Depleted' : p.stock <= 3 ? 'Critical' : 'Healthy'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <AdminInventoryAdjuster productId={p.id} currentStock={p.stock} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log */}
        <div className="lg:col-span-4 bg-[#141414] border border-[#242424] p-6 space-y-4 text-xs">
          <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2 flex items-center space-x-2">
            <History className="w-4 h-4 text-[#C5A880]" />
            <span>Real-Time Audit Ledger</span>
          </h3>

          <div className="divide-y divide-[#1F1F1F] max-h-[600px] overflow-y-auto space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="pt-3 space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-white truncate max-w-[170px]">
                    {log.product.title}
                  </span>
                  <span className={`font-mono font-semibold ${log.changeAmount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount} units
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span className="uppercase tracking-wider">{log.reason}</span>
                  <span>{formatDate(log.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
