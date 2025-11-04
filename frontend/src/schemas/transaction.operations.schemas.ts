/**
 * Transaction Operations Schemas
 * Zod schemas for specific transaction operations (receive, issue, adjust, reserve, release)
 */

import { z } from 'zod';
import { ReferenceTypeEnum, AdjustmentReasonEnum } from './transaction.enums.schemas';

// ============================================================================
// Receive Stock Operation
// ============================================================================

/**
 * Receive Stock Schema
 * Schema for receiving stock from suppliers or external sources
 * Includes batch tracking, cost information, and supplier details
 */
export const ReceiveStockSchema = z.object({
  itemId: z.string().uuid('Valid item ID is required'),
  locationId: z.string().uuid('Valid location ID is required'),
  quantity: z.number().min(0.01, 'Quantity must be positive'),

  // Batch information (required for batch-tracked items)
  batchNumber: z.string().min(1).max(100).optional(),
  lotNumber: z.string().max(100).optional(),
  expirationDate: z.date().optional().nullable(),
  manufactureDate: z.date().optional(),

  // Cost and supplier
  unitCost: z.number().min(0).optional(),
  supplier: z.string().max(255).optional(),
  purchaseOrderId: z.string().uuid().optional().nullable(),

  // Notes
  notes: z.string().max(2000).optional(),
  performedBy: z.string().uuid('Valid user ID is required'),
});

// ============================================================================
// Issue Stock Operation
// ============================================================================

/**
 * Issue Stock Schema
 * Schema for issuing/dispensing stock for use
 * Supports FIFO batch selection and controlled substance tracking
 */
export const IssueStockSchema = z.object({
  itemId: z.string().uuid('Valid item ID is required'),
  locationId: z.string().uuid('Valid location ID is required'),
  batchId: z.string().uuid().optional().nullable(), // Use specific batch (FIFO if not specified)
  quantity: z.number().min(0.01, 'Quantity must be positive'),

  // Reference information
  referenceType: ReferenceTypeEnum.optional().nullable(),
  referenceId: z.string().uuid().optional().nullable(),

  // For controlled substances
  issuedTo: z.string().max(255).optional(), // Patient name or ID
  witnessedBy: z.string().uuid().optional().nullable(),

  // Notes
  notes: z.string().max(2000).optional(),
  performedBy: z.string().uuid('Valid user ID is required'),
});

// ============================================================================
// Adjust Stock Operation
// ============================================================================

/**
 * Adjust Stock Schema
 * Schema for manual stock adjustments (corrections, spoilage, theft, etc.)
 * Requires explicit reason and may require approval for controlled substances
 */
export const AdjustStockSchema = z.object({
  itemId: z.string().uuid('Valid item ID is required'),
  locationId: z.string().uuid('Valid location ID is required'),
  batchId: z.string().uuid().optional().nullable(),

  // New quantity (not delta)
  newQuantity: z.number().min(0, 'Quantity cannot be negative'),

  // Adjustment reason
  reason: AdjustmentReasonEnum,
  reasonDetails: z.string().max(500).optional(),

  // For controlled substances, require approval
  approvedBy: z.string().uuid().optional().nullable(),

  // Notes
  notes: z.string().max(2000).optional(),
  performedBy: z.string().uuid('Valid user ID is required'),
});

// ============================================================================
// Reserve Stock Operation
// ============================================================================

/**
 * Reserve Stock Schema
 * Schema for reserving stock for future use (appointments, procedures, etc.)
 * Stock is held but not yet issued
 */
export const ReserveStockSchema = z.object({
  itemId: z.string().uuid('Valid item ID is required'),
  locationId: z.string().uuid('Valid location ID is required'),
  quantity: z.number().min(0.01, 'Quantity must be positive'),

  // Reservation details
  reservedFor: z.string().max(255).optional(), // Appointment, procedure, etc.
  reservedUntil: z.date().optional(),
  referenceId: z.string().uuid().optional().nullable(),
  referenceType: ReferenceTypeEnum.optional().nullable(),

  // Notes
  notes: z.string().max(2000).optional(),
  performedBy: z.string().uuid('Valid user ID is required'),
});

// ============================================================================
// Release Reserved Stock Operation
// ============================================================================

/**
 * Release Reserved Stock Schema
 * Schema for releasing previously reserved stock
 * Can be used (converted to issue), cancelled (returned to available), or expired
 */
export const ReleaseReservedStockSchema = z.object({
  itemId: z.string().uuid('Valid item ID is required'),
  locationId: z.string().uuid('Valid location ID is required'),
  quantity: z.number().min(0.01, 'Quantity must be positive'),

  // Reason for release
  reason: z.enum(['used', 'cancelled', 'expired']),

  // Notes
  notes: z.string().max(2000).optional(),
  performedBy: z.string().uuid('Valid user ID is required'),
});

// ============================================================================
// Type Exports
// ============================================================================

export type ReceiveStock = z.infer<typeof ReceiveStockSchema>;
export type IssueStock = z.infer<typeof IssueStockSchema>;
export type AdjustStock = z.infer<typeof AdjustStockSchema>;
export type ReserveStock = z.infer<typeof ReserveStockSchema>;
export type ReleaseReservedStock = z.infer<typeof ReleaseReservedStockSchema>;
