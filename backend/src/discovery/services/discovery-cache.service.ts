import { Injectable, Logger } from '@nestjs/common';
import { CacheConfig, CacheStats, CacheEntry } from '../interfaces/cache-config.interface';

@Injectable()
export class DiscoveryCacheService {
  private readonly logger = new Logger(DiscoveryCacheService.name);
  private cache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    keys: 0,
    memoryUsage: 0,
    hitRate: 0,
  };
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Start cleanup process every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  /**
   * Get a value from cache
   */
  async get<T = any>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now > entry.timestamp + (entry.ttl * 1000)) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    this.stats.hits++;
    this.updateHitRate();
    return entry.data as T;
  }

  /**
   * Set a value in cache
   */
  async set<T = any>(key: string, data: T, ttl: number = 300): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      key,
    };

    this.cache.set(key, entry);
    this.updateStats();
    
    this.logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
  }

  /**
   * Delete a specific key from cache
   */
  async delete(key: string): Promise<boolean> {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.updateStats();
      this.logger.debug(`Cache deleted: ${key}`);
    }
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<number> {
    const count = this.cache.size;
    this.cache.clear();
    this.resetStats();
    this.logger.log(`Cache cleared: ${count} entries removed`);
    return count;
  }

  /**
   * Check if a key exists in cache
   */
  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now > entry.timestamp + (entry.ttl * 1000)) {
      this.cache.delete(key);
      this.updateStats();
      return false;
    }

    return true;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    this.updateStats();
    return { ...this.stats };
  }

  /**
   * Get hit rates by time window
   */
  async getHitRates(): Promise<Record<string, number>> {
    return {
      overall: this.stats.hitRate,
      // Could be extended to track time-windowed hit rates
    };
  }

  /**
   * Get all cache keys (for debugging)
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache entries count by prefix
   */
  getKeysByPrefix(prefix: string): string[] {
    return Array.from(this.cache.keys()).filter(key => key.startsWith(prefix));
  }

  /**
   * Invalidate cache entries by pattern
   */
  async invalidateByPattern(pattern: string | RegExp): Promise<number> {
    let invalidated = 0;
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        invalidated++;
      }
    }

    if (invalidated > 0) {
      this.updateStats();
      this.logger.log(`Cache invalidated by pattern: ${invalidated} entries`);
    }

    return invalidated;
  }

  /**
   * Get memory usage estimation
   */
  getMemoryUsage(): number {
    let totalSize = 0;
    
    for (const entry of this.cache.values()) {
      // Rough estimation of memory usage
      totalSize += JSON.stringify(entry).length * 2; // Assume 2 bytes per character
    }
    
    return totalSize;
  }

  /**
   * Set TTL for existing cache entry
   */
  async updateTTL(key: string, newTTL: number): Promise<boolean> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    entry.ttl = newTTL;
    entry.timestamp = Date.now(); // Reset timestamp to extend life
    
    this.logger.debug(`Cache TTL updated: ${key} (new TTL: ${newTTL}s)`);
    return true;
  }

  /**
   * Get cache entry metadata
   */
  getEntryMetadata(key: string): { ttl: number; age: number; expiresIn: number } | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;
    const expiresIn = (entry.timestamp + (entry.ttl * 1000)) - now;

    return {
      ttl: entry.ttl,
      age: Math.floor(age / 1000), // Age in seconds
      expiresIn: Math.max(0, Math.floor(expiresIn / 1000)), // Time until expiration in seconds
    };
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + (entry.ttl * 1000)) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.updateStats();
      this.logger.log(`Cache cleanup: ${cleanedCount} expired entries removed`);
    }
  }

  /**
   * Update cache statistics
   */
  private updateStats(): void {
    this.stats.keys = this.cache.size;
    this.stats.memoryUsage = this.getMemoryUsage();
    this.updateHitRate();
  }

  /**
   * Update hit rate calculation
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  /**
   * Reset statistics
   */
  private resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      keys: 0,
      memoryUsage: 0,
      hitRate: 0,
    };
  }
}
