"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { ServiceData } from "@/lib/public-data";
import { ImageStack } from "./ImageStack";

interface ServicesGridProps {
  services?: ServiceData[];
}

const CardPattern = ({ index }: { index: number }) => {
  const patterns = [
    // 0: Waves (Fluid)
    <svg key="pattern-waves" className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern-0" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 Q 25 0 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern-0)" />
    </svg>,
    // 1: Dots (Grid)
    <svg key="pattern-dots" className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern-1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern-1)" />
    </svg>,
    // 2: Diagonal Lines (Dynamic)
    <svg key="pattern-lines" className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern-2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern-2)" />
    </svg>,
    // 3: Hexagons (Technical)
    <svg key="pattern-hex" className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern-3" x="0" y="0" width="28" height="49" patternUnits="userSpaceOnUse">
          <path d="M14 0 L28 7 L28 21 L14 28 L0 21 L0 7 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern-3)" />
    </svg>
  ];
  return patterns[index % patterns.length];
};

export function ServicesGrid({ services = [] }: ServicesGridProps) {
  const [activatedCards, setActivatedCards] = useState<Set<number>>(new Set([0]));
  const activatedRef = useRef<Set<number>>(new Set([0]));

  useEffect(() => {
    if (services.length <= 1) return;

    const interval = setInterval(() => {
      setActivatedCards((prev) => {
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
  }, [services.length]);

  if (services.length === 0) return null;

  return (
    <div id="services" className="relative w-full bg-transparent mx-auto max-w-7xl">
      <section className="services-intro py-20 flex items-center justify-center bg-transparent">
        <div className="text-center px-6">
          <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-7xl">
            Our Services
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-normal text-brand-textDark/70 sm:text-xl lg:text-3xl">
            Professional outdoor solutions tailored to your needs
          </p>
        </div>
      </section>

      {/* SINGLE RESPONSIVE DESIGN - Removes complex GSAP desktop animations */}
      <section className="px-4 lg:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="relative overflow-hidden rounded-[24px] border border-brand-primary/10 shadow-xl flex flex-col"
            >
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xl pointer-events-none" />
              
              {/* EXPLICIT TAILWIND COLORS: Fixes gradient opacity issues caused by CSS variables */}
              <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600/20 blur-[60px] lava-lamp-slow-1 pointer-events-none" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-green-500/20 blur-[50px] lava-lamp-slow-2 pointer-events-none" />
              <CardPattern index={i} />

              <div className="relative z-10 p-6 flex flex-col gap-6 h-full">
                <div className="w-full aspect-[4/3] rounded-2xl flex-shrink-0">
                  {(activatedCards.has(i) || i === 0) && (
                    <ImageStack
                      media={service.media}
                      title={service.title}
                      slug={service.id}
                    />
                  )}
                </div>

                <div className="flex flex-col gap-4 flex-grow justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-brand-textDark leading-tight mb-2">
                      {service.title}
                    </h3>
                    <p className="text-base text-brand-textDark/70 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Link href={`/services/${service.id}`} className="flex-1">
                      <button className="flex items-center justify-center gap-2 w-full py-3 px-4 font-bold text-brand-textDark bg-white border border-brand-primary/20 rounded-xl transition-all active:scale-95 shadow-sm h-full">
                        Explore
                      </button>
                    </Link>
                    <Link href={`/?service=${encodeURIComponent(service.title)}#contact`} className="flex-1">
                      <button className="flex items-center justify-center gap-2 w-full py-3 px-4 font-bold text-white bg-brand-primary rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-primary/20 h-full">
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
    </div>
  );
}
