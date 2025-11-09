/**
 * @fileoverview HTTP Utilities Kit
 * @module core/api/http-kit
 *
 * HTTP client utilities, request builders, response handlers,
 * retry logic, and common HTTP patterns.
 */

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * HTTP request configuration
 */
export interface HttpRequestConfig {
  /** Request URL */
  url: string;
  /** HTTP method */
  method?: HttpMethod;
  /** Request headers */
  headers?: Record<string, string>;
  /** Request body */
  body?: any;
  /** Query parameters */
  params?: Record<string, any>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Retry configuration */
  retry?: {
    attempts: number;
    delay: number;
    backoff?: 'linear' | 'exponential';
  };
}

/**
 * HTTP response type
 */
export interface HttpResponse<T = any> {
  /** Response status code */
  status: number;
  /** Response status text */
  statusText: string;
  /** Response headers */
  headers: Record<string, string>;
  /** Response data */
  data: T;
  /** Request configuration */
  config: HttpRequestConfig;
}

/**
 * HTTP error type
 */
export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any,
    public config?: HttpRequestConfig
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Creates an HTTP client with default configuration
 *
 * @param defaults - Default request configuration
 * @returns HTTP client instance
 *
 * @example
 * ```typescript
 * const client = createHttpClient({
 *   headers: { 'Authorization': 'Bearer token' },
 *   timeout: 5000
 * });
 *
 * const response = await client.get('/api/users');
 * ```
 */
export function createHttpClient(defaults: Partial<HttpRequestConfig> = {}) {
  const request = async <T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> => {
    const mergedConfig = {
      method: 'GET' as HttpMethod,
      headers: {},
      timeout: 30000,
      ...defaults,
      ...config,
      headers: { ...defaults.headers, ...config.headers },
    };

    const { url, method, headers, body, params, timeout, retry } = mergedConfig;

    // Build URL with query parameters
    const finalUrl = buildUrlWithParams(url, params);

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: AbortSignal.timeout(timeout!),
    };

    if (body && method !== 'GET' && method !== 'HEAD') {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Execute request with retry logic
    const executeRequest = async (attempt: number = 0): Promise<HttpResponse<T>> => {
      try {
        const response = await fetch(finalUrl, fetchOptions);

        // Parse response data
        const contentType = response.headers.get('content-type');
        let data: any;

        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        // Convert headers to object
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        const httpResponse: HttpResponse<T> = {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          data,
          config: mergedConfig,
        };

        // Check if response is successful
        if (!response.ok) {
          throw new HttpError(
            `HTTP Error ${response.status}: ${response.statusText}`,
            response.status,
            httpResponse,
            mergedConfig
          );
        }

        return httpResponse;
      } catch (error: any) {
        // Retry logic
        if (retry && attempt < retry.attempts) {
          const delay = calculateRetryDelay(retry.delay, attempt, retry.backoff);
          await sleep(delay);
          return executeRequest(attempt + 1);
        }

        throw error;
      }
    };

    return executeRequest();
  };

  return {
    request,
    get: <T = any>(url: string, config?: Partial<HttpRequestConfig>) =>
      request<T>({ url, method: 'GET', ...config }),
    post: <T = any>(url: string, data?: any, config?: Partial<HttpRequestConfig>) =>
      request<T>({ url, method: 'POST', body: data, ...config }),
    put: <T = any>(url: string, data?: any, config?: Partial<HttpRequestConfig>) =>
      request<T>({ url, method: 'PUT', body: data, ...config }),
    patch: <T = any>(url: string, data?: any, config?: Partial<HttpRequestConfig>) =>
      request<T>({ url, method: 'PATCH', body: data, ...config }),
    delete: <T = any>(url: string, config?: Partial<HttpRequestConfig>) =>
      request<T>({ url, method: 'DELETE', ...config }),
    head: (url: string, config?: Partial<HttpRequestConfig>) =>
      request({ url, method: 'HEAD', ...config }),
    options: (url: string, config?: Partial<HttpRequestConfig>) =>
      request({ url, method: 'OPTIONS', ...config }),
  };
}

/**
 * Builds URL with query parameters
 *
 * @param url - Base URL
 * @param params - Query parameters
 * @returns URL with query string
 */
export function buildUrlWithParams(
  url: string,
  params?: Record<string, any>
): string {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${queryString}`;
}

/**
 * Calculates retry delay with optional backoff
 *
 * @param baseDelay - Base delay in milliseconds
 * @param attempt - Current attempt number
 * @param backoff - Backoff strategy
 * @returns Delay in milliseconds
 */
export function calculateRetryDelay(
  baseDelay: number,
  attempt: number,
  backoff?: 'linear' | 'exponential'
): number {
  if (!backoff || backoff === 'linear') {
    return baseDelay * (attempt + 1);
  }

  // Exponential backoff
  return baseDelay * Math.pow(2, attempt);
}

/**
 * Sleep utility function
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Checks if HTTP status code is successful (2xx)
 *
 * @param status - HTTP status code
 * @returns True if status is successful
 */
export function isSuccessStatus(status: number): boolean {
  return status >= 200 && status < 300;
}

/**
 * Checks if HTTP status code is a client error (4xx)
 *
 * @param status - HTTP status code
 * @returns True if status is client error
 */
export function isClientError(status: number): boolean {
  return status >= 400 && status < 500;
}

/**
 * Checks if HTTP status code is a server error (5xx)
 *
 * @param status - HTTP status code
 * @returns True if status is server error
 */
export function isServerError(status: number): boolean {
  return status >= 500 && status < 600;
}

/**
 * Parses content type header
 *
 * @param contentType - Content-Type header value
 * @returns Parsed content type information
 */
export function parseContentType(contentType: string): {
  type: string;
  charset?: string;
  boundary?: string;
} {
  const [type, ...params] = contentType.split(';').map((s) => s.trim());

  const result: { type: string; charset?: string; boundary?: string } = { type };

  params.forEach((param) => {
    const [key, value] = param.split('=').map((s) => s.trim());
    if (key === 'charset') {
      result.charset = value;
    } else if (key === 'boundary') {
      result.boundary = value;
    }
  });

  return result;
}

/**
 * Creates a request interceptor
 *
 * @param interceptor - Interceptor function
 * @returns Intercepted request function
 */
export function createRequestInterceptor(
  interceptor: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>
): (config: HttpRequestConfig) => Promise<HttpRequestConfig> {
  return async (config: HttpRequestConfig) => {
    return await interceptor(config);
  };
}

/**
 * Creates a response interceptor
 *
 * @param interceptor - Interceptor function
 * @returns Intercepted response function
 */
export function createResponseInterceptor<T = any>(
  interceptor: (response: HttpResponse<T>) => HttpResponse<T> | Promise<HttpResponse<T>>
): (response: HttpResponse<T>) => Promise<HttpResponse<T>> {
  return async (response: HttpResponse<T>) => {
    return await interceptor(response);
  };
}

/**
 * Common HTTP status codes
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * Common HTTP headers
 */
export const HttpHeaders = {
  ACCEPT: 'Accept',
  AUTHORIZATION: 'Authorization',
  CACHE_CONTROL: 'Cache-Control',
  CONTENT_TYPE: 'Content-Type',
  CONTENT_LENGTH: 'Content-Length',
  COOKIE: 'Cookie',
  ETAG: 'ETag',
  IF_NONE_MATCH: 'If-None-Match',
  LOCATION: 'Location',
  USER_AGENT: 'User-Agent',
  X_REQUESTED_WITH: 'X-Requested-With',
  X_API_KEY: 'X-API-Key',
} as const;

/**
 * HTTP Kit - Main export
 */
export default {
  createHttpClient,
  buildUrlWithParams,
  calculateRetryDelay,
  sleep,
  isSuccessStatus,
  isClientError,
  isServerError,
  parseContentType,
  createRequestInterceptor,
  createResponseInterceptor,
  HttpStatus,
  HttpHeaders,
  HttpError,
};
