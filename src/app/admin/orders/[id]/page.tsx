import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import { ArrowLeft, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import AdminOrderStatusForm from '@/components/AdminOrderStatusForm';

interface AdminOrderDetailPageProps {
  params: { id: string };
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: true,
      user: true,
      payments: true,
    },
  });

  if (!order) notFound();

  let shippingAddr: any = {};
  try {
    shippingAddr = JSON.parse(order.shippingAddress);
  } catch {
    shippingAddr = {};
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Back button */}
      <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
            Acquisition Record
          </span>
          <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-neutral-400">
            Placed on {formatDate(order.createdAt)} &bull; Gateway Ref: {order.razorpayOrderId || 'N/A'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold ${
            order.status === 'DELIVERED' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' :
            order.status === 'SHIPPED' ? 'bg-blue-950/80 text-blue-300 border border-blue-800' :
            order.status === 'CONFIRMED' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' :
            'bg-neutral-800 text-neutral-300'
          }`}>
            {order.status}
          </span>
          <span className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold ${
            order.paymentStatus === 'PAID' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' :
            'bg-amber-950/80 text-amber-300 border border-amber-800'
          }`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Order Line Items & Addresses */}
        <div className="lg:col-span-7 space-y-6 text-xs">
          {/* Items */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
            <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2">
              Timepieces in Acquisition
            </h3>

            <div className="divide-y divide-[#1F1F1F]">
              {order.items.map((it) => (
                <div key={it.id} className="py-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-serif uppercase tracking-wider text-white">{it.title}</h4>
                    <p className="text-[10px] text-neutral-400">Ref: {it.sku} &bull; Qty: {it.quantity}</p>
                  </div>
                  <span className="font-semibold text-white">{formatPrice(it.total)}</span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="pt-4 border-t border-[#242424] space-y-1.5 text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-[#C5A880]">
                  <span>Promo Discount ({order.couponCode})</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-[#242424]">
                <span>Total Amount Settled</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Insured Destination Address */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-3">
            <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2">
              Insured Destination Address
            </h3>
            <p className="text-neutral-300 leading-relaxed font-light">
              <strong className="text-white block">{shippingAddr.fullName}</strong>
              {shippingAddr.street}<br />
              {shippingAddr.landmark && <span>{shippingAddr.landmark}<br /></span>}
              {shippingAddr.city}, {shippingAddr.state} {shippingAddr.postalCode}<br />
              {shippingAddr.country}<br />
              Contact Phone: <strong className="text-white">{shippingAddr.phone}</strong><br />
              Email: <strong className="text-white">{shippingAddr.email}</strong>
            </p>
          </div>
        </div>

        {/* Right Column: Status Updater & Courier Controls */}
        <div className="lg:col-span-5 space-y-6">
          <AdminOrderStatusForm
            orderId={order.id}
            currentStatus={order.status}
            currentPaymentStatus={order.paymentStatus}
            currentTrackingNumber={order.trackingNumber || ''}
            currentCourierName={order.courierName || ''}
            currentNotes={order.notes || ''}
          />
        </div>
      </div>
    </div>
  );
}
