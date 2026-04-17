"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import type { ServiceData } from "@/lib/public-data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ImageStack } from "./ImageStack";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface ServicesGridProps {
  services?: ServiceData[];
}

export function ServicesGrid({ services = [] }: ServicesGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Track which service indices have ever become active, to defer image loading
  const activatedRef = useRef<Set<number>>(new Set([0])); // Card 0 is active immediately
  const [activatedCards, setActivatedCards] = useState<Set<number>>(new Set([0]));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sequential loading for mobile - ensures Hero loads first, then services in order
  useEffect(() => {
    if (!isMobile || services.length <= 1) return;

    const interval = setInterval(() => {
      setActivatedCards((prev) => {
        // Find the next unactivated index
        let nextIndex = -1;
        for (let i = 0; i < services.length; i++) {
          if (!prev.has(i)) {
            nextIndex = i;
            break;
          }
        }

        if (nextIndex === -1) {
          clearInterval(interval);
          return prev;
        }

        activatedRef.current.add(nextIndex);
        return new Set(activatedRef.current);
      });
    }, 150); // 150ms stagger

    return () => clearInterval(interval);
  }, [isMobile, services.length]);

  // Cache for DOM values to prevent redundant writes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prevStates = useRef<Map<number, Record<string, any>>>(new Map());

  useGSAP(() => {
    if (!trackRef.current || services.length === 0) return;

    const cards = gsap.utils.toArray<HTMLElement>('.luxe-option');
    const totalTransitions = cards.length - 1;

    if (isMobile) return; // Strictly no GSAP work on mobile

    // DESKTOP: Original Luxe-Vista morphing logic (optimized for large screens)
    ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        const scrubIdx = p * totalTransitions;

        cards.forEach((card, i) => {
          const dist = Math.abs(i - scrubIdx);
          if (dist > 3) return;

          const w = Math.max(0, 1 - Math.min(1, dist));
          const exileStart = 1.25;
          const exileEnd = 2.25;
          const exile = Math.max(0, 1 - Math.max(0, dist - exileStart) / (exileEnd - exileStart));

          const isVisible = exile > 0.001;
          const finalFlex = (1 + (11 * w)) * exile;

          const mHeight = dist > 1 ? `${Math.max(0, Math.round(exile * 300))}px` : '2000px';
          const mBottom = dist > 1 ? `${Math.round(exile * 15)}px` : '15px';

          const prevState = prevStates.current.get(i) || {};

          if (prevState.w !== w) {
            card.style.setProperty('--weight', w.toFixed(3));
            prevState.w = w;
          }
          if (prevState.exile !== exile) {
            card.style.setProperty('--exile', exile.toFixed(3));
            card.style.opacity = exile.toFixed(3);
            prevState.exile = exile;
          }
          if (prevState.flex !== finalFlex) {
            card.style.flex = `${finalFlex.toFixed(3)} 1 0%`;
            prevState.flex = finalFlex;
          }
          if (prevState.visible !== isVisible) {
            card.style.visibility = isVisible ? 'visible' : 'hidden';
            card.style.pointerEvents = isVisible ? 'auto' : 'none';
            prevState.visible = isVisible;
          }
          if (prevState.mHeight !== mHeight) {
            card.style.maxHeight = mHeight;
            prevState.mHeight = mHeight;
          }
          if (prevState.mBottom !== mBottom) {
            card.style.marginBottom = mBottom;
            prevState.mBottom = mBottom;
          }

          prevStates.current.set(i, prevState);

          if (w > 0.01 && !activatedRef.current.has(i)) {
            activatedRef.current.add(i);
            setActivatedCards(new Set(activatedRef.current));
          }
        });
      }
    });
  }, { scope: containerRef, dependencies: [services.length, isMobile] });

  if (services.length === 0) return null;

  return (
    <div id="services" ref={containerRef} className="relative w-full bg-transparent">
      {/* Intro Section */}
      <section className="services-intro py-20 lg:py-32 flex items-center justify-center bg-gradient-to-b from-brand-bgLight to-transparent">
        <div className="text-center px-6">
          <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-7xl">
            Our Services
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-normal text-brand-textDark/70 sm:text-xl lg:text-3xl">
            Professional outdoor solutions tailored to your needs
          </p>
        </div>
      </section>

      {/* MOBILE VIEW (Zero Animation) */}
      <section className="block lg:hidden px-4 pb-20">
        <div className="flex flex-col gap-8">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="relative overflow-hidden rounded-[24px] bg-white border border-brand-primary/10 shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent pointer-events-none" />

              <div className="relative z-10 p-6 flex flex-col gap-6">
                {/* Static Image Stack - Removed overflow-hidden to allow background images to peep */}
                <div className="w-full aspect-[4/3] rounded-2xl">
                   {(activatedCards.has(i) || i === 0) && (
                     <ImageStack 
                       images={service.imageUrls} 
                       title={service.title} 
                       slug={service.id}
                     />
                   )}
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-bold text-brand-textDark leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-base text-brand-textDark/70 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex gap-3 mt-2">
                    <Link href={`/services/${service.id}`} className="flex-1">
                      <button className="flex items-center justify-center gap-2 w-full py-4 px-6 font-bold text-brand-textDark bg-white border border-brand-primary/20 rounded-xl transition-all active:scale-95 shadow-lg">
                        Explore
                      </button>
                    </Link>
                    <Link href={`/?service=${encodeURIComponent(service.title)}#contact`} className="flex-1">
                      <button className="flex items-center justify-center gap-2 w-full py-4 px-6 font-bold text-white bg-brand-primary rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-primary/20">
                        Let&apos;s Talk
                        <span className="text-xl">→</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Track */}
      <section
        ref={trackRef}
        className="hidden lg:block luxe-track"
        style={{ height: `${Math.max(1, services.length) * 100}vh` }}
      >
        <div className="sticky-viewport">
          <div className="card-container relative z-10 w-[90%] h-[calc(100%-60px)]">
            {services.map((service, i) => {
              const initialWeight = i === 0 ? 1 : 0;

              return (
                <div
                  key={service.title}
                  className="luxe-option group relative overflow-hidden rounded-[20px]"
                  style={{
                    display: 'flex',
                    flex: `${1 + (11 * initialWeight)} 1 0%`,
                    '--weight': initialWeight,
                    '--exile': 1,
                  } as React.CSSProperties}
                >
                  <div className="frosted-panel absolute inset-0 z-0 bg-gradient-to-br from-white/40 to-transparent backdrop-blur-[16px] border border-white/50" />

                  <div
                    className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center pointer-events-none overflow-hidden"
                    style={{
                      padding: "1.5rem",
                    }}
                  >
                    <div className="dynamic-image-block relative pointer-events-auto z-20">
                      {activatedCards.has(i) && (
                        <ImageStack
                          images={service.imageUrls}
                          title={service.title}
                          slug={service.id}
                        />
                      )}
                    </div>

                    <div className="text-block flex-1 w-full h-full flex flex-col justify-center items-start lg:h-full pointer-events-none z-10">
                      <div className="w-full pointer-events-auto z-20">
                        <h3 className="font-bold text-brand-textDark tracking-tight whitespace-normal"
                          style={{
                            fontSize: "calc(clamp(1rem, 5vw, 1.25rem) + (clamp(0.5rem, 4vw, 1.75rem) * var(--weight)))",
                            lineHeight: 1.1,
                          }}
                        >
                          {service.title}
                        </h3>
                      </div>

                      <div className="dynamic-details-block pointer-events-auto w-full">
                        <p className="text-xs sm:text-base lg:text-xl text-brand-textDark/80 mb-4 lg:mb-8 max-w-xl pr-4">
                          {service.description}
                        </p>
                        <div className="mt-auto lg:mt-0 pb-2 flex items-center gap-4">
                          <Link href={`/services/${service.id}`}>
                            <button className="luxe-btn flex items-center justify-center gap-2 text-sm lg:text-base py-2 px-5 lg:py-3 lg:px-7 font-medium text-brand-textDark bg-white/40 backdrop-blur-md border border-white/50 rounded-full transition-all duration-300 hover:bg-white/60 hover:shadow-xl active:scale-95">
                              Explore
                            </button>
                          </Link>
                          <Link href={`/?service=${encodeURIComponent(service.title)}#contact`}>
                            <button className="luxe-btn flex items-center justify-center gap-2 text-sm lg:text-base py-2 px-5 lg:py-3 lg:px-7 font-medium text-white bg-brand-primary rounded-full transition-all duration-300 hover:bg-brand-primary-dark hover:shadow-xl active:scale-95">
                              Let&apos;s Talk
                              <span className="text-lg">→</span>
                            </button>
                          </Link>
                        </div>
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
