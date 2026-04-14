import { getImagesInFolder, getRandomImageInFolder } from "./cloudinary";
import { publicConfig } from "@/lib/config";

export interface GalleryImage {
  name: string;
  url: string;
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

/**
 * Fetches gallery images from Cloudinary Home/Website/Gallery folder.
 */
export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  console.log("[DATA] Fetching Gallery images...");
  try {
    const resources = await getImagesInFolder("Home/Website/Gallery", 25);
    return resources.map((res) => ({
      name: res.public_id.split("/").pop() || "Gallery Image",
      url: res.secure_url,
    }));
  } catch (error) {
    console.error("[DATA ERROR] Gallery fetch:", error);
    return [];
  }
};

/**
 * Fetches a random pair of hero images (wide and mobile) from Cloudinary.
 */
export const getHeroPair = async (basePath: string) => {
  console.log(`[DATA] Fetching Hero pair for: ${basePath}`);
  try {
    const [wide, vert] = await Promise.all([
      getRandomImageInFolder(`${basePath}/Wide`),
      getRandomImageInFolder(`${basePath}/vert`),
    ]);

    return {
      wide: wide?.secure_url || null,
      vert: vert?.secure_url || null,
    };
  } catch (error) {
    console.error(`[DATA ERROR] Hero pair for ${basePath}:`, error);
    return { wide: null, vert: null };
  }
};

/**
 * Fetches representative images for each service category from Cloudinary.
 */
export const getServiceImages = async () => {
  console.log("[DATA] Fetching Service category images...");
  const categories = ["FirePit", "HardScape", "Patio", "Water"];
  const serviceImages: Record<string, string> = {};

  await Promise.all(
    categories.map(async (cat) => {
      const img = await getRandomImageInFolder(`Home/Website/Services/${cat}`);
      if (img) {
        const uiNameMap: Record<string, string> = {
          FirePit: "Fire Pits",
          HardScape: "Hardscape",
          Patio: "Patio",
          Water: "Water Features",
        };
        serviceImages[uiNameMap[cat] || cat] = img.secure_url;
      }
    })
  );

  return serviceImages;
};

export const getPublishedReviews = async (): Promise<Review[]> => {
  return [
    {
      id: "mock-1",
      customer_name: "Sarah Johnson",
      rating: 5,
      quote:
        "Alpine Outdoor Living transformed our backyard into a peaceful oasis. Their attention to detail on our new pond was incredible!",
      review_date: new Date().toISOString(),
      published: true,
    },
    {
      id: "mock-2",
      customer_name: "Mark Thompson",
      rating: 5,
      quote:
        "Professional, reliable, and spectacular results. The fire pit they built is the centerpiece of all our outdoor gatherings.",
      review_date: new Date().toISOString(),
      published: true,
    },
  ];
};

export interface InstagramPost {
  thumbnailUrl: string;
  postUrl: string;
  authorName: string;
}

export const getInstagramFeaturedPost = async (): Promise<InstagramPost | null> => {
  try {
    const postUrl = publicConfig.instagramFeaturedPost;

    if (!postUrl || !postUrl.includes("instagram.com")) {
      return null;
    }

    const oembedUrl = `https://graph.instagram.com/oembed?url=${encodeURIComponent(
      postUrl
    )}&fields=thumbnail_url`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      thumbnailUrl: data.thumbnail_url,
      postUrl: postUrl,
      authorName: data.author_name || publicConfig.instagramHandle,
    };
  } catch {
    return null;
  }
};
