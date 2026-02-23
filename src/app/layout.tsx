import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import "./globals.css";
import { publicConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: publicConfig.businessName,
    template: `%s | ${publicConfig.businessName}`,
  },
  description: publicConfig.businessDescription,
  alternates: {
    canonical: publicConfig.siteUrl,
  },
  openGraph: {
    title: publicConfig.businessName,
    description: publicConfig.businessDescription,
    url: publicConfig.siteUrl,
    siteName: publicConfig.businessName,
    images: [`${publicConfig.siteUrl}/og-image.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        style={
          {
            "--brand-primary": publicConfig.brandPrimary,
            "--brand-secondary": publicConfig.brandSecondary,
            "--brand-text-light": publicConfig.brandTextLight,
            "--brand-text-dark": publicConfig.brandTextDark,
            "--brand-bg-light": publicConfig.brandBgLight,
          } as CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
