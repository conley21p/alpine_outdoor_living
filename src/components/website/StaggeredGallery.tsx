"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { getOptimizedUrl } from "@/lib/media-utils";

interface GalleryImage {
  name: string;
  url: string;
}

interface StaggeredGalleryProps {
  images: GalleryImage[];
  serviceTitle: string;
}

export function StaggeredGallery({ images, serviceTitle }: StaggeredGalleryProps) {
  // We keep track of how many images have FINISHED loading
  // We allow rendering current + 1 to keep the sequential chain moving
  const [loadedCount, setLoadedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6">
          <ImageIcon className="w-8 h-8 text-brand-primary/40" />
        </div>
        <h3 className="text-2xl font-bold text-brand-textDark">No Projects Found</h3>
        <p className="text-brand-textDark/60 mt-2">Check back soon for latest project imagery.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      <AnimatePresence>
        {images.map((img, i) => {
          // Logic: Only render if it's within the loaded set OR it's the next one to load
          const isVisible = i <= loadedCount;

          if (!isVisible) return null;

          return (
            <motion.div
              key={img.url}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.7, 
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src={getOptimizedUrl(img.url, 'full')}
                alt={`${serviceTitle} project ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                unoptimized
                onLoad={() => {
                   // When THIS image is done, allow the next one to render
                   setLoadedCount(prev => Math.max(prev, i + 1));
                }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Image Detail Badge */}
              <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-brand-textDark shadow-lg border border-white/50 inline-block">
                  Build No. {1000 + i}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
