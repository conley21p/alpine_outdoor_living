import { SiteShell } from "@/components/website/SiteShell";
import { GalleryGrid } from "@/components/website/GalleryGrid";
import { ContactFormLazy } from "@/components/website/ContactFormLazy";
import { PageHeroBanner } from "@/components/website/PageHeroBanner";
import { publicConfig } from "@/lib/config";
import { getGalleryImages, getHeroPair } from "@/lib/public-data";

export const revalidate = 300; // Cache the page for 5 minutes to prevent Cloudinary rate limits

export default async function GalleryPage() {
  const [images, heroPair] = await Promise.all([
    getGalleryImages(),
    getHeroPair(),
  ]);

  return (
    <SiteShell>
      <PageHeroBanner
        slot="galleryHero"
        title="Featured Projects"
        subtitle="Browse our portfolio of custom outdoor solutions."
        heroPair={heroPair}
      />
      <GalleryGrid images={images} />

      {/* Social Media Link Section */}
      <section className="bg-white py-12 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-xl font-medium text-brand-textDark/80">
            Want to see the latest?
          </p>
          <a
            href={publicConfig.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-10 py-5 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            Visit Our Facebook Page
          </a>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="relative mx-auto max-w-full px-6 py-20 lg:px-12 lg:py-32 bg-gradient-to-t from-white via-white to-green-50/20">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-5">
          <div className="sm:col-span-2">
            <h2 className="text-3xl font-black text-brand-textDark sm:text-4xl">Get in Touch</h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">{publicConfig.businessDescription}</p>

            <div className="mt-8 space-y-4 rounded-3xl p-8 glass-card-green">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-primary text-white shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-brand-textDark/60">Phone</p>
                  <a href={`tel:${publicConfig.businessPhone}`} className="mt-1 block text-lg font-bold text-brand-primary hover:text-brand-accent transition-colors">
                    {publicConfig.businessPhone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 pt-4 border-t border-black/5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-primary text-white shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-brand-textDark/60">Email</p>
                  <a href={`mailto:${publicConfig.businessEmail}`} className="mt-1 block break-all text-lg font-bold text-brand-primary hover:text-brand-accent transition-colors">
                    {publicConfig.businessEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:col-span-3">
            <div className="glass-card-green rounded-3xl p-8 h-full">
              <ContactFormLazy />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
