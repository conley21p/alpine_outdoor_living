"use client";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import type { GalleryPhoto } from "@/lib/project-media";

interface PhotoLightboxProps {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
}

/**
 * Full-size photo viewer. Loaded on demand by GalleryGrid, so neither the
 * library nor its CSS is in the page bundle until someone opens a photo.
 */
export default function PhotoLightbox({ photos, index, onClose }: PhotoLightboxProps) {
  return (
    <Lightbox
      open
      index={index}
      close={onClose}
      plugins={[Captions]}
      captions={{ descriptionTextAlign: "center" }}
      slides={photos.map((photo) => ({
        src: photo.src,
        alt: photo.caption ?? "Bathroom remodel photo",
        description: photo.caption ?? undefined,
      }))}
    />
  );
}
