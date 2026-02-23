import { NextRequest, NextResponse } from "next/server";
import { validateAgentKey } from "@/lib/agent-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { writeAgentLog } from "@/lib/agent-log";
import { sendEmail } from "@/lib/email";
import { getServerConfig, publicConfig } from "@/lib/config";

interface CreateAgentEmailPayload {
  toEmail?: string;
  toName?: string;
  subject?: string;
  bodyHtml?: string;
  bodyText?: string;
  contactId?: string;
  type?: "agent_draft";
}

const clean = (value?: string) => value?.trim() || "";

export async function POST(request: NextRequest) {
  const unauthorized = validateAgentKey(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as CreateAgentEmailPayload;
    const toEmail = clean(body.toEmail).toLowerCase();
    const subject = clean(body.subject);
    const bodyHtml = clean(body.bodyHtml);

    if (!toEmail || !subject || !bodyHtml) {
      return NextResponse.json(
        { error: "toEmail, subject, and bodyHtml are required." },
        { status: 400 },
      );
    }

    const { data, error } = await getSupabaseAdmin()
      .from("email_queue")
      .insert({
        to_email: toEmail,
        to_name: clean(body.toName) || null,
        subject,
        body_html: bodyHtml,
        body_text: clean(body.bodyText) || null,
        status: "pending_approval",
        type: body.type || "agent_draft",
        contact_id: clean(body.contactId) || null,
      })
      .select("id")
      .single();
    if (error) throw error;

    const { adminEmail } = getServerConfig();
    const ownerEmail = adminEmail || publicConfig.businessEmail;
    void sendEmail({
      toEmail: ownerEmail,
      toName: publicConfig.businessName,
      subject: `Email Approval Needed: ${subject}`,
      bodyHtml: `
        <div style="font-family:Arial,Helvetica,sans-serif;">
          <h2>Email pending approval</h2>
          <p><strong>To:</strong> ${toEmail}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p>Review it in your CRM queue:</p>
          <p><a href="${publicConfig.siteUrl}/admin/emails">${publicConfig.siteUrl}/admin/emails</a></p>
        </div>
      `,
      bodyText: `Email pending approval\nTo: ${toEmail}\nSubject: ${subject}\nReview: ${publicConfig.siteUrl}/admin/emails`,
    }).catch(() => undefined);

    await writeAgentLog({
      action: "email_drafted",
      entityType: "email",
      entityId: data.id as string,
      description: `Agent drafted email to ${toEmail}`,
    });

    return NextResponse.json({ id: data.id, status: "pending_approval" });
  } catch (error) {
    console.error("Agent emails POST error", error);
    return NextResponse.json(
      { error: "Unable to queue email draft." },
      { status: 500 },
    );
  }
}
