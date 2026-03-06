'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const GROUP_SIZE = 9;

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const groupStart = Math.floor((page - 1) / GROUP_SIZE) * GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + GROUP_SIZE - 1, totalPages);
  const pages = Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i);
  const hasNextGroup = groupEnd < totalPages;
  const hasPrevGroup = groupStart > 1;

  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {hasPrevGroup && (
        <button
          type="button"
          onClick={() => onPageChange(groupStart - 1)}
          className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ...
        </button>
      )}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`flex h-8 w-8 items-center justify-center text-sm font-medium transition-colors ${
            p === page
              ? 'bg-primary-600 text-white'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          {p}
        </button>
      ))}

      {hasNextGroup && (
        <button
          type="button"
          onClick={() => onPageChange(groupEnd + 1)}
          className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ...
        </button>
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
