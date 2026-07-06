import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { createOrderSchema, verifySessionSchema } from '../validators/order.validator';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.use(authenticate);

router.post('/', validate(createOrderSchema), asyncHandler(orderController.createOrder));
router.get('/', asyncHandler(orderController.listOrders));
router.post('/verify-session', validate(verifySessionSchema), asyncHandler(orderController.verifySession));
router.get('/:id', asyncHandler(orderController.getOrder));

export default router;