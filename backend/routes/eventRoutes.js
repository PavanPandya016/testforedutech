const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getEvents, getEvent, registerEvent, getMyEvents, getFeaturedEvents } = require('../controllers/eventController');
const { cacheMiddleware } = require('../middleware/cache');

router.get('/', cacheMiddleware(120), getEvents);
router.get('/featured', cacheMiddleware(120), getFeaturedEvents);
router.get('/my/events', protect, getMyEvents);
router.get('/:id', cacheMiddleware(60), getEvent);
router.post('/:id/register', protect, registerEvent);

module.exports = router;
