"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoggingInterceptor = createLoggingInterceptor;
exports.createHeaderInterceptor = createHeaderInterceptor;
exports.createRequestContextInterceptor = createRequestContextInterceptor;
exports.createPerformanceInterceptor = createPerformanceInterceptor;
exports.createResponseWrapperInterceptor = createResponseWrapperInterceptor;
exports.createDataMapperInterceptor = createDataMapperInterceptor;
exports.createPropertyFilterInterceptor = createPropertyFilterInterceptor;
exports.createSerializationInterceptor = createSerializationInterceptor;
exports.createCacheInterceptor = createCacheInterceptor;
exports.createConditionalCacheInterceptor = createConditionalCacheInterceptor;
exports.createCacheInvalidationInterceptor = createCacheInvalidationInterceptor;
exports.createStructuredLoggingInterceptor = createStructuredLoggingInterceptor;
exports.createAuditLoggingInterceptor = createAuditLoggingInterceptor;
exports.createPayloadLoggingInterceptor = createPayloadLoggingInterceptor;
exports.createErrorTransformInterceptor = createErrorTransformInterceptor;
exports.createErrorSanitizationInterceptor = createErrorSanitizationInterceptor;
exports.createFallbackInterceptor = createFallbackInterceptor;
exports.createTimeoutInterceptor = createTimeoutInterceptor;
exports.createAdaptiveTimeoutInterceptor = createAdaptiveTimeoutInterceptor;
exports.createRetryInterceptor = createRetryInterceptor;
exports.createConditionalRetryInterceptor = createConditionalRetryInterceptor;
exports.createMetricsCollectionInterceptor = createMetricsCollectionInterceptor;
exports.createRateTrackingInterceptor = createRateTrackingInterceptor;
exports.createResponseSizeTrackingInterceptor = createResponseSizeTrackingInterceptor;
exports.createPHISanitizationInterceptor = createPHISanitizationInterceptor;
exports.createInputSanitizationInterceptor = createInputSanitizationInterceptor;
exports.createPaginationInterceptor = createPaginationInterceptor;
exports.createStatusCodeInterceptor = createStatusCodeInterceptor;
exports.createConditionalResponseInterceptor = createConditionalResponseInterceptor;
exports.createCompressionHintInterceptor = createCompressionHintInterceptor;
/**
 * LOC: 7C3F9B5D82
 * File: /reuse/nest-interceptors-utils.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (NestJS framework)
 *   - rxjs (Reactive extensions)
 *
 * DOWNSTREAM (imported by):
 *   - backend/src/**/ 
    * .controller.ts(Controller, interceptors)
    * -backend / src /**/ * .module.ts(Global, interceptors)
    * -backend / src /**/ * .interceptor.ts(Custom, interceptors)
    * /;
/**
 * File: /reuse/nest-interceptors-utils.ts
 * Locator: WC-UTL-ICPT-002
 * Purpose: NestJS Interceptor Utilities - Request/response transformation, logging, caching
 *
 * Upstream: @nestjs/common, rxjs, rxjs/operators
 * Downstream: All NestJS controllers and modules across White Cross platform
 * Dependencies: NestJS v11.x, RxJS v7.x, TypeScript 5.x, Node 18+
 * Exports: 40 interceptor utilities for transforms, caching, logging, errors, timeouts
 *
 * LLM Context: Type-safe NestJS interceptor utilities for White Cross healthcare system.
 * Provides request/response interceptors, transform patterns, caching strategies,
 * logging middleware, error handling, timeout management, retry logic, metrics collection,
 * data sanitization, and response mapping. Critical for API performance and reliability.
 */
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
// ============================================================================
// REQUEST/RESPONSE INTERCEPTORS
// ============================================================================
/**
 * Creates a basic request/response logging interceptor.
 *
 * @param {object} [options] - Logging configuration
 * @returns {NestInterceptor} Logging interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(createLoggingInterceptor({ logBody: false }))
 * @Controller('users')
 * export class UsersController {
 *   @Get()
 *   async findAll() {
 *     // Logs request/response automatically
 *   }
 * }
 * ```
 */
function createLoggingInterceptor(options = {}) {
    let LoggingInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var LoggingInterceptor = _classThis = class {
            intercept(context, next) {
                const request = context.switchToHttp().getRequest();
                const { method, url, body, headers } = request;
                const now = Date.now();
                console.log(`[REQUEST] ${method} ${url}`);
                if (options.logBody && body) {
                    console.log('[BODY]', JSON.stringify(body));
                }
                if (options.logHeaders) {
                    console.log('[HEADERS]', headers);
                }
                return next.handle().pipe((0, operators_1.tap)((data) => {
                    const duration = Date.now() - now;
                    console.log(`[RESPONSE] ${method} ${url} - ${duration}ms`);
                }), (0, operators_1.catchError)((error) => {
                    const duration = Date.now() - now;
                    console.error(`[ERROR] ${method} ${url} - ${duration}ms`, error.message);
                    throw error;
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
    return new LoggingInterceptor();
}
/**
 * Creates an interceptor that adds custom headers to responses.
 *
 * @param {Record<string, string>} headers - Headers to add
 * @returns {NestInterceptor} Header interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(createHeaderInterceptor({
 *   'X-API-Version': '1.0',
 *   'X-RateLimit-Limit': '100'
 * }))
 * @Get()
 * async getData() {
 *   return { data: 'value' };
 * }
 * ```
 */
function createHeaderInterceptor(headers) {
    let HeaderInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var HeaderInterceptor = _classThis = class {
            intercept(context, next) {
                const response = context.switchToHttp().getResponse();
                Object.entries(headers).forEach(([key, value]) => {
                    response.setHeader(key, value);
                });
                return next.handle();
            }
        };
        __setFunctionName(_classThis, "HeaderInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            HeaderInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return HeaderInterceptor = _classThis;
    })();
    return new HeaderInterceptor();
}
/**
 * Creates an interceptor that extracts and attaches request context.
 *
 * @param {(context: ExecutionContext) => Record<string, any>} extractor - Context extraction function
 * @returns {NestInterceptor} Context interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(createRequestContextInterceptor((ctx) => ({
 *   userId: ctx.switchToHttp().getRequest().user?.id,
 *   requestId: ctx.switchToHttp().getRequest().id
 * })))
 * @Post()
 * async create(@Body() dto: CreateDto) {
 *   // Context available in request
 * }
 * ```
 */
function createRequestContextInterceptor(extractor) {
    let RequestContextInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var RequestContextInterceptor = _classThis = class {
            intercept(context, next) {
                const request = context.switchToHttp().getRequest();
                const contextData = extractor(context);
                request.context = {
                    ...request.context,
                    ...contextData,
                };
                return next.handle();
            }
        };
        __setFunctionName(_classThis, "RequestContextInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RequestContextInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return RequestContextInterceptor = _classThis;
    })();
    return new RequestContextInterceptor();
}
/**
 * Creates an interceptor that measures request execution time.
 *
 * @param {(duration: number, context: ExecutionContext) => void} onComplete - Callback with duration
 * @returns {NestInterceptor} Performance interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(createPerformanceInterceptor((duration, ctx) => {
 *   console.log(`Request took ${duration}ms`);
 *   metrics.recordDuration('api.request', duration);
 * }))
 * ```
 */
function createPerformanceInterceptor(onComplete) {
    let PerformanceInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var PerformanceInterceptor = _classThis = class {
            intercept(context, next) {
                const startTime = Date.now();
                return next.handle().pipe((0, operators_1.finalize)(() => {
                    const duration = Date.now() - startTime;
                    onComplete(duration, context);
                }));
            }
        };
        __setFunctionName(_classThis, "PerformanceInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PerformanceInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return PerformanceInterceptor = _classThis;
    })();
    return new PerformanceInterceptor();
}
// ============================================================================
// TRANSFORM INTERCEPTORS
// ============================================================================
/**
 * Creates an interceptor that wraps responses in a standard format.
 *
 * @template T - The response data type
 * @param {(data: T) => any} wrapper - Response wrapper function
 * @returns {NestInterceptor} Transform interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(createResponseWrapperInterceptor((data) => ({
 *   success: true,
 *   data,
 *   timestamp: new Date().toISOString()
 * })))
 * @Get()
 * async getData() {
 *   return { value: 'test' };
 *   // Returns: { success: true, data: { value: 'test' }, timestamp: '...' }
 * }
 * ```
 */
function createResponseWrapperInterceptor(wrapper) {
    let ResponseWrapperInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var ResponseWrapperInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.map)((data) => wrapper(data, context)));
            }
        };
        __setFunctionName(_classThis, "ResponseWrapperInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ResponseWrapperInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return ResponseWrapperInterceptor = _classThis;
    })();
    return new ResponseWrapperInterceptor();
}
/**
 * Creates an interceptor that transforms response data using a mapper function.
 *
 * @template TInput - Input data type
 * @template TOutput - Output data type
 * @param {(data: TInput) => TOutput} mapper - Data transformation function
 * @returns {NestInterceptor} Data mapper interceptor
 *
 * @example
 * ```typescript
 * interface DbUser { id: string; password_hash: string; email: string }
 * interface ApiUser { id: string; email: string }
 *
 * @UseInterceptors(createDataMapperInterceptor<DbUser, ApiUser>((user) => ({
 *   id: user.id,
 *   email: user.email
 *   // password_hash excluded
 * })))
 * ```
 */
function createDataMapperInterceptor(mapper) {
    let DataMapperInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var DataMapperInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.map)((data) => {
                    if (Array.isArray(data)) {
                        return data.map(mapper);
                    }
                    return mapper(data);
                }));
            }
        };
        __setFunctionName(_classThis, "DataMapperInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DataMapperInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return DataMapperInterceptor = _classThis;
    })();
    return new DataMapperInterceptor();
}
/**
 * Creates an interceptor that filters object properties from responses.
 *
 * @param {string[]} excludeFields - Fields to exclude from response
 * @returns {NestInterceptor} Property filter interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createPropertyFilterInterceptor([
 *   'password',
 *   'passwordHash',
 *   'ssn',
 *   'medicalRecordNumber'
 * ]))
 * @Get('users/:id')
 * async getUser(@Param('id') id: string) {
 *   // Sensitive fields automatically removed
 * }
 * ```
 */
function createPropertyFilterInterceptor(excludeFields) {
    let PropertyFilterInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var PropertyFilterInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.map)((data) => this.filterProperties(data, excludeFields)));
            }
            filterProperties(obj, excludeFields) {
                if (Array.isArray(obj)) {
                    return obj.map((item) => this.filterProperties(item, excludeFields));
                }
                if (obj !== null && typeof obj === 'object') {
                    const filtered = {};
                    Object.keys(obj).forEach((key) => {
                        if (!excludeFields.includes(key)) {
                            filtered[key] = this.filterProperties(obj[key], excludeFields);
                        }
                    });
                    return filtered;
                }
                return obj;
            }
        };
        __setFunctionName(_classThis, "PropertyFilterInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PropertyFilterInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return PropertyFilterInterceptor = _classThis;
    })();
    return new PropertyFilterInterceptor();
}
/**
 * Creates an interceptor that serializes class instances to plain objects.
 *
 * @param {object} [options] - Serialization options
 * @returns {NestInterceptor} Serialization interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createSerializationInterceptor({
 *   excludeExtraneousValues: true
 * }))
 * @Get('patients/:id')
 * async getPatient(@Param('id') id: string) {
 *   return new Patient(...); // Automatically serialized
 * }
 * ```
 */
function createSerializationInterceptor(options = {}) {
    let SerializationInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var SerializationInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.map)((data) => {
                    if (data && typeof data === 'object') {
                        return JSON.parse(JSON.stringify(data));
                    }
                    return data;
                }));
            }
        };
        __setFunctionName(_classThis, "SerializationInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SerializationInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return SerializationInterceptor = _classThis;
    })();
    return new SerializationInterceptor();
}
// ============================================================================
// CACHING INTERCEPTORS
// ============================================================================
/**
 * Creates a simple in-memory caching interceptor.
 *
 * @param {object} options - Cache configuration
 * @returns {NestInterceptor} Cache interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(createCacheInterceptor({
 *   ttl: 60000, // 1 minute
 *   keyGenerator: (ctx) => {
 *     const request = ctx.switchToHttp().getRequest();
 *     return `${request.method}:${request.url}`;
 *   }
 * }))
 * @Get('reports/daily')
 * async getDailyReport() {
 *   // Cached for 1 minute
 * }
 * ```
 */
function createCacheInterceptor(options) {
    const cache = new Map();
    let CacheInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var CacheInterceptor = _classThis = class {
            intercept(context, next) {
                const key = options.keyGenerator(context);
                const cached = cache.get(key);
                if (cached && cached.expiry > Date.now()) {
                    return (0, rxjs_1.of)(cached.data);
                }
                return next.handle().pipe((0, operators_1.tap)((data) => {
                    cache.set(key, {
                        data,
                        expiry: Date.now() + options.ttl,
                    });
                }));
            }
        };
        __setFunctionName(_classThis, "CacheInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CacheInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return CacheInterceptor = _classThis;
    })();
    return new CacheInterceptor();
}
/**
 * Creates a conditional caching interceptor based on request/response.
 *
 * @param {object} config - Conditional cache configuration
 * @returns {NestInterceptor} Conditional cache interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createConditionalCacheInterceptor({
 *   ttl: 30000,
 *   shouldCache: (ctx, data) => {
 *     const request = ctx.switchToHttp().getRequest();
 *     return request.method === 'GET' && data.cacheable;
 *   },
 *   keyGenerator: (ctx) => ctx.switchToHttp().getRequest().url
 * }))
 * ```
 */
function createConditionalCacheInterceptor(config) {
    const cache = new Map();
    let ConditionalCacheInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var ConditionalCacheInterceptor = _classThis = class {
            intercept(context, next) {
                const key = config.keyGenerator(context);
                const cached = cache.get(key);
                if (cached && cached.expiry > Date.now()) {
                    return (0, rxjs_1.of)(cached.data);
                }
                return next.handle().pipe((0, operators_1.tap)((data) => {
                    if (config.shouldCache(context, data)) {
                        cache.set(key, {
                            data,
                            expiry: Date.now() + config.ttl,
                        });
                    }
                }));
            }
        };
        __setFunctionName(_classThis, "ConditionalCacheInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ConditionalCacheInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return ConditionalCacheInterceptor = _classThis;
    })();
    return new ConditionalCacheInterceptor();
}
/**
 * Creates an interceptor that invalidates cache on mutation operations.
 *
 * @param {object} options - Cache invalidation configuration
 * @returns {NestInterceptor} Cache invalidation interceptor
 *
 * @example
 * ```typescript
 * const cache = new Map();
 *
 * @UseInterceptors(createCacheInvalidationInterceptor({
 *   cache,
 *   pattern: /^\/api\/students/,
 *   methods: ['POST', 'PUT', 'DELETE', 'PATCH']
 * }))
 * @Post('students')
 * async createStudent(@Body() dto: CreateStudentDto) {
 *   // Invalidates /api/students/* cache entries
 * }
 * ```
 */
function createCacheInvalidationInterceptor(options) {
    const { cache, pattern, methods = ['POST', 'PUT', 'DELETE', 'PATCH'] } = options;
    let CacheInvalidationInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var CacheInvalidationInterceptor = _classThis = class {
            intercept(context, next) {
                const request = context.switchToHttp().getRequest();
                if (methods.includes(request.method)) {
                    // Invalidate matching cache entries after mutation
                    return next.handle().pipe((0, operators_1.tap)(() => {
                        const keysToDelete = [];
                        cache.forEach((value, key) => {
                            if (pattern.test(key)) {
                                keysToDelete.push(key);
                            }
                        });
                        keysToDelete.forEach((key) => cache.delete(key));
                    }));
                }
                return next.handle();
            }
        };
        __setFunctionName(_classThis, "CacheInvalidationInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CacheInvalidationInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return CacheInvalidationInterceptor = _classThis;
    })();
    return new CacheInvalidationInterceptor();
}
// ============================================================================
// LOGGING INTERCEPTORS
// ============================================================================
/**
 * Creates a structured logging interceptor with context.
 *
 * @param {object} logger - Logger instance with log methods
 * @returns {NestInterceptor} Structured logging interceptor
 *
 * @example
 * ```typescript
 * const logger = {
 *   info: (msg, meta) => console.log(msg, meta),
 *   error: (msg, meta) => console.error(msg, meta)
 * };
 *
 * @UseInterceptors(createStructuredLoggingInterceptor(logger))
 * @Controller('api')
 * export class ApiController {}
 * ```
 */
function createStructuredLoggingInterceptor(logger) {
    let StructuredLoggingInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var StructuredLoggingInterceptor = _classThis = class {
            intercept(context, next) {
                const request = context.switchToHttp().getRequest();
                const { method, url, headers, body } = request;
                const startTime = Date.now();
                const metadata = {
                    method,
                    url,
                    userAgent: headers['user-agent'],
                    ip: request.ip,
                    userId: request.user?.id,
                };
                logger.info('Incoming request', metadata);
                return next.handle().pipe((0, operators_1.tap)((data) => {
                    logger.info('Request completed', {
                        ...metadata,
                        duration: Date.now() - startTime,
                        statusCode: context.switchToHttp().getResponse().statusCode,
                    });
                }), (0, operators_1.catchError)((error) => {
                    logger.error('Request failed', {
                        ...metadata,
                        duration: Date.now() - startTime,
                        error: error.message,
                        stack: error.stack,
                    });
                    return (0, rxjs_1.throwError)(() => error);
                }));
            }
        };
        __setFunctionName(_classThis, "StructuredLoggingInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            StructuredLoggingInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return StructuredLoggingInterceptor = _classThis;
    })();
    return new StructuredLoggingInterceptor();
}
/**
 * Creates an audit logging interceptor for HIPAA compliance.
 *
 * @param {object} auditService - Audit service instance
 * @returns {NestInterceptor} Audit logging interceptor
 *
 * @example
 * ```typescript
 * const auditService = {
 *   logAccess: async (data) => {
 *     await db.auditLogs.create(data);
 *   }
 * };
 *
 * @UseInterceptors(createAuditLoggingInterceptor(auditService))
 * @Get('patients/:id')
 * async getPatient(@Param('id') id: string) {
 *   // Access automatically logged for HIPAA compliance
 * }
 * ```
 */
function createAuditLoggingInterceptor(auditService) {
    let AuditLoggingInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var AuditLoggingInterceptor = _classThis = class {
            intercept(context, next) {
                const request = context.switchToHttp().getRequest();
                const { method, url, user, ip } = request;
                const auditData = {
                    userId: user?.id,
                    userName: user?.name,
                    method,
                    url,
                    ip,
                    timestamp: new Date(),
                    resource: this.extractResource(url),
                };
                return next.handle().pipe((0, operators_1.tap)(async (response) => {
                    await auditService.logAccess({
                        ...auditData,
                        action: 'access',
                        success: true,
                    });
                }), (0, operators_1.catchError)(async (error) => {
                    await auditService.logAccess({
                        ...auditData,
                        action: 'access_denied',
                        success: false,
                        error: error.message,
                    });
                    return (0, rxjs_1.throwError)(() => error);
                }));
            }
            extractResource(url) {
                const match = url.match(/\/([^/]+)/);
                return match ? match[1] : 'unknown';
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
    return new AuditLoggingInterceptor();
}
/**
 * Creates a request/response payload logging interceptor.
 *
 * @param {object} options - Payload logging configuration
 * @returns {NestInterceptor} Payload logging interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createPayloadLoggingInterceptor({
 *   logRequest: true,
 *   logResponse: true,
 *   maxBodyLength: 1000,
 *   sanitizeFields: ['password', 'ssn', 'creditCard']
 * }))
 * ```
 */
function createPayloadLoggingInterceptor(options) {
    let PayloadLoggingInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var PayloadLoggingInterceptor = _classThis = class {
            intercept(context, next) {
                const request = context.switchToHttp().getRequest();
                if (options.logRequest && request.body) {
                    const sanitized = this.sanitize(request.body, options.sanitizeFields || []);
                    console.log('[REQUEST PAYLOAD]', this.truncate(sanitized, options.maxBodyLength));
                }
                return next.handle().pipe((0, operators_1.tap)((data) => {
                    if (options.logResponse && data) {
                        const sanitized = this.sanitize(data, options.sanitizeFields || []);
                        console.log('[RESPONSE PAYLOAD]', this.truncate(sanitized, options.maxBodyLength));
                    }
                }));
            }
            sanitize(obj, fields) {
                if (typeof obj !== 'object' || obj === null)
                    return obj;
                const sanitized = Array.isArray(obj) ? [] : {};
                Object.keys(obj).forEach((key) => {
                    if (fields.includes(key)) {
                        sanitized[key] = '[REDACTED]';
                    }
                    else if (typeof obj[key] === 'object') {
                        sanitized[key] = this.sanitize(obj[key], fields);
                    }
                    else {
                        sanitized[key] = obj[key];
                    }
                });
                return sanitized;
            }
            truncate(obj, maxLength) {
                if (!maxLength)
                    return obj;
                const str = JSON.stringify(obj);
                return str.length > maxLength ? str.substring(0, maxLength) + '...' : obj;
            }
        };
        __setFunctionName(_classThis, "PayloadLoggingInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PayloadLoggingInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return PayloadLoggingInterceptor = _classThis;
    })();
    return new PayloadLoggingInterceptor();
}
// ============================================================================
// ERROR HANDLING INTERCEPTORS
// ============================================================================
/**
 * Creates an error transformation interceptor.
 *
 * @param {(error: Error) => HttpException} transformer - Error transformer function
 * @returns {NestInterceptor} Error transform interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createErrorTransformInterceptor((error) => {
 *   if (error.name === 'SequelizeUniqueConstraintError') {
 *     return new ConflictException('Resource already exists');
 *   }
 *   return new InternalServerErrorException('Internal error');
 * }))
 * ```
 */
function createErrorTransformInterceptor(transformer) {
    let ErrorTransformInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var ErrorTransformInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.catchError)((error) => {
                    const transformed = transformer(error);
                    return (0, rxjs_1.throwError)(() => transformed);
                }));
            }
        };
        __setFunctionName(_classThis, "ErrorTransformInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ErrorTransformInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return ErrorTransformInterceptor = _classThis;
    })();
    return new ErrorTransformInterceptor();
}
/**
 * Creates an error sanitization interceptor that removes sensitive data from errors.
 *
 * @param {string[]} sensitiveFields - Fields to sanitize
 * @returns {NestInterceptor} Error sanitization interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createErrorSanitizationInterceptor([
 *   'password',
 *   'apiKey',
 *   'connectionString'
 * ]))
 * ```
 */
function createErrorSanitizationInterceptor(sensitiveFields) {
    let ErrorSanitizationInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var ErrorSanitizationInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.catchError)((error) => {
                    // Sanitize error message and stack
                    const sanitized = { ...error };
                    sensitiveFields.forEach((field) => {
                        if (sanitized.message?.includes(field)) {
                            sanitized.message = sanitized.message.replace(new RegExp(field, 'gi'), '[REDACTED]');
                        }
                        if (sanitized.stack?.includes(field)) {
                            sanitized.stack = sanitized.stack.replace(new RegExp(field, 'gi'), '[REDACTED]');
                        }
                    });
                    return (0, rxjs_1.throwError)(() => sanitized);
                }));
            }
        };
        __setFunctionName(_classThis, "ErrorSanitizationInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ErrorSanitizationInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return ErrorSanitizationInterceptor = _classThis;
    })();
    return new ErrorSanitizationInterceptor();
}
/**
 * Creates a fallback interceptor that provides default values on error.
 *
 * @template T - The fallback value type
 * @param {T | ((error: Error) => T)} fallbackValue - Fallback value or generator
 * @returns {NestInterceptor} Fallback interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createFallbackInterceptor({
 *   users: [],
 *   total: 0,
 *   message: 'Service temporarily unavailable'
 * }))
 * @Get('users')
 * async getUsers() {
 *   // Returns fallback value if service fails
 * }
 * ```
 */
function createFallbackInterceptor(fallbackValue) {
    let FallbackInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var FallbackInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.catchError)((error) => {
                    console.error('Request failed, returning fallback:', error.message);
                    const value = typeof fallbackValue === 'function'
                        ? fallbackValue(error)
                        : fallbackValue;
                    return (0, rxjs_1.of)(value);
                }));
            }
        };
        __setFunctionName(_classThis, "FallbackInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FallbackInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return FallbackInterceptor = _classThis;
    })();
    return new FallbackInterceptor();
}
// ============================================================================
// TIMEOUT INTERCEPTORS
// ============================================================================
/**
 * Creates a timeout interceptor that throws error after specified duration.
 *
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} [message] - Custom timeout message
 * @returns {NestInterceptor} Timeout interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createTimeoutInterceptor(5000, 'Request timeout'))
 * @Get('slow-operation')
 * async slowOperation() {
 *   // Throws timeout error if takes > 5 seconds
 * }
 * ```
 */
function createTimeoutInterceptor(timeoutMs, message) {
    let TimeoutInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var TimeoutInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.timeout)(timeoutMs), (0, operators_1.catchError)((error) => {
                    if (error instanceof rxjs_1.TimeoutError) {
                        return (0, rxjs_1.throwError)(() => new common_1.HttpException(message || `Request timeout after ${timeoutMs}ms`, common_1.HttpStatus.REQUEST_TIMEOUT));
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
    return new TimeoutInterceptor();
}
/**
 * Creates an adaptive timeout interceptor based on request characteristics.
 *
 * @param {(context: ExecutionContext) => number} timeoutCalculator - Dynamic timeout calculator
 * @returns {NestInterceptor} Adaptive timeout interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createAdaptiveTimeoutInterceptor((ctx) => {
 *   const request = ctx.switchToHttp().getRequest();
 *   // Large file uploads get more time
 *   const contentLength = parseInt(request.headers['content-length'] || '0');
 *   return contentLength > 10000000 ? 60000 : 5000;
 * }))
 * ```
 */
function createAdaptiveTimeoutInterceptor(timeoutCalculator) {
    let AdaptiveTimeoutInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var AdaptiveTimeoutInterceptor = _classThis = class {
            intercept(context, next) {
                const timeoutMs = timeoutCalculator(context);
                return next.handle().pipe((0, operators_1.timeout)(timeoutMs), (0, operators_1.catchError)((error) => {
                    if (error instanceof rxjs_1.TimeoutError) {
                        return (0, rxjs_1.throwError)(() => new common_1.HttpException(`Request timeout after ${timeoutMs}ms`, common_1.HttpStatus.REQUEST_TIMEOUT));
                    }
                    return (0, rxjs_1.throwError)(() => error);
                }));
            }
        };
        __setFunctionName(_classThis, "AdaptiveTimeoutInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdaptiveTimeoutInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return AdaptiveTimeoutInterceptor = _classThis;
    })();
    return new AdaptiveTimeoutInterceptor();
}
// ============================================================================
// RETRY INTERCEPTORS
// ============================================================================
/**
 * Creates a retry interceptor with exponential backoff.
 *
 * @param {object} options - Retry configuration
 * @returns {NestInterceptor} Retry interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createRetryInterceptor({
 *   maxRetries: 3,
 *   initialDelay: 1000,
 *   maxDelay: 5000,
 *   shouldRetry: (error) => error.status >= 500
 * }))
 * @Get('external-api')
 * async callExternalAPI() {
 *   // Retries on 5xx errors with exponential backoff
 * }
 * ```
 */
function createRetryInterceptor(options) {
    let RetryInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var RetryInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.retryWhen)((errors) => errors.pipe((0, operators_1.scan)((retryCount, error) => {
                    if (retryCount >= options.maxRetries ||
                        (options.shouldRetry && !options.shouldRetry(error))) {
                        throw error;
                    }
                    return retryCount + 1;
                }, 0), (0, operators_1.mergeMap)((retryCount) => {
                    const delayMs = Math.min(options.initialDelay * Math.pow(2, retryCount), options.maxDelay || Infinity);
                    console.log(`Retry attempt ${retryCount + 1} after ${delayMs}ms`);
                    return (0, rxjs_1.timer)(delayMs);
                }))));
            }
        };
        __setFunctionName(_classThis, "RetryInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RetryInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return RetryInterceptor = _classThis;
    })();
    return new RetryInterceptor();
}
/**
 * Creates a conditional retry interceptor.
 *
 * @param {object} config - Conditional retry configuration
 * @returns {NestInterceptor} Conditional retry interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createConditionalRetryInterceptor({
 *   maxRetries: 3,
 *   retryDelay: 1000,
 *   shouldRetry: (error, retryCount) => {
 *     return error.status === 503 && retryCount < 3;
 *   }
 * }))
 * ```
 */
function createConditionalRetryInterceptor(config) {
    let ConditionalRetryInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var ConditionalRetryInterceptor = _classThis = class {
            intercept(context, next) {
                let retryCount = 0;
                return next.handle().pipe((0, operators_1.retryWhen)((errors) => errors.pipe((0, operators_1.mergeMap)((error) => {
                    if (retryCount >= config.maxRetries ||
                        !config.shouldRetry(error, retryCount)) {
                        return (0, rxjs_1.throwError)(() => error);
                    }
                    retryCount++;
                    return (0, rxjs_1.timer)(config.retryDelay);
                }))));
            }
        };
        __setFunctionName(_classThis, "ConditionalRetryInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ConditionalRetryInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return ConditionalRetryInterceptor = _classThis;
    })();
    return new ConditionalRetryInterceptor();
}
// ============================================================================
// METRICS COLLECTION INTERCEPTORS
// ============================================================================
/**
 * Creates a metrics collection interceptor for monitoring.
 *
 * @param {object} metricsService - Metrics service instance
 * @returns {NestInterceptor} Metrics collection interceptor
 *
 * @example
 * ```typescript
 * const metricsService = {
 *   recordRequestDuration: (route, duration) => { ... },
 *   incrementRequestCount: (route, status) => { ... }
 * };
 *
 * @UseInterceptors(createMetricsCollectionInterceptor(metricsService))
 * @Controller('api')
 * export class ApiController {}
 * ```
 */
function createMetricsCollectionInterceptor(metricsService) {
    let MetricsCollectionInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var MetricsCollectionInterceptor = _classThis = class {
            intercept(context, next) {
                const request = context.switchToHttp().getRequest();
                const startTime = Date.now();
                const route = request.route?.path || request.url;
                const method = request.method;
                return next.handle().pipe((0, operators_1.tap)(() => {
                    const duration = Date.now() - startTime;
                    const response = context.switchToHttp().getResponse();
                    const status = response.statusCode;
                    metricsService.recordRequestDuration(route, duration, status);
                    metricsService.incrementRequestCount(route, method, status);
                }), (0, operators_1.catchError)((error) => {
                    const duration = Date.now() - startTime;
                    const status = error.status || 500;
                    metricsService.recordRequestDuration(route, duration, status);
                    metricsService.incrementRequestCount(route, method, status);
                    return (0, rxjs_1.throwError)(() => error);
                }));
            }
        };
        __setFunctionName(_classThis, "MetricsCollectionInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MetricsCollectionInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return MetricsCollectionInterceptor = _classThis;
    })();
    return new MetricsCollectionInterceptor();
}
/**
 * Creates a request rate tracking interceptor.
 *
 * @param {object} options - Rate tracking configuration
 * @returns {NestInterceptor} Rate tracking interceptor
 *
 * @example
 * ```typescript
 * const rateTracker = new Map();
 *
 * @UseInterceptors(createRateTrackingInterceptor({
 *   storage: rateTracker,
 *   windowMs: 60000, // 1 minute
 *   onRateCalculated: (ip, rate) => {
 *     console.log(`IP ${ip}: ${rate} req/min`);
 *   }
 * }))
 * ```
 */
function createRateTrackingInterceptor(options) {
    let RateTrackingInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var RateTrackingInterceptor = _classThis = class {
            intercept(context, next) {
                const request = context.switchToHttp().getRequest();
                const key = request.ip || 'unknown';
                const now = Date.now();
                // Get existing timestamps and filter old ones
                const timestamps = options.storage.get(key) || [];
                const recent = timestamps.filter((ts) => now - ts < options.windowMs);
                recent.push(now);
                options.storage.set(key, recent);
                if (options.onRateCalculated) {
                    const rate = recent.length;
                    options.onRateCalculated(key, rate);
                }
                return next.handle();
            }
        };
        __setFunctionName(_classThis, "RateTrackingInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RateTrackingInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return RateTrackingInterceptor = _classThis;
    })();
    return new RateTrackingInterceptor();
}
/**
 * Creates a response size tracking interceptor.
 *
 * @param {(size: number, route: string) => void} onSizeCalculated - Size callback
 * @returns {NestInterceptor} Response size tracking interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createResponseSizeTrackingInterceptor((size, route) => {
 *   console.log(`Route ${route} returned ${size} bytes`);
 *   metrics.recordResponseSize(route, size);
 * }))
 * ```
 */
function createResponseSizeTrackingInterceptor(onSizeCalculated) {
    let ResponseSizeTrackingInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var ResponseSizeTrackingInterceptor = _classThis = class {
            intercept(context, next) {
                const request = context.switchToHttp().getRequest();
                const route = request.route?.path || request.url;
                return next.handle().pipe((0, operators_1.tap)((data) => {
                    const size = JSON.stringify(data).length;
                    onSizeCalculated(size, route);
                }));
            }
        };
        __setFunctionName(_classThis, "ResponseSizeTrackingInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ResponseSizeTrackingInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return ResponseSizeTrackingInterceptor = _classThis;
    })();
    return new ResponseSizeTrackingInterceptor();
}
// ============================================================================
// DATA SANITIZATION INTERCEPTORS
// ============================================================================
/**
 * Creates a PHI/PII sanitization interceptor for healthcare data.
 *
 * @param {string[]} sensitiveFields - Fields containing PHI/PII
 * @returns {NestInterceptor} Data sanitization interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createPHISanitizationInterceptor([
 *   'ssn',
 *   'medicalRecordNumber',
 *   'dateOfBirth',
 *   'phoneNumber',
 *   'address'
 * ]))
 * @Get('patients')
 * async getPatients() {
 *   // PHI fields automatically masked in logs
 * }
 * ```
 */
function createPHISanitizationInterceptor(sensitiveFields) {
    let PHISanitizationInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var PHISanitizationInterceptor = _classThis = class {
            intercept(context, next) {
                const request = context.switchToHttp().getRequest();
                // Sanitize request body for logging
                if (request.body) {
                    request.sanitizedBody = this.sanitize(request.body, sensitiveFields);
                }
                return next.handle().pipe((0, operators_1.tap)((data) => {
                    // Sanitize response for logging (not for client)
                    if (data) {
                        request.sanitizedResponse = this.sanitize(data, sensitiveFields);
                    }
                }));
            }
            sanitize(obj, fields) {
                if (typeof obj !== 'object' || obj === null)
                    return obj;
                const sanitized = Array.isArray(obj) ? [] : {};
                Object.keys(obj).forEach((key) => {
                    if (fields.includes(key)) {
                        sanitized[key] = this.maskValue(obj[key]);
                    }
                    else if (typeof obj[key] === 'object') {
                        sanitized[key] = this.sanitize(obj[key], fields);
                    }
                    else {
                        sanitized[key] = obj[key];
                    }
                });
                return sanitized;
            }
            maskValue(value) {
                if (typeof value === 'string') {
                    return value.length > 4 ? `***${value.slice(-4)}` : '***';
                }
                return '***';
            }
        };
        __setFunctionName(_classThis, "PHISanitizationInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PHISanitizationInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return PHISanitizationInterceptor = _classThis;
    })();
    return new PHISanitizationInterceptor();
}
/**
 * Creates an input validation sanitization interceptor.
 *
 * @param {object} options - Sanitization rules
 * @returns {NestInterceptor} Input sanitization interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createInputSanitizationInterceptor({
 *   trimStrings: true,
 *   removeNullValues: true,
 *   convertEmptyStringsToNull: true
 * }))
 * @Post()
 * async create(@Body() dto: CreateDto) {
 *   // Input automatically sanitized
 * }
 * ```
 */
function createInputSanitizationInterceptor(options) {
    let InputSanitizationInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var InputSanitizationInterceptor = _classThis = class {
            intercept(context, next) {
                const request = context.switchToHttp().getRequest();
                if (request.body) {
                    request.body = this.sanitize(request.body, options);
                }
                return next.handle();
            }
            sanitize(obj, opts) {
                if (typeof obj !== 'object' || obj === null) {
                    if (typeof obj === 'string' && opts.trimStrings) {
                        return obj.trim();
                    }
                    return obj;
                }
                if (Array.isArray(obj)) {
                    return obj.map((item) => this.sanitize(item, opts));
                }
                const sanitized = {};
                Object.keys(obj).forEach((key) => {
                    let value = obj[key];
                    if (typeof value === 'string') {
                        if (opts.trimStrings) {
                            value = value.trim();
                        }
                        if (opts.convertEmptyStringsToNull && value === '') {
                            value = null;
                        }
                    }
                    if (opts.removeNullValues && (value === null || value === undefined)) {
                        return;
                    }
                    sanitized[key] = typeof value === 'object' ? this.sanitize(value, opts) : value;
                });
                return sanitized;
            }
        };
        __setFunctionName(_classThis, "InputSanitizationInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            InputSanitizationInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return InputSanitizationInterceptor = _classThis;
    })();
    return new InputSanitizationInterceptor();
}
// ============================================================================
// RESPONSE MAPPING INTERCEPTORS
// ============================================================================
/**
 * Creates a pagination response interceptor.
 *
 * @template T - The data item type
 * @returns {NestInterceptor} Pagination interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createPaginationInterceptor())
 * @Get('students')
 * async getStudents(@Query() query: PaginationDto) {
 *   return {
 *     data: students,
 *     total: 100,
 *     page: 1,
 *     limit: 10
 *   };
 *   // Transformed to: { data: [...], meta: { total, page, limit, pages } }
 * }
 * ```
 */
function createPaginationInterceptor() {
    let PaginationInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var PaginationInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.map)((response) => {
                    if (response && 'data' in response && 'total' in response) {
                        const { data, total, page = 1, limit = 10, ...rest } = response;
                        return {
                            data,
                            meta: {
                                total,
                                page,
                                limit,
                                pages: Math.ceil(total / limit),
                                hasNextPage: page * limit < total,
                                hasPreviousPage: page > 1,
                            },
                            ...rest,
                        };
                    }
                    return response;
                }));
            }
        };
        __setFunctionName(_classThis, "PaginationInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PaginationInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return PaginationInterceptor = _classThis;
    })();
    return new PaginationInterceptor();
}
/**
 * Creates a status code override interceptor.
 *
 * @param {(data: any, context: ExecutionContext) => number} statusCodeResolver - Status resolver
 * @returns {NestInterceptor} Status code interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createStatusCodeInterceptor((data, ctx) => {
 *   if (data.created) return HttpStatus.CREATED;
 *   if (data.empty) return HttpStatus.NO_CONTENT;
 *   return HttpStatus.OK;
 * }))
 * ```
 */
function createStatusCodeInterceptor(statusCodeResolver) {
    let StatusCodeInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var StatusCodeInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.tap)((data) => {
                    const response = context.switchToHttp().getResponse();
                    const statusCode = statusCodeResolver(data, context);
                    response.status(statusCode);
                }));
            }
        };
        __setFunctionName(_classThis, "StatusCodeInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            StatusCodeInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return StatusCodeInterceptor = _classThis;
    })();
    return new StatusCodeInterceptor();
}
/**
 * Creates a conditional response interceptor that modifies response based on criteria.
 *
 * @param {object} options - Conditional response configuration
 * @returns {NestInterceptor} Conditional response interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createConditionalResponseInterceptor({
 *   condition: (data, ctx) => {
 *     const request = ctx.switchToHttp().getRequest();
 *     return request.query.includeMetadata === 'true';
 *   },
 *   transform: (data) => ({
 *     ...data,
 *     metadata: { timestamp: new Date(), version: '1.0' }
 *   })
 * }))
 * ```
 */
function createConditionalResponseInterceptor(options) {
    let ConditionalResponseInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var ConditionalResponseInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.map)((data) => {
                    if (options.condition(data, context)) {
                        return options.transform(data);
                    }
                    return data;
                }));
            }
        };
        __setFunctionName(_classThis, "ConditionalResponseInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ConditionalResponseInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return ConditionalResponseInterceptor = _classThis;
    })();
    return new ConditionalResponseInterceptor();
}
/**
 * Creates a response compression hint interceptor.
 *
 * @param {object} options - Compression configuration
 * @returns {NestInterceptor} Compression hint interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createCompressionHintInterceptor({
 *   minSize: 1024, // Only compress if response > 1KB
 *   encoding: 'gzip'
 * }))
 * ```
 */
function createCompressionHintInterceptor(options) {
    let CompressionHintInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var CompressionHintInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.tap)((data) => {
                    const response = context.switchToHttp().getResponse();
                    const size = JSON.stringify(data).length;
                    if (size >= options.minSize) {
                        response.setHeader('Content-Encoding', options.encoding || 'gzip');
                    }
                }));
            }
        };
        __setFunctionName(_classThis, "CompressionHintInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CompressionHintInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return CompressionHintInterceptor = _classThis;
    })();
    return new CompressionHintInterceptor();
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Request/Response
    createLoggingInterceptor,
    createHeaderInterceptor,
    createRequestContextInterceptor,
    createPerformanceInterceptor,
    // Transform
    createResponseWrapperInterceptor,
    createDataMapperInterceptor,
    createPropertyFilterInterceptor,
    createSerializationInterceptor,
    // Caching
    createCacheInterceptor,
    createConditionalCacheInterceptor,
    createCacheInvalidationInterceptor,
    // Logging
    createStructuredLoggingInterceptor,
    createAuditLoggingInterceptor,
    createPayloadLoggingInterceptor,
    // Error handling
    createErrorTransformInterceptor,
    createErrorSanitizationInterceptor,
    createFallbackInterceptor,
    // Timeout
    createTimeoutInterceptor,
    createAdaptiveTimeoutInterceptor,
    // Retry
    createRetryInterceptor,
    createConditionalRetryInterceptor,
    // Metrics
    createMetricsCollectionInterceptor,
    createRateTrackingInterceptor,
    createResponseSizeTrackingInterceptor,
    // Sanitization
    createPHISanitizationInterceptor,
    createInputSanitizationInterceptor,
    // Response mapping
    createPaginationInterceptor,
    createStatusCodeInterceptor,
    createConditionalResponseInterceptor,
    createCompressionHintInterceptor,
};
//# sourceMappingURL=nest-interceptors-utils.js.map