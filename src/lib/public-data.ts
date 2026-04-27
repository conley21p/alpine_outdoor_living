import { publicConfig } from "@/lib/config";

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
  category: "exterior" | "interior";
}

/**
 * Gallery images — served from static public/ assets.
 */
export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  return [
    { name: "Green House — New Roof", url: "/lincoln-land-exteriors/Green House New Roof Hero Image.jpeg", type: "image" },
    { name: "Brick House — New Roof", url: "/lincoln-land-exteriors/Brick House New Roof Street View.jpeg", type: "image" },
    { name: "Blue House — Roofing Project", url: "/lincoln-land-exteriors/Blue House Roofing Project Started.jpeg", type: "image" },
    { name: "Duplex — New Roof", url: "/lincoln-land-exteriors/Duplex New Roof.jpeg", type: "image" },
    { name: "New Roof & Black Gutters", url: "/lincoln-land-exteriors/House New Roof and black gutters.jpeg", type: "image" },
    { name: "New Roof — Rear View", url: "/lincoln-land-exteriors/House With Out house new roof picture of back of house.jpeg", type: "image" },
    { name: "Remodel — New Roof & Gutters", url: "/lincoln-land-exteriors/Remodedl White House New Roof And Gutters.jpeg", type: "image" },
  ];
};

/**
 * Hero images — served from static public/ assets.
 */
export const getHeroPair = async () => {
  return {
    wide: "/lincoln-land-exteriors/Green House New Roof Hero Image.jpeg",
    vert: "/lincoln-land-exteriors/Brick House New Roof Street View.jpeg",
  };
};

/**
 * Static service definitions for Lincoln Land Exteriors.
 */
const STATIC_SERVICES: Array<{
  title: string;
  description: string;
  folder: string;
  media: GalleryImage[];
  category: "exterior" | "interior";
}> = [
  {
    title: "Roofing (Repairs & Replacements)",
    description: "From leak repairs to full tear-offs and replacements, we deliver durable roofing work with clear communication and job sites kept clean.",
    folder: "Roofing",
    media: [
      { name: "Roofing Project", url: "/lincoln-land-exteriors/Brick House New Roof Street View.jpeg", type: "image" },
    ],
    category: "exterior",
  },
  {
    title: "Siding (Install & Repair)",
    description: "Improve curb appeal and protection with professional siding installation and repairs built for Midwest weather.",
    folder: "Siding",
    media: [
      { name: "Siding Example", url: "/lincoln-land-exteriors/Remodedl White House New Roof And Gutters.jpeg", type: "image" },
    ],
    category: "exterior",
  },
  {
    title: "Gutters (Install & Replace)",
    description: "Replace worn or undersized gutters to help protect your home from water damage. We install clean, functional systems that look great.",
    folder: "Gutters",
    media: [
      { name: "Gutters Project", url: "/lincoln-land-exteriors/Green House New Roof Hero Image.jpeg", type: "image" },
    ],
    category: "exterior",
  },
  {
    title: "Windows & Exterior Doors",
    description: "Upgrade efficiency, security, and curb appeal with professional window and exterior door installation.",
    folder: "Windows & Doors",
    media: [
      { name: "Project Photo", url: "/lincoln-land-exteriors/House New Roof and black gutters.jpeg", type: "image" },
    ],
    category: "exterior",
  },
  {
    title: "Soffit & Fascia",
    description: "Protect your roofline with properly installed soffit and fascia for ventilation, durability, and a finished look.",
    folder: "Soffit & Fascia",
    media: [
      { name: "Soffit & Fascia", url: "/lincoln-land-exteriors/Soffit-and-Fascia.jpeg", type: "image" },
    ],
    category: "exterior",
  },
  {
    title: "Interior Remodeling",
    description: "Flooring, drywall, kitchens, bathrooms, lighting, and doors — handled start-to-finish with reliable scheduling and clear expectations.",
    folder: "Interior",
    media: [
      { name: "Team", url: "/lincoln-land-exteriors/Team Photo.JPG", type: "image" },
    ],
    category: "interior",
  },
];

export const getStaticServices = async (): Promise<ServiceData[]> => {
  return STATIC_SERVICES.map((service) => ({
    id: service.title.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"),
    title: service.title,
    description: service.description,
    media: service.media,
    folder: service.folder,
    category: service.category,
  }));
};

export const getExteriorServices = async (): Promise<ServiceData[]> => {
  const all = await getStaticServices();
  return all.filter((s) => s.category === "exterior");
};

export const getInteriorServices = async (): Promise<ServiceData[]> => {
  const all = await getStaticServices();
  return all.filter((s) => s.category === "interior");
};

export const getServiceBySlug = async (slug: string): Promise<ServiceData | null> => {
  const all = await getStaticServices();
  return all.find((s) => s.id === slug) || null;
};

export async function getWhoWeArePhoto(): Promise<string> {
  return "/lincoln-land-exteriors/Zach Williams (Owner).JPG";
}

export const getServiceProjects = async (folder: string): Promise<GalleryImage[]> => {
  const service = STATIC_SERVICES.find((s) => s.folder === folder);
  return service?.media || [];
};

export const getPublishedReviews = async (): Promise<Review[]> => {
  return [
    {
      id: "mock-1",
      customer_name: "Lauren Baxter",
      rating: 5,
      quote: "Kale did a fantastic job on our gutters! He is very knowledgeable, reliable & does great work! 10/10 recommend",
      review_date: new Date().toISOString(),
      published: true,
    },
    {
      id: "mock-2",
      customer_name: "Kaylee Shomidie",
      rating: 5,
      quote: "KML took pride in delivering exceptional soffit, fascia, and gutter services. The finish was perfect. Thank you!",
      review_date: new Date().toISOString(),
      published: true,
    },
  ];
};

export interface FacebookPost {
  thumbnailUrl: string;
  postUrl: string;
  authorName: string;
}

export const getFacebookFeaturedPost = async (): Promise<FacebookPost | null> => {
  return {
    thumbnailUrl: "/fallback/Website/Hero/Wide/Hero.png",
    postUrl: publicConfig.facebookUrl,
    authorName: publicConfig.facebookHandle,
  };
};
