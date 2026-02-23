import { NextRequest, NextResponse } from "next/server";
import { validateAgentKey } from "@/lib/agent-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { writeAgentLog } from "@/lib/agent-log";

interface CreateContactPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  source?: string;
  notes?: string;
}

const clean = (value?: string) => value?.trim() || "";

export async function GET(request: NextRequest) {
  const unauthorized = validateAgentKey(request);
  if (unauthorized) return unauthorized;

  try {
    const searchParams = request.nextUrl.searchParams;
    const search = clean(searchParams.get("search") || "");
    const status = clean(searchParams.get("status") || "");
    const limit = Math.min(Number(searchParams.get("limit") || 25), 100);
    const offset = Math.max(Number(searchParams.get("offset") || 0), 0);

    let query = getSupabaseAdmin()
      .from("contacts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
      );
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      contacts: data ?? [],
      total: count ?? 0,
    });
  } catch (error) {
    console.error("Agent contacts GET error", error);
    return NextResponse.json(
      { error: "Unable to fetch contacts." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = validateAgentKey(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as CreateContactPayload;
    const firstName = clean(body.firstName);
    if (!firstName) {
      return NextResponse.json(
        { error: "firstName is required." },
        { status: 400 },
      );
    }

    const payload = {
      first_name: firstName,
      last_name: clean(body.lastName) || null,
      phone: clean(body.phone) || null,
      email: clean(body.email).toLowerCase() || null,
      source: clean(body.source) || "manual",
      notes: clean(body.notes) || null,
      status: "active",
    };

    const { data, error } = await getSupabaseAdmin()
      .from("contacts")
      .insert(payload)
      .select("id")
      .single();

    if (error) throw error;

    await writeAgentLog({
      action: "contact_created",
      entityType: "contact",
      entityId: data.id as string,
      description: `Agent created contact ${firstName}`,
      status: "success",
    });

    return NextResponse.json({ id: data.id, created: true });
  } catch (error) {
    console.error("Agent contacts POST error", error);
    return NextResponse.json(
      { error: "Unable to create contact." },
      { status: 500 },
    );
  }
}
