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
export declare const createWorkerPool: (config: WorkerPoolConfig) => {
    execute: <T>(task: () => Promise<T>) => Promise<T>;
    shutdown: () => Promise<void>;
    getStatus: () => {
        activeWorkers: number;
        queuedTasks: number;
        isShutdown: boolean;
    };
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
export declare const createPriorityWorkerPool: (config: WorkerPoolConfig) => {
    execute: <T>(task: () => Promise<T>, priority?: number) => Promise<T>;
    shutdown: () => Promise<void>;
    getStatus: () => {
        activeWorkers: number;
        queuedTasks: number;
        isShutdown: boolean;
    };
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
export declare const executeParallel: <T, R>(items: T[], processFn: (item: T) => Promise<R>, concurrency?: number) => Promise<R[]>;
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
export declare const parallelMap: <T, R>(items: T[], mapFn: (item: T, index: number) => Promise<R>, options?: Partial<ParallelOptions>) => Promise<R[]>;
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
export declare const createWorkQueue: <T>() => WorkQueue<T>;
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
export declare const createTaskProcessor: <T>(queue: WorkQueue<T>, concurrency?: number) => {
    start: () => void;
    stop: () => Promise<void>;
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
export declare const executeTaskQueue: <T>(tasks: Task<T>[], concurrency?: number) => Promise<TaskResult<T>[]>;
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
export declare const processBatches: <T, R>(items: T[], batchFn: (batch: T[]) => Promise<R[]>, options: BatchOptions) => Promise<R[]>;
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
export declare const createChunks: <T>(array: T[], chunkSize: number) => T[][];
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
export declare const processSlidingWindow: <T, R>(items: T[], windowSize: number, processFn: (window: T[]) => Promise<R>, step?: number) => Promise<R[]>;
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
export declare const createSemaphore: (maxConcurrent: number) => Semaphore;
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
export declare const withSemaphore: <T>(semaphore: Semaphore, fn: () => Promise<T>) => Promise<T>;
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
export declare const createLock: () => Lock;
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
export declare const withLock: <T>(lock: Lock, fn: () => Promise<T>) => Promise<T>;
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
export declare const createReadWriteLock: () => ReadWriteLock;
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
export declare const createTimedLock: (timeoutMs: number) => Lock;
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
export declare const createResourcePool: <T>(factory: () => T, maxSize: number, destroyer?: (resource: T) => void) => ResourcePool<T>;
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
export declare const withPooledResource: <T, R>(pool: ResourcePool<T>, fn: (resource: T) => Promise<R>) => Promise<R>;
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
export declare const createAtomicCounter: (initialValue?: number) => AtomicCounter;
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
export declare const createAtomicReference: <T>(initialValue: T) => {
    get: () => T;
    set: (newValue: T) => Promise<void>;
    compareAndSwap: (expected: T, newValue: T) => Promise<boolean>;
    update: (updateFn: (current: T) => T) => Promise<T>;
};
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
export declare const detectDeadlock: (dependencies: Map<string, string[]>) => DeadlockDetectionResult;
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
export declare const createLockOrder: (resourceIds: string[]) => string[];
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
export declare const acquireMultipleLocks: (locks: Map<string, Lock>, resourceIds: string[]) => Promise<void>;
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
export declare const releaseMultipleLocks: (locks: Map<string, Lock>, resourceIds: string[]) => void;
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
export declare const parallelAllOrNothing: <T>(promiseFns: Array<() => Promise<T>>) => Promise<T[]>;
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
export declare const parallelSettled: <T>(promiseFns: Array<() => Promise<T>>) => Promise<Array<{
    status: "fulfilled" | "rejected";
    value?: T;
    reason?: any;
}>>;
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
export declare const raceToSuccess: <T>(promiseFns: Array<() => Promise<T>>) => Promise<T>;
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
export declare const executeSequentially: <T>(promiseFns: Array<() => Promise<T>>) => Promise<T[]>;
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
export declare const debounceAsync: <T>(fn: (...args: any[]) => Promise<T>, delayMs: number) => ((...args: any[]) => Promise<T>);
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
export declare const throttleAsync: <T>(fn: (...args: any[]) => Promise<T>, intervalMs: number) => ((...args: any[]) => Promise<T | null>);
declare const _default: {
    createWorkerPool: (config: WorkerPoolConfig) => {
        execute: <T>(task: () => Promise<T>) => Promise<T>;
        shutdown: () => Promise<void>;
        getStatus: () => {
            activeWorkers: number;
            queuedTasks: number;
            isShutdown: boolean;
        };
    };
    createPriorityWorkerPool: (config: WorkerPoolConfig) => {
        execute: <T>(task: () => Promise<T>, priority?: number) => Promise<T>;
        shutdown: () => Promise<void>;
        getStatus: () => {
            activeWorkers: number;
            queuedTasks: number;
            isShutdown: boolean;
        };
    };
    executeParallel: <T, R>(items: T[], processFn: (item: T) => Promise<R>, concurrency?: number) => Promise<R[]>;
    parallelMap: <T, R>(items: T[], mapFn: (item: T, index: number) => Promise<R>, options?: Partial<ParallelOptions>) => Promise<R[]>;
    createWorkQueue: <T>() => WorkQueue<T>;
    createTaskProcessor: <T>(queue: WorkQueue<T>, concurrency?: number) => {
        start: () => void;
        stop: () => Promise<void>;
    };
    executeTaskQueue: <T>(tasks: Task<T>[], concurrency?: number) => Promise<TaskResult<T>[]>;
    processBatches: <T, R>(items: T[], batchFn: (batch: T[]) => Promise<R[]>, options: BatchOptions) => Promise<R[]>;
    createChunks: <T>(array: T[], chunkSize: number) => T[][];
    processSlidingWindow: <T, R>(items: T[], windowSize: number, processFn: (window: T[]) => Promise<R>, step?: number) => Promise<R[]>;
    createSemaphore: (maxConcurrent: number) => Semaphore;
    withSemaphore: <T>(semaphore: Semaphore, fn: () => Promise<T>) => Promise<T>;
    createLock: () => Lock;
    withLock: <T>(lock: Lock, fn: () => Promise<T>) => Promise<T>;
    createReadWriteLock: () => ReadWriteLock;
    createTimedLock: (timeoutMs: number) => Lock;
    createResourcePool: <T>(factory: () => T, maxSize: number, destroyer?: (resource: T) => void) => ResourcePool<T>;
    withPooledResource: <T, R>(pool: ResourcePool<T>, fn: (resource: T) => Promise<R>) => Promise<R>;
    createAtomicCounter: (initialValue?: number) => AtomicCounter;
    createAtomicReference: <T>(initialValue: T) => {
        get: () => T;
        set: (newValue: T) => Promise<void>;
        compareAndSwap: (expected: T, newValue: T) => Promise<boolean>;
        update: (updateFn: (current: T) => T) => Promise<T>;
    };
    detectDeadlock: (dependencies: Map<string, string[]>) => DeadlockDetectionResult;
    createLockOrder: (resourceIds: string[]) => string[];
    acquireMultipleLocks: (locks: Map<string, Lock>, resourceIds: string[]) => Promise<void>;
    releaseMultipleLocks: (locks: Map<string, Lock>, resourceIds: string[]) => void;
    parallelAllOrNothing: <T>(promiseFns: Array<() => Promise<T>>) => Promise<T[]>;
    parallelSettled: <T>(promiseFns: Array<() => Promise<T>>) => Promise<Array<{
        status: "fulfilled" | "rejected";
        value?: T;
        reason?: any;
    }>>;
    raceToSuccess: <T>(promiseFns: Array<() => Promise<T>>) => Promise<T>;
    executeSequentially: <T>(promiseFns: Array<() => Promise<T>>) => Promise<T[]>;
    debounceAsync: <T>(fn: (...args: any[]) => Promise<T>, delayMs: number) => ((...args: any[]) => Promise<T>);
    throttleAsync: <T>(fn: (...args: any[]) => Promise<T>, intervalMs: number) => ((...args: any[]) => Promise<T | null>);
};
export default _default;
//# sourceMappingURL=typescript-oracle-concurrency-kit.d.ts.map