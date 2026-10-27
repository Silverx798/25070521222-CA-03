const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');


let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mythos_atlas';
  
  try {
    // Attempt connecting to the configured URI with a short timeout first if local
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Primary connection failed (${err.message}). Initializing embedded database fallback...`);
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const dataDir = path.resolve(__dirname, '../../.mongo-data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      try {
        memoryServer = await MongoMemoryServer.create({
          instance: {
            port: 27017,
            dbName: 'mythos_atlas',
            dbPath: dataDir
          }
        });
      } catch (portBindErr) {
        console.warn(`[MongoDB] Could not bind fixed port 27017 (${portBindErr.message}). Using dynamic port.`);
        memoryServer = await MongoMemoryServer.create({
          instance: {
            dbName: 'mythos_atlas'
          }
        });
      }

      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri, { dbName: 'mythos_atlas' });
      console.log(`[MongoDB] Connected to embedded in-memory MongoDB at: ${memUri} (db: mythos_atlas)`);


      
      // Auto-trigger seeding in memory mode so data is immediately available
      const { seedDatabase } = require('../seed/seedData');
      await seedDatabase();
      
      return conn;
    } catch (memErr) {
      console.error('[MongoDB] Fatal error initializing embedded database:', memErr.message);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
