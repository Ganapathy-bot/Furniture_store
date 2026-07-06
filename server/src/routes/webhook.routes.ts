import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as webhookController from '../controllers/webhook.controller';

const router = Router();

router.post('/', asyncHandler(webhookController.handleStripeWebhook));

export default router;