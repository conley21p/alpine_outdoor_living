import { SiteShell } from "@/components/website/SiteShell";
import { HeroSection } from "@/components/website/HeroSection";
import { ServicesGrid } from "@/components/website/ServicesGrid";
import { ContactForm } from "@/components/website/ContactForm";
import Image from "next/image";
import { publicConfig } from "@/lib/config";
import {
  getHeroPair,
  getExteriorServices,
} from "@/lib/public-data";

export const revalidate = 300; // Cache the page for 5 minutes

export default async function Home() {
  const [heroPair, exteriorServices] = await Promise.all([
    getHeroPair(),
    getExteriorServices(),
  ]);

  return (
    <SiteShell>
      {/* Unified Ambient Background Zone - Lincoln Land Exteriors Red/Yellow Palette */}
      <div className="relative w-full">
        {/* Vibrant Lava Lamp Ambient Layer - Red & Yellow */}
        <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
          {/* Top-left Red pool */}
          <div className="absolute top-[0%] left-[-15%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-brand-primary/45 to-red-500/30 blur-[140px] lava-lamp-1" />
          {/* Top-left anchor — Warm Yellow */}
          <div className="absolute top-[5%] left-[5%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-brand-secondary/40 to-brand-primary/25 blur-[130px] lava-lamp-3 hidden lg:block" />
          {/* Right pool — Red/Yellow mix */}
          <div className="absolute top-[15%] right-[-20%] w-[90vw] h-[90vw] rounded-full bg-gradient-to-bl from-orange-300/25 to-brand-secondary/30 blur-[160px] lava-lamp-2" />

          {/* Mid Supporting Blobs */}
          <div className="absolute top-[35%] left-[0%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-brand-secondary/20 to-orange-400/15 blur-[120px] lava-lamp-3 hidden lg:block" />
          <div className="absolute top-[60%] right-[5%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-bl from-red-500/18 to-brand-primary/22 blur-[140px] lava-lamp-1" />
          <div className="absolute bottom-[20%] left-[5%] w-[75vw] h-[75vw] rounded-full bg-gradient-to-tr from-brand-primary/30 to-brand-secondary/20 blur-[150px] lava-lamp-2 hidden lg:block" />

          {/* Bottom Bloom */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-brand-primary/18 blur-[140px] lava-lamp-3" />

          {/* Warm Accent */}
          <div className="absolute bottom-[20%] left-[35%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-brand-secondary/12 to-orange-200/10 blur-[1200px] lava-lamp-3" />
          <div className="absolute top-[40%] left-[-5%] w-[55vw] h-[55vw] rounded-full bg-white/50 blur-[110px] lava-lamp-1 mix-blend-overlay hidden lg:block" />
        </div>

        <div className="relative w-full">
          <HeroSection heroPair={heroPair} />

          {/* Unified Foundation Section - Building Trust Before Services */}
          <section className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
              {/* Visual Side - Portrait/Bio Anchor - DISABLED PER USER REQUEST */}
              {/* 
              <div className="lg:col-span-5 relative order-last lg:order-first">
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl glass-card-green group">
                  <Image
                    src={whoWeArePhoto}
                    alt="Kale Lash, Founder of KML Seamless Gutters"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute bottom-8 left-8 right-8 p-6 glass-card rounded-2xl border border-white/40 shadow-xl backdrop-blur-md">
                    <p className="text-brand-textDark font-bold text-xl leading-none">Kale Lash</p>
                    <p className="text-brand-primary font-medium text-sm uppercase tracking-widest mt-1">Founder & Lead Contractor</p>
                  </div>
                </div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-secondary/20 rounded-full blur-3xl -z-10" />
              </div> 
              */}

              {/* Philosophy + Owner Operated (2-col on desktop) */}
              <div className="lg:col-span-8 space-y-10">
                <div className="space-y-6">
                  <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter text-brand-textDark leading-[1.05]">
                    Quality Work.<br />Done Right the First Time.
                  </h2>
                  <div className="h-1.5 w-24 bg-brand-secondary rounded-full" />
                </div>

                <div className="space-y-6 text-xl lg:text-2xl text-brand-textDark/80 leading-relaxed font-medium">
                  <p>
                    <strong>Lincoln Land Exteriors</strong> handles projects start-to-finish with clear communication, reliable scheduling, and workmanship that holds up.
                  </p>
                  <p className="text-lg lg:text-xl text-brand-textDark/60 font-normal">
                    Need an exterior upgrade or an interior remodel? From roofing and siding to flooring and kitchens, we coordinate the right crew and keep the process straightforward.
                  </p>
                </div>

                {/* Service Reach Trust Badges */}
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-brand-textDark/5">
                  <div className="flex items-center gap-2 text-brand-primary font-bold">
                    <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                    <span>Family Owned</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-primary font-bold">
                    <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                    <span>Springfield, IL</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-primary font-bold">
                    <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                    <span>Insured & Bonded</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-primary font-bold">
                    <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                    <span>Free Estimates</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-primary font-bold">
                    <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                    <span>3D Models via Hover</span>
                  </div>
                </div>
              </div>

              {/* Owner Operated column (desktop right) */}
              <aside className="lg:col-span-4">
                <div className="rounded-[2.5rem] border border-white/40 bg-white/55 backdrop-blur-xl p-6 shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-textDark/60">
                    Owner Operated
                  </p>
                  <div className="mt-4 relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/50 shadow-2xl">
                    <Image
                      src="/lincoln-land-exteriors/Zach Williams (Owner).JPG"
                      alt="Zach Williams, Owner"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 420px"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />

                    {/* Frosted text bubble */}
                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl p-4">
                      <p className="text-lg font-bold tracking-tight text-brand-textDark">
                        Meet Zach Williams
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-brand-textDark/70">
                        Lincoln Land Exteriors is a family-owned contractor serving Springfield, Illinois and surrounding areas.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <ServicesGrid
            sectionId="exterior-services"
            title="Exterior Services"
            subtitle="Roofing, siding, gutters, windows & doors, soffit and fascia."
            services={exteriorServices}
          />

          <section
            id="interior-services"
            className="relative mx-auto w-full max-w-7xl px-6 py-20 lg:py-28"
          >
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-5">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-brand-textDark">
                    Interior Services
                  </h2>
                  <p className="text-lg lg:text-xl text-brand-textDark/70 leading-relaxed">
                    If your project is inside the home, we can help coordinate it start-to-finish.
                    Here are the most common interior requests we handle.
                  </p>
                </div>

                <ul className="space-y-4 text-base lg:text-lg text-brand-textDark/80">
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-brand-secondary" />
                    <span>Flooring (hardwood, vinyl, laminate, tile)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-brand-secondary" />
                    <span>Drywall (install, patch, finish)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-brand-secondary" />
                    <span>Interior &amp; exterior door installation</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-brand-secondary" />
                    <span>Kitchen remodeling</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-brand-secondary" />
                    <span>Bathroom remodeling</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-brand-secondary" />
                    <span>Lighting fixture installation</span>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-5">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border border-white/50 bg-gradient-to-br from-brand-primary/10 via-white/70 to-brand-secondary/25 shadow-2xl">
                  <Image
                    src="/lincoln-land-exteriors/Team Photo.JPG"
                    alt="Lincoln Land Exteriors team"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 p-5">
                    <p className="text-sm font-semibold uppercase tracking-widest text-brand-textDark/60">
                      Interior &amp; Exterior
                    </p>
                    <p className="mt-1 text-xl font-bold tracking-tight text-brand-textDark">
                      One call. One plan. Get it done.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>


          <section id="contact" className="relative mx-auto max-w-full px-6 py-20 lg:px-12 lg:py-32 bg-transparent">
            <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-5 z-10">
              <div className="sm:col-span-2 flex flex-col">
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-brand-textDark leading-tight mb-6">
                  Get a Free Estimate <br className="hidden lg:block" /> Today
                </h2>
                <p className="mt-4 text-lg lg:text-xl leading-relaxed text-brand-textDark/70 mb-8">
                  Submit the contact form or reach out to Zach Williams at the phone number below today to get started.
                </p>

                <div className="sm:mt-auto mt-8 space-y-4 rounded-3xl p-8 glass-card-warm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-primary text-white shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wider text-brand-textDark/60">Phone</p>
                      <a href={`tel:${publicConfig.businessPhone.replace(/\D/g, '')}`} className="mt-1 block text-lg font-bold text-brand-primary hover:text-brand-secondary transition-colors">
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
                      <a href={`mailto:${publicConfig.businessEmail}`} className="mt-1 block break-all text-lg font-bold text-brand-primary hover:text-brand-secondary transition-colors">
                        {publicConfig.businessEmail}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:col-span-3">
                <div className="glass-card-warm rounded-3xl p-8 h-full">
                  <ContactForm />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 to-red-50 px-8 py-12 lg:px-16 lg:py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-brand-textDark sm:text-4xl">
                Follow Us on Facebook
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                See recent projects, updates, and photos from the field
              </p>
            </div>
            <div className="mt-8 text-center">
              <a
                href={publicConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-lg"
              >
                <span>Visit Our Page</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
