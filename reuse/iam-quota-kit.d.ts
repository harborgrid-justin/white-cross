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
import { UserId } from './iam-types-kit';
/**
 * Quota type
 */
export declare enum QuotaType {
    API_REQUESTS = "api_requests",
    IAM_OPERATIONS = "iam_operations",
    DATA_TRANSFER = "data_transfer",
    STORAGE = "storage",
    CONCURRENT_SESSIONS = "concurrent_sessions",
    USER_CREATIONS = "user_creations",
    ROLE_ASSIGNMENTS = "role_assignments"
}
/**
 * Rate limit algorithm
 */
export declare enum RateLimitAlgorithm {
    TOKEN_BUCKET = "token_bucket",
    SLIDING_WINDOW = "sliding_window",
    FIXED_WINDOW = "fixed_window",
    LEAKY_BUCKET = "leaky_bucket"
}
/**
 * Quota period
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
 * Quota status
 */
export declare enum QuotaStatus {
    NORMAL = "normal",
    WARNING = "warning",
    EXCEEDED = "exceeded",
    SUSPENDED = "suspended"
}
/**
 * Tenant ID branded type
 */
export type TenantId = string & {
    __brand: 'TenantId';
};
/**
 * Quota ID branded type
 */
export type QuotaId = string & {
    __brand: 'QuotaId';
};
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
    readonly warningThreshold: number;
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
    readonly refillRate: number;
    readonly lastRefill: Date;
}
/**
 * Sliding window state
 */
export interface SlidingWindowState {
    readonly windowSize: number;
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
export declare const createQuotaId: () => QuotaId;
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
export declare const createTenantId: () => TenantId;
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
export declare const createQuota: (tenantId: TenantId, type: QuotaType, limit: number, period: QuotaPeriod, warningThreshold?: number) => Quota;
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
export declare const createDefaultQuotas: (tenantId: TenantId) => Quota[];
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
export declare const updateQuotaLimit: (quota: Quota, newLimit: number) => Quota;
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
export declare const createTokenBucket: (capacity: number, refillRate: number) => TokenBucketState;
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
export declare const refillTokenBucket: (bucket: TokenBucketState) => TokenBucketState;
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
export declare const consumeTokens: (bucket: TokenBucketState, tokens?: number) => {
    allowed: boolean;
    bucket: TokenBucketState;
    remainingTokens: number;
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
export declare const getTokenBucketStatus: (bucket: TokenBucketState) => {
    capacity: number;
    availableTokens: number;
    utilizationPercent: number;
    refillRate: number;
};
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
export declare const createSlidingWindow: (windowSizeMs: number, limit: number) => SlidingWindowState;
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
export declare const cleanSlidingWindow: (window: SlidingWindowState) => SlidingWindowState;
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
export declare const checkSlidingWindowLimit: (window: SlidingWindowState, weight?: number) => {
    allowed: boolean;
    window: SlidingWindowState;
    currentCount: number;
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
export declare const getSlidingWindowStatus: (window: SlidingWindowState) => {
    limit: number;
    currentCount: number;
    remainingCount: number;
    utilizationPercent: number;
    oldestRequest?: Date;
};
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
export declare const checkQuota: (quota: Quota, amount?: number) => QuotaEnforcementResult;
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
export declare const consumeQuota: (quota: Quota, amount?: number) => Quota;
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
export declare const shouldResetQuota: (quota: Quota) => boolean;
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
export declare const resetQuotaUsage: (quota: Quota) => Quota;
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
export declare const determineQuotaStatus: (currentUsage: number, limit: number, warningThreshold: number) => QuotaStatus;
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
export declare const createUsageRecord: (tenantId: TenantId, quotaType: QuotaType, amount: number, userId?: UserId) => UsageRecord;
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
export declare const aggregateUsage: (records: UsageRecord[], period: QuotaPeriod) => UsageStatistics | null;
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
export declare const calculateUsagePercentage: (quota: Quota) => number;
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
export declare const getRemainingQuota: (quota: Quota) => number;
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
export declare const createQuotaAlert: (quota: Quota, alertType: "warning" | "exceeded" | "suspended") => QuotaAlert;
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
export declare const shouldTriggerAlert: (quota: Quota) => {
    shouldAlert: boolean;
    alertType?: "warning" | "exceeded";
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
export declare const markAlertNotified: (alert: QuotaAlert) => QuotaAlert;
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
export declare const adjustQuotaLimit: (quota: Quota, request: QuotaAdjustmentRequest) => Quota;
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
export declare const scaleQuotaByFactor: (quota: Quota, factor: number) => Quota;
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
export declare const autoScaleQuota: (quota: Quota, stats: UsageStatistics) => Quota;
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
export declare const calculateResetTime: (period: QuotaPeriod, from?: Date) => Date;
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
export declare const getTimeUntilReset: (quota: Quota) => number;
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
export declare const periodToMilliseconds: (period: QuotaPeriod) => number;
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
export declare const findQuotasByTenant: (tenantId: TenantId, quotas: Quota[]) => Quota[];
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
export declare const findQuotasByType: (type: QuotaType, quotas: Quota[]) => Quota[];
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
export declare const findExceededQuotas: (quotas: Quota[]) => Quota[];
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
export declare const getQuotaSummary: (quotas: Quota[]) => {
    total: number;
    normal: number;
    warning: number;
    exceeded: number;
    suspended: number;
    byType: Record<QuotaType, number>;
};
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
export declare const cloneQuota: (quota: Quota, newTenantId: TenantId) => Quota;
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
export declare const compareQuotas: (a: Quota, b: Quota) => boolean;
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
export declare const serializeQuota: (quota: Quota) => string;
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
export declare const deserializeQuota: (json: string) => Quota;
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
export declare const formatQuotaStatus: (quota: Quota) => string;
declare const _default: {
    createQuotaId: () => QuotaId;
    createTenantId: () => TenantId;
    createQuota: (tenantId: TenantId, type: QuotaType, limit: number, period: QuotaPeriod, warningThreshold?: number) => Quota;
    createDefaultQuotas: (tenantId: TenantId) => Quota[];
    updateQuotaLimit: (quota: Quota, newLimit: number) => Quota;
    createTokenBucket: (capacity: number, refillRate: number) => TokenBucketState;
    refillTokenBucket: (bucket: TokenBucketState) => TokenBucketState;
    consumeTokens: (bucket: TokenBucketState, tokens?: number) => {
        allowed: boolean;
        bucket: TokenBucketState;
        remainingTokens: number;
    };
    getTokenBucketStatus: (bucket: TokenBucketState) => {
        capacity: number;
        availableTokens: number;
        utilizationPercent: number;
        refillRate: number;
    };
    createSlidingWindow: (windowSizeMs: number, limit: number) => SlidingWindowState;
    cleanSlidingWindow: (window: SlidingWindowState) => SlidingWindowState;
    checkSlidingWindowLimit: (window: SlidingWindowState, weight?: number) => {
        allowed: boolean;
        window: SlidingWindowState;
        currentCount: number;
    };
    getSlidingWindowStatus: (window: SlidingWindowState) => {
        limit: number;
        currentCount: number;
        remainingCount: number;
        utilizationPercent: number;
        oldestRequest?: Date;
    };
    checkQuota: (quota: Quota, amount?: number) => QuotaEnforcementResult;
    consumeQuota: (quota: Quota, amount?: number) => Quota;
    shouldResetQuota: (quota: Quota) => boolean;
    resetQuotaUsage: (quota: Quota) => Quota;
    determineQuotaStatus: (currentUsage: number, limit: number, warningThreshold: number) => QuotaStatus;
    createUsageRecord: (tenantId: TenantId, quotaType: QuotaType, amount: number, userId?: UserId) => UsageRecord;
    aggregateUsage: (records: UsageRecord[], period: QuotaPeriod) => UsageStatistics | null;
    calculateUsagePercentage: (quota: Quota) => number;
    getRemainingQuota: (quota: Quota) => number;
    createQuotaAlert: (quota: Quota, alertType: "warning" | "exceeded" | "suspended") => QuotaAlert;
    shouldTriggerAlert: (quota: Quota) => {
        shouldAlert: boolean;
        alertType?: "warning" | "exceeded";
    };
    markAlertNotified: (alert: QuotaAlert) => QuotaAlert;
    adjustQuotaLimit: (quota: Quota, request: QuotaAdjustmentRequest) => Quota;
    scaleQuotaByFactor: (quota: Quota, factor: number) => Quota;
    autoScaleQuota: (quota: Quota, stats: UsageStatistics) => Quota;
    calculateResetTime: (period: QuotaPeriod, from?: Date) => Date;
    getTimeUntilReset: (quota: Quota) => number;
    periodToMilliseconds: (period: QuotaPeriod) => number;
    findQuotasByTenant: (tenantId: TenantId, quotas: Quota[]) => Quota[];
    findQuotasByType: (type: QuotaType, quotas: Quota[]) => Quota[];
    findExceededQuotas: (quotas: Quota[]) => Quota[];
    getQuotaSummary: (quotas: Quota[]) => {
        total: number;
        normal: number;
        warning: number;
        exceeded: number;
        suspended: number;
        byType: Record<QuotaType, number>;
    };
    cloneQuota: (quota: Quota, newTenantId: TenantId) => Quota;
    compareQuotas: (a: Quota, b: Quota) => boolean;
    serializeQuota: (quota: Quota) => string;
    deserializeQuota: (json: string) => Quota;
    formatQuotaStatus: (quota: Quota) => string;
};
export default _default;
//# sourceMappingURL=iam-quota-kit.d.ts.map