import { createClient } from "@supabase/supabase-js";
import { getSupabaseCredentials } from "./credentials";

const { supabaseUrl, serviceRoleKey } = getSupabaseCredentials();

export function createServiceRoleClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
