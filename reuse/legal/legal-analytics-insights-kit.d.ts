/**
 * LOC: LEGAL-ANALYTICS-001
 * File: /reuse/legal/legal-analytics-insights-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - Legal analytics services
 *   - Business intelligence modules
 *   - Reporting dashboards
 */
/**
 * File: /reuse/legal/legal-analytics-insights-kit.ts
 * Locator: WC-LEGAL-ANALYTICS-001
 * Purpose: Legal Analytics & Business Intelligence - Predictive analytics, judge analytics, cost estimation, metrics
 *
 * Upstream: Sequelize, NestJS, TypeScript 5.x
 * Downstream: Legal research modules, litigation support, business intelligence
 * Dependencies: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Exports: 39 utility functions for legal analytics, case outcome prediction, judge analysis, cost estimation
 *
 * LLM Context: Comprehensive legal analytics toolkit for White Cross healthcare legal system.
 * Provides predictive analytics, judge behavior analysis, litigation cost estimation, legal KPIs,
 * trend analysis, forecasting, and business intelligence capabilities. Production-ready with
 * machine learning models, statistical analysis, and data visualization support.
 */
import { Model, Sequelize, Optional } from 'sequelize';
/**
 * Case outcome prediction result
 */
export interface CaseOutcomePrediction {
    caseId: string;
    predictedOutcome: 'plaintiff_win' | 'defendant_win' | 'settlement' | 'dismissal';
    confidence: number;
    factors: PredictionFactor[];
    probabilityDistribution: {
        plaintiffWin: number;
        defendantWin: number;
        settlement: number;
        dismissal: number;
    };
    estimatedSettlementRange?: {
        low: number;
        high: number;
        median: number;
    };
    timeToResolution?: number;
    recommendedStrategy: string;
}
/**
 * Prediction contributing factor
 */
export interface PredictionFactor {
    factor: string;
    impact: number;
    weight: number;
    description: string;
}
/**
 * Judge analytics profile
 */
export interface JudgeAnalytics {
    judgeId: string;
    judgeName: string;
    court: string;
    totalCases: number;
    plaintiffWinRate: number;
    defendantWinRate: number;
    settlementRate: number;
    dismissalRate: number;
    averageTimeToResolution: number;
    medianAwardAmount?: number;
    rulingPatterns: RulingPattern[];
    sentencingTrends?: SentencingTrend[];
    reverseRate?: number;
    productivity: {
        casesPerYear: number;
        opinionsPublished: number;
    };
}
/**
 * Judge ruling pattern
 */
export interface RulingPattern {
    issueType: string;
    rulingFavor: 'plaintiff' | 'defendant' | 'neutral';
    frequency: number;
    consistency: number;
}
/**
 * Sentencing trend for criminal cases
 */
export interface SentencingTrend {
    offense: string;
    averageSentence: number;
    minSentence: number;
    maxSentence: number;
    probationRate: number;
}
/**
 * Litigation cost estimation
 */
export interface LitigationCostEstimate {
    matterId: string;
    estimatedTotal: number;
    breakdown: CostBreakdown;
    confidenceInterval: {
        low: number;
        median: number;
        high: number;
    };
    assumptions: string[];
    riskFactors: RiskFactor[];
    phaseEstimates: PhaseEstimate[];
}
/**
 * Cost breakdown by category
 */
export interface CostBreakdown {
    attorneyFees: number;
    expertWitnessFees: number;
    courtCosts: number;
    discoveryExpenses: number;
    travelExpenses: number;
    administrativeCosts: number;
    miscellaneous: number;
}
/**
 * Cost risk factor
 */
export interface RiskFactor {
    factor: string;
    potentialImpact: number;
    probability: number;
    mitigation: string;
}
/**
 * Litigation phase cost estimate
 */
export interface PhaseEstimate {
    phase: 'pleadings' | 'discovery' | 'motions' | 'trial' | 'appeal';
    estimatedCost: number;
    estimatedDuration: number;
    probability: number;
}
/**
 * Legal KPI metrics
 */
export interface LegalKPIs {
    period: 'month' | 'quarter' | 'year';
    startDate: Date;
    endDate: Date;
    metrics: {
        caseload: CaseloadMetrics;
        financial: FinancialMetrics;
        efficiency: EfficiencyMetrics;
        quality: QualityMetrics;
        client: ClientMetrics;
    };
}
/**
 * Caseload metrics
 */
export interface CaseloadMetrics {
    totalCases: number;
    newCases: number;
    closedCases: number;
    pendingCases: number;
    casesByType: Record<string, number>;
    casesByStatus: Record<string, number>;
}
/**
 * Financial metrics
 */
export interface FinancialMetrics {
    totalRevenue: number;
    totalExpenses: number;
    profit: number;
    profitMargin: number;
    revenuePerCase: number;
    revenuePerAttorney: number;
    collectionRate: number;
    writeOffRate: number;
}
/**
 * Efficiency metrics
 */
export interface EfficiencyMetrics {
    averageTimeToResolution: number;
    billableHoursPerAttorney: number;
    utilizationRate: number;
    caseClosureRate: number;
    docketComplianceRate: number;
}
/**
 * Quality metrics
 */
export interface QualityMetrics {
    winRate: number;
    settlementQuality: number;
    clientSatisfactionScore: number;
    errorRate: number;
    appealSuccessRate: number;
}
/**
 * Client metrics
 */
export interface ClientMetrics {
    totalClients: number;
    newClients: number;
    retentionRate: number;
    referralRate: number;
    averageClientValue: number;
}
/**
 * Trend analysis result
 */
export interface TrendAnalysis {
    metric: string;
    period: string;
    dataPoints: DataPoint[];
    trend: 'increasing' | 'decreasing' | 'stable';
    changeRate: number;
    forecast: Forecast;
    seasonality?: SeasonalPattern;
    anomalies: Anomaly[];
}
/**
 * Time series data point
 */
export interface DataPoint {
    date: Date;
    value: number;
    label?: string;
}
/**
 * Forecast result
 */
export interface Forecast {
    predictions: DataPoint[];
    confidence: number;
    method: 'linear' | 'exponential' | 'arima' | 'ml';
    accuracy: number;
}
/**
 * Seasonal pattern
 */
export interface SeasonalPattern {
    period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    peakPeriods: string[];
    lowPeriods: string[];
    amplitude: number;
}
/**
 * Anomaly detection
 */
export interface Anomaly {
    date: Date;
    value: number;
    expectedValue: number;
    deviation: number;
    significance: 'low' | 'medium' | 'high';
    explanation?: string;
}
/**
 * Case outcome prediction model
 */
interface CaseOutcomePredictionAttributes {
    id: string;
    caseId: string;
    predictedOutcome: string;
    confidence: number;
    factors: any;
    probabilityDistribution: any;
    actualOutcome?: string;
    predictionAccuracy?: number;
    modelVersion: string;
    predictedAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
type CaseOutcomePredictionCreationAttributes = Optional<CaseOutcomePredictionAttributes, 'id' | 'createdAt' | 'updatedAt'>;
export declare class CaseOutcomePredictionModel extends Model<CaseOutcomePredictionAttributes, CaseOutcomePredictionCreationAttributes> {
}
/**
 * Initialize case outcome prediction model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof CaseOutcomePredictionModel} Initialized model
 *
 * @example
 * ```typescript
 * const predictionModel = initCaseOutcomePredictionModel(sequelize);
 * ```
 */
export declare function initCaseOutcomePredictionModel(sequelize: Sequelize): typeof CaseOutcomePredictionModel;
/**
 * Judge analytics model
 */
interface JudgeAnalyticsAttributes {
    id: string;
    judgeId: string;
    judgeName: string;
    court: string;
    analyticsData: any;
    lastUpdated: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
type JudgeAnalyticsCreationAttributes = Optional<JudgeAnalyticsAttributes, 'id' | 'createdAt' | 'updatedAt'>;
export declare class JudgeAnalyticsModel extends Model<JudgeAnalyticsAttributes, JudgeAnalyticsCreationAttributes> {
}
/**
 * Initialize judge analytics model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof JudgeAnalyticsModel} Initialized model
 *
 * @example
 * ```typescript
 * const judgeModel = initJudgeAnalyticsModel(sequelize);
 * ```
 */
export declare function initJudgeAnalyticsModel(sequelize: Sequelize): typeof JudgeAnalyticsModel;
/**
 * Predicts case outcome using machine learning model
 *
 * @param {string} caseId - Case identifier
 * @param {any} caseData - Case information and features
 * @returns {Promise<CaseOutcomePrediction>} Prediction result
 *
 * @example
 * ```typescript
 * const prediction = await predictCaseOutcome('case-123', {
 *   caseType: 'medical_malpractice',
 *   damagesRequested: 500000,
 *   judgeId: 'judge-456',
 *   venue: 'Cook County Circuit Court'
 * });
 * console.log(`Predicted outcome: ${prediction.predictedOutcome}`);
 * console.log(`Confidence: ${(prediction.confidence * 100).toFixed(1)}%`);
 * ```
 */
export declare function predictCaseOutcome(caseId: string, caseData: any): Promise<CaseOutcomePrediction>;
/**
 * Validates prediction accuracy against actual outcome
 *
 * @param {string} predictionId - Prediction record ID
 * @param {string} actualOutcome - Actual case outcome
 * @returns {Promise<number>} Prediction accuracy score
 *
 * @example
 * ```typescript
 * const accuracy = await validatePredictionAccuracy(
 *   'pred-123',
 *   'settlement'
 * );
 * console.log(`Prediction accuracy: ${(accuracy * 100).toFixed(1)}%`);
 * ```
 */
export declare function validatePredictionAccuracy(predictionId: string, actualOutcome: string): Promise<number>;
/**
 * Analyzes judge behavior and ruling patterns
 *
 * @param {string} judgeId - Judge identifier
 * @returns {Promise<JudgeAnalytics>} Judge analytics profile
 *
 * @example
 * ```typescript
 * const analytics = await analyzeJudgeBehavior('judge-456');
 * console.log(`Win rate for plaintiffs: ${(analytics.plaintiffWinRate * 100).toFixed(1)}%`);
 * console.log(`Average time to resolution: ${analytics.averageTimeToResolution} days`);
 * ```
 */
export declare function analyzeJudgeBehavior(judgeId: string): Promise<JudgeAnalytics>;
/**
 * Compares judge analytics across multiple judges
 *
 * @param {string[]} judgeIds - Array of judge identifiers
 * @returns {Promise<JudgeAnalytics[]>} Array of judge analytics
 *
 * @example
 * ```typescript
 * const comparison = await compareJudges(['judge-1', 'judge-2', 'judge-3']);
 * comparison.forEach(j => {
 *   console.log(`${j.judgeName}: ${(j.plaintiffWinRate * 100).toFixed(1)}% plaintiff win rate`);
 * });
 * ```
 */
export declare function compareJudges(judgeIds: string[]): Promise<JudgeAnalytics[]>;
/**
 * Estimates total litigation costs for a matter
 *
 * @param {string} matterId - Matter identifier
 * @param {any} matterData - Matter information
 * @returns {Promise<LitigationCostEstimate>} Cost estimate
 *
 * @example
 * ```typescript
 * const estimate = await estimateLitigationCosts('matter-789', {
 *   caseType: 'medical_malpractice',
 *   expectedDuration: 18,
 *   complexity: 'high',
 *   expertWitnessesNeeded: 3
 * });
 * console.log(`Estimated total: $${estimate.estimatedTotal.toLocaleString()}`);
 * ```
 */
export declare function estimateLitigationCosts(matterId: string, matterData: any): Promise<LitigationCostEstimate>;
/**
 * Calculates comprehensive legal KPIs for a period
 *
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @param {string} period - Period type
 * @returns {Promise<LegalKPIs>} KPI metrics
 *
 * @example
 * ```typescript
 * const kpis = await calculateLegalKPIs(
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31'),
 *   'quarter'
 * );
 * console.log(`Win rate: ${(kpis.metrics.quality.winRate * 100).toFixed(1)}%`);
 * ```
 */
export declare function calculateLegalKPIs(startDate: Date, endDate: Date, period: 'month' | 'quarter' | 'year'): Promise<LegalKPIs>;
/**
 * Analyzes trends in legal metrics over time
 *
 * @param {string} metric - Metric to analyze
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<TrendAnalysis>} Trend analysis result
 *
 * @example
 * ```typescript
 * const trend = await analyzeTrend(
 *   'case_volume',
 *   new Date('2023-01-01'),
 *   new Date('2024-12-31')
 * );
 * console.log(`Trend: ${trend.trend}, Change rate: ${(trend.changeRate * 100).toFixed(1)}%`);
 * ```
 */
export declare function analyzeTrend(metric: string, startDate: Date, endDate: Date): Promise<TrendAnalysis>;
/**
 * Forecasts future legal metrics using time series analysis
 *
 * @param {string} metric - Metric to forecast
 * @param {number} periods - Number of periods to forecast
 * @returns {Promise<Forecast>} Forecast result
 *
 * @example
 * ```typescript
 * const forecast = await forecastLegalMetric('case_volume', 6);
 * forecast.predictions.forEach(p => {
 *   console.log(`${p.date.toISOString().split('T')[0]}: ${p.value}`);
 * });
 * ```
 */
export declare function forecastLegalMetric(metric: string, periods: number): Promise<Forecast>;
/**
 * Legal analytics service for NestJS
 */
export declare class LegalAnalyticsService {
    private readonly logger;
    /**
     * Predicts case outcome
     */
    predictOutcome(caseId: string, caseData: any): Promise<CaseOutcomePrediction>;
    /**
     * Analyzes judge behavior
     */
    getJudgeAnalytics(judgeId: string): Promise<JudgeAnalytics>;
    /**
     * Estimates litigation costs
     */
    estimateCosts(matterId: string, matterData: any): Promise<LitigationCostEstimate>;
    /**
     * Calculates KPIs
     */
    getKPIs(startDate: Date, endDate: Date, period: 'month' | 'quarter' | 'year'): Promise<LegalKPIs>;
    /**
     * Analyzes trends
     */
    getTrendAnalysis(metric: string, startDate: Date, endDate: Date): Promise<TrendAnalysis>;
}
export {};
//# sourceMappingURL=legal-analytics-insights-kit.d.ts.map