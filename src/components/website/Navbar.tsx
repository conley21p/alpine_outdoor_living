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

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || publicConfig.businessName;
const businessPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || publicConfig.businessPhone;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between px-6 py-3 lg:px-12">
        <Link 
          href="/" 
          className="flex items-center gap-3 group -ml-2 px-2 py-1 rounded-lg transition-opacity hover:opacity-70"
        >
          {!logoError ? (
            <Image
              src="/logo.jpg"
              alt={`${businessName} logo`}
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              onError={() => setLogoError(true)}
            />
          ) : null}
          <span className="text-[17px] font-semibold tracking-tight text-brand-textDark">
            {businessName}
          </span>
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-normal text-brand-textDark/80 transition-opacity hover:opacity-60"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${businessPhone}`}
            className="ml-2 rounded-full bg-brand-primary px-5 py-2 text-[13px] font-medium text-white transition-all hover:bg-brand-secondary"
          >
            Call Now
          </a>
        </nav>
        <button
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
          className="text-[14px] font-normal text-brand-textDark transition-opacity hover:opacity-60 md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav className="border-t border-black/5 bg-white/95 backdrop-blur-xl px-6 py-4 md:hidden">
          <div className="space-y-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-[15px] font-normal text-brand-textDark transition-opacity hover:opacity-60"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${businessPhone}`}
              className="mt-4 block rounded-full bg-brand-primary px-4 py-3 text-center text-[13px] font-medium text-white transition-all hover:bg-brand-secondary"
              onClick={() => setOpen(false)}
            >
              Call Now
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
