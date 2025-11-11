import Link from "next/link";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";

type SearchParams = Record<string, string | string[] | undefined>;

const PER_PAGE_OPTIONS = [10, 25, 50] as const;
const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

interface LeadRow {
  id: string;
  name: string;
  email: string;
  contact: string | null;
  subject: string | null;
  message: string | null;
  created_at: string;
}

interface LeadQueryResult {
  leads: LeadRow[];
  total: number;
}

export const dynamic = "force-dynamic";

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

function escapeSearchTerm(term: string) {
  return term.replace(/[%_]/g, (match) => `\\${match}`);
}

async function getContactLeads({
  page,
  perPage,
  query,
}: {
  page: number;
  perPage: number;
  query: string;
}): Promise<LeadQueryResult> {
  const supabase = createServiceRoleClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let builder = supabase
    .from("contact_leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (query) {
    const escaped = escapeSearchTerm(query);
    const likeValue = `%${escaped}%`;
    builder = builder.or(
      [
        `name.ilike.${likeValue}`,
        `email.ilike.${likeValue}`,
        `contact.ilike.${likeValue}`,
        `subject.ilike.${likeValue}`,
        `message.ilike.${likeValue}`,
      ].join(",")
    );
  }

  const { data, count, error } = await builder.range(from, to);

  if (error) {
    console.error("Failed to fetch contact leads:", error);
    throw new Error("Unable to load contact leads.");
  }

  return {
    leads: (data ?? []) as LeadRow[],
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

export default async function ContactLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = parseStringParam(searchParams.query);
  const page = parsePageParam(searchParams.page);
  const perPage = parsePerPageParam(searchParams.perPage);

  const { leads, total } = await getContactLeads({ page, perPage, query });

  const totalPages = total === 0 ? 1 : Math.ceil(total / perPage);

  if (total > 0 && page > totalPages) {
    const qs = buildQueryString({
      query,
      perPage: String(perPage),
      page: String(totalPages),
    });
    redirect(`/admin/dashboard/contact-leads${qs}`);
  }

  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = total === 0 ? 0 : Math.min(page * perPage, total);
  const visiblePages = getVisiblePages(page, totalPages);

  const pageHref = (targetPage: number) =>
    buildQueryString({
      query,
      perPage: String(perPage),
      page: String(targetPage),
    });

  return (
    <section className="flex h-full flex-col gap-6">
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-6">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              Contact Leads
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              View recent inquiries from potential buyers.
            </p>
          </div>
          <form
            method="get"
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <input
              type="search"
              name="query"
              defaultValue={query}
              placeholder="Search leads..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-60"
            />
            <select
              name="perPage"
              defaultValue={String(perPage)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-32"
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
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Apply
            </button>
          </form>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Mobile Card View */}
          <div className="lg:hidden mt-4 space-y-4">
            {leads.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                {query
                  ? "No leads match your search."
                  : "No leads have been submitted yet."}
              </div>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-lg border border-slate-200 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 text-sm">
                        {lead.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 break-all">
                        {lead.email}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 shrink-0">
                      {DATE_FORMAT.format(new Date(lead.created_at))}
                    </p>
                  </div>
                  
                  {lead.contact && (
                    <div className="text-xs">
                      <span className="text-slate-500">Contact:</span>
                      <span className="text-slate-900 ml-1">{lead.contact}</span>
                    </div>
                  )}
                  
                  {lead.subject && (
                    <div className="text-xs">
                      <span className="text-slate-500 font-medium">Subject:</span>
                      <span className="text-slate-900 ml-1">{lead.subject}</span>
                    </div>
                  )}
                  
                  {lead.message && (
                    <div className="text-xs">
                      <span className="text-slate-500 font-medium">Message:</span>
                      <p className="text-slate-900 mt-1 line-clamp-3">{lead.message}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block mt-6 flex-1 overflow-hidden rounded-xl border border-slate-200">
            <div className="h-full overflow-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                <thead className="sticky top-0 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3 break-words">{lead.email}</td>
                      <td className="px-4 py-3">
                        {lead.contact || (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {lead.subject || (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-md">
                        {lead.message ? (
                          <span className="line-clamp-2" title={lead.message}>
                            {lead.message}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {DATE_FORMAT.format(new Date(lead.created_at))}
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-12 text-center text-slate-500"
                        colSpan={6}
                      >
                        {query
                          ? "No leads match your search."
                          : "No leads have been submitted yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 text-xs sm:text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {start === 0 ? 0 : `${start}-${end}`} of {total} leads
            </span>
            {totalPages > 1 && (
              <nav className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm overflow-x-auto">
                {page > 1 ? (
                  <Link
                    href={pageHref(page - 1)}
                    className="rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-600 transition hover:bg-slate-100 whitespace-nowrap"
                  >
                    Prev
                  </Link>
                ) : (
                  <span className="rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-400 whitespace-nowrap">
                    Prev
                  </span>
                )}
                {visiblePages.map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={pageHref(pageNumber)}
                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-center text-xs sm:text-sm font-medium leading-7 sm:leading-8 transition whitespace-nowrap ${
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
                    className="rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-600 transition hover:bg-slate-100 whitespace-nowrap"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-400 whitespace-nowrap">
                    Next
                  </span>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
