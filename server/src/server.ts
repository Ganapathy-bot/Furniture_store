import app from './app';
import { connectDB } from './config/db';
import { env, validateProductionEnv } from './config/env';
import { logger } from './utils/logger';

async function start(): Promise<void> {
  validateProductionEnv();
  await connectDB();

  app.listen(env.port, () => {
    logger.info(`FurniStore API running on port ${env.port}`, {
      env: env.nodeEnv,
      url: env.apiUrl,
    });
  });
}

start().catch((error) => {
  logger.error('Failed to start server', { error });
  process.exit(1);
});