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
    <footer className="mt-16 border-t border-slate-200 bg-brand-bgLight">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div>
          <h3 className="mb-3 text-lg font-semibold text-brand-textDark">
            {publicConfig.businessName}
          </h3>
          <p className="text-sm text-slate-700">{publicConfig.businessAddress}</p>
          <p className="text-sm text-slate-700">
            {publicConfig.businessCity}, {publicConfig.businessState}{" "}
            {publicConfig.businessZip}
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Contact
          </h4>
          <a
            href={`tel:${publicConfig.businessPhone}`}
            className="block text-sm text-brand-primary hover:underline"
          >
            {publicConfig.businessPhone}
          </a>
          <a
            href={`mailto:${publicConfig.businessEmail}`}
            className="block text-sm text-brand-primary hover:underline"
          >
            {publicConfig.businessEmail}
          </a>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Navigate
          </h4>
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-brand-primary hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} {publicConfig.businessName}. All rights reserved.
      </div>
    </footer>
  );
}
