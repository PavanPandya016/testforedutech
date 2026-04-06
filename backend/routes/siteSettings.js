const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/siteSettingsController');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');
const { protect, admin } = require('../middleware/auth');

router.get('/', cacheMiddleware(300), getSettings);
router.put('/', protect, admin, updateSettings);

module.exports = router;
