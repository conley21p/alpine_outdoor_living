"use client";

import dynamic from "next/dynamic";
import type { ServicesGridProps } from "@/components/website/ServicesGrid";

/**
 * Lazy-loaded service deck.
 *
 * `ServicesGrid` pulls in framer-motion (the largest single dependency on
 * the page). Wrapping it in `next/dynamic` puts that code in its own JS
 * chunk that's loaded after the initial bundle. The default `ssr: true`
 * keeps the deck pre-rendered into the static HTML, so users still see the
 * cards instantly — only the interactive (drag/animation) layer is
 * deferred. While the chunk is loading the static HTML stays visible.
 */
const ServicesGrid = dynamic(
  () => import("./ServicesGrid").then((mod) => ({ default: mod.ServicesGrid })),
  {
    loading: () => (
      <div className="relative w-full pt-10 pb-32">
        <div className="py-12 lg:py-20" aria-hidden />
        <div className="relative w-full h-[650px] lg:h-[750px]" aria-hidden />
      </div>
    ),
  }
);

export function ServicesGridLazy(props: ServicesGridProps) {
  return <ServicesGrid {...props} />;
}
