import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

let connectionPromise: Promise<void> | null = null;
let hasDisconnectHandler = false;

function registerDisconnectHandler(): void {
  if (hasDisconnectHandler) {
    return;
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
  hasDisconnectHandler = true;
}

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    registerDisconnectHandler();
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.mongodbUri, {
        family: 4,
        serverSelectionTimeoutMS: 30000,
      })
      .then(() => {
        registerDisconnectHandler();
        logger.info('MongoDB connected successfully');
      })
      .catch((error) => {
        connectionPromise = null;
        logger.error('MongoDB connection failed', { error });
        throw error;
      });
  }

  await connectionPromise;
}
