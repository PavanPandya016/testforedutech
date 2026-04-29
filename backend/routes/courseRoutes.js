const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCourses, getCourse, enrollCourse, getMyCourses, getFeaturedCourses } = require('../controllers/courseController');
const { cacheMiddleware } = require('../middleware/cache');

router.get('/', cacheMiddleware(300), getCourses); // 5 mins
router.get('/featured', cacheMiddleware(300), getFeaturedCourses); // 5 mins
router.get('/my/courses', protect, getMyCourses);
router.get('/:id', cacheMiddleware(60), getCourse);
router.post('/:id/enroll', protect, enrollCourse);

module.exports = router;