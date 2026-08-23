import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800', '900'],
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Ashiish Dabhade — Award-Winning Filmmaker | Creative Producer | Senior Video Editor',
    template: '%s | Ashiish Dabhade',
  },
  description:
    'Ashiish Dabhade is an award-winning filmmaker, creative producer and senior video editor crafting visual stories across digital content, documentaries, branded films and independent cinema.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#161616',
              color: '#f5f5f5',
              border: '1px solid #242424',
            },
          }}
        />
      </body>
    </html>
  );
}
