"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdaptiveTimeout = exports.createRequestCoalescer = exports.createHedgedRequest = exports.withDegradation = exports.createDegradationManager = exports.createCompositeHealthCheck = exports.createHealthCheck = exports.createRetryDecorator = exports.calculateBackoff = exports.withExponentialRetry = exports.withCachedFallback = exports.withFallbackChain = exports.withFallback = exports.withProgressiveTimeout = exports.createTimeoutWrapper = exports.withTimeout = exports.createLeakyBucketRateLimiter = exports.createTokenBucketRateLimiter = exports.createSlidingWindowRateLimiter = exports.createFixedWindowRateLimiter = exports.createBulkheadManager = exports.createBulkhead = exports.createCompositeCircuitBreaker = exports.createPercentageCircuitBreaker = exports.createAdvancedCircuitBreaker = void 0;
// ============================================================================
// CIRCUIT BREAKER ADVANCED PATTERNS
// ============================================================================
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
const createAdvancedCircuitBreaker = (config) => {
    const state = {
        state: 'CLOSED',
        failures: 0,
        successes: 0,
        consecutiveSuccesses: 0,
        nextAttempt: Date.now(),
        metrics: {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            rejectedRequests: 0,
            averageResponseTime: 0,
            lastStateChange: Date.now(),
        },
    };
    const responseTimes = [];
    const execute = async (fn) => {
        state.metrics.totalRequests++;
        if (state.state === 'OPEN') {
            if (Date.now() < state.nextAttempt) {
                state.metrics.rejectedRequests++;
                throw new Error(`Circuit breaker is OPEN. Retry after ${new Date(state.nextAttempt).toISOString()}`);
            }
            state.state = 'HALF_OPEN';
            state.consecutiveSuccesses = 0;
            state.metrics.lastStateChange = Date.now();
        }
        const startTime = Date.now();
        try {
            const result = await Promise.race([
                fn(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Circuit breaker timeout')), config.timeout)),
            ]);
            const responseTime = Date.now() - startTime;
            responseTimes.push(responseTime);
            if (responseTimes.length > 100)
                responseTimes.shift();
            state.metrics.averageResponseTime =
                responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
            handleSuccess();
            return result;
        }
        catch (error) {
            const err = error;
            if (config.errorFilter && !config.errorFilter(err)) {
                throw err;
            }
            handleFailure(err);
            throw err;
        }
    };
    const handleSuccess = () => {
        state.successes++;
        state.consecutiveSuccesses++;
        state.metrics.successfulRequests++;
        if (state.state === 'HALF_OPEN' && state.consecutiveSuccesses >= config.successThreshold) {
            state.state = 'CLOSED';
            state.failures = 0;
            state.consecutiveSuccesses = 0;
            state.metrics.lastStateChange = Date.now();
        }
    };
    const handleFailure = (error) => {
        state.failures++;
        state.consecutiveSuccesses = 0;
        state.lastFailureTime = Date.now();
        state.metrics.failedRequests++;
        const volumeThreshold = config.volumeThreshold || 0;
        const hasEnoughVolume = state.metrics.totalRequests >= volumeThreshold;
        if (state.state === 'HALF_OPEN') {
            state.state = 'OPEN';
            state.nextAttempt = Date.now() + config.resetTimeout;
            state.metrics.lastStateChange = Date.now();
        }
        else if (state.state === 'CLOSED' && state.failures >= config.failureThreshold && hasEnoughVolume) {
            state.state = 'OPEN';
            state.nextAttempt = Date.now() + config.resetTimeout;
            state.metrics.lastStateChange = Date.now();
        }
    };
    const getState = () => ({ ...state });
    const getMetrics = () => ({ ...state.metrics });
    const reset = () => {
        state.state = 'CLOSED';
        state.failures = 0;
        state.successes = 0;
        state.consecutiveSuccesses = 0;
        state.nextAttempt = Date.now();
        state.metrics.lastStateChange = Date.now();
    };
    const forceOpen = () => {
        state.state = 'OPEN';
        state.nextAttempt = Date.now() + config.resetTimeout;
        state.metrics.lastStateChange = Date.now();
    };
    const forceClosed = () => {
        state.state = 'CLOSED';
        state.failures = 0;
        state.metrics.lastStateChange = Date.now();
    };
    return { execute, getState, getMetrics, reset, forceOpen, forceClosed };
};
exports.createAdvancedCircuitBreaker = createAdvancedCircuitBreaker;
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
const createPercentageCircuitBreaker = (errorPercentageThreshold, minimumRequests, resetTimeoutMs) => {
    const window = [];
    let state = 'CLOSED';
    let nextAttempt = Date.now();
    const execute = async (fn) => {
        if (state === 'OPEN') {
            if (Date.now() < nextAttempt) {
                throw new Error('Circuit breaker is OPEN');
            }
            state = 'HALF_OPEN';
        }
        try {
            const result = await fn();
            window.push(true);
            if (window.length > 100)
                window.shift();
            if (state === 'HALF_OPEN') {
                state = 'CLOSED';
            }
            return result;
        }
        catch (error) {
            window.push(false);
            if (window.length > 100)
                window.shift();
            if (window.length >= minimumRequests) {
                const failures = window.filter(success => !success).length;
                const errorPercentage = (failures / window.length) * 100;
                if (errorPercentage >= errorPercentageThreshold) {
                    state = 'OPEN';
                    nextAttempt = Date.now() + resetTimeoutMs;
                }
            }
            throw error;
        }
    };
    const getState = () => state;
    const getErrorRate = () => {
        if (window.length === 0)
            return 0;
        const failures = window.filter(success => !success).length;
        return (failures / window.length) * 100;
    };
    return { execute, getState, getErrorRate };
};
exports.createPercentageCircuitBreaker = createPercentageCircuitBreaker;
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
const createCompositeCircuitBreaker = (breakers, strategy = 'all') => {
    const execute = async (fn) => {
        if (strategy === 'all') {
            // Nest breakers - all must pass
            let wrappedFn = fn;
            for (const breaker of breakers.reverse()) {
                const currentFn = wrappedFn;
                wrappedFn = () => breaker.execute(currentFn);
            }
            return wrappedFn();
        }
        else {
            // Try each breaker until one succeeds
            let lastError = null;
            for (const breaker of breakers) {
                try {
                    return await breaker.execute(fn);
                }
                catch (error) {
                    lastError = error;
                }
            }
            throw lastError || new Error('All circuit breakers failed');
        }
    };
    return { execute };
};
exports.createCompositeCircuitBreaker = createCompositeCircuitBreaker;
// ============================================================================
// BULKHEAD ISOLATION
// ============================================================================
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
const createBulkhead = (config) => {
    let activeCalls = 0;
    const queue = [];
    let totalExecuted = 0;
    let totalRejected = 0;
    let totalTimeouts = 0;
    const execute = async (fn) => {
        if (activeCalls >= config.maxConcurrent) {
            if (queue.length >= config.maxQueue) {
                totalRejected++;
                throw new Error(`Bulkhead ${config.name} queue is full`);
            }
            return new Promise((resolve, reject) => {
                queue.push({ fn, resolve, reject, enqueueTime: Date.now() });
            });
        }
        return executeImmediately(fn);
    };
    const executeImmediately = async (fn) => {
        activeCalls++;
        totalExecuted++;
        try {
            const result = await Promise.race([
                fn(),
                new Promise((_, reject) => setTimeout(() => {
                    totalTimeouts++;
                    reject(new Error(`Bulkhead ${config.name} execution timeout`));
                }, config.timeout)),
            ]);
            return result;
        }
        finally {
            activeCalls--;
            processQueue();
        }
    };
    const processQueue = () => {
        if (queue.length > 0 && activeCalls < config.maxConcurrent) {
            const item = queue.shift();
            const queueTime = Date.now() - item.enqueueTime;
            if (queueTime > config.timeout) {
                totalTimeouts++;
                item.reject(new Error(`Bulkhead ${config.name} queue timeout`));
                processQueue();
                return;
            }
            executeImmediately(item.fn)
                .then(item.resolve)
                .catch(item.reject);
        }
    };
    const getMetrics = () => ({
        name: config.name,
        activeCalls,
        queueLength: queue.length,
        totalExecuted,
        totalRejected,
        totalTimeouts,
        utilization: (activeCalls / config.maxConcurrent) * 100,
    });
    return { execute, getMetrics };
};
exports.createBulkhead = createBulkhead;
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
const createBulkheadManager = (configs) => {
    const bulkheads = new Map();
    for (const [name, config] of Object.entries(configs)) {
        bulkheads.set(name, (0, exports.createBulkhead)(config));
    }
    const execute = async (name, fn) => {
        const bulkhead = bulkheads.get(name);
        if (!bulkhead) {
            throw new Error(`Bulkhead not found: ${name}`);
        }
        return bulkhead.execute(fn);
    };
    const getMetrics = (name) => {
        if (name) {
            const bulkhead = bulkheads.get(name);
            return bulkhead ? bulkhead.getMetrics() : null;
        }
        return Array.from(bulkheads.entries()).map(([key, bulkhead]) => ({
            name: key,
            ...bulkhead.getMetrics(),
        }));
    };
    return { execute, getMetrics };
};
exports.createBulkheadManager = createBulkheadManager;
// ============================================================================
// RATE LIMITING AND THROTTLING
// ============================================================================
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
const createFixedWindowRateLimiter = (config) => {
    const windows = new Map();
    const check = (key) => {
        const now = Date.now();
        let window = windows.get(key);
        if (!window || now >= window.resetTime) {
            window = { count: 0, resetTime: now + config.windowMs };
            windows.set(key, window);
        }
        if (window.count >= config.maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: window.resetTime,
                retryAfter: window.resetTime - now,
            };
        }
        window.count++;
        return {
            allowed: true,
            remaining: config.maxRequests - window.count,
            resetTime: window.resetTime,
        };
    };
    const reset = (key) => {
        windows.delete(key);
    };
    const cleanup = () => {
        const now = Date.now();
        for (const [key, window] of windows.entries()) {
            if (now >= window.resetTime) {
                windows.delete(key);
            }
        }
    };
    setInterval(cleanup, config.windowMs);
    return { check, reset, cleanup };
};
exports.createFixedWindowRateLimiter = createFixedWindowRateLimiter;
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
const createSlidingWindowRateLimiter = (config) => {
    const requests = new Map();
    const check = (key) => {
        const now = Date.now();
        const windowStart = now - config.windowMs;
        let userRequests = requests.get(key) || [];
        userRequests = userRequests.filter(timestamp => timestamp > windowStart);
        if (userRequests.length >= config.maxRequests) {
            const oldestRequest = userRequests[0];
            const retryAfter = oldestRequest + config.windowMs - now;
            return {
                allowed: false,
                remaining: 0,
                resetTime: oldestRequest + config.windowMs,
                retryAfter,
            };
        }
        userRequests.push(now);
        requests.set(key, userRequests);
        return {
            allowed: true,
            remaining: config.maxRequests - userRequests.length,
            resetTime: now + config.windowMs,
        };
    };
    const reset = (key) => {
        requests.delete(key);
    };
    return { check, reset };
};
exports.createSlidingWindowRateLimiter = createSlidingWindowRateLimiter;
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
const createTokenBucketRateLimiter = (capacity, refillRate) => {
    const buckets = new Map();
    const refillBucket = (bucket) => {
        const now = Date.now();
        const timePassed = (now - bucket.lastRefill) / 1000;
        const tokensToAdd = timePassed * refillRate;
        bucket.tokens = Math.min(capacity, bucket.tokens + tokensToAdd);
        bucket.lastRefill = now;
    };
    const consume = (key, tokens = 1) => {
        let bucket = buckets.get(key);
        if (!bucket) {
            bucket = { tokens: capacity, lastRefill: Date.now() };
            buckets.set(key, bucket);
        }
        refillBucket(bucket);
        if (bucket.tokens >= tokens) {
            bucket.tokens -= tokens;
            return {
                allowed: true,
                remaining: Math.floor(bucket.tokens),
                resetTime: Date.now() + ((capacity - bucket.tokens) / refillRate) * 1000,
            };
        }
        const tokensNeeded = tokens - bucket.tokens;
        const retryAfter = (tokensNeeded / refillRate) * 1000;
        return {
            allowed: false,
            remaining: Math.floor(bucket.tokens),
            resetTime: Date.now() + retryAfter,
            retryAfter: Math.ceil(retryAfter),
        };
    };
    return { consume };
};
exports.createTokenBucketRateLimiter = createTokenBucketRateLimiter;
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
const createLeakyBucketRateLimiter = (capacity, leakRate) => {
    const buckets = new Map();
    const processQueue = (key) => {
        const queue = buckets.get(key);
        if (!queue || queue.length === 0)
            return;
        const interval = 1000 / leakRate;
        const process = () => {
            if (queue.length > 0) {
                const item = queue.shift();
                item.fn().then(item.resolve).catch(item.reject);
                if (queue.length > 0) {
                    setTimeout(process, interval);
                }
                else {
                    buckets.delete(key);
                }
            }
        };
        process();
    };
    const add = async (key, fn) => {
        let queue = buckets.get(key);
        if (!queue) {
            queue = [];
            buckets.set(key, queue);
        }
        if (queue.length >= capacity) {
            throw new Error('Rate limit exceeded');
        }
        return new Promise((resolve, reject) => {
            queue.push({ fn, resolve, reject });
            if (queue.length === 1) {
                processQueue(key);
            }
        });
    };
    return { add };
};
exports.createLeakyBucketRateLimiter = createLeakyBucketRateLimiter;
// ============================================================================
// TIMEOUT MANAGEMENT
// ============================================================================
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
const withTimeout = (promise, timeoutMs, errorMessage) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(errorMessage || `Operation timed out after ${timeoutMs}ms`)), timeoutMs)),
    ]);
};
exports.withTimeout = withTimeout;
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
const createTimeoutWrapper = (fn, config) => {
    return async (...args) => {
        try {
            return await (0, exports.withTimeout)(fn(...args), config.timeout);
        }
        catch (error) {
            if (config.onTimeout) {
                config.onTimeout();
            }
            throw config.timeoutError || error;
        }
    };
};
exports.createTimeoutWrapper = createTimeoutWrapper;
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
const withProgressiveTimeout = async (fn, timeouts) => {
    let lastError = null;
    for (const timeout of timeouts) {
        try {
            return await (0, exports.withTimeout)(fn(), timeout);
        }
        catch (error) {
            lastError = error;
        }
    }
    throw lastError || new Error('All attempts failed');
};
exports.withProgressiveTimeout = withProgressiveTimeout;
// ============================================================================
// FALLBACK STRATEGIES
// ============================================================================
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
const withFallback = async (primary, config) => {
    try {
        return await primary();
    }
    catch (error) {
        if (config.onFallback) {
            config.onFallback(error);
        }
        return await Promise.resolve(config.fallbackFn());
    }
};
exports.withFallback = withFallback;
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
const withFallbackChain = async (functions) => {
    let lastError = null;
    for (const fn of functions) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
        }
    }
    throw lastError || new Error('All fallbacks failed');
};
exports.withFallbackChain = withFallbackChain;
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
const withCachedFallback = async (cacheKey, primary, fallback, cacheTTL = 300000) => {
    const cache = new Map();
    const getCached = () => {
        const entry = cache.get(cacheKey);
        if (entry && Date.now() - entry.timestamp < entry.ttl) {
            entry.hits++;
            return entry.value;
        }
        return null;
    };
    const setCached = (value) => {
        cache.set(cacheKey, {
            value,
            timestamp: Date.now(),
            ttl: cacheTTL,
            hits: 0,
        });
    };
    try {
        const result = await primary();
        setCached(result);
        return result;
    }
    catch (error) {
        const cached = getCached();
        if (cached !== null) {
            return cached;
        }
        const fallbackResult = await fallback();
        setCached(fallbackResult);
        return fallbackResult;
    }
};
exports.withCachedFallback = withCachedFallback;
// ============================================================================
// RETRY WITH EXPONENTIAL BACKOFF
// ============================================================================
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
const withExponentialRetry = async (fn, config) => {
    let lastError = null;
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt === config.maxAttempts) {
                throw error;
            }
            if (config.retryableErrors) {
                const errorCode = error.code || error.message;
                if (!config.retryableErrors.some(code => errorCode.includes(code))) {
                    throw error;
                }
            }
            if (config.onRetry) {
                config.onRetry(attempt, error);
            }
            const delay = (0, exports.calculateBackoff)(attempt, config);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
};
exports.withExponentialRetry = withExponentialRetry;
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
const calculateBackoff = (attempt, config) => {
    const exponentialDelay = Math.min(config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1), config.maxDelay);
    if (config.jitter) {
        const jitter = Math.random() * 0.3 * exponentialDelay;
        return exponentialDelay + jitter;
    }
    return exponentialDelay;
};
exports.calculateBackoff = calculateBackoff;
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
const createRetryDecorator = (fn, config) => {
    return async (...args) => {
        return (0, exports.withExponentialRetry)(() => fn(...args), config);
    };
};
exports.createRetryDecorator = createRetryDecorator;
// ============================================================================
// HEALTH CHECK PATTERNS
// ============================================================================
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
const createHealthCheck = (config, checkFn) => {
    let status = 'healthy';
    let consecutiveFailures = 0;
    let consecutiveSuccesses = 0;
    let intervalId = null;
    const history = [];
    const performCheck = async () => {
        const startTime = Date.now();
        try {
            await (0, exports.withTimeout)(checkFn(), config.timeout);
            const latency = Date.now() - startTime;
            consecutiveSuccesses++;
            consecutiveFailures = 0;
            if (status !== 'healthy' && consecutiveSuccesses >= config.healthyThreshold) {
                status = 'healthy';
            }
            const result = {
                status: 'healthy',
                latency,
                timestamp: Date.now(),
            };
            history.push(result);
            if (history.length > 100)
                history.shift();
            return result;
        }
        catch (error) {
            consecutiveFailures++;
            consecutiveSuccesses = 0;
            if (consecutiveFailures >= config.unhealthyThreshold) {
                status = 'unhealthy';
            }
            else if (consecutiveFailures > 0) {
                status = 'degraded';
            }
            const result = {
                status,
                latency: Date.now() - startTime,
                timestamp: Date.now(),
                error: error,
            };
            history.push(result);
            if (history.length > 100)
                history.shift();
            return result;
        }
    };
    const start = () => {
        if (intervalId)
            return;
        intervalId = setInterval(async () => {
            await performCheck();
        }, config.interval);
    };
    const stop = () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };
    const getStatus = () => {
        const latest = history[history.length - 1];
        return latest || {
            status,
            latency: 0,
            timestamp: Date.now(),
        };
    };
    const getHistory = () => [...history];
    return { start, stop, getStatus, getHistory, performCheck };
};
exports.createHealthCheck = createHealthCheck;
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
const createCompositeHealthCheck = (checks) => {
    const getOverallStatus = () => {
        const results = {};
        let hasUnhealthy = false;
        let hasDegraded = false;
        for (const [name, check] of checks) {
            const result = check.getStatus();
            results[name] = result;
            if (result.status === 'unhealthy') {
                hasUnhealthy = true;
            }
            else if (result.status === 'degraded') {
                hasDegraded = true;
            }
        }
        const overallStatus = hasUnhealthy ? 'unhealthy' : hasDegraded ? 'degraded' : 'healthy';
        return { status: overallStatus, checks: results };
    };
    const startAll = () => {
        for (const check of checks.values()) {
            check.start();
        }
    };
    const stopAll = () => {
        for (const check of checks.values()) {
            check.stop();
        }
    };
    return { getOverallStatus, startAll, stopAll };
};
exports.createCompositeHealthCheck = createCompositeHealthCheck;
// ============================================================================
// GRACEFUL DEGRADATION
// ============================================================================
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
const createDegradationManager = () => {
    let currentLevel = {
        level: 'full',
        features: new Set(),
        timestamp: Date.now(),
    };
    const levels = {
        full: new Set(),
        degraded: new Set(['analytics', 'recommendations', 'social']),
        minimal: new Set(['analytics', 'recommendations', 'social', 'notifications', 'exports']),
        offline: new Set(['*']),
    };
    const setLevel = (level, customDisabled) => {
        const disabledFeatures = customDisabled ? new Set(customDisabled) : levels[level];
        currentLevel = {
            level,
            features: disabledFeatures,
            timestamp: Date.now(),
        };
    };
    const isFeatureAvailable = (feature) => {
        if (currentLevel.features.has('*')) {
            return false;
        }
        return !currentLevel.features.has(feature);
    };
    const getLevel = () => currentLevel.level;
    const getDisabledFeatures = () => Array.from(currentLevel.features);
    return { setLevel, isFeatureAvailable, getLevel, getDisabledFeatures };
};
exports.createDegradationManager = createDegradationManager;
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
const withDegradation = async (fullFn, degradedFn, minimalFn) => {
    try {
        return await (0, exports.withTimeout)(fullFn(), 5000);
    }
    catch (error) {
        try {
            return await (0, exports.withTimeout)(degradedFn(), 3000);
        }
        catch (degradedError) {
            return minimalFn();
        }
    }
};
exports.withDegradation = withDegradation;
// ============================================================================
// ADDITIONAL RESILIENCE UTILITIES
// ============================================================================
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
const createHedgedRequest = async (requests, hedgeDelay) => {
    return new Promise((resolve, reject) => {
        let resolved = false;
        let errors = [];
        const tryRequest = (index) => {
            if (index >= requests.length || resolved)
                return;
            requests[index]()
                .then(result => {
                if (!resolved) {
                    resolved = true;
                    resolve(result);
                }
            })
                .catch(error => {
                errors.push(error);
                if (errors.length === requests.length) {
                    reject(new Error('All hedged requests failed'));
                }
            });
            if (index < requests.length - 1) {
                setTimeout(() => tryRequest(index + 1), hedgeDelay);
            }
        };
        tryRequest(0);
    });
};
exports.createHedgedRequest = createHedgedRequest;
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
const createRequestCoalescer = () => {
    const pendingRequests = new Map();
    const execute = (key, fn) => {
        const existing = pendingRequests.get(key);
        if (existing) {
            return existing;
        }
        const promise = fn().finally(() => {
            pendingRequests.delete(key);
        });
        pendingRequests.set(key, promise);
        return promise;
    };
    const clear = (key) => {
        if (key) {
            pendingRequests.delete(key);
        }
        else {
            pendingRequests.clear();
        }
    };
    return { execute, clear };
};
exports.createRequestCoalescer = createRequestCoalescer;
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
const createAdaptiveTimeout = (initialTimeout, percentile) => {
    const responseTimes = [];
    let currentTimeout = initialTimeout;
    const calculateTimeout = () => {
        if (responseTimes.length < 10) {
            return currentTimeout;
        }
        const sorted = [...responseTimes].sort((a, b) => a - b);
        const index = Math.floor((percentile / 100) * sorted.length);
        const calculatedTimeout = sorted[index] * 1.5; // 50% buffer
        return Math.max(initialTimeout, calculatedTimeout);
    };
    const execute = async (fn) => {
        const start = Date.now();
        try {
            const result = await (0, exports.withTimeout)(fn(), currentTimeout);
            const duration = Date.now() - start;
            responseTimes.push(duration);
            if (responseTimes.length > 1000)
                responseTimes.shift();
            currentTimeout = calculateTimeout();
            return result;
        }
        catch (error) {
            throw error;
        }
    };
    const getTimeout = () => currentTimeout;
    return { execute, getTimeout };
};
exports.createAdaptiveTimeout = createAdaptiveTimeout;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Circuit Breaker
    createAdvancedCircuitBreaker: exports.createAdvancedCircuitBreaker,
    createPercentageCircuitBreaker: exports.createPercentageCircuitBreaker,
    createCompositeCircuitBreaker: exports.createCompositeCircuitBreaker,
    // Bulkhead
    createBulkhead: exports.createBulkhead,
    createBulkheadManager: exports.createBulkheadManager,
    // Rate Limiting
    createFixedWindowRateLimiter: exports.createFixedWindowRateLimiter,
    createSlidingWindowRateLimiter: exports.createSlidingWindowRateLimiter,
    createTokenBucketRateLimiter: exports.createTokenBucketRateLimiter,
    createLeakyBucketRateLimiter: exports.createLeakyBucketRateLimiter,
    // Timeout
    withTimeout: exports.withTimeout,
    createTimeoutWrapper: exports.createTimeoutWrapper,
    withProgressiveTimeout: exports.withProgressiveTimeout,
    // Fallback
    withFallback: exports.withFallback,
    withFallbackChain: exports.withFallbackChain,
    withCachedFallback: exports.withCachedFallback,
    // Retry
    withExponentialRetry: exports.withExponentialRetry,
    calculateBackoff: exports.calculateBackoff,
    createRetryDecorator: exports.createRetryDecorator,
    // Health Checks
    createHealthCheck: exports.createHealthCheck,
    createCompositeHealthCheck: exports.createCompositeHealthCheck,
    // Graceful Degradation
    createDegradationManager: exports.createDegradationManager,
    withDegradation: exports.withDegradation,
    // Advanced Patterns
    createHedgedRequest: exports.createHedgedRequest,
    createRequestCoalescer: exports.createRequestCoalescer,
    createAdaptiveTimeout: exports.createAdaptiveTimeout,
};
//# sourceMappingURL=typescript-oracle-resilience-kit.js.map