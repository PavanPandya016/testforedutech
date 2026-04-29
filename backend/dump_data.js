const mongoose = require('mongoose');
require('dotenv').config();

async function dumpData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const db = mongoose.connection.db;
    
    console.log('--- Sample Courses ---');
    const courses = await db.collection('courses').find({}).limit(3).toArray();
    console.log(JSON.stringify(courses, null, 2));

    console.log('--- Sample Blogs ---');
    const blogs = await db.collection('blogs').find({}).limit(3).toArray();
    console.log(JSON.stringify(blogs, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

dumpData();
