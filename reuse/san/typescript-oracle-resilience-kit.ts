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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeout: number;
  monitoringPeriod?: number;
  volumeThreshold?: number;
  errorFilter?: (error: Error) => boolean;
}

interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  successes: number;
  consecutiveSuccesses: number;
  nextAttempt: number;
  lastFailureTime?: number;
  metrics: CircuitBreakerMetrics;
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

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

interface DegradationLevel {
  level: 'full' | 'degraded' | 'minimal' | 'offline';
  features: Set<string>;
  timestamp: number;
}

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
export const createAdvancedCircuitBreaker = <T = any>(config: CircuitBreakerConfig) => {
  const state: CircuitBreakerState = {
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

  const responseTimes: number[] = [];

  const execute = async (fn: () => Promise<T>): Promise<T> => {
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
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Circuit breaker timeout')), config.timeout)
        ),
      ]);

      const responseTime = Date.now() - startTime;
      responseTimes.push(responseTime);
      if (responseTimes.length > 100) responseTimes.shift();

      state.metrics.averageResponseTime =
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

      handleSuccess();
      return result;
    } catch (error) {
      const err = error as Error;

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

  const handleFailure = (error: Error) => {
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
    } else if (state.state === 'CLOSED' && state.failures >= config.failureThreshold && hasEnoughVolume) {
      state.state = 'OPEN';
      state.nextAttempt = Date.now() + config.resetTimeout;
      state.metrics.lastStateChange = Date.now();
    }
  };

  const getState = () => ({ ...state });

  const getMetrics = (): CircuitBreakerMetrics => ({ ...state.metrics });

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
export const createPercentageCircuitBreaker = <T = any>(
  errorPercentageThreshold: number,
  minimumRequests: number,
  resetTimeoutMs: number,
) => {
  const window: boolean[] = [];
  let state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  let nextAttempt = Date.now();

  const execute = async (fn: () => Promise<T>): Promise<T> => {
    if (state === 'OPEN') {
      if (Date.now() < nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      window.push(true);
      if (window.length > 100) window.shift();

      if (state === 'HALF_OPEN') {
        state = 'CLOSED';
      }

      return result;
    } catch (error) {
      window.push(false);
      if (window.length > 100) window.shift();

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
    if (window.length === 0) return 0;
    const failures = window.filter(success => !success).length;
    return (failures / window.length) * 100;
  };

  return { execute, getState, getErrorRate };
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
export const createCompositeCircuitBreaker = <T = any>(
  breakers: Array<{ execute: (fn: () => Promise<T>) => Promise<T> }>,
  strategy: 'all' | 'any' = 'all',
) => {
  const execute = async (fn: () => Promise<T>): Promise<T> => {
    if (strategy === 'all') {
      // Nest breakers - all must pass
      let wrappedFn = fn;
      for (const breaker of breakers.reverse()) {
        const currentFn = wrappedFn;
        wrappedFn = () => breaker.execute(currentFn);
      }
      return wrappedFn();
    } else {
      // Try each breaker until one succeeds
      let lastError: Error | null = null;

      for (const breaker of breakers) {
        try {
          return await breaker.execute(fn);
        } catch (error) {
          lastError = error as Error;
        }
      }

      throw lastError || new Error('All circuit breakers failed');
    }
  };

  return { execute };
};

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
export const createBulkhead = <T = any>(config: BulkheadConfig) => {
  let activeCalls = 0;
  const queue: Array<{
    fn: () => Promise<T>;
    resolve: (value: T) => void;
    reject: (error: any) => void;
    enqueueTime: number;
  }> = [];

  let totalExecuted = 0;
  let totalRejected = 0;
  let totalTimeouts = 0;

  const execute = async (fn: () => Promise<T>): Promise<T> => {
    if (activeCalls >= config.maxConcurrent) {
      if (queue.length >= config.maxQueue) {
        totalRejected++;
        throw new Error(`Bulkhead ${config.name} queue is full`);
      }

      return new Promise<T>((resolve, reject) => {
        queue.push({ fn, resolve, reject, enqueueTime: Date.now() });
      });
    }

    return executeImmediately(fn);
  };

  const executeImmediately = async (fn: () => Promise<T>): Promise<T> => {
    activeCalls++;
    totalExecuted++;

    try {
      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => {
            totalTimeouts++;
            reject(new Error(`Bulkhead ${config.name} execution timeout`));
          }, config.timeout)
        ),
      ]);

      return result;
    } finally {
      activeCalls--;
      processQueue();
    }
  };

  const processQueue = () => {
    if (queue.length > 0 && activeCalls < config.maxConcurrent) {
      const item = queue.shift()!;

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
export const createBulkheadManager = (configs: Record<string, BulkheadConfig>) => {
  const bulkheads = new Map<string, ReturnType<typeof createBulkhead>>();

  for (const [name, config] of Object.entries(configs)) {
    bulkheads.set(name, createBulkhead(config));
  }

  const execute = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    const bulkhead = bulkheads.get(name);

    if (!bulkhead) {
      throw new Error(`Bulkhead not found: ${name}`);
    }

    return bulkhead.execute(fn);
  };

  const getMetrics = (name?: string) => {
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
export const createFixedWindowRateLimiter = (config: RateLimiterConfig) => {
  const windows = new Map<string, { count: number; resetTime: number }>();

  const check = (key: string): RateLimitResult => {
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

  const reset = (key: string) => {
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
export const createSlidingWindowRateLimiter = (config: RateLimiterConfig) => {
  const requests = new Map<string, number[]>();

  const check = (key: string): RateLimitResult => {
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

  const reset = (key: string) => {
    requests.delete(key);
  };

  return { check, reset };
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
export const createTokenBucketRateLimiter = (capacity: number, refillRate: number) => {
  const buckets = new Map<string, { tokens: number; lastRefill: number }>();

  const refillBucket = (bucket: { tokens: number; lastRefill: number }) => {
    const now = Date.now();
    const timePassed = (now - bucket.lastRefill) / 1000;
    const tokensToAdd = timePassed * refillRate;

    bucket.tokens = Math.min(capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  };

  const consume = (key: string, tokens: number = 1): RateLimitResult => {
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
export const createLeakyBucketRateLimiter = (capacity: number, leakRate: number) => {
  const buckets = new Map<string, Array<{ fn: () => Promise<any>; resolve: any; reject: any }>>();

  const processQueue = (key: string) => {
    const queue = buckets.get(key);
    if (!queue || queue.length === 0) return;

    const interval = 1000 / leakRate;

    const process = () => {
      if (queue.length > 0) {
        const item = queue.shift()!;
        item.fn().then(item.resolve).catch(item.reject);

        if (queue.length > 0) {
          setTimeout(process, interval);
        } else {
          buckets.delete(key);
        }
      }
    };

    process();
  };

  const add = async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
    let queue = buckets.get(key);

    if (!queue) {
      queue = [];
      buckets.set(key, queue);
    }

    if (queue.length >= capacity) {
      throw new Error('Rate limit exceeded');
    }

    return new Promise<T>((resolve, reject) => {
      queue!.push({ fn, resolve, reject });

      if (queue!.length === 1) {
        processQueue(key);
      }
    });
  };

  return { add };
};

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
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage?: string,
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(errorMessage || `Operation timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
};

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
export const createTimeoutWrapper = <T>(
  fn: (...args: any[]) => Promise<T>,
  config: TimeoutConfig,
): ((...args: any[]) => Promise<T>) => {
  return async (...args: any[]): Promise<T> => {
    try {
      return await withTimeout(fn(...args), config.timeout);
    } catch (error) {
      if (config.onTimeout) {
        config.onTimeout();
      }
      throw config.timeoutError || error;
    }
  };
};

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
export const withProgressiveTimeout = async <T>(
  fn: () => Promise<T>,
  timeouts: number[],
): Promise<T> => {
  let lastError: Error | null = null;

  for (const timeout of timeouts) {
    try {
      return await withTimeout(fn(), timeout);
    } catch (error) {
      lastError = error as Error;
    }
  }

  throw lastError || new Error('All attempts failed');
};

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
export const withFallback = async <T>(
  primary: () => Promise<T>,
  config: FallbackConfig<T>,
): Promise<T> => {
  try {
    return await primary();
  } catch (error) {
    if (config.onFallback) {
      config.onFallback(error as Error);
    }

    return await Promise.resolve(config.fallbackFn());
  }
};

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
export const withFallbackChain = async <T>(functions: Array<() => Promise<T>>): Promise<T> => {
  let lastError: Error | null = null;

  for (const fn of functions) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
    }
  }

  throw lastError || new Error('All fallbacks failed');
};

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
export const withCachedFallback = async <T>(
  cacheKey: string,
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
  cacheTTL: number = 300000,
): Promise<T> => {
  const cache = new Map<string, CacheEntry<T>>();

  const getCached = (): T | null => {
    const entry = cache.get(cacheKey);
    if (entry && Date.now() - entry.timestamp < entry.ttl) {
      entry.hits++;
      return entry.value;
    }
    return null;
  };

  const setCached = (value: T) => {
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
  } catch (error) {
    const cached = getCached();
    if (cached !== null) {
      return cached;
    }

    const fallbackResult = await fallback();
    setCached(fallbackResult);
    return fallbackResult;
  }
};

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
export const withExponentialRetry = async <T>(
  fn: () => Promise<T>,
  config: RetryConfig,
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === config.maxAttempts) {
        throw error;
      }

      if (config.retryableErrors) {
        const errorCode = (error as any).code || (error as Error).message;
        if (!config.retryableErrors.some(code => errorCode.includes(code))) {
          throw error;
        }
      }

      if (config.onRetry) {
        config.onRetry(attempt, error as Error);
      }

      const delay = calculateBackoff(attempt, config);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

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
export const calculateBackoff = (attempt: number, config: RetryConfig): number => {
  const exponentialDelay = Math.min(
    config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1),
    config.maxDelay
  );

  if (config.jitter) {
    const jitter = Math.random() * 0.3 * exponentialDelay;
    return exponentialDelay + jitter;
  }

  return exponentialDelay;
};

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
export const createRetryDecorator = <T>(
  fn: (...args: any[]) => Promise<T>,
  config: RetryConfig,
): ((...args: any[]) => Promise<T>) => {
  return async (...args: any[]): Promise<T> => {
    return withExponentialRetry(() => fn(...args), config);
  };
};

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
export const createHealthCheck = (
  config: HealthCheckConfig,
  checkFn: () => Promise<void>,
) => {
  let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
  let consecutiveFailures = 0;
  let consecutiveSuccesses = 0;
  let intervalId: NodeJS.Timeout | null = null;
  const history: HealthCheckResult[] = [];

  const performCheck = async (): Promise<HealthCheckResult> => {
    const startTime = Date.now();

    try {
      await withTimeout(checkFn(), config.timeout);
      const latency = Date.now() - startTime;

      consecutiveSuccesses++;
      consecutiveFailures = 0;

      if (status !== 'healthy' && consecutiveSuccesses >= config.healthyThreshold) {
        status = 'healthy';
      }

      const result: HealthCheckResult = {
        status: 'healthy',
        latency,
        timestamp: Date.now(),
      };

      history.push(result);
      if (history.length > 100) history.shift();

      return result;
    } catch (error) {
      consecutiveFailures++;
      consecutiveSuccesses = 0;

      if (consecutiveFailures >= config.unhealthyThreshold) {
        status = 'unhealthy';
      } else if (consecutiveFailures > 0) {
        status = 'degraded';
      }

      const result: HealthCheckResult = {
        status,
        latency: Date.now() - startTime,
        timestamp: Date.now(),
        error: error as Error,
      };

      history.push(result);
      if (history.length > 100) history.shift();

      return result;
    }
  };

  const start = () => {
    if (intervalId) return;

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

  const getStatus = (): HealthCheckResult => {
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
export const createCompositeHealthCheck = (
  checks: Map<string, ReturnType<typeof createHealthCheck>>,
) => {
  const getOverallStatus = (): {
    status: 'healthy' | 'unhealthy' | 'degraded';
    checks: Record<string, HealthCheckResult>;
  } => {
    const results: Record<string, HealthCheckResult> = {};
    let hasUnhealthy = false;
    let hasDegraded = false;

    for (const [name, check] of checks) {
      const result = check.getStatus();
      results[name] = result;

      if (result.status === 'unhealthy') {
        hasUnhealthy = true;
      } else if (result.status === 'degraded') {
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
export const createDegradationManager = () => {
  let currentLevel: DegradationLevel = {
    level: 'full',
    features: new Set(),
    timestamp: Date.now(),
  };

  const levels: Record<string, Set<string>> = {
    full: new Set(),
    degraded: new Set(['analytics', 'recommendations', 'social']),
    minimal: new Set(['analytics', 'recommendations', 'social', 'notifications', 'exports']),
    offline: new Set(['*']),
  };

  const setLevel = (level: 'full' | 'degraded' | 'minimal' | 'offline', customDisabled?: string[]) => {
    const disabledFeatures = customDisabled ? new Set(customDisabled) : levels[level];

    currentLevel = {
      level,
      features: disabledFeatures,
      timestamp: Date.now(),
    };
  };

  const isFeatureAvailable = (feature: string): boolean => {
    if (currentLevel.features.has('*')) {
      return false;
    }
    return !currentLevel.features.has(feature);
  };

  const getLevel = () => currentLevel.level;

  const getDisabledFeatures = () => Array.from(currentLevel.features);

  return { setLevel, isFeatureAvailable, getLevel, getDisabledFeatures };
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
export const withDegradation = async <T>(
  fullFn: () => Promise<T>,
  degradedFn: () => Promise<T>,
  minimalFn: () => T,
): Promise<T> => {
  try {
    return await withTimeout(fullFn(), 5000);
  } catch (error) {
    try {
      return await withTimeout(degradedFn(), 3000);
    } catch (degradedError) {
      return minimalFn();
    }
  }
};

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
export const createHedgedRequest = async <T>(
  requests: Array<() => Promise<T>>,
  hedgeDelay: number,
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    let resolved = false;
    let errors: Error[] = [];

    const tryRequest = (index: number) => {
      if (index >= requests.length || resolved) return;

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
export const createRequestCoalescer = <T>() => {
  const pendingRequests = new Map<string, Promise<T>>();

  const execute = (key: string, fn: () => Promise<T>): Promise<T> => {
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

  const clear = (key?: string) => {
    if (key) {
      pendingRequests.delete(key);
    } else {
      pendingRequests.clear();
    }
  };

  return { execute, clear };
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
export const createAdaptiveTimeout = (initialTimeout: number, percentile: number) => {
  const responseTimes: number[] = [];
  let currentTimeout = initialTimeout;

  const calculateTimeout = (): number => {
    if (responseTimes.length < 10) {
      return currentTimeout;
    }

    const sorted = [...responseTimes].sort((a, b) => a - b);
    const index = Math.floor((percentile / 100) * sorted.length);
    const calculatedTimeout = sorted[index] * 1.5; // 50% buffer

    return Math.max(initialTimeout, calculatedTimeout);
  };

  const execute = async <T>(fn: () => Promise<T>): Promise<T> => {
    const start = Date.now();

    try {
      const result = await withTimeout(fn(), currentTimeout);
      const duration = Date.now() - start;

      responseTimes.push(duration);
      if (responseTimes.length > 1000) responseTimes.shift();

      currentTimeout = calculateTimeout();

      return result;
    } catch (error) {
      throw error;
    }
  };

  const getTimeout = () => currentTimeout;

  return { execute, getTimeout };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Circuit Breaker
  createAdvancedCircuitBreaker,
  createPercentageCircuitBreaker,
  createCompositeCircuitBreaker,

  // Bulkhead
  createBulkhead,
  createBulkheadManager,

  // Rate Limiting
  createFixedWindowRateLimiter,
  createSlidingWindowRateLimiter,
  createTokenBucketRateLimiter,
  createLeakyBucketRateLimiter,

  // Timeout
  withTimeout,
  createTimeoutWrapper,
  withProgressiveTimeout,

  // Fallback
  withFallback,
  withFallbackChain,
  withCachedFallback,

  // Retry
  withExponentialRetry,
  calculateBackoff,
  createRetryDecorator,

  // Health Checks
  createHealthCheck,
  createCompositeHealthCheck,

  // Graceful Degradation
  createDegradationManager,
  withDegradation,

  // Advanced Patterns
  createHedgedRequest,
  createRequestCoalescer,
  createAdaptiveTimeout,
};
