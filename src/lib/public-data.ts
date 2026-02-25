import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { GalleryImage } from "@/components/website/GalleryGrid";
import type { Review } from "@/types";
import { readdir } from "fs/promises";
import { join } from "path";
import { publicConfig } from "@/lib/config";

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

export interface InstagramPost {
  thumbnailUrl: string;
  postUrl: string;
  authorName: string;
}

export const getInstagramFeaturedPost = async (): Promise<InstagramPost | null> => {
  try {
    const postUrl = publicConfig.instagramFeaturedPost;
    
    // Check if it's a valid Instagram URL
    if (!postUrl || !postUrl.includes('instagram.com')) {
      return null;
    }

    // Use Instagram's oEmbed API (free, no auth required)
    const oembedUrl = `https://graph.instagram.com/oembed?url=${encodeURIComponent(postUrl)}&fields=thumbnail_url`;
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
