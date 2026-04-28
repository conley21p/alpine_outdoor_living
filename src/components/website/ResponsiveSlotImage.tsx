"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { siteImageSlots, type SiteImageSlot } from "@/lib/site-images";
import { getOptimizedUrl } from "@/lib/media-utils";

interface ResponsiveSlotImageProps {
  slot?: SiteImageSlot;
  overrideWide?: string | null;
  overrideVert?: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
  mobileAspectClassName?: string;
  desktopAspectClassName?: string;
  children?: ReactNode;
}

/**
 * Responsive hero/slot image.
 *
 * Performance notes:
 * - We render ONE <picture> element with a media-queried <source> so the
 *   browser fetches only the appropriate variant. Previously two <Image>
 *   elements were rendered side by side (mobile + desktop) which made
 *   mobile devices download both, doubling hero bytes.
 * - The aspect-ratio container changes at the `md` breakpoint via Tailwind
 *   classes so the layout still adapts without rendering a second image.
 * - We skip the backdrop-filter loading shimmer because compositing a
 *   viewport-sized blurred overlay is expensive on mobile GPUs. A plain
 *   color fade is more than sufficient for that brief moment.
 */
export function ResponsiveSlotImage({
  slot,
  overrideWide,
  overrideVert,
  alt,
  priority = false,
  className,
  mobileAspectClassName = "aspect-[3/4]",
  desktopAspectClassName = "aspect-[21/9]",
  children,
}: ResponsiveSlotImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const slotConfig = slot ? siteImageSlots[slot] : null;
  const wideSrc = overrideWide || slotConfig?.desktopSrc || "";
  const vertSrc = overrideVert || slotConfig?.mobileSrc || wideSrc;

  if (!wideSrc && !vertSrc) {
    return (
      <div className={cn("relative overflow-hidden bg-brand-bgLight", className)}>
        <div className={cn("relative", desktopAspectClassName)} />
        {children ? <div className="absolute inset-0 z-10">{children}</div> : null}
      </div>
    );
  }

  const wideUrl = wideSrc ? getOptimizedUrl(wideSrc, "full") : "";
  const vertUrl = vertSrc ? getOptimizedUrl(vertSrc, "full") : wideUrl;
  const fallbackUrl = wideUrl || vertUrl;

  // Derive optimized format URLs (WebP) by swapping the extension on
  // local paths. We only attempt this for paths that look like local image
  // files — Cloudinary and other URLs flow through unchanged.
  const swapExt = (url: string, ext: string) => {
    if (!url || /^(https?:|data:)/i.test(url)) return url;
    const dot = url.lastIndexOf(".");
    return dot > 0 ? `${url.slice(0, dot)}.${ext}` : url;
  };
  const wideWebp = swapExt(wideUrl, "webp");
  const vertWebp = swapExt(vertUrl, "webp");
  const isLocal = (u: string) => u && !/^(https?:|data:)/i.test(u);

  return (
    <div className={cn("relative overflow-hidden bg-brand-bgLight", className)}>
      <div
        className={cn(
          // Cap desktop hero height so ultra-wide viewports don't create a
          // banner taller than the visible window.
          "relative w-full md:max-h-[calc(100vh-80px)] md:max-h-[calc(100dvh-80px)]",
          mobileAspectClassName,
          // Swap the aspect ratio at the md breakpoint without rendering a
          // second image element. The matching desktop class is built up by
          // prefixing each token with `md:`.
          desktopAspectClassName
            .split(" ")
            .map((cls) => (cls.startsWith("md:") ? cls : `md:${cls}`))
            .join(" ")
        )}
      >
        {/* Lightweight skeleton — no backdrop-filter on mobile */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 z-20 bg-brand-bgLight/60 transition-opacity duration-700",
            isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        />

        <picture>
          {/*
           * Browser walks <source> top to bottom and uses the first one
           * whose media query AND type are supported. Order matters:
           *   1. Desktop WebP
           *   2. Desktop JPEG (covers ancient browsers)
           *   3. Mobile WebP
           *   4. Mobile JPEG fallback via <img src>
           */}
          {isLocal(wideUrl) && (
            <source media="(min-width: 768px)" type="image/webp" srcSet={wideWebp} />
          )}
          <source media="(min-width: 768px)" srcSet={wideUrl || vertUrl} />
          {isLocal(vertUrl) && <source type="image/webp" srcSet={vertWebp} />}
          <img
            src={vertUrl || fallbackUrl}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsLoaded(true)}
          />
        </picture>

        {children ? <div className="absolute inset-0 z-10">{children}</div> : null}
      </div>
    </div>
  );
}
