/**
 * @fileoverview API Gateway Kit
 * @module core/api/gateway-kit
 *
 * Complete API gateway solution including rate limiting, authentication,
 * circuit breaking, and request/response transformation.
 */
import type { Request, RequestHandler } from 'express';
/**
 * Rate limiter configuration
 */
export interface RateLimiterConfig {
    /** Time window in milliseconds */
    windowMs: number;
    /** Maximum requests per window */
    maxRequests: number;
    /** Rate limiting strategy */
    strategy?: 'fixed' | 'sliding';
    /** Key generator function */
    keyGenerator?: (req: Request) => string;
    /** Handler for rate limit exceeded */
    handler?: RequestHandler;
    /** Skip function to bypass rate limiting */
    skip?: (req: Request) => boolean;
}
/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
    /** Failure threshold to open circuit */
    failureThreshold: number;
    /** Success threshold to close circuit */
    successThreshold: number;
    /** Timeout in milliseconds */
    timeout: number;
    /** Reset timeout in milliseconds */
    resetTimeout: number;
}
/**
 * Circuit breaker states
 */
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
/**
 * Creates rate limiting middleware
 *
 * @param config - Rate limiter configuration
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * const limiter = createRateLimiter({
 *   windowMs: 60000,
 *   maxRequests: 100,
 *   strategy: 'sliding'
 * });
 * app.use('/api', limiter);
 * ```
 */
export declare function createRateLimiter(config: RateLimiterConfig): RequestHandler;
/**
 * Creates API key authentication middleware
 *
 * @param validateKey - Function to validate API key
 * @param options - Authentication options
 * @returns Express middleware function
 */
export declare function createApiKeyAuthMiddleware(validateKey: (key: string) => Promise<boolean> | boolean, options?: {
    headerName?: string;
    queryParam?: string;
}): RequestHandler;
/**
 * Creates circuit breaker for fault tolerance
 *
 * @param config - Circuit breaker configuration
 * @returns Circuit breaker instance
 */
export declare function createCircuitBreaker(config: CircuitBreakerConfig): {
    execute: <T>(fn: () => Promise<T>) => Promise<T>;
    getState: () => CircuitState;
    getStats: () => {
        failures: number;
        successes: number;
        state: CircuitState;
    };
};
/**
 * Creates request transformation middleware
 *
 * @param transformers - Object with transformation functions
 * @returns Express middleware function
 */
export declare function createRequestTransformMiddleware(transformers: {
    headers?: (headers: any) => any;
    query?: (query: any) => any;
    body?: (body: any) => any;
}): RequestHandler;
/**
 * Creates response transformation middleware
 *
 * @param transform - Transformation function
 * @returns Express middleware function
 */
export declare function createResponseTransformMiddleware(transform: (data: any, req: Request) => any | Promise<any>): RequestHandler;
/**
 * Creates request/response logging middleware
 *
 * @param logger - Logger function
 * @returns Express middleware function
 */
export declare function createLoggingMiddleware(logger?: (data: {
    method: string;
    path: string;
    statusCode?: number;
    duration?: number;
    timestamp: string;
}) => void): RequestHandler;
/**
 * Creates request validation middleware
 *
 * @param schema - Validation schema
 * @returns Express middleware function
 */
export declare function createValidationMiddleware(schema: {
    headers?: (headers: any) => {
        valid: boolean;
        errors?: string[];
    };
    query?: (query: any) => {
        valid: boolean;
        errors?: string[];
    };
    params?: (params: any) => {
        valid: boolean;
        errors?: string[];
    };
    body?: (body: any) => {
        valid: boolean;
        errors?: string[];
    };
}): RequestHandler;
/**
 * API Gateway Kit - Main export
 */
declare const _default: {
    createRateLimiter: typeof createRateLimiter;
    createApiKeyAuthMiddleware: typeof createApiKeyAuthMiddleware;
    createCircuitBreaker: typeof createCircuitBreaker;
    createRequestTransformMiddleware: typeof createRequestTransformMiddleware;
    createResponseTransformMiddleware: typeof createResponseTransformMiddleware;
    createLoggingMiddleware: typeof createLoggingMiddleware;
    createValidationMiddleware: typeof createValidationMiddleware;
};
export default _default;
//# sourceMappingURL=gateway-kit.d.ts.map