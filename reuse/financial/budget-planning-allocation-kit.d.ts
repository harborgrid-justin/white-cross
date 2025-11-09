/**
 * LOC: BUDGPLAN1234567
 * File: /reuse/financial/budget-planning-allocation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial services
 *   - Budget management controllers
 *   - Allocation workflow engines
 */
/**
 * File: /reuse/financial/budget-planning-allocation-kit.ts
 * Locator: WC-FIN-BUDG-001
 * Purpose: Comprehensive Budget Planning & Allocation Utilities - USACE CEFMS-level financial management system
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Financial controllers, budget services, allocation engines, variance analysis
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for budget creation, allocation, monitoring, variance analysis, transfers, forecasting
 *
 * LLM Context: Enterprise-grade budget planning and allocation system competing with USACE CEFMS.
 * Provides budget lifecycle management, multi-year planning, fund allocation, obligation tracking, variance analysis,
 * budget transfers, amendment workflows, approval hierarchies, fund control, budget execution monitoring,
 * carryover processing, budget revision history, financial controls, compliance validation, budget reports.
 */
import { Sequelize, Transaction } from 'sequelize';
interface BudgetPeriod {
    fiscalYear: number;
    period: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'ANNUAL';
    startDate: Date;
    endDate: Date;
}
interface AllocationRequest {
    budgetLineId: number;
    requestedAmount: number;
    purpose: string;
    requestedBy: string;
    justification: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    requiredDate?: Date;
}
interface AllocationApproval {
    approvalLevel: number;
    approverId: string;
    approverName: string;
    approverRole: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED';
    approvedAmount?: number;
    comments?: string;
    approvedAt?: Date;
}
interface BudgetTransfer {
    transferId: string;
    fromBudgetLineId: number;
    toBudgetLineId: number;
    amount: number;
    reason: string;
    requestedBy: string;
    approvals: AllocationApproval[];
    effectiveDate: Date;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'EXECUTED' | 'REJECTED';
}
interface VarianceAnalysis {
    budgetLineId: number;
    budgetedAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
    varianceType: 'FAVORABLE' | 'UNFAVORABLE' | 'NEUTRAL';
    threshold: number;
    exceedsThreshold: boolean;
    explanation?: string;
}
interface BudgetForecast {
    budgetLineId: number;
    currentSpendRate: number;
    projectedEndingBalance: number;
    projectedUtilization: number;
    daysRemaining: number;
    burnRate: number;
    confidence: 'LOW' | 'MEDIUM' | 'HIGH';
    assumptions: string[];
}
interface FundControl {
    accountCode: string;
    controlType: 'HARD_STOP' | 'WARNING' | 'INFORMATIONAL';
    threshold: number;
    thresholdType: 'AMOUNT' | 'PERCENTAGE';
    action: 'BLOCK' | 'ALERT' | 'LOG';
    notifyUsers: string[];
}
interface ObligationRecord {
    obligationNumber: string;
    budgetLineId: number;
    amount: number;
    vendor?: string;
    description: string;
    obligationDate: Date;
    expirationDate?: Date;
    status: 'ACTIVE' | 'PARTIALLY_LIQUIDATED' | 'FULLY_LIQUIDATED' | 'DEOBLIGATED';
    liquidatedAmount: number;
    remainingAmount: number;
}
interface BudgetAmendment {
    amendmentNumber: string;
    budgetId: number;
    amendmentType: 'INCREASE' | 'DECREASE' | 'REALLOCATION' | 'TECHNICAL';
    originalAmount: number;
    amendedAmount: number;
    changeAmount: number;
    reason: string;
    justification: string;
    approvals: AllocationApproval[];
    effectiveDate: Date;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
}
interface BudgetCarryover {
    fiscalYear: number;
    budgetLineId: number;
    unobligatedBalance: number;
    obligatedBalance: number;
    carryoverAmount: number;
    carryoverType: 'NO_YEAR' | 'MULTI_YEAR' | 'ONE_YEAR';
    expirationDate?: Date;
    approved: boolean;
    approvedBy?: string;
}
interface ApprovalWorkflow {
    workflowId: string;
    workflowType: 'ALLOCATION' | 'TRANSFER' | 'AMENDMENT' | 'CARRYOVER';
    currentLevel: number;
    requiredLevels: number;
    approvers: AllocationApproval[];
    autoEscalationDays?: number;
    timeoutAction?: 'AUTO_APPROVE' | 'AUTO_REJECT' | 'ESCALATE';
}
interface BudgetMetrics {
    totalBudget: number;
    totalAllocated: number;
    totalObligated: number;
    totalExpended: number;
    availableToAllocate: number;
    availableToObligate: number;
    executionRate: number;
    allocationRate: number;
    utilizationRate: number;
}
/**
 * Sequelize model for Budget Management with fiscal year, account structure, allocation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Budget model
 *
 * @example
 * ```typescript
 * const Budget = createBudgetModel(sequelize);
 * const budget = await Budget.create({
 *   fiscalYear: 2025,
 *   organizationCode: 'USACE-NAD',
 *   accountCode: '2110-5000',
 *   totalAuthorizedAmount: 5000000,
 *   status: 'APPROVED'
 * });
 * ```
 */
export declare const createBudgetModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        budgetNumber: string;
        fiscalYear: number;
        organizationCode: string;
        organizationName: string;
        accountCode: string;
        accountName: string;
        budgetType: string;
        fundSource: string;
        totalAuthorizedAmount: number;
        totalAllocatedAmount: number;
        totalObligatedAmount: number;
        totalExpendedAmount: number;
        availableBalance: number;
        status: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        effectiveDate: Date;
        expirationDate: Date | null;
        carryoverEligible: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Budget Allocation with fund distribution and obligation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetAllocation model
 *
 * @example
 * ```typescript
 * const BudgetAllocation = createBudgetAllocationModel(sequelize);
 * const allocation = await BudgetAllocation.create({
 *   budgetId: 1,
 *   allocationNumber: 'ALLOC-2025-001',
 *   allocatedAmount: 250000,
 *   purpose: 'Infrastructure maintenance project',
 *   status: 'APPROVED'
 * });
 * ```
 */
export declare const createBudgetAllocationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        budgetId: number;
        allocationNumber: string;
        allocationName: string;
        allocatedAmount: number;
        obligatedAmount: number;
        expendedAmount: number;
        availableBalance: number;
        purpose: string;
        projectCode: string | null;
        costCenter: string | null;
        category: string;
        priority: string;
        requestedBy: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        effectiveDate: Date;
        expirationDate: Date | null;
        status: string;
        approvalWorkflow: Record<string, any>;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Budget Transactions with audit trail and double-entry tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetTransaction model
 *
 * @example
 * ```typescript
 * const BudgetTransaction = createBudgetTransactionModel(sequelize);
 * const transaction = await BudgetTransaction.create({
 *   budgetId: 1,
 *   allocationId: 5,
 *   transactionType: 'OBLIGATION',
 *   amount: 15000,
 *   description: 'Purchase order PO-2025-123'
 * });
 * ```
 */
export declare const createBudgetTransactionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        transactionNumber: string;
        budgetId: number;
        allocationId: number | null;
        transactionType: string;
        amount: number;
        balanceType: string;
        description: string;
        referenceNumber: string | null;
        vendor: string | null;
        transactionDate: Date;
        postedDate: Date;
        fiscalPeriod: string;
        reversalOf: number | null;
        reversedBy: number | null;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly createdBy: string;
    };
};
/**
 * Creates a new budget for a fiscal year with validation and initial balances.
 *
 * @param {object} budgetData - Budget creation data
 * @param {string} createdBy - User creating the budget
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created budget
 *
 * @example
 * ```typescript
 * const budget = await createBudget({
 *   fiscalYear: 2025,
 *   organizationCode: 'USACE-NAD',
 *   accountCode: '2110-5000',
 *   totalAuthorizedAmount: 5000000,
 *   budgetType: 'OPERATING'
 * }, 'john.doe');
 * ```
 */
export declare const createBudget: (budgetData: any, createdBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Imports budget structure from prior fiscal year with optional scaling.
 *
 * @param {number} priorFiscalYear - Prior fiscal year to copy from
 * @param {number} newFiscalYear - New fiscal year
 * @param {number} [scalingFactor=1.0] - Scaling factor for amounts
 * @param {string} userId - User performing import
 * @returns {Promise<object[]>} Imported budget structures
 *
 * @example
 * ```typescript
 * const budgets = await importPriorYearBudget(2024, 2025, 1.03, 'jane.smith');
 * // Imports 2024 budgets scaled up by 3%
 * ```
 */
export declare const importPriorYearBudget: (priorFiscalYear: number, newFiscalYear: number, scalingFactor: number | undefined, userId: string) => Promise<any[]>;
/**
 * Validates budget data against organizational policies and fund controls.
 *
 * @param {object} budgetData - Budget data to validate
 * @param {FundControl[]} fundControls - Applicable fund controls
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateBudgetData(budgetData, fundControls);
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export declare const validateBudgetData: (budgetData: any, fundControls: FundControl[]) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Generates unique budget number based on fiscal year and organization.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} organizationCode - Organization code
 * @returns {string} Generated budget number
 *
 * @example
 * ```typescript
 * const budgetNumber = generateBudgetNumber(2025, 'USACE-NAD');
 * // Returns: 'BUD-2025-NAD-001'
 * ```
 */
export declare const generateBudgetNumber: (fiscalYear: number, organizationCode: string) => string;
/**
 * Sets up budget approval workflow based on amount and organization hierarchy.
 *
 * @param {number} budgetAmount - Budget amount
 * @param {string} organizationCode - Organization code
 * @returns {Promise<ApprovalWorkflow>} Configured approval workflow
 *
 * @example
 * ```typescript
 * const workflow = await setupBudgetApprovalWorkflow(5000000, 'USACE-NAD');
 * // Returns multi-level approval workflow for large budgets
 * ```
 */
export declare const setupBudgetApprovalWorkflow: (budgetAmount: number, organizationCode: string) => Promise<ApprovalWorkflow>;
/**
 * Allocates funds from budget to specific purpose with approval workflow.
 *
 * @param {AllocationRequest} request - Allocation request details
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateBudgetFunds({
 *   budgetLineId: 1,
 *   requestedAmount: 250000,
 *   purpose: 'Infrastructure maintenance',
 *   requestedBy: 'john.doe',
 *   priority: 'HIGH'
 * });
 * ```
 */
export declare const allocateBudgetFunds: (request: AllocationRequest, transaction?: Transaction) => Promise<any>;
/**
 * Checks available budget balance before allocation.
 *
 * @param {number} budgetId - Budget ID
 * @param {number} requestedAmount - Requested allocation amount
 * @returns {Promise<{ available: boolean; balance: number; message: string }>} Availability check
 *
 * @example
 * ```typescript
 * const check = await checkBudgetAvailability(1, 250000);
 * if (!check.available) {
 *   throw new Error(check.message);
 * }
 * ```
 */
export declare const checkBudgetAvailability: (budgetId: number, requestedAmount: number) => Promise<{
    available: boolean;
    balance: number;
    message: string;
}>;
/**
 * Processes allocation approval at specific workflow level.
 *
 * @param {number} allocationId - Allocation ID
 * @param {AllocationApproval} approval - Approval details
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Updated allocation with approval
 *
 * @example
 * ```typescript
 * const result = await processAllocationApproval(5, {
 *   approvalLevel: 1,
 *   approverId: 'manager.jones',
 *   status: 'APPROVED',
 *   comments: 'Approved for Q1 execution'
 * });
 * ```
 */
export declare const processAllocationApproval: (allocationId: number, approval: AllocationApproval, transaction?: Transaction) => Promise<any>;
/**
 * Bulk allocates funds to multiple line items simultaneously.
 *
 * @param {AllocationRequest[]} requests - Array of allocation requests
 * @param {string} userId - User performing bulk allocation
 * @returns {Promise<{ successful: object[]; failed: object[] }>} Bulk allocation results
 *
 * @example
 * ```typescript
 * const results = await bulkAllocateFunds([request1, request2, request3], 'admin');
 * console.log(`${results.successful.length} allocations created`);
 * ```
 */
export declare const bulkAllocateFunds: (requests: AllocationRequest[], userId: string) => Promise<{
    successful: any[];
    failed: any[];
}>;
/**
 * Reallocates funds from one allocation to another within same budget.
 *
 * @param {number} fromAllocationId - Source allocation ID
 * @param {number} toAllocationId - Destination allocation ID
 * @param {number} amount - Amount to reallocate
 * @param {string} reason - Reason for reallocation
 * @param {string} userId - User performing reallocation
 * @returns {Promise<object>} Reallocation transaction
 *
 * @example
 * ```typescript
 * const reallocation = await reallocateFunds(5, 8, 50000, 'Priority shift', 'manager');
 * ```
 */
export declare const reallocateFunds: (fromAllocationId: number, toAllocationId: number, amount: number, reason: string, userId: string) => Promise<any>;
/**
 * Records obligation against allocated budget.
 *
 * @param {object} obligationData - Obligation details
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<ObligationRecord>} Created obligation record
 *
 * @example
 * ```typescript
 * const obligation = await recordObligation({
 *   budgetLineId: 5,
 *   amount: 15000,
 *   vendor: 'ABC Contractors',
 *   description: 'Construction materials purchase order'
 * });
 * ```
 */
export declare const recordObligation: (obligationData: any, transaction?: Transaction) => Promise<ObligationRecord>;
/**
 * Liquidates obligation (records expenditure against obligation).
 *
 * @param {string} obligationNumber - Obligation number
 * @param {number} liquidationAmount - Amount to liquidate
 * @param {string} invoiceNumber - Invoice/payment reference
 * @returns {Promise<object>} Updated obligation with liquidation
 *
 * @example
 * ```typescript
 * const result = await liquidateObligation('OBL-12345', 7500, 'INV-2025-001');
 * ```
 */
export declare const liquidateObligation: (obligationNumber: string, liquidationAmount: number, invoiceNumber: string) => Promise<any>;
/**
 * De-obligates funds (releases unused obligation back to budget).
 *
 * @param {string} obligationNumber - Obligation number
 * @param {number} deobligationAmount - Amount to de-obligate
 * @param {string} reason - Reason for de-obligation
 * @returns {Promise<object>} De-obligation transaction
 *
 * @example
 * ```typescript
 * const result = await deobligateFunds('OBL-12345', 5000, 'Contract amendment reduction');
 * ```
 */
export declare const deobligateFunds: (obligationNumber: string, deobligationAmount: number, reason: string) => Promise<any>;
/**
 * Retrieves all obligations for a budget allocation.
 *
 * @param {number} allocationId - Budget allocation ID
 * @param {object} [filters] - Optional filters (status, date range)
 * @returns {Promise<ObligationRecord[]>} List of obligations
 *
 * @example
 * ```typescript
 * const obligations = await getObligationsByAllocation(5, { status: 'ACTIVE' });
 * ```
 */
export declare const getObligationsByAllocation: (allocationId: number, filters?: any) => Promise<ObligationRecord[]>;
/**
 * Calculates total obligated and unobligated balances for allocation.
 *
 * @param {number} allocationId - Allocation ID
 * @returns {Promise<{ allocated: number; obligated: number; unobligated: number }>} Balance summary
 *
 * @example
 * ```typescript
 * const balances = await calculateObligationBalances(5);
 * console.log(`Unobligated: ${balances.unobligated}`);
 * ```
 */
export declare const calculateObligationBalances: (allocationId: number) => Promise<{
    allocated: number;
    obligated: number;
    unobligated: number;
}>;
/**
 * Initiates budget transfer between two budget lines.
 *
 * @param {BudgetTransfer} transferData - Transfer request data
 * @returns {Promise<object>} Created transfer request
 *
 * @example
 * ```typescript
 * const transfer = await initiateBudgetTransfer({
 *   fromBudgetLineId: 5,
 *   toBudgetLineId: 8,
 *   amount: 75000,
 *   reason: 'Project priority change',
 *   requestedBy: 'manager.jones'
 * });
 * ```
 */
export declare const initiateBudgetTransfer: (transferData: Partial<BudgetTransfer>) => Promise<any>;
/**
 * Validates budget transfer against fund controls and policies.
 *
 * @param {BudgetTransfer} transfer - Transfer to validate
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateBudgetTransfer(transfer);
 * if (!validation.valid) {
 *   throw new Error('Transfer validation failed');
 * }
 * ```
 */
export declare const validateBudgetTransfer: (transfer: BudgetTransfer) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Approves budget transfer at workflow level.
 *
 * @param {string} transferId - Transfer ID
 * @param {AllocationApproval} approval - Approval details
 * @returns {Promise<object>} Updated transfer with approval
 *
 * @example
 * ```typescript
 * const result = await approveBudgetTransfer('TRF-12345', {
 *   approvalLevel: 1,
 *   approverId: 'director.smith',
 *   status: 'APPROVED'
 * });
 * ```
 */
export declare const approveBudgetTransfer: (transferId: string, approval: AllocationApproval) => Promise<any>;
/**
 * Executes approved budget transfer with transaction recording.
 *
 * @param {string} transferId - Transfer ID
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Executed transfer with transaction records
 *
 * @example
 * ```typescript
 * const result = await executeBudgetTransfer('TRF-12345');
 * ```
 */
export declare const executeBudgetTransfer: (transferId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves transfer history for a budget or allocation.
 *
 * @param {number} budgetId - Budget ID
 * @param {object} [filters] - Optional filters (date range, status)
 * @returns {Promise<BudgetTransfer[]>} Transfer history
 *
 * @example
 * ```typescript
 * const transfers = await getBudgetTransferHistory(1, { status: 'EXECUTED' });
 * ```
 */
export declare const getBudgetTransferHistory: (budgetId: number, filters?: any) => Promise<BudgetTransfer[]>;
/**
 * Calculates budget variance between planned and actual spending.
 *
 * @param {number} budgetLineId - Budget line ID
 * @param {BudgetPeriod} period - Period for analysis
 * @returns {Promise<VarianceAnalysis>} Variance analysis results
 *
 * @example
 * ```typescript
 * const variance = await calculateBudgetVariance(5, {
 *   fiscalYear: 2025,
 *   period: 'Q1',
 *   startDate: new Date('2024-10-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export declare const calculateBudgetVariance: (budgetLineId: number, period: BudgetPeriod) => Promise<VarianceAnalysis>;
/**
 * Analyzes spending trends and identifies anomalies.
 *
 * @param {number} budgetId - Budget ID
 * @param {number} lookbackMonths - Number of months to analyze
 * @returns {Promise<object>} Trend analysis with anomaly detection
 *
 * @example
 * ```typescript
 * const trends = await analyzeSpendingTrends(1, 6);
 * ```
 */
export declare const analyzeSpendingTrends: (budgetId: number, lookbackMonths: number) => Promise<any>;
/**
 * Compares budget performance across multiple periods.
 *
 * @param {number} budgetId - Budget ID
 * @param {BudgetPeriod[]} periods - Periods to compare
 * @returns {Promise<object[]>} Period-over-period comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareBudgetPeriods(1, [q1Period, q2Period, q3Period]);
 * ```
 */
export declare const compareBudgetPeriods: (budgetId: number, periods: BudgetPeriod[]) => Promise<any[]>;
/**
 * Generates variance report with explanations and recommendations.
 *
 * @param {number} budgetId - Budget ID
 * @param {BudgetPeriod} period - Reporting period
 * @param {number} [thresholdPercent=10] - Variance threshold for flagging
 * @returns {Promise<object>} Comprehensive variance report
 *
 * @example
 * ```typescript
 * const report = await generateVarianceReport(1, q1Period, 5);
 * ```
 */
export declare const generateVarianceReport: (budgetId: number, period: BudgetPeriod, thresholdPercent?: number) => Promise<any>;
/**
 * Identifies budget lines exceeding variance thresholds.
 *
 * @param {number} budgetId - Budget ID
 * @param {number} thresholdPercent - Variance threshold percentage
 * @returns {Promise<VarianceAnalysis[]>} Budget lines exceeding threshold
 *
 * @example
 * ```typescript
 * const overages = await identifyVarianceExceptions(1, 10);
 * ```
 */
export declare const identifyVarianceExceptions: (budgetId: number, thresholdPercent: number) => Promise<VarianceAnalysis[]>;
/**
 * Forecasts budget utilization based on current spending patterns.
 *
 * @param {number} budgetLineId - Budget line ID
 * @param {Date} forecastThroughDate - Date to forecast through
 * @returns {Promise<BudgetForecast>} Forecast analysis
 *
 * @example
 * ```typescript
 * const forecast = await forecastBudgetUtilization(5, new Date('2025-09-30'));
 * ```
 */
export declare const forecastBudgetUtilization: (budgetLineId: number, forecastThroughDate: Date) => Promise<BudgetForecast>;
/**
 * Calculates budget burn rate and runway.
 *
 * @param {number} allocationId - Allocation ID
 * @returns {Promise<{ dailyBurnRate: number; monthlyBurnRate: number; runwayDays: number }>} Burn rate analysis
 *
 * @example
 * ```typescript
 * const burnRate = await calculateBudgetBurnRate(5);
 * console.log(`Runway: ${burnRate.runwayDays} days`);
 * ```
 */
export declare const calculateBudgetBurnRate: (allocationId: number) => Promise<{
    dailyBurnRate: number;
    monthlyBurnRate: number;
    runwayDays: number;
}>;
/**
 * Projects end-of-year budget position based on trends.
 *
 * @param {number} budgetId - Budget ID
 * @param {Date} [asOfDate] - Date to project from (defaults to today)
 * @returns {Promise<object>} End-of-year projection
 *
 * @example
 * ```typescript
 * const projection = await projectEndOfYearPosition(1);
 * ```
 */
export declare const projectEndOfYearPosition: (budgetId: number, asOfDate?: Date) => Promise<any>;
/**
 * Identifies budgets at risk of over/under-execution.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} [riskThresholdPercent=15] - Risk threshold percentage
 * @returns {Promise<object[]>} At-risk budgets
 *
 * @example
 * ```typescript
 * const atRisk = await identifyAtRiskBudgets(2025, 20);
 * ```
 */
export declare const identifyAtRiskBudgets: (fiscalYear: number, riskThresholdPercent?: number) => Promise<any[]>;
/**
 * Generates budget execution forecast report.
 *
 * @param {number} budgetId - Budget ID
 * @param {object} [options] - Report options (scenarios, confidence levels)
 * @returns {Promise<object>} Comprehensive forecast report
 *
 * @example
 * ```typescript
 * const report = await generateBudgetForecastReport(1, { scenarios: ['best', 'likely', 'worst'] });
 * ```
 */
export declare const generateBudgetForecastReport: (budgetId: number, options?: any) => Promise<any>;
/**
 * Creates budget amendment request for budget changes.
 *
 * @param {BudgetAmendment} amendmentData - Amendment details
 * @returns {Promise<object>} Created amendment request
 *
 * @example
 * ```typescript
 * const amendment = await createBudgetAmendment({
 *   budgetId: 1,
 *   amendmentType: 'INCREASE',
 *   originalAmount: 1000000,
 *   amendedAmount: 1200000,
 *   reason: 'Additional funding received'
 * });
 * ```
 */
export declare const createBudgetAmendment: (amendmentData: Partial<BudgetAmendment>) => Promise<any>;
/**
 * Processes amendment approval through workflow.
 *
 * @param {string} amendmentNumber - Amendment number
 * @param {AllocationApproval} approval - Approval details
 * @returns {Promise<object>} Updated amendment
 *
 * @example
 * ```typescript
 * const result = await processAmendmentApproval('AMD-12345', {
 *   approvalLevel: 1,
 *   approverId: 'cfo.johnson',
 *   status: 'APPROVED'
 * });
 * ```
 */
export declare const processAmendmentApproval: (amendmentNumber: string, approval: AllocationApproval) => Promise<any>;
/**
 * Executes approved budget amendment.
 *
 * @param {string} amendmentNumber - Amendment number
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Executed amendment
 *
 * @example
 * ```typescript
 * const result = await executeAmendment('AMD-12345');
 * ```
 */
export declare const executeAmendment: (amendmentNumber: string, transaction?: Transaction) => Promise<any>;
/**
 * Tracks amendment history for a budget.
 *
 * @param {number} budgetId - Budget ID
 * @returns {Promise<BudgetAmendment[]>} Amendment history
 *
 * @example
 * ```typescript
 * const amendments = await getAmendmentHistory(1);
 * ```
 */
export declare const getAmendmentHistory: (budgetId: number) => Promise<BudgetAmendment[]>;
/**
 * Generates amendment impact analysis.
 *
 * @param {string} amendmentNumber - Amendment number
 * @returns {Promise<object>} Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeAmendmentImpact('AMD-12345');
 * ```
 */
export declare const analyzeAmendmentImpact: (amendmentNumber: string) => Promise<any>;
/**
 * Processes fiscal year-end budget carryover.
 *
 * @param {number} fiscalYear - Ending fiscal year
 * @param {number} budgetId - Budget ID
 * @returns {Promise<BudgetCarryover>} Carryover calculation
 *
 * @example
 * ```typescript
 * const carryover = await processBudgetCarryover(2024, 1);
 * ```
 */
export declare const processBudgetCarryover: (fiscalYear: number, budgetId: number) => Promise<BudgetCarryover>;
/**
 * Validates carryover eligibility based on fund type and policies.
 *
 * @param {number} budgetId - Budget ID
 * @returns {Promise<{ eligible: boolean; reason: string; amount: number }>} Eligibility determination
 *
 * @example
 * ```typescript
 * const eligibility = await validateCarryoverEligibility(1);
 * ```
 */
export declare const validateCarryoverEligibility: (budgetId: number) => Promise<{
    eligible: boolean;
    reason: string;
    amount: number;
}>;
/**
 * Transfers carryover funds to new fiscal year budget.
 *
 * @param {BudgetCarryover} carryover - Carryover details
 * @param {number} newBudgetId - New fiscal year budget ID
 * @returns {Promise<object>} Carryover transfer
 *
 * @example
 * ```typescript
 * const transfer = await transferCarryoverFunds(carryover, 15);
 * ```
 */
export declare const transferCarryoverFunds: (carryover: BudgetCarryover, newBudgetId: number) => Promise<any>;
/**
 * Generates carryover report for fiscal year end.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<object>} Carryover report
 *
 * @example
 * ```typescript
 * const report = await generateCarryoverReport(2024, 'USACE-NAD');
 * ```
 */
export declare const generateCarryoverReport: (fiscalYear: number, organizationCode?: string) => Promise<any>;
/**
 * Expires unobligated balances that cannot be carried over.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} fundType - Fund type to expire
 * @returns {Promise<object[]>} Expired balances
 *
 * @example
 * ```typescript
 * const expired = await expireUnobligatedBalances(2024, 'ONE_YEAR');
 * ```
 */
export declare const expireUnobligatedBalances: (fiscalYear: number, fundType: string) => Promise<any[]>;
/**
 * Calculates comprehensive budget metrics and KPIs.
 *
 * @param {number} budgetId - Budget ID
 * @param {Date} [asOfDate] - Date for metrics calculation
 * @returns {Promise<BudgetMetrics>} Budget metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateBudgetMetrics(1);
 * console.log(`Execution rate: ${metrics.executionRate}%`);
 * ```
 */
export declare const calculateBudgetMetrics: (budgetId: number, asOfDate?: Date) => Promise<BudgetMetrics>;
/**
 * Generates budget execution status report.
 *
 * @param {number} budgetId - Budget ID
 * @param {BudgetPeriod} period - Reporting period
 * @returns {Promise<object>} Execution status report
 *
 * @example
 * ```typescript
 * const report = await generateBudgetExecutionReport(1, q1Period);
 * ```
 */
export declare const generateBudgetExecutionReport: (budgetId: number, period: BudgetPeriod) => Promise<any>;
/**
 * Compares budget performance across organizations.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string[]} organizationCodes - Organizations to compare
 * @returns {Promise<object[]>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareBudgetPerformance(2025, ['USACE-NAD', 'USACE-SAD']);
 * ```
 */
export declare const compareBudgetPerformance: (fiscalYear: number, organizationCodes: string[]) => Promise<any[]>;
/**
 * Generates budget dashboard data for visualization.
 *
 * @param {number} budgetId - Budget ID
 * @returns {Promise<object>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateBudgetDashboard(1);
 * ```
 */
export declare const generateBudgetDashboard: (budgetId: number) => Promise<any>;
/**
 * Exports budget data to external format (Excel, CSV, PDF).
 *
 * @param {number} budgetId - Budget ID
 * @param {string} format - Export format ('EXCEL' | 'CSV' | 'PDF')
 * @param {object} [options] - Export options
 * @returns {Promise<Buffer>} Exported data buffer
 *
 * @example
 * ```typescript
 * const excelBuffer = await exportBudgetData(1, 'EXCEL', { includeTransactions: true });
 * ```
 */
export declare const exportBudgetData: (budgetId: number, format: string, options?: any) => Promise<Buffer>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createBudgetModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            budgetNumber: string;
            fiscalYear: number;
            organizationCode: string;
            organizationName: string;
            accountCode: string;
            accountName: string;
            budgetType: string;
            fundSource: string;
            totalAuthorizedAmount: number;
            totalAllocatedAmount: number;
            totalObligatedAmount: number;
            totalExpendedAmount: number;
            availableBalance: number;
            status: string;
            approvedBy: string | null;
            approvedAt: Date | null;
            effectiveDate: Date;
            expirationDate: Date | null;
            carryoverEligible: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createBudgetAllocationModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            budgetId: number;
            allocationNumber: string;
            allocationName: string;
            allocatedAmount: number;
            obligatedAmount: number;
            expendedAmount: number;
            availableBalance: number;
            purpose: string;
            projectCode: string | null;
            costCenter: string | null;
            category: string;
            priority: string;
            requestedBy: string;
            approvedBy: string | null;
            approvedAt: Date | null;
            effectiveDate: Date;
            expirationDate: Date | null;
            status: string;
            approvalWorkflow: Record<string, any>;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createBudgetTransactionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            transactionNumber: string;
            budgetId: number;
            allocationId: number | null;
            transactionType: string;
            amount: number;
            balanceType: string;
            description: string;
            referenceNumber: string | null;
            vendor: string | null;
            transactionDate: Date;
            postedDate: Date;
            fiscalPeriod: string;
            reversalOf: number | null;
            reversedBy: number | null;
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly createdBy: string;
        };
    };
    createBudget: (budgetData: any, createdBy: string, transaction?: Transaction) => Promise<any>;
    importPriorYearBudget: (priorFiscalYear: number, newFiscalYear: number, scalingFactor: number | undefined, userId: string) => Promise<any[]>;
    validateBudgetData: (budgetData: any, fundControls: FundControl[]) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    generateBudgetNumber: (fiscalYear: number, organizationCode: string) => string;
    setupBudgetApprovalWorkflow: (budgetAmount: number, organizationCode: string) => Promise<ApprovalWorkflow>;
    allocateBudgetFunds: (request: AllocationRequest, transaction?: Transaction) => Promise<any>;
    checkBudgetAvailability: (budgetId: number, requestedAmount: number) => Promise<{
        available: boolean;
        balance: number;
        message: string;
    }>;
    processAllocationApproval: (allocationId: number, approval: AllocationApproval, transaction?: Transaction) => Promise<any>;
    bulkAllocateFunds: (requests: AllocationRequest[], userId: string) => Promise<{
        successful: any[];
        failed: any[];
    }>;
    reallocateFunds: (fromAllocationId: number, toAllocationId: number, amount: number, reason: string, userId: string) => Promise<any>;
    recordObligation: (obligationData: any, transaction?: Transaction) => Promise<ObligationRecord>;
    liquidateObligation: (obligationNumber: string, liquidationAmount: number, invoiceNumber: string) => Promise<any>;
    deobligateFunds: (obligationNumber: string, deobligationAmount: number, reason: string) => Promise<any>;
    getObligationsByAllocation: (allocationId: number, filters?: any) => Promise<ObligationRecord[]>;
    calculateObligationBalances: (allocationId: number) => Promise<{
        allocated: number;
        obligated: number;
        unobligated: number;
    }>;
    initiateBudgetTransfer: (transferData: Partial<BudgetTransfer>) => Promise<any>;
    validateBudgetTransfer: (transfer: BudgetTransfer) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    approveBudgetTransfer: (transferId: string, approval: AllocationApproval) => Promise<any>;
    executeBudgetTransfer: (transferId: string, transaction?: Transaction) => Promise<any>;
    getBudgetTransferHistory: (budgetId: number, filters?: any) => Promise<BudgetTransfer[]>;
    calculateBudgetVariance: (budgetLineId: number, period: BudgetPeriod) => Promise<VarianceAnalysis>;
    analyzeSpendingTrends: (budgetId: number, lookbackMonths: number) => Promise<any>;
    compareBudgetPeriods: (budgetId: number, periods: BudgetPeriod[]) => Promise<any[]>;
    generateVarianceReport: (budgetId: number, period: BudgetPeriod, thresholdPercent?: number) => Promise<any>;
    identifyVarianceExceptions: (budgetId: number, thresholdPercent: number) => Promise<VarianceAnalysis[]>;
    forecastBudgetUtilization: (budgetLineId: number, forecastThroughDate: Date) => Promise<BudgetForecast>;
    calculateBudgetBurnRate: (allocationId: number) => Promise<{
        dailyBurnRate: number;
        monthlyBurnRate: number;
        runwayDays: number;
    }>;
    projectEndOfYearPosition: (budgetId: number, asOfDate?: Date) => Promise<any>;
    identifyAtRiskBudgets: (fiscalYear: number, riskThresholdPercent?: number) => Promise<any[]>;
    generateBudgetForecastReport: (budgetId: number, options?: any) => Promise<any>;
    createBudgetAmendment: (amendmentData: Partial<BudgetAmendment>) => Promise<any>;
    processAmendmentApproval: (amendmentNumber: string, approval: AllocationApproval) => Promise<any>;
    executeAmendment: (amendmentNumber: string, transaction?: Transaction) => Promise<any>;
    getAmendmentHistory: (budgetId: number) => Promise<BudgetAmendment[]>;
    analyzeAmendmentImpact: (amendmentNumber: string) => Promise<any>;
    processBudgetCarryover: (fiscalYear: number, budgetId: number) => Promise<BudgetCarryover>;
    validateCarryoverEligibility: (budgetId: number) => Promise<{
        eligible: boolean;
        reason: string;
        amount: number;
    }>;
    transferCarryoverFunds: (carryover: BudgetCarryover, newBudgetId: number) => Promise<any>;
    generateCarryoverReport: (fiscalYear: number, organizationCode?: string) => Promise<any>;
    expireUnobligatedBalances: (fiscalYear: number, fundType: string) => Promise<any[]>;
    calculateBudgetMetrics: (budgetId: number, asOfDate?: Date) => Promise<BudgetMetrics>;
    generateBudgetExecutionReport: (budgetId: number, period: BudgetPeriod) => Promise<any>;
    compareBudgetPerformance: (fiscalYear: number, organizationCodes: string[]) => Promise<any[]>;
    generateBudgetDashboard: (budgetId: number) => Promise<any>;
    exportBudgetData: (budgetId: number, format: string, options?: any) => Promise<Buffer>;
};
export default _default;
//# sourceMappingURL=budget-planning-allocation-kit.d.ts.map