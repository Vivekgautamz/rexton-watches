import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-lg font-serif uppercase tracking-wider text-black font-medium">
          Collector Profile
        </h2>
        <p className="text-xs text-neutral-500">
          Your credentials and Swiss atelier membership record.
        </p>
      </div>

      <div className="bg-[#FAF9F6] border border-neutral-200 p-6 space-y-4 text-xs">
        <div className="flex items-center space-x-3 pb-4 border-b border-neutral-200">
          <div className="w-12 h-12 bg-black text-[#C5A880] flex items-center justify-center font-serif text-lg font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-serif text-sm uppercase tracking-wider text-black font-semibold">
              {user.name}
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
              {user.role} Member
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Registered Email</span>
            <span className="font-medium text-black mt-0.5 block">{user.email}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Direct Telephone</span>
            <span className="font-medium text-black mt-0.5 block">{user.phone || 'Not Provided'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Atelier Member Since</span>
            <span className="font-medium text-black mt-0.5 block">
              {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Account Status</span>
            <span className="font-semibold text-emerald-700 mt-0.5 block uppercase tracking-wider">Active & Verified</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-[#C5A880] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          For security protocols regarding luxury timepiece ownership certificates, alterations to primary legal names and emails require concierge verification. Contact <strong className="text-black">concierge@rexton.com</strong>.
        </p>
      </div>
    </div>
  );
}
