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
import { z } from 'zod';
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
    MAINTENANCE = "maintenance",
    MARKETING = "marketing",
    UTILITIES = "utilities",
    STAFFING = "staffing",
    IMPROVEMENT = "improvement",
    EMERGENCY = "emergency",
    MIXED = "mixed"
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
 * Expense category enum
 */
export declare enum ExpenseCategory {
    UTILITIES = "utilities",
    MAINTENANCE = "maintenance",
    REPAIRS = "repairs",
    INSURANCE = "insurance",
    PROPERTY_TAX = "property_tax",
    MANAGEMENT_FEES = "management_fees",
    LANDSCAPING = "landscaping",
    SECURITY = "security",
    CLEANING = "cleaning",
    PEST_CONTROL = "pest_control",
    SUPPLIES = "supplies",
    EQUIPMENT = "equipment",
    MARKETING = "marketing",
    LEGAL = "legal",
    ACCOUNTING = "accounting",
    STAFFING = "staffing",
    IMPROVEMENTS = "improvements",
    RESERVES = "reserves",
    MISCELLANEOUS = "miscellaneous"
}
/**
 * Variance severity enum
 */
export declare enum VarianceSeverity {
    NORMAL = "normal",
    WARNING = "warning",
    CRITICAL = "critical",
    FAVORABLE = "favorable"
}
/**
 * Approval status enum
 */
export declare enum ApprovalStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    NEEDS_REVISION = "needs_revision",
    ESCALATED = "escalated"
}
/**
 * Allocation method enum
 */
export declare enum AllocationMethod {
    DIRECT = "direct",
    PROPORTIONAL = "proportional",
    ACTIVITY_BASED = "activity_based",
    SQUARE_FOOTAGE = "square_footage",
    UNIT_COUNT = "unit_count",
    EQUAL = "equal",
    CUSTOM = "custom"
}
/**
 * Forecast method enum
 */
export declare enum ForecastMethod {
    LINEAR_REGRESSION = "linear_regression",
    MOVING_AVERAGE = "moving_average",
    EXPONENTIAL_SMOOTHING = "exponential_smoothing",
    SEASONAL_DECOMPOSITION = "seasonal_decomposition",
    HISTORICAL_AVERAGE = "historical_average",
    TREND_ANALYSIS = "trend_analysis"
}
/**
 * Report type enum
 */
export declare enum ReportType {
    BUDGET_VS_ACTUAL = "budget_vs_actual",
    VARIANCE_ANALYSIS = "variance_analysis",
    FORECAST = "forecast",
    CASH_FLOW = "cash_flow",
    EXPENSE_BREAKDOWN = "expense_breakdown",
    COST_CENTER = "cost_center",
    PROPERTY_COMPARISON = "property_comparison",
    PERIOD_COMPARISON = "period_comparison",
    KPI_DASHBOARD = "kpi_dashboard",
    EXECUTIVE_SUMMARY = "executive_summary"
}
/**
 * Budget interface
 */
export interface Budget {
    id: string;
    propertyId: string;
    name: string;
    type: BudgetType;
    period: BudgetPeriod;
    fiscalYear: number;
    startDate: Date;
    endDate: Date;
    status: BudgetStatus;
    totalAmount: number;
    allocatedAmount: number;
    spentAmount: number;
    remainingAmount: number;
    currency: string;
    parentBudgetId?: string;
    costCenterId?: string;
    approvedBy?: string;
    approvedAt?: Date;
    lockedAt?: Date;
    notes?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Budget line item interface
 */
export interface BudgetLineItem {
    id: string;
    budgetId: string;
    category: ExpenseCategory;
    subcategory?: string;
    description: string;
    plannedAmount: number;
    allocatedAmount: number;
    spentAmount: number;
    remainingAmount: number;
    percentage: number;
    startDate?: Date;
    endDate?: Date;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Expense interface
 */
export interface Expense {
    id: string;
    propertyId: string;
    budgetId?: string;
    budgetLineItemId?: string;
    category: ExpenseCategory;
    subcategory?: string;
    description: string;
    amount: number;
    currency: string;
    transactionDate: Date;
    paymentDate?: Date;
    vendor?: string;
    invoiceNumber?: string;
    referenceNumber?: string;
    paymentMethod?: string;
    isRecurring: boolean;
    recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
    attachments?: string[];
    approvedBy?: string;
    approvedAt?: Date;
    notes?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Budget variance interface
 */
export interface BudgetVariance {
    id: string;
    budgetId: string;
    budgetLineItemId?: string;
    period: string;
    plannedAmount: number;
    actualAmount: number;
    variance: number;
    variancePercentage: number;
    severity: VarianceSeverity;
    rootCause?: string;
    correctiveAction?: string;
    responsibleParty?: string;
    notes?: string;
    analyzedAt: Date;
    analyzedBy: string;
}
/**
 * Budget forecast interface
 */
export interface BudgetForecast {
    id: string;
    budgetId?: string;
    propertyId: string;
    category?: ExpenseCategory;
    forecastPeriod: string;
    forecastMethod: ForecastMethod;
    forecastAmount: number;
    confidenceLevel: number;
    lowerBound: number;
    upperBound: number;
    assumptions: string[];
    historicalData?: Array<{
        period: string;
        amount: number;
    }>;
    seasonalityFactor?: number;
    trendFactor?: number;
    notes?: string;
    createdBy: string;
    createdAt: Date;
}
/**
 * Cost center interface
 */
export interface CostCenter {
    id: string;
    propertyId?: string;
    code: string;
    name: string;
    description?: string;
    department?: string;
    managerId: string;
    parentCostCenterId?: string;
    isActive: boolean;
    totalBudget: number;
    allocatedBudget: number;
    spentBudget: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Budget approval interface
 */
export interface BudgetApproval {
    id: string;
    budgetId: string;
    approvalLevel: number;
    approverId: string;
    status: ApprovalStatus;
    comments?: string;
    requestedAt: Date;
    respondedAt?: Date;
    deadline?: Date;
    metadata?: Record<string, any>;
}
/**
 * Budget revision interface
 */
export interface BudgetRevision {
    id: string;
    budgetId: string;
    revisionNumber: number;
    previousVersion: string;
    changes: Array<{
        field: string;
        oldValue: any;
        newValue: any;
        reason: string;
    }>;
    reason: string;
    approvedBy?: string;
    approvedAt?: Date;
    createdBy: string;
    createdAt: Date;
}
/**
 * Budget template interface
 */
export interface BudgetTemplate {
    id: string;
    name: string;
    type: BudgetType;
    period: BudgetPeriod;
    description?: string;
    lineItems: Array<{
        category: ExpenseCategory;
        subcategory?: string;
        description: string;
        percentage?: number;
        fixedAmount?: number;
    }>;
    isDefault: boolean;
    applicablePropertyTypes?: string[];
    metadata?: Record<string, any>;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Financial report interface
 */
export interface FinancialReport {
    id: string;
    reportType: ReportType;
    propertyId?: string;
    propertyIds?: string[];
    startDate: Date;
    endDate: Date;
    generatedAt: Date;
    generatedBy: string;
    data: Record<string, any>;
    summary: {
        totalBudget: number;
        totalSpent: number;
        totalVariance: number;
        variancePercentage: number;
    };
    charts?: Array<{
        type: string;
        title: string;
        data: any;
    }>;
    metadata?: Record<string, any>;
}
/**
 * Budget KPI interface
 */
export interface BudgetKPI {
    budgetUtilization: number;
    budgetVariance: number;
    forecastAccuracy: number;
    costPerUnit?: number;
    costPerSquareFoot?: number;
    operatingExpenseRatio?: number;
    maintenanceCostRatio?: number;
    emergencyExpenseRatio?: number;
    budgetApprovalTime?: number;
    expenseProcessingTime?: number;
}
/**
 * Budget creation schema
 */
export declare const BudgetCreateSchema: any;
/**
 * Budget line item creation schema
 */
export declare const BudgetLineItemCreateSchema: any;
/**
 * Expense creation schema
 */
export declare const ExpenseCreateSchema: any;
/**
 * Forecast creation schema
 */
export declare const ForecastCreateSchema: any;
/**
 * Cost center creation schema
 */
export declare const CostCenterCreateSchema: any;
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
export declare function createBudget(data: z.infer<typeof BudgetCreateSchema>): Promise<Budget>;
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
export declare function createBudgetFromTemplate(templateId: string, data: Partial<z.infer<typeof BudgetCreateSchema>>): Promise<{
    budget: Budget;
    lineItems: BudgetLineItem[];
}>;
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
export declare function createMultiYearBudget(data: Partial<z.infer<typeof BudgetCreateSchema>>, years: number, growthRate?: number): Promise<Budget[]>;
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
export declare function addBudgetLineItem(data: z.infer<typeof BudgetLineItemCreateSchema>): Promise<BudgetLineItem>;
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
export declare function rolloverBudget(budgetId: string, adjustments?: {
    fiscalYear?: number;
    totalAmount?: number;
    adjustmentFactor?: number;
    includeUnspent?: boolean;
}): Promise<Budget>;
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
export declare function recordExpense(data: z.infer<typeof ExpenseCreateSchema>): Promise<Expense>;
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
export declare function categorizeExpense(expense: Expense, rules?: {
    vendorRules?: Record<string, ExpenseCategory>;
    descriptionKeywords?: Record<string, ExpenseCategory>;
    amountRanges?: Array<{
        min: number;
        max: number;
        category: ExpenseCategory;
    }>;
}): Promise<Expense>;
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
export declare function getExpenseSummaryByCategory(propertyId: string, startDate: Date, endDate: Date): Promise<Array<{
    category: ExpenseCategory;
    totalAmount: number;
    expenseCount: number;
    percentage: number;
    averageAmount: number;
}>>;
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
export declare function projectRecurringExpenses(propertyId: string, months?: number): Promise<Array<{
    category: ExpenseCategory;
    description: string;
    amount: number;
    frequency: string;
    nextDueDate: Date;
    annualTotal: number;
}>>;
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
export declare function calculateBudgetVariance(budgetId: string, asOfDate: Date): Promise<BudgetVariance>;
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
export declare function generateBudgetVsActualReport(budgetId: string, options?: {
    includeLineItems?: boolean;
    includeForecasts?: boolean;
    groupBy?: 'category' | 'month' | 'costCenter';
}): Promise<FinancialReport>;
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
export declare function monitorBudgetUtilization(budgetId: string, thresholds?: {
    warningThreshold?: number;
    criticalThreshold?: number;
}): Promise<{
    utilizationPercentage: number;
    status: 'normal' | 'warning' | 'critical';
    alerts: Array<{
        severity: string;
        message: string;
        recommendation: string;
    }>;
}>;
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
export declare function allocateCosts(totalCost: number, targets: Array<{
    id: string;
    name?: string;
    weight?: number;
    squareFeet?: number;
    units?: number;
}>, method: AllocationMethod): Promise<Array<{
    targetId: string;
    allocatedAmount: number;
    percentage: number;
    basis: string;
}>>;
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
export declare function applyActivityBasedCosting(totalCost: number, activities: Array<{
    activity: string;
    driver: string;
    consumption: number;
    rate?: number;
}>): Promise<Array<{
    activity: string;
    driver: string;
    consumption: number;
    allocatedCost: number;
    unitCost: number;
}>>;
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
export declare function generateFinancialForecast(data: z.infer<typeof ForecastCreateSchema>): Promise<BudgetForecast>;
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
export declare function applySeasonalAdjustments(forecast: BudgetForecast, seasonalFactors: Record<number, number>): Promise<BudgetForecast>;
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
export declare function generateCashFlowForecast(propertyId: string, months?: number): Promise<Array<{
    month: string;
    inflow: number;
    outflow: number;
    netCashFlow: number;
    cumulativeCashFlow: number;
}>>;
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
export declare function submitBudgetForApproval(budgetId: string, approvers: string[]): Promise<BudgetApproval[]>;
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
export declare function processBudgetApproval(approvalId: string, decision: {
    status: ApprovalStatus;
    comments?: string;
}): Promise<BudgetApproval>;
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
export declare function checkApprovalStatus(budgetId: string): Promise<{
    isComplete: boolean;
    isApproved: boolean;
    currentLevel: number;
    totalLevels: number;
    pendingApprovers: string[];
    completedApprovals: number;
}>;
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
export declare function createCostCenter(data: z.infer<typeof CostCenterCreateSchema>): Promise<CostCenter>;
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
export declare function getCostCenterHierarchy(costCenterId: string): Promise<CostCenter & {
    children: CostCenter[];
}>;
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
export declare function allocateBudgetToCostCenter(costCenterId: string, amount: number): Promise<CostCenter>;
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
export declare function generateFinancialReport(reportType: ReportType, params: {
    propertyId?: string;
    propertyIds?: string[];
    startDate: Date;
    endDate: Date;
    groupBy?: string;
}): Promise<FinancialReport>;
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
export declare function calculateBudgetKPIs(propertyId: string, period: {
    startDate: Date;
    endDate: Date;
}): Promise<BudgetKPI>;
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
export declare function generateBudgetDashboard(propertyIds: string[], dateRange: {
    startDate: Date;
    endDate: Date;
}): Promise<{
    overview: {
        totalBudget: number;
        totalSpent: number;
        utilizationRate: number;
        varianceRate: number;
    };
    charts: Array<{
        type: string;
        title: string;
        data: any;
    }>;
    alerts: Array<{
        severity: string;
        propertyId: string;
        message: string;
    }>;
    trends: Array<{
        metric: string;
        direction: 'up' | 'down' | 'stable';
        changePercentage: number;
    }>;
}>;
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
export declare function comparePropertyBudgets(propertyIds: string[], period: {
    startDate: Date;
    endDate: Date;
}): Promise<Array<{
    propertyId: string;
    propertyName: string;
    totalBudget: number;
    totalSpent: number;
    utilization: number;
    variance: number;
    categoryBreakdown: Record<string, number>;
    ranking: number;
}>>;
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
export declare function exportBudgetData(budgetId: string, format: 'csv' | 'xlsx' | 'pdf' | 'json'): Promise<Buffer>;
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
export declare function createBudgetRevision(budgetId: string, changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
    reason: string;
}>, reason: string, createdBy: string): Promise<BudgetRevision>;
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
export declare function createBudgetTemplate(data: {
    name: string;
    type: BudgetType;
    period: BudgetPeriod;
    description?: string;
    lineItems: Array<{
        category: ExpenseCategory;
        subcategory?: string;
        description?: string;
        percentage?: number;
        fixedAmount?: number;
    }>;
    isDefault?: boolean;
    applicablePropertyTypes?: string[];
    metadata?: Record<string, any>;
    createdBy: string;
}): Promise<BudgetTemplate>;
//# sourceMappingURL=property-budget-management-kit.d.ts.map