"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ServiceData } from "@/lib/public-data";
import { getOptimizedUrl } from "@/lib/media-utils";

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
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    const threshold = 50;
    const len = services.length;
    if (info.offset.x > threshold) {
      setIndex((prev) => (prev > 0 ? prev - 1 : len - 1));
    } else if (info.offset.x < -threshold) {
      setIndex((prev) => (prev < len - 1 ? prev + 1 : 0));
    }
  };

  if (services.length === 0) return null;

  return (
    <div id="services" className="relative w-full bg-transparent mx-auto max-w-7xl overflow-hidden pt-10 pb-32">
      <section className="services-intro py-12 lg:py-20 flex items-center justify-center bg-transparent relative z-40">
        <div className="text-center px-6">
          <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-7xl">
            Our Services
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg font-normal text-brand-textDark/70 sm:text-lg lg:text-2xl">
            Swipe to explore our professional solutions
          </p>
        </div>
      </section>

      {/* SWIPEABLE HAND-OF-CARDS DECK */}
      <section className="relative w-full h-[650px] lg:h-[750px] flex items-center justify-center px-4 lg:px-20 -mt-8">
        <div className="relative w-full max-w-lg lg:max-w-2xl h-full flex items-center justify-center">
          <AnimatePresence initial={false}>
            {services.map((service, i) => {
              const len = services.length;
              const isCenter = i === index;
              const isLeft = i === (index - 1 + len) % len;
              const isRight = i === (index + 1) % len;
              const isHidden = !isCenter && !isLeft && !isRight;

              if (isHidden) return null;

              // Physics Variables tailored for readability
              let x = "0%";
              let rotate = 0;
              let scale = 1;
              let zIndex = 0;
              let opacity = 1;

              if (isCenter) {
                zIndex = 30;
                scale = 1;
                rotate = 0;
                x = "0%";
                opacity = 1;
              } else if (isLeft) {
                zIndex = 10;
                scale = 0.9;
                rotate = -6;
                // Expose enough of the card to read it (overlap less)
                x = isMobile ? "-45%" : "-60%";
                opacity = 0.8;
              } else if (isRight) {
                zIndex = 10;
                scale = 0.9;
                rotate = 6;
                x = isMobile ? "45%" : "60%";
                opacity = 0.8;
              }

              const primaryMedia = service.media && service.media.length > 0 ? service.media[0] : null;

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, scale: 0.8, x: "0%" }}
                  animate={{ 
                    opacity, 
                    scale, 
                    x, 
                    rotate, 
                    zIndex,
                    boxShadow: isCenter ? "0 25px 60px -15px rgba(0,0,0,0.4)" : "0 10px 30px -10px rgba(0,0,0,0.2)"
                  }}
                  exit={{ opacity: 0, scale: 0.5, x: x === "0%" ? "0%" : (isLeft ? "-100%" : "100%") }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  drag={isCenter ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  onClick={() => {
                    if (isLeft) setIndex((prev) => (prev > 0 ? prev - 1 : len - 1));
                    if (isRight) setIndex((prev) => (prev < len - 1 ? prev + 1 : 0));
                  }}
                  className={`absolute w-full h-[600px] lg:h-[700px] overflow-hidden rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-3xl flex flex-col ${
                    isCenter ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer hover:bg-white/90'
                  } transition-colors duration-300`}
                >
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-md pointer-events-none z-0" />
                  
                  {/* Lava Lamp Blobs */}
                  <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600/20 blur-[60px] lava-lamp-slow-1 pointer-events-none z-0" />
                  <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-green-500/20 blur-[50px] lava-lamp-slow-2 pointer-events-none z-0" />
                  <CardPattern index={i} />

                  <div className="relative z-10 p-5 lg:p-8 flex flex-col gap-5 lg:gap-8 h-full flex-grow pointer-events-none">
                    {/* SINGLE STATIC IMAGE - Removed nested ImageStack */}
                    {primaryMedia && (
                      <div className="w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden relative flex-shrink-0 shadow-lg border border-black/5">
                        <Image
                          src={getOptimizedUrl(primaryMedia.url, 'thumb')}
                          alt={`${service.title} Example`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    )}

                    <div className="flex flex-col gap-3 flex-grow pointer-events-auto">
                      <h3 className="text-3xl lg:text-4xl font-bold text-brand-textDark leading-tight tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-sm lg:text-lg text-brand-textDark/80 leading-relaxed font-medium">
                        {service.description}
                      </p>
                    </div>

                    {/* Action Buttons Layer - Only clickable if Center card */}
                    <div className={`flex gap-3 pb-2 transition-opacity duration-300 ${isCenter ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                      <Link href={`/services/${service.id}`} className="flex-1">
                        <button className="flex items-center justify-center gap-2 w-full py-4 px-4 font-bold text-brand-textDark bg-white/90 backdrop-blur-md border border-brand-primary/20 rounded-2xl transition-all hover:bg-white active:scale-95 shadow-sm text-sm lg:text-base">
                          Explore
                        </button>
                      </Link>
                      <Link href={`/?service=${encodeURIComponent(service.title)}#contact`} className="flex-1">
                        <button className="flex items-center justify-center gap-2 w-full py-4 px-4 font-bold text-white bg-brand-primary rounded-2xl transition-all hover:bg-brand-primary-dark active:scale-95 shadow-xl shadow-brand-primary/20 text-sm lg:text-base">
                          Let&apos;s Talk <span>→</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Navigation Arrows for Center Card */}
          {services.length > 1 && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((prev) => (prev > 0 ? prev - 1 : services.length - 1));
                }}
                className="absolute left-[-1.5rem] lg:left-[-7rem] top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-white/90 hover:bg-white active:scale-95 text-brand-textDark/70 hover:text-brand-textDark border border-black/5 shadow-xl transition-all hidden md:flex items-center justify-center backdrop-blur-xl"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((prev) => (prev < services.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-[-1.5rem] lg:right-[-7rem] top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-white/90 hover:bg-white active:scale-95 text-brand-textDark/70 hover:text-brand-textDark border border-black/5 shadow-xl transition-all hidden md:flex items-center justify-center backdrop-blur-xl"
                aria-label="Next card"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          {/* Counter UI */}
          <div className="absolute -bottom-12 lg:-bottom-20 left-1/2 -translate-x-1/2 text-brand-textDark/50 text-xs lg:text-sm font-bold uppercase tracking-widest whitespace-nowrap">
            {index + 1} / {services.length} • Swipe or Click
          </div>
        </div>
      </section>
    </div>
  );
}
