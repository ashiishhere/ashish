'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="eyebrow mb-4">Error</p>
      <h1 className="font-display text-4xl uppercase sm:text-5xl">Something Cut Out.</h1>
      <p className="mt-4 max-w-md text-muted">An unexpected error occurred while loading this page.</p>
      <Button onClick={reset} size="lg" className="mt-8">Try Again</Button>
    </div>
  );
}
