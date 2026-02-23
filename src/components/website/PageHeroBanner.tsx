import type { SiteImageSlot } from "@/lib/site-images";
import { ResponsiveSlotImage } from "@/components/website/ResponsiveSlotImage";

interface PageHeroBannerProps {
  slot: SiteImageSlot;
  title: string;
  subtitle: string;
}

export function PageHeroBanner({ slot, title, subtitle }: PageHeroBannerProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 sm:pt-10">
      <ResponsiveSlotImage
        slot={slot}
        alt={`${title} banner image`}
        className="rounded-3xl overflow-hidden shadow-card-hover"
        mobileAspectClassName="aspect-[4/5]"
        desktopAspectClassName="aspect-[3/1]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-end p-6 sm:items-center sm:p-12">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-4 text-base leading-relaxed text-gray-100 sm:text-lg">{subtitle}</p>
          </div>
        </div>
      </ResponsiveSlotImage>
    </section>
  );
}
