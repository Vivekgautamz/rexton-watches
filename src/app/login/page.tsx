'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const res = await login({ email, password });
    if (res.success) {
      router.push('/account');
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Authentication failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white border border-neutral-200 shadow-xl p-8 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
            Maison Access
          </span>
          <h1 className="text-2xl font-serif tracking-[0.15em] uppercase text-black font-normal">
            Collector Sign In
          </h1>
          <p className="text-xs text-neutral-500">
            Access your private acquisition history, registry warranty certificates, and saved addresses.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs uppercase tracking-wider text-neutral-600">
                Password *
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-neutral-500 hover:text-black uppercase tracking-wider"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C5A880] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-neutral-100 text-center space-y-3 text-xs">
          <p className="text-neutral-500">
            New to REXTON WATCHES?{' '}
            <Link href="/register" className="font-semibold text-black hover:text-[#C5A880] uppercase tracking-wider">
              Register Collector Account
            </Link>
          </p>
          <div className="text-[10px] text-neutral-400 flex items-center justify-center space-x-1 pt-2">
            <ShieldCheck className="w-3 h-3 text-[#C5A880]" />
            <span>Protected by Swiss Atelier Security Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
}
