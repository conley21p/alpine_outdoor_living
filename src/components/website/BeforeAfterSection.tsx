import { ArrowRight } from "lucide-react";
import type { ProjectImage } from "@/lib/project-media";

interface BeforeAfterSectionProps {
  images: ProjectImage[];
  sectionId?: string;
}

/**
 * Real project photography. Renders nothing when no files have been added, so
 * the page never shows an empty gallery frame.
 */
export function BeforeAfterSection({ images, sectionId = "before-after" }: BeforeAfterSectionProps) {
  if (images.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24 scroll-mt-24"
    >
      <div className="max-w-3xl space-y-5">
        <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-6xl">
          Before &amp; After
        </h2>
        <div className="h-1.5 w-24 rounded-full bg-brand-secondary" />
        <p className="text-lg lg:text-xl leading-relaxed text-brand-textDark/70">
          Our own work, start to finish. In each photo the{" "}
          <strong className="text-brand-textDark">left side is before</strong> and the{" "}
          <strong className="text-brand-textDark">right side is after</strong>.
        </p>
        <div className="inline-flex items-center gap-3 rounded-full bg-brand-primary/10 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-brand-primary">
          Before
          <ArrowRight className="h-4 w-4" aria-hidden />
          After
        </div>
      </div>

      <div className="mt-12 space-y-10">
        {images.map((image) => (
          <figure
            key={image.src}
            className="overflow-hidden rounded-[32px] border border-white/70 bg-white/85 p-3 shadow-xl lg:p-4"
          >
            <img
              src={image.src}
              alt={
                image.caption
                  ? `${image.caption} — bathroom remodel before and after`
                  : "Bathroom remodel before and after"
              }
              loading="lazy"
              decoding="async"
              className="w-full rounded-[24px]"
            />
            {image.caption ? (
              <figcaption className="px-3 pb-2 pt-5 text-base lg:text-lg font-medium text-brand-textDark/70">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
