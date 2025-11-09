"use strict";
/**
 * LOC: MEM1234567
 * File: /reuse/memory-handling-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Cache management services
 *   - Large data processing modules
 *   - Stream processing utilities
 *   - Performance monitoring services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCircularBuffer = exports.memoryAwareThrottle = exports.createMemoryBudget = exports.detectMemoryTrend = exports.createMemoryTracker = exports.estimateObjectSize = exports.formatMemorySize = exports.getMemoryUsagePercentage = exports.createReferenceCounter = exports.createEvictionCache = exports.createFIFOEviction = exports.createLFUEviction = exports.createLRUEviction = exports.splitLargeObject = exports.createPaginator = exports.processLargeArray = exports.createResourcePool = exports.createObjectPool = exports.monitorGarbageCollection = exports.clearReference = exports.suggestGarbageCollection = exports.forceGarbageCollection = exports.createStreamTransform = exports.createChunkedReader = exports.createBackpressureStream = exports.secureBufferClear = exports.bufferToHex = exports.splitBuffer = exports.concatBuffers = exports.safeBufferAlloc = exports.createBufferPool = exports.createWeakMetadata = exports.weakMemoize = exports.createWeakSet = exports.createWeakCache = exports.createObjectTracker = exports.monitorMemoryThreshold = exports.createMemoryLeakDetector = exports.compareMemorySnapshots = exports.takeMemorySnapshot = void 0;
// ============================================================================
// MEMORY LEAK DETECTION HELPERS
// ============================================================================
/**
 * Takes a snapshot of current memory usage.
 *
 * @returns {MemorySnapshot} Current memory snapshot
 *
 * @example
 * ```typescript
 * const snapshot = takeMemorySnapshot();
 * console.log(`Heap used: ${snapshot.stats.heapUsed / 1024 / 1024} MB`);
 * ```
 */
const takeMemorySnapshot = () => {
    const memUsage = process.memoryUsage();
    return {
        timestamp: Date.now(),
        stats: {
            heapUsed: memUsage.heapUsed,
            heapTotal: memUsage.heapTotal,
            external: memUsage.external,
            rss: memUsage.rss,
            arrayBuffers: memUsage.arrayBuffers,
        },
    };
};
exports.takeMemorySnapshot = takeMemorySnapshot;
/**
 * Compares two memory snapshots and calculates delta.
 *
 * @param {MemorySnapshot} baseline - Baseline snapshot
 * @param {MemorySnapshot} current - Current snapshot
 * @returns {MemorySnapshot} Snapshot with delta information
 *
 * @example
 * ```typescript
 * const before = takeMemorySnapshot();
 * // ... perform operations
 * const after = takeMemorySnapshot();
 * const delta = compareMemorySnapshots(before, after);
 * console.log(`Heap increased by: ${delta.delta.heapUsed / 1024} KB`);
 * ```
 */
const compareMemorySnapshots = (baseline, current) => {
    return {
        ...current,
        delta: {
            heapUsed: current.stats.heapUsed - baseline.stats.heapUsed,
            heapTotal: current.stats.heapTotal - baseline.stats.heapTotal,
            external: current.stats.external - baseline.stats.external,
            rss: current.stats.rss - baseline.stats.rss,
            arrayBuffers: current.stats.arrayBuffers - baseline.stats.arrayBuffers,
        },
    };
};
exports.compareMemorySnapshots = compareMemorySnapshots;
/**
 * Detects potential memory leaks by monitoring heap growth.
 *
 * @param {MemoryLeakDetectionConfig} config - Detection configuration
 * @returns {object} Leak detector with start/stop methods
 *
 * @example
 * ```typescript
 * const detector = createMemoryLeakDetector({
 *   threshold: 10 * 1024 * 1024, // 10 MB
 *   sampleInterval: 5000, // 5 seconds
 *   consecutiveIncreases: 5
 * });
 *
 * detector.start((leak) => {
 *   console.error('Memory leak detected:', leak);
 * });
 * ```
 */
const createMemoryLeakDetector = (config) => {
    let intervalId = null;
    let snapshots = [];
    let consecutiveIncreases = 0;
    return {
        start: (onLeakDetected) => {
            intervalId = setInterval(() => {
                const snapshot = (0, exports.takeMemorySnapshot)();
                snapshots.push(snapshot);
                if (snapshots.length > 1) {
                    const previous = snapshots[snapshots.length - 2];
                    const increase = snapshot.stats.heapUsed - previous.stats.heapUsed;
                    if (increase > config.threshold) {
                        consecutiveIncreases++;
                        if (consecutiveIncreases >= config.consecutiveIncreases) {
                            onLeakDetected({
                                consecutiveIncreases,
                                totalIncrease: snapshot.stats.heapUsed - snapshots[0].stats.heapUsed,
                                snapshots: snapshots.slice(-config.consecutiveIncreases),
                            });
                            consecutiveIncreases = 0;
                        }
                    }
                    else {
                        consecutiveIncreases = 0;
                    }
                }
                // Keep only recent snapshots
                if (snapshots.length > 100) {
                    snapshots = snapshots.slice(-100);
                }
            }, config.sampleInterval);
        },
        stop: () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            snapshots = [];
            consecutiveIncreases = 0;
        },
        getSnapshots: () => snapshots,
    };
};
exports.createMemoryLeakDetector = createMemoryLeakDetector;
/**
 * Monitors memory usage and triggers callback when threshold is exceeded.
 *
 * @param {number} thresholdMB - Memory threshold in megabytes
 * @param {Function} callback - Callback to execute when threshold exceeded
 * @returns {Function} Stop monitoring function
 *
 * @example
 * ```typescript
 * const stopMonitoring = monitorMemoryThreshold(500, (usage) => {
 *   console.warn(`Memory usage exceeded: ${usage.heapUsed / 1024 / 1024} MB`);
 * });
 * ```
 */
const monitorMemoryThreshold = (thresholdMB, callback) => {
    const thresholdBytes = thresholdMB * 1024 * 1024;
    let isMonitoring = true;
    const checkMemory = () => {
        if (!isMonitoring)
            return;
        const snapshot = (0, exports.takeMemorySnapshot)();
        if (snapshot.stats.heapUsed > thresholdBytes) {
            callback(snapshot.stats);
        }
        setTimeout(checkMemory, 1000);
    };
    checkMemory();
    return () => {
        isMonitoring = false;
    };
};
exports.monitorMemoryThreshold = monitorMemoryThreshold;
/**
 * Tracks object allocation to detect memory leaks.
 *
 * @returns {object} Tracker with register/unregister/getStats methods
 *
 * @example
 * ```typescript
 * const tracker = createObjectTracker();
 * const obj = { data: 'large object' };
 * tracker.register(obj, 'MyObject');
 * // ... later
 * tracker.unregister(obj);
 * const stats = tracker.getStats();
 * ```
 */
const createObjectTracker = () => {
    const objects = new WeakMap();
    const counters = new Map();
    return {
        register: (obj, type) => {
            objects.set(obj, { type, timestamp: Date.now() });
            counters.set(type, (counters.get(type) || 0) + 1);
        },
        unregister: (obj) => {
            const info = objects.get(obj);
            if (info) {
                counters.set(info.type, (counters.get(info.type) || 1) - 1);
                objects.delete(obj);
            }
        },
        getStats: () => {
            const stats = {};
            counters.forEach((count, type) => {
                stats[type] = count;
            });
            return stats;
        },
        clear: () => {
            counters.clear();
        },
    };
};
exports.createObjectTracker = createObjectTracker;
// ============================================================================
// WEAKMAP/WEAKSET UTILITIES
// ============================================================================
/**
 * Creates a WeakMap-based cache with automatic cleanup.
 *
 * @template K, V
 * @returns {object} Cache with get/set/has/delete methods
 *
 * @example
 * ```typescript
 * const cache = createWeakCache<object, string>();
 * const key = { id: 123 };
 * cache.set(key, 'cached value');
 * console.log(cache.get(key)); // 'cached value'
 * // When key is garbage collected, cache entry is automatically removed
 * ```
 */
const createWeakCache = () => {
    const cache = new WeakMap();
    return {
        get: (key) => cache.get(key),
        set: (key, value) => {
            cache.set(key, value);
        },
        has: (key) => cache.has(key),
        delete: (key) => cache.delete(key),
    };
};
exports.createWeakCache = createWeakCache;
/**
 * Creates a WeakSet for tracking unique objects.
 *
 * @template T
 * @returns {object} Set with add/has/delete methods
 *
 * @example
 * ```typescript
 * const processedObjects = createWeakSet<object>();
 * const obj = { data: 'test' };
 * processedObjects.add(obj);
 * if (!processedObjects.has(obj)) {
 *   // Process object
 * }
 * ```
 */
const createWeakSet = () => {
    const set = new WeakSet();
    return {
        add: (value) => {
            set.add(value);
        },
        has: (value) => set.has(value),
        delete: (value) => set.delete(value),
    };
};
exports.createWeakSet = createWeakSet;
/**
 * Creates a WeakMap-based memoization function.
 *
 * @template T, R
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function
 *
 * @example
 * ```typescript
 * const expensiveCalc = weakMemoize((obj: object) => {
 *   // Expensive computation
 *   return computeResult(obj);
 * });
 *
 * const result1 = expensiveCalc(obj); // Computed
 * const result2 = expensiveCalc(obj); // Cached
 * ```
 */
const weakMemoize = (fn) => {
    const cache = new WeakMap();
    return (arg) => {
        if (cache.has(arg)) {
            return cache.get(arg);
        }
        const result = fn(arg);
        cache.set(arg, result);
        return result;
    };
};
exports.weakMemoize = weakMemoize;
/**
 * Creates a metadata storage using WeakMap.
 *
 * @template T
 * @returns {object} Metadata storage with get/set/has methods
 *
 * @example
 * ```typescript
 * const metadata = createWeakMetadata<object>();
 * const obj = { data: 'test' };
 * metadata.set(obj, 'timestamp', Date.now());
 * metadata.set(obj, 'processed', true);
 * console.log(metadata.get(obj, 'timestamp'));
 * ```
 */
const createWeakMetadata = () => {
    const storage = new WeakMap();
    return {
        get: (target, key) => {
            return storage.get(target)?.get(key);
        },
        set: (target, key, value) => {
            if (!storage.has(target)) {
                storage.set(target, new Map());
            }
            storage.get(target).set(key, value);
        },
        has: (target, key) => {
            if (!key)
                return storage.has(target);
            return storage.get(target)?.has(key) || false;
        },
        delete: (target, key) => {
            if (!key)
                return storage.delete(target);
            return storage.get(target)?.delete(key) || false;
        },
    };
};
exports.createWeakMetadata = createWeakMetadata;
// ============================================================================
// BUFFER MANAGEMENT
// ============================================================================
/**
 * Creates a buffer pool for reusing buffers.
 *
 * @param {number} bufferSize - Size of each buffer
 * @param {number} poolSize - Maximum number of buffers in pool
 * @returns {object} Buffer pool with acquire/release methods
 *
 * @example
 * ```typescript
 * const pool = createBufferPool(1024, 10);
 * const buffer = pool.acquire();
 * // ... use buffer
 * pool.release(buffer);
 * ```
 */
const createBufferPool = (bufferSize, poolSize) => {
    const available = [];
    const stats = {
        allocated: 0,
        available: 0,
        totalCreated: 0,
        totalDestroyed: 0,
    };
    return {
        acquire: () => {
            if (available.length > 0) {
                const buffer = available.pop();
                stats.available = available.length;
                stats.allocated++;
                return buffer;
            }
            const buffer = Buffer.allocUnsafe(bufferSize);
            stats.totalCreated++;
            stats.allocated++;
            return buffer;
        },
        release: (buffer) => {
            if (buffer.length !== bufferSize) {
                throw new Error('Buffer size mismatch');
            }
            if (available.length < poolSize) {
                buffer.fill(0); // Clear buffer
                available.push(buffer);
                stats.available = available.length;
            }
            else {
                stats.totalDestroyed++;
            }
            stats.allocated--;
        },
        getStats: () => ({ ...stats }),
        clear: () => {
            stats.totalDestroyed += available.length;
            available.length = 0;
            stats.available = 0;
        },
    };
};
exports.createBufferPool = createBufferPool;
/**
 * Allocates a buffer safely with size validation.
 *
 * @param {number} size - Buffer size in bytes
 * @param {number} [maxSize] - Maximum allowed size
 * @returns {Buffer} Allocated buffer
 *
 * @example
 * ```typescript
 * const buffer = safeBufferAlloc(1024, 10 * 1024 * 1024); // Max 10MB
 * ```
 */
const safeBufferAlloc = (size, maxSize) => {
    if (size < 0) {
        throw new Error('Buffer size cannot be negative');
    }
    if (maxSize && size > maxSize) {
        throw new Error(`Buffer size ${size} exceeds maximum ${maxSize}`);
    }
    return Buffer.alloc(size);
};
exports.safeBufferAlloc = safeBufferAlloc;
/**
 * Concatenates buffers efficiently.
 *
 * @param {Buffer[]} buffers - Array of buffers to concatenate
 * @param {number} [totalLength] - Total length (if known, improves performance)
 * @returns {Buffer} Concatenated buffer
 *
 * @example
 * ```typescript
 * const buf1 = Buffer.from('Hello ');
 * const buf2 = Buffer.from('World');
 * const result = concatBuffers([buf1, buf2]);
 * ```
 */
const concatBuffers = (buffers, totalLength) => {
    if (buffers.length === 0) {
        return Buffer.alloc(0);
    }
    if (buffers.length === 1) {
        return buffers[0];
    }
    const length = totalLength || buffers.reduce((sum, buf) => sum + buf.length, 0);
    const result = Buffer.allocUnsafe(length);
    let offset = 0;
    for (const buffer of buffers) {
        buffer.copy(result, offset);
        offset += buffer.length;
    }
    return result;
};
exports.concatBuffers = concatBuffers;
/**
 * Splits buffer into chunks of specified size.
 *
 * @param {Buffer} buffer - Buffer to split
 * @param {number} chunkSize - Size of each chunk
 * @returns {Buffer[]} Array of buffer chunks
 *
 * @example
 * ```typescript
 * const buffer = Buffer.alloc(1000);
 * const chunks = splitBuffer(buffer, 256);
 * // chunks.length === 4 (256, 256, 256, 232)
 * ```
 */
const splitBuffer = (buffer, chunkSize) => {
    const chunks = [];
    let offset = 0;
    while (offset < buffer.length) {
        const end = Math.min(offset + chunkSize, buffer.length);
        chunks.push(buffer.subarray(offset, end));
        offset = end;
    }
    return chunks;
};
exports.splitBuffer = splitBuffer;
/**
 * Converts buffer to hex string efficiently.
 *
 * @param {Buffer} buffer - Buffer to convert
 * @param {string} [separator] - Optional separator between bytes
 * @returns {string} Hex string representation
 *
 * @example
 * ```typescript
 * const buffer = Buffer.from([0x12, 0x34, 0xAB, 0xCD]);
 * bufferToHex(buffer); // '1234abcd'
 * bufferToHex(buffer, ':'); // '12:34:ab:cd'
 * ```
 */
const bufferToHex = (buffer, separator) => {
    const hex = buffer.toString('hex');
    if (!separator)
        return hex;
    return hex.match(/.{2}/g)?.join(separator) || hex;
};
exports.bufferToHex = bufferToHex;
/**
 * Clears buffer securely by overwriting with random data.
 *
 * @param {Buffer} buffer - Buffer to clear
 * @param {number} [passes] - Number of overwrite passes (default: 1)
 *
 * @example
 * ```typescript
 * const sensitiveData = Buffer.from('secret password');
 * secureBufferClear(sensitiveData, 3); // Overwrite 3 times
 * ```
 */
const secureBufferClear = (buffer, passes = 1) => {
    for (let i = 0; i < passes; i++) {
        if (i === passes - 1) {
            buffer.fill(0); // Final pass with zeros
        }
        else {
            for (let j = 0; j < buffer.length; j++) {
                buffer[j] = Math.floor(Math.random() * 256);
            }
        }
    }
};
exports.secureBufferClear = secureBufferClear;
// ============================================================================
// STREAM PROCESSING
// ============================================================================
/**
 * Creates a backpressure-aware stream processor.
 *
 * @param {Function} processor - Processing function
 * @param {number} [highWaterMark] - High water mark for backpressure
 * @returns {object} Stream processor with push/drain methods
 *
 * @example
 * ```typescript
 * const processor = createBackpressureStream(
 *   async (chunk) => processData(chunk),
 *   16
 * );
 *
 * for (const chunk of data) {
 *   if (!processor.push(chunk)) {
 *     await processor.drain();
 *   }
 * }
 * ```
 */
const createBackpressureStream = (processor, highWaterMark = 16) => {
    const queue = [];
    let processing = false;
    let drainResolve = null;
    const processQueue = async () => {
        if (processing || queue.length === 0)
            return;
        processing = true;
        while (queue.length > 0) {
            const chunk = queue.shift();
            await processor(chunk);
            if (queue.length < highWaterMark && drainResolve) {
                const resolve = drainResolve;
                drainResolve = null;
                resolve();
            }
        }
        processing = false;
    };
    return {
        push: (chunk) => {
            queue.push(chunk);
            processQueue();
            return queue.length < highWaterMark;
        },
        drain: () => {
            if (queue.length < highWaterMark) {
                return Promise.resolve();
            }
            return new Promise((resolve) => {
                drainResolve = resolve;
            });
        },
        getQueueLength: () => queue.length,
    };
};
exports.createBackpressureStream = createBackpressureStream;
/**
 * Creates a chunked stream reader for large files.
 *
 * @param {number} chunkSize - Size of each chunk
 * @returns {object} Stream reader configuration
 *
 * @example
 * ```typescript
 * const reader = createChunkedReader(64 * 1024); // 64KB chunks
 * // Use with Node.js streams or file reading
 * ```
 */
const createChunkedReader = (chunkSize) => {
    let bytesRead = 0;
    return {
        chunkSize,
        onChunk: (chunk, callback) => {
            bytesRead += chunk.length;
            callback(chunk);
        },
        getBytesRead: () => bytesRead,
        reset: () => {
            bytesRead = 0;
        },
    };
};
exports.createChunkedReader = createChunkedReader;
/**
 * Creates a memory-efficient stream transformer.
 *
 * @template T, R
 * @param {Function} transform - Transform function
 * @param {number} [batchSize] - Batch size for processing
 * @returns {Function} Transform function with batching
 *
 * @example
 * ```typescript
 * const transformer = createStreamTransform(
 *   (items: string[]) => items.map(s => s.toUpperCase()),
 *   100
 * );
 * ```
 */
const createStreamTransform = (transform, batchSize = 100) => {
    let batch = [];
    return {
        process: (item) => {
            batch.push(item);
            if (batch.length >= batchSize) {
                const result = transform(batch);
                batch = [];
                return result;
            }
            return null;
        },
        flush: () => {
            if (batch.length === 0)
                return [];
            const result = transform(batch);
            batch = [];
            return result;
        },
    };
};
exports.createStreamTransform = createStreamTransform;
// ============================================================================
// GARBAGE COLLECTION HELPERS
// ============================================================================
/**
 * Forces garbage collection if available (requires --expose-gc flag).
 *
 * @returns {boolean} True if GC was triggered
 *
 * @example
 * ```typescript
 * // Run Node.js with: node --expose-gc app.js
 * if (forceGarbageCollection()) {
 *   console.log('GC completed');
 * }
 * ```
 */
const forceGarbageCollection = () => {
    if (global.gc) {
        global.gc();
        return true;
    }
    return false;
};
exports.forceGarbageCollection = forceGarbageCollection;
/**
 * Suggests garbage collection during idle time.
 *
 * @param {number} [delay] - Delay in milliseconds before GC suggestion
 * @returns {Promise<boolean>} Promise resolving to true if GC was performed
 *
 * @example
 * ```typescript
 * await suggestGarbageCollection(1000); // Suggest GC after 1 second idle
 * ```
 */
const suggestGarbageCollection = (delay = 0) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve((0, exports.forceGarbageCollection)());
        }, delay);
    });
};
exports.suggestGarbageCollection = suggestGarbageCollection;
/**
 * Clears references to help garbage collection.
 *
 * @template T
 * @param {T} obj - Object to clear
 * @returns {null} Returns null
 *
 * @example
 * ```typescript
 * let largeObject = { data: new Array(1000000) };
 * largeObject = clearReference(largeObject);
 * // largeObject is now null, original object can be GC'd
 * ```
 */
const clearReference = (obj) => {
    obj = null;
    return null;
};
exports.clearReference = clearReference;
/**
 * Monitors garbage collection events (requires --trace-gc flag).
 *
 * @param {Function} callback - Callback for GC events
 * @returns {Function} Stop monitoring function
 *
 * @example
 * ```typescript
 * // Run with: node --trace-gc app.js
 * const stop = monitorGarbageCollection((event) => {
 *   console.log('GC event:', event);
 * });
 * ```
 */
const monitorGarbageCollection = (callback) => {
    let monitoring = true;
    const originalLog = console.log;
    // Note: This is a simplified implementation
    // In production, use Node.js perf_hooks for accurate GC monitoring
    const interval = setInterval(() => {
        if (!monitoring)
            return;
        const snapshot = (0, exports.takeMemorySnapshot)();
        callback({
            type: 'gc-check',
            timestamp: snapshot.timestamp,
            heapUsed: snapshot.stats.heapUsed,
        });
    }, 5000);
    return () => {
        monitoring = false;
        clearInterval(interval);
    };
};
exports.monitorGarbageCollection = monitorGarbageCollection;
// ============================================================================
// MEMORY POOL MANAGEMENT
// ============================================================================
/**
 * Creates a generic object pool for reusable objects.
 *
 * @template T
 * @param {PoolConfig} config - Pool configuration
 * @returns {object} Object pool with acquire/release methods
 *
 * @example
 * ```typescript
 * const pool = createObjectPool({
 *   maxSize: 10,
 *   minSize: 2,
 *   factory: () => ({ data: [] }),
 *   destroyer: (obj) => { obj.data = null; },
 *   validator: (obj) => obj.data !== null
 * });
 *
 * const obj = await pool.acquire();
 * // ... use object
 * pool.release(obj);
 * ```
 */
const createObjectPool = (config) => {
    const { maxSize, minSize, factory, destroyer, validator } = config;
    const available = [];
    let activeCount = 0;
    // Initialize minimum pool size
    for (let i = 0; i < minSize; i++) {
        available.push(factory());
    }
    return {
        acquire: async () => {
            if (available.length > 0) {
                const obj = available.pop();
                if (!validator || validator(obj)) {
                    activeCount++;
                    return obj;
                }
            }
            if (activeCount < maxSize) {
                activeCount++;
                return factory();
            }
            // Wait for object to become available
            return new Promise((resolve) => {
                const checkAvailable = setInterval(() => {
                    if (available.length > 0) {
                        clearInterval(checkAvailable);
                        const obj = available.pop();
                        activeCount++;
                        resolve(obj);
                    }
                }, 10);
            });
        },
        release: (obj) => {
            activeCount--;
            if (available.length < maxSize) {
                if (!validator || validator(obj)) {
                    available.push(obj);
                }
                else if (destroyer) {
                    destroyer(obj);
                }
            }
            else if (destroyer) {
                destroyer(obj);
            }
        },
        drain: () => {
            if (destroyer) {
                available.forEach(destroyer);
            }
            available.length = 0;
            activeCount = 0;
        },
        getStats: () => ({
            available: available.length,
            active: activeCount,
            total: available.length + activeCount,
        }),
    };
};
exports.createObjectPool = createObjectPool;
/**
 * Creates a bounded resource pool with size limits.
 *
 * @template T
 * @param {Function} factory - Resource factory function
 * @param {number} maxSize - Maximum pool size
 * @returns {object} Resource pool
 *
 * @example
 * ```typescript
 * const pool = createResourcePool(
 *   () => createDatabaseConnection(),
 *   10
 * );
 * ```
 */
const createResourcePool = (factory, maxSize) => {
    return (0, exports.createObjectPool)({
        maxSize,
        minSize: 0,
        factory,
    });
};
exports.createResourcePool = createResourcePool;
// ============================================================================
// LARGE OBJECT HANDLING
// ============================================================================
/**
 * Processes large array in chunks to avoid memory spikes.
 *
 * @template T, R
 * @param {T[]} array - Large array to process
 * @param {Function} processor - Processing function
 * @param {number} [chunkSize] - Chunk size (default: 1000)
 * @returns {Promise<R[]>} Processed results
 *
 * @example
 * ```typescript
 * const results = await processLargeArray(
 *   largeDataset,
 *   async (chunk) => chunk.map(item => transform(item)),
 *   500
 * );
 * ```
 */
const processLargeArray = async (array, processor, chunkSize = 1000) => {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        const processed = await processor(chunk);
        results.push(...processed);
        // Allow event loop to process other tasks
        await new Promise((resolve) => setImmediate(resolve));
    }
    return results;
};
exports.processLargeArray = processLargeArray;
/**
 * Creates a paginated iterator for large datasets.
 *
 * @template T
 * @param {T[]} data - Large dataset
 * @param {number} pageSize - Items per page
 * @returns {object} Paginated iterator
 *
 * @example
 * ```typescript
 * const paginator = createPaginator(largeDataset, 100);
 * while (paginator.hasNext()) {
 *   const page = paginator.next();
 *   processPage(page);
 * }
 * ```
 */
const createPaginator = (data, pageSize) => {
    let currentIndex = 0;
    return {
        hasNext: () => currentIndex < data.length,
        next: () => {
            const page = data.slice(currentIndex, currentIndex + pageSize);
            currentIndex += pageSize;
            return page;
        },
        reset: () => {
            currentIndex = 0;
        },
        getCurrentPage: () => Math.floor(currentIndex / pageSize),
        getTotalPages: () => Math.ceil(data.length / pageSize),
    };
};
exports.createPaginator = createPaginator;
/**
 * Splits large object into smaller chunks for processing.
 *
 * @param {object} obj - Large object to split
 * @param {number} keysPerChunk - Number of keys per chunk
 * @returns {object[]} Array of object chunks
 *
 * @example
 * ```typescript
 * const largeObj = { key1: 'val1', key2: 'val2', ... }; // 1000 keys
 * const chunks = splitLargeObject(largeObj, 100);
 * // chunks.length === 10
 * ```
 */
const splitLargeObject = (obj, keysPerChunk) => {
    const keys = Object.keys(obj);
    const chunks = [];
    for (let i = 0; i < keys.length; i += keysPerChunk) {
        const chunkKeys = keys.slice(i, i + keysPerChunk);
        const chunk = {};
        for (const key of chunkKeys) {
            chunk[key] = obj[key];
        }
        chunks.push(chunk);
    }
    return chunks;
};
exports.splitLargeObject = splitLargeObject;
// ============================================================================
// CACHE EVICTION STRATEGIES
// ============================================================================
/**
 * Creates LRU (Least Recently Used) eviction strategy.
 *
 * @param {number} maxSize - Maximum cache size
 * @returns {CacheEvictionStrategy} LRU eviction strategy
 *
 * @example
 * ```typescript
 * const strategy = createLRUEviction(100);
 * ```
 */
const createLRUEviction = (maxSize) => {
    const accessOrder = new Map();
    let timestamp = 0;
    return {
        shouldEvict: (size) => size >= maxSize,
        selectVictim: (entries) => {
            let oldestKey = null;
            let oldestTime = Infinity;
            for (const key of entries.keys()) {
                const time = accessOrder.get(key) || 0;
                if (time < oldestTime) {
                    oldestTime = time;
                    oldestKey = key;
                }
            }
            return oldestKey;
        },
    };
};
exports.createLRUEviction = createLRUEviction;
/**
 * Creates LFU (Least Frequently Used) eviction strategy.
 *
 * @param {number} maxSize - Maximum cache size
 * @returns {CacheEvictionStrategy} LFU eviction strategy
 *
 * @example
 * ```typescript
 * const strategy = createLFUEviction(100);
 * ```
 */
const createLFUEviction = (maxSize) => {
    const frequency = new Map();
    return {
        shouldEvict: (size) => size >= maxSize,
        selectVictim: (entries) => {
            let leastKey = null;
            let leastFreq = Infinity;
            for (const key of entries.keys()) {
                const freq = frequency.get(key) || 0;
                if (freq < leastFreq) {
                    leastFreq = freq;
                    leastKey = key;
                }
            }
            return leastKey;
        },
    };
};
exports.createLFUEviction = createLFUEviction;
/**
 * Creates FIFO (First In First Out) eviction strategy.
 *
 * @param {number} maxSize - Maximum cache size
 * @returns {CacheEvictionStrategy} FIFO eviction strategy
 *
 * @example
 * ```typescript
 * const strategy = createFIFOEviction(100);
 * ```
 */
const createFIFOEviction = (maxSize) => {
    return {
        shouldEvict: (size) => size >= maxSize,
        selectVictim: (entries) => {
            // Map maintains insertion order
            return entries.keys().next().value;
        },
    };
};
exports.createFIFOEviction = createFIFOEviction;
/**
 * Creates a cache with configurable eviction strategy.
 *
 * @template K, V
 * @param {number} maxSize - Maximum cache size
 * @param {CacheEvictionStrategy} [strategy] - Eviction strategy
 * @returns {object} Cache with get/set/delete methods
 *
 * @example
 * ```typescript
 * const cache = createEvictionCache(100, createLRUEviction(100));
 * cache.set('key', 'value');
 * const value = cache.get('key');
 * ```
 */
const createEvictionCache = (maxSize, strategy) => {
    const cache = new Map();
    const evictionStrategy = strategy || (0, exports.createLRUEviction)(maxSize);
    return {
        get: (key) => cache.get(key),
        set: (key, value) => {
            if (evictionStrategy.shouldEvict(cache.size, maxSize) && !cache.has(key)) {
                const victim = evictionStrategy.selectVictim(cache);
                if (victim !== null) {
                    cache.delete(victim);
                }
            }
            cache.set(key, value);
        },
        delete: (key) => cache.delete(key),
        clear: () => cache.clear(),
        size: () => cache.size,
    };
};
exports.createEvictionCache = createEvictionCache;
// ============================================================================
// REFERENCE COUNTING HELPERS
// ============================================================================
/**
 * Creates a reference counter for tracking object usage.
 *
 * @template T
 * @returns {object} Reference counter with addRef/release methods
 *
 * @example
 * ```typescript
 * const refCounter = createReferenceCounter<object>();
 * const obj = { data: 'test' };
 * refCounter.addRef(obj);
 * refCounter.addRef(obj);
 * console.log(refCounter.getCount(obj)); // 2
 * refCounter.release(obj);
 * console.log(refCounter.getCount(obj)); // 1
 * ```
 */
const createReferenceCounter = () => {
    const counts = new WeakMap();
    return {
        addRef: (obj) => {
            const currentCount = counts.get(obj) || 0;
            const newCount = currentCount + 1;
            counts.set(obj, newCount);
            return newCount;
        },
        release: (obj) => {
            const currentCount = counts.get(obj) || 0;
            const newCount = Math.max(0, currentCount - 1);
            if (newCount === 0) {
                counts.delete(obj);
            }
            else {
                counts.set(obj, newCount);
            }
            return newCount;
        },
        getCount: (obj) => counts.get(obj) || 0,
        isReferenced: (obj) => (counts.get(obj) || 0) > 0,
    };
};
exports.createReferenceCounter = createReferenceCounter;
// ============================================================================
// MEMORY PROFILING HELPERS
// ============================================================================
/**
 * Calculates memory usage percentage.
 *
 * @returns {number} Memory usage percentage (0-100)
 *
 * @example
 * ```typescript
 * const usage = getMemoryUsagePercentage();
 * if (usage > 80) {
 *   console.warn('High memory usage:', usage);
 * }
 * ```
 */
const getMemoryUsagePercentage = () => {
    const usage = process.memoryUsage();
    return (usage.heapUsed / usage.heapTotal) * 100;
};
exports.getMemoryUsagePercentage = getMemoryUsagePercentage;
/**
 * Formats memory size in human-readable format.
 *
 * @param {number} bytes - Size in bytes
 * @param {number} [decimals] - Number of decimal places
 * @returns {string} Formatted size string
 *
 * @example
 * ```typescript
 * formatMemorySize(1024); // '1.00 KB'
 * formatMemorySize(1048576); // '1.00 MB'
 * formatMemorySize(1073741824, 2); // '1.00 GB'
 * ```
 */
const formatMemorySize = (bytes, decimals = 2) => {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};
exports.formatMemorySize = formatMemorySize;
/**
 * Estimates object size in bytes (approximate).
 *
 * @param {any} obj - Object to measure
 * @returns {number} Estimated size in bytes
 *
 * @example
 * ```typescript
 * const obj = { name: 'John', age: 30, data: [1, 2, 3] };
 * const size = estimateObjectSize(obj);
 * console.log(`Object size: ${formatMemorySize(size)}`);
 * ```
 */
const estimateObjectSize = (obj) => {
    const seen = new WeakSet();
    const sizeOf = (value) => {
        if (value === null || value === undefined)
            return 0;
        const type = typeof value;
        if (type === 'boolean')
            return 4;
        if (type === 'number')
            return 8;
        if (type === 'string')
            return value.length * 2;
        if (type === 'object') {
            if (seen.has(value))
                return 0;
            seen.add(value);
            let size = 0;
            if (Array.isArray(value)) {
                size = value.reduce((acc, item) => acc + sizeOf(item), 0);
            }
            else if (Buffer.isBuffer(value)) {
                size = value.length;
            }
            else {
                size = Object.keys(value).reduce((acc, key) => acc + key.length * 2 + sizeOf(value[key]), 0);
            }
            return size;
        }
        return 0;
    };
    return sizeOf(obj);
};
exports.estimateObjectSize = estimateObjectSize;
/**
 * Creates a memory usage tracker over time.
 *
 * @param {number} [intervalMs] - Sampling interval in milliseconds
 * @returns {object} Tracker with start/stop/getStats methods
 *
 * @example
 * ```typescript
 * const tracker = createMemoryTracker(1000);
 * tracker.start();
 * // ... perform operations
 * const stats = tracker.getStats();
 * tracker.stop();
 * ```
 */
const createMemoryTracker = (intervalMs = 1000) => {
    let intervalId = null;
    const samples = [];
    return {
        start: () => {
            intervalId = setInterval(() => {
                samples.push((0, exports.takeMemorySnapshot)());
            }, intervalMs);
        },
        stop: () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        },
        getStats: () => {
            if (samples.length === 0) {
                return { samples: 0, average: 0, peak: 0, current: 0 };
            }
            const heapUsages = samples.map((s) => s.stats.heapUsed);
            const average = heapUsages.reduce((a, b) => a + b, 0) / heapUsages.length;
            const peak = Math.max(...heapUsages);
            const current = heapUsages[heapUsages.length - 1];
            return {
                samples: samples.length,
                average,
                peak,
                current,
                snapshots: samples,
            };
        },
        reset: () => {
            samples.length = 0;
        },
    };
};
exports.createMemoryTracker = createMemoryTracker;
/**
 * Detects memory growth trend.
 *
 * @param {MemorySnapshot[]} snapshots - Array of memory snapshots
 * @returns {object} Trend information
 *
 * @example
 * ```typescript
 * const trend = detectMemoryTrend(snapshots);
 * if (trend.isIncreasing && trend.rate > 1000000) {
 *   console.warn('Rapid memory growth detected');
 * }
 * ```
 */
const detectMemoryTrend = (snapshots) => {
    if (snapshots.length < 2) {
        return { isIncreasing: false, rate: 0, samples: snapshots.length };
    }
    const first = snapshots[0].stats.heapUsed;
    const last = snapshots[snapshots.length - 1].stats.heapUsed;
    const timeDiff = snapshots[snapshots.length - 1].timestamp - snapshots[0].timestamp;
    const change = last - first;
    const rate = timeDiff > 0 ? (change / timeDiff) * 1000 : 0; // bytes per second
    return {
        isIncreasing: change > 0,
        isDecreasing: change < 0,
        rate,
        totalChange: change,
        samples: snapshots.length,
    };
};
exports.detectMemoryTrend = detectMemoryTrend;
/**
 * Creates a memory budget enforcer.
 *
 * @param {number} maxMemoryMB - Maximum memory in megabytes
 * @returns {object} Budget enforcer with check/enforce methods
 *
 * @example
 * ```typescript
 * const budget = createMemoryBudget(500); // 500MB limit
 * budget.enforce(() => {
 *   // This callback is called when budget is exceeded
 *   console.error('Memory budget exceeded!');
 *   performCleanup();
 * });
 * ```
 */
const createMemoryBudget = (maxMemoryMB) => {
    const maxBytes = maxMemoryMB * 1024 * 1024;
    let enforcing = false;
    let checkInterval = null;
    return {
        check: () => {
            const usage = process.memoryUsage();
            return usage.heapUsed <= maxBytes;
        },
        getCurrentUsageMB: () => {
            const usage = process.memoryUsage();
            return usage.heapUsed / 1024 / 1024;
        },
        getRemainingMB: () => {
            const usage = process.memoryUsage();
            const remaining = maxBytes - usage.heapUsed;
            return Math.max(0, remaining / 1024 / 1024);
        },
        enforce: (onExceeded, intervalMs = 5000) => {
            if (enforcing)
                return;
            enforcing = true;
            checkInterval = setInterval(() => {
                const usage = process.memoryUsage();
                if (usage.heapUsed > maxBytes) {
                    onExceeded();
                }
            }, intervalMs);
        },
        stopEnforcing: () => {
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
            }
            enforcing = false;
        },
    };
};
exports.createMemoryBudget = createMemoryBudget;
/**
 * Creates a memory-aware throttle function.
 *
 * @template T
 * @param {Function} fn - Function to throttle
 * @param {number} memoryThresholdMB - Memory threshold in MB
 * @returns {Function} Throttled function
 *
 * @example
 * ```typescript
 * const throttled = memoryAwareThrottle(
 *   (data) => processLargeData(data),
 *   400 // Pause if memory exceeds 400MB
 * );
 *
 * await throttled(largeDataset);
 * ```
 */
const memoryAwareThrottle = (fn, memoryThresholdMB) => {
    const thresholdBytes = memoryThresholdMB * 1024 * 1024;
    return async (...args) => {
        // Wait if memory usage is too high
        while (true) {
            const usage = process.memoryUsage();
            if (usage.heapUsed < thresholdBytes) {
                break;
            }
            // Wait and check again
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return fn(...args);
    };
};
exports.memoryAwareThrottle = memoryAwareThrottle;
/**
 * Creates a circular buffer with fixed size for efficient memory usage.
 *
 * @template T
 * @param {number} size - Buffer size
 * @returns {object} Circular buffer with push/get methods
 *
 * @example
 * ```typescript
 * const buffer = createCircularBuffer<number>(3);
 * buffer.push(1);
 * buffer.push(2);
 * buffer.push(3);
 * buffer.push(4); // Overwrites oldest (1)
 * console.log(buffer.toArray()); // [2, 3, 4]
 * ```
 */
const createCircularBuffer = (size) => {
    const buffer = new Array(size);
    let index = 0;
    let count = 0;
    return {
        push: (item) => {
            buffer[index] = item;
            index = (index + 1) % size;
            count = Math.min(count + 1, size);
        },
        get: (position) => {
            if (position >= count)
                return undefined;
            const actualIndex = (index - count + position + size) % size;
            return buffer[actualIndex];
        },
        toArray: () => {
            if (count < size) {
                return buffer.slice(0, count);
            }
            return [...buffer.slice(index), ...buffer.slice(0, index)];
        },
        size: () => count,
        capacity: () => size,
        clear: () => {
            count = 0;
            index = 0;
        },
    };
};
exports.createCircularBuffer = createCircularBuffer;
exports.default = {
    // Memory leak detection
    takeMemorySnapshot: exports.takeMemorySnapshot,
    compareMemorySnapshots: exports.compareMemorySnapshots,
    createMemoryLeakDetector: exports.createMemoryLeakDetector,
    monitorMemoryThreshold: exports.monitorMemoryThreshold,
    createObjectTracker: exports.createObjectTracker,
    // WeakMap/WeakSet utilities
    createWeakCache: exports.createWeakCache,
    createWeakSet: exports.createWeakSet,
    weakMemoize: exports.weakMemoize,
    createWeakMetadata: exports.createWeakMetadata,
    // Buffer management
    createBufferPool: exports.createBufferPool,
    safeBufferAlloc: exports.safeBufferAlloc,
    concatBuffers: exports.concatBuffers,
    splitBuffer: exports.splitBuffer,
    bufferToHex: exports.bufferToHex,
    secureBufferClear: exports.secureBufferClear,
    // Stream processing
    createBackpressureStream: exports.createBackpressureStream,
    createChunkedReader: exports.createChunkedReader,
    createStreamTransform: exports.createStreamTransform,
    // Garbage collection
    forceGarbageCollection: exports.forceGarbageCollection,
    suggestGarbageCollection: exports.suggestGarbageCollection,
    clearReference: exports.clearReference,
    monitorGarbageCollection: exports.monitorGarbageCollection,
    // Memory pool management
    createObjectPool: exports.createObjectPool,
    createResourcePool: exports.createResourcePool,
    // Large object handling
    processLargeArray: exports.processLargeArray,
    createPaginator: exports.createPaginator,
    splitLargeObject: exports.splitLargeObject,
    // Cache eviction strategies
    createLRUEviction: exports.createLRUEviction,
    createLFUEviction: exports.createLFUEviction,
    createFIFOEviction: exports.createFIFOEviction,
    createEvictionCache: exports.createEvictionCache,
    // Reference counting
    createReferenceCounter: exports.createReferenceCounter,
    // Memory profiling
    getMemoryUsagePercentage: exports.getMemoryUsagePercentage,
    formatMemorySize: exports.formatMemorySize,
    estimateObjectSize: exports.estimateObjectSize,
    createMemoryTracker: exports.createMemoryTracker,
    detectMemoryTrend: exports.detectMemoryTrend,
    createMemoryBudget: exports.createMemoryBudget,
    memoryAwareThrottle: exports.memoryAwareThrottle,
    createCircularBuffer: exports.createCircularBuffer,
};
//# sourceMappingURL=memory-handling-utils.js.map