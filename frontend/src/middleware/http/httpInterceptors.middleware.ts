/**
 * HTTP Interceptors Middleware
 * 
 * Enterprise HTTP middleware for request/response interception, authentication,
 * error handling, and request monitoring.
 * 
 * @module httpInterceptors.middleware
 */

import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Middleware } from '@reduxjs/toolkit';

/**
 * Request interceptor interface
 */
export interface RequestInterceptor {
  onFulfilled?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  onRejected?: (error: unknown) => unknown;
}

/**
 * Response interceptor interface
 */
export interface ResponseInterceptor {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected?: (error: unknown) => unknown;
}

/**
 * HTTP error response interface
 */
export interface HttpErrorResponse {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
  field?: string;
  traceId?: string;
  timestamp?: string;
}

/**
 * Enhanced HTTP error class
 */
export class HttpError extends Error {
  public readonly code?: string;
  public readonly status?: number;
  public readonly details?: unknown;
  public readonly traceId?: string;
  public readonly isNetworkError: boolean;
  public readonly isServerError: boolean;
  public readonly isValidationError: boolean;
  public readonly isAuthError: boolean;

  constructor(error: HttpErrorResponse) {
    super(error.message);
    this.name = 'HttpError';
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
    this.traceId = error.traceId;

    // Classify error types
    this.isNetworkError = error.code === 'NETWORK_ERROR' || !error.status;
    this.isServerError = (error.status ?? 0) >= 500;
    this.isValidationError = error.status === 400;
    this.isAuthError = error.status === 401 || error.status === 403;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }
}

/**
 * Authentication request interceptor
 * Automatically adds authentication tokens to requests
 */
export const createAuthRequestInterceptor = (): RequestInterceptor => ({
  onFulfilled: (config: InternalAxiosRequestConfig) => {
    // Get token from storage
    const authStorage = localStorage.getItem('auth-storage');
    let token = null;

    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.token;
      } catch (e) {
        console.error('Failed to parse auth storage:', e);
      }
    }

    // Fallback to direct token storage
    if (!token) {
      token = localStorage.getItem('auth_token');
    }

    // Add token to headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for monitoring
    if (config.headers) {
      config.headers['X-Request-Timestamp'] = new Date().toISOString();
    }

    return config;
  },
  onRejected: (error: unknown) => Promise.reject(error),
});

/**
 * Response error interceptor
 * Handles common HTTP errors and transforms them to standard format
 */
export const createErrorResponseInterceptor = (): ResponseInterceptor => ({
  onFulfilled: (response: AxiosResponse) => {
    // Add response time header for monitoring
    if (response.config.headers?.['X-Request-Timestamp']) {
      const requestTime = new Date(response.config.headers['X-Request-Timestamp']).getTime();
      const responseTime = Date.now() - requestTime;
      response.headers['X-Response-Time'] = responseTime.toString();
    }

    return response;
  },
  onRejected: (error: AxiosError) => {
    const httpError: HttpErrorResponse = {
      message: 'An error occurred',
      status: error.response?.status,
      traceId: error.response?.headers?.['x-trace-id'],
      timestamp: new Date().toISOString(),
    };

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      httpError.status = error.response.status;
      httpError.message = (error.response.data as any)?.message || error.message;
      httpError.details = error.response.data;

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          httpError.message = 'Authentication required';
          httpError.code = 'UNAUTHORIZED';
          // Clear auth token on 401
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth-storage');
          break;
        case 403:
          httpError.message = 'Access denied';
          httpError.code = 'FORBIDDEN';
          break;
        case 404:
          httpError.message = 'Resource not found';
          httpError.code = 'NOT_FOUND';
          break;
        case 422:
          httpError.message = 'Validation failed';
          httpError.code = 'VALIDATION_ERROR';
          break;
        case 429:
          httpError.message = 'Too many requests';
          httpError.code = 'RATE_LIMITED';
          break;
        case 500:
          httpError.message = 'Internal server error';
          httpError.code = 'SERVER_ERROR';
          break;
        case 503:
          httpError.message = 'Service unavailable';
          httpError.code = 'SERVICE_UNAVAILABLE';
          break;
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      httpError.message = 'Network error - please check your connection';
      httpError.code = 'NETWORK_ERROR';
    } else {
      // Request setup error
      httpError.message = error.message || 'Request configuration error';
      httpError.code = 'REQUEST_ERROR';
    }

    return Promise.reject(new HttpError(httpError));
  },
});

/**
 * Request logging interceptor for monitoring
 */
export const createLoggingInterceptor = (): {
  request: RequestInterceptor;
  response: ResponseInterceptor;
} => ({
  request: {
    onFulfilled: (config: InternalAxiosRequestConfig) => {
      console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
      return config;
    },
    onRejected: (error: unknown) => {
      console.error('[HTTP] Request Error:', error);
      return Promise.reject(error);
    },
  },
  response: {
    onFulfilled: (response: AxiosResponse) => {
      const responseTime = response.headers['X-Response-Time'];
      console.log(`[HTTP] ${response.status} ${response.config.url}`, {
        responseTime: responseTime ? `${responseTime}ms` : 'unknown',
        data: response.data,
      });
      return response;
    },
    onRejected: (error: unknown) => {
      console.error('[HTTP] Response Error:', error);
      return Promise.reject(error);
    },
  },
});

/**
 * CSRF protection interceptor
 */
export const createCSRFInterceptor = (): RequestInterceptor => ({
  onFulfilled: (config: InternalAxiosRequestConfig) => {
    // Add CSRF token for state-changing operations
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken && config.headers) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  onRejected: (error: unknown) => Promise.reject(error),
});

/**
 * Request retry interceptor with exponential backoff
 */
export const createRetryInterceptor = (
  maxRetries: number = 3,
  baseDelay: number = 1000
): ResponseInterceptor => ({
  onFulfilled: (response: AxiosResponse) => response,
  onRejected: async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };
    
    // Don't retry on client errors (4xx)
    if (error.response?.status && error.response.status >= 400 && error.response.status < 500) {
      return Promise.reject(error);
    }

    // Initialize retry count
    config._retryCount = config._retryCount || 0;

    // Check if we should retry
    if (config._retryCount < maxRetries) {
      config._retryCount += 1;

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, config._retryCount - 1);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));

      // Retry the request
      return axios(config);
    }

    return Promise.reject(error);
  },
});

/**
 * HTTP middleware factory for creating configured axios instances
 */
export function createHttpMiddleware(baseURL: string, options: {
  timeout?: number;
  enableAuth?: boolean;
  enableRetry?: boolean;
  enableLogging?: boolean;
  enableCSRF?: boolean;
  maxRetries?: number;
  retryDelay?: number;
} = {}) {
  const instance = axios.create({
    baseURL,
    timeout: options.timeout || 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // Add request interceptors
  if (options.enableAuth !== false) {
    const authInterceptor = createAuthRequestInterceptor();
    instance.interceptors.request.use(
      authInterceptor.onFulfilled,
      authInterceptor.onRejected
    );
  }

  if (options.enableCSRF) {
    const csrfInterceptor = createCSRFInterceptor();
    instance.interceptors.request.use(
      csrfInterceptor.onFulfilled,
      csrfInterceptor.onRejected
    );
  }

  if (options.enableLogging) {
    const loggingInterceptor = createLoggingInterceptor();
    instance.interceptors.request.use(
      loggingInterceptor.request.onFulfilled,
      loggingInterceptor.request.onRejected
    );
  }

  // Add response interceptors
  const errorInterceptor = createErrorResponseInterceptor();
  instance.interceptors.response.use(
    errorInterceptor.onFulfilled,
    errorInterceptor.onRejected
  );

  if (options.enableRetry) {
    const retryInterceptor = createRetryInterceptor(
      options.maxRetries,
      options.retryDelay
    );
    instance.interceptors.response.use(
      retryInterceptor.onFulfilled,
      retryInterceptor.onRejected
    );
  }

  if (options.enableLogging) {
    const loggingInterceptor = createLoggingInterceptor();
    instance.interceptors.response.use(
      loggingInterceptor.response.onFulfilled,
      loggingInterceptor.response.onRejected
    );
  }

  return instance;
}

/**
 * Redux middleware for HTTP request/response monitoring
 */
export const createHttpMonitoringMiddleware = (): Middleware => {
  const requestStats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
  };

  return (_store) => (next) => (action: any) => {
    // Monitor HTTP-related Redux actions
    if (action.type && typeof action.type === 'string') {
      if (action.type.endsWith('/pending')) {
        requestStats.totalRequests += 1;
      } else if (action.type.endsWith('/fulfilled')) {
        requestStats.successfulRequests += 1;
      } else if (action.type.endsWith('/rejected')) {
        requestStats.failedRequests += 1;
      }
    }

    return next(action);
  };
};

/**
 * HTTP utilities for common operations
 */
export const httpUtils = {
  /**
   * Check if error is a specific HTTP error type
   */
  isHttpError: (error: unknown): error is HttpError => {
    return error instanceof HttpError;
  },

  /**
   * Check if error is a network error
   */
  isNetworkError: (error: unknown): boolean => {
    return httpUtils.isHttpError(error) && error.isNetworkError;
  },

  /**
   * Check if error is an authentication error
   */
  isAuthError: (error: unknown): boolean => {
    return httpUtils.isHttpError(error) && error.isAuthError;
  },

  /**
   * Check if error is a validation error
   */
  isValidationError: (error: unknown): boolean => {
    return httpUtils.isHttpError(error) && error.isValidationError;
  },

  /**
   * Extract error message from various error types
   */
  getErrorMessage: (error: unknown): string => {
    if (httpUtils.isHttpError(error)) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  },
};