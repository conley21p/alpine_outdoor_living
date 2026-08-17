import fs from "node:fs";
import path from "node:path";

/**
 * Hero image resolution.
 *
 * Server-only: this module touches the filesystem, so it must only be imported
 * from server components (currently `src/app/page.tsx`). Paths are resolved at
 * build time against `public/`, which works with `output: 'export'` because the
 * build runs in Node before anything is emitted.
 */

export interface HeroPair {
  wide: string | null;
  vert: string | null;
  /** True when a `.webp` sibling exists for every image returned above. */
  hasWebp: boolean;
}

const HERO_DIR = "fallback/Website/Hero";
const HERO_EXTENSIONS = ["webp", "jpg", "jpeg", "png"] as const;

const publicPath = (relative: string) =>
  path.join(process.cwd(), "public", relative.replace(/^\//, ""));

/**
 * First existing `Hero.<ext>` in a hero folder. Pointing the markup at a file
 * that isn't there would render a broken image, so absence just means "no photo
 * yet" and the hero keeps its illustrated treatment.
 */
function findHeroImage(subdir: string): string | null {
  for (const ext of HERO_EXTENSIONS) {
    const relative = `${HERO_DIR}/${subdir}/Hero.${ext}`;
    if (fs.existsSync(publicPath(relative))) {
      return `/${relative}`;
    }
  }
  return null;
}

function hasWebpSibling(url: string | null): boolean {
  if (!url) return true;
  if (url.endsWith(".webp")) return true;
  return fs.existsSync(publicPath(url.replace(/\.[^.]+$/, ".webp")));
}

/**
 * Hero photography, picked up automatically from
 * `public/fallback/Website/Hero/Wide/Hero.*` and `.../Vertical/Hero.*`.
 * Drop the files in and rebuild — no code change needed.
 *
 * Supplying only one of the two is fine: it is used for both orientations,
 * though it will crop on the other one.
 */
export const getHeroPair = async (): Promise<HeroPair> => {
  const wide = findHeroImage("Wide");
  const vert = findHeroImage("Vertical");

  return {
    wide: wide ?? vert,
    vert: vert ?? wide,
    hasWebp: hasWebpSibling(wide) && hasWebpSibling(vert),
  };
};
