'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShieldCheck, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidatingCoupon(true);
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
      setIsValidatingCoupon(false);
    }
  };

  const discountVal = coupon ? coupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountVal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#EAEAEA] flex items-center justify-between">
            <div>
              <h2 className="text-base font-serif tracking-[0.2em] uppercase text-black font-medium">
                Your Acquisition Bag
              </h2>
              <span className="text-xs text-[#888888]">
                {items.length} {items.length === 1 ? 'Timepiece' : 'Timepieces'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-neutral-400 hover:text-black transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-medium uppercase tracking-widest text-neutral-800">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Explore our Swiss-engineered collections and select a masterpiece of timeless craftsmanship.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-4 px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors"
                >
                  Explore Timepieces
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex space-x-4 border-b border-neutral-100 pb-6">
                  <div className="relative w-20 h-20 bg-neutral-50 border border-neutral-200 flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                        REXTON
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="text-xs font-serif font-medium uppercase tracking-wider text-black hover:text-[#C5A880] transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors ml-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-400 tracking-wider mt-0.5">
                        Ref: {item.sku}
                      </p>
                      <p className="text-xs font-medium text-black mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3 mt-3">
                      <div className="flex items-center border border-neutral-300">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] text-neutral-400">
                        Total: {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#EAEAEA] bg-neutral-50/50 space-y-4">
              {/* Coupon Form */}
              {coupon ? (
                <div className="flex items-center justify-between bg-neutral-100 px-3 py-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span className="font-medium tracking-wider">{coupon.code}</span>
                    <span className="text-neutral-500">(-{formatPrice(discountVal)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-neutral-500 hover:text-black font-semibold text-xs"
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
                    placeholder="Promotional / VIP Code"
                    className="flex-1 px-3 py-2 text-xs uppercase bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isValidatingCoupon}
                    className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {isValidatingCoupon ? '...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-[#C5A880] font-medium">
                    <span>VIP Privilege Discount</span>
                    <span>-{formatPrice(discountVal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Insured Express Courier</span>
                  <span className="text-emerald-700 font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-black pt-2 border-t border-neutral-200">
                  <span>Estimated Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout & View Bag CTA */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#C5A880] transition-colors"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full block text-center py-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-black transition-colors"
                >
                  View Full Acquisition Bag
                </Link>
              </div>

              <p className="text-[10px] text-center text-neutral-400 flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-[#C5A880]" />
                <span>256-bit SSL Encrypted &bull; Razorpay Secure Gateway</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
