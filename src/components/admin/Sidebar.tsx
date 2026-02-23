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
    <aside className="w-full border-r border-gray-100 bg-white md:w-64">
      <div className="border-b border-gray-100 p-5">
        <h1 className="text-xl font-black text-brand-primary">OpenClaw CRM</h1>
      </div>
      <nav className="space-y-1 p-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
              pathname === item.href
                ? "bg-brand-primary text-white shadow-md"
                : "text-gray-700 hover:bg-gray-50",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
