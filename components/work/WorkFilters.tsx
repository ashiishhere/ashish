'use client';

import { CATEGORY_FILTERS, cn } from '@/lib/utils';

interface WorkFiltersProps {
  active: (typeof CATEGORY_FILTERS)[number];
  onChange: (val: (typeof CATEGORY_FILTERS)[number]) => void;
}

export function WorkFilters({ active, onChange }: WorkFiltersProps) {
  return (
    <div className="mb-12 flex flex-wrap gap-3" role="tablist" aria-label="Filter projects by category">
      {CATEGORY_FILTERS.map((filter) => (
        <button
          key={filter}
          role="tab"
          aria-selected={active === filter}
          onClick={() => onChange(filter)}
          className={cn(
            'border px-4 py-2 text-xs uppercase tracking-widest2 transition-colors',
            active === filter
              ? 'border-accent bg-accent text-white'
              : 'border-border text-muted hover:border-foreground/40 hover:text-foreground'
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
