/**
 * Optimizes Cloudinary URLs by injecting transformation parameters.
 * Also proxies the image through the site's own domain (/cdn/...) to
 * prevent Cloudinary from setting 3rd-party analytics cookies — which
 * would otherwise fail the Lighthouse Best Practices audit.
 *
 * The /cdn rewrite in vercel.json forwards the request to:
 *   https://res.cloudinary.com/djl22ie5b/:path*
 *
 * @param {string} url   - Original Cloudinary image URL
 * @param {object} opts
 * @param {number} [opts.width]  - Target width in pixels
 * @param {number} [opts.height] - Target height in pixels
 * @param {string} [opts.crop]   - Crop mode (default: 'fill')
 * @returns {string} Optimized, proxied URL
 */

// Your Cloudinary cloud name — update here if it ever changes
const CLOUD_ORIGIN = 'https://res.cloudinary.com/djl22ie5b';

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
    // URL already has transforms — just proxy the domain
    optimizedUrl = url;
  } else {
    const base = url.slice(0, uploadIndex + 8); // everything up to and including /upload/

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

  // ── Proxy through own domain to eliminate 3rd-party cookies ──────────────
  // Replaces:  https://res.cloudinary.com/djl22ie5b/image/upload/...
  // With:      /cdn/image/upload/...
  // Vercel forwards /cdn/:path* → https://res.cloudinary.com/djl22ie5b/:path*
  return optimizedUrl.replace(CLOUD_ORIGIN, '/cdn');
};
