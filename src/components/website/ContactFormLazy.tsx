"use client";

import dynamic from "next/dynamic";

const ContactForm = dynamic(
  () => import("./ContactForm").then((mod) => ({ default: mod.ContactForm })),
  {
    loading: () => (
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
    ),
  }
);

interface ContactFormLazyProps {
  initialService?: string;
}

export function ContactFormLazy(props: ContactFormLazyProps) {
  return <ContactForm {...props} />;
}
