/**
 * Transaction Transfer Operations Schemas
 * Zod schemas for transfer order operations (create, approve, send, receive, cancel)
 */

import { z } from 'zod';
import { TransferOrderSchema } from './transaction.base.schemas';

// ============================================================================
// Create Transfer Order
// ============================================================================

/**
 * Create Transfer Order Schema
 * Schema for creating a new transfer order
 * Omits system-generated fields and workflow-specific fields
 */
export const CreateTransferOrderSchema = TransferOrderSchema.omit({
  id: true,
  status: true,
  approvedBy: true,
  sentBy: true,
  receivedBy: true,
  approvedAt: true,
  sentAt: true,
  receivedAt: true,
  createdAt: true,
  updatedAt: true,
});

// ============================================================================
// Approve Transfer Order
// ============================================================================

/**
 * Approve Transfer Order Schema
 * Schema for approving a transfer order
 * Allows adjusting approved quantities from requested quantities
 */
export const ApproveTransferOrderSchema = z.object({
  transferOrderId: z.string().uuid('Valid transfer order ID is required'),
  approvedBy: z.string().uuid('Valid user ID is required'),
  itemAdjustments: z.array(z.object({
    itemId: z.string().uuid(),
    approvedQuantity: z.number().min(0),
  })).optional(),
  notes: z.string().max(2000).optional(),
});

// ============================================================================
// Send Transfer Order
// ============================================================================

/**
 * Send Transfer Order Schema
 * Schema for marking a transfer order as sent/in-transit
 * Optionally includes tracking information
 */
export const SendTransferOrderSchema = z.object({
  transferOrderId: z.string().uuid('Valid transfer order ID is required'),
  sentBy: z.string().uuid('Valid user ID is required'),
  trackingNumber: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
});

// ============================================================================
// Receive Transfer Order
// ============================================================================

/**
 * Receive Transfer Order Schema
 * Schema for receiving a transfer order at destination
 * Allows recording actual received quantities and discrepancies
 */
export const ReceiveTransferOrderSchema = z.object({
  transferOrderId: z.string().uuid('Valid transfer order ID is required'),
  receivedBy: z.string().uuid('Valid user ID is required'),
  itemAdjustments: z.array(z.object({
    itemId: z.string().uuid(),
    actualQuantity: z.number().min(0),
    notes: z.string().max(500).optional(), // For discrepancies
  })),
  notes: z.string().max(2000).optional(),
});

// ============================================================================
// Cancel Transfer Order
// ============================================================================

/**
 * Cancel Transfer Order Schema
 * Schema for cancelling a transfer order
 * Can be used at any stage before completion
 */
export const CancelTransferOrderSchema = z.object({
  transferOrderId: z.string().uuid('Valid transfer order ID is required'),
  cancelledBy: z.string().uuid('Valid user ID is required'),
  reason: z.string().max(500).optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type CreateTransferOrder = z.infer<typeof CreateTransferOrderSchema>;
export type ApproveTransferOrder = z.infer<typeof ApproveTransferOrderSchema>;
export type SendTransferOrder = z.infer<typeof SendTransferOrderSchema>;
export type ReceiveTransferOrder = z.infer<typeof ReceiveTransferOrderSchema>;
export type CancelTransferOrder = z.infer<typeof CancelTransferOrderSchema>;
