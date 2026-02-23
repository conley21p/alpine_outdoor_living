import Link from "next/link";

interface PaymentRequestCardProps {
  id: string;
  amount: number;
  vendor: string;
  reason: string;
  createdAt: string;
  expiresAt?: string;
  approvalToken?: string | null;
}

export function PaymentRequestCard({
  id,
  amount,
  vendor,
  reason,
  createdAt,
  expiresAt,
  approvalToken,
}: PaymentRequestCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">Request #{id.slice(0, 8)}</p>
      <h3 className="mt-2 text-xl font-bold text-brand-textDark">
        ${amount.toFixed(2)}
      </h3>
      <p className="text-sm text-slate-700">
        <strong>Vendor:</strong> {vendor}
      </p>
      <p className="text-sm text-slate-700">
        <strong>Reason:</strong> {reason}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Requested: {new Date(createdAt).toLocaleString()}
      </p>
      {expiresAt ? (
        <p className="text-xs text-slate-500">
          Expires: {new Date(expiresAt).toLocaleString()}
        </p>
      ) : null}
      {approvalToken ? (
        <div className="mt-4 flex gap-2">
          <Link
            href={`/api/webhooks/payment-approval?token=${encodeURIComponent(approvalToken)}&action=approve`}
            target="_blank"
            className="rounded bg-brand-secondary px-3 py-2 text-xs font-semibold text-white"
          >
            Approve
          </Link>
          <Link
            href={`/api/webhooks/payment-approval?token=${encodeURIComponent(approvalToken)}&action=deny`}
            target="_blank"
            className="rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white"
          >
            Deny
          </Link>
        </div>
      ) : null}
    </article>
  );
}
