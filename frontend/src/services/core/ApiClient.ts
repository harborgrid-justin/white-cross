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

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from '../../constants/config';
import type { ITokenManager } from './interfaces/ITokenManager';
import { setupCsrfProtection } from '../security/CsrfProtection';

// Import types from extracted modules
import type {
  ApiResponse,
  ApiClientConfig,
  CancellableRequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ResilienceHook,
} from './ApiClient.types';

// Import interceptor utilities from extracted module
import {
  createAuthRequestInterceptor,
  createAuthResponseInterceptor,
} from './ApiClient.interceptors';

// Import authentication utilities from extracted module
import {
  refreshAuthToken,
  handleAuthFailure,
} from './ApiClient.auth';

// Re-export types for backward compatibility
export type {
  ApiResponse,
  PaginatedResponse,
  ApiErrorResponse,
  ApiClientConfig,
  CancellableRequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ResilienceHook,
} from './ApiClient.types';

// Re-export error class for backward compatibility
export { ApiClientError } from './ApiClient.errors';

// Re-export cancellation utilities for backward compatibility
export { createCancellableRequest } from './ApiClient.cancellation';

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
    this.maxRetries = config.maxRetries ?? API_CONFIG.RETRY.MAX_RETRIES;
    this.retryDelay = config.retryDelay ?? API_CONFIG.RETRY.RETRY_DELAY;

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
    const authRequestId = createAuthRequestInterceptor(
      this.instance,
      this.tokenManager,
      this.enableLogging
    );
    this.requestInterceptorIds.push(authRequestId);

    // Response interceptor: Handle token refresh and errors
    const authResponseId = createAuthResponseInterceptor({
      instance: this.instance,
      tokenManager: this.tokenManager,
      enableLogging: this.enableLogging,
      enableRetry: this.enableRetry,
      maxRetries: this.maxRetries,
      retryDelay: this.retryDelay,
      onAuthFailure: () => handleAuthFailure(this.tokenManager),
      refreshAuthToken: () => refreshAuthToken(this.tokenManager),
    });
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
// SINGLETON INSTANCE
// ==========================================

// Import secureTokenManager here to avoid circular dependency
// (ApiClient no longer imports it directly, only via dependency injection)
import { secureTokenManager } from '../security/SecureTokenManager';

export const apiClient = new ApiClient({
  enableLogging: process.env.NODE_ENV === 'development',
  enableRetry: true,
  tokenManager: secureTokenManager,
});
