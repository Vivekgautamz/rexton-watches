'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Ticket } from 'lucide-react';

export default function AdminCouponCreator() {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrderAmount, setMinOrderAmount] = useState('50000');
  const [maxDiscount, setMaxDiscount] = useState('25000');
  const [usageLimit, setUsageLimit] = useState('100');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discountType,
          discountValue,
          minOrderAmount,
          maxDiscount,
          usageLimit,
        }),
      });

      if (res.ok) {
        setCode('');
        router.refresh();
      } else {
        alert('Failed to generate coupon code');
      }
    } catch {
      alert('Error creating coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleCreate} className="bg-[#141414] border border-[#242424] p-6 space-y-4 text-xs">
      <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2 flex items-center space-x-2">
        <Ticket className="w-4 h-4 text-[#C5A880]" />
        <span>Create Privilege Code</span>
      </h3>

      <div>
        <label className="block text-neutral-400 uppercase tracking-wider mb-1">
          Code String *
        </label>
        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. VIPEXCLUSIVE20"
          className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white uppercase font-mono focus:border-[#C5A880] outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-neutral-400 uppercase tracking-wider mb-1">
            Type
          </label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
          >
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Fixed Amount (₹)</option>
          </select>
        </div>
        <div>
          <label className="block text-neutral-400 uppercase tracking-wider mb-1">
            Value *
          </label>
          <input
            type="number"
            required
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-neutral-400 uppercase tracking-wider mb-1">
            Min Order (₹)
          </label>
          <input
            type="number"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
            className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
          />
        </div>
        <div>
          <label className="block text-neutral-400 uppercase tracking-wider mb-1">
            Max Cap (₹)
          </label>
          <input
            type="number"
            value={maxDiscount}
            onChange={(e) => setMaxDiscount(e.target.value)}
            className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-[#C5A880] text-black uppercase tracking-widest font-semibold hover:bg-white transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{isSubmitting ? 'Generating...' : 'Issue Code'}</span>
      </button>
    </form>
  );
}
