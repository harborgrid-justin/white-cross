/**
 * Memory Size Estimation Utility
 *
 * @module services/cache/core/MemoryEstimator
 * @internal
 *
 * Provides memory size estimation for cache entries to enable
 * memory-based eviction and tracking.
 */

import type { IMemoryEstimator } from './types';

/**
 * Memory Estimator Implementation
 *
 * Estimates the memory footprint of cached data using JSON serialization.
 * Provides rough approximation for memory management decisions.
 *
 * @class
 * @implements {IMemoryEstimator}
 *
 * Algorithm:
 * - Serializes data to JSON string
 * - Estimates 2 bytes per character (UTF-16 encoding)
 * - Handles serialization failures gracefully
 *
 * Limitations:
 * - Approximation only (actual memory usage may vary)
 * - Does not account for V8 object overhead
 * - Circular references will cause errors
 */
export class MemoryEstimator implements IMemoryEstimator {
  /**
   * Estimate Size of Data in Bytes
   *
   * @param data - Data to estimate
   * @returns Estimated size in bytes
   *
   * @throws {Error} If data cannot be serialized (e.g., circular references)
   *
   * @example
   * ```typescript
   * const estimator = new MemoryEstimator();
   * const size = estimator.estimateSize({ name: 'John', age: 30 });
   * console.log(`Estimated size: ${size} bytes`);
   * ```
   */
  estimateSize(data: unknown): number {
    try {
      const json = JSON.stringify(data);
      // UTF-16 encoding: 2 bytes per character
      return json.length * 2;
    } catch (error) {
      // If serialization fails (e.g., circular references),
      // return conservative estimate
      console.warn('[MemoryEstimator] Failed to estimate size:', error);
      return 1024; // 1KB default estimate
    }
  }
}
