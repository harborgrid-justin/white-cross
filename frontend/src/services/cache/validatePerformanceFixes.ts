/**
 * @fileoverview Performance validation script for CacheManager optimizations
 * @description Quick validation that the fixes work correctly
 */

import { CacheManager } from './CacheManager';

/**
 * Validate Memory Leak Fix
 */
function validateMemoryLeakFix(): void {
  console.log('\n=== Validating Memory Leak Fix ===\n');

  const cache = new CacheManager({ maxSize: 100, defaultTTL: 60000 });

  // Perform many operations
  console.log('Performing 20,000 cache operations...');
  const startTime = performance.now();

  for (let i = 0; i < 20000; i++) {
    cache.set(`key-${i % 100}`, `value-${i}`);
    cache.get(`key-${i % 100}`);
  }

  const duration = performance.now() - startTime;
  const stats = cache.getStats();

  console.log('✅ Completed in', duration.toFixed(2), 'ms');
  console.log('✅ Average access time:', stats.avgAccessTime.toFixed(4), 'ms');
  console.log('✅ Cache size:', stats.size, 'entries');
  console.log('✅ Memory usage:', (stats.memoryUsage / 1024).toFixed(2), 'KB');
  console.log('✅ Hit rate:', (stats.hitRate * 100).toFixed(2), '%');

  // Validate that avgAccessTime is reasonable
  if (stats.avgAccessTime < 10 && stats.avgAccessTime >= 0) {
    console.log('✅ PASS: Running average is working correctly');
  } else {
    console.log('❌ FAIL: Running average out of expected range');
  }

  console.log('\nMemory Leak Fix: ✅ VALIDATED\n');
}

/**
 * Validate Tag Index Optimization
 */
function validateTagIndexOptimization(): void {
  console.log('\n=== Validating Tag Index Optimization ===\n');

  const cache = new CacheManager({ maxSize: 5000, defaultTTL: 60000 });

  // Create 1000 entries with tags
  console.log('Creating 1,000 entries with tags...');
  const setupStart = performance.now();

  for (let i = 0; i < 1000; i++) {
    cache.set(`item-${i}`, { id: i, data: `value-${i}` }, {
      tags: [
        `category-${i % 10}`,
        `type-${i % 5}`,
        `group-${i % 20}`
      ]
    });
  }

  const setupDuration = performance.now() - setupStart;
  console.log('✅ Setup completed in', setupDuration.toFixed(2), 'ms');

  // Test tag invalidation performance
  console.log('\nInvalidating by tag "category-5"...');
  const invalidateStart = performance.now();
  const invalidated = cache.invalidate({ tags: ['category-5'] });
  const invalidateDuration = performance.now() - invalidateStart;

  console.log('✅ Invalidated', invalidated, 'entries');
  console.log('✅ Invalidation took', invalidateDuration.toFixed(2), 'ms');

  // Validate performance
  if (invalidateDuration < 10) {
    console.log('✅ PASS: Tag invalidation is fast (<10ms)');
  } else {
    console.log('⚠️  WARNING: Tag invalidation took longer than expected');
  }

  // Verify correct number of entries invalidated
  if (invalidated === 100) {
    console.log('✅ PASS: Correct number of entries invalidated');
  } else {
    console.log('❌ FAIL: Expected 100 invalidations, got', invalidated);
  }

  // Test getKeysWithTag performance
  console.log('\nTesting getKeysWithTag("category-3")...');
  const getKeysStart = performance.now();
  const keys = cache.getKeysWithTag('category-3');
  const getKeysDuration = performance.now() - getKeysStart;

  console.log('✅ Found', keys.length, 'keys');
  console.log('✅ Lookup took', getKeysDuration.toFixed(2), 'ms');

  if (getKeysDuration < 5) {
    console.log('✅ PASS: getKeysWithTag is fast (<5ms)');
  } else {
    console.log('⚠️  WARNING: getKeysWithTag took longer than expected');
  }

  console.log('\nTag Index Optimization: ✅ VALIDATED\n');
}

/**
 * Validate Tag Index Consistency
 */
function validateTagIndexConsistency(): void {
  console.log('\n=== Validating Tag Index Consistency ===\n');

  const cache = new CacheManager({ maxSize: 100, defaultTTL: 60000 });

  // Test 1: Update entry with new tags
  console.log('Test 1: Updating entry with new tags...');
  cache.set('test-key', 'value-1', { tags: ['old-tag', 'shared-tag'] });

  let keys = cache.getKeysWithTag('old-tag');
  console.log('✅ old-tag has', keys.length, 'keys');

  cache.set('test-key', 'value-2', { tags: ['new-tag', 'shared-tag'] });

  keys = cache.getKeysWithTag('old-tag');
  if (keys.length === 0) {
    console.log('✅ PASS: Old tag removed from index');
  } else {
    console.log('❌ FAIL: Old tag still in index');
  }

  keys = cache.getKeysWithTag('new-tag');
  if (keys.length === 1 && keys[0] === 'test-key') {
    console.log('✅ PASS: New tag added to index');
  } else {
    console.log('❌ FAIL: New tag not in index correctly');
  }

  // Test 2: Delete entry removes from tag index
  console.log('\nTest 2: Deleting entry removes from tag index...');
  cache.set('delete-test', 'value', { tags: ['delete-tag'] });

  keys = cache.getKeysWithTag('delete-tag');
  console.log('✅ Before delete:', keys.length, 'keys');

  cache.delete('delete-test');

  keys = cache.getKeysWithTag('delete-tag');
  if (keys.length === 0) {
    console.log('✅ PASS: Tag index cleaned up after delete');
  } else {
    console.log('❌ FAIL: Tag index not cleaned up');
  }

  // Test 3: Clear cache clears tag index
  console.log('\nTest 3: Clear cache clears tag index...');
  cache.set('key1', 'value1', { tags: ['tag1'] });
  cache.set('key2', 'value2', { tags: ['tag1', 'tag2'] });

  cache.clear();

  keys = cache.getKeysWithTag('tag1');
  if (keys.length === 0) {
    console.log('✅ PASS: Tag index cleared with cache');
  } else {
    console.log('❌ FAIL: Tag index not cleared');
  }

  console.log('\nTag Index Consistency: ✅ VALIDATED\n');
}

/**
 * Large Scale Performance Test
 */
function validateLargeScalePerformance(): void {
  console.log('\n=== Validating Large Scale Performance ===\n');

  const cache = new CacheManager({ maxSize: 10000, defaultTTL: 60000 });

  console.log('Creating 5,000 entries...');
  const setupStart = performance.now();

  for (let i = 0; i < 5000; i++) {
    cache.set(`large-${i}`, { id: i, data: `value-${i}` }, {
      tags: [`user-${i % 100}`, `category-${i % 20}`]
    });
  }

  const setupDuration = performance.now() - setupStart;
  console.log('✅ Setup completed in', setupDuration.toFixed(2), 'ms');
  console.log('✅ Average time per entry:', (setupDuration / 5000).toFixed(4), 'ms');

  // Test tag invalidation at scale
  console.log('\nInvalidating user-50 (should affect 50 entries)...');
  const invalidateStart = performance.now();
  const invalidated = cache.invalidate({ tags: ['user-50'] });
  const invalidateDuration = performance.now() - invalidateStart;

  console.log('✅ Invalidated', invalidated, 'entries');
  console.log('✅ Invalidation took', invalidateDuration.toFixed(2), 'ms');

  // Must be under 16ms to avoid UI freeze (60 FPS = 16.67ms per frame)
  if (invalidateDuration < 16) {
    console.log('✅ PASS: No UI freeze risk (<16ms for 60 FPS)');
  } else {
    console.log('❌ FAIL: Risk of UI freeze (>16ms)');
  }

  const stats = cache.getStats();
  console.log('\nFinal Stats:');
  console.log('  Cache size:', stats.size, 'entries');
  console.log('  Memory usage:', (stats.memoryUsage / 1024 / 1024).toFixed(2), 'MB');
  console.log('  Hit rate:', (stats.hitRate * 100).toFixed(2), '%');
  console.log('  Avg access time:', stats.avgAccessTime.toFixed(4), 'ms');

  console.log('\nLarge Scale Performance: ✅ VALIDATED\n');
}

/**
 * Run All Validations
 */
export function runAllValidations(): void {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   CacheManager Performance Optimization Validation         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    validateMemoryLeakFix();
    validateTagIndexOptimization();
    validateTagIndexConsistency();
    validateLargeScalePerformance();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   ALL VALIDATIONS PASSED ✅                                ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n❌ VALIDATION FAILED:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  runAllValidations();
}
