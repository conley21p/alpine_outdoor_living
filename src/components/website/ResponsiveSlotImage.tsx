import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { siteImageSlots, type SiteImageSlot } from "@/lib/site-images";

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
  // Use overrides if provided, otherwise fallback to slot config
  const slotConfig = slot ? siteImageSlots[slot] : null;
  
  const wideSrc = overrideWide || slotConfig?.desktopSrc || "";
  const vertSrc = overrideVert || slotConfig?.mobileSrc || wideSrc;

  if (!wideSrc) return null;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className={cn("relative md:hidden", mobileAspectClassName)}>
        <Image
          src={vertSrc}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
          unoptimized={wideSrc.includes('cloudinary')}
        />
      </div>
      <div className={cn("relative hidden md:block", desktopAspectClassName)}>
        <Image
          src={wideSrc}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 100vw, 0px"
          className="object-cover"
          unoptimized={wideSrc.includes('cloudinary')}
        />
      </div>
      {children ? <div className="absolute inset-0 z-10">{children}</div> : null}
    </div>
  );
}
