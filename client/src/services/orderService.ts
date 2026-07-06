import type { ApiResponse, Order, ShippingAddress } from '@furnistore/shared';
import { api } from './api';

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderResponse {
  orderId: string;
  checkoutUrl: string;
  order: Order;
}

export async function createOrder(items: CartItemInput[], shippingAddress: ShippingAddress) {
  const { data } = await api.post<ApiResponse<CreateOrderResponse>>('/orders', {
    items,
    shippingAddress,
  });
  return data.data!;
}

export async function fetchOrders() {
  const { data } = await api.get<ApiResponse<Order[]>>('/orders');
  return data.data || [];
}

export async function fetchOrder(id: string) {
  const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  return data.data!;
}

export async function verifyCheckoutSession(sessionId: string) {
  const { data } = await api.post<ApiResponse<Order>>('/orders/verify-session', { sessionId });
  return data.data!;
}