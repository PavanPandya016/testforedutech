const asyncHandler = require('../middleware/asyncHandler');
const { Event, EventRegistration } = require('../models');
const { logActivity } = require('../utils/logger');

exports.getEvents = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 20 } = req.query;
  let query = { isActive: true };
  if (type) query.eventType = type;
  const skip = (page - 1) * limit;
  const events = await Event.find(query).sort({ startDateTime: 1 }).skip(skip).limit(parseInt(limit));
  const total = await Event.countDocuments(query);
  res.json({ success: true, events, total, page: parseInt(page), pages: Math.ceil(total / limit) });
});

exports.getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event || !event.isActive) {
    return res.status(404).json({ success: false, error: 'Event not found' });
  }
  res.json({ success: true, event });
});

exports.registerEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event || !event.isActive) {
    return res.status(404).json({ success: false, error: 'Event not found' });
  }
  if (event.isFull) {
    return res.status(400).json({ success: false, error: 'Event is full' });
  }
  const existing = await EventRegistration.findOne({ user: req.user.id, event: req.params.id });
  if (existing) {
    return res.status(400).json({ success: false, error: 'Already registered' });
  }
  const registration = await EventRegistration.create({ user: req.user.id, event: req.params.id });
  await event.incrementRegistration();

  // Log the activity
  await logActivity(req.user.id, 'event_registered', `Registered for event: ${event.title}`);

  res.status(201).json({ success: true, registration });
});

exports.getMyEvents = asyncHandler(async (req, res) => {
  const registrations = await EventRegistration.find({ user: req.user.id }).populate('event');
  res.json({ success: true, registrations });
});

exports.getFeaturedEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ isActive: true, isFeatured: true, startDateTime: { $gte: new Date() } }).limit(6);
  res.json({ success: true, events });
});
