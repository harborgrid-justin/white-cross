/**
 * @fileoverview Export Constants
 * @module lib/actions/export/constants
 *
 * Runtime constant values for data export functionality.
 * Separated from type definitions for proper type-only imports.
 */

// ==========================================
// CACHE CONFIGURATION
// ==========================================

/**
 * Cache tags for export operations
 */
export const EXPORT_CACHE_TAGS = {
  JOBS: 'export-jobs',
  TEMPLATES: 'export-templates',
  HISTORY: 'export-history',
  FILES: 'export-files',
  SCHEDULES: 'export-schedules',
} as const;
