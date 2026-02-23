import type { SiteImageSlot } from "@/lib/site-images";
import { ResponsiveSlotImage } from "@/components/website/ResponsiveSlotImage";

interface PageHeroBannerProps {
  slot: SiteImageSlot;
  title: string;
  subtitle: string;
}

export function PageHeroBanner({ slot, title, subtitle }: PageHeroBannerProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
      <ResponsiveSlotImage
        slot={slot}
        alt={`${title} banner image`}
        className="rounded-2xl border border-slate-200 shadow-card"
        mobileAspectClassName="aspect-[4/5]"
        desktopAspectClassName="aspect-[3/1]"
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-end p-5 sm:items-center sm:p-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm text-white/90 sm:text-base">{subtitle}</p>
          </div>
        </div>
      </ResponsiveSlotImage>
    </section>
  );
}
