"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ServiceData } from "@/lib/public-data";

interface ServicesGridProps {
  services?: ServiceData[];
}

export function ServicesGrid({ services = [] }: ServicesGridProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = rect.height - window.innerHeight;
      
      // Calculate progress (0 to 1) within the track
      let progress = -rect.top / trackHeight;
      progress = Math.max(0, Math.min(1, progress));

      // Identify which card should be active based on progress
      const newActiveIndex = Math.min(
        Math.floor(progress * services.length),
        services.length - 1
      );

      // Apply state only if we are within the sticky bounds
      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        if (newActiveIndex !== activeIndex) {
          setActiveIndex(newActiveIndex);
        }
      } else if (rect.top > 0) {
        // If we scroll back up past the track, reset
        setActiveIndex(0);
      } else if (rect.bottom < window.innerHeight) {
        // If we scrolled past the track, ensure last is active
        setActiveIndex(services.length - 1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once to set initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [services.length, activeIndex]);

  if (services.length === 0) return null;

  return (
    <div id="services" className="relative bg-gradient-to-b from-[#FAFAF9] via-[#e2e8d5] to-[#e2e8d5] w-full">
      {/* Intro Section - Standard scroll until the track begins */}
      <section className="services-intro py-20 lg:py-32 flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-7xl">
            Our Services
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-normal text-brand-textDark/70 sm:text-xl lg:text-3xl">
            Professional outdoor solutions tailored to your needs
          </p>
        </div>
      </section>

      {/* Luxe Track - Height scales with number of services */}
      <section
        ref={trackRef}
        className="luxe-track"
        style={{ height: `${Math.max(1, services.length) * 100}vh` }}
      >
        <div className="sticky-viewport">
          {/* Ambient Background Orbs to power the glassmorphism refraction */}
          <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-brand-primary/20 blur-[120px] pointer-events-none" />
          <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#8B9D33]/10 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#8B9D33]/15 blur-[140px] pointer-events-none" />

          <div className="card-container relative z-10">
            {services.map((service, i) => {
              const isActive = i === activeIndex;
              const isVisible = Math.abs(i - activeIndex) <= 1;
              return (
                <div
                  key={service.title}
                  className={`group luxe-option ${isActive ? "active" : ""} ${!isVisible ? "hidden" : ""}`}
                >
                  <div className="frosted-panel z-10 w-full h-full p-5 lg:p-10 text-brand-textDark flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 justify-start overflow-hidden">
                    
                    {/* Clear Foreground Image showing on Active */}
                    <div className="relative w-full lg:w-1/2 flex-1 lg:flex-none lg:h-full min-h-[100px] max-h-[35vh] lg:min-h-0 lg:max-h-[600px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/60 block transition-all duration-300 ease-in opacity-0 -translate-x-8 group-[.active]:opacity-100 group-[.active]:translate-x-0 group-[.active]:duration-[800ms] group-[.active]:delay-[400ms] group-[.active]:ease-out">
                      <Image
                        src={
                          service.imageUrl ||
                          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                        }
                        alt={`${service.title} interior`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        unoptimized
                      />
                    </div>

                    {/* Text block */}
                    <div className="max-w-3xl lg:w-1/2 flex flex-col justify-center pb-0 transition-opacity duration-300 opacity-0 pointer-events-none group-[.active]:opacity-100 group-[.active]:pointer-events-auto group-[.active]:duration-[800ms] group-[.active]:delay-[400ms]">
                      <span className="text-xs lg:text-sm font-semibold tracking-widest text-brand-textDark/60 uppercase mb-1 lg:mb-2 block">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      <h3 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-2 lg:mb-4">
                        {service.title}
                      </h3>
                      <p className="text-sm sm:text-base lg:text-2xl text-brand-textDark/80 mb-4 lg:mb-8 max-w-xl">
                        {service.description}
                      </p>
                      <div className="mt-auto lg:mt-0">
                        <Link href={`/?service=${encodeURIComponent(service.title)}#contact`}>
                          <button className="luxe-btn flex items-center gap-2 text-sm lg:text-lg py-2 px-6 lg:py-3 lg:px-7">
                            Explore Details
                            <span className="text-lg lg:text-xl">→</span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
