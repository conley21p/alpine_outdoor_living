import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerConfig, publicConfig } from "@/lib/config";

type GenericTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: never[];
};

type GenericDatabase = {
  public: {
    Tables: Record<string, GenericTable>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, string>;
    CompositeTypes: Record<string, never>;
  };
};

let adminClient: SupabaseClient<GenericDatabase> | null = null;

export const getSupabaseAdmin = () => {
  if (adminClient) {
    return adminClient;
  }

  if (!publicConfig.supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  }

  const { supabaseServiceRoleKey } = getServerConfig();
  adminClient = createClient<GenericDatabase>(
    publicConfig.supabaseUrl,
    supabaseServiceRoleKey,
    {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    },
  );

  return adminClient;
};
