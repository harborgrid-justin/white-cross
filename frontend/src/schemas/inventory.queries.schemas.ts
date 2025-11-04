/**
 * @fileoverview Inventory query and filter schemas
 * @module schemas/inventory.queries
 *
 * Schemas for filtering, searching, and querying inventory data.
 */

import { z } from 'zod';
import { InventoryItemCategoryEnum, InventoryItemSchema, InventoryLocationSchema } from './inventory.base.schemas';
import { StockLevelSchema, BatchSchema } from './inventory.stock.schemas';

// ============================================================================
// Query/Filter Schemas
// ============================================================================

export const InventoryItemFilterSchema = z.object({
  search: z.string().optional(),
  category: InventoryItemCategoryEnum.optional(),
  subcategory: z.string().optional(),
  isControlledSubstance: z.boolean().optional(),
  requiresBatchTracking: z.boolean().optional(),
  locationId: z.string().uuid().optional(),
  belowReorderPoint: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['name', 'sku', 'category', 'quantity', 'updatedAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type InventoryItemFilter = z.infer<typeof InventoryItemFilterSchema>;

export const StockLevelFilterSchema = z.object({
  itemId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  belowReorderPoint: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type StockLevelFilter = z.infer<typeof StockLevelFilterSchema>;

export const BatchFilterSchema = z.object({
  itemId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  expiringBefore: z.date().optional(),
  expiringAfter: z.date().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type BatchFilter = z.infer<typeof BatchFilterSchema>;

// ============================================================================
// Response Schemas
// ============================================================================

export const InventoryItemWithStockSchema = InventoryItemSchema.extend({
  stockLevels: z.array(
    StockLevelSchema.extend({
      location: InventoryLocationSchema.optional(),
      availableQuantity: z.number(),
    })
  ).optional(),
  totalQuantity: z.number().optional(),
  totalAvailableQuantity: z.number().optional(),
  batches: z.array(BatchSchema).optional(),
});

export type InventoryItemWithStock = z.infer<typeof InventoryItemWithStockSchema>;

export const StockLevelWithDetailsSchema = StockLevelSchema.extend({
  item: InventoryItemSchema.optional(),
  location: InventoryLocationSchema.optional(),
  availableQuantity: z.number(),
  batches: z.array(BatchSchema).optional(),
});

export type StockLevelWithDetails = z.infer<typeof StockLevelWithDetailsSchema>;

// ============================================================================
// Alert Schemas
// ============================================================================

export const LowStockAlertSchema = z.object({
  id: z.string().uuid(),
  itemId: z.string().uuid(),
  itemName: z.string(),
  sku: z.string(),
  locationId: z.string().uuid(),
  locationName: z.string(),
  currentQuantity: z.number(),
  availableQuantity: z.number(),
  reorderPoint: z.number(),
  reorderQuantity: z.number(),
  suggestedAction: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  daysUntilStockout: z.number().optional(),
});

export type LowStockAlert = z.infer<typeof LowStockAlertSchema>;

export const ExpirationAlertSchema = z.object({
  id: z.string().uuid(),
  itemId: z.string().uuid(),
  itemName: z.string(),
  batchId: z.string().uuid(),
  batchNumber: z.string(),
  locationId: z.string().uuid(),
  locationName: z.string(),
  expirationDate: z.date(),
  daysUntilExpiration: z.number(),
  quantity: z.number(),
  priority: z.enum(['critical', 'warning', 'info']),
  suggestedAction: z.string(),
});

export type ExpirationAlert = z.infer<typeof ExpirationAlertSchema>;

export const BulkImportItemSchema = z.object({
  items: z.array(z.any()), // Will be validated as CreateInventoryItemSchema
  skipDuplicates: z.boolean().default(true),
  updateExisting: z.boolean().default(false),
});

export type BulkImportItem = z.infer<typeof BulkImportItemSchema>;
