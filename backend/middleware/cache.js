const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const cacheMiddleware = (duration) => (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    res.set('X-Cache', 'HIT');
    // Body is already stringified or Buffer
    return res.send(cachedResponse);
  } else {
    res.set('X-Cache', 'MISS');
    const originalSend = res.send;
    res.send = function (body) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, body, duration);
      }
      return originalSend.call(this, body);
    };
    next();
  }
};

const clearCache = (pattern) => {
  if (!pattern) {
    cache.flushAll();
    return;
  }
  const keys = cache.keys();
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.del(key);
    }
  });
};

module.exports = { cacheMiddleware, clearCache };
