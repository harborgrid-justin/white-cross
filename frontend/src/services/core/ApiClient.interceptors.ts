/**
 * @fileoverview Interceptor setup and management for API Client
 * @module services/core/ApiClient.interceptors
 * @category Services
 *
 * Provides interceptor creation and configuration for API client:
 * - Request interceptors for authentication and headers
 * - Response interceptors for error handling and retry logic
 * - Token refresh handling
 * - Automatic retry with exponential backoff
 */

import type { AxiosInstance, AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ITokenManager } from './interfaces/ITokenManager';
import { normalizeError } from './ApiClient.errors';
import { logger } from '../utils/logger';
import { HTTP_STATUS } from '../../constants/api';

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

/**
 * Create request interceptor for authentication and security headers
 *
 * Adds:
 * - Authorization header with Bearer token
 * - Security headers for HIPAA compliance
 * - Request ID for tracing
 * - Token validation before use
 *
 * @param tokenManager - Token manager instance
 * @param enableLogging - Enable request logging
 * @returns Interceptor ID for later removal
 */
export function createAuthRequestInterceptor(
  instance: AxiosInstance,
  tokenManager: ITokenManager | undefined,
  enableLogging: boolean
): number {
  return instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from token manager
      const token = tokenManager?.getToken();
      if (token) {
        // Validate token before using it
        if (tokenManager?.isTokenValid()) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
          // Update activity on token use
          tokenManager.updateActivity();
        } else {
          // Token expired, clear it
          logger.warn('ApiClient: Token expired, clearing tokens');
          tokenManager?.clearTokens();
        }
      }

      // Add request ID for tracing
      config.headers = config.headers || {};
      config.headers['X-Request-ID'] = generateRequestId();

      // Ensure security headers are always present
      config.headers['X-Content-Type-Options'] = 'nosniff';
      config.headers['X-Frame-Options'] = 'DENY';
      config.headers['X-XSS-Protection'] = '1; mode=block';

      // Log request in development
      if (enableLogging && process.env.NODE_ENV === 'development') {
        logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
        });
      }

      return config;
    },
    (error) => {
      if (enableLogging && process.env.NODE_ENV === 'development') {
        logger.error('API Request Error', error as Error);
      }
      return Promise.reject(normalizeError(error));
    }
  );
}

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

/**
 * Options for response interceptor
 */
export interface ResponseInterceptorOptions {
  instance: AxiosInstance;
  tokenManager: ITokenManager | undefined;
  enableLogging: boolean;
  enableRetry: boolean;
  maxRetries: number;
  retryDelay: number;
  onAuthFailure: () => void;
  refreshAuthToken: () => Promise<string | null>;
}

/**
 * Create response interceptor for error handling and retry logic
 *
 * Handles:
 * - Token refresh on 401 Unauthorized
 * - Automatic retry with exponential backoff
 * - Error logging
 * - Error normalization
 *
 * @param options - Configuration options
 * @returns Interceptor ID for later removal
 */
export function createAuthResponseInterceptor(options: ResponseInterceptorOptions): number {
  const {
    instance,
    enableLogging,
    enableRetry,
    maxRetries,
    retryDelay,
    onAuthFailure,
    refreshAuthToken,
  } = options;

  return instance.interceptors.response.use(
    (response) => {
      // Log response in development
      if (enableLogging && process.env.NODE_ENV === 'development') {
        logger.debug(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

      // Handle 401 - Token refresh
      // Skip token refresh for auth endpoints (login, register, refresh)
      const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
                             originalRequest.url?.includes('/auth/register') ||
                             originalRequest.url?.includes('/auth/refresh');

      if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry && !isAuthEndpoint) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshAuthToken();
          if (newToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          onAuthFailure();
          return Promise.reject(normalizeError(refreshError));
        }
      }

      // Handle retryable errors
      if (enableRetry && isRetryableError(error) && !originalRequest._retry) {
        const retryCount = originalRequest._retryCount || 0;

        if (retryCount < maxRetries) {
          originalRequest._retryCount = retryCount + 1;

          // Exponential backoff
          const delay = retryDelay * Math.pow(2, retryCount);
          await sleep(delay);

          if (enableLogging && process.env.NODE_ENV === 'development') {
            logger.debug(`API Retry: Attempt ${retryCount + 1}/${maxRetries} for ${originalRequest.url}`);
          }

          return instance(originalRequest);
        }
      }

      // Log error
      if (enableLogging) {
        console.log('[ApiClient Interceptor] Error details:', {
          hasResponse: !!error.response,
          hasConfig: !!error.config,
          errorMessage: error.message,
          errorCode: error.code,
          errorStatus: error.response?.status,
          errorData: error.response?.data,
          fullError: error
        });

        logger.error('API Response Error', error as Error, {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      }

      return Promise.reject(normalizeError(error));
    }
  );
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Check if error is retryable
 *
 * Retryable errors include:
 * - Network errors (no response)
 * - Server errors (5xx)
 * - Rate limiting (429)
 *
 * @param error - Axios error
 * @returns True if error should be retried
 */
export function isRetryableError(error: AxiosError): boolean {
  // Network errors
  if (!error.response) {
    return true;
  }

  // Server errors (5xx)
  const status = error.response.status;
  if (status >= 500 && status < 600) {
    return true;
  }

  // Rate limiting
  if (status === HTTP_STATUS.TOO_MANY_REQUESTS) {
    return true;
  }

  return false;
}

/**
 * Generate unique request ID for tracing
 *
 * @returns Unique request ID string
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sleep for specified milliseconds
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
