"use client";

import Pagination from "../_components/pagination";

interface ContactLeadsPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  entityLabel?: string;
}

export default function ContactLeadsPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  entityLabel = "leads",
}: ContactLeadsPaginationProps) {
  const start =
    totalItems === 0 ? 0 : Math.min((page - 1) * pageSize + 1, totalItems);
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {start === 0 ? 0 : `${start}-${end}`} of {totalItems} {entityLabel}
      </span>
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}


