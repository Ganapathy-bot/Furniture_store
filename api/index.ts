import app from '../server/src/app';
import { connectDB } from '../server/src/config/db';
import { validateProductionEnv } from '../server/src/config/env';
import { createVercelHandler } from '../server/src/vercelAdapter';

export default createVercelHandler({
  app,
  connectDatabase: connectDB,
  validateEnvironment: validateProductionEnv,
});
