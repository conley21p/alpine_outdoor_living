"use client";

import { publicConfig } from "@/lib/config";
import type { ServiceData } from "@/lib/public-data";
import { StackedServices } from "./layouts/StackedServices";
import { HandOfCardsServices } from "./layouts/HandOfCardsServices";

interface ServicesGridProps {
  services?: ServiceData[];
}

export function ServicesGrid({ services = [] }: ServicesGridProps) {
  const type = publicConfig.serviceSectionType;

  if (type === "HandOfCards") {
    return <HandOfCardsServices services={services} />;
  }

  // Default to Stacked
  return <StackedServices services={services} />;
}
