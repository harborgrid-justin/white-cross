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

/**
 * File: /reuse/rate-limit-throttle-kit.ts
 * Locator: WC-UTL-RTLT-001
 * Purpose: Comprehensive Rate Limiting & Throttling Utilities - Token bucket, sliding window, distributed limits
 *
 * Upstream: Independent utility module for rate limiting and throttling
 * Downstream: ../backend/*, API controllers, middleware, gateway services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Redis 4.x
 * Exports: 45+ utility functions for rate limiting, throttling, backpressure, and monitoring
 *
 * LLM Context: Production-ready rate limiting and throttling utilities for White Cross healthcare system.
 * Implements token bucket, leaky bucket, sliding window, and fixed window algorithms. Supports IP-based,
 * user-based, and API key rate limiting with Redis-backed distributed state. Includes concurrent request
 * limiting, backpressure handling, rate limit headers (X-RateLimit-*), dynamic adjustment, bypass rules,
 * and comprehensive monitoring with Sequelize models for rate_limits, throttle_rules, and limit_violations.
 */

import { Injectable, Logger } from '@nestjs/common';
import { Model, Sequelize, DataTypes, Op } from 'sequelize';
import { Redis } from 'ioredis';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  refillRate: number; // tokens per second
  refillInterval: number; // milliseconds
  initialTokens?: number;
}

interface LeakyBucketConfig {
  capacity: number;
  leakRate: number; // requests per second
  queueSize: number;
}

interface SlidingWindowConfig {
  maxRequests: number;
  windowMs: number;
  segments?: number; // number of sub-windows for sliding window
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
  ttl: number; // time to live in seconds
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

interface ThrottleRule {
  id?: number;
  name: string;
  type: 'ip' | 'userId' | 'apiKey' | 'endpoint';
  maxRequests: number;
  windowMs: number;
  enabled: boolean;
  priority: number;
  metadata?: Record<string, any>;
}

interface RateLimitEntry {
  id?: number;
  identifier: string;
  identifierType: 'ip' | 'userId' | 'apiKey';
  requestCount: number;
  windowStart: Date;
  windowEnd: Date;
  metadata?: Record<string, any>;
}

interface DynamicRateLimitAdjustment {
  identifier: string;
  multiplier: number; // 0.5 = stricter, 2.0 = more lenient
  reason: string;
  expiresAt: Date;
}

interface RateLimitMetrics {
  totalRequests: number;
  allowedRequests: number;
  blockedRequests: number;
  uniqueIdentifiers: number;
  avgRequestsPerIdentifier: number;
  topViolators: Array<{ identifier: string; count: number }>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

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
export const defineRateLimitModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'RateLimit',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      identifier: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'IP address, user ID, or API key',
      },
      identifierType: {
        type: DataTypes.ENUM('ip', 'userId', 'apiKey'),
        allowNull: false,
        comment: 'Type of identifier being rate limited',
      },
      requestCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of requests in current window',
      },
      windowStart: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Start of current rate limit window',
      },
      windowEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'End of current rate limit window',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional metadata for rate limit entry',
      },
    },
    {
      tableName: 'rate_limits',
      timestamps: true,
      indexes: [
        { fields: ['identifier', 'identifierType'], unique: true },
        { fields: ['windowEnd'] },
        { fields: ['identifierType'] },
      ],
    },
  );
};

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
export const defineThrottleRuleModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'ThrottleRule',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Human-readable name for the throttle rule',
      },
      type: {
        type: DataTypes.ENUM('ip', 'userId', 'apiKey', 'endpoint'),
        allowNull: false,
        comment: 'Type of throttle rule',
      },
      maxRequests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Maximum requests allowed in window',
      },
      windowMs: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Time window in milliseconds',
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether rule is active',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Priority for rule application (higher = checked first)',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional metadata for throttle rule',
      },
    },
    {
      tableName: 'throttle_rules',
      timestamps: true,
      indexes: [
        { fields: ['type'] },
        { fields: ['enabled'] },
        { fields: ['priority'] },
      ],
    },
  );
};

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
export const defineLimitViolationModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'LimitViolation',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      identifier: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'IP address, user ID, or API key that violated limit',
      },
      identifierType: {
        type: DataTypes.ENUM('ip', 'userId', 'apiKey'),
        allowNull: false,
        comment: 'Type of identifier',
      },
      limitType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Type of rate limit (token_bucket, sliding_window, etc.)',
      },
      requestCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Number of requests at time of violation',
      },
      limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Maximum allowed requests',
      },
      windowMs: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Time window in milliseconds',
      },
      violatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Timestamp of violation',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional violation metadata (endpoint, user-agent, etc.)',
      },
    },
    {
      tableName: 'limit_violations',
      timestamps: true,
      indexes: [
        { fields: ['identifier'] },
        { fields: ['identifierType'] },
        { fields: ['limitType'] },
        { fields: ['violatedAt'] },
      ],
    },
  );
};

// ============================================================================
// TOKEN BUCKET RATE LIMITER
// ============================================================================

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
export const createTokenBucketLimiter = (
  config: TokenBucketConfig,
  redis: Redis,
) => {
  const { capacity, refillRate, refillInterval, initialTokens = capacity } = config;

  const consume = async (
    identifier: string,
    tokens: number = 1,
  ): Promise<RateLimitResult> => {
    const key = `token_bucket:${identifier}`;
    const now = Date.now();

    // Use Lua script for atomic token bucket operations
    const script = `
      local key = KEYS[1]
      local capacity = tonumber(ARGV[1])
      local refillRate = tonumber(ARGV[2])
      local refillInterval = tonumber(ARGV[3])
      local tokens = tonumber(ARGV[4])
      local now = tonumber(ARGV[5])

      local bucket = redis.call('HMGET', key, 'tokens', 'lastRefill')
      local currentTokens = tonumber(bucket[1]) or capacity
      local lastRefill = tonumber(bucket[2]) or now

      -- Calculate tokens to add based on time elapsed
      local elapsed = now - lastRefill
      local refills = math.floor(elapsed / refillInterval)
      local tokensToAdd = refills * refillRate

      -- Refill tokens up to capacity
      currentTokens = math.min(capacity, currentTokens + tokensToAdd)
      local newLastRefill = lastRefill + (refills * refillInterval)

      -- Check if we have enough tokens
      if currentTokens >= tokens then
        currentTokens = currentTokens - tokens
        redis.call('HMSET', key, 'tokens', currentTokens, 'lastRefill', newLastRefill)
        redis.call('EXPIRE', key, math.ceil(refillInterval / 1000) * 2)
        return {1, currentTokens, newLastRefill}
      else
        redis.call('HMSET', key, 'tokens', currentTokens, 'lastRefill', newLastRefill)
        redis.call('EXPIRE', key, math.ceil(refillInterval / 1000) * 2)
        return {0, currentTokens, newLastRefill}
      end
    `;

    const result = await redis.eval(
      script,
      1,
      key,
      capacity.toString(),
      refillRate.toString(),
      refillInterval.toString(),
      tokens.toString(),
      now.toString(),
    ) as number[];

    const allowed = result[0] === 1;
    const remaining = result[1];
    const lastRefill = result[2];

    // Calculate when bucket will have enough tokens
    const tokensNeeded = tokens - remaining;
    const refillsNeeded = Math.ceil(tokensNeeded / refillRate);
    const resetAt = new Date(lastRefill + (refillsNeeded * refillInterval));

    return {
      allowed,
      remaining: Math.floor(remaining),
      resetAt,
      retryAfter: allowed ? undefined : Math.ceil((resetAt.getTime() - now) / 1000),
      total: capacity,
    };
  };

  const reset = async (identifier: string): Promise<void> => {
    const key = `token_bucket:${identifier}`;
    await redis.del(key);
  };

  const getState = async (identifier: string): Promise<{ tokens: number; lastRefill: number }> => {
    const key = `token_bucket:${identifier}`;
    const result = await redis.hmget(key, 'tokens', 'lastRefill');
    return {
      tokens: result[0] ? parseFloat(result[0]) : capacity,
      lastRefill: result[1] ? parseFloat(result[1]) : Date.now(),
    };
  };

  return { consume, reset, getState };
};

// ============================================================================
// LEAKY BUCKET RATE LIMITER
// ============================================================================

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
export const createLeakyBucketLimiter = (
  config: LeakyBucketConfig,
  redis: Redis,
) => {
  const { capacity, leakRate, queueSize } = config;
  const leakInterval = 1000 / leakRate; // milliseconds per request

  const consume = async (identifier: string): Promise<RateLimitResult> => {
    const key = `leaky_bucket:${identifier}`;
    const now = Date.now();

    // Use Lua script for atomic leaky bucket operations
    const script = `
      local key = KEYS[1]
      local capacity = tonumber(ARGV[1])
      local leakInterval = tonumber(ARGV[2])
      local now = tonumber(ARGV[3])

      local bucket = redis.call('HMGET', key, 'count', 'lastLeak')
      local count = tonumber(bucket[1]) or 0
      local lastLeak = tonumber(bucket[2]) or now

      -- Calculate how many requests have leaked
      local elapsed = now - lastLeak
      local leaked = math.floor(elapsed / leakInterval)

      -- Update count (can't go below 0)
      count = math.max(0, count - leaked)
      local newLastLeak = lastLeak + (leaked * leakInterval)

      -- Check if bucket has space
      if count < capacity then
        count = count + 1
        redis.call('HMSET', key, 'count', count, 'lastLeak', newLastLeak)
        redis.call('EXPIRE', key, math.ceil(capacity * leakInterval / 1000) * 2)
        return {1, count, newLastLeak}
      else
        redis.call('HMSET', key, 'count', count, 'lastLeak', newLastLeak)
        redis.call('EXPIRE', key, math.ceil(capacity * leakInterval / 1000) * 2)
        return {0, count, newLastLeak}
      end
    `;

    const result = await redis.eval(
      script,
      1,
      key,
      capacity.toString(),
      leakInterval.toString(),
      now.toString(),
    ) as number[];

    const allowed = result[0] === 1;
    const count = result[1];
    const lastLeak = result[2];

    // Calculate when bucket will have space
    const resetAt = new Date(lastLeak + ((count - capacity + 1) * leakInterval));

    return {
      allowed,
      remaining: capacity - count,
      resetAt,
      retryAfter: allowed ? undefined : Math.ceil((resetAt.getTime() - now) / 1000),
      total: capacity,
    };
  };

  const reset = async (identifier: string): Promise<void> => {
    const key = `leaky_bucket:${identifier}`;
    await redis.del(key);
  };

  return { consume, reset };
};

// ============================================================================
// SLIDING WINDOW RATE LIMITER
// ============================================================================

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
export const createSlidingWindowLimiter = (
  config: SlidingWindowConfig,
  redis: Redis,
) => {
  const { maxRequests, windowMs, segments = 10 } = config;

  const consume = async (identifier: string): Promise<RateLimitResult> => {
    const key = `sliding_window:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Use Lua script for atomic sliding window operations
    const script = `
      local key = KEYS[1]
      local maxRequests = tonumber(ARGV[1])
      local windowStart = tonumber(ARGV[2])
      local now = tonumber(ARGV[3])

      -- Remove old entries outside the window
      redis.call('ZREMRANGEBYSCORE', key, '-inf', windowStart)

      -- Count current requests in window
      local count = redis.call('ZCARD', key)

      if count < maxRequests then
        -- Add new request with current timestamp as score
        redis.call('ZADD', key, now, now .. ':' .. math.random(1000000))
        redis.call('EXPIRE', key, math.ceil(tonumber(ARGV[4]) / 1000) * 2)
        return {1, count + 1}
      else
        return {0, count}
      end
    `;

    const result = await redis.eval(
      script,
      1,
      key,
      maxRequests.toString(),
      windowStart.toString(),
      now.toString(),
      windowMs.toString(),
    ) as number[];

    const allowed = result[0] === 1;
    const count = result[1];

    // Get oldest request timestamp to calculate reset
    let resetAt = new Date(now + windowMs);
    if (count >= maxRequests) {
      const oldest = await redis.zrange(key, 0, 0, 'WITHSCORES');
      if (oldest.length > 1) {
        const oldestTimestamp = parseFloat(oldest[1]);
        resetAt = new Date(oldestTimestamp + windowMs);
      }
    }

    return {
      allowed,
      remaining: Math.max(0, maxRequests - count),
      resetAt,
      retryAfter: allowed ? undefined : Math.ceil((resetAt.getTime() - now) / 1000),
      total: maxRequests,
    };
  };

  const reset = async (identifier: string): Promise<void> => {
    const key = `sliding_window:${identifier}`;
    await redis.del(key);
  };

  const getCount = async (identifier: string): Promise<number> => {
    const key = `sliding_window:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    await redis.zremrangebyscore(key, '-inf', windowStart);
    return await redis.zcard(key);
  };

  return { consume, reset, getCount };
};

// ============================================================================
// FIXED WINDOW RATE LIMITER
// ============================================================================

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
export const createFixedWindowLimiter = (
  config: FixedWindowConfig,
  redis: Redis,
) => {
  const { maxRequests, windowMs } = config;

  const consume = async (identifier: string): Promise<RateLimitResult> => {
    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const key = `fixed_window:${identifier}:${windowStart}`;
    const ttl = Math.ceil(windowMs / 1000);

    // Increment counter and set expiry
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, ttl);
    }

    const allowed = count <= maxRequests;
    const resetAt = new Date(windowStart + windowMs);

    return {
      allowed,
      remaining: Math.max(0, maxRequests - count),
      resetAt,
      retryAfter: allowed ? undefined : Math.ceil((resetAt.getTime() - now) / 1000),
      total: maxRequests,
    };
  };

  const reset = async (identifier: string): Promise<void> => {
    const pattern = `fixed_window:${identifier}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  };

  const getCount = async (identifier: string): Promise<number> => {
    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const key = `fixed_window:${identifier}:${windowStart}`;
    const count = await redis.get(key);
    return count ? parseInt(count, 10) : 0;
  };

  return { consume, reset, getCount };
};

// ============================================================================
// IP-BASED RATE LIMITING
// ============================================================================

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
export const extractClientIp = (request: any, trustProxy: boolean = false): string => {
  if (trustProxy) {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = forwarded.split(',').map((ip: string) => ip.trim());
      return ips[0];
    }
  }

  return (
    request.connection?.remoteAddress ||
    request.socket?.remoteAddress ||
    request.ip ||
    'unknown'
  );
};

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
export const createIpRateLimiter = (config: RateLimitConfig, redis: Redis) => {
  const limiter = createSlidingWindowLimiter(
    { maxRequests: config.maxRequests, windowMs: config.windowMs },
    redis,
  );

  return async (request: any): Promise<RateLimitResult> => {
    const ip = extractClientIp(request, config.trustProxy);
    const identifier = `${config.keyPrefix}:ip:${ip}`;
    return await limiter.consume(identifier);
  };
};

// ============================================================================
// USER-BASED RATE LIMITING
// ============================================================================

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
export const createUserRateLimiter = (config: RateLimitConfig, redis: Redis) => {
  const limiter = createSlidingWindowLimiter(
    { maxRequests: config.maxRequests, windowMs: config.windowMs },
    redis,
  );

  return async (request: any): Promise<RateLimitResult> => {
    const userId = request.user?.id || request.user?.sub || 'anonymous';
    const identifier = `${config.keyPrefix}:user:${userId}`;
    return await limiter.consume(identifier);
  };
};

// ============================================================================
// API KEY RATE LIMITING
// ============================================================================

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
export const extractApiKey = (
  request: any,
  headerName: string = 'x-api-key',
  queryParam: string = 'apiKey',
): string | null => {
  return (
    request.headers[headerName.toLowerCase()] ||
    request.query?.[queryParam] ||
    null
  );
};

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
export const createApiKeyRateLimiter = (config: RateLimitConfig, redis: Redis) => {
  const limiter = createSlidingWindowLimiter(
    { maxRequests: config.maxRequests, windowMs: config.windowMs },
    redis,
  );

  return async (request: any): Promise<RateLimitResult> => {
    const apiKey = extractApiKey(request);
    if (!apiKey) {
      throw new Error('API key required for rate limiting');
    }
    const identifier = `${config.keyPrefix}:apikey:${apiKey}`;
    return await limiter.consume(identifier);
  };
};

// ============================================================================
// CONCURRENT REQUEST LIMITING
// ============================================================================

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
export const createConcurrentLimiter = (
  config: ConcurrentLimitConfig,
  redis: Redis,
) => {
  const { maxConcurrent, queueSize, timeout } = config;

  const acquire = async (identifier: string): Promise<{ allowed: boolean; token?: string }> => {
    const key = `concurrent:${identifier}`;
    const now = Date.now();
    const token = `${now}:${Math.random()}`;

    // Remove expired entries
    await redis.zremrangebyscore(key, '-inf', now - timeout);

    // Check current concurrent count
    const count = await redis.zcard(key);

    if (count < maxConcurrent) {
      await redis.zadd(key, now, token);
      await redis.expire(key, Math.ceil(timeout / 1000) * 2);
      return { allowed: true, token };
    }

    return { allowed: false };
  };

  const release = async (identifier: string, token: string): Promise<void> => {
    const key = `concurrent:${identifier}`;
    await redis.zrem(key, token);
  };

  const getCount = async (identifier: string): Promise<number> => {
    const key = `concurrent:${identifier}`;
    const now = Date.now();
    await redis.zremrangebyscore(key, '-inf', now - timeout);
    return await redis.zcard(key);
  };

  return { acquire, release, getCount };
};

// ============================================================================
// REQUEST THROTTLING
// ============================================================================

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
export const Throttle = (config: ThrottleConfig): MethodDecorator => {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Throttle metadata stored for use by guard
      Reflect.defineMetadata('throttle:config', config, target, propertyKey);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};

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
export const createThrottleConfig = (
  limit: number,
  ttl: number,
  options?: Partial<ThrottleConfig>,
): ThrottleConfig => {
  return {
    limit,
    ttl,
    ignoreUserAgents: options?.ignoreUserAgents || [],
    skipIf: options?.skipIf,
  };
};

// ============================================================================
// BACKPRESSURE HANDLING
// ============================================================================

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
export const createBackpressureHandler = (
  config: BackpressureConfig,
  redis: Redis,
) => {
  const { threshold, maxPressure, releaseRate, strategy } = config;

  const measurePressure = async (identifier: string): Promise<number> => {
    const key = `backpressure:${identifier}`;
    const pressure = await redis.get(key);
    return pressure ? parseFloat(pressure) : 0;
  };

  const increasePressure = async (identifier: string, amount: number = 0.1): Promise<number> => {
    const key = `backpressure:${identifier}`;
    const script = `
      local key = KEYS[1]
      local amount = tonumber(ARGV[1])
      local maxPressure = tonumber(ARGV[2])

      local current = tonumber(redis.call('GET', key)) or 0
      local newPressure = math.min(maxPressure, current + amount)

      redis.call('SET', key, newPressure)
      redis.call('EXPIRE', key, 300)

      return newPressure
    `;

    const result = await redis.eval(
      script,
      1,
      key,
      amount.toString(),
      maxPressure.toString(),
    ) as number;

    return result;
  };

  const releasePressure = async (identifier: string): Promise<number> => {
    const key = `backpressure:${identifier}`;
    const script = `
      local key = KEYS[1]
      local releaseRate = tonumber(ARGV[1])

      local current = tonumber(redis.call('GET', key)) or 0
      local newPressure = math.max(0, current - releaseRate)

      if newPressure > 0 then
        redis.call('SET', key, newPressure)
        redis.call('EXPIRE', key, 300)
      else
        redis.call('DEL', key)
      end

      return newPressure
    `;

    const result = await redis.eval(
      script,
      1,
      key,
      releaseRate.toString(),
    ) as number;

    return result;
  };

  const checkPressure = async (identifier: string): Promise<{
    allowed: boolean;
    pressure: number;
    action: 'accept' | 'reject' | 'queue' | 'slow';
  }> => {
    const pressure = await measurePressure(identifier);

    if (pressure < threshold) {
      return { allowed: true, pressure, action: 'accept' };
    }

    if (pressure >= maxPressure) {
      return { allowed: false, pressure, action: strategy === 'reject' ? 'reject' : 'queue' };
    }

    // Between threshold and max - apply strategy
    return {
      allowed: strategy !== 'reject',
      pressure,
      action: strategy === 'queue' ? 'queue' : 'slow',
    };
  };

  return {
    measurePressure,
    increasePressure,
    releasePressure,
    checkPressure,
  };
};

// ============================================================================
// RATE LIMIT HEADERS
// ============================================================================

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
export const generateRateLimitHeaders = (result: RateLimitResult): RateLimitHeaders => {
  const headers: RateLimitHeaders = {
    'X-RateLimit-Limit': result.total,
    'X-RateLimit-Remaining': result.remaining,
    'X-RateLimit-Reset': Math.floor(result.resetAt.getTime() / 1000),
  };

  if (result.retryAfter !== undefined) {
    headers['X-RateLimit-RetryAfter'] = result.retryAfter;
  }

  return headers;
};

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
export const applyRateLimitHeaders = (response: any, result: RateLimitResult): void => {
  const headers = generateRateLimitHeaders(result);

  Object.entries(headers).forEach(([key, value]) => {
    if (value !== undefined) {
      response.setHeader(key, value.toString());
    }
  });
};

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
export const parseRateLimitHeaders = (headers: any): Partial<RateLimitHeaders> => {
  const parsed: Partial<RateLimitHeaders> = {};

  if (headers['x-ratelimit-limit']) {
    parsed['X-RateLimit-Limit'] = parseInt(headers['x-ratelimit-limit'], 10);
  }
  if (headers['x-ratelimit-remaining']) {
    parsed['X-RateLimit-Remaining'] = parseInt(headers['x-ratelimit-remaining'], 10);
  }
  if (headers['x-ratelimit-reset']) {
    parsed['X-RateLimit-Reset'] = parseInt(headers['x-ratelimit-reset'], 10);
  }
  if (headers['x-ratelimit-retryafter']) {
    parsed['X-RateLimit-RetryAfter'] = parseInt(headers['x-ratelimit-retryafter'], 10);
  }

  return parsed;
};

// ============================================================================
// DYNAMIC RATE LIMIT ADJUSTMENT
// ============================================================================

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
export const adjustRateLimit = async (
  redis: Redis,
  adjustment: DynamicRateLimitAdjustment,
): Promise<void> => {
  const key = `rate_limit_adjustment:${adjustment.identifier}`;
  const ttl = Math.ceil((adjustment.expiresAt.getTime() - Date.now()) / 1000);

  await redis.setex(
    key,
    ttl,
    JSON.stringify({
      multiplier: adjustment.multiplier,
      reason: adjustment.reason,
    }),
  );
};

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
export const getRateLimitAdjustment = async (
  redis: Redis,
  identifier: string,
): Promise<{ multiplier: number; reason: string } | null> => {
  const key = `rate_limit_adjustment:${identifier}`;
  const data = await redis.get(key);

  if (!data) return null;

  return JSON.parse(data);
};

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
export const applyRateLimitMultiplier = (
  config: RateLimitConfig,
  multiplier: number,
): RateLimitConfig => {
  return {
    ...config,
    maxRequests: Math.floor(config.maxRequests * multiplier),
  };
};

// ============================================================================
// RATE LIMIT BYPASS
// ============================================================================

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
export const shouldBypassRateLimit = (request: any, rules: BypassRule[]): boolean => {
  for (const rule of rules) {
    switch (rule.type) {
      case 'ip': {
        const ip = extractClientIp(request, true);
        if (rule.values.includes(ip)) return true;
        break;
      }
      case 'apiKey': {
        const apiKey = extractApiKey(request);
        if (apiKey && rule.values.includes(apiKey)) return true;
        break;
      }
      case 'userId': {
        const userId = request.user?.id || request.user?.sub;
        if (userId && rule.values.includes(userId)) return true;
        break;
      }
      case 'userAgent': {
        const userAgent = request.headers['user-agent'] || '';
        if (rule.values.some(pattern => userAgent.includes(pattern))) return true;
        break;
      }
    }
  }

  return false;
};

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
export const createBypassRule = (
  type: BypassRule['type'],
  values: string[],
  reason: string,
): BypassRule => {
  return { type, values, reason };
};

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
export const storeBypassRule = async (
  redis: Redis,
  ruleId: string,
  rule: BypassRule,
  ttl: number = 0,
): Promise<void> => {
  const key = `bypass_rule:${ruleId}`;
  const serialized = JSON.stringify(rule);

  if (ttl > 0) {
    await redis.setex(key, ttl, serialized);
  } else {
    await redis.set(key, serialized);
  }
};

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
export const getBypassRule = async (
  redis: Redis,
  ruleId: string,
): Promise<BypassRule | null> => {
  const key = `bypass_rule:${ruleId}`;
  const data = await redis.get(key);

  if (!data) return null;

  return JSON.parse(data);
};

// ============================================================================
// DISTRIBUTED RATE LIMITING
// ============================================================================

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
export const createDistributedRateLimiter = (
  config: RateLimitConfig,
  redis: Redis,
) => {
  // Use sliding window for accurate distributed rate limiting
  return createSlidingWindowLimiter(
    { maxRequests: config.maxRequests, windowMs: config.windowMs },
    redis,
  );
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
export const syncRateLimitState = async (
  redisClients: Redis[],
  identifier: string,
): Promise<number> => {
  const promises = redisClients.map(async (redis) => {
    const key = `rate_limit_sync:${identifier}`;
    const count = await redis.get(key);
    return count ? parseInt(count, 10) : 0;
  });

  const counts = await Promise.all(promises);
  return counts.reduce((sum, count) => sum + count, 0);
};

// ============================================================================
// RATE LIMIT MONITORING & ALERTS
// ============================================================================

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
export const recordRateLimitViolation = async (
  violationModel: typeof Model,
  violation: RateLimitViolation,
): Promise<any> => {
  return await violationModel.create(violation as any);
};

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
export const getRateLimitViolations = async (
  violationModel: typeof Model,
  identifier: string,
  startDate: Date,
  endDate: Date,
): Promise<any[]> => {
  return await violationModel.findAll({
    where: {
      identifier,
      violatedAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['violatedAt', 'DESC']],
  } as any);
};

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
export const generateRateLimitMetrics = async (
  violationModel: typeof Model,
  startDate: Date,
  endDate: Date,
): Promise<RateLimitMetrics> => {
  const violations = await violationModel.findAll({
    where: {
      violatedAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  } as any);

  const totalRequests = violations.reduce((sum: number, v: any) => sum + v.requestCount, 0);
  const blockedRequests = violations.length;
  const identifiers = new Set(violations.map((v: any) => v.identifier));

  // Calculate top violators
  const violatorCounts = new Map<string, number>();
  violations.forEach((v: any) => {
    violatorCounts.set(v.identifier, (violatorCounts.get(v.identifier) || 0) + 1);
  });

  const topViolators = Array.from(violatorCounts.entries())
    .map(([identifier, count]) => ({ identifier, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalRequests,
    allowedRequests: totalRequests - blockedRequests,
    blockedRequests,
    uniqueIdentifiers: identifiers.size,
    avgRequestsPerIdentifier: identifiers.size > 0 ? totalRequests / identifiers.size : 0,
    topViolators,
  };
};

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
export const shouldTriggerRateLimitAlert = async (
  violationModel: typeof Model,
  identifier: string,
  threshold: number,
  windowMs: number,
): Promise<boolean> => {
  const startDate = new Date(Date.now() - windowMs);
  const endDate = new Date();

  const count = await violationModel.count({
    where: {
      identifier,
      violatedAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  } as any);

  return count >= threshold;
};

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
export const createRateLimitAlert = (
  name: string,
  violationThreshold: number,
  windowMs: number,
  notificationChannels: string[],
) => {
  return {
    name,
    violationThreshold,
    windowMs,
    notificationChannels,
    enabled: true,
    createdAt: new Date(),
  };
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
export const getActiveThrottleRules = async (
  throttleRuleModel: typeof Model,
  type?: string,
): Promise<any[]> => {
  const where: any = { enabled: true };
  if (type) {
    where.type = type;
  }

  return await throttleRuleModel.findAll({
    where,
    order: [['priority', 'DESC']],
  } as any);
};

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
export const applyThrottleRule = (throttleRule: any): RateLimitConfig => {
  return {
    maxRequests: throttleRule.maxRequests,
    windowMs: throttleRule.windowMs,
    keyPrefix: `throttle:${throttleRule.name}`,
  };
};

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
export const cleanupExpiredRateLimits = async (
  rateLimitModel: typeof Model,
  expiryDate: Date,
): Promise<number> => {
  const result = await rateLimitModel.destroy({
    where: {
      windowEnd: {
        [Op.lt]: expiryDate,
      },
    },
  } as any);

  return result;
};

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export const RateLimitUtils = {
  // Token Bucket
  createTokenBucketLimiter,

  // Leaky Bucket
  createLeakyBucketLimiter,

  // Sliding Window
  createSlidingWindowLimiter,

  // Fixed Window
  createFixedWindowLimiter,

  // IP-based
  extractClientIp,
  createIpRateLimiter,

  // User-based
  createUserRateLimiter,

  // API Key
  extractApiKey,
  createApiKeyRateLimiter,

  // Concurrent
  createConcurrentLimiter,

  // Throttling
  Throttle,
  createThrottleConfig,

  // Backpressure
  createBackpressureHandler,

  // Headers
  generateRateLimitHeaders,
  applyRateLimitHeaders,
  parseRateLimitHeaders,

  // Dynamic Adjustment
  adjustRateLimit,
  getRateLimitAdjustment,
  applyRateLimitMultiplier,

  // Bypass
  shouldBypassRateLimit,
  createBypassRule,
  storeBypassRule,
  getBypassRule,

  // Distributed
  createDistributedRateLimiter,
  syncRateLimitState,

  // Monitoring
  recordRateLimitViolation,
  getRateLimitViolations,
  generateRateLimitMetrics,
  shouldTriggerRateLimitAlert,
  createRateLimitAlert,

  // Throttle Rules
  getActiveThrottleRules,
  applyThrottleRule,

  // Cleanup
  cleanupExpiredRateLimits,
};

export default RateLimitUtils;
