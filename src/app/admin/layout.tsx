import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import {
  LayoutDashboard,
  Watch,
  ShoppingBag,
  Users,
  Boxes,
  Ticket,
  MessageSquare,
  Layers,
  FolderTree,
  BookOpen,
  BarChart3,
  Settings,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import AdminLogoutButton from '@/components/AdminLogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If user is accessing /admin/login, allow without layout wrapping redirect loop
  // The layout will apply to /admin and subroutes
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && user.role !== 'STAFF')) {
    redirect('/admin/login');
  }

  const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Timepieces', icon: Watch },
    { href: '/admin/orders', label: 'Orders & Dispatch', icon: ShoppingBag },
    { href: '/admin/customers', label: 'Collector Registry', icon: Users },
    { href: '/admin/inventory', label: 'Stock Ledger', icon: Boxes },
    { href: '/admin/coupons', label: 'Privilege Codes', icon: Ticket },
    { href: '/admin/reviews', label: 'Moderation', icon: MessageSquare },
    { href: '/admin/collections', label: 'Collections', icon: Layers },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/journal', label: 'Journal Articles', icon: BookOpen },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#141414] border-r border-[#242424] flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo / Maison Header */}
          <div className="p-6 border-b border-[#242424] flex items-center justify-between">
            <Link href="/admin" className="block">
              <span className="text-xl font-serif tracking-[0.2em] font-normal text-white block">
                REXTON
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#C5A880] block -mt-0.5">
                Admin Console
              </span>
            </Link>
            <span className="text-[9px] px-2 py-0.5 bg-[#242424] text-[#C5A880] uppercase tracking-wider font-semibold border border-[#333333]">
              {user.role}
            </span>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-none text-neutral-400 hover:text-white hover:bg-[#1E1E1E] transition uppercase tracking-wider"
                >
                  <Icon className="w-4 h-4 text-[#C5A880]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Storefront Link */}
        <div className="p-4 border-t border-[#242424] space-y-3 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 bg-[#1A1A1A] border border-[#333333] text-neutral-300 hover:text-[#C5A880] transition"
          >
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="px-3 pt-1 flex items-center justify-between">
            <div className="truncate">
              <span className="text-white block font-medium truncate">{user.name}</span>
              <span className="text-[10px] text-neutral-500 block truncate">{user.email}</span>
            </div>
          </div>

          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 bg-[#0A0A0A] p-6 sm:p-10 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
