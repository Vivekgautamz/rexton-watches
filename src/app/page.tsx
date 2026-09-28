import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Award, Sparkles, Compass, CheckCircle2, Clock, RotateCcw, Lock } from 'lucide-react';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60; // Refresh cache quickly during live updates

async function getHomepageData() {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
        collection: true,
      },
      orderBy: { price: 'desc' },
      take: 6,
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
  const { featuredProducts, collections, journalPosts } = await getHomepageData();

  // Curated editorial categories with REAL local watch assets
  const editorialCategories = [
    {
      title: 'Signature',
      tagline: 'Horological Flagships',
      image: '/images/products/watch-sovereign-blue-chrono.jpg',
      link: '/shop',
    },
    {
      title: 'Chronograph',
      tagline: 'Split-Second Precision',
      image: '/images/products/watch-barrel-chrono-front.jpg',
      link: '/shop?category=chronographs',
    },
    {
      title: 'Automatic',
      tagline: 'Self-Winding Kinetic Calibres',
      image: '/images/products/watch-octagon-skeleton-front.jpg',
      link: '/shop?category=automatic',
    },
    {
      title: 'Classic',
      tagline: 'Understated Elegance',
      image: '/images/products/watch-ladies-blue-dial.jpg',
      link: '/shop?category=dress-watches',
    },
    {
      title: 'Limited Edition',
      tagline: 'Rare Collector Releases',
      image: '/images/products/watch-tencel-rosegold-1.jpg',
      link: '/shop',
    },
  ];

  return (
    <div className="bg-white text-[#111111]">
      {/* 1. CINEMATIC FULL-WIDTH HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-[#0A0A0A] text-white overflow-hidden">
        {/* Background Real Watch Photo with Restrained Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/rexton-hero-banner.jpg"
            alt="REXTON Haute Horlogerie Timepiece"
            fill
            priority
            className="object-cover object-center opacity-65 scale-100 transition-transform duration-1000 ease-out"
          />
          {/* Subtle multi-layer cinematic gradient for maximum legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-[#0A0A0A]/70" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0A0A0A]/30 to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center space-y-8">
          <div className="space-y-3">
            <span className="inline-block text-[11px] sm:text-xs font-medium tracking-[0.4em] uppercase text-[#C5A880]">
              REXTON &bull; SWISS TIMELESS ROOT
            </span>
            <h1 className="text-4xl sm:text-7xl font-serif tracking-[0.15em] font-normal leading-[1.1] text-white uppercase">
              Time, Refined.
            </h1>
          </div>

          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto tracking-wide">
            Contemporary timepieces designed around precision, proportion, and timeless character. Engineered for collectors who command eternity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-9 py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#C5A880] hover:text-white transition-all shadow-xl"
            >
              Explore Watches
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-9 py-4 border border-neutral-400 text-white text-xs uppercase tracking-[0.25em] font-medium hover:border-[#C5A880] hover:text-[#C5A880] transition-colors backdrop-blur-sm"
            >
              Discover REXTON
            </Link>
          </div>

          {/* Micro Trust Indicators */}
          <div className="pt-12 flex flex-wrap items-center justify-center gap-8 text-[11px] text-neutral-400 uppercase tracking-widest border-t border-white/10 max-w-2xl mx-auto">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
              <span>5-Year Atelier Warranty</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
              <span>Complimentary Insured Courier</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
              <span>100% Certified Genuine</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL COLLECTION OVERVIEW */}
      <section className="py-24 bg-[#FAF9F7] border-b border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
              The REXTON Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif tracking-[0.15em] uppercase text-black font-normal">
              Distinctive Horological Lines
            </h2>
            <div className="w-12 h-0.5 bg-[#C5A880] mx-auto" />
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto pt-2 font-light">
              Explore our curated series — from openworked skeleton calibres to robust column-wheel chronographs.
            </p>
          </div>

          {/* 5 Distinct Categories with REAL Watch Photography */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
            {editorialCategories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.link}
                className="group flex flex-col bg-white border border-[#EAEAEA] hover:border-[#C5A880] transition-all p-4 text-center"
              >
                <div className="relative h-44 sm:h-52 w-full bg-[#F4F4F2] mb-4 overflow-hidden flex items-center justify-center p-2">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-contain p-2 group-hover:scale-108 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-serif uppercase tracking-widest text-black group-hover:text-[#C5A880] transition-colors font-medium">
                  {cat.title}
                </h3>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-light mt-1">
                  {cat.tagline}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE TIMEPIECES (FEATURED WATCHES - 3 PER ROW) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#EAEAEA]">
          <div className="space-y-2">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
              Signature Timepieces
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif tracking-[0.15em] uppercase text-black font-normal">
              The REXTON Showcase
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 inline-flex items-center text-xs font-semibold uppercase tracking-[0.25em] text-black hover:text-[#C5A880] transition-colors"
          >
            <span>View All Timepieces</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {/* 3 Products per Row Grid - The Watch Visually Dominates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* 4. THE REXTON PHILOSOPHY (BRAND STORY) */}
      <section className="py-24 bg-[#111111] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Narrative */}
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-[11px] tracking-[0.35em] uppercase text-[#C5A880] font-semibold">
                  Brand Heritage & Manifesto
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif tracking-wide uppercase text-white font-normal leading-tight">
                  The REXTON Philosophy
                </h2>
                <div className="w-14 h-0.5 bg-[#C5A880]" />
              </div>

              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                At REXTON, luxury is defined not by excess, but by absolute restraint and mechanical integrity. We believe that a true timepiece is an enduring companion — calibrated to measure moments with uncompromising accuracy and sculpted to sit with quiet confidence on the wrist.
              </p>

              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                Every line, chamfer, and sub-dial is drafted to achieve optimal legibility and tactile delight. We combine surgical-grade 316L stainless steel, titanium, and scratch-resistant sapphire crystal with high-beat movements that beat continuously in harmony with the kinetic pulse of the wearer.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-neutral-800 text-xs">
                <div>
                  <span className="text-[#C5A880] block text-base font-serif mb-1">Precision Proportion</span>
                  <span className="text-neutral-400 font-light leading-relaxed">
                    Cases engineered between 32mm and 46mm for balanced wrist ergonomics and presence.
                  </span>
                </div>
                <div>
                  <span className="text-[#C5A880] block text-base font-serif mb-1">Authentic Materials</span>
                  <span className="text-neutral-400 font-light leading-relaxed">
                    Vacuum-annealed surgical steel, FKM rubber, and anti-reflective sapphire crystal.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A880] hover:text-white transition-colors"
                >
                  <span>Read Full Brand Manifesto</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* Right Large Editorial Watch Imagery */}
            <div className="relative h-[520px] bg-neutral-900 border border-neutral-800 overflow-hidden">
              <Image
                src="/images/products/watch-sovereign-blue-chrono.jpg"
                alt="REXTON Sovereign Chronograph Craftsmanship"
                fill
                className="object-contain p-8 hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/85 backdrop-blur-md border border-neutral-700 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#C5A880] font-semibold">
                    The Sovereign Chronograph 42mm
                  </p>
                  <p className="text-xs text-neutral-300 font-light">
                    Midnight Blue Sunburst &bull; Calibre R-902
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 border border-neutral-600 px-2 py-1">
                  Atelier Ref. 4201
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CRAFTSMANSHIP: "CRAFTED FOR EVERY SECOND." */}
      <section className="py-24 bg-white border-b border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Atelier Photography */}
            <div className="relative h-[480px] bg-neutral-100 border border-neutral-200 overflow-hidden order-2 lg:order-1">
              <Image
                src="/images/atelier/swiss-watchmaker.jpg"
                alt="Swiss Master Watchmaker Atelier Workbench"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 p-4 bg-black/80 backdrop-blur-md border border-neutral-700 text-white">
                <p className="text-[11px] uppercase tracking-widest text-[#C5A880]">
                  Master Horologist Assembly
                </p>
                <p className="text-xs text-neutral-300">
                  Individual Regulation & Multi-Position Testing
                </p>
              </div>
            </div>

            {/* Narrative Content */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="space-y-3">
                <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
                  Horological Discipline
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif tracking-wide uppercase text-black font-normal leading-tight">
                  Crafted for Every Second.
                </h2>
                <div className="w-12 h-0.5 bg-[#C5A880]" />
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed font-light">
                Each REXTON watch is assembled with meticulous patience. Movement components are inspected under high magnification to verify tooth meshing, pivot tolerances, and ruby jewel seating before entering multi-position chronometric testing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="p-4 bg-[#FAF9F7] border border-neutral-200 space-y-1.5">
                  <Clock className="w-5 h-5 text-[#C5A880]" />
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-black">
                    High-Beat Escapements
                  </h4>
                  <p className="text-[12px] text-neutral-500 font-light leading-normal">
                    Frequencies up to 28,800 vph mitigate wrist vibration errors.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF9F7] border border-neutral-200 space-y-1.5">
                  <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-black">
                    Pressure Sealed
                  </h4>
                  <p className="text-[12px] text-neutral-500 font-light leading-normal">
                    Hydrostatic pressure chambers test depth resistance from 3 to 10 ATM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ON THE WRIST EXPERIENCE */}
      <section className="py-24 bg-[#FAF9F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
              Fit & Proportions
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif tracking-widest uppercase text-black font-normal">
              On The Wrist
            </h2>
            <div className="w-12 h-0.5 bg-[#C5A880]" />
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto pt-2 font-light">
              Experience how REXTON timepieces carry their presence in natural light and authentic wrist proportions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Wrist Profile 1: Barrel Skeleton */}
            <div className="bg-white border border-[#EAEAEA] p-6 space-y-4">
              <div className="relative h-80 w-full bg-[#F4F4F2] overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/watches/IMG20260906163237.jpg"
                  alt="REXTON Barrel Skeleton Chronograph on the Wrist"
                  fill
                  className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold block">
                  Shown on a 17.5cm (6.9″) wrist
                </span>
                <h4 className="text-base font-serif uppercase tracking-wider text-black">
                  Barrel Skeleton Chronograph 46mm
                </h4>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Curved tonneau case geometry wraps closely against the wrist contour, eliminating lug overhang despite its bold 46mm sport presence.
                </p>
              </div>
            </div>

            {/* Wrist Profile 2: Octagon Skeleton */}
            <div className="bg-white border border-[#EAEAEA] p-6 space-y-4">
              <div className="relative h-80 w-full bg-[#F4F4F2] overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/watches/IMG20260906164238.jpg"
                  alt="REXTON Octagon Skeleton on the Wrist"
                  fill
                  className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold block">
                  Shown on a 17.0cm (6.7″) wrist
                </span>
                <h4 className="text-base font-serif uppercase tracking-wider text-black">
                  Octagon Skeleton Automatic 44mm
                </h4>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Eight-sided beveled facets catch ambient light dynamically, pairing seamlessly with both formal tailoring and luxury sportswear.
                </p>
              </div>
            </div>

            {/* Wrist Profile 3: Apex Carbon Chrono */}
            <div className="bg-white border border-[#EAEAEA] p-6 space-y-4">
              <div className="relative h-80 w-full bg-[#F4F4F2] overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/watches/IMG20260906165502.jpg"
                  alt="REXTON Apex Carbon Chronograph on the Wrist"
                  fill
                  className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold block">
                  Shown on a 17.2cm (6.8″) wrist
                </span>
                <h4 className="text-base font-serif uppercase tracking-wider text-black">
                  Apex Carbon Chrono Black 43mm
                </h4>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Monolithic forged carbon case weighing just 54 grams. Ultra-lightweight ergonomics engineered for active and automotive lifestyles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. THE REXTON STANDARD (TRUST & POLICIES) */}
      <section className="py-20 bg-white border-y border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
              The REXTON Commitment
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif uppercase tracking-widest text-black font-normal">
              The Atelier Standard
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center sm:text-left">
            <div className="space-y-2 p-5 bg-[#FAF9F7] border border-neutral-200">
              <Award className="w-6 h-6 text-[#C5A880]" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-black">
                5-Year Atelier Warranty
              </h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Comprehensive international coverage on all mechanical movement components and factory regulation.
              </p>
            </div>

            <div className="space-y-2 p-5 bg-[#FAF9F7] border border-neutral-200">
              <ShieldCheck className="w-6 h-6 text-[#C5A880]" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-black">
                Complimentary Insured Courier
              </h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Every timepiece is shipped via discreet armored express delivery with full transit loss insurance.
              </p>
            </div>

            <div className="space-y-2 p-5 bg-[#FAF9F7] border border-neutral-200">
              <RotateCcw className="w-6 h-6 text-[#C5A880]" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-black">
                14-Day Private Returns
              </h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Inspect your timepiece at your leisure. Returns accepted in unworn original condition with security tag intact.
              </p>
            </div>

            <div className="space-y-2 p-5 bg-[#FAF9F7] border border-neutral-200">
              <Lock className="w-6 h-6 text-[#C5A880]" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-black">
                Secure Escrow & Razorpay
              </h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Bank-grade 256-bit encrypted checkout with direct UPI, Credit Card, Netbanking, and VIP wire support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOROLOGY JOURNAL */}
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

      {/* 9. VIP CONCIERGE APPOINTMENT */}
      <section className="py-20 bg-[#F4F4F0] border-t border-[#EAEAEA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="text-[11px] tracking-[0.35em] uppercase text-[#C5A880] font-semibold">
            Bespoke Service
          </span>
          <h3 className="text-3xl font-serif tracking-[0.15em] uppercase text-black font-normal">
            Private Atelier Appointments & Concierge
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
            Our horology specialists are available for one-on-one private video consultations, custom strap curation, and acquisition guidance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
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
