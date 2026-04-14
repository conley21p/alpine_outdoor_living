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

          {/* Centered Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <div className="mx-auto max-w-4xl text-white">
              <p className="mx-auto text-2xl font-semibold leading-relaxed tracking-tight text-white sm:text-3xl lg:text-4xl">
                Proudly servicing Springfield IL
              </p>
              <div className="mt-10 flex items-center justify-center">
                <Link
                  href="/contact"
                  className="btn-primary inline-flex min-w-[200px] items-center justify-center px-10 py-5 text-lg font-bold shadow-2xl hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Fade to White Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/40 to-transparent" />
        </ResponsiveSlotImage>
      </div>
    </section>
  );
}
