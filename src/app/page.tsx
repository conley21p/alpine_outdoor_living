import { SiteShell } from "@/components/website/SiteShell";
import { HeroSection } from "@/components/website/HeroSection";
import { ServicesGrid } from "@/components/website/ServicesGrid";
import { GalleryGrid } from "@/components/website/GalleryGrid";
import { ReviewsSection } from "@/components/website/ReviewsSection";
import { CallToAction } from "@/components/website/CallToAction";
import { getGalleryImages, getPublishedReviews } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [galleryImages, reviews] = await Promise.all([
    getGalleryImages(),
    getPublishedReviews(),
  ]);

  return (
    <SiteShell>
      <HeroSection />
      <ServicesGrid previewOnly />
      <GalleryGrid images={galleryImages} previewOnly />
      <ReviewsSection
        previewOnly
        reviews={reviews.map((review) => ({
          quote: review.quote,
          customerName: review.customer_name,
          service: review.service || undefined,
          rating: review.rating,
          reviewDate: review.review_date,
        }))}
      />
      <CallToAction />
    </SiteShell>
  );
}
