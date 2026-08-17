export interface GalleryImage {
  name: string;
  url: string;
  type: "image" | "video";
}

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  quote: string;
  review_date: string;
  service?: string;
  published: boolean;
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  media: GalleryImage[];
  folder: string;
  /** Card eyebrow, e.g. "Package 2". */
  label?: string;
  /** Price and timeline line rendered under the title. */
  meta?: string;
  /** A few headline inclusions, shown when there's no photography. */
  highlights?: string[];
}

/**
 * A priced remodel package. `media` is intentionally empty until the business
 * supplies real project photography — the service cards and hero degrade to a
 * clean text-only treatment rather than showing another company's work.
 */
export interface RemodelPackage {
  id: string;
  label: string;
  title: string;
  price: string;
  timeline: string;
  summary: string;
  features: string[];
  bestFor: string;
  featured?: boolean;
}

export const REMODEL_PACKAGES: RemodelPackage[] = [
  {
    id: "safety-essentials",
    label: "Package 1",
    title: "Safety Essentials",
    price: "$650 – $1,800+",
    timeline: "Typically 1 day",
    summary:
      "For clients who just need the highest-risk hazards fixed now, without a full remodel.",
    features: [
      "3–4 grab bars, professionally anchored into blocking (not just drywall anchors)",
      "Comfort-height toilet swap (17–19”)",
      "Handheld showerhead on a sliding bar",
      "Non-slip flooring treatment or slip-resistant bath mat",
      "Improved lighting (motion-sensor night light or brighter fixture)",
    ],
    bestFor:
      "Adult children who want their parent safer this week, or a pre-hospital-discharge fix.",
  },
  {
    id: "fast-track-shower-conversion",
    label: "Package 2",
    title: "Fast-Track Shower Conversion",
    price: "$6,500 – $10,500+",
    timeline: "Typically 3–5 days",
    summary:
      "The most requested package: removes the fall hazard of climbing over a tub edge.",
    features: [
      "Full tub removal and disposal",
      "Prefab or acrylic walk-in shower base and wall surround",
      "Comfort-height toilet",
      "Lever-handle faucet (easier grip than knobs)",
      "Slip-resistant flooring",
      "2–3 grab bars meeting ADA dimensional specs",
      "Drain and valve relocation as needed",
    ],
    bestFor:
      "Clients who want a quick, contained project and don’t need custom tile.",
    featured: true,
  },
  {
    id: "custom-accessible-remodel",
    label: "Package 3",
    title: "Custom Accessible Remodel",
    price: "$11,000 – $18,000+",
    timeline: "Typically 2–3 weeks",
    summary:
      "A fully personalized bathroom that still looks like a nice bathroom, not a medical fixture.",
    features: [
      "Curbless (zero-threshold) shower entry with linear drain",
      "Custom tile walls and floor, homeowner’s choice of style",
      "Fold-down bench (17–18” height)",
      "Grab bars meeting ADA dimensional specs at entry, wall, and bench",
      "Comfort-height toilet and accessible vanity with knee clearance",
      "Upgraded lighting and ventilation",
      "Thermostatic shower valve (holds a set temperature to reduce scald risk)",
    ],
    bestFor:
      "Clients planning to stay in the home long-term who want it to look updated, not “medicalized.”",
  },
  {
    id: "full-universal-design-retrofit",
    label: "Package 4",
    title: "Full Universal Design Retrofit",
    price: "$19,000 – $28,000+",
    timeline: "Typically 3–4 weeks",
    summary:
      "For wheelchair access or significant mobility needs, built to last through future stages of aging.",
    features: [
      "Doorway widened to 32”+ for walker/wheelchair clearance",
      "60”x60” curbless roll-in shower",
      "Reinforced walls so grab bars can be added later throughout the shower and toilet areas",
      "Custom tile, vanity, and fixtures",
      "Structural, electrical, and plumbing coordination as required",
      "Optional: heated flooring, smart lighting",
    ],
    bestFor:
      "Clients with a diagnosed mobility condition, or planning ahead for a spouse or parent moving in.",
  },
];

export const getRemodelPackages = async (): Promise<RemodelPackage[]> => {
  return REMODEL_PACKAGES;
};

/**
 * The swipeable service cards on the home page are the same four packages,
 * summarised with their price and timeline.
 */
export const getStaticServices = async (): Promise<ServiceData[]> => {
  return REMODEL_PACKAGES.map((pkg) => ({
    id: pkg.id,
    title: pkg.title,
    description: pkg.summary,
    media: [],
    folder: pkg.id,
    label: pkg.label,
    meta: `${pkg.price} · ${pkg.timeline}`,
    highlights: pkg.features.slice(0, 4),
  }));
};

export const getServiceBySlug = async (slug: string): Promise<ServiceData | null> => {
  const all = await getStaticServices();
  return all.find((s) => s.id === slug) || null;
};

export const getServiceProjects = async (folder: string): Promise<GalleryImage[]> => {
  const service = await getServiceBySlug(folder);
  return service?.media || [];
};

/**
 * No published customer reviews on file yet. The reviews section renders
 * nothing while this is empty rather than showing placeholder testimonials.
 */
export const getPublishedReviews = async (): Promise<Review[]> => {
  return [];
};
