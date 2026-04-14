/**
 * publicConfig: Publicly accessible site configuration and branding.
 * These values are used on the client-side and server-side.
 */
export const publicConfig = {
  // Business identity
  businessName: "Alpine Outdoor Living",
  businessDescription: "Custom Water Features, Fire Pits, Patios & Outdoor Spaces — Designed and Built in Springfield, IL",
  businessTagline: "Custom Water Features, Fire Pits, Patios & Outdoor Spaces — Designed and Built in Springfield, IL",
  businessPhone: "(217) 503-6851",
  businessEmail: "conley@alpineoutdoorliving.net",
  industry: "Landscape Design & Construction",
  servicesOffered: ["Water Features", "Fire Pits", "Patio", "Hardscape"],
  
  // Branding
  brandPrimary: "#1B3A2D",
  brandSecondary: "#C8882A",
  brandTextLight: "#FFFFFF",
  brandTextDark: "#121212",
  brandBgLight: "#FAFAF9",

  // Site URLs
  siteUrl: "https://alpine-outdoor-living.vercel.app",
  defaultDomain: "alpine-outdoor-living.vercel.app",

  // Social media
  instagramHandle: "alpineoutdoorliving_",
  instagramFeaturedPost: "https://www.instagram.com/p/C-v-X3jS0K0/",

  // Optional integrations (empty if not used)
  googleAnalyticsId: "",
  googleReviewsUrl: "",
} as const;

export type PublicConfig = typeof publicConfig;
