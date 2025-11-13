/**
 * @fileoverview Database Operations Module Index
 * @module @/database/services/operations
 * @description Central export point for all database operation services
 *
 * @version 1.0.0
 */

// Export interfaces and types
export * from './interfaces';

// Export batch operations
export * from './batch-operations.service';

// Export CRUD operations
export * from './crud-operations.service';

// Export analytics operations
export * from './analytics-operations.service';

// Export streaming operations
export * from './streaming-operations.service';

// Export join operations
export * from './join-operations.service';

/**
 * Consolidated Database Operations object for easy access
 * @deprecated Use individual function imports for better tree-shaking
 */
export const DatabaseOperations = {
  // Re-export everything for backward compatibility
  // Note: This creates a large bundle - prefer individual imports
} as const;
