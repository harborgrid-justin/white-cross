/**
 * LOC: FPCCOMP001
 * File: /reuse/edwards/financial/composites/financial-period-close-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../financial-close-automation-kit
 *   - ../financial-workflow-approval-kit
 *   - ../banking-reconciliation-kit
 *   - ../intercompany-accounting-kit
 *   - ../allocation-engines-rules-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../audit-trail-compliance-kit
 *   - ../dimension-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Period close REST API controllers
 *   - Close monitoring GraphQL resolvers
 *   - Close automation services
 *   - Financial reporting modules
 *   - Consolidation services
 */
import { Transaction } from 'sequelize';
import { CloseCalendar } from '../financial-close-automation-kit';
import { AllocationRule } from '../allocation-engines-rules-kit';
import { TrialBalance, FinancialStatements } from '../financial-reporting-analytics-kit';
/**
 * Period close initialization request
 */
export interface PeriodCloseInitializationRequest {
    fiscalYear: number;
    fiscalPeriod: number;
    periodType: 'regular' | 'adjustment' | 'year_end';
    softCloseDate: Date;
    hardCloseDate: Date;
    reportingDeadline: Date;
    checklistTemplateId?: number;
    entities: string[];
    closeType: 'single-entity' | 'multi-entity' | 'consolidated';
}
/**
 * Close status summary
 */
export interface CloseStatusSummary {
    fiscalYear: number;
    fiscalPeriod: number;
    closePhase: 'preparation' | 'execution' | 'validation' | 'approval' | 'completed';
    overallStatus: 'not_started' | 'in_progress' | 'soft_closed' | 'hard_closed' | 'locked';
    completionPercent: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    blockedTasks: number;
    criticalIssues: number;
    estimatedCompletionDate: Date;
    daysToDeadline: number;
    onTrack: boolean;
}
/**
 * Close task execution result
 */
export interface CloseTaskExecutionResult {
    taskId: number;
    taskName: string;
    executed: boolean;
    executionTime: number;
    result: any;
    errors: string[];
    nextTasks: number[];
}
/**
 * Accrual and deferral processing result
 */
export interface AccrualDeferralProcessingResult {
    accrualsCreated: number;
    accrualsPosted: number;
    accrualAmount: number;
    deferralsCreated: number;
    deferralsAmortized: number;
    deferralAmount: number;
    journalEntries: number[];
    errors: AccrualDeferralError[];
}
/**
 * Accrual/deferral error
 */
export interface AccrualDeferralError {
    errorType: 'validation' | 'posting' | 'calculation';
    accountCode: string;
    amount: number;
    message: string;
}
/**
 * Reconciliation workflow result
 */
export interface ReconciliationWorkflowResult {
    totalReconciliations: number;
    completed: number;
    pending: number;
    failed: number;
    totalVariance: number;
    reconciliations: ReconciliationDetail[];
}
/**
 * Reconciliation detail
 */
export interface ReconciliationDetail {
    reconciliationId: number;
    reconciliationType: 'bank' | 'intercompany' | 'account' | 'balance';
    accountCode: string;
    glBalance: number;
    subsidiaryBalance: number;
    variance: number;
    status: 'pending' | 'completed' | 'failed';
    reconciler?: string;
    reviewedBy?: string;
}
/**
 * Variance analysis result
 */
export interface VarianceAnalysisResult {
    totalVariances: number;
    significantVariances: number;
    varianceAmount: number;
    variancePercent: number;
    variances: VarianceDetail[];
    explanationsRequired: number;
    explanationsProvided: number;
}
/**
 * Variance detail
 */
export interface VarianceDetail {
    accountCode: string;
    accountName: string;
    currentPeriod: number;
    priorPeriod: number;
    budgetAmount: number;
    variance: number;
    variancePercent: number;
    threshold: number;
    requiresExplanation: boolean;
    explanation?: string;
    explainedBy?: string;
}
/**
 * Close validation result
 */
export interface CloseValidationResult {
    validationType: 'soft_close' | 'hard_close';
    validationPassed: boolean;
    validationChecks: ValidationCheck[];
    blockers: ValidationBlocker[];
    warnings: ValidationWarning[];
    canProceed: boolean;
}
/**
 * Validation check
 */
export interface ValidationCheck {
    checkName: string;
    checkType: 'balance' | 'reconciliation' | 'variance' | 'approval' | 'compliance';
    status: 'passed' | 'failed' | 'warning';
    result: any;
    message: string;
}
/**
 * Validation blocker
 */
export interface ValidationBlocker {
    blockerType: string;
    severity: 'critical' | 'high';
    accountCode?: string;
    message: string;
    resolution: string;
}
/**
 * Validation warning
 */
export interface ValidationWarning {
    warningType: string;
    severity: 'medium' | 'low';
    message: string;
    canOverride: boolean;
}
/**
 * Consolidation result
 */
export interface ConsolidationResult {
    consolidationId: number;
    consolidationDate: Date;
    entities: string[];
    eliminationEntries: number;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    intercompanyBalance: number;
    consolidatedStatements: FinancialStatements;
    validationPassed: boolean;
}
/**
 * Close performance metrics
 */
export interface ClosePerformanceMetrics {
    fiscalYear: number;
    fiscalPeriod: number;
    actualCloseDays: number;
    targetCloseDays: number;
    cycleTimeImprovement: number;
    tasksCompleted: number;
    tasksOnTime: number;
    onTimePercent: number;
    automationRate: number;
    exceptionRate: number;
    qualityScore: number;
}
export declare class FinancialPeriodCloseComposite {
    /**
     * Initializes period close with checklist and task generation
     * Composes: createClosePeriod, createCloseChecklist, copyTasksFromTemplate, logCloseActivity
     */
    initializePeriodClose(request: PeriodCloseInitializationRequest, transaction?: Transaction): Promise<{
        periodId: number;
        checklistId: number;
        totalTasks: number;
        closeCalendar: CloseCalendar;
    }>;
    /**
     * Generates close status summary with real-time updates
     * Composes: getCloseDashboard, updateChecklistTaskCounts, calculateCloseCycleTime
     */
    getCloseStatusSummary(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<CloseStatusSummary>;
    /**
     * Creates and orchestrates close tasks with dependencies
     * Composes: createCloseTask, startCloseTask, completeCloseTask, executeAutomatedTask
     */
    orchestrateCloseTasks(checklistId: number, parallelExecution?: boolean, transaction?: Transaction): Promise<{
        tasksExecuted: number;
        tasksSucceeded: number;
        tasksFailed: number;
        results: CloseTaskExecutionResult[];
    }>;
    /**
     * Processes automated accruals with validation and posting
     * Composes: generateAutomatedAccruals, createAccrual, postAccrual, logCloseActivity
     */
    processAutomatedAccruals(fiscalYear: number, fiscalPeriod: number, accrualTypes: string[], transaction?: Transaction): Promise<AccrualDeferralProcessingResult>;
    /**
     * Amortizes deferrals for period close
     * Composes: createDeferral, amortizeDeferrals, logCloseActivity
     */
    amortizeDeferralsForPeriod(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<AccrualDeferralProcessingResult>;
    /**
     * Reverses prior period accruals
     * Composes: reverseAccrual, postAccrual, createAuditTrail
     */
    reversePriorPeriodAccruals(fiscalYear: number, fiscalPeriod: number, accrualIds: number[], transaction?: Transaction): Promise<{
        accrualsReversed: number;
        reversalAmount: number;
        journalEntries: number[];
    }>;
    /**
     * Executes period-end allocations
     * Composes: executeAllocation, processReciprocalAllocations, generateAllocationReport
     */
    executePeriodEndAllocations(fiscalYear: number, fiscalPeriod: number, allocationRules: AllocationRule[], transaction?: Transaction): Promise<{
        allocationsExecuted: number;
        totalAllocated: number;
        journalEntries: number[];
        reports: any[];
    }>;
    /**
     * Processes reciprocal allocations for period close
     * Composes: processReciprocalAllocations, generateAllocationReport, logCloseActivity
     */
    processReciprocalAllocationsForClose(fiscalYear: number, fiscalPeriod: number, allocationPools: any[], maxIterations?: number, transaction?: Transaction): Promise<{
        iterations: number;
        totalAllocated: number;
        journalEntries: number[];
        converged: boolean;
    }>;
    /**
     * Orchestrates comprehensive reconciliation workflow
     * Composes: createReconciliation, reconcileBankStatement, reconcileIntercompanyAccounts, completeReconciliation
     */
    executeReconciliationWorkflow(fiscalYear: number, fiscalPeriod: number, reconciliationTypes: string[], transaction?: Transaction): Promise<ReconciliationWorkflowResult>;
    /**
     * Validates account balances for close
     * Composes: createReconciliation, performVarianceAnalysis, completeReconciliation
     */
    validateAccountBalancesForClose(fiscalYear: number, fiscalPeriod: number, accountCodes: string[], transaction?: Transaction): Promise<{
        totalAccounts: number;
        validated: number;
        failedValidation: number;
        totalVariance: number;
    }>;
    /**
     * Performs comprehensive variance analysis for close
     * Composes: performVarianceAnalysis, getVariancesRequiringExplanation, createAuditTrail
     */
    analyzePeriodVariances(fiscalYear: number, fiscalPeriod: number, varianceThreshold: number, transaction?: Transaction): Promise<VarianceAnalysisResult>;
    /**
     * Validates variance explanations for close approval
     * Composes: getVariancesRequiringExplanation, validateAuditCompliance
     */
    validateVarianceExplanations(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        totalRequiringExplanation: number;
        explained: number;
        unexplained: number;
        compliant: boolean;
    }>;
    /**
     * Validates soft close readiness
     * Composes: validateSoftClose, generateTrialBalance, getCloseDashboard
     */
    validateSoftCloseReadiness(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<CloseValidationResult>;
    /**
     * Validates hard close readiness with comprehensive checks
     * Composes: validateHardClose, validateAuditCompliance, checkApprovalStatus
     */
    validateHardCloseReadiness(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<CloseValidationResult>;
    /**
     * Executes complete period close with all steps
     * Composes: executePeriodClose, updatePeriodStatus, generateCloseSummary, createAuditTrail
     */
    executeCompletePeriodClose(fiscalYear: number, fiscalPeriod: number, closeType: 'soft' | 'hard', transaction?: Transaction): Promise<{
        closeExecuted: boolean;
        closeDate: Date;
        summaryId: number;
        auditTrailId: number;
        nextSteps: string[];
    }>;
    /**
     * Processes close approval workflow
     * Composes: createCloseApproval, initiateApprovalWorkflow, approveCloseItem
     */
    processCloseApprovalWorkflow(fiscalYear: number, fiscalPeriod: number, approvers: string[], transaction?: Transaction): Promise<{
        approvalId: number;
        workflowId: number;
        approvalStatus: string;
        pendingApprovals: number;
    }>;
    /**
     * Initiates period close rollback
     * Composes: initiateCloseRollback, updatePeriodStatus, createAuditTrail
     */
    rollbackPeriodClose(fiscalYear: number, fiscalPeriod: number, rollbackReason: string, transaction?: Transaction): Promise<{
        rollbackInitiated: boolean;
        rollbackId: number;
        entriesReversed: number;
        periodReopened: boolean;
    }>;
    /**
     * Processes multi-entity consolidation
     * Composes: matchIntercompanyTransactions, createEliminationEntry, postIntercompanyElimination, generateConsolidatedFinancials
     */
    processMultiEntityConsolidation(fiscalYear: number, fiscalPeriod: number, entities: string[], transaction?: Transaction): Promise<ConsolidationResult>;
    /**
     * Validates consolidation balances
     * Composes: validateIntercompanyBalance, generateTrialBalance, generateAuditReport
     */
    validateConsolidationBalances(entities: string[], fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        consolidationValid: boolean;
        totalVariance: number;
        entityBalances: any[];
        eliminationTotal: number;
    }>;
    /**
     * Generates comprehensive close reporting package
     * Composes: generateTrialBalance, generateBalanceSheet, generateIncomeStatement, generateCloseSummary, exportFinancialReport
     */
    generateCloseReportingPackage(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        trialBalance: TrialBalance;
        balanceSheet: any;
        incomeStatement: any;
        closeSummary: any;
        packagePath: string;
    }>;
    /**
     * Analyzes close performance metrics
     * Composes: calculateCloseCycleTime, getCloseDashboard, generateAuditReport
     */
    analyzeClosePerformanceMetrics(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<ClosePerformanceMetrics>;
}
export { PeriodCloseInitializationRequest, CloseStatusSummary, CloseTaskExecutionResult, AccrualDeferralProcessingResult, AccrualDeferralError, ReconciliationWorkflowResult, ReconciliationDetail, VarianceAnalysisResult, VarianceDetail, CloseValidationResult, ValidationCheck, ValidationBlocker, ValidationWarning, ConsolidationResult, ClosePerformanceMetrics, };
//# sourceMappingURL=financial-period-close-composite.d.ts.map