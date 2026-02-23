import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface ContactsPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value || "";

type ContactRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  notes: string | null;
};

type LeadHistoryRow = {
  id: string;
  service_needed: string | null;
  status: string;
};

type AppointmentHistoryRow = {
  id: string;
  title: string;
  start_time: string;
  status: string;
};

export default async function AdminContactsPage({ searchParams }: ContactsPageProps) {
  const search = first(searchParams?.search);
  const contactId = first(searchParams?.contactId);
  const supabase = getSupabaseAdmin();

  let contactsQuery = supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (search) {
    contactsQuery = contactsQuery.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
    );
  }

  const { data: contacts } = await contactsQuery;
  const contactRows = (contacts ?? []) as ContactRow[];

  const selectedContact = contactId
    ? await supabase.from("contacts").select("*").eq("id", contactId).maybeSingle()
    : null;

  const [leads, appointments, jobs, emails] = contactId
    ? await Promise.all([
        supabase
          .from("leads")
          .select("id,created_at,service_needed,status,message")
          .eq("contact_id", contactId)
          .order("created_at", { ascending: false }),
        supabase
          .from("appointments")
          .select("id,title,start_time,status")
          .eq("contact_id", contactId)
          .order("start_time", { ascending: false }),
        supabase
          .from("jobs")
          .select("id,title,status,scheduled_date,invoice_amount,paid_amount")
          .eq("contact_id", contactId)
          .order("created_at", { ascending: false }),
        supabase
          .from("email_queue")
          .select("id,subject,status,created_at,sent_at")
          .eq("contact_id", contactId)
          .order("created_at", { ascending: false }),
      ])
    : [null, null, null, null];

  const selected = (selectedContact?.data as ContactRow | null) ?? null;
  const leadRows = ((leads?.data ?? []) as LeadHistoryRow[]) ?? [];
  const appointmentRows = ((appointments?.data ?? []) as AppointmentHistoryRow[]) ?? [];
  const jobRows = (jobs?.data ?? []) as Array<Record<string, unknown>>;
  const emailRows = (emails?.data ?? []) as Array<Record<string, unknown>>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-brand-textDark">Contacts</h1>
        <p className="mt-1 text-sm text-slate-600">
          Search and review full customer history.
        </p>
      </header>

      <form className="flex gap-3">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by name, phone, or email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Search
        </button>
      </form>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="font-semibold text-brand-textDark">All Contacts</h2>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {contactRows.map((contact) => (
              <Link
                key={contact.id}
                href={`/admin/contacts?contactId=${contact.id}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                className={`block border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50 ${
                  contactId === contact.id ? "bg-brand-bgLight" : ""
                }`}
              >
                <p className="font-medium text-brand-textDark">
                  {[contact.first_name, contact.last_name].filter(Boolean).join(" ")}
                </p>
                <p className="text-xs text-slate-500">{contact.phone || contact.email || "—"}</p>
              </Link>
            ))}
            {contactRows.length === 0 ? (
              <p className="p-4 text-sm text-slate-600">No contacts found.</p>
            ) : null}
          </div>
        </section>

        <section className="space-y-4">
          {!selected ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Select a contact to view profile details.
            </div>
          ) : (
            <>
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-brand-textDark">
                  {[selected.first_name, selected.last_name]
                    .filter(Boolean)
                    .join(" ")}
                </h2>
                <p className="text-sm text-slate-600">{selected.email || "No email"}</p>
                <p className="text-sm text-slate-600">{selected.phone || "No phone"}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Status: {selected.status}
                </p>
                {selected.notes ? (
                  <p className="mt-2 text-sm text-slate-700">{selected.notes}</p>
                ) : null}
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-brand-textDark">Lead History</h3>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {leadRows.map((lead) => (
                    <li key={lead.id} className="rounded border border-slate-100 p-2">
                      {lead.service_needed || "General inquiry"} — {lead.status}
                    </li>
                  ))}
                  {leadRows.length === 0 ? <li>No leads.</li> : null}
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-brand-textDark">Appointments</h3>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {appointmentRows.map((appointment) => (
                    <li key={appointment.id} className="rounded border border-slate-100 p-2">
                      {appointment.title} — {new Date(appointment.start_time).toLocaleString()} (
                      {appointment.status})
                    </li>
                  ))}
                  {appointmentRows.length === 0 ? <li>No appointments.</li> : null}
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-brand-textDark">Jobs & Emails</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Jobs: {jobRows.length} • Emails: {emailRows.length}
                </p>
              </article>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
