import Link from "next/link";
import { publicConfig } from "@/lib/config";
import { ResponsiveSlotImage } from "@/components/website/ResponsiveSlotImage";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 sm:pt-8">
      <ResponsiveSlotImage
        slot="homeHero"
        alt={`${publicConfig.businessName} hero image`}
        priority
        className="rounded-3xl overflow-hidden shadow-card-hover"
        mobileAspectClassName="aspect-[4/5]"
        desktopAspectClassName="aspect-[16/7]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-end p-6 sm:items-center sm:p-12 lg:p-16">
          <div className="max-w-3xl text-white">
            <p className="mb-3 inline-block rounded-full bg-brand-primary/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm sm:text-sm">
              {publicConfig.businessCity} • {publicConfig.businessState}
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              {publicConfig.businessName}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-100 sm:text-xl">
              {publicConfig.businessTagline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-7 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-brand-accent hover:shadow-xl active:scale-95"
              >
                Request Service
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </ResponsiveSlotImage>
    </section>
  );
}
