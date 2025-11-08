/**
 * LOC: API1234567
 * File: /reuse/api-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - HTTP client services
 *   - API integration modules
 *   - Request/response middleware
 */

/**
 * File: /reuse/api-utils.ts
 * Locator: WC-UTL-API-002
 * Purpose: General API Utilities - Comprehensive HTTP client and API management helpers
 *
 * Upstream: Independent utility module for API operations
 * Downstream: ../backend/*, ../frontend/*, HTTP services, API middleware
 * Dependencies: TypeScript 5.x, Node 18+, Fetch API compatible
 * Exports: 40 utility functions for API operations, error handling, retry logic
 *
 * LLM Context: Comprehensive API utilities for HTTP operations in White Cross system.
 * Provides request/response transformers, retry logic, rate limiting, error handling,
 * versioning, CORS, and API key management. Essential for reliable API communication
 * in healthcare applications requiring high availability and data integrity.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier?: number;
  retryableStatusCodes?: number[];
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: any;
}

// ============================================================================
// HTTP CLIENT HELPERS
// ============================================================================

/**
 * Creates a standardized fetch request with common headers and configuration.
 *
 * @param {string} url - Request URL
 * @param {RequestInit} [options] - Fetch options
 * @param {Record<string, string>} [headers] - Additional headers
 * @returns {Promise<Response>} Fetch response
 *
 * @example
 * ```typescript
 * const response = await createFetchRequest(
 *   'https://api.example.com/students',
 *   { method: 'GET' },
 *   { 'X-Custom-Header': 'value' }
 * );
 * ```
 */
export const createFetchRequest = async (
  url: string,
  options?: RequestInit,
  headers?: Record<string, string>,
): Promise<Response> => {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  return fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...headers,
      ...(options?.headers || {}),
    },
  });
};

/**
 * Creates a GET request with query parameters.
 *
 * @param {string} baseUrl - Base URL
 * @param {Record<string, any>} [params] - Query parameters
 * @param {RequestInit} [options] - Additional fetch options
 * @returns {Promise<Response>} Fetch response
 *
 * @example
 * ```typescript
 * const response = await createGetRequest(
 *   'https://api.example.com/students',
 *   { page: 1, limit: 20, grade: '10' }
 * );
 * // URL: https://api.example.com/students?page=1&limit=20&grade=10
 * ```
 */
export const createGetRequest = async (
  baseUrl: string,
  params?: Record<string, any>,
  options?: RequestInit,
): Promise<Response> => {
  const url = params ? appendQueryParams(baseUrl, params) : baseUrl;
  return createFetchRequest(url, { ...options, method: 'GET' });
};

/**
 * Creates a POST request with JSON body.
 *
 * @param {string} url - Request URL
 * @param {any} body - Request body (will be JSON stringified)
 * @param {RequestInit} [options] - Additional fetch options
 * @returns {Promise<Response>} Fetch response
 *
 * @example
 * ```typescript
 * const response = await createPostRequest(
 *   'https://api.example.com/students',
 *   { name: 'John Doe', grade: 10 }
 * );
 * ```
 */
export const createPostRequest = async (
  url: string,
  body: any,
  options?: RequestInit,
): Promise<Response> => {
  return createFetchRequest(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * Creates a PUT request with JSON body.
 *
 * @param {string} url - Request URL
 * @param {any} body - Request body (will be JSON stringified)
 * @param {RequestInit} [options] - Additional fetch options
 * @returns {Promise<Response>} Fetch response
 *
 * @example
 * ```typescript
 * const response = await createPutRequest(
 *   'https://api.example.com/students/123',
 *   { name: 'Jane Doe', grade: 11 }
 * );
 * ```
 */
export const createPutRequest = async (
  url: string,
  body: any,
  options?: RequestInit,
): Promise<Response> => {
  return createFetchRequest(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

/**
 * Creates a PATCH request with JSON body.
 *
 * @param {string} url - Request URL
 * @param {any} body - Request body (will be JSON stringified)
 * @param {RequestInit} [options] - Additional fetch options
 * @returns {Promise<Response>} Fetch response
 *
 * @example
 * ```typescript
 * const response = await createPatchRequest(
 *   'https://api.example.com/students/123',
 *   { grade: 11 }
 * );
 * ```
 */
export const createPatchRequest = async (
  url: string,
  body: any,
  options?: RequestInit,
): Promise<Response> => {
  return createFetchRequest(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

/**
 * Creates a DELETE request.
 *
 * @param {string} url - Request URL
 * @param {RequestInit} [options] - Additional fetch options
 * @returns {Promise<Response>} Fetch response
 *
 * @example
 * ```typescript
 * const response = await createDeleteRequest('https://api.example.com/students/123');
 * ```
 */
export const createDeleteRequest = async (
  url: string,
  options?: RequestInit,
): Promise<Response> => {
  return createFetchRequest(url, { ...options, method: 'DELETE' });
};

/**
 * Adds authentication header to request options.
 *
 * @param {string} token - Authentication token
 * @param {string} [scheme] - Authentication scheme (default: 'Bearer')
 * @returns {Record<string, string>} Headers object with authorization
 *
 * @example
 * ```typescript
 * const headers = addAuthHeader('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 * // Result: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
 *
 * const basicAuth = addAuthHeader('dXNlcjpwYXNz', 'Basic');
 * // Result: { 'Authorization': 'Basic dXNlcjpwYXNz' }
 * ```
 */
export const addAuthHeader = (
  token: string,
  scheme: string = 'Bearer',
): Record<string, string> => {
  return {
    Authorization: `${scheme} ${token}`,
  };
};

// ============================================================================
// REQUEST/RESPONSE TRANSFORMERS
// ============================================================================

/**
 * Appends query parameters to a URL.
 *
 * @param {string} url - Base URL
 * @param {Record<string, any>} params - Query parameters
 * @returns {string} URL with query parameters
 *
 * @example
 * ```typescript
 * const url = appendQueryParams('https://api.example.com/students', {
 *   page: 1,
 *   limit: 20,
 *   filter: 'active'
 * });
 * // Result: 'https://api.example.com/students?page=1&limit=20&filter=active'
 * ```
 */
export const appendQueryParams = (
  url: string,
  params: Record<string, any>,
): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};

/**
 * Parses JSON response body with error handling.
 *
 * @template T
 * @param {Response} response - Fetch response object
 * @returns {Promise<T>} Parsed JSON data
 *
 * @example
 * ```typescript
 * const response = await fetch('https://api.example.com/students/123');
 * const student = await parseJsonResponse<Student>(response);
 * ```
 */
export const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!text) {
    return {} as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error.message}`);
  }
};

/**
 * Transforms camelCase object keys to snake_case.
 *
 * @param {Record<string, any>} obj - Object to transform
 * @returns {Record<string, any>} Object with snake_case keys
 *
 * @example
 * ```typescript
 * const transformed = transformToSnakeCase({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   studentId: '123'
 * });
 * // Result: { first_name: 'John', last_name: 'Doe', student_id: '123' }
 * ```
 */
export const transformToSnakeCase = (
  obj: Record<string, any>,
): Record<string, any> => {
  const result: Record<string, any> = {};
  Object.entries(obj).forEach(([key, value]) => {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  });
  return result;
};

/**
 * Transforms snake_case object keys to camelCase.
 *
 * @param {Record<string, any>} obj - Object to transform
 * @returns {Record<string, any>} Object with camelCase keys
 *
 * @example
 * ```typescript
 * const transformed = transformToCamelCase({
 *   first_name: 'John',
 *   last_name: 'Doe',
 *   student_id: '123'
 * });
 * // Result: { firstName: 'John', lastName: 'Doe', studentId: '123' }
 * ```
 */
export const transformToCamelCase = (
  obj: Record<string, any>,
): Record<string, any> => {
  const result: Record<string, any> = {};
  Object.entries(obj).forEach(([key, value]) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  });
  return result;
};

/**
 * Extracts pagination metadata from response headers.
 *
 * @param {Response} response - Fetch response with pagination headers
 * @returns {object} Pagination metadata
 *
 * @example
 * ```typescript
 * const response = await fetch('https://api.example.com/students?page=2&limit=20');
 * const pagination = extractPaginationMetadata(response);
 * // Result: { page: 2, limit: 20, total: 150, totalPages: 8 }
 * ```
 */
export const extractPaginationMetadata = (response: Response) => {
  return {
    page: parseInt(response.headers.get('X-Page') || '1', 10),
    limit: parseInt(response.headers.get('X-Limit') || '20', 10),
    total: parseInt(response.headers.get('X-Total') || '0', 10),
    totalPages: parseInt(response.headers.get('X-Total-Pages') || '0', 10),
  };
};

/**
 * Serializes request body based on content type.
 *
 * @param {any} body - Request body
 * @param {string} contentType - Content type (e.g., 'application/json', 'application/x-www-form-urlencoded')
 * @returns {string | FormData} Serialized body
 *
 * @example
 * ```typescript
 * const jsonBody = serializeRequestBody({ name: 'John' }, 'application/json');
 * // Result: '{"name":"John"}'
 *
 * const formBody = serializeRequestBody({ name: 'John', age: 25 }, 'application/x-www-form-urlencoded');
 * // Result: 'name=John&age=25'
 * ```
 */
export const serializeRequestBody = (
  body: any,
  contentType: string,
): string | FormData => {
  if (contentType === 'application/json') {
    return JSON.stringify(body);
  } else if (contentType === 'application/x-www-form-urlencoded') {
    const params = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) => {
      params.append(key, String(value));
    });
    return params.toString();
  } else if (contentType === 'multipart/form-data') {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value as string | Blob);
    });
    return formData;
  }
  return JSON.stringify(body);
};

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Creates a standardized API error object.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {any} [details] - Additional error details
 * @returns {ApiError} Standardized error object
 *
 * @example
 * ```typescript
 * const error = createApiError(404, 'Student not found', { studentId: '123' });
 * // Result: { statusCode: 404, message: 'Student not found', details: { studentId: '123' } }
 * ```
 */
export const createApiError = (
  statusCode: number,
  message: string,
  details?: any,
): ApiError => {
  return {
    statusCode,
    message,
    error: getErrorNameFromStatus(statusCode),
    details,
  };
};

/**
 * Gets error name from HTTP status code.
 *
 * @param {number} statusCode - HTTP status code
 * @returns {string} Error name
 *
 * @example
 * ```typescript
 * getErrorNameFromStatus(400); // 'Bad Request'
 * getErrorNameFromStatus(401); // 'Unauthorized'
 * getErrorNameFromStatus(404); // 'Not Found'
 * getErrorNameFromStatus(500); // 'Internal Server Error'
 * ```
 */
export const getErrorNameFromStatus = (statusCode: number): string => {
  const statusNames: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  };
  return statusNames[statusCode] || 'Unknown Error';
};

/**
 * Checks if HTTP status code indicates a client error (4xx).
 *
 * @param {number} statusCode - HTTP status code
 * @returns {boolean} True if client error
 *
 * @example
 * ```typescript
 * isClientError(400); // true
 * isClientError(404); // true
 * isClientError(500); // false
 * ```
 */
export const isClientError = (statusCode: number): boolean => {
  return statusCode >= 400 && statusCode < 500;
};

/**
 * Checks if HTTP status code indicates a server error (5xx).
 *
 * @param {number} statusCode - HTTP status code
 * @returns {boolean} True if server error
 *
 * @example
 * ```typescript
 * isServerError(500); // true
 * isServerError(503); // true
 * isServerError(400); // false
 * ```
 */
export const isServerError = (statusCode: number): boolean => {
  return statusCode >= 500 && statusCode < 600;
};

/**
 * Checks if error is retryable based on status code.
 *
 * @param {number} statusCode - HTTP status code
 * @returns {boolean} True if error is retryable
 *
 * @example
 * ```typescript
 * isRetryableError(503); // true (Service Unavailable)
 * isRetryableError(429); // true (Too Many Requests)
 * isRetryableError(400); // false (Bad Request)
 * ```
 */
export const isRetryableError = (statusCode: number): boolean => {
  const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
  return retryableStatusCodes.includes(statusCode);
};

/**
 * Handles API response and throws error if not successful.
 *
 * @template T
 * @param {Response} response - Fetch response
 * @returns {Promise<T>} Parsed response data
 * @throws {ApiError} If response is not successful
 *
 * @example
 * ```typescript
 * const response = await fetch('https://api.example.com/students/123');
 * const student = await handleApiResponse<Student>(response);
 * // Throws ApiError if response.ok is false
 * ```
 */
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await parseJsonResponse<any>(response);
    throw createApiError(
      response.status,
      errorData?.message || response.statusText,
      errorData,
    );
  }
  return parseJsonResponse<T>(response);
};

// ============================================================================
// RETRY LOGIC HELPERS
// ============================================================================

/**
 * Executes a function with retry logic using exponential backoff.
 *
 * @template T
 * @param {() => Promise<T>} fn - Async function to retry
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<T>} Result of successful execution
 *
 * @example
 * ```typescript
 * const data = await retryWithBackoff(
 *   () => fetch('https://api.example.com/students').then(handleApiResponse),
 *   { maxRetries: 3, retryDelay: 1000, backoffMultiplier: 2 }
 * );
 * // Retries: 1s, 2s, 4s delays between attempts
 * ```
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  config: RetryConfig,
): Promise<T> => {
  const {
    maxRetries,
    retryDelay,
    backoffMultiplier = 2,
    retryableStatusCodes = [408, 429, 500, 502, 503, 504],
  } = config;

  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isLastAttempt = attempt === maxRetries;
      const shouldRetry =
        error.statusCode && retryableStatusCodes.includes(error.statusCode);

      if (isLastAttempt || !shouldRetry) {
        throw error;
      }

      const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
      await sleep(delay);
    }
  }
  throw lastError;
};

/**
 * Creates a retry configuration object with defaults.
 *
 * @param {Partial<RetryConfig>} [overrides] - Configuration overrides
 * @returns {RetryConfig} Complete retry configuration
 *
 * @example
 * ```typescript
 * const config = createRetryConfig({ maxRetries: 5, retryDelay: 2000 });
 * // Result: { maxRetries: 5, retryDelay: 2000, backoffMultiplier: 2, retryableStatusCodes: [...] }
 * ```
 */
export const createRetryConfig = (
  overrides?: Partial<RetryConfig>,
): RetryConfig => {
  return {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    ...overrides,
  };
};

/**
 * Sleeps for specified milliseconds (helper for retry delays).
 *
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>} Promise that resolves after delay
 *
 * @example
 * ```typescript
 * await sleep(1000); // Wait 1 second
 * await sleep(5000); // Wait 5 seconds
 * ```
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Calculates retry delay with jitter to avoid thundering herd.
 *
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} attempt - Current retry attempt number
 * @param {number} [jitterFactor] - Jitter factor (0-1, default 0.1)
 * @returns {number} Calculated delay with jitter
 *
 * @example
 * ```typescript
 * const delay = calculateRetryDelay(1000, 2, 0.2);
 * // Base delay: 1000 * 2^2 = 4000ms
 * // With 20% jitter: random between 3200ms and 4800ms
 * ```
 */
export const calculateRetryDelay = (
  baseDelay: number,
  attempt: number,
  jitterFactor: number = 0.1,
): number => {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = exponentialDelay * jitterFactor;
  return exponentialDelay + (Math.random() * 2 - 1) * jitter;
};

/**
 * Wraps a fetch request with automatic retry logic.
 *
 * @param {string} url - Request URL
 * @param {RequestInit} [options] - Fetch options
 * @param {RetryConfig} [retryConfig] - Retry configuration
 * @returns {Promise<Response>} Fetch response
 *
 * @example
 * ```typescript
 * const response = await fetchWithRetry(
 *   'https://api.example.com/students',
 *   { method: 'GET' },
 *   { maxRetries: 3, retryDelay: 1000 }
 * );
 * ```
 */
export const fetchWithRetry = async (
  url: string,
  options?: RequestInit,
  retryConfig?: Partial<RetryConfig>,
): Promise<Response> => {
  const config = createRetryConfig(retryConfig);
  return retryWithBackoff(() => createFetchRequest(url, options), config);
};

// ============================================================================
// RATE LIMITING UTILITIES
// ============================================================================

/**
 * Creates a simple in-memory rate limiter.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {object} Rate limiter with checkLimit method
 *
 * @example
 * ```typescript
 * const limiter = createRateLimiter({ maxRequests: 100, windowMs: 60000 });
 * if (limiter.checkLimit('user123')) {
 *   // Proceed with request
 * } else {
 *   // Rate limit exceeded
 * }
 * ```
 */
export const createRateLimiter = (config: RateLimitConfig) => {
  const { maxRequests, windowMs } = config;
  const requests = new Map<string, number[]>();

  return {
    checkLimit: (key: string): boolean => {
      const now = Date.now();
      const userRequests = requests.get(key) || [];
      const recentRequests = userRequests.filter(
        (timestamp) => now - timestamp < windowMs,
      );

      if (recentRequests.length >= maxRequests) {
        return false;
      }

      recentRequests.push(now);
      requests.set(key, recentRequests);
      return true;
    },
    reset: (key: string) => {
      requests.delete(key);
    },
    getRemainingRequests: (key: string): number => {
      const now = Date.now();
      const userRequests = requests.get(key) || [];
      const recentRequests = userRequests.filter(
        (timestamp) => now - timestamp < windowMs,
      );
      return Math.max(0, maxRequests - recentRequests.length);
    },
  };
};

/**
 * Parses rate limit headers from API response.
 *
 * @param {Response} response - Fetch response with rate limit headers
 * @returns {object} Rate limit information
 *
 * @example
 * ```typescript
 * const response = await fetch('https://api.example.com/students');
 * const rateLimit = parseRateLimitHeaders(response);
 * // Result: { limit: 100, remaining: 95, reset: 1234567890 }
 * ```
 */
export const parseRateLimitHeaders = (response: Response) => {
  return {
    limit: parseInt(response.headers.get('X-RateLimit-Limit') || '0', 10),
    remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0', 10),
    reset: parseInt(response.headers.get('X-RateLimit-Reset') || '0', 10),
  };
};

/**
 * Calculates time until rate limit reset.
 *
 * @param {number} resetTimestamp - Unix timestamp of rate limit reset
 * @returns {number} Milliseconds until reset
 *
 * @example
 * ```typescript
 * const resetTime = 1234567890;
 * const msUntilReset = getTimeUntilRateLimitReset(resetTime);
 * console.log(`Rate limit resets in ${msUntilReset}ms`);
 * ```
 */
export const getTimeUntilRateLimitReset = (resetTimestamp: number): number => {
  return Math.max(0, resetTimestamp * 1000 - Date.now());
};

/**
 * Checks if request should be delayed due to rate limiting.
 *
 * @param {Response} response - Previous API response
 * @returns {boolean} True if request should be delayed
 *
 * @example
 * ```typescript
 * const response = await fetch('https://api.example.com/students');
 * if (shouldDelayRequest(response)) {
 *   const { reset } = parseRateLimitHeaders(response);
 *   await sleep(getTimeUntilRateLimitReset(reset));
 * }
 * ```
 */
export const shouldDelayRequest = (response: Response): boolean => {
  const { remaining } = parseRateLimitHeaders(response);
  return remaining === 0 || response.status === 429;
};

// ============================================================================
// API VERSIONING HELPERS
// ============================================================================

/**
 * Adds API version to URL path.
 *
 * @param {string} baseUrl - Base API URL
 * @param {string | number} version - API version
 * @returns {string} URL with version path
 *
 * @example
 * ```typescript
 * const url = addVersionToUrl('https://api.example.com', 'v2');
 * // Result: 'https://api.example.com/v2'
 *
 * const url2 = addVersionToUrl('https://api.example.com/students', 1);
 * // Result: 'https://api.example.com/v1/students'
 * ```
 */
export const addVersionToUrl = (
  baseUrl: string,
  version: string | number,
): string => {
  const versionStr = typeof version === 'number' ? `v${version}` : version;
  const url = new URL(baseUrl);
  url.pathname = `/${versionStr}${url.pathname}`;
  return url.toString();
};

/**
 * Adds API version to request headers.
 *
 * @param {string | number} version - API version
 * @param {string} [headerName] - Header name (default: 'X-API-Version')
 * @returns {Record<string, string>} Headers object with version
 *
 * @example
 * ```typescript
 * const headers = addVersionHeader('2.0');
 * // Result: { 'X-API-Version': '2.0' }
 *
 * const customHeaders = addVersionHeader(3, 'API-Version');
 * // Result: { 'API-Version': '3' }
 * ```
 */
export const addVersionHeader = (
  version: string | number,
  headerName: string = 'X-API-Version',
): Record<string, string> => {
  return {
    [headerName]: String(version),
  };
};

/**
 * Parses API version from URL path.
 *
 * @param {string} url - URL containing version
 * @returns {string | null} Extracted version or null
 *
 * @example
 * ```typescript
 * const version = extractVersionFromUrl('https://api.example.com/v2/students');
 * // Result: 'v2'
 *
 * const version2 = extractVersionFromUrl('https://api.example.com/students');
 * // Result: null
 * ```
 */
export const extractVersionFromUrl = (url: string): string | null => {
  const match = url.match(/\/v(\d+)\//);
  return match ? `v${match[1]}` : null;
};

/**
 * Compares two API version strings.
 *
 * @param {string} version1 - First version (e.g., 'v1', '1.0', '2.1.3')
 * @param {string} version2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 *
 * @example
 * ```typescript
 * compareVersions('v1', 'v2'); // -1
 * compareVersions('2.0', '2.0'); // 0
 * compareVersions('2.1.0', '2.0.5'); // 1
 * ```
 */
export const compareVersions = (version1: string, version2: string): number => {
  const v1 = version1.replace(/^v/, '').split('.').map(Number);
  const v2 = version2.replace(/^v/, '').split('.').map(Number);

  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;
    if (num1 < num2) return -1;
    if (num1 > num2) return 1;
  }
  return 0;
};

// ============================================================================
// CONTENT NEGOTIATION
// ============================================================================

/**
 * Creates Accept header for content negotiation.
 *
 * @param {string[]} mimeTypes - Accepted MIME types in preference order
 * @param {number[]} [qualities] - Quality values (0-1) for each MIME type
 * @returns {string} Accept header value
 *
 * @example
 * ```typescript
 * const accept = createAcceptHeader(
 *   ['application/json', 'application/xml', 'text/html'],
 *   [1.0, 0.9, 0.8]
 * );
 * // Result: 'application/json;q=1.0, application/xml;q=0.9, text/html;q=0.8'
 * ```
 */
export const createAcceptHeader = (
  mimeTypes: string[],
  qualities?: number[],
): string => {
  if (!qualities || qualities.length !== mimeTypes.length) {
    return mimeTypes.join(', ');
  }
  return mimeTypes
    .map((type, index) => `${type};q=${qualities[index]}`)
    .join(', ');
};

/**
 * Parses Content-Type header to extract MIME type and charset.
 *
 * @param {string} contentType - Content-Type header value
 * @returns {object} Parsed content type information
 *
 * @example
 * ```typescript
 * const parsed = parseContentType('application/json; charset=utf-8');
 * // Result: { mimeType: 'application/json', charset: 'utf-8', parameters: {...} }
 * ```
 */
export const parseContentType = (contentType: string) => {
  const [mimeType, ...params] = contentType.split(';').map((s) => s.trim());
  const parameters: Record<string, string> = {};

  params.forEach((param) => {
    const [key, value] = param.split('=').map((s) => s.trim());
    parameters[key] = value;
  });

  return {
    mimeType,
    charset: parameters.charset || 'utf-8',
    parameters,
  };
};

/**
 * Determines best response format based on Accept header.
 *
 * @param {string} acceptHeader - Accept header from request
 * @param {string[]} supportedFormats - Formats supported by API
 * @returns {string | null} Best matching format or null
 *
 * @example
 * ```typescript
 * const format = negotiateContentType(
 *   'application/json, application/xml;q=0.9',
 *   ['application/json', 'application/xml', 'text/html']
 * );
 * // Result: 'application/json'
 * ```
 */
export const negotiateContentType = (
  acceptHeader: string,
  supportedFormats: string[],
): string | null => {
  const acceptedTypes = acceptHeader.split(',').map((type) => {
    const [mimeType, qValue] = type.trim().split(';');
    const quality = qValue ? parseFloat(qValue.split('=')[1]) : 1.0;
    return { mimeType: mimeType.trim(), quality };
  });

  acceptedTypes.sort((a, b) => b.quality - a.quality);

  for (const accepted of acceptedTypes) {
    if (supportedFormats.includes(accepted.mimeType)) {
      return accepted.mimeType;
    }
  }

  return null;
};

// ============================================================================
// CORS UTILITIES
// ============================================================================

/**
 * Creates CORS headers for API responses.
 *
 * @param {string | string[]} allowedOrigins - Allowed origin(s)
 * @param {string[]} [allowedMethods] - Allowed HTTP methods
 * @param {string[]} [allowedHeaders] - Allowed headers
 * @returns {Record<string, string>} CORS headers object
 *
 * @example
 * ```typescript
 * const headers = createCorsHeaders(
 *   ['https://app.example.com', 'https://admin.example.com'],
 *   ['GET', 'POST', 'PUT', 'DELETE'],
 *   ['Content-Type', 'Authorization']
 * );
 * ```
 */
export const createCorsHeaders = (
  allowedOrigins: string | string[],
  allowedMethods?: string[],
  allowedHeaders?: string[],
): Record<string, string> => {
  const origins = Array.isArray(allowedOrigins)
    ? allowedOrigins.join(', ')
    : allowedOrigins;

  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': origins,
    'Access-Control-Allow-Credentials': 'true',
  };

  if (allowedMethods && allowedMethods.length > 0) {
    headers['Access-Control-Allow-Methods'] = allowedMethods.join(', ');
  }

  if (allowedHeaders && allowedHeaders.length > 0) {
    headers['Access-Control-Allow-Headers'] = allowedHeaders.join(', ');
  }

  return headers;
};

/**
 * Checks if origin is allowed based on CORS configuration.
 *
 * @param {string} origin - Request origin
 * @param {string | string[] | RegExp} allowedOrigins - Allowed origins (string, array, or regex)
 * @returns {boolean} True if origin is allowed
 *
 * @example
 * ```typescript
 * isOriginAllowed('https://app.example.com', ['https://app.example.com']); // true
 * isOriginAllowed('https://app.example.com', /^https:\/\/.*\.example\.com$/); // true
 * isOriginAllowed('https://evil.com', ['https://app.example.com']); // false
 * ```
 */
export const isOriginAllowed = (
  origin: string,
  allowedOrigins: string | string[] | RegExp,
): boolean => {
  if (allowedOrigins === '*') return true;
  if (allowedOrigins instanceof RegExp) return allowedOrigins.test(origin);
  if (Array.isArray(allowedOrigins)) return allowedOrigins.includes(origin);
  return allowedOrigins === origin;
};

/**
 * Creates preflight response headers for CORS OPTIONS request.
 *
 * @param {number} [maxAge] - Max age in seconds for preflight cache
 * @returns {Record<string, string>} Preflight headers
 *
 * @example
 * ```typescript
 * const headers = createPreflightHeaders(86400); // 24 hours
 * // Result: { 'Access-Control-Max-Age': '86400' }
 * ```
 */
export const createPreflightHeaders = (
  maxAge: number = 86400,
): Record<string, string> => {
  return {
    'Access-Control-Max-Age': String(maxAge),
  };
};

// ============================================================================
// API KEY MANAGEMENT
// ============================================================================

/**
 * Generates a random API key.
 *
 * @param {number} [length] - Key length (default: 32)
 * @param {string} [prefix] - Optional prefix (e.g., 'api_key_', 'token_')
 * @returns {string} Generated API key
 *
 * @example
 * ```typescript
 * const apiKey = generateApiKey(32, 'api_key_');
 * // Result: 'api_key_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
 * ```
 */
export const generateApiKey = (length: number = 32, prefix?: string): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? `${prefix}${key}` : key;
};

/**
 * Validates API key format and prefix.
 *
 * @param {string} apiKey - API key to validate
 * @param {string} [expectedPrefix] - Expected prefix (optional)
 * @param {number} [minLength] - Minimum key length (default: 20)
 * @returns {boolean} True if API key is valid
 *
 * @example
 * ```typescript
 * validateApiKey('api_key_a1b2c3d4e5f6g7h8i9j0', 'api_key_', 20); // true
 * validateApiKey('invalid', 'api_key_', 20); // false
 * validateApiKey('token_a1b2c3d4e5f6g7h8i9j0', 'api_key_', 20); // false (wrong prefix)
 * ```
 */
export const validateApiKey = (
  apiKey: string,
  expectedPrefix?: string,
  minLength: number = 20,
): boolean => {
  if (!apiKey || apiKey.length < minLength) return false;
  if (expectedPrefix && !apiKey.startsWith(expectedPrefix)) return false;
  return /^[A-Za-z0-9_-]+$/.test(apiKey);
};

export default {
  // HTTP client helpers
  createFetchRequest,
  createGetRequest,
  createPostRequest,
  createPutRequest,
  createPatchRequest,
  createDeleteRequest,
  addAuthHeader,

  // Request/response transformers
  appendQueryParams,
  parseJsonResponse,
  transformToSnakeCase,
  transformToCamelCase,
  extractPaginationMetadata,
  serializeRequestBody,

  // Error handling
  createApiError,
  getErrorNameFromStatus,
  isClientError,
  isServerError,
  isRetryableError,
  handleApiResponse,

  // Retry logic
  retryWithBackoff,
  createRetryConfig,
  sleep,
  calculateRetryDelay,
  fetchWithRetry,

  // Rate limiting
  createRateLimiter,
  parseRateLimitHeaders,
  getTimeUntilRateLimitReset,
  shouldDelayRequest,

  // API versioning
  addVersionToUrl,
  addVersionHeader,
  extractVersionFromUrl,
  compareVersions,

  // Content negotiation
  createAcceptHeader,
  parseContentType,
  negotiateContentType,

  // CORS
  createCorsHeaders,
  isOriginAllowed,
  createPreflightHeaders,

  // API key management
  generateApiKey,
  validateApiKey,
};
