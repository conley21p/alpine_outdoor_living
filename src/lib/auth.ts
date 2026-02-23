import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const getCurrentSession = async () => {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return session;
};

export const requireAdminSession = async () => {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
};
