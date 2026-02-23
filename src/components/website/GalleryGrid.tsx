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
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-black text-brand-textDark sm:text-4xl">Gallery</h2>
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center text-gray-600">
          <p className="text-lg font-medium">Portfolio coming soon — check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-brand-textDark sm:text-4xl">Gallery</h2>
          <p className="mt-2 text-base text-gray-600">Explore our recent projects</p>
        </div>
        {previewOnly && (
          <Link href="/gallery" className="group flex items-center gap-1 text-sm font-bold text-brand-primary transition-colors hover:text-brand-accent">
            View all
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {displayImages.map((image, index) => (
          <button
            key={`${image.name}-${index}`}
            className="group relative overflow-hidden rounded-xl border border-gray-100 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open image ${image.name}`}
          >
            <div className="relative h-52 w-full lg:h-64">
              <Image
                src={image.url}
                alt={image.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={openIndex >= 0}
        close={() => setOpenIndex(-1)}
        index={openIndex >= 0 ? openIndex : 0}
        slides={slides}
      />
    </section>
  );
}
