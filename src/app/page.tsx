import { SiteShell } from "@/components/website/SiteShell";
import { HeroSection } from "@/components/website/HeroSection";
import { ServicesGrid } from "@/components/website/ServicesGrid";
import { GalleryGrid } from "@/components/website/GalleryGrid";
import { ReviewsSection } from "@/components/website/ReviewsSection";
import { ContactForm } from "@/components/website/ContactForm";
import { publicConfig } from "@/lib/config";
import { getGalleryImages, getPublishedReviews, getInstagramFeaturedPost } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [galleryImages, reviews, instagramPost] = await Promise.all([
    getGalleryImages(),
    getPublishedReviews(),
    getInstagramFeaturedPost(),
  ]);

  return (
    <SiteShell>
      <HeroSection />
      <ServicesGrid previewOnly />
      <GalleryGrid images={galleryImages} previewOnly />
      
      {/* Contact Section */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-5 sm:px-6 lg:px-8 sm:py-16">
        <div className="sm:col-span-2">
          <h2 className="text-3xl font-black text-brand-textDark sm:text-4xl">Contact Details</h2>
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
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                📍
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Address</p>
                <p className="mt-1 font-bold text-gray-700">
                  {publicConfig.businessAddress}
                  <br />
                  {publicConfig.businessCity}, {publicConfig.businessState} {publicConfig.businessZip}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:col-span-3">
          <ContactForm />
        </div>
      </section>

      {/* Instagram Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 px-8 py-12 lg:px-16 lg:py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <div className="mb-6 text-5xl">📸</div>
              <h2 className="text-3xl font-bold tracking-tight text-brand-textDark sm:text-4xl">
                Follow Us on Instagram
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                See our latest projects and get inspired for your outdoor space
              </p>
            </div>

            {instagramPost && (
              <div className="mt-8">
                <a
                  href={instagramPost.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <img
                    src={instagramPost.thumbnailUrl}
                    alt="Latest Instagram post"
                    className="h-auto w-full object-cover"
                  />
                </a>
                <p className="mt-3 text-center text-sm text-gray-500">Latest post from @{publicConfig.instagramHandle}</p>
              </div>
            )}

            <div className="mt-8 text-center">
              <a
                href={`https://instagram.com/${publicConfig.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-lg"
              >
                <span>@{publicConfig.instagramHandle}</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
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
      )}
    </SiteShell>
  );
}
