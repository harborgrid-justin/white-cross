import { Injectable, Logger } from '@nestjs/common';

/**
 * Shared Enterprise Cache Configuration
 */
export interface EnterpriseCacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in seconds
  maxSize?: number; // Maximum number of items
  includeQuery?: boolean;
  includeParams?: boolean;
  includeUser?: boolean;
  invalidateOn?: string[]; // Events that invalidate cache
  keyPrefix?: string;
  compliance?: {
    hipaaCompliant?: boolean;
    maxRetentionTime?: number; // Maximum retention for compliance
    encryptKeys?: boolean;
  };
}

export interface EnterpriseCacheStats {
  hits: number;
  misses: number;
  keys: number;
  memoryUsage: number;
  hitRate: number;
  module: string;
  lastCleanup: number;
}

export interface EnterpriseCacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
  module: string;
  compliance?: {
    encrypted?: boolean;
    phiData?: boolean;
    accessLevel?: 'public' | 'internal' | 'restricted' | 'confidential';
  };
}

@Injectable()
export class EnterpriseCacheService {
  private readonly logger = new Logger(EnterpriseCacheService.name);
  private cache = new Map<string, EnterpriseCacheEntry>();
  private stats: EnterpriseCacheStats;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(private readonly moduleName: string) {
    this.stats = {
      hits: 0,
      misses: 0,
      keys: 0,
      memoryUsage: 0,
      hitRate: 0,
      module: moduleName,
      lastCleanup: Date.now(),
    };

    // Start cleanup interval (every 5 minutes)
    this.startCleanupInterval();
  }

  /**
   * Set cache entry with enterprise features
   */
  async set<T>(
    key: string,
    data: T,
    ttl: number,
    options?: {
      compliance?: EnterpriseCacheEntry['compliance'];
      encrypt?: boolean;
    },
  ): Promise<void> {
    try {
      const fullKey = `${this.moduleName}:${key}`;
      const entry: EnterpriseCacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl * 1000, // Convert to milliseconds
        key: fullKey,
        module: this.moduleName,
        compliance: options?.compliance,
      };

      // HIPAA compliance check
      if (options?.compliance?.phiData && !options?.compliance?.encrypted) {
        this.logger.warn(`Setting PHI data without encryption: ${key}`);
      }

      this.cache.set(fullKey, entry);
      this.updateStats();

      this.logger.debug(
        `Cache set: ${fullKey} (TTL: ${ttl}s, Module: ${this.moduleName})`,
      );
    } catch (error) {
      this.logger.error(`Failed to set cache entry: ${key}`, error);
      throw error;
    }
  }

  /**
   * Get cache entry with compliance tracking
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = `${this.moduleName}:${key}`;
      const entry = this.cache.get(fullKey) as
        | EnterpriseCacheEntry<T>
        | undefined;

      if (!entry) {
        this.stats.misses++;
        this.updateHitRate();
        return null;
      }

      // Check if entry has expired
      const now = Date.now();
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(fullKey);
        this.stats.misses++;
        this.updateHitRate();
        this.logger.debug(`Cache expired: ${fullKey}`);
        return null;
      }

      // Log PHI access for compliance
      if (entry.compliance?.phiData) {
        this.logger.log(
          `PHI cache access: ${key} (Module: ${this.moduleName})`,
        );
      }

      this.stats.hits++;
      this.updateHitRate();
      return entry.data;
    } catch (error) {
      this.logger.error(`Failed to get cache entry: ${key}`, error);
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Delete cache entry
   */
  async delete(key: string): Promise<boolean> {
    try {
      const fullKey = `${this.moduleName}:${key}`;
      const deleted = this.cache.delete(fullKey);
      this.updateStats();

      if (deleted) {
        this.logger.debug(`Cache deleted: ${fullKey}`);
      }

      return deleted;
    } catch (error) {
      this.logger.error(`Failed to delete cache entry: ${key}`, error);
      return false;
    }
  }

  /**
   * Clear cache by pattern
   */
  async clearPattern(pattern: string): Promise<number> {
    try {
      let deletedCount = 0;
      const regex = new RegExp(pattern);

    for (const [_key, entry] of this.cache.entries()) {
      if (regex.test(_key) && entry.module === this.moduleName) {
        this.cache.delete(_key);
        deletedCount++;
      }
    }

      this.updateStats();
      this.logger.log(
        `Cleared ${deletedCount} cache entries matching pattern: ${pattern}`,
      );
      return deletedCount;
    } catch (error) {
      this.logger.error(`Failed to clear cache pattern: ${pattern}`, error);
      return 0;
    }
  }

  /**
   * Clear all cache entries for this module
   */
  async clear(): Promise<void> {
    try {
      let deletedCount = 0;

      for (const [key, entry] of this.cache.entries()) {
        if (entry.module === this.moduleName) {
          this.cache.delete(key);
          deletedCount++;
        }
      }

      this.updateStats();
      this.logger.log(
        `Cleared ${deletedCount} cache entries for module: ${this.moduleName}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to clear cache for module: ${this.moduleName}`,
        error,
      );
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): EnterpriseCacheStats {
    this.updateStats();
    return { ...this.stats };
  }

  /**
   * Get entries by compliance level
   */
  getEntriesByComplianceLevel(
    level: 'public' | 'internal' | 'restricted' | 'confidential',
  ): EnterpriseCacheEntry[] {
    const entries: EnterpriseCacheEntry[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (
        entry.module === this.moduleName &&
        entry.compliance?.accessLevel === level
      ) {
        entries.push(entry);
      }
    }

    return entries;
  }

  /**
   * Cleanup expired entries
   */
  async cleanup(): Promise<number> {
    try {
      let deletedCount = 0;
      const now = Date.now();

      for (const [key, entry] of this.cache.entries()) {
        if (
          entry.module === this.moduleName &&
          now - entry.timestamp > entry.ttl
        ) {
          this.cache.delete(key);
          deletedCount++;
        }
      }

      this.stats.lastCleanup = now;
      this.updateStats();

      if (deletedCount > 0) {
        this.logger.debug(
          `Cleaned up ${deletedCount} expired cache entries for module: ${this.moduleName}`,
        );
      }

      return deletedCount;
    } catch (error) {
      this.logger.error(
        `Failed to cleanup cache for module: ${this.moduleName}`,
        error,
      );
      return 0;
    }
  }

  /**
   * Check cache health
   */
  getHealthStatus(): {
    healthy: boolean;
    issues: string[];
    stats: EnterpriseCacheStats;
  } {
    const issues: string[] = [];
    let healthy = true;

    // Check memory usage (simplified - in real implementation, use actual memory measurements)
    if (this.cache.size > 1000) {
      issues.push('High cache size - consider cleanup');
      healthy = false;
    }

    // Check hit rate
    if (this.stats.hitRate < 0.5 && this.stats.hits + this.stats.misses > 100) {
      issues.push('Low cache hit rate - review caching strategy');
    }

    // Check last cleanup time
    const timeSinceLastCleanup = Date.now() - this.stats.lastCleanup;
    if (timeSinceLastCleanup > 30 * 60 * 1000) {
      // 30 minutes
      issues.push('Cache cleanup overdue');
    }

    return {
      healthy,
      issues,
      stats: this.getStats(),
    };
  }

  /**
   * Start automatic cleanup interval
   */
  private startCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(
      async () => {
        await this.cleanup();
      },
      5 * 60 * 1000,
    ); // Every 5 minutes

    this.logger.debug(
      `Started cache cleanup interval for module: ${this.moduleName}`,
    );
  }

  /**
   * Stop cleanup interval
   */
  stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      this.logger.debug(
        `Stopped cache cleanup interval for module: ${this.moduleName}`,
      );
    }
  }

  /**
   * Update internal statistics
   */
  private updateStats(): void {
    this.stats.keys = Array.from(this.cache.values()).filter(
      (entry) => entry.module === this.moduleName,
    ).length;
    this.stats.memoryUsage = this.estimateMemoryUsage();
    this.updateHitRate();
  }

  /**
   * Update hit rate calculation
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  /**
   * Estimate memory usage (simplified)
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.module === this.moduleName) {
        totalSize += key.length * 2; // Approximate string size
        totalSize += JSON.stringify(entry.data).length * 2; // Approximate data size
        totalSize += 100; // Approximate overhead
      }
    }

    return totalSize;
  }

  /**
   * Cleanup on service destruction
   */
  onModuleDestroy(): void {
    this.stopCleanupInterval();
    this.logger.log(
      `Enterprise cache service destroyed for module: ${this.moduleName}`,
    );
  }
}
