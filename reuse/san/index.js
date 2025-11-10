"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.METADATA = exports.VERSION = exports.SANTestingUtilities = void 0;
exports.getAvailableUtilities = getAvailableUtilities;
exports.printUsageInfo = printUsageInfo;
// Re-export all utilities from the main kit
__exportStar(require("./san-testing-utilities-kit"), exports);
// Re-export as default for convenience
const san_testing_utilities_kit_1 = __importDefault(require("./san-testing-utilities-kit"));
exports.SANTestingUtilities = san_testing_utilities_kit_1.default;
exports.default = san_testing_utilities_kit_1.default;
/**
 * Version information
 */
exports.VERSION = '1.0.0';
/**
 * Metadata about the testing utilities
 */
exports.METADATA = {
    version: exports.VERSION,
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
function getAvailableUtilities() {
    return Object.keys(san_testing_utilities_kit_1.default);
}
/**
 * Helper function to print usage information
 */
function printUsageInfo() {
    console.log('\n=================================================');
    console.log('SAN Testing Utilities Kit');
    console.log('=================================================\n');
    console.log(`Version: ${exports.METADATA.version}`);
    console.log(`Total Functions: ${exports.METADATA.totalFunctions}`);
    console.log('\nFeatures:');
    exports.METADATA.features.forEach((feature) => console.log(`  - ${feature}`));
    console.log('\nDocumentation:');
    console.log('  - README: reuse/san/SAN-TESTING-UTILITIES-README.md');
    console.log('  - Quick Reference: reuse/san/SAN-TESTING-QUICK-REFERENCE.md');
    console.log('  - Examples: reuse/san/san-testing-utilities-examples.spec.ts');
    console.log('\nUsage:');
    console.log('  import { generateSANVolumeFixture } from "@/reuse/san";\n');
}
//# sourceMappingURL=index.js.map