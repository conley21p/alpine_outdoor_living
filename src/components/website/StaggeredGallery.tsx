"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, X } from "lucide-react";
import { getOptimizedUrl } from "@/lib/media-utils";

interface GalleryImage {
  name: string;
  url: string;
  type: "image" | "video";
}

interface StaggeredGalleryProps {
  images: GalleryImage[];
  serviceTitle: string;
}

export function StaggeredGallery({ images, serviceTitle }: StaggeredGalleryProps) {
  // We keep track of how many images have FINISHED loading (optional for subtle polish, but no longer blocking)
  const [mounted, setMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryImage | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll when image is selected
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedItem]);

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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        <AnimatePresence mode="popLayout">
          {images.map((img, i) => {
            return (
              <motion.div
                key={img.url}
                onClick={() => setSelectedItem(img)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: (i % 4) * 0.1, // Stagger based on column position
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-700 cursor-zoom-in border border-brand-textDark/5"
              >
                {img.type === "video" ? (
                  <video
                    src={img.url}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                ) : (
                  <Image
                    src={getOptimizedUrl(img.url, 'full')}
                    alt={`${serviceTitle} project ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                  />
                )}
                
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Media Type Indicator */}
                {img.type === "video" && (
                  <div className="absolute top-4 right-4 bg-white/40 backdrop-blur-md rounded-full p-2 text-white border border-white/20">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}

                {/* Project Badge */}
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-brand-primary/90 backdrop-blur-md px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl border border-white/20 inline-block">
                    {img.type === "video" ? "Video View" : `Build ${1000 + i}`}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Lightbox / Full-size Viewer */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-brand-bgLight/80 backdrop-blur-2xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {selectedItem.type === "video" ? (
                <video
                  src={selectedItem.url}
                  className="max-w-full max-h-full rounded-2xl shadow-2xl"
                  controls
                  autoPlay
                />
              ) : (
                <Image
                  src={getOptimizedUrl(selectedItem.url, 'full')}
                  alt="Selected project image"
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                />
              )}
            </motion.div>

            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-8 right-8 z-[110] h-12 w-12 flex items-center justify-center rounded-full bg-white shadow-xl text-brand-textDark hover:scale-110 active:scale-95 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
