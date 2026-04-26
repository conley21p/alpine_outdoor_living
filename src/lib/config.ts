/**
 * publicConfig: Publicly accessible site configuration and branding.
 * These values are used on the client-side and server-side.
 */
export const publicConfig = {
  // Business identity
  businessName: "Lincoln Land Exteriors",
  businessDescription:
    "Lincoln Land Exteriors is a family-owned contractor based in Springfield, Illinois. We handle interior and exterior projects with quality workmanship, clean job sites, and straightforward pricing.",
  businessTagline: "Need work done right the first time? We handle it all — start to finish.",
  businessPhone: "(217) 691-1043",
  businessEmail: "lincolnlandexteriors@gmail.com",
  industry: "General Contracting — Interior & Exterior",
  servicesOffered: [
    "Roofing",
    "Siding",
    "Gutters",
    "Windows & Doors",
    "Soffit & Fascia",
    "Flooring",
    "Drywall",
    "Kitchen Remodeling",
    "Bathroom Remodeling",
    "Lighting Installation"
  ] as const,
  serviceHighlights: ["Roofing", "Siding", "Gutters", "Remodeling"] as const,

  // Branding
  brandPrimary: "#C1121F", // Red
  brandSecondary: "#F4D35E", // Yellow
  brandTextLight: "#FFFFFF",
  brandTextDark: "#121212",
  brandBgLight: "#FAFAF9",

  // Integrations
  useCloudinary: false,

  // Site URLs
  siteUrl: "http://lincolnlandexteriors.com",
  defaultDomain: "lincolnlandexteriors.com",

  // Social media
  facebookUrl: "https://www.facebook.com/people/Lincoln-Land-Exteriors/",
  facebookHandle: "Lincoln Land Exteriors",

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
    adminEmail: "lincolnlandexteriors@gmail.com",
    nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
    nextAuthUrl: publicConfig.siteUrl,
  };
};

export type ServerConfig = ReturnType<typeof getServerConfig>;
