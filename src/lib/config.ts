const getEnv = (name: string, fallback = ""): string => {
  const value = process.env[name];
  return typeof value === "string" ? value : fallback;
};

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const parseList = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseBoolean = (value: string, fallback = false): boolean => {
  if (!value) return fallback;
  return value.toLowerCase() === "true";
};

export type EmailProvider = "gmail" | "smtp" | "resend";

// Define exactly 3 services for Alpine Outdoor Living
const DEFAULT_SERVICES = "Patio/Hardscape, Fire Pits, Water Features";

export const publicConfig = {
  businessName: getEnv("NEXT_PUBLIC_BUSINESS_NAME", "Alpine Outdoor Living"),
  businessTagline: getEnv(
    "NEXT_PUBLIC_BUSINESS_TAGLINE",
    "Custom Water Features, Fire Pits, Patios & Outdoor Spaces — Designed and Built in Springfield, IL",
  ),
  businessPhone: getEnv("NEXT_PUBLIC_BUSINESS_PHONE", "(217) 899-1784"),
  businessEmail: getEnv("NEXT_PUBLIC_BUSINESS_EMAIL", "alpineoutdooragent@gmail.com"),
  businessAddress: getEnv("NEXT_PUBLIC_BUSINESS_ADDRESS", "Springfield, IL"),
  businessCity: getEnv("NEXT_PUBLIC_BUSINESS_CITY", "Springfield"),
  businessState: getEnv("NEXT_PUBLIC_BUSINESS_STATE", "IL"),
  businessZip: getEnv("NEXT_PUBLIC_BUSINESS_ZIP", "62704"),
  businessDescription: getEnv(
    "NEXT_PUBLIC_BUSINESS_DESCRIPTION",
    "Professional outdoor living spaces including water features, fire pits, and patios.",
  ),
  servicesOfferedRaw: getEnv("NEXT_PUBLIC_SERVICES_OFFERED", DEFAULT_SERVICES),
  servicesOffered: parseList(
    getEnv("NEXT_PUBLIC_SERVICES_OFFERED", DEFAULT_SERVICES),
  ),
  industry: getEnv("NEXT_PUBLIC_INDUSTRY", "landscaping"),
  brandPrimary: getEnv("NEXT_PUBLIC_BRAND_PRIMARY", "#2D5F3F"),
  brandSecondary: getEnv("NEXT_PUBLIC_BRAND_SECONDARY", "#4A7C59"),
  brandTextLight: getEnv("NEXT_PUBLIC_BRAND_TEXT_LIGHT", "#FFFFFF"),
  brandTextDark: getEnv("NEXT_PUBLIC_BRAND_TEXT_DARK", "#0F0F0F"),
  brandBgLight: getEnv("NEXT_PUBLIC_BRAND_BG_LIGHT", "#F5F5F5"),
  siteUrl: getEnv("NEXT_PUBLIC_SITE_URL", "https://alpine-outdoor-living.vercel.app"),
  defaultDomain: getEnv("NEXT_PUBLIC_DEFAULT_DOMAIN", "alpine-outdoor-living.vercel.app"),
  googleAnalyticsId: getEnv("NEXT_PUBLIC_GOOGLE_ANALYTICS_ID", ""),
  googleReviewsUrl: getEnv("NEXT_PUBLIC_GOOGLE_REVIEWS_URL", ""),
  supabaseUrl: getEnv("NEXT_PUBLIC_SUPABASE_URL", ""),
  supabaseAnonKey: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", ""),
};

export type PublicConfig = typeof publicConfig;

export const getServerConfig = () => {
  if (typeof window !== "undefined") {
    throw new Error("Server config cannot be read in the browser.");
  }

  const emailProvider = (getEnv("EMAIL_PROVIDER", "gmail") || "gmail") as EmailProvider;

  return {
    supabaseServiceRoleKey: getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    openclawAgentApiKey: getRequiredEnv("OPENCLAW_AGENT_API_KEY"),
    adminEmail: getEnv("ADMIN_EMAIL", ""),
    nextAuthSecret: getEnv("NEXTAUTH_SECRET", ""),
    nextAuthUrl: getEnv("NEXTAUTH_URL", publicConfig.siteUrl),
    paymentApprovalWebhookSecret: getEnv("PAYMENT_APPROVAL_WEBHOOK_SECRET", ""),
    paymentNotifyPhone: getEnv("PAYMENT_NOTIFY_PHONE", ""),
    emailProvider,
    gmail: {
      user: getEnv("GMAIL_USER", ""),
      appPassword: getEnv("GMAIL_APP_PASSWORD", ""),
      fromName: getEnv("GMAIL_FROM_NAME", publicConfig.businessName),
    },
    smtp: {
      host: getEnv("SMTP_HOST", ""),
      port: Number(getEnv("SMTP_PORT", "587")),
      secure: parseBoolean(getEnv("SMTP_SECURE", "false")),
      user: getEnv("SMTP_USER", ""),
      password: getEnv("SMTP_PASSWORD", ""),
      fromName: getEnv("SMTP_FROM_NAME", publicConfig.businessName),
      fromEmail: getEnv("SMTP_FROM_EMAIL", publicConfig.businessEmail),
    },
    resend: {
      apiKey: getEnv("RESEND_API_KEY", ""),
      fromEmail: getEnv("RESEND_FROM_EMAIL", publicConfig.businessEmail),
      fromName: getEnv("RESEND_FROM_NAME", publicConfig.businessName),
    },
    twilio: {
      accountSid: getEnv("TWILIO_ACCOUNT_SID", ""),
      authToken: getEnv("TWILIO_AUTH_TOKEN", ""),
      fromNumber: getEnv("TWILIO_FROM_NUMBER", ""),
    },
    google: {
      serviceAccountEmail: getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL", ""),
      serviceAccountPrivateKey: getEnv(
        "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
        "",
      ).replace(/\\n/g, "\n"),
      calendarOwnerId: getEnv("GOOGLE_CALENDAR_OWNER_ID", ""),
      calendarEmployeeIds: parseList(getEnv("GOOGLE_CALENDAR_EEMPLOYEE_IDS", "")),
    },
    meta: {
      appId: getEnv("META_APP_ID", ""),
      appSecret: getEnv("META_APP_SECRET", ""),
      pageAccessToken: getEnv("META_PAGE_ACCESS_TOKEN", ""),
      instagramBusinessAccountId: getEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID", ""),
      tiktokAccessToken: getEnv("TIKTOK_ACCESS_TOKEN", ""),
    },
    cloudinary: {
      cloudName: getEnv("CLOUDINARY_CLOUD_NAME", ""),
      apiKey: getEnv("CLOUDINARY_API_KEY", ""),
      apiSecret: getEnv("CLOUDINARY_API_SECRET", ""),
    },
  };
};

export type ServerConfig = ReturnType<typeof getServerConfig>;
