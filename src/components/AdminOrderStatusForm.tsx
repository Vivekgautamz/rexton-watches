'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminOrderStatusFormProps {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
  currentTrackingNumber: string;
  currentCourierName: string;
  currentNotes: string;
}

export default function AdminOrderStatusForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
  currentTrackingNumber,
  currentCourierName,
  currentNotes,
}: AdminOrderStatusFormProps) {
  const [status, setStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber);
  const [courierName, setCourierName] = useState(currentCourierName || 'Swiss Diplomatic Courier');
  const [notes, setNotes] = useState(currentNotes);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          paymentStatus,
          trackingNumber,
          courierName,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Order record updated successfully.');
        router.refresh();
      } else {
        setErrorMsg(data.error || 'Failed to update order');
      }
    } catch {
      setErrorMsg('Network error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="bg-[#141414] border border-[#242424] p-6 space-y-4 text-xs">
      <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2">
        Fulfillment & Courier Dispatch
      </h3>

      {successMsg && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-neutral-400 uppercase tracking-wider mb-1">
          Fulfillment Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
        >
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED (Atelier Processing)</option>
          <option value="PROCESSING">PROCESSING (Movement Regulation)</option>
          <option value="SHIPPED">SHIPPED (In Armored Transit)</option>
          <option value="DELIVERED">DELIVERED (Signed & Handed Over)</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div>
        <label className="block text-neutral-400 uppercase tracking-wider mb-1">
          Payment Status
        </label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
        >
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID (Settled)</option>
          <option value="FAILED">FAILED</option>
          <option value="REFUNDED">REFUNDED</option>
        </select>
      </div>

      <div>
        <label className="block text-neutral-400 uppercase tracking-wider mb-1">
          Courier Service Name
        </label>
        <input
          type="text"
          value={courierName}
          onChange={(e) => setCourierName(e.target.value)}
          placeholder="e.g. Swiss Diplomatic Express / BlueDart Apex"
          className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
        />
      </div>

      <div>
        <label className="block text-neutral-400 uppercase tracking-wider mb-1">
          Insured Tracking Number
        </label>
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="e.g. SWISS-EXP-8890214"
          className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none font-mono"
        />
      </div>

      <div>
        <label className="block text-neutral-400 uppercase tracking-wider mb-1">
          Atelier Internal Notes
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes regarding bespoke strap sizing, gift cards, or inspection logs..."
          className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isUpdating}
        className="w-full py-3 bg-[#C5A880] text-black uppercase tracking-widest font-semibold hover:bg-white transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
      >
        <Save className="w-3.5 h-3.5" />
        <span>{isUpdating ? 'Updating Ledger...' : 'Save Fulfillment Status'}</span>
      </button>
    </form>
  );
}
