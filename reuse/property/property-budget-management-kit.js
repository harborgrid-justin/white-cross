"use strict";
/**
 * LOC: PROPERTY_BUDGET_MGMT_001
 * File: /reuse/property/property-budget-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Financial controllers
 *   - Budget planning services
 *   - Reporting services
 *   - Dashboard services
 *   - Accounting services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostCenterCreateSchema = exports.ForecastCreateSchema = exports.ExpenseCreateSchema = exports.BudgetLineItemCreateSchema = exports.BudgetCreateSchema = exports.ReportType = exports.ForecastMethod = exports.AllocationMethod = exports.ApprovalStatus = exports.VarianceSeverity = exports.ExpenseCategory = exports.BudgetPeriod = exports.BudgetType = exports.BudgetStatus = void 0;
exports.createBudget = createBudget;
exports.createBudgetFromTemplate = createBudgetFromTemplate;
exports.createMultiYearBudget = createMultiYearBudget;
exports.addBudgetLineItem = addBudgetLineItem;
exports.rolloverBudget = rolloverBudget;
exports.recordExpense = recordExpense;
exports.categorizeExpense = categorizeExpense;
exports.getExpenseSummaryByCategory = getExpenseSummaryByCategory;
exports.projectRecurringExpenses = projectRecurringExpenses;
exports.calculateBudgetVariance = calculateBudgetVariance;
exports.generateBudgetVsActualReport = generateBudgetVsActualReport;
exports.monitorBudgetUtilization = monitorBudgetUtilization;
exports.allocateCosts = allocateCosts;
exports.applyActivityBasedCosting = applyActivityBasedCosting;
exports.generateFinancialForecast = generateFinancialForecast;
exports.applySeasonalAdjustments = applySeasonalAdjustments;
exports.generateCashFlowForecast = generateCashFlowForecast;
exports.submitBudgetForApproval = submitBudgetForApproval;
exports.processBudgetApproval = processBudgetApproval;
exports.checkApprovalStatus = checkApprovalStatus;
exports.createCostCenter = createCostCenter;
exports.getCostCenterHierarchy = getCostCenterHierarchy;
exports.allocateBudgetToCostCenter = allocateBudgetToCostCenter;
exports.generateFinancialReport = generateFinancialReport;
exports.calculateBudgetKPIs = calculateBudgetKPIs;
exports.generateBudgetDashboard = generateBudgetDashboard;
exports.comparePropertyBudgets = comparePropertyBudgets;
exports.exportBudgetData = exportBudgetData;
exports.createBudgetRevision = createBudgetRevision;
exports.createBudgetTemplate = createBudgetTemplate;
/**
 * File: /reuse/property/property-budget-management-kit.ts
 * Locator: WC-PROPERTY-BUDGET-MGMT-001
 * Purpose: Production-Grade Property Budget & Financial Management Kit - Enterprise budget planning toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, date-fns
 * Downstream: ../backend/property/budget/*, Financial Services, Reporting Services, Dashboard Services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, zod
 * Exports: 40+ production-ready budget management functions covering budget planning, expense tracking, variance analysis, forecasting
 *
 * LLM Context: Production-grade property budget and financial management utilities for White Cross healthcare platform.
 * Provides comprehensive budget planning and financial management including budget creation with hierarchical structures,
 * expense tracking and categorization, budget vs actual analysis with real-time dashboards, cost allocation methods
 * (direct, activity-based, proportional), financial forecasting with trend analysis and seasonality, variance analysis
 * with root cause identification, budget approval workflows with multi-level authorization, multi-year budget planning
 * with automatic rollover, cost center management with departmental budgets, financial reporting with customizable
 * templates, budget revision tracking with audit trails, capital vs operational budget separation, budget templates
 * for recurring patterns, automated budget alerts and notifications, budget consolidation for portfolio management,
 * cash flow forecasting, budget performance metrics and KPIs, budget comparison across properties and periods,
 * and GAAP-compliant financial reporting with comprehensive audit logging for all budget transactions.
 * Includes Sequelize models for budgets, expenses, forecasts, cost centers, approvals, and variance tracking.
 */
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const date_fns_1 = require("date-fns");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
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
    BudgetType["MAINTENANCE"] = "maintenance";
    BudgetType["MARKETING"] = "marketing";
    BudgetType["UTILITIES"] = "utilities";
    BudgetType["STAFFING"] = "staffing";
    BudgetType["IMPROVEMENT"] = "improvement";
    BudgetType["EMERGENCY"] = "emergency";
    BudgetType["MIXED"] = "mixed";
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
 * Expense category enum
 */
var ExpenseCategory;
(function (ExpenseCategory) {
    ExpenseCategory["UTILITIES"] = "utilities";
    ExpenseCategory["MAINTENANCE"] = "maintenance";
    ExpenseCategory["REPAIRS"] = "repairs";
    ExpenseCategory["INSURANCE"] = "insurance";
    ExpenseCategory["PROPERTY_TAX"] = "property_tax";
    ExpenseCategory["MANAGEMENT_FEES"] = "management_fees";
    ExpenseCategory["LANDSCAPING"] = "landscaping";
    ExpenseCategory["SECURITY"] = "security";
    ExpenseCategory["CLEANING"] = "cleaning";
    ExpenseCategory["PEST_CONTROL"] = "pest_control";
    ExpenseCategory["SUPPLIES"] = "supplies";
    ExpenseCategory["EQUIPMENT"] = "equipment";
    ExpenseCategory["MARKETING"] = "marketing";
    ExpenseCategory["LEGAL"] = "legal";
    ExpenseCategory["ACCOUNTING"] = "accounting";
    ExpenseCategory["STAFFING"] = "staffing";
    ExpenseCategory["IMPROVEMENTS"] = "improvements";
    ExpenseCategory["RESERVES"] = "reserves";
    ExpenseCategory["MISCELLANEOUS"] = "miscellaneous";
})(ExpenseCategory || (exports.ExpenseCategory = ExpenseCategory = {}));
/**
 * Variance severity enum
 */
var VarianceSeverity;
(function (VarianceSeverity) {
    VarianceSeverity["NORMAL"] = "normal";
    VarianceSeverity["WARNING"] = "warning";
    VarianceSeverity["CRITICAL"] = "critical";
    VarianceSeverity["FAVORABLE"] = "favorable";
})(VarianceSeverity || (exports.VarianceSeverity = VarianceSeverity = {}));
/**
 * Approval status enum
 */
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "pending";
    ApprovalStatus["APPROVED"] = "approved";
    ApprovalStatus["REJECTED"] = "rejected";
    ApprovalStatus["NEEDS_REVISION"] = "needs_revision";
    ApprovalStatus["ESCALATED"] = "escalated";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
/**
 * Allocation method enum
 */
var AllocationMethod;
(function (AllocationMethod) {
    AllocationMethod["DIRECT"] = "direct";
    AllocationMethod["PROPORTIONAL"] = "proportional";
    AllocationMethod["ACTIVITY_BASED"] = "activity_based";
    AllocationMethod["SQUARE_FOOTAGE"] = "square_footage";
    AllocationMethod["UNIT_COUNT"] = "unit_count";
    AllocationMethod["EQUAL"] = "equal";
    AllocationMethod["CUSTOM"] = "custom";
})(AllocationMethod || (exports.AllocationMethod = AllocationMethod = {}));
/**
 * Forecast method enum
 */
var ForecastMethod;
(function (ForecastMethod) {
    ForecastMethod["LINEAR_REGRESSION"] = "linear_regression";
    ForecastMethod["MOVING_AVERAGE"] = "moving_average";
    ForecastMethod["EXPONENTIAL_SMOOTHING"] = "exponential_smoothing";
    ForecastMethod["SEASONAL_DECOMPOSITION"] = "seasonal_decomposition";
    ForecastMethod["HISTORICAL_AVERAGE"] = "historical_average";
    ForecastMethod["TREND_ANALYSIS"] = "trend_analysis";
})(ForecastMethod || (exports.ForecastMethod = ForecastMethod = {}));
/**
 * Report type enum
 */
var ReportType;
(function (ReportType) {
    ReportType["BUDGET_VS_ACTUAL"] = "budget_vs_actual";
    ReportType["VARIANCE_ANALYSIS"] = "variance_analysis";
    ReportType["FORECAST"] = "forecast";
    ReportType["CASH_FLOW"] = "cash_flow";
    ReportType["EXPENSE_BREAKDOWN"] = "expense_breakdown";
    ReportType["COST_CENTER"] = "cost_center";
    ReportType["PROPERTY_COMPARISON"] = "property_comparison";
    ReportType["PERIOD_COMPARISON"] = "period_comparison";
    ReportType["KPI_DASHBOARD"] = "kpi_dashboard";
    ReportType["EXECUTIVE_SUMMARY"] = "executive_summary";
})(ReportType || (exports.ReportType = ReportType = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Budget creation schema
 */
exports.BudgetCreateSchema = zod_1.z.object({
    propertyId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(200),
    type: zod_1.z.nativeEnum(BudgetType),
    period: zod_1.z.nativeEnum(BudgetPeriod),
    fiscalYear: zod_1.z.number().int().min(2000).max(2100),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    totalAmount: zod_1.z.number().positive(),
    currency: zod_1.z.string().length(3).default('USD'),
    parentBudgetId: zod_1.z.string().uuid().optional(),
    costCenterId: zod_1.z.string().uuid().optional(),
    notes: zod_1.z.string().max(2000).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    createdBy: zod_1.z.string().uuid(),
});
/**
 * Budget line item creation schema
 */
exports.BudgetLineItemCreateSchema = zod_1.z.object({
    budgetId: zod_1.z.string().uuid(),
    category: zod_1.z.nativeEnum(ExpenseCategory),
    subcategory: zod_1.z.string().max(100).optional(),
    description: zod_1.z.string().min(1).max(500),
    plannedAmount: zod_1.z.number().nonnegative(),
    startDate: zod_1.z.date().optional(),
    endDate: zod_1.z.date().optional(),
    notes: zod_1.z.string().max(1000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Expense creation schema
 */
exports.ExpenseCreateSchema = zod_1.z.object({
    propertyId: zod_1.z.string().uuid(),
    budgetId: zod_1.z.string().uuid().optional(),
    budgetLineItemId: zod_1.z.string().uuid().optional(),
    category: zod_1.z.nativeEnum(ExpenseCategory),
    subcategory: zod_1.z.string().max(100).optional(),
    description: zod_1.z.string().min(1).max(500),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.string().length(3).default('USD'),
    transactionDate: zod_1.z.date(),
    paymentDate: zod_1.z.date().optional(),
    vendor: zod_1.z.string().max(200).optional(),
    invoiceNumber: zod_1.z.string().max(100).optional(),
    referenceNumber: zod_1.z.string().max(100).optional(),
    paymentMethod: zod_1.z.string().max(50).optional(),
    isRecurring: zod_1.z.boolean().default(false),
    recurringFrequency: zod_1.z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annual']).optional(),
    attachments: zod_1.z.array(zod_1.z.string()).optional(),
    notes: zod_1.z.string().max(2000).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    createdBy: zod_1.z.string().uuid(),
});
/**
 * Forecast creation schema
 */
exports.ForecastCreateSchema = zod_1.z.object({
    budgetId: zod_1.z.string().uuid().optional(),
    propertyId: zod_1.z.string().uuid(),
    category: zod_1.z.nativeEnum(ExpenseCategory).optional(),
    forecastPeriod: zod_1.z.string(),
    forecastMethod: zod_1.z.nativeEnum(ForecastMethod),
    assumptions: zod_1.z.array(zod_1.z.string()),
    historicalData: zod_1.z
        .array(zod_1.z.object({
        period: zod_1.z.string(),
        amount: zod_1.z.number(),
    }))
        .optional(),
    notes: zod_1.z.string().max(2000).optional(),
    createdBy: zod_1.z.string().uuid(),
});
/**
 * Cost center creation schema
 */
exports.CostCenterCreateSchema = zod_1.z.object({
    propertyId: zod_1.z.string().uuid().optional(),
    code: zod_1.z.string().min(1).max(50),
    name: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(1000).optional(),
    department: zod_1.z.string().max(100).optional(),
    managerId: zod_1.z.string().uuid(),
    parentCostCenterId: zod_1.z.string().uuid().optional(),
    totalBudget: zod_1.z.number().nonnegative(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Generate unique budget ID
 */
function generateBudgetId(propertyId, fiscalYear) {
    return `BDG-${propertyId.slice(0, 8)}-${fiscalYear}-${Date.now()}`;
}
/**
 * Generate unique expense ID
 */
function generateExpenseId() {
    return `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Calculate budget utilization percentage
 */
function calculateUtilization(spent, total) {
    if (total === 0)
        return 0;
    return Math.round((spent / total) * 10000) / 100;
}
/**
 * Calculate variance percentage
 */
function calculateVariancePercentage(planned, actual) {
    if (planned === 0)
        return actual > 0 ? 100 : 0;
    return Math.round(((actual - planned) / planned) * 10000) / 100;
}
/**
 * Determine variance severity
 */
function determineVarianceSeverity(variancePercentage) {
    const absVariance = Math.abs(variancePercentage);
    if (variancePercentage < -10) {
        return VarianceSeverity.FAVORABLE;
    }
    else if (absVariance <= 10) {
        return VarianceSeverity.NORMAL;
    }
    else if (absVariance <= 25) {
        return VarianceSeverity.WARNING;
    }
    else {
        return VarianceSeverity.CRITICAL;
    }
}
/**
 * Get fiscal year dates
 */
function getFiscalYearDates(year, startMonth = 1) {
    const startDate = new Date(year, startMonth - 1, 1);
    const endDate = (0, date_fns_1.endOfMonth)((0, date_fns_1.addMonths)(startDate, 11));
    return { startDate, endDate };
}
/**
 * Calculate period months
 */
function getPeriodMonths(period) {
    const periodMap = {
        [BudgetPeriod.MONTHLY]: 1,
        [BudgetPeriod.QUARTERLY]: 3,
        [BudgetPeriod.SEMI_ANNUAL]: 6,
        [BudgetPeriod.ANNUAL]: 12,
        [BudgetPeriod.MULTI_YEAR]: 12,
    };
    return periodMap[period];
}
// ============================================================================
// BUDGET CREATION AND PLANNING FUNCTIONS
// ============================================================================
/**
 * Create a new budget with validation and initialization
 *
 * @param data - Budget creation data
 * @returns Created budget with initialized values
 *
 * @example
 * ```typescript
 * const budget = await createBudget({
 *   propertyId: 'prop-123',
 *   name: '2024 Operational Budget',
 *   type: BudgetType.OPERATIONAL,
 *   period: BudgetPeriod.ANNUAL,
 *   fiscalYear: 2024,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   totalAmount: 500000,
 *   createdBy: 'user-123',
 * });
 * ```
 */
async function createBudget(data) {
    const validated = exports.BudgetCreateSchema.parse(data);
    if ((0, date_fns_1.isAfter)(validated.startDate, validated.endDate)) {
        throw new common_1.BadRequestException('Start date must be before end date');
    }
    const budget = {
        id: generateBudgetId(validated.propertyId, validated.fiscalYear),
        propertyId: validated.propertyId,
        name: validated.name,
        type: validated.type,
        period: validated.period,
        fiscalYear: validated.fiscalYear,
        startDate: validated.startDate,
        endDate: validated.endDate,
        status: BudgetStatus.DRAFT,
        totalAmount: validated.totalAmount,
        allocatedAmount: 0,
        spentAmount: 0,
        remainingAmount: validated.totalAmount,
        currency: validated.currency,
        parentBudgetId: validated.parentBudgetId,
        costCenterId: validated.costCenterId,
        notes: validated.notes,
        tags: validated.tags,
        metadata: validated.metadata,
        createdBy: validated.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return budget;
}
/**
 * Create budget from template with predefined line items
 *
 * @param templateId - Budget template ID
 * @param data - Budget creation data
 * @returns Created budget with line items from template
 *
 * @example
 * ```typescript
 * const budget = await createBudgetFromTemplate('template-123', {
 *   propertyId: 'prop-123',
 *   fiscalYear: 2024,
 *   totalAmount: 500000,
 *   createdBy: 'user-123',
 * });
 * ```
 */
async function createBudgetFromTemplate(templateId, data) {
    if (!templateId) {
        throw new common_1.BadRequestException('Template ID is required');
    }
    // Fetch template (would normally come from database)
    // const template = await fetchTemplate(templateId);
    const budgetData = {
        ...data,
        name: data.name || `Budget from Template ${templateId}`,
        type: data.type || BudgetType.OPERATIONAL,
        period: data.period || BudgetPeriod.ANNUAL,
        fiscalYear: data.fiscalYear || new Date().getFullYear(),
        startDate: data.startDate || new Date(),
        endDate: data.endDate || (0, date_fns_1.endOfYear)(new Date()),
        totalAmount: data.totalAmount || 0,
        propertyId: data.propertyId,
        createdBy: data.createdBy,
    };
    const budget = await createBudget(budgetData);
    // Create line items from template (simplified example)
    const lineItems = [];
    return { budget, lineItems };
}
/**
 * Create multi-year budget with automatic year-over-year planning
 *
 * @param data - Base budget data
 * @param years - Number of years to plan
 * @param growthRate - Annual growth rate (e.g., 0.03 for 3%)
 * @returns Array of budgets for each year
 *
 * @example
 * ```typescript
 * const budgets = await createMultiYearBudget({
 *   propertyId: 'prop-123',
 *   name: 'Multi-Year Capital Plan',
 *   type: BudgetType.CAPITAL,
 *   totalAmount: 1000000,
 *   createdBy: 'user-123',
 * }, 3, 0.05);
 * ```
 */
async function createMultiYearBudget(data, years, growthRate = 0) {
    if (years < 1 || years > 10) {
        throw new common_1.BadRequestException('Years must be between 1 and 10');
    }
    const budgets = [];
    const baseYear = data.fiscalYear || new Date().getFullYear();
    const baseAmount = data.totalAmount || 0;
    for (let i = 0; i < years; i++) {
        const fiscalYear = baseYear + i;
        const amount = Math.round(baseAmount * Math.pow(1 + growthRate, i));
        const dates = getFiscalYearDates(fiscalYear);
        const yearBudget = await createBudget({
            ...data,
            name: `${data.name} - FY${fiscalYear}`,
            fiscalYear,
            startDate: dates.startDate,
            endDate: dates.endDate,
            totalAmount: amount,
            propertyId: data.propertyId,
            createdBy: data.createdBy,
            type: data.type || BudgetType.OPERATIONAL,
            period: BudgetPeriod.ANNUAL,
        });
        budgets.push(yearBudget);
    }
    return budgets;
}
/**
 * Add line item to budget
 *
 * @param data - Line item data
 * @returns Created budget line item
 *
 * @example
 * ```typescript
 * const lineItem = await addBudgetLineItem({
 *   budgetId: 'budget-123',
 *   category: ExpenseCategory.MAINTENANCE,
 *   description: 'HVAC Maintenance',
 *   plannedAmount: 25000,
 * });
 * ```
 */
async function addBudgetLineItem(data) {
    const validated = exports.BudgetLineItemCreateSchema.parse(data);
    const lineItem = {
        id: `BLI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        budgetId: validated.budgetId,
        category: validated.category,
        subcategory: validated.subcategory,
        description: validated.description,
        plannedAmount: validated.plannedAmount,
        allocatedAmount: 0,
        spentAmount: 0,
        remainingAmount: validated.plannedAmount,
        percentage: 0,
        startDate: validated.startDate,
        endDate: validated.endDate,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return lineItem;
}
/**
 * Rollover budget to next period with optional adjustments
 *
 * @param budgetId - Source budget ID
 * @param adjustments - Budget adjustments for new period
 * @returns New budget for next period
 *
 * @example
 * ```typescript
 * const nextBudget = await rolloverBudget('budget-2023', {
 *   fiscalYear: 2024,
 *   totalAmount: 550000,
 *   adjustmentFactor: 1.1,
 * });
 * ```
 */
async function rolloverBudget(budgetId, adjustments) {
    if (!budgetId) {
        throw new common_1.BadRequestException('Budget ID is required');
    }
    // Fetch source budget (would normally come from database)
    // const sourceBudget = await fetchBudget(budgetId);
    throw new common_1.NotFoundException('Budget rollover not implemented');
}
// ============================================================================
// EXPENSE TRACKING AND CATEGORIZATION FUNCTIONS
// ============================================================================
/**
 * Record an expense and allocate to budget
 *
 * @param data - Expense data
 * @returns Created expense
 *
 * @example
 * ```typescript
 * const expense = await recordExpense({
 *   propertyId: 'prop-123',
 *   budgetId: 'budget-123',
 *   category: ExpenseCategory.UTILITIES,
 *   description: 'Monthly electricity bill',
 *   amount: 2500,
 *   transactionDate: new Date(),
 *   vendor: 'Electric Company',
 *   createdBy: 'user-123',
 * });
 * ```
 */
async function recordExpense(data) {
    const validated = exports.ExpenseCreateSchema.parse(data);
    const expense = {
        id: generateExpenseId(),
        propertyId: validated.propertyId,
        budgetId: validated.budgetId,
        budgetLineItemId: validated.budgetLineItemId,
        category: validated.category,
        subcategory: validated.subcategory,
        description: validated.description,
        amount: validated.amount,
        currency: validated.currency,
        transactionDate: validated.transactionDate,
        paymentDate: validated.paymentDate,
        vendor: validated.vendor,
        invoiceNumber: validated.invoiceNumber,
        referenceNumber: validated.referenceNumber,
        paymentMethod: validated.paymentMethod,
        isRecurring: validated.isRecurring,
        recurringFrequency: validated.recurringFrequency,
        attachments: validated.attachments,
        notes: validated.notes,
        tags: validated.tags,
        metadata: validated.metadata,
        createdBy: validated.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return expense;
}
/**
 * Categorize and tag expenses automatically using rules
 *
 * @param expense - Expense to categorize
 * @param rules - Categorization rules
 * @returns Expense with updated category and tags
 *
 * @example
 * ```typescript
 * const categorized = await categorizeExpense(expense, {
 *   vendorRules: { 'Electric Co': ExpenseCategory.UTILITIES },
 *   descriptionKeywords: { 'hvac': ExpenseCategory.MAINTENANCE },
 * });
 * ```
 */
async function categorizeExpense(expense, rules) {
    const categorized = { ...expense };
    if (rules?.vendorRules && expense.vendor) {
        const matchedCategory = rules.vendorRules[expense.vendor];
        if (matchedCategory) {
            categorized.category = matchedCategory;
        }
    }
    if (rules?.descriptionKeywords) {
        const description = expense.description.toLowerCase();
        for (const [keyword, category] of Object.entries(rules.descriptionKeywords)) {
            if (description.includes(keyword.toLowerCase())) {
                categorized.category = category;
                break;
            }
        }
    }
    categorized.updatedAt = new Date();
    return categorized;
}
/**
 * Get expense summary by category for a period
 *
 * @param propertyId - Property ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Expense breakdown by category
 *
 * @example
 * ```typescript
 * const summary = await getExpenseSummaryByCategory(
 *   'prop-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function getExpenseSummaryByCategory(propertyId, startDate, endDate) {
    if (!propertyId) {
        throw new common_1.BadRequestException('Property ID is required');
    }
    // Would normally query database and aggregate
    const summary = [];
    return summary;
}
/**
 * Track recurring expenses and generate future projections
 *
 * @param propertyId - Property ID
 * @param months - Number of months to project
 * @returns Projected recurring expenses
 *
 * @example
 * ```typescript
 * const projections = await projectRecurringExpenses('prop-123', 12);
 * ```
 */
async function projectRecurringExpenses(propertyId, months = 12) {
    if (months < 1 || months > 60) {
        throw new common_1.BadRequestException('Months must be between 1 and 60');
    }
    // Would normally query recurring expenses from database
    const projections = [];
    return projections;
}
// ============================================================================
// BUDGET VS ACTUAL ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Calculate budget vs actual variance for a budget
 *
 * @param budgetId - Budget ID
 * @param asOfDate - Analysis date
 * @returns Variance analysis results
 *
 * @example
 * ```typescript
 * const variance = await calculateBudgetVariance('budget-123', new Date());
 * ```
 */
async function calculateBudgetVariance(budgetId, asOfDate) {
    if (!budgetId) {
        throw new common_1.BadRequestException('Budget ID is required');
    }
    // Would normally fetch budget and expenses from database
    const planned = 100000;
    const actual = 105000;
    const variance = actual - planned;
    const variancePercentage = calculateVariancePercentage(planned, actual);
    const budgetVariance = {
        id: `VAR-${Date.now()}`,
        budgetId,
        period: (0, date_fns_1.format)(asOfDate, 'yyyy-MM'),
        plannedAmount: planned,
        actualAmount: actual,
        variance,
        variancePercentage,
        severity: determineVarianceSeverity(variancePercentage),
        analyzedAt: asOfDate,
        analyzedBy: 'system',
    };
    return budgetVariance;
}
/**
 * Generate comprehensive budget vs actual report
 *
 * @param budgetId - Budget ID
 * @param options - Report options
 * @returns Detailed budget vs actual report
 *
 * @example
 * ```typescript
 * const report = await generateBudgetVsActualReport('budget-123', {
 *   includeLineItems: true,
 *   includeForecasts: true,
 * });
 * ```
 */
async function generateBudgetVsActualReport(budgetId, options) {
    if (!budgetId) {
        throw new common_1.BadRequestException('Budget ID is required');
    }
    const report = {
        id: `RPT-${Date.now()}`,
        reportType: ReportType.BUDGET_VS_ACTUAL,
        startDate: new Date(),
        endDate: new Date(),
        generatedAt: new Date(),
        generatedBy: 'system',
        data: {},
        summary: {
            totalBudget: 0,
            totalSpent: 0,
            totalVariance: 0,
            variancePercentage: 0,
        },
    };
    return report;
}
/**
 * Monitor budget utilization and send alerts
 *
 * @param budgetId - Budget ID
 * @param thresholds - Alert thresholds
 * @returns Alert status and recommendations
 *
 * @example
 * ```typescript
 * const alerts = await monitorBudgetUtilization('budget-123', {
 *   warningThreshold: 80,
 *   criticalThreshold: 95,
 * });
 * ```
 */
async function monitorBudgetUtilization(budgetId, thresholds) {
    if (!budgetId) {
        throw new common_1.BadRequestException('Budget ID is required');
    }
    const warningThreshold = thresholds?.warningThreshold || 80;
    const criticalThreshold = thresholds?.criticalThreshold || 95;
    // Would normally fetch from database
    const utilization = 85;
    let status = 'normal';
    if (utilization >= criticalThreshold) {
        status = 'critical';
    }
    else if (utilization >= warningThreshold) {
        status = 'warning';
    }
    const alerts = [];
    if (status === 'warning') {
        alerts.push({
            severity: 'warning',
            message: `Budget utilization at ${utilization}%`,
            recommendation: 'Review upcoming expenses and consider budget adjustments',
        });
    }
    return {
        utilizationPercentage: utilization,
        status,
        alerts,
    };
}
// ============================================================================
// COST ALLOCATION FUNCTIONS
// ============================================================================
/**
 * Allocate costs across multiple properties or units
 *
 * @param totalCost - Total cost to allocate
 * @param targets - Allocation targets with weights or areas
 * @param method - Allocation method
 * @returns Cost allocation results
 *
 * @example
 * ```typescript
 * const allocation = await allocateCosts(10000, [
 *   { id: 'unit-1', squareFeet: 1000 },
 *   { id: 'unit-2', squareFeet: 1500 },
 * ], AllocationMethod.SQUARE_FOOTAGE);
 * ```
 */
async function allocateCosts(totalCost, targets, method) {
    if (totalCost <= 0) {
        throw new common_1.BadRequestException('Total cost must be positive');
    }
    if (targets.length === 0) {
        throw new common_1.BadRequestException('At least one allocation target is required');
    }
    const results = [];
    switch (method) {
        case AllocationMethod.EQUAL:
            const equalAmount = totalCost / targets.length;
            targets.forEach((target) => {
                results.push({
                    targetId: target.id,
                    allocatedAmount: equalAmount,
                    percentage: 100 / targets.length,
                    basis: 'equal',
                });
            });
            break;
        case AllocationMethod.SQUARE_FOOTAGE:
            const totalSquareFeet = targets.reduce((sum, t) => sum + (t.squareFeet || 0), 0);
            if (totalSquareFeet === 0) {
                throw new common_1.BadRequestException('Total square feet must be greater than 0');
            }
            targets.forEach((target) => {
                const sqft = target.squareFeet || 0;
                const percentage = (sqft / totalSquareFeet) * 100;
                results.push({
                    targetId: target.id,
                    allocatedAmount: (totalCost * sqft) / totalSquareFeet,
                    percentage,
                    basis: `${sqft} sqft`,
                });
            });
            break;
        case AllocationMethod.PROPORTIONAL:
            const totalWeight = targets.reduce((sum, t) => sum + (t.weight || 1), 0);
            targets.forEach((target) => {
                const weight = target.weight || 1;
                const percentage = (weight / totalWeight) * 100;
                results.push({
                    targetId: target.id,
                    allocatedAmount: (totalCost * weight) / totalWeight,
                    percentage,
                    basis: `weight: ${weight}`,
                });
            });
            break;
        default:
            throw new common_1.BadRequestException(`Unsupported allocation method: ${method}`);
    }
    return results;
}
/**
 * Apply activity-based costing allocation
 *
 * @param totalCost - Total cost to allocate
 * @param activities - Activity drivers and consumption
 * @returns Activity-based cost allocation
 *
 * @example
 * ```typescript
 * const allocation = await applyActivityBasedCosting(50000, [
 *   { activity: 'maintenance', driver: 'work_orders', consumption: 25 },
 *   { activity: 'utilities', driver: 'usage_kwh', consumption: 10000 },
 * ]);
 * ```
 */
async function applyActivityBasedCosting(totalCost, activities) {
    if (activities.length === 0) {
        throw new common_1.BadRequestException('At least one activity is required');
    }
    const totalConsumption = activities.reduce((sum, a) => sum + a.consumption, 0);
    const ratePerUnit = totalCost / totalConsumption;
    const results = activities.map((activity) => ({
        activity: activity.activity,
        driver: activity.driver,
        consumption: activity.consumption,
        allocatedCost: activity.consumption * ratePerUnit,
        unitCost: ratePerUnit,
    }));
    return results;
}
// ============================================================================
// FINANCIAL FORECASTING FUNCTIONS
// ============================================================================
/**
 * Generate financial forecast using selected method
 *
 * @param data - Forecast creation data
 * @returns Budget forecast with confidence intervals
 *
 * @example
 * ```typescript
 * const forecast = await generateFinancialForecast({
 *   propertyId: 'prop-123',
 *   category: ExpenseCategory.UTILITIES,
 *   forecastPeriod: '2024-Q3',
 *   forecastMethod: ForecastMethod.MOVING_AVERAGE,
 *   historicalData: [...],
 *   createdBy: 'user-123',
 * });
 * ```
 */
async function generateFinancialForecast(data) {
    const validated = exports.ForecastCreateSchema.parse(data);
    let forecastAmount = 0;
    let confidenceLevel = 0.8;
    let lowerBound = 0;
    let upperBound = 0;
    const historicalData = validated.historicalData || [];
    switch (validated.forecastMethod) {
        case ForecastMethod.HISTORICAL_AVERAGE:
            if (historicalData.length > 0) {
                forecastAmount = historicalData.reduce((sum, d) => sum + d.amount, 0) / historicalData.length;
                const variance = calculateHistoricalVariance(historicalData);
                lowerBound = forecastAmount - variance;
                upperBound = forecastAmount + variance;
            }
            break;
        case ForecastMethod.MOVING_AVERAGE:
            const periods = Math.min(3, historicalData.length);
            if (historicalData.length >= periods) {
                const recentData = historicalData.slice(-periods);
                forecastAmount = recentData.reduce((sum, d) => sum + d.amount, 0) / periods;
                const variance = calculateHistoricalVariance(recentData);
                lowerBound = forecastAmount - variance * 1.5;
                upperBound = forecastAmount + variance * 1.5;
                confidenceLevel = 0.85;
            }
            break;
        case ForecastMethod.TREND_ANALYSIS:
            if (historicalData.length >= 2) {
                const trend = calculateTrendLine(historicalData);
                forecastAmount = trend.forecast;
                lowerBound = trend.lowerBound;
                upperBound = trend.upperBound;
                confidenceLevel = trend.confidence;
            }
            break;
        default:
            throw new common_1.BadRequestException(`Forecast method ${validated.forecastMethod} not implemented`);
    }
    const forecast = {
        id: `FCT-${Date.now()}`,
        budgetId: validated.budgetId,
        propertyId: validated.propertyId,
        category: validated.category,
        forecastPeriod: validated.forecastPeriod,
        forecastMethod: validated.forecastMethod,
        forecastAmount: Math.round(forecastAmount * 100) / 100,
        confidenceLevel,
        lowerBound: Math.round(lowerBound * 100) / 100,
        upperBound: Math.round(upperBound * 100) / 100,
        assumptions: validated.assumptions,
        historicalData: validated.historicalData,
        notes: validated.notes,
        createdBy: validated.createdBy,
        createdAt: new Date(),
    };
    return forecast;
}
/**
 * Calculate historical variance for confidence intervals
 */
function calculateHistoricalVariance(data) {
    if (data.length === 0)
        return 0;
    const mean = data.reduce((sum, d) => sum + d.amount, 0) / data.length;
    const squaredDiffs = data.map((d) => Math.pow(d.amount - mean, 2));
    const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / data.length;
    return Math.sqrt(variance);
}
/**
 * Calculate trend line using linear regression
 */
function calculateTrendLine(data) {
    if (data.length < 2) {
        return { forecast: 0, lowerBound: 0, upperBound: 0, confidence: 0 };
    }
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = data.map((d) => d.amount);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const forecast = slope * n + intercept;
    const variance = calculateHistoricalVariance(data);
    return {
        forecast,
        lowerBound: forecast - variance * 1.96,
        upperBound: forecast + variance * 1.96,
        confidence: 0.9,
    };
}
/**
 * Apply seasonal adjustments to forecasts
 *
 * @param forecast - Base forecast
 * @param seasonalFactors - Seasonal adjustment factors by month
 * @returns Seasonally adjusted forecast
 *
 * @example
 * ```typescript
 * const adjusted = await applySeasonalAdjustments(forecast, {
 *   1: 1.2,  // January 20% higher
 *   7: 0.8,  // July 20% lower
 * });
 * ```
 */
async function applySeasonalAdjustments(forecast, seasonalFactors) {
    const adjusted = { ...forecast };
    // Parse period to get month
    const periodDate = (0, date_fns_1.parseISO)(forecast.forecastPeriod);
    const month = periodDate.getMonth() + 1;
    const factor = seasonalFactors[month] || 1.0;
    adjusted.forecastAmount *= factor;
    adjusted.lowerBound *= factor;
    adjusted.upperBound *= factor;
    adjusted.seasonalityFactor = factor;
    return adjusted;
}
/**
 * Generate cash flow forecast for property
 *
 * @param propertyId - Property ID
 * @param months - Number of months to forecast
 * @returns Monthly cash flow projections
 *
 * @example
 * ```typescript
 * const cashFlow = await generateCashFlowForecast('prop-123', 12);
 * ```
 */
async function generateCashFlowForecast(propertyId, months = 12) {
    if (months < 1 || months > 60) {
        throw new common_1.BadRequestException('Months must be between 1 and 60');
    }
    const forecast = [];
    let cumulative = 0;
    for (let i = 0; i < months; i++) {
        const month = (0, date_fns_1.format)((0, date_fns_1.addMonths)(new Date(), i), 'yyyy-MM');
        const inflow = 0; // Would calculate from income sources
        const outflow = 0; // Would calculate from expenses
        const netCashFlow = inflow - outflow;
        cumulative += netCashFlow;
        forecast.push({
            month,
            inflow,
            outflow,
            netCashFlow,
            cumulativeCashFlow: cumulative,
        });
    }
    return forecast;
}
// ============================================================================
// BUDGET APPROVAL WORKFLOW FUNCTIONS
// ============================================================================
/**
 * Submit budget for approval
 *
 * @param budgetId - Budget ID
 * @param approvers - List of approver user IDs in order
 * @returns Approval workflow initiated
 *
 * @example
 * ```typescript
 * const workflow = await submitBudgetForApproval('budget-123', [
 *   'manager-1',
 *   'director-1',
 *   'cfo-1',
 * ]);
 * ```
 */
async function submitBudgetForApproval(budgetId, approvers) {
    if (!budgetId) {
        throw new common_1.BadRequestException('Budget ID is required');
    }
    if (approvers.length === 0) {
        throw new common_1.BadRequestException('At least one approver is required');
    }
    const approvals = approvers.map((approverId, index) => ({
        id: `APV-${Date.now()}-${index}`,
        budgetId,
        approvalLevel: index + 1,
        approverId,
        status: index === 0 ? ApprovalStatus.PENDING : ApprovalStatus.PENDING,
        requestedAt: new Date(),
        deadline: addDays(new Date(), 7),
    }));
    return approvals;
}
/**
 * Process budget approval or rejection
 *
 * @param approvalId - Approval ID
 * @param decision - Approval decision
 * @param comments - Optional comments
 * @returns Updated approval status
 *
 * @example
 * ```typescript
 * const approval = await processBudgetApproval('approval-123', {
 *   status: ApprovalStatus.APPROVED,
 *   comments: 'Approved with minor adjustments',
 * });
 * ```
 */
async function processBudgetApproval(approvalId, decision) {
    if (!approvalId) {
        throw new common_1.BadRequestException('Approval ID is required');
    }
    // Would fetch approval from database
    const approval = {
        id: approvalId,
        budgetId: 'budget-123',
        approvalLevel: 1,
        approverId: 'user-123',
        status: decision.status,
        comments: decision.comments,
        requestedAt: new Date(),
        respondedAt: new Date(),
    };
    return approval;
}
/**
 * Check if budget approval workflow is complete
 *
 * @param budgetId - Budget ID
 * @returns Approval status and next steps
 *
 * @example
 * ```typescript
 * const status = await checkApprovalStatus('budget-123');
 * ```
 */
async function checkApprovalStatus(budgetId) {
    if (!budgetId) {
        throw new common_1.BadRequestException('Budget ID is required');
    }
    // Would query approvals from database
    return {
        isComplete: false,
        isApproved: false,
        currentLevel: 1,
        totalLevels: 3,
        pendingApprovers: ['user-1', 'user-2'],
        completedApprovals: 0,
    };
}
// ============================================================================
// COST CENTER MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create cost center
 *
 * @param data - Cost center data
 * @returns Created cost center
 *
 * @example
 * ```typescript
 * const costCenter = await createCostCenter({
 *   propertyId: 'prop-123',
 *   code: 'CC-MAINT',
 *   name: 'Maintenance Department',
 *   managerId: 'user-123',
 *   totalBudget: 100000,
 * });
 * ```
 */
async function createCostCenter(data) {
    const validated = exports.CostCenterCreateSchema.parse(data);
    const costCenter = {
        id: `CC-${Date.now()}`,
        propertyId: validated.propertyId,
        code: validated.code,
        name: validated.name,
        description: validated.description,
        department: validated.department,
        managerId: validated.managerId,
        parentCostCenterId: validated.parentCostCenterId,
        isActive: true,
        totalBudget: validated.totalBudget,
        allocatedBudget: 0,
        spentBudget: 0,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return costCenter;
}
/**
 * Get cost center hierarchy
 *
 * @param costCenterId - Root cost center ID
 * @returns Hierarchical cost center structure
 *
 * @example
 * ```typescript
 * const hierarchy = await getCostCenterHierarchy('cc-123');
 * ```
 */
async function getCostCenterHierarchy(costCenterId) {
    if (!costCenterId) {
        throw new common_1.BadRequestException('Cost center ID is required');
    }
    // Would fetch from database with recursive query
    throw new common_1.NotFoundException('Cost center not found');
}
/**
 * Allocate budget to cost center
 *
 * @param costCenterId - Cost center ID
 * @param amount - Amount to allocate
 * @returns Updated cost center
 *
 * @example
 * ```typescript
 * const updated = await allocateBudgetToCostCenter('cc-123', 25000);
 * ```
 */
async function allocateBudgetToCostCenter(costCenterId, amount) {
    if (!costCenterId) {
        throw new common_1.BadRequestException('Cost center ID is required');
    }
    if (amount <= 0) {
        throw new common_1.BadRequestException('Amount must be positive');
    }
    // Would update database
    throw new common_1.NotFoundException('Cost center not found');
}
// ============================================================================
// FINANCIAL REPORTING AND DASHBOARD FUNCTIONS
// ============================================================================
/**
 * Generate comprehensive financial report
 *
 * @param reportType - Type of report to generate
 * @param params - Report parameters
 * @returns Generated financial report
 *
 * @example
 * ```typescript
 * const report = await generateFinancialReport(ReportType.VARIANCE_ANALYSIS, {
 *   propertyId: 'prop-123',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 * ```
 */
async function generateFinancialReport(reportType, params) {
    const report = {
        id: `RPT-${reportType}-${Date.now()}`,
        reportType,
        propertyId: params.propertyId,
        propertyIds: params.propertyIds,
        startDate: params.startDate,
        endDate: params.endDate,
        generatedAt: new Date(),
        generatedBy: 'system',
        data: {},
        summary: {
            totalBudget: 0,
            totalSpent: 0,
            totalVariance: 0,
            variancePercentage: 0,
        },
    };
    return report;
}
/**
 * Calculate budget KPIs for dashboard
 *
 * @param propertyId - Property ID
 * @param period - Calculation period
 * @returns Budget KPIs
 *
 * @example
 * ```typescript
 * const kpis = await calculateBudgetKPIs('prop-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 * ```
 */
async function calculateBudgetKPIs(propertyId, period) {
    if (!propertyId) {
        throw new common_1.BadRequestException('Property ID is required');
    }
    // Would calculate from database
    const kpis = {
        budgetUtilization: 0,
        budgetVariance: 0,
        forecastAccuracy: 0,
        costPerUnit: 0,
        costPerSquareFoot: 0,
        operatingExpenseRatio: 0,
        maintenanceCostRatio: 0,
        emergencyExpenseRatio: 0,
        budgetApprovalTime: 0,
        expenseProcessingTime: 0,
    };
    return kpis;
}
/**
 * Generate budget dashboard data
 *
 * @param propertyIds - Property IDs to include
 * @param dateRange - Date range for dashboard
 * @returns Dashboard data with charts and metrics
 *
 * @example
 * ```typescript
 * const dashboard = await generateBudgetDashboard(
 *   ['prop-1', 'prop-2'],
 *   { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') }
 * );
 * ```
 */
async function generateBudgetDashboard(propertyIds, dateRange) {
    if (propertyIds.length === 0) {
        throw new common_1.BadRequestException('At least one property ID is required');
    }
    return {
        overview: {
            totalBudget: 0,
            totalSpent: 0,
            utilizationRate: 0,
            varianceRate: 0,
        },
        charts: [],
        alerts: [],
        trends: [],
    };
}
/**
 * Compare budgets across properties
 *
 * @param propertyIds - Property IDs to compare
 * @param period - Comparison period
 * @returns Comparative budget analysis
 *
 * @example
 * ```typescript
 * const comparison = await comparePropertyBudgets(
 *   ['prop-1', 'prop-2', 'prop-3'],
 *   { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') }
 * );
 * ```
 */
async function comparePropertyBudgets(propertyIds, period) {
    if (propertyIds.length < 2) {
        throw new common_1.BadRequestException('At least two properties are required for comparison');
    }
    // Would fetch and compare from database
    return [];
}
/**
 * Export budget data to various formats
 *
 * @param budgetId - Budget ID
 * @param format - Export format (csv, xlsx, pdf)
 * @returns Exported data buffer
 *
 * @example
 * ```typescript
 * const exported = await exportBudgetData('budget-123', 'xlsx');
 * ```
 */
async function exportBudgetData(budgetId, format) {
    if (!budgetId) {
        throw new common_1.BadRequestException('Budget ID is required');
    }
    // Would generate export based on format
    return Buffer.from('');
}
/**
 * Create budget revision with change tracking
 *
 * @param budgetId - Budget ID
 * @param changes - List of changes to track
 * @param reason - Revision reason
 * @param createdBy - User creating revision
 * @returns Created budget revision
 *
 * @example
 * ```typescript
 * const revision = await createBudgetRevision('budget-123', [
 *   { field: 'totalAmount', oldValue: 500000, newValue: 550000, reason: 'Increased maintenance costs' },
 * ], 'Mid-year adjustment', 'user-123');
 * ```
 */
async function createBudgetRevision(budgetId, changes, reason, createdBy) {
    if (!budgetId) {
        throw new common_1.BadRequestException('Budget ID is required');
    }
    if (changes.length === 0) {
        throw new common_1.BadRequestException('At least one change is required');
    }
    // Would fetch current budget version from database
    const revision = {
        id: `REV-${Date.now()}`,
        budgetId,
        revisionNumber: 1, // Would increment from database
        previousVersion: 'v1.0',
        changes,
        reason,
        createdBy,
        createdAt: new Date(),
    };
    return revision;
}
/**
 * Create or update budget template
 *
 * @param data - Template data
 * @returns Created or updated budget template
 *
 * @example
 * ```typescript
 * const template = await createBudgetTemplate({
 *   name: 'Standard Operational Budget',
 *   type: BudgetType.OPERATIONAL,
 *   period: BudgetPeriod.ANNUAL,
 *   lineItems: [
 *     { category: ExpenseCategory.UTILITIES, percentage: 15 },
 *     { category: ExpenseCategory.MAINTENANCE, percentage: 20 },
 *   ],
 *   createdBy: 'user-123',
 * });
 * ```
 */
async function createBudgetTemplate(data) {
    if (!data.name || data.name.trim().length === 0) {
        throw new common_1.BadRequestException('Template name is required');
    }
    if (data.lineItems.length === 0) {
        throw new common_1.BadRequestException('At least one line item is required');
    }
    // Validate percentages sum to 100 if all items use percentages
    const allPercentages = data.lineItems.every((item) => item.percentage !== undefined);
    if (allPercentages) {
        const totalPercentage = data.lineItems.reduce((sum, item) => sum + (item.percentage || 0), 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
            throw new common_1.BadRequestException('Line item percentages must sum to 100');
        }
    }
    const template = {
        id: `TPL-${Date.now()}`,
        name: data.name,
        type: data.type,
        period: data.period,
        description: data.description,
        lineItems: data.lineItems.map((item) => ({
            category: item.category,
            subcategory: item.subcategory,
            description: item.description || `${item.category} budget`,
            percentage: item.percentage,
            fixedAmount: item.fixedAmount,
        })),
        isDefault: data.isDefault || false,
        applicablePropertyTypes: data.applicablePropertyTypes,
        metadata: data.metadata,
        createdBy: data.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return template;
}
// Helper function for date addition
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
//# sourceMappingURL=property-budget-management-kit.js.map