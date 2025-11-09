/**
 * LOC: SECANALYTICS9876
 * File: /reuse/threat/security-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Security analytics services
 *   - Threat intelligence modules
 *   - Predictive analytics services
 *   - Machine learning pipelines
 *   - Data mining services
 */
/**
 * File: /reuse/threat/security-analytics-kit.ts
 * Locator: WC-SECURITY-ANALYTICS-001
 * Purpose: Comprehensive Security Analytics Toolkit - Production-ready analytics and intelligence operations
 *
 * Upstream: Independent utility module for security analytics operations
 * Downstream: ../backend/*, Analytics services, ML pipelines, Data mining, Predictive analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript
 * Exports: 48 utility functions for analytics, forecasting, ML, correlation, pattern recognition
 *
 * LLM Context: Enterprise-grade security analytics toolkit for White Cross healthcare platform.
 * Provides comprehensive security analytics engine, trend analysis and forecasting, predictive
 * analytics for threats, correlation analysis across security data, security data warehouse
 * management, machine learning integration, statistical analysis, time series analysis, pattern
 * recognition, anomaly detection, risk scoring models, threat scoring aggregation, security metric
 * calculations, data mining for threats, behavioral analytics, advanced visualizations, custom
 * analytics queries, and real-time analytics streaming for HIPAA-compliant healthcare systems.
 */
import { Model } from 'sequelize-typescript';
/**
 * Analytics query type
 */
export declare enum AnalyticsQueryType {
    AGGREGATION = "AGGREGATION",
    TIME_SERIES = "TIME_SERIES",
    CORRELATION = "CORRELATION",
    PATTERN_MATCHING = "PATTERN_MATCHING",
    ANOMALY_DETECTION = "ANOMALY_DETECTION",
    PREDICTIVE = "PREDICTIVE",
    STATISTICAL = "STATISTICAL",
    BEHAVIORAL = "BEHAVIORAL"
}
/**
 * Time series granularity
 */
export declare enum TimeGranularity {
    MINUTE = "MINUTE",
    HOUR = "HOUR",
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    QUARTER = "QUARTER",
    YEAR = "YEAR"
}
/**
 * Trend direction
 */
export declare enum TrendDirection {
    INCREASING = "INCREASING",
    DECREASING = "DECREASING",
    STABLE = "STABLE",
    VOLATILE = "VOLATILE",
    CYCLICAL = "CYCLICAL"
}
/**
 * Anomaly severity
 */
export declare enum AnomalySeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFO = "INFO"
}
/**
 * ML model type
 */
export declare enum MLModelType {
    CLASSIFICATION = "CLASSIFICATION",
    REGRESSION = "REGRESSION",
    CLUSTERING = "CLUSTERING",
    TIME_SERIES_FORECAST = "TIME_SERIES_FORECAST",
    ANOMALY_DETECTION = "ANOMALY_DETECTION",
    NEURAL_NETWORK = "NEURAL_NETWORK"
}
/**
 * Analytics result interface
 */
export interface AnalyticsResult {
    queryId: string;
    queryType: AnalyticsQueryType;
    executionTime: number;
    rowCount: number;
    data: any[];
    metadata: Record<string, any>;
    timestamp: Date;
}
/**
 * Time series data point
 */
export interface TimeSeriesDataPoint {
    timestamp: Date;
    value: number;
    label?: string;
    metadata?: Record<string, any>;
}
/**
 * Trend analysis result
 */
export interface TrendAnalysisResult {
    direction: TrendDirection;
    slope: number;
    rSquared: number;
    forecast: TimeSeriesDataPoint[];
    confidence: number;
    seasonality?: {
        detected: boolean;
        period?: number;
        strength?: number;
    };
}
/**
 * Correlation result
 */
export interface CorrelationResult {
    metric1: string;
    metric2: string;
    coefficient: number;
    pValue: number;
    significance: 'STRONG' | 'MODERATE' | 'WEAK' | 'NONE';
    type: 'POSITIVE' | 'NEGATIVE' | 'NONE';
}
/**
 * Anomaly detection result
 */
export interface AnomalyDetectionResult {
    anomalyId: string;
    timestamp: Date;
    metric: string;
    expectedValue: number;
    actualValue: number;
    deviation: number;
    severity: AnomalySeverity;
    confidence: number;
    context: Record<string, any>;
}
/**
 * Pattern recognition result
 */
export interface PatternRecognitionResult {
    patternId: string;
    patternType: string;
    occurrences: number;
    confidence: number;
    examples: any[];
    metadata: Record<string, any>;
}
/**
 * Risk score calculation
 */
export interface RiskScoreCalculation {
    entityId: string;
    entityType: string;
    riskScore: number;
    factors: Array<{
        factor: string;
        weight: number;
        value: number;
        contribution: number;
    }>;
    confidence: number;
    timestamp: Date;
}
/**
 * Behavioral profile
 */
export interface BehavioralProfile {
    entityId: string;
    entityType: string;
    baseline: Record<string, any>;
    current: Record<string, any>;
    deviations: Array<{
        metric: string;
        expected: number;
        actual: number;
        deviation: number;
    }>;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
/**
 * Analytics Query Model
 */
export declare class AnalyticsQuery extends Model {
    id: string;
    queryName: string;
    queryType: AnalyticsQueryType;
    queryDefinition: string;
    parameters: Record<string, any>;
    executionCount: number;
    avgExecutionTime: number;
    createdBy: string;
}
/**
 * ML Model Registry
 */
export declare class MLModel extends Model {
    id: string;
    modelName: string;
    modelType: MLModelType;
    version: string;
    hyperparameters: Record<string, any>;
    performanceMetrics: Record<string, any>;
    isActive: boolean;
    trainedAt: Date;
    trainedBy: string;
}
/**
 * Executes a custom analytics query against security data.
 *
 * @param queryDefinition - SQL or analytics query definition
 * @param parameters - Query parameters
 * @returns Analytics result with data and metadata
 *
 * @example
 * ```typescript
 * const result = await executeAnalyticsQuery(
 *   'SELECT severity, COUNT(*) FROM threats WHERE timestamp > :start GROUP BY severity',
 *   { start: new Date('2025-01-01') }
 * );
 * ```
 */
export declare function executeAnalyticsQuery(queryDefinition: string, parameters?: Record<string, any>): Promise<AnalyticsResult>;
/**
 * Aggregates security metrics across multiple dimensions.
 *
 * @param metrics - Metrics to aggregate
 * @param dimensions - Grouping dimensions
 * @param filters - Optional filters
 * @returns Aggregated metrics
 *
 * @example
 * ```typescript
 * const aggregated = await aggregateSecurityMetrics(
 *   ['threatCount', 'avgSeverity'],
 *   ['department', 'assetType'],
 *   { dateRange: { start: '2025-01-01', end: '2025-01-31' } }
 * );
 * ```
 */
export declare function aggregateSecurityMetrics(metrics: string[], dimensions: string[], filters?: Record<string, any>): Promise<AnalyticsResult>;
/**
 * Performs real-time streaming analytics on security events.
 *
 * @param streamName - Name of the event stream
 * @param windowSize - Time window in seconds
 * @param aggregations - Aggregations to compute
 * @returns Streaming analytics results
 *
 * @example
 * ```typescript
 * const stream = await streamSecurityAnalytics('threatEvents', 60, ['count', 'avgSeverity']);
 * ```
 */
export declare function streamSecurityAnalytics(streamName: string, windowSize: number, aggregations: string[]): Promise<AsyncIterable<AnalyticsResult>>;
/**
 * Creates a custom analytics query template.
 *
 * @param queryName - Name of the query
 * @param queryType - Type of analytics query
 * @param queryDefinition - Query definition/template
 * @param parameters - Default parameters
 * @returns Created query template
 *
 * @example
 * ```typescript
 * const template = await createAnalyticsQueryTemplate(
 *   'Daily Threat Summary',
 *   AnalyticsQueryType.AGGREGATION,
 *   'SELECT * FROM threats WHERE date = :date',
 *   { date: new Date() }
 * );
 * ```
 */
export declare function createAnalyticsQueryTemplate(queryName: string, queryType: AnalyticsQueryType, queryDefinition: string, parameters?: Record<string, any>): Promise<AnalyticsQuery>;
/**
 * Optimizes analytics query performance.
 *
 * @param queryId - Query ID to optimize
 * @returns Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimizations = await optimizeAnalyticsQuery('QRY-123');
 * ```
 */
export declare function optimizeAnalyticsQuery(queryId: string): Promise<{
    recommendations: string[];
    estimatedImprovement: number;
}>;
/**
 * Exports analytics results to various formats.
 *
 * @param result - Analytics result to export
 * @param format - Export format
 * @returns Exported data buffer
 *
 * @example
 * ```typescript
 * const csvBuffer = await exportAnalyticsResult(result, 'CSV');
 * ```
 */
export declare function exportAnalyticsResult(result: AnalyticsResult, format: 'CSV' | 'JSON' | 'EXCEL' | 'PDF'): Promise<Buffer>;
/**
 * Schedules recurring analytics job.
 *
 * @param queryId - Query to schedule
 * @param schedule - Cron schedule
 * @param recipients - Email recipients
 * @returns Schedule configuration
 *
 * @example
 * ```typescript
 * const schedule = await scheduleAnalyticsJob('QRY-123', '0 8 * * *', ['security@example.com']);
 * ```
 */
export declare function scheduleAnalyticsJob(queryId: string, schedule: string, recipients: string[]): Promise<{
    jobId: string;
    nextRun: Date;
}>;
/**
 * Calculates analytics data warehouse storage metrics.
 *
 * @returns Storage metrics and recommendations
 *
 * @example
 * ```typescript
 * const storage = await calculateDataWarehouseMetrics();
 * ```
 */
export declare function calculateDataWarehouseMetrics(): Promise<{
    totalSize: number;
    rowCount: number;
    avgQueryTime: number;
    recommendations: string[];
}>;
/**
 * Analyzes trends in security metrics over time.
 *
 * @param metric - Metric to analyze
 * @param dataPoints - Historical data points
 * @returns Trend analysis result
 *
 * @example
 * ```typescript
 * const trend = await analyzeTrend('threatCount', historicalData);
 * ```
 */
export declare function analyzeTrend(metric: string, dataPoints: TimeSeriesDataPoint[]): Promise<TrendAnalysisResult>;
/**
 * Forecasts future security metric values.
 *
 * @param metric - Metric to forecast
 * @param historicalData - Historical data
 * @param periods - Number of periods to forecast
 * @returns Forecasted values
 *
 * @example
 * ```typescript
 * const forecast = await forecastMetric('incidentCount', data, 30);
 * ```
 */
export declare function forecastMetric(metric: string, historicalData: TimeSeriesDataPoint[], periods: number): Promise<TimeSeriesDataPoint[]>;
/**
 * Detects seasonality in time series data.
 *
 * @param dataPoints - Time series data
 * @returns Seasonality detection result
 *
 * @example
 * ```typescript
 * const seasonality = await detectSeasonality(monthlyData);
 * ```
 */
export declare function detectSeasonality(dataPoints: TimeSeriesDataPoint[]): Promise<{
    detected: boolean;
    period?: number;
    strength?: number;
    pattern?: string;
}>;
/**
 * Performs moving average calculation.
 *
 * @param dataPoints - Time series data
 * @param windowSize - Moving average window
 * @returns Smoothed data
 *
 * @example
 * ```typescript
 * const smoothed = await calculateMovingAverage(data, 7);
 * ```
 */
export declare function calculateMovingAverage(dataPoints: TimeSeriesDataPoint[], windowSize: number): Promise<TimeSeriesDataPoint[]>;
/**
 * Calculates exponential weighted moving average.
 *
 * @param dataPoints - Time series data
 * @param alpha - Smoothing factor (0-1)
 * @returns EWMA values
 *
 * @example
 * ```typescript
 * const ewma = await calculateEWMA(data, 0.3);
 * ```
 */
export declare function calculateEWMA(dataPoints: TimeSeriesDataPoint[], alpha: number): Promise<TimeSeriesDataPoint[]>;
/**
 * Identifies change points in time series.
 *
 * @param dataPoints - Time series data
 * @param sensitivity - Detection sensitivity
 * @returns Change points
 *
 * @example
 * ```typescript
 * const changes = await identifyChangePoints(data, 0.8);
 * ```
 */
export declare function identifyChangePoints(dataPoints: TimeSeriesDataPoint[], sensitivity: number): Promise<Array<{
    timestamp: Date;
    magnitude: number;
    direction: 'INCREASE' | 'DECREASE';
}>>;
/**
 * Performs time series decomposition.
 *
 * @param dataPoints - Time series data
 * @returns Trend, seasonal, and residual components
 *
 * @example
 * ```typescript
 * const decomposition = await decomposeTimeSeries(data);
 * ```
 */
export declare function decomposeTimeSeries(dataPoints: TimeSeriesDataPoint[]): Promise<{
    trend: TimeSeriesDataPoint[];
    seasonal: TimeSeriesDataPoint[];
    residual: TimeSeriesDataPoint[];
}>;
/**
 * Calculates forecast confidence intervals.
 *
 * @param forecast - Forecast values
 * @param confidenceLevel - Confidence level (0-1)
 * @returns Confidence intervals
 *
 * @example
 * ```typescript
 * const intervals = await calculateForecastIntervals(forecast, 0.95);
 * ```
 */
export declare function calculateForecastIntervals(forecast: TimeSeriesDataPoint[], confidenceLevel: number): Promise<Array<{
    timestamp: Date;
    lower: number;
    upper: number;
    median: number;
}>>;
/**
 * Trains a machine learning model for threat prediction.
 *
 * @param modelName - Model name
 * @param modelType - Type of ML model
 * @param trainingData - Training dataset
 * @param hyperparameters - Model hyperparameters
 * @returns Trained model
 *
 * @example
 * ```typescript
 * const model = await trainMLModel('ThreatClassifier', MLModelType.CLASSIFICATION, data, { maxDepth: 10 });
 * ```
 */
export declare function trainMLModel(modelName: string, modelType: MLModelType, trainingData: any[], hyperparameters: Record<string, any>): Promise<MLModel>;
/**
 * Evaluates ML model performance.
 *
 * @param modelId - Model ID
 * @param testData - Test dataset
 * @returns Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await evaluateMLModel('MODEL-123', testData);
 * ```
 */
export declare function evaluateMLModel(modelId: string, testData: any[]): Promise<{
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix: number[][];
}>;
/**
 * Makes predictions using trained ML model.
 *
 * @param modelId - Model ID
 * @param inputData - Input features
 * @returns Predictions with confidence
 *
 * @example
 * ```typescript
 * const predictions = await predictWithMLModel('MODEL-123', features);
 * ```
 */
export declare function predictWithMLModel(modelId: string, inputData: any[]): Promise<Array<{
    prediction: any;
    confidence: number;
    metadata: Record<string, any>;
}>>;
/**
 * Performs feature importance analysis.
 *
 * @param modelId - Model ID
 * @returns Feature importance scores
 *
 * @example
 * ```typescript
 * const importance = await analyzeFeatureImportance('MODEL-123');
 * ```
 */
export declare function analyzeFeatureImportance(modelId: string): Promise<Array<{
    feature: string;
    importance: number;
}>>;
/**
 * Performs hyperparameter tuning.
 *
 * @param modelName - Model name
 * @param modelType - Model type
 * @param paramGrid - Parameter grid to search
 * @param trainingData - Training data
 * @returns Best parameters and score
 *
 * @example
 * ```typescript
 * const best = await tuneHyperparameters('Classifier', MLModelType.CLASSIFICATION, paramGrid, data);
 * ```
 */
export declare function tuneHyperparameters(modelName: string, modelType: MLModelType, paramGrid: Record<string, any[]>, trainingData: any[]): Promise<{
    bestParams: Record<string, any>;
    bestScore: number;
}>;
/**
 * Deploys ML model to production.
 *
 * @param modelId - Model ID to deploy
 * @returns Deployment status
 *
 * @example
 * ```typescript
 * const status = await deployMLModel('MODEL-123');
 * ```
 */
export declare function deployMLModel(modelId: string): Promise<{
    deployed: boolean;
    endpointUrl: string;
}>;
/**
 * Monitors ML model drift.
 *
 * @param modelId - Model ID
 * @param recentData - Recent prediction data
 * @returns Drift metrics
 *
 * @example
 * ```typescript
 * const drift = await monitorModelDrift('MODEL-123', recentData);
 * ```
 */
export declare function monitorModelDrift(modelId: string, recentData: any[]): Promise<{
    dataDrift: number;
    conceptDrift: number;
    requiresRetraining: boolean;
}>;
/**
 * Generates model explainability report.
 *
 * @param modelId - Model ID
 * @param prediction - Specific prediction to explain
 * @returns Explainability insights
 *
 * @example
 * ```typescript
 * const explanation = await explainPrediction('MODEL-123', predictionData);
 * ```
 */
export declare function explainPrediction(modelId: string, prediction: any): Promise<{
    topFeatures: Array<{
        feature: string;
        contribution: number;
    }>;
    confidence: number;
    explanation: string;
}>;
/**
 * Calculates correlation between security metrics.
 *
 * @param metric1 - First metric
 * @param metric2 - Second metric
 * @param data - Data points
 * @returns Correlation result
 *
 * @example
 * ```typescript
 * const corr = await calculateCorrelation('incidentCount', 'vulnerabilityCount', data);
 * ```
 */
export declare function calculateCorrelation(metric1: string, metric2: string, data: Array<{
    [key: string]: number;
}>): Promise<CorrelationResult>;
/**
 * Performs multivariate correlation analysis.
 *
 * @param metrics - List of metrics
 * @param data - Data points
 * @returns Correlation matrix
 *
 * @example
 * ```typescript
 * const matrix = await calculateCorrelationMatrix(['metric1', 'metric2', 'metric3'], data);
 * ```
 */
export declare function calculateCorrelationMatrix(metrics: string[], data: Array<{
    [key: string]: number;
}>): Promise<number[][]>;
/**
 * Identifies correlated security events.
 *
 * @param events - Security events
 * @param threshold - Correlation threshold
 * @returns Correlated event groups
 *
 * @example
 * ```typescript
 * const groups = await identifyCorrelatedEvents(events, 0.7);
 * ```
 */
export declare function identifyCorrelatedEvents(events: any[], threshold: number): Promise<Array<{
    events: any[];
    correlation: number;
}>>;
/**
 * Performs causal analysis between metrics.
 *
 * @param causeMetric - Potential cause metric
 * @param effectMetric - Potential effect metric
 * @param data - Time series data
 * @returns Causality analysis result
 *
 * @example
 * ```typescript
 * const causality = await analyzeCausality('vulnerabilities', 'incidents', data);
 * ```
 */
export declare function analyzeCausality(causeMetric: string, effectMetric: string, data: TimeSeriesDataPoint[]): Promise<{
    causalityScore: number;
    lagPeriod: number;
    confidence: number;
    significant: boolean;
}>;
/**
 * Creates correlation heatmap data.
 *
 * @param metrics - Metrics to include
 * @param data - Data points
 * @returns Heatmap data structure
 *
 * @example
 * ```typescript
 * const heatmap = await createCorrelationHeatmap(metrics, data);
 * ```
 */
export declare function createCorrelationHeatmap(metrics: string[], data: Array<{
    [key: string]: number;
}>): Promise<{
    metrics: string[];
    values: number[][];
    labels: string[][];
}>;
/**
 * Detects spurious correlations.
 *
 * @param correlations - Correlation results
 * @returns Filtered correlations removing spurious ones
 *
 * @example
 * ```typescript
 * const valid = await filterSpuriousCorrelations(correlations);
 * ```
 */
export declare function filterSpuriousCorrelations(correlations: CorrelationResult[]): Promise<CorrelationResult[]>;
/**
 * Performs partial correlation analysis.
 *
 * @param metric1 - First metric
 * @param metric2 - Second metric
 * @param controlMetrics - Metrics to control for
 * @param data - Data points
 * @returns Partial correlation
 *
 * @example
 * ```typescript
 * const partial = await calculatePartialCorrelation('A', 'B', ['C', 'D'], data);
 * ```
 */
export declare function calculatePartialCorrelation(metric1: string, metric2: string, controlMetrics: string[], data: any[]): Promise<{
    coefficient: number;
    pValue: number;
}>;
/**
 * Analyzes correlation stability over time.
 *
 * @param metric1 - First metric
 * @param metric2 - Second metric
 * @param data - Time series data
 * @param windowSize - Rolling window size
 * @returns Rolling correlations
 *
 * @example
 * ```typescript
 * const rolling = await analyzeRollingCorrelation('A', 'B', data, 30);
 * ```
 */
export declare function analyzeRollingCorrelation(metric1: string, metric2: string, data: TimeSeriesDataPoint[], windowSize: number): Promise<TimeSeriesDataPoint[]>;
/**
 * Detects patterns in security event sequences.
 *
 * @param events - Security events
 * @param minSupport - Minimum support threshold
 * @returns Detected patterns
 *
 * @example
 * ```typescript
 * const patterns = await detectEventPatterns(events, 0.3);
 * ```
 */
export declare function detectEventPatterns(events: any[], minSupport: number): Promise<PatternRecognitionResult[]>;
/**
 * Identifies recurring attack patterns.
 *
 * @param incidents - Security incidents
 * @returns Attack pattern clusters
 *
 * @example
 * ```typescript
 * const attackPatterns = await identifyAttackPatterns(incidents);
 * ```
 */
export declare function identifyAttackPatterns(incidents: any[]): Promise<Array<{
    patternName: string;
    incidents: any[];
    commonFeatures: string[];
    riskLevel: string;
}>>;
/**
 * Performs clustering analysis on security data.
 *
 * @param data - Data points
 * @param numClusters - Number of clusters
 * @returns Cluster assignments and centroids
 *
 * @example
 * ```typescript
 * const clusters = await clusterSecurityData(data, 5);
 * ```
 */
export declare function clusterSecurityData(data: any[], numClusters: number): Promise<{
    clusters: Array<{
        id: number;
        center: any;
        members: any[];
    }>;
    silhouetteScore: number;
}>;
/**
 * Detects outliers in security metrics.
 *
 * @param data - Data points
 * @param method - Outlier detection method
 * @returns Detected outliers
 *
 * @example
 * ```typescript
 * const outliers = await detectOutliers(data, 'IQR');
 * ```
 */
export declare function detectOutliers(data: number[], method: 'IQR' | 'ZSCORE' | 'ISOLATION_FOREST'): Promise<Array<{
    index: number;
    value: number;
    score: number;
}>>;
/**
 * Performs association rule mining.
 *
 * @param transactions - Transaction data
 * @param minSupport - Minimum support
 * @param minConfidence - Minimum confidence
 * @returns Association rules
 *
 * @example
 * ```typescript
 * const rules = await mineAssociationRules(transactions, 0.3, 0.7);
 * ```
 */
export declare function mineAssociationRules(transactions: any[][], minSupport: number, minConfidence: number): Promise<Array<{
    antecedent: any[];
    consequent: any[];
    support: number;
    confidence: number;
    lift: number;
}>>;
/**
 * Detects regime changes in security posture.
 *
 * @param data - Time series data
 * @returns Regime change points
 *
 * @example
 * ```typescript
 * const regimes = await detectRegimeChanges(data);
 * ```
 */
export declare function detectRegimeChanges(data: TimeSeriesDataPoint[]): Promise<Array<{
    timestamp: Date;
    oldRegime: string;
    newRegime: string;
    confidence: number;
}>>;
/**
 * Analyzes behavioral patterns.
 *
 * @param entityId - Entity to analyze
 * @param events - Entity events
 * @returns Behavioral pattern analysis
 *
 * @example
 * ```typescript
 * const behavior = await analyzeBehavioralPatterns('USER-123', events);
 * ```
 */
export declare function analyzeBehavioralPatterns(entityId: string, events: any[]): Promise<{
    normalBehavior: Record<string, any>;
    deviations: Array<{
        pattern: string;
        severity: string;
    }>;
    riskScore: number;
}>;
/**
 * Creates pattern templates for matching.
 *
 * @param patternName - Pattern name
 * @param patternDefinition - Pattern definition
 * @returns Created pattern template
 *
 * @example
 * ```typescript
 * const template = await createPatternTemplate('SQL Injection', sqlInjectionPattern);
 * ```
 */
export declare function createPatternTemplate(patternName: string, patternDefinition: Record<string, any>): Promise<{
    templateId: string;
    pattern: Record<string, any>;
}>;
/**
 * Detects anomalies using statistical methods.
 *
 * @param data - Data points
 * @param threshold - Z-score threshold
 * @returns Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectStatisticalAnomalies(data, 3.0);
 * ```
 */
export declare function detectStatisticalAnomalies(data: number[], threshold: number): Promise<AnomalyDetectionResult[]>;
/**
 * Performs multivariate anomaly detection.
 *
 * @param data - Multi-dimensional data
 * @returns Multivariate anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectMultivariateAnomalies(multiDimData);
 * ```
 */
export declare function detectMultivariateAnomalies(data: Array<Record<string, number>>): Promise<AnomalyDetectionResult[]>;
/**
 * Detects time series anomalies.
 *
 * @param data - Time series data
 * @param method - Detection method
 * @returns Time series anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectTimeSeriesAnomalies(data, 'STL');
 * ```
 */
export declare function detectTimeSeriesAnomalies(data: TimeSeriesDataPoint[], method: 'STL' | 'ARIMA' | 'PROPHET'): Promise<AnomalyDetectionResult[]>;
/**
 * Applies isolation forest for anomaly detection.
 *
 * @param data - Data points
 * @param contamination - Expected contamination rate
 * @returns Isolation forest anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await applyIsolationForest(data, 0.1);
 * ```
 */
export declare function applyIsolationForest(data: any[], contamination: number): Promise<AnomalyDetectionResult[]>;
/**
 * Detects contextual anomalies.
 *
 * @param data - Data with context
 * @param contextFields - Context field names
 * @returns Contextual anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectContextualAnomalies(data, ['time', 'location']);
 * ```
 */
export declare function detectContextualAnomalies(data: Array<Record<string, any>>, contextFields: string[]): Promise<AnomalyDetectionResult[]>;
/**
 * Calculates anomaly scores for all data points.
 *
 * @param data - Data points
 * @param method - Scoring method
 * @returns Anomaly scores
 *
 * @example
 * ```typescript
 * const scores = await calculateAnomalyScores(data, 'LOF');
 * ```
 */
export declare function calculateAnomalyScores(data: any[], method: 'LOF' | 'KNN' | 'DBSCAN'): Promise<Array<{
    index: number;
    score: number;
}>>;
/**
 * Performs adaptive anomaly detection with learning.
 *
 * @param stream - Data stream
 * @param adaptationRate - Learning rate
 * @returns Adaptive anomaly detector
 *
 * @example
 * ```typescript
 * const detector = await createAdaptiveAnomalyDetector(stream, 0.01);
 * ```
 */
export declare function createAdaptiveAnomalyDetector(stream: AsyncIterable<any>, adaptationRate: number): Promise<{
    detect: (dataPoint: any) => Promise<boolean>;
    update: (dataPoint: any, isAnomaly: boolean) => Promise<void>;
}>;
/**
 * Generates anomaly detection report.
 *
 * @param anomalies - Detected anomalies
 * @param timeRange - Time range
 * @returns Anomaly report
 *
 * @example
 * ```typescript
 * const report = await generateAnomalyReport(anomalies, { start, end });
 * ```
 */
export declare function generateAnomalyReport(anomalies: AnomalyDetectionResult[], timeRange: {
    start: Date;
    end: Date;
}): Promise<{
    totalAnomalies: number;
    bySeverity: Record<string, number>;
    timeline: TimeSeriesDataPoint[];
    recommendations: string[];
}>;
declare const _default: {
    executeAnalyticsQuery: typeof executeAnalyticsQuery;
    aggregateSecurityMetrics: typeof aggregateSecurityMetrics;
    streamSecurityAnalytics: typeof streamSecurityAnalytics;
    createAnalyticsQueryTemplate: typeof createAnalyticsQueryTemplate;
    optimizeAnalyticsQuery: typeof optimizeAnalyticsQuery;
    exportAnalyticsResult: typeof exportAnalyticsResult;
    scheduleAnalyticsJob: typeof scheduleAnalyticsJob;
    calculateDataWarehouseMetrics: typeof calculateDataWarehouseMetrics;
    analyzeTrend: typeof analyzeTrend;
    forecastMetric: typeof forecastMetric;
    detectSeasonality: typeof detectSeasonality;
    calculateMovingAverage: typeof calculateMovingAverage;
    calculateEWMA: typeof calculateEWMA;
    identifyChangePoints: typeof identifyChangePoints;
    decomposeTimeSeries: typeof decomposeTimeSeries;
    calculateForecastIntervals: typeof calculateForecastIntervals;
    trainMLModel: typeof trainMLModel;
    evaluateMLModel: typeof evaluateMLModel;
    predictWithMLModel: typeof predictWithMLModel;
    analyzeFeatureImportance: typeof analyzeFeatureImportance;
    tuneHyperparameters: typeof tuneHyperparameters;
    deployMLModel: typeof deployMLModel;
    monitorModelDrift: typeof monitorModelDrift;
    explainPrediction: typeof explainPrediction;
    calculateCorrelation: typeof calculateCorrelation;
    calculateCorrelationMatrix: typeof calculateCorrelationMatrix;
    identifyCorrelatedEvents: typeof identifyCorrelatedEvents;
    analyzeCausality: typeof analyzeCausality;
    createCorrelationHeatmap: typeof createCorrelationHeatmap;
    filterSpuriousCorrelations: typeof filterSpuriousCorrelations;
    calculatePartialCorrelation: typeof calculatePartialCorrelation;
    analyzeRollingCorrelation: typeof analyzeRollingCorrelation;
    detectEventPatterns: typeof detectEventPatterns;
    identifyAttackPatterns: typeof identifyAttackPatterns;
    clusterSecurityData: typeof clusterSecurityData;
    detectOutliers: typeof detectOutliers;
    mineAssociationRules: typeof mineAssociationRules;
    detectRegimeChanges: typeof detectRegimeChanges;
    analyzeBehavioralPatterns: typeof analyzeBehavioralPatterns;
    createPatternTemplate: typeof createPatternTemplate;
    detectStatisticalAnomalies: typeof detectStatisticalAnomalies;
    detectMultivariateAnomalies: typeof detectMultivariateAnomalies;
    detectTimeSeriesAnomalies: typeof detectTimeSeriesAnomalies;
    applyIsolationForest: typeof applyIsolationForest;
    detectContextualAnomalies: typeof detectContextualAnomalies;
    calculateAnomalyScores: typeof calculateAnomalyScores;
    createAdaptiveAnomalyDetector: typeof createAdaptiveAnomalyDetector;
    generateAnomalyReport: typeof generateAnomalyReport;
};
export default _default;
//# sourceMappingURL=security-analytics-kit.d.ts.map