/**
 * LOC: RTLT1234567
 * File: /reuse/rate-limit-throttle-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API controllers and guards
 *   - Middleware and interceptors
 *   - Gateway services
 */
import { Model, Sequelize } from 'sequelize';
import { Redis } from 'ioredis';
interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    keyPrefix: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    trustProxy?: boolean;
}
interface TokenBucketConfig {
    capacity: number;
    refillRate: number;
    refillInterval: number;
    initialTokens?: number;
}
interface LeakyBucketConfig {
    capacity: number;
    leakRate: number;
    queueSize: number;
}
interface SlidingWindowConfig {
    maxRequests: number;
    windowMs: number;
    segments?: number;
}
interface FixedWindowConfig {
    maxRequests: number;
    windowMs: number;
}
interface ConcurrentLimitConfig {
    maxConcurrent: number;
    queueSize: number;
    timeout: number;
}
interface ThrottleConfig {
    ttl: number;
    limit: number;
    ignoreUserAgents?: RegExp[];
    skipIf?: (context: any) => boolean;
}
interface BackpressureConfig {
    threshold: number;
    maxPressure: number;
    releaseRate: number;
    strategy: 'reject' | 'queue' | 'slow';
}
interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
    retryAfter?: number;
    total: number;
}
interface RateLimitHeaders {
    'X-RateLimit-Limit': number;
    'X-RateLimit-Remaining': number;
    'X-RateLimit-Reset': number;
    'X-RateLimit-RetryAfter'?: number;
}
interface BypassRule {
    type: 'ip' | 'apiKey' | 'userId' | 'userAgent';
    values: string[];
    reason: string;
}
interface RateLimitViolation {
    id?: number;
    identifier: string;
    identifierType: 'ip' | 'userId' | 'apiKey';
    limitType: string;
    requestCount: number;
    limit: number;
    windowMs: number;
    violatedAt: Date;
    metadata?: Record<string, any>;
}
interface DynamicRateLimitAdjustment {
    identifier: string;
    multiplier: number;
    reason: string;
    expiresAt: Date;
}
interface RateLimitMetrics {
    totalRequests: number;
    allowedRequests: number;
    blockedRequests: number;
    uniqueIdentifiers: number;
    avgRequestsPerIdentifier: number;
    topViolators: Array<{
        identifier: string;
        count: number;
    }>;
}
/**
 * Sequelize model definition for rate_limits table.
 * Stores current rate limit state for identifiers.
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
 * Sequelize model definition for throttle_rules table.
 * Stores configured throttle rules for different identifier types.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ThrottleRule model class
 *
 * @example
 * ```typescript
 * const ThrottleRule = defineThrottleRuleModel(sequelize);
 * const rule = await ThrottleRule.create({
 *   name: 'API Key Standard',
 *   type: 'apiKey',
 *   maxRequests: 1000,
 *   windowMs: 3600000,
 *   enabled: true,
 *   priority: 10
 * });
 * ```
 */
export declare const defineThrottleRuleModel: (sequelize: Sequelize) => any;
/**
 * Sequelize model definition for limit_violations table.
 * Tracks rate limit violations for monitoring and alerting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} LimitViolation model class
 *
 * @example
 * ```typescript
 * const LimitViolation = defineLimitViolationModel(sequelize);
 * const violation = await LimitViolation.create({
 *   identifier: '192.168.1.1',
 *   identifierType: 'ip',
 *   limitType: 'fixed_window',
 *   requestCount: 150,
 *   limit: 100,
 *   windowMs: 60000,
 *   violatedAt: new Date()
 * });
 * ```
 */
export declare const defineLimitViolationModel: (sequelize: Sequelize) => any;
/**
 * Creates a token bucket rate limiter instance.
 * Tokens refill at a constant rate, allowing bursts up to capacity.
 *
 * @param {TokenBucketConfig} config - Token bucket configuration
 * @param {Redis} redis - Redis client for distributed state
 * @returns {Object} Token bucket rate limiter functions
 *
 * @example
 * ```typescript
 * const limiter = createTokenBucketLimiter(
 *   { capacity: 100, refillRate: 10, refillInterval: 1000 },
 *   redisClient
 * );
 * const result = await limiter.consume('user:123', 5);
 * // Result: { allowed: true, remaining: 95, resetAt: Date(...) }
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
 * Creates a leaky bucket rate limiter instance.
 * Requests leak out at a constant rate, enforcing smooth request flow.
 *
 * @param {LeakyBucketConfig} config - Leaky bucket configuration
 * @param {Redis} redis - Redis client for distributed state
 * @returns {Object} Leaky bucket rate limiter functions
 *
 * @example
 * ```typescript
 * const limiter = createLeakyBucketLimiter(
 *   { capacity: 100, leakRate: 10, queueSize: 50 },
 *   redisClient
 * );
 * const result = await limiter.consume('api:endpoint:123');
 * // Result: { allowed: true, remaining: 49, resetAt: Date(...) }
 * ```
 */
export declare const createLeakyBucketLimiter: (config: LeakyBucketConfig, redis: Redis) => {
    consume: (identifier: string) => Promise<RateLimitResult>;
    reset: (identifier: string) => Promise<void>;
};
/**
 * Creates a sliding window rate limiter using Redis sorted sets.
 * Provides accurate rate limiting across time windows.
 *
 * @param {SlidingWindowConfig} config - Sliding window configuration
 * @param {Redis} redis - Redis client for distributed state
 * @returns {Object} Sliding window rate limiter functions
 *
 * @example
 * ```typescript
 * const limiter = createSlidingWindowLimiter(
 *   { maxRequests: 100, windowMs: 60000, segments: 6 },
 *   redisClient
 * );
 * const result = await limiter.consume('user:456');
 * // Result: { allowed: true, remaining: 99, resetAt: Date(...) }
 * ```
 */
export declare const createSlidingWindowLimiter: (config: SlidingWindowConfig, redis: Redis) => {
    consume: (identifier: string) => Promise<RateLimitResult>;
    reset: (identifier: string) => Promise<void>;
    getCount: (identifier: string) => Promise<number>;
};
/**
 * Creates a fixed window rate limiter using Redis.
 * Simple and efficient, resets at fixed intervals.
 *
 * @param {FixedWindowConfig} config - Fixed window configuration
 * @param {Redis} redis - Redis client for distributed state
 * @returns {Object} Fixed window rate limiter functions
 *
 * @example
 * ```typescript
 * const limiter = createFixedWindowLimiter(
 *   { maxRequests: 1000, windowMs: 3600000 },
 *   redisClient
 * );
 * const result = await limiter.consume('ip:192.168.1.1');
 * // Result: { allowed: true, remaining: 999, resetAt: Date(...) }
 * ```
 */
export declare const createFixedWindowLimiter: (config: FixedWindowConfig, redis: Redis) => {
    consume: (identifier: string) => Promise<RateLimitResult>;
    reset: (identifier: string) => Promise<void>;
    getCount: (identifier: string) => Promise<number>;
};
/**
 * Extracts client IP address from request, respecting proxy headers.
 *
 * @param {any} request - NestJS request object
 * @param {boolean} trustProxy - Whether to trust X-Forwarded-For header
 * @returns {string} Client IP address
 *
 * @example
 * ```typescript
 * const ip = extractClientIp(request, true);
 * // Result: '192.168.1.1'
 * ```
 */
export declare const extractClientIp: (request: any, trustProxy?: boolean) => string;
/**
 * Creates an IP-based rate limiter.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @param {Redis} redis - Redis client
 * @returns {Function} Rate limit middleware function
 *
 * @example
 * ```typescript
 * const limiter = createIpRateLimiter(
 *   { maxRequests: 100, windowMs: 60000, keyPrefix: 'ip_limit' },
 *   redisClient
 * );
 * const result = await limiter(request);
 * ```
 */
export declare const createIpRateLimiter: (config: RateLimitConfig, redis: Redis) => (request: any) => Promise<RateLimitResult>;
/**
 * Creates a user-based rate limiter using user ID from request.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @param {Redis} redis - Redis client
 * @returns {Function} Rate limit middleware function
 *
 * @example
 * ```typescript
 * const limiter = createUserRateLimiter(
 *   { maxRequests: 500, windowMs: 3600000, keyPrefix: 'user_limit' },
 *   redisClient
 * );
 * const result = await limiter(request);
 * ```
 */
export declare const createUserRateLimiter: (config: RateLimitConfig, redis: Redis) => (request: any) => Promise<RateLimitResult>;
/**
 * Extracts API key from request headers or query parameters.
 *
 * @param {any} request - NestJS request object
 * @param {string} headerName - Header name for API key (default: 'x-api-key')
 * @param {string} queryParam - Query parameter name for API key (default: 'apiKey')
 * @returns {string | null} API key or null if not found
 *
 * @example
 * ```typescript
 * const apiKey = extractApiKey(request, 'x-api-key', 'apiKey');
 * // Result: 'ak_1234567890abcdef'
 * ```
 */
export declare const extractApiKey: (request: any, headerName?: string, queryParam?: string) => string | null;
/**
 * Creates an API key-based rate limiter.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @param {Redis} redis - Redis client
 * @returns {Function} Rate limit middleware function
 *
 * @example
 * ```typescript
 * const limiter = createApiKeyRateLimiter(
 *   { maxRequests: 10000, windowMs: 86400000, keyPrefix: 'api_key_limit' },
 *   redisClient
 * );
 * const result = await limiter(request);
 * ```
 */
export declare const createApiKeyRateLimiter: (config: RateLimitConfig, redis: Redis) => (request: any) => Promise<RateLimitResult>;
/**
 * Creates a concurrent request limiter to prevent resource exhaustion.
 *
 * @param {ConcurrentLimitConfig} config - Concurrent limit configuration
 * @param {Redis} redis - Redis client
 * @returns {Object} Concurrent limiter functions
 *
 * @example
 * ```typescript
 * const limiter = createConcurrentLimiter(
 *   { maxConcurrent: 10, queueSize: 20, timeout: 30000 },
 *   redisClient
 * );
 * const result = await limiter.acquire('user:123');
 * // ... perform operation ...
 * await limiter.release('user:123', result.token);
 * ```
 */
export declare const createConcurrentLimiter: (config: ConcurrentLimitConfig, redis: Redis) => {
    acquire: (identifier: string) => Promise<{
        allowed: boolean;
        token?: string;
    }>;
    release: (identifier: string, token: string) => Promise<void>;
    getCount: (identifier: string) => Promise<number>;
};
/**
 * Creates a throttle decorator for NestJS endpoints.
 *
 * @param {ThrottleConfig} config - Throttle configuration
 * @returns {MethodDecorator} Throttle decorator
 *
 * @example
 * ```typescript
 * @Throttle({ ttl: 60, limit: 10 })
 * @Get('users')
 * async getUsers() {
 *   // This endpoint is throttled to 10 requests per 60 seconds
 * }
 * ```
 */
export declare const Throttle: (config: ThrottleConfig) => MethodDecorator;
/**
 * Creates a throttle configuration for specific endpoint.
 *
 * @param {number} limit - Maximum requests
 * @param {number} ttl - Time to live in seconds
 * @param {Partial<ThrottleConfig>} options - Additional throttle options
 * @returns {ThrottleConfig} Throttle configuration
 *
 * @example
 * ```typescript
 * const config = createThrottleConfig(100, 60, {
 *   ignoreUserAgents: [/healthcheck/i],
 *   skipIf: (ctx) => ctx.user?.role === 'admin'
 * });
 * ```
 */
export declare const createThrottleConfig: (limit: number, ttl: number, options?: Partial<ThrottleConfig>) => ThrottleConfig;
/**
 * Creates a backpressure handler to manage system load.
 *
 * @param {BackpressureConfig} config - Backpressure configuration
 * @param {Redis} redis - Redis client
 * @returns {Object} Backpressure handler functions
 *
 * @example
 * ```typescript
 * const handler = createBackpressureHandler(
 *   { threshold: 0.7, maxPressure: 1.0, releaseRate: 0.1, strategy: 'queue' },
 *   redisClient
 * );
 * const result = await handler.checkPressure('api:endpoint');
 * ```
 */
export declare const createBackpressureHandler: (config: BackpressureConfig, redis: Redis) => {
    measurePressure: (identifier: string) => Promise<number>;
    increasePressure: (identifier: string, amount?: number) => Promise<number>;
    releasePressure: (identifier: string) => Promise<number>;
    checkPressure: (identifier: string) => Promise<{
        allowed: boolean;
        pressure: number;
        action: "accept" | "reject" | "queue" | "slow";
    }>;
};
/**
 * Generates standard X-RateLimit-* headers from rate limit result.
 *
 * @param {RateLimitResult} result - Rate limit result
 * @returns {RateLimitHeaders} Rate limit headers object
 *
 * @example
 * ```typescript
 * const headers = generateRateLimitHeaders(result);
 * // Result: {
 * //   'X-RateLimit-Limit': 100,
 * //   'X-RateLimit-Remaining': 95,
 * //   'X-RateLimit-Reset': 1635724800
 * // }
 * ```
 */
export declare const generateRateLimitHeaders: (result: RateLimitResult) => RateLimitHeaders;
/**
 * Applies rate limit headers to response object.
 *
 * @param {any} response - NestJS response object
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
 * Parses X-RateLimit-* headers from response.
 *
 * @param {any} headers - Response headers object
 * @returns {Partial<RateLimitHeaders>} Parsed rate limit headers
 *
 * @example
 * ```typescript
 * const rateLimitInfo = parseRateLimitHeaders(response.headers);
 * // Result: { 'X-RateLimit-Limit': 100, 'X-RateLimit-Remaining': 95, ... }
 * ```
 */
export declare const parseRateLimitHeaders: (headers: any) => Partial<RateLimitHeaders>;
/**
 * Dynamically adjusts rate limit for specific identifier.
 *
 * @param {Redis} redis - Redis client
 * @param {DynamicRateLimitAdjustment} adjustment - Adjustment configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await adjustRateLimit(redisClient, {
 *   identifier: 'user:123',
 *   multiplier: 2.0,
 *   reason: 'Premium user',
 *   expiresAt: new Date(Date.now() + 86400000)
 * });
 * ```
 */
export declare const adjustRateLimit: (redis: Redis, adjustment: DynamicRateLimitAdjustment) => Promise<void>;
/**
 * Gets dynamic rate limit adjustment for identifier.
 *
 * @param {Redis} redis - Redis client
 * @param {string} identifier - Rate limit identifier
 * @returns {Promise<DynamicRateLimitAdjustment | null>} Adjustment or null
 *
 * @example
 * ```typescript
 * const adjustment = await getRateLimitAdjustment(redisClient, 'user:123');
 * // Result: { multiplier: 2.0, reason: 'Premium user' }
 * ```
 */
export declare const getRateLimitAdjustment: (redis: Redis, identifier: string) => Promise<{
    multiplier: number;
    reason: string;
} | null>;
/**
 * Applies dynamic adjustment to rate limit configuration.
 *
 * @param {RateLimitConfig} config - Base rate limit configuration
 * @param {number} multiplier - Adjustment multiplier
 * @returns {RateLimitConfig} Adjusted configuration
 *
 * @example
 * ```typescript
 * const adjusted = applyRateLimitMultiplier(
 *   { maxRequests: 100, windowMs: 60000 },
 *   2.0
 * );
 * // Result: { maxRequests: 200, windowMs: 60000 }
 * ```
 */
export declare const applyRateLimitMultiplier: (config: RateLimitConfig, multiplier: number) => RateLimitConfig;
/**
 * Checks if request should bypass rate limiting based on bypass rules.
 *
 * @param {any} request - NestJS request object
 * @param {BypassRule[]} rules - Array of bypass rules
 * @returns {boolean} True if request should bypass rate limiting
 *
 * @example
 * ```typescript
 * const bypass = shouldBypassRateLimit(request, [
 *   { type: 'ip', values: ['192.168.1.1', '10.0.0.1'], reason: 'Internal IPs' },
 *   { type: 'apiKey', values: ['admin_key'], reason: 'Admin API key' }
 * ]);
 * ```
 */
export declare const shouldBypassRateLimit: (request: any, rules: BypassRule[]) => boolean;
/**
 * Creates bypass rule for trusted sources.
 *
 * @param {BypassRule['type']} type - Type of bypass rule
 * @param {string[]} values - Values to bypass
 * @param {string} reason - Reason for bypass
 * @returns {BypassRule} Bypass rule object
 *
 * @example
 * ```typescript
 * const rule = createBypassRule('ip', ['192.168.1.1'], 'Internal load balancer');
 * ```
 */
export declare const createBypassRule: (type: BypassRule["type"], values: string[], reason: string) => BypassRule;
/**
 * Stores bypass rules in Redis for distributed access.
 *
 * @param {Redis} redis - Redis client
 * @param {string} ruleId - Unique rule identifier
 * @param {BypassRule} rule - Bypass rule to store
 * @param {number} ttl - Time to live in seconds (0 = no expiry)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await storeBypassRule(redisClient, 'internal_ips', rule, 86400);
 * ```
 */
export declare const storeBypassRule: (redis: Redis, ruleId: string, rule: BypassRule, ttl?: number) => Promise<void>;
/**
 * Retrieves bypass rule from Redis.
 *
 * @param {Redis} redis - Redis client
 * @param {string} ruleId - Rule identifier
 * @returns {Promise<BypassRule | null>} Bypass rule or null
 *
 * @example
 * ```typescript
 * const rule = await getBypassRule(redisClient, 'internal_ips');
 * ```
 */
export declare const getBypassRule: (redis: Redis, ruleId: string) => Promise<BypassRule | null>;
/**
 * Creates a distributed rate limiter using Redis Cluster.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @param {Redis} redis - Redis Cluster client
 * @returns {Object} Distributed rate limiter functions
 *
 * @example
 * ```typescript
 * const limiter = createDistributedRateLimiter(
 *   { maxRequests: 1000, windowMs: 60000, keyPrefix: 'global' },
 *   redisClusterClient
 * );
 * const result = await limiter.consume('api:endpoint:users');
 * ```
 */
export declare const createDistributedRateLimiter: (config: RateLimitConfig, redis: Redis) => {
    consume: (identifier: string) => Promise<RateLimitResult>;
    reset: (identifier: string) => Promise<void>;
    getCount: (identifier: string) => Promise<number>;
};
/**
 * Synchronizes rate limit state across multiple Redis instances.
 *
 * @param {Redis[]} redisClients - Array of Redis clients
 * @param {string} identifier - Rate limit identifier
 * @returns {Promise<number>} Aggregated request count
 *
 * @example
 * ```typescript
 * const totalCount = await syncRateLimitState(
 *   [redis1, redis2, redis3],
 *   'user:123'
 * );
 * ```
 */
export declare const syncRateLimitState: (redisClients: Redis[], identifier: string) => Promise<number>;
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
 * Gets rate limit violations for identifier within time range.
 *
 * @param {typeof Model} violationModel - Sequelize LimitViolation model
 * @param {string} identifier - Identifier to check
 * @param {Date} startDate - Start of time range
 * @param {Date} endDate - End of time range
 * @returns {Promise<any[]>} Array of violations
 *
 * @example
 * ```typescript
 * const violations = await getRateLimitViolations(
 *   LimitViolation,
 *   '192.168.1.1',
 *   new Date('2023-01-01'),
 *   new Date('2023-01-31')
 * );
 * ```
 */
export declare const getRateLimitViolations: (violationModel: typeof Model, identifier: string, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * Generates rate limit metrics for monitoring dashboard.
 *
 * @param {typeof Model} violationModel - Sequelize LimitViolation model
 * @param {Date} startDate - Start of metrics period
 * @param {Date} endDate - End of metrics period
 * @returns {Promise<RateLimitMetrics>} Aggregated metrics
 *
 * @example
 * ```typescript
 * const metrics = await generateRateLimitMetrics(
 *   LimitViolation,
 *   new Date('2023-01-01'),
 *   new Date('2023-01-31')
 * );
 * ```
 */
export declare const generateRateLimitMetrics: (violationModel: typeof Model, startDate: Date, endDate: Date) => Promise<RateLimitMetrics>;
/**
 * Checks if identifier should trigger alert based on violation threshold.
 *
 * @param {typeof Model} violationModel - Sequelize LimitViolation model
 * @param {string} identifier - Identifier to check
 * @param {number} threshold - Number of violations to trigger alert
 * @param {number} windowMs - Time window to check
 * @returns {Promise<boolean>} True if alert should be triggered
 *
 * @example
 * ```typescript
 * const shouldAlert = await shouldTriggerRateLimitAlert(
 *   LimitViolation,
 *   '192.168.1.1',
 *   5,
 *   3600000
 * );
 * ```
 */
export declare const shouldTriggerRateLimitAlert: (violationModel: typeof Model, identifier: string, threshold: number, windowMs: number) => Promise<boolean>;
/**
 * Creates alert configuration for rate limit monitoring.
 *
 * @param {string} name - Alert name
 * @param {number} violationThreshold - Number of violations to trigger alert
 * @param {number} windowMs - Time window for counting violations
 * @param {string[]} notificationChannels - Channels to send alerts (email, slack, etc.)
 * @returns {Object} Alert configuration
 *
 * @example
 * ```typescript
 * const alertConfig = createRateLimitAlert(
 *   'High IP Violations',
 *   10,
 *   3600000,
 *   ['email', 'slack']
 * );
 * ```
 */
export declare const createRateLimitAlert: (name: string, violationThreshold: number, windowMs: number, notificationChannels: string[]) => {
    name: string;
    violationThreshold: number;
    windowMs: number;
    notificationChannels: string[];
    enabled: boolean;
    createdAt: Date;
};
/**
 * Gets active throttle rules from database.
 *
 * @param {typeof Model} throttleRuleModel - Sequelize ThrottleRule model
 * @param {string} [type] - Optional type filter
 * @returns {Promise<any[]>} Array of active throttle rules
 *
 * @example
 * ```typescript
 * const rules = await getActiveThrottleRules(ThrottleRule, 'apiKey');
 * ```
 */
export declare const getActiveThrottleRules: (throttleRuleModel: typeof Model, type?: string) => Promise<any[]>;
/**
 * Applies throttle rule to rate limit configuration.
 *
 * @param {any} throttleRule - Throttle rule from database
 * @returns {RateLimitConfig} Rate limit configuration
 *
 * @example
 * ```typescript
 * const config = applyThrottleRule(rule);
 * ```
 */
export declare const applyThrottleRule: (throttleRule: any) => RateLimitConfig;
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
export declare const RateLimitUtils: {
    createTokenBucketLimiter: (config: TokenBucketConfig, redis: Redis) => {
        consume: (identifier: string, tokens?: number) => Promise<RateLimitResult>;
        reset: (identifier: string) => Promise<void>;
        getState: (identifier: string) => Promise<{
            tokens: number;
            lastRefill: number;
        }>;
    };
    createLeakyBucketLimiter: (config: LeakyBucketConfig, redis: Redis) => {
        consume: (identifier: string) => Promise<RateLimitResult>;
        reset: (identifier: string) => Promise<void>;
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
    extractClientIp: (request: any, trustProxy?: boolean) => string;
    createIpRateLimiter: (config: RateLimitConfig, redis: Redis) => (request: any) => Promise<RateLimitResult>;
    createUserRateLimiter: (config: RateLimitConfig, redis: Redis) => (request: any) => Promise<RateLimitResult>;
    extractApiKey: (request: any, headerName?: string, queryParam?: string) => string | null;
    createApiKeyRateLimiter: (config: RateLimitConfig, redis: Redis) => (request: any) => Promise<RateLimitResult>;
    createConcurrentLimiter: (config: ConcurrentLimitConfig, redis: Redis) => {
        acquire: (identifier: string) => Promise<{
            allowed: boolean;
            token?: string;
        }>;
        release: (identifier: string, token: string) => Promise<void>;
        getCount: (identifier: string) => Promise<number>;
    };
    Throttle: (config: ThrottleConfig) => MethodDecorator;
    createThrottleConfig: (limit: number, ttl: number, options?: Partial<ThrottleConfig>) => ThrottleConfig;
    createBackpressureHandler: (config: BackpressureConfig, redis: Redis) => {
        measurePressure: (identifier: string) => Promise<number>;
        increasePressure: (identifier: string, amount?: number) => Promise<number>;
        releasePressure: (identifier: string) => Promise<number>;
        checkPressure: (identifier: string) => Promise<{
            allowed: boolean;
            pressure: number;
            action: "accept" | "reject" | "queue" | "slow";
        }>;
    };
    generateRateLimitHeaders: (result: RateLimitResult) => RateLimitHeaders;
    applyRateLimitHeaders: (response: any, result: RateLimitResult) => void;
    parseRateLimitHeaders: (headers: any) => Partial<RateLimitHeaders>;
    adjustRateLimit: (redis: Redis, adjustment: DynamicRateLimitAdjustment) => Promise<void>;
    getRateLimitAdjustment: (redis: Redis, identifier: string) => Promise<{
        multiplier: number;
        reason: string;
    } | null>;
    applyRateLimitMultiplier: (config: RateLimitConfig, multiplier: number) => RateLimitConfig;
    shouldBypassRateLimit: (request: any, rules: BypassRule[]) => boolean;
    createBypassRule: (type: BypassRule["type"], values: string[], reason: string) => BypassRule;
    storeBypassRule: (redis: Redis, ruleId: string, rule: BypassRule, ttl?: number) => Promise<void>;
    getBypassRule: (redis: Redis, ruleId: string) => Promise<BypassRule | null>;
    createDistributedRateLimiter: (config: RateLimitConfig, redis: Redis) => {
        consume: (identifier: string) => Promise<RateLimitResult>;
        reset: (identifier: string) => Promise<void>;
        getCount: (identifier: string) => Promise<number>;
    };
    syncRateLimitState: (redisClients: Redis[], identifier: string) => Promise<number>;
    recordRateLimitViolation: (violationModel: typeof Model, violation: RateLimitViolation) => Promise<any>;
    getRateLimitViolations: (violationModel: typeof Model, identifier: string, startDate: Date, endDate: Date) => Promise<any[]>;
    generateRateLimitMetrics: (violationModel: typeof Model, startDate: Date, endDate: Date) => Promise<RateLimitMetrics>;
    shouldTriggerRateLimitAlert: (violationModel: typeof Model, identifier: string, threshold: number, windowMs: number) => Promise<boolean>;
    createRateLimitAlert: (name: string, violationThreshold: number, windowMs: number, notificationChannels: string[]) => {
        name: string;
        violationThreshold: number;
        windowMs: number;
        notificationChannels: string[];
        enabled: boolean;
        createdAt: Date;
    };
    getActiveThrottleRules: (throttleRuleModel: typeof Model, type?: string) => Promise<any[]>;
    applyThrottleRule: (throttleRule: any) => RateLimitConfig;
    cleanupExpiredRateLimits: (rateLimitModel: typeof Model, expiryDate: Date) => Promise<number>;
};
export default RateLimitUtils;
//# sourceMappingURL=rate-limit-throttle-kit.d.ts.map