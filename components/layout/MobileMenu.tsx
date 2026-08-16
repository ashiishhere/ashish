'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface MobileMenuProps {
  links: { label: string; href: string }[];
  onClose: () => void;
}

export function MobileMenu({ links, onClose }: MobileMenuProps) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col justify-center bg-background lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ul className="container-cinema flex flex-col gap-6">
        {links.map((link, i) => (
          <motion.li
            key={link.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
          >
            <Link
              href={link.href}
              onClick={onClose}
              className="font-display text-4xl uppercase tracking-wide text-foreground hover:text-accent"
            >
              {link.label}
            </Link>
          </motion.li>
        ))}
        <motion.li initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Link
            href="/contact"
            onClick={onClose}
            className="mt-4 inline-block border border-foreground/30 px-6 py-3 text-xs uppercase tracking-widest2"
          >
            Let&apos;s Talk
          </Link>
        </motion.li>
      </ul>
    </motion.div>
  );
}
