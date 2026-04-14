export const siteImageSlots = {
  homeHero: {
    label: "Home hero",
    desktopSrc: "",
    mobileSrc: "",
  },
  servicesHero: {
    label: "Services hero",
    desktopSrc: "",
    mobileSrc: "",
  },
  galleryHero: {
    label: "Gallery hero",
    desktopSrc: "",
    mobileSrc: "",
  },
  contactHero: {
    label: "Contact hero",
    desktopSrc: "",
    mobileSrc: "",
  },
  reviewsHero: {
    label: "Reviews hero",
    desktopSrc: "",
    mobileSrc: "",
  },
} as const;

export type SiteImageSlot = keyof typeof siteImageSlots;
