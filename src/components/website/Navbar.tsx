"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { publicConfig } from "@/lib/config";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
];

const businessName = publicConfig.businessName;
const businessPhone = publicConfig.businessPhone;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5 transition-transform duration-500 ease-in-out ${
          isScrolled ? "md:translate-y-0 -translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto flex max-w-[90rem] items-center justify-between px-6 py-3 lg:px-12">
          <Link 
            href="/" 
            className="flex items-center gap-4 group -ml-2 px-2 py-1 rounded-lg transition-opacity hover:opacity-70"
          >
            {!logoError ? (
              <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                <Image
                  src="/Logo.png"
                  alt={`${businessName} logo`}
                  fill
                  className="object-contain"
                  onError={() => setLogoError(true)}
                  priority
                />
              </div>
            ) : null}
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
              href={`tel:${businessPhone.replace(/\D/g, '')}`}
              className="ml-2 rounded-full bg-brand-primary px-5 py-2 text-[13px] font-medium text-white transition-all hover:bg-brand-primary-dark"
            >
              Call Now
            </a>
          </nav>
          
          {/* Desktop Fallback Menu Button (always hidden, standard layout preserved) */}
          <button
            aria-label="Toggle navigation"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-brand-textDark shadow-sm transition-all active:scale-95 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Floating Mobile Trigger - Premium Glassmorphism */}
      <div 
        className={`fixed top-4 right-4 z-[60] md:hidden transition-all duration-500 ease-in-out ${
          isScrolled && !open ? "translate-y-0 opacity-100 scale-100" : "translate-y-[-20px] opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] text-brand-primary active:scale-90 transition-all hover:bg-white/50"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-brand-bgLight/40 backdrop-blur-3xl transition-opacity animate-in fade-in"
            onClick={() => setOpen(false)}
          />
          
          {/* Menu Card */}
          <nav className="absolute right-6 top-6 w-[calc(100%-48px)] max-w-sm rounded-[32px] bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-textDark/30">Navigation</span>
              <button 
                onClick={() => setOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-brand-bgLight text-brand-textDark/60 hover:text-brand-textDark transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="px-4 pb-8 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-2xl px-6 py-4 text-lg font-semibold text-brand-textDark hover:bg-brand-bgLight transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <a
                  href={`tel:${businessPhone}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-brand-primary py-5 text-base font-bold text-white shadow-xl shadow-brand-primary/20 transition-all active:scale-95"
                  onClick={() => setOpen(false)}
                >
                  Call Now
                  <span className="text-xs opacity-60">•</span>
                  {businessPhone}
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
