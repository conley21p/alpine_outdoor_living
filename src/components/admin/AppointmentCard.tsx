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
    <article className="rounded-xl border border-gray-100 bg-white p-5 shadow-card transition-all hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-bold text-brand-textDark">{title}</h3>
          <p className="mt-1 text-sm font-medium text-gray-700">{contactName}</p>
          <p className="mt-2 text-sm text-gray-600">
            {new Date(startTime).toLocaleString()}
          </p>
          {assignedTo ? (
            <p className="mt-1 text-xs font-medium text-gray-500">Assigned to: {assignedTo}</p>
          ) : null}
        </div>
        <Badge variant={statusVariant[status] || "default"}>{status}</Badge>
      </div>
    </article>
  );
}
