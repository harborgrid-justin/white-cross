/**
 * LOC: ENCCOMMCMP001
 * File: /reuse/edwards/financial/composites/encumbrance-commitment-control-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../encumbrance-accounting-kit
 *   - ../commitment-control-kit
 *   - ../budget-management-control-kit
 *   - ../financial-workflow-approval-kit
 *   - ../fund-grant-accounting-kit
 *
 * DOWNSTREAM (imported by):
 *   - Encumbrance REST API controllers
 *   - Budget control services
 *   - Fund accounting modules
 *   - Year-end close processes
 */
import { Transaction } from 'sequelize';
export declare class CreateEncumbranceRequest {
    encumbranceType: string;
    businessUnit: string;
    vendor: string;
    description: string;
    lines: {
        accountCode: string;
        amount: number;
        description: string;
        fundCode?: string;
        projectCode?: string;
    }[];
    budgetCheckRequired: boolean;
}
export declare class CreateEncumbranceResponse {
    encumbranceId: number;
    encumbranceNumber: string;
    status: string;
    totalAmount: number;
    budgetCheckResult: {
        passed: boolean;
        availableBudget: number;
        warnings: string[];
    };
}
export declare class BudgetCheckRequest {
    accountCode: string;
    amount: number;
    fiscalYear: number;
    fiscalPeriod: number;
    fundCode?: string;
    allowOverBudget: boolean;
}
export declare class LiquidateEncumbranceRequest {
    encumbranceId: number;
    lines: {
        encumbranceLineId: number;
        liquidationAmount: number;
        invoiceNumber?: string;
        voucherNumber?: string;
    }[];
    autoPostGL: boolean;
}
export declare class YearEndProcessRequest {
    fiscalYear: number;
    processType: 'carry_forward' | 'lapse' | 'close';
    targetFiscalYear?: number;
    approvalRequired: boolean;
}
export declare class EncumbranceReportRequest {
    reportType: string;
    fiscalYear: number;
    fiscalPeriod?: number;
    businessUnit?: string;
    fundCode?: string;
}
export declare const orchestrateEncumbranceCreation: (request: CreateEncumbranceRequest, transaction?: Transaction) => Promise<CreateEncumbranceResponse>;
export declare const orchestrateBudgetAvailabilityCheck: (request: BudgetCheckRequest, transaction?: Transaction) => Promise<any>;
export declare const orchestrateRealTimeBudgetCheck: (accountCode: string, amount: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateMultiAccountBudgetCheck: (items: any[], transaction?: Transaction) => Promise<any>;
export declare const orchestrateBudgetCheckOverride: (encumbranceId: number, overrideReason: string, approver: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceApproval: (encumbranceId: number, approverId: string, approved: boolean, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceGLPosting: (encumbranceId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceLiquidation: (request: LiquidateEncumbranceRequest, transaction?: Transaction) => Promise<any>;
export declare const orchestratePartialEncumbranceLiquidation: (encumbranceId: number, amount: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceLiquidationReversal: (liquidationId: number, reason: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceAdjustment: (encumbranceId: number, adjustmentType: string, amount: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceReclassification: (encumbranceId: number, newAccountCode: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceCancellation: (encumbranceId: number, cancellationReason: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceReversal: (encumbranceId: number, reversalReason: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateYearEndEncumbranceProcessing: (request: YearEndProcessRequest, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceCarryForward: (encumbranceId: number, targetFiscalYear: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceLapseProcessing: (encumbranceId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateBulkEncumbranceCarryForward: (fiscalYear: number, targetYear: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCarryForwardApproval: (carryForwardId: number, approverId: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceByVendorReport: (vendorNumber: string, fiscalYear: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceByAccountReport: (accountCode: string, fiscalYear: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateOutstandingEncumbrancesReport: (request: EncumbranceReportRequest, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceLiquidationSummary: (fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateYearEndEncumbranceStatusReport: (fiscalYear: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateFundEncumbranceBalanceReport: (fundCode: string, fiscalYear: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceVarianceAnalysis: (encumbranceId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateFundComplianceCheck: (fundCode: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateGrantEncumbranceTracking: (grantCode: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateProjectEncumbranceTracking: (projectCode: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateMultiYearEncumbrance: (encumbrance: any, years: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceBudgetReservation: (accountCode: string, amount: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateBudgetReservationRelease: (reservationId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceReconciliation: (accountCode: string, fiscalYear: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceAuditTrail: (encumbranceId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestratePreEncumbranceCreation: (requisition: any, transaction?: Transaction) => Promise<any>;
export declare const orchestratePreEncumbranceConversion: (preEncumbranceId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCommitmentControlDashboard: (transaction?: Transaction) => Promise<any>;
export declare const orchestrateBudgetVsEncumbranceAnalysis: (fiscalYear: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceAgingAnalysis: (transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbrancePerformanceMetrics: (period: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceExceptionHandling: (encumbranceId: number, exceptionType: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateAutomatedEncumbranceLiquidation: (invoiceId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceCloseOut: (fiscalYear: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateBudgetCheckingRuleConfiguration: (rule: any, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEncumbranceDataMigration: (sourceSystem: string, fiscalYear: number, transaction?: Transaction) => Promise<any>;
export { orchestrateEncumbranceCreation, orchestrateBudgetAvailabilityCheck, orchestrateRealTimeBudgetCheck, orchestrateMultiAccountBudgetCheck, orchestrateBudgetCheckOverride, orchestrateEncumbranceApproval, orchestrateEncumbranceGLPosting, orchestrateEncumbranceLiquidation, orchestratePartialEncumbranceLiquidation, orchestrateEncumbranceLiquidationReversal, orchestrateEncumbranceAdjustment, orchestrateEncumbranceReclassification, orchestrateEncumbranceCancellation, orchestrateEncumbranceReversal, orchestrateYearEndEncumbranceProcessing, orchestrateEncumbranceCarryForward, orchestrateEncumbranceLapseProcessing, orchestrateBulkEncumbranceCarryForward, orchestrateCarryForwardApproval, orchestrateEncumbranceByVendorReport, orchestrateEncumbranceByAccountReport, orchestrateOutstandingEncumbrancesReport, orchestrateEncumbranceLiquidationSummary, orchestrateYearEndEncumbranceStatusReport, orchestrateFundEncumbranceBalanceReport, orchestrateEncumbranceVarianceAnalysis, orchestrateFundComplianceCheck, orchestrateGrantEncumbranceTracking, orchestrateProjectEncumbranceTracking, orchestrateMultiYearEncumbrance, orchestrateEncumbranceBudgetReservation, orchestrateBudgetReservationRelease, orchestrateEncumbranceReconciliation, orchestrateEncumbranceAuditTrail, orchestratePreEncumbranceCreation, orchestratePreEncumbranceConversion, orchestrateCommitmentControlDashboard, orchestrateBudgetVsEncumbranceAnalysis, orchestrateEncumbranceAgingAnalysis, orchestrateEncumbrancePerformanceMetrics, orchestrateEncumbranceExceptionHandling, orchestrateAutomatedEncumbranceLiquidation, orchestrateEncumbranceCloseOut, orchestrateBudgetCheckingRuleConfiguration, orchestrateEncumbranceDataMigration, };
//# sourceMappingURL=encumbrance-commitment-control-composite.d.ts.map