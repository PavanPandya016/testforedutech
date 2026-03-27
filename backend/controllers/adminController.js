const asyncHandler = require('../middleware/asyncHandler');
const { User, Course, Event, BlogPost, EventRegistration, Category, Tag, Instructor } = require('../models');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments();
  const courseCount = await Course.countDocuments();
  const eventCount = await Event.countDocuments();
  const blogCount = await BlogPost.countDocuments();

  // Get some recent activity (e.g., last 5 users)
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName email role createdAt');

  res.json({
    success: true,
    stats: {
      users: userCount,
      courses: courseCount,
      events: eventCount,
      blogs: blogCount,
      instructors: await Instructor.countDocuments()
    },
    recentUsers
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
});

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();
  res.json({ success: true, user });
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
