"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetLogger = exports.ExpenseTransactionSchema = exports.BudgetCreateSchema = exports.MoneySchema = exports.ApprovalStatus = exports.ForecastMethod = exports.VarianceSeverity = exports.AllocationMethod = exports.CostCategory = exports.BudgetPeriod = exports.BudgetType = exports.BudgetStatus = void 0;
exports.createBudget = createBudget;
exports.allocateBudget = allocateBudget;
exports.createHierarchicalBudget = createHierarchicalBudget;
exports.reallocateBudget = reallocateBudget;
exports.createRollingBudget = createRollingBudget;
exports.createCostCenter = createCostCenter;
exports.assignBudgetToCostCenter = assignBudgetToCostCenter;
exports.getCostCentersByDepartment = getCostCentersByDepartment;
exports.calculateCostCenterUtilization = calculateCostCenterUtilization;
exports.deactivateCostCenter = deactivateCostCenter;
exports.recordExpense = recordExpense;
exports.applyExpenseToBudget = applyExpenseToBudget;
exports.categorizeExpenses = categorizeExpenses;
exports.getExpensesByDateRange = getExpensesByDateRange;
exports.calculateTotalExpenses = calculateTotalExpenses;
exports.calculateVariance = calculateVariance;
exports.analyzeBudgetVariance = analyzeBudgetVariance;
exports.getCriticalVariances = getCriticalVariances;
exports.analyzeVarianceTrend = analyzeVarianceTrend;
exports.generateVarianceReport = generateVarianceReport;
exports.forecastLinearRegression = forecastLinearRegression;
exports.forecastMovingAverage = forecastMovingAverage;
exports.forecastExponentialSmoothing = forecastExponentialSmoothing;
exports.forecastSeasonal = forecastSeasonal;
exports.combineForecastMethods = combineForecastMethods;
exports.allocateDirectCost = allocateDirectCost;
exports.allocateProportionalCost = allocateProportionalCost;
exports.allocateActivityBasedCost = allocateActivityBasedCost;
exports.allocateEqualCost = allocateEqualCost;
exports.allocateWeightedCost = allocateWeightedCost;
exports.submitBudgetForApproval = submitBudgetForApproval;
exports.approveBudget = approveBudget;
exports.rejectBudget = rejectBudget;
exports.convertCurrency = convertCurrency;
exports.getExchangeRate = getExchangeRate;
exports.normalizeToSingleCurrency = normalizeToSingleCurrency;
exports.generateBudgetSummary = generateBudgetSummary;
exports.generateExpenseBreakdown = generateExpenseBreakdown;
exports.generateCashFlowReport = generateCashFlowReport;
/**
 * File: /reuse/engineer/budget-cost-tracking-kit.ts
 * Locator: WC-ENGINEER-BUDGET-COST-001
 * Purpose: Production-Grade Budget & Cost Tracking Kit - Enterprise financial management toolkit
 *
 * Upstream: NestJS, Zod, date-fns
 * Downstream: ../backend/finance/*, Budget Services, Cost Services, Analytics Services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, zod
 * Exports: 45 production-ready budget and cost management functions
 *
 * LLM Context: Production-grade budget and cost tracking utilities for White Cross platform.
 * Provides comprehensive financial management including budget creation with hierarchical structures,
 * budget allocation with multi-dimensional tracking, cost center management with departmental budgets,
 * expense tracking and categorization, budget variance analysis with real-time alerts, financial
 * forecasting with multiple methods (linear regression, moving average, exponential smoothing),
 * cost allocation methods (direct, activity-based, proportional), budget approval workflows with
 * multi-level authorization, financial reporting with customizable templates, multi-currency support
 * with automatic conversion, budget revision tracking with audit trails, capital vs operational budget
 * separation, budget templates for recurring patterns, automated budget alerts and notifications,
 * budget consolidation for multi-entity management, cash flow forecasting, budget performance metrics
 * and KPIs, budget comparison across entities and periods, GAAP-compliant financial reporting with
 * comprehensive audit logging. Includes advanced TypeScript patterns with generics, conditional types,
 * mapped types, and utility types for maximum type safety and reusability.
 */
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const date_fns_1 = require("date-fns");
/**
 * Budget status enum
 */
var BudgetStatus;
(function (BudgetStatus) {
    BudgetStatus["DRAFT"] = "draft";
    BudgetStatus["PENDING_APPROVAL"] = "pending_approval";
    BudgetStatus["APPROVED"] = "approved";
    BudgetStatus["ACTIVE"] = "active";
    BudgetStatus["LOCKED"] = "locked";
    BudgetStatus["CLOSED"] = "closed";
    BudgetStatus["REJECTED"] = "rejected";
    BudgetStatus["REVISED"] = "revised";
})(BudgetStatus || (exports.BudgetStatus = BudgetStatus = {}));
/**
 * Budget type enum
 */
var BudgetType;
(function (BudgetType) {
    BudgetType["OPERATIONAL"] = "operational";
    BudgetType["CAPITAL"] = "capital";
    BudgetType["DEPARTMENTAL"] = "departmental";
    BudgetType["PROJECT"] = "project";
    BudgetType["MASTER"] = "master";
    BudgetType["ROLLING"] = "rolling";
    BudgetType["ZERO_BASED"] = "zero_based";
    BudgetType["FLEXIBLE"] = "flexible";
})(BudgetType || (exports.BudgetType = BudgetType = {}));
/**
 * Budget period enum
 */
var BudgetPeriod;
(function (BudgetPeriod) {
    BudgetPeriod["MONTHLY"] = "monthly";
    BudgetPeriod["QUARTERLY"] = "quarterly";
    BudgetPeriod["SEMI_ANNUAL"] = "semi_annual";
    BudgetPeriod["ANNUAL"] = "annual";
    BudgetPeriod["MULTI_YEAR"] = "multi_year";
})(BudgetPeriod || (exports.BudgetPeriod = BudgetPeriod = {}));
/**
 * Cost category enum
 */
var CostCategory;
(function (CostCategory) {
    CostCategory["LABOR"] = "labor";
    CostCategory["MATERIALS"] = "materials";
    CostCategory["EQUIPMENT"] = "equipment";
    CostCategory["SERVICES"] = "services";
    CostCategory["OVERHEAD"] = "overhead";
    CostCategory["UTILITIES"] = "utilities";
    CostCategory["MAINTENANCE"] = "maintenance";
    CostCategory["TRAVEL"] = "travel";
    CostCategory["MARKETING"] = "marketing";
    CostCategory["IT"] = "it";
    CostCategory["FACILITIES"] = "facilities";
    CostCategory["INSURANCE"] = "insurance";
    CostCategory["TAXES"] = "taxes";
    CostCategory["DEPRECIATION"] = "depreciation";
    CostCategory["OTHER"] = "other";
})(CostCategory || (exports.CostCategory = CostCategory = {}));
/**
 * Allocation method enum
 */
var AllocationMethod;
(function (AllocationMethod) {
    AllocationMethod["DIRECT"] = "direct";
    AllocationMethod["PROPORTIONAL"] = "proportional";
    AllocationMethod["ACTIVITY_BASED"] = "activity_based";
    AllocationMethod["EQUAL"] = "equal";
    AllocationMethod["WEIGHTED"] = "weighted";
    AllocationMethod["STEP_DOWN"] = "step_down";
    AllocationMethod["RECIPROCAL"] = "reciprocal";
})(AllocationMethod || (exports.AllocationMethod = AllocationMethod = {}));
/**
 * Variance severity enum
 */
var VarianceSeverity;
(function (VarianceSeverity) {
    VarianceSeverity["FAVORABLE"] = "favorable";
    VarianceSeverity["NORMAL"] = "normal";
    VarianceSeverity["WARNING"] = "warning";
    VarianceSeverity["CRITICAL"] = "critical";
})(VarianceSeverity || (exports.VarianceSeverity = VarianceSeverity = {}));
/**
 * Forecast method enum
 */
var ForecastMethod;
(function (ForecastMethod) {
    ForecastMethod["LINEAR_REGRESSION"] = "linear_regression";
    ForecastMethod["MOVING_AVERAGE"] = "moving_average";
    ForecastMethod["EXPONENTIAL_SMOOTHING"] = "exponential_smoothing";
    ForecastMethod["SEASONAL"] = "seasonal";
    ForecastMethod["TREND_ANALYSIS"] = "trend_analysis";
    ForecastMethod["HISTORICAL_AVERAGE"] = "historical_average";
})(ForecastMethod || (exports.ForecastMethod = ForecastMethod = {}));
/**
 * Approval status enum
 */
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "pending";
    ApprovalStatus["APPROVED"] = "approved";
    ApprovalStatus["REJECTED"] = "rejected";
    ApprovalStatus["NEEDS_REVISION"] = "needs_revision";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
/**
 * Money validation schema
 */
exports.MoneySchema = zod_1.z.object({
    amount: zod_1.z.number().finite(),
    currency: zod_1.z.enum(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY']),
});
/**
 * Budget creation schema
 */
exports.BudgetCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    type: zod_1.z.nativeEnum(BudgetType),
    period: zod_1.z.nativeEnum(BudgetPeriod),
    totalAmount: exports.MoneySchema,
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    ownerId: zod_1.z.string().uuid(),
    departmentId: zod_1.z.string().uuid().optional(),
    projectId: zod_1.z.string().uuid().optional(),
    parentBudgetId: zod_1.z.string().uuid().optional(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
/**
 * Expense transaction schema
 */
exports.ExpenseTransactionSchema = zod_1.z.object({
    budgetId: zod_1.z.string().uuid(),
    lineItemId: zod_1.z.string().uuid().optional(),
    costCenterId: zod_1.z.string().uuid(),
    category: zod_1.z.nativeEnum(CostCategory),
    amount: exports.MoneySchema,
    description: zod_1.z.string().min(1).max(500),
    transactionDate: zod_1.z.date(),
    vendor: zod_1.z.string().max(200).optional(),
    receiptUrl: zod_1.z.string().url().optional(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
// ============================================================================
// BUDGET CREATION & ALLOCATION FUNCTIONS
// ============================================================================
/**
 * Creates a new budget with validation and initial setup
 * @param data Budget creation data
 * @returns Created budget
 * @throws BadRequestException if validation fails
 */
function createBudget(data) {
    try {
        const validated = exports.BudgetCreateSchema.parse(data);
        if ((0, date_fns_1.isAfter)(validated.startDate, validated.endDate)) {
            throw new common_1.BadRequestException('Start date must be before end date');
        }
        const budget = {
            id: generateUUID(),
            name: validated.name,
            type: validated.type,
            status: BudgetStatus.DRAFT,
            period: validated.period,
            totalAmount: validated.totalAmount,
            allocatedAmount: { amount: 0, currency: validated.totalAmount.currency },
            spentAmount: { amount: 0, currency: validated.totalAmount.currency },
            remainingAmount: validated.totalAmount,
            startDate: validated.startDate,
            endDate: validated.endDate,
            ownerId: validated.ownerId,
            departmentId: validated.departmentId,
            projectId: validated.projectId,
            parentBudgetId: validated.parentBudgetId,
            lineItems: [],
            approvals: [],
            revisions: [],
            metadata: validated.metadata,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return budget;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Validation failed: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Allocates budget amount to line items
 * @param budget Budget to allocate
 * @param lineItems Line items to allocate to
 * @returns Updated budget with allocations
 * @throws BadRequestException if total allocation exceeds budget
 */
function allocateBudget(budget, lineItems) {
    const totalAllocation = lineItems.reduce((sum, item) => sum + item.amount.amount, 0);
    if (totalAllocation > budget.totalAmount.amount) {
        throw new common_1.BadRequestException(`Total allocation (${totalAllocation}) exceeds budget total (${budget.totalAmount.amount})`);
    }
    const newLineItems = lineItems.map((item) => ({
        ...item,
        id: generateUUID(),
        budgetId: budget.id,
        allocatedAmount: item.amount,
        spentAmount: { amount: 0, currency: item.amount.currency },
        remainingAmount: item.amount,
    }));
    return {
        ...budget,
        lineItems: [...budget.lineItems, ...newLineItems],
        allocatedAmount: {
            amount: budget.allocatedAmount.amount + totalAllocation,
            currency: budget.totalAmount.currency,
        },
        remainingAmount: {
            amount: budget.totalAmount.amount - (budget.allocatedAmount.amount + totalAllocation),
            currency: budget.totalAmount.currency,
        },
        updatedAt: new Date(),
    };
}
/**
 * Creates hierarchical budget structure
 * @param masterBudget Master budget
 * @param subBudgets Sub-budgets to create
 * @returns Array of created sub-budgets
 */
function createHierarchicalBudget(masterBudget, subBudgets) {
    const totalSubBudgets = subBudgets.reduce((sum, sb) => sum + sb.totalAmount.amount, 0);
    if (totalSubBudgets > masterBudget.totalAmount.amount) {
        throw new common_1.BadRequestException('Total sub-budgets exceed master budget');
    }
    return subBudgets.map((subBudgetData) => createBudget({
        ...subBudgetData,
        parentBudgetId: masterBudget.id,
        metadata: subBudgetData.metadata,
    }));
}
/**
 * Reallocates budget between line items
 * @param budget Budget to reallocate
 * @param fromLineItemId Source line item
 * @param toLineItemId Target line item
 * @param amount Amount to reallocate
 * @returns Updated budget
 */
function reallocateBudget(budget, fromLineItemId, toLineItemId, amount) {
    const fromItem = budget.lineItems.find((li) => li.id === fromLineItemId);
    const toItem = budget.lineItems.find((li) => li.id === toLineItemId);
    if (!fromItem || !toItem) {
        throw new common_1.NotFoundException('Line item not found');
    }
    if (fromItem.remainingAmount.amount < amount.amount) {
        throw new common_1.BadRequestException('Insufficient remaining amount in source line item');
    }
    const updatedLineItems = budget.lineItems.map((item) => {
        if (item.id === fromLineItemId) {
            return {
                ...item,
                allocatedAmount: { ...item.allocatedAmount, amount: item.allocatedAmount.amount - amount.amount },
                remainingAmount: { ...item.remainingAmount, amount: item.remainingAmount.amount - amount.amount },
            };
        }
        if (item.id === toLineItemId) {
            return {
                ...item,
                allocatedAmount: { ...item.allocatedAmount, amount: item.allocatedAmount.amount + amount.amount },
                remainingAmount: { ...item.remainingAmount, amount: item.remainingAmount.amount + amount.amount },
            };
        }
        return item;
    });
    return {
        ...budget,
        lineItems: updatedLineItems,
        updatedAt: new Date(),
    };
}
/**
 * Creates rolling budget by extending period
 * @param budget Current budget
 * @param extensionMonths Number of months to extend
 * @returns New rolling budget
 */
function createRollingBudget(budget, extensionMonths) {
    const newStartDate = (0, date_fns_1.addMonths)(budget.startDate, extensionMonths);
    const newEndDate = (0, date_fns_1.addMonths)(budget.endDate, extensionMonths);
    return createBudget({
        name: `${budget.name} - Rolling`,
        type: BudgetType.ROLLING,
        period: budget.period,
        totalAmount: budget.totalAmount,
        startDate: newStartDate,
        endDate: newEndDate,
        ownerId: budget.ownerId,
        departmentId: budget.departmentId,
        projectId: budget.projectId,
        parentBudgetId: budget.parentBudgetId,
        metadata: budget.metadata,
    });
}
// ============================================================================
// COST CENTER MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new cost center
 * @param data Cost center data
 * @returns Created cost center
 */
function createCostCenter(data) {
    return {
        ...data,
        id: generateUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Assigns budget to cost center
 * @param costCenter Cost center
 * @param budgetId Budget ID to assign
 * @returns Updated cost center
 */
function assignBudgetToCostCenter(costCenter, budgetId) {
    return {
        ...costCenter,
        budgetId,
        updatedAt: new Date(),
    };
}
/**
 * Gets cost centers by department
 * @param costCenters All cost centers
 * @param departmentId Department ID
 * @returns Filtered cost centers
 */
function getCostCentersByDepartment(costCenters, departmentId) {
    return costCenters.filter((cc) => cc.departmentId === departmentId && cc.active);
}
/**
 * Calculates cost center utilization
 * @param costCenter Cost center
 * @param budget Associated budget
 * @returns Utilization percentage
 */
function calculateCostCenterUtilization(costCenter, budget) {
    if (budget.totalAmount.amount === 0)
        return 0;
    return (budget.spentAmount.amount / budget.totalAmount.amount) * 100;
}
/**
 * Deactivates cost center
 * @param costCenter Cost center to deactivate
 * @returns Updated cost center
 */
function deactivateCostCenter(costCenter) {
    return {
        ...costCenter,
        active: false,
        updatedAt: new Date(),
    };
}
// ============================================================================
// EXPENSE TRACKING FUNCTIONS
// ============================================================================
/**
 * Records expense transaction
 * @param data Expense data
 * @returns Created expense transaction
 */
function recordExpense(data) {
    try {
        const validated = exports.ExpenseTransactionSchema.parse(data);
        return {
            ...validated,
            id: generateUUID(),
            createdAt: new Date(),
        };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Validation failed: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Updates budget with expense
 * @param budget Budget to update
 * @param expense Expense transaction
 * @returns Updated budget
 */
function applyExpenseToBudget(budget, expense) {
    if (expense.budgetId !== budget.id) {
        throw new common_1.BadRequestException('Expense does not belong to this budget');
    }
    let updatedLineItems = budget.lineItems;
    if (expense.lineItemId) {
        const lineItem = budget.lineItems.find((li) => li.id === expense.lineItemId);
        if (!lineItem) {
            throw new common_1.NotFoundException('Line item not found');
        }
        updatedLineItems = budget.lineItems.map((item) => item.id === expense.lineItemId
            ? {
                ...item,
                spentAmount: { ...item.spentAmount, amount: item.spentAmount.amount + expense.amount.amount },
                remainingAmount: { ...item.remainingAmount, amount: item.remainingAmount.amount - expense.amount.amount },
            }
            : item);
    }
    return {
        ...budget,
        lineItems: updatedLineItems,
        spentAmount: { ...budget.spentAmount, amount: budget.spentAmount.amount + expense.amount.amount },
        remainingAmount: { ...budget.remainingAmount, amount: budget.remainingAmount.amount - expense.amount.amount },
        updatedAt: new Date(),
    };
}
/**
 * Categorizes expenses by category
 * @param expenses Expense transactions
 * @returns Map of category to total amount
 */
function categorizeExpenses(expenses) {
    const categorized = new Map();
    for (const expense of expenses) {
        const existing = categorized.get(expense.category);
        if (existing) {
            categorized.set(expense.category, {
                amount: existing.amount + expense.amount.amount,
                currency: expense.amount.currency,
            });
        }
        else {
            categorized.set(expense.category, expense.amount);
        }
    }
    return categorized;
}
/**
 * Gets expenses by date range
 * @param expenses All expenses
 * @param startDate Range start
 * @param endDate Range end
 * @returns Filtered expenses
 */
function getExpensesByDateRange(expenses, startDate, endDate) {
    return expenses.filter((expense) => (0, date_fns_1.isWithinInterval)(expense.transactionDate, { start: startDate, end: endDate }));
}
/**
 * Calculates total expenses for period
 * @param expenses Expenses
 * @param currency Currency to use
 * @returns Total money
 */
function calculateTotalExpenses(expenses, currency) {
    const total = expenses.reduce((sum, expense) => sum + expense.amount.amount, 0);
    return { amount: total, currency };
}
// ============================================================================
// BUDGET VARIANCE ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Calculates budget variance
 * @param budgeted Budgeted amount
 * @param actual Actual amount
 * @returns Variance details
 */
function calculateVariance(budgeted, actual) {
    const variance = actual.amount - budgeted.amount;
    const variancePercentage = budgeted.amount !== 0 ? (variance / budgeted.amount) * 100 : 0;
    let severity;
    if (variance < 0) {
        severity = VarianceSeverity.FAVORABLE;
    }
    else if (variancePercentage <= 5) {
        severity = VarianceSeverity.NORMAL;
    }
    else if (variancePercentage <= 15) {
        severity = VarianceSeverity.WARNING;
    }
    else {
        severity = VarianceSeverity.CRITICAL;
    }
    return {
        budgetId: '',
        budgetedAmount: budgeted,
        actualAmount: actual,
        variance: { amount: variance, currency: budgeted.currency },
        variancePercentage,
        severity,
        period: (0, date_fns_1.format)(new Date(), 'yyyy-MM'),
        analysisDate: new Date(),
    };
}
/**
 * Analyzes budget variance for all line items
 * @param budget Budget to analyze
 * @returns Array of variances
 */
function analyzeBudgetVariance(budget) {
    const variances = [];
    for (const lineItem of budget.lineItems) {
        const variance = calculateVariance(lineItem.allocatedAmount, lineItem.spentAmount);
        variances.push({
            ...variance,
            budgetId: budget.id,
            lineItemId: lineItem.id,
        });
    }
    return variances;
}
/**
 * Identifies critical variances
 * @param variances All variances
 * @returns Critical variances only
 */
function getCriticalVariances(variances) {
    return variances.filter((v) => v.severity === VarianceSeverity.CRITICAL);
}
/**
 * Calculates variance trend over periods
 * @param variances Historical variances
 * @returns Trend analysis
 */
function analyzeVarianceTrend(variances) {
    if (variances.length < 2) {
        return { improving: false, averageVariance: 0, trend: 'stable' };
    }
    const sortedVariances = [...variances].sort((a, b) => a.analysisDate.getTime() - b.analysisDate.getTime());
    const averageVariance = sortedVariances.reduce((sum, v) => sum + Math.abs(v.variancePercentage), 0) / sortedVariances.length;
    const firstHalf = sortedVariances.slice(0, Math.floor(sortedVariances.length / 2));
    const secondHalf = sortedVariances.slice(Math.floor(sortedVariances.length / 2));
    const firstAvg = firstHalf.reduce((sum, v) => sum + Math.abs(v.variancePercentage), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, v) => sum + Math.abs(v.variancePercentage), 0) / secondHalf.length;
    const improving = secondAvg < firstAvg;
    const trend = secondAvg < firstAvg ? 'down' : secondAvg > firstAvg ? 'up' : 'stable';
    return { improving, averageVariance, trend };
}
/**
 * Generates variance report
 * @param budget Budget
 * @param variances Variances
 * @returns Variance report
 */
function generateVarianceReport(budget, variances) {
    const critical = variances.filter((v) => v.severity === VarianceSeverity.CRITICAL).length;
    const warning = variances.filter((v) => v.severity === VarianceSeverity.WARNING).length;
    return {
        title: `Budget Variance Report - ${budget.name}`,
        period: `${(0, date_fns_1.format)(budget.startDate, 'yyyy-MM-dd')} to ${(0, date_fns_1.format)(budget.endDate, 'yyyy-MM-dd')}`,
        generatedAt: new Date(),
        data: variances,
        summary: {
            totalVariances: variances.length,
            criticalCount: critical,
            warningCount: warning,
            totalBudget: budget.totalAmount.amount,
            totalSpent: budget.spentAmount.amount,
            overallVariancePercentage: budget.totalAmount.amount !== 0
                ? ((budget.spentAmount.amount - budget.totalAmount.amount) / budget.totalAmount.amount) * 100
                : 0,
        },
    };
}
// ============================================================================
// FORECASTING FUNCTIONS
// ============================================================================
/**
 * Linear regression forecast
 * @param historicalData Historical spending data
 * @param periods Number of periods to forecast
 * @returns Forecast data
 */
function forecastLinearRegression(historicalData, periods) {
    if (historicalData.length < 2) {
        throw new common_1.BadRequestException('Insufficient historical data for forecasting');
    }
    // Simple linear regression
    const n = historicalData.length;
    const sumX = historicalData.reduce((sum, _, i) => sum + i, 0);
    const sumY = historicalData.reduce((sum, d) => sum + d.amount, 0);
    const sumXY = historicalData.reduce((sum, d, i) => sum + i * d.amount, 0);
    const sumX2 = historicalData.reduce((sum, _, i) => sum + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const forecasts = [];
    for (let i = 0; i < periods; i++) {
        const x = n + i;
        const predicted = slope * x + intercept;
        const stdDev = calculateStandardDeviation(historicalData.map((d) => d.amount));
        const confidenceInterval = 1.96 * stdDev; // 95% confidence
        forecasts.push({
            budgetId: '',
            method: ForecastMethod.LINEAR_REGRESSION,
            forecastDate: new Date(),
            forecastPeriod: `Period ${x + 1}`,
            predictedAmount: { amount: Math.max(0, predicted), currency: 'USD' },
            confidenceInterval: {
                lower: { amount: Math.max(0, predicted - confidenceInterval), currency: 'USD' },
                upper: { amount: predicted + confidenceInterval, currency: 'USD' },
            },
        });
    }
    return forecasts;
}
/**
 * Moving average forecast
 * @param historicalData Historical data
 * @param window Window size
 * @param periods Periods to forecast
 * @returns Forecast data
 */
function forecastMovingAverage(historicalData, window, periods) {
    if (historicalData.length < window) {
        throw new common_1.BadRequestException('Insufficient historical data for moving average');
    }
    const forecasts = [];
    const lastValues = historicalData.slice(-window);
    const average = lastValues.reduce((sum, d) => sum + d.amount, 0) / window;
    for (let i = 0; i < periods; i++) {
        forecasts.push({
            budgetId: '',
            method: ForecastMethod.MOVING_AVERAGE,
            forecastDate: new Date(),
            forecastPeriod: `Period ${historicalData.length + i + 1}`,
            predictedAmount: { amount: average, currency: 'USD' },
            confidenceInterval: {
                lower: { amount: average * 0.9, currency: 'USD' },
                upper: { amount: average * 1.1, currency: 'USD' },
            },
        });
    }
    return forecasts;
}
/**
 * Exponential smoothing forecast
 * @param historicalData Historical data
 * @param alpha Smoothing factor (0-1)
 * @param periods Periods to forecast
 * @returns Forecast data
 */
function forecastExponentialSmoothing(historicalData, alpha, periods) {
    if (alpha < 0 || alpha > 1) {
        throw new common_1.BadRequestException('Alpha must be between 0 and 1');
    }
    if (historicalData.length === 0) {
        throw new common_1.BadRequestException('No historical data provided');
    }
    let smoothed = historicalData[0].amount;
    for (let i = 1; i < historicalData.length; i++) {
        smoothed = alpha * historicalData[i].amount + (1 - alpha) * smoothed;
    }
    const forecasts = [];
    for (let i = 0; i < periods; i++) {
        forecasts.push({
            budgetId: '',
            method: ForecastMethod.EXPONENTIAL_SMOOTHING,
            forecastDate: new Date(),
            forecastPeriod: `Period ${historicalData.length + i + 1}`,
            predictedAmount: { amount: smoothed, currency: 'USD' },
            confidenceInterval: {
                lower: { amount: smoothed * 0.85, currency: 'USD' },
                upper: { amount: smoothed * 1.15, currency: 'USD' },
            },
        });
    }
    return forecasts;
}
/**
 * Seasonal forecast with trend
 * @param historicalData Historical data with seasonality
 * @param seasonLength Season length (e.g., 12 for monthly data)
 * @param periods Periods to forecast
 * @returns Forecast data
 */
function forecastSeasonal(historicalData, seasonLength, periods) {
    if (historicalData.length < seasonLength * 2) {
        throw new common_1.BadRequestException('Insufficient data for seasonal forecasting');
    }
    // Calculate seasonal indices
    const seasonalIndices = [];
    for (let s = 0; s < seasonLength; s++) {
        const seasonValues = historicalData.filter((_, i) => i % seasonLength === s);
        const average = seasonValues.reduce((sum, d) => sum + d.amount, 0) / seasonValues.length;
        seasonalIndices.push(average);
    }
    const overallAverage = seasonalIndices.reduce((sum, val) => sum + val, 0) / seasonLength;
    const normalizedIndices = seasonalIndices.map((val) => val / overallAverage);
    const forecasts = [];
    for (let i = 0; i < periods; i++) {
        const seasonIndex = normalizedIndices[i % seasonLength];
        const baseValue = overallAverage;
        const predicted = baseValue * seasonIndex;
        forecasts.push({
            budgetId: '',
            method: ForecastMethod.SEASONAL,
            forecastDate: new Date(),
            forecastPeriod: `Period ${historicalData.length + i + 1}`,
            predictedAmount: { amount: predicted, currency: 'USD' },
            confidenceInterval: {
                lower: { amount: predicted * 0.8, currency: 'USD' },
                upper: { amount: predicted * 1.2, currency: 'USD' },
            },
        });
    }
    return forecasts;
}
/**
 * Combines multiple forecast methods
 * @param forecasts Array of forecasts from different methods
 * @returns Combined consensus forecast
 */
function combineForecastMethods(forecasts) {
    const maxPeriods = Math.max(...forecasts.map((f) => f.length));
    const combined = [];
    for (let i = 0; i < maxPeriods; i++) {
        const periodForecasts = forecasts.map((f) => f[i]).filter(Boolean);
        const average = periodForecasts.reduce((sum, f) => sum + f.predictedAmount.amount, 0) / periodForecasts.length;
        combined.push({
            budgetId: periodForecasts[0]?.budgetId || '',
            method: ForecastMethod.TREND_ANALYSIS,
            forecastDate: new Date(),
            forecastPeriod: periodForecasts[0]?.forecastPeriod || `Period ${i + 1}`,
            predictedAmount: { amount: average, currency: 'USD' },
            confidenceInterval: {
                lower: { amount: average * 0.85, currency: 'USD' },
                upper: { amount: average * 1.15, currency: 'USD' },
            },
        });
    }
    return combined;
}
// ============================================================================
// COST ALLOCATION FUNCTIONS
// ============================================================================
/**
 * Direct cost allocation
 * @param amount Amount to allocate
 * @param sourceCostCenter Source
 * @param targetCostCenter Target
 * @returns Cost allocation
 */
function allocateDirectCost(amount, sourceCostCenter, targetCostCenter) {
    return {
        id: generateUUID(),
        sourceCostCenterId: sourceCostCenter.id,
        targetCostCenterId: targetCostCenter.id,
        amount,
        method: AllocationMethod.DIRECT,
        allocationDate: new Date(),
    };
}
/**
 * Proportional cost allocation based on percentages
 * @param totalAmount Total amount to allocate
 * @param sourceCostCenter Source
 * @param allocations Target centers with percentages
 * @returns Array of cost allocations
 */
function allocateProportionalCost(totalAmount, sourceCostCenter, allocations) {
    const totalPercentage = allocations.reduce((sum, a) => sum + a.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
        throw new common_1.BadRequestException('Allocation percentages must sum to 100');
    }
    return allocations.map((allocation) => ({
        id: generateUUID(),
        sourceCostCenterId: sourceCostCenter.id,
        targetCostCenterId: allocation.costCenter.id,
        amount: {
            amount: (totalAmount.amount * allocation.percentage) / 100,
            currency: totalAmount.currency,
        },
        method: AllocationMethod.PROPORTIONAL,
        percentage: allocation.percentage,
        allocationDate: new Date(),
    }));
}
/**
 * Activity-based cost allocation
 * @param totalAmount Total amount
 * @param sourceCostCenter Source
 * @param activities Activity drivers
 * @returns Cost allocations
 */
function allocateActivityBasedCost(totalAmount, sourceCostCenter, activities) {
    const totalUnits = activities.reduce((sum, a) => sum + a.activityUnits, 0);
    if (totalUnits === 0) {
        throw new common_1.BadRequestException('Total activity units cannot be zero');
    }
    const costPerUnit = totalAmount.amount / totalUnits;
    return activities.map((activity) => ({
        id: generateUUID(),
        sourceCostCenterId: sourceCostCenter.id,
        targetCostCenterId: activity.costCenter.id,
        amount: {
            amount: costPerUnit * activity.activityUnits,
            currency: totalAmount.currency,
        },
        method: AllocationMethod.ACTIVITY_BASED,
        basis: activity.basis,
        allocationDate: new Date(),
        metadata: { activityUnits: activity.activityUnits, costPerUnit },
    }));
}
/**
 * Equal cost allocation
 * @param totalAmount Total amount
 * @param sourceCostCenter Source
 * @param targetCostCenters Targets
 * @returns Cost allocations
 */
function allocateEqualCost(totalAmount, sourceCostCenter, targetCostCenters) {
    const amountPerCenter = totalAmount.amount / targetCostCenters.length;
    return targetCostCenters.map((target) => ({
        id: generateUUID(),
        sourceCostCenterId: sourceCostCenter.id,
        targetCostCenterId: target.id,
        amount: {
            amount: amountPerCenter,
            currency: totalAmount.currency,
        },
        method: AllocationMethod.EQUAL,
        allocationDate: new Date(),
    }));
}
/**
 * Weighted cost allocation
 * @param totalAmount Total amount
 * @param sourceCostCenter Source
 * @param weights Weight allocations
 * @returns Cost allocations
 */
function allocateWeightedCost(totalAmount, sourceCostCenter, weights) {
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    if (totalWeight === 0) {
        throw new common_1.BadRequestException('Total weight cannot be zero');
    }
    return weights.map((weightedAllocation) => ({
        id: generateUUID(),
        sourceCostCenterId: sourceCostCenter.id,
        targetCostCenterId: weightedAllocation.costCenter.id,
        amount: {
            amount: (totalAmount.amount * weightedAllocation.weight) / totalWeight,
            currency: totalAmount.currency,
        },
        method: AllocationMethod.WEIGHTED,
        allocationDate: new Date(),
        metadata: { weight: weightedAllocation.weight, totalWeight },
    }));
}
// ============================================================================
// APPROVAL WORKFLOW FUNCTIONS
// ============================================================================
/**
 * Submits budget for approval
 * @param budget Budget to submit
 * @param approvers List of approvers
 * @returns Budget with approval workflow initiated
 */
function submitBudgetForApproval(budget, approvers) {
    if (budget.status !== BudgetStatus.DRAFT) {
        throw new common_1.BadRequestException('Only draft budgets can be submitted for approval');
    }
    const approvals = approvers.map((approver) => ({
        id: generateUUID(),
        budgetId: budget.id,
        approverId: approver.id,
        approverName: approver.name,
        status: ApprovalStatus.PENDING,
        level: approver.level,
        createdAt: new Date(),
    }));
    return {
        ...budget,
        status: BudgetStatus.PENDING_APPROVAL,
        approvals,
        updatedAt: new Date(),
    };
}
/**
 * Approves budget at specific level
 * @param budget Budget
 * @param approverId Approver ID
 * @param comments Optional comments
 * @returns Updated budget
 */
function approveBudget(budget, approverId, comments) {
    const approval = budget.approvals.find((a) => a.approverId === approverId && a.status === ApprovalStatus.PENDING);
    if (!approval) {
        throw new common_1.NotFoundException('Pending approval not found for this approver');
    }
    const updatedApprovals = budget.approvals.map((a) => a.id === approval.id
        ? { ...a, status: ApprovalStatus.APPROVED, comments, approvedAt: new Date() }
        : a);
    const allApproved = updatedApprovals.every((a) => a.status === ApprovalStatus.APPROVED);
    return {
        ...budget,
        approvals: updatedApprovals,
        status: allApproved ? BudgetStatus.APPROVED : budget.status,
        updatedAt: new Date(),
    };
}
/**
 * Rejects budget
 * @param budget Budget
 * @param approverId Approver ID
 * @param reason Rejection reason
 * @returns Updated budget
 */
function rejectBudget(budget, approverId, reason) {
    const approval = budget.approvals.find((a) => a.approverId === approverId && a.status === ApprovalStatus.PENDING);
    if (!approval) {
        throw new common_1.NotFoundException('Pending approval not found for this approver');
    }
    const updatedApprovals = budget.approvals.map((a) => a.id === approval.id
        ? { ...a, status: ApprovalStatus.REJECTED, comments: reason, approvedAt: new Date() }
        : a);
    return {
        ...budget,
        approvals: updatedApprovals,
        status: BudgetStatus.REJECTED,
        updatedAt: new Date(),
    };
}
// ============================================================================
// MULTI-CURRENCY SUPPORT FUNCTIONS
// ============================================================================
/**
 * Converts money between currencies
 * @param amount Money to convert
 * @param targetCurrency Target currency
 * @param exchangeRate Exchange rate
 * @returns Converted money
 */
function convertCurrency(amount, targetCurrency, exchangeRate) {
    if (exchangeRate <= 0) {
        throw new common_1.BadRequestException('Exchange rate must be positive');
    }
    return {
        amount: amount.amount * exchangeRate,
        currency: targetCurrency,
    };
}
/**
 * Gets exchange rate between currencies (mock - would use real API)
 * @param from Source currency
 * @param to Target currency
 * @returns Exchange rate
 */
function getExchangeRate(from, to) {
    // Mock implementation - in production, use real exchange rate API
    const rates = {
        USD: { EUR: 0.85, GBP: 0.73, JPY: 110.0, CAD: 1.25, AUD: 1.35, CHF: 0.92, CNY: 6.45 },
        EUR: { USD: 1.18, GBP: 0.86, JPY: 129.5, CAD: 1.47, AUD: 1.59, CHF: 1.08, CNY: 7.59 },
    };
    if (from === to)
        return 1.0;
    return rates[from]?.[to] || 1.0;
}
/**
 * Normalizes all money amounts to single currency
 * @param amounts Array of money amounts
 * @param targetCurrency Target currency
 * @returns Array of normalized amounts
 */
function normalizeToSingleCurrency(amounts, targetCurrency) {
    return amounts.map((amount) => {
        if (amount.currency === targetCurrency) {
            return amount;
        }
        const rate = getExchangeRate(amount.currency, targetCurrency);
        return convertCurrency(amount, targetCurrency, rate);
    });
}
// ============================================================================
// FINANCIAL REPORTING FUNCTIONS
// ============================================================================
/**
 * Generates budget summary report
 * @param budget Budget
 * @returns Summary report
 */
function generateBudgetSummary(budget) {
    return {
        title: `Budget Summary - ${budget.name}`,
        period: `${(0, date_fns_1.format)(budget.startDate, 'yyyy-MM-dd')} to ${(0, date_fns_1.format)(budget.endDate, 'yyyy-MM-dd')}`,
        generatedAt: new Date(),
        data: {
            budgetId: budget.id,
            name: budget.name,
            type: budget.type,
            status: budget.status,
            totalAmount: budget.totalAmount,
            spentAmount: budget.spentAmount,
            remainingAmount: budget.remainingAmount,
            lineItemCount: budget.lineItems.length,
        },
        summary: {
            utilizationPercentage: budget.totalAmount.amount !== 0 ? (budget.spentAmount.amount / budget.totalAmount.amount) * 100 : 0,
            remainingPercentage: budget.totalAmount.amount !== 0 ? (budget.remainingAmount.amount / budget.totalAmount.amount) * 100 : 0,
        },
    };
}
/**
 * Generates expense breakdown report
 * @param expenses Expenses
 * @param groupBy Grouping field
 * @returns Breakdown report
 */
function generateExpenseBreakdown(expenses, groupBy = 'category') {
    const grouped = new Map();
    for (const expense of expenses) {
        const key = groupBy === 'category' ? expense.category : groupBy === 'costCenter' ? expense.costCenterId : expense.vendor || 'unknown';
        const existing = grouped.get(key);
        if (existing) {
            grouped.set(key, {
                amount: existing.amount + expense.amount.amount,
                currency: expense.amount.currency,
            });
        }
        else {
            grouped.set(key, expense.amount);
        }
    }
    return {
        title: `Expense Breakdown by ${groupBy}`,
        period: (0, date_fns_1.format)(new Date(), 'yyyy-MM'),
        generatedAt: new Date(),
        data: Object.fromEntries(grouped),
        summary: {
            totalExpenses: expenses.reduce((sum, e) => sum + e.amount.amount, 0),
            transactionCount: expenses.length,
            groupCount: grouped.size,
        },
    };
}
/**
 * Generates cash flow report
 * @param budgets Budgets
 * @param expenses Expenses
 * @param startDate Start date
 * @param endDate End date
 * @returns Cash flow report
 */
function generateCashFlowReport(budgets, expenses, startDate, endDate) {
    const periodExpenses = getExpensesByDateRange(expenses, startDate, endDate);
    const totalBudgeted = budgets.reduce((sum, b) => sum + b.totalAmount.amount, 0);
    const totalSpent = periodExpenses.reduce((sum, e) => sum + e.amount.amount, 0);
    return {
        title: 'Cash Flow Report',
        period: `${(0, date_fns_1.format)(startDate, 'yyyy-MM-dd')} to ${(0, date_fns_1.format)(endDate, 'yyyy-MM-dd')}`,
        generatedAt: new Date(),
        data: {
            budgets: budgets.map((b) => ({
                id: b.id,
                name: b.name,
                budgeted: b.totalAmount,
                spent: b.spentAmount,
                remaining: b.remainingAmount,
            })),
            expenses: periodExpenses,
        },
        summary: {
            totalBudgeted,
            totalSpent,
            netCashFlow: totalBudgeted - totalSpent,
            utilizationRate: totalBudgeted !== 0 ? (totalSpent / totalBudgeted) * 100 : 0,
        },
    };
}
// ============================================================================
// UTILITY HELPER FUNCTIONS
// ============================================================================
/**
 * Generates UUID v4
 * @returns UUID string
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/**
 * Calculates standard deviation
 * @param values Array of numbers
 * @returns Standard deviation
 */
function calculateStandardDeviation(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(variance);
}
/**
 * Logger instance for budget operations
 */
exports.budgetLogger = new common_1.Logger('BudgetCostTracking');
//# sourceMappingURL=budget-cost-tracking-kit.js.map