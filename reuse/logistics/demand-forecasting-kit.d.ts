/**
 * LOC: LOG-FCST-001
 * File: /reuse/logistics/demand-forecasting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Inventory management services
 *   - Supply chain planning modules
 *   - Production scheduling systems
 *   - Procurement services
 */
/**
 * Forecast method enumeration
 */
export declare enum ForecastMethod {
    SIMPLE_MOVING_AVERAGE = "SIMPLE_MOVING_AVERAGE",
    WEIGHTED_MOVING_AVERAGE = "WEIGHTED_MOVING_AVERAGE",
    EXPONENTIAL_SMOOTHING = "EXPONENTIAL_SMOOTHING",
    DOUBLE_EXPONENTIAL_SMOOTHING = "DOUBLE_EXPONENTIAL_SMOOTHING",
    TRIPLE_EXPONENTIAL_SMOOTHING = "TRIPLE_EXPONENTIAL_SMOOTHING",
    LINEAR_REGRESSION = "LINEAR_REGRESSION",
    SEASONAL_DECOMPOSITION = "SEASONAL_DECOMPOSITION",
    ARIMA = "ARIMA",
    ENSEMBLE = "ENSEMBLE"
}
/**
 * Seasonality pattern type
 */
export declare enum SeasonalityPattern {
    NONE = "NONE",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    YEARLY = "YEARLY",
    CUSTOM = "CUSTOM"
}
/**
 * Trend direction
 */
export declare enum TrendDirection {
    INCREASING = "INCREASING",
    DECREASING = "DECREASING",
    STABLE = "STABLE",
    VOLATILE = "VOLATILE"
}
/**
 * ABC classification
 */
export declare enum ABCClassification {
    A = "A",// High value items (70-80% of value, 10-20% of items)
    B = "B",// Medium value items (15-25% of value, 30% of items)
    C = "C"
}
/**
 * Demand signal type
 */
export declare enum DemandSignal {
    SPIKE = "SPIKE",// Sudden increase
    DROP = "DROP",// Sudden decrease
    TREND_CHANGE = "TREND_CHANGE",
    SEASONALITY_SHIFT = "SEASONALITY_SHIFT",
    OUTLIER = "OUTLIER",
    NORMAL = "NORMAL"
}
/**
 * Historical demand data point
 */
export interface DemandDataPoint {
    date: Date;
    period: number;
    actualDemand: number;
    forecastedDemand?: number;
    productId: string;
    locationId?: string;
    metadata?: Record<string, any>;
}
/**
 * Historical demand dataset
 */
export interface DemandHistory {
    productId: string;
    locationId?: string;
    dataPoints: DemandDataPoint[];
    startDate: Date;
    endDate: Date;
    totalPeriods: number;
    averageDemand: number;
    metadata?: Record<string, any>;
}
/**
 * Forecast configuration
 */
export interface ForecastConfig {
    method: ForecastMethod;
    periods: number;
    alpha?: number;
    beta?: number;
    gamma?: number;
    seasonalityPeriod?: number;
    confidenceLevel?: number;
    includeTrend?: boolean;
    includeSeasonality?: boolean;
    outlierThreshold?: number;
}
/**
 * Forecast result
 */
export interface ForecastResult {
    forecastId: string;
    productId: string;
    locationId?: string;
    method: ForecastMethod;
    generatedAt: Date;
    forecastPeriods: ForecastPeriod[];
    accuracy?: ForecastAccuracy;
    metadata?: Record<string, any>;
}
/**
 * Individual forecast period
 */
export interface ForecastPeriod {
    period: number;
    date: Date;
    forecastedDemand: number;
    lowerBound?: number;
    upperBound?: number;
    confidence?: number;
    trendComponent?: number;
    seasonalComponent?: number;
    baselineComponent?: number;
}
/**
 * Forecast accuracy metrics
 */
export interface ForecastAccuracy {
    mape: number;
    mad: number;
    mse: number;
    rmse: number;
    bias: number;
    trackingSignal: number;
    dataPoints: number;
    lastUpdated: Date;
}
/**
 * Seasonality analysis result
 */
export interface SeasonalityAnalysis {
    detected: boolean;
    pattern: SeasonalityPattern;
    period: number;
    strength: number;
    seasonalIndices: number[];
    peakPeriods: number[];
    troughPeriods: number[];
}
/**
 * Trend analysis result
 */
export interface TrendAnalysis {
    direction: TrendDirection;
    slope: number;
    strength: number;
    volatility: number;
    coefficient: number;
    intercept: number;
}
/**
 * Demand signal detection result
 */
export interface DemandSignalResult {
    signal: DemandSignal;
    period: number;
    date: Date;
    actualValue: number;
    expectedValue: number;
    deviation: number;
    deviationPercentage: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
}
/**
 * Safety stock calculation
 */
export interface SafetyStockCalculation {
    productId: string;
    locationId?: string;
    safetyStock: number;
    reorderPoint: number;
    serviceLevel: number;
    leadTime: number;
    leadTimeDemand: number;
    demandStdDev: number;
    leadTimeStdDev?: number;
}
/**
 * ABC analysis result
 */
export interface ABCAnalysisResult {
    productId: string;
    classification: ABCClassification;
    annualDemand: number;
    annualValue: number;
    unitCost: number;
    percentOfTotalValue: number;
    cumulativePercent: number;
}
/**
 * Statistical summary
 */
export interface StatisticalSummary {
    mean: number;
    median: number;
    mode: number;
    stdDev: number;
    variance: number;
    min: number;
    max: number;
    range: number;
    coefficient: number;
    skewness: number;
    kurtosis: number;
}
/**
 * Outlier detection result
 */
export interface OutlierDetection {
    period: number;
    date: Date;
    value: number;
    expectedValue: number;
    zScore: number;
    isOutlier: boolean;
    severity: 'MILD' | 'MODERATE' | 'EXTREME';
}
/**
 * Forecast adjustment
 */
export interface ForecastAdjustment {
    adjustmentId: string;
    forecastId: string;
    period: number;
    originalForecast: number;
    adjustedForecast: number;
    adjustmentAmount: number;
    adjustmentPercent: number;
    reason: string;
    appliedBy: string;
    appliedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Ensemble forecast configuration
 */
export interface EnsembleForecastConfig {
    methods: ForecastMethod[];
    weights?: number[];
    combineStrategy: 'AVERAGE' | 'WEIGHTED_AVERAGE' | 'MEDIAN' | 'BEST_PERFORMER';
}
/**
 * 1. Creates a historical demand dataset from raw data points.
 *
 * @param {string} productId - Product identifier
 * @param {DemandDataPoint[]} dataPoints - Raw demand data
 * @param {string} locationId - Optional location identifier
 * @returns {DemandHistory} Structured demand history
 *
 * @example
 * ```typescript
 * const history = createDemandHistory('PROD-001', dataPoints, 'WH-01');
 * console.log('Average demand:', history.averageDemand);
 * ```
 */
export declare function createDemandHistory(productId: string, dataPoints: DemandDataPoint[], locationId?: string): DemandHistory;
/**
 * 2. Validates demand data for completeness and quality.
 *
 * @param {DemandHistory} history - Demand history to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateDemandData(history);
 * if (!validation.valid) {
 *   console.error('Data issues:', validation.issues);
 * }
 * ```
 */
export declare function validateDemandData(history: DemandHistory): {
    valid: boolean;
    issues: string[];
    warnings: string[];
    dataQuality: number;
};
/**
 * 3. Cleans demand data by removing outliers and handling missing values.
 *
 * @param {DemandHistory} history - Original demand history
 * @param {object} options - Cleaning options
 * @returns {DemandHistory} Cleaned demand history
 *
 * @example
 * ```typescript
 * const cleaned = cleanDemandData(history, {
 *   removeOutliers: true,
 *   outlierThreshold: 3.0,
 *   fillMissing: true,
 *   fillMethod: 'INTERPOLATE'
 * });
 * ```
 */
export declare function cleanDemandData(history: DemandHistory, options?: {
    removeOutliers?: boolean;
    outlierThreshold?: number;
    fillMissing?: boolean;
    fillMethod?: 'ZERO' | 'AVERAGE' | 'INTERPOLATE' | 'FORWARD_FILL';
}): DemandHistory;
/**
 * 4. Normalizes demand data to remove scale differences.
 *
 * @param {DemandHistory} history - Demand history
 * @param {object} method - Normalization method
 * @returns {object} Normalized data and scaler parameters
 *
 * @example
 * ```typescript
 * const { normalized, scaler } = normalizeDemandData(history, { method: 'MIN_MAX' });
 * ```
 */
export declare function normalizeDemandData(history: DemandHistory, options?: {
    method: 'MIN_MAX' | 'Z_SCORE' | 'DECIMAL_SCALING';
}): {
    normalized: DemandHistory;
    scaler: {
        method: string;
        min?: number;
        max?: number;
        mean?: number;
        stdDev?: number;
        scale?: number;
    };
};
/**
 * 5. Aggregates demand data to different time periods.
 *
 * @param {DemandHistory} history - Demand history
 * @param {string} aggregationLevel - Target aggregation level
 * @returns {DemandHistory} Aggregated demand history
 *
 * @example
 * ```typescript
 * const monthlyDemand = aggregateDemandData(dailyHistory, 'MONTHLY');
 * ```
 */
export declare function aggregateDemandData(history: DemandHistory, aggregationLevel: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'): DemandHistory;
/**
 * 6. Splits demand history into training and testing sets.
 *
 * @param {DemandHistory} history - Complete demand history
 * @param {number} trainingRatio - Ratio of data for training (0-1)
 * @returns {object} Training and testing datasets
 *
 * @example
 * ```typescript
 * const { training, testing } = splitDemandData(history, 0.8);
 * ```
 */
export declare function splitDemandData(history: DemandHistory, trainingRatio?: number): {
    training: DemandHistory;
    testing: DemandHistory;
};
/**
 * 7. Detects and handles missing values in demand data.
 *
 * @param {DemandDataPoint[]} dataPoints - Data points
 * @param {string} fillMethod - Method to fill missing values
 * @returns {DemandDataPoint[]} Complete data points
 *
 * @example
 * ```typescript
 * const filled = fillMissingDemandValues(dataPoints, 'INTERPOLATE');
 * ```
 */
export declare function fillMissingDemandValues(dataPoints: DemandDataPoint[], fillMethod?: 'ZERO' | 'AVERAGE' | 'INTERPOLATE' | 'FORWARD_FILL'): DemandDataPoint[];
/**
 * 8. Calculates statistical summary of demand data.
 *
 * @param {number[]} values - Demand values
 * @returns {StatisticalSummary} Statistical summary
 *
 * @example
 * ```typescript
 * const stats = calculateStatisticalSummary(demandValues);
 * console.log('Mean:', stats.mean, 'StdDev:', stats.stdDev);
 * ```
 */
export declare function calculateStatisticalSummary(values: number[]): StatisticalSummary;
/**
 * 9. Detects outliers in demand data using statistical methods.
 *
 * @param {DemandDataPoint[]} dataPoints - Data points
 * @param {number} threshold - Z-score threshold for outlier detection
 * @returns {OutlierDetection[]} Outlier detection results
 *
 * @example
 * ```typescript
 * const outliers = detectOutliers(dataPoints, 3.0);
 * const extremeOutliers = outliers.filter(o => o.severity === 'EXTREME');
 * ```
 */
export declare function detectOutliers(dataPoints: DemandDataPoint[], threshold?: number): OutlierDetection[];
/**
 * 10. Generates forecast using Simple Moving Average method.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} periods - Number of periods to forecast
 * @param {number} windowSize - Moving average window size
 * @returns {ForecastResult} Forecast result
 *
 * @example
 * ```typescript
 * const forecast = forecastSimpleMovingAverage(history, 12, 3);
 * ```
 */
export declare function forecastSimpleMovingAverage(history: DemandHistory, periods: number, windowSize?: number): ForecastResult;
/**
 * 11. Generates forecast using Weighted Moving Average method.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} periods - Number of periods to forecast
 * @param {number[]} weights - Weights for each period (most recent first)
 * @returns {ForecastResult} Forecast result
 *
 * @example
 * ```typescript
 * const forecast = forecastWeightedMovingAverage(history, 12, [0.5, 0.3, 0.2]);
 * ```
 */
export declare function forecastWeightedMovingAverage(history: DemandHistory, periods: number, weights?: number[]): ForecastResult;
/**
 * 12. Generates forecast using Single Exponential Smoothing.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} periods - Number of periods to forecast
 * @param {number} alpha - Smoothing parameter (0-1)
 * @returns {ForecastResult} Forecast result
 *
 * @example
 * ```typescript
 * const forecast = forecastExponentialSmoothing(history, 12, 0.3);
 * ```
 */
export declare function forecastExponentialSmoothing(history: DemandHistory, periods: number, alpha?: number): ForecastResult;
/**
 * 13. Generates forecast using Double Exponential Smoothing (Holt's method).
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} periods - Number of periods to forecast
 * @param {number} alpha - Level smoothing parameter
 * @param {number} beta - Trend smoothing parameter
 * @returns {ForecastResult} Forecast result
 *
 * @example
 * ```typescript
 * const forecast = forecastDoubleExponentialSmoothing(history, 12, 0.3, 0.1);
 * ```
 */
export declare function forecastDoubleExponentialSmoothing(history: DemandHistory, periods: number, alpha?: number, beta?: number): ForecastResult;
/**
 * 14. Generates forecast using Linear Regression.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} periods - Number of periods to forecast
 * @returns {ForecastResult} Forecast result
 *
 * @example
 * ```typescript
 * const forecast = forecastLinearRegression(history, 12);
 * ```
 */
export declare function forecastLinearRegression(history: DemandHistory, periods: number): ForecastResult;
/**
 * 15. Selects the best forecast method based on historical accuracy.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {ForecastMethod[]} methods - Methods to evaluate
 * @returns {object} Best method and accuracy comparison
 *
 * @example
 * ```typescript
 * const { bestMethod, accuracyComparison } = selectBestForecastMethod(history, [
 *   ForecastMethod.SIMPLE_MOVING_AVERAGE,
 *   ForecastMethod.EXPONENTIAL_SMOOTHING,
 *   ForecastMethod.LINEAR_REGRESSION
 * ]);
 * ```
 */
export declare function selectBestForecastMethod(history: DemandHistory, methods?: ForecastMethod[]): {
    bestMethod: ForecastMethod;
    accuracyComparison: Array<{
        method: ForecastMethod;
        mape: number;
        mad: number;
    }>;
};
/**
 * 16. Creates an ensemble forecast combining multiple methods.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} periods - Number of periods to forecast
 * @param {EnsembleForecastConfig} config - Ensemble configuration
 * @returns {ForecastResult} Ensemble forecast result
 *
 * @example
 * ```typescript
 * const ensemble = createEnsembleForecast(history, 12, {
 *   methods: [
 *     ForecastMethod.EXPONENTIAL_SMOOTHING,
 *     ForecastMethod.LINEAR_REGRESSION
 *   ],
 *   weights: [0.6, 0.4],
 *   combineStrategy: 'WEIGHTED_AVERAGE'
 * });
 * ```
 */
export declare function createEnsembleForecast(history: DemandHistory, periods: number, config: EnsembleForecastConfig): ForecastResult;
/**
 * 17. Optimizes forecast parameters using grid search.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {ForecastMethod} method - Forecast method
 * @param {object} parameterRanges - Parameter ranges to search
 * @returns {object} Optimal parameters and accuracy
 *
 * @example
 * ```typescript
 * const optimal = optimizeForecastParameters(history,
 *   ForecastMethod.EXPONENTIAL_SMOOTHING,
 *   { alpha: [0.1, 0.2, 0.3, 0.4, 0.5] }
 * );
 * ```
 */
export declare function optimizeForecastParameters(history: DemandHistory, method: ForecastMethod, parameterRanges: Record<string, number[]>): {
    optimalParameters: Record<string, number>;
    accuracy: ForecastAccuracy;
};
/**
 * 18. Analyzes trend in demand data.
 *
 * @param {DemandHistory} history - Historical demand data
 * @returns {TrendAnalysis} Trend analysis result
 *
 * @example
 * ```typescript
 * const trend = analyzeTrend(history);
 * console.log('Trend direction:', trend.direction);
 * console.log('Slope:', trend.slope);
 * ```
 */
export declare function analyzeTrend(history: DemandHistory): TrendAnalysis;
/**
 * 19. Detects seasonality patterns in demand data.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} maxPeriod - Maximum seasonal period to test
 * @returns {SeasonalityAnalysis} Seasonality analysis result
 *
 * @example
 * ```typescript
 * const seasonality = detectSeasonality(history, 12);
 * if (seasonality.detected) {
 *   console.log('Seasonal pattern:', seasonality.pattern);
 *   console.log('Period:', seasonality.period);
 * }
 * ```
 */
export declare function detectSeasonality(history: DemandHistory, maxPeriod?: number): SeasonalityAnalysis;
/**
 * 20. Decomposes demand into trend, seasonal, and residual components.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} seasonalPeriod - Seasonal period length
 * @returns {object} Decomposed components
 *
 * @example
 * ```typescript
 * const decomposed = decomposeTimeSeries(history, 12);
 * console.log('Trend:', decomposed.trend);
 * console.log('Seasonal:', decomposed.seasonal);
 * ```
 */
export declare function decomposeTimeSeries(history: DemandHistory, seasonalPeriod: number): {
    trend: number[];
    seasonal: number[];
    residual: number[];
    deseasonalized: number[];
};
/**
 * 21. Calculates seasonal indices for each period.
 *
 * @param {number[]} values - Demand values
 * @param {number} seasonalPeriod - Seasonal period length
 * @returns {number[]} Seasonal indices
 *
 * @example
 * ```typescript
 * const indices = calculateSeasonalIndices(demandValues, 12);
 * ```
 */
export declare function calculateSeasonalIndices(values: number[], seasonalPeriod: number): number[];
/**
 * 22. Calculates autocorrelation for lag analysis.
 *
 * @param {number[]} values - Time series values
 * @param {number} lag - Lag period
 * @returns {number} Autocorrelation coefficient
 *
 * @example
 * ```typescript
 * const autocorr = calculateAutocorrelation(demandValues, 7);
 * ```
 */
export declare function calculateAutocorrelation(values: number[], lag: number): number;
/**
 * 23. Identifies cyclical patterns in demand.
 *
 * @param {DemandHistory} history - Historical demand data
 * @returns {object} Cyclical pattern analysis
 *
 * @example
 * ```typescript
 * const cycles = identifyCyclicalPatterns(history);
 * ```
 */
export declare function identifyCyclicalPatterns(history: DemandHistory): {
    cyclesDetected: boolean;
    cyclePeriod?: number;
    cycleStrength?: number;
    peaks: number[];
    troughs: number[];
};
/**
 * 24. Removes seasonal component from data (deseasonalization).
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} seasonalPeriod - Seasonal period length
 * @returns {DemandHistory} Deseasonalized demand history
 *
 * @example
 * ```typescript
 * const deseasonalized = removeSeasonality(history, 12);
 * ```
 */
export declare function removeSeasonality(history: DemandHistory, seasonalPeriod: number): DemandHistory;
/**
 * 25. Applies seasonal adjustment to forecast.
 *
 * @param {ForecastResult} forecast - Base forecast
 * @param {number[]} seasonalIndices - Seasonal indices
 * @returns {ForecastResult} Seasonally adjusted forecast
 *
 * @example
 * ```typescript
 * const adjusted = applySeasonalAdjustment(baseForecast, seasonalIndices);
 * ```
 */
export declare function applySeasonalAdjustment(forecast: ForecastResult, seasonalIndices: number[]): ForecastResult;
/**
 * 26. Detects structural breaks or regime changes in demand.
 *
 * @param {DemandHistory} history - Historical demand data
 * @returns {object} Structural break analysis
 *
 * @example
 * ```typescript
 * const breaks = detectStructuralBreaks(history);
 * ```
 */
export declare function detectStructuralBreaks(history: DemandHistory): {
    breaksDetected: boolean;
    breakPoints: Array<{
        period: number;
        date: Date;
        beforeMean: number;
        afterMean: number;
        changePercent: number;
    }>;
};
/**
 * 27. Generates multi-period forecast with confidence intervals.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {ForecastConfig} config - Forecast configuration
 * @returns {ForecastResult} Forecast with confidence intervals
 *
 * @example
 * ```typescript
 * const forecast = generateForecastWithConfidence(history, {
 *   method: ForecastMethod.EXPONENTIAL_SMOOTHING,
 *   periods: 12,
 *   confidenceLevel: 0.95
 * });
 * ```
 */
export declare function generateForecastWithConfidence(history: DemandHistory, config: ForecastConfig): ForecastResult;
/**
 * 28. Generates forecast with trend and seasonality.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} periods - Number of periods to forecast
 * @param {number} seasonalPeriod - Seasonal period length
 * @returns {ForecastResult} Forecast with trend and seasonality
 *
 * @example
 * ```typescript
 * const forecast = generateSeasonalTrendForecast(history, 12, 12);
 * ```
 */
export declare function generateSeasonalTrendForecast(history: DemandHistory, periods: number, seasonalPeriod: number): ForecastResult;
/**
 * 29. Generates adaptive forecast that adjusts to recent changes.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} periods - Number of periods to forecast
 * @param {number} adaptationRate - How quickly to adapt (0-1)
 * @returns {ForecastResult} Adaptive forecast
 *
 * @example
 * ```typescript
 * const forecast = generateAdaptiveForecast(history, 12, 0.4);
 * ```
 */
export declare function generateAdaptiveForecast(history: DemandHistory, periods: number, adaptationRate?: number): ForecastResult;
/**
 * 30. Generates zero-inflated forecast for intermittent demand.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} periods - Number of periods to forecast
 * @returns {ForecastResult} Zero-inflated forecast
 *
 * @example
 * ```typescript
 * const forecast = generateIntermittentDemandForecast(history, 12);
 * ```
 */
export declare function generateIntermittentDemandForecast(history: DemandHistory, periods: number): ForecastResult;
/**
 * 31. Generates constraint-based forecast (min/max limits).
 *
 * @param {ForecastResult} forecast - Base forecast
 * @param {object} constraints - Min/max constraints
 * @returns {ForecastResult} Constrained forecast
 *
 * @example
 * ```typescript
 * const constrained = applyForecastConstraints(baseForecast, {
 *   minDemand: 100,
 *   maxDemand: 1000,
 *   minGrowthRate: -0.2,
 *   maxGrowthRate: 0.5
 * });
 * ```
 */
export declare function applyForecastConstraints(forecast: ForecastResult, constraints: {
    minDemand?: number;
    maxDemand?: number;
    minGrowthRate?: number;
    maxGrowthRate?: number;
}): ForecastResult;
/**
 * 32. Generates hierarchical forecast (product family to SKU level).
 *
 * @param {DemandHistory[]} familyHistories - Product family histories
 * @param {Record<string, number>} proportions - SKU proportions within family
 * @param {number} periods - Number of periods to forecast
 * @returns {Record<string, ForecastResult>} SKU-level forecasts
 *
 * @example
 * ```typescript
 * const skuForecasts = generateHierarchicalForecast(
 *   [familyHistory],
 *   { 'SKU-001': 0.4, 'SKU-002': 0.6 },
 *   12
 * );
 * ```
 */
export declare function generateHierarchicalForecast(familyHistories: DemandHistory[], proportions: Record<string, number>, periods: number): Record<string, ForecastResult>;
/**
 * 33. Generates probabilistic forecast with multiple scenarios.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} periods - Number of periods to forecast
 * @returns {object} Probabilistic forecast with scenarios
 *
 * @example
 * ```typescript
 * const scenarios = generateProbabilisticForecast(history, 12);
 * console.log('Optimistic:', scenarios.optimistic);
 * console.log('Most likely:', scenarios.mostLikely);
 * console.log('Pessimistic:', scenarios.pessimistic);
 * ```
 */
export declare function generateProbabilisticForecast(history: DemandHistory, periods: number): {
    optimistic: ForecastResult;
    mostLikely: ForecastResult;
    pessimistic: ForecastResult;
};
/**
 * 34. Generates long-term strategic forecast.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} years - Number of years to forecast
 * @returns {ForecastResult} Long-term forecast
 *
 * @example
 * ```typescript
 * const longTerm = generateLongTermForecast(history, 3);
 * ```
 */
export declare function generateLongTermForecast(history: DemandHistory, years: number): ForecastResult;
/**
 * 35. Generates forecast for new product with no history.
 *
 * @param {DemandHistory[]} similarProductHistories - Histories of similar products
 * @param {number} periods - Number of periods to forecast
 * @param {number} scaleFactor - Scale factor for new product
 * @returns {ForecastResult} New product forecast
 *
 * @example
 * ```typescript
 * const newProductForecast = generateNewProductForecast(
 *   [similarProduct1, similarProduct2],
 *   12,
 *   0.8
 * );
 * ```
 */
export declare function generateNewProductForecast(similarProductHistories: DemandHistory[], periods: number, scaleFactor?: number): ForecastResult;
/**
 * 36. Calculates forecast accuracy metrics.
 *
 * @param {ForecastResult} forecast - Forecast to evaluate
 * @param {DemandHistory} actual - Actual demand data
 * @returns {ForecastAccuracy} Accuracy metrics
 *
 * @example
 * ```typescript
 * const accuracy = calculateForecastAccuracy(forecast, actualHistory);
 * console.log('MAPE:', accuracy.mape);
 * console.log('MAD:', accuracy.mad);
 * ```
 */
export declare function calculateForecastAccuracy(forecast: ForecastResult, actual: DemandHistory): ForecastAccuracy;
/**
 * 37. Applies manual adjustment to forecast.
 *
 * @param {ForecastResult} forecast - Original forecast
 * @param {number} period - Period to adjust
 * @param {number} adjustedValue - New forecast value
 * @param {string} reason - Reason for adjustment
 * @param {string} appliedBy - User who applied adjustment
 * @returns {object} Adjusted forecast and adjustment record
 *
 * @example
 * ```typescript
 * const { adjusted, adjustment } = applyForecastAdjustment(
 *   forecast,
 *   5,
 *   1200,
 *   'Promotional campaign',
 *   'user-123'
 * );
 * ```
 */
export declare function applyForecastAdjustment(forecast: ForecastResult, period: number, adjustedValue: number, reason: string, appliedBy: string): {
    adjusted: ForecastResult;
    adjustment: ForecastAdjustment;
};
/**
 * 38. Calculates forecast bias and drift.
 *
 * @param {ForecastResult[]} historicalForecasts - Past forecasts
 * @param {DemandHistory} actual - Actual demand data
 * @returns {object} Bias analysis
 *
 * @example
 * ```typescript
 * const bias = calculateForecastBias(pastForecasts, actualHistory);
 * console.log('Systematic bias:', bias.systematicBias);
 * ```
 */
export declare function calculateForecastBias(historicalForecasts: ForecastResult[], actual: DemandHistory): {
    systematicBias: number;
    biasDirection: 'OVER_FORECAST' | 'UNDER_FORECAST' | 'NEUTRAL';
    biasStrength: number;
    forecastDrift: number;
};
/**
 * 39. Detects demand signals and anomalies.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {ForecastResult} forecast - Current forecast
 * @returns {DemandSignalResult[]} Detected demand signals
 *
 * @example
 * ```typescript
 * const signals = detectDemandSignals(history, forecast);
 * const criticalSignals = signals.filter(s => s.severity === 'HIGH');
 * ```
 */
export declare function detectDemandSignals(history: DemandHistory, forecast: ForecastResult): DemandSignalResult[];
/**
 * 40. Calculates safety stock levels.
 *
 * @param {DemandHistory} history - Historical demand data
 * @param {number} leadTime - Lead time in periods
 * @param {number} serviceLevel - Target service level (0-1)
 * @returns {SafetyStockCalculation} Safety stock calculation
 *
 * @example
 * ```typescript
 * const safetyStock = calculateSafetyStock(history, 3, 0.95);
 * console.log('Safety stock:', safetyStock.safetyStock);
 * console.log('Reorder point:', safetyStock.reorderPoint);
 * ```
 */
export declare function calculateSafetyStock(history: DemandHistory, leadTime: number, serviceLevel?: number): SafetyStockCalculation;
/**
 * 41. Performs ABC classification of products.
 *
 * @param {Array<{productId: string, annualDemand: number, unitCost: number}>} products - Products to classify
 * @returns {ABCAnalysisResult[]} ABC classification results
 *
 * @example
 * ```typescript
 * const classification = performABCClassification(products);
 * const aItems = classification.filter(c => c.classification === ABCClassification.A);
 * ```
 */
export declare function performABCClassification(products: Array<{
    productId: string;
    annualDemand: number;
    unitCost: number;
}>): ABCAnalysisResult[];
/**
 * 42. Recommends forecast review actions based on accuracy.
 *
 * @param {ForecastAccuracy} accuracy - Forecast accuracy metrics
 * @returns {object} Recommended actions
 *
 * @example
 * ```typescript
 * const recommendations = recommendForecastActions(accuracy);
 * console.log('Actions:', recommendations.actions);
 * ```
 */
export declare function recommendForecastActions(accuracy: ForecastAccuracy): {
    overallStatus: 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'POOR' | 'CRITICAL';
    actions: string[];
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
};
/**
 * 43. Generates forecast accuracy report.
 *
 * @param {ForecastResult[]} forecasts - Historical forecasts
 * @param {DemandHistory} actual - Actual demand data
 * @returns {object} Comprehensive accuracy report
 *
 * @example
 * ```typescript
 * const report = generateAccuracyReport(historicalForecasts, actualDemand);
 * ```
 */
export declare function generateAccuracyReport(forecasts: ForecastResult[], actual: DemandHistory): {
    summary: {
        totalForecasts: number;
        averageMAPE: number;
        averageMAD: number;
        bestMethod: ForecastMethod;
        worstMethod: ForecastMethod;
    };
    byMethod: Record<ForecastMethod, ForecastAccuracy>;
    recommendations: string[];
};
/**
 * 44. Exports forecast to various formats.
 *
 * @param {ForecastResult} forecast - Forecast to export
 * @param {string} format - Export format
 * @returns {string | object} Exported forecast
 *
 * @example
 * ```typescript
 * const csv = exportForecast(forecast, 'CSV');
 * const json = exportForecast(forecast, 'JSON');
 * ```
 */
export declare function exportForecast(forecast: ForecastResult, format: 'CSV' | 'JSON' | 'XML'): string | object;
declare const _default: {
    createDemandHistory: typeof createDemandHistory;
    validateDemandData: typeof validateDemandData;
    cleanDemandData: typeof cleanDemandData;
    normalizeDemandData: typeof normalizeDemandData;
    aggregateDemandData: typeof aggregateDemandData;
    splitDemandData: typeof splitDemandData;
    fillMissingDemandValues: typeof fillMissingDemandValues;
    calculateStatisticalSummary: typeof calculateStatisticalSummary;
    detectOutliers: typeof detectOutliers;
    forecastSimpleMovingAverage: typeof forecastSimpleMovingAverage;
    forecastWeightedMovingAverage: typeof forecastWeightedMovingAverage;
    forecastExponentialSmoothing: typeof forecastExponentialSmoothing;
    forecastDoubleExponentialSmoothing: typeof forecastDoubleExponentialSmoothing;
    forecastLinearRegression: typeof forecastLinearRegression;
    selectBestForecastMethod: typeof selectBestForecastMethod;
    createEnsembleForecast: typeof createEnsembleForecast;
    optimizeForecastParameters: typeof optimizeForecastParameters;
    analyzeTrend: typeof analyzeTrend;
    detectSeasonality: typeof detectSeasonality;
    decomposeTimeSeries: typeof decomposeTimeSeries;
    calculateSeasonalIndices: typeof calculateSeasonalIndices;
    calculateAutocorrelation: typeof calculateAutocorrelation;
    identifyCyclicalPatterns: typeof identifyCyclicalPatterns;
    removeSeasonality: typeof removeSeasonality;
    applySeasonalAdjustment: typeof applySeasonalAdjustment;
    detectStructuralBreaks: typeof detectStructuralBreaks;
    generateForecastWithConfidence: typeof generateForecastWithConfidence;
    generateSeasonalTrendForecast: typeof generateSeasonalTrendForecast;
    generateAdaptiveForecast: typeof generateAdaptiveForecast;
    generateIntermittentDemandForecast: typeof generateIntermittentDemandForecast;
    applyForecastConstraints: typeof applyForecastConstraints;
    generateHierarchicalForecast: typeof generateHierarchicalForecast;
    generateProbabilisticForecast: typeof generateProbabilisticForecast;
    generateLongTermForecast: typeof generateLongTermForecast;
    generateNewProductForecast: typeof generateNewProductForecast;
    calculateForecastAccuracy: typeof calculateForecastAccuracy;
    applyForecastAdjustment: typeof applyForecastAdjustment;
    calculateForecastBias: typeof calculateForecastBias;
    detectDemandSignals: typeof detectDemandSignals;
    calculateSafetyStock: typeof calculateSafetyStock;
    performABCClassification: typeof performABCClassification;
    recommendForecastActions: typeof recommendForecastActions;
    generateAccuracyReport: typeof generateAccuracyReport;
    exportForecast: typeof exportForecast;
};
export default _default;
//# sourceMappingURL=demand-forecasting-kit.d.ts.map