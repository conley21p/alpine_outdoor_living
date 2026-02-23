import Link from "next/link";
import { publicConfig } from "@/lib/config";
import { ResponsiveSlotImage } from "@/components/website/ResponsiveSlotImage";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
      <ResponsiveSlotImage
        slot="homeHero"
        alt={`${publicConfig.businessName} hero image`}
        priority
        className="rounded-2xl border border-slate-200 shadow-card"
        mobileAspectClassName="aspect-[4/5]"
        desktopAspectClassName="aspect-[16/7]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/65" />
        <div className="absolute inset-0 flex items-end p-5 sm:items-center sm:p-10">
          <div className="max-w-3xl text-brand-textLight">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-brand-bgLight sm:text-sm">
              {publicConfig.businessCity} • {publicConfig.businessState}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
              {publicConfig.businessName}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-brand-bgLight sm:text-lg">
              {publicConfig.businessTagline}
            </p>
            <div className="mt-6 sm:mt-8">
              <Link
                href="/contact"
                className="inline-flex rounded-lg bg-brand-secondary px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Request Service
              </Link>
            </div>
          </div>
        </div>
      </ResponsiveSlotImage>
    </section>
  );
}
