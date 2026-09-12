"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { GalleryPhoto } from "@/lib/project-media";

const PhotoLightbox = dynamic(() => import("./PhotoLightbox"), { ssr: false });

interface GalleryGridProps {
  photos: GalleryPhoto[];
}

export function GalleryGrid({ photos }: GalleryGridProps) {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <>
      {/*
       * Square tiles keep portrait and landscape phone shots in an even grid.
       * The crop only affects the thumbnail; the lightbox shows the full photo.
       */}
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {photos.map((photo, index) => (
          <li key={photo.src}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`View larger: ${photo.caption ?? "bathroom remodel photo"}`}
              className="group block aspect-square w-full overflow-hidden rounded-2xl bg-black/5 shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50"
            >
              <img
                src={photo.thumb}
                alt={photo.caption ?? "Bathroom remodel photo"}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      {openIndex >= 0 ? (
        <PhotoLightbox photos={photos} index={openIndex} onClose={() => setOpenIndex(-1)} />
      ) : null}
    </>
  );
}
