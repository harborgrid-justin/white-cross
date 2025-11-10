/**
 * @fileoverview Enterprise-grade async coordination and promise utility functions
 * @module reuse/data/async-coordination
 * @description Production-ready functions for advanced promise handling, async patterns,
 * debounce/throttle, event emitters, middleware chains, and resource pooling
 */

import { Logger } from '@nestjs/common';
import { EventEmitter } from 'events';

/**
 * Deferred promise with external resolve/reject
 */
export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

/**
 * Async queue for managing promise execution
 */
export interface AsyncQueue<T, R> {
  push: (item: T) => Promise<R>;
  drain: () => Promise<void>;
  size: () => number;
  clear: () => void;
}

/**
 * Async event emitter interface
 */
export interface AsyncEventEmitterInterface {
  on: (event: string, listener: (...args: any[]) => Promise<void>) => void;
  emit: (event: string, ...args: any[]) => Promise<void>;
  off: (event: string, listener: (...args: any[]) => Promise<void>) => void;
  once: (event: string, listener: (...args: any[]) => Promise<void>) => void;
  removeAllListeners: (event?: string) => void;
}

/**
 * Pub/Sub subscription
 */
export interface Subscription {
  unsubscribe: () => void;
}

/**
 * Middleware function type
 */
export type Middleware<T> = (
  context: T,
  next: () => Promise<void>,
) => Promise<void>;

/**
 * Resource pool interface
 */
export interface ResourcePool<T> {
  acquire: () => Promise<T>;
  release: (resource: T) => void;
  drain: () => Promise<void>;
  size: () => number;
  available: () => number;
}

// ============================================================================
// ADVANCED PROMISE UTILITIES (6 functions)
// ============================================================================

/**
 * Wraps a promise with a timeout
 *
 * @template T - Promise result type
 * @param promise - Promise to wrap
 * @param timeoutMs - Timeout in milliseconds
 * @param errorMessage - Optional custom error message
 * @returns Promise that rejects if timeout is exceeded
 * @throws {Error} If timeout is exceeded
 *
 * @example
 * ```typescript
 * const result = await promiseWithTimeout(
 *   fetchData(),
 *   5000,
 *   'Data fetch timeout'
 * );
 * ```
 */
export async function promiseWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Promise timeout exceeded',
): Promise<T> {
  if (timeoutMs <= 0) {
    throw new Error('Timeout must be greater than 0');
  }

  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs),
    ),
  ]);
}

/**
 * Retry a promise with exponential backoff
 *
 * @template T - Promise result type
 * @param fn - Function returning a promise
 * @param maxRetries - Maximum number of retries
 * @param delayMs - Initial delay in milliseconds
 * @param backoffMultiplier - Backoff multiplier for each retry
 * @returns Promise resolving to result
 * @throws {Error} If all retries fail
 *
 * @example
 * ```typescript
 * const result = await promiseWithRetry(
 *   () => fetchData(),
 *   3,
 *   1000,
 *   2
 * );
 * ```
 */
export async function promiseWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  delayMs: number = 1000,
  backoffMultiplier: number = 2,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const delay = delayMs * Math.pow(backoffMultiplier, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Failed after ${maxRetries + 1} attempts: ${lastError?.message}`,
  );
}

/**
 * Promise with fallback value on error
 *
 * @template T - Promise result type
 * @param promise - Promise to execute
 * @param fallbackValue - Fallback value on error
 * @returns Promise resolving to result or fallback
 *
 * @example
 * ```typescript
 * const result = await promiseWithFallback(
 *   fetchData(),
 *   defaultData
 * );
 * ```
 */
export async function promiseWithFallback<T>(
  promise: Promise<T>,
  fallbackValue: T,
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    return fallbackValue;
  }
}

/**
 * Create a deferred promise with external control
 *
 * @template T - Promise result type
 * @returns Deferred object with promise, resolve, and reject
 *
 * @example
 * ```typescript
 * const deferred = promiseDefer<number>();
 * setTimeout(() => deferred.resolve(42), 1000);
 * const result = await deferred.promise;
 * ```
 */
export function promiseDefer<T>(): Deferred<T> {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: any) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

/**
 * Memoize async function results
 *
 * @template T - Argument type
 * @template R - Result type
 * @param fn - Async function to memoize
 * @param keyGenerator - Function to generate cache key
 * @param ttlMs - Time to live in milliseconds (optional)
 * @returns Memoized function
 *
 * @example
 * ```typescript
 * const memoized = promiseMemoize(
 *   async (id: string) => fetchUser(id),
 *   (id) => id,
 *   60000
 * );
 * const user = await memoized('123');
 * ```
 */
export function promiseMemoize<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string = (...args) => JSON.stringify(args),
  ttlMs?: number,
): (...args: T) => Promise<R> {
  const cache = new Map<
    string,
    { value: R; timestamp: number; promise?: Promise<R> }
  >();

  return async (...args: T): Promise<R> => {
    const key = keyGenerator(...args);
    const cached = cache.get(key);

    if (cached) {
      if (ttlMs && Date.now() - cached.timestamp > ttlMs) {
        cache.delete(key);
      } else if (cached.promise) {
        return cached.promise;
      } else {
        return cached.value;
      }
    }

    const promise = fn(...args);
    cache.set(key, { value: undefined as any, timestamp: Date.now(), promise });

    try {
      const value = await promise;
      cache.set(key, { value, timestamp: Date.now() });
      return value;
    } catch (error) {
      cache.delete(key);
      throw error;
    }
  };
}

/**
 * Reflect promise result as object with status and value/reason
 *
 * @template T - Promise result type
 * @param promise - Promise to reflect
 * @returns Promise resolving to reflected result
 *
 * @example
 * ```typescript
 * const reflected = await promiseReflect(fetchData());
 * if (reflected.status === 'fulfilled') {
 *   console.log(reflected.value);
 * } else {
 *   console.error(reflected.reason);
 * }
 * ```
 */
export async function promiseReflect<T>(
  promise: Promise<T>,
): Promise<
  | { status: 'fulfilled'; value: T }
  | { status: 'rejected'; reason: Error }
> {
  try {
    const value = await promise;
    return { status: 'fulfilled', value };
  } catch (error) {
    return {
      status: 'rejected',
      reason: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

// ============================================================================
// ASYNC/AWAIT PATTERNS (5 functions)
// ============================================================================

/**
 * Try-catch wrapper for async functions
 *
 * @template T - Result type
 * @param fn - Async function to execute
 * @returns Promise resolving to tuple [error, result]
 *
 * @example
 * ```typescript
 * const [error, data] = await asyncTryCatch(() => fetchData());
 * if (error) {
 *   console.error(error);
 * } else {
 *   console.log(data);
 * }
 * ```
 */
export async function asyncTryCatch<T>(
  fn: () => Promise<T>,
): Promise<[Error | null, T | null]> {
  try {
    const result = await fn();
    return [null, result];
  } catch (error) {
    return [error instanceof Error ? error : new Error(String(error)), null];
  }
}

/**
 * Async map operation
 *
 * @template T - Input type
 * @template R - Result type
 * @param items - Array of items to map
 * @param mapper - Async mapper function
 * @returns Promise resolving to mapped array
 *
 * @example
 * ```typescript
 * const results = await asyncMap(
 *   [1, 2, 3],
 *   async (n) => n * 2
 * );
 * ```
 */
export async function asyncMap<T, R>(
  items: T[],
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i++) {
    results.push(await mapper(items[i], i));
  }
  return results;
}

/**
 * Async forEach operation
 *
 * @template T - Item type
 * @param items - Array of items to iterate
 * @param callback - Async callback function
 * @returns Promise resolving when all iterations complete
 *
 * @example
 * ```typescript
 * await asyncForEach(
 *   items,
 *   async (item) => await processItem(item)
 * );
 * ```
 */
export async function asyncForEach<T>(
  items: T[],
  callback: (item: T, index: number) => Promise<void>,
): Promise<void> {
  for (let i = 0; i < items.length; i++) {
    await callback(items[i], i);
  }
}

/**
 * Async filter operation
 *
 * @template T - Item type
 * @param items - Array of items to filter
 * @param predicate - Async predicate function
 * @returns Promise resolving to filtered array
 *
 * @example
 * ```typescript
 * const evens = await asyncFilter(
 *   [1, 2, 3, 4],
 *   async (n) => n % 2 === 0
 * );
 * ```
 */
export async function asyncFilter<T>(
  items: T[],
  predicate: (item: T, index: number) => Promise<boolean>,
): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < items.length; i++) {
    if (await predicate(items[i], i)) {
      results.push(items[i]);
    }
  }
  return results;
}

/**
 * Async reduce operation
 *
 * @template T - Item type
 * @template R - Result type
 * @param items - Array of items to reduce
 * @param reducer - Async reducer function
 * @param initialValue - Initial accumulator value
 * @returns Promise resolving to reduced value
 *
 * @example
 * ```typescript
 * const sum = await asyncReduce(
 *   [1, 2, 3],
 *   async (acc, n) => acc + n,
 *   0
 * );
 * ```
 */
export async function asyncReduce<T, R>(
  items: T[],
  reducer: (accumulator: R, item: T, index: number) => Promise<R>,
  initialValue: R,
): Promise<R> {
  let accumulator = initialValue;
  for (let i = 0; i < items.length; i++) {
    accumulator = await reducer(accumulator, items[i], i);
  }
  return accumulator;
}

// ============================================================================
// PROMISE RACE/ALL/ALLSETTLED WRAPPERS WITH TIMEOUT (5 functions)
// ============================================================================

/**
 * Promise.race with timeout
 *
 * @template T - Promise result type
 * @param promises - Array of promises to race
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise resolving to first completed result
 * @throws {Error} If timeout is exceeded
 *
 * @example
 * ```typescript
 * const result = await raceWithTimeout(
 *   [fetchA(), fetchB()],
 *   5000
 * );
 * ```
 */
export async function raceWithTimeout<T>(
  promises: Promise<T>[],
  timeoutMs: number,
): Promise<T> {
  if (promises.length === 0) {
    throw new Error('Cannot race empty array of promises');
  }

  return Promise.race([
    Promise.race(promises),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Race timeout exceeded')), timeoutMs),
    ),
  ]);
}

/**
 * Promise.all with timeout
 *
 * @template T - Promise result type
 * @param promises - Array of promises
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise resolving to array of all results
 * @throws {Error} If any promise fails or timeout is exceeded
 *
 * @example
 * ```typescript
 * const results = await allWithTimeout(
 *   [fetchA(), fetchB(), fetchC()],
 *   10000
 * );
 * ```
 */
export async function allWithTimeout<T>(
  promises: Promise<T>[],
  timeoutMs: number,
): Promise<T[]> {
  return Promise.race([
    Promise.all(promises),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('All timeout exceeded')), timeoutMs),
    ),
  ]);
}

/**
 * Promise.allSettled with timeout
 *
 * @template T - Promise result type
 * @param promises - Array of promises
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise resolving to array of settled results
 * @throws {Error} If timeout is exceeded
 *
 * @example
 * ```typescript
 * const results = await allSettledWithTimeout(
 *   [fetchA(), fetchB()],
 *   10000
 * );
 * ```
 */
export async function allSettledWithTimeout<T>(
  promises: Promise<T>[],
  timeoutMs: number,
): Promise<PromiseSettledResult<T>[]> {
  return Promise.race([
    Promise.allSettled(promises),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('AllSettled timeout exceeded')),
        timeoutMs,
      ),
    ),
  ]);
}

/**
 * Promise.any with timeout
 *
 * @template T - Promise result type
 * @param promises - Array of promises
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise resolving to first fulfilled result
 * @throws {AggregateError} If all promises reject or timeout
 *
 * @example
 * ```typescript
 * const result = await anyWithTimeout(
 *   [fetchA(), fetchB()],
 *   5000
 * );
 * ```
 */
export async function anyWithTimeout<T>(
  promises: Promise<T>[],
  timeoutMs: number,
): Promise<T> {
  if (promises.length === 0) {
    throw new Error('Cannot use any with empty array of promises');
  }

  return Promise.race([
    Promise.any(promises),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Any timeout exceeded')), timeoutMs),
    ),
  ]);
}

/**
 * Promise.race with default value if all reject
 *
 * @template T - Promise result type
 * @param promises - Array of promises to race
 * @param defaultValue - Default value if all reject
 * @returns Promise resolving to first result or default
 *
 * @example
 * ```typescript
 * const result = await raceWithDefault(
 *   [fetchA(), fetchB()],
 *   defaultData
 * );
 * ```
 */
export async function raceWithDefault<T>(
  promises: Promise<T>[],
  defaultValue: T,
): Promise<T> {
  if (promises.length === 0) {
    return defaultValue;
  }

  try {
    return await Promise.race(promises);
  } catch (error) {
    // If first promise rejects, try Promise.any
    try {
      return await Promise.any(promises);
    } catch {
      return defaultValue;
    }
  }
}

// ============================================================================
// DEBOUNCE/THROTTLE FOR ASYNC OPERATIONS (4 functions)
// ============================================================================

/**
 * Debounce async function (trailing edge)
 *
 * @template T - Arguments type
 * @template R - Result type
 * @param fn - Async function to debounce
 * @param delayMs - Delay in milliseconds
 * @returns Debounced function
 *
 * @example
 * ```typescript
 * const debouncedSearch = asyncDebounce(
 *   async (query: string) => await searchAPI(query),
 *   300
 * );
 * await debouncedSearch('test');
 * ```
 */
export function asyncDebounce<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  delayMs: number,
): (...args: T) => Promise<R> {
  let timeoutId: NodeJS.Timeout | null = null;
  let deferred: Deferred<R> | null = null;

  return (...args: T): Promise<R> => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!deferred) {
      deferred = promiseDefer<R>();
    }

    const currentDeferred = deferred;

    timeoutId = setTimeout(async () => {
      try {
        const result = await fn(...args);
        currentDeferred.resolve(result);
      } catch (error) {
        currentDeferred.reject(error);
      } finally {
        deferred = null;
        timeoutId = null;
      }
    }, delayMs);

    return currentDeferred.promise;
  };
}

/**
 * Throttle async function
 *
 * @template T - Arguments type
 * @template R - Result type
 * @param fn - Async function to throttle
 * @param intervalMs - Throttle interval in milliseconds
 * @returns Throttled function
 *
 * @example
 * ```typescript
 * const throttledSave = asyncThrottle(
 *   async (data: Data) => await saveToAPI(data),
 *   1000
 * );
 * await throttledSave(data);
 * ```
 */
export function asyncThrottle<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  intervalMs: number,
): (...args: T) => Promise<R | undefined> {
  let lastExecutionTime = 0;
  let pendingPromise: Promise<R> | null = null;

  return async (...args: T): Promise<R | undefined> => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutionTime;

    if (timeSinceLastExecution >= intervalMs) {
      lastExecutionTime = now;
      pendingPromise = fn(...args);
      return pendingPromise;
    }

    return undefined;
  };
}

/**
 * Debounce async function (leading edge)
 *
 * @template T - Arguments type
 * @template R - Result type
 * @param fn - Async function to debounce
 * @param delayMs - Delay in milliseconds
 * @returns Debounced function
 *
 * @example
 * ```typescript
 * const debouncedClick = asyncDebounceLeading(
 *   async () => await handleClick(),
 *   500
 * );
 * await debouncedClick();
 * ```
 */
export function asyncDebounceLeading<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  delayMs: number,
): (...args: T) => Promise<R | undefined> {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecutionTime = 0;

  return async (...args: T): Promise<R | undefined> => {
    const now = Date.now();

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const shouldExecute = now - lastExecutionTime >= delayMs;

    timeoutId = setTimeout(() => {
      timeoutId = null;
    }, delayMs);

    if (shouldExecute) {
      lastExecutionTime = now;
      return fn(...args);
    }

    return undefined;
  };
}

/**
 * Throttle async function (trailing edge)
 *
 * @template T - Arguments type
 * @template R - Result type
 * @param fn - Async function to throttle
 * @param intervalMs - Throttle interval in milliseconds
 * @returns Throttled function
 *
 * @example
 * ```typescript
 * const throttledScroll = asyncThrottleTrailing(
 *   async (position: number) => await updateScrollPosition(position),
 *   200
 * );
 * await throttledScroll(100);
 * ```
 */
export function asyncThrottleTrailing<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  intervalMs: number,
): (...args: T) => Promise<R | undefined> {
  let lastExecutionTime = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: T | null = null;

  return async (...args: T): Promise<R | undefined> => {
    lastArgs = args;
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutionTime;

    if (timeSinceLastExecution >= intervalMs) {
      lastExecutionTime = now;
      const result = await fn(...args);
      lastArgs = null;
      return result;
    }

    if (!timeoutId) {
      timeoutId = setTimeout(async () => {
        if (lastArgs) {
          lastExecutionTime = Date.now();
          await fn(...lastArgs);
          lastArgs = null;
        }
        timeoutId = null;
      }, intervalMs - timeSinceLastExecution);
    }

    return undefined;
  };
}

// ============================================================================
// ASYNC QUEUE PROCESSING (4 functions)
// ============================================================================

/**
 * Create an async queue for processing items
 *
 * @template T - Item type
 * @template R - Result type
 * @param processor - Async processor function
 * @param concurrency - Maximum concurrent processing
 * @returns Async queue instance
 *
 * @example
 * ```typescript
 * const queue = createAsyncQueue(
 *   async (item) => await processItem(item),
 *   5
 * );
 * const result = await queue.push(item);
 * ```
 */
export function createAsyncQueue<T, R>(
  processor: (item: T) => Promise<R>,
  concurrency: number = 1,
): AsyncQueue<T, R> {
  interface QueueItem {
    item: T;
    deferred: Deferred<R>;
  }

  const queue: QueueItem[] = [];
  let activeCount = 0;

  const processNext = async (): Promise<void> => {
    if (queue.length === 0 || activeCount >= concurrency) {
      return;
    }

    activeCount++;
    const queueItem = queue.shift();

    if (!queueItem) {
      activeCount--;
      return;
    }

    try {
      const result = await processor(queueItem.item);
      queueItem.deferred.resolve(result);
    } catch (error) {
      queueItem.deferred.reject(error);
    } finally {
      activeCount--;
      processNext();
    }
  };

  return {
    push: (item: T): Promise<R> => {
      const deferred = promiseDefer<R>();
      queue.push({ item, deferred });
      processNext();
      return deferred.promise;
    },
    drain: async (): Promise<void> => {
      while (queue.length > 0 || activeCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    },
    size: (): number => queue.length,
    clear: (): void => {
      queue.length = 0;
    },
  };
}

/**
 * Push item to async queue
 *
 * @template T - Item type
 * @template R - Result type
 * @param queue - Async queue instance
 * @param item - Item to push
 * @returns Promise resolving to result
 *
 * @example
 * ```typescript
 * const result = await asyncQueuePush(queue, item);
 * ```
 */
export async function asyncQueuePush<T, R>(
  queue: AsyncQueue<T, R>,
  item: T,
): Promise<R> {
  return queue.push(item);
}

/**
 * Process items through async queue
 *
 * @template T - Item type
 * @template R - Result type
 * @param queue - Async queue instance
 * @param items - Items to process
 * @returns Promise resolving to array of results
 *
 * @example
 * ```typescript
 * const results = await asyncQueueProcess(queue, items);
 * ```
 */
export async function asyncQueueProcess<T, R>(
  queue: AsyncQueue<T, R>,
  items: T[],
): Promise<R[]> {
  return Promise.all(items.map((item) => queue.push(item)));
}

/**
 * Drain async queue and wait for completion
 *
 * @template T - Item type
 * @template R - Result type
 * @param queue - Async queue instance
 * @returns Promise resolving when queue is empty
 *
 * @example
 * ```typescript
 * await asyncQueueDrain(queue);
 * ```
 */
export async function asyncQueueDrain<T, R>(
  queue: AsyncQueue<T, R>,
): Promise<void> {
  return queue.drain();
}

// ============================================================================
// ASYNC ITERATOR HELPERS (4 functions)
// ============================================================================

/**
 * Map async iterator values
 *
 * @template T - Input type
 * @template R - Result type
 * @param iterable - Async iterable to map
 * @param mapper - Async mapper function
 * @returns Async generator yielding mapped values
 *
 * @example
 * ```typescript
 * for await (const result of asyncIteratorMap(stream, mapper)) {
 *   console.log(result);
 * }
 * ```
 */
export async function* asyncIteratorMap<T, R>(
  iterable: AsyncIterable<T>,
  mapper: (item: T, index: number) => Promise<R>,
): AsyncGenerator<R> {
  let index = 0;
  for await (const item of iterable) {
    yield await mapper(item, index++);
  }
}

/**
 * Filter async iterator values
 *
 * @template T - Item type
 * @param iterable - Async iterable to filter
 * @param predicate - Async predicate function
 * @returns Async generator yielding filtered values
 *
 * @example
 * ```typescript
 * for await (const item of asyncIteratorFilter(stream, predicate)) {
 *   console.log(item);
 * }
 * ```
 */
export async function* asyncIteratorFilter<T>(
  iterable: AsyncIterable<T>,
  predicate: (item: T, index: number) => Promise<boolean>,
): AsyncGenerator<T> {
  let index = 0;
  for await (const item of iterable) {
    if (await predicate(item, index++)) {
      yield item;
    }
  }
}

/**
 * Take first N items from async iterator
 *
 * @template T - Item type
 * @param iterable - Async iterable
 * @param count - Number of items to take
 * @returns Async generator yielding first N items
 *
 * @example
 * ```typescript
 * for await (const item of asyncIteratorTake(stream, 10)) {
 *   console.log(item);
 * }
 * ```
 */
export async function* asyncIteratorTake<T>(
  iterable: AsyncIterable<T>,
  count: number,
): AsyncGenerator<T> {
  if (count <= 0) {
    return;
  }

  let taken = 0;
  for await (const item of iterable) {
    yield item;
    taken++;
    if (taken >= count) {
      break;
    }
  }
}

/**
 * Convert async iterator to array
 *
 * @template T - Item type
 * @param iterable - Async iterable to convert
 * @returns Promise resolving to array of items
 *
 * @example
 * ```typescript
 * const items = await asyncIteratorToArray(stream);
 * ```
 */
export async function asyncIteratorToArray<T>(
  iterable: AsyncIterable<T>,
): Promise<T[]> {
  const items: T[] = [];
  for await (const item of iterable) {
    items.push(item);
  }
  return items;
}

// ============================================================================
// ASYNC EVENT EMITTERS (3 functions)
// ============================================================================

/**
 * Create an async event emitter
 *
 * @returns Async event emitter instance
 *
 * @example
 * ```typescript
 * const emitter = createAsyncEventEmitter();
 * emitter.on('data', async (data) => await processData(data));
 * await emitter.emit('data', data);
 * ```
 */
export function createAsyncEventEmitter(): AsyncEventEmitterInterface {
  const listeners = new Map<string, Array<(...args: any[]) => Promise<void>>>();

  return {
    on: (event: string, listener: (...args: any[]) => Promise<void>): void => {
      if (!listeners.has(event)) {
        listeners.set(event, []);
      }
      listeners.get(event)!.push(listener);
    },
    emit: async (event: string, ...args: any[]): Promise<void> => {
      const eventListeners = listeners.get(event);
      if (!eventListeners || eventListeners.length === 0) {
        return;
      }

      await Promise.all(eventListeners.map((listener) => listener(...args)));
    },
    off: (event: string, listener: (...args: any[]) => Promise<void>): void => {
      const eventListeners = listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(listener);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    },
    once: (event: string, listener: (...args: any[]) => Promise<void>): void => {
      const onceWrapper = async (...args: any[]): Promise<void> => {
        await listener(...args);
        const eventListeners = listeners.get(event);
        if (eventListeners) {
          const index = eventListeners.indexOf(onceWrapper);
          if (index > -1) {
            eventListeners.splice(index, 1);
          }
        }
      };

      if (!listeners.has(event)) {
        listeners.set(event, []);
      }
      listeners.get(event)!.push(onceWrapper);
    },
    removeAllListeners: (event?: string): void => {
      if (event) {
        listeners.delete(event);
      } else {
        listeners.clear();
      }
    },
  };
}

/**
 * Emit event to async event emitter
 *
 * @param emitter - Async event emitter instance
 * @param event - Event name
 * @param args - Event arguments
 * @returns Promise resolving when all listeners complete
 *
 * @example
 * ```typescript
 * await asyncEmit(emitter, 'data', data);
 * ```
 */
export async function asyncEmit(
  emitter: AsyncEventEmitterInterface,
  event: string,
  ...args: any[]
): Promise<void> {
  return emitter.emit(event, ...args);
}

/**
 * Register async event listener
 *
 * @param emitter - Async event emitter instance
 * @param event - Event name
 * @param listener - Async listener function
 *
 * @example
 * ```typescript
 * asyncOn(emitter, 'data', async (data) => await process(data));
 * ```
 */
export function asyncOn(
  emitter: AsyncEventEmitterInterface,
  event: string,
  listener: (...args: any[]) => Promise<void>,
): void {
  emitter.on(event, listener);
}

// ============================================================================
// PUB/SUB PATTERNS (2 functions)
// ============================================================================

/**
 * Pub/Sub interface
 */
export interface PubSub<T> {
  publish: (topic: string, data: T) => Promise<void>;
  subscribe: (
    topic: string,
    handler: (data: T) => Promise<void>,
  ) => Subscription;
  unsubscribe: (topic: string, handler: (data: T) => Promise<void>) => void;
  clear: () => void;
}

/**
 * Create a pub/sub system for async message passing
 *
 * @template T - Message type
 * @returns Pub/sub instance
 *
 * @example
 * ```typescript
 * const pubsub = createPubSub<Message>();
 * const subscription = pubsub.subscribe('topic', async (msg) => {
 *   await handleMessage(msg);
 * });
 * await pubsub.publish('topic', message);
 * ```
 */
export function createPubSub<T>(): PubSub<T> {
  const subscribers = new Map<string, Array<(data: T) => Promise<void>>>();

  return {
    publish: async (topic: string, data: T): Promise<void> => {
      const handlers = subscribers.get(topic);
      if (!handlers || handlers.length === 0) {
        return;
      }

      await Promise.all(handlers.map((handler) => handler(data)));
    },
    subscribe: (
      topic: string,
      handler: (data: T) => Promise<void>,
    ): Subscription => {
      if (!subscribers.has(topic)) {
        subscribers.set(topic, []);
      }
      subscribers.get(topic)!.push(handler);

      return {
        unsubscribe: () => {
          const handlers = subscribers.get(topic);
          if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
              handlers.splice(index, 1);
            }
          }
        },
      };
    },
    unsubscribe: (topic: string, handler: (data: T) => Promise<void>): void => {
      const handlers = subscribers.get(topic);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    },
    clear: (): void => {
      subscribers.clear();
    },
  };
}

/**
 * Publish message to pub/sub topic
 *
 * @template T - Message type
 * @param pubsub - Pub/sub instance
 * @param topic - Topic name
 * @param data - Message data
 * @returns Promise resolving when all handlers complete
 *
 * @example
 * ```typescript
 * await pubSubPublish(pubsub, 'topic', message);
 * ```
 */
export async function pubSubPublish<T>(
  pubsub: PubSub<T>,
  topic: string,
  data: T,
): Promise<void> {
  return pubsub.publish(topic, data);
}

// ============================================================================
// ASYNC MIDDLEWARE CHAINS (2 functions)
// ============================================================================

/**
 * Create async middleware chain
 *
 * @template T - Context type
 * @param middlewares - Array of middleware functions
 * @returns Function to execute middleware chain
 *
 * @example
 * ```typescript
 * const chain = createMiddlewareChain<Context>([
 *   async (ctx, next) => { console.log('before'); await next(); },
 *   async (ctx, next) => { ctx.data = 'processed'; await next(); }
 * ]);
 * await chain(context);
 * ```
 */
export function createMiddlewareChain<T>(
  middlewares: Middleware<T>[],
): (context: T) => Promise<void> {
  return async (context: T): Promise<void> => {
    let index = 0;

    const next = async (): Promise<void> => {
      if (index >= middlewares.length) {
        return;
      }

      const middleware = middlewares[index++];
      await middleware(context, next);
    };

    await next();
  };
}

/**
 * Execute middleware chain with context
 *
 * @template T - Context type
 * @param middlewares - Array of middleware functions
 * @param context - Context object
 * @returns Promise resolving when chain completes
 *
 * @example
 * ```typescript
 * await executeMiddleware(middlewares, context);
 * ```
 */
export async function executeMiddleware<T>(
  middlewares: Middleware<T>[],
  context: T,
): Promise<void> {
  const chain = createMiddlewareChain(middlewares);
  return chain(context);
}

// ============================================================================
// WATERFALL EXECUTION (2 functions)
// ============================================================================

/**
 * Execute async functions in waterfall pattern
 *
 * @template T - Initial value type
 * @template R - Result type
 * @param tasks - Array of async functions
 * @param initialValue - Initial value
 * @returns Promise resolving to final result
 *
 * @example
 * ```typescript
 * const result = await asyncWaterfall(
 *   [
 *     async (val) => val + 1,
 *     async (val) => val * 2,
 *     async (val) => val - 3
 *   ],
 *   10
 * );
 * // result = (10 + 1) * 2 - 3 = 19
 * ```
 */
export async function asyncWaterfall<T, R = T>(
  tasks: Array<(value: any) => Promise<any>>,
  initialValue: T,
): Promise<R> {
  let result: any = initialValue;

  for (const task of tasks) {
    result = await task(result);
  }

  return result as R;
}

/**
 * Execute async functions in waterfall with shared context
 *
 * @template T - Context type
 * @template R - Result type
 * @param tasks - Array of async functions
 * @param context - Shared context object
 * @returns Promise resolving to final result
 *
 * @example
 * ```typescript
 * const result = await asyncWaterfallWithContext(
 *   [
 *     async (ctx) => { ctx.data = await fetchData(); return ctx; },
 *     async (ctx) => { ctx.processed = await process(ctx.data); return ctx; }
 *   ],
 *   { userId: '123' }
 * );
 * ```
 */
export async function asyncWaterfallWithContext<T extends object, R = T>(
  tasks: Array<(context: T) => Promise<T>>,
  context: T,
): Promise<R> {
  let currentContext = context;

  for (const task of tasks) {
    currentContext = await task(currentContext);
  }

  return currentContext as unknown as R;
}

// ============================================================================
// SEQUENTIAL VS PARALLEL EXECUTION COORDINATORS (2 functions)
// ============================================================================

/**
 * Execute tasks sequentially with result collection
 *
 * @template T - Task type
 * @template R - Result type
 * @param tasks - Array of async tasks
 * @returns Promise resolving to array of results
 *
 * @example
 * ```typescript
 * const results = await sequentialExecutor([
 *   async () => await taskA(),
 *   async () => await taskB(),
 *   async () => await taskC()
 * ]);
 * ```
 */
export async function sequentialExecutor<R>(
  tasks: Array<() => Promise<R>>,
): Promise<R[]> {
  const results: R[] = [];

  for (const task of tasks) {
    results.push(await task());
  }

  return results;
}

/**
 * Coordinate parallel execution with dependency management
 *
 * @template T - Task identifier type
 * @template R - Result type
 * @param tasks - Map of tasks with dependencies
 * @returns Promise resolving to map of results
 *
 * @example
 * ```typescript
 * const results = await parallelCoordinator(
 *   new Map([
 *     ['a', { fn: async () => 1, deps: [] }],
 *     ['b', { fn: async () => 2, deps: [] }],
 *     ['c', { fn: async (results) => results.get('a') + results.get('b'), deps: ['a', 'b'] }]
 *   ])
 * );
 * ```
 */
export async function parallelCoordinator<T extends string | number, R>(
  tasks: Map<T, { fn: (results: Map<T, R>) => Promise<R>; deps: T[] }>,
): Promise<Map<T, R>> {
  const results = new Map<T, R>();
  const pending = new Set(tasks.keys());
  const processing = new Set<T>();

  const canExecute = (taskId: T): boolean => {
    const task = tasks.get(taskId);
    if (!task) return false;
    return task.deps.every((dep) => results.has(dep));
  };

  const executeTask = async (taskId: T): Promise<void> => {
    const task = tasks.get(taskId);
    if (!task) return;

    processing.add(taskId);
    try {
      const result = await task.fn(results);
      results.set(taskId, result);
    } finally {
      processing.delete(taskId);
      pending.delete(taskId);
    }
  };

  while (pending.size > 0 || processing.size > 0) {
    const readyTasks = Array.from(pending).filter(
      (taskId) => !processing.has(taskId) && canExecute(taskId),
    );

    if (readyTasks.length === 0) {
      if (processing.size === 0) {
        throw new Error('Circular dependency detected or invalid task graph');
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
      continue;
    }

    await Promise.all(readyTasks.map(executeTask));
  }

  return results;
}

// ============================================================================
// ASYNC RESOURCE POOLING (1 function)
// ============================================================================

/**
 * Create async resource pool for managing shared resources
 *
 * @template T - Resource type
 * @param factory - Factory function to create resources
 * @param maxSize - Maximum pool size
 * @param options - Pool options
 * @returns Resource pool instance
 *
 * @example
 * ```typescript
 * const pool = createAsyncResourcePool(
 *   async () => await createDatabaseConnection(),
 *   10,
 *   { idleTimeoutMs: 30000, validateOnAcquire: true }
 * );
 * const connection = await pool.acquire();
 * // use connection
 * pool.release(connection);
 * ```
 */
export function createAsyncResourcePool<T>(
  factory: () => Promise<T>,
  maxSize: number,
  options: {
    idleTimeoutMs?: number;
    validateOnAcquire?: boolean;
    validator?: (resource: T) => Promise<boolean>;
    destroyer?: (resource: T) => Promise<void>;
  } = {},
): ResourcePool<T> {
  const available: Array<{ resource: T; lastUsed: number }> = [];
  const inUse = new Set<T>();
  let creating = 0;

  const {
    idleTimeoutMs = 60000,
    validateOnAcquire = false,
    validator,
    destroyer,
  } = options;

  const createResource = async (): Promise<T> => {
    creating++;
    try {
      return await factory();
    } finally {
      creating--;
    }
  };

  const isValid = async (resource: T): Promise<boolean> => {
    if (!validator) return true;
    try {
      return await validator(resource);
    } catch {
      return false;
    }
  };

  const destroyResource = async (resource: T): Promise<void> => {
    if (destroyer) {
      try {
        await destroyer(resource);
      } catch (error) {
        // Log but don't throw
      }
    }
  };

  const cleanupIdleResources = () => {
    const now = Date.now();
    const toRemove: number[] = [];

    for (let i = available.length - 1; i >= 0; i--) {
      const item = available[i];
      if (now - item.lastUsed > idleTimeoutMs) {
        toRemove.push(i);
        destroyResource(item.resource);
      }
    }

    toRemove.forEach((index) => available.splice(index, 1));
  };

  // Periodic cleanup
  const cleanupInterval = setInterval(cleanupIdleResources, idleTimeoutMs / 2);

  return {
    acquire: async (): Promise<T> => {
      cleanupIdleResources();

      // Try to reuse available resource
      while (available.length > 0) {
        const item = available.pop();
        if (!item) break;

        if (validateOnAcquire) {
          const valid = await isValid(item.resource);
          if (!valid) {
            await destroyResource(item.resource);
            continue;
          }
        }

        inUse.add(item.resource);
        return item.resource;
      }

      // Create new resource if under limit
      if (inUse.size + creating < maxSize) {
        const resource = await createResource();
        inUse.add(resource);
        return resource;
      }

      // Wait for resource to become available
      await new Promise((resolve) => setTimeout(resolve, 50));
      return this.acquire();
    },
    release: (resource: T): void => {
      if (!inUse.has(resource)) {
        return;
      }

      inUse.delete(resource);
      available.push({ resource, lastUsed: Date.now() });
    },
    drain: async (): Promise<void> => {
      clearInterval(cleanupInterval);

      while (inUse.size > 0 || creating > 0) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      await Promise.all(
        available.map((item) => destroyResource(item.resource)),
      );
      available.length = 0;
    },
    size: (): number => inUse.size + available.length + creating,
    available: (): number => available.length,
  };
}
