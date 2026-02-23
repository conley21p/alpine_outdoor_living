import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const statusBadge: Record<string, "info" | "warning" | "success" | "muted" | "danger"> =
  {
    new: "info",
    contacted: "warning",
    quoted: "warning",
    won: "success",
    lost: "muted",
    unresponsive: "danger",
  };

interface LeadsPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value || "";

type LeadRow = {
  id: string;
  created_at: string;
  assigned_to: string | null;
  service_needed: string | null;
  source: string | null;
  owner_notes: string | null;
  agent_notes: string | null;
  message: string | null;
  status: string;
  contacts:
    | {
        first_name: string | null;
        last_name: string | null;
        phone: string | null;
        email: string | null;
      }
    | null;
};

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const status = first(searchParams?.status);
  const source = first(searchParams?.source);
  const service = first(searchParams?.service);

  let query = getSupabaseAdmin()
    .from("leads")
    .select("*, contacts(first_name,last_name,phone,email)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);
  if (service) query = query.eq("service_needed", service);

  const { data: leads } = await query;
  const leadRows = (leads ?? []) as LeadRow[];

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-textDark">Leads</h1>
        <Link
          href="/admin/leads"
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
        >
          Clear filters
        </Link>
      </header>

      <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="quoted">Quoted</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="unresponsive">Unresponsive</option>
        </select>
        <input
          name="service"
          defaultValue={service}
          placeholder="Service"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="source"
          defaultValue={source}
          placeholder="Source"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Apply Filters
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Lead</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Contact</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Service</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Source</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Notes</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {leadRows.map((lead) => {
              const contact = Array.isArray(lead.contacts) ? lead.contacts[0] : lead.contacts;
              return (
                <tr key={lead.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-brand-textDark">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500">Assigned: {lead.assigned_to || "owner"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {[contact?.first_name, contact?.last_name].filter(Boolean).join(" ") ||
                        "Unknown"}
                    </p>
                    <p className="text-xs text-slate-500">{contact?.phone || contact?.email || "—"}</p>
                  </td>
                  <td className="px-4 py-3">{lead.service_needed || "—"}</td>
                  <td className="px-4 py-3">{lead.source || "—"}</td>
                  <td className="max-w-xs px-4 py-3 text-xs text-slate-600">
                    {lead.owner_notes || lead.agent_notes || lead.message || "No notes"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadge[lead.status] || "default"}>
                      {lead.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
