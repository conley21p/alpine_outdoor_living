"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/employees", label: "Employees" },
  { href: "/admin/emails", label: "Email Queue" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/agent-log", label: "Agent Log" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r border-slate-200 bg-white md:w-64">
      <div className="p-4 text-lg font-bold text-brand-primary">OpenClaw CRM</div>
      <nav className="space-y-1 px-3 pb-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm font-medium transition",
              pathname === item.href
                ? "bg-brand-primary text-white"
                : "text-slate-700 hover:bg-slate-100",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
