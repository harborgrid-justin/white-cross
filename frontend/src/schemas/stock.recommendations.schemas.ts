/**
 * Stock Recommendations Schemas
 * Zod validation schemas for automated reorder and transfer recommendations
 */

import { z } from 'zod';
import { AlertPriorityEnum } from './stock.base.schemas';

// ============================================================================
// Reorder Recommendations
// ============================================================================

/**
 * Schema for automated reorder recommendations
 * Calculates optimal reorder quantities and timing based on usage patterns
 */
export const ReorderRecommendationSchema = z.object({
  itemId: z.string().uuid(),
  itemName: z.string(),
  sku: z.string(),
  locationId: z.string().uuid(),
  locationName: z.string(),

  // Current state
  currentQuantity: z.number(),
  reorderPoint: z.number(),
  reorderQuantity: z.number(),

  // Calculations
  averageDailyUsage: z.number(),
  daysUntilStockout: z.number(),
  leadTimeDays: z.number(),
  safetyStock: z.number(),

  // Recommendation
  recommendedOrderQuantity: z.number(),
  recommendedOrderDate: z.date(),
  priority: AlertPriorityEnum,
  reason: z.string(),

  // Supplier information
  preferredSupplier: z.string().optional(),
  estimatedCost: z.number().optional(),

  // Generated at
  generatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for bulk reorder recommendations
 * Groups multiple reorder recommendations with aggregated cost estimates
 */
export const BulkReorderRecommendationsSchema = z.object({
  locationId: z.string().uuid().optional(),
  includeAllLocations: z.boolean().default(false),
  minimumPriority: AlertPriorityEnum.default('low'),
  recommendations: z.array(ReorderRecommendationSchema),
  totalEstimatedCost: z.number().optional(),
  generatedAt: z.date(),
});

// ============================================================================
// Stock Transfer Recommendations
// ============================================================================

/**
 * Schema for stock transfer recommendations between locations
 * Identifies opportunities to balance stock levels by transferring excess inventory
 */
export const StockTransferRecommendationSchema = z.object({
  itemId: z.string().uuid(),
  itemName: z.string(),

  // Source location (has excess)
  fromLocationId: z.string().uuid(),
  fromLocationName: z.string(),
  fromCurrentQuantity: z.number(),
  fromExcessQuantity: z.number(),

  // Destination location (needs stock)
  toLocationId: z.string().uuid(),
  toLocationName: z.string(),
  toCurrentQuantity: z.number(),
  toDeficitQuantity: z.number(),

  // Recommendation
  recommendedTransferQuantity: z.number(),
  priority: AlertPriorityEnum,
  reason: z.string(),

  // Generated at
  generatedAt: z.date().default(() => new Date()),
});

// ============================================================================
// Type Exports
// ============================================================================

export type ReorderRecommendation = z.infer<typeof ReorderRecommendationSchema>;
export type BulkReorderRecommendations = z.infer<typeof BulkReorderRecommendationsSchema>;
export type StockTransferRecommendation = z.infer<typeof StockTransferRecommendationSchema>;
