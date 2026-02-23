import Link from "next/link";
import { publicConfig } from "@/lib/config";
import { ResponsiveSlotImage } from "@/components/website/ResponsiveSlotImage";

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-[90rem] px-6 pt-16 pb-20 lg:px-12 lg:pt-24 lg:pb-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold leading-[1.05] tracking-tighter text-brand-textDark sm:text-6xl lg:text-7xl xl:text-8xl">
          {publicConfig.businessName}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl font-normal leading-relaxed text-brand-textDark/70 sm:text-2xl lg:text-[28px] lg:leading-relaxed">
          {publicConfig.businessTagline}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <Link
            href="/contact"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-brand-primary px-8 py-4 text-[17px] font-medium text-white transition-all hover:bg-brand-secondary"
          >
            Get Started
          </Link>
          <Link
            href="/services"
            className="inline-flex min-w-[200px] items-center justify-center text-[17px] font-normal text-brand-accent transition-opacity hover:opacity-70"
          >
            Learn more →
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-16 lg:mt-24">
        <ResponsiveSlotImage
          slot="homeHero"
          alt={`${publicConfig.businessName} hero image`}
          priority
          className="overflow-hidden rounded-2xl"
          mobileAspectClassName="aspect-[4/5]"
          desktopAspectClassName="aspect-[21/9]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/10" />
        </ResponsiveSlotImage>
      </div>
    </section>
  );
}
