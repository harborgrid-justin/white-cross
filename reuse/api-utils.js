"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApiKey = exports.generateApiKey = exports.createPreflightHeaders = exports.isOriginAllowed = exports.createCorsHeaders = exports.negotiateContentType = exports.parseContentType = exports.createAcceptHeader = exports.compareVersions = exports.extractVersionFromUrl = exports.addVersionHeader = exports.addVersionToUrl = exports.shouldDelayRequest = exports.getTimeUntilRateLimitReset = exports.parseRateLimitHeaders = exports.createRateLimiter = exports.fetchWithRetry = exports.calculateRetryDelay = exports.sleep = exports.createRetryConfig = exports.retryWithBackoff = exports.handleApiResponse = exports.isRetryableError = exports.isServerError = exports.isClientError = exports.getErrorNameFromStatus = exports.createApiError = exports.serializeRequestBody = exports.extractPaginationMetadata = exports.transformToCamelCase = exports.transformToSnakeCase = exports.parseJsonResponse = exports.appendQueryParams = exports.addAuthHeader = exports.createDeleteRequest = exports.createPatchRequest = exports.createPutRequest = exports.createPostRequest = exports.createGetRequest = exports.createFetchRequest = void 0;
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
const createFetchRequest = async (url, options, headers) => {
    const defaultHeaders = {
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
exports.createFetchRequest = createFetchRequest;
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
const createGetRequest = async (baseUrl, params, options) => {
    const url = params ? (0, exports.appendQueryParams)(baseUrl, params) : baseUrl;
    return (0, exports.createFetchRequest)(url, { ...options, method: 'GET' });
};
exports.createGetRequest = createGetRequest;
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
const createPostRequest = async (url, body, options) => {
    return (0, exports.createFetchRequest)(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
    });
};
exports.createPostRequest = createPostRequest;
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
const createPutRequest = async (url, body, options) => {
    return (0, exports.createFetchRequest)(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
    });
};
exports.createPutRequest = createPutRequest;
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
const createPatchRequest = async (url, body, options) => {
    return (0, exports.createFetchRequest)(url, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(body),
    });
};
exports.createPatchRequest = createPatchRequest;
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
const createDeleteRequest = async (url, options) => {
    return (0, exports.createFetchRequest)(url, { ...options, method: 'DELETE' });
};
exports.createDeleteRequest = createDeleteRequest;
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
const addAuthHeader = (token, scheme = 'Bearer') => {
    return {
        Authorization: `${scheme} ${token}`,
    };
};
exports.addAuthHeader = addAuthHeader;
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
const appendQueryParams = (url, params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });
    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
};
exports.appendQueryParams = appendQueryParams;
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
const parseJsonResponse = async (response) => {
    const text = await response.text();
    if (!text) {
        return {};
    }
    try {
        return JSON.parse(text);
    }
    catch (error) {
        throw new Error(`Failed to parse JSON response: ${error.message}`);
    }
};
exports.parseJsonResponse = parseJsonResponse;
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
const transformToSnakeCase = (obj) => {
    const result = {};
    Object.entries(obj).forEach(([key, value]) => {
        const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        result[snakeKey] = value;
    });
    return result;
};
exports.transformToSnakeCase = transformToSnakeCase;
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
const transformToCamelCase = (obj) => {
    const result = {};
    Object.entries(obj).forEach(([key, value]) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        result[camelKey] = value;
    });
    return result;
};
exports.transformToCamelCase = transformToCamelCase;
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
const extractPaginationMetadata = (response) => {
    return {
        page: parseInt(response.headers.get('X-Page') || '1', 10),
        limit: parseInt(response.headers.get('X-Limit') || '20', 10),
        total: parseInt(response.headers.get('X-Total') || '0', 10),
        totalPages: parseInt(response.headers.get('X-Total-Pages') || '0', 10),
    };
};
exports.extractPaginationMetadata = extractPaginationMetadata;
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
const serializeRequestBody = (body, contentType) => {
    if (contentType === 'application/json') {
        return JSON.stringify(body);
    }
    else if (contentType === 'application/x-www-form-urlencoded') {
        const params = new URLSearchParams();
        Object.entries(body).forEach(([key, value]) => {
            params.append(key, String(value));
        });
        return params.toString();
    }
    else if (contentType === 'multipart/form-data') {
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
            formData.append(key, value);
        });
        return formData;
    }
    return JSON.stringify(body);
};
exports.serializeRequestBody = serializeRequestBody;
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
const createApiError = (statusCode, message, details) => {
    return {
        statusCode,
        message,
        error: (0, exports.getErrorNameFromStatus)(statusCode),
        details,
    };
};
exports.createApiError = createApiError;
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
const getErrorNameFromStatus = (statusCode) => {
    const statusNames = {
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
exports.getErrorNameFromStatus = getErrorNameFromStatus;
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
const isClientError = (statusCode) => {
    return statusCode >= 400 && statusCode < 500;
};
exports.isClientError = isClientError;
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
const isServerError = (statusCode) => {
    return statusCode >= 500 && statusCode < 600;
};
exports.isServerError = isServerError;
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
const isRetryableError = (statusCode) => {
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
    return retryableStatusCodes.includes(statusCode);
};
exports.isRetryableError = isRetryableError;
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
const handleApiResponse = async (response) => {
    if (!response.ok) {
        const errorData = await (0, exports.parseJsonResponse)(response);
        throw (0, exports.createApiError)(response.status, errorData?.message || response.statusText, errorData);
    }
    return (0, exports.parseJsonResponse)(response);
};
exports.handleApiResponse = handleApiResponse;
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
const retryWithBackoff = async (fn, config) => {
    const { maxRetries, retryDelay, backoffMultiplier = 2, retryableStatusCodes = [408, 429, 500, 502, 503, 504], } = config;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            const isLastAttempt = attempt === maxRetries;
            const shouldRetry = error.statusCode && retryableStatusCodes.includes(error.statusCode);
            if (isLastAttempt || !shouldRetry) {
                throw error;
            }
            const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
            await (0, exports.sleep)(delay);
        }
    }
    throw lastError;
};
exports.retryWithBackoff = retryWithBackoff;
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
const createRetryConfig = (overrides) => {
    return {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2,
        retryableStatusCodes: [408, 429, 500, 502, 503, 504],
        ...overrides,
    };
};
exports.createRetryConfig = createRetryConfig;
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
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;
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
const calculateRetryDelay = (baseDelay, attempt, jitterFactor = 0.1) => {
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const jitter = exponentialDelay * jitterFactor;
    return exponentialDelay + (Math.random() * 2 - 1) * jitter;
};
exports.calculateRetryDelay = calculateRetryDelay;
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
const fetchWithRetry = async (url, options, retryConfig) => {
    const config = (0, exports.createRetryConfig)(retryConfig);
    return (0, exports.retryWithBackoff)(() => (0, exports.createFetchRequest)(url, options), config);
};
exports.fetchWithRetry = fetchWithRetry;
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
const createRateLimiter = (config) => {
    const { maxRequests, windowMs } = config;
    const requests = new Map();
    return {
        checkLimit: (key) => {
            const now = Date.now();
            const userRequests = requests.get(key) || [];
            const recentRequests = userRequests.filter((timestamp) => now - timestamp < windowMs);
            if (recentRequests.length >= maxRequests) {
                return false;
            }
            recentRequests.push(now);
            requests.set(key, recentRequests);
            return true;
        },
        reset: (key) => {
            requests.delete(key);
        },
        getRemainingRequests: (key) => {
            const now = Date.now();
            const userRequests = requests.get(key) || [];
            const recentRequests = userRequests.filter((timestamp) => now - timestamp < windowMs);
            return Math.max(0, maxRequests - recentRequests.length);
        },
    };
};
exports.createRateLimiter = createRateLimiter;
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
const parseRateLimitHeaders = (response) => {
    return {
        limit: parseInt(response.headers.get('X-RateLimit-Limit') || '0', 10),
        remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0', 10),
        reset: parseInt(response.headers.get('X-RateLimit-Reset') || '0', 10),
    };
};
exports.parseRateLimitHeaders = parseRateLimitHeaders;
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
const getTimeUntilRateLimitReset = (resetTimestamp) => {
    return Math.max(0, resetTimestamp * 1000 - Date.now());
};
exports.getTimeUntilRateLimitReset = getTimeUntilRateLimitReset;
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
const shouldDelayRequest = (response) => {
    const { remaining } = (0, exports.parseRateLimitHeaders)(response);
    return remaining === 0 || response.status === 429;
};
exports.shouldDelayRequest = shouldDelayRequest;
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
const addVersionToUrl = (baseUrl, version) => {
    const versionStr = typeof version === 'number' ? `v${version}` : version;
    const url = new URL(baseUrl);
    url.pathname = `/${versionStr}${url.pathname}`;
    return url.toString();
};
exports.addVersionToUrl = addVersionToUrl;
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
const addVersionHeader = (version, headerName = 'X-API-Version') => {
    return {
        [headerName]: String(version),
    };
};
exports.addVersionHeader = addVersionHeader;
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
const extractVersionFromUrl = (url) => {
    const match = url.match(/\/v(\d+)\//);
    return match ? `v${match[1]}` : null;
};
exports.extractVersionFromUrl = extractVersionFromUrl;
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
const compareVersions = (version1, version2) => {
    const v1 = version1.replace(/^v/, '').split('.').map(Number);
    const v2 = version2.replace(/^v/, '').split('.').map(Number);
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
        const num1 = v1[i] || 0;
        const num2 = v2[i] || 0;
        if (num1 < num2)
            return -1;
        if (num1 > num2)
            return 1;
    }
    return 0;
};
exports.compareVersions = compareVersions;
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
const createAcceptHeader = (mimeTypes, qualities) => {
    if (!qualities || qualities.length !== mimeTypes.length) {
        return mimeTypes.join(', ');
    }
    return mimeTypes
        .map((type, index) => `${type};q=${qualities[index]}`)
        .join(', ');
};
exports.createAcceptHeader = createAcceptHeader;
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
const parseContentType = (contentType) => {
    const [mimeType, ...params] = contentType.split(';').map((s) => s.trim());
    const parameters = {};
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
exports.parseContentType = parseContentType;
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
const negotiateContentType = (acceptHeader, supportedFormats) => {
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
exports.negotiateContentType = negotiateContentType;
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
const createCorsHeaders = (allowedOrigins, allowedMethods, allowedHeaders) => {
    const origins = Array.isArray(allowedOrigins)
        ? allowedOrigins.join(', ')
        : allowedOrigins;
    const headers = {
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
exports.createCorsHeaders = createCorsHeaders;
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
const isOriginAllowed = (origin, allowedOrigins) => {
    if (allowedOrigins === '*')
        return true;
    if (allowedOrigins instanceof RegExp)
        return allowedOrigins.test(origin);
    if (Array.isArray(allowedOrigins))
        return allowedOrigins.includes(origin);
    return allowedOrigins === origin;
};
exports.isOriginAllowed = isOriginAllowed;
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
const createPreflightHeaders = (maxAge = 86400) => {
    return {
        'Access-Control-Max-Age': String(maxAge),
    };
};
exports.createPreflightHeaders = createPreflightHeaders;
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
const generateApiKey = (length = 32, prefix) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix ? `${prefix}${key}` : key;
};
exports.generateApiKey = generateApiKey;
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
const validateApiKey = (apiKey, expectedPrefix, minLength = 20) => {
    if (!apiKey || apiKey.length < minLength)
        return false;
    if (expectedPrefix && !apiKey.startsWith(expectedPrefix))
        return false;
    return /^[A-Za-z0-9_-]+$/.test(apiKey);
};
exports.validateApiKey = validateApiKey;
exports.default = {
    // HTTP client helpers
    createFetchRequest: exports.createFetchRequest,
    createGetRequest: exports.createGetRequest,
    createPostRequest: exports.createPostRequest,
    createPutRequest: exports.createPutRequest,
    createPatchRequest: exports.createPatchRequest,
    createDeleteRequest: exports.createDeleteRequest,
    addAuthHeader: exports.addAuthHeader,
    // Request/response transformers
    appendQueryParams: exports.appendQueryParams,
    parseJsonResponse: exports.parseJsonResponse,
    transformToSnakeCase: exports.transformToSnakeCase,
    transformToCamelCase: exports.transformToCamelCase,
    extractPaginationMetadata: exports.extractPaginationMetadata,
    serializeRequestBody: exports.serializeRequestBody,
    // Error handling
    createApiError: exports.createApiError,
    getErrorNameFromStatus: exports.getErrorNameFromStatus,
    isClientError: exports.isClientError,
    isServerError: exports.isServerError,
    isRetryableError: exports.isRetryableError,
    handleApiResponse: exports.handleApiResponse,
    // Retry logic
    retryWithBackoff: exports.retryWithBackoff,
    createRetryConfig: exports.createRetryConfig,
    sleep: exports.sleep,
    calculateRetryDelay: exports.calculateRetryDelay,
    fetchWithRetry: exports.fetchWithRetry,
    // Rate limiting
    createRateLimiter: exports.createRateLimiter,
    parseRateLimitHeaders: exports.parseRateLimitHeaders,
    getTimeUntilRateLimitReset: exports.getTimeUntilRateLimitReset,
    shouldDelayRequest: exports.shouldDelayRequest,
    // API versioning
    addVersionToUrl: exports.addVersionToUrl,
    addVersionHeader: exports.addVersionHeader,
    extractVersionFromUrl: exports.extractVersionFromUrl,
    compareVersions: exports.compareVersions,
    // Content negotiation
    createAcceptHeader: exports.createAcceptHeader,
    parseContentType: exports.parseContentType,
    negotiateContentType: exports.negotiateContentType,
    // CORS
    createCorsHeaders: exports.createCorsHeaders,
    isOriginAllowed: exports.isOriginAllowed,
    createPreflightHeaders: exports.createPreflightHeaders,
    // API key management
    generateApiKey: exports.generateApiKey,
    validateApiKey: exports.validateApiKey,
};
//# sourceMappingURL=api-utils.js.map