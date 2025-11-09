/**
 * LOC: ENGINEER_BUDGET_COST_001
 * File: /reuse/engineer/budget-cost-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - zod
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Budget management services
 *   - Financial controllers
 *   - Cost tracking services
 *   - Analytics services
 *   - Reporting services
 */
import { z } from 'zod';
/**
 * Currency code type (ISO 4217)
 */
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY';
/**
 * Budget status enum
 */
export declare enum BudgetStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    ACTIVE = "active",
    LOCKED = "locked",
    CLOSED = "closed",
    REJECTED = "rejected",
    REVISED = "revised"
}
/**
 * Budget type enum
 */
export declare enum BudgetType {
    OPERATIONAL = "operational",
    CAPITAL = "capital",
    DEPARTMENTAL = "departmental",
    PROJECT = "project",
    MASTER = "master",
    ROLLING = "rolling",
    ZERO_BASED = "zero_based",
    FLEXIBLE = "flexible"
}
/**
 * Budget period enum
 */
export declare enum BudgetPeriod {
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    SEMI_ANNUAL = "semi_annual",
    ANNUAL = "annual",
    MULTI_YEAR = "multi_year"
}
/**
 * Cost category enum
 */
export declare enum CostCategory {
    LABOR = "labor",
    MATERIALS = "materials",
    EQUIPMENT = "equipment",
    SERVICES = "services",
    OVERHEAD = "overhead",
    UTILITIES = "utilities",
    MAINTENANCE = "maintenance",
    TRAVEL = "travel",
    MARKETING = "marketing",
    IT = "it",
    FACILITIES = "facilities",
    INSURANCE = "insurance",
    TAXES = "taxes",
    DEPRECIATION = "depreciation",
    OTHER = "other"
}
/**
 * Allocation method enum
 */
export declare enum AllocationMethod {
    DIRECT = "direct",
    PROPORTIONAL = "proportional",
    ACTIVITY_BASED = "activity_based",
    EQUAL = "equal",
    WEIGHTED = "weighted",
    STEP_DOWN = "step_down",
    RECIPROCAL = "reciprocal"
}
/**
 * Variance severity enum
 */
export declare enum VarianceSeverity {
    FAVORABLE = "favorable",
    NORMAL = "normal",
    WARNING = "warning",
    CRITICAL = "critical"
}
/**
 * Forecast method enum
 */
export declare enum ForecastMethod {
    LINEAR_REGRESSION = "linear_regression",
    MOVING_AVERAGE = "moving_average",
    EXPONENTIAL_SMOOTHING = "exponential_smoothing",
    SEASONAL = "seasonal",
    TREND_ANALYSIS = "trend_analysis",
    HISTORICAL_AVERAGE = "historical_average"
}
/**
 * Approval status enum
 */
export declare enum ApprovalStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    NEEDS_REVISION = "needs_revision"
}
/**
 * Money type with currency and amount
 */
export interface Money {
    amount: number;
    currency: CurrencyCode;
}
/**
 * Generic budget line item
 */
export interface BudgetLineItem<T extends Record<string, unknown> = Record<string, unknown>> {
    id: string;
    budgetId: string;
    category: CostCategory;
    name: string;
    description?: string;
    amount: Money;
    allocatedAmount: Money;
    spentAmount: Money;
    remainingAmount: Money;
    startDate: Date;
    endDate: Date;
    metadata?: T;
}
/**
 * Generic budget
 */
export interface Budget<T extends Record<string, unknown> = Record<string, unknown>> {
    id: string;
    name: string;
    type: BudgetType;
    status: BudgetStatus;
    period: BudgetPeriod;
    totalAmount: Money;
    allocatedAmount: Money;
    spentAmount: Money;
    remainingAmount: Money;
    startDate: Date;
    endDate: Date;
    ownerId: string;
    departmentId?: string;
    projectId?: string;
    parentBudgetId?: string;
    lineItems: BudgetLineItem<T>[];
    approvals: BudgetApproval[];
    revisions: BudgetRevision[];
    metadata?: T;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Cost center
 */
export interface CostCenter {
    id: string;
    code: string;
    name: string;
    description?: string;
    departmentId: string;
    managerId: string;
    budgetId?: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Expense transaction
 */
export interface ExpenseTransaction {
    id: string;
    budgetId: string;
    lineItemId?: string;
    costCenterId: string;
    category: CostCategory;
    amount: Money;
    description: string;
    transactionDate: Date;
    vendor?: string;
    receiptUrl?: string;
    approvedBy?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}
/**
 * Budget approval
 */
export interface BudgetApproval {
    id: string;
    budgetId: string;
    approverId: string;
    approverName: string;
    status: ApprovalStatus;
    level: number;
    comments?: string;
    approvedAt?: Date;
    createdAt: Date;
}
/**
 * Budget revision
 */
export interface BudgetRevision {
    id: string;
    budgetId: string;
    version: number;
    revisionDate: Date;
    revisedBy: string;
    reason: string;
    previousAmount: Money;
    newAmount: Money;
    changes: Record<string, unknown>;
    createdAt: Date;
}
/**
 * Budget variance
 */
export interface BudgetVariance {
    budgetId: string;
    lineItemId?: string;
    budgetedAmount: Money;
    actualAmount: Money;
    variance: Money;
    variancePercentage: number;
    severity: VarianceSeverity;
    period: string;
    analysisDate: Date;
}
/**
 * Budget forecast
 */
export interface BudgetForecast {
    budgetId: string;
    method: ForecastMethod;
    forecastDate: Date;
    forecastPeriod: string;
    predictedAmount: Money;
    confidenceInterval: {
        lower: Money;
        upper: Money;
    };
    accuracy?: number;
    metadata?: Record<string, unknown>;
}
/**
 * Cost allocation
 */
export interface CostAllocation {
    id: string;
    sourceCostCenterId: string;
    targetCostCenterId: string;
    amount: Money;
    method: AllocationMethod;
    basis?: string;
    percentage?: number;
    allocationDate: Date;
    metadata?: Record<string, unknown>;
}
/**
 * Conditional type for extracting numeric fields
 */
export type NumericFields<T> = {
    [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];
/**
 * Mapped type for making financial fields required
 */
export type RequiredFinancialFields<T> = T & {
    amount: Money;
    currency: CurrencyCode;
};
/**
 * Conditional type for budget with status
 */
export type BudgetWithStatus<S extends BudgetStatus> = Budget & {
    status: S;
};
/**
 * Utility type for extracting money amounts
 */
export type MoneyAmount<T> = T extends {
    amount: Money;
} ? T['amount'] : never;
/**
 * Generic report data type
 */
export interface ReportData<T = unknown> {
    title: string;
    period: string;
    generatedAt: Date;
    data: T;
    summary: Record<string, unknown>;
}
/**
 * Money validation schema
 */
export declare const MoneySchema: any;
/**
 * Budget creation schema
 */
export declare const BudgetCreateSchema: any;
/**
 * Expense transaction schema
 */
export declare const ExpenseTransactionSchema: any;
/**
 * Creates a new budget with validation and initial setup
 * @param data Budget creation data
 * @returns Created budget
 * @throws BadRequestException if validation fails
 */
export declare function createBudget<T extends Record<string, unknown> = Record<string, unknown>>(data: z.infer<typeof BudgetCreateSchema> & {
    metadata?: T;
}): Budget<T>;
/**
 * Allocates budget amount to line items
 * @param budget Budget to allocate
 * @param lineItems Line items to allocate to
 * @returns Updated budget with allocations
 * @throws BadRequestException if total allocation exceeds budget
 */
export declare function allocateBudget<T extends Record<string, unknown>>(budget: Budget<T>, lineItems: Omit<BudgetLineItem<T>, 'id' | 'budgetId' | 'allocatedAmount' | 'spentAmount' | 'remainingAmount'>[]): Budget<T>;
/**
 * Creates hierarchical budget structure
 * @param masterBudget Master budget
 * @param subBudgets Sub-budgets to create
 * @returns Array of created sub-budgets
 */
export declare function createHierarchicalBudget<T extends Record<string, unknown>>(masterBudget: Budget<T>, subBudgets: Omit<z.infer<typeof BudgetCreateSchema>, 'parentBudgetId'>[]): Budget<T>[];
/**
 * Reallocates budget between line items
 * @param budget Budget to reallocate
 * @param fromLineItemId Source line item
 * @param toLineItemId Target line item
 * @param amount Amount to reallocate
 * @returns Updated budget
 */
export declare function reallocateBudget<T extends Record<string, unknown>>(budget: Budget<T>, fromLineItemId: string, toLineItemId: string, amount: Money): Budget<T>;
/**
 * Creates rolling budget by extending period
 * @param budget Current budget
 * @param extensionMonths Number of months to extend
 * @returns New rolling budget
 */
export declare function createRollingBudget<T extends Record<string, unknown>>(budget: Budget<T>, extensionMonths: number): Budget<T>;
/**
 * Creates a new cost center
 * @param data Cost center data
 * @returns Created cost center
 */
export declare function createCostCenter(data: Omit<CostCenter, 'id' | 'createdAt' | 'updatedAt'>): CostCenter;
/**
 * Assigns budget to cost center
 * @param costCenter Cost center
 * @param budgetId Budget ID to assign
 * @returns Updated cost center
 */
export declare function assignBudgetToCostCenter(costCenter: CostCenter, budgetId: string): CostCenter;
/**
 * Gets cost centers by department
 * @param costCenters All cost centers
 * @param departmentId Department ID
 * @returns Filtered cost centers
 */
export declare function getCostCentersByDepartment(costCenters: CostCenter[], departmentId: string): CostCenter[];
/**
 * Calculates cost center utilization
 * @param costCenter Cost center
 * @param budget Associated budget
 * @returns Utilization percentage
 */
export declare function calculateCostCenterUtilization(costCenter: CostCenter, budget: Budget): number;
/**
 * Deactivates cost center
 * @param costCenter Cost center to deactivate
 * @returns Updated cost center
 */
export declare function deactivateCostCenter(costCenter: CostCenter): CostCenter;
/**
 * Records expense transaction
 * @param data Expense data
 * @returns Created expense transaction
 */
export declare function recordExpense(data: z.infer<typeof ExpenseTransactionSchema>): ExpenseTransaction;
/**
 * Updates budget with expense
 * @param budget Budget to update
 * @param expense Expense transaction
 * @returns Updated budget
 */
export declare function applyExpenseToBudget<T extends Record<string, unknown>>(budget: Budget<T>, expense: ExpenseTransaction): Budget<T>;
/**
 * Categorizes expenses by category
 * @param expenses Expense transactions
 * @returns Map of category to total amount
 */
export declare function categorizeExpenses(expenses: ExpenseTransaction[]): Map<CostCategory, Money>;
/**
 * Gets expenses by date range
 * @param expenses All expenses
 * @param startDate Range start
 * @param endDate Range end
 * @returns Filtered expenses
 */
export declare function getExpensesByDateRange(expenses: ExpenseTransaction[], startDate: Date, endDate: Date): ExpenseTransaction[];
/**
 * Calculates total expenses for period
 * @param expenses Expenses
 * @param currency Currency to use
 * @returns Total money
 */
export declare function calculateTotalExpenses(expenses: ExpenseTransaction[], currency: CurrencyCode): Money;
/**
 * Calculates budget variance
 * @param budgeted Budgeted amount
 * @param actual Actual amount
 * @returns Variance details
 */
export declare function calculateVariance(budgeted: Money, actual: Money): BudgetVariance;
/**
 * Analyzes budget variance for all line items
 * @param budget Budget to analyze
 * @returns Array of variances
 */
export declare function analyzeBudgetVariance<T extends Record<string, unknown>>(budget: Budget<T>): BudgetVariance[];
/**
 * Identifies critical variances
 * @param variances All variances
 * @returns Critical variances only
 */
export declare function getCriticalVariances(variances: BudgetVariance[]): BudgetVariance[];
/**
 * Calculates variance trend over periods
 * @param variances Historical variances
 * @returns Trend analysis
 */
export declare function analyzeVarianceTrend(variances: BudgetVariance[]): {
    improving: boolean;
    averageVariance: number;
    trend: 'up' | 'down' | 'stable';
};
/**
 * Generates variance report
 * @param budget Budget
 * @param variances Variances
 * @returns Variance report
 */
export declare function generateVarianceReport<T extends Record<string, unknown>>(budget: Budget<T>, variances: BudgetVariance[]): ReportData<BudgetVariance[]>;
/**
 * Linear regression forecast
 * @param historicalData Historical spending data
 * @param periods Number of periods to forecast
 * @returns Forecast data
 */
export declare function forecastLinearRegression(historicalData: {
    period: string;
    amount: number;
}[], periods: number): BudgetForecast[];
/**
 * Moving average forecast
 * @param historicalData Historical data
 * @param window Window size
 * @param periods Periods to forecast
 * @returns Forecast data
 */
export declare function forecastMovingAverage(historicalData: {
    period: string;
    amount: number;
}[], window: number, periods: number): BudgetForecast[];
/**
 * Exponential smoothing forecast
 * @param historicalData Historical data
 * @param alpha Smoothing factor (0-1)
 * @param periods Periods to forecast
 * @returns Forecast data
 */
export declare function forecastExponentialSmoothing(historicalData: {
    period: string;
    amount: number;
}[], alpha: number, periods: number): BudgetForecast[];
/**
 * Seasonal forecast with trend
 * @param historicalData Historical data with seasonality
 * @param seasonLength Season length (e.g., 12 for monthly data)
 * @param periods Periods to forecast
 * @returns Forecast data
 */
export declare function forecastSeasonal(historicalData: {
    period: string;
    amount: number;
}[], seasonLength: number, periods: number): BudgetForecast[];
/**
 * Combines multiple forecast methods
 * @param forecasts Array of forecasts from different methods
 * @returns Combined consensus forecast
 */
export declare function combineForecastMethods(forecasts: BudgetForecast[][]): BudgetForecast[];
/**
 * Direct cost allocation
 * @param amount Amount to allocate
 * @param sourceCostCenter Source
 * @param targetCostCenter Target
 * @returns Cost allocation
 */
export declare function allocateDirectCost(amount: Money, sourceCostCenter: CostCenter, targetCostCenter: CostCenter): CostAllocation;
/**
 * Proportional cost allocation based on percentages
 * @param totalAmount Total amount to allocate
 * @param sourceCostCenter Source
 * @param allocations Target centers with percentages
 * @returns Array of cost allocations
 */
export declare function allocateProportionalCost(totalAmount: Money, sourceCostCenter: CostCenter, allocations: {
    costCenter: CostCenter;
    percentage: number;
}[]): CostAllocation[];
/**
 * Activity-based cost allocation
 * @param totalAmount Total amount
 * @param sourceCostCenter Source
 * @param activities Activity drivers
 * @returns Cost allocations
 */
export declare function allocateActivityBasedCost(totalAmount: Money, sourceCostCenter: CostCenter, activities: {
    costCenter: CostCenter;
    activityUnits: number;
    basis: string;
}[]): CostAllocation[];
/**
 * Equal cost allocation
 * @param totalAmount Total amount
 * @param sourceCostCenter Source
 * @param targetCostCenters Targets
 * @returns Cost allocations
 */
export declare function allocateEqualCost(totalAmount: Money, sourceCostCenter: CostCenter, targetCostCenters: CostCenter[]): CostAllocation[];
/**
 * Weighted cost allocation
 * @param totalAmount Total amount
 * @param sourceCostCenter Source
 * @param weights Weight allocations
 * @returns Cost allocations
 */
export declare function allocateWeightedCost(totalAmount: Money, sourceCostCenter: CostCenter, weights: {
    costCenter: CostCenter;
    weight: number;
}[]): CostAllocation[];
/**
 * Submits budget for approval
 * @param budget Budget to submit
 * @param approvers List of approvers
 * @returns Budget with approval workflow initiated
 */
export declare function submitBudgetForApproval<T extends Record<string, unknown>>(budget: Budget<T>, approvers: {
    id: string;
    name: string;
    level: number;
}[]): Budget<T>;
/**
 * Approves budget at specific level
 * @param budget Budget
 * @param approverId Approver ID
 * @param comments Optional comments
 * @returns Updated budget
 */
export declare function approveBudget<T extends Record<string, unknown>>(budget: Budget<T>, approverId: string, comments?: string): Budget<T>;
/**
 * Rejects budget
 * @param budget Budget
 * @param approverId Approver ID
 * @param reason Rejection reason
 * @returns Updated budget
 */
export declare function rejectBudget<T extends Record<string, unknown>>(budget: Budget<T>, approverId: string, reason: string): Budget<T>;
/**
 * Converts money between currencies
 * @param amount Money to convert
 * @param targetCurrency Target currency
 * @param exchangeRate Exchange rate
 * @returns Converted money
 */
export declare function convertCurrency(amount: Money, targetCurrency: CurrencyCode, exchangeRate: number): Money;
/**
 * Gets exchange rate between currencies (mock - would use real API)
 * @param from Source currency
 * @param to Target currency
 * @returns Exchange rate
 */
export declare function getExchangeRate(from: CurrencyCode, to: CurrencyCode): number;
/**
 * Normalizes all money amounts to single currency
 * @param amounts Array of money amounts
 * @param targetCurrency Target currency
 * @returns Array of normalized amounts
 */
export declare function normalizeToSingleCurrency(amounts: Money[], targetCurrency: CurrencyCode): Money[];
/**
 * Generates budget summary report
 * @param budget Budget
 * @returns Summary report
 */
export declare function generateBudgetSummary<T extends Record<string, unknown>>(budget: Budget<T>): ReportData;
/**
 * Generates expense breakdown report
 * @param expenses Expenses
 * @param groupBy Grouping field
 * @returns Breakdown report
 */
export declare function generateExpenseBreakdown(expenses: ExpenseTransaction[], groupBy?: 'category' | 'costCenter' | 'vendor'): ReportData;
/**
 * Generates cash flow report
 * @param budgets Budgets
 * @param expenses Expenses
 * @param startDate Start date
 * @param endDate End date
 * @returns Cash flow report
 */
export declare function generateCashFlowReport(budgets: Budget[], expenses: ExpenseTransaction[], startDate: Date, endDate: Date): ReportData;
/**
 * Logger instance for budget operations
 */
export declare const budgetLogger: any;
//# sourceMappingURL=budget-cost-tracking-kit.d.ts.map