import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import { CheckCircle2, ShieldCheck, Printer, ArrowRight, Clock } from 'lucide-react';
import PrintInvoiceButton from '@/components/PrintInvoiceButton';

interface OrderSuccessPageProps {
  searchParams: {
    orderNumber?: string;
  };
}

export const metadata = {
  title: 'Acquisition Confirmed | REXTON WATCHES',
};

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const { orderNumber } = searchParams;

  if (!orderNumber) {
    return notFound();
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      user: true,
    },
  });

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-2xl font-serif uppercase tracking-widest text-black">
          Order Reference Not Found
        </h1>
        <p className="text-xs text-neutral-500">
          The requested acquisition reference could not be retrieved from the atelier registry.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors"
        >
          Return to Maison
        </Link>
      </div>
    );
  }

  let shippingAddr: any = {};
  try {
    shippingAddr = JSON.parse(order.shippingAddress);
  } catch {
    shippingAddr = {};
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Receipt Card */}
        <div className="bg-white border border-neutral-200 shadow-xl p-8 sm:p-12 space-y-8 print:border-none print:shadow-none">
          {/* Header */}
          <div className="text-center pb-8 border-b border-neutral-200 space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
              Official Atelier Acquisition Receipt
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-[0.15em] uppercase font-normal text-black">
              Timepiece Acquisition Confirmed
            </h1>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Your order reference <strong className="text-black">{order.orderNumber}</strong> has been registered. Our master horologists are preparing your timepiece for dispatch.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-neutral-100 text-xs">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Date</span>
              <span className="font-medium text-black mt-0.5 block">{formatDate(order.createdAt)}</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Payment Status</span>
              <span className={`font-semibold uppercase tracking-wider mt-0.5 block ${order.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {order.paymentStatus}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Method</span>
              <span className="font-medium text-black mt-0.5 block uppercase">{order.paymentMethod}</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Insured Total</span>
              <span className="font-semibold text-black mt-0.5 block">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div className="space-y-4">
            <h3 className="text-xs font-serif uppercase tracking-widest text-black font-semibold">
              Acquisition Contents
            </h3>
            <div className="border border-neutral-200 divide-y divide-neutral-200">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-serif font-medium uppercase tracking-wide text-black">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Ref: {item.sku} &bull; Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-black">
                    {formatPrice(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Financial Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            <div className="space-y-2 text-xs">
              <h4 className="font-serif uppercase tracking-wider text-black font-semibold">
                Insured Destination
              </h4>
              <p className="text-neutral-600 leading-relaxed font-light">
                <strong className="text-black block">{shippingAddr.fullName}</strong>
                {shippingAddr.street}<br />
                {shippingAddr.city}, {shippingAddr.state} {shippingAddr.postalCode}<br />
                {shippingAddr.country}<br />
                Contact: {shippingAddr.phone}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-serif uppercase tracking-wider text-black font-semibold">
                Financial Summary
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
                  <span>Insured Express Courier</span>
                  <span className="text-emerald-700 font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-black pt-2 border-t border-neutral-200">
                  <span>Total Amount Settled</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warranty & Concierge Note */}
          <div className="p-4 bg-[#FAF9F6] border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
            <div className="flex items-center space-x-2 text-black font-medium">
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <span>5-Year Official International Movement Warranty Registered</span>
            </div>
            <p className="text-[11px] text-neutral-500 font-light">
              Your physical engraved Warranty Card, Atelier Inspection Certificate, and Chronometer certificate are enclosed within the presentation case.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <PrintInvoiceButton />

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors flex items-center justify-center space-x-2"
            >
              <span>Return to Maison</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
