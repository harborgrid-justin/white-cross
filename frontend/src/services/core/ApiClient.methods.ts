/**
 * @fileoverview HTTP method implementations for API Client
 * @module services/core/ApiClient.methods
 * @category Services
 *
 * Type-safe HTTP methods (GET, POST, PUT, PATCH, DELETE) with error handling
 * and resilience hooks. Extracted for modularity and maintainability.
 */

import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
  ApiResponse,
  CancellableRequestConfig,
  ResilienceHook,
} from './ApiClient.types';

// ==========================================
// INTERNAL TYPES
// ==========================================

/** Internal context for HTTP method execution */
interface RequestExecutionContext {
  instance: AxiosInstance;
  resilienceHook?: ResilienceHook;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  url: string;
  data?: unknown;
  config?: CancellableRequestConfig;
}

// ==========================================
// REQUEST EXECUTOR
// ==========================================

/**
 * Generic request executor for all HTTP methods with resilience hooks
 *
 * @template T - The response data type
 * @param context - Request execution context with all necessary parameters
 * @returns Promise resolving to API response
 *
 * Handles performance tracking, resilience hooks (before/after), and error propagation.
 */
export async function executeRequest<T = unknown>(
  context: RequestExecutionContext
): Promise<ApiResponse<T>> {
  const { instance, resilienceHook, method, url, data, config } = context;
  const startTime = performance.now();
  const methodUpper = method.toUpperCase();

  try {
    // Execute beforeRequest hook if configured
    if (resilienceHook?.beforeRequest) {
      await resilienceHook.beforeRequest({
        method: methodUpper,
        url,
        data
      });
    }

    // Execute the HTTP request based on method type
    console.log(`[ApiClient] Making ${methodUpper} request to:`, url);
    console.log('[ApiClient] Base URL:', instance.defaults.baseURL);
    console.log('[ApiClient] Full URL will be:', instance.defaults.baseURL + url);

    let response: AxiosResponse<ApiResponse<T>>;
    switch (method) {
      case 'get':
      case 'delete':
        // GET and DELETE don't accept body data
        response = await instance[method]<ApiResponse<T>>(url, config);
        break;
      case 'post':
      case 'put':
      case 'patch':
        // POST, PUT, and PATCH accept body data
        response = await instance[method]<ApiResponse<T>>(url, data, config);
        break;
    }

    // Execute afterSuccess hook if configured
    if (resilienceHook?.afterSuccess) {
      resilienceHook.afterSuccess({
        method: methodUpper,
        url,
        duration: performance.now() - startTime
      });
    }

    return response.data;
  } catch (error) {
    // Execute afterFailure hook if configured
    if (resilienceHook?.afterFailure) {
      resilienceHook.afterFailure({
        method: methodUpper,
        url,
        duration: performance.now() - startTime,
        error
      });
    }
    throw error;
  }
}

// ==========================================
// HTTP METHOD IMPLEMENTATIONS
// ==========================================

/**
 * Execute GET request to retrieve data from the API
 *
 * @template T - The response data type expected from the API
 * @param instance - Axios instance with base URL and interceptors
 * @param url - Request URL (relative to baseURL or absolute)
 * @param config - Optional request configuration with AbortSignal
 * @param resilienceHook - Optional resilience hook for circuit breaker
 * @returns Promise resolving to API response with typed data
 *
 * Executes through full resilience stack with auto retry and token refresh.
 */
export async function apiGet<T = unknown>(
  instance: AxiosInstance,
  url: string,
  config?: CancellableRequestConfig,
  resilienceHook?: ResilienceHook
): Promise<ApiResponse<T>> {
  return executeRequest<T>({
    instance,
    resilienceHook,
    method: 'get',
    url,
    config
  });
}

/**
 * Execute POST request to create a new resource or trigger an action
 *
 * @template T - The response data type expected from the API
 * @param instance - Axios instance with base URL and interceptors
 * @param url - Request URL (relative to baseURL or absolute)
 * @param data - Request body data (will be JSON-stringified)
 * @param config - Optional request configuration with AbortSignal
 * @param resilienceHook - Optional resilience hook for circuit breaker
 * @returns Promise resolving to API response with created/updated data
 *
 * Includes CSRF token, handles validation errors, supports cancellation.
 * Use for creating resources, triggering actions, or bulk operations.
 */
export async function apiPost<T = unknown>(
  instance: AxiosInstance,
  url: string,
  data?: unknown,
  config?: CancellableRequestConfig,
  resilienceHook?: ResilienceHook
): Promise<ApiResponse<T>> {
  return executeRequest<T>({
    instance,
    resilienceHook,
    method: 'post',
    url,
    data,
    config
  });
}

/**
 * Execute PUT request for complete resource replacement
 *
 * @template T - The response data type expected from the API
 * @param instance - Axios instance with base URL and interceptors
 * @param url - Request URL (relative to baseURL or absolute)
 * @param data - Complete resource data to replace existing resource
 * @param config - Optional request configuration with AbortSignal
 * @param resilienceHook - Optional resilience hook for circuit breaker
 * @returns Promise resolving to API response with updated resource
 *
 * Replaces entire resource. Use PATCH for partial updates.
 */
export async function apiPut<T = unknown>(
  instance: AxiosInstance,
  url: string,
  data?: unknown,
  config?: CancellableRequestConfig,
  resilienceHook?: ResilienceHook
): Promise<ApiResponse<T>> {
  return executeRequest<T>({
    instance,
    resilienceHook,
    method: 'put',
    url,
    data,
    config
  });
}

/**
 * Execute PATCH request for partial resource update
 *
 * @template T - The response data type expected from the API
 * @param instance - Axios instance with base URL and interceptors
 * @param url - Request URL (relative to baseURL or absolute)
 * @param data - Partial resource data (only fields to update)
 * @param config - Optional request configuration with AbortSignal
 * @param resilienceHook - Optional resilience hook for circuit breaker
 * @returns Promise resolving to API response with updated resource
 *
 * Updates only specified fields. Preferred over PUT for partial updates.
 */
export async function apiPatch<T = unknown>(
  instance: AxiosInstance,
  url: string,
  data?: unknown,
  config?: CancellableRequestConfig,
  resilienceHook?: ResilienceHook
): Promise<ApiResponse<T>> {
  return executeRequest<T>({
    instance,
    resilienceHook,
    method: 'patch',
    url,
    data,
    config
  });
}

/**
 * Execute DELETE request to remove a resource
 *
 * @template T - The response data type (typically void or deletion confirmation)
 * @param instance - Axios instance with base URL and interceptors
 * @param url - Request URL (relative to baseURL or absolute)
 * @param config - Optional request configuration with AbortSignal
 * @param resilienceHook - Optional resilience hook for circuit breaker
 * @returns Promise resolving to API response (typically empty)
 *
 * Removes resource permanently. For healthcare data, prefer soft-delete via PATCH.
 */
export async function apiDelete<T = unknown>(
  instance: AxiosInstance,
  url: string,
  config?: CancellableRequestConfig,
  resilienceHook?: ResilienceHook
): Promise<ApiResponse<T>> {
  return executeRequest<T>({
    instance,
    resilienceHook,
    method: 'delete',
    url,
    config
  });
}
