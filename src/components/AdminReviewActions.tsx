'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Trash2 } from 'lucide-react';

export default function AdminReviewActions({
  reviewId,
  isApproved,
}: {
  reviewId: string;
  isApproved: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggleApprove = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !isApproved }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this collector review?')) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/reviews/${reviewId}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={handleToggleApprove}
        disabled={loading}
        className={`px-2 py-1 text-[10px] uppercase font-semibold border ${
          isApproved
            ? 'border-neutral-700 text-neutral-400 hover:text-white'
            : 'border-emerald-700 bg-emerald-950/60 text-emerald-300'
        }`}
      >
        {isApproved ? 'Unpublish' : 'Approve'}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-1 text-neutral-500 hover:text-red-400"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
