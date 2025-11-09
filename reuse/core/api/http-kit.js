"use strict";
/**
 * @fileoverview HTTP Utilities Kit
 * @module core/api/http-kit
 *
 * HTTP client utilities, request builders, response handlers,
 * retry logic, and common HTTP patterns.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpHeaders = exports.HttpStatus = exports.HttpError = void 0;
exports.createHttpClient = createHttpClient;
exports.buildUrlWithParams = buildUrlWithParams;
exports.calculateRetryDelay = calculateRetryDelay;
exports.sleep = sleep;
exports.isSuccessStatus = isSuccessStatus;
exports.isClientError = isClientError;
exports.isServerError = isServerError;
exports.parseContentType = parseContentType;
exports.createRequestInterceptor = createRequestInterceptor;
exports.createResponseInterceptor = createResponseInterceptor;
/**
 * HTTP error type
 */
class HttpError extends Error {
    constructor(message, status, response, config) {
        super(message);
        this.status = status;
        this.response = response;
        this.config = config;
        this.name = 'HttpError';
    }
}
exports.HttpError = HttpError;
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
function createHttpClient(defaults = {}) {
    const request = async (config) => {
        const mergedConfig = {
            method: 'GET',
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
        const fetchOptions = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            signal: AbortSignal.timeout(timeout),
        };
        if (body && method !== 'GET' && method !== 'HEAD') {
            fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
        }
        // Execute request with retry logic
        const executeRequest = async (attempt = 0) => {
            try {
                const response = await fetch(finalUrl, fetchOptions);
                // Parse response data
                const contentType = response.headers.get('content-type');
                let data;
                if (contentType?.includes('application/json')) {
                    data = await response.json();
                }
                else {
                    data = await response.text();
                }
                // Convert headers to object
                const responseHeaders = {};
                response.headers.forEach((value, key) => {
                    responseHeaders[key] = value;
                });
                const httpResponse = {
                    status: response.status,
                    statusText: response.statusText,
                    headers: responseHeaders,
                    data,
                    config: mergedConfig,
                };
                // Check if response is successful
                if (!response.ok) {
                    throw new HttpError(`HTTP Error ${response.status}: ${response.statusText}`, response.status, httpResponse, mergedConfig);
                }
                return httpResponse;
            }
            catch (error) {
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
        get: (url, config) => request({ url, method: 'GET', ...config }),
        post: (url, data, config) => request({ url, method: 'POST', body: data, ...config }),
        put: (url, data, config) => request({ url, method: 'PUT', body: data, ...config }),
        patch: (url, data, config) => request({ url, method: 'PATCH', body: data, ...config }),
        delete: (url, config) => request({ url, method: 'DELETE', ...config }),
        head: (url, config) => request({ url, method: 'HEAD', ...config }),
        options: (url, config) => request({ url, method: 'OPTIONS', ...config }),
    };
}
/**
 * Builds URL with query parameters
 *
 * @param url - Base URL
 * @param params - Query parameters
 * @returns URL with query string
 */
function buildUrlWithParams(url, params) {
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
function calculateRetryDelay(baseDelay, attempt, backoff) {
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
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Checks if HTTP status code is successful (2xx)
 *
 * @param status - HTTP status code
 * @returns True if status is successful
 */
function isSuccessStatus(status) {
    return status >= 200 && status < 300;
}
/**
 * Checks if HTTP status code is a client error (4xx)
 *
 * @param status - HTTP status code
 * @returns True if status is client error
 */
function isClientError(status) {
    return status >= 400 && status < 500;
}
/**
 * Checks if HTTP status code is a server error (5xx)
 *
 * @param status - HTTP status code
 * @returns True if status is server error
 */
function isServerError(status) {
    return status >= 500 && status < 600;
}
/**
 * Parses content type header
 *
 * @param contentType - Content-Type header value
 * @returns Parsed content type information
 */
function parseContentType(contentType) {
    const [type, ...params] = contentType.split(';').map((s) => s.trim());
    const result = { type };
    params.forEach((param) => {
        const [key, value] = param.split('=').map((s) => s.trim());
        if (key === 'charset') {
            result.charset = value;
        }
        else if (key === 'boundary') {
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
function createRequestInterceptor(interceptor) {
    return async (config) => {
        return await interceptor(config);
    };
}
/**
 * Creates a response interceptor
 *
 * @param interceptor - Interceptor function
 * @returns Intercepted response function
 */
function createResponseInterceptor(interceptor) {
    return async (response) => {
        return await interceptor(response);
    };
}
/**
 * Common HTTP status codes
 */
exports.HttpStatus = {
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
};
/**
 * Common HTTP headers
 */
exports.HttpHeaders = {
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
};
/**
 * HTTP Kit - Main export
 */
exports.default = {
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
    HttpStatus: exports.HttpStatus,
    HttpHeaders: exports.HttpHeaders,
    HttpError,
};
//# sourceMappingURL=http-kit.js.map