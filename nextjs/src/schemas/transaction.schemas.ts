/**
 * Inventory Transaction Schemas
 * Zod validation schemas for stock movements, transfers, and transaction history
 */

import { z } from 'zod';

// ============================================================================
// Enums
// ============================================================================

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

export const TransactionStatusEnum = z.enum([
  'pending',
  'completed',
  'cancelled',
  'failed',
]);

export const TransferStatusEnum = z.enum([
  'pending',
  'approved',
  'in_transit',
  'completed',
  'cancelled',
  'rejected',
]);

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
// Base Schemas
// ============================================================================

export const TransactionSchema = z.object({
  id: z.string().uuid().optional(),

  // Core transaction data
  itemId: z.string().uuid('Valid item ID is required'),
  locationId: z.string().uuid('Valid location ID is required'),
  batchId: z.string().uuid().optional().nullable(),

  // Transaction details
  type: TransactionTypeEnum,
  status: TransactionStatusEnum.default('completed'),
  quantity: z.number().refine(val => val !== 0, {
    message: 'Quantity cannot be zero',
  }),

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
  metadata: z.record(z.any()).optional(),

  // Timestamps
  createdAt: z.date().optional(),
  performedAt: z.date().default(() => new Date()),
});

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
  metadata: z.record(z.any()).optional(),

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
// Transaction Type-Specific Schemas
// ============================================================================

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
// Transfer Order Operations
// ============================================================================

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

export const ApproveTransferOrderSchema = z.object({
  transferOrderId: z.string().uuid('Valid transfer order ID is required'),
  approvedBy: z.string().uuid('Valid user ID is required'),
  itemAdjustments: z.array(z.object({
    itemId: z.string().uuid(),
    approvedQuantity: z.number().min(0),
  })).optional(),
  notes: z.string().max(2000).optional(),
});

export const SendTransferOrderSchema = z.object({
  transferOrderId: z.string().uuid('Valid transfer order ID is required'),
  sentBy: z.string().uuid('Valid user ID is required'),
  trackingNumber: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
});

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

export const CancelTransferOrderSchema = z.object({
  transferOrderId: z.string().uuid('Valid transfer order ID is required'),
  cancelledBy: z.string().uuid('Valid user ID is required'),
  reason: z.string().max(500).optional(),
});

// ============================================================================
// Physical Count
// ============================================================================

export const PhysicalCountItemSchema = z.object({
  itemId: z.string().uuid(),
  batchId: z.string().uuid().optional().nullable(),
  countedQuantity: z.number().min(0),
  systemQuantity: z.number().optional(), // Current system quantity for reference
  variance: z.number().optional(), // countedQuantity - systemQuantity
  notes: z.string().max(500).optional(),
});

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
// Query/Filter Schemas
// ============================================================================

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
// Response Schemas
// ============================================================================

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
// Statistics and Reports
// ============================================================================

export const TransactionStatisticsSchema = z.object({
  totalTransactions: z.number(),
  transactionsByType: z.record(TransactionTypeEnum.Enum, z.number()),
  totalValueReceived: z.number().optional(),
  totalValueIssued: z.number().optional(),
  topItems: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    transactionCount: z.number(),
    totalQuantity: z.number(),
  })).optional(),
});

export const StockMovementReportSchema = z.object({
  locationId: z.string().uuid().optional(),
  startDate: z.date(),
  endDate: z.date(),
  includeTypes: z.array(TransactionTypeEnum).optional(),
  groupBy: z.enum(['item', 'location', 'type', 'date']).default('item'),
});

// ============================================================================
// Type Exports
// ============================================================================

export type Transaction = z.infer<typeof TransactionSchema>;
export type ReceiveStock = z.infer<typeof ReceiveStockSchema>;
export type IssueStock = z.infer<typeof IssueStockSchema>;
export type AdjustStock = z.infer<typeof AdjustStockSchema>;
export type ReserveStock = z.infer<typeof ReserveStockSchema>;
export type ReleaseReservedStock = z.infer<typeof ReleaseReservedStockSchema>;

export type TransferOrder = z.infer<typeof TransferOrderSchema>;
export type CreateTransferOrder = z.infer<typeof CreateTransferOrderSchema>;
export type ApproveTransferOrder = z.infer<typeof ApproveTransferOrderSchema>;
export type SendTransferOrder = z.infer<typeof SendTransferOrderSchema>;
export type ReceiveTransferOrder = z.infer<typeof ReceiveTransferOrderSchema>;
export type CancelTransferOrder = z.infer<typeof CancelTransferOrderSchema>;

export type PhysicalCount = z.infer<typeof PhysicalCountSchema>;
export type PhysicalCountItem = z.infer<typeof PhysicalCountItemSchema>;

export type TransactionFilter = z.infer<typeof TransactionFilterSchema>;
export type TransferOrderFilter = z.infer<typeof TransferOrderFilterSchema>;

export type TransactionWithDetails = z.infer<typeof TransactionWithDetailsSchema>;
export type TransferOrderWithDetails = z.infer<typeof TransferOrderWithDetailsSchema>;

export type TransactionStatistics = z.infer<typeof TransactionStatisticsSchema>;
export type StockMovementReport = z.infer<typeof StockMovementReportSchema>;

export type TransactionType = z.infer<typeof TransactionTypeEnum>;
export type TransferStatus = z.infer<typeof TransferStatusEnum>;
export type AdjustmentReason = z.infer<typeof AdjustmentReasonEnum>;
export type ReferenceType = z.infer<typeof ReferenceTypeEnum>;
