import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface AppointmentsPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value || "";

const toDateKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);

type AppointmentRow = {
  id: string;
  title: string;
  start_time: string;
  assigned_to: string | null;
  status: string;
  google_event_id: string | null;
  contacts: { first_name: string | null; last_name: string | null } | null;
};

export default async function AdminAppointmentsPage({
  searchParams,
}: AppointmentsPageProps) {
  const view = first(searchParams?.view) || "list";

  const { data: appointments } = await getSupabaseAdmin()
    .from("appointments")
    .select("*, contacts(first_name,last_name)")
    .order("start_time", { ascending: true })
    .limit(200);

  const appointmentRows = (appointments ?? []) as AppointmentRow[];

  const groupedByDate = appointmentRows.reduce<Record<string, AppointmentRow[]>>(
    (acc, appointment) => {
      const key = toDateKey(appointment.start_time);
      if (!acc[key]) acc[key] = [];
      acc[key].push(appointment);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-textDark">Appointments</h1>
        <div className="rounded-lg border border-slate-300 bg-white p-1 text-xs">
          <Link
            href="/admin/appointments?view=list"
            className={`rounded px-2 py-1 ${view === "list" ? "bg-brand-primary text-white" : "text-slate-700"}`}
          >
            List
          </Link>
          <Link
            href="/admin/appointments?view=calendar"
            className={`rounded px-2 py-1 ${view === "calendar" ? "bg-brand-primary text-white" : "text-slate-700"}`}
          >
            Calendar
          </Link>
        </div>
      </header>

      {view === "calendar" ? (
        <div className="space-y-4">
          {Object.entries(groupedByDate).map(([date, entries]) => (
            <section key={date} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-600">
                {new Date(date).toLocaleDateString()}
              </h2>
              <div className="space-y-2">
                {entries?.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-lg border border-slate-100 p-3 text-sm"
                  >
                    <p className="font-semibold text-brand-textDark">{appointment.title}</p>
                    <p className="text-slate-600">
                      {new Date(appointment.start_time).toLocaleTimeString()} •{" "}
                      {[appointment.contacts?.first_name, appointment.contacts?.last_name]
                        .filter(Boolean)
                        .join(" ") || "Unknown"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Sync: {appointment.google_event_id ? "synced" : "not synced"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Time</th>
                <th className="px-4 py-3 text-left font-semibold">Title</th>
                <th className="px-4 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 py-3 text-left font-semibold">Assigned</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Calendar Sync</th>
              </tr>
            </thead>
            <tbody>
              {appointmentRows.map((appointment) => (
                <tr key={appointment.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    {new Date(appointment.start_time).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{appointment.title}</td>
                  <td className="px-4 py-3">
                    {[appointment.contacts?.first_name, appointment.contacts?.last_name]
                      .filter(Boolean)
                      .join(" ") || "Unknown"}
                  </td>
                  <td className="px-4 py-3">{appointment.assigned_to || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant="info">{appointment.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {appointment.google_event_id ? "synced" : "not synced"}
                  </td>
                </tr>
              ))}
              {appointmentRows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-slate-600" colSpan={6}>
                    No appointments available.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
