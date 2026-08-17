import Link from "next/link";
import { publicConfig } from "@/lib/config";
import { ResponsiveSlotImage } from "@/components/website/ResponsiveSlotImage";

/** Stand-in artwork until real project photography exists. */
const HERO_ILLUSTRATION = "/hero/accessible-bathroom.svg";

interface HeroSectionProps {
  heroPair?: { wide: string | null; vert: string | null };
}

function HeroContent() {
  return (
    <>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-[2.75rem] sm:text-[3.5rem] md:text-[5rem] font-bold tracking-tighter text-white drop-shadow-2xl leading-none">
          {publicConfig.businessName}
        </h1>
        <p className="mt-4 md:mt-6 text-lg md:text-2xl font-medium text-white/90 max-w-3xl mx-auto">
          {publicConfig.businessTagline}
        </p>
        <div className="mt-6 md:mt-10 flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-y-3 md:gap-y-2 px-8 py-4 md:py-3 border-y border-white/25">
          {publicConfig.heroHighlights.map((service, index) => (
            <div key={service} className="flex items-center">
              <p className="text-xs md:text-sm font-bold tracking-[0.3em] md:tracking-[0.4em] text-white/90 uppercase text-center">
                {service}
              </p>
              {index < publicConfig.heroHighlights.length - 1 && (
                <span className="text-white/40 mx-3 hidden md:inline">&bull;</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="#assessment"
          className="btn-primary inline-flex min-w-[240px] items-center justify-center bg-white px-10 py-5 text-lg font-bold text-brand-primary shadow-2xl hover:bg-white/90 hover:scale-105"
        >
          Free Safety Assessment
        </Link>
        <a
          href={`tel:${publicConfig.businessPhone.replace(/\D/g, "")}`}
          className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-white/40 px-10 py-5 text-lg font-bold text-white transition-all hover:bg-white/10"
        >
          {publicConfig.businessPhone}
        </a>
      </div>
    </>
  );
}

export function HeroSection({ heroPair }: HeroSectionProps) {
  // No project photography on file yet. Rather than washing a grey placeholder
  // behind white type, the hero falls back to a brand gradient panel. That
  // variant sizes to its content instead of a fixed aspect ratio, so nothing
  // gets clipped on narrow screens.
  const hasPhoto = Boolean(heroPair?.wide || heroPair?.vert);

  if (!hasPhoto) {
    return (
      <section className="relative w-full overflow-hidden bg-brand-bgLight">
        <div className="relative w-full bg-[linear-gradient(135deg,var(--brand-primary)_0%,#152F72_55%,#0E1F4B_100%)]">
          {/*
           * Original illustration standing in for photography. Swap it out by
           * returning real image paths from `getHeroPair()` — that switches the
           * hero to the photo treatment below and this branch stops rendering.
           */}
          <img
            src={HERO_ILLUSTRATION}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,22,54,0.72)_0%,rgba(9,22,54,0.55)_45%,rgba(9,22,54,0.78)_100%)]" />
          <div className="relative z-10 flex flex-col justify-between gap-12 px-6 pt-16 pb-24 text-center md:min-h-[36rem] md:pt-24 md:pb-32">
            <HeroContent />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-bgLight via-brand-bgLight/30 to-transparent z-0" />
        </div>
      </section>
    );
  }

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
          desktopAspectClassName="md:aspect-[21/9]"
          className="w-full"
        >
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col justify-between pt-8 md:pt-20 pb-20 md:pb-36 px-6 text-center z-10">
            <HeroContent />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-bgLight via-brand-bgLight/40 to-transparent z-0" />
        </ResponsiveSlotImage>
      </div>
    </section>
  );
}
