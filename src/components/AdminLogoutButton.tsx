'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AdminLogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/60 hover:text-white transition text-xs uppercase tracking-wider"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>End Session</span>
    </button>
  );
}
