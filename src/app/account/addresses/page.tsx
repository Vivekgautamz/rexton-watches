import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { MapPin, Plus, Check } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountAddressesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-serif uppercase tracking-wider text-black font-medium">
            Saved Delivery Addresses
          </h2>
          <p className="text-xs text-neutral-500">
            Secure destinations for armored transit courier dispatch.
          </p>
        </div>
      </div>

      {addresses.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF9F6] border border-neutral-200 space-y-3">
          <MapPin className="w-8 h-8 text-neutral-400 mx-auto" />
          <h3 className="text-sm font-serif uppercase tracking-wider text-black">
            No Saved Addresses
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Your destination addresses will be recorded automatically during checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-5 bg-[#FAF9F6] border border-neutral-200 space-y-2 relative">
              {addr.isDefault && (
                <span className="absolute top-4 right-4 text-[10px] bg-black text-[#C5A880] uppercase tracking-widest px-2 py-0.5 font-semibold">
                  Primary
                </span>
              )}
              <h4 className="font-serif font-medium uppercase tracking-wider text-black">{addr.fullName}</h4>
              <p className="text-neutral-600 leading-relaxed font-light">
                {addr.street}<br />
                {addr.landmark && <span>{addr.landmark}<br /></span>}
                {addr.city}, {addr.state} {addr.postalCode}<br />
                {addr.country}<br />
                Phone: {addr.phone}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
