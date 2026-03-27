const { Instructor } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all instructors
// @route   GET /api/instructors
// @access  Public
exports.getInstructors = asyncHandler(async (req, res) => {
  const instructors = await Instructor.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: instructors.length,
    data: instructors
  });
});
