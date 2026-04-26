const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCourses, getCourse, enrollCourse, getMyCourses, getFeaturedCourses } = require('../controllers/courseController');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

router.get('/', cacheMiddleware(120), getCourses);
router.get('/featured', cacheMiddleware(300), getFeaturedCourses);
router.get('/my/courses', protect, getMyCourses);
router.get('/:id', cacheMiddleware(60), getCourse);
router.post('/:id/enroll', protect, enrollCourse);

module.exports = router;