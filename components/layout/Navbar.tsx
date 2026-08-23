'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled ? 'bg-background/90 backdrop-blur-md border-b border-border' : 'bg-transparent'
        )}
      >
        <nav className="container-cinema flex h-20 items-center justify-between" aria-label="Main navigation">
          <Link href="/" className="font-display text-lg font-semibold tracking-widest2 uppercase">
            Ashiish
          </Link>

          <ul className="hidden items-center gap-10 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'text-xs uppercase tracking-widest2 text-muted transition-colors hover:text-foreground',
                    pathname === link.href && 'text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            className="hidden border border-foreground/30 px-6 py-2.5 text-xs uppercase tracking-widest2 transition-colors hover:border-accent hover:text-accent lg:inline-block"
          >
            Let&apos;s Talk
          </Link>

          <button
            className="flex flex-col gap-1.5 lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className={cn('h-px w-7 bg-foreground transition-transform', mobileOpen && 'translate-y-[7px] rotate-45')} />
            <span className={cn('h-px w-7 bg-foreground transition-opacity', mobileOpen && 'opacity-0')} />
            <span className={cn('h-px w-7 bg-foreground transition-transform', mobileOpen && '-translate-y-[7px] -rotate-45')} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && <MobileMenu links={NAV_LINKS} onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
