import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { env } from './config/env';
import routes from './routes';
import webhookRoutes from './routes/webhook.routes';
import { errorHandler } from './middleware/errorHandler';
import { sendSuccess } from './utils/apiResponse';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: env.isProduction
      ? env.clientUrl
      : [env.clientUrl, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'],
    credentials: true,
  })
);
app.use(compression());
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

app.use(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  webhookRoutes
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.isProduction ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests' } },
  })
);

app.use('/uploads', express.static(path.resolve(env.upload.dir)));

app.get('/', (_req, res) => {
  sendSuccess(res, {
    name: 'FurniStore API',
    version: '1.0.0',
    docs: `/api/v1/health`,
  });
});

app.use(routes);

app.use(errorHandler);

export default app;