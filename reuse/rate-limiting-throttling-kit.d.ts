/**
 * LOC: RLTK1234567
 * File: /reuse/rate-limiting-throttling-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API controllers and guards
 *   - Middleware and interceptors
 *   - Gateway services
 *   - NestJS modules
 */
/**
 * File: /reuse/rate-limiting-throttling-kit.ts
 * Locator: WC-UTL-RLTK-001
 * Purpose: Comprehensive Rate Limiting & Throttling Kit - Complete toolkit for NestJS rate limiting
 *
 * Upstream: Independent utility module for rate limiting and throttling
 * Downstream: ../backend/*, API controllers, middleware, gateway services, NestJS modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Redis 4.x, @nestjs/throttler
 * Exports: 45+ utility functions for rate limiting, throttling, quota management, NestJS guards/interceptors
 *
 * LLM Context: Enterprise-grade rate limiting and throttling toolkit for White Cross healthcare platform.
 * Provides token bucket, leaky bucket, sliding window, and fixed window algorithms with Redis-backed
 * distributed state. Includes IP-based, user-based, and API key rate limiting with quota management,
 * burst allowances, custom decorators, guards, interceptors, and HIPAA-compliant monitoring. Supports
 * endpoint-specific limits, bypass mechanisms, rate limit headers (X-RateLimit-*), and comprehensive
 * Sequelize models for persistence and analytics.
 */
import { CanActivate, ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Model, Sequelize } from 'sequelize';
import { Observable } from 'rxjs';
import { Redis } from 'ioredis';
interface RateLimitConfig {
    ttl: number;
    limit: number;
    blockDuration?: number;
    keyPrefix?: string;
    skipIf?: (context: ExecutionContext) => boolean | Promise<boolean>;
}
interface ThrottleConfig {
    ttl: number;
    limit: number;
    ignoreUserAgents?: RegExp[];
    skipIf?: (context: any) => boolean;
    getTracker?: (req: any) => string;
    getTrackerFromContext?: (context: ExecutionContext) => string;
}
interface QuotaConfig {
    daily?: number;
    weekly?: number;
    monthly?: number;
    yearly?: number;
    resetStrategy?: 'fixed' | 'sliding';
    gracePeriod?: number;
}
interface QuotaUsage {
    used: number;
    limit: number;
    remaining: number;
    resetAt: Date;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}
interface BurstConfig {
    maxBurst: number;
    refillRate: number;
    refillInterval: number;
    penaltyMultiplier?: number;
}
interface TokenBucketState {
    tokens: number;
    lastRefill: number;
    capacity: number;
    refillRate: number;
}
interface RateLimitResult {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetAt: Date;
    retryAfter?: number;
    current: number;
}
interface RateLimitHeaders {
    'X-RateLimit-Limit': number;
    'X-RateLimit-Remaining': number;
    'X-RateLimit-Reset': number;
    'X-RateLimit-Reset-After'?: number;
    'Retry-After'?: number;
}
interface BypassConfig {
    ips?: string[];
    userIds?: string[];
    apiKeys?: string[];
    userAgents?: RegExp[];
    customCheck?: (req: any) => boolean | Promise<boolean>;
}
interface EndpointLimit {
    path: string;
    method: string;
    limit: number;
    ttl: number;
    priority?: number;
}
interface RateLimitStorage {
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    increment(key: string, ttl?: number): Promise<number>;
    delete(key: string): Promise<void>;
    getMultiple(keys: string[]): Promise<any[]>;
    deletePattern(pattern: string): Promise<void>;
}
interface QuotaRecord {
    id?: string;
    userId?: string;
    apiKeyId?: string;
    identifier: string;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    used: number;
    limit: number;
    resetAt: Date;
    metadata?: Record<string, any>;
}
export declare const RATE_LIMIT_KEY = "rate-limit";
export declare const THROTTLE_KEY = "throttle";
export declare const QUOTA_KEY = "quota";
export declare const BYPASS_RATE_LIMIT_KEY = "bypass-rate-limit";
/**
 * Sequelize model definition for rate_limit_quotas table.
 * Stores quota usage for users, API keys, and other identifiers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} RateLimitQuota model class
 *
 * @example
 * ```typescript
 * const RateLimitQuota = defineRateLimitQuotaModel(sequelize);
 * const quota = await RateLimitQuota.create({
 *   identifier: 'user:123',
 *   period: 'daily',
 *   used: 450,
 *   limit: 1000,
 *   resetAt: new Date(Date.now() + 86400000)
 * });
 * ```
 */
export declare const defineRateLimitQuotaModel: (sequelize: Sequelize) => any;
/**
 * Sequelize model definition for rate_limit_violations table.
 * Tracks all rate limit violations for monitoring and security.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} RateLimitViolation model class
 *
 * @example
 * ```typescript
 * const RateLimitViolation = defineRateLimitViolationModel(sequelize);
 * const violation = await RateLimitViolation.create({
 *   identifier: '192.168.1.100',
 *   identifierType: 'ip',
 *   endpoint: '/api/patients',
 *   method: 'GET',
 *   limit: 100,
 *   actual: 150
 * });
 * ```
 */
export declare const defineRateLimitViolationModel: (sequelize: Sequelize) => any;
/**
 * Sequelize model definition for throttle_rules table.
 * Stores configured throttle rules for different endpoints and identifiers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ThrottleRuleModel model class
 *
 * @example
 * ```typescript
 * const ThrottleRuleModel = defineThrottleRuleModel(sequelize);
 * const rule = await ThrottleRuleModel.create({
 *   name: 'Premium API Tier',
 *   type: 'apiKey',
 *   limit: 10000,
 *   ttl: 3600,
 *   enabled: true,
 *   priority: 10
 * });
 * ```
 */
export declare const defineThrottleRuleModel: (sequelize: Sequelize) => any;
/**
 * Sequelize model definition for endpoint_limits table.
 * Stores specific rate limits for individual API endpoints.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} EndpointLimit model class
 *
 * @example
 * ```typescript
 * const EndpointLimitModel = defineEndpointLimitModel(sequelize);
 * const limit = await EndpointLimitModel.create({
 *   path: '/api/patients/:id/records',
 *   method: 'GET',
 *   limit: 50,
 *   ttl: 60,
 *   priority: 5
 * });
 * ```
 */
export declare const defineEndpointLimitModel: (sequelize: Sequelize) => any;
/**
 * Rate limit decorator for NestJS endpoints.
 * Applies rate limiting to specific controller methods.
 *
 * @param {number} limit - Maximum requests allowed
 * @param {number} ttl - Time to live in seconds
 * @param {Partial<RateLimitConfig>} [options] - Additional options
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Controller('patients')
 * export class PatientsController {
 *   @Get()
 *   @RateLimit(100, 60, { blockDuration: 300 })
 *   async getPatients() {
 *     // Limited to 100 requests per 60 seconds
 *     // Blocked for 5 minutes if exceeded
 *   }
 * }
 * ```
 */
export declare const RateLimit: (limit: number, ttl: number, options?: Partial<RateLimitConfig>) => MethodDecorator;
/**
 * Throttle decorator for NestJS endpoints.
 * Similar to RateLimit but with additional throttling options.
 *
 * @param {number} limit - Maximum requests allowed
 * @param {number} ttl - Time to live in seconds
 * @param {Partial<ThrottleConfig>} [options] - Additional throttle options
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Post('records')
 * @Throttle(10, 60, {
 *   ignoreUserAgents: [/healthcheck/i],
 *   getTracker: (req) => req.user?.id || req.ip
 * })
 * async createRecord() {
 *   // Custom throttling logic
 * }
 * ```
 */
export declare const Throttle: (limit: number, ttl: number, options?: Partial<ThrottleConfig>) => MethodDecorator;
/**
 * Quota decorator for NestJS endpoints.
 * Enforces quota limits over longer time periods.
 *
 * @param {QuotaConfig} config - Quota configuration
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Get('reports')
 * @Quota({ daily: 100, weekly: 500, monthly: 2000 })
 * async getReports() {
 *   // Enforces daily, weekly, and monthly quotas
 * }
 * ```
 */
export declare const Quota: (config: QuotaConfig) => MethodDecorator;
/**
 * Bypass rate limit decorator for trusted endpoints.
 * Allows specific methods to bypass rate limiting.
 *
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Get('health')
 * @BypassRateLimit()
 * async healthCheck() {
 *   // This endpoint bypasses all rate limiting
 * }
 * ```
 */
export declare const BypassRateLimit: () => MethodDecorator;
/**
 * Creates a Redis-backed rate limit storage adapter.
 * Provides distributed rate limiting across multiple servers.
 *
 * @param {Redis} redis - Redis client instance
 * @param {string} [keyPrefix] - Optional key prefix for namespacing
 * @returns {RateLimitStorage} Storage adapter
 *
 * @example
 * ```typescript
 * const redis = new Redis({ host: 'localhost', port: 6379 });
 * const storage = createRedisRateLimitStorage(redis, 'ratelimit:');
 * await storage.set('user:123', { count: 5 }, 60);
 * ```
 */
export declare const createRedisRateLimitStorage: (redis: Redis, keyPrefix?: string) => RateLimitStorage;
/**
 * Creates an in-memory rate limit storage adapter.
 * Suitable for single-server deployments or testing.
 *
 * @param {number} [cleanupIntervalMs] - Cleanup interval for expired entries
 * @returns {RateLimitStorage} Storage adapter
 *
 * @example
 * ```typescript
 * const storage = createMemoryRateLimitStorage(60000);
 * await storage.set('user:123', { count: 5 }, 60);
 * ```
 */
export declare const createMemoryRateLimitStorage: (cleanupIntervalMs?: number) => RateLimitStorage;
/**
 * Creates a token bucket rate limiter with burst support.
 * Allows bursts of traffic while maintaining average rate.
 *
 * @param {BurstConfig} config - Burst configuration
 * @param {RateLimitStorage} storage - Storage adapter
 * @returns {Object} Token bucket limiter functions
 *
 * @example
 * ```typescript
 * const limiter = createTokenBucketLimiter(
 *   { maxBurst: 50, refillRate: 10, refillInterval: 1000 },
 *   redisStorage
 * );
 * const result = await limiter.consume('user:123', 5);
 * if (!result.allowed) {
 *   throw new Error(`Rate limited. Retry after ${result.retryAfter}s`);
 * }
 * ```
 */
export declare const createTokenBucketLimiter: (config: BurstConfig, storage: RateLimitStorage) => {
    consume: (identifier: string, tokens?: number) => Promise<RateLimitResult>;
    reset: (identifier: string) => Promise<void>;
    getState: (identifier: string) => Promise<TokenBucketState | null>;
};
/**
 * Creates a leaky bucket rate limiter for smooth traffic flow.
 * Requests leak out at constant rate, enforcing steady flow.
 *
 * @param {number} capacity - Bucket capacity
 * @param {number} leakRate - Requests per second leak rate
 * @param {RateLimitStorage} storage - Storage adapter
 * @returns {Object} Leaky bucket limiter functions
 *
 * @example
 * ```typescript
 * const limiter = createLeakyBucketLimiter(100, 10, redisStorage);
 * const result = await limiter.consume('endpoint:/api/patients');
 * ```
 */
export declare const createLeakyBucketLimiter: (capacity: number, leakRate: number, storage: RateLimitStorage) => {
    consume: (identifier: string) => Promise<RateLimitResult>;
    reset: (identifier: string) => Promise<void>;
};
/**
 * Creates a sliding window rate limiter for accurate rate limiting.
 * Provides precise control over request distribution.
 *
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @param {RateLimitStorage} storage - Storage adapter
 * @returns {Object} Sliding window limiter functions
 *
 * @example
 * ```typescript
 * const limiter = createSlidingWindowLimiter(100, 60000, redisStorage);
 * const result = await limiter.consume('user:456');
 * ```
 */
export declare const createSlidingWindowLimiter: (maxRequests: number, windowMs: number, storage: RateLimitStorage) => {
    consume: (identifier: string) => Promise<RateLimitResult>;
    reset: (identifier: string) => Promise<void>;
    getCount: (identifier: string) => Promise<number>;
};
/**
 * Creates a fixed window rate limiter for simple, efficient rate limiting.
 * Windows reset at fixed intervals.
 *
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @param {RateLimitStorage} storage - Storage adapter
 * @returns {Object} Fixed window limiter functions
 *
 * @example
 * ```typescript
 * const limiter = createFixedWindowLimiter(1000, 3600000, redisStorage);
 * const result = await limiter.consume('apikey:abc123');
 * ```
 */
export declare const createFixedWindowLimiter: (maxRequests: number, windowMs: number, storage: RateLimitStorage) => {
    consume: (identifier: string) => Promise<RateLimitResult>;
    reset: (identifier: string) => Promise<void>;
    getCount: (identifier: string) => Promise<number>;
};
/**
 * Creates a quota manager for long-term rate limiting.
 * Manages daily, weekly, monthly, and yearly quotas.
 *
 * @param {QuotaConfig} config - Quota configuration
 * @param {typeof Model} quotaModel - Sequelize quota model
 * @returns {Object} Quota manager functions
 *
 * @example
 * ```typescript
 * const quotaManager = createQuotaManager(
 *   { daily: 1000, weekly: 5000, monthly: 20000 },
 *   RateLimitQuotaModel
 * );
 * const usage = await quotaManager.checkQuota('user:123', 'daily');
 * ```
 */
export declare const createQuotaManager: (config: QuotaConfig, quotaModel: typeof Model) => {
    checkQuota: (identifier: string, period: QuotaRecord["period"]) => Promise<QuotaUsage>;
    consumeQuota: (identifier: string, period: QuotaRecord["period"], amount?: number) => Promise<QuotaUsage>;
    resetQuota: (identifier: string, period: QuotaRecord["period"]) => Promise<void>;
    getAllQuotas: (identifier: string) => Promise<QuotaUsage[]>;
};
/**
 * Generates standard X-RateLimit-* headers from rate limit result.
 * Follows RateLimit Header Fields for HTTP standard.
 *
 * @param {RateLimitResult} result - Rate limit result
 * @returns {RateLimitHeaders} HTTP headers object
 *
 * @example
 * ```typescript
 * const headers = generateRateLimitHeaders(rateLimitResult);
 * Object.entries(headers).forEach(([key, value]) => {
 *   response.setHeader(key, value);
 * });
 * ```
 */
export declare const generateRateLimitHeaders: (result: RateLimitResult) => RateLimitHeaders;
/**
 * Applies rate limit headers to HTTP response.
 *
 * @param {any} response - HTTP response object
 * @param {RateLimitResult} result - Rate limit result
 * @returns {void}
 *
 * @example
 * ```typescript
 * applyRateLimitHeaders(res, rateLimitResult);
 * ```
 */
export declare const applyRateLimitHeaders: (response: any, result: RateLimitResult) => void;
/**
 * Checks if request should bypass rate limiting.
 * Supports IP, user ID, API key, and custom bypass rules.
 *
 * @param {any} request - HTTP request object
 * @param {BypassConfig} config - Bypass configuration
 * @returns {Promise<boolean>} True if should bypass
 *
 * @example
 * ```typescript
 * const shouldBypass = await shouldBypassRateLimit(request, {
 *   ips: ['127.0.0.1', '10.0.0.0/8'],
 *   userIds: ['admin-user-id'],
 *   customCheck: async (req) => req.headers['x-internal-service'] === 'true'
 * });
 * ```
 */
export declare const shouldBypassRateLimit: (request: any, config: BypassConfig) => Promise<boolean>;
/**
 * Extracts client IP from request with proxy support.
 *
 * @param {any} request - HTTP request object
 * @param {boolean} [trustProxy=true] - Whether to trust X-Forwarded-For
 * @returns {string} Client IP address
 *
 * @example
 * ```typescript
 * const clientIp = extractClientIp(request, true);
 * ```
 */
export declare const extractClientIp: (request: any, trustProxy?: boolean) => string;
/**
 * Checks if IP matches pattern (supports CIDR).
 *
 * @param {string} ip - IP address to check
 * @param {string} pattern - IP pattern (exact match or CIDR)
 * @returns {boolean} True if matches
 *
 * @example
 * ```typescript
 * matchesIpPattern('192.168.1.100', '192.168.1.0/24'); // true
 * matchesIpPattern('10.0.0.5', '10.0.0.5'); // true
 * ```
 */
export declare const matchesIpPattern: (ip: string, pattern: string) => boolean;
/**
 * Matches request to endpoint limit configuration.
 * Supports path patterns and HTTP methods.
 *
 * @param {string} path - Request path
 * @param {string} method - HTTP method
 * @param {EndpointLimit[]} limits - Endpoint limit configurations
 * @returns {EndpointLimit | null} Matching limit or null
 *
 * @example
 * ```typescript
 * const limit = matchEndpointLimit('/api/patients/123', 'GET', endpointLimits);
 * if (limit) {
 *   console.log(`Limit: ${limit.limit} requests per ${limit.ttl}s`);
 * }
 * ```
 */
export declare const matchEndpointLimit: (path: string, method: string, limits: EndpointLimit[]) => EndpointLimit | null;
/**
 * NestJS guard for rate limiting.
 * Applies rate limits to controller methods based on decorators.
 *
 * @example
 * ```typescript
 * @Module({
 *   providers: [
 *     {
 *       provide: APP_GUARD,
 *       useClass: RateLimitGuard,
 *     },
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
export declare class RateLimitGuard implements CanActivate {
    private readonly reflector;
    private readonly storage;
    private readonly violationModel?;
    private readonly logger;
    constructor(reflector: Reflector, storage: RateLimitStorage, violationModel?: typeof Model);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getIdentifier;
    private recordViolation;
}
/**
 * NestJS interceptor for throttling with custom logic.
 * Provides more flexible throttling than guards.
 *
 * @example
 * ```typescript
 * @UseInterceptors(ThrottleInterceptor)
 * @Controller('api')
 * export class ApiController {
 *   @Get('resource')
 *   @Throttle(100, 60)
 *   getResource() {
 *     return { data: 'resource' };
 *   }
 * }
 * ```
 */
export declare class ThrottleInterceptor implements NestInterceptor {
    private readonly reflector;
    private readonly storage;
    private readonly logger;
    constructor(reflector: Reflector, storage: RateLimitStorage);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
/**
 * NestJS interceptor for quota management.
 * Enforces quotas over longer time periods.
 *
 * @example
 * ```typescript
 * @UseInterceptors(QuotaInterceptor)
 * @Controller('api')
 * export class ApiController {
 *   @Get('reports')
 *   @Quota({ daily: 100, monthly: 2000 })
 *   getReports() {
 *     return { reports: [] };
 *   }
 * }
 * ```
 */
export declare class QuotaInterceptor implements NestInterceptor {
    private readonly reflector;
    private readonly quotaModel;
    private readonly logger;
    constructor(reflector: Reflector, quotaModel: typeof Model);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
    private getIdentifier;
}
/**
 * Injectable NestJS service for rate limiting operations.
 * Provides programmatic access to rate limiting functionality.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class MyService {
 *   constructor(private rateLimitService: RateLimitService) {}
 *
 *   async performAction(userId: string) {
 *     const canProceed = await this.rateLimitService.checkLimit(
 *       `user:${userId}`,
 *       100,
 *       60
 *     );
 *     if (!canProceed) {
 *       throw new Error('Rate limit exceeded');
 *     }
 *   }
 * }
 * ```
 */
export declare class RateLimitService {
    private readonly storage;
    private readonly quotaModel?;
    private readonly violationModel?;
    private readonly logger;
    constructor(storage: RateLimitStorage, quotaModel?: typeof Model, violationModel?: typeof Model);
    /**
     * Checks rate limit for identifier.
     */
    checkLimit(identifier: string, limit: number, ttl: number, algorithm?: 'fixed' | 'sliding'): Promise<RateLimitResult>;
    /**
     * Checks quota for identifier.
     */
    checkQuota(identifier: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<QuotaUsage>;
    /**
     * Resets rate limit for identifier.
     */
    resetLimit(identifier: string): Promise<void>;
    /**
     * Gets rate limit violations for identifier.
     */
    getViolations(identifier: string, startDate: Date, endDate: Date): Promise<any[]>;
    /**
     * Gets rate limit statistics.
     */
    getStatistics(startDate: Date, endDate: Date): Promise<{
        totalViolations: number;
        violationsByType: Record<string, number>;
        topViolators: Array<{
            identifier: string;
            count: number;
        }>;
    }>;
}
export declare const RateLimitingUtils: {
    createRedisRateLimitStorage: (redis: Redis, keyPrefix?: string) => RateLimitStorage;
    createMemoryRateLimitStorage: (cleanupIntervalMs?: number) => RateLimitStorage;
    createTokenBucketLimiter: (config: BurstConfig, storage: RateLimitStorage) => {
        consume: (identifier: string, tokens?: number) => Promise<RateLimitResult>;
        reset: (identifier: string) => Promise<void>;
        getState: (identifier: string) => Promise<TokenBucketState | null>;
    };
    createLeakyBucketLimiter: (capacity: number, leakRate: number, storage: RateLimitStorage) => {
        consume: (identifier: string) => Promise<RateLimitResult>;
        reset: (identifier: string) => Promise<void>;
    };
    createSlidingWindowLimiter: (maxRequests: number, windowMs: number, storage: RateLimitStorage) => {
        consume: (identifier: string) => Promise<RateLimitResult>;
        reset: (identifier: string) => Promise<void>;
        getCount: (identifier: string) => Promise<number>;
    };
    createFixedWindowLimiter: (maxRequests: number, windowMs: number, storage: RateLimitStorage) => {
        consume: (identifier: string) => Promise<RateLimitResult>;
        reset: (identifier: string) => Promise<void>;
        getCount: (identifier: string) => Promise<number>;
    };
    createQuotaManager: (config: QuotaConfig, quotaModel: typeof Model) => {
        checkQuota: (identifier: string, period: QuotaRecord["period"]) => Promise<QuotaUsage>;
        consumeQuota: (identifier: string, period: QuotaRecord["period"], amount?: number) => Promise<QuotaUsage>;
        resetQuota: (identifier: string, period: QuotaRecord["period"]) => Promise<void>;
        getAllQuotas: (identifier: string) => Promise<QuotaUsage[]>;
    };
    generateRateLimitHeaders: (result: RateLimitResult) => RateLimitHeaders;
    applyRateLimitHeaders: (response: any, result: RateLimitResult) => void;
    shouldBypassRateLimit: (request: any, config: BypassConfig) => Promise<boolean>;
    extractClientIp: (request: any, trustProxy?: boolean) => string;
    matchesIpPattern: (ip: string, pattern: string) => boolean;
    matchEndpointLimit: (path: string, method: string, limits: EndpointLimit[]) => EndpointLimit | null;
    defineRateLimitQuotaModel: (sequelize: Sequelize) => any;
    defineRateLimitViolationModel: (sequelize: Sequelize) => any;
    defineThrottleRuleModel: (sequelize: Sequelize) => any;
    defineEndpointLimitModel: (sequelize: Sequelize) => any;
};
export default RateLimitingUtils;
//# sourceMappingURL=rate-limiting-throttling-kit.d.ts.map