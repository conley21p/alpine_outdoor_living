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
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-5 sm:px-6 lg:px-8 sm:py-16">
        <div className="sm:col-span-2">
          <h1 className="text-3xl font-black text-brand-textDark sm:text-4xl">Contact Details</h1>
          <p className="mt-4 text-base leading-relaxed text-gray-600">{publicConfig.businessDescription}</p>

          <div className="mt-8 space-y-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 shadow-card">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                📞
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Phone</p>
                <a href={`tel:${publicConfig.businessPhone}`} className="mt-1 block font-bold text-brand-primary hover:text-brand-accent">
                  {publicConfig.businessPhone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                ✉️
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email</p>
                <a href={`mailto:${publicConfig.businessEmail}`} className="mt-1 block font-bold text-brand-primary hover:text-brand-accent">
                  {publicConfig.businessEmail}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                📍
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Address</p>
                <p className="mt-1 font-bold text-gray-700">
                  {publicConfig.businessAddress}
                  <br />
                  {publicConfig.businessCity}, {publicConfig.businessState} {publicConfig.businessZip}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:col-span-3">
          <ContactForm />
        </div>
      </section>
    </SiteShell>
  );
}
