import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Clock,
  Home,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SiteShell } from "@/components/website/SiteShell";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { ContactFormLazy } from "@/components/website/ContactFormLazy";
import { publicConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Springfield Bathroom Remodels — Senior-Safe Services & Pricing",
  description:
    "Senior-safe bathroom remodel packages in Springfield, Illinois. Grab bars, walk-in showers, curbless entries and full universal design retrofits — with transparent pricing and a free in-home safety assessment.",
  alternates: {
    canonical: "/springfield-bathroom-remodels",
  },
  openGraph: {
    title: "Springfield Bathroom Remodels — Senior-Safe Services & Pricing",
    description:
      "Four senior-safe bathroom remodel packages for Springfield, IL homeowners, from same-day safety essentials to full universal design retrofits.",
  },
};

interface RemodelPackage {
  id: string;
  number: string;
  name: string;
  price: string;
  timeline: string;
  summary: string;
  features: string[];
  bestFor: string;
  featured?: boolean;
}

const packages: RemodelPackage[] = [
  {
    id: "safety-essentials",
    number: "Package 1",
    name: "Safety Essentials",
    price: "$650 – $1,800+",
    timeline: "Completed in 1 day",
    summary:
      "For clients who just need the highest-risk hazards fixed now, without a full remodel.",
    features: [
      "3–4 grab bars, professionally anchored into blocking (not just drywall anchors)",
      "Comfort-height toilet swap (17–19”)",
      "Handheld showerhead on a sliding bar",
      "Non-slip flooring treatment or slip-resistant bath mat",
      "Improved lighting (motion-sensor night light or brighter fixture)",
    ],
    bestFor:
      "Adult children who want their parent safer this week, or a pre-hospital-discharge fix.",
  },
  {
    id: "fast-track-shower-conversion",
    number: "Package 2",
    name: "Fast-Track Shower Conversion",
    price: "$6,500 – $10,500+",
    timeline: "Completed in 3–5 days",
    summary:
      "The most requested package: removes the fall hazard of climbing over a tub edge.",
    features: [
      "Full tub removal and disposal",
      "Prefab or acrylic walk-in shower base and wall surround",
      "Comfort-height toilet",
      "Lever-handle faucet (easier grip than knobs)",
      "Slip-resistant flooring",
      "2–3 ADA grab bars",
      "Licensed plumber for drain/valve relocation as needed",
    ],
    bestFor:
      "Clients who want a quick, contained project and don’t need custom tile.",
    featured: true,
  },
  {
    id: "custom-accessible-remodel",
    number: "Package 3",
    name: "Custom Accessible Remodel",
    price: "$11,000 – $18,000+",
    timeline: "Completed in 2–3 weeks",
    summary:
      "A fully personalized bathroom that still looks like a nice bathroom, not a medical fixture.",
    features: [
      "Curbless (zero-threshold) shower entry with linear drain",
      "Custom tile walls and floor, homeowner’s choice of style",
      "Fold-down bench (17–18” height)",
      "ADA grab bars at entry, wall, and bench",
      "Comfort-height toilet and accessible vanity with knee clearance",
      "Upgraded lighting and ventilation",
      "Thermostatic shower valve (prevents scalding)",
    ],
    bestFor:
      "Clients planning to stay in the home long-term who want it to look updated, not “medicalized.”",
  },
  {
    id: "full-universal-design-retrofit",
    number: "Package 4",
    name: "Full Universal Design Retrofit",
    price: "$19,000 – $28,000+",
    timeline: "Completed in 3–4 weeks",
    summary:
      "For wheelchair access or significant mobility needs, built to last through future stages of aging.",
    features: [
      "Doorway widened to 32”+ for walker/wheelchair clearance",
      "60”x60” curbless roll-in shower",
      "Reinforced walls for future grab bar placement anywhere needed",
      "Custom tile, vanity, and fixtures",
      "Structural, electrical, and plumbing coordination as required",
      "Optional: heated flooring, smart lighting",
    ],
    bestFor:
      "Clients with a diagnosed mobility condition, or planning ahead for a spouse or parent moving in.",
  },
];

const assessmentPoints = [
  "Walk the bathroom to identify fall risks — tub entry, flooring, lighting, and reach points",
  "Measure the space so pricing reflects your actual bathroom, not a generic estimate",
  "Recommend the package that fits the need and the budget, with no pressure to size up",
  "Introduce the broader Springboard Transitions services if you want more than the bathroom",
];

const springboardServices = [
  {
    title: "Downsizing Help",
    description:
      "Sorting, packing, and coordinating a move to a smaller home or community — at a pace that respects the person, not just the deadline.",
  },
  {
    title: "Whole-Home Safety",
    description:
      "Stair rails, entry ramps, doorway thresholds, and lighting throughout the house, so the bathroom isn’t the only safe room.",
  },
  {
    title: "Legacy Planning",
    description:
      "Organizing documents, photos, and heirlooms so families aren’t making these decisions under pressure later.",
  },
];

export default function SpringfieldBathroomRemodelsPage() {
  const telHref = `tel:${publicConfig.businessPhone.replace(/\D/g, "")}`;

  return (
    <SiteShell>
      <div id="top" className="relative bg-brand-bgLight scroll-mt-20">
        {/* Ambient Background Blur */}
        <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-brand-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-green-200/20 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-20">
          <Breadcrumbs items={[{ label: "Springfield Bathroom Remodels", href: "#top" }]} />

          {/* Hero */}
          <header className="max-w-4xl space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white/70 px-4 py-2 text-sm font-bold uppercase tracking-widest text-brand-primary">
              <Home className="h-4 w-4" />
              Springfield, Illinois
            </p>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tighter text-brand-textDark sm:text-5xl lg:text-7xl">
              Springfield Bathroom Remodels
            </h1>
            <div className="h-1.5 w-24 rounded-full bg-brand-primary" />
            <p className="text-xl font-medium leading-relaxed text-brand-textDark/80 lg:text-2xl">
              Including Senior Transitions — senior-safe bathroom remodel services
              and pricing, from a one-day grab bar install to a full universal
              design retrofit.
            </p>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
              <Link
                href="#assessment"
                className="inline-flex min-w-[240px] items-center justify-center rounded-full bg-brand-primary px-8 py-4 text-[17px] font-medium text-white shadow-lg transition-all hover:bg-brand-primary-dark hover:shadow-xl active:scale-95"
              >
                Book a Free Safety Assessment
              </Link>
              <a
                href={telHref}
                className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-full border border-brand-textDark/15 bg-white px-8 py-4 text-[17px] font-medium text-brand-textDark transition-all hover:border-brand-primary hover:text-brand-primary"
              >
                <Phone className="h-4 w-4" />
                {publicConfig.businessPhone}
              </a>
            </div>
          </header>

          {/* Free In-Home Safety Assessment */}
          <section id="assessment" className="mt-20 scroll-mt-24 lg:mt-28">
            <div className="glass-card-green rounded-[2.5rem] border border-white/40 p-8 shadow-2xl lg:p-14">
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5 space-y-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-lg">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-brand-textDark lg:text-4xl">
                    Free In-Home Safety Assessment
                  </h2>
                  <p className="text-lg leading-relaxed text-brand-textDark/70">
                    A no-cost, no-obligation visit to evaluate fall risks, measure
                    the bathroom, and recommend the right package. It’s also the
                    entry point into the broader Springboard Transitions services
                    if the client wants more than just the bathroom.
                  </p>
                  <a
                    href={telHref}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-7 py-3.5 text-[16px] font-medium text-white transition-all hover:bg-brand-primary-dark active:scale-95"
                  >
                    <Phone className="h-4 w-4" />
                    Call to schedule
                  </a>
                </div>
                <div className="lg:col-span-7">
                  <p className="text-sm font-bold uppercase tracking-widest text-brand-textDark/50">
                    What the visit covers
                  </p>
                  <ul className="mt-6 space-y-5">
                    {assessmentPoints.map((point) => (
                      <li key={point} className="flex items-start gap-4">
                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary">
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="text-lg leading-relaxed text-brand-textDark/80">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Packages */}
          <section id="packages" className="mt-24 scroll-mt-24 lg:mt-32">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-brand-textDark lg:text-5xl">
                Packages &amp; Pricing
              </h2>
              <p className="text-lg leading-relaxed text-brand-textDark/60">
                Four levels of work, priced by scope. Ranges are starting points —
                your written quote comes from the in-home assessment, so the number
                reflects your bathroom rather than an average one.
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {packages.map((pkg) => (
                <article
                  key={pkg.id}
                  id={pkg.id}
                  className={`relative flex flex-col rounded-[2rem] border bg-white/80 p-8 shadow-xl transition-all scroll-mt-28 hover:shadow-2xl lg:p-10 ${
                    pkg.featured
                      ? "border-brand-primary/50 ring-2 ring-brand-primary/20"
                      : "border-white/60"
                  }`}
                >
                  {pkg.featured ? (
                    <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                      <Sparkles className="h-3.5 w-3.5" />
                      Most Requested
                    </span>
                  ) : null}

                  <p className="text-sm font-bold uppercase tracking-widest text-brand-primary">
                    {pkg.number}
                  </p>
                  <h3 className="mt-2 text-3xl font-bold tracking-tight text-brand-textDark">
                    {pkg.name}
                  </h3>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="rounded-xl bg-brand-textDark px-4 py-2 text-lg font-bold text-white">
                      {pkg.price}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-xl bg-brand-primary/10 px-4 py-2 text-sm font-semibold text-brand-primary">
                      <Clock className="h-4 w-4" />
                      {pkg.timeline}
                    </span>
                  </div>

                  <p className="mt-6 text-lg leading-relaxed text-brand-textDark/70">
                    {pkg.summary}
                  </p>

                  <ul className="mt-6 space-y-3.5 border-t border-brand-textDark/5 pt-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="mt-1 h-4 w-4 flex-shrink-0 text-brand-primary" />
                        <span className="text-base leading-relaxed text-brand-textDark/80">
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
                      <p className="mt-2 text-base leading-relaxed text-brand-textDark/80">
                        {pkg.bestFor}
                      </p>
                    </div>
                    <Link
                      href="#contact"
                      className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-primary px-6 py-3.5 text-[16px] font-medium text-white transition-all hover:bg-brand-primary-dark active:scale-95"
                    >
                      Ask about {pkg.name}
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-10 max-w-3xl text-sm leading-relaxed text-brand-textDark/50">
              Pricing shown is an estimate range. Final cost depends on the existing
              plumbing, structural conditions, fixture selections, and any permits
              required. Every quote is written and itemized before work begins.
            </p>
          </section>

          {/* Springboard Transitions */}
          <section className="mt-24 lg:mt-32">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-brand-textDark lg:text-5xl">
                Beyond the Bathroom
              </h2>
              <p className="text-lg leading-relaxed text-brand-textDark/60">
                The bathroom is usually the first and most urgent fix. When a family
                needs more, the safety assessment opens into the wider Springboard
                Transitions services.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {springboardServices.map((service) => (
                <div
                  key={service.title}
                  className="rounded-[1.75rem] border border-white/60 bg-white/80 p-8 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-brand-textDark">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-brand-textDark/70">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="mt-24 scroll-mt-24 lg:mt-32">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark lg:text-6xl">
                  Request Your Free Assessment
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg text-brand-textDark/60 lg:text-xl">
                  Tell us a little about the bathroom and who it’s for. We’ll follow
                  up to schedule the in-home visit — or call{" "}
                  <a
                    href={telHref}
                    className="font-semibold text-brand-primary hover:underline"
                  >
                    {publicConfig.businessPhone}
                  </a>{" "}
                  if it’s urgent.
                </p>
              </div>
              <div className="glass-card-green rounded-[2.5rem] border border-white/40 p-8 shadow-2xl lg:p-12">
                <ContactFormLazy initialService="Other/Custom Project" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
