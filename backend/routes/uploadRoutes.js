const express = require('express');
const router = express.Router();
const { single } = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// POST /api/upload
router.post('/', protect, single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  // Validate that the file is actually an image
  if (!req.file.mimetype.startsWith('image/')) {
    const fs = require('fs');
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ success: false, error: 'Only image formats (jpg, png, webp, etc.) are accepted' });
  }

  // Normalize path for Windows and build full URL
  const filePath = req.file.path.replace(/\\/g, '/');
  const fullUrl = `${req.protocol}://${req.get('host')}/${filePath}`;

  res.status(200).json({ success: true, filepath: fullUrl });
});

module.exports = router;
