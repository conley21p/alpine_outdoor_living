"use client";

import Link from "next/link";
import Image from "next/image";
import { publicConfig } from "@/lib/config";

interface ServicesGridProps {
  previewOnly?: boolean;
}

// Service image mapping - exactly 3 services with unique photos
const serviceImages: Record<string, string> = {
  "Water Features": "/images/gallery/Vertical-WaterFeature.png",
  "Fire Pits": "/images/gallery/Firepit.png",
  "Patio/Hardscape": "/images/gallery/Wide-BackyardLandscaping.png",
};

// Service descriptions
const serviceDescriptions: Record<string, string> = {
  "Water Features": "Custom ponds, waterfalls, and fountains designed to bring tranquility and beauty to your outdoor space.",
  "Fire Pits": "Beautiful stone and paver fire pits perfect for gathering and extending your outdoor season.",
  "Patio/Hardscape": "Durable patios, pathways, and hardscapes built with quality pavers and expert craftsmanship.",
};

// Service titles for display
const serviceTitles: Record<string, string> = {
  "Water Features": "Water Features",
  "Fire Pits": "Fire Pits",
  "Patio/Hardscape": "Patio / Hardscape",
};

export function ServicesGrid({ previewOnly = false }: ServicesGridProps) {
  const services = previewOnly
    ? publicConfig.servicesOffered.slice(0, 3)
    : publicConfig.servicesOffered;

  return (
    <section className="mx-auto max-w-[90rem] px-6 py-20 lg:px-12 lg:py-32">
      <div className="mb-16 text-center lg:mb-20">
        <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-6xl">
          Our Services
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-normal text-brand-textDark/70 sm:text-xl lg:text-2xl">
          Professional outdoor solutions tailored to your needs
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {services.map((service) => (
          <article
            key={service}
            className="group relative overflow-hidden rounded-2xl bg-brand-bgLight transition-all hover:bg-gray-100"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={serviceImages[service] || "/images/gallery/Firepit.png"}
                alt={`${service} by Alpine Outdoor Living`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            </div>
            <div className="p-8 lg:p-10">
              <h3 className="text-2xl font-semibold tracking-tight text-brand-textDark lg:text-3xl">
                {serviceTitles[service] || service}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-brand-textDark/70 lg:text-lg">
                {serviceDescriptions[service] ||
                  `Professional ${service.toLowerCase()} delivered with high-quality results.`}
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-[17px] font-normal text-brand-accent transition-opacity hover:opacity-70"
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
      {previewOnly && (
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[17px] font-normal text-brand-accent transition-opacity hover:opacity-70"
          >
            View all services
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
