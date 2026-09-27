import React from 'react';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { BookOpen, Plus, Eye } from 'lucide-react';

export default async function AdminJournalPage() {
  const posts = await prisma.journalPost.findMany({
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#242424] gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
            Editorial Gazette
          </span>
          <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
            Horology Journal Articles ({posts.length})
          </h1>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#242424] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#242424] bg-[#181818] text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Read Duration</th>
                <th className="py-3 px-4">Published Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-[#1A1A1A] transition">
                  <td className="py-3.5 px-4 font-serif uppercase tracking-wider text-white font-medium max-w-sm truncate">
                    {post.title}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300">{post.author}</td>
                  <td className="py-3.5 px-4 text-neutral-400">{post.readTime}</td>
                  <td className="py-3.5 px-4 text-neutral-400">{formatDate(post.publishedAt)}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 text-[10px] uppercase font-semibold">
                      Published
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/journal/${post.slug}`}
                      target="_blank"
                      className="text-[#C5A880] hover:underline uppercase tracking-wider text-[11px]"
                    >
                      Read Live
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
