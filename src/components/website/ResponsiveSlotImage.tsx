import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { siteImageSlots, type SiteImageSlot } from "@/lib/site-images";

interface ResponsiveSlotImageProps {
  slot: SiteImageSlot;
  alt: string;
  priority?: boolean;
  className?: string;
  mobileAspectClassName?: string;
  desktopAspectClassName?: string;
  children?: ReactNode;
}

export function ResponsiveSlotImage({
  slot,
  alt,
  priority = false,
  className,
  mobileAspectClassName = "aspect-[3/4]",
  desktopAspectClassName = "aspect-[21/9]",
  children,
}: ResponsiveSlotImageProps) {
  const slotConfig = siteImageSlots[slot];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className={cn("relative md:hidden", mobileAspectClassName)}>
        <Image
          src={slotConfig.mobileSrc}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className={cn("relative hidden md:block", desktopAspectClassName)}>
        <Image
          src={slotConfig.desktopSrc}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 100vw, 0px"
          className="object-cover"
        />
      </div>
      {children ? <div className="absolute inset-0">{children}</div> : null}
    </div>
  );
}
