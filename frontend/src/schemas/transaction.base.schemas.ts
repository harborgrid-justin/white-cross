/**
 * Transaction Base Schemas
 * Core Zod schemas for transactions and transfer orders
 */

import { z } from 'zod';
import {
  TransactionTypeEnum,
  TransactionStatusEnum,
  TransferStatusEnum,
  ReferenceTypeEnum,
} from './transaction.enums.schemas';

// ============================================================================
// Base Transaction Schema
// ============================================================================

/**
 * Transaction Schema
 * Core schema for all inventory transactions
 * Represents a single stock movement with full audit trail
 */
export const TransactionSchema = z.object({
  id: z.string().uuid().optional(),

  // Core transaction data
  itemId: z.string().uuid('Valid item ID is required'),
  locationId: z.string().uuid('Valid location ID is required'),
  batchId: z.string().uuid().optional().nullable(),

  // Transaction details
  type: TransactionTypeEnum,
  status: TransactionStatusEnum.default('completed'),
  quantity: z.number().refine((val) => val !== 0, 'Quantity cannot be zero'),

  // Quantity tracking (for audit trail)
  previousQuantity: z.number().optional(),
  newQuantity: z.number().optional(),

  // Reason and notes
  reason: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),

  // Reference to related records
  referenceId: z.string().uuid().optional().nullable(),
  referenceType: ReferenceTypeEnum.optional().nullable(),

  // User tracking
  performedBy: z.string().uuid('Valid user ID is required'),
  approvedBy: z.string().uuid().optional().nullable(),

  // Controlled substance tracking
  witnessedBy: z.string().uuid().optional().nullable(), // For controlled substances

  // Metadata
  metadata: z.record(z.string(), z.any()).optional(),

  // Timestamps
  createdAt: z.date().optional(),
  performedAt: z.date().default(() => new Date()),
});

// ============================================================================
// Transfer Order Schema
// ============================================================================

/**
 * Transfer Order Schema
 * Schema for transfer orders between locations
 * Tracks multi-item transfers through approval and fulfillment workflow
 */
export const TransferOrderSchema = z.object({
  id: z.string().uuid().optional(),

  // Transfer locations
  fromLocationId: z.string().uuid('Source location is required'),
  toLocationId: z.string().uuid('Destination location is required'),

  // Status and tracking
  status: TransferStatusEnum.default('pending'),

  // Items being transferred
  items: z.array(z.object({
    itemId: z.string().uuid(),
    batchId: z.string().uuid().optional(),
    requestedQuantity: z.number().min(0),
    approvedQuantity: z.number().min(0).optional(),
    actualQuantity: z.number().min(0).optional(), // Received quantity
  })).min(1, 'At least one item is required'),

  // User tracking
  requestedBy: z.string().uuid('Valid user ID is required'),
  approvedBy: z.string().uuid().optional().nullable(),
  sentBy: z.string().uuid().optional().nullable(),
  receivedBy: z.string().uuid().optional().nullable(),

  // Dates
  requestedAt: z.date().default(() => new Date()),
  approvedAt: z.date().optional().nullable(),
  sentAt: z.date().optional().nullable(),
  receivedAt: z.date().optional().nullable(),

  // Notes and tracking
  notes: z.string().max(2000).optional(),
  trackingNumber: z.string().max(100).optional(),

  // Metadata
  metadata: z.record(z.string(), z.any()).optional(),

  // Timestamps
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).refine(
  (data) => data.fromLocationId !== data.toLocationId,
  {
    message: 'Source and destination locations must be different',
    path: ['toLocationId'],
  }
);

// ============================================================================
// Type Exports
// ============================================================================

export type Transaction = z.infer<typeof TransactionSchema>;
export type TransferOrder = z.infer<typeof TransferOrderSchema>;
