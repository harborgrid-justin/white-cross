/**
 * LOC: BANKRECCMP001
 * File: /reuse/edwards/financial/composites/bank-reconciliation-automation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../banking-reconciliation-kit
 *   - ../payment-processing-collections-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../accounts-payable-management-kit
 *   - ../multi-currency-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Bank reconciliation REST API controllers
 *   - Cash management dashboards
 *   - Treasury management services
 *   - Automated clearing services
 */
import { Transaction } from 'sequelize';
export declare class ImportStatementRequest {
    bankAccountId: number;
    fileFormat: 'BAI2' | 'OFX' | 'QFX' | 'CSV' | 'MT940' | 'Custom';
    autoReconcile: boolean;
    statementDate: Date;
}
export declare class StatementImportResponse {
    statementId: number;
    linesImported: number;
    openingBalance: number;
    closingBalance: number;
    autoMatched: number;
    requiresReview: number;
}
export declare class AutomatedMatchingRequest {
    statementId: number;
    confidenceThreshold: number;
    applyMatchingRules: boolean;
    autoClear: boolean;
}
export declare class AutomatedMatchingResponse {
    totalMatched: number;
    exactMatches: number;
    ruleBasedMatches: number;
    unmatchedItems: number;
    matchResults: any[];
}
export declare class CashPositionRequest {
    asOfDate?: Date;
    bankAccountIds?: number[];
    includeForecast: boolean;
    forecastDays?: number;
}
export declare class CashPositionResponse {
    asOfDate: Date;
    totalCashPosition: number;
    availableBalance: number;
    outstandingChecks: number;
    outstandingDeposits: number;
    byAccount: any[];
    byCurrency: any[];
    forecast?: any[];
}
export declare class ReconciliationReportRequest {
    bankAccountId: number;
    statementId: number;
    reportFormat: 'pdf' | 'excel' | 'json';
    includeDetails: boolean;
}
export declare const orchestrateStatementImport: (request: ImportStatementRequest, file: any, transaction?: Transaction) => Promise<StatementImportResponse>;
export declare const orchestrateBAI2FileProcessing: (file: any, bankAccountId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateOFXFileProcessing: (file: any, bankAccountId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCSVStatementImport: (file: any, bankAccountId: number, mappingTemplate: any, transaction?: Transaction) => Promise<any>;
export declare const orchestrateMT940Processing: (file: any, bankAccountId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateAutomatedMatching: (request: AutomatedMatchingRequest, transaction?: Transaction) => Promise<AutomatedMatchingResponse>;
export declare const orchestrateExactMatching: (statementId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateFuzzyMatching: (statementId: number, threshold: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateRuleBasedMatching: (statementId: number, rules: any[], transaction?: Transaction) => Promise<any>;
export declare const orchestrateGroupMatching: (statementId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCashPositionCalculation: (request: CashPositionRequest, transaction?: Transaction) => Promise<CashPositionResponse>;
export declare const orchestrateRealTimeCashDashboard: (transaction?: Transaction) => Promise<any>;
export declare const orchestrateMultiCurrencyCashPosition: (baseCurrency: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCashForecast: (days: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateOutstandingChecksTracking: (bankAccountId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateOutstandingDepositsTracking: (bankAccountId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateStaleCheckIdentification: (daysThreshold: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateStaleCheckAutoVoid: (checkIds: number[], transaction?: Transaction) => Promise<any>;
export declare const orchestrateClearingRuleCreation: (rule: any, transaction?: Transaction) => Promise<any>;
export declare const orchestrateClearingRuleExecution: (ruleId: number, statementId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateBulkTransactionClearing: (matches: any[], transaction?: Transaction) => Promise<any>;
export declare const orchestrateReconciliationVarianceAnalysis: (reconciliationId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateReconciliationExceptionHandling: (statementId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateUnmatchedItemResolution: (lineId: number, glTransactionId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateBankFeedSetup: (bankAccountId: number, feedConfig: any, transaction?: Transaction) => Promise<any>;
export declare const orchestrateAutomatedBankFeedSync: (feedConfigId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateBankFeedOAuth: (bankAccountId: number, authCode: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateReconciliationApproval: (reconciliationId: number, approverId: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateReconciliationGLPosting: (reconciliationId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateBankBalanceVerification: (bankAccountId: number, statementBalance: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateReconciliationReportGeneration: (request: ReconciliationReportRequest, transaction?: Transaction) => Promise<any>;
export declare const orchestrateOutstandingItemsReport: (bankAccountId: number, asOfDate: Date, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCashActivityReport: (startDate: Date, endDate: Date, transaction?: Transaction) => Promise<any>;
export declare const orchestrateBankReconciliationDashboard: (transaction?: Transaction) => Promise<any>;
export declare const orchestrateReconciliationAnalytics: (startDate: Date, endDate: Date, transaction?: Transaction) => Promise<any>;
export declare const orchestrateMultiAccountReconciliation: (bankAccountIds: number[], statementDate: Date, transaction?: Transaction) => Promise<any>;
export declare const orchestrateIntradayReconciliation: (bankAccountId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateBankFeeRecognition: (statementId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateInterestIncomeRecognition: (statementId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateNSFCheckProcessing: (checkId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateReturnedDepositProcessing: (depositId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateReconciliationAuditTrail: (reconciliationId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateReconciliationQualityMetrics: (period: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateEndOfDayCashReconciliation: (businessDate: Date, transaction?: Transaction) => Promise<any>;
export declare const orchestrateBankStatementArchive: (statementId: number, retentionYears: number, transaction?: Transaction) => Promise<any>;
export { orchestrateStatementImport, orchestrateBAI2FileProcessing, orchestrateOFXFileProcessing, orchestrateCSVStatementImport, orchestrateMT940Processing, orchestrateAutomatedMatching, orchestrateExactMatching, orchestrateFuzzyMatching, orchestrateRuleBasedMatching, orchestrateGroupMatching, orchestrateCashPositionCalculation, orchestrateRealTimeCashDashboard, orchestrateMultiCurrencyCashPosition, orchestrateCashForecast, orchestrateOutstandingChecksTracking, orchestrateOutstandingDepositsTracking, orchestrateStaleCheckIdentification, orchestrateStaleCheckAutoVoid, orchestrateClearingRuleCreation, orchestrateClearingRuleExecution, orchestrateBulkTransactionClearing, orchestrateReconciliationVarianceAnalysis, orchestrateReconciliationExceptionHandling, orchestrateUnmatchedItemResolution, orchestrateBankFeedSetup, orchestrateAutomatedBankFeedSync, orchestrateBankFeedOAuth, orchestrateReconciliationApproval, orchestrateReconciliationGLPosting, orchestrateBankBalanceVerification, orchestrateReconciliationReportGeneration, orchestrateOutstandingItemsReport, orchestrateCashActivityReport, orchestrateBankReconciliationDashboard, orchestrateReconciliationAnalytics, orchestrateMultiAccountReconciliation, orchestrateIntradayReconciliation, orchestrateBankFeeRecognition, orchestrateInterestIncomeRecognition, orchestrateNSFCheckProcessing, orchestrateReturnedDepositProcessing, orchestrateReconciliationAuditTrail, orchestrateReconciliationQualityMetrics, orchestrateEndOfDayCashReconciliation, orchestrateBankStatementArchive, };
//# sourceMappingURL=bank-reconciliation-automation-composite.d.ts.map