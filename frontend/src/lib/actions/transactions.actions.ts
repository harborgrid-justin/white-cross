/**
 * @fileoverview Next.js App Router Server Actions for Inventory Transactions
 * @module app/transactions/actions
 *
 * Enhanced with HIPAA-compliant audit logging and proper cache management.
 * Handles stock movements, transfers, and transaction management.
 *
 * This file serves as a barrel export for all transaction-related operations.
 * Actual implementations are in focused modules:
 * - transactions.types.ts - Shared types and interfaces
 * - transactions.stock.ts - Stock receive/issue/adjust operations
 * - transactions.reservations.ts - Stock reservation operations
 * - transactions.transfers.ts - Transfer order operations
 * - transactions.counts.ts - Physical count operations
 * - transactions.queries.ts - Query and statistics operations
 * - transactions.dashboard.ts - Dashboard analytics operations
 */

'use server';

// Re-export all types from types module
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
  ActionResult,
  PaginatedResult,
} from './transactions.types';

// Re-export stock operations
export {
  receiveStock,
  bulkReceiveStock,
  issueStock,
  adjustStock,
} from './transactions.stock';

// Re-export reservation operations
export {
  reserveStock,
  releaseReservedStock,
} from './transactions.reservations';

// Re-export transfer order operations
export {
  createTransferOrder,
  approveTransferOrder,
} from './transactions.transfers';

// Re-export physical count operations
export {
  performPhysicalCount,
  getPhysicalCountHistory,
} from './transactions.counts';

// Re-export query operations
export {
  getTransaction,
  getTransactions,
  getTransactionStatistics,
} from './transactions.queries';

// Re-export dashboard operations
export {
  getTransactionsStats,
  getTransactionsDashboardData,
} from './transactions.dashboard';
