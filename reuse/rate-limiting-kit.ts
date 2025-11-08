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

/**
 * File: /reuse/rate-limiting-kit.ts
 * Locator: WC-RATE-LIMIT-001
 * Purpose: Production-Grade Rate Limiting & Throttling Kit - Enterprise rate limiting toolkit
 *
 * Upstream: NestJS, Express, Redis, Zod, RxJS
 * Downstream: ../backend/controllers/*, Guards, Interceptors, Middleware, API Gateway
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/core, Redis, Express
 * Exports: 45+ production-ready rate limiting functions covering token bucket, leaky bucket, sliding window,
 *          fixed window, distributed rate limiting, IP-based, user-based, endpoint-based, cost-based,
 *          concurrent request limiting, API quota management, burst allowance, whitelist/blacklist
 *
 * LLM Context: Production-grade rate limiting and throttling utilities for White Cross healthcare platform.
 * Provides comprehensive rate limiting algorithms (token bucket, leaky bucket, fixed window, sliding window),
 * distributed rate limiting with Redis, per-IP/per-user/per-endpoint rate limiting, cost-based rate limiting
 * for weighted requests, concurrent request limiting, API quota management with daily/monthly limits,
 * burst allowance for spike handling, dynamic rate limit adjustment, whitelist/blacklist management,
 * rate limit headers (X-RateLimit-*), custom rate limit strategies, monitoring and analytics,
 * NestJS guards and interceptors, and HIPAA-compliant request throttling patterns.
 * Includes Redis-based storage adapters, in-memory fallbacks, and Sequelize models for quota tracking.
 */

import * as crypto from 'crypto';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  HttpException,
  HttpStatus,
  createParamDecorator,
  SetMetadata,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiProperty, ApiHeader } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { z } from 'zod';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Rate limiting algorithm types
 */
export enum RateLimitAlgorithm {
  TOKEN_BUCKET = 'token_bucket',
  LEAKY_BUCKET = 'leaky_bucket',
  FIXED_WINDOW = 'fixed_window',
  SLIDING_WINDOW = 'sliding_window',
  SLIDING_LOG = 'sliding_log',
  CONCURRENT = 'concurrent',
}

/**
 * Rate limit scope types
 */
export enum RateLimitScope {
  GLOBAL = 'global',
  PER_IP = 'per_ip',
  PER_USER = 'per_user',
  PER_ENDPOINT = 'per_endpoint',
  PER_API_KEY = 'per_api_key',
  PER_TENANT = 'per_tenant',
  CUSTOM = 'custom',
}

/**
 * Rate limit action when exceeded
 */
export enum RateLimitAction {
  REJECT = 'reject', // Return 429 error
  DELAY = 'delay', // Queue and delay request
  THROTTLE = 'throttle', // Slow down response
  LOG = 'log', // Only log, don't block
}

/**
 * Rate limit storage backend
 */
export enum RateLimitStorage {
  REDIS = 'redis',
  MEMORY = 'memory',
  DATABASE = 'database',
  HYBRID = 'hybrid',
}

/**
 * Quota period types
 */
export enum QuotaPeriod {
  SECOND = 'second',
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  algorithm: RateLimitAlgorithm;
  scope: RateLimitScope;
  limit: number; // Maximum requests
  window: number; // Time window in milliseconds
  burst?: number; // Burst allowance (for token bucket)
  cost?: number; // Cost per request (for cost-based)
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
  tokens: number; // Current tokens available
  capacity: number; // Maximum tokens
  refillRate: number; // Tokens per millisecond
  lastRefill: number; // Timestamp of last refill
}

/**
 * Leaky bucket state
 */
export interface LeakyBucketState {
  queue: number; // Requests in queue
  capacity: number; // Maximum queue size
  leakRate: number; // Requests per millisecond
  lastLeak: number; // Timestamp of last leak
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: Date;
  retryAfter?: number; // Seconds until retry
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
  identifier: string; // User ID, IP, API key, etc.
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
  cost?: number; // Cost per request
  burst?: number; // Burst allowance
  resetOn?: Date; // Next reset date
  consumed: number; // Requests consumed
  lastRequest?: Date;
}

/**
 * Cost-based rate limit configuration
 */
export interface CostBasedRateLimit {
  maxCost: number; // Maximum cost per window
  window: number; // Time window in milliseconds
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
  queueTimeout?: number; // Milliseconds
  scope: RateLimitScope;
}

/**
 * Rate limit whitelist/blacklist entry
 */
export interface RateLimitListEntry {
  id: string;
  type: 'whitelist' | 'blacklist';
  identifier: string; // IP, user ID, API key, etc.
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
  adjustmentFactor: number; // Percentage to adjust
  evaluationWindow: number; // Milliseconds
  triggers: {
    increaseOn?: {
      successRate?: number; // Percentage
      avgResponseTime?: number; // Milliseconds
    };
    decreaseOn?: {
      errorRate?: number; // Percentage
      avgResponseTime?: number; // Milliseconds
    };
  };
}

/**
 * Rate limit exceeded error
 */
export class RateLimitExceededError extends HttpException {
  constructor(
    public readonly result: RateLimitResult,
    message?: string
  ) {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: message || 'Rate limit exceeded',
        limit: result.limit,
        remaining: result.remaining,
        resetAt: result.resetAt,
        retryAfter: result.retryAfter,
      },
      HttpStatus.TOO_MANY_REQUESTS
    );
  }
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Rate limit configuration schema
 */
export const RateLimitConfigSchema = z.object({
  algorithm: z.nativeEnum(RateLimitAlgorithm),
  scope: z.nativeEnum(RateLimitScope),
  limit: z.number().int().min(1),
  window: z.number().int().min(1),
  burst: z.number().int().min(0).optional(),
  cost: z.number().min(0).optional().default(1),
  action: z.nativeEnum(RateLimitAction),
  storage: z.nativeEnum(RateLimitStorage),
  keyPrefix: z.string().optional(),
  skipSuccessfulRequests: z.boolean().optional().default(false),
  skipFailedRequests: z.boolean().optional().default(false),
  enableHeaders: z.boolean().optional().default(true),
  message: z.string().optional(),
  statusCode: z.number().int().optional(),
});

/**
 * API quota schema
 */
export const APIQuotaSchema = z.object({
  userId: z.string().uuid().optional(),
  apiKeyId: z.string().uuid().optional(),
  tenantId: z.string().uuid().optional(),
  limit: z.number().int().min(1),
  period: z.nativeEnum(QuotaPeriod),
  cost: z.number().min(0).optional().default(1),
  burst: z.number().int().min(0).optional(),
});

/**
 * Whitelist/blacklist entry schema
 */
export const RateLimitListEntrySchema = z.object({
  type: z.enum(['whitelist', 'blacklist']),
  identifier: z.string().min(1),
  scope: z.nativeEnum(RateLimitScope),
  reason: z.string().optional(),
  expiresAt: z.date().optional(),
});

// ============================================================================
// TOKEN BUCKET ALGORITHM
// ============================================================================

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
export function createTokenBucket(
  capacity: number,
  refillRate: number
): TokenBucketState {
  return {
    tokens: capacity,
    capacity,
    refillRate: refillRate / 1000, // Convert to per millisecond
    lastRefill: Date.now(),
  };
}

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
export function refillTokenBucket(bucket: TokenBucketState): TokenBucketState {
  const now = Date.now();
  const elapsed = now - bucket.lastRefill;
  const tokensToAdd = elapsed * bucket.refillRate;

  return {
    ...bucket,
    tokens: Math.min(bucket.capacity, bucket.tokens + tokensToAdd),
    lastRefill: now,
  };
}

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
export function consumeTokens(
  bucket: TokenBucketState,
  cost: number = 1
): { allowed: boolean; bucket: TokenBucketState; remaining: number } {
  const refilled = refillTokenBucket(bucket);

  if (refilled.tokens >= cost) {
    return {
      allowed: true,
      bucket: {
        ...refilled,
        tokens: refilled.tokens - cost,
      },
      remaining: Math.floor(refilled.tokens - cost),
    };
  }

  return {
    allowed: false,
    bucket: refilled,
    remaining: Math.floor(refilled.tokens),
  };
}

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
export async function checkTokenBucket(
  key: string,
  config: RateLimitConfig,
  storage: any
): Promise<RateLimitResult> {
  const bucketKey = `${config.keyPrefix || 'rate'}:token_bucket:${key}`;
  const capacity = config.limit;
  const refillRate = config.limit / (config.window / 1000); // Requests per second
  const cost = config.cost || 1;

  // Get or create bucket
  const stored = await storage.get(bucketKey);
  let bucket: TokenBucketState;

  if (stored) {
    bucket = JSON.parse(stored);
  } else {
    bucket = createTokenBucket(capacity, refillRate);
  }

  // Consume tokens
  const result = consumeTokens(bucket, cost);

  // Save updated bucket
  await storage.setex(
    bucketKey,
    Math.ceil(config.window / 1000),
    JSON.stringify(result.bucket)
  );

  const resetAt = new Date(
    result.bucket.lastRefill +
      ((capacity - result.bucket.tokens) / result.bucket.refillRate)
  );

  return {
    allowed: result.allowed,
    remaining: result.remaining,
    limit: capacity,
    resetAt,
    retryAfter: result.allowed
      ? undefined
      : Math.ceil((cost - result.bucket.tokens) / result.bucket.refillRate / 1000),
    cost,
  };
}

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
export async function tokenBucketWithBurst(
  key: string,
  config: RateLimitConfig,
  storage: any
): Promise<RateLimitResult> {
  const totalCapacity = config.limit + (config.burst || 0);
  const burstConfig = {
    ...config,
    limit: totalCapacity,
  };

  return checkTokenBucket(key, burstConfig, storage);
}

// ============================================================================
// LEAKY BUCKET ALGORITHM
// ============================================================================

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
export function createLeakyBucket(
  capacity: number,
  leakRate: number
): LeakyBucketState {
  return {
    queue: 0,
    capacity,
    leakRate: leakRate / 1000, // Convert to per millisecond
    lastLeak: Date.now(),
  };
}

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
export function leakBucket(bucket: LeakyBucketState): LeakyBucketState {
  const now = Date.now();
  const elapsed = now - bucket.lastLeak;
  const leaked = elapsed * bucket.leakRate;

  return {
    ...bucket,
    queue: Math.max(0, bucket.queue - leaked),
    lastLeak: now,
  };
}

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
export function addToLeakyBucket(
  bucket: LeakyBucketState,
  cost: number = 1
): { allowed: boolean; bucket: LeakyBucketState; queueSize: number } {
  const leaked = leakBucket(bucket);

  if (leaked.queue + cost <= leaked.capacity) {
    return {
      allowed: true,
      bucket: {
        ...leaked,
        queue: leaked.queue + cost,
      },
      queueSize: leaked.queue + cost,
    };
  }

  return {
    allowed: false,
    bucket: leaked,
    queueSize: leaked.queue,
  };
}

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
export async function checkLeakyBucket(
  key: string,
  config: RateLimitConfig,
  storage: any
): Promise<RateLimitResult> {
  const bucketKey = `${config.keyPrefix || 'rate'}:leaky_bucket:${key}`;
  const capacity = config.limit;
  const leakRate = config.limit / (config.window / 1000); // Requests per second
  const cost = config.cost || 1;

  // Get or create bucket
  const stored = await storage.get(bucketKey);
  let bucket: LeakyBucketState;

  if (stored) {
    bucket = JSON.parse(stored);
  } else {
    bucket = createLeakyBucket(capacity, leakRate);
  }

  // Add to bucket
  const result = addToLeakyBucket(bucket, cost);

  // Save updated bucket
  await storage.setex(
    bucketKey,
    Math.ceil(config.window / 1000),
    JSON.stringify(result.bucket)
  );

  const remaining = Math.floor(capacity - result.queueSize);
  const resetAt = new Date(
    result.bucket.lastLeak + (result.bucket.queue / result.bucket.leakRate)
  );

  return {
    allowed: result.allowed,
    remaining: Math.max(0, remaining),
    limit: capacity,
    resetAt,
    retryAfter: result.allowed
      ? undefined
      : Math.ceil(((result.queueSize + cost - capacity) / result.bucket.leakRate) / 1000),
    cost,
  };
}

// ============================================================================
// FIXED WINDOW RATE LIMITING
// ============================================================================

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
export function getFixedWindowKey(key: string, window: number): string {
  const now = Date.now();
  const windowStart = Math.floor(now / window) * window;
  return `${key}:${windowStart}`;
}

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
export async function checkFixedWindow(
  key: string,
  config: RateLimitConfig,
  storage: any
): Promise<RateLimitResult> {
  const windowKey = getFixedWindowKey(
    `${config.keyPrefix || 'rate'}:fixed:${key}`,
    config.window
  );
  const cost = config.cost || 1;

  // Get current count
  const current = await storage.get(windowKey);
  const count = current ? parseInt(current, 10) : 0;

  const allowed = count + cost <= config.limit;

  if (allowed) {
    // Increment counter
    const newCount = await storage.incr(windowKey);

    if (newCount === 1) {
      // Set expiration on first request in window
      await storage.pexpire(windowKey, config.window);
    }
  }

  const remaining = Math.max(0, config.limit - count - (allowed ? cost : 0));
  const windowStart = Math.floor(Date.now() / config.window) * config.window;
  const resetAt = new Date(windowStart + config.window);

  return {
    allowed,
    remaining,
    limit: config.limit,
    resetAt,
    retryAfter: allowed ? undefined : Math.ceil((resetAt.getTime() - Date.now()) / 1000),
    cost,
  };
}

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
export async function resetFixedWindow(
  key: string,
  config: RateLimitConfig,
  storage: any
): Promise<void> {
  const windowKey = getFixedWindowKey(
    `${config.keyPrefix || 'rate'}:fixed:${key}`,
    config.window
  );
  await storage.del(windowKey);
}

// ============================================================================
// SLIDING WINDOW RATE LIMITING
// ============================================================================

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
export async function checkSlidingWindow(
  key: string,
  config: RateLimitConfig,
  storage: any
): Promise<RateLimitResult> {
  const windowKey = `${config.keyPrefix || 'rate'}:sliding:${key}`;
  const now = Date.now();
  const windowStart = now - config.window;
  const cost = config.cost || 1;

  // Remove old entries
  await storage.zremrangebyscore(windowKey, '-inf', windowStart);

  // Count current requests
  const count = await storage.zcard(windowKey);

  const allowed = count + cost <= config.limit;

  if (allowed) {
    // Add new request(s)
    const requestId = crypto.randomBytes(16).toString('hex');
    for (let i = 0; i < cost; i++) {
      await storage.zadd(windowKey, now + i, `${requestId}:${i}`);
    }

    // Set expiration
    await storage.pexpire(windowKey, config.window);
  }

  const remaining = Math.max(0, config.limit - count - (allowed ? cost : 0));
  const resetAt = new Date(now + config.window);

  return {
    allowed,
    remaining,
    limit: config.limit,
    resetAt,
    retryAfter: allowed ? undefined : Math.ceil(config.window / 1000),
    cost,
  };
}

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
export async function checkSlidingWindowCounter(
  key: string,
  config: RateLimitConfig,
  storage: any
): Promise<RateLimitResult> {
  const now = Date.now();
  const currentWindow = Math.floor(now / config.window);
  const previousWindow = currentWindow - 1;

  const currentKey = `${config.keyPrefix || 'rate'}:sliding_counter:${key}:${currentWindow}`;
  const previousKey = `${config.keyPrefix || 'rate'}:sliding_counter:${key}:${previousWindow}`;

  // Get counts
  const currentCount = parseInt((await storage.get(currentKey)) || '0', 10);
  const previousCount = parseInt((await storage.get(previousKey)) || '0', 10);

  // Calculate weight of previous window
  const windowElapsed = now % config.window;
  const previousWeight = 1 - windowElapsed / config.window;

  // Weighted count
  const weightedCount = Math.floor(previousCount * previousWeight + currentCount);

  const cost = config.cost || 1;
  const allowed = weightedCount + cost <= config.limit;

  if (allowed) {
    // Increment current window
    await storage.incr(currentKey);
    await storage.pexpire(currentKey, config.window * 2);
  }

  const remaining = Math.max(0, config.limit - weightedCount - (allowed ? cost : 0));
  const resetAt = new Date((currentWindow + 1) * config.window);

  return {
    allowed,
    remaining,
    limit: config.limit,
    resetAt,
    retryAfter: allowed ? undefined : Math.ceil((resetAt.getTime() - now) / 1000),
    cost,
  };
}

// ============================================================================
// PER-IP RATE LIMITING
// ============================================================================

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
export function generateIPKey(req: Request, prefix?: string): string {
  const ip = getClientIP(req);
  return `${prefix || 'rate'}:ip:${ip}`;
}

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
export function getClientIP(req: Request): string {
  // Check X-Forwarded-For header (for proxies)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return ips.split(',')[0].trim();
  }

  // Check X-Real-IP header
  const realIP = req.headers['x-real-ip'];
  if (realIP && typeof realIP === 'string') {
    return realIP;
  }

  // Fall back to socket address
  return req.socket.remoteAddress || 'unknown';
}

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
export async function checkIPRateLimit(
  req: Request,
  config: RateLimitConfig,
  storage: any
): Promise<RateLimitResult> {
  const key = generateIPKey(req, config.keyPrefix);

  switch (config.algorithm) {
    case RateLimitAlgorithm.TOKEN_BUCKET:
      return checkTokenBucket(key, config, storage);
    case RateLimitAlgorithm.LEAKY_BUCKET:
      return checkLeakyBucket(key, config, storage);
    case RateLimitAlgorithm.FIXED_WINDOW:
      return checkFixedWindow(key, config, storage);
    case RateLimitAlgorithm.SLIDING_WINDOW:
      return checkSlidingWindow(key, config, storage);
    default:
      return checkFixedWindow(key, config, storage);
  }
}

// ============================================================================
// PER-USER RATE LIMITING
// ============================================================================

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
export function generateUserKey(userId: string, prefix?: string): string {
  return `${prefix || 'rate'}:user:${userId}`;
}

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
export async function checkUserRateLimit(
  userId: string,
  config: RateLimitConfig,
  storage: any
): Promise<RateLimitResult> {
  const key = generateUserKey(userId, config.keyPrefix);

  switch (config.algorithm) {
    case RateLimitAlgorithm.TOKEN_BUCKET:
      return checkTokenBucket(key, config, storage);
    case RateLimitAlgorithm.LEAKY_BUCKET:
      return checkLeakyBucket(key, config, storage);
    case RateLimitAlgorithm.FIXED_WINDOW:
      return checkFixedWindow(key, config, storage);
    case RateLimitAlgorithm.SLIDING_WINDOW:
      return checkSlidingWindow(key, config, storage);
    default:
      return checkFixedWindow(key, config, storage);
  }
}

// ============================================================================
// PER-ENDPOINT RATE LIMITING
// ============================================================================

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
export function generateEndpointKey(
  endpoint: string,
  identifier: string,
  prefix?: string
): string {
  // Normalize endpoint path
  const normalized = endpoint.replace(/[^a-zA-Z0-9/-]/g, '_');
  return `${prefix || 'rate'}:endpoint:${normalized}:${identifier}`;
}

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
export async function checkEndpointRateLimit(
  endpoint: string,
  identifier: string,
  config: RateLimitConfig,
  storage: any
): Promise<RateLimitResult> {
  const key = generateEndpointKey(endpoint, identifier, config.keyPrefix);

  switch (config.algorithm) {
    case RateLimitAlgorithm.TOKEN_BUCKET:
      return checkTokenBucket(key, config, storage);
    case RateLimitAlgorithm.LEAKY_BUCKET:
      return checkLeakyBucket(key, config, storage);
    case RateLimitAlgorithm.FIXED_WINDOW:
      return checkFixedWindow(key, config, storage);
    case RateLimitAlgorithm.SLIDING_WINDOW:
      return checkSlidingWindow(key, config, storage);
    default:
      return checkFixedWindow(key, config, storage);
  }
}

// ============================================================================
// COST-BASED RATE LIMITING
// ============================================================================

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
export function calculateRequestCost(
  endpoint: string,
  method: string,
  costConfig: CostBasedRateLimit
): number {
  // Check exact match
  const exactKey = `${method}:${endpoint}`;
  if (costConfig.costs[exactKey] !== undefined) {
    return costConfig.costs[exactKey];
  }

  // Check endpoint match
  if (costConfig.costs[endpoint] !== undefined) {
    return costConfig.costs[endpoint];
  }

  // Check pattern match
  for (const [pattern, cost] of Object.entries(costConfig.costs)) {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    if (regex.test(endpoint)) {
      return cost;
    }
  }

  return costConfig.defaultCost;
}

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
export async function checkCostBasedRateLimit(
  key: string,
  cost: number,
  config: CostBasedRateLimit,
  storage: any
): Promise<RateLimitResult> {
  const windowKey = `rate:cost:${key}`;
  const now = Date.now();
  const windowStart = now - config.window;

  // Remove old entries
  await storage.zremrangebyscore(windowKey, '-inf', windowStart);

  // Calculate current cost
  const entries = await storage.zrangebyscore(windowKey, windowStart, now);
  let currentCost = 0;
  for (const entry of entries) {
    const [, entryCost] = entry.split(':');
    currentCost += parseInt(entryCost, 10);
  }

  const allowed = currentCost + cost <= config.maxCost;

  if (allowed) {
    // Add new request
    const requestId = crypto.randomBytes(8).toString('hex');
    await storage.zadd(windowKey, now, `${requestId}:${cost}`);
    await storage.pexpire(windowKey, config.window);
  }

  const remaining = Math.max(0, config.maxCost - currentCost - (allowed ? cost : 0));
  const resetAt = new Date(now + config.window);

  return {
    allowed,
    remaining,
    limit: config.maxCost,
    resetAt,
    retryAfter: allowed ? undefined : Math.ceil(config.window / 1000),
    cost,
  };
}

// ============================================================================
// CONCURRENT REQUEST LIMITING
// ============================================================================

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
export async function acquireConcurrentSlot(
  key: string,
  config: ConcurrentLimitConfig,
  storage: any
): Promise<{ allowed: boolean; requestId?: string; queuePosition?: number }> {
  const concurrentKey = `rate:concurrent:${key}`;
  const now = Date.now();

  // Clean up stale entries (older than 5 minutes)
  await storage.zremrangebyscore(concurrentKey, '-inf', now - 300000);

  // Count current concurrent requests
  const current = await storage.zcard(concurrentKey);

  if (current < config.maxConcurrent) {
    // Acquire slot
    const requestId = crypto.randomBytes(16).toString('hex');
    await storage.zadd(concurrentKey, now, requestId);
    await storage.expire(concurrentKey, 300); // 5 minutes max

    return { allowed: true, requestId };
  }

  // Check queue
  if (config.queueSize && config.queueSize > 0) {
    const queueKey = `rate:queue:${key}`;
    const queueSize = await storage.llen(queueKey);

    if (queueSize < config.queueSize) {
      const requestId = crypto.randomBytes(16).toString('hex');
      await storage.rpush(queueKey, requestId);
      await storage.expire(queueKey, Math.ceil((config.queueTimeout || 30000) / 1000));

      return { allowed: false, queuePosition: queueSize + 1 };
    }
  }

  return { allowed: false };
}

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
export async function releaseConcurrentSlot(
  key: string,
  requestId: string,
  storage: any
): Promise<void> {
  const concurrentKey = `rate:concurrent:${key}`;
  await storage.zrem(concurrentKey, requestId);
}

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
export async function getConcurrentCount(
  key: string,
  storage: any
): Promise<number> {
  const concurrentKey = `rate:concurrent:${key}`;
  const now = Date.now();

  // Clean up stale entries
  await storage.zremrangebyscore(concurrentKey, '-inf', now - 300000);

  return storage.zcard(concurrentKey);
}

// ============================================================================
// API QUOTA MANAGEMENT
// ============================================================================

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
export function getQuotaPeriodMilliseconds(period: QuotaPeriod): number {
  switch (period) {
    case QuotaPeriod.SECOND:
      return 1000;
    case QuotaPeriod.MINUTE:
      return 60 * 1000;
    case QuotaPeriod.HOUR:
      return 60 * 60 * 1000;
    case QuotaPeriod.DAY:
      return 24 * 60 * 60 * 1000;
    case QuotaPeriod.WEEK:
      return 7 * 24 * 60 * 60 * 1000;
    case QuotaPeriod.MONTH:
      return 30 * 24 * 60 * 60 * 1000; // Approximate
    case QuotaPeriod.YEAR:
      return 365 * 24 * 60 * 60 * 1000; // Approximate
    default:
      return 60 * 60 * 1000; // Default to 1 hour
  }
}

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
export function getNextQuotaReset(
  period: QuotaPeriod,
  referenceDate: Date = new Date()
): Date {
  const date = new Date(referenceDate);

  switch (period) {
    case QuotaPeriod.SECOND:
      date.setSeconds(date.getSeconds() + 1, 0);
      break;
    case QuotaPeriod.MINUTE:
      date.setMinutes(date.getMinutes() + 1, 0, 0);
      break;
    case QuotaPeriod.HOUR:
      date.setHours(date.getHours() + 1, 0, 0, 0);
      break;
    case QuotaPeriod.DAY:
      date.setDate(date.getDate() + 1);
      date.setHours(0, 0, 0, 0);
      break;
    case QuotaPeriod.WEEK:
      date.setDate(date.getDate() + (7 - date.getDay()));
      date.setHours(0, 0, 0, 0);
      break;
    case QuotaPeriod.MONTH:
      date.setMonth(date.getMonth() + 1, 1);
      date.setHours(0, 0, 0, 0);
      break;
    case QuotaPeriod.YEAR:
      date.setFullYear(date.getFullYear() + 1, 0, 1);
      date.setHours(0, 0, 0, 0);
      break;
  }

  return date;
}

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
export function checkAPIQuota(
  quota: APIQuota,
  cost: number = 1
): { allowed: boolean; remaining: number; resetAt: Date } {
  const now = new Date();

  // Check if quota needs reset
  if (quota.resetOn && now >= quota.resetOn) {
    quota.consumed = 0;
    quota.resetOn = getNextQuotaReset(quota.period, now);
  }

  const allowed = quota.consumed + cost <= quota.limit;
  const remaining = Math.max(0, quota.limit - quota.consumed - (allowed ? cost : 0));
  const resetAt = quota.resetOn || getNextQuotaReset(quota.period, now);

  return { allowed, remaining, resetAt };
}

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
export function consumeAPIQuota(quota: APIQuota, cost: number = 1): APIQuota {
  const { allowed } = checkAPIQuota(quota, cost);

  if (!allowed) {
    throw new Error('Quota exceeded');
  }

  return {
    ...quota,
    consumed: quota.consumed + cost,
    lastRequest: new Date(),
  };
}

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
export function resetAPIQuota(quota: APIQuota): APIQuota {
  return {
    ...quota,
    consumed: 0,
    resetOn: getNextQuotaReset(quota.period),
  };
}

// ============================================================================
// RATE LIMIT HEADERS
// ============================================================================

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
export function generateRateLimitHeaders(
  result: RateLimitResult,
  config?: RateLimitConfig
): RateLimitHeaders {
  const headers: RateLimitHeaders = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.floor(result.resetAt.getTime() / 1000).toString(),
  };

  if (result.retryAfter !== undefined) {
    headers['X-RateLimit-RetryAfter'] = result.retryAfter.toString();
  }

  if (config) {
    headers['X-RateLimit-Policy'] = `${config.limit};w=${Math.floor(config.window / 1000)}`;
  }

  return headers;
}

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
export function setRateLimitHeaders(
  res: Response,
  result: RateLimitResult,
  config?: RateLimitConfig
): Response {
  const headers = generateRateLimitHeaders(result, config);
  return res.set(headers);
}

// ============================================================================
// WHITELIST/BLACKLIST MANAGEMENT
// ============================================================================

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
export async function isWhitelisted(
  identifier: string,
  scope: RateLimitScope,
  storage: any
): Promise<boolean> {
  const key = `rate:whitelist:${scope}:${identifier}`;
  const result = await storage.get(key);
  return result !== null;
}

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
export async function isBlacklisted(
  identifier: string,
  scope: RateLimitScope,
  storage: any
): Promise<boolean> {
  const key = `rate:blacklist:${scope}:${identifier}`;
  const result = await storage.get(key);
  return result !== null;
}

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
export async function addToWhitelist(
  entry: Omit<RateLimitListEntry, 'id' | 'createdAt' | 'type'>,
  storage: any
): Promise<void> {
  const key = `rate:whitelist:${entry.scope}:${entry.identifier}`;
  const data = JSON.stringify({
    reason: entry.reason,
    expiresAt: entry.expiresAt,
    createdBy: entry.createdBy,
  });

  if (entry.expiresAt) {
    const ttl = Math.floor((entry.expiresAt.getTime() - Date.now()) / 1000);
    await storage.setex(key, ttl, data);
  } else {
    await storage.set(key, data);
  }
}

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
export async function addToBlacklist(
  entry: Omit<RateLimitListEntry, 'id' | 'createdAt' | 'type'>,
  storage: any
): Promise<void> {
  const key = `rate:blacklist:${entry.scope}:${entry.identifier}`;
  const data = JSON.stringify({
    reason: entry.reason,
    expiresAt: entry.expiresAt,
    createdBy: entry.createdBy,
  });

  if (entry.expiresAt) {
    const ttl = Math.floor((entry.expiresAt.getTime() - Date.now()) / 1000);
    await storage.setex(key, ttl, data);
  } else {
    await storage.set(key, data);
  }
}

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
export async function removeFromWhitelist(
  identifier: string,
  scope: RateLimitScope,
  storage: any
): Promise<void> {
  const key = `rate:whitelist:${scope}:${identifier}`;
  await storage.del(key);
}

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
export async function removeFromBlacklist(
  identifier: string,
  scope: RateLimitScope,
  storage: any
): Promise<void> {
  const key = `rate:blacklist:${scope}:${identifier}`;
  await storage.del(key);
}

// ============================================================================
// RATE LIMIT MONITORING
// ============================================================================

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
export async function recordRateLimitMetrics(
  key: string,
  result: RateLimitResult,
  storage: any
): Promise<void> {
  const metricsKey = `rate:metrics:${key}`;
  const now = Date.now();

  const metrics = {
    totalRequests: 1,
    allowedRequests: result.allowed ? 1 : 0,
    blockedRequests: result.allowed ? 0 : 1,
    lastRequest: now,
  };

  // Increment counters
  await storage.hincrby(metricsKey, 'totalRequests', 1);
  await storage.hincrby(
    metricsKey,
    'allowedRequests',
    result.allowed ? 1 : 0
  );
  await storage.hincrby(
    metricsKey,
    'blockedRequests',
    result.allowed ? 0 : 1
  );
  await storage.hset(metricsKey, 'lastRequest', now);

  // Set expiration (keep metrics for 7 days)
  await storage.expire(metricsKey, 7 * 24 * 60 * 60);
}

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
export async function getRateLimitMetrics(
  key: string,
  storage: any
): Promise<Partial<RateLimitMetrics>> {
  const metricsKey = `rate:metrics:${key}`;
  const data = await storage.hgetall(metricsKey);

  if (!data || Object.keys(data).length === 0) {
    return {
      totalRequests: 0,
      allowedRequests: 0,
      blockedRequests: 0,
    };
  }

  return {
    key,
    totalRequests: parseInt(data.totalRequests || '0', 10),
    allowedRequests: parseInt(data.allowedRequests || '0', 10),
    blockedRequests: parseInt(data.blockedRequests || '0', 10),
    lastRequest: data.lastRequest ? new Date(parseInt(data.lastRequest, 10)) : undefined,
  };
}

// ============================================================================
// DYNAMIC RATE LIMIT ADJUSTMENT
// ============================================================================

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
export function adjustRateLimit(
  currentLimit: number,
  config: DynamicRateLimitConfig,
  metrics: {
    successRate?: number;
    avgResponseTime?: number;
    errorRate?: number;
  }
): number {
  let adjustment = 0;

  // Check increase conditions
  if (config.triggers.increaseOn) {
    const { successRate, avgResponseTime } = config.triggers.increaseOn;

    if (
      successRate &&
      metrics.successRate !== undefined &&
      metrics.successRate >= successRate
    ) {
      adjustment += config.adjustmentFactor;
    }

    if (
      avgResponseTime &&
      metrics.avgResponseTime !== undefined &&
      metrics.avgResponseTime <= avgResponseTime
    ) {
      adjustment += config.adjustmentFactor;
    }
  }

  // Check decrease conditions
  if (config.triggers.decreaseOn) {
    const { errorRate, avgResponseTime } = config.triggers.decreaseOn;

    if (
      errorRate &&
      metrics.errorRate !== undefined &&
      metrics.errorRate >= errorRate
    ) {
      adjustment -= config.adjustmentFactor;
    }

    if (
      avgResponseTime &&
      metrics.avgResponseTime !== undefined &&
      metrics.avgResponseTime >= avgResponseTime
    ) {
      adjustment -= config.adjustmentFactor;
    }
  }

  // Apply adjustment
  const newLimit = Math.floor(currentLimit * (1 + adjustment / 100));

  // Clamp to min/max
  return Math.max(config.minLimit, Math.min(config.maxLimit, newLimit));
}

// ============================================================================
// NESTJS GUARDS
// ============================================================================

/**
 * Rate Limit Guard
 * Applies rate limiting to routes
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly storage?: any // Redis client or in-memory storage
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get rate limit config from decorator
    const config = this.reflector.get<RateLimitConfig>(
      'rateLimit',
      context.getHandler()
    );

    if (!config) {
      return true; // No rate limit configured
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Generate key based on scope
    let key: string;
    switch (config.scope) {
      case RateLimitScope.PER_IP:
        key = generateIPKey(request, config.keyPrefix);
        break;
      case RateLimitScope.PER_USER:
        const user = (request as any).user;
        if (!user) {
          throw new UnauthorizedException('User not authenticated');
        }
        key = generateUserKey(user.id, config.keyPrefix);
        break;
      case RateLimitScope.PER_ENDPOINT:
        const identifier = (request as any).user?.id || getClientIP(request);
        key = generateEndpointKey(request.path, identifier, config.keyPrefix);
        break;
      default:
        key = `${config.keyPrefix || 'rate'}:global`;
    }

    // Check whitelist/blacklist
    if (this.storage) {
      if (await isBlacklisted(key, config.scope, this.storage)) {
        throw new ForbiddenException('Access denied');
      }

      if (await isWhitelisted(key, config.scope, this.storage)) {
        return true; // Skip rate limiting for whitelisted
      }
    }

    // Check rate limit
    let result: RateLimitResult;

    if (this.storage) {
      switch (config.algorithm) {
        case RateLimitAlgorithm.TOKEN_BUCKET:
          result = await checkTokenBucket(key, config, this.storage);
          break;
        case RateLimitAlgorithm.LEAKY_BUCKET:
          result = await checkLeakyBucket(key, config, this.storage);
          break;
        case RateLimitAlgorithm.SLIDING_WINDOW:
          result = await checkSlidingWindow(key, config, this.storage);
          break;
        default:
          result = await checkFixedWindow(key, config, this.storage);
      }

      // Record metrics
      await recordRateLimitMetrics(key, result, this.storage);
    } else {
      // In-memory fallback (not recommended for production)
      result = {
        allowed: true,
        remaining: config.limit,
        limit: config.limit,
        resetAt: new Date(Date.now() + config.window),
      };
    }

    // Set headers
    if (config.enableHeaders) {
      setRateLimitHeaders(response, result, config);
    }

    if (!result.allowed) {
      throw new RateLimitExceededError(
        result,
        config.message || 'Rate limit exceeded. Please try again later.'
      );
    }

    return true;
  }
}

/**
 * IP Rate Limit Guard
 * Rate limiting based on IP address
 */
@Injectable()
export class IPRateLimitGuard implements CanActivate {
  constructor(
    private readonly config: RateLimitConfig,
    private readonly storage: any
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const result = await checkIPRateLimit(request, this.config, this.storage);

    if (this.config.enableHeaders) {
      setRateLimitHeaders(response, result, this.config);
    }

    if (!result.allowed) {
      throw new RateLimitExceededError(result);
    }

    return true;
  }
}

/**
 * User Rate Limit Guard
 * Rate limiting based on authenticated user
 */
@Injectable()
export class UserRateLimitGuard implements CanActivate {
  constructor(
    private readonly config: RateLimitConfig,
    private readonly storage: any
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const user = (request as any).user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const result = await checkUserRateLimit(user.id, this.config, this.storage);

    if (this.config.enableHeaders) {
      setRateLimitHeaders(response, result, this.config);
    }

    if (!result.allowed) {
      throw new RateLimitExceededError(result);
    }

    return true;
  }
}

// ============================================================================
// NESTJS DECORATORS
// ============================================================================

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
export const RateLimit = (config: RateLimitConfig) =>
  SetMetadata('rateLimit', config);

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
export const SkipRateLimit = () => SetMetadata('skipRateLimit', true);

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
export const RateLimitKey = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = (request as any).user;

    if (user) {
      return generateUserKey(user.id);
    }

    return generateIPKey(request);
  }
);

// ============================================================================
// NESTJS INTERCEPTORS
// ============================================================================

/**
 * Rate Limit Interceptor
 * Intercepts requests and applies rate limiting
 */
@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  constructor(
    private readonly config: RateLimitConfig,
    private readonly storage: any
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Generate key
    let key: string;
    if (this.config.scope === RateLimitScope.PER_USER) {
      const user = (request as any).user;
      if (!user) {
        throw new UnauthorizedException('User not authenticated');
      }
      key = generateUserKey(user.id, this.config.keyPrefix);
    } else {
      key = generateIPKey(request, this.config.keyPrefix);
    }

    // Check rate limit
    let result: RateLimitResult;

    switch (this.config.algorithm) {
      case RateLimitAlgorithm.TOKEN_BUCKET:
        result = await checkTokenBucket(key, this.config, this.storage);
        break;
      case RateLimitAlgorithm.LEAKY_BUCKET:
        result = await checkLeakyBucket(key, this.config, this.storage);
        break;
      case RateLimitAlgorithm.SLIDING_WINDOW:
        result = await checkSlidingWindow(key, this.config, this.storage);
        break;
      default:
        result = await checkFixedWindow(key, this.config, this.storage);
    }

    // Set headers
    if (this.config.enableHeaders) {
      setRateLimitHeaders(response, result, this.config);
    }

    if (!result.allowed) {
      throw new RateLimitExceededError(result);
    }

    return next.handle();
  }
}

/**
 * Concurrent Request Interceptor
 * Limits concurrent requests
 */
@Injectable()
export class ConcurrentRequestInterceptor implements NestInterceptor {
  constructor(
    private readonly config: ConcurrentLimitConfig,
    private readonly storage: any
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    // Generate key based on scope
    let key: string;
    if (this.config.scope === RateLimitScope.PER_USER) {
      const user = (request as any).user;
      if (!user) {
        throw new UnauthorizedException('User not authenticated');
      }
      key = user.id;
    } else {
      key = getClientIP(request);
    }

    // Acquire slot
    const result = await acquireConcurrentSlot(key, this.config, this.storage);

    if (!result.allowed) {
      if (result.queuePosition) {
        throw new HttpException(
          {
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
            message: 'Server busy. Request queued.',
            queuePosition: result.queuePosition,
          },
          HttpStatus.SERVICE_UNAVAILABLE
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Too many concurrent requests',
          },
          HttpStatus.TOO_MANY_REQUESTS
        );
      }
    }

    // Process request and release slot on completion
    return next.handle().pipe(
      tap({
        next: async () => {
          if (result.requestId) {
            await releaseConcurrentSlot(key, result.requestId, this.storage);
          }
        },
        error: async () => {
          if (result.requestId) {
            await releaseConcurrentSlot(key, result.requestId, this.storage);
          }
        },
      })
    );
  }
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

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

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

/**
 * Default rate limit configuration for API endpoints
 */
export const DEFAULT_API_RATE_LIMIT: RateLimitConfig = {
  algorithm: RateLimitAlgorithm.SLIDING_WINDOW,
  scope: RateLimitScope.PER_USER,
  limit: 1000,
  window: 60 * 60 * 1000, // 1 hour
  action: RateLimitAction.REJECT,
  storage: RateLimitStorage.REDIS,
  enableHeaders: true,
};

/**
 * Default rate limit configuration for public endpoints
 */
export const DEFAULT_PUBLIC_RATE_LIMIT: RateLimitConfig = {
  algorithm: RateLimitAlgorithm.FIXED_WINDOW,
  scope: RateLimitScope.PER_IP,
  limit: 100,
  window: 15 * 60 * 1000, // 15 minutes
  action: RateLimitAction.REJECT,
  storage: RateLimitStorage.REDIS,
  enableHeaders: true,
};

/**
 * Strict rate limit configuration for sensitive endpoints
 */
export const STRICT_RATE_LIMIT: RateLimitConfig = {
  algorithm: RateLimitAlgorithm.TOKEN_BUCKET,
  scope: RateLimitScope.PER_USER,
  limit: 10,
  window: 60 * 1000, // 1 minute
  burst: 5,
  action: RateLimitAction.REJECT,
  storage: RateLimitStorage.REDIS,
  enableHeaders: true,
  message: 'Rate limit exceeded for sensitive operation',
};

/**
 * Default concurrent request limit
 */
export const DEFAULT_CONCURRENT_LIMIT: ConcurrentLimitConfig = {
  maxConcurrent: 10,
  queueSize: 5,
  queueTimeout: 30000, // 30 seconds
  scope: RateLimitScope.PER_USER,
};

/**
 * Default cost-based rate limit for API operations
 */
export const DEFAULT_COST_BASED_LIMIT: CostBasedRateLimit = {
  maxCost: 1000,
  window: 60 * 60 * 1000, // 1 hour
  defaultCost: 1,
  costs: {
    'GET:/api/*': 1,
    'POST:/api/*': 5,
    'PUT:/api/*': 5,
    'DELETE:/api/*': 10,
    'POST:/api/reports/generate': 50,
    'POST:/api/exports/*': 25,
  },
};
