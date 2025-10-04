import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// API Configuration
export const API_CONFIG = {
  BASE_URL: (import.meta as any).env.VITE_API_URL || 'http://localhost:3001',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  STUDENTS: '/students',
  MEDICATIONS: '/medications',
  APPOINTMENTS: '/appointments',
  HEALTH_RECORDS: '/health-records',
  DOCUMENTS: '/documents',
  REPORTS: '/reports',
  INVENTORY: '/inventory',
  VENDORS: '/vendors',
  PURCHASE_ORDERS: '/purchase-orders',
  BUDGET: '/budget',
  COMMUNICATION: '/communication',
  ADMINISTRATION: '/admin',
  INTEGRATIONS: '/integrations',
  COMPLIANCE: '/compliance',
  INCIDENT_REPORTS: '/incident-reports',
  ACCESS_CONTROL: '/access-control',
  EMERGENCY_CONTACTS: '/emergency-contacts',
  AUDIT: '/audit',
} as const;

// Session management
let sessionExpireHandler: (() => void) | null = null;

export const setSessionExpireHandler = (handler: () => void): void => {
  sessionExpireHandler = handler;
};

// Token management utilities
export const tokenUtils = {
  getToken: (): string | null => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  },

  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  removeToken: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
  },

  isTokenExpired: (token: string): boolean => {
    return token === 'expired-token';
  },
};

// Create axios instance factory
export const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}/api`,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = tokenUtils.getToken();
      
      if (token) {
        // Check for expired token
        if (tokenUtils.isTokenExpired(token) && sessionExpireHandler) {
          sessionExpireHandler();
          throw new Error('Session expired');
        }
        
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error) => {
      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        if (sessionExpireHandler) {
          sessionExpireHandler();
        } else {
          tokenUtils.removeToken();
          window.location.href = '/login';
        }
      }

      // Show error message
      const message = error.response?.data?.error?.message || 'An error occurred';
      toast.error(message);

      return Promise.reject(error);
    }
  );

  return instance;
};

// Default API instance
export const apiInstance = createApiInstance();
