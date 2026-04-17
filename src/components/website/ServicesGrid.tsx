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
  
  // Cache for DOM values to prevent redundant writes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prevStates = useRef<Map<number, Record<string, any>>>(new Map());

  useGSAP(() => {
    if (!trackRef.current || services.length === 0) return;

    const cards = gsap.utils.toArray<HTMLElement>('.luxe-option');
    const totalTransitions = cards.length - 1;

    if (isMobile) {
      // MOBILE: No scrubbing, just clean native transitions
      cards.forEach((card, i) => {
        gsap.set(card, { 
          opacity: 0, 
          y: 20,
          flex: "1 1 auto",
          maxHeight: "none"
        });

        const imgBlock = card.querySelector('.dynamic-image-block');
        if (imgBlock) gsap.set(imgBlock, { opacity: 0 });

        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          onEnter: () => {
            gsap.to(card, { 
              opacity: 1, 
              y: 0, 
              duration: 0.6, 
              ease: "power2.out",
              onStart: () => {
                if (!activatedRef.current.has(i)) {
                  activatedRef.current.add(i);
                  setActivatedCards(new Set(activatedRef.current));
                }
              }
            });
            if (imgBlock) {
              gsap.to(imgBlock, { opacity: 1, delay: 0.2, duration: 0.8 });
            }
          },
          once: true // Trigger only once for maximum mobile performance
        });
      });
    } else {
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
    }
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

      {/* Track */}
      <section
        ref={trackRef}
        className="luxe-track"
        style={{ height: isMobile ? 'auto' : `${Math.max(1, services.length) * 100}vh` }}
      >
        <div className="sticky-viewport">
          <div className="card-container relative z-10 w-[92%] h-[calc(100%-20px)] lg:w-[90%] lg:h-[calc(100%-60px)]">
            {services.map((service, i) => {
              const initialWeight = i === 0 ? 1 : 0;

              return (
                <div
                  key={service.title}
                  className="luxe-option group relative overflow-hidden rounded-[20px]"
                  style={{
                    display: 'flex',
                    flex: isMobile ? "1 1 auto" : `${1 + (11 * initialWeight)} 1 0%`,
                    '--weight': isMobile ? 1 : initialWeight,
                    '--exile': 1,
                  } as React.CSSProperties}
                >
                  <div className="frosted-panel absolute inset-0 z-0 bg-gradient-to-br from-white/40 to-transparent backdrop-blur-[16px] border border-white/50" />

                  {/* True Native Layout engine mapping GSAP bounds to flex sizes for organic FLIP */}
                  <div
                    className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center pointer-events-none overflow-hidden"
                    style={{
                      // Fixed comfortable padding - not scrubbed by exile so content stays aligned
                      padding: "1.5rem",
                    }}
                  >

                    {/* Image block — z-20 so it slides in OVER the text on mobile during animation */}
                    <div className="dynamic-image-block relative pointer-events-auto z-20">
                      {activatedCards.has(i) && (
                        <ImageStack
                          images={service.imageUrls}
                          title={service.title}
                        />
                      )}
                    </div>

                    {/* Text Block - z-10 so image can slide over it on mobile */}
                    <div className="text-block flex-1 w-full h-full flex flex-col justify-center items-start lg:h-full pointer-events-none z-10">



                      {/* The Magic Title - Because everything else collapses to 0 height/width organically, this aligns perfectly to the left/center structurally! */}
                      <div className="w-full pointer-events-auto z-20">
                        <h3 className="font-bold text-brand-textDark tracking-tight whitespace-normal"
                          style={{
                            fontSize: isMobile 
                              ? "clamp(1.5rem, 6vw, 2.5rem)" // Stable large title on mobile
                              : "calc(clamp(1rem, 5vw, 1.25rem) + (clamp(0.5rem, 4vw, 1.75rem) * var(--weight)))",
                            lineHeight: 1.1,
                          }}
                        >
                          {service.title}
                        </h3>
                      </div>

                      {/* Description and Action Hub expands below the title pushing it UP! */}
                      <div className="dynamic-details-block pointer-events-auto w-full">
                        <p className="text-xs sm:text-base lg:text-xl text-brand-textDark/80 mb-4 lg:mb-8 max-w-xl pr-4">
                          {service.description}
                        </p>
                        <div className="mt-auto lg:mt-0 pb-2">
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
