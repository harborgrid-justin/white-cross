/**
 * @fileoverview Cache Operations Service
 * @module infrastructure/cache/operations
 * @description Handles advanced cache operations including batch operations and numeric operations
 *
 * Responsibilities:
 * - Batch get/set/delete operations (mget, mset, mdel)
 * - Increment/decrement operations for counters
 * - TTL management for numeric operations
 */

import { Injectable, Logger } from '@nestjs/common';
import { CacheConfigService } from './cache.config';
import { CacheConnectionService } from './cache-connection.service';
import type { CacheOptions } from './cache.interfaces';

import { BaseService } from '../../common/base';
/**
 * Service responsible for advanced cache operations
 */
@Injectable()
export class CacheOperationsService extends BaseService {
  private stats = {
    errors: 0,
  };

  constructor(
    private readonly cacheConfig: CacheConfigService,
    private readonly connectionService: CacheConnectionService,
  ) {}

  /**
   * Increment numeric value in Redis
   *
   * @param key - Cache key
   * @param amount - Amount to increment (default: 1)
   * @param options - Cache options
   * @returns New value after increment
   * @throws Error if Redis is not connected
   */
  async increment(key: string, amount = 1, options: CacheOptions = {}): Promise<number> {
    const fullKey = this.cacheConfig.buildKey(key, options.namespace);

    try {
      const redis = this.connectionService.getClient();
      if (!redis) {
        const error = new Error(`Redis not connected - cannot increment key: ${fullKey}`);
        this.logWarning(error.message, {
          key: fullKey,
          amount,
          redisStatus: 'disconnected',
          recommendation: 'Check Redis connection configuration and ensure Redis server is running',
        });
        this.stats.errors++;
        throw error;
      }

      const result = await redis.incrby(fullKey, amount);

      // Set TTL if specified
      if (options.ttl) {
        await redis.expire(fullKey, options.ttl);
      }

      return result;
    } catch (error) {
      this.logError(`Cache increment error for key ${fullKey}:`, {
        error: error.message,
        key: fullKey,
        amount,
        redisConnected: this.connectionService.isConnected(),
      });
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * Decrement numeric value in Redis
   *
   * @param key - Cache key
   * @param amount - Amount to decrement (default: 1)
   * @param options - Cache options
   * @returns New value after decrement
   * @throws Error if Redis is not connected
   */
  async decrement(key: string, amount = 1, options: CacheOptions = {}): Promise<number> {
    const fullKey = this.cacheConfig.buildKey(key, options.namespace);

    try {
      const redis = this.connectionService.getClient();
      if (!redis) {
        const error = new Error(`Redis not connected - cannot decrement key: ${fullKey}`);
        this.logWarning(error.message, {
          key: fullKey,
          amount,
          redisStatus: 'disconnected',
          recommendation: 'Check Redis connection configuration and ensure Redis server is running',
        });
        this.stats.errors++;
        throw error;
      }

      const result = await redis.decrby(fullKey, amount);

      // Set TTL if specified
      if (options.ttl) {
        await redis.expire(fullKey, options.ttl);
      }

      return result;
    } catch (error) {
      this.logError(`Cache decrement error for key ${fullKey}:`, {
        error: error.message,
        key: fullKey,
        amount,
        redisConnected: this.connectionService.isConnected(),
      });
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * Get multiple keys at once (batch operation)
   *
   * @param keys - Array of cache keys
   * @param options - Cache options
   * @param getCallback - Callback to get individual keys
   * @returns Array of values (null for missing keys)
   */
  async mget<T = any>(
    keys: string[],
    options: CacheOptions,
    getCallback: (key: string, options: CacheOptions) => Promise<T | null>,
  ): Promise<Array<T | null>> {
    const results: Array<T | null> = [];

    for (const key of keys) {
      try {
        const value = await getCallback(key, options);
        results.push(value);
      } catch (error) {
        this.logError(`Batch get error for key ${key}:`, error);
        results.push(null);
        this.stats.errors++;
      }
    }

    return results;
  }

  /**
   * Set multiple keys at once (batch operation)
   *
   * @param entries - Array of key-value pairs
   * @param options - Cache options
   * @param setCallback - Callback to set individual keys
   */
  async mset<T = any>(
    entries: Array<{ key: string; value: T }>,
    options: CacheOptions,
    setCallback: (key: string, value: T, options: CacheOptions) => Promise<void>,
  ): Promise<void> {
    for (const entry of entries) {
      try {
        await setCallback(entry.key, entry.value, options);
      } catch (error) {
        this.logError(`Batch set error for key ${entry.key}:`, error);
        this.stats.errors++;
      }
    }
  }

  /**
   * Delete multiple keys at once (batch operation)
   *
   * @param keys - Array of cache keys
   * @param options - Cache options
   * @param deleteCallback - Callback to delete individual keys
   * @returns Number of keys successfully deleted
   */
  async mdel(
    keys: string[],
    options: CacheOptions,
    deleteCallback: (key: string, options: CacheOptions) => Promise<boolean>,
  ): Promise<number> {
    let count = 0;

    for (const key of keys) {
      try {
        const deleted = await deleteCallback(key, options);
        if (deleted) {
          count++;
        }
      } catch (error) {
        this.logError(`Batch delete error for key ${key}:`, error);
        this.stats.errors++;
      }
    }

    return count;
  }

  /**
   * Get error count
   */
  getErrorCount(): number {
    return this.stats.errors;
  }

  /**
   * Reset error count
   */
  resetErrorCount(): void {
    this.stats.errors = 0;
  }
}
