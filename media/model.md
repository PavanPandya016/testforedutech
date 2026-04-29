# Backend Data Models & Schemas - EduTech Platform

This document provides a complete dump and explanation of all Mongoose schemas used in the EduTech backend. These models define the data structure, validation rules, and business logic for the platform.

---

## 1. User & Authentication

### User Model (`User.js`)
Handles user profiles, roles, and password hashing.

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  dateOfBirth: Date,
  profilePicture: String,
  role: { type: String, enum: ['student', 'admin', 'instructor'], default: 'student' },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    phone: this.phone,
    role: this.role
  };
};

module.exports = mongoose.model('User', userSchema);
```

---

## 2. Courses & Learning

### Course Model (`Course.js`)
Core entity representing an educational course.

```javascript
const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  excerpt: String,
  thumbnail: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  courseType: { type: String, enum: ['free', 'paid'], default: 'free' },
  price: { type: Number, default: 0, min: 0 },
  accessType: { type: String, enum: ['open', 'enrollment'], default: 'enrollment' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  enrollmentCount: { type: Number, default: 0 },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'all'], default: 'all' }
}, { timestamps: true, toJSON: { virtuals: true } });

courseSchema.virtual('modules', {
  ref: 'CourseModule',
  localField: '_id',
  foreignField: 'course'
});

courseSchema.pre('validate', async function (next) {
  if (this.isModified('title') && !this.slug) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
    while (await Course.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

courseSchema.methods.incrementEnrollment = async function () {
  this.enrollmentCount += 1;
  await this.save();
};

module.exports = mongoose.model('Course', courseSchema, 'courses');
```

### Course Module (`CourseModule.js`) & Materials (`CourseMaterial.js`)
Defines the structure of course content.

```javascript
// Module Schema
const courseModuleSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true, trim: true },
  description: String,
  order: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, toJSON: { virtuals: true } });

courseModuleSchema.virtual('materials', {
  ref: 'CourseMaterial', localField: '_id', foreignField: 'module'
});

// Material Schema
const courseMaterialSchema = new mongoose.Schema({
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseModule', required: true },
  title: { type: String, required: true, trim: true },
  materialType: { type: String, enum: ['video', 'pdf', 'document', 'link'], required: true },
  file: String,
  externalLink: String,
  order: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, default: true },
  isFree: { type: Boolean, default: false }
}, { timestamps: true });
```

### Course Enrollment (`CourseEnrollment.js`)
Tracks student progress.

```javascript
const courseEnrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });
```

---

## 3. Blog & Content

### Blog Post Model (`BlogPost.js`)
Includes auto-slugging, read-time calculation, and SEO excerpt generation.

```javascript
const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, minlength: 5, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true },
    content: { type: String, required: true, minlength: 10 },
    excerpt: { type: String, maxlength: 500, trim: true },
    featuredImage: { type: String, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isFeatured: { type: Boolean, default: false },
    publishedAt: Date,
    viewCount: { type: Number, default: 0, min: 0 },
    readTime: { type: Number, default: 1 },
}, { timestamps: true });

blogPostSchema.pre('save', function (next) {
  if (this.isModified('title')) this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) this.publishedAt = new Date();
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
```

---

## 4. Events & Logistics

### Event Model (`Event.js`)
```javascript
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
}, { timestamps: true });
```

---

## 5. System & Metadata

### Activity Log (`ActivityLog.js`)
Tracks critical actions for audit trails.
```javascript
const ActivityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true, enum: ['user_joined', 'course_added', 'course_enrolled', 'event_added', 'event_registered', 'blog_added', 'application_submitted'] },
  details: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});
```

### Site Settings (`SiteSettings.js`)
Global configuration for the UI.
```javascript
const siteSettingsSchema = new mongoose.Schema({
  heroImages: { type: [String], default: [...] },
  featuredCourseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  ctaImage: { type: String, default: '...' }
}, { timestamps: true });
```
