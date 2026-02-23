import { SiteShell } from "@/components/website/SiteShell";
import { ServicesGrid } from "@/components/website/ServicesGrid";
import { publicConfig } from "@/lib/config";
import { PageHeroBanner } from "@/components/website/PageHeroBanner";

export default function ServicesPage() {
  return (
    <SiteShell>
      <PageHeroBanner
        slot="servicesHero"
        title="Our Services"
        subtitle="Explore our full service catalog and request a quote for the service you need."
      />
      <ServicesGrid />
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="rounded-xl bg-brand-bgLight p-5 text-sm text-slate-700">
          Need help deciding? Call us at{" "}
          <a href={`tel:${publicConfig.businessPhone}`} className="font-semibold text-brand-primary">
            {publicConfig.businessPhone}
          </a>
          .
        </div>
      </section>
    </SiteShell>
  );
}
