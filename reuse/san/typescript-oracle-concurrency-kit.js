"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttleAsync = exports.debounceAsync = exports.executeSequentially = exports.raceToSuccess = exports.parallelSettled = exports.parallelAllOrNothing = exports.releaseMultipleLocks = exports.acquireMultipleLocks = exports.createLockOrder = exports.detectDeadlock = exports.createAtomicReference = exports.createAtomicCounter = exports.withPooledResource = exports.createResourcePool = exports.createTimedLock = exports.createReadWriteLock = exports.withLock = exports.createLock = exports.withSemaphore = exports.createSemaphore = exports.processSlidingWindow = exports.createChunks = exports.processBatches = exports.executeTaskQueue = exports.createTaskProcessor = exports.createWorkQueue = exports.parallelMap = exports.executeParallel = exports.createPriorityWorkerPool = exports.createWorkerPool = void 0;
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
const createWorkerPool = (config) => {
    const { maxWorkers, minWorkers = 1, maxQueueSize = Infinity, taskTimeout = 30000, } = config;
    let activeWorkers = 0;
    let taskQueue = [];
    let isShutdown = false;
    const execute = (task) => {
        if (isShutdown) {
            return Promise.reject(new Error('Worker pool is shutdown'));
        }
        if (taskQueue.length >= maxQueueSize) {
            return Promise.reject(new Error('Queue is full'));
        }
        return new Promise((resolve, reject) => {
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
                new Promise((_, reject) => setTimeout(() => reject(new Error('Task timeout')), taskTimeout)),
            ]);
            item.resolve(result);
        }
        catch (error) {
            item.reject(error);
        }
        finally {
            activeWorkers--;
            processQueue();
        }
    };
    const shutdown = async () => {
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
exports.createWorkerPool = createWorkerPool;
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
const createPriorityWorkerPool = (config) => {
    const basePool = (0, exports.createWorkerPool)(config);
    const priorityQueue = [];
    const execute = (task, priority = 5) => {
        return new Promise((resolve, reject) => {
            priorityQueue.push({ task, priority, promise: { resolve, reject } });
            priorityQueue.sort((a, b) => b.priority - a.priority);
            processNext();
        });
    };
    const processNext = async () => {
        if (priorityQueue.length === 0)
            return;
        const item = priorityQueue.shift();
        try {
            const result = await basePool.execute(item.task);
            item.promise.resolve(result);
        }
        catch (error) {
            item.promise.reject(error);
        }
    };
    return { execute, shutdown: basePool.shutdown, getStatus: basePool.getStatus };
};
exports.createPriorityWorkerPool = createPriorityWorkerPool;
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
const executeParallel = async (items, processFn, concurrency = 4) => {
    const results = [];
    const executing = [];
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
exports.executeParallel = executeParallel;
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
const parallelMap = async (items, mapFn, options) => {
    const { concurrency = 4, timeout, retryOnError = false, maxRetries = 3, onProgress, } = options || {};
    const results = new Array(items.length);
    let completed = 0;
    let index = 0;
    const executeItem = async (item, itemIndex) => {
        let attempts = 0;
        while (attempts <= (retryOnError ? maxRetries : 0)) {
            try {
                const taskPromise = mapFn(item, itemIndex);
                const result = timeout
                    ? await Promise.race([
                        taskPromise,
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
                    ])
                    : await taskPromise;
                results[itemIndex] = result;
                completed++;
                if (onProgress)
                    onProgress(completed, items.length);
                return;
            }
            catch (error) {
                attempts++;
                if (!retryOnError || attempts > maxRetries) {
                    throw error;
                }
            }
        }
    };
    const workers = [];
    while (index < items.length || workers.length > 0) {
        while (workers.length < concurrency && index < items.length) {
            const currentIndex = index++;
            const worker = executeItem(items[currentIndex], currentIndex);
            workers.push(worker);
        }
        if (workers.length > 0) {
            await Promise.race(workers);
            workers.splice(workers.findIndex(w => w !== undefined), 1);
        }
    }
    return results;
};
exports.parallelMap = parallelMap;
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
const createWorkQueue = () => {
    const queue = [];
    const enqueue = async (task) => {
        queue.push(task);
        queue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    };
    const dequeue = async () => {
        return queue.shift() || null;
    };
    const size = () => {
        return queue.length;
    };
    const clear = () => {
        queue.length = 0;
    };
    return { enqueue, dequeue, size, clear };
};
exports.createWorkQueue = createWorkQueue;
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
const createTaskProcessor = (queue, concurrency = 1) => {
    let isRunning = false;
    const workers = [];
    const processTask = async () => {
        while (isRunning) {
            const task = await queue.dequeue();
            if (!task) {
                await new Promise(resolve => setTimeout(resolve, 100));
                continue;
            }
            try {
                await task.execute();
            }
            catch (error) {
                console.error(`Task ${task.id} failed:`, error);
            }
        }
    };
    const start = () => {
        if (isRunning)
            return;
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
exports.createTaskProcessor = createTaskProcessor;
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
const executeTaskQueue = async (tasks, concurrency = 4) => {
    const results = [];
    const executeTask = async (task) => {
        const startTime = Date.now();
        let attempts = 0;
        const maxRetries = task.retries || 0;
        while (attempts <= maxRetries) {
            try {
                const taskPromise = task.execute();
                const result = task.timeout
                    ? await Promise.race([
                        taskPromise,
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), task.timeout)),
                    ])
                    : await taskPromise;
                return {
                    taskId: task.id,
                    status: 'completed',
                    result,
                    duration: Date.now() - startTime,
                    retries: attempts,
                };
            }
            catch (error) {
                attempts++;
                if (attempts > maxRetries) {
                    return {
                        taskId: task.id,
                        status: 'failed',
                        error: error,
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
    const mapped = await (0, exports.parallelMap)(tasks, executeTask, { concurrency });
    return mapped;
};
exports.executeTaskQueue = executeTaskQueue;
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
const processBatches = async (items, batchFn, options) => {
    const { batchSize, concurrency, delayBetweenBatches = 0 } = options;
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
    }
    const results = [];
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
exports.processBatches = processBatches;
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
const createChunks = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
};
exports.createChunks = createChunks;
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
const processSlidingWindow = async (items, windowSize, processFn, step = 1) => {
    const results = [];
    for (let i = 0; i <= items.length - windowSize; i += step) {
        const window = items.slice(i, i + windowSize);
        const result = await processFn(window);
        results.push(result);
    }
    return results;
};
exports.processSlidingWindow = processSlidingWindow;
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
const createSemaphore = (maxConcurrent) => {
    let current = 0;
    const waitQueue = [];
    const acquire = async () => {
        if (current < maxConcurrent) {
            current++;
            return;
        }
        return new Promise(resolve => {
            waitQueue.push(resolve);
        });
    };
    const release = () => {
        if (waitQueue.length > 0) {
            const resolve = waitQueue.shift();
            resolve();
        }
        else {
            current--;
        }
    };
    const available = () => {
        return maxConcurrent - current;
    };
    return { acquire, release, available };
};
exports.createSemaphore = createSemaphore;
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
const withSemaphore = async (semaphore, fn) => {
    await semaphore.acquire();
    try {
        return await fn();
    }
    finally {
        semaphore.release();
    }
};
exports.withSemaphore = withSemaphore;
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
const createLock = () => {
    let locked = false;
    const waitQueue = [];
    const acquire = async () => {
        if (!locked) {
            locked = true;
            return;
        }
        return new Promise(resolve => {
            waitQueue.push(resolve);
        });
    };
    const release = () => {
        if (waitQueue.length > 0) {
            const resolve = waitQueue.shift();
            resolve();
        }
        else {
            locked = false;
        }
    };
    const isLocked = () => locked;
    return { acquire, release, isLocked };
};
exports.createLock = createLock;
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
const withLock = async (lock, fn) => {
    await lock.acquire();
    try {
        return await fn();
    }
    finally {
        lock.release();
    }
};
exports.withLock = withLock;
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
const createReadWriteLock = () => {
    let readers = 0;
    let writers = 0;
    let writeRequests = 0;
    const readQueue = [];
    const writeQueue = [];
    const acquireRead = async () => {
        if (writers > 0 || writeRequests > 0) {
            return new Promise(resolve => {
                readQueue.push(resolve);
            });
        }
        readers++;
    };
    const releaseRead = () => {
        readers--;
        if (readers === 0 && writeQueue.length > 0) {
            const resolve = writeQueue.shift();
            writers++;
            writeRequests--;
            resolve();
        }
    };
    const acquireWrite = async () => {
        writeRequests++;
        if (readers > 0 || writers > 0) {
            return new Promise(resolve => {
                writeQueue.push(resolve);
            });
        }
        writers++;
        writeRequests--;
    };
    const releaseWrite = () => {
        writers--;
        if (writeQueue.length > 0) {
            const resolve = writeQueue.shift();
            writers++;
            writeRequests--;
            resolve();
        }
        else {
            while (readQueue.length > 0) {
                const resolve = readQueue.shift();
                readers++;
                resolve();
            }
        }
    };
    const isWriteLocked = () => writers > 0;
    return { acquireRead, releaseRead, acquireWrite, releaseWrite, isWriteLocked };
};
exports.createReadWriteLock = createReadWriteLock;
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
const createTimedLock = (timeoutMs) => {
    const baseLock = (0, exports.createLock)();
    let timeoutHandle = null;
    const acquire = async () => {
        await baseLock.acquire();
        timeoutHandle = setTimeout(() => {
            baseLock.release();
            timeoutHandle = null;
        }, timeoutMs);
    };
    const release = () => {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
            timeoutHandle = null;
        }
        baseLock.release();
    };
    return { acquire, release, isLocked: baseLock.isLocked };
};
exports.createTimedLock = createTimedLock;
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
const createResourcePool = (factory, maxSize, destroyer) => {
    const pool = [];
    const inUse = new Set();
    const waitQueue = [];
    const acquire = async () => {
        if (pool.length > 0) {
            const resource = pool.pop();
            inUse.add(resource);
            return resource;
        }
        if (inUse.size < maxSize) {
            const resource = factory();
            inUse.add(resource);
            return resource;
        }
        return new Promise(resolve => {
            waitQueue.push(resolve);
        });
    };
    const release = (resource) => {
        inUse.delete(resource);
        if (waitQueue.length > 0) {
            const resolve = waitQueue.shift();
            inUse.add(resource);
            resolve(resource);
        }
        else {
            pool.push(resource);
        }
    };
    const size = () => pool.length + inUse.size;
    const available = () => pool.length + Math.max(0, maxSize - inUse.size);
    const destroy = () => {
        if (destroyer) {
            pool.forEach(destroyer);
            inUse.forEach(destroyer);
        }
        pool.length = 0;
        inUse.clear();
    };
    return { acquire, release, size, available };
};
exports.createResourcePool = createResourcePool;
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
const withPooledResource = async (pool, fn) => {
    const resource = await pool.acquire();
    try {
        return await fn(resource);
    }
    finally {
        pool.release(resource);
    }
};
exports.withPooledResource = withPooledResource;
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
const createAtomicCounter = (initialValue = 0) => {
    const lock = (0, exports.createLock)();
    let value = initialValue;
    const increment = (delta = 1) => {
        value += delta;
        return value;
    };
    const decrement = (delta = 1) => {
        value -= delta;
        return value;
    };
    const get = () => value;
    const set = (newValue) => {
        value = newValue;
    };
    const compareAndSwap = (expected, newValue) => {
        if (value === expected) {
            value = newValue;
            return true;
        }
        return false;
    };
    return { increment, decrement, get, set, compareAndSwap };
};
exports.createAtomicCounter = createAtomicCounter;
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
const createAtomicReference = (initialValue) => {
    let value = initialValue;
    const lock = (0, exports.createLock)();
    const get = () => value;
    const set = async (newValue) => {
        await lock.acquire();
        try {
            value = newValue;
        }
        finally {
            lock.release();
        }
    };
    const compareAndSwap = async (expected, newValue) => {
        await lock.acquire();
        try {
            if (JSON.stringify(value) === JSON.stringify(expected)) {
                value = newValue;
                return true;
            }
            return false;
        }
        finally {
            lock.release();
        }
    };
    const update = async (updateFn) => {
        await lock.acquire();
        try {
            value = updateFn(value);
            return value;
        }
        finally {
            lock.release();
        }
    };
    return { get, set, compareAndSwap, update };
};
exports.createAtomicReference = createAtomicReference;
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
const detectDeadlock = (dependencies) => {
    const visited = new Set();
    const recursionStack = new Set();
    let cycle = [];
    const hasCycle = (node, path) => {
        visited.add(node);
        recursionStack.add(node);
        path.push(node);
        const deps = dependencies.get(node) || [];
        for (const dep of deps) {
            if (!visited.has(dep)) {
                if (hasCycle(dep, [...path])) {
                    return true;
                }
            }
            else if (recursionStack.has(dep)) {
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
exports.detectDeadlock = detectDeadlock;
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
const createLockOrder = (resourceIds) => {
    return [...resourceIds].sort();
};
exports.createLockOrder = createLockOrder;
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
const acquireMultipleLocks = async (locks, resourceIds) => {
    const orderedIds = (0, exports.createLockOrder)(resourceIds);
    for (const id of orderedIds) {
        const lock = locks.get(id);
        if (lock) {
            await lock.acquire();
        }
    }
};
exports.acquireMultipleLocks = acquireMultipleLocks;
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
const releaseMultipleLocks = (locks, resourceIds) => {
    const orderedIds = (0, exports.createLockOrder)(resourceIds).reverse();
    for (const id of orderedIds) {
        const lock = locks.get(id);
        if (lock) {
            lock.release();
        }
    }
};
exports.releaseMultipleLocks = releaseMultipleLocks;
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
const parallelAllOrNothing = async (promiseFns) => {
    return Promise.all(promiseFns.map(fn => fn()));
};
exports.parallelAllOrNothing = parallelAllOrNothing;
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
const parallelSettled = async (promiseFns) => {
    const results = await Promise.allSettled(promiseFns.map(fn => fn()));
    return results.map(result => ({
        status: result.status,
        ...(result.status === 'fulfilled' ? { value: result.value } : { reason: result.reason }),
    }));
};
exports.parallelSettled = parallelSettled;
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
const raceToSuccess = async (promiseFns) => {
    return Promise.race(promiseFns.map(fn => fn()));
};
exports.raceToSuccess = raceToSuccess;
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
const executeSequentially = async (promiseFns) => {
    const results = [];
    for (const fn of promiseFns) {
        results.push(await fn());
    }
    return results;
};
exports.executeSequentially = executeSequentially;
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
const debounceAsync = (fn, delayMs) => {
    let timeoutId = null;
    let pendingPromise = null;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (!pendingPromise) {
            pendingPromise = new Promise((resolve, reject) => {
                timeoutId = setTimeout(async () => {
                    try {
                        const result = await fn(...args);
                        resolve(result);
                    }
                    catch (error) {
                        reject(error);
                    }
                    finally {
                        pendingPromise = null;
                        timeoutId = null;
                    }
                }, delayMs);
            });
        }
        return pendingPromise;
    };
};
exports.debounceAsync = debounceAsync;
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
const throttleAsync = (fn, intervalMs) => {
    let lastExecuted = 0;
    return async (...args) => {
        const now = Date.now();
        if (now - lastExecuted >= intervalMs) {
            lastExecuted = now;
            return await fn(...args);
        }
        return null;
    };
};
exports.throttleAsync = throttleAsync;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Worker Pool
    createWorkerPool: exports.createWorkerPool,
    createPriorityWorkerPool: exports.createPriorityWorkerPool,
    executeParallel: exports.executeParallel,
    parallelMap: exports.parallelMap,
    // Work Queue
    createWorkQueue: exports.createWorkQueue,
    createTaskProcessor: exports.createTaskProcessor,
    executeTaskQueue: exports.executeTaskQueue,
    // Batch Processing
    processBatches: exports.processBatches,
    createChunks: exports.createChunks,
    processSlidingWindow: exports.processSlidingWindow,
    // Semaphore
    createSemaphore: exports.createSemaphore,
    withSemaphore: exports.withSemaphore,
    // Locks
    createLock: exports.createLock,
    withLock: exports.withLock,
    createReadWriteLock: exports.createReadWriteLock,
    createTimedLock: exports.createTimedLock,
    // Resource Pool
    createResourcePool: exports.createResourcePool,
    withPooledResource: exports.withPooledResource,
    // Atomic Operations
    createAtomicCounter: exports.createAtomicCounter,
    createAtomicReference: exports.createAtomicReference,
    // Deadlock Detection
    detectDeadlock: exports.detectDeadlock,
    createLockOrder: exports.createLockOrder,
    acquireMultipleLocks: exports.acquireMultipleLocks,
    releaseMultipleLocks: exports.releaseMultipleLocks,
    // Parallel Utilities
    parallelAllOrNothing: exports.parallelAllOrNothing,
    parallelSettled: exports.parallelSettled,
    raceToSuccess: exports.raceToSuccess,
    executeSequentially: exports.executeSequentially,
    debounceAsync: exports.debounceAsync,
    throttleAsync: exports.throttleAsync,
};
//# sourceMappingURL=typescript-oracle-concurrency-kit.js.map