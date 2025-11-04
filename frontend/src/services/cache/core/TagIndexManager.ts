/**
 * Tag Index Manager
 *
 * @module services/cache/core/TagIndexManager
 * @internal
 *
 * Manages tag-based indexing for O(1) tag lookups and efficient
 * tag-based cache invalidation.
 */

import type { ITagIndexManager } from './types';

/**
 * Tag Index Manager Implementation
 *
 * @class
 * @implements {ITagIndexManager}
 *
 * Maintains a reverse index mapping tags to cache keys for fast lookups.
 *
 * Data Structure:
 * ```
 * Map<tag, Set<key>>
 * Example: {
 *   "users": Set(["user:1", "user:2", "user-list"]),
 *   "students": Set(["student:1", "student:2"])
 * }
 * ```
 *
 * Performance:
 * - O(1) tag lookup
 * - O(m) insertion where m = number of tags
 * - O(m) deletion where m = number of tags
 * - Automatic cleanup of empty tag sets
 *
 * Memory Management:
 * - Removes empty tag sets to prevent memory bloat
 * - Uses Set for O(1) key existence checks
 *
 * @example
 * ```typescript
 * const manager = new TagIndexManager();
 * manager.addToIndex('user:123', ['users', 'active']);
 * const keys = manager.getKeysWithTag('users'); // ['user:123']
 * ```
 */
export class TagIndexManager implements ITagIndexManager {
  private tagIndex: Map<string, Set<string>> = new Map();

  /**
   * Add Key to Tag Index
   *
   * Associates a cache key with multiple tags for fast retrieval.
   *
   * @param key - Cache key
   * @param tags - Array of tags to associate with key
   *
   * @example
   * ```typescript
   * manager.addToIndex('student:456', ['students', 'active', 'grade-10']);
   * ```
   */
  addToIndex(key: string, tags: string[]): void {
    tags.forEach((tag) => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    });
  }

  /**
   * Remove Key from Tag Index
   *
   * Removes a cache key from all specified tags. Cleans up empty tag sets
   * to prevent memory bloat.
   *
   * @param key - Cache key
   * @param tags - Array of tags to remove key from
   *
   * @example
   * ```typescript
   * manager.removeFromIndex('student:456', ['students', 'active']);
   * ```
   */
  removeFromIndex(key: string, tags: string[]): void {
    tags.forEach((tag) => {
      const taggedKeys = this.tagIndex.get(tag);
      if (taggedKeys) {
        taggedKeys.delete(key);
        // Clean up empty tag sets to prevent memory bloat
        if (taggedKeys.size === 0) {
          this.tagIndex.delete(tag);
        }
      }
    });
  }

  /**
   * Get All Keys with Specific Tag
   *
   * Returns all cache keys associated with a tag. O(1) lookup time.
   *
   * @param tag - Tag to query
   * @returns Array of cache keys with this tag
   *
   * @example
   * ```typescript
   * const activeStudents = manager.getKeysWithTag('active');
   * console.log(`Found ${activeStudents.length} active students in cache`);
   * ```
   */
  getKeysWithTag(tag: string): string[] {
    const taggedKeys = this.tagIndex.get(tag);
    return taggedKeys ? Array.from(taggedKeys) : [];
  }

  /**
   * Clear All Tag Indexes
   *
   * Removes all tag mappings. Used during cache clear operations.
   *
   * @example
   * ```typescript
   * manager.clear();
   * ```
   */
  clear(): void {
    this.tagIndex.clear();
  }
}
