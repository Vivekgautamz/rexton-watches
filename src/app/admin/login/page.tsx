'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
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
      router.push('/admin');
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Invalid administrator credentials');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center py-16 px-4 text-white">
      <div className="max-w-md w-full bg-[#141414] border border-[#262626] shadow-2xl p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#1F1F1F] border border-[#C5A880]/40 text-[#C5A880] rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
            Authorized Personnel Only
          </span>
          <h1 className="text-2xl font-serif tracking-[0.2em] uppercase font-normal text-white">
            REXTON Atelier Portal
          </h1>
          <p className="text-xs text-neutral-400">
            Secure administration terminal for product inventory, order dispatch, and collector management.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
              Admin Email Reference
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rexton.com"
              className="w-full px-3.5 py-2.5 text-xs bg-[#1F1F1F] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
              Secret Passkey
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs bg-[#1F1F1F] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#C5A880] text-black text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Verifying Credentials...' : 'Access Admin Dashboard'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#222222] text-center text-[10px] text-neutral-500">
          Super Admin default: <code className="text-neutral-400">admin@rexton.com</code>
        </div>
      </div>
    </div>
  );
}
