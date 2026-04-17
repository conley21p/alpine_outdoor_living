"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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

  useGSAP(() => {
    if (!trackRef.current || services.length === 0) return;
    
    const cards = gsap.utils.toArray<HTMLElement>('.luxe-option');
    const totalTransitions = cards.length - 1;

    // Use GSAP ScrollTrigger to scrub progress perfectly onto inline variables
    ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6, // Balanced responsiveness and smoothness
      onUpdate: (self) => {
        const p = self.progress; 
        const scrubIdx = p * totalTransitions; 
        
        cards.forEach((card, i) => {
          const dist = Math.abs(i - scrubIdx);
          const w = Math.max(0, 1 - Math.min(1, dist));
          
          // Exile: cards start shrinking when dist > 1.25, gone by 2.25
          const exileStart = 1.25;
          const exileEnd = 2.25;
          const exile = Math.max(0, 1 - Math.max(0, dist - exileStart) / (exileEnd - exileStart));

          const isVisible = exile > 0.01; 
          const finalFlex = (1 + (11 * w)) * exile;

          card.style.setProperty('--weight', w.toString());
          card.style.setProperty('--exile', exile.toString());
          card.style.flex = `${finalFlex} 1 0%`;
          card.style.display = isVisible ? 'flex' : 'none';
          card.style.opacity = exile.toString();

          // Mark card as activated once it gets any weight, deferring ImageStack mount
          if (w > 0.01 && !activatedRef.current.has(i)) {
            activatedRef.current.add(i);
            setActivatedCards(new Set(activatedRef.current));
          }
          
          if (dist > 1) {
            card.style.maxHeight = `${Math.max(0, exile * 300)}px`;
            card.style.marginBottom = `${exile * (window.innerWidth >= 1024 ? 15 : 10)}px`;
          } else {
            card.style.maxHeight = '2000px';
            card.style.marginBottom = `${window.innerWidth >= 1024 ? 15 : 10}px`;
          }
        });
      }
    });
  }, { scope: containerRef, dependencies: [services.length] });

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
        style={{ height: `${Math.max(1, services.length) * 100}vh` }}
      >
        <div className="sticky-viewport">
          <div className="card-container relative z-10 w-[92%] h-[calc(100%-20px)] lg:w-[90%] lg:h-[calc(100%-60px)]">
            {services.map((service, i) => {
              const initialWeight = i === 0 ? 1 : 0;
              const isVisible = i <= 1;

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
                  <div className="frosted-panel absolute inset-0 z-0 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-[16px] border border-white/60" />
                  
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
                      
                      {/* Number Hook */}
                      <div className="dynamic-number-block w-full">
                        <span className="block text-brand-textDark/50 uppercase tracking-[0.2em] font-bold text-[10px] lg:text-xs mb-1">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                      </div>

                      {/* The Magic Title - Because everything else collapses to 0 height/width organically, this aligns perfectly to the left/center structurally! */}
                      <div className="w-full flex-shrink-0 pointer-events-auto z-20">
                        <h3 className="font-bold text-brand-textDark whitespace-nowrap tracking-tight" 
                          style={{ 
                            fontSize: "calc(1.25rem + (1.75rem * var(--weight)))",
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
                            <button className="luxe-btn flex items-center justify-center gap-2 text-sm lg:text-base py-2 px-5 lg:py-3 lg:px-7 font-medium text-white bg-brand-primary rounded-full hover:opacity-80 transition-opacity">
                              Explore Details
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
