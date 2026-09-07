import type { ProjectVideo } from "@/lib/project-media";

interface ProjectVideosSectionProps {
  videos: ProjectVideo[];
  sectionId?: string;
}

/**
 * Walkthrough videos, kept in their own section separate from the before/after
 * stills. Renders nothing until video files are added.
 *
 * Videos are not autoplayed: this audience is often on a phone plan, and a
 * multi-megabyte autoplay is hostile. `preload="metadata"` fetches only enough
 * for duration and the first frame.
 */
export function ProjectVideosSection({ videos, sectionId = "videos" }: ProjectVideosSectionProps) {
  if (videos.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24 scroll-mt-24"
    >
      <div className="max-w-3xl space-y-5">
        <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-6xl">
          Project Walkthroughs
        </h2>
        <div className="h-1.5 w-24 rounded-full bg-brand-secondary" />
        <p className="text-lg lg:text-xl leading-relaxed text-brand-textDark/70">
          Short videos of the same bathrooms before and after the work.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {videos.map((video) => (
          <figure
            key={video.src}
            className="overflow-hidden rounded-[32px] border border-white/70 bg-white/85 p-3 shadow-xl lg:p-4"
          >
            {/*
             * Phone footage arrives in both orientations — a landscape walkthrough
             * next to a portrait one would make the grid rows wildly uneven. A
             * fixed 16:9 frame with object-contain keeps every card the same size
             * and pillarboxes portrait clips against the black backing.
             */}
            <div className="relative aspect-video w-full overflow-hidden rounded-[24px] bg-black">
              <video
                controls
                playsInline
                preload="metadata"
                poster={video.poster ?? undefined}
                className="absolute inset-0 h-full w-full object-contain"
              >
                <source src={video.src} type={video.type} />
                Your browser can&rsquo;t play this video.{" "}
                <a href={video.src} className="underline">
                  Download it instead
                </a>
                .
              </video>
            </div>
            {video.caption ? (
              <figcaption className="px-3 pb-2 pt-5 text-base lg:text-lg font-medium text-brand-textDark/70">
                {video.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
