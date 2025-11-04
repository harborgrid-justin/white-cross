/**
 * Transaction Reports and Statistics Schemas
 * Zod schemas for transaction analytics, statistics, and reporting
 */

import { z } from 'zod';
import { TransactionTypeEnum } from './transaction.enums.schemas';

// ============================================================================
// Transaction Statistics Schema
// ============================================================================

/**
 * Transaction Statistics Schema
 * Aggregate statistics about transactions
 * Includes totals, breakdowns by type, and top items
 */
export const TransactionStatisticsSchema = z.object({
  totalTransactions: z.number(),
  transactionsByType: z.record(z.string(), z.number()),
  totalValueReceived: z.number().optional(),
  totalValueIssued: z.number().optional(),
  topItems: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    transactionCount: z.number(),
    totalQuantity: z.number(),
  })).optional(),
});

// ============================================================================
// Stock Movement Report Schema
// ============================================================================

/**
 * Stock Movement Report Schema
 * Configuration for generating stock movement reports
 * Supports grouping by item, location, type, or date
 */
export const StockMovementReportSchema = z.object({
  locationId: z.string().uuid().optional(),
  startDate: z.date(),
  endDate: z.date(),
  includeTypes: z.array(TransactionTypeEnum).optional(),
  groupBy: z.enum(['item', 'location', 'type', 'date']).default('item'),
});

// ============================================================================
// Type Exports
// ============================================================================

export type TransactionStatistics = z.infer<typeof TransactionStatisticsSchema>;
export type StockMovementReport = z.infer<typeof StockMovementReportSchema>;
