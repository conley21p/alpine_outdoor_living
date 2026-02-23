import { StatsCard } from "@/components/admin/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { LeadRow } from "@/components/admin/LeadRow";
import { AppointmentCard } from "@/components/admin/AppointmentCard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

type DashboardLeadRow = {
  id: string;
  service_needed: string | null;
  source: string | null;
  status: string;
  created_at: string;
  contacts: { first_name: string | null; last_name: string | null } | null;
};

type DashboardAppointmentRow = {
  id: string;
  title: string;
  start_time: string;
  assigned_to: string | null;
  status: string;
  contacts: { first_name: string | null; last_name: string | null } | null;
};

export default async function AdminDashboardPage() {
  const supabase = getSupabaseAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const today = startOfToday();
  const weekAhead = new Date();
  weekAhead.setDate(weekAhead.getDate() + 7);

  const [
    totalLeadsResult,
    newLeadsTodayResult,
    appointmentsWeekResult,
    openJobsResult,
    pendingPaymentsResult,
    recentLeadsResult,
    upcomingAppointmentsResult,
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", today.toISOString()),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .gte("start_time", today.toISOString())
      .lte("start_time", weekAhead.toISOString()),
    supabase
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .not("status", "in", "(paid)"),
    supabase
      .from("payment_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("leads")
      .select("id,service_needed,source,status,created_at,contacts(first_name,last_name)")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("appointments")
      .select("id,title,start_time,assigned_to,status,contacts(first_name,last_name)")
      .gte("start_time", today.toISOString())
      .lte("start_time", weekAhead.toISOString())
      .order("start_time", { ascending: true })
      .limit(10),
  ]);

  const totalLeads = totalLeadsResult.count ?? 0;
  const newLeadsToday = newLeadsTodayResult.count ?? 0;
  const appointmentsThisWeek = appointmentsWeekResult.count ?? 0;
  const openJobs = openJobsResult.count ?? 0;
  const pendingPayments = pendingPaymentsResult.count ?? 0;

  const recentLeads = (recentLeadsResult.data ?? []) as DashboardLeadRow[];
  const upcomingAppointments =
    (upcomingAppointmentsResult.data ?? []) as DashboardAppointmentRow[];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-brand-textDark">Dashboard</h1>
        {pendingPayments > 0 ? (
          <Badge variant="warning">{pendingPayments} pending payment requests</Badge>
        ) : null}
      </header>

      {pendingPayments > 0 ? (
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5 shadow-modern">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-200 text-amber-800">
              ⚠
            </div>
            <div>
              <p className="font-semibold text-amber-900">Attention Required</p>
              <p className="text-sm text-amber-800">
                There are {pendingPayments} payment requests awaiting approval.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard label="Total Leads (30d)" value={totalLeads} />
        <StatsCard label="New Leads Today" value={newLeadsToday} />
        <StatsCard label="Appointments This Week" value={appointmentsThisWeek} />
        <StatsCard label="Open Jobs" value={openJobs} />
        <StatsCard label="Pending Payments" value={pendingPayments} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-xl border border-gray-100 bg-white shadow-card">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-bold text-brand-textDark">Recent Leads</h2>
          </div>
          {recentLeads.length === 0 ? (
            <p className="p-6 text-center text-sm text-gray-600">No leads yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Name</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Service</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Source</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Status</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentLeads.map((lead) => {
                    const contact = Array.isArray(lead.contacts)
                      ? lead.contacts[0]
                      : lead.contacts;
                    const name = [contact?.first_name, contact?.last_name]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <LeadRow
                        key={lead.id}
                        name={name || "Unknown"}
                        service={lead.service_needed || ""}
                        source={lead.source || ""}
                        status={lead.status}
                        createdAt={lead.created_at}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article>
          <h2 className="mb-4 text-lg font-bold text-brand-textDark">Upcoming Appointments</h2>
          <div className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-600 shadow-card">
                No appointments scheduled for the next 7 days.
              </div>
            ) : (
              upcomingAppointments.map((appointment) => {
                const contact = Array.isArray(appointment.contacts)
                  ? appointment.contacts[0]
                  : appointment.contacts;
                return (
                  <AppointmentCard
                    key={appointment.id}
                    title={appointment.title}
                    contactName={
                      [contact?.first_name, contact?.last_name]
                        .filter(Boolean)
                        .join(" ") || "Unknown"
                    }
                    startTime={appointment.start_time}
                    assignedTo={appointment.assigned_to || undefined}
                    status={appointment.status}
                  />
                );
              })
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
