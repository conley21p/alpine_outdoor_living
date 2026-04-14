import type { SiteImageSlot } from "@/lib/site-images";
import { ResponsiveSlotImage } from "@/components/website/ResponsiveSlotImage";

interface PageHeroBannerProps {
  slot: SiteImageSlot;
  title: string;
  subtitle: string;
  heroPair?: { wide: string | null; vert: string | null };
}

export function PageHeroBanner({ slot, title, subtitle, heroPair }: PageHeroBannerProps) {
  return (
    <section className="relative mx-auto max-w-[90rem] px-6 pt-12 pb-20 lg:px-12 lg:pt-16 lg:pb-32">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl shadow-2xl">
        <ResponsiveSlotImage
          slot={slot}
          overrideWide={heroPair?.wide}
          overrideVert={heroPair?.vert}
          alt={`${title} banner image`}
          priority
          mobileAspectClassName="aspect-[4/5]"
          desktopAspectClassName="aspect-[21/9]"
        >
          {/* Overlay for legibility */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Centered Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <div className="mx-auto max-w-4xl text-white">
              <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                {title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/90 sm:text-xl lg:text-2xl lg:leading-relaxed">
                {subtitle}
              </p>
            </div>
          </div>
        </ResponsiveSlotImage>
      </div>
    </section>
  );
}
