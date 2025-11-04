/**
 * Stock Threshold Schemas
 * Zod validation schemas for stock level thresholds and reorder points
 */

import { z } from 'zod';

// ============================================================================
// Stock Level Thresholds
// ============================================================================

/**
 * Schema for configuring stock level thresholds per item-location pair
 * Defines reorder points, safety stock, and auto-reorder settings
 */
export const StockLevelThresholdsSchema = z.object({
  itemId: z.string().uuid(),
  locationId: z.string().uuid(),

  // Threshold levels
  reorderPoint: z.number().min(0),
  reorderQuantity: z.number().min(0),
  minimumLevel: z.number().min(0).optional(),
  maximumLevel: z.number().min(0).optional(),
  safetyStock: z.number().min(0).optional(),

  // Auto-reorder settings
  autoReorder: z.boolean().default(false),
  preferredSupplierId: z.string().uuid().optional().nullable(),

  // Lead time (days)
  leadTimeDays: z.number().min(0).default(7),
});

/**
 * Schema for updating stock level thresholds
 * Partial update schema omitting item and location identifiers
 */
export const UpdateStockLevelThresholdsSchema = StockLevelThresholdsSchema.omit({
  itemId: true,
  locationId: true,
}).partial();

// ============================================================================
// Type Exports
// ============================================================================

export type StockLevelThresholds = z.infer<typeof StockLevelThresholdsSchema>;
export type UpdateStockLevelThresholds = z.infer<typeof UpdateStockLevelThresholdsSchema>;
