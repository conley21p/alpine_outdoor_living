import { Badge } from "@/components/ui/Badge";

interface AppointmentCardProps {
  title: string;
  contactName: string;
  startTime: string;
  assignedTo?: string;
  status: string;
}

const statusVariant: Record<string, "info" | "success" | "warning" | "danger" | "muted"> = {
  scheduled: "info",
  confirmed: "success",
  completed: "success",
  cancelled: "danger",
  no_show: "warning",
};

export function AppointmentCard({
  title,
  contactName,
  startTime,
  assignedTo,
  status,
}: AppointmentCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-brand-textDark">{title}</h3>
          <p className="text-sm text-slate-600">{contactName}</p>
          <p className="mt-1 text-sm text-slate-500">
            {new Date(startTime).toLocaleString()}
          </p>
          {assignedTo ? (
            <p className="mt-1 text-xs text-slate-500">Assigned to: {assignedTo}</p>
          ) : null}
        </div>
        <Badge variant={statusVariant[status] || "default"}>{status}</Badge>
      </div>
    </article>
  );
}
