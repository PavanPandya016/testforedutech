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
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// Public routes
router.get('/', cacheMiddleware(60), getBlogPosts);
router.get('/feed', cacheMiddleware(60), getBlogFeed); // combined posts + categories
router.get('/featured', getFeaturedPosts);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/:slug', getBlogPost);

// Protected routes (require authentication)
router.post('/', protect, createBlogPost);
router.put('/:slug', protect, updateBlogPost);
router.delete('/:slug', protect, deleteBlogPost);

module.exports = router;
