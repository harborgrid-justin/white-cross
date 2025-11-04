/**
 * @fileoverview Type definitions for API Client
 * @module services/core/ApiClient.types
 * @category Services
 *
 * Provides comprehensive type definitions for API client operations including:
 * - Request/response types with generic support
 * - Configuration interfaces for client setup
 * - Interceptor types for request/response transformation
 * - Resilience hook types for circuit breaker integration
 * - Cancellation support via AbortSignal
 */

import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// ==========================================
// RESPONSE TYPES
// ==========================================

/**
 * Standard API response wrapper
 *
 * @template T - The type of data contained in the response
 * @example
 * ```typescript
 * const response: ApiResponse<User> = {
 *   success: true,
 *   data: { id: 1, name: 'John' }
 * };
 * ```
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Paginated response wrapper for list endpoints
 *
 * @template T - The type of items in the paginated list
 * @example
 * ```typescript
 * const response: PaginatedResponse<Student> = {
 *   data: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
 *   pagination: {
 *     page: 1,
 *     limit: 20,
 *     total: 100,
 *     totalPages: 5,
 *     hasNext: true,
 *     hasPrev: false
 *   }
 * };
 * ```
 */
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

/**
 * API error response structure
 *
 * Provides detailed error information from the server including:
 * - Human-readable error message
 * - Machine-readable error code
 * - HTTP status code
 * - Additional error details (e.g., validation errors)
 * - Tracing information for debugging
 */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
  field?: string;
  traceId?: string;
  timestamp?: string;
}

// ==========================================
// INTERCEPTOR TYPES
// ==========================================

/**
 * Request interceptor configuration
 *
 * Allows transformation and validation of requests before they are sent.
 * Useful for adding headers, logging, authentication, etc.
 *
 * @example
 * ```typescript
 * const requestInterceptor: RequestInterceptor = {
 *   onFulfilled: (config) => {
 *     config.headers['X-Custom-Header'] = 'value';
 *     return config;
 *   },
 *   onRejected: (error) => {
 *     logger.error('Request setup failed', error);
 *     return Promise.reject(error);
 *   }
 * };
 * ```
 */
export interface RequestInterceptor {
  onFulfilled?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  onRejected?: (error: unknown) => unknown;
}

/**
 * Response interceptor configuration
 *
 * Allows transformation and validation of responses before they reach application code.
 * Useful for error handling, data transformation, caching, etc.
 *
 * @example
 * ```typescript
 * const responseInterceptor: ResponseInterceptor = {
 *   onFulfilled: (response) => {
 *     // Transform response data
 *     response.data = transformData(response.data);
 *     return response;
 *   },
 *   onRejected: (error) => {
 *     // Handle error globally
 *     if (error.status === 401) {
 *       redirectToLogin();
 *     }
 *     return Promise.reject(error);
 *   }
 * };
 * ```
 */
export interface ResponseInterceptor {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected?: (error: unknown) => unknown;
}

// ==========================================
// RESILIENCE TYPES
// ==========================================

/**
 * Resilience Hook for API Client
 *
 * Provides integration points for resilience patterns such as:
 * - Circuit breaker (fail fast when service is down)
 * - Bulkhead (limit concurrent requests)
 * - Rate limiting (throttle requests)
 * - Performance monitoring
 *
 * @example
 * ```typescript
 * const resilienceHook: ResilienceHook = {
 *   beforeRequest: async (config) => {
 *     // Check circuit breaker state
 *     if (circuitBreaker.isOpen()) {
 *       throw new Error('Circuit breaker is open');
 *     }
 *     // Acquire bulkhead permit
 *     await bulkhead.acquire();
 *   },
 *   afterSuccess: (result) => {
 *     // Record success for circuit breaker
 *     circuitBreaker.recordSuccess();
 *     // Release bulkhead permit
 *     bulkhead.release();
 *   },
 *   afterFailure: (error) => {
 *     // Record failure for circuit breaker
 *     circuitBreaker.recordFailure();
 *     // Release bulkhead permit
 *     bulkhead.release();
 *   }
 * };
 * ```
 */
export interface ResilienceHook {
  beforeRequest?: (config: { method: string; url: string; data?: unknown }) => Promise<void>;
  afterSuccess?: (result: { method: string; url: string; duration: number }) => void;
  afterFailure?: (error: { method: string; url: string; duration: number; error: unknown }) => void;
}

// ==========================================
// CONFIGURATION TYPES
// ==========================================

/**
 * Extended AxiosRequestConfig with AbortSignal support for request cancellation
 *
 * Enables cancellation of in-flight requests using the AbortController API.
 * Particularly useful for cleanup in React components (useEffect).
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

/**
 * API Client configuration
 *
 * Comprehensive configuration for API client behavior including:
 * - Base URL and timeout settings
 * - Retry logic configuration
 * - Logging preferences
 * - Custom interceptors
 * - Resilience pattern integration
 * - Token management
 *
 * @example
 * ```typescript
 * const config: ApiClientConfig = {
 *   baseURL: 'https://api.example.com',
 *   timeout: 30000,
 *   enableRetry: true,
 *   maxRetries: 3,
 *   retryDelay: 1000,
 *   enableLogging: true,
 *   requestInterceptors: [authInterceptor],
 *   responseInterceptors: [errorInterceptor],
 *   resilienceHook: circuitBreakerHook,
 *   tokenManager: secureTokenManager
 * };
 * ```
 */
export interface ApiClientConfig {
  /** Base URL for all API requests */
  baseURL?: string;

  /** Request timeout in milliseconds */
  timeout?: number;

  /** Include credentials (cookies) in cross-origin requests */
  withCredentials?: boolean;

  /** Enable request/response logging (recommended for development only) */
  enableLogging?: boolean;

  /** Enable automatic retry for failed requests */
  enableRetry?: boolean;

  /** Maximum number of retry attempts */
  maxRetries?: number;

  /** Base delay between retries in milliseconds (uses exponential backoff) */
  retryDelay?: number;

  /** Custom request interceptors */
  requestInterceptors?: RequestInterceptor[];

  /** Custom response interceptors */
  responseInterceptors?: ResponseInterceptor[];

  /** Resilience hook for circuit breaker/bulkhead integration */
  resilienceHook?: ResilienceHook;

  /** Token manager for authentication */
  tokenManager?: import('./interfaces/ITokenManager').ITokenManager;
}
