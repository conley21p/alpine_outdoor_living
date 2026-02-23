import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { PaymentRequestCard } from "@/components/admin/PaymentRequestCard";
import { writeAgentLog } from "@/lib/agent-log";

interface PaymentsPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value || "";

type PaymentRow = {
  id: string;
  amount: number;
  vendor: string;
  reason: string;
  status: string;
  created_at: string;
  expires_at: string | null;
  approval_token: string | null;
  transaction_ref: string | null;
};

export default async function AdminPaymentsPage({ searchParams }: PaymentsPageProps) {
  const tab = first(searchParams?.tab) || "pending";
  const action = first(searchParams?.action);
  const id = first(searchParams?.id);
  const supabase = getSupabaseAdmin();

  if (action && id) {
    const { data: payment } = await supabase
      .from("payment_requests")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    const paymentRow = (payment as PaymentRow | null) ?? null;

    if (paymentRow && paymentRow.status === "pending") {
      const now = new Date().toISOString();
      if (action === "approve") {
        await supabase
          .from("payment_requests")
          .update({ status: "approved", approved_at: now, expires_at: now })
          .eq("id", id);
        await writeAgentLog({
          action: "payment_approved_manual",
          entityType: "payment",
          entityId: id,
          description: `Owner approved payment ${id} from CRM`,
        });
      }
      if (action === "deny") {
        await supabase
          .from("payment_requests")
          .update({ status: "denied", expires_at: now })
          .eq("id", id);
        await writeAgentLog({
          action: "payment_denied_manual",
          entityType: "payment",
          entityId: id,
          description: `Owner denied payment ${id} from CRM`,
        });
      }
    }
    redirect("/admin/payments?tab=pending");
  }

  const [{ data: pending }, { data: completed }] = await Promise.all([
    supabase
      .from("payment_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabase
      .from("payment_requests")
      .select("*")
      .not("status", "eq", "pending")
      .order("created_at", { ascending: false })
      .limit(300),
  ]);
  const pendingRows = (pending ?? []) as PaymentRow[];
  const completedRows = (completed ?? []) as PaymentRow[];

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-textDark">Payment Queue</h1>
        <div className="rounded-lg border border-slate-300 bg-white p-1 text-xs">
          <Link
            href="/admin/payments?tab=pending"
            className={`rounded px-2 py-1 ${
              tab === "pending" ? "bg-brand-primary text-white" : "text-slate-700"
            }`}
          >
            Pending
          </Link>
          <Link
            href="/admin/payments?tab=completed"
            className={`rounded px-2 py-1 ${
              tab === "completed" ? "bg-brand-primary text-white" : "text-slate-700"
            }`}
          >
            Completed
          </Link>
        </div>
      </header>

      {tab === "pending" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {pendingRows.map((payment) => (
            <div key={payment.id} className="space-y-2">
              <PaymentRequestCard
                id={payment.id}
                amount={Number(payment.amount)}
                vendor={payment.vendor}
                reason={payment.reason}
                createdAt={payment.created_at}
                expiresAt={payment.expires_at || undefined}
                approvalToken={payment.approval_token}
              />
              <div className="flex gap-2">
                <Link href={`/admin/payments?tab=pending&action=approve&id=${payment.id}`}>
                  <button className="rounded bg-green-600 px-3 py-1.5 text-xs font-semibold text-white">
                    Approve now
                  </button>
                </Link>
                <Link href={`/admin/payments?tab=pending&action=deny&id=${payment.id}`}>
                  <button className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">
                    Deny now
                  </button>
                </Link>
              </div>
            </div>
          ))}
          {pendingRows.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              No pending payment requests.
            </div>
          ) : null}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Requested</th>
                <th className="px-4 py-3 text-left font-semibold">Vendor</th>
                <th className="px-4 py-3 text-left font-semibold">Reason</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Transaction Ref</th>
              </tr>
            </thead>
            <tbody>
              {completedRows.map((payment) => (
                <tr key={payment.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    {new Date(payment.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{payment.vendor}</td>
                  <td className="px-4 py-3">{payment.reason}</td>
                  <td className="px-4 py-3">${Number(payment.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">{payment.status}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {payment.transaction_ref || "—"}
                  </td>
                </tr>
              ))}
              {completedRows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-slate-600" colSpan={6}>
                    No completed transactions yet.
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
