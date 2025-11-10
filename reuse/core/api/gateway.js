"use strict";
/**
 * @fileoverview API Gateway Utilities
 * @module core/api/gateway
 *
 * Core API gateway functionality including routing, middleware chaining,
 * and request/response transformation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiGateway = createApiGateway;
exports.createCorsMiddleware = createCorsMiddleware;
exports.createTimeoutMiddleware = createTimeoutMiddleware;
exports.createLoggingMiddleware = createLoggingMiddleware;
exports.createRoute = createRoute;
exports.createRequestTransformer = createRequestTransformer;
exports.createResponseTransformer = createResponseTransformer;
exports.createErrorHandler = createErrorHandler;
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
function createApiGateway(config = {}) {
    const { basePath = '', cors = true, corsOptions = {}, timeout = 30000, logging = true, } = config;
    const middleware = [];
    // Add CORS middleware if enabled
    if (cors) {
        middleware.push(createCorsMiddleware(corsOptions));
    }
    // Add timeout middleware
    middleware.push(createTimeoutMiddleware(timeout));
    // Add logging middleware if enabled
    if (logging) {
        middleware.push(createLoggingMiddleware());
    }
    return {
        middleware,
        basePath,
        use: (handler) => middleware.push(handler),
    };
}
/**
 * Creates CORS middleware with specified options
 *
 * @param options - CORS configuration options
 * @returns Express middleware function
 */
function createCorsMiddleware(options = {}) {
    return (req, res, next) => {
        const { origin = '*', methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders = ['Content-Type', 'Authorization'], credentials = true, } = options;
        // Set CORS headers
        if (typeof origin === 'string') {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        else if (Array.isArray(origin)) {
            const requestOrigin = req.headers.origin;
            if (requestOrigin && origin.includes(requestOrigin)) {
                res.setHeader('Access-Control-Allow-Origin', requestOrigin);
            }
        }
        else if (origin === true) {
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
        }
        res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
        res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));
        if (credentials) {
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        }
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            res.status(204).end();
            return;
        }
        next();
    };
}
/**
 * Creates timeout middleware
 *
 * @param timeout - Timeout in milliseconds
 * @returns Express middleware function
 */
function createTimeoutMiddleware(timeout) {
    return (req, res, next) => {
        const timer = setTimeout(() => {
            if (!res.headersSent) {
                res.status(408).json({
                    error: 'Request Timeout',
                    message: `Request exceeded ${timeout}ms timeout`,
                });
            }
        }, timeout);
        // Clear timeout when response finishes
        res.on('finish', () => clearTimeout(timer));
        res.on('close', () => clearTimeout(timer));
        next();
    };
}
/**
 * Creates logging middleware for request/response tracking
 *
 * @returns Express middleware function
 */
function createLoggingMiddleware() {
    return (req, res, next) => {
        const startTime = Date.now();
        // Log request
        console.log(`[API] ${req.method} ${req.path}`, {
            query: req.query,
            headers: req.headers,
            timestamp: new Date().toISOString(),
        });
        // Log response when finished
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            console.log(`[API] ${req.method} ${req.path} - ${res.statusCode}`, {
                duration: `${duration}ms`,
                timestamp: new Date().toISOString(),
            });
        });
        next();
    };
}
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
function createRoute(config) {
    const { method, path, handler, middleware = [] } = config;
    return {
        method,
        path,
        handlers: [...middleware, handler],
    };
}
/**
 * Creates a request transformer middleware
 *
 * @param transform - Transformation function
 * @returns Express middleware function
 */
function createRequestTransformer(transform) {
    return async (req, res, next) => {
        try {
            await transform(req);
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
/**
 * Creates a response transformer middleware
 *
 * @param transform - Transformation function
 * @returns Express middleware function
 */
function createResponseTransformer(transform) {
    return async (req, res, next) => {
        const originalJson = res.json.bind(res);
        res.json = function (data) {
            Promise.resolve(transform(data))
                .then((transformedData) => originalJson(transformedData))
                .catch(next);
            return this;
        };
        next();
    };
}
/**
 * Creates error handling middleware
 *
 * @returns Express error handling middleware
 */
function createErrorHandler() {
    return (error, req, res, next) => {
        const statusCode = error.statusCode || error.status || 500;
        const message = error.message || 'Internal Server Error';
        console.error('[API Error]', {
            error: error.message,
            stack: error.stack,
            path: req.path,
            method: req.method,
        });
        res.status(statusCode).json({
            error: message,
            ...(process.env.NODE_ENV === 'development' && {
                stack: error.stack,
                details: error,
            }),
        });
    };
}
//# sourceMappingURL=gateway.js.map