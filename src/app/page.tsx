import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Award, Sparkles, Compass, Eye } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

export const revalidate = 300; // Cache homepage for 5 minutes, ISR

async function getFeaturedData() {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        isFeatured: true,
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 2,
        },
        category: true,
      },
      take: 4,
    });

    const collections = await prisma.collection.findMany({
      take: 3,
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const journalPosts = await prisma.journalPost.findMany({
      where: { isPublished: true },
      take: 2,
      orderBy: { publishedAt: 'desc' },
    });

    return { featuredProducts, collections, journalPosts };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return { featuredProducts: [], collections: [], journalPosts: [] };
  }
}

export default async function HomePage() {
  const { featuredProducts, collections, journalPosts } = await getFeaturedData();

  // Organization Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'REXTON WATCHES',
    url: 'https://rexton.com',
    logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    description: 'Swiss Timeless Root - High-precision luxury mechanical watches and chronographs.',
    foundingDate: '1928',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Geneva',
      addressCountry: 'Switzerland',
    },
    sameAs: [
      'https://instagram.com/rextonwatches',
      'https://twitter.com/rextonwatches',
    ],
  };

  return (
    <div className="bg-white">
      {/* JSON-LD Rich Snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0C0C0C] text-white overflow-hidden">
        {/* Ambient Dark Luxury Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/rexton-hero-banner.jpg"
            alt="REXTON Sovereign Chronograph"
            fill
            priority
            className="object-cover object-center opacity-60 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/60 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0C0C0C]/60 to-[#0C0C0C]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 border border-[#C5A880]/30 bg-[#161616]/80 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#C5A880]">
                Swiss Haute Horlogerie 2026
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif tracking-[0.15em] font-normal leading-[1.15] text-white">
              THE SOVEREIGN <br />
              <span className="italic font-light text-[#C5A880]">CHRONOGRAPH</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-xl">
              Engineered with the proprietary Calibre R-902 column-wheel movement, exhibition sapphire caseback, and hand-finished Geneva stripes. Designed for those who command eternity.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#C5A880] hover:text-white transition-all shadow-xl"
              >
                <span>Acquire Timepiece</span>
                <ArrowRight className="w-4 h-4 ml-3" />
              </Link>
              <Link
                href="/collections/sovereign-heritage"
                className="inline-flex items-center justify-center px-8 py-4 border border-neutral-600 text-white text-xs uppercase tracking-[0.25em] font-medium hover:border-[#C5A880] hover:text-[#C5A880] transition-colors"
              >
                The Sovereign Collection
              </Link>
            </div>

            {/* Micro Spec Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-neutral-800 text-[11px] text-neutral-400">
              <div>
                <span className="block text-white font-medium">70 Hours</span>
                <span>Power Reserve</span>
              </div>
              <div>
                <span className="block text-white font-medium">28,800 VPH</span>
                <span>High-Beat Escapement</span>
              </div>
              <div>
                <span className="block text-white font-medium">10 ATM / 100M</span>
                <span>Insured Depth</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED COLLECTIONS OVERVIEW */}
      <section className="py-24 bg-[#FAF9F6] border-b border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
              Curated Series
            </span>
            <h2 className="text-3xl font-serif tracking-widest uppercase text-black font-normal">
              Distinctive Swiss Lines
            </h2>
            <div className="w-12 h-0.5 bg-[#C5A880] mx-auto mt-2" />
            <p className="text-xs text-neutral-500 max-w-md mx-auto pt-2">
              From high-altitude aerodynamic chronographs to deep-sea nautical divers and ultra-thin grand complications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="group relative h-[450px] overflow-hidden bg-neutral-900 border border-neutral-200"
              >
                {col.bannerImage ? (
                  <Image
                    src={col.bannerImage}
                    alt={col.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-75 group-hover:brightness-90"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white space-y-2">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#C5A880] font-medium block">
                    {col._count.products} References
                  </span>
                  <h3 className="text-xl font-serif tracking-wider font-normal">
                    {col.name}
                  </h3>
                  <p className="text-xs text-neutral-300 font-light line-clamp-2">
                    {col.tagline || col.description}
                  </p>
                  <div className="pt-2 flex items-center text-xs font-semibold uppercase tracking-widest text-[#C5A880] group-hover:translate-x-1 transition-transform">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED MASTERPIECES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#EAEAEA]">
          <div className="space-y-2">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
              Masterpieces in Focus
            </span>
            <h2 className="text-3xl font-serif tracking-widest uppercase text-black font-normal">
              Featured Timepieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-black hover:text-[#C5A880] transition-colors"
          >
            <span>View All Models</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: Number(product.price),
                compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
              } as any}
            />
          ))}
        </div>
      </section>

      {/* 4. ATELIER HOROLOGY HIGHLIGHT */}
      <section className="py-24 bg-[#0F0F0F] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[480px] bg-neutral-900 border border-neutral-800">
              <Image
                src="/images/atelier/swiss-watchmaker.jpg"
                alt="REXTON Master Horology Calibre"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 p-4 bg-black/80 backdrop-blur-md border border-neutral-700">
                <p className="text-[11px] uppercase tracking-widest text-[#C5A880]">
                  Calibre R-902 Integrated Movement
                </p>
                <p className="text-xs text-neutral-300">
                  La Chaux-de-Fonds Atelier Certification
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
                  Mechanical Purity
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif tracking-widest uppercase text-white font-normal leading-tight">
                  Handcrafted with Zero Compromise
                </h2>
                <div className="w-12 h-0.5 bg-[#C5A880]" />
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                At the REXTON Atelier in Geneva, each timepiece undergoes rigorous testing spanning 21 consecutive days under 5 distinct temperature thresholds and 6 positions. Our master watchmakers adhere strictly to the traditional Geneva Seal finishing standards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start space-x-4">
                  <Award className="w-6 h-6 text-[#C5A880] flex-shrink-0" />
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
                      316L & 18k Rose Gold
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Forged with vacuum-annealed surgical steel and certified Swiss bullion.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Compass className="w-6 h-6 text-[#C5A880] flex-shrink-0" />
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
                      Column Wheel Precision
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Crisp, instantaneous chronograph activation with zero jump jitter.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880] hover:text-white transition-colors"
                >
                  <span>Discover the REXTON Atelier</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. JOURNAL & HOROLOGY EDITORIAL */}
      {journalPosts.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
              The Horology Journal
            </span>
            <h2 className="text-3xl font-serif tracking-widest uppercase text-black font-normal">
              Essays on Time & Craft
            </h2>
            <div className="w-12 h-0.5 bg-[#C5A880] mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {journalPosts.map((post) => (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                className="group block space-y-4"
              >
                <div className="relative h-72 bg-neutral-100 overflow-hidden border border-neutral-200">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-[11px] text-neutral-500 uppercase tracking-widest">
                    <span>{post.author}</span>
                    <span>&bull;</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-serif font-medium text-black group-hover:text-[#C5A880] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-600 line-clamp-2 font-light leading-relaxed">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-black group-hover:text-[#C5A880] transition-colors pt-2">
                    Read Article <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. CONCIERGE VIP CONSULTATION BANNER */}
      <section className="py-16 bg-[#F4F4F0] border-t border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="text-2xl font-serif tracking-[0.2em] uppercase text-black font-normal">
            Private Atelier Appointments & Concierge
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
            Our master watch specialists are available for one-on-one virtual consultations, bespoke strap fittings, and private acquisition viewings.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-black text-white text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#C5A880] transition-colors"
            >
              Book Concierge Consultation
            </Link>
            <a
              href="tel:+41227008900"
              className="px-8 py-3.5 border border-neutral-400 text-black text-xs uppercase tracking-[0.25em] font-medium hover:border-black transition-colors"
            >
              Call +41 22 700 8900
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
