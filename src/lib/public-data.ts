import { getLocalImagesInFolder, getRandomLocalImageInFolder, type LocalResource } from "./local-media";
import { publicConfig } from "@/lib/config";

// Edge-safe type definition (mirrors CloudinaryResource shape for compatibility)
interface MediaResource {
  public_id: string;
  display_name?: string;
  secure_url: string;
}

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
 * Fetches gallery images from local fallback folder.
 */
export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const resources: LocalResource[] = getLocalImagesInFolder("Website/Gallery");
    return [...resources]
      .sort((a, b) => {
        const nameA = a.display_name || a.public_id;
        const nameB = b.display_name || b.public_id;
        return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: "base" });
      })
      .map((res) => ({
        name: res.display_name || res.public_id.split("/").pop() || "Gallery Image",
        url: res.secure_url,
        type: "image" as const,
      }));
  } catch {
    return [];
  }
};

/**
 * Fetches a random pair of hero images (wide and mobile) from local fallback.
 */
export const getHeroPair = async (basePath: string) => {
  const path = basePath.replace("Home/", "");
  try {
    const wide = getRandomLocalImageInFolder(`${path}/Wide`);
    const vert = getRandomLocalImageInFolder(`${path}/Vertical`);
    return {
      wide: wide?.secure_url || "/fallback/Website/Hero/Wide/Hero.png",
      vert: vert?.secure_url || "/fallback/Website/Hero/Vertical/Hero.png",
    };
  } catch {
    return {
      wide: "/fallback/Website/Hero/Wide/Hero.png",
      vert: "/fallback/Website/Hero/Vertical/Hero.png",
    };
  }
};

/**
 * Static service definitions for KML Seamless Gutters.
 */
const STATIC_SERVICES: Array<{ title: string; description: string; folder: string }> = [
  {
    title: "Seamless Gutters",
    description: "Our premier seamless gutter systems are custom-formed on-site for a perfect fit, providing ultimate protection against water damage and foundation issues.",
    folder: "Seamless Gutters",
  },
  {
    title: "Soffit",
    description: "Expertly installed soffit systems that provide critical attic ventilation and structural integrity while enhancing your home's roofline aesthetics.",
    folder: "Soffit",
  },
  {
    title: "Fascia",
    description: "Durable fascia installation that serves as the perfect support for your gutter system while creating a clean, finished appearance for your home's exterior.",
    folder: "Fascia",
  },
  {
    title: "Siding Installation",
    description: "Professional siding solutions featuring premium materials that improve energy efficiency and curb appeal while providing a robust weather-resistant barrier.",
    folder: "Siding",
  },
];

export const getStaticServices = async (): Promise<ServiceData[]> => {
  return STATIC_SERVICES.map((service) => {
    const folderPath = `Website/Services/${service.folder}`;
    try {
      const resources: LocalResource[] = getLocalImagesInFolder(folderPath);
      const media: GalleryImage[] = resources.slice(0, 10).map((res) => ({
        name: res.display_name || res.public_id.split("/").pop() || "Project Media",
        url: res.secure_url,
        type: "image" as const,
      }));
      return {
        id: service.title.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"),
        title: service.title,
        description: service.description,
        media,
        folder: service.folder,
      };
    } catch {
      return {
        id: service.title.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"),
        title: service.title,
        description: service.description,
        media: [],
        folder: service.folder,
      };
    }
  });
};

export const getServiceBySlug = async (slug: string): Promise<ServiceData | null> => {
  const all = await getStaticServices();
  return all.find((s) => s.id === slug) || null;
};

export async function getWhoWeArePhoto(): Promise<string> {
  const res = getRandomLocalImageInFolder("Website/WhoWeAre");
  return res?.secure_url || "/fallback/Website/WhoWeAre/Kale.png";
}

export const getServiceProjects = async (folder: string): Promise<GalleryImage[]> => {
  try {
    const resources: LocalResource[] = getLocalImagesInFolder(`Website/Services/${folder}`);
    return [...resources]
      .sort((a, b) => {
        const nameA = a.display_name || a.public_id;
        const nameB = b.display_name || b.public_id;
        return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: "base" });
      })
      .map((res) => ({
        name: res.display_name || res.public_id.split("/").pop() || "Project Image",
        url: res.secure_url,
        type: "image" as const,
      }));
  } catch {
    return [];
  }
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
