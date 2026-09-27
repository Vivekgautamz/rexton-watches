import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'The Horology Journal | REXTON WATCHES',
  description: 'Essays, technical insights, and horological heritage articles from the master watchmakers at REXTON Atelier Geneva.',
};

export default async function JournalPage() {
  const posts = await prisma.journalPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#0C0C0C] text-white py-20 px-4 border-b border-[#222222]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
            Maison Gazette
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-[0.2em] uppercase font-normal text-white">
            The Horology Journal
          </h1>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto" />
          <p className="text-xs text-neutral-400 max-w-lg mx-auto font-light leading-relaxed pt-2">
            In-depth explorations into mechanical movements, escapement physics, hand-finishing traditions, and collector perspectives.
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/journal/${post.slug}`}
              className="group block space-y-4"
            >
              <div className="relative h-80 bg-neutral-100 border border-neutral-200 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-[11px] uppercase tracking-widest text-[#C5A880] font-medium">
                  <span>{post.author}</span>
                  <span>&bull;</span>
                  <span>{post.readTime}</span>
                  <span>&bull;</span>
                  <span className="text-neutral-400">{formatDate(post.publishedAt)}</span>
                </div>

                <h2 className="text-xl font-serif font-medium text-black group-hover:text-[#C5A880] transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="pt-2 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-black group-hover:text-[#C5A880] transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
