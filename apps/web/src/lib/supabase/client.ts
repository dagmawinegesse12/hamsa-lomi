import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

function getSupabaseConfig() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Supabase URL and publishable key are required to create a Supabase client.");
  }

  return {
    key: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    url: env.NEXT_PUBLIC_SUPABASE_URL
  };
}

export function createSupabaseBrowserClient() {
  const supabaseConfig = getSupabaseConfig();

  return createBrowserClient(supabaseConfig.url, supabaseConfig.key);
}
