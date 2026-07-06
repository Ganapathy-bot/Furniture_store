/**
 * Initialize MongoDB Atlas database: furniture_shop
 * Creates all collections, indexes, and seed data.
 *
 * Run: npm run db:init -w server
 */
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { ROLES } from '@furnistore/shared';
import { connectDB } from '../config/db';
import { env } from '../config/env';
import { User } from '../models/User';
import { Shop } from '../models/Shop';
import { Category } from '../models/Category';
import { Order } from '../models/Order';
import { Review } from '../models/Review';
import { Wishlist } from '../models/Wishlist';
import { hashPassword } from '../utils/hash';
import { logger } from '../utils/logger';

const CATEGORIES = [
  { name: 'Chairs', slug: 'chairs', description: 'Accent and lounge chairs' },
  { name: 'Sofas', slug: 'sofas', description: 'Sofas and sleeper chairs' },
  { name: 'Tables', slug: 'tables', description: 'Coffee and dining tables' },
  { name: 'Beds', slug: 'beds', description: 'Beds and bedroom furniture' },
  { name: 'Storage', slug: 'storage', description: 'Shelving and storage units' },
];

async function ensureIndexes(): Promise<void> {
  await Promise.all([
    User.init(),
    Shop.init(),
    Category.init(),
    Order.init(),
    Review.init(),
    Wishlist.init(),
  ]);
  logger.info('Indexes ensured on all collections');
}

async function seedCategories(): Promise<number> {
  let created = 0;
  for (const cat of CATEGORIES) {
    const exists = await Category.findOne({ slug: cat.slug });
    if (!exists) {
      await Category.create(cat);
      created++;
    }
  }
  return created;
}

async function seedShopProducts(): Promise<number> {
  const count = await Shop.countDocuments();
  if (count > 0) {
    logger.info('shop collection already has data', { count });
    return 0;
  }

  const seedPath = path.resolve(__dirname, '../data/products.seed.json');
  const products = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
  await Shop.insertMany(products);
  return products.length;
}

async function seedAdmin(): Promise<boolean> {
  const exists = await User.findOne({ email: env.admin.email });
  if (exists) return false;

  await User.create({
    name: env.admin.name,
    email: env.admin.email,
    passwordHash: await hashPassword(env.admin.password),
    role: ROLES.ADMIN,
    isVerified: true,
    isActive: true,
  });
  return true;
}

async function initDatabase(): Promise<void> {
  const maskedUri = env.mongodbUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
  logger.info('Initializing database...', { uri: maskedUri });

  await connectDB();

  const dbName = mongoose.connection.db?.databaseName;
  if (dbName !== 'furniture_shop') {
    logger.warn('Expected database furniture_shop', { connected: dbName });
  }

  await ensureIndexes();

  const categoriesCreated = await seedCategories();
  const productsCreated = await seedShopProducts();
  const adminCreated = await seedAdmin();

  const collections = await mongoose.connection.db?.listCollections().toArray();
  const counts = {
    users: await User.countDocuments(),
    shop: await Shop.countDocuments(),
    categories: await Category.countDocuments(),
    orders: await Order.countDocuments(),
    reviews: await Review.countDocuments(),
    wishlists: await Wishlist.countDocuments(),
  };

  logger.info('Database initialized successfully', {
    database: dbName,
    collections: collections?.map((c) => c.name).sort(),
    counts,
    seeded: {
      categories: categoriesCreated,
      products: productsCreated,
      admin: adminCreated,
    },
  });

  if (adminCreated) {
    logger.info('Admin credentials', {
      email: env.admin.email,
      password: env.admin.password,
    });
  }

  process.exit(0);
}

initDatabase().catch((error) => {
  logger.error('Database init failed', { error });
  process.exit(1);
});