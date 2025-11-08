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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

interface StreamChunk {
  data: Buffer | string;
  encoding?: string;
  final?: boolean;
}

interface BufferPoolStats {
  allocated: number;
  available: number;
  totalCreated: number;
  totalDestroyed: number;
}

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
export const takeMemorySnapshot = (): MemorySnapshot => {
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
export const compareMemorySnapshots = (
  baseline: MemorySnapshot,
  current: MemorySnapshot,
): MemorySnapshot => {
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
export const createMemoryLeakDetector = (config: MemoryLeakDetectionConfig) => {
  let intervalId: NodeJS.Timeout | null = null;
  let snapshots: MemorySnapshot[] = [];
  let consecutiveIncreases = 0;

  return {
    start: (onLeakDetected: (info: any) => void) => {
      intervalId = setInterval(() => {
        const snapshot = takeMemorySnapshot();
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
          } else {
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
export const monitorMemoryThreshold = (
  thresholdMB: number,
  callback: (usage: MemoryStats) => void,
): (() => void) => {
  const thresholdBytes = thresholdMB * 1024 * 1024;
  let isMonitoring = true;

  const checkMemory = () => {
    if (!isMonitoring) return;

    const snapshot = takeMemorySnapshot();
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
export const createObjectTracker = () => {
  const objects = new WeakMap<object, { type: string; timestamp: number }>();
  const counters = new Map<string, number>();

  return {
    register: (obj: object, type: string) => {
      objects.set(obj, { type, timestamp: Date.now() });
      counters.set(type, (counters.get(type) || 0) + 1);
    },

    unregister: (obj: object) => {
      const info = objects.get(obj);
      if (info) {
        counters.set(info.type, (counters.get(info.type) || 1) - 1);
        objects.delete(obj);
      }
    },

    getStats: () => {
      const stats: Record<string, number> = {};
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
export const createWeakCache = <K extends object, V>() => {
  const cache = new WeakMap<K, V>();

  return {
    get: (key: K): V | undefined => cache.get(key),
    set: (key: K, value: V): void => {
      cache.set(key, value);
    },
    has: (key: K): boolean => cache.has(key),
    delete: (key: K): boolean => cache.delete(key),
  };
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
export const createWeakSet = <T extends object>() => {
  const set = new WeakSet<T>();

  return {
    add: (value: T): void => {
      set.add(value);
    },
    has: (value: T): boolean => set.has(value),
    delete: (value: T): boolean => set.delete(value),
  };
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
export const weakMemoize = <T extends object, R>(
  fn: (arg: T) => R,
): ((arg: T) => R) => {
  const cache = new WeakMap<T, R>();

  return (arg: T): R => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }

    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
};

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
export const createWeakMetadata = <T extends object>() => {
  const storage = new WeakMap<T, Map<string, any>>();

  return {
    get: (target: T, key: string): any => {
      return storage.get(target)?.get(key);
    },

    set: (target: T, key: string, value: any): void => {
      if (!storage.has(target)) {
        storage.set(target, new Map());
      }
      storage.get(target)!.set(key, value);
    },

    has: (target: T, key?: string): boolean => {
      if (!key) return storage.has(target);
      return storage.get(target)?.has(key) || false;
    },

    delete: (target: T, key?: string): boolean => {
      if (!key) return storage.delete(target);
      return storage.get(target)?.delete(key) || false;
    },
  };
};

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
export const createBufferPool = (bufferSize: number, poolSize: number) => {
  const available: Buffer[] = [];
  const stats: BufferPoolStats = {
    allocated: 0,
    available: 0,
    totalCreated: 0,
    totalDestroyed: 0,
  };

  return {
    acquire: (): Buffer => {
      if (available.length > 0) {
        const buffer = available.pop()!;
        stats.available = available.length;
        stats.allocated++;
        return buffer;
      }

      const buffer = Buffer.allocUnsafe(bufferSize);
      stats.totalCreated++;
      stats.allocated++;
      return buffer;
    },

    release: (buffer: Buffer): void => {
      if (buffer.length !== bufferSize) {
        throw new Error('Buffer size mismatch');
      }

      if (available.length < poolSize) {
        buffer.fill(0); // Clear buffer
        available.push(buffer);
        stats.available = available.length;
      } else {
        stats.totalDestroyed++;
      }
      stats.allocated--;
    },

    getStats: (): BufferPoolStats => ({ ...stats }),

    clear: (): void => {
      stats.totalDestroyed += available.length;
      available.length = 0;
      stats.available = 0;
    },
  };
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
export const safeBufferAlloc = (size: number, maxSize?: number): Buffer => {
  if (size < 0) {
    throw new Error('Buffer size cannot be negative');
  }

  if (maxSize && size > maxSize) {
    throw new Error(`Buffer size ${size} exceeds maximum ${maxSize}`);
  }

  return Buffer.alloc(size);
};

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
export const concatBuffers = (buffers: Buffer[], totalLength?: number): Buffer => {
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
export const splitBuffer = (buffer: Buffer, chunkSize: number): Buffer[] => {
  const chunks: Buffer[] = [];
  let offset = 0;

  while (offset < buffer.length) {
    const end = Math.min(offset + chunkSize, buffer.length);
    chunks.push(buffer.subarray(offset, end));
    offset = end;
  }

  return chunks;
};

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
export const bufferToHex = (buffer: Buffer, separator?: string): string => {
  const hex = buffer.toString('hex');
  if (!separator) return hex;

  return hex.match(/.{2}/g)?.join(separator) || hex;
};

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
export const secureBufferClear = (buffer: Buffer, passes: number = 1): void => {
  for (let i = 0; i < passes; i++) {
    if (i === passes - 1) {
      buffer.fill(0); // Final pass with zeros
    } else {
      for (let j = 0; j < buffer.length; j++) {
        buffer[j] = Math.floor(Math.random() * 256);
      }
    }
  }
};

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
export const createBackpressureStream = (
  processor: (chunk: any) => Promise<void>,
  highWaterMark: number = 16,
) => {
  const queue: any[] = [];
  let processing = false;
  let drainResolve: (() => void) | null = null;

  const processQueue = async () => {
    if (processing || queue.length === 0) return;

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
    push: (chunk: any): boolean => {
      queue.push(chunk);
      processQueue();
      return queue.length < highWaterMark;
    },

    drain: (): Promise<void> => {
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
export const createChunkedReader = (chunkSize: number) => {
  let bytesRead = 0;

  return {
    chunkSize,
    onChunk: (chunk: Buffer, callback: (chunk: Buffer) => void) => {
      bytesRead += chunk.length;
      callback(chunk);
    },
    getBytesRead: () => bytesRead,
    reset: () => {
      bytesRead = 0;
    },
  };
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
export const createStreamTransform = <T, R>(
  transform: (batch: T[]) => R[],
  batchSize: number = 100,
) => {
  let batch: T[] = [];

  return {
    process: (item: T): R[] | null => {
      batch.push(item);

      if (batch.length >= batchSize) {
        const result = transform(batch);
        batch = [];
        return result;
      }

      return null;
    },

    flush: (): R[] => {
      if (batch.length === 0) return [];
      const result = transform(batch);
      batch = [];
      return result;
    },
  };
};

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
export const forceGarbageCollection = (): boolean => {
  if (global.gc) {
    global.gc();
    return true;
  }
  return false;
};

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
export const suggestGarbageCollection = (delay: number = 0): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(forceGarbageCollection());
    }, delay);
  });
};

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
export const clearReference = <T>(obj: T): null => {
  obj = null as any;
  return null;
};

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
export const monitorGarbageCollection = (callback: (event: any) => void): (() => void) => {
  let monitoring = true;
  const originalLog = console.log;

  // Note: This is a simplified implementation
  // In production, use Node.js perf_hooks for accurate GC monitoring

  const interval = setInterval(() => {
    if (!monitoring) return;

    const snapshot = takeMemorySnapshot();
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
export const createObjectPool = <T>(config: PoolConfig) => {
  const { maxSize, minSize, factory, destroyer, validator } = config;
  const available: T[] = [];
  let activeCount = 0;

  // Initialize minimum pool size
  for (let i = 0; i < minSize; i++) {
    available.push(factory());
  }

  return {
    acquire: async (): Promise<T> => {
      if (available.length > 0) {
        const obj = available.pop()!;
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
      return new Promise<T>((resolve) => {
        const checkAvailable = setInterval(() => {
          if (available.length > 0) {
            clearInterval(checkAvailable);
            const obj = available.pop()!;
            activeCount++;
            resolve(obj);
          }
        }, 10);
      });
    },

    release: (obj: T): void => {
      activeCount--;

      if (available.length < maxSize) {
        if (!validator || validator(obj)) {
          available.push(obj);
        } else if (destroyer) {
          destroyer(obj);
        }
      } else if (destroyer) {
        destroyer(obj);
      }
    },

    drain: (): void => {
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
export const createResourcePool = <T>(factory: () => T, maxSize: number) => {
  return createObjectPool({
    maxSize,
    minSize: 0,
    factory,
  });
};

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
export const processLargeArray = async <T, R>(
  array: T[],
  processor: (chunk: T[]) => Promise<R[]> | R[],
  chunkSize: number = 1000,
): Promise<R[]> => {
  const results: R[] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    const processed = await processor(chunk);
    results.push(...processed);

    // Allow event loop to process other tasks
    await new Promise((resolve) => setImmediate(resolve));
  }

  return results;
};

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
export const createPaginator = <T>(data: T[], pageSize: number) => {
  let currentIndex = 0;

  return {
    hasNext: () => currentIndex < data.length,

    next: (): T[] => {
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
export const splitLargeObject = (
  obj: Record<string, any>,
  keysPerChunk: number,
): Record<string, any>[] => {
  const keys = Object.keys(obj);
  const chunks: Record<string, any>[] = [];

  for (let i = 0; i < keys.length; i += keysPerChunk) {
    const chunkKeys = keys.slice(i, i + keysPerChunk);
    const chunk: Record<string, any> = {};

    for (const key of chunkKeys) {
      chunk[key] = obj[key];
    }

    chunks.push(chunk);
  }

  return chunks;
};

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
export const createLRUEviction = (maxSize: number): CacheEvictionStrategy => {
  const accessOrder = new Map<any, number>();
  let timestamp = 0;

  return {
    shouldEvict: (size: number) => size >= maxSize,

    selectVictim: (entries: Map<any, any>) => {
      let oldestKey: any = null;
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
export const createLFUEviction = (maxSize: number): CacheEvictionStrategy => {
  const frequency = new Map<any, number>();

  return {
    shouldEvict: (size: number) => size >= maxSize,

    selectVictim: (entries: Map<any, any>) => {
      let leastKey: any = null;
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
export const createFIFOEviction = (maxSize: number): CacheEvictionStrategy => {
  return {
    shouldEvict: (size: number) => size >= maxSize,

    selectVictim: (entries: Map<any, any>) => {
      // Map maintains insertion order
      return entries.keys().next().value;
    },
  };
};

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
export const createEvictionCache = <K, V>(
  maxSize: number,
  strategy?: CacheEvictionStrategy,
) => {
  const cache = new Map<K, V>();
  const evictionStrategy = strategy || createLRUEviction(maxSize);

  return {
    get: (key: K): V | undefined => cache.get(key),

    set: (key: K, value: V): void => {
      if (evictionStrategy.shouldEvict(cache.size, maxSize) && !cache.has(key)) {
        const victim = evictionStrategy.selectVictim(cache);
        if (victim !== null) {
          cache.delete(victim);
        }
      }

      cache.set(key, value);
    },

    delete: (key: K): boolean => cache.delete(key),

    clear: (): void => cache.clear(),

    size: () => cache.size,
  };
};

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
export const createReferenceCounter = <T extends object>() => {
  const counts = new WeakMap<T, number>();

  return {
    addRef: (obj: T): number => {
      const currentCount = counts.get(obj) || 0;
      const newCount = currentCount + 1;
      counts.set(obj, newCount);
      return newCount;
    },

    release: (obj: T): number => {
      const currentCount = counts.get(obj) || 0;
      const newCount = Math.max(0, currentCount - 1);

      if (newCount === 0) {
        counts.delete(obj);
      } else {
        counts.set(obj, newCount);
      }

      return newCount;
    },

    getCount: (obj: T): number => counts.get(obj) || 0,

    isReferenced: (obj: T): boolean => (counts.get(obj) || 0) > 0,
  };
};

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
export const getMemoryUsagePercentage = (): number => {
  const usage = process.memoryUsage();
  return (usage.heapUsed / usage.heapTotal) * 100;
};

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
export const formatMemorySize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

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
export const estimateObjectSize = (obj: any): number => {
  const seen = new WeakSet();

  const sizeOf = (value: any): number => {
    if (value === null || value === undefined) return 0;

    const type = typeof value;

    if (type === 'boolean') return 4;
    if (type === 'number') return 8;
    if (type === 'string') return value.length * 2;

    if (type === 'object') {
      if (seen.has(value)) return 0;
      seen.add(value);

      let size = 0;

      if (Array.isArray(value)) {
        size = value.reduce((acc, item) => acc + sizeOf(item), 0);
      } else if (Buffer.isBuffer(value)) {
        size = value.length;
      } else {
        size = Object.keys(value).reduce(
          (acc, key) => acc + key.length * 2 + sizeOf(value[key]),
          0,
        );
      }

      return size;
    }

    return 0;
  };

  return sizeOf(obj);
};

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
export const createMemoryTracker = (intervalMs: number = 1000) => {
  let intervalId: NodeJS.Timeout | null = null;
  const samples: MemorySnapshot[] = [];

  return {
    start: () => {
      intervalId = setInterval(() => {
        samples.push(takeMemorySnapshot());
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
export const detectMemoryTrend = (snapshots: MemorySnapshot[]) => {
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
export const createMemoryBudget = (maxMemoryMB: number) => {
  const maxBytes = maxMemoryMB * 1024 * 1024;
  let enforcing = false;
  let checkInterval: NodeJS.Timeout | null = null;

  return {
    check: (): boolean => {
      const usage = process.memoryUsage();
      return usage.heapUsed <= maxBytes;
    },

    getCurrentUsageMB: (): number => {
      const usage = process.memoryUsage();
      return usage.heapUsed / 1024 / 1024;
    },

    getRemainingMB: (): number => {
      const usage = process.memoryUsage();
      const remaining = maxBytes - usage.heapUsed;
      return Math.max(0, remaining / 1024 / 1024);
    },

    enforce: (onExceeded: () => void, intervalMs: number = 5000) => {
      if (enforcing) return;

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
export const memoryAwareThrottle = <T extends (...args: any[]) => any>(
  fn: T,
  memoryThresholdMB: number,
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  const thresholdBytes = memoryThresholdMB * 1024 * 1024;

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
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
export const createCircularBuffer = <T>(size: number) => {
  const buffer: T[] = new Array(size);
  let index = 0;
  let count = 0;

  return {
    push: (item: T): void => {
      buffer[index] = item;
      index = (index + 1) % size;
      count = Math.min(count + 1, size);
    },

    get: (position: number): T | undefined => {
      if (position >= count) return undefined;
      const actualIndex = (index - count + position + size) % size;
      return buffer[actualIndex];
    },

    toArray: (): T[] => {
      if (count < size) {
        return buffer.slice(0, count);
      }
      return [...buffer.slice(index), ...buffer.slice(0, index)];
    },

    size: () => count,

    capacity: () => size,

    clear: (): void => {
      count = 0;
      index = 0;
    },
  };
};

export default {
  // Memory leak detection
  takeMemorySnapshot,
  compareMemorySnapshots,
  createMemoryLeakDetector,
  monitorMemoryThreshold,
  createObjectTracker,

  // WeakMap/WeakSet utilities
  createWeakCache,
  createWeakSet,
  weakMemoize,
  createWeakMetadata,

  // Buffer management
  createBufferPool,
  safeBufferAlloc,
  concatBuffers,
  splitBuffer,
  bufferToHex,
  secureBufferClear,

  // Stream processing
  createBackpressureStream,
  createChunkedReader,
  createStreamTransform,

  // Garbage collection
  forceGarbageCollection,
  suggestGarbageCollection,
  clearReference,
  monitorGarbageCollection,

  // Memory pool management
  createObjectPool,
  createResourcePool,

  // Large object handling
  processLargeArray,
  createPaginator,
  splitLargeObject,

  // Cache eviction strategies
  createLRUEviction,
  createLFUEviction,
  createFIFOEviction,
  createEvictionCache,

  // Reference counting
  createReferenceCounter,

  // Memory profiling
  getMemoryUsagePercentage,
  formatMemorySize,
  estimateObjectSize,
  createMemoryTracker,
  detectMemoryTrend,
  createMemoryBudget,
  memoryAwareThrottle,
  createCircularBuffer,
};
