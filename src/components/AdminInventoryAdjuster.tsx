'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus } from 'lucide-react';

export default function AdminInventoryAdjuster({
  productId,
  currentStock,
}: {
  productId: string;
  currentStock: number;
}) {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const router = useRouter();

  const handleAdjust = async (amount: number) => {
    setIsAdjusting(true);
    try {
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          changeAmount: amount,
          reason: amount > 0 ? 'RESTOCK_VAULT' : 'DEFECT_REMOVAL',
        }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch {
      alert('Error adjusting stock');
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="inline-flex items-center space-x-1">
      <button
        onClick={() => handleAdjust(-1)}
        disabled={isAdjusting || currentStock <= 0}
        className="p-1 bg-[#222222] text-neutral-300 hover:text-white hover:bg-red-950/60 border border-neutral-700 disabled:opacity-30"
        title="Decrease stock by 1"
      >
        <Minus className="w-3 h-3" />
      </button>
      <button
        onClick={() => handleAdjust(1)}
        disabled={isAdjusting}
        className="p-1 bg-[#222222] text-neutral-300 hover:text-white hover:bg-emerald-950/60 border border-neutral-700 disabled:opacity-30"
        title="Add 1 to stock"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
