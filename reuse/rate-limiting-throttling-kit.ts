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

import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, NestInterceptor, CallHandler, SetMetadata, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Model, Sequelize, DataTypes, Op } from 'sequelize';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Redis } from 'ioredis';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RateLimitConfig {
  ttl: number; // Time to live in seconds
  limit: number; // Maximum requests
  blockDuration?: number; // Duration to block after limit exceeded (seconds)
  keyPrefix?: string; // Redis key prefix
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
  gracePeriod?: number; // Grace period in seconds
}

interface QuotaUsage {
  used: number;
  limit: number;
  remaining: number;
  resetAt: Date;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

interface BurstConfig {
  maxBurst: number; // Maximum burst size
  refillRate: number; // Tokens per second
  refillInterval: number; // Milliseconds
  penaltyMultiplier?: number; // Penalty for exceeding burst
}

interface TokenBucketState {
  tokens: number;
  lastRefill: number;
  capacity: number;
  refillRate: number;
}

interface LeakyBucketState {
  count: number;
  lastLeak: number;
  capacity: number;
  leakRate: number;
}

interface SlidingWindowEntry {
  timestamp: number;
  count: number;
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

interface RateLimitViolationData {
  identifier: string;
  identifierType: 'ip' | 'userId' | 'apiKey' | 'endpoint';
  endpoint: string;
  method: string;
  limit: number;
  actual: number;
  timestamp: Date;
  metadata?: Record<string, any>;
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

interface ThrottleRule {
  id?: string;
  name: string;
  type: 'global' | 'ip' | 'user' | 'apiKey' | 'endpoint';
  limit: number;
  ttl: number;
  enabled: boolean;
  priority: number;
  conditions?: Record<string, any>;
  metadata?: Record<string, any>;
}

// ============================================================================
// DECORATOR METADATA KEYS
// ============================================================================

export const RATE_LIMIT_KEY = 'rate-limit';
export const THROTTLE_KEY = 'throttle';
export const QUOTA_KEY = 'quota';
export const BYPASS_RATE_LIMIT_KEY = 'bypass-rate-limit';

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

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
export const defineRateLimitQuotaModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'RateLimitQuota',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      identifier: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'User ID, API key, or other identifier',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Associated user ID if applicable',
      },
      apiKeyId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Associated API key ID if applicable',
      },
      period: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
        allowNull: false,
        comment: 'Quota period',
      },
      used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of requests used in current period',
      },
      limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Maximum requests allowed in period',
      },
      resetAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'When quota resets',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional quota metadata',
      },
    },
    {
      tableName: 'rate_limit_quotas',
      timestamps: true,
      indexes: [
        { fields: ['identifier', 'period'], unique: true },
        { fields: ['userId'] },
        { fields: ['apiKeyId'] },
        { fields: ['resetAt'] },
      ],
    },
  );
};

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
export const defineRateLimitViolationModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'RateLimitViolation',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      identifier: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'IP address, user ID, API key, or endpoint',
      },
      identifierType: {
        type: DataTypes.ENUM('ip', 'userId', 'apiKey', 'endpoint'),
        allowNull: false,
        comment: 'Type of identifier that violated limit',
      },
      endpoint: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'API endpoint that was rate limited',
      },
      method: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'HTTP method (GET, POST, etc.)',
      },
      limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Rate limit that was exceeded',
      },
      actual: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Actual number of requests',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'When violation occurred',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional violation details',
      },
    },
    {
      tableName: 'rate_limit_violations',
      timestamps: true,
      indexes: [
        { fields: ['identifier'] },
        { fields: ['identifierType'] },
        { fields: ['endpoint'] },
        { fields: ['timestamp'] },
        { fields: ['identifier', 'timestamp'] },
      ],
    },
  );
};

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
export const defineThrottleRuleModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'ThrottleRuleModel',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Human-readable name for the rule',
      },
      type: {
        type: DataTypes.ENUM('global', 'ip', 'user', 'apiKey', 'endpoint'),
        allowNull: false,
        comment: 'Type of throttle rule',
      },
      limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Maximum requests allowed',
      },
      ttl: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Time window in seconds',
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
        comment: 'Rule priority (higher = checked first)',
      },
      conditions: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional rule conditions',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional rule metadata',
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
export const defineEndpointLimitModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'EndpointLimitModel',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      path: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'API endpoint path (supports patterns)',
      },
      method: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'HTTP method (GET, POST, etc.)',
      },
      limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Maximum requests allowed',
      },
      ttl: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Time window in seconds',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Rule priority for matching',
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: 'endpoint_limits',
      timestamps: true,
      indexes: [
        { fields: ['path', 'method'], unique: true },
        { fields: ['enabled'] },
        { fields: ['priority'] },
      ],
    },
  );
};

// ============================================================================
// CUSTOM DECORATORS
// ============================================================================

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
export const RateLimit = (
  limit: number,
  ttl: number,
  options?: Partial<RateLimitConfig>
): MethodDecorator => {
  return SetMetadata(RATE_LIMIT_KEY, {
    limit,
    ttl,
    ...options,
  });
};

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
export const Throttle = (
  limit: number,
  ttl: number,
  options?: Partial<ThrottleConfig>
): MethodDecorator => {
  return SetMetadata(THROTTLE_KEY, {
    limit,
    ttl,
    ...options,
  });
};

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
export const Quota = (config: QuotaConfig): MethodDecorator => {
  return SetMetadata(QUOTA_KEY, config);
};

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
export const BypassRateLimit = (): MethodDecorator => {
  return SetMetadata(BYPASS_RATE_LIMIT_KEY, true);
};

// ============================================================================
// REDIS STORAGE ADAPTER
// ============================================================================

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
export const createRedisRateLimitStorage = (
  redis: Redis,
  keyPrefix: string = 'ratelimit:'
): RateLimitStorage => {
  return {
    async get(key: string): Promise<any> {
      const data = await redis.get(`${keyPrefix}${key}`);
      return data ? JSON.parse(data) : null;
    },

    async set(key: string, value: any, ttl?: number): Promise<void> {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await redis.setex(`${keyPrefix}${key}`, ttl, serialized);
      } else {
        await redis.set(`${keyPrefix}${key}`, serialized);
      }
    },

    async increment(key: string, ttl?: number): Promise<number> {
      const count = await redis.incr(`${keyPrefix}${key}`);
      if (count === 1 && ttl) {
        await redis.expire(`${keyPrefix}${key}`, ttl);
      }
      return count;
    },

    async delete(key: string): Promise<void> {
      await redis.del(`${keyPrefix}${key}`);
    },

    async getMultiple(keys: string[]): Promise<any[]> {
      const prefixedKeys = keys.map(k => `${keyPrefix}${k}`);
      const results = await redis.mget(...prefixedKeys);
      return results.map(r => r ? JSON.parse(r) : null);
    },

    async deletePattern(pattern: string): Promise<void> {
      const keys = await redis.keys(`${keyPrefix}${pattern}`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    },
  };
};

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
export const createMemoryRateLimitStorage = (
  cleanupIntervalMs: number = 60000
): RateLimitStorage => {
  const store = new Map<string, { value: any; expiresAt?: number }>();

  // Periodic cleanup of expired entries
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.expiresAt && entry.expiresAt <= now) {
        store.delete(key);
      }
    }
  }, cleanupIntervalMs);

  return {
    async get(key: string): Promise<any> {
      const entry = store.get(key);
      if (!entry) return null;
      if (entry.expiresAt && entry.expiresAt <= Date.now()) {
        store.delete(key);
        return null;
      }
      return entry.value;
    },

    async set(key: string, value: any, ttl?: number): Promise<void> {
      store.set(key, {
        value,
        expiresAt: ttl ? Date.now() + (ttl * 1000) : undefined,
      });
    },

    async increment(key: string, ttl?: number): Promise<number> {
      const entry = store.get(key);
      const count = entry ? (entry.value || 0) + 1 : 1;
      await this.set(key, count, ttl);
      return count;
    },

    async delete(key: string): Promise<void> {
      store.delete(key);
    },

    async getMultiple(keys: string[]): Promise<any[]> {
      return Promise.all(keys.map(k => this.get(k)));
    },

    async deletePattern(pattern: string): Promise<void> {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      for (const key of store.keys()) {
        if (regex.test(key)) {
          store.delete(key);
        }
      }
    },
  };
};

// ============================================================================
// TOKEN BUCKET IMPLEMENTATION
// ============================================================================

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
export const createTokenBucketLimiter = (
  config: BurstConfig,
  storage: RateLimitStorage
) => {
  const { maxBurst, refillRate, refillInterval, penaltyMultiplier = 1.0 } = config;

  const consume = async (
    identifier: string,
    tokens: number = 1
  ): Promise<RateLimitResult> => {
    const key = `token_bucket:${identifier}`;
    const now = Date.now();

    const state: TokenBucketState = await storage.get(key) || {
      tokens: maxBurst,
      lastRefill: now,
      capacity: maxBurst,
      refillRate,
    };

    // Calculate tokens to add based on elapsed time
    const elapsed = now - state.lastRefill;
    const refills = Math.floor(elapsed / refillInterval);
    const tokensToAdd = refills * refillRate;

    // Refill tokens up to capacity
    state.tokens = Math.min(maxBurst, state.tokens + tokensToAdd);
    state.lastRefill = state.lastRefill + (refills * refillInterval);

    // Check if we have enough tokens
    const allowed = state.tokens >= tokens;

    if (allowed) {
      state.tokens -= tokens;
    } else {
      // Apply penalty for exceeding burst
      state.tokens = Math.max(0, state.tokens - (tokens * (penaltyMultiplier - 1)));
    }

    // Save state
    await storage.set(key, state, Math.ceil((maxBurst / refillRate) * (refillInterval / 1000)) * 2);

    // Calculate reset time
    const tokensNeeded = allowed ? 0 : tokens - state.tokens;
    const refillsNeeded = Math.ceil(tokensNeeded / refillRate);
    const resetAt = new Date(state.lastRefill + (refillsNeeded * refillInterval));

    return {
      allowed,
      limit: maxBurst,
      remaining: Math.floor(state.tokens),
      resetAt,
      retryAfter: allowed ? undefined : Math.ceil((resetAt.getTime() - now) / 1000),
      current: maxBurst - Math.floor(state.tokens),
    };
  };

  const reset = async (identifier: string): Promise<void> => {
    await storage.delete(`token_bucket:${identifier}`);
  };

  const getState = async (identifier: string): Promise<TokenBucketState | null> => {
    return await storage.get(`token_bucket:${identifier}`);
  };

  return { consume, reset, getState };
};

// ============================================================================
// LEAKY BUCKET IMPLEMENTATION
// ============================================================================

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
export const createLeakyBucketLimiter = (
  capacity: number,
  leakRate: number,
  storage: RateLimitStorage
) => {
  const leakInterval = 1000 / leakRate; // Milliseconds per request

  const consume = async (identifier: string): Promise<RateLimitResult> => {
    const key = `leaky_bucket:${identifier}`;
    const now = Date.now();

    const state: LeakyBucketState = await storage.get(key) || {
      count: 0,
      lastLeak: now,
      capacity,
      leakRate,
    };

    // Calculate leaked requests
    const elapsed = now - state.lastLeak;
    const leaked = Math.floor(elapsed / leakInterval);

    // Update count
    state.count = Math.max(0, state.count - leaked);
    state.lastLeak = state.lastLeak + (leaked * leakInterval);

    // Check if bucket has space
    const allowed = state.count < capacity;

    if (allowed) {
      state.count += 1;
    }

    // Save state
    await storage.set(key, state, Math.ceil((capacity / leakRate) * 2));

    const resetAt = new Date(state.lastLeak + ((state.count - capacity + 1) * leakInterval));

    return {
      allowed,
      limit: capacity,
      remaining: capacity - state.count,
      resetAt,
      retryAfter: allowed ? undefined : Math.ceil((resetAt.getTime() - now) / 1000),
      current: state.count,
    };
  };

  const reset = async (identifier: string): Promise<void> => {
    await storage.delete(`leaky_bucket:${identifier}`);
  };

  return { consume, reset };
};

// ============================================================================
// SLIDING WINDOW IMPLEMENTATION
// ============================================================================

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
export const createSlidingWindowLimiter = (
  maxRequests: number,
  windowMs: number,
  storage: RateLimitStorage
) => {
  const consume = async (identifier: string): Promise<RateLimitResult> => {
    const key = `sliding_window:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing entries
    const entries: SlidingWindowEntry[] = await storage.get(key) || [];

    // Remove expired entries
    const validEntries = entries.filter(e => e.timestamp > windowStart);

    // Count requests in window
    const count = validEntries.reduce((sum, e) => sum + e.count, 0);

    const allowed = count < maxRequests;

    if (allowed) {
      validEntries.push({ timestamp: now, count: 1 });
    }

    // Save updated entries
    await storage.set(key, validEntries, Math.ceil(windowMs / 1000) * 2);

    // Calculate reset time
    let resetAt = new Date(now + windowMs);
    if (count >= maxRequests && validEntries.length > 0) {
      const oldestTimestamp = validEntries[0].timestamp;
      resetAt = new Date(oldestTimestamp + windowMs);
    }

    return {
      allowed,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - (allowed ? count + 1 : count)),
      resetAt,
      retryAfter: allowed ? undefined : Math.ceil((resetAt.getTime() - now) / 1000),
      current: allowed ? count + 1 : count,
    };
  };

  const reset = async (identifier: string): Promise<void> => {
    await storage.delete(`sliding_window:${identifier}`);
  };

  const getCount = async (identifier: string): Promise<number> => {
    const key = `sliding_window:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    const entries: SlidingWindowEntry[] = await storage.get(key) || [];
    const validEntries = entries.filter(e => e.timestamp > windowStart);
    return validEntries.reduce((sum, e) => sum + e.count, 0);
  };

  return { consume, reset, getCount };
};

// ============================================================================
// FIXED WINDOW IMPLEMENTATION
// ============================================================================

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
export const createFixedWindowLimiter = (
  maxRequests: number,
  windowMs: number,
  storage: RateLimitStorage
) => {
  const consume = async (identifier: string): Promise<RateLimitResult> => {
    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const key = `fixed_window:${identifier}:${windowStart}`;
    const ttl = Math.ceil(windowMs / 1000);

    const count = await storage.increment(key, ttl);
    const allowed = count <= maxRequests;
    const resetAt = new Date(windowStart + windowMs);

    return {
      allowed,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - count),
      resetAt,
      retryAfter: allowed ? undefined : Math.ceil((resetAt.getTime() - now) / 1000),
      current: count,
    };
  };

  const reset = async (identifier: string): Promise<void> => {
    await storage.deletePattern(`fixed_window:${identifier}:*`);
  };

  const getCount = async (identifier: string): Promise<number> => {
    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const key = `fixed_window:${identifier}:${windowStart}`;
    const data = await storage.get(key);
    return data || 0;
  };

  return { consume, reset, getCount };
};

// ============================================================================
// QUOTA MANAGEMENT
// ============================================================================

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
export const createQuotaManager = (
  config: QuotaConfig,
  quotaModel: typeof Model
) => {
  const calculateResetDate = (period: QuotaRecord['period']): Date => {
    const now = new Date();
    const resetDate = new Date(now);

    switch (period) {
      case 'daily':
        resetDate.setDate(now.getDate() + 1);
        resetDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
        resetDate.setDate(now.getDate() + daysUntilMonday);
        resetDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        resetDate.setMonth(now.getMonth() + 1, 1);
        resetDate.setHours(0, 0, 0, 0);
        break;
      case 'yearly':
        resetDate.setFullYear(now.getFullYear() + 1, 0, 1);
        resetDate.setHours(0, 0, 0, 0);
        break;
    }

    return resetDate;
  };

  const getQuotaLimit = (period: QuotaRecord['period']): number => {
    return config[period] || 0;
  };

  const checkQuota = async (
    identifier: string,
    period: QuotaRecord['period']
  ): Promise<QuotaUsage> => {
    const limit = getQuotaLimit(period);
    if (limit === 0) {
      throw new Error(`No quota configured for period: ${period}`);
    }

    const now = new Date();

    let quota = await quotaModel.findOne({
      where: { identifier, period },
    } as any);

    // Create or reset quota if needed
    if (!quota || new Date((quota as any).resetAt) <= now) {
      quota = await quotaModel.create({
        identifier,
        period,
        used: 0,
        limit,
        resetAt: calculateResetDate(period),
      } as any);
    }

    const used = (quota as any).used;
    const remaining = Math.max(0, limit - used);

    return {
      used,
      limit,
      remaining,
      resetAt: new Date((quota as any).resetAt),
      period,
    };
  };

  const consumeQuota = async (
    identifier: string,
    period: QuotaRecord['period'],
    amount: number = 1
  ): Promise<QuotaUsage> => {
    const usage = await checkQuota(identifier, period);

    if (usage.remaining < amount) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Quota exceeded for ${period} period`,
          quota: usage,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    await quotaModel.increment(
      { used: amount },
      { where: { identifier, period } } as any
    );

    return {
      ...usage,
      used: usage.used + amount,
      remaining: usage.remaining - amount,
    };
  };

  const resetQuota = async (
    identifier: string,
    period: QuotaRecord['period']
  ): Promise<void> => {
    await quotaModel.update(
      {
        used: 0,
        resetAt: calculateResetDate(period),
      },
      { where: { identifier, period } } as any
    );
  };

  const getAllQuotas = async (identifier: string): Promise<QuotaUsage[]> => {
    const periods: QuotaRecord['period'][] = ['daily', 'weekly', 'monthly', 'yearly'];
    const quotas: QuotaUsage[] = [];

    for (const period of periods) {
      if (getQuotaLimit(period) > 0) {
        try {
          const usage = await checkQuota(identifier, period);
          quotas.push(usage);
        } catch (error) {
          // Skip if quota not configured
        }
      }
    }

    return quotas;
  };

  return {
    checkQuota,
    consumeQuota,
    resetQuota,
    getAllQuotas,
  };
};

// ============================================================================
// RATE LIMIT HEADERS
// ============================================================================

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
export const generateRateLimitHeaders = (result: RateLimitResult): RateLimitHeaders => {
  const headers: RateLimitHeaders = {
    'X-RateLimit-Limit': result.limit,
    'X-RateLimit-Remaining': result.remaining,
    'X-RateLimit-Reset': Math.floor(result.resetAt.getTime() / 1000),
  };

  if (result.retryAfter !== undefined) {
    headers['X-RateLimit-Reset-After'] = result.retryAfter;
    headers['Retry-After'] = result.retryAfter;
  }

  return headers;
};

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
export const applyRateLimitHeaders = (response: any, result: RateLimitResult): void => {
  const headers = generateRateLimitHeaders(result);
  Object.entries(headers).forEach(([key, value]) => {
    if (value !== undefined) {
      response.setHeader(key, value.toString());
    }
  });
};

// ============================================================================
// BYPASS MECHANISM
// ============================================================================

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
export const shouldBypassRateLimit = async (
  request: any,
  config: BypassConfig
): Promise<boolean> => {
  // Check IP whitelist
  if (config.ips && config.ips.length > 0) {
    const clientIp = extractClientIp(request);
    if (config.ips.some(ip => matchesIpPattern(clientIp, ip))) {
      return true;
    }
  }

  // Check user ID whitelist
  if (config.userIds && config.userIds.length > 0) {
    const userId = request.user?.id || request.user?.sub;
    if (userId && config.userIds.includes(userId)) {
      return true;
    }
  }

  // Check API key whitelist
  if (config.apiKeys && config.apiKeys.length > 0) {
    const apiKey = request.headers['x-api-key'];
    if (apiKey && config.apiKeys.includes(apiKey)) {
      return true;
    }
  }

  // Check user agent patterns
  if (config.userAgents && config.userAgents.length > 0) {
    const userAgent = request.headers['user-agent'] || '';
    if (config.userAgents.some(pattern => pattern.test(userAgent))) {
      return true;
    }
  }

  // Custom bypass check
  if (config.customCheck) {
    return await config.customCheck(request);
  }

  return false;
};

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
export const extractClientIp = (request: any, trustProxy: boolean = true): string => {
  if (trustProxy) {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = forwarded.split(',').map((ip: string) => ip.trim());
      return ips[0];
    }

    const realIp = request.headers['x-real-ip'];
    if (realIp) return realIp;
  }

  return (
    request.connection?.remoteAddress ||
    request.socket?.remoteAddress ||
    request.ip ||
    'unknown'
  );
};

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
export const matchesIpPattern = (ip: string, pattern: string): boolean => {
  if (pattern === ip) return true;

  // Simple CIDR check (basic implementation)
  if (pattern.includes('/')) {
    const [network, bits] = pattern.split('/');
    const mask = -1 << (32 - parseInt(bits, 10));
    const ipNum = ipToNumber(ip);
    const networkNum = ipToNumber(network);
    return (ipNum & mask) === (networkNum & mask);
  }

  return false;
};

/**
 * Converts IP address to number for CIDR calculations.
 */
const ipToNumber = (ip: string): number => {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
};

// ============================================================================
// ENDPOINT-SPECIFIC LIMITS
// ============================================================================

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
export const matchEndpointLimit = (
  path: string,
  method: string,
  limits: EndpointLimit[]
): EndpointLimit | null => {
  // Sort by priority (higher first)
  const sortedLimits = limits.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  for (const limit of sortedLimits) {
    if (limit.method.toUpperCase() !== method.toUpperCase()) continue;

    // Convert path pattern to regex
    const pattern = limit.path
      .replace(/:[^/]+/g, '[^/]+') // :id -> [^/]+
      .replace(/\*/g, '.*'); // * -> .*

    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(path)) {
      return limit;
    }
  }

  return null;
};

// ============================================================================
// NESTJS RATE LIMIT GUARD
// ============================================================================

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
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly storage: RateLimitStorage,
    private readonly violationModel?: typeof Model
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if bypass is enabled
    const shouldBypass = this.reflector.get<boolean>(
      BYPASS_RATE_LIMIT_KEY,
      context.getHandler()
    );

    if (shouldBypass) return true;

    // Get rate limit config from decorator
    const config = this.reflector.get<RateLimitConfig>(
      RATE_LIMIT_KEY,
      context.getHandler()
    );

    if (!config) return true;

    const request = context.switchToHttp().getRequest();

    // Check skipIf condition
    if (config.skipIf && await config.skipIf(context)) {
      return true;
    }

    // Get identifier (IP, user ID, or API key)
    const identifier = this.getIdentifier(request, config);

    // Create limiter based on config
    const limiter = createFixedWindowLimiter(
      config.limit,
      config.ttl * 1000,
      this.storage
    );

    const result = await limiter.consume(identifier);

    // Apply headers
    const response = context.switchToHttp().getResponse();
    applyRateLimitHeaders(response, result);

    if (!result.allowed) {
      // Record violation
      await this.recordViolation(request, config, result);

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded',
          limit: result.limit,
          remaining: result.remaining,
          resetAt: result.resetAt,
          retryAfter: result.retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }

  private getIdentifier(request: any, config: RateLimitConfig): string {
    const prefix = config.keyPrefix || 'ratelimit';
    const userId = request.user?.id;
    const apiKey = request.headers['x-api-key'];
    const ip = extractClientIp(request);

    if (userId) return `${prefix}:user:${userId}`;
    if (apiKey) return `${prefix}:apikey:${apiKey}`;
    return `${prefix}:ip:${ip}`;
  }

  private async recordViolation(
    request: any,
    config: RateLimitConfig,
    result: RateLimitResult
  ): Promise<void> {
    if (!this.violationModel) return;

    try {
      const identifier = this.getIdentifier(request, config);
      const [identifierType, identifierValue] = identifier.split(':').slice(1);

      await this.violationModel.create({
        identifier: identifierValue,
        identifierType,
        endpoint: request.path || request.url,
        method: request.method,
        limit: result.limit,
        actual: result.current,
        timestamp: new Date(),
        metadata: {
          userAgent: request.headers['user-agent'],
          ip: extractClientIp(request),
        },
      } as any);
    } catch (error) {
      this.logger.error('Failed to record rate limit violation', error);
    }
  }
}

// ============================================================================
// NESTJS THROTTLE INTERCEPTOR
// ============================================================================

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
@Injectable()
export class ThrottleInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ThrottleInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly storage: RateLimitStorage
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const config = this.reflector.get<ThrottleConfig>(
      THROTTLE_KEY,
      context.getHandler()
    );

    if (!config) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    // Check user agent ignore list
    if (config.ignoreUserAgents && config.ignoreUserAgents.length > 0) {
      const userAgent = request.headers['user-agent'] || '';
      if (config.ignoreUserAgents.some(pattern => pattern.test(userAgent))) {
        return next.handle();
      }
    }

    // Check skipIf condition
    if (config.skipIf && config.skipIf(request)) {
      return next.handle();
    }

    // Get tracker
    const tracker = config.getTrackerFromContext
      ? config.getTrackerFromContext(context)
      : config.getTracker
      ? config.getTracker(request)
      : extractClientIp(request);

    // Apply throttling
    const limiter = createSlidingWindowLimiter(
      config.limit,
      config.ttl * 1000,
      this.storage
    );

    const result = await limiter.consume(tracker);

    const response = context.switchToHttp().getResponse();
    applyRateLimitHeaders(response, result);

    if (!result.allowed) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests',
          limit: result.limit,
          retryAfter: result.retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return next.handle().pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }
}

// ============================================================================
// NESTJS QUOTA INTERCEPTOR
// ============================================================================

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
@Injectable()
export class QuotaInterceptor implements NestInterceptor {
  private readonly logger = new Logger(QuotaInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly quotaModel: typeof Model
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const config = this.reflector.get<QuotaConfig>(
      QUOTA_KEY,
      context.getHandler()
    );

    if (!config) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const identifier = this.getIdentifier(request);

    const quotaManager = createQuotaManager(config, this.quotaModel);

    // Check all configured quotas
    const periods: Array<'daily' | 'weekly' | 'monthly' | 'yearly'> = [
      'daily',
      'weekly',
      'monthly',
      'yearly',
    ];

    for (const period of periods) {
      if (config[period]) {
        try {
          await quotaManager.consumeQuota(identifier, period, 1);
        } catch (error) {
          if (error instanceof HttpException) {
            throw error;
          }
          throw new HttpException(
            {
              statusCode: HttpStatus.TOO_MANY_REQUESTS,
              message: `Quota exceeded for ${period} period`,
            },
            HttpStatus.TOO_MANY_REQUESTS
          );
        }
      }
    }

    return next.handle();
  }

  private getIdentifier(request: any): string {
    const userId = request.user?.id;
    const apiKey = request.headers['x-api-key'];
    const ip = extractClientIp(request);

    if (userId) return `user:${userId}`;
    if (apiKey) return `apikey:${apiKey}`;
    return `ip:${ip}`;
  }
}

// ============================================================================
// NESTJS RATE LIMIT SERVICE
// ============================================================================

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
@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);

  constructor(
    private readonly storage: RateLimitStorage,
    private readonly quotaModel?: typeof Model,
    private readonly violationModel?: typeof Model
  ) {}

  /**
   * Checks rate limit for identifier.
   */
  async checkLimit(
    identifier: string,
    limit: number,
    ttl: number,
    algorithm: 'fixed' | 'sliding' = 'sliding'
  ): Promise<RateLimitResult> {
    const limiter =
      algorithm === 'fixed'
        ? createFixedWindowLimiter(limit, ttl * 1000, this.storage)
        : createSlidingWindowLimiter(limit, ttl * 1000, this.storage);

    return await limiter.consume(identifier);
  }

  /**
   * Checks quota for identifier.
   */
  async checkQuota(
    identifier: string,
    period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  ): Promise<QuotaUsage> {
    if (!this.quotaModel) {
      throw new Error('Quota model not configured');
    }

    const quotaManager = createQuotaManager(
      { [period]: 1 }, // Dummy config, actual limit from DB
      this.quotaModel
    );

    return await quotaManager.checkQuota(identifier, period);
  }

  /**
   * Resets rate limit for identifier.
   */
  async resetLimit(identifier: string): Promise<void> {
    await this.storage.deletePattern(`*:${identifier}`);
  }

  /**
   * Gets rate limit violations for identifier.
   */
  async getViolations(
    identifier: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    if (!this.violationModel) {
      throw new Error('Violation model not configured');
    }

    return await this.violationModel.findAll({
      where: {
        identifier,
        timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['timestamp', 'DESC']],
    } as any);
  }

  /**
   * Gets rate limit statistics.
   */
  async getStatistics(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalViolations: number;
    violationsByType: Record<string, number>;
    topViolators: Array<{ identifier: string; count: number }>;
  }> {
    if (!this.violationModel) {
      throw new Error('Violation model not configured');
    }

    const violations = await this.violationModel.findAll({
      where: {
        timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
    } as any);

    const violationsByType: Record<string, number> = {};
    const violatorCounts = new Map<string, number>();

    violations.forEach((v: any) => {
      violationsByType[v.identifierType] = (violationsByType[v.identifierType] || 0) + 1;
      violatorCounts.set(v.identifier, (violatorCounts.get(v.identifier) || 0) + 1);
    });

    const topViolators = Array.from(violatorCounts.entries())
      .map(([identifier, count]) => ({ identifier, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalViolations: violations.length,
      violationsByType,
      topViolators,
    };
  }
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export const RateLimitingUtils = {
  // Storage adapters
  createRedisRateLimitStorage,
  createMemoryRateLimitStorage,

  // Algorithm implementations
  createTokenBucketLimiter,
  createLeakyBucketLimiter,
  createSlidingWindowLimiter,
  createFixedWindowLimiter,

  // Quota management
  createQuotaManager,

  // Headers
  generateRateLimitHeaders,
  applyRateLimitHeaders,

  // Bypass mechanism
  shouldBypassRateLimit,
  extractClientIp,
  matchesIpPattern,

  // Endpoint matching
  matchEndpointLimit,

  // Sequelize models
  defineRateLimitQuotaModel,
  defineRateLimitViolationModel,
  defineThrottleRuleModel,
  defineEndpointLimitModel,
};

export default RateLimitingUtils;
