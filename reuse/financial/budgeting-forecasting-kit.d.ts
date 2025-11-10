/**
 * ============================================================================
 * WHITE CROSS - BUDGETING & FORECASTING KIT
 * ============================================================================
 *
 * Enterprise-grade budgeting and financial forecasting toolkit competing with
 * Adaptive Insights, Anaplan, and Planful. Provides comprehensive budget
 * planning, multi-year forecasting, scenario analysis, and variance tracking.
 *
 * @module      reuse/financial/budgeting-forecasting-kit
 * @version     1.0.0
 * @since       2025-Q1
 * @status      Production-Ready
 * @locCode     FIN-BUDG-001
 *
 * ============================================================================
 * CAPABILITIES
 * ============================================================================
 *
 * Budget Management:
 * - Top-down, bottom-up, and zero-based budgeting methodologies
 * - Budget templates and rapid copying across periods/departments
 * - Multi-year capital and operational budget planning
 * - Departmental and cost center budget allocation
 * - Multi-stage budget approval workflows with audit trails
 * - Real-time budget vs actual variance analysis
 *
 * Forecasting Models:
 * - Linear regression and trend-based forecasting
 * - Exponential smoothing and moving averages
 * - Seasonal decomposition and ARIMA-style forecasts
 * - Rolling forecasts with dynamic period adjustment
 * - Driver-based forecasting with KPI linkage
 *
 * Scenario Planning:
 * - Best case / worst case / most likely scenario modeling
 * - Monte Carlo simulation support for probability distributions
 * - What-if analysis with parameter sensitivity testing
 * - Scenario comparison and impact assessment
 * - Risk-adjusted forecasting
 *
 * Advanced Analytics:
 * - Budget consolidation across organizational hierarchies
 * - Resource allocation optimization with constraint handling
 * - Variance decomposition (volume, price, mix effects)
 * - Cash flow forecasting and liquidity planning
 * - Capital expenditure planning and ROI analysis
 *
 * ============================================================================
 * TECHNICAL SPECIFICATIONS
 * ============================================================================
 *
 * Dependencies:
 * - NestJS 10.x (Dependency Injection, Services)
 * - Sequelize 6.x (Advanced ORM with complex queries)
 * - TypeScript 5.x (Type safety, interfaces)
 * - decimal.js (High-precision financial calculations)
 * - Swagger/OpenAPI (API documentation)
 *
 * Database Support:
 * - PostgreSQL 14+ (Primary, with JSONB and window functions)
 * - MySQL 8.0+ (Secondary, with JSON support)
 * - SQL Server 2019+ (Enterprise compatibility)
 *
 * Performance Targets:
 * - Budget creation: < 500ms for 1000 line items
 * - Variance calculation: < 2s for fiscal year analysis
 * - Forecast generation: < 5s for 36-month rolling forecast
 * - Scenario comparison: < 3s for 5 scenarios
 *
 * ============================================================================
 * COMPLIANCE & STANDARDS
 * ============================================================================
 *
 * - GAAP/IFRS financial reporting alignment
 * - SOX compliance for budget approval workflows
 * - Audit trail requirements (all changes logged)
 * - Multi-currency support with FX rate handling
 * - Role-based access control for budget visibility
 *
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 *
 * @example Basic Budget Creation (Bottom-Up)
 * ```typescript
 * const budget = await createBudget(sequelize, {
 *   name: 'FY2026 Operating Budget',
 *   fiscalYear: 2026,
 *   budgetType: BudgetType.OPERATING,
 *   methodology: BudgetMethodology.BOTTOM_UP,
 *   organizationId: 'org-123',
 *   currency: 'USD',
 *   status: BudgetStatus.DRAFT
 * });
 * ```
 *
 * @example Multi-Year Forecast with Scenarios
 * ```typescript
 * const forecast = await generateMultiYearForecast(sequelize, {
 *   baselineYear: 2025,
 *   forecastYears: 5,
 *   accountIds: ['revenue-001', 'cogs-001'],
 *   method: ForecastMethod.EXPONENTIAL_SMOOTHING,
 *   scenarios: [
 *     { name: 'Conservative', growthRate: 0.03 },
 *     { name: 'Aggressive', growthRate: 0.12 }
 *   ]
 * });
 * ```
 *
 * @example Budget vs Actual Variance Analysis
 * ```typescript
 * const variance = await calculateBudgetVariance(sequelize, {
 *   budgetId: 'budget-2025',
 *   periodStart: '2025-01-01',
 *   periodEnd: '2025-12-31',
 *   analysisType: VarianceAnalysisType.DETAILED,
 *   includeForecast: true
 * });
 * ```
 *
 * ============================================================================
 * INTEGRATION PATTERNS
 * ============================================================================
 *
 * NestJS Service:
 * ```typescript
 * @Injectable()
 * export class BudgetingService {
 *   constructor(
 *     @InjectConnection() private sequelize: Sequelize
 *   ) {}
 *
 *   async createAnnualBudget(dto: CreateBudgetDto) {
 *     return createBudget(this.sequelize, dto);
 *   }
 * }
 * ```
 *
 * REST API Controller:
 * ```typescript
 * @Controller('budgets')
 * export class BudgetController {
 *   @Post()
 *   @ApiOperation({ summary: 'Create new budget' })
 *   async create(@Body() dto: CreateBudgetDto) {
 *     return this.budgetingService.createAnnualBudget(dto);
 *   }
 * }
 * ```
 *
 * ============================================================================
 * @author      White Cross Development Team
 * @copyright   2025 White Cross Platform
 * @license     Proprietary
 * ============================================================================
 */
import { Sequelize } from 'sequelize';
import { Decimal } from 'decimal.js';
/**
 * Budget classification types
 */
export declare enum BudgetType {
    OPERATING = "operating",
    CAPITAL = "capital",
    CASH_FLOW = "cash_flow",
    PROJECT = "project",
    DEPARTMENTAL = "departmental",
    MASTER = "master"
}
/**
 * Budgeting methodologies
 */
export declare enum BudgetMethodology {
    TOP_DOWN = "top_down",
    BOTTOM_UP = "bottom_up",
    ZERO_BASED = "zero_based",
    INCREMENTAL = "incremental",
    ACTIVITY_BASED = "activity_based",
    VALUE_PROPOSITION = "value_proposition"
}
/**
 * Budget approval status workflow
 */
export declare enum BudgetStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    ACTIVE = "active",
    CLOSED = "closed",
    ARCHIVED = "archived"
}
/**
 * Forecasting methodologies
 */
export declare enum ForecastMethod {
    LINEAR_REGRESSION = "linear_regression",
    EXPONENTIAL_SMOOTHING = "exponential_smoothing",
    MOVING_AVERAGE = "moving_average",
    WEIGHTED_MOVING_AVERAGE = "weighted_moving_average",
    SEASONAL_DECOMPOSITION = "seasonal_decomposition",
    ARIMA = "arima",
    DRIVER_BASED = "driver_based",
    STRAIGHT_LINE = "straight_line"
}
/**
 * Forecast period granularity
 */
export declare enum ForecastPeriod {
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    ANNUALLY = "annually",
    WEEKLY = "weekly",
    DAILY = "daily"
}
/**
 * Scenario planning types
 */
export declare enum ScenarioType {
    BEST_CASE = "best_case",
    WORST_CASE = "worst_case",
    MOST_LIKELY = "most_likely",
    CONSERVATIVE = "conservative",
    AGGRESSIVE = "aggressive",
    CUSTOM = "custom"
}
/**
 * Variance analysis types
 */
export declare enum VarianceAnalysisType {
    SIMPLE = "simple",
    DETAILED = "detailed",
    DECOMPOSED = "decomposed",
    TREND = "trend"
}
/**
 * Budget line item interface
 */
export interface BudgetLineItem {
    id?: string;
    budgetId: string;
    accountId: string;
    accountCode: string;
    accountName: string;
    departmentId?: string;
    costCenterId?: string;
    projectId?: string;
    period: string;
    amount: string | Decimal;
    quantity?: number;
    unitPrice?: string | Decimal;
    notes?: string;
    createdBy: string;
    approvedBy?: string;
    metadata?: Record<string, any>;
}
/**
 * Budget creation parameters
 */
export interface CreateBudgetParams {
    name: string;
    description?: string;
    fiscalYear: number;
    budgetType: BudgetType;
    methodology: BudgetMethodology;
    organizationId: string;
    departmentId?: string;
    currency: string;
    status?: BudgetStatus;
    startDate: Date | string;
    endDate: Date | string;
    templateId?: string;
    createdBy: string;
    metadata?: Record<string, any>;
}
/**
 * Forecast generation parameters
 */
export interface ForecastParams {
    name: string;
    baselineYear: number;
    forecastYears: number;
    method: ForecastMethod;
    period: ForecastPeriod;
    accountIds?: string[];
    departmentIds?: string[];
    includeActuals?: boolean;
    confidence?: number;
    metadata?: Record<string, any>;
}
/**
 * Scenario modeling parameters
 */
export interface ScenarioParams {
    budgetId: string;
    scenarioType: ScenarioType;
    name: string;
    description?: string;
    assumptions: ScenarioAssumption[];
    probability?: number;
    createdBy: string;
}
/**
 * Scenario assumption interface
 */
export interface ScenarioAssumption {
    accountId?: string;
    category?: string;
    parameter: string;
    baseValue: number | string;
    adjustmentType: 'percentage' | 'absolute' | 'multiplier';
    adjustmentValue: number;
    notes?: string;
}
/**
 * Variance analysis result
 */
export interface VarianceAnalysis {
    budgetId: string;
    period: string;
    totalBudget: Decimal;
    totalActual: Decimal;
    totalVariance: Decimal;
    variancePercentage: number;
    favorableVariance: Decimal;
    unfavorableVariance: Decimal;
    lineItems: VarianceLineItem[];
    summary: VarianceSummary;
}
/**
 * Variance line item detail
 */
export interface VarianceLineItem {
    accountId: string;
    accountName: string;
    budgeted: Decimal;
    actual: Decimal;
    variance: Decimal;
    variancePercentage: number;
    isFavorable: boolean;
    category: string;
}
/**
 * Variance summary by category
 */
export interface VarianceSummary {
    byDepartment?: Record<string, Decimal>;
    byCategory?: Record<string, Decimal>;
    byAccountType?: Record<string, Decimal>;
    trends?: TrendAnalysis[];
}
/**
 * Trend analysis data
 */
export interface TrendAnalysis {
    period: string;
    value: Decimal;
    forecast?: Decimal;
    confidence?: number;
}
/**
 * Rolling forecast parameters
 */
export interface RollingForecastParams {
    budgetId: string;
    rollingMonths: number;
    updateFrequency: 'monthly' | 'quarterly';
    method: ForecastMethod;
    includeActuals: boolean;
    baseDate?: Date | string;
}
/**
 * Resource allocation parameters
 */
export interface ResourceAllocationParams {
    budgetId: string;
    totalBudget: Decimal;
    departments: DepartmentAllocation[];
    constraints?: AllocationConstraint[];
    optimizationGoal?: 'maximize_roi' | 'minimize_cost' | 'balanced';
}
/**
 * Department allocation detail
 */
export interface DepartmentAllocation {
    departmentId: string;
    departmentName: string;
    requestedAmount: Decimal;
    priority: number;
    minAllocation?: Decimal;
    maxAllocation?: Decimal;
    historicalSpend?: Decimal;
    projectedROI?: number;
}
/**
 * Allocation constraint
 */
export interface AllocationConstraint {
    type: 'min_percentage' | 'max_percentage' | 'fixed_amount' | 'ratio';
    departmentId?: string;
    category?: string;
    value: number | Decimal;
    description?: string;
}
/**
 * Creates a new budget with comprehensive metadata and validation.
 * Supports all budget types and methodologies with audit trail.
 *
 * @param sequelize - Sequelize instance
 * @param params - Budget creation parameters
 * @returns Created budget object with ID
 *
 * @example
 * ```typescript
 * const budget = await createBudget(sequelize, {
 *   name: 'FY2026 Operating Budget',
 *   fiscalYear: 2026,
 *   budgetType: BudgetType.OPERATING,
 *   methodology: BudgetMethodology.BOTTOM_UP,
 *   organizationId: 'org-123',
 *   currency: 'USD',
 *   startDate: '2026-01-01',
 *   endDate: '2026-12-31',
 *   createdBy: 'user-456'
 * });
 * ```
 */
export declare function createBudget(sequelize: Sequelize, params: CreateBudgetParams): Promise<any>;
/**
 * Creates budget from template, copying structure and line items.
 * Allows for automatic adjustment based on inflation or growth rates.
 *
 * @param sequelize - Sequelize instance
 * @param templateId - Source template budget ID
 * @param params - New budget parameters
 * @param adjustmentFactor - Optional percentage adjustment (e.g., 1.03 for 3% increase)
 * @returns Created budget with copied line items
 */
export declare function createBudgetFromTemplate(sequelize: Sequelize, templateId: string, params: Partial<CreateBudgetParams>, adjustmentFactor?: number): Promise<any>;
/**
 * Adds budget line items in bulk with validation and duplicate checking.
 * Supports batch insertion for performance with large datasets.
 *
 * @param sequelize - Sequelize instance
 * @param budgetId - Target budget ID
 * @param lineItems - Array of line items to add
 * @returns Count of inserted line items
 */
export declare function addBudgetLineItems(sequelize: Sequelize, budgetId: string, lineItems: BudgetLineItem[]): Promise<number>;
/**
 * Updates budget status with workflow validation.
 * Enforces approval hierarchy and audit requirements.
 *
 * @param sequelize - Sequelize instance
 * @param budgetId - Budget to update
 * @param newStatus - Target status
 * @param userId - User making the change
 * @param notes - Optional approval/rejection notes
 * @returns Updated budget
 */
export declare function updateBudgetStatus(sequelize: Sequelize, budgetId: string, newStatus: BudgetStatus, userId: string, notes?: string): Promise<any>;
/**
 * Retrieves budget with all line items and computed totals.
 * Includes departmental breakdowns and category summaries.
 *
 * @param sequelize - Sequelize instance
 * @param budgetId - Budget ID to retrieve
 * @param includeLineItems - Whether to include line item details
 * @returns Complete budget object with summaries
 */
export declare function getBudgetWithDetails(sequelize: Sequelize, budgetId: string, includeLineItems?: boolean): Promise<any>;
/**
 * Allocates budget top-down from total to departments.
 * Supports allocation by percentage, historical ratios, or custom rules.
 *
 * @param sequelize - Sequelize instance
 * @param budgetId - Budget to allocate
 * @param totalAmount - Total budget to allocate
 * @param allocationRules - Department allocation rules
 * @returns Allocation results by department
 */
export declare function allocateBudgetTopDown(sequelize: Sequelize, budgetId: string, totalAmount: Decimal, allocationRules: Array<{
    departmentId: string;
    percentage?: number;
    fixedAmount?: Decimal;
    priority?: number;
}>): Promise<any[]>;
/**
 * Consolidates budgets from multiple departments into master budget.
 * Performs rollup with duplicate elimination and variance checks.
 *
 * @param sequelize - Sequelize instance
 * @param masterBudgetId - Target master budget
 * @param sourceBudgetIds - Department budgets to consolidate
 * @param consolidationRules - Optional rules for handling conflicts
 * @returns Consolidation summary with totals
 */
export declare function consolidateBudgets(sequelize: Sequelize, masterBudgetId: string, sourceBudgetIds: string[], consolidationRules?: {
    eliminateDuplicates?: boolean;
    handleConflicts?: 'sum' | 'average' | 'max' | 'error';
}): Promise<any>;
/**
 * Calculates comprehensive budget variance analysis.
 * Compares budgeted amounts to actuals with detailed breakdowns.
 *
 * @param sequelize - Sequelize instance
 * @param budgetId - Budget to analyze
 * @param periodStart - Analysis period start
 * @param periodEnd - Analysis period end
 * @param analysisType - Level of detail
 * @returns Detailed variance analysis
 */
export declare function calculateBudgetVariance(sequelize: Sequelize, budgetId: string, periodStart: string | Date, periodEnd: string | Date, analysisType?: VarianceAnalysisType): Promise<VarianceAnalysis>;
/**
 * Performs variance decomposition analysis.
 * Breaks down variance into volume, price, and mix effects.
 *
 * @param sequelize - Sequelize instance
 * @param budgetId - Budget to analyze
 * @param accountId - Specific account to decompose
 * @param periodStart - Analysis period start
 * @param periodEnd - Analysis period end
 * @returns Decomposed variance components
 */
export declare function decomposeVariance(sequelize: Sequelize, budgetId: string, accountId: string, periodStart: string | Date, periodEnd: string | Date): Promise<{
    volumeVariance: Decimal;
    priceVariance: Decimal;
    mixVariance: Decimal;
    totalVariance: Decimal;
}>;
/**
 * Generates variance trend analysis over multiple periods.
 * Identifies patterns and anomalies in budget performance.
 *
 * @param sequelize - Sequelize instance
 * @param budgetId - Budget to analyze
 * @param periods - Number of periods to analyze
 * @returns Trend data with moving averages and forecasts
 */
export declare function analyzeVarianceTrends(sequelize: Sequelize, budgetId: string, periods?: number): Promise<TrendAnalysis[]>;
/**
 * Generates multi-year financial forecast using specified method.
 * Supports multiple forecasting algorithms with confidence intervals.
 *
 * @param sequelize - Sequelize instance
 * @param params - Forecast parameters
 * @returns Forecast data with confidence intervals
 */
export declare function generateMultiYearForecast(sequelize: Sequelize, params: ForecastParams): Promise<any>;
/**
 * Creates rolling forecast that updates based on latest actuals.
 * Automatically adjusts forecast window as time progresses.
 *
 * @param sequelize - Sequelize instance
 * @param params - Rolling forecast parameters
 * @returns Rolling forecast with dynamic periods
 */
export declare function createRollingForecast(sequelize: Sequelize, params: RollingForecastParams): Promise<any>;
/**
 * Updates rolling forecast with latest actuals.
 * Shifts forecast window and recalculates projections.
 *
 * @param sequelize - Sequelize instance
 * @param forecastId - Rolling forecast to update
 * @returns Updated forecast summary
 */
export declare function updateRollingForecast(sequelize: Sequelize, forecastId: string): Promise<any>;
/**
 * Generates seasonal forecast with decomposition.
 * Separates trend, seasonal, and irregular components.
 *
 * @param sequelize - Sequelize instance
 * @param accountId - Account to forecast
 * @param years - Historical years to analyze
 * @param forecastPeriods - Periods to forecast
 * @returns Seasonal forecast with components
 */
export declare function generateSeasonalForecast(sequelize: Sequelize, accountId: string, years?: number, forecastPeriods?: number): Promise<any>;
/**
 * Creates budget scenario with configurable assumptions.
 * Enables best/worst/likely case planning.
 *
 * @param sequelize - Sequelize instance
 * @param params - Scenario parameters
 * @returns Created scenario with calculated impacts
 */
export declare function createBudgetScenario(sequelize: Sequelize, params: ScenarioParams): Promise<any>;
/**
 * Compares multiple budget scenarios side-by-side.
 * Provides detailed impact analysis and variance.
 *
 * @param sequelize - Sequelize instance
 * @param budgetId - Budget to compare scenarios for
 * @param scenarioIds - Scenarios to compare
 * @returns Comparative analysis with key metrics
 */
export declare function compareScenarios(sequelize: Sequelize, budgetId: string, scenarioIds: string[]): Promise<any>;
/**
 * Performs what-if analysis with parameter sensitivity.
 * Tests impact of changing key variables.
 *
 * @param sequelize - Sequelize instance
 * @param budgetId - Budget to analyze
 * @param parameter - Parameter to vary
 * @param valueRange - Range of values to test
 * @returns Sensitivity analysis results
 */
export declare function performWhatIfAnalysis(sequelize: Sequelize, budgetId: string, parameter: {
    accountId?: string;
    category?: string;
    name: string;
}, valueRange: {
    min: number;
    max: number;
    step: number;
}): Promise<any[]>;
/**
 * Generates Monte Carlo simulation for probabilistic forecasting.
 * Uses random sampling to model uncertainty.
 *
 * @param sequelize - Sequelize instance
 * @param budgetId - Budget to simulate
 * @param iterations - Number of simulation runs
 * @param variabilityFactors - Factors with probability distributions
 * @returns Distribution of possible outcomes
 */
export declare function runMonteCarloSimulation(sequelize: Sequelize, budgetId: string, iterations: number | undefined, variabilityFactors: Array<{
    accountId: string;
    distribution: 'normal' | 'uniform' | 'triangular';
    mean?: number;
    stdDev?: number;
    min?: number;
    max?: number;
    mode?: number;
}>): Promise<any>;
/**
 * Optimizes budget allocation across departments.
 * Uses constraint-based optimization to maximize ROI or other goals.
 *
 * @param sequelize - Sequelize instance
 * @param params - Allocation parameters with constraints
 * @returns Optimized allocation plan
 */
export declare function optimizeResourceAllocation(sequelize: Sequelize, params: ResourceAllocationParams): Promise<any>;
/**
 * Retrieves complete budget allocation plan with utilization metrics.
 *
 * @param sequelize - Sequelize instance
 * @param allocationId - Allocation plan ID
 * @returns Complete allocation details
 */
export declare function getAllocationPlan(sequelize: Sequelize, allocationId: string): Promise<any>;
/**
 * Tracks budget utilization against allocated amounts.
 * Monitors spending patterns and alerts on overages.
 *
 * @param sequelize - Sequelize instance
 * @param budgetId - Budget to track
 * @param periodStart - Tracking period start
 * @param periodEnd - Tracking period end
 * @returns Utilization metrics by department
 */
export declare function trackBudgetUtilization(sequelize: Sequelize, budgetId: string, periodStart: string | Date, periodEnd: string | Date): Promise<any[]>;
/**
 * Creates driver-based forecast linked to KPIs and business metrics.
 * Forecasts revenue/expenses based on operational drivers.
 *
 * @param sequelize - Sequelize instance
 * @param budgetId - Budget to link drivers to
 * @param drivers - Driver definitions with formulas
 * @returns Driver-based forecast model
 */
export declare function createDriverBasedForecast(sequelize: Sequelize, budgetId: string, drivers: Array<{
    name: string;
    accountId: string;
    driverMetric: string;
    formulaType: 'linear' | 'proportional' | 'custom';
    coefficient?: number;
    formula?: string;
}>): Promise<any>;
/**
 * Calculates forecast based on driver values.
 * Updates projections when KPIs change.
 *
 * @param sequelize - Sequelize instance
 * @param forecastModelId - Driver-based model ID
 * @param driverValues - Current/projected driver values
 * @returns Updated forecast
 */
export declare function calculateDriverBasedForecast(sequelize: Sequelize, forecastModelId: string, driverValues: Record<string, number>): Promise<any>;
/**
 * Generates cash flow forecast with timing considerations.
 * Models cash inflows and outflows with payment terms.
 *
 * @param sequelize - Sequelize instance
 * @param budgetId - Budget to base cash flow on
 * @param periods - Number of periods to forecast
 * @param paymentTerms - Default payment terms in days
 * @returns Cash flow projection
 */
export declare function generateCashFlowForecast(sequelize: Sequelize, budgetId: string, periods?: number, paymentTerms?: {
    receivables: number;
    payables: number;
}): Promise<any>;
/**
 * Export all functions for use in NestJS services
 */
export declare const BudgetingForecastingKit: {
    createBudget: typeof createBudget;
    createBudgetFromTemplate: typeof createBudgetFromTemplate;
    addBudgetLineItems: typeof addBudgetLineItems;
    updateBudgetStatus: typeof updateBudgetStatus;
    getBudgetWithDetails: typeof getBudgetWithDetails;
    allocateBudgetTopDown: typeof allocateBudgetTopDown;
    consolidateBudgets: typeof consolidateBudgets;
    calculateBudgetVariance: typeof calculateBudgetVariance;
    decomposeVariance: typeof decomposeVariance;
    analyzeVarianceTrends: typeof analyzeVarianceTrends;
    generateMultiYearForecast: typeof generateMultiYearForecast;
    createRollingForecast: typeof createRollingForecast;
    updateRollingForecast: typeof updateRollingForecast;
    generateSeasonalForecast: typeof generateSeasonalForecast;
    createBudgetScenario: typeof createBudgetScenario;
    compareScenarios: typeof compareScenarios;
    performWhatIfAnalysis: typeof performWhatIfAnalysis;
    runMonteCarloSimulation: typeof runMonteCarloSimulation;
    optimizeResourceAllocation: typeof optimizeResourceAllocation;
    getAllocationPlan: typeof getAllocationPlan;
    trackBudgetUtilization: typeof trackBudgetUtilization;
    createDriverBasedForecast: typeof createDriverBasedForecast;
    calculateDriverBasedForecast: typeof calculateDriverBasedForecast;
    generateCashFlowForecast: typeof generateCashFlowForecast;
};
//# sourceMappingURL=budgeting-forecasting-kit.d.ts.map