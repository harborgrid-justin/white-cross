/**
 * LOC: BA02540B60
 * WC-GEN-233 | chronicConditionService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-233 | chronicConditionService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * @fileoverview Chronic Condition Service - Legacy Entry Point
 *
 * DEPRECATED: This file provides backward compatibility for legacy imports.
 * New code should import directly from './chronicCondition' module.
 *
 * @module services/chronicConditionService
 * @deprecated Import from './chronicCondition' instead for better modularity and access to types
 *
 * @example
 * ```typescript
 * // DEPRECATED - Old import pattern
 * import ChronicConditionService from './services/chronicConditionService';
 *
 * // RECOMMENDED - New import pattern
 * import { ChronicConditionService } from './services/chronicCondition';
 * import type { CreateChronicConditionData } from './services/chronicCondition';
 * ```
 *
 * @since 1.0.0
 */

// Re-export everything from the modular implementation
export * from './chronicCondition';
export { ChronicConditionService as default } from './chronicCondition';
