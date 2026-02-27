import { NextResponse } from "next/server";
import { publicConfig } from "@/lib/config";
import { leadAutoResponseTemplate, newLeadNotificationTemplate, sendEmail, } from "@/lib/email";
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

    const name = [firstName, lastName].filter(Boolean).join(" ");
    const leadId = `email-${Date.now()}`;

    // Send auto-response to the submitter if they provided email
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

    // Send notification email to AlpineOutdoorAgent@gmail.com
    const ownerEmail = publicConfig.businessEmail; // alpineoutdooragent@gmail.com
    const ownerTemplate = newLeadNotificationTemplate({
      name: name || firstName,
      serviceNeeded,
      phone,
      email,
      preferredDate,
      message,
      crmUrl: `${publicConfig.siteUrl}/admin/leads`,
    });

    await sendEmail({
      toEmail: ownerEmail,
      toName: publicConfig.businessName,
      subject: ownerTemplate.subject,
      bodyHtml: ownerTemplate.bodyHtml,
      bodyText: ownerTemplate.bodyText,
    });

    // Log the submission (no database storage)
    await writeAgentLog({
      action: "contact_form_submission",
      entityType: "lead",
      entityId: leadId,
      description: `Contact form submitted for ${serviceNeeded} (email only, no DB storage)`,
      metadata: {
        name,
        phone,
        email,
        serviceNeeded,
        preferredDate,
        message,
        source: "website_form",
      },
      status: "success",
    });

    return NextResponse.json({ success: true, leadId });
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json(
      { error: "Unable to process contact form submission." },
      { status: 500 },
    );
  }
}
