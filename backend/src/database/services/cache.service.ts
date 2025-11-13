/**
 * Cache Service Implementation
 * Injectable NestJS service implementing ICacheManager interface
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheConfig, CacheStats, ICacheManager } from '../interfaces/cache/cache-manager.interface';

import { BaseService } from '../../common/base';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
@Injectable()
export class CacheService implements ICacheManager {
  private readonly cache: Map<string, { value: any; expiry: number }>;
  private stats: { hits: number; misses: number };
  private readonly config: CacheConfig;

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly configService: ConfigService
  ) {
    super({
      serviceName: 'CacheService',
      logger,
      enableAuditLogging: true,
    });

    this.cache = new Map();
    this.stats = { hits: 0, misses: 0
  };

    // Load cache configuration
    this.config = {
      enabled: this.configService.get<boolean>('cache.enabled', true),
      defaultTTL: this.configService.get<number>('cache.defaultTTL', 900),
      encryptPHI: this.configService.get<boolean>('cache.encryptPHI', false),
      auditCacheAccess: this.configService.get<boolean>(
        'cache.auditCacheAccess',
        false,
      ),
      allowedEntityTypes: this.configService.get<string[]>(
        'cache.allowedEntityTypes',
        [],
      ),
      maxCacheSize: this.configService.get<number>('cache.maxCacheSize', 100),
      evictionPolicy: this.configService.get<string>(
        'cache.evictionPolicy',
        'LRU',
      ),
    };

    this.logInfo('Cache service initialized (In-Memory implementation)');
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.config.enabled) {
      return null;
    }

    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    const expiry = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expiry });

    // Simple eviction if cache is too large
    if (this.cache.size > this.config.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async deletePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
    this.logDebug(
      `Deleted ${keysToDelete.length} keys matching pattern: ${pattern}`,
    );
  }

  async exists(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  async mset(entries: Array<[string, any, number]>): Promise<void> {
    for (const [key, value, ttl] of entries) {
      await this.set(key, value, ttl);
    }
  }

  async mget<T>(keys: string[]): Promise<Array<T | null>> {
    const results: Array<T | null> = [];
    for (const key of keys) {
      results.push(await this.get<T>(key));
    }
    return results;
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
    this.logWarning('Cache cleared');
  }

  async getStats(): Promise<CacheStats> {
    const { hits, misses } = this.stats;
    const total = hits + misses;
    const hitRate = total > 0 ? (hits / total) * 100 : 0;

    return {
      hits,
      misses,
      keyCount: this.cache.size,
      memoryUsage: 0, // Estimate if needed
      hitRate,
    };
  }
}
