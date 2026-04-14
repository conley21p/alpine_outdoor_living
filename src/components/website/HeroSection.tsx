import Link from "next/link";
import { publicConfig } from "@/lib/config";
import { ResponsiveSlotImage } from "@/components/website/ResponsiveSlotImage";

interface HeroSectionProps {
  heroPair?: { wide: string | null; vert: string | null };
}

export function HeroSection({ heroPair }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-white">
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
          <div className="absolute inset-0 flex flex-col justify-between py-28 md:py-36 px-6 text-center z-10">
            {/* Top Text */}
            <div className="mx-auto max-w-4xl">
              <p className="mx-auto text-xl font-semibold leading-relaxed tracking-tight text-white sm:text-2xl lg:text-3xl">
                Custom Water Features, Fire Pits, Patios & Outdoor Spaces
              </p>
              <p className="mx-auto mt-2 text-lg font-medium leading-relaxed tracking-tight text-white/80 sm:text-xl lg:text-2xl">
                Proudly servicing Springfield IL
              </p>
            </div>

            {/* Bottom Button */}
            <div className="mx-auto">
              <Link
                href="/contact"
                className="btn-primary inline-flex min-w-[200px] items-center justify-center px-10 py-5 text-lg font-bold shadow-2xl hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Bottom Fade to White Gradient - High visibility */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white via-white/80 via-white/20 to-transparent z-0" />
        </ResponsiveSlotImage>
      </div>
    </section>
  );
}
