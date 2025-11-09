/**
 * @fileoverview API Gateway Utilities
 * @module core/api/gateway
 *
 * Core API gateway functionality including routing, middleware chaining,
 * and request/response transformation.
 */
import type { Request, RequestHandler } from 'express';
/**
 * Gateway configuration options
 */
export interface GatewayConfig {
    /** Base path for the gateway */
    basePath?: string;
    /** Enable CORS */
    cors?: boolean;
    /** Custom CORS options */
    corsOptions?: {
        origin?: string | string[] | boolean;
        methods?: string[];
        allowedHeaders?: string[];
        credentials?: boolean;
    };
    /** Request timeout in milliseconds */
    timeout?: number;
    /** Enable request logging */
    logging?: boolean;
}
/**
 * API route configuration
 */
export interface RouteConfig {
    /** HTTP method */
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
    /** Route path */
    path: string;
    /** Route handler */
    handler: RequestHandler;
    /** Route-specific middleware */
    middleware?: RequestHandler[];
    /** Route description for documentation */
    description?: string;
}
/**
 * Creates an API gateway with the specified configuration
 *
 * @param config - Gateway configuration options
 * @returns Express router with configured middleware
 *
 * @example
 * ```typescript
 * const gateway = createApiGateway({
 *   basePath: '/api/v1',
 *   cors: true,
 *   timeout: 30000,
 *   logging: true
 * });
 * ```
 */
export declare function createApiGateway(config?: GatewayConfig): any;
/**
 * Creates CORS middleware with specified options
 *
 * @param options - CORS configuration options
 * @returns Express middleware function
 */
export declare function createCorsMiddleware(options?: GatewayConfig['corsOptions']): RequestHandler;
/**
 * Creates timeout middleware
 *
 * @param timeout - Timeout in milliseconds
 * @returns Express middleware function
 */
export declare function createTimeoutMiddleware(timeout: number): RequestHandler;
/**
 * Creates logging middleware for request/response tracking
 *
 * @returns Express middleware function
 */
export declare function createLoggingMiddleware(): RequestHandler;
/**
 * Creates a route handler with middleware chaining
 *
 * @param config - Route configuration
 * @returns Combined route handler with middleware
 *
 * @example
 * ```typescript
 * const route = createRoute({
 *   method: 'GET',
 *   path: '/users',
 *   middleware: [authenticate, authorize],
 *   handler: getUsersHandler
 * });
 * ```
 */
export declare function createRoute(config: RouteConfig): {
    method: string;
    path: string;
    handlers: RequestHandler[];
};
/**
 * Creates a request transformer middleware
 *
 * @param transform - Transformation function
 * @returns Express middleware function
 */
export declare function createRequestTransformer(transform: (req: Request) => void | Promise<void>): RequestHandler;
/**
 * Creates a response transformer middleware
 *
 * @param transform - Transformation function
 * @returns Express middleware function
 */
export declare function createResponseTransformer(transform: (data: any) => any | Promise<any>): RequestHandler;
/**
 * Creates error handling middleware
 *
 * @returns Express error handling middleware
 */
export declare function createErrorHandler(): any;
//# sourceMappingURL=gateway.d.ts.map