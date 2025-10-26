/**
 * Outbreak Detection Types
 *
 * Types for illness trend analysis, outbreak spike detection, and public health monitoring.
 * Critical for public health safety and epidemic response.
 *
 * @module types/clinical/outbreakDetection
 * @category Clinical
 */

import { z } from 'zod';
import type { BaseEntity, ApiResponse, PaginatedResponse } from '../common';

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

/**
 * Outbreak severity classification
 */
export enum OutbreakSeverity {
  /** Elevated - monitor */
  ELEVATED = 'ELEVATED',
  /** Moderate - investigate */
  MODERATE = 'MODERATE',
  /** High - intervene */
  HIGH = 'HIGH',
  /** Critical - emergency response */
  CRITICAL = 'CRITICAL',
}

/**
 * Type of health trend
 */
export enum TrendType {
  /** Increasing trend */
  INCREASING = 'INCREASING',
  /** Decreasing trend */
  DECREASING = 'DECREASING',
  /** Stable trend */
  STABLE = 'STABLE',
  /** Spike detected */
  SPIKE = 'SPIKE',
  /** Unusual pattern */
  ANOMALY = 'ANOMALY',
}

/**
 * Detection algorithm used
 */
export enum DetectionAlgorithm {
  /** Statistical threshold */
  THRESHOLD = 'THRESHOLD',
  /** Moving average */
  MOVING_AVERAGE = 'MOVING_AVERAGE',
  /** Standard deviation */
  STANDARD_DEVIATION = 'STANDARD_DEVIATION',
  /** Exponential smoothing */
  EXPONENTIAL_SMOOTHING = 'EXPONENTIAL_SMOOTHING',
  /** Machine learning */
  MACHINE_LEARNING = 'MACHINE_LEARNING',
}

/**
 * Outbreak status
 */
export enum OutbreakStatus {
  /** Detected, under investigation */
  DETECTED = 'DETECTED',
  /** Confirmed outbreak */
  CONFIRMED = 'CONFIRMED',
  /** False alarm */
  FALSE_ALARM = 'FALSE_ALARM',
  /** Contained */
  CONTAINED = 'CONTAINED',
  /** Resolved */
  RESOLVED = 'RESOLVED',
}

/**
 * Condition category for outbreak tracking
 */
export enum ConditionCategory {
  RESPIRATORY = 'RESPIRATORY',
  GASTROINTESTINAL = 'GASTROINTESTINAL',
  SKIN = 'SKIN',
  INFECTIOUS_DISEASE = 'INFECTIOUS_DISEASE',
  ALLERGIC_REACTION = 'ALLERGIC_REACTION',
  INJURY = 'INJURY',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  OTHER = 'OTHER',
}

// ============================================================================
// DOMAIN MODEL INTERFACES
// ============================================================================

/**
 * Outbreak Alert
 *
 * Alert generated when outbreak detection algorithm identifies a spike.
 *
 * @property {string} condition - Condition/illness name
 * @property {ConditionCategory} category - Condition category
 * @property {OutbreakSeverity} severity - Alert severity
 * @property {OutbreakStatus} status - Current status
 * @property {string} detectedAt - ISO timestamp of detection
 * @property {DetectionAlgorithm} algorithm - Algorithm that detected outbreak
 * @property {number} affectedCount - Number of affected students
 * @property {number} baselineCount - Baseline/expected count
 * @property {number} threshold - Threshold that was exceeded
 * @property {number} percentageIncrease - Percentage increase from baseline
 * @property {string} [schoolId] - Affected school ID (null for district-wide)
 * @property {string} [grade] - Affected grade level
 * @property {string} [classroomId] - Affected classroom ID
 * @property {string} dateRange - Time period analyzed
 * @property {string} description - Description of outbreak
 * @property {string[]} affectedStudentIds - IDs of affected students
 * @property {string} [investigatedBy] - User investigating
 * @property {string} [confirmedBy] - User who confirmed outbreak
 * @property {string} [confirmedAt] - ISO timestamp of confirmation
 * @property {string} [containedAt] - ISO timestamp of containment
 * @property {string} [resolvedAt] - ISO timestamp of resolution
 * @property {string[]} interventions - Interventions taken
 * @property {string} [publicHealthNotified] - Whether health dept notified
 * @property {string} [notificationDate] - Date health dept notified
 * @property {Record<string, any>} [metadata] - Additional data
 */
export interface OutbreakAlert extends BaseEntity {
  condition: string;
  category: ConditionCategory;
  severity: OutbreakSeverity;
  status: OutbreakStatus;
  detectedAt: string;
  algorithm: DetectionAlgorithm;
  affectedCount: number;
  baselineCount: number;
  threshold: number;
  percentageIncrease: number;
  schoolId?: string | null;
  grade?: string | null;
  classroomId?: string | null;
  dateRange: string;
  description: string;
  affectedStudentIds: string[];
  investigatedBy?: string | null;
  confirmedBy?: string | null;
  confirmedAt?: string | null;
  containedAt?: string | null;
  resolvedAt?: string | null;
  interventions: string[];
  publicHealthNotified: boolean;
  notificationDate?: string | null;
  metadata?: Record<string, any> | null;
}

/**
 * Health Trend
 *
 * Statistical trend analysis for a specific condition.
 *
 * @property {string} condition - Condition being tracked
 * @property {ConditionCategory} category - Condition category
 * @property {TrendType} trendType - Type of trend
 * @property {string} startDate - Start of analysis period
 * @property {string} endDate - End of analysis period
 * @property {number} currentCount - Current case count
 * @property {number} previousCount - Previous period count
 * @property {number} averageCount - Historical average
 * @property {number} changePercentage - Percentage change
 * @property {number} zScore - Statistical z-score
 * @property {boolean} isSignificant - Statistically significant
 * @property {number} confidence - Confidence level (0-1)
 * @property {Array<{date: string; count: number}>} timeSeries - Time series data
 */
export interface HealthTrend extends BaseEntity {
  condition: string;
  category: ConditionCategory;
  trendType: TrendType;
  startDate: string;
  endDate: string;
  currentCount: number;
  previousCount: number;
  averageCount: number;
  changePercentage: number;
  zScore: number;
  isSignificant: boolean;
  confidence: number;
  timeSeries: Array<{ date: string; count: number }>;
}

/**
 * Spike Detection Result
 *
 * Result of spike detection analysis.
 *
 * @property {string} condition - Condition analyzed
 * @property {DetectionAlgorithm} algorithm - Algorithm used
 * @property {boolean} spikeDetected - Whether spike was detected
 * @property {number} observedValue - Observed value
 * @property {number} expectedValue - Expected value
 * @property {number} threshold - Detection threshold
 * @property {number} deviationScore - Deviation score
 * @property {number} pValue - Statistical p-value
 * @property {string} analyzedAt - ISO timestamp of analysis
 * @property {Record<string, any>} algorithmParams - Algorithm parameters used
 */
export interface SpikeDetection {
  condition: string;
  algorithm: DetectionAlgorithm;
  spikeDetected: boolean;
  observedValue: number;
  expectedValue: number;
  threshold: number;
  deviationScore: number;
  pValue: number;
  analyzedAt: string;
  algorithmParams: Record<string, any>;
}

/**
 * Visit Pattern Analysis
 *
 * Analysis of clinic visit patterns.
 */
export interface VisitPattern {
  timeframe: string;
  totalVisits: number;
  uniqueStudents: number;
  topConditions: Array<{ condition: string; count: number; percentage: number }>;
  visitsByDayOfWeek: Record<string, number>;
  visitsByHourOfDay: Record<number, number>;
  averageVisitDuration: number;
  peakTimes: Array<{ time: string; visitCount: number }>;
}

/**
 * Outbreak Configuration
 *
 * Configuration for outbreak detection system.
 */
export interface OutbreakConfig extends BaseEntity {
  conditionCategory: ConditionCategory;
  algorithm: DetectionAlgorithm;
  enabled: boolean;
  thresholdMultiplier: number;
  minimumCases: number;
  timeWindowDays: number;
  alertSeverityRules: Record<string, OutbreakSeverity>;
  autoNotifyPublicHealth: boolean;
  notificationRecipients: string[];
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Request to run outbreak detection
 */
export interface RunOutbreakDetectionRequest {
  conditions?: string[];
  categories?: ConditionCategory[];
  algorithm?: DetectionAlgorithm;
  startDate: string;
  endDate: string;
  schoolId?: string;
  grade?: string;
}

/**
 * Request to analyze health trends
 */
export interface AnalyzeTrendsRequest {
  conditions?: string[];
  categories?: ConditionCategory[];
  startDate: string;
  endDate: string;
  compareWith?: 'PREVIOUS_PERIOD' | 'LAST_YEAR' | 'BASELINE';
  schoolId?: string;
}

/**
 * Request to update outbreak status
 */
export interface UpdateOutbreakStatusRequest {
  status: OutbreakStatus;
  interventions?: string[];
  publicHealthNotified?: boolean;
  notes?: string;
}

/**
 * Filters for outbreak alerts
 */
export interface OutbreakAlertFilters {
  severity?: OutbreakSeverity;
  status?: OutbreakStatus;
  category?: ConditionCategory;
  condition?: string;
  startDate?: string;
  endDate?: string;
  schoolId?: string;
  page?: number;
  limit?: number;
}

/**
 * Response types
 */
export type OutbreakAlertsResponse = PaginatedResponse<OutbreakAlert>;
export type OutbreakAlertResponse = ApiResponse<OutbreakAlert>;
export type HealthTrendsResponse = ApiResponse<HealthTrend[]>;
export type SpikeDetectionResponse = ApiResponse<SpikeDetection[]>;
export type VisitPatternResponse = ApiResponse<VisitPattern>;

// ============================================================================
// FORM VALIDATION SCHEMAS (ZOD)
// ============================================================================

export const RunOutbreakDetectionSchema = z.object({
  conditions: z.array(z.string()).optional(),
  categories: z.array(z.nativeEnum(ConditionCategory)).optional(),
  algorithm: z.nativeEnum(DetectionAlgorithm).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  schoolId: z.string().uuid().optional(),
  grade: z.string().optional(),
});

export const AnalyzeTrendsSchema = z.object({
  conditions: z.array(z.string()).optional(),
  categories: z.array(z.nativeEnum(ConditionCategory)).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  compareWith: z.enum(['PREVIOUS_PERIOD', 'LAST_YEAR', 'BASELINE']).optional(),
  schoolId: z.string().uuid().optional(),
});

export const UpdateOutbreakStatusSchema = z.object({
  status: z.nativeEnum(OutbreakStatus),
  interventions: z.array(z.string()).optional(),
  publicHealthNotified: z.boolean().optional(),
  notes: z.string().max(2000).optional(),
});

// ============================================================================
// REDUX STATE TYPES
// ============================================================================

export interface OutbreakDetectionState {
  alerts: OutbreakAlert[];
  trends: HealthTrend[];
  selectedAlert: OutbreakAlert | null;
  visitPatterns: VisitPattern | null;
  loading: boolean;
  error: string | null;
  filters: OutbreakAlertFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface OutbreakDashboardProps {
  onViewAlert?: (alert: OutbreakAlert) => void;
  onRunDetection?: () => void;
  autoRefresh?: boolean;
}

export interface OutbreakAlertCardProps {
  alert: OutbreakAlert;
  onInvestigate?: () => void;
  onConfirm?: () => void;
  onResolve?: () => void;
  showActions?: boolean;
}

export interface TrendChartProps {
  trend: HealthTrend;
  showProjection?: boolean;
  height?: number;
}

export interface VisitPatternVisualizationProps {
  pattern: VisitPattern;
  visualizationType?: 'heatmap' | 'line' | 'bar';
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isCriticalOutbreak(alert: OutbreakAlert): boolean {
  return alert.severity === OutbreakSeverity.CRITICAL;
}

export function isActiveOutbreak(alert: OutbreakAlert): boolean {
  return [OutbreakStatus.DETECTED, OutbreakStatus.CONFIRMED].includes(alert.status);
}

export function isSignificantTrend(trend: HealthTrend): boolean {
  return trend.isSignificant && Math.abs(trend.changePercentage) > 20;
}

export function requiresPublicHealthNotification(alert: OutbreakAlert): boolean {
  return (
    alert.severity >= OutbreakSeverity.HIGH &&
    alert.status === OutbreakStatus.CONFIRMED &&
    !alert.publicHealthNotified
  );
}
