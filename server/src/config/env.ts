import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

const DB_NAME = 'furniture_shop';

function buildMongoUri(): string {
  const directUri = process.env.MONGODB_URI?.trim();
  if (directUri?.startsWith('mongodb+srv://') || directUri?.startsWith('mongodb://')) {
    if (directUri.includes('localhost') || directUri.includes('mongo:')) {
      return directUri;
    }
    if (!directUri.includes(`/${DB_NAME}`)) {
      return directUri.replace(/(\?|$)/, `/${DB_NAME}$1`);
    }
    return directUri;
  }

  const user = process.env.MONGODB_USER?.trim();
  const pass = process.env.MONGODB_PASSWORD?.trim();
  const cluster = process.env.MONGODB_CLUSTER?.trim();

  if (user && pass && cluster) {
    const host = cluster.replace(/^mongodb\+srv:\/\//, '').replace(/\/$/, '');
    return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}/${DB_NAME}?retryWrites=true&w=majority`;
  }

  return optional('MONGODB_URI', `mongodb://localhost:27017/${DB_NAME}`);
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  port: parseInt(optional('PORT', '5000'), 10),
  apiUrl: optional('API_URL', 'http://localhost:5000'),
  clientUrl: optional('CLIENT_URL', 'http://localhost:5173'),
  mongodbUri: buildMongoUri(),
  jwt: {
    accessSecret: optional('JWT_ACCESS_SECRET', 'dev-access-secret-change-in-production-32chars'),
    refreshSecret: optional('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-in-production-32chars'),
    accessExpiry: optional('JWT_ACCESS_EXPIRY', '15m'),
    refreshExpiry: optional('JWT_REFRESH_EXPIRY', '7d'),
  },
  stripe: {
    secretKey: optional('STRIPE_SECRET_KEY', ''),
    webhookSecret: optional('STRIPE_WEBHOOK_SECRET', ''),
  },
  smtp: {
    host: optional('SMTP_HOST', 'localhost'),
    port: parseInt(optional('SMTP_PORT', '1025'), 10),
    user: optional('SMTP_USER', ''),
    pass: optional('SMTP_PASS', ''),
    from: optional('SMTP_FROM', 'noreply@furnistore.local'),
  },
  upload: {
    dir: optional('UPLOAD_DIR', './uploads'),
    maxFileSize: parseInt(optional('MAX_FILE_SIZE', '5242880'), 10),
  },
  isProduction: optional('NODE_ENV', 'development') === 'production',
  autoVerifyEmail: optional('AUTO_VERIFY_EMAIL', 'true') === 'true',
  admin: {
    email: optional('ADMIN_EMAIL', 'admin@furnistore.com'),
    password: optional('ADMIN_PASSWORD', 'Admin@123456'),
    name: optional('ADMIN_NAME', 'Store Admin'),
  },
};

export function validateProductionEnv(): void {
  if (env.isProduction) {
    required('JWT_ACCESS_SECRET');
    required('JWT_REFRESH_SECRET');
    required('MONGODB_URI');
  }
}