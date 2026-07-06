import mongoose from 'mongoose';
import { SHIPPING, ORDER_STATUS, CURRENCY } from '@furnistore/shared';
import { Shop } from '../models/Shop';
import { Order, IOrder, IShippingAddress } from '../models/Order';
import { AppError } from '../middleware/errorHandler';

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export function calculateShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= SHIPPING.FREE_THRESHOLD ? 0 : SHIPPING.FLAT_RATE;
}

export async function buildOrderFromCart(
  userId: string,
  items: CartItemInput[],
  shippingAddress: IShippingAddress
) {
  if (!items.length) {
    throw new AppError(400, 'EMPTY_CART', 'Cart is empty');
  }

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    if (!mongoose.Types.ObjectId.isValid(item.productId)) {
      throw new AppError(400, 'INVALID_PRODUCT', `Invalid product ID: ${item.productId}`);
    }

    const product = await Shop.findById(item.productId);
    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', `Product not found: ${item.productId}`);
    }

    const stock = Number(product.stock ?? 0);
    if (stock < item.quantity) {
      throw new AppError(400, 'INSUFFICIENT_STOCK', `Insufficient stock for ${product.name}`);
    }

    const price = Number(product.price ?? 0);
    subtotal += price * item.quantity;

    orderItems.push({
      productId: product._id,
      name: String(product.name || product.title || 'Product'),
      price,
      quantity: item.quantity,
      image: String(product.image || product.images?.[0] || ''),
    });
  }

  const shippingCost = calculateShipping(subtotal);
  const total = subtotal + shippingCost;

  const order = await Order.create({
    userId,
    items: orderItems,
    shippingAddress,
    subtotal,
    shippingCost,
    total,
    status: ORDER_STATUS.PENDING,
  });

  return order;
}

export async function fulfillOrder(orderId: string, stripeSessionId: string, paymentIntentId?: string) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(404, 'NOT_FOUND', 'Order not found');
  }

  if (order.status === ORDER_STATUS.PAID) {
    return order;
  }

  for (const item of order.items) {
    const product = await Shop.findById(item.productId);
    if (product) {
      const stock = Number(product.stock ?? 0);
      product.stock = Math.max(0, stock - item.quantity);
      await product.save();
    }
  }

  order.status = ORDER_STATUS.PAID;
  order.stripeSessionId = stripeSessionId;
  if (paymentIntentId) {
    order.stripePaymentIntentId = paymentIntentId;
  }
  await order.save();

  return order;
}

export function formatOrder(order: IOrder) {
  return {
    _id: order._id.toString(),
    userId: order.userId.toString(),
    items: order.items.map((item) => ({
      productId: item.productId.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    shippingAddress: order.shippingAddress,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    total: order.total,
    status: order.status,
    currency: CURRENCY,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}