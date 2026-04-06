const SiteSettings = require('../models/SiteSettings');
const { clearAllCache } = require('../middleware/cacheMiddleware');

exports.getSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne().lean() || await SiteSettings.create({});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    
    // Create a copy of the request body and remove _id if it exists
    const updateData = { ...req.body };
    delete updateData._id;

    if (!settings) {
      settings = new SiteSettings(updateData);
    } else {
      Object.assign(settings, updateData);
    }
    await settings.save();
    clearAllCache(); // Clear all cache when settings change to be safe
    res.json(settings.toObject());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
