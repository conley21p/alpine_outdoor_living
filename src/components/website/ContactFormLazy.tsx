"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

/**
 * Lazy-loaded contact form.
 *
 * The contact form lives below the fold, so we don't want its JS in the
 * critical bundle. `next/dynamic` with the default `ssr: true` keeps the
 * prerendered HTML (good for SEO and first paint) but ships the form's
 * client JS in its own chunk that's loaded after the initial bundle.
 */
function FormSkeleton() {
  return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="h-12 rounded-xl bg-black/5" />
          <div className="h-12 rounded-xl bg-black/5" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="h-12 rounded-xl bg-black/5" />
          <div className="h-12 rounded-xl bg-black/5" />
        </div>
        <div className="h-12 rounded-xl bg-black/5" />
        <div className="h-32 rounded-xl bg-black/5" />
        <div className="h-12 w-44 rounded-full bg-black/5" />
      </div>
  );
}

const ContactForm = dynamic(
  () => import("./ContactForm").then((mod) => ({ default: mod.ContactForm })),
  { loading: () => <FormSkeleton /> }
);

interface ContactFormLazyProps {
  initialService?: string;
}

export function ContactFormLazy(props: ContactFormLazyProps) {
  // ContactForm calls useSearchParams(), which must sit inside a Suspense
  // boundary for a statically rendered route.
  return (
    <Suspense fallback={<FormSkeleton />}>
      <ContactForm {...props} />
    </Suspense>
  );
}
