/**
 * Transaction Response Schemas
 * Zod schemas for API responses with enriched/joined data
 */

import { z } from 'zod';
import { TransactionSchema, TransferOrderSchema } from './transaction.base.schemas';

// ============================================================================
// Transaction with Details Schema
// ============================================================================

/**
 * Transaction With Details Schema
 * Extended transaction schema including related entity data
 * Used for API responses that include joined item, location, batch, and user data
 */
export const TransactionWithDetailsSchema = TransactionSchema.extend({
  item: z.object({
    id: z.string().uuid(),
    name: z.string(),
    sku: z.string(),
    unit: z.string(),
    isControlledSubstance: z.boolean(),
  }).optional(),
  location: z.object({
    id: z.string().uuid(),
    name: z.string(),
    code: z.string(),
  }).optional(),
  batch: z.object({
    id: z.string().uuid(),
    batchNumber: z.string(),
    expirationDate: z.date().nullable(),
  }).optional(),
  performer: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }).optional(),
});

// ============================================================================
// Transfer Order with Details Schema
// ============================================================================

/**
 * Transfer Order With Details Schema
 * Extended transfer order schema including related entity data
 * Used for API responses that include joined location and item data
 */
export const TransferOrderWithDetailsSchema = TransferOrderSchema.extend({
  fromLocation: z.object({
    id: z.string().uuid(),
    name: z.string(),
    code: z.string(),
  }).optional(),
  toLocation: z.object({
    id: z.string().uuid(),
    name: z.string(),
    code: z.string(),
  }).optional(),
  itemsWithDetails: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    sku: z.string(),
    requestedQuantity: z.number(),
    approvedQuantity: z.number().optional(),
    actualQuantity: z.number().optional(),
  })).optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type TransactionWithDetails = z.infer<typeof TransactionWithDetailsSchema>;
export type TransferOrderWithDetails = z.infer<typeof TransferOrderWithDetailsSchema>;
