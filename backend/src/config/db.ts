import mongoose from 'mongoose';
import { ENV } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);
    // Disable Mongoose command buffering so queries fail fast instead of hanging 10s when DB is offline
    mongoose.set('bufferCommands', false);
    await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.warn('MongoDB connection offline. Operating in resilient development mode.', error);
  }
}
