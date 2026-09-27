import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Clock, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white pt-16 pb-12 border-t border-[#222222]">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-[#222222]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <Award className="w-6 h-6 text-[#C5A880]" />
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Swiss Precision</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every movement is engineered and tested in Geneva and La Chaux-de-Fonds, Switzerland.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#C5A880]" />
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white">5-Year International Warranty</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Comprehensive movement protection and complimentary annual pressure testing.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <Clock className="w-6 h-6 text-[#C5A880]" />
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Insured Global Transit</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Fully insured door-to-door courier dispatch in armored, tamper-evident presentation boxes.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <Sparkles className="w-6 h-6 text-[#C5A880]" />
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Dedicated Concierge</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Direct access to master horologists and bespoke strap customization specialists.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand & Newsletter */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-serif tracking-[0.3em] font-normal text-white">
                REXTON
              </span>
              <span className="block text-[9px] tracking-[0.35em] text-[#C5A880] uppercase mt-0.5">
                Geneva &bull; Swiss Timeless Root
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Crafting extraordinary horological instruments for collectors who demand mechanical purity, exquisite finishing, and uncompromising resilience.
            </p>
            <div className="pt-2">
              <span className="block text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-2">
                Join the Private Collector Registry
              </span>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-[#1A1A1A] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880] flex-1"
                />
                <button className="bg-[#C5A880] text-black px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Timepieces Nav */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              Timepieces
            </h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/shop?category=chronographs" className="hover:text-[#C5A880] transition-colors">
                  Chronographs
                </Link>
              </li>
              <li>
                <Link href="/shop?category=automatic" className="hover:text-[#C5A880] transition-colors">
                  Automatic Masterpieces
                </Link>
              </li>
              <li>
                <Link href="/shop?category=dress-watches" className="hover:text-[#C5A880] transition-colors">
                  Heritage Dress
                </Link>
              </li>
              <li>
                <Link href="/shop?category=diver-editions" className="hover:text-[#C5A880] transition-colors">
                  Abyssal Divers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tourbillon" className="hover:text-[#C5A880] transition-colors">
                  Haute Tourbillons
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#C5A880] transition-colors">
                  View All References
                </Link>
              </li>
            </ul>
          </div>

          {/* Maison & Heritage */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              The Maison
            </h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/about" className="hover:text-[#C5A880] transition-colors">
                  Our Swiss Heritage
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#C5A880] transition-colors">
                  Curated Collections
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-[#C5A880] transition-colors">
                  Horology Journal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C5A880] transition-colors">
                  Boutiques & Ateliers
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#C5A880] transition-colors">
                  Warranty & Servicing FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              Concierge
            </h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/account" className="hover:text-[#C5A880] transition-colors">
                  Collector Portal
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#C5A880] transition-colors">
                  Track Acquisition
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C5A880] transition-colors">
                  Bespoke Consultation
                </Link>
              </li>
              <li>
                <span className="block text-[11px] text-neutral-500 pt-1">Direct Atelier Line:</span>
                <span className="text-xs text-[#C5A880] font-medium">+41 22 700 8900</span>
              </li>
              <li>
                <span className="block text-[11px] text-neutral-500 pt-1">Concierge Email:</span>
                <span className="text-xs text-[#C5A880] font-medium">concierge@rexton.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Security */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#1C1C1C] flex flex-col md:flex-row items-center justify-between text-[11px] text-neutral-500 space-y-4 md:space-y-0">
        <p>
          &copy; {new Date().getFullYear()} REXTON WATCHES SA. All Rights Reserved. Swiss Horology Manufacturer.
        </p>
        <div className="flex items-center space-x-6">
          <span>Razorpay Verified Merchant</span>
          <span>PCI-DSS Compliant</span>
          <span>Hostinger Cloud Node.js Infrastructure</span>
        </div>
      </div>
    </footer>
  );
}
