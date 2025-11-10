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
/**
 * File: /reuse/memory-handling-utils.ts
 * Locator: WC-UTL-MEM-004
 * Purpose: Memory Management Utilities - Comprehensive memory handling, leak detection, and optimization
 *
 * Upstream: Independent utility module for memory management
 * Downstream: ../backend/*, Performance services, Cache managers, Stream processors
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 40 utility functions for memory leak detection, buffer management, GC helpers, caching
 *
 * LLM Context: Comprehensive memory management utilities for White Cross healthcare system.
 * Provides memory leak detection helpers, WeakMap/WeakSet utilities, buffer management,
 * stream processing, garbage collection helpers, memory pool management, large object handling,
 * memory profiling, cache eviction strategies, and reference counting. Essential for
 * maintaining optimal performance in memory-intensive healthcare data processing.
 */
interface MemoryStats {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
    arrayBuffers: number;
}
interface MemorySnapshot {
    timestamp: number;
    stats: MemoryStats;
    delta?: MemoryStats;
}
interface MemoryLeakDetectionConfig {
    threshold: number;
    sampleInterval: number;
    consecutiveIncreases: number;
}
interface PoolConfig {
    maxSize: number;
    minSize: number;
    factory: () => any;
    destroyer?: (item: any) => void;
    validator?: (item: any) => boolean;
}
interface CacheEvictionStrategy {
    shouldEvict: (size: number, maxSize: number) => boolean;
    selectVictim: (entries: Map<any, any>) => any;
}
interface BufferPoolStats {
    allocated: number;
    available: number;
    totalCreated: number;
    totalDestroyed: number;
}
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
export declare const takeMemorySnapshot: () => MemorySnapshot;
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
export declare const compareMemorySnapshots: (baseline: MemorySnapshot, current: MemorySnapshot) => MemorySnapshot;
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
export declare const createMemoryLeakDetector: (config: MemoryLeakDetectionConfig) => {
    start: (onLeakDetected: (info: any) => void) => void;
    stop: () => void;
    getSnapshots: () => MemorySnapshot[];
};
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
export declare const monitorMemoryThreshold: (thresholdMB: number, callback: (usage: MemoryStats) => void) => (() => void);
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
export declare const createObjectTracker: () => {
    register: (obj: object, type: string) => void;
    unregister: (obj: object) => void;
    getStats: () => Record<string, number>;
    clear: () => void;
};
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
export declare const createWeakCache: <K extends object, V>() => {
    get: (key: K) => V | undefined;
    set: (key: K, value: V) => void;
    has: (key: K) => boolean;
    delete: (key: K) => boolean;
};
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
export declare const createWeakSet: <T extends object>() => {
    add: (value: T) => void;
    has: (value: T) => boolean;
    delete: (value: T) => boolean;
};
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
export declare const weakMemoize: <T extends object, R>(fn: (arg: T) => R) => ((arg: T) => R);
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
export declare const createWeakMetadata: <T extends object>() => {
    get: (target: T, key: string) => any;
    set: (target: T, key: string, value: any) => void;
    has: (target: T, key?: string) => boolean;
    delete: (target: T, key?: string) => boolean;
};
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
export declare const createBufferPool: (bufferSize: number, poolSize: number) => {
    acquire: () => Buffer;
    release: (buffer: Buffer) => void;
    getStats: () => BufferPoolStats;
    clear: () => void;
};
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
export declare const safeBufferAlloc: (size: number, maxSize?: number) => Buffer;
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
export declare const concatBuffers: (buffers: Buffer[], totalLength?: number) => Buffer;
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
export declare const splitBuffer: (buffer: Buffer, chunkSize: number) => Buffer[];
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
export declare const bufferToHex: (buffer: Buffer, separator?: string) => string;
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
export declare const secureBufferClear: (buffer: Buffer, passes?: number) => void;
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
export declare const createBackpressureStream: (processor: (chunk: any) => Promise<void>, highWaterMark?: number) => {
    push: (chunk: any) => boolean;
    drain: () => Promise<void>;
    getQueueLength: () => number;
};
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
export declare const createChunkedReader: (chunkSize: number) => {
    chunkSize: number;
    onChunk: (chunk: Buffer, callback: (chunk: Buffer) => void) => void;
    getBytesRead: () => number;
    reset: () => void;
};
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
export declare const createStreamTransform: <T, R>(transform: (batch: T[]) => R[], batchSize?: number) => {
    process: (item: T) => R[] | null;
    flush: () => R[];
};
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
export declare const forceGarbageCollection: () => boolean;
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
export declare const suggestGarbageCollection: (delay?: number) => Promise<boolean>;
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
export declare const clearReference: <T>(obj: T) => null;
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
export declare const monitorGarbageCollection: (callback: (event: any) => void) => (() => void);
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
export declare const createObjectPool: <T>(config: PoolConfig) => {
    acquire: () => Promise<T>;
    release: (obj: T) => void;
    drain: () => void;
    getStats: () => {
        available: number;
        active: number;
        total: number;
    };
};
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
export declare const createResourcePool: <T>(factory: () => T, maxSize: number) => {
    acquire: () => Promise<unknown>;
    release: (obj: unknown) => void;
    drain: () => void;
    getStats: () => {
        available: number;
        active: number;
        total: number;
    };
};
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
export declare const processLargeArray: <T, R>(array: T[], processor: (chunk: T[]) => Promise<R[]> | R[], chunkSize?: number) => Promise<R[]>;
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
export declare const createPaginator: <T>(data: T[], pageSize: number) => {
    hasNext: () => boolean;
    next: () => T[];
    reset: () => void;
    getCurrentPage: () => number;
    getTotalPages: () => number;
};
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
export declare const splitLargeObject: (obj: Record<string, any>, keysPerChunk: number) => Record<string, any>[];
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
export declare const createLRUEviction: (maxSize: number) => CacheEvictionStrategy;
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
export declare const createLFUEviction: (maxSize: number) => CacheEvictionStrategy;
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
export declare const createFIFOEviction: (maxSize: number) => CacheEvictionStrategy;
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
export declare const createEvictionCache: <K, V>(maxSize: number, strategy?: CacheEvictionStrategy) => {
    get: (key: K) => V | undefined;
    set: (key: K, value: V) => void;
    delete: (key: K) => boolean;
    clear: () => void;
    size: () => number;
};
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
export declare const createReferenceCounter: <T extends object>() => {
    addRef: (obj: T) => number;
    release: (obj: T) => number;
    getCount: (obj: T) => number;
    isReferenced: (obj: T) => boolean;
};
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
export declare const getMemoryUsagePercentage: () => number;
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
export declare const formatMemorySize: (bytes: number, decimals?: number) => string;
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
export declare const estimateObjectSize: (obj: any) => number;
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
export declare const createMemoryTracker: (intervalMs?: number) => {
    start: () => void;
    stop: () => void;
    getStats: () => {
        samples: number;
        average: number;
        peak: number;
        current: number;
        snapshots?: undefined;
    } | {
        samples: number;
        average: number;
        peak: number;
        current: number;
        snapshots: MemorySnapshot[];
    };
    reset: () => void;
};
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
export declare const detectMemoryTrend: (snapshots: MemorySnapshot[]) => {
    isIncreasing: boolean;
    rate: number;
    samples: number;
    isDecreasing?: undefined;
    totalChange?: undefined;
} | {
    isIncreasing: boolean;
    isDecreasing: boolean;
    rate: number;
    totalChange: number;
    samples: number;
};
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
export declare const createMemoryBudget: (maxMemoryMB: number) => {
    check: () => boolean;
    getCurrentUsageMB: () => number;
    getRemainingMB: () => number;
    enforce: (onExceeded: () => void, intervalMs?: number) => void;
    stopEnforcing: () => void;
};
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
export declare const memoryAwareThrottle: <T extends (...args: any[]) => any>(fn: T, memoryThresholdMB: number) => ((...args: Parameters<T>) => Promise<ReturnType<T>>);
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
export declare const createCircularBuffer: <T>(size: number) => {
    push: (item: T) => void;
    get: (position: number) => T | undefined;
    toArray: () => T[];
    size: () => number;
    capacity: () => number;
    clear: () => void;
};
declare const _default: {
    takeMemorySnapshot: () => MemorySnapshot;
    compareMemorySnapshots: (baseline: MemorySnapshot, current: MemorySnapshot) => MemorySnapshot;
    createMemoryLeakDetector: (config: MemoryLeakDetectionConfig) => {
        start: (onLeakDetected: (info: any) => void) => void;
        stop: () => void;
        getSnapshots: () => MemorySnapshot[];
    };
    monitorMemoryThreshold: (thresholdMB: number, callback: (usage: MemoryStats) => void) => (() => void);
    createObjectTracker: () => {
        register: (obj: object, type: string) => void;
        unregister: (obj: object) => void;
        getStats: () => Record<string, number>;
        clear: () => void;
    };
    createWeakCache: <K extends object, V>() => {
        get: (key: K) => V | undefined;
        set: (key: K, value: V) => void;
        has: (key: K) => boolean;
        delete: (key: K) => boolean;
    };
    createWeakSet: <T extends object>() => {
        add: (value: T) => void;
        has: (value: T) => boolean;
        delete: (value: T) => boolean;
    };
    weakMemoize: <T extends object, R>(fn: (arg: T) => R) => ((arg: T) => R);
    createWeakMetadata: <T extends object>() => {
        get: (target: T, key: string) => any;
        set: (target: T, key: string, value: any) => void;
        has: (target: T, key?: string) => boolean;
        delete: (target: T, key?: string) => boolean;
    };
    createBufferPool: (bufferSize: number, poolSize: number) => {
        acquire: () => Buffer;
        release: (buffer: Buffer) => void;
        getStats: () => BufferPoolStats;
        clear: () => void;
    };
    safeBufferAlloc: (size: number, maxSize?: number) => Buffer;
    concatBuffers: (buffers: Buffer[], totalLength?: number) => Buffer;
    splitBuffer: (buffer: Buffer, chunkSize: number) => Buffer[];
    bufferToHex: (buffer: Buffer, separator?: string) => string;
    secureBufferClear: (buffer: Buffer, passes?: number) => void;
    createBackpressureStream: (processor: (chunk: any) => Promise<void>, highWaterMark?: number) => {
        push: (chunk: any) => boolean;
        drain: () => Promise<void>;
        getQueueLength: () => number;
    };
    createChunkedReader: (chunkSize: number) => {
        chunkSize: number;
        onChunk: (chunk: Buffer, callback: (chunk: Buffer) => void) => void;
        getBytesRead: () => number;
        reset: () => void;
    };
    createStreamTransform: <T, R>(transform: (batch: T[]) => R[], batchSize?: number) => {
        process: (item: T) => R[] | null;
        flush: () => R[];
    };
    forceGarbageCollection: () => boolean;
    suggestGarbageCollection: (delay?: number) => Promise<boolean>;
    clearReference: <T>(obj: T) => null;
    monitorGarbageCollection: (callback: (event: any) => void) => (() => void);
    createObjectPool: <T>(config: PoolConfig) => {
        acquire: () => Promise<T>;
        release: (obj: T) => void;
        drain: () => void;
        getStats: () => {
            available: number;
            active: number;
            total: number;
        };
    };
    createResourcePool: <T>(factory: () => T, maxSize: number) => {
        acquire: () => Promise<unknown>;
        release: (obj: unknown) => void;
        drain: () => void;
        getStats: () => {
            available: number;
            active: number;
            total: number;
        };
    };
    processLargeArray: <T, R>(array: T[], processor: (chunk: T[]) => Promise<R[]> | R[], chunkSize?: number) => Promise<R[]>;
    createPaginator: <T>(data: T[], pageSize: number) => {
        hasNext: () => boolean;
        next: () => T[];
        reset: () => void;
        getCurrentPage: () => number;
        getTotalPages: () => number;
    };
    splitLargeObject: (obj: Record<string, any>, keysPerChunk: number) => Record<string, any>[];
    createLRUEviction: (maxSize: number) => CacheEvictionStrategy;
    createLFUEviction: (maxSize: number) => CacheEvictionStrategy;
    createFIFOEviction: (maxSize: number) => CacheEvictionStrategy;
    createEvictionCache: <K, V>(maxSize: number, strategy?: CacheEvictionStrategy) => {
        get: (key: K) => V | undefined;
        set: (key: K, value: V) => void;
        delete: (key: K) => boolean;
        clear: () => void;
        size: () => number;
    };
    createReferenceCounter: <T extends object>() => {
        addRef: (obj: T) => number;
        release: (obj: T) => number;
        getCount: (obj: T) => number;
        isReferenced: (obj: T) => boolean;
    };
    getMemoryUsagePercentage: () => number;
    formatMemorySize: (bytes: number, decimals?: number) => string;
    estimateObjectSize: (obj: any) => number;
    createMemoryTracker: (intervalMs?: number) => {
        start: () => void;
        stop: () => void;
        getStats: () => {
            samples: number;
            average: number;
            peak: number;
            current: number;
            snapshots?: undefined;
        } | {
            samples: number;
            average: number;
            peak: number;
            current: number;
            snapshots: MemorySnapshot[];
        };
        reset: () => void;
    };
    detectMemoryTrend: (snapshots: MemorySnapshot[]) => {
        isIncreasing: boolean;
        rate: number;
        samples: number;
        isDecreasing?: undefined;
        totalChange?: undefined;
    } | {
        isIncreasing: boolean;
        isDecreasing: boolean;
        rate: number;
        totalChange: number;
        samples: number;
    };
    createMemoryBudget: (maxMemoryMB: number) => {
        check: () => boolean;
        getCurrentUsageMB: () => number;
        getRemainingMB: () => number;
        enforce: (onExceeded: () => void, intervalMs?: number) => void;
        stopEnforcing: () => void;
    };
    memoryAwareThrottle: <T extends (...args: any[]) => any>(fn: T, memoryThresholdMB: number) => ((...args: Parameters<T>) => Promise<ReturnType<T>>);
    createCircularBuffer: <T>(size: number) => {
        push: (item: T) => void;
        get: (position: number) => T | undefined;
        toArray: () => T[];
        size: () => number;
        capacity: () => number;
        clear: () => void;
    };
};
export default _default;
//# sourceMappingURL=memory-handling-utils.d.ts.map