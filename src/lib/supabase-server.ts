import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicConfig } from "@/lib/config";

const getClientConfig = () => {
  if (!publicConfig.supabaseUrl || !publicConfig.supabaseAnonKey) {
    throw new Error(
      "Missing Supabase public environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return {
    supabaseUrl: publicConfig.supabaseUrl,
    supabaseAnonKey: publicConfig.supabaseAnonKey,
  };
};

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  const { supabaseUrl, supabaseAnonKey } = getClientConfig();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options as CookieOptions);
          } catch {
            // Server Components can read cookies but cannot always write them.
          }
        });
      },
    },
  });
};
