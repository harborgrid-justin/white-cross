/**
 * Shared Enterprise Metrics Interfaces
 * Reusable across all modules for consistent metrics collection
 */

export interface EnterpriseMetricsSnapshot {
  counters: Record<string, CounterMetric>;
  gauges: Record<string, GaugeMetric>;
  histograms: Record<string, HistogramMetric>;
  timestamp: number;
}

export interface CounterMetric {
  value: number;
  labels?: Record<string, string>;
  description?: string;
}

export interface GaugeMetric {
  value: number;
  labels?: Record<string, string>;
  description?: string;
}

export interface HistogramMetric {
  count: number;
  sum: number;
  avg: number;
  min: number;
  max: number;
  buckets?: Record<string, number>;
  labels?: Record<string, string>;
  description?: string;
}

export interface SecurityMetrics {
  loginAttempts: number;
  failedLogins: number;
  suspiciousActivities: number;
  blockedRequests: number;
  sessionCount: number;
  averageSessionDuration: number;
}

export interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  cacheHitRate: number;
  databaseQueryTime: number;
  memoryUsage: number;
}

export interface ComplianceMetrics {
  phiAccesses: number;
  auditLogEntries: number;
  dataRetentionViolations: number;
  encryptionFailures: number;
  accessViolations: number;
}

export interface ModuleHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  lastCheck: number;
  errors: string[];
  warnings: string[];
  dependencies: Record<string, 'up' | 'down' | 'degraded'>;
}

export interface EnterpriseHealthCheck {
  module: string;
  status: ModuleHealthStatus;
  metrics: {
    security?: SecurityMetrics;
    performance?: PerformanceMetrics;
    compliance?: ComplianceMetrics;
  };
  timestamp: number;
}
