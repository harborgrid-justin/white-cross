/**
 * @fileoverview Shared types and interfaces for Transaction Server Actions
 * @module app/transactions/types
 */

'use server';

// Re-export all transaction schema types
export type {
  Transaction,
  TransactionWithDetails,
  TransactionFilter,
  ReceiveStock,
  IssueStock,
  AdjustStock,
  ReserveStock,
  ReleaseReservedStock,
  TransferOrder,
  CreateTransferOrder,
  ApproveTransferOrder,
  SendTransferOrder,
  ReceiveTransferOrder,
  CancelTransferOrder,
  TransferOrderWithDetails,
  TransferOrderFilter,
  PhysicalCount,
  TransactionStatistics,
} from '@/schemas/transaction.schemas';

// Common action result interface
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Paginated result interface
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
