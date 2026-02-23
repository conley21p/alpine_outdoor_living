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
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-brand-primary/5 to-white p-6 text-center shadow-card sm:p-8">
          <p className="text-lg font-medium text-gray-700">
            Need help deciding? Call us at{" "}
            <a href={`tel:${publicConfig.businessPhone}`} className="font-bold text-brand-primary hover:text-brand-accent">
              {publicConfig.businessPhone}
            </a>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
