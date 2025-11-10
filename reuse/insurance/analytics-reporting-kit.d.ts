/**
 * LOC: INS-ANLYT-001
 * File: /reuse/insurance/analytics-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - node-cron
 *   - chart.js (for visualization data)
 *   - @tensorflow/tfjs-node (for predictive models)
 *
 * DOWNSTREAM (imported by):
 *   - Insurance analytics controllers
 *   - Business intelligence services
 *   - Executive dashboard modules
 *   - Reporting services
 */
/**
 * File: /reuse/insurance/analytics-reporting-kit.ts
 * Locator: WC-UTL-INSANLYT-001
 * Purpose: Insurance Analytics & Reporting Kit - Comprehensive analytics and reporting utilities for NestJS
 *
 * Upstream: @nestjs/common, sequelize, node-cron, chart.js, tensorflow, bull (queue)
 * Downstream: Analytics controllers, BI services, dashboard modules, report generators
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, TensorFlow.js, Chart.js 4.x
 * Exports: 45 utility functions for premium analytics, loss ratios, claims analytics, retention analysis, production reports
 *
 * LLM Context: Production-grade insurance analytics and reporting utilities for White Cross platform.
 * Provides premium volume tracking and trending, loss ratio dashboards with drill-down capabilities,
 * claims frequency and severity analytics, policy retention and churn analysis, new business production
 * metrics, renewal rate tracking, cancellation reason analysis, geographic performance heatmaps,
 * product line profitability analysis, agent/broker performance scorecards, quote-to-bind conversion
 * optimization, customer acquisition cost analysis, predictive modeling for underwriting decisions,
 * risk portfolio analysis, and comprehensive regulatory compliance reporting with automated exports.
 */
import { Sequelize } from 'sequelize';
/**
 * Time period types
 */
export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'ytd' | 'custom';
/**
 * Comparison types
 */
export type ComparisonType = 'prior_period' | 'prior_year' | 'budget' | 'forecast' | 'industry_benchmark';
/**
 * Report format types
 */
export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html' | 'dashboard';
/**
 * Metric types
 */
export type MetricType = 'count' | 'sum' | 'average' | 'ratio' | 'percentage' | 'trend';
/**
 * Product line types
 */
export type ProductLine = 'auto' | 'home' | 'life' | 'health' | 'commercial' | 'specialty' | 'umbrella' | 'pet';
/**
 * Geographic level types
 */
export type GeographicLevel = 'national' | 'regional' | 'state' | 'county' | 'zip' | 'territory';
/**
 * Premium volume configuration
 */
export interface PremiumVolumeConfig {
    productLine?: ProductLine[];
    timePeriod: TimePeriod;
    startDate: Date;
    endDate: Date;
    groupBy?: 'product' | 'state' | 'producer' | 'channel';
    comparison?: ComparisonType;
    includeCommissions?: boolean;
}
/**
 * Premium metrics
 */
export interface PremiumMetrics {
    writtenPremium: number;
    earnedPremium: number;
    inForcePremium: number;
    averagePremium: number;
    policyCount: number;
    growthRate: number;
    retentionRate?: number;
    newBusinessPremium?: number;
    renewalPremium?: number;
}
/**
 * Loss ratio configuration
 */
export interface LossRatioConfig {
    productLine?: ProductLine[];
    timePeriod: TimePeriod;
    startDate: Date;
    endDate: Date;
    includeLAE?: boolean;
    includeIBNR?: boolean;
    accidentYearBasis?: boolean;
}
/**
 * Loss ratio metrics
 */
export interface LossRatioMetrics {
    incurredLosses: number;
    earnedPremium: number;
    lossRatio: number;
    lossAdjustmentExpense?: number;
    laeRatio?: number;
    combinedRatio?: number;
    claimCount: number;
    averageClaimSeverity: number;
    targetLossRatio?: number;
    varianceFromTarget?: number;
}
/**
 * Claims analytics configuration
 */
export interface ClaimsAnalyticsConfig {
    productLine?: ProductLine[];
    timePeriod: TimePeriod;
    startDate: Date;
    endDate: Date;
    claimType?: string[];
    severityRange?: {
        min: number;
        max: number;
    };
}
/**
 * Claims frequency metrics
 */
export interface ClaimsFrequencyMetrics {
    claimCount: number;
    exposureBase: number;
    frequency: number;
    trendDirection: 'increasing' | 'decreasing' | 'stable';
    seasonalFactors?: Record<string, number>;
}
/**
 * Claims severity metrics
 */
export interface ClaimsSeverityMetrics {
    averageSeverity: number;
    medianSeverity: number;
    maxSeverity: number;
    severityTrend: number;
    distributionPercentiles: Record<string, number>;
    catastrophicClaimsCount?: number;
}
/**
 * Retention analysis configuration
 */
export interface RetentionAnalysisConfig {
    productLine?: ProductLine[];
    cohortStartDate: Date;
    analysisMonths: number;
    segmentBy?: 'product' | 'premium_band' | 'age' | 'tenure';
}
/**
 * Retention metrics
 */
export interface RetentionMetrics {
    retentionRate: number;
    lapsedPolicies: number;
    retainedPolicies: number;
    churnRate: number;
    persistency: number[];
    averageTenure: number;
    lifetimeValue?: number;
}
/**
 * New business production configuration
 */
export interface NewBusinessConfig {
    productLine?: ProductLine[];
    timePeriod: TimePeriod;
    startDate: Date;
    endDate: Date;
    channel?: string[];
    producerId?: string[];
}
/**
 * New business metrics
 */
export interface NewBusinessMetrics {
    quoteCount: number;
    applicationCount: number;
    boundPolicies: number;
    quoteToBind: number;
    totalPremium: number;
    averagePremium: number;
    conversionRate: number;
    timeToIssue: number;
}
/**
 * Renewal metrics
 */
export interface RenewalMetrics {
    renewalsDue: number;
    renewalsQuoted: number;
    renewalsCompleted: number;
    renewalRate: number;
    averageRenewalPremium: number;
    rateChangePercent: number;
    earlyRenewals: number;
    autoRenewals: number;
}
/**
 * Cancellation analysis configuration
 */
export interface CancellationAnalysisConfig {
    productLine?: ProductLine[];
    timePeriod: TimePeriod;
    startDate: Date;
    endDate: Date;
    groupByReason?: boolean;
}
/**
 * Cancellation metrics
 */
export interface CancellationMetrics {
    totalCancellations: number;
    cancellationRate: number;
    reasonBreakdown: Record<string, number>;
    averageDaysToCancel: number;
    earnedPremiumImpact: number;
    preventableCancellations?: number;
}
/**
 * Geographic performance configuration
 */
export interface GeographicPerformanceConfig {
    level: GeographicLevel;
    productLine?: ProductLine[];
    timePeriod: TimePeriod;
    startDate: Date;
    endDate: Date;
    metrics: string[];
}
/**
 * Geographic metrics
 */
export interface GeographicMetrics {
    location: string;
    premium: number;
    policyCount: number;
    lossRatio: number;
    marketShare?: number;
    growthRate: number;
    profitability: number;
}
/**
 * Product profitability configuration
 */
export interface ProductProfitabilityConfig {
    productLine: ProductLine[];
    timePeriod: TimePeriod;
    startDate: Date;
    endDate: Date;
    includeExpenses?: boolean;
    allocationMethod?: 'direct' | 'allocated' | 'marginal';
}
/**
 * Profitability metrics
 */
export interface ProfitabilityMetrics {
    revenue: number;
    losses: number;
    expenses: number;
    profit: number;
    profitMargin: number;
    roe?: number;
    combinedRatio: number;
    underwritingProfit: number;
}
/**
 * Agent performance configuration
 */
export interface AgentPerformanceConfig {
    producerId?: string[];
    agencyId?: string[];
    timePeriod: TimePeriod;
    startDate: Date;
    endDate: Date;
    metrics: string[];
}
/**
 * Agent performance metrics
 */
export interface AgentPerformanceMetrics {
    producerId: string;
    producerName: string;
    newBusinessPremium: number;
    renewalPremium: number;
    totalPremium: number;
    policyCount: number;
    retentionRate: number;
    lossRatio: number;
    quoteToBind: number;
    commissionEarned: number;
    productivityScore: number;
}
/**
 * Conversion funnel configuration
 */
export interface ConversionFunnelConfig {
    productLine?: ProductLine[];
    timePeriod: TimePeriod;
    startDate: Date;
    endDate: Date;
    channel?: string[];
}
/**
 * Conversion funnel metrics
 */
export interface ConversionFunnelMetrics {
    leads: number;
    quotes: number;
    applications: number;
    bound: number;
    leadToQuote: number;
    quoteToApp: number;
    appToBound: number;
    overallConversion: number;
    dropoffPoints: Record<string, number>;
}
/**
 * Customer acquisition cost configuration
 */
export interface CACConfig {
    productLine?: ProductLine[];
    channel: string[];
    timePeriod: TimePeriod;
    startDate: Date;
    endDate: Date;
    includeOverhead?: boolean;
}
/**
 * CAC metrics
 */
export interface CACMetrics {
    totalMarketingCost: number;
    totalSalesCost: number;
    totalAcquisitionCost: number;
    newCustomers: number;
    cac: number;
    ltv?: number;
    ltvCacRatio?: number;
    paybackPeriod?: number;
}
/**
 * Predictive model configuration
 */
export interface PredictiveModelConfig {
    modelType: 'loss_prediction' | 'churn_prediction' | 'premium_optimization' | 'risk_scoring';
    features: string[];
    targetVariable: string;
    trainingDataMonths: number;
    validationSplit: number;
}
/**
 * Predictive model results
 */
export interface PredictiveModelResults {
    modelType: string;
    accuracy: number;
    predictions: Array<{
        id: string;
        prediction: number;
        confidence: number;
    }>;
    featureImportance: Record<string, number>;
    modelMetrics: Record<string, number>;
}
/**
 * Risk portfolio configuration
 */
export interface RiskPortfolioConfig {
    productLine?: ProductLine[];
    asOfDate: Date;
    riskMetrics: string[];
    concentrationThresholds?: Record<string, number>;
}
/**
 * Risk portfolio metrics
 */
export interface RiskPortfolioMetrics {
    totalExposure: number;
    concentrationByProduct: Record<string, number>;
    concentrationByGeography: Record<string, number>;
    concentrationByPeril: Record<string, number>;
    probabilityOfMaxLoss: Record<string, number>;
    diversificationScore: number;
    riskAdjustedReturn: number;
}
/**
 * Compliance report configuration
 */
export interface ComplianceReportConfig {
    reportType: 'statutory' | 'gaap' | 'regulatory' | 'internal';
    jurisdiction?: string;
    timePeriod: TimePeriod;
    startDate: Date;
    endDate: Date;
    schedules?: string[];
}
/**
 * PremiumAnalytics model attributes
 */
export interface PremiumAnalyticsAttributes {
    id: string;
    productLine: string;
    timePeriod: string;
    periodStart: Date;
    periodEnd: Date;
    writtenPremium: number;
    earnedPremium: number;
    inForcePremium: number;
    policyCount: number;
    averagePremium: number;
    growthRate: number;
    geography?: string;
    channel?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * LossRatioAnalytics model attributes
 */
export interface LossRatioAnalyticsAttributes {
    id: string;
    productLine: string;
    timePeriod: string;
    periodStart: Date;
    periodEnd: Date;
    earnedPremium: number;
    incurredLosses: number;
    lossRatio: number;
    laeAmount?: number;
    laeRatio?: number;
    combinedRatio?: number;
    claimCount: number;
    averageSeverity: number;
    targetLossRatio?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * AgentPerformanceAnalytics model attributes
 */
export interface AgentPerformanceAnalyticsAttributes {
    id: string;
    producerId: string;
    producerName: string;
    timePeriod: string;
    periodStart: Date;
    periodEnd: Date;
    newBusinessPremium: number;
    renewalPremium: number;
    totalPremium: number;
    policyCount: number;
    retentionRate: number;
    lossRatio: number;
    quoteToBind: number;
    commissionEarned: number;
    productivityScore: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates PremiumAnalytics model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} PremiumAnalytics model
 *
 * @example
 * ```typescript
 * const PremiumModel = createPremiumAnalyticsModel(sequelize);
 * const analytics = await PremiumModel.create({
 *   productLine: 'auto',
 *   timePeriod: 'monthly',
 *   periodStart: new Date('2024-01-01'),
 *   periodEnd: new Date('2024-01-31'),
 *   writtenPremium: 1500000,
 *   earnedPremium: 1400000,
 *   policyCount: 500
 * });
 * ```
 */
export declare const createPremiumAnalyticsModel: (sequelize: Sequelize) => any;
/**
 * Creates LossRatioAnalytics model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} LossRatioAnalytics model
 *
 * @example
 * ```typescript
 * const LossRatioModel = createLossRatioAnalyticsModel(sequelize);
 * const analytics = await LossRatioModel.create({
 *   productLine: 'home',
 *   timePeriod: 'quarterly',
 *   periodStart: new Date('2024-01-01'),
 *   periodEnd: new Date('2024-03-31'),
 *   earnedPremium: 5000000,
 *   incurredLosses: 3200000,
 *   lossRatio: 0.64,
 *   claimCount: 150
 * });
 * ```
 */
export declare const createLossRatioAnalyticsModel: (sequelize: Sequelize) => any;
/**
 * Creates AgentPerformanceAnalytics model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} AgentPerformanceAnalytics model
 *
 * @example
 * ```typescript
 * const AgentModel = createAgentPerformanceAnalyticsModel(sequelize);
 * const performance = await AgentModel.create({
 *   producerId: 'producer-123',
 *   producerName: 'John Smith',
 *   timePeriod: 'monthly',
 *   periodStart: new Date('2024-01-01'),
 *   periodEnd: new Date('2024-01-31'),
 *   totalPremium: 250000,
 *   policyCount: 85,
 *   retentionRate: 0.92
 * });
 * ```
 */
export declare const createAgentPerformanceAnalyticsModel: (sequelize: Sequelize) => any;
/**
 * 1. Generates premium volume report.
 *
 * @param {PremiumVolumeConfig} config - Premium volume configuration
 * @returns {Promise<PremiumMetrics>} Premium metrics
 *
 * @example
 * ```typescript
 * const premiums = await generatePremiumVolumeReport({
 *   productLine: ['auto', 'home'],
 *   timePeriod: 'monthly',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   groupBy: 'product',
 *   comparison: 'prior_year'
 * });
 * console.log('Written premium:', premiums.writtenPremium);
 * ```
 */
export declare const generatePremiumVolumeReport: (config: PremiumVolumeConfig) => Promise<PremiumMetrics>;
/**
 * 2. Calculates premium growth rate.
 *
 * @param {string} productLine - Product line
 * @param {Date} currentPeriodStart - Current period start
 * @param {Date} currentPeriodEnd - Current period end
 * @param {Date} priorPeriodStart - Prior period start
 * @param {Date} priorPeriodEnd - Prior period end
 * @returns {Promise<{currentPremium: number; priorPremium: number; growthRate: number}>} Growth analysis
 *
 * @example
 * ```typescript
 * const growth = await calculatePremiumGrowth(
 *   'auto',
 *   new Date('2024-01-01'), new Date('2024-12-31'),
 *   new Date('2023-01-01'), new Date('2023-12-31')
 * );
 * console.log('Growth rate:', growth.growthRate, '%');
 * ```
 */
export declare const calculatePremiumGrowth: (productLine: string, currentPeriodStart: Date, currentPeriodEnd: Date, priorPeriodStart: Date, priorPeriodEnd: Date) => Promise<{
    currentPremium: number;
    priorPremium: number;
    growthRate: number;
}>;
/**
 * 3. Analyzes premium by distribution channel.
 *
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<Record<string, PremiumMetrics>>} Premium by channel
 *
 * @example
 * ```typescript
 * const channelAnalysis = await analyzePremiumByChannel(new Date('2024-01-01'), new Date('2024-12-31'));
 * Object.keys(channelAnalysis).forEach(channel => {
 *   console.log(channel, channelAnalysis[channel].writtenPremium);
 * });
 * ```
 */
export declare const analyzePremiumByChannel: (startDate: Date, endDate: Date) => Promise<Record<string, PremiumMetrics>>;
/**
 * 4. Tracks in-force premium trends.
 *
 * @param {ProductLine[]} productLines - Product lines to analyze
 * @param {number} months - Number of months to track
 * @returns {Promise<Array<{month: string; inForcePremium: number; change: number}>>} Trend data
 *
 * @example
 * ```typescript
 * const trends = await trackInForcePremiumTrends(['auto', 'home'], 12);
 * trends.forEach(t => console.log(t.month, t.inForcePremium, t.change));
 * ```
 */
export declare const trackInForcePremiumTrends: (productLines: ProductLine[], months: number) => Promise<Array<{
    month: string;
    inForcePremium: number;
    change: number;
}>>;
/**
 * 5. Generates premium concentration report.
 *
 * @param {Date} asOfDate - Report as-of date
 * @returns {Promise<Record<string, any>>} Concentration analysis
 *
 * @example
 * ```typescript
 * const concentration = await generatePremiumConcentrationReport(new Date());
 * console.log('Top 10 accounts:', concentration.topAccounts);
 * ```
 */
export declare const generatePremiumConcentrationReport: (asOfDate: Date) => Promise<Record<string, any>>;
/**
 * 6. Generates loss ratio dashboard data.
 *
 * @param {LossRatioConfig} config - Loss ratio configuration
 * @returns {Promise<LossRatioMetrics>} Loss ratio metrics
 *
 * @example
 * ```typescript
 * const lossRatio = await generateLossRatioDashboard({
 *   productLine: ['auto'],
 *   timePeriod: 'quarterly',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   includeLAE: true,
 *   includeIBNR: true
 * });
 * console.log('Loss ratio:', lossRatio.lossRatio, 'Combined ratio:', lossRatio.combinedRatio);
 * ```
 */
export declare const generateLossRatioDashboard: (config: LossRatioConfig) => Promise<LossRatioMetrics>;
/**
 * 7. Calculates ultimate loss ratio projection.
 *
 * @param {string} productLine - Product line
 * @param {number} accidentYear - Accident year
 * @param {number} developmentMonths - Development months
 * @returns {Promise<{reportedLossRatio: number; ultimateLossRatio: number; ibnrFactor: number}>} Projection
 *
 * @example
 * ```typescript
 * const projection = await calculateUltimateLossRatio('auto', 2024, 12);
 * console.log('Ultimate loss ratio:', projection.ultimateLossRatio);
 * ```
 */
export declare const calculateUltimateLossRatio: (productLine: string, accidentYear: number, developmentMonths: number) => Promise<{
    reportedLossRatio: number;
    ultimateLossRatio: number;
    ibnrFactor: number;
}>;
/**
 * 8. Analyzes loss ratio by coverage type.
 *
 * @param {string} productLine - Product line
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<Record<string, LossRatioMetrics>>} Loss ratio by coverage
 *
 * @example
 * ```typescript
 * const coverageAnalysis = await analyzeLossRatioByCoverage('auto', new Date('2024-01-01'), new Date('2024-12-31'));
 * Object.keys(coverageAnalysis).forEach(coverage => {
 *   console.log(coverage, coverageAnalysis[coverage].lossRatio);
 * });
 * ```
 */
export declare const analyzeLossRatioByCoverage: (productLine: string, startDate: Date, endDate: Date) => Promise<Record<string, LossRatioMetrics>>;
/**
 * 9. Generates loss triangle for reserving.
 *
 * @param {string} productLine - Product line
 * @param {number} originYears - Number of origin years
 * @param {number} developmentYears - Number of development years
 * @returns {Promise<number[][]>} Loss development triangle
 *
 * @example
 * ```typescript
 * const triangle = await generateLossTriangle('home', 10, 10);
 * console.log('Loss triangle:', triangle);
 * ```
 */
export declare const generateLossTriangle: (productLine: string, originYears: number, developmentYears: number) => Promise<number[][]>;
/**
 * 10. Compares actual vs target loss ratios.
 *
 * @param {ProductLine[]} productLines - Product lines
 * @param {Date} startDate - Comparison start date
 * @param {Date} endDate - Comparison end date
 * @returns {Promise<Array<{product: string; actual: number; target: number; variance: number}>>} Comparison data
 *
 * @example
 * ```typescript
 * const comparison = await compareActualVsTargetLossRatio(['auto', 'home'], new Date('2024-01-01'), new Date('2024-12-31'));
 * comparison.forEach(c => console.log(c.product, 'Variance:', c.variance));
 * ```
 */
export declare const compareActualVsTargetLossRatio: (productLines: ProductLine[], startDate: Date, endDate: Date) => Promise<Array<{
    product: string;
    actual: number;
    target: number;
    variance: number;
}>>;
/**
 * 11. Calculates claims frequency rate.
 *
 * @param {ClaimsAnalyticsConfig} config - Claims analytics configuration
 * @returns {Promise<ClaimsFrequencyMetrics>} Frequency metrics
 *
 * @example
 * ```typescript
 * const frequency = await calculateClaimsFrequency({
 *   productLine: ['auto'],
 *   timePeriod: 'annual',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * console.log('Claims frequency:', frequency.frequency);
 * ```
 */
export declare const calculateClaimsFrequency: (config: ClaimsAnalyticsConfig) => Promise<ClaimsFrequencyMetrics>;
/**
 * 12. Analyzes claims severity distribution.
 *
 * @param {ClaimsAnalyticsConfig} config - Claims analytics configuration
 * @returns {Promise<ClaimsSeverityMetrics>} Severity metrics
 *
 * @example
 * ```typescript
 * const severity = await analyzeClaimsSeverity({
 *   productLine: ['home'],
 *   timePeriod: 'annual',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * console.log('Average severity:', severity.averageSeverity);
 * ```
 */
export declare const analyzeClaimsSeverity: (config: ClaimsAnalyticsConfig) => Promise<ClaimsSeverityMetrics>;
/**
 * 13. Identifies high-severity claim patterns.
 *
 * @param {number} severityThreshold - Threshold for high severity
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<Record<string, any>>} Pattern analysis
 *
 * @example
 * ```typescript
 * const patterns = await identifyHighSeverityClaims(100000, new Date('2024-01-01'), new Date('2024-12-31'));
 * console.log('High severity patterns:', patterns.commonFactors);
 * ```
 */
export declare const identifyHighSeverityClaims: (severityThreshold: number, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * 14. Generates claims aging report.
 *
 * @param {string[]} statuses - Claim statuses to include
 * @param {Date} asOfDate - Report as-of date
 * @returns {Promise<Record<string, any>>} Aging report
 *
 * @example
 * ```typescript
 * const aging = await generateClaimsAgingReport(['open', 'pending'], new Date());
 * console.log('Claims over 90 days:', aging.over90Days);
 * ```
 */
export declare const generateClaimsAgingReport: (statuses: string[], asOfDate: Date) => Promise<Record<string, any>>;
/**
 * 15. Analyzes claims by cause of loss.
 *
 * @param {ProductLine} productLine - Product line
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<Array<{cause: string; count: number; totalIncurred: number; avgSeverity: number}>>} Cause analysis
 *
 * @example
 * ```typescript
 * const causes = await analyzeClaimsByCause('home', new Date('2024-01-01'), new Date('2024-12-31'));
 * causes.forEach(c => console.log(c.cause, c.count, c.avgSeverity));
 * ```
 */
export declare const analyzeClaimsByCause: (productLine: ProductLine, startDate: Date, endDate: Date) => Promise<Array<{
    cause: string;
    count: number;
    totalIncurred: number;
    avgSeverity: number;
}>>;
/**
 * 16. Calculates policy retention rate.
 *
 * @param {RetentionAnalysisConfig} config - Retention analysis configuration
 * @returns {Promise<RetentionMetrics>} Retention metrics
 *
 * @example
 * ```typescript
 * const retention = await calculateRetentionRate({
 *   productLine: ['auto'],
 *   cohortStartDate: new Date('2023-01-01'),
 *   analysisMonths: 24,
 *   segmentBy: 'tenure'
 * });
 * console.log('Retention rate:', retention.retentionRate);
 * ```
 */
export declare const calculateRetentionRate: (config: RetentionAnalysisConfig) => Promise<RetentionMetrics>;
/**
 * 17. Generates cohort retention analysis.
 *
 * @param {Date} cohortStartDate - Cohort start date
 * @param {number} cohorts - Number of cohorts
 * @param {number} analysisMonths - Analysis period months
 * @returns {Promise<Array<{cohort: string; retentionByMonth: number[]}>>} Cohort analysis
 *
 * @example
 * ```typescript
 * const cohorts = await generateCohortRetentionAnalysis(new Date('2023-01-01'), 12, 24);
 * cohorts.forEach(c => console.log(c.cohort, c.retentionByMonth));
 * ```
 */
export declare const generateCohortRetentionAnalysis: (cohortStartDate: Date, cohorts: number, analysisMonths: number) => Promise<Array<{
    cohort: string;
    retentionByMonth: number[];
}>>;
/**
 * 18. Analyzes churn by reason.
 *
 * @param {ProductLine[]} productLines - Product lines
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<Record<string, {count: number; percentage: number}>>} Churn reason analysis
 *
 * @example
 * ```typescript
 * const churnReasons = await analyzeChurnByReason(['auto', 'home'], new Date('2024-01-01'), new Date('2024-12-31'));
 * Object.keys(churnReasons).forEach(reason => {
 *   console.log(reason, churnReasons[reason].percentage);
 * });
 * ```
 */
export declare const analyzeChurnByReason: (productLines: ProductLine[], startDate: Date, endDate: Date) => Promise<Record<string, {
    count: number;
    percentage: number;
}>>;
/**
 * 19. Calculates customer lifetime value.
 *
 * @param {string} customerId - Customer ID
 * @param {number} discountRate - Discount rate for NPV calculation
 * @returns {Promise<{ltv: number; averageTenure: number; totalPremium: number; projectedValue: number}>} LTV metrics
 *
 * @example
 * ```typescript
 * const ltv = await calculateCustomerLifetimeValue('customer-123', 0.1);
 * console.log('Customer LTV:', ltv.ltv);
 * ```
 */
export declare const calculateCustomerLifetimeValue: (customerId: string, discountRate: number) => Promise<{
    ltv: number;
    averageTenure: number;
    totalPremium: number;
    projectedValue: number;
}>;
/**
 * 20. Identifies at-risk policies for retention campaigns.
 *
 * @param {number} churnProbabilityThreshold - Churn probability threshold (0-1)
 * @param {Date} asOfDate - Analysis as-of date
 * @returns {Promise<Array<{policyId: string; churnProbability: number; riskFactors: string[]}>>} At-risk policies
 *
 * @example
 * ```typescript
 * const atRisk = await identifyAtRiskPolicies(0.7, new Date());
 * console.log('At-risk policies:', atRisk.length);
 * ```
 */
export declare const identifyAtRiskPolicies: (churnProbabilityThreshold: number, asOfDate: Date) => Promise<Array<{
    policyId: string;
    churnProbability: number;
    riskFactors: string[];
}>>;
/**
 * 21. Generates new business production report.
 *
 * @param {NewBusinessConfig} config - New business configuration
 * @returns {Promise<NewBusinessMetrics>} New business metrics
 *
 * @example
 * ```typescript
 * const newBusiness = await generateNewBusinessReport({
 *   productLine: ['auto', 'home'],
 *   timePeriod: 'monthly',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   channel: ['agent', 'direct']
 * });
 * console.log('Bound policies:', newBusiness.boundPolicies);
 * ```
 */
export declare const generateNewBusinessReport: (config: NewBusinessConfig) => Promise<NewBusinessMetrics>;
/**
 * 22. Analyzes new business by source.
 *
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<Record<string, NewBusinessMetrics>>} New business by source
 *
 * @example
 * ```typescript
 * const bySource = await analyzeNewBusinessBySource(new Date('2024-01-01'), new Date('2024-12-31'));
 * Object.keys(bySource).forEach(source => {
 *   console.log(source, bySource[source].boundPolicies);
 * });
 * ```
 */
export declare const analyzeNewBusinessBySource: (startDate: Date, endDate: Date) => Promise<Record<string, NewBusinessMetrics>>;
/**
 * 23. Tracks new business pipeline.
 *
 * @param {ProductLine[]} productLines - Product lines
 * @param {Date} asOfDate - Pipeline as-of date
 * @returns {Promise<Record<string, any>>} Pipeline metrics
 *
 * @example
 * ```typescript
 * const pipeline = await trackNewBusinessPipeline(['auto', 'home'], new Date());
 * console.log('Quotes in progress:', pipeline.quotesInProgress);
 * ```
 */
export declare const trackNewBusinessPipeline: (productLines: ProductLine[], asOfDate: Date) => Promise<Record<string, any>>;
/**
 * 24. Calculates average time to bind.
 *
 * @param {ProductLine} productLine - Product line
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<{averageDays: number; median: number; percentiles: Record<string, number>}>} Time to bind metrics
 *
 * @example
 * ```typescript
 * const timeMetrics = await calculateAverageTimeToBind('auto', new Date('2024-01-01'), new Date('2024-12-31'));
 * console.log('Average days to bind:', timeMetrics.averageDays);
 * ```
 */
export declare const calculateAverageTimeToBind: (productLine: ProductLine, startDate: Date, endDate: Date) => Promise<{
    averageDays: number;
    median: number;
    percentiles: Record<string, number>;
}>;
/**
 * 25. Generates new business quality scorecard.
 *
 * @param {Date} startDate - Scorecard start date
 * @param {Date} endDate - Scorecard end date
 * @returns {Promise<Record<string, any>>} Quality scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateNewBusinessQualityScorecard(new Date('2024-01-01'), new Date('2024-12-31'));
 * console.log('Average loss ratio:', scorecard.averageLossRatio);
 * ```
 */
export declare const generateNewBusinessQualityScorecard: (startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * 26. Calculates renewal rate metrics.
 *
 * @param {ProductLine[]} productLines - Product lines
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<RenewalMetrics>} Renewal metrics
 *
 * @example
 * ```typescript
 * const renewals = await calculateRenewalRate(['auto', 'home'], new Date('2024-01-01'), new Date('2024-12-31'));
 * console.log('Renewal rate:', renewals.renewalRate);
 * ```
 */
export declare const calculateRenewalRate: (productLines: ProductLine[], startDate: Date, endDate: Date) => Promise<RenewalMetrics>;
/**
 * 27. Analyzes renewal rate change impact.
 *
 * @param {ProductLine} productLine - Product line
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<Record<string, any>>} Rate change impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeRenewalRateChange('auto', new Date('2024-01-01'), new Date('2024-12-31'));
 * console.log('Retention by rate change band:', impact.retentionByBand);
 * ```
 */
export declare const analyzeRenewalRateChange: (productLine: ProductLine, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * 28. Tracks renewal pipeline by month.
 *
 * @param {number} forecastMonths - Number of months to forecast
 * @param {Date} startDate - Forecast start date
 * @returns {Promise<Array<{month: string; renewalsDue: number; expectedRenewals: number; premiumAtRisk: number}>>} Pipeline forecast
 *
 * @example
 * ```typescript
 * const pipeline = await trackRenewalPipeline(6, new Date());
 * pipeline.forEach(p => console.log(p.month, p.renewalsDue));
 * ```
 */
export declare const trackRenewalPipeline: (forecastMonths: number, startDate: Date) => Promise<Array<{
    month: string;
    renewalsDue: number;
    expectedRenewals: number;
    premiumAtRisk: number;
}>>;
/**
 * 29. Identifies non-renewed policies for remarketing.
 *
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @returns {Promise<Array<{policyId: string; customerId: string; reason: string; winBackScore: number}>>} Non-renewed policies
 *
 * @example
 * ```typescript
 * const nonRenewed = await identifyNonRenewedPolicies(new Date('2024-01-01'), new Date('2024-12-31'));
 * console.log('Policies to remarket:', nonRenewed.length);
 * ```
 */
export declare const identifyNonRenewedPolicies: (startDate: Date, endDate: Date) => Promise<Array<{
    policyId: string;
    customerId: string;
    reason: string;
    winBackScore: number;
}>>;
/**
 * 30. Generates renewal offer optimization analysis.
 *
 * @param {ProductLine} productLine - Product line
 * @param {Date} asOfDate - Analysis as-of date
 * @returns {Promise<Record<string, any>>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = await generateRenewalOfferOptimization('auto', new Date());
 * console.log('Recommended rate adjustments:', optimization.recommendations);
 * ```
 */
export declare const generateRenewalOfferOptimization: (productLine: ProductLine, asOfDate: Date) => Promise<Record<string, any>>;
/**
 * 31. Analyzes cancellation patterns.
 *
 * @param {CancellationAnalysisConfig} config - Cancellation analysis configuration
 * @returns {Promise<CancellationMetrics>} Cancellation metrics
 *
 * @example
 * ```typescript
 * const cancellations = await analyzeCancellationPatterns({
 *   productLine: ['auto'],
 *   timePeriod: 'monthly',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   groupByReason: true
 * });
 * console.log('Cancellation rate:', cancellations.cancellationRate);
 * ```
 */
export declare const analyzeCancellationPatterns: (config: CancellationAnalysisConfig) => Promise<CancellationMetrics>;
/**
 * 32. Identifies preventable cancellations.
 *
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<{preventable: number; reasons: Record<string, number>; interventionOpportunities: string[]}>} Preventable analysis
 *
 * @example
 * ```typescript
 * const preventable = await identifyPreventableCancellations(new Date('2024-01-01'), new Date('2024-12-31'));
 * console.log('Preventable cancellations:', preventable.preventable);
 * ```
 */
export declare const identifyPreventableCancellations: (startDate: Date, endDate: Date) => Promise<{
    preventable: number;
    reasons: Record<string, number>;
    interventionOpportunities: string[];
}>;
/**
 * 33. Generates cancellation timing analysis.
 *
 * @param {ProductLine[]} productLines - Product lines
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<Record<string, any>>} Timing analysis
 *
 * @example
 * ```typescript
 * const timing = await generateCancellationTimingAnalysis(['auto', 'home'], new Date('2024-01-01'), new Date('2024-12-31'));
 * console.log('Cancellations by policy month:', timing.byPolicyMonth);
 * ```
 */
export declare const generateCancellationTimingAnalysis: (productLines: ProductLine[], startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * 34. Generates geographic performance report.
 *
 * @param {GeographicPerformanceConfig} config - Geographic performance configuration
 * @returns {Promise<GeographicMetrics[]>} Geographic metrics
 *
 * @example
 * ```typescript
 * const geoPerformance = await generateGeographicPerformanceReport({
 *   level: 'state',
 *   productLine: ['auto'],
 *   timePeriod: 'annual',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   metrics: ['premium', 'lossRatio', 'growthRate']
 * });
 * geoPerformance.forEach(g => console.log(g.location, g.premium, g.lossRatio));
 * ```
 */
export declare const generateGeographicPerformanceReport: (config: GeographicPerformanceConfig) => Promise<GeographicMetrics[]>;
/**
 * 35. Creates performance heatmap data.
 *
 * @param {string} metric - Metric to map (premium, lossRatio, growth)
 * @param {GeographicLevel} level - Geographic level
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<Array<{location: string; value: number; color: string}>>} Heatmap data
 *
 * @example
 * ```typescript
 * const heatmap = await createPerformanceHeatmap('lossRatio', 'state', new Date('2024-01-01'), new Date('2024-12-31'));
 * // Use heatmap data for visualization
 * ```
 */
export declare const createPerformanceHeatmap: (metric: string, level: GeographicLevel, startDate: Date, endDate: Date) => Promise<Array<{
    location: string;
    value: number;
    color: string;
}>>;
/**
 * 36. Analyzes market penetration by territory.
 *
 * @param {ProductLine} productLine - Product line
 * @param {Date} asOfDate - Analysis as-of date
 * @returns {Promise<Array<{territory: string; marketShare: number; potentialMarket: number; penetration: number}>>} Penetration analysis
 *
 * @example
 * ```typescript
 * const penetration = await analyzeMarketPenetration('auto', new Date());
 * penetration.forEach(p => console.log(p.territory, p.marketShare));
 * ```
 */
export declare const analyzeMarketPenetration: (productLine: ProductLine, asOfDate: Date) => Promise<Array<{
    territory: string;
    marketShare: number;
    potentialMarket: number;
    penetration: number;
}>>;
/**
 * 37. Generates product profitability analysis.
 *
 * @param {ProductProfitabilityConfig} config - Profitability configuration
 * @returns {Promise<Record<string, ProfitabilityMetrics>>} Profitability by product
 *
 * @example
 * ```typescript
 * const profitability = await generateProductProfitabilityAnalysis({
 *   productLine: ['auto', 'home', 'life'],
 *   timePeriod: 'annual',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   includeExpenses: true,
 *   allocationMethod: 'allocated'
 * });
 * Object.keys(profitability).forEach(product => {
 *   console.log(product, profitability[product].profitMargin);
 * });
 * ```
 */
export declare const generateProductProfitabilityAnalysis: (config: ProductProfitabilityConfig) => Promise<Record<string, ProfitabilityMetrics>>;
/**
 * 38. Calculates return on equity by product.
 *
 * @param {ProductLine[]} productLines - Product lines
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<Array<{product: string; roe: number; allocatedCapital: number; netIncome: number}>>} ROE analysis
 *
 * @example
 * ```typescript
 * const roe = await calculateROEByProduct(['auto', 'home'], new Date('2024-01-01'), new Date('2024-12-31'));
 * roe.forEach(r => console.log(r.product, r.roe));
 * ```
 */
export declare const calculateROEByProduct: (productLines: ProductLine[], startDate: Date, endDate: Date) => Promise<Array<{
    product: string;
    roe: number;
    allocatedCapital: number;
    netIncome: number;
}>>;
/**
 * 39. Generates agent performance scorecard.
 *
 * @param {AgentPerformanceConfig} config - Agent performance configuration
 * @returns {Promise<AgentPerformanceMetrics[]>} Agent performance metrics
 *
 * @example
 * ```typescript
 * const performance = await generateAgentPerformanceScorecard({
 *   timePeriod: 'monthly',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   metrics: ['totalPremium', 'retentionRate', 'lossRatio', 'quoteToBind']
 * });
 * performance.forEach(p => console.log(p.producerName, p.productivityScore));
 * ```
 */
export declare const generateAgentPerformanceScorecard: (config: AgentPerformanceConfig) => Promise<AgentPerformanceMetrics[]>;
/**
 * 40. Ranks top-performing agents.
 *
 * @param {string} rankBy - Metric to rank by (premium, retention, profitability)
 * @param {Date} startDate - Ranking period start
 * @param {Date} endDate - Ranking period end
 * @param {number} topN - Number of top agents to return
 * @returns {Promise<AgentPerformanceMetrics[]>} Top agent rankings
 *
 * @example
 * ```typescript
 * const topAgents = await rankTopPerformingAgents('totalPremium', new Date('2024-01-01'), new Date('2024-12-31'), 10);
 * topAgents.forEach((agent, index) => console.log(index + 1, agent.producerName, agent.totalPremium));
 * ```
 */
export declare const rankTopPerformingAgents: (rankBy: string, startDate: Date, endDate: Date, topN: number) => Promise<AgentPerformanceMetrics[]>;
/**
 * 41. Analyzes quote-to-bind conversion funnel.
 *
 * @param {ConversionFunnelConfig} config - Conversion funnel configuration
 * @returns {Promise<ConversionFunnelMetrics>} Funnel metrics
 *
 * @example
 * ```typescript
 * const funnel = await analyzeQuoteToBindFunnel({
 *   productLine: ['auto'],
 *   timePeriod: 'monthly',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   channel: ['agent', 'direct']
 * });
 * console.log('Quote to bind conversion:', funnel.overallConversion);
 * ```
 */
export declare const analyzeQuoteToBindFunnel: (config: ConversionFunnelConfig) => Promise<ConversionFunnelMetrics>;
/**
 * 42. Calculates customer acquisition cost.
 *
 * @param {CACConfig} config - CAC configuration
 * @returns {Promise<CACMetrics>} CAC metrics
 *
 * @example
 * ```typescript
 * const cac = await calculateCustomerAcquisitionCost({
 *   productLine: ['auto', 'home'],
 *   channel: ['digital', 'agent'],
 *   timePeriod: 'annual',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   includeOverhead: true
 * });
 * console.log('CAC:', cac.cac, 'LTV/CAC Ratio:', cac.ltvCacRatio);
 * ```
 */
export declare const calculateCustomerAcquisitionCost: (config: CACConfig) => Promise<CACMetrics>;
/**
 * 43. Generates predictive underwriting model.
 *
 * @param {PredictiveModelConfig} config - Model configuration
 * @returns {Promise<PredictiveModelResults>} Model results
 *
 * @example
 * ```typescript
 * const model = await generatePredictiveUnderwritingModel({
 *   modelType: 'loss_prediction',
 *   features: ['age', 'credit_score', 'prior_claims', 'location'],
 *   targetVariable: 'expected_loss',
 *   trainingDataMonths: 36,
 *   validationSplit: 0.2
 * });
 * console.log('Model accuracy:', model.accuracy);
 * ```
 */
export declare const generatePredictiveUnderwritingModel: (config: PredictiveModelConfig) => Promise<PredictiveModelResults>;
/**
 * 44. Analyzes risk portfolio composition.
 *
 * @param {RiskPortfolioConfig} config - Risk portfolio configuration
 * @returns {Promise<RiskPortfolioMetrics>} Portfolio metrics
 *
 * @example
 * ```typescript
 * const portfolio = await analyzeRiskPortfolio({
 *   productLine: ['auto', 'home', 'commercial'],
 *   asOfDate: new Date(),
 *   riskMetrics: ['concentration', 'diversification', 'pml'],
 *   concentrationThresholds: { geography: 0.2, product: 0.3 }
 * });
 * console.log('Diversification score:', portfolio.diversificationScore);
 * ```
 */
export declare const analyzeRiskPortfolio: (config: RiskPortfolioConfig) => Promise<RiskPortfolioMetrics>;
/**
 * 45. Generates regulatory compliance analytics report.
 *
 * @param {ComplianceReportConfig} config - Compliance report configuration
 * @returns {Promise<Record<string, any>>} Compliance report
 *
 * @example
 * ```typescript
 * const complianceReport = await generateComplianceAnalyticsReport({
 *   reportType: 'statutory',
 *   jurisdiction: 'NY',
 *   timePeriod: 'quarterly',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-03-31'),
 *   schedules: ['P', 'F']
 * });
 * console.log('Compliance status:', complianceReport.status);
 * ```
 */
export declare const generateComplianceAnalyticsReport: (config: ComplianceReportConfig) => Promise<Record<string, any>>;
declare const _default: {
    generatePremiumVolumeReport: (config: PremiumVolumeConfig) => Promise<PremiumMetrics>;
    calculatePremiumGrowth: (productLine: string, currentPeriodStart: Date, currentPeriodEnd: Date, priorPeriodStart: Date, priorPeriodEnd: Date) => Promise<{
        currentPremium: number;
        priorPremium: number;
        growthRate: number;
    }>;
    analyzePremiumByChannel: (startDate: Date, endDate: Date) => Promise<Record<string, PremiumMetrics>>;
    trackInForcePremiumTrends: (productLines: ProductLine[], months: number) => Promise<Array<{
        month: string;
        inForcePremium: number;
        change: number;
    }>>;
    generatePremiumConcentrationReport: (asOfDate: Date) => Promise<Record<string, any>>;
    generateLossRatioDashboard: (config: LossRatioConfig) => Promise<LossRatioMetrics>;
    calculateUltimateLossRatio: (productLine: string, accidentYear: number, developmentMonths: number) => Promise<{
        reportedLossRatio: number;
        ultimateLossRatio: number;
        ibnrFactor: number;
    }>;
    analyzeLossRatioByCoverage: (productLine: string, startDate: Date, endDate: Date) => Promise<Record<string, LossRatioMetrics>>;
    generateLossTriangle: (productLine: string, originYears: number, developmentYears: number) => Promise<number[][]>;
    compareActualVsTargetLossRatio: (productLines: ProductLine[], startDate: Date, endDate: Date) => Promise<Array<{
        product: string;
        actual: number;
        target: number;
        variance: number;
    }>>;
    calculateClaimsFrequency: (config: ClaimsAnalyticsConfig) => Promise<ClaimsFrequencyMetrics>;
    analyzeClaimsSeverity: (config: ClaimsAnalyticsConfig) => Promise<ClaimsSeverityMetrics>;
    identifyHighSeverityClaims: (severityThreshold: number, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    generateClaimsAgingReport: (statuses: string[], asOfDate: Date) => Promise<Record<string, any>>;
    analyzeClaimsByCause: (productLine: ProductLine, startDate: Date, endDate: Date) => Promise<Array<{
        cause: string;
        count: number;
        totalIncurred: number;
        avgSeverity: number;
    }>>;
    calculateRetentionRate: (config: RetentionAnalysisConfig) => Promise<RetentionMetrics>;
    generateCohortRetentionAnalysis: (cohortStartDate: Date, cohorts: number, analysisMonths: number) => Promise<Array<{
        cohort: string;
        retentionByMonth: number[];
    }>>;
    analyzeChurnByReason: (productLines: ProductLine[], startDate: Date, endDate: Date) => Promise<Record<string, {
        count: number;
        percentage: number;
    }>>;
    calculateCustomerLifetimeValue: (customerId: string, discountRate: number) => Promise<{
        ltv: number;
        averageTenure: number;
        totalPremium: number;
        projectedValue: number;
    }>;
    identifyAtRiskPolicies: (churnProbabilityThreshold: number, asOfDate: Date) => Promise<Array<{
        policyId: string;
        churnProbability: number;
        riskFactors: string[];
    }>>;
    generateNewBusinessReport: (config: NewBusinessConfig) => Promise<NewBusinessMetrics>;
    analyzeNewBusinessBySource: (startDate: Date, endDate: Date) => Promise<Record<string, NewBusinessMetrics>>;
    trackNewBusinessPipeline: (productLines: ProductLine[], asOfDate: Date) => Promise<Record<string, any>>;
    calculateAverageTimeToBind: (productLine: ProductLine, startDate: Date, endDate: Date) => Promise<{
        averageDays: number;
        median: number;
        percentiles: Record<string, number>;
    }>;
    generateNewBusinessQualityScorecard: (startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    calculateRenewalRate: (productLines: ProductLine[], startDate: Date, endDate: Date) => Promise<RenewalMetrics>;
    analyzeRenewalRateChange: (productLine: ProductLine, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    trackRenewalPipeline: (forecastMonths: number, startDate: Date) => Promise<Array<{
        month: string;
        renewalsDue: number;
        expectedRenewals: number;
        premiumAtRisk: number;
    }>>;
    identifyNonRenewedPolicies: (startDate: Date, endDate: Date) => Promise<Array<{
        policyId: string;
        customerId: string;
        reason: string;
        winBackScore: number;
    }>>;
    generateRenewalOfferOptimization: (productLine: ProductLine, asOfDate: Date) => Promise<Record<string, any>>;
    analyzeCancellationPatterns: (config: CancellationAnalysisConfig) => Promise<CancellationMetrics>;
    identifyPreventableCancellations: (startDate: Date, endDate: Date) => Promise<{
        preventable: number;
        reasons: Record<string, number>;
        interventionOpportunities: string[];
    }>;
    generateCancellationTimingAnalysis: (productLines: ProductLine[], startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    generateGeographicPerformanceReport: (config: GeographicPerformanceConfig) => Promise<GeographicMetrics[]>;
    createPerformanceHeatmap: (metric: string, level: GeographicLevel, startDate: Date, endDate: Date) => Promise<Array<{
        location: string;
        value: number;
        color: string;
    }>>;
    analyzeMarketPenetration: (productLine: ProductLine, asOfDate: Date) => Promise<Array<{
        territory: string;
        marketShare: number;
        potentialMarket: number;
        penetration: number;
    }>>;
    generateProductProfitabilityAnalysis: (config: ProductProfitabilityConfig) => Promise<Record<string, ProfitabilityMetrics>>;
    calculateROEByProduct: (productLines: ProductLine[], startDate: Date, endDate: Date) => Promise<Array<{
        product: string;
        roe: number;
        allocatedCapital: number;
        netIncome: number;
    }>>;
    generateAgentPerformanceScorecard: (config: AgentPerformanceConfig) => Promise<AgentPerformanceMetrics[]>;
    rankTopPerformingAgents: (rankBy: string, startDate: Date, endDate: Date, topN: number) => Promise<AgentPerformanceMetrics[]>;
    analyzeQuoteToBindFunnel: (config: ConversionFunnelConfig) => Promise<ConversionFunnelMetrics>;
    calculateCustomerAcquisitionCost: (config: CACConfig) => Promise<CACMetrics>;
    generatePredictiveUnderwritingModel: (config: PredictiveModelConfig) => Promise<PredictiveModelResults>;
    analyzeRiskPortfolio: (config: RiskPortfolioConfig) => Promise<RiskPortfolioMetrics>;
    generateComplianceAnalyticsReport: (config: ComplianceReportConfig) => Promise<Record<string, any>>;
    createPremiumAnalyticsModel: (sequelize: Sequelize) => any;
    createLossRatioAnalyticsModel: (sequelize: Sequelize) => any;
    createAgentPerformanceAnalyticsModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=analytics-reporting-kit.d.ts.map