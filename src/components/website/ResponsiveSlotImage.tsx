"use client";

import Image from "next/image";
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

  // Use overrides if provided, otherwise fallback to slot config
  const slotConfig = slot ? siteImageSlots[slot] : null;
  
  const wideSrc = overrideWide || slotConfig?.desktopSrc || "";
  const vertSrc = overrideVert || slotConfig?.mobileSrc || wideSrc;

  return (
    <div className={cn("relative overflow-hidden bg-brand-bgLight", className)}>
      {/* Loading Glass Overlay */}
      <div 
        className={cn(
          "absolute inset-0 z-20 bg-white/10 backdrop-blur-2xl transition-opacity duration-1000",
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      />

      {vertSrc && (
        <div className={cn("relative md:hidden", mobileAspectClassName)}>
          <Image
            src={getOptimizedUrl(vertSrc, 'full')}
            alt={alt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover"
            unoptimized={vertSrc.includes('cloudinary')}
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsLoaded(true)}
          />
        </div>
      )}
      {wideSrc && (
        <div className={cn("relative hidden md:block", desktopAspectClassName)}>
          <Image
            src={getOptimizedUrl(wideSrc, 'full')}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 768px) 100vw, 0px"
            className="object-cover"
            unoptimized={wideSrc.includes('cloudinary')}
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsLoaded(true)}
          />
        </div>
      )}
      {!wideSrc && <div className={cn("relative", desktopAspectClassName)} />}
      {children ? <div className="absolute inset-0 z-10">{children}</div> : null}
    </div>
  );
}
