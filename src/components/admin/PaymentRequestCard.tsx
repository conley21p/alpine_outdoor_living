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
    <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-card transition-all hover:shadow-card-hover">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Request #{id.slice(0, 8)}
      </p>
      <h3 className="mt-3 text-2xl font-black text-brand-primary">
        ${amount.toFixed(2)}
      </h3>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-700">
          <span className="font-bold">Vendor:</span> {vendor}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-bold">Reason:</span> {reason}
        </p>
      </div>
      <div className="mt-4 space-y-1 border-t border-gray-100 pt-4">
        <p className="text-xs font-medium text-gray-500">
          Requested: {new Date(createdAt).toLocaleString()}
        </p>
        {expiresAt ? (
          <p className="text-xs font-medium text-gray-500">
            Expires: {new Date(expiresAt).toLocaleString()}
          </p>
        ) : null}
      </div>
      {approvalToken ? (
        <div className="mt-5 flex gap-3">
          <Link
            href={`/api/webhooks/payment-approval?token=${encodeURIComponent(approvalToken)}&action=approve`}
            target="_blank"
            className="flex-1 rounded-lg bg-brand-primary px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-brand-accent"
          >
            Approve
          </Link>
          <Link
            href={`/api/webhooks/payment-approval?token=${encodeURIComponent(approvalToken)}&action=deny`}
            target="_blank"
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-red-700"
          >
            Deny
          </Link>
        </div>
      ) : null}
    </article>
  );
}
