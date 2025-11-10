"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFinancialBenchmarkModel = exports.createBalancedScorecardModel = exports.createKPIValueModel = exports.createKPIDefinitionModel = void 0;
exports.calculateKPIValue = calculateKPIValue;
exports.evaluateKPIFormula = evaluateKPIFormula;
exports.trackKPITrend = trackKPITrend;
exports.generateKPIDashboard = generateKPIDashboard;
exports.setKPITarget = setKPITarget;
exports.generateKPIVarianceReport = generateKPIVarianceReport;
exports.compareKPIAcrossEntities = compareKPIAcrossEntities;
exports.alertOnKPIBreach = alertOnKPIBreach;
exports.generateExecutiveKPISummary = generateExecutiveKPISummary;
exports.forecastKPIValues = forecastKPIValues;
exports.createBalancedScorecard = createBalancedScorecard;
exports.scoreFinancialPerspective = scoreFinancialPerspective;
exports.scoreCustomerPerspective = scoreCustomerPerspective;
exports.scoreInternalPerspective = scoreInternalPerspective;
exports.scoreLearningPerspective = scoreLearningPerspective;
exports.calculateObjectiveScore = calculateObjectiveScore;
exports.linkObjectiveToInitiatives = linkObjectiveToInitiatives;
exports.generateStrategyMap = generateStrategyMap;
exports.calculateFinancialRatios = calculateFinancialRatios;
exports.calculateROI = calculateROI;
exports.calculateROA = calculateROA;
exports.calculateROE = calculateROE;
exports.calculateEBITDA = calculateEBITDA;
exports.calculateWorkingCapital = calculateWorkingCapital;
exports.calculateCashFlowMetrics = calculateCashFlowMetrics;
exports.performDuPontAnalysis = performDuPontAnalysis;
exports.calculateLiquidityRatios = calculateLiquidityRatios;
exports.calculateEfficiencyRatios = calculateEfficiencyRatios;
exports.analyzeProfitability = analyzeProfitability;
exports.calculateGrossProfit = calculateGrossProfit;
exports.calculateOperatingProfit = calculateOperatingProfit;
exports.calculateNetProfit = calculateNetProfit;
exports.analyzeProductMargins = analyzeProductMargins;
exports.calculateBreakEvenPoint = calculateBreakEvenPoint;
exports.performContributionMarginAnalysis = performContributionMarginAnalysis;
exports.benchmarkAgainstIndustry = benchmarkAgainstIndustry;
exports.calculatePercentile = calculatePercentile;
exports.comparePeriodsOverTime = comparePeriodsOverTime;
exports.identifyTopBottomPerformers = identifyTopBottomPerformers;
exports.calculateCompetitivePosition = calculateCompetitivePosition;
exports.performBudgetVarianceAnalysis = performBudgetVarianceAnalysis;
exports.analyzeRevenueAndCostTrends = analyzeRevenueAndCostTrends;
exports.calculateMovingAverage = calculateMovingAverage;
exports.calculateLinearTrend = calculateLinearTrend;
exports.performYoYandQoQAnalysis = performYoYandQoQAnalysis;
exports.calculateGrowthRate = calculateGrowthRate;
exports.calculateStandardDeviation = calculateStandardDeviation;
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
const sequelize_1 = require("sequelize");
const decimal_js_1 = __importDefault(require("decimal.js"));
// ============================================================================
// SEQUELIZE MODELS (1-4)
// ============================================================================
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
const createKPIDefinitionModel = (sequelize) => {
    class KPIDefinition extends sequelize_1.Model {
    }
    KPIDefinition.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        kpiId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique KPI identifier',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'KPI name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'KPI description and purpose',
        },
        category: {
            type: sequelize_1.DataTypes.ENUM('financial', 'operational', 'customer', 'growth', 'efficiency'),
            allowNull: false,
            comment: 'KPI category',
        },
        formula: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Calculation formula',
        },
        unit: {
            type: sequelize_1.DataTypes.ENUM('currency', 'percentage', 'ratio', 'count', 'days'),
            allowNull: false,
            comment: 'Unit of measurement',
        },
        targetValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Target value to achieve',
        },
        thresholdGreen: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Green threshold (excellent)',
        },
        thresholdYellow: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Yellow threshold (warning)',
        },
        thresholdRed: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Red threshold (critical)',
        },
        frequency: {
            type: sequelize_1.DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual'),
            allowNull: false,
            comment: 'Measurement frequency',
        },
        dataSource: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Data source for calculation',
        },
        calculationMethod: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Detailed calculation methodology',
        },
        owner: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'KPI owner/responsible party',
        },
        department: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Department responsible',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether KPI is currently active',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            comment: 'Priority level (1-10)',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'kpi_definitions',
        timestamps: true,
        indexes: [
            { fields: ['kpiId'], unique: true },
            { fields: ['category'] },
            { fields: ['frequency'] },
            { fields: ['owner'] },
            { fields: ['isActive'] },
            { fields: ['priority'] },
        ],
    });
    return KPIDefinition;
};
exports.createKPIDefinitionModel = createKPIDefinitionModel;
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
const createKPIValueModel = (sequelize) => {
    class KPIValue extends sequelize_1.Model {
    }
    KPIValue.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        kpiId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Reference to KPI definition',
        },
        period: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Period identifier (YYYY-MM, Q1-2025, etc.)',
        },
        periodStart: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Period start date',
        },
        periodEnd: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Period end date',
        },
        actualValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Actual measured value',
        },
        targetValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Target value for period',
        },
        variance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Variance from target (actual - target)',
        },
        variancePercentage: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Variance percentage',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('excellent', 'good', 'warning', 'critical'),
            allowNull: false,
            comment: 'Status based on thresholds',
        },
        trend: {
            type: sequelize_1.DataTypes.ENUM('improving', 'stable', 'declining'),
            allowNull: false,
            defaultValue: 'stable',
            comment: 'Trend compared to previous period',
        },
        previousPeriodValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: true,
            comment: 'Value from previous period',
        },
        yearOverYearValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: true,
            comment: 'Value from same period last year',
        },
        percentileRank: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Percentile rank (0-100)',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Analysis notes',
        },
        calculatedBy: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'User who calculated the value',
        },
        verifiedBy: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'User who verified the value',
        },
        verifiedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Verification timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata and drill-down data',
        },
    }, {
        sequelize,
        tableName: 'kpi_values',
        timestamps: true,
        indexes: [
            { fields: ['kpiId', 'period'], unique: true },
            { fields: ['kpiId'] },
            { fields: ['period'] },
            { fields: ['periodStart'] },
            { fields: ['status'] },
            { fields: ['trend'] },
            { fields: ['verifiedAt'] },
        ],
    });
    return KPIValue;
};
exports.createKPIValueModel = createKPIValueModel;
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
const createBalancedScorecardModel = (sequelize) => {
    class BalancedScorecard extends sequelize_1.Model {
    }
    BalancedScorecard.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        entityId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Entity (organization, department, project) ID',
        },
        entityType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Type of entity',
        },
        period: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Period identifier',
        },
        periodStart: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Period start date',
        },
        periodEnd: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Period end date',
        },
        perspective: {
            type: sequelize_1.DataTypes.ENUM('financial', 'customer', 'internal', 'learning', 'overall'),
            allowNull: false,
            comment: 'Scorecard perspective',
        },
        objectives: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Strategic objectives and measures',
        },
        overallScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Overall scorecard score (0-100)',
        },
        financialScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Financial perspective score',
        },
        customerScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Customer perspective score',
        },
        internalScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Internal processes score',
        },
        learningScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Learning & growth score',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('on-track', 'at-risk', 'off-track', 'completed'),
            allowNull: false,
            defaultValue: 'on-track',
            comment: 'Overall status',
        },
        strengths: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Key strengths identified',
        },
        improvements: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Areas for improvement',
        },
        initiatives: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Strategic initiatives',
        },
        owner: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Scorecard owner',
        },
        reviewedBy: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Reviewer',
        },
        reviewedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Review timestamp',
        },
        publishedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Publication timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'balanced_scorecards',
        timestamps: true,
        indexes: [
            { fields: ['entityId', 'period'], unique: true },
            { fields: ['entityId'] },
            { fields: ['period'] },
            { fields: ['perspective'] },
            { fields: ['status'] },
            { fields: ['owner'] },
            { fields: ['publishedAt'] },
        ],
    });
    return BalancedScorecard;
};
exports.createBalancedScorecardModel = createBalancedScorecardModel;
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
const createFinancialBenchmarkModel = (sequelize) => {
    class FinancialBenchmark extends sequelize_1.Model {
    }
    FinancialBenchmark.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        metricId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Metric identifier',
        },
        metricName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Metric name',
        },
        industry: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Industry classification',
        },
        subIndustry: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Sub-industry classification',
        },
        region: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Geographic region',
        },
        period: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Period identifier',
        },
        ownValue: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Own organization value',
        },
        industryAverage: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Industry average',
        },
        industryMedian: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Industry median',
        },
        industryTopQuartile: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: '75th percentile',
        },
        industryBottomQuartile: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: '25th percentile',
        },
        industryMin: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Industry minimum',
        },
        industryMax: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Industry maximum',
        },
        percentile: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Percentile rank (0-100)',
        },
        gap: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Gap from industry average',
        },
        gapPercentage: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
            comment: 'Gap percentage',
        },
        ranking: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Ranking position if available',
        },
        totalEntities: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Total entities in comparison',
        },
        sampleSize: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Sample size for statistics',
        },
        dataSource: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Data source',
        },
        lastUpdated: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Last update timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'financial_benchmarks',
        timestamps: true,
        indexes: [
            { fields: ['metricId', 'industry', 'period'], unique: true },
            { fields: ['metricId'] },
            { fields: ['industry'] },
            { fields: ['period'] },
            { fields: ['percentile'] },
            { fields: ['lastUpdated'] },
        ],
    });
    return FinancialBenchmark;
};
exports.createFinancialBenchmarkModel = createFinancialBenchmarkModel;
// ============================================================================
// KPI MANAGEMENT FUNCTIONS (1-10)
// ============================================================================
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
async function calculateKPIValue(kpi, sourceData, period) {
    try {
        // Evaluate formula with source data
        const actualValue = evaluateKPIFormula(kpi.formula, sourceData);
        const variance = actualValue - kpi.targetValue;
        const variancePercentage = (variance / kpi.targetValue) * 100;
        // Determine status based on thresholds
        let status;
        if (actualValue >= kpi.thresholdGreen) {
            status = 'excellent';
        }
        else if (actualValue >= kpi.thresholdYellow) {
            status = 'good';
        }
        else if (actualValue >= kpi.thresholdRed) {
            status = 'warning';
        }
        else {
            status = 'critical';
        }
        return {
            kpiId: kpi.id,
            period,
            actualValue,
            targetValue: kpi.targetValue,
            variance,
            variancePercentage,
            status,
            trend: 'stable',
            metadata: { sourceData, calculatedAt: new Date().toISOString() },
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate KPI value: ${error.message}`);
    }
}
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
function evaluateKPIFormula(formula, context) {
    try {
        // Replace variables in formula with actual values
        let evaluableFormula = formula;
        Object.entries(context).forEach(([key, value]) => {
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            evaluableFormula = evaluableFormula.replace(regex, value.toString());
        });
        // Use Decimal.js for precise calculations
        const result = new decimal_js_1.default(eval(evaluableFormula));
        return result.toNumber();
    }
    catch (error) {
        throw new Error(`Failed to evaluate formula: ${error.message}`);
    }
}
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
async function trackKPITrend(kpiId, historicalValues) {
    try {
        const sortedValues = historicalValues.sort((a, b) => a.period.localeCompare(b.period));
        const historicalData = sortedValues.map((v) => ({
            period: v.period,
            value: v.actualValue,
        }));
        const values = sortedValues.map((v) => v.actualValue);
        const trendLine = calculateLinearTrend(values);
        const movingAverage = calculateMovingAverage(values, 3);
        const growthRate = calculateGrowthRate(values);
        const volatility = calculateStandardDeviation(values);
        return {
            metric: kpiId,
            historicalData,
            trendLine,
            movingAverage,
            growthRate,
            volatility,
            seasonality: [],
            forecast: [],
        };
    }
    catch (error) {
        throw new Error(`Failed to track KPI trend: ${error.message}`);
    }
}
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
async function generateKPIDashboard(period, kpiIds) {
    try {
        const dashboard = {};
        for (const kpiId of kpiIds) {
            // Fetch KPI value for period (mock implementation)
            const kpiValue = {
                kpiId,
                period,
                actualValue: 0,
                targetValue: 0,
                variance: 0,
                variancePercentage: 0,
                status: 'good',
                trend: 'stable',
            };
            dashboard[kpiId] = kpiValue;
        }
        return dashboard;
    }
    catch (error) {
        throw new Error(`Failed to generate KPI dashboard: ${error.message}`);
    }
}
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
async function setKPITarget(kpiId, targetPeriod, targetValue) {
    try {
        // Update KPI target in database (mock implementation)
        console.log(`Setting KPI ${kpiId} target for ${targetPeriod} to ${targetValue}`);
    }
    catch (error) {
        throw new Error(`Failed to set KPI target: ${error.message}`);
    }
}
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
async function generateKPIVarianceReport(period, varianceThreshold) {
    try {
        const variances = [];
        // Mock implementation
        const variance = {
            budgetAmount: 100000,
            actualAmount: 115000,
            variance: 15000,
            variancePercentage: 15,
            varianceType: 'favorable',
            category: 'Revenue',
            period,
            explanation: 'Higher than expected sales volume',
            actionItems: ['Continue current sales strategy', 'Increase inventory levels'],
        };
        if (Math.abs(variance.variancePercentage) >= varianceThreshold) {
            variances.push(variance);
        }
        return variances;
    }
    catch (error) {
        throw new Error(`Failed to generate variance report: ${error.message}`);
    }
}
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
async function compareKPIAcrossEntities(kpiId, entityIds, period) {
    try {
        const comparison = {};
        for (const entityId of entityIds) {
            // Fetch entity KPI value (mock implementation)
            comparison[entityId] = {
                kpiId,
                period,
                actualValue: 0,
                targetValue: 0,
                variance: 0,
                variancePercentage: 0,
                status: 'good',
                trend: 'stable',
            };
        }
        return comparison;
    }
    catch (error) {
        throw new Error(`Failed to compare KPIs: ${error.message}`);
    }
}
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
async function alertOnKPIBreach(kpiValue, recipients) {
    try {
        if (kpiValue.status === 'critical' || kpiValue.status === 'warning') {
            // Send notification (mock implementation)
            console.log(`Alert: KPI ${kpiValue.kpiId} breached threshold`);
            console.log(`Status: ${kpiValue.status}, Recipients: ${recipients.join(', ')}`);
            return true;
        }
        return false;
    }
    catch (error) {
        throw new Error(`Failed to alert on KPI breach: ${error.message}`);
    }
}
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
async function generateExecutiveKPISummary(period, executiveLevel) {
    try {
        return {
            period,
            executiveLevel,
            overallHealth: 'good',
            criticalKPIs: [],
            topPerformers: [],
            needsAttention: [],
            strategicInsights: [],
            recommendations: [],
            nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
    }
    catch (error) {
        throw new Error(`Failed to generate executive KPI summary: ${error.message}`);
    }
}
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
async function forecastKPIValues(kpiId, historicalValues, periodsAhead) {
    try {
        const values = historicalValues.map((v) => v.actualValue);
        const trend = calculateLinearTrend(values);
        const lastValue = values[values.length - 1];
        const trendSlope = trend.length > 1 ? trend[trend.length - 1] - trend[trend.length - 2] : 0;
        const forecasted = [];
        for (let i = 1; i <= periodsAhead; i++) {
            const forecastedValue = lastValue + (trendSlope * i);
            forecasted.push({
                kpiId,
                period: `forecast-${i}`,
                actualValue: forecastedValue,
                targetValue: 0,
                variance: 0,
                variancePercentage: 0,
                status: 'good',
                trend: 'stable',
            });
        }
        return forecasted;
    }
    catch (error) {
        throw new Error(`Failed to forecast KPI values: ${error.message}`);
    }
}
// ============================================================================
// BALANCED SCORECARD FUNCTIONS (11-18)
// ============================================================================
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
async function createBalancedScorecard(entityId, period, perspectives) {
    try {
        const financialScore = perspectives.find((p) => p.perspective === 'financial')?.score || 0;
        const customerScore = perspectives.find((p) => p.perspective === 'customer')?.score || 0;
        const internalScore = perspectives.find((p) => p.perspective === 'internal')?.score || 0;
        const learningScore = perspectives.find((p) => p.perspective === 'learning')?.score || 0;
        const overallScore = (financialScore + customerScore + internalScore + learningScore) / 4;
        let rating;
        if (overallScore >= 90)
            rating = 'excellent';
        else if (overallScore >= 75)
            rating = 'good';
        else if (overallScore >= 60)
            rating = 'satisfactory';
        else if (overallScore >= 40)
            rating = 'needs-improvement';
        else
            rating = 'poor';
        return {
            entity: entityId,
            period,
            overallScore,
            financialScore,
            operationalScore: internalScore,
            customerScore,
            growthScore: learningScore,
            rating,
            strengths: [],
            weaknesses: [],
            recommendations: [],
        };
    }
    catch (error) {
        throw new Error(`Failed to create balanced scorecard: ${error.message}`);
    }
}
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
async function scoreFinancialPerspective(objectives, actualValues) {
    try {
        let totalScore = 0;
        let totalWeight = 0;
        for (const objective of objectives) {
            const objectiveScore = calculateObjectiveScore(objective, actualValues);
            totalScore += objectiveScore * objective.weight;
            totalWeight += objective.weight;
        }
        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }
    catch (error) {
        throw new Error(`Failed to score financial perspective: ${error.message}`);
    }
}
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
async function scoreCustomerPerspective(objectives, actualValues) {
    try {
        let totalScore = 0;
        let totalWeight = 0;
        for (const objective of objectives) {
            const objectiveScore = calculateObjectiveScore(objective, actualValues);
            totalScore += objectiveScore * objective.weight;
            totalWeight += objective.weight;
        }
        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }
    catch (error) {
        throw new Error(`Failed to score customer perspective: ${error.message}`);
    }
}
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
async function scoreInternalPerspective(objectives, actualValues) {
    try {
        let totalScore = 0;
        let totalWeight = 0;
        for (const objective of objectives) {
            const objectiveScore = calculateObjectiveScore(objective, actualValues);
            totalScore += objectiveScore * objective.weight;
            totalWeight += objective.weight;
        }
        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }
    catch (error) {
        throw new Error(`Failed to score internal perspective: ${error.message}`);
    }
}
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
async function scoreLearningPerspective(objectives, actualValues) {
    try {
        let totalScore = 0;
        let totalWeight = 0;
        for (const objective of objectives) {
            const objectiveScore = calculateObjectiveScore(objective, actualValues);
            totalScore += objectiveScore * objective.weight;
            totalWeight += objective.weight;
        }
        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }
    catch (error) {
        throw new Error(`Failed to score learning perspective: ${error.message}`);
    }
}
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
function calculateObjectiveScore(objective, actualValues) {
    try {
        let totalScore = 0;
        let count = 0;
        for (const measure of objective.measures) {
            const actual = actualValues[measure];
            const target = objective.targets[measure];
            if (actual !== undefined && target !== undefined) {
                const achievementRate = (actual / target) * 100;
                totalScore += Math.min(achievementRate, 100);
                count++;
            }
        }
        return count > 0 ? totalScore / count : 0;
    }
    catch (error) {
        throw new Error(`Failed to calculate objective score: ${error.message}`);
    }
}
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
async function linkObjectiveToInitiatives(objectiveId, initiativeIds) {
    try {
        // Link objectives to initiatives in database (mock implementation)
        console.log(`Linking objective ${objectiveId} to initiatives: ${initiativeIds.join(', ')}`);
    }
    catch (error) {
        throw new Error(`Failed to link objective to initiatives: ${error.message}`);
    }
}
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
async function generateStrategyMap(perspectives) {
    try {
        return {
            perspectives: perspectives.map((p) => ({
                name: p.perspective,
                objectives: p.objectives.map((o) => o.name),
                status: p.status,
            })),
            relationships: [],
            criticalPath: [],
        };
    }
    catch (error) {
        throw new Error(`Failed to generate strategy map: ${error.message}`);
    }
}
// ============================================================================
// FINANCIAL RATIOS & METRICS (19-28)
// ============================================================================
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
async function calculateFinancialRatios(financialData) {
    try {
        const { currentAssets = 0, currentLiabilities = 0, cash = 0, marketableSecurities = 0, accountsReceivable = 0, inventory = 0, totalAssets = 0, totalLiabilities = 0, totalEquity = 0, revenue = 0, grossProfit = 0, operatingIncome = 0, netIncome = 0, costOfGoodsSold = 0, accountsPayable = 0, interestExpense = 0, ebit = 0, } = financialData;
        return {
            // Liquidity Ratios
            currentRatio: currentLiabilities > 0 ? currentAssets / currentLiabilities : 0,
            quickRatio: currentLiabilities > 0
                ? (currentAssets - inventory) / currentLiabilities
                : 0,
            cashRatio: currentLiabilities > 0
                ? (cash + marketableSecurities) / currentLiabilities
                : 0,
            workingCapital: currentAssets - currentLiabilities,
            // Profitability Ratios
            grossProfitMargin: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
            operatingProfitMargin: revenue > 0 ? (operatingIncome / revenue) * 100 : 0,
            netProfitMargin: revenue > 0 ? (netIncome / revenue) * 100 : 0,
            returnOnAssets: totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0,
            returnOnEquity: totalEquity > 0 ? (netIncome / totalEquity) * 100 : 0,
            returnOnInvestment: totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0,
            // Efficiency Ratios
            assetTurnover: totalAssets > 0 ? revenue / totalAssets : 0,
            inventoryTurnover: inventory > 0 ? costOfGoodsSold / inventory : 0,
            receivablesTurnover: accountsReceivable > 0 ? revenue / accountsReceivable : 0,
            payablesTurnover: accountsPayable > 0 ? costOfGoodsSold / accountsPayable : 0,
            cashConversionCycle: 0, // Calculated separately
            // Leverage Ratios
            debtToEquity: totalEquity > 0 ? totalLiabilities / totalEquity : 0,
            debtToAssets: totalAssets > 0 ? totalLiabilities / totalAssets : 0,
            equityMultiplier: totalEquity > 0 ? totalAssets / totalEquity : 0,
            interestCoverage: interestExpense > 0 ? ebit / interestExpense : 0,
            debtServiceCoverage: 0, // Calculated separately
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate financial ratios: ${error.message}`);
    }
}
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
function calculateROI(gain, cost) {
    try {
        if (cost === 0) {
            throw new Error('Investment cost cannot be zero');
        }
        return ((gain - cost) / cost) * 100;
    }
    catch (error) {
        throw new Error(`Failed to calculate ROI: ${error.message}`);
    }
}
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
function calculateROA(netIncome, totalAssets) {
    try {
        if (totalAssets === 0) {
            throw new Error('Total assets cannot be zero');
        }
        return (netIncome / totalAssets) * 100;
    }
    catch (error) {
        throw new Error(`Failed to calculate ROA: ${error.message}`);
    }
}
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
function calculateROE(netIncome, shareholderEquity) {
    try {
        if (shareholderEquity === 0) {
            throw new Error('Shareholder equity cannot be zero');
        }
        return (netIncome / shareholderEquity) * 100;
    }
    catch (error) {
        throw new Error(`Failed to calculate ROE: ${error.message}`);
    }
}
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
function calculateEBITDA(financialData) {
    try {
        const { netIncome = 0, interest = 0, taxes = 0, depreciation = 0, amortization = 0, } = financialData;
        return netIncome + interest + taxes + depreciation + amortization;
    }
    catch (error) {
        throw new Error(`Failed to calculate EBITDA: ${error.message}`);
    }
}
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
async function calculateWorkingCapital(currentAssets, currentLiabilities) {
    try {
        const workingCapital = currentAssets - currentLiabilities;
        const workingCapitalRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
        return {
            currentAssets,
            currentLiabilities,
            workingCapital,
            workingCapitalRatio,
            workingCapitalTurnover: 0,
            daysWorkingCapital: 0,
            netWorkingCapital: workingCapital,
            operatingWorkingCapital: workingCapital,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate working capital: ${error.message}`);
    }
}
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
async function calculateCashFlowMetrics(cashFlowData) {
    try {
        const { operatingCashFlow = 0, investingCashFlow = 0, financingCashFlow = 0, capitalExpenditures = 0, revenue = 0, totalDebt = 0, sharesOutstanding = 1, } = cashFlowData;
        const freeCashFlow = operatingCashFlow - capitalExpenditures;
        return {
            operatingCashFlow,
            investingCashFlow,
            financingCashFlow,
            freeCashFlow,
            cashFlowMargin: revenue > 0 ? (operatingCashFlow / revenue) * 100 : 0,
            cashFlowToDebt: totalDebt > 0 ? operatingCashFlow / totalDebt : 0,
            cashFlowCoverage: 0,
            cashFlowPerShare: freeCashFlow / sharesOutstanding,
            cashConversionRate: revenue > 0 ? (operatingCashFlow / revenue) * 100 : 0,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate cash flow metrics: ${error.message}`);
    }
}
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
async function performDuPontAnalysis(financialData) {
    try {
        const { netIncome = 0, revenue = 0, totalAssets = 0, totalEquity = 0, } = financialData;
        const netProfitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;
        const assetTurnover = totalAssets > 0 ? revenue / totalAssets : 0;
        const equityMultiplier = totalEquity > 0 ? totalAssets / totalEquity : 0;
        const returnOnEquity = totalEquity > 0 ? (netIncome / totalEquity) * 100 : 0;
        return {
            returnOnEquity,
            netProfitMargin,
            assetTurnover,
            equityMultiplier,
            financialLeverage: equityMultiplier,
            components: {
                profitability: netProfitMargin,
                efficiency: assetTurnover,
                leverage: equityMultiplier,
            },
        };
    }
    catch (error) {
        throw new Error(`Failed to perform DuPont analysis: ${error.message}`);
    }
}
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
function calculateLiquidityRatios(balanceSheetData) {
    try {
        const { currentAssets = 0, currentLiabilities = 0, inventory = 0, cash = 0, marketableSecurities = 0, } = balanceSheetData;
        return {
            currentRatio: currentLiabilities > 0 ? currentAssets / currentLiabilities : 0,
            quickRatio: currentLiabilities > 0
                ? (currentAssets - inventory) / currentLiabilities
                : 0,
            cashRatio: currentLiabilities > 0
                ? (cash + marketableSecurities) / currentLiabilities
                : 0,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate liquidity ratios: ${error.message}`);
    }
}
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
function calculateEfficiencyRatios(financialData) {
    try {
        const { revenue = 0, totalAssets = 0, inventory = 0, costOfGoodsSold = 0, accountsReceivable = 0, accountsPayable = 0, } = financialData;
        const inventoryTurnover = inventory > 0 ? costOfGoodsSold / inventory : 0;
        const daysInventory = inventoryTurnover > 0 ? 365 / inventoryTurnover : 0;
        const receivablesTurnover = accountsReceivable > 0 ? revenue / accountsReceivable : 0;
        const daysReceivables = receivablesTurnover > 0 ? 365 / receivablesTurnover : 0;
        const payablesTurnover = accountsPayable > 0 ? costOfGoodsSold / accountsPayable : 0;
        const daysPayables = payablesTurnover > 0 ? 365 / payablesTurnover : 0;
        return {
            assetTurnover: totalAssets > 0 ? revenue / totalAssets : 0,
            inventoryTurnover,
            daysInventory,
            receivablesTurnover,
            daysReceivables,
            payablesTurnover,
            daysPayables,
            cashConversionCycle: daysInventory + daysReceivables - daysPayables,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate efficiency ratios: ${error.message}`);
    }
}
// ============================================================================
// PROFITABILITY ANALYSIS FUNCTIONS (29-35)
// ============================================================================
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
async function analyzeProfitability(financialData) {
    try {
        const { revenue = 0, costOfGoodsSold = 0, operatingExpenses = 0, depreciation = 0, amortization = 0, interest = 0, taxes = 0, fixedCosts = 0, } = financialData;
        const grossProfit = revenue - costOfGoodsSold;
        const operatingProfit = grossProfit - operatingExpenses;
        const ebitda = operatingProfit + depreciation + amortization;
        const ebit = ebitda - depreciation - amortization;
        const netProfit = ebit - interest - taxes;
        const contributionMargin = revenue > 0 ? ((revenue - (costOfGoodsSold - fixedCosts)) / revenue) * 100 : 0;
        const breakEvenPoint = contributionMargin > 0 ? (fixedCosts / contributionMargin) * 100 : 0;
        const marginOfSafety = revenue > 0 ? ((revenue - breakEvenPoint) / revenue) * 100 : 0;
        return {
            grossProfit,
            grossProfitMargin: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
            operatingProfit,
            operatingMargin: revenue > 0 ? (operatingProfit / revenue) * 100 : 0,
            netProfit,
            netMargin: revenue > 0 ? (netProfit / revenue) * 100 : 0,
            ebitda,
            ebitdaMargin: revenue > 0 ? (ebitda / revenue) * 100 : 0,
            ebit,
            ebitMargin: revenue > 0 ? (ebit / revenue) * 100 : 0,
            contributionMargin,
            breakEvenPoint,
            marginOfSafety,
        };
    }
    catch (error) {
        throw new Error(`Failed to analyze profitability: ${error.message}`);
    }
}
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
function calculateGrossProfit(revenue, costOfGoodsSold) {
    try {
        const grossProfit = revenue - costOfGoodsSold;
        const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
        return { grossProfit, grossMargin };
    }
    catch (error) {
        throw new Error(`Failed to calculate gross profit: ${error.message}`);
    }
}
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
function calculateOperatingProfit(grossProfit, operatingExpenses) {
    try {
        const operatingProfit = grossProfit - operatingExpenses;
        return { operatingProfit };
    }
    catch (error) {
        throw new Error(`Failed to calculate operating profit: ${error.message}`);
    }
}
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
function calculateNetProfit(operatingProfit, nonOperatingItems, taxes, revenue) {
    try {
        const netProfit = operatingProfit + nonOperatingItems - taxes;
        const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
        return { netProfit, netMargin };
    }
    catch (error) {
        throw new Error(`Failed to calculate net profit: ${error.message}`);
    }
}
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
async function analyzeProductMargins(productData) {
    try {
        const analysis = {};
        for (const [product, data] of Object.entries(productData)) {
            analysis[product] = await analyzeProfitability(data);
        }
        return analysis;
    }
    catch (error) {
        throw new Error(`Failed to analyze product margins: ${error.message}`);
    }
}
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
function calculateBreakEvenPoint(fixedCosts, pricePerUnit, variableCostPerUnit, currentUnits) {
    try {
        const contributionMarginPerUnit = pricePerUnit - variableCostPerUnit;
        const contributionMarginRatio = pricePerUnit > 0 ? contributionMarginPerUnit / pricePerUnit : 0;
        const breakEvenUnits = contributionMarginPerUnit > 0 ? fixedCosts / contributionMarginPerUnit : 0;
        const breakEvenRevenue = breakEvenUnits * pricePerUnit;
        const marginOfSafetyUnits = currentUnits - breakEvenUnits;
        const marginOfSafetyPercentage = currentUnits > 0 ? (marginOfSafetyUnits / currentUnits) * 100 : 0;
        return {
            breakEvenUnits,
            breakEvenRevenue,
            contributionMarginPerUnit,
            contributionMarginRatio,
            marginOfSafetyUnits,
            marginOfSafetyPercentage,
        };
    }
    catch (error) {
        throw new Error(`Failed to calculate break-even point: ${error.message}`);
    }
}
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
function performContributionMarginAnalysis(revenue, variableCosts) {
    try {
        const contributionMargin = revenue - variableCosts;
        const contributionMarginRatio = revenue > 0 ? (contributionMargin / revenue) * 100 : 0;
        return {
            contributionMargin,
            contributionMarginRatio,
        };
    }
    catch (error) {
        throw new Error(`Failed to perform contribution margin analysis: ${error.message}`);
    }
}
// ============================================================================
// BENCHMARKING & COMPARISON FUNCTIONS (36-40)
// ============================================================================
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
async function benchmarkAgainstIndustry(ownMetrics, industry, period) {
    try {
        const benchmarks = [];
        // Mock industry data (in production, fetch from database or external service)
        const industryData = {
            netProfitMargin: { average: 14.2, median: 13.8, topQuartile: 18.5, bottomQuartile: 9.2 },
            roe: { average: 22.0, median: 20.5, topQuartile: 28.0, bottomQuartile: 15.0 },
        };
        for (const [metric, ownValue] of Object.entries(ownMetrics)) {
            const industryMetric = industryData[metric];
            if (industryMetric) {
                const gap = ownValue - industryMetric.average;
                const percentile = calculatePercentile(ownValue, industryMetric);
                benchmarks.push({
                    metric,
                    ownValue,
                    industryAverage: industryMetric.average,
                    industryMedian: industryMetric.median,
                    industryTopQuartile: industryMetric.topQuartile,
                    industryBottomQuartile: industryMetric.bottomQuartile,
                    percentile,
                    gap,
                    ranking: 0,
                });
            }
        }
        return benchmarks;
    }
    catch (error) {
        throw new Error(`Failed to benchmark against industry: ${error.message}`);
    }
}
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
function calculatePercentile(value, distribution) {
    try {
        const { bottomQuartile, median, topQuartile } = distribution;
        if (value <= bottomQuartile)
            return 25;
        if (value <= median)
            return 25 + ((value - bottomQuartile) / (median - bottomQuartile)) * 25;
        if (value <= topQuartile)
            return 50 + ((value - median) / (topQuartile - median)) * 25;
        return 75 + Math.min(((value - topQuartile) / topQuartile) * 25, 25);
    }
    catch (error) {
        throw new Error(`Failed to calculate percentile: ${error.message}`);
    }
}
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
async function comparePeriodsOverTime(metricId, periods) {
    try {
        // Mock implementation - fetch actual data from database
        const historicalData = periods.map((period) => ({
            period,
            value: Math.random() * 100,
        }));
        const values = historicalData.map((d) => d.value);
        const trendLine = calculateLinearTrend(values);
        const movingAverage = calculateMovingAverage(values, 3);
        const growthRate = calculateGrowthRate(values);
        const volatility = calculateStandardDeviation(values);
        return {
            metric: metricId,
            historicalData,
            trendLine,
            movingAverage,
            growthRate,
            volatility,
            seasonality: [],
            forecast: [],
        };
    }
    catch (error) {
        throw new Error(`Failed to compare periods over time: ${error.message}`);
    }
}
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
function identifyTopBottomPerformers(metricId, peerData, topN = 5) {
    try {
        const sortedPeers = Object.entries(peerData).sort(([, a], [, b]) => b - a);
        const topPerformers = sortedPeers.slice(0, topN).map(([peer]) => peer);
        const bottomPerformers = sortedPeers
            .slice(-topN)
            .reverse()
            .map(([peer]) => peer);
        return {
            topPerformers,
            bottomPerformers,
        };
    }
    catch (error) {
        throw new Error(`Failed to identify top/bottom performers: ${error.message}`);
    }
}
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
async function calculateCompetitivePosition(ownMetrics, competitorMetrics, weights) {
    try {
        let totalScore = 0;
        let totalWeight = 0;
        for (const [metric, weight] of Object.entries(weights)) {
            const ownValue = ownMetrics[metric];
            if (ownValue === undefined)
                continue;
            const competitorValues = Object.values(competitorMetrics)
                .map((m) => m[metric])
                .filter((v) => v !== undefined);
            if (competitorValues.length === 0)
                continue;
            const average = competitorValues.reduce((sum, v) => sum + v, 0) / competitorValues.length;
            const relativePerformance = average > 0 ? (ownValue / average) * 100 : 100;
            totalScore += Math.min(relativePerformance, 200) * weight;
            totalWeight += weight;
        }
        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }
    catch (error) {
        throw new Error(`Failed to calculate competitive position: ${error.message}`);
    }
}
// ============================================================================
// VARIANCE & TREND ANALYSIS (41-45)
// ============================================================================
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
async function performBudgetVarianceAnalysis(budgetData, actualData, period) {
    try {
        const variances = [];
        for (const [category, budgetAmount] of Object.entries(budgetData)) {
            const actualAmount = actualData[category] || 0;
            const variance = actualAmount - budgetAmount;
            const variancePercentage = budgetAmount !== 0 ? (variance / budgetAmount) * 100 : 0;
            // For revenue, positive variance is favorable; for expenses, negative is favorable
            const isRevenueCategory = category.toLowerCase().includes('revenue') ||
                category.toLowerCase().includes('income');
            const varianceType = (variance > 0 && isRevenueCategory) || (variance < 0 && !isRevenueCategory)
                ? 'favorable'
                : 'unfavorable';
            variances.push({
                budgetAmount,
                actualAmount,
                variance,
                variancePercentage,
                varianceType,
                category,
                period,
            });
        }
        return variances;
    }
    catch (error) {
        throw new Error(`Failed to perform budget variance analysis: ${error.message}`);
    }
}
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
async function analyzeRevenueAndCostTrends(historicalData) {
    try {
        const revenueData = historicalData.map((d) => ({ period: d.period, value: d.revenue }));
        const costData = historicalData.map((d) => ({ period: d.period, value: d.costs }));
        const revenueValues = revenueData.map((d) => d.value);
        const costValues = costData.map((d) => d.value);
        return {
            revenue: {
                metric: 'Revenue',
                historicalData: revenueData,
                trendLine: calculateLinearTrend(revenueValues),
                movingAverage: calculateMovingAverage(revenueValues, 3),
                growthRate: calculateGrowthRate(revenueValues),
                volatility: calculateStandardDeviation(revenueValues),
                seasonality: [],
                forecast: [],
            },
            costs: {
                metric: 'Costs',
                historicalData: costData,
                trendLine: calculateLinearTrend(costValues),
                movingAverage: calculateMovingAverage(costValues, 3),
                growthRate: calculateGrowthRate(costValues),
                volatility: calculateStandardDeviation(costValues),
                seasonality: [],
                forecast: [],
            },
        };
    }
    catch (error) {
        throw new Error(`Failed to analyze revenue and cost trends: ${error.message}`);
    }
}
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
function calculateMovingAverage(values, period) {
    try {
        const movingAverages = [];
        for (let i = period - 1; i < values.length; i++) {
            const sum = values.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
            movingAverages.push(sum / period);
        }
        return movingAverages;
    }
    catch (error) {
        throw new Error(`Failed to calculate moving average: ${error.message}`);
    }
}
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
function calculateLinearTrend(values) {
    try {
        const n = values.length;
        if (n === 0)
            return [];
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumX2 = 0;
        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += values[i];
            sumXY += i * values[i];
            sumX2 += i * i;
        }
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        return values.map((_, i) => slope * i + intercept);
    }
    catch (error) {
        throw new Error(`Failed to calculate linear trend: ${error.message}`);
    }
}
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
function performYoYandQoQAnalysis(currentPeriod, priorPeriod, yearAgoPeriod) {
    try {
        const analysis = {};
        for (const [metric, currentValue] of Object.entries(currentPeriod)) {
            const priorValue = priorPeriod[metric] || 0;
            const yearAgoValue = yearAgoPeriod[metric] || 0;
            const qoqChange = currentValue - priorValue;
            const qoqPercentage = priorValue !== 0 ? (qoqChange / priorValue) * 100 : 0;
            const yoyChange = currentValue - yearAgoValue;
            const yoyPercentage = yearAgoValue !== 0 ? (yoyChange / yearAgoValue) * 100 : 0;
            analysis[metric] = {
                currentValue,
                priorValue,
                yearAgoValue,
                qoqChange,
                qoqPercentage,
                yoyChange,
                yoyPercentage,
            };
        }
        return analysis;
    }
    catch (error) {
        throw new Error(`Failed to perform YoY and QoQ analysis: ${error.message}`);
    }
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Calculate growth rate from time series data.
 *
 * @param {number[]} values - Time series values
 * @returns {number} Compound annual growth rate (CAGR)
 */
function calculateGrowthRate(values) {
    if (values.length < 2)
        return 0;
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const periods = values.length - 1;
    if (firstValue === 0)
        return 0;
    return (Math.pow(lastValue / firstValue, 1 / periods) - 1) * 100;
}
/**
 * Calculate standard deviation for volatility analysis.
 *
 * @param {number[]} values - Data values
 * @returns {number} Standard deviation
 */
function calculateStandardDeviation(values) {
    if (values.length === 0)
        return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(variance);
}
//# sourceMappingURL=financial-performance-management-kit.js.map