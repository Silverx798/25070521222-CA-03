require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`[Mythos Atlas Server] Listening on http://localhost:${PORT}`);
      console.log(`[Mythos Atlas Server] Health check available at http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('[Mythos Atlas Server] Fatal startup error:', err);
    process.exit(1);
  }
};

startServer();
