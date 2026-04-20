import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
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

export function createSupabaseServerClient(cookieStore: ReturnType<typeof cookies>) {
  const supabaseConfig = getSupabaseConfig();

  return createServerClient(supabaseConfig.url, supabaseConfig.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot set cookies; middleware can refresh sessions when Supabase Auth is enabled.
        }
      }
    }
  });
}
