const User = require('./User');
const Course = require('./Course');
const CourseModule = require('./CourseModule');
const CourseMaterial = require('./CourseMaterial');
const CourseEnrollment = require('./CourseEnrollment');
const Event = require('./Event');
const EventRegistration = require('./EventRegistration');
const BlogPost = require('./BlogPost');
const { Category, Tag } = require('./CategoryTag');
const Instructor = require('./Instructor');
const CourseApplication = require('./CourseApplication');
const ActivityLog = require('./ActivityLog');

module.exports = {
  User,
  Course,
  CourseModule,
  CourseMaterial,
  CourseEnrollment,
  Event,
  EventRegistration,
  BlogPost,
  Category,
  Tag,
  Instructor,
  CourseApplication,
  ActivityLog
};