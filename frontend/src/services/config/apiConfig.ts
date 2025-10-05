import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import debug from 'debug';
import { API_CONFIG } from '../../constants/config';
import { API_ENDPOINTS, HTTP_STATUS, CONTENT_TYPES, REQUEST_CONFIG, API_CONSTANTS } from '../../constants/api';

const log = debug('whitecross:api-config');

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

// Export API constants for use in other modules
export { API_ENDPOINTS, HTTP_STATUS, CONTENT_TYPES, REQUEST_CONFIG, API_CONSTANTS };

// Export API_CONFIG from constants
export { API_CONFIG } from '../../constants/config';

export default apiInstance;
