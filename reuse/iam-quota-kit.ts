/**
 * LOC: IAM_QUOTA_KIT_001
 * File: /reuse/iam-quota-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto
 *   - ./iam-types-kit
 *
 * DOWNSTREAM (imported by):
 *   - IAM quota services
 *   - Rate limiting middleware
 *   - Tenant management
 *   - Usage tracking services
 *   - Fair use policy enforcement
 */

/**
 * File: /reuse/iam-quota-kit.ts
 * Locator: WC-IAM-QUOTA-KIT-001
 * Purpose: Comprehensive IAM Quota Kit - Enterprise-grade quota and rate limiting toolkit
 *
 * Upstream: NestJS, crypto, TypeScript 5.x
 * Downstream: ../backend/iam/*, Quota services, Rate limiting, Usage tracking
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common
 * Exports: 40 quota functions for rate limiting, usage tracking, quota enforcement, alerts
 *
 * LLM Context: Enterprise-grade quota and rate limiting utilities for White Cross healthcare platform.
 * Provides comprehensive quota management including rate limiting for IAM operations, per-tenant
 * quotas, usage tracking, quota enforcement, sliding window rate limiting, token bucket algorithm,
 * quota alerts and notifications, dynamic quota adjustment, and fair use policies. HIPAA-compliant
 * quota patterns ensuring fair resource usage and preventing abuse.
 */

import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { UserId, RoleId } from './iam-types-kit';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Quota type
 */
export enum QuotaType {
  API_REQUESTS = 'api_requests',
  IAM_OPERATIONS = 'iam_operations',
  DATA_TRANSFER = 'data_transfer',
  STORAGE = 'storage',
  CONCURRENT_SESSIONS = 'concurrent_sessions',
  USER_CREATIONS = 'user_creations',
  ROLE_ASSIGNMENTS = 'role_assignments',
}

/**
 * Rate limit algorithm
 */
export enum RateLimitAlgorithm {
  TOKEN_BUCKET = 'token_bucket',
  SLIDING_WINDOW = 'sliding_window',
  FIXED_WINDOW = 'fixed_window',
  LEAKY_BUCKET = 'leaky_bucket',
}

/**
 * Quota period
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
 * Quota status
 */
export enum QuotaStatus {
  NORMAL = 'normal',
  WARNING = 'warning',
  EXCEEDED = 'exceeded',
  SUSPENDED = 'suspended',
}

/**
 * Tenant ID branded type
 */
export type TenantId = string & { __brand: 'TenantId' };

/**
 * Quota ID branded type
 */
export type QuotaId = string & { __brand: 'QuotaId' };

/**
 * Quota definition
 */
export interface Quota {
  readonly id: QuotaId;
  readonly tenantId: TenantId;
  readonly type: QuotaType;
  readonly limit: number;
  readonly period: QuotaPeriod;
  readonly currentUsage: number;
  readonly resetAt: Date;
  readonly status: QuotaStatus;
  readonly warningThreshold: number; // Percentage (0-100)
  readonly metadata: Record<string, unknown>;
}

/**
 * Rate limiter configuration
 */
export interface RateLimiterConfig {
  readonly algorithm: RateLimitAlgorithm;
  readonly limit: number;
  readonly period: QuotaPeriod;
  readonly burstLimit?: number;
  readonly refillRate?: number;
}

/**
 * Token bucket state
 */
export interface TokenBucketState {
  readonly capacity: number;
  readonly tokens: number;
  readonly refillRate: number; // Tokens per second
  readonly lastRefill: Date;
}

/**
 * Sliding window state
 */
export interface SlidingWindowState {
  readonly windowSize: number; // In milliseconds
  readonly limit: number;
  readonly requests: TimestampedRequest[];
}

/**
 * Timestamped request
 */
export interface TimestampedRequest {
  readonly timestamp: Date;
  readonly weight: number;
}

/**
 * Usage record
 */
export interface UsageRecord {
  readonly id: string;
  readonly tenantId: TenantId;
  readonly userId?: UserId;
  readonly quotaType: QuotaType;
  readonly amount: number;
  readonly timestamp: Date;
  readonly metadata: Record<string, unknown>;
}

/**
 * Quota alert
 */
export interface QuotaAlert {
  readonly id: string;
  readonly quotaId: QuotaId;
  readonly tenantId: TenantId;
  readonly alertType: 'warning' | 'exceeded' | 'suspended';
  readonly threshold: number;
  readonly currentUsage: number;
  readonly limit: number;
  readonly triggeredAt: Date;
  readonly notified: boolean;
}

/**
 * Quota enforcement result
 */
export interface QuotaEnforcementResult {
  readonly allowed: boolean;
  readonly quota: Quota;
  readonly remainingQuota: number;
  readonly resetAt: Date;
  readonly reason?: string;
}

/**
 * Usage statistics
 */
export interface UsageStatistics {
  readonly tenantId: TenantId;
  readonly period: QuotaPeriod;
  readonly totalRequests: number;
  readonly byType: Record<QuotaType, number>;
  readonly byUser: Record<string, number>;
  readonly peakUsage: number;
  readonly averageUsage: number;
  readonly startTime: Date;
  readonly endTime: Date;
}

/**
 * Quota adjustment request
 */
export interface QuotaAdjustmentRequest {
  readonly quotaId: QuotaId;
  readonly newLimit: number;
  readonly reason: string;
  readonly requestedBy: UserId;
  readonly temporary?: boolean;
  readonly expiresAt?: Date;
}

// ============================================================================
// QUOTA CREATION AND MANAGEMENT
// ============================================================================

/**
 * @function createQuotaId
 * @description Generates a unique quota ID
 * @returns {QuotaId} Unique quota ID
 *
 * @example
 * ```typescript
 * const quotaId = createQuotaId();
 * ```
 */
export const createQuotaId = (): QuotaId => {
  return `quota_${crypto.randomUUID()}` as QuotaId;
};

/**
 * @function createTenantId
 * @description Generates a unique tenant ID
 * @returns {TenantId} Unique tenant ID
 *
 * @example
 * ```typescript
 * const tenantId = createTenantId();
 * ```
 */
export const createTenantId = (): TenantId => {
  return `tenant_${crypto.randomUUID()}` as TenantId;
};

/**
 * @function createQuota
 * @description Creates a new quota for tenant
 * @param {TenantId} tenantId - Tenant ID
 * @param {QuotaType} type - Quota type
 * @param {number} limit - Quota limit
 * @param {QuotaPeriod} period - Quota period
 * @param {number} warningThreshold - Warning threshold percentage (default: 80)
 * @returns {Quota} Created quota
 *
 * @example
 * ```typescript
 * const quota = createQuota(
 *   tenantId,
 *   QuotaType.API_REQUESTS,
 *   10000,
 *   QuotaPeriod.HOUR,
 *   80
 * );
 * ```
 */
export const createQuota = (
  tenantId: TenantId,
  type: QuotaType,
  limit: number,
  period: QuotaPeriod,
  warningThreshold: number = 80,
): Quota => {
  return {
    id: createQuotaId(),
    tenantId,
    type,
    limit,
    period,
    currentUsage: 0,
    resetAt: calculateResetTime(period),
    status: QuotaStatus.NORMAL,
    warningThreshold,
    metadata: {},
  };
};

/**
 * @function createDefaultQuotas
 * @description Creates default quotas for new tenant
 * @param {TenantId} tenantId - Tenant ID
 * @returns {Quota[]} Array of default quotas
 *
 * @example
 * ```typescript
 * const quotas = createDefaultQuotas(tenantId);
 * ```
 */
export const createDefaultQuotas = (tenantId: TenantId): Quota[] => {
  return [
    createQuota(tenantId, QuotaType.API_REQUESTS, 10000, QuotaPeriod.HOUR),
    createQuota(tenantId, QuotaType.IAM_OPERATIONS, 1000, QuotaPeriod.HOUR),
    createQuota(tenantId, QuotaType.CONCURRENT_SESSIONS, 100, QuotaPeriod.HOUR),
    createQuota(tenantId, QuotaType.USER_CREATIONS, 50, QuotaPeriod.DAY),
    createQuota(tenantId, QuotaType.ROLE_ASSIGNMENTS, 500, QuotaPeriod.DAY),
  ];
};

/**
 * @function updateQuotaLimit
 * @description Updates quota limit
 * @param {Quota} quota - Quota to update
 * @param {number} newLimit - New limit
 * @returns {Quota} Updated quota
 *
 * @example
 * ```typescript
 * const updated = updateQuotaLimit(quota, 20000);
 * ```
 */
export const updateQuotaLimit = (quota: Quota, newLimit: number): Quota => {
  return {
    ...quota,
    limit: newLimit,
    status: determineQuotaStatus(quota.currentUsage, newLimit, quota.warningThreshold),
  };
};

// ============================================================================
// RATE LIMITING - TOKEN BUCKET
// ============================================================================

/**
 * @function createTokenBucket
 * @description Creates a token bucket rate limiter
 * @param {number} capacity - Bucket capacity
 * @param {number} refillRate - Tokens per second
 * @returns {TokenBucketState} Initial bucket state
 *
 * @example
 * ```typescript
 * const bucket = createTokenBucket(100, 10); // 100 capacity, 10/sec refill
 * ```
 */
export const createTokenBucket = (
  capacity: number,
  refillRate: number,
): TokenBucketState => {
  return {
    capacity,
    tokens: capacity,
    refillRate,
    lastRefill: new Date(),
  };
};

/**
 * @function refillTokenBucket
 * @description Refills tokens in bucket based on time elapsed
 * @param {TokenBucketState} bucket - Current bucket state
 * @returns {TokenBucketState} Refilled bucket state
 *
 * @example
 * ```typescript
 * const refilled = refillTokenBucket(bucket);
 * ```
 */
export const refillTokenBucket = (bucket: TokenBucketState): TokenBucketState => {
  const now = new Date();
  const elapsedMs = now.getTime() - bucket.lastRefill.getTime();
  const elapsedSec = elapsedMs / 1000;
  const tokensToAdd = elapsedSec * bucket.refillRate;
  const newTokens = Math.min(bucket.capacity, bucket.tokens + tokensToAdd);

  return {
    ...bucket,
    tokens: newTokens,
    lastRefill: now,
  };
};

/**
 * @function consumeTokens
 * @description Attempts to consume tokens from bucket
 * @param {TokenBucketState} bucket - Current bucket state
 * @param {number} tokens - Number of tokens to consume
 * @returns {object} Result with success status and updated bucket
 *
 * @example
 * ```typescript
 * const result = consumeTokens(bucket, 5);
 * if (result.allowed) {
 *   // Request allowed
 * }
 * ```
 */
export const consumeTokens = (
  bucket: TokenBucketState,
  tokens: number = 1,
): { allowed: boolean; bucket: TokenBucketState; remainingTokens: number } => {
  const refilled = refillTokenBucket(bucket);

  if (refilled.tokens >= tokens) {
    return {
      allowed: true,
      bucket: {
        ...refilled,
        tokens: refilled.tokens - tokens,
      },
      remainingTokens: refilled.tokens - tokens,
    };
  }

  return {
    allowed: false,
    bucket: refilled,
    remainingTokens: refilled.tokens,
  };
};

/**
 * @function getTokenBucketStatus
 * @description Gets current status of token bucket
 * @param {TokenBucketState} bucket - Bucket to check
 * @returns {object} Bucket status
 *
 * @example
 * ```typescript
 * const status = getTokenBucketStatus(bucket);
 * console.log(`Available: ${status.availableTokens}/${status.capacity}`);
 * ```
 */
export const getTokenBucketStatus = (
  bucket: TokenBucketState,
): {
  capacity: number;
  availableTokens: number;
  utilizationPercent: number;
  refillRate: number;
} => {
  const refilled = refillTokenBucket(bucket);
  return {
    capacity: bucket.capacity,
    availableTokens: refilled.tokens,
    utilizationPercent: ((bucket.capacity - refilled.tokens) / bucket.capacity) * 100,
    refillRate: bucket.refillRate,
  };
};

// ============================================================================
// RATE LIMITING - SLIDING WINDOW
// ============================================================================

/**
 * @function createSlidingWindow
 * @description Creates a sliding window rate limiter
 * @param {number} windowSizeMs - Window size in milliseconds
 * @param {number} limit - Request limit per window
 * @returns {SlidingWindowState} Initial window state
 *
 * @example
 * ```typescript
 * const window = createSlidingWindow(60000, 100); // 100 requests per minute
 * ```
 */
export const createSlidingWindow = (
  windowSizeMs: number,
  limit: number,
): SlidingWindowState => {
  return {
    windowSize: windowSizeMs,
    limit,
    requests: [],
  };
};

/**
 * @function cleanSlidingWindow
 * @description Removes expired requests from sliding window
 * @param {SlidingWindowState} window - Current window state
 * @returns {SlidingWindowState} Cleaned window state
 *
 * @example
 * ```typescript
 * const cleaned = cleanSlidingWindow(window);
 * ```
 */
export const cleanSlidingWindow = (window: SlidingWindowState): SlidingWindowState => {
  const now = Date.now();
  const cutoff = now - window.windowSize;

  return {
    ...window,
    requests: window.requests.filter(req => req.timestamp.getTime() > cutoff),
  };
};

/**
 * @function checkSlidingWindowLimit
 * @description Checks if request is allowed in sliding window
 * @param {SlidingWindowState} window - Current window state
 * @param {number} weight - Request weight (default: 1)
 * @returns {object} Result with allowed status and updated window
 *
 * @example
 * ```typescript
 * const result = checkSlidingWindowLimit(window, 1);
 * if (result.allowed) {
 *   // Request allowed
 * }
 * ```
 */
export const checkSlidingWindowLimit = (
  window: SlidingWindowState,
  weight: number = 1,
): { allowed: boolean; window: SlidingWindowState; currentCount: number } => {
  const cleaned = cleanSlidingWindow(window);
  const currentCount = cleaned.requests.reduce((sum, req) => sum + req.weight, 0);

  if (currentCount + weight <= window.limit) {
    return {
      allowed: true,
      window: {
        ...cleaned,
        requests: [
          ...cleaned.requests,
          { timestamp: new Date(), weight },
        ],
      },
      currentCount: currentCount + weight,
    };
  }

  return {
    allowed: false,
    window: cleaned,
    currentCount,
  };
};

/**
 * @function getSlidingWindowStatus
 * @description Gets current status of sliding window
 * @param {SlidingWindowState} window - Window to check
 * @returns {object} Window status
 *
 * @example
 * ```typescript
 * const status = getSlidingWindowStatus(window);
 * console.log(`Used: ${status.currentCount}/${status.limit}`);
 * ```
 */
export const getSlidingWindowStatus = (
  window: SlidingWindowState,
): {
  limit: number;
  currentCount: number;
  remainingCount: number;
  utilizationPercent: number;
  oldestRequest?: Date;
} => {
  const cleaned = cleanSlidingWindow(window);
  const currentCount = cleaned.requests.reduce((sum, req) => sum + req.weight, 0);
  const oldestRequest = cleaned.requests.length > 0 ? cleaned.requests[0].timestamp : undefined;

  return {
    limit: window.limit,
    currentCount,
    remainingCount: Math.max(0, window.limit - currentCount),
    utilizationPercent: (currentCount / window.limit) * 100,
    oldestRequest,
  };
};

// ============================================================================
// QUOTA ENFORCEMENT
// ============================================================================

/**
 * @function checkQuota
 * @description Checks if operation is within quota
 * @param {Quota} quota - Quota to check
 * @param {number} amount - Amount to consume
 * @returns {QuotaEnforcementResult} Enforcement result
 *
 * @example
 * ```typescript
 * const result = checkQuota(quota, 1);
 * if (!result.allowed) {
 *   throw new Error('Quota exceeded');
 * }
 * ```
 */
export const checkQuota = (quota: Quota, amount: number = 1): QuotaEnforcementResult => {
  // Reset quota if period has elapsed
  const resetQuota = shouldResetQuota(quota) ? resetQuotaUsage(quota) : quota;

  if (resetQuota.currentUsage + amount <= resetQuota.limit) {
    return {
      allowed: true,
      quota: resetQuota,
      remainingQuota: resetQuota.limit - resetQuota.currentUsage - amount,
      resetAt: resetQuota.resetAt,
    };
  }

  return {
    allowed: false,
    quota: resetQuota,
    remainingQuota: 0,
    resetAt: resetQuota.resetAt,
    reason: `Quota exceeded: ${resetQuota.currentUsage + amount}/${resetQuota.limit}`,
  };
};

/**
 * @function consumeQuota
 * @description Consumes quota amount
 * @param {Quota} quota - Quota to consume
 * @param {number} amount - Amount to consume
 * @returns {Quota} Updated quota
 *
 * @example
 * ```typescript
 * const updated = consumeQuota(quota, 5);
 * ```
 */
export const consumeQuota = (quota: Quota, amount: number = 1): Quota => {
  const newUsage = quota.currentUsage + amount;
  return {
    ...quota,
    currentUsage: newUsage,
    status: determineQuotaStatus(newUsage, quota.limit, quota.warningThreshold),
  };
};

/**
 * @function shouldResetQuota
 * @description Checks if quota should be reset
 * @param {Quota} quota - Quota to check
 * @returns {boolean} True if should reset
 *
 * @example
 * ```typescript
 * if (shouldResetQuota(quota)) {
 *   quota = resetQuotaUsage(quota);
 * }
 * ```
 */
export const shouldResetQuota = (quota: Quota): boolean => {
  return new Date() >= quota.resetAt;
};

/**
 * @function resetQuotaUsage
 * @description Resets quota usage to zero
 * @param {Quota} quota - Quota to reset
 * @returns {Quota} Reset quota
 *
 * @example
 * ```typescript
 * const reset = resetQuotaUsage(quota);
 * ```
 */
export const resetQuotaUsage = (quota: Quota): Quota => {
  return {
    ...quota,
    currentUsage: 0,
    resetAt: calculateResetTime(quota.period, new Date()),
    status: QuotaStatus.NORMAL,
  };
};

/**
 * @function determineQuotaStatus
 * @description Determines quota status based on usage
 * @param {number} currentUsage - Current usage
 * @param {number} limit - Quota limit
 * @param {number} warningThreshold - Warning threshold percentage
 * @returns {QuotaStatus} Quota status
 *
 * @example
 * ```typescript
 * const status = determineQuotaStatus(850, 1000, 80);
 * // Returns QuotaStatus.WARNING
 * ```
 */
export const determineQuotaStatus = (
  currentUsage: number,
  limit: number,
  warningThreshold: number,
): QuotaStatus => {
  const usagePercent = (currentUsage / limit) * 100;

  if (currentUsage >= limit) {
    return QuotaStatus.EXCEEDED;
  } else if (usagePercent >= warningThreshold) {
    return QuotaStatus.WARNING;
  }

  return QuotaStatus.NORMAL;
};

// ============================================================================
// USAGE TRACKING
// ============================================================================

/**
 * @function createUsageRecord
 * @description Creates a usage record
 * @param {TenantId} tenantId - Tenant ID
 * @param {QuotaType} quotaType - Quota type
 * @param {number} amount - Usage amount
 * @param {UserId} userId - Optional user ID
 * @returns {UsageRecord} Usage record
 *
 * @example
 * ```typescript
 * const record = createUsageRecord(tenantId, QuotaType.API_REQUESTS, 1, userId);
 * ```
 */
export const createUsageRecord = (
  tenantId: TenantId,
  quotaType: QuotaType,
  amount: number,
  userId?: UserId,
): UsageRecord => {
  return {
    id: crypto.randomUUID(),
    tenantId,
    userId,
    quotaType,
    amount,
    timestamp: new Date(),
    metadata: {},
  };
};

/**
 * @function aggregateUsage
 * @description Aggregates usage records
 * @param {UsageRecord[]} records - Usage records
 * @param {QuotaPeriod} period - Aggregation period
 * @returns {UsageStatistics} Usage statistics
 *
 * @example
 * ```typescript
 * const stats = aggregateUsage(records, QuotaPeriod.HOUR);
 * ```
 */
export const aggregateUsage = (
  records: UsageRecord[],
  period: QuotaPeriod,
): UsageStatistics | null => {
  if (records.length === 0) return null;

  const byType: Record<QuotaType, number> = {
    [QuotaType.API_REQUESTS]: 0,
    [QuotaType.IAM_OPERATIONS]: 0,
    [QuotaType.DATA_TRANSFER]: 0,
    [QuotaType.STORAGE]: 0,
    [QuotaType.CONCURRENT_SESSIONS]: 0,
    [QuotaType.USER_CREATIONS]: 0,
    [QuotaType.ROLE_ASSIGNMENTS]: 0,
  };

  const byUser: Record<string, number> = {};
  let totalRequests = 0;

  for (const record of records) {
    totalRequests += record.amount;
    byType[record.quotaType] += record.amount;

    if (record.userId) {
      byUser[record.userId] = (byUser[record.userId] || 0) + record.amount;
    }
  }

  const timestamps = records.map(r => r.timestamp.getTime());
  const startTime = new Date(Math.min(...timestamps));
  const endTime = new Date(Math.max(...timestamps));

  return {
    tenantId: records[0].tenantId,
    period,
    totalRequests,
    byType,
    byUser,
    peakUsage: Math.max(...Object.values(byUser)),
    averageUsage: totalRequests / records.length,
    startTime,
    endTime,
  };
};

/**
 * @function calculateUsagePercentage
 * @description Calculates quota usage percentage
 * @param {Quota} quota - Quota to check
 * @returns {number} Usage percentage (0-100)
 *
 * @example
 * ```typescript
 * const percent = calculateUsagePercentage(quota);
 * console.log(`Usage: ${percent.toFixed(2)}%`);
 * ```
 */
export const calculateUsagePercentage = (quota: Quota): number => {
  return (quota.currentUsage / quota.limit) * 100;
};

/**
 * @function getRemainingQuota
 * @description Gets remaining quota amount
 * @param {Quota} quota - Quota to check
 * @returns {number} Remaining quota
 *
 * @example
 * ```typescript
 * const remaining = getRemainingQuota(quota);
 * ```
 */
export const getRemainingQuota = (quota: Quota): number => {
  return Math.max(0, quota.limit - quota.currentUsage);
};

// ============================================================================
// QUOTA ALERTS
// ============================================================================

/**
 * @function createQuotaAlert
 * @description Creates a quota alert
 * @param {Quota} quota - Quota that triggered alert
 * @param {string} alertType - Alert type
 * @returns {QuotaAlert} Quota alert
 *
 * @example
 * ```typescript
 * const alert = createQuotaAlert(quota, 'warning');
 * ```
 */
export const createQuotaAlert = (
  quota: Quota,
  alertType: 'warning' | 'exceeded' | 'suspended',
): QuotaAlert => {
  return {
    id: crypto.randomUUID(),
    quotaId: quota.id,
    tenantId: quota.tenantId,
    alertType,
    threshold: quota.warningThreshold,
    currentUsage: quota.currentUsage,
    limit: quota.limit,
    triggeredAt: new Date(),
    notified: false,
  };
};

/**
 * @function shouldTriggerAlert
 * @description Checks if quota should trigger alert
 * @param {Quota} quota - Quota to check
 * @returns {object} Alert trigger status
 *
 * @example
 * ```typescript
 * const { shouldAlert, alertType } = shouldTriggerAlert(quota);
 * if (shouldAlert) {
 *   // Send alert
 * }
 * ```
 */
export const shouldTriggerAlert = (
  quota: Quota,
): { shouldAlert: boolean; alertType?: 'warning' | 'exceeded' } => {
  const usagePercent = calculateUsagePercentage(quota);

  if (usagePercent >= 100) {
    return { shouldAlert: true, alertType: 'exceeded' };
  } else if (usagePercent >= quota.warningThreshold) {
    return { shouldAlert: true, alertType: 'warning' };
  }

  return { shouldAlert: false };
};

/**
 * @function markAlertNotified
 * @description Marks alert as notified
 * @param {QuotaAlert} alert - Alert to mark
 * @returns {QuotaAlert} Updated alert
 *
 * @example
 * ```typescript
 * const notified = markAlertNotified(alert);
 * ```
 */
export const markAlertNotified = (alert: QuotaAlert): QuotaAlert => {
  return {
    ...alert,
    notified: true,
  };
};

// ============================================================================
// DYNAMIC QUOTA ADJUSTMENT
// ============================================================================

/**
 * @function adjustQuotaLimit
 * @description Adjusts quota limit dynamically
 * @param {Quota} quota - Quota to adjust
 * @param {QuotaAdjustmentRequest} request - Adjustment request
 * @returns {Quota} Adjusted quota
 *
 * @example
 * ```typescript
 * const adjusted = adjustQuotaLimit(quota, {
 *   quotaId: quota.id,
 *   newLimit: 20000,
 *   reason: 'Increased load',
 *   requestedBy: adminId
 * });
 * ```
 */
export const adjustQuotaLimit = (
  quota: Quota,
  request: QuotaAdjustmentRequest,
): Quota => {
  return {
    ...quota,
    limit: request.newLimit,
    status: determineQuotaStatus(quota.currentUsage, request.newLimit, quota.warningThreshold),
    metadata: {
      ...quota.metadata,
      lastAdjustment: {
        previousLimit: quota.limit,
        newLimit: request.newLimit,
        reason: request.reason,
        requestedBy: request.requestedBy,
        timestamp: new Date(),
        temporary: request.temporary,
        expiresAt: request.expiresAt,
      },
    },
  };
};

/**
 * @function scaleQuotaByFactor
 * @description Scales quota limit by factor
 * @param {Quota} quota - Quota to scale
 * @param {number} factor - Scale factor (e.g., 1.5 for 150%)
 * @returns {Quota} Scaled quota
 *
 * @example
 * ```typescript
 * const scaled = scaleQuotaByFactor(quota, 2.0); // Double the quota
 * ```
 */
export const scaleQuotaByFactor = (quota: Quota, factor: number): Quota => {
  const newLimit = Math.floor(quota.limit * factor);
  return updateQuotaLimit(quota, newLimit);
};

/**
 * @function autoScaleQuota
 * @description Auto-scales quota based on usage patterns
 * @param {Quota} quota - Quota to scale
 * @param {UsageStatistics} stats - Usage statistics
 * @returns {Quota} Scaled quota
 *
 * @example
 * ```typescript
 * const scaled = autoScaleQuota(quota, usageStats);
 * ```
 */
export const autoScaleQuota = (quota: Quota, stats: UsageStatistics): Quota => {
  const usagePercent = calculateUsagePercentage(quota);

  // Scale up if consistently above 80%
  if (usagePercent > 80) {
    return scaleQuotaByFactor(quota, 1.5);
  }

  // Scale down if consistently below 30%
  if (usagePercent < 30) {
    return scaleQuotaByFactor(quota, 0.75);
  }

  return quota;
};

// ============================================================================
// TIME CALCULATIONS
// ============================================================================

/**
 * @function calculateResetTime
 * @description Calculates next quota reset time
 * @param {QuotaPeriod} period - Quota period
 * @param {Date} from - Start time (default: now)
 * @returns {Date} Reset time
 *
 * @example
 * ```typescript
 * const resetAt = calculateResetTime(QuotaPeriod.HOUR);
 * ```
 */
export const calculateResetTime = (period: QuotaPeriod, from: Date = new Date()): Date => {
  const resetDate = new Date(from);

  switch (period) {
    case QuotaPeriod.SECOND:
      resetDate.setSeconds(resetDate.getSeconds() + 1);
      break;
    case QuotaPeriod.MINUTE:
      resetDate.setMinutes(resetDate.getMinutes() + 1);
      break;
    case QuotaPeriod.HOUR:
      resetDate.setHours(resetDate.getHours() + 1);
      break;
    case QuotaPeriod.DAY:
      resetDate.setDate(resetDate.getDate() + 1);
      break;
    case QuotaPeriod.WEEK:
      resetDate.setDate(resetDate.getDate() + 7);
      break;
    case QuotaPeriod.MONTH:
      resetDate.setMonth(resetDate.getMonth() + 1);
      break;
    case QuotaPeriod.YEAR:
      resetDate.setFullYear(resetDate.getFullYear() + 1);
      break;
  }

  return resetDate;
};

/**
 * @function getTimeUntilReset
 * @description Gets time remaining until quota reset
 * @param {Quota} quota - Quota to check
 * @returns {number} Milliseconds until reset
 *
 * @example
 * ```typescript
 * const ms = getTimeUntilReset(quota);
 * console.log(`Resets in ${ms / 1000} seconds`);
 * ```
 */
export const getTimeUntilReset = (quota: Quota): number => {
  return Math.max(0, quota.resetAt.getTime() - Date.now());
};

/**
 * @function periodToMilliseconds
 * @description Converts quota period to milliseconds
 * @param {QuotaPeriod} period - Quota period
 * @returns {number} Milliseconds
 *
 * @example
 * ```typescript
 * const ms = periodToMilliseconds(QuotaPeriod.HOUR); // 3600000
 * ```
 */
export const periodToMilliseconds = (period: QuotaPeriod): number => {
  const periods: Record<QuotaPeriod, number> = {
    [QuotaPeriod.SECOND]: 1000,
    [QuotaPeriod.MINUTE]: 60 * 1000,
    [QuotaPeriod.HOUR]: 60 * 60 * 1000,
    [QuotaPeriod.DAY]: 24 * 60 * 60 * 1000,
    [QuotaPeriod.WEEK]: 7 * 24 * 60 * 60 * 1000,
    [QuotaPeriod.MONTH]: 30 * 24 * 60 * 60 * 1000,
    [QuotaPeriod.YEAR]: 365 * 24 * 60 * 60 * 1000,
  };

  return periods[period];
};

// ============================================================================
// QUOTA QUERIES
// ============================================================================

/**
 * @function findQuotasByTenant
 * @description Finds all quotas for tenant
 * @param {TenantId} tenantId - Tenant ID
 * @param {Quota[]} quotas - All quotas
 * @returns {Quota[]} Tenant quotas
 *
 * @example
 * ```typescript
 * const tenantQuotas = findQuotasByTenant(tenantId, allQuotas);
 * ```
 */
export const findQuotasByTenant = (tenantId: TenantId, quotas: Quota[]): Quota[] => {
  return quotas.filter(q => q.tenantId === tenantId);
};

/**
 * @function findQuotasByType
 * @description Finds quotas by type
 * @param {QuotaType} type - Quota type
 * @param {Quota[]} quotas - All quotas
 * @returns {Quota[]} Matching quotas
 *
 * @example
 * ```typescript
 * const apiQuotas = findQuotasByType(QuotaType.API_REQUESTS, allQuotas);
 * ```
 */
export const findQuotasByType = (type: QuotaType, quotas: Quota[]): Quota[] => {
  return quotas.filter(q => q.type === type);
};

/**
 * @function findExceededQuotas
 * @description Finds all exceeded quotas
 * @param {Quota[]} quotas - All quotas
 * @returns {Quota[]} Exceeded quotas
 *
 * @example
 * ```typescript
 * const exceeded = findExceededQuotas(allQuotas);
 * ```
 */
export const findExceededQuotas = (quotas: Quota[]): Quota[] => {
  return quotas.filter(q => q.status === QuotaStatus.EXCEEDED);
};

/**
 * @function getQuotaSummary
 * @description Gets summary of all quotas
 * @param {Quota[]} quotas - Quotas to summarize
 * @returns {object} Quota summary
 *
 * @example
 * ```typescript
 * const summary = getQuotaSummary(allQuotas);
 * console.log(`Total: ${summary.total}, Exceeded: ${summary.exceeded}`);
 * ```
 */
export const getQuotaSummary = (
  quotas: Quota[],
): {
  total: number;
  normal: number;
  warning: number;
  exceeded: number;
  suspended: number;
  byType: Record<QuotaType, number>;
} => {
  const summary = {
    total: quotas.length,
    normal: 0,
    warning: 0,
    exceeded: 0,
    suspended: 0,
    byType: {
      [QuotaType.API_REQUESTS]: 0,
      [QuotaType.IAM_OPERATIONS]: 0,
      [QuotaType.DATA_TRANSFER]: 0,
      [QuotaType.STORAGE]: 0,
      [QuotaType.CONCURRENT_SESSIONS]: 0,
      [QuotaType.USER_CREATIONS]: 0,
      [QuotaType.ROLE_ASSIGNMENTS]: 0,
    },
  };

  for (const quota of quotas) {
    switch (quota.status) {
      case QuotaStatus.NORMAL:
        summary.normal++;
        break;
      case QuotaStatus.WARNING:
        summary.warning++;
        break;
      case QuotaStatus.EXCEEDED:
        summary.exceeded++;
        break;
      case QuotaStatus.SUSPENDED:
        summary.suspended++;
        break;
    }
    summary.byType[quota.type]++;
  }

  return summary;
};

// ============================================================================
// QUOTA UTILITIES
// ============================================================================

/**
 * @function cloneQuota
 * @description Creates a copy of quota for different tenant
 * @param {Quota} quota - Quota to clone
 * @param {TenantId} newTenantId - New tenant ID
 * @returns {Quota} Cloned quota
 *
 * @example
 * ```typescript
 * const cloned = cloneQuota(quota, newTenantId);
 * ```
 */
export const cloneQuota = (quota: Quota, newTenantId: TenantId): Quota => {
  return {
    ...quota,
    id: createQuotaId(),
    tenantId: newTenantId,
    currentUsage: 0,
    resetAt: calculateResetTime(quota.period),
    status: QuotaStatus.NORMAL,
  };
};

/**
 * @function compareQuotas
 * @description Compares two quotas for equality
 * @param {Quota} a - First quota
 * @param {Quota} b - Second quota
 * @returns {boolean} True if quotas are equivalent
 *
 * @example
 * ```typescript
 * if (compareQuotas(quota1, quota2)) {
 *   console.log('Quotas are identical');
 * }
 * ```
 */
export const compareQuotas = (a: Quota, b: Quota): boolean => {
  return (
    a.type === b.type &&
    a.limit === b.limit &&
    a.period === b.period &&
    a.warningThreshold === b.warningThreshold
  );
};

/**
 * @function serializeQuota
 * @description Serializes quota to JSON string
 * @param {Quota} quota - Quota to serialize
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = serializeQuota(quota);
 * ```
 */
export const serializeQuota = (quota: Quota): string => {
  return JSON.stringify(quota);
};

/**
 * @function deserializeQuota
 * @description Deserializes quota from JSON string
 * @param {string} json - JSON string
 * @returns {Quota} Quota object
 *
 * @example
 * ```typescript
 * const quota = deserializeQuota(jsonString);
 * ```
 */
export const deserializeQuota = (json: string): Quota => {
  const obj = JSON.parse(json);
  return {
    ...obj,
    resetAt: new Date(obj.resetAt),
  };
};

/**
 * @function formatQuotaStatus
 * @description Formats quota status for display
 * @param {Quota} quota - Quota to format
 * @returns {string} Formatted status string
 *
 * @example
 * ```typescript
 * const status = formatQuotaStatus(quota);
 * // Returns: "850/1000 (85%) - WARNING - Resets in 30 minutes"
 * ```
 */
export const formatQuotaStatus = (quota: Quota): string => {
  const usagePercent = calculateUsagePercentage(quota).toFixed(1);
  const remaining = getRemainingQuota(quota);
  const resetMs = getTimeUntilReset(quota);
  const resetMin = Math.ceil(resetMs / 60000);

  return `${quota.currentUsage}/${quota.limit} (${usagePercent}%) - ${quota.status.toUpperCase()} - ${remaining} remaining - Resets in ${resetMin} minutes`;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Creation
  createQuotaId,
  createTenantId,
  createQuota,
  createDefaultQuotas,
  updateQuotaLimit,

  // Token bucket
  createTokenBucket,
  refillTokenBucket,
  consumeTokens,
  getTokenBucketStatus,

  // Sliding window
  createSlidingWindow,
  cleanSlidingWindow,
  checkSlidingWindowLimit,
  getSlidingWindowStatus,

  // Enforcement
  checkQuota,
  consumeQuota,
  shouldResetQuota,
  resetQuotaUsage,
  determineQuotaStatus,

  // Usage tracking
  createUsageRecord,
  aggregateUsage,
  calculateUsagePercentage,
  getRemainingQuota,

  // Alerts
  createQuotaAlert,
  shouldTriggerAlert,
  markAlertNotified,

  // Adjustment
  adjustQuotaLimit,
  scaleQuotaByFactor,
  autoScaleQuota,

  // Time
  calculateResetTime,
  getTimeUntilReset,
  periodToMilliseconds,

  // Queries
  findQuotasByTenant,
  findQuotasByType,
  findExceededQuotas,
  getQuotaSummary,

  // Utilities
  cloneQuota,
  compareQuotas,
  serializeQuota,
  deserializeQuota,
  formatQuotaStatus,
};
