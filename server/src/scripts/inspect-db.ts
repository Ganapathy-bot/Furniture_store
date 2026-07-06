/**
 * Inspect MongoDB Atlas furniture_shop database
 * Run: npm run db:inspect -w server
 */
import { connectDB } from '../config/db';
import { Shop } from '../models/Shop';
import { User } from '../models/User';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

async function inspect(): Promise<void> {
  logger.info('Connecting...', { uri: env.mongodbUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@') });
  await connectDB();

  const dbName = mongoose.connection.db?.databaseName;
  const collections = await mongoose.connection.db?.listCollections().toArray();

  logger.info('Database', { name: dbName });
  logger.info('Collections', { list: collections?.map((c) => c.name) });

  const shopCount = await Shop.countDocuments();
  const userCount = await User.countDocuments();
  logger.info('Document counts', { shop: shopCount, users: userCount });

  const sample = await Shop.findOne().lean();
  if (sample) {
    logger.info('Sample shop document keys', { keys: Object.keys(sample) });
    logger.info('Sample shop document', { sample });
  } else {
    logger.warn('shop collection is empty');
  }

  process.exit(0);
}

inspect().catch((error) => {
  logger.error('Inspect failed', { error });
  process.exit(1);
});