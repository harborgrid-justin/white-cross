/**
 * LOC: ENCACCT001
 * File: /reuse/edwards/financial/encumbrance-accounting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./commitment-control-kit (Commitment operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Fund accounting services
 *   - Year-end close processes
 *   - Budget control modules
 */
/**
 * File: /reuse/edwards/financial/encumbrance-accounting-kit.ts
 * Locator: WC-JDE-ENCACCT-001
 * Purpose: Comprehensive Encumbrance Accounting - JD Edwards EnterpriseOne-level encumbrance tracking, liquidation, adjustments, year-end processing
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, commitment-control-kit
 * Downstream: ../backend/financial/*, Fund Accounting Services, Year-End Close, Budget Control
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for encumbrance creation, tracking, liquidation, adjustments, reporting, year-end processing, carry-forward, fund accounting integration
 *
 * LLM Context: Enterprise-grade encumbrance accounting operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive encumbrance tracking, automated liquidation processing, encumbrance adjustments,
 * encumbrance reporting, year-end processing workflows, encumbrance carry-forward, fund accounting integration,
 * multi-year encumbrances, encumbrance variance analysis, audit trails, encumbrance history, and reconciliation.
 */
import { Sequelize, Transaction } from 'sequelize';
interface EncumbranceLine {
    lineId: number;
    encumbranceId: number;
    lineNumber: number;
    accountCode: string;
    accountId: number;
    description: string;
    originalAmount: number;
    currentAmount: number;
    liquidatedAmount: number;
    adjustedAmount: number;
    remainingAmount: number;
    budgetYear: number;
    budgetPeriod: number;
    projectCode?: string;
    activityCode?: string;
    costCenterCode?: string;
    fundCode?: string;
    organizationCode?: string;
    objectCode?: string;
    grantCode?: string;
    programCode?: string;
}
interface EncumbranceLiquidation {
    liquidationId: number;
    encumbranceId: number;
    encumbranceLineId: number;
    liquidationNumber: string;
    liquidationDate: Date;
    liquidationType: 'partial' | 'full' | 'final';
    liquidationAmount: number;
    sourceDocument: string;
    sourceDocumentType: 'invoice' | 'receipt' | 'voucher' | 'payment';
    invoiceNumber?: string;
    voucherNumber?: string;
    glJournalId?: number;
    status: 'pending' | 'posted' | 'reversed';
    postedDate?: Date;
    postedBy?: string;
    reversalReason?: string;
    reversedDate?: Date;
    reversedBy?: string;
}
interface EncumbranceAdjustment {
    adjustmentId: number;
    encumbranceId: number;
    encumbranceLineId: number;
    adjustmentNumber: string;
    adjustmentDate: Date;
    adjustmentType: 'increase' | 'decrease' | 'correction' | 'reclass';
    adjustmentAmount: number;
    originalAccountCode?: string;
    newAccountCode?: string;
    adjustmentReason: string;
    glJournalId?: number;
    status: 'pending' | 'approved' | 'posted' | 'reversed';
    approvedBy?: string;
    approvedDate?: Date;
    postedDate?: Date;
    postedBy?: string;
}
interface EncumbranceCarryForward {
    carryForwardId: number;
    sourceEncumbranceId: number;
    sourceEncumbranceLineId: number;
    targetEncumbranceId?: number;
    targetEncumbranceLineId?: number;
    sourceFiscalYear: number;
    targetFiscalYear: number;
    carryForwardDate: Date;
    carryForwardAmount: number;
    accountCode: string;
    fundCode?: string;
    projectCode?: string;
    status: 'pending' | 'approved' | 'posted' | 'rejected';
    approvalRequired: boolean;
    approvedBy?: string;
    approvedDate?: Date;
    justification?: string;
    expirationDate?: Date;
}
interface YearEndEncumbrance {
    yearEndId: number;
    fiscalYear: number;
    encumbranceId: number;
    encumbranceLineId: number;
    accountCode: string;
    originalAmount: number;
    liquidatedAmount: number;
    outstandingAmount: number;
    carryForwardAmount: number;
    lapseAmount: number;
    disposition: 'carry_forward' | 'lapse' | 'close';
    processDate: Date;
    processedBy: string;
    notes?: string;
}
interface FundEncumbrance {
    fundEncumbranceId: number;
    fundCode: string;
    fiscalYear: number;
    fiscalPeriod: number;
    accountCode: string;
    grantCode?: string;
    projectCode?: string;
    totalEncumbrances: number;
    liquidatedEncumbrances: number;
    outstandingEncumbrances: number;
    adjustments: number;
    availableBalance: number;
    fundType: 'general' | 'restricted' | 'grant' | 'project' | 'capital';
    complianceStatus: 'compliant' | 'warning' | 'violation';
}
interface EncumbranceReport {
    reportId: string;
    reportType: 'outstanding_encumbrances' | 'liquidation_summary' | 'year_end_status' | 'fund_encumbrance' | 'variance_analysis';
    fiscalYear: number;
    fiscalPeriod?: number;
    businessUnit?: string;
    fundCode?: string;
    reportData: Record<string, any>;
    generatedDate: Date;
    generatedBy: string;
}
interface EncumbranceHistory {
    historyId: number;
    encumbranceId: number;
    changeDate: Date;
    changeType: 'created' | 'liquidated' | 'adjusted' | 'reversed' | 'carried_forward' | 'closed';
    changedBy: string;
    oldAmount?: number;
    newAmount?: number;
    changeDescription: string;
    glJournalId?: number;
    auditData: Record<string, any>;
}
interface EncumbranceReconciliation {
    reconciliationId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    accountCode: string;
    glEncumbranceBalance: number;
    subledgerEncumbranceBalance: number;
    variance: number;
    variancePercent: number;
    status: 'matched' | 'variance' | 'under_investigation' | 'resolved';
    reconciliationDate: Date;
    reconciledBy?: string;
    resolutionNotes?: string;
}
export declare class CreateEncumbranceDto {
    encumbranceDate: Date;
    encumbranceType: string;
    businessUnit: string;
    vendor?: string;
    description: string;
    sourceDocument?: string;
    sourceDocumentType?: string;
    commitmentId?: number;
    lines: EncumbranceLine[];
}
export declare class LiquidateEncumbranceDto {
    encumbranceId: number;
    encumbranceLineId: number;
    liquidationDate: Date;
    liquidationAmount: number;
    sourceDocument: string;
    sourceDocumentType: string;
    invoiceNumber?: string;
    voucherNumber?: string;
    userId: string;
}
export declare class AdjustEncumbranceDto {
    encumbranceId: number;
    encumbranceLineId: number;
    adjustmentDate: Date;
    adjustmentType: string;
    adjustmentAmount: number;
    adjustmentReason: string;
    newAccountCode?: string;
    userId: string;
}
export declare class CarryForwardEncumbranceDto {
    sourceEncumbranceId: number;
    sourceEncumbranceLineId: number;
    carryForwardDate: Date;
    carryForwardAmount: number;
    targetFiscalYear: number;
    justification: string;
    expirationDate?: Date;
    userId: string;
}
export declare class YearEndProcessingDto {
    fiscalYear: number;
    businessUnit?: string;
    fundCode?: string;
    autoLapse?: boolean;
    userId: string;
}
/**
 * Sequelize model for Encumbrance Headers with liquidation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EncumbranceHeader model
 *
 * @example
 * ```typescript
 * const Encumbrance = createEncumbranceHeaderModel(sequelize);
 * const encumbrance = await Encumbrance.create({
 *   encumbranceNumber: 'ENC-2024-001',
 *   encumbranceDate: new Date(),
 *   encumbranceType: 'purchase_order',
 *   status: 'active',
 *   originalAmount: 50000
 * });
 * ```
 */
export declare const createEncumbranceHeaderModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        encumbranceNumber: string;
        encumbranceDate: Date;
        encumbranceType: string;
        businessUnit: string;
        vendor: string | null;
        vendorName: string | null;
        description: string;
        status: string;
        fiscalYear: number;
        fiscalPeriod: number;
        originalAmount: number;
        currentAmount: number;
        liquidatedAmount: number;
        adjustedAmount: number;
        remainingAmount: number;
        sourceDocument: string | null;
        sourceDocumentType: string | null;
        commitmentId: number | null;
        glJournalId: number | null;
        postedDate: Date | null;
        postedBy: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Encumbrance Lines with fund accounting.
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
 *   originalAmount: 5000,
 *   currentAmount: 5000
 * });
 * ```
 */
export declare const createEncumbranceLineModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        encumbranceId: number;
        lineNumber: number;
        accountCode: string;
        accountId: number;
        description: string;
        originalAmount: number;
        currentAmount: number;
        liquidatedAmount: number;
        adjustedAmount: number;
        remainingAmount: number;
        budgetYear: number;
        budgetPeriod: number;
        projectCode: string | null;
        activityCode: string | null;
        costCenterCode: string | null;
        fundCode: string | null;
        organizationCode: string | null;
        objectCode: string | null;
        grantCode: string | null;
        programCode: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateEncumbranceDto} encumbranceData - Encumbrance data
 * @param {string} userId - User creating the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created encumbrance
 *
 * @example
 * ```typescript
 * const encumbrance = await createEncumbrance(sequelize, {
 *   encumbranceDate: new Date(),
 *   encumbranceType: 'purchase_order',
 *   businessUnit: 'BU001',
 *   description: 'Equipment purchase',
 *   sourceDocument: 'PO-2024-001',
 *   lines: [{ accountCode: '5100-001', originalAmount: 5000 }]
 * }, 'user123');
 * ```
 */
export declare const createEncumbrance: (sequelize: Sequelize, encumbranceData: CreateEncumbranceDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves an encumbrance by ID with all lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Encumbrance with lines
 *
 * @example
 * ```typescript
 * const encumbrance = await getEncumbranceById(sequelize, 1);
 * ```
 */
export declare const getEncumbranceById: (sequelize: Sequelize, encumbranceId: number, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves encumbrances by various filters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} filters - Filter criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of encumbrances
 *
 * @example
 * ```typescript
 * const encumbrances = await getEncumbrances(sequelize, {
 *   status: 'active',
 *   fiscalYear: 2024
 * });
 * ```
 */
export declare const getEncumbrances: (sequelize: Sequelize, filters: {
    status?: string;
    encumbranceType?: string;
    fiscalYear?: number;
    fiscalPeriod?: number;
    businessUnit?: string;
    vendor?: string;
}, transaction?: Transaction) => Promise<any[]>;
/**
 * Posts an encumbrance to the general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} userId - User posting the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted encumbrance with GL journal ID
 *
 * @example
 * ```typescript
 * const posted = await postEncumbranceToGL(sequelize, 1, 'user123');
 * ```
 */
export declare const postEncumbranceToGL: (sequelize: Sequelize, encumbranceId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Reverses an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversed encumbrance
 *
 * @example
 * ```typescript
 * const reversed = await reverseEncumbrance(sequelize, 1, 'PO cancelled', 'user123');
 * ```
 */
export declare const reverseEncumbrance: (sequelize: Sequelize, encumbranceId: number, reversalReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Cancels an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} cancellationReason - Reason for cancellation
 * @param {string} userId - User cancelling the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled encumbrance
 *
 * @example
 * ```typescript
 * const cancelled = await cancelEncumbrance(sequelize, 1, 'No longer needed', 'user123');
 * ```
 */
export declare const cancelEncumbrance: (sequelize: Sequelize, encumbranceId: number, cancellationReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Liquidates an encumbrance (partial or full).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LiquidateEncumbranceDto} liquidationData - Liquidation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceLiquidation>} Liquidation record
 *
 * @example
 * ```typescript
 * const liquidation = await liquidateEncumbrance(sequelize, {
 *   encumbranceId: 1,
 *   encumbranceLineId: 1,
 *   liquidationDate: new Date(),
 *   liquidationAmount: 500,
 *   sourceDocument: 'INV-12345',
 *   sourceDocumentType: 'invoice',
 *   userId: 'user123'
 * });
 * ```
 */
export declare const liquidateEncumbrance: (sequelize: Sequelize, liquidationData: LiquidateEncumbranceDto, transaction?: Transaction) => Promise<EncumbranceLiquidation>;
/**
 * Reverses an encumbrance liquidation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} liquidationId - Liquidation ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing the liquidation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reverseEncumbranceLiquidation(sequelize, 1, 'Invoice error', 'user123');
 * ```
 */
export declare const reverseEncumbranceLiquidation: (sequelize: Sequelize, liquidationId: number, reversalReason: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves liquidation history for an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceLiquidation[]>} Liquidation history
 *
 * @example
 * ```typescript
 * const history = await getEncumbranceLiquidationHistory(sequelize, 1);
 * ```
 */
export declare const getEncumbranceLiquidationHistory: (sequelize: Sequelize, encumbranceId: number, transaction?: Transaction) => Promise<EncumbranceLiquidation[]>;
/**
 * Adjusts an encumbrance amount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AdjustEncumbranceDto} adjustmentData - Adjustment data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceAdjustment>} Adjustment record
 *
 * @example
 * ```typescript
 * const adjustment = await adjustEncumbrance(sequelize, {
 *   encumbranceId: 1,
 *   encumbranceLineId: 1,
 *   adjustmentDate: new Date(),
 *   adjustmentType: 'increase',
 *   adjustmentAmount: 1000,
 *   adjustmentReason: 'Price increase',
 *   userId: 'user123'
 * });
 * ```
 */
export declare const adjustEncumbrance: (sequelize: Sequelize, adjustmentData: AdjustEncumbranceDto, transaction?: Transaction) => Promise<EncumbranceAdjustment>;
/**
 * Reclassifies an encumbrance to a different account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceLineId - Encumbrance line ID
 * @param {string} newAccountCode - New account code
 * @param {string} reason - Reclassification reason
 * @param {string} userId - User performing reclassification
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceAdjustment>} Reclassification record
 *
 * @example
 * ```typescript
 * const reclass = await reclassifyEncumbrance(sequelize, 1, '5200-002', 'Correct coding', 'user123');
 * ```
 */
export declare const reclassifyEncumbrance: (sequelize: Sequelize, encumbranceLineId: number, newAccountCode: string, reason: string, userId: string, transaction?: Transaction) => Promise<EncumbranceAdjustment>;
/**
 * Retrieves adjustment history for an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceAdjustment[]>} Adjustment history
 *
 * @example
 * ```typescript
 * const adjustments = await getEncumbranceAdjustmentHistory(sequelize, 1);
 * ```
 */
export declare const getEncumbranceAdjustmentHistory: (sequelize: Sequelize, encumbranceId: number, transaction?: Transaction) => Promise<EncumbranceAdjustment[]>;
/**
 * Processes year-end encumbrances for carry-forward or lapse.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {YearEndProcessingDto} processingData - Year-end processing data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<YearEndEncumbrance[]>} Year-end processing results
 *
 * @example
 * ```typescript
 * const results = await processYearEndEncumbrances(sequelize, {
 *   fiscalYear: 2024,
 *   businessUnit: 'BU001',
 *   autoLapse: false,
 *   userId: 'user123'
 * });
 * ```
 */
export declare const processYearEndEncumbrances: (sequelize: Sequelize, processingData: YearEndProcessingDto, transaction?: Transaction) => Promise<YearEndEncumbrance[]>;
/**
 * Carries forward an encumbrance to the next fiscal year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CarryForwardEncumbranceDto} carryForwardData - Carry forward data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceCarryForward>} Carry forward record
 *
 * @example
 * ```typescript
 * const carryForward = await carryForwardEncumbrance(sequelize, {
 *   sourceEncumbranceId: 1,
 *   sourceEncumbranceLineId: 1,
 *   carryForwardDate: new Date(),
 *   carryForwardAmount: 5000,
 *   targetFiscalYear: 2025,
 *   justification: 'Project continues into next year',
 *   userId: 'user123'
 * });
 * ```
 */
export declare const carryForwardEncumbrance: (sequelize: Sequelize, carryForwardData: CarryForwardEncumbranceDto, transaction?: Transaction) => Promise<EncumbranceCarryForward>;
/**
 * Lapses (expires) an encumbrance at year-end.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} userId - User lapsing the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Lapsed encumbrance
 *
 * @example
 * ```typescript
 * const lapsed = await lapseEncumbrance(sequelize, 1, 'user123');
 * ```
 */
export declare const lapseEncumbrance: (sequelize: Sequelize, encumbranceId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves carry-forward history for an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceCarryForward[]>} Carry-forward history
 *
 * @example
 * ```typescript
 * const history = await getCarryForwardHistory(sequelize, 1);
 * ```
 */
export declare const getCarryForwardHistory: (sequelize: Sequelize, encumbranceId: number, transaction?: Transaction) => Promise<EncumbranceCarryForward[]>;
/**
 * Retrieves fund encumbrance balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} [fiscalPeriod] - Optional fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<FundEncumbrance[]>} Fund encumbrance balances
 *
 * @example
 * ```typescript
 * const fundBalances = await getFundEncumbranceBalances(sequelize, 'FUND001', 2024, 3);
 * ```
 */
export declare const getFundEncumbranceBalances: (sequelize: Sequelize, fundCode: string, fiscalYear: number, fiscalPeriod?: number, transaction?: Transaction) => Promise<FundEncumbrance[]>;
/**
 * Checks fund compliance for encumbrances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Object>} Fund compliance status
 *
 * @example
 * ```typescript
 * const compliance = await checkFundCompliance(sequelize, 'FUND001', 2024);
 * ```
 */
export declare const checkFundCompliance: (sequelize: Sequelize, fundCode: string, fiscalYear: number, transaction?: Transaction) => Promise<{
    fundCode: string;
    fiscalYear: number;
    isCompliant: boolean;
    violations: string[];
    warnings: string[];
}>;
/**
 * Reconciles encumbrances with fund balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User performing reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReconciliation[]>} Reconciliation results
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileFundEncumbrances(sequelize, 'FUND001', 2024, 3, 'user123');
 * ```
 */
export declare const reconcileFundEncumbrances: (sequelize: Sequelize, fundCode: string, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<EncumbranceReconciliation[]>;
/**
 * Generates outstanding encumbrances report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} [fiscalPeriod] - Optional fiscal period
 * @param {string} [businessUnit] - Optional business unit filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReport>} Encumbrance report
 *
 * @example
 * ```typescript
 * const report = await generateOutstandingEncumbrancesReport(sequelize, 2024, 3, 'BU001');
 * ```
 */
export declare const generateOutstandingEncumbrancesReport: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod?: number, businessUnit?: string, transaction?: Transaction) => Promise<EncumbranceReport>;
/**
 * Generates encumbrance liquidation summary report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReport>} Liquidation summary report
 *
 * @example
 * ```typescript
 * const report = await generateLiquidationSummaryReport(sequelize, 2024, 3);
 * ```
 */
export declare const generateLiquidationSummaryReport: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<EncumbranceReport>;
/**
 * Generates year-end encumbrance status report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReport>} Year-end status report
 *
 * @example
 * ```typescript
 * const report = await generateYearEndStatusReport(sequelize, 2024);
 * ```
 */
export declare const generateYearEndStatusReport: (sequelize: Sequelize, fiscalYear: number, transaction?: Transaction) => Promise<EncumbranceReport>;
/**
 * Generates fund encumbrance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReport>} Fund encumbrance report
 *
 * @example
 * ```typescript
 * const report = await generateFundEncumbranceReport(sequelize, 'FUND001', 2024);
 * ```
 */
export declare const generateFundEncumbranceReport: (sequelize: Sequelize, fundCode: string, fiscalYear: number, transaction?: Transaction) => Promise<EncumbranceReport>;
/**
 * Generates encumbrance variance analysis report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {string} [accountCode] - Optional account filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReport>} Variance analysis report
 *
 * @example
 * ```typescript
 * const report = await generateEncumbranceVarianceReport(sequelize, 2024, '5100-001');
 * ```
 */
export declare const generateEncumbranceVarianceReport: (sequelize: Sequelize, fiscalYear: number, accountCode?: string, transaction?: Transaction) => Promise<EncumbranceReport>;
/**
 * Generates a unique encumbrance number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} encumbranceType - Type of encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated encumbrance number
 *
 * @example
 * ```typescript
 * const number = await generateEncumbranceNumber(sequelize, 'purchase_order');
 * ```
 */
export declare const generateEncumbranceNumber: (sequelize: Sequelize, encumbranceType: string, transaction?: Transaction) => Promise<string>;
/**
 * Generates a unique liquidation number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated liquidation number
 *
 * @example
 * ```typescript
 * const number = await generateLiquidationNumber(sequelize);
 * ```
 */
export declare const generateLiquidationNumber: (sequelize: Sequelize, transaction?: Transaction) => Promise<string>;
/**
 * Generates a unique adjustment number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated adjustment number
 *
 * @example
 * ```typescript
 * const number = await generateAdjustmentNumber(sequelize);
 * ```
 */
export declare const generateAdjustmentNumber: (sequelize: Sequelize, transaction?: Transaction) => Promise<string>;
/**
 * Determines fiscal year and period from a date.
 *
 * @param {Date} date - Date to analyze
 * @returns {Object} Fiscal year and period
 *
 * @example
 * ```typescript
 * const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(new Date('2024-03-15'));
 * ```
 */
export declare const getFiscalYearPeriod: (date: Date) => {
    fiscalYear: number;
    fiscalPeriod: number;
};
/**
 * Retrieves encumbrance by number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} encumbranceNumber - Encumbrance number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Encumbrance
 *
 * @example
 * ```typescript
 * const encumbrance = await getEncumbranceByNumber(sequelize, 'ENC-2024-001');
 * ```
 */
export declare const getEncumbranceByNumber: (sequelize: Sequelize, encumbranceNumber: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves encumbrance lines for an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Encumbrance lines
 *
 * @example
 * ```typescript
 * const lines = await getEncumbranceLines(sequelize, 1);
 * ```
 */
export declare const getEncumbranceLines: (sequelize: Sequelize, encumbranceId: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Updates an encumbrance line.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} lineId - Encumbrance line ID
 * @param {Partial<EncumbranceLine>} updateData - Update data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated encumbrance line
 *
 * @example
 * ```typescript
 * const updated = await updateEncumbranceLine(sequelize, 1, { description: 'Updated' });
 * ```
 */
export declare const updateEncumbranceLine: (sequelize: Sequelize, lineId: number, updateData: Partial<EncumbranceLine>, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves encumbrance history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceHistory[]>} Encumbrance history
 *
 * @example
 * ```typescript
 * const history = await getEncumbranceHistory(sequelize, 1);
 * ```
 */
export declare const getEncumbranceHistory: (sequelize: Sequelize, encumbranceId: number, transaction?: Transaction) => Promise<EncumbranceHistory[]>;
/**
 * Records encumbrance history entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Omit<EncumbranceHistory, 'historyId'>} historyData - History data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceHistory>} Created history entry
 *
 * @example
 * ```typescript
 * const history = await recordEncumbranceHistory(sequelize, {
 *   encumbranceId: 1,
 *   changeDate: new Date(),
 *   changeType: 'liquidated',
 *   changedBy: 'user123',
 *   changeDescription: 'Partial liquidation',
 *   auditData: {}
 * });
 * ```
 */
export declare const recordEncumbranceHistory: (sequelize: Sequelize, historyData: Omit<EncumbranceHistory, "historyId">, transaction?: Transaction) => Promise<EncumbranceHistory>;
/**
 * Validates encumbrance before posting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{isValid: boolean; errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateEncumbrance(sequelize, 1);
 * if (!validation.isValid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
export declare const validateEncumbrance: (sequelize: Sequelize, encumbranceId: number, transaction?: Transaction) => Promise<{
    isValid: boolean;
    errors: string[];
}>;
/**
 * Retrieves encumbrances by vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} vendorId - Vendor ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of encumbrances
 *
 * @example
 * ```typescript
 * const encumbrances = await getEncumbrancesByVendor(sequelize, 'VENDOR123');
 * ```
 */
export declare const getEncumbrancesByVendor: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * Retrieves encumbrances by account code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} accountCode - Account code
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of encumbrance lines
 *
 * @example
 * ```typescript
 * const lines = await getEncumbrancesByAccount(sequelize, '5100-001', 2024);
 * ```
 */
export declare const getEncumbrancesByAccount: (sequelize: Sequelize, accountCode: string, fiscalYear: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Calculates total encumbrances for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} accountCode - Account code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Total encumbrance amount
 *
 * @example
 * ```typescript
 * const total = await calculateAccountEncumbrances(sequelize, '5100-001', 2024, 3);
 * ```
 */
export declare const calculateAccountEncumbrances: (sequelize: Sequelize, accountCode: string, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<number>;
/**
 * Retrieves encumbrances by project code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} projectCode - Project code
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of encumbrance lines
 *
 * @example
 * ```typescript
 * const lines = await getEncumbrancesByProject(sequelize, 'PROJ-001', 2024);
 * ```
 */
export declare const getEncumbrancesByProject: (sequelize: Sequelize, projectCode: string, fiscalYear: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Retrieves encumbrances by grant code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantCode - Grant code
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of encumbrance lines
 *
 * @example
 * ```typescript
 * const lines = await getEncumbrancesByGrant(sequelize, 'GRANT-001', 2024);
 * ```
 */
export declare const getEncumbrancesByGrant: (sequelize: Sequelize, grantCode: string, fiscalYear: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Batch creates encumbrances from a list.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateEncumbranceDto[]} encumbrances - List of encumbrances to create
 * @param {string} userId - User creating the encumbrances
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created encumbrances
 *
 * @example
 * ```typescript
 * const created = await batchCreateEncumbrances(sequelize, [encData1, encData2], 'user123');
 * ```
 */
export declare const batchCreateEncumbrances: (sequelize: Sequelize, encumbrances: CreateEncumbranceDto[], userId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * Batch liquidates multiple encumbrances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LiquidateEncumbranceDto[]} liquidations - List of liquidations to process
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceLiquidation[]>} Liquidation records
 *
 * @example
 * ```typescript
 * const liquidations = await batchLiquidateEncumbrances(sequelize, [liq1, liq2]);
 * ```
 */
export declare const batchLiquidateEncumbrances: (sequelize: Sequelize, liquidations: LiquidateEncumbranceDto[], transaction?: Transaction) => Promise<EncumbranceLiquidation[]>;
/**
 * Reconciles GL encumbrances with subledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User performing reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReconciliation[]>} Reconciliation results
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileEncumbrances(sequelize, 2024, 3, 'user123');
 * ```
 */
export declare const reconcileEncumbrances: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<EncumbranceReconciliation[]>;
export {};
//# sourceMappingURL=encumbrance-accounting-kit.d.ts.map