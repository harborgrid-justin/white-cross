"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatQuotaStatus = exports.deserializeQuota = exports.serializeQuota = exports.compareQuotas = exports.cloneQuota = exports.getQuotaSummary = exports.findExceededQuotas = exports.findQuotasByType = exports.findQuotasByTenant = exports.periodToMilliseconds = exports.getTimeUntilReset = exports.calculateResetTime = exports.autoScaleQuota = exports.scaleQuotaByFactor = exports.adjustQuotaLimit = exports.markAlertNotified = exports.shouldTriggerAlert = exports.createQuotaAlert = exports.getRemainingQuota = exports.calculateUsagePercentage = exports.aggregateUsage = exports.createUsageRecord = exports.determineQuotaStatus = exports.resetQuotaUsage = exports.shouldResetQuota = exports.consumeQuota = exports.checkQuota = exports.getSlidingWindowStatus = exports.checkSlidingWindowLimit = exports.cleanSlidingWindow = exports.createSlidingWindow = exports.getTokenBucketStatus = exports.consumeTokens = exports.refillTokenBucket = exports.createTokenBucket = exports.updateQuotaLimit = exports.createDefaultQuotas = exports.createQuota = exports.createTenantId = exports.createQuotaId = exports.QuotaStatus = exports.QuotaPeriod = exports.RateLimitAlgorithm = exports.QuotaType = void 0;
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
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Quota type
 */
var QuotaType;
(function (QuotaType) {
    QuotaType["API_REQUESTS"] = "api_requests";
    QuotaType["IAM_OPERATIONS"] = "iam_operations";
    QuotaType["DATA_TRANSFER"] = "data_transfer";
    QuotaType["STORAGE"] = "storage";
    QuotaType["CONCURRENT_SESSIONS"] = "concurrent_sessions";
    QuotaType["USER_CREATIONS"] = "user_creations";
    QuotaType["ROLE_ASSIGNMENTS"] = "role_assignments";
})(QuotaType || (exports.QuotaType = QuotaType = {}));
/**
 * Rate limit algorithm
 */
var RateLimitAlgorithm;
(function (RateLimitAlgorithm) {
    RateLimitAlgorithm["TOKEN_BUCKET"] = "token_bucket";
    RateLimitAlgorithm["SLIDING_WINDOW"] = "sliding_window";
    RateLimitAlgorithm["FIXED_WINDOW"] = "fixed_window";
    RateLimitAlgorithm["LEAKY_BUCKET"] = "leaky_bucket";
})(RateLimitAlgorithm || (exports.RateLimitAlgorithm = RateLimitAlgorithm = {}));
/**
 * Quota period
 */
var QuotaPeriod;
(function (QuotaPeriod) {
    QuotaPeriod["SECOND"] = "second";
    QuotaPeriod["MINUTE"] = "minute";
    QuotaPeriod["HOUR"] = "hour";
    QuotaPeriod["DAY"] = "day";
    QuotaPeriod["WEEK"] = "week";
    QuotaPeriod["MONTH"] = "month";
    QuotaPeriod["YEAR"] = "year";
})(QuotaPeriod || (exports.QuotaPeriod = QuotaPeriod = {}));
/**
 * Quota status
 */
var QuotaStatus;
(function (QuotaStatus) {
    QuotaStatus["NORMAL"] = "normal";
    QuotaStatus["WARNING"] = "warning";
    QuotaStatus["EXCEEDED"] = "exceeded";
    QuotaStatus["SUSPENDED"] = "suspended";
})(QuotaStatus || (exports.QuotaStatus = QuotaStatus = {}));
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
const createQuotaId = () => {
    return `quota_${crypto.randomUUID()}`;
};
exports.createQuotaId = createQuotaId;
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
const createTenantId = () => {
    return `tenant_${crypto.randomUUID()}`;
};
exports.createTenantId = createTenantId;
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
const createQuota = (tenantId, type, limit, period, warningThreshold = 80) => {
    return {
        id: (0, exports.createQuotaId)(),
        tenantId,
        type,
        limit,
        period,
        currentUsage: 0,
        resetAt: (0, exports.calculateResetTime)(period),
        status: QuotaStatus.NORMAL,
        warningThreshold,
        metadata: {},
    };
};
exports.createQuota = createQuota;
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
const createDefaultQuotas = (tenantId) => {
    return [
        (0, exports.createQuota)(tenantId, QuotaType.API_REQUESTS, 10000, QuotaPeriod.HOUR),
        (0, exports.createQuota)(tenantId, QuotaType.IAM_OPERATIONS, 1000, QuotaPeriod.HOUR),
        (0, exports.createQuota)(tenantId, QuotaType.CONCURRENT_SESSIONS, 100, QuotaPeriod.HOUR),
        (0, exports.createQuota)(tenantId, QuotaType.USER_CREATIONS, 50, QuotaPeriod.DAY),
        (0, exports.createQuota)(tenantId, QuotaType.ROLE_ASSIGNMENTS, 500, QuotaPeriod.DAY),
    ];
};
exports.createDefaultQuotas = createDefaultQuotas;
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
const updateQuotaLimit = (quota, newLimit) => {
    return {
        ...quota,
        limit: newLimit,
        status: (0, exports.determineQuotaStatus)(quota.currentUsage, newLimit, quota.warningThreshold),
    };
};
exports.updateQuotaLimit = updateQuotaLimit;
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
const createTokenBucket = (capacity, refillRate) => {
    return {
        capacity,
        tokens: capacity,
        refillRate,
        lastRefill: new Date(),
    };
};
exports.createTokenBucket = createTokenBucket;
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
const refillTokenBucket = (bucket) => {
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
exports.refillTokenBucket = refillTokenBucket;
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
const consumeTokens = (bucket, tokens = 1) => {
    const refilled = (0, exports.refillTokenBucket)(bucket);
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
exports.consumeTokens = consumeTokens;
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
const getTokenBucketStatus = (bucket) => {
    const refilled = (0, exports.refillTokenBucket)(bucket);
    return {
        capacity: bucket.capacity,
        availableTokens: refilled.tokens,
        utilizationPercent: ((bucket.capacity - refilled.tokens) / bucket.capacity) * 100,
        refillRate: bucket.refillRate,
    };
};
exports.getTokenBucketStatus = getTokenBucketStatus;
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
const createSlidingWindow = (windowSizeMs, limit) => {
    return {
        windowSize: windowSizeMs,
        limit,
        requests: [],
    };
};
exports.createSlidingWindow = createSlidingWindow;
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
const cleanSlidingWindow = (window) => {
    const now = Date.now();
    const cutoff = now - window.windowSize;
    return {
        ...window,
        requests: window.requests.filter(req => req.timestamp.getTime() > cutoff),
    };
};
exports.cleanSlidingWindow = cleanSlidingWindow;
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
const checkSlidingWindowLimit = (window, weight = 1) => {
    const cleaned = (0, exports.cleanSlidingWindow)(window);
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
exports.checkSlidingWindowLimit = checkSlidingWindowLimit;
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
const getSlidingWindowStatus = (window) => {
    const cleaned = (0, exports.cleanSlidingWindow)(window);
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
exports.getSlidingWindowStatus = getSlidingWindowStatus;
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
const checkQuota = (quota, amount = 1) => {
    // Reset quota if period has elapsed
    const resetQuota = (0, exports.shouldResetQuota)(quota) ? (0, exports.resetQuotaUsage)(quota) : quota;
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
exports.checkQuota = checkQuota;
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
const consumeQuota = (quota, amount = 1) => {
    const newUsage = quota.currentUsage + amount;
    return {
        ...quota,
        currentUsage: newUsage,
        status: (0, exports.determineQuotaStatus)(newUsage, quota.limit, quota.warningThreshold),
    };
};
exports.consumeQuota = consumeQuota;
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
const shouldResetQuota = (quota) => {
    return new Date() >= quota.resetAt;
};
exports.shouldResetQuota = shouldResetQuota;
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
const resetQuotaUsage = (quota) => {
    return {
        ...quota,
        currentUsage: 0,
        resetAt: (0, exports.calculateResetTime)(quota.period, new Date()),
        status: QuotaStatus.NORMAL,
    };
};
exports.resetQuotaUsage = resetQuotaUsage;
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
const determineQuotaStatus = (currentUsage, limit, warningThreshold) => {
    const usagePercent = (currentUsage / limit) * 100;
    if (currentUsage >= limit) {
        return QuotaStatus.EXCEEDED;
    }
    else if (usagePercent >= warningThreshold) {
        return QuotaStatus.WARNING;
    }
    return QuotaStatus.NORMAL;
};
exports.determineQuotaStatus = determineQuotaStatus;
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
const createUsageRecord = (tenantId, quotaType, amount, userId) => {
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
exports.createUsageRecord = createUsageRecord;
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
const aggregateUsage = (records, period) => {
    if (records.length === 0)
        return null;
    const byType = {
        [QuotaType.API_REQUESTS]: 0,
        [QuotaType.IAM_OPERATIONS]: 0,
        [QuotaType.DATA_TRANSFER]: 0,
        [QuotaType.STORAGE]: 0,
        [QuotaType.CONCURRENT_SESSIONS]: 0,
        [QuotaType.USER_CREATIONS]: 0,
        [QuotaType.ROLE_ASSIGNMENTS]: 0,
    };
    const byUser = {};
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
exports.aggregateUsage = aggregateUsage;
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
const calculateUsagePercentage = (quota) => {
    return (quota.currentUsage / quota.limit) * 100;
};
exports.calculateUsagePercentage = calculateUsagePercentage;
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
const getRemainingQuota = (quota) => {
    return Math.max(0, quota.limit - quota.currentUsage);
};
exports.getRemainingQuota = getRemainingQuota;
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
const createQuotaAlert = (quota, alertType) => {
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
exports.createQuotaAlert = createQuotaAlert;
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
const shouldTriggerAlert = (quota) => {
    const usagePercent = (0, exports.calculateUsagePercentage)(quota);
    if (usagePercent >= 100) {
        return { shouldAlert: true, alertType: 'exceeded' };
    }
    else if (usagePercent >= quota.warningThreshold) {
        return { shouldAlert: true, alertType: 'warning' };
    }
    return { shouldAlert: false };
};
exports.shouldTriggerAlert = shouldTriggerAlert;
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
const markAlertNotified = (alert) => {
    return {
        ...alert,
        notified: true,
    };
};
exports.markAlertNotified = markAlertNotified;
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
const adjustQuotaLimit = (quota, request) => {
    return {
        ...quota,
        limit: request.newLimit,
        status: (0, exports.determineQuotaStatus)(quota.currentUsage, request.newLimit, quota.warningThreshold),
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
exports.adjustQuotaLimit = adjustQuotaLimit;
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
const scaleQuotaByFactor = (quota, factor) => {
    const newLimit = Math.floor(quota.limit * factor);
    return (0, exports.updateQuotaLimit)(quota, newLimit);
};
exports.scaleQuotaByFactor = scaleQuotaByFactor;
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
const autoScaleQuota = (quota, stats) => {
    const usagePercent = (0, exports.calculateUsagePercentage)(quota);
    // Scale up if consistently above 80%
    if (usagePercent > 80) {
        return (0, exports.scaleQuotaByFactor)(quota, 1.5);
    }
    // Scale down if consistently below 30%
    if (usagePercent < 30) {
        return (0, exports.scaleQuotaByFactor)(quota, 0.75);
    }
    return quota;
};
exports.autoScaleQuota = autoScaleQuota;
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
const calculateResetTime = (period, from = new Date()) => {
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
exports.calculateResetTime = calculateResetTime;
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
const getTimeUntilReset = (quota) => {
    return Math.max(0, quota.resetAt.getTime() - Date.now());
};
exports.getTimeUntilReset = getTimeUntilReset;
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
const periodToMilliseconds = (period) => {
    const periods = {
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
exports.periodToMilliseconds = periodToMilliseconds;
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
const findQuotasByTenant = (tenantId, quotas) => {
    return quotas.filter(q => q.tenantId === tenantId);
};
exports.findQuotasByTenant = findQuotasByTenant;
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
const findQuotasByType = (type, quotas) => {
    return quotas.filter(q => q.type === type);
};
exports.findQuotasByType = findQuotasByType;
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
const findExceededQuotas = (quotas) => {
    return quotas.filter(q => q.status === QuotaStatus.EXCEEDED);
};
exports.findExceededQuotas = findExceededQuotas;
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
const getQuotaSummary = (quotas) => {
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
exports.getQuotaSummary = getQuotaSummary;
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
const cloneQuota = (quota, newTenantId) => {
    return {
        ...quota,
        id: (0, exports.createQuotaId)(),
        tenantId: newTenantId,
        currentUsage: 0,
        resetAt: (0, exports.calculateResetTime)(quota.period),
        status: QuotaStatus.NORMAL,
    };
};
exports.cloneQuota = cloneQuota;
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
const compareQuotas = (a, b) => {
    return (a.type === b.type &&
        a.limit === b.limit &&
        a.period === b.period &&
        a.warningThreshold === b.warningThreshold);
};
exports.compareQuotas = compareQuotas;
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
const serializeQuota = (quota) => {
    return JSON.stringify(quota);
};
exports.serializeQuota = serializeQuota;
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
const deserializeQuota = (json) => {
    const obj = JSON.parse(json);
    return {
        ...obj,
        resetAt: new Date(obj.resetAt),
    };
};
exports.deserializeQuota = deserializeQuota;
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
const formatQuotaStatus = (quota) => {
    const usagePercent = (0, exports.calculateUsagePercentage)(quota).toFixed(1);
    const remaining = (0, exports.getRemainingQuota)(quota);
    const resetMs = (0, exports.getTimeUntilReset)(quota);
    const resetMin = Math.ceil(resetMs / 60000);
    return `${quota.currentUsage}/${quota.limit} (${usagePercent}%) - ${quota.status.toUpperCase()} - ${remaining} remaining - Resets in ${resetMin} minutes`;
};
exports.formatQuotaStatus = formatQuotaStatus;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Creation
    createQuotaId: exports.createQuotaId,
    createTenantId: exports.createTenantId,
    createQuota: exports.createQuota,
    createDefaultQuotas: exports.createDefaultQuotas,
    updateQuotaLimit: exports.updateQuotaLimit,
    // Token bucket
    createTokenBucket: exports.createTokenBucket,
    refillTokenBucket: exports.refillTokenBucket,
    consumeTokens: exports.consumeTokens,
    getTokenBucketStatus: exports.getTokenBucketStatus,
    // Sliding window
    createSlidingWindow: exports.createSlidingWindow,
    cleanSlidingWindow: exports.cleanSlidingWindow,
    checkSlidingWindowLimit: exports.checkSlidingWindowLimit,
    getSlidingWindowStatus: exports.getSlidingWindowStatus,
    // Enforcement
    checkQuota: exports.checkQuota,
    consumeQuota: exports.consumeQuota,
    shouldResetQuota: exports.shouldResetQuota,
    resetQuotaUsage: exports.resetQuotaUsage,
    determineQuotaStatus: exports.determineQuotaStatus,
    // Usage tracking
    createUsageRecord: exports.createUsageRecord,
    aggregateUsage: exports.aggregateUsage,
    calculateUsagePercentage: exports.calculateUsagePercentage,
    getRemainingQuota: exports.getRemainingQuota,
    // Alerts
    createQuotaAlert: exports.createQuotaAlert,
    shouldTriggerAlert: exports.shouldTriggerAlert,
    markAlertNotified: exports.markAlertNotified,
    // Adjustment
    adjustQuotaLimit: exports.adjustQuotaLimit,
    scaleQuotaByFactor: exports.scaleQuotaByFactor,
    autoScaleQuota: exports.autoScaleQuota,
    // Time
    calculateResetTime: exports.calculateResetTime,
    getTimeUntilReset: exports.getTimeUntilReset,
    periodToMilliseconds: exports.periodToMilliseconds,
    // Queries
    findQuotasByTenant: exports.findQuotasByTenant,
    findQuotasByType: exports.findQuotasByType,
    findExceededQuotas: exports.findExceededQuotas,
    getQuotaSummary: exports.getQuotaSummary,
    // Utilities
    cloneQuota: exports.cloneQuota,
    compareQuotas: exports.compareQuotas,
    serializeQuota: exports.serializeQuota,
    deserializeQuota: exports.deserializeQuota,
    formatQuotaStatus: exports.formatQuotaStatus,
};
//# sourceMappingURL=iam-quota-kit.js.map