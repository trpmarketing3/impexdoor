import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceRoleClient } from "@/lib/supabase/server";

interface SignInRequest {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as SignInRequest;

  if (!body.email || !body.password) {
    return NextResponse.json(
      { success: false, message: "Email and password are required." },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });

  if (error || !data.session) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message ?? "Invalid email or password.",
      },
      { status: 401 }
    );
  }

  const cookieStore = cookies();
  const accessToken = data.session.access_token;
  const refreshToken = data.session.refresh_token;

  cookieStore.set({
    name: "sb-access-token",
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: data.session.expires_in,
  });

  cookieStore.set({
    name: "sb-refresh-token",
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return NextResponse.json({
    success: true,
    user: data.user,
  });
}


