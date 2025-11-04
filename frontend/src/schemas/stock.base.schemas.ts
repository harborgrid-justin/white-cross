/**
 * Stock Management Base Schemas
 * Shared enums and base types used across stock modules
 */

import { z } from 'zod';

// ============================================================================
// Alert Enums
// ============================================================================

/**
 * Priority levels for stock alerts
 */
export const AlertPriorityEnum = z.enum(['critical', 'high', 'medium', 'low', 'info']);

/**
 * Status states for stock alerts
 */
export const AlertStatusEnum = z.enum(['active', 'acknowledged', 'resolved', 'dismissed']);

// ============================================================================
// Valuation Enums
// ============================================================================

/**
 * Stock valuation methods for inventory costing
 */
export const StockValuationMethodEnum = z.enum([
  'FIFO',    // First In, First Out
  'LIFO',    // Last In, First Out
  'WAC',     // Weighted Average Cost
  'specific', // Specific identification (batch-based)
]);

// ============================================================================
// Analytics Enums
// ============================================================================

/**
 * Time periods for usage analytics
 */
export const UsagePeriodEnum = z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']);

// ============================================================================
// Type Exports
// ============================================================================

export type AlertPriority = z.infer<typeof AlertPriorityEnum>;
export type AlertStatus = z.infer<typeof AlertStatusEnum>;
export type StockValuationMethod = z.infer<typeof StockValuationMethodEnum>;
export type UsagePeriod = z.infer<typeof UsagePeriodEnum>;
