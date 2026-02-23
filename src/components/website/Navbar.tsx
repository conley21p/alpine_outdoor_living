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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-primary text-brand-textLight">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          {!logoError ? (
            <Image
              src="/logo.png"
              alt={`${publicConfig.businessName} logo`}
              width={40}
              height={40}
              className="h-10 w-10 rounded bg-white object-cover"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="max-w-[60vw] truncate rounded bg-white/15 px-2 py-1 text-sm font-bold">
              {publicConfig.businessName}
            </div>
          )}
          <div className="hidden text-sm font-semibold sm:block">
            {publicConfig.businessName}
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-brand-bgLight"
            >
              {link.label}
            </Link>
          ))}
          <a href={`tel:${publicConfig.businessPhone}`} className="text-sm font-semibold">
            {publicConfig.businessPhone}
          </a>
        </nav>

        <button
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-md border border-white/30 px-3 py-2 text-sm md:hidden"
        >
          Menu
        </button>
      </div>

      {open && (
        <nav className="space-y-1 border-t border-white/20 px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded px-2 py-2 text-sm hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${publicConfig.businessPhone}`}
            className="block rounded px-2 py-2 text-sm font-semibold hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            {publicConfig.businessPhone}
          </a>
        </nav>
      )}
    </header>
  );
}
