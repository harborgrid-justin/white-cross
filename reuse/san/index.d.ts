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
export * from './san-testing-utilities-kit';
import SANTestingUtilities from './san-testing-utilities-kit';
export default SANTestingUtilities;
/**
 * Quick access to common testing patterns
 */
export { SANTestingUtilities };
/**
 * Version information
 */
export declare const VERSION = "1.0.0";
/**
 * Metadata about the testing utilities
 */
export declare const METADATA: {
    version: string;
    name: string;
    description: string;
    author: string;
    license: string;
    features: string[];
    totalFunctions: number;
};
/**
 * Helper function to get all available utilities
 */
export declare function getAvailableUtilities(): string[];
/**
 * Helper function to print usage information
 */
export declare function printUsageInfo(): void;
//# sourceMappingURL=index.d.ts.map