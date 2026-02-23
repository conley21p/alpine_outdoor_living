import { NextRequest, NextResponse } from "next/server";
import { validateAgentKey } from "@/lib/agent-auth";
import { writeAgentLog } from "@/lib/agent-log";

interface AgentLogPayload {
  action?: string;
  entityType?:
    | "contact"
    | "lead"
    | "appointment"
    | "job"
    | "email"
    | "payment"
    | "general";
  entityId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  status?: "success" | "error" | "pending";
}

const clean = (value?: string) => value?.trim() || "";

export async function POST(request: NextRequest) {
  const unauthorized = validateAgentKey(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as AgentLogPayload;
    const action = clean(body.action);
    const description = clean(body.description);

    if (!action || !description) {
      return NextResponse.json(
        { error: "action and description are required." },
        { status: 400 },
      );
    }

    const id = await writeAgentLog({
      action,
      entityType: body.entityType,
      entityId: clean(body.entityId) || null,
      description,
      metadata: body.metadata ?? {},
      status: body.status ?? "success",
    });

    return NextResponse.json({ id, logged: true });
  } catch (error) {
    console.error("Agent log POST error", error);
    return NextResponse.json(
      { error: "Unable to write log entry." },
      { status: 500 },
    );
  }
}
