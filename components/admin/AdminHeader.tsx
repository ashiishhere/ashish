'use client';

import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';

export function AdminHeader({ title }: { title: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background px-6 py-4 lg:px-10">
      <h1 className="font-display text-xl uppercase">{title}</h1>

      <button
        className="lg:hidden"
        aria-label="Open admin menu"
        onClick={() => setMobileOpen(true)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <AdminSidebar className="relative z-50 w-72" />
        </div>
      )}
    </header>
  );
}
