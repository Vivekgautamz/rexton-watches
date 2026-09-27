import React from 'react';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Star, MessageSquare } from 'lucide-react';
import AdminReviewActions from '@/components/AdminReviewActions';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: { select: { title: true, sku: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#242424]">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
          Client Feedback & Verification
        </span>
        <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
          Collector Appraisals ({reviews.length})
        </h1>
      </div>

      <div className="bg-[#141414] border border-[#242424] overflow-hidden">
        {reviews.length === 0 ? (
          <p className="text-xs text-neutral-500 py-12 text-center">No reviews submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#242424] bg-[#181818] text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Timepiece</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Testimonial</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-[#1A1A1A] transition">
                    <td className="py-3.5 px-4">
                      <span className="font-serif uppercase tracking-wider text-white block max-w-[180px] truncate">
                        {rev.product.title}
                      </span>
                      <span className="text-[10px] text-neutral-500">{rev.product.sku}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">{rev.authorName}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex text-[#C5A880]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < rev.rating ? 'fill-[#C5A880]' : 'text-neutral-700'}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300 max-w-xs">
                      {rev.title && <strong className="text-white block truncate">{rev.title}</strong>}
                      <p className="text-[11px] text-neutral-400 line-clamp-2">{rev.comment}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                        rev.isApproved ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40' : 'bg-amber-950/60 text-amber-300'
                      }`}>
                        {rev.isApproved ? 'Published' : 'Under Review'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <AdminReviewActions reviewId={rev.id} isApproved={rev.isApproved} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
