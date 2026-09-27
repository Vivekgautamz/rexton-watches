'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSent(true);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white border border-neutral-200 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
            Atelier Security
          </span>
          <h1 className="text-2xl font-serif tracking-[0.15em] uppercase text-black font-normal">
            Password Recovery
          </h1>
          <p className="text-xs text-neutral-500">
            Enter your registered collector email. If an account exists, a secure authorization reset link will be transmitted.
          </p>
        </div>

        {isSent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-semibold">Reset Instructions Transmitted</p>
            <p className="text-neutral-600 text-[11px]">
              Please check your inbox at <strong>{email}</strong> for instructions to restore access.
            </p>
            <div className="pt-2">
              <Link href="/login" className="text-xs uppercase font-semibold text-black hover:text-[#C5A880]">
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              className="w-full py-3.5 bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C5A880] transition-colors flex items-center justify-center space-x-2"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Recovery Link</span>
            </button>
          </form>
        )}

        <div className="text-center pt-2 text-xs">
          <Link href="/login" className="text-neutral-500 hover:text-black uppercase tracking-wider">
            &larr; Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
