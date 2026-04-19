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
  display_name?: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

/**
 * Internal interfaces for Cloudinary API responses to satisfy strict linting.
 */
export interface CloudinaryApiResource {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
  [key: string]: unknown;
}

export interface CloudinaryApiResponse {
  resources: CloudinaryApiResource[];
  [key: string]: unknown;
}

/**
 * Strict Cloudinary API interface to satisfy '@typescript-eslint/no-explicit-any'.
 */
export interface CloudinaryApi {
  resources_by_asset_folder(
    folderPath: string,
    options?: { max_results?: number }
  ): Promise<CloudinaryApiResponse>;
  sub_folders(
    folderPath: string,
    options?: object
  ): Promise<{ folders: Array<{ name: string; path: string }> }>;
  resources(
    options?: { 
      type?: string; 
      prefix?: string; 
      max_results?: number;
      resource_type?: string;
    }
  ): Promise<CloudinaryApiResponse>;
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
    // 1. Attempt using modern resources_by_asset_folder (for Dynamic Folder accounts)
    const api = cloudinary.api as unknown as CloudinaryApi;
    let results = await api.resources_by_asset_folder(folderPath, {
      max_results: maxResults,
    });

    console.log(`[CLOUDINARY] ✅ Asset Folder Search: Found ${results.resources.length} resources in "${folderPath}"`);

    // 2. Fallback to traditional prefix listing if the modern method returns very few results (potential sync/limit issue)
    if (results.resources.length < 5) {
      console.log(`[CLOUDINARY] 🔄 Low result count. Attempting traditional prefix fallback for "${folderPath}"...`);
      const prefixResults = await api.resources({
        type: 'upload',
        prefix: folderPath,
        max_results: maxResults,
      });
      
      if (prefixResults.resources.length > results.resources.length) {
        console.log(`[CLOUDINARY] 🚀 Prefix search found MORE data (${prefixResults.resources.length} vs ${results.resources.length}). Using prefix results.`);
        results = prefixResults;
      }
    }

    return results.resources.map((res: CloudinaryApiResource) => ({
      public_id: res.public_id,
      display_name: typeof res.display_name === 'string' ? res.display_name : undefined,
      secure_url: res.secure_url,
      width: Number(res.width) || 0,
      height: Number(res.height) || 0,
      format: String(res.format || ""),
      resource_type: String(res.resource_type || "image"),
    }));
  } catch (error: unknown) {
    const errorMessage = error && typeof error === 'object' && 'message' in error ? String(error.message) : JSON.stringify(error);
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
