import clsx from "clsx";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  BUYER_CATEGORIES,
  DEFAULT_BUYER_CATEGORY,
} from "@/lib/constants/buyer-categories";

type SearchParams = Record<string, string | string[] | undefined>;

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

interface BuyerQueryResult {
  buyers: BuyerRow[];
  total: number;
}

function parseStringParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }
  return value?.trim() ?? "";
}

function parsePageParam(value: string | string[] | undefined) {
  const numeric = Number.parseInt(parseStringParam(value) || "1", 10);
  return Number.isNaN(numeric) || numeric < 1 ? 1 : numeric;
}

function parsePerPageParam(value: string | string[] | undefined) {
  const numeric = Number.parseInt(parseStringParam(value) || "10", 10);
  return PER_PAGE_OPTIONS.includes(numeric as (typeof PER_PAGE_OPTIONS)[number])
    ? numeric
    : PER_PAGE_OPTIONS[0];
}

function parseCategoryParam(value: string | string[] | undefined) {
  const raw = parseStringParam(value);
  if (!raw) {
    return DEFAULT_BUYER_CATEGORY;
  }
  const match = BUYER_CATEGORIES.find(
    (category) => category.toLowerCase() === raw.toLowerCase()
  );
  return match ?? DEFAULT_BUYER_CATEGORY;
}

function escapeSearchTerm(term: string) {
  return term.replace(/[%_]/g, (match) => `\\${match}`);
}

async function getBuyersData({
  page,
  perPage,
  query,
  category,
}: {
  page: number;
  perPage: number;
  query: string;
  category: string;
}): Promise<BuyerQueryResult> {
  const supabase = createServiceRoleClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let builder = supabase
    .from("buyers_data")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (category !== DEFAULT_BUYER_CATEGORY) {
    builder = builder.eq("category", category);
  }

  if (query) {
    const escaped = escapeSearchTerm(query);
    const likeValue = `%${escaped}%`;
    builder = builder.or(
      [
        `title.ilike.${likeValue}`,
        `description.ilike.${likeValue}`,
        `buyer_from.ilike.${likeValue}`,
        `quantity.ilike.${likeValue}`,
        `destination.ilike.${likeValue}`,
        `payment_terms.ilike.${likeValue}`,
        `looking_suppliers_from.ilike.${likeValue}`,
      ].join(",")
    );
  }

  const { data, count, error } = await builder.range(from, to);

  if (error) {
    console.error("Failed to fetch buyers data:", error);
    throw new Error("Unable to load buyers data.");
  }

  return {
    buyers: (data ?? []) as BuyerRow[],
    total: count ?? 0,
  };
}

function buildQueryString(params: Record<string, string>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

function getVisiblePages(page: number, totalPages: number, max = 5) {
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
}

export const dynamic = "force-dynamic";

export default async function BuyersDataPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = parseStringParam(searchParams.query);
  const page = parsePageParam(searchParams.page);
  const perPage = parsePerPageParam(searchParams.perPage);
  const category = parseCategoryParam(searchParams.category);

  const { buyers, total } = await getBuyersData({
    page,
    perPage,
    query,
    category,
  });

  const totalPages = total === 0 ? 1 : Math.ceil(total / perPage);

  if (total > 0 && page > totalPages) {
    const qs = buildQueryString({
      query,
      perPage: String(perPage),
      page: String(totalPages),
      category,
    });
    redirect(`/admin/dashboard/buyers-data${qs}`);
  }

  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = total === 0 ? 0 : Math.min(page * perPage, total);
  const visiblePages = getVisiblePages(page, totalPages);

  const pageHref = (targetPage: number) =>
    buildQueryString({
      query,
      perPage: String(perPage),
      page: String(targetPage),
      category,
    });

  return (
    <section className="flex h-full flex-col gap-6">
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Buyers Data
            </h2>
            <p className="text-sm text-slate-500">
              Segment and manage buyer requirements for easy outreach.
            </p>
          </div>
          <form
            method="get"
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <select
              name="category"
              defaultValue={category}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-48"
            >
              {BUYER_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="search"
              name="query"
              defaultValue={query}
              placeholder="Search buyers..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-60"
            />
            <select
              name="perPage"
              defaultValue={String(perPage)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-32"
            >
              {PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} / page
                </option>
              ))}
            </select>
            <input type="hidden" name="page" value="1" />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Apply
            </button>
          </form>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden px-6 pb-6 mt-4">
          <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/admin/dashboard/buyers-data/new"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create New Buyer Data
            </Link>
          </div>
          <div className="flex-1 overflow-hidden rounded-xl border border-slate-200">
            <div className="h-full overflow-auto">
              <table className="min-w-full table-fixed border-collapse text-left text-sm text-slate-600">
                <thead className="sticky top-0 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="w-48 px-4 py-3">Title</th>
                    <th className="w-[32rem] px-4 py-3">Description</th>
                    <th className="w-32 px-4 py-3">Buyer From</th>
                    <th className="w-32 px-4 py-3">Quantity</th>
                    <th className="w-32 px-4 py-3">Destination</th>
                    <th className="w-32 px-4 py-3">Payment Terms</th>
                    <th className="w-40 px-4 py-3">Looking Suppliers From</th>
                    <th className="w-28 px-4 py-3 text-center">Status</th>
                    <th className="w-32 px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {buyers.map((buyer) => (
                    <tr key={buyer.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {buyer.title}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {buyer.description || (
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
                    </tr>
                  ))}
                  {buyers.length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-12 text-center text-slate-500"
                        colSpan={9}
                      >
                        {query || category !== DEFAULT_BUYER_CATEGORY
                          ? "No buyer data matches your filters."
                          : "No buyer data has been published yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-4">
          <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {start === 0 ? 0 : `${start}-${end}`} of {total} buyer
              requests
            </span>
            <nav className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {page > 1 ? (
                <Link
                  href={pageHref(page - 1)}
                  className="rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100"
                >
                  Prev
                </Link>
              ) : (
                <span className="rounded-lg px-3 py-1.5 text-slate-400">
                  Prev
                </span>
              )}
              {visiblePages.map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={pageHref(pageNumber)}
                  className={`h-8 w-8 rounded-lg text-center text-sm font-medium leading-8 transition ${
                    pageNumber === page
                      ? "bg-slate-900 text-white shadow"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {pageNumber}
                </Link>
              ))}
              {page < totalPages ? (
                <Link
                  href={pageHref(page + 1)}
                  className="rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-lg px-3 py-1.5 text-slate-400">
                  Next
                </span>
              )}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
