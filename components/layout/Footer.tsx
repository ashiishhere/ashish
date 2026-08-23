import Link from 'next/link';
import { db } from '@/lib/db';

async function getSocialLinks() {
  try {
    return await db.socialLink.findMany({ where: { published: true }, orderBy: { sortOrder: 'asc' } });
  } catch {
    return [];
  }
}

export async function Footer() {
  const socialLinks = await getSocialLinks();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container-cinema grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl uppercase tracking-widest2">Ashiish Dabhade</p>
          <p className="mt-3 text-sm text-muted">
            Award-Winning Filmmaker, Creative Producer &amp; Senior Video Editor.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Navigate</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li><Link href="/portfolio" className="hover:text-foreground">Portfolio</Link></li>
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><a href="mailto:ashishdabhade07@gmail.com" className="hover:text-foreground">ashishdabhade07@gmail.com</a></li>
            <li><a href="tel:+918959337707" className="hover:text-foreground">+91 89593 37707</a></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Connect</p>
          <ul className="space-y-2 text-sm text-muted">
            {socialLinks.length > 0 ? (
              socialLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                    {link.platform}
                  </a>
                </li>
              ))
            ) : (
              <>
                <li><a href="https://linkedin.com/in/ashish-dabhade" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">LinkedIn</a></li>
                <li><a href="https://linktr.ee/ashishdab" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Linktree</a></li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <p className="container-cinema text-center text-xs text-muted">
          © {year} Ashiish Dabhade. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
