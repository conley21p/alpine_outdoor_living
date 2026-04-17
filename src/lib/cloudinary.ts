import { v2 as cloudinary } from "cloudinary";
import { getServerConfig } from "./config";

// Initialize Cloudinary with server-side config
const config = getServerConfig();

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true,
});

export interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

/**
 * Fetches all images from a specific folder in Cloudinary using the Asset Folder API.
 * This is the most reliable method for newer Cloudinary accounts.
 */
export async function getImagesInFolder(
  folderPath: string,
  maxResults = 50
): Promise<CloudinaryResource[]> {
  console.log(`[CLOUDINARY] 📍 Fetching from folder: "${folderPath}"`);
  console.log(`[CLOUDINARY] 🏷️ Cloud Name: "${config.cloudinaryCloudName || "MISSING"}"`);
  console.log(`[CLOUDINARY] 🔑 API Key: "${config.cloudinaryApiKey ? "PRESENT" : "MISSING"}"`);
  console.log(`[CLOUDINARY] 🔒 API Secret: "${config.cloudinaryApiSecret ? "PRESENT" : "MISSING"}"`);

  try {
    // Using resources_by_asset_folder which works for Dynamic Folder accounts
    const results = await cloudinary.api.resources_by_asset_folder(folderPath, {
      max_results: maxResults,
    });

    console.log(`[CLOUDINARY] ✅ Found ${results.resources.length} resources in "${folderPath}"`);

    return results.resources.map((res: CloudinaryResource) => ({
      public_id: res.public_id,
      secure_url: res.secure_url,
      width: res.width,
      height: res.height,
      format: res.format,
    }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[CLOUDINARY ERROR] Folder: "${folderPath}":`, errorMessage);
    return [];
  }
}

/**
 * Fetches search results for a folder, allowing for randomization or specific limits.
 */
export async function getRandomImageInFolder(
  folderPath: string
): Promise<CloudinaryResource | null> {
  try {
    const images = await getImagesInFolder(folderPath, 50);
    if (images.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  } catch (error) {
    console.error(`[CLOUDINARY ERROR] Random image fetch for "${folderPath}":`, error);
    return null;
  }
}

export default cloudinary;
