/**
 * LOC: THAA1234567
 * File: /reuse/threat/threat-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence controllers and services
 *   - Analytics processing pipelines
 *   - Threat detection systems
 */
/**
 * File: /reuse/threat/threat-analytics-kit.ts
 * Locator: WC-UTL-THAA-001
 * Purpose: Comprehensive Threat Analytics Utilities - Trend analysis, forecasting, anomaly detection, pattern recognition
 *
 * Upstream: Independent utility module for threat intelligence analytics
 * Downstream: ../backend/*, Threat controllers, analytics services, detection systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize, Statistics libraries
 * Exports: 48 utility functions for threat analytics, forecasting, anomaly detection, statistical modeling
 *
 * LLM Context: Comprehensive threat analytics utilities for implementing production-ready threat intelligence
 * in White Cross system. Provides trend analysis, statistical modeling, time-series analysis, forecasting,
 * anomaly detection, pattern recognition, and threat clustering. Essential for building advanced threat
 * detection and prediction capabilities.
 */
interface ThreatDataPoint {
    timestamp: number;
    value: number;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    source?: string;
    metadata?: Record<string, unknown>;
}
interface TrendAnalysis {
    direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    slope: number;
    confidence: number;
    changeRate: number;
    significance: number;
}
interface TrendComparison {
    period1: TrendAnalysis;
    period2: TrendAnalysis;
    difference: number;
    percentageChange: number;
    significant: boolean;
}
interface MovingAverageConfig {
    windowSize: number;
    type: 'simple' | 'exponential' | 'weighted';
    centerAlign?: boolean;
}
interface BayesianScore {
    prior: number;
    likelihood: number;
    posterior: number;
    confidence: number;
}
interface CorrelationMatrix {
    matrix: number[][];
    variables: string[];
    significantPairs: Array<{
        var1: string;
        var2: string;
        correlation: number;
    }>;
}
interface RegressionResult {
    coefficients: number[];
    intercept: number;
    rSquared: number;
    pValues: number[];
    predictions: number[];
}
interface ConfidenceInterval {
    lower: number;
    upper: number;
    confidence: number;
    margin: number;
}
interface TimeSeriesPattern {
    type: 'linear' | 'exponential' | 'seasonal' | 'cyclical' | 'random';
    strength: number;
    period?: number;
    components: {
        trend?: number[];
        seasonal?: number[];
        residual?: number[];
    };
}
interface SeasonalityResult {
    hasSeasonality: boolean;
    period: number;
    strength: number;
    peaks: number[];
    troughs: number[];
}
interface DecompositionResult {
    trend: number[];
    seasonal: number[];
    residual: number[];
    method: 'additive' | 'multiplicative';
}
interface TimeBucket {
    start: number;
    end: number;
    count: number;
    sum: number;
    average: number;
    max: number;
    min: number;
}
interface ThreatForecast {
    timestamp: number;
    predictedValue: number;
    confidenceInterval: ConfidenceInterval;
    method: string;
    accuracy?: number;
}
interface AttackWindow {
    start: number;
    end: number;
    probability: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    indicators: string[];
}
interface ForecastAccuracy {
    mae: number;
    mse: number;
    rmse: number;
    mape: number;
    r2: number;
}
interface Anomaly {
    timestamp: number;
    value: number;
    expectedValue: number;
    deviation: number;
    score: number;
    type: 'point' | 'contextual' | 'collective';
    severity: 'low' | 'medium' | 'high' | 'critical';
}
interface AnomalyCluster {
    id: string;
    anomalies: Anomaly[];
    centroid: ThreatDataPoint;
    radius: number;
    density: number;
}
interface ThreatPattern {
    id: string;
    signature: string;
    features: Record<string, unknown>;
    frequency: number;
    lastSeen: number;
    confidence: number;
}
interface PatternMatch {
    pattern: ThreatPattern;
    similarity: number;
    matchedFeatures: string[];
    score: number;
}
interface PatternEvolution {
    patternId: string;
    timeline: Array<{
        timestamp: number;
        features: Record<string, unknown>;
    }>;
    changeRate: number;
    stability: number;
}
interface Cluster {
    id: number;
    centroid: number[];
    members: ThreatDataPoint[];
    size: number;
    variance: number;
}
interface ClusteringResult {
    clusters: Cluster[];
    silhouetteScore: number;
    inertia: number;
    iterations: number;
}
/**
 * Calculates trend characteristics from time-series threat data.
 *
 * @param {ThreatDataPoint[]} data - Array of threat data points
 * @param {number} [windowSize] - Optional window size for trend calculation
 * @returns {TrendAnalysis} Trend analysis results
 * @throws {Error} If data is invalid or insufficient
 *
 * @example
 * ```typescript
 * const trend = calculateThreatTrend([
 *   { timestamp: 1000, value: 10 },
 *   { timestamp: 2000, value: 15 },
 *   { timestamp: 3000, value: 22 }
 * ]);
 * // Result: { direction: 'increasing', slope: 0.006, confidence: 0.95, ... }
 * ```
 */
export declare const calculateThreatTrend: (data: ThreatDataPoint[], windowSize?: number) => TrendAnalysis;
/**
 * Analyzes the direction of threat trends over time.
 *
 * @param {ThreatDataPoint[]} data - Threat data points
 * @param {number} [periods] - Number of periods to analyze (default: 3)
 * @returns {Array<{ period: number; direction: string; strength: number }>} Direction analysis by period
 *
 * @example
 * ```typescript
 * const directions = analyzeTrendDirection(threatData, 4);
 * // Result: [
 * //   { period: 1, direction: 'increasing', strength: 0.8 },
 * //   { period: 2, direction: 'stable', strength: 0.3 }
 * // ]
 * ```
 */
export declare const analyzeTrendDirection: (data: ThreatDataPoint[], periods?: number) => Array<{
    period: number;
    direction: string;
    strength: number;
}>;
/**
 * Detects significant changes in threat trends.
 *
 * @param {ThreatDataPoint[]} data - Threat data points
 * @param {number} [threshold] - Significance threshold (default: 0.3)
 * @returns {Array<{ timestamp: number; type: string; magnitude: number }>} Detected trend changes
 *
 * @example
 * ```typescript
 * const changes = detectTrendChange(threatData, 0.4);
 * // Result: [{ timestamp: 1234567890, type: 'spike', magnitude: 0.65 }]
 * ```
 */
export declare const detectTrendChange: (data: ThreatDataPoint[], threshold?: number) => Array<{
    timestamp: number;
    type: string;
    magnitude: number;
}>;
/**
 * Compares threat trends between two time periods.
 *
 * @param {ThreatDataPoint[]} period1 - First period data
 * @param {ThreatDataPoint[]} period2 - Second period data
 * @returns {TrendComparison} Comparison results
 * @throws {Error} If either period has insufficient data
 *
 * @example
 * ```typescript
 * const comparison = compareTrendPeriods(lastWeekData, thisWeekData);
 * // Result: {
 * //   period1: { direction: 'stable', ... },
 * //   period2: { direction: 'increasing', ... },
 * //   difference: 0.23,
 * //   percentageChange: 23.5,
 * //   significant: true
 * // }
 * ```
 */
export declare const compareTrendPeriods: (period1: ThreatDataPoint[], period2: ThreatDataPoint[]) => TrendComparison;
/**
 * Smooths threat trend data using various algorithms.
 *
 * @param {ThreatDataPoint[]} data - Raw threat data
 * @param {number} [smoothingFactor] - Smoothing factor 0-1 (default: 0.3)
 * @param {'exponential' | 'gaussian' | 'savitzky-golay'} [method] - Smoothing method
 * @returns {ThreatDataPoint[]} Smoothed data
 *
 * @example
 * ```typescript
 * const smoothed = smoothTrendData(noisyData, 0.4, 'exponential');
 * ```
 */
export declare const smoothTrendData: (data: ThreatDataPoint[], smoothingFactor?: number, method?: "exponential" | "gaussian" | "savitzky-golay") => ThreatDataPoint[];
/**
 * Calculates moving average for threat data.
 *
 * @param {ThreatDataPoint[]} data - Threat data points
 * @param {MovingAverageConfig} config - Moving average configuration
 * @returns {number[]} Moving average values
 *
 * @example
 * ```typescript
 * const ma = calculateMovingAverage(data, {
 *   windowSize: 7,
 *   type: 'exponential',
 *   centerAlign: false
 * });
 * ```
 */
export declare const calculateMovingAverage: (data: ThreatDataPoint[], config: MovingAverageConfig) => number[];
/**
 * Identifies outliers in threat trend data.
 *
 * @param {ThreatDataPoint[]} data - Threat data points
 * @param {number} [threshold] - Standard deviation threshold (default: 2)
 * @returns {Array<{ index: number; point: ThreatDataPoint; score: number }>} Identified outliers
 *
 * @example
 * ```typescript
 * const outliers = identifyTrendOutliers(data, 2.5);
 * // Result: [{ index: 42, point: {...}, score: 3.2 }]
 * ```
 */
export declare const identifyTrendOutliers: (data: ThreatDataPoint[], threshold?: number) => Array<{
    index: number;
    point: ThreatDataPoint;
    score: number;
}>;
/**
 * Forecasts trend continuation based on historical data.
 *
 * @param {ThreatDataPoint[]} data - Historical threat data
 * @param {number} periods - Number of periods to forecast
 * @returns {ThreatDataPoint[]} Forecasted data points
 *
 * @example
 * ```typescript
 * const forecast = forecastTrendContinuation(historicalData, 7);
 * // Returns 7 forecasted data points
 * ```
 */
export declare const forecastTrendContinuation: (data: ThreatDataPoint[], periods: number) => ThreatDataPoint[];
/**
 * Calculates threat probability using statistical models.
 *
 * @param {ThreatDataPoint[]} historicalData - Historical threat data
 * @param {ThreatDataPoint} currentData - Current threat data point
 * @returns {number} Probability score (0-1)
 *
 * @example
 * ```typescript
 * const probability = calculateThreatProbability(
 *   historicalData,
 *   { timestamp: Date.now(), value: 0.75 }
 * );
 * // Result: 0.82
 * ```
 */
export declare const calculateThreatProbability: (historicalData: ThreatDataPoint[], currentData: ThreatDataPoint) => number;
/**
 * Computes Bayesian threat score with prior knowledge.
 *
 * @param {number} priorProbability - Prior probability
 * @param {number} likelihood - Likelihood of evidence
 * @param {number} evidenceProb - Probability of evidence
 * @returns {BayesianScore} Bayesian scoring results
 *
 * @example
 * ```typescript
 * const score = computeBayesianThreatScore(0.3, 0.8, 0.5);
 * // Result: { prior: 0.3, likelihood: 0.8, posterior: 0.48, confidence: 0.92 }
 * ```
 */
export declare const computeBayesianThreatScore: (priorProbability: number, likelihood: number, evidenceProb: number) => BayesianScore;
/**
 * Analyzes statistical significance of threat changes.
 *
 * @param {number[]} sample1 - First sample
 * @param {number[]} sample2 - Second sample
 * @param {number} [alpha] - Significance level (default: 0.05)
 * @returns {{ significant: boolean; pValue: number; testStatistic: number }} Significance test results
 *
 * @example
 * ```typescript
 * const result = analyzeStatisticalSignificance(
 *   lastMonthValues,
 *   thisMonthValues,
 *   0.05
 * );
 * // Result: { significant: true, pValue: 0.032, testStatistic: 2.15 }
 * ```
 */
export declare const analyzeStatisticalSignificance: (sample1: number[], sample2: number[], alpha?: number) => {
    significant: boolean;
    pValue: number;
    testStatistic: number;
};
/**
 * Calculates correlation matrix for multiple threat variables.
 *
 * @param {Record<string, number[]>} variables - Variables with their values
 * @returns {CorrelationMatrix} Correlation matrix and significant pairs
 *
 * @example
 * ```typescript
 * const matrix = calculateCorrelationMatrix({
 *   threats: [1, 2, 3, 4, 5],
 *   attacks: [2, 4, 5, 7, 9],
 *   incidents: [1, 3, 4, 5, 8]
 * });
 * ```
 */
export declare const calculateCorrelationMatrix: (variables: Record<string, number[]>) => CorrelationMatrix;
/**
 * Performs regression analysis on threat data.
 *
 * @param {number[]} x - Independent variable values
 * @param {number[]} y - Dependent variable values
 * @returns {RegressionResult} Regression analysis results
 *
 * @example
 * ```typescript
 * const regression = performRegressionAnalysis(
 *   [1, 2, 3, 4, 5],
 *   [2, 4, 5, 4, 5]
 * );
 * // Result: { coefficients: [0.6], intercept: 2.2, rSquared: 0.75, ... }
 * ```
 */
export declare const performRegressionAnalysis: (x: number[], y: number[]) => RegressionResult;
/**
 * Computes standard deviation for threat metrics.
 *
 * @param {number[]} values - Metric values
 * @param {boolean} [sample] - Use sample standard deviation (default: true)
 * @returns {number} Standard deviation
 *
 * @example
 * ```typescript
 * const stdDev = computeStandardDeviation([1, 2, 3, 4, 5], true);
 * // Result: 1.58
 * ```
 */
export declare const computeStandardDeviation: (values: number[], sample?: boolean) => number;
/**
 * Calculates confidence interval for threat metrics.
 *
 * @param {number[]} values - Metric values
 * @param {number} [confidence] - Confidence level (default: 0.95)
 * @returns {ConfidenceInterval} Confidence interval results
 *
 * @example
 * ```typescript
 * const ci = calculateConfidenceInterval([10, 12, 14, 16, 18], 0.95);
 * // Result: { lower: 11.2, upper: 16.8, confidence: 0.95, margin: 2.8 }
 * ```
 */
export declare const calculateConfidenceInterval: (values: number[], confidence?: number) => ConfidenceInterval;
/**
 * Normalizes threat dataset to 0-1 range.
 *
 * @param {number[]} values - Values to normalize
 * @param {number} [min] - Minimum value (auto-detected if not provided)
 * @param {number} [max] - Maximum value (auto-detected if not provided)
 * @returns {number[]} Normalized values
 *
 * @example
 * ```typescript
 * const normalized = normalizeDataset([10, 20, 30, 40, 50]);
 * // Result: [0, 0.25, 0.5, 0.75, 1]
 * ```
 */
export declare const normalizeDataset: (values: number[], min?: number, max?: number) => number[];
/**
 * Analyzes time-series patterns in threat data.
 *
 * @param {ThreatDataPoint[]} data - Time-series threat data
 * @returns {TimeSeriesPattern} Pattern analysis results
 *
 * @example
 * ```typescript
 * const pattern = analyzeTimeSeriesPattern(timeSeriesData);
 * // Result: { type: 'seasonal', strength: 0.85, period: 7, components: {...} }
 * ```
 */
export declare const analyzeTimeSeriesPattern: (data: ThreatDataPoint[]) => TimeSeriesPattern;
/**
 * Detects seasonality in threat time-series data.
 *
 * @param {ThreatDataPoint[]} data - Time-series data
 * @param {number} [maxPeriod] - Maximum period to test (default: data.length / 2)
 * @returns {SeasonalityResult} Seasonality detection results
 *
 * @example
 * ```typescript
 * const seasonality = detectSeasonality(weeklyData, 7);
 * // Result: { hasSeasonality: true, period: 7, strength: 0.82, peaks: [...], troughs: [...] }
 * ```
 */
export declare const detectSeasonality: (data: ThreatDataPoint[], maxPeriod?: number) => SeasonalityResult;
/**
 * Performs time-series decomposition.
 *
 * @param {ThreatDataPoint[]} data - Time-series data
 * @param {number} period - Seasonality period
 * @param {'additive' | 'multiplicative'} [method] - Decomposition method
 * @returns {DecompositionResult} Decomposition components
 *
 * @example
 * ```typescript
 * const decomp = performDecomposition(data, 7, 'additive');
 * // Result: { trend: [...], seasonal: [...], residual: [...], method: 'additive' }
 * ```
 */
export declare const performDecomposition: (data: ThreatDataPoint[], period: number, method?: "additive" | "multiplicative") => DecompositionResult;
/**
 * Calculates autocorrelation for time-series data.
 *
 * @param {number[]} values - Time-series values
 * @param {number} lag - Lag value
 * @returns {number} Autocorrelation coefficient
 *
 * @example
 * ```typescript
 * const acf = calculateAutoCorrelation(values, 7);
 * // Result: 0.73
 * ```
 */
export declare const calculateAutoCorrelation: (values: number[], lag: number) => number;
/**
 * Identifies distinct time periods in threat data.
 *
 * @param {ThreatDataPoint[]} data - Threat data points
 * @param {number} threshold - Threshold for period separation
 * @returns {Array<{ start: number; end: number; count: number }>} Identified periods
 *
 * @example
 * ```typescript
 * const periods = identifyTimePeriods(data, 3600000); // 1 hour threshold
 * // Result: [{ start: 1234567890, end: 1234571490, count: 15 }]
 * ```
 */
export declare const identifyTimePeriods: (data: ThreatDataPoint[], threshold: number) => Array<{
    start: number;
    end: number;
    count: number;
}>;
/**
 * Aggregates threat data by time buckets.
 *
 * @param {ThreatDataPoint[]} data - Threat data points
 * @param {number} bucketSize - Bucket size in milliseconds
 * @returns {TimeBucket[]} Aggregated buckets
 *
 * @example
 * ```typescript
 * const buckets = aggregateByTimeBucket(data, 3600000); // 1 hour buckets
 * // Result: [{ start: ..., end: ..., count: 5, sum: 23, average: 4.6, max: 8, min: 2 }]
 * ```
 */
export declare const aggregateByTimeBucket: (data: ThreatDataPoint[], bucketSize: number) => TimeBucket[];
/**
 * Interpolates missing data points in time-series.
 *
 * @param {ThreatDataPoint[]} data - Data with potential gaps
 * @param {number} expectedInterval - Expected interval between points
 * @returns {ThreatDataPoint[]} Data with interpolated points
 *
 * @example
 * ```typescript
 * const complete = interpolateMissingData(sparseData, 60000); // 1 minute intervals
 * ```
 */
export declare const interpolateMissingData: (data: ThreatDataPoint[], expectedInterval: number) => ThreatDataPoint[];
/**
 * Detects temporal anomalies in time-series data.
 *
 * @param {ThreatDataPoint[]} data - Time-series data
 * @param {number} [windowSize] - Analysis window size
 * @returns {Anomaly[]} Detected temporal anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectTemporalAnomaly(timeSeriesData, 10);
 * // Result: [{ timestamp: ..., value: 15, expectedValue: 5, deviation: 10, score: 0.95, ... }]
 * ```
 */
export declare const detectTemporalAnomaly: (data: ThreatDataPoint[], windowSize?: number) => Anomaly[];
/**
 * Forecasts threat levels for future time periods.
 *
 * @param {ThreatDataPoint[]} historicalData - Historical threat data
 * @param {number} periods - Number of periods to forecast
 * @param {'linear' | 'exponential' | 'arima'} [method] - Forecasting method
 * @returns {ThreatForecast[]} Forecasted threat levels
 *
 * @example
 * ```typescript
 * const forecast = forecastThreatLevel(historicalData, 7, 'linear');
 * // Returns 7 days of forecasted threat levels
 * ```
 */
export declare const forecastThreatLevel: (historicalData: ThreatDataPoint[], periods: number, method?: "linear" | "exponential" | "arima") => ThreatForecast[];
/**
 * Predicts potential attack windows based on patterns.
 *
 * @param {ThreatDataPoint[]} historicalData - Historical attack data
 * @param {number} lookAhead - Hours to look ahead
 * @returns {AttackWindow[]} Predicted attack windows
 *
 * @example
 * ```typescript
 * const windows = predictAttackWindow(attackHistory, 72);
 * // Result: [{ start: ..., end: ..., probability: 0.75, severity: 'high', indicators: [...] }]
 * ```
 */
export declare const predictAttackWindow: (historicalData: ThreatDataPoint[], lookAhead: number) => AttackWindow[];
/**
 * Estimates threat trajectory based on current and historical data.
 *
 * @param {ThreatDataPoint[]} data - Threat data points
 * @param {number} timeHorizon - Time horizon in milliseconds
 * @returns {ThreatDataPoint[]} Projected trajectory
 *
 * @example
 * ```typescript
 * const trajectory = estimateThreatTrajectory(currentData, 86400000 * 7); // 7 days
 * ```
 */
export declare const estimateThreatTrajectory: (data: ThreatDataPoint[], timeHorizon: number) => ThreatDataPoint[];
/**
 * Calculates forecast accuracy metrics.
 *
 * @param {number[]} actual - Actual values
 * @param {number[]} predicted - Predicted values
 * @returns {ForecastAccuracy} Accuracy metrics
 *
 * @example
 * ```typescript
 * const accuracy = calculateForecastAccuracy(actualValues, predictedValues);
 * // Result: { mae: 2.3, mse: 7.1, rmse: 2.67, mape: 0.15, r2: 0.85 }
 * ```
 */
export declare const calculateForecastAccuracy: (actual: number[], predicted: number[]) => ForecastAccuracy;
/**
 * Generates confidence bands for forecasts.
 *
 * @param {ThreatForecast[]} forecasts - Forecast data
 * @param {number} [stdDevMultiplier] - Standard deviation multiplier (default: 1.96 for 95%)
 * @returns {ThreatForecast[]} Forecasts with updated confidence intervals
 *
 * @example
 * ```typescript
 * const withBands = generateConfidenceBands(forecasts, 2.58); // 99% confidence
 * ```
 */
export declare const generateConfidenceBands: (forecasts: ThreatForecast[], stdDevMultiplier?: number) => ThreatForecast[];
/**
 * Adjusts forecast model based on recent accuracy.
 *
 * @param {ThreatForecast[]} forecasts - Current forecasts
 * @param {ForecastAccuracy} accuracy - Measured accuracy
 * @returns {ThreatForecast[]} Adjusted forecasts
 *
 * @example
 * ```typescript
 * const adjusted = adjustForecastModel(forecasts, accuracyMetrics);
 * ```
 */
export declare const adjustForecastModel: (forecasts: ThreatForecast[], accuracy: ForecastAccuracy) => ThreatForecast[];
/**
 * Detects statistical anomalies in threat data.
 *
 * @param {ThreatDataPoint[]} data - Threat data points
 * @param {number} [threshold] - Z-score threshold (default: 3)
 * @returns {Anomaly[]} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectStatisticalAnomaly(data, 2.5);
 * // Result: [{ timestamp: ..., value: 50, expectedValue: 10, deviation: 40, score: 0.95, ... }]
 * ```
 */
export declare const detectStatisticalAnomaly: (data: ThreatDataPoint[], threshold?: number) => Anomaly[];
/**
 * Identifies behavioral anomalies based on patterns.
 *
 * @param {ThreatDataPoint[]} data - Threat data points
 * @param {ThreatDataPoint[]} baselineData - Baseline behavior data
 * @returns {Anomaly[]} Behavioral anomalies
 *
 * @example
 * ```typescript
 * const behavioral = identifyBehavioralAnomaly(currentData, baselineData);
 * ```
 */
export declare const identifyBehavioralAnomaly: (data: ThreatDataPoint[], baselineData: ThreatDataPoint[]) => Anomaly[];
/**
 * Calculates anomaly score for a data point.
 *
 * @param {ThreatDataPoint} point - Data point to score
 * @param {ThreatDataPoint[]} context - Contextual data
 * @returns {number} Anomaly score (0-1)
 *
 * @example
 * ```typescript
 * const score = calculateAnomalyScore(suspiciousPoint, contextualData);
 * // Result: 0.87
 * ```
 */
export declare const calculateAnomalyScore: (point: ThreatDataPoint, context: ThreatDataPoint[]) => number;
/**
 * Clusters related anomalies together.
 *
 * @param {Anomaly[]} anomalies - Detected anomalies
 * @param {number} [timeWindow] - Time window for clustering (ms)
 * @returns {AnomalyCluster[]} Clustered anomalies
 *
 * @example
 * ```typescript
 * const clusters = clusterAnomalies(anomalies, 3600000); // 1 hour window
 * ```
 */
export declare const clusterAnomalies: (anomalies: Anomaly[], timeWindow?: number) => AnomalyCluster[];
/**
 * Validates whether a detected anomaly is genuine.
 *
 * @param {Anomaly} anomaly - Anomaly to validate
 * @param {ThreatDataPoint[]} additionalContext - Additional context data
 * @returns {boolean} True if anomaly is validated
 *
 * @example
 * ```typescript
 * const isValid = validateAnomaly(suspectedAnomaly, contextData);
 * ```
 */
export declare const validateAnomaly: (anomaly: Anomaly, additionalContext: ThreatDataPoint[]) => boolean;
/**
 * Ranks anomalies by severity and impact.
 *
 * @param {Anomaly[]} anomalies - Anomalies to rank
 * @returns {Anomaly[]} Sorted anomalies by severity
 *
 * @example
 * ```typescript
 * const ranked = rankAnomaliesBySeverity(detectedAnomalies);
 * // Result: Critical first, then high, medium, low
 * ```
 */
export declare const rankAnomaliesBySeverity: (anomalies: Anomaly[]) => Anomaly[];
/**
 * Extracts threat patterns from data.
 *
 * @param {ThreatDataPoint[]} data - Threat data points
 * @param {number} [minFrequency] - Minimum pattern frequency
 * @returns {ThreatPattern[]} Extracted patterns
 *
 * @example
 * ```typescript
 * const patterns = extractThreatPattern(data, 3);
 * ```
 */
export declare const extractThreatPattern: (data: ThreatDataPoint[], minFrequency?: number) => ThreatPattern[];
/**
 * Matches current data against known threat patterns.
 *
 * @param {ThreatDataPoint[]} currentData - Current threat data
 * @param {ThreatPattern[]} knownPatterns - Known patterns to match
 * @returns {PatternMatch[]} Pattern matches
 *
 * @example
 * ```typescript
 * const matches = matchKnownPatterns(recentData, knownThreatPatterns);
 * ```
 */
export declare const matchKnownPatterns: (currentData: ThreatDataPoint[], knownPatterns: ThreatPattern[]) => PatternMatch[];
/**
 * Calculates similarity between two patterns.
 *
 * @param {ThreatDataPoint[]} data1 - First pattern data
 * @param {number[]} data2Values - Second pattern values
 * @returns {number} Similarity score (0-1)
 *
 * @example
 * ```typescript
 * const similarity = calculatePatternSimilarity(pattern1, pattern2Values);
 * // Result: 0.85
 * ```
 */
export declare const calculatePatternSimilarity: (data1: ThreatDataPoint[], data2Values: number[]) => number;
/**
 * Identifies how patterns evolve over time.
 *
 * @param {string} patternId - Pattern identifier
 * @param {Array<{ timestamp: number; data: ThreatDataPoint[] }>} historicalInstances - Historical pattern instances
 * @returns {PatternEvolution} Evolution analysis
 *
 * @example
 * ```typescript
 * const evolution = identifyPatternEvolution('pattern-123', instances);
 * ```
 */
export declare const identifyPatternEvolution: (patternId: string, historicalInstances: Array<{
    timestamp: number;
    data: ThreatDataPoint[];
}>) => PatternEvolution;
/**
 * Generates unique signature for a threat pattern.
 *
 * @param {ThreatDataPoint[]} data - Pattern data
 * @returns {string} Pattern signature
 *
 * @example
 * ```typescript
 * const signature = generatePatternSignature(patternData);
 * // Result: "0.12-0.34-0.56-0.78-0.90"
 * ```
 */
export declare const generatePatternSignature: (data: ThreatDataPoint[]) => string;
/**
 * Classifies pattern type based on characteristics.
 *
 * @param {ThreatPattern} pattern - Pattern to classify
 * @returns {string} Pattern type classification
 *
 * @example
 * ```typescript
 * const type = classifyPatternType(detectedPattern);
 * // Result: "periodic" | "sporadic" | "persistent" | "escalating"
 * ```
 */
export declare const classifyPatternType: (pattern: ThreatPattern) => string;
/**
 * Performs K-means clustering on threat data.
 *
 * @param {ThreatDataPoint[]} data - Data points to cluster
 * @param {number} k - Number of clusters
 * @param {number} [maxIterations] - Maximum iterations (default: 100)
 * @returns {ClusteringResult} Clustering results
 *
 * @example
 * ```typescript
 * const result = performKMeansClustering(threatData, 3, 100);
 * ```
 */
export declare const performKMeansClustering: (data: ThreatDataPoint[], k: number, maxIterations?: number) => ClusteringResult;
/**
 * Calculates cluster centroid from members.
 *
 * @param {ThreatDataPoint[]} members - Cluster members
 * @returns {number[]} Centroid coordinates
 *
 * @example
 * ```typescript
 * const centroid = calculateClusterCentroid(clusterMembers);
 * // Result: [0.456]
 * ```
 */
export declare const calculateClusterCentroid: (members: ThreatDataPoint[]) => number[];
/**
 * Assigns a data point to the nearest cluster.
 *
 * @param {ThreatDataPoint} point - Point to assign
 * @param {Cluster[]} clusters - Available clusters
 * @returns {number} Cluster ID
 *
 * @example
 * ```typescript
 * const clusterId = assignToCluster(newPoint, existingClusters);
 * ```
 */
export declare const assignToCluster: (point: ThreatDataPoint, clusters: Cluster[]) => number;
/**
 * Validates quality of clustering results.
 *
 * @param {ClusteringResult} result - Clustering results to validate
 * @returns {{ isValid: boolean; score: number; issues: string[] }} Validation results
 *
 * @example
 * ```typescript
 * const validation = validateClusterQuality(clusteringResult);
 * // Result: { isValid: true, score: 0.85, issues: [] }
 * ```
 */
export declare const validateClusterQuality: (result: ClusteringResult) => {
    isValid: boolean;
    score: number;
    issues: string[];
};
/**
 * Optimizes number of clusters using elbow method.
 *
 * @param {ThreatDataPoint[]} data - Data to cluster
 * @param {number} [maxK] - Maximum K to test (default: 10)
 * @returns {number} Optimal number of clusters
 *
 * @example
 * ```typescript
 * const optimalK = optimizeClusterCount(data, 10);
 * // Result: 4
 * ```
 */
export declare const optimizeClusterCount: (data: ThreatDataPoint[], maxK?: number) => number;
/**
 * Merges related clusters based on similarity.
 *
 * @param {Cluster[]} clusters - Clusters to potentially merge
 * @param {number} [threshold] - Similarity threshold (default: 0.8)
 * @returns {Cluster[]} Merged clusters
 *
 * @example
 * ```typescript
 * const merged = mergeRelatedClusters(clusters, 0.75);
 * ```
 */
export declare const mergeRelatedClusters: (clusters: Cluster[], threshold?: number) => Cluster[];
declare const _default: {
    calculateThreatTrend: (data: ThreatDataPoint[], windowSize?: number) => TrendAnalysis;
    analyzeTrendDirection: (data: ThreatDataPoint[], periods?: number) => Array<{
        period: number;
        direction: string;
        strength: number;
    }>;
    detectTrendChange: (data: ThreatDataPoint[], threshold?: number) => Array<{
        timestamp: number;
        type: string;
        magnitude: number;
    }>;
    compareTrendPeriods: (period1: ThreatDataPoint[], period2: ThreatDataPoint[]) => TrendComparison;
    smoothTrendData: (data: ThreatDataPoint[], smoothingFactor?: number, method?: "exponential" | "gaussian" | "savitzky-golay") => ThreatDataPoint[];
    calculateMovingAverage: (data: ThreatDataPoint[], config: MovingAverageConfig) => number[];
    identifyTrendOutliers: (data: ThreatDataPoint[], threshold?: number) => Array<{
        index: number;
        point: ThreatDataPoint;
        score: number;
    }>;
    forecastTrendContinuation: (data: ThreatDataPoint[], periods: number) => ThreatDataPoint[];
    calculateThreatProbability: (historicalData: ThreatDataPoint[], currentData: ThreatDataPoint) => number;
    computeBayesianThreatScore: (priorProbability: number, likelihood: number, evidenceProb: number) => BayesianScore;
    analyzeStatisticalSignificance: (sample1: number[], sample2: number[], alpha?: number) => {
        significant: boolean;
        pValue: number;
        testStatistic: number;
    };
    calculateCorrelationMatrix: (variables: Record<string, number[]>) => CorrelationMatrix;
    performRegressionAnalysis: (x: number[], y: number[]) => RegressionResult;
    computeStandardDeviation: (values: number[], sample?: boolean) => number;
    calculateConfidenceInterval: (values: number[], confidence?: number) => ConfidenceInterval;
    normalizeDataset: (values: number[], min?: number, max?: number) => number[];
    analyzeTimeSeriesPattern: (data: ThreatDataPoint[]) => TimeSeriesPattern;
    detectSeasonality: (data: ThreatDataPoint[], maxPeriod?: number) => SeasonalityResult;
    performDecomposition: (data: ThreatDataPoint[], period: number, method?: "additive" | "multiplicative") => DecompositionResult;
    calculateAutoCorrelation: (values: number[], lag: number) => number;
    identifyTimePeriods: (data: ThreatDataPoint[], threshold: number) => Array<{
        start: number;
        end: number;
        count: number;
    }>;
    aggregateByTimeBucket: (data: ThreatDataPoint[], bucketSize: number) => TimeBucket[];
    interpolateMissingData: (data: ThreatDataPoint[], expectedInterval: number) => ThreatDataPoint[];
    detectTemporalAnomaly: (data: ThreatDataPoint[], windowSize?: number) => Anomaly[];
    forecastThreatLevel: (historicalData: ThreatDataPoint[], periods: number, method?: "linear" | "exponential" | "arima") => ThreatForecast[];
    predictAttackWindow: (historicalData: ThreatDataPoint[], lookAhead: number) => AttackWindow[];
    estimateThreatTrajectory: (data: ThreatDataPoint[], timeHorizon: number) => ThreatDataPoint[];
    calculateForecastAccuracy: (actual: number[], predicted: number[]) => ForecastAccuracy;
    generateConfidenceBands: (forecasts: ThreatForecast[], stdDevMultiplier?: number) => ThreatForecast[];
    adjustForecastModel: (forecasts: ThreatForecast[], accuracy: ForecastAccuracy) => ThreatForecast[];
    detectStatisticalAnomaly: (data: ThreatDataPoint[], threshold?: number) => Anomaly[];
    identifyBehavioralAnomaly: (data: ThreatDataPoint[], baselineData: ThreatDataPoint[]) => Anomaly[];
    calculateAnomalyScore: (point: ThreatDataPoint, context: ThreatDataPoint[]) => number;
    clusterAnomalies: (anomalies: Anomaly[], timeWindow?: number) => AnomalyCluster[];
    validateAnomaly: (anomaly: Anomaly, additionalContext: ThreatDataPoint[]) => boolean;
    rankAnomaliesBySeverity: (anomalies: Anomaly[]) => Anomaly[];
    extractThreatPattern: (data: ThreatDataPoint[], minFrequency?: number) => ThreatPattern[];
    matchKnownPatterns: (currentData: ThreatDataPoint[], knownPatterns: ThreatPattern[]) => PatternMatch[];
    calculatePatternSimilarity: (data1: ThreatDataPoint[], data2Values: number[]) => number;
    identifyPatternEvolution: (patternId: string, historicalInstances: Array<{
        timestamp: number;
        data: ThreatDataPoint[];
    }>) => PatternEvolution;
    generatePatternSignature: (data: ThreatDataPoint[]) => string;
    classifyPatternType: (pattern: ThreatPattern) => string;
    performKMeansClustering: (data: ThreatDataPoint[], k: number, maxIterations?: number) => ClusteringResult;
    calculateClusterCentroid: (members: ThreatDataPoint[]) => number[];
    assignToCluster: (point: ThreatDataPoint, clusters: Cluster[]) => number;
    validateClusterQuality: (result: ClusteringResult) => {
        isValid: boolean;
        score: number;
        issues: string[];
    };
    optimizeClusterCount: (data: ThreatDataPoint[], maxK?: number) => number;
    mergeRelatedClusters: (clusters: Cluster[], threshold?: number) => Cluster[];
};
export default _default;
//# sourceMappingURL=threat-analytics-kit.d.ts.map