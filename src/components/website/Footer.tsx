import Link from "next/link";
import { publicConfig } from "@/lib/config";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-black/10 bg-brand-bgLight">
      <div className="mx-auto max-w-[90rem] px-6 py-12 lg:px-12 lg:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <h3 className="text-[17px] font-semibold text-brand-textDark">
              {publicConfig.businessName}
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-brand-textDark/60">
              {publicConfig.businessAddress}
              <br />
              {publicConfig.businessCity}, {publicConfig.businessState} {publicConfig.businessZip}
            </p>
          </div>
          <div>
            <h4 className="text-[13px] font-medium text-brand-textDark/60">
              Contact
            </h4>
            <div className="mt-3 space-y-2">
              <a
                href={`tel:${publicConfig.businessPhone}`}
                className="block text-[14px] text-brand-textDark transition-opacity hover:opacity-60"
              >
                {publicConfig.businessPhone}
              </a>
              <a
                href={`mailto:${publicConfig.businessEmail}`}
                className="block text-[14px] text-brand-textDark transition-opacity hover:opacity-60"
              >
                {publicConfig.businessEmail}
              </a>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-[13px] font-medium text-brand-textDark/60">
              Navigate
            </h4>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="block text-[14px] text-brand-textDark transition-opacity hover:opacity-60"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-black/10">
          <p className="text-[12px] text-brand-textDark/50">
            © {new Date().getFullYear()} {publicConfig.businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
