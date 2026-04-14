import cloudinary, { getImagesInFolder, getRandomImageInFolder } from "./cloudinary";
import { publicConfig } from "@/lib/config";

interface CloudinaryFolder {
  name: string;
  path: string;
}

interface CloudinaryRawResource {
  public_id: string;
  secure_url: string;
  format: string;
}

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

export interface ServiceData {
  title: string;
  description: string;
  imageUrl: string;
}

/**
 * Fetches gallery images from Cloudinary Website/Gallery folder.
 */
export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const resources = await getImagesInFolder("Website/Gallery", 25);
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
  const path = basePath.replace("Home/", "");
  try {
    const mobileFolderName = path.includes("Hero") && !path.includes("Gallery") && !path.includes("Services") 
      ? "Verticial" 
      : "Vertical";

    const [wide, vert] = await Promise.all([
      getRandomImageInFolder(`${path}/Wide`),
      getRandomImageInFolder(`${path}/${mobileFolderName}`),
    ]);

    return {
      wide: wide?.secure_url || null,
      vert: vert?.secure_url || null,
    };
  } catch (error) {
    console.error(`[DATA ERROR] Hero pair for ${path}:`, error);
    return { wide: null, vert: null };
  }
};

/**
 * Dynamically fetches services based on Cloudinary folder structure.
 * Each subfolder of Website/Services is a service.
 * Each folder should contain a .txt file for the description.
 */
export const getDynamicServices = async (): Promise<ServiceData[]> => {
  console.log("[DATA] Crawling Cloudinary for dynamic services in: Website/Services");
  try {
    // 1. List subfolders of Website/Services
    const folderResult = await cloudinary.api.sub_folders("Website/Services");
    const serviceFolders = folderResult.folders as CloudinaryFolder[];

    const services = await Promise.all(
      serviceFolders.map(async (folder: CloudinaryFolder) => {
        const folderPath = folder.path; // e.g. Website/Services/FirePit
        const folderName = folder.name; // e.g. FirePit

        // 2. Map folder name to a pretty title
        const prettyTitle = folderName
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .replace("Hard Scape", "Hardscape");

        // 3. Find images and text files in this folder
        const [images, raws] = await Promise.all([
          getImagesInFolder(folderPath, 5),
          cloudinary.api.resources({
            type: "upload",
            resource_type: "raw",
            prefix: folderPath + "/",
            max_results: 5,
          })
        ]);

        // 4. Fetch the content of the first .txt file
        let description = "Professional outdoor living solutions crafted with care.";
        const txtFile = raws.resources.find((r: CloudinaryRawResource) => r.format === "txt" || r.public_id.endsWith(".txt"));
        
        if (txtFile) {
          try {
            const resp = await fetch(txtFile.secure_url);
            if (resp.ok) {
              description = await resp.text();
            }
          } catch (e) {
            console.error(`[DATA ERROR] Could not fetch .txt content for ${folderName}:`, e);
          }
        }

        return {
          title: prettyTitle,
          description: description.trim(),
          imageUrl: images[0]?.secure_url || "",
        };
      })
    );

    return services.filter(s => s.imageUrl); // Only return services with at least one image
  } catch (error) {
    console.error("[DATA ERROR] Dynamic services fetch failed:", error);
    return [];
  }
};

/**
 * Fetches representative images for each service category from Cloudinary.
 * @deprecated Use getDynamicServices instead
 */
export const getServiceImages = async () => {
  const categories = ["FirePit", "HardScape", "Patio", "Water"];
  const serviceImages: Record<string, string> = {};

  await Promise.all(
    categories.map(async (cat) => {
      const img = await getRandomImageInFolder(`Website/Services/${cat}`);
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
    if (!postUrl || !postUrl.includes("instagram.com")) return null;

    const oembedUrl = `https://graph.instagram.com/oembed?url=${encodeURIComponent(
      postUrl
    )}&fields=thumbnail_url`;
    const response = await fetch(oembedUrl);

    if (!response.ok) return null;
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
