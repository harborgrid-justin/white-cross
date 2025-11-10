/**
 * Financial Close Period Management Kit - FIN-CLSE-001
 * 40 enterprise-grade functions for end-of-period close workflows
 * Competitors: BlackLine, Trintech, FloQast
 *
 * NestJS 10.x + Sequelize 6.x
 * Features:
 * - Period lifecycle management (create, configure, monitor)
 * - Pre-close validation and checklists
 * - Transaction locking and process control
 * - Journal entry accruals and adjustments
 * - Account reconciliation with variance tracking
 * - Inter-company and intra-company eliminations
 * - Consolidation submission workflows
 * - Financial statement review and approval
 * - Post-close adjustments and archival
 *
 * @author HarborGrid TypeScript Architect
 * @version 1.0.0
 * @license MIT
 */
import { Sequelize } from 'sequelize';
export type CloseStatus = 'draft' | 'open' | 'locked' | 'closed' | 'archived';
export type ChecklistItemStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'waived';
export type JournalEntryType = 'accrual' | 'adjustment' | 'consolidation' | 'elimination';
export type ReconciliationStatus = 'unmatched' | 'matched' | 'variance' | 'approved';
export type SettlementStatus = 'identified' | 'confirmed' | 'settled' | 'eliminated';
export interface FiscalPeriod {
    id?: string;
    periodCode: string;
    fiscalYear: number;
    quarterNumber?: number;
    startDate: Date;
    endDate: Date;
    closeStatus: CloseStatus;
    lockedAt?: Date;
    closedAt?: Date;
}
export interface CloseChecklist {
    id?: string;
    periodCode: string;
    taskName: string;
    status: ChecklistItemStatus;
    assignedTo?: string;
    completedAt?: Date;
    dueDate: Date;
}
export interface JournalEntryClose {
    id?: string;
    periodCode: string;
    entryNumber: string;
    entryType: JournalEntryType;
    description: string;
    accountCode: string;
    debitAmount?: number;
    creditAmount?: number;
    status: 'draft' | 'posted' | 'reversed';
    createdAt?: Date;
}
export interface AccountReconciliation {
    id?: string;
    periodCode: string;
    accountCode: string;
    bookBalance: number;
    systemBalance: number;
    variance: number;
    status: ReconciliationStatus;
    investigationNotes?: string;
    approvedAt?: Date;
}
export interface CloseDashboard {
    periodCode: string;
    totalTasks: number;
    completedTasks: number;
    progressPercentage: number;
    blockersCount: number;
    daysToDeadline: number;
    lastUpdated: Date;
}
/**
 * Creates a new fiscal period with sequential validation
 */
export declare function createFiscalPeriod(sequelize: Sequelize, data: FiscalPeriod): Promise<FiscalPeriod>;
/**
 * Sets fiscal calendar with configurable month mappings
 */
export declare function setFiscalCalendar(sequelize: Sequelize, fiscalYear: number, monthMappings: Record<number, number>): Promise<void>;
/**
 * Defines close schedule with milestone dates
 */
export declare function defineCloseSchedule(sequelize: Sequelize, periodCode: string, milestones: Record<string, Date>): Promise<void>;
/**
 * Updates period status with validation and audit trail
 */
export declare function updatePeriodStatus(sequelize: Sequelize, periodCode: string, newStatus: CloseStatus): Promise<void>;
/**
 * Defines checklist tasks with due dates and dependencies
 */
export declare function defineCloseChecklist(sequelize: Sequelize, periodCode: string, tasks: Array<{
    name: string;
    dueDate: Date;
    dependency?: string;
}>): Promise<void>;
/**
 * Assigns checklist tasks to users with notifications
 */
export declare function assignChecklistTask(sequelize: Sequelize, periodCode: string, taskName: string, assignedTo: string): Promise<void>;
/**
 * Tracks and updates checklist completion with timestamps
 */
export declare function trackChecklistCompletion(sequelize: Sequelize, periodCode: string, taskName: string): Promise<void>;
/**
 * Validates all checklist items before period close
 */
export declare function validatePreCloseChecklist(sequelize: Sequelize, periodCode: string): Promise<{
    valid: boolean;
    blockers: string[];
}>;
/**
 * Initiates period close with pre-validation and state transition
 */
export declare function initiateCloseProcess(sequelize: Sequelize, periodCode: string): Promise<{
    success: boolean;
    message: string;
}>;
/**
 * Locks transactions for period with grace period for adjustments
 */
export declare function lockPeriodTransactions(sequelize: Sequelize, periodCode: string, gracePeriodDays?: number): Promise<void>;
/**
 * Runs comprehensive close validations (journals, balances, completeness)
 */
export declare function runCloseValidations(sequelize: Sequelize, periodCode: string): Promise<{
    passed: boolean;
    validations: Record<string, {
        passed: boolean;
        details?: string;
    }>;
}>;
/**
 * Completes close period with finalization and locking
 */
export declare function completeClosePeriod(sequelize: Sequelize, periodCode: string): Promise<void>;
/**
 * Tracks overall close progress with completion metrics
 */
export declare function trackCloseProgress(sequelize: Sequelize, periodCode: string): Promise<CloseDashboard>;
/**
 * Identifies blockers and escalation items with severity
 */
export declare function identifyBlockers(sequelize: Sequelize, periodCode: string): Promise<Array<{
    task: string;
    severity: 'critical' | 'high' | 'medium';
    assignee?: string;
}>>;
/**
 * Escalates critical issues with notification routing
 */
export declare function escalateCloseIssue(sequelize: Sequelize, periodCode: string, issueDescription: string, escalateTo: string): Promise<void>;
/**
 * Generates close progress dashboard with metrics
 */
export declare function generateCloseDashboard(sequelize: Sequelize, periodCode: string): Promise<Record<string, any>>;
/**
 * Accrues expenses with automatic GL distribution
 */
export declare function accrueExpense(sequelize: Sequelize, periodCode: string, accountCode: string, amount: number, description: string, offset?: {
    accountCode: string;
}): Promise<string>;
/**
 * Records period-end adjustments with full audit trail
 */
export declare function recordAdjustment(sequelize: Sequelize, periodCode: string, entryNumber: string, lines: Array<{
    accountCode: string;
    debit?: number;
    credit?: number;
    description: string;
}>): Promise<void>;
/**
 * Posts all close journal entries to GL with validation
 */
export declare function postCloseJournals(sequelize: Sequelize, periodCode: string): Promise<{
    posted: number;
    failed: number;
}>;
/**
 * Reviews and approves journal entries before posting
 */
export declare function reviewCloseJournals(sequelize: Sequelize, periodCode: string): Promise<Array<{
    entryNumber: string;
    lineCount: number;
    totalDebit: number;
    totalCredit: number;
}>>;
/**
 * Reconciles GL account balance vs source system balance
 */
export declare function reconcileAccount(sequelize: Sequelize, periodCode: string, accountCode: string, bookBalance: number, systemBalance: number): Promise<void>;
/**
 * Matches transactions between GL and subsidiary ledgers
 */
export declare function matchTransactions(sequelize: Sequelize, periodCode: string, accountCode: string, glEntries: Array<{
    id: string;
    amount: number;
    description: string;
}>, subsidiaryEntries: Array<{
    id: string;
    amount: number;
    description: string;
}>): Promise<{
    matched: number;
    unmatched: number;
}>;
/**
 * Investigates account variances with root cause documentation
 */
export declare function investigateVariance(sequelize: Sequelize, periodCode: string, accountCode: string, rootCause: string, correctionEntryNumber?: string): Promise<void>;
/**
 * Approves reconciliation with sign-off and timestamp
 */
export declare function approveReconciliation(sequelize: Sequelize, periodCode: string, accountCode: string, approvedBy: string): Promise<void>;
/**
 * Identifies inter-company balances due for settlement
 */
export declare function identifyIntercompanyBalances(sequelize: Sequelize, periodCode: string): Promise<Array<{
    company1: string;
    company2: string;
    accountCode: string;
    balance: number;
    settlementStatus: SettlementStatus;
}>>;
/**
 * Confirms inter-company amounts with validation and matching
 */
export declare function confirmIntercompanyAmount(sequelize: Sequelize, periodCode: string, company1: string, company2: string, amount: number): Promise<boolean>;
/**
 * Settles confirmed inter-company balances with GL posting
 */
export declare function settleIntercompanyBalance(sequelize: Sequelize, periodCode: string, company1: string, company2: string): Promise<void>;
/**
 * Eliminates inter-company transactions from consolidated financials
 */
export declare function eliminateIntercompanyTransactions(sequelize: Sequelize, periodCode: string, company1: string, company2: string): Promise<void>;
/**
 * Collects subsidiary financial data for consolidation
 */
export declare function collectSubsidiaryData(sequelize: Sequelize, periodCode: string, subsidiaryId: string): Promise<{
    subsidiaryId: string;
    dataCompleted: boolean;
    accountCount: number;
    totalDebits: number;
}>;
/**
 * Validates subsidiary submissions for completeness and accuracy
 */
export declare function validateSubsidiarySubmission(sequelize: Sequelize, periodCode: string, subsidiaryId: string): Promise<{
    valid: boolean;
    issues: string[];
}>;
/**
 * Consolidates subsidiary financials into group statements
 */
export declare function consolidateFinancials(sequelize: Sequelize, periodCode: string, subsidiaryIds: string[]): Promise<void>;
/**
 * Finalizes consolidation with audit adjustments and approvals
 */
export declare function finalizeConsolidation(sequelize: Sequelize, periodCode: string): Promise<{
    consolidated: boolean;
    adjustmentCount: number;
}>;
/**
 * Reviews financial statements for accuracy and disclosure completeness
 */
export declare function reviewFinancialStatements(sequelize: Sequelize, periodCode: string): Promise<{
    reviewed: boolean;
    findings: string[];
}>;
/**
 * Analyzes period-over-period variance with commentary
 */
export declare function analyzeVariance(sequelize: Sequelize, currentPeriod: string, priorPeriod: string, accountCode: string, varianceThresholdPercent?: number): Promise<{
    accountCode: string;
    currentAmount: number;
    priorAmount: number;
    variancePercent: number;
    requiresCommentary: boolean;
}>;
/**
 * Documents accounting issues with resolution tracking
 */
export declare function documentAccountingIssue(sequelize: Sequelize, periodCode: string, issueDescription: string, severity: 'critical' | 'major' | 'minor', proposedResolution: string): Promise<string>;
/**
 * Approves financial statements with sign-off and audit trail
 */
export declare function approveFinancialStatements(sequelize: Sequelize, periodCode: string, approvedBy: string, role: string): Promise<void>;
/**
 * Reopens period for post-close adjustments with audit tracking
 */
export declare function reopenForAdjustments(sequelize: Sequelize, periodCode: string, reason: string): Promise<void>;
/**
 * Archives period close documents with retention classification
 */
export declare function archiveCloseDocuments(sequelize: Sequelize, periodCode: string, documentReferences: string[], retentionYears?: number): Promise<void>;
/**
 * Generates comprehensive close report with KPIs and timeline
 */
export declare function generateCloseReport(sequelize: Sequelize, periodCode: string): Promise<Record<string, any>>;
/**
 * Rolls forward period balances to next fiscal period
 */
export declare function rollforwardBalances(sequelize: Sequelize, closedPeriodCode: string, nextPeriodCode: string): Promise<void>;
declare const _default: {
    createFiscalPeriod: typeof createFiscalPeriod;
    setFiscalCalendar: typeof setFiscalCalendar;
    defineCloseSchedule: typeof defineCloseSchedule;
    updatePeriodStatus: typeof updatePeriodStatus;
    defineCloseChecklist: typeof defineCloseChecklist;
    assignChecklistTask: typeof assignChecklistTask;
    trackChecklistCompletion: typeof trackChecklistCompletion;
    validatePreCloseChecklist: typeof validatePreCloseChecklist;
    initiateCloseProcess: typeof initiateCloseProcess;
    lockPeriodTransactions: typeof lockPeriodTransactions;
    runCloseValidations: typeof runCloseValidations;
    completeClosePeriod: typeof completeClosePeriod;
    trackCloseProgress: typeof trackCloseProgress;
    identifyBlockers: typeof identifyBlockers;
    escalateCloseIssue: typeof escalateCloseIssue;
    generateCloseDashboard: typeof generateCloseDashboard;
    accrueExpense: typeof accrueExpense;
    recordAdjustment: typeof recordAdjustment;
    postCloseJournals: typeof postCloseJournals;
    reviewCloseJournals: typeof reviewCloseJournals;
    reconcileAccount: typeof reconcileAccount;
    matchTransactions: typeof matchTransactions;
    investigateVariance: typeof investigateVariance;
    approveReconciliation: typeof approveReconciliation;
    identifyIntercompanyBalances: typeof identifyIntercompanyBalances;
    confirmIntercompanyAmount: typeof confirmIntercompanyAmount;
    settleIntercompanyBalance: typeof settleIntercompanyBalance;
    eliminateIntercompanyTransactions: typeof eliminateIntercompanyTransactions;
    collectSubsidiaryData: typeof collectSubsidiaryData;
    validateSubsidiarySubmission: typeof validateSubsidiarySubmission;
    consolidateFinancials: typeof consolidateFinancials;
    finalizeConsolidation: typeof finalizeConsolidation;
    reviewFinancialStatements: typeof reviewFinancialStatements;
    analyzeVariance: typeof analyzeVariance;
    documentAccountingIssue: typeof documentAccountingIssue;
    approveFinancialStatements: typeof approveFinancialStatements;
    reopenForAdjustments: typeof reopenForAdjustments;
    archiveCloseDocuments: typeof archiveCloseDocuments;
    generateCloseReport: typeof generateCloseReport;
    rollforwardBalances: typeof rollforwardBalances;
};
export default _default;
//# sourceMappingURL=financial-close-period-management-kit.d.ts.map