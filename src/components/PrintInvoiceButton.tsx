'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintInvoiceButton() {
  return (
    <button
      onClick={() => window.print()}
      className="w-full sm:w-auto px-6 py-3 border border-neutral-300 text-black text-xs uppercase tracking-widest hover:border-black transition-colors flex items-center justify-center space-x-2"
    >
      <Printer className="w-4 h-4" />
      <span>Print Certificate & Receipt</span>
    </button>
  );
}
