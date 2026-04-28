import type { CSSProperties } from "react";

interface PicturePhotoProps {
  /** Image source path (e.g. "/fallback/.../Project.png"). */
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /**
   * Whether the image is in the initial viewport. Eagerly loaded and
   * decoded synchronously when true.
   */
  priority?: boolean;
  /** Optional `sizes` attribute for the responsive variants. */
  sizes?: string;
  /**
   * If true, sets `draggable={false}` and disables iOS long-press image
   * preview. Useful when this image lives inside a swipeable carousel.
   */
  noDrag?: boolean;
}

/**
 * A small `<picture>` wrapper that serves AVIF + WebP + a final fallback.
 *
 * Why a custom wrapper:
 * - The site uses `next/image` with `unoptimized: true` (static export to
 *   Cloudflare Pages), so Next.js can't generate or pick formats at request
 *   time. We ship pre-encoded variants and let the browser choose.
 * - Browsers walk `<source>` elements top-down and use the first one whose
 *   `type` they support. So AVIF first (smallest), then WebP, then a final
 *   `<img>` that any browser can fall back to.
 *
 * The `src` should point at the canonical file (PNG/JPEG). We derive the
 * sibling `.webp` / `.avif` URLs by stripping the extension.
 */
export function PicturePhoto({
  src,
  alt,
  className,
  style,
  priority = false,
  sizes,
  noDrag = false,
}: PicturePhotoProps) {
  const lastDot = src.lastIndexOf(".");
  const stem = lastDot >= 0 ? src.slice(0, lastDot) : src;
  const avifSrc = `${stem}.avif`;
  const webpSrc = `${stem}.webp`;

  const imgStyle: CSSProperties = noDrag
    ? ({
        ...style,
        WebkitTouchCallout: "none",
        WebkitUserDrag: "none",
        userSelect: "none",
        pointerEvents: "none",
      } as CSSProperties)
    : style ?? {};

  return (
    <picture>
      <source type="image/avif" srcSet={avifSrc} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrc} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        className={className}
        style={imgStyle}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        draggable={noDrag ? false : undefined}
      />
    </picture>
  );
}
