import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { publicConfig } from "@/lib/config";

const siteUrl = new URL(publicConfig.siteUrl);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: publicConfig.businessName,
    template: `%s | ${publicConfig.businessName}`,
  },
  description: publicConfig.businessDescription,
  alternates: {
    // URL() stringifies with a trailing slash, which is the most share-friendly canonical form.
    canonical: siteUrl.toString(),
  },
  openGraph: {
    title: publicConfig.businessName,
    description: publicConfig.businessDescription,
    url: siteUrl.toString(),
    siteName: publicConfig.businessName,
    images: [new URL("/Logo.png", siteUrl).toString()],
  },
  icons: {
    icon: "/Logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: publicConfig.brandPrimary,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --brand-primary: ${publicConfig.brandPrimary};
            --brand-secondary: ${publicConfig.brandSecondary};
            --brand-text-light: ${publicConfig.brandTextLight};
            --brand-text-dark: ${publicConfig.brandTextDark};
            --brand-bg-light: ${publicConfig.brandBgLight};
          }
        `}} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
