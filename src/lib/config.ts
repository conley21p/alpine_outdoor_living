/**
 * publicConfig: Publicly accessible site configuration and branding.
 * These values are used on the client-side and server-side.
 */
export const publicConfig = {
  // Business identity
  businessName: "Alpine Outdoor Living LLC",
  businessDescription: "Custom Water Features, Fire Pits, Patios & Outdoor Spaces — Designed and Built in Springfield, IL",
  businessTagline: "Custom Water Features, Fire Pits, Patios & Outdoor Spaces — Designed and Built in Springfield, IL",
  businessPhone: "217-899-1784",
  businessEmail: "Info@alpineoutdoorlivingllc.com",
  industry: "Landscape Design & Construction",
  servicesOffered: [
    "Full Landscape Design & Planning",
    "Hardscape Installation (Patios, Walkways, & Retaining Walls)",
    "Water Features (Aquascape Fountains & Ponds)",
    "Fire Pits & Outdoor Fireplaces",
    "Outdoor Living Spaces (Kitchen & Living Areas, Pergolas)",
    "Softscaping (Planting, Gardens, & Mulch)",
    "Landscape Lighting",
    "Other/Custom Project"
  ],

  // Branding
  brandPrimary: "#8B9D33",
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

// Server config - hardcoded values for production
export const getServerConfig = () => {
  if (typeof window !== "undefined") {
    throw new Error("Server config cannot be read in the browser.");
  }

  return {
    // These come from environment (required for security)
    openclawAgentApiKey: process.env.OPENCLAW_AGENT_API_KEY || "",

    // Cloudinary credentials
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",

    // Optional settings
    adminEmail: "Info@alpineoutdoorlivingllc.com",
    nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
    nextAuthUrl: publicConfig.siteUrl,
  };
};

export type ServerConfig = ReturnType<typeof getServerConfig>;
