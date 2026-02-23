"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export interface GalleryImage {
  name: string;
  url: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  previewOnly?: boolean;
}

export function GalleryGrid({ images, previewOnly = false }: GalleryGridProps) {
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const displayImages = previewOnly ? images.slice(0, 6) : images;
  const slides = useMemo(
    () => displayImages.map((image) => ({ src: image.url, title: image.name })),
    [displayImages],
  );

  if (displayImages.length === 0) {
    return (
      <section className="mx-auto max-w-[90rem] px-6 py-20 lg:px-12 lg:py-32">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-6xl">
            Gallery
          </h2>
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl bg-brand-bgLight p-12 text-center">
            <p className="text-lg font-normal text-brand-textDark/70">
              Portfolio coming soon — check back later
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[90rem] px-6 py-20 lg:px-12 lg:py-32">
      <div className="mb-16 text-center lg:mb-20">
        <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-6xl">
          Our Work
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-normal text-brand-textDark/70 sm:text-xl lg:text-2xl">
          Explore our recent projects
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
        {displayImages.map((image, index) => (
          <button
            key={`${image.name}-${index}`}
            className="group relative overflow-hidden rounded-xl"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open image ${image.name}`}
          >
            <div className="relative h-60 w-full lg:h-80">
              <Image
                src={image.url}
                alt={image.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </button>
        ))}
      </div>
      {previewOnly && (
        <div className="mt-12 text-center">
          <Link 
            href="/gallery" 
            className="inline-flex items-center gap-2 text-[17px] font-normal text-brand-accent transition-opacity hover:opacity-70"
          >
            View all photos
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      )}

      <Lightbox
        open={openIndex >= 0}
        close={() => setOpenIndex(-1)}
        index={openIndex >= 0 ? openIndex : 0}
        slides={slides}
      />
    </section>
  );
}
