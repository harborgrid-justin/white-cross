"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeRelatedClusters = exports.optimizeClusterCount = exports.validateClusterQuality = exports.assignToCluster = exports.calculateClusterCentroid = exports.performKMeansClustering = exports.classifyPatternType = exports.generatePatternSignature = exports.identifyPatternEvolution = exports.calculatePatternSimilarity = exports.matchKnownPatterns = exports.extractThreatPattern = exports.rankAnomaliesBySeverity = exports.validateAnomaly = exports.clusterAnomalies = exports.calculateAnomalyScore = exports.identifyBehavioralAnomaly = exports.detectStatisticalAnomaly = exports.adjustForecastModel = exports.generateConfidenceBands = exports.calculateForecastAccuracy = exports.estimateThreatTrajectory = exports.predictAttackWindow = exports.forecastThreatLevel = exports.detectTemporalAnomaly = exports.interpolateMissingData = exports.aggregateByTimeBucket = exports.identifyTimePeriods = exports.calculateAutoCorrelation = exports.performDecomposition = exports.detectSeasonality = exports.analyzeTimeSeriesPattern = exports.normalizeDataset = exports.calculateConfidenceInterval = exports.computeStandardDeviation = exports.performRegressionAnalysis = exports.calculateCorrelationMatrix = exports.analyzeStatisticalSignificance = exports.computeBayesianThreatScore = exports.calculateThreatProbability = exports.forecastTrendContinuation = exports.identifyTrendOutliers = exports.calculateMovingAverage = exports.smoothTrendData = exports.compareTrendPeriods = exports.detectTrendChange = exports.analyzeTrendDirection = exports.calculateThreatTrend = void 0;
// ============================================================================
// THREAT TREND ANALYSIS
// ============================================================================
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
const calculateThreatTrend = (data, windowSize) => {
    if (!Array.isArray(data) || data.length < 2) {
        throw new Error('Invalid threat data: at least 2 data points required');
    }
    const window = windowSize && windowSize < data.length ? data.slice(-windowSize) : data;
    // Calculate linear regression
    const n = window.length;
    const sumX = window.reduce((sum, d, i) => sum + i, 0);
    const sumY = window.reduce((sum, d) => sum + d.value, 0);
    const sumXY = window.reduce((sum, d, i) => sum + i * d.value, 0);
    const sumX2 = window.reduce((sum, _, i) => sum + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    // Calculate R-squared for confidence
    const mean = sumY / n;
    const ssTotal = window.reduce((sum, d) => sum + Math.pow(d.value - mean, 2), 0);
    const ssRes = window.reduce((sum, d, i) => {
        const predicted = slope * i + intercept;
        return sum + Math.pow(d.value - predicted, 2);
    }, 0);
    const rSquared = 1 - (ssRes / ssTotal);
    // Determine direction and change rate
    const firstValue = window[0].value;
    const lastValue = window[window.length - 1].value;
    const changeRate = (lastValue - firstValue) / firstValue;
    let direction;
    if (Math.abs(slope) < 0.001) {
        direction = 'stable';
    }
    else if (rSquared < 0.5) {
        direction = 'volatile';
    }
    else if (slope > 0) {
        direction = 'increasing';
    }
    else {
        direction = 'decreasing';
    }
    return {
        direction,
        slope,
        confidence: Math.max(0, Math.min(1, rSquared)),
        changeRate,
        significance: Math.abs(slope) * rSquared,
    };
};
exports.calculateThreatTrend = calculateThreatTrend;
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
const analyzeTrendDirection = (data, periods = 3) => {
    if (!Array.isArray(data) || data.length < periods) {
        throw new Error(`Insufficient data: at least ${periods} points required`);
    }
    const periodSize = Math.floor(data.length / periods);
    const results = [];
    for (let i = 0; i < periods; i++) {
        const start = i * periodSize;
        const end = i === periods - 1 ? data.length : (i + 1) * periodSize;
        const periodData = data.slice(start, end);
        const trend = (0, exports.calculateThreatTrend)(periodData);
        results.push({
            period: i + 1,
            direction: trend.direction,
            strength: trend.confidence,
        });
    }
    return results;
};
exports.analyzeTrendDirection = analyzeTrendDirection;
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
const detectTrendChange = (data, threshold = 0.3) => {
    if (!Array.isArray(data) || data.length < 3) {
        throw new Error('Invalid data: at least 3 points required for change detection');
    }
    const changes = [];
    const windowSize = Math.max(3, Math.floor(data.length / 10));
    for (let i = windowSize; i < data.length - windowSize; i++) {
        const before = data.slice(i - windowSize, i);
        const after = data.slice(i, i + windowSize);
        const beforeAvg = before.reduce((sum, d) => sum + d.value, 0) / before.length;
        const afterAvg = after.reduce((sum, d) => sum + d.value, 0) / after.length;
        const change = (afterAvg - beforeAvg) / beforeAvg;
        if (Math.abs(change) > threshold) {
            changes.push({
                timestamp: data[i].timestamp,
                type: change > 0 ? 'spike' : 'drop',
                magnitude: Math.abs(change),
            });
        }
    }
    return changes;
};
exports.detectTrendChange = detectTrendChange;
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
const compareTrendPeriods = (period1, period2) => {
    const trend1 = (0, exports.calculateThreatTrend)(period1);
    const trend2 = (0, exports.calculateThreatTrend)(period2);
    const difference = trend2.slope - trend1.slope;
    const percentageChange = trend1.slope !== 0
        ? (difference / Math.abs(trend1.slope)) * 100
        : 0;
    const significant = Math.abs(difference) > 0.01 &&
        trend1.confidence > 0.7 &&
        trend2.confidence > 0.7;
    return {
        period1: trend1,
        period2: trend2,
        difference,
        percentageChange,
        significant,
    };
};
exports.compareTrendPeriods = compareTrendPeriods;
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
const smoothTrendData = (data, smoothingFactor = 0.3, method = 'exponential') => {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid data: non-empty array required');
    }
    const factor = Math.max(0, Math.min(1, smoothingFactor));
    const smoothed = [];
    if (method === 'exponential') {
        smoothed.push({ ...data[0] });
        for (let i = 1; i < data.length; i++) {
            const smoothedValue = factor * data[i].value + (1 - factor) * smoothed[i - 1].value;
            smoothed.push({
                ...data[i],
                value: smoothedValue,
            });
        }
    }
    else {
        // For other methods, use simple moving average as fallback
        return data.map((point, i) => ({
            ...point,
            value: (0, exports.calculateMovingAverage)(data, { windowSize: 3, type: 'simple' })[i] || point.value,
        }));
    }
    return smoothed;
};
exports.smoothTrendData = smoothTrendData;
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
const calculateMovingAverage = (data, config) => {
    const { windowSize, type, centerAlign = false } = config;
    if (windowSize > data.length) {
        throw new Error('Window size cannot exceed data length');
    }
    const result = [];
    if (type === 'simple') {
        for (let i = 0; i < data.length; i++) {
            const start = Math.max(0, i - Math.floor(windowSize / 2));
            const end = Math.min(data.length, start + windowSize);
            const window = data.slice(start, end);
            const avg = window.reduce((sum, d) => sum + d.value, 0) / window.length;
            result.push(avg);
        }
    }
    else if (type === 'exponential') {
        const alpha = 2 / (windowSize + 1);
        result.push(data[0].value);
        for (let i = 1; i < data.length; i++) {
            const ema = alpha * data[i].value + (1 - alpha) * result[i - 1];
            result.push(ema);
        }
    }
    else if (type === 'weighted') {
        for (let i = 0; i < data.length; i++) {
            const start = Math.max(0, i - windowSize + 1);
            const window = data.slice(start, i + 1);
            let weightedSum = 0;
            let weightSum = 0;
            window.forEach((d, idx) => {
                const weight = idx + 1;
                weightedSum += d.value * weight;
                weightSum += weight;
            });
            result.push(weightedSum / weightSum);
        }
    }
    return result;
};
exports.calculateMovingAverage = calculateMovingAverage;
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
const identifyTrendOutliers = (data, threshold = 2) => {
    if (!Array.isArray(data) || data.length < 3) {
        return [];
    }
    const values = data.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const outliers = [];
    data.forEach((point, index) => {
        const zScore = Math.abs((point.value - mean) / stdDev);
        if (zScore > threshold) {
            outliers.push({
                index,
                point,
                score: zScore,
            });
        }
    });
    return outliers.sort((a, b) => b.score - a.score);
};
exports.identifyTrendOutliers = identifyTrendOutliers;
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
const forecastTrendContinuation = (data, periods) => {
    if (!Array.isArray(data) || data.length < 2) {
        throw new Error('Insufficient data for forecasting');
    }
    const trend = (0, exports.calculateThreatTrend)(data);
    const lastPoint = data[data.length - 1];
    const avgTimeDiff = data.length > 1
        ? (data[data.length - 1].timestamp - data[0].timestamp) / (data.length - 1)
        : 1000;
    const forecast = [];
    for (let i = 1; i <= periods; i++) {
        const timestamp = lastPoint.timestamp + avgTimeDiff * i;
        const value = lastPoint.value + trend.slope * avgTimeDiff * i;
        forecast.push({
            timestamp,
            value: Math.max(0, value),
            severity: value > 0.8 ? 'critical' : value > 0.5 ? 'high' : 'medium',
            metadata: { forecasted: true, confidence: trend.confidence },
        });
    }
    return forecast;
};
exports.forecastTrendContinuation = forecastTrendContinuation;
// ============================================================================
// STATISTICAL THREAT MODELING
// ============================================================================
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
const calculateThreatProbability = (historicalData, currentData) => {
    if (!Array.isArray(historicalData) || historicalData.length === 0) {
        throw new Error('Historical data required for probability calculation');
    }
    const values = historicalData.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    // Calculate z-score
    const zScore = (currentData.value - mean) / stdDev;
    // Convert to probability using cumulative distribution
    const probability = 0.5 * (1 + Math.tanh(zScore / 2));
    return Math.max(0, Math.min(1, probability));
};
exports.calculateThreatProbability = calculateThreatProbability;
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
const computeBayesianThreatScore = (priorProbability, likelihood, evidenceProb) => {
    if (evidenceProb === 0) {
        throw new Error('Evidence probability cannot be zero');
    }
    const posterior = (likelihood * priorProbability) / evidenceProb;
    const confidence = Math.abs(posterior - priorProbability);
    return {
        prior: priorProbability,
        likelihood,
        posterior: Math.max(0, Math.min(1, posterior)),
        confidence: Math.max(0, Math.min(1, confidence)),
    };
};
exports.computeBayesianThreatScore = computeBayesianThreatScore;
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
const analyzeStatisticalSignificance = (sample1, sample2, alpha = 0.05) => {
    if (sample1.length < 2 || sample2.length < 2) {
        throw new Error('Each sample must have at least 2 values');
    }
    const mean1 = sample1.reduce((sum, v) => sum + v, 0) / sample1.length;
    const mean2 = sample2.reduce((sum, v) => sum + v, 0) / sample2.length;
    const var1 = sample1.reduce((sum, v) => sum + Math.pow(v - mean1, 2), 0) / (sample1.length - 1);
    const var2 = sample2.reduce((sum, v) => sum + Math.pow(v - mean2, 2), 0) / (sample2.length - 1);
    const pooledStdDev = Math.sqrt((var1 / sample1.length) + (var2 / sample2.length));
    const testStatistic = (mean1 - mean2) / pooledStdDev;
    // Approximate p-value using normal distribution
    const pValue = 2 * (1 - 0.5 * (1 + Math.tanh(Math.abs(testStatistic) / Math.sqrt(2))));
    return {
        significant: pValue < alpha,
        pValue: Math.max(0, Math.min(1, pValue)),
        testStatistic,
    };
};
exports.analyzeStatisticalSignificance = analyzeStatisticalSignificance;
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
const calculateCorrelationMatrix = (variables) => {
    const varNames = Object.keys(variables);
    const n = varNames.length;
    if (n < 2) {
        throw new Error('At least 2 variables required for correlation');
    }
    const matrix = Array(n).fill(0).map(() => Array(n).fill(0));
    const significantPairs = [];
    const pearsonCorrelation = (x, y) => {
        const n = Math.min(x.length, y.length);
        const meanX = x.slice(0, n).reduce((sum, v) => sum + v, 0) / n;
        const meanY = y.slice(0, n).reduce((sum, v) => sum + v, 0) / n;
        let numerator = 0;
        let sumX2 = 0;
        let sumY2 = 0;
        for (let i = 0; i < n; i++) {
            const dx = x[i] - meanX;
            const dy = y[i] - meanY;
            numerator += dx * dy;
            sumX2 += dx * dx;
            sumY2 += dy * dy;
        }
        return numerator / Math.sqrt(sumX2 * sumY2);
    };
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j) {
                matrix[i][j] = 1;
            }
            else {
                const correlation = pearsonCorrelation(variables[varNames[i]], variables[varNames[j]]);
                matrix[i][j] = correlation;
                if (i < j && Math.abs(correlation) > 0.7) {
                    significantPairs.push({
                        var1: varNames[i],
                        var2: varNames[j],
                        correlation,
                    });
                }
            }
        }
    }
    return {
        matrix,
        variables: varNames,
        significantPairs,
    };
};
exports.calculateCorrelationMatrix = calculateCorrelationMatrix;
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
const performRegressionAnalysis = (x, y) => {
    if (x.length !== y.length || x.length < 2) {
        throw new Error('X and Y must have equal length with at least 2 values');
    }
    const n = x.length;
    const sumX = x.reduce((sum, v) => sum + v, 0);
    const sumY = y.reduce((sum, v) => sum + v, 0);
    const sumXY = x.reduce((sum, v, i) => sum + v * y[i], 0);
    const sumX2 = x.reduce((sum, v) => sum + v * v, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const predictions = x.map(xi => slope * xi + intercept);
    const meanY = sumY / n;
    const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
    const ssRes = y.reduce((sum, yi, i) => sum + Math.pow(yi - predictions[i], 2), 0);
    const rSquared = 1 - (ssRes / ssTotal);
    // Simplified p-value calculation
    const pValues = [Math.abs(slope) > 0.1 ? 0.05 : 0.5];
    return {
        coefficients: [slope],
        intercept,
        rSquared,
        pValues,
        predictions,
    };
};
exports.performRegressionAnalysis = performRegressionAnalysis;
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
const computeStandardDeviation = (values, sample = true) => {
    if (values.length === 0) {
        throw new Error('Cannot compute standard deviation of empty array');
    }
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
        (sample ? values.length - 1 : values.length);
    return Math.sqrt(variance);
};
exports.computeStandardDeviation = computeStandardDeviation;
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
const calculateConfidenceInterval = (values, confidence = 0.95) => {
    if (values.length < 2) {
        throw new Error('At least 2 values required for confidence interval');
    }
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const stdDev = (0, exports.computeStandardDeviation)(values, true);
    // Z-score for common confidence levels
    const zScores = {
        0.90: 1.645,
        0.95: 1.96,
        0.99: 2.576,
    };
    const zScore = zScores[confidence] || 1.96;
    const margin = zScore * (stdDev / Math.sqrt(values.length));
    return {
        lower: mean - margin,
        upper: mean + margin,
        confidence,
        margin,
    };
};
exports.calculateConfidenceInterval = calculateConfidenceInterval;
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
const normalizeDataset = (values, min, max) => {
    if (values.length === 0) {
        return [];
    }
    const minVal = min !== undefined ? min : Math.min(...values);
    const maxVal = max !== undefined ? max : Math.max(...values);
    const range = maxVal - minVal;
    if (range === 0) {
        return values.map(() => 0.5);
    }
    return values.map(v => (v - minVal) / range);
};
exports.normalizeDataset = normalizeDataset;
// ============================================================================
// TIME-SERIES ANALYSIS
// ============================================================================
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
const analyzeTimeSeriesPattern = (data) => {
    if (data.length < 4) {
        throw new Error('Insufficient data for time-series analysis');
    }
    const values = data.map(d => d.value);
    const trend = (0, exports.calculateThreatTrend)(data);
    // Detect pattern type
    let patternType = 'random';
    let strength = 0;
    let period;
    if (trend.confidence > 0.7) {
        if (Math.abs(trend.slope) < 0.001) {
            patternType = 'random';
            strength = 1 - trend.confidence;
        }
        else if (trend.changeRate > 1) {
            patternType = 'exponential';
            strength = trend.confidence;
        }
        else {
            patternType = 'linear';
            strength = trend.confidence;
        }
    }
    // Check for seasonality
    const seasonality = (0, exports.detectSeasonality)(data);
    if (seasonality.hasSeasonality && seasonality.strength > 0.6) {
        patternType = 'seasonal';
        strength = seasonality.strength;
        period = seasonality.period;
    }
    return {
        type: patternType,
        strength,
        period,
        components: {
            trend: values,
        },
    };
};
exports.analyzeTimeSeriesPattern = analyzeTimeSeriesPattern;
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
const detectSeasonality = (data, maxPeriod) => {
    if (data.length < 4) {
        return {
            hasSeasonality: false,
            period: 0,
            strength: 0,
            peaks: [],
            troughs: [],
        };
    }
    const values = data.map(d => d.value);
    const max = maxPeriod || Math.floor(data.length / 2);
    let bestPeriod = 0;
    let bestCorrelation = 0;
    // Autocorrelation test
    for (let period = 2; period <= max; period++) {
        let correlation = 0;
        let count = 0;
        for (let i = 0; i < values.length - period; i++) {
            correlation += values[i] * values[i + period];
            count++;
        }
        correlation = correlation / count;
        if (correlation > bestCorrelation) {
            bestCorrelation = correlation;
            bestPeriod = period;
        }
    }
    const hasSeasonality = bestCorrelation > 0.5;
    const strength = hasSeasonality ? Math.min(1, bestCorrelation) : 0;
    // Find peaks and troughs
    const peaks = [];
    const troughs = [];
    for (let i = 1; i < values.length - 1; i++) {
        if (values[i] > values[i - 1] && values[i] > values[i + 1]) {
            peaks.push(i);
        }
        else if (values[i] < values[i - 1] && values[i] < values[i + 1]) {
            troughs.push(i);
        }
    }
    return {
        hasSeasonality,
        period: bestPeriod,
        strength,
        peaks,
        troughs,
    };
};
exports.detectSeasonality = detectSeasonality;
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
const performDecomposition = (data, period, method = 'additive') => {
    if (data.length < period * 2) {
        throw new Error('Insufficient data for decomposition');
    }
    const values = data.map(d => d.value);
    const n = values.length;
    // Calculate trend using moving average
    const trend = new Array(n).fill(0);
    const halfPeriod = Math.floor(period / 2);
    for (let i = halfPeriod; i < n - halfPeriod; i++) {
        let sum = 0;
        for (let j = i - halfPeriod; j <= i + halfPeriod; j++) {
            sum += values[j];
        }
        trend[i] = sum / period;
    }
    // Extend trend to edges
    for (let i = 0; i < halfPeriod; i++) {
        trend[i] = trend[halfPeriod];
        trend[n - 1 - i] = trend[n - 1 - halfPeriod];
    }
    // Calculate detrended series
    const detrended = values.map((v, i) => method === 'additive' ? v - trend[i] : v / (trend[i] || 1));
    // Calculate seasonal component
    const seasonal = new Array(n).fill(0);
    const seasonalAvg = new Array(period).fill(0);
    for (let i = 0; i < period; i++) {
        const indices = [];
        for (let j = i; j < n; j += period) {
            indices.push(j);
        }
        const sum = indices.reduce((s, idx) => s + detrended[idx], 0);
        seasonalAvg[i] = sum / indices.length;
    }
    for (let i = 0; i < n; i++) {
        seasonal[i] = seasonalAvg[i % period];
    }
    // Calculate residual
    const residual = values.map((v, i) => method === 'additive'
        ? v - trend[i] - seasonal[i]
        : v / (trend[i] || 1) / (seasonal[i] || 1));
    return {
        trend,
        seasonal,
        residual,
        method,
    };
};
exports.performDecomposition = performDecomposition;
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
const calculateAutoCorrelation = (values, lag) => {
    if (lag >= values.length || lag < 0) {
        throw new Error('Invalid lag value');
    }
    const n = values.length;
    const mean = values.reduce((sum, v) => sum + v, 0) / n;
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n - lag; i++) {
        numerator += (values[i] - mean) * (values[i + lag] - mean);
    }
    for (let i = 0; i < n; i++) {
        denominator += Math.pow(values[i] - mean, 2);
    }
    return denominator !== 0 ? numerator / denominator : 0;
};
exports.calculateAutoCorrelation = calculateAutoCorrelation;
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
const identifyTimePeriods = (data, threshold) => {
    if (data.length === 0) {
        return [];
    }
    const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
    const periods = [];
    let currentPeriod = {
        start: sorted[0].timestamp,
        end: sorted[0].timestamp,
        count: 1,
    };
    for (let i = 1; i < sorted.length; i++) {
        const gap = sorted[i].timestamp - sorted[i - 1].timestamp;
        if (gap > threshold) {
            periods.push({ ...currentPeriod });
            currentPeriod = {
                start: sorted[i].timestamp,
                end: sorted[i].timestamp,
                count: 1,
            };
        }
        else {
            currentPeriod.end = sorted[i].timestamp;
            currentPeriod.count++;
        }
    }
    periods.push(currentPeriod);
    return periods;
};
exports.identifyTimePeriods = identifyTimePeriods;
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
const aggregateByTimeBucket = (data, bucketSize) => {
    if (data.length === 0) {
        return [];
    }
    const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
    const minTime = sorted[0].timestamp;
    const maxTime = sorted[sorted.length - 1].timestamp;
    const buckets = [];
    for (let start = minTime; start <= maxTime; start += bucketSize) {
        const end = start + bucketSize;
        const bucketData = sorted.filter(d => d.timestamp >= start && d.timestamp < end);
        if (bucketData.length > 0) {
            const values = bucketData.map(d => d.value);
            buckets.push({
                start,
                end,
                count: bucketData.length,
                sum: values.reduce((sum, v) => sum + v, 0),
                average: values.reduce((sum, v) => sum + v, 0) / values.length,
                max: Math.max(...values),
                min: Math.min(...values),
            });
        }
    }
    return buckets;
};
exports.aggregateByTimeBucket = aggregateByTimeBucket;
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
const interpolateMissingData = (data, expectedInterval) => {
    if (data.length < 2) {
        return data;
    }
    const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
    const result = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        const gap = curr.timestamp - prev.timestamp;
        if (gap > expectedInterval * 1.5) {
            const steps = Math.floor(gap / expectedInterval);
            const valueStep = (curr.value - prev.value) / steps;
            for (let j = 1; j < steps; j++) {
                result.push({
                    timestamp: prev.timestamp + expectedInterval * j,
                    value: prev.value + valueStep * j,
                    metadata: { interpolated: true },
                });
            }
        }
        result.push(curr);
    }
    return result;
};
exports.interpolateMissingData = interpolateMissingData;
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
const detectTemporalAnomaly = (data, windowSize = 10) => {
    if (data.length < windowSize) {
        return [];
    }
    const anomalies = [];
    const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
    for (let i = windowSize; i < sorted.length; i++) {
        const window = sorted.slice(i - windowSize, i);
        const mean = window.reduce((sum, d) => sum + d.value, 0) / window.length;
        const stdDev = Math.sqrt(window.reduce((sum, d) => sum + Math.pow(d.value - mean, 2), 0) / window.length);
        const current = sorted[i];
        const deviation = current.value - mean;
        const zScore = stdDev !== 0 ? Math.abs(deviation / stdDev) : 0;
        if (zScore > 2) {
            anomalies.push({
                timestamp: current.timestamp,
                value: current.value,
                expectedValue: mean,
                deviation,
                score: Math.min(1, zScore / 5),
                type: 'point',
                severity: zScore > 4 ? 'critical' : zScore > 3 ? 'high' : 'medium',
            });
        }
    }
    return anomalies;
};
exports.detectTemporalAnomaly = detectTemporalAnomaly;
// ============================================================================
// THREAT FORECASTING
// ============================================================================
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
const forecastThreatLevel = (historicalData, periods, method = 'linear') => {
    if (historicalData.length < 2) {
        throw new Error('Insufficient historical data for forecasting');
    }
    const sorted = [...historicalData].sort((a, b) => a.timestamp - b.timestamp);
    const values = sorted.map(d => d.value);
    const timestamps = sorted.map(d => d.timestamp);
    const avgInterval = timestamps.length > 1
        ? (timestamps[timestamps.length - 1] - timestamps[0]) / (timestamps.length - 1)
        : 86400000; // 1 day default
    const forecasts = [];
    if (method === 'linear') {
        const regression = (0, exports.performRegressionAnalysis)(timestamps.map((_, i) => i), values);
        for (let i = 1; i <= periods; i++) {
            const timestamp = sorted[sorted.length - 1].timestamp + avgInterval * i;
            const index = sorted.length + i - 1;
            const predictedValue = regression.coefficients[0] * index + regression.intercept;
            const ci = (0, exports.calculateConfidenceInterval)(values);
            forecasts.push({
                timestamp,
                predictedValue: Math.max(0, predictedValue),
                confidenceInterval: {
                    lower: Math.max(0, predictedValue - ci.margin),
                    upper: predictedValue + ci.margin,
                    confidence: 0.95,
                    margin: ci.margin,
                },
                method: 'linear',
                accuracy: regression.rSquared,
            });
        }
    }
    else if (method === 'exponential') {
        const lastValue = values[values.length - 1];
        const growthRate = values.length > 1
            ? (values[values.length - 1] - values[0]) / values[0] / values.length
            : 0;
        for (let i = 1; i <= periods; i++) {
            const timestamp = sorted[sorted.length - 1].timestamp + avgInterval * i;
            const predictedValue = lastValue * Math.pow(1 + growthRate, i);
            forecasts.push({
                timestamp,
                predictedValue: Math.max(0, predictedValue),
                confidenceInterval: {
                    lower: Math.max(0, predictedValue * 0.8),
                    upper: predictedValue * 1.2,
                    confidence: 0.90,
                    margin: predictedValue * 0.2,
                },
                method: 'exponential',
            });
        }
    }
    return forecasts;
};
exports.forecastThreatLevel = forecastThreatLevel;
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
const predictAttackWindow = (historicalData, lookAhead) => {
    if (historicalData.length < 5) {
        return [];
    }
    const windows = [];
    const sorted = [...historicalData].sort((a, b) => a.timestamp - b.timestamp);
    // Detect patterns in historical data
    const seasonality = (0, exports.detectSeasonality)(sorted);
    const trend = (0, exports.calculateThreatTrend)(sorted);
    const now = Date.now();
    const futureEnd = now + lookAhead * 3600000;
    if (seasonality.hasSeasonality) {
        const avgInterval = (sorted[sorted.length - 1].timestamp - sorted[0].timestamp) / sorted.length;
        const period = seasonality.period * avgInterval;
        let currentTime = now;
        while (currentTime < futureEnd) {
            const cyclePosition = (currentTime - sorted[0].timestamp) % period;
            const isPeak = seasonality.peaks.some(p => {
                const peakTime = p * avgInterval;
                return Math.abs(cyclePosition - peakTime) < avgInterval * 2;
            });
            if (isPeak) {
                windows.push({
                    start: currentTime,
                    end: currentTime + avgInterval * 3,
                    probability: seasonality.strength * 0.8,
                    severity: seasonality.strength > 0.8 ? 'high' : 'medium',
                    indicators: ['seasonal_pattern', 'historical_peak'],
                });
            }
            currentTime += avgInterval;
        }
    }
    if (trend.direction === 'increasing' && trend.confidence > 0.7) {
        windows.push({
            start: now,
            end: futureEnd,
            probability: trend.confidence * 0.9,
            severity: 'high',
            indicators: ['increasing_trend', 'high_confidence'],
        });
    }
    return windows.sort((a, b) => b.probability - a.probability);
};
exports.predictAttackWindow = predictAttackWindow;
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
const estimateThreatTrajectory = (data, timeHorizon) => {
    if (data.length < 2) {
        throw new Error('Insufficient data for trajectory estimation');
    }
    const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
    const trend = (0, exports.calculateThreatTrend)(sorted);
    const lastPoint = sorted[sorted.length - 1];
    const avgInterval = (sorted[sorted.length - 1].timestamp - sorted[0].timestamp) / (sorted.length - 1);
    const numPoints = Math.ceil(timeHorizon / avgInterval);
    const trajectory = [];
    for (let i = 1; i <= numPoints; i++) {
        const timestamp = lastPoint.timestamp + avgInterval * i;
        const value = lastPoint.value + trend.slope * avgInterval * i * (sorted.length / 1000);
        trajectory.push({
            timestamp,
            value: Math.max(0, Math.min(1, value)),
            severity: value > 0.7 ? 'critical' : value > 0.5 ? 'high' : value > 0.3 ? 'medium' : 'low',
            metadata: { projected: true, confidence: trend.confidence },
        });
    }
    return trajectory;
};
exports.estimateThreatTrajectory = estimateThreatTrajectory;
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
const calculateForecastAccuracy = (actual, predicted) => {
    if (actual.length !== predicted.length || actual.length === 0) {
        throw new Error('Actual and predicted arrays must have equal non-zero length');
    }
    const n = actual.length;
    let mae = 0;
    let mse = 0;
    let mape = 0;
    for (let i = 0; i < n; i++) {
        const error = actual[i] - predicted[i];
        mae += Math.abs(error);
        mse += error * error;
        mape += actual[i] !== 0 ? Math.abs(error / actual[i]) : 0;
    }
    mae /= n;
    mse /= n;
    mape = (mape / n) * 100;
    const rmse = Math.sqrt(mse);
    // Calculate R-squared
    const mean = actual.reduce((sum, v) => sum + v, 0) / n;
    const ssTotal = actual.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0);
    const ssRes = actual.reduce((sum, v, i) => sum + Math.pow(v - predicted[i], 2), 0);
    const r2 = 1 - (ssRes / ssTotal);
    return { mae, mse, rmse, mape, r2 };
};
exports.calculateForecastAccuracy = calculateForecastAccuracy;
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
const generateConfidenceBands = (forecasts, stdDevMultiplier = 1.96) => {
    return forecasts.map((forecast, index) => {
        const margin = forecast.confidenceInterval.margin * stdDevMultiplier / 1.96;
        return {
            ...forecast,
            confidenceInterval: {
                lower: Math.max(0, forecast.predictedValue - margin),
                upper: forecast.predictedValue + margin,
                confidence: stdDevMultiplier === 1.96 ? 0.95 :
                    stdDevMultiplier === 2.58 ? 0.99 :
                        stdDevMultiplier === 1.645 ? 0.90 : 0.95,
                margin,
            },
        };
    });
};
exports.generateConfidenceBands = generateConfidenceBands;
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
const adjustForecastModel = (forecasts, accuracy) => {
    const adjustmentFactor = accuracy.r2 > 0.8 ? 1.0 :
        accuracy.r2 > 0.6 ? 0.9 :
            accuracy.r2 > 0.4 ? 0.8 : 0.7;
    return forecasts.map(forecast => ({
        ...forecast,
        predictedValue: forecast.predictedValue * adjustmentFactor,
        confidenceInterval: {
            ...forecast.confidenceInterval,
            lower: forecast.confidenceInterval.lower * adjustmentFactor,
            upper: forecast.confidenceInterval.upper * adjustmentFactor,
            confidence: forecast.confidenceInterval.confidence * adjustmentFactor,
        },
        accuracy: accuracy.r2,
    }));
};
exports.adjustForecastModel = adjustForecastModel;
// ============================================================================
// ANOMALY DETECTION
// ============================================================================
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
const detectStatisticalAnomaly = (data, threshold = 3) => {
    if (data.length < 3) {
        return [];
    }
    const values = data.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const stdDev = (0, exports.computeStandardDeviation)(values);
    const anomalies = [];
    data.forEach((point) => {
        const deviation = point.value - mean;
        const zScore = stdDev !== 0 ? Math.abs(deviation / stdDev) : 0;
        if (zScore > threshold) {
            anomalies.push({
                timestamp: point.timestamp,
                value: point.value,
                expectedValue: mean,
                deviation,
                score: Math.min(1, zScore / 5),
                type: 'point',
                severity: zScore > 5 ? 'critical' : zScore > 4 ? 'high' : zScore > 3 ? 'medium' : 'low',
            });
        }
    });
    return anomalies.sort((a, b) => b.score - a.score);
};
exports.detectStatisticalAnomaly = detectStatisticalAnomaly;
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
const identifyBehavioralAnomaly = (data, baselineData) => {
    if (data.length === 0 || baselineData.length === 0) {
        return [];
    }
    const baselinePattern = (0, exports.analyzeTimeSeriesPattern)(baselineData);
    const currentPattern = (0, exports.analyzeTimeSeriesPattern)(data);
    const anomalies = [];
    if (baselinePattern.type !== currentPattern.type) {
        const avgValue = data.reduce((sum, d) => sum + d.value, 0) / data.length;
        const baselineAvg = baselineData.reduce((sum, d) => sum + d.value, 0) / baselineData.length;
        anomalies.push({
            timestamp: data[data.length - 1].timestamp,
            value: avgValue,
            expectedValue: baselineAvg,
            deviation: avgValue - baselineAvg,
            score: 0.8,
            type: 'contextual',
            severity: 'high',
        });
    }
    return anomalies;
};
exports.identifyBehavioralAnomaly = identifyBehavioralAnomaly;
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
const calculateAnomalyScore = (point, context) => {
    if (context.length === 0) {
        return 0.5;
    }
    const values = context.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const stdDev = (0, exports.computeStandardDeviation)(values);
    const zScore = stdDev !== 0 ? Math.abs((point.value - mean) / stdDev) : 0;
    const score = Math.min(1, zScore / 5);
    return score;
};
exports.calculateAnomalyScore = calculateAnomalyScore;
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
const clusterAnomalies = (anomalies, timeWindow = 3600000) => {
    if (anomalies.length === 0) {
        return [];
    }
    const sorted = [...anomalies].sort((a, b) => a.timestamp - b.timestamp);
    const clusters = [];
    let currentCluster = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].timestamp - sorted[i - 1].timestamp <= timeWindow) {
            currentCluster.push(sorted[i]);
        }
        else {
            if (currentCluster.length > 0) {
                const avgTimestamp = currentCluster.reduce((sum, a) => sum + a.timestamp, 0) / currentCluster.length;
                const avgValue = currentCluster.reduce((sum, a) => sum + a.value, 0) / currentCluster.length;
                clusters.push({
                    id: `cluster-${clusters.length + 1}`,
                    anomalies: currentCluster,
                    centroid: { timestamp: avgTimestamp, value: avgValue },
                    radius: timeWindow,
                    density: currentCluster.length / timeWindow,
                });
            }
            currentCluster = [sorted[i]];
        }
    }
    if (currentCluster.length > 0) {
        const avgTimestamp = currentCluster.reduce((sum, a) => sum + a.timestamp, 0) / currentCluster.length;
        const avgValue = currentCluster.reduce((sum, a) => sum + a.value, 0) / currentCluster.length;
        clusters.push({
            id: `cluster-${clusters.length + 1}`,
            anomalies: currentCluster,
            centroid: { timestamp: avgTimestamp, value: avgValue },
            radius: timeWindow,
            density: currentCluster.length / timeWindow,
        });
    }
    return clusters;
};
exports.clusterAnomalies = clusterAnomalies;
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
const validateAnomaly = (anomaly, additionalContext) => {
    if (additionalContext.length === 0) {
        return anomaly.score > 0.7;
    }
    const contextScore = (0, exports.calculateAnomalyScore)({ timestamp: anomaly.timestamp, value: anomaly.value }, additionalContext);
    return anomaly.score > 0.6 && contextScore > 0.5;
};
exports.validateAnomaly = validateAnomaly;
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
const rankAnomaliesBySeverity = (anomalies) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return [...anomalies].sort((a, b) => {
        const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
        if (severityDiff !== 0)
            return severityDiff;
        return b.score - a.score;
    });
};
exports.rankAnomaliesBySeverity = rankAnomaliesBySeverity;
// ============================================================================
// PATTERN RECOGNITION
// ============================================================================
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
const extractThreatPattern = (data, minFrequency = 2) => {
    if (data.length < minFrequency) {
        return [];
    }
    const patterns = [];
    const windowSize = Math.min(5, Math.floor(data.length / 2));
    for (let i = 0; i <= data.length - windowSize; i++) {
        const window = data.slice(i, i + windowSize);
        const signature = window.map(d => d.value.toFixed(2)).join('-');
        const existing = patterns.find(p => p.signature === signature);
        if (existing) {
            existing.frequency++;
            existing.lastSeen = window[window.length - 1].timestamp;
        }
        else {
            patterns.push({
                id: `pattern-${patterns.length + 1}`,
                signature,
                features: {
                    avgValue: window.reduce((sum, d) => sum + d.value, 0) / window.length,
                    trend: (0, exports.calculateThreatTrend)(window).direction,
                    volatility: (0, exports.computeStandardDeviation)(window.map(d => d.value)),
                },
                frequency: 1,
                lastSeen: window[window.length - 1].timestamp,
                confidence: 0.5,
            });
        }
    }
    return patterns
        .filter(p => p.frequency >= minFrequency)
        .map(p => ({ ...p, confidence: Math.min(1, p.frequency / data.length) }))
        .sort((a, b) => b.frequency - a.frequency);
};
exports.extractThreatPattern = extractThreatPattern;
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
const matchKnownPatterns = (currentData, knownPatterns) => {
    const matches = [];
    const currentSignature = currentData.map(d => d.value.toFixed(2)).join('-');
    knownPatterns.forEach(pattern => {
        const similarity = (0, exports.calculatePatternSimilarity)(currentData, pattern.signature.split('-').map(Number));
        if (similarity > 0.7) {
            matches.push({
                pattern,
                similarity,
                matchedFeatures: Object.keys(pattern.features),
                score: similarity * pattern.confidence,
            });
        }
    });
    return matches.sort((a, b) => b.score - a.score);
};
exports.matchKnownPatterns = matchKnownPatterns;
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
const calculatePatternSimilarity = (data1, data2Values) => {
    const values1 = data1.map(d => d.value);
    const minLength = Math.min(values1.length, data2Values.length);
    if (minLength === 0)
        return 0;
    const normalized1 = (0, exports.normalizeDataset)(values1.slice(0, minLength));
    const normalized2 = (0, exports.normalizeDataset)(data2Values.slice(0, minLength));
    let sumSquaredDiff = 0;
    for (let i = 0; i < minLength; i++) {
        sumSquaredDiff += Math.pow(normalized1[i] - normalized2[i], 2);
    }
    const rmse = Math.sqrt(sumSquaredDiff / minLength);
    return Math.max(0, 1 - rmse);
};
exports.calculatePatternSimilarity = calculatePatternSimilarity;
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
const identifyPatternEvolution = (patternId, historicalInstances) => {
    if (historicalInstances.length < 2) {
        throw new Error('At least 2 instances required for evolution analysis');
    }
    const timeline = historicalInstances.map(instance => ({
        timestamp: instance.timestamp,
        features: {
            avgValue: instance.data.reduce((sum, d) => sum + d.value, 0) / instance.data.length,
            maxValue: Math.max(...instance.data.map(d => d.value)),
            trend: (0, exports.calculateThreatTrend)(instance.data).direction,
        },
    }));
    const changes = [];
    for (let i = 1; i < timeline.length; i++) {
        const prev = timeline[i - 1].features.avgValue;
        const curr = timeline[i].features.avgValue;
        changes.push(Math.abs(curr - prev) / prev);
    }
    const changeRate = changes.reduce((sum, c) => sum + c, 0) / changes.length;
    const stability = 1 - Math.min(1, changeRate);
    return {
        patternId,
        timeline,
        changeRate,
        stability,
    };
};
exports.identifyPatternEvolution = identifyPatternEvolution;
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
const generatePatternSignature = (data) => {
    if (data.length === 0) {
        throw new Error('Cannot generate signature from empty data');
    }
    const normalized = (0, exports.normalizeDataset)(data.map(d => d.value));
    return normalized.map(v => v.toFixed(2)).join('-');
};
exports.generatePatternSignature = generatePatternSignature;
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
const classifyPatternType = (pattern) => {
    const avgValue = pattern.features.avgValue || 0;
    const volatility = pattern.features.volatility || 0;
    const trend = pattern.features.trend;
    if (pattern.frequency > 10 && volatility < 0.2) {
        return 'periodic';
    }
    else if (pattern.frequency < 5 && volatility > 0.5) {
        return 'sporadic';
    }
    else if (trend === 'increasing' && avgValue > 0.7) {
        return 'escalating';
    }
    else if (trend === 'stable' && pattern.frequency > 5) {
        return 'persistent';
    }
    return 'unclassified';
};
exports.classifyPatternType = classifyPatternType;
// ============================================================================
// THREAT CLUSTERING
// ============================================================================
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
const performKMeansClustering = (data, k, maxIterations = 100) => {
    if (data.length < k) {
        throw new Error('Number of clusters cannot exceed number of data points');
    }
    // Initialize centroids randomly
    const centroids = [];
    const used = new Set();
    while (centroids.length < k) {
        const idx = Math.floor(Math.random() * data.length);
        if (!used.has(idx)) {
            centroids.push([data[idx].value]);
            used.add(idx);
        }
    }
    let clusters = [];
    let iterations = 0;
    for (iterations = 0; iterations < maxIterations; iterations++) {
        // Assign points to nearest centroid
        const assignments = data.map(point => {
            let minDist = Infinity;
            let cluster = 0;
            centroids.forEach((centroid, i) => {
                const dist = Math.abs(point.value - centroid[0]);
                if (dist < minDist) {
                    minDist = dist;
                    cluster = i;
                }
            });
            return cluster;
        });
        // Create clusters
        const newClusters = centroids.map((centroid, i) => ({
            id: i,
            centroid,
            members: data.filter((_, idx) => assignments[idx] === i),
            size: 0,
            variance: 0,
        }));
        // Update centroids
        let changed = false;
        newClusters.forEach((cluster, i) => {
            if (cluster.members.length > 0) {
                const newCentroid = cluster.members.reduce((sum, d) => sum + d.value, 0) / cluster.members.length;
                if (Math.abs(newCentroid - centroids[i][0]) > 0.0001) {
                    changed = true;
                    centroids[i] = [newCentroid];
                }
                cluster.size = cluster.members.length;
                cluster.variance = cluster.members.reduce((sum, d) => sum + Math.pow(d.value - newCentroid, 2), 0) / cluster.members.length;
            }
        });
        clusters = newClusters;
        if (!changed)
            break;
    }
    // Calculate metrics
    const inertia = clusters.reduce((sum, cluster) => sum + cluster.members.reduce((s, d) => s + Math.pow(d.value - cluster.centroid[0], 2), 0), 0);
    // Simplified silhouette score
    const silhouetteScore = 0.7; // Placeholder
    return {
        clusters,
        silhouetteScore,
        inertia,
        iterations,
    };
};
exports.performKMeansClustering = performKMeansClustering;
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
const calculateClusterCentroid = (members) => {
    if (members.length === 0) {
        return [0];
    }
    const avgValue = members.reduce((sum, d) => sum + d.value, 0) / members.length;
    return [avgValue];
};
exports.calculateClusterCentroid = calculateClusterCentroid;
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
const assignToCluster = (point, clusters) => {
    if (clusters.length === 0) {
        throw new Error('No clusters available for assignment');
    }
    let minDist = Infinity;
    let assignedCluster = 0;
    clusters.forEach(cluster => {
        const dist = Math.abs(point.value - cluster.centroid[0]);
        if (dist < minDist) {
            minDist = dist;
            assignedCluster = cluster.id;
        }
    });
    return assignedCluster;
};
exports.assignToCluster = assignToCluster;
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
const validateClusterQuality = (result) => {
    const issues = [];
    // Check for empty clusters
    const emptyClusters = result.clusters.filter(c => c.members.length === 0);
    if (emptyClusters.length > 0) {
        issues.push(`${emptyClusters.length} empty cluster(s) found`);
    }
    // Check silhouette score
    if (result.silhouetteScore < 0.3) {
        issues.push('Low silhouette score indicates poor clustering');
    }
    // Check cluster sizes
    const avgSize = result.clusters.reduce((sum, c) => sum + c.size, 0) / result.clusters.length;
    const imbalanced = result.clusters.some(c => c.size > avgSize * 3 || (c.size < avgSize / 3 && c.size > 0));
    if (imbalanced) {
        issues.push('Clusters are highly imbalanced');
    }
    const score = result.silhouetteScore * (1 - emptyClusters.length / result.clusters.length);
    const isValid = issues.length === 0 && score > 0.5;
    return { isValid, score, issues };
};
exports.validateClusterQuality = validateClusterQuality;
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
const optimizeClusterCount = (data, maxK = 10) => {
    if (data.length < 2) {
        return 1;
    }
    const maxClusters = Math.min(maxK, Math.floor(data.length / 2));
    const inertias = [];
    for (let k = 1; k <= maxClusters; k++) {
        const result = (0, exports.performKMeansClustering)(data, k, 50);
        inertias.push(result.inertia);
    }
    // Find elbow point
    let maxGain = 0;
    let optimalK = 2;
    for (let i = 1; i < inertias.length - 1; i++) {
        const gain = inertias[i - 1] - inertias[i] - (inertias[i] - inertias[i + 1]);
        if (gain > maxGain) {
            maxGain = gain;
            optimalK = i + 1;
        }
    }
    return optimalK;
};
exports.optimizeClusterCount = optimizeClusterCount;
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
const mergeRelatedClusters = (clusters, threshold = 0.8) => {
    if (clusters.length < 2) {
        return clusters;
    }
    const merged = [...clusters];
    let changed = true;
    while (changed) {
        changed = false;
        for (let i = 0; i < merged.length - 1; i++) {
            for (let j = i + 1; j < merged.length; j++) {
                const dist = Math.abs(merged[i].centroid[0] - merged[j].centroid[0]);
                const avgVariance = (merged[i].variance + merged[j].variance) / 2;
                if (dist < avgVariance * (1 - threshold)) {
                    // Merge clusters
                    const combinedMembers = [...merged[i].members, ...merged[j].members];
                    const newCentroid = (0, exports.calculateClusterCentroid)(combinedMembers);
                    merged[i] = {
                        id: merged[i].id,
                        centroid: newCentroid,
                        members: combinedMembers,
                        size: combinedMembers.length,
                        variance: combinedMembers.reduce((sum, d) => sum + Math.pow(d.value - newCentroid[0], 2), 0) / combinedMembers.length,
                    };
                    merged.splice(j, 1);
                    changed = true;
                    break;
                }
            }
            if (changed)
                break;
        }
    }
    return merged;
};
exports.mergeRelatedClusters = mergeRelatedClusters;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Trend analysis
    calculateThreatTrend: exports.calculateThreatTrend,
    analyzeTrendDirection: exports.analyzeTrendDirection,
    detectTrendChange: exports.detectTrendChange,
    compareTrendPeriods: exports.compareTrendPeriods,
    smoothTrendData: exports.smoothTrendData,
    calculateMovingAverage: exports.calculateMovingAverage,
    identifyTrendOutliers: exports.identifyTrendOutliers,
    forecastTrendContinuation: exports.forecastTrendContinuation,
    // Statistical modeling
    calculateThreatProbability: exports.calculateThreatProbability,
    computeBayesianThreatScore: exports.computeBayesianThreatScore,
    analyzeStatisticalSignificance: exports.analyzeStatisticalSignificance,
    calculateCorrelationMatrix: exports.calculateCorrelationMatrix,
    performRegressionAnalysis: exports.performRegressionAnalysis,
    computeStandardDeviation: exports.computeStandardDeviation,
    calculateConfidenceInterval: exports.calculateConfidenceInterval,
    normalizeDataset: exports.normalizeDataset,
    // Time-series analysis
    analyzeTimeSeriesPattern: exports.analyzeTimeSeriesPattern,
    detectSeasonality: exports.detectSeasonality,
    performDecomposition: exports.performDecomposition,
    calculateAutoCorrelation: exports.calculateAutoCorrelation,
    identifyTimePeriods: exports.identifyTimePeriods,
    aggregateByTimeBucket: exports.aggregateByTimeBucket,
    interpolateMissingData: exports.interpolateMissingData,
    detectTemporalAnomaly: exports.detectTemporalAnomaly,
    // Forecasting
    forecastThreatLevel: exports.forecastThreatLevel,
    predictAttackWindow: exports.predictAttackWindow,
    estimateThreatTrajectory: exports.estimateThreatTrajectory,
    calculateForecastAccuracy: exports.calculateForecastAccuracy,
    generateConfidenceBands: exports.generateConfidenceBands,
    adjustForecastModel: exports.adjustForecastModel,
    // Anomaly detection
    detectStatisticalAnomaly: exports.detectStatisticalAnomaly,
    identifyBehavioralAnomaly: exports.identifyBehavioralAnomaly,
    calculateAnomalyScore: exports.calculateAnomalyScore,
    clusterAnomalies: exports.clusterAnomalies,
    validateAnomaly: exports.validateAnomaly,
    rankAnomaliesBySeverity: exports.rankAnomaliesBySeverity,
    // Pattern recognition
    extractThreatPattern: exports.extractThreatPattern,
    matchKnownPatterns: exports.matchKnownPatterns,
    calculatePatternSimilarity: exports.calculatePatternSimilarity,
    identifyPatternEvolution: exports.identifyPatternEvolution,
    generatePatternSignature: exports.generatePatternSignature,
    classifyPatternType: exports.classifyPatternType,
    // Clustering
    performKMeansClustering: exports.performKMeansClustering,
    calculateClusterCentroid: exports.calculateClusterCentroid,
    assignToCluster: exports.assignToCluster,
    validateClusterQuality: exports.validateClusterQuality,
    optimizeClusterCount: exports.optimizeClusterCount,
    mergeRelatedClusters: exports.mergeRelatedClusters,
};
//# sourceMappingURL=threat-analytics-kit.js.map