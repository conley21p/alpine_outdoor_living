import type { GalleryImage } from "@/components/website/GalleryGrid";
import { readdir } from "fs/promises";
import { join } from "path";
import { publicConfig } from "@/lib/config";

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  quote: string;
  review_date: string;
  service?: string;
  published: boolean;
}

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

export const getPublishedReviews = async (): Promise<Review[]> => {
  // Supabase removed - returning static mock reviews
  return [
    {
      id: "mock-1",
      customer_name: "Sarah Johnson",
      rating: 5,
      quote: "Alpine Outdoor Living transformed our backyard into a peaceful oasis. Their attention to detail on our new pond was incredible!",
      review_date: new Date().toISOString(),
      published: true,
    },
    {
      id: "mock-2",
      customer_name: "Mark Thompson",
      rating: 5,
      quote: "Professional, reliable, and spectacular results. The fire pit they built is the centerpiece of all our outdoor gatherings.",
      review_date: new Date().toISOString(),
      published: true,
    }
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
