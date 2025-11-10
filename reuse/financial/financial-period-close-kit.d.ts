/**
 * LOC: FINPCL0001235
 * File: /reuse/financial/financial-period-close-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ./financial-transaction-processing-kit.ts (transaction utilities)
 *
 * DOWNSTREAM (imported by):
 *   - backend/financial/*
 *   - backend/accounting/period-close/*
 *   - backend/controllers/period-close.controller.ts
 *   - backend/services/period-close.service.ts
 */
/**
 * File: /reuse/financial/financial-period-close-kit.ts
 * Locator: WC-FIN-PRDCLS-001
 * Purpose: USACE CEFMS-level Financial Period Close - checklists, accruals, deferrals, reconciliations, lockdowns, year-end processing
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, financial-transaction-processing-kit, error-handling-kit
 * Downstream: Period close controllers, accounting services, GL close processors, year-end close systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ production-ready functions for period close, accruals, deferrals, reconciliation, lockdowns, reporting
 *
 * LLM Context: Enterprise-grade financial period close utilities competing with USACE CEFMS.
 * Provides comprehensive period close lifecycle management including close checklists, accrual calculations,
 * deferral processing, account reconciliation, balance verification, period lockdown, soft/hard close,
 * year-end close processing, trial balance generation, financial statement preparation, compliance reporting,
 * audit trail maintenance, reopen procedures, and multi-entity consolidation.
 */
import { Sequelize } from 'sequelize';
interface PeriodCloseStatus {
    fiscalYear: string;
    fiscalPeriod: string;
    status: 'open' | 'closing' | 'soft-closed' | 'hard-closed' | 'locked' | 'reopened';
    closeStartedAt?: Date;
    closeCompletedAt?: Date;
    closedBy?: string;
    lockLevel: 'none' | 'soft' | 'hard';
    canReopen: boolean;
    requiresApproval: boolean;
}
interface CloseChecklist {
    checklistId: string;
    fiscalYear: string;
    fiscalPeriod: string;
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    pendingTasks: number;
    tasks: CloseTask[];
    overallStatus: 'pending' | 'in-progress' | 'completed' | 'failed';
    completionPercentage: number;
}
interface CloseTask {
    taskId: string;
    taskName: string;
    taskType: 'validation' | 'reconciliation' | 'accrual' | 'deferral' | 'report' | 'approval' | 'system';
    sequence: number;
    status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
    required: boolean;
    automatable: boolean;
    assignedTo?: string;
    startedAt?: Date;
    completedAt?: Date;
    result?: any;
    errorMessage?: string;
}
interface AccrualEntry {
    accrualId: string;
    accrualType: 'revenue' | 'expense' | 'interest' | 'depreciation' | 'amortization';
    accountCode: string;
    amount: number;
    calculationMethod: 'manual' | 'prorated' | 'formula' | 'automated';
    calculationBasis?: string;
    description: string;
    reversalRequired: boolean;
    reversalPeriod?: string;
}
interface DeferralEntry {
    deferralId: string;
    deferralType: 'revenue' | 'expense' | 'prepaid' | 'unearned';
    accountCode: string;
    totalAmount: number;
    deferredAmount: number;
    recognizedAmount: number;
    remainingAmount: number;
    startPeriod: string;
    endPeriod: string;
    recognitionPattern: 'straight-line' | 'declining' | 'usage-based' | 'custom';
    description: string;
}
interface ReconciliationItem {
    reconciliationId: string;
    accountCode: string;
    accountName: string;
    glBalance: number;
    subledgerBalance: number;
    variance: number;
    variancePercentage: number;
    status: 'matched' | 'variance-within-threshold' | 'variance-exceeds-threshold' | 'unreconciled';
    requiresInvestigation: boolean;
    reconciledBy?: string;
    reconciledAt?: Date;
    notes?: string;
}
interface TrialBalance {
    fiscalYear: string;
    fiscalPeriod: string;
    accounts: Array<{
        accountCode: string;
        accountName: string;
        accountType: string;
        debitBalance: number;
        creditBalance: number;
        netBalance: number;
    }>;
    totalDebits: number;
    totalCredits: number;
    inBalance: boolean;
    variance: number;
    generatedAt: Date;
}
interface FinancialStatement {
    statementType: 'balance-sheet' | 'income-statement' | 'cash-flow' | 'statement-of-equity';
    fiscalYear: string;
    fiscalPeriod: string;
    entityCode?: string;
    sections: Array<{
        sectionName: string;
        sectionType: string;
        lineItems: Array<{
            lineNumber: number;
            description: string;
            amount: number;
            indentLevel: number;
            isBold: boolean;
            isSubtotal: boolean;
            isTotal: boolean;
        }>;
        subtotal?: number;
    }>;
    grandTotal?: number;
    generatedAt: Date;
}
interface YearEndProcess {
    processId: string;
    fiscalYear: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    steps: Array<{
        stepName: string;
        stepStatus: 'pending' | 'completed' | 'failed';
        completedAt?: Date;
        errorMessage?: string;
    }>;
    closingEntriesGenerated: boolean;
    balancesCarriedForward: boolean;
    newYearInitialized: boolean;
}
interface ConsolidationEntry {
    consolidationId: string;
    parentEntity: string;
    childEntities: string[];
    fiscalYear: string;
    fiscalPeriod: string;
    eliminationEntries: Array<{
        description: string;
        accountCode: string;
        amount: number;
    }>;
    consolidatedBalance: number;
}
/**
 * Fiscal Period model with comprehensive period management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FiscalPeriod model
 *
 * @example
 * ```typescript
 * const FiscalPeriod = createFiscalPeriodModel(sequelize);
 * const period = await FiscalPeriod.create({
 *   fiscalYear: '2024',
 *   fiscalPeriod: '03',
 *   periodStartDate: new Date('2024-03-01'),
 *   periodEndDate: new Date('2024-03-31'),
 *   status: 'open'
 * });
 * ```
 */
export declare const createFiscalPeriodModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        fiscalYear: string;
        fiscalPeriod: string;
        periodStartDate: Date;
        periodEndDate: Date;
        status: string;
        lockLevel: string;
        closeStartedAt: Date | null;
        closeCompletedAt: Date | null;
        closedBy: string | null;
        reopenedAt: Date | null;
        reopenedBy: string | null;
        reopenReason: string | null;
        isAdjustmentPeriod: boolean;
        isYearEnd: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Period Close Checklist model for tracking close tasks.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PeriodCloseChecklist model
 *
 * @example
 * ```typescript
 * const PeriodCloseChecklist = createPeriodCloseChecklistModel(sequelize);
 * const checklist = await PeriodCloseChecklist.create({
 *   fiscalYear: '2024',
 *   fiscalPeriod: '03',
 *   checklistType: 'month-end',
 *   status: 'in-progress'
 * });
 * ```
 */
export declare const createPeriodCloseChecklistModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        checklistId: string;
        fiscalYear: string;
        fiscalPeriod: string;
        checklistType: string;
        taskName: string;
        taskType: string;
        sequence: number;
        status: string;
        required: boolean;
        automatable: boolean;
        assignedTo: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        result: Record<string, any> | null;
        errorMessage: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Accrual/Deferral Schedule model for revenue and expense recognition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AccrualDeferralSchedule model
 *
 * @example
 * ```typescript
 * const AccrualDeferralSchedule = createAccrualDeferralScheduleModel(sequelize);
 * const schedule = await AccrualDeferralSchedule.create({
 *   scheduleType: 'deferral',
 *   accountCode: '1500-100',
 *   totalAmount: 120000,
 *   startPeriod: '2024-01',
 *   endPeriod: '2024-12'
 * });
 * ```
 */
export declare const createAccrualDeferralScheduleModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        scheduleId: string;
        scheduleType: string;
        entryType: string;
        accountCode: string;
        accountName: string;
        totalAmount: number;
        recognizedAmount: number;
        remainingAmount: number;
        startPeriod: string;
        endPeriod: string;
        recognitionPattern: string;
        calculationMethod: string;
        reversalRequired: boolean;
        reversalPeriod: string | null;
        status: string;
        description: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Gets current status of fiscal period with detailed information.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<PeriodCloseStatus>} Period status
 *
 * @example
 * ```typescript
 * const status = await getPeriodStatus('2024', '03', sequelize);
 * console.log(`Period status: ${status.status}, Lock: ${status.lockLevel}`);
 * ```
 */
export declare const getPeriodStatus: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<PeriodCloseStatus>;
/**
 * Opens a fiscal period for transactions.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {string} openedBy - User opening period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await openPeriod('2024', '04', 'user@example.com', sequelize);
 * ```
 */
export declare const openPeriod: (fiscalYear: string, fiscalPeriod: string, openedBy: string, sequelize: Sequelize) => Promise<void>;
/**
 * Soft closes a fiscal period (allows reopening).
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {string} closedBy - User closing period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await softClosePeriod('2024', '03', 'user@example.com', sequelize);
 * ```
 */
export declare const softClosePeriod: (fiscalYear: string, fiscalPeriod: string, closedBy: string, sequelize: Sequelize) => Promise<void>;
/**
 * Hard closes a fiscal period (requires approval to reopen).
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {string} closedBy - User closing period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await hardClosePeriod('2024', '03', 'user@example.com', sequelize);
 * ```
 */
export declare const hardClosePeriod: (fiscalYear: string, fiscalPeriod: string, closedBy: string, sequelize: Sequelize) => Promise<void>;
/**
 * Locks a fiscal period permanently.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {string} lockedBy - User locking period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await lockPeriodPermanently('2024', '03', 'admin@example.com', sequelize);
 * ```
 */
export declare const lockPeriodPermanently: (fiscalYear: string, fiscalPeriod: string, lockedBy: string, sequelize: Sequelize) => Promise<void>;
/**
 * Generates period close checklist based on period type.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {string} checklistType - Checklist type
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CloseChecklist>} Generated checklist
 *
 * @example
 * ```typescript
 * const checklist = await generateCloseChecklist('2024', '03', 'month-end', sequelize);
 * console.log(`Generated ${checklist.totalTasks} tasks`);
 * ```
 */
export declare const generateCloseChecklist: (fiscalYear: string, fiscalPeriod: string, checklistType: "month-end" | "quarter-end" | "year-end", sequelize: Sequelize) => Promise<CloseChecklist>;
/**
 * Gets close checklist status with task details.
 *
 * @param {string} checklistId - Checklist ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CloseChecklist>} Checklist status
 *
 * @example
 * ```typescript
 * const status = await getChecklistStatus('CL-2024-03-001', sequelize);
 * console.log(`Progress: ${status.completionPercentage}%`);
 * ```
 */
export declare const getChecklistStatus: (checklistId: string, sequelize: Sequelize) => Promise<CloseChecklist>;
/**
 * Updates checklist task status.
 *
 * @param {string} taskId - Task ID
 * @param {string} status - New status
 * @param {any} [result] - Task result
 * @param {string} [errorMessage] - Error message if failed
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateChecklistTask('TASK-001', 'completed', { balanced: true }, undefined, sequelize);
 * ```
 */
export declare const updateChecklistTask: (taskId: string, status: string, result: any | undefined, errorMessage: string | undefined, sequelize: Sequelize) => Promise<void>;
/**
 * Executes automated checklist tasks.
 *
 * @param {string} checklistId - Checklist ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{ taskId: string; success: boolean; error?: string }>>} Execution results
 *
 * @example
 * ```typescript
 * const results = await executeAutomatedTasks('CL-2024-03-001', sequelize);
 * results.forEach(r => console.log(`Task ${r.taskId}: ${r.success ? 'Success' : 'Failed'}`));
 * ```
 */
export declare const executeAutomatedTasks: (checklistId: string, sequelize: Sequelize) => Promise<Array<{
    taskId: string;
    success: boolean;
    error?: string;
}>>;
/**
 * Validates all required tasks completed before close.
 *
 * @param {string} checklistId - Checklist ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ isValid: boolean; missingTasks: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateChecklistComplete('CL-2024-03-001', sequelize);
 * if (!validation.isValid) {
 *   console.error('Missing tasks:', validation.missingTasks);
 * }
 * ```
 */
export declare const validateChecklistComplete: (checklistId: string, sequelize: Sequelize) => Promise<{
    isValid: boolean;
    missingTasks: string[];
}>;
/**
 * Calculates and creates accrual entries for period.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<AccrualEntry[]>} Created accrual entries
 *
 * @example
 * ```typescript
 * const accruals = await calculateAccruals('2024', '03', sequelize);
 * console.log(`Generated ${accruals.length} accrual entries`);
 * ```
 */
export declare const calculateAccruals: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<AccrualEntry[]>;
/**
 * Calculates accrual amount for specific schedule and period.
 *
 * @param {any} schedule - Accrual schedule
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @returns {Promise<number>} Calculated amount
 *
 * @example
 * ```typescript
 * const amount = await calculateAccrualAmount(schedule, '2024', '03');
 * ```
 */
export declare const calculateAccrualAmount: (schedule: any, fiscalYear: string, fiscalPeriod: string) => Promise<number>;
/**
 * Posts accrual entries to general ledger.
 *
 * @param {AccrualEntry[]} accruals - Accrual entries to post
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await postAccruals(accruals, '2024', '03', sequelize);
 * ```
 */
export declare const postAccruals: (accruals: AccrualEntry[], fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<void>;
/**
 * Reverses accruals from previous period if required.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Number of reversals processed
 *
 * @example
 * ```typescript
 * const count = await reverseAccruals('2024', '04', sequelize);
 * console.log(`Reversed ${count} accrual entries`);
 * ```
 */
export declare const reverseAccruals: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<number>;
/**
 * Processes all accruals for automated checklist task.
 *
 * @param {string} checklistId - Checklist ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Processing result
 *
 * @example
 * ```typescript
 * const result = await processAllAccruals('CL-2024-03-001', sequelize);
 * ```
 */
export declare const processAllAccruals: (checklistId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Calculates and creates deferral entries for period.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DeferralEntry[]>} Created deferral entries
 *
 * @example
 * ```typescript
 * const deferrals = await calculateDeferrals('2024', '03', sequelize);
 * console.log(`Generated ${deferrals.length} deferral entries`);
 * ```
 */
export declare const calculateDeferrals: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<DeferralEntry[]>;
/**
 * Calculates deferral amount for specific schedule and period.
 *
 * @param {any} schedule - Deferral schedule
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @returns {Promise<number>} Calculated amount
 *
 * @example
 * ```typescript
 * const amount = await calculateDeferralAmount(schedule, '2024', '03');
 * ```
 */
export declare const calculateDeferralAmount: (schedule: any, fiscalYear: string, fiscalPeriod: string) => Promise<number>;
/**
 * Posts deferral entries to general ledger.
 *
 * @param {DeferralEntry[]} deferrals - Deferral entries to post
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await postDeferrals(deferrals, '2024', '03', sequelize);
 * ```
 */
export declare const postDeferrals: (deferrals: DeferralEntry[], fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<void>;
/**
 * Creates new deferral schedule.
 *
 * @param {any} schedule - Schedule details
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Created schedule ID
 *
 * @example
 * ```typescript
 * const scheduleId = await createDeferralSchedule({
 *   accountCode: '1500-100',
 *   totalAmount: 120000,
 *   startPeriod: '2024-01',
 *   endPeriod: '2024-12',
 *   description: 'Prepaid insurance'
 * }, sequelize);
 * ```
 */
export declare const createDeferralSchedule: (schedule: any, sequelize: Sequelize) => Promise<string>;
/**
 * Processes all deferrals for automated checklist task.
 *
 * @param {string} checklistId - Checklist ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Processing result
 *
 * @example
 * ```typescript
 * const result = await processAllDeferrals('CL-2024-03-001', sequelize);
 * ```
 */
export declare const processAllDeferrals: (checklistId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Performs GL to subledger reconciliation.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ReconciliationItem[]>} Reconciliation results
 *
 * @example
 * ```typescript
 * const items = await reconcileGLToSubledger('2024', '03', sequelize);
 * const unreconciled = items.filter(i => i.status === 'unreconciled');
 * ```
 */
export declare const reconcileGLToSubledger: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<ReconciliationItem[]>;
/**
 * Validates account balances against expected values.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{ accountCode: string; isValid: boolean; variance: number }>>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateAccountBalances('2024', '03', sequelize);
 * const invalid = validation.filter(v => !v.isValid);
 * ```
 */
export declare const validateAccountBalances: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<Array<{
    accountCode: string;
    isValid: boolean;
    variance: number;
}>>;
/**
 * Generates reconciliation report for period.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generateReconciliationReport('2024', '03', sequelize);
 * console.log(`Total variances: ${report.totalVariances}`);
 * ```
 */
export declare const generateReconciliationReport: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<any>;
/**
 * Marks reconciliation item as resolved.
 *
 * @param {string} reconciliationId - Reconciliation ID
 * @param {string} reconciledBy - User resolving item
 * @param {string} notes - Resolution notes
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await markReconciliationResolved('REC-001', 'user@example.com', 'Timing difference', sequelize);
 * ```
 */
export declare const markReconciliationResolved: (reconciliationId: string, reconciledBy: string, notes: string, sequelize: Sequelize) => Promise<void>;
/**
 * Performs subledger reconciliation for automated task.
 *
 * @param {string} checklistId - Checklist ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await performSubledgerReconciliation('CL-2024-03-001', sequelize);
 * ```
 */
export declare const performSubledgerReconciliation: (checklistId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Generates trial balance for fiscal period.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TrialBalance>} Trial balance
 *
 * @example
 * ```typescript
 * const tb = await generateTrialBalance('2024', '03', sequelize);
 * console.log(`In balance: ${tb.inBalance}, Variance: ${tb.variance}`);
 * ```
 */
export declare const generateTrialBalance: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<TrialBalance>;
/**
 * Validates trial balance is in balance.
 *
 * @param {TrialBalance} trialBalance - Trial balance to validate
 * @returns {boolean} True if in balance
 *
 * @example
 * ```typescript
 * const isBalanced = validateTrialBalance(tb);
 * ```
 */
export declare const validateTrialBalance: (trialBalance: TrialBalance) => boolean;
/**
 * Generates balance sheet for fiscal period.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FinancialStatement>} Balance sheet
 *
 * @example
 * ```typescript
 * const bs = await generateBalanceSheet('2024', '03', sequelize);
 * console.log(`Total Assets: ${bs.sections.find(s => s.sectionName === 'Assets')?.subtotal}`);
 * ```
 */
export declare const generateBalanceSheet: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<FinancialStatement>;
/**
 * Generates income statement for fiscal period.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FinancialStatement>} Income statement
 *
 * @example
 * ```typescript
 * const is = await generateIncomeStatement('2024', '03', sequelize);
 * ```
 */
export declare const generateIncomeStatement: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<FinancialStatement>;
/**
 * Validates all transactions posted for automated task.
 *
 * @param {string} checklistId - Checklist ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateAllTransactionsPosted('CL-2024-03-001', sequelize);
 * ```
 */
export declare const validateAllTransactionsPosted: (checklistId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Initiates year-end close process.
 *
 * @param {string} fiscalYear - Fiscal year to close
 * @param {string} initiatedBy - User initiating close
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<YearEndProcess>} Year-end process
 *
 * @example
 * ```typescript
 * const yearEnd = await initiateYearEndClose('2024', 'user@example.com', sequelize);
 * ```
 */
export declare const initiateYearEndClose: (fiscalYear: string, initiatedBy: string, sequelize: Sequelize) => Promise<YearEndProcess>;
/**
 * Generates year-end closing entries.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await generateClosingEntries('2024', sequelize);
 * ```
 */
export declare const generateClosingEntries: (fiscalYear: string, sequelize: Sequelize) => Promise<void>;
/**
 * Carries forward account balances to new fiscal year.
 *
 * @param {string} closingYear - Closing fiscal year
 * @param {string} newYear - New fiscal year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Number of balances carried forward
 *
 * @example
 * ```typescript
 * const count = await carryForwardBalances('2024', '2025', sequelize);
 * console.log(`Carried forward ${count} account balances`);
 * ```
 */
export declare const carryForwardBalances: (closingYear: string, newYear: string, sequelize: Sequelize) => Promise<number>;
/**
 * Initializes new fiscal year periods.
 *
 * @param {string} fiscalYear - New fiscal year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await initializeNewFiscalYear('2025', sequelize);
 * ```
 */
export declare const initializeNewFiscalYear: (fiscalYear: string, sequelize: Sequelize) => Promise<void>;
/**
 * Validates year-end close is complete.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ isComplete: boolean; missingSteps: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateYearEndClose('2024', sequelize);
 * if (!validation.isComplete) {
 *   console.error('Missing steps:', validation.missingSteps);
 * }
 * ```
 */
export declare const validateYearEndClose: (fiscalYear: string, sequelize: Sequelize) => Promise<{
    isComplete: boolean;
    missingSteps: string[];
}>;
/**
 * Consolidates financial data from multiple entities.
 *
 * @param {string} parentEntity - Parent entity code
 * @param {string[]} childEntities - Child entity codes
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ConsolidationEntry>} Consolidation entry
 *
 * @example
 * ```typescript
 * const consolidation = await consolidateEntities('PARENT', ['CHILD1', 'CHILD2'], '2024', '03', sequelize);
 * ```
 */
export declare const consolidateEntities: (parentEntity: string, childEntities: string[], fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<ConsolidationEntry>;
/**
 * Processes intercompany eliminations.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Number of eliminations processed
 *
 * @example
 * ```typescript
 * const count = await processIntercompanyEliminations('2024', '03', sequelize);
 * ```
 */
export declare const processIntercompanyEliminations: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<number>;
/**
 * Generates consolidated financial statements.
 *
 * @param {string} parentEntity - Parent entity
 * @param {string[]} childEntities - Child entities
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FinancialStatement>} Consolidated statement
 *
 * @example
 * ```typescript
 * const statement = await generateConsolidatedStatement('PARENT', ['CHILD1'], '2024', '03', sequelize);
 * ```
 */
export declare const generateConsolidatedStatement: (parentEntity: string, childEntities: string[], fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<FinancialStatement>;
/**
 * Validates multi-entity consolidation.
 *
 * @param {string} consolidationId - Consolidation ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ isValid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateConsolidation('CONS-001', sequelize);
 * ```
 */
export declare const validateConsolidation: (consolidationId: string, sequelize: Sequelize) => Promise<{
    isValid: boolean;
    errors: string[];
}>;
/**
 * Archives consolidation data for audit purposes.
 *
 * @param {string} consolidationId - Consolidation ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await archiveConsolidationData('CONS-001', sequelize);
 * ```
 */
export declare const archiveConsolidationData: (consolidationId: string, sequelize: Sequelize) => Promise<void>;
/**
 * Reopens a closed fiscal period with approval.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {string} reopenedBy - User reopening period
 * @param {string} reason - Reason for reopening
 * @param {string} approverId - Approver ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reopenPeriod('2024', '03', 'user@example.com', 'Correction needed', 'mgr@example.com', sequelize);
 * ```
 */
export declare const reopenPeriod: (fiscalYear: string, fiscalPeriod: string, reopenedBy: string, reason: string, approverId: string, sequelize: Sequelize) => Promise<void>;
/**
 * Creates adjustment period (period 13) for year-end adjustments.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createAdjustmentPeriod('2024', sequelize);
 * ```
 */
export declare const createAdjustmentPeriod: (fiscalYear: string, sequelize: Sequelize) => Promise<void>;
/**
 * Posts adjustment entry to adjustment period.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {any} adjustment - Adjustment details
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await postAdjustmentEntry('2024', {
 *   description: 'Depreciation adjustment',
 *   entries: [...]
 * }, sequelize);
 * ```
 */
export declare const postAdjustmentEntry: (fiscalYear: string, adjustment: any, sequelize: Sequelize) => Promise<void>;
/**
 * Gets period reopen history.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Reopen history
 *
 * @example
 * ```typescript
 * const history = await getPeriodReopenHistory('2024', '03', sequelize);
 * ```
 */
export declare const getPeriodReopenHistory: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Validates period can be reopened.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ canReopen: boolean; reason?: string }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCanReopenPeriod('2024', '03', sequelize);
 * if (!validation.canReopen) {
 *   console.error('Cannot reopen:', validation.reason);
 * }
 * ```
 */
export declare const validateCanReopenPeriod: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<{
    canReopen: boolean;
    reason?: string;
}>;
/**
 * Default export with all period close utilities.
 */
declare const _default: {
    createFiscalPeriodModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            fiscalYear: string;
            fiscalPeriod: string;
            periodStartDate: Date;
            periodEndDate: Date;
            status: string;
            lockLevel: string;
            closeStartedAt: Date | null;
            closeCompletedAt: Date | null;
            closedBy: string | null;
            reopenedAt: Date | null;
            reopenedBy: string | null;
            reopenReason: string | null;
            isAdjustmentPeriod: boolean;
            isYearEnd: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createPeriodCloseChecklistModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            checklistId: string;
            fiscalYear: string;
            fiscalPeriod: string;
            checklistType: string;
            taskName: string;
            taskType: string;
            sequence: number;
            status: string;
            required: boolean;
            automatable: boolean;
            assignedTo: string | null;
            startedAt: Date | null;
            completedAt: Date | null;
            result: Record<string, any> | null;
            errorMessage: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAccrualDeferralScheduleModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            scheduleId: string;
            scheduleType: string;
            entryType: string;
            accountCode: string;
            accountName: string;
            totalAmount: number;
            recognizedAmount: number;
            remainingAmount: number;
            startPeriod: string;
            endPeriod: string;
            recognitionPattern: string;
            calculationMethod: string;
            reversalRequired: boolean;
            reversalPeriod: string | null;
            status: string;
            description: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    getPeriodStatus: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<PeriodCloseStatus>;
    openPeriod: (fiscalYear: string, fiscalPeriod: string, openedBy: string, sequelize: Sequelize) => Promise<void>;
    softClosePeriod: (fiscalYear: string, fiscalPeriod: string, closedBy: string, sequelize: Sequelize) => Promise<void>;
    hardClosePeriod: (fiscalYear: string, fiscalPeriod: string, closedBy: string, sequelize: Sequelize) => Promise<void>;
    lockPeriodPermanently: (fiscalYear: string, fiscalPeriod: string, lockedBy: string, sequelize: Sequelize) => Promise<void>;
    generateCloseChecklist: (fiscalYear: string, fiscalPeriod: string, checklistType: "month-end" | "quarter-end" | "year-end", sequelize: Sequelize) => Promise<CloseChecklist>;
    getChecklistStatus: (checklistId: string, sequelize: Sequelize) => Promise<CloseChecklist>;
    updateChecklistTask: (taskId: string, status: string, result: any | undefined, errorMessage: string | undefined, sequelize: Sequelize) => Promise<void>;
    executeAutomatedTasks: (checklistId: string, sequelize: Sequelize) => Promise<Array<{
        taskId: string;
        success: boolean;
        error?: string;
    }>>;
    validateChecklistComplete: (checklistId: string, sequelize: Sequelize) => Promise<{
        isValid: boolean;
        missingTasks: string[];
    }>;
    calculateAccruals: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<AccrualEntry[]>;
    calculateAccrualAmount: (schedule: any, fiscalYear: string, fiscalPeriod: string) => Promise<number>;
    postAccruals: (accruals: AccrualEntry[], fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<void>;
    reverseAccruals: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<number>;
    processAllAccruals: (checklistId: string, sequelize: Sequelize) => Promise<any>;
    calculateDeferrals: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<DeferralEntry[]>;
    calculateDeferralAmount: (schedule: any, fiscalYear: string, fiscalPeriod: string) => Promise<number>;
    postDeferrals: (deferrals: DeferralEntry[], fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<void>;
    createDeferralSchedule: (schedule: any, sequelize: Sequelize) => Promise<string>;
    processAllDeferrals: (checklistId: string, sequelize: Sequelize) => Promise<any>;
    reconcileGLToSubledger: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<ReconciliationItem[]>;
    validateAccountBalances: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<Array<{
        accountCode: string;
        isValid: boolean;
        variance: number;
    }>>;
    generateReconciliationReport: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<any>;
    markReconciliationResolved: (reconciliationId: string, reconciledBy: string, notes: string, sequelize: Sequelize) => Promise<void>;
    performSubledgerReconciliation: (checklistId: string, sequelize: Sequelize) => Promise<any>;
    generateTrialBalance: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<TrialBalance>;
    validateTrialBalance: (trialBalance: TrialBalance) => boolean;
    generateBalanceSheet: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<FinancialStatement>;
    generateIncomeStatement: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<FinancialStatement>;
    validateAllTransactionsPosted: (checklistId: string, sequelize: Sequelize) => Promise<any>;
    initiateYearEndClose: (fiscalYear: string, initiatedBy: string, sequelize: Sequelize) => Promise<YearEndProcess>;
    generateClosingEntries: (fiscalYear: string, sequelize: Sequelize) => Promise<void>;
    carryForwardBalances: (closingYear: string, newYear: string, sequelize: Sequelize) => Promise<number>;
    initializeNewFiscalYear: (fiscalYear: string, sequelize: Sequelize) => Promise<void>;
    validateYearEndClose: (fiscalYear: string, sequelize: Sequelize) => Promise<{
        isComplete: boolean;
        missingSteps: string[];
    }>;
    consolidateEntities: (parentEntity: string, childEntities: string[], fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<ConsolidationEntry>;
    processIntercompanyEliminations: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<number>;
    generateConsolidatedStatement: (parentEntity: string, childEntities: string[], fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<FinancialStatement>;
    validateConsolidation: (consolidationId: string, sequelize: Sequelize) => Promise<{
        isValid: boolean;
        errors: string[];
    }>;
    archiveConsolidationData: (consolidationId: string, sequelize: Sequelize) => Promise<void>;
    reopenPeriod: (fiscalYear: string, fiscalPeriod: string, reopenedBy: string, reason: string, approverId: string, sequelize: Sequelize) => Promise<void>;
    createAdjustmentPeriod: (fiscalYear: string, sequelize: Sequelize) => Promise<void>;
    postAdjustmentEntry: (fiscalYear: string, adjustment: any, sequelize: Sequelize) => Promise<void>;
    getPeriodReopenHistory: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<any[]>;
    validateCanReopenPeriod: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<{
        canReopen: boolean;
        reason?: string;
    }>;
};
export default _default;
//# sourceMappingURL=financial-period-close-kit.d.ts.map