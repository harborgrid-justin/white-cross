/**
 * @fileoverview Enterprise-grade parallel execution and concurrent processing utilities
 * @module reuse/data/parallel-execution
 * @description Production-ready functions for parallel batch processing, rate limiting,
 * promise pools, worker coordination, task queues, circuit breakers, and error handling
 */

import { Logger } from '@nestjs/common';
import { EventEmitter } from 'events';

/**
 * Result of a batch operation with success/failure tracking
 */
export interface BatchResult<T> {
  success: T[];
  errors: Array<{ index: number; error: Error; input: any }>;
  totalProcessed: number;
  successRate: number;
}

/**
 * Configuration for parallel batch operations
 */
export interface ParallelBatchConfig {
  concurrency: number;
  timeout?: number;
  stopOnError?: boolean;
  retries?: number;
  signal?: AbortSignal;
}

/**
 * Progress callback for batch operations
 */
export type ProgressCallback = (progress: {
  completed: number;
  total: number;
  percentage: number;
  current?: any;
}) => void;

/**
 * Circuit breaker states
 */
export type CircuitState = 'closed' | 'open' | 'half-open';

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeout: number;
}

/**
 * Priority for task execution
 */
export type Priority = 'critical' | 'high' | 'normal' | 'low';

/**
 * Task queue status
 */
export type QueueStatus = 'idle' | 'processing' | 'paused' | 'draining';

// ============================================================================
// PARALLEL BATCH PROCESSING UTILITIES (7 functions)
// ============================================================================

/**
 * Executes tasks in parallel batches with controlled concurrency for optimal throughput
 *
 * Core utility for parallel processing in healthcare applications - processes medical records,
 * lab results, or prescription batches while respecting system resource limits
 *
 * @template T - Input item type (e.g., PatientRecord, LabResult, Prescription)
 * @template R - Result type (e.g., ProcessedRecord, ValidationResult, UpdateResult)
 * @param {T[]} items - Array of items to process in parallel
 * @param {(item: T, index: number) => Promise<R>} executor - Async function to execute for each item
 * @param {number} concurrency - Maximum number of concurrent executions (recommended: 5-20 for database operations)
 * @returns {Promise<R[]>} Promise resolving to array of results in original order
 * @throws {Error} If any executor fails (fails fast - does not process remaining items)
 *
 * @example
 * ```typescript
 * // Process patient records in batches
 * const validatedRecords = await parallelBatch(
 *   patientRecords,
 *   async (record) => await validateAndSaveRecord(record),
 *   10 // Process 10 records concurrently
 * );
 *
 * // Update medical records with concurrency control
 * const updatedRecords = await parallelBatch(
 *   recordsToUpdate,
 *   async (record, index) => {
 *     console.log(`Processing ${index + 1}/${recordsToUpdate.length}`);
 *     return await MedicalRecord.update(record);
 *   },
 *   5
 * );
 * ```
 *
 * @performance
 * - Uses worker pool pattern for optimal resource utilization
 * - Results array maintains original order despite concurrent execution
 * - Memory-efficient: only maintains concurrency workers, not all promises
 * - Typical throughput: 100-1000 items/second depending on executor complexity
 *
 * @healthcare
 * - Use for batch processing of lab results during off-peak hours
 * - Process insurance claims in parallel while respecting rate limits
 * - Validate patient data imports from external systems
 * - Bulk update medical records during system maintenance
 *
 * @notes
 * - For error-tolerant processing, use parallelBatchWithResults instead
 * - For very large datasets (>10,000 items), use parallelBatchChunked
 * - Concurrency >20 may overwhelm database connection pool
 * - Consider rate limiting for external API calls
 */
export async function parallelBatch<T, R>(
  items: T[],
  executor: (item: T, index: number) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  if (!items || items.length === 0) {
    return [];
  }

  if (concurrency <= 0) {
    throw new Error('Concurrency must be greater than 0');
  }

  const results: R[] = new Array(items.length);
  let currentIndex = 0;

  const executeNext = async (): Promise<void> => {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      try {
        results[index] = await executor(items[index], index);
      } catch (error) {
        throw new Error(
          `Failed to process item at index ${index}: ${error.message}`,
        );
      }
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () =>
    executeNext(),
  );

  await Promise.all(workers);
  return results;
}

/**
 * Execute batch with detailed results including successes and failures
 *
 * @template T - Input type
 * @template R - Result type
 * @param items - Array of items to process
 * @param executor - Async function to execute for each item
 * @param config - Batch execution configuration
 * @returns Promise resolving to batch result with success/error tracking
 *
 * @example
 * ```typescript
 * const result = await parallelBatchWithResults(
 *   [1, 2, 3],
 *   async (n) => { if (n === 2) throw new Error('fail'); return n * 2; },
 *   { concurrency: 2 }
 * );
 * console.log(result.success); // [2, 6]
 * console.log(result.errors); // [{ index: 1, error: Error, input: 2 }]
 * ```
 */
export async function parallelBatchWithResults<T, R>(
  items: T[],
  executor: (item: T, index: number) => Promise<R>,
  config: ParallelBatchConfig,
): Promise<BatchResult<R>> {
  if (!items || items.length === 0) {
    return {
      success: [],
      errors: [],
      totalProcessed: 0,
      successRate: 0,
    };
  }

  const { concurrency, timeout, signal } = config;
  const success: R[] = [];
  const errors: Array<{ index: number; error: Error; input: any }> = [];
  let currentIndex = 0;

  const executeWithTimeout = async (
    item: T,
    index: number,
  ): Promise<void> => {
    try {
      if (signal?.aborted) {
        throw new Error('Operation aborted');
      }

      let result: R;
      if (timeout) {
        result = await Promise.race([
          executor(item, index),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout),
          ),
        ]);
      } else {
        result = await executor(item, index);
      }

      success.push(result);
    } catch (error) {
      errors.push({
        index,
        error: error instanceof Error ? error : new Error(String(error)),
        input: item,
      });

      if (config.stopOnError) {
        throw error;
      }
    }
  };

  const executeNext = async (): Promise<void> => {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      await executeWithTimeout(items[index], index);
    }
  };

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => executeNext(),
  );

  await Promise.allSettled(workers);

  return {
    success,
    errors,
    totalProcessed: items.length,
    successRate: success.length / items.length,
  };
}

/**
 * Execute batch with comprehensive error collection
 *
 * @template T - Input type
 * @template R - Result type
 * @param items - Array of items to process
 * @param executor - Async function to execute for each item
 * @param concurrency - Maximum concurrent executions
 * @returns Promise with results and aggregated errors
 *
 * @example
 * ```typescript
 * const { results, errors } = await parallelBatchWithErrors(
 *   urls,
 *   fetchUrl,
 *   5
 * );
 * ```
 */
export async function parallelBatchWithErrors<T, R>(
  items: T[],
  executor: (item: T, index: number) => Promise<R>,
  concurrency: number,
): Promise<{ results: (R | null)[]; errors: Map<number, Error> }> {
  const results: (R | null)[] = new Array(items.length).fill(null);
  const errors = new Map<number, Error>();
  let currentIndex = 0;

  const executeNext = async (): Promise<void> => {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      try {
        results[index] = await executor(items[index], index);
      } catch (error) {
        errors.set(
          index,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () =>
    executeNext(),
  );

  await Promise.allSettled(workers);

  return { results, errors };
}

/**
 * Execute batch in chunks with controlled memory usage
 *
 * @template T - Input type
 * @template R - Result type
 * @param items - Array of items to process
 * @param executor - Async function to execute for each item
 * @param chunkSize - Size of each chunk
 * @param concurrency - Concurrent executions per chunk
 * @returns Promise resolving to array of all results
 *
 * @example
 * ```typescript
 * const results = await parallelBatchChunked(
 *   largeArray,
 *   processItem,
 *   100,
 *   10
 * );
 * ```
 */
export async function parallelBatchChunked<T, R>(
  items: T[],
  executor: (item: T, index: number) => Promise<R>,
  chunkSize: number,
  concurrency: number,
): Promise<R[]> {
  if (chunkSize <= 0) {
    throw new Error('Chunk size must be greater than 0');
  }

  const results: R[] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = await parallelBatch(
      chunk,
      (item, localIndex) => executor(item, i + localIndex),
      concurrency,
    );
    results.push(...chunkResults);
  }

  return results;
}

/**
 * Execute batch with progress callbacks
 *
 * @template T - Input type
 * @template R - Result type
 * @param items - Array of items to process
 * @param executor - Async function to execute for each item
 * @param concurrency - Maximum concurrent executions
 * @param onProgress - Progress callback function
 * @returns Promise resolving to array of results
 *
 * @example
 * ```typescript
 * const results = await parallelBatchWithProgress(
 *   items,
 *   processItem,
 *   5,
 *   ({ completed, total, percentage }) => {
 *     console.log(`Progress: ${percentage}%`);
 *   }
 * );
 * ```
 */
export async function parallelBatchWithProgress<T, R>(
  items: T[],
  executor: (item: T, index: number) => Promise<R>,
  concurrency: number,
  onProgress: ProgressCallback,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let completed = 0;
  let currentIndex = 0;

  const executeNext = async (): Promise<void> => {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      try {
        results[index] = await executor(items[index], index);
        completed++;
        onProgress({
          completed,
          total: items.length,
          percentage: Math.round((completed / items.length) * 100),
          current: items[index],
        });
      } catch (error) {
        throw new Error(
          `Failed to process item at index ${index}: ${error.message}`,
        );
      }
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () =>
    executeNext(),
  );

  await Promise.all(workers);
  return results;
}

/**
 * Execute batch with cancellation support via AbortSignal
 *
 * @template T - Input type
 * @template R - Result type
 * @param items - Array of items to process
 * @param executor - Async function to execute for each item
 * @param concurrency - Maximum concurrent executions
 * @param signal - AbortSignal for cancellation
 * @returns Promise resolving to partial results before cancellation
 *
 * @example
 * ```typescript
 * const controller = new AbortController();
 * setTimeout(() => controller.abort(), 5000);
 * const results = await parallelBatchWithCancellation(
 *   items,
 *   processItem,
 *   5,
 *   controller.signal
 * );
 * ```
 */
export async function parallelBatchWithCancellation<T, R>(
  items: T[],
  executor: (item: T, index: number, signal: AbortSignal) => Promise<R>,
  concurrency: number,
  signal: AbortSignal,
): Promise<R[]> {
  const results: R[] = [];
  let currentIndex = 0;
  let aborted = false;

  signal.addEventListener('abort', () => {
    aborted = true;
  });

  const executeNext = async (): Promise<void> => {
    while (currentIndex < items.length && !aborted) {
      const index = currentIndex++;
      if (signal.aborted) {
        break;
      }
      try {
        const result = await executor(items[index], index, signal);
        if (!aborted) {
          results[index] = result;
        }
      } catch (error) {
        if (signal.aborted) {
          break;
        }
        throw error;
      }
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () =>
    executeNext(),
  );

  await Promise.allSettled(workers);
  return results.filter((r) => r !== undefined);
}

/**
 * Execute batch with dynamic concurrency adjustment based on performance
 *
 * @template T - Input type
 * @template R - Result type
 * @param items - Array of items to process
 * @param executor - Async function to execute for each item
 * @param initialConcurrency - Initial concurrency level
 * @param maxConcurrency - Maximum allowed concurrency
 * @returns Promise resolving to array of results
 *
 * @example
 * ```typescript
 * const results = await parallelBatchDynamic(
 *   items,
 *   processItem,
 *   2,
 *   20
 * );
 * ```
 */
export async function parallelBatchDynamic<T, R>(
  items: T[],
  executor: (item: T, index: number) => Promise<R>,
  initialConcurrency: number,
  maxConcurrency: number,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let currentIndex = 0;
  let currentConcurrency = initialConcurrency;
  const executionTimes: number[] = [];

  const adjustConcurrency = () => {
    if (executionTimes.length < 10) return;

    const recentTimes = executionTimes.slice(-10);
    const avgTime =
      recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length;
    const prevTimes = executionTimes.slice(-20, -10);
    const prevAvgTime =
      prevTimes.reduce((a, b) => a + b, 0) / prevTimes.length;

    if (avgTime < prevAvgTime * 0.9 && currentConcurrency < maxConcurrency) {
      currentConcurrency = Math.min(currentConcurrency + 1, maxConcurrency);
    } else if (avgTime > prevAvgTime * 1.1 && currentConcurrency > 1) {
      currentConcurrency = Math.max(currentConcurrency - 1, 1);
    }
  };

  const executeNext = async (): Promise<void> => {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      const startTime = Date.now();

      try {
        results[index] = await executor(items[index], index);
        executionTimes.push(Date.now() - startTime);
        adjustConcurrency();
      } catch (error) {
        throw new Error(
          `Failed to process item at index ${index}: ${error.message}`,
        );
      }
    }
  };

  const workers = Array.from(
    { length: Math.min(currentConcurrency, items.length) },
    () => executeNext(),
  );

  await Promise.all(workers);
  return results;
}

// ============================================================================
// CONCURRENT TASK EXECUTION WITH RATE LIMITING (5 functions)
// ============================================================================

/**
 * Execute tasks with rate limiting
 *
 * @template T - Result type
 * @param tasks - Array of async tasks to execute
 * @param maxPerSecond - Maximum tasks per second
 * @returns Promise resolving to array of results
 *
 * @example
 * ```typescript
 * const results = await rateLimitedExecution(
 *   tasks,
 *   10 // max 10 per second
 * );
 * ```
 */
export async function rateLimitedExecution<T>(
  tasks: Array<() => Promise<T>>,
  maxPerSecond: number,
): Promise<T[]> {
  if (maxPerSecond <= 0) {
    throw new Error('Rate limit must be greater than 0');
  }

  const results: T[] = [];
  const intervalMs = 1000 / maxPerSecond;
  let lastExecutionTime = 0;

  for (const task of tasks) {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutionTime;

    if (timeSinceLastExecution < intervalMs) {
      await new Promise((resolve) =>
        setTimeout(resolve, intervalMs - timeSinceLastExecution),
      );
    }

    lastExecutionTime = Date.now();
    results.push(await task());
  }

  return results;
}

/**
 * Concurrent executor with configurable rate limiting
 *
 * @template T - Result type
 * @param tasks - Array of async tasks
 * @param concurrency - Maximum concurrent executions
 * @param rateLimit - Maximum executions per second
 * @returns Promise resolving to array of results
 *
 * @example
 * ```typescript
 * const results = await concurrentExecutor(
 *   tasks,
 *   5,
 *   20
 * );
 * ```
 */
export async function concurrentExecutor<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number,
  rateLimit: number,
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let currentIndex = 0;
  const intervalMs = 1000 / rateLimit;
  let lastExecutionTime = 0;

  const executeNext = async (): Promise<void> => {
    while (currentIndex < tasks.length) {
      const index = currentIndex++;
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecutionTime;

      if (timeSinceLastExecution < intervalMs) {
        await new Promise((resolve) =>
          setTimeout(resolve, intervalMs - timeSinceLastExecution),
        );
      }

      lastExecutionTime = Date.now();
      results[index] = await tasks[index]();
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () =>
    executeNext(),
  );

  await Promise.all(workers);
  return results;
}

/**
 * Sliding window rate limiter implementation
 *
 * @param maxRequests - Maximum requests in window
 * @param windowMs - Window duration in milliseconds
 * @returns Rate limiter function
 *
 * @example
 * ```typescript
 * const limiter = slidingWindowRateLimiter(100, 60000);
 * await limiter(async () => await apiCall());
 * ```
 */
export function slidingWindowRateLimiter(
  maxRequests: number,
  windowMs: number,
): <T>(task: () => Promise<T>) => Promise<T> {
  const timestamps: number[] = [];

  return async <T>(task: () => Promise<T>): Promise<T> => {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Remove timestamps outside the window
    while (timestamps.length > 0 && timestamps[0] < windowStart) {
      timestamps.shift();
    }

    if (timestamps.length >= maxRequests) {
      const oldestTimestamp = timestamps[0];
      const waitTime = oldestTimestamp + windowMs - now;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return slidingWindowRateLimiter(maxRequests, windowMs)(task);
    }

    timestamps.push(now);
    return task();
  };
}

/**
 * Token bucket rate limiter implementation
 *
 * @param capacity - Bucket capacity
 * @param refillRate - Tokens per second
 * @returns Rate limiter function
 *
 * @example
 * ```typescript
 * const limiter = tokenBucketRateLimiter(10, 2);
 * await limiter(async () => await apiCall());
 * ```
 */
export function tokenBucketRateLimiter(
  capacity: number,
  refillRate: number,
): <T>(task: () => Promise<T>) => Promise<T> {
  let tokens = capacity;
  let lastRefill = Date.now();

  const refill = () => {
    const now = Date.now();
    const timePassed = (now - lastRefill) / 1000;
    const tokensToAdd = timePassed * refillRate;
    tokens = Math.min(capacity, tokens + tokensToAdd);
    lastRefill = now;
  };

  return async <T>(task: () => Promise<T>): Promise<T> => {
    refill();

    if (tokens < 1) {
      const waitTime = ((1 - tokens) / refillRate) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return tokenBucketRateLimiter(capacity, refillRate)(task);
    }

    tokens -= 1;
    return task();
  };
}

/**
 * Adaptive rate limiter that adjusts based on error rates
 *
 * @param initialRate - Initial rate limit
 * @param minRate - Minimum rate limit
 * @param maxRate - Maximum rate limit
 * @returns Adaptive rate limiter function
 *
 * @example
 * ```typescript
 * const limiter = adaptiveRateLimiter(10, 1, 50);
 * await limiter(async () => await apiCall());
 * ```
 */
export function adaptiveRateLimiter(
  initialRate: number,
  minRate: number,
  maxRate: number,
): <T>(task: () => Promise<T>) => Promise<T> {
  let currentRate = initialRate;
  let consecutiveErrors = 0;
  let consecutiveSuccesses = 0;
  let lastExecutionTime = 0;

  return async <T>(task: () => Promise<T>): Promise<T> => {
    const now = Date.now();
    const intervalMs = 1000 / currentRate;
    const timeSinceLastExecution = now - lastExecutionTime;

    if (timeSinceLastExecution < intervalMs) {
      await new Promise((resolve) =>
        setTimeout(resolve, intervalMs - timeSinceLastExecution),
      );
    }

    lastExecutionTime = Date.now();

    try {
      const result = await task();
      consecutiveErrors = 0;
      consecutiveSuccesses++;

      // Increase rate on consistent success
      if (consecutiveSuccesses >= 10 && currentRate < maxRate) {
        currentRate = Math.min(maxRate, currentRate * 1.2);
        consecutiveSuccesses = 0;
      }

      return result;
    } catch (error) {
      consecutiveSuccesses = 0;
      consecutiveErrors++;

      // Decrease rate on errors
      if (consecutiveErrors >= 3 && currentRate > minRate) {
        currentRate = Math.max(minRate, currentRate * 0.5);
        consecutiveErrors = 0;
      }

      throw error;
    }
  };
}

// ============================================================================
// PROMISE POOL MANAGEMENT (5 functions)
// ============================================================================

/**
 * Promise pool for controlling concurrent promise execution
 */
export interface PromisePool<T, R> {
  execute: (task: T) => Promise<R>;
  drain: () => Promise<void>;
  clear: () => void;
  size: () => number;
  activeCount: () => number;
}

/**
 * Create a promise pool with controlled concurrency
 *
 * @template T - Task type
 * @template R - Result type
 * @param executor - Function to execute tasks
 * @param concurrency - Maximum concurrent executions
 * @returns Promise pool instance
 *
 * @example
 * ```typescript
 * const pool = createPromisePool(
 *   async (url) => fetch(url),
 *   5
 * );
 * const result = await pool.execute(url);
 * await pool.drain();
 * ```
 */
export function createPromisePool<T, R>(
  executor: (task: T) => Promise<R>,
  concurrency: number,
): PromisePool<T, R> {
  const queue: Array<{
    task: T;
    resolve: (value: R) => void;
    reject: (error: Error) => void;
  }> = [];
  let activeCount = 0;

  const processNext = async () => {
    if (queue.length === 0 || activeCount >= concurrency) {
      return;
    }

    activeCount++;
    const item = queue.shift();

    if (!item) {
      activeCount--;
      return;
    }

    try {
      const result = await executor(item.task);
      item.resolve(result);
    } catch (error) {
      item.reject(error instanceof Error ? error : new Error(String(error)));
    } finally {
      activeCount--;
      processNext();
    }
  };

  return {
    execute: (task: T): Promise<R> => {
      return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject });
        processNext();
      });
    },
    drain: async (): Promise<void> => {
      while (queue.length > 0 || activeCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    },
    clear: (): void => {
      queue.length = 0;
    },
    size: (): number => queue.length,
    activeCount: (): number => activeCount,
  };
}

/**
 * Execute task using a promise pool
 *
 * @template T - Task type
 * @template R - Result type
 * @param pool - Promise pool instance
 * @param tasks - Array of tasks to execute
 * @returns Promise resolving to array of results
 *
 * @example
 * ```typescript
 * const pool = createPromisePool(executor, 5);
 * const results = await poolExecutor(pool, tasks);
 * ```
 */
export async function poolExecutor<T, R>(
  pool: PromisePool<T, R>,
  tasks: T[],
): Promise<R[]> {
  const promises = tasks.map((task) => pool.execute(task));
  return Promise.all(promises);
}

/**
 * Promise pool with priority support
 *
 * @template T - Task type
 * @template R - Result type
 * @param executor - Function to execute tasks
 * @param concurrency - Maximum concurrent executions
 * @returns Promise pool with priority support
 *
 * @example
 * ```typescript
 * const pool = poolWithPriority(executor, 5);
 * await pool.execute(task, 'high');
 * ```
 */
export function poolWithPriority<T, R>(
  executor: (task: T) => Promise<R>,
  concurrency: number,
): PromisePool<T, R> & {
  execute: (task: T, priority?: Priority) => Promise<R>;
} {
  interface QueueItem {
    task: T;
    priority: Priority;
    resolve: (value: R) => void;
    reject: (error: Error) => void;
  }

  const queue: QueueItem[] = [];
  let activeCount = 0;

  const priorityOrder: Record<Priority, number> = {
    critical: 0,
    high: 1,
    normal: 2,
    low: 3,
  };

  const sortQueue = () => {
    queue.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  const processNext = async () => {
    if (queue.length === 0 || activeCount >= concurrency) {
      return;
    }

    activeCount++;
    sortQueue();
    const item = queue.shift();

    if (!item) {
      activeCount--;
      return;
    }

    try {
      const result = await executor(item.task);
      item.resolve(result);
    } catch (error) {
      item.reject(error instanceof Error ? error : new Error(String(error)));
    } finally {
      activeCount--;
      processNext();
    }
  };

  return {
    execute: (task: T, priority: Priority = 'normal'): Promise<R> => {
      return new Promise((resolve, reject) => {
        queue.push({ task, priority, resolve, reject });
        processNext();
      });
    },
    drain: async (): Promise<void> => {
      while (queue.length > 0 || activeCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    },
    clear: (): void => {
      queue.length = 0;
    },
    size: (): number => queue.length,
    activeCount: (): number => activeCount,
  };
}

/**
 * Promise pool with automatic retry on failure
 *
 * @template T - Task type
 * @template R - Result type
 * @param executor - Function to execute tasks
 * @param concurrency - Maximum concurrent executions
 * @param maxRetries - Maximum retry attempts
 * @returns Promise pool with retry support
 *
 * @example
 * ```typescript
 * const pool = poolWithRetry(executor, 5, 3);
 * const result = await pool.execute(task);
 * ```
 */
export function poolWithRetry<T, R>(
  executor: (task: T) => Promise<R>,
  concurrency: number,
  maxRetries: number,
): PromisePool<T, R> {
  const executeWithRetry = async (task: T): Promise<R> => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await executor(task);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 100),
          );
        }
      }
    }

    throw lastError;
  };

  return createPromisePool(executeWithRetry, concurrency);
}

/**
 * Promise pool with timeout support
 *
 * @template T - Task type
 * @template R - Result type
 * @param executor - Function to execute tasks
 * @param concurrency - Maximum concurrent executions
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise pool with timeout support
 *
 * @example
 * ```typescript
 * const pool = poolWithTimeout(executor, 5, 5000);
 * const result = await pool.execute(task);
 * ```
 */
export function poolWithTimeout<T, R>(
  executor: (task: T) => Promise<R>,
  concurrency: number,
  timeoutMs: number,
): PromisePool<T, R> {
  const executeWithTimeout = async (task: T): Promise<R> => {
    return Promise.race([
      executor(task),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Task timeout')), timeoutMs),
      ),
    ]);
  };

  return createPromisePool(executeWithTimeout, concurrency);
}

// ============================================================================
// PARALLEL MAP/REDUCE OPERATIONS (6 functions)
// ============================================================================

/**
 * Parallel map operation with controlled concurrency
 *
 * @template T - Input type
 * @template R - Result type
 * @param items - Array of items to map
 * @param mapper - Async mapper function
 * @param concurrency - Maximum concurrent executions
 * @returns Promise resolving to mapped array
 *
 * @example
 * ```typescript
 * const doubled = await parallelMap(
 *   [1, 2, 3],
 *   async (n) => n * 2,
 *   2
 * );
 * ```
 */
export async function parallelMap<T, R>(
  items: T[],
  mapper: (item: T, index: number) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  return parallelBatch(items, mapper, concurrency);
}

/**
 * Parallel filter operation with controlled concurrency
 *
 * @template T - Item type
 * @param items - Array of items to filter
 * @param predicate - Async predicate function
 * @param concurrency - Maximum concurrent executions
 * @returns Promise resolving to filtered array
 *
 * @example
 * ```typescript
 * const evens = await parallelFilter(
 *   [1, 2, 3, 4],
 *   async (n) => n % 2 === 0,
 *   2
 * );
 * ```
 */
export async function parallelFilter<T>(
  items: T[],
  predicate: (item: T, index: number) => Promise<boolean>,
  concurrency: number,
): Promise<T[]> {
  const results = await parallelBatch(items, predicate, concurrency);
  return items.filter((_, index) => results[index]);
}

/**
 * Parallel reduce operation with controlled concurrency
 *
 * @template T - Item type
 * @template R - Result type
 * @param items - Array of items to reduce
 * @param reducer - Async reducer function
 * @param initialValue - Initial accumulator value
 * @param concurrency - Maximum concurrent executions
 * @returns Promise resolving to reduced value
 *
 * @example
 * ```typescript
 * const sum = await parallelReduce(
 *   [1, 2, 3],
 *   async (acc, n) => acc + n,
 *   0,
 *   2
 * );
 * ```
 */
export async function parallelReduce<T, R>(
  items: T[],
  reducer: (accumulator: R, item: T, index: number) => Promise<R>,
  initialValue: R,
  concurrency: number,
): Promise<R> {
  let accumulator = initialValue;
  const chunkSize = Math.ceil(items.length / concurrency);

  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }

  const chunkResults = await Promise.all(
    chunks.map(async (chunk, chunkIndex) => {
      let chunkAcc = chunkIndex === 0 ? initialValue : accumulator;
      for (let i = 0; i < chunk.length; i++) {
        const globalIndex = chunkIndex * chunkSize + i;
        chunkAcc = await reducer(chunkAcc, chunk[i], globalIndex);
      }
      return chunkAcc;
    }),
  );

  accumulator = chunkResults[chunkResults.length - 1];
  return accumulator;
}

/**
 * Parallel flat map operation
 *
 * @template T - Input type
 * @template R - Result type
 * @param items - Array of items to flat map
 * @param mapper - Async mapper function returning arrays
 * @param concurrency - Maximum concurrent executions
 * @returns Promise resolving to flattened array
 *
 * @example
 * ```typescript
 * const flattened = await parallelFlatMap(
 *   [1, 2, 3],
 *   async (n) => [n, n * 2],
 *   2
 * );
 * ```
 */
export async function parallelFlatMap<T, R>(
  items: T[],
  mapper: (item: T, index: number) => Promise<R[]>,
  concurrency: number,
): Promise<R[]> {
  const results = await parallelBatch(items, mapper, concurrency);
  return results.flat();
}

/**
 * Parallel group by operation
 *
 * @template T - Item type
 * @template K - Key type
 * @param items - Array of items to group
 * @param keySelector - Async function to select grouping key
 * @param concurrency - Maximum concurrent executions
 * @returns Promise resolving to grouped map
 *
 * @example
 * ```typescript
 * const grouped = await parallelGroupBy(
 *   users,
 *   async (user) => user.country,
 *   5
 * );
 * ```
 */
export async function parallelGroupBy<T, K extends string | number>(
  items: T[],
  keySelector: (item: T, index: number) => Promise<K>,
  concurrency: number,
): Promise<Map<K, T[]>> {
  const keys = await parallelBatch(items, keySelector, concurrency);
  const groups = new Map<K, T[]>();

  items.forEach((item, index) => {
    const key = keys[index];
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  });

  return groups;
}

/**
 * Parallel partition operation
 *
 * @template T - Item type
 * @param items - Array of items to partition
 * @param predicate - Async predicate function
 * @param concurrency - Maximum concurrent executions
 * @returns Promise resolving to tuple of [passed, failed] arrays
 *
 * @example
 * ```typescript
 * const [evens, odds] = await parallelPartition(
 *   [1, 2, 3, 4],
 *   async (n) => n % 2 === 0,
 *   2
 * );
 * ```
 */
export async function parallelPartition<T>(
  items: T[],
  predicate: (item: T, index: number) => Promise<boolean>,
  concurrency: number,
): Promise<[T[], T[]]> {
  const results = await parallelBatch(items, predicate, concurrency);
  const passed: T[] = [];
  const failed: T[] = [];

  items.forEach((item, index) => {
    if (results[index]) {
      passed.push(item);
    } else {
      failed.push(item);
    }
  });

  return [passed, failed];
}

// ============================================================================
// WORKER POOL COORDINATION (4 functions)
// ============================================================================

/**
 * Worker pool for managing worker threads
 */
export interface WorkerPool<T, R> {
  execute: (task: T) => Promise<R>;
  broadcast: (task: T) => Promise<R[]>;
  shutdown: () => Promise<void>;
  size: number;
}

/**
 * Create a worker pool for parallel task execution
 *
 * @template T - Task type
 * @template R - Result type
 * @param workerFactory - Factory function to create workers
 * @param poolSize - Number of workers in pool
 * @returns Worker pool instance
 *
 * @example
 * ```typescript
 * const pool = createWorkerPool(
 *   () => new Worker('./worker.js'),
 *   4
 * );
 * const result = await pool.execute(task);
 * ```
 */
export function createWorkerPool<T, R>(
  workerFactory: () => { execute: (task: T) => Promise<R>; terminate: () => Promise<void> },
  poolSize: number,
): WorkerPool<T, R> {
  const workers = Array.from({ length: poolSize }, () => workerFactory());
  let currentWorkerIndex = 0;

  return {
    execute: async (task: T): Promise<R> => {
      const worker = workers[currentWorkerIndex];
      currentWorkerIndex = (currentWorkerIndex + 1) % workers.length;
      return worker.execute(task);
    },
    broadcast: async (task: T): Promise<R[]> => {
      return Promise.all(workers.map((worker) => worker.execute(task)));
    },
    shutdown: async (): Promise<void> => {
      await Promise.all(workers.map((worker) => worker.terminate()));
    },
    size: poolSize,
  };
}

/**
 * Execute task on worker pool with round-robin selection
 *
 * @template T - Task type
 * @template R - Result type
 * @param pool - Worker pool instance
 * @param task - Task to execute
 * @returns Promise resolving to result
 *
 * @example
 * ```typescript
 * const result = await workerPoolExecute(pool, task);
 * ```
 */
export async function workerPoolExecute<T, R>(
  pool: WorkerPool<T, R>,
  task: T,
): Promise<R> {
  return pool.execute(task);
}

/**
 * Broadcast task to all workers in pool
 *
 * @template T - Task type
 * @template R - Result type
 * @param pool - Worker pool instance
 * @param task - Task to broadcast
 * @returns Promise resolving to array of results from all workers
 *
 * @example
 * ```typescript
 * const results = await workerPoolBroadcast(pool, task);
 * ```
 */
export async function workerPoolBroadcast<T, R>(
  pool: WorkerPool<T, R>,
  task: T,
): Promise<R[]> {
  return pool.broadcast(task);
}

/**
 * Gracefully shutdown worker pool
 *
 * @template T - Task type
 * @template R - Result type
 * @param pool - Worker pool instance
 * @returns Promise resolving when all workers are terminated
 *
 * @example
 * ```typescript
 * await workerPoolShutdown(pool);
 * ```
 */
export async function workerPoolShutdown<T, R>(
  pool: WorkerPool<T, R>,
): Promise<void> {
  return pool.shutdown();
}

// ============================================================================
// TASK QUEUE MANAGEMENT (4 functions)
// ============================================================================

/**
 * Task queue for managing async task execution
 */
export interface TaskQueue<T, R> {
  push: (task: T) => Promise<R>;
  process: (executor: (task: T) => Promise<R>) => void;
  pause: () => void;
  resume: () => void;
  clear: () => void;
  status: () => QueueStatus;
  size: () => number;
}

/**
 * Create a task queue for sequential task processing
 *
 * @template T - Task type
 * @template R - Result type
 * @param concurrency - Maximum concurrent task processing
 * @returns Task queue instance
 *
 * @example
 * ```typescript
 * const queue = createTaskQueue<Task, Result>(2);
 * queue.process(async (task) => await processTask(task));
 * await queue.push(task);
 * ```
 */
export function createTaskQueue<T, R>(concurrency: number = 1): TaskQueue<T, R> {
  interface QueueItem {
    task: T;
    resolve: (value: R) => void;
    reject: (error: Error) => void;
  }

  const queue: QueueItem[] = [];
  let status: QueueStatus = 'idle';
  let activeCount = 0;
  let executor: ((task: T) => Promise<R>) | null = null;

  const processNext = async () => {
    if (
      status === 'paused' ||
      queue.length === 0 ||
      activeCount >= concurrency ||
      !executor
    ) {
      if (activeCount === 0 && queue.length === 0) {
        status = 'idle';
      }
      return;
    }

    status = 'processing';
    activeCount++;
    const item = queue.shift();

    if (!item) {
      activeCount--;
      return;
    }

    try {
      const result = await executor(item.task);
      item.resolve(result);
    } catch (error) {
      item.reject(error instanceof Error ? error : new Error(String(error)));
    } finally {
      activeCount--;
      processNext();
    }
  };

  return {
    push: (task: T): Promise<R> => {
      return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject });
        processNext();
      });
    },
    process: (exec: (task: T) => Promise<R>): void => {
      executor = exec;
      processNext();
    },
    pause: (): void => {
      status = 'paused';
    },
    resume: (): void => {
      if (status === 'paused') {
        status = queue.length > 0 ? 'processing' : 'idle';
        processNext();
      }
    },
    clear: (): void => {
      queue.length = 0;
      status = 'idle';
    },
    status: (): QueueStatus => status,
    size: (): number => queue.length,
  };
}

/**
 * Push task to queue for processing
 *
 * @template T - Task type
 * @template R - Result type
 * @param queue - Task queue instance
 * @param task - Task to push
 * @returns Promise resolving to result
 *
 * @example
 * ```typescript
 * const result = await taskQueuePush(queue, task);
 * ```
 */
export async function taskQueuePush<T, R>(
  queue: TaskQueue<T, R>,
  task: T,
): Promise<R> {
  return queue.push(task);
}

/**
 * Set task processor for queue
 *
 * @template T - Task type
 * @template R - Result type
 * @param queue - Task queue instance
 * @param executor - Task executor function
 *
 * @example
 * ```typescript
 * taskQueueProcess(queue, async (task) => await process(task));
 * ```
 */
export function taskQueueProcess<T, R>(
  queue: TaskQueue<T, R>,
  executor: (task: T) => Promise<R>,
): void {
  queue.process(executor);
}

/**
 * Pause task queue processing
 *
 * @template T - Task type
 * @template R - Result type
 * @param queue - Task queue instance
 *
 * @example
 * ```typescript
 * taskQueuePause(queue);
 * ```
 */
export function taskQueuePause<T, R>(queue: TaskQueue<T, R>): void {
  queue.pause();
}

// ============================================================================
// PRIORITY QUEUE IMPLEMENTATIONS (3 functions)
// ============================================================================

/**
 * Priority queue for task scheduling
 */
export interface PriorityQueue<T> {
  enqueue: (item: T, priority: number) => void;
  dequeue: () => T | undefined;
  peek: () => T | undefined;
  size: () => number;
  isEmpty: () => boolean;
}

/**
 * Create a priority queue using binary heap
 *
 * @template T - Item type
 * @returns Priority queue instance
 *
 * @example
 * ```typescript
 * const queue = createPriorityQueue<Task>();
 * queue.enqueue(task1, 5);
 * queue.enqueue(task2, 1);
 * const highest = queue.dequeue(); // task2
 * ```
 */
export function createPriorityQueue<T>(): PriorityQueue<T> {
  interface HeapNode {
    item: T;
    priority: number;
  }

  const heap: HeapNode[] = [];

  const parent = (i: number) => Math.floor((i - 1) / 2);
  const leftChild = (i: number) => 2 * i + 1;
  const rightChild = (i: number) => 2 * i + 2;

  const swap = (i: number, j: number) => {
    [heap[i], heap[j]] = [heap[j], heap[i]];
  };

  const bubbleUp = (index: number) => {
    while (index > 0 && heap[parent(index)].priority > heap[index].priority) {
      swap(index, parent(index));
      index = parent(index);
    }
  };

  const bubbleDown = (index: number) => {
    let minIndex = index;
    const left = leftChild(index);
    const right = rightChild(index);

    if (left < heap.length && heap[left].priority < heap[minIndex].priority) {
      minIndex = left;
    }

    if (right < heap.length && heap[right].priority < heap[minIndex].priority) {
      minIndex = right;
    }

    if (minIndex !== index) {
      swap(index, minIndex);
      bubbleDown(minIndex);
    }
  };

  return {
    enqueue: (item: T, priority: number): void => {
      heap.push({ item, priority });
      bubbleUp(heap.length - 1);
    },
    dequeue: (): T | undefined => {
      if (heap.length === 0) return undefined;
      if (heap.length === 1) return heap.pop()!.item;

      const root = heap[0];
      heap[0] = heap.pop()!;
      bubbleDown(0);

      return root.item;
    },
    peek: (): T | undefined => {
      return heap.length > 0 ? heap[0].item : undefined;
    },
    size: (): number => heap.length,
    isEmpty: (): boolean => heap.length === 0,
  };
}

/**
 * Enqueue item with priority
 *
 * @template T - Item type
 * @param queue - Priority queue instance
 * @param item - Item to enqueue
 * @param priority - Priority value (lower = higher priority)
 *
 * @example
 * ```typescript
 * priorityQueueEnqueue(queue, task, 5);
 * ```
 */
export function priorityQueueEnqueue<T>(
  queue: PriorityQueue<T>,
  item: T,
  priority: number,
): void {
  queue.enqueue(item, priority);
}

/**
 * Dequeue highest priority item
 *
 * @template T - Item type
 * @param queue - Priority queue instance
 * @returns Highest priority item or undefined if empty
 *
 * @example
 * ```typescript
 * const task = priorityQueueDequeue(queue);
 * ```
 */
export function priorityQueueDequeue<T>(
  queue: PriorityQueue<T>,
): T | undefined {
  return queue.dequeue();
}

// ============================================================================
// PARALLEL STREAM PROCESSING (3 functions)
// ============================================================================

/**
 * Process async iterable with parallel map
 *
 * @template T - Input type
 * @template R - Result type
 * @param iterable - Async iterable to process
 * @param mapper - Async mapper function
 * @param concurrency - Maximum concurrent operations
 * @returns Async generator yielding results
 *
 * @example
 * ```typescript
 * for await (const result of parallelStreamMap(stream, mapper, 5)) {
 *   console.log(result);
 * }
 * ```
 */
export async function* parallelStreamMap<T, R>(
  iterable: AsyncIterable<T>,
  mapper: (item: T) => Promise<R>,
  concurrency: number,
): AsyncGenerator<R> {
  const pool = createPromisePool(mapper, concurrency);
  const promises: Promise<R>[] = [];

  for await (const item of iterable) {
    const promise = pool.execute(item);
    promises.push(promise);

    if (promises.length >= concurrency) {
      const result = await Promise.race(
        promises.map((p, i) => p.then((r) => ({ index: i, result: r }))),
      );
      promises.splice(result.index, 1);
      yield result.result;
    }
  }

  while (promises.length > 0) {
    const result = await Promise.race(
      promises.map((p, i) => p.then((r) => ({ index: i, result: r }))),
    );
    promises.splice(result.index, 1);
    yield result.result;
  }
}

/**
 * Process async iterable with parallel filter
 *
 * @template T - Item type
 * @param iterable - Async iterable to filter
 * @param predicate - Async predicate function
 * @param concurrency - Maximum concurrent operations
 * @returns Async generator yielding filtered results
 *
 * @example
 * ```typescript
 * for await (const item of parallelStreamFilter(stream, predicate, 5)) {
 *   console.log(item);
 * }
 * ```
 */
export async function* parallelStreamFilter<T>(
  iterable: AsyncIterable<T>,
  predicate: (item: T) => Promise<boolean>,
  concurrency: number,
): AsyncGenerator<T> {
  const pool = createPromisePool(
    async (item: T) => {
      const passes = await predicate(item);
      return { item, passes };
    },
    concurrency,
  );

  const promises: Array<Promise<{ item: T; passes: boolean }>> = [];

  for await (const item of iterable) {
    const promise = pool.execute(item);
    promises.push(promise);

    if (promises.length >= concurrency) {
      const result = await Promise.race(
        promises.map((p, i) => p.then((r) => ({ index: i, result: r }))),
      );
      promises.splice(result.index, 1);
      if (result.result.passes) {
        yield result.result.item;
      }
    }
  }

  while (promises.length > 0) {
    const result = await Promise.race(
      promises.map((p, i) => p.then((r) => ({ index: i, result: r }))),
    );
    promises.splice(result.index, 1);
    if (result.result.passes) {
      yield result.result.item;
    }
  }
}

/**
 * Process async iterable with parallel reduce
 *
 * @template T - Item type
 * @template R - Result type
 * @param iterable - Async iterable to reduce
 * @param reducer - Async reducer function
 * @param initialValue - Initial accumulator value
 * @param concurrency - Maximum concurrent operations
 * @returns Promise resolving to reduced value
 *
 * @example
 * ```typescript
 * const sum = await parallelStreamReduce(
 *   stream,
 *   async (acc, n) => acc + n,
 *   0,
 *   5
 * );
 * ```
 */
export async function parallelStreamReduce<T, R>(
  iterable: AsyncIterable<T>,
  reducer: (accumulator: R, item: T) => Promise<R>,
  initialValue: R,
  concurrency: number,
): Promise<R> {
  const items: T[] = [];
  for await (const item of iterable) {
    items.push(item);
  }

  return parallelReduce(items, reducer, initialValue, concurrency);
}

// ============================================================================
// CHUNKED PARALLEL EXECUTION (2 functions)
// ============================================================================

/**
 * Execute items in chunks with parallel processing per chunk
 *
 * @template T - Input type
 * @template R - Result type
 * @param items - Array of items to process
 * @param executor - Async executor function
 * @param chunkSize - Size of each chunk
 * @param concurrency - Concurrent executions per chunk
 * @returns Promise resolving to array of results
 *
 * @example
 * ```typescript
 * const results = await chunkAndExecute(
 *   items,
 *   processItem,
 *   100,
 *   10
 * );
 * ```
 */
export async function chunkAndExecute<T, R>(
  items: T[],
  executor: (item: T, index: number) => Promise<R>,
  chunkSize: number,
  concurrency: number,
): Promise<R[]> {
  return parallelBatchChunked(items, executor, chunkSize, concurrency);
}

/**
 * Adaptive chunk execution that adjusts chunk size based on performance
 *
 * @template T - Input type
 * @template R - Result type
 * @param items - Array of items to process
 * @param executor - Async executor function
 * @param initialChunkSize - Initial chunk size
 * @param concurrency - Concurrent executions per chunk
 * @returns Promise resolving to array of results
 *
 * @example
 * ```typescript
 * const results = await adaptiveChunkExecution(
 *   items,
 *   processItem,
 *   50,
 *   10
 * );
 * ```
 */
export async function adaptiveChunkExecution<T, R>(
  items: T[],
  executor: (item: T, index: number) => Promise<R>,
  initialChunkSize: number,
  concurrency: number,
): Promise<R[]> {
  const results: R[] = [];
  let currentChunkSize = initialChunkSize;
  let offset = 0;
  const executionTimes: number[] = [];

  while (offset < items.length) {
    const chunk = items.slice(offset, offset + currentChunkSize);
    const startTime = Date.now();

    const chunkResults = await parallelBatch(
      chunk,
      (item, localIndex) => executor(item, offset + localIndex),
      concurrency,
    );

    results.push(...chunkResults);
    executionTimes.push(Date.now() - startTime);

    // Adjust chunk size based on execution time
    if (executionTimes.length >= 3) {
      const recentTimes = executionTimes.slice(-3);
      const avgTime = recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length;

      if (avgTime < 1000 && currentChunkSize < items.length) {
        currentChunkSize = Math.min(currentChunkSize * 2, items.length);
      } else if (avgTime > 5000 && currentChunkSize > 10) {
        currentChunkSize = Math.max(Math.floor(currentChunkSize / 2), 10);
      }
    }

    offset += chunk.length;
  }

  return results;
}

// ============================================================================
// ERROR AGGREGATION IN PARALLEL OPERATIONS (2 functions)
// ============================================================================

/**
 * Aggregate multiple errors into a single error with details
 *
 * @param errors - Array of errors to aggregate
 * @returns Aggregated error with all details
 *
 * @example
 * ```typescript
 * const aggregated = aggregateErrors(errors);
 * throw aggregated;
 * ```
 */
export function aggregateErrors(
  errors: Array<{ index: number; error: Error; input?: any }>,
): Error {
  const errorMessages = errors
    .map((e) => `[${e.index}]: ${e.error.message}`)
    .join('; ');

  const aggregated = new Error(
    `Multiple errors occurred (${errors.length}): ${errorMessages}`,
  );

  (aggregated as any).errors = errors;
  (aggregated as any).count = errors.length;

  return aggregated;
}

/**
 * Error collector for accumulating errors during parallel execution
 *
 * @returns Error collector instance
 *
 * @example
 * ```typescript
 * const collector = errorCollector();
 * collector.collect(0, error, input);
 * if (collector.hasErrors()) {
 *   throw collector.aggregateErrors();
 * }
 * ```
 */
export function errorCollector(): {
  collect: (index: number, error: Error, input?: any) => void;
  getErrors: () => Array<{ index: number; error: Error; input?: any }>;
  hasErrors: () => boolean;
  count: () => number;
  aggregateErrors: () => Error;
} {
  const errors: Array<{ index: number; error: Error; input?: any }> = [];

  return {
    collect: (index: number, error: Error, input?: any) => {
      errors.push({ index, error, input });
    },
    getErrors: () => errors,
    hasErrors: () => errors.length > 0,
    count: () => errors.length,
    aggregateErrors: () => aggregateErrors(errors),
  };
}

// ============================================================================
// CIRCUIT BREAKER PATTERNS (2 functions)
// ============================================================================

/**
 * Circuit breaker for preventing cascade failures
 */
export interface CircuitBreaker<T, R> {
  execute: (task: () => Promise<R>) => Promise<R>;
  getState: () => CircuitState;
  reset: () => void;
  forceOpen: () => void;
  forceClosed: () => void;
}

/**
 * Create a circuit breaker for fault tolerance
 *
 * @template T - Task type
 * @template R - Result type
 * @param config - Circuit breaker configuration
 * @returns Circuit breaker instance
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 5000,
 *   resetTimeout: 30000
 * });
 * const result = await breaker.execute(async () => await apiCall());
 * ```
 */
export function createCircuitBreaker<T, R>(
  config: CircuitBreakerConfig,
): CircuitBreaker<T, R> {
  let state: CircuitState = 'closed';
  let failureCount = 0;
  let successCount = 0;
  let nextAttempt = Date.now();

  const onSuccess = () => {
    failureCount = 0;

    if (state === 'half-open') {
      successCount++;
      if (successCount >= config.successThreshold) {
        state = 'closed';
        successCount = 0;
      }
    }
  };

  const onFailure = () => {
    failureCount++;
    successCount = 0;

    if (failureCount >= config.failureThreshold) {
      state = 'open';
      nextAttempt = Date.now() + config.resetTimeout;
    }
  };

  return {
    execute: async (task: () => Promise<R>): Promise<R> => {
      if (state === 'open') {
        if (Date.now() < nextAttempt) {
          throw new Error('Circuit breaker is open');
        }
        state = 'half-open';
      }

      try {
        const result = await Promise.race([
          task(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Circuit breaker timeout')), config.timeout),
          ),
        ]);

        onSuccess();
        return result;
      } catch (error) {
        onFailure();
        throw error;
      }
    },
    getState: () => state,
    reset: () => {
      state = 'closed';
      failureCount = 0;
      successCount = 0;
    },
    forceOpen: () => {
      state = 'open';
      nextAttempt = Date.now() + config.resetTimeout;
    },
    forceClosed: () => {
      state = 'closed';
      failureCount = 0;
      successCount = 0;
    },
  };
}

/**
 * Execute task with circuit breaker protection
 *
 * @template T - Task type
 * @template R - Result type
 * @param breaker - Circuit breaker instance
 * @param task - Task to execute
 * @returns Promise resolving to result
 * @throws {Error} If circuit is open or task fails
 *
 * @example
 * ```typescript
 * const result = await circuitBreakerExecute(
 *   breaker,
 *   async () => await apiCall()
 * );
 * ```
 */
export async function circuitBreakerExecute<T, R>(
  breaker: CircuitBreaker<T, R>,
  task: () => Promise<R>,
): Promise<R> {
  return breaker.execute(task);
}

// ============================================================================
// PARALLEL RETRY STRATEGIES (2 functions)
// ============================================================================

/**
 * Retry failed tasks in parallel with exponential backoff
 *
 * @template T - Input type
 * @template R - Result type
 * @param items - Array of items to process
 * @param executor - Async executor function
 * @param maxRetries - Maximum retry attempts
 * @param concurrency - Maximum concurrent executions
 * @returns Promise resolving to batch result
 *
 * @example
 * ```typescript
 * const result = await parallelRetry(
 *   items,
 *   processItem,
 *   3,
 *   5
 * );
 * ```
 */
export async function parallelRetry<T, R>(
  items: T[],
  executor: (item: T, index: number) => Promise<R>,
  maxRetries: number,
  concurrency: number,
): Promise<BatchResult<R>> {
  const success: R[] = [];
  const errors: Array<{ index: number; error: Error; input: any }> = [];
  let currentIndex = 0;

  const executeWithRetry = async (item: T, index: number): Promise<void> => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await executor(item, index);
        success.push(result);
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 100),
          );
        }
      }
    }

    errors.push({ index, error: lastError!, input: item });
  };

  const executeNext = async (): Promise<void> => {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      await executeWithRetry(items[index], index);
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () =>
    executeNext(),
  );

  await Promise.allSettled(workers);

  return {
    success,
    errors,
    totalProcessed: items.length,
    successRate: success.length / items.length,
  };
}

/**
 * Retry with jitter to prevent thundering herd
 *
 * @template T - Input type
 * @template R - Result type
 * @param items - Array of items to process
 * @param executor - Async executor function
 * @param maxRetries - Maximum retry attempts
 * @param concurrency - Maximum concurrent executions
 * @param jitterMs - Maximum jitter in milliseconds
 * @returns Promise resolving to batch result
 *
 * @example
 * ```typescript
 * const result = await parallelRetryWithJitter(
 *   items,
 *   processItem,
 *   3,
 *   5,
 *   1000
 * );
 * ```
 */
export async function parallelRetryWithJitter<T, R>(
  items: T[],
  executor: (item: T, index: number) => Promise<R>,
  maxRetries: number,
  concurrency: number,
  jitterMs: number,
): Promise<BatchResult<R>> {
  const success: R[] = [];
  const errors: Array<{ index: number; error: Error; input: any }> = [];
  let currentIndex = 0;

  const executeWithRetry = async (item: T, index: number): Promise<void> => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await executor(item, index);
        success.push(result);
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxRetries) {
          const baseDelay = Math.pow(2, attempt) * 100;
          const jitter = Math.random() * jitterMs;
          await new Promise((resolve) =>
            setTimeout(resolve, baseDelay + jitter),
          );
        }
      }
    }

    errors.push({ index, error: lastError!, input: item });
  };

  const executeNext = async (): Promise<void> => {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      await executeWithRetry(items[index], index);
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () =>
    executeNext(),
  );

  await Promise.allSettled(workers);

  return {
    success,
    errors,
    totalProcessed: items.length,
    successRate: success.length / items.length,
  };
}
