/**
 * Custom Jest Test Sequencer for SAN Testing
 *
 * This sequencer optimizes test execution order based on:
 * 1. Test file size (smaller files first for faster feedback)
 * 2. Previous test execution time (faster tests first)
 * 3. Test type (unit -> integration -> e2e)
 *
 * This provides faster feedback during development and CI/CD.
 */

const Sequencer = require('@jest/test-sequencer').default;
const fs = require('fs');
const path = require('path');

class SANTestSequencer extends Sequencer {
  /**
   * Sorts test files based on multiple criteria
   */
  sort(tests) {
    const copyTests = Array.from(tests);

    // Sort by multiple criteria
    return copyTests.sort((testA, testB) => {
      // 1. First priority: Test type (unit -> integration -> e2e)
      const typeA = this.getTestType(testA.path);
      const typeB = this.getTestType(testB.path);
      const typePriority = { unit: 1, integration: 2, e2e: 3, other: 4 };

      if (typePriority[typeA] !== typePriority[typeB]) {
        return typePriority[typeA] - typePriority[typeB];
      }

      // 2. Second priority: Previous execution time (if available)
      const durationA = testA.duration || 0;
      const durationB = testB.duration || 0;

      if (durationA !== durationB) {
        return durationA - durationB; // Faster tests first
      }

      // 3. Third priority: File size (smaller files first)
      const sizeA = this.getFileSize(testA.path);
      const sizeB = this.getFileSize(testB.path);

      if (sizeA !== sizeB) {
        return sizeA - sizeB;
      }

      // 4. Final fallback: Alphabetical order
      return testA.path.localeCompare(testB.path);
    });
  }

  /**
   * Determines test type based on file path and name
   */
  getTestType(testPath) {
    const fileName = path.basename(testPath);

    // E2E tests
    if (fileName.includes('.e2e.') || testPath.includes('/e2e/')) {
      return 'e2e';
    }

    // Integration tests
    if (
      fileName.includes('.integration.') ||
      fileName.includes('.int.') ||
      testPath.includes('/integration/')
    ) {
      return 'integration';
    }

    // Unit tests
    if (fileName.includes('.spec.') || fileName.includes('.test.')) {
      return 'unit';
    }

    return 'other';
  }

  /**
   * Gets file size in bytes
   */
  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      // If file doesn't exist or can't be read, return large number to deprioritize
      return Number.MAX_SAFE_INTEGER;
    }
  }

  /**
   * Shards tests for parallel execution
   * This is used when running tests across multiple workers
   */
  shard(tests, options) {
    const { shardIndex, shardCount } = options;
    const shardSize = Math.ceil(tests.length / shardCount);
    const shardStart = shardSize * (shardIndex - 1);
    const shardEnd = shardSize * shardIndex;

    return [...tests]
      .sort((a, b) => {
        // Distribute different test types across shards
        const typeA = this.getTestType(a.path);
        const typeB = this.getTestType(b.path);
        return typeA.localeCompare(typeB);
      })
      .slice(shardStart, shardEnd);
  }

  /**
   * Determines if test should run based on conditions
   * Can be used to skip certain tests based on environment
   */
  shouldRunTest(test) {
    // Skip performance tests in CI unless explicitly enabled
    if (
      process.env.CI &&
      !process.env.RUN_PERFORMANCE_TESTS &&
      test.path.includes('performance')
    ) {
      return false;
    }

    // Skip E2E tests in watch mode for faster feedback
    if (process.env.JEST_WATCH_MODE && this.getTestType(test.path) === 'e2e') {
      return false;
    }

    return true;
  }
}

module.exports = SANTestSequencer;
