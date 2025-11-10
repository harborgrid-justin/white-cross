/**
 * @fileoverview Budget Constants
 * @module lib/actions/budget/constants
 *
 * Runtime constant values for budget management.
 * Separated from type definitions for proper type-only imports.
 */

// ==========================================
// CACHE CONFIGURATION
// ==========================================

/**
 * Cache tags for budget operations
 */
export const BUDGET_CACHE_TAGS = {
  CATEGORIES: 'budget-categories',
  TRANSACTIONS: 'budget-transactions',
  SUMMARY: 'budget-summary',
  TRENDS: 'budget-trends',
  REPORTS: 'budget-reports',
} as const;
