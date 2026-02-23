import type { ReactNode } from "react";
import { Navbar } from "@/components/website/Navbar";
import { Footer } from "@/components/website/Footer";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-white text-brand-textDark">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
