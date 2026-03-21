const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config({ override: true });

async function verify() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log('Connected!');

    const title = 'Unique Slug Test';
    
    console.log(`Cleaning up old test courses for "${title}"...`);
    await Course.deleteMany({ title });

    console.log('Creating first course...');
    const c1 = await Course.create({
      title,
      description: 'First test course',
      courseType: 'free'
    });
    console.log('Course 1 Slug:', c1.slug);

    console.log('Creating second course with SAME title...');
    const c2 = await Course.create({
      title,
      description: 'Second test course',
      courseType: 'free'
    });
    console.log('Course 2 Slug:', c2.slug);

    if (c1.slug === c2.slug) {
      console.error('FAIL: Slugs are identical!');
    } else if (c2.slug.startsWith(c1.slug)) {
      console.log('SUCCESS: Second slug is unique and derived from the first!');
    } else {
      console.log('Slugs are different but not clearly derived:', c1.slug, c2.slug);
    }

    process.exit(0);
  } catch (err) {
    console.error('Verification Error:', err);
    process.exit(1);
  }
}

verify();
