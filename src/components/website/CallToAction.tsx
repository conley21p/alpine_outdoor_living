import Link from "next/link";
import { publicConfig } from "@/lib/config";

export function CallToAction() {
  return (
    <section className="bg-brand-secondary text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h2 className="text-2xl font-bold">Ready to get started?</h2>
          <p className="mt-1 text-sm text-white/90">
            Call us at {publicConfig.businessPhone} or request service online.
          </p>
        </div>
        <Link
          href="/contact"
          className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand-primary hover:bg-slate-100"
        >
          Book Now
        </Link>
      </div>
    </section>
  );
}
