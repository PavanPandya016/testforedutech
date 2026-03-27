const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  heroImages: {
    type: [String],
    default: [
      'https://picsum.photos/seed/hero1/500/500',
      'https://picsum.photos/seed/hero2/500/500'
    ]
  },
  featuredCourseIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  ctaImage: {
    type: String,
    default: 'https://picsum.photos/seed/cta/500/500'
  }
}, { timestamps: true });

// Ensure only one settings document exists
siteSettingsSchema.statics.getSingleton = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
