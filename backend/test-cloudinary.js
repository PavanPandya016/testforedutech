const cloudinary = require('cloudinary').v2;
require('dotenv').config({ override: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Testing Ping...');
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error('Ping Error:', error);
    process.exit(1);
  }
  console.log('Ping Result:', result);
  process.exit(0);
});
