/**
 * API Client Type Definitions
 *
 * Type definitions for HTTP client operations, request/response handling,
 * and API communication patterns.
 *
 * @module types/api/client
 */

import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API request configuration
 */
export interface ApiRequestConfig<TData = unknown> extends AxiosRequestConfig<TData> {
  /**
   * Skip authentication for this request
   */
  skipAuth?: boolean;

  /**
   * Retry configuration
   */
  retry?: {
    /**
     * Number of retry attempts
     */
    retries: number;

    /**
     * Delay between retries in milliseconds
     */
    retryDelay: number;

    /**
     * Retry only on specific status codes
     */
    retryCondition?: (error: AxiosError) => boolean;
  };

  /**
   * Cache configuration
   */
  cache?: {
    /**
     * Enable caching for this request
     */
    enabled: boolean;

    /**
     * Cache TTL in milliseconds
     */
    ttl?: number;

    /**
     * Cache key override
     */
    key?: string;
  };

  /**
   * Request metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * API response wrapper
 */
export interface ApiResponse<TData = unknown> {
  /**
   * Response data
   */
  data: TData;

  /**
   * HTTP status code
   */
  status: number;

  /**
   * HTTP status text
   */
  statusText: string;

  /**
   * Response headers
   */
  headers: Record<string, string>;

  /**
   * Response metadata
   */
  meta?: {
    /**
     * Request ID for tracing
     */
    requestId?: string;

    /**
     * Response timestamp
     */
    timestamp?: string;

    /**
     * Additional metadata
     */
    [key: string]: unknown;
  };
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  /**
   * Error code
   */
  code: string;

  /**
   * Error message
   */
  message: string;

  /**
   * Detailed error information
   */
  details?: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;

  /**
   * Request ID for tracing
   */
  requestId?: string;

  /**
   * Error timestamp
   */
  timestamp?: string;
}

/**
 * API client error
 */
export interface ApiClientError extends Error {
  /**
   * Error code
   */
  code: string;

  /**
   * HTTP status code
   */
  status?: number;

  /**
   * Error response from server
   */
  response?: ApiErrorResponse;

  /**
   * Original axios error
   */
  originalError?: AxiosError;
}

/**
 * Request interceptor function
 */
export type RequestInterceptor = (
  config: ApiRequestConfig,
) => ApiRequestConfig | Promise<ApiRequestConfig>;

/**
 * Response interceptor function
 */
export type ResponseInterceptor<T = unknown> = (
  response: AxiosResponse<T>,
) => AxiosResponse<T> | Promise<AxiosResponse<T>>;

/**
 * Error interceptor function
 */
export type ErrorInterceptor = (error: AxiosError) => Promise<never>;

/**
 * Interceptor configuration
 */
export interface InterceptorConfig {
  /**
   * Request interceptors
   */
  request?: RequestInterceptor[];

  /**
   * Response interceptors
   */
  response?: ResponseInterceptor[];

  /**
   * Error interceptors
   */
  error?: ErrorInterceptor[];
}

/**
 * API client configuration
 */
export interface ApiClientConfig {
  /**
   * Base URL for API requests
   */
  baseURL: string;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Default headers
   */
  headers?: Record<string, string>;

  /**
   * With credentials
   */
  withCredentials?: boolean;

  /**
   * Interceptor configuration
   */
  interceptors?: InterceptorConfig;

  /**
   * Default retry configuration
   */
  retry?: {
    retries: number;
    retryDelay: number;
  };
}

/**
 * Paginated request parameters
 */
export interface PaginatedRequestParams {
  /**
   * Page number (1-indexed)
   */
  page?: number;

  /**
   * Items per page
   */
  limit?: number;

  /**
   * Sort field
   */
  sortBy?: string;

  /**
   * Sort order
   */
  sortOrder?: 'asc' | 'desc';

  /**
   * Search query
   */
  search?: string;

  /**
   * Additional filters
   */
  filters?: Record<string, unknown>;
}

/**
 * Paginated response data
 */
export interface PaginatedResponse<T> {
  /**
   * Array of items
   */
  data: T[];

  /**
   * Pagination metadata
   */
  pagination: {
    /**
     * Current page number
     */
    page: number;

    /**
     * Items per page
     */
    limit: number;

    /**
     * Total number of items
     */
    total: number;

    /**
     * Total number of pages
     */
    totalPages: number;

    /**
     * Has next page
     */
    hasNextPage: boolean;

    /**
     * Has previous page
     */
    hasPreviousPage: boolean;
  };
}

/**
 * Upload progress event
 */
export interface UploadProgressEvent {
  /**
   * Loaded bytes
   */
  loaded: number;

  /**
   * Total bytes
   */
  total: number;

  /**
   * Progress percentage (0-100)
   */
  percentage: number;
}

/**
 * Download progress event
 */
export interface DownloadProgressEvent {
  /**
   * Loaded bytes
   */
  loaded: number;

  /**
   * Total bytes
   */
  total: number;

  /**
   * Progress percentage (0-100)
   */
  percentage: number;
}

/**
 * File upload configuration
 */
export interface FileUploadConfig extends ApiRequestConfig {
  /**
   * File to upload
   */
  file: File;

  /**
   * Form field name
   */
  fieldName?: string;

  /**
   * Additional form data
   */
  formData?: Record<string, string | Blob>;

  /**
   * Upload progress callback
   */
  onUploadProgress?: (event: UploadProgressEvent) => void;
}

/**
 * Batch request configuration
 */
export interface BatchRequestConfig<T = unknown> {
  /**
   * Array of request configurations
   */
  requests: ApiRequestConfig<T>[];

  /**
   * Continue on error
   */
  continueOnError?: boolean;

  /**
   * Maximum concurrent requests
   */
  maxConcurrency?: number;
}

/**
 * Batch request result
 */
export interface BatchRequestResult<T = unknown> {
  /**
   * Successful responses
   */
  successful: ApiResponse<T>[];

  /**
   * Failed responses
   */
  failed: Array<{
    error: ApiClientError;
    request: ApiRequestConfig;
  }>;

  /**
   * Summary
   */
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}
