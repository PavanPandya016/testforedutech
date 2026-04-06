const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // Default TTL: 5 minutes

/**
 * Cache middleware
 * @param {number} duration - Cache duration in seconds (optional)
 */
const cacheMiddleware = (duration) => (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    return res.json(cachedResponse);
  } else {
    console.log(`Cache miss for ${key}`);
    // Override res.json to store the response in cache
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // For mongoose .lean() results, body is a plain object
      cache.set(key, body, duration || 300);
      originalJson(body);
    };
    next();
  }
};

/**
 * Clear specific cache key
 * @param {string} key 
 */
const clearCache = (key) => {
  cache.del(key);
};

/**
 * Clear all cache
 */
const clearAllCache = () => {
  cache.flushAll();
};

module.exports = { cacheMiddleware, clearCache, clearAllCache };
