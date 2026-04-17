"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import Image from "next/image";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageStackProps {
  images: string[];
  title: string;
}

export function ImageStack({ images, title }: ImageStackProps) {
  const [index, setIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

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

  // Indices for the trio
  const centerIdx = index;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 lg:p-8 overflow-visible">
      <div className="relative w-full aspect-[4/3] max-w-sm lg:max-w-md preserve-3d">
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
                layoutId={`img-${title}-${img}`}
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
                onClick={() => isCenter && setIsExpanded(true)}
                className="absolute inset-0 cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden bg-white"
              >
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                <Image
                  src={img}
                  alt={`${title} - image ${i + 1}`}
                  fill
                  className="object-cover pointer-events-none"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                  loading="lazy"
                />
                
                {isCenter && (
                  <div className="absolute top-4 right-4 z-40 bg-black/40 backdrop-blur-md p-2 rounded-full hidden lg:block">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                )}
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

      {/* Expanded Modal Gallery - rendered via Portal to escape stacking context */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 lg:p-20"
              onClick={() => setIsExpanded(false)}
            >
              {/* Close Button - positioned to top-right of screen */}
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-6 right-6 lg:top-10 lg:right-10 text-white/40 hover:text-white z-[100000] p-4 bg-white/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6" /> 
              </button>

              <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>


                  <div className="relative w-full flex-1 flex items-center justify-center">
                     <motion.div 
                       layoutId={`img-${title}-${images[index]}`}
                       className="relative w-full h-fit max-h-full aspect-[4/3] lg:aspect-video rounded-3xl overflow-hidden shadow-2xl bg-white/5"
                     >
                       <Image
                          src={images[index]}
                          alt={title}
                          fill
                          className="object-contain"
                          unoptimized
                          loading="lazy"
                       />
                     </motion.div>
                     
                     {/* Linear Browser Controls */}
                     <div className="absolute inset-x-0 bottom-10 lg:bottom-1/2 lg:translate-y-1/2 flex justify-between items-center px-4 md:px-10 z-[100001] pointer-events-none">
                        <button 
                          onClick={() => setIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                          className="bg-white/10 hover:bg-white/20 p-4 rounded-full text-white backdrop-blur-xl pointer-events-auto transition-transform hover:scale-110 active:scale-95"
                        >
                          ←
                        </button>
                        <button 
                          onClick={() => setIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                          className="bg-white/10 hover:bg-white/20 p-4 rounded-full text-white backdrop-blur-xl pointer-events-auto transition-transform hover:scale-110 active:scale-95"
                        >
                          →
                        </button>
                     </div>
                  </div>

                  <div className="h-20 flex flex-col items-center justify-center">
                    <div className="text-white font-bold text-lg tracking-tight">{title}</div>
                    <div className="text-white/40 text-xs font-bold tracking-widest uppercase mt-1">
                      {index + 1} / {images.length}
                    </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
