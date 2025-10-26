/**
 * Monitoring Service Exports
 *
 * Centralized export for all monitoring and observability services
 */

export { MetricsService, metricsService } from './MetricsService';
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

export { HealthCheckService, healthCheckService } from './HealthCheckService';
export type {
  HealthCheckResult,
  ServiceHealthCheck,
  HealthCheckConfig,
  HealthCheckProvider,
} from './HealthCheckService';

export { ErrorTracker, errorTracker } from './ErrorTracker';
export type {
  ErrorContext,
  ErrorTrackerConfig,
  ErrorEvent,
  ErrorCategory,
  Breadcrumb,
} from './ErrorTracker';

export { Logger, logger, log } from './Logger';
export type { LogLevel, LogEntry, LogContext, LoggerConfig, LogTransport } from './Logger';

export { PerformanceMonitor, performanceMonitor } from './PerformanceMonitor';
export type {
  WebVitalsMetric,
  PerformanceMetric,
  ResourceTiming,
  NavigationTiming,
  PerformanceMonitorConfig,
} from './PerformanceMonitor';

/**
 * Initialize all monitoring services
 */
export async function initializeMonitoring(config?: {
  metrics?: Partial<import('./MetricsService').MetricsConfig>;
  health?: Partial<import('./HealthCheckService').HealthCheckConfig>;
  errors?: Partial<import('./ErrorTracker').ErrorTrackerConfig>;
  logger?: Partial<import('./Logger').LoggerConfig>;
  performance?: Partial<import('./PerformanceMonitor').PerformanceMonitorConfig>;
}): Promise<void> {
  try {
    logger.info('Initializing monitoring infrastructure');

    // Initialize error tracker first to catch initialization errors
    await errorTracker.initialize();

    // Initialize health checks
    await healthCheckService.checkNow();

    // Metrics service and performance monitor are already initialized as singletons

    logger.info('Monitoring infrastructure initialized successfully');
  } catch (error) {
    console.error('Failed to initialize monitoring:', error);
    throw error;
  }
}

/**
 * Cleanup all monitoring services
 */
export function destroyMonitoring(): void {
  metricsService.destroy();
  healthCheckService.destroy();
  errorTracker.destroy();
  performanceMonitor.destroy();
  logger.destroy();
}
