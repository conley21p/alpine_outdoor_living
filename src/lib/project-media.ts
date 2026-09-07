import fs from "node:fs";
import path from "node:path";

/**
 * Project media discovery.
 *
 * Server-only: touches the filesystem, so import it from server components
 * only. Files are picked up from `public/` at build time, which works with
 * `output: 'export'` because the build runs in Node before anything is emitted.
 *
 * The point is that adding project media requires no code change — drop a file
 * in the right folder and rebuild. Nothing renders while a folder is empty, so
 * the page never ships an empty gallery frame.
 */

export interface ProjectImage {
  /** Public URL, e.g. `/projects/before-after/01-guest-bath.jpg`. */
  src: string;
  /** Human-readable label derived from the filename, or null. */
  caption: string | null;
}

export interface ProjectVideo {
  src: string;
  caption: string | null;
  /** Matching poster image (same basename, image extension), if one exists. */
  poster: string | null;
  /** MIME type for the <source> element. */
  type: string;
}

const BEFORE_AFTER_DIR = "projects/before-after";
const VIDEO_DIR = "projects/videos";

const IMAGE_EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

const VIDEO_MIME: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

const publicPath = (relative: string) =>
  path.join(process.cwd(), "public", relative.replace(/^\//, ""));

function listFiles(dir: string, extensions: string[]): string[] {
  const absolute = publicPath(dir);
  if (!fs.existsSync(absolute)) return [];

  return fs
    .readdirSync(absolute)
    .filter((name) => extensions.includes(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/**
 * Turn a filename into a caption: `01-guest-bath.jpg` -> "Guest bath".
 * A purely numeric name (`1.jpg`) yields no caption rather than "1".
 */
function captionFromFilename(filename: string): string | null {
  const stem = path
    .basename(filename, path.extname(filename))
    .replace(/^[\d]+[\s._-]*/, "")
    .replace(/[-_]+/g, " ")
    .trim();

  if (!stem) return null;
  return stem.charAt(0).toUpperCase() + stem.slice(1);
}

/**
 * Before/after photos from `public/projects/before-after/`.
 * Files are ordered by filename, so prefix them (`01-`, `02-`) to control it.
 */
export const getBeforeAfterImages = async (): Promise<ProjectImage[]> =>
  listFiles(BEFORE_AFTER_DIR, IMAGE_EXTENSIONS).map((name) => ({
    src: `/${BEFORE_AFTER_DIR}/${name}`,
    caption: captionFromFilename(name),
  }));

/**
 * Project videos from `public/projects/videos/`. An image sharing a video's
 * basename is used as its poster frame.
 */
export const getProjectVideos = async (): Promise<ProjectVideo[]> => {
  const posters = listFiles(VIDEO_DIR, IMAGE_EXTENSIONS);

  return listFiles(VIDEO_DIR, VIDEO_EXTENSIONS).map((name) => {
    const stem = path.basename(name, path.extname(name));
    const poster = posters.find((p) => path.basename(p, path.extname(p)) === stem);

    return {
      src: `/${VIDEO_DIR}/${name}`,
      caption: captionFromFilename(name),
      poster: poster ? `/${VIDEO_DIR}/${poster}` : null,
      type: VIDEO_MIME[path.extname(name).toLowerCase()] ?? "video/mp4",
    };
  });
};
