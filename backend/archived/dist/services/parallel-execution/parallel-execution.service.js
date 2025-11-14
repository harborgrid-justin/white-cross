"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parallelBatch = parallelBatch;
exports.parallelBatchWithResults = parallelBatchWithResults;
exports.parallelBatchWithErrors = parallelBatchWithErrors;
exports.parallelBatchChunked = parallelBatchChunked;
exports.parallelBatchWithProgress = parallelBatchWithProgress;
exports.parallelBatchWithCancellation = parallelBatchWithCancellation;
exports.parallelBatchDynamic = parallelBatchDynamic;
exports.rateLimitedExecution = rateLimitedExecution;
exports.concurrentExecutor = concurrentExecutor;
exports.slidingWindowRateLimiter = slidingWindowRateLimiter;
exports.tokenBucketRateLimiter = tokenBucketRateLimiter;
exports.adaptiveRateLimiter = adaptiveRateLimiter;
exports.createPromisePool = createPromisePool;
exports.poolExecutor = poolExecutor;
exports.poolWithPriority = poolWithPriority;
exports.poolWithRetry = poolWithRetry;
exports.poolWithTimeout = poolWithTimeout;
exports.parallelMap = parallelMap;
exports.parallelFilter = parallelFilter;
exports.parallelReduce = parallelReduce;
exports.parallelFlatMap = parallelFlatMap;
exports.parallelGroupBy = parallelGroupBy;
exports.parallelPartition = parallelPartition;
exports.createWorkerPool = createWorkerPool;
exports.workerPoolExecute = workerPoolExecute;
exports.workerPoolBroadcast = workerPoolBroadcast;
exports.workerPoolShutdown = workerPoolShutdown;
exports.createTaskQueue = createTaskQueue;
exports.taskQueuePush = taskQueuePush;
exports.taskQueueProcess = taskQueueProcess;
exports.taskQueuePause = taskQueuePause;
exports.createPriorityQueue = createPriorityQueue;
exports.priorityQueueEnqueue = priorityQueueEnqueue;
exports.priorityQueueDequeue = priorityQueueDequeue;
exports.parallelStreamMap = parallelStreamMap;
exports.parallelStreamFilter = parallelStreamFilter;
exports.parallelStreamReduce = parallelStreamReduce;
exports.chunkAndExecute = chunkAndExecute;
exports.adaptiveChunkExecution = adaptiveChunkExecution;
exports.aggregateErrors = aggregateErrors;
exports.errorCollector = errorCollector;
exports.createCircuitBreaker = createCircuitBreaker;
exports.circuitBreakerExecute = circuitBreakerExecute;
exports.parallelRetry = parallelRetry;
exports.parallelRetryWithJitter = parallelRetryWithJitter;
async function parallelBatch(items, executor, concurrency) {
    if (!items || items.length === 0) {
        return [];
    }
    if (concurrency <= 0) {
        throw new Error('Concurrency must be greater than 0');
    }
    const results = new Array(items.length);
    let currentIndex = 0;
    const executeNext = async () => {
        while (currentIndex < items.length) {
            const index = currentIndex++;
            try {
                results[index] = await executor(items[index], index);
            }
            catch (error) {
                throw new Error(`Failed to process item at index ${index}: ${error.message}`);
            }
        }
    };
    const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => executeNext());
    await Promise.all(workers);
    return results;
}
async function parallelBatchWithResults(items, executor, config) {
    if (!items || items.length === 0) {
        return {
            success: [],
            errors: [],
            totalProcessed: 0,
            successRate: 0,
        };
    }
    const { concurrency, timeout, signal } = config;
    const success = [];
    const errors = [];
    let currentIndex = 0;
    const executeWithTimeout = async (item, index) => {
        try {
            if (signal?.aborted) {
                throw new Error('Operation aborted');
            }
            let result;
            if (timeout) {
                result = await Promise.race([
                    executor(item, index),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
                ]);
            }
            else {
                result = await executor(item, index);
            }
            success.push(result);
        }
        catch (error) {
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
    const executeNext = async () => {
        while (currentIndex < items.length) {
            const index = currentIndex++;
            await executeWithTimeout(items[index], index);
        }
    };
    const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => executeNext());
    await Promise.allSettled(workers);
    return {
        success,
        errors,
        totalProcessed: items.length,
        successRate: success.length / items.length,
    };
}
async function parallelBatchWithErrors(items, executor, concurrency) {
    const results = new Array(items.length).fill(null);
    const errors = new Map();
    let currentIndex = 0;
    const executeNext = async () => {
        while (currentIndex < items.length) {
            const index = currentIndex++;
            try {
                results[index] = await executor(items[index], index);
            }
            catch (error) {
                errors.set(index, error instanceof Error ? error : new Error(String(error)));
            }
        }
    };
    const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => executeNext());
    await Promise.allSettled(workers);
    return { results, errors };
}
async function parallelBatchChunked(items, executor, chunkSize, concurrency) {
    if (chunkSize <= 0) {
        throw new Error('Chunk size must be greater than 0');
    }
    const results = [];
    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const chunkResults = await parallelBatch(chunk, (item, localIndex) => executor(item, i + localIndex), concurrency);
        results.push(...chunkResults);
    }
    return results;
}
async function parallelBatchWithProgress(items, executor, concurrency, onProgress) {
    const results = new Array(items.length);
    let completed = 0;
    let currentIndex = 0;
    const executeNext = async () => {
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
            }
            catch (error) {
                throw new Error(`Failed to process item at index ${index}: ${error.message}`);
            }
        }
    };
    const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => executeNext());
    await Promise.all(workers);
    return results;
}
async function parallelBatchWithCancellation(items, executor, concurrency, signal) {
    const results = [];
    let currentIndex = 0;
    let aborted = false;
    signal.addEventListener('abort', () => {
        aborted = true;
    });
    const executeNext = async () => {
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
            }
            catch (error) {
                if (signal.aborted) {
                    break;
                }
                throw error;
            }
        }
    };
    const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => executeNext());
    await Promise.allSettled(workers);
    return results.filter((r) => r !== undefined);
}
async function parallelBatchDynamic(items, executor, initialConcurrency, maxConcurrency) {
    const results = new Array(items.length);
    let currentIndex = 0;
    let currentConcurrency = initialConcurrency;
    const executionTimes = [];
    const adjustConcurrency = () => {
        if (executionTimes.length < 10)
            return;
        const recentTimes = executionTimes.slice(-10);
        const avgTime = recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length;
        const prevTimes = executionTimes.slice(-20, -10);
        const prevAvgTime = prevTimes.reduce((a, b) => a + b, 0) / prevTimes.length;
        if (avgTime < prevAvgTime * 0.9 && currentConcurrency < maxConcurrency) {
            currentConcurrency = Math.min(currentConcurrency + 1, maxConcurrency);
        }
        else if (avgTime > prevAvgTime * 1.1 && currentConcurrency > 1) {
            currentConcurrency = Math.max(currentConcurrency - 1, 1);
        }
    };
    const executeNext = async () => {
        while (currentIndex < items.length) {
            const index = currentIndex++;
            const startTime = Date.now();
            try {
                results[index] = await executor(items[index], index);
                executionTimes.push(Date.now() - startTime);
                adjustConcurrency();
            }
            catch (error) {
                throw new Error(`Failed to process item at index ${index}: ${error.message}`);
            }
        }
    };
    const workers = Array.from({ length: Math.min(currentConcurrency, items.length) }, () => executeNext());
    await Promise.all(workers);
    return results;
}
async function rateLimitedExecution(tasks, maxPerSecond) {
    if (maxPerSecond <= 0) {
        throw new Error('Rate limit must be greater than 0');
    }
    const results = [];
    const intervalMs = 1000 / maxPerSecond;
    let lastExecutionTime = 0;
    for (const task of tasks) {
        const now = Date.now();
        const timeSinceLastExecution = now - lastExecutionTime;
        if (timeSinceLastExecution < intervalMs) {
            await new Promise((resolve) => setTimeout(resolve, intervalMs - timeSinceLastExecution));
        }
        lastExecutionTime = Date.now();
        results.push(await task());
    }
    return results;
}
async function concurrentExecutor(tasks, concurrency, rateLimit) {
    const results = new Array(tasks.length);
    let currentIndex = 0;
    const intervalMs = 1000 / rateLimit;
    let lastExecutionTime = 0;
    const executeNext = async () => {
        while (currentIndex < tasks.length) {
            const index = currentIndex++;
            const now = Date.now();
            const timeSinceLastExecution = now - lastExecutionTime;
            if (timeSinceLastExecution < intervalMs) {
                await new Promise((resolve) => setTimeout(resolve, intervalMs - timeSinceLastExecution));
            }
            lastExecutionTime = Date.now();
            results[index] = await tasks[index]();
        }
    };
    const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => executeNext());
    await Promise.all(workers);
    return results;
}
function slidingWindowRateLimiter(maxRequests, windowMs) {
    const timestamps = [];
    return async (task) => {
        const now = Date.now();
        const windowStart = now - windowMs;
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
function tokenBucketRateLimiter(capacity, refillRate) {
    let tokens = capacity;
    let lastRefill = Date.now();
    const refill = () => {
        const now = Date.now();
        const timePassed = (now - lastRefill) / 1000;
        const tokensToAdd = timePassed * refillRate;
        tokens = Math.min(capacity, tokens + tokensToAdd);
        lastRefill = now;
    };
    return async (task) => {
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
function adaptiveRateLimiter(initialRate, minRate, maxRate) {
    let currentRate = initialRate;
    let consecutiveErrors = 0;
    let consecutiveSuccesses = 0;
    let lastExecutionTime = 0;
    return async (task) => {
        const now = Date.now();
        const intervalMs = 1000 / currentRate;
        const timeSinceLastExecution = now - lastExecutionTime;
        if (timeSinceLastExecution < intervalMs) {
            await new Promise((resolve) => setTimeout(resolve, intervalMs - timeSinceLastExecution));
        }
        lastExecutionTime = Date.now();
        try {
            const result = await task();
            consecutiveErrors = 0;
            consecutiveSuccesses++;
            if (consecutiveSuccesses >= 10 && currentRate < maxRate) {
                currentRate = Math.min(maxRate, currentRate * 1.2);
                consecutiveSuccesses = 0;
            }
            return result;
        }
        catch (error) {
            consecutiveSuccesses = 0;
            consecutiveErrors++;
            if (consecutiveErrors >= 3 && currentRate > minRate) {
                currentRate = Math.max(minRate, currentRate * 0.5);
                consecutiveErrors = 0;
            }
            throw error;
        }
    };
}
function createPromisePool(executor, concurrency) {
    const queue = [];
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
        }
        catch (error) {
            item.reject(error instanceof Error ? error : new Error(String(error)));
        }
        finally {
            activeCount--;
            processNext();
        }
    };
    return {
        execute: (task) => {
            return new Promise((resolve, reject) => {
                queue.push({ task, resolve, reject });
                processNext();
            });
        },
        drain: async () => {
            while (queue.length > 0 || activeCount > 0) {
                await new Promise((resolve) => setTimeout(resolve, 10));
            }
        },
        clear: () => {
            queue.length = 0;
        },
        size: () => queue.length,
        activeCount: () => activeCount,
    };
}
async function poolExecutor(pool, tasks) {
    const promises = tasks.map((task) => pool.execute(task));
    return Promise.all(promises);
}
function poolWithPriority(executor, concurrency) {
    const queue = [];
    let activeCount = 0;
    const priorityOrder = {
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
        }
        catch (error) {
            item.reject(error instanceof Error ? error : new Error(String(error)));
        }
        finally {
            activeCount--;
            processNext();
        }
    };
    return {
        execute: (task, priority = 'normal') => {
            return new Promise((resolve, reject) => {
                queue.push({ task, priority, resolve, reject });
                processNext();
            });
        },
        drain: async () => {
            while (queue.length > 0 || activeCount > 0) {
                await new Promise((resolve) => setTimeout(resolve, 10));
            }
        },
        clear: () => {
            queue.length = 0;
        },
        size: () => queue.length,
        activeCount: () => activeCount,
    };
}
function poolWithRetry(executor, concurrency, maxRetries) {
    const executeWithRetry = async (task) => {
        let lastError = null;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await executor(task);
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                if (attempt < maxRetries) {
                    await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100));
                }
            }
        }
        throw lastError;
    };
    return createPromisePool(executeWithRetry, concurrency);
}
function poolWithTimeout(executor, concurrency, timeoutMs) {
    const executeWithTimeout = async (task) => {
        return Promise.race([
            executor(task),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Task timeout')), timeoutMs)),
        ]);
    };
    return createPromisePool(executeWithTimeout, concurrency);
}
async function parallelMap(items, mapper, concurrency) {
    return parallelBatch(items, mapper, concurrency);
}
async function parallelFilter(items, predicate, concurrency) {
    const results = await parallelBatch(items, predicate, concurrency);
    return items.filter((_, index) => results[index]);
}
async function parallelReduce(items, reducer, initialValue, concurrency) {
    let accumulator = initialValue;
    const chunkSize = Math.ceil(items.length / concurrency);
    const chunks = [];
    for (let i = 0; i < items.length; i += chunkSize) {
        chunks.push(items.slice(i, i + chunkSize));
    }
    const chunkResults = await Promise.all(chunks.map(async (chunk, chunkIndex) => {
        let chunkAcc = chunkIndex === 0 ? initialValue : accumulator;
        for (let i = 0; i < chunk.length; i++) {
            const globalIndex = chunkIndex * chunkSize + i;
            chunkAcc = await reducer(chunkAcc, chunk[i], globalIndex);
        }
        return chunkAcc;
    }));
    accumulator = chunkResults[chunkResults.length - 1];
    return accumulator;
}
async function parallelFlatMap(items, mapper, concurrency) {
    const results = await parallelBatch(items, mapper, concurrency);
    return results.flat();
}
async function parallelGroupBy(items, keySelector, concurrency) {
    const keys = await parallelBatch(items, keySelector, concurrency);
    const groups = new Map();
    items.forEach((item, index) => {
        const key = keys[index];
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(item);
    });
    return groups;
}
async function parallelPartition(items, predicate, concurrency) {
    const results = await parallelBatch(items, predicate, concurrency);
    const passed = [];
    const failed = [];
    items.forEach((item, index) => {
        if (results[index]) {
            passed.push(item);
        }
        else {
            failed.push(item);
        }
    });
    return [passed, failed];
}
function createWorkerPool(workerFactory, poolSize) {
    const workers = Array.from({ length: poolSize }, () => workerFactory());
    let currentWorkerIndex = 0;
    return {
        execute: async (task) => {
            const worker = workers[currentWorkerIndex];
            currentWorkerIndex = (currentWorkerIndex + 1) % workers.length;
            return worker.execute(task);
        },
        broadcast: async (task) => {
            return Promise.all(workers.map((worker) => worker.execute(task)));
        },
        shutdown: async () => {
            await Promise.all(workers.map((worker) => worker.terminate()));
        },
        size: poolSize,
    };
}
async function workerPoolExecute(pool, task) {
    return pool.execute(task);
}
async function workerPoolBroadcast(pool, task) {
    return pool.broadcast(task);
}
async function workerPoolShutdown(pool) {
    return pool.shutdown();
}
function createTaskQueue(concurrency = 1) {
    const queue = [];
    let status = 'idle';
    let activeCount = 0;
    let executor = null;
    const processNext = async () => {
        if (status === 'paused' ||
            queue.length === 0 ||
            activeCount >= concurrency ||
            !executor) {
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
        }
        catch (error) {
            item.reject(error instanceof Error ? error : new Error(String(error)));
        }
        finally {
            activeCount--;
            processNext();
        }
    };
    return {
        push: (task) => {
            return new Promise((resolve, reject) => {
                queue.push({ task, resolve, reject });
                processNext();
            });
        },
        process: (exec) => {
            executor = exec;
            processNext();
        },
        pause: () => {
            status = 'paused';
        },
        resume: () => {
            if (status === 'paused') {
                status = queue.length > 0 ? 'processing' : 'idle';
                processNext();
            }
        },
        clear: () => {
            queue.length = 0;
            status = 'idle';
        },
        status: () => status,
        size: () => queue.length,
    };
}
async function taskQueuePush(queue, task) {
    return queue.push(task);
}
function taskQueueProcess(queue, executor) {
    queue.process(executor);
}
function taskQueuePause(queue) {
    queue.pause();
}
function createPriorityQueue() {
    const heap = [];
    const parent = (i) => Math.floor((i - 1) / 2);
    const leftChild = (i) => 2 * i + 1;
    const rightChild = (i) => 2 * i + 2;
    const swap = (i, j) => {
        [heap[i], heap[j]] = [heap[j], heap[i]];
    };
    const bubbleUp = (index) => {
        while (index > 0 && heap[parent(index)].priority > heap[index].priority) {
            swap(index, parent(index));
            index = parent(index);
        }
    };
    const bubbleDown = (index) => {
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
        enqueue: (item, priority) => {
            heap.push({ item, priority });
            bubbleUp(heap.length - 1);
        },
        dequeue: () => {
            if (heap.length === 0)
                return undefined;
            if (heap.length === 1)
                return heap.pop().item;
            const root = heap[0];
            heap[0] = heap.pop();
            bubbleDown(0);
            return root.item;
        },
        peek: () => {
            return heap.length > 0 ? heap[0].item : undefined;
        },
        size: () => heap.length,
        isEmpty: () => heap.length === 0,
    };
}
function priorityQueueEnqueue(queue, item, priority) {
    queue.enqueue(item, priority);
}
function priorityQueueDequeue(queue) {
    return queue.dequeue();
}
async function* parallelStreamMap(iterable, mapper, concurrency) {
    const pool = createPromisePool(mapper, concurrency);
    const promises = [];
    for await (const item of iterable) {
        const promise = pool.execute(item);
        promises.push(promise);
        if (promises.length >= concurrency) {
            const result = await Promise.race(promises.map((p, i) => p.then((r) => ({ index: i, result: r }))));
            promises.splice(result.index, 1);
            yield result.result;
        }
    }
    while (promises.length > 0) {
        const result = await Promise.race(promises.map((p, i) => p.then((r) => ({ index: i, result: r }))));
        promises.splice(result.index, 1);
        yield result.result;
    }
}
async function* parallelStreamFilter(iterable, predicate, concurrency) {
    const pool = createPromisePool(async (item) => {
        const passes = await predicate(item);
        return { item, passes };
    }, concurrency);
    const promises = [];
    for await (const item of iterable) {
        const promise = pool.execute(item);
        promises.push(promise);
        if (promises.length >= concurrency) {
            const result = await Promise.race(promises.map((p, i) => p.then((r) => ({ index: i, result: r }))));
            promises.splice(result.index, 1);
            if (result.result.passes) {
                yield result.result.item;
            }
        }
    }
    while (promises.length > 0) {
        const result = await Promise.race(promises.map((p, i) => p.then((r) => ({ index: i, result: r }))));
        promises.splice(result.index, 1);
        if (result.result.passes) {
            yield result.result.item;
        }
    }
}
async function parallelStreamReduce(iterable, reducer, initialValue, concurrency) {
    const items = [];
    for await (const item of iterable) {
        items.push(item);
    }
    return parallelReduce(items, reducer, initialValue, concurrency);
}
async function chunkAndExecute(items, executor, chunkSize, concurrency) {
    return parallelBatchChunked(items, executor, chunkSize, concurrency);
}
async function adaptiveChunkExecution(items, executor, initialChunkSize, concurrency) {
    const results = [];
    let currentChunkSize = initialChunkSize;
    let offset = 0;
    const executionTimes = [];
    while (offset < items.length) {
        const chunk = items.slice(offset, offset + currentChunkSize);
        const startTime = Date.now();
        const chunkResults = await parallelBatch(chunk, (item, localIndex) => executor(item, offset + localIndex), concurrency);
        results.push(...chunkResults);
        executionTimes.push(Date.now() - startTime);
        if (executionTimes.length >= 3) {
            const recentTimes = executionTimes.slice(-3);
            const avgTime = recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length;
            if (avgTime < 1000 && currentChunkSize < items.length) {
                currentChunkSize = Math.min(currentChunkSize * 2, items.length);
            }
            else if (avgTime > 5000 && currentChunkSize > 10) {
                currentChunkSize = Math.max(Math.floor(currentChunkSize / 2), 10);
            }
        }
        offset += chunk.length;
    }
    return results;
}
function aggregateErrors(errors) {
    const errorMessages = errors
        .map((e) => `[${e.index}]: ${e.error.message}`)
        .join('; ');
    const aggregated = new Error(`Multiple errors occurred (${errors.length}): ${errorMessages}`);
    aggregated.errors = errors;
    aggregated.count = errors.length;
    return aggregated;
}
function errorCollector() {
    const errors = [];
    return {
        collect: (index, error, input) => {
            errors.push({ index, error, input });
        },
        getErrors: () => errors,
        hasErrors: () => errors.length > 0,
        count: () => errors.length,
        aggregateErrors: () => aggregateErrors(errors),
    };
}
function createCircuitBreaker(config) {
    let state = 'closed';
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
        execute: async (task) => {
            if (state === 'open') {
                if (Date.now() < nextAttempt) {
                    throw new Error('Circuit breaker is open');
                }
                state = 'half-open';
            }
            try {
                const result = await Promise.race([
                    task(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Circuit breaker timeout')), config.timeout)),
                ]);
                onSuccess();
                return result;
            }
            catch (error) {
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
async function circuitBreakerExecute(breaker, task) {
    return breaker.execute(task);
}
async function parallelRetry(items, executor, maxRetries, concurrency) {
    const success = [];
    const errors = [];
    let currentIndex = 0;
    const executeWithRetry = async (item, index) => {
        let lastError = null;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const result = await executor(item, index);
                success.push(result);
                return;
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                if (attempt < maxRetries) {
                    await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100));
                }
            }
        }
        errors.push({ index, error: lastError, input: item });
    };
    const executeNext = async () => {
        while (currentIndex < items.length) {
            const index = currentIndex++;
            await executeWithRetry(items[index], index);
        }
    };
    const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => executeNext());
    await Promise.allSettled(workers);
    return {
        success,
        errors,
        totalProcessed: items.length,
        successRate: success.length / items.length,
    };
}
async function parallelRetryWithJitter(items, executor, maxRetries, concurrency, jitterMs) {
    const success = [];
    const errors = [];
    let currentIndex = 0;
    const executeWithRetry = async (item, index) => {
        let lastError = null;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const result = await executor(item, index);
                success.push(result);
                return;
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                if (attempt < maxRetries) {
                    const baseDelay = Math.pow(2, attempt) * 100;
                    const jitter = Math.random() * jitterMs;
                    await new Promise((resolve) => setTimeout(resolve, baseDelay + jitter));
                }
            }
        }
        errors.push({ index, error: lastError, input: item });
    };
    const executeNext = async () => {
        while (currentIndex < items.length) {
            const index = currentIndex++;
            await executeWithRetry(items[index], index);
        }
    };
    const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => executeNext());
    await Promise.allSettled(workers);
    return {
        success,
        errors,
        totalProcessed: items.length,
        successRate: success.length / items.length,
    };
}
//# sourceMappingURL=parallel-execution.service.js.map