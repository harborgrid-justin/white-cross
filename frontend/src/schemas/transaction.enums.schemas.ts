/**
 * Transaction Enums and Constants
 * Zod enum schemas for transaction types, statuses, and reasons
 */

import { z } from 'zod';

// ============================================================================
// Transaction Enums
// ============================================================================

/**
 * Transaction Type Enum
 * Defines all possible inventory transaction types
 */
export const TransactionTypeEnum = z.enum([
  'receive',      // Receiving stock from supplier
  'issue',        // Issuing stock (dispensing, using)
  'adjust',       // Manual adjustment (correction, spoilage, theft)
  'transfer',     // Transfer between locations
  'count',        // Physical count adjustment
  'return',       // Return to supplier or from location
  'reserve',      // Reserve stock for future use
  'release',      // Release reserved stock
]);

/**
 * Transaction Status Enum
 * Tracks the lifecycle state of a transaction
 */
export const TransactionStatusEnum = z.enum([
  'pending',
  'completed',
  'cancelled',
  'failed',
]);

/**
 * Transfer Status Enum
 * Tracks the state of transfer orders through their lifecycle
 */
export const TransferStatusEnum = z.enum([
  'pending',
  'approved',
  'in_transit',
  'completed',
  'cancelled',
  'rejected',
]);

/**
 * Adjustment Reason Enum
 * Categorizes why stock adjustments are made
 */
export const AdjustmentReasonEnum = z.enum([
  'physical_count',
  'spoilage',
  'expired',
  'damaged',
  'theft',
  'loss',
  'found',
  'correction',
  'quality_issue',
  'other',
]);

/**
 * Reference Type Enum
 * Defines what type of record a transaction references
 */
export const ReferenceTypeEnum = z.enum([
  'appointment',
  'medication_administration',
  'purchase_order',
  'transfer_order',
  'physical_count',
  'patient_care',
  'maintenance',
  'other',
]);

// ============================================================================
// Type Exports
// ============================================================================

export type TransactionType = z.infer<typeof TransactionTypeEnum>;
export type TransactionStatus = z.infer<typeof TransactionStatusEnum>;
export type TransferStatus = z.infer<typeof TransferStatusEnum>;
export type AdjustmentReason = z.infer<typeof AdjustmentReasonEnum>;
export type ReferenceType = z.infer<typeof ReferenceTypeEnum>;
