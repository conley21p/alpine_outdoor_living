/**
 * publicConfig: Publicly accessible site configuration and branding.
 * These values are used on the client-side and server-side.
 */
export const publicConfig = {
  // Business identity
  businessName: "KML Seamless Gutters LLC",
  businessDescription: "Locally owned and operated exterior contractor offering seamless gutters, soffit, fascia, and siding installation and repair services in Springfield, IL and surrounding areas.",
  businessTagline: "Expert Gutter, Soffit, Fascia & Siding Solutions — Precision Built in Central Illinois",
  businessPhone: "(217) 843-7265",
  businessEmail: "kmlseamlessguttersil@gmail.com",
  industry: "Exterior Construction & Gutter Services",
  servicesOffered: [
    "5-Inch Seamless Gutters",
    "6-Inch Seamless Gutters",
    "Soffit & Fascia Installation",
    "Siding Installation & Repair",
    "Downspouts & Gutter Guards",
    "Gutter Cleaning & Maintenance",
    "Aluminum Trim & Repairs",
    "Other/Custom Project"
  ],

  // Branding
  brandPrimary: "#1C419E", // Primary Blue
  brandSecondary: "#56D14B", // Vibrant Green
  brandTextLight: "#FFFFFF",
  brandTextDark: "#121212",
  brandBgLight: "#FAFAF9",

  // Integrations
  useCloudinary: false,

  // Site URLs
  siteUrl: "https://kml-seamless-gutters.vercel.app",
  defaultDomain: "kml-seamless-gutters.vercel.app",

  // Social media
  facebookUrl: "https://www.facebook.com/p/KML-seamless-gutters-LLC-61573112742583/",
  facebookHandle: "KML Seamless Gutters LLC",

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
