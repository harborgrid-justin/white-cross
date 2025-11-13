/**
 * @fileoverview Cache Tier Manager Service
 * @module health-record/services/cache
 * @description Manages multi-tier cache operations (L1, L2, L3)
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import {
  InMemoryCacheEntry,
  CacheTier,
  ComplianceLevel,
  CacheOperationResult,
} from './cache-interfaces';
import { CACHE_CONSTANTS } from './cache-constants';

import { BaseService } from '@/common/base';
@Injectable()
export class CacheTierManagerService extends BaseService {
  private readonly l1Cache = new Map<string, InMemoryCacheEntry>();
  private readonly maxL1Size = CACHE_CONSTANTS.L1_MAX_SIZE;

  constructor(
    @Inject(CACHE_MANAGER) private readonly redisCache: Cache,
  ) {}

  getFromL1<T>(key: string): T | null {
    const entry = this.l1Cache.get(key);
    if (!entry) return null;
    entry.accessCount++;
    entry.lastAccessed = new Date();
    return entry.data as T;
  }

  async getFromL2<T>(key: string, compliance: ComplianceLevel): Promise<CacheOperationResult<T>> {
    const startTime = Date.now();
    try {
      const cacheKey = this.buildL2CacheKey(key, compliance);
      const cachedData = await this.redisCache.get(cacheKey);
      if (!cachedData) {
        return { success: false, responseTime: Date.now() - startTime };
      }
      const entry = JSON.parse(cachedData as string) as InMemoryCacheEntry<T>;
      if (this.isCacheEntryExpired(entry)) {
        await this.redisCache.del(cacheKey);
        return { success: false, responseTime: Date.now() - startTime };
      }
      return {
        success: true,
        data: entry.data,
        responseTime: Date.now() - startTime,
        tier: CacheTier.L2,
      };
    } catch (error) {
      this.logError(`L2 cache get failed for key ${key}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
      };
    }
  }

  async getFromL3<T>(key: string, compliance: ComplianceLevel): Promise<CacheOperationResult<T>> {
    // TODO: Implement L3 cache with proper database integration
    return { success: false, responseTime: 0 };
  }

  setInL1<T>(key: string, entry: InMemoryCacheEntry<T>): CacheOperationResult<void> {
    const startTime = Date.now();
    try {
      if (this.l1Cache.size >= this.maxL1Size) {
        this.evictLeastImportantL1Entry();
      }
      this.l1Cache.set(key, entry);
      return {
        success: true,
        responseTime: Date.now() - startTime,
        tier: CacheTier.L1,
      };
    } catch (error) {
      this.logError(`L1 cache set failed for key ${key}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
      };
    }
  }

  async setInL2<T>(key: string, entry: InMemoryCacheEntry<T>, ttl: number): Promise<CacheOperationResult<void>> {
    const startTime = Date.now();
    try {
      const cacheKey = this.buildL2CacheKey(key, entry.compliance);
      const serializedEntry = JSON.stringify(entry);
      await this.redisCache.set(cacheKey, serializedEntry, ttl * 1000);
      return {
        success: true,
        responseTime: Date.now() - startTime,
        tier: CacheTier.L2,
      };
    } catch (error) {
      this.logError(`L2 cache set failed for key ${key}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
      };
    }
  }

  async setInL3<T>(key: string, entry: InMemoryCacheEntry<T>, ttl: number): Promise<CacheOperationResult<void>> {
    // TODO: Implement L3 cache with proper database integration
    return { success: true, responseTime: 0, tier: CacheTier.L3 };
  }

  promoteToL1<T>(key: string, data: T, compliance: ComplianceLevel): CacheOperationResult<void> {
    const startTime = Date.now();
    try {
      if (this.l1Cache.size >= this.maxL1Size) {
        this.evictLeastImportantL1Entry();
      }
      const entry: InMemoryCacheEntry<T> = {
        data,
        timestamp: new Date(),
        accessCount: 1,
        lastAccessed: new Date(),
        compliance,
        encrypted: compliance === ComplianceLevel.PHI || compliance === ComplianceLevel.SENSITIVE_PHI,
        tags: [],
        size: this.calculateDataSize(data),
        tier: CacheTier.L1,
      };
      this.l1Cache.set(key, entry);
      return {
        success: true,
        responseTime: Date.now() - startTime,
        tier: CacheTier.L1,
      };
    } catch (error) {
      this.logError(`L1 promotion failed for key ${key}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
      };
    }
  }

  determineBestTier(key: string, dataSize: number, compliance: ComplianceLevel): CacheTier {
    if (compliance === ComplianceLevel.PHI || compliance === ComplianceLevel.SENSITIVE_PHI) {
      return dataSize < CACHE_CONSTANTS.SIZE_THRESHOLDS.SMALL_DATA ? CacheTier.L1 : CacheTier.L2;
    }
    if (dataSize > CACHE_CONSTANTS.SIZE_THRESHOLDS.LARGE_DATA) return CacheTier.L3;
    if (dataSize > CACHE_CONSTANTS.SIZE_THRESHOLDS.MEDIUM_DATA) return CacheTier.L2;
    return CacheTier.L1;
  }

  getL1Stats() {
    return {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: this.l1Cache.size,
      memoryUsage: this.calculateL1MemoryUsage(),
    };
  }

  private calculateL1MemoryUsage(): number {
    let total = 0;
    for (const entry of this.l1Cache.values()) {
      total += entry.size;
    }
    return total;
  }

  private calculateDataSize(data: unknown): number {
    try {
      return JSON.stringify(data).length;
    } catch {
      return 0;
    }
  }

  private buildL2CacheKey(key: string, compliance: ComplianceLevel): string {
    const prefix = compliance === ComplianceLevel.PHI || compliance === ComplianceLevel.SENSITIVE_PHI
      ? CACHE_CONSTANTS.KEY_PREFIXES.L2_PHI
      : CACHE_CONSTANTS.KEY_PREFIXES.L2_PUBLIC;
    return `${prefix}${key}`;
  }

  private buildL3CacheKey(key: string, compliance: ComplianceLevel): string {
    const prefix = compliance === ComplianceLevel.PHI || compliance === ComplianceLevel.SENSITIVE_PHI
      ? CACHE_CONSTANTS.KEY_PREFIXES.L3_PHI
      : CACHE_CONSTANTS.KEY_PREFIXES.L3_PUBLIC;
    return `${prefix}${key}`;
  }

  private isCacheEntryExpired(entry: InMemoryCacheEntry): boolean {
    const maxAge = CACHE_CONSTANTS.METRICS.MAX_AGE;
    return Date.now() - entry.timestamp.getTime() > maxAge;
  }

  private evictLeastImportantL1Entry(): void {
    if (this.l1Cache.size === 0) return;
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    for (const [key, entry] of this.l1Cache.entries()) {
      if (entry.lastAccessed.getTime() < oldestTime) {
        oldestTime = entry.lastAccessed.getTime();
        oldestKey = key;
      }
    }
    if (oldestKey) {
      this.l1Cache.delete(oldestKey);
    }
  }

  clearL1Cache(): void {
    this.l1Cache.clear();
  }
}
