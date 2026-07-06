import { Request, Response } from 'express';
import Stripe from 'stripe';
import { constructWebhookEvent } from '../services/stripeService';
import { fulfillOrder } from '../services/orderService';
import { sendOrderConfirmationEmail } from '../services/emailService';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { sendSuccess } from '../utils/apiResponse';

export async function handleStripeWebhook(req: Request, res: Response): Promise<void> {
  const signature = req.headers['stripe-signature'];

  if (!signature || typeof signature !== 'string') {
    res.status(400).json({ error: 'Missing stripe-signature header' });
    return;
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(req.body as Buffer, signature);
  } catch (error) {
    logger.error('Stripe webhook signature verification failed', { error });
    res.status(400).json({ error: 'Invalid signature' });
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId && session.payment_status === 'paid') {
      try {
        const order = await fulfillOrder(
          orderId,
          session.id,
          typeof session.payment_intent === 'string' ? session.payment_intent : undefined
        );

        const user = await User.findById(order.userId);
        if (user) {
          await sendOrderConfirmationEmail(user.email, user.name, order);
        }

        logger.info('Order paid via Stripe webhook', { orderId, sessionId: session.id });
      } catch (error) {
        logger.error('Failed to fulfill order from webhook', { orderId, error });
      }
    }
  }

  sendSuccess(res, { received: true });
}