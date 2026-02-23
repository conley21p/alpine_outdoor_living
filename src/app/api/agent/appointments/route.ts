import { NextRequest, NextResponse } from "next/server";
import { validateAgentKey } from "@/lib/agent-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { writeAgentLog } from "@/lib/agent-log";
import { createGoogleCalendarEvent } from "@/lib/google-calendar";
import { appointmentConfirmationTemplate, sendEmail } from "@/lib/email";

interface CreateAppointmentPayload {
  contactId?: string;
  leadId?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  service?: string;
  assignedTo?: string;
  notes?: string;
}

interface UpdateAppointmentPayload {
  id?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  service?: string;
  assignedTo?: string;
  status?: string;
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
      .from("appointments")
      .select("*, contacts(first_name,last_name,email,phone)", { count: "exact" })
      .order("start_time", { ascending: true })
      .range(offset, offset + limit - 1);
    if (status) query = query.eq("status", status);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ appointments: data ?? [], total: count ?? 0 });
  } catch (error) {
    console.error("Agent appointments GET error", error);
    return NextResponse.json(
      { error: "Unable to fetch appointments." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = validateAgentKey(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as CreateAppointmentPayload;
    const contactId = clean(body.contactId);
    const title = clean(body.title);
    const startTime = clean(body.startTime);

    if (!contactId || !title || !startTime) {
      return NextResponse.json(
        { error: "contactId, title, and startTime are required." },
        { status: 400 },
      );
    }

    const assignedTo = clean(body.assignedTo);
    let assignedCalendarId: string | undefined;
    if (assignedTo) {
      const { data } = await getSupabaseAdmin()
        .from("employees")
        .select("google_calendar_id")
        .eq("name", assignedTo)
        .maybeSingle();
      const employee = (data as { google_calendar_id?: string | null } | null) ?? null;
      assignedCalendarId = employee?.google_calendar_id || undefined;
    }

    const googleEventId = await createGoogleCalendarEvent({
      title,
      startTime,
      endTime: clean(body.endTime) || undefined,
      address: clean(body.address) || undefined,
      description: clean(body.notes) || undefined,
      assignedToCalendarId: assignedCalendarId,
    });

    const insertPayload = {
      contact_id: contactId,
      lead_id: clean(body.leadId) || null,
      title,
      start_time: startTime,
      end_time: clean(body.endTime) || null,
      address: clean(body.address) || null,
      service: clean(body.service) || null,
      assigned_to: assignedTo || null,
      notes: clean(body.notes) || null,
      status: "scheduled",
      google_event_id: googleEventId,
    };

    const { data, error } = await getSupabaseAdmin()
      .from("appointments")
      .insert(insertPayload)
      .select("id")
      .single();
    if (error) throw error;

    const { data: contact } = await getSupabaseAdmin()
      .from("contacts")
      .select("first_name,last_name,email")
      .eq("id", contactId)
      .maybeSingle();
    const contactRow =
      (contact as {
        first_name: string;
        last_name: string | null;
        email: string | null;
      } | null) ?? null;

    if (contactRow?.email) {
      const fullName = [contactRow.first_name, contactRow.last_name]
        .filter(Boolean)
        .join(" ");
      const template = appointmentConfirmationTemplate({
        name: fullName || contactRow.first_name,
        service: clean(body.service) || title,
        dateTime: new Date(startTime).toLocaleString(),
        address: clean(body.address) || undefined,
      });
      void sendEmail({
        toEmail: contactRow.email,
        toName: fullName || contactRow.first_name,
        subject: template.subject,
        bodyHtml: template.bodyHtml,
        bodyText: template.bodyText,
      }).catch(() => undefined);
    }

    await writeAgentLog({
      action: "appointment_created",
      entityType: "appointment",
      entityId: data.id as string,
      description: `Agent created appointment ${title}`,
      metadata: { googleEventId },
    });

    return NextResponse.json({
      id: data.id,
      googleEventId,
      created: true,
    });
  } catch (error) {
    console.error("Agent appointments POST error", error);
    return NextResponse.json(
      { error: "Unable to create appointment." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const unauthorized = validateAgentKey(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as UpdateAppointmentPayload;
    const id = clean(body.id);
    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (clean(body.title)) updates.title = clean(body.title);
    if (clean(body.startTime)) updates.start_time = clean(body.startTime);
    if (clean(body.endTime)) updates.end_time = clean(body.endTime);
    if (clean(body.address)) updates.address = clean(body.address);
    if (clean(body.service)) updates.service = clean(body.service);
    if (clean(body.assignedTo)) updates.assigned_to = clean(body.assignedTo);
    if (clean(body.status)) updates.status = clean(body.status);
    if (clean(body.notes)) updates.notes = clean(body.notes);

    const { error } = await getSupabaseAdmin()
      .from("appointments")
      .update(updates)
      .eq("id", id);
    if (error) throw error;

    await writeAgentLog({
      action: "appointment_updated",
      entityType: "appointment",
      entityId: id,
      description: `Agent updated appointment ${id}`,
      metadata: updates,
    });

    return NextResponse.json({ id, updated: true });
  } catch (error) {
    console.error("Agent appointments PATCH error", error);
    return NextResponse.json(
      { error: "Unable to update appointment." },
      { status: 500 },
    );
  }
}
