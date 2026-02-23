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
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-5 py-4 text-xs font-medium text-gray-500">
        {new Date(createdAt).toLocaleString()}
      </td>
      <td className="px-5 py-4 text-sm font-bold text-gray-900">{action}</td>
      <td className="px-5 py-4 text-sm text-gray-700">{entityType || "general"}</td>
      <td className="px-5 py-4 text-sm text-gray-700">{description}</td>
      <td className="px-5 py-4">
        <Badge variant={statusVariant[status] || "default"}>{status}</Badge>
      </td>
    </tr>
  );
}
