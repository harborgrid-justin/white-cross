/**
 * @fileoverview Enterprise-grade HTTP API client with resilience patterns for healthcare
 * @module services/core/ApiClient
 * @category Services
 *
 * Type-safe HTTP client with authentication, CSRF protection, retry logic, and
 * resilience patterns (circuit breaker, bulkhead) for HIPAA-compliant healthcare apps.
 *
 * Features: Auto token refresh, error classification, request/response interceptors,
 * exponential backoff retry, security headers, performance tracking.
 *
 * @see {@link ResilientApiClient} for circuit breaker integration
 * @see {@link BaseApiService} for CRUD operations
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from '../../constants/config';
import type { ITokenManager } from './interfaces/ITokenManager';
import { setupCsrfProtection } from '../security/CsrfProtection';

// Next.js v16 imports for enhanced functionality (removed - only available in Server Components)
// import { cache } from 'react';
// import { unstable_cache } from 'next/cache';
// import { revalidateTag, revalidatePath } from 'next/cache';

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

// Import HTTP method implementations from extracted module
import {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
} from './ApiClient.methods';

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

// Note: Singleton instance is available from './ApiClient.instance'
// Import it directly: import { apiClient } from './ApiClient.instance';

// ==========================================
// API CLIENT CLASS
// ==========================================

/**
 * Enterprise HTTP API Client
 *
 * @class
 * @classdesc Axios-based HTTP client with authentication, CSRF protection, retry logic,
 * error handling, and resilience pattern integration (circuit breaker, bulkhead).
 *
 * Request Flow: beforeRequest hook → request interceptor → HTTP call →
 * response interceptor (handles 401/retry) → afterSuccess/afterFailure hook
 *
 * @example
 * ```typescript
 * const client = new ApiClient({
 *   baseURL: 'https://api.hospital.com',
 *   timeout: 30000,
 *   enableRetry: true,
 *   tokenManager: secureTokenManager
 * });
 * const response = await client.get<Patient>('/patients/123');
 * ```
 *
 * @see {@link ApiClientConfig} for configuration options
 * @see {@link ApiClientError} for error handling
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
  
  // Next.js v16 enhancements
  private isEdgeRuntime: boolean = false;
  private streamingEnabled: boolean = false;
  private cacheTagPrefix: string = 'api';
  private requestCache = new Map<string, { data: unknown; timestamp: number; tags: string[] }>();

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
   * Execute GET request to retrieve data from the API
   *
   * @template T - The response data type expected from the API
   * @param {string} url - Request URL (relative to baseURL or absolute)
   * @param {CancellableRequestConfig} [config] - Request configuration with optional AbortSignal for cancellation
   * @returns {Promise<ApiResponse<T>>} Promise resolving to API response with typed data
   *
   * @see {@link ApiClient.methods.apiGet} for implementation details and comprehensive documentation
   */
  public async get<T = unknown>(
    url: string,
    config?: CancellableRequestConfig
  ): Promise<ApiResponse<T>> {
    return apiGet<T>(this.instance, url, config, this.resilienceHook);
  }

  /**
   * Execute POST request to create a new resource or trigger an action
   *
   * @template T - The response data type expected from the API
   * @param {string} url - Request URL (relative to baseURL or absolute)
   * @param {unknown} [data] - Request body data to send (will be JSON-stringified)
   * @param {CancellableRequestConfig} [config] - Request configuration with optional AbortSignal
   * @returns {Promise<ApiResponse<T>>} Promise resolving to API response with created/updated data
   *
   * @see {@link ApiClient.methods.apiPost} for implementation details and comprehensive documentation
   */
  public async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: CancellableRequestConfig
  ): Promise<ApiResponse<T>> {
    return apiPost<T>(this.instance, url, data, config, this.resilienceHook);
  }

  /**
   * Execute PUT request for complete resource replacement
   *
   * @template T - The response data type expected from the API
   * @param {string} url - Request URL (relative to baseURL or absolute)
   * @param {unknown} [data] - Complete resource data to replace existing resource
   * @param {CancellableRequestConfig} [config] - Request configuration with optional AbortSignal
   * @returns {Promise<ApiResponse<T>>} Promise resolving to API response with updated resource
   *
   * @see {@link ApiClient.methods.apiPut} for implementation details and comprehensive documentation
   */
  public async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: CancellableRequestConfig
  ): Promise<ApiResponse<T>> {
    return apiPut<T>(this.instance, url, data, config, this.resilienceHook);
  }

  /**
   * Execute PATCH request for partial resource update
   *
   * @template T - The response data type expected from the API
   * @param {string} url - Request URL (relative to baseURL or absolute)
   * @param {unknown} [data] - Partial resource data (only fields to update)
   * @param {CancellableRequestConfig} [config] - Request configuration with optional AbortSignal
   * @returns {Promise<ApiResponse<T>>} Promise resolving to API response with updated resource
   *
   * @see {@link ApiClient.methods.apiPatch} for implementation details and comprehensive documentation
   */
  public async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: CancellableRequestConfig
  ): Promise<ApiResponse<T>> {
    return apiPatch<T>(this.instance, url, data, config, this.resilienceHook);
  }

  /**
   * Execute DELETE request to remove a resource
   *
   * @template T - The response data type (typically void or deletion confirmation)
   * @param {string} url - Request URL (relative to baseURL or absolute)
   * @param {CancellableRequestConfig} [config] - Request configuration with optional AbortSignal
   * @returns {Promise<ApiResponse<T>>} Promise resolving to API response (typically empty)
   *
   * @see {@link ApiClient.methods.apiDelete} for implementation details and comprehensive documentation
   */
  public async delete<T = unknown>(
    url: string,
    config?: CancellableRequestConfig
  ): Promise<ApiResponse<T>> {
    return apiDelete<T>(this.instance, url, config, this.resilienceHook);
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
