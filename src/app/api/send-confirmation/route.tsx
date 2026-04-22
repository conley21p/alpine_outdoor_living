import { Resend } from "resend";
import { NextResponse } from "next/server";
import { ConfirmationEmail } from "@/components/email/ConfirmationEmail";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, firstName, service } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "Alpine Outdoor Living <notifications@alpineoutdoorlivingllc.com>",
      to: [email],
      subject: "We've received your request - Alpine Outdoor Living",
      react: ConfirmationEmail({ firstName, service }),
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
