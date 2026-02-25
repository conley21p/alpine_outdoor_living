// Hardcoded config for Alpine Outdoor Living
// All values are set directly - no environment variables needed

export const publicConfig = {
  businessName: "Alpine Outdoor Living",
  businessTagline: "Custom Water Features, Fire Pits, Patios & Outdoor Spaces — Designed and Built in Springfield, IL",
  businessPhone: "(217) 899-1784",
  businessEmail: "alpineoutdooragent@gmail.com",
  businessAddress: "Springfield, IL",
  businessCity: "Springfield",
  businessState: "IL",
  businessZip: "62704",
  businessDescription: "Professional outdoor living spaces including water features, fire pits, and patios.",

  // Services offered
  servicesOfferedRaw: "Water Features, Fire Pits, Patio, Hardscape",
  servicesOffered: ["Water Features", "Fire Pits", "Patio", "Hardscape"],

  industry: "landscaping",

  // Brand colors
  brandPrimary: "#8C9743",
  brandSecondary: "#A3AC5C",
  brandTextLight: "#FFFFFF",
  brandTextDark: "#0F0F0F",
  brandBgLight: "#F5F5F5",

  // Site URLs
  siteUrl: "https://alpine-outdoor-living.vercel.app",
  defaultDomain: "alpine-outdoor-living.vercel.app",

  // Social media
  instagramHandle: "alpineoutdoorliving_",
  instagramFeaturedPost: "https://www.instagram.com/p/EXAMPLE/", // Update with actual post URL

  // Optional integrations (empty if not used)
  googleAnalyticsId: "",
  googleReviewsUrl: "",
  supabaseUrl: "",
  supabaseAnonKey: "",
} as const;

export type PublicConfig = typeof publicConfig;

export type EmailProvider = "gmail" | "smtp" | "resend";

// Server config - hardcoded values for production
export const getServerConfig = () => {
  if (typeof window !== "undefined") {
    throw new Error("Server config cannot be read in the browser.");
  }

  return {
    // These come from environment (required for security)
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    openclawAgentApiKey: process.env.OPENCLAW_AGENT_API_KEY || "",

    // Optional settings
    adminEmail: "alpineoutdooragent@gmail.com",
    nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
    nextAuthUrl: publicConfig.siteUrl,
    paymentApprovalWebhookSecret: process.env.PAYMENT_APPROVAL_WEBHOOK_SECRET || "",
    paymentNotifyPhone: process.env.PAYMENT_NOTIFY_PHONE || "",

    emailProvider: "gmail" as EmailProvider,
    gmail: {
      user: process.env.GMAIL_USER || "",
      appPassword: process.env.GMAIL_APP_PASSWORD || "",
      fromName: publicConfig.businessName,
    },
    smtp: {
      host: "",
      port: 587,
      secure: false,
      user: "",
      password: "",
      fromName: publicConfig.businessName,
      fromEmail: publicConfig.businessEmail,
    },
    resend: {
      apiKey: "",
      fromEmail: publicConfig.businessEmail,
      fromName: publicConfig.businessName,
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || "",
      authToken: process.env.TWILIO_AUTH_TOKEN || "",
      fromNumber: process.env.TWILIO_FROM_NUMBER || "",
    },
    google: {
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
      serviceAccountPrivateKey: (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      calendarOwnerId: process.env.GOOGLE_CALENDAR_OWNER_ID || "",
      calendarEmployeeIds: [],
    },
    meta: {
      appId: "",
      appSecret: "",
      pageAccessToken: "",
      instagramBusinessAccountId: "",
      tiktokAccessToken: "",
    },
    cloudinary: {
      cloudName: "",
      apiKey: "",
      apiSecret: "",
    },
  };
};

export type ServerConfig = ReturnType<typeof getServerConfig>;
