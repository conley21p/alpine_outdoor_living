import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { AgentLogStatus, AgentEntityType } from "@/types";

export interface WriteAgentLogInput {
  action: string;
  entityType?: AgentEntityType;
  entityId?: string | null;
  description: string;
  metadata?: Record<string, unknown>;
  status?: AgentLogStatus;
}

export const writeAgentLog = async (input: WriteAgentLogInput) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("agent_logs")
    .insert({
      action: input.action,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      description: input.description,
      metadata: input.metadata ?? {},
      status: input.status ?? "success",
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id as string;
};
