import Stripe from 'stripe';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import { CURRENCY } from '@furnistore/shared';

let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!env.stripe.secretKey) {
    throw new AppError(
      503,
      'STRIPE_NOT_CONFIGURED',
      'Stripe is not configured. Set STRIPE_SECRET_KEY in .env'
    );
  }
  if (!stripe) {
    stripe = new Stripe(env.stripe.secretKey);
  }
  return stripe;
}

export interface CheckoutLineItem {
  name: string;
  amount: number;
  quantity: number;
  image?: string;
}

export async function createCheckoutSession(params: {
  orderId: string;
  userId: string;
  userEmail: string;
  lineItems: CheckoutLineItem[];
  shippingCost: number;
}): Promise<Stripe.Checkout.Session> {
  const client = getStripe();

  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = params.lineItems.map(
    (item) => ({
      price_data: {
        currency: CURRENCY.toLowerCase(),
        product_data: {
          name: item.name,
          images: item.image?.startsWith('http') ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.amount * 100),
      },
      quantity: item.quantity,
    })
  );

  if (params.shippingCost > 0) {
    stripeLineItems.push({
      price_data: {
        currency: CURRENCY.toLowerCase(),
        product_data: { name: 'Shipping' },
        unit_amount: Math.round(params.shippingCost * 100),
      },
      quantity: 1,
    });
  }

  const session = await client.checkout.sessions.create({
    mode: 'payment',
    customer_email: params.userEmail,
    line_items: stripeLineItems,
    success_url: `${env.clientUrl}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.clientUrl}/checkout`,
    metadata: {
      orderId: params.orderId,
      userId: params.userId,
    },
  });

  return session;
}

export async function retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  const client = getStripe();
  return client.checkout.sessions.retrieve(sessionId);
}

export function constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
  const client = getStripe();

  if (!env.stripe.webhookSecret) {
    throw new AppError(
      503,
      'WEBHOOK_NOT_CONFIGURED',
      'Stripe webhook secret not configured. Set STRIPE_WEBHOOK_SECRET in .env'
    );
  }

  return client.webhooks.constructEvent(payload, signature, env.stripe.webhookSecret);
}