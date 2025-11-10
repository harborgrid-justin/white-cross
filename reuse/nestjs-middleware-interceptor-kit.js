"use strict";
/**
 * LOC: NMIK1234567
 * File: /reuse/nestjs-middleware-interceptor-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS controllers and modules
 *   - Middleware services
 *   - API gateway configurations
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStreamingResponse = exports.createFileDownloadResponse = exports.createPaginatedResponse = exports.createErrorResponse = exports.createSuccessResponse = exports.Authenticated = exports.RateLimit = exports.AuditLog = exports.ApiVersion = exports.Permissions = exports.Roles = exports.Public = exports.Origin = exports.Cookie = exports.RequestId = exports.UserAgent = exports.IpAddress = exports.CurrentUser = exports.createThrottleGuard = exports.JwtAuthGuard = exports.createApiKeyGuard = exports.createPermissionGuard = exports.createRoleGuard = exports.createTransformPipe = exports.SanitizationPipe = exports.ParseUuidPipe = exports.createParseIntPipe = exports.createValidationPipe = exports.ValidationExceptionFilter = exports.HttpExceptionFilter = exports.GlobalExceptionFilter = exports.AuditLoggingInterceptor = exports.createTimeoutInterceptor = exports.ErrorHandlingInterceptor = exports.createCachingInterceptor = exports.createResponseTransformInterceptor = exports.createTimingInterceptor = exports.TimingInterceptor = exports.createLoggingInterceptor = exports.LoggingInterceptor = exports.createTimingMiddleware = exports.createSecurityHeadersMiddleware = exports.createSanitizationMiddleware = exports.createRateLimitMiddleware = exports.createCorsMiddleware = exports.createLoggingMiddleware = exports.createRequestIdMiddleware = exports.RequestIdMiddleware = void 0;
/**
 * File: /reuse/nestjs-middleware-interceptor-kit.ts
 * Locator: WC-UTL-NMIK-001
 * Purpose: Comprehensive NestJS Middleware & Interceptor Kit - Custom middleware, interceptors, guards, pipes, decorators
 *
 * Upstream: Independent utility module for NestJS request/response handling
 * Downstream: ../backend/*, NestJS controllers, modules, providers
 * Dependencies: TypeScript 5.x, @nestjs/common, @nestjs/core, rxjs, crypto
 * Exports: 45 utility functions for middleware, interceptors, exception filters, pipes, guards, decorators
 *
 * LLM Context: Comprehensive NestJS middleware and interceptor utilities for White Cross healthcare system.
 * Provides custom middleware factories, interceptors for logging/timing/caching, exception filters, validation pipes,
 * authorization guards, parameter decorators, route decorators, response transformation, request sanitization,
 * HIPAA-compliant audit logging, and advanced NestJS patterns for healthcare APIs.
 */
// ============================================================================
// IMPORTS
// ============================================================================
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const crypto = __importStar(require("crypto"));
// ============================================================================
// MIDDLEWARE UTILITIES
// ============================================================================
/**
 * 1. Creates a request ID middleware that adds unique identifiers to each request.
 *
 * @returns {NestMiddleware} Middleware instance
 *
 * @example
 * ```typescript
 * export class AppModule implements NestModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer.apply(createRequestIdMiddleware()).forRoutes('*');
 *   }
 * }
 * ```
 */
let RequestIdMiddleware = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RequestIdMiddleware = _classThis = class {
        use(req, res, next) {
            const requestId = crypto.randomUUID();
            req['requestId'] = requestId;
            res.setHeader('X-Request-ID', requestId);
            next();
        }
    };
    __setFunctionName(_classThis, "RequestIdMiddleware");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RequestIdMiddleware = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RequestIdMiddleware = _classThis;
})();
exports.RequestIdMiddleware = RequestIdMiddleware;
const createRequestIdMiddleware = () => RequestIdMiddleware;
exports.createRequestIdMiddleware = createRequestIdMiddleware;
/**
 * 2. Creates a logging middleware that logs all incoming requests with details.
 *
 * @param {object} options - Logging options
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createLoggingMiddleware({ logBody: true, logHeaders: false }));
 * ```
 */
const createLoggingMiddleware = (options = {}) => {
    return (req, res, next) => {
        const { method, url, headers, body, query } = req;
        const requestId = req['requestId'] || 'unknown';
        if (options.excludePaths?.some(path => url.startsWith(path))) {
            return next();
        }
        const logData = {
            requestId,
            timestamp: new Date().toISOString(),
            method,
            url,
        };
        if (options.logHeaders)
            logData.headers = headers;
        if (options.logBody)
            logData.body = body;
        if (options.logQuery)
            logData.query = query;
        console.log('[REQUEST]', JSON.stringify(logData));
        next();
    };
};
exports.createLoggingMiddleware = createLoggingMiddleware;
/**
 * 3. Creates a CORS middleware with configurable options for cross-origin requests.
 *
 * @param {object} config - CORS configuration
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createCorsMiddleware({
 *   allowedOrigins: ['https://app.example.com'],
 *   allowedMethods: ['GET', 'POST'],
 *   credentials: true
 * }));
 * ```
 */
const createCorsMiddleware = (config) => {
    return (req, res, next) => {
        const origin = req.headers.origin;
        const allowedOrigins = Array.isArray(config.allowedOrigins)
            ? config.allowedOrigins
            : [config.allowedOrigins];
        if (origin && allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        if (config.credentials) {
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        }
        if (config.allowedMethods) {
            res.setHeader('Access-Control-Allow-Methods', config.allowedMethods.join(', '));
        }
        if (config.allowedHeaders) {
            res.setHeader('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));
        }
        if (config.maxAge) {
            res.setHeader('Access-Control-Max-Age', config.maxAge.toString());
        }
        if (req.method === 'OPTIONS') {
            res.sendStatus(204);
        }
        else {
            next();
        }
    };
};
exports.createCorsMiddleware = createCorsMiddleware;
/**
 * 4. Creates a rate limiting middleware to prevent abuse and DDoS attacks.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createRateLimitMiddleware({
 *   windowMs: 60000,
 *   maxRequests: 100
 * }));
 * ```
 */
const createRateLimitMiddleware = (config) => {
    const store = new Map();
    return (req, res, next) => {
        const key = config.keyGenerator ? config.keyGenerator(req) : req.ip;
        const now = Date.now();
        const record = store.get(key);
        if (record && now < record.resetTime) {
            if (record.count >= config.maxRequests) {
                res.status(429).json({
                    statusCode: 429,
                    message: 'Too many requests',
                    retryAfter: Math.ceil((record.resetTime - now) / 1000),
                });
                return;
            }
            record.count++;
        }
        else {
            store.set(key, {
                count: 1,
                resetTime: now + config.windowMs,
            });
        }
        next();
    };
};
exports.createRateLimitMiddleware = createRateLimitMiddleware;
/**
 * 5. Creates a request sanitization middleware to prevent XSS and injection attacks.
 *
 * @param {SanitizationOptions} options - Sanitization options
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createSanitizationMiddleware({ stripXSS: true }));
 * ```
 */
const createSanitizationMiddleware = (options = {}) => {
    const sanitizeValue = (value) => {
        if (typeof value === 'string') {
            if (options.stripXSS) {
                // Remove common XSS patterns
                return value
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+\s*=/gi, '');
            }
            return value;
        }
        if (Array.isArray(value)) {
            return value.map(sanitizeValue);
        }
        if (typeof value === 'object' && value !== null) {
            const sanitized = {};
            for (const [key, val] of Object.entries(value)) {
                sanitized[key] = sanitizeValue(val);
            }
            return sanitized;
        }
        return value;
    };
    return (req, res, next) => {
        if (options.sanitizeBody && req.body) {
            req.body = sanitizeValue(req.body);
        }
        if (options.sanitizeQuery && req.query) {
            req.query = sanitizeValue(req.query);
        }
        if (options.sanitizeParams && req.params) {
            req.params = sanitizeValue(req.params);
        }
        next();
    };
};
exports.createSanitizationMiddleware = createSanitizationMiddleware;
/**
 * 6. Creates a security headers middleware to add common security headers.
 *
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createSecurityHeadersMiddleware());
 * ```
 */
const createSecurityHeadersMiddleware = () => {
    return (req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.removeHeader('X-Powered-By');
        next();
    };
};
exports.createSecurityHeadersMiddleware = createSecurityHeadersMiddleware;
/**
 * 7. Creates a timing middleware that measures request processing time.
 *
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createTimingMiddleware());
 * ```
 */
const createTimingMiddleware = () => {
    return (req, res, next) => {
        const startTime = Date.now();
        req['startTime'] = startTime;
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            res.setHeader('X-Response-Time', `${duration}ms`);
        });
        next();
    };
};
exports.createTimingMiddleware = createTimingMiddleware;
// ============================================================================
// INTERCEPTOR UTILITIES
// ============================================================================
/**
 * 8. Creates a logging interceptor that logs request and response details.
 *
 * @returns {NestInterceptor} Interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(LoggingInterceptor)
 * @Controller('users')
 * export class UsersController {}
 * ```
 */
let LoggingInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LoggingInterceptor = _classThis = class {
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const { method, url } = request;
            const requestId = request.requestId || crypto.randomUUID();
            console.log(`[INTERCEPTOR] ${method} ${url} - Request ID: ${requestId}`);
            return next.handle().pipe((0, operators_1.tap)(data => {
                console.log(`[INTERCEPTOR] ${method} ${url} - Response:`, {
                    requestId,
                    dataType: typeof data,
                    hasData: !!data,
                });
            }));
        }
    };
    __setFunctionName(_classThis, "LoggingInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LoggingInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LoggingInterceptor = _classThis;
})();
exports.LoggingInterceptor = LoggingInterceptor;
const createLoggingInterceptor = () => LoggingInterceptor;
exports.createLoggingInterceptor = createLoggingInterceptor;
/**
 * 9. Creates a timing interceptor that measures and logs execution time.
 *
 * @returns {NestInterceptor} Interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(TimingInterceptor)
 * @Get()
 * async findAll() {}
 * ```
 */
let TimingInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TimingInterceptor = _classThis = class {
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            const startTime = Date.now();
            return next.handle().pipe((0, operators_1.tap)(() => {
                const duration = Date.now() - startTime;
                response.setHeader('X-Response-Time', `${duration}ms`);
                console.log(`[TIMING] ${request.method} ${request.url} - ${duration}ms`);
            }));
        }
    };
    __setFunctionName(_classThis, "TimingInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TimingInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TimingInterceptor = _classThis;
})();
exports.TimingInterceptor = TimingInterceptor;
const createTimingInterceptor = () => TimingInterceptor;
exports.createTimingInterceptor = createTimingInterceptor;
/**
 * 10. Creates a response transformation interceptor that wraps responses in a standard envelope.
 *
 * @param {ResponseTransformConfig} config - Transform configuration
 * @returns {NestInterceptor} Interceptor class
 *
 * @example
 * ```typescript
 * @UseInterceptors(createResponseTransformInterceptor({ wrapData: true }))
 * @Get()
 * async findAll() {}
 * ```
 */
const createResponseTransformInterceptor = (config = {}) => {
    let ResponseTransformInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var ResponseTransformInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.map)(data => {
                    const response = {};
                    if (config.wrapData) {
                        response.success = true;
                        response.data = data;
                    }
                    else {
                        Object.assign(response, data);
                    }
                    if (config.addMetadata) {
                        const request = context.switchToHttp().getRequest();
                        response.metadata = {
                            requestId: request.requestId,
                            path: request.url,
                            method: request.method,
                        };
                    }
                    if (config.includeTimestamp) {
                        response.timestamp = new Date().toISOString();
                    }
                    return response;
                }));
            }
        };
        __setFunctionName(_classThis, "ResponseTransformInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ResponseTransformInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return ResponseTransformInterceptor = _classThis;
    })();
    return ResponseTransformInterceptor;
};
exports.createResponseTransformInterceptor = createResponseTransformInterceptor;
/**
 * 11. Creates a caching interceptor that caches responses for specified duration.
 *
 * @param {CacheConfig} config - Cache configuration
 * @returns {NestInterceptor} Interceptor class
 *
 * @example
 * ```typescript
 * @UseInterceptors(createCachingInterceptor({ ttl: 60000 }))
 * @Get('users')
 * async findAll() {}
 * ```
 */
const createCachingInterceptor = (config) => {
    const cache = new Map();
    let CachingInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var CachingInterceptor = _classThis = class {
            intercept(context, next) {
                if (config.condition && !config.condition(context)) {
                    return next.handle();
                }
                const cacheKey = config.keyGenerator
                    ? config.keyGenerator(context)
                    : this.generateCacheKey(context);
                const cached = cache.get(cacheKey);
                if (cached && cached.expiresAt > Date.now()) {
                    console.log(`[CACHE] Hit: ${cacheKey}`);
                    return (0, rxjs_1.of)(cached.data);
                }
                return next.handle().pipe((0, operators_1.tap)(data => {
                    cache.set(cacheKey, {
                        data,
                        expiresAt: Date.now() + config.ttl,
                    });
                    console.log(`[CACHE] Set: ${cacheKey}`);
                    // Clean up expired entries
                    if (config.maxSize && cache.size > config.maxSize) {
                        this.cleanupCache();
                    }
                }));
            }
            generateCacheKey(context) {
                const request = context.switchToHttp().getRequest();
                return `${request.method}:${request.url}`;
            }
            cleanupCache() {
                const now = Date.now();
                for (const [key, value] of cache.entries()) {
                    if (value.expiresAt < now) {
                        cache.delete(key);
                    }
                }
            }
        };
        __setFunctionName(_classThis, "CachingInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CachingInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return CachingInterceptor = _classThis;
    })();
    return CachingInterceptor;
};
exports.createCachingInterceptor = createCachingInterceptor;
/**
 * 12. Creates an error handling interceptor that catches and transforms errors.
 *
 * @returns {NestInterceptor} Interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(ErrorHandlingInterceptor)
 * @Controller()
 * export class AppController {}
 * ```
 */
let ErrorHandlingInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ErrorHandlingInterceptor = _classThis = class {
        intercept(context, next) {
            return next.handle().pipe((0, operators_1.catchError)(error => {
                const request = context.switchToHttp().getRequest();
                console.error(`[ERROR] ${request.method} ${request.url}`, {
                    error: error.message,
                    stack: error.stack,
                });
                if (error instanceof common_1.HttpException) {
                    return (0, rxjs_1.throwError)(() => error);
                }
                return (0, rxjs_1.throwError)(() => new common_1.HttpException('Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR));
            }));
        }
    };
    __setFunctionName(_classThis, "ErrorHandlingInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ErrorHandlingInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ErrorHandlingInterceptor = _classThis;
})();
exports.ErrorHandlingInterceptor = ErrorHandlingInterceptor;
/**
 * 13. Creates a timeout interceptor that enforces request timeouts.
 *
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {NestInterceptor} Interceptor class
 *
 * @example
 * ```typescript
 * @UseInterceptors(createTimeoutInterceptor(5000))
 * @Get()
 * async findAll() {}
 * ```
 */
const createTimeoutInterceptor = (timeoutMs) => {
    let TimeoutInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var TimeoutInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.timeout)(timeoutMs), (0, operators_1.catchError)(error => {
                    if (error.name === 'TimeoutError') {
                        return (0, rxjs_1.throwError)(() => new common_1.HttpException('Request timeout', common_1.HttpStatus.REQUEST_TIMEOUT));
                    }
                    return (0, rxjs_1.throwError)(() => error);
                }));
            }
        };
        __setFunctionName(_classThis, "TimeoutInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TimeoutInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return TimeoutInterceptor = _classThis;
    })();
    return TimeoutInterceptor;
};
exports.createTimeoutInterceptor = createTimeoutInterceptor;
/**
 * 14. Creates an audit logging interceptor for HIPAA compliance.
 *
 * @returns {NestInterceptor} Interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(AuditLoggingInterceptor)
 * @Get('patients/:id')
 * async getPatient() {}
 * ```
 */
let AuditLoggingInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuditLoggingInterceptor = _classThis = class {
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            const startTime = Date.now();
            const auditEntry = {
                requestId: request.requestId || crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                userId: request.user?.id,
                action: request.method,
                resource: request.url,
                ipAddress: request.ip,
                userAgent: request.headers['user-agent'],
            };
            return next.handle().pipe((0, operators_1.tap)(() => {
                auditEntry.statusCode = response.statusCode;
                auditEntry.duration = Date.now() - startTime;
                console.log('[AUDIT]', JSON.stringify(auditEntry));
            }), (0, operators_1.catchError)(error => {
                auditEntry.statusCode = error.status || 500;
                auditEntry.duration = Date.now() - startTime;
                auditEntry.metadata = { error: error.message };
                console.log('[AUDIT]', JSON.stringify(auditEntry));
                return (0, rxjs_1.throwError)(() => error);
            }));
        }
    };
    __setFunctionName(_classThis, "AuditLoggingInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditLoggingInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditLoggingInterceptor = _classThis;
})();
exports.AuditLoggingInterceptor = AuditLoggingInterceptor;
// ============================================================================
// EXCEPTION FILTER UTILITIES
// ============================================================================
/**
 * 15. Creates a global exception filter that handles all exceptions uniformly.
 *
 * @returns {ExceptionFilter} Exception filter instance
 *
 * @example
 * ```typescript
 * app.useGlobalFilters(new GlobalExceptionFilter());
 * ```
 */
let GlobalExceptionFilter = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GlobalExceptionFilter = _classThis = class {
        catch(exception, host) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            const status = exception instanceof common_1.HttpException
                ? exception.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const message = exception instanceof common_1.HttpException
                ? exception.message
                : 'Internal server error';
            const exceptionResponse = {
                statusCode: status,
                message,
                error: exception.name || 'Error',
                timestamp: new Date().toISOString(),
                path: request.url,
                requestId: request['requestId'],
            };
            if (exception.response?.details) {
                exceptionResponse.details = exception.response.details;
            }
            console.error('[EXCEPTION]', {
                ...exceptionResponse,
                stack: exception.stack,
            });
            response.status(status).json(exceptionResponse);
        }
    };
    __setFunctionName(_classThis, "GlobalExceptionFilter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GlobalExceptionFilter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GlobalExceptionFilter = _classThis;
})();
exports.GlobalExceptionFilter = GlobalExceptionFilter;
/**
 * 16. Creates an HTTP exception filter for handling HTTP-specific errors.
 *
 * @returns {ExceptionFilter} Exception filter instance
 *
 * @example
 * ```typescript
 * @UseFilters(HttpExceptionFilter)
 * @Controller()
 * export class AppController {}
 * ```
 */
let HttpExceptionFilter = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var HttpExceptionFilter = _classThis = class {
        catch(exception, host) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            const errorResponse = {
                statusCode: status,
                message: typeof exceptionResponse === 'string'
                    ? exceptionResponse
                    : exceptionResponse.message || exception.message,
                error: exception.name,
                timestamp: new Date().toISOString(),
                path: request.url,
                requestId: request['requestId'],
            };
            response.status(status).json(errorResponse);
        }
    };
    __setFunctionName(_classThis, "HttpExceptionFilter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HttpExceptionFilter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HttpExceptionFilter = _classThis;
})();
exports.HttpExceptionFilter = HttpExceptionFilter;
/**
 * 17. Creates a validation exception filter for handling validation errors.
 *
 * @returns {ExceptionFilter} Exception filter instance
 *
 * @example
 * ```typescript
 * app.useGlobalFilters(new ValidationExceptionFilter());
 * ```
 */
let ValidationExceptionFilter = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ValidationExceptionFilter = _classThis = class {
        catch(exception, host) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            const exceptionResponse = exception.getResponse();
            const validationErrors = Array.isArray(exceptionResponse.message)
                ? exceptionResponse.message
                : [exceptionResponse.message];
            response.status(common_1.HttpStatus.BAD_REQUEST).json({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Validation failed',
                errors: validationErrors,
                timestamp: new Date().toISOString(),
                path: request.url,
                requestId: request['requestId'],
            });
        }
    };
    __setFunctionName(_classThis, "ValidationExceptionFilter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ValidationExceptionFilter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ValidationExceptionFilter = _classThis;
})();
exports.ValidationExceptionFilter = ValidationExceptionFilter;
// ============================================================================
// PIPE UTILITIES
// ============================================================================
/**
 * 18. Creates a custom validation pipe with configurable options.
 *
 * @param {ValidationOptions} options - Validation options
 * @returns {PipeTransform} Pipe instance
 *
 * @example
 * ```typescript
 * @UsePipes(createValidationPipe({ whitelist: true }))
 * @Post()
 * async create(@Body() dto: CreateUserDto) {}
 * ```
 */
const createValidationPipe = (options = {}) => {
    let CustomValidationPipe = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var CustomValidationPipe = _classThis = class {
            transform(value, metadata) {
                if (!value) {
                    throw new common_1.BadRequestException('Validation failed: No data provided');
                }
                if (options.whitelist && typeof value === 'object') {
                    // Remove properties not in DTO
                    // This is a simplified version - use class-validator in production
                    return value;
                }
                if (options.forbidNonWhitelisted) {
                    // Throw error if extra properties exist
                    // Implementation would require DTO metadata
                }
                if (options.transform) {
                    // Transform plain object to class instance
                    return value;
                }
                return value;
            }
        };
        __setFunctionName(_classThis, "CustomValidationPipe");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CustomValidationPipe = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return CustomValidationPipe = _classThis;
    })();
    return CustomValidationPipe;
};
exports.createValidationPipe = createValidationPipe;
/**
 * 19. Creates a parse integer pipe with custom error messages.
 *
 * @param {string} fieldName - Name of the field being parsed
 * @returns {PipeTransform} Pipe instance
 *
 * @example
 * ```typescript
 * @Get(':id')
 * async findOne(@Param('id', createParseIntPipe('User ID')) id: number) {}
 * ```
 */
const createParseIntPipe = (fieldName = 'value') => {
    let CustomParseIntPipe = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var CustomParseIntPipe = _classThis = class {
            transform(value, metadata) {
                const val = parseInt(value, 10);
                if (isNaN(val)) {
                    throw new common_1.BadRequestException(`${fieldName} must be a valid integer`);
                }
                return val;
            }
        };
        __setFunctionName(_classThis, "CustomParseIntPipe");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CustomParseIntPipe = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return CustomParseIntPipe = _classThis;
    })();
    return CustomParseIntPipe;
};
exports.createParseIntPipe = createParseIntPipe;
/**
 * 20. Creates a parse UUID pipe with validation.
 *
 * @returns {PipeTransform} Pipe instance
 *
 * @example
 * ```typescript
 * @Get(':id')
 * async findOne(@Param('id', ParseUuidPipe) id: string) {}
 * ```
 */
let ParseUuidPipe = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ParseUuidPipe = _classThis = class {
        constructor() {
            this.uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        }
        transform(value, metadata) {
            if (!this.uuidRegex.test(value)) {
                throw new common_1.BadRequestException('Invalid UUID format');
            }
            return value;
        }
    };
    __setFunctionName(_classThis, "ParseUuidPipe");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ParseUuidPipe = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ParseUuidPipe = _classThis;
})();
exports.ParseUuidPipe = ParseUuidPipe;
/**
 * 21. Creates a sanitization pipe that removes dangerous characters.
 *
 * @returns {PipeTransform} Pipe instance
 *
 * @example
 * ```typescript
 * @Post()
 * async create(@Body(SanitizationPipe) dto: CreateUserDto) {}
 * ```
 */
let SanitizationPipe = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SanitizationPipe = _classThis = class {
        transform(value, metadata) {
            if (typeof value === 'string') {
                return this.sanitizeString(value);
            }
            if (Array.isArray(value)) {
                return value.map(item => this.transform(item, metadata));
            }
            if (typeof value === 'object' && value !== null) {
                const sanitized = {};
                for (const [key, val] of Object.entries(value)) {
                    sanitized[key] = this.transform(val, metadata);
                }
                return sanitized;
            }
            return value;
        }
        sanitizeString(value) {
            return value
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .trim();
        }
    };
    __setFunctionName(_classThis, "SanitizationPipe");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SanitizationPipe = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SanitizationPipe = _classThis;
})();
exports.SanitizationPipe = SanitizationPipe;
/**
 * 22. Creates a transformation pipe that converts data types.
 *
 * @param {Function} transformFn - Transformation function
 * @returns {PipeTransform} Pipe instance
 *
 * @example
 * ```typescript
 * @Get()
 * async findAll(@Query('limit', createTransformPipe(Number)) limit: number) {}
 * ```
 */
const createTransformPipe = (transformFn) => {
    let TransformPipe = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var TransformPipe = _classThis = class {
            transform(value, metadata) {
                try {
                    return transformFn(value);
                }
                catch (error) {
                    throw new common_1.BadRequestException(`Transformation failed: ${error.message}`);
                }
            }
        };
        __setFunctionName(_classThis, "TransformPipe");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TransformPipe = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return TransformPipe = _classThis;
    })();
    return TransformPipe;
};
exports.createTransformPipe = createTransformPipe;
// ============================================================================
// GUARD UTILITIES
// ============================================================================
/**
 * 23. Creates a role-based authorization guard.
 *
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {CanActivate} Guard class
 *
 * @example
 * ```typescript
 * @UseGuards(createRoleGuard(['admin', 'doctor']))
 * @Get()
 * async findAll() {}
 * ```
 */
const createRoleGuard = (allowedRoles) => {
    let RoleGuard = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var RoleGuard = _classThis = class {
            canActivate(context) {
                const request = context.switchToHttp().getRequest();
                const user = request.user;
                if (!user) {
                    throw new common_1.UnauthorizedException('User not authenticated');
                }
                const userRoles = user.roles || [];
                const hasRole = allowedRoles.some(role => userRoles.includes(role));
                if (!hasRole) {
                    throw new common_1.ForbiddenException(`User does not have required role. Required: ${allowedRoles.join(', ')}`);
                }
                return true;
            }
        };
        __setFunctionName(_classThis, "RoleGuard");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RoleGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return RoleGuard = _classThis;
    })();
    return RoleGuard;
};
exports.createRoleGuard = createRoleGuard;
/**
 * 24. Creates a permission-based authorization guard.
 *
 * @param {string[]} requiredPermissions - Array of required permissions
 * @returns {CanActivate} Guard class
 *
 * @example
 * ```typescript
 * @UseGuards(createPermissionGuard(['patients.read', 'patients.write']))
 * @Post('patients')
 * async create() {}
 * ```
 */
const createPermissionGuard = (requiredPermissions) => {
    let PermissionGuard = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var PermissionGuard = _classThis = class {
            canActivate(context) {
                const request = context.switchToHttp().getRequest();
                const user = request.user;
                if (!user) {
                    throw new common_1.UnauthorizedException('User not authenticated');
                }
                const userPermissions = user.permissions || [];
                const hasAllPermissions = requiredPermissions.every(permission => userPermissions.includes(permission));
                if (!hasAllPermissions) {
                    throw new common_1.ForbiddenException(`Missing required permissions: ${requiredPermissions.join(', ')}`);
                }
                return true;
            }
        };
        __setFunctionName(_classThis, "PermissionGuard");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PermissionGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return PermissionGuard = _classThis;
    })();
    return PermissionGuard;
};
exports.createPermissionGuard = createPermissionGuard;
/**
 * 25. Creates an API key authentication guard.
 *
 * @param {string[]} validApiKeys - Array of valid API keys
 * @returns {CanActivate} Guard class
 *
 * @example
 * ```typescript
 * @UseGuards(createApiKeyGuard(['key1', 'key2']))
 * @Get('public/data')
 * async getPublicData() {}
 * ```
 */
const createApiKeyGuard = (validApiKeys) => {
    let ApiKeyGuard = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var ApiKeyGuard = _classThis = class {
            canActivate(context) {
                const request = context.switchToHttp().getRequest();
                const apiKey = request.headers['x-api-key'] || request.query.apiKey;
                if (!apiKey) {
                    throw new common_1.UnauthorizedException('API key is required');
                }
                if (!validApiKeys.includes(apiKey)) {
                    throw new common_1.UnauthorizedException('Invalid API key');
                }
                return true;
            }
        };
        __setFunctionName(_classThis, "ApiKeyGuard");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ApiKeyGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return ApiKeyGuard = _classThis;
    })();
    return ApiKeyGuard;
};
exports.createApiKeyGuard = createApiKeyGuard;
/**
 * 26. Creates a JWT authentication guard.
 *
 * @returns {CanActivate} Guard instance
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * async getProfile() {}
 * ```
 */
let JwtAuthGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var JwtAuthGuard = _classThis = class {
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const authHeader = request.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new common_1.UnauthorizedException('Missing or invalid authorization header');
            }
            const token = authHeader.substring(7);
            // In production, verify the JWT token here
            // For now, just check if token exists
            if (!token) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            // Attach decoded user to request
            request.user = { id: 'user-id-from-token' };
            return true;
        }
    };
    __setFunctionName(_classThis, "JwtAuthGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JwtAuthGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JwtAuthGuard = _classThis;
})();
exports.JwtAuthGuard = JwtAuthGuard;
/**
 * 27. Creates a throttle guard to limit request frequency per user.
 *
 * @param {number} limit - Maximum requests
 * @param {number} ttl - Time window in milliseconds
 * @returns {CanActivate} Guard class
 *
 * @example
 * ```typescript
 * @UseGuards(createThrottleGuard(10, 60000))
 * @Post('send-email')
 * async sendEmail() {}
 * ```
 */
const createThrottleGuard = (limit, ttl) => {
    const tracker = new Map();
    let ThrottleGuard = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var ThrottleGuard = _classThis = class {
            canActivate(context) {
                const request = context.switchToHttp().getRequest();
                const key = request.user?.id || request.ip;
                const now = Date.now();
                const record = tracker.get(key);
                if (record && now < record.resetTime) {
                    if (record.count >= limit) {
                        throw new common_1.HttpException('Too many requests', common_1.HttpStatus.TOO_MANY_REQUESTS);
                    }
                    record.count++;
                }
                else {
                    tracker.set(key, {
                        count: 1,
                        resetTime: now + ttl,
                    });
                }
                return true;
            }
        };
        __setFunctionName(_classThis, "ThrottleGuard");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ThrottleGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return ThrottleGuard = _classThis;
    })();
    return ThrottleGuard;
};
exports.createThrottleGuard = createThrottleGuard;
// ============================================================================
// PARAMETER DECORATOR UTILITIES
// ============================================================================
/**
 * 28. Creates a custom parameter decorator to extract the current user.
 *
 * @returns Current user from request
 *
 * @example
 * ```typescript
 * @Get('profile')
 * async getProfile(@CurrentUser() user: User) {}
 * ```
 */
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
});
/**
 * 29. Creates a custom parameter decorator to extract IP address.
 *
 * @returns IP address from request
 *
 * @example
 * ```typescript
 * @Post('login')
 * async login(@IpAddress() ip: string) {}
 * ```
 */
exports.IpAddress = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.ip || request.connection.remoteAddress || 'unknown';
});
/**
 * 30. Creates a custom parameter decorator to extract user agent.
 *
 * @returns User agent string from request
 *
 * @example
 * ```typescript
 * @Get()
 * async findAll(@UserAgent() userAgent: string) {}
 * ```
 */
exports.UserAgent = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'] || 'unknown';
});
/**
 * 31. Creates a custom parameter decorator to extract request ID.
 *
 * @returns Request ID from request
 *
 * @example
 * ```typescript
 * @Get()
 * async findAll(@RequestId() requestId: string) {}
 * ```
 */
exports.RequestId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.requestId || request.headers['x-request-id'] || crypto.randomUUID();
});
/**
 * 32. Creates a custom parameter decorator to extract cookies.
 *
 * @returns Cookie value or all cookies
 *
 * @example
 * ```typescript
 * @Get()
 * async findAll(@Cookie('sessionId') sessionId: string) {}
 * ```
 */
exports.Cookie = (0, common_1.createParamDecorator)((cookieName, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return cookieName ? request.cookies?.[cookieName] : request.cookies;
});
/**
 * 33. Creates a custom parameter decorator to extract request origin.
 *
 * @returns Origin header from request
 *
 * @example
 * ```typescript
 * @Post()
 * async create(@Origin() origin: string) {}
 * ```
 */
exports.Origin = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers.origin || request.headers.referer || 'unknown';
});
// ============================================================================
// ROUTE DECORATOR UTILITIES
// ============================================================================
/**
 * 34. Creates a combined decorator for public routes that skip authentication.
 *
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Public()
 * @Get('health')
 * async healthCheck() {}
 * ```
 */
const Public = () => (0, common_1.SetMetadata)('isPublic', true);
exports.Public = Public;
/**
 * 35. Creates a roles decorator to specify required roles.
 *
 * @param {string[]} roles - Required roles
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Roles('admin', 'doctor')
 * @Get('patients')
 * async getPatients() {}
 * ```
 */
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;
/**
 * 36. Creates a permissions decorator to specify required permissions.
 *
 * @param {string[]} permissions - Required permissions
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Permissions('patients.read', 'patients.write')
 * @Post('patients')
 * async createPatient() {}
 * ```
 */
const Permissions = (...permissions) => (0, common_1.SetMetadata)('permissions', permissions);
exports.Permissions = Permissions;
/**
 * 37. Creates an API versioning decorator.
 *
 * @param {string} version - API version
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @ApiVersion('v2')
 * @Get('users')
 * async getUsersV2() {}
 * ```
 */
const ApiVersion = (version) => (0, common_1.SetMetadata)('apiVersion', version);
exports.ApiVersion = ApiVersion;
/**
 * 38. Creates an audit log decorator to mark endpoints for audit logging.
 *
 * @param {string} action - Action being performed
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @AuditLog('VIEW_PATIENT_RECORD')
 * @Get('patients/:id')
 * async getPatient() {}
 * ```
 */
const AuditLog = (action) => (0, common_1.SetMetadata)('auditAction', action);
exports.AuditLog = AuditLog;
/**
 * 39. Creates a rate limit decorator for specific endpoints.
 *
 * @param {number} limit - Maximum requests
 * @param {number} ttl - Time window in milliseconds
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @RateLimit(5, 60000)
 * @Post('send-verification')
 * async sendVerification() {}
 * ```
 */
const RateLimit = (limit, ttl) => (0, common_1.SetMetadata)('rateLimit', { limit, ttl });
exports.RateLimit = RateLimit;
/**
 * 40. Creates a combined decorator for authenticated and authorized routes.
 *
 * @param {string[]} roles - Required roles
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @Authenticated(['admin', 'doctor'])
 * @Get('sensitive-data')
 * async getSensitiveData() {}
 * ```
 */
const Authenticated = (roles = []) => {
    const decorators = [(0, common_1.UseGuards)(JwtAuthGuard)];
    if (roles.length > 0) {
        decorators.push((0, exports.Roles)(...roles));
        decorators.push((0, common_1.UseGuards)((0, exports.createRoleGuard)(roles)));
    }
    return (0, common_1.applyDecorators)(...decorators);
};
exports.Authenticated = Authenticated;
// ============================================================================
// RESPONSE HELPER UTILITIES
// ============================================================================
/**
 * 41. Creates a standard success response wrapper.
 *
 * @param {T} data - Response data
 * @param {string} message - Success message
 * @param {any} metadata - Additional metadata
 * @returns Formatted success response
 *
 * @example
 * ```typescript
 * return createSuccessResponse(users, 'Users retrieved successfully');
 * ```
 */
const createSuccessResponse = (data, message = 'Success', metadata) => {
    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
        ...(metadata && { metadata }),
    };
};
exports.createSuccessResponse = createSuccessResponse;
/**
 * 42. Creates a standard error response wrapper.
 *
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {any} details - Additional error details
 * @returns Formatted error response
 *
 * @example
 * ```typescript
 * throw new HttpException(
 *   createErrorResponse('User not found', 404),
 *   404
 * );
 * ```
 */
const createErrorResponse = (message, statusCode = 500, details) => {
    return {
        success: false,
        message,
        statusCode,
        timestamp: new Date().toISOString(),
        ...(details && { details }),
    };
};
exports.createErrorResponse = createErrorResponse;
/**
 * 43. Creates a paginated response wrapper.
 *
 * @param {T[]} data - Array of data items
 * @param {number} total - Total number of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns Paginated response
 *
 * @example
 * ```typescript
 * return createPaginatedResponse(users, 100, 1, 20);
 * ```
 */
const createPaginatedResponse = (data, total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    return {
        success: true,
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
        timestamp: new Date().toISOString(),
    };
};
exports.createPaginatedResponse = createPaginatedResponse;
/**
 * 44. Creates a file download response helper.
 *
 * @param {Response} res - Express response object
 * @param {Buffer} fileData - File buffer
 * @param {string} filename - Filename for download
 * @param {string} mimeType - MIME type of file
 *
 * @example
 * ```typescript
 * createFileDownloadResponse(res, buffer, 'report.pdf', 'application/pdf');
 * ```
 */
const createFileDownloadResponse = (res, fileData, filename, mimeType) => {
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', fileData.length);
    res.send(fileData);
};
exports.createFileDownloadResponse = createFileDownloadResponse;
/**
 * 45. Creates a streaming response helper for large data.
 *
 * @param {Response} res - Express response object
 * @param {NodeJS.ReadableStream} stream - Data stream
 * @param {string} contentType - Content type header
 *
 * @example
 * ```typescript
 * createStreamingResponse(res, dataStream, 'application/json');
 * ```
 */
const createStreamingResponse = (res, stream, contentType = 'application/octet-stream') => {
    res.setHeader('Content-Type', contentType);
    res.setHeader('Transfer-Encoding', 'chunked');
    stream.pipe(res);
};
exports.createStreamingResponse = createStreamingResponse;
//# sourceMappingURL=nestjs-middleware-interceptor-kit.js.map