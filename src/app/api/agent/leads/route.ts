import { NextRequest, NextResponse } from "next/server";
import { validateAgentKey } from "@/lib/agent-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { writeAgentLog } from "@/lib/agent-log";

interface CreateLeadPayload {
  contactId?: string;
  serviceNeeded?: string;
  preferredDate?: string;
  message?: string;
  source?: string;
  agentNotes?: string;
}

interface UpdateLeadPayload {
  id?: string;
  status?: string;
  agentNotes?: string;
  assignedTo?: string;
}

const clean = (value?: string) => value?.trim() || "";

export async function GET(request: NextRequest) {
  const unauthorized = validateAgentKey(request);
  if (unauthorized) return unauthorized;

  try {
    const params = request.nextUrl.searchParams;
    const status = clean(params.get("status") || "");
    const contactId = clean(params.get("contactId") || "");
    const limit = Math.min(Number(params.get("limit") || 25), 100);
    const offset = Math.max(Number(params.get("offset") || 0), 0);

    let query = getSupabaseAdmin()
      .from("leads")
      .select("*, contacts(first_name,last_name,phone,email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (contactId) query = query.eq("contact_id", contactId);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      leads: data ?? [],
      total: count ?? 0,
    });
  } catch (error) {
    console.error("Agent leads GET error", error);
    return NextResponse.json({ error: "Unable to fetch leads." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = validateAgentKey(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as CreateLeadPayload;
    const contactId = clean(body.contactId);
    if (!contactId) {
      return NextResponse.json(
        { error: "contactId is required." },
        { status: 400 },
      );
    }

    const { data, error } = await getSupabaseAdmin()
      .from("leads")
      .insert({
        contact_id: contactId,
        service_needed: clean(body.serviceNeeded) || null,
        preferred_date: clean(body.preferredDate) || null,
        message: clean(body.message) || null,
        source: clean(body.source) || "manual",
        agent_notes: clean(body.agentNotes) || null,
        status: "new",
      })
      .select("id")
      .single();

    if (error) throw error;

    await writeAgentLog({
      action: "lead_created",
      entityType: "lead",
      entityId: data.id as string,
      description: `Agent created lead for contact ${contactId}`,
    });

    return NextResponse.json({ id: data.id, created: true });
  } catch (error) {
    console.error("Agent leads POST error", error);
    return NextResponse.json({ error: "Unable to create lead." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const unauthorized = validateAgentKey(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as UpdateLeadPayload;
    const id = clean(body.id);
    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (clean(body.status)) updates.status = clean(body.status);
    if (clean(body.agentNotes)) updates.agent_notes = clean(body.agentNotes);
    if (clean(body.assignedTo)) updates.assigned_to = clean(body.assignedTo);

    const { error } = await getSupabaseAdmin().from("leads").update(updates).eq("id", id);
    if (error) throw error;

    await writeAgentLog({
      action: "lead_updated",
      entityType: "lead",
      entityId: id,
      description: `Agent updated lead ${id}`,
      metadata: updates,
    });

    return NextResponse.json({ id, updated: true });
  } catch (error) {
    console.error("Agent leads PATCH error", error);
    return NextResponse.json({ error: "Unable to update lead." }, { status: 500 });
  }
}
