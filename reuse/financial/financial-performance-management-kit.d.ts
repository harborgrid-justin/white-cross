/**
 * LOC: FINPERF1234567
 * File: /reuse/financial/financial-performance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Financial performance controllers
 *   - KPI dashboard services
 *   - Analytics and reporting modules
 *   - Executive dashboard components
 */
/**
 * File: /reuse/financial/financial-performance-management-kit.ts
 * Locator: WC-FIN-PERFMGMT-001
 * Purpose: USACE CEFMS-Level Financial Performance Management - KPIs, balanced scorecard, profitability analysis, benchmarking, financial metrics
 *
 * Upstream: Independent financial performance utility module
 * Downstream: ../backend/*, Financial controllers, Analytics services, Dashboard components, Reporting modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Decimal.js
 * Exports: 45+ utility functions for financial KPIs, balanced scorecard, ROI analysis, profitability metrics, benchmarking, variance analysis
 *
 * LLM Context: Enterprise-grade financial performance management competing with USACE CEFMS.
 * Provides comprehensive KPI tracking, balanced scorecard implementation, financial ratios, profitability analysis,
 * ROI/ROA/ROE calculations, budget variance tracking, cost allocation, revenue analysis, margin analysis,
 * benchmarking against industry standards, trend analysis, forecasting, scenario planning, performance scorecards,
 * executive dashboards, financial health indicators, operational efficiency metrics, and strategic alignment tools.
 */
import { Sequelize } from 'sequelize';
interface KPIDefinition {
    id: string;
    name: string;
    category: 'financial' | 'operational' | 'customer' | 'growth' | 'efficiency';
    formula: string;
    unit: 'currency' | 'percentage' | 'ratio' | 'count' | 'days';
    targetValue: number;
    thresholdGreen: number;
    thresholdYellow: number;
    thresholdRed: number;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
    dataSource: string;
    owner: string;
}
interface KPIValue {
    kpiId: string;
    period: string;
    actualValue: number;
    targetValue: number;
    variance: number;
    variancePercentage: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    trend: 'improving' | 'stable' | 'declining';
    metadata?: Record<string, any>;
}
interface BalancedScorecardPerspective {
    perspective: 'financial' | 'customer' | 'internal' | 'learning';
    objectives: ScorecardObjective[];
    weight: number;
    score: number;
    status: 'on-track' | 'at-risk' | 'off-track';
}
interface ScorecardObjective {
    id: string;
    name: string;
    description: string;
    measures: string[];
    targets: Record<string, number>;
    initiatives: string[];
    owner: string;
    weight: number;
    score: number;
}
interface FinancialRatios {
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
    workingCapital: number;
    grossProfitMargin: number;
    operatingProfitMargin: number;
    netProfitMargin: number;
    returnOnAssets: number;
    returnOnEquity: number;
    returnOnInvestment: number;
    assetTurnover: number;
    inventoryTurnover: number;
    receivablesTurnover: number;
    payablesTurnover: number;
    cashConversionCycle: number;
    debtToEquity: number;
    debtToAssets: number;
    equityMultiplier: number;
    interestCoverage: number;
    debtServiceCoverage: number;
}
interface ProfitabilityAnalysis {
    grossProfit: number;
    grossProfitMargin: number;
    operatingProfit: number;
    operatingMargin: number;
    netProfit: number;
    netMargin: number;
    ebitda: number;
    ebitdaMargin: number;
    ebit: number;
    ebitMargin: number;
    contributionMargin: number;
    breakEvenPoint: number;
    marginOfSafety: number;
}
interface VarianceAnalysis {
    budgetAmount: number;
    actualAmount: number;
    variance: number;
    variancePercentage: number;
    varianceType: 'favorable' | 'unfavorable';
    category: string;
    period: string;
    explanation?: string;
    actionItems?: string[];
}
interface BenchmarkData {
    metric: string;
    ownValue: number;
    industryAverage: number;
    industryMedian: number;
    industryTopQuartile: number;
    industryBottomQuartile: number;
    percentile: number;
    gap: number;
    ranking: number;
}
interface TrendAnalysis {
    metric: string;
    historicalData: {
        period: string;
        value: number;
    }[];
    trendLine: number[];
    movingAverage: number[];
    growthRate: number;
    volatility: number;
    seasonality: number[];
    forecast: {
        period: string;
        value: number;
        confidence: number;
    }[];
}
interface PerformanceScorecard {
    entity: string;
    period: string;
    overallScore: number;
    financialScore: number;
    operationalScore: number;
    customerScore: number;
    growthScore: number;
    rating: 'excellent' | 'good' | 'satisfactory' | 'needs-improvement' | 'poor';
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
}
interface CashFlowMetrics {
    operatingCashFlow: number;
    investingCashFlow: number;
    financingCashFlow: number;
    freeCashFlow: number;
    cashFlowMargin: number;
    cashFlowToDebt: number;
    cashFlowCoverage: number;
    cashFlowPerShare: number;
    cashConversionRate: number;
}
interface WorkingCapitalMetrics {
    currentAssets: number;
    currentLiabilities: number;
    workingCapital: number;
    workingCapitalRatio: number;
    workingCapitalTurnover: number;
    daysWorkingCapital: number;
    netWorkingCapital: number;
    operatingWorkingCapital: number;
}
interface DuPontAnalysis {
    returnOnEquity: number;
    netProfitMargin: number;
    assetTurnover: number;
    equityMultiplier: number;
    financialLeverage: number;
    components: {
        profitability: number;
        efficiency: number;
        leverage: number;
    };
}
/**
 * Sequelize model for KPI Definitions with targets and thresholds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} KPIDefinition model
 *
 * @example
 * ```typescript
 * const KPIDefinition = createKPIDefinitionModel(sequelize);
 * const kpi = await KPIDefinition.create({
 *   name: 'Net Profit Margin',
 *   category: 'financial',
 *   formula: '(Net Income / Revenue) * 100',
 *   unit: 'percentage',
 *   targetValue: 15.0,
 *   thresholdGreen: 15.0,
 *   thresholdYellow: 10.0,
 *   thresholdRed: 5.0,
 *   frequency: 'monthly'
 * });
 * ```
 */
export declare const createKPIDefinitionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        kpiId: string;
        name: string;
        description: string;
        category: string;
        formula: string;
        unit: string;
        targetValue: number;
        thresholdGreen: number;
        thresholdYellow: number;
        thresholdRed: number;
        frequency: string;
        dataSource: string;
        calculationMethod: string;
        owner: string;
        department: string;
        isActive: boolean;
        priority: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for KPI Values with actual vs target tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} KPIValue model
 *
 * @example
 * ```typescript
 * const KPIValue = createKPIValueModel(sequelize);
 * const value = await KPIValue.create({
 *   kpiId: 'NPM_001',
 *   period: '2025-01',
 *   actualValue: 16.5,
 *   targetValue: 15.0,
 *   variance: 1.5,
 *   variancePercentage: 10.0,
 *   status: 'excellent'
 * });
 * ```
 */
export declare const createKPIValueModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        kpiId: string;
        period: string;
        periodStart: Date;
        periodEnd: Date;
        actualValue: number;
        targetValue: number;
        variance: number;
        variancePercentage: number;
        status: string;
        trend: string;
        previousPeriodValue: number | null;
        yearOverYearValue: number | null;
        percentileRank: number | null;
        notes: string | null;
        calculatedBy: string;
        verifiedBy: string | null;
        verifiedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Balanced Scorecard tracking strategic objectives.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BalancedScorecard model
 *
 * @example
 * ```typescript
 * const Scorecard = createBalancedScorecardModel(sequelize);
 * const card = await Scorecard.create({
 *   entityId: 'ORG_001',
 *   period: '2025-Q1',
 *   perspective: 'financial',
 *   objectives: [...],
 *   overallScore: 85.5
 * });
 * ```
 */
export declare const createBalancedScorecardModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        entityId: string;
        entityType: string;
        period: string;
        periodStart: Date;
        periodEnd: Date;
        perspective: string;
        objectives: ScorecardObjective[];
        overallScore: number;
        financialScore: number;
        customerScore: number;
        internalScore: number;
        learningScore: number;
        status: string;
        strengths: string[];
        improvements: string[];
        initiatives: string[];
        owner: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        publishedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Financial Benchmark data against industry standards.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FinancialBenchmark model
 *
 * @example
 * ```typescript
 * const Benchmark = createFinancialBenchmarkModel(sequelize);
 * const data = await Benchmark.create({
 *   metric: 'Net Profit Margin',
 *   industry: 'Healthcare',
 *   ownValue: 16.5,
 *   industryAverage: 14.2,
 *   percentile: 75
 * });
 * ```
 */
export declare const createFinancialBenchmarkModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        metricId: string;
        metricName: string;
        industry: string;
        subIndustry: string | null;
        region: string;
        period: string;
        ownValue: number;
        industryAverage: number;
        industryMedian: number;
        industryTopQuartile: number;
        industryBottomQuartile: number;
        industryMin: number;
        industryMax: number;
        percentile: number;
        gap: number;
        gapPercentage: number;
        ranking: number | null;
        totalEntities: number;
        sampleSize: number;
        dataSource: string;
        lastUpdated: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Calculate KPI value based on formula and source data.
 *
 * @param {KPIDefinition} kpi - KPI definition
 * @param {Record<string, number>} sourceData - Source data values
 * @param {string} period - Period identifier
 * @returns {Promise<KPIValue>} Calculated KPI value
 *
 * @example
 * ```typescript
 * const kpiValue = await calculateKPIValue(
 *   kpiDefinition,
 *   { revenue: 1000000, netIncome: 150000 },
 *   '2025-01'
 * );
 * // Returns: { actualValue: 15.0, variance: 0, status: 'excellent', ... }
 * ```
 */
export declare function calculateKPIValue(kpi: KPIDefinition, sourceData: Record<string, number>, period: string): Promise<KPIValue>;
/**
 * Evaluate KPI formula with provided data context.
 *
 * @param {string} formula - Mathematical formula
 * @param {Record<string, number>} context - Variable values
 * @returns {number} Calculated result
 *
 * @example
 * ```typescript
 * const result = evaluateKPIFormula(
 *   '(netIncome / revenue) * 100',
 *   { netIncome: 150000, revenue: 1000000 }
 * );
 * // Returns: 15.0
 * ```
 */
export declare function evaluateKPIFormula(formula: string, context: Record<string, number>): number;
/**
 * Track KPI trend compared to previous periods.
 *
 * @param {string} kpiId - KPI identifier
 * @param {KPIValue[]} historicalValues - Historical KPI values
 * @returns {Promise<TrendAnalysis>} Trend analysis result
 *
 * @example
 * ```typescript
 * const trend = await trackKPITrend('NPM_001', historicalValues);
 * // Returns: { trendLine: [...], movingAverage: [...], growthRate: 5.2, ... }
 * ```
 */
export declare function trackKPITrend(kpiId: string, historicalValues: KPIValue[]): Promise<TrendAnalysis>;
/**
 * Generate KPI dashboard for period with status indicators.
 *
 * @param {string} period - Period identifier
 * @param {string[]} kpiIds - KPI identifiers to include
 * @returns {Promise<Record<string, KPIValue>>} KPI dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateKPIDashboard('2025-01', ['NPM_001', 'ROI_001']);
 * // Returns: { NPM_001: {...}, ROI_001: {...} }
 * ```
 */
export declare function generateKPIDashboard(period: string, kpiIds: string[]): Promise<Record<string, KPIValue>>;
/**
 * Set KPI targets for upcoming period based on historical performance.
 *
 * @param {string} kpiId - KPI identifier
 * @param {string} targetPeriod - Target period
 * @param {number} targetValue - New target value
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setKPITarget('NPM_001', '2025-02', 16.0);
 * ```
 */
export declare function setKPITarget(kpiId: string, targetPeriod: string, targetValue: number): Promise<void>;
/**
 * Generate KPI variance report with explanations.
 *
 * @param {string} period - Period identifier
 * @param {number} varianceThreshold - Minimum variance % to include
 * @returns {Promise<VarianceAnalysis[]>} Variance analysis results
 *
 * @example
 * ```typescript
 * const variances = await generateKPIVarianceReport('2025-01', 10);
 * // Returns: [{ variance: 15%, varianceType: 'favorable', ... }, ...]
 * ```
 */
export declare function generateKPIVarianceReport(period: string, varianceThreshold: number): Promise<VarianceAnalysis[]>;
/**
 * Compare KPI performance across multiple entities.
 *
 * @param {string} kpiId - KPI identifier
 * @param {string[]} entityIds - Entity identifiers
 * @param {string} period - Period identifier
 * @returns {Promise<Record<string, KPIValue>>} Entity comparison data
 *
 * @example
 * ```typescript
 * const comparison = await compareKPIAcrossEntities('NPM_001', ['ORG_A', 'ORG_B'], '2025-01');
 * ```
 */
export declare function compareKPIAcrossEntities(kpiId: string, entityIds: string[], period: string): Promise<Record<string, KPIValue>>;
/**
 * Alert on KPI threshold breaches with notifications.
 *
 * @param {KPIValue} kpiValue - KPI value to check
 * @param {string[]} recipients - Notification recipients
 * @returns {Promise<boolean>} Whether alert was triggered
 *
 * @example
 * ```typescript
 * const alerted = await alertOnKPIBreach(kpiValue, ['cfo@example.com']);
 * ```
 */
export declare function alertOnKPIBreach(kpiValue: KPIValue, recipients: string[]): Promise<boolean>;
/**
 * Generate executive KPI summary for board reporting.
 *
 * @param {string} period - Period identifier
 * @param {string} executiveLevel - Executive level (board, c-suite, vp)
 * @returns {Promise<Record<string, any>>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateExecutiveKPISummary('2025-Q1', 'board');
 * ```
 */
export declare function generateExecutiveKPISummary(period: string, executiveLevel: string): Promise<Record<string, any>>;
/**
 * Forecast future KPI values using historical trends.
 *
 * @param {string} kpiId - KPI identifier
 * @param {KPIValue[]} historicalValues - Historical values
 * @param {number} periodsAhead - Number of periods to forecast
 * @returns {Promise<KPIValue[]>} Forecasted values
 *
 * @example
 * ```typescript
 * const forecast = await forecastKPIValues('NPM_001', historicalValues, 6);
 * ```
 */
export declare function forecastKPIValues(kpiId: string, historicalValues: KPIValue[], periodsAhead: number): Promise<KPIValue[]>;
/**
 * Create balanced scorecard for organization with four perspectives.
 *
 * @param {string} entityId - Entity identifier
 * @param {string} period - Period identifier
 * @param {BalancedScorecardPerspective[]} perspectives - Scorecard perspectives
 * @returns {Promise<PerformanceScorecard>} Created scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await createBalancedScorecard('ORG_001', '2025-Q1', perspectives);
 * ```
 */
export declare function createBalancedScorecard(entityId: string, period: string, perspectives: BalancedScorecardPerspective[]): Promise<PerformanceScorecard>;
/**
 * Score financial perspective objectives (revenue, profitability, ROI).
 *
 * @param {ScorecardObjective[]} objectives - Financial objectives
 * @param {Record<string, number>} actualValues - Actual metric values
 * @returns {Promise<number>} Financial perspective score
 *
 * @example
 * ```typescript
 * const score = await scoreFinancialPerspective(objectives, { revenue: 1000000, roi: 25 });
 * ```
 */
export declare function scoreFinancialPerspective(objectives: ScorecardObjective[], actualValues: Record<string, number>): Promise<number>;
/**
 * Score customer perspective objectives (satisfaction, retention, acquisition).
 *
 * @param {ScorecardObjective[]} objectives - Customer objectives
 * @param {Record<string, number>} actualValues - Actual metric values
 * @returns {Promise<number>} Customer perspective score
 *
 * @example
 * ```typescript
 * const score = await scoreCustomerPerspective(objectives, { nps: 45, retention: 92 });
 * ```
 */
export declare function scoreCustomerPerspective(objectives: ScorecardObjective[], actualValues: Record<string, number>): Promise<number>;
/**
 * Score internal process perspective (efficiency, quality, innovation).
 *
 * @param {ScorecardObjective[]} objectives - Internal process objectives
 * @param {Record<string, number>} actualValues - Actual metric values
 * @returns {Promise<number>} Internal perspective score
 *
 * @example
 * ```typescript
 * const score = await scoreInternalPerspective(objectives, { cycleTime: 3.2, defectRate: 0.5 });
 * ```
 */
export declare function scoreInternalPerspective(objectives: ScorecardObjective[], actualValues: Record<string, number>): Promise<number>;
/**
 * Score learning and growth perspective (employee, systems, culture).
 *
 * @param {ScorecardObjective[]} objectives - Learning objectives
 * @param {Record<string, number>} actualValues - Actual metric values
 * @returns {Promise<number>} Learning perspective score
 *
 * @example
 * ```typescript
 * const score = await scoreLearningPerspective(objectives, { training: 40, engagement: 78 });
 * ```
 */
export declare function scoreLearningPerspective(objectives: ScorecardObjective[], actualValues: Record<string, number>): Promise<number>;
/**
 * Calculate individual objective score against targets.
 *
 * @param {ScorecardObjective} objective - Scorecard objective
 * @param {Record<string, number>} actualValues - Actual values
 * @returns {number} Objective score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateObjectiveScore(objective, { revenue: 1000000 });
 * ```
 */
export declare function calculateObjectiveScore(objective: ScorecardObjective, actualValues: Record<string, number>): number;
/**
 * Link scorecard objectives to strategic initiatives.
 *
 * @param {string} objectiveId - Objective identifier
 * @param {string[]} initiativeIds - Initiative identifiers
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await linkObjectiveToInitiatives('OBJ_001', ['INIT_001', 'INIT_002']);
 * ```
 */
export declare function linkObjectiveToInitiatives(objectiveId: string, initiativeIds: string[]): Promise<void>;
/**
 * Generate strategy map showing cause-effect relationships.
 *
 * @param {BalancedScorecardPerspective[]} perspectives - All perspectives
 * @returns {Promise<Record<string, any>>} Strategy map structure
 *
 * @example
 * ```typescript
 * const strategyMap = await generateStrategyMap(perspectives);
 * ```
 */
export declare function generateStrategyMap(perspectives: BalancedScorecardPerspective[]): Promise<Record<string, any>>;
/**
 * Calculate comprehensive financial ratios for period.
 *
 * @param {Record<string, number>} financialData - Financial statement data
 * @returns {Promise<FinancialRatios>} All financial ratios
 *
 * @example
 * ```typescript
 * const ratios = await calculateFinancialRatios({
 *   currentAssets: 500000,
 *   currentLiabilities: 300000,
 *   totalAssets: 2000000,
 *   totalLiabilities: 800000,
 *   revenue: 3000000,
 *   netIncome: 450000
 * });
 * ```
 */
export declare function calculateFinancialRatios(financialData: Record<string, number>): Promise<FinancialRatios>;
/**
 * Calculate Return on Investment (ROI) for project or initiative.
 *
 * @param {number} gain - Total gain from investment
 * @param {number} cost - Total cost of investment
 * @returns {number} ROI percentage
 *
 * @example
 * ```typescript
 * const roi = calculateROI(150000, 100000);
 * // Returns: 50 (50% ROI)
 * ```
 */
export declare function calculateROI(gain: number, cost: number): number;
/**
 * Calculate Return on Assets (ROA) to measure asset efficiency.
 *
 * @param {number} netIncome - Net income
 * @param {number} totalAssets - Total assets
 * @returns {number} ROA percentage
 *
 * @example
 * ```typescript
 * const roa = calculateROA(450000, 2000000);
 * // Returns: 22.5 (22.5% ROA)
 * ```
 */
export declare function calculateROA(netIncome: number, totalAssets: number): number;
/**
 * Calculate Return on Equity (ROE) to measure shareholder return.
 *
 * @param {number} netIncome - Net income
 * @param {number} shareholderEquity - Shareholder equity
 * @returns {number} ROE percentage
 *
 * @example
 * ```typescript
 * const roe = calculateROE(450000, 1200000);
 * // Returns: 37.5 (37.5% ROE)
 * ```
 */
export declare function calculateROE(netIncome: number, shareholderEquity: number): number;
/**
 * Calculate EBITDA (Earnings Before Interest, Taxes, Depreciation, Amortization).
 *
 * @param {Record<string, number>} financialData - Financial data
 * @returns {number} EBITDA value
 *
 * @example
 * ```typescript
 * const ebitda = calculateEBITDA({
 *   netIncome: 450000,
 *   interest: 50000,
 *   taxes: 100000,
 *   depreciation: 75000,
 *   amortization: 25000
 * });
 * // Returns: 700000
 * ```
 */
export declare function calculateEBITDA(financialData: Record<string, number>): number;
/**
 * Calculate working capital and working capital ratio.
 *
 * @param {number} currentAssets - Current assets
 * @param {number} currentLiabilities - Current liabilities
 * @returns {Promise<WorkingCapitalMetrics>} Working capital metrics
 *
 * @example
 * ```typescript
 * const wcMetrics = await calculateWorkingCapital(500000, 300000);
 * // Returns: { workingCapital: 200000, workingCapitalRatio: 1.67, ... }
 * ```
 */
export declare function calculateWorkingCapital(currentAssets: number, currentLiabilities: number): Promise<WorkingCapitalMetrics>;
/**
 * Calculate cash flow metrics including free cash flow.
 *
 * @param {Record<string, number>} cashFlowData - Cash flow statement data
 * @returns {Promise<CashFlowMetrics>} Cash flow metrics
 *
 * @example
 * ```typescript
 * const cfMetrics = await calculateCashFlowMetrics({
 *   operatingCashFlow: 500000,
 *   capitalExpenditures: 150000,
 *   revenue: 3000000
 * });
 * ```
 */
export declare function calculateCashFlowMetrics(cashFlowData: Record<string, number>): Promise<CashFlowMetrics>;
/**
 * Perform DuPont analysis to decompose ROE.
 *
 * @param {Record<string, number>} financialData - Financial data
 * @returns {Promise<DuPontAnalysis>} DuPont analysis breakdown
 *
 * @example
 * ```typescript
 * const dupont = await performDuPontAnalysis({
 *   netIncome: 450000,
 *   revenue: 3000000,
 *   totalAssets: 2000000,
 *   totalEquity: 1200000
 * });
 * ```
 */
export declare function performDuPontAnalysis(financialData: Record<string, number>): Promise<DuPontAnalysis>;
/**
 * Calculate liquidity ratios (current, quick, cash).
 *
 * @param {Record<string, number>} balanceSheetData - Balance sheet data
 * @returns {Record<string, number>} Liquidity ratios
 *
 * @example
 * ```typescript
 * const liquidity = calculateLiquidityRatios({
 *   currentAssets: 500000,
 *   currentLiabilities: 300000,
 *   inventory: 100000,
 *   cash: 150000
 * });
 * ```
 */
export declare function calculateLiquidityRatios(balanceSheetData: Record<string, number>): Record<string, number>;
/**
 * Calculate efficiency ratios (turnover, conversion cycles).
 *
 * @param {Record<string, number>} financialData - Financial data
 * @returns {Record<string, number>} Efficiency ratios
 *
 * @example
 * ```typescript
 * const efficiency = calculateEfficiencyRatios({
 *   revenue: 3000000,
 *   totalAssets: 2000000,
 *   inventory: 100000,
 *   costOfGoodsSold: 1800000
 * });
 * ```
 */
export declare function calculateEfficiencyRatios(financialData: Record<string, number>): Record<string, number>;
/**
 * Analyze profitability across multiple dimensions.
 *
 * @param {Record<string, number>} financialData - Financial data
 * @returns {Promise<ProfitabilityAnalysis>} Profitability analysis
 *
 * @example
 * ```typescript
 * const profitability = await analyzeProfitability({
 *   revenue: 3000000,
 *   costOfGoodsSold: 1800000,
 *   operatingExpenses: 600000,
 *   taxes: 100000
 * });
 * ```
 */
export declare function analyzeProfitability(financialData: Record<string, number>): Promise<ProfitabilityAnalysis>;
/**
 * Calculate gross profit and gross margin.
 *
 * @param {number} revenue - Total revenue
 * @param {number} costOfGoodsSold - COGS
 * @returns {Record<string, number>} Gross profit metrics
 *
 * @example
 * ```typescript
 * const gross = calculateGrossProfit(3000000, 1800000);
 * // Returns: { grossProfit: 1200000, grossMargin: 40 }
 * ```
 */
export declare function calculateGrossProfit(revenue: number, costOfGoodsSold: number): Record<string, number>;
/**
 * Calculate operating profit and operating margin.
 *
 * @param {number} grossProfit - Gross profit
 * @param {number} operatingExpenses - Operating expenses
 * @returns {Record<string, number>} Operating profit metrics
 *
 * @example
 * ```typescript
 * const operating = calculateOperatingProfit(1200000, 600000);
 * // Returns: { operatingProfit: 600000, operatingMargin: ... }
 * ```
 */
export declare function calculateOperatingProfit(grossProfit: number, operatingExpenses: number): Record<string, number>;
/**
 * Calculate net profit and net profit margin.
 *
 * @param {number} operatingProfit - Operating profit
 * @param {number} nonOperatingItems - Non-operating income/expenses
 * @param {number} taxes - Tax expenses
 * @param {number} revenue - Total revenue
 * @returns {Record<string, number>} Net profit metrics
 *
 * @example
 * ```typescript
 * const net = calculateNetProfit(600000, -50000, 100000, 3000000);
 * // Returns: { netProfit: 450000, netMargin: 15 }
 * ```
 */
export declare function calculateNetProfit(operatingProfit: number, nonOperatingItems: number, taxes: number, revenue: number): Record<string, number>;
/**
 * Analyze profit margins by product line or category.
 *
 * @param {Record<string, Record<string, number>>} productData - Product financial data
 * @returns {Promise<Record<string, ProfitabilityAnalysis>>} Product profitability
 *
 * @example
 * ```typescript
 * const margins = await analyzeProductMargins({
 *   'Product A': { revenue: 1000000, cogs: 600000, opex: 200000 },
 *   'Product B': { revenue: 2000000, cogs: 1200000, opex: 400000 }
 * });
 * ```
 */
export declare function analyzeProductMargins(productData: Record<string, Record<string, number>>): Promise<Record<string, ProfitabilityAnalysis>>;
/**
 * Calculate break-even point and margin of safety.
 *
 * @param {number} fixedCosts - Total fixed costs
 * @param {number} pricePerUnit - Price per unit
 * @param {number} variableCostPerUnit - Variable cost per unit
 * @param {number} currentUnits - Current units sold
 * @returns {Record<string, number>} Break-even analysis
 *
 * @example
 * ```typescript
 * const breakeven = calculateBreakEvenPoint(500000, 100, 60, 15000);
 * // Returns: { breakEvenUnits: 12500, marginOfSafety: 2500, ... }
 * ```
 */
export declare function calculateBreakEvenPoint(fixedCosts: number, pricePerUnit: number, variableCostPerUnit: number, currentUnits: number): Record<string, number>;
/**
 * Perform contribution margin analysis.
 *
 * @param {number} revenue - Total revenue
 * @param {number} variableCosts - Variable costs
 * @returns {Record<string, number>} Contribution margin metrics
 *
 * @example
 * ```typescript
 * const contribution = performContributionMarginAnalysis(3000000, 1800000);
 * // Returns: { contributionMargin: 1200000, contributionMarginRatio: 40 }
 * ```
 */
export declare function performContributionMarginAnalysis(revenue: number, variableCosts: number): Record<string, number>;
/**
 * Compare financial metrics against industry benchmarks.
 *
 * @param {Record<string, number>} ownMetrics - Own financial metrics
 * @param {string} industry - Industry classification
 * @param {string} period - Period identifier
 * @returns {Promise<BenchmarkData[]>} Benchmark comparison results
 *
 * @example
 * ```typescript
 * const benchmarks = await benchmarkAgainstIndustry(
 *   { netProfitMargin: 16.5, roe: 25.0 },
 *   'Healthcare',
 *   '2025-Q1'
 * );
 * ```
 */
export declare function benchmarkAgainstIndustry(ownMetrics: Record<string, number>, industry: string, period: string): Promise<BenchmarkData[]>;
/**
 * Calculate percentile ranking for metric value.
 *
 * @param {number} value - Metric value
 * @param {Record<string, number>} distribution - Distribution statistics
 * @returns {number} Percentile rank (0-100)
 *
 * @example
 * ```typescript
 * const percentile = calculatePercentile(16.5, {
 *   bottomQuartile: 9.2,
 *   median: 13.8,
 *   topQuartile: 18.5
 * });
 * ```
 */
export declare function calculatePercentile(value: number, distribution: Record<string, number>): number;
/**
 * Compare performance across multiple time periods.
 *
 * @param {string} metricId - Metric identifier
 * @param {string[]} periods - Period identifiers
 * @returns {Promise<TrendAnalysis>} Period-over-period comparison
 *
 * @example
 * ```typescript
 * const comparison = await comparePeriodsOverTime('NPM_001', [
 *   '2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4', '2025-Q1'
 * ]);
 * ```
 */
export declare function comparePeriodsOverTime(metricId: string, periods: string[]): Promise<TrendAnalysis>;
/**
 * Identify top and bottom performers in peer group.
 *
 * @param {string} metricId - Metric identifier
 * @param {Record<string, number>} peerData - Peer metric values
 * @param {number} topN - Number of top performers to return
 * @returns {Record<string, string[]>} Top and bottom performers
 *
 * @example
 * ```typescript
 * const performers = identifyTopBottomPerformers('ROE', {
 *   'Org A': 25.0,
 *   'Org B': 18.5,
 *   'Org C': 22.3,
 *   'Org D': 15.2
 * }, 2);
 * ```
 */
export declare function identifyTopBottomPerformers(metricId: string, peerData: Record<string, number>, topN?: number): Record<string, string[]>;
/**
 * Calculate competitive position score based on multiple metrics.
 *
 * @param {Record<string, number>} ownMetrics - Own metrics
 * @param {Record<string, Record<string, number>>} competitorMetrics - Competitor metrics
 * @param {Record<string, number>} weights - Metric weights
 * @returns {Promise<number>} Competitive position score (0-100)
 *
 * @example
 * ```typescript
 * const score = await calculateCompetitivePosition(
 *   { roe: 25.0, npm: 16.5 },
 *   { 'Comp A': { roe: 22.0, npm: 14.5 }, 'Comp B': { roe: 20.0, npm: 15.0 } },
 *   { roe: 0.6, npm: 0.4 }
 * );
 * ```
 */
export declare function calculateCompetitivePosition(ownMetrics: Record<string, number>, competitorMetrics: Record<string, Record<string, number>>, weights: Record<string, number>): Promise<number>;
/**
 * Perform budget variance analysis for period.
 *
 * @param {Record<string, number>} budgetData - Budget values
 * @param {Record<string, number>} actualData - Actual values
 * @param {string} period - Period identifier
 * @returns {Promise<VarianceAnalysis[]>} Variance analysis results
 *
 * @example
 * ```typescript
 * const variances = await performBudgetVarianceAnalysis(
 *   { revenue: 3000000, expenses: 2400000 },
 *   { revenue: 3150000, expenses: 2500000 },
 *   '2025-01'
 * );
 * ```
 */
export declare function performBudgetVarianceAnalysis(budgetData: Record<string, number>, actualData: Record<string, number>, period: string): Promise<VarianceAnalysis[]>;
/**
 * Analyze revenue and cost trends over time.
 *
 * @param {Array<{period: string, revenue: number, costs: number}>} historicalData - Historical data
 * @returns {Promise<Record<string, TrendAnalysis>>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeRevenueAndCostTrends([
 *   { period: '2024-Q1', revenue: 2800000, costs: 2200000 },
 *   { period: '2024-Q2', revenue: 2900000, costs: 2300000 }
 * ]);
 * ```
 */
export declare function analyzeRevenueAndCostTrends(historicalData: Array<{
    period: string;
    revenue: number;
    costs: number;
}>): Promise<Record<string, TrendAnalysis>>;
/**
 * Calculate moving averages for trend smoothing.
 *
 * @param {number[]} values - Data values
 * @param {number} period - Moving average period
 * @returns {number[]} Moving average values
 *
 * @example
 * ```typescript
 * const ma = calculateMovingAverage([100, 110, 105, 115, 120, 125], 3);
 * // Returns: [105, 110, 113.33, 120]
 * ```
 */
export declare function calculateMovingAverage(values: number[], period: number): number[];
/**
 * Calculate linear trend line for forecasting.
 *
 * @param {number[]} values - Historical values
 * @returns {number[]} Trend line values
 *
 * @example
 * ```typescript
 * const trend = calculateLinearTrend([100, 110, 105, 115, 120, 125]);
 * ```
 */
export declare function calculateLinearTrend(values: number[]): number[];
/**
 * Perform year-over-year and quarter-over-quarter analysis.
 *
 * @param {Record<string, number>} currentPeriod - Current period data
 * @param {Record<string, number>} priorPeriod - Prior period data
 * @param {Record<string, number>} yearAgoPeriod - Year ago period data
 * @returns {Record<string, any>} Period comparison analysis
 *
 * @example
 * ```typescript
 * const analysis = performYoYandQoQAnalysis(
 *   { revenue: 3150000 },
 *   { revenue: 3000000 },
 *   { revenue: 2800000 }
 * );
 * ```
 */
export declare function performYoYandQoQAnalysis(currentPeriod: Record<string, number>, priorPeriod: Record<string, number>, yearAgoPeriod: Record<string, number>): Record<string, any>;
/**
 * Calculate growth rate from time series data.
 *
 * @param {number[]} values - Time series values
 * @returns {number} Compound annual growth rate (CAGR)
 */
export declare function calculateGrowthRate(values: number[]): number;
/**
 * Calculate standard deviation for volatility analysis.
 *
 * @param {number[]} values - Data values
 * @returns {number} Standard deviation
 */
export declare function calculateStandardDeviation(values: number[]): number;
export {};
//# sourceMappingURL=financial-performance-management-kit.d.ts.map