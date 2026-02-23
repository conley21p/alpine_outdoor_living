import { createBrowserClient } from "@supabase/ssr";
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

export const createSupabaseBrowserClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getClientConfig();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
