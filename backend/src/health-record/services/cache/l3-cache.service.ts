/**
 * @fileoverview L3 Cache Service - Database-based caching tier
 * @module health-record/services/cache
 * @description Database result cache with PHI compliance and audit logging
 *
 * HIPAA CRITICAL - This service manages PHI caching in database with compliance controls
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import * as crypto from 'crypto';
import { PHIAccessLogger } from '../phi-access-logger.service';
import { InMemoryCacheEntry, ComplianceLevel } from './cache-interfaces';
import { CacheEntry as CacheEntryModel   } from "../../database/models";

import { BaseService } from '@/common/base';
@Injectable()
export class L3CacheService extends BaseService {
  private stats = { hits: 0, misses: 0, queryTime: 0, size: 0 };

  constructor(
    private readonly phiLogger: PHIAccessLogger,
    @InjectModel(CacheEntryModel)
    private readonly cacheEntryModel: typeof CacheEntryModel,
  ) {}

  /**
   * Get data from L3 cache (Database result cache)
   */
  async get<T>(key: string, compliance: ComplianceLevel): Promise<T | null> {
    const startTime = Date.now();

    try {
      const cacheKey = this.buildCacheKey(key, compliance);

      // Find cache entry in database
      const cacheEntry = await this.cacheEntryModel.findOne({
        where: {
          cacheKey,
          expiresAt: {
            [Op.gt]: new Date(), // Not expired
          },
        },
      });

      if (!cacheEntry) {
        this.stats.misses++;
        this.stats.queryTime += Date.now() - startTime;
        return null;
      }

      // Update access statistics
      await cacheEntry.recordAccess();

      // Parse and return cached data
      const parsedData = cacheEntry.getParsedData<T>();
      if (parsedData === null) {
        this.logWarning(`L3 cache entry found but data parsing failed for key: ${key}`);
        this.stats.misses++;
        return null;
      }

      // Update metrics
      this.stats.hits++;
      this.stats.queryTime += Date.now() - startTime;
      this.stats.size++;

      // Log PHI access if applicable
      if (compliance === ComplianceLevel.PHI || compliance === ComplianceLevel.SENSITIVE_PHI) {
        this.phiLogger.logPHIAccess({
          correlationId: this.generateCorrelationId(),
          timestamp: new Date(),
          operation: 'CACHE_READ_L3',
          dataTypes: [this.extractDataType(key, cacheEntry.getParsedTags())],
          recordCount: 1,
          sensitivityLevel: compliance,
          ipAddress: 'internal',
          userAgent: 'cache-service',
          success: true,
        });
      }

      return parsedData;
    } catch (error) {
      this.logError(`L3 cache get failed for key ${key}:`, error);
      this.stats.misses++;
      this.stats.queryTime += Date.now() - startTime;
      return null;
    }
  }

  /**
   * Set data in L3 cache (Database)
   */
  async set<T>(key: string, entry: InMemoryCacheEntry<T>, ttl: number): Promise<void> {
    const startTime = Date.now();

    try {
      const cacheKey = this.buildCacheKey(key, entry.compliance);
      const expiresAt = new Date(Date.now() + ttl * 1000); // TTL in seconds
      const serializedData = JSON.stringify(entry.data);
      const serializedTags = JSON.stringify(entry.tags);
      const queryHash = this.generateQueryHash(key, entry.data);

      // Use upsert to handle both create and update cases
      await this.cacheEntryModel.upsert({
        cacheKey,
        data: serializedData,
        complianceLevel: entry.compliance,
        tags: serializedTags,
        expiresAt,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed,
        dataSize: entry.size,
        queryHash,
      });

      // Update metrics
      this.stats.size++;
      this.stats.queryTime += Date.now() - startTime;

      // Log PHI access if applicable
      if (
        entry.compliance === ComplianceLevel.PHI ||
        entry.compliance === ComplianceLevel.SENSITIVE_PHI
      ) {
        this.phiLogger.logPHIAccess({
          correlationId: this.generateCorrelationId(),
          timestamp: new Date(),
          operation: 'CACHE_WRITE_L3',
          dataTypes: [this.extractDataType(key, entry.tags)],
          recordCount: 1,
          sensitivityLevel: entry.compliance,
          ipAddress: 'internal',
          userAgent: 'cache-service',
          success: true,
        });
      }

      this.logDebug(
        `L3 cache entry stored: ${cacheKey}, size: ${entry.size} bytes, TTL: ${ttl}s`,
      );
    } catch (error) {
      this.logError(`L3 cache set failed for key ${key}:`, error);
    }
  }

  /**
   * Invalidate cache entries by pattern
   */
  async invalidate(pattern: string): Promise<number> {
    try {
      const deletedCount = await this.cacheEntryModel.destroy({
        where: {
          cacheKey: {
            [Op.like]: pattern.replace('*', '%'),
          },
        },
      });

      this.stats.size = Math.max(0, this.stats.size - deletedCount);
      this.logDebug(`L3 cache invalidated ${deletedCount} entries for pattern: ${pattern}`);

      return deletedCount;
    } catch (error) {
      this.logError(`L3 cache invalidation failed for pattern ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Clean up expired cache entries
   */
  async cleanupExpired(): Promise<number> {
    try {
      const deletedCount = await this.cacheEntryModel.destroy({
        where: {
          expiresAt: {
            [Op.lt]: new Date(), // Expired entries
          },
        },
      });

      if (deletedCount > 0) {
        this.logDebug(`Cleaned up ${deletedCount} expired L3 cache entries`);
        this.stats.size = Math.max(0, this.stats.size - deletedCount);
      }

      return deletedCount;
    } catch (error) {
      this.logError('Failed to cleanup expired L3 cache entries:', error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): any {
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      queryTime: this.stats.queryTime,
      size: this.stats.size,
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = { hits: 0, misses: 0, queryTime: 0, size: 0 };
  }

  /**
   * Get cache size
   */
  async getCacheSize(): Promise<number> {
    try {
      const count = await this.cacheEntryModel.count({
        where: {
          expiresAt: {
            [Op.gt]: new Date(), // Not expired
          },
        },
      });
      return count;
    } catch (error) {
      this.logError('Failed to get L3 cache size:', error);
      return 0;
    }
  }

  // Private helper methods
  private buildCacheKey(key: string, compliance: ComplianceLevel): string {
    const prefix =
      compliance === ComplianceLevel.PHI || compliance === ComplianceLevel.SENSITIVE_PHI
        ? 'l3:phi:'
        : 'l3:hr:';
    return `${prefix}${key}`;
  }

  private generateQueryHash(key: string, data: unknown): string {
    const queryString = `${key}:${JSON.stringify(data)}`;
    return crypto.createHash('sha256').update(queryString).digest('hex').substring(0, 16);
  }

  private generateCorrelationId(): string {
    return `l3-cache-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }

  private extractDataType(key: string, tags: string[]): string {
    if (tags && tags.length > 0) return tags[0];

    if (key.includes('allergies')) return 'ALLERGIES';
    if (key.includes('vaccinations')) return 'VACCINATIONS';
    if (key.includes('conditions')) return 'CONDITIONS';
    if (key.includes('vitals')) return 'VITALS';
    if (key.includes('summary')) return 'SUMMARY';

    return 'HEALTH_RECORD';
  }
}
