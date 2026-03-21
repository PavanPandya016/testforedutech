const asyncHandler = require('../middleware/asyncHandler');
const { User, Course, Event, BlogPost } = require('../models');

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
      blogs: blogCount
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
  let data;

  switch (type) {
    case 'courses':
      data = await Course.find().populate('instructor', 'firstName lastName').sort({ createdAt: -1 });
      break;
    case 'events':
      data = await Event.find().sort({ date: -1 });
      break;
    case 'blogs':
      data = await BlogPost.find().populate('author', 'firstName lastName').sort({ createdAt: -1 });
      break;
    default:
      return res.status(400).json({ success: false, error: 'Invalid entity type' });
  }

  res.json({ success: true, count: data.length, data });
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
    default:
      return res.status(400).json({ success: false, error: 'Invalid entity type' });
  }

  const item = await model.findById(id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Item not found' });
  }

  await item.deleteOne();
  res.json({ success: true, message: `${type.slice(0, -1)} deleted successfully` });
});
