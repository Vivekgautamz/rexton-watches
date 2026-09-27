import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react';

interface JournalDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: JournalDetailPageProps) {
  const post = await prisma.journalPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return { title: 'Article Not Found | REXTON' };

  return {
    title: `${post.title} | REXTON Horology Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function JournalDetailPage({ params }: JournalDetailPageProps) {
  const post = await prisma.journalPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) notFound();

  // Fetch other articles
  const otherPosts = await prisma.journalPost.findMany({
    where: {
      isPublished: true,
      id: { not: post.id },
    },
    take: 2,
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Article Header */}
      <div className="border-b border-neutral-200 bg-[#FAF9F6] py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link
            href="/journal"
            className="inline-flex items-center text-xs uppercase tracking-wider text-neutral-500 hover:text-black font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to Journal</span>
          </Link>

          <div className="space-y-3">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
              Horology Editorial
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-normal uppercase tracking-wide text-black leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center space-x-4 text-xs text-neutral-500 pt-2">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{post.author}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{post.readTime}</span>
              </span>
              <span>&bull;</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative h-[450px] bg-neutral-100 border border-neutral-200 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="prose prose-neutral max-w-none text-neutral-700 text-sm sm:text-base leading-relaxed font-light whitespace-pre-line">
          {post.content}
        </div>

        {/* Author Bio Box */}
        <div className="p-6 bg-[#FAF9F6] border border-neutral-200 flex items-center space-x-4 mt-12">
          <div className="w-12 h-12 bg-black text-[#C5A880] flex items-center justify-center font-serif text-lg font-bold flex-shrink-0">
            R
          </div>
          <div className="space-y-1">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-black">
              {post.author}
            </h4>
            <p className="text-xs text-neutral-500 font-light">
              Published by the REXTON Atelier Horological Research Division, Geneva, Switzerland.
            </p>
          </div>
        </div>
      </article>

      {/* Other Posts */}
      {otherPosts.length > 0 && (
        <div className="border-t border-neutral-200 bg-[#FAF9F6] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h3 className="text-lg font-serif uppercase tracking-widest text-black text-center font-normal">
              Further Horological Inquiries
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {otherPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/journal/${p.slug}`}
                  className="group bg-white p-6 border border-neutral-200 block space-y-3"
                >
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                    {p.readTime}
                  </span>
                  <h4 className="text-sm font-serif font-medium uppercase tracking-wider text-black group-hover:text-[#C5A880] transition-colors line-clamp-2">
                    {p.title}
                  </h4>
                  <p className="text-xs text-neutral-500 font-light line-clamp-2">
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
