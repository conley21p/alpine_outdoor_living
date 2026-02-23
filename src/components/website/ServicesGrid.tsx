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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-brand-textDark sm:text-4xl">Services</h2>
          <p className="mt-2 text-base text-gray-600">Professional outdoor services for your property</p>
        </div>
        {previewOnly && (
          <Link href="/services" className="group flex items-center gap-1 text-sm font-bold text-brand-primary transition-colors hover:text-brand-accent">
            See all
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article 
            key={service} 
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 text-xl text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
              ●
            </div>
            <h3 className="text-xl font-bold text-brand-textDark">{service}</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Professional {service.toLowerCase()} delivered with reliable scheduling and high-quality results.
            </p>
            <Link 
              href="/contact" 
              className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand-primary transition-colors hover:text-brand-accent"
            >
              Get a Quote
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
