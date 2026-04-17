"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm font-medium text-brand-textDark/60 mb-8" aria-label="Breadcrumb">
      <Link 
        href="/" 
        className="flex items-center gap-1.5 hover:text-brand-primary transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-brand-textDark/20" />
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-brand-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-brand-textDark font-bold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
