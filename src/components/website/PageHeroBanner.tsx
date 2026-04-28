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
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full">
        <ResponsiveSlotImage
          slot={slot}
          overrideWide={heroPair?.wide}
          overrideVert={heroPair?.vert}
          alt={`${title} banner image`}
          priority
          mobileAspectClassName="aspect-[4/5]"
          desktopAspectClassName="md:aspect-[21/9]"
          className="w-full"
        >
          {/* Overlay for legibility */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Centered Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-10">
            <div className="mx-auto max-w-4xl text-white">
              <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                {title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/90 sm:text-xl lg:text-2xl lg:leading-relaxed">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Bottom Fade to White Gradient - High visibility */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white via-white/80 via-white/20 to-transparent z-0" />
        </ResponsiveSlotImage>
      </div>
    </section>
  );
}
