'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, ArrowRight, AlertCircle, UserCheck } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const res = await register({ name, email, password, phone });
    if (res.success) {
      router.push('/account');
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Registration failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-[85vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white border border-neutral-200 shadow-xl p-8 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
            Join The Maison
          </span>
          <h1 className="text-2xl font-serif tracking-[0.15em] uppercase text-black font-normal">
            Collector Registration
          </h1>
          <p className="text-xs text-neutral-500">
            Create an official account to track your timepieces, register international warranties, and receive private release previews.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lord Julian Sterling"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="collector@domain.com"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
              Master Password (Min. 6 Characters) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C5A880] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 pt-2"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Registering...' : 'Create Collector Registry'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-neutral-100 text-center space-y-3 text-xs">
          <p className="text-neutral-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-black hover:text-[#C5A880] uppercase tracking-wider">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
