/**
 * Cache Statistics Tracker
 *
 * @module services/cache/core/CacheStatistics
 * @internal
 *
 * Tracks and calculates cache performance metrics including hit/miss rates,
 * access times, and eviction counts.
 */

import type { IStatisticsTracker } from './types';

/**
 * Access Time Statistics
 *
 * Maintains running average to prevent unbounded memory growth.
 */
interface AccessStats {
  /** Total number of accesses tracked */
  count: number;
  /** Sum of all access times (for average calculation) */
  sum: number;
  /** Current running average */
  avg: number;
}

/**
 * Cache Statistics Tracker Implementation
 *
 * @class
 * @implements {IStatisticsTracker}
 *
 * Maintains comprehensive cache performance metrics:
 * - Hit/miss counts and rates
 * - Average access time (using running average)
 * - Eviction counts
 * - Invalidation counts
 *
 * Memory Optimization:
 * - Uses running average instead of storing all access times
 * - Prevents memory leaks from unbounded array growth
 * - Periodically resets counters to prevent numerical overflow
 *
 * Performance:
 * - O(1) for all operations
 * - No memory allocation during recording
 * - Weighted running average favors recent samples
 *
 * @example
 * ```typescript
 * const stats = new CacheStatistics();
 * stats.recordHit();
 * stats.recordAccessTime(5.2);
 * const current = stats.getStats();
 * console.log(`Hit rate: ${current.hitRate * 100}%`);
 * ```
 */
export class CacheStatistics implements IStatisticsTracker {
  private hits = 0;
  private misses = 0;
  private evictions = 0;
  private invalidations = 0;
  private accessStats: AccessStats = { count: 0, sum: 0, avg: 0 };

  /**
   * Record Cache Hit
   *
   * Increments hit counter for hit rate calculation.
   *
   * @example
   * ```typescript
   * stats.recordHit();
   * ```
   */
  recordHit(): void {
    this.hits++;
  }

  /**
   * Record Cache Miss
   *
   * Increments miss counter for hit rate calculation.
   *
   * @example
   * ```typescript
   * stats.recordMiss();
   * ```
   */
  recordMiss(): void {
    this.misses++;
  }

  /**
   * Record Access Time
   *
   * Updates running average of access times. Uses weighted average
   * to give more importance to recent samples while preventing
   * memory leaks from storing all values.
   *
   * Algorithm:
   * - Maintains running average with weight capped at 100 samples
   * - Resets periodically (after 10,000 samples) to prevent overflow
   * - O(1) time and space complexity
   *
   * @param duration - Access duration in milliseconds
   *
   * @example
   * ```typescript
   * const start = performance.now();
   * // ... cache operation ...
   * const duration = performance.now() - start;
   * stats.recordAccessTime(duration);
   * ```
   */
  recordAccessTime(duration: number): void {
    // Update running average without storing all values
    this.accessStats.count++;
    this.accessStats.sum += duration;

    // Calculate weighted running average (gives more weight to recent values)
    const weight = Math.min(100, this.accessStats.count); // Cap weight at 100 samples
    this.accessStats.avg =
      ((this.accessStats.avg * (weight - 1)) + duration) / weight;

    // Reset periodically to prevent numerical overflow
    if (this.accessStats.count > 10000) {
      this.accessStats.count = 100;
      this.accessStats.sum = this.accessStats.avg * 100;
    }
  }

  /**
   * Record Eviction
   *
   * Increments eviction counter.
   *
   * @example
   * ```typescript
   * stats.recordEviction();
   * ```
   */
  recordEviction(): void {
    this.evictions++;
  }

  /**
   * Record Invalidations
   *
   * Adds to invalidation counter (supports bulk invalidations).
   *
   * @param count - Number of entries invalidated
   *
   * @example
   * ```typescript
   * stats.recordInvalidations(5); // Invalidated 5 entries
   * ```
   */
  recordInvalidations(count: number): void {
    this.invalidations += count;
  }

  /**
   * Get Current Statistics
   *
   * Returns snapshot of current cache performance metrics.
   *
   * @returns Statistics object with hit rate calculated
   *
   * @example
   * ```typescript
   * const { hits, misses, hitRate, avgAccessTime } = stats.getStats();
   * console.log(`Hit Rate: ${(hitRate * 100).toFixed(2)}%`);
   * console.log(`Avg Access: ${avgAccessTime.toFixed(3)}ms`);
   * ```
   */
  getStats(): {
    hits: number;
    misses: number;
    hitRate: number;
    evictions: number;
    avgAccessTime: number;
    invalidations: number;
  } {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? this.hits / total : 0;

    return {
      hits: this.hits,
      misses: this.misses,
      hitRate,
      evictions: this.evictions,
      avgAccessTime: this.accessStats.avg,
      invalidations: this.invalidations
    };
  }

  /**
   * Reset All Statistics
   *
   * Clears all counters and resets to initial state.
   *
   * @example
   * ```typescript
   * stats.reset();
   * ```
   */
  reset(): void {
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
    this.invalidations = 0;
    this.accessStats = { count: 0, sum: 0, avg: 0 };
  }
}
