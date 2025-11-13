/**
 * @fileoverview Performance Analytics Interfaces
 * @module academic-transcript/interfaces/performance-analytics.interface
 * @description Type-safe interfaces for academic performance analytics
 */

/**
 * Trend direction enumeration
 */
export type TrendDirection = 'improving' | 'declining' | 'stable';

/**
 * Metric trend analysis
 */
export interface MetricTrend {
  current: number;
  average: number;
  trend: TrendDirection;
}

/**
 * Academic performance trend analysis
 */
export interface PerformanceTrendAnalysis {
  gpa: MetricTrend;
  attendance: MetricTrend;
  recommendations: string[];
}

/**
 * Insufficient data response
 */
export interface InsufficientDataResponse {
  trend: 'insufficient_data';
  message: string;
}

/**
 * Union type for performance analysis results
 */
export type PerformanceAnalysisResult =
  | PerformanceTrendAnalysis
  | InsufficientDataResponse;
