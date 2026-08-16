import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-4xl uppercase sm:text-5xl">Frame Not Found.</h1>
      <p className="mt-4 max-w-md text-muted">
        The story you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Button href="/" size="lg" className="mt-8">Back to Home</Button>
    </div>
  );
}
