export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center">
      <div className="flex items-center gap-3 text-muted">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="text-xs uppercase tracking-widest2">{label}</span>
      </div>
    </div>
  );
}
