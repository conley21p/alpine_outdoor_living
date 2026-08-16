/**
 * publicConfig: Publicly accessible site configuration and branding.
 * These values are used on the client-side and server-side.
 *
 * TODO(owner): the contact block below uses placeholders. Replace the phone,
 * email, and site URL with the real business details before going live — they
 * render as live tel:/mailto: links and as the lead-form destination.
 */
export const publicConfig = {
  // Business identity
  businessName: "Springfield Home Remodels",
  businessDescription: "Senior-safe bathroom remodels in Springfield, IL — grab bars, walk-in showers, curbless entries, and full universal design retrofits, with a free in-home safety assessment.",
  businessTagline: "Senior-Safe Bathroom Remodels — Built for Staying Home Safely",
  businessPhone: "(217) 555-0142", // TODO(owner): replace with the real business number
  businessEmail: "info@springfieldhomeremodels.com", // TODO(owner): replace with the real inbox
  industry: "Bathroom Remodeling & Accessibility Retrofits",
  serviceArea: "Springfield, Chatham, Rochester, Sherman & Central Illinois",
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
   * Web3Forms access key for the contact form. Empty until the business
   * creates its own key at https://web3forms.com — the form surfaces a
   * "call us instead" message rather than silently dropping leads.
   * TODO(owner): paste the access key issued for the business inbox above.
   */
  web3formsAccessKey: "",

  // Site URLs
  siteUrl: "https://www.springfieldhomeremodels.com", // TODO(owner): replace with the real domain
  defaultDomain: "www.springfieldhomeremodels.com",

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
