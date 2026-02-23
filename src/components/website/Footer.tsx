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
    <footer className="mt-20 border-t border-gray-100 bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8 lg:py-16">
        <div>
          <h3 className="mb-4 text-xl font-bold">
            {publicConfig.businessName}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">{publicConfig.businessAddress}</p>
          <p className="text-sm text-gray-300 leading-relaxed">
            {publicConfig.businessCity}, {publicConfig.businessState}{" "}
            {publicConfig.businessZip}
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-secondary">
            Contact
          </h4>
          <div className="space-y-2">
            <a
              href={`tel:${publicConfig.businessPhone}`}
              className="block text-sm text-gray-300 transition-colors hover:text-brand-secondary"
            >
              {publicConfig.businessPhone}
            </a>
            <a
              href={`mailto:${publicConfig.businessEmail}`}
              className="block text-sm text-gray-300 transition-colors hover:text-brand-secondary"
            >
              {publicConfig.businessEmail}
            </a>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-secondary">
            Navigate
          </h4>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-gray-300 transition-colors hover:text-brand-secondary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 px-4 py-6 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} {publicConfig.businessName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
