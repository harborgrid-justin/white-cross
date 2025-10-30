/**
 * Server-side API client for Next.js Server Actions
 * Provides resilient HTTP requests with retry logic and proper error handling
 */

interface FetchOptions extends RequestInit {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Makes a resilient fetch request with retry logic
 */
export async function serverFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
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
  options: Omit<FetchOptions, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> {
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
  options: Omit<FetchOptions, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> {
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
  options: Omit<FetchOptions, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> {
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
  options: Omit<FetchOptions, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${getBackendUrl()}${endpoint}`;
  return serverFetch<T>(url, {
    ...options,
    method: 'DELETE',
  });
}
