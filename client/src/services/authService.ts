import type { ApiResponse, AuthResponse, User } from '@furnistore/shared';
import { api } from './api';

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
    name,
    email,
    password,
  });
  return data.data!;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
    email,
    password,
  });
  return data.data!;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function refreshToken(token: string) {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/refresh', {
    refreshToken: token,
  });
  return data.data!;
}

export async function getMe() {
  const { data } = await api.get<ApiResponse<User>>('/auth/me');
  return data.data!;
}

export async function verifyEmail(token: string) {
  const { data } = await api.post<ApiResponse<{ verified: boolean }>>('/auth/verify-email', {
    token,
  });
  return data;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post<ApiResponse<null>>('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword(token: string, password: string) {
  const { data } = await api.post<ApiResponse<null>>('/auth/reset-password', {
    token,
    password,
  });
  return data;
}