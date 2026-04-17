/** Cloudinary Dynamic Data Layer - Build Refresh Heartbeat **/
import cloudinary, { getImagesInFolder, getRandomImageInFolder } from "./cloudinary";
import { publicConfig } from "@/lib/config";

interface CloudinaryFolder {
  name: string;
  path: string;
}

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
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
  imageUrls: string[];
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

        // 3. Find images and text files in this folder using a single call
        const results = await cloudinary.api.resources_by_asset_folder(folderPath, {
          max_results: 50
        });

        // 4. Identify the image and the .txt description
        const imageResource = results.resources.find((r: CloudinaryResource) => r.resource_type === "image");
        const txtResource = results.resources.find((r: CloudinaryResource) => 
          r.resource_type === "raw" && (r.format === "txt" || r.public_id.endsWith(".txt"))
        );

        let description = "Professional outdoor living solutions crafted with care.";
        if (txtResource) {
          try {
            const resp = await fetch(txtResource.secure_url);
            if (resp.ok) {
              const textContent = await resp.text();
              if (textContent && textContent.trim().length > 0) {
                description = textContent.trim();
              }
            }
          } catch (e) {
            console.error(`[DATA ERROR] Could not fetch .txt content for ${folderName}:`, e);
          }
        }

        return {
          title: prettyTitle,
          description: description,
          imageUrl: imageResource?.secure_url || "",
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
 * Static service definitions - fetches one representative image per folder from Cloudinary.
 * Folder names must match exactly as they appear in Cloudinary under Website/Services/
 */
const STATIC_SERVICES: Array<{ title: string; description: string; folder: string }> = [
  {
    title: "Outdoor Spaces",
    description: "Custom Stonework, pathways, retaining walls, firepits, outdoor kitchens and living spaces. Precise, detail-driven construction with premium materials selected for both beauty and longevity. Understanding the property, architecture, and how the space will be lived in.",
    folder: "Outdoor Spaces",
  },
  {
    title: "Ecosystem Ponds and Waterfalls",
    description: "Specialized expertise in natural water features that emphasize the soothing sound of water, which can mask city noise and create a Zen space. Unique focal points that elevate your property value and create the perfect atmosphere for relaxation or entertaining.",
    folder: "Ecosystem Ponds and Waterfalls",
  },
  {
    title: "Pondless Waterfalls and Fountainscapes",
    description: "These offer the beauty of a waterfall without the open water basin. They add a relaxing, gentle, or dramatic water course to your landscape. Perfect for large or small spaces, decks, or patios, requiring very little maintenance.",
    folder: "Pondless Waterfalls and Fountainscapes",
  },
  {
    title: "Landscapes and Lighting",
    description: "We curate expert green spaces designed to evolve and improve over time. Our build process is anchored in discipline and meticulous attention to detail. Strategic greenery that enhances the natural beauty of the Illinois landscape.",
    folder: "Landscapes and Lighting",
  },
];

export const getStaticServices = async (): Promise<ServiceData[]> => {
  console.log("[DATA] Fetching static service images from Cloudinary Website/Services/");
  return Promise.all(
    STATIC_SERVICES.map(async (service) => {
      const folderPath = `Website/Services/${service.folder}`;
      console.log(`[DATA] Querying Cloudinary folder: "${folderPath}"`);
      try {
        const resources = await getImagesInFolder(folderPath, 50);
        
        if (resources.length === 0) {
          console.warn(`[DATA WARNING] No images found in folder: "${folderPath}"`);
        }

        // Shuffle and take up to 10 images
        const shuffled = [...resources].sort(() => 0.5 - Math.random());
        const imageUrls = shuffled.slice(0, 10).map(res => res.secure_url);

        return {
          title: service.title,
          description: service.description,
          imageUrls: imageUrls,
        };
      } catch (error) {
        console.error(`[DATA ERROR] Cloudinary fetch failed for "${service.title}" at "${folderPath}":`, error);
        return {
          title: service.title,
          description: service.description,
          imageUrls: [],
        };
      }
    })
  );
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
