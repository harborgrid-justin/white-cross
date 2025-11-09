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
 * File: /reuse/logistics/demand-forecasting-kit.ts
 * Locator: WC-LOGISTICS-FCST-001
 * Purpose: Advanced Demand Forecasting & Prediction - Enterprise-grade forecasting algorithms for supply chain optimization
 *
 * Upstream: Independent utility module for demand planning and forecasting operations
 * Downstream: ../backend/logistics/*, Inventory services, Supply chain modules, Planning systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common
 * Exports: 44 utility functions for demand forecasting, trend analysis, seasonality detection, accuracy measurement
 *
 * LLM Context: Production-ready demand forecasting toolkit to compete with Oracle JDE Demand Planning.
 * Provides comprehensive statistical forecasting methods, machine learning-ready data preparation,
 * seasonality decomposition, trend analysis, multiple forecasting algorithms (Moving Average, Exponential Smoothing,
 * ARIMA-style, Linear Regression), accuracy metrics (MAPE, MAD, MSE), safety stock calculations,
 * ABC classification, demand signal detection, and forecast adjustment mechanisms.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Forecast method enumeration
 */
export enum ForecastMethod {
  SIMPLE_MOVING_AVERAGE = 'SIMPLE_MOVING_AVERAGE',
  WEIGHTED_MOVING_AVERAGE = 'WEIGHTED_MOVING_AVERAGE',
  EXPONENTIAL_SMOOTHING = 'EXPONENTIAL_SMOOTHING',
  DOUBLE_EXPONENTIAL_SMOOTHING = 'DOUBLE_EXPONENTIAL_SMOOTHING',
  TRIPLE_EXPONENTIAL_SMOOTHING = 'TRIPLE_EXPONENTIAL_SMOOTHING',
  LINEAR_REGRESSION = 'LINEAR_REGRESSION',
  SEASONAL_DECOMPOSITION = 'SEASONAL_DECOMPOSITION',
  ARIMA = 'ARIMA',
  ENSEMBLE = 'ENSEMBLE',
}

/**
 * Seasonality pattern type
 */
export enum SeasonalityPattern {
  NONE = 'NONE',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
}

/**
 * Trend direction
 */
export enum TrendDirection {
  INCREASING = 'INCREASING',
  DECREASING = 'DECREASING',
  STABLE = 'STABLE',
  VOLATILE = 'VOLATILE',
}

/**
 * ABC classification
 */
export enum ABCClassification {
  A = 'A', // High value items (70-80% of value, 10-20% of items)
  B = 'B', // Medium value items (15-25% of value, 30% of items)
  C = 'C', // Low value items (5% of value, 50% of items)
}

/**
 * Demand signal type
 */
export enum DemandSignal {
  SPIKE = 'SPIKE',           // Sudden increase
  DROP = 'DROP',             // Sudden decrease
  TREND_CHANGE = 'TREND_CHANGE',
  SEASONALITY_SHIFT = 'SEASONALITY_SHIFT',
  OUTLIER = 'OUTLIER',
  NORMAL = 'NORMAL',
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
  alpha?: number; // Smoothing parameter for exponential smoothing
  beta?: number;  // Trend smoothing parameter
  gamma?: number; // Seasonal smoothing parameter
  seasonalityPeriod?: number;
  confidenceLevel?: number; // 0-1 (e.g., 0.95 for 95% confidence)
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
  mape: number; // Mean Absolute Percentage Error
  mad: number;  // Mean Absolute Deviation
  mse: number;  // Mean Squared Error
  rmse: number; // Root Mean Squared Error
  bias: number; // Forecast bias
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
  strength: number; // 0-1, strength of seasonality
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
  strength: number; // 0-1, R-squared value
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
  coefficient: number; // Coefficient of variation
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
  weights?: number[]; // Optional weights for each method
  combineStrategy: 'AVERAGE' | 'WEIGHTED_AVERAGE' | 'MEDIAN' | 'BEST_PERFORMER';
}

// ============================================================================
// SECTION 1: DATA COLLECTION & PREPARATION (Functions 1-9)
// ============================================================================

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
export function createDemandHistory(
  productId: string,
  dataPoints: DemandDataPoint[],
  locationId?: string
): DemandHistory {
  if (dataPoints.length === 0) {
    throw new Error('Cannot create demand history from empty dataset');
  }

  // Sort by date
  const sorted = [...dataPoints].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate average
  const totalDemand = sorted.reduce((sum, dp) => sum + dp.actualDemand, 0);
  const averageDemand = totalDemand / sorted.length;

  return {
    productId,
    locationId,
    dataPoints: sorted,
    startDate: sorted[0].date,
    endDate: sorted[sorted.length - 1].date,
    totalPeriods: sorted.length,
    averageDemand,
  };
}

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
export function validateDemandData(history: DemandHistory): {
  valid: boolean;
  issues: string[];
  warnings: string[];
  dataQuality: number; // 0-1 score
} {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check minimum data points
  if (history.totalPeriods < 3) {
    issues.push('Insufficient data points (minimum 3 required)');
  }

  // Check for negative demand
  const negativeValues = history.dataPoints.filter(dp => dp.actualDemand < 0);
  if (negativeValues.length > 0) {
    issues.push(`Found ${negativeValues.length} negative demand values`);
  }

  // Check for missing periods
  const expectedPeriods = history.totalPeriods;
  const actualPeriods = new Set(history.dataPoints.map(dp => dp.period)).size;
  if (actualPeriods < expectedPeriods) {
    warnings.push('Missing periods detected in data sequence');
  }

  // Check for zero demand periods
  const zeroDemand = history.dataPoints.filter(dp => dp.actualDemand === 0);
  if (zeroDemand.length > history.totalPeriods * 0.5) {
    warnings.push('More than 50% of periods have zero demand');
  }

  // Calculate data quality score
  let qualityScore = 1.0;
  qualityScore -= issues.length * 0.2;
  qualityScore -= warnings.length * 0.1;
  qualityScore = Math.max(0, Math.min(1, qualityScore));

  return {
    valid: issues.length === 0,
    issues,
    warnings,
    dataQuality: qualityScore,
  };
}

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
export function cleanDemandData(
  history: DemandHistory,
  options: {
    removeOutliers?: boolean;
    outlierThreshold?: number;
    fillMissing?: boolean;
    fillMethod?: 'ZERO' | 'AVERAGE' | 'INTERPOLATE' | 'FORWARD_FILL';
  } = {}
): DemandHistory {
  const {
    removeOutliers = true,
    outlierThreshold = 3.0,
    fillMissing = true,
    fillMethod = 'INTERPOLATE',
  } = options;

  let cleanedPoints = [...history.dataPoints];

  // Remove outliers if requested
  if (removeOutliers) {
    const outliers = detectOutliers(history.dataPoints, outlierThreshold);
    const outlierPeriods = new Set(outliers.filter(o => o.isOutlier).map(o => o.period));

    cleanedPoints = cleanedPoints.map(dp => {
      if (outlierPeriods.has(dp.period)) {
        // Replace outlier with interpolated value
        return {
          ...dp,
          actualDemand: history.averageDemand,
          metadata: { ...dp.metadata, outlierReplaced: true },
        };
      }
      return dp;
    });
  }

  // Fill missing values if requested
  if (fillMissing) {
    cleanedPoints = fillMissingDemandValues(cleanedPoints, fillMethod);
  }

  return createDemandHistory(history.productId, cleanedPoints, history.locationId);
}

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
export function normalizeDemandData(
  history: DemandHistory,
  options: { method: 'MIN_MAX' | 'Z_SCORE' | 'DECIMAL_SCALING' } = { method: 'MIN_MAX' }
): {
  normalized: DemandHistory;
  scaler: {
    method: string;
    min?: number;
    max?: number;
    mean?: number;
    stdDev?: number;
    scale?: number;
  };
} {
  const values = history.dataPoints.map(dp => dp.actualDemand);
  const stats = calculateStatisticalSummary(values);

  let normalizedPoints: DemandDataPoint[];
  let scaler: any = { method: options.method };

  switch (options.method) {
    case 'MIN_MAX':
      scaler.min = stats.min;
      scaler.max = stats.max;
      const range = stats.max - stats.min;
      normalizedPoints = history.dataPoints.map(dp => ({
        ...dp,
        actualDemand: range === 0 ? 0 : (dp.actualDemand - stats.min) / range,
      }));
      break;

    case 'Z_SCORE':
      scaler.mean = stats.mean;
      scaler.stdDev = stats.stdDev;
      normalizedPoints = history.dataPoints.map(dp => ({
        ...dp,
        actualDemand: stats.stdDev === 0 ? 0 : (dp.actualDemand - stats.mean) / stats.stdDev,
      }));
      break;

    case 'DECIMAL_SCALING':
      const maxAbs = Math.max(...values.map(v => Math.abs(v)));
      const scale = Math.pow(10, Math.ceil(Math.log10(maxAbs)));
      scaler.scale = scale;
      normalizedPoints = history.dataPoints.map(dp => ({
        ...dp,
        actualDemand: dp.actualDemand / scale,
      }));
      break;

    default:
      normalizedPoints = history.dataPoints;
  }

  return {
    normalized: createDemandHistory(history.productId, normalizedPoints, history.locationId),
    scaler,
  };
}

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
export function aggregateDemandData(
  history: DemandHistory,
  aggregationLevel: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
): DemandHistory {
  const aggregated = new Map<string, { sum: number; count: number; dates: Date[] }>();

  for (const dp of history.dataPoints) {
    const key = getAggregationKey(dp.date, aggregationLevel);

    if (!aggregated.has(key)) {
      aggregated.set(key, { sum: 0, count: 0, dates: [] });
    }

    const bucket = aggregated.get(key)!;
    bucket.sum += dp.actualDemand;
    bucket.count++;
    bucket.dates.push(dp.date);
  }

  const aggregatedPoints: DemandDataPoint[] = Array.from(aggregated.entries()).map(
    ([key, bucket], index) => ({
      date: bucket.dates[0],
      period: index + 1,
      actualDemand: bucket.sum,
      productId: history.productId,
      locationId: history.locationId,
      metadata: {
        aggregatedFrom: bucket.count,
        aggregationLevel,
      },
    })
  );

  return createDemandHistory(history.productId, aggregatedPoints, history.locationId);
}

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
export function splitDemandData(
  history: DemandHistory,
  trainingRatio: number = 0.8
): {
  training: DemandHistory;
  testing: DemandHistory;
} {
  if (trainingRatio <= 0 || trainingRatio >= 1) {
    throw new Error('Training ratio must be between 0 and 1');
  }

  const splitIndex = Math.floor(history.totalPeriods * trainingRatio);
  const trainingPoints = history.dataPoints.slice(0, splitIndex);
  const testingPoints = history.dataPoints.slice(splitIndex);

  return {
    training: createDemandHistory(history.productId, trainingPoints, history.locationId),
    testing: createDemandHistory(history.productId, testingPoints, history.locationId),
  };
}

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
export function fillMissingDemandValues(
  dataPoints: DemandDataPoint[],
  fillMethod: 'ZERO' | 'AVERAGE' | 'INTERPOLATE' | 'FORWARD_FILL' = 'INTERPOLATE'
): DemandDataPoint[] {
  if (dataPoints.length === 0) return dataPoints;

  const sorted = [...dataPoints].sort((a, b) => a.period - b.period);
  const average = sorted.reduce((sum, dp) => sum + dp.actualDemand, 0) / sorted.length;

  // Create complete sequence
  const minPeriod = sorted[0].period;
  const maxPeriod = sorted[sorted.length - 1].period;
  const existingPeriods = new Map(sorted.map(dp => [dp.period, dp]));

  const complete: DemandDataPoint[] = [];

  for (let period = minPeriod; period <= maxPeriod; period++) {
    if (existingPeriods.has(period)) {
      complete.push(existingPeriods.get(period)!);
    } else {
      // Missing value - fill based on method
      let filledValue = 0;

      switch (fillMethod) {
        case 'ZERO':
          filledValue = 0;
          break;
        case 'AVERAGE':
          filledValue = average;
          break;
        case 'INTERPOLATE':
          filledValue = interpolateValue(complete, period, sorted);
          break;
        case 'FORWARD_FILL':
          filledValue = complete.length > 0 ? complete[complete.length - 1].actualDemand : 0;
          break;
      }

      complete.push({
        date: estimateDate(sorted, period),
        period,
        actualDemand: filledValue,
        productId: sorted[0].productId,
        locationId: sorted[0].locationId,
        metadata: { filled: true, fillMethod },
      });
    }
  }

  return complete;
}

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
export function calculateStatisticalSummary(values: number[]): StatisticalSummary {
  if (values.length === 0) {
    throw new Error('Cannot calculate statistics for empty dataset');
  }

  const sorted = [...values].sort((a, b) => a - b);
  const n = values.length;

  // Mean
  const mean = values.reduce((sum, v) => sum + v, 0) / n;

  // Median
  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)];

  // Mode (most frequent value)
  const frequency = new Map<number, number>();
  values.forEach(v => frequency.set(v, (frequency.get(v) || 0) + 1));
  const mode = Array.from(frequency.entries()).reduce((a, b) => b[1] > a[1] ? b : a)[0];

  // Variance and Standard Deviation
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Range
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  // Coefficient of Variation
  const coefficient = mean === 0 ? 0 : stdDev / mean;

  // Skewness
  const skewness = values.reduce((sum, v) => sum + Math.pow(v - mean, 3), 0) / (n * Math.pow(stdDev, 3));

  // Kurtosis
  const kurtosis = values.reduce((sum, v) => sum + Math.pow(v - mean, 4), 0) / (n * Math.pow(stdDev, 4)) - 3;

  return {
    mean,
    median,
    mode,
    stdDev,
    variance,
    min,
    max,
    range,
    coefficient,
    skewness,
    kurtosis,
  };
}

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
export function detectOutliers(
  dataPoints: DemandDataPoint[],
  threshold: number = 3.0
): OutlierDetection[] {
  const values = dataPoints.map(dp => dp.actualDemand);
  const stats = calculateStatisticalSummary(values);

  return dataPoints.map(dp => {
    const zScore = stats.stdDev === 0 ? 0 : Math.abs(dp.actualDemand - stats.mean) / stats.stdDev;
    const isOutlier = zScore > threshold;

    let severity: 'MILD' | 'MODERATE' | 'EXTREME' = 'MILD';
    if (zScore > threshold * 2) severity = 'EXTREME';
    else if (zScore > threshold * 1.5) severity = 'MODERATE';

    return {
      period: dp.period,
      date: dp.date,
      value: dp.actualDemand,
      expectedValue: stats.mean,
      zScore,
      isOutlier,
      severity,
    };
  });
}

// ============================================================================
// SECTION 2: FORECAST MODEL SELECTION (Functions 10-17)
// ============================================================================

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
export function forecastSimpleMovingAverage(
  history: DemandHistory,
  periods: number,
  windowSize: number = 3
): ForecastResult {
  if (windowSize > history.totalPeriods) {
    throw new Error('Window size cannot exceed available data points');
  }

  const recentData = history.dataPoints.slice(-windowSize);
  const average = recentData.reduce((sum, dp) => sum + dp.actualDemand, 0) / windowSize;

  const forecastPeriods: ForecastPeriod[] = [];
  const lastDate = history.dataPoints[history.dataPoints.length - 1].date;

  for (let i = 1; i <= periods; i++) {
    forecastPeriods.push({
      period: history.totalPeriods + i,
      date: addPeriods(lastDate, i),
      forecastedDemand: average,
      baselineComponent: average,
    });
  }

  return {
    forecastId: generateForecastId(),
    productId: history.productId,
    locationId: history.locationId,
    method: ForecastMethod.SIMPLE_MOVING_AVERAGE,
    generatedAt: new Date(),
    forecastPeriods,
  };
}

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
export function forecastWeightedMovingAverage(
  history: DemandHistory,
  periods: number,
  weights: number[] = [0.5, 0.3, 0.2]
): ForecastResult {
  // Normalize weights to sum to 1
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const normalizedWeights = weights.map(w => w / totalWeight);

  const recentData = history.dataPoints.slice(-weights.length);
  const weightedAverage = recentData.reduce(
    (sum, dp, index) => sum + dp.actualDemand * normalizedWeights[weights.length - 1 - index],
    0
  );

  const forecastPeriods: ForecastPeriod[] = [];
  const lastDate = history.dataPoints[history.dataPoints.length - 1].date;

  for (let i = 1; i <= periods; i++) {
    forecastPeriods.push({
      period: history.totalPeriods + i,
      date: addPeriods(lastDate, i),
      forecastedDemand: weightedAverage,
      baselineComponent: weightedAverage,
    });
  }

  return {
    forecastId: generateForecastId(),
    productId: history.productId,
    locationId: history.locationId,
    method: ForecastMethod.WEIGHTED_MOVING_AVERAGE,
    generatedAt: new Date(),
    forecastPeriods,
  };
}

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
export function forecastExponentialSmoothing(
  history: DemandHistory,
  periods: number,
  alpha: number = 0.3
): ForecastResult {
  if (alpha <= 0 || alpha >= 1) {
    throw new Error('Alpha must be between 0 and 1');
  }

  // Initialize with first actual value
  let smoothedValue = history.dataPoints[0].actualDemand;

  // Smooth historical data
  for (let i = 1; i < history.dataPoints.length; i++) {
    smoothedValue = alpha * history.dataPoints[i].actualDemand + (1 - alpha) * smoothedValue;
  }

  const forecastPeriods: ForecastPeriod[] = [];
  const lastDate = history.dataPoints[history.dataPoints.length - 1].date;

  for (let i = 1; i <= periods; i++) {
    forecastPeriods.push({
      period: history.totalPeriods + i,
      date: addPeriods(lastDate, i),
      forecastedDemand: smoothedValue,
      baselineComponent: smoothedValue,
    });
  }

  return {
    forecastId: generateForecastId(),
    productId: history.productId,
    locationId: history.locationId,
    method: ForecastMethod.EXPONENTIAL_SMOOTHING,
    generatedAt: new Date(),
    forecastPeriods,
  };
}

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
export function forecastDoubleExponentialSmoothing(
  history: DemandHistory,
  periods: number,
  alpha: number = 0.3,
  beta: number = 0.1
): ForecastResult {
  if (alpha <= 0 || alpha >= 1 || beta <= 0 || beta >= 1) {
    throw new Error('Alpha and beta must be between 0 and 1');
  }

  const data = history.dataPoints.map(dp => dp.actualDemand);

  // Initialize level and trend
  let level = data[0];
  let trend = data.length > 1 ? data[1] - data[0] : 0;

  // Smooth historical data
  for (let i = 1; i < data.length; i++) {
    const prevLevel = level;
    level = alpha * data[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
  }

  const forecastPeriods: ForecastPeriod[] = [];
  const lastDate = history.dataPoints[history.dataPoints.length - 1].date;

  for (let i = 1; i <= periods; i++) {
    const forecast = level + i * trend;
    forecastPeriods.push({
      period: history.totalPeriods + i,
      date: addPeriods(lastDate, i),
      forecastedDemand: Math.max(0, forecast),
      baselineComponent: level,
      trendComponent: i * trend,
    });
  }

  return {
    forecastId: generateForecastId(),
    productId: history.productId,
    locationId: history.locationId,
    method: ForecastMethod.DOUBLE_EXPONENTIAL_SMOOTHING,
    generatedAt: new Date(),
    forecastPeriods,
  };
}

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
export function forecastLinearRegression(
  history: DemandHistory,
  periods: number
): ForecastResult {
  const n = history.dataPoints.length;
  const xValues = history.dataPoints.map(dp => dp.period);
  const yValues = history.dataPoints.map(dp => dp.actualDemand);

  // Calculate linear regression coefficients
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
    denominator += Math.pow(xValues[i] - xMean, 2);
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;

  const forecastPeriods: ForecastPeriod[] = [];
  const lastDate = history.dataPoints[history.dataPoints.length - 1].date;

  for (let i = 1; i <= periods; i++) {
    const period = history.totalPeriods + i;
    const forecast = slope * period + intercept;

    forecastPeriods.push({
      period,
      date: addPeriods(lastDate, i),
      forecastedDemand: Math.max(0, forecast),
      trendComponent: slope * period,
      baselineComponent: intercept,
    });
  }

  return {
    forecastId: generateForecastId(),
    productId: history.productId,
    locationId: history.locationId,
    method: ForecastMethod.LINEAR_REGRESSION,
    generatedAt: new Date(),
    forecastPeriods,
  };
}

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
export function selectBestForecastMethod(
  history: DemandHistory,
  methods: ForecastMethod[] = [
    ForecastMethod.SIMPLE_MOVING_AVERAGE,
    ForecastMethod.EXPONENTIAL_SMOOTHING,
    ForecastMethod.LINEAR_REGRESSION,
  ]
): {
  bestMethod: ForecastMethod;
  accuracyComparison: Array<{ method: ForecastMethod; mape: number; mad: number }>;
} {
  const { training, testing } = splitDemandData(history, 0.8);
  const accuracyComparison: Array<{ method: ForecastMethod; mape: number; mad: number }> = [];

  for (const method of methods) {
    let forecast: ForecastResult;

    switch (method) {
      case ForecastMethod.SIMPLE_MOVING_AVERAGE:
        forecast = forecastSimpleMovingAverage(training, testing.totalPeriods, 3);
        break;
      case ForecastMethod.EXPONENTIAL_SMOOTHING:
        forecast = forecastExponentialSmoothing(training, testing.totalPeriods, 0.3);
        break;
      case ForecastMethod.LINEAR_REGRESSION:
        forecast = forecastLinearRegression(training, testing.totalPeriods);
        break;
      default:
        continue;
    }

    const accuracy = calculateForecastAccuracy(forecast, testing);
    accuracyComparison.push({
      method,
      mape: accuracy.mape,
      mad: accuracy.mad,
    });
  }

  // Select method with lowest MAPE
  accuracyComparison.sort((a, b) => a.mape - b.mape);

  return {
    bestMethod: accuracyComparison[0].method,
    accuracyComparison,
  };
}

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
export function createEnsembleForecast(
  history: DemandHistory,
  periods: number,
  config: EnsembleForecastConfig
): ForecastResult {
  const forecasts: ForecastResult[] = [];

  // Generate forecasts for each method
  for (const method of config.methods) {
    let forecast: ForecastResult;

    switch (method) {
      case ForecastMethod.SIMPLE_MOVING_AVERAGE:
        forecast = forecastSimpleMovingAverage(history, periods);
        break;
      case ForecastMethod.EXPONENTIAL_SMOOTHING:
        forecast = forecastExponentialSmoothing(history, periods);
        break;
      case ForecastMethod.LINEAR_REGRESSION:
        forecast = forecastLinearRegression(history, periods);
        break;
      case ForecastMethod.DOUBLE_EXPONENTIAL_SMOOTHING:
        forecast = forecastDoubleExponentialSmoothing(history, periods);
        break;
      default:
        continue;
    }

    forecasts.push(forecast);
  }

  // Combine forecasts
  const combinedPeriods: ForecastPeriod[] = [];

  for (let i = 0; i < periods; i++) {
    const periodForecasts = forecasts.map(f => f.forecastPeriods[i].forecastedDemand);
    let combinedForecast = 0;

    switch (config.combineStrategy) {
      case 'AVERAGE':
        combinedForecast = periodForecasts.reduce((sum, f) => sum + f, 0) / periodForecasts.length;
        break;
      case 'WEIGHTED_AVERAGE':
        const weights = config.weights || Array(forecasts.length).fill(1 / forecasts.length);
        combinedForecast = periodForecasts.reduce((sum, f, idx) => sum + f * weights[idx], 0);
        break;
      case 'MEDIAN':
        combinedForecast = periodForecasts.sort((a, b) => a - b)[Math.floor(periodForecasts.length / 2)];
        break;
    }

    combinedPeriods.push({
      period: history.totalPeriods + i + 1,
      date: forecasts[0].forecastPeriods[i].date,
      forecastedDemand: combinedForecast,
    });
  }

  return {
    forecastId: generateForecastId(),
    productId: history.productId,
    locationId: history.locationId,
    method: ForecastMethod.ENSEMBLE,
    generatedAt: new Date(),
    forecastPeriods: combinedPeriods,
    metadata: {
      methods: config.methods,
      combineStrategy: config.combineStrategy,
    },
  };
}

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
export function optimizeForecastParameters(
  history: DemandHistory,
  method: ForecastMethod,
  parameterRanges: Record<string, number[]>
): {
  optimalParameters: Record<string, number>;
  accuracy: ForecastAccuracy;
} {
  const { training, testing } = splitDemandData(history, 0.8);
  let bestAccuracy: ForecastAccuracy | null = null;
  let bestParameters: Record<string, number> = {};

  // Grid search
  const parameterCombinations = generateParameterCombinations(parameterRanges);

  for (const params of parameterCombinations) {
    let forecast: ForecastResult;

    try {
      switch (method) {
        case ForecastMethod.EXPONENTIAL_SMOOTHING:
          forecast = forecastExponentialSmoothing(training, testing.totalPeriods, params.alpha);
          break;
        case ForecastMethod.DOUBLE_EXPONENTIAL_SMOOTHING:
          forecast = forecastDoubleExponentialSmoothing(
            training,
            testing.totalPeriods,
            params.alpha,
            params.beta
          );
          break;
        default:
          continue;
      }

      const accuracy = calculateForecastAccuracy(forecast, testing);

      if (!bestAccuracy || accuracy.mape < bestAccuracy.mape) {
        bestAccuracy = accuracy;
        bestParameters = params;
      }
    } catch (error) {
      // Skip invalid parameter combinations
      continue;
    }
  }

  return {
    optimalParameters: bestParameters,
    accuracy: bestAccuracy!,
  };
}

// ============================================================================
// SECTION 3: TREND & SEASONALITY ANALYSIS (Functions 18-26)
// ============================================================================

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
export function analyzeTrend(history: DemandHistory): TrendAnalysis {
  const n = history.dataPoints.length;
  const xValues = history.dataPoints.map(dp => dp.period);
  const yValues = history.dataPoints.map(dp => dp.actualDemand);

  // Calculate linear regression
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;

  let numerator = 0;
  let denominator = 0;
  let ssTot = 0;

  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
    denominator += Math.pow(xValues[i] - xMean, 2);
    ssTot += Math.pow(yValues[i] - yMean, 2);
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;

  // Calculate R-squared
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const predicted = slope * xValues[i] + intercept;
    ssRes += Math.pow(yValues[i] - predicted, 2);
  }

  const strength = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);

  // Calculate volatility (coefficient of variation)
  const stats = calculateStatisticalSummary(yValues);
  const volatility = stats.coefficient;

  // Determine direction
  let direction: TrendDirection;
  if (Math.abs(slope) < stats.stdDev * 0.1) {
    direction = TrendDirection.STABLE;
  } else if (volatility > 0.5) {
    direction = TrendDirection.VOLATILE;
  } else if (slope > 0) {
    direction = TrendDirection.INCREASING;
  } else {
    direction = TrendDirection.DECREASING;
  }

  return {
    direction,
    slope,
    strength: Math.max(0, strength),
    volatility,
    coefficient: slope,
    intercept,
  };
}

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
export function detectSeasonality(
  history: DemandHistory,
  maxPeriod: number = 12
): SeasonalityAnalysis {
  const values = history.dataPoints.map(dp => dp.actualDemand);

  let bestPeriod = 0;
  let bestStrength = 0;

  // Test different periods
  for (let period = 2; period <= Math.min(maxPeriod, Math.floor(values.length / 2)); period++) {
    const autocorr = calculateAutocorrelation(values, period);

    if (Math.abs(autocorr) > bestStrength) {
      bestStrength = Math.abs(autocorr);
      bestPeriod = period;
    }
  }

  const detected = bestStrength > 0.3; // Threshold for significance
  const seasonalIndices = detected ? calculateSeasonalIndices(values, bestPeriod) : [];

  // Determine pattern type
  let pattern = SeasonalityPattern.NONE;
  if (detected) {
    if (bestPeriod === 7) pattern = SeasonalityPattern.WEEKLY;
    else if (bestPeriod === 12) pattern = SeasonalityPattern.MONTHLY;
    else if (bestPeriod === 4) pattern = SeasonalityPattern.QUARTERLY;
    else pattern = SeasonalityPattern.CUSTOM;
  }

  // Find peak and trough periods
  const peakPeriods: number[] = [];
  const troughPeriods: number[] = [];

  if (detected && seasonalIndices.length > 0) {
    const avgIndex = seasonalIndices.reduce((sum, idx) => sum + idx, 0) / seasonalIndices.length;

    seasonalIndices.forEach((idx, period) => {
      if (idx > avgIndex * 1.1) peakPeriods.push(period);
      if (idx < avgIndex * 0.9) troughPeriods.push(period);
    });
  }

  return {
    detected,
    pattern,
    period: bestPeriod,
    strength: bestStrength,
    seasonalIndices,
    peakPeriods,
    troughPeriods,
  };
}

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
export function decomposeTimeSeries(
  history: DemandHistory,
  seasonalPeriod: number
): {
  trend: number[];
  seasonal: number[];
  residual: number[];
  deseasonalized: number[];
} {
  const values = history.dataPoints.map(dp => dp.actualDemand);
  const n = values.length;

  // Calculate trend using moving average
  const trend: number[] = [];
  const halfWindow = Math.floor(seasonalPeriod / 2);

  for (let i = 0; i < n; i++) {
    if (i < halfWindow || i >= n - halfWindow) {
      trend.push(NaN);
    } else {
      const window = values.slice(i - halfWindow, i + halfWindow + 1);
      trend.push(window.reduce((sum, v) => sum + v, 0) / window.length);
    }
  }

  // Calculate seasonal indices
  const seasonalIndices = calculateSeasonalIndices(values, seasonalPeriod);

  // Extend seasonal pattern to match data length
  const seasonal: number[] = [];
  for (let i = 0; i < n; i++) {
    seasonal.push(seasonalIndices[i % seasonalPeriod]);
  }

  // Calculate residual
  const residual: number[] = [];
  const deseasonalized: number[] = [];

  for (let i = 0; i < n; i++) {
    deseasonalized.push(values[i] / seasonal[i]);

    if (!isNaN(trend[i])) {
      residual.push(values[i] - trend[i] - (seasonal[i] - 1) * trend[i]);
    } else {
      residual.push(NaN);
    }
  }

  return {
    trend,
    seasonal,
    residual,
    deseasonalized,
  };
}

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
export function calculateSeasonalIndices(
  values: number[],
  seasonalPeriod: number
): number[] {
  const seasonalSums: number[] = Array(seasonalPeriod).fill(0);
  const seasonalCounts: number[] = Array(seasonalPeriod).fill(0);

  // Calculate average for each seasonal position
  for (let i = 0; i < values.length; i++) {
    const seasonIndex = i % seasonalPeriod;
    seasonalSums[seasonIndex] += values[i];
    seasonalCounts[seasonIndex]++;
  }

  const seasonalAverages = seasonalSums.map((sum, idx) =>
    seasonalCounts[idx] > 0 ? sum / seasonalCounts[idx] : 0
  );

  // Calculate overall average
  const overallAverage = seasonalAverages.reduce((sum, avg) => sum + avg, 0) / seasonalPeriod;

  // Normalize to get indices (centered around 1.0)
  return seasonalAverages.map(avg => overallAverage === 0 ? 1 : avg / overallAverage);
}

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
export function calculateAutocorrelation(values: number[], lag: number): number {
  if (lag >= values.length) {
    throw new Error('Lag must be less than data length');
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

  return denominator === 0 ? 0 : numerator / denominator;
}

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
export function identifyCyclicalPatterns(history: DemandHistory): {
  cyclesDetected: boolean;
  cyclePeriod?: number;
  cycleStrength?: number;
  peaks: number[];
  troughs: number[];
} {
  const values = history.dataPoints.map(dp => dp.actualDemand);
  const n = values.length;

  const peaks: number[] = [];
  const troughs: number[] = [];

  // Identify local peaks and troughs
  for (let i = 1; i < n - 1; i++) {
    if (values[i] > values[i - 1] && values[i] > values[i + 1]) {
      peaks.push(i);
    }
    if (values[i] < values[i - 1] && values[i] < values[i + 1]) {
      troughs.push(i);
    }
  }

  // Estimate cycle period from peak distances
  let cyclePeriod: number | undefined;
  let cycleStrength: number | undefined;

  if (peaks.length >= 2) {
    const peakDistances = peaks.slice(1).map((peak, idx) => peak - peaks[idx]);
    cyclePeriod = Math.round(
      peakDistances.reduce((sum, d) => sum + d, 0) / peakDistances.length
    );

    // Calculate cycle strength
    const peakValues = peaks.map(i => values[i]);
    const troughValues = troughs.map(i => values[i]);
    const avgPeak = peakValues.reduce((sum, v) => sum + v, 0) / peakValues.length;
    const avgTrough = troughValues.length > 0
      ? troughValues.reduce((sum, v) => sum + v, 0) / troughValues.length
      : 0;

    const stats = calculateStatisticalSummary(values);
    cycleStrength = stats.mean === 0 ? 0 : (avgPeak - avgTrough) / stats.mean;
  }

  return {
    cyclesDetected: peaks.length >= 2 && troughs.length >= 2,
    cyclePeriod,
    cycleStrength,
    peaks,
    troughs,
  };
}

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
export function removeSeasonality(
  history: DemandHistory,
  seasonalPeriod: number
): DemandHistory {
  const values = history.dataPoints.map(dp => dp.actualDemand);
  const seasonalIndices = calculateSeasonalIndices(values, seasonalPeriod);

  const deseasonalizedPoints = history.dataPoints.map((dp, idx) => ({
    ...dp,
    actualDemand: dp.actualDemand / seasonalIndices[idx % seasonalPeriod],
    metadata: {
      ...dp.metadata,
      deseasonalized: true,
      seasonalIndex: seasonalIndices[idx % seasonalPeriod],
    },
  }));

  return createDemandHistory(history.productId, deseasonalizedPoints, history.locationId);
}

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
export function applySeasonalAdjustment(
  forecast: ForecastResult,
  seasonalIndices: number[]
): ForecastResult {
  const adjustedPeriods = forecast.forecastPeriods.map((fp, idx) => ({
    ...fp,
    forecastedDemand: fp.forecastedDemand * seasonalIndices[idx % seasonalIndices.length],
    seasonalComponent: seasonalIndices[idx % seasonalIndices.length],
  }));

  return {
    ...forecast,
    forecastPeriods: adjustedPeriods,
    metadata: {
      ...forecast.metadata,
      seasonallyAdjusted: true,
    },
  };
}

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
export function detectStructuralBreaks(history: DemandHistory): {
  breaksDetected: boolean;
  breakPoints: Array<{
    period: number;
    date: Date;
    beforeMean: number;
    afterMean: number;
    changePercent: number;
  }>;
} {
  const values = history.dataPoints.map(dp => dp.actualDemand);
  const breakPoints: Array<{
    period: number;
    date: Date;
    beforeMean: number;
    afterMean: number;
    changePercent: number;
  }> = [];

  const minSegmentSize = Math.max(5, Math.floor(values.length * 0.1));

  // Test potential break points
  for (let i = minSegmentSize; i < values.length - minSegmentSize; i++) {
    const beforeSegment = values.slice(0, i);
    const afterSegment = values.slice(i);

    const beforeMean = beforeSegment.reduce((sum, v) => sum + v, 0) / beforeSegment.length;
    const afterMean = afterSegment.reduce((sum, v) => sum + v, 0) / afterSegment.length;

    const changePercent = beforeMean === 0 ? 0 : Math.abs((afterMean - beforeMean) / beforeMean);

    // Significant change threshold (e.g., 30% change)
    if (changePercent > 0.3) {
      breakPoints.push({
        period: i,
        date: history.dataPoints[i].date,
        beforeMean,
        afterMean,
        changePercent,
      });
    }
  }

  return {
    breaksDetected: breakPoints.length > 0,
    breakPoints,
  };
}

// ============================================================================
// SECTION 4: FORECAST GENERATION (Functions 27-35)
// ============================================================================

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
export function generateForecastWithConfidence(
  history: DemandHistory,
  config: ForecastConfig
): ForecastResult {
  // Generate base forecast
  let baseForecast: ForecastResult;

  switch (config.method) {
    case ForecastMethod.SIMPLE_MOVING_AVERAGE:
      baseForecast = forecastSimpleMovingAverage(history, config.periods);
      break;
    case ForecastMethod.EXPONENTIAL_SMOOTHING:
      baseForecast = forecastExponentialSmoothing(history, config.periods, config.alpha);
      break;
    case ForecastMethod.LINEAR_REGRESSION:
      baseForecast = forecastLinearRegression(history, config.periods);
      break;
    case ForecastMethod.DOUBLE_EXPONENTIAL_SMOOTHING:
      baseForecast = forecastDoubleExponentialSmoothing(
        history,
        config.periods,
        config.alpha || 0.3,
        config.beta || 0.1
      );
      break;
    default:
      baseForecast = forecastExponentialSmoothing(history, config.periods);
  }

  // Calculate confidence intervals
  const values = history.dataPoints.map(dp => dp.actualDemand);
  const stats = calculateStatisticalSummary(values);
  const confidenceLevel = config.confidenceLevel || 0.95;
  const zScore = getZScore(confidenceLevel);

  const forecastPeriodsWithConfidence = baseForecast.forecastPeriods.map((fp, idx) => {
    const errorMultiplier = Math.sqrt(idx + 1); // Error increases with forecast horizon
    const margin = zScore * stats.stdDev * errorMultiplier;

    return {
      ...fp,
      lowerBound: Math.max(0, fp.forecastedDemand - margin),
      upperBound: fp.forecastedDemand + margin,
      confidence: confidenceLevel,
    };
  });

  return {
    ...baseForecast,
    forecastPeriods: forecastPeriodsWithConfidence,
  };
}

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
export function generateSeasonalTrendForecast(
  history: DemandHistory,
  periods: number,
  seasonalPeriod: number
): ForecastResult {
  // Decompose time series
  const decomposed = decomposeTimeSeries(history, seasonalPeriod);

  // Generate trend forecast
  const trendForecast = forecastLinearRegression(history, periods);

  // Calculate seasonal indices
  const seasonalIndices = calculateSeasonalIndices(
    history.dataPoints.map(dp => dp.actualDemand),
    seasonalPeriod
  );

  // Apply seasonal adjustment
  return applySeasonalAdjustment(trendForecast, seasonalIndices);
}

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
export function generateAdaptiveForecast(
  history: DemandHistory,
  periods: number,
  adaptationRate: number = 0.3
): ForecastResult {
  const recentPeriods = Math.min(12, Math.floor(history.totalPeriods * 0.3));
  const recentHistory = {
    ...history,
    dataPoints: history.dataPoints.slice(-recentPeriods),
    totalPeriods: recentPeriods,
  };

  // Generate forecasts from recent and full history
  const recentForecast = forecastExponentialSmoothing(
    recentHistory,
    periods,
    adaptationRate
  );
  const fullForecast = forecastExponentialSmoothing(
    history,
    periods,
    adaptationRate * 0.5
  );

  // Combine with emphasis on recent trends
  const combinedPeriods = recentForecast.forecastPeriods.map((rfp, idx) => {
    const ffp = fullForecast.forecastPeriods[idx];
    const combined = rfp.forecastedDemand * adaptationRate +
                     ffp.forecastedDemand * (1 - adaptationRate);

    return {
      ...rfp,
      forecastedDemand: combined,
    };
  });

  return {
    ...recentForecast,
    forecastPeriods: combinedPeriods,
    metadata: {
      adaptationRate,
      recentPeriods,
    },
  };
}

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
export function generateIntermittentDemandForecast(
  history: DemandHistory,
  periods: number
): ForecastResult {
  const values = history.dataPoints.map(dp => dp.actualDemand);

  // Calculate zero probability
  const zeroCount = values.filter(v => v === 0).length;
  const zeroProbability = zeroCount / values.length;

  // Calculate average non-zero demand
  const nonZeroValues = values.filter(v => v > 0);
  const avgNonZeroDemand = nonZeroValues.length > 0
    ? nonZeroValues.reduce((sum, v) => sum + v, 0) / nonZeroValues.length
    : 0;

  // Generate forecast
  const forecastPeriods: ForecastPeriod[] = [];
  const lastDate = history.dataPoints[history.dataPoints.length - 1].date;

  for (let i = 1; i <= periods; i++) {
    // Expected demand = (1 - P(zero)) * average non-zero demand
    const expectedDemand = (1 - zeroProbability) * avgNonZeroDemand;

    forecastPeriods.push({
      period: history.totalPeriods + i,
      date: addPeriods(lastDate, i),
      forecastedDemand: expectedDemand,
      baselineComponent: avgNonZeroDemand,
      confidence: 1 - zeroProbability,
      metadata: {
        zeroProbability,
        intermittent: true,
      },
    });
  }

  return {
    forecastId: generateForecastId(),
    productId: history.productId,
    locationId: history.locationId,
    method: ForecastMethod.EXPONENTIAL_SMOOTHING,
    generatedAt: new Date(),
    forecastPeriods,
    metadata: {
      intermittentDemand: true,
      zeroProbability,
    },
  };
}

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
export function applyForecastConstraints(
  forecast: ForecastResult,
  constraints: {
    minDemand?: number;
    maxDemand?: number;
    minGrowthRate?: number;
    maxGrowthRate?: number;
  }
): ForecastResult {
  let previousDemand = forecast.forecastPeriods[0]?.forecastedDemand || 0;

  const constrainedPeriods = forecast.forecastPeriods.map(fp => {
    let constrainedDemand = fp.forecastedDemand;

    // Apply min/max constraints
    if (constraints.minDemand !== undefined) {
      constrainedDemand = Math.max(constraints.minDemand, constrainedDemand);
    }
    if (constraints.maxDemand !== undefined) {
      constrainedDemand = Math.min(constraints.maxDemand, constrainedDemand);
    }

    // Apply growth rate constraints
    if (previousDemand > 0) {
      const growthRate = (constrainedDemand - previousDemand) / previousDemand;

      if (constraints.minGrowthRate !== undefined && growthRate < constraints.minGrowthRate) {
        constrainedDemand = previousDemand * (1 + constraints.minGrowthRate);
      }
      if (constraints.maxGrowthRate !== undefined && growthRate > constraints.maxGrowthRate) {
        constrainedDemand = previousDemand * (1 + constraints.maxGrowthRate);
      }
    }

    previousDemand = constrainedDemand;

    return {
      ...fp,
      forecastedDemand: constrainedDemand,
      metadata: {
        ...fp.metadata,
        constrained: true,
      },
    };
  });

  return {
    ...forecast,
    forecastPeriods: constrainedPeriods,
  };
}

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
export function generateHierarchicalForecast(
  familyHistories: DemandHistory[],
  proportions: Record<string, number>,
  periods: number
): Record<string, ForecastResult> {
  const skuForecasts: Record<string, ForecastResult> = {};

  for (const familyHistory of familyHistories) {
    // Generate family-level forecast
    const familyForecast = forecastExponentialSmoothing(familyHistory, periods);

    // Distribute to SKUs
    for (const [skuId, proportion] of Object.entries(proportions)) {
      const skuPeriods = familyForecast.forecastPeriods.map(fp => ({
        ...fp,
        forecastedDemand: fp.forecastedDemand * proportion,
      }));

      skuForecasts[skuId] = {
        ...familyForecast,
        forecastId: generateForecastId(),
        productId: skuId,
        forecastPeriods: skuPeriods,
        metadata: {
          hierarchical: true,
          familyId: familyHistory.productId,
          proportion,
        },
      };
    }
  }

  return skuForecasts;
}

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
export function generateProbabilisticForecast(
  history: DemandHistory,
  periods: number
): {
  optimistic: ForecastResult;
  mostLikely: ForecastResult;
  pessimistic: ForecastResult;
} {
  const stats = calculateStatisticalSummary(
    history.dataPoints.map(dp => dp.actualDemand)
  );

  const baseForecast = forecastExponentialSmoothing(history, periods);

  // Optimistic scenario (+1 std dev)
  const optimistic: ForecastResult = {
    ...baseForecast,
    forecastId: generateForecastId(),
    forecastPeriods: baseForecast.forecastPeriods.map(fp => ({
      ...fp,
      forecastedDemand: fp.forecastedDemand + stats.stdDev,
    })),
    metadata: { scenario: 'OPTIMISTIC' },
  };

  // Most likely scenario (base)
  const mostLikely: ForecastResult = {
    ...baseForecast,
    forecastId: generateForecastId(),
    metadata: { scenario: 'MOST_LIKELY' },
  };

  // Pessimistic scenario (-1 std dev)
  const pessimistic: ForecastResult = {
    ...baseForecast,
    forecastId: generateForecastId(),
    forecastPeriods: baseForecast.forecastPeriods.map(fp => ({
      ...fp,
      forecastedDemand: Math.max(0, fp.forecastedDemand - stats.stdDev),
    })),
    metadata: { scenario: 'PESSIMISTIC' },
  };

  return {
    optimistic,
    mostLikely,
    pessimistic,
  };
}

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
export function generateLongTermForecast(
  history: DemandHistory,
  years: number
): ForecastResult {
  const periodsPerYear = 12; // Assuming monthly data
  const periods = years * periodsPerYear;

  // Use trend-based forecast for long-term
  const trendForecast = forecastDoubleExponentialSmoothing(history, periods, 0.2, 0.1);

  // Detect seasonality
  const seasonality = detectSeasonality(history, periodsPerYear);

  if (seasonality.detected) {
    return applySeasonalAdjustment(trendForecast, seasonality.seasonalIndices);
  }

  return trendForecast;
}

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
export function generateNewProductForecast(
  similarProductHistories: DemandHistory[],
  periods: number,
  scaleFactor: number = 1.0
): ForecastResult {
  if (similarProductHistories.length === 0) {
    throw new Error('At least one similar product history is required');
  }

  // Generate forecasts for similar products
  const similarForecasts = similarProductHistories.map(history =>
    forecastExponentialSmoothing(history, periods)
  );

  // Average the forecasts
  const avgForecastPeriods: ForecastPeriod[] = [];

  for (let i = 0; i < periods; i++) {
    const periodForecasts = similarForecasts.map(f => f.forecastPeriods[i].forecastedDemand);
    const avgForecast = periodForecasts.reduce((sum, f) => sum + f, 0) / periodForecasts.length;

    avgForecastPeriods.push({
      period: i + 1,
      date: similarForecasts[0].forecastPeriods[i].date,
      forecastedDemand: avgForecast * scaleFactor,
    });
  }

  return {
    forecastId: generateForecastId(),
    productId: 'NEW_PRODUCT',
    method: ForecastMethod.ENSEMBLE,
    generatedAt: new Date(),
    forecastPeriods: avgForecastPeriods,
    metadata: {
      newProduct: true,
      scaleFactor,
      basedOnProducts: similarProductHistories.map(h => h.productId),
    },
  };
}

// ============================================================================
// SECTION 5: ACCURACY & ADJUSTMENT (Functions 36-44)
// ============================================================================

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
export function calculateForecastAccuracy(
  forecast: ForecastResult,
  actual: DemandHistory
): ForecastAccuracy {
  const n = Math.min(forecast.forecastPeriods.length, actual.dataPoints.length);

  if (n === 0) {
    throw new Error('No overlapping periods between forecast and actual data');
  }

  let sumAbsoluteError = 0;
  let sumSquaredError = 0;
  let sumPercentageError = 0;
  let sumError = 0;
  let validCount = 0;

  for (let i = 0; i < n; i++) {
    const forecasted = forecast.forecastPeriods[i].forecastedDemand;
    const actualValue = actual.dataPoints[i].actualDemand;

    const error = forecasted - actualValue;
    const absError = Math.abs(error);

    sumError += error;
    sumAbsoluteError += absError;
    sumSquaredError += error * error;

    if (actualValue !== 0) {
      sumPercentageError += Math.abs(error / actualValue);
      validCount++;
    }
  }

  const mad = sumAbsoluteError / n;
  const mse = sumSquaredError / n;
  const rmse = Math.sqrt(mse);
  const mape = validCount > 0 ? (sumPercentageError / validCount) * 100 : 0;
  const bias = sumError / n;
  const trackingSignal = mad === 0 ? 0 : sumError / mad;

  return {
    mape,
    mad,
    mse,
    rmse,
    bias,
    trackingSignal,
    dataPoints: n,
    lastUpdated: new Date(),
  };
}

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
export function applyForecastAdjustment(
  forecast: ForecastResult,
  period: number,
  adjustedValue: number,
  reason: string,
  appliedBy: string
): {
  adjusted: ForecastResult;
  adjustment: ForecastAdjustment;
} {
  const periodIndex = forecast.forecastPeriods.findIndex(fp => fp.period === period);

  if (periodIndex === -1) {
    throw new Error(`Period ${period} not found in forecast`);
  }

  const originalForecast = forecast.forecastPeriods[periodIndex].forecastedDemand;
  const adjustmentAmount = adjustedValue - originalForecast;
  const adjustmentPercent = originalForecast === 0 ? 0 : adjustmentAmount / originalForecast;

  const adjustment: ForecastAdjustment = {
    adjustmentId: crypto.randomUUID(),
    forecastId: forecast.forecastId,
    period,
    originalForecast,
    adjustedForecast: adjustedValue,
    adjustmentAmount,
    adjustmentPercent,
    reason,
    appliedBy,
    appliedAt: new Date(),
  };

  const adjustedPeriods = [...forecast.forecastPeriods];
  adjustedPeriods[periodIndex] = {
    ...adjustedPeriods[periodIndex],
    forecastedDemand: adjustedValue,
    metadata: {
      ...adjustedPeriods[periodIndex].metadata,
      adjusted: true,
      adjustmentId: adjustment.adjustmentId,
    },
  };

  return {
    adjusted: {
      ...forecast,
      forecastPeriods: adjustedPeriods,
    },
    adjustment,
  };
}

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
export function calculateForecastBias(
  historicalForecasts: ForecastResult[],
  actual: DemandHistory
): {
  systematicBias: number;
  biasDirection: 'OVER_FORECAST' | 'UNDER_FORECAST' | 'NEUTRAL';
  biasStrength: number;
  forecastDrift: number;
} {
  let totalBias = 0;
  let totalAbsBias = 0;
  let count = 0;

  for (const forecast of historicalForecasts) {
    const accuracy = calculateForecastAccuracy(forecast, actual);
    totalBias += accuracy.bias;
    totalAbsBias += Math.abs(accuracy.bias);
    count++;
  }

  const systematicBias = count > 0 ? totalBias / count : 0;
  const avgAbsBias = count > 0 ? totalAbsBias / count : 0;

  let biasDirection: 'OVER_FORECAST' | 'UNDER_FORECAST' | 'NEUTRAL' = 'NEUTRAL';
  if (systematicBias > avgAbsBias * 0.1) {
    biasDirection = 'OVER_FORECAST';
  } else if (systematicBias < -avgAbsBias * 0.1) {
    biasDirection = 'UNDER_FORECAST';
  }

  const biasStrength = avgAbsBias === 0 ? 0 : Math.abs(systematicBias) / avgAbsBias;

  // Calculate drift (trend in bias over time)
  const biases = historicalForecasts.map(f => calculateForecastAccuracy(f, actual).bias);
  const forecastDrift = biases.length > 1
    ? (biases[biases.length - 1] - biases[0]) / biases.length
    : 0;

  return {
    systematicBias,
    biasDirection,
    biasStrength,
    forecastDrift,
  };
}

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
export function detectDemandSignals(
  history: DemandHistory,
  forecast: ForecastResult
): DemandSignalResult[] {
  const signals: DemandSignalResult[] = [];
  const values = history.dataPoints.map(dp => dp.actualDemand);
  const stats = calculateStatisticalSummary(values);

  // Check recent periods against forecast
  const recentPeriods = Math.min(3, history.totalPeriods);
  const recentData = history.dataPoints.slice(-recentPeriods);

  for (const dp of recentData) {
    const expectedValue = forecast.forecastPeriods[0]?.forecastedDemand || stats.mean;
    const deviation = dp.actualDemand - expectedValue;
    const deviationPercentage = expectedValue === 0 ? 0 : Math.abs(deviation / expectedValue);

    let signal = DemandSignal.NORMAL;
    let severity: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

    // Detect spike
    if (deviation > stats.stdDev * 2) {
      signal = DemandSignal.SPIKE;
      severity = deviation > stats.stdDev * 3 ? 'HIGH' : 'MEDIUM';
    }

    // Detect drop
    if (deviation < -stats.stdDev * 2) {
      signal = DemandSignal.DROP;
      severity = deviation < -stats.stdDev * 3 ? 'HIGH' : 'MEDIUM';
    }

    // Detect outlier
    if (Math.abs(deviation) > stats.stdDev * 3) {
      signal = DemandSignal.OUTLIER;
      severity = 'HIGH';
    }

    if (signal !== DemandSignal.NORMAL) {
      signals.push({
        signal,
        period: dp.period,
        date: dp.date,
        actualValue: dp.actualDemand,
        expectedValue,
        deviation,
        deviationPercentage: deviationPercentage * 100,
        severity,
      });
    }
  }

  // Detect trend changes
  const trend = analyzeTrend(history);
  if (trend.volatility > 0.5) {
    const latestPeriod = history.dataPoints[history.dataPoints.length - 1];
    signals.push({
      signal: DemandSignal.TREND_CHANGE,
      period: latestPeriod.period,
      date: latestPeriod.date,
      actualValue: latestPeriod.actualDemand,
      expectedValue: stats.mean,
      deviation: latestPeriod.actualDemand - stats.mean,
      deviationPercentage: 0,
      severity: 'MEDIUM',
    });
  }

  return signals;
}

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
export function calculateSafetyStock(
  history: DemandHistory,
  leadTime: number,
  serviceLevel: number = 0.95
): SafetyStockCalculation {
  const values = history.dataPoints.map(dp => dp.actualDemand);
  const stats = calculateStatisticalSummary(values);

  // Calculate lead time demand
  const leadTimeDemand = stats.mean * leadTime;

  // Get Z-score for service level
  const zScore = getZScore(serviceLevel);

  // Calculate safety stock
  // SS = Z * σ * √(LT)
  const safetyStock = zScore * stats.stdDev * Math.sqrt(leadTime);

  // Calculate reorder point
  // ROP = Lead Time Demand + Safety Stock
  const reorderPoint = leadTimeDemand + safetyStock;

  return {
    productId: history.productId,
    locationId: history.locationId,
    safetyStock: Math.ceil(safetyStock),
    reorderPoint: Math.ceil(reorderPoint),
    serviceLevel,
    leadTime,
    leadTimeDemand,
    demandStdDev: stats.stdDev,
  };
}

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
export function performABCClassification(
  products: Array<{ productId: string; annualDemand: number; unitCost: number }>
): ABCAnalysisResult[] {
  // Calculate annual value for each product
  const productsWithValue = products.map(p => ({
    ...p,
    annualValue: p.annualDemand * p.unitCost,
  }));

  // Sort by annual value descending
  productsWithValue.sort((a, b) => b.annualValue - a.annualValue);

  // Calculate total value
  const totalValue = productsWithValue.reduce((sum, p) => sum + p.annualValue, 0);

  // Assign classifications
  const results: ABCAnalysisResult[] = [];
  let cumulativeValue = 0;

  for (const product of productsWithValue) {
    cumulativeValue += product.annualValue;
    const percentOfTotalValue = (product.annualValue / totalValue) * 100;
    const cumulativePercent = (cumulativeValue / totalValue) * 100;

    let classification: ABCClassification;
    if (cumulativePercent <= 80) {
      classification = ABCClassification.A;
    } else if (cumulativePercent <= 95) {
      classification = ABCClassification.B;
    } else {
      classification = ABCClassification.C;
    }

    results.push({
      productId: product.productId,
      classification,
      annualDemand: product.annualDemand,
      annualValue: product.annualValue,
      unitCost: product.unitCost,
      percentOfTotalValue,
      cumulativePercent,
    });
  }

  return results;
}

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
export function recommendForecastActions(accuracy: ForecastAccuracy): {
  overallStatus: 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'POOR' | 'CRITICAL';
  actions: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
} {
  const actions: string[] = [];
  let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let overallStatus: 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'POOR' | 'CRITICAL' = 'EXCELLENT';

  // Evaluate MAPE
  if (accuracy.mape > 50) {
    overallStatus = 'CRITICAL';
    priority = 'CRITICAL';
    actions.push('CRITICAL: MAPE > 50% - Forecast model requires immediate review');
    actions.push('Consider using alternative forecasting method');
    actions.push('Investigate data quality issues');
  } else if (accuracy.mape > 30) {
    overallStatus = 'POOR';
    priority = 'HIGH';
    actions.push('HIGH: MAPE > 30% - Forecast accuracy is poor');
    actions.push('Review and adjust forecast parameters');
    actions.push('Consider ensemble methods');
  } else if (accuracy.mape > 20) {
    overallStatus = 'ACCEPTABLE';
    priority = 'MEDIUM';
    actions.push('MEDIUM: MAPE > 20% - Forecast accuracy is acceptable but could improve');
    actions.push('Monitor forecast performance');
  } else if (accuracy.mape > 10) {
    overallStatus = 'GOOD';
    actions.push('Forecast accuracy is good - continue monitoring');
  } else {
    overallStatus = 'EXCELLENT';
    actions.push('Forecast accuracy is excellent');
  }

  // Check for bias
  if (Math.abs(accuracy.bias) > accuracy.mad) {
    priority = priority === 'LOW' ? 'MEDIUM' : priority;
    actions.push('Significant forecast bias detected - review systematic over/under forecasting');
  }

  // Check tracking signal
  if (Math.abs(accuracy.trackingSignal) > 4) {
    priority = priority === 'LOW' ? 'HIGH' : priority;
    actions.push('Tracking signal out of control - forecast model may be degrading');
  }

  return {
    overallStatus,
    actions,
    priority,
  };
}

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
export function generateAccuracyReport(
  forecasts: ForecastResult[],
  actual: DemandHistory
): {
  summary: {
    totalForecasts: number;
    averageMAPE: number;
    averageMAD: number;
    bestMethod: ForecastMethod;
    worstMethod: ForecastMethod;
  };
  byMethod: Record<ForecastMethod, ForecastAccuracy>;
  recommendations: string[];
} {
  const accuracyByMethod = new Map<ForecastMethod, ForecastAccuracy[]>();

  // Calculate accuracy for each forecast
  for (const forecast of forecasts) {
    try {
      const accuracy = calculateForecastAccuracy(forecast, actual);

      if (!accuracyByMethod.has(forecast.method)) {
        accuracyByMethod.set(forecast.method, []);
      }
      accuracyByMethod.get(forecast.method)!.push(accuracy);
    } catch (error) {
      // Skip forecasts with no overlapping data
      continue;
    }
  }

  // Aggregate by method
  const byMethod: Record<string, ForecastAccuracy> = {};
  let bestMethod = ForecastMethod.SIMPLE_MOVING_AVERAGE;
  let worstMethod = ForecastMethod.SIMPLE_MOVING_AVERAGE;
  let bestMAPE = Infinity;
  let worstMAPE = 0;

  for (const [method, accuracies] of accuracyByMethod.entries()) {
    const avgMAPE = accuracies.reduce((sum, a) => sum + a.mape, 0) / accuracies.length;
    const avgMAD = accuracies.reduce((sum, a) => sum + a.mad, 0) / accuracies.length;
    const avgMSE = accuracies.reduce((sum, a) => sum + a.mse, 0) / accuracies.length;
    const avgRMSE = accuracies.reduce((sum, a) => sum + a.rmse, 0) / accuracies.length;
    const avgBias = accuracies.reduce((sum, a) => sum + a.bias, 0) / accuracies.length;

    byMethod[method] = {
      mape: avgMAPE,
      mad: avgMAD,
      mse: avgMSE,
      rmse: avgRMSE,
      bias: avgBias,
      trackingSignal: 0,
      dataPoints: accuracies.reduce((sum, a) => sum + a.dataPoints, 0),
      lastUpdated: new Date(),
    };

    if (avgMAPE < bestMAPE) {
      bestMAPE = avgMAPE;
      bestMethod = method;
    }
    if (avgMAPE > worstMAPE) {
      worstMAPE = avgMAPE;
      worstMethod = method;
    }
  }

  // Calculate overall averages
  const allAccuracies = Array.from(accuracyByMethod.values()).flat();
  const averageMAPE = allAccuracies.reduce((sum, a) => sum + a.mape, 0) / allAccuracies.length;
  const averageMAD = allAccuracies.reduce((sum, a) => sum + a.mad, 0) / allAccuracies.length;

  // Generate recommendations
  const recommendations: string[] = [
    `Best performing method: ${bestMethod} (MAPE: ${bestMAPE.toFixed(2)}%)`,
    `Recommended to use ${bestMethod} for future forecasts`,
  ];

  if (averageMAPE > 20) {
    recommendations.push('Overall forecast accuracy needs improvement');
    recommendations.push('Consider reviewing data quality and forecast parameters');
  }

  return {
    summary: {
      totalForecasts: forecasts.length,
      averageMAPE,
      averageMAD,
      bestMethod,
      worstMethod,
    },
    byMethod: byMethod as Record<ForecastMethod, ForecastAccuracy>,
    recommendations,
  };
}

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
export function exportForecast(
  forecast: ForecastResult,
  format: 'CSV' | 'JSON' | 'XML'
): string | object {
  switch (format) {
    case 'CSV':
      let csv = 'Period,Date,Forecasted Demand,Lower Bound,Upper Bound,Confidence\n';
      for (const fp of forecast.forecastPeriods) {
        csv += `${fp.period},${fp.date.toISOString()},${fp.forecastedDemand},`;
        csv += `${fp.lowerBound || ''},${fp.upperBound || ''},${fp.confidence || ''}\n`;
      }
      return csv;

    case 'JSON':
      return {
        forecastId: forecast.forecastId,
        productId: forecast.productId,
        locationId: forecast.locationId,
        method: forecast.method,
        generatedAt: forecast.generatedAt.toISOString(),
        periods: forecast.forecastPeriods.map(fp => ({
          period: fp.period,
          date: fp.date.toISOString(),
          forecastedDemand: fp.forecastedDemand,
          lowerBound: fp.lowerBound,
          upperBound: fp.upperBound,
          confidence: fp.confidence,
        })),
        accuracy: forecast.accuracy,
      };

    case 'XML':
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<forecast>\n';
      xml += `  <forecastId>${forecast.forecastId}</forecastId>\n`;
      xml += `  <productId>${forecast.productId}</productId>\n`;
      xml += `  <method>${forecast.method}</method>\n`;
      xml += `  <generatedAt>${forecast.generatedAt.toISOString()}</generatedAt>\n`;
      xml += '  <periods>\n';
      for (const fp of forecast.forecastPeriods) {
        xml += '    <period>\n';
        xml += `      <number>${fp.period}</number>\n`;
        xml += `      <date>${fp.date.toISOString()}</date>\n`;
        xml += `      <demand>${fp.forecastedDemand}</demand>\n`;
        xml += '    </period>\n';
      }
      xml += '  </periods>\n';
      xml += '</forecast>';
      return xml;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Generates unique forecast ID.
 */
function generateForecastId(): string {
  return `FCST-${crypto.randomUUID()}`;
}

/**
 * Helper: Adds periods to a date.
 */
function addPeriods(date: Date, periods: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + periods);
  return newDate;
}

/**
 * Helper: Gets aggregation key for time period.
 */
function getAggregationKey(date: Date, level: string): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  switch (level) {
    case 'DAILY':
      return `${year}-${month}-${day}`;
    case 'WEEKLY':
      const week = Math.floor(day / 7);
      return `${year}-${month}-W${week}`;
    case 'MONTHLY':
      return `${year}-${month}`;
    case 'QUARTERLY':
      const quarter = Math.floor(month / 3);
      return `${year}-Q${quarter}`;
    case 'YEARLY':
      return `${year}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * Helper: Interpolates missing value.
 */
function interpolateValue(
  complete: DemandDataPoint[],
  period: number,
  sorted: DemandDataPoint[]
): number {
  if (complete.length === 0) return 0;

  // Find surrounding values
  const before = complete[complete.length - 1];
  const afterIndex = sorted.findIndex(dp => dp.period > period);

  if (afterIndex === -1) {
    return before.actualDemand;
  }

  const after = sorted[afterIndex];
  const ratio = (period - before.period) / (after.period - before.period);

  return before.actualDemand + ratio * (after.actualDemand - before.actualDemand);
}

/**
 * Helper: Estimates date for period.
 */
function estimateDate(sorted: DemandDataPoint[], period: number): Date {
  if (sorted.length < 2) return sorted[0].date;

  const avgDaysBetween =
    (sorted[sorted.length - 1].date.getTime() - sorted[0].date.getTime()) /
    (sorted.length - 1);

  const baseDate = sorted[0].date;
  const offset = (period - sorted[0].period) * avgDaysBetween;

  return new Date(baseDate.getTime() + offset);
}

/**
 * Helper: Gets Z-score for confidence level.
 */
function getZScore(confidenceLevel: number): number {
  // Common Z-scores for confidence levels
  const zScores: Record<number, number> = {
    0.90: 1.645,
    0.95: 1.960,
    0.99: 2.576,
  };

  return zScores[confidenceLevel] || 1.960;
}

/**
 * Helper: Generates parameter combinations for grid search.
 */
function generateParameterCombinations(
  parameterRanges: Record<string, number[]>
): Array<Record<string, number>> {
  const keys = Object.keys(parameterRanges);
  const combinations: Array<Record<string, number>> = [];

  function generateRecursive(index: number, current: Record<string, number>) {
    if (index === keys.length) {
      combinations.push({ ...current });
      return;
    }

    const key = keys[index];
    for (const value of parameterRanges[key]) {
      current[key] = value;
      generateRecursive(index + 1, current);
    }
  }

  generateRecursive(0, {});
  return combinations;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Data Collection & Preparation
  createDemandHistory,
  validateDemandData,
  cleanDemandData,
  normalizeDemandData,
  aggregateDemandData,
  splitDemandData,
  fillMissingDemandValues,
  calculateStatisticalSummary,
  detectOutliers,

  // Forecast Model Selection
  forecastSimpleMovingAverage,
  forecastWeightedMovingAverage,
  forecastExponentialSmoothing,
  forecastDoubleExponentialSmoothing,
  forecastLinearRegression,
  selectBestForecastMethod,
  createEnsembleForecast,
  optimizeForecastParameters,

  // Trend & Seasonality Analysis
  analyzeTrend,
  detectSeasonality,
  decomposeTimeSeries,
  calculateSeasonalIndices,
  calculateAutocorrelation,
  identifyCyclicalPatterns,
  removeSeasonality,
  applySeasonalAdjustment,
  detectStructuralBreaks,

  // Forecast Generation
  generateForecastWithConfidence,
  generateSeasonalTrendForecast,
  generateAdaptiveForecast,
  generateIntermittentDemandForecast,
  applyForecastConstraints,
  generateHierarchicalForecast,
  generateProbabilisticForecast,
  generateLongTermForecast,
  generateNewProductForecast,

  // Accuracy & Adjustment
  calculateForecastAccuracy,
  applyForecastAdjustment,
  calculateForecastBias,
  detectDemandSignals,
  calculateSafetyStock,
  performABCClassification,
  recommendForecastActions,
  generateAccuracyReport,
  exportForecast,
};
