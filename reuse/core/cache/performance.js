"use strict";
/**
 * @fileoverview Cache Performance Utilities
 * @module core/cache/performance
 *
 * Performance optimization utilities for caching including metrics tracking,
 * cache warming, batch operations, and performance monitoring.
 *
 * @example Track cache metrics
 * ```typescript
 * const metrics = new CacheMetrics();
 * metrics.recordHit('user-cache');
 * metrics.recordMiss('user-cache');
 * const stats = metrics.getStats('user-cache');
 * console.log(`Hit rate: ${stats.hitRate}%`);
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebouncedCacheSetter = exports.CachePerformanceMonitor = exports.BatchCacheOperations = exports.CacheWarmer = exports.CacheMetrics = void 0;
exports.memoize = memoize;
exports.memoizeAsync = memoizeAsync;
/**
 * Cache metrics tracker
 */
class CacheMetrics {
    constructor() {
        this.metrics = new Map();
    }
    /**
     * Record a cache hit
     */
    recordHit(namespace, time) {
        const metrics = this.getOrCreateMetrics(namespace);
        metrics.hits++;
        if (time !== undefined) {
            metrics.times.push(time);
        }
    }
    /**
     * Record a cache miss
     */
    recordMiss(namespace, time) {
        const metrics = this.getOrCreateMetrics(namespace);
        metrics.misses++;
        if (time !== undefined) {
            metrics.times.push(time);
        }
    }
    /**
     * Record a cache set operation
     */
    recordSet(namespace, time) {
        const metrics = this.getOrCreateMetrics(namespace);
        metrics.sets++;
        if (time !== undefined) {
            metrics.times.push(time);
        }
    }
    /**
     * Record a cache delete operation
     */
    recordDelete(namespace, time) {
        const metrics = this.getOrCreateMetrics(namespace);
        metrics.deletes++;
        if (time !== undefined) {
            metrics.times.push(time);
        }
    }
    /**
     * Record a cache error
     */
    recordError(namespace) {
        const metrics = this.getOrCreateMetrics(namespace);
        metrics.errors++;
    }
    /**
     * Get or create metrics for namespace
     */
    getOrCreateMetrics(namespace) {
        if (!this.metrics.has(namespace)) {
            this.metrics.set(namespace, {
                hits: 0,
                misses: 0,
                sets: 0,
                deletes: 0,
                errors: 0,
                times: [],
            });
        }
        return this.metrics.get(namespace);
    }
    /**
     * Get statistics for a namespace
     */
    getStats(namespace) {
        const metrics = this.metrics.get(namespace);
        if (!metrics) {
            return {
                hits: 0,
                misses: 0,
                sets: 0,
                deletes: 0,
                errors: 0,
                totalTime: 0,
                avgTime: 0,
                hitRate: 0,
                missRate: 0,
            };
        }
        const totalRequests = metrics.hits + metrics.misses;
        const totalTime = metrics.times.reduce((sum, time) => sum + time, 0);
        const avgTime = metrics.times.length > 0 ? totalTime / metrics.times.length : 0;
        const hitRate = totalRequests > 0 ? (metrics.hits / totalRequests) * 100 : 0;
        const missRate = totalRequests > 0 ? (metrics.misses / totalRequests) * 100 : 0;
        return {
            hits: metrics.hits,
            misses: metrics.misses,
            sets: metrics.sets,
            deletes: metrics.deletes,
            errors: metrics.errors,
            totalTime,
            avgTime,
            hitRate,
            missRate,
        };
    }
    /**
     * Get all statistics
     */
    getAllStats() {
        const allStats = new Map();
        for (const namespace of this.metrics.keys()) {
            allStats.set(namespace, this.getStats(namespace));
        }
        return allStats;
    }
    /**
     * Reset metrics for a namespace
     */
    reset(namespace) {
        if (namespace) {
            this.metrics.delete(namespace);
        }
        else {
            this.metrics.clear();
        }
    }
}
exports.CacheMetrics = CacheMetrics;
/**
 * Cache warmer for preloading frequently accessed data
 */
class CacheWarmer {
    constructor(config = {}) {
        this.config = {
            batchSize: 100,
            batchDelay: 100,
            concurrency: 5,
            ...config,
        };
    }
    /**
     * Warm cache with data
     */
    async warm(keys, loader, setter) {
        let success = 0;
        let failed = 0;
        // Process in batches
        for (let i = 0; i < keys.length; i += this.config.batchSize) {
            const batch = keys.slice(i, i + this.config.batchSize);
            // Process batch with concurrency limit
            const chunks = this.chunkArray(batch, this.config.concurrency);
            for (const chunk of chunks) {
                const results = await Promise.allSettled(chunk.map(async (key) => {
                    const value = await loader(key);
                    await setter(key, value);
                }));
                results.forEach(result => {
                    if (result.status === 'fulfilled') {
                        success++;
                    }
                    else {
                        failed++;
                        console.error('Cache warming error:', result.reason);
                    }
                });
            }
            // Delay between batches
            if (i + this.config.batchSize < keys.length) {
                await this.delay(this.config.batchDelay);
            }
        }
        return { success, failed };
    }
    /**
     * Chunk array into smaller arrays
     */
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
    /**
     * Delay utility
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.CacheWarmer = CacheWarmer;
/**
 * Batch cache operations
 */
class BatchCacheOperations {
    /**
     * Get multiple values from cache
     */
    async getMany(keys, getter) {
        const results = new Map();
        const promises = keys.map(async (key) => {
            try {
                const value = await getter(key);
                if (value !== null) {
                    results.set(key, value);
                }
            }
            catch (error) {
                console.error(`Error getting key ${key}:`, error);
            }
        });
        await Promise.all(promises);
        return results;
    }
    /**
     * Set multiple values in cache
     */
    async setMany(entries, setter) {
        let success = 0;
        let failed = 0;
        const promises = Array.from(entries.entries()).map(async ([key, value]) => {
            try {
                await setter(key, value);
                success++;
            }
            catch (error) {
                failed++;
                console.error(`Error setting key ${key}:`, error);
            }
        });
        await Promise.all(promises);
        return { success, failed };
    }
    /**
     * Delete multiple values from cache
     */
    async deleteMany(keys, deleter) {
        let success = 0;
        let failed = 0;
        const promises = keys.map(async (key) => {
            try {
                await deleter(key);
                success++;
            }
            catch (error) {
                failed++;
                console.error(`Error deleting key ${key}:`, error);
            }
        });
        await Promise.all(promises);
        return { success, failed };
    }
}
exports.BatchCacheOperations = BatchCacheOperations;
/**
 * Performance monitor for cache operations
 */
class CachePerformanceMonitor {
    constructor(maxOperations = 1000) {
        this.operations = [];
        this.maxOperations = maxOperations;
    }
    /**
     * Track an operation
     */
    async track(operation, fn) {
        const start = Date.now();
        let success = true;
        try {
            const result = await fn();
            return result;
        }
        catch (error) {
            success = false;
            throw error;
        }
        finally {
            const duration = Date.now() - start;
            this.recordOperation(operation, duration, success);
        }
    }
    /**
     * Record operation metrics
     */
    recordOperation(operation, duration, success) {
        this.operations.push({
            operation,
            duration,
            timestamp: Date.now(),
            success,
        });
        // Keep only last N operations
        if (this.operations.length > this.maxOperations) {
            this.operations.shift();
        }
    }
    /**
     * Get performance statistics
     */
    getStatistics(operation) {
        const filtered = operation
            ? this.operations.filter(op => op.operation === operation)
            : this.operations;
        if (filtered.length === 0) {
            return {
                count: 0,
                avgDuration: 0,
                minDuration: 0,
                maxDuration: 0,
                successRate: 0,
                p50: 0,
                p95: 0,
                p99: 0,
            };
        }
        const durations = filtered.map(op => op.duration).sort((a, b) => a - b);
        const successCount = filtered.filter(op => op.success).length;
        return {
            count: filtered.length,
            avgDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
            minDuration: durations[0],
            maxDuration: durations[durations.length - 1],
            successRate: (successCount / filtered.length) * 100,
            p50: this.percentile(durations, 0.5),
            p95: this.percentile(durations, 0.95),
            p99: this.percentile(durations, 0.99),
        };
    }
    /**
     * Calculate percentile
     */
    percentile(sorted, p) {
        const index = Math.ceil(sorted.length * p) - 1;
        return sorted[Math.max(0, index)];
    }
    /**
     * Get slow operations (above threshold)
     */
    getSlowOperations(thresholdMs) {
        return this.operations.filter(op => op.duration > thresholdMs);
    }
    /**
     * Clear recorded operations
     */
    clear() {
        this.operations = [];
    }
}
exports.CachePerformanceMonitor = CachePerformanceMonitor;
/**
 * Memoization decorator for functions
 */
function memoize(fn, options = {}) {
    const cache = new Map();
    const { ttl, keyGenerator, maxSize = 1000 } = options;
    const defaultKeyGenerator = (...args) => {
        return JSON.stringify(args);
    };
    const getKey = keyGenerator || defaultKeyGenerator;
    return ((...args) => {
        const key = getKey(...args);
        const cached = cache.get(key);
        if (cached) {
            if (cached.expiry === null || cached.expiry > Date.now()) {
                return cached.value;
            }
            cache.delete(key);
        }
        const result = fn(...args);
        const expiry = ttl ? Date.now() + ttl : null;
        cache.set(key, { value: result, expiry });
        // Evict oldest if cache is too large
        if (cache.size > maxSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        return result;
    });
}
/**
 * Async memoization decorator
 */
function memoizeAsync(fn, options = {}) {
    const cache = new Map();
    const pending = new Map();
    const { ttl, keyGenerator, maxSize = 1000 } = options;
    const defaultKeyGenerator = (...args) => {
        return JSON.stringify(args);
    };
    const getKey = keyGenerator || defaultKeyGenerator;
    return (async (...args) => {
        const key = getKey(...args);
        const cached = cache.get(key);
        // Return cached value if valid
        if (cached) {
            if (cached.expiry === null || cached.expiry > Date.now()) {
                return cached.value;
            }
            cache.delete(key);
        }
        // Return pending promise if exists
        const pendingPromise = pending.get(key);
        if (pendingPromise) {
            return pendingPromise;
        }
        // Execute function and cache promise
        const promise = fn(...args);
        pending.set(key, promise);
        try {
            const result = await promise;
            const expiry = ttl ? Date.now() + ttl : null;
            cache.set(key, { value: result, expiry });
            // Evict oldest if cache is too large
            if (cache.size > maxSize) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }
            return result;
        }
        finally {
            pending.delete(key);
        }
    });
}
/**
 * Debounced cache setter to reduce write operations
 */
class DebouncedCacheSetter {
    constructor(setter, delay = 1000) {
        this.setter = setter;
        this.pending = new Map();
        this.delay = delay;
    }
    /**
     * Set value with debounce
     */
    set(key, value) {
        const existing = this.pending.get(key);
        if (existing) {
            clearTimeout(existing.timeout);
        }
        const timeout = setTimeout(async () => {
            try {
                await this.setter(key, value);
                this.pending.delete(key);
            }
            catch (error) {
                console.error(`Error setting debounced key ${key}:`, error);
            }
        }, this.delay);
        this.pending.set(key, { value, timeout });
    }
    /**
     * Flush all pending sets immediately
     */
    async flush() {
        const promises = [];
        for (const [key, { value, timeout }] of this.pending.entries()) {
            clearTimeout(timeout);
            promises.push(this.setter(key, value));
        }
        this.pending.clear();
        await Promise.all(promises);
    }
    /**
     * Cancel all pending sets
     */
    cancel() {
        for (const { timeout } of this.pending.values()) {
            clearTimeout(timeout);
        }
        this.pending.clear();
    }
}
exports.DebouncedCacheSetter = DebouncedCacheSetter;
//# sourceMappingURL=performance.js.map