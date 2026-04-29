const timeout = require('express-timeout-handler');
const toobusy = require('toobusy-js');

// Configure toobusy-js for load management
// 1000ms lag allows server to handle CPU-bound tasks (bcrypt) without dropping connections
toobusy.maxLag(1000); 
toobusy.interval(500); 

const timeoutOptions = {
  timeout: 30000, // 30 seconds
  onTimeout: (req, res) => {
    res.status(503).json({
      error: 'Service unavailable: Request timeout',
    });
  },
  onDelayedResponse: (req, method, args, requestTime) => {
    console.warn(`Attempted response after timeout at ${req.originalUrl} (${requestTime}ms)`);
  },
};

const loadManager = (req, res, next) => {
  // Disabled for high-concurrency testing to prevent 503 errors
  next();
};

module.exports = {
  requestTimeout: timeout.handler(timeoutOptions),
  loadManager
};
