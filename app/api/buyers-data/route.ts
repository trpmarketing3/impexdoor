import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  BUYER_CATEGORIES,
  DEFAULT_BUYER_CATEGORY,
} from "@/lib/constants/buyer-categories";

interface BuyerDataPayload {
  category?: string;
  title?: string;
  description?: string;
  buyerFrom?: string;
  quantity?: string;
  destination?: string;
  paymentTerms?: string;
  lookingSuppliersFrom?: string;
  status?: string;
}

const MAX_DESCRIPTION_LENGTH = 2000;
const ALLOWED_STATUSES = ["Active", "Inactive"];

function sanitize(value: string | undefined | null) {
  return value?.trim() ?? "";
}

function normalizeCategory(rawCategory: string | undefined) {
  if (!rawCategory) return DEFAULT_BUYER_CATEGORY;
  const match = BUYER_CATEGORIES.find(
    (category) => category.toLowerCase() === rawCategory.toLowerCase()
  );
  return match ?? DEFAULT_BUYER_CATEGORY;
}

function clampPerPage(value: number) {
  if (Number.isNaN(value)) return 10;
  return Math.min(Math.max(value, 1), 100);
}

function escapeSearchTerm(term: string) {
  return term.replace(/[%_]/g, (match) => `\\${match}`);
}

export async function GET(request: Request) {
  const supabase = createServiceRoleClient();
  const url = new URL(request.url);
  const pageParam = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const perPageParam = Number.parseInt(
    url.searchParams.get("perPage") ?? "10",
    10
  );
  const query = sanitize(url.searchParams.get("query"));
  const category = normalizeCategory(url.searchParams.get("category") ?? "");

  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const perPage = clampPerPage(perPageParam);
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
    return NextResponse.json(
      {
        success: false,
        message: "Unable to load buyers data.",
      },
      { status: 500 }
    );
  }

  const total = count ?? 0;
  const totalPages = total === 0 ? 1 : Math.ceil(total / perPage);

  return NextResponse.json({
    success: true,
    data: data ?? [],
    pagination: {
      page,
      perPage,
      total,
      totalPages,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
    },
  });
}

export async function POST(request: Request) {
  const supabase = createServiceRoleClient();
  const body = (await request.json()) as BuyerDataPayload;

  const category = normalizeCategory(body.category);
  const title = sanitize(body.title);
  const description = sanitize(body.description).slice(
    0,
    MAX_DESCRIPTION_LENGTH
  );
  const buyerFrom = sanitize(body.buyerFrom);
  const quantity = sanitize(body.quantity);
  const destination = sanitize(body.destination);
  const paymentTerms = sanitize(body.paymentTerms);
  const lookingSuppliersFrom = sanitize(body.lookingSuppliersFrom);
  const status =
    ALLOWED_STATUSES.find(
      (value) => value.toLowerCase() === sanitize(body.status).toLowerCase()
    ) ?? "Active";

  if (!title) {
    return NextResponse.json(
      { success: false, message: "Title is required." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("buyers_data").insert({
    category,
    title,
    description,
    buyer_from: buyerFrom,
    quantity,
    destination,
    payment_terms: paymentTerms,
    looking_suppliers_from: lookingSuppliersFrom,
    status,
  });

  if (error) {
    console.error("Failed to create buyer data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to create buyer data. Please try again later.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Buyer data created successfully.",
  });
}


