const asyncHandler = require('../middleware/asyncHandler');
const { Course, CourseEnrollment } = require('../models');
const { logActivity } = require('../utils/logger');

exports.getCourses = asyncHandler(async (req, res) => {
  const { search, type, page = 1, limit = 20 } = req.query;
  let query = { isActive: true };
  if (search) query.$text = { $search: search };
  if (type) query.courseType = type;
  const skip = (page - 1) * limit;
  const courses = await Course.find(query).populate('category', 'name slug').skip(skip).limit(parseInt(limit));
  const total = await Course.countDocuments(query);
  res.json({ success: true, courses, total, page: parseInt(page), pages: Math.ceil(total / limit) });
});

exports.getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'modules',
    options: { sort: { order: 1 } },
    populate: { path: 'materials', options: { sort: { order: 1 } } }
  });
  if (!course || !course.isActive) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }
  res.json({ success: true, course });
});

exports.enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course || !course.isActive) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }
  const existing = await CourseEnrollment.findOne({ user: req.user.id, course: req.params.id });
  if (existing) {
    return res.status(400).json({ success: false, error: 'Already enrolled' });
  }
  const enrollment = await CourseEnrollment.create({ user: req.user.id, course: req.params.id });
  await course.incrementEnrollment();

  // Log the activity
  await logActivity(req.user.id, 'course_enrolled', `Enrolled in course: ${course.title}`);

  res.status(201).json({ success: true, enrollment });
});

exports.getMyCourses = asyncHandler(async (req, res) => {
  const enrollments = await CourseEnrollment.find({ user: req.user.id }).populate('course');
  res.json({ success: true, enrollments });
});

exports.getFeaturedCourses = asyncHandler(async (req, res) => {
  let courses = await Course.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);

  // Fallback: If no featured courses, get top 8 most popular by enrollment count
  if (!courses || courses.length === 0) {
    courses = await Course.find({ isActive: true })
      .populate('category', 'name slug')
      .sort({ enrollmentCount: -1, createdAt: -1 })
      .limit(8);
  }

  res.json({ success: true, courses });
});
