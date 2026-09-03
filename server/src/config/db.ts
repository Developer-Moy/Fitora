import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitora';
    await mongoose.connect(connStr);
    console.log(`[Database] MongoDB Connected to ${mongoose.connection.host}`);
  } catch (error) {
    console.warn('[Database] MongoDB connection warning (will run in offline mode if DB not running):', error);
  }
};
