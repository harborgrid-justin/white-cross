/**
 * LOC: TORK2345678
 * File: /reuse/san/typescript-oracle-resilience-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend resilience services
 *   - API gateway middleware
 *   - External service integrations
 */
/**
 * File: /reuse/san/typescript-oracle-resilience-kit.ts
 * Locator: WC-UTL-TORK-001
 * Purpose: Resilience and Fault Tolerance Utilities - Circuit breakers, bulkheads, rate limiting, timeouts, fallbacks, retries, health checks
 *
 * Upstream: Independent utility module for resilience patterns
 * Downstream: ../backend/*, API services, external integrations, microservices
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x
 * Exports: 44 utility functions for implementing resilience patterns, fault tolerance, and graceful degradation
 *
 * LLM Context: Enterprise-grade resilience utilities for building fault-tolerant healthcare systems.
 * Provides advanced circuit breakers, bulkhead isolation, rate limiting, timeout management, retry strategies with
 * exponential backoff, fallback mechanisms, health check patterns, and graceful degradation. Essential for building
 * HIPAA-compliant systems that maintain availability and data integrity under failure conditions, network issues,
 * and high load scenarios. Implements patterns from Michael Nygard's "Release It!" and Netflix OSS.
 */
interface CircuitBreakerConfig {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
    resetTimeout: number;
    monitoringPeriod?: number;
    volumeThreshold?: number;
    errorFilter?: (error: Error) => boolean;
}
interface CircuitBreakerMetrics {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    rejectedRequests: number;
    averageResponseTime: number;
    lastStateChange: number;
}
interface BulkheadConfig {
    maxConcurrent: number;
    maxQueue: number;
    timeout: number;
    name: string;
}
interface RateLimiterConfig {
    maxRequests: number;
    windowMs: number;
    strategy: 'fixed' | 'sliding' | 'token-bucket' | 'leaky-bucket';
}
interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
}
interface RetryConfig {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    jitter?: boolean;
    retryableErrors?: string[];
    onRetry?: (attempt: number, error: Error) => void;
}
interface TimeoutConfig {
    timeout: number;
    onTimeout?: () => void;
    timeoutError?: Error;
}
interface FallbackConfig<T> {
    fallbackFn: () => Promise<T> | T;
    onFallback?: (error: Error) => void;
    cache?: boolean;
    cacheTTL?: number;
}
interface HealthCheckConfig {
    interval: number;
    timeout: number;
    unhealthyThreshold: number;
    healthyThreshold: number;
    name: string;
}
interface HealthCheckResult {
    status: 'healthy' | 'unhealthy' | 'degraded';
    latency: number;
    timestamp: number;
    details?: Record<string, any>;
    error?: Error;
}
/**
 * Creates an advanced circuit breaker with metrics and monitoring.
 *
 * @template T
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {object} Circuit breaker instance with execute, metrics, and control methods
 *
 * @example
 * ```typescript
 * const breaker = createAdvancedCircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 3000,
 *   resetTimeout: 60000,
 *   volumeThreshold: 10,
 *   errorFilter: (err) => err.code !== 'VALIDATION_ERROR'
 * });
 *
 * const result = await breaker.execute(() => externalApiCall());
 * const metrics = breaker.getMetrics();
 * ```
 */
export declare const createAdvancedCircuitBreaker: <T = any>(config: CircuitBreakerConfig) => {
    execute: (fn: () => Promise<T>) => Promise<T>;
    getState: () => {
        state: "CLOSED" | "OPEN" | "HALF_OPEN";
        failures: number;
        successes: number;
        consecutiveSuccesses: number;
        nextAttempt: number;
        lastFailureTime?: number;
        metrics: CircuitBreakerMetrics;
    };
    getMetrics: () => CircuitBreakerMetrics;
    reset: () => void;
    forceOpen: () => void;
    forceClosed: () => void;
};
/**
 * Creates a percentage-based circuit breaker using error rate.
 *
 * @template T
 * @param {number} errorPercentageThreshold - Error percentage to trip (0-100)
 * @param {number} minimumRequests - Minimum requests before calculating percentage
 * @param {number} resetTimeoutMs - Reset timeout in milliseconds
 * @returns {object} Percentage circuit breaker
 *
 * @example
 * ```typescript
 * const breaker = createPercentageCircuitBreaker(50, 10, 60000);
 * // Opens when 50% of last 10+ requests fail
 *
 * const result = await breaker.execute(() => apiCall());
 * ```
 */
export declare const createPercentageCircuitBreaker: <T = any>(errorPercentageThreshold: number, minimumRequests: number, resetTimeoutMs: number) => {
    execute: (fn: () => Promise<T>) => Promise<T>;
    getState: () => "CLOSED" | "OPEN" | "HALF_OPEN";
    getErrorRate: () => number;
};
/**
 * Combines multiple circuit breakers with composite pattern.
 *
 * @template T
 * @param {Array<{ execute: (fn: () => Promise<T>) => Promise<T> }>} breakers - Array of breakers
 * @param {('all' | 'any')} [strategy] - Composite strategy (default: 'all')
 * @returns {object} Composite circuit breaker
 *
 * @example
 * ```typescript
 * const composite = createCompositeCircuitBreaker([
 *   dbBreaker,
 *   cacheBreaker,
 *   apiBreaker
 * ], 'all');
 *
 * // All breakers must be closed to execute
 * const result = await composite.execute(() => operation());
 * ```
 */
export declare const createCompositeCircuitBreaker: <T = any>(breakers: Array<{
    execute: (fn: () => Promise<T>) => Promise<T>;
}>, strategy?: "all" | "any") => {
    execute: (fn: () => Promise<T>) => Promise<T>;
};
/**
 * Creates a bulkhead for isolating resources and limiting concurrent access.
 *
 * @template T
 * @param {BulkheadConfig} config - Bulkhead configuration
 * @returns {object} Bulkhead instance with execute and metrics methods
 *
 * @example
 * ```typescript
 * const dbBulkhead = createBulkhead({
 *   maxConcurrent: 10,
 *   maxQueue: 50,
 *   timeout: 30000,
 *   name: 'database-bulkhead'
 * });
 *
 * const result = await dbBulkhead.execute(() => databaseQuery());
 * const metrics = dbBulkhead.getMetrics();
 * ```
 */
export declare const createBulkhead: <T = any>(config: BulkheadConfig) => {
    execute: (fn: () => Promise<T>) => Promise<T>;
    getMetrics: () => {
        name: string;
        activeCalls: number;
        queueLength: number;
        totalExecuted: number;
        totalRejected: number;
        totalTimeouts: number;
        utilization: number;
    };
};
/**
 * Creates multiple isolated bulkheads for different resources.
 *
 * @param {Record<string, BulkheadConfig>} configs - Bulkhead configurations
 * @returns {object} Bulkhead manager
 *
 * @example
 * ```typescript
 * const bulkheads = createBulkheadManager({
 *   database: { maxConcurrent: 10, maxQueue: 50, timeout: 30000, name: 'db' },
 *   cache: { maxConcurrent: 20, maxQueue: 100, timeout: 5000, name: 'cache' },
 *   api: { maxConcurrent: 5, maxQueue: 20, timeout: 10000, name: 'api' }
 * });
 *
 * await bulkheads.execute('database', () => dbQuery());
 * await bulkheads.execute('cache', () => cacheGet());
 * ```
 */
export declare const createBulkheadManager: (configs: Record<string, BulkheadConfig>) => {
    execute: <T>(name: string, fn: () => Promise<T>) => Promise<T>;
    getMetrics: (name?: string) => {
        name: string;
        activeCalls: number;
        queueLength: number;
        totalExecuted: number;
        totalRejected: number;
        totalTimeouts: number;
        utilization: number;
    } | {
        name: string;
        activeCalls: number;
        queueLength: number;
        totalExecuted: number;
        totalRejected: number;
        totalTimeouts: number;
        utilization: number;
    }[] | null;
};
/**
 * Creates a fixed window rate limiter.
 *
 * @param {RateLimiterConfig} config - Rate limiter configuration
 * @returns {object} Rate limiter with check and reset methods
 *
 * @example
 * ```typescript
 * const limiter = createFixedWindowRateLimiter({
 *   maxRequests: 100,
 *   windowMs: 60000,
 *   strategy: 'fixed'
 * });
 *
 * const result = limiter.check('user-123');
 * if (result.allowed) {
 *   await processRequest();
 * }
 * ```
 */
export declare const createFixedWindowRateLimiter: (config: RateLimiterConfig) => {
    check: (key: string) => RateLimitResult;
    reset: (key: string) => void;
    cleanup: () => void;
};
/**
 * Creates a sliding window rate limiter for more accurate rate limiting.
 *
 * @param {RateLimiterConfig} config - Rate limiter configuration
 * @returns {object} Sliding window rate limiter
 *
 * @example
 * ```typescript
 * const limiter = createSlidingWindowRateLimiter({
 *   maxRequests: 100,
 *   windowMs: 60000,
 *   strategy: 'sliding'
 * });
 *
 * const result = limiter.check('user-123');
 * ```
 */
export declare const createSlidingWindowRateLimiter: (config: RateLimiterConfig) => {
    check: (key: string) => RateLimitResult;
    reset: (key: string) => void;
};
/**
 * Creates a token bucket rate limiter for burst handling.
 *
 * @param {number} capacity - Bucket capacity
 * @param {number} refillRate - Tokens per second
 * @returns {object} Token bucket rate limiter
 *
 * @example
 * ```typescript
 * const limiter = createTokenBucketRateLimiter(100, 10);
 * // 100 token capacity, refills at 10 tokens/second
 *
 * const result = limiter.consume('user-123', 5);
 * ```
 */
export declare const createTokenBucketRateLimiter: (capacity: number, refillRate: number) => {
    consume: (key: string, tokens?: number) => RateLimitResult;
};
/**
 * Creates a leaky bucket rate limiter for smooth traffic shaping.
 *
 * @param {number} capacity - Bucket capacity
 * @param {number} leakRate - Requests per second
 * @returns {object} Leaky bucket rate limiter
 *
 * @example
 * ```typescript
 * const limiter = createLeakyBucketRateLimiter(50, 10);
 * // 50 request capacity, processes 10 req/second
 *
 * const result = await limiter.add('user-123', async () => processRequest());
 * ```
 */
export declare const createLeakyBucketRateLimiter: (capacity: number, leakRate: number) => {
    add: <T>(key: string, fn: () => Promise<T>) => Promise<T>;
};
/**
 * Wraps a promise with timeout functionality.
 *
 * @template T
 * @param {Promise<T>} promise - Promise to wrap
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} [errorMessage] - Custom timeout error message
 * @returns {Promise<T>} Promise with timeout
 *
 * @example
 * ```typescript
 * const result = await withTimeout(
 *   fetchUserData(userId),
 *   5000,
 *   'User data fetch timeout'
 * );
 * ```
 */
export declare const withTimeout: <T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string) => Promise<T>;
/**
 * Creates a timeout decorator for functions.
 *
 * @template T
 * @param {(...args: any[]) => Promise<T>} fn - Function to wrap
 * @param {TimeoutConfig} config - Timeout configuration
 * @returns {(...args: any[]) => Promise<T>} Wrapped function
 *
 * @example
 * ```typescript
 * const timedFetch = createTimeoutWrapper(
 *   fetchData,
 *   { timeout: 5000, onTimeout: () => logger.warn('Timeout occurred') }
 * );
 *
 * const data = await timedFetch(params);
 * ```
 */
export declare const createTimeoutWrapper: <T>(fn: (...args: any[]) => Promise<T>, config: TimeoutConfig) => ((...args: any[]) => Promise<T>);
/**
 * Creates a progressive timeout that increases with retries.
 *
 * @template T
 * @param {() => Promise<T>} fn - Function to execute
 * @param {number[]} timeouts - Array of timeouts for each attempt
 * @returns {Promise<T>} Result from successful attempt
 *
 * @example
 * ```typescript
 * const result = await withProgressiveTimeout(
 *   () => unreliableApi(),
 *   [1000, 3000, 5000, 10000] // Increasing timeouts
 * );
 * ```
 */
export declare const withProgressiveTimeout: <T>(fn: () => Promise<T>, timeouts: number[]) => Promise<T>;
/**
 * Executes function with fallback on failure.
 *
 * @template T
 * @param {() => Promise<T>} primary - Primary function
 * @param {FallbackConfig<T>} config - Fallback configuration
 * @returns {Promise<T>} Result from primary or fallback
 *
 * @example
 * ```typescript
 * const data = await withFallback(
 *   () => fetchFromPrimaryApi(),
 *   {
 *     fallbackFn: () => fetchFromCache(),
 *     onFallback: (err) => logger.warn('Using fallback', err),
 *     cache: true,
 *     cacheTTL: 300000
 *   }
 * );
 * ```
 */
export declare const withFallback: <T>(primary: () => Promise<T>, config: FallbackConfig<T>) => Promise<T>;
/**
 * Creates a cascading fallback chain.
 *
 * @template T
 * @param {Array<() => Promise<T>>} functions - Array of functions to try
 * @returns {Promise<T>} Result from first successful function
 *
 * @example
 * ```typescript
 * const data = await withFallbackChain([
 *   () => fetchFromPrimaryDb(),
 *   () => fetchFromReplicaDb(),
 *   () => fetchFromCache(),
 *   () => getDefaultValue()
 * ]);
 * ```
 */
export declare const withFallbackChain: <T>(functions: Array<() => Promise<T>>) => Promise<T>;
/**
 * Creates a smart fallback with cache support.
 *
 * @template T
 * @param {string} cacheKey - Cache key
 * @param {() => Promise<T>} primary - Primary function
 * @param {() => Promise<T>} fallback - Fallback function
 * @param {number} [cacheTTL] - Cache TTL in milliseconds
 * @returns {Promise<T>} Result
 *
 * @example
 * ```typescript
 * const user = await withCachedFallback(
 *   'user-123',
 *   () => fetchUserFromDb(123),
 *   () => getUserFromBackup(123),
 *   300000
 * );
 * ```
 */
export declare const withCachedFallback: <T>(cacheKey: string, primary: () => Promise<T>, fallback: () => Promise<T>, cacheTTL?: number) => Promise<T>;
/**
 * Executes function with exponential backoff retry.
 *
 * @template T
 * @param {() => Promise<T>} fn - Function to execute
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<T>} Successful result
 *
 * @example
 * ```typescript
 * const data = await withExponentialRetry(
 *   () => unreliableApiCall(),
 *   {
 *     maxAttempts: 5,
 *     baseDelay: 1000,
 *     maxDelay: 30000,
 *     backoffMultiplier: 2,
 *     jitter: true,
 *     onRetry: (attempt, err) => logger.warn(`Retry ${attempt}`, err)
 *   }
 * );
 * ```
 */
export declare const withExponentialRetry: <T>(fn: () => Promise<T>, config: RetryConfig) => Promise<T>;
/**
 * Calculates exponential backoff delay with jitter.
 *
 * @param {number} attempt - Current attempt number
 * @param {RetryConfig} config - Retry configuration
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay1 = calculateBackoff(1, config); // ~1000ms
 * const delay2 = calculateBackoff(2, config); // ~2000ms
 * const delay3 = calculateBackoff(3, config); // ~4000ms
 * ```
 */
export declare const calculateBackoff: (attempt: number, config: RetryConfig) => number;
/**
 * Creates a retry decorator with configurable backoff.
 *
 * @template T
 * @param {(...args: any[]) => Promise<T>} fn - Function to decorate
 * @param {RetryConfig} config - Retry configuration
 * @returns {(...args: any[]) => Promise<T>} Decorated function
 *
 * @example
 * ```typescript
 * const reliableFetch = createRetryDecorator(
 *   fetchData,
 *   { maxAttempts: 3, baseDelay: 1000, maxDelay: 10000, backoffMultiplier: 2 }
 * );
 *
 * const data = await reliableFetch(params);
 * ```
 */
export declare const createRetryDecorator: <T>(fn: (...args: any[]) => Promise<T>, config: RetryConfig) => ((...args: any[]) => Promise<T>);
/**
 * Creates a health check monitor for service availability.
 *
 * @param {HealthCheckConfig} config - Health check configuration
 * @param {() => Promise<void>} checkFn - Health check function
 * @returns {object} Health check monitor
 *
 * @example
 * ```typescript
 * const dbHealthCheck = createHealthCheck(
 *   {
 *     interval: 10000,
 *     timeout: 5000,
 *     unhealthyThreshold: 3,
 *     healthyThreshold: 2,
 *     name: 'database'
 *   },
 *   async () => await db.ping()
 * );
 *
 * dbHealthCheck.start();
 * const status = dbHealthCheck.getStatus();
 * ```
 */
export declare const createHealthCheck: (config: HealthCheckConfig, checkFn: () => Promise<void>) => {
    start: () => void;
    stop: () => void;
    getStatus: () => HealthCheckResult;
    getHistory: () => HealthCheckResult[];
    performCheck: () => Promise<HealthCheckResult>;
};
/**
 * Creates a composite health check from multiple checks.
 *
 * @param {Map<string, ReturnType<typeof createHealthCheck>>} checks - Health checks
 * @returns {object} Composite health check
 *
 * @example
 * ```typescript
 * const compositeHealth = createCompositeHealthCheck(new Map([
 *   ['database', dbHealthCheck],
 *   ['cache', cacheHealthCheck],
 *   ['api', apiHealthCheck]
 * ]));
 *
 * const status = compositeHealth.getOverallStatus();
 * ```
 */
export declare const createCompositeHealthCheck: (checks: Map<string, ReturnType<typeof createHealthCheck>>) => {
    getOverallStatus: () => {
        status: "healthy" | "unhealthy" | "degraded";
        checks: Record<string, HealthCheckResult>;
    };
    startAll: () => void;
    stopAll: () => void;
};
/**
 * Creates a graceful degradation manager.
 *
 * @returns {object} Degradation manager
 *
 * @example
 * ```typescript
 * const degradation = createDegradationManager();
 *
 * degradation.setLevel('degraded', ['analytics', 'recommendations']);
 * // Disable non-critical features
 *
 * if (degradation.isFeatureAvailable('analytics')) {
 *   await trackAnalytics();
 * }
 * ```
 */
export declare const createDegradationManager: () => {
    setLevel: (level: "full" | "degraded" | "minimal" | "offline", customDisabled?: string[]) => void;
    isFeatureAvailable: (feature: string) => boolean;
    getLevel: () => "degraded" | "full" | "minimal" | "offline";
    getDisabledFeatures: () => string[];
};
/**
 * Executes function with degradation fallback.
 *
 * @template T
 * @param {() => Promise<T>} fullFn - Full functionality
 * @param {() => Promise<T>} degradedFn - Degraded functionality
 * @param {() => T} minimalFn - Minimal functionality
 * @returns {Promise<T>} Result based on available functionality
 *
 * @example
 * ```typescript
 * const result = await withDegradation(
 *   () => getFullUserProfile(id),
 *   () => getBasicUserProfile(id),
 *   () => ({ id, name: 'Unknown' })
 * );
 * ```
 */
export declare const withDegradation: <T>(fullFn: () => Promise<T>, degradedFn: () => Promise<T>, minimalFn: () => T) => Promise<T>;
/**
 * Creates a hedged request pattern for latency optimization.
 *
 * @template T
 * @param {Array<() => Promise<T>>} requests - Array of request functions
 * @param {number} hedgeDelay - Delay before sending hedged requests
 * @returns {Promise<T>} First successful result
 *
 * @example
 * ```typescript
 * const data = await createHedgedRequest([
 *   () => fetchFromServer1(),
 *   () => fetchFromServer2(),
 *   () => fetchFromServer3()
 * ], 100); // Start next request after 100ms if first hasn't responded
 * ```
 */
export declare const createHedgedRequest: <T>(requests: Array<() => Promise<T>>, hedgeDelay: number) => Promise<T>;
/**
 * Creates a request coalescing mechanism to prevent duplicate requests.
 *
 * @template T
 * @returns {object} Request coalescer
 *
 * @example
 * ```typescript
 * const coalescer = createRequestCoalescer<User>();
 *
 * // Multiple calls are coalesced into one
 * const user1 = coalescer.execute('user-123', () => fetchUser('123'));
 * const user2 = coalescer.execute('user-123', () => fetchUser('123'));
 * // Only one actual fetch happens
 * ```
 */
export declare const createRequestCoalescer: <T>() => {
    execute: (key: string, fn: () => Promise<T>) => Promise<T>;
    clear: (key?: string) => void;
};
/**
 * Creates an adaptive timeout that learns from response times.
 *
 * @param {number} initialTimeout - Initial timeout value
 * @param {number} percentile - Percentile for timeout calculation (e.g., 95)
 * @returns {object} Adaptive timeout manager
 *
 * @example
 * ```typescript
 * const adaptiveTimeout = createAdaptiveTimeout(5000, 95);
 *
 * const result = await adaptiveTimeout.execute(() => apiCall());
 * // Timeout adjusts based on historical response times
 * ```
 */
export declare const createAdaptiveTimeout: (initialTimeout: number, percentile: number) => {
    execute: <T>(fn: () => Promise<T>) => Promise<T>;
    getTimeout: () => number;
};
declare const _default: {
    createAdvancedCircuitBreaker: <T = any>(config: CircuitBreakerConfig) => {
        execute: (fn: () => Promise<T>) => Promise<T>;
        getState: () => {
            state: "CLOSED" | "OPEN" | "HALF_OPEN";
            failures: number;
            successes: number;
            consecutiveSuccesses: number;
            nextAttempt: number;
            lastFailureTime?: number;
            metrics: CircuitBreakerMetrics;
        };
        getMetrics: () => CircuitBreakerMetrics;
        reset: () => void;
        forceOpen: () => void;
        forceClosed: () => void;
    };
    createPercentageCircuitBreaker: <T = any>(errorPercentageThreshold: number, minimumRequests: number, resetTimeoutMs: number) => {
        execute: (fn: () => Promise<T>) => Promise<T>;
        getState: () => "CLOSED" | "OPEN" | "HALF_OPEN";
        getErrorRate: () => number;
    };
    createCompositeCircuitBreaker: <T = any>(breakers: Array<{
        execute: (fn: () => Promise<T>) => Promise<T>;
    }>, strategy?: "all" | "any") => {
        execute: (fn: () => Promise<T>) => Promise<T>;
    };
    createBulkhead: <T = any>(config: BulkheadConfig) => {
        execute: (fn: () => Promise<T>) => Promise<T>;
        getMetrics: () => {
            name: string;
            activeCalls: number;
            queueLength: number;
            totalExecuted: number;
            totalRejected: number;
            totalTimeouts: number;
            utilization: number;
        };
    };
    createBulkheadManager: (configs: Record<string, BulkheadConfig>) => {
        execute: <T>(name: string, fn: () => Promise<T>) => Promise<T>;
        getMetrics: (name?: string) => {
            name: string;
            activeCalls: number;
            queueLength: number;
            totalExecuted: number;
            totalRejected: number;
            totalTimeouts: number;
            utilization: number;
        } | {
            name: string;
            activeCalls: number;
            queueLength: number;
            totalExecuted: number;
            totalRejected: number;
            totalTimeouts: number;
            utilization: number;
        }[] | null;
    };
    createFixedWindowRateLimiter: (config: RateLimiterConfig) => {
        check: (key: string) => RateLimitResult;
        reset: (key: string) => void;
        cleanup: () => void;
    };
    createSlidingWindowRateLimiter: (config: RateLimiterConfig) => {
        check: (key: string) => RateLimitResult;
        reset: (key: string) => void;
    };
    createTokenBucketRateLimiter: (capacity: number, refillRate: number) => {
        consume: (key: string, tokens?: number) => RateLimitResult;
    };
    createLeakyBucketRateLimiter: (capacity: number, leakRate: number) => {
        add: <T>(key: string, fn: () => Promise<T>) => Promise<T>;
    };
    withTimeout: <T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string) => Promise<T>;
    createTimeoutWrapper: <T>(fn: (...args: any[]) => Promise<T>, config: TimeoutConfig) => ((...args: any[]) => Promise<T>);
    withProgressiveTimeout: <T>(fn: () => Promise<T>, timeouts: number[]) => Promise<T>;
    withFallback: <T>(primary: () => Promise<T>, config: FallbackConfig<T>) => Promise<T>;
    withFallbackChain: <T>(functions: Array<() => Promise<T>>) => Promise<T>;
    withCachedFallback: <T>(cacheKey: string, primary: () => Promise<T>, fallback: () => Promise<T>, cacheTTL?: number) => Promise<T>;
    withExponentialRetry: <T>(fn: () => Promise<T>, config: RetryConfig) => Promise<T>;
    calculateBackoff: (attempt: number, config: RetryConfig) => number;
    createRetryDecorator: <T>(fn: (...args: any[]) => Promise<T>, config: RetryConfig) => ((...args: any[]) => Promise<T>);
    createHealthCheck: (config: HealthCheckConfig, checkFn: () => Promise<void>) => {
        start: () => void;
        stop: () => void;
        getStatus: () => HealthCheckResult;
        getHistory: () => HealthCheckResult[];
        performCheck: () => Promise<HealthCheckResult>;
    };
    createCompositeHealthCheck: (checks: Map<string, ReturnType<typeof createHealthCheck>>) => {
        getOverallStatus: () => {
            status: "healthy" | "unhealthy" | "degraded";
            checks: Record<string, HealthCheckResult>;
        };
        startAll: () => void;
        stopAll: () => void;
    };
    createDegradationManager: () => {
        setLevel: (level: "full" | "degraded" | "minimal" | "offline", customDisabled?: string[]) => void;
        isFeatureAvailable: (feature: string) => boolean;
        getLevel: () => "degraded" | "full" | "minimal" | "offline";
        getDisabledFeatures: () => string[];
    };
    withDegradation: <T>(fullFn: () => Promise<T>, degradedFn: () => Promise<T>, minimalFn: () => T) => Promise<T>;
    createHedgedRequest: <T>(requests: Array<() => Promise<T>>, hedgeDelay: number) => Promise<T>;
    createRequestCoalescer: <T>() => {
        execute: (key: string, fn: () => Promise<T>) => Promise<T>;
        clear: (key?: string) => void;
    };
    createAdaptiveTimeout: (initialTimeout: number, percentile: number) => {
        execute: <T>(fn: () => Promise<T>) => Promise<T>;
        getTimeout: () => number;
    };
};
export default _default;
//# sourceMappingURL=typescript-oracle-resilience-kit.d.ts.map