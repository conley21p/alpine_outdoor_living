import Link from "next/link";
import { publicConfig } from "@/lib/config";

export function CallToAction() {
  return (
    <section className="mx-auto max-w-[90rem] px-6 py-20 lg:px-12 lg:py-32">
      <div className="overflow-hidden rounded-2xl bg-black px-8 py-16 text-center lg:px-16 lg:py-24">
        <h2 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl lg:text-6xl">
          Ready to get started?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-normal text-white/70 sm:text-xl lg:text-2xl">
          Experience professional service. Get in touch today.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <Link
            href="/contact"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-white px-8 py-4 text-[17px] font-medium text-brand-primary transition-all hover:bg-gray-100"
          >
            Get Started
          </Link>
          <a
            href={`tel:${publicConfig.businessPhone}`}
            className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-white/30 px-8 py-4 text-[17px] font-medium text-white transition-all hover:bg-white/10"
          >
            {publicConfig.businessPhone}
          </a>
        </div>
      </div>
    </section>
  );
}
