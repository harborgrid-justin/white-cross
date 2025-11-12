/**
 * Monitoring Service Module
 *
 * Modular monitoring functionality for the White Cross platform
 */

// Core service
export { MonitoringService, monitoringService } from './MonitoringService';

// Component managers
export { SentryManager } from './SentryManager';
export { ErrorTrackingManager } from './ErrorTrackingManager';

// Individual services for advanced usage
export { MetricsService, metricsService } from './MetricsService';
export { HealthCheckService, healthCheckService } from './HealthCheckService';
export { ErrorTracker, errorTracker } from './ErrorTracker';
export { Logger, logger, log } from './Logger';
export { PerformanceMonitor, performanceMonitor } from './PerformanceMonitor';

// Types
export type {
  MonitoringConfig,
  ErrorContext,
  MonitoringEvent,
  ErrorCategory,
} from './types';

// Legacy type exports for backward compatibility
export type {
  MetricPoint,
  MetricsConfig,
  MetricsBackend,
  SecurityMetrics,
  AuditMetrics,
  ResilienceMetrics,
  CacheMetrics,
  PerformanceMetrics,
} from './MetricsService';

export type {
  HealthCheckResult,
  ServiceHealthCheck,
  HealthCheckConfig,
  HealthCheckProvider,
} from './HealthCheckService';

export type {
  ErrorTrackerConfig,
  ErrorEvent,
  Breadcrumb,
} from './ErrorTracker';

export type { LogLevel, LogEntry, LogContext, LoggerConfig, LogTransport } from './Logger';

export type {
  WebVitalsMetric,
  PerformanceMetric,
  ResourceTiming,
  NavigationTiming,
  PerformanceMonitorConfig,
} from './PerformanceMonitor';

// Legacy exports for backward compatibility
export async function initializeMonitoring(): Promise<void> {
  return monitoringService.initialize();
}

export function destroyMonitoring(): void {
  monitoringService.destroy();
}
