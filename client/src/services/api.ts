import axios, { InternalAxiosRequestConfig } from 'axios';
import { loadAuthFromStorage } from '../ducks/auth';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(token: string) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const auth = loadAuthFromStorage();
  if (auth?.accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const auth = loadAuthFromStorage();

      if (auth?.refreshToken && !originalRequest.url?.includes('/auth/refresh')) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            refreshQueue.push((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: auth.refreshToken,
          });

          const newAuth = data.data;
          localStorage.setItem('furnistore_auth', JSON.stringify(newAuth));
          processQueue(newAuth.accessToken);
          originalRequest.headers.Authorization = `Bearer ${newAuth.accessToken}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('furnistore_auth');
          window.location.href = '/login';
        } finally {
          isRefreshing = false;
        }
      }
    }

    const message =
      error.response?.data?.error?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);