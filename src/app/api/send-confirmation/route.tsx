import { Resend } from "resend";
import { NextResponse } from "next/server";
import { ConfirmationEmail } from "@/components/email/ConfirmationEmail";
import * as React from "react";
import { publicConfig } from "@/lib/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, firstName, service } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "Alpine Outdoor Living <no-reply@alpineoutdoorlivingllc.com>",
      to: [email],
      subject: "We've received your request - Alpine Outdoor Living",
      react: ConfirmationEmail({ firstName, service }),
      text: `Hi ${firstName}, Thank you for reaching out to us about your ${service} project. We've received your request and are excited to help you transform your outdoor space. Austin or a member of our design team will review your details and get back with you within 24-48 hours to discuss the next steps. Please Contact info@alpineoutdoorlivingllc.com or ${publicConfig.businessPhone} with any questions.`,
    });

    if (error) {
      console.error("[RESEND API ERROR DETAILS]:", JSON.stringify(error, null, 2));
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log(`[RESEND SUCCESS] Confirmation email sent to: ${email}`);
    return NextResponse.json({ data });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[API ROUTE FATAL ERROR]:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
