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
} from './audit.middleware';

export type {
  AuditEvent,
  AuditConfig,
  AuditSummary,
} from './audit.middleware';

export {
  AUDIT_CONFIGS,
  createAuditMiddleware,
  createHealthcareAudit,
  createProductionAudit
} from './audit.middleware';

export { AuditInterceptor } from './audit.interceptor';

// Tracing components
export {
  TracingMiddleware,
} from './tracing.middleware';

export type {
  TraceSpan,
  TraceLog,
  SpanStatus,
  SpanContext,
  ITracingConfig,
} from './tracing.middleware';

export {
  DEFAULT_TRACING_CONFIG,
  createTracingMiddleware
} from './tracing.middleware';

// Metrics components
export {
  MetricsMiddleware,
  MetricType,
  HealthcareMetricCategory,
} from './metrics.middleware';

export type {
  MetricData,
  IMetricsConfig,
} from './metrics.middleware';

export {
  DEFAULT_METRICS_CONFIG,
  createMetricsMiddleware
} from './metrics.middleware';

// Performance components
export {
  PerformanceMiddleware,
} from './performance.middleware';

export type {
  PerformanceMetrics,
  PerformanceConfig,
  PerformanceSummary,
} from './performance.middleware';

export {
  PERFORMANCE_CONFIGS,
  createPerformanceMiddleware,
  createHealthcarePerformance,
  createProductionPerformance
} from './performance.middleware';

export { PerformanceInterceptor } from './performance.interceptor';
