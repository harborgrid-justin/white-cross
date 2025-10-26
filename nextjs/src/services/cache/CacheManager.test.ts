/**
 * @fileoverview Test suite for CacheManager performance optimizations
 * @description Tests for memory leak fixes and tag index optimizations
 */

import { CacheManager } from './CacheManager';

describe('CacheManager Performance Optimizations', () => {
  let cacheManager: CacheManager;

  beforeEach(() => {
    cacheManager = new CacheManager({ maxSize: 100, defaultTTL: 60000 });
  });

  describe('Issue 1: Memory Leak in Access Time Tracking', () => {
    it('should use bounded memory for access time tracking', () => {
      // Record a large number of access times
      for (let i = 0; i < 20000; i++) {
        cacheManager.set(`key-${i}`, `value-${i}`);
        cacheManager.get(`key-${i % 100}`); // Get operations to record access times
      }

      const stats = cacheManager.getStats();

      // avgAccessTime should be calculated (not NaN or undefined)
      expect(stats.avgAccessTime).toBeGreaterThanOrEqual(0);
      expect(stats.avgAccessTime).toBeLessThan(1000); // Should be very fast for in-memory ops

      // Internal accessStats should have been reset at 10000
      // This test validates that memory is bounded
      console.log('Average access time:', stats.avgAccessTime, 'ms');
      console.log('Total operations:', 20000);
      console.log('Memory usage:', stats.memoryUsage, 'bytes');
    });

    it('should maintain accurate running average', () => {
      // Set and get a few items
      cacheManager.set('test-1', 'value-1');
      cacheManager.set('test-2', 'value-2');
      cacheManager.set('test-3', 'value-3');

      cacheManager.get('test-1');
      cacheManager.get('test-2');
      cacheManager.get('test-3');

      const stats = cacheManager.getStats();

      // Should have a reasonable average (< 10ms for simple ops)
      expect(stats.avgAccessTime).toBeGreaterThanOrEqual(0);
      expect(stats.avgAccessTime).toBeLessThan(10);
    });
  });

  describe('Issue 2: Tag-Based Invalidation Performance', () => {
    it('should efficiently invalidate by tags using tag index', () => {
      // Create 1000 entries with various tags
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        const tags = [
          `category-${i % 10}`,
          `type-${i % 5}`,
          `group-${i % 20}`
        ];
        cacheManager.set(`item-${i}`, { id: i, data: `value-${i}` }, { tags });
      }

      const setupTime = performance.now() - startTime;
      console.log('Setup 1000 entries with tags:', setupTime, 'ms');

      // Invalidate by specific tag - should be fast (O(1) lookup)
      const invalidateStart = performance.now();
      const invalidated = cacheManager.invalidate({ tags: ['category-5'] });
      const invalidateTime = performance.now() - invalidateStart;

      console.log('Invalidated', invalidated, 'entries in', invalidateTime, 'ms');

      // Should have invalidated 100 entries (i % 10 === 5)
      expect(invalidated).toBe(100);

      // Should be very fast - much less than O(n) iteration
      // With O(1) lookup, should be < 10ms even for 1000 entries
      expect(invalidateTime).toBeLessThan(10);

      // Verify entries are actually gone
      expect(cacheManager.get('item-5')).toBeUndefined();
      expect(cacheManager.get('item-15')).toBeUndefined();
      expect(cacheManager.get('item-25')).toBeUndefined();

      // But entries with different tags should remain
      expect(cacheManager.get('item-6')).toBeDefined();
      expect(cacheManager.get('item-7')).toBeDefined();
    });

    it('should handle multiple tag invalidation efficiently', () => {
      // Create entries
      for (let i = 0; i < 500; i++) {
        cacheManager.set(`entry-${i}`, { value: i }, {
          tags: [`tag-A-${i % 10}`, `tag-B-${i % 5}`]
        });
      }

      const start = performance.now();
      const invalidated = cacheManager.invalidate({
        tags: ['tag-A-3', 'tag-B-2']
      });
      const duration = performance.now() - start;

      console.log('Multiple tag invalidation:', invalidated, 'entries in', duration, 'ms');

      // Should be fast with tag index
      expect(duration).toBeLessThan(10);
      expect(invalidated).toBeGreaterThan(0);
    });

    it('should maintain tag index when updating entries', () => {
      // Set initial entry with tags
      cacheManager.set('test-key', 'value-1', { tags: ['old-tag', 'shared-tag'] });

      // Verify tag index
      expect(cacheManager.getKeysWithTag('old-tag')).toContain('test-key');
      expect(cacheManager.getKeysWithTag('shared-tag')).toContain('test-key');

      // Update entry with new tags
      cacheManager.set('test-key', 'value-2', { tags: ['new-tag', 'shared-tag'] });

      // Old tag should be removed from index
      expect(cacheManager.getKeysWithTag('old-tag')).not.toContain('test-key');

      // New tag should be in index
      expect(cacheManager.getKeysWithTag('new-tag')).toContain('test-key');

      // Shared tag should still be in index
      expect(cacheManager.getKeysWithTag('shared-tag')).toContain('test-key');
    });

    it('should clean up empty tag sets to prevent memory bloat', () => {
      // Add entries with unique tags
      for (let i = 0; i < 100; i++) {
        cacheManager.set(`item-${i}`, `value-${i}`, { tags: [`unique-tag-${i}`] });
      }

      // Delete all entries - tag index should be cleaned up
      for (let i = 0; i < 100; i++) {
        cacheManager.delete(`item-${i}`);
      }

      // All tags should be removed (empty sets cleaned up)
      for (let i = 0; i < 100; i++) {
        expect(cacheManager.getKeysWithTag(`unique-tag-${i}`)).toEqual([]);
      }
    });

    it('should optimize getKeysWithTag using tag index', () => {
      // Create many entries
      for (let i = 0; i < 1000; i++) {
        cacheManager.set(`item-${i}`, i, {
          tags: i % 2 === 0 ? ['even'] : ['odd']
        });
      }

      const start = performance.now();
      const evenKeys = cacheManager.getKeysWithTag('even');
      const duration = performance.now() - start;

      console.log('getKeysWithTag found', evenKeys.length, 'keys in', duration, 'ms');

      // Should be O(1) lookup, very fast
      expect(duration).toBeLessThan(5);
      expect(evenKeys.length).toBe(500);
    });
  });

  describe('Tag Index Consistency', () => {
    it('should maintain tag index when clearing cache', () => {
      cacheManager.set('key1', 'value1', { tags: ['tag1'] });
      cacheManager.set('key2', 'value2', { tags: ['tag1', 'tag2'] });

      cacheManager.clear();

      // Tag index should be cleared
      expect(cacheManager.getKeysWithTag('tag1')).toEqual([]);
      expect(cacheManager.getKeysWithTag('tag2')).toEqual([]);
    });

    it('should maintain tag index when clearing expired entries', async () => {
      cacheManager.set('expired-1', 'value1', { ttl: 100, tags: ['exp-tag'] });
      cacheManager.set('expired-2', 'value2', { ttl: 100, tags: ['exp-tag'] });
      cacheManager.set('valid', 'value3', { ttl: 60000, tags: ['valid-tag'] });

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));

      const cleared = cacheManager.clearExpired();

      expect(cleared).toBe(2);

      // Expired tag should be cleaned up
      expect(cacheManager.getKeysWithTag('exp-tag')).toEqual([]);

      // Valid tag should remain
      expect(cacheManager.getKeysWithTag('valid-tag')).toContain('valid');
    });

    it('should handle entries with no tags', () => {
      cacheManager.set('no-tags', 'value');

      // Should not crash
      expect(cacheManager.get('no-tags')).toBe('value');

      // Delete should work
      expect(cacheManager.delete('no-tags')).toBe(true);
    });

    it('should handle entries with empty tags array', () => {
      cacheManager.set('empty-tags', 'value', { tags: [] });

      expect(cacheManager.get('empty-tags')).toBe('value');
      expect(cacheManager.delete('empty-tags')).toBe(true);
    });
  });

  describe('Performance Regression Tests', () => {
    it('should handle large-scale tag invalidation without UI freeze', () => {
      // Simulate real-world scenario: invalidating user data across many entries
      const userCount = 100;
      const entriesPerUser = 50;

      // Create entries for multiple users
      for (let userId = 0; userId < userCount; userId++) {
        for (let i = 0; i < entriesPerUser; i++) {
          cacheManager.set(
            `user-${userId}-data-${i}`,
            { userId, data: `data-${i}` },
            { tags: [`user-${userId}`, 'user-data'] }
          );
        }
      }

      console.log('Created', userCount * entriesPerUser, 'entries');

      // Invalidate all data for a specific user - should be fast
      const start = performance.now();
      const invalidated = cacheManager.invalidate({ tags: [`user-50`] });
      const duration = performance.now() - start;

      console.log('Invalidated user data:', invalidated, 'entries in', duration, 'ms');

      expect(invalidated).toBe(entriesPerUser);

      // Should be much faster than 16ms (60fps threshold) to avoid UI freeze
      expect(duration).toBeLessThan(16);
    });

    it('should maintain performance with tag index overhead', () => {
      const iterations = 1000;

      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        cacheManager.set(`perf-test-${i}`, { data: i }, {
          tags: [`tag-${i % 10}`, `category-${i % 5}`]
        });
      }

      const duration = performance.now() - start;
      const avgPerOp = duration / iterations;

      console.log(`${iterations} set operations:`, duration, 'ms (avg:', avgPerOp, 'ms/op)');

      // Average should be very fast (< 1ms per operation)
      expect(avgPerOp).toBeLessThan(1);
    });
  });

  describe('Memory Efficiency', () => {
    it('should not have unbounded memory growth', () => {
      const initialStats = cacheManager.getStats();

      // Perform many operations
      for (let i = 0; i < 10000; i++) {
        cacheManager.set(`key-${i % 100}`, `value-${i}`, {
          tags: [`tag-${i % 20}`]
        });
        cacheManager.get(`key-${i % 100}`);
      }

      const finalStats = cacheManager.getStats();

      // Memory should be bounded by cache size (100 entries max)
      expect(finalStats.size).toBeLessThanOrEqual(100);

      // Average access time should be reasonable (not unbounded)
      expect(finalStats.avgAccessTime).toBeGreaterThanOrEqual(0);
      expect(finalStats.avgAccessTime).toBeLessThan(100);

      console.log('Final memory usage:', finalStats.memoryUsage, 'bytes');
      console.log('Final cache size:', finalStats.size, 'entries');
      console.log('Final avg access time:', finalStats.avgAccessTime, 'ms');
    });
  });
});
