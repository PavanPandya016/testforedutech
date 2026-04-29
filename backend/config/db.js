const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  // If we already have a connection and it's active, reuse it
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If a connection is already in progress, return that promise
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing from environment variables');
    process.exit(1);
  }

  const options = {
    maxPoolSize: 50,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    heartbeatFrequencyMS: 10000,
    family: 4, // Force IPv4
    autoIndex: true, // Build indexes
  };

  console.log('🔄 Connecting to MongoDB Atlas with pool size:', options.maxPoolSize);

  cachedConnection = mongoose.connect(process.env.MONGODB_URI, options)
    .then((mongooseInstance) => {
      console.log('✅ MongoDB connected successfully');
      
      // Handle connection errors after initial connection
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB runtime error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
        cachedConnection = null;
      });

      return mongooseInstance;
    })
    .catch((err) => {
      cachedConnection = null;
      console.error('❌ MongoDB connection failed:', err.message);
      // Don't exit process here if we want to allow the app to try again via middleware
      throw err;
    });

  return cachedConnection;
};

module.exports = connectDB;
