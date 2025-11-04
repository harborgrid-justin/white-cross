/**
 * Physical Count Schemas
 * Zod schemas for physical inventory counts and variance tracking
 */

import { z } from 'zod';

// ============================================================================
// Physical Count Item Schema
// ============================================================================

/**
 * Physical Count Item Schema
 * Represents a single item in a physical count
 * Includes counted quantity, system quantity, and variance tracking
 */
export const PhysicalCountItemSchema = z.object({
  itemId: z.string().uuid(),
  batchId: z.string().uuid().optional().nullable(),
  countedQuantity: z.number().min(0),
  systemQuantity: z.number().optional(), // Current system quantity for reference
  variance: z.number().optional(), // countedQuantity - systemQuantity
  notes: z.string().max(500).optional(),
});

// ============================================================================
// Physical Count Schema
// ============================================================================

/**
 * Physical Count Schema
 * Schema for conducting physical inventory counts
 * Can automatically create adjustment transactions based on variances
 */
export const PhysicalCountSchema = z.object({
  locationId: z.string().uuid('Valid location ID is required'),
  countedBy: z.string().uuid('Valid user ID is required'),
  witnessedBy: z.string().uuid().optional().nullable(),
  countedAt: z.date().default(() => new Date()),
  items: z.array(PhysicalCountItemSchema).min(1, 'At least one item is required'),
  notes: z.string().max(2000).optional(),
  autoAdjust: z.boolean().default(true), // Automatically create adjustment transactions
});

// ============================================================================
// Type Exports
// ============================================================================

export type PhysicalCount = z.infer<typeof PhysicalCountSchema>;
export type PhysicalCountItem = z.infer<typeof PhysicalCountItemSchema>;
