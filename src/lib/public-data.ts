import { getImagesInFolder, getRandomImageInFolder, type CloudinaryResource } from "./cloudinary";
import { getLocalImagesInFolder, getRandomLocalImageInFolder, type LocalResource } from "./local-media";
import { publicConfig } from "@/lib/config";

const isDev = process.env.NODE_ENV === "development";
const useCloudinary = publicConfig.useCloudinary;

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
  id: string; // Slugified title
  title: string;
  description: string;
  media: GalleryImage[];
  folder: string; // The folder name for media assets
}

/**
 * Fetches gallery images from the Website/Gallery folder.
 */
export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    let resources: (CloudinaryResource | LocalResource)[] = [];
    
    if (isDev || !useCloudinary) {
      resources = getLocalImagesInFolder("Website/Gallery");
    }

    if (useCloudinary && resources.length === 0) {
      resources = await getImagesInFolder("Website/Gallery", 25);
    }

    if (!isDev && resources.length === 0) {
       resources = getLocalImagesInFolder("Website/Gallery");
    }

    return [...resources]
      .sort((a, b) => {
        const nameA = a.display_name || a.public_id;
        const nameB = b.display_name || b.public_id;
        return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
      })
      .map((res: CloudinaryResource | LocalResource) => ({
        name: res.display_name || res.public_id.split("/").pop() || "Gallery Image",
        url: res.secure_url,
        type: "resource_type" in res && res.resource_type === "video" ? "video" : "image",
      }));
  } catch {
    console.error("[DATA ERROR] Gallery fetch failed");
    return [];
  }
};

/**
 * Fetches a random pair of hero images (wide and mobile).
 */
export const getHeroPair = async (basePath: string) => {
  const path = basePath.replace("Home/", "");
  try {
    const mobileFolderName = "Vertical";

    const fetchHero = async (subFolder: string) => {
      const folderPath = `${path}/${subFolder}`;
      let res = null;

      if (isDev || !useCloudinary) {
        res = getRandomLocalImageInFolder(folderPath);
      }

      if (useCloudinary && !res) {
        res = await getRandomImageInFolder(folderPath);
      }

      if (!res && !isDev) {
        res = getRandomLocalImageInFolder(folderPath);
      }

      return res;
    };

    const [wide, vert] = await Promise.all([
      fetchHero("Wide"),
      fetchHero(mobileFolderName),
    ]);

    return {
      wide: wide?.secure_url || "/fallback/Website/Hero/Wide/Hero.png",
      vert: vert?.secure_url || "/fallback/Website/Hero/Wide/Hero.png",
    };
  } catch {
    console.error(`[DATA ERROR] Hero pair for ${path} failed`);
    return { wide: "/fallback/Website/Hero/Wide/Hero.png", vert: "/fallback/Website/Hero/Wide/Hero.png" };
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
  return Promise.all(
    STATIC_SERVICES.map(async (service) => {
      const folderPath = `Website/Services/${service.folder}`;
    try {
      let resources: (CloudinaryResource | LocalResource)[] = [];
      
      if (useCloudinary) {
        resources = await getImagesInFolder(folderPath, 50);
      }

      if (resources.length === 0) {
        resources = getLocalImagesInFolder(folderPath);
      }
        
        const media: GalleryImage[] = resources.slice(0, 10).map(res => ({
          name: res.display_name || res.public_id.split("/").pop() || "Project Media",
          url: res.secure_url,
          type: "resource_type" in res && (res as CloudinaryResource).resource_type === "video" ? "video" : "image",
        }));

        return {
          id: service.title.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"),
          title: service.title,
          description: service.description,
          media: media,
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
    })
  );
};

export const getServiceBySlug = async (slug: string): Promise<ServiceData | null> => {
  const all = await getStaticServices();
  return all.find(s => s.id === slug) || null;
};

export async function getWhoWeArePhoto(): Promise<string> {
  const folder = "Website/WhoWeAre";
  let image = null;

  if (useCloudinary) {
    image = await getRandomImageInFolder(folder);
  }

  if (image) return image.secure_url;
  return "/fallback/Website/WhoWeAre/Kale.png";
}

export const getServiceProjects = async (folder: string): Promise<GalleryImage[]> => {
  const folderPath = `Website/Services/${folder}`;
  try {
    let resources: (CloudinaryResource | LocalResource)[] = [];
    
    if (useCloudinary) {
      resources = await getImagesInFolder(folderPath, 100);
    }

    if (resources.length === 0) {
      resources = getLocalImagesInFolder(folderPath);
    }

    return [...resources]
      .sort((a, b) => {
        const nameA = a.display_name || a.public_id;
        const nameB = b.display_name || b.public_id;
        return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
      })
      .map((res) => ({
        name: res.display_name || res.public_id.split("/").pop() || "Project Image",
        url: res.secure_url,
        type: "resource_type" in res && (res as CloudinaryResource).resource_type === "video" ? "video" : "image",
      }));
  } catch (_error) {
    return [];
  }
};

export const getPublishedReviews = async (): Promise<Review[]> => {
  return [
    {
      id: "mock-1",
      customer_name: "Lauren Baxter",
      rating: 5,
      quote:
        "Kale did a fantastic job on our gutters! He is very knowledgeable, reliable & does great work! 10/10 recommend",
      review_date: new Date().toISOString(),
      published: true,
    },
    {
      id: "mock-2",
      customer_name: "Kaylee Shomidie",
      rating: 5,
      quote:
        "KML took pride in delivering exceptional soffit, fascia, and gutter services. The finish was perfect. Thank you!",
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
