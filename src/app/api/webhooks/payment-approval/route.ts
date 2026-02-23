import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifyPaymentApprovalSignature } from "@/lib/payment-approval";
import { writeAgentLog } from "@/lib/agent-log";

type PaymentWebhookRow = {
  id: string;
  status: string;
  expires_at: string | null;
};

const html = (title: string, message: string, success = true) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; margin: 0; background: #f3f5f7; color: #111827; }
      .card { max-width: 560px; margin: 48px auto; background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb; }
      h1 { margin-top: 0; color: ${success ? "#166534" : "#991b1b"}; }
      p { line-height: 1.6; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${title}</h1>
      <p>${message}</p>
    </div>
  </body>
</html>`;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim() || "";
  const actionRaw = request.nextUrl.searchParams.get("action")?.trim() || "";
  const sig = request.nextUrl.searchParams.get("sig")?.trim() || "";
  const action = actionRaw === "approve" || actionRaw === "deny" ? actionRaw : "";

  if (!token || !action) {
    return new NextResponse(
      html("Invalid request", "Missing token or action.", false),
      {
        status: 400,
        headers: { "content-type": "text/html; charset=utf-8" },
      },
    );
  }

  if (!verifyPaymentApprovalSignature(token, action, sig)) {
    return new NextResponse(
      html("Verification failed", "This approval link is not valid.", false),
      {
        status: 401,
        headers: { "content-type": "text/html; charset=utf-8" },
      },
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: payment, error } = await supabase
      .from("payment_requests")
      .select("*")
      .eq("approval_token", token)
      .maybeSingle();
    const paymentRow = (payment as PaymentWebhookRow | null) ?? null;

    if (error || !paymentRow) {
      return new NextResponse(
        html(
          "Request not found",
          "This payment request could not be found or was already processed.",
          false,
        ),
        {
          status: 404,
          headers: { "content-type": "text/html; charset=utf-8" },
        },
      );
    }

    if (paymentRow.status !== "pending") {
      return new NextResponse(
        html(
          "Already processed",
          "This payment request has already been approved or denied.",
          false,
        ),
        {
          status: 409,
          headers: { "content-type": "text/html; charset=utf-8" },
        },
      );
    }

    if (paymentRow.expires_at && new Date(paymentRow.expires_at) <= new Date()) {
      await supabase
        .from("payment_requests")
        .update({ status: "expired", expires_at: new Date().toISOString() })
        .eq("id", paymentRow.id);
      return new NextResponse(
        html("Link expired", "This approval link has expired.", false),
        {
          status: 410,
          headers: { "content-type": "text/html; charset=utf-8" },
        },
      );
    }

    const now = new Date().toISOString();
    const updatePayload: Record<string, unknown> =
      action === "approve"
        ? { status: "approved", approved_at: now, expires_at: now }
        : { status: "denied", expires_at: now };

    const { error: updateError } = await supabase
      .from("payment_requests")
      .update(updatePayload)
      .eq("id", paymentRow.id);
    if (updateError) throw updateError;

    await writeAgentLog({
      action: action === "approve" ? "payment_approved" : "payment_denied",
      entityType: "payment",
      entityId: paymentRow.id,
      description:
        action === "approve"
          ? `Payment request ${paymentRow.id} approved by owner`
          : `Payment request ${paymentRow.id} denied by owner`,
      metadata: { tokenUsed: true },
      status: "success",
    });

    return new NextResponse(
      html(
        action === "approve" ? "Payment approved" : "Payment denied",
        action === "approve"
          ? "The payment request has been approved and the token is now invalid."
          : "The payment request has been denied and the token is now invalid.",
      ),
      {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("Payment approval webhook error", error);
    return new NextResponse(
      html(
        "Server error",
        "An unexpected error occurred while processing this request.",
        false,
      ),
      {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      },
    );
  }
}
