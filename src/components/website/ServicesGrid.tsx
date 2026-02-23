import Link from "next/link";
import { publicConfig } from "@/lib/config";

interface ServicesGridProps {
  previewOnly?: boolean;
}

export function ServicesGrid({ previewOnly = false }: ServicesGridProps) {
  const services = previewOnly
    ? publicConfig.servicesOffered.slice(0, 3)
    : publicConfig.servicesOffered;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-brand-textDark">Services</h2>
        {previewOnly && (
          <Link href="/services" className="text-sm font-semibold text-brand-secondary">
            See all services
          </Link>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article key={service} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-bgLight text-brand-secondary">
              ●
            </div>
            <h3 className="text-lg font-semibold text-brand-textDark">{service}</h3>
            <p className="mt-2 text-sm text-slate-600">
              Professional {service.toLowerCase()} delivered with reliable scheduling and high-quality results.
            </p>
            <Link href="/contact" className="mt-4 inline-block text-sm font-semibold text-brand-secondary">
              Get a Quote
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
