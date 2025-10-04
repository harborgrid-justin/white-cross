import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import debug from 'debug';

const log = debug('whitecross:api-config');

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  STUDENTS: {
    BASE: '/students',
    BY_ID: (id: string) => `/students/${id}`,
    ASSIGNED: '/students/assigned',
    SEARCH: '/students/search',
  },
  HEALTH_RECORDS: {
    BASE: '/health-records',
    STUDENT: (studentId: string) => `/health-records/student/${studentId}`,
    ALLERGIES: (studentId: string) => `/health-records/student/${studentId}/allergies`,
    CHRONIC_CONDITIONS: (studentId: string) => `/health-records/student/${studentId}/chronic-conditions`,
    VACCINATIONS: (studentId: string) => `/health-records/student/${studentId}/vaccinations`,
    GROWTH_CHART: (studentId: string) => `/health-records/student/${studentId}/growth-chart`,
    VITALS: (studentId: string) => `/health-records/student/${studentId}/vitals`,
  },
  MEDICATIONS: {
    BASE: '/medications',
    INVENTORY: '/medications/inventory',
    SCHEDULE: '/medications/schedule',
    REMINDERS: '/medications/reminders',
    STUDENT: (studentId: string) => `/medications/student/${studentId}`,
    ADMINISTER: (id: string) => `/medications/${id}/administer`,
  },
  APPOINTMENTS: {
    BASE: '/appointments',
    UPCOMING: '/appointments/upcoming',
    TODAY: '/appointments/today',
  },
  COMMUNICATION: {
    BASE: '/communication',
    MESSAGES: '/communication/messages',
    NOTIFICATIONS: '/communication/notifications',
  },
  DOCUMENTS: {
    BASE: '/documents',
    UPLOAD: '/documents/upload',
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
  },
  REPORTS: {
    BASE: '/reports',
    GENERATE: '/reports/generate',
    EXPORT: (id: string) => `/reports/${id}/export`,
  },
  ADMIN: {
    BASE: '/admin',
    SETTINGS: '/admin/settings',
    USERS: '/admin/users',
    INTEGRATIONS: '/admin/integrations',
  },
} as const;

// Create axios instance
export const apiInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for auth tokens
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem('auth_token', token);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Utility functions
export const tokenUtils = {
  getToken: () => localStorage.getItem('auth_token'),
  setToken: (token: string) => localStorage.setItem('auth_token', token),
  removeToken: () => localStorage.removeItem('auth_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  setRefreshToken: (token: string) => localStorage.setItem('refresh_token', token),
  removeRefreshToken: () => localStorage.removeItem('refresh_token'),
  clearAll: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },
};

export default apiInstance;
