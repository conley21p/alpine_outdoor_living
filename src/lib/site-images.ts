export const siteImageSlots = {
  homeHero: {
    label: "Home hero",
    desktopSrc: "/site-images/home-hero/desktop/default.jpg",
    mobileSrc: "/site-images/home-hero/mobile/default.jpg",
  },
  servicesHero: {
    label: "Services hero",
    desktopSrc: "/site-images/services-hero/desktop/default.jpg",
    mobileSrc: "/site-images/services-hero/mobile/default.jpg",
  },
  galleryHero: {
    label: "Gallery hero",
    desktopSrc: "/site-images/gallery-hero/desktop/default.jpg",
    mobileSrc: "/site-images/gallery-hero/mobile/default.jpg",
  },
  contactHero: {
    label: "Contact hero",
    desktopSrc: "/site-images/contact-hero/desktop/default.jpg",
    mobileSrc: "/site-images/contact-hero/mobile/default.jpg",
  },
  reviewsHero: {
    label: "Reviews hero",
    desktopSrc: "/site-images/reviews-hero/desktop/default.jpg",
    mobileSrc: "/site-images/reviews-hero/mobile/default.jpg",
  },
} as const;

export type SiteImageSlot = keyof typeof siteImageSlots;
