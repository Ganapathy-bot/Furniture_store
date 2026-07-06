import { ROLES } from '@furnistore/shared';
import { connectDB } from '../config/db';
import { env } from '../config/env';
import { User } from '../models/User';
import { hashPassword } from '../utils/hash';
import { logger } from '../utils/logger';

async function seed(): Promise<void> {
  await connectDB();

  const existingAdmin = await User.findOne({ email: env.admin.email });
  if (!existingAdmin) {
    await User.create({
      name: env.admin.name,
      email: env.admin.email,
      passwordHash: await hashPassword(env.admin.password),
      role: ROLES.ADMIN,
      isVerified: true,
      isActive: true,
    });
    logger.info('Admin user created', { email: env.admin.email });
  } else {
    logger.info('Admin user already exists', { email: env.admin.email });
  }

  logger.info('Seed completed');
  process.exit(0);
}

seed().catch((error) => {
  logger.error('Seed failed', { error });
  process.exit(1);
});