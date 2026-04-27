"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, type PanInfo, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ServiceData } from "@/lib/public-data";
import { getOptimizedUrl } from "@/lib/media-utils";

interface ServicesGridProps {
  services?: ServiceData[];
  sectionId?: string;
  title?: string;
  subtitle?: string;
}



export function ServicesGrid({
  services = [],
  sectionId = "services",
  title = "Our Services",
  subtitle = "Swipe to explore our professional solutions",
}: ServicesGridProps) {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Autoplay disabled when mobile uses the vertical list layout.
    if (isMobile) return;
    if (!isAutoPlaying || services.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev < services.length - 1 ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isMobile, services.length]);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    const threshold = 50;
    const len = services.length;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > threshold) {
        setIndex((prev) => (prev > 0 ? prev - 1 : len - 1));
      } else if (info.offset.x < -threshold) {
        setIndex((prev) => (prev < len - 1 ? prev + 1 : 0));
      }
    }
  };

  if (services.length === 0) return null;

  if (isMobile) {
    return (
      <div id={sectionId} className="relative w-full bg-transparent overflow-x-hidden pt-10 pb-24">
        <section className="services-intro py-10 flex items-center justify-center bg-transparent relative z-40">
          <div className="text-center px-6">
            <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base font-normal text-brand-textDark/70 sm:text-lg">
              {subtitle}
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-2xl px-6">
          <div className="space-y-6">
            {services.map((service) => {
              const primaryMedia = service.media && service.media.length > 0 ? service.media[0] : null;
              return (
                <div
                  key={service.id}
                  className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/85 bg-[radial-gradient(120%_90%_at_20%_10%,rgba(193,18,31,0.26)_0%,rgba(255,255,255,0.92)_54%,rgba(255,255,255,0.86)_100%)] shadow-[0_18px_60px_-24px_rgba(0,0,0,0.35)]"
                >
                  {/* Inner highlight */}
                  <div className="absolute inset-0 pointer-events-none rounded-[28px] ring-1 ring-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]" />

                  {/* Lava blobs (static, lighter blur for perf) */}
                  <div className="absolute top-[-18%] left-[-18%] w-[78%] h-[78%] rounded-full bg-brand-primary/30 blur-[26px] pointer-events-none" />
                  <div className="absolute bottom-[8%] right-[-12%] w-[58%] h-[58%] rounded-full bg-brand-secondary/35 blur-[22px] pointer-events-none" />
                  <div className="absolute top-[35%] right-[-20%] w-[52%] h-[52%] rounded-full bg-orange-400/20 blur-[22px] pointer-events-none" />

                  <div className="relative z-10 p-5 flex flex-col gap-5">
                    {primaryMedia && (
                      <div className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden relative shadow-lg border border-black/5">
                        <Image
                          src={getOptimizedUrl(primaryMedia.url, "thumb")}
                          alt={`${service.title} example`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 560px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-brand-textDark tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-base text-brand-textDark/75 leading-relaxed font-medium">
                        {service.description}
                      </p>
                    </div>

                    <Link href={`/?service=${encodeURIComponent(service.title)}#contact`}>
                      <button className="w-full py-4 px-4 font-bold text-white bg-brand-primary rounded-2xl transition-all active:scale-[0.99] shadow-xl shadow-brand-primary/20 text-base">
                        Let&apos;s Talk <span>→</span>
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div id={sectionId} className="relative w-full bg-transparent overflow-x-hidden pt-10 pb-32">
      <section className="services-intro py-12 lg:py-20 flex items-center justify-center bg-transparent relative z-40">
        <div className="text-center px-6">
          <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-7xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg font-normal text-brand-textDark/70 sm:text-lg lg:text-2xl">
            {subtitle}
          </p>
        </div>
      </section>

      {/* SWIPEABLE HAND-OF-CARDS DECK (desktop) */}
      <section className="relative isolate w-full h-[650px] lg:h-[750px] flex items-center justify-center px-8 lg:px-20 -mt-8 overflow-hidden">
        <div className="relative w-[85%] lg:w-full max-w-md lg:max-w-xl h-full flex items-center justify-center">
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
                x = isMobile ? "-35%" : "-80%";
                opacity = 0.8;
              } else if (isRight) {
                zIndex = 10;
                scale = 0.9;
                rotate = 6;
                x = isMobile ? "35%" : "80%";
                opacity = 0.8;
              }

              const primaryMedia = service.media && service.media.length > 0 ? service.media[0] : null;
              const boxShadow = isCenter
                ? "0 25px 60px -15px rgba(0,0,0,0.4)"
                : "0 10px 30px -10px rgba(0,0,0,0.2)";

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, scale: 0.8, x: "0%" }}
                  animate={{
                    opacity,
                    scale,
                    x,
                    rotate,
                  }}
                  exit={{ opacity: 0, scale: 0.5, x: x === "0%" ? "0%" : (isLeft ? "-100%" : "100%") }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.01 }
                      : isMobile
                        ? { type: "tween", ease: [0.2, 0.8, 0.2, 1], duration: 0.35 }
                        : { type: "spring", stiffness: 220, damping: 25 }
                  }
                  drag={isCenter ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragStart={() => {
                    // Stop autoplay on first user interaction (even a small swipe).
                    setIsAutoPlaying(false);
                  }}
                  onDragEnd={handleDragEnd}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    if (isLeft) setIndex((prev) => (prev > 0 ? prev - 1 : len - 1));
                    if (isRight) setIndex((prev) => (prev < len - 1 ? prev + 1 : 0));
                  }}
                  style={{
                    zIndex,
                    boxShadow,
                    willChange: "transform, opacity",
                    transform: "translateZ(0)",
                    // Helps mobile browsers allow horizontal drag smoothly
                    touchAction: isCenter ? "pan-y" : "auto",
                  }}
                  className={`absolute w-full h-[600px] lg:h-[700px] overflow-hidden rounded-[32px] border border-white/60 bg-white/80 bg-[radial-gradient(120%_90%_at_20%_10%,rgba(193,18,31,0.34)_0%,rgba(255,255,255,0.90)_52%,rgba(255,255,255,0.82)_100%)] flex flex-col transform-gpu ${
                    isCenter ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer hover:bg-white/90'
                  } transition-colors duration-300`}
                >
                  {/* Frosted glass overlay (desktop only for perf) */}
                  {!isMobile && (
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl pointer-events-none z-0" />
                  )}
                  {/* Inner highlight for stronger "frost" */}
                  <div className="absolute inset-0 pointer-events-none rounded-[32px] ring-1 ring-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] z-[1]" />
                  
                  {/* Lava Lamp Blobs (static on mobile; animated on desktop) */}
                  <div
                    className={`absolute top-[-18%] left-[-18%] w-[80%] h-[80%] rounded-full bg-brand-primary/35 pointer-events-none z-0 ${
                      isMobile ? "blur-[32px]" : "blur-[60px] lava-lamp-slow-1"
                    }`}
                  />
                  <div
                    className={`absolute bottom-[8%] right-[-12%] w-[60%] h-[60%] rounded-full bg-brand-secondary/45 pointer-events-none z-0 ${
                      isMobile ? "blur-[28px]" : "blur-[50px] lava-lamp-slow-2"
                    }`}
                  />
                  <div
                    className={`absolute top-[35%] right-[-20%] w-[55%] h-[55%] rounded-full bg-orange-400/25 pointer-events-none z-0 ${
                      isMobile ? "blur-[26px]" : "blur-[55px] lava-lamp-slow-1"
                    }`}
                  />

                  <div className="relative z-10 p-5 lg:p-8 flex flex-col gap-5 lg:gap-8 h-full flex-grow pointer-events-none">
                    {/* SINGLE STATIC IMAGE - Removed nested ImageStack */}
                    {primaryMedia && (
                      <div className="w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden relative flex-shrink-0 shadow-lg border border-black/5">
                        <Image
                          src={getOptimizedUrl(primaryMedia.url, 'thumb')}
                          alt={`${service.title} Example`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                          priority={i === 0}
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
                  setIsAutoPlaying(false);
                  setIndex((prev) => (prev > 0 ? prev - 1 : services.length - 1));
                }}
                className="absolute left-[-1.25rem] lg:left-[-7rem] top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 rounded-full bg-white/40 hover:bg-white/55 active:scale-95 text-brand-textDark/70 hover:text-brand-textDark border border-white/60 backdrop-blur-xl transition-all hidden md:flex items-center justify-center"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAutoPlaying(false);
                  setIndex((prev) => (prev < services.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-[-1.25rem] lg:right-[-7rem] top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 rounded-full bg-white/40 hover:bg-white/55 active:scale-95 text-brand-textDark/70 hover:text-brand-textDark border border-white/60 backdrop-blur-xl transition-all hidden md:flex items-center justify-center"
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
