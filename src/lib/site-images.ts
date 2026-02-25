export const siteImageSlots = {
  homeHero: {
    label: "Home hero",
    desktopSrc: "/images/hero/patio-pond-night-wide.jpg",
    mobileSrc: "/images/hero/patio-pond-night-vertical.jpg",
  },
  servicesHero: {
    label: "Services hero",
    desktopSrc: "/images/hero/patio-pond-night-wide.jpg",
    mobileSrc: "/images/hero/patio-pond-night-vertical.jpg",
  },
  galleryHero: {
    label: "Gallery hero",
    desktopSrc: "/images/hero/backyard-oasis-banner.jpg",
    mobileSrc: "/images/hero/patio-pond-night-vertical.jpg",
  },
  contactHero: {
    label: "Contact hero",
    desktopSrc: "/images/hero/patio-pond-night-wide.jpg",
    mobileSrc: "/images/hero/patio-pond-night-vertical.jpg",
  },
  reviewsHero: {
    label: "Reviews hero",
    desktopSrc: "/images/hero/patio-pond-night-wide.jpg",
    mobileSrc: "/images/hero/patio-pond-night-vertical.jpg",
  },
} as const;

export type SiteImageSlot = keyof typeof siteImageSlots;
