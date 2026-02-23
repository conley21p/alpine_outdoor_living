import { Badge } from "@/components/ui/Badge";

interface AgentLogEntryProps {
  createdAt: string;
  action: string;
  entityType?: string | null;
  description: string;
  status: string;
}

const statusVariant: Record<string, "success" | "danger" | "warning"> = {
  success: "success",
  error: "danger",
  pending: "warning",
};

export function AgentLogEntry({
  createdAt,
  action,
  entityType,
  description,
  status,
}: AgentLogEntryProps) {
  return (
    <tr className="border-b border-slate-100">
      <td className="px-4 py-3 text-xs text-slate-500">
        {new Date(createdAt).toLocaleString()}
      </td>
      <td className="px-4 py-3 text-sm font-medium">{action}</td>
      <td className="px-4 py-3 text-sm">{entityType || "general"}</td>
      <td className="px-4 py-3 text-sm text-slate-700">{description}</td>
      <td className="px-4 py-3">
        <Badge variant={statusVariant[status] || "default"}>{status}</Badge>
      </td>
    </tr>
  );
}
