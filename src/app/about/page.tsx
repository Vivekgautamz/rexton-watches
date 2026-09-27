import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, ShieldCheck, Sparkles, Clock, Compass, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'The Swiss Atelier & Heritage | REXTON WATCHES',
  description: 'The story of REXTON WATCHES: Swiss horology rooted in Geneva since 1928, dedicated to mechanical purity, precision column-wheel movements, and hand-finishing.',
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative h-[550px] bg-[#0C0C0C] flex items-center text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2000&q=85"
          alt="REXTON Swiss Watchmaking Atelier"
          fill
          priority
          className="object-cover object-center opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/40 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
            Geneva &bull; Est. 1928
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-[0.2em] uppercase font-normal text-white">
            The REXTON Heritage
          </h1>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto" />
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-xl mx-auto">
            A relentless pursuit of mechanical purity, hand-finished Geneva stripes, and timeless Swiss horological architecture.
          </p>
        </div>
      </section>

      {/* Origin Narrative */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#C5A880] font-semibold">
              Rooted in the Swiss Jura
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-wider text-black font-normal leading-snug">
              Three Centuries of Mechanical Equilibrium
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              Founded in the picturesque valleys of La Chaux-de-Fonds, REXTON was established with a singular manifesto: to craft timepieces that defy transient trends through pure mechanical innovation and unyielding structural integrity.
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              Every component — from our non-magnetic glucydur balance wheels to the hand-beveled anglage on our bridge plates — is executed by artisans with decades of master watchmaking experience.
            </p>
          </div>

          <div className="relative h-80 bg-neutral-100 border border-neutral-200">
            <Image
              src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
              alt="Swiss Watchmaker Precision"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="pt-12 border-t border-neutral-200">
          <div className="text-center mb-12 space-y-2">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
              The Four Cornerstones
            </span>
            <h3 className="text-2xl font-serif uppercase tracking-wider text-black font-normal">
              Horological Manifesto
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-[#FAF9F6] border border-neutral-200 space-y-2">
              <Award className="w-6 h-6 text-[#C5A880]" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-black">In-House Calibres</h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Integrated column-wheel chronographs and high-beat automatic calibres beating at 28,800 vph.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F6] border border-neutral-200 space-y-2">
              <Sparkles className="w-6 h-6 text-[#C5A880]" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-black">Hand-Finishing</h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Hand-polished mirror chamfers (anglage), Côtes de Genève stripes, and perlage graining.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F6] border border-neutral-200 space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#C5A880]" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-black">21-Day Testing</h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Every timepiece undergoes 504 consecutive hours of chronometric testing across 5 positions.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F6] border border-neutral-200 space-y-2">
              <Clock className="w-6 h-6 text-[#C5A880]" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-black">5-Year Warranty</h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Full international coverage and complimentary factory movement lubrication.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C5A880] transition"
          >
            <span>Explore The Current Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
