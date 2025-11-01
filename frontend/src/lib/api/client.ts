/**
 * @fileoverview Client-Side API Client
 * @module lib/api/client
 * @category API Client
 *
 * Client-side HTTP client for browser environments. This client is designed
 * for use in Client Components and browser-only contexts where Next.js
 * server APIs (like next/headers) are not available.
 *
 * Key Features:
 * - Browser-compatible fetch API
 * - Client-side authentication via cookies
 * - CSRF protection
 * - Error handling and retry logic
 * - Type-safe HTTP methods
 * - Request ID generation for tracing
 *
 * @example
 * ```typescript
 * // In a Client Component
 * 'use client';
 * import { clientGet, clientPost } from '@/lib/api/client';
 * 
 * const students = await clientGet<Student[]>('/api/students');
 * const newStudent = await clientPost<Student>('/api/students', data);
 * ```
 *
 * @version 1.0.0
 * @since 2025-11-01
 */

// ==========================================
// TYPE DEFINITIONS
// ==========================================

/**
 * Client-side fetch options
 */
export interface ClientFetchOptions extends RequestInit {
  /**
   * Whether to include authentication token
   * @default true
   */
  requiresAuth?: boolean;

  /**
   * Retry configuration
   */
  retry?: {
    attempts: number;
    delay: number;
  };

  /**
   * Custom error handler
   */
  onError?: (error: Error) => void;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;
}

/**
 * API error response structure
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

/**
 * Custom error class for client API errors
 */
export class ClientApiError extends Error {
  public readonly code?: string;
  public readonly status?: number;
  public readonly details?: unknown;
  public readonly traceId?: string;
  public readonly isNetworkError: boolean;
  public readonly isServerError: boolean;
  public readonly isValidationError: boolean;

  constructor(error: ApiErrorResponse) {
    super(error.message);
    this.name = 'ClientApiError';
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
    this.traceId = error.traceId;

    // Classify error types
    this.isNetworkError = error.code === 'NETWORK_ERROR';
    this.isServerError = (error.status ?? 0) >= 500;
    this.isValidationError = error.status === 400;

    // Maintain proper stack trace
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, ClientApiError);
    }
  }
}

// ==========================================
// CONFIGURATION
// ==========================================

/**
 * Get API base URL from environment
 */
function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

/**
 * Get authentication token from cookies (client-side)
 */
function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => 
      cookie.trim().startsWith('auth_token=')
    );
    
    if (authCookie) {
      return authCookie.split('=')[1];
    }
    
    return null;
  } catch (error) {
    console.error('[Client API] Failed to get auth token:', error);
    return null;
  }
}

/**
 * Generate unique request ID for tracing
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get CSRF token from cookies (client-side)
 */
function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => 
      cookie.trim().startsWith('csrf-token=')
    );
    
    if (csrfCookie) {
      return csrfCookie.split('=')[1];
    }
    
    return null;
  } catch (error) {
    console.error('[Client API] Failed to get CSRF token:', error);
    return null;
  }
}

// ==========================================
// CORE FETCH FUNCTION
// ==========================================

/**
 * Core client-side fetch function
 *
 * @template T - The expected response data type
 * @param endpoint - API endpoint (relative or absolute URL)
 * @param options - Fetch options
 * @returns Promise resolving to typed API response
 *
 * @throws {ClientApiError} On request failure
 */
export async function clientFetch<T>(
  endpoint: string,
  options: ClientFetchOptions = {}
): Promise<T> {
  const {
    requiresAuth = true,
    onError,
    retry = { attempts: 3, delay: 1000 },
    timeout = 30000,
    ...fetchOptions
  } = options;

  // Build full URL
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${getApiBaseUrl()}${endpoint}`;

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge additional headers
  if (fetchOptions.headers) {
    Object.entries(fetchOptions.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    });
  }

  // Add authentication if required
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Add CSRF token for mutations
  if (fetchOptions.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(fetchOptions.method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  // Add request ID for tracing
  headers['X-Request-ID'] = generateRequestId();

  // Add security headers
  headers['X-Content-Type-Options'] = 'nosniff';
  headers['X-Frame-Options'] = 'DENY';
  headers['X-XSS-Protection'] = '1; mode=block';

  // Execute fetch with retry logic
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retry.attempts; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle different response status codes
      if (!response.ok) {
        const error = await handleErrorResponse(response);

        // Handle specific errors with redirects (client-side)
        if (response.status === 401 && typeof window !== 'undefined') {
          window.location.href = '/login';
          return Promise.reject(error);
        } else if (response.status === 403 && typeof window !== 'undefined') {
          window.location.href = '/access-denied';
          return Promise.reject(error);
        }

        throw error;
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json() as T;
      }

      return await response.text() as unknown as T;

    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (except 408, 429)
      if (error instanceof ClientApiError) {
        const status = error.status;
        if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
          break;
        }
      }

      // Wait before retry (exponential backoff)
      if (attempt < retry.attempts - 1) {
        await new Promise(resolve =>
          setTimeout(resolve, retry.delay * Math.pow(2, attempt))
        );
      }
    }
  }

  // All retries failed
  const finalError = lastError || new Error('Unknown error');

  if (onError) {
    onError(finalError);
  }

  throw finalError;
}

/**
 * Handle error responses and create normalized error objects
 */
async function handleErrorResponse(response: Response): Promise<ClientApiError> {
  let details: unknown;

  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      details = await response.json();
    } else {
      details = await response.text();
    }
  } catch {
    details = null;
  }

  const error: ApiErrorResponse = {
    message: typeof details === 'object' && details !== null && 'message' in details
      ? (details as { message: string }).message
      : response.statusText || 'Request failed',
    status: response.status,
    code: typeof details === 'object' && details !== null && 'code' in details
      ? (details as { code: string }).code
      : undefined,
    details,
    traceId: response.headers.get('x-trace-id') || undefined,
  };

  return new ClientApiError(error);
}

// ==========================================
// CONVENIENCE METHODS
// ==========================================

/**
 * Client-side GET request
 */
export async function clientGet<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
  options: ClientFetchOptions = {}
): Promise<T> {
  const queryString = params
    ? '?' + new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()
    : '';

  return clientFetch<T>(`${endpoint}${queryString}`, {
    ...options,
    method: 'GET',
  });
}

/**
 * Client-side POST request
 */
export async function clientPost<T>(
  endpoint: string,
  data?: unknown,
  options: ClientFetchOptions = {}
): Promise<T> {
  return clientFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Client-side PUT request
 */
export async function clientPut<T>(
  endpoint: string,
  data?: unknown,
  options: ClientFetchOptions = {}
): Promise<T> {
  return clientFetch<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Client-side PATCH request
 */
export async function clientPatch<T>(
  endpoint: string,
  data?: unknown,
  options: ClientFetchOptions = {}
): Promise<T> {
  return clientFetch<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Client-side DELETE request
 */
export async function clientDelete<T>(
  endpoint: string,
  options: ClientFetchOptions = {}
): Promise<T> {
  return clientFetch<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
}

// ==========================================
// LEGACY CLIENT SUPPORT
// ==========================================

/**
 * Simple API client options for basic HTTP requests
 */
export interface ApiClientOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

/**
 * Simple API client for basic HTTP requests (legacy support)
 */
export async function apiClient(endpoint: string, options: ApiClientOptions = {}) {
  const { method = 'GET', body, headers = {} } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const url = endpoint.startsWith('http') ? endpoint : `${getApiBaseUrl()}${endpoint}`
  const response = await fetch(url, config)

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Alias for apiClient (legacy support)
 */
export const fetchApi = apiClient

// ==========================================
// EXPORTS
// ==========================================

export default {
  clientFetch,
  clientGet,
  clientPost,
  clientPut,
  clientPatch,
  clientDelete,
  // Legacy exports
  apiClient,
  fetchApi,
};
