/**
 * Injects Cloudinary transformation strings into an image URL.
 * types: 'thumb' (optimized for grid) or 'full' (high definition)
 */
export const getOptimizedUrl = (url: string, type: 'thumb' | 'full' = 'thumb') => {
  if (!url) return url;

  const isAbsolute = /^(https?:|data:)/i.test(url);

  // For local/public paths we must URL-encode spaces and other characters
  // before handing the URL to <img srcset> / next/image. Otherwise browsers
  // can fail to parse `srcset` and drop candidates.
  if (!url.includes("cloudinary.com")) {
    if (isAbsolute) return url;
    // Avoid double-encoding: normalize by decoding then re-encoding.
    // (e.g. "%20" should stay "%20", not become "%2520")
    try {
      return encodeURI(decodeURI(url));
    } catch {
      return encodeURI(url);
    }
  }
  
  const width = type === 'thumb' ? 800 : 1800;
  const quality = type === 'thumb' ? 'q_auto:eco' : 'q_auto:best';
  const transform = `${quality},f_auto,w_${width}`;
  
  // Replace /upload/ with /upload/[transform]/
  return url.replace('/upload/', `/upload/${transform}/`);
};
