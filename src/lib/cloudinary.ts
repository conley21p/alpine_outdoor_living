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
}

/**
 * Fetches all images from a specific folder in Cloudinary.
 */
export async function getImagesInFolder(
  folderPath: string,
  maxResults = 50
): Promise<CloudinaryResource[]> {
  console.log(`[CLOUDINARY] Fetching images from folder: "${folderPath}"`);
  try {
    const results = await cloudinary.search
      .expression(`folder:"${folderPath}"/*`) // Ensured quotes for paths with spaces
      .sort_by("public_id", "asc")
      .max_results(maxResults)
      .execute();

    console.log(`[CLOUDINARY] Found ${results.resources.length} images in "${folderPath}"`);

    return results.resources.map((res: any) => ({
      public_id: res.public_id,
      secure_url: res.secure_url,
      width: res.width,
      height: res.height,
      format: res.format,
    }));
  } catch (error: any) {
    console.error(`[CLOUDINARY ERROR] Folder: "${folderPath}":`, error.message || error);
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
      console.warn(`[CLOUDINARY] No images found in folder: "${folderPath}"`);
      return null;
    }

    const randomIndex = Math.floor(Math.random() * images.length);
    const selected = images[randomIndex];
    console.log(`[CLOUDINARY] Selected random image: ${selected.public_id}`);
    return selected;
  } catch (error) {
    console.error(`[CLOUDINARY ERROR] Random image fetch for "${folderPath}":`, error);
    return null;
  }
}

export default cloudinary;
