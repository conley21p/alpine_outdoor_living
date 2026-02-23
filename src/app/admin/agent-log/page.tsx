import { AgentLogEntry } from "@/components/admin/AgentLogEntry";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface AgentLogPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value || "";

const toCsv = (rows: Array<Record<string, unknown>>) => {
  const headers = ["timestamp", "action", "entity_type", "description", "status"];
  const escaped = (value: unknown) =>
    `"${String(value ?? "").replace(/"/g, '""').replace(/\n/g, " ")}"`;
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(
      [
        row.created_at,
        row.action,
        row.entity_type,
        row.description,
        row.status,
      ]
        .map(escaped)
        .join(","),
    );
  });
  return lines.join("\n");
};

export default async function AgentLogPage({ searchParams }: AgentLogPageProps) {
  const action = first(searchParams?.action);
  const from = first(searchParams?.from);
  const to = first(searchParams?.to);

  let query = getSupabaseAdmin()
    .from("agent_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (action) query = query.eq("action", action);
  if (from) query = query.gte("created_at", new Date(from).toISOString());
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    query = query.lte("created_at", end.toISOString());
  }

  const { data: logs } = await query;
  const logRows = (logs ?? []) as Array<{
    id: string;
    created_at: string;
    action: string;
    entity_type: string | null;
    description: string;
    status: string;
  }>;
  const csvData = encodeURIComponent(
    toCsv(logRows as Array<Record<string, unknown>>),
  );

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-textDark">Agent Log</h1>
        <a
          href={`data:text/csv;charset=utf-8,${csvData}`}
          download="agent-log.csv"
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Export CSV
        </a>
      </header>

      <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
        <input
          name="action"
          defaultValue={action}
          placeholder="Action"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="date"
          name="from"
          defaultValue={from}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="date"
          name="to"
          defaultValue={to}
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
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
              <th className="px-4 py-3 text-left font-semibold">Entity</th>
              <th className="px-4 py-3 text-left font-semibold">Description</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {logRows.map((log) => (
              <AgentLogEntry
                key={log.id}
                createdAt={log.created_at}
                action={log.action}
                entityType={log.entity_type}
                description={log.description}
                status={log.status}
              />
            ))}
            {logRows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-sm text-slate-600" colSpan={5}>
                  No agent logs found for the selected filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
