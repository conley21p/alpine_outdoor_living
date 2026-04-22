import { Resend } from "resend";
import { NextResponse } from "next/server";
import { ConfirmationEmail } from "@/components/email/ConfirmationEmail";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, firstName, service } = await request.json();
    console.log("[DEBUG] Received confirmation request for:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "Alpine Outdoor Living <notifications@alpineoutdoorlivingllc.com>",
      to: [email],
      subject: "We've received your request - Alpine Outdoor Living",
      react: <ConfirmationEmail firstName={firstName} service={service} />,
    });

    if (error) {
      console.error("[RESEND ERROR]", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log(`[RESEND SUCCESS] Confirmation email sent to: ${email}`);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[API ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
