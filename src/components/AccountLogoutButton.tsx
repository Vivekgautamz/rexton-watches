'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AccountLogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className="w-full flex items-center space-x-3 px-3 py-2 text-xs uppercase tracking-wider text-red-600 hover:bg-red-50 font-medium transition"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  );
}
