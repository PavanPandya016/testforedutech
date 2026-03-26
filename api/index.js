const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

dotenv.config({ override: true });

const authRoutes = require('../backend/routes/authRoutes');
const courseRoutes = require('../backend/routes/courseRoutes');
const eventRoutes = require('../backend/routes/eventRoutes');
const blogRoutes = require('../backend/routes/blogRoutes');
const categoryRoutes = require('../backend/routes/categoryRoutes');
const adminRoutes = require('../backend/routes/adminRoutes');

const app = express();

// Trust proxy for Vercel
app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

app.use(cors({
  origin: function (origin, callback) {
    if (process.env.FRONTEND_URL === '*') return callback(null, true);
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost:')) return callback(null, true);
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
    ];
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// MongoDB Connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing.');
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected to:', mongoose.connection.db.databaseName);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    isConnected = false;
    throw err;
  }
};

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

// Connect DB for every request
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
    } catch (err) {
      return res.status(503).json({ error: 'Database connection not ready.' });
    }
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: isConnected ? 'connected' : 'disconnected',
    dbName: isConnected ? mongoose.connection.db.databaseName : null
  });
});

// Debug endpoint - REMOVE AFTER USE
app.get('/api/debug', async (req, res) => {
  try {
    const dbName = mongoose.connection.db.databaseName;
    const collections = await mongoose.connection.db.listCollections().toArray();
    const User = require('../backend/models/User');
    const userCount = await User.countDocuments();
    const users = await User.find().select('email role username').lean();
    res.json({
      dbName,
      collections: collections.map(c => c.name),
      userCount,
      users
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// File upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'edutech_uploads' });
    res.json({ success: true, filepath: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload to Cloudinary' });
  }
});

// Admin panel HTML
app.get('/admin-panel', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'backend', 'admin', 'admin-panel.html'));
});

// Admin router
const adminRouter = require('../backend/admin/adminConfig');
app.use('/admin', adminRouter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

// Serve React frontend
const buildPath = path.resolve(process.cwd(), 'backend', 'build');
app.use(express.static(buildPath));

// React catchall - must be last
app.get('*', (req, res) => {
  const indexPath = path.resolve(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'index.html not found', buildPath });
  }
});

// Error handler
app.use((err, req, res, next) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(400).json({ error: `Duplicate ${field}` });
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;