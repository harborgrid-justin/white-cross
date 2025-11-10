/**
 * LOC: APIGW1234567
 * File: /reuse/api-gateway-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API gateway implementations
 *   - NestJS middleware and interceptors
 *   - Backend API controllers
 */
/**
 * File: /reuse/api-gateway-kit.ts
 * Locator: WC-UTL-APIGW-001
 * Purpose: Comprehensive API Gateway Utilities - versioning, routing, transformation, security, rate limiting, caching
 *
 * Upstream: Independent utility module for API gateway implementation
 * Downstream: ../backend/*, API controllers, middleware, gateway services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for API gateway, versioning, rate limiting, caching, security, transformation
 *
 * LLM Context: Comprehensive API gateway utilities for implementing production-ready API gateway patterns.
 * Provides versioning, routing, request/response transformation, API composition, rate limiting, caching,
 * security headers, CORS, request logging, tracing, and error formatting. Essential for scalable API infrastructure.
 */
import { Request, Response, NextFunction } from 'express';
import { Sequelize } from 'sequelize';
interface ApiVersion {
    version: string;
    prefix: string;
    deprecated?: boolean;
    sunsetDate?: Date;
    supportedFormats: string[];
}
interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    strategy: 'fixed' | 'sliding' | 'token-bucket';
    keyGenerator?: (req: Request) => string;
}
interface CacheConfig {
    ttl: number;
    strategy: 'private' | 'public' | 'no-cache';
    varyBy?: string[];
    tags?: string[];
}
interface TransformConfig {
    input?: {
        rename?: Record<string, string>;
        remove?: string[];
        defaults?: Record<string, any>;
    };
    output?: {
        rename?: Record<string, string>;
        remove?: string[];
        wrap?: string;
    };
}
interface AggregationRequest {
    requests: Array<{
        id: string;
        url: string;
        method: string;
        headers?: Record<string, string>;
        body?: any;
    }>;
    parallel?: boolean;
    continueOnError?: boolean;
}
interface AggregationResponse {
    results: Array<{
        id: string;
        status: number;
        data: any;
        error?: string;
    }>;
    duration: number;
}
interface ApiKeyValidationResult {
    valid: boolean;
    apiKey?: any;
    error?: string;
    scopes?: string[];
}
interface SecurityHeaders {
    [key: string]: string;
}
interface CorsConfig {
    origins: string[] | string;
    methods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    credentials: boolean;
    maxAge: number;
}
interface HealthCheckResult {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    uptime: number;
    checks: Record<string, HealthCheckDetail>;
}
interface HealthCheckDetail {
    status: 'pass' | 'fail' | 'warn';
    responseTime?: number;
    message?: string;
    details?: any;
}
interface RequestTrace {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    timestamp: number;
    duration?: number;
    metadata: Record<string, any>;
}
interface ApiErrorResponse {
    error: {
        code: string;
        message: string;
        statusCode: number;
        timestamp: string;
        traceId?: string;
        details?: any[];
        path?: string;
    };
}
interface SanitizationRules {
    trim?: boolean;
    lowercase?: boolean;
    uppercase?: boolean;
    removeHTML?: boolean;
    allowedTags?: string[];
    maxLength?: number;
}
interface ValidationRule {
    field: string;
    type: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'uuid' | 'date';
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
}
/**
 * Sequelize model for API Keys with scopes, rate limits, and expiration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ApiKey model
 *
 * @example
 * ```typescript
 * const ApiKey = createApiKeyModel(sequelize);
 * const key = await ApiKey.create({
 *   key: 'ak_live_abc123',
 *   name: 'Production API Key',
 *   scopes: ['read:users', 'write:users'],
 *   rateLimit: 1000,
 *   expiresAt: new Date('2025-12-31')
 * });
 * ```
 */
export declare const createApiKeyModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        key: string;
        name: string;
        scopes: string[];
        rateLimit: number;
        rateLimitWindow: number;
        enabled: boolean;
        expiresAt: Date | null;
        lastUsedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for API Gateway Routes with versioning and configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GatewayRoute model
 *
 * @example
 * ```typescript
 * const GatewayRoute = createGatewayRouteModel(sequelize);
 * const route = await GatewayRoute.create({
 *   path: '/api/v1/users',
 *   method: 'GET',
 *   version: 'v1',
 *   targetUrl: 'http://user-service/users',
 *   authRequired: true
 * });
 * ```
 */
export declare const createGatewayRouteModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        path: string;
        method: string;
        version: string;
        targetUrl: string;
        authRequired: boolean;
        rateLimit: Record<string, any> | null;
        cacheConfig: Record<string, any> | null;
        transformConfig: Record<string, any> | null;
        enabled: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Rate Limit tracking per API key and endpoint.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RateLimitLog model
 *
 * @example
 * ```typescript
 * const RateLimitLog = createRateLimitLogModel(sequelize);
 * const log = await RateLimitLog.create({
 *   identifier: 'apikey:ak_123',
 *   endpoint: '/api/v1/users',
 *   requestCount: 1,
 *   windowStart: new Date()
 * });
 * ```
 */
export declare const createRateLimitLogModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        identifier: string;
        endpoint: string;
        requestCount: number;
        windowStart: Date;
        windowEnd: Date;
        blocked: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Extracts API version from request URL, header, or query parameter.
 *
 * @param {Request} req - Express request object
 * @param {string} [defaultVersion='v1'] - Default version if not specified
 * @returns {string} API version string
 *
 * @example
 * ```typescript
 * // From URL: /api/v2/users
 * const version = extractApiVersion(req); // 'v2'
 *
 * // From header: X-API-Version: v3
 * const version = extractApiVersion(req); // 'v3'
 * ```
 */
export declare const extractApiVersion: (req: Request, defaultVersion?: string) => string;
/**
 * Creates versioned route path with proper prefix.
 *
 * @param {string} basePath - Base path without version
 * @param {string} version - API version
 * @param {string} [prefix='/api'] - API prefix
 * @returns {string} Versioned route path
 *
 * @example
 * ```typescript
 * const path = createVersionedRoute('/users', 'v2');
 * // Result: '/api/v2/users'
 * ```
 */
export declare const createVersionedRoute: (basePath: string, version: string, prefix?: string) => string;
/**
 * Validates if API version is supported and checks deprecation status.
 *
 * @param {string} version - API version to validate
 * @param {ApiVersion[]} supportedVersions - Array of supported versions
 * @returns {{ valid: boolean; deprecated: boolean; message?: string }} Validation result
 *
 * @example
 * ```typescript
 * const versions = [
 *   { version: 'v1', prefix: '/api/v1', deprecated: true, supportedFormats: ['json'] },
 *   { version: 'v2', prefix: '/api/v2', supportedFormats: ['json', 'xml'] }
 * ];
 * const result = validateApiVersion('v1', versions);
 * // Result: { valid: true, deprecated: true, message: 'API version v1 is deprecated' }
 * ```
 */
export declare const validateApiVersion: (version: string, supportedVersions: ApiVersion[]) => {
    valid: boolean;
    deprecated: boolean;
    message?: string;
};
/**
 * Middleware factory for routing requests based on API version.
 *
 * @param {Record<string, (req: Request, res: Response, next: NextFunction) => void>} versionHandlers - Version-specific handlers
 * @param {string} [defaultVersion='v1'] - Default version
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * const versionRouter = createVersionRouter({
 *   v1: (req, res, next) => { res.json({ version: 'v1' }); },
 *   v2: (req, res, next) => { res.json({ version: 'v2' }); }
 * });
 * app.use('/api/users', versionRouter);
 * ```
 */
export declare const createVersionRouter: (versionHandlers: Record<string, (req: Request, res: Response, next: NextFunction) => void>, defaultVersion?: string) => (req: Request, res: Response, next: NextFunction) => any;
/**
 * Transforms request body based on configuration (rename, remove, defaults).
 *
 * @param {any} body - Request body
 * @param {TransformConfig['input']} config - Transformation configuration
 * @returns {any} Transformed request body
 *
 * @example
 * ```typescript
 * const transformed = transformRequestBody(
 *   { first_name: 'John', age: 30 },
 *   {
 *     rename: { first_name: 'firstName' },
 *     defaults: { status: 'active' }
 *   }
 * );
 * // Result: { firstName: 'John', age: 30, status: 'active' }
 * ```
 */
export declare const transformRequestBody: (body: any, config?: TransformConfig["input"]) => any;
/**
 * Transforms response data based on configuration (rename, remove, wrap).
 *
 * @param {any} data - Response data
 * @param {TransformConfig['output']} config - Transformation configuration
 * @returns {any} Transformed response data
 *
 * @example
 * ```typescript
 * const transformed = transformResponseBody(
 *   { id: 1, name: 'John' },
 *   {
 *     rename: { id: 'userId' },
 *     wrap: 'user'
 *   }
 * );
 * // Result: { user: { userId: 1, name: 'John' } }
 * ```
 */
export declare const transformResponseBody: (data: any, config?: TransformConfig["output"]) => any;
/**
 * Converts response data to specified format (JSON, XML, CSV).
 *
 * @param {any} data - Response data
 * @param {string} format - Output format
 * @returns {string} Formatted response string
 *
 * @example
 * ```typescript
 * const csv = convertResponseFormat(
 *   [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
 *   'csv'
 * );
 * // Result: 'id,name\n1,John\n2,Jane'
 * ```
 */
export declare const convertResponseFormat: (data: any, format: string) => string;
/**
 * Middleware for automatic content negotiation based on Accept header.
 *
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Next middleware
 *
 * @example
 * ```typescript
 * app.use(contentNegotiationMiddleware);
 * app.get('/api/v1/users', (req, res) => {
 *   res.locals.data = [{ id: 1, name: 'John' }];
 *   // Automatically formatted based on Accept header
 * });
 * ```
 */
export declare const contentNegotiationMiddleware: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Executes multiple API requests in parallel and aggregates results.
 *
 * @param {AggregationRequest} request - Aggregation request configuration
 * @returns {Promise<AggregationResponse>} Aggregated response
 *
 * @example
 * ```typescript
 * const result = await aggregateApiRequests({
 *   requests: [
 *     { id: 'users', url: '/api/v1/users', method: 'GET' },
 *     { id: 'posts', url: '/api/v1/posts', method: 'GET' }
 *   ],
 *   parallel: true
 * });
 * // Result: { results: [{ id: 'users', status: 200, data: [...] }, ...], duration: 150 }
 * ```
 */
export declare const aggregateApiRequests: (request: AggregationRequest) => Promise<AggregationResponse>;
/**
 * Merges multiple API responses into a single unified response.
 *
 * @param {any[]} responses - Array of API responses
 * @param {string} mergeStrategy - Strategy: 'flat', 'nested', 'indexed'
 * @returns {any} Merged response
 *
 * @example
 * ```typescript
 * const merged = mergeApiResponses(
 *   [{ users: [...] }, { posts: [...] }],
 *   'flat'
 * );
 * // Result: { users: [...], posts: [...] }
 * ```
 */
export declare const mergeApiResponses: (responses: any[], mergeStrategy: string) => any;
/**
 * Creates a batch request handler for processing multiple operations.
 *
 * @param {Function} singleHandler - Handler for single operation
 * @returns {Function} Batch handler function
 *
 * @example
 * ```typescript
 * const singleHandler = async (data) => processUser(data);
 * const batchHandler = createBatchRequestHandler(singleHandler);
 * const results = await batchHandler([user1, user2, user3]);
 * ```
 */
export declare const createBatchRequestHandler: (singleHandler: (data: any) => Promise<any>) => (items: any[]) => Promise<any[]>;
/**
 * Implements GraphQL-style field selection for REST responses.
 *
 * @param {any} data - Response data
 * @param {string[]} fields - Fields to include
 * @returns {any} Filtered response with selected fields
 *
 * @example
 * ```typescript
 * const filtered = selectResponseFields(
 *   { id: 1, name: 'John', email: 'john@example.com', password: 'secret' },
 *   ['id', 'name', 'email']
 * );
 * // Result: { id: 1, name: 'John', email: 'john@example.com' }
 * ```
 */
export declare const selectResponseFields: (data: any, fields: string[]) => any;
/**
 * Validates API key and retrieves associated permissions.
 *
 * @param {string} apiKey - API key to validate
 * @param {Model} ApiKeyModel - Sequelize ApiKey model
 * @returns {Promise<ApiKeyValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateApiKey('ak_live_abc123', ApiKeyModel);
 * if (result.valid) {
 *   console.log('Scopes:', result.scopes);
 * }
 * ```
 */
export declare const validateApiKey: (apiKey: string, ApiKeyModel: any) => Promise<ApiKeyValidationResult>;
/**
 * Middleware for API key authentication.
 *
 * @param {Model} ApiKeyModel - Sequelize ApiKey model
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use('/api/v1', apiKeyAuthMiddleware(ApiKeyModel));
 * ```
 */
export declare const apiKeyAuthMiddleware: (ApiKeyModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Validates if request has required scopes for the operation.
 *
 * @param {string[]} requiredScopes - Required scopes
 * @param {string[]} userScopes - User's scopes
 * @returns {boolean} Whether user has required scopes
 *
 * @example
 * ```typescript
 * const hasAccess = validateScopes(
 *   ['read:users', 'write:users'],
 *   ['read:users', 'write:users', 'admin']
 * );
 * // Result: true
 * ```
 */
export declare const validateScopes: (requiredScopes: string[], userScopes: string[]) => boolean;
/**
 * Generates secure API key with prefix and random bytes.
 *
 * @param {string} [prefix='ak'] - API key prefix
 * @param {string} [environment='live'] - Environment (live, test)
 * @returns {string} Generated API key
 *
 * @example
 * ```typescript
 * const key = generateApiKey('ak', 'live');
 * // Result: 'ak_live_7h3k2m9p4q8r5s1t6u0v2w3x'
 * ```
 */
export declare const generateApiKey: (prefix?: string, environment?: string) => string;
/**
 * In-memory rate limiter using sliding window algorithm.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * const limiter = createRateLimiter({
 *   windowMs: 60000,
 *   maxRequests: 100,
 *   strategy: 'sliding'
 * });
 * app.use('/api/v1', limiter);
 * ```
 */
export declare const createRateLimiter: (config: RateLimitConfig) => (req: Request, res: Response, next: NextFunction) => any;
/**
 * Token bucket rate limiter for burst traffic handling.
 *
 * @param {number} capacity - Bucket capacity
 * @param {number} refillRate - Tokens per second
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * const limiter = createTokenBucketLimiter(100, 10);
 * app.use('/api/v1/upload', limiter);
 * ```
 */
export declare const createTokenBucketLimiter: (capacity: number, refillRate: number) => (req: Request, res: Response, next: NextFunction) => any;
/**
 * Persists rate limit data to database for distributed systems.
 *
 * @param {string} identifier - Rate limit key
 * @param {string} endpoint - API endpoint
 * @param {Model} RateLimitModel - Sequelize model
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await persistRateLimitLog('apikey:ak_123', '/api/v1/users', RateLimitLogModel);
 * ```
 */
export declare const persistRateLimitLog: (identifier: string, endpoint: string, RateLimitModel: any) => Promise<void>;
/**
 * Retrieves rate limit usage statistics for an identifier.
 *
 * @param {string} identifier - Rate limit key
 * @param {number} windowMs - Time window in milliseconds
 * @param {Model} RateLimitModel - Sequelize model
 * @returns {Promise<{ count: number; remaining: number }>} Usage stats
 *
 * @example
 * ```typescript
 * const stats = await getRateLimitStats('apikey:ak_123', 60000, RateLimitLogModel);
 * // Result: { count: 45, remaining: 55 }
 * ```
 */
export declare const getRateLimitStats: (identifier: string, windowMs: number, RateLimitModel: any) => Promise<{
    count: number;
    remaining: number;
}>;
/**
 * Validates request body against defined rules.
 *
 * @param {any} body - Request body to validate
 * @param {ValidationRule[]} rules - Validation rules
 * @returns {{ valid: boolean; errors: any[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRequestBody(
 *   { email: 'invalid', age: 'not-a-number' },
 *   [
 *     { field: 'email', type: 'email', required: true },
 *     { field: 'age', type: 'number', required: true, min: 0, max: 120 }
 *   ]
 * );
 * ```
 */
export declare const validateRequestBody: (body: any, rules: ValidationRule[]) => {
    valid: boolean;
    errors: any[];
};
/**
 * Sanitizes string input to prevent XSS and injection attacks.
 *
 * @param {string} input - Input string to sanitize
 * @param {SanitizationRules} [rules] - Sanitization rules
 * @returns {string} Sanitized string
 *
 * @example
 * ```typescript
 * const clean = sanitizeInput('<script>alert("xss")</script>Hello', {
 *   removeHTML: true,
 *   trim: true
 * });
 * // Result: 'Hello'
 * ```
 */
export declare const sanitizeInput: (input: string, rules?: SanitizationRules) => string;
/**
 * Sanitizes entire request body recursively.
 *
 * @param {any} body - Request body
 * @param {SanitizationRules} [rules] - Sanitization rules
 * @returns {any} Sanitized body
 *
 * @example
 * ```typescript
 * const clean = sanitizeRequestBody({
 *   name: '  John  ',
 *   bio: '<script>alert("xss")</script>Developer'
 * }, { trim: true, removeHTML: true });
 * // Result: { name: 'John', bio: 'Developer' }
 * ```
 */
export declare const sanitizeRequestBody: (body: any, rules?: SanitizationRules) => any;
/**
 * Middleware for automatic request validation and sanitization.
 *
 * @param {ValidationRule[]} rules - Validation rules
 * @param {SanitizationRules} [sanitizationRules] - Sanitization rules
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.post('/api/v1/users',
 *   requestValidationMiddleware([
 *     { field: 'email', type: 'email', required: true },
 *     { field: 'age', type: 'number', min: 0, max: 120 }
 *   ], { trim: true, removeHTML: true }),
 *   (req, res) => { ... }
 * );
 * ```
 */
export declare const requestValidationMiddleware: (rules: ValidationRule[], sanitizationRules?: SanitizationRules) => (req: Request, res: Response, next: NextFunction) => any;
/**
 * Creates cache key from request parameters.
 *
 * @param {Request} req - Express request
 * @param {string[]} [varyBy] - Fields to vary cache by
 * @returns {string} Cache key
 *
 * @example
 * ```typescript
 * const key = createCacheKey(req, ['userId', 'locale']);
 * // Result: 'GET:/api/v1/users:userId=123:locale=en'
 * ```
 */
export declare const createCacheKey: (req: Request, varyBy?: string[]) => string;
/**
 * Response caching middleware with configurable TTL and strategies.
 *
 * @param {CacheConfig} config - Cache configuration
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.get('/api/v1/users',
 *   responseCacheMiddleware({
 *     ttl: 60000,
 *     strategy: 'public',
 *     varyBy: ['userId'],
 *     tags: ['users']
 *   }),
 *   (req, res) => { ... }
 * );
 * ```
 */
export declare const responseCacheMiddleware: (config: CacheConfig) => (req: Request, res: Response, next: NextFunction) => any;
/**
 * Invalidates cached responses by key or tag.
 *
 * @param {string} keyOrTag - Cache key or tag to invalidate
 * @param {boolean} [isTag=false] - Whether to invalidate by tag
 *
 * @example
 * ```typescript
 * // Invalidate specific cache key
 * invalidateCache('GET:/api/v1/users:userId=123');
 *
 * // Invalidate all caches with 'users' tag
 * invalidateCache('users', true);
 * ```
 */
export declare const invalidateCache: (keyOrTag: string, isTag?: boolean) => void;
/**
 * Generates ETag for response data.
 *
 * @param {any} data - Response data
 * @returns {string} ETag value
 *
 * @example
 * ```typescript
 * const etag = generateETag({ id: 1, name: 'John' });
 * res.setHeader('ETag', etag);
 * ```
 */
export declare const generateETag: (data: any) => string;
/**
 * Generates OpenAPI parameter definition.
 *
 * @param {string} name - Parameter name
 * @param {string} location - Parameter location (query, header, path)
 * @param {string} type - Parameter type
 * @param {boolean} required - Whether required
 * @param {string} [description] - Parameter description
 * @returns {any} OpenAPI parameter object
 *
 * @example
 * ```typescript
 * const param = generateOpenApiParameter('userId', 'path', 'string', true, 'User ID');
 * ```
 */
export declare const generateOpenApiParameter: (name: string, location: string, type: string, required: boolean, description?: string) => any;
/**
 * Generates OpenAPI response definition.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} description - Response description
 * @param {any} [schema] - Response schema
 * @returns {any} OpenAPI response object
 *
 * @example
 * ```typescript
 * const response = generateOpenApiResponse(200, 'Successful response', {
 *   type: 'object',
 *   properties: { id: { type: 'number' }, name: { type: 'string' } }
 * });
 * ```
 */
export declare const generateOpenApiResponse: (statusCode: number, description: string, schema?: any) => any;
/**
 * Generates complete OpenAPI operation object for an endpoint.
 *
 * @param {string} method - HTTP method
 * @param {string} summary - Operation summary
 * @param {any[]} parameters - Operation parameters
 * @param {any} responses - Operation responses
 * @param {string[]} [tags] - Operation tags
 * @returns {any} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const operation = generateOpenApiOperation(
 *   'GET',
 *   'Get user by ID',
 *   [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
 *   { 200: { description: 'Success' } },
 *   ['Users']
 * );
 * ```
 */
export declare const generateOpenApiOperation: (method: string, summary: string, parameters: any[], responses: any, tags?: string[]) => any;
/**
 * Extracts API documentation metadata from route handlers.
 *
 * @param {any} handler - Route handler function
 * @returns {any} Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = extractApiMetadata(userController.getUser);
 * // Result: { summary: 'Get user', description: '...', parameters: [...] }
 * ```
 */
export declare const extractApiMetadata: (handler: any) => any;
/**
 * Performs comprehensive health check of API gateway and dependencies.
 *
 * @param {Record<string, () => Promise<HealthCheckDetail>>} checks - Health check functions
 * @returns {Promise<HealthCheckResult>} Health check result
 *
 * @example
 * ```typescript
 * const result = await performHealthCheck({
 *   database: async () => {
 *     const start = Date.now();
 *     await sequelize.authenticate();
 *     return { status: 'pass', responseTime: Date.now() - start };
 *   },
 *   redis: async () => {
 *     await redis.ping();
 *     return { status: 'pass' };
 *   }
 * });
 * ```
 */
export declare const performHealthCheck: (checks: Record<string, () => Promise<HealthCheckDetail>>) => Promise<HealthCheckResult>;
/**
 * Creates a health check endpoint handler.
 *
 * @param {Record<string, () => Promise<HealthCheckDetail>>} checks - Health check functions
 * @returns {Function} Express handler
 *
 * @example
 * ```typescript
 * app.get('/health', createHealthCheckEndpoint({
 *   database: async () => ({ status: 'pass' }),
 *   cache: async () => ({ status: 'pass' })
 * }));
 * ```
 */
export declare const createHealthCheckEndpoint: (checks: Record<string, () => Promise<HealthCheckDetail>>) => (req: Request, res: Response) => Promise<void>;
/**
 * Gets API gateway runtime status and metrics.
 *
 * @returns {any} Status information
 *
 * @example
 * ```typescript
 * const status = getGatewayStatus();
 * // Result: { uptime: 3600, memory: {...}, cpu: {...}, ... }
 * ```
 */
export declare const getGatewayStatus: () => any;
/**
 * Creates CORS middleware with configuration.
 *
 * @param {CorsConfig} config - CORS configuration
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(createCorsMiddleware({
 *   origins: ['https://app.example.com'],
 *   methods: ['GET', 'POST', 'PUT', 'DELETE'],
 *   allowedHeaders: ['Content-Type', 'Authorization'],
 *   credentials: true,
 *   maxAge: 86400
 * }));
 * ```
 */
export declare const createCorsMiddleware: (config: CorsConfig) => (req: Request, res: Response, next: NextFunction) => any;
/**
 * Applies security headers to responses (HSTS, CSP, X-Frame-Options, etc.).
 *
 * @param {Partial<SecurityHeaders>} [customHeaders] - Custom security headers
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(securityHeadersMiddleware({
 *   'Content-Security-Policy': "default-src 'self'"
 * }));
 * ```
 */
export declare const securityHeadersMiddleware: (customHeaders?: Partial<SecurityHeaders>) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Validates Content-Type header for POST/PUT/PATCH requests.
 *
 * @param {string[]} allowedTypes - Allowed content types
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(validateContentType(['application/json', 'multipart/form-data']));
 * ```
 */
export declare const validateContentType: (allowedTypes: string[]) => (req: Request, res: Response, next: NextFunction) => any;
/**
 * Generates unique trace ID for request tracking.
 *
 * @returns {string} Trace ID
 *
 * @example
 * ```typescript
 * const traceId = generateTraceId();
 * // Result: 'trace_1a2b3c4d5e6f7g8h'
 * ```
 */
export declare const generateTraceId: () => string;
/**
 * Request logging middleware with trace ID.
 *
 * @param {Function} [logger] - Custom logger function
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(requestLoggingMiddleware(console.log));
 * ```
 */
export declare const requestLoggingMiddleware: (logger?: (data: any) => void) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Creates request trace object with metadata.
 *
 * @param {Request} req - Express request
 * @param {Partial<RequestTrace>} metadata - Additional metadata
 * @returns {RequestTrace} Request trace object
 *
 * @example
 * ```typescript
 * const trace = createRequestTrace(req, { userId: '123', operation: 'getUserProfile' });
 * ```
 */
export declare const createRequestTrace: (req: Request, metadata?: Partial<RequestTrace>) => RequestTrace;
/**
 * Formats error into standardized API error response.
 *
 * @param {Error | any} error - Error object
 * @param {Request} [req] - Express request for trace ID
 * @returns {ApiErrorResponse} Formatted error response
 *
 * @example
 * ```typescript
 * try {
 *   throw new Error('User not found');
 * } catch (error) {
 *   const response = formatErrorResponse(error, req);
 *   res.status(response.error.statusCode).json(response);
 * }
 * ```
 */
export declare const formatErrorResponse: (error: Error | any, req?: Request) => ApiErrorResponse;
declare const _default: {
    createApiKeyModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            key: string;
            name: string;
            scopes: string[];
            rateLimit: number;
            rateLimitWindow: number;
            enabled: boolean;
            expiresAt: Date | null;
            lastUsedAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createGatewayRouteModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            path: string;
            method: string;
            version: string;
            targetUrl: string;
            authRequired: boolean;
            rateLimit: Record<string, any> | null;
            cacheConfig: Record<string, any> | null;
            transformConfig: Record<string, any> | null;
            enabled: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createRateLimitLogModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            identifier: string;
            endpoint: string;
            requestCount: number;
            windowStart: Date;
            windowEnd: Date;
            blocked: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    extractApiVersion: (req: Request, defaultVersion?: string) => string;
    createVersionedRoute: (basePath: string, version: string, prefix?: string) => string;
    validateApiVersion: (version: string, supportedVersions: ApiVersion[]) => {
        valid: boolean;
        deprecated: boolean;
        message?: string;
    };
    createVersionRouter: (versionHandlers: Record<string, (req: Request, res: Response, next: NextFunction) => void>, defaultVersion?: string) => (req: Request, res: Response, next: NextFunction) => any;
    transformRequestBody: (body: any, config?: TransformConfig["input"]) => any;
    transformResponseBody: (data: any, config?: TransformConfig["output"]) => any;
    convertResponseFormat: (data: any, format: string) => string;
    contentNegotiationMiddleware: (req: Request, res: Response, next: NextFunction) => void;
    aggregateApiRequests: (request: AggregationRequest) => Promise<AggregationResponse>;
    mergeApiResponses: (responses: any[], mergeStrategy: string) => any;
    createBatchRequestHandler: (singleHandler: (data: any) => Promise<any>) => (items: any[]) => Promise<any[]>;
    selectResponseFields: (data: any, fields: string[]) => any;
    validateApiKey: (apiKey: string, ApiKeyModel: any) => Promise<ApiKeyValidationResult>;
    apiKeyAuthMiddleware: (ApiKeyModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    validateScopes: (requiredScopes: string[], userScopes: string[]) => boolean;
    generateApiKey: (prefix?: string, environment?: string) => string;
    createRateLimiter: (config: RateLimitConfig) => (req: Request, res: Response, next: NextFunction) => any;
    createTokenBucketLimiter: (capacity: number, refillRate: number) => (req: Request, res: Response, next: NextFunction) => any;
    persistRateLimitLog: (identifier: string, endpoint: string, RateLimitModel: any) => Promise<void>;
    getRateLimitStats: (identifier: string, windowMs: number, RateLimitModel: any) => Promise<{
        count: number;
        remaining: number;
    }>;
    validateRequestBody: (body: any, rules: ValidationRule[]) => {
        valid: boolean;
        errors: any[];
    };
    sanitizeInput: (input: string, rules?: SanitizationRules) => string;
    sanitizeRequestBody: (body: any, rules?: SanitizationRules) => any;
    requestValidationMiddleware: (rules: ValidationRule[], sanitizationRules?: SanitizationRules) => (req: Request, res: Response, next: NextFunction) => any;
    createCacheKey: (req: Request, varyBy?: string[]) => string;
    responseCacheMiddleware: (config: CacheConfig) => (req: Request, res: Response, next: NextFunction) => any;
    invalidateCache: (keyOrTag: string, isTag?: boolean) => void;
    generateETag: (data: any) => string;
    generateOpenApiParameter: (name: string, location: string, type: string, required: boolean, description?: string) => any;
    generateOpenApiResponse: (statusCode: number, description: string, schema?: any) => any;
    generateOpenApiOperation: (method: string, summary: string, parameters: any[], responses: any, tags?: string[]) => any;
    extractApiMetadata: (handler: any) => any;
    performHealthCheck: (checks: Record<string, () => Promise<HealthCheckDetail>>) => Promise<HealthCheckResult>;
    createHealthCheckEndpoint: (checks: Record<string, () => Promise<HealthCheckDetail>>) => (req: Request, res: Response) => Promise<void>;
    getGatewayStatus: () => any;
    createCorsMiddleware: (config: CorsConfig) => (req: Request, res: Response, next: NextFunction) => any;
    securityHeadersMiddleware: (customHeaders?: Partial<SecurityHeaders>) => (req: Request, res: Response, next: NextFunction) => void;
    validateContentType: (allowedTypes: string[]) => (req: Request, res: Response, next: NextFunction) => any;
    generateTraceId: () => string;
    requestLoggingMiddleware: (logger?: (data: any) => void) => (req: Request, res: Response, next: NextFunction) => void;
    createRequestTrace: (req: Request, metadata?: Partial<RequestTrace>) => RequestTrace;
    formatErrorResponse: (error: Error | any, req?: Request) => ApiErrorResponse;
};
export default _default;
//# sourceMappingURL=api-gateway-kit.d.ts.map