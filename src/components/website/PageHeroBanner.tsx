import type { SiteImageSlot } from "@/lib/site-images";
import { ResponsiveSlotImage } from "@/components/website/ResponsiveSlotImage";

interface PageHeroBannerProps {
  slot: SiteImageSlot;
  title: string;
  subtitle: string;
}

export function PageHeroBanner({ slot, title, subtitle }: PageHeroBannerProps) {
  return (
    <section className="mx-auto max-w-[90rem] px-6 pt-12 pb-12 lg:px-12 lg:pt-20 lg:pb-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-brand-textDark sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-xl font-normal text-brand-textDark/70 sm:text-2xl lg:text-[28px] lg:leading-relaxed">
          {subtitle}
        </p>
      </div>
      <div className="mt-12 lg:mt-16">
        <ResponsiveSlotImage
          slot={slot}
          alt={`${title} banner image`}
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
