import siteConfig from "@/config/site-config.json";

/**
 * publicConfig: Publicly accessible site configuration and branding.
 * These values are used on the client-side and server-side.
 */
export const publicConfig = {
  // Business identity
  businessName: siteConfig.business.name,
  businessShortName: siteConfig.business.shortName,
  businessDescription: siteConfig.business.description,
  businessTagline: siteConfig.business.tagline,
  businessPhone: siteConfig.business.phone,
  businessEmail: siteConfig.business.email,
  businessLocation: siteConfig.business.location,
  businessMission: siteConfig.business.mission,
  founder: siteConfig.business.founder,
  
  // Services
  servicesOffered: siteConfig.services.map(s => s.title).concat("Other/Custom Project"),
  services: siteConfig.services,

  // UI / Features
  serviceSectionType: siteConfig.ui.serviceSectionType as "Stacked" | "HandOfCards",
  hasServiceDetailPage: siteConfig.ui.hasServiceDetailPage,

  // Branding
  brandPrimary: siteConfig.branding.colors.primary,
  brandPrimaryDark: siteConfig.branding.colors.primaryDark,
  brandSecondary: siteConfig.branding.colors.secondary,
  brandTextLight: siteConfig.branding.colors.textLight,
  brandTextDark: siteConfig.branding.colors.textDark,
  brandBgLight: siteConfig.branding.colors.bgLight,
  logo: siteConfig.branding.logo,

  // Site URLs
  siteUrl: "https://alpineoutdoorlivingllc.com",
  defaultDomain: "alpineoutdoorlivingllc.com",

  // Social media
  instagramHandle: siteConfig.integrations.instagramHandle,
  instagramFeaturedPost: siteConfig.integrations.instagramFeaturedPost,

  // Integrations
  web3FormsKey: siteConfig.integrations.web3FormsKey,
  googleAnalyticsId: siteConfig.integrations.googleAnalyticsId,
  googleReviewsUrl: siteConfig.integrations.googleReviewsUrl,
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
    adminEmail: siteConfig.business.email,
    nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
    nextAuthUrl: publicConfig.siteUrl,
  };
};

export type ServerConfig = ReturnType<typeof getServerConfig>;
