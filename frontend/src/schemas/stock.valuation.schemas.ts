/**
 * Stock Valuation Schemas
 * Zod validation schemas for inventory valuation using different costing methods
 */

import { z } from 'zod';
import { StockValuationMethodEnum } from './stock.base.schemas';

// ============================================================================
// Stock Valuation
// ============================================================================

/**
 * Schema for item stock valuation
 * Represents the monetary value of stock using specified valuation method
 */
export const StockValuationSchema = z.object({
  itemId: z.string().uuid(),
  locationId: z.string().uuid().optional(),

  // Valuation data
  quantity: z.number(),
  unitCost: z.number(),
  totalValue: z.number(),

  // Method used
  valuationMethod: StockValuationMethodEnum,

  // Date
  valuationDate: z.date().default(() => new Date()),
});

/**
 * Schema for location-level stock valuation
 * Aggregates all item valuations within a single location
 */
export const LocationStockValuationSchema = z.object({
  locationId: z.string().uuid(),
  locationName: z.string(),
  totalValue: z.number(),
  itemCount: z.number(),
  items: z.array(StockValuationSchema),
  valuationDate: z.date(),
});

/**
 * Schema for total stock valuation across all locations
 * Provides comprehensive valuation breakdown by location and category
 */
export const TotalStockValuationSchema = z.object({
  totalValue: z.number(),
  totalItems: z.number(),
  totalLocations: z.number(),
  byLocation: z.array(LocationStockValuationSchema),
  byCategory: z.array(z.object({
    category: z.string(),
    totalValue: z.number(),
    itemCount: z.number(),
  })),
  valuationMethod: StockValuationMethodEnum,
  valuationDate: z.date(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type StockValuation = z.infer<typeof StockValuationSchema>;
export type LocationStockValuation = z.infer<typeof LocationStockValuationSchema>;
export type TotalStockValuation = z.infer<typeof TotalStockValuationSchema>;
