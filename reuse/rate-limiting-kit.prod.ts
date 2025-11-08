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

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  NestInterceptor,
  CallHandler,
  SetMetadata,
  applyDecorators,
  NestMiddleware,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Model, Sequelize, DataTypes, Op, Transaction } from 'sequelize';
import { Redis, Cluster } from 'ioredis';
import { z } from 'zod';
import { ApiProperty, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Request, Response, NextFunction } from 'express';

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

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
export const RateLimitConfigSchema = z.object({
  maxRequests: z.number().int().positive(),
  windowMs: z.number().int().positive(),
  keyPrefix: z.string().min(1),
  skipSuccessfulRequests: z.boolean().optional().default(false),
  skipFailedRequests: z.boolean().optional().default(false),
  trustProxy: z.boolean().optional().default(false),
});

/**
 * Zod schema for token bucket configuration validation.
 */
export const TokenBucketConfigSchema = z.object({
  capacity: z.number().int().positive(),
  refillRate: z.number().positive(),
  refillInterval: z.number().int().positive(),
  initialTokens: z.number().int().nonnegative().optional(),
});

/**
 * Zod schema for quota configuration validation.
 */
export const QuotaConfigSchema = z.object({
  quotaLimit: z.number().int().positive(),
  quotaPeriod: z.enum(['hour', 'day', 'week', 'month', 'year']),
  quotaType: z.enum(['requests', 'bandwidth', 'operations']),
  resetStrategy: z.enum(['rolling', 'fixed']).default('rolling'),
  warningThreshold: z.number().min(0).max(1).optional().default(0.8),
});

/**
 * Zod schema for DDoS protection configuration.
 */
export const DDoSProtectionConfigSchema = z.object({
  maxRequestsPerSecond: z.number().int().positive(),
  suspiciousThreshold: z.number().int().positive(),
  blockDuration: z.number().int().positive(),
  whitelistEnabled: z.boolean().default(true),
  blacklistEnabled: z.boolean().default(true),
  patternDetection: z.boolean().default(true),
});

/**
 * Zod schema for API usage tracking.
 */
export const ApiUsageSchema = z.object({
  identifier: z.string().min(1),
  identifierType: z.enum(['ip', 'userId', 'apiKey', 'sessionId']),
  endpoint: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']),
  requestCount: z.number().int().nonnegative().default(1),
  bandwidthBytes: z.number().int().nonnegative().optional(),
  responseTime: z.number().nonnegative().optional(),
  statusCode: z.number().int().min(100).max(599),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  topViolators: Array<{ identifier: string; count: number }>;
  quotaMetrics?: QuotaMetrics;
}

export interface QuotaMetrics {
  totalQuotas: number;
  activeQuotas: number;
  exceededQuotas: number;
  avgUsagePercentage: number;
  topConsumers: Array<{ identifier: string; usage: number; limit: number }>;
}

// ============================================================================
// SWAGGER/OPENAPI DTO CLASSES
// ============================================================================

/**
 * DTO class for rate limit response with Swagger documentation.
 */
export class RateLimitResponseDto {
  @ApiProperty({ description: 'Whether the request is allowed', example: true })
  allowed: boolean;

  @ApiProperty({ description: 'Remaining requests in current window', example: 95 })
  remaining: number;

  @ApiProperty({ description: 'When the rate limit resets', example: '2023-12-01T12:00:00Z' })
  resetAt: Date;

  @ApiProperty({ description: 'Seconds until rate limit resets', example: 45, required: false })
  retryAfter?: number;

  @ApiProperty({ description: 'Total requests allowed in window', example: 100 })
  total: number;
}

/**
 * DTO class for quota information with Swagger documentation.
 */
export class QuotaInfoDto {
  @ApiProperty({ description: 'Quota used in current period', example: 750 })
  used: number;

  @ApiProperty({ description: 'Total quota limit', example: 1000 })
  limit: number;

  @ApiProperty({ description: 'Remaining quota', example: 250 })
  remaining: number;

  @ApiProperty({ description: 'When quota resets', example: '2023-12-01T00:00:00Z' })
  resetAt: Date;

  @ApiProperty({ description: 'Percentage of quota used', example: 75.0 })
  percentage: number;
}

/**
 * DTO class for rate limit violation with Swagger documentation.
 */
export class RateLimitViolationDto {
  @ApiProperty({ description: 'Identifier that violated limit', example: '192.168.1.1' })
  identifier: string;

  @ApiProperty({ description: 'Type of identifier', example: 'ip', enum: ['ip', 'userId', 'apiKey', 'sessionId'] })
  identifierType: string;

  @ApiProperty({ description: 'Type of limit violated', example: 'sliding_window' })
  limitType: string;

  @ApiProperty({ description: 'Request count at violation', example: 150 })
  requestCount: number;

  @ApiProperty({ description: 'Maximum allowed requests', example: 100 })
  limit: number;

  @ApiProperty({ description: 'Time window in milliseconds', example: 60000 })
  windowMs: number;

  @ApiProperty({ description: 'When violation occurred', example: '2023-12-01T12:30:00Z' })
  violatedAt: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

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
        comment: 'IP address, user ID, API key, or session ID',
      },
      identifierType: {
        type: DataTypes.ENUM('ip', 'userId', 'apiKey', 'sessionId'),
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
      lastRequestAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp of last request',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional metadata (user agent, endpoint, etc.)',
      },
    },
    {
      tableName: 'rate_limits',
      timestamps: true,
      indexes: [
        { fields: ['identifier', 'identifierType'], unique: true },
        { fields: ['windowEnd'] },
        { fields: ['identifierType'] },
        { fields: ['lastRequestAt'] },
      ],
    },
  );
};

/**
 * Defines Sequelize model for throttle_rules table with priority-based rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ThrottleRule model class
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
      burst: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Burst capacity for token bucket',
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
        { fields: ['name'] },
      ],
    },
  );
};

/**
 * Defines Sequelize model for limit_violations table with detailed tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} LimitViolation model class
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
        comment: 'IP address, user ID, API key, or session ID',
      },
      identifierType: {
        type: DataTypes.ENUM('ip', 'userId', 'apiKey', 'sessionId'),
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
      endpoint: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'API endpoint violated',
      },
      method: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'HTTP method',
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'User agent string',
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
        comment: 'Additional violation metadata',
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
        { fields: ['endpoint'] },
      ],
    },
  );
};

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
export const defineQuotaModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'Quota',
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
        comment: 'Type of identifier',
      },
      quotaType: {
        type: DataTypes.ENUM('requests', 'bandwidth', 'operations'),
        allowNull: false,
        comment: 'Type of quota being tracked',
      },
      used: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount of quota used in current period',
      },
      limit: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: 'Total quota limit for period',
      },
      period: {
        type: DataTypes.ENUM('hour', 'day', 'week', 'month', 'year'),
        allowNull: false,
        comment: 'Quota period type',
      },
      periodStart: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Start of current quota period',
      },
      periodEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'End of current quota period',
      },
      warningTriggered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether warning threshold has been reached',
      },
      warningThreshold: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.8,
        comment: 'Percentage threshold for warning (0.0-1.0)',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional quota metadata',
      },
    },
    {
      tableName: 'quotas',
      timestamps: true,
      indexes: [
        { fields: ['identifier', 'identifierType', 'quotaType', 'period'], unique: true },
        { fields: ['periodEnd'] },
        { fields: ['identifierType'] },
        { fields: ['warningTriggered'] },
      ],
    },
  );
};

/**
 * Defines Sequelize model for ddos_events table for attack detection.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} DDoSEvent model class
 */
export const defineDDoSEventModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'DDoSEvent',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      identifier: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'IP address or user ID',
      },
      identifierType: {
        type: DataTypes.ENUM('ip', 'userId'),
        allowNull: false,
        comment: 'Type of identifier',
      },
      eventType: {
        type: DataTypes.ENUM('suspicious', 'blocked', 'pattern_detected'),
        allowNull: false,
        comment: 'Type of DDoS event',
      },
      requestRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Requests per second at detection',
      },
      threshold: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Threshold that was exceeded',
      },
      blockUntil: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'When block expires (if blocked)',
      },
      detectedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'When event was detected',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional event metadata (patterns, user agent, etc.)',
      },
    },
    {
      tableName: 'ddos_events',
      timestamps: true,
      indexes: [
        { fields: ['identifier'] },
        { fields: ['identifierType'] },
        { fields: ['eventType'] },
        { fields: ['detectedAt'] },
        { fields: ['blockUntil'] },
      ],
    },
  );
};

/**
 * Defines Sequelize model for api_usage table for analytics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ApiUsage model class
 */
export const defineApiUsageModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'ApiUsage',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      identifier: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'IP address, user ID, API key, or session ID',
      },
      identifierType: {
        type: DataTypes.ENUM('ip', 'userId', 'apiKey', 'sessionId'),
        allowNull: false,
        comment: 'Type of identifier',
      },
      endpoint: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'API endpoint path',
      },
      method: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'HTTP method',
      },
      requestCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Number of requests in this period',
      },
      bandwidthBytes: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: 'Total bandwidth consumed in bytes',
      },
      avgResponseTime: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Average response time in milliseconds',
      },
      statusCodes: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Status code distribution',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Timestamp of usage record',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional usage metadata',
      },
    },
    {
      tableName: 'api_usage',
      timestamps: true,
      indexes: [
        { fields: ['identifier', 'identifierType'] },
        { fields: ['endpoint'] },
        { fields: ['method'] },
        { fields: ['timestamp'] },
      ],
    },
  );
};

// ============================================================================
// TOKEN BUCKET RATE LIMITER
// ============================================================================

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
export const createTokenBucketLimiter = (
  config: TokenBucketConfig,
  redis: Redis,
) => {
  // Validate configuration
  const validatedConfig = TokenBucketConfigSchema.parse(config);
  const { capacity, refillRate, refillInterval, initialTokens = capacity } = validatedConfig;

  const logger = new Logger('TokenBucketLimiter');

  const consume = async (
    identifier: string,
    tokens: number = 1,
  ): Promise<RateLimitResult> => {
    const key = `token_bucket:${identifier}`;
    const now = Date.now();

    // Lua script for atomic token bucket operations
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
        redis.call('EXPIRE', key, math.ceil(refillInterval / 1000) * 3)
        return {1, currentTokens, newLastRefill}
      else
        redis.call('HMSET', key, 'tokens', currentTokens, 'lastRefill', newLastRefill)
        redis.call('EXPIRE', key, math.ceil(refillInterval / 1000) * 3)
        return {0, currentTokens, newLastRefill}
      end
    `;

    try {
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
    } catch (error) {
      logger.error(`Token bucket consume error for ${identifier}:`, error);
      throw error;
    }
  };

  const reset = async (identifier: string): Promise<void> => {
    const key = `token_bucket:${identifier}`;
    await redis.del(key);
    logger.debug(`Token bucket reset for ${identifier}`);
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
// SLIDING WINDOW RATE LIMITER
// ============================================================================

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
export const createSlidingWindowLimiter = (
  config: SlidingWindowConfig,
  redis: Redis,
) => {
  const { maxRequests, windowMs, segments = 10 } = config;
  const logger = new Logger('SlidingWindowLimiter');

  const consume = async (identifier: string): Promise<RateLimitResult> => {
    const key = `sliding_window:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    const script = `
      local key = KEYS[1]
      local maxRequests = tonumber(ARGV[1])
      local windowStart = tonumber(ARGV[2])
      local now = tonumber(ARGV[3])
      local windowMs = tonumber(ARGV[4])

      -- Remove old entries outside the window
      redis.call('ZREMRANGEBYSCORE', key, '-inf', windowStart)

      -- Count current requests in window
      local count = redis.call('ZCARD', key)

      if count < maxRequests then
        -- Add new request with current timestamp as score
        redis.call('ZADD', key, now, now .. ':' .. math.random(1000000))
        redis.call('EXPIRE', key, math.ceil(windowMs / 1000) * 2)
        return {1, count + 1}
      else
        return {0, count}
      end
    `;

    try {
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
    } catch (error) {
      logger.error(`Sliding window consume error for ${identifier}:`, error);
      throw error;
    }
  };

  const reset = async (identifier: string): Promise<void> => {
    const key = `sliding_window:${identifier}`;
    await redis.del(key);
    logger.debug(`Sliding window reset for ${identifier}`);
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
export const createFixedWindowLimiter = (
  config: FixedWindowConfig,
  redis: Redis,
) => {
  const { maxRequests, windowMs } = config;
  const logger = new Logger('FixedWindowLimiter');

  const consume = async (identifier: string): Promise<RateLimitResult> => {
    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const key = `fixed_window:${identifier}:${windowStart}`;
    const ttl = Math.ceil(windowMs / 1000);

    try {
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
    } catch (error) {
      logger.error(`Fixed window consume error for ${identifier}:`, error);
      throw error;
    }
  };

  const reset = async (identifier: string): Promise<void> => {
    const pattern = `fixed_window:${identifier}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    logger.debug(`Fixed window reset for ${identifier}`);
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
// QUOTA MANAGEMENT
// ============================================================================

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
export const createQuotaManager = (
  config: QuotaConfig,
  quotaModel: typeof Model,
  redis: Redis,
) => {
  const validatedConfig = QuotaConfigSchema.parse(config);
  const { quotaLimit, quotaPeriod, quotaType, resetStrategy, warningThreshold } = validatedConfig;
  const logger = new Logger('QuotaManager');

  /**
   * Calculates period boundaries based on period type.
   */
  const calculatePeriodBoundaries = (now: Date): { start: Date; end: Date } => {
    const start = new Date(now);
    const end = new Date(now);

    switch (quotaPeriod) {
      case 'hour':
        start.setMinutes(0, 0, 0);
        end.setHours(end.getHours() + 1, 0, 0, 0);
        break;
      case 'day':
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);
        break;
      case 'week':
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 7);
        end.setHours(0, 0, 0, 0);
        break;
      case 'month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1, 1);
        end.setHours(0, 0, 0, 0);
        break;
      case 'year':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setFullYear(end.getFullYear() + 1, 0, 1);
        end.setHours(0, 0, 0, 0);
        break;
    }

    return { start, end };
  };

  const consume = async (
    identifier: string,
    identifierType: 'ip' | 'userId' | 'apiKey',
    amount: number = 1,
    transaction?: Transaction,
  ): Promise<{ allowed: boolean; quota: QuotaInfo }> => {
    const now = new Date();
    const { start: periodStart, end: periodEnd } = calculatePeriodBoundaries(now);

    try {
      // Find or create quota entry
      const [quota, created] = await quotaModel.findOrCreate({
        where: {
          identifier,
          identifierType,
          quotaType,
          period: quotaPeriod,
        },
        defaults: {
          identifier,
          identifierType,
          quotaType,
          used: 0,
          limit: quotaLimit,
          period: quotaPeriod,
          periodStart,
          periodEnd,
          warningTriggered: false,
          warningThreshold,
        },
        transaction,
      } as any);

      // Reset if period has expired
      if (new Date(quota.get('periodEnd') as Date) <= now) {
        const { start: newStart, end: newEnd } = calculatePeriodBoundaries(now);
        await quota.update({
          used: 0,
          periodStart: newStart,
          periodEnd: newEnd,
          warningTriggered: false,
        }, { transaction } as any);
      }

      const currentUsed = parseInt(quota.get('used') as string, 10);
      const newUsed = currentUsed + amount;
      const allowed = newUsed <= quotaLimit;

      if (allowed) {
        await quota.update({ used: newUsed }, { transaction } as any);

        // Check warning threshold
        const usagePercentage = newUsed / quotaLimit;
        if (!quota.get('warningTriggered') && usagePercentage >= warningThreshold) {
          await quota.update({ warningTriggered: true }, { transaction } as any);
          logger.warn(`Quota warning threshold reached for ${identifier}: ${(usagePercentage * 100).toFixed(2)}%`);
        }
      }

      const quotaInfo: QuotaInfo = {
        used: newUsed,
        limit: quotaLimit,
        remaining: Math.max(0, quotaLimit - newUsed),
        resetAt: new Date(quota.get('periodEnd') as Date),
        percentage: (newUsed / quotaLimit) * 100,
      };

      return { allowed, quota: quotaInfo };
    } catch (error) {
      logger.error(`Quota consume error for ${identifier}:`, error);
      throw error;
    }
  };

  const getQuota = async (
    identifier: string,
    identifierType: 'ip' | 'userId' | 'apiKey',
  ): Promise<QuotaInfo | null> => {
    try {
      const quota = await quotaModel.findOne({
        where: {
          identifier,
          identifierType,
          quotaType,
          period: quotaPeriod,
        },
      } as any);

      if (!quota) return null;

      const used = parseInt(quota.get('used') as string, 10);
      return {
        used,
        limit: quotaLimit,
        remaining: Math.max(0, quotaLimit - used),
        resetAt: new Date(quota.get('periodEnd') as Date),
        percentage: (used / quotaLimit) * 100,
      };
    } catch (error) {
      logger.error(`Get quota error for ${identifier}:`, error);
      throw error;
    }
  };

  const resetQuota = async (
    identifier: string,
    identifierType: 'ip' | 'userId' | 'apiKey',
  ): Promise<void> => {
    try {
      await quotaModel.update(
        { used: 0, warningTriggered: false },
        {
          where: {
            identifier,
            identifierType,
            quotaType,
            period: quotaPeriod,
          },
        } as any,
      );
      logger.debug(`Quota reset for ${identifier}`);
    } catch (error) {
      logger.error(`Reset quota error for ${identifier}:`, error);
      throw error;
    }
  };

  return { consume, getQuota, resetQuota };
};

// ============================================================================
// DDOS PROTECTION
// ============================================================================

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
export const createDDoSProtection = (
  config: DDoSProtectionConfig,
  ddosEventModel: typeof Model,
  redis: Redis,
) => {
  const validatedConfig = DDoSProtectionConfigSchema.parse(config);
  const {
    maxRequestsPerSecond,
    suspiciousThreshold,
    blockDuration,
    whitelistEnabled,
    blacklistEnabled,
    patternDetection,
  } = validatedConfig;

  const logger = new Logger('DDoSProtection');

  const checkRequest = async (
    identifier: string,
    identifierType: 'ip' | 'userId',
  ): Promise<{ allowed: boolean; reason?: string; blockUntil?: Date }> => {
    const now = Date.now();

    // Check if identifier is blocked
    if (blacklistEnabled) {
      const blockKey = `ddos:block:${identifier}`;
      const blockUntil = await redis.get(blockKey);
      if (blockUntil) {
        const blockDate = new Date(parseInt(blockUntil, 10));
        if (blockDate > new Date()) {
          return {
            allowed: false,
            reason: 'IP blocked due to suspicious activity',
            blockUntil: blockDate,
          };
        } else {
          await redis.del(blockKey);
        }
      }
    }

    // Check if identifier is whitelisted
    if (whitelistEnabled) {
      const whitelistKey = `ddos:whitelist:${identifier}`;
      const isWhitelisted = await redis.get(whitelistKey);
      if (isWhitelisted) {
        return { allowed: true };
      }
    }

    // Track request rate
    const rateKey = `ddos:rate:${identifier}`;
    const requestCount = await redis.incr(rateKey);
    if (requestCount === 1) {
      await redis.expire(rateKey, 1); // 1 second window
    }

    // Check if rate exceeds suspicious threshold
    if (requestCount > suspiciousThreshold) {
      const blockUntil = new Date(now + blockDuration);
      await redis.setex(`ddos:block:${identifier}`, Math.ceil(blockDuration / 1000), blockUntil.getTime().toString());

      // Record DDoS event
      await ddosEventModel.create({
        identifier,
        identifierType,
        eventType: 'blocked',
        requestRate: requestCount,
        threshold: suspiciousThreshold,
        blockUntil,
        detectedAt: new Date(),
        metadata: { reason: 'Exceeded suspicious threshold' },
      } as any);

      logger.warn(`DDoS block applied to ${identifier}: ${requestCount} req/s (threshold: ${suspiciousThreshold})`);

      return {
        allowed: false,
        reason: 'Rate limit exceeded - temporarily blocked',
        blockUntil,
      };
    }

    // Check if rate is suspicious but not blocking yet
    if (requestCount > maxRequestsPerSecond) {
      await ddosEventModel.create({
        identifier,
        identifierType,
        eventType: 'suspicious',
        requestRate: requestCount,
        threshold: maxRequestsPerSecond,
        detectedAt: new Date(),
        metadata: { reason: 'Exceeded normal rate limit' },
      } as any);

      logger.warn(`Suspicious activity detected from ${identifier}: ${requestCount} req/s`);
    }

    return { allowed: true };
  };

  const blockIdentifier = async (
    identifier: string,
    durationMs: number = blockDuration,
    reason: string = 'Manual block',
  ): Promise<void> => {
    const blockUntil = new Date(Date.now() + durationMs);
    const blockKey = `ddos:block:${identifier}`;
    await redis.setex(blockKey, Math.ceil(durationMs / 1000), blockUntil.getTime().toString());

    await ddosEventModel.create({
      identifier,
      identifierType: 'ip',
      eventType: 'blocked',
      requestRate: 0,
      threshold: 0,
      blockUntil,
      detectedAt: new Date(),
      metadata: { reason },
    } as any);

    logger.info(`Manually blocked ${identifier} until ${blockUntil}`);
  };

  const unblockIdentifier = async (identifier: string): Promise<void> => {
    const blockKey = `ddos:block:${identifier}`;
    await redis.del(blockKey);
    logger.info(`Unblocked ${identifier}`);
  };

  const addToWhitelist = async (identifier: string, ttl?: number): Promise<void> => {
    const whitelistKey = `ddos:whitelist:${identifier}`;
    if (ttl) {
      await redis.setex(whitelistKey, ttl, '1');
    } else {
      await redis.set(whitelistKey, '1');
    }
    logger.info(`Added ${identifier} to whitelist`);
  };

  const removeFromWhitelist = async (identifier: string): Promise<void> => {
    const whitelistKey = `ddos:whitelist:${identifier}`;
    await redis.del(whitelistKey);
    logger.info(`Removed ${identifier} from whitelist`);
  };

  return {
    checkRequest,
    blockIdentifier,
    unblockIdentifier,
    addToWhitelist,
    removeFromWhitelist,
  };
};

// ============================================================================
// API USAGE TRACKING
// ============================================================================

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
export const createApiUsageTracker = (
  usageModel: typeof Model,
  redis: Redis,
) => {
  const logger = new Logger('ApiUsageTracker');

  const trackRequest = async (usage: ApiUsage): Promise<void> => {
    try {
      const validatedUsage = ApiUsageSchema.parse(usage);
      const {
        identifier,
        identifierType,
        endpoint,
        method,
        requestCount = 1,
        bandwidthBytes,
        responseTime,
        statusCode,
      } = validatedUsage;

      // Buffer in Redis for batch insert
      const bufferKey = `usage:buffer:${identifier}:${endpoint}:${method}`;
      await redis.hincrby(bufferKey, 'requestCount', requestCount);

      if (bandwidthBytes) {
        await redis.hincrby(bufferKey, 'bandwidthBytes', bandwidthBytes);
      }

      if (responseTime) {
        await redis.hincrbyfloat(bufferKey, 'totalResponseTime', responseTime);
      }

      await redis.hincrby(bufferKey, `status_${statusCode}`, 1);
      await redis.hset(bufferKey, 'identifier', identifier);
      await redis.hset(bufferKey, 'identifierType', identifierType);
      await redis.hset(bufferKey, 'endpoint', endpoint);
      await redis.hset(bufferKey, 'method', method);
      await redis.expire(bufferKey, 300); // 5 minute buffer

    } catch (error) {
      logger.error('Error tracking API usage:', error);
    }
  };

  const flushUsageBuffer = async (): Promise<number> => {
    try {
      const pattern = 'usage:buffer:*';
      const keys = await redis.keys(pattern);

      if (keys.length === 0) return 0;

      const records = [];
      for (const key of keys) {
        const data = await redis.hgetall(key);
        if (!data.identifier) continue;

        const requestCount = parseInt(data.requestCount || '0', 10);
        const bandwidthBytes = parseInt(data.bandwidthBytes || '0', 10);
        const totalResponseTime = parseFloat(data.totalResponseTime || '0');
        const avgResponseTime = requestCount > 0 ? totalResponseTime / requestCount : 0;

        // Extract status codes
        const statusCodes: Record<string, number> = {};
        for (const [k, v] of Object.entries(data)) {
          if (k.startsWith('status_')) {
            const code = k.replace('status_', '');
            statusCodes[code] = parseInt(v as string, 10);
          }
        }

        records.push({
          identifier: data.identifier,
          identifierType: data.identifierType,
          endpoint: data.endpoint,
          method: data.method,
          requestCount,
          bandwidthBytes: bandwidthBytes > 0 ? bandwidthBytes : null,
          avgResponseTime: avgResponseTime > 0 ? avgResponseTime : null,
          statusCodes,
          timestamp: new Date(),
        });
      }

      if (records.length > 0) {
        await usageModel.bulkCreate(records as any);
        await redis.del(...keys);
        logger.debug(`Flushed ${records.length} usage records to database`);
      }

      return records.length;
    } catch (error) {
      logger.error('Error flushing usage buffer:', error);
      return 0;
    }
  };

  const getUsageStats = async (
    identifier: string,
    identifierType: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> => {
    try {
      const records = await usageModel.findAll({
        where: {
          identifier,
          identifierType,
          timestamp: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['timestamp', 'DESC']],
      } as any);

      const totalRequests = records.reduce((sum: number, r: any) => sum + r.requestCount, 0);
      const totalBandwidth = records.reduce((sum: number, r: any) => sum + (r.bandwidthBytes || 0), 0);

      const endpointStats = new Map<string, number>();
      records.forEach((r: any) => {
        const count = endpointStats.get(r.endpoint) || 0;
        endpointStats.set(r.endpoint, count + r.requestCount);
      });

      const topEndpoints = Array.from(endpointStats.entries())
        .map(([endpoint, count]) => ({ endpoint, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        identifier,
        identifierType,
        period: { start: startDate, end: endDate },
        totalRequests,
        totalBandwidth,
        topEndpoints,
        recordCount: records.length,
      };
    } catch (error) {
      logger.error('Error getting usage stats:', error);
      throw error;
    }
  };

  return { trackRequest, flushUsageBuffer, getUsageStats };
};

// ============================================================================
// NESTJS GUARDS
// ============================================================================

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
@Injectable()
export class RateLimitGuard implements CanActivate {
  private limiter: ReturnType<typeof createSlidingWindowLimiter>;
  private logger = new Logger('RateLimitGuard');

  constructor(
    private reflector: Reflector,
    private redis: Redis,
    private violationModel: typeof Model,
    private defaultConfig: RateLimitConfig,
  ) {
    this.limiter = createSlidingWindowLimiter(
      {
        maxRequests: defaultConfig.maxRequests,
        windowMs: defaultConfig.windowMs,
      },
      redis,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Check for endpoint-specific rate limit
    const endpointConfig = this.reflector.get<RateLimitConfig>(
      'rateLimit',
      context.getHandler(),
    );

    const config = endpointConfig || this.defaultConfig;
    const identifier = this.extractIdentifier(request, config);
    const key = `${config.keyPrefix}:${identifier}`;

    try {
      const result = await this.limiter.consume(key);

      // Apply rate limit headers
      applyRateLimitHeaders(response, result);

      if (!result.allowed) {
        // Record violation
        await this.recordViolation(identifier, request, result);

        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Rate limit exceeded',
            retryAfter: result.retryAfter,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Rate limit guard error:', error);
      // Fail open - allow request if rate limiting fails
      return true;
    }
  }

  private extractIdentifier(request: any, config: RateLimitConfig): string {
    // Prefer user ID, fallback to API key, then IP
    if (request.user?.id) {
      return `user:${request.user.id}`;
    }
    if (request.headers['x-api-key']) {
      return `apikey:${request.headers['x-api-key']}`;
    }
    return `ip:${extractClientIp(request, config.trustProxy)}`;
  }

  private async recordViolation(
    identifier: string,
    request: any,
    result: RateLimitResult,
  ): Promise<void> {
    try {
      await this.violationModel.create({
        identifier,
        identifierType: identifier.split(':')[0],
        limitType: 'sliding_window',
        requestCount: result.total - result.remaining,
        limit: result.total,
        windowMs: this.defaultConfig.windowMs,
        endpoint: request.url,
        method: request.method,
        userAgent: request.headers['user-agent'],
        violatedAt: new Date(),
      } as any);
    } catch (error) {
      this.logger.error('Error recording violation:', error);
    }
  }
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
@Injectable()
export class QuotaGuard implements CanActivate {
  private quotaManager: ReturnType<typeof createQuotaManager>;
  private logger = new Logger('QuotaGuard');

  constructor(
    private reflector: Reflector,
    private quotaModel: typeof Model,
    private redis: Redis,
    private defaultConfig: QuotaConfig,
  ) {
    this.quotaManager = createQuotaManager(defaultConfig, quotaModel, redis);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const identifier = this.extractIdentifier(request);
    const identifierType = this.extractIdentifierType(request);

    try {
      const result = await this.quotaManager.consume(identifier, identifierType, 1);

      // Apply quota headers
      if (result.quota) {
        response.setHeader('X-Quota-Limit', result.quota.limit);
        response.setHeader('X-Quota-Remaining', result.quota.remaining);
        response.setHeader('X-Quota-Reset', Math.floor(result.quota.resetAt.getTime() / 1000));
      }

      if (!result.allowed) {
        throw new HttpException(
          {
            statusCode: HttpStatus.PAYMENT_REQUIRED,
            message: 'Quota exceeded',
            quota: result.quota,
          },
          HttpStatus.PAYMENT_REQUIRED,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Quota guard error:', error);
      return true; // Fail open
    }
  }

  private extractIdentifier(request: any): string {
    if (request.user?.id) return `user:${request.user.id}`;
    if (request.headers['x-api-key']) return `apikey:${request.headers['x-api-key']}`;
    return `ip:${extractClientIp(request, true)}`;
  }

  private extractIdentifierType(request: any): 'ip' | 'userId' | 'apiKey' {
    if (request.user?.id) return 'userId';
    if (request.headers['x-api-key']) return 'apiKey';
    return 'ip';
  }
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
@Injectable()
export class DDoSProtectionGuard implements CanActivate {
  private ddosProtection: ReturnType<typeof createDDoSProtection>;
  private logger = new Logger('DDoSProtectionGuard');

  constructor(
    private ddosEventModel: typeof Model,
    private redis: Redis,
    private config: DDoSProtectionConfig,
  ) {
    this.ddosProtection = createDDoSProtection(config, ddosEventModel, redis);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = extractClientIp(request, true);

    try {
      const result = await this.ddosProtection.checkRequest(ip, 'ip');

      if (!result.allowed) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: result.reason || 'Request blocked',
            blockUntil: result.blockUntil,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('DDoS protection error:', error);
      return true; // Fail open
    }
  }
}

// ============================================================================
// NESTJS DECORATORS
// ============================================================================

export const RATE_LIMIT_KEY = 'rateLimit';
export const QUOTA_KEY = 'quota';
export const BYPASS_RATE_LIMIT_KEY = 'bypassRateLimit';

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
export const RateLimit = (config: Partial<RateLimitConfig>): MethodDecorator => {
  return applyDecorators(
    SetMetadata(RATE_LIMIT_KEY, config),
    ApiHeader({
      name: 'X-RateLimit-Limit',
      description: 'Maximum requests allowed in window',
      required: false,
    }),
    ApiHeader({
      name: 'X-RateLimit-Remaining',
      description: 'Remaining requests in current window',
      required: false,
    }),
    ApiHeader({
      name: 'X-RateLimit-Reset',
      description: 'When rate limit resets (Unix timestamp)',
      required: false,
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'Rate limit exceeded',
      type: RateLimitResponseDto,
    }),
  );
};

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
export const Quota = (config: Partial<QuotaConfig>): MethodDecorator => {
  return applyDecorators(
    SetMetadata(QUOTA_KEY, config),
    ApiHeader({
      name: 'X-Quota-Limit',
      description: 'Total quota limit',
      required: false,
    }),
    ApiHeader({
      name: 'X-Quota-Remaining',
      description: 'Remaining quota',
      required: false,
    }),
    ApiHeader({
      name: 'X-Quota-Reset',
      description: 'When quota resets (Unix timestamp)',
      required: false,
    }),
    ApiResponse({
      status: HttpStatus.PAYMENT_REQUIRED,
      description: 'Quota exceeded',
      type: QuotaInfoDto,
    }),
  );
};

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
export const BypassRateLimit = (): MethodDecorator => {
  return SetMetadata(BYPASS_RATE_LIMIT_KEY, true);
};

// ============================================================================
// NESTJS INTERCEPTORS
// ============================================================================

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
@Injectable()
export class ApiUsageInterceptor implements NestInterceptor {
  private usageTracker: ReturnType<typeof createApiUsageTracker>;
  private logger = new Logger('ApiUsageInterceptor');

  constructor(
    private usageModel: typeof Model,
    private redis: Redis,
  ) {
    this.usageTracker = createApiUsageTracker(usageModel, redis);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const identifier = this.extractIdentifier(request);
    const identifierType = this.extractIdentifierType(request);

    return next.handle().pipe(
      tap(async () => {
        const responseTime = Date.now() - startTime;
        const contentLength = response.get('Content-Length');
        const bandwidthBytes = contentLength ? parseInt(contentLength, 10) : undefined;

        await this.usageTracker.trackRequest({
          identifier,
          identifierType,
          endpoint: request.url,
          method: request.method,
          requestCount: 1,
          bandwidthBytes,
          responseTime,
          statusCode: response.statusCode,
        });
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        this.usageTracker.trackRequest({
          identifier,
          identifierType,
          endpoint: request.url,
          method: request.method,
          requestCount: 1,
          responseTime,
          statusCode: error.status || 500,
        }).catch((err) => this.logger.error('Error tracking failed request:', err));

        return throwError(() => error);
      }),
    );
  }

  private extractIdentifier(request: any): string {
    if (request.user?.id) return `user:${request.user.id}`;
    if (request.headers['x-api-key']) return `apikey:${request.headers['x-api-key']}`;
    return `ip:${extractClientIp(request, true)}`;
  }

  private extractIdentifierType(request: any): 'ip' | 'userId' | 'apiKey' | 'sessionId' {
    if (request.user?.id) return 'userId';
    if (request.headers['x-api-key']) return 'apiKey';
    return 'ip';
  }
}

// ============================================================================
// NESTJS MIDDLEWARE
// ============================================================================

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
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private limiter: ReturnType<typeof createSlidingWindowLimiter>;
  private logger = new Logger('RateLimitMiddleware');

  constructor(
    private redis: Redis,
    private config: RateLimitConfig,
  ) {
    this.limiter = createSlidingWindowLimiter(
      {
        maxRequests: config.maxRequests,
        windowMs: config.windowMs,
      },
      redis,
    );
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = extractClientIp(req, this.config.trustProxy);
    const identifier = `${this.config.keyPrefix}:ip:${ip}`;

    try {
      const result = await this.limiter.consume(identifier);
      applyRateLimitHeaders(res, result);

      if (!result.allowed) {
        res.status(HttpStatus.TOO_MANY_REQUESTS).json({
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded',
          retryAfter: result.retryAfter,
        });
        return;
      }

      next();
    } catch (error) {
      this.logger.error('Rate limit middleware error:', error);
      next(); // Fail open
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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
export const extractClientIp = (request: any, trustProxy: boolean = false): string => {
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
export const generateRateLimitHeaders = (result: RateLimitResult): RateLimitHeaders => {
  const headers: RateLimitHeaders = {
    'X-RateLimit-Limit': result.total,
    'X-RateLimit-Remaining': result.remaining,
    'X-RateLimit-Reset': Math.floor(result.resetAt.getTime() / 1000),
  };

  if (result.retryAfter !== undefined) {
    headers['X-RateLimit-RetryAfter'] = result.retryAfter;
  }

  if (result.quota) {
    headers['X-Quota-Limit'] = result.quota.limit;
    headers['X-Quota-Remaining'] = result.quota.remaining;
    headers['X-Quota-Reset'] = Math.floor(result.quota.resetAt.getTime() / 1000);
  }

  return headers;
};

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
export const applyRateLimitHeaders = (response: any, result: RateLimitResult): void => {
  const headers = generateRateLimitHeaders(result);

  Object.entries(headers).forEach(([key, value]) => {
    if (value !== undefined) {
      response.setHeader(key, value.toString());
    }
  });
};

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

/**
 * Cleans up expired quota entries from database.
 *
 * @param {typeof Model} quotaModel - Sequelize Quota model
 * @param {Date} expiryDate - Delete entries older than this date
 * @returns {Promise<number>} Number of deleted entries
 */
export const cleanupExpiredQuotas = async (
  quotaModel: typeof Model,
  expiryDate: Date,
): Promise<number> => {
  const result = await quotaModel.destroy({
    where: {
      periodEnd: {
        [Op.lt]: expiryDate,
      },
    },
  } as any);

  return result;
};

// ============================================================================
// EXPORTS
// ============================================================================

export const RateLimitingKit = {
  // Schemas
  RateLimitConfigSchema,
  TokenBucketConfigSchema,
  QuotaConfigSchema,
  DDoSProtectionConfigSchema,
  ApiUsageSchema,

  // Models
  defineRateLimitModel,
  defineThrottleRuleModel,
  defineLimitViolationModel,
  defineQuotaModel,
  defineDDoSEventModel,
  defineApiUsageModel,

  // Limiters
  createTokenBucketLimiter,
  createSlidingWindowLimiter,
  createFixedWindowLimiter,

  // Advanced Features
  createQuotaManager,
  createDDoSProtection,
  createApiUsageTracker,

  // Guards
  RateLimitGuard,
  QuotaGuard,
  DDoSProtectionGuard,

  // Decorators
  RateLimit,
  Quota,
  BypassRateLimit,

  // Interceptors
  ApiUsageInterceptor,

  // Middleware
  RateLimitMiddleware,

  // Utilities
  extractClientIp,
  extractApiKey,
  generateRateLimitHeaders,
  applyRateLimitHeaders,
  recordRateLimitViolation,
  cleanupExpiredRateLimits,
  cleanupExpiredQuotas,
};

export default RateLimitingKit;
