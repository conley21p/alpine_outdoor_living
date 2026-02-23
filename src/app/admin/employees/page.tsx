import { getSupabaseAdmin } from "@/lib/supabase-admin";

type EmployeeRow = {
  id: string;
  name: string;
  role: string | null;
  active: boolean;
  email: string | null;
  phone: string | null;
  google_calendar_id: string | null;
};

type EmployeeAppointmentRow = {
  id: string;
  title: string;
  start_time: string;
};

export default async function AdminEmployeesPage() {
  const supabase = getSupabaseAdmin();
  const { data: employees } = await supabase
    .from("employees")
    .select("*")
    .order("name", { ascending: true });
  const employeeRows = (employees ?? []) as EmployeeRow[];

  const today = new Date().toISOString();

  const employeeDetails = await Promise.all(
    employeeRows.map(async (employee) => {
      const [jobsResult, appointmentsResult] = await Promise.all([
        supabase
          .from("jobs")
          .select("id", { count: "exact", head: true })
          .eq("assigned_to", employee.name),
        supabase
          .from("appointments")
          .select("id,title,start_time,status")
          .eq("assigned_to", employee.name)
          .gte("start_time", today)
          .order("start_time", { ascending: true })
          .limit(3),
      ]);

      return {
        ...employee,
        jobCount: jobsResult.count ?? 0,
        upcomingAppointments:
          ((appointmentsResult.data ?? []) as EmployeeAppointmentRow[]) ?? [],
      };
    }),
  );

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-brand-textDark">Employees</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage employee profiles, roles, and upcoming assignments.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {employeeDetails.map((employee) => (
          <article
            key={employee.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-brand-textDark">{employee.name}</h2>
                <p className="text-sm text-slate-600">{employee.role || "No role set"}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  employee.active
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {employee.active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-700">{employee.email || "No email"}</p>
            <p className="text-sm text-slate-700">{employee.phone || "No phone"}</p>
            <p className="mt-2 text-xs text-slate-500">
              Calendar ID: {employee.google_calendar_id || "Not connected"}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              Assigned jobs: <strong>{employee.jobCount}</strong>
            </p>

            <div className="mt-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Upcoming appointments
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {employee.upcomingAppointments.map((appointment) => (
                  <li key={appointment.id}>
                    {appointment.title} —{" "}
                    {new Date(appointment.start_time).toLocaleString()}
                  </li>
                ))}
                {employee.upcomingAppointments.length === 0 ? (
                  <li className="text-xs text-slate-500">No upcoming appointments.</li>
                ) : null}
              </ul>
            </div>
          </article>
        ))}
        {employeeDetails.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            No employees found.
          </div>
        ) : null}
      </div>
    </div>
  );
}
