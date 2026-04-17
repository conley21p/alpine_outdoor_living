import Image from "next/image";
import { SiteShell } from "@/components/website/SiteShell";
import { HeroSection } from "@/components/website/HeroSection";
import { ServicesGrid } from "@/components/website/ServicesGrid";
import { GalleryGrid } from "@/components/website/GalleryGrid";
import { ContactForm } from "@/components/website/ContactForm";
import { publicConfig } from "@/lib/config";
import { 
  getGalleryImages, 
  getInstagramFeaturedPost,
  getHeroPair,
  getStaticServices 
} from "@/lib/public-data";

export const revalidate = 300; // Cache the page for 5 minutes to prevent Cloudinary rate limits

export default async function Home() {
  const [galleryImages, instagramPost, heroPair, services] = await Promise.all([
    getGalleryImages(),
    getInstagramFeaturedPost(),
    getHeroPair("Home/Website/Hero"),
    getStaticServices(),
  ]);

  return (
    <SiteShell>
      <HeroSection heroPair={heroPair} />
      {/* Unified Ambient Background Zone - Services + Contact */}
      <div className="relative w-full">
        {/* Vibrant Lava Lamp Ambient Layer - Pure Greens Only */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Top-left primary green pool */}
          <div className="absolute top-[-5%] left-[-15%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-brand-primary/55 to-green-500/40 blur-[140px] lava-lamp-1" />
          {/* Top-left anchor — deep olive green */}
          <div className="absolute top-[-5%] left-[5%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-green-600/40 to-brand-primary/50 blur-[130px] lava-lamp-3" />
          {/* Right pool — warm lime-green, no blue */}
          <div className="absolute top-[20%] right-[-20%] w-[90vw] h-[90vw] rounded-full bg-gradient-to-bl from-green-400/35 to-lime-500/30 blur-[160px] lava-lamp-2" />

          {/* Mid Supporting Blobs */}
          <div className="absolute top-[45%] left-[0%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-lime-400/25 to-green-500/20 blur-[120px] lava-lamp-3" />
          <div className="absolute bottom-[30%] right-[5%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-bl from-green-500/25 to-brand-primary/30 blur-[140px] lava-lamp-1" />
          <div className="absolute bottom-[5%] left-[5%] w-[75vw] h-[75vw] rounded-full bg-gradient-to-tr from-brand-primary/40 to-green-400/25 blur-[150px] lava-lamp-2" />

          {/* Warm Accent */}
          <div className="absolute bottom-[20%] left-[35%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-[#C8882A]/12 to-yellow-300/10 blur-[120px] lava-lamp-3" />
          <div className="absolute top-[60%] left-[-5%] w-[55vw] h-[55vw] rounded-full bg-white/50 blur-[110px] lava-lamp-1 mix-blend-overlay" />
        </div>

        <div className="relative z-10 w-full">
          <ServicesGrid services={services} />
          
          {/* Service Areas & Philosophy Section */}
          <section className="relative mx-auto max-w-7xl px-6 py-24 lg:py-40">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Philosophy - The Brand Soul */}
              <div className="space-y-8 px-2 lg:px-12">
                <div>
                  <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter text-brand-textDark leading-[1.1]">
                    Quietly exceptional.<br/>Intentionally Built.
                  </h2>
                  <div className="h-1.5 w-24 bg-brand-primary mt-6 rounded-full" />
                </div>
                <p className="text-xl lg:text-2xl font-medium text-brand-textDark/80 leading-relaxed max-w-xl">
                  We believe the most compelling outdoor spaces don’t feel overdesigned—they feel effortless.
                </p>
              </div>

              {/* Service Areas - The Logical Connection */}
              <div className="rounded-3xl p-10 lg:p-14 glass-card-green relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <svg className="w-32 h-32 text-brand-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-brand-textDark mb-6">Service Areas</h3>
                <p className="text-lg text-brand-textDark/70 leading-relaxed mb-8">
                  Based in Springfield, IL, we proudly serve homeowners and businesses throughout the surrounding Central Illinois region.
                </p>
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-brand-primary font-bold text-lg">
                  <span>Thoughtful Design</span>
                  <span className="hidden md:inline text-brand-textDark/20">•</span>
                  <span>Quality Craftsmanship</span>
                </div>
              </div>
            </div>
          </section>

          {/* Who We Are - Biographical Section */}
          <section className="relative mx-auto max-w-7xl px-6 lg:px-20 py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-8 space-y-6 lg:pr-12">
                <p className="text-xl lg:text-2xl font-medium text-brand-textDark/90 leading-relaxed">
                  Alpine Outdoor Living, LLC. Was founded by Austin Schiff during his final year at the
                  University of Illinois Urbana-Champaign. While earning his degree in Landscape Architecture,
                  Austin combined his technical expertise with a lifelong passion for the outdoors.
                </p>
                <p className="text-lg lg:text-xl text-brand-textDark/70 leading-relaxed">
                  His entrepreneurship started at a young age of 11 when he started his own mowing business to
                  save for the future. Driven by a deep love for nature and a talent for artistic design, Austin now
                  focuses on transforming ordinary spaces into extraordinary outdoor retreats.
                </p>
              </div>
              <div className="lg:col-span-4 lg:sticky lg:top-32 order-first lg:order-last">
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-brand-textDark leading-none">
                  Who We Are
                </h2>
                <div className="h-1.5 w-16 bg-brand-primary mt-6 rounded-full" />
              </div>
            </div>
          </section>

          <section id="contact" className="relative mx-auto max-w-full px-6 py-20 lg:px-12 lg:py-32 bg-transparent">
            <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-5 z-10">
              <div className="sm:col-span-2 flex flex-col">
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-brand-textDark leading-tight mb-6">
                  Ready to Elevate <br className="hidden lg:block" /> Your Landscape?
                </h2>
                <p className="mt-4 text-lg lg:text-xl leading-relaxed text-brand-textDark/70 mb-8">
                  Turn your blank canvas into a peaceful sanctuary. Whether you are looking for a custom stone
                  patio, a relaxing water feature, or a complete landscape redesign, we are here to bring your
                  vision to life with artistic precision.
                </p>

                <div className="sm:mt-auto mt-8 space-y-4 rounded-3xl p-8 glass-card-green">
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
                  <ContactForm />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <GalleryGrid images={galleryImages} previewOnly />

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
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={instagramPost.thumbnailUrl}
                      alt="Latest Instagram post"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
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
    </SiteShell>
  );
}
