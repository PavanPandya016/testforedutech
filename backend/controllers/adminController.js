const asyncHandler = require('../middleware/asyncHandler');
const { 
  User, Course, Event, BlogPost, EventRegistration, 
  Category, Tag, Instructor, CourseApplication, ActivityLog 
} = require('../models');
const { logActivity } = require('../utils/logger');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments();
  const courseCount = await Course.countDocuments();
  const eventCount = await Event.countDocuments();
  const blogCount = await BlogPost.countDocuments();
  const applicationCount = await CourseApplication.countDocuments();
  const categoryCount = await Category.countDocuments();

  // Get some recent activity (e.g., last 5 users)
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName email role createdAt');

  res.json({
    success: true,
    stats: {
      users: userCount,
      courses: courseCount,
      events: eventCount,
      blogs: blogCount,
      instructors: await Instructor.countDocuments(),
      applications: applicationCount,
      categories: categoryCount
    },
    recentUsers,
    recentActivity: await ActivityLog.find()
      .populate('user', 'firstName lastName email role')
      .sort({ timestamp: -1 })
      .limit(10)
  });
});

// @desc    Get public stats (counts only)
// @route   GET /api/admin/public-stats
// @access  Public
exports.getPublicStats = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments();
  const courseCount = await Course.countDocuments();
  const instructorCount = await Instructor.countDocuments();
  const eventCount = await Event.countDocuments();
  const blogCount = await BlogPost.countDocuments();

  res.json({
    success: true,
    stats: {
      users: userCount,
      courses: courseCount,
      instructors: instructorCount,
      events: eventCount,
      blogs: blogCount
    }
  });
});

// ... (keep previous methods like getUsers, updateUser, etc.)

// @desc    Get all course applications
// @route   GET /api/admin/applications
// @access  Private/Admin
exports.getApplications = asyncHandler(async (req, res) => {
  const applications = await CourseApplication.find()
    .populate('user', 'firstName lastName email phoneNumber')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: applications.length,
    data: applications
  });
});

// @desc    Update application status
// @route   PUT /api/admin/applications/:id
// @access  Private/Admin
exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const application = await CourseApplication.findByIdAndUpdate(
    req.params.id, 
    { status }, 
    { new: true, runValidators: true }
  );

  if (!application) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }

  res.json({ success: true, data: application });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  res.json({ success: true, user });
});

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  
  // Log the activity
  await logActivity(req.user.id, 'user_joined', `Created user account: ${user.firstName} ${user.lastName} (Role: ${user.role})`);

  res.status(201).json({ success: true, user });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});

// @desc    Get all entities for admin listing
// @route   GET /api/admin/entities/:type
// @access  Private/Admin
exports.getEntities = asyncHandler(async (req, res) => {
  const { type } = req.params;
  console.log(`[AdminController] Fetching entities of type: ${type}`);
  let data;

  switch (type) {
    case 'courses':
      data = await Course.find().populate('category', 'name').sort({ createdAt: -1 });
      break;
    case 'events':
      data = await Event.find().sort({ startDateTime: -1 });
      break;
    case 'blogs':
      data = await BlogPost.find().populate('author', 'firstName lastName').sort({ createdAt: -1 });
      break;
    case 'categories':
      data = await Category.find().sort({ name: 1 });
      break;
    case 'tags':
      data = await Tag.find().sort({ name: 1 });
      break;
    case 'instructors':
      data = await Instructor.find().sort({ createdAt: -1 });
      break;
    default:
      return res.status(400).json({ success: false, error: 'Invalid entity type' });
  }

  res.json({ success: true, count: data.length, data });
});

// @desc    Get a single entity by type and id
// @route   GET /api/admin/entities/:type/:id
// @access  Private/Admin
exports.getEntityById = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  console.log(`Getting entity: ${type} with ID: ${id}`);
  let model;

  switch (type) {
    case 'courses': model = Course; break;
    case 'events': model = Event; break;
    case 'blogs': model = BlogPost; break;
    case 'categories': model = Category; break;
    case 'tags': model = Tag; break;
    case 'instructors': model = Instructor; break;
    default:
      return res.status(400).json({ success: false, error: 'Invalid entity type' });
  }

  const item = await model.findById(id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Item not found' });
  }

  res.json({ success: true, data: item });
});

// @desc    Delete an entity by type
// @route   DELETE /api/admin/entities/:type/:id
// @access  Private/Admin
exports.deleteEntity = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  let model;

  switch (type) {
    case 'courses': model = Course; break;
    case 'events': model = Event; break;
    case 'blogs': model = BlogPost; break;
    case 'categories': model = Category; break;
    case 'tags': model = Tag; break;
    case 'instructors': model = Instructor; break;
    default:
      return res.status(400).json({ success: false, error: 'Invalid entity type' });
  }

  const item = await model.findById(id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Item not found' });
  }

  await item.deleteOne();
  res.json({ success: true, message: `${type} deleted successfully` });
});

// @desc    Update an entity by type
// @route   PUT /api/admin/entities/:type/:id
// @access  Private/Admin
exports.updateEntity = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  let model;

  switch (type) {
    case 'courses': model = Course; break;
    case 'events': model = Event; break;
    case 'blogs': model = BlogPost; break;
    case 'categories': model = Category; break;
    case 'tags': model = Tag; break;
    case 'instructors': model = Instructor; break;
    default:
      return res.status(400).json({ success: false, error: 'Invalid entity type' });
  }

  const item = await model.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!item) {
    return res.status(404).json({ success: false, error: 'Item not found' });
  }

  res.json({ success: true, data: item });
});

// @desc    Create an entity by type
// @route   POST /api/admin/entities/:type
// @access  Private/Admin
exports.createEntity = asyncHandler(async (req, res) => {
  const { type } = req.params;
  let model;

  switch (type) {
    case 'courses': model = Course; break;
    case 'events': model = Event; break;
    case 'blogs': model = BlogPost; break;
    case 'categories': model = Category; break;
    case 'tags': model = Tag; break;
    case 'instructors': model = Instructor; break;
    default:
      return res.status(400).json({ success: false, error: 'Invalid entity type' });
  }

  const item = await model.create(req.body);

  // Log the activity
  let actionType = '';
  if (type === 'courses') actionType = 'course_added';
  else if (type === 'events') actionType = 'event_added';
  else if (type === 'blogs') actionType = 'blog_added';

  if (actionType) {
    await logActivity(req.user.id, actionType, `Created new ${type.slice(0, -1)}: ${item.title || item.name}`);
  }

  res.status(201).json({ success: true, data: item });
});

// @desc    Get participants for a specific event
// @route   GET /api/admin/events/:id/participants
// @access  Private/Admin
exports.getEventParticipants = asyncHandler(async (req, res) => {
  console.log(`Getting participants for event ID: ${req.params.id} at ${req.originalUrl}`);
  const registrations = await EventRegistration.find({ event: req.params.id })
    .populate('user', 'firstName lastName email phone')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: registrations.length,
    data: registrations
  });
});
