import { NextResponse } from "next/server";
import { getServerConfig, publicConfig } from "@/lib/config";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  leadAutoResponseTemplate,
  newLeadNotificationTemplate,
  sendEmail,
} from "@/lib/email";
import { writeAgentLog } from "@/lib/agent-log";

interface ContactPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  serviceNeeded?: string;
  preferredDate?: string;
  message?: string;
}

const normalize = (value?: string) => value?.trim() || "";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const firstName = normalize(body.firstName);
    const lastName = normalize(body.lastName);
    const phone = normalize(body.phone);
    const email = normalize(body.email).toLowerCase();
    const serviceNeeded = normalize(body.serviceNeeded);
    const preferredDate = normalize(body.preferredDate);
    const message = normalize(body.message);

    const errors: Record<string, string> = {};
    if (!firstName) {
      errors.firstName = "First name is required.";
    }
    if (!serviceNeeded) {
      errors.serviceNeeded = "Service selection is required.";
    }
    if (!phone && !email) {
      errors.contact = "Phone or email is required.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    let contactId: string | null = null;
    if (email) {
      const { data } = await supabase
        .from("contacts")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      const existingContact = (data as { id: string } | null) ?? null;
      contactId = existingContact?.id ?? null;
    }
    if (!contactId && phone) {
      const { data } = await supabase
        .from("contacts")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();
      const existingContact = (data as { id: string } | null) ?? null;
      contactId = existingContact?.id ?? null;
    }

    if (contactId) {
      const { error } = await supabase
        .from("contacts")
        .update({
          first_name: firstName,
          last_name: lastName || null,
          phone: phone || null,
          email: email || null,
          source: "website_form",
        })
        .eq("id", contactId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from("contacts")
        .insert({
          first_name: firstName,
          last_name: lastName || null,
          phone: phone || null,
          email: email || null,
          source: "website_form",
          status: "active",
        })
        .select("id")
        .single();
      if (error) throw error;
      contactId = data.id as string;
    }

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        contact_id: contactId,
        service_needed: serviceNeeded,
        preferred_date: preferredDate || null,
        message: message || null,
        status: "new",
        source: "website_form",
      })
      .select("id")
      .single();

    if (leadError) throw leadError;
    const leadRow = lead as { id: string };

    const { adminEmail } = getServerConfig();
    const ownerEmail = adminEmail || publicConfig.businessEmail;
    const name = [firstName, lastName].filter(Boolean).join(" ");
    const crmUrl = `${publicConfig.siteUrl}/admin/leads`;

    if (email) {
      const autoTemplate = leadAutoResponseTemplate({ name: firstName });
      void sendEmail({
        toEmail: email,
        toName: name || firstName,
        subject: autoTemplate.subject,
        bodyHtml: autoTemplate.bodyHtml,
        bodyText: autoTemplate.bodyText,
      }).catch(() => undefined);
    }

    const ownerTemplate = newLeadNotificationTemplate({
      name: name || firstName,
      serviceNeeded,
      phone,
      email,
      preferredDate,
      message,
      crmUrl,
    });
    void sendEmail({
      toEmail: ownerEmail,
      toName: publicConfig.businessName,
      subject: ownerTemplate.subject,
      bodyHtml: ownerTemplate.bodyHtml,
      bodyText: ownerTemplate.bodyText,
    }).catch(() => undefined);

    await writeAgentLog({
      action: "contact_form_submission",
      entityType: "lead",
      entityId: leadRow.id,
      description: `Contact form submitted for ${serviceNeeded}`,
      metadata: {
        contactId,
        source: "website_form",
      },
      status: "success",
    });

    return NextResponse.json({
      success: true,
      leadId: leadRow.id,
    });
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json(
      { error: "Unable to process contact form submission." },
      { status: 500 },
    );
  }
}
