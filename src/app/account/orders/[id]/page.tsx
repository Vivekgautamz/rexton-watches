import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import { ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import PrintInvoiceButton from '@/components/PrintInvoiceButton';

export const dynamic = 'force-dynamic';

interface OrderDetailProps {
  params: { id: string };
}

export default async function AccountOrderDetailPage({ params }: OrderDetailProps) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order || order.userId !== user.id) {
    notFound();
  }

  let shippingAddr: any = {};
  try {
    shippingAddr = JSON.parse(order.shippingAddress);
  } catch {
    shippingAddr = {};
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <Link
          href="/account/orders"
          className="inline-flex items-center text-xs uppercase tracking-wider text-neutral-500 hover:text-black font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to All Acquisitions</span>
        </Link>
        <PrintInvoiceButton />
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-serif uppercase tracking-wider text-black font-medium">
            Acquisition #{order.orderNumber}
          </h2>
          <span className={`px-2.5 py-1 text-xs uppercase tracking-wider font-semibold ${
            order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
            'bg-amber-100 text-amber-800'
          }`}>
            Status: {order.status}
          </span>
        </div>
        <p className="text-xs text-neutral-500">
          Placed on {formatDate(order.createdAt)} &bull; Payment: {order.paymentMethod} ({order.paymentStatus})
        </p>
      </div>

      {/* Tracking info if available */}
      {order.trackingNumber && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center space-x-3">
          <Truck className="w-5 h-5 text-blue-700 flex-shrink-0" />
          <div>
            <span className="font-semibold block">Insured Transit Courier Tracking</span>
            <span>Courier: {order.courierName || 'Swiss Diplomatic Express'} &bull; Tracking Ref: <strong>{order.trackingNumber}</strong></span>
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="border border-neutral-200 divide-y divide-neutral-200 text-xs">
        <div className="p-4 bg-[#FAF9F6] font-semibold uppercase tracking-wider text-neutral-700 grid grid-cols-12">
          <div className="col-span-8">Timepiece Reference</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-right">Total</div>
        </div>

        {order.items.map((item) => (
          <div key={item.id} className="p-4 grid grid-cols-12 items-center">
            <div className="col-span-8 space-y-0.5">
              <h4 className="font-serif font-medium uppercase tracking-wide text-black">{item.title}</h4>
              <p className="text-[10px] text-neutral-400">Ref SKU: {item.sku}</p>
            </div>
            <div className="col-span-2 text-center font-medium">{item.quantity}</div>
            <div className="col-span-2 text-right font-semibold text-black">{formatPrice(item.total)}</div>
          </div>
        ))}
      </div>

      {/* Shipping and Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
        <div className="p-4 bg-[#FAF9F6] border border-neutral-200 space-y-2 text-xs">
          <h4 className="font-serif uppercase tracking-wider text-black font-semibold">
            Insured Destination Address
          </h4>
          <p className="text-neutral-600 leading-relaxed font-light">
            <strong className="text-black block">{shippingAddr.fullName}</strong>
            {shippingAddr.street}<br />
            {shippingAddr.city}, {shippingAddr.state} {shippingAddr.postalCode}<br />
            {shippingAddr.country}<br />
            Phone: {shippingAddr.phone}
          </p>
        </div>

        <div className="p-4 bg-[#FAF9F6] border border-neutral-200 space-y-2 text-xs">
          <h4 className="font-serif uppercase tracking-wider text-black font-semibold">
            Settlement Summary
          </h4>
          <div className="space-y-1 text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between text-[#C5A880] font-medium">
                <span>Privilege Code Discount</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Insured Transit</span>
              <span className="text-emerald-700 font-medium">Complimentary</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-black pt-2 border-t border-neutral-300">
              <span>Total Settled</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
