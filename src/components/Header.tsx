'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, Heart, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount, openCart } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAEAEA] transition-all">
      {/* Top Banner Announcement */}
      <div className="bg-[#0D0D0D] text-[#C5A880] text-[11px] tracking-widest py-1.5 px-4 text-center uppercase font-medium flex items-center justify-center space-x-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
        <span>Complimentary Insured Express Delivery &bull; 5-Year Swiss Atelier Warranty</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-black hover:text-[#C5A880] transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8 text-[13px] tracking-widest uppercase font-medium text-neutral-800">
            <Link href="/shop" className="hover:text-[#C5A880] transition-colors">
              Timepieces
            </Link>
            <Link href="/collections" className="hover:text-[#C5A880] transition-colors">
              Collections
            </Link>
            <Link href="/shop?category=chronographs" className="hover:text-[#C5A880] transition-colors">
              Chronographs
            </Link>
            <Link href="/journal" className="hover:text-[#C5A880] transition-colors">
              Journal
            </Link>
            <Link href="/about" className="hover:text-[#C5A880] transition-colors">
              Atelier
            </Link>
          </nav>

          {/* Centered Brand Logo */}
          <div className="flex-shrink-0 text-center">
            <Link href="/" className="inline-block group">
              <span className="block text-2xl sm:text-3xl font-serif tracking-[0.25em] font-normal text-black group-hover:text-[#C5A880] transition-colors">
                REXTON
              </span>
              <span className="block text-[9px] tracking-[0.35em] text-[#888888] uppercase -mt-0.5">
                Swiss Timeless Root
              </span>
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-neutral-800">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:text-[#C5A880] transition-colors relative"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="hidden sm:inline-block p-2 hover:text-[#C5A880] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Account / Admin Link */}
            {user ? (
              <div className="relative group">
                <Link
                  href={user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'STAFF' ? '/admin' : '/account'}
                  className="p-2 flex items-center space-x-1.5 hover:text-[#C5A880] transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline text-xs font-medium uppercase tracking-wider">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-1 w-48 bg-white border border-[#EAEAEA] shadow-xl py-2 hidden group-hover:block z-50">
                  <div className="px-4 py-2 text-xs text-neutral-500 border-b border-neutral-100">
                    Signed in as <strong className="text-black block truncate">{user.email}</strong>
                  </div>
                  {user.role !== 'CUSTOMER' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#9B111E] hover:bg-neutral-50"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-xs uppercase tracking-wider hover:bg-neutral-50"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="block px-4 py-2 text-xs uppercase tracking-wider hover:bg-neutral-50"
                  >
                    Acquisition History
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-red-600 hover:bg-neutral-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 hover:text-[#C5A880] transition-colors"
                aria-label="Account Login"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="p-2 hover:text-[#C5A880] transition-colors relative"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0D0D0D] text-[#C5A880] text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Overlay */}
        {searchOpen && (
          <div className="py-4 border-t border-neutral-100 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Swiss timepieces, movements, calibres, or reference SKU..."
                className="w-full px-4 py-3 pr-12 text-sm bg-neutral-50 border border-neutral-300 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none transition"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 p-1.5 text-neutral-500 hover:text-black"
                aria-label="Submit Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-6 py-6 space-y-4">
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-widest font-medium text-neutral-900 hover:text-[#C5A880]"
          >
            All Timepieces
          </Link>
          <Link
            href="/collections"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-widest font-medium text-neutral-900 hover:text-[#C5A880]"
          >
            Curated Collections
          </Link>
          <Link
            href="/shop?category=chronographs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-widest font-medium text-neutral-900 hover:text-[#C5A880]"
          >
            Chronographs
          </Link>
          <Link
            href="/shop?category=automatic"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-widest font-medium text-neutral-900 hover:text-[#C5A880]"
          >
            Automatic Masterpieces
          </Link>
          <Link
            href="/journal"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-widest font-medium text-neutral-900 hover:text-[#C5A880]"
          >
            Horology Journal
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-widest font-medium text-neutral-900 hover:text-[#C5A880]"
          >
            The Atelier & Heritage
          </Link>
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs tracking-wider uppercase">
            <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600">
              My Account
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600">
              Concierge Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
