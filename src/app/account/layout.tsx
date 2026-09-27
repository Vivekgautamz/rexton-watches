import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ShoppingBag, Heart, MapPin, User, LogOut, Shield } from 'lucide-react';
import AccountLogoutButton from '@/components/AccountLogoutButton';

export const dynamic = 'force-dynamic';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
              Collector Portal
            </span>
            <h1 className="text-2xl font-serif uppercase tracking-wider text-black font-normal">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-neutral-500">
              Account ID: {user.id.slice(0, 10)} &bull; {user.email}
            </p>
          </div>

          {user.role !== 'CUSTOMER' && (
            <Link
              href="/admin"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#0D0D0D] text-[#C5A880] text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors self-start md:self-auto border border-[#C5A880]/30"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Account Nav Sidebar */}
          <aside className="md:col-span-3 space-y-1">
            <div className="bg-white border border-neutral-200 divide-y divide-neutral-100">
              <Link
                href="/account"
                className="flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-black font-medium transition"
              >
                <User className="w-4 h-4 text-[#C5A880]" />
                <span>Overview</span>
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-black font-medium transition"
              >
                <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                <span>Acquisitions</span>
              </Link>
              <Link
                href="/account/wishlist"
                className="flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-black font-medium transition"
              >
                <Heart className="w-4 h-4 text-[#C5A880]" />
                <span>Wishlist</span>
              </Link>
              <Link
                href="/account/addresses"
                className="flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-black font-medium transition"
              >
                <MapPin className="w-4 h-4 text-[#C5A880]" />
                <span>Saved Addresses</span>
              </Link>
              <Link
                href="/account/profile"
                className="flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-black font-medium transition"
              >
                <User className="w-4 h-4 text-[#C5A880]" />
                <span>Collector Profile</span>
              </Link>
              <div className="p-2">
                <AccountLogoutButton />
              </div>
            </div>
          </aside>

          {/* Main Account Content Area */}
          <main className="md:col-span-9 bg-white border border-neutral-200 p-6 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
