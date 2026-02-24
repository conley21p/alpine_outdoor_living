import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { GalleryImage } from "@/components/website/GalleryGrid";
import type { Review } from "@/types";
import { readdir } from "fs/promises";
import { join } from "path";

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    // Read images from local public/images/gallery directory
    const galleryDir = join(process.cwd(), "public", "images", "gallery");
    const files = await readdir(galleryDir);
    
    const imageFiles = files
      .filter((file) => 
        !file.startsWith(".") && 
        (file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png") || file.endsWith(".webp"))
      )
      .sort((a, b) => a.localeCompare(b));

    return imageFiles.map((file) => {
      const name = file.replace(/\.(jpg|jpeg|png|webp)$/i, "");
      return {
        name: name.replace(/[-_]/g, " "),
        url: `/images/gallery/${file}`,
      };
    });
  } catch {
    return [];
  }
};

export const getPublishedReviews = async () => {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("reviews")
      .select("*")
      .eq("published", true)
      .order("review_date", { ascending: false });

    if (error) return [];
    return (data ?? []) as Review[];
  } catch {
    return [];
  }
};
