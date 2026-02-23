import { SiteShell } from "@/components/website/SiteShell";
import { ReviewsSection } from "@/components/website/ReviewsSection";
import { getPublishedReviews } from "@/lib/public-data";
import { publicConfig } from "@/lib/config";
import { PageHeroBanner } from "@/components/website/PageHeroBanner";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await getPublishedReviews();

  return (
    <SiteShell>
      <PageHeroBanner
        slot="reviewsHero"
        title="Client Reviews"
        subtitle="Real feedback from customers we have served."
      />
      <ReviewsSection
        reviews={reviews.map((review) => ({
          quote: review.quote,
          customerName: review.customer_name,
          service: review.service || undefined,
          rating: review.rating,
          reviewDate: review.review_date,
        }))}
      />
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-card">
          <h2 className="text-xl font-semibold text-brand-textDark">
            Had a great experience?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            We would love to hear your feedback.
          </p>
          {publicConfig.googleReviewsUrl ? (
            <a
              href={publicConfig.googleReviewsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block rounded-lg bg-brand-secondary px-4 py-2 text-sm font-semibold text-white"
            >
              Leave us a review
            </a>
          ) : (
            <p className="mt-3 text-xs text-slate-500">
              Add NEXT_PUBLIC_GOOGLE_REVIEWS_URL to enable a direct review link.
            </p>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
