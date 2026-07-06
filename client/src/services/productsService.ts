import type { ApiResponse } from '@furnistore/shared';
import { api } from './api';

export interface ClientProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  stock: number;
  description: string;
}

export async function fetchProducts(): Promise<ClientProduct[]> {
  const { data } = await api.get<ApiResponse<ClientProduct[]>>('/products', {
    params: { limit: 50 },
  });
  return data.data || [];
}