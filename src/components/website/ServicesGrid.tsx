"use client";

import Link from "next/link";
import Image from "next/image";
import type { ServiceData } from "@/lib/public-data";

interface ServicesGridProps {
  services?: ServiceData[];
}

export function ServicesGrid({ services = [] }: ServicesGridProps) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="relative mx-auto max-w-full px-6 py-20 lg:px-12 lg:py-32 bg-gradient-to-b from-white to-green-50/30">
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-16 text-center lg:mb-20">
          <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-6xl">
            Our Services
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-normal text-brand-textDark/70 sm:text-xl lg:text-2xl">
            Professional outdoor solutions tailored to your needs
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {services.map((service) => (
            <article
              key={service.title}
              className="group glass-card-green relative overflow-hidden rounded-3xl hover:shadow-2xl hover:-translate-y-1"
            >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={service.imageUrl || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}
                alt={`${service.title} by Alpine Outdoor Living`}
                fill
                className="object-cover transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 25vw"
                unoptimized
              />
            </div>
            <div className="p-8 lg:p-10">
              <h3 className="text-2xl font-semibold tracking-tight text-brand-textDark lg:text-3xl">
                {service.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-brand-textDark/70 lg:text-lg">
                {service.description}
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-[17px] font-medium text-brand-primary transition-opacity hover:opacity-70"
              >
                Get a quote
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
     </div>
    </section>
  );
}
