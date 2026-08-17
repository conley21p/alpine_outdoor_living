import { MessageSquare, Phone } from "lucide-react";
import { publicConfig } from "@/lib/config";

const digits = publicConfig.businessPhone.replace(/\D/g, "");

/**
 * Sits directly above the contact form for people who would rather not fill
 * one out — plenty of this audience will reach for the phone instead, and
 * adult children coordinating for a parent often prefer a text.
 */
export function CallOrTextBanner() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-8 pb-4 lg:pt-12">
      <div className="rounded-[32px] border border-brand-primary/15 bg-white/85 p-8 text-center shadow-lg lg:p-12">
        <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-brand-textDark">
          Prefer to skip the form? Call or text us.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg lg:text-xl leading-relaxed text-brand-textDark/70">
          Reach us at{" "}
          <a
            href={`tel:${digits}`}
            className="font-bold text-brand-primary hover:underline"
          >
            {publicConfig.businessPhone}
          </a>{" "}
          — calls and texts both come to the same number. Send a photo of the
          bathroom if you have one; it helps us point you to the right package
          before we ever visit.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`tel:${digits}`}
            className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-2xl bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-brand-primary-dark active:scale-95"
          >
            <Phone className="h-5 w-5" />
            Call {publicConfig.businessPhone}
          </a>
          <a
            href={`sms:${digits}`}
            className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-2xl border border-brand-primary/25 bg-white px-8 py-4 text-lg font-bold text-brand-primary transition-all hover:border-brand-primary active:scale-95"
          >
            <MessageSquare className="h-5 w-5" />
            Text us
          </a>
        </div>
      </div>
    </section>
  );
}
