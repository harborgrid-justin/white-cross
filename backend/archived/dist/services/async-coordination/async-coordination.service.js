"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseWithTimeout = promiseWithTimeout;
exports.promiseWithRetry = promiseWithRetry;
exports.promiseWithFallback = promiseWithFallback;
exports.promiseDefer = promiseDefer;
exports.promiseMemoize = promiseMemoize;
exports.promiseReflect = promiseReflect;
exports.asyncTryCatch = asyncTryCatch;
exports.asyncMap = asyncMap;
exports.asyncForEach = asyncForEach;
exports.asyncFilter = asyncFilter;
exports.asyncReduce = asyncReduce;
exports.raceWithTimeout = raceWithTimeout;
exports.allWithTimeout = allWithTimeout;
exports.allSettledWithTimeout = allSettledWithTimeout;
exports.anyWithTimeout = anyWithTimeout;
exports.raceWithDefault = raceWithDefault;
exports.asyncDebounce = asyncDebounce;
exports.asyncThrottle = asyncThrottle;
exports.asyncDebounceLeading = asyncDebounceLeading;
exports.asyncThrottleTrailing = asyncThrottleTrailing;
exports.createAsyncQueue = createAsyncQueue;
exports.asyncQueuePush = asyncQueuePush;
exports.asyncQueueProcess = asyncQueueProcess;
exports.asyncQueueDrain = asyncQueueDrain;
exports.asyncIteratorMap = asyncIteratorMap;
exports.asyncIteratorFilter = asyncIteratorFilter;
exports.asyncIteratorTake = asyncIteratorTake;
exports.asyncIteratorToArray = asyncIteratorToArray;
exports.createAsyncEventEmitter = createAsyncEventEmitter;
exports.asyncEmit = asyncEmit;
exports.asyncOn = asyncOn;
exports.createPubSub = createPubSub;
exports.pubSubPublish = pubSubPublish;
exports.createMiddlewareChain = createMiddlewareChain;
exports.executeMiddleware = executeMiddleware;
exports.asyncWaterfall = asyncWaterfall;
exports.asyncWaterfallWithContext = asyncWaterfallWithContext;
exports.sequentialExecutor = sequentialExecutor;
exports.parallelCoordinator = parallelCoordinator;
exports.createAsyncResourcePool = createAsyncResourcePool;
async function promiseWithTimeout(promise, timeoutMs, errorMessage = 'Promise timeout exceeded') {
    if (timeoutMs <= 0) {
        throw new Error('Timeout must be greater than 0');
    }
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(errorMessage)), timeoutMs)),
    ]);
}
async function promiseWithRetry(fn, maxRetries, delayMs = 1000, backoffMultiplier = 2) {
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt < maxRetries) {
                const delay = delayMs * Math.pow(backoffMultiplier, attempt);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }
    throw new Error(`Failed after ${maxRetries + 1} attempts: ${lastError?.message}`);
}
async function promiseWithFallback(promise, fallbackValue) {
    try {
        return await promise;
    }
    catch (error) {
        return fallbackValue;
    }
}
function promiseDefer() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}
function promiseMemoize(fn, keyGenerator = (...args) => JSON.stringify(args), ttlMs) {
    const cache = new Map();
    return async (...args) => {
        const key = keyGenerator(...args);
        const cached = cache.get(key);
        if (cached) {
            if (ttlMs && Date.now() - cached.timestamp > ttlMs) {
                cache.delete(key);
            }
            else if (cached.promise) {
                return cached.promise;
            }
            else {
                return cached.value;
            }
        }
        const promise = fn(...args);
        cache.set(key, { value: undefined, timestamp: Date.now(), promise });
        try {
            const value = await promise;
            cache.set(key, { value, timestamp: Date.now() });
            return value;
        }
        catch (error) {
            cache.delete(key);
            throw error;
        }
    };
}
async function promiseReflect(promise) {
    try {
        const value = await promise;
        return { status: 'fulfilled', value };
    }
    catch (error) {
        return {
            status: 'rejected',
            reason: error instanceof Error ? error : new Error(String(error)),
        };
    }
}
async function asyncTryCatch(fn) {
    try {
        const result = await fn();
        return [null, result];
    }
    catch (error) {
        return [error instanceof Error ? error : new Error(String(error)), null];
    }
}
async function asyncMap(items, mapper) {
    const results = [];
    for (let i = 0; i < items.length; i++) {
        results.push(await mapper(items[i], i));
    }
    return results;
}
async function asyncForEach(items, callback) {
    for (let i = 0; i < items.length; i++) {
        await callback(items[i], i);
    }
}
async function asyncFilter(items, predicate) {
    const results = [];
    for (let i = 0; i < items.length; i++) {
        if (await predicate(items[i], i)) {
            results.push(items[i]);
        }
    }
    return results;
}
async function asyncReduce(items, reducer, initialValue) {
    let accumulator = initialValue;
    for (let i = 0; i < items.length; i++) {
        accumulator = await reducer(accumulator, items[i], i);
    }
    return accumulator;
}
async function raceWithTimeout(promises, timeoutMs) {
    if (promises.length === 0) {
        throw new Error('Cannot race empty array of promises');
    }
    return Promise.race([
        Promise.race(promises),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Race timeout exceeded')), timeoutMs)),
    ]);
}
async function allWithTimeout(promises, timeoutMs) {
    return Promise.race([
        Promise.all(promises),
        new Promise((_, reject) => setTimeout(() => reject(new Error('All timeout exceeded')), timeoutMs)),
    ]);
}
async function allSettledWithTimeout(promises, timeoutMs) {
    return Promise.race([
        Promise.allSettled(promises),
        new Promise((_, reject) => setTimeout(() => reject(new Error('AllSettled timeout exceeded')), timeoutMs)),
    ]);
}
async function anyWithTimeout(promises, timeoutMs) {
    if (promises.length === 0) {
        throw new Error('Cannot use any with empty array of promises');
    }
    return Promise.race([
        Promise.any(promises),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Any timeout exceeded')), timeoutMs)),
    ]);
}
async function raceWithDefault(promises, defaultValue) {
    if (promises.length === 0) {
        return defaultValue;
    }
    try {
        return await Promise.race(promises);
    }
    catch (error) {
        try {
            return await Promise.any(promises);
        }
        catch {
            return defaultValue;
        }
    }
}
function asyncDebounce(fn, delayMs) {
    let timeoutId = null;
    let deferred = null;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (!deferred) {
            deferred = promiseDefer();
        }
        const currentDeferred = deferred;
        timeoutId = setTimeout(async () => {
            try {
                const result = await fn(...args);
                currentDeferred.resolve(result);
            }
            catch (error) {
                currentDeferred.reject(error);
            }
            finally {
                deferred = null;
                timeoutId = null;
            }
        }, delayMs);
        return currentDeferred.promise;
    };
}
function asyncThrottle(fn, intervalMs) {
    let lastExecutionTime = 0;
    let pendingPromise = null;
    return async (...args) => {
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
function asyncDebounceLeading(fn, delayMs) {
    let timeoutId = null;
    let lastExecutionTime = 0;
    return async (...args) => {
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
function asyncThrottleTrailing(fn, intervalMs) {
    let lastExecutionTime = 0;
    let timeoutId = null;
    let lastArgs = null;
    return async (...args) => {
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
function createAsyncQueue(processor, concurrency = 1) {
    const queue = [];
    let activeCount = 0;
    const processNext = async () => {
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
        }
        catch (error) {
            queueItem.deferred.reject(error);
        }
        finally {
            activeCount--;
            processNext();
        }
    };
    return {
        push: (item) => {
            const deferred = promiseDefer();
            queue.push({ item, deferred });
            processNext();
            return deferred.promise;
        },
        drain: async () => {
            while (queue.length > 0 || activeCount > 0) {
                await new Promise((resolve) => setTimeout(resolve, 10));
            }
        },
        size: () => queue.length,
        clear: () => {
            queue.length = 0;
        },
    };
}
async function asyncQueuePush(queue, item) {
    return queue.push(item);
}
async function asyncQueueProcess(queue, items) {
    return Promise.all(items.map((item) => queue.push(item)));
}
async function asyncQueueDrain(queue) {
    return queue.drain();
}
async function* asyncIteratorMap(iterable, mapper) {
    let index = 0;
    for await (const item of iterable) {
        yield await mapper(item, index++);
    }
}
async function* asyncIteratorFilter(iterable, predicate) {
    let index = 0;
    for await (const item of iterable) {
        if (await predicate(item, index++)) {
            yield item;
        }
    }
}
async function* asyncIteratorTake(iterable, count) {
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
async function asyncIteratorToArray(iterable) {
    const items = [];
    for await (const item of iterable) {
        items.push(item);
    }
    return items;
}
function createAsyncEventEmitter() {
    const listeners = new Map();
    return {
        on: (event, listener) => {
            if (!listeners.has(event)) {
                listeners.set(event, []);
            }
            listeners.get(event).push(listener);
        },
        emit: async (event, ...args) => {
            const eventListeners = listeners.get(event);
            if (!eventListeners || eventListeners.length === 0) {
                return;
            }
            await Promise.all(eventListeners.map((listener) => listener(...args)));
        },
        off: (event, listener) => {
            const eventListeners = listeners.get(event);
            if (eventListeners) {
                const index = eventListeners.indexOf(listener);
                if (index > -1) {
                    eventListeners.splice(index, 1);
                }
            }
        },
        once: (event, listener) => {
            const onceWrapper = async (...args) => {
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
            listeners.get(event).push(onceWrapper);
        },
        removeAllListeners: (event) => {
            if (event) {
                listeners.delete(event);
            }
            else {
                listeners.clear();
            }
        },
    };
}
async function asyncEmit(emitter, event, ...args) {
    return emitter.emit(event, ...args);
}
function asyncOn(emitter, event, listener) {
    emitter.on(event, listener);
}
function createPubSub() {
    const subscribers = new Map();
    return {
        publish: async (topic, data) => {
            const handlers = subscribers.get(topic);
            if (!handlers || handlers.length === 0) {
                return;
            }
            await Promise.all(handlers.map((handler) => handler(data)));
        },
        subscribe: (topic, handler) => {
            if (!subscribers.has(topic)) {
                subscribers.set(topic, []);
            }
            subscribers.get(topic).push(handler);
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
        unsubscribe: (topic, handler) => {
            const handlers = subscribers.get(topic);
            if (handlers) {
                const index = handlers.indexOf(handler);
                if (index > -1) {
                    handlers.splice(index, 1);
                }
            }
        },
        clear: () => {
            subscribers.clear();
        },
    };
}
async function pubSubPublish(pubsub, topic, data) {
    return pubsub.publish(topic, data);
}
function createMiddlewareChain(middlewares) {
    return async (context) => {
        let index = 0;
        const next = async () => {
            if (index >= middlewares.length) {
                return;
            }
            const middleware = middlewares[index++];
            await middleware(context, next);
        };
        await next();
    };
}
async function executeMiddleware(middlewares, context) {
    const chain = createMiddlewareChain(middlewares);
    return chain(context);
}
async function asyncWaterfall(tasks, initialValue) {
    let result = initialValue;
    for (const task of tasks) {
        result = await task(result);
    }
    return result;
}
async function asyncWaterfallWithContext(tasks, context) {
    let currentContext = context;
    for (const task of tasks) {
        currentContext = await task(currentContext);
    }
    return currentContext;
}
async function sequentialExecutor(tasks) {
    const results = [];
    for (const task of tasks) {
        results.push(await task());
    }
    return results;
}
async function parallelCoordinator(tasks) {
    const results = new Map();
    const pending = new Set(tasks.keys());
    const processing = new Set();
    const canExecute = (taskId) => {
        const task = tasks.get(taskId);
        if (!task)
            return false;
        return task.deps.every((dep) => results.has(dep));
    };
    const executeTask = async (taskId) => {
        const task = tasks.get(taskId);
        if (!task)
            return;
        processing.add(taskId);
        try {
            const result = await task.fn(results);
            results.set(taskId, result);
        }
        finally {
            processing.delete(taskId);
            pending.delete(taskId);
        }
    };
    while (pending.size > 0 || processing.size > 0) {
        const readyTasks = Array.from(pending).filter((taskId) => !processing.has(taskId) && canExecute(taskId));
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
function createAsyncResourcePool(factory, maxSize, options = {}) {
    const available = [];
    const inUse = new Set();
    let creating = 0;
    const { idleTimeoutMs = 60000, validateOnAcquire = false, validator, destroyer, } = options;
    const createResource = async () => {
        creating++;
        try {
            return await factory();
        }
        finally {
            creating--;
        }
    };
    const isValid = async (resource) => {
        if (!validator)
            return true;
        try {
            return await validator(resource);
        }
        catch {
            return false;
        }
    };
    const destroyResource = async (resource) => {
        if (destroyer) {
            try {
                await destroyer(resource);
            }
            catch (error) {
            }
        }
    };
    const cleanupIdleResources = () => {
        const now = Date.now();
        const toRemove = [];
        for (let i = available.length - 1; i >= 0; i--) {
            const item = available[i];
            if (now - item.lastUsed > idleTimeoutMs) {
                toRemove.push(i);
                destroyResource(item.resource);
            }
        }
        toRemove.forEach((index) => available.splice(index, 1));
    };
    const cleanupInterval = setInterval(cleanupIdleResources, idleTimeoutMs / 2);
    return {
        acquire: async () => {
            cleanupIdleResources();
            while (available.length > 0) {
                const item = available.pop();
                if (!item)
                    break;
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
            if (inUse.size + creating < maxSize) {
                const resource = await createResource();
                inUse.add(resource);
                return resource;
            }
            await new Promise((resolve) => setTimeout(resolve, 50));
            return this.acquire();
        },
        release: (resource) => {
            if (!inUse.has(resource)) {
                return;
            }
            inUse.delete(resource);
            available.push({ resource, lastUsed: Date.now() });
        },
        drain: async () => {
            clearInterval(cleanupInterval);
            while (inUse.size > 0 || creating > 0) {
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
            await Promise.all(available.map((item) => destroyResource(item.resource)));
            available.length = 0;
        },
        size: () => inUse.size + available.length + creating,
        available: () => available.length,
    };
}
//# sourceMappingURL=async-coordination.service.js.map