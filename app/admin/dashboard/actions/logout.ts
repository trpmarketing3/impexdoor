"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseCredentials } from "@/lib/supabase/credentials";
import { createClient } from "@supabase/supabase-js";

export async function logout() {
  const cookieStore = cookies();
  const { supabaseUrl, serviceRoleKey } = getSupabaseCredentials();

  // Invalidate session in Supabase
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const refreshToken = cookieStore.get("sb-refresh-token")?.value;
  if (refreshToken) {
    await supabase.auth.admin.signOut(refreshToken);
  }

  // Clear auth cookies
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");

  redirect("/admin/signin");
}


