const express = require('express');
const router = express.Router();
const {
  getBlogPosts,
  getBlogPost,
  getFeaturedPosts,
  getCategories,
  getTags,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogFeed,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');

// Public routes
router.get('/', cacheMiddleware(180), getBlogPosts);
router.get('/feed', cacheMiddleware(180), getBlogFeed); // combined posts + categories
router.get('/featured', cacheMiddleware(180), getFeaturedPosts);
router.get('/categories', cacheMiddleware(300), getCategories);
router.get('/tags', cacheMiddleware(300), getTags);
router.get('/:slug', cacheMiddleware(180), getBlogPost);

// Protected routes (require authentication)
router.post('/', protect, createBlogPost);
router.put('/:slug', protect, updateBlogPost);
router.delete('/:slug', protect, deleteBlogPost);

module.exports = router;
