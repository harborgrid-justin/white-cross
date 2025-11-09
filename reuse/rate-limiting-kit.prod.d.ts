/**
 * LOC: RLPRD1234567
 * File: /reuse/rate-limiting-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API controllers and guards
 *   - Middleware and interceptors
 *   - Gateway services
 *   - Rate limiting services
 */
/**
 * File: /reuse/rate-limiting-kit.prod.ts
 * Locator: WC-UTL-RLPRD-001
 * Purpose: Production-Grade Rate Limiting & Throttling Utilities - Complete API protection suite
 *
 * Upstream: Independent utility module for comprehensive rate limiting
 * Downstream: ../backend/*, API controllers, middleware, gateway services, security services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Redis 4.x, Zod 3.x
 * Exports: 50+ production-ready functions for rate limiting, throttling, quota management, DDoS protection
 *
 * LLM Context: Production-grade rate limiting and throttling utilities for White Cross healthcare system.
 * Implements token bucket, leaky bucket, sliding window, and fixed window algorithms with distributed
 * Redis support. Features include per-user/IP/API key limits, burst handling, quota enforcement, DDoS
 * protection, usage analytics, NestJS guards/decorators/interceptors, Sequelize models, Zod validation,
 * and comprehensive Swagger/OpenAPI documentation.
 */
import { CanActivate, ExecutionContext, NestInterceptor, CallHandler, NestMiddleware } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Model, Sequelize, Transaction } from 'sequelize';
import { Redis } from 'ioredis';
import { z } from 'zod';
import { Observable } from 'rxjs';
import { Request, Response, NextFunction } from 'express';
/**
 * Zod schema for rate limit configuration validation.
 *
 * @example
 * ```typescript
 * const config = RateLimitConfigSchema.parse({
 *   maxRequests: 100,
 *   windowMs: 60000,
 *   keyPrefix: 'api_limit'
 * });
 * ```
 */
export declare const RateLimitConfigSchema: any;
/**
 * Zod schema for token bucket configuration validation.
 */
export declare const TokenBucketConfigSchema: any;
/**
 * Zod schema for quota configuration validation.
 */
export declare const QuotaConfigSchema: any;
/**
 * Zod schema for DDoS protection configuration.
 */
export declare const DDoSProtectionConfigSchema: any;
/**
 * Zod schema for API usage tracking.
 */
export declare const ApiUsageSchema: any;
export type RateLimitConfig = z.infer<typeof RateLimitConfigSchema>;
export type TokenBucketConfig = z.infer<typeof TokenBucketConfigSchema>;
export type QuotaConfig = z.infer<typeof QuotaConfigSchema>;
export type DDoSProtectionConfig = z.infer<typeof DDoSProtectionConfigSchema>;
export type ApiUsage = z.infer<typeof ApiUsageSchema>;
export interface LeakyBucketConfig {
    capacity: number;
    leakRate: number;
    queueSize: number;
}
export interface SlidingWindowConfig {
    maxRequests: number;
    windowMs: number;
    segments?: number;
}
export interface FixedWindowConfig {
    maxRequests: number;
    windowMs: number;
}
export interface ConcurrentLimitConfig {
    maxConcurrent: number;
    queueSize: number;
    timeout: number;
}
export interface ThrottleConfig {
    ttl: number;
    limit: number;
    ignoreUserAgents?: RegExp[];
    skipIf?: (context: any) => boolean;
    burst?: number;
}
export interface BackpressureConfig {
    threshold: number;
    maxPressure: number;
    releaseRate: number;
    strategy: 'reject' | 'queue' | 'slow';
}
export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
    retryAfter?: number;
    total: number;
    quota?: QuotaInfo;
}
export interface QuotaInfo {
    used: number;
    limit: number;
    remaining: number;
    resetAt: Date;
    percentage: number;
}
export interface RateLimitHeaders {
    'X-RateLimit-Limit': number;
    'X-RateLimit-Remaining': number;
    'X-RateLimit-Reset': number;
    'X-RateLimit-RetryAfter'?: number;
    'X-Quota-Limit'?: number;
    'X-Quota-Remaining'?: number;
    'X-Quota-Reset'?: number;
}
export interface BypassRule {
    type: 'ip' | 'apiKey' | 'userId' | 'userAgent' | 'endpoint';
    values: string[];
    reason: string;
    enabled: boolean;
    priority?: number;
}
export interface RateLimitViolation {
    id?: number;
    identifier: string;
    identifierType: 'ip' | 'userId' | 'apiKey' | 'sessionId';
    limitType: string;
    requestCount: number;
    limit: number;
    windowMs: number;
    endpoint?: string;
    method?: string;
    userAgent?: string;
    violatedAt: Date;
    metadata?: Record<string, any>;
}
export interface ThrottleRule {
    id?: number;
    name: string;
    type: 'ip' | 'userId' | 'apiKey' | 'endpoint';
    maxRequests: number;
    windowMs: number;
    enabled: boolean;
    priority: number;
    burst?: number;
    metadata?: Record<string, any>;
}
export interface RateLimitEntry {
    id?: number;
    identifier: string;
    identifierType: 'ip' | 'userId' | 'apiKey' | 'sessionId';
    requestCount: number;
    windowStart: Date;
    windowEnd: Date;
    metadata?: Record<string, any>;
}
export interface QuotaEntry {
    id?: number;
    identifier: string;
    identifierType: 'ip' | 'userId' | 'apiKey';
    quotaType: 'requests' | 'bandwidth' | 'operations';
    used: number;
    limit: number;
    period: 'hour' | 'day' | 'week' | 'month' | 'year';
    periodStart: Date;
    periodEnd: Date;
    warningTriggered: boolean;
    metadata?: Record<string, any>;
}
export interface DDoSEvent {
    id?: number;
    identifier: string;
    identifierType: 'ip' | 'userId';
    eventType: 'suspicious' | 'blocked' | 'pattern_detected';
    requestRate: number;
    threshold: number;
    blockUntil?: Date;
    detectedAt: Date;
    metadata?: Record<string, any>;
}
export interface ApiUsageRecord {
    id?: number;
    identifier: string;
    identifierType: 'ip' | 'userId' | 'apiKey' | 'sessionId';
    endpoint: string;
    method: string;
    requestCount: number;
    bandwidthBytes?: number;
    avgResponseTime?: number;
    statusCodes?: Record<string, number>;
    timestamp: Date;
    metadata?: Record<string, any>;
}
export interface DynamicRateLimitAdjustment {
    identifier: string;
    multiplier: number;
    reason: string;
    expiresAt: Date;
}
export interface RateLimitMetrics {
    totalRequests: number;
    allowedRequests: number;
    blockedRequests: number;
    uniqueIdentifiers: number;
    avgRequestsPerIdentifier: number;
    topViolators: Array<{
        identifier: string;
        count: number;
    }>;
    quotaMetrics?: QuotaMetrics;
}
export interface QuotaMetrics {
    totalQuotas: number;
    activeQuotas: number;
    exceededQuotas: number;
    avgUsagePercentage: number;
    topConsumers: Array<{
        identifier: string;
        usage: number;
        limit: number;
    }>;
}
/**
 * DTO class for rate limit response with Swagger documentation.
 */
export declare class RateLimitResponseDto {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
    retryAfter?: number;
    total: number;
}
/**
 * DTO class for quota information with Swagger documentation.
 */
export declare class QuotaInfoDto {
    used: number;
    limit: number;
    remaining: number;
    resetAt: Date;
    percentage: number;
}
/**
 * DTO class for rate limit violation with Swagger documentation.
 */
export declare class RateLimitViolationDto {
    identifier: string;
    identifierType: string;
    limitType: string;
    requestCount: number;
    limit: number;
    windowMs: number;
    violatedAt: Date;
}
/**
 * Defines Sequelize model for rate_limits table with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} RateLimit model class
 *
 * @example
 * ```typescript
 * const RateLimit = defineRateLimitModel(sequelize);
 * const limit = await RateLimit.create({
 *   identifier: '192.168.1.1',
 *   identifierType: 'ip',
 *   requestCount: 45,
 *   windowStart: new Date(),
 *   windowEnd: new Date(Date.now() + 60000)
 * });
 * ```
 */
export declare const defineRateLimitModel: (sequelize: Sequelize) => any;
/**
 * Defines Sequelize model for throttle_rules table with priority-based rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ThrottleRule model class
 */
export declare const defineThrottleRuleModel: (sequelize: Sequelize) => any;
/**
 * Defines Sequelize model for limit_violations table with detailed tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} LimitViolation model class
 */
export declare const defineLimitViolationModel: (sequelize: Sequelize) => any;
/**
 * Defines Sequelize model for quotas table with period-based tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Quota model class
 *
 * @example
 * ```typescript
 * const Quota = defineQuotaModel(sequelize);
 * const quota = await Quota.create({
 *   identifier: 'user:123',
 *   identifierType: 'userId',
 *   quotaType: 'requests',
 *   used: 500,
 *   limit: 1000,
 *   period: 'day',
 *   periodStart: new Date(),
 *   periodEnd: new Date(Date.now() + 86400000)
 * });
 * ```
 */
export declare const defineQuotaModel: (sequelize: Sequelize) => any;
/**
 * Defines Sequelize model for ddos_events table for attack detection.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} DDoSEvent model class
 */
export declare const defineDDoSEventModel: (sequelize: Sequelize) => any;
/**
 * Defines Sequelize model for api_usage table for analytics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ApiUsage model class
 */
export declare const defineApiUsageModel: (sequelize: Sequelize) => any;
/**
 * Creates a production-grade token bucket rate limiter with validation.
 * Tokens refill at a constant rate, allowing controlled bursts.
 *
 * @param {TokenBucketConfig} config - Validated token bucket configuration
 * @param {Redis} redis - Redis client for distributed state
 * @returns {Object} Token bucket rate limiter functions
 * @throws {z.ZodError} If configuration validation fails
 *
 * @example
 * ```typescript
 * const limiter = createTokenBucketLimiter(
 *   { capacity: 100, refillRate: 10, refillInterval: 1000 },
 *   redisClient
 * );
 * const result = await limiter.consume('user:123', 5);
 * if (!result.allowed) {
 *   throw new Error(`Rate limited. Retry after ${result.retryAfter}s`);
 * }
 * ```
 */
export declare const createTokenBucketLimiter: (config: TokenBucketConfig, redis: Redis) => {
    consume: (identifier: string, tokens?: number) => Promise<RateLimitResult>;
    reset: (identifier: string) => Promise<void>;
    getState: (identifier: string) => Promise<{
        tokens: number;
        lastRefill: number;
    }>;
};
/**
 * Creates a sliding window rate limiter using Redis sorted sets.
 * Provides accurate rate limiting with smooth window transitions.
 *
 * @param {SlidingWindowConfig} config - Sliding window configuration
 * @param {Redis} redis - Redis client for distributed state
 * @returns {Object} Sliding window rate limiter functions
 *
 * @example
 * ```typescript
 * const limiter = createSlidingWindowLimiter(
 *   { maxRequests: 100, windowMs: 60000, segments: 10 },
 *   redisClient
 * );
 * const result = await limiter.consume('user:456');
 * ```
 */
export declare const createSlidingWindowLimiter: (config: SlidingWindowConfig, redis: Redis) => {
    consume: (identifier: string) => Promise<RateLimitResult>;
    reset: (identifier: string) => Promise<void>;
    getCount: (identifier: string) => Promise<number>;
};
/**
 * Creates a fixed window rate limiter using Redis counters.
 * Simple, efficient, and suitable for most use cases.
 *
 * @param {FixedWindowConfig} config - Fixed window configuration
 * @param {Redis} redis - Redis client
 * @returns {Object} Fixed window rate limiter functions
 *
 * @example
 * ```typescript
 * const limiter = createFixedWindowLimiter(
 *   { maxRequests: 1000, windowMs: 3600000 },
 *   redisClient
 * );
 * const result = await limiter.consume('ip:192.168.1.1');
 * ```
 */
export declare const createFixedWindowLimiter: (config: FixedWindowConfig, redis: Redis) => {
    consume: (identifier: string) => Promise<RateLimitResult>;
    reset: (identifier: string) => Promise<void>;
    getCount: (identifier: string) => Promise<number>;
};
/**
 * Creates a quota manager for tracking resource usage over periods.
 * Supports hourly, daily, weekly, monthly, and yearly quotas.
 *
 * @param {QuotaConfig} config - Quota configuration
 * @param {typeof Model} quotaModel - Sequelize Quota model
 * @param {Redis} redis - Redis client for caching
 * @returns {Object} Quota manager functions
 *
 * @example
 * ```typescript
 * const quotaManager = createQuotaManager(
 *   { quotaLimit: 10000, quotaPeriod: 'month', quotaType: 'requests' },
 *   QuotaModel,
 *   redisClient
 * );
 * const result = await quotaManager.consume('user:123', 1);
 * ```
 */
export declare const createQuotaManager: (config: QuotaConfig, quotaModel: typeof Model, redis: Redis) => {
    consume: (identifier: string, identifierType: "ip" | "userId" | "apiKey", amount?: number, transaction?: Transaction) => Promise<{
        allowed: boolean;
        quota: QuotaInfo;
    }>;
    getQuota: (identifier: string, identifierType: "ip" | "userId" | "apiKey") => Promise<QuotaInfo | null>;
    resetQuota: (identifier: string, identifierType: "ip" | "userId" | "apiKey") => Promise<void>;
};
/**
 * Creates a DDoS protection system with pattern detection and auto-blocking.
 *
 * @param {DDoSProtectionConfig} config - DDoS protection configuration
 * @param {typeof Model} ddosEventModel - Sequelize DDoSEvent model
 * @param {Redis} redis - Redis client
 * @returns {Object} DDoS protection functions
 *
 * @example
 * ```typescript
 * const ddosProtection = createDDoSProtection(
 *   { maxRequestsPerSecond: 100, suspiciousThreshold: 500, blockDuration: 3600000 },
 *   DDoSEventModel,
 *   redisClient
 * );
 * const result = await ddosProtection.checkRequest('192.168.1.1', 'ip');
 * ```
 */
export declare const createDDoSProtection: (config: DDoSProtectionConfig, ddosEventModel: typeof Model, redis: Redis) => {
    checkRequest: (identifier: string, identifierType: "ip" | "userId") => Promise<{
        allowed: boolean;
        reason?: string;
        blockUntil?: Date;
    }>;
    blockIdentifier: (identifier: string, durationMs?: number, reason?: string) => Promise<void>;
    unblockIdentifier: (identifier: string) => Promise<void>;
    addToWhitelist: (identifier: string, ttl?: number) => Promise<void>;
    removeFromWhitelist: (identifier: string) => Promise<void>;
};
/**
 * Creates an API usage tracker for analytics and monitoring.
 *
 * @param {typeof Model} usageModel - Sequelize ApiUsage model
 * @param {Redis} redis - Redis client for buffering
 * @returns {Object} Usage tracking functions
 *
 * @example
 * ```typescript
 * const usageTracker = createApiUsageTracker(ApiUsageModel, redisClient);
 * await usageTracker.trackRequest({
 *   identifier: 'user:123',
 *   identifierType: 'userId',
 *   endpoint: '/api/v1/patients',
 *   method: 'GET',
 *   statusCode: 200,
 *   responseTime: 45.5
 * });
 * ```
 */
export declare const createApiUsageTracker: (usageModel: typeof Model, redis: Redis) => {
    trackRequest: (usage: ApiUsage) => Promise<void>;
    flushUsageBuffer: () => Promise<number>;
    getUsageStats: (identifier: string, identifierType: string, startDate: Date, endDate: Date) => Promise<any>;
};
/**
 * NestJS guard for rate limiting with comprehensive protection.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class MyRateLimitGuard extends RateLimitGuard {
 *   constructor(
 *     reflector: Reflector,
 *     redis: Redis,
 *     violationModel: typeof Model
 *   ) {
 *     super(reflector, redis, violationModel, {
 *       maxRequests: 100,
 *       windowMs: 60000,
 *       keyPrefix: 'api'
 *     });
 *   }
 * }
 *
 * // In controller:
 * @UseGuards(MyRateLimitGuard)
 * @RateLimit({ maxRequests: 10, windowMs: 60000 })
 * @Get('users')
 * async getUsers() { ... }
 * ```
 */
export declare class RateLimitGuard implements CanActivate {
    private reflector;
    private redis;
    private violationModel;
    private defaultConfig;
    private limiter;
    private logger;
    constructor(reflector: Reflector, redis: Redis, violationModel: typeof Model, defaultConfig: RateLimitConfig);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractIdentifier;
    private recordViolation;
}
/**
 * Quota enforcement guard for NestJS.
 *
 * @example
 * ```typescript
 * @UseGuards(QuotaGuard)
 * @Quota({ quotaLimit: 10000, quotaPeriod: 'month', quotaType: 'requests' })
 * @Post('data')
 * async createData() { ... }
 * ```
 */
export declare class QuotaGuard implements CanActivate {
    private reflector;
    private quotaModel;
    private redis;
    private defaultConfig;
    private quotaManager;
    private logger;
    constructor(reflector: Reflector, quotaModel: typeof Model, redis: Redis, defaultConfig: QuotaConfig);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractIdentifier;
    private extractIdentifierType;
}
/**
 * DDoS protection guard for NestJS.
 *
 * @example
 * ```typescript
 * @UseGuards(DDoSProtectionGuard)
 * @Get('public-endpoint')
 * async publicEndpoint() { ... }
 * ```
 */
export declare class DDoSProtectionGuard implements CanActivate {
    private ddosEventModel;
    private redis;
    private config;
    private ddosProtection;
    private logger;
    constructor(ddosEventModel: typeof Model, redis: Redis, config: DDoSProtectionConfig);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare const RATE_LIMIT_KEY = "rateLimit";
export declare const QUOTA_KEY = "quota";
export declare const BYPASS_RATE_LIMIT_KEY = "bypassRateLimit";
/**
 * Decorator to apply rate limiting to endpoints.
 *
 * @param {Partial<RateLimitConfig>} config - Rate limit configuration
 * @returns {MethodDecorator} Rate limit decorator
 *
 * @example
 * ```typescript
 * @RateLimit({ maxRequests: 10, windowMs: 60000 })
 * @Get('limited')
 * async limitedEndpoint() { ... }
 * ```
 */
export declare const RateLimit: (config: Partial<RateLimitConfig>) => MethodDecorator;
/**
 * Decorator to apply quota limits to endpoints.
 *
 * @param {Partial<QuotaConfig>} config - Quota configuration
 * @returns {MethodDecorator} Quota decorator
 *
 * @example
 * ```typescript
 * @Quota({ quotaLimit: 1000, quotaPeriod: 'day', quotaType: 'requests' })
 * @Post('resource')
 * async createResource() { ... }
 * ```
 */
export declare const Quota: (config: Partial<QuotaConfig>) => MethodDecorator;
/**
 * Decorator to bypass rate limiting for specific endpoints.
 *
 * @returns {MethodDecorator} Bypass decorator
 *
 * @example
 * ```typescript
 * @BypassRateLimit()
 * @Get('health')
 * healthCheck() { ... }
 * ```
 */
export declare const BypassRateLimit: () => MethodDecorator;
/**
 * Interceptor for tracking API usage and applying rate limit headers.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class MyUsageInterceptor extends ApiUsageInterceptor {
 *   constructor(usageModel: typeof Model, redis: Redis) {
 *     super(usageModel, redis);
 *   }
 * }
 *
 * // Apply globally or to specific controllers
 * @UseInterceptors(MyUsageInterceptor)
 * ```
 */
export declare class ApiUsageInterceptor implements NestInterceptor {
    private usageModel;
    private redis;
    private usageTracker;
    private logger;
    constructor(usageModel: typeof Model, redis: Redis);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private extractIdentifier;
    private extractIdentifierType;
}
/**
 * Middleware for rate limiting at the application level.
 *
 * @example
 * ```typescript
 * export class AppModule implements NestModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer
 *       .apply(RateLimitMiddleware)
 *       .forRoutes('*');
 *   }
 * }
 * ```
 */
export declare class RateLimitMiddleware implements NestMiddleware {
    private redis;
    private config;
    private limiter;
    private logger;
    constructor(redis: Redis, config: RateLimitConfig);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
/**
 * Extracts client IP address from request, respecting proxy headers.
 *
 * @param {any} request - Request object
 * @param {boolean} trustProxy - Whether to trust X-Forwarded-For header
 * @returns {string} Client IP address
 *
 * @example
 * ```typescript
 * const ip = extractClientIp(request, true);
 * ```
 */
export declare const extractClientIp: (request: any, trustProxy?: boolean) => string;
/**
 * Extracts API key from request headers or query parameters.
 *
 * @param {any} request - Request object
 * @param {string} headerName - Header name for API key
 * @param {string} queryParam - Query parameter name for API key
 * @returns {string | null} API key or null
 *
 * @example
 * ```typescript
 * const apiKey = extractApiKey(request, 'x-api-key', 'apiKey');
 * ```
 */
export declare const extractApiKey: (request: any, headerName?: string, queryParam?: string) => string | null;
/**
 * Generates standard X-RateLimit-* headers from rate limit result.
 *
 * @param {RateLimitResult} result - Rate limit result
 * @returns {RateLimitHeaders} Rate limit headers object
 *
 * @example
 * ```typescript
 * const headers = generateRateLimitHeaders(result);
 * ```
 */
export declare const generateRateLimitHeaders: (result: RateLimitResult) => RateLimitHeaders;
/**
 * Applies rate limit headers to response object.
 *
 * @param {any} response - Response object
 * @param {RateLimitResult} result - Rate limit result
 *
 * @example
 * ```typescript
 * applyRateLimitHeaders(res, result);
 * ```
 */
export declare const applyRateLimitHeaders: (response: any, result: RateLimitResult) => void;
/**
 * Records rate limit violation in database.
 *
 * @param {typeof Model} violationModel - Sequelize LimitViolation model
 * @param {RateLimitViolation} violation - Violation data
 * @returns {Promise<any>} Created violation record
 *
 * @example
 * ```typescript
 * await recordRateLimitViolation(LimitViolation, {
 *   identifier: '192.168.1.1',
 *   identifierType: 'ip',
 *   limitType: 'sliding_window',
 *   requestCount: 150,
 *   limit: 100,
 *   windowMs: 60000,
 *   violatedAt: new Date()
 * });
 * ```
 */
export declare const recordRateLimitViolation: (violationModel: typeof Model, violation: RateLimitViolation) => Promise<any>;
/**
 * Cleans up expired rate limit entries from database.
 *
 * @param {typeof Model} rateLimitModel - Sequelize RateLimit model
 * @param {Date} expiryDate - Delete entries older than this date
 * @returns {Promise<number>} Number of deleted entries
 *
 * @example
 * ```typescript
 * const deleted = await cleanupExpiredRateLimits(
 *   RateLimit,
 *   new Date(Date.now() - 86400000)
 * );
 * ```
 */
export declare const cleanupExpiredRateLimits: (rateLimitModel: typeof Model, expiryDate: Date) => Promise<number>;
/**
 * Cleans up expired quota entries from database.
 *
 * @param {typeof Model} quotaModel - Sequelize Quota model
 * @param {Date} expiryDate - Delete entries older than this date
 * @returns {Promise<number>} Number of deleted entries
 */
export declare const cleanupExpiredQuotas: (quotaModel: typeof Model, expiryDate: Date) => Promise<number>;
export declare const RateLimitingKit: {
    RateLimitConfigSchema: any;
    TokenBucketConfigSchema: any;
    QuotaConfigSchema: any;
    DDoSProtectionConfigSchema: any;
    ApiUsageSchema: any;
    defineRateLimitModel: (sequelize: Sequelize) => any;
    defineThrottleRuleModel: (sequelize: Sequelize) => any;
    defineLimitViolationModel: (sequelize: Sequelize) => any;
    defineQuotaModel: (sequelize: Sequelize) => any;
    defineDDoSEventModel: (sequelize: Sequelize) => any;
    defineApiUsageModel: (sequelize: Sequelize) => any;
    createTokenBucketLimiter: (config: TokenBucketConfig, redis: Redis) => {
        consume: (identifier: string, tokens?: number) => Promise<RateLimitResult>;
        reset: (identifier: string) => Promise<void>;
        getState: (identifier: string) => Promise<{
            tokens: number;
            lastRefill: number;
        }>;
    };
    createSlidingWindowLimiter: (config: SlidingWindowConfig, redis: Redis) => {
        consume: (identifier: string) => Promise<RateLimitResult>;
        reset: (identifier: string) => Promise<void>;
        getCount: (identifier: string) => Promise<number>;
    };
    createFixedWindowLimiter: (config: FixedWindowConfig, redis: Redis) => {
        consume: (identifier: string) => Promise<RateLimitResult>;
        reset: (identifier: string) => Promise<void>;
        getCount: (identifier: string) => Promise<number>;
    };
    createQuotaManager: (config: QuotaConfig, quotaModel: typeof Model, redis: Redis) => {
        consume: (identifier: string, identifierType: "ip" | "userId" | "apiKey", amount?: number, transaction?: Transaction) => Promise<{
            allowed: boolean;
            quota: QuotaInfo;
        }>;
        getQuota: (identifier: string, identifierType: "ip" | "userId" | "apiKey") => Promise<QuotaInfo | null>;
        resetQuota: (identifier: string, identifierType: "ip" | "userId" | "apiKey") => Promise<void>;
    };
    createDDoSProtection: (config: DDoSProtectionConfig, ddosEventModel: typeof Model, redis: Redis) => {
        checkRequest: (identifier: string, identifierType: "ip" | "userId") => Promise<{
            allowed: boolean;
            reason?: string;
            blockUntil?: Date;
        }>;
        blockIdentifier: (identifier: string, durationMs?: number, reason?: string) => Promise<void>;
        unblockIdentifier: (identifier: string) => Promise<void>;
        addToWhitelist: (identifier: string, ttl?: number) => Promise<void>;
        removeFromWhitelist: (identifier: string) => Promise<void>;
    };
    createApiUsageTracker: (usageModel: typeof Model, redis: Redis) => {
        trackRequest: (usage: ApiUsage) => Promise<void>;
        flushUsageBuffer: () => Promise<number>;
        getUsageStats: (identifier: string, identifierType: string, startDate: Date, endDate: Date) => Promise<any>;
    };
    RateLimitGuard: typeof RateLimitGuard;
    QuotaGuard: typeof QuotaGuard;
    DDoSProtectionGuard: typeof DDoSProtectionGuard;
    RateLimit: (config: Partial<RateLimitConfig>) => MethodDecorator;
    Quota: (config: Partial<QuotaConfig>) => MethodDecorator;
    BypassRateLimit: () => MethodDecorator;
    ApiUsageInterceptor: typeof ApiUsageInterceptor;
    RateLimitMiddleware: typeof RateLimitMiddleware;
    extractClientIp: (request: any, trustProxy?: boolean) => string;
    extractApiKey: (request: any, headerName?: string, queryParam?: string) => string | null;
    generateRateLimitHeaders: (result: RateLimitResult) => RateLimitHeaders;
    applyRateLimitHeaders: (response: any, result: RateLimitResult) => void;
    recordRateLimitViolation: (violationModel: typeof Model, violation: RateLimitViolation) => Promise<any>;
    cleanupExpiredRateLimits: (rateLimitModel: typeof Model, expiryDate: Date) => Promise<number>;
    cleanupExpiredQuotas: (quotaModel: typeof Model, expiryDate: Date) => Promise<number>;
};
export default RateLimitingKit;
//# sourceMappingURL=rate-limiting-kit.prod.d.ts.map