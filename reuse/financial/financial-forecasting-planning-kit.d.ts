/**
 * LOC: FINFCST1234567
 * File: /reuse/financial/financial-forecasting-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS financial planning controllers
 *   - Backend forecasting services
 *   - API financial analytics endpoints
 *   - USACE CEFMS budget integration modules
 */
import { Sequelize } from 'sequelize';
interface ForecastContext {
    userId: string;
    organizationId: string;
    departmentId?: string;
    fiscalYear: number;
    fiscalPeriod?: number;
    timestamp: string;
    metadata?: Record<string, any>;
}
interface CashFlowForecast {
    id?: string;
    forecastId: string;
    forecastName: string;
    forecastType: ForecastType;
    period: ForecastPeriod;
    startDate: string;
    endDate: string;
    currency: string;
    granularity: ForecastGranularity;
    projections: CashFlowProjection[];
    assumptions: ForecastAssumption[];
    confidence: ConfidenceLevel;
    confidenceScore: number;
    methodology: ForecastMethodology;
    status: ForecastStatus;
    createdBy: string;
    approvedBy?: string;
    approvedAt?: string;
    notes?: string;
    metadata: Record<string, any>;
}
interface CashFlowProjection {
    period: string;
    periodStart: string;
    periodEnd: string;
    openingBalance: number;
    cashInflows: CashInflow[];
    cashOutflows: CashOutflow[];
    totalInflows: number;
    totalOutflows: number;
    netCashFlow: number;
    closingBalance: number;
    cumulativeCashFlow: number;
    minimumBalance: number;
    maximumBalance: number;
    averageBalance: number;
    variance: number;
    variancePercent: number;
}
interface CashInflow {
    category: InflowCategory;
    subcategory?: string;
    description: string;
    amount: number;
    probability: number;
    timing: string;
    source?: string;
    recurring: boolean;
    confidence: ConfidenceLevel;
}
interface CashOutflow {
    category: OutflowCategory;
    subcategory?: string;
    description: string;
    amount: number;
    probability: number;
    timing: string;
    payee?: string;
    recurring: boolean;
    discretionary: boolean;
    confidence: ConfidenceLevel;
}
interface FinancialProjection {
    id?: string;
    projectionId: string;
    projectionName: string;
    scenarioId?: string;
    projectionType: ProjectionType;
    timeHorizon: TimeHorizon;
    startDate: string;
    endDate: string;
    currency: string;
    periods: ProjectionPeriod[];
    assumptions: ForecastAssumption[];
    keyMetrics: FinancialMetric[];
    status: ForecastStatus;
    confidence: ConfidenceLevel;
    methodology: ForecastMethodology;
    createdBy: string;
    approvedBy?: string;
    approvedAt?: string;
    metadata: Record<string, any>;
}
interface ProjectionPeriod {
    period: string;
    periodStart: string;
    periodEnd: string;
    revenue: RevenueProjection;
    expenses: ExpenseProjection;
    profitability: ProfitabilityMetrics;
    balanceSheet: BalanceSheetProjection;
    cashFlow: CashFlowSummary;
    ratios: FinancialRatios;
    kpis: Record<string, number>;
}
interface RevenueProjection {
    totalRevenue: number;
    revenueByStream: RevenueStream[];
    growthRate: number;
    seasonalFactor: number;
    baseRevenue: number;
    incrementalRevenue: number;
}
interface RevenueStream {
    streamId: string;
    streamName: string;
    category: string;
    amount: number;
    growthRate: number;
    confidence: ConfidenceLevel;
    drivers: RevenueDriver[];
}
interface RevenueDriver {
    driverName: string;
    driverType: string;
    currentValue: number;
    projectedValue: number;
    impact: number;
    elasticity?: number;
}
interface ExpenseProjection {
    totalExpenses: number;
    expenseByCategory: ExpenseCategory[];
    fixedExpenses: number;
    variableExpenses: number;
    discretionaryExpenses: number;
    growthRate: number;
    baseExpenses: number;
    incrementalExpenses: number;
}
interface ExpenseCategory {
    categoryId: string;
    categoryName: string;
    amount: number;
    isFixed: boolean;
    isDiscretionary: boolean;
    growthRate: number;
    costDrivers: CostDriver[];
}
interface CostDriver {
    driverName: string;
    driverType: string;
    currentValue: number;
    projectedValue: number;
    costPerUnit: number;
    totalCost: number;
}
interface ProfitabilityMetrics {
    grossProfit: number;
    grossMargin: number;
    operatingProfit: number;
    operatingMargin: number;
    netProfit: number;
    netMargin: number;
    ebitda: number;
    ebitdaMargin: number;
    ebit: number;
    ebitMargin: number;
}
interface BalanceSheetProjection {
    totalAssets: number;
    currentAssets: number;
    fixedAssets: number;
    totalLiabilities: number;
    currentLiabilities: number;
    longTermLiabilities: number;
    equity: number;
    retainedEarnings: number;
    workingCapital: number;
}
interface CashFlowSummary {
    operatingCashFlow: number;
    investingCashFlow: number;
    financingCashFlow: number;
    netCashFlow: number;
    freeCashFlow: number;
    cashBalance: number;
}
interface FinancialRatios {
    liquidityRatios: LiquidityRatios;
    profitabilityRatios: ProfitabilityRatios;
    efficiencyRatios: EfficiencyRatios;
    leverageRatios: LeverageRatios;
    valuationRatios?: ValuationRatios;
}
interface LiquidityRatios {
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
    workingCapitalRatio: number;
}
interface ProfitabilityRatios {
    returnOnAssets: number;
    returnOnEquity: number;
    returnOnInvestment: number;
    grossProfitMargin: number;
    netProfitMargin: number;
}
interface EfficiencyRatios {
    assetTurnover: number;
    inventoryTurnover: number;
    receivablesTurnover: number;
    payablesTurnover: number;
    daysSalesOutstanding: number;
    daysInventoryOutstanding: number;
}
interface LeverageRatios {
    debtToEquity: number;
    debtToAssets: number;
    equityMultiplier: number;
    interestCoverage: number;
    debtServiceCoverage: number;
}
interface ValuationRatios {
    priceToEarnings?: number;
    priceToBook?: number;
    priceToSales?: number;
    evToEbitda?: number;
}
interface Scenario {
    id?: string;
    scenarioId: string;
    scenarioName: string;
    scenarioType: ScenarioType;
    description: string;
    assumptions: ForecastAssumption[];
    variables: ScenarioVariable[];
    projections: FinancialProjection[];
    comparisonBase?: string;
    probability?: number;
    impact: ImpactLevel;
    status: ScenarioStatus;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    metadata: Record<string, any>;
}
interface ScenarioVariable {
    variableId: string;
    variableName: string;
    variableType: VariableType;
    baseValue: number;
    scenarioValue: number;
    changePercent: number;
    changeAbsolute: number;
    impactOnRevenue?: number;
    impactOnExpenses?: number;
    impactOnCashFlow?: number;
}
interface ForecastAssumption {
    assumptionId: string;
    assumptionName: string;
    category: AssumptionCategory;
    description: string;
    value: number | string;
    unit?: string;
    confidence: ConfidenceLevel;
    source: string;
    dateEstablished: string;
    validityPeriod?: string;
    notes?: string;
}
interface TrendAnalysis {
    analysisId: string;
    analysisName: string;
    metric: string;
    period: string;
    dataPoints: TrendDataPoint[];
    trendType: TrendType;
    trendDirection: TrendDirection;
    trendStrength: number;
    seasonality: SeasonalityInfo;
    forecast: number[];
    confidence: ConfidenceInterval;
    rSquared: number;
    methodology: string;
    metadata: Record<string, any>;
}
interface TrendDataPoint {
    period: string;
    timestamp: string;
    actualValue: number;
    forecastValue?: number;
    movingAverage?: number;
    upperBound?: number;
    lowerBound?: number;
    anomaly: boolean;
    anomalyScore?: number;
}
interface SeasonalityInfo {
    hasSeasonality: boolean;
    seasonalPeriod?: number;
    seasonalIndices?: number[];
    peakPeriods?: string[];
    troughPeriods?: string[];
}
interface ConfidenceInterval {
    lowerBound: number;
    upperBound: number;
    confidenceLevel: number;
    standardError: number;
}
interface SensitivityAnalysis {
    analysisId: string;
    analysisName: string;
    baseScenario: string;
    targetMetric: string;
    targetMetricValue: number;
    variables: SensitivityVariable[];
    results: SensitivityResult[];
    tornadoChart?: TornadoChartData;
    spiderChart?: SpiderChartData;
    createdAt: string;
    metadata: Record<string, any>;
}
interface SensitivityVariable {
    variableName: string;
    baseValue: number;
    variationRange: number[];
    variationPercent: number;
    steps: number;
}
interface SensitivityResult {
    variableName: string;
    variableValue: number;
    targetMetricValue: number;
    changeFromBase: number;
    changePercent: number;
    elasticity: number;
}
interface TornadoChartData {
    variables: string[];
    lowImpact: number[];
    highImpact: number[];
    range: number[];
}
interface SpiderChartData {
    variables: string[];
    scenarios: Array<{
        scenarioName: string;
        values: number[];
    }>;
}
interface MonteCarloSimulation {
    simulationId: string;
    simulationName: string;
    targetMetric: string;
    iterations: number;
    randomVariables: RandomVariable[];
    results: SimulationResults;
    distribution: DistributionData;
    percentiles: PercentileData;
    riskMetrics: RiskMetrics;
    convergence: boolean;
    runTime: number;
    createdAt: string;
    metadata: Record<string, any>;
}
interface RandomVariable {
    variableName: string;
    distributionType: DistributionType;
    mean: number;
    standardDeviation: number;
    min?: number;
    max?: number;
    parameters?: Record<string, number>;
}
interface SimulationResults {
    mean: number;
    median: number;
    mode: number;
    standardDeviation: number;
    variance: number;
    min: number;
    max: number;
    range: number;
    skewness: number;
    kurtosis: number;
    outcomes: number[];
}
interface DistributionData {
    bins: number[];
    frequencies: number[];
    probabilities: number[];
}
interface PercentileData {
    p5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
}
interface RiskMetrics {
    valueAtRisk: number;
    conditionalValueAtRisk: number;
    probabilityOfLoss: number;
    expectedShortfall: number;
    downsideDeviation: number;
    maxDrawdown: number;
}
interface BudgetVsActual {
    comparisonId: string;
    fiscalYear: number;
    fiscalPeriod: number;
    department?: string;
    budgetAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
    forecastAmount?: number;
    forecastVariance?: number;
    ytdBudget: number;
    ytdActual: number;
    ytdVariance: number;
    ytdVariancePercent: number;
    categories: CategoryVariance[];
    flags: VarianceFlag[];
    metadata: Record<string, any>;
}
interface CategoryVariance {
    category: string;
    budgetAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
    explanation?: string;
    actionRequired: boolean;
}
interface VarianceFlag {
    flagType: VarianceFlagType;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category?: string;
    threshold: number;
    actualVariance: number;
    message: string;
    actionRequired: boolean;
    assignedTo?: string;
}
interface FinancialMetric {
    metricId: string;
    metricName: string;
    metricType: MetricType;
    currentValue: number;
    targetValue?: number;
    benchmarkValue?: number;
    unit: string;
    trend: TrendDirection;
    periodOverPeriod?: number;
    yearOverYear?: number;
    forecastValue?: number;
    thresholds?: MetricThresholds;
}
interface MetricThresholds {
    critical: number;
    warning: number;
    target: number;
    stretch: number;
}
interface RollingForecast {
    forecastId: string;
    forecastName: string;
    rollingPeriods: number;
    rollingUnit: TimeUnit;
    currentPeriod: string;
    forecastHorizon: number;
    periods: RollingPeriod[];
    updateFrequency: UpdateFrequency;
    lastUpdated: string;
    nextUpdate: string;
    methodology: ForecastMethodology;
    accuracy: ForecastAccuracy;
    metadata: Record<string, any>;
}
interface RollingPeriod {
    period: string;
    periodStart: string;
    periodEnd: string;
    isActual: boolean;
    isForecast: boolean;
    projectedValue: number;
    actualValue?: number;
    variance?: number;
    confidenceLevel: number;
    assumptions: string[];
}
interface ForecastAccuracy {
    mape: number;
    mae: number;
    rmse: number;
    bias: number;
    trackingSignal: number;
    accuracyRate: number;
}
interface CapitalPlan {
    planId: string;
    planName: string;
    fiscalYear: number;
    totalCapital: number;
    allocatedCapital: number;
    unallocatedCapital: number;
    projects: CapitalProject[];
    priorities: ProjectPriority[];
    constraints: CapitalConstraint[];
    approval: ApprovalInfo;
    status: PlanStatus;
    metadata: Record<string, any>;
}
interface CapitalProject {
    projectId: string;
    projectName: string;
    projectType: string;
    description: string;
    requestedAmount: number;
    approvedAmount: number;
    committedAmount: number;
    spentAmount: number;
    remainingAmount: number;
    startDate: string;
    endDate: string;
    status: ProjectStatus;
    priority: number;
    roi: number;
    paybackPeriod: number;
    npv: number;
    irr: number;
    riskScore: number;
    strategicAlignment: number;
    dependencies: string[];
}
interface ProjectPriority {
    projectId: string;
    rank: number;
    score: number;
    criteria: PriorityCriteria;
    justification: string;
}
interface PriorityCriteria {
    strategicFit: number;
    financialReturn: number;
    riskLevel: number;
    urgency: number;
    resourceAvailability: number;
    stakeholderImpact: number;
}
interface CapitalConstraint {
    constraintType: ConstraintType;
    description: string;
    limitValue: number;
    currentValue: number;
    utilizationPercent: number;
}
interface ApprovalInfo {
    approvalRequired: boolean;
    approvalLevel: string;
    approvedBy?: string[];
    approvedAt?: string;
    status: ApprovalStatus;
    comments?: string;
}
type ForecastType = 'cash_flow' | 'revenue' | 'expense' | 'profit' | 'balance_sheet' | 'comprehensive';
type ForecastPeriod = 'short_term' | 'medium_term' | 'long_term' | 'strategic';
type ForecastGranularity = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
type ForecastMethodology = 'trend_analysis' | 'regression' | 'time_series' | 'causal' | 'judgmental' | 'ensemble';
type ForecastStatus = 'draft' | 'in_review' | 'approved' | 'active' | 'archived' | 'superseded';
type ConfidenceLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
type InflowCategory = 'revenue' | 'investment' | 'financing' | 'asset_sales' | 'grants' | 'other_income';
type OutflowCategory = 'operating_expenses' | 'payroll' | 'capital_expenditure' | 'debt_service' | 'taxes' | 'dividends' | 'other_expenses';
type ProjectionType = 'revenue' | 'expense' | 'profit_loss' | 'balance_sheet' | 'cash_flow' | 'comprehensive';
type TimeHorizon = 'short_term' | 'medium_term' | 'long_term' | 'strategic';
type ScenarioType = 'base' | 'optimistic' | 'pessimistic' | 'most_likely' | 'stress_test' | 'what_if';
type ScenarioStatus = 'draft' | 'active' | 'archived' | 'superseded';
type VariableType = 'revenue_driver' | 'cost_driver' | 'market_factor' | 'operational' | 'external';
type ImpactLevel = 'negligible' | 'low' | 'moderate' | 'high' | 'critical';
type AssumptionCategory = 'economic' | 'market' | 'operational' | 'regulatory' | 'strategic' | 'technical';
type TrendType = 'linear' | 'exponential' | 'logarithmic' | 'polynomial' | 'seasonal' | 'cyclical';
type TrendDirection = 'increasing' | 'decreasing' | 'stable' | 'volatile' | 'cyclical';
type DistributionType = 'normal' | 'lognormal' | 'uniform' | 'triangular' | 'beta' | 'exponential';
type VarianceFlagType = 'favorable_variance' | 'unfavorable_variance' | 'threshold_exceeded' | 'material_variance' | 'trend_deviation';
type MetricType = 'financial' | 'operational' | 'strategic' | 'efficiency' | 'quality' | 'risk';
type TimeUnit = 'day' | 'week' | 'month' | 'quarter' | 'year';
type UpdateFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';
type ProjectStatus = 'proposed' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
type PlanStatus = 'draft' | 'proposed' | 'approved' | 'active' | 'closed';
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'conditional';
type ConstraintType = 'budget' | 'resource' | 'time' | 'regulatory' | 'strategic';
/**
 * Sequelize model for Cash Flow Forecasts with projections and assumptions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CashFlowForecast model
 *
 * @example
 * ```typescript
 * const Forecast = createCashFlowForecastModel(sequelize);
 * const forecast = await Forecast.create({
 *   forecastId: 'FCT-2025-Q1-001',
 *   forecastName: 'Q1 2025 Cash Flow Forecast',
 *   forecastType: 'cash_flow',
 *   startDate: '2025-01-01',
 *   endDate: '2025-03-31'
 * });
 * ```
 */
export declare const createCashFlowForecastModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        forecastId: string;
        forecastName: string;
        forecastType: string;
        period: string;
        startDate: Date;
        endDate: Date;
        currency: string;
        granularity: string;
        projections: CashFlowProjection[];
        assumptions: ForecastAssumption[];
        confidence: string;
        confidenceScore: number;
        methodology: string;
        status: string;
        createdBy: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        notes: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Financial Projections with multi-period analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FinancialProjection model
 *
 * @example
 * ```typescript
 * const Projection = createFinancialProjectionModel(sequelize);
 * const projection = await Projection.create({
 *   projectionId: 'PROJ-2025-001',
 *   projectionName: '5-Year Financial Plan',
 *   projectionType: 'comprehensive',
 *   timeHorizon: 'long_term'
 * });
 * ```
 */
export declare const createFinancialProjectionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        projectionId: string;
        projectionName: string;
        scenarioId: string | null;
        projectionType: string;
        timeHorizon: string;
        startDate: Date;
        endDate: Date;
        currency: string;
        periods: ProjectionPeriod[];
        assumptions: ForecastAssumption[];
        keyMetrics: FinancialMetric[];
        status: string;
        confidence: string;
        methodology: string;
        createdBy: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Scenarios with variable assumptions and comparisons.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Scenario model
 *
 * @example
 * ```typescript
 * const Scenario = createScenarioModel(sequelize);
 * const scenario = await Scenario.create({
 *   scenarioId: 'SCEN-2025-BASE',
 *   scenarioName: 'Base Case Scenario',
 *   scenarioType: 'base',
 *   impact: 'moderate'
 * });
 * ```
 */
export declare const createScenarioModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        scenarioId: string;
        scenarioName: string;
        scenarioType: string;
        description: string;
        assumptions: ForecastAssumption[];
        variables: ScenarioVariable[];
        projectionIds: string[];
        comparisonBase: string | null;
        probability: number | null;
        impact: string;
        status: string;
        createdBy: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Budget vs Actual variance tracking and analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetVsActual model
 *
 * @example
 * ```typescript
 * const BudgetComparison = createBudgetVsActualModel(sequelize);
 * const comparison = await BudgetComparison.create({
 *   comparisonId: 'COMP-2025-Q1',
 *   fiscalYear: 2025,
 *   fiscalPeriod: 1,
 *   budgetAmount: 1000000,
 *   actualAmount: 950000
 * });
 * ```
 */
export declare const createBudgetVsActualModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        comparisonId: string;
        fiscalYear: number;
        fiscalPeriod: number;
        department: string | null;
        budgetAmount: number;
        actualAmount: number;
        variance: number;
        variancePercent: number;
        forecastAmount: number | null;
        forecastVariance: number | null;
        ytdBudget: number;
        ytdActual: number;
        ytdVariance: number;
        ytdVariancePercent: number;
        categories: CategoryVariance[];
        flags: VarianceFlag[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates comprehensive cash flow forecast with multi-period projections.
 *
 * @param {Partial<CashFlowForecast>} forecastData - Forecast data
 * @param {ForecastContext} context - Execution context
 * @returns {Promise<CashFlowForecast>} Created cash flow forecast
 *
 * @example
 * ```typescript
 * const forecast = await createCashFlowForecast({
 *   forecastName: 'Q1 2025 Cash Flow',
 *   forecastType: 'cash_flow',
 *   startDate: '2025-01-01',
 *   endDate: '2025-03-31',
 *   granularity: 'monthly'
 * }, context);
 * ```
 */
export declare function createCashFlowForecast(forecastData: Partial<CashFlowForecast>, context: ForecastContext): Promise<CashFlowForecast>;
/**
 * Generates cash flow projections for specified time periods with inflows and outflows.
 *
 * @param {string} forecastId - Forecast ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {ForecastGranularity} granularity - Time granularity
 * @param {ForecastContext} context - Execution context
 * @returns {Promise<CashFlowProjection[]>} Cash flow projections
 *
 * @example
 * ```typescript
 * const projections = await generateCashFlowProjections(
 *   'FCT-2025-001',
 *   new Date('2025-01-01'),
 *   new Date('2025-03-31'),
 *   'monthly',
 *   context
 * );
 * ```
 */
export declare function generateCashFlowProjections(forecastId: string, startDate: Date, endDate: Date, granularity: ForecastGranularity, context: ForecastContext): Promise<CashFlowProjection[]>;
/**
 * Calculates net cash flow from operating, investing, and financing activities.
 *
 * @param {CashInflow[]} inflows - Cash inflows
 * @param {CashOutflow[]} outflows - Cash outflows
 * @returns {object} Net cash flow calculation
 *
 * @example
 * ```typescript
 * const netCashFlow = calculateNetCashFlow(inflows, outflows);
 * // { totalInflows: 500000, totalOutflows: 400000, netCashFlow: 100000 }
 * ```
 */
export declare function calculateNetCashFlow(inflows: CashInflow[], outflows: CashOutflow[]): {
    totalInflows: number;
    totalOutflows: number;
    netCashFlow: number;
    byCategory: Record<string, number>;
};
/**
 * Identifies cash flow shortfalls and liquidity risks in forecast periods.
 *
 * @param {CashFlowProjection[]} projections - Cash flow projections
 * @param {number} minimumBalanceThreshold - Minimum acceptable balance
 * @returns {Array<{period: string; shortfall: number; severity: string}>} Shortfall alerts
 *
 * @example
 * ```typescript
 * const shortfalls = identifyCashFlowShortfalls(projections, 100000);
 * ```
 */
export declare function identifyCashFlowShortfalls(projections: CashFlowProjection[], minimumBalanceThreshold: number): Array<{
    period: string;
    shortfall: number;
    severity: string;
}>;
/**
 * Optimizes cash flow timing to maximize liquidity and minimize financing costs.
 *
 * @param {CashFlowProjection[]} projections - Cash flow projections
 * @param {object} constraints - Optimization constraints
 * @returns {Promise<CashFlowProjection[]>} Optimized projections
 *
 * @example
 * ```typescript
 * const optimized = await optimizeCashFlowTiming(projections, {
 *   minimumBalance: 100000,
 *   targetBalance: 500000
 * });
 * ```
 */
export declare function optimizeCashFlowTiming(projections: CashFlowProjection[], constraints: {
    minimumBalance: number;
    targetBalance: number;
}): Promise<CashFlowProjection[]>;
/**
 * Forecasts working capital requirements based on operating cycle analysis.
 *
 * @param {number} revenue - Expected revenue
 * @param {number} daysSalesOutstanding - DSO metric
 * @param {number} daysInventoryOutstanding - DIO metric
 * @param {number} daysPayableOutstanding - DPO metric
 * @returns {object} Working capital forecast
 *
 * @example
 * ```typescript
 * const workingCapital = forecastWorkingCapitalRequirements(
 *   5000000,
 *   45,
 *   30,
 *   60
 * );
 * ```
 */
export declare function forecastWorkingCapitalRequirements(revenue: number, daysSalesOutstanding: number, daysInventoryOutstanding: number, daysPayableOutstanding: number): {
    accountsReceivable: number;
    inventory: number;
    accountsPayable: number;
    workingCapital: number;
    cashConversionCycle: number;
};
/**
 * Generates cash flow waterfall chart data for visualization.
 *
 * @param {CashFlowProjection} projection - Cash flow projection
 * @returns {object} Waterfall chart data
 *
 * @example
 * ```typescript
 * const waterfallData = generateCashFlowWaterfall(projection);
 * ```
 */
export declare function generateCashFlowWaterfall(projection: CashFlowProjection): {
    categories: string[];
    values: number[];
    cumulativeValues: number[];
};
/**
 * Compares actual cash flow performance against forecast for accuracy analysis.
 *
 * @param {string} forecastId - Forecast ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<object>} Forecast accuracy metrics
 *
 * @example
 * ```typescript
 * const accuracy = await compareActualVsForecastCashFlow(
 *   'FCT-2025-001',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export declare function compareActualVsForecastCashFlow(forecastId: string, periodStart: Date, periodEnd: Date): Promise<{
    forecastAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
    accuracy: number;
    mape: number;
}>;
/**
 * Creates comprehensive financial projection with revenue, expenses, and profitability.
 *
 * @param {Partial<FinancialProjection>} projectionData - Projection data
 * @param {ForecastContext} context - Execution context
 * @returns {Promise<FinancialProjection>} Created financial projection
 *
 * @example
 * ```typescript
 * const projection = await createFinancialProjection({
 *   projectionName: '5-Year Strategic Plan',
 *   projectionType: 'comprehensive',
 *   timeHorizon: 'long_term',
 *   startDate: '2025-01-01',
 *   endDate: '2029-12-31'
 * }, context);
 * ```
 */
export declare function createFinancialProjection(projectionData: Partial<FinancialProjection>, context: ForecastContext): Promise<FinancialProjection>;
/**
 * Projects revenue growth using multiple methodologies and drivers.
 *
 * @param {number} baseRevenue - Current revenue
 * @param {number} growthRate - Expected growth rate
 * @param {number} periods - Number of periods
 * @param {RevenueDriver[]} drivers - Revenue drivers
 * @returns {RevenueProjection[]} Revenue projections
 *
 * @example
 * ```typescript
 * const revenueProjection = projectRevenueGrowth(5000000, 0.15, 12, drivers);
 * ```
 */
export declare function projectRevenueGrowth(baseRevenue: number, growthRate: number, periods: number, drivers: RevenueDriver[]): RevenueProjection[];
/**
 * Projects expense trends with fixed and variable cost modeling.
 *
 * @param {number} baseExpenses - Current expenses
 * @param {number} fixedExpenseRatio - Fixed expense ratio
 * @param {number} revenueGrowth - Revenue growth rate
 * @param {number} periods - Number of periods
 * @returns {ExpenseProjection[]} Expense projections
 *
 * @example
 * ```typescript
 * const expenseProjection = projectExpenseTrends(3500000, 0.60, 0.15, 12);
 * ```
 */
export declare function projectExpenseTrends(baseExpenses: number, fixedExpenseRatio: number, revenueGrowth: number, periods: number): ExpenseProjection[];
/**
 * Calculates comprehensive profitability metrics from projections.
 *
 * @param {number} revenue - Revenue amount
 * @param {number} expenses - Expense amount
 * @param {number} depreciation - Depreciation amount
 * @param {number} interest - Interest expense
 * @param {number} tax - Tax amount
 * @returns {ProfitabilityMetrics} Profitability metrics
 *
 * @example
 * ```typescript
 * const profitability = calculateProfitabilityMetrics(
 *   5000000,
 *   3500000,
 *   200000,
 *   50000,
 *   300000
 * );
 * ```
 */
export declare function calculateProfitabilityMetrics(revenue: number, expenses: number, depreciation: number, interest: number, tax: number): ProfitabilityMetrics;
/**
 * Projects balance sheet line items for future periods.
 *
 * @param {BalanceSheetProjection} currentBS - Current balance sheet
 * @param {number} assetGrowthRate - Asset growth rate
 * @param {number} liabilityGrowthRate - Liability growth rate
 * @param {number} retainedEarnings - Retained earnings addition
 * @returns {BalanceSheetProjection} Projected balance sheet
 *
 * @example
 * ```typescript
 * const projectedBS = projectBalanceSheet(currentBS, 0.10, 0.08, 500000);
 * ```
 */
export declare function projectBalanceSheet(currentBS: BalanceSheetProjection, assetGrowthRate: number, liabilityGrowthRate: number, retainedEarnings: number): BalanceSheetProjection;
/**
 * Calculates comprehensive financial ratios for analysis.
 *
 * @param {ProjectionPeriod} period - Projection period data
 * @returns {FinancialRatios} Financial ratios
 *
 * @example
 * ```typescript
 * const ratios = calculateFinancialRatios(projectionPeriod);
 * ```
 */
export declare function calculateFinancialRatios(period: ProjectionPeriod): FinancialRatios;
/**
 * Generates multi-year projection summary for executive reporting.
 *
 * @param {FinancialProjection} projection - Financial projection
 * @returns {object} Executive summary
 *
 * @example
 * ```typescript
 * const summary = generateProjectionSummary(projection);
 * ```
 */
export declare function generateProjectionSummary(projection: FinancialProjection): {
    timeHorizon: string;
    periods: number;
    averageRevenue: number;
    revenueGrowthRate: number;
    averageNetMargin: number;
    cumulativeCashFlow: number;
    keyMetrics: Record<string, any>;
};
/**
 * Validates projection assumptions against historical trends and benchmarks.
 *
 * @param {ForecastAssumption[]} assumptions - Projection assumptions
 * @param {object} historicalData - Historical data for validation
 * @returns {Promise<object>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateProjectionAssumptions(assumptions, historicalData);
 * ```
 */
export declare function validateProjectionAssumptions(assumptions: ForecastAssumption[], historicalData: Record<string, any>): Promise<{
    valid: boolean;
    warnings: string[];
    recommendations: string[];
}>;
/**
 * Creates financial scenario with customizable assumptions and variables.
 *
 * @param {Partial<Scenario>} scenarioData - Scenario data
 * @param {ForecastContext} context - Execution context
 * @returns {Promise<Scenario>} Created scenario
 *
 * @example
 * ```typescript
 * const scenario = await createScenario({
 *   scenarioName: 'Economic Downturn',
 *   scenarioType: 'pessimistic',
 *   impact: 'high',
 *   probability: 30
 * }, context);
 * ```
 */
export declare function createScenario(scenarioData: Partial<Scenario>, context: ForecastContext): Promise<Scenario>;
/**
 * Compares multiple scenarios side-by-side for decision analysis.
 *
 * @param {string[]} scenarioIds - Scenario IDs to compare
 * @param {string[]} metrics - Metrics to compare
 * @returns {Promise<object>} Scenario comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareScenarios(
 *   ['SCEN-BASE', 'SCEN-OPT', 'SCEN-PESS'],
 *   ['revenue', 'netProfit', 'cashFlow']
 * );
 * ```
 */
export declare function compareScenarios(scenarioIds: string[], metrics: string[]): Promise<{
    scenarios: Array<{
        scenarioId: string;
        scenarioName: string;
        metrics: Record<string, number>;
    }>;
    differences: Record<string, any>;
    recommendations: string[];
}>;
/**
 * Runs what-if analysis by varying specific input variables.
 *
 * @param {string} baseScenarioId - Base scenario ID
 * @param {ScenarioVariable[]} variables - Variables to modify
 * @param {ForecastContext} context - Execution context
 * @returns {Promise<Scenario>} What-if scenario
 *
 * @example
 * ```typescript
 * const whatIf = await runWhatIfAnalysis('SCEN-BASE', [
 *   { variableName: 'Revenue Growth', baseValue: 15, scenarioValue: 10 }
 * ], context);
 * ```
 */
export declare function runWhatIfAnalysis(baseScenarioId: string, variables: Partial<ScenarioVariable>[], context: ForecastContext): Promise<Scenario>;
/**
 * Generates optimistic scenario with favorable assumptions.
 *
 * @param {string} baseScenarioId - Base scenario ID
 * @param {number} upliftPercent - Uplift percentage for key variables
 * @param {ForecastContext} context - Execution context
 * @returns {Promise<Scenario>} Optimistic scenario
 *
 * @example
 * ```typescript
 * const optimistic = await generateOptimisticScenario('SCEN-BASE', 20, context);
 * ```
 */
export declare function generateOptimisticScenario(baseScenarioId: string, upliftPercent: number, context: ForecastContext): Promise<Scenario>;
/**
 * Generates pessimistic scenario with conservative assumptions.
 *
 * @param {string} baseScenarioId - Base scenario ID
 * @param {number} downwardAdjustment - Downward adjustment percentage
 * @param {ForecastContext} context - Execution context
 * @returns {Promise<Scenario>} Pessimistic scenario
 *
 * @example
 * ```typescript
 * const pessimistic = await generatePessimisticScenario('SCEN-BASE', 25, context);
 * ```
 */
export declare function generatePessimisticScenario(baseScenarioId: string, downwardAdjustment: number, context: ForecastContext): Promise<Scenario>;
/**
 * Performs stress testing on scenarios with extreme conditions.
 *
 * @param {string} scenarioId - Scenario ID to stress test
 * @param {object} stressFactors - Stress factors to apply
 * @param {ForecastContext} context - Execution context
 * @returns {Promise<Scenario>} Stress test scenario
 *
 * @example
 * ```typescript
 * const stressTest = await performStressTesting('SCEN-BASE', {
 *   revenueDecline: 40,
 *   costIncrease: 20
 * }, context);
 * ```
 */
export declare function performStressTesting(scenarioId: string, stressFactors: Record<string, number>, context: ForecastContext): Promise<Scenario>;
/**
 * Calculates weighted probability-adjusted scenario outcomes.
 *
 * @param {Scenario[]} scenarios - Scenarios with probabilities
 * @param {string} metric - Metric to calculate
 * @returns {object} Probability-weighted results
 *
 * @example
 * ```typescript
 * const weighted = calculateWeightedScenarioOutcomes(scenarios, 'netProfit');
 * ```
 */
export declare function calculateWeightedScenarioOutcomes(scenarios: Scenario[], metric: string): {
    weightedAverage: number;
    expectedValue: number;
    standardDeviation: number;
    confidenceInterval: ConfidenceInterval;
};
/**
 * Identifies key scenario drivers with highest impact on outcomes.
 *
 * @param {Scenario} scenario - Scenario to analyze
 * @returns {Array<{driver: string; impact: number; rank: number}>} Key drivers
 *
 * @example
 * ```typescript
 * const keyDrivers = identifyScenarioKeyDrivers(scenario);
 * ```
 */
export declare function identifyScenarioKeyDrivers(scenario: Scenario): Array<{
    driver: string;
    impact: number;
    rank: number;
}>;
/**
 * Analyzes historical trends using time series analysis methods.
 *
 * @param {string} metric - Metric to analyze
 * @param {TrendDataPoint[]} dataPoints - Historical data points
 * @param {string} methodology - Analysis methodology
 * @returns {Promise<TrendAnalysis>} Trend analysis results
 *
 * @example
 * ```typescript
 * const trendAnalysis = await analyzeHistoricalTrends(
 *   'Monthly Revenue',
 *   dataPoints,
 *   'time_series'
 * );
 * ```
 */
export declare function analyzeHistoricalTrends(metric: string, dataPoints: TrendDataPoint[], methodology: string): Promise<TrendAnalysis>;
/**
 * Detects seasonality patterns in financial data.
 *
 * @param {TrendDataPoint[]} dataPoints - Time series data
 * @param {number} periodicity - Expected seasonal period
 * @returns {SeasonalityInfo} Seasonality information
 *
 * @example
 * ```typescript
 * const seasonality = detectSeasonalityPatterns(monthlyData, 12);
 * ```
 */
export declare function detectSeasonalityPatterns(dataPoints: TrendDataPoint[], periodicity: number): SeasonalityInfo;
/**
 * Calculates moving averages for trend smoothing.
 *
 * @param {number[]} values - Data values
 * @param {number} windowSize - Moving average window
 * @returns {number[]} Moving averages
 *
 * @example
 * ```typescript
 * const movingAvg = calculateMovingAverage([100, 110, 105, 120, 115], 3);
 * ```
 */
export declare function calculateMovingAverage(values: number[], windowSize: number): number[];
/**
 * Performs exponential smoothing for forecasting.
 *
 * @param {number[]} values - Historical values
 * @param {number} alpha - Smoothing factor (0-1)
 * @param {number} periods - Forecast periods
 * @returns {object} Smoothed values and forecast
 *
 * @example
 * ```typescript
 * const smoothed = performExponentialSmoothing([100, 110, 105, 120], 0.3, 3);
 * ```
 */
export declare function performExponentialSmoothing(values: number[], alpha: number, periods: number): {
    smoothed: number[];
    forecast: number[];
};
/**
 * Identifies anomalies in financial data using statistical methods.
 *
 * @param {TrendDataPoint[]} dataPoints - Data points to analyze
 * @param {number} standardDeviations - Standard deviation threshold
 * @returns {TrendDataPoint[]} Anomalous data points
 *
 * @example
 * ```typescript
 * const anomalies = identifyAnomalies(dataPoints, 2);
 * ```
 */
export declare function identifyAnomalies(dataPoints: TrendDataPoint[], standardDeviations?: number): TrendDataPoint[];
/**
 * Performs linear regression analysis for trend forecasting.
 *
 * @param {number[]} xValues - Independent variable values
 * @param {number[]} yValues - Dependent variable values
 * @returns {object} Regression coefficients and statistics
 *
 * @example
 * ```typescript
 * const regression = performLinearRegression([1, 2, 3, 4, 5], [100, 120, 110, 140, 150]);
 * ```
 */
export declare function performLinearRegression(xValues: number[], yValues: number[]): {
    slope: number;
    intercept: number;
    rSquared: number;
    predict: (x: number) => number;
};
/**
 * Calculates year-over-year growth rates for metrics.
 *
 * @param {number[]} values - Values by period
 * @param {number} periodsPerYear - Periods per year
 * @returns {number[]} YoY growth rates
 *
 * @example
 * ```typescript
 * const yoyGrowth = calculateYearOverYearGrowth(monthlyRevenue, 12);
 * ```
 */
export declare function calculateYearOverYearGrowth(values: number[], periodsPerYear: number): number[];
/**
 * Generates trend forecast with confidence intervals.
 *
 * @param {TrendAnalysis} trendAnalysis - Trend analysis results
 * @param {number} periods - Forecast periods
 * @returns {TrendDataPoint[]} Forecasted data points
 *
 * @example
 * ```typescript
 * const forecast = generateTrendForecast(trendAnalysis, 12);
 * ```
 */
export declare function generateTrendForecast(trendAnalysis: TrendAnalysis, periods: number): TrendDataPoint[];
/**
 * Performs sensitivity analysis on financial projections.
 *
 * @param {string} projectionId - Projection ID
 * @param {SensitivityVariable[]} variables - Variables to analyze
 * @param {string} targetMetric - Target metric
 * @param {ForecastContext} context - Execution context
 * @returns {Promise<SensitivityAnalysis>} Sensitivity analysis results
 *
 * @example
 * ```typescript
 * const sensitivity = await performSensitivityAnalysis(
 *   'PROJ-2025-001',
 *   [{ variableName: 'Revenue Growth', baseValue: 15, variationRange: [10, 20] }],
 *   'Net Profit',
 *   context
 * );
 * ```
 */
export declare function performSensitivityAnalysis(projectionId: string, variables: SensitivityVariable[], targetMetric: string, context: ForecastContext): Promise<SensitivityAnalysis>;
/**
 * Runs Monte Carlo simulation for risk assessment.
 *
 * @param {string} projectionId - Projection ID
 * @param {RandomVariable[]} variables - Random variables
 * @param {number} iterations - Number of simulations
 * @param {string} targetMetric - Target metric
 * @returns {Promise<MonteCarloSimulation>} Simulation results
 *
 * @example
 * ```typescript
 * const simulation = await runMonteCarloSimulation(
 *   'PROJ-2025-001',
 *   [{ variableName: 'Revenue', distributionType: 'normal', mean: 5000000, standardDeviation: 500000 }],
 *   10000,
 *   'Net Profit'
 * );
 * ```
 */
export declare function runMonteCarloSimulation(projectionId: string, variables: RandomVariable[], iterations: number, targetMetric: string): Promise<MonteCarloSimulation>;
/**
 * Generates tornado chart data for sensitivity visualization.
 *
 * @param {SensitivityAnalysis} analysis - Sensitivity analysis
 * @returns {TornadoChartData} Tornado chart data
 *
 * @example
 * ```typescript
 * const tornadoData = generateTornadoChart(sensitivityAnalysis);
 * ```
 */
export declare function generateTornadoChart(analysis: SensitivityAnalysis): TornadoChartData;
/**
 * Calculates Value at Risk (VaR) for financial projections.
 *
 * @param {number[]} outcomes - Simulation outcomes
 * @param {number} confidenceLevel - Confidence level (e.g., 95, 99)
 * @returns {number} Value at Risk
 *
 * @example
 * ```typescript
 * const var95 = calculateValueAtRisk(simulationOutcomes, 95);
 * ```
 */
export declare function calculateValueAtRisk(outcomes: number[], confidenceLevel: number): number;
/**
 * Calculates Conditional Value at Risk (CVaR/Expected Shortfall).
 *
 * @param {number[]} outcomes - Simulation outcomes
 * @param {number} confidenceLevel - Confidence level
 * @returns {number} Conditional Value at Risk
 *
 * @example
 * ```typescript
 * const cvar95 = calculateConditionalVaR(simulationOutcomes, 95);
 * ```
 */
export declare function calculateConditionalVaR(outcomes: number[], confidenceLevel: number): number;
/**
 * Identifies critical risk factors in projections.
 *
 * @param {SensitivityAnalysis} analysis - Sensitivity analysis
 * @param {number} threshold - Impact threshold
 * @returns {Array<{factor: string; impact: number; severity: string}>} Critical risk factors
 *
 * @example
 * ```typescript
 * const riskFactors = identifyCriticalRiskFactors(sensitivityAnalysis, 0.1);
 * ```
 */
export declare function identifyCriticalRiskFactors(analysis: SensitivityAnalysis, threshold: number): Array<{
    factor: string;
    impact: number;
    severity: string;
}>;
/**
 * Creates budget vs actual comparison for variance analysis.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} budgetAmount - Budget amount
 * @param {number} actualAmount - Actual amount
 * @param {ForecastContext} context - Execution context
 * @returns {Promise<BudgetVsActual>} Budget comparison
 *
 * @example
 * ```typescript
 * const comparison = await createBudgetVsActualComparison(
 *   2025,
 *   1,
 *   1000000,
 *   950000,
 *   context
 * );
 * ```
 */
export declare function createBudgetVsActualComparison(fiscalYear: number, fiscalPeriod: number, budgetAmount: number, actualAmount: number, context: ForecastContext): Promise<BudgetVsActual>;
/**
 * Analyzes budget variance by category for detailed insights.
 *
 * @param {BudgetVsActual} comparison - Budget comparison
 * @returns {CategoryVariance[]} Category variances
 *
 * @example
 * ```typescript
 * const categoryAnalysis = analyzeBudgetVarianceByCategory(comparison);
 * ```
 */
export declare function analyzeBudgetVarianceByCategory(comparison: BudgetVsActual): CategoryVariance[];
/**
 * Flags significant budget variances requiring attention.
 *
 * @param {BudgetVsActual} comparison - Budget comparison
 * @param {number} threshold - Variance threshold percentage
 * @returns {VarianceFlag[]} Variance flags
 *
 * @example
 * ```typescript
 * const flags = flagSignificantVariances(comparison, 10);
 * ```
 */
export declare function flagSignificantVariances(comparison: BudgetVsActual, threshold: number): VarianceFlag[];
/**
 * Generates rolling forecast based on recent actuals and trends.
 *
 * @param {string} forecastId - Forecast ID
 * @param {number} rollingPeriods - Number of rolling periods
 * @param {TimeUnit} rollingUnit - Time unit
 * @param {ForecastContext} context - Execution context
 * @returns {Promise<RollingForecast>} Rolling forecast
 *
 * @example
 * ```typescript
 * const rollingForecast = await generateRollingForecast('FCT-2025-001', 12, 'month', context);
 * ```
 */
export declare function generateRollingForecast(forecastId: string, rollingPeriods: number, rollingUnit: TimeUnit, context: ForecastContext): Promise<RollingForecast>;
/**
 * Calculates forecast accuracy metrics (MAPE, MAE, RMSE).
 *
 * @param {number[]} actuals - Actual values
 * @param {number[]} forecasts - Forecasted values
 * @returns {ForecastAccuracy} Accuracy metrics
 *
 * @example
 * ```typescript
 * const accuracy = calculateForecastAccuracy(actualValues, forecastedValues);
 * ```
 */
export declare function calculateForecastAccuracy(actuals: number[], forecasts: number[]): ForecastAccuracy;
/**
 * Creates capital expenditure plan with project prioritization.
 *
 * @param {Partial<CapitalPlan>} planData - Capital plan data
 * @param {ForecastContext} context - Execution context
 * @returns {Promise<CapitalPlan>} Capital plan
 *
 * @example
 * ```typescript
 * const capPlan = await createCapitalPlan({
 *   planName: 'FY2025 Capital Plan',
 *   fiscalYear: 2025,
 *   totalCapital: 5000000
 * }, context);
 * ```
 */
export declare function createCapitalPlan(planData: Partial<CapitalPlan>, context: ForecastContext): Promise<CapitalPlan>;
/**
 * Generates comprehensive financial dashboard metrics.
 *
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {ForecastContext} context - Execution context
 * @returns {Promise<object>} Dashboard metrics
 *
 * @example
 * ```typescript
 * const dashboard = await generateFinancialDashboard(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   context
 * );
 * ```
 */
export declare function generateFinancialDashboard(periodStart: Date, periodEnd: Date, context: ForecastContext): Promise<{
    period: {
        start: string;
        end: string;
    };
    revenue: {
        actual: number;
        budget: number;
        forecast: number;
        variance: number;
    };
    expenses: {
        actual: number;
        budget: number;
        forecast: number;
        variance: number;
    };
    cashFlow: {
        opening: number;
        closing: number;
        netChange: number;
    };
    profitability: ProfitabilityMetrics;
    kpis: FinancialMetric[];
}>;
export {};
//# sourceMappingURL=financial-forecasting-planning-kit.d.ts.map