"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Showing page 1 of 1</span>
      </div>
    );
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing page {page} of {totalPages}
      </span>
      <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => onPageChange?.(Math.max(1, page - 1))}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange?.(pageNumber)}
            className={cn(
              "h-8 w-8 rounded-lg text-sm font-medium transition",
              pageNumber === page
                ? "bg-slate-900 text-white shadow"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
