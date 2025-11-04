/**
 * @fileoverview Stock level and batch tracking schemas
 * @module schemas/inventory.stock
 *
 * Schemas for stock levels, batch tracking, and physical counts.
 */

import { z } from 'zod';

export const StockLevelSchema = z.object({
  id: z.string().uuid().optional(),
  itemId: z.string().uuid('Valid item ID is required'),
  locationId: z.string().uuid('Valid location ID is required'),

  // Quantities
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  reservedQuantity: z.number().min(0).default(0),
  // availableQuantity is computed: quantity - reservedQuantity

  // Physical count tracking
  lastCountedAt: z.date().optional().nullable(),
  lastCountedBy: z.string().uuid().optional().nullable(),

  // Timestamps
  updatedAt: z.date().optional(),
});

export type StockLevel = z.infer<typeof StockLevelSchema>;

export const CreateStockLevelSchema = StockLevelSchema.omit({
  id: true,
  updatedAt: true,
});

export type CreateStockLevel = z.infer<typeof CreateStockLevelSchema>;

export const UpdateStockLevelSchema = z.object({
  quantity: z.number().min(0).optional(),
  reservedQuantity: z.number().min(0).optional(),
  lastCountedAt: z.date().optional(),
  lastCountedBy: z.string().uuid().optional(),
});

export type UpdateStockLevel = z.infer<typeof UpdateStockLevelSchema>;

export const BatchSchema = z.object({
  id: z.string().uuid().optional(),
  itemId: z.string().uuid('Valid item ID is required'),
  locationId: z.string().uuid('Valid location ID is required'),

  // Batch identification
  batchNumber: z.string().min(1, 'Batch number is required').max(100),
  lotNumber: z.string().max(100).optional(),

  // Dates
  expirationDate: z.date().optional().nullable(),
  manufactureDate: z.date().optional(),
  receivedDate: z.date(),

  // Quantity and cost
  quantity: z.number().min(0),
  unitCost: z.number().min(0).optional(),

  // Supplier information
  supplier: z.string().max(255).optional(),
  purchaseOrderId: z.string().uuid().optional().nullable(),

  // Metadata
  metadata: z.record(z.any()).optional(),

  // Timestamps
  createdAt: z.date().optional(),
});

export type Batch = z.infer<typeof BatchSchema>;

export const CreateBatchSchema = BatchSchema.omit({
  id: true,
  createdAt: true,
});

export type CreateBatch = z.infer<typeof CreateBatchSchema>;

// ============================================================================
// Bulk Operations
// ============================================================================

export const PhysicalCountSchema = z.object({
  locationId: z.string().uuid(),
  countedBy: z.string().uuid(),
  countedAt: z.date().default(() => new Date()),
  items: z.array(
    z.object({
      itemId: z.string().uuid(),
      countedQuantity: z.number().min(0),
      notes: z.string().optional(),
    })
  ),
});

export type PhysicalCount = z.infer<typeof PhysicalCountSchema>;
