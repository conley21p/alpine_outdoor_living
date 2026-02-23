import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/email";
import { writeAgentLog } from "@/lib/agent-log";

interface EmailsPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value || "";

type EmailRow = {
  id: string;
  to_email: string;
  to_name: string | null;
  subject: string;
  body_html: string;
  body_text: string | null;
  status: string;
  created_at: string;
  sent_at: string | null;
};

export default async function AdminEmailsPage({ searchParams }: EmailsPageProps) {
  const tab = first(searchParams?.tab) || "pending";
  const action = first(searchParams?.action);
  const id = first(searchParams?.id);
  const supabase = getSupabaseAdmin();

  if (action && id) {
    if (action === "approve") {
      const { data: emailRecord } = await supabase
        .from("email_queue")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      const selectedEmail = (emailRecord as EmailRow | null) ?? null;

      if (selectedEmail && selectedEmail.status === "pending_approval") {
        await supabase
          .from("email_queue")
          .update({ status: "approved", approved_at: new Date().toISOString() })
          .eq("id", id);

        try {
          await sendEmail({
            toEmail: selectedEmail.to_email,
            toName: selectedEmail.to_name || undefined,
            subject: selectedEmail.subject,
            bodyHtml: selectedEmail.body_html,
            bodyText: selectedEmail.body_text || undefined,
          });
          await supabase
            .from("email_queue")
            .update({ status: "sent", sent_at: new Date().toISOString() })
            .eq("id", id);
        } catch (error) {
          await supabase
            .from("email_queue")
            .update({
              status: "failed",
              error_message: error instanceof Error ? error.message : "Unknown send error",
            })
            .eq("id", id);
        }

        await writeAgentLog({
          action: "email_approved",
          entityType: "email",
          entityId: id,
          description: `Owner approved and sent email ${id}`,
        });
      }
      redirect("/admin/emails?tab=pending");
    }

    if (action === "deny") {
      await supabase.from("email_queue").update({ status: "cancelled" }).eq("id", id);
      await writeAgentLog({
        action: "email_denied",
        entityType: "email",
        entityId: id,
        description: `Owner denied email ${id}`,
      });
      redirect("/admin/emails?tab=pending");
    }
  }

  const pendingQuery = supabase
    .from("email_queue")
    .select("*")
    .eq("status", "pending_approval")
    .order("created_at", { ascending: false })
    .limit(100);

  const sentQuery = supabase
    .from("email_queue")
    .select("*")
    .in("status", ["sent", "failed", "cancelled"])
    .order("created_at", { ascending: false })
    .limit(200);

  const [{ data: pendingEmails }, { data: sentEmails }] = await Promise.all([
    pendingQuery,
    sentQuery,
  ]);

  const activeRows = (
    tab === "sent" ? sentEmails ?? [] : pendingEmails ?? []
  ) as EmailRow[];

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-textDark">Email Queue</h1>
        <div className="rounded-lg border border-slate-300 bg-white p-1 text-xs">
          <Link
            href="/admin/emails?tab=pending"
            className={`rounded px-2 py-1 ${
              tab === "pending" ? "bg-brand-primary text-white" : "text-slate-700"
            }`}
          >
            Pending Approval
          </Link>
          <Link
            href="/admin/emails?tab=sent"
            className={`rounded px-2 py-1 ${
              tab === "sent" ? "bg-brand-primary text-white" : "text-slate-700"
            }`}
          >
            Sent Log
          </Link>
        </div>
      </header>

      <div className="space-y-3">
        {activeRows.map((email) => (
          <article
            key={email.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">
                  To: {email.to_name ? `${email.to_name} <${email.to_email}>` : email.to_email}
                </p>
                <h2 className="text-lg font-semibold text-brand-textDark">{email.subject}</h2>
              </div>
              <Badge
                variant={
                  email.status === "sent"
                    ? "success"
                    : email.status === "failed"
                      ? "danger"
                      : email.status === "cancelled"
                        ? "muted"
                        : "warning"
                }
              >
                {email.status}
              </Badge>
            </div>

            <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm text-slate-700">
              {email.body_text || email.body_html.replace(/<[^>]+>/g, " ")}
            </p>

            {tab === "pending" ? (
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/admin/emails?tab=pending&action=approve&id=${email.id}`}
                  className="rounded bg-brand-secondary px-3 py-2 text-xs font-semibold text-white"
                >
                  Approve
                </Link>
                <Link
                  href={`/admin/emails?tab=pending&action=deny&id=${email.id}`}
                  className="rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white"
                >
                  Deny
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-500">
                Created: {new Date(email.created_at).toLocaleString()}
                {email.sent_at ? ` • Sent: ${new Date(email.sent_at).toLocaleString()}` : ""}
              </p>
            )}
          </article>
        ))}
        {activeRows.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            No emails in this queue.
          </div>
        ) : null}
      </div>
    </div>
  );
}
