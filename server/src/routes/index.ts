import { Router } from 'express';
import { API_VERSION } from '@furnistore/shared';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import productsRoutes from './products.routes';
import orderRoutes from './order.routes';

const router = Router();

router.use(`/api/${API_VERSION}/health`, healthRoutes);
router.use(`/api/${API_VERSION}/auth`, authRoutes);
router.use(`/api/${API_VERSION}/products`, productsRoutes);
router.use(`/api/${API_VERSION}/orders`, orderRoutes);
router.use(`/api/${API_VERSION}/admin`, adminRoutes);

export default router;