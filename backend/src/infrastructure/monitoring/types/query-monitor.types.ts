/**
 * @fileoverview Query Monitor Types
 * @module infrastructure/monitoring/types
 * @description Type definitions for query performance monitoring
 */

export interface QueryDetails {
  sql?: string;
  type?: string;
  table?: string;
  [key: string]: unknown;
}

export interface QueryMetrics {
  querySignature: string;
  count: number;
  totalDuration: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  p50Duration: number;
  p95Duration: number;
  p99Duration: number;
  lastExecuted: Date;
  isSlowQuery: boolean;
}

export interface SlowQuery {
  sql: string;
  duration: number;
  model?: string;
  timestamp: Date;
  stackTrace?: string;
}

export interface N1QueryDetection {
  pattern: string;
  occurrences: number;
  withinTimeWindow: number; // ms
  likelyN1: boolean;
  affectedModel?: string;
  timestamp: Date;
}

export interface PerformanceAlert {
  type: 'slow_query' | 'n1_detected' | 'performance_degradation' | 'high_query_rate';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  details: QueryDetails;
  timestamp: Date;
}

export interface PerformanceReport {
  totalQueries: number;
  slowQueries: number;
  avgQueryTime: number;
  p50QueryTime: number;
  p95QueryTime: number;
  p99QueryTime: number;
  queryDistribution: {
    fast: number;    // < 100ms
    medium: number;  // 100-500ms
    slow: number;    // 500-1000ms
    verySlow: number; // > 1000ms
  };
  topSlowQueries: SlowQuery[];
  topFrequentQueries: QueryMetrics[];
  n1Detections: N1QueryDetection[];
  alerts: PerformanceAlert[];
  periodStart: Date;
  periodEnd: Date;
}

export interface QueryExecution {
  signature: string;
  duration: number;
  timestamp: Date;
}
