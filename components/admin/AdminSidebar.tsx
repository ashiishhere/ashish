'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Projects', href: '/admin/projects' },
  { label: 'Categories', href: '/admin/categories' },
  { label: 'Experience', href: '/admin/experience' },
  { label: 'Services', href: '/admin/services' },
  { label: 'Awards', href: '/admin/awards' },
  { label: 'Gallery', href: '/admin/gallery' },
  { label: 'About', href: '/admin/about' },
  { label: 'Messages', href: '/admin/messages' },
  { label: 'SEO', href: '/admin/seo' },
  { label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn('flex h-full flex-col border-r border-border bg-surface', className)}>
      <div className="border-b border-border p-6">
        <p className="font-display text-sm uppercase tracking-widest2">Ashiish Dabhade</p>
        <p className="mt-1 text-xs text-muted">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {LINKS.map((link) => {
          const active = pathname === link.href || (link.href !== '/admin' && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block px-3 py-2.5 text-sm transition-colors',
                active ? 'bg-accent text-white' : 'text-muted hover:bg-surface2 hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full px-3 py-2.5 text-left text-sm text-muted hover:bg-surface2 hover:text-foreground"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
