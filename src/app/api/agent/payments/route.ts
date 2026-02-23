import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { validateAgentKey } from "@/lib/agent-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { writeAgentLog } from "@/lib/agent-log";
import { getServerConfig, publicConfig } from "@/lib/config";
import { paymentApprovalRequestTemplate, sendEmail } from "@/lib/email";
import { sendPaymentAlertSms } from "@/lib/sms";

interface CreatePaymentPayload {
  amount?: number;
  vendor?: string;
  reason?: string;
  notes?: string;
}

const clean = (value?: string) => value?.trim() || "";

export async function POST(request: NextRequest) {
  const unauthorized = validateAgentKey(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as CreatePaymentPayload;
    const amount = body.amount;
    const vendor = clean(body.vendor);
    const reason = clean(body.reason);

    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "amount must be a positive number." },
        { status: 400 },
      );
    }
    if (!vendor || !reason) {
      return NextResponse.json(
        { error: "vendor and reason are required." },
        { status: 400 },
      );
    }

    const approvalToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    const { data, error } = await getSupabaseAdmin()
      .from("payment_requests")
      .insert({
        amount,
        vendor,
        reason,
        notes: clean(body.notes) || null,
        status: "pending",
        approval_token: approvalToken,
        expires_at: expiresAt,
      })
      .select("id")
      .single();
    if (error) throw error;

    const template = paymentApprovalRequestTemplate({
      amount,
      vendor,
      reason,
      approvalToken,
    });
    const { adminEmail } = getServerConfig();
    const ownerEmail = adminEmail || publicConfig.businessEmail;

    void sendEmail({
      toEmail: ownerEmail,
      toName: publicConfig.businessName,
      subject: template.subject,
      bodyHtml: template.bodyHtml,
      bodyText: template.bodyText,
    }).catch(() => undefined);

    const sms = `Payment approval needed: $${amount.toFixed(2)} for ${vendor}. Review in email or ${publicConfig.siteUrl}/admin/payments`;
    void sendPaymentAlertSms(sms).catch(() => undefined);

    await writeAgentLog({
      action: "payment_requested",
      entityType: "payment",
      entityId: data.id as string,
      description: `Agent requested payment of $${amount.toFixed(2)} to ${vendor}`,
      metadata: { expiresAt },
    });

    return NextResponse.json({
      id: data.id,
      status: "pending",
      expiresAt,
    });
  } catch (error) {
    console.error("Agent payments POST error", error);
    return NextResponse.json(
      { error: "Unable to create payment request." },
      { status: 500 },
    );
  }
}
