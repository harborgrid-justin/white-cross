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
export declare const createFetchRequest: (url: string, options?: RequestInit, headers?: Record<string, string>) => Promise<Response>;
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
export declare const createGetRequest: (baseUrl: string, params?: Record<string, any>, options?: RequestInit) => Promise<Response>;
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
export declare const createPostRequest: (url: string, body: any, options?: RequestInit) => Promise<Response>;
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
export declare const createPutRequest: (url: string, body: any, options?: RequestInit) => Promise<Response>;
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
export declare const createPatchRequest: (url: string, body: any, options?: RequestInit) => Promise<Response>;
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
export declare const createDeleteRequest: (url: string, options?: RequestInit) => Promise<Response>;
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
export declare const addAuthHeader: (token: string, scheme?: string) => Record<string, string>;
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
export declare const appendQueryParams: (url: string, params: Record<string, any>) => string;
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
export declare const parseJsonResponse: <T>(response: Response) => Promise<T>;
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
export declare const transformToSnakeCase: (obj: Record<string, any>) => Record<string, any>;
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
export declare const transformToCamelCase: (obj: Record<string, any>) => Record<string, any>;
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
export declare const extractPaginationMetadata: (response: Response) => {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
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
export declare const serializeRequestBody: (body: any, contentType: string) => string | FormData;
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
export declare const createApiError: (statusCode: number, message: string, details?: any) => ApiError;
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
export declare const getErrorNameFromStatus: (statusCode: number) => string;
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
export declare const isClientError: (statusCode: number) => boolean;
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
export declare const isServerError: (statusCode: number) => boolean;
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
export declare const isRetryableError: (statusCode: number) => boolean;
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
export declare const handleApiResponse: <T>(response: Response) => Promise<T>;
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
export declare const retryWithBackoff: <T>(fn: () => Promise<T>, config: RetryConfig) => Promise<T>;
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
export declare const createRetryConfig: (overrides?: Partial<RetryConfig>) => RetryConfig;
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
export declare const sleep: (ms: number) => Promise<void>;
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
export declare const calculateRetryDelay: (baseDelay: number, attempt: number, jitterFactor?: number) => number;
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
export declare const fetchWithRetry: (url: string, options?: RequestInit, retryConfig?: Partial<RetryConfig>) => Promise<Response>;
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
export declare const createRateLimiter: (config: RateLimitConfig) => {
    checkLimit: (key: string) => boolean;
    reset: (key: string) => void;
    getRemainingRequests: (key: string) => number;
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
export declare const parseRateLimitHeaders: (response: Response) => {
    limit: number;
    remaining: number;
    reset: number;
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
export declare const getTimeUntilRateLimitReset: (resetTimestamp: number) => number;
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
export declare const shouldDelayRequest: (response: Response) => boolean;
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
export declare const addVersionToUrl: (baseUrl: string, version: string | number) => string;
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
export declare const addVersionHeader: (version: string | number, headerName?: string) => Record<string, string>;
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
export declare const extractVersionFromUrl: (url: string) => string | null;
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
export declare const compareVersions: (version1: string, version2: string) => number;
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
export declare const createAcceptHeader: (mimeTypes: string[], qualities?: number[]) => string;
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
export declare const parseContentType: (contentType: string) => {
    mimeType: string;
    charset: string;
    parameters: Record<string, string>;
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
export declare const negotiateContentType: (acceptHeader: string, supportedFormats: string[]) => string | null;
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
export declare const createCorsHeaders: (allowedOrigins: string | string[], allowedMethods?: string[], allowedHeaders?: string[]) => Record<string, string>;
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
export declare const isOriginAllowed: (origin: string, allowedOrigins: string | string[] | RegExp) => boolean;
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
export declare const createPreflightHeaders: (maxAge?: number) => Record<string, string>;
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
export declare const generateApiKey: (length?: number, prefix?: string) => string;
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
export declare const validateApiKey: (apiKey: string, expectedPrefix?: string, minLength?: number) => boolean;
declare const _default: {
    createFetchRequest: (url: string, options?: RequestInit, headers?: Record<string, string>) => Promise<Response>;
    createGetRequest: (baseUrl: string, params?: Record<string, any>, options?: RequestInit) => Promise<Response>;
    createPostRequest: (url: string, body: any, options?: RequestInit) => Promise<Response>;
    createPutRequest: (url: string, body: any, options?: RequestInit) => Promise<Response>;
    createPatchRequest: (url: string, body: any, options?: RequestInit) => Promise<Response>;
    createDeleteRequest: (url: string, options?: RequestInit) => Promise<Response>;
    addAuthHeader: (token: string, scheme?: string) => Record<string, string>;
    appendQueryParams: (url: string, params: Record<string, any>) => string;
    parseJsonResponse: <T>(response: Response) => Promise<T>;
    transformToSnakeCase: (obj: Record<string, any>) => Record<string, any>;
    transformToCamelCase: (obj: Record<string, any>) => Record<string, any>;
    extractPaginationMetadata: (response: Response) => {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    serializeRequestBody: (body: any, contentType: string) => string | FormData;
    createApiError: (statusCode: number, message: string, details?: any) => ApiError;
    getErrorNameFromStatus: (statusCode: number) => string;
    isClientError: (statusCode: number) => boolean;
    isServerError: (statusCode: number) => boolean;
    isRetryableError: (statusCode: number) => boolean;
    handleApiResponse: <T>(response: Response) => Promise<T>;
    retryWithBackoff: <T>(fn: () => Promise<T>, config: RetryConfig) => Promise<T>;
    createRetryConfig: (overrides?: Partial<RetryConfig>) => RetryConfig;
    sleep: (ms: number) => Promise<void>;
    calculateRetryDelay: (baseDelay: number, attempt: number, jitterFactor?: number) => number;
    fetchWithRetry: (url: string, options?: RequestInit, retryConfig?: Partial<RetryConfig>) => Promise<Response>;
    createRateLimiter: (config: RateLimitConfig) => {
        checkLimit: (key: string) => boolean;
        reset: (key: string) => void;
        getRemainingRequests: (key: string) => number;
    };
    parseRateLimitHeaders: (response: Response) => {
        limit: number;
        remaining: number;
        reset: number;
    };
    getTimeUntilRateLimitReset: (resetTimestamp: number) => number;
    shouldDelayRequest: (response: Response) => boolean;
    addVersionToUrl: (baseUrl: string, version: string | number) => string;
    addVersionHeader: (version: string | number, headerName?: string) => Record<string, string>;
    extractVersionFromUrl: (url: string) => string | null;
    compareVersions: (version1: string, version2: string) => number;
    createAcceptHeader: (mimeTypes: string[], qualities?: number[]) => string;
    parseContentType: (contentType: string) => {
        mimeType: string;
        charset: string;
        parameters: Record<string, string>;
    };
    negotiateContentType: (acceptHeader: string, supportedFormats: string[]) => string | null;
    createCorsHeaders: (allowedOrigins: string | string[], allowedMethods?: string[], allowedHeaders?: string[]) => Record<string, string>;
    isOriginAllowed: (origin: string, allowedOrigins: string | string[] | RegExp) => boolean;
    createPreflightHeaders: (maxAge?: number) => Record<string, string>;
    generateApiKey: (length?: number, prefix?: string) => string;
    validateApiKey: (apiKey: string, expectedPrefix?: string, minLength?: number) => boolean;
};
export default _default;
//# sourceMappingURL=api-utils.d.ts.map