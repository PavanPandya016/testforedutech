const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

dotenv.config({ override: true });

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const eventRoutes = require('./routes/eventRoutes');
const blogRoutes = require('./routes/blogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const siteSettingsRoutes = require('./routes/siteSettings');
const instructorRoutes = require('./routes/instructorRoutes');


const app = express();
console.log('>>> EDUTECH BACKEND STARTED: VERSION 2.1 (Enhanced Routing) <<<');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow serving assets across domains
app.use(compression());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://edutech-5psu.vercel.app',
  'https://edutech-5psu.vercel.app/'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve admin panel HTML
app.get('/admin-panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'admin-panel.html'));
});

// File upload route via Cloudinary
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'edutech_uploads' // Customize folder name in Cloudinary
    });
    res.json({ success: true, filepath: result.secure_url });
  } catch (error) {
    console.error('Cloudinary Error:', error);
    res.status(500).json({ error: 'Failed to upload to Cloudinary' });
  }
});

let isConnected = false;

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing. Set it in Vercel Environment Variables.');
}

// Prefer buffering during startup in serverless environment so early requests do not fail.
mongoose.set('bufferCommands', true);

const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  const maxAttempts = 3;
  let attempt = 0;
  let lastError = null;

  while (attempt < maxAttempts && !isConnected) {
    attempt += 1;
    try {
      const db = await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4 // Use IPv4, skip trying IPv6 which can cause SRV errors
      });
      isConnected = db.connections[0].readyState === 1; // 1 = connected
      console.log('✅ MongoDB Atlas connected successfully (attempt', attempt + ')');
      return;
    } catch (err) {
      lastError = err;
      console.error(`❌ MongoDB Atlas connection attempt ${attempt}/${maxAttempts} failed:`, err.message || err);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }

  isConnected = false;
  throw lastError || new Error('Unknown MongoDB connection failure');
};

// Health check endpoint for quick debugging/uptime checks.
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: isConnected ? 'connected' : 'disconnected',
    mongoUri: process.env.MONGODB_URI ? 'set' : 'missing'
  });
});

// Ensure DB is connected before processing each request.
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
    } catch (err) {
      console.error('Database request failed because connection is not ready:', err.message || err);
      return res.status(503).json({ error: 'Database connection not ready. Please retry in a few seconds.', details: err.message || 'connection issue' });
    }
  }
  next();
});

const session = require("express-session");

app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: true,
  })
);
// Admin API
const adminRouter = require('./admin/adminConfig');
app.use('/admin', adminRouter);

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'EduTech API is running !!!!',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      events: '/api/events',
      blog: '/api/blog',
      admin: '/api/admin',
      adminLegacy: '/admin',
      adminPanel: '/admin-panel'
    }
  });
});

// DEBUG ROUTE - REMOVE AFTER VERIFICATION
app.get('/api/debug-data', async (req, res) => {
  const { Course, Event, Category } = require('./models');
  const c = await Course.countDocuments();
  const e = await Event.countDocuments();
  const cat = await Category.countDocuments();
  res.json({ courses: c, events: e, categories: cat, time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', siteSettingsRoutes);
app.use('/api/instructors', instructorRoutes);


// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Handle Mongoose/MongoDB duplicate key errors (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    return res.status(400).json({
      error: `A record with this ${field} "${value}" already exists. Please use a unique value.`
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Only listen when running locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════╗
  ║   Server running on port ${PORT}      ║
  ║   Admin panel: /admin-panel           ║
  ║                                       ║
  ╚═══════════════════════════════════════╝
    `);
  });
}

// Export for serverless (Vercel)
module.exports = app;