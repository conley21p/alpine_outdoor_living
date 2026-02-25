import { SiteShell } from "@/components/website/SiteShell";
import { ReviewsSection } from "@/components/website/ReviewsSection";
import { ContactForm } from "@/components/website/ContactForm";
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

      {/* Contact Form Section */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-5 sm:px-6 lg:px-8 sm:py-16">
        <div className="sm:col-span-2">
          <h2 className="text-3xl font-black text-brand-textDark sm:text-4xl">Get in Touch</h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">{publicConfig.businessDescription}</p>

          <div className="mt-8 space-y-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 shadow-card">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                📞
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Phone</p>
                <a href={`tel:${publicConfig.businessPhone}`} className="mt-1 block font-bold text-brand-primary hover:text-brand-accent">
                  {publicConfig.businessPhone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                ✉️
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email</p>
                <a href={`mailto:${publicConfig.businessEmail}`} className="mt-1 block break-all font-bold text-brand-primary hover:text-brand-accent">
                  {publicConfig.businessEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:col-span-3">
          <ContactForm />
        </div>
      </section>
    </SiteShell>
  );
}
