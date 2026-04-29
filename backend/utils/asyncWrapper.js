/**
 * Wrapper for async express routes to avoid try-catch blocks
 * and pass errors to the global error handler.
 */
const asyncWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncWrapper;
