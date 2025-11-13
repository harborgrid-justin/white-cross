/**
 * @fileoverview Redis-based Distributed Cache Service
 * @module infrastructure/cache/service
 * @description Enterprise-grade caching with Redis, multi-tier support, compression,
 * tag-based invalidation, and comprehensive monitoring
 *
 * Features:
 * - Redis integration with automatic reconnection
 * - Multi-tier caching (L1: memory, L2: Redis)
 * - Tag-based and pattern-based cache invalidation
 * - Automatic compression for large values
 * - Type-safe operations with generics
 * - Connection pooling and health monitoring
 * - Detailed statistics and metrics
 * - Graceful degradation on Redis failure
 */

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CacheConfigService } from './cache.config';
import { CacheConnectionService } from './cache-connection.service';
import { CacheStorageService } from './cache-storage.service';
import { CacheSerializationService } from './cache-serialization.service';
import { CacheInvalidationService } from './cache-invalidation.service';
import { CacheOperationsService } from './cache-operations.service';
import type {
  CacheHealth,
  CacheOptions,
  CacheStats,
  InvalidationPattern,
} from './cache.interfaces';
import { CacheEvent } from './cache.interfaces';
import { BaseService } from '@/common/base';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import {
  Cleanup,
  GCSchedule,
  HighPerformance,
  ImmediateCleanup,
  MemoryIntensive,
  MemoryMonitoring,
  MemorySensitive,
  ResourcePool,
} from '@/discovery/modules';

/**
 * Redis cache service with multi-tier support
 * Enhanced with Discovery Service memory optimization patterns
 *
 * This is the main orchestrator service that delegates to specialized services:
 * - CacheConnectionService: Redis connection management
 * - CacheStorageService: L1/L2 storage operations
 * - CacheSerializationService: Serialization and compression
 * - CacheInvalidationService: Tag and pattern-based invalidation
 * - CacheOperationsService: Batch and numeric operations
 */
@HighPerformance()
@GCSchedule({
  gcTriggerThreshold: 256, // 256MB
  aggressiveGcThreshold: 512, // 512MB
  maxRequestsBeforeGC: 10000,
  timeBasedGC: true,
  gcInterval: 300000, // 5 minutes
  priority: 'critical',
  leakDetectionEnabled: true,
  preventiveGC: true,
})
@MemoryIntensive({
  enabled: true,
  threshold: 200, // 200MB
  priority: 'high',
  cleanupStrategy: 'aggressive',
  monitoring: true,
})
@ResourcePool({
  enabled: true,
  resourceType: 'connection',
  minSize: 2,
  maxSize: 20,
  priority: 9,
  validationEnabled: true,
  autoScale: true,
})
@MemoryMonitoring({
  enabled: true,
  interval: 30000, // 30 seconds
  threshold: 150, // 150MB
  alerts: true,
})
@Injectable()
export class CacheService extends BaseService implements OnModuleInit, OnModuleDestroy {
  private stats: {
    hits: number;
    misses: number;
    l1Hits: number;
    l2Hits: number;
    sets: number;
    deletes: number;
    errors: number;
    getTotalLatency: number;
    setTotalLatency: number;
  };
  private startTime: number;

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly cacheConfig: CacheConfigService,
    private readonly connectionService: CacheConnectionService,
    private readonly storageService: CacheStorageService,
    private readonly serializationService: CacheSerializationService,
    private readonly invalidationService: CacheInvalidationService,
    private readonly operationsService: CacheOperationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super({
      serviceName: 'CacheService',
      logger,
      enableAuditLogging: true,
    });

    this.stats = {
      hits: 0,
      misses: 0,
      l1Hits: 0,
      l2Hits: 0,
      sets: 0,
      deletes: 0,
      errors: 0,
      getTotalLatency: 0,
      setTotalLatency: 0,
  };
    this.startTime = Date.now();
  }

  /**
   * Initialize Redis connection and L1 cache cleanup
   */
  async onModuleInit(): Promise<void> {
    try {
      this.cacheConfig.validate();
      await this.connectionService.connect();
      this.storageService.startCleanup();
      this.logInfo(
        `Cache service initialized: ${JSON.stringify(this.cacheConfig.getSummary())}`,
      );
    } catch (error) {
      this.logError('Failed to initialize cache service', error);
    }
  }

  /**
   * Cleanup on module destroy
   */
  async onModuleDestroy(): Promise<void> {
    this.storageService.stopCleanup();
    await this.connectionService.disconnect();
    this.invalidationService.clearTagIndex();
    this.logInfo('Cache service destroyed');
  }

  /**
   * Get value from cache
   * @param key - Cache key
   * @param options - Cache options
   * @returns Cached value or null
   */
  @MemorySensitive(50) // 50MB threshold for cleanup
  async get<T = any>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const startTime = Date.now();
    const fullKey = this.cacheConfig.buildKey(key, options.namespace);

    try {
      // Try L1 cache first (if enabled and not skipped)
      if (this.cacheConfig.isL1CacheEnabled() && !options.skipL1) {
        const l1Result = this.storageService.getFromL1<T>(fullKey);
        if (l1Result !== null) {
          this.stats.hits++;
          this.stats.l1Hits++;
          this.stats.getTotalLatency += Date.now() - startTime;
          this.emitEvent(CacheEvent.HIT, fullKey, { source: 'L1' });
          return l1Result;
        }
      }

      // Try L2 (Redis) cache
      const l2Result = await this.storageService.getFromL2<T>(fullKey);
      if (l2Result !== null) {
        this.stats.hits++;
        this.stats.l2Hits++;
        this.stats.getTotalLatency += Date.now() - startTime;
        this.emitEvent(CacheEvent.HIT, fullKey, { source: 'L2' });

        // Populate L1 cache
        if (this.cacheConfig.isL1CacheEnabled() && !options.skipL1) {
          this.storageService.setToL1(fullKey, l2Result, options);
        }

        return l2Result;
      }

      // Cache miss
      this.stats.misses++;
      this.stats.getTotalLatency += Date.now() - startTime;
      this.emitEvent(CacheEvent.MISS, fullKey);
      return null;
    } catch (error) {
      this.logError(`Cache get error for key ${fullKey}:`, error);
      this.stats.errors++;
      this.emitEvent(CacheEvent.ERROR, fullKey, { error });
      return null;
    }
  }

  /**
   * Set value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param options - Cache options
   *
   * @description Attempts to set value in both L2 (Redis) and L1 (memory) cache.
   * If Redis is unavailable, gracefully degrades to L1 cache only and logs warning.
   */
  @MemorySensitive(75) // 75MB threshold for memory-intensive set operations
  async set<T = any>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const startTime = Date.now();
    const fullKey = this.cacheConfig.buildKey(key, options.namespace);

    try {
      // Attempt to set in L2 (Redis) cache
      try {
        await this.storageService.setToL2(fullKey, value, options);
      } catch (redisError) {
        // Graceful degradation: log warning but continue with L1 cache
        if (!this.connectionService.isConnected()) {
          this.logWarning(`Redis unavailable, using L1 cache only for key: ${fullKey}`, {
            key: fullKey,
            cacheMode: 'L1-only',
            redisStatus: 'disconnected',
          });
        } else {
          // Redis exists but operation failed - log error
          this.logError(`Redis operation failed for key ${fullKey}:`, {
            error: redisError.message,
            key: fullKey,
          });
          this.stats.errors++;
          throw redisError;
        }
      }

      // Set in L1 cache (always attempt this as fallback)
      if (this.cacheConfig.isL1CacheEnabled() && !options.skipL1) {
        this.storageService.setToL1(fullKey, value, options);
      }

      // Update tag index
      if (options.tags && options.tags.length > 0) {
        this.invalidationService.indexTags(fullKey, options.tags);
      }

      this.stats.sets++;
      this.stats.setTotalLatency += Date.now() - startTime;
      this.emitEvent(CacheEvent.SET, fullKey, { tags: options.tags });
    } catch (error) {
      this.logError(`Cache set error for key ${fullKey}:`, {
        error: error.message,
        key: fullKey,
        redisConnected: this.connectionService.isConnected(),
        l1Enabled: this.cacheConfig.isL1CacheEnabled(),
      });
      this.stats.errors++;
      this.emitEvent(CacheEvent.ERROR, fullKey, { error });
      throw error;
    }
  }

  /**
   * Delete value from cache
   * @param key - Cache key
   * @param options - Cache options
   *
   * @description Deletes value from both L1 and L2 cache. If Redis is unavailable,
   * still deletes from L1 cache and returns true.
   */
  async delete(key: string, options: CacheOptions = {}): Promise<boolean> {
    const fullKey = this.cacheConfig.buildKey(key, options.namespace);

    try {
      // Delete from L1 cache
      this.storageService.deleteFromL1(fullKey);

      // Delete from L2 cache (Redis)
      if (this.connectionService.isConnected()) {
        try {
          await this.storageService.deleteFromL2(fullKey);
        } catch (redisError) {
          this.logWarning(`Redis delete failed for key ${fullKey}, L1 cache cleared`, {
            error: redisError.message,
            key: fullKey,
            l1Deleted: true,
          });
        }
      } else {
        this.logDebug(`Redis unavailable, deleted from L1 cache only: ${fullKey}`);
      }

      // Remove from tag index
      this.invalidationService.removeFromTagIndex(fullKey);

      this.stats.deletes++;
      this.emitEvent(CacheEvent.DELETE, fullKey);
      return true;
    } catch (error) {
      this.logError(`Cache delete error for key ${fullKey}:`, {
        error: error.message,
        key: fullKey,
        redisConnected: this.connectionService.isConnected(),
      });
      this.stats.errors++;
      this.emitEvent(CacheEvent.ERROR, fullKey, { error });
      return false;
    }
  }

  /**
   * Check if key exists in cache
   * @param key - Cache key
   * @param options - Cache options
   */
  async has(key: string, options: CacheOptions = {}): Promise<boolean> {
    const fullKey = this.cacheConfig.buildKey(key, options.namespace);

    // Check L1 cache
    if (this.storageService.hasInL1(fullKey)) {
      return true;
    }

    // Check L2 cache
    return await this.storageService.hasInL2(fullKey);
  }

  /**
   * Invalidate cache by pattern
   * @param pattern - Invalidation pattern
   */
  async invalidate(pattern: InvalidationPattern): Promise<number> {
    return await this.invalidationService.invalidate(pattern, (key) => this.delete(key, {}));
  }

  /**
   * Get multiple keys at once (batch operation)
   * @param keys - Array of cache keys
   * @param options - Cache options
   */
  async mget<T = any>(keys: string[], options: CacheOptions = {}): Promise<Array<T | null>> {
    return await this.operationsService.mget<T>(keys, options, (key, opts) =>
      this.get<T>(key, opts),
    );
  }

  /**
   * Set multiple keys at once (batch operation)
   * @param entries - Array of key-value pairs
   * @param options - Cache options
   */
  async mset<T = any>(
    entries: Array<{ key: string; value: T }>,
    options: CacheOptions = {},
  ): Promise<void> {
    await this.operationsService.mset<T>(entries, options, (key, value, opts) =>
      this.set(key, value, opts),
    );
  }

  /**
   * Delete multiple keys at once (batch operation)
   * @param keys - Array of cache keys
   * @param options - Cache options
   */
  async mdel(keys: string[], options: CacheOptions = {}): Promise<number> {
    return await this.operationsService.mdel(keys, options, (key, opts) => this.delete(key, opts));
  }

  /**
   * Increment numeric value
   * @param key - Cache key
   * @param amount - Amount to increment (default: 1)
   * @param options - Cache options
   * @throws Error if Redis is not connected and operation cannot be performed
   */
  async increment(key: string, amount = 1, options: CacheOptions = {}): Promise<number> {
    return await this.operationsService.increment(key, amount, options);
  }

  /**
   * Decrement numeric value
   * @param key - Cache key
   * @param amount - Amount to decrement (default: 1)
   * @param options - Cache options
   * @throws Error if Redis is not connected and operation cannot be performed
   */
  async decrement(key: string, amount = 1, options: CacheOptions = {}): Promise<number> {
    return await this.operationsService.decrement(key, amount, options);
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalOps = this.stats.hits + this.stats.misses;
    const hitRate = totalOps > 0 ? (this.stats.hits / totalOps) * 100 : 0;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      l1Hits: this.stats.l1Hits,
      l2Hits: this.stats.l2Hits,
      keys: this.storageService.getL1Size(),
      l1Size: this.storageService.getL1Size(),
      l2Size: -1, // Would need Redis INFO command
      avgGetLatency:
        totalOps > 0 ? Math.round((this.stats.getTotalLatency / totalOps) * 100) / 100 : 0,
      avgSetLatency:
        this.stats.sets > 0
          ? Math.round((this.stats.setTotalLatency / this.stats.sets) * 100) / 100
          : 0,
      totalOperations: totalOps + this.stats.sets + this.stats.deletes,
      failedOperations: this.stats.errors + this.operationsService.getErrorCount(),
      memoryUsage: this.storageService.getL1MemoryUsage(),
    };
  }

  /**
   * Reset cache statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      l1Hits: 0,
      l2Hits: 0,
      sets: 0,
      deletes: 0,
      errors: 0,
      getTotalLatency: 0,
      setTotalLatency: 0,
    };
    this.operationsService.resetErrorCount();
  }

  /**
   * Get cache health status
   */
  async getHealth(): Promise<CacheHealth> {
    const redisLatency = await this.connectionService.checkHealth();
    const redisConnected = this.connectionService.isConnected();

    const l1Status = !this.cacheConfig.isL1CacheEnabled()
      ? 'disabled'
      : this.storageService.getL1Size() >= this.cacheConfig.getConfig().l1MaxSize
        ? 'full'
        : 'ok';

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (redisConnected && l1Status !== 'full') {
      status = 'healthy';
    } else if (redisConnected || l1Status === 'ok') {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    const lastError = this.connectionService.getLastError();

    return {
      status,
      redisConnected,
      redisLatency,
      l1Status,
      recentErrors: this.stats.errors + this.operationsService.getErrorCount(),
      lastError: lastError?.message,
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  /**
   * Clear all cache (use with caution)
   */
  @ImmediateCleanup()
  @Cleanup('high')
  async clear(): Promise<void> {
    await this.storageService.clearAll();
    this.invalidationService.clearTagIndex();
    this.logWarning('Cache cleared');
  }

  /**
   * Emit cache event
   * @private
   */
  private emitEvent(event: CacheEvent, key: string, metadata?: Record<string, any>): void {
    this.eventEmitter.emit(event, {
      event,
      key,
      timestamp: Date.now(),
      metadata,
    });
  }
}
