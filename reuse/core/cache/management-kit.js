"use strict";
/**
 * @fileoverview Cache Management Kit
 * @module core/cache/management-kit
 *
 * Comprehensive cache management utilities including lifecycle management,
 * eviction policies, cache invalidation, and monitoring.
 *
 * @example Basic cache manager
 * ```typescript
 * const manager = new CacheManagementKit({
 *   maxSize: 1000,
 *   evictionPolicy: 'lru',
 *   ttl: 3600000
 * });
 *
 * await manager.set('key', 'value');
 * const value = await manager.get('key');
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManagementKit = exports.CacheInvalidator = void 0;
exports.createCacheManager = createCacheManager;
const performance_1 = require("./performance");
/**
 * Cache Management Kit
 *
 * Provides comprehensive cache management with eviction policies,
 * metrics tracking, and lifecycle management.
 */
class CacheManagementKit {
    constructor(config = {}) {
        this.cache = new Map();
        this.cleanupTimer = null;
        this.config = {
            maxSize: 1000,
            ttl: 3600000, // 1 hour
            evictionPolicy: 'lru',
            enableMetrics: true,
            cleanupInterval: 60000, // 1 minute
            ...config,
        };
        this.metrics = new performance_1.CacheMetrics();
        this.startCleanup();
    }
    /**
     * Start periodic cleanup
     */
    startCleanup() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
        this.cleanupTimer = setInterval(() => {
            this.cleanExpired();
        }, this.config.cleanupInterval);
    }
    /**
     * Get value from cache
     */
    async get(key) {
        const start = Date.now();
        try {
            const entry = this.cache.get(key);
            if (!entry) {
                if (this.config.enableMetrics) {
                    this.metrics.recordMiss('default', Date.now() - start);
                }
                return null;
            }
            // Check expiry
            if (entry.expiry !== null && entry.expiry < Date.now()) {
                this.cache.delete(key);
                if (this.config.enableMetrics) {
                    this.metrics.recordMiss('default', Date.now() - start);
                }
                return null;
            }
            // Update access metadata
            entry.accessCount++;
            entry.lastAccess = Date.now();
            if (this.config.enableMetrics) {
                this.metrics.recordHit('default', Date.now() - start);
            }
            return entry.value;
        }
        catch (error) {
            if (this.config.enableMetrics) {
                this.metrics.recordError('default');
            }
            throw error;
        }
    }
    /**
     * Set value in cache
     */
    async set(key, value, ttl) {
        const start = Date.now();
        try {
            // Check if we need to evict
            if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
                this.evict();
            }
            const effectiveTtl = ttl !== undefined ? ttl : this.config.ttl;
            const expiry = effectiveTtl > 0 ? Date.now() + effectiveTtl : null;
            const entry = {
                value,
                expiry,
                accessCount: 0,
                lastAccess: Date.now(),
                createdAt: Date.now(),
            };
            this.cache.set(key, entry);
            if (this.config.enableMetrics) {
                this.metrics.recordSet('default', Date.now() - start);
            }
        }
        catch (error) {
            if (this.config.enableMetrics) {
                this.metrics.recordError('default');
            }
            throw error;
        }
    }
    /**
     * Delete value from cache
     */
    async delete(key) {
        const start = Date.now();
        try {
            const deleted = this.cache.delete(key);
            if (this.config.enableMetrics && deleted) {
                this.metrics.recordDelete('default', Date.now() - start);
            }
            return deleted;
        }
        catch (error) {
            if (this.config.enableMetrics) {
                this.metrics.recordError('default');
            }
            throw error;
        }
    }
    /**
     * Check if key exists
     */
    async has(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return false;
        }
        // Check expiry
        if (entry.expiry !== null && entry.expiry < Date.now()) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    /**
     * Clear all cache entries
     */
    async clear() {
        this.cache.clear();
        if (this.config.enableMetrics) {
            this.metrics.reset('default');
        }
    }
    /**
     * Get all keys
     */
    async keys(pattern) {
        const allKeys = Array.from(this.cache.keys());
        if (!pattern || pattern === '*') {
            return allKeys;
        }
        // Simple pattern matching
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        return allKeys.filter(key => regex.test(key));
    }
    /**
     * Get cache size
     */
    size() {
        return this.cache.size;
    }
    /**
     * Evict entry based on policy
     */
    evict() {
        if (this.cache.size === 0) {
            return;
        }
        let keyToEvict = null;
        switch (this.config.evictionPolicy) {
            case 'lru':
                keyToEvict = this.evictLRU();
                break;
            case 'lfu':
                keyToEvict = this.evictLFU();
                break;
            case 'fifo':
                keyToEvict = this.evictFIFO();
                break;
            case 'ttl':
                keyToEvict = this.evictTTL();
                break;
        }
        if (keyToEvict) {
            this.cache.delete(keyToEvict);
        }
    }
    /**
     * Evict least recently used entry
     */
    evictLRU() {
        let oldestKey = null;
        let oldestTime = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (entry.lastAccess < oldestTime) {
                oldestTime = entry.lastAccess;
                oldestKey = key;
            }
        }
        return oldestKey;
    }
    /**
     * Evict least frequently used entry
     */
    evictLFU() {
        let leastUsedKey = null;
        let leastCount = Infinity;
        for (const [key, entry] of this.cache.entries()) {
            if (entry.accessCount < leastCount) {
                leastCount = entry.accessCount;
                leastUsedKey = key;
            }
        }
        return leastUsedKey;
    }
    /**
     * Evict first in first out entry
     */
    evictFIFO() {
        let oldestKey = null;
        let oldestTime = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (entry.createdAt < oldestTime) {
                oldestTime = entry.createdAt;
                oldestKey = key;
            }
        }
        return oldestKey;
    }
    /**
     * Evict entry with shortest TTL
     */
    evictTTL() {
        let shortestTTLKey = null;
        let shortestExpiry = Infinity;
        for (const [key, entry] of this.cache.entries()) {
            if (entry.expiry !== null && entry.expiry < shortestExpiry) {
                shortestExpiry = entry.expiry;
                shortestTTLKey = key;
            }
        }
        // If no entries with TTL, fall back to LRU
        return shortestTTLKey || this.evictLRU();
    }
    /**
     * Clean expired entries
     */
    cleanExpired() {
        const now = Date.now();
        const keysToDelete = [];
        for (const [key, entry] of this.cache.entries()) {
            if (entry.expiry !== null && entry.expiry < now) {
                keysToDelete.push(key);
            }
        }
        for (const key of keysToDelete) {
            this.cache.delete(key);
        }
    }
    /**
     * Get cache metrics
     */
    getMetrics() {
        return this.metrics.getStats('default');
    }
    /**
     * Reset metrics
     */
    resetMetrics() {
        this.metrics.reset('default');
    }
    /**
     * Get cache statistics
     */
    getStats() {
        const metrics = this.getMetrics();
        return {
            size: this.cache.size,
            maxSize: this.config.maxSize,
            hitRate: metrics.hitRate,
            missRate: metrics.missRate,
            evictionPolicy: this.config.evictionPolicy,
        };
    }
    /**
     * Invalidate cache entries matching pattern
     */
    async invalidate(pattern) {
        const keys = await this.keys(pattern);
        let count = 0;
        for (const key of keys) {
            if (await this.delete(key)) {
                count++;
            }
        }
        return count;
    }
    /**
     * Get or set pattern
     */
    async getOrSet(key, loader, ttl) {
        const cached = await this.get(key);
        if (cached !== null) {
            return cached;
        }
        const value = await loader();
        await this.set(key, value, ttl);
        return value;
    }
    /**
     * Batch get operation
     */
    async getMany(keys) {
        const results = new Map();
        for (const key of keys) {
            const value = await this.get(key);
            if (value !== null) {
                results.set(key, value);
            }
        }
        return results;
    }
    /**
     * Batch set operation
     */
    async setMany(entries, ttl) {
        const promises = [];
        for (const [key, value] of entries.entries()) {
            promises.push(this.set(key, value, ttl));
        }
        await Promise.all(promises);
    }
    /**
     * Batch delete operation
     */
    async deleteMany(keys) {
        let deleted = 0;
        for (const key of keys) {
            if (await this.delete(key)) {
                deleted++;
            }
        }
        return deleted;
    }
    /**
     * Refresh cache entry TTL
     */
    async touch(key, ttl) {
        const entry = this.cache.get(key);
        if (!entry) {
            return false;
        }
        const effectiveTtl = ttl !== undefined ? ttl : this.config.ttl;
        entry.expiry = effectiveTtl > 0 ? Date.now() + effectiveTtl : null;
        entry.lastAccess = Date.now();
        return true;
    }
    /**
     * Get remaining TTL for a key
     */
    async getTTL(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return -2; // Key doesn't exist
        }
        if (entry.expiry === null) {
            return -1; // No expiry
        }
        const remaining = entry.expiry - Date.now();
        return remaining > 0 ? remaining : -2;
    }
    /**
     * Stop cleanup timer and cleanup
     */
    destroy() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
        this.cache.clear();
    }
}
exports.default = CacheManagementKit;
exports.CacheManagementKit = CacheManagementKit;
/**
 * Create cache manager instance
 */
function createCacheManager(config) {
    return new CacheManagementKit(config);
}
/**
 * Cache invalidation utilities
 */
class CacheInvalidator {
    constructor() {
        this.patterns = new Map();
    }
    /**
     * Register a pattern for a tag
     */
    registerTag(tag, pattern) {
        if (!this.patterns.has(tag)) {
            this.patterns.set(tag, new Set());
        }
        this.patterns.get(tag).add(pattern);
    }
    /**
     * Invalidate by tag
     */
    async invalidateByTag(tag, cache) {
        const patterns = this.patterns.get(tag);
        if (!patterns) {
            return 0;
        }
        let totalInvalidated = 0;
        for (const pattern of patterns) {
            const count = await cache.invalidate(pattern);
            totalInvalidated += count;
        }
        return totalInvalidated;
    }
    /**
     * Invalidate multiple tags
     */
    async invalidateTags(tags, cache) {
        let total = 0;
        for (const tag of tags) {
            const count = await this.invalidateByTag(tag, cache);
            total += count;
        }
        return total;
    }
    /**
     * Clear all patterns for a tag
     */
    clearTag(tag) {
        this.patterns.delete(tag);
    }
    /**
     * Clear all tags
     */
    clearAll() {
        this.patterns.clear();
    }
}
exports.CacheInvalidator = CacheInvalidator;
//# sourceMappingURL=management-kit.js.map