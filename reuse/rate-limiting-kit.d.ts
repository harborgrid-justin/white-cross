/**
 * LOC: RATE_LIMIT_001
 * File: /reuse/rate-limiting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/core
 *   - @nestjs/swagger
 *   - express
 *   - rxjs
 *   - zod
 *   - redis
 *
 * DOWNSTREAM (imported by):
 *   - API controllers
 *   - Authentication middleware
 *   - Public API endpoints
 *   - WebSocket gateways
 *   - GraphQL resolvers
 *   - Background job processors
 */
import { CanActivate, ExecutionContext, HttpException, NestInterceptor, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
/**
 * Rate limiting algorithm types
 */
export declare enum RateLimitAlgorithm {
    TOKEN_BUCKET = "token_bucket",
    LEAKY_BUCKET = "leaky_bucket",
    FIXED_WINDOW = "fixed_window",
    SLIDING_WINDOW = "sliding_window",
    SLIDING_LOG = "sliding_log",
    CONCURRENT = "concurrent"
}
/**
 * Rate limit scope types
 */
export declare enum RateLimitScope {
    GLOBAL = "global",
    PER_IP = "per_ip",
    PER_USER = "per_user",
    PER_ENDPOINT = "per_endpoint",
    PER_API_KEY = "per_api_key",
    PER_TENANT = "per_tenant",
    CUSTOM = "custom"
}
/**
 * Rate limit action when exceeded
 */
export declare enum RateLimitAction {
    REJECT = "reject",// Return 429 error
    DELAY = "delay",// Queue and delay request
    THROTTLE = "throttle",// Slow down response
    LOG = "log"
}
/**
 * Rate limit storage backend
 */
export declare enum RateLimitStorage {
    REDIS = "redis",
    MEMORY = "memory",
    DATABASE = "database",
    HYBRID = "hybrid"
}
/**
 * Quota period types
 */
export declare enum QuotaPeriod {
    SECOND = "second",
    MINUTE = "minute",
    HOUR = "hour",
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year"
}
/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
    algorithm: RateLimitAlgorithm;
    scope: RateLimitScope;
    limit: number;
    window: number;
    burst?: number;
    cost?: number;
    action: RateLimitAction;
    storage: RateLimitStorage;
    keyPrefix?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    enableHeaders?: boolean;
    message?: string;
    statusCode?: number;
}
/**
 * Token bucket state
 */
export interface TokenBucketState {
    tokens: number;
    capacity: number;
    refillRate: number;
    lastRefill: number;
}
/**
 * Leaky bucket state
 */
export interface LeakyBucketState {
    queue: number;
    capacity: number;
    leakRate: number;
    lastLeak: number;
}
/**
 * Rate limit result
 */
export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    limit: number;
    resetAt: Date;
    retryAfter?: number;
    cost?: number;
}
/**
 * Rate limit headers
 */
export interface RateLimitHeaders {
    'X-RateLimit-Limit': string;
    'X-RateLimit-Remaining': string;
    'X-RateLimit-Reset': string;
    'X-RateLimit-RetryAfter'?: string;
    'X-RateLimit-Policy'?: string;
}
/**
 * Rate limit key generator function
 */
export type RateLimitKeyGenerator = (req: Request) => string | Promise<string>;
/**
 * Rate limit key
 */
export interface RateLimitKey {
    identifier: string;
    scope: RateLimitScope;
    endpoint?: string;
    metadata?: Record<string, any>;
}
/**
 * API quota configuration
 */
export interface APIQuota {
    id: string;
    userId?: string;
    apiKeyId?: string;
    tenantId?: string;
    limit: number;
    period: QuotaPeriod;
    cost?: number;
    burst?: number;
    resetOn?: Date;
    consumed: number;
    lastRequest?: Date;
}
/**
 * Cost-based rate limit configuration
 */
export interface CostBasedRateLimit {
    maxCost: number;
    window: number;
    costs: {
        [endpoint: string]: number;
    };
    defaultCost: number;
}
/**
 * Concurrent request limit configuration
 */
export interface ConcurrentLimitConfig {
    maxConcurrent: number;
    queueSize?: number;
    queueTimeout?: number;
    scope: RateLimitScope;
}
/**
 * Rate limit whitelist/blacklist entry
 */
export interface RateLimitListEntry {
    id: string;
    type: 'whitelist' | 'blacklist';
    identifier: string;
    scope: RateLimitScope;
    reason?: string;
    expiresAt?: Date;
    createdAt: Date;
    createdBy?: string;
}
/**
 * Rate limit monitoring data
 */
export interface RateLimitMetrics {
    key: string;
    scope: RateLimitScope;
    totalRequests: number;
    allowedRequests: number;
    blockedRequests: number;
    averageConsumption: number;
    peakConsumption: number;
    lastRequest: Date;
    periodStart: Date;
    periodEnd: Date;
}
/**
 * Dynamic rate limit adjustment
 */
export interface DynamicRateLimitConfig {
    baseLimit: number;
    minLimit: number;
    maxLimit: number;
    adjustmentFactor: number;
    evaluationWindow: number;
    triggers: {
        increaseOn?: {
            successRate?: number;
            avgResponseTime?: number;
        };
        decreaseOn?: {
            errorRate?: number;
            avgResponseTime?: number;
        };
    };
}
/**
 * Rate limit exceeded error
 */
export declare class RateLimitExceededError extends HttpException {
    readonly result: RateLimitResult;
    constructor(result: RateLimitResult, message?: string);
}
/**
 * Rate limit configuration schema
 */
export declare const RateLimitConfigSchema: any;
/**
 * API quota schema
 */
export declare const APIQuotaSchema: any;
/**
 * Whitelist/blacklist entry schema
 */
export declare const RateLimitListEntrySchema: any;
/**
 * Create new token bucket state
 *
 * @param capacity - Maximum number of tokens
 * @param refillRate - Tokens per second
 * @returns Initial token bucket state
 *
 * @example
 * ```typescript
 * const bucket = createTokenBucket(100, 10); // 100 tokens, refill 10/sec
 * ```
 */
export declare function createTokenBucket(capacity: number, refillRate: number): TokenBucketState;
/**
 * Refill tokens in bucket based on elapsed time
 *
 * @param bucket - Current bucket state
 * @returns Updated bucket state
 *
 * @example
 * ```typescript
 * const updated = refillTokenBucket(bucket);
 * console.log(`Tokens available: ${updated.tokens}`);
 * ```
 */
export declare function refillTokenBucket(bucket: TokenBucketState): TokenBucketState;
/**
 * Consume tokens from bucket
 *
 * @param bucket - Current bucket state
 * @param cost - Number of tokens to consume
 * @returns Result with updated bucket and success status
 *
 * @example
 * ```typescript
 * const result = consumeTokens(bucket, 5);
 * if (result.allowed) {
 *   bucket = result.bucket;
 *   // Process request
 * }
 * ```
 */
export declare function consumeTokens(bucket: TokenBucketState, cost?: number): {
    allowed: boolean;
    bucket: TokenBucketState;
    remaining: number;
};
/**
 * Check token bucket with rate limiting
 *
 * @param key - Rate limit key
 * @param config - Rate limit configuration
 * @param storage - Storage backend (Redis or in-memory)
 * @returns Rate limit result
 *
 * @example
 * ```typescript
 * const result = await checkTokenBucket('user:123', config, redisClient);
 * if (!result.allowed) {
 *   throw new RateLimitExceededError(result);
 * }
 * ```
 */
export declare function checkTokenBucket(key: string, config: RateLimitConfig, storage: any): Promise<RateLimitResult>;
/**
 * Token bucket with burst allowance
 *
 * @param key - Rate limit key
 * @param config - Rate limit configuration with burst
 * @param storage - Storage backend
 * @returns Rate limit result
 *
 * @example
 * ```typescript
 * const config = {
 *   limit: 100,
 *   burst: 20, // Allow 20 extra requests in burst
 *   window: 60000, // 1 minute
 * };
 * const result = await tokenBucketWithBurst('user:123', config, redisClient);
 * ```
 */
export declare function tokenBucketWithBurst(key: string, config: RateLimitConfig, storage: any): Promise<RateLimitResult>;
/**
 * Create new leaky bucket state
 *
 * @param capacity - Maximum queue size
 * @param leakRate - Requests per second
 * @returns Initial leaky bucket state
 *
 * @example
 * ```typescript
 * const bucket = createLeakyBucket(100, 10); // 100 capacity, leak 10/sec
 * ```
 */
export declare function createLeakyBucket(capacity: number, leakRate: number): LeakyBucketState;
/**
 * Leak requests from bucket
 *
 * @param bucket - Current bucket state
 * @returns Updated bucket state
 *
 * @example
 * ```typescript
 * const updated = leakBucket(bucket);
 * console.log(`Queue size: ${updated.queue}`);
 * ```
 */
export declare function leakBucket(bucket: LeakyBucketState): LeakyBucketState;
/**
 * Add request to leaky bucket
 *
 * @param bucket - Current bucket state
 * @param cost - Cost of request
 * @returns Result with updated bucket and success status
 *
 * @example
 * ```typescript
 * const result = addToLeakyBucket(bucket, 1);
 * if (result.allowed) {
 *   bucket = result.bucket;
 *   // Process request
 * }
 * ```
 */
export declare function addToLeakyBucket(bucket: LeakyBucketState, cost?: number): {
    allowed: boolean;
    bucket: LeakyBucketState;
    queueSize: number;
};
/**
 * Check leaky bucket with rate limiting
 *
 * @param key - Rate limit key
 * @param config - Rate limit configuration
 * @param storage - Storage backend
 * @returns Rate limit result
 *
 * @example
 * ```typescript
 * const result = await checkLeakyBucket('user:123', config, redisClient);
 * if (!result.allowed) {
 *   throw new RateLimitExceededError(result);
 * }
 * ```
 */
export declare function checkLeakyBucket(key: string, config: RateLimitConfig, storage: any): Promise<RateLimitResult>;
/**
 * Get fixed window key with timestamp
 *
 * @param key - Base rate limit key
 * @param window - Window size in milliseconds
 * @returns Window-specific key
 *
 * @example
 * ```typescript
 * const windowKey = getFixedWindowKey('user:123', 60000); // 1 minute window
 * ```
 */
export declare function getFixedWindowKey(key: string, window: number): string;
/**
 * Check fixed window rate limit
 *
 * @param key - Rate limit key
 * @param config - Rate limit configuration
 * @param storage - Storage backend
 * @returns Rate limit result
 *
 * @example
 * ```typescript
 * const result = await checkFixedWindow('user:123', config, redisClient);
 * if (!result.allowed) {
 *   throw new RateLimitExceededError(result);
 * }
 * ```
 */
export declare function checkFixedWindow(key: string, config: RateLimitConfig, storage: any): Promise<RateLimitResult>;
/**
 * Reset fixed window counter
 *
 * @param key - Rate limit key
 * @param config - Rate limit configuration
 * @param storage - Storage backend
 * @returns Promise resolving when reset
 *
 * @example
 * ```typescript
 * await resetFixedWindow('user:123', config, redisClient);
 * ```
 */
export declare function resetFixedWindow(key: string, config: RateLimitConfig, storage: any): Promise<void>;
/**
 * Check sliding window rate limit using sorted sets
 *
 * @param key - Rate limit key
 * @param config - Rate limit configuration
 * @param storage - Storage backend (must support sorted sets)
 * @returns Rate limit result
 *
 * @example
 * ```typescript
 * const result = await checkSlidingWindow('user:123', config, redisClient);
 * if (!result.allowed) {
 *   throw new RateLimitExceededError(result);
 * }
 * ```
 */
export declare function checkSlidingWindow(key: string, config: RateLimitConfig, storage: any): Promise<RateLimitResult>;
/**
 * Check sliding window counter (hybrid approach)
 *
 * @param key - Rate limit key
 * @param config - Rate limit configuration
 * @param storage - Storage backend
 * @returns Rate limit result
 *
 * @example
 * ```typescript
 * const result = await checkSlidingWindowCounter('user:123', config, redisClient);
 * ```
 */
export declare function checkSlidingWindowCounter(key: string, config: RateLimitConfig, storage: any): Promise<RateLimitResult>;
/**
 * Generate rate limit key from IP address
 *
 * @param req - Express request
 * @param prefix - Optional key prefix
 * @returns Rate limit key
 *
 * @example
 * ```typescript
 * const key = generateIPKey(req, 'api');
 * // Returns: "api:ip:192.168.1.1"
 * ```
 */
export declare function generateIPKey(req: Request, prefix?: string): string;
/**
 * Get client IP address from request
 *
 * @param req - Express request
 * @returns Client IP address
 *
 * @example
 * ```typescript
 * const clientIP = getClientIP(req);
 * console.log(`Request from: ${clientIP}`);
 * ```
 */
export declare function getClientIP(req: Request): string;
/**
 * Check rate limit per IP address
 *
 * @param req - Express request
 * @param config - Rate limit configuration
 * @param storage - Storage backend
 * @returns Rate limit result
 *
 * @example
 * ```typescript
 * const result = await checkIPRateLimit(req, config, redisClient);
 * if (!result.allowed) {
 *   throw new RateLimitExceededError(result);
 * }
 * ```
 */
export declare function checkIPRateLimit(req: Request, config: RateLimitConfig, storage: any): Promise<RateLimitResult>;
/**
 * Generate rate limit key from user ID
 *
 * @param userId - User ID
 * @param prefix - Optional key prefix
 * @returns Rate limit key
 *
 * @example
 * ```typescript
 * const key = generateUserKey('user-123', 'api');
 * // Returns: "api:user:user-123"
 * ```
 */
export declare function generateUserKey(userId: string, prefix?: string): string;
/**
 * Check rate limit per user
 *
 * @param userId - User ID
 * @param config - Rate limit configuration
 * @param storage - Storage backend
 * @returns Rate limit result
 *
 * @example
 * ```typescript
 * const result = await checkUserRateLimit(user.id, config, redisClient);
 * if (!result.allowed) {
 *   throw new RateLimitExceededError(result);
 * }
 * ```
 */
export declare function checkUserRateLimit(userId: string, config: RateLimitConfig, storage: any): Promise<RateLimitResult>;
/**
 * Generate rate limit key from endpoint
 *
 * @param endpoint - Endpoint path
 * @param identifier - User ID or IP
 * @param prefix - Optional key prefix
 * @returns Rate limit key
 *
 * @example
 * ```typescript
 * const key = generateEndpointKey('/api/patients', 'user-123');
 * // Returns: "rate:endpoint:/api/patients:user-123"
 * ```
 */
export declare function generateEndpointKey(endpoint: string, identifier: string, prefix?: string): string;
/**
 * Check rate limit per endpoint
 *
 * @param endpoint - Endpoint path
 * @param identifier - User ID or IP
 * @param config - Rate limit configuration
 * @param storage - Storage backend
 * @returns Rate limit result
 *
 * @example
 * ```typescript
 * const result = await checkEndpointRateLimit(
 *   req.path,
 *   user.id,
 *   config,
 *   redisClient
 * );
 * ```
 */
export declare function checkEndpointRateLimit(endpoint: string, identifier: string, config: RateLimitConfig, storage: any): Promise<RateLimitResult>;
/**
 * Calculate request cost based on endpoint
 *
 * @param endpoint - Endpoint path
 * @param method - HTTP method
 * @param costConfig - Cost configuration
 * @returns Cost value
 *
 * @example
 * ```typescript
 * const cost = calculateRequestCost('/api/reports/generate', 'POST', costConfig);
 * // Returns: 10 (expensive operation)
 * ```
 */
export declare function calculateRequestCost(endpoint: string, method: string, costConfig: CostBasedRateLimit): number;
/**
 * Check cost-based rate limit
 *
 * @param key - Rate limit key
 * @param cost - Request cost
 * @param config - Cost-based rate limit configuration
 * @param storage - Storage backend
 * @returns Rate limit result
 *
 * @example
 * ```typescript
 * const cost = calculateRequestCost(req.path, req.method, costConfig);
 * const result = await checkCostBasedRateLimit('user:123', cost, config, redisClient);
 * ```
 */
export declare function checkCostBasedRateLimit(key: string, cost: number, config: CostBasedRateLimit, storage: any): Promise<RateLimitResult>;
/**
 * Acquire concurrent request slot
 *
 * @param key - Rate limit key
 * @param config - Concurrent limit configuration
 * @param storage - Storage backend
 * @returns Result with request ID and allowed status
 *
 * @example
 * ```typescript
 * const result = await acquireConcurrentSlot('user:123', config, redisClient);
 * if (result.allowed) {
 *   try {
 *     // Process request
 *   } finally {
 *     await releaseConcurrentSlot('user:123', result.requestId, redisClient);
 *   }
 * }
 * ```
 */
export declare function acquireConcurrentSlot(key: string, config: ConcurrentLimitConfig, storage: any): Promise<{
    allowed: boolean;
    requestId?: string;
    queuePosition?: number;
}>;
/**
 * Release concurrent request slot
 *
 * @param key - Rate limit key
 * @param requestId - Request ID from acquire
 * @param storage - Storage backend
 * @returns Promise resolving when released
 *
 * @example
 * ```typescript
 * await releaseConcurrentSlot('user:123', requestId, redisClient);
 * ```
 */
export declare function releaseConcurrentSlot(key: string, requestId: string, storage: any): Promise<void>;
/**
 * Get concurrent request count
 *
 * @param key - Rate limit key
 * @param storage - Storage backend
 * @returns Current concurrent request count
 *
 * @example
 * ```typescript
 * const count = await getConcurrentCount('user:123', redisClient);
 * console.log(`${count} concurrent requests`);
 * ```
 */
export declare function getConcurrentCount(key: string, storage: any): Promise<number>;
/**
 * Get quota period in milliseconds
 *
 * @param period - Quota period enum
 * @returns Milliseconds
 *
 * @example
 * ```typescript
 * const ms = getQuotaPeriodMilliseconds(QuotaPeriod.DAY);
 * // Returns: 86400000
 * ```
 */
export declare function getQuotaPeriodMilliseconds(period: QuotaPeriod): number;
/**
 * Calculate next quota reset time
 *
 * @param period - Quota period
 * @param referenceDate - Reference date (defaults to now)
 * @returns Next reset date
 *
 * @example
 * ```typescript
 * const nextReset = getNextQuotaReset(QuotaPeriod.MONTH);
 * console.log(`Quota resets on: ${nextReset}`);
 * ```
 */
export declare function getNextQuotaReset(period: QuotaPeriod, referenceDate?: Date): Date;
/**
 * Check API quota
 *
 * @param quota - API quota configuration
 * @param cost - Request cost
 * @returns Quota check result
 *
 * @example
 * ```typescript
 * const result = checkAPIQuota(userQuota, 1);
 * if (!result.allowed) {
 *   throw new Error('Quota exceeded');
 * }
 * ```
 */
export declare function checkAPIQuota(quota: APIQuota, cost?: number): {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
};
/**
 * Consume API quota
 *
 * @param quota - API quota configuration
 * @param cost - Request cost
 * @returns Updated quota
 *
 * @example
 * ```typescript
 * const updated = consumeAPIQuota(userQuota, 1);
 * await saveQuota(updated);
 * ```
 */
export declare function consumeAPIQuota(quota: APIQuota, cost?: number): APIQuota;
/**
 * Reset API quota
 *
 * @param quota - API quota configuration
 * @returns Reset quota
 *
 * @example
 * ```typescript
 * const reset = resetAPIQuota(userQuota);
 * await saveQuota(reset);
 * ```
 */
export declare function resetAPIQuota(quota: APIQuota): APIQuota;
/**
 * Generate rate limit headers
 *
 * @param result - Rate limit result
 * @param config - Rate limit configuration
 * @returns Rate limit headers object
 *
 * @example
 * ```typescript
 * const headers = generateRateLimitHeaders(result, config);
 * res.set(headers);
 * ```
 */
export declare function generateRateLimitHeaders(result: RateLimitResult, config?: RateLimitConfig): RateLimitHeaders;
/**
 * Set rate limit headers on response
 *
 * @param res - Express response
 * @param result - Rate limit result
 * @param config - Rate limit configuration
 * @returns Express response
 *
 * @example
 * ```typescript
 * setRateLimitHeaders(res, result, config);
 * ```
 */
export declare function setRateLimitHeaders(res: Response, result: RateLimitResult, config?: RateLimitConfig): Response;
/**
 * Check if identifier is whitelisted
 *
 * @param identifier - IP, user ID, API key, etc.
 * @param scope - Rate limit scope
 * @param storage - Storage backend
 * @returns True if whitelisted
 *
 * @example
 * ```typescript
 * if (await isWhitelisted(clientIP, RateLimitScope.PER_IP, redisClient)) {
 *   // Skip rate limiting
 *   return next();
 * }
 * ```
 */
export declare function isWhitelisted(identifier: string, scope: RateLimitScope, storage: any): Promise<boolean>;
/**
 * Check if identifier is blacklisted
 *
 * @param identifier - IP, user ID, API key, etc.
 * @param scope - Rate limit scope
 * @param storage - Storage backend
 * @returns True if blacklisted
 *
 * @example
 * ```typescript
 * if (await isBlacklisted(clientIP, RateLimitScope.PER_IP, redisClient)) {
 *   throw new ForbiddenException('Access denied');
 * }
 * ```
 */
export declare function isBlacklisted(identifier: string, scope: RateLimitScope, storage: any): Promise<boolean>;
/**
 * Add identifier to whitelist
 *
 * @param entry - Whitelist entry
 * @param storage - Storage backend
 * @returns Promise resolving when added
 *
 * @example
 * ```typescript
 * await addToWhitelist({
 *   identifier: '192.168.1.1',
 *   scope: RateLimitScope.PER_IP,
 *   reason: 'Internal network',
 * }, redisClient);
 * ```
 */
export declare function addToWhitelist(entry: Omit<RateLimitListEntry, 'id' | 'createdAt' | 'type'>, storage: any): Promise<void>;
/**
 * Add identifier to blacklist
 *
 * @param entry - Blacklist entry
 * @param storage - Storage backend
 * @returns Promise resolving when added
 *
 * @example
 * ```typescript
 * await addToBlacklist({
 *   identifier: '10.0.0.1',
 *   scope: RateLimitScope.PER_IP,
 *   reason: 'Suspicious activity',
 *   expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
 * }, redisClient);
 * ```
 */
export declare function addToBlacklist(entry: Omit<RateLimitListEntry, 'id' | 'createdAt' | 'type'>, storage: any): Promise<void>;
/**
 * Remove identifier from whitelist
 *
 * @param identifier - Identifier to remove
 * @param scope - Rate limit scope
 * @param storage - Storage backend
 * @returns Promise resolving when removed
 *
 * @example
 * ```typescript
 * await removeFromWhitelist('192.168.1.1', RateLimitScope.PER_IP, redisClient);
 * ```
 */
export declare function removeFromWhitelist(identifier: string, scope: RateLimitScope, storage: any): Promise<void>;
/**
 * Remove identifier from blacklist
 *
 * @param identifier - Identifier to remove
 * @param scope - Rate limit scope
 * @param storage - Storage backend
 * @returns Promise resolving when removed
 *
 * @example
 * ```typescript
 * await removeFromBlacklist('10.0.0.1', RateLimitScope.PER_IP, redisClient);
 * ```
 */
export declare function removeFromBlacklist(identifier: string, scope: RateLimitScope, storage: any): Promise<void>;
/**
 * Record rate limit metrics
 *
 * @param key - Rate limit key
 * @param result - Rate limit result
 * @param storage - Storage backend
 * @returns Promise resolving when recorded
 *
 * @example
 * ```typescript
 * await recordRateLimitMetrics('user:123', result, redisClient);
 * ```
 */
export declare function recordRateLimitMetrics(key: string, result: RateLimitResult, storage: any): Promise<void>;
/**
 * Get rate limit metrics
 *
 * @param key - Rate limit key
 * @param storage - Storage backend
 * @returns Rate limit metrics
 *
 * @example
 * ```typescript
 * const metrics = await getRateLimitMetrics('user:123', redisClient);
 * console.log(`Block rate: ${metrics.blockedRequests / metrics.totalRequests * 100}%`);
 * ```
 */
export declare function getRateLimitMetrics(key: string, storage: any): Promise<Partial<RateLimitMetrics>>;
/**
 * Adjust rate limit based on system performance
 *
 * @param currentLimit - Current rate limit
 * @param config - Dynamic adjustment configuration
 * @param metrics - System performance metrics
 * @returns Adjusted rate limit
 *
 * @example
 * ```typescript
 * const newLimit = adjustRateLimit(currentLimit, dynamicConfig, {
 *   successRate: 0.95,
 *   avgResponseTime: 150,
 *   errorRate: 0.02,
 * });
 * ```
 */
export declare function adjustRateLimit(currentLimit: number, config: DynamicRateLimitConfig, metrics: {
    successRate?: number;
    avgResponseTime?: number;
    errorRate?: number;
}): number;
/**
 * Rate Limit Guard
 * Applies rate limiting to routes
 */
export declare class RateLimitGuard implements CanActivate {
    private readonly reflector;
    private readonly storage?;
    constructor(reflector: Reflector, storage?: any | undefined);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
/**
 * IP Rate Limit Guard
 * Rate limiting based on IP address
 */
export declare class IPRateLimitGuard implements CanActivate {
    private readonly config;
    private readonly storage;
    constructor(config: RateLimitConfig, storage: any);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
/**
 * User Rate Limit Guard
 * Rate limiting based on authenticated user
 */
export declare class UserRateLimitGuard implements CanActivate {
    private readonly config;
    private readonly storage;
    constructor(config: RateLimitConfig, storage: any);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
/**
 * Rate Limit decorator
 * Apply rate limiting to a route
 *
 * @example
 * ```typescript
 * @RateLimit({
 *   algorithm: RateLimitAlgorithm.TOKEN_BUCKET,
 *   scope: RateLimitScope.PER_USER,
 *   limit: 100,
 *   window: 60000, // 1 minute
 * })
 * @Get('data')
 * async getData() {
 *   return this.service.getData();
 * }
 * ```
 */
export declare const RateLimit: (config: RateLimitConfig) => any;
/**
 * Skip Rate Limit decorator
 * Skip rate limiting for a route
 *
 * @example
 * ```typescript
 * @SkipRateLimit()
 * @Get('health')
 * async healthCheck() {
 *   return { status: 'ok' };
 * }
 * ```
 */
export declare const SkipRateLimit: () => any;
/**
 * Rate Limit Key decorator
 * Extract rate limit key from request
 *
 * @example
 * ```typescript
 * @Get('data')
 * async getData(@RateLimitKey() key: string) {
 *   console.log(`Rate limit key: ${key}`);
 *   return this.service.getData();
 * }
 * ```
 */
export declare const RateLimitKey: any;
/**
 * Rate Limit Interceptor
 * Intercepts requests and applies rate limiting
 */
export declare class RateLimitInterceptor implements NestInterceptor {
    private readonly config;
    private readonly storage;
    constructor(config: RateLimitConfig, storage: any);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
/**
 * Concurrent Request Interceptor
 * Limits concurrent requests
 */
export declare class ConcurrentRequestInterceptor implements NestInterceptor {
    private readonly config;
    private readonly storage;
    constructor(config: ConcurrentLimitConfig, storage: any);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
/**
 * Rate limit configuration model for database storage
 */
export interface RateLimitConfigModel {
    id: string;
    name: string;
    algorithm: RateLimitAlgorithm;
    scope: RateLimitScope;
    limit: number;
    window: number;
    burst?: number;
    cost?: number;
    action: RateLimitAction;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * API quota model for database storage
 */
export interface APIQuotaModel {
    id: string;
    userId?: string;
    apiKeyId?: string;
    tenantId?: string;
    limit: number;
    period: QuotaPeriod;
    cost: number;
    burst?: number;
    consumed: number;
    resetOn: Date;
    lastRequest?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Rate limit whitelist/blacklist model
 */
export interface RateLimitListModel {
    id: string;
    type: 'whitelist' | 'blacklist';
    identifier: string;
    scope: RateLimitScope;
    reason?: string;
    expiresAt?: Date;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Rate limit metrics model for analytics
 */
export interface RateLimitMetricsModel {
    id: string;
    key: string;
    scope: RateLimitScope;
    totalRequests: number;
    allowedRequests: number;
    blockedRequests: number;
    averageConsumption: number;
    peakConsumption: number;
    periodStart: Date;
    periodEnd: Date;
    createdAt: Date;
}
/**
 * Default rate limit configuration for API endpoints
 */
export declare const DEFAULT_API_RATE_LIMIT: RateLimitConfig;
/**
 * Default rate limit configuration for public endpoints
 */
export declare const DEFAULT_PUBLIC_RATE_LIMIT: RateLimitConfig;
/**
 * Strict rate limit configuration for sensitive endpoints
 */
export declare const STRICT_RATE_LIMIT: RateLimitConfig;
/**
 * Default concurrent request limit
 */
export declare const DEFAULT_CONCURRENT_LIMIT: ConcurrentLimitConfig;
/**
 * Default cost-based rate limit for API operations
 */
export declare const DEFAULT_COST_BASED_LIMIT: CostBasedRateLimit;
//# sourceMappingURL=rate-limiting-kit.d.ts.map