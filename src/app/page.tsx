import { SiteShell } from "@/components/website/SiteShell";
import { HeroSection } from "@/components/website/HeroSection";
import { ContactFormLazy } from "@/components/website/ContactFormLazy";
import { CallOrTextBanner } from "@/components/website/CallOrTextBanner";
import { AssessmentSection } from "@/components/website/AssessmentSection";
import { PackagesSection } from "@/components/website/PackagesSection";
import { publicConfig } from "@/lib/config";
import { getHeroPair } from "@/lib/hero-media";
import { getRemodelPackages } from "@/lib/public-data";

export const revalidate = 300; // Cache the page for 5 minutes

export default async function Home() {
  const [heroPair, packages] = await Promise.all([
    getHeroPair(),
    getRemodelPackages(),
  ]);

  // Only preload the webp variants when they actually exist on disk; otherwise
  // the preload 404s and the browser still has to fetch the real file.
  const heroWideWebp = heroPair.hasWebp && heroPair.wide ? heroPair.wide.replace(/\.[^.]+$/, ".webp") : null;
  const heroVertWebp = heroPair.hasWebp && heroPair.vert ? heroPair.vert.replace(/\.[^.]+$/, ".webp") : null;

  return (
    <>
      {heroWideWebp ? (
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href={heroWideWebp}
          media="(min-width: 768px)"
          fetchPriority="high"
        />
      ) : null}
      {heroVertWebp ? (
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href={heroVertWebp}
          media="(max-width: 767px)"
          fetchPriority="high"
        />
      ) : null}
      <SiteShell>
        <div className="relative w-full">
          {/*
           * Mobile: cheap CSS gradients only. Desktop: full lava-lamp blurred layer.
           */}
          <div
            aria-hidden
            className="absolute inset-0 z-[-1] pointer-events-none lg:hidden bg-[radial-gradient(120%_60%_at_15%_5%,rgba(28,65,158,0.16)_0%,rgba(86,209,75,0.08)_45%,rgba(255,255,255,0)_70%),radial-gradient(120%_60%_at_85%_85%,rgba(28,65,158,0.12)_0%,rgba(255,255,255,0)_60%)]"
          />

          <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden hidden lg:block">
            <div className="absolute top-[0%] left-[-15%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-brand-primary/55 to-blue-600/40 blur-[140px] lava-lamp-1" />
            <div className="absolute top-[5%] left-[5%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-brand-secondary/40 to-brand-primary/50 blur-[130px] lava-lamp-3" />
            <div className="absolute top-[15%] right-[-20%] w-[90vw] h-[90vw] rounded-full bg-gradient-to-bl from-blue-400/35 to-brand-secondary/30 blur-[160px] lava-lamp-2" />

            <div className="absolute top-[35%] left-[0%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-brand-secondary/25 to-blue-500/20 blur-[120px] lava-lamp-3" />
            <div className="absolute top-[60%] right-[5%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-bl from-blue-500/25 to-brand-primary/30 blur-[140px] lava-lamp-1" />
            <div className="absolute bottom-[20%] left-[5%] w-[75vw] h-[75vw] rounded-full bg-gradient-to-tr from-brand-primary/40 to-brand-secondary/25 blur-[150px] lava-lamp-2" />

            <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-brand-primary/20 blur-[140px] lava-lamp-3" />

            <div className="absolute bottom-[20%] left-[35%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-brand-secondary/12 to-blue-300/10 blur-[200px] lava-lamp-3" />
            <div className="absolute top-[40%] left-[-5%] w-[55vw] h-[55vw] rounded-full bg-white/50 blur-[110px] lava-lamp-1 mix-blend-overlay" />
          </div>

          <div className="relative w-full">
            <HeroSection heroPair={heroPair} />

            <AssessmentSection />

            <PackagesSection packages={packages} />

            <CallOrTextBanner />

            <section id="contact" className="relative mx-auto max-w-full px-6 py-20 lg:px-12 lg:py-32 bg-transparent scroll-mt-24">
              <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-5 z-10">
                <div className="sm:col-span-2 flex flex-col">
                  <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-brand-textDark leading-tight mb-6">
                    Book Your Free <br className="hidden lg:block" /> Safety Assessment
                  </h2>
                  <p className="mt-4 text-lg lg:text-xl leading-relaxed text-brand-textDark/70 mb-8">
                    Tell us a little about the bathroom and who it&rsquo;s for. We&rsquo;ll
                    follow up to schedule the in-home visit — usually within 24&ndash;48
                    hours. If it&rsquo;s urgent, like a hospital discharge coming up, call
                    and say so and we&rsquo;ll work around that date.
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
                    <div className="flex items-start gap-4 pt-4 border-t border-black/5">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-primary text-white shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-brand-textDark/60">Service Area</p>
                        <p className="mt-1 text-lg font-bold text-brand-textDark/80">
                          {publicConfig.serviceArea}
                        </p>
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
          </div>
        </div>
      </SiteShell>
    </>
  );
}
