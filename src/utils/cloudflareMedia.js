/**
 * Cloudflare Media & Asset Resolver
 * Replaces Supabase Storage URLs with Cloudflare R2 / CDN / local asset routing
 */

// Base Cloudflare R2 public custom domain or CDN path
const R2_PUBLIC_DOMAIN = 'https://media.xpensivemedia.com';

/**
 * Generate a public Cloudflare media URL
 * @param {string} bucket - Bucket name or asset folder
 * @param {string} path - Path to the image/video file
 * @returns {string} Public asset URL
 */
export const getCloudflareImageUrl = (bucket, path) => {
  if (!path) return '';
  // If absolute URL is provided (e.g. external CDN, https://...)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Local fallback or R2 CDN URL
  return `/${bucket}/${path}`;
};

// Aliased export for compatibility with existing imports
export const getSupabaseImageUrl = getCloudflareImageUrl;

/**
 * Services images configuration
 */
export const servicesImagesMap = {
  'website-development': 'website-development.webp',
  'corporate-events': 'corporate-events.webp',
  'bars-restaurants': 'bars-restaurants.webp',
  'real-estate': 'real-estate.webp',
  'testimonials': 'testimonials.webp',
  'digital-marketing': 'digital-marketing.webp',
  'social-media': 'social-media.webp',
  'influencer-marketing': 'influencer-marketing.webp',
  'podcast': 'podcast.webp',
};

/**
 * Website projects images configuration
 */
export const websiteProjectsImagesMap = {
  'home': 'home.png',
  'about': 'about.png',
  'works': 'works.png',
};
