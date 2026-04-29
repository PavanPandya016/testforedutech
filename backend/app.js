const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Middlewares
const securityMiddleware = require('./middleware/security');
const { globalLimiter } = require('./middleware/rateLimit');
const { requestTimeout, loadManager } = require('./middleware/timeout');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const eventRoutes = require('./routes/eventRoutes');
const blogRoutes = require('./routes/blogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const siteSettingsRoutes = require('./routes/siteSettings');
const instructorRoutes = require('./routes/instructorRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Basic Middlewares
// Security Layer (includes CORS) - MUST be first
securityMiddleware(app);

app.use(cookieParser());
app.use(compression()); // Gzip compression

// Body parser - Global strict limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Specific larger limit for content-heavy routes
app.use('/api/blog', express.json({ limit: '2mb' }));
app.use('/api/blog', express.urlencoded({ extended: true, limit: '2mb' }));
app.use('/api/courses', express.json({ limit: '1mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Use winston for morgan logging in production
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}


// Load Management & Timeout (Apply early)
app.use(loadManager);
app.use(requestTimeout);

// Global Rate Limiting
app.use('/api', globalLimiter);

// Static folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.get('/health', (req, res) => {
  const mem = process.memoryUsage();
  res.status(200).json({
    status: 'ok',
    uptime: `${Math.floor(process.uptime())}s`,
    memory: {
      rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`
    },
    db: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', siteSettingsRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/upload', uploadRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'EduTech API is optimized and running! 🚀' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Centralized Error Handling (Must be last)
app.use(errorHandler);

module.exports = app;
