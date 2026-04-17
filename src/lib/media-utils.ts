/**
 * Injects Cloudinary transformation strings into an image URL.
 * types: 'thumb' (optimized for grid) or 'full' (high definition)
 */
export const getOptimizedUrl = (url: string, type: 'thumb' | 'full' = 'thumb') => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  const width = type === 'thumb' ? 800 : 1800;
  const quality = type === 'thumb' ? 'q_auto:eco' : 'q_auto:best';
  const transform = `${quality},f_auto,w_${width}`;
  
  // Replace /upload/ with /upload/[transform]/
  return url.replace('/upload/', `/upload/${transform}/`);
};
