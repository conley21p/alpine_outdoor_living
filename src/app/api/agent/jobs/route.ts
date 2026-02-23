import { NextRequest, NextResponse } from "next/server";
import { validateAgentKey } from "@/lib/agent-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { writeAgentLog } from "@/lib/agent-log";

interface CreateJobPayload {
  contactId?: string;
  appointmentId?: string;
  title?: string;
  service?: string;
  assignedTo?: string;
  scheduledDate?: string;
  invoiceAmount?: number;
  notes?: string;
}

interface UpdateJobPayload {
  id?: string;
  status?: string;
  assignedTo?: string;
  scheduledDate?: string;
  completedDate?: string;
  invoiceAmount?: number;
  paidAmount?: number;
  notes?: string;
}

const clean = (value?: string) => value?.trim() || "";

export async function GET(request: NextRequest) {
  const unauthorized = validateAgentKey(request);
  if (unauthorized) return unauthorized;

  try {
    const params = request.nextUrl.searchParams;
    const status = clean(params.get("status") || "");
    const limit = Math.min(Number(params.get("limit") || 25), 100);
    const offset = Math.max(Number(params.get("offset") || 0), 0);

    let query = getSupabaseAdmin()
      .from("jobs")
      .select("*, contacts(first_name,last_name,phone,email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (status) query = query.eq("status", status);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ jobs: data ?? [], total: count ?? 0 });
  } catch (error) {
    console.error("Agent jobs GET error", error);
    return NextResponse.json({ error: "Unable to fetch jobs." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = validateAgentKey(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as CreateJobPayload;
    const title = clean(body.title);
    if (!title) {
      return NextResponse.json(
        { error: "title is required." },
        { status: 400 },
      );
    }

    const { data, error } = await getSupabaseAdmin()
      .from("jobs")
      .insert({
        contact_id: clean(body.contactId) || null,
        appointment_id: clean(body.appointmentId) || null,
        title,
        service: clean(body.service) || null,
        assigned_to: clean(body.assignedTo) || null,
        scheduled_date: clean(body.scheduledDate) || null,
        invoice_amount:
          typeof body.invoiceAmount === "number" ? body.invoiceAmount : null,
        notes: clean(body.notes) || null,
        status: "pending",
      })
      .select("id")
      .single();
    if (error) throw error;

    await writeAgentLog({
      action: "job_created",
      entityType: "job",
      entityId: data.id as string,
      description: `Agent created job ${title}`,
    });

    return NextResponse.json({ id: data.id, created: true });
  } catch (error) {
    console.error("Agent jobs POST error", error);
    return NextResponse.json({ error: "Unable to create job." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const unauthorized = validateAgentKey(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as UpdateJobPayload;
    const id = clean(body.id);
    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (clean(body.status)) updates.status = clean(body.status);
    if (clean(body.assignedTo)) updates.assigned_to = clean(body.assignedTo);
    if (clean(body.scheduledDate)) updates.scheduled_date = clean(body.scheduledDate);
    if (clean(body.completedDate)) updates.completed_date = clean(body.completedDate);
    if (typeof body.invoiceAmount === "number") updates.invoice_amount = body.invoiceAmount;
    if (typeof body.paidAmount === "number") updates.paid_amount = body.paidAmount;
    if (clean(body.notes)) updates.notes = clean(body.notes);

    const { error } = await getSupabaseAdmin().from("jobs").update(updates).eq("id", id);
    if (error) throw error;

    await writeAgentLog({
      action: "job_updated",
      entityType: "job",
      entityId: id,
      description: `Agent updated job ${id}`,
      metadata: updates,
    });

    return NextResponse.json({ id, updated: true });
  } catch (error) {
    console.error("Agent jobs PATCH error", error);
    return NextResponse.json({ error: "Unable to update job." }, { status: 500 });
  }
}
