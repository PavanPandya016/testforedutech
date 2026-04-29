process.env.UV_THREADPOOL_SIZE = 128; // Increase thread pool for bcrypt
const cluster = require('cluster');
const os = require('os');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`🚀 Master ${process.pid} is running`);
  console.log(`⚙️ Spawning ${numCPUs} workers...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.warn(`⚠️ Worker ${worker.process.pid} died. Spawning a new one...`);
    cluster.fork();
  });
} else {
  // Workers share the same TCP connection
  const startServer = async () => {
    try {
      // Connect to Database
      await connectDB();

      const server = app.listen(PORT, '0.0.0.0', 1024, () => {
        console.log(`✅ Worker ${process.pid} started on port ${PORT}`);
      });

      // Handle unhandled rejections
      process.on('unhandledRejection', (err) => {
        console.error(`❌ Unhandled Rejection at Worker ${process.pid}:`, err.message);
        // Graceful shutdown
        server.close(() => process.exit(1));
      });

    } catch (err) {
      console.error(`❌ Failed to start worker ${process.pid}:`, err.message);
      process.exit(1);
    }
  };

  startServer();
}