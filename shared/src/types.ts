import type { OrderStatus, ReviewStatus, Role } from './constants';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  currency: string;
  images: string[];
  description: string;
  stock: number;
  ratingAvg: number;
  reviewCount: number;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Review {
  _id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  user?: Pick<User, 'name'>;
}