import React from 'react';
import { Settings, ShieldCheck, Database, Server, CreditCard, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-6 border-b border-[#242424]">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
          Infrastructure Configuration
        </span>
        <h1 className="text-2xl font-serif uppercase tracking-wider text-white font-normal">
          Hostinger Environment & System Configuration
        </h1>
      </div>

      <div className="space-y-6 text-xs">
        {/* Hostinger & Database Card */}
        <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
          <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2 flex items-center space-x-2">
            <Server className="w-4 h-4 text-[#C5A880]" />
            <span>Hostinger Node.js & MySQL Runtime</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-300">
            <div className="bg-[#1A1A1A] p-3 border border-[#2A2A2A]">
              <span className="text-[10px] uppercase text-neutral-500 block">Database Driver</span>
              <span className="font-mono text-white mt-0.5 block">MySQL / Prisma ORM</span>
            </div>
            <div className="bg-[#1A1A1A] p-3 border border-[#2A2A2A]">
              <span className="text-[10px] uppercase text-neutral-500 block">Node.js Version</span>
              <span className="font-mono text-white mt-0.5 block">v20+ / v22+ LTS</span>
            </div>
            <div className="bg-[#1A1A1A] p-3 border border-[#2A2A2A]">
              <span className="text-[10px] uppercase text-neutral-500 block">Next.js Framework</span>
              <span className="font-mono text-white mt-0.5 block">App Router (Server Actions & Standalone)</span>
            </div>
            <div className="bg-[#1A1A1A] p-3 border border-[#2A2A2A]">
              <span className="text-[10px] uppercase text-neutral-500 block">SSL & Security Engine</span>
              <span className="font-mono text-emerald-400 mt-0.5 block">Hostinger Managed SSL / 256-bit</span>
            </div>
          </div>
        </div>

        {/* Razorpay Gateway */}
        <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
          <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2 flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-[#C5A880]" />
            <span>Razorpay Payment Gateway</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-300">
            <div className="bg-[#1A1A1A] p-3 border border-[#2A2A2A]">
              <span className="text-[10px] uppercase text-neutral-500 block">Key ID</span>
              <span className="font-mono text-white mt-0.5 block">
                {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? '••••••••' + process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.slice(-4) : 'Configured via .env'}
              </span>
            </div>
            <div className="bg-[#1A1A1A] p-3 border border-[#2A2A2A]">
              <span className="text-[10px] uppercase text-neutral-500 block">Webhook Verification</span>
              <span className="font-mono text-emerald-400 mt-0.5 block">HMAC-SHA256 Idempotent Enabled</span>
            </div>
          </div>
        </div>

        {/* Email SMTP */}
        <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
          <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2 flex items-center space-x-2">
            <Mail className="w-4 h-4 text-[#C5A880]" />
            <span>SMTP Email Dispatch</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-300">
            <div className="bg-[#1A1A1A] p-3 border border-[#2A2A2A]">
              <span className="text-[10px] uppercase text-neutral-500 block">SMTP Host</span>
              <span className="font-mono text-white mt-0.5 block">{process.env.SMTP_HOST || 'smtp.hostinger.com'}</span>
            </div>
            <div className="bg-[#1A1A1A] p-3 border border-[#2A2A2A]">
              <span className="text-[10px] uppercase text-neutral-500 block">Sender Mailbox</span>
              <span className="font-mono text-white mt-0.5 block">{process.env.EMAIL_FROM || 'concierge@rexton.com'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
