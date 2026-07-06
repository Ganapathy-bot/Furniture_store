import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/apiResponse';
import { buildOrderFromCart, formatOrder, fulfillOrder } from '../services/orderService';
import { createCheckoutSession, retrieveCheckoutSession } from '../services/stripeService';
import { ORDER_STATUS } from '@furnistore/shared';
import { sendOrderConfirmationEmail } from '../services/emailService';

export async function createOrder(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthRequest;
  const { items, shippingAddress } = req.body;

  const user = await User.findById(authReq.user!.userId);
  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found');
  }

  const order = await buildOrderFromCart(authReq.user!.userId, items, shippingAddress);

  const session = await createCheckoutSession({
    orderId: order._id.toString(),
    userId: user._id.toString(),
    userEmail: user.email,
    lineItems: order.items.map((item) => ({
      name: item.name,
      amount: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    shippingCost: order.shippingCost,
  });

  order.stripeSessionId = session.id;
  await order.save();

  sendSuccess(res, {
    orderId: order._id.toString(),
    checkoutUrl: session.url,
    order: formatOrder(order),
  }, 201);
}

export async function listOrders(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthRequest;
  const orders = await Order.find({ userId: authReq.user!.userId })
    .sort({ createdAt: -1 })
    .limit(50);

  sendSuccess(res, orders.map(formatOrder));
}

export async function getOrder(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthRequest;
  const order = await Order.findOne({
    _id: req.params.id,
    userId: authReq.user!.userId,
  });

  if (!order) {
    throw new AppError(404, 'NOT_FOUND', 'Order not found');
  }

  sendSuccess(res, formatOrder(order));
}

export async function verifySession(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthRequest;
  const { sessionId } = req.body;

  let order = await Order.findOne({
    stripeSessionId: sessionId,
    userId: authReq.user!.userId,
  });

  if (!order) {
    throw new AppError(404, 'NOT_FOUND', 'Order not found for this session');
  }

  if (order.status === ORDER_STATUS.PENDING) {
    try {
      const session = await retrieveCheckoutSession(sessionId);
      if (session.payment_status === 'paid') {
        order = await fulfillOrder(
          order._id.toString(),
          session.id,
          typeof session.payment_intent === 'string' ? session.payment_intent : undefined
        );
        const user = await User.findById(order.userId);
        if (user) {
          await sendOrderConfirmationEmail(user.email, user.name, order);
        }
      }
    } catch {
      // Stripe verify optional if webhook already handled it
    }
  }

  sendSuccess(res, formatOrder(order));
}