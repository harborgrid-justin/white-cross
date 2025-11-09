/**
 * LOC: INV-TXN-001
 * File: /reuse/logistics/inventory-transactions-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Warehouse controllers
 *   - Inventory services
 *   - Stock management modules
 *   - Logistics processors
 */

/**
 * File: /reuse/logistics/inventory-transactions-kit.ts
 * Locator: WC-LOGISTICS-INV-TXN-001
 * Purpose: Comprehensive Inventory Transaction Management - Complete transaction lifecycle for warehouse operations
 *
 * Upstream: Independent utility module for inventory transaction operations
 * Downstream: ../backend/logistics/*, Warehouse modules, Inventory services, Stock processors
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 45 utility functions for inventory receipts, issues, adjustments, transfers, reversals, audit trails
 *
 * LLM Context: Enterprise-grade inventory transaction utilities for warehouse operations to compete with JD Edwards.
 * Provides comprehensive transaction lifecycle management, receipt processing, issue tracking, stock adjustments,
 * warehouse transfers, lot/serial tracking, transaction reversals, audit trails, posting mechanisms, and
 * real-time inventory updates with full traceability and compliance support.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Inventory transaction types
 */
export enum InventoryTransactionType {
  RECEIPT = 'RECEIPT',
  ISSUE = 'ISSUE',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
  CYCLE_COUNT = 'CYCLE_COUNT',
  PHYSICAL_COUNT = 'PHYSICAL_COUNT',
  SCRAP = 'SCRAP',
  RETURN = 'RETURN',
}

/**
 * Transaction status enumeration
 */
export enum TransactionStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  POSTED = 'POSTED',
  COMPLETED = 'COMPLETED',
  REVERSED = 'REVERSED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

/**
 * Inventory movement direction
 */
export enum MovementDirection {
  IN = 'IN',
  OUT = 'OUT',
  NEUTRAL = 'NEUTRAL',
}

/**
 * Transaction posting status
 */
export enum PostingStatus {
  NOT_POSTED = 'NOT_POSTED',
  POSTING = 'POSTING',
  POSTED = 'POSTED',
  POSTING_FAILED = 'POSTING_FAILED',
  REVERSAL_PENDING = 'REVERSAL_PENDING',
  REVERSED = 'REVERSED',
}

/**
 * Lot tracking mode
 */
export enum LotTrackingMode {
  NONE = 'NONE',
  LOT = 'LOT',
  SERIAL = 'SERIAL',
  BATCH = 'BATCH',
}

/**
 * Adjustment reason codes
 */
export enum AdjustmentReason {
  DAMAGE = 'DAMAGE',
  OBSOLESCENCE = 'OBSOLESCENCE',
  THEFT = 'THEFT',
  CYCLE_COUNT = 'CYCLE_COUNT',
  PHYSICAL_COUNT = 'PHYSICAL_COUNT',
  DATA_CORRECTION = 'DATA_CORRECTION',
  EXPIRATION = 'EXPIRATION',
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  OTHER = 'OTHER',
}

/**
 * Lot/Serial tracking information
 */
export interface LotSerialInfo {
  lotNumber?: string;
  serialNumber?: string;
  batchNumber?: string;
  expirationDate?: Date;
  manufactureDate?: Date;
  receivedDate?: Date;
  vendorLotNumber?: string;
  quantity: number;
  trackingMode: LotTrackingMode;
}

/**
 * Inventory transaction line item
 */
export interface InventoryTransactionLine {
  lineId: string;
  lineNumber: number;
  itemId: string;
  itemCode: string;
  itemDescription: string;
  uom: string; // Unit of measure
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  locationId: string;
  binLocation?: string;
  lotSerial?: LotSerialInfo[];
  notes?: string;
  reasonCode?: AdjustmentReason;
  metadata?: Record<string, any>;
}

/**
 * Inventory receipt transaction
 */
export interface InventoryReceipt {
  receiptId: string;
  receiptNumber: string;
  warehouseId: string;
  receiptDate: Date;
  poNumber?: string; // Purchase order reference
  vendorId?: string;
  receivedBy: string;
  status: TransactionStatus;
  postingStatus: PostingStatus;
  lines: InventoryTransactionLine[];
  totalQuantity: number;
  totalCost: number;
  notes?: string;
  documentReferences?: string[];
  createdAt: Date;
  postedAt?: Date;
  reversedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Inventory issue transaction
 */
export interface InventoryIssue {
  issueId: string;
  issueNumber: string;
  warehouseId: string;
  issueDate: Date;
  workOrderNumber?: string;
  departmentId?: string;
  costCenter?: string;
  issuedBy: string;
  issuedTo?: string;
  status: TransactionStatus;
  postingStatus: PostingStatus;
  lines: InventoryTransactionLine[];
  totalQuantity: number;
  totalCost: number;
  notes?: string;
  documentReferences?: string[];
  createdAt: Date;
  postedAt?: Date;
  reversedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Inventory adjustment transaction
 */
export interface InventoryAdjustment {
  adjustmentId: string;
  adjustmentNumber: string;
  warehouseId: string;
  adjustmentDate: Date;
  adjustmentType: 'INCREASE' | 'DECREASE';
  reasonCode: AdjustmentReason;
  adjustedBy: string;
  approvedBy?: string;
  status: TransactionStatus;
  postingStatus: PostingStatus;
  lines: InventoryTransactionLine[];
  totalQuantityChange: number;
  totalCostImpact: number;
  notes?: string;
  documentReferences?: string[];
  createdAt: Date;
  approvedAt?: Date;
  postedAt?: Date;
  reversedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Inventory transfer transaction
 */
export interface InventoryTransfer {
  transferId: string;
  transferNumber: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  transferDate: Date;
  requestedBy: string;
  shippedBy?: string;
  receivedBy?: string;
  status: TransactionStatus;
  postingStatus: PostingStatus;
  lines: InventoryTransactionLine[];
  totalQuantity: number;
  totalCost: number;
  shippedDate?: Date;
  receivedDate?: Date;
  inTransit: boolean;
  notes?: string;
  documentReferences?: string[];
  createdAt: Date;
  postedAt?: Date;
  reversedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Transaction reversal record
 */
export interface TransactionReversal {
  reversalId: string;
  originalTransactionId: string;
  originalTransactionType: InventoryTransactionType;
  reversalTransactionId: string;
  reversalDate: Date;
  reversedBy: string;
  reversalReason: string;
  approvedBy?: string;
  status: TransactionStatus;
  createdAt: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Audit trail entry
 */
export interface AuditTrailEntry {
  auditId: string;
  transactionId: string;
  transactionType: InventoryTransactionType;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  changes: AuditChange[];
  ipAddress?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

/**
 * Audit change detail
 */
export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
  changeType: 'CREATE' | 'UPDATE' | 'DELETE';
}

/**
 * Posting result
 */
export interface PostingResult {
  success: boolean;
  transactionId: string;
  postedAt?: Date;
  journalEntries?: JournalEntry[];
  errors?: PostingError[];
  warnings?: string[];
}

/**
 * Journal entry for GL posting
 */
export interface JournalEntry {
  entryId: string;
  accountCode: string;
  debit: number;
  credit: number;
  description: string;
  costCenter?: string;
  departmentId?: string;
}

/**
 * Posting error
 */
export interface PostingError {
  code: string;
  message: string;
  field?: string;
  severity: 'ERROR' | 'WARNING';
}

/**
 * Inventory balance snapshot
 */
export interface InventoryBalance {
  itemId: string;
  itemCode: string;
  warehouseId: string;
  locationId: string;
  onHandQuantity: number;
  allocatedQuantity: number;
  availableQuantity: number;
  inTransitQuantity: number;
  unitCost: number;
  totalValue: number;
  lastUpdated: Date;
  lotSerialDetails?: LotSerialInfo[];
}

/**
 * Transaction validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

/**
 * Validation error
 */
export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  lineNumber?: number;
}

/**
 * Transaction search criteria
 */
export interface TransactionSearchCriteria {
  transactionType?: InventoryTransactionType[];
  status?: TransactionStatus[];
  warehouseId?: string;
  itemId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  documentNumber?: string;
  userId?: string;
  postingStatus?: PostingStatus[];
}

/**
 * Cycle count request
 */
export interface CycleCountRequest {
  warehouseId: string;
  locationIds?: string[];
  itemIds?: string[];
  countDate: Date;
  countedBy: string;
  countType: 'FULL' | 'PARTIAL' | 'ABC';
}

/**
 * Physical count line
 */
export interface PhysicalCountLine {
  lineId: string;
  itemId: string;
  itemCode: string;
  locationId: string;
  systemQuantity: number;
  countedQuantity: number;
  variance: number;
  lotSerial?: LotSerialInfo[];
  notes?: string;
}

// ============================================================================
// SECTION 1: RECEIPT TRANSACTIONS (Functions 1-9)
// ============================================================================

/**
 * 1. Creates a new inventory receipt transaction.
 *
 * @param {Partial<InventoryReceipt>} receiptData - Receipt data
 * @returns {InventoryReceipt} New receipt transaction
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const receipt = createInventoryReceipt({
 *   warehouseId: 'WH-001',
 *   vendorId: 'VENDOR-123',
 *   poNumber: 'PO-2024-001',
 *   receivedBy: 'USER-001',
 *   receiptDate: new Date()
 * });
 * ```
 */
export function createInventoryReceipt(receiptData: Partial<InventoryReceipt>): InventoryReceipt {
  if (!receiptData.warehouseId || !receiptData.receivedBy) {
    throw new Error('Warehouse ID and receiver are required');
  }

  const receiptId = generateTransactionId('RCPT');
  const receiptNumber = generateReceiptNumber(receiptData.warehouseId);

  return {
    receiptId,
    receiptNumber,
    warehouseId: receiptData.warehouseId,
    receiptDate: receiptData.receiptDate || new Date(),
    poNumber: receiptData.poNumber,
    vendorId: receiptData.vendorId,
    receivedBy: receiptData.receivedBy,
    status: TransactionStatus.DRAFT,
    postingStatus: PostingStatus.NOT_POSTED,
    lines: [],
    totalQuantity: 0,
    totalCost: 0,
    notes: receiptData.notes,
    documentReferences: receiptData.documentReferences || [],
    createdAt: new Date(),
    metadata: receiptData.metadata,
  };
}

/**
 * 2. Adds a line item to an inventory receipt.
 *
 * @param {InventoryReceipt} receipt - Receipt to update
 * @param {Partial<InventoryTransactionLine>} lineData - Line item data
 * @returns {InventoryReceipt} Updated receipt
 * @throws {Error} If line data is invalid
 *
 * @example
 * ```typescript
 * const updated = addReceiptLine(receipt, {
 *   itemId: 'ITEM-001',
 *   itemCode: 'SKU-12345',
 *   itemDescription: 'Widget A',
 *   quantity: 100,
 *   unitCost: 5.50,
 *   uom: 'EA',
 *   locationId: 'LOC-A1'
 * });
 * ```
 */
export function addReceiptLine(
  receipt: InventoryReceipt,
  lineData: Partial<InventoryTransactionLine>
): InventoryReceipt {
  if (!lineData.itemId || !lineData.quantity || lineData.quantity <= 0) {
    throw new Error('Item ID and positive quantity are required');
  }

  const lineId = crypto.randomUUID();
  const lineNumber = receipt.lines.length + 1;
  const unitCost = lineData.unitCost || 0;
  const totalCost = lineData.quantity * unitCost;

  const line: InventoryTransactionLine = {
    lineId,
    lineNumber,
    itemId: lineData.itemId,
    itemCode: lineData.itemCode || '',
    itemDescription: lineData.itemDescription || '',
    uom: lineData.uom || 'EA',
    quantity: lineData.quantity,
    unitCost,
    totalCost,
    locationId: lineData.locationId || '',
    binLocation: lineData.binLocation,
    lotSerial: lineData.lotSerial,
    notes: lineData.notes,
    reasonCode: lineData.reasonCode,
    metadata: lineData.metadata,
  };

  return recalculateReceiptTotals({
    ...receipt,
    lines: [...receipt.lines, line],
  });
}

/**
 * 3. Removes a line item from an inventory receipt.
 *
 * @param {InventoryReceipt} receipt - Receipt to update
 * @param {string} lineId - Line ID to remove
 * @returns {InventoryReceipt} Updated receipt
 *
 * @example
 * ```typescript
 * const updated = removeReceiptLine(receipt, 'line-uuid-123');
 * ```
 */
export function removeReceiptLine(receipt: InventoryReceipt, lineId: string): InventoryReceipt {
  const updatedLines = receipt.lines
    .filter(line => line.lineId !== lineId)
    .map((line, index) => ({ ...line, lineNumber: index + 1 }));

  return recalculateReceiptTotals({
    ...receipt,
    lines: updatedLines,
  });
}

/**
 * 4. Updates the quantity of a receipt line item.
 *
 * @param {InventoryReceipt} receipt - Receipt to update
 * @param {string} lineId - Line ID
 * @param {number} quantity - New quantity
 * @returns {InventoryReceipt} Updated receipt
 * @throws {Error} If quantity is invalid
 *
 * @example
 * ```typescript
 * const updated = updateReceiptLineQuantity(receipt, 'line-123', 150);
 * ```
 */
export function updateReceiptLineQuantity(
  receipt: InventoryReceipt,
  lineId: string,
  quantity: number
): InventoryReceipt {
  if (quantity <= 0) {
    throw new Error('Quantity must be positive');
  }

  const updatedLines = receipt.lines.map(line => {
    if (line.lineId === lineId) {
      const totalCost = quantity * (line.unitCost || 0);
      return { ...line, quantity, totalCost };
    }
    return line;
  });

  return recalculateReceiptTotals({
    ...receipt,
    lines: updatedLines,
  });
}

/**
 * 5. Adds lot/serial tracking information to a receipt line.
 *
 * @param {InventoryReceipt} receipt - Receipt to update
 * @param {string} lineId - Line ID
 * @param {LotSerialInfo} lotSerialInfo - Lot/serial information
 * @returns {InventoryReceipt} Updated receipt
 * @throws {Error} If lot/serial info is invalid
 *
 * @example
 * ```typescript
 * const updated = addReceiptLotSerial(receipt, 'line-123', {
 *   lotNumber: 'LOT-2024-001',
 *   quantity: 50,
 *   expirationDate: new Date('2025-12-31'),
 *   trackingMode: LotTrackingMode.LOT
 * });
 * ```
 */
export function addReceiptLotSerial(
  receipt: InventoryReceipt,
  lineId: string,
  lotSerialInfo: LotSerialInfo
): InventoryReceipt {
  const updatedLines = receipt.lines.map(line => {
    if (line.lineId === lineId) {
      const lotSerial = [...(line.lotSerial || []), lotSerialInfo];
      return { ...line, lotSerial };
    }
    return line;
  });

  return { ...receipt, lines: updatedLines };
}

/**
 * 6. Validates an inventory receipt before posting.
 *
 * @param {InventoryReceipt} receipt - Receipt to validate
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateReceipt(receipt);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export function validateReceipt(receipt: InventoryReceipt): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  if (!receipt.lines || receipt.lines.length === 0) {
    errors.push({
      code: 'NO_LINES',
      message: 'Receipt must have at least one line item',
    });
  }

  for (const line of receipt.lines) {
    if (line.quantity <= 0) {
      errors.push({
        code: 'INVALID_QUANTITY',
        message: 'Line quantity must be positive',
        lineNumber: line.lineNumber,
      });
    }

    if (!line.locationId) {
      errors.push({
        code: 'MISSING_LOCATION',
        message: 'Location is required for line item',
        lineNumber: line.lineNumber,
      });
    }

    if (line.lotSerial && line.lotSerial.length > 0) {
      const lotTotal = line.lotSerial.reduce((sum, lot) => sum + lot.quantity, 0);
      if (Math.abs(lotTotal - line.quantity) > 0.001) {
        errors.push({
          code: 'LOT_QUANTITY_MISMATCH',
          message: 'Lot quantities do not match line quantity',
          lineNumber: line.lineNumber,
        });
      }
    }

    if (!line.unitCost || line.unitCost <= 0) {
      warnings.push(`Line ${line.lineNumber}: Unit cost is zero or missing`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 7. Approves an inventory receipt for posting.
 *
 * @param {InventoryReceipt} receipt - Receipt to approve
 * @param {string} approvedBy - User ID of approver
 * @returns {InventoryReceipt} Approved receipt
 * @throws {Error} If receipt cannot be approved
 *
 * @example
 * ```typescript
 * const approved = approveReceipt(receipt, 'MANAGER-001');
 * ```
 */
export function approveReceipt(receipt: InventoryReceipt, approvedBy: string): InventoryReceipt {
  const validation = validateReceipt(receipt);
  if (!validation.valid) {
    throw new Error(`Cannot approve receipt: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  if (receipt.status === TransactionStatus.POSTED) {
    throw new Error('Cannot approve already posted receipt');
  }

  return {
    ...receipt,
    status: TransactionStatus.APPROVED,
    metadata: {
      ...receipt.metadata,
      approvedBy,
      approvedAt: new Date(),
    },
  };
}

/**
 * 8. Posts an inventory receipt to update inventory balances.
 *
 * @param {InventoryReceipt} receipt - Receipt to post
 * @param {InventoryBalance[]} currentBalances - Current inventory balances
 * @returns {PostingResult} Posting result with updated balances
 * @throws {Error} If posting fails
 *
 * @example
 * ```typescript
 * const result = postReceipt(receipt, inventoryBalances);
 * if (result.success) {
 *   console.log('Receipt posted successfully');
 * }
 * ```
 */
export function postReceipt(
  receipt: InventoryReceipt,
  currentBalances: InventoryBalance[]
): PostingResult {
  const validation = validateReceipt(receipt);
  if (!validation.valid) {
    return {
      success: false,
      transactionId: receipt.receiptId,
      errors: validation.errors.map(e => ({
        code: e.code,
        message: e.message,
        field: e.field,
        severity: 'ERROR' as const,
      })),
    };
  }

  try {
    const journalEntries: JournalEntry[] = [];

    // Generate GL entries for inventory receipt
    for (const line of receipt.lines) {
      // Debit: Inventory Asset Account
      journalEntries.push({
        entryId: crypto.randomUUID(),
        accountCode: '1400', // Inventory asset account
        debit: line.totalCost || 0,
        credit: 0,
        description: `Receipt ${receipt.receiptNumber} - ${line.itemDescription}`,
      });

      // Credit: Inventory Clearing/AP Account
      journalEntries.push({
        entryId: crypto.randomUUID(),
        accountCode: '2100', // Accounts payable
        debit: 0,
        credit: line.totalCost || 0,
        description: `Receipt ${receipt.receiptNumber} - ${line.itemDescription}`,
      });
    }

    return {
      success: true,
      transactionId: receipt.receiptId,
      postedAt: new Date(),
      journalEntries,
      warnings: validation.warnings,
    };
  } catch (error) {
    return {
      success: false,
      transactionId: receipt.receiptId,
      errors: [
        {
          code: 'POSTING_ERROR',
          message: error instanceof Error ? error.message : 'Unknown posting error',
          severity: 'ERROR',
        },
      ],
    };
  }
}

/**
 * 9. Recalculates all totals for an inventory receipt.
 *
 * @param {InventoryReceipt} receipt - Receipt to recalculate
 * @returns {InventoryReceipt} Receipt with updated totals
 *
 * @example
 * ```typescript
 * const updated = recalculateReceiptTotals(receipt);
 * ```
 */
export function recalculateReceiptTotals(receipt: InventoryReceipt): InventoryReceipt {
  const totalQuantity = receipt.lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalCost = receipt.lines.reduce((sum, line) => sum + (line.totalCost || 0), 0);

  return {
    ...receipt,
    totalQuantity,
    totalCost,
  };
}

// ============================================================================
// SECTION 2: ISSUE TRANSACTIONS (Functions 10-18)
// ============================================================================

/**
 * 10. Creates a new inventory issue transaction.
 *
 * @param {Partial<InventoryIssue>} issueData - Issue data
 * @returns {InventoryIssue} New issue transaction
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const issue = createInventoryIssue({
 *   warehouseId: 'WH-001',
 *   workOrderNumber: 'WO-2024-001',
 *   departmentId: 'DEPT-PROD',
 *   issuedBy: 'USER-001',
 *   issueDate: new Date()
 * });
 * ```
 */
export function createInventoryIssue(issueData: Partial<InventoryIssue>): InventoryIssue {
  if (!issueData.warehouseId || !issueData.issuedBy) {
    throw new Error('Warehouse ID and issuer are required');
  }

  const issueId = generateTransactionId('ISU');
  const issueNumber = generateIssueNumber(issueData.warehouseId);

  return {
    issueId,
    issueNumber,
    warehouseId: issueData.warehouseId,
    issueDate: issueData.issueDate || new Date(),
    workOrderNumber: issueData.workOrderNumber,
    departmentId: issueData.departmentId,
    costCenter: issueData.costCenter,
    issuedBy: issueData.issuedBy,
    issuedTo: issueData.issuedTo,
    status: TransactionStatus.DRAFT,
    postingStatus: PostingStatus.NOT_POSTED,
    lines: [],
    totalQuantity: 0,
    totalCost: 0,
    notes: issueData.notes,
    documentReferences: issueData.documentReferences || [],
    createdAt: new Date(),
    metadata: issueData.metadata,
  };
}

/**
 * 11. Adds a line item to an inventory issue.
 *
 * @param {InventoryIssue} issue - Issue to update
 * @param {Partial<InventoryTransactionLine>} lineData - Line item data
 * @returns {InventoryIssue} Updated issue
 * @throws {Error} If line data is invalid
 *
 * @example
 * ```typescript
 * const updated = addIssueLine(issue, {
 *   itemId: 'ITEM-001',
 *   itemCode: 'SKU-12345',
 *   quantity: 50,
 *   uom: 'EA',
 *   locationId: 'LOC-A1'
 * });
 * ```
 */
export function addIssueLine(
  issue: InventoryIssue,
  lineData: Partial<InventoryTransactionLine>
): InventoryIssue {
  if (!lineData.itemId || !lineData.quantity || lineData.quantity <= 0) {
    throw new Error('Item ID and positive quantity are required');
  }

  const lineId = crypto.randomUUID();
  const lineNumber = issue.lines.length + 1;
  const unitCost = lineData.unitCost || 0;
  const totalCost = lineData.quantity * unitCost;

  const line: InventoryTransactionLine = {
    lineId,
    lineNumber,
    itemId: lineData.itemId,
    itemCode: lineData.itemCode || '',
    itemDescription: lineData.itemDescription || '',
    uom: lineData.uom || 'EA',
    quantity: lineData.quantity,
    unitCost,
    totalCost,
    locationId: lineData.locationId || '',
    binLocation: lineData.binLocation,
    lotSerial: lineData.lotSerial,
    notes: lineData.notes,
    reasonCode: lineData.reasonCode,
    metadata: lineData.metadata,
  };

  return recalculateIssueTotals({
    ...issue,
    lines: [...issue.lines, line],
  });
}

/**
 * 12. Validates inventory availability for an issue.
 *
 * @param {InventoryIssue} issue - Issue to validate
 * @param {InventoryBalance[]} balances - Current inventory balances
 * @returns {ValidationResult} Validation result with availability check
 *
 * @example
 * ```typescript
 * const validation = validateIssueAvailability(issue, inventoryBalances);
 * if (!validation.valid) {
 *   console.error('Insufficient inventory:', validation.errors);
 * }
 * ```
 */
export function validateIssueAvailability(
  issue: InventoryIssue,
  balances: InventoryBalance[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  for (const line of issue.lines) {
    const balance = balances.find(
      b => b.itemId === line.itemId && b.warehouseId === issue.warehouseId && b.locationId === line.locationId
    );

    if (!balance) {
      errors.push({
        code: 'NO_BALANCE',
        message: `No inventory balance found for item ${line.itemCode} in location ${line.locationId}`,
        lineNumber: line.lineNumber,
      });
      continue;
    }

    if (balance.availableQuantity < line.quantity) {
      errors.push({
        code: 'INSUFFICIENT_INVENTORY',
        message: `Insufficient inventory: Available ${balance.availableQuantity}, Required ${line.quantity}`,
        lineNumber: line.lineNumber,
      });
    }

    if (balance.onHandQuantity < line.quantity) {
      errors.push({
        code: 'INSUFFICIENT_ONHAND',
        message: `Insufficient on-hand quantity for item ${line.itemCode}`,
        lineNumber: line.lineNumber,
      });
    }
  }

  if (issue.lines.length === 0) {
    errors.push({
      code: 'NO_LINES',
      message: 'Issue must have at least one line item',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 13. Allocates inventory for an issue (reserves inventory).
 *
 * @param {InventoryIssue} issue - Issue to allocate
 * @param {InventoryBalance[]} balances - Current inventory balances
 * @returns {InventoryBalance[]} Updated balances with allocations
 * @throws {Error} If allocation fails
 *
 * @example
 * ```typescript
 * const updatedBalances = allocateInventoryForIssue(issue, balances);
 * ```
 */
export function allocateInventoryForIssue(
  issue: InventoryIssue,
  balances: InventoryBalance[]
): InventoryBalance[] {
  const validation = validateIssueAvailability(issue, balances);
  if (!validation.valid) {
    throw new Error(`Cannot allocate: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  return balances.map(balance => {
    const issueLine = issue.lines.find(
      line =>
        line.itemId === balance.itemId &&
        line.locationId === balance.locationId &&
        issue.warehouseId === balance.warehouseId
    );

    if (issueLine) {
      return {
        ...balance,
        allocatedQuantity: balance.allocatedQuantity + issueLine.quantity,
        availableQuantity: balance.availableQuantity - issueLine.quantity,
        lastUpdated: new Date(),
      };
    }

    return balance;
  });
}

/**
 * 14. Posts an inventory issue to update inventory balances.
 *
 * @param {InventoryIssue} issue - Issue to post
 * @param {InventoryBalance[]} currentBalances - Current inventory balances
 * @returns {PostingResult} Posting result with updated balances
 *
 * @example
 * ```typescript
 * const result = postIssue(issue, inventoryBalances);
 * if (result.success) {
 *   console.log('Issue posted successfully');
 * }
 * ```
 */
export function postIssue(
  issue: InventoryIssue,
  currentBalances: InventoryBalance[]
): PostingResult {
  const validation = validateIssueAvailability(issue, currentBalances);
  if (!validation.valid) {
    return {
      success: false,
      transactionId: issue.issueId,
      errors: validation.errors.map(e => ({
        code: e.code,
        message: e.message,
        field: e.field,
        severity: 'ERROR' as const,
      })),
    };
  }

  try {
    const journalEntries: JournalEntry[] = [];

    // Generate GL entries for inventory issue
    for (const line of issue.lines) {
      // Debit: Cost of Goods Sold / WIP / Expense Account
      const debitAccount = issue.workOrderNumber ? '1500' : '5000'; // WIP or COGS
      journalEntries.push({
        entryId: crypto.randomUUID(),
        accountCode: debitAccount,
        debit: line.totalCost || 0,
        credit: 0,
        description: `Issue ${issue.issueNumber} - ${line.itemDescription}`,
        costCenter: issue.costCenter,
        departmentId: issue.departmentId,
      });

      // Credit: Inventory Asset Account
      journalEntries.push({
        entryId: crypto.randomUUID(),
        accountCode: '1400',
        debit: 0,
        credit: line.totalCost || 0,
        description: `Issue ${issue.issueNumber} - ${line.itemDescription}`,
      });
    }

    return {
      success: true,
      transactionId: issue.issueId,
      postedAt: new Date(),
      journalEntries,
      warnings: validation.warnings,
    };
  } catch (error) {
    return {
      success: false,
      transactionId: issue.issueId,
      errors: [
        {
          code: 'POSTING_ERROR',
          message: error instanceof Error ? error.message : 'Unknown posting error',
          severity: 'ERROR',
        },
      ],
    };
  }
}

/**
 * 15. Removes a line item from an inventory issue.
 *
 * @param {InventoryIssue} issue - Issue to update
 * @param {string} lineId - Line ID to remove
 * @returns {InventoryIssue} Updated issue
 *
 * @example
 * ```typescript
 * const updated = removeIssueLine(issue, 'line-uuid-123');
 * ```
 */
export function removeIssueLine(issue: InventoryIssue, lineId: string): InventoryIssue {
  const updatedLines = issue.lines
    .filter(line => line.lineId !== lineId)
    .map((line, index) => ({ ...line, lineNumber: index + 1 }));

  return recalculateIssueTotals({
    ...issue,
    lines: updatedLines,
  });
}

/**
 * 16. Updates the quantity of an issue line item.
 *
 * @param {InventoryIssue} issue - Issue to update
 * @param {string} lineId - Line ID
 * @param {number} quantity - New quantity
 * @returns {InventoryIssue} Updated issue
 * @throws {Error} If quantity is invalid
 *
 * @example
 * ```typescript
 * const updated = updateIssueLineQuantity(issue, 'line-123', 75);
 * ```
 */
export function updateIssueLineQuantity(
  issue: InventoryIssue,
  lineId: string,
  quantity: number
): InventoryIssue {
  if (quantity <= 0) {
    throw new Error('Quantity must be positive');
  }

  const updatedLines = issue.lines.map(line => {
    if (line.lineId === lineId) {
      const totalCost = quantity * (line.unitCost || 0);
      return { ...line, quantity, totalCost };
    }
    return line;
  });

  return recalculateIssueTotals({
    ...issue,
    lines: updatedLines,
  });
}

/**
 * 17. Picks inventory for an issue (prepares for shipment/consumption).
 *
 * @param {InventoryIssue} issue - Issue to pick
 * @param {string} pickedBy - User ID of picker
 * @returns {InventoryIssue} Issue with pick metadata
 *
 * @example
 * ```typescript
 * const picked = pickInventoryForIssue(issue, 'PICKER-001');
 * ```
 */
export function pickInventoryForIssue(issue: InventoryIssue, pickedBy: string): InventoryIssue {
  return {
    ...issue,
    status: TransactionStatus.PENDING,
    metadata: {
      ...issue.metadata,
      pickedBy,
      pickedAt: new Date(),
      pickStatus: 'PICKED',
    },
  };
}

/**
 * 18. Recalculates all totals for an inventory issue.
 *
 * @param {InventoryIssue} issue - Issue to recalculate
 * @returns {InventoryIssue} Issue with updated totals
 *
 * @example
 * ```typescript
 * const updated = recalculateIssueTotals(issue);
 * ```
 */
export function recalculateIssueTotals(issue: InventoryIssue): InventoryIssue {
  const totalQuantity = issue.lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalCost = issue.lines.reduce((sum, line) => sum + (line.totalCost || 0), 0);

  return {
    ...issue,
    totalQuantity,
    totalCost,
  };
}

// ============================================================================
// SECTION 3: ADJUSTMENT OPERATIONS (Functions 19-27)
// ============================================================================

/**
 * 19. Creates a new inventory adjustment transaction.
 *
 * @param {Partial<InventoryAdjustment>} adjustmentData - Adjustment data
 * @returns {InventoryAdjustment} New adjustment transaction
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const adjustment = createInventoryAdjustment({
 *   warehouseId: 'WH-001',
 *   adjustmentType: 'DECREASE',
 *   reasonCode: AdjustmentReason.DAMAGE,
 *   adjustedBy: 'USER-001',
 *   adjustmentDate: new Date()
 * });
 * ```
 */
export function createInventoryAdjustment(
  adjustmentData: Partial<InventoryAdjustment>
): InventoryAdjustment {
  if (!adjustmentData.warehouseId || !adjustmentData.adjustedBy || !adjustmentData.reasonCode) {
    throw new Error('Warehouse ID, adjuster, and reason code are required');
  }

  const adjustmentId = generateTransactionId('ADJ');
  const adjustmentNumber = generateAdjustmentNumber(adjustmentData.warehouseId);

  return {
    adjustmentId,
    adjustmentNumber,
    warehouseId: adjustmentData.warehouseId,
    adjustmentDate: adjustmentData.adjustmentDate || new Date(),
    adjustmentType: adjustmentData.adjustmentType || 'DECREASE',
    reasonCode: adjustmentData.reasonCode,
    adjustedBy: adjustmentData.adjustedBy,
    approvedBy: adjustmentData.approvedBy,
    status: TransactionStatus.DRAFT,
    postingStatus: PostingStatus.NOT_POSTED,
    lines: [],
    totalQuantityChange: 0,
    totalCostImpact: 0,
    notes: adjustmentData.notes,
    documentReferences: adjustmentData.documentReferences || [],
    createdAt: new Date(),
    metadata: adjustmentData.metadata,
  };
}

/**
 * 20. Adds a line item to an inventory adjustment.
 *
 * @param {InventoryAdjustment} adjustment - Adjustment to update
 * @param {Partial<InventoryTransactionLine>} lineData - Line item data
 * @returns {InventoryAdjustment} Updated adjustment
 * @throws {Error} If line data is invalid
 *
 * @example
 * ```typescript
 * const updated = addAdjustmentLine(adjustment, {
 *   itemId: 'ITEM-001',
 *   itemCode: 'SKU-12345',
 *   quantity: -10, // Negative for decrease
 *   unitCost: 5.50,
 *   uom: 'EA',
 *   locationId: 'LOC-A1',
 *   reasonCode: AdjustmentReason.DAMAGE
 * });
 * ```
 */
export function addAdjustmentLine(
  adjustment: InventoryAdjustment,
  lineData: Partial<InventoryTransactionLine>
): InventoryAdjustment {
  if (!lineData.itemId || !lineData.quantity || lineData.quantity === 0) {
    throw new Error('Item ID and non-zero quantity are required');
  }

  const lineId = crypto.randomUUID();
  const lineNumber = adjustment.lines.length + 1;
  const unitCost = lineData.unitCost || 0;
  const totalCost = lineData.quantity * unitCost;

  const line: InventoryTransactionLine = {
    lineId,
    lineNumber,
    itemId: lineData.itemId,
    itemCode: lineData.itemCode || '',
    itemDescription: lineData.itemDescription || '',
    uom: lineData.uom || 'EA',
    quantity: lineData.quantity,
    unitCost,
    totalCost,
    locationId: lineData.locationId || '',
    binLocation: lineData.binLocation,
    lotSerial: lineData.lotSerial,
    notes: lineData.notes,
    reasonCode: lineData.reasonCode || adjustment.reasonCode,
    metadata: lineData.metadata,
  };

  return recalculateAdjustmentTotals({
    ...adjustment,
    lines: [...adjustment.lines, line],
  });
}

/**
 * 21. Validates an inventory adjustment before posting.
 *
 * @param {InventoryAdjustment} adjustment - Adjustment to validate
 * @param {InventoryBalance[]} balances - Current inventory balances
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAdjustment(adjustment, inventoryBalances);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export function validateAdjustment(
  adjustment: InventoryAdjustment,
  balances: InventoryBalance[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  if (!adjustment.lines || adjustment.lines.length === 0) {
    errors.push({
      code: 'NO_LINES',
      message: 'Adjustment must have at least one line item',
    });
  }

  for (const line of adjustment.lines) {
    if (line.quantity === 0) {
      errors.push({
        code: 'ZERO_QUANTITY',
        message: 'Adjustment quantity cannot be zero',
        lineNumber: line.lineNumber,
      });
    }

    if (!line.reasonCode) {
      errors.push({
        code: 'MISSING_REASON',
        message: 'Reason code is required for adjustment',
        lineNumber: line.lineNumber,
      });
    }

    // For negative adjustments, verify sufficient inventory
    if (line.quantity < 0) {
      const balance = balances.find(
        b =>
          b.itemId === line.itemId &&
          b.warehouseId === adjustment.warehouseId &&
          b.locationId === line.locationId
      );

      if (!balance) {
        errors.push({
          code: 'NO_BALANCE',
          message: `No inventory balance found for item ${line.itemCode}`,
          lineNumber: line.lineNumber,
        });
      } else if (balance.onHandQuantity < Math.abs(line.quantity)) {
        errors.push({
          code: 'INSUFFICIENT_INVENTORY',
          message: `Insufficient inventory for adjustment: Available ${balance.onHandQuantity}, Required ${Math.abs(line.quantity)}`,
          lineNumber: line.lineNumber,
        });
      }
    }
  }

  if (!adjustment.approvedBy && adjustment.status === TransactionStatus.APPROVED) {
    warnings.push('Adjustment is marked as approved but has no approver');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 22. Approves an inventory adjustment for posting.
 *
 * @param {InventoryAdjustment} adjustment - Adjustment to approve
 * @param {string} approvedBy - User ID of approver
 * @returns {InventoryAdjustment} Approved adjustment
 * @throws {Error} If adjustment cannot be approved
 *
 * @example
 * ```typescript
 * const approved = approveAdjustment(adjustment, 'MANAGER-001');
 * ```
 */
export function approveAdjustment(
  adjustment: InventoryAdjustment,
  approvedBy: string
): InventoryAdjustment {
  if (adjustment.status === TransactionStatus.POSTED) {
    throw new Error('Cannot approve already posted adjustment');
  }

  return {
    ...adjustment,
    status: TransactionStatus.APPROVED,
    approvedBy,
    approvedAt: new Date(),
  };
}

/**
 * 23. Posts an inventory adjustment to update inventory balances.
 *
 * @param {InventoryAdjustment} adjustment - Adjustment to post
 * @param {InventoryBalance[]} currentBalances - Current inventory balances
 * @returns {PostingResult} Posting result with updated balances
 *
 * @example
 * ```typescript
 * const result = postAdjustment(adjustment, inventoryBalances);
 * if (result.success) {
 *   console.log('Adjustment posted successfully');
 * }
 * ```
 */
export function postAdjustment(
  adjustment: InventoryAdjustment,
  currentBalances: InventoryBalance[]
): PostingResult {
  const validation = validateAdjustment(adjustment, currentBalances);
  if (!validation.valid) {
    return {
      success: false,
      transactionId: adjustment.adjustmentId,
      errors: validation.errors.map(e => ({
        code: e.code,
        message: e.message,
        field: e.field,
        severity: 'ERROR' as const,
      })),
    };
  }

  if (adjustment.status !== TransactionStatus.APPROVED) {
    return {
      success: false,
      transactionId: adjustment.adjustmentId,
      errors: [
        {
          code: 'NOT_APPROVED',
          message: 'Adjustment must be approved before posting',
          severity: 'ERROR',
        },
      ],
    };
  }

  try {
    const journalEntries: JournalEntry[] = [];

    // Generate GL entries for inventory adjustment
    for (const line of adjustment.lines) {
      const costImpact = Math.abs(line.totalCost || 0);

      if (line.quantity > 0) {
        // Increase: Debit Inventory, Credit Adjustment Account
        journalEntries.push({
          entryId: crypto.randomUUID(),
          accountCode: '1400', // Inventory
          debit: costImpact,
          credit: 0,
          description: `Adjustment ${adjustment.adjustmentNumber} - ${line.itemDescription}`,
        });

        journalEntries.push({
          entryId: crypto.randomUUID(),
          accountCode: '5100', // Inventory Adjustment Expense
          debit: 0,
          credit: costImpact,
          description: `Adjustment ${adjustment.adjustmentNumber} - ${line.itemDescription}`,
        });
      } else {
        // Decrease: Debit Adjustment Account, Credit Inventory
        journalEntries.push({
          entryId: crypto.randomUUID(),
          accountCode: '5100', // Inventory Adjustment Expense
          debit: costImpact,
          credit: 0,
          description: `Adjustment ${adjustment.adjustmentNumber} - ${line.itemDescription}`,
        });

        journalEntries.push({
          entryId: crypto.randomUUID(),
          accountCode: '1400', // Inventory
          debit: 0,
          credit: costImpact,
          description: `Adjustment ${adjustment.adjustmentNumber} - ${line.itemDescription}`,
        });
      }
    }

    return {
      success: true,
      transactionId: adjustment.adjustmentId,
      postedAt: new Date(),
      journalEntries,
      warnings: validation.warnings,
    };
  } catch (error) {
    return {
      success: false,
      transactionId: adjustment.adjustmentId,
      errors: [
        {
          code: 'POSTING_ERROR',
          message: error instanceof Error ? error.message : 'Unknown posting error',
          severity: 'ERROR',
        },
      ],
    };
  }
}

/**
 * 24. Creates a cycle count adjustment from count results.
 *
 * @param {CycleCountRequest} countRequest - Cycle count request
 * @param {PhysicalCountLine[]} countLines - Physical count results
 * @param {InventoryBalance[]} systemBalances - System balances
 * @returns {InventoryAdjustment} Generated adjustment transaction
 *
 * @example
 * ```typescript
 * const adjustment = createCycleCountAdjustment(countRequest, countLines, balances);
 * ```
 */
export function createCycleCountAdjustment(
  countRequest: CycleCountRequest,
  countLines: PhysicalCountLine[],
  systemBalances: InventoryBalance[]
): InventoryAdjustment {
  const adjustment = createInventoryAdjustment({
    warehouseId: countRequest.warehouseId,
    adjustmentDate: countRequest.countDate,
    adjustmentType: 'INCREASE', // Will be determined per line
    reasonCode: AdjustmentReason.CYCLE_COUNT,
    adjustedBy: countRequest.countedBy,
  });

  const lines: InventoryTransactionLine[] = countLines
    .filter(line => line.variance !== 0)
    .map((line, index) => {
      const balance = systemBalances.find(
        b => b.itemId === line.itemId && b.locationId === line.locationId
      );

      return {
        lineId: crypto.randomUUID(),
        lineNumber: index + 1,
        itemId: line.itemId,
        itemCode: line.itemCode,
        itemDescription: '',
        uom: 'EA',
        quantity: line.variance,
        unitCost: balance?.unitCost || 0,
        totalCost: line.variance * (balance?.unitCost || 0),
        locationId: line.locationId,
        lotSerial: line.lotSerial,
        notes: `Cycle count variance: System ${line.systemQuantity}, Counted ${line.countedQuantity}`,
        reasonCode: AdjustmentReason.CYCLE_COUNT,
      };
    });

  return recalculateAdjustmentTotals({
    ...adjustment,
    lines,
  });
}

/**
 * 25. Removes a line item from an inventory adjustment.
 *
 * @param {InventoryAdjustment} adjustment - Adjustment to update
 * @param {string} lineId - Line ID to remove
 * @returns {InventoryAdjustment} Updated adjustment
 *
 * @example
 * ```typescript
 * const updated = removeAdjustmentLine(adjustment, 'line-uuid-123');
 * ```
 */
export function removeAdjustmentLine(
  adjustment: InventoryAdjustment,
  lineId: string
): InventoryAdjustment {
  const updatedLines = adjustment.lines
    .filter(line => line.lineId !== lineId)
    .map((line, index) => ({ ...line, lineNumber: index + 1 }));

  return recalculateAdjustmentTotals({
    ...adjustment,
    lines: updatedLines,
  });
}

/**
 * 26. Updates the quantity of an adjustment line item.
 *
 * @param {InventoryAdjustment} adjustment - Adjustment to update
 * @param {string} lineId - Line ID
 * @param {number} quantity - New quantity (can be negative)
 * @returns {InventoryAdjustment} Updated adjustment
 * @throws {Error} If quantity is zero
 *
 * @example
 * ```typescript
 * const updated = updateAdjustmentLineQuantity(adjustment, 'line-123', -25);
 * ```
 */
export function updateAdjustmentLineQuantity(
  adjustment: InventoryAdjustment,
  lineId: string,
  quantity: number
): InventoryAdjustment {
  if (quantity === 0) {
    throw new Error('Adjustment quantity cannot be zero');
  }

  const updatedLines = adjustment.lines.map(line => {
    if (line.lineId === lineId) {
      const totalCost = quantity * (line.unitCost || 0);
      return { ...line, quantity, totalCost };
    }
    return line;
  });

  return recalculateAdjustmentTotals({
    ...adjustment,
    lines: updatedLines,
  });
}

/**
 * 27. Recalculates all totals for an inventory adjustment.
 *
 * @param {InventoryAdjustment} adjustment - Adjustment to recalculate
 * @returns {InventoryAdjustment} Adjustment with updated totals
 *
 * @example
 * ```typescript
 * const updated = recalculateAdjustmentTotals(adjustment);
 * ```
 */
export function recalculateAdjustmentTotals(
  adjustment: InventoryAdjustment
): InventoryAdjustment {
  const totalQuantityChange = adjustment.lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalCostImpact = adjustment.lines.reduce((sum, line) => sum + (line.totalCost || 0), 0);

  return {
    ...adjustment,
    totalQuantityChange,
    totalCostImpact,
  };
}

// ============================================================================
// SECTION 4: TRANSFER PROCESSING (Functions 28-36)
// ============================================================================

/**
 * 28. Creates a new inventory transfer transaction.
 *
 * @param {Partial<InventoryTransfer>} transferData - Transfer data
 * @returns {InventoryTransfer} New transfer transaction
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const transfer = createInventoryTransfer({
 *   fromWarehouseId: 'WH-001',
 *   toWarehouseId: 'WH-002',
 *   requestedBy: 'USER-001',
 *   transferDate: new Date()
 * });
 * ```
 */
export function createInventoryTransfer(
  transferData: Partial<InventoryTransfer>
): InventoryTransfer {
  if (!transferData.fromWarehouseId || !transferData.toWarehouseId || !transferData.requestedBy) {
    throw new Error('From warehouse, to warehouse, and requester are required');
  }

  if (transferData.fromWarehouseId === transferData.toWarehouseId) {
    throw new Error('From and to warehouses must be different');
  }

  const transferId = generateTransactionId('TRF');
  const transferNumber = generateTransferNumber(transferData.fromWarehouseId);

  return {
    transferId,
    transferNumber,
    fromWarehouseId: transferData.fromWarehouseId,
    toWarehouseId: transferData.toWarehouseId,
    transferDate: transferData.transferDate || new Date(),
    requestedBy: transferData.requestedBy,
    shippedBy: transferData.shippedBy,
    receivedBy: transferData.receivedBy,
    status: TransactionStatus.DRAFT,
    postingStatus: PostingStatus.NOT_POSTED,
    lines: [],
    totalQuantity: 0,
    totalCost: 0,
    inTransit: false,
    notes: transferData.notes,
    documentReferences: transferData.documentReferences || [],
    createdAt: new Date(),
    metadata: transferData.metadata,
  };
}

/**
 * 29. Adds a line item to an inventory transfer.
 *
 * @param {InventoryTransfer} transfer - Transfer to update
 * @param {Partial<InventoryTransactionLine>} lineData - Line item data
 * @returns {InventoryTransfer} Updated transfer
 * @throws {Error} If line data is invalid
 *
 * @example
 * ```typescript
 * const updated = addTransferLine(transfer, {
 *   itemId: 'ITEM-001',
 *   itemCode: 'SKU-12345',
 *   quantity: 100,
 *   uom: 'EA',
 *   locationId: 'LOC-A1'
 * });
 * ```
 */
export function addTransferLine(
  transfer: InventoryTransfer,
  lineData: Partial<InventoryTransactionLine>
): InventoryTransfer {
  if (!lineData.itemId || !lineData.quantity || lineData.quantity <= 0) {
    throw new Error('Item ID and positive quantity are required');
  }

  const lineId = crypto.randomUUID();
  const lineNumber = transfer.lines.length + 1;
  const unitCost = lineData.unitCost || 0;
  const totalCost = lineData.quantity * unitCost;

  const line: InventoryTransactionLine = {
    lineId,
    lineNumber,
    itemId: lineData.itemId,
    itemCode: lineData.itemCode || '',
    itemDescription: lineData.itemDescription || '',
    uom: lineData.uom || 'EA',
    quantity: lineData.quantity,
    unitCost,
    totalCost,
    locationId: lineData.locationId || '',
    binLocation: lineData.binLocation,
    lotSerial: lineData.lotSerial,
    notes: lineData.notes,
    metadata: lineData.metadata,
  };

  return recalculateTransferTotals({
    ...transfer,
    lines: [...transfer.lines, line],
  });
}

/**
 * 30. Validates inventory availability for a transfer.
 *
 * @param {InventoryTransfer} transfer - Transfer to validate
 * @param {InventoryBalance[]} balances - Current inventory balances
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTransferAvailability(transfer, inventoryBalances);
 * if (!validation.valid) {
 *   console.error('Insufficient inventory:', validation.errors);
 * }
 * ```
 */
export function validateTransferAvailability(
  transfer: InventoryTransfer,
  balances: InventoryBalance[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  for (const line of transfer.lines) {
    const balance = balances.find(
      b =>
        b.itemId === line.itemId &&
        b.warehouseId === transfer.fromWarehouseId &&
        b.locationId === line.locationId
    );

    if (!balance) {
      errors.push({
        code: 'NO_BALANCE',
        message: `No inventory balance found for item ${line.itemCode} in source location`,
        lineNumber: line.lineNumber,
      });
      continue;
    }

    if (balance.availableQuantity < line.quantity) {
      errors.push({
        code: 'INSUFFICIENT_INVENTORY',
        message: `Insufficient inventory: Available ${balance.availableQuantity}, Required ${line.quantity}`,
        lineNumber: line.lineNumber,
      });
    }
  }

  if (transfer.lines.length === 0) {
    errors.push({
      code: 'NO_LINES',
      message: 'Transfer must have at least one line item',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 31. Ships an inventory transfer (moves to in-transit).
 *
 * @param {InventoryTransfer} transfer - Transfer to ship
 * @param {string} shippedBy - User ID of shipper
 * @param {InventoryBalance[]} balances - Current inventory balances
 * @returns {InventoryTransfer} Shipped transfer
 * @throws {Error} If transfer cannot be shipped
 *
 * @example
 * ```typescript
 * const shipped = shipInventoryTransfer(transfer, 'SHIPPER-001', balances);
 * ```
 */
export function shipInventoryTransfer(
  transfer: InventoryTransfer,
  shippedBy: string,
  balances: InventoryBalance[]
): InventoryTransfer {
  const validation = validateTransferAvailability(transfer, balances);
  if (!validation.valid) {
    throw new Error(`Cannot ship transfer: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  return {
    ...transfer,
    status: TransactionStatus.PENDING,
    shippedBy,
    shippedDate: new Date(),
    inTransit: true,
  };
}

/**
 * 32. Receives an inventory transfer at destination.
 *
 * @param {InventoryTransfer} transfer - Transfer to receive
 * @param {string} receivedBy - User ID of receiver
 * @returns {InventoryTransfer} Received transfer
 * @throws {Error} If transfer cannot be received
 *
 * @example
 * ```typescript
 * const received = receiveInventoryTransfer(transfer, 'RECEIVER-001');
 * ```
 */
export function receiveInventoryTransfer(
  transfer: InventoryTransfer,
  receivedBy: string
): InventoryTransfer {
  if (!transfer.inTransit) {
    throw new Error('Transfer must be shipped before it can be received');
  }

  return {
    ...transfer,
    status: TransactionStatus.COMPLETED,
    receivedBy,
    receivedDate: new Date(),
    inTransit: false,
  };
}

/**
 * 33. Posts an inventory transfer to update inventory balances.
 *
 * @param {InventoryTransfer} transfer - Transfer to post
 * @param {InventoryBalance[]} currentBalances - Current inventory balances
 * @returns {PostingResult} Posting result with updated balances
 *
 * @example
 * ```typescript
 * const result = postTransfer(transfer, inventoryBalances);
 * if (result.success) {
 *   console.log('Transfer posted successfully');
 * }
 * ```
 */
export function postTransfer(
  transfer: InventoryTransfer,
  currentBalances: InventoryBalance[]
): PostingResult {
  if (transfer.status !== TransactionStatus.COMPLETED) {
    return {
      success: false,
      transactionId: transfer.transferId,
      errors: [
        {
          code: 'NOT_COMPLETED',
          message: 'Transfer must be received before posting',
          severity: 'ERROR',
        },
      ],
    };
  }

  const validation = validateTransferAvailability(transfer, currentBalances);
  if (!validation.valid) {
    return {
      success: false,
      transactionId: transfer.transferId,
      errors: validation.errors.map(e => ({
        code: e.code,
        message: e.message,
        field: e.field,
        severity: 'ERROR' as const,
      })),
    };
  }

  try {
    const journalEntries: JournalEntry[] = [];

    // For inter-warehouse transfers, may need GL entries for different locations
    for (const line of transfer.lines) {
      // Debit: Destination Warehouse Inventory
      journalEntries.push({
        entryId: crypto.randomUUID(),
        accountCode: '1400',
        debit: line.totalCost || 0,
        credit: 0,
        description: `Transfer ${transfer.transferNumber} - ${line.itemDescription} - To ${transfer.toWarehouseId}`,
      });

      // Credit: Source Warehouse Inventory
      journalEntries.push({
        entryId: crypto.randomUUID(),
        accountCode: '1400',
        debit: 0,
        credit: line.totalCost || 0,
        description: `Transfer ${transfer.transferNumber} - ${line.itemDescription} - From ${transfer.fromWarehouseId}`,
      });
    }

    return {
      success: true,
      transactionId: transfer.transferId,
      postedAt: new Date(),
      journalEntries,
      warnings: validation.warnings,
    };
  } catch (error) {
    return {
      success: false,
      transactionId: transfer.transferId,
      errors: [
        {
          code: 'POSTING_ERROR',
          message: error instanceof Error ? error.message : 'Unknown posting error',
          severity: 'ERROR',
        },
      ],
    };
  }
}

/**
 * 34. Removes a line item from an inventory transfer.
 *
 * @param {InventoryTransfer} transfer - Transfer to update
 * @param {string} lineId - Line ID to remove
 * @returns {InventoryTransfer} Updated transfer
 *
 * @example
 * ```typescript
 * const updated = removeTransferLine(transfer, 'line-uuid-123');
 * ```
 */
export function removeTransferLine(transfer: InventoryTransfer, lineId: string): InventoryTransfer {
  const updatedLines = transfer.lines
    .filter(line => line.lineId !== lineId)
    .map((line, index) => ({ ...line, lineNumber: index + 1 }));

  return recalculateTransferTotals({
    ...transfer,
    lines: updatedLines,
  });
}

/**
 * 35. Updates the quantity of a transfer line item.
 *
 * @param {InventoryTransfer} transfer - Transfer to update
 * @param {string} lineId - Line ID
 * @param {number} quantity - New quantity
 * @returns {InventoryTransfer} Updated transfer
 * @throws {Error} If quantity is invalid
 *
 * @example
 * ```typescript
 * const updated = updateTransferLineQuantity(transfer, 'line-123', 150);
 * ```
 */
export function updateTransferLineQuantity(
  transfer: InventoryTransfer,
  lineId: string,
  quantity: number
): InventoryTransfer {
  if (quantity <= 0) {
    throw new Error('Quantity must be positive');
  }

  const updatedLines = transfer.lines.map(line => {
    if (line.lineId === lineId) {
      const totalCost = quantity * (line.unitCost || 0);
      return { ...line, quantity, totalCost };
    }
    return line;
  });

  return recalculateTransferTotals({
    ...transfer,
    lines: updatedLines,
  });
}

/**
 * 36. Recalculates all totals for an inventory transfer.
 *
 * @param {InventoryTransfer} transfer - Transfer to recalculate
 * @returns {InventoryTransfer} Transfer with updated totals
 *
 * @example
 * ```typescript
 * const updated = recalculateTransferTotals(transfer);
 * ```
 */
export function recalculateTransferTotals(transfer: InventoryTransfer): InventoryTransfer {
  const totalQuantity = transfer.lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalCost = transfer.lines.reduce((sum, line) => sum + (line.totalCost || 0), 0);

  return {
    ...transfer,
    totalQuantity,
    totalCost,
  };
}

// ============================================================================
// SECTION 5: REVERSAL & AUDIT (Functions 37-45)
// ============================================================================

/**
 * 37. Creates a reversal for a posted inventory transaction.
 *
 * @param {string} originalTransactionId - Original transaction ID
 * @param {InventoryTransactionType} transactionType - Transaction type
 * @param {string} reversedBy - User ID of reverser
 * @param {string} reason - Reversal reason
 * @returns {TransactionReversal} Reversal record
 * @throws {Error} If reversal cannot be created
 *
 * @example
 * ```typescript
 * const reversal = createTransactionReversal(
 *   'RCPT-123',
 *   InventoryTransactionType.RECEIPT,
 *   'USER-001',
 *   'Duplicate entry'
 * );
 * ```
 */
export function createTransactionReversal(
  originalTransactionId: string,
  transactionType: InventoryTransactionType,
  reversedBy: string,
  reason: string
): TransactionReversal {
  if (!reason || reason.trim().length === 0) {
    throw new Error('Reversal reason is required');
  }

  const reversalId = generateTransactionId('REV');
  const reversalTransactionId = generateTransactionId(getTypePrefix(transactionType));

  return {
    reversalId,
    originalTransactionId,
    originalTransactionType: transactionType,
    reversalTransactionId,
    reversalDate: new Date(),
    reversedBy,
    reversalReason: reason,
    status: TransactionStatus.PENDING,
    createdAt: new Date(),
  };
}

/**
 * 38. Reverses a posted inventory receipt.
 *
 * @param {InventoryReceipt} originalReceipt - Original receipt to reverse
 * @param {string} reversedBy - User ID of reverser
 * @param {string} reason - Reversal reason
 * @returns {InventoryReceipt} Reversal receipt transaction
 *
 * @example
 * ```typescript
 * const reversalReceipt = reverseInventoryReceipt(
 *   originalReceipt,
 *   'USER-001',
 *   'Incorrect vendor'
 * );
 * ```
 */
export function reverseInventoryReceipt(
  originalReceipt: InventoryReceipt,
  reversedBy: string,
  reason: string
): InventoryReceipt {
  if (originalReceipt.postingStatus !== PostingStatus.POSTED) {
    throw new Error('Can only reverse posted transactions');
  }

  if (originalReceipt.status === TransactionStatus.REVERSED) {
    throw new Error('Transaction is already reversed');
  }

  const reversalReceipt: InventoryReceipt = {
    ...originalReceipt,
    receiptId: generateTransactionId('RCPT'),
    receiptNumber: `${originalReceipt.receiptNumber}-REV`,
    lines: originalReceipt.lines.map(line => ({
      ...line,
      quantity: -line.quantity,
      totalCost: -(line.totalCost || 0),
    })),
    totalQuantity: -originalReceipt.totalQuantity,
    totalCost: -originalReceipt.totalCost,
    status: TransactionStatus.PENDING,
    postingStatus: PostingStatus.NOT_POSTED,
    createdAt: new Date(),
    metadata: {
      ...originalReceipt.metadata,
      reversalOf: originalReceipt.receiptId,
      reversedBy,
      reversalReason: reason,
    },
  };

  return reversalReceipt;
}

/**
 * 39. Reverses a posted inventory issue.
 *
 * @param {InventoryIssue} originalIssue - Original issue to reverse
 * @param {string} reversedBy - User ID of reverser
 * @param {string} reason - Reversal reason
 * @returns {InventoryIssue} Reversal issue transaction
 *
 * @example
 * ```typescript
 * const reversalIssue = reverseInventoryIssue(
 *   originalIssue,
 *   'USER-001',
 *   'Wrong work order'
 * );
 * ```
 */
export function reverseInventoryIssue(
  originalIssue: InventoryIssue,
  reversedBy: string,
  reason: string
): InventoryIssue {
  if (originalIssue.postingStatus !== PostingStatus.POSTED) {
    throw new Error('Can only reverse posted transactions');
  }

  if (originalIssue.status === TransactionStatus.REVERSED) {
    throw new Error('Transaction is already reversed');
  }

  const reversalIssue: InventoryIssue = {
    ...originalIssue,
    issueId: generateTransactionId('ISU'),
    issueNumber: `${originalIssue.issueNumber}-REV`,
    lines: originalIssue.lines.map(line => ({
      ...line,
      quantity: -line.quantity,
      totalCost: -(line.totalCost || 0),
    })),
    totalQuantity: -originalIssue.totalQuantity,
    totalCost: -originalIssue.totalCost,
    status: TransactionStatus.PENDING,
    postingStatus: PostingStatus.NOT_POSTED,
    createdAt: new Date(),
    metadata: {
      ...originalIssue.metadata,
      reversalOf: originalIssue.issueId,
      reversedBy,
      reversalReason: reason,
    },
  };

  return reversalIssue;
}

/**
 * 40. Creates an audit trail entry for a transaction.
 *
 * @param {string} transactionId - Transaction ID
 * @param {InventoryTransactionType} transactionType - Transaction type
 * @param {string} userId - User ID
 * @param {string} userName - User name
 * @param {string} action - Action performed
 * @param {AuditChange[]} changes - Changes made
 * @returns {AuditTrailEntry} Audit trail entry
 *
 * @example
 * ```typescript
 * const auditEntry = createAuditTrailEntry(
 *   'RCPT-123',
 *   InventoryTransactionType.RECEIPT,
 *   'USER-001',
 *   'John Doe',
 *   'CREATED',
 *   [{ field: 'status', oldValue: null, newValue: 'DRAFT', changeType: 'CREATE' }]
 * );
 * ```
 */
export function createAuditTrailEntry(
  transactionId: string,
  transactionType: InventoryTransactionType,
  userId: string,
  userName: string,
  action: string,
  changes: AuditChange[]
): AuditTrailEntry {
  return {
    auditId: crypto.randomUUID(),
    transactionId,
    transactionType,
    timestamp: new Date(),
    userId,
    userName,
    action,
    changes,
  };
}

/**
 * 41. Validates a transaction reversal before processing.
 *
 * @param {TransactionReversal} reversal - Reversal to validate
 * @param {any} originalTransaction - Original transaction
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTransactionReversal(reversal, originalReceipt);
 * if (!validation.valid) {
 *   console.error('Reversal validation errors:', validation.errors);
 * }
 * ```
 */
export function validateTransactionReversal(
  reversal: TransactionReversal,
  originalTransaction: any
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  if (!reversal.reversalReason || reversal.reversalReason.trim().length === 0) {
    errors.push({
      code: 'MISSING_REASON',
      message: 'Reversal reason is required',
    });
  }

  if (!originalTransaction) {
    errors.push({
      code: 'ORIGINAL_NOT_FOUND',
      message: 'Original transaction not found',
    });
    return { valid: false, errors, warnings };
  }

  if (originalTransaction.postingStatus !== PostingStatus.POSTED) {
    errors.push({
      code: 'NOT_POSTED',
      message: 'Can only reverse posted transactions',
    });
  }

  if (originalTransaction.status === TransactionStatus.REVERSED) {
    errors.push({
      code: 'ALREADY_REVERSED',
      message: 'Transaction is already reversed',
    });
  }

  if (originalTransaction.status === TransactionStatus.CANCELLED) {
    errors.push({
      code: 'CANCELLED',
      message: 'Cannot reverse a cancelled transaction',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 42. Searches inventory transactions by criteria.
 *
 * @param {any[]} transactions - All transactions
 * @param {TransactionSearchCriteria} criteria - Search criteria
 * @returns {any[]} Matching transactions
 *
 * @example
 * ```typescript
 * const results = searchInventoryTransactions(allTransactions, {
 *   transactionType: [InventoryTransactionType.RECEIPT],
 *   status: [TransactionStatus.POSTED],
 *   warehouseId: 'WH-001',
 *   dateFrom: new Date('2024-01-01')
 * });
 * ```
 */
export function searchInventoryTransactions(
  transactions: any[],
  criteria: TransactionSearchCriteria
): any[] {
  return transactions.filter(txn => {
    if (criteria.transactionType && !criteria.transactionType.includes(txn.type)) return false;
    if (criteria.status && !criteria.status.includes(txn.status)) return false;
    if (criteria.warehouseId && txn.warehouseId !== criteria.warehouseId) return false;
    if (criteria.itemId) {
      const hasItem = txn.lines?.some((line: InventoryTransactionLine) => line.itemId === criteria.itemId);
      if (!hasItem) return false;
    }
    if (criteria.dateFrom && txn.createdAt < criteria.dateFrom) return false;
    if (criteria.dateTo && txn.createdAt > criteria.dateTo) return false;
    if (criteria.documentNumber) {
      const docNumber = txn.receiptNumber || txn.issueNumber || txn.adjustmentNumber || txn.transferNumber;
      if (docNumber !== criteria.documentNumber) return false;
    }
    if (criteria.postingStatus && !criteria.postingStatus.includes(txn.postingStatus)) return false;

    return true;
  });
}

/**
 * 43. Generates audit report for a transaction.
 *
 * @param {string} transactionId - Transaction ID
 * @param {AuditTrailEntry[]} auditTrail - Audit trail entries
 * @returns {object} Audit report
 *
 * @example
 * ```typescript
 * const report = generateTransactionAuditReport('RCPT-123', auditEntries);
 * console.log('Transaction history:', report.timeline);
 * ```
 */
export function generateTransactionAuditReport(
  transactionId: string,
  auditTrail: AuditTrailEntry[]
): {
  transactionId: string;
  timeline: Array<{
    timestamp: Date;
    action: string;
    user: string;
    changes: number;
  }>;
  totalChanges: number;
  userActivity: Record<string, number>;
} {
  const transactionAudit = auditTrail.filter(entry => entry.transactionId === transactionId);

  const timeline = transactionAudit.map(entry => ({
    timestamp: entry.timestamp,
    action: entry.action,
    user: entry.userName,
    changes: entry.changes.length,
  }));

  const totalChanges = transactionAudit.reduce((sum, entry) => sum + entry.changes.length, 0);

  const userActivity: Record<string, number> = {};
  for (const entry of transactionAudit) {
    userActivity[entry.userName] = (userActivity[entry.userName] || 0) + 1;
  }

  return {
    transactionId,
    timeline,
    totalChanges,
    userActivity,
  };
}

/**
 * 44. Exports transactions to CSV format.
 *
 * @param {any[]} transactions - Transactions to export
 * @param {InventoryTransactionType} type - Transaction type
 * @returns {string} CSV content
 *
 * @example
 * ```typescript
 * const csv = exportInventoryTransactionsToCSV(receipts, InventoryTransactionType.RECEIPT);
 * fs.writeFileSync('receipts.csv', csv);
 * ```
 */
export function exportInventoryTransactionsToCSV(
  transactions: any[],
  type: InventoryTransactionType
): string {
  const headers = [
    'Transaction ID',
    'Document Number',
    'Date',
    'Warehouse ID',
    'Status',
    'Posting Status',
    'Total Quantity',
    'Total Cost',
    'Created By',
  ];

  let csv = headers.join(',') + '\n';

  for (const txn of transactions) {
    const docNumber =
      txn.receiptNumber || txn.issueNumber || txn.adjustmentNumber || txn.transferNumber || '';
    const createdBy = txn.receivedBy || txn.issuedBy || txn.adjustedBy || txn.requestedBy || '';

    const row = [
      txn.receiptId || txn.issueId || txn.adjustmentId || txn.transferId || '',
      docNumber,
      (txn.receiptDate || txn.issueDate || txn.adjustmentDate || txn.transferDate || new Date()).toISOString(),
      txn.warehouseId || txn.fromWarehouseId || '',
      txn.status,
      txn.postingStatus,
      (txn.totalQuantity || 0).toString(),
      (txn.totalCost || 0).toFixed(2),
      createdBy,
    ];
    csv += row.join(',') + '\n';
  }

  return csv;
}

/**
 * 45. Validates transaction posting permissions.
 *
 * @param {string} userId - User ID
 * @param {InventoryTransactionType} transactionType - Transaction type
 * @param {Record<string, string[]>} permissions - User permissions
 * @returns {object} Permission check result
 *
 * @example
 * ```typescript
 * const check = validatePostingPermissions(
 *   'USER-001',
 *   InventoryTransactionType.RECEIPT,
 *   userPermissions
 * );
 * if (!check.allowed) {
 *   console.error('Permission denied:', check.reason);
 * }
 * ```
 */
export function validatePostingPermissions(
  userId: string,
  transactionType: InventoryTransactionType,
  permissions: Record<string, string[]>
): {
  allowed: boolean;
  reason?: string;
} {
  const userPerms = permissions[userId] || [];

  const requiredPermission = `POST_${transactionType}`;
  const hasSpecificPermission = userPerms.includes(requiredPermission);
  const hasAdminPermission = userPerms.includes('ADMIN') || userPerms.includes('POST_ALL');

  if (hasSpecificPermission || hasAdminPermission) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `User does not have permission to post ${transactionType} transactions`,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Generates a unique transaction ID with prefix.
 */
function generateTransactionId(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Helper: Generates a receipt number.
 */
function generateReceiptNumber(warehouseId: string): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = date.getTime().toString().slice(-6);
  return `RCP-${warehouseId}-${dateStr}-${sequence}`;
}

/**
 * Helper: Generates an issue number.
 */
function generateIssueNumber(warehouseId: string): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = date.getTime().toString().slice(-6);
  return `ISU-${warehouseId}-${dateStr}-${sequence}`;
}

/**
 * Helper: Generates an adjustment number.
 */
function generateAdjustmentNumber(warehouseId: string): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = date.getTime().toString().slice(-6);
  return `ADJ-${warehouseId}-${dateStr}-${sequence}`;
}

/**
 * Helper: Generates a transfer number.
 */
function generateTransferNumber(fromWarehouseId: string): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = date.getTime().toString().slice(-6);
  return `TRF-${fromWarehouseId}-${dateStr}-${sequence}`;
}

/**
 * Helper: Gets transaction type prefix.
 */
function getTypePrefix(type: InventoryTransactionType): string {
  switch (type) {
    case InventoryTransactionType.RECEIPT:
      return 'RCPT';
    case InventoryTransactionType.ISSUE:
      return 'ISU';
    case InventoryTransactionType.ADJUSTMENT:
      return 'ADJ';
    case InventoryTransactionType.TRANSFER:
      return 'TRF';
    default:
      return 'TXN';
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Receipt Transactions
  createInventoryReceipt,
  addReceiptLine,
  removeReceiptLine,
  updateReceiptLineQuantity,
  addReceiptLotSerial,
  validateReceipt,
  approveReceipt,
  postReceipt,
  recalculateReceiptTotals,

  // Issue Transactions
  createInventoryIssue,
  addIssueLine,
  validateIssueAvailability,
  allocateInventoryForIssue,
  postIssue,
  removeIssueLine,
  updateIssueLineQuantity,
  pickInventoryForIssue,
  recalculateIssueTotals,

  // Adjustment Operations
  createInventoryAdjustment,
  addAdjustmentLine,
  validateAdjustment,
  approveAdjustment,
  postAdjustment,
  createCycleCountAdjustment,
  removeAdjustmentLine,
  updateAdjustmentLineQuantity,
  recalculateAdjustmentTotals,

  // Transfer Processing
  createInventoryTransfer,
  addTransferLine,
  validateTransferAvailability,
  shipInventoryTransfer,
  receiveInventoryTransfer,
  postTransfer,
  removeTransferLine,
  updateTransferLineQuantity,
  recalculateTransferTotals,

  // Reversal & Audit
  createTransactionReversal,
  reverseInventoryReceipt,
  reverseInventoryIssue,
  createAuditTrailEntry,
  validateTransactionReversal,
  searchInventoryTransactions,
  generateTransactionAuditReport,
  exportInventoryTransactionsToCSV,
  validatePostingPermissions,
};
