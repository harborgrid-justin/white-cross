/**
 * Server-side API client for Next.js Server Actions
 * Provides resilient HTTP requests with retry logic and proper error handling
 *
 * @module lib/server/api-client
 * @version 1.0.0
 *
 * @deprecated This module provides a simple API client for Server Actions.
 * For most use cases, prefer using @/lib/api/nextjs-client which provides
 * comprehensive Next.js caching integration and better error handling.
 * This client is suitable for simple, non-cached API calls in Server Actions.
 */

/**
 * Fetch options for simple server actions
 */
export interface ServerActionFetchOptions extends RequestInit {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

/**
 * Response format for server action API calls
 */
export interface ServerActionApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Makes a resilient fetch request with retry logic
 *
 * @note For Server Components, prefer using nextFetch from @/lib/api/nextjs-client
 * This function is suitable for Server Actions where caching is not needed.
 */
export async function serverFetch<T = any>(
  url: string,
  options: ServerActionFetchOptions = {}
): Promise<ServerActionApiResponse<T>> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 10000,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage = typeof data === 'object' && data.message
          ? data.message
          : typeof data === 'string'
          ? data
          : `HTTP ${response.status}: ${response.statusText}`;

        // Don't retry 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500) {
          return {
            success: false,
            error: errorMessage,
          };
        }

        // Retry 5xx errors
        throw new Error(errorMessage);
      }

      // Success
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on timeout or abort errors after max retries
      if (attempt === maxRetries) {
        break;
      }

      // Check if error is retryable
      const isRetryable = error instanceof Error &&
        (error.name === 'TypeError' || // Network error
         error.name === 'AbortError' || // Timeout
         error.message.includes('ECONNREFUSED') || // Connection refused
         error.message.includes('ETIMEDOUT')); // Timeout

      if (!isRetryable) {
        break;
      }

      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
    }
  }

  // All retries failed
  return {
    success: false,
    error: lastError?.message || 'Network request failed',
  };
}

/**
 * Get the backend URL with proper environment variable fallback
 */
export function getBackendUrl(): string {
  return process.env.API_BASE_URL ||
         process.env.NEXT_PUBLIC_API_URL ||
         'http://localhost:3001';
}

/**
 * Helper for GET requests
 */
export async function serverGet<T = any>(
  endpoint: string,
  options: Omit<ServerActionFetchOptions, 'method' | 'body'> = {}
): Promise<ServerActionApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${getBackendUrl()}${endpoint}`;
  return serverFetch<T>(url, {
    ...options,
    method: 'GET',
  });
}

/**
 * Helper for POST requests
 */
export async function serverPost<T = any>(
  endpoint: string,
  body?: any,
  options: Omit<ServerActionFetchOptions, 'method' | 'body'> = {}
): Promise<ServerActionApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${getBackendUrl()}${endpoint}`;
  return serverFetch<T>(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Helper for PUT requests
 */
export async function serverPut<T = any>(
  endpoint: string,
  body?: any,
  options: Omit<ServerActionFetchOptions, 'method' | 'body'> = {}
): Promise<ServerActionApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${getBackendUrl()}${endpoint}`;
  return serverFetch<T>(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Helper for DELETE requests
 */
export async function serverDelete<T = any>(
  endpoint: string,
  options: Omit<ServerActionFetchOptions, 'method' | 'body'> = {}
): Promise<ServerActionApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${getBackendUrl()}${endpoint}`;
  return serverFetch<T>(url, {
    ...options,
    method: 'DELETE',
  });
}
