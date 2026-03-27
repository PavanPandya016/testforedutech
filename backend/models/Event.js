const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  eventType: { type: String, enum: ['seminar', 'webinar', 'workshop', 'conference', 'other'], default: 'webinar' },
  thumbnail: String,
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  meetingLink: String,
  address: { type: String, trim: true },
  maxParticipants: Number,
  registrationCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true } });

eventSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  next();
});

eventSchema.virtual('isFull').get(function() {
  return this.maxParticipants && this.registrationCount >= this.maxParticipants;
});

eventSchema.methods.incrementRegistration = async function() {
  this.registrationCount += 1;
  await this.save();
};

module.exports = mongoose.model('Event', eventSchema, 'events');
