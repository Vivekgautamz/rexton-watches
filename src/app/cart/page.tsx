'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShieldCheck, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidating(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), orderAmount: subtotal }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        applyCoupon(data.coupon.code, data.coupon.discountPercent || 0, data.discountAmount);
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Invalid or expired promotional code');
      }
    } catch {
      setCouponError('Error validating coupon');
    } finally {
      setIsValidating(false);
    }
  };

  const discountVal = coupon ? coupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountVal);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#FAF9F6] border-b border-[#EAEAEA] py-12 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-2">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
            Acquisition Summary
          </span>
          <h1 className="text-3xl font-serif tracking-[0.2em] uppercase text-black font-normal">
            Your Shopping Bag
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {items.length === 0 ? (
          <div className="text-center py-24 border border-neutral-200 bg-neutral-50 max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-serif uppercase tracking-widest text-black">
              Your Acquisition Bag is Empty
            </h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Select an extraordinary Swiss timepiece from our curated horological collections.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-black text-white text-xs uppercase tracking-[0.2em] hover:bg-[#C5A880] transition-colors"
            >
              Explore Timepieces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Items Table */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border border-neutral-200 divide-y divide-neutral-200">
                <div className="p-4 bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-600 hidden sm:grid sm:grid-cols-12 gap-4">
                  <div className="col-span-6">Timepiece</div>
                  <div className="col-span-2 text-center">Unit Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                {items.map((item) => (
                  <div key={item.id} className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    {/* Image & Title */}
                    <div className="sm:col-span-6 flex space-x-4 items-center">
                      <div className="relative w-24 h-24 bg-[#FAF9F6] border border-neutral-200 flex-shrink-0">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        )}
                      </div>
                      <div className="space-y-1">
                        <Link
                          href={`/product/${item.slug}`}
                          className="text-xs font-serif font-medium uppercase tracking-wider text-black hover:text-[#C5A880] transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="text-[10px] text-neutral-400">Ref SKU: {item.sku}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[11px] text-neutral-400 hover:text-red-600 flex items-center space-x-1 pt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2 sm:text-center text-xs font-medium text-black">
                      <span className="sm:hidden text-neutral-400 mr-2">Unit Price:</span>
                      {formatPrice(item.price)}
                    </div>

                    {/* Quantity */}
                    <div className="sm:col-span-2 flex sm:justify-center items-center">
                      <div className="flex items-center border border-neutral-300">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-neutral-100 text-neutral-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-neutral-100 text-neutral-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className="sm:col-span-2 sm:text-right text-sm font-semibold text-black">
                      <span className="sm:hidden text-neutral-400 mr-2">Total:</span>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 bg-[#FAF9F6] border border-neutral-200 space-y-6">
                <h3 className="text-sm font-serif uppercase tracking-widest text-black font-semibold pb-4 border-b border-neutral-200">
                  Order Summary
                </h3>

                {/* Coupon Box */}
                {coupon ? (
                  <div className="flex items-center justify-between bg-neutral-100 p-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-[#C5A880]" />
                      <span className="font-semibold">{coupon.code}</span>
                      <span className="text-neutral-500">(-{formatPrice(discountVal)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-neutral-500 hover:text-black font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promotional Code"
                      className="flex-1 px-3 py-2 text-xs uppercase bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isValidating}
                      className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider hover:bg-[#C5A880] transition-colors disabled:opacity-50"
                    >
                      {isValidating ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}

                {/* Calculation Rows */}
                <div className="space-y-2 text-xs pt-2">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between text-[#C5A880] font-medium">
                      <span>Privilege Code Discount</span>
                      <span>-{formatPrice(discountVal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Insured Swiss Transit</span>
                    <span className="text-emerald-700 font-medium">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>GST / Swiss Customs</span>
                    <span className="text-neutral-500">Included</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-black pt-4 border-t border-neutral-200">
                    <span>Total Amount</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C5A880] transition-colors flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[10px] text-center text-neutral-400 flex items-center justify-center space-x-1 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>256-bit SSL Insured Transaction</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
