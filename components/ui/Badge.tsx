import { cn } from '@/lib/utils';

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline';
  className?: string;
}) {
  const variants = {
    default: 'bg-surface2 text-foreground',
    accent: 'bg-accent text-white',
    outline: 'border border-border text-muted',
  };
  return (
    <span
      className={cn(
        'inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-widest2',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
