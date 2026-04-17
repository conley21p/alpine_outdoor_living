import fs from "fs";
import path from "path";

export interface LocalResource {
  public_id: string;
  secure_url: string;
  format: string;
}

/**
 * Normalizes a path by removing duplicate slashes and ensuring no trailing slash
 */
const normalizePath = (p: string) => p.replace(/\/+/g, "/").replace(/\/$/, "");

const FALLBACK_ROOT = path.join(process.cwd(), "public", "fallback");
const VALID_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Scans the public/fallback/ directory for images matching the provided folderPath.
 */
export function getLocalImagesInFolder(folderPath: string): LocalResource[] {
  const absolutePath = path.join(FALLBACK_ROOT, folderPath);

  if (!fs.existsSync(absolutePath)) {
    return [];
  }

  try {
    const files = fs.readdirSync(absolutePath);
    return files
      .filter((file) => VALID_EXTENSIONS.includes(path.extname(file).toLowerCase()))
      .map((file) => {
        // Construct the relative path accessible from the browser
        const webPath = normalizePath(`/fallback/${folderPath}/${file}`);
        return {
          public_id: `${folderPath}/${file}`,
          secure_url: webPath,
          format: path.extname(file).slice(1),
        };
      });
  } catch (error) {
    console.error(`[LOCAL MEDIA ERROR] Failed to read ${folderPath}:`, error);
    return [];
  }
}

/**
 * Returns a random image from the local fallback folder.
 */
export function getRandomLocalImageInFolder(folderPath: string): LocalResource | null {
  const images = getLocalImagesInFolder(folderPath);
  if (images.length === 0) return null;
  return images[Math.floor(Math.random() * images.length)];
}
