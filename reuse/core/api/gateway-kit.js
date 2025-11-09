"use strict";
/**
 * @fileoverview API Gateway Kit
 * @module core/api/gateway-kit
 *
 * Complete API gateway solution including rate limiting, authentication,
 * circuit breaking, and request/response transformation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = createRateLimiter;
exports.createApiKeyAuthMiddleware = createApiKeyAuthMiddleware;
exports.createCircuitBreaker = createCircuitBreaker;
exports.createRequestTransformMiddleware = createRequestTransformMiddleware;
exports.createResponseTransformMiddleware = createResponseTransformMiddleware;
exports.createLoggingMiddleware = createLoggingMiddleware;
exports.createValidationMiddleware = createValidationMiddleware;
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
function createRateLimiter(config) {
    const { windowMs, maxRequests, strategy = 'sliding', keyGenerator = (req) => req.ip || 'unknown', handler, skip, } = config;
    const requests = new Map();
    return (req, res, next) => {
        // Skip if skip function returns true
        if (skip && skip(req)) {
            return next();
        }
        const key = keyGenerator(req);
        const now = Date.now();
        let record = requests.get(key);
        if (!record || now > record.resetTime) {
            // Create new record
            record = {
                count: 0,
                resetTime: now + windowMs,
                requests: [],
            };
            requests.set(key, record);
        }
        if (strategy === 'sliding') {
            // Remove old requests outside the window
            record.requests = record.requests.filter((timestamp) => now - timestamp < windowMs);
            record.count = record.requests.length;
        }
        // Check if limit exceeded
        if (record.count >= maxRequests) {
            const retryAfter = Math.ceil((record.resetTime - now) / 1000);
            res.setHeader('X-RateLimit-Limit', maxRequests.toString());
            res.setHeader('X-RateLimit-Remaining', '0');
            res.setHeader('X-RateLimit-Reset', record.resetTime.toString());
            res.setHeader('Retry-After', retryAfter.toString());
            if (handler) {
                return handler(req, res, next);
            }
            return res.status(429).json({
                error: 'Too Many Requests',
                message: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
                retryAfter,
            });
        }
        // Increment counter
        record.count++;
        record.requests.push(now);
        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining', (maxRequests - record.count).toString());
        res.setHeader('X-RateLimit-Reset', record.resetTime.toString());
        next();
    };
}
/**
 * Creates API key authentication middleware
 *
 * @param validateKey - Function to validate API key
 * @param options - Authentication options
 * @returns Express middleware function
 */
function createApiKeyAuthMiddleware(validateKey, options = {}) {
    const { headerName = 'X-API-Key', queryParam = 'apiKey' } = options;
    return async (req, res, next) => {
        // Extract API key from header or query
        const apiKey = req.headers[headerName.toLowerCase()] ||
            req.query[queryParam];
        if (!apiKey) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'API key is required',
            });
        }
        try {
            const isValid = await validateKey(apiKey);
            if (!isValid) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Invalid API key',
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
/**
 * Creates circuit breaker for fault tolerance
 *
 * @param config - Circuit breaker configuration
 * @returns Circuit breaker instance
 */
function createCircuitBreaker(config) {
    const { failureThreshold, successThreshold, timeout, resetTimeout } = config;
    let state = 'CLOSED';
    let failures = 0;
    let successes = 0;
    let nextAttempt = Date.now();
    const execute = async (fn) => {
        if (state === 'OPEN') {
            if (Date.now() < nextAttempt) {
                throw new Error('Circuit breaker is OPEN');
            }
            // Transition to HALF_OPEN
            state = 'HALF_OPEN';
        }
        try {
            const result = await Promise.race([
                fn(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout)),
            ]);
            // Success
            if (state === 'HALF_OPEN') {
                successes++;
                if (successes >= successThreshold) {
                    state = 'CLOSED';
                    failures = 0;
                    successes = 0;
                }
            }
            else {
                failures = 0;
            }
            return result;
        }
        catch (error) {
            // Failure
            failures++;
            successes = 0;
            if (failures >= failureThreshold) {
                state = 'OPEN';
                nextAttempt = Date.now() + resetTimeout;
            }
            throw error;
        }
    };
    return {
        execute,
        getState: () => state,
        getStats: () => ({ failures, successes, state }),
    };
}
/**
 * Creates request transformation middleware
 *
 * @param transformers - Object with transformation functions
 * @returns Express middleware function
 */
function createRequestTransformMiddleware(transformers) {
    return async (req, res, next) => {
        try {
            if (transformers.headers) {
                req.headers = await transformers.headers(req.headers);
            }
            if (transformers.query) {
                req.query = await transformers.query(req.query);
            }
            if (transformers.body) {
                req.body = await transformers.body(req.body);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
/**
 * Creates response transformation middleware
 *
 * @param transform - Transformation function
 * @returns Express middleware function
 */
function createResponseTransformMiddleware(transform) {
    return (req, res, next) => {
        const originalJson = res.json.bind(res);
        res.json = function (data) {
            Promise.resolve(transform(data, req))
                .then((transformed) => originalJson(transformed))
                .catch(next);
            return this;
        };
        next();
    };
}
/**
 * Creates request/response logging middleware
 *
 * @param logger - Logger function
 * @returns Express middleware function
 */
function createLoggingMiddleware(logger) {
    const log = logger || ((data) => console.log('[Gateway]', data));
    return (req, res, next) => {
        const startTime = Date.now();
        log({
            method: req.method,
            path: req.path,
            timestamp: new Date().toISOString(),
        });
        res.on('finish', () => {
            log({
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                duration: Date.now() - startTime,
                timestamp: new Date().toISOString(),
            });
        });
        next();
    };
}
/**
 * Creates request validation middleware
 *
 * @param schema - Validation schema
 * @returns Express middleware function
 */
function createValidationMiddleware(schema) {
    return (req, res, next) => {
        const errors = [];
        if (schema.headers) {
            const result = schema.headers(req.headers);
            if (!result.valid && result.errors) {
                errors.push(...result.errors.map((e) => `Header: ${e}`));
            }
        }
        if (schema.query) {
            const result = schema.query(req.query);
            if (!result.valid && result.errors) {
                errors.push(...result.errors.map((e) => `Query: ${e}`));
            }
        }
        if (schema.params) {
            const result = schema.params(req.params);
            if (!result.valid && result.errors) {
                errors.push(...result.errors.map((e) => `Params: ${e}`));
            }
        }
        if (schema.body) {
            const result = schema.body(req.body);
            if (!result.valid && result.errors) {
                errors.push(...result.errors.map((e) => `Body: ${e}`));
            }
        }
        if (errors.length > 0) {
            return res.status(400).json({
                error: 'Validation Error',
                errors,
            });
        }
        next();
    };
}
/**
 * API Gateway Kit - Main export
 */
exports.default = {
    createRateLimiter,
    createApiKeyAuthMiddleware,
    createCircuitBreaker,
    createRequestTransformMiddleware,
    createResponseTransformMiddleware,
    createLoggingMiddleware,
    createValidationMiddleware,
};
//# sourceMappingURL=gateway-kit.js.map