"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getOptimizedUrl } from "@/lib/media-utils";

interface ImageStackProps {
  images: string[];
  title: string;
  slug: string; // Used for navigation
}

export function ImageStack({ images, title, slug }: ImageStackProps) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Swipe logic
  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      // Swipe Right -> Prev
      setIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (info.offset.x < -threshold) {
      // Swipe Left -> Next
      setIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center px-10 lg:px-14 overflow-visible">
      <div className="relative w-full aspect-[4/3] preserve-3d">
        <AnimatePresence initial={false}>
          {images.map((img, i) => {
            const isCenter = i === index;
            const isLeft = i === index - 1;
            const isRight = i === index + 1;
            const isHidden = !isCenter && !isLeft && !isRight;

            if (isHidden) return null;

            let x = 0;
            let rotate = 0;
            let scale = 1;
            let zIndex = 0;
            let opacity = 1;

            if (isCenter) {
              zIndex = 30;
              scale = 1;
              rotate = 0;
              x = 0;
            } else if (isLeft) {
              zIndex = 10;
              scale = 0.85;
              rotate = -8;
              x = -35;
              opacity = 0.5;
            } else if (isRight) {
              zIndex = 10;
              scale = 0.85;
              rotate = 8;
              x = 35;
              opacity = 0.5;
            }

            return (
              <motion.div
                key={img}
                initial={{ opacity: 0, scale: 0.8, x: 0 }}
                animate={{ 
                  opacity, 
                  scale, 
                  x, 
                  rotate, 
                  zIndex,
                  boxShadow: isCenter ? "0 25px 50px -12px rgba(0,0,0,0.5)" : "0 10px 20px rgba(0,0,0,0.2)"
                }}
                exit={{ opacity: 0, scale: 0.5, x: x * 1.5 }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                drag={isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  if (isCenter) {
                    router.push(`/services/${slug}`);
                  }
                }}
                className="absolute inset-0 cursor-pointer rounded-2xl overflow-hidden bg-white"
              >
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                <Image
                  src={getOptimizedUrl(img, 'thumb')}
                  alt={`${title} - image ${i + 1}`}
                  fill
                  className="object-cover pointer-events-none"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                  loading="lazy"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Navigation Arrows - Desktop Only */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }}
          disabled={index === 0}
          className={`absolute left-[-2.5rem] lg:left-[-3rem] top-1/2 -translate-y-1/2 z-50 p-2 lg:p-3 rounded-full bg-white/40 hover:bg-white/80 active:scale-95 text-brand-textDark/40 hover:text-brand-textDark shadow-sm transition-all hidden lg:flex items-center justify-center backdrop-blur-md border border-white/20 ${index === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
          }}
          disabled={index === images.length - 1}
          className={`absolute right-[-2.5rem] lg:right-[-3rem] top-1/2 -translate-y-1/2 z-50 p-2 lg:p-3 rounded-full bg-white/40 hover:bg-white/80 active:scale-95 text-brand-textDark/40 hover:text-brand-textDark shadow-sm transition-all hidden lg:flex items-center justify-center backdrop-blur-md border border-white/20 ${index === images.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        {/* Counter UI */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-brand-textDark/40 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
          {index + 1} / {images.length} • Swipe to Browse
        </div>
      </div>
    </div>
  );
}
