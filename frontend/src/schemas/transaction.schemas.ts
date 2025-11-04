/**
 * Transaction Schemas - Barrel Export
 *
 * This file serves as the main entry point for all transaction-related schemas.
 * It re-exports schemas from modular subfiles to maintain backward compatibility
 * while improving code organization.
 *
 * Module Structure:
 * - transaction.enums.schemas.ts: Enums for transaction types, statuses, reasons
 * - transaction.base.schemas.ts: Core Transaction and TransferOrder schemas
 * - transaction.operations.schemas.ts: Receive, Issue, Adjust, Reserve, Release operations
 * - transaction.transfers.schemas.ts: Transfer order operations (create, approve, send, receive, cancel)
 * - transaction.count.schemas.ts: Physical count schemas
 * - transaction.filters.schemas.ts: Query and filter schemas
 * - transaction.responses.schemas.ts: API response schemas with enriched data
 * - transaction.reports.schemas.ts: Statistics and reporting schemas
 */

// ============================================================================
// Enums
// ============================================================================

export {
  TransactionTypeEnum,
  TransactionStatusEnum,
  TransferStatusEnum,
  AdjustmentReasonEnum,
  ReferenceTypeEnum,
  type TransactionType,
  type TransactionStatus,
  type TransferStatus,
  type AdjustmentReason,
  type ReferenceType,
} from './transaction.enums.schemas';

// ============================================================================
// Base Schemas
// ============================================================================

export {
  TransactionSchema,
  TransferOrderSchema,
  type Transaction,
  type TransferOrder,
} from './transaction.base.schemas';

// ============================================================================
// Operation Schemas
// ============================================================================

export {
  ReceiveStockSchema,
  IssueStockSchema,
  AdjustStockSchema,
  ReserveStockSchema,
  ReleaseReservedStockSchema,
  type ReceiveStock,
  type IssueStock,
  type AdjustStock,
  type ReserveStock,
  type ReleaseReservedStock,
} from './transaction.operations.schemas';

// ============================================================================
// Transfer Order Operations
// ============================================================================

export {
  CreateTransferOrderSchema,
  ApproveTransferOrderSchema,
  SendTransferOrderSchema,
  ReceiveTransferOrderSchema,
  CancelTransferOrderSchema,
  type CreateTransferOrder,
  type ApproveTransferOrder,
  type SendTransferOrder,
  type ReceiveTransferOrder,
  type CancelTransferOrder,
} from './transaction.transfers.schemas';

// ============================================================================
// Physical Count Schemas
// ============================================================================

export {
  PhysicalCountSchema,
  PhysicalCountItemSchema,
  type PhysicalCount,
  type PhysicalCountItem,
} from './transaction.count.schemas';

// ============================================================================
// Filter Schemas
// ============================================================================

export {
  TransactionFilterSchema,
  TransferOrderFilterSchema,
  type TransactionFilter,
  type TransferOrderFilter,
} from './transaction.filters.schemas';

// ============================================================================
// Response Schemas
// ============================================================================

export {
  TransactionWithDetailsSchema,
  TransferOrderWithDetailsSchema,
  type TransactionWithDetails,
  type TransferOrderWithDetails,
} from './transaction.responses.schemas';

// ============================================================================
// Statistics and Reports
// ============================================================================

export {
  TransactionStatisticsSchema,
  StockMovementReportSchema,
  type TransactionStatistics,
  type StockMovementReport,
} from './transaction.reports.schemas';
