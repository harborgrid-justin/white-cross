/**
 * SAN Testing Utilities - Main Export
 *
 * Central export point for all SAN testing utilities.
 * Import everything you need from this single file.
 *
 * @example
 * ```typescript
 * import {
 *   generateSANVolumeFixture,
 *   createE2ETestApp,
 *   runPerformanceTest
 * } from '@/reuse/san';
 * ```
 *
 * @module reuse/san
 */

// Re-export all utilities from the main kit
export * from './san-testing-utilities-kit';

// Re-export as default for convenience
import SANTestingUtilities from './san-testing-utilities-kit';
export default SANTestingUtilities;

/**
 * Quick access to common testing patterns
 */
export { SANTestingUtilities };

/**
 * Version information
 */
export const VERSION = '1.0.0';

/**
 * Metadata about the testing utilities
 */
export const METADATA = {
  version: VERSION,
  name: 'SAN Testing Utilities Kit',
  description: 'Comprehensive testing utilities for Storage Area Network (SAN) operations',
  author: 'White Cross Development Team',
  license: 'Proprietary',
  features: [
    'Type-safe test fixtures',
    'Mock data generators',
    'Unit testing utilities',
    'Integration testing utilities',
    'E2E testing utilities',
    'Performance testing utilities',
    'HIPAA compliance testing',
    'Jest integration',
    'Supertest integration',
  ],
  totalFunctions: 40,
};

/**
 * Helper function to get all available utilities
 */
export function getAvailableUtilities(): string[] {
  return Object.keys(SANTestingUtilities);
}

/**
 * Helper function to print usage information
 */
export function printUsageInfo(): void {
  console.log('\n=================================================');
  console.log('SAN Testing Utilities Kit');
  console.log('=================================================\n');
  console.log(`Version: ${METADATA.version}`);
  console.log(`Total Functions: ${METADATA.totalFunctions}`);
  console.log('\nFeatures:');
  METADATA.features.forEach((feature) => console.log(`  - ${feature}`));
  console.log('\nDocumentation:');
  console.log('  - README: reuse/san/SAN-TESTING-UTILITIES-README.md');
  console.log('  - Quick Reference: reuse/san/SAN-TESTING-QUICK-REFERENCE.md');
  console.log('  - Examples: reuse/san/san-testing-utilities-examples.spec.ts');
  console.log('\nUsage:');
  console.log('  import { generateSANVolumeFixture } from "@/reuse/san";\n');
}
