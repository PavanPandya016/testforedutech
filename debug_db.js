const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Locate .env in backend directory
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const { Course, Event, Category, User } = require('./backend/models');

async function checkDB() {
  try {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is missing!');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const courses = await Course.find();
    console.log(`Total Courses: ${courses.length}`);
    console.log(`Active Courses: ${courses.filter(c => c.isActive).length}`);
    
    const users = await User.find();
    console.log(`Total Users: ${users.length}`);

    const Instructor = require('./backend/models/Instructor');
    const instructors = await Instructor.find();
    console.log(`Total Instructors: ${instructors.length}`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDB();
