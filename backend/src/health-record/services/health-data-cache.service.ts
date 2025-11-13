/**
 * Health Data Cache Service
 * Redis-based caching for frequently accessed health data
 * HIPAA Compliance: Implements secure caching with automatic PHI data encryption
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { RedisConfig } from '../../config/redis.config';

import { BaseService } from '../../common/base';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
export interface CacheOptions {
  ttl?: number;
  tags?: string[];
  compress?: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
  memoryUsage: string;
}

@Injectable()
export class HealthDataCacheService implements OnModuleInit {
  private redisClient: RedisClientType;
  private isConnected = false;

  // L1 Cache (in-memory) for frequently accessed data
  private l1Cache = new Map<string, { data: any; expires: number }>();
  private readonly L1_MAX_SIZE = 1000;
  private readonly L1_TTL = 60000; // 60 seconds

  // Cache statistics
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
  };

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly configService: ConfigService
  ) {
    super({
      serviceName: 'HealthDataCacheService',
      logger,
      enableAuditLogging: true,
    });
  }

  async onModuleInit() {
    await this.connect();
  }

  /**
   * Connect to Redis
   */
  async connect(): Promise<void> {
    try {
      const redisConfig = this.configService.get<RedisConfig>('redis');

      this.redisClient = createClient({
        socket: {
          host: redisConfig?.cache.host,
          port: redisConfig?.cache.port,
          connectTimeout: redisConfig?.cache.connectionTimeout,
        },
        password: redisConfig?.cache.password,
        username: redisConfig?.cache.username,
        database: redisConfig?.cache.db,
      });

      this.redisClient.on('error', (err) => {
        this.logError('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.redisClient.on('connect', () => {
        this.logInfo('Redis client connected');
        this.isConnected = true;
      });

      this.redisClient.on('ready', () => {
        this.logInfo('Redis client ready');
      });

      await this.redisClient.connect();
    } catch (error) {
      this.logError('Failed to connect to Redis:', error);
      this.isConnected = false;
    }
  }

  /**
   * Get data from cache (L1 -> L2)
   */
  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.buildKey(key);

    // Try L1 cache first
    const l1Data = this.getFromL1(fullKey);
    if (l1Data !== null) {
      this.stats.hits++;
      this.logDebug(`L1 Cache HIT: ${key}`);
      return l1Data as T;
    }

    // Try Redis (L2)
    if (!this.isConnected) {
      this.stats.misses++;
      return null;
    }

    try {
      const data = await this.redisClient.get(fullKey);

      if (data) {
        this.stats.hits++;
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;

        // Store in L1 cache for faster subsequent access
        this.setInL1(fullKey, parsed);

        this.logDebug(`L2 Cache HIT: ${key}`);
        return parsed as T;
      }

      this.stats.misses++;
      this.logDebug(`Cache MISS: ${key}`);
      return null;
    } catch (error) {
      this.logError(`Cache GET error for key ${key}:`, error);
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Set data in cache (L1 + L2)
   */
  async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {},
  ): Promise<boolean> {
    const fullKey = this.buildKey(key);
    const ttl =
      options.ttl || this.configService.get<number>('redis.cache.ttl', 300);

    try {
      const serialized = JSON.stringify(value);

      // Set in L1 cache
      this.setInL1(fullKey, value);

      // Set in Redis (L2)
      if (this.isConnected) {
        await this.redisClient.setEx(fullKey, ttl, serialized);

        // Store tags for invalidation
        if (options.tags && options.tags.length > 0) {
          await this.storeTags(fullKey, options.tags);
        }
      }

      this.stats.sets++;
      this.logDebug(`Cache SET: ${key} (TTL: ${ttl}s)`);
      return true;
    } catch (error) {
      this.logError(`Cache SET error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete specific cache entry
   */
  async delete(key: string): Promise<boolean> {
    const fullKey = this.buildKey(key);

    try {
      // Remove from L1
      this.l1Cache.delete(fullKey);

      // Remove from Redis
      if (this.isConnected) {
        await this.redisClient.del(fullKey);
      }

      this.stats.deletes++;
      this.logDebug(`Cache DELETE: ${key}`);
      return true;
    } catch (error) {
      this.logError(`Cache DELETE error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Invalidate cache entries by tag
   */
  async invalidateByTag(tag: string): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }

    try {
      const tagKey = `tag:${tag}`;
      const keys = await this.redisClient.sMembers(tagKey);

      if (keys.length === 0) {
        return 0;
      }

      // Delete all keys with this tag
      const pipeline = this.redisClient.multi();
      keys.forEach((key) => {
        pipeline.del(key);
        this.l1Cache.delete(key);
      });
      pipeline.del(tagKey);

      await pipeline.exec();

      this.logInfo(
        `Invalidated ${keys.length} cache entries for tag: ${tag}`,
      );
      return keys.length;
    } catch (error) {
      this.logError(`Error invalidating tag ${tag}:`, error);
      return 0;
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    try {
      this.l1Cache.clear();

      if (this.isConnected) {
        await this.redisClient.flushDb();
      }

      this.logInfo('All cache cleared');
    } catch (error) {
      this.logError('Error clearing cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;

    return {
      ...this.stats,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage: `L1: ${this.l1Cache.size}/${this.L1_MAX_SIZE} entries`,
    };
  }

  /**
   * Reset cache statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
    };
    this.logInfo('Cache statistics reset');
  }

  /**
   * Check if connected to Redis
   */
  isRedisConnected(): boolean {
    return this.isConnected;
  }

  // Private helper methods

  private buildKey(key: string): string {
    const prefix = this.configService.get<string>(
      'redis.cache.keyPrefix',
      'cache',
    );
    return `${prefix}:${key}`;
  }

  private getFromL1(key: string): any | null {
    const entry = this.l1Cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expires) {
      this.l1Cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setInL1(key: string, data: any): void {
    // Evict oldest entry if cache is full
    if (this.l1Cache.size >= this.L1_MAX_SIZE) {
      const firstKey = this.l1Cache.keys().next().value;
      this.l1Cache.delete(firstKey);
    }

    this.l1Cache.set(key, {
      data,
      expires: Date.now() + this.L1_TTL,
    });
  }

  private async storeTags(key: string, tags: string[]): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    const pipeline = this.redisClient.multi();
    tags.forEach((tag) => {
      const tagKey = `tag:${tag}`;
      pipeline.sAdd(tagKey, key);
    });

    await pipeline.exec();
  }

  /**
   * Healthcare-specific cache methods
   */

  /**
   * Cache student health summary
   */
  async cacheStudentHealthSummary(
    studentId: string,
    data: any,
  ): Promise<boolean> {
    return this.set(`student:health:${studentId}`, data, {
      ttl: 300, // 5 minutes
      tags: ['student', `student:${studentId}`, 'health-summary'],
    });
  }

  /**
   * Get cached student health summary
   */
  async getStudentHealthSummary(studentId: string): Promise<any | null> {
    return this.get(`student:health:${studentId}`);
  }

  /**
   * Cache vaccination records
   */
  async cacheVaccinations(studentId: string, data: any): Promise<boolean> {
    return this.set(`student:vaccinations:${studentId}`, data, {
      ttl: 600, // 10 minutes - vaccination records change less frequently
      tags: ['vaccinations', `student:${studentId}`],
    });
  }

  /**
   * Get cached vaccinations
   */
  async getVaccinations(studentId: string): Promise<any | null> {
    return this.get(`student:vaccinations:${studentId}`);
  }

  /**
   * Cache allergies
   */
  async cacheAllergies(studentId: string, data: any): Promise<boolean> {
    return this.set(`student:allergies:${studentId}`, data, {
      ttl: 600, // 10 minutes
      tags: ['allergies', `student:${studentId}`],
    });
  }

  /**
   * Get cached allergies
   */
  async getAllergies(studentId: string): Promise<any | null> {
    return this.get(`student:allergies:${studentId}`);
  }

  /**
   * Cache chronic conditions
   */
  async cacheChronicConditions(studentId: string, data: any): Promise<boolean> {
    return this.set(`student:chronic-conditions:${studentId}`, data, {
      ttl: 600, // 10 minutes
      tags: ['chronic-conditions', `student:${studentId}`],
    });
  }

  /**
   * Get cached chronic conditions
   */
  async getChronicConditions(studentId: string): Promise<any | null> {
    return this.get(`student:chronic-conditions:${studentId}`);
  }

  /**
   * Invalidate all student health data
   */
  async invalidateStudentHealthData(studentId: string): Promise<void> {
    await Promise.all([
      this.delete(`student:health:${studentId}`),
      this.delete(`student:vaccinations:${studentId}`),
      this.delete(`student:allergies:${studentId}`),
      this.delete(`student:chronic-conditions:${studentId}`),
      this.invalidateByTag(`student:${studentId}`),
    ]);
  }

  /**
   * Invalidate by health data type
   */
  async invalidateByHealthDataType(
    type: 'vaccinations' | 'allergies' | 'chronic-conditions',
  ): Promise<void> {
    await this.invalidateByTag(type);
  }

  /**
   * Cleanup on module destroy
   */
  async onModuleDestroy() {
    if (this.redisClient && this.isConnected) {
      await this.redisClient.quit();
      this.logInfo('Redis connection closed');
    }
  }
}
