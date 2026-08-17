import Link from "next/link";
import { Check, Phone, ShieldCheck } from "lucide-react";
import { publicConfig } from "@/lib/config";

const assessmentPoints = [
  "Walk the bathroom to identify fall risks — tub entry, flooring, lighting, and reach points",
  "Measure the space so pricing reflects your actual bathroom, not a generic estimate",
  "Recommend the package that fits the need and the budget, with no pressure to size up",
  "Point out other fall risks we notice elsewhere in the home, whether or not we do that work",
];

export function AssessmentSection() {
  return (
    <section
      id="assessment"
      className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24 scroll-mt-24"
    >
      <div className="glass-card-green rounded-[40px] p-8 lg:p-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-lg">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter text-brand-textDark leading-tight">
              Free In-Home Safety Assessment
            </h2>
            <p className="text-lg lg:text-xl leading-relaxed text-brand-textDark/75">
              A no-cost, no-obligation visit to evaluate fall risks, measure the
              bathroom, and recommend the right package. If the bathroom turns out
              not to be the only concern, we&rsquo;ll say so and help you figure out
              what to tackle first.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${publicConfig.businessPhone.replace(/\D/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-7 py-4 text-base lg:text-lg font-bold text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-brand-primary-dark active:scale-95"
              >
                <Phone className="h-5 w-5" />
                {publicConfig.businessPhone}
              </a>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-2xl border border-brand-primary/25 bg-white px-7 py-4 text-base lg:text-lg font-bold text-brand-primary transition-all hover:border-brand-primary active:scale-95"
              >
                Request a visit
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-textDark/50">
              What the visit covers
            </p>
            <ul className="mt-6 space-y-5">
              {assessmentPoints.map((point) => (
                <li key={point} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-secondary/20 text-brand-primary">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-lg lg:text-xl leading-relaxed text-brand-textDark/80">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
