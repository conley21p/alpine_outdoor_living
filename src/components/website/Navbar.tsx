"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { publicConfig } from "@/lib/config";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          {!logoError ? (
            <Image
              src="/logo.png"
              alt={`${publicConfig.businessName} logo`}
              width={44}
              height={44}
              className="h-11 w-11 rounded-lg object-cover transition-transform group-hover:scale-105"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="max-w-[60vw] truncate rounded-lg bg-brand-primary px-3 py-2 text-sm font-bold text-white">
              {publicConfig.businessName}
            </div>
          )}
          <div className="hidden text-base font-bold tracking-tight text-brand-textDark sm:block">
            {publicConfig.businessName}
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-primary"
            >
              {link.label}
            </Link>
          ))}
          <a 
            href={`tel:${publicConfig.businessPhone}`} 
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-accent hover:shadow-md"
          >
            {publicConfig.businessPhone}
          </a>
        </nav>

        <button
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand-primary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${publicConfig.businessPhone}`}
              className="block rounded-lg bg-brand-primary px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-accent"
              onClick={() => setOpen(false)}
            >
              {publicConfig.businessPhone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
