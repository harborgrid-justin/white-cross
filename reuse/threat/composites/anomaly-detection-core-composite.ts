/**
 * LOC: ANOMALYDETCORE001
 * File: /reuse/threat/composites/anomaly-detection-core-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../behavioral-threat-analytics-kit
 *   - ../threat-detection-engine-kit
 *   - ../threat-analytics-kit
 *   - ../security-analytics-kit
 *   - ../threat-scoring-kit
 *
 * DOWNSTREAM (imported by):
 *   - Anomaly detection services
 *   - Behavioral analysis modules
 *   - Pattern recognition engines
 *   - ML-based threat detection systems
 *   - Statistical anomaly detection services
 *   - Healthcare security monitoring dashboards
 */

/**
 * File: /reuse/threat/composites/anomaly-detection-core-composite.ts
 * Locator: WC-ANOMALY-DETECTION-CORE-001
 * Purpose: Comprehensive Anomaly Detection Core Toolkit - Production-ready anomaly detection and behavioral analysis
 *
 * Upstream: Composed from behavioral-threat-analytics-kit, threat-detection-engine-kit, threat-analytics-kit, security-analytics-kit, threat-scoring-kit
 * Downstream: ../backend/*, Anomaly detection services, Behavioral analysis, Pattern recognition, ML pipelines
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 45 utility functions for anomaly detection, behavioral analysis, pattern recognition, statistical analysis, ML integration
 *
 * LLM Context: Enterprise-grade anomaly detection core toolkit for White Cross healthcare platform.
 * Provides comprehensive anomaly detection capabilities including statistical anomaly detection, behavioral
 * anomaly analysis, temporal pattern recognition, ML-based detection algorithms, baseline deviation detection,
 * adaptive learning mechanisms, multi-dimensional anomaly scoring, false positive reduction, and HIPAA-compliant
 * healthcare security monitoring. Composes functions from multiple threat intelligence kits to provide unified
 * anomaly detection operations for detecting insider threats, compromised credentials, data exfiltration,
 * abnormal access patterns, and privilege escalation in healthcare systems.
 */

import { Model, Column, Table, DataType, Index, PrimaryKey, Default, AllowNull, Unique } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsObject, IsArray, IsDate, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Anomaly detection configuration
 */
export interface AnomalyDetectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  detectionMethod: AnomalyDetectionMethod;
  sensitivity: AnomalySensitivity;
  thresholds: AnomalyThresholds;
  baselineId?: string;
  mlModelId?: string;
  adaptiveLearning: boolean;
  metadata?: Record<string, any>;
}

/**
 * Anomaly detection methods
 */
export enum AnomalyDetectionMethod {
  STATISTICAL = 'STATISTICAL',
  BEHAVIORAL = 'BEHAVIORAL',
  TEMPORAL = 'TEMPORAL',
  PATTERN_BASED = 'PATTERN_BASED',
  ML_BASED = 'ML_BASED',
  HYBRID = 'HYBRID',
}

/**
 * Anomaly sensitivity levels
 */
export enum AnomalySensitivity {
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
}

/**
 * Anomaly detection thresholds
 */
export interface AnomalyThresholds {
  standardDeviations: number; // e.g., 2.5 for statistical methods
  confidenceLevel: number; // 0-100
  minimumSamples: number;
  zScore: number;
  pValue: number;
  anomalyScore: number; // 0-100
}

/**
 * Anomaly detection result
 */
export interface AnomalyDetectionResult {
  id: string;
  timestamp: Date;
  detectionMethod: AnomalyDetectionMethod;
  anomalyType: AnomalyType;
  severity: AnomalySeverity;
  anomalyScore: number; // 0-100
  confidence: number; // 0-100
  zScore?: number;
  pValue?: number;
  baselineDeviation: number;
  affectedEntities: string[];
  indicators: AnomalyIndicator[];
  explanation: string;
  recommendedActions: string[];
  isFalsePositive: boolean;
  falsePositiveConfidence?: number;
  metadata?: Record<string, any>;
}

/**
 * Anomaly types
 */
export enum AnomalyType {
  POINT_ANOMALY = 'POINT_ANOMALY',
  CONTEXTUAL_ANOMALY = 'CONTEXTUAL_ANOMALY',
  COLLECTIVE_ANOMALY = 'COLLECTIVE_ANOMALY',
  TREND_ANOMALY = 'TREND_ANOMALY',
  SEASONAL_ANOMALY = 'SEASONAL_ANOMALY',
  BEHAVIOR_ANOMALY = 'BEHAVIOR_ANOMALY',
  PATTERN_ANOMALY = 'PATTERN_ANOMALY',
}

/**
 * Anomaly severity levels
 */
export enum AnomalySeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

/**
 * Anomaly indicator
 */
export interface AnomalyIndicator {
  type: string;
  value: string | number;
  expectedValue?: string | number;
  deviation: number;
  weight: number;
  confidence: number;
}

/**
 * Behavioral baseline profile
 */
export interface BehaviorBaseline {
  id: string;
  entityId: string;
  entityType: string;
  profileType: BaselineProfileType;
  timeWindow: TimeWindow;
  metrics: BaselineMetrics;
  patterns: BehaviorPattern[];
  lastUpdated: Date;
  sampleSize: number;
  confidence: number;
  metadata?: Record<string, any>;
}

/**
 * Baseline profile types
 */
export enum BaselineProfileType {
  USER_ACTIVITY = 'USER_ACTIVITY',
  NETWORK_TRAFFIC = 'NETWORK_TRAFFIC',
  DATA_ACCESS = 'DATA_ACCESS',
  SYSTEM_BEHAVIOR = 'SYSTEM_BEHAVIOR',
  APPLICATION_USAGE = 'APPLICATION_USAGE',
  API_CONSUMPTION = 'API_CONSUMPTION',
}

/**
 * Time window for baseline calculation
 */
export interface TimeWindow {
  start: Date;
  end: Date;
  duration: number; // milliseconds
  granularity: TimeGranularity;
}

/**
 * Time granularity options
 */
export enum TimeGranularity {
  MINUTE = 'MINUTE',
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

/**
 * Baseline statistical metrics
 */
export interface BaselineMetrics {
  mean: number;
  median: number;
  mode?: number;
  standardDeviation: number;
  variance: number;
  min: number;
  max: number;
  percentile25: number;
  percentile75: number;
  percentile95: number;
  percentile99: number;
  skewness?: number;
  kurtosis?: number;
}

/**
 * Behavior pattern structure
 */
export interface BehaviorPattern {
  id: string;
  patternType: PatternType;
  description: string;
  frequency: number;
  confidence: number;
  attributes: Record<string, any>;
  firstObserved: Date;
  lastObserved: Date;
}

/**
 * Pattern types for detection
 */
export enum PatternType {
  SEQUENTIAL = 'SEQUENTIAL',
  TEMPORAL = 'TEMPORAL',
  FREQUENCY = 'FREQUENCY',
  VOLUME = 'VOLUME',
  LOCATION = 'LOCATION',
  ACCESS = 'ACCESS',
  CUSTOM = 'CUSTOM',
}

/**
 * Statistical analysis result
 */
export interface StatisticalAnalysisResult {
  method: string;
  zScore?: number;
  pValue?: number;
  chiSquare?: number;
  tStatistic?: number;
  fStatistic?: number;
  confidence: number;
  isSignificant: boolean;
  degreesOfFreedom?: number;
  metadata?: Record<string, any>;
}

/**
 * ML-based detection result
 */
export interface MLDetectionResult {
  modelId: string;
  modelType: string;
  prediction: 'NORMAL' | 'ANOMALY';
  anomalyProbability: number; // 0-1
  confidence: number; // 0-100
  features: Record<string, number>;
  featureImportance?: Record<string, number>;
  explanation?: string;
  metadata?: Record<string, any>;
}

/**
 * Pattern matching result
 */
export interface PatternMatchResult {
  patternId: string;
  patternType: PatternType;
  matchScore: number; // 0-100
  confidence: number; // 0-100
  matchedAttributes: string[];
  deviations: Array<{
    attribute: string;
    expected: any;
    actual: any;
    deviation: number;
  }>;
  metadata?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Anomaly Detection Configuration Model
 * Stores configuration for anomaly detection engines
 */
@Table({
  tableName: 'anomaly_detection_configs',
  timestamps: true,
  indexes: [
    { fields: ['enabled'] },
    { fields: ['detectionMethod'] },
    { fields: ['sensitivity'] },
  ],
})
export class AnomalyDetectionConfigModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique configuration identifier' })
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Configuration name' })
  name: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  @ApiProperty({ description: 'Whether configuration is enabled' })
  enabled: boolean;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(AnomalyDetectionMethod)))
  @ApiProperty({ enum: AnomalyDetectionMethod, description: 'Detection method' })
  detectionMethod: AnomalyDetectionMethod;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(AnomalySensitivity)))
  @ApiProperty({ enum: AnomalySensitivity, description: 'Sensitivity level' })
  sensitivity: AnomalySensitivity;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Detection thresholds' })
  thresholds: AnomalyThresholds;

  @Column(DataType.UUID)
  @ApiPropertyOptional({ description: 'Associated baseline ID' })
  baselineId?: string;

  @Column(DataType.UUID)
  @ApiPropertyOptional({ description: 'Associated ML model ID' })
  mlModelId?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  @ApiProperty({ description: 'Enable adaptive learning' })
  adaptiveLearning: boolean;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Anomaly Detection Result Model
 * Stores detected anomalies
 */
@Table({
  tableName: 'anomaly_detection_results',
  timestamps: true,
  indexes: [
    { fields: ['timestamp'] },
    { fields: ['anomalyType'] },
    { fields: ['severity'] },
    { fields: ['anomalyScore'] },
    { fields: ['isFalsePositive'] },
  ],
})
export class AnomalyDetectionResultModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique anomaly identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Detection timestamp' })
  timestamp: Date;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(AnomalyDetectionMethod)))
  @ApiProperty({ enum: AnomalyDetectionMethod, description: 'Detection method used' })
  detectionMethod: AnomalyDetectionMethod;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(AnomalyType)))
  @ApiProperty({ enum: AnomalyType, description: 'Type of anomaly' })
  anomalyType: AnomalyType;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(AnomalySeverity)))
  @ApiProperty({ enum: AnomalySeverity, description: 'Anomaly severity' })
  severity: AnomalySeverity;

  @AllowNull(false)
  @Column(DataType.DECIMAL(5, 2))
  @ApiProperty({ description: 'Anomaly score (0-100)' })
  anomalyScore: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(5, 2))
  @ApiProperty({ description: 'Confidence score (0-100)' })
  confidence: number;

  @Column(DataType.DECIMAL(10, 4))
  @ApiPropertyOptional({ description: 'Z-score for statistical methods' })
  zScore?: number;

  @Column(DataType.DECIMAL(10, 8))
  @ApiPropertyOptional({ description: 'P-value for statistical methods' })
  pValue?: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 4))
  @ApiProperty({ description: 'Baseline deviation percentage' })
  baselineDeviation: number;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.STRING))
  @ApiProperty({ description: 'Affected entities' })
  affectedEntities: string[];

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Anomaly indicators' })
  indicators: AnomalyIndicator[];

  @AllowNull(false)
  @Column(DataType.TEXT)
  @ApiProperty({ description: 'Human-readable explanation' })
  explanation: string;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.TEXT))
  @ApiProperty({ description: 'Recommended actions' })
  recommendedActions: string[];

  @Default(false)
  @Column(DataType.BOOLEAN)
  @ApiProperty({ description: 'Whether this is a false positive' })
  isFalsePositive: boolean;

  @Column(DataType.DECIMAL(5, 2))
  @ApiPropertyOptional({ description: 'False positive confidence' })
  falsePositiveConfidence?: number;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Behavioral Baseline Model
 * Stores behavioral baseline profiles
 */
@Table({
  tableName: 'behavior_baselines',
  timestamps: true,
  indexes: [
    { fields: ['entityId'] },
    { fields: ['entityType'] },
    { fields: ['profileType'] },
    { fields: ['lastUpdated'] },
  ],
})
export class BehaviorBaselineModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique baseline identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Entity identifier' })
  entityId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Entity type' })
  entityType: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(BaselineProfileType)))
  @ApiProperty({ enum: BaselineProfileType, description: 'Profile type' })
  profileType: BaselineProfileType;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Time window for baseline' })
  timeWindow: TimeWindow;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Statistical metrics' })
  metrics: BaselineMetrics;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Behavior patterns' })
  patterns: BehaviorPattern[];

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Last update timestamp' })
  lastUpdated: Date;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Number of samples used' })
  sampleSize: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(5, 2))
  @ApiProperty({ description: 'Baseline confidence (0-100)' })
  confidence: number;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

// ============================================================================
// CORE ANOMALY DETECTION FUNCTIONS
// ============================================================================

/**
 * Detects statistical anomalies using Z-score and standard deviation analysis.
 * Identifies data points that deviate significantly from the mean.
 *
 * @param {number[]} dataPoints - Array of numerical data points
 * @param {number} threshold - Z-score threshold (default: 2.5)
 * @returns {AnomalyDetectionResult[]} Array of detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectStatisticalAnomalies([10, 12, 11, 13, 150, 12, 11], 2.5);
 * // Returns anomaly for value 150
 * ```
 */
export const detectStatisticalAnomalies = (
  dataPoints: number[],
  threshold: number = 2.5
): AnomalyDetectionResult[] => {
  const mean = dataPoints.reduce((sum, val) => sum + val, 0) / dataPoints.length;
  const variance = dataPoints.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dataPoints.length;
  const stdDev = Math.sqrt(variance);

  const anomalies: AnomalyDetectionResult[] = [];

  dataPoints.forEach((value, index) => {
    const zScore = (value - mean) / stdDev;
    const pValue = 1 - (0.5 * (1 + Math.erf(Math.abs(zScore) / Math.sqrt(2))));

    if (Math.abs(zScore) > threshold) {
      anomalies.push({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        detectionMethod: AnomalyDetectionMethod.STATISTICAL,
        anomalyType: AnomalyType.POINT_ANOMALY,
        severity: Math.abs(zScore) > 4 ? AnomalySeverity.CRITICAL : Math.abs(zScore) > 3 ? AnomalySeverity.HIGH : AnomalySeverity.MEDIUM,
        anomalyScore: Math.min(100, Math.abs(zScore) * 20),
        confidence: Math.min(100, (1 - pValue) * 100),
        zScore,
        pValue,
        baselineDeviation: ((value - mean) / mean) * 100,
        affectedEntities: [`data_point_${index}`],
        indicators: [
          {
            type: 'value',
            value,
            expectedValue: mean,
            deviation: Math.abs(zScore),
            weight: 1.0,
            confidence: Math.min(100, (1 - pValue) * 100),
          },
        ],
        explanation: `Value ${value} deviates ${Math.abs(zScore).toFixed(2)} standard deviations from mean ${mean.toFixed(2)}`,
        recommendedActions: ['Review data point', 'Investigate source', 'Validate legitimacy'],
        isFalsePositive: false,
      });
    }
  });

  return anomalies;
};

/**
 * Detects behavioral anomalies by comparing current behavior against established baselines.
 * Uses multiple behavioral metrics and pattern matching.
 *
 * @param {any} currentBehavior - Current behavior data
 * @param {BehaviorBaseline} baseline - Established behavioral baseline
 * @returns {AnomalyDetectionResult | null} Detected anomaly or null
 *
 * @example
 * ```typescript
 * const anomaly = detectBehavioralAnomaly(userActivity, userBaseline);
 * if (anomaly) console.log('Behavioral anomaly detected:', anomaly.explanation);
 * ```
 */
export const detectBehavioralAnomaly = (
  currentBehavior: any,
  baseline: BehaviorBaseline
): AnomalyDetectionResult | null => {
  const deviations: AnomalyIndicator[] = [];
  let totalDeviation = 0;

  // Check numeric metrics
  Object.keys(currentBehavior).forEach((key) => {
    if (typeof currentBehavior[key] === 'number' && baseline.metrics[key] !== undefined) {
      const expected = baseline.metrics.mean;
      const stdDev = baseline.metrics.standardDeviation;
      const zScore = Math.abs((currentBehavior[key] - expected) / stdDev);

      if (zScore > 2) {
        deviations.push({
          type: key,
          value: currentBehavior[key],
          expectedValue: expected,
          deviation: zScore,
          weight: 1.0,
          confidence: Math.min(100, zScore * 30),
        });
        totalDeviation += zScore;
      }
    }
  });

  if (deviations.length === 0) return null;

  const avgDeviation = totalDeviation / deviations.length;
  const anomalyScore = Math.min(100, avgDeviation * 25);

  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    detectionMethod: AnomalyDetectionMethod.BEHAVIORAL,
    anomalyType: AnomalyType.BEHAVIOR_ANOMALY,
    severity: anomalyScore > 80 ? AnomalySeverity.CRITICAL : anomalyScore > 60 ? AnomalySeverity.HIGH : AnomalySeverity.MEDIUM,
    anomalyScore,
    confidence: Math.min(100, baseline.confidence * (avgDeviation / 3)),
    baselineDeviation: avgDeviation * 100,
    affectedEntities: [baseline.entityId],
    indicators: deviations,
    explanation: `Detected ${deviations.length} behavioral deviations from baseline profile`,
    recommendedActions: [
      'Review user activity',
      'Check for compromised credentials',
      'Validate behavior changes',
    ],
    isFalsePositive: false,
  };
};

/**
 * Detects temporal anomalies by analyzing time-based patterns and sequences.
 * Identifies unusual timing, frequency, or temporal clustering.
 *
 * @param {Array<{timestamp: Date, value: number}>} timeSeriesData - Time series data
 * @returns {AnomalyDetectionResult[]} Array of temporal anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectTemporalAnomalies(loginAttempts);
 * ```
 */
export const detectTemporalAnomalies = (
  timeSeriesData: Array<{ timestamp: Date; value: number }>
): AnomalyDetectionResult[] => {
  const anomalies: AnomalyDetectionResult[] = [];

  // Calculate time intervals
  const intervals: number[] = [];
  for (let i = 1; i < timeSeriesData.length; i++) {
    const interval = timeSeriesData[i].timestamp.getTime() - timeSeriesData[i - 1].timestamp.getTime();
    intervals.push(interval);
  }

  // Statistical analysis of intervals
  const meanInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
  const stdDevInterval = Math.sqrt(
    intervals.reduce((sum, val) => sum + Math.pow(val - meanInterval, 2), 0) / intervals.length
  );

  // Detect unusual intervals
  intervals.forEach((interval, index) => {
    const zScore = Math.abs((interval - meanInterval) / stdDevInterval);
    if (zScore > 3) {
      anomalies.push({
        id: crypto.randomUUID(),
        timestamp: timeSeriesData[index + 1].timestamp,
        detectionMethod: AnomalyDetectionMethod.TEMPORAL,
        anomalyType: AnomalyType.TREND_ANOMALY,
        severity: zScore > 4 ? AnomalySeverity.HIGH : AnomalySeverity.MEDIUM,
        anomalyScore: Math.min(100, zScore * 20),
        confidence: 85,
        zScore,
        baselineDeviation: ((interval - meanInterval) / meanInterval) * 100,
        affectedEntities: [`event_${index + 1}`],
        indicators: [
          {
            type: 'time_interval',
            value: interval,
            expectedValue: meanInterval,
            deviation: zScore,
            weight: 1.0,
            confidence: 85,
          },
        ],
        explanation: `Unusual time interval detected: ${(interval / 1000).toFixed(0)}s (expected: ${(meanInterval / 1000).toFixed(0)}s)`,
        recommendedActions: ['Investigate timing anomaly', 'Check for automation', 'Review event sequence'],
        isFalsePositive: false,
      });
    }
  });

  return anomalies;
};

/**
 * Calculates comprehensive anomaly score combining multiple detection methods.
 *
 * @param {Partial<AnomalyDetectionResult>[]} detectionResults - Results from multiple detection methods
 * @returns {number} Composite anomaly score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateCompositeAnomalyScore([statResult, behaviorResult, mlResult]);
 * ```
 */
export const calculateCompositeAnomalyScore = (
  detectionResults: Partial<AnomalyDetectionResult>[]
): number => {
  if (detectionResults.length === 0) return 0;

  const weights: Record<AnomalyDetectionMethod, number> = {
    [AnomalyDetectionMethod.STATISTICAL]: 0.15,
    [AnomalyDetectionMethod.BEHAVIORAL]: 0.25,
    [AnomalyDetectionMethod.TEMPORAL]: 0.15,
    [AnomalyDetectionMethod.PATTERN_BASED]: 0.20,
    [AnomalyDetectionMethod.ML_BASED]: 0.20,
    [AnomalyDetectionMethod.HYBRID]: 0.05,
  };

  let weightedSum = 0;
  let totalWeight = 0;

  detectionResults.forEach((result) => {
    if (result.detectionMethod && result.anomalyScore !== undefined) {
      const weight = weights[result.detectionMethod] || 0.1;
      weightedSum += result.anomalyScore * weight;
      totalWeight += weight;
    }
  });

  return totalWeight > 0 ? Math.min(100, weightedSum / totalWeight) : 0;
};

/**
 * Creates behavioral baseline profile from historical data.
 *
 * @param {string} entityId - Entity identifier
 * @param {string} entityType - Entity type
 * @param {any[]} historicalData - Historical behavior data
 * @param {BaselineProfileType} profileType - Type of profile to create
 * @returns {BehaviorBaseline} Baseline profile
 *
 * @example
 * ```typescript
 * const baseline = createBehaviorBaseline('user123', 'user', userData, BaselineProfileType.USER_ACTIVITY);
 * ```
 */
export const createBehaviorBaseline = (
  entityId: string,
  entityType: string,
  historicalData: any[],
  profileType: BaselineProfileType
): BehaviorBaseline => {
  const numericValues = historicalData.filter((d) => typeof d === 'number');

  const mean = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
  const sortedValues = [...numericValues].sort((a, b) => a - b);
  const median = sortedValues[Math.floor(sortedValues.length / 2)];
  const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length;
  const stdDev = Math.sqrt(variance);

  return {
    id: crypto.randomUUID(),
    entityId,
    entityType,
    profileType,
    timeWindow: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
      duration: 30 * 24 * 60 * 60 * 1000,
      granularity: TimeGranularity.DAY,
    },
    metrics: {
      mean,
      median,
      standardDeviation: stdDev,
      variance,
      min: Math.min(...numericValues),
      max: Math.max(...numericValues),
      percentile25: sortedValues[Math.floor(sortedValues.length * 0.25)],
      percentile75: sortedValues[Math.floor(sortedValues.length * 0.75)],
      percentile95: sortedValues[Math.floor(sortedValues.length * 0.95)],
      percentile99: sortedValues[Math.floor(sortedValues.length * 0.99)],
    },
    patterns: [],
    lastUpdated: new Date(),
    sampleSize: historicalData.length,
    confidence: Math.min(100, (historicalData.length / 1000) * 100),
  };
};

/**
 * Updates behavioral baseline with new data using adaptive learning.
 *
 * @param {BehaviorBaseline} baseline - Existing baseline
 * @param {any[]} newData - New behavior data
 * @param {number} learningRate - Learning rate (0-1, default: 0.1)
 * @returns {BehaviorBaseline} Updated baseline
 *
 * @example
 * ```typescript
 * const updated = updateBehaviorBaseline(currentBaseline, newActivities, 0.1);
 * ```
 */
export const updateBehaviorBaseline = (
  baseline: BehaviorBaseline,
  newData: any[],
  learningRate: number = 0.1
): BehaviorBaseline => {
  const numericValues = newData.filter((d) => typeof d === 'number');
  const newMean = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;

  // Exponential moving average
  const updatedMean = baseline.metrics.mean * (1 - learningRate) + newMean * learningRate;

  return {
    ...baseline,
    metrics: {
      ...baseline.metrics,
      mean: updatedMean,
    },
    lastUpdated: new Date(),
    sampleSize: baseline.sampleSize + newData.length,
    confidence: Math.min(100, baseline.confidence + 1),
  };
};

/**
 * Calculates baseline deviation percentage for a given value.
 *
 * @param {number} value - Current value
 * @param {BaselineMetrics} metrics - Baseline metrics
 * @returns {number} Deviation percentage
 *
 * @example
 * ```typescript
 * const deviation = calculateBaselineDeviation(150, baselineMetrics);
 * ```
 */
export const calculateBaselineDeviation = (value: number, metrics: BaselineMetrics): number => {
  return ((value - metrics.mean) / metrics.mean) * 100;
};

/**
 * Detects baseline deviation anomalies.
 *
 * @param {number} value - Current value
 * @param {BehaviorBaseline} baseline - Behavioral baseline
 * @param {number} threshold - Deviation threshold percentage
 * @returns {AnomalyDetectionResult | null} Anomaly if detected
 *
 * @example
 * ```typescript
 * const anomaly = detectBaselineDeviation(200, baseline, 50);
 * ```
 */
export const detectBaselineDeviation = (
  value: number,
  baseline: BehaviorBaseline,
  threshold: number = 50
): AnomalyDetectionResult | null => {
  const deviation = calculateBaselineDeviation(value, baseline.metrics);

  if (Math.abs(deviation) < threshold) return null;

  const zScore = (value - baseline.metrics.mean) / baseline.metrics.standardDeviation;

  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    detectionMethod: AnomalyDetectionMethod.STATISTICAL,
    anomalyType: AnomalyType.CONTEXTUAL_ANOMALY,
    severity: Math.abs(deviation) > 100 ? AnomalySeverity.CRITICAL : AnomalySeverity.HIGH,
    anomalyScore: Math.min(100, Math.abs(deviation)),
    confidence: baseline.confidence,
    zScore,
    baselineDeviation: deviation,
    affectedEntities: [baseline.entityId],
    indicators: [
      {
        type: 'value',
        value,
        expectedValue: baseline.metrics.mean,
        deviation: Math.abs(zScore),
        weight: 1.0,
        confidence: baseline.confidence,
      },
    ],
    explanation: `Value deviates ${deviation.toFixed(1)}% from baseline (threshold: ${threshold}%)`,
    recommendedActions: ['Investigate deviation cause', 'Validate data source', 'Review baseline'],
    isFalsePositive: false,
  };
};

/**
 * Performs adaptive baseline learning with automatic threshold adjustment.
 *
 * @param {BehaviorBaseline} baseline - Current baseline
 * @param {AnomalyDetectionResult[]} recentAnomalies - Recently detected anomalies
 * @returns {BehaviorBaseline} Adapted baseline
 *
 * @example
 * ```typescript
 * const adapted = adaptiveBaselineLearning(baseline, anomalies);
 * ```
 */
export const adaptiveBaselineLearning = (
  baseline: BehaviorBaseline,
  recentAnomalies: AnomalyDetectionResult[]
): BehaviorBaseline => {
  // Calculate false positive rate
  const falsePositives = recentAnomalies.filter((a) => a.isFalsePositive).length;
  const fpRate = recentAnomalies.length > 0 ? falsePositives / recentAnomalies.length : 0;

  // Adjust confidence based on false positive rate
  const confidenceAdjustment = fpRate > 0.2 ? -5 : fpRate < 0.05 ? 2 : 0;

  return {
    ...baseline,
    confidence: Math.max(0, Math.min(100, baseline.confidence + confidenceAdjustment)),
    lastUpdated: new Date(),
  };
};

/**
 * Matches current behavior against known threat patterns.
 *
 * @param {any} behavior - Current behavior data
 * @param {BehaviorPattern[]} patterns - Known patterns
 * @returns {PatternMatchResult[]} Pattern match results
 *
 * @example
 * ```typescript
 * const matches = matchThreatPatterns(userBehavior, threatPatterns);
 * ```
 */
export const matchThreatPatterns = (behavior: any, patterns: BehaviorPattern[]): PatternMatchResult[] => {
  const results: PatternMatchResult[] = [];

  patterns.forEach((pattern) => {
    let matchScore = 0;
    let matchedAttributes: string[] = [];
    const deviations: Array<{ attribute: string; expected: any; actual: any; deviation: number }> = [];

    Object.keys(pattern.attributes).forEach((key) => {
      if (behavior[key] !== undefined) {
        const expected = pattern.attributes[key];
        const actual = behavior[key];

        if (expected === actual) {
          matchScore += 20;
          matchedAttributes.push(key);
        } else {
          const deviation = typeof expected === 'number' && typeof actual === 'number'
            ? Math.abs((actual - expected) / expected) * 100
            : 100;
          deviations.push({ attribute: key, expected, actual, deviation });
        }
      }
    });

    if (matchScore > 0 || deviations.length > 0) {
      results.push({
        patternId: pattern.id,
        patternType: pattern.patternType,
        matchScore: Math.min(100, matchScore),
        confidence: pattern.confidence,
        matchedAttributes,
        deviations,
      });
    }
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Detects sequential attack patterns across multiple events.
 *
 * @param {any[]} events - Security events
 * @param {number} timeWindow - Time window in milliseconds
 * @returns {AnomalyDetectionResult[]} Detected attack sequences
 *
 * @example
 * ```typescript
 * const sequences = detectSequentialPatterns(events, 300000); // 5 min window
 * ```
 */
export const detectSequentialPatterns = (events: any[], timeWindow: number): AnomalyDetectionResult[] => {
  const anomalies: AnomalyDetectionResult[] = [];
  const sequences: Map<string, any[]> = new Map();

  events.forEach((event, index) => {
    const key = event.userId || event.ip || 'unknown';
    const eventSeq = sequences.get(key) || [];
    eventSeq.push(event);
    sequences.set(key, eventSeq);
  });

  sequences.forEach((seq, entityId) => {
    if (seq.length < 3) return;

    // Check for suspicious sequences (e.g., failed login -> privilege escalation -> data access)
    for (let i = 0; i < seq.length - 2; i++) {
      const timeSpan = seq[i + 2].timestamp - seq[i].timestamp;
      if (timeSpan <= timeWindow) {
        anomalies.push({
          id: crypto.randomUUID(),
          timestamp: new Date(),
          detectionMethod: AnomalyDetectionMethod.PATTERN_BASED,
          anomalyType: AnomalyType.COLLECTIVE_ANOMALY,
          severity: AnomalySeverity.HIGH,
          anomalyScore: 75,
          confidence: 80,
          baselineDeviation: 0,
          affectedEntities: [entityId],
          indicators: [
            {
              type: 'sequence',
              value: seq.slice(i, i + 3).map((e) => e.type).join(' -> '),
              deviation: 0,
              weight: 1.0,
              confidence: 80,
            },
          ],
          explanation: `Detected suspicious event sequence within ${timeSpan}ms`,
          recommendedActions: ['Investigate event sequence', 'Check user credentials', 'Review access logs'],
          isFalsePositive: false,
        });
      }
    }
  });

  return anomalies;
};

/**
 * Detects attack chains using graph-based analysis.
 *
 * @param {any[]} events - Security events
 * @returns {AnomalyDetectionResult[]} Detected attack chains
 *
 * @example
 * ```typescript
 * const chains = detectAttackChains(securityEvents);
 * ```
 */
export const detectAttackChains = (events: any[]): AnomalyDetectionResult[] => {
  // Build event graph
  const graph: Map<string, Set<string>> = new Map();

  events.forEach((event) => {
    const source = event.sourceId || event.userId;
    const target = event.targetId || event.resource;

    if (!graph.has(source)) graph.set(source, new Set());
    graph.get(source)!.add(target);
  });

  const anomalies: AnomalyDetectionResult[] = [];

  // Detect chains with depth > 3
  graph.forEach((targets, source) => {
    if (targets.size > 3) {
      anomalies.push({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        detectionMethod: AnomalyDetectionMethod.PATTERN_BASED,
        anomalyType: AnomalyType.COLLECTIVE_ANOMALY,
        severity: AnomalySeverity.HIGH,
        anomalyScore: Math.min(100, targets.size * 15),
        confidence: 75,
        baselineDeviation: 0,
        affectedEntities: [source, ...Array.from(targets)],
        indicators: [
          {
            type: 'chain_length',
            value: targets.size,
            expectedValue: 2,
            deviation: targets.size - 2,
            weight: 1.0,
            confidence: 75,
          },
        ],
        explanation: `Detected attack chain with ${targets.size} connected targets`,
        recommendedActions: ['Investigate attack chain', 'Block suspicious source', 'Review target systems'],
        isFalsePositive: false,
      });
    }
  });

  return anomalies;
};

/**
 * Correlates security events for anomaly detection.
 *
 * @param {any[]} events - Security events
 * @param {number} correlationThreshold - Correlation threshold (0-1)
 * @returns {AnomalyDetectionResult[]} Correlated anomalies
 *
 * @example
 * ```typescript
 * const correlated = correlateSecurityEvents(events, 0.7);
 * ```
 */
export const correlateSecurityEvents = (events: any[], correlationThreshold: number): AnomalyDetectionResult[] => {
  const correlations: Map<string, any[]> = new Map();

  events.forEach((event) => {
    const key = `${event.type}_${event.severity}`;
    const group = correlations.get(key) || [];
    group.push(event);
    correlations.set(key, group);
  });

  const anomalies: AnomalyDetectionResult[] = [];

  correlations.forEach((group, key) => {
    if (group.length > 5) {
      const avgTimeInterval = group.length > 1
        ? (group[group.length - 1].timestamp - group[0].timestamp) / (group.length - 1)
        : 0;

      anomalies.push({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        detectionMethod: AnomalyDetectionMethod.PATTERN_BASED,
        anomalyType: AnomalyType.COLLECTIVE_ANOMALY,
        severity: AnomalySeverity.MEDIUM,
        anomalyScore: Math.min(100, group.length * 10),
        confidence: 70,
        baselineDeviation: 0,
        affectedEntities: group.map((e) => e.id),
        indicators: [
          {
            type: 'correlation',
            value: group.length,
            deviation: 0,
            weight: 1.0,
            confidence: 70,
          },
        ],
        explanation: `${group.length} correlated events of type ${key} detected`,
        recommendedActions: ['Investigate event correlation', 'Check for coordinated attack', 'Review patterns'],
        isFalsePositive: false,
      });
    }
  });

  return anomalies;
};

/**
 * Correlates events by time proximity.
 *
 * @param {any[]} events - Events to correlate
 * @param {number} timeWindow - Time window in milliseconds
 * @returns {Array<{events: any[], correlation: number}>} Correlated event groups
 *
 * @example
 * ```typescript
 * const correlated = correlateEventsByTime(events, 60000); // 1 minute
 * ```
 */
export const correlateEventsByTime = (
  events: any[],
  timeWindow: number
): Array<{ events: any[]; correlation: number }> => {
  const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);
  const groups: Array<{ events: any[]; correlation: number }> = [];

  let currentGroup: any[] = [];
  let groupStart = 0;

  sortedEvents.forEach((event) => {
    if (currentGroup.length === 0) {
      currentGroup.push(event);
      groupStart = event.timestamp;
    } else if (event.timestamp - groupStart <= timeWindow) {
      currentGroup.push(event);
    } else {
      if (currentGroup.length > 1) {
        groups.push({
          events: currentGroup,
          correlation: currentGroup.length / (event.timestamp - groupStart) * 1000,
        });
      }
      currentGroup = [event];
      groupStart = event.timestamp;
    }
  });

  return groups.filter((g) => g.events.length > 1);
};

/**
 * Detects causal correlations between events.
 *
 * @param {any[]} events - Events to analyze
 * @returns {Array<{cause: any, effect: any, confidence: number}>} Causal relationships
 *
 * @example
 * ```typescript
 * const causes = detectCausalCorrelations(securityEvents);
 * ```
 */
export const detectCausalCorrelations = (
  events: any[]
): Array<{ cause: any; effect: any; confidence: number }> => {
  const causalPairs: Array<{ cause: any; effect: any; confidence: number }> = [];

  for (let i = 0; i < events.length - 1; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const timeDiff = events[j].timestamp - events[i].timestamp;

      // Check for temporal precedence and logical connection
      if (timeDiff > 0 && timeDiff < 300000) {
        // 5 minutes
        const confidence = Math.max(0, 100 - (timeDiff / 3000)); // Decrease with time

        causalPairs.push({
          cause: events[i],
          effect: events[j],
          confidence,
        });
      }
    }
  }

  return causalPairs.sort((a, b) => b.confidence - a.confidence);
};

/**
 * Prepares feature vectors for ML-based anomaly detection.
 *
 * @param {any} data - Input data
 * @returns {Record<string, number>} Feature vector
 *
 * @example
 * ```typescript
 * const features = prepareMLFeatures(userActivity);
 * ```
 */
export const prepareMLFeatures = (data: any): Record<string, number> => {
  const features: Record<string, number> = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (typeof value === 'number') {
      features[key] = value;
    } else if (typeof value === 'boolean') {
      features[key] = value ? 1 : 0;
    } else if (typeof value === 'string') {
      features[`${key}_length`] = value.length;
      features[`${key}_hash`] = hashString(value);
    } else if (value instanceof Date) {
      features[`${key}_timestamp`] = value.getTime();
      features[`${key}_hour`] = value.getHours();
      features[`${key}_dayOfWeek`] = value.getDay();
    }
  });

  return features;
};

/**
 * Helper function to hash strings for feature engineering.
 */
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 1000;
};

/**
 * Performs real-time threat assessment combining multiple anomaly detection methods.
 *
 * @param {any} event - Security event
 * @param {BehaviorBaseline} baseline - Behavioral baseline
 * @param {BehaviorPattern[]} patterns - Known threat patterns
 * @returns {Promise<AnomalyDetectionResult>} Comprehensive assessment
 *
 * @example
 * ```typescript
 * const assessment = await performRealtimeThreatAssessment(event, baseline, patterns);
 * ```
 */
export const performRealtimeThreatAssessment = async (
  event: any,
  baseline: BehaviorBaseline,
  patterns: BehaviorPattern[]
): Promise<AnomalyDetectionResult> => {
  const results: Partial<AnomalyDetectionResult>[] = [];

  // Statistical analysis
  if (typeof event.value === 'number') {
    const deviation = calculateBaselineDeviation(event.value, baseline.metrics);
    if (Math.abs(deviation) > 30) {
      results.push({
        detectionMethod: AnomalyDetectionMethod.STATISTICAL,
        anomalyScore: Math.min(100, Math.abs(deviation)),
        confidence: baseline.confidence,
      });
    }
  }

  // Behavioral analysis
  const behaviorAnomaly = detectBehavioralAnomaly(event, baseline);
  if (behaviorAnomaly) {
    results.push(behaviorAnomaly);
  }

  // Pattern matching
  const patternMatches = matchThreatPatterns(event, patterns);
  if (patternMatches.length > 0) {
    results.push({
      detectionMethod: AnomalyDetectionMethod.PATTERN_BASED,
      anomalyScore: patternMatches[0].matchScore,
      confidence: patternMatches[0].confidence,
    });
  }

  // Composite score
  const compositeScore = calculateCompositeAnomalyScore(results);

  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    detectionMethod: AnomalyDetectionMethod.HYBRID,
    anomalyType: AnomalyType.BEHAVIOR_ANOMALY,
    severity: compositeScore > 80 ? AnomalySeverity.CRITICAL : compositeScore > 60 ? AnomalySeverity.HIGH : AnomalySeverity.MEDIUM,
    anomalyScore: compositeScore,
    confidence: Math.max(...results.map((r) => r.confidence || 0)),
    baselineDeviation: 0,
    affectedEntities: [event.userId || event.id],
    indicators: [],
    explanation: `Real-time assessment detected anomaly with composite score ${compositeScore.toFixed(1)}`,
    recommendedActions: [
      'Immediate investigation required',
      'Review user activity',
      'Check for compromise',
    ],
    isFalsePositive: false,
  };
};

/**
 * Calculates dynamic threat score based on current context and history.
 *
 * @param {any} threat - Threat data
 * @param {any[]} history - Historical threats
 * @returns {Promise<number>} Dynamic threat score
 *
 * @example
 * ```typescript
 * const score = await calculateDynamicThreatScore(currentThreat, threatHistory);
 * ```
 */
export const calculateDynamicThreatScore = async (threat: any, history: any[]): Promise<number> => {
  let score = 50; // Base score

  // Increase score based on severity
  if (threat.severity === 'CRITICAL') score += 30;
  else if (threat.severity === 'HIGH') score += 20;
  else if (threat.severity === 'MEDIUM') score += 10;

  // Increase score based on recency of similar threats
  const recentSimilar = history.filter(
    (h) => h.type === threat.type && Date.now() - h.timestamp < 86400000
  ).length;
  score += Math.min(20, recentSimilar * 5);

  return Math.min(100, score);
};

/**
 * Aggregates multiple threat scores using weighted averaging.
 *
 * @param {Array<{score: number, weight: number}>} scores - Scores with weights
 * @returns {number} Aggregated score
 *
 * @example
 * ```typescript
 * const aggregated = aggregateThreatScores([{score: 80, weight: 0.5}, {score: 60, weight: 0.3}]);
 * ```
 */
export const aggregateThreatScores = (scores: Array<{ score: number; weight: number }>): number => {
  const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
  const weightedSum = scores.reduce((sum, s) => sum + s.score * s.weight, 0);
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};

/**
 * Updates anomaly baseline with feedback from false positive marking.
 *
 * @param {string} anomalyId - Anomaly identifier
 * @param {boolean} isFalsePositive - Whether it's a false positive
 * @param {BehaviorBaseline} baseline - Current baseline
 * @returns {BehaviorBaseline} Updated baseline
 *
 * @example
 * ```typescript
 * const updated = updateAnomalyBaseline(anomalyId, true, baseline);
 * ```
 */
export const updateAnomalyBaseline = (
  anomalyId: string,
  isFalsePositive: boolean,
  baseline: BehaviorBaseline
): BehaviorBaseline => {
  const adjustment = isFalsePositive ? -2 : 1;
  return {
    ...baseline,
    confidence: Math.max(0, Math.min(100, baseline.confidence + adjustment)),
    lastUpdated: new Date(),
  };
};

/**
 * Identifies behavioral anomalies in user activity patterns.
 *
 * @param {any[]} activities - User activities
 * @param {BehaviorBaseline} baseline - User baseline
 * @returns {AnomalyDetectionResult[]} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = identifyBehaviorAnomalies(userActivities, userBaseline);
 * ```
 */
export const identifyBehaviorAnomalies = (
  activities: any[],
  baseline: BehaviorBaseline
): AnomalyDetectionResult[] => {
  const anomalies: AnomalyDetectionResult[] = [];

  activities.forEach((activity) => {
    const anomaly = detectBehavioralAnomaly(activity, baseline);
    if (anomaly) {
      anomalies.push(anomaly);
    }
  });

  return anomalies;
};

/**
 * Calculates baseline metrics from data samples.
 *
 * @param {number[]} samples - Data samples
 * @returns {BaselineMetrics} Calculated metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateBaselineMetrics(dataSamples);
 * ```
 */
export const calculateBaselineMetrics = (samples: number[]): BaselineMetrics => {
  const sorted = [...samples].sort((a, b) => a - b);
  const mean = samples.reduce((sum, val) => sum + val, 0) / samples.length;
  const variance = samples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / samples.length;

  return {
    mean,
    median: sorted[Math.floor(sorted.length / 2)],
    standardDeviation: Math.sqrt(variance),
    variance,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    percentile25: sorted[Math.floor(sorted.length * 0.25)],
    percentile75: sorted[Math.floor(sorted.length * 0.75)],
    percentile95: sorted[Math.floor(sorted.length * 0.95)],
    percentile99: sorted[Math.floor(sorted.length * 0.99)],
  };
};

/**
 * Analyzes user behavior for anomalies.
 *
 * @param {string} userId - User identifier
 * @param {any[]} activities - User activities
 * @param {BehaviorBaseline} baseline - User baseline
 * @returns {Promise<AnomalyDetectionResult[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await analyzeUserBehavior('user123', activities, baseline);
 * ```
 */
export const analyzeUserBehavior = async (
  userId: string,
  activities: any[],
  baseline: BehaviorBaseline
): Promise<AnomalyDetectionResult[]> => {
  return identifyBehaviorAnomalies(activities, baseline);
};

/**
 * Analyzes entity behavior for security threats.
 *
 * @param {string} entityId - Entity identifier
 * @param {string} entityType - Entity type
 * @param {any[]} activities - Entity activities
 * @param {BehaviorBaseline} baseline - Entity baseline
 * @returns {Promise<AnomalyDetectionResult[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await analyzeEntityBehavior('device123', 'DEVICE', activities, baseline);
 * ```
 */
export const analyzeEntityBehavior = async (
  entityId: string,
  entityType: string,
  activities: any[],
  baseline: BehaviorBaseline
): Promise<AnomalyDetectionResult[]> => {
  return identifyBehaviorAnomalies(activities, baseline);
};

/**
 * Tracks behavior changes over time.
 *
 * @param {any[]} oldBehavior - Previous behavior
 * @param {any[]} newBehavior - Current behavior
 * @returns {Record<string, number>} Change metrics
 *
 * @example
 * ```typescript
 * const changes = trackBehaviorChanges(previousActivities, currentActivities);
 * ```
 */
export const trackBehaviorChanges = (oldBehavior: any[], newBehavior: any[]): Record<string, number> => {
  return {
    activityCountChange: newBehavior.length - oldBehavior.length,
    activityRateChange: (newBehavior.length / oldBehavior.length - 1) * 100,
  };
};

/**
 * Compares two behavior profiles.
 *
 * @param {BehaviorBaseline} profile1 - First profile
 * @param {BehaviorBaseline} profile2 - Second profile
 * @returns {Record<string, number>} Comparison metrics
 *
 * @example
 * ```typescript
 * const comparison = compareBehaviorProfiles(baseline1, baseline2);
 * ```
 */
export const compareBehaviorProfiles = (
  profile1: BehaviorBaseline,
  profile2: BehaviorBaseline
): Record<string, number> => {
  return {
    meanDifference: profile2.metrics.mean - profile1.metrics.mean,
    stdDevDifference: profile2.metrics.standardDeviation - profile1.metrics.standardDeviation,
  };
};

/**
 * Calculates behavior risk score.
 *
 * @param {any} behavior - Behavior data
 * @returns {number} Risk score (0-100)
 *
 * @example
 * ```typescript
 * const risk = calculateBehaviorScore(userBehavior);
 * ```
 */
export const calculateBehaviorScore = (behavior: any): number => {
  let score = 0;

  if (behavior.failedLoginAttempts > 5) score += 30;
  if (behavior.unusualAccessTime) score += 20;
  if (behavior.suspiciousLocation) score += 25;
  if (behavior.dataExfiltration) score += 25;

  return Math.min(100, score);
};

/**
 * Normalizes anomaly scores to 0-100 range.
 *
 * @param {number[]} scores - Raw scores
 * @returns {number[]} Normalized scores
 *
 * @example
 * ```typescript
 * const normalized = normalizeAnomalyScores(rawScores);
 * ```
 */
export const normalizeAnomalyScores = (scores: number[]): number[] => {
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = max - min;

  if (range === 0) return scores.map(() => 50);

  return scores.map((score) => ((score - min) / range) * 100);
};

/**
 * Calculates Z-score for statistical anomaly detection.
 *
 * @param {number} value - Value to analyze
 * @param {number} mean - Mean of distribution
 * @param {number} stdDev - Standard deviation
 * @returns {number} Z-score
 *
 * @example
 * ```typescript
 * const zScore = calculateZScore(150, 100, 20);
 * ```
 */
export const calculateZScore = (value: number, mean: number, stdDev: number): number => {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
};

/**
 * Calculates P-value from Z-score.
 *
 * @param {number} zScore - Z-score
 * @returns {number} P-value
 *
 * @example
 * ```typescript
 * const pValue = calculatePValue(2.5);
 * ```
 */
export const calculatePValue = (zScore: number): number => {
  return 1 - 0.5 * (1 + Math.erf(Math.abs(zScore) / Math.sqrt(2)));
};

/**
 * Determines anomaly severity based on score.
 *
 * @param {number} anomalyScore - Anomaly score
 * @returns {AnomalySeverity} Severity level
 *
 * @example
 * ```typescript
 * const severity = determineAnomalySeverity(85);
 * ```
 */
export const determineAnomalySeverity = (anomalyScore: number): AnomalySeverity => {
  if (anomalyScore >= 90) return AnomalySeverity.CRITICAL;
  if (anomalyScore >= 70) return AnomalySeverity.HIGH;
  if (anomalyScore >= 50) return AnomalySeverity.MEDIUM;
  if (anomalyScore >= 30) return AnomalySeverity.LOW;
  return AnomalySeverity.INFO;
};

/**
 * Generates anomaly detection report.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Detected anomalies
 * @returns {Record<string, any>} Report summary
 *
 * @example
 * ```typescript
 * const report = generateAnomalyReport(detectedAnomalies);
 * ```
 */
export const generateAnomalyReport = (anomalies: AnomalyDetectionResult[]): Record<string, any> => {
  return {
    totalAnomalies: anomalies.length,
    criticalCount: anomalies.filter((a) => a.severity === AnomalySeverity.CRITICAL).length,
    highCount: anomalies.filter((a) => a.severity === AnomalySeverity.HIGH).length,
    mediumCount: anomalies.filter((a) => a.severity === AnomalySeverity.MEDIUM).length,
    lowCount: anomalies.filter((a) => a.severity === AnomalySeverity.LOW).length,
    avgAnomalyScore: anomalies.reduce((sum, a) => sum + a.anomalyScore, 0) / anomalies.length,
    avgConfidence: anomalies.reduce((sum, a) => sum + a.confidence, 0) / anomalies.length,
    methods: [...new Set(anomalies.map((a) => a.detectionMethod))],
    types: [...new Set(anomalies.map((a) => a.anomalyType))],
  };
};

/**
 * Filters anomalies by severity level.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to filter
 * @param {AnomalySeverity} minSeverity - Minimum severity level
 * @returns {AnomalyDetectionResult[]} Filtered anomalies
 *
 * @example
 * ```typescript
 * const critical = filterAnomaliesBySeverity(anomalies, AnomalySeverity.HIGH);
 * ```
 */
export const filterAnomaliesBySeverity = (
  anomalies: AnomalyDetectionResult[],
  minSeverity: AnomalySeverity
): AnomalyDetectionResult[] => {
  const severityOrder = {
    [AnomalySeverity.CRITICAL]: 5,
    [AnomalySeverity.HIGH]: 4,
    [AnomalySeverity.MEDIUM]: 3,
    [AnomalySeverity.LOW]: 2,
    [AnomalySeverity.INFO]: 1,
  };

  const threshold = severityOrder[minSeverity];
  return anomalies.filter((a) => severityOrder[a.severity] >= threshold);
};

/**
 * Groups anomalies by type.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to group
 * @returns {Map<AnomalyType, AnomalyDetectionResult[]>} Grouped anomalies
 *
 * @example
 * ```typescript
 * const grouped = groupAnomaliesByType(anomalies);
 * ```
 */
export const groupAnomaliesByType = (
  anomalies: AnomalyDetectionResult[]
): Map<AnomalyType, AnomalyDetectionResult[]> => {
  const groups = new Map<AnomalyType, AnomalyDetectionResult[]>();

  anomalies.forEach((anomaly) => {
    const group = groups.get(anomaly.anomalyType) || [];
    group.push(anomaly);
    groups.set(anomaly.anomalyType, group);
  });

  return groups;
};

/**
 * Calculates anomaly detection accuracy metrics.
 *
 * @param {AnomalyDetectionResult[]} detectedAnomalies - Detected anomalies
 * @param {string[]} actualAnomalyIds - Known true anomaly IDs
 * @returns {Record<string, number>} Accuracy metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateDetectionAccuracy(detected, actualIds);
 * ```
 */
export const calculateDetectionAccuracy = (
  detectedAnomalies: AnomalyDetectionResult[],
  actualAnomalyIds: string[]
): Record<string, number> => {
  const detectedIds = new Set(detectedAnomalies.map((a) => a.id));
  const actualIds = new Set(actualAnomalyIds);

  const truePositives = detectedAnomalies.filter((a) => actualIds.has(a.id)).length;
  const falsePositives = detectedAnomalies.filter((a) => !actualIds.has(a.id)).length;
  const falseNegatives = actualAnomalyIds.filter((id) => !detectedIds.has(id)).length;

  const precision = truePositives / (truePositives + falsePositives) || 0;
  const recall = truePositives / (truePositives + falseNegatives) || 0;
  const f1Score = (2 * precision * recall) / (precision + recall) || 0;

  return {
    precision,
    recall,
    f1Score,
    accuracy: truePositives / (truePositives + falsePositives + falseNegatives) || 0,
  };
};

/**
 * Merges overlapping anomaly detection results.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to merge
 * @param {number} timeWindowMs - Time window for merging
 * @returns {AnomalyDetectionResult[]} Merged anomalies
 *
 * @example
 * ```typescript
 * const merged = mergeOverlappingAnomalies(anomalies, 60000);
 * ```
 */
export const mergeOverlappingAnomalies = (
  anomalies: AnomalyDetectionResult[],
  timeWindowMs: number
): AnomalyDetectionResult[] => {
  const sorted = [...anomalies].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const merged: AnomalyDetectionResult[] = [];
  let current: AnomalyDetectionResult | null = null;

  sorted.forEach((anomaly) => {
    if (!current) {
      current = { ...anomaly };
    } else if (anomaly.timestamp.getTime() - current.timestamp.getTime() <= timeWindowMs) {
      current.anomalyScore = Math.max(current.anomalyScore, anomaly.anomalyScore);
      current.confidence = (current.confidence + anomaly.confidence) / 2;
      current.indicators.push(...anomaly.indicators);
    } else {
      merged.push(current);
      current = { ...anomaly };
    }
  });

  if (current) merged.push(current);
  return merged;
};

/**
 * Prioritizes anomalies for investigation.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to prioritize
 * @returns {AnomalyDetectionResult[]} Prioritized anomalies
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeAnomalies(anomalies);
 * ```
 */
export const prioritizeAnomalies = (anomalies: AnomalyDetectionResult[]): AnomalyDetectionResult[] => {
  return [...anomalies].sort((a, b) => {
    if (a.severity !== b.severity) {
      const order = {
        [AnomalySeverity.CRITICAL]: 5,
        [AnomalySeverity.HIGH]: 4,
        [AnomalySeverity.MEDIUM]: 3,
        [AnomalySeverity.LOW]: 2,
        [AnomalySeverity.INFO]: 1,
      };
      return order[b.severity] - order[a.severity];
    }
    return b.anomalyScore - a.anomalyScore;
  });
};

/**
 * Exports anomaly data for external analysis.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to export
 * @param {string} format - Export format
 * @returns {string} Exported data
 *
 * @example
 * ```typescript
 * const csv = exportAnomalyData(anomalies, 'csv');
 * ```
 */
export const exportAnomalyData = (anomalies: AnomalyDetectionResult[], format: 'json' | 'csv'): string => {
  if (format === 'json') {
    return JSON.stringify(anomalies, null, 2);
  }

  // CSV format
  const headers = ['id', 'timestamp', 'type', 'severity', 'score', 'confidence'];
  const rows = anomalies.map((a) =>
    [a.id, a.timestamp.toISOString(), a.anomalyType, a.severity, a.anomalyScore, a.confidence].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
};

/**
 * Calculates moving average for anomaly scores.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies with scores
 * @param {number} windowSize - Window size for moving average
 * @returns {number[]} Moving averages
 *
 * @example
 * ```typescript
 * const movingAvg = calculateAnomalyMovingAverage(anomalies, 5);
 * ```
 */
export const calculateAnomalyMovingAverage = (
  anomalies: AnomalyDetectionResult[],
  windowSize: number
): number[] => {
  const scores = anomalies.map((a) => a.anomalyScore);
  const result: number[] = [];

  for (let i = 0; i < scores.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = scores.slice(start, i + 1);
    const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
    result.push(avg);
  }

  return result;
};

/**
 * Detects anomaly trends over time.
 *
 * @param {AnomalyDetectionResult[]} historicalAnomalies - Historical anomalies
 * @returns {Record<string, any>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = detectAnomalyTrends(anomalies);
 * ```
 */
export const detectAnomalyTrends = (
  historicalAnomalies: AnomalyDetectionResult[]
): Record<string, any> => {
  const sorted = [...historicalAnomalies].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const first = sorted.slice(0, Math.floor(sorted.length / 2));
  const second = sorted.slice(Math.floor(sorted.length / 2));

  const firstAvg = first.reduce((sum, a) => sum + a.anomalyScore, 0) / first.length;
  const secondAvg = second.reduce((sum, a) => sum + a.anomalyScore, 0) / second.length;

  const trend = secondAvg > firstAvg ? 'INCREASING' : secondAvg < firstAvg ? 'DECREASING' : 'STABLE';
  const changeRate = ((secondAvg - firstAvg) / firstAvg) * 100;

  return {
    trend,
    changeRate,
    firstPeriodAvg: firstAvg,
    secondPeriodAvg: secondAvg,
    totalAnomalies: sorted.length,
  };
};

// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================

/**
 * Anomaly Detection Service
 * Production-ready NestJS service for anomaly detection operations
 */
@Injectable()
export class AnomalyDetectionService {
  /**
   * Performs comprehensive anomaly detection
   */
  async detectAnomalies(
    data: any[],
    config: AnomalyDetectionConfig
  ): Promise<AnomalyDetectionResult[]> {
    const anomalies: AnomalyDetectionResult[] = [];

    switch (config.detectionMethod) {
      case AnomalyDetectionMethod.STATISTICAL:
        const numericData = data.filter((d) => typeof d === 'number');
        anomalies.push(...detectStatisticalAnomalies(numericData, config.thresholds.zScore));
        break;

      case AnomalyDetectionMethod.TEMPORAL:
        anomalies.push(...detectTemporalAnomalies(data));
        break;

      case AnomalyDetectionMethod.PATTERN_BASED:
        anomalies.push(...detectSequentialPatterns(data, 300000));
        break;

      default:
        throw new Error(`Unsupported detection method: ${config.detectionMethod}`);
    }

    return anomalies;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  AnomalyDetectionConfigModel,
  AnomalyDetectionResultModel,
  BehaviorBaselineModel,

  // Core Functions
  detectStatisticalAnomalies,
  detectBehavioralAnomaly,
  detectTemporalAnomalies,
  calculateCompositeAnomalyScore,
  createBehaviorBaseline,
  updateBehaviorBaseline,
  calculateBaselineDeviation,
  detectBaselineDeviation,
  adaptiveBaselineLearning,
  matchThreatPatterns,
  detectSequentialPatterns,
  detectAttackChains,
  correlateSecurityEvents,
  correlateEventsByTime,
  detectCausalCorrelations,
  prepareMLFeatures,
  performRealtimeThreatAssessment,
  calculateDynamicThreatScore,
  aggregateThreatScores,
  updateAnomalyBaseline,
  identifyBehaviorAnomalies,
  calculateBaselineMetrics,
  analyzeUserBehavior,
  analyzeEntityBehavior,
  trackBehaviorChanges,
  compareBehaviorProfiles,
  calculateBehaviorScore,
  normalizeAnomalyScores,
  calculateZScore,
  calculatePValue,
  determineAnomalySeverity,
  generateAnomalyReport,
  filterAnomaliesBySeverity,
  groupAnomaliesByType,
  calculateDetectionAccuracy,
  mergeOverlappingAnomalies,
  prioritizeAnomalies,
  exportAnomalyData,
  calculateAnomalyMovingAverage,
  detectAnomalyTrends,

  // Services
  AnomalyDetectionService,
};
