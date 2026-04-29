const app = require('./app');
const connectDB = require('./config/db');

// Serverless environments like Vercel don't need app.listen()
// But we need to ensure DB is connected
connectDB().catch(err => console.error('Vercel DB connection failed:', err.message));

module.exports = app;