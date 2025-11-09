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
 * Inventory transaction types
 */
export declare enum InventoryTransactionType {
    RECEIPT = "RECEIPT",
    ISSUE = "ISSUE",
    ADJUSTMENT = "ADJUSTMENT",
    TRANSFER = "TRANSFER",
    CYCLE_COUNT = "CYCLE_COUNT",
    PHYSICAL_COUNT = "PHYSICAL_COUNT",
    SCRAP = "SCRAP",
    RETURN = "RETURN"
}
/**
 * Transaction status enumeration
 */
export declare enum TransactionStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    POSTED = "POSTED",
    COMPLETED = "COMPLETED",
    REVERSED = "REVERSED",
    CANCELLED = "CANCELLED",
    REJECTED = "REJECTED"
}
/**
 * Inventory movement direction
 */
export declare enum MovementDirection {
    IN = "IN",
    OUT = "OUT",
    NEUTRAL = "NEUTRAL"
}
/**
 * Transaction posting status
 */
export declare enum PostingStatus {
    NOT_POSTED = "NOT_POSTED",
    POSTING = "POSTING",
    POSTED = "POSTED",
    POSTING_FAILED = "POSTING_FAILED",
    REVERSAL_PENDING = "REVERSAL_PENDING",
    REVERSED = "REVERSED"
}
/**
 * Lot tracking mode
 */
export declare enum LotTrackingMode {
    NONE = "NONE",
    LOT = "LOT",
    SERIAL = "SERIAL",
    BATCH = "BATCH"
}
/**
 * Adjustment reason codes
 */
export declare enum AdjustmentReason {
    DAMAGE = "DAMAGE",
    OBSOLESCENCE = "OBSOLESCENCE",
    THEFT = "THEFT",
    CYCLE_COUNT = "CYCLE_COUNT",
    PHYSICAL_COUNT = "PHYSICAL_COUNT",
    DATA_CORRECTION = "DATA_CORRECTION",
    EXPIRATION = "EXPIRATION",
    QUALITY_ISSUE = "QUALITY_ISSUE",
    SYSTEM_ERROR = "SYSTEM_ERROR",
    OTHER = "OTHER"
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
    uom: string;
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
    poNumber?: string;
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
export declare function createInventoryReceipt(receiptData: Partial<InventoryReceipt>): InventoryReceipt;
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
export declare function addReceiptLine(receipt: InventoryReceipt, lineData: Partial<InventoryTransactionLine>): InventoryReceipt;
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
export declare function removeReceiptLine(receipt: InventoryReceipt, lineId: string): InventoryReceipt;
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
export declare function updateReceiptLineQuantity(receipt: InventoryReceipt, lineId: string, quantity: number): InventoryReceipt;
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
export declare function addReceiptLotSerial(receipt: InventoryReceipt, lineId: string, lotSerialInfo: LotSerialInfo): InventoryReceipt;
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
export declare function validateReceipt(receipt: InventoryReceipt): ValidationResult;
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
export declare function approveReceipt(receipt: InventoryReceipt, approvedBy: string): InventoryReceipt;
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
export declare function postReceipt(receipt: InventoryReceipt, currentBalances: InventoryBalance[]): PostingResult;
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
export declare function recalculateReceiptTotals(receipt: InventoryReceipt): InventoryReceipt;
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
export declare function createInventoryIssue(issueData: Partial<InventoryIssue>): InventoryIssue;
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
export declare function addIssueLine(issue: InventoryIssue, lineData: Partial<InventoryTransactionLine>): InventoryIssue;
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
export declare function validateIssueAvailability(issue: InventoryIssue, balances: InventoryBalance[]): ValidationResult;
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
export declare function allocateInventoryForIssue(issue: InventoryIssue, balances: InventoryBalance[]): InventoryBalance[];
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
export declare function postIssue(issue: InventoryIssue, currentBalances: InventoryBalance[]): PostingResult;
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
export declare function removeIssueLine(issue: InventoryIssue, lineId: string): InventoryIssue;
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
export declare function updateIssueLineQuantity(issue: InventoryIssue, lineId: string, quantity: number): InventoryIssue;
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
export declare function pickInventoryForIssue(issue: InventoryIssue, pickedBy: string): InventoryIssue;
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
export declare function recalculateIssueTotals(issue: InventoryIssue): InventoryIssue;
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
export declare function createInventoryAdjustment(adjustmentData: Partial<InventoryAdjustment>): InventoryAdjustment;
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
export declare function addAdjustmentLine(adjustment: InventoryAdjustment, lineData: Partial<InventoryTransactionLine>): InventoryAdjustment;
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
export declare function validateAdjustment(adjustment: InventoryAdjustment, balances: InventoryBalance[]): ValidationResult;
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
export declare function approveAdjustment(adjustment: InventoryAdjustment, approvedBy: string): InventoryAdjustment;
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
export declare function postAdjustment(adjustment: InventoryAdjustment, currentBalances: InventoryBalance[]): PostingResult;
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
export declare function createCycleCountAdjustment(countRequest: CycleCountRequest, countLines: PhysicalCountLine[], systemBalances: InventoryBalance[]): InventoryAdjustment;
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
export declare function removeAdjustmentLine(adjustment: InventoryAdjustment, lineId: string): InventoryAdjustment;
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
export declare function updateAdjustmentLineQuantity(adjustment: InventoryAdjustment, lineId: string, quantity: number): InventoryAdjustment;
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
export declare function recalculateAdjustmentTotals(adjustment: InventoryAdjustment): InventoryAdjustment;
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
export declare function createInventoryTransfer(transferData: Partial<InventoryTransfer>): InventoryTransfer;
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
export declare function addTransferLine(transfer: InventoryTransfer, lineData: Partial<InventoryTransactionLine>): InventoryTransfer;
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
export declare function validateTransferAvailability(transfer: InventoryTransfer, balances: InventoryBalance[]): ValidationResult;
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
export declare function shipInventoryTransfer(transfer: InventoryTransfer, shippedBy: string, balances: InventoryBalance[]): InventoryTransfer;
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
export declare function receiveInventoryTransfer(transfer: InventoryTransfer, receivedBy: string): InventoryTransfer;
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
export declare function postTransfer(transfer: InventoryTransfer, currentBalances: InventoryBalance[]): PostingResult;
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
export declare function removeTransferLine(transfer: InventoryTransfer, lineId: string): InventoryTransfer;
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
export declare function updateTransferLineQuantity(transfer: InventoryTransfer, lineId: string, quantity: number): InventoryTransfer;
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
export declare function recalculateTransferTotals(transfer: InventoryTransfer): InventoryTransfer;
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
export declare function createTransactionReversal(originalTransactionId: string, transactionType: InventoryTransactionType, reversedBy: string, reason: string): TransactionReversal;
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
export declare function reverseInventoryReceipt(originalReceipt: InventoryReceipt, reversedBy: string, reason: string): InventoryReceipt;
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
export declare function reverseInventoryIssue(originalIssue: InventoryIssue, reversedBy: string, reason: string): InventoryIssue;
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
export declare function createAuditTrailEntry(transactionId: string, transactionType: InventoryTransactionType, userId: string, userName: string, action: string, changes: AuditChange[]): AuditTrailEntry;
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
export declare function validateTransactionReversal(reversal: TransactionReversal, originalTransaction: any): ValidationResult;
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
export declare function searchInventoryTransactions(transactions: any[], criteria: TransactionSearchCriteria): any[];
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
export declare function generateTransactionAuditReport(transactionId: string, auditTrail: AuditTrailEntry[]): {
    transactionId: string;
    timeline: Array<{
        timestamp: Date;
        action: string;
        user: string;
        changes: number;
    }>;
    totalChanges: number;
    userActivity: Record<string, number>;
};
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
export declare function exportInventoryTransactionsToCSV(transactions: any[], type: InventoryTransactionType): string;
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
export declare function validatePostingPermissions(userId: string, transactionType: InventoryTransactionType, permissions: Record<string, string[]>): {
    allowed: boolean;
    reason?: string;
};
declare const _default: {
    createInventoryReceipt: typeof createInventoryReceipt;
    addReceiptLine: typeof addReceiptLine;
    removeReceiptLine: typeof removeReceiptLine;
    updateReceiptLineQuantity: typeof updateReceiptLineQuantity;
    addReceiptLotSerial: typeof addReceiptLotSerial;
    validateReceipt: typeof validateReceipt;
    approveReceipt: typeof approveReceipt;
    postReceipt: typeof postReceipt;
    recalculateReceiptTotals: typeof recalculateReceiptTotals;
    createInventoryIssue: typeof createInventoryIssue;
    addIssueLine: typeof addIssueLine;
    validateIssueAvailability: typeof validateIssueAvailability;
    allocateInventoryForIssue: typeof allocateInventoryForIssue;
    postIssue: typeof postIssue;
    removeIssueLine: typeof removeIssueLine;
    updateIssueLineQuantity: typeof updateIssueLineQuantity;
    pickInventoryForIssue: typeof pickInventoryForIssue;
    recalculateIssueTotals: typeof recalculateIssueTotals;
    createInventoryAdjustment: typeof createInventoryAdjustment;
    addAdjustmentLine: typeof addAdjustmentLine;
    validateAdjustment: typeof validateAdjustment;
    approveAdjustment: typeof approveAdjustment;
    postAdjustment: typeof postAdjustment;
    createCycleCountAdjustment: typeof createCycleCountAdjustment;
    removeAdjustmentLine: typeof removeAdjustmentLine;
    updateAdjustmentLineQuantity: typeof updateAdjustmentLineQuantity;
    recalculateAdjustmentTotals: typeof recalculateAdjustmentTotals;
    createInventoryTransfer: typeof createInventoryTransfer;
    addTransferLine: typeof addTransferLine;
    validateTransferAvailability: typeof validateTransferAvailability;
    shipInventoryTransfer: typeof shipInventoryTransfer;
    receiveInventoryTransfer: typeof receiveInventoryTransfer;
    postTransfer: typeof postTransfer;
    removeTransferLine: typeof removeTransferLine;
    updateTransferLineQuantity: typeof updateTransferLineQuantity;
    recalculateTransferTotals: typeof recalculateTransferTotals;
    createTransactionReversal: typeof createTransactionReversal;
    reverseInventoryReceipt: typeof reverseInventoryReceipt;
    reverseInventoryIssue: typeof reverseInventoryIssue;
    createAuditTrailEntry: typeof createAuditTrailEntry;
    validateTransactionReversal: typeof validateTransactionReversal;
    searchInventoryTransactions: typeof searchInventoryTransactions;
    generateTransactionAuditReport: typeof generateTransactionAuditReport;
    exportInventoryTransactionsToCSV: typeof exportInventoryTransactionsToCSV;
    validatePostingPermissions: typeof validatePostingPermissions;
};
export default _default;
//# sourceMappingURL=inventory-transactions-kit.d.ts.map