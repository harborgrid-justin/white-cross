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
export declare class HttpError extends Error {
    status: number;
    response?: any | undefined;
    config?: HttpRequestConfig | undefined;
    constructor(message: string, status: number, response?: any | undefined, config?: HttpRequestConfig | undefined);
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
export declare function createHttpClient(defaults?: Partial<HttpRequestConfig>): {
    request: <T = any>(config: HttpRequestConfig) => Promise<HttpResponse<T>>;
    get: <T = any>(url: string, config?: Partial<HttpRequestConfig>) => Promise<HttpResponse<T>>;
    post: <T = any>(url: string, data?: any, config?: Partial<HttpRequestConfig>) => Promise<HttpResponse<T>>;
    put: <T = any>(url: string, data?: any, config?: Partial<HttpRequestConfig>) => Promise<HttpResponse<T>>;
    patch: <T = any>(url: string, data?: any, config?: Partial<HttpRequestConfig>) => Promise<HttpResponse<T>>;
    delete: <T = any>(url: string, config?: Partial<HttpRequestConfig>) => Promise<HttpResponse<T>>;
    head: (url: string, config?: Partial<HttpRequestConfig>) => Promise<HttpResponse<any>>;
    options: (url: string, config?: Partial<HttpRequestConfig>) => Promise<HttpResponse<any>>;
};
/**
 * Builds URL with query parameters
 *
 * @param url - Base URL
 * @param params - Query parameters
 * @returns URL with query string
 */
export declare function buildUrlWithParams(url: string, params?: Record<string, any>): string;
/**
 * Calculates retry delay with optional backoff
 *
 * @param baseDelay - Base delay in milliseconds
 * @param attempt - Current attempt number
 * @param backoff - Backoff strategy
 * @returns Delay in milliseconds
 */
export declare function calculateRetryDelay(baseDelay: number, attempt: number, backoff?: 'linear' | 'exponential'): number;
/**
 * Sleep utility function
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Checks if HTTP status code is successful (2xx)
 *
 * @param status - HTTP status code
 * @returns True if status is successful
 */
export declare function isSuccessStatus(status: number): boolean;
/**
 * Checks if HTTP status code is a client error (4xx)
 *
 * @param status - HTTP status code
 * @returns True if status is client error
 */
export declare function isClientError(status: number): boolean;
/**
 * Checks if HTTP status code is a server error (5xx)
 *
 * @param status - HTTP status code
 * @returns True if status is server error
 */
export declare function isServerError(status: number): boolean;
/**
 * Parses content type header
 *
 * @param contentType - Content-Type header value
 * @returns Parsed content type information
 */
export declare function parseContentType(contentType: string): {
    type: string;
    charset?: string;
    boundary?: string;
};
/**
 * Creates a request interceptor
 *
 * @param interceptor - Interceptor function
 * @returns Intercepted request function
 */
export declare function createRequestInterceptor(interceptor: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>): (config: HttpRequestConfig) => Promise<HttpRequestConfig>;
/**
 * Creates a response interceptor
 *
 * @param interceptor - Interceptor function
 * @returns Intercepted response function
 */
export declare function createResponseInterceptor<T = any>(interceptor: (response: HttpResponse<T>) => HttpResponse<T> | Promise<HttpResponse<T>>): (response: HttpResponse<T>) => Promise<HttpResponse<T>>;
/**
 * Common HTTP status codes
 */
export declare const HttpStatus: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly ACCEPTED: 202;
    readonly NO_CONTENT: 204;
    readonly MOVED_PERMANENTLY: 301;
    readonly FOUND: 302;
    readonly NOT_MODIFIED: 304;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly METHOD_NOT_ALLOWED: 405;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly NOT_IMPLEMENTED: 501;
    readonly BAD_GATEWAY: 502;
    readonly SERVICE_UNAVAILABLE: 503;
    readonly GATEWAY_TIMEOUT: 504;
};
/**
 * Common HTTP headers
 */
export declare const HttpHeaders: {
    readonly ACCEPT: "Accept";
    readonly AUTHORIZATION: "Authorization";
    readonly CACHE_CONTROL: "Cache-Control";
    readonly CONTENT_TYPE: "Content-Type";
    readonly CONTENT_LENGTH: "Content-Length";
    readonly COOKIE: "Cookie";
    readonly ETAG: "ETag";
    readonly IF_NONE_MATCH: "If-None-Match";
    readonly LOCATION: "Location";
    readonly USER_AGENT: "User-Agent";
    readonly X_REQUESTED_WITH: "X-Requested-With";
    readonly X_API_KEY: "X-API-Key";
};
/**
 * HTTP Kit - Main export
 */
declare const _default: {
    createHttpClient: typeof createHttpClient;
    buildUrlWithParams: typeof buildUrlWithParams;
    calculateRetryDelay: typeof calculateRetryDelay;
    sleep: typeof sleep;
    isSuccessStatus: typeof isSuccessStatus;
    isClientError: typeof isClientError;
    isServerError: typeof isServerError;
    parseContentType: typeof parseContentType;
    createRequestInterceptor: typeof createRequestInterceptor;
    createResponseInterceptor: typeof createResponseInterceptor;
    HttpStatus: {
        readonly OK: 200;
        readonly CREATED: 201;
        readonly ACCEPTED: 202;
        readonly NO_CONTENT: 204;
        readonly MOVED_PERMANENTLY: 301;
        readonly FOUND: 302;
        readonly NOT_MODIFIED: 304;
        readonly BAD_REQUEST: 400;
        readonly UNAUTHORIZED: 401;
        readonly FORBIDDEN: 403;
        readonly NOT_FOUND: 404;
        readonly METHOD_NOT_ALLOWED: 405;
        readonly CONFLICT: 409;
        readonly UNPROCESSABLE_ENTITY: 422;
        readonly TOO_MANY_REQUESTS: 429;
        readonly INTERNAL_SERVER_ERROR: 500;
        readonly NOT_IMPLEMENTED: 501;
        readonly BAD_GATEWAY: 502;
        readonly SERVICE_UNAVAILABLE: 503;
        readonly GATEWAY_TIMEOUT: 504;
    };
    HttpHeaders: {
        readonly ACCEPT: "Accept";
        readonly AUTHORIZATION: "Authorization";
        readonly CACHE_CONTROL: "Cache-Control";
        readonly CONTENT_TYPE: "Content-Type";
        readonly CONTENT_LENGTH: "Content-Length";
        readonly COOKIE: "Cookie";
        readonly ETAG: "ETag";
        readonly IF_NONE_MATCH: "If-None-Match";
        readonly LOCATION: "Location";
        readonly USER_AGENT: "User-Agent";
        readonly X_REQUESTED_WITH: "X-Requested-With";
        readonly X_API_KEY: "X-API-Key";
    };
    HttpError: typeof HttpError;
};
export default _default;
//# sourceMappingURL=http-kit.d.ts.map