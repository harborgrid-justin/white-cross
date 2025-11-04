/**
 * Stock Reports Schemas
 * Zod validation schemas for inventory reports and summaries
 */

import { z } from 'zod';

// ============================================================================
// Stock Level Report
// ============================================================================

/**
 * Schema for stock level report
 * Comprehensive snapshot of current inventory levels across locations
 */
export const StockLevelReportSchema = z.object({
  locationId: z.string().uuid().optional(),
  category: z.string().optional(),
  reportDate: z.date().default(() => new Date()),
  items: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    sku: z.string(),
    category: z.string(),
    locationName: z.string(),
    quantity: z.number(),
    availableQuantity: z.number(),
    reservedQuantity: z.number(),
    reorderPoint: z.number(),
    unitCost: z.number().optional(),
    totalValue: z.number().optional(),
    status: z.enum(['in_stock', 'low', 'critical', 'out_of_stock']),
  })),
  summary: z.object({
    totalItems: z.number(),
    inStock: z.number(),
    lowStock: z.number(),
    criticalStock: z.number(),
    outOfStock: z.number(),
    totalValue: z.number().optional(),
  }),
});

// ============================================================================
// Transaction Summary Report
// ============================================================================

/**
 * Schema for transaction summary report
 * Aggregates transaction activity over a date range
 */
export const TransactionSummaryReportSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  locationId: z.string().uuid().optional(),

  // Transaction counts by type
  transactionsByType: z.record(z.string(), z.number()),

  // Volume metrics
  totalReceived: z.number(),
  totalIssued: z.number(),
  totalAdjustments: z.number(),
  totalTransfers: z.number(),

  // Value metrics
  valueReceived: z.number().optional(),
  valueIssued: z.number().optional(),

  // Top items
  topReceivedItems: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    quantity: z.number(),
  })).optional(),
  topIssuedItems: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    quantity: z.number(),
  })).optional(),
});

// ============================================================================
// Expiration Report
// ============================================================================

/**
 * Schema for expiration report
 * Tracks expired and expiring items grouped by urgency level
 */
export const ExpirationReportSchema = z.object({
  reportDate: z.date().default(() => new Date()),
  daysAhead: z.number().default(90),
  locationId: z.string().uuid().optional(),

  // Expiring items grouped by urgency
  expiredItems: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    batchNumber: z.string(),
    locationName: z.string(),
    expirationDate: z.date(),
    daysExpired: z.number(),
    quantity: z.number(),
    estimatedValue: z.number().optional(),
  })),

  expiringCritical: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    batchNumber: z.string(),
    locationName: z.string(),
    expirationDate: z.date(),
    daysUntilExpiration: z.number(),
    quantity: z.number(),
    estimatedValue: z.number().optional(),
  })), // < 30 days

  expiringWarning: z.array(z.any()), // 30-60 days
  expiringInfo: z.array(z.any()), // 60-90 days

  summary: z.object({
    totalExpired: z.number(),
    totalExpiringCritical: z.number(),
    totalExpiringWarning: z.number(),
    totalExpiringInfo: z.number(),
    totalValue: z.number().optional(),
  }),
});

// ============================================================================
// Variance Report
// ============================================================================

/**
 * Schema for variance report
 * Documents discrepancies between system counts and physical inventory counts
 */
export const VarianceReportSchema = z.object({
  locationId: z.string().uuid(),
  reportDate: z.date().default(() => new Date()),
  countedBy: z.string().uuid(),

  // Items with discrepancies
  variances: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    sku: z.string(),
    systemQuantity: z.number(),
    countedQuantity: z.number(),
    variance: z.number(), // countedQuantity - systemQuantity
    variancePercentage: z.number(),
    varianceValue: z.number().optional(),
    reason: z.string().optional(),
  })),

  summary: z.object({
    totalItemsCounted: z.number(),
    itemsWithVariance: z.number(),
    totalAbsoluteVariance: z.number(),
    totalVarianceValue: z.number().optional(),
    accuracyPercentage: z.number(),
  }),
});

// ============================================================================
// Type Exports
// ============================================================================

export type StockLevelReport = z.infer<typeof StockLevelReportSchema>;
export type TransactionSummaryReport = z.infer<typeof TransactionSummaryReportSchema>;
export type ExpirationReport = z.infer<typeof ExpirationReportSchema>;
export type VarianceReport = z.infer<typeof VarianceReportSchema>;
