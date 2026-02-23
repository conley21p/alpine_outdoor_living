import { SiteShell } from "@/components/website/SiteShell";
import { GalleryGrid } from "@/components/website/GalleryGrid";
import { getGalleryImages } from "@/lib/public-data";
import { PageHeroBanner } from "@/components/website/PageHeroBanner";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <SiteShell>
      <PageHeroBanner
        slot="galleryHero"
        title="Gallery"
        subtitle="Browse recent work and project highlights."
      />
      <GalleryGrid images={images} />
    </SiteShell>
  );
}
