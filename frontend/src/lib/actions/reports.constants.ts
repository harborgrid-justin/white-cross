/**
 * @fileoverview Report Constants
 * @module lib/actions/reports/constants
 *
 * Runtime constant values for report management.
 * Separated from type definitions for proper type-only imports.
 */

// ==========================================
// CONFIGURATION
// ==========================================

// Custom cache tags for reports
export const REPORT_CACHE_TAGS = {
  REPORTS: 'reports',
  TEMPLATES: 'report-templates',
  SCHEDULES: 'report-schedules',
  EXPORTS: 'report-exports',
  ANALYTICS: 'report-analytics',
} as const;
