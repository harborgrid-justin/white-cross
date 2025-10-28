/**
 * LOC: WC-MODULE-MONITORING-INDEX
 * Monitoring Module Exports
 *
 * Centralized exports for all monitoring middleware, interceptors, and utilities.
 */

// Module
export { MonitoringModule } from './monitoring.module';

// Audit components
export {
  AuditMiddleware,
  AuditEventType,
  AuditSeverity,
  AuditEvent,
  AuditConfig,
  AuditSummary,
  AUDIT_CONFIGS,
  createAuditMiddleware,
  createHealthcareAudit,
  createProductionAudit
} from './audit.middleware';

export { AuditInterceptor } from './audit.interceptor';

// Tracing components
export {
  TracingMiddleware,
  TraceSpan,
  TraceLog,
  SpanStatus,
  SpanContext,
  ITracingConfig,
  DEFAULT_TRACING_CONFIG,
  createTracingMiddleware
} from './tracing.middleware';

// Metrics components
export {
  MetricsMiddleware,
  MetricType,
  HealthcareMetricCategory,
  MetricData,
  IMetricsConfig,
  DEFAULT_METRICS_CONFIG,
  createMetricsMiddleware
} from './metrics.middleware';

// Performance components
export {
  PerformanceMiddleware,
  PerformanceMetrics,
  PerformanceConfig,
  PerformanceSummary,
  PERFORMANCE_CONFIGS,
  createPerformanceMiddleware,
  createHealthcarePerformance,
  createProductionPerformance
} from './performance.middleware';

export { PerformanceInterceptor } from './performance.interceptor';
