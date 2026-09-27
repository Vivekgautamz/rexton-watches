import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import DeleteProductButton from '@/components/DeleteProductButton';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      category: true,
      collection: true,
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#242424] gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
            Timepiece Catalog
          </span>
          <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
            Swiss References ({products.length})
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-[#C5A880] text-black text-xs uppercase tracking-wider font-semibold hover:bg-white transition flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Timepiece</span>
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-[#141414] border border-[#242424] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#242424] bg-[#181818] text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Timepiece</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Acquisition Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {products.map((product) => {
                const imgUrl = product.images[0]?.url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80';
                return (
                  <tr key={product.id} className="hover:bg-[#1A1A1A] transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 bg-black border border-neutral-700 flex-shrink-0">
                          <Image src={imgUrl} alt={product.title} fill className="object-cover" sizes="40px" />
                        </div>
                        <div>
                          <span className="font-serif uppercase tracking-wider text-white block max-w-[220px] truncate">
                            {product.title}
                          </span>
                          <span className="text-[10px] text-neutral-500 block truncate">
                            {product.movement || 'Calibre'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-300">{product.sku}</td>
                    <td className="py-3 px-4 text-neutral-400">{product.category?.name || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                        product.stock <= 0 ? 'bg-red-950/60 text-red-300 border border-red-800/40' :
                        product.stock <= 3 ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' :
                        'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-white">{formatPrice(product.price)}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="p-1.5 text-neutral-400 hover:text-white transition"
                          title="View on Storefront"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-1.5 text-neutral-400 hover:text-[#C5A880] transition"
                          title="Edit Timepiece"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <DeleteProductButton productId={product.id} productTitle={product.title} />
                      </div>
                    </td>
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
