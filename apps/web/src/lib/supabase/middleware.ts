import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
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

export function createSupabaseMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  const supabaseConfig = getSupabaseConfig();
  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  return { response, supabase };
}
