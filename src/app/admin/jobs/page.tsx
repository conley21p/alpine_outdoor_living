import { getSupabaseAdmin } from "@/lib/supabase-admin";

const statuses = [
  "pending",
  "in_progress",
  "completed",
  "invoiced",
  "paid",
] as const;

const statusLabel: Record<(typeof statuses)[number], string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  invoiced: "Invoiced",
  paid: "Paid",
};

type JobRow = {
  id: string;
  title: string;
  status: string;
  service: string | null;
  assigned_to: string | null;
  scheduled_date: string | null;
  invoice_amount: number | null;
  paid_amount: number | null;
  contacts: { first_name: string | null; last_name: string | null } | null;
};

export default async function AdminJobsPage() {
  const { data: jobs } = await getSupabaseAdmin()
    .from("jobs")
    .select("*, contacts(first_name,last_name)")
    .order("created_at", { ascending: false });
  const jobRows = (jobs ?? []) as JobRow[];

  const grouped = statuses.reduce<Record<string, JobRow[]>>((acc, status) => {
    acc[status] = jobRows.filter((job) => job.status === status);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-brand-textDark">Jobs</h1>
        <p className="mt-1 text-sm text-slate-600">
          Kanban view of job progress from pending to paid.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-5">
        {statuses.map((status) => (
          <section
            key={status}
            className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <h2 className="mb-3 text-sm font-semibold text-slate-700">
              {statusLabel[status]}
            </h2>
            <div className="space-y-3">
              {(grouped[status] ?? []).map((job) => (
                <article
                  key={job.id}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm"
                >
                  <p className="font-semibold text-brand-textDark">{job.title}</p>
                  <p className="text-xs text-slate-600">
                    {[job.contacts?.first_name, job.contacts?.last_name]
                      .filter(Boolean)
                      .join(" ") || "Unknown client"}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Service: {job.service || "—"}
                  </p>
                  <p className="text-xs text-slate-600">
                    Employee: {job.assigned_to || "Unassigned"}
                  </p>
                  <p className="text-xs text-slate-600">
                    Scheduled:{" "}
                    {job.scheduled_date
                      ? new Date(job.scheduled_date).toLocaleDateString()
                      : "—"}
                  </p>
                  <p className="text-xs text-slate-600">
                    Invoice: $
                    {typeof job.invoice_amount === "number"
                      ? Number(job.invoice_amount).toFixed(2)
                      : "0.00"}
                  </p>
                  <p className="text-xs text-slate-600">
                    Paid: $
                    {typeof job.paid_amount === "number"
                      ? Number(job.paid_amount).toFixed(2)
                      : "0.00"}
                  </p>
                </article>
              ))}
              {(grouped[status] ?? []).length === 0 ? (
                <p className="text-xs text-slate-500">No jobs in this column.</p>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
