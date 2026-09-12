import { GalleryGrid } from "@/components/website/GalleryGrid";
import type { GalleryPhoto, ProjectVideo } from "@/lib/project-media";

interface GallerySectionProps {
  photos: GalleryPhoto[];
  videos: ProjectVideo[];
  sectionId?: string;
}

/**
 * Project photos and walkthrough videos in one section. Each half renders only
 * when its folder has files, and the whole section disappears if both are empty.
 */
export function GallerySection({ photos, videos, sectionId = "gallery" }: GallerySectionProps) {
  if (photos.length === 0 && videos.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24 scroll-mt-24"
    >
      <div className="max-w-3xl space-y-5">
        <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-6xl">
          Our Work
        </h2>
        <div className="h-1.5 w-24 rounded-full bg-brand-secondary" />
        <p className="text-lg lg:text-xl leading-relaxed text-brand-textDark/70">
          Bathrooms we&rsquo;ve finished. Tap any photo to see it full size.
        </p>
      </div>

      {photos.length > 0 ? (
        <div className="mt-12">
          <GalleryGrid photos={photos} />
        </div>
      ) : null}

      {videos.length > 0 ? (
        <div className="mt-16">
          <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-brand-textDark">
            Walkthrough Videos
          </h3>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            {videos.map((video) => (
              <figure
                key={video.src}
                className="overflow-hidden rounded-[32px] border border-white/70 bg-white/85 p-3 shadow-xl lg:p-4"
              >
                {/*
                 * Phone footage arrives in both orientations. A fixed 16:9 frame
                 * with object-contain keeps the cards the same size and
                 * pillarboxes portrait clips. Videos never autoplay, and
                 * preload="metadata" only fetches the duration and first frame.
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
        </div>
      ) : null}
    </section>
  );
}
