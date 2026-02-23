import { Badge } from "@/components/ui/Badge";

const leadStatusVariant: Record<string, "info" | "warning" | "success" | "muted"> = {
  new: "info",
  contacted: "warning",
  quoted: "warning",
  won: "success",
  lost: "muted",
  unresponsive: "warning",
};

interface LeadRowProps {
  name: string;
  service: string;
  source: string;
  status: string;
  createdAt: string;
}

export function LeadRow({ name, service, source, status, createdAt }: LeadRowProps) {
  return (
    <tr className="border-b border-slate-100">
      <td className="px-4 py-3">{name}</td>
      <td className="px-4 py-3">{service || "—"}</td>
      <td className="px-4 py-3">{source || "—"}</td>
      <td className="px-4 py-3">
        <Badge variant={leadStatusVariant[status] || "default"}>{status}</Badge>
      </td>
      <td className="px-4 py-3">{new Date(createdAt).toLocaleDateString()}</td>
    </tr>
  );
}
