/**
 * Optimizes Cloudinary URLs by injecting transformation parameters.
 *
 * On production (Vercel), images are proxied through /cdn/:path* so
 * Cloudinary cannot set 3rd-party analytics cookies on your users.
 * The /cdn rewrite in vercel.json forwards:
 *   /cdn/:path*  →  https://res.cloudinary.com/djl22ie5b/:path*
 *
 * On localhost (dev/preview) the proxy isn't available, so the original
 * Cloudinary URL is used directly — images load normally in development.
 *
 * @param {string} url   - Original Cloudinary image URL
 * @param {object} opts
 * @param {number} [opts.width]  - Target width in pixels
 * @param {number} [opts.height] - Target height in pixels
 * @param {string} [opts.crop]   - Crop mode (default: 'fill')
 * @returns {string} Optimized URL (proxied on production, direct on dev)
 */

const CLOUD_ORIGIN = 'https://res.cloudinary.com/djl22ie5b';

// Only proxy through /cdn on actual Vercel deployment (not localhost/preview)
const isProduction =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1' &&
  !window.location.hostname.startsWith('192.168.');

export const getOptimizedImage = (url, { width, height, crop = 'fill' } = {}) => {
  if (!url || typeof url !== 'string') return url;

  // Only transform Cloudinary URLs from this account
  if (!url.includes('res.cloudinary.com')) return url;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  // Avoid double transformation — check the segment directly after /upload/
  const afterUpload = url.slice(uploadIndex + 8);
  const alreadyTransformed = /^(w_|h_|c_|f_|q_|g_|e_|t_|l_|fl_)/.test(afterUpload);

  let optimizedUrl;

  if (alreadyTransformed) {
    // Already has transforms — keep as-is, just maybe proxy
    optimizedUrl = url;
  } else {
    const base = url.slice(0, uploadIndex + 8); // everything up to /upload/

    const transformations = [
      width  ? `w_${width}`  : '',
      height ? `h_${height}` : '',
      `c_${crop}`,
      'g_auto', // Smart gravity — focuses on faces / subjects
      'f_auto', // Auto format  — serves WebP / AVIF where supported
      'q_auto', // Auto quality — Cloudinary picks optimal compression
    ].filter(Boolean).join(',');

    optimizedUrl = `${base}${transformations}/${afterUpload}`;
  }

  // Proxy through own domain on production to eliminate 3rd-party cookies.
  // Skipped on localhost so images load normally during development.
  if (isProduction) {
    return optimizedUrl.replace(CLOUD_ORIGIN, '/cdn');
  }

  return optimizedUrl;
};
