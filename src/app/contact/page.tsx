import { SiteShell } from "@/components/website/SiteShell";
import { ContactForm } from "@/components/website/ContactForm";
import { publicConfig } from "@/lib/config";
import { PageHeroBanner } from "@/components/website/PageHeroBanner";

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHeroBanner
        slot="contactHero"
        title="Contact & Booking"
        subtitle="Send your details and we will follow up quickly to schedule service."
      />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:grid-cols-5 sm:px-6 sm:py-10">
        <div className="sm:col-span-2">
          <h1 className="text-2xl font-bold text-brand-textDark sm:text-3xl">Contact Details</h1>
          <p className="mt-3 text-sm text-slate-600">{publicConfig.businessDescription}</p>

          <div className="mt-6 space-y-2 rounded-xl border border-slate-200 bg-brand-bgLight p-4 text-sm text-slate-700">
            <p>
              <strong>Phone:</strong>{" "}
              <a href={`tel:${publicConfig.businessPhone}`} className="text-brand-primary">
                {publicConfig.businessPhone}
              </a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${publicConfig.businessEmail}`} className="text-brand-primary">
                {publicConfig.businessEmail}
              </a>
            </p>
            <p>
              <strong>Address:</strong> {publicConfig.businessAddress},{" "}
              {publicConfig.businessCity}, {publicConfig.businessState}{" "}
              {publicConfig.businessZip}
            </p>
          </div>
        </div>
        <div className="sm:col-span-3">
          <ContactForm />
        </div>
      </section>
    </SiteShell>
  );
}
