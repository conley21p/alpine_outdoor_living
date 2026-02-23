import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Sidebar } from "@/components/admin/Sidebar";
import { SignOutButton } from "@/components/admin/SignOutButton";

export const dynamic = "force-dynamic";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const requestHeaders = headers();
  const nextUrl = requestHeaders.get("next-url") || requestHeaders.get("x-pathname") || "";
  const isLoginRoute = nextUrl.includes("/admin/login");

  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && !isLoginRoute) {
    redirect("/admin/login");
  }

  if (session && isLoginRoute) {
    redirect("/admin");
  }

  if (isLoginRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <Sidebar />
      <div className="flex-1">
        <header className="flex items-center justify-end border-b border-gray-100 bg-white px-6 py-4 shadow-sm">
          <SignOutButton />
        </header>
        <main className="p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
