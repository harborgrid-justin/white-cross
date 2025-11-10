/**
 * LOC: GLOPSCOMP001
 * File: /reuse/edwards/financial/composites/general-ledger-operations-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../allocation-engines-rules-kit
 *   - ../dimension-management-kit
 *   - ../multi-currency-management-kit
 *   - ../intercompany-accounting-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../audit-trail-compliance-kit
 *   - ../financial-workflow-approval-kit
 *   - ../encumbrance-accounting-kit
 *
 * DOWNSTREAM (imported by):
 *   - General Ledger REST API controllers
 *   - GL GraphQL resolvers
 *   - Financial reporting services
 *   - Period close automation
 *   - Management reporting dashboards
 */
import { Transaction } from 'sequelize';
import { AllocationRule } from '../allocation-engines-rules-kit';
import { DimensionHierarchy } from '../dimension-management-kit';
import { TrialBalance, AccountBalance } from '../financial-reporting-analytics-kit';
import { ComplianceReport } from '../audit-trail-compliance-kit';
/**
 * GL journal entry with approval workflow
 */
export interface GLJournalEntry {
    journalId: number;
    journalNumber: string;
    journalType: 'standard' | 'recurring' | 'reversing' | 'allocation' | 'intercompany';
    entryDate: Date;
    postingDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    description: string;
    sourceSystem: string;
    batchNumber?: string;
    status: 'draft' | 'pending_approval' | 'approved' | 'posted' | 'reversed';
    totalDebit: number;
    totalCredit: number;
    currency: string;
    approvalRequired: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    postedBy?: string;
    postedAt?: Date;
    reversedBy?: string;
    reversedAt?: Date;
    lines: GLJournalLine[];
}
/**
 * GL journal line with dimension tracking
 */
export interface GLJournalLine {
    lineId: number;
    lineNumber: number;
    accountCode: string;
    accountName: string;
    debitAmount: number;
    creditAmount: number;
    description: string;
    dimensions: Record<string, string>;
    subsidiaryLedger?: string;
    projectCode?: string;
    departmentCode?: string;
    costCenterCode?: string;
    fundCode?: string;
    grantCode?: string;
}
/**
 * Multi-currency journal entry
 */
export interface MultiCurrencyJournalEntry extends GLJournalEntry {
    sourceCurrency: string;
    functionalCurrency: string;
    reportingCurrency: string;
    exchangeRate: number;
    functionalAmount: number;
    reportingAmount: number;
    gainLossAmount: number;
    gainLossAccount?: string;
}
/**
 * Period close status
 */
export interface PeriodCloseStatus {
    fiscalYear: number;
    fiscalPeriod: number;
    closeType: 'soft' | 'hard';
    status: 'open' | 'closing' | 'closed' | 'locked';
    tasksCompleted: number;
    tasksTotal: number;
    completionPercent: number;
    closeDate?: Date;
    closedBy?: string;
    canReopen: boolean;
}
/**
 * Account reconciliation result
 */
export interface AccountReconciliationResult {
    accountCode: string;
    accountName: string;
    reconciliationDate: Date;
    glBalance: number;
    subsidiaryBalance: number;
    variance: number;
    variancePercent: number;
    isReconciled: boolean;
    reconciliationItems: ReconciliationItem[];
    varianceExplanation?: string;
    reconciler?: string;
    reviewer?: string;
}
/**
 * Reconciliation item
 */
export interface ReconciliationItem {
    itemId: number;
    itemType: 'timing_difference' | 'posting_error' | 'rounding' | 'other';
    amount: number;
    description: string;
    resolutionRequired: boolean;
    resolvedBy?: string;
    resolvedAt?: Date;
}
/**
 * GL consolidation result
 */
export interface GLConsolidationResult {
    consolidationId: number;
    consolidationDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    entities: string[];
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    eliminationEntries: number;
    status: 'draft' | 'finalized';
}
/**
 * Creates GL journal entry with approval workflow and dimension validation
 * Composes: validateDimensionCombination, initiateApprovalWorkflow, logGLTransaction
 */
export declare class GLOperationsComposite {
    /**
     * Creates journal entry with comprehensive validation and workflow
     */
    createJournalEntryWithWorkflow(entry: GLJournalEntry, transaction?: Transaction): Promise<{
        journalId: number;
        approvalId?: number;
        auditId: number;
    }>;
    /**
     * Posts journal entry with encumbrance liquidation and audit trail
     * Composes: liquidateEncumbrance, logGLTransaction, calculateAccountBalance
     */
    postJournalEntryWithEncumbrance(journalId: number, userId: string, transaction?: Transaction): Promise<{
        posted: boolean;
        encumbrancesLiquidated: number;
        balances: AccountBalance[];
    }>;
    /**
     * Creates multi-currency journal entry with currency conversion and gain/loss
     * Composes: getCurrencyRate, convertCurrency, calculateGainLoss, createJournalEntryWithWorkflow
     */
    createMultiCurrencyJournalEntry(entry: MultiCurrencyJournalEntry, transaction?: Transaction): Promise<{
        journalId: number;
        exchangeRate: number;
        gainLoss: number;
    }>;
    /**
     * Creates intercompany journal entry with automatic due to/due from entries
     * Composes: createIntercompanyTransaction, generateIntercompanyEntries, validateIntercompanyBalance
     */
    createIntercompanyJournalEntry(entry: GLJournalEntry, fromEntity: string, toEntity: string, transaction?: Transaction): Promise<{
        journalId: number;
        intercompanyId: number;
        dueToEntry: number;
        dueFromEntry: number;
    }>;
    /**
     * Reverses journal entry with automatic reversal generation
     * Composes: logGLTransaction, createAuditTrail, validateDimensionCombination
     */
    reverseJournalEntry(originalJournalId: number, reversalDate: Date, userId: string, transaction?: Transaction): Promise<{
        reversalJournalId: number;
        auditTrailId: number;
    }>;
    /**
     * Executes cost allocation with statistical drivers and audit trail
     * Composes: validateStatisticalDriver, calculateAllocationAmounts, executeAllocation, generateAllocationReport
     */
    executeAllocationWithDrivers(ruleId: number, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        allocationId: number;
        journalId: number;
        allocatedAmount: number;
        report: any;
    }>;
    /**
     * Processes reciprocal allocations with cascade logic
     * Composes: processReciprocalAllocations, createAllocationPool, validateAllocationRule
     */
    processReciprocalAllocationCascade(poolIds: number[], fiscalYear: number, fiscalPeriod: number, maxIterations?: number, transaction?: Transaction): Promise<{
        poolsProcessed: number;
        journalsCreated: number;
        totalAllocated: number;
        iterations: number;
    }>;
    /**
     * Executes step-down allocation with multiple tiers
     * Composes: executeStepDownAllocation, validateAllocationRule, generateAllocationReport
     */
    executeMultiTierStepDownAllocation(rules: AllocationRule[], fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        tiersProcessed: number;
        totalAllocated: number;
        reports: any[];
    }>;
    /**
     * Reconciles GL account to subsidiary ledger
     * Composes: calculateAccountBalance, drilldownToTransactions, generateAuditReport
     */
    reconcileGLToSubsidiary(accountCode: string, subsidiaryType: string, reconciliationDate: Date, transaction?: Transaction): Promise<AccountReconciliationResult>;
    /**
     * Performs account variance analysis with dimensional breakdown
     * Composes: calculateAccountBalance, rollupDimensionValues, drilldownToTransactions
     */
    analyzeAccountVarianceByDimension(accountCode: string, budgetAmount: number, actualPeriodStart: Date, actualPeriodEnd: Date, dimensions: string[], transaction?: Transaction): Promise<{
        totalVariance: number;
        variancePercent: number;
        dimensionalBreakdown: any[];
    }>;
    /**
     * Reconciles intercompany accounts across entities
     * Composes: reconcileIntercompanyAccounts, matchIntercompanyTransactions, createEliminationEntry
     */
    reconcileIntercompanyAccountsComplete(entity1: string, entity2: string, reconciliationDate: Date, transaction?: Transaction): Promise<{
        reconciled: boolean;
        variance: number;
        matchedTransactions: number;
        eliminationEntryId?: number;
    }>;
    /**
     * Executes soft close with validation and reporting
     * Composes: generateTrialBalance, reconcileIntercompanyAccounts, validateAuditCompliance
     */
    executeSoftPeriodClose(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        closeStatus: PeriodCloseStatus;
        trialBalance: TrialBalance;
        complianceReport: ComplianceReport;
    }>;
    /**
     * Executes hard close with final validations and lock
     * Composes: generateTrialBalance, reconcileIntercompanyAccounts, createAuditTrail
     */
    executeHardPeriodClose(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        closeStatus: PeriodCloseStatus;
        auditTrailId: number;
        locked: boolean;
    }>;
    /**
     * Processes currency revaluation for period close
     * Composes: revalueForeignCurrencyAccounts, postCurrencyRevaluation, generateRevaluationReport
     */
    processPeriodEndCurrencyRevaluation(fiscalYear: number, fiscalPeriod: number, revaluationDate: Date, transaction?: Transaction): Promise<{
        accountsRevalued: number;
        totalGainLoss: number;
        journalId: number;
        report: any;
    }>;
    /**
     * Consolidates multiple entities with elimination entries
     * Composes: generateTrialBalance, createEliminationEntry, postIntercompanyElimination
     */
    consolidateEntitiesWithEliminations(entities: string[], fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<GLConsolidationResult>;
    /**
     * Generates consolidated financial statements
     * Composes: generateBalanceSheet, generateIncomeStatement, exportFinancialReport
     */
    generateConsolidatedFinancialStatements(consolidationId: number, fiscalYear: number, fiscalPeriod: number, format: 'pdf' | 'excel' | 'json', transaction?: Transaction): Promise<{
        balanceSheet: any;
        incomeStatement: any;
        exportPath: string;
    }>;
    /**
     * Generates comprehensive GL trial balance with drill-down capability
     * Composes: generateTrialBalance, drilldownToTransactions, exportFinancialReport
     */
    generateTrialBalanceWithDrilldown(fiscalYear: number, fiscalPeriod: number, includeDrilldown?: boolean, transaction?: Transaction): Promise<{
        trialBalance: TrialBalance;
        drilldownData?: any[];
        exportPath?: string;
    }>;
    /**
     * Generates financial statement package with all reports
     * Composes: generateBalanceSheet, generateIncomeStatement, generateTrialBalance, exportFinancialReport
     */
    generateFinancialStatementPackage(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        balanceSheet: any;
        incomeStatement: any;
        trialBalance: TrialBalance;
        packagePath: string;
    }>;
    /**
     * Performs comprehensive audit trail analysis
     * Composes: generateAuditReport, detectAnomalousTransactions, trackUserActivity
     */
    analyzeAuditTrailForPeriod(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        auditReport: ComplianceReport;
        anomalies: any[];
        userActivity: any[];
    }>;
    /**
     * Validates SOX compliance for GL operations
     * Composes: validateAuditCompliance, getApprovalHistory, generateAuditReport
     */
    validateSOXCompliance(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        compliant: boolean;
        complianceReport: ComplianceReport;
        violations: any[];
        approvalGaps: any[];
    }>;
    /**
     * Processes batch journal entries with validation
     * Composes: validateDimensionCombination, createJournalEntryWithWorkflow, logGLTransaction
     */
    processBatchJournalEntries(entries: GLJournalEntry[], transaction?: Transaction): Promise<{
        totalProcessed: number;
        successful: number;
        failed: number;
        errors: any[];
    }>;
    /**
     * Executes recurring journal entries
     * Composes: createJournalEntryWithWorkflow, logGLTransaction, validateDimensionCombination
     */
    executeRecurringJournalEntries(templateId: number, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        journalsCreated: number;
        totalAmount: number;
        journalIds: number[];
    }>;
    /**
     * Bulk account reconciliation
     * Composes: reconcileGLToSubsidiary, calculateAccountBalance, generateAuditReport
     */
    bulkReconcileAccounts(accountCodes: string[], subsidiaryType: string, reconciliationDate: Date, transaction?: Transaction): Promise<{
        totalAccounts: number;
        reconciled: number;
        unreconciled: number;
        totalVariance: number;
        results: AccountReconciliationResult[];
    }>;
    /**
     * Performs what-if allocation scenario analysis
     * Composes: calculateAllocationAmounts, createStatisticalDriver, generateAllocationReport
     */
    analyzeAllocationScenarios(rule: AllocationRule, scenarios: any[], fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        scenarioCount: number;
        results: any[];
        recommendedScenario: number;
    }>;
    /**
     * Executes dimension hierarchy rollup for reporting
     * Composes: getDimensionHierarchy, rollupDimensionValues, calculateAccountBalance
     */
    rollupDimensionsForReporting(dimensionCode: string, accountCodes: string[], periodStart: Date, periodEnd: Date, transaction?: Transaction): Promise<{
        dimension: string;
        hierarchy: DimensionHierarchy;
        rollupValues: any[];
        totalAmount: number;
    }>;
    /**
     * Processes automated accruals and deferrals for period close
     * Composes: createJournalEntryWithWorkflow, calculateAccountBalance, logGLTransaction
     */
    processAutomatedAccrualsAndDeferrals(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        accrualsCreated: number;
        deferralsCreated: number;
        totalAccrualAmount: number;
        totalDeferralAmount: number;
        journalIds: number[];
    }>;
    /**
     * Validates chart of accounts structure with dimension requirements
     * Composes: validateAccountDimensions, getDimensionHierarchy, createAuditTrail
     */
    validateChartOfAccountsStructure(accountCodes: string[], requiredDimensions: string[], transaction?: Transaction): Promise<{
        totalAccounts: number;
        validAccounts: number;
        invalidAccounts: number;
        validationErrors: any[];
        auditTrailId: number;
    }>;
    /**
     * Generates management reporting package with multi-dimensional analysis
     * Composes: generateBalanceSheet, generateIncomeStatement, rollupDimensionValues, exportFinancialReport
     */
    generateManagementReportingPackage(fiscalYear: number, fiscalPeriod: number, dimensions: string[], format: 'pdf' | 'excel' | 'json', transaction?: Transaction): Promise<{
        reportPackage: any;
        dimensionalAnalysis: any[];
        exportPath: string;
    }>;
}
export { GLJournalEntry, GLJournalLine, MultiCurrencyJournalEntry, PeriodCloseStatus, AccountReconciliationResult, ReconciliationItem, GLConsolidationResult, };
//# sourceMappingURL=general-ledger-operations-composite.d.ts.map