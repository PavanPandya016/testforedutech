const asyncHandler = require('../middleware/asyncHandler');
const { User, CourseApplication } = require('../models');
const { logActivity } = require('../utils/logger');

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedToken();
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };
  res.status(statusCode).cookie('edutech_token', token, options).json({
    success: true,
    token,
    user: user.getPublicProfile()
  });
};

exports.register = asyncHandler(async (req, res) => {
  const { username, email, password, name, mobile } = req.body;

  // Split name into firstName and lastName if name is provided
  let firstName = '';
  let lastName = '';
  if (name) {
    const nameParts = name.trim().split(/\s+/);
    firstName = nameParts[0];
    lastName = nameParts.slice(1).join(' ');
  }

  // Map mobile to phone
  const phone = mobile;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide username, email and password' });
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'User already exists' });
  }

  const user = await User.create({ 
    username, 
    email, 
    password, 
    firstName, 
    lastName, 
    phone 
  });

  // Log the activity
  await logActivity(user._id, 'user_joined', `New user registered: ${user.firstName} ${user.lastName}`);

  sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide email and password' });
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  if (!user.isActive) {
    return res.status(401).json({ success: false, error: 'Account deactivated' });
  }

  sendTokenResponse(user, 200, res);
});

exports.getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.getPublicProfile() });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['firstName', 'lastName', 'phone', 'address', 'gender', 'dateOfBirth'];
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowed.includes(key)) updates[key] = req.body[key];
  });
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  res.json({ success: true, user: user.getPublicProfile() });
});

exports.logout = asyncHandler(async (req, res) => {
  res.cookie('edutech_token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.json({ success: true, message: 'Logged out' });
});

exports.submitApplication = asyncHandler(async (req, res) => {
  const { courseTitle, fullName, email, phoneNumber, educationLevel, note } = req.body;
  
  if (!courseTitle || !fullName || !email || !phoneNumber || !educationLevel) {
    return res.status(400).json({ success: false, error: 'All primary fields are required' });
  }

  // Check if already applied
  const existingApp = await CourseApplication.findOne({ user: req.user.id, courseTitle });
  if (existingApp) {
    return res.status(400).json({ success: false, error: 'You have already applied for this course' });
  }

  const application = await CourseApplication.create({
    user: req.user.id,
    courseTitle,
    fullName,
    email,
    phoneNumber,
    educationLevel,
    note
  });

  // Log the activity
  await logActivity(req.user.id, 'application_submitted', `Applied for course: ${courseTitle}`);

  res.status(201).json({ success: true, application });
});
