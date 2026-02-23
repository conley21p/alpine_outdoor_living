import Link from "next/link";
import { publicConfig } from "@/lib/config";

export function CallToAction() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary via-brand-accent to-black px-6 py-12 shadow-2xl sm:px-12 sm:py-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-black text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-3 text-base text-gray-100 sm:text-lg">
              Call us at <span className="font-semibold">{publicConfig.businessPhone}</span> or request service online.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-white px-8 py-4 text-base font-bold text-brand-primary shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            Book Now
          </Link>
        </div>
      </div>
    </section>
  );
}
