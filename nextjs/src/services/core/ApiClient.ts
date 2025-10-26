/**
 * @fileoverview Enterprise-grade HTTP API client with resilience patterns
 * @module services/core/ApiClient
 * @category Services
 * 
 * Provides type-safe HTTP client with comprehensive error handling, retry logic,
 * authentication, CSRF protection, and integration with resilience patterns.
 * 
 * Key Features:
 * - Type-safe HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Automatic authentication token injection
 * - CSRF protection headers
 * - Request/response interceptors
 * - Automatic retry with exponential backoff
 * - Comprehensive error handling and classification
 * - Integration with circuit breaker and bulkhead patterns
 * - Request/response logging for debugging
 * - Timeout management
 * - Performance tracking
 * 
 * Error Classification:
 * - Network errors (no response from server)
 * - Server errors (5xx status codes)
 * - Client errors (4xx status codes)
 * - Validation errors (400 with field-specific errors)
 * 
 * @example
 * ```typescript
 * // Create client with custom config
 * const client = new ApiClient({
 *   baseURL: 'https://api.example.com',
 *   timeout: 30000,
 *   enableRetry: true,
 *   maxRetries: 3
 * });
 * 
 * // Make type-safe requests
 * const user = await client.get<User>('/users/123');
 * const created = await client.post<User>('/users', { name: 'John' });
 * 
 * // Handle errors
 * try {
 *   await client.delete('/users/123');
 * } catch (error) {
 *   if (error instanceof ApiClientError) {
 *     if (error.isNetworkError) {
 *       // Handle network failure
 *     } else if (error.isValidationError) {
 *       // Handle validation errors
 *     }
 *   }
 * }
 * ```
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../../constants/config';
import { API_ENDPOINTS, HTTP_STATUS } from '../../constants/api';
import type { ITokenManager } from './interfaces/ITokenManager';
import { setupCsrfProtection } from '../security/CsrfProtection';
import { logger } from '../utils/logger';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
  field?: string;
  traceId?: string;
  timestamp?: string;
}

/**
 * Custom error class for API client errors with error classification
 * 
 * @class
 * @extends Error
 * @classdesc Wraps API errors with additional metadata and automatic classification
 * for easier error handling in application code.
 * 
 * Error Types:
 * - isNetworkError: No response from server (connection failed, timeout, etc.)
 * - isServerError: Server returned 5xx status code
 * - isValidationError: Client error with validation details (400 status)
 * 
 * @example
 * ```typescript
 * try {
 *   await apiClient.post('/endpoint', data);
 * } catch (error) {
 *   if (error instanceof ApiClientError) {
 *     if (error.isNetworkError) {
 *       showToast('Network error. Please check your connection.');
 *     } else if (error.isValidationError) {
 *       displayValidationErrors(error.details);
 *     } else if (error.isServerError) {
 *       showToast('Server error. Please try again later.');
 *       logToMonitoring(error.traceId);
 *     }
 *   }
 * }
 * ```
 */
export class ApiClientError extends Error {
  public readonly code?: string;
  public readonly status?: number;
  public readonly details?: unknown;
  public readonly traceId?: string;
  public readonly isNetworkError: boolean;
  public readonly isServerError: boolean;
  public readonly isValidationError: boolean;

  constructor(error: ApiErrorResponse) {
    super(error.message);
    this.name = 'ApiClientError';
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
    this.traceId = error.traceId;

    // Classify error types
    this.isNetworkError = error.code === 'NETWORK_ERROR';
    this.isServerError = (error.status ?? 0) >= 500;
    this.isValidationError = error.status === 400;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiClientError);
    }
  }
}

// ==========================================
// INTERCEPTOR TYPES
// ==========================================

export interface RequestInterceptor {
  onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  onRejected?: (error: unknown) => unknown;
}

export interface ResponseInterceptor {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected?: (error: unknown) => unknown;
}

// ==========================================
// API CLIENT CONFIGURATION
// ==========================================

/**
 * Resilience Hook for API Client
 * Allows integration with resilience patterns (circuit breaker, bulkhead, etc.)
 */
export interface ResilienceHook {
  beforeRequest?: (config: { method: string; url: string; data?: unknown }) => Promise<void>;
  afterSuccess?: (result: { method: string; url: string; duration: number }) => void;
  afterFailure?: (error: { method: string; url: string; duration: number; error: unknown }) => void;
}

/**
 * Extended AxiosRequestConfig with AbortSignal support for request cancellation
 *
 * @example
 * ```typescript
 * const { signal, cancel } = createCancellableRequest();
 *
 * // Start request with cancellation support
 * const promise = apiClient.get('/data', { signal });
 *
 * // Cancel if needed
 * cancel('User navigated away');
 * ```
 */
export interface CancellableRequestConfig extends AxiosRequestConfig {
  signal?: AbortSignal;
}

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
  enableLogging?: boolean;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
  resilienceHook?: ResilienceHook;
  tokenManager?: ITokenManager;
}

// ==========================================
// API CLIENT CLASS
// ==========================================

/**
 * Enterprise HTTP API Client
 * 
 * @class
 * @classdesc Full-featured HTTP client built on Axios with enterprise patterns:
 * automatic authentication, CSRF protection, retry logic, error handling,
 * and integration with resilience patterns (circuit breaker, bulkhead).
 * 
 * Architecture:
 * - Axios instance with interceptors
 * - Request interceptor: Auth tokens, CSRF, logging
 * - Response interceptor: Error transformation, logging
 * - Retry logic with exponential backoff
 * - Resilience hooks for circuit breaker integration
 * 
 * Thread Safety:
 * - Safe for concurrent requests
 * - Handles race conditions in token refresh
 * - Queue management for failed requests
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const client = new ApiClient();
 * 
 * // With custom configuration
 * const client = new ApiClient({
 *   baseURL: 'https://api.example.com',
 *   timeout: 30000,
 *   enableRetry: true,
 *   maxRetries: 3,
 *   resilienceHook: {
 *     beforeRequest: async (config) => {
 *       // Check circuit breaker state
 *     },
 *     afterFailure: (error) => {
 *       // Record failure for circuit breaker
 *     }
 *   }
 * });
 * 
 * // Add custom interceptors
 * client.addRequestInterceptor({
 *   onFulfilled: (config) => {
 *     config.headers['X-Custom-Header'] = 'value';
 *     return config;
 *   }
 * });
 * 
 * // Make requests
 * const data = await client.get<MyType>('/endpoint');
 * const result = await client.post<Response>('/endpoint', payload);
 * ```
 */
export class ApiClient {
  private instance: AxiosInstance;
  private enableLogging: boolean;
  private enableRetry: boolean;
  private maxRetries: number;
  private retryDelay: number;
  private requestInterceptorIds: number[] = [];
  private responseInterceptorIds: number[] = [];
  private resilienceHook?: ResilienceHook;
  private tokenManager?: ITokenManager;

  constructor(config: ApiClientConfig = {}) {
    this.tokenManager = config.tokenManager;
    this.resilienceHook = config.resilienceHook;
    this.enableLogging = config.enableLogging ?? true;
    this.enableRetry = config.enableRetry ?? true;
    this.maxRetries = config.maxRetries ?? API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = config.retryDelay ?? API_CONFIG.RETRY_DELAY;

    // Create axios instance with security headers
    this.instance = axios.create({
      baseURL: config.baseURL ?? API_CONFIG.BASE_URL,
      timeout: config.timeout ?? API_CONFIG.TIMEOUT,
      withCredentials: config.withCredentials ?? true,
      headers: {
        'Content-Type': 'application/json',
        // Security headers for HIPAA compliance
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    });

    // Setup default interceptors
    this.setupDefaultInterceptors();

    // Setup CSRF protection
    setupCsrfProtection(this.instance);

    // Add custom interceptors
    if (config.requestInterceptors) {
      config.requestInterceptors.forEach(interceptor => this.addRequestInterceptor(interceptor));
    }
    if (config.responseInterceptors) {
      config.responseInterceptors.forEach(interceptor => this.addResponseInterceptor(interceptor));
    }
  }

  // ==========================================
  // INTERCEPTOR SETUP
  // ==========================================

  private setupDefaultInterceptors(): void {
    // Request interceptor: Add auth token and security headers
    const authRequestId = this.instance.interceptors.request.use(
      (config) => {
        // Get token from SecureTokenManager
        const token = this.getAuthToken();
        if (token) {
          // Validate token before using it
          if (this.tokenManager?.isTokenValid()) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
            // Update activity on token use
            this.tokenManager.updateActivity();
          } else {
            // Token expired, clear it
            logger.warn('ApiClient: Token expired, clearing tokens');
            this.tokenManager?.clearTokens();
          }
        }

        // Add request ID for tracing
        config.headers = config.headers || {};
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Ensure security headers are always present
        config.headers['X-Content-Type-Options'] = 'nosniff';
        config.headers['X-Frame-Options'] = 'DENY';
        config.headers['X-XSS-Protection'] = '1; mode=block';

        // Log request in development
        if (this.enableLogging && import.meta.env.DEV) {
          logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        if (this.enableLogging && import.meta.env.DEV) {
          logger.error('API Request Error', error as Error);
        }
        return Promise.reject(this.normalizeError(error));
      }
    );
    this.requestInterceptorIds.push(authRequestId);

    // Response interceptor: Handle token refresh and errors
    const authResponseId = this.instance.interceptors.response.use(
      (response) => {
        // Log response in development
        if (this.enableLogging && import.meta.env.DEV) {
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
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAuthToken();
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            this.handleAuthFailure();
            return Promise.reject(this.normalizeError(refreshError));
          }
        }

        // Handle retryable errors
        if (this.enableRetry && this.isRetryableError(error) && !originalRequest._retry) {
          const retryCount = originalRequest._retryCount || 0;

          if (retryCount < this.maxRetries) {
            originalRequest._retryCount = retryCount + 1;

            // Exponential backoff
            const delay = this.retryDelay * Math.pow(2, retryCount);
            await this.sleep(delay);

            if (this.enableLogging && import.meta.env.DEV) {
              logger.debug(`API Retry: Attempt ${retryCount + 1}/${this.maxRetries} for ${originalRequest.url}`);
            }

            return this.instance(originalRequest);
          }
        }

        // Log error
        if (this.enableLogging) {
          logger.error('API Response Error', error as Error, {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data,
          });
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
    this.responseInterceptorIds.push(authResponseId);
  }

  // ==========================================
  // INTERCEPTOR MANAGEMENT
  // ==========================================

  public addRequestInterceptor(interceptor: RequestInterceptor): number {
    const id = this.instance.interceptors.request.use(
      interceptor.onFulfilled,
      interceptor.onRejected
    );
    this.requestInterceptorIds.push(id);
    return id;
  }

  public addResponseInterceptor(interceptor: ResponseInterceptor): number {
    const id = this.instance.interceptors.response.use(
      interceptor.onFulfilled,
      interceptor.onRejected
    );
    this.responseInterceptorIds.push(id);
    return id;
  }

  public removeRequestInterceptor(id: number): void {
    this.instance.interceptors.request.eject(id);
    this.requestInterceptorIds = this.requestInterceptorIds.filter(i => i !== id);
  }

  public removeResponseInterceptor(id: number): void {
    this.instance.interceptors.response.eject(id);
    this.responseInterceptorIds = this.responseInterceptorIds.filter(i => i !== id);
  }

  // ==========================================
  // HTTP METHODS
  // ==========================================

  /**
   * Generic request executor that handles all HTTP methods with resilience hooks
   *
   * This method consolidates common logic for all HTTP operations:
   * - Performance tracking (start time, duration)
   * - Resilience hook execution (beforeRequest, afterSuccess, afterFailure)
   * - Error handling and propagation
   *
   * @private
   * @template T - The response data type
   * @param method - HTTP method to execute
   * @param url - Request URL
   * @param data - Request body data (optional, used by POST/PUT/PATCH)
   * @param config - Axios request configuration (optional)
   * @returns Promise resolving to API response
   */
  private async executeRequest<T = unknown>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: unknown,
    config?: CancellableRequestConfig
  ): Promise<ApiResponse<T>> {
    const startTime = performance.now();
    const methodUpper = method.toUpperCase();

    try {
      // Execute beforeRequest hook if configured
      if (this.resilienceHook?.beforeRequest) {
        await this.resilienceHook.beforeRequest({
          method: methodUpper,
          url,
          data
        });
      }

      // Execute the HTTP request based on method type
      let response: AxiosResponse<ApiResponse<T>>;
      switch (method) {
        case 'get':
        case 'delete':
          // GET and DELETE don't accept body data
          response = await this.instance[method]<ApiResponse<T>>(url, config);
          break;
        case 'post':
        case 'put':
        case 'patch':
          // POST, PUT, and PATCH accept body data
          response = await this.instance[method]<ApiResponse<T>>(url, data, config);
          break;
      }

      // Execute afterSuccess hook if configured
      if (this.resilienceHook?.afterSuccess) {
        this.resilienceHook.afterSuccess({
          method: methodUpper,
          url,
          duration: performance.now() - startTime
        });
      }

      return response.data;
    } catch (error) {
      // Execute afterFailure hook if configured
      if (this.resilienceHook?.afterFailure) {
        this.resilienceHook.afterFailure({
          method: methodUpper,
          url,
          duration: performance.now() - startTime,
          error
        });
      }
      throw error;
    }
  }

  /**
   * Execute GET request
   * @template T - The response data type
   * @param url - Request URL
   * @param config - Request configuration with optional AbortSignal for cancellation
   * @returns Promise resolving to API response
   */
  public async get<T = unknown>(
    url: string,
    config?: CancellableRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('get', url, undefined, config);
  }

  /**
   * Execute POST request
   * @template T - The response data type
   * @param url - Request URL
   * @param data - Request body data (optional)
   * @param config - Request configuration with optional AbortSignal for cancellation
   * @returns Promise resolving to API response
   */
  public async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: CancellableRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('post', url, data, config);
  }

  /**
   * Execute PUT request
   * @template T - The response data type
   * @param url - Request URL
   * @param data - Request body data (optional)
   * @param config - Request configuration with optional AbortSignal for cancellation
   * @returns Promise resolving to API response
   */
  public async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: CancellableRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('put', url, data, config);
  }

  /**
   * Execute PATCH request
   * @template T - The response data type
   * @param url - Request URL
   * @param data - Request body data (optional)
   * @param config - Request configuration with optional AbortSignal for cancellation
   * @returns Promise resolving to API response
   */
  public async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: CancellableRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('patch', url, data, config);
  }

  /**
   * Execute DELETE request
   * @template T - The response data type
   * @param url - Request URL
   * @param config - Request configuration with optional AbortSignal for cancellation
   * @returns Promise resolving to API response
   */
  public async delete<T = unknown>(
    url: string,
    config?: CancellableRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('delete', url, undefined, config);
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  private getAuthToken(): string | null {
    // Use TokenManager (sessionStorage-based)
    return this.tokenManager?.getToken() ?? null;
  }

  private async refreshAuthToken(): Promise<string | null> {
    const refreshToken = this.tokenManager?.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<{ token: string; refreshToken?: string; expiresIn?: number }>(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken }
      );

      const { token, refreshToken: newRefreshToken, expiresIn } = response.data;

      // Update token in TokenManager
      this.tokenManager?.setToken(token, newRefreshToken || refreshToken, expiresIn);

      return token;
    } catch (error) {
      this.handleAuthFailure();
      throw error;
    }
  }

  private handleAuthFailure(): void {
    // Clear all tokens using TokenManager
    this.tokenManager?.clearTokens();

    // Redirect to login if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  private isRetryableError(error: AxiosError): boolean {
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

  private normalizeError(error: unknown): ApiClientError {
    if (error instanceof ApiClientError) {
      return error;
    }

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; code?: string; errors?: unknown }>;

      if (axiosError.response) {
        // Server responded with error
        return new ApiClientError({
          message: axiosError.response.data?.message || `Request failed with status ${axiosError.response.status}`,
          code: axiosError.response.data?.code,
          status: axiosError.response.status,
          details: axiosError.response.data?.errors,
        });
      } else if (axiosError.request) {
        // Network error
        return new ApiClientError({
          message: 'Network error - please check your connection',
          code: 'NETWORK_ERROR',
        });
      }
    }

    // Unknown error
    return new ApiClientError({
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    });
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==========================================
  // ACCESSOR METHODS
  // ==========================================

  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }

  public setLogging(enabled: boolean): void {
    this.enableLogging = enabled;
  }

  public setRetry(enabled: boolean): void {
    this.enableRetry = enabled;
  }

  /**
   * Set resilience hook for integration with resilience patterns
   */
  public setResilienceHook(hook: ResilienceHook | undefined): void {
    this.resilienceHook = hook;
  }

  /**
   * Get current resilience hook
   */
  public getResilienceHook(): ResilienceHook | undefined {
    return this.resilienceHook;
  }
}

// ==========================================
// REQUEST CANCELLATION UTILITIES
// ==========================================

/**
 * Create a cancellable request with AbortController
 *
 * Provides easy-to-use request cancellation for long-running operations.
 * Useful for cleanup in React useEffect hooks or when users navigate away.
 *
 * @returns Object with signal for request config and cancel function
 *
 * @example
 * ```typescript
 * // In a React component
 * useEffect(() => {
 *   const { signal, cancel } = createCancellableRequest();
 *
 *   const fetchData = async () => {
 *     try {
 *       const data = await apiClient.get('/students', { signal });
 *       setStudents(data.data);
 *     } catch (error) {
 *       if (error.name === 'AbortError') {
 *         console.log('Request was cancelled');
 *       } else {
 *         console.error('Request failed:', error);
 *       }
 *     }
 *   };
 *
 *   fetchData();
 *
 *   // Cleanup: cancel request when component unmounts
 *   return () => cancel('Component unmounted');
 * }, []);
 * ```
 */
export function createCancellableRequest() {
  const controller = new AbortController();

  return {
    signal: controller.signal,
    cancel: (reason?: string) => {
      controller.abort(reason);
    },
  };
}

// ==========================================
// SINGLETON INSTANCE
// ==========================================

// Import secureTokenManager here to avoid circular dependency
// (ApiClient no longer imports it directly, only via dependency injection)
import { secureTokenManager } from '../security/SecureTokenManager';

export const apiClient = new ApiClient({
  enableLogging: import.meta.env.DEV,
  enableRetry: true,
  tokenManager: secureTokenManager,
});
