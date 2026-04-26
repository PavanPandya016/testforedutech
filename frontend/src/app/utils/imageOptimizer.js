/**
 * Optimizes Cloudinary URLs by injecting transformation parameters.
 * If the URL is not a Cloudinary URL, it returns the original URL.
 * 
 * @param {string} url - The original image URL
 * @param {object} options - Optimization options
 * @param {number} options.width - Target width
 * @param {number} options.height - Target height
 * @param {string} options.crop - Crop mode (default: 'fill')
 * @returns {string} Optimized URL
 */
export const getOptimizedImage = (url, { width, height, crop = 'fill' } = {}) => {
  if (!url || typeof url !== 'string') return url;

  // Only transform Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  // Avoid double transformation — check the segment directly after /upload/
  const afterUpload = url.slice(uploadIndex + 8);
  if (/^(w_|h_|c_|f_|q_|g_|e_|t_|l_|fl_)/.test(afterUpload)) return url;

  const parts = [url.slice(0, uploadIndex + 8), afterUpload];

  const transformations = [
    width ? `w_${width}` : '',
    height ? `h_${height}` : '',
    `c_${crop}`,
    'g_auto', // Smart gravity (focus on faces/important parts)
    'f_auto', // Auto format (WebP/AVIF support)
    'q_auto'  // Auto quality
  ].filter(Boolean).join(',');

  return `${parts[0]}${transformations}/${parts[1]}`;
};
