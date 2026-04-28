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
  desktopAspectClassName = "md:aspect-[21/9]",
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

  const swapExt = (url: string, ext: string) => {
    if (!url || /^(https?:|data:)/i.test(url)) return url;
    const dot = url.lastIndexOf(".");
    return dot > 0 ? `${url.slice(0, dot)}.${ext}` : url;
  };
  const wideAvif = swapExt(wideUrl, "avif");
  const wideWebp = swapExt(wideUrl, "webp");
  const vertAvif = swapExt(vertUrl, "avif");
  const vertWebp = swapExt(vertUrl, "webp");
  const isLocal = (u: string) => u && !/^(https?:|data:)/i.test(u);

  return (
    <div className={cn("relative overflow-hidden bg-brand-bgLight", className)}>
      <div
        className={cn(
          "relative w-full",
          mobileAspectClassName,
          // NOTE: keep responsive classnames static so Tailwind generates them.
          // Pass `md:`/`lg:` variants explicitly via props.
          desktopAspectClassName
        )}
      >
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 z-20 bg-brand-bgLight/60 transition-opacity duration-700",
            isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        />

        <picture>
          {isLocal(wideUrl) && (
            <source media="(min-width: 768px)" type="image/avif" srcSet={wideAvif} />
          )}
          {isLocal(wideUrl) && (
            <source media="(min-width: 768px)" type="image/webp" srcSet={wideWebp} />
          )}
          <source media="(min-width: 768px)" srcSet={wideUrl || vertUrl} />
          {isLocal(vertUrl) && <source type="image/avif" srcSet={vertAvif} />}
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
