"use client";

import Link from "next/link";
import type { ServiceData } from "@/lib/public-data";
import { ImageStack } from "./ImageStack";

interface ServicesGridProps {
  services?: ServiceData[];
}

export function ServicesGrid({ services = [] }: ServicesGridProps) {
  if (services.length === 0) return null;

  return (
    <div id="services" className="relative w-full bg-transparent">
      {/* Intro Section */}
      <section className="services-intro py-20 lg:py-32 flex items-center justify-center bg-transparent">
        <div className="text-center px-6">
          <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-7xl">
            Our Services
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-normal text-brand-textDark/70 sm:text-xl lg:text-3xl">
            Professional outdoor solutions tailored to your needs
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-base font-medium text-brand-textDark/60 sm:text-lg lg:text-xl">
            Based in Springfield, IL, proudly serving Central Illinois with thoughtful design and quality craftsmanship.
          </p>
        </div>
      </section>

      {/* Unified Grid View (Mobile & Desktop) */}
      <section className="px-4 md:px-6 lg:px-8 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:gap-12">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`group relative overflow-hidden rounded-[32px] border border-green-500/10 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} h-full bg-white/92 lg:bg-white/40 lg:backdrop-blur-2xl items-stretch`}
            >
              {/* Lava blobs: desktop only — large blurs inside cards are costly on mobile Safari */}
              <div className="hidden lg:block absolute inset-0 overflow-hidden rounded-[32px] pointer-events-none" aria-hidden>
                {i % 3 === 0 && (
                  <>
                    <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] rounded-full bg-gradient-to-tr from-brand-primary/20 to-green-400/20 blur-[60px] pointer-events-none" style={{ animationDelay: '0s' }} />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] rounded-full bg-emerald-400/15 blur-[50px] pointer-events-none" />
                  </>
                )}
                {i % 3 === 1 && (
                  <>
                    <div className="absolute top-[-10%] right-[-20%] w-[110%] h-[110%] rounded-full bg-gradient-to-bl from-green-500/15 to-lime-400/15 blur-[70px] pointer-events-none" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-green-600/15 blur-[60px] pointer-events-none" />
                  </>
                )}
                {i % 3 === 2 && (
                  <>
                    <div className="absolute top-[30%] left-[20%] w-[120%] h-[120%] rounded-full bg-gradient-to-r from-emerald-400/20 to-brand-primary/10 blur-[80px] pointer-events-none" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-[-30%] right-[-20%] w-[70%] h-[70%] rounded-full bg-brand-primary/20 blur-[50px] pointer-events-none" />
                  </>
                )}
              </div>

              <div className="relative z-10 w-full lg:w-[45%] xl:w-[50%] p-6 sm:p-8 lg:p-10 flex-shrink-0 flex items-center justify-center">
                {/* Image Stack */}
                <div className="w-full aspect-[4/3]">
                  <ImageStack
                    media={service.media}
                    title={service.title}
                    slug={service.id}
                  />
                </div>
              </div>

              <div className={`relative z-10 p-6 sm:p-8 lg:p-10 ${i % 2 === 1 ? 'lg:pr-0' : 'lg:pl-0'} flex flex-col justify-center flex-grow gap-4 lg:gap-6`}>
                <h3 className="text-2xl sm:text-3xl font-bold text-brand-textDark leading-tight group-hover:text-brand-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-base sm:text-lg text-brand-textDark/80 leading-relaxed max-w-2xl">
                  {service.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-6 w-full max-w-lg">
                  <Link href={`/services/${service.id}`} className="flex-1">
                    <button className="flex items-center justify-center gap-2 w-full py-4 px-6 font-bold text-brand-textDark bg-white/80 hover:bg-white border border-brand-primary/20 rounded-xl transition-all shadow-sm">
                      Explore
                    </button>
                  </Link>
                  <Link href={`/?service=${encodeURIComponent(service.title)}#contact`} className="flex-1">
                    <button className="flex items-center justify-center gap-2 w-full py-4 px-6 font-bold text-white bg-brand-primary hover:bg-brand-primary-dark rounded-xl transition-all shadow-lg shadow-brand-primary/20 group/btn">
                      Let&apos;s Talk
                      <span className="text-xl group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
