/**
 * LOC: ENCUMBR001
 * File: /reuse/government/encumbrance-accounting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../financial/budget-planning-allocation-kit (Budget operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend government financial modules
 *   - Encumbrance tracking services
 *   - Purchase order systems
 *   - Contract management modules
 */
/**
 * File: /reuse/government/encumbrance-accounting-kit.ts
 * Locator: WC-GOV-ENCUMB-001
 * Purpose: Comprehensive Encumbrance Accounting - Government purchase order and contract encumbrance management
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, budget-planning-allocation-kit
 * Downstream: ../backend/government/*, Encumbrance Services, Purchase Order Systems, Contract Management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for encumbrance creation, tracking, liquidation, validation, rollover, modification, reversal, multi-year management
 *
 * LLM Context: Enterprise-grade encumbrance accounting system for government financial management.
 * Provides comprehensive encumbrance lifecycle management, purchase order encumbrances, contract encumbrances,
 * pre-encumbrance validation, encumbrance liquidation, year-end rollover, encumbrance modification, reversal workflows,
 * multi-year encumbrance tracking, available balance calculation, reconciliation, reporting, and audit trails.
 */
import { Sequelize, Transaction } from 'sequelize';
interface EncumbranceLine {
    lineId: number;
    encumbranceId: number;
    lineNumber: number;
    accountCode: string;
    amount: number;
    liquidatedAmount: number;
    remainingAmount: number;
    description: string;
    projectCode?: string;
    activityCode?: string;
    costCenter?: string;
    glAccountId?: number;
}
interface EncumbranceLiquidation {
    liquidationId: number;
    encumbranceId: number;
    liquidationNumber: string;
    liquidationDate: Date;
    amount: number;
    invoiceNumber?: string;
    paymentNumber?: string;
    fiscalYear: number;
    fiscalPeriod: number;
    description: string;
    status: 'PENDING' | 'POSTED' | 'REVERSED';
}
interface PreEncumbranceValidation {
    valid: boolean;
    errors: string[];
    warnings: string[];
    availableBalance: number;
    requestedAmount: number;
    budgetStatus: 'SUFFICIENT' | 'INSUFFICIENT' | 'WARNING';
}
interface EncumbranceRollover {
    rolloverYear: number;
    encumbranceId: number;
    originalAmount: number;
    liquidatedAmount: number;
    rolloverAmount: number;
    newEncumbranceId?: number;
    rolloverType: 'AUTOMATIC' | 'MANUAL';
    rolloverStatus: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
    approvedBy?: string;
    approvedAt?: Date;
}
interface EncumbranceModification {
    modificationId: number;
    encumbranceId: number;
    modificationNumber: string;
    modificationType: 'INCREASE' | 'DECREASE' | 'SCOPE_CHANGE' | 'DATE_CHANGE';
    originalAmount: number;
    modifiedAmount: number;
    changeAmount: number;
    reason: string;
    modificationDate: Date;
    approvedBy?: string;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
}
interface EncumbranceReversal {
    reversalId: number;
    originalEncumbranceId: number;
    reversalNumber: string;
    reversalDate: Date;
    reversalAmount: number;
    reason: string;
    reversedBy: string;
    status: 'DRAFT' | 'POSTED' | 'CANCELLED';
}
interface AvailableBalance {
    budgetLineId: number;
    accountCode: string;
    totalBudget: number;
    totalAllocated: number;
    totalEncumbered: number;
    totalExpended: number;
    availableToEncumber: number;
    availableToExpend: number;
    pendingEncumbrances: number;
}
interface EncumbranceReconciliation {
    reconciliationDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    totalEncumbrances: number;
    totalLiquidations: number;
    totalRemaining: number;
    discrepancies: ReconciliationDiscrepancy[];
    status: 'BALANCED' | 'OUT_OF_BALANCE' | 'UNDER_REVIEW';
}
interface ReconciliationDiscrepancy {
    encumbranceNumber: string;
    expectedAmount: number;
    actualAmount: number;
    variance: number;
    reason?: string;
}
interface MultiYearEncumbrance {
    encumbranceId: number;
    startFiscalYear: number;
    endFiscalYear: number;
    totalAmount: number;
    yearlyAllocations: YearlyAllocation[];
    expirationRule: 'NO_YEAR' | 'MULTI_YEAR' | 'BIENNIUM';
}
interface YearlyAllocation {
    fiscalYear: number;
    allocatedAmount: number;
    liquidatedAmount: number;
    remainingAmount: number;
}
interface EncumbranceReport {
    reportType: 'SUMMARY' | 'DETAIL' | 'AGING' | 'VENDOR' | 'ACCOUNT';
    fiscalYear: number;
    fiscalPeriod?: number;
    filters: Record<string, any>;
    data: any[];
    totals: {
        totalEncumbered: number;
        totalLiquidated: number;
        totalRemaining: number;
    };
}
export declare class CreateEncumbranceDto {
    encumbranceType: string;
    fiscalYear: number;
    budgetLineId: number;
    accountCode: string;
    amount: number;
    vendor?: string;
    documentNumber: string;
    documentDate: Date;
    description: string;
    isMultiYear?: boolean;
    lines: EncumbranceLine[];
}
export declare class LiquidateEncumbranceDto {
    encumbranceId: number;
    amount: number;
    liquidationDate: Date;
    invoiceNumber?: string;
    paymentNumber?: string;
    description: string;
}
export declare class ModifyEncumbranceDto {
    encumbranceId: number;
    modificationType: string;
    modifiedAmount: number;
    reason: string;
    modificationDate: Date;
}
export declare class EncumbranceRolloverDto {
    rolloverYear: number;
    encumbranceIds: number[];
    rolloverType: string;
    approvedBy: string;
}
/**
 * Sequelize model for Encumbrance Headers with fiscal year tracking and multi-year support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EncumbranceHeader model
 *
 * @example
 * ```typescript
 * const Encumbrance = createEncumbranceHeaderModel(sequelize);
 * const encumbrance = await Encumbrance.create({
 *   encumbranceNumber: 'ENC-2025-001',
 *   encumbranceType: 'PURCHASE_ORDER',
 *   fiscalYear: 2025,
 *   amount: 50000,
 *   documentNumber: 'PO-2025-123',
 *   status: 'ACTIVE'
 * });
 * ```
 */
export declare const createEncumbranceHeaderModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        encumbranceNumber: string;
        encumbranceType: string;
        fiscalYear: number;
        budgetLineId: number;
        accountCode: string;
        amount: number;
        liquidatedAmount: number;
        remainingAmount: number;
        status: string;
        vendor: string | null;
        vendorId: number | null;
        description: string;
        documentNumber: string;
        documentDate: Date;
        expirationDate: Date | null;
        isMultiYear: boolean;
        startFiscalYear: number | null;
        endFiscalYear: number | null;
        costCenter: string | null;
        projectCode: string | null;
        fundCode: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        cancelledBy: string | null;
        cancelledAt: Date | null;
        cancelReason: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Encumbrance Lines with account distribution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EncumbranceLine model
 *
 * @example
 * ```typescript
 * const EncumbranceLine = createEncumbranceLineModel(sequelize);
 * const line = await EncumbranceLine.create({
 *   encumbranceId: 1,
 *   lineNumber: 1,
 *   accountCode: '5100-001',
 *   amount: 25000,
 *   description: 'Professional services'
 * });
 * ```
 */
export declare const createEncumbranceLineModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        encumbranceId: number;
        lineNumber: number;
        accountCode: string;
        amount: number;
        liquidatedAmount: number;
        remainingAmount: number;
        description: string;
        projectCode: string | null;
        activityCode: string | null;
        costCenter: string | null;
        glAccountId: number | null;
        fundCode: string | null;
        organizationCode: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Encumbrance Liquidations with invoice and payment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EncumbranceLiquidation model
 *
 * @example
 * ```typescript
 * const Liquidation = createEncumbranceLiquidationModel(sequelize);
 * const liquidation = await Liquidation.create({
 *   encumbranceId: 1,
 *   liquidationNumber: 'LIQ-2025-001',
 *   amount: 12500,
 *   invoiceNumber: 'INV-2025-456',
 *   liquidationDate: new Date(),
 *   status: 'POSTED'
 * });
 * ```
 */
export declare const createEncumbranceLiquidationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        encumbranceId: number;
        liquidationNumber: string;
        liquidationDate: Date;
        amount: number;
        invoiceNumber: string | null;
        paymentNumber: string | null;
        voucherNumber: string | null;
        fiscalYear: number;
        fiscalPeriod: number;
        description: string;
        status: string;
        reversalOf: number | null;
        reversedBy: number | null;
        glJournalEntryId: number | null;
        postedBy: string | null;
        postedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly createdBy: string;
    };
};
/**
 * Creates a new purchase order encumbrance with validation.
 *
 * @param {object} encumbranceData - Encumbrance creation data
 * @param {string} userId - User creating the encumbrance
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created encumbrance
 *
 * @example
 * ```typescript
 * const encumbrance = await createPurchaseOrderEncumbrance({
 *   fiscalYear: 2025,
 *   budgetLineId: 10,
 *   accountCode: '5100-001',
 *   amount: 50000,
 *   vendor: 'ABC Contractors',
 *   documentNumber: 'PO-2025-123',
 *   description: 'Construction materials'
 * }, 'john.doe');
 * ```
 */
export declare const createPurchaseOrderEncumbrance: (encumbranceData: any, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates a contract encumbrance with multi-year support.
 *
 * @param {object} contractData - Contract encumbrance data
 * @param {string} userId - User creating the encumbrance
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created contract encumbrance
 *
 * @example
 * ```typescript
 * const contract = await createContractEncumbrance({
 *   fiscalYear: 2025,
 *   budgetLineId: 15,
 *   amount: 500000,
 *   vendor: 'XYZ Engineering',
 *   documentNumber: 'CON-2025-456',
 *   isMultiYear: true,
 *   startFiscalYear: 2025,
 *   endFiscalYear: 2027
 * }, 'jane.smith');
 * ```
 */
export declare const createContractEncumbrance: (contractData: any, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates a blanket purchase order encumbrance.
 *
 * @param {object} blanketData - Blanket order data
 * @param {string} userId - User creating the encumbrance
 * @returns {Promise<object>} Created blanket encumbrance
 *
 * @example
 * ```typescript
 * const blanket = await createBlanketEncumbrance({
 *   fiscalYear: 2025,
 *   budgetLineId: 20,
 *   amount: 100000,
 *   vendor: 'Office Supplies Inc',
 *   documentNumber: 'BPO-2025-789',
 *   expirationDate: new Date('2025-09-30')
 * }, 'admin');
 * ```
 */
export declare const createBlanketEncumbrance: (blanketData: any, userId: string) => Promise<any>;
/**
 * Generates unique encumbrance number based on type and fiscal year.
 *
 * @param {string} prefix - Encumbrance type prefix
 * @param {number} fiscalYear - Fiscal year
 * @returns {string} Generated encumbrance number
 *
 * @example
 * ```typescript
 * const encNumber = generateEncumbranceNumber('PO', 2025);
 * // Returns: 'ENC-PO-2025-001234'
 * ```
 */
export declare const generateEncumbranceNumber: (prefix: string, fiscalYear: number) => string;
/**
 * Validates encumbrance line items for completeness and accuracy.
 *
 * @param {EncumbranceLine[]} lines - Encumbrance line items
 * @param {number} headerAmount - Header total amount
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateEncumbranceLines(lines, 50000);
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export declare const validateEncumbranceLines: (lines: EncumbranceLine[], headerAmount: number) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Validates budget availability before creating encumbrance.
 *
 * @param {number} budgetLineId - Budget line ID
 * @param {number} requestedAmount - Requested encumbrance amount
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<PreEncumbranceValidation>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateBudgetAvailability(10, 50000, 2025);
 * if (validation.budgetStatus === 'INSUFFICIENT') {
 *   throw new Error('Insufficient budget');
 * }
 * ```
 */
export declare const validateBudgetAvailability: (budgetLineId: number, requestedAmount: number, fiscalYear: number) => Promise<PreEncumbranceValidation>;
/**
 * Checks for duplicate encumbrances by document number.
 *
 * @param {string} documentNumber - Document number to check
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<{ isDuplicate: boolean; existingEncumbranceId?: number }>} Duplicate check result
 *
 * @example
 * ```typescript
 * const check = await checkDuplicateEncumbrance('PO-2025-123', 2025);
 * if (check.isDuplicate) {
 *   console.log(`Duplicate of encumbrance ${check.existingEncumbranceId}`);
 * }
 * ```
 */
export declare const checkDuplicateEncumbrance: (documentNumber: string, fiscalYear: number) => Promise<{
    isDuplicate: boolean;
    existingEncumbranceId?: number;
}>;
/**
 * Validates encumbrance against fund control rules.
 *
 * @param {object} encumbranceData - Encumbrance data to validate
 * @param {object[]} fundControls - Applicable fund controls
 * @returns {Promise<{ allowed: boolean; violations: string[] }>} Fund control validation
 *
 * @example
 * ```typescript
 * const validation = await validateFundControls(encumbranceData, fundControls);
 * if (!validation.allowed) {
 *   throw new Error(validation.violations.join(', '));
 * }
 * ```
 */
export declare const validateFundControls: (encumbranceData: any, fundControls: any[]) => Promise<{
    allowed: boolean;
    violations: string[];
}>;
/**
 * Validates vendor eligibility for encumbrance.
 *
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>} Vendor eligibility result
 *
 * @example
 * ```typescript
 * const eligibility = await validateVendorEligibility(123);
 * if (!eligibility.eligible) {
 *   throw new Error(`Vendor not eligible: ${eligibility.reasons.join(', ')}`);
 * }
 * ```
 */
export declare const validateVendorEligibility: (vendorId: number) => Promise<{
    eligible: boolean;
    reasons: string[];
}>;
/**
 * Validates account code for encumbrance transactions.
 *
 * @param {string} accountCode - Account code to validate
 * @param {string} encumbranceType - Type of encumbrance
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Account validation result
 *
 * @example
 * ```typescript
 * const validation = await validateAccountCode('5100-001', 'PURCHASE_ORDER');
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export declare const validateAccountCode: (accountCode: string, encumbranceType: string) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Liquidates encumbrance against an invoice or payment.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {object} liquidationData - Liquidation details
 * @param {string} userId - User performing liquidation
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<EncumbranceLiquidation>} Created liquidation
 *
 * @example
 * ```typescript
 * const liquidation = await liquidateEncumbrance(1, {
 *   amount: 12500,
 *   invoiceNumber: 'INV-2025-456',
 *   liquidationDate: new Date(),
 *   description: 'Partial payment for materials'
 * }, 'john.doe');
 * ```
 */
export declare const liquidateEncumbrance: (encumbranceId: number, liquidationData: any, userId: string, transaction?: Transaction) => Promise<EncumbranceLiquidation>;
/**
 * Processes partial liquidation of encumbrance.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {number} liquidationAmount - Amount to liquidate
 * @param {string} invoiceNumber - Invoice reference
 * @returns {Promise<object>} Partial liquidation result
 *
 * @example
 * ```typescript
 * const result = await processPartialLiquidation(1, 5000, 'INV-2025-789');
 * console.log(`Remaining: ${result.remainingAmount}`);
 * ```
 */
export declare const processPartialLiquidation: (encumbranceId: number, liquidationAmount: number, invoiceNumber: string) => Promise<any>;
/**
 * Liquidates entire remaining encumbrance amount.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} reason - Reason for full liquidation
 * @param {string} userId - User performing liquidation
 * @returns {Promise<object>} Full liquidation result
 *
 * @example
 * ```typescript
 * const result = await liquidateFullEncumbrance(1, 'Final payment received', 'john.doe');
 * ```
 */
export declare const liquidateFullEncumbrance: (encumbranceId: number, reason: string, userId: string) => Promise<any>;
/**
 * Reverses a posted encumbrance liquidation.
 *
 * @param {number} liquidationId - Liquidation ID to reverse
 * @param {string} reason - Reason for reversal
 * @param {string} userId - User performing reversal
 * @returns {Promise<EncumbranceReversal>} Reversal record
 *
 * @example
 * ```typescript
 * const reversal = await reverseLiquidation(5, 'Invoice rejected', 'manager.jones');
 * ```
 */
export declare const reverseLiquidation: (liquidationId: number, reason: string, userId: string) => Promise<EncumbranceReversal>;
/**
 * Retrieves liquidation history for an encumbrance.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<EncumbranceLiquidation[]>} Liquidation history
 *
 * @example
 * ```typescript
 * const history = await getLiquidationHistory(1, { status: 'POSTED' });
 * ```
 */
export declare const getLiquidationHistory: (encumbranceId: number, filters?: any) => Promise<EncumbranceLiquidation[]>;
/**
 * Increases encumbrance amount with approval workflow.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {number} increaseAmount - Amount to increase
 * @param {string} reason - Reason for increase
 * @param {string} userId - User requesting increase
 * @returns {Promise<EncumbranceModification>} Modification record
 *
 * @example
 * ```typescript
 * const modification = await increaseEncumbranceAmount(1, 10000, 'Scope expansion', 'john.doe');
 * ```
 */
export declare const increaseEncumbranceAmount: (encumbranceId: number, increaseAmount: number, reason: string, userId: string) => Promise<EncumbranceModification>;
/**
 * Decreases encumbrance amount and returns funds to budget.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {number} decreaseAmount - Amount to decrease
 * @param {string} reason - Reason for decrease
 * @param {string} userId - User requesting decrease
 * @returns {Promise<EncumbranceModification>} Modification record
 *
 * @example
 * ```typescript
 * const modification = await decreaseEncumbranceAmount(1, 5000, 'Reduced scope', 'jane.smith');
 * ```
 */
export declare const decreaseEncumbranceAmount: (encumbranceId: number, decreaseAmount: number, reason: string, userId: string) => Promise<EncumbranceModification>;
/**
 * Modifies encumbrance details (vendor, dates, etc.).
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {object} modifications - Modification details
 * @param {string} userId - User making modifications
 * @returns {Promise<object>} Updated encumbrance
 *
 * @example
 * ```typescript
 * const updated = await modifyEncumbranceDetails(1, {
 *   expirationDate: new Date('2026-12-31'),
 *   vendor: 'Updated Vendor Name'
 * }, 'admin');
 * ```
 */
export declare const modifyEncumbranceDetails: (encumbranceId: number, modifications: any, userId: string) => Promise<any>;
/**
 * Approves encumbrance modification.
 *
 * @param {number} modificationId - Modification ID
 * @param {string} approverId - User approving modification
 * @returns {Promise<object>} Approved modification
 *
 * @example
 * ```typescript
 * const approved = await approveEncumbranceModification(10, 'manager.jones');
 * ```
 */
export declare const approveEncumbranceModification: (modificationId: number, approverId: string) => Promise<any>;
/**
 * Retrieves modification history for an encumbrance.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @returns {Promise<EncumbranceModification[]>} Modification history
 *
 * @example
 * ```typescript
 * const history = await getModificationHistory(1);
 * ```
 */
export declare const getModificationHistory: (encumbranceId: number) => Promise<EncumbranceModification[]>;
/**
 * Reverses an entire encumbrance and returns funds to budget.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} reason - Reason for reversal
 * @param {string} userId - User performing reversal
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<EncumbranceReversal>} Reversal record
 *
 * @example
 * ```typescript
 * const reversal = await reverseEncumbrance(1, 'Purchase order cancelled', 'john.doe');
 * ```
 */
export declare const reverseEncumbrance: (encumbranceId: number, reason: string, userId: string, transaction?: Transaction) => Promise<EncumbranceReversal>;
/**
 * Cancels an active encumbrance.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} cancelReason - Cancellation reason
 * @param {string} userId - User cancelling encumbrance
 * @returns {Promise<object>} Cancellation result
 *
 * @example
 * ```typescript
 * const result = await cancelEncumbrance(1, 'Vendor unable to deliver', 'manager');
 * ```
 */
export declare const cancelEncumbrance: (encumbranceId: number, cancelReason: string, userId: string) => Promise<any>;
/**
 * Posts encumbrance reversal to general ledger.
 *
 * @param {number} reversalId - Reversal ID
 * @param {string} userId - User posting reversal
 * @returns {Promise<object>} Posted reversal with GL entry
 *
 * @example
 * ```typescript
 * const posted = await postEncumbranceReversal(5, 'accountant');
 * ```
 */
export declare const postEncumbranceReversal: (reversalId: number, userId: string) => Promise<any>;
/**
 * Validates reversal eligibility.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>} Reversal eligibility
 *
 * @example
 * ```typescript
 * const eligibility = await validateReversalEligibility(1);
 * if (!eligibility.eligible) {
 *   throw new Error(eligibility.reasons.join(', '));
 * }
 * ```
 */
export declare const validateReversalEligibility: (encumbranceId: number) => Promise<{
    eligible: boolean;
    reasons: string[];
}>;
/**
 * Retrieves reversal audit trail.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @returns {Promise<object[]>} Reversal audit trail
 *
 * @example
 * ```typescript
 * const trail = await getReversalAuditTrail(1);
 * ```
 */
export declare const getReversalAuditTrail: (encumbranceId: number) => Promise<any[]>;
/**
 * Processes year-end encumbrance rollover to new fiscal year.
 *
 * @param {number} fromFiscalYear - Source fiscal year
 * @param {number} toFiscalYear - Target fiscal year
 * @param {number[]} encumbranceIds - Encumbrances to rollover
 * @param {string} userId - User performing rollover
 * @returns {Promise<EncumbranceRollover[]>} Rollover results
 *
 * @example
 * ```typescript
 * const rollovers = await processYearEndRollover(2024, 2025, [1, 2, 3], 'admin');
 * ```
 */
export declare const processYearEndRollover: (fromFiscalYear: number, toFiscalYear: number, encumbranceIds: number[], userId: string) => Promise<EncumbranceRollover[]>;
/**
 * Identifies encumbrances eligible for rollover.
 *
 * @param {number} fiscalYear - Ending fiscal year
 * @param {object} [criteria] - Rollover criteria
 * @returns {Promise<object[]>} Eligible encumbrances
 *
 * @example
 * ```typescript
 * const eligible = await identifyRolloverCandidates(2024, { minAmount: 1000 });
 * ```
 */
export declare const identifyRolloverCandidates: (fiscalYear: number, criteria?: any) => Promise<any[]>;
/**
 * Validates rollover eligibility for encumbrance.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>} Rollover eligibility
 *
 * @example
 * ```typescript
 * const eligibility = await validateRolloverEligibility(1);
 * ```
 */
export declare const validateRolloverEligibility: (encumbranceId: number) => Promise<{
    eligible: boolean;
    reasons: string[];
}>;
/**
 * Creates new fiscal year encumbrance from rollover.
 *
 * @param {EncumbranceRollover} rollover - Rollover data
 * @param {string} userId - User creating new encumbrance
 * @returns {Promise<object>} New encumbrance
 *
 * @example
 * ```typescript
 * const newEnc = await createRolloverEncumbrance(rolloverData, 'admin');
 * ```
 */
export declare const createRolloverEncumbrance: (rollover: EncumbranceRollover, userId: string) => Promise<any>;
/**
 * Generates year-end rollover report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object>} Rollover report
 *
 * @example
 * ```typescript
 * const report = await generateRolloverReport(2024);
 * ```
 */
export declare const generateRolloverReport: (fiscalYear: number) => Promise<any>;
/**
 * Creates multi-year encumbrance with yearly allocations.
 *
 * @param {object} multiYearData - Multi-year encumbrance data
 * @param {string} userId - User creating encumbrance
 * @returns {Promise<MultiYearEncumbrance>} Multi-year encumbrance
 *
 * @example
 * ```typescript
 * const multiYear = await createMultiYearEncumbrance({
 *   startFiscalYear: 2025,
 *   endFiscalYear: 2027,
 *   totalAmount: 300000,
 *   yearlyAllocations: [
 *     { fiscalYear: 2025, allocatedAmount: 100000 },
 *     { fiscalYear: 2026, allocatedAmount: 100000 },
 *     { fiscalYear: 2027, allocatedAmount: 100000 }
 *   ]
 * }, 'admin');
 * ```
 */
export declare const createMultiYearEncumbrance: (multiYearData: any, userId: string) => Promise<MultiYearEncumbrance>;
/**
 * Allocates multi-year encumbrance amount to specific fiscal year.
 *
 * @param {number} encumbranceId - Multi-year encumbrance ID
 * @param {number} fiscalYear - Fiscal year for allocation
 * @param {number} amount - Amount to allocate
 * @returns {Promise<object>} Yearly allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateMultiYearAmount(1, 2026, 100000);
 * ```
 */
export declare const allocateMultiYearAmount: (encumbranceId: number, fiscalYear: number, amount: number) => Promise<any>;
/**
 * Retrieves multi-year encumbrance allocation breakdown.
 *
 * @param {number} encumbranceId - Multi-year encumbrance ID
 * @returns {Promise<YearlyAllocation[]>} Yearly allocations
 *
 * @example
 * ```typescript
 * const allocations = await getMultiYearAllocations(1);
 * ```
 */
export declare const getMultiYearAllocations: (encumbranceId: number) => Promise<YearlyAllocation[]>;
/**
 * Validates multi-year encumbrance setup.
 *
 * @param {object} multiYearData - Multi-year encumbrance data
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMultiYearEncumbrance(data);
 * ```
 */
export declare const validateMultiYearEncumbrance: (multiYearData: any) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Adjusts multi-year allocation between fiscal years.
 *
 * @param {number} encumbranceId - Multi-year encumbrance ID
 * @param {number} fromYear - Source fiscal year
 * @param {number} toYear - Target fiscal year
 * @param {number} amount - Amount to transfer
 * @returns {Promise<object>} Adjustment result
 *
 * @example
 * ```typescript
 * const result = await adjustMultiYearAllocation(1, 2025, 2026, 25000);
 * ```
 */
export declare const adjustMultiYearAllocation: (encumbranceId: number, fromYear: number, toYear: number, amount: number) => Promise<any>;
/**
 * Calculates available budget balance considering encumbrances.
 *
 * @param {number} budgetLineId - Budget line ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<AvailableBalance>} Available balance details
 *
 * @example
 * ```typescript
 * const balance = await calculateAvailableBalance(10, 2025);
 * console.log(`Available to encumber: ${balance.availableToEncumber}`);
 * ```
 */
export declare const calculateAvailableBalance: (budgetLineId: number, fiscalYear: number) => Promise<AvailableBalance>;
/**
 * Calculates unencumbered balance for budget line.
 *
 * @param {number} budgetLineId - Budget line ID
 * @returns {Promise<number>} Unencumbered balance
 *
 * @example
 * ```typescript
 * const unencumbered = await calculateUnencumberedBalance(10);
 * ```
 */
export declare const calculateUnencumberedBalance: (budgetLineId: number) => Promise<number>;
/**
 * Retrieves encumbrance summary by account code.
 *
 * @param {string} accountCode - Account code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object>} Encumbrance summary
 *
 * @example
 * ```typescript
 * const summary = await getEncumbranceSummaryByAccount('5100-001', 2025);
 * ```
 */
export declare const getEncumbranceSummaryByAccount: (accountCode: string, fiscalYear: number) => Promise<any>;
/**
 * Calculates encumbrance utilization rate.
 *
 * @param {number} budgetLineId - Budget line ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<number>} Utilization rate percentage
 *
 * @example
 * ```typescript
 * const rate = await calculateEncumbranceUtilizationRate(10, 2025);
 * console.log(`Utilization: ${rate}%`);
 * ```
 */
export declare const calculateEncumbranceUtilizationRate: (budgetLineId: number, fiscalYear: number) => Promise<number>;
/**
 * Projects available balance based on pending encumbrances.
 *
 * @param {number} budgetLineId - Budget line ID
 * @returns {Promise<object>} Projected balance
 *
 * @example
 * ```typescript
 * const projection = await projectAvailableBalance(10);
 * ```
 */
export declare const projectAvailableBalance: (budgetLineId: number) => Promise<any>;
/**
 * Reconciles encumbrances with budget allocations.
 *
 * @param {number} budgetLineId - Budget line ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<EncumbranceReconciliation>} Reconciliation results
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileEncumbrances(10, 2025, 3);
 * ```
 */
export declare const reconcileEncumbrances: (budgetLineId: number, fiscalYear: number, fiscalPeriod: number) => Promise<EncumbranceReconciliation>;
/**
 * Identifies encumbrance reconciliation discrepancies.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<ReconciliationDiscrepancy[]>} Discrepancies found
 *
 * @example
 * ```typescript
 * const discrepancies = await identifyReconciliationDiscrepancies(2025, 3);
 * ```
 */
export declare const identifyReconciliationDiscrepancies: (fiscalYear: number, fiscalPeriod: number) => Promise<ReconciliationDiscrepancy[]>;
/**
 * Generates encumbrance aging report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {object} [options] - Report options
 * @returns {Promise<EncumbranceReport>} Aging report
 *
 * @example
 * ```typescript
 * const report = await generateEncumbranceAgingReport(2025);
 * ```
 */
export declare const generateEncumbranceAgingReport: (fiscalYear: number, options?: any) => Promise<EncumbranceReport>;
/**
 * Generates encumbrance summary report by vendor.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} [vendorId] - Optional vendor filter
 * @returns {Promise<EncumbranceReport>} Vendor report
 *
 * @example
 * ```typescript
 * const report = await generateEncumbranceReportByVendor(2025, 123);
 * ```
 */
export declare const generateEncumbranceReportByVendor: (fiscalYear: number, vendorId?: number) => Promise<EncumbranceReport>;
/**
 * Exports encumbrance data for external reporting.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} format - Export format ('CSV' | 'EXCEL' | 'PDF')
 * @param {object} [filters] - Export filters
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const csvData = await exportEncumbranceData(2025, 'CSV', { status: 'ACTIVE' });
 * ```
 */
export declare const exportEncumbranceData: (fiscalYear: number, format: string, filters?: any) => Promise<Buffer>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createEncumbranceHeaderModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            encumbranceNumber: string;
            encumbranceType: string;
            fiscalYear: number;
            budgetLineId: number;
            accountCode: string;
            amount: number;
            liquidatedAmount: number;
            remainingAmount: number;
            status: string;
            vendor: string | null;
            vendorId: number | null;
            description: string;
            documentNumber: string;
            documentDate: Date;
            expirationDate: Date | null;
            isMultiYear: boolean;
            startFiscalYear: number | null;
            endFiscalYear: number | null;
            costCenter: string | null;
            projectCode: string | null;
            fundCode: string | null;
            approvedBy: string | null;
            approvedAt: Date | null;
            cancelledBy: string | null;
            cancelledAt: Date | null;
            cancelReason: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createEncumbranceLineModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            encumbranceId: number;
            lineNumber: number;
            accountCode: string;
            amount: number;
            liquidatedAmount: number;
            remainingAmount: number;
            description: string;
            projectCode: string | null;
            activityCode: string | null;
            costCenter: string | null;
            glAccountId: number | null;
            fundCode: string | null;
            organizationCode: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createEncumbranceLiquidationModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            encumbranceId: number;
            liquidationNumber: string;
            liquidationDate: Date;
            amount: number;
            invoiceNumber: string | null;
            paymentNumber: string | null;
            voucherNumber: string | null;
            fiscalYear: number;
            fiscalPeriod: number;
            description: string;
            status: string;
            reversalOf: number | null;
            reversedBy: number | null;
            glJournalEntryId: number | null;
            postedBy: string | null;
            postedAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly createdBy: string;
        };
    };
    createPurchaseOrderEncumbrance: (encumbranceData: any, userId: string, transaction?: Transaction) => Promise<any>;
    createContractEncumbrance: (contractData: any, userId: string, transaction?: Transaction) => Promise<any>;
    createBlanketEncumbrance: (blanketData: any, userId: string) => Promise<any>;
    generateEncumbranceNumber: (prefix: string, fiscalYear: number) => string;
    validateEncumbranceLines: (lines: EncumbranceLine[], headerAmount: number) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    validateBudgetAvailability: (budgetLineId: number, requestedAmount: number, fiscalYear: number) => Promise<PreEncumbranceValidation>;
    checkDuplicateEncumbrance: (documentNumber: string, fiscalYear: number) => Promise<{
        isDuplicate: boolean;
        existingEncumbranceId?: number;
    }>;
    validateFundControls: (encumbranceData: any, fundControls: any[]) => Promise<{
        allowed: boolean;
        violations: string[];
    }>;
    validateVendorEligibility: (vendorId: number) => Promise<{
        eligible: boolean;
        reasons: string[];
    }>;
    validateAccountCode: (accountCode: string, encumbranceType: string) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    liquidateEncumbrance: (encumbranceId: number, liquidationData: any, userId: string, transaction?: Transaction) => Promise<EncumbranceLiquidation>;
    processPartialLiquidation: (encumbranceId: number, liquidationAmount: number, invoiceNumber: string) => Promise<any>;
    liquidateFullEncumbrance: (encumbranceId: number, reason: string, userId: string) => Promise<any>;
    reverseLiquidation: (liquidationId: number, reason: string, userId: string) => Promise<EncumbranceReversal>;
    getLiquidationHistory: (encumbranceId: number, filters?: any) => Promise<EncumbranceLiquidation[]>;
    increaseEncumbranceAmount: (encumbranceId: number, increaseAmount: number, reason: string, userId: string) => Promise<EncumbranceModification>;
    decreaseEncumbranceAmount: (encumbranceId: number, decreaseAmount: number, reason: string, userId: string) => Promise<EncumbranceModification>;
    modifyEncumbranceDetails: (encumbranceId: number, modifications: any, userId: string) => Promise<any>;
    approveEncumbranceModification: (modificationId: number, approverId: string) => Promise<any>;
    getModificationHistory: (encumbranceId: number) => Promise<EncumbranceModification[]>;
    reverseEncumbrance: (encumbranceId: number, reason: string, userId: string, transaction?: Transaction) => Promise<EncumbranceReversal>;
    cancelEncumbrance: (encumbranceId: number, cancelReason: string, userId: string) => Promise<any>;
    postEncumbranceReversal: (reversalId: number, userId: string) => Promise<any>;
    validateReversalEligibility: (encumbranceId: number) => Promise<{
        eligible: boolean;
        reasons: string[];
    }>;
    getReversalAuditTrail: (encumbranceId: number) => Promise<any[]>;
    processYearEndRollover: (fromFiscalYear: number, toFiscalYear: number, encumbranceIds: number[], userId: string) => Promise<EncumbranceRollover[]>;
    identifyRolloverCandidates: (fiscalYear: number, criteria?: any) => Promise<any[]>;
    validateRolloverEligibility: (encumbranceId: number) => Promise<{
        eligible: boolean;
        reasons: string[];
    }>;
    createRolloverEncumbrance: (rollover: EncumbranceRollover, userId: string) => Promise<any>;
    generateRolloverReport: (fiscalYear: number) => Promise<any>;
    createMultiYearEncumbrance: (multiYearData: any, userId: string) => Promise<MultiYearEncumbrance>;
    allocateMultiYearAmount: (encumbranceId: number, fiscalYear: number, amount: number) => Promise<any>;
    getMultiYearAllocations: (encumbranceId: number) => Promise<YearlyAllocation[]>;
    validateMultiYearEncumbrance: (multiYearData: any) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    adjustMultiYearAllocation: (encumbranceId: number, fromYear: number, toYear: number, amount: number) => Promise<any>;
    calculateAvailableBalance: (budgetLineId: number, fiscalYear: number) => Promise<AvailableBalance>;
    calculateUnencumberedBalance: (budgetLineId: number) => Promise<number>;
    getEncumbranceSummaryByAccount: (accountCode: string, fiscalYear: number) => Promise<any>;
    calculateEncumbranceUtilizationRate: (budgetLineId: number, fiscalYear: number) => Promise<number>;
    projectAvailableBalance: (budgetLineId: number) => Promise<any>;
    reconcileEncumbrances: (budgetLineId: number, fiscalYear: number, fiscalPeriod: number) => Promise<EncumbranceReconciliation>;
    identifyReconciliationDiscrepancies: (fiscalYear: number, fiscalPeriod: number) => Promise<ReconciliationDiscrepancy[]>;
    generateEncumbranceAgingReport: (fiscalYear: number, options?: any) => Promise<EncumbranceReport>;
    generateEncumbranceReportByVendor: (fiscalYear: number, vendorId?: number) => Promise<EncumbranceReport>;
    exportEncumbranceData: (fiscalYear: number, format: string, filters?: any) => Promise<Buffer>;
};
export default _default;
//# sourceMappingURL=encumbrance-accounting-kit.d.ts.map