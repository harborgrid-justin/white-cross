/**
 * LRU (Least Recently Used) Eviction Policy
 *
 * @module services/cache/core/LRUEvictionPolicy
 * @internal
 *
 * Implements LRU eviction strategy for cache management.
 * Evicts the entry with the oldest lastAccessed timestamp.
 */

import type { CacheEntry } from '../types';
import type { IEvictionPolicy } from './types';

/**
 * LRU Eviction Policy Implementation
 *
 * @class
 * @implements {IEvictionPolicy}
 *
 * Eviction Strategy:
 * - Scans all entries to find oldest lastAccessed timestamp
 * - O(n) time complexity where n = number of cached entries
 * - Simple and effective for general-purpose caching
 *
 * Performance Characteristics:
 * - Time Complexity: O(n) per eviction
 * - Space Complexity: O(1) - no additional data structures
 *
 * Trade-offs:
 * - Simple implementation
 * - No additional memory overhead
 * - Linear scan required (acceptable for caches < 1000 entries)
 *
 * @example
 * ```typescript
 * const policy = new LRUEvictionPolicy();
 * const evictedKey = policy.evict(cacheMap);
 * if (evictedKey) {
 *   console.log(`Evicted: ${evictedKey}`);
 * }
 * ```
 */
export class LRUEvictionPolicy implements IEvictionPolicy {
  /**
   * Evict Least Recently Used Entry
   *
   * Finds and returns the key of the entry with the oldest lastAccessed timestamp.
   * Does not actually remove the entry from the cache - caller is responsible
   * for deletion.
   *
   * @param cache - The cache Map to analyze
   * @returns The key to evict, or null if cache is empty
   *
   * @example
   * ```typescript
   * const keyToEvict = policy.evict(cache);
   * if (keyToEvict) {
   *   const entry = cache.get(keyToEvict);
   *   cache.delete(keyToEvict);
   *   // Update memory tracking, emit events, etc.
   * }
   * ```
   */
  evict(cache: Map<string, CacheEntry>): string | null {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    // Linear scan to find entry with oldest lastAccessed time
    for (const [key, entry] of cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    return lruKey;
  }
}
