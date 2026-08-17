import Link from "next/link";
import { Check, Clock, Sparkles } from "lucide-react";
import type { RemodelPackage } from "@/lib/public-data";

interface PackagesSectionProps {
  packages: RemodelPackage[];
  sectionId?: string;
}

export function PackagesSection({ packages, sectionId = "packages" }: PackagesSectionProps) {
  if (packages.length === 0) return null;

  return (
    <section id={sectionId} className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28 scroll-mt-24">
      <div className="max-w-3xl space-y-5">
        <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-6xl">
          Packages &amp; Pricing
        </h2>
        <div className="h-1.5 w-24 rounded-full bg-brand-secondary" />
        <p className="text-lg lg:text-xl leading-relaxed text-brand-textDark/70">
          Four levels of work, priced by scope. These ranges are starting points —
          your written quote comes out of the free in-home assessment, so the
          number reflects your bathroom instead of an average one.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        {packages.map((pkg) => (
          <article
            key={pkg.id}
            id={pkg.id}
            className={`relative flex flex-col rounded-[32px] border bg-white/85 p-8 shadow-xl transition-shadow scroll-mt-28 hover:shadow-2xl lg:p-10 ${
              pkg.featured ? "border-brand-secondary/60 ring-2 ring-brand-secondary/25" : "border-white/70"
            }`}
          >
            {pkg.featured ? (
              <span className="absolute -top-3.5 left-8 inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                <Sparkles className="h-3.5 w-3.5" />
                Most Requested
              </span>
            ) : null}

            <p className="text-sm font-bold uppercase tracking-widest text-brand-primary">
              {pkg.label}
            </p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-brand-textDark lg:text-4xl">
              {pkg.title}
            </h3>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-2xl bg-brand-primary px-5 py-2.5 text-lg font-bold text-white">
                {pkg.price}
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary/10 px-4 py-2.5 text-sm font-bold text-brand-primary">
                <Clock className="h-4 w-4" />
                {pkg.timeline}
              </span>
            </div>

            <p className="mt-6 text-lg leading-relaxed text-brand-textDark/75 font-medium">
              {pkg.summary}
            </p>

            <ul className="mt-6 space-y-3.5 border-t border-brand-textDark/5 pt-6">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-brand-secondary" />
                  <span className="text-base lg:text-lg leading-relaxed text-brand-textDark/80">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <div className="rounded-2xl bg-brand-bgLight p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-textDark/50">
                  Best for
                </p>
                <p className="mt-2 text-base lg:text-lg leading-relaxed text-brand-textDark/80">
                  {pkg.bestFor}
                </p>
              </div>
              <Link
                href={`/?service=${encodeURIComponent(pkg.title)}#contact`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary py-4 px-4 text-base lg:text-lg font-bold text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-brand-primary-dark active:scale-95"
              >
                Ask about this package <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-10 max-w-3xl text-sm lg:text-base leading-relaxed text-brand-textDark/50">
        Pricing shown is an estimate range and timelines are typical durations, not
        guarantees. Both depend on existing plumbing, structural conditions, fixture
        selections, permitting, and material availability. Every quote is written and
        itemized before work begins. Grab bars and fixtures are installed to ADA
        dimensional specifications where the space allows; ADA itself governs public
        accommodations rather than private homes, so a residential bathroom is not
        certified as ADA-compliant.
      </p>
    </section>
  );
}
