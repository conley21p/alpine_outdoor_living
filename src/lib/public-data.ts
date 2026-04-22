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
}

/**
 * Gallery images — served from static public/fallback/ assets.
 * Add more entries here as KML uploads project photos.
 */
export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  return [
    { name: "Seamless Gutters Installation", url: "/fallback/Website/Services/Seamless Gutters/Project.png", type: "image" },
    { name: "Soffit Installation", url: "/fallback/Website/Services/Soffit/Project.png", type: "image" },
    { name: "Fascia Installation", url: "/fallback/Website/Services/Fascia/Project.png", type: "image" },
    { name: "Siding Installation", url: "/fallback/Website/Services/Siding/Project.png", type: "image" },
  ];
};

/**
 * Hero images — served from static public/fallback/ assets.
 */
export const getHeroPair = async () => {
  return {
    wide: "/fallback/Website/Hero/Wide/Hero.png",
    vert: "/fallback/Website/Hero/Vertical/Hero.png",
  };
};

/**
 * Static service definitions for KML Seamless Gutters.
 */
const STATIC_SERVICES: Array<{ title: string; description: string; folder: string; media: GalleryImage[] }> = [
  {
    title: "Seamless Gutters",
    description: "Our premier seamless gutter systems are custom-formed on-site for a perfect fit, providing ultimate protection against water damage and foundation issues.",
    folder: "Seamless Gutters",
    media: [
      { name: "Seamless Gutter Installation", url: "/fallback/Website/Services/Seamless Gutters/Project.png", type: "image" },
    ],
  },
  {
    title: "Soffit",
    description: "Expertly installed soffit systems that provide critical attic ventilation and structural integrity while enhancing your home's roofline aesthetics.",
    folder: "Soffit",
    media: [
      { name: "Soffit Installation", url: "/fallback/Website/Services/Soffit/Project.png", type: "image" },
    ],
  },
  {
    title: "Fascia",
    description: "Durable fascia installation that serves as the perfect support for your gutter system while creating a clean, finished appearance for your home's exterior.",
    folder: "Fascia",
    media: [
      { name: "Fascia Installation", url: "/fallback/Website/Services/Fascia/Project.png", type: "image" },
    ],
  },
  {
    title: "Siding Installation",
    description: "Professional siding solutions featuring premium materials that improve energy efficiency and curb appeal while providing a robust weather-resistant barrier.",
    folder: "Siding",
    media: [
      { name: "Siding Installation", url: "/fallback/Website/Services/Siding/Project.png", type: "image" },
    ],
  },
];

export const getStaticServices = async (): Promise<ServiceData[]> => {
  return STATIC_SERVICES.map((service) => ({
    id: service.title.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"),
    title: service.title,
    description: service.description,
    media: service.media,
    folder: service.folder,
  }));
};

export const getServiceBySlug = async (slug: string): Promise<ServiceData | null> => {
  const all = await getStaticServices();
  return all.find((s) => s.id === slug) || null;
};

export async function getWhoWeArePhoto(): Promise<string> {
  return "/fallback/Website/WhoWeAre/Kale.png";
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
