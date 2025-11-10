/**
 * LOC: FINCLOSE001
 * File: /reuse/edwards/financial/financial-close-automation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../financial/general-ledger-operations-kit (GL operations)
 *   - ../financial/financial-accounts-management-kit (Account operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Period close services
 *   - Financial reporting processes
 *   - Reconciliation automation
 */
/**
 * File: /reuse/edwards/financial/financial-close-automation-kit.ts
 * Locator: WC-JDE-FINCLOSE-001
 * Purpose: Comprehensive Financial Close Automation - JD Edwards EnterpriseOne-level close checklists, automated entries, accruals, deferrals, reconciliations
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit, financial-accounts-management-kit
 * Downstream: ../backend/financial/*, Period Close Services, Financial Reporting, Reconciliation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for close checklists, close tasks, close schedules, automated journal entries, accruals, deferrals, reconciliations, close monitoring, variance analysis, soft close, hard close
 *
 * LLM Context: Enterprise-grade financial close automation operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive close checklist management, automated task scheduling, automated journal entry generation,
 * accrual and deferral processing, account reconciliation, close monitoring dashboards, variance analysis,
 * soft close vs hard close workflows, close approval routing, rollback capabilities, multi-entity consolidation,
 * intercompany eliminations, and close analytics.
 */
import { Sequelize, Transaction } from 'sequelize';
export declare class CreateCloseChecklistDto {
    fiscalYear: number;
    fiscalPeriod: number;
    checklistType: string;
    templateId?: number;
}
export declare class CreateCloseTaskDto {
    checklistId: number;
    taskName: string;
    taskDescription: string;
    taskCategory: string;
    assignedTo: string;
    priority: string;
    taskType: string;
}
export declare class CreateAccrualDto {
    fiscalYear: number;
    fiscalPeriod: number;
    accrualType: string;
    accountCode: string;
    accrualAmount: number;
    description: string;
    autoReverse?: boolean;
}
export declare class ReconciliationRequestDto {
    fiscalYear: number;
    fiscalPeriod: number;
    accountCode: string;
    reconciledBalance: number;
}
/**
 * Sequelize model for Close Calendar with period status tracking.
 *
 * Associations:
 * - hasMany: CloseChecklist, CloseMetrics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CloseCalendar model
 *
 * @example
 * ```typescript
 * const Calendar = createCloseCalendarModel(sequelize);
 * const period = await Calendar.findOne({
 *   where: { fiscalYear: 2024, fiscalPeriod: 1 },
 *   include: [{ model: CloseChecklist, as: 'checklists' }]
 * });
 * ```
 */
export declare const createCloseCalendarModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        fiscalYear: number;
        fiscalPeriod: number;
        periodName: string;
        periodType: string;
        startDate: Date;
        endDate: Date;
        softCloseDate: Date;
        hardCloseDate: Date;
        reportingDeadline: Date;
        status: string;
        isYearEnd: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Close Checklists with task tracking.
 *
 * Associations:
 * - belongsTo: CloseCalendar
 * - hasMany: CloseTask, CloseApproval
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CloseChecklist model
 */
export declare const createCloseChecklistModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        fiscalYear: number;
        fiscalPeriod: number;
        checklistType: string;
        templateId: number | null;
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
        blockedTasks: number;
        completionPercent: number;
        status: string;
        startedAt: Date | null;
        completedAt: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Close Tasks with dependency tracking.
 *
 * Associations:
 * - belongsTo: CloseChecklist
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CloseTask model
 */
export declare const createCloseTaskModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        checklistId: number;
        taskSequence: number;
        taskName: string;
        taskDescription: string;
        taskCategory: string;
        taskType: string;
        assignedTo: string;
        assignedRole: string | null;
        estimatedDuration: number;
        actualDuration: number | null;
        priority: string;
        dependsOn: number[];
        status: string;
        scheduledStart: Date | null;
        scheduledEnd: Date | null;
        actualStart: Date | null;
        actualEnd: Date | null;
        completedBy: string | null;
        notes: string | null;
        automationScript: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a fiscal period in the close calendar.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @param {Date} softCloseDate - Soft close deadline
 * @param {Date} hardCloseDate - Hard close deadline
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created period
 *
 * @example
 * ```typescript
 * const period = await createClosePeriod(sequelize, 2024, 1,
 *   new Date('2024-01-01'), new Date('2024-01-31'),
 *   new Date('2024-02-03'), new Date('2024-02-05'));
 * ```
 */
export declare const createClosePeriod: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, startDate: Date, endDate: Date, softCloseDate: Date, hardCloseDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Updates period status in close calendar.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} newStatus - New status
 * @param {string} userId - User performing the update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated period
 *
 * @example
 * ```typescript
 * await updatePeriodStatus(sequelize, 2024, 1, 'soft_close', 'user123');
 * ```
 */
export declare const updatePeriodStatus: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, newStatus: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves current open period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Current open period
 *
 * @example
 * ```typescript
 * const period = await getCurrentOpenPeriod(sequelize);
 * console.log(period.fiscalYear, period.fiscalPeriod);
 * ```
 */
export declare const getCurrentOpenPeriod: (sequelize: Sequelize) => Promise<any>;
/**
 * Retrieves close calendar with status summary.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<any[]>} Calendar periods
 *
 * @example
 * ```typescript
 * const calendar = await getCloseCalendar(sequelize, 2024);
 * ```
 */
export declare const getCloseCalendar: (sequelize: Sequelize, fiscalYear: number) => Promise<any[]>;
/**
 * Creates a close checklist from template or custom.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCloseChecklistDto} checklistData - Checklist data
 * @param {string} userId - User creating the checklist
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created checklist
 *
 * @example
 * ```typescript
 * const checklist = await createCloseChecklist(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   checklistType: 'monthly',
 *   templateId: 1
 * }, 'user123');
 * ```
 */
export declare const createCloseChecklist: (sequelize: Sequelize, checklistData: CreateCloseChecklistDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Copies tasks from template to checklist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Checklist ID
 * @param {number} templateId - Template ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await copyTasksFromTemplate(sequelize, 1, 1);
 * ```
 */
export declare const copyTasksFromTemplate: (sequelize: Sequelize, checklistId: number, templateId: number, transaction?: Transaction) => Promise<void>;
/**
 * Updates checklist task counts and completion percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Checklist ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateChecklistTaskCounts(sequelize, 1);
 * ```
 */
export declare const updateChecklistTaskCounts: (sequelize: Sequelize, checklistId: number, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves checklist with tasks and progress.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Checklist with tasks
 *
 * @example
 * ```typescript
 * const checklist = await getCloseChecklistWithTasks(sequelize, 2024, 1);
 * console.log(checklist.tasks, checklist.completionPercent);
 * ```
 */
export declare const getCloseChecklistWithTasks: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
/**
 * Creates a close task.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCloseTaskDto} taskData - Task data
 * @param {string} userId - User creating the task
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created task
 *
 * @example
 * ```typescript
 * const task = await createCloseTask(sequelize, {
 *   checklistId: 1,
 *   taskName: 'Reconcile bank accounts',
 *   taskDescription: 'Reconcile all bank accounts',
 *   taskCategory: 'reconciliation',
 *   assignedTo: 'user123',
 *   priority: 'high',
 *   taskType: 'manual'
 * }, 'user123');
 * ```
 */
export declare const createCloseTask: (sequelize: Sequelize, taskData: CreateCloseTaskDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Starts a close task.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} taskId - Task ID
 * @param {string} userId - User starting the task
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated task
 *
 * @example
 * ```typescript
 * await startCloseTask(sequelize, 1, 'user123');
 * ```
 */
export declare const startCloseTask: (sequelize: Sequelize, taskId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Completes a close task.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} taskId - Task ID
 * @param {string} userId - User completing the task
 * @param {string} [notes] - Optional completion notes
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated task
 *
 * @example
 * ```typescript
 * await completeCloseTask(sequelize, 1, 'user123', 'All reconciliations completed');
 * ```
 */
export declare const completeCloseTask: (sequelize: Sequelize, taskId: number, userId: string, notes?: string, transaction?: Transaction) => Promise<any>;
/**
 * Executes automated close task.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} taskId - Task ID
 * @param {string} userId - User executing the task
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeAutomatedTask(sequelize, 1, 'user123');
 * ```
 */
export declare const executeAutomatedTask: (sequelize: Sequelize, taskId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves tasks by status and assignment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Checklist ID
 * @param {string} [status] - Optional status filter
 * @param {string} [assignedTo] - Optional assignee filter
 * @returns {Promise<any[]>} Tasks
 *
 * @example
 * ```typescript
 * const tasks = await getTasksByStatus(sequelize, 1, 'pending', 'user123');
 * ```
 */
export declare const getTasksByStatus: (sequelize: Sequelize, checklistId: number, status?: string, assignedTo?: string) => Promise<any[]>;
/**
 * Creates an accrual entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateAccrualDto} accrualData - Accrual data
 * @param {string} userId - User creating the accrual
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created accrual
 *
 * @example
 * ```typescript
 * const accrual = await createAccrual(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   accrualType: 'expense',
 *   accountCode: '2100',
 *   accrualAmount: 5000,
 *   description: 'Accrued utilities',
 *   autoReverse: true
 * }, 'user123');
 * ```
 */
export declare const createAccrual: (sequelize: Sequelize, accrualData: CreateAccrualDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Posts accrual entry to general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accrualId - Accrual ID
 * @param {string} userId - User posting the accrual
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted accrual with journal entry
 *
 * @example
 * ```typescript
 * const result = await postAccrual(sequelize, 1, 'user123');
 * console.log(result.journalEntryId);
 * ```
 */
export declare const postAccrual: (sequelize: Sequelize, accrualId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates automated accruals for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Checklist ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Generated accruals
 *
 * @example
 * ```typescript
 * const accruals = await generateAutomatedAccruals(sequelize, 1);
 * ```
 */
export declare const generateAutomatedAccruals: (sequelize: Sequelize, checklistId: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Reverses accrual entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accrualId - Accrual ID
 * @param {string} userId - User reversing the accrual
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversal result
 *
 * @example
 * ```typescript
 * await reverseAccrual(sequelize, 1, 'user123');
 * ```
 */
export declare const reverseAccrual: (sequelize: Sequelize, accrualId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves accruals for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} [accrualType] - Optional accrual type filter
 * @returns {Promise<any[]>} Accruals
 *
 * @example
 * ```typescript
 * const accruals = await getAccruals(sequelize, 2024, 1, 'expense');
 * ```
 */
export declare const getAccruals: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, accrualType?: string) => Promise<any[]>;
/**
 * Creates a deferral entry with amortization schedule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} deferralType - Deferral type
 * @param {string} accountCode - Account code
 * @param {number} totalAmount - Total deferral amount
 * @param {number} amortizationPeriods - Number of periods to amortize
 * @param {string} description - Description
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created deferral
 *
 * @example
 * ```typescript
 * const deferral = await createDeferral(sequelize, 2024, 1, 'prepaid',
 *   '1500', 12000, 12, 'Annual insurance premium');
 * ```
 */
export declare const createDeferral: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, deferralType: string, accountCode: string, totalAmount: number, amortizationPeriods: number, description: string, transaction?: Transaction) => Promise<any>;
/**
 * Amortizes deferrals for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Amortization results
 *
 * @example
 * ```typescript
 * const results = await amortizeDeferrals(sequelize, 2024, 2);
 * ```
 */
export declare const amortizeDeferrals: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Creates a reconciliation item.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ReconciliationRequestDto} reconData - Reconciliation data
 * @param {string} userId - User creating the reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created reconciliation
 *
 * @example
 * ```typescript
 * const recon = await createReconciliation(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   accountCode: '1000',
 *   reconciledBalance: 50000
 * }, 'user123');
 * ```
 */
export declare const createReconciliation: (sequelize: Sequelize, reconData: ReconciliationRequestDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Completes reconciliation with explanation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reconciliationId - Reconciliation ID
 * @param {string} userId - User completing the reconciliation
 * @param {string} [explanation] - Optional variance explanation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Completed reconciliation
 *
 * @example
 * ```typescript
 * await completeReconciliation(sequelize, 1, 'user123', 'Timing difference');
 * ```
 */
export declare const completeReconciliation: (sequelize: Sequelize, reconciliationId: number, userId: string, explanation?: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves reconciliations with variance status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {boolean} [varianceOnly] - Show only items with variances
 * @returns {Promise<any[]>} Reconciliations
 *
 * @example
 * ```typescript
 * const recons = await getReconciliations(sequelize, 2024, 1, true);
 * ```
 */
export declare const getReconciliations: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, varianceOnly?: boolean) => Promise<any[]>;
/**
 * Performs variance analysis for period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} [thresholdPercent] - Variance threshold percentage
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Variance analysis results
 *
 * @example
 * ```typescript
 * const variances = await performVarianceAnalysis(sequelize, 2024, 1, 10);
 * ```
 */
export declare const performVarianceAnalysis: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, thresholdPercent?: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Retrieves variances requiring explanation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any[]>} Variances requiring explanation
 *
 * @example
 * ```typescript
 * const variances = await getVariancesRequiringExplanation(sequelize, 2024, 1);
 * ```
 */
export declare const getVariancesRequiringExplanation: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any[]>;
/**
 * Calculates close cycle time metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Cycle time metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateCloseCycleTime(sequelize, 2024, 1);
 * console.log(metrics.totalDays, metrics.taskDurations);
 * ```
 */
export declare const calculateCloseCycleTime: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
/**
 * Generates close dashboard metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Dashboard metrics
 *
 * @example
 * ```typescript
 * const dashboard = await getCloseDashboard(sequelize, 2024, 1);
 * ```
 */
export declare const getCloseDashboard: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
/**
 * Performs soft close validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<{ canClose: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSoftClose(sequelize, 2024, 1);
 * if (!validation.canClose) {
 *   console.log('Issues:', validation.issues);
 * }
 * ```
 */
export declare const validateSoftClose: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<{
    canClose: boolean;
    issues: string[];
}>;
/**
 * Performs hard close validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<{ canClose: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateHardClose(sequelize, 2024, 1);
 * ```
 */
export declare const validateHardClose: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<{
    canClose: boolean;
    issues: string[];
}>;
/**
 * Executes period close (soft or hard).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} closeType - Close type ('soft_close' or 'hard_close')
 * @param {string} userId - User executing the close
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Close result
 *
 * @example
 * ```typescript
 * const result = await executePeriodClose(sequelize, 2024, 1, 'soft_close', 'user123');
 * ```
 */
export declare const executePeriodClose: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, closeType: "soft_close" | "hard_close", userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates a close approval request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} approvalType - Approval type
 * @param {string} approverRole - Approver role
 * @param {string} approverUserId - Approver user ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created approval request
 *
 * @example
 * ```typescript
 * const approval = await createCloseApproval(sequelize, 2024, 1, 'final_close', 'CFO', 'user456');
 * ```
 */
export declare const createCloseApproval: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, approvalType: string, approverRole: string, approverUserId: string, transaction?: Transaction) => Promise<any>;
/**
 * Approves a close item.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} approvalId - Approval ID
 * @param {string} userId - User approving
 * @param {string} [comments] - Optional comments
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved item
 *
 * @example
 * ```typescript
 * await approveCloseItem(sequelize, 1, 'user456', 'Approved');
 * ```
 */
export declare const approveCloseItem: (sequelize: Sequelize, approvalId: number, userId: string, comments?: string, transaction?: Transaction) => Promise<any>;
/**
 * Rejects a close item.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} approvalId - Approval ID
 * @param {string} userId - User rejecting
 * @param {string} reason - Rejection reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Rejected item
 *
 * @example
 * ```typescript
 * await rejectCloseItem(sequelize, 1, 'user456', 'Missing reconciliations');
 * ```
 */
export declare const rejectCloseItem: (sequelize: Sequelize, approvalId: number, userId: string, reason: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates intercompany elimination entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} entityFrom - Source entity
 * @param {string} entityTo - Destination entity
 * @param {string} accountCode - Account code
 * @param {number} amount - Elimination amount
 * @param {string} eliminationType - Elimination type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created elimination
 *
 * @example
 * ```typescript
 * const elim = await createIntercompanyElimination(sequelize, 2024, 1,
 *   'ENTITY-A', 'ENTITY-B', '1200', 10000, 'receivable_payable');
 * ```
 */
export declare const createIntercompanyElimination: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, entityFrom: string, entityTo: string, accountCode: string, amount: number, eliminationType: string, transaction?: Transaction) => Promise<any>;
/**
 * Posts intercompany elimination to ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} eliminationId - Elimination ID
 * @param {string} userId - User posting
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted elimination
 *
 * @example
 * ```typescript
 * await postIntercompanyElimination(sequelize, 1, 'user123');
 * ```
 */
export declare const postIntercompanyElimination: (sequelize: Sequelize, eliminationId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Initiates close rollback.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} rollbackType - Rollback type
 * @param {string} reason - Rollback reason
 * @param {string} userId - User initiating
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Rollback record
 *
 * @example
 * ```typescript
 * const rollback = await initiateCloseRollback(sequelize, 2024, 1, 'soft_close',
 *   'Missing adjustments', 'user123');
 * ```
 */
export declare const initiateCloseRollback: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, rollbackType: string, reason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Completes close rollback.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} rollbackId - Rollback ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Completed rollback
 *
 * @example
 * ```typescript
 * await completeCloseRollback(sequelize, 1);
 * ```
 */
export declare const completeCloseRollback: (sequelize: Sequelize, rollbackId: number, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves close metrics for analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any[]>} Close metrics
 *
 * @example
 * ```typescript
 * const metrics = await getCloseMetrics(sequelize, 2024, 1);
 * ```
 */
export declare const getCloseMetrics: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any[]>;
/**
 * Creates close template from completed checklist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Source checklist ID
 * @param {string} templateName - Template name
 * @param {string} userId - User creating template
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created template
 *
 * @example
 * ```typescript
 * const template = await createCloseTemplate(sequelize, 1, 'Monthly Close Standard', 'user123');
 * ```
 */
export declare const createCloseTemplate: (sequelize: Sequelize, checklistId: number, templateName: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Applies close template to checklist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Target checklist ID
 * @param {number} templateId - Template ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyCloseTemplate(sequelize, 2, 1);
 * ```
 */
export declare const applyCloseTemplate: (sequelize: Sequelize, checklistId: number, templateId: number, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves blocked tasks.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Checklist ID
 * @returns {Promise<any[]>} Blocked tasks
 *
 * @example
 * ```typescript
 * const blocked = await getBlockedTasks(sequelize, 1);
 * ```
 */
export declare const getBlockedTasks: (sequelize: Sequelize, checklistId: number) => Promise<any[]>;
/**
 * Escalates variance for review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} varianceId - Variance analysis ID
 * @param {string} userId - User escalating
 * @param {string} reason - Escalation reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Escalated variance
 *
 * @example
 * ```typescript
 * await escalateVariance(sequelize, 1, 'user123', 'Requires CFO review');
 * ```
 */
export declare const escalateVariance: (sequelize: Sequelize, varianceId: number, userId: string, reason: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates close summary report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Close summary
 *
 * @example
 * ```typescript
 * const summary = await generateCloseSummary(sequelize, 2024, 1);
 * ```
 */
export declare const generateCloseSummary: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
declare const _default: {
    createCloseCalendarModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            fiscalYear: number;
            fiscalPeriod: number;
            periodName: string;
            periodType: string;
            startDate: Date;
            endDate: Date;
            softCloseDate: Date;
            hardCloseDate: Date;
            reportingDeadline: Date;
            status: string;
            isYearEnd: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCloseChecklistModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            fiscalYear: number;
            fiscalPeriod: number;
            checklistType: string;
            templateId: number | null;
            totalTasks: number;
            completedTasks: number;
            pendingTasks: number;
            blockedTasks: number;
            completionPercent: number;
            status: string;
            startedAt: Date | null;
            completedAt: Date | null;
            approvedBy: string | null;
            approvedAt: Date | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCloseTaskModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            checklistId: number;
            taskSequence: number;
            taskName: string;
            taskDescription: string;
            taskCategory: string;
            taskType: string;
            assignedTo: string;
            assignedRole: string | null;
            estimatedDuration: number;
            actualDuration: number | null;
            priority: string;
            dependsOn: number[];
            status: string;
            scheduledStart: Date | null;
            scheduledEnd: Date | null;
            actualStart: Date | null;
            actualEnd: Date | null;
            completedBy: string | null;
            notes: string | null;
            automationScript: string | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createClosePeriod: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, startDate: Date, endDate: Date, softCloseDate: Date, hardCloseDate: Date, transaction?: Transaction) => Promise<any>;
    updatePeriodStatus: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, newStatus: string, userId: string, transaction?: Transaction) => Promise<any>;
    getCurrentOpenPeriod: (sequelize: Sequelize) => Promise<any>;
    getCloseCalendar: (sequelize: Sequelize, fiscalYear: number) => Promise<any[]>;
    createCloseChecklist: (sequelize: Sequelize, checklistData: CreateCloseChecklistDto, userId: string, transaction?: Transaction) => Promise<any>;
    copyTasksFromTemplate: (sequelize: Sequelize, checklistId: number, templateId: number, transaction?: Transaction) => Promise<void>;
    updateChecklistTaskCounts: (sequelize: Sequelize, checklistId: number, transaction?: Transaction) => Promise<void>;
    getCloseChecklistWithTasks: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
    createCloseTask: (sequelize: Sequelize, taskData: CreateCloseTaskDto, userId: string, transaction?: Transaction) => Promise<any>;
    startCloseTask: (sequelize: Sequelize, taskId: number, userId: string, transaction?: Transaction) => Promise<any>;
    completeCloseTask: (sequelize: Sequelize, taskId: number, userId: string, notes?: string, transaction?: Transaction) => Promise<any>;
    executeAutomatedTask: (sequelize: Sequelize, taskId: number, userId: string, transaction?: Transaction) => Promise<any>;
    getTasksByStatus: (sequelize: Sequelize, checklistId: number, status?: string, assignedTo?: string) => Promise<any[]>;
    createAccrual: (sequelize: Sequelize, accrualData: CreateAccrualDto, userId: string, transaction?: Transaction) => Promise<any>;
    postAccrual: (sequelize: Sequelize, accrualId: number, userId: string, transaction?: Transaction) => Promise<any>;
    generateAutomatedAccruals: (sequelize: Sequelize, checklistId: number, transaction?: Transaction) => Promise<any[]>;
    reverseAccrual: (sequelize: Sequelize, accrualId: number, userId: string, transaction?: Transaction) => Promise<any>;
    getAccruals: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, accrualType?: string) => Promise<any[]>;
    createDeferral: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, deferralType: string, accountCode: string, totalAmount: number, amortizationPeriods: number, description: string, transaction?: Transaction) => Promise<any>;
    amortizeDeferrals: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<any[]>;
    createReconciliation: (sequelize: Sequelize, reconData: ReconciliationRequestDto, userId: string, transaction?: Transaction) => Promise<any>;
    completeReconciliation: (sequelize: Sequelize, reconciliationId: number, userId: string, explanation?: string, transaction?: Transaction) => Promise<any>;
    getReconciliations: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, varianceOnly?: boolean) => Promise<any[]>;
    performVarianceAnalysis: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, thresholdPercent?: number, transaction?: Transaction) => Promise<any[]>;
    getVariancesRequiringExplanation: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any[]>;
    calculateCloseCycleTime: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
    getCloseDashboard: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
    validateSoftClose: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<{
        canClose: boolean;
        issues: string[];
    }>;
    validateHardClose: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<{
        canClose: boolean;
        issues: string[];
    }>;
    executePeriodClose: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, closeType: "soft_close" | "hard_close", userId: string, transaction?: Transaction) => Promise<any>;
    createCloseApproval: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, approvalType: string, approverRole: string, approverUserId: string, transaction?: Transaction) => Promise<any>;
    approveCloseItem: (sequelize: Sequelize, approvalId: number, userId: string, comments?: string, transaction?: Transaction) => Promise<any>;
    rejectCloseItem: (sequelize: Sequelize, approvalId: number, userId: string, reason: string, transaction?: Transaction) => Promise<any>;
    createIntercompanyElimination: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, entityFrom: string, entityTo: string, accountCode: string, amount: number, eliminationType: string, transaction?: Transaction) => Promise<any>;
    postIntercompanyElimination: (sequelize: Sequelize, eliminationId: number, userId: string, transaction?: Transaction) => Promise<any>;
    initiateCloseRollback: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, rollbackType: string, reason: string, userId: string, transaction?: Transaction) => Promise<any>;
    completeCloseRollback: (sequelize: Sequelize, rollbackId: number, transaction?: Transaction) => Promise<any>;
    getCloseMetrics: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any[]>;
    createCloseTemplate: (sequelize: Sequelize, checklistId: number, templateName: string, userId: string, transaction?: Transaction) => Promise<any>;
    applyCloseTemplate: (sequelize: Sequelize, checklistId: number, templateId: number, transaction?: Transaction) => Promise<void>;
    getBlockedTasks: (sequelize: Sequelize, checklistId: number) => Promise<any[]>;
    escalateVariance: (sequelize: Sequelize, varianceId: number, userId: string, reason: string, transaction?: Transaction) => Promise<any>;
    generateCloseSummary: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
};
export default _default;
//# sourceMappingURL=financial-close-automation-kit.d.ts.map