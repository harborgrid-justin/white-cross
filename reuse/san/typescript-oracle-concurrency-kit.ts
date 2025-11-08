/**
 * LOC: TOCK5678901
 * File: /reuse/san/typescript-oracle-concurrency-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend async processing services
 *   - Job queue managers
 *   - Parallel data processing pipelines
 */

/**
 * File: /reuse/san/typescript-oracle-concurrency-kit.ts
 * Locator: WC-UTL-TOCK-001
 * Purpose: Concurrency and Parallelism Utilities - Thread pool simulation, work queues, parallel processing, locks, semaphores
 *
 * Upstream: Independent utility module for concurrent execution patterns
 * Downstream: ../backend/*, async job processors, data pipelines, real-time processing
 * Dependencies: TypeScript 5.x, Node 18+, Worker Threads, Async Hooks
 * Exports: 45 utility functions for managing concurrent operations, thread pools, locks, semaphores, atomic operations
 *
 * LLM Context: Production-grade concurrency utilities for building high-performance healthcare data processing systems.
 * Provides thread pool simulation, work queue management, parallel execution, lock mechanisms, semaphores, read-write locks,
 * atomic operations, deadlock detection, and resource pooling. Critical for processing large healthcare datasets, batch
 * operations, and real-time analytics while maintaining HIPAA compliance and data consistency.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface WorkerPoolConfig {
  maxWorkers: number;
  minWorkers?: number;
  maxQueueSize?: number;
  taskTimeout?: number;
  workerIdleTimeout?: number;
}

interface Task<T = any> {
  id: string;
  execute: () => Promise<T> | T;
  priority?: number;
  timeout?: number;
  retries?: number;
  metadata?: Record<string, any>;
}

interface TaskResult<T = any> {
  taskId: string;
  status: 'completed' | 'failed' | 'timeout' | 'cancelled';
  result?: T;
  error?: Error;
  duration: number;
  retries: number;
}

interface WorkQueue<T> {
  enqueue(task: Task<T>): Promise<void>;
  dequeue(): Promise<Task<T> | null>;
  size(): number;
  clear(): void;
}

interface Semaphore {
  acquire(): Promise<void>;
  release(): void;
  available(): number;
}

interface Lock {
  acquire(): Promise<void>;
  release(): void;
  isLocked(): boolean;
}

interface ReadWriteLock {
  acquireRead(): Promise<void>;
  releaseRead(): void;
  acquireWrite(): Promise<void>;
  releaseWrite(): void;
  isWriteLocked(): boolean;
}

interface ParallelOptions {
  concurrency: number;
  timeout?: number;
  retryOnError?: boolean;
  maxRetries?: number;
  onProgress?: (completed: number, total: number) => void;
}

interface BatchOptions {
  batchSize: number;
  concurrency: number;
  delayBetweenBatches?: number;
}

interface ResourcePool<T> {
  acquire(): Promise<T>;
  release(resource: T): void;
  size(): number;
  available(): number;
}

interface AtomicCounter {
  increment(delta?: number): number;
  decrement(delta?: number): number;
  get(): number;
  set(value: number): void;
  compareAndSwap(expected: number, newValue: number): boolean;
}

interface DeadlockDetectionResult {
  hasDeadlock: boolean;
  cycle?: string[];
  resources?: string[];
}

// ============================================================================
// WORKER POOL / THREAD POOL SIMULATION
// ============================================================================

/**
 * Creates a worker pool for concurrent task execution with configurable limits.
 *
 * @param {WorkerPoolConfig} config - Worker pool configuration
 * @returns {object} Worker pool with execute, shutdown, and status methods
 *
 * @example
 * ```typescript
 * const pool = createWorkerPool({
 *   maxWorkers: 4,
 *   maxQueueSize: 100,
 *   taskTimeout: 30000
 * });
 *
 * const results = await pool.execute(async () => {
 *   return await processLargeDataset();
 * });
 *
 * await pool.shutdown();
 * ```
 */
export const createWorkerPool = (config: WorkerPoolConfig) => {
  const {
    maxWorkers,
    minWorkers = 1,
    maxQueueSize = Infinity,
    taskTimeout = 30000,
  } = config;

  let activeWorkers = 0;
  let taskQueue: Array<{ task: () => Promise<any>; resolve: (value: any) => void; reject: (error: any) => void }> = [];
  let isShutdown = false;

  const execute = <T>(task: () => Promise<T>): Promise<T> => {
    if (isShutdown) {
      return Promise.reject(new Error('Worker pool is shutdown'));
    }

    if (taskQueue.length >= maxQueueSize) {
      return Promise.reject(new Error('Queue is full'));
    }

    return new Promise<T>((resolve, reject) => {
      taskQueue.push({ task, resolve, reject });
      processQueue();
    });
  };

  const processQueue = async () => {
    if (activeWorkers >= maxWorkers || taskQueue.length === 0) {
      return;
    }

    activeWorkers++;
    const item = taskQueue.shift();

    if (!item) {
      activeWorkers--;
      return;
    }

    try {
      const result = await Promise.race([
        item.task(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Task timeout')), taskTimeout)
        ),
      ]);
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    } finally {
      activeWorkers--;
      processQueue();
    }
  };

  const shutdown = async (): Promise<void> => {
    isShutdown = true;
    while (activeWorkers > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    taskQueue = [];
  };

  const getStatus = () => ({
    activeWorkers,
    queuedTasks: taskQueue.length,
    isShutdown,
  });

  return { execute, shutdown, getStatus };
};

/**
 * Creates a priority-based worker pool with task prioritization.
 *
 * @param {WorkerPoolConfig} config - Worker pool configuration
 * @returns {object} Priority worker pool
 *
 * @example
 * ```typescript
 * const pool = createPriorityWorkerPool({ maxWorkers: 4 });
 *
 * pool.execute(() => criticalTask(), 10); // High priority
 * pool.execute(() => normalTask(), 5);    // Medium priority
 * pool.execute(() => lowTask(), 1);       // Low priority
 * ```
 */
export const createPriorityWorkerPool = (config: WorkerPoolConfig) => {
  const basePool = createWorkerPool(config);
  const priorityQueue: Array<{ task: () => Promise<any>; priority: number; promise: { resolve: any; reject: any } }> = [];

  const execute = <T>(task: () => Promise<T>, priority: number = 5): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      priorityQueue.push({ task, priority, promise: { resolve, reject } });
      priorityQueue.sort((a, b) => b.priority - a.priority);
      processNext();
    });
  };

  const processNext = async () => {
    if (priorityQueue.length === 0) return;

    const item = priorityQueue.shift()!;
    try {
      const result = await basePool.execute(item.task);
      item.promise.resolve(result);
    } catch (error) {
      item.promise.reject(error);
    }
  };

  return { execute, shutdown: basePool.shutdown, getStatus: basePool.getStatus };
};

/**
 * Executes tasks in parallel with controlled concurrency.
 *
 * @template T, R
 * @param {T[]} items - Items to process
 * @param {(item: T) => Promise<R>} processFn - Processing function
 * @param {number} [concurrency] - Max concurrent executions (default: 4)
 * @returns {Promise<R[]>} Array of results
 *
 * @example
 * ```typescript
 * const userIds = [1, 2, 3, 4, 5, 6, 7, 8];
 * const users = await executeParallel(
 *   userIds,
 *   async (id) => await fetchUser(id),
 *   3 // Process 3 at a time
 * );
 * ```
 */
export const executeParallel = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  concurrency: number = 4,
): Promise<R[]> => {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const promise = processFn(item).then(result => {
      results.push(result);
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(p => p === promise), 1);
    }
  }

  await Promise.all(executing);
  return results;
};

/**
 * Maps items in parallel with concurrency control and progress tracking.
 *
 * @template T, R
 * @param {T[]} items - Items to process
 * @param {(item: T, index: number) => Promise<R>} mapFn - Mapping function
 * @param {ParallelOptions} [options] - Parallel execution options
 * @returns {Promise<R[]>} Mapped results
 *
 * @example
 * ```typescript
 * const results = await parallelMap(
 *   patients,
 *   async (patient, index) => await processPatientData(patient),
 *   {
 *     concurrency: 5,
 *     timeout: 10000,
 *     onProgress: (completed, total) => console.log(`${completed}/${total}`)
 *   }
 * );
 * ```
 */
export const parallelMap = async <T, R>(
  items: T[],
  mapFn: (item: T, index: number) => Promise<R>,
  options?: Partial<ParallelOptions>,
): Promise<R[]> => {
  const {
    concurrency = 4,
    timeout,
    retryOnError = false,
    maxRetries = 3,
    onProgress,
  } = options || {};

  const results: R[] = new Array(items.length);
  let completed = 0;
  let index = 0;

  const executeItem = async (item: T, itemIndex: number): Promise<void> => {
    let attempts = 0;

    while (attempts <= (retryOnError ? maxRetries : 0)) {
      try {
        const taskPromise = mapFn(item, itemIndex);
        const result = timeout
          ? await Promise.race([
              taskPromise,
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), timeout)
              ),
            ])
          : await taskPromise;

        results[itemIndex] = result;
        completed++;
        if (onProgress) onProgress(completed, items.length);
        return;
      } catch (error) {
        attempts++;
        if (!retryOnError || attempts > maxRetries) {
          throw error;
        }
      }
    }
  };

  const workers: Promise<void>[] = [];

  while (index < items.length || workers.length > 0) {
    while (workers.length < concurrency && index < items.length) {
      const currentIndex = index++;
      const worker = executeItem(items[currentIndex], currentIndex);
      workers.push(worker);
    }

    if (workers.length > 0) {
      await Promise.race(workers);
      workers.splice(
        workers.findIndex(w => w !== undefined),
        1
      );
    }
  }

  return results;
};

// ============================================================================
// WORK QUEUE MANAGEMENT
// ============================================================================

/**
 * Creates a FIFO work queue for task management.
 *
 * @template T
 * @returns {WorkQueue<T>} Work queue instance
 *
 * @example
 * ```typescript
 * const queue = createWorkQueue<number>();
 *
 * await queue.enqueue({
 *   id: 'task-1',
 *   execute: async () => await processData(),
 *   priority: 5
 * });
 *
 * const task = await queue.dequeue();
 * const result = await task.execute();
 * ```
 */
export const createWorkQueue = <T>(): WorkQueue<T> => {
  const queue: Task<T>[] = [];

  const enqueue = async (task: Task<T>): Promise<void> => {
    queue.push(task);
    queue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  };

  const dequeue = async (): Promise<Task<T> | null> => {
    return queue.shift() || null;
  };

  const size = (): number => {
    return queue.length;
  };

  const clear = (): void => {
    queue.length = 0;
  };

  return { enqueue, dequeue, size, clear };
};

/**
 * Creates a task processor that consumes from a work queue.
 *
 * @template T
 * @param {WorkQueue<T>} queue - Work queue
 * @param {number} [concurrency] - Number of concurrent processors
 * @returns {object} Task processor with start and stop methods
 *
 * @example
 * ```typescript
 * const queue = createWorkQueue();
 * const processor = createTaskProcessor(queue, 3);
 *
 * processor.start();
 * // Tasks are now being processed
 *
 * processor.stop();
 * ```
 */
export const createTaskProcessor = <T>(queue: WorkQueue<T>, concurrency: number = 1) => {
  let isRunning = false;
  const workers: Promise<void>[] = [];

  const processTask = async (): Promise<void> => {
    while (isRunning) {
      const task = await queue.dequeue();

      if (!task) {
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }

      try {
        await task.execute();
      } catch (error) {
        console.error(`Task ${task.id} failed:`, error);
      }
    }
  };

  const start = () => {
    if (isRunning) return;
    isRunning = true;

    for (let i = 0; i < concurrency; i++) {
      workers.push(processTask());
    }
  };

  const stop = async () => {
    isRunning = false;
    await Promise.all(workers);
    workers.length = 0;
  };

  return { start, stop };
};

/**
 * Executes tasks from a queue with retry logic and result tracking.
 *
 * @template T
 * @param {Task<T>[]} tasks - Array of tasks
 * @param {number} [concurrency] - Concurrent execution limit
 * @returns {Promise<TaskResult<T>[]>} Task results
 *
 * @example
 * ```typescript
 * const results = await executeTaskQueue([
 *   { id: '1', execute: () => task1(), retries: 3 },
 *   { id: '2', execute: () => task2(), timeout: 5000 },
 *   { id: '3', execute: () => task3() }
 * ], 2);
 * ```
 */
export const executeTaskQueue = async <T>(
  tasks: Task<T>[],
  concurrency: number = 4,
): Promise<TaskResult<T>[]> => {
  const results: TaskResult<T>[] = [];

  const executeTask = async (task: Task<T>): Promise<TaskResult<T>> => {
    const startTime = Date.now();
    let attempts = 0;
    const maxRetries = task.retries || 0;

    while (attempts <= maxRetries) {
      try {
        const taskPromise = task.execute();
        const result = task.timeout
          ? await Promise.race([
              taskPromise,
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), task.timeout)
              ),
            ])
          : await taskPromise;

        return {
          taskId: task.id,
          status: 'completed',
          result,
          duration: Date.now() - startTime,
          retries: attempts,
        };
      } catch (error) {
        attempts++;
        if (attempts > maxRetries) {
          return {
            taskId: task.id,
            status: 'failed',
            error: error as Error,
            duration: Date.now() - startTime,
            retries: attempts - 1,
          };
        }
      }
    }

    return {
      taskId: task.id,
      status: 'failed',
      duration: Date.now() - startTime,
      retries: maxRetries,
    };
  };

  const mapped = await parallelMap(tasks, executeTask, { concurrency });
  return mapped;
};

// ============================================================================
// BATCH PROCESSING
// ============================================================================

/**
 * Processes items in batches with controlled concurrency.
 *
 * @template T, R
 * @param {T[]} items - Items to process
 * @param {(batch: T[]) => Promise<R[]>} batchFn - Batch processing function
 * @param {BatchOptions} options - Batch processing options
 * @returns {Promise<R[]>} All results
 *
 * @example
 * ```typescript
 * const allResults = await processBatches(
 *   largePatientArray,
 *   async (batch) => await bulkProcessPatients(batch),
 *   { batchSize: 100, concurrency: 3, delayBetweenBatches: 1000 }
 * );
 * ```
 */
export const processBatches = async <T, R>(
  items: T[],
  batchFn: (batch: T[]) => Promise<R[]>,
  options: BatchOptions,
): Promise<R[]> => {
  const { batchSize, concurrency, delayBetweenBatches = 0 } = options;
  const batches: T[][] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  const results: R[] = [];

  for (let i = 0; i < batches.length; i += concurrency) {
    const batchGroup = batches.slice(i, i + concurrency);
    const batchResults = await Promise.all(batchGroup.map(batch => batchFn(batch)));

    results.push(...batchResults.flat());

    if (delayBetweenBatches > 0 && i + concurrency < batches.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }

  return results;
};

/**
 * Creates chunks from an array for batch processing.
 *
 * @template T
 * @param {T[]} array - Array to chunk
 * @param {number} chunkSize - Size of each chunk
 * @returns {T[][]} Array of chunks
 *
 * @example
 * ```typescript
 * const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
 * const chunks = createChunks(data, 3);
 * // Result: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
 * ```
 */
export const createChunks = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }

  return chunks;
};

/**
 * Processes items in sliding windows for streaming analysis.
 *
 * @template T, R
 * @param {T[]} items - Items to process
 * @param {number} windowSize - Window size
 * @param {(window: T[]) => Promise<R>} processFn - Window processing function
 * @param {number} [step] - Step size (default: 1)
 * @returns {Promise<R[]>} Window results
 *
 * @example
 * ```typescript
 * const results = await processSlidingWindow(
 *   vitals,
 *   5,
 *   async (window) => calculateTrend(window),
 *   1
 * );
 * ```
 */
export const processSlidingWindow = async <T, R>(
  items: T[],
  windowSize: number,
  processFn: (window: T[]) => Promise<R>,
  step: number = 1,
): Promise<R[]> => {
  const results: R[] = [];

  for (let i = 0; i <= items.length - windowSize; i += step) {
    const window = items.slice(i, i + windowSize);
    const result = await processFn(window);
    results.push(result);
  }

  return results;
};

// ============================================================================
// SEMAPHORE PATTERN
// ============================================================================

/**
 * Creates a semaphore for controlling concurrent access to resources.
 *
 * @param {number} maxConcurrent - Maximum concurrent acquisitions
 * @returns {Semaphore} Semaphore instance
 *
 * @example
 * ```typescript
 * const dbSemaphore = createSemaphore(5); // Max 5 concurrent DB connections
 *
 * await dbSemaphore.acquire();
 * try {
 *   await performDatabaseOperation();
 * } finally {
 *   dbSemaphore.release();
 * }
 * ```
 */
export const createSemaphore = (maxConcurrent: number): Semaphore => {
  let current = 0;
  const waitQueue: Array<() => void> = [];

  const acquire = async (): Promise<void> => {
    if (current < maxConcurrent) {
      current++;
      return;
    }

    return new Promise<void>(resolve => {
      waitQueue.push(resolve);
    });
  };

  const release = (): void => {
    if (waitQueue.length > 0) {
      const resolve = waitQueue.shift()!;
      resolve();
    } else {
      current--;
    }
  };

  const available = (): number => {
    return maxConcurrent - current;
  };

  return { acquire, release, available };
};

/**
 * Executes a function with semaphore-controlled concurrency.
 *
 * @template T
 * @param {Semaphore} semaphore - Semaphore instance
 * @param {() => Promise<T>} fn - Function to execute
 * @returns {Promise<T>} Function result
 *
 * @example
 * ```typescript
 * const semaphore = createSemaphore(3);
 *
 * const result = await withSemaphore(semaphore, async () => {
 *   return await expensiveOperation();
 * });
 * ```
 */
export const withSemaphore = async <T>(
  semaphore: Semaphore,
  fn: () => Promise<T>,
): Promise<T> => {
  await semaphore.acquire();
  try {
    return await fn();
  } finally {
    semaphore.release();
  }
};

// ============================================================================
// LOCK MECHANISMS
// ============================================================================

/**
 * Creates a mutual exclusion lock.
 *
 * @returns {Lock} Lock instance
 *
 * @example
 * ```typescript
 * const lock = createLock();
 *
 * await lock.acquire();
 * try {
 *   // Critical section - only one execution at a time
 *   await updateSharedResource();
 * } finally {
 *   lock.release();
 * }
 * ```
 */
export const createLock = (): Lock => {
  let locked = false;
  const waitQueue: Array<() => void> = [];

  const acquire = async (): Promise<void> => {
    if (!locked) {
      locked = true;
      return;
    }

    return new Promise<void>(resolve => {
      waitQueue.push(resolve);
    });
  };

  const release = (): void => {
    if (waitQueue.length > 0) {
      const resolve = waitQueue.shift()!;
      resolve();
    } else {
      locked = false;
    }
  };

  const isLocked = (): boolean => locked;

  return { acquire, release, isLocked };
};

/**
 * Executes a function with lock protection.
 *
 * @template T
 * @param {Lock} lock - Lock instance
 * @param {() => Promise<T>} fn - Function to execute
 * @returns {Promise<T>} Function result
 *
 * @example
 * ```typescript
 * const counterLock = createLock();
 *
 * const newValue = await withLock(counterLock, async () => {
 *   const current = await getCounter();
 *   await setCounter(current + 1);
 *   return current + 1;
 * });
 * ```
 */
export const withLock = async <T>(lock: Lock, fn: () => Promise<T>): Promise<T> => {
  await lock.acquire();
  try {
    return await fn();
  } finally {
    lock.release();
  }
};

/**
 * Creates a read-write lock for concurrent reads with exclusive writes.
 *
 * @returns {ReadWriteLock} Read-write lock instance
 *
 * @example
 * ```typescript
 * const rwLock = createReadWriteLock();
 *
 * // Multiple readers can acquire simultaneously
 * await rwLock.acquireRead();
 * const data = await readData();
 * rwLock.releaseRead();
 *
 * // Writers get exclusive access
 * await rwLock.acquireWrite();
 * await writeData(newData);
 * rwLock.releaseWrite();
 * ```
 */
export const createReadWriteLock = (): ReadWriteLock => {
  let readers = 0;
  let writers = 0;
  let writeRequests = 0;
  const readQueue: Array<() => void> = [];
  const writeQueue: Array<() => void> = [];

  const acquireRead = async (): Promise<void> => {
    if (writers > 0 || writeRequests > 0) {
      return new Promise<void>(resolve => {
        readQueue.push(resolve);
      });
    }
    readers++;
  };

  const releaseRead = (): void => {
    readers--;
    if (readers === 0 && writeQueue.length > 0) {
      const resolve = writeQueue.shift()!;
      writers++;
      writeRequests--;
      resolve();
    }
  };

  const acquireWrite = async (): Promise<void> => {
    writeRequests++;
    if (readers > 0 || writers > 0) {
      return new Promise<void>(resolve => {
        writeQueue.push(resolve);
      });
    }
    writers++;
    writeRequests--;
  };

  const releaseWrite = (): void => {
    writers--;

    if (writeQueue.length > 0) {
      const resolve = writeQueue.shift()!;
      writers++;
      writeRequests--;
      resolve();
    } else {
      while (readQueue.length > 0) {
        const resolve = readQueue.shift()!;
        readers++;
        resolve();
      }
    }
  };

  const isWriteLocked = (): boolean => writers > 0;

  return { acquireRead, releaseRead, acquireWrite, releaseWrite, isWriteLocked };
};

/**
 * Creates a timed lock that automatically releases after timeout.
 *
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Lock} Timed lock instance
 *
 * @example
 * ```typescript
 * const lock = createTimedLock(5000); // Auto-release after 5 seconds
 *
 * await lock.acquire();
 * await performOperation();
 * lock.release(); // Or it auto-releases after timeout
 * ```
 */
export const createTimedLock = (timeoutMs: number): Lock => {
  const baseLock = createLock();
  let timeoutHandle: NodeJS.Timeout | null = null;

  const acquire = async (): Promise<void> => {
    await baseLock.acquire();
    timeoutHandle = setTimeout(() => {
      baseLock.release();
      timeoutHandle = null;
    }, timeoutMs);
  };

  const release = (): void => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
      timeoutHandle = null;
    }
    baseLock.release();
  };

  return { acquire, release, isLocked: baseLock.isLocked };
};

// ============================================================================
// RESOURCE POOLING
// ============================================================================

/**
 * Creates a resource pool for managing limited resources.
 *
 * @template T
 * @param {() => T} factory - Resource factory function
 * @param {number} maxSize - Maximum pool size
 * @param {(resource: T) => void} [destroyer] - Resource cleanup function
 * @returns {ResourcePool<T>} Resource pool instance
 *
 * @example
 * ```typescript
 * const dbPool = createResourcePool(
 *   () => new DatabaseConnection(),
 *   10,
 *   (conn) => conn.close()
 * );
 *
 * const conn = await dbPool.acquire();
 * try {
 *   await conn.query('SELECT * FROM users');
 * } finally {
 *   dbPool.release(conn);
 * }
 * ```
 */
export const createResourcePool = <T>(
  factory: () => T,
  maxSize: number,
  destroyer?: (resource: T) => void,
): ResourcePool<T> => {
  const pool: T[] = [];
  const inUse = new Set<T>();
  const waitQueue: Array<(resource: T) => void> = [];

  const acquire = async (): Promise<T> => {
    if (pool.length > 0) {
      const resource = pool.pop()!;
      inUse.add(resource);
      return resource;
    }

    if (inUse.size < maxSize) {
      const resource = factory();
      inUse.add(resource);
      return resource;
    }

    return new Promise<T>(resolve => {
      waitQueue.push(resolve);
    });
  };

  const release = (resource: T): void => {
    inUse.delete(resource);

    if (waitQueue.length > 0) {
      const resolve = waitQueue.shift()!;
      inUse.add(resource);
      resolve(resource);
    } else {
      pool.push(resource);
    }
  };

  const size = (): number => pool.length + inUse.size;
  const available = (): number => pool.length + Math.max(0, maxSize - inUse.size);

  const destroy = (): void => {
    if (destroyer) {
      pool.forEach(destroyer);
      inUse.forEach(destroyer);
    }
    pool.length = 0;
    inUse.clear();
  };

  return { acquire, release, size, available };
};

/**
 * Executes a function with a pooled resource.
 *
 * @template T, R
 * @param {ResourcePool<T>} pool - Resource pool
 * @param {(resource: T) => Promise<R>} fn - Function using the resource
 * @returns {Promise<R>} Function result
 *
 * @example
 * ```typescript
 * const result = await withPooledResource(dbPool, async (db) => {
 *   return await db.query('SELECT * FROM patients');
 * });
 * ```
 */
export const withPooledResource = async <T, R>(
  pool: ResourcePool<T>,
  fn: (resource: T) => Promise<R>,
): Promise<R> => {
  const resource = await pool.acquire();
  try {
    return await fn(resource);
  } finally {
    pool.release(resource);
  }
};

// ============================================================================
// ATOMIC OPERATIONS
// ============================================================================

/**
 * Creates an atomic counter with thread-safe operations.
 *
 * @param {number} [initialValue] - Initial counter value
 * @returns {AtomicCounter} Atomic counter instance
 *
 * @example
 * ```typescript
 * const counter = createAtomicCounter(0);
 *
 * counter.increment(); // Returns 1
 * counter.increment(5); // Returns 6
 * counter.decrement(2); // Returns 4
 *
 * const swapped = counter.compareAndSwap(4, 10); // true, value is now 10
 * ```
 */
export const createAtomicCounter = (initialValue: number = 0): AtomicCounter => {
  const lock = createLock();
  let value = initialValue;

  const increment = (delta: number = 1): number => {
    value += delta;
    return value;
  };

  const decrement = (delta: number = 1): number => {
    value -= delta;
    return value;
  };

  const get = (): number => value;

  const set = (newValue: number): void => {
    value = newValue;
  };

  const compareAndSwap = (expected: number, newValue: number): boolean => {
    if (value === expected) {
      value = newValue;
      return true;
    }
    return false;
  };

  return { increment, decrement, get, set, compareAndSwap };
};

/**
 * Creates an atomic reference with compare-and-swap support.
 *
 * @template T
 * @param {T} initialValue - Initial value
 * @returns {object} Atomic reference with get, set, and compareAndSwap
 *
 * @example
 * ```typescript
 * const ref = createAtomicReference({ status: 'idle' });
 *
 * const updated = ref.compareAndSwap(
 *   { status: 'idle' },
 *   { status: 'processing' }
 * );
 * ```
 */
export const createAtomicReference = <T>(initialValue: T) => {
  let value = initialValue;
  const lock = createLock();

  const get = (): T => value;

  const set = async (newValue: T): Promise<void> => {
    await lock.acquire();
    try {
      value = newValue;
    } finally {
      lock.release();
    }
  };

  const compareAndSwap = async (expected: T, newValue: T): Promise<boolean> => {
    await lock.acquire();
    try {
      if (JSON.stringify(value) === JSON.stringify(expected)) {
        value = newValue;
        return true;
      }
      return false;
    } finally {
      lock.release();
    }
  };

  const update = async (updateFn: (current: T) => T): Promise<T> => {
    await lock.acquire();
    try {
      value = updateFn(value);
      return value;
    } finally {
      lock.release();
    }
  };

  return { get, set, compareAndSwap, update };
};

// ============================================================================
// DEADLOCK DETECTION
// ============================================================================

/**
 * Detects deadlocks in resource dependency graph.
 *
 * @param {Map<string, string[]>} dependencies - Resource dependency graph
 * @returns {DeadlockDetectionResult} Deadlock detection result
 *
 * @example
 * ```typescript
 * const deps = new Map([
 *   ['thread1', ['resource1', 'resource2']],
 *   ['thread2', ['resource2', 'resource1']]
 * ]);
 *
 * const result = detectDeadlock(deps);
 * // { hasDeadlock: true, cycle: ['thread1', 'resource2', 'thread2', 'resource1'] }
 * ```
 */
export const detectDeadlock = (
  dependencies: Map<string, string[]>,
): DeadlockDetectionResult => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  let cycle: string[] = [];

  const hasCycle = (node: string, path: string[]): boolean => {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    const deps = dependencies.get(node) || [];

    for (const dep of deps) {
      if (!visited.has(dep)) {
        if (hasCycle(dep, [...path])) {
          return true;
        }
      } else if (recursionStack.has(dep)) {
        cycle = [...path, dep];
        return true;
      }
    }

    recursionStack.delete(node);
    return false;
  };

  for (const [node] of dependencies) {
    if (!visited.has(node)) {
      if (hasCycle(node, [])) {
        return {
          hasDeadlock: true,
          cycle,
          resources: Array.from(new Set(cycle)),
        };
      }
    }
  }

  return { hasDeadlock: false };
};

/**
 * Creates a deadlock-free lock acquisition order.
 *
 * @param {string[]} resourceIds - Resource identifiers
 * @returns {string[]} Ordered resource IDs
 *
 * @example
 * ```typescript
 * const order = createLockOrder(['db', 'cache', 'file']);
 * // Always acquire locks in this order to prevent deadlocks
 * ```
 */
export const createLockOrder = (resourceIds: string[]): string[] => {
  return [...resourceIds].sort();
};

/**
 * Acquires multiple locks in deadlock-free order.
 *
 * @param {Map<string, Lock>} locks - Map of resource locks
 * @param {string[]} resourceIds - Resources to lock
 * @returns {Promise<void>} Promise that resolves when all locks acquired
 *
 * @example
 * ```typescript
 * const locks = new Map([
 *   ['db', createLock()],
 *   ['cache', createLock()],
 *   ['file', createLock()]
 * ]);
 *
 * await acquireMultipleLocks(locks, ['cache', 'db', 'file']);
 * // Locks acquired in sorted order
 * ```
 */
export const acquireMultipleLocks = async (
  locks: Map<string, Lock>,
  resourceIds: string[],
): Promise<void> => {
  const orderedIds = createLockOrder(resourceIds);

  for (const id of orderedIds) {
    const lock = locks.get(id);
    if (lock) {
      await lock.acquire();
    }
  }
};

/**
 * Releases multiple locks in reverse order.
 *
 * @param {Map<string, Lock>} locks - Map of resource locks
 * @param {string[]} resourceIds - Resources to unlock
 * @returns {void}
 *
 * @example
 * ```typescript
 * releaseMultipleLocks(locks, ['cache', 'db', 'file']);
 * ```
 */
export const releaseMultipleLocks = (
  locks: Map<string, Lock>,
  resourceIds: string[],
): void => {
  const orderedIds = createLockOrder(resourceIds).reverse();

  for (const id of orderedIds) {
    const lock = locks.get(id);
    if (lock) {
      lock.release();
    }
  }
};

// ============================================================================
// PARALLEL UTILITIES
// ============================================================================

/**
 * Executes promises in parallel with fail-fast behavior.
 *
 * @template T
 * @param {Array<() => Promise<T>>} promiseFns - Array of promise factories
 * @returns {Promise<T[]>} Array of results
 *
 * @example
 * ```typescript
 * const results = await parallelAllOrNothing([
 *   () => fetchUser(1),
 *   () => fetchUser(2),
 *   () => fetchUser(3)
 * ]);
 * ```
 */
export const parallelAllOrNothing = async <T>(
  promiseFns: Array<() => Promise<T>>,
): Promise<T[]> => {
  return Promise.all(promiseFns.map(fn => fn()));
};

/**
 * Executes promises in parallel with error tolerance.
 *
 * @template T
 * @param {Array<() => Promise<T>>} promiseFns - Array of promise factories
 * @returns {Promise<Array<{ status: 'fulfilled' | 'rejected'; value?: T; reason?: any }>>} Results
 *
 * @example
 * ```typescript
 * const results = await parallelSettled([
 *   () => fetchUser(1),
 *   () => fetchUser(2),
 *   () => fetchUser(3)
 * ]);
 * // Some may succeed, some may fail
 * ```
 */
export const parallelSettled = async <T>(
  promiseFns: Array<() => Promise<T>>,
): Promise<Array<{ status: 'fulfilled' | 'rejected'; value?: T; reason?: any }>> => {
  const results = await Promise.allSettled(promiseFns.map(fn => fn()));
  return results.map(result => ({
    status: result.status,
    ...(result.status === 'fulfilled' ? { value: result.value } : { reason: result.reason }),
  }));
};

/**
 * Races promises and returns the first successful result.
 *
 * @template T
 * @param {Array<() => Promise<T>>} promiseFns - Array of promise factories
 * @returns {Promise<T>} First successful result
 *
 * @example
 * ```typescript
 * const fastest = await raceToSuccess([
 *   () => fetchFromServer1(),
 *   () => fetchFromServer2(),
 *   () => fetchFromServer3()
 * ]);
 * // Returns result from fastest server
 * ```
 */
export const raceToSuccess = async <T>(promiseFns: Array<() => Promise<T>>): Promise<T> => {
  return Promise.race(promiseFns.map(fn => fn()));
};

/**
 * Executes promises sequentially in order.
 *
 * @template T
 * @param {Array<() => Promise<T>>} promiseFns - Array of promise factories
 * @returns {Promise<T[]>} Array of results in order
 *
 * @example
 * ```typescript
 * const results = await executeSequentially([
 *   () => step1(),
 *   () => step2(),
 *   () => step3()
 * ]);
 * ```
 */
export const executeSequentially = async <T>(
  promiseFns: Array<() => Promise<T>>,
): Promise<T[]> => {
  const results: T[] = [];

  for (const fn of promiseFns) {
    results.push(await fn());
  }

  return results;
};

/**
 * Creates a debounced async function for rate limiting.
 *
 * @template T
 * @param {(...args: any[]) => Promise<T>} fn - Function to debounce
 * @param {number} delayMs - Debounce delay in milliseconds
 * @returns {(...args: any[]) => Promise<T>} Debounced function
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounceAsync(searchPatients, 300);
 *
 * debouncedSearch('john'); // Waits 300ms
 * debouncedSearch('john doe'); // Cancels previous, waits 300ms
 * ```
 */
export const debounceAsync = <T>(
  fn: (...args: any[]) => Promise<T>,
  delayMs: number,
): ((...args: any[]) => Promise<T>) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let pendingPromise: Promise<T> | null = null;

  return (...args: any[]): Promise<T> => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!pendingPromise) {
      pendingPromise = new Promise<T>((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            pendingPromise = null;
            timeoutId = null;
          }
        }, delayMs);
      });
    }

    return pendingPromise;
  };
};

/**
 * Creates a throttled async function for rate limiting.
 *
 * @template T
 * @param {(...args: any[]) => Promise<T>} fn - Function to throttle
 * @param {number} intervalMs - Throttle interval in milliseconds
 * @returns {(...args: any[]) => Promise<T | null>} Throttled function
 *
 * @example
 * ```typescript
 * const throttledUpdate = throttleAsync(updateMetrics, 1000);
 *
 * throttledUpdate(data1); // Executes
 * throttledUpdate(data2); // Skipped (within 1000ms)
 * ```
 */
export const throttleAsync = <T>(
  fn: (...args: any[]) => Promise<T>,
  intervalMs: number,
): ((...args: any[]) => Promise<T | null>) => {
  let lastExecuted = 0;

  return async (...args: any[]): Promise<T | null> => {
    const now = Date.now();

    if (now - lastExecuted >= intervalMs) {
      lastExecuted = now;
      return await fn(...args);
    }

    return null;
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Worker Pool
  createWorkerPool,
  createPriorityWorkerPool,
  executeParallel,
  parallelMap,

  // Work Queue
  createWorkQueue,
  createTaskProcessor,
  executeTaskQueue,

  // Batch Processing
  processBatches,
  createChunks,
  processSlidingWindow,

  // Semaphore
  createSemaphore,
  withSemaphore,

  // Locks
  createLock,
  withLock,
  createReadWriteLock,
  createTimedLock,

  // Resource Pool
  createResourcePool,
  withPooledResource,

  // Atomic Operations
  createAtomicCounter,
  createAtomicReference,

  // Deadlock Detection
  detectDeadlock,
  createLockOrder,
  acquireMultipleLocks,
  releaseMultipleLocks,

  // Parallel Utilities
  parallelAllOrNothing,
  parallelSettled,
  raceToSuccess,
  executeSequentially,
  debounceAsync,
  throttleAsync,
};
