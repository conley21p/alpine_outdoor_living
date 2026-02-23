import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { GalleryImage } from "@/components/website/GalleryGrid";
import type { Review } from "@/types";

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from("gallery").list("", {
      limit: 200,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error || !data) return [];

    return data
      .filter((item) => !item.name.endsWith("/"))
      .map((item) => {
        const { data: urlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(item.name);
        return {
          name: item.name,
          url: urlData.publicUrl,
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
