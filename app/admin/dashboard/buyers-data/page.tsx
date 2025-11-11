'use client';

import clsx from "clsx";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  BUYER_CATEGORIES,
  DEFAULT_BUYER_CATEGORY,
  type BuyerCategory,
} from "@/lib/constants/buyer-categories";

const PER_PAGE_OPTIONS = [10, 25, 50] as const;
const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

interface BuyerRow {
  id: string;
  category: string;
  title: string;
  description: string | null;
  buyer_from: string | null;
  quantity: string | null;
  destination: string | null;
  payment_terms: string | null;
  looking_suppliers_from: string | null;
  status: string | null;
  created_at: string;
}

interface BuyersResponse {
  success: boolean;
  data: BuyerRow[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

export default function BuyersDataPage() {
  const [buyers, setBuyers] = useState<BuyerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(DEFAULT_BUYER_CATEGORY);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch buyers data from API with real-time search
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          perPage: perPage.toString(),
          activeOnly: 'false', // Admin can see all statuses
        });
        
        if (searchQuery.trim()) {
          params.set('query', searchQuery.trim());
        }
        
        if (category !== DEFAULT_BUYER_CATEGORY) {
          params.set('category', category);
        }
        
        const response = await fetch(`/api/buyers-data?${params.toString()}`);
        const result: BuyersResponse = await response.json();
        
        if (result.success && result.data) {
          setBuyers(result.data);
          setTotal(result.pagination.total);
          setTotalPages(result.pagination.totalPages);
        }
      } catch (error) {
        console.error('Failed to fetch buyers:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search - wait 300ms after user stops typing
    const timeoutId = setTimeout(() => {
      fetchBuyers();
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, category, perPage, currentPage]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category, perPage]);

  const getVisiblePages = (page: number, totalPages: number, max = 5) => {
    if (totalPages <= max) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const half = Math.floor(max / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + max - 1);

    if (end - start + 1 < max) {
      start = Math.max(1, end - max + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  const visiblePages = getVisiblePages(currentPage, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = total === 0 ? 0 : Math.min(currentPage * perPage, total);

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/buyers-data?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result?.message || "Failed to delete buyer data.");
        return;
      }

      // Refresh the list
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: perPage.toString(),
        activeOnly: 'false',
      });
      
      if (searchQuery.trim()) {
        params.set('query', searchQuery.trim());
      }
      
      if (category !== DEFAULT_BUYER_CATEGORY) {
        params.set('category', category);
      }
      
      const fetchResponse = await fetch(`/api/buyers-data?${params.toString()}`);
      const fetchResult: BuyersResponse = await fetchResponse.json();
      
      if (fetchResult.success && fetchResult.data) {
        setBuyers(fetchResult.data);
        setTotal(fetchResult.pagination.total);
        setTotalPages(fetchResult.pagination.totalPages);
      }

      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting buyer:", error);
      alert("An error occurred while deleting buyer data.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="flex h-full flex-col gap-6">
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-6">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              Buyers Data
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Segment and manage buyer requirements for easy outreach.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BuyerCategory)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-48"
            >
              {BUYER_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search buyers..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-60"
            />
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-32"
            >
              {PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} / page
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden px-4 sm:px-6 pb-4 sm:pb-6 mt-4">
          <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/admin/dashboard/buyers-data/new"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create New Buyer Data
            </Link>
            {searchQuery && !loading && (
              <p className="text-xs sm:text-sm text-slate-600">
                Found {total} result{total !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-600">Loading buyers data...</p>
              </div>
            ) : buyers.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                {searchQuery || category !== DEFAULT_BUYER_CATEGORY
                  ? "No buyer data matches your filters."
                  : "No buyer data has been published yet."}
              </div>
            ) : (
              buyers.map((buyer) => (
                <div
                  key={buyer.id}
                  className="bg-white rounded-lg border border-slate-200 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 text-sm truncate">
                        {buyer.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {DATE_FORMAT.format(new Date(buyer.created_at))}
                      </p>
                    </div>
                    <span
                      className={clsx(
                        "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold shrink-0",
                        buyer.status?.toLowerCase() === "active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {buyer.status ?? "Inactive"}
                    </span>
                  </div>
                  
                  {buyer.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {buyer.description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {buyer.buyer_from && (
                      <div>
                        <span className="text-slate-500">Buyer From:</span>
                        <span className="text-slate-900 ml-1">{buyer.buyer_from}</span>
                      </div>
                    )}
                    {buyer.quantity && (
                      <div>
                        <span className="text-slate-500">Quantity:</span>
                        <span className="text-slate-900 ml-1">{buyer.quantity}</span>
                      </div>
                    )}
                    {buyer.destination && (
                      <div>
                        <span className="text-slate-500">Destination:</span>
                        <span className="text-slate-900 ml-1">{buyer.destination}</span>
                      </div>
                    )}
                    {buyer.payment_terms && (
                      <div>
                        <span className="text-slate-500">Payment:</span>
                        <span className="text-slate-900 ml-1">{buyer.payment_terms}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <Link
                      href={`/admin/dashboard/buyers-data/${buyer.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
                    >
                      Edit
                    </Link>
                    {deleteConfirm === buyer.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(buyer.id)}
                          disabled={deletingId === buyer.id}
                          className="flex-1 inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === buyer.id ? "Deleting..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          disabled={deletingId === buyer.id}
                          className="flex-1 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(buyer.id)}
                        disabled={deletingId === buyer.id}
                        className="flex-1 inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block flex-1 overflow-hidden rounded-xl border border-slate-200">
            <div className="h-full overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-slate-600">Loading buyers data...</p>
                </div>
              ) : (
                <table className="min-w-full border-collapse text-left text-sm text-slate-600">
                  <thead className="sticky top-0 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="min-w-[200px] px-4 py-3">Title</th>
                      <th className="min-w-[300px] max-w-md px-4 py-3">Description</th>
                      <th className="min-w-[120px] px-4 py-3">Buyer From</th>
                      <th className="min-w-[120px] px-4 py-3">Quantity</th>
                      <th className="min-w-[120px] px-4 py-3">Destination</th>
                      <th className="min-w-[140px] px-4 py-3">Payment Terms</th>
                      <th className="min-w-[160px] px-4 py-3">Looking Suppliers From</th>
                      <th className="min-w-[100px] px-4 py-3 text-center">Status</th>
                      <th className="min-w-[140px] px-4 py-3">Created</th>
                      <th className="min-w-[140px] px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {buyers.map((buyer) => (
                      <tr key={buyer.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {buyer.title}
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-md">
                          {buyer.description ? (
                            <span className="line-clamp-2" title={buyer.description}>
                              {buyer.description}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {buyer.buyer_from || (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {buyer.quantity || (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {buyer.destination || (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {buyer.payment_terms || (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {buyer.looking_suppliers_from || (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={clsx(
                              "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold",
                              buyer.status?.toLowerCase() === "active"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-500"
                            )}
                          >
                            {buyer.status ?? "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {DATE_FORMAT.format(new Date(buyer.created_at))}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/admin/dashboard/buyers-data/${buyer.id}/edit`}
                              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
                            >
                              Edit
                            </Link>
                            {deleteConfirm === buyer.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(buyer.id)}
                                  disabled={deletingId === buyer.id}
                                  className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {deletingId === buyer.id ? "Deleting..." : "Confirm"}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  disabled={deletingId === buyer.id}
                                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(buyer.id)}
                                disabled={deletingId === buyer.id}
                                className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {buyers.length === 0 && !loading && (
                      <tr>
                        <td
                          className="px-4 py-12 text-center text-slate-500"
                          colSpan={10}
                        >
                          {searchQuery || category !== DEFAULT_BUYER_CATEGORY
                            ? "No buyer data matches your filters."
                            : "No buyer data has been published yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 text-xs sm:text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {start === 0 ? 0 : `${start}-${end}`} of {total} buyer
              requests
            </span>
            {totalPages > 1 && (
              <nav className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm overflow-x-auto">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Prev
                </button>
                {visiblePages.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-center text-xs sm:text-sm font-medium leading-7 sm:leading-8 transition whitespace-nowrap ${
                      pageNumber === currentPage
                        ? "bg-slate-900 text-white shadow"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Next
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
