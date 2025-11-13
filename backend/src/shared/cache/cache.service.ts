/**
 * @fileoverview NestJS Cache Service with LRU Eviction
 * @module shared/cache/cache.service
 * @description High-performance in-memory cache manager with LRU eviction policy,
 * TTL support, tag-based invalidation, and comprehensive metrics tracking
 *
 * Features:
 * - LRU (Least Recently Used) eviction policy
 * - Per-entry TTL (Time To Live) with automatic cleanup
 * - Tag-based cache invalidation for related entries
 * - Cache metrics (hits, misses, evictions, size)
 * - Type-safe operations with generics
 * - NestJS dependency injection support
 *
 * LOC: CACHE_SERVICE_NESTJS
 * UPSTREAM: None (leaf node)
 * DOWNSTREAM: Services requiring caching (students, medications, health records)
 */

import { Inject, Injectable, OnModuleDestroy, Optional } from '@nestjs/common';
import { AppConfigService } from '../../config/app-config.service';

import { BaseService } from '../../common/base';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
/**
 * Cache entry structure with metadata
 */
interface CacheEntry<T> {
  /** Cached data of generic type T */
  data: T;
  /** Timestamp when entry was created (milliseconds) */
  timestamp: number;
  /** Time-to-live in milliseconds */
  ttl: number;
  /** Tags for group invalidation */
  tags: string[];
  /** Last access timestamp for LRU tracking */
  lastAccess: number;
}

/**
 * Cache statistics for monitoring and optimization
 */
export interface CacheStats {
  /** Total cache hit count */
  hits: number;
  /** Total cache miss count */
  misses: number;
  /** Total eviction count (LRU) */
  evictions: number;
  /** Current number of cached entries */
  size: number;
  /** Maximum cache capacity */
  maxSize: number;
  /** Cache hit rate percentage */
  hitRate: number;
  /** Total memory usage estimate (bytes) */
  memoryUsage: number;
}

/**
 * Configuration options for CacheService
 */
export interface CacheConfig {
  /** Maximum number of entries (default: 1000) */
  maxSize?: number;
  /** Default TTL in milliseconds (default: 5 minutes) */
  defaultTTL?: number;
  /** Enable automatic cleanup of expired entries (default: true) */
  autoCleanup?: boolean;
  /** Cleanup interval in milliseconds (default: 60 seconds) */
  cleanupInterval?: number;
  /** Enable detailed logging (default: false) */
  enableLogging?: boolean;
}

/**
 * @class CacheService
 * @description NestJS service for high-performance in-memory caching
 *
 * @example
 * ```typescript
 * // In a service
 * constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly cacheService: CacheService
  ) {
    super({
      serviceName: 'CacheService',
      logger,
      enableAuditLogging: true,
    });
  }
 *
 * async getStudent(id: string): Promise<Student> {
 *   const cacheKey = `student:${id}`;
 *   const cached = this.cacheService.get<Student>(cacheKey);
 *   if (cached) return cached;
 *
 *   const student = await this.studentRepository.findOne(id);
 *   this.cacheService.set(cacheKey, student, 300000, ['student', `student:${id}`]);
 *   return student;
 * }
 * ```
 */
@Injectable()
export class CacheService implements OnModuleDestroy {
  /** Internal cache storage using Map for O(1) operations */
  private cache: Map<string, CacheEntry<any>>;

  /** Tag index for efficient tag-based invalidation */
  private tagIndex: Map<string, Set<string>>;

  /** Cache statistics */
  private stats: {
    hits: number;
    misses: number;
    evictions: number;
  };

  /** Configuration */
  private config: Required<CacheConfig>;

  /** Cleanup interval timer */
  private cleanupTimer?: NodeJS.Timeout;

  /**
   * Creates a new CacheService instance
   * AppConfigService is optional to support direct instantiation in tests
   */
  constructor(
    @Optional() @Inject(AppConfigService) private readonly appConfig?: AppConfigService,
  ) {
    this.cache = new Map();
    this.tagIndex = new Map();
    this.stats = { hits: 0, misses: 0, evictions: 0 };

    // Apply default configuration
    this.config = {
      maxSize: this.appConfig
        ? this.appConfig.get<number>('cache.maxSize', 1000)
        : 1000,
      defaultTTL: this.appConfig
        ? this.appConfig.get<number>('cache.defaultTTL', 300000)
        : 300000,
      autoCleanup: true,
      cleanupInterval: 60000,
      enableLogging: this.appConfig
        ? this.appConfig.get<boolean>('cache.logging', false)
        : false,
    };

    // Start automatic cleanup if enabled
    if (this.config.autoCleanup) {
      this.startCleanup();
    }
  }

  /**
   * Lifecycle hook - cleanup on module destroy
   */
  onModuleDestroy(): void {
    this.destroy();
  }

  /**
   * Retrieves data from cache
   * @param key - Cache key
   * @returns Cached data or null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      this.log('MISS', key);
      return null;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Entry expired - remove it
      this.invalidateByKey(key);
      this.stats.misses++;
      this.log('MISS (expired)', key);
      return null;
    }

    // Update last access time for LRU
    entry.lastAccess = now;
    this.stats.hits++;
    this.log('HIT', key);

    return entry.data as T;
  }

  /**
   * Stores data in cache with optional TTL and tags
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time-to-live in milliseconds (optional, uses default)
   * @param tags - Tags for group invalidation (optional)
   */
  set<T>(key: string, data: T, ttl?: number, tags: string[] = []): void {
    // Check if we need to evict entries (LRU)
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttl: ttl ?? this.config.defaultTTL,
      tags,
      lastAccess: now,
    };

    // Remove old entry from tag index if exists
    if (this.cache.has(key)) {
      this.removeFromTagIndex(key);
    }

    // Store entry
    this.cache.set(key, entry);

    // Update tag index
    tags.forEach((tag) => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    });

    this.log('SET', key, `TTL: ${entry.ttl}ms, Tags: [${tags.join(', ')}]`);
  }

  /**
   * Invalidates a specific cache entry by key
   * @param key - Cache key to invalidate
   * @returns True if entry was found and removed
   */
  invalidateByKey(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    // Remove from tag index
    this.removeFromTagIndex(key);

    // Remove from cache
    this.cache.delete(key);
    this.log('INVALIDATE (key)', key);

    return true;
  }

  /**
   * Invalidates all cache entries with a specific tag
   * @param tag - Tag to invalidate
   * @returns Number of entries invalidated
   */
  invalidateByTag(tag: string): number {
    const keys = this.tagIndex.get(tag);
    if (!keys || keys.size === 0) {
      return 0;
    }

    let count = 0;
    // Create array to avoid mutation during iteration
    const keysArray = Array.from(keys);

    keysArray.forEach((key) => {
      if (this.invalidateByKey(key)) {
        count++;
      }
    });

    this.log('INVALIDATE (tag)', tag, `Removed ${count} entries`);
    return count;
  }

  /**
   * Clears all cache entries
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.tagIndex.clear();
    this.log('CLEAR', 'all', `Removed ${size} entries`);
  }

  /**
   * Returns cache statistics
   * @returns Cache statistics object
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;

    // Estimate memory usage (rough approximation)
    let memoryUsage = 0;
    this.cache.forEach((entry) => {
      // Rough estimate: JSON size of data + metadata overhead
      const dataSize = JSON.stringify(entry.data).length * 2; // 2 bytes per char
      const metadataSize = 100; // Approximate overhead for timestamps, tags, etc.
      memoryUsage += dataSize + metadataSize;
    });

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage,
    };
  }

  /**
   * Resets cache statistics
   */
  resetStats(): void {
    this.stats = { hits: 0, misses: 0, evictions: 0 };
    this.log('RESET', 'stats');
  }

  /**
   * Checks if a key exists in cache (without updating access time)
   * @param key - Cache key
   * @returns True if key exists and not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    // Check expiration
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      return false;
    }

    return true;
  }

  /**
   * Returns all cache keys
   * @returns Array of cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Returns all tags
   * @returns Array of tags
   */
  tags(): string[] {
    return Array.from(this.tagIndex.keys());
  }

  /**
   * Cleans up expired entries
   * @returns Number of entries removed
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    const keysToRemove: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToRemove.push(key);
      }
    });

    keysToRemove.forEach((key) => {
      this.invalidateByKey(key);
      removed++;
    });

    if (removed > 0) {
      this.log('CLEANUP', `Removed ${removed} expired entries`);
    }

    return removed;
  }

  /**
   * Stops automatic cleanup timer
   */
  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
      this.log('CLEANUP', 'Stopped automatic cleanup');
    }
  }

  /**
   * Destroys the cache service and cleans up resources
   */
  destroy(): void {
    this.stopCleanup();
    this.clear();
    this.log('DESTROY', 'Cache service destroyed');
  }

  // Private methods

  /**
   * Starts automatic cleanup timer
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);

    this.log(
      'CLEANUP',
      `Started automatic cleanup (interval: ${this.config.cleanupInterval}ms)`,
    );
  }

  /**
   * Evicts least recently used entry to make room for new entry
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestAccess = Date.now();

    // Find entry with oldest last access time
    this.cache.forEach((entry, key) => {
      if (entry.lastAccess < oldestAccess) {
        oldestAccess = entry.lastAccess;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.invalidateByKey(oldestKey);
      this.stats.evictions++;
      this.log('EVICT (LRU)', oldestKey);
    }
  }

  /**
   * Removes key from tag index
   */
  private removeFromTagIndex(key: string): void {
    const entry = this.cache.get(key);
    if (!entry) {
      return;
    }

    entry.tags.forEach((tag) => {
      const tagKeys = this.tagIndex.get(tag);
      if (tagKeys) {
        tagKeys.delete(key);
        // Remove tag from index if no more keys
        if (tagKeys.size === 0) {
          this.tagIndex.delete(tag);
        }
      }
    });
  }

  /**
   * Logs cache operations if logging is enabled
   */
  private log(operation: string, key: string, details?: string): void {
    if (!this.config.enableLogging) {
      return;
    }

    const timestamp = new Date().toISOString();
    const message = details
      ? `[${timestamp}] CACHE ${operation}: ${key} - ${details}`
      : `[${timestamp}] CACHE ${operation}: ${key}`;

    console.log(message);
  }
}

/**
 * Default export for convenience
 */
export default CacheService;
