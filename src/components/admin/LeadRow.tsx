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
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-5 py-4 font-medium text-gray-900">{name}</td>
      <td className="px-5 py-4 text-gray-700">{service || "—"}</td>
      <td className="px-5 py-4 text-gray-700">{source || "—"}</td>
      <td className="px-5 py-4">
        <Badge variant={leadStatusVariant[status] || "default"}>{status}</Badge>
      </td>
      <td className="px-5 py-4 text-gray-600">{new Date(createdAt).toLocaleDateString()}</td>
    </tr>
  );
}
