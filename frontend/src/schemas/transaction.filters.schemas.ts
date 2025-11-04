/**
 * Transaction Filter and Query Schemas
 * Zod schemas for filtering, searching, and paginating transaction data
 */

import { z } from 'zod';
import {
  TransactionTypeEnum,
  TransferStatusEnum,
  ReferenceTypeEnum,
} from './transaction.enums.schemas';

// ============================================================================
// Transaction Filter Schema
// ============================================================================

/**
 * Transaction Filter Schema
 * Comprehensive filtering options for transaction queries
 * Supports pagination, sorting, and date range filtering
 */
export const TransactionFilterSchema = z.object({
  itemId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  batchId: z.string().uuid().optional(),
  type: TransactionTypeEnum.optional(),
  performedBy: z.string().uuid().optional(),
  referenceId: z.string().uuid().optional(),
  referenceType: ReferenceTypeEnum.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isControlledSubstance: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'performedAt', 'type', 'quantity']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================================================
// Transfer Order Filter Schema
// ============================================================================

/**
 * Transfer Order Filter Schema
 * Filtering options for transfer order queries
 * Supports status, location, user, and date range filtering
 */
export const TransferOrderFilterSchema = z.object({
  fromLocationId: z.string().uuid().optional(),
  toLocationId: z.string().uuid().optional(),
  status: TransferStatusEnum.optional(),
  requestedBy: z.string().uuid().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['requestedAt', 'status', 'updatedAt']).default('requestedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================================================
// Type Exports
// ============================================================================

export type TransactionFilter = z.infer<typeof TransactionFilterSchema>;
export type TransferOrderFilter = z.infer<typeof TransferOrderFilterSchema>;
