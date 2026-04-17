import Link from "next/link";
import { publicConfig } from "@/lib/config";
import { ResponsiveSlotImage } from "@/components/website/ResponsiveSlotImage";

interface HeroSectionProps {
  heroPair?: { wide: string | null; vert: string | null };
}

export function HeroSection({ heroPair }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-brand-bgLight">
      <div className="relative w-full">
        <ResponsiveSlotImage
          slot="homeHero"
          overrideWide={heroPair?.wide}
          overrideVert={heroPair?.vert}
          alt={`${publicConfig.businessName} hero image`}
          priority
          mobileAspectClassName="aspect-[4/5]"
          desktopAspectClassName="aspect-[21/9]"
          className="w-full"
        >
          {/* Overlay for legibility */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Split Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between pt-8 md:pt-28 pb-28 md:pb-36 px-6 text-center z-10">
            {/* Central Branding */}
            <div className="mx-auto max-w-5xl">
              <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-7xl lg:text-9xl drop-shadow-2xl">
                Alpine Outdoor Living LLC
              </h1>
              <div className="mt-8 md:mt-12 inline-flex px-8 py-3 border-y border-white/20 backdrop-blur-sm">
                <p className="text-[10px] md:text-sm font-bold tracking-[0.4em] text-white/90 uppercase">
                  DESIGN/BUILD &bull; WATER FEATURES &bull; HARDSCAPES &bull; LANDSCAPE
                </p>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mx-auto">
              <Link
                href="#contact"
                className="btn-primary inline-flex min-w-[200px] items-center justify-center px-10 py-5 text-lg font-bold shadow-2xl hover:scale-105"
              >
                Contact Us Today
              </Link>
            </div>
          </div>

          {/* Bottom Fade to Brand Bg - Tighter, more immediate transition */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-bgLight via-brand-bgLight/40 to-transparent z-0" />
        </ResponsiveSlotImage>
      </div>
    </section>
  );
}
