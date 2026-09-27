'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Lock, CreditCard, Banknote, ArrowRight, Tag, AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { formatPrice } from '@/lib/utils';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, subtotal, coupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Sync auth user data if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  const discountVal = coupon ? coupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountVal);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        setCouponError(data.error || 'Invalid promotional code');
      }
    } catch {
      setCouponError('Error validating coupon');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your acquisition bag is empty.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Create Order on Server
      const orderPayload = {
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        shippingAddress: formData,
        couponCode: coupon?.code,
        paymentMethod,
      };

      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize order');
      }

      // 2. Handle Razorpay Gateway Flow
      if (paymentMethod === 'RAZORPAY') {
        if (!window.Razorpay) {
          throw new Error('Payment gateway SDK failed to load. Please refresh the page.');
        }

        const options = {
          key: data.keyId,
          amount: data.amount * 100,
          currency: data.currency || 'INR',
          name: 'REXTON WATCHES',
          description: `Acquisition ${data.orderNumber}`,
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80',
          order_id: data.razorpayOrderId,
          handler: async function (response: any) {
            // Verify payment on server
            const verifyRes = await fetch('/api/checkout/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentMethod: 'RAZORPAY',
                orderData: orderPayload,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              clearCart();
              router.push(`/order-success?orderNumber=${verifyData.order.orderNumber}`);
            } else {
              setErrorMessage(verifyData.error || 'Payment verification failed');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#0D0D0D',
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response: any) {
          setErrorMessage(response.error?.description || 'Payment was declined');
          setIsProcessing(false);
        });
        razorpay.open();
      } else {
        // 3. Handle Cash on Delivery / Atelier Verification Flow
        const verifyRes = await fetch('/api/checkout/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethod: 'COD',
            orderData: orderPayload,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          clearCart();
          router.push(`/order-success?orderNumber=${verifyData.order.orderNumber}`);
        } else {
          setErrorMessage(verifyData.error || 'Order placement failed');
          setIsProcessing(false);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during acquisition');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-serif uppercase tracking-widest text-black">
          Your Acquisition Bag is Empty
        </h2>
        <p className="text-xs text-neutral-500">
          Please select a timepiece before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3.5 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-[#FAF9F6] py-10 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-1">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
            Secure Atelier Transaction
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif tracking-[0.2em] uppercase text-black font-normal">
            Checkout & Acquisition
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Delivery & Payment Details */}
            <div className="lg:col-span-7 space-y-10">
              {/* 1. Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <h3 className="text-xs font-serif uppercase tracking-widest text-black font-semibold">
                    1. Collector Contact & Identification
                  </h3>
                  {!user && (
                    <Link href="/login" className="text-[11px] uppercase tracking-wider text-[#C5A880] hover:underline font-medium">
                      Already registered? Sign In
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Philippe Rexton"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                      Email Address (For Certificate & Tracking) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="collector@domain.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Direct Contact Phone Number (For Courier Verification) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                  />
                </div>
              </div>

              {/* 2. Insured Shipping Address */}
              <div className="space-y-4">
                <h3 className="text-xs font-serif uppercase tracking-widest text-black font-semibold pb-2 border-b border-neutral-200">
                  2. Insured Destination Address
                </h3>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Street Address & Villa / Suite *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Penthouse 4B, Sovereign Boulevard"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                      Landmark / Atelier Reference
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="Near Oberoi Grand"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai / New Delhi / Geneva"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                      State / Canton *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                      Postal Code / PIN *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      disabled
                      value={formData.country}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-100 border border-neutral-300 text-neutral-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="space-y-4">
                <h3 className="text-xs font-serif uppercase tracking-widest text-black font-semibold pb-2 border-b border-neutral-200">
                  3. Payment Method Selection
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Razorpay Card/UPI */}
                  <label
                    className={`flex items-start p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'RAZORPAY'
                        ? 'border-black bg-neutral-50 ring-1 ring-black'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={() => setPaymentMethod('RAZORPAY')}
                      className="mt-0.5 text-black focus:ring-black"
                    />
                    <div className="ml-3 space-y-1">
                      <span className="text-xs font-semibold text-black uppercase tracking-wider flex items-center space-x-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Razorpay Payment Gateway</span>
                      </span>
                      <p className="text-[11px] text-neutral-500">
                        Cards (Visa/Mastercard/Amex), NetBanking, UPI, EMIs. Instant verification.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery / Atelier Concierge Verification */}
                  <label
                    className={`flex items-start p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-black bg-neutral-50 ring-1 ring-black'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-0.5 text-black focus:ring-black"
                    />
                    <div className="ml-3 space-y-1">
                      <span className="text-xs font-semibold text-black uppercase tracking-wider flex items-center space-x-1.5">
                        <Banknote className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Pay on Delivery / Wire</span>
                      </span>
                      <p className="text-[11px] text-neutral-500">
                        Insured courier handover with concierge verification upon receipt.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Instant Submit */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-[#FAF9F6] border border-neutral-200 space-y-6">
                <h3 className="text-xs font-serif uppercase tracking-widest text-black font-semibold pb-4 border-b border-neutral-200">
                  Timepieces in this Acquisition ({items.length})
                </h3>

                {/* Line Items List */}
                <div className="divide-y divide-neutral-200 max-h-72 overflow-y-auto space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="pt-3 flex space-x-3 items-center">
                      <div className="relative w-14 h-14 bg-white border border-neutral-200 flex-shrink-0">
                        {item.image && (
                          <Image src={item.image} alt={item.title} fill className="object-cover" sizes="56px" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-serif font-medium uppercase tracking-wider text-black truncate">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-neutral-500">
                          Qty: {item.quantity} &bull; Ref: {item.sku}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-black">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Box */}
                {coupon ? (
                  <div className="flex items-center justify-between bg-neutral-100 p-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-[#C5A880]" />
                      <span className="font-semibold">{coupon.code}</span>
                      <span className="text-neutral-500">(-{formatPrice(discountVal)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-neutral-500 hover:text-black font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Promotional / VIP Code"
                        className="flex-1 px-3 py-2 text-xs uppercase bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon}
                        className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider hover:bg-[#C5A880] transition-colors disabled:opacity-50"
                      >
                        {isValidatingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs pt-4 border-t border-neutral-200">
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
                  <div className="flex justify-between text-base font-semibold text-black pt-4 border-t border-neutral-200">
                    <span>Total Amount Payable</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C5A880] transition-colors flex items-center justify-center space-x-2 shadow-xl disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isProcessing
                      ? 'Securing Transaction...'
                      : paymentMethod === 'RAZORPAY'
                      ? `Authorize & Pay ${formatPrice(finalTotal)}`
                      : 'Confirm Order (Pay on Delivery)'}
                  </span>
                </button>

                <div className="space-y-1 text-center pt-2">
                  <p className="text-[10px] text-neutral-400 flex items-center justify-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>256-bit Encrypted SSL &bull; 5-Year Movement Guarantee</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
