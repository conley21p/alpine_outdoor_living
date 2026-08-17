/**
 * publicConfig: Publicly accessible site configuration and branding.
 * These values are used on the client-side and server-side.
 *
 * The phone, email, and Web3Forms key below are live production values — they
 * render as real tel:/mailto: links and route lead-form submissions.
 */
export const publicConfig = {
  // Business identity
  businessName: "Springfield Bathroom Remodel",
  businessDescription: "Senior-safe bathroom remodels in Springfield, IL — grab bars, walk-in showers, curbless entries, and full universal design retrofits, with a free in-home safety assessment.",
  businessTagline: "Senior-Safe Bathroom Remodels — Built for Staying Home Safely",
  businessPhone: "(217) 899-5627",
  businessEmail: "Kirk@springfieldbathremodel.com",
  industry: "Bathroom Remodeling & Accessibility Retrofits",
  serviceArea: "Springfield, IL and surrounding communities", // TODO(owner): list specific towns only if you actually cover them
  /** Package names shown in the hero band. */
  heroHighlights: [
    "Safety Essentials",
    "Fast-Track Shower Conversion",
    "Custom Accessible Remodel",
    "Full Universal Design Retrofit",
  ] as const,
  /** Options in the contact form's "service needed" dropdown. */
  servicesOffered: [
    "Free In-Home Safety Assessment",
    "Safety Essentials",
    "Fast-Track Shower Conversion",
    "Custom Accessible Remodel",
    "Full Universal Design Retrofit",
    "Something Else",
  ] as const,

  // Branding
  brandPrimary: "#1C419E", // Primary Blue
  brandSecondary: "#56D14B", // Vibrant Green
  brandTextLight: "#FFFFFF",
  brandTextDark: "#121212",
  brandBgLight: "#FAFAF9",

  // Integrations
  useCloudinary: false,
  /**
   * Web3Forms access key for the contact form. Submissions are delivered to
   * `businessEmail`. If this is ever cleared, the form surfaces a "call us
   * instead" message rather than silently dropping leads.
   */
  web3formsAccessKey: "49e9d2a3-f8c8-4b4b-9069-1621cf77793c",

  // Site URLs
  siteUrl: "https://www.springfieldbathremodel.com", // TODO(owner): confirm this is the live domain
  defaultDomain: "www.springfieldbathremodel.com",

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
    adminEmail: publicConfig.businessEmail,
    nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
    nextAuthUrl: publicConfig.siteUrl,
  };
};

export type ServerConfig = ReturnType<typeof getServerConfig>;
