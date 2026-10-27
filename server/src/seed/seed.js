require('dotenv').config();
const { connectDB, disconnectDB } = require('../config/db');
const { seedDatabase } = require('./seedData');

const run = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('[Seed Command] Completed successfully.');
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Command] Failed:', err);
    process.exit(1);
  }
};

run();
