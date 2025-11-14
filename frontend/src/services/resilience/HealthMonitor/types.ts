/**
 * @fileoverview Health Monitor Type Definitions
 * @module services/resilience/HealthMonitor/types
 * @category Resilience Services
 *
 * Core type definitions for the Health Monitor system including health metrics,
 * degradation alerts, and configuration interfaces.
 */

import { ResilienceEvent } from '../types';

/**
 * Health status and metrics for a specific endpoint
 */
export interface EndpointHealth {
  /** Endpoint URL or identifier */
  endpoint: string;
  /** Total number of requests made to this endpoint */
  totalRequests: number;
  /** Number of successful requests */
  successfulRequests: number;
  /** Number of failed requests */
  failedRequests: number;
  /** Number of requests that timed out */
  timeoutRequests: number;
  /** Success rate (0-1) */
  successRate: number;
  /** Failure rate (0-1) */
  failureRate: number;
  /** Timestamp of last request */
  lastRequestTime: number;
  /** Average response time in milliseconds */
  avgResponseTime: number;
  /** 95th percentile response time in milliseconds */
  p95ResponseTime: number;
  /** 99th percentile response time in milliseconds */
  p99ResponseTime: number;
  /** Whether the endpoint is currently degraded */
  isDegraded: boolean;
  /** Reason for degradation (if isDegraded is true) */
  degradationReason?: string;
}

/**
 * Degradation alert types
 */
export type DegradationType = 'highFailureRate' | 'slowResponse' | 'highTimeout';

/**
 * Alert severity levels
 */
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Degradation alert information
 */
export interface DegradationAlert {
  /** Endpoint that triggered the alert */
  endpoint: string;
  /** Type of degradation detected */
  type: DegradationType;
  /** Severity level of the alert */
  severity: AlertSeverity;
  /** Human-readable alert message */
  message: string;
  /** Timestamp when alert was generated */
  timestamp: number;
  /** Relevant metrics that triggered the alert */
  metrics: Record<string, number>;
}

/**
 * Result of a health check operation
 */
export interface HealthCheckResult {
  /** Endpoint that was checked */
  endpoint: string;
  /** Whether the health check passed */
  healthy: boolean;
  /** Response time of the health check in milliseconds */
  responseTime: number;
  /** Timestamp when health check was performed */
  timestamp: number;
  /** Error message if health check failed */
  error?: string;
}

/**
 * Configuration thresholds for degradation detection
 */
export interface HealthThresholds {
  /** Failure rate threshold for warning alerts (0-1) */
  failureRateWarning: number;
  /** Failure rate threshold for critical alerts (0-1) */
  failureRateCritical: number;
  /** P95 response time threshold for warning alerts (milliseconds) */
  p95ResponseTimeWarning: number;
  /** P95 response time threshold for critical alerts (milliseconds) */
  p95ResponseTimeCritical: number;
  /** Timeout rate threshold for warning alerts (0-1) */
  timeoutRateWarning: number;
  /** Timeout rate threshold for critical alerts (0-1) */
  timeoutRateCritical: number;
}

/**
 * Comprehensive health report
 */
export interface HealthReport {
  /** Total number of monitored endpoints */
  totalEndpoints: number;
  /** Number of currently degraded endpoints */
  degradedCount: number;
  /** Health data for all endpoints */
  endpoints: EndpointHealth[];
  /** Recent degradation alerts */
  recentAlerts: DegradationAlert[];
  /** Overall health score (0-100) */
  overallHealthScore: number;
}

/**
 * Health monitoring configuration
 */
export interface HealthMonitorConfig {
  /** Custom degradation detection thresholds */
  thresholds?: Partial<HealthThresholds>;
  /** Maximum number of response times to keep for percentile calculation */
  maxResponseTimes?: number;
  /** Maximum number of alerts to keep in memory */
  maxAlerts?: number;
  /** Whether to emit events for degradation alerts */
  enableEvents?: boolean;
}

/**
 * Event listener function type
 */
export type HealthEventListener = (event: ResilienceEvent) => void;

/**
 * Function to remove an event listener
 */
export type UnsubscribeFunction = () => void;

/**
 * Health monitor interface for dependency injection
 */
export interface HealthMonitorInterface {
  recordSuccess(endpoint: string, responseTime: number): void;
  recordFailure(endpoint: string, responseTime?: number): void;
  recordTimeout(endpoint: string, timeoutMs: number): void;
  getHealth(endpoint: string): EndpointHealth | undefined;
  getAllHealth(): Map<string, EndpointHealth>;
  getDegradedEndpoints(): EndpointHealth[];
  getRecentAlerts(limit?: number): DegradationAlert[];
  getAlertsForEndpoint(endpoint: string, limit?: number): DegradationAlert[];
  updateThresholds(thresholds: Partial<HealthThresholds>): void;
  onEvent(listener: HealthEventListener): UnsubscribeFunction;
  resetEndpoint(endpoint: string): void;
  resetAll(): void;
  getHealthReport(): HealthReport;
  healthCheck(endpoint: string, checkFn: () => Promise<void>): Promise<HealthCheckResult>;
}

/**
 * Response time statistics for an endpoint
 */
export interface ResponseTimeStats {
  /** Average response time */
  average: number;
  /** Minimum response time */
  min: number;
  /** Maximum response time */
  max: number;
  /** Median response time */
  median: number;
  /** 95th percentile response time */
  p95: number;
  /** 99th percentile response time */
  p99: number;
  /** Total number of samples */
  sampleCount: number;
}

/**
 * Metrics aggregation period
 */
export type AggregationPeriod = '1m' | '5m' | '15m' | '1h' | '24h';

/**
 * Time-series health metrics
 */
export interface TimeSeriesMetrics {
  /** Time period for aggregation */
  period: AggregationPeriod;
  /** Start timestamp */
  startTime: number;
  /** End timestamp */
  endTime: number;
  /** Success rate over the period */
  successRate: number;
  /** Average response time over the period */
  avgResponseTime: number;
  /** P95 response time over the period */
  p95ResponseTime: number;
  /** Request count over the period */
  requestCount: number;
  /** Failure count over the period */
  failureCount: number;
}

/**
 * Health trend analysis
 */
export interface HealthTrend {
  /** Endpoint being analyzed */
  endpoint: string;
  /** Trend direction for success rate */
  successRateTrend: 'improving' | 'stable' | 'degrading';
  /** Trend direction for response time */
  responseTimeTrend: 'improving' | 'stable' | 'degrading';
  /** Confidence level of the trend analysis (0-1) */
  confidence: number;
  /** Time series data used for analysis */
  timeSeries: TimeSeriesMetrics[];
}

/**
 * Health monitoring event types
 */
export type HealthEventType = 
  | 'healthDegradation'
  | 'healthRecovery' 
  | 'thresholdUpdate'
  | 'endpointReset'
  | 'monitoringStart'
  | 'monitoringStop';

/**
 * Extended resilience event for health monitoring
 */
export interface HealthEvent extends Omit<ResilienceEvent, 'type' | 'endpoint'> {
  type: HealthEventType;
  endpoint?: string;
  details: {
    alert?: DegradationAlert;
    health?: EndpointHealth;
    thresholds?: Partial<HealthThresholds>;
    [key: string]: unknown;
  };
}
