const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/categoryController');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

router.get('/', cacheMiddleware(300), getCategories);

module.exports = router;
