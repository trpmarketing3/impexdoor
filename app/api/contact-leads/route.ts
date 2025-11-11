import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

interface ContactLeadPayload {
  name?: string;
  email?: string;
  contact?: string;
  subject?: string;
  message?: string;
}

function sanitize(value: string | undefined | null) {
  return value?.trim() ?? "";
}

function clampPerPage(value: number) {
  if (Number.isNaN(value)) return 10;
  return Math.min(Math.max(value, 1), 100);
}

function buildSearchFilter(query: string) {
  const escaped = query.replace(/[%_]/g, (match) => `\\${match}`);
  const likeValue = `%${escaped}%`;
  return `name.ilike.${likeValue},email.ilike.${likeValue},contact.ilike.${likeValue},subject.ilike.${likeValue},message.ilike.${likeValue}`;
}

export async function GET(request: Request) {
  try {
    const supabase = createServiceRoleClient();
    const url = new URL(request.url);
    const pageParam = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
    const perPageParam = Number.parseInt(
      url.searchParams.get("perPage") ?? "10",
      10
    );
    const query = sanitize(url.searchParams.get("query"));

    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const perPage = clampPerPage(perPageParam);
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    console.log(`API GET: Fetching contact leads - page=${page}, perPage=${perPage}, query="${query}"`);

    let builder = supabase
      .from("contact_leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (query) {
      builder = builder.or(buildSearchFilter(query), { foreignTable: undefined });
    }

    const { data, count, error } = await builder.range(from, to);

    if (error) {
      console.error("Failed to fetch contact leads:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          success: false,
          message: `Unable to load contact leads: ${error.message || "Database error"}`,
        },
        { status: 500 }
      );
    }

    const total = count ?? 0;
    const totalPages = total === 0 ? 1 : Math.ceil(total / perPage);

    console.log(`API GET: Fetched ${data?.length || 0} contact leads (total: ${total})`);

    const response = NextResponse.json({
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

    // Add cache control headers to ensure fresh data
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Unexpected error in GET /api/contact-leads:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while fetching contact leads.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServiceRoleClient();

    const body = (await request.json()) as ContactLeadPayload;
    const name = sanitize(body.name);
    const email = sanitize(body.email);
    const contact = sanitize(body.contact);
    const subject = sanitize(body.subject);
    const message = sanitize(body.message);

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and message are required.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("contact_leads")
      .insert({
        name,
        email,
        contact: contact || null,
        subject: subject || null,
        message,
      })
      .select();

    if (error) {
      console.error("Failed to save contact lead:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          success: false,
          message: `Unable to submit your request. Error: ${error.message || "Database error"}`,
        },
        { status: 500 }
      );
    }

    console.log("Contact lead saved successfully:", data);

    const response = NextResponse.json({
      success: true,
      message: "Thank you! Our team will contact you shortly.",
      data: data?.[0],
    });

    // Add cache control headers to ensure fresh data
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Unexpected error in POST /api/contact-leads:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}


