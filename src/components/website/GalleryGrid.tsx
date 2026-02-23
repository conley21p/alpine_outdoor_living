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
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-brand-textDark">Gallery</h2>
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          Portfolio coming soon — check back soon!
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-brand-textDark">Gallery</h2>
        {previewOnly && (
          <Link href="/gallery" className="text-sm font-semibold text-brand-secondary">
            View Gallery
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {displayImages.map((image, index) => (
          <button
            key={`${image.name}-${index}`}
            className="relative overflow-hidden rounded-lg border border-slate-200"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open image ${image.name}`}
          >
            <div className="relative h-44 w-full">
              <Image
                src={image.url}
                alt={image.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition hover:scale-105"
              />
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
