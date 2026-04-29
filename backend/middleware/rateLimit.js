const rateLimit = require('express-rate-limit');

// Global rate limit: 10000 requests per 15 minutes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes',
    retryAfter: '15m'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limit: 1000 requests per 15 minutes (stricter for brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  message: {
    error: 'Too many login attempts, please try again after 15 minutes',
    retryAfter: '15m'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { globalLimiter, authLimiter };
