const mongoose = require('mongoose');
require('dotenv').config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const db = mongoose.connection.db;
    
    console.log('Checking Courses for bad category references...');
    const badCourses = await db.collection('courses').find({ 
      category: { $not: { $type: 'objectId' }, $ne: null } 
    }).toArray();
    
    console.log(`Found ${badCourses.length} courses with non-ObjectId categories`);
    if (badCourses.length > 0) {
      console.log('Sample bad courses:', JSON.stringify(badCourses.slice(0, 3), null, 2));
    }

    console.log('Checking Blogs for bad category references...');
    const badBlogs = await db.collection('blogs').find({ 
      category: { $not: { $type: 'objectId' }, $ne: null } 
    }).toArray();
    
    console.log(`Found ${badBlogs.length} blogs with non-ObjectId categories`);
    
    console.log('Checking Events for bad category references...');
    const badEvents = await db.collection('events').find({ 
      category: { $not: { $type: 'objectId' }, $ne: null } 
    }).toArray();
    
    console.log(`Found ${badEvents.length} events with non-ObjectId categories`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
