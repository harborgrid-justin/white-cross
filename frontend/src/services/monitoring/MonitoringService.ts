/**
 * Monitoring Service
 *
 * Orchestrator for modular monitoring components
 */

import { metricsService } from './MetricsService';
import { healthCheckService } from './HealthCheckService';
import { performanceMonitor } from './PerformanceMonitor';
import { logger } from './Logger';
import { SentryManager } from './SentryManager';
import { ErrorTrackingManager } from './ErrorTrackingManager';
import type { MonitoringConfig } from './types';

export class MonitoringService {
  private static instance: MonitoringService;
  private config: MonitoringConfig;
  private sentryManager: SentryManager;
  private errorTrackingManager: ErrorTrackingManager;
  private isInitialized = false;

  private constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = {
      sentry: {
        dsn: config.sentry?.dsn || process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
        environment: config.sentry?.environment || process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV,
        release: config.sentry?.release || process.env.NEXT_PUBLIC_SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA,
        tracesSampleRate: config.sentry?.tracesSampleRate ?? (this.isProduction ? 0.1 : 1.0),
        profilesSampleRate: config.sentry?.profilesSampleRate ?? (this.isProduction ? 0.1 : 1.0),
        replaysSessionSampleRate: config.sentry?.replaysSessionSampleRate ?? (this.isProduction ? 0.1 : 1.0),
        replaysOnErrorSampleRate: config.sentry?.replaysOnErrorSampleRate ?? 1.0,
      },
      errorTracker: {
        enabled: config.errorTracker?.enabled ?? true,
        sampleRate: config.errorTracker?.sampleRate ?? 1.0,
        maxBreadcrumbs: config.errorTracker?.maxBreadcrumbs ?? 100,
      },
      metrics: {
        enabled: config.metrics?.enabled ?? true,
        flushInterval: config.metrics?.flushInterval ?? 30000,
      },
      healthChecks: {
        enabled: config.healthChecks?.enabled ?? true,
        interval: config.healthChecks?.interval ?? 60000,
      },
      performance: {
        enabled: config.performance?.enabled ?? true,
        webVitals: config.performance?.webVitals ?? true,
      },
      logging: {
        level: config.logging?.level ?? 'info',
        remote: config.logging?.remote ?? this.isProduction,
      },
    };

    this.sentryManager = new SentryManager(this.config.sentry);
    this.errorTrackingManager = new ErrorTrackingManager(this.sentryManager);
  }

  private get isProduction(): boolean {
    return this.config.sentry?.environment === 'production';
  }

  public static getInstance(config?: Partial<MonitoringConfig>): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService(config);
    }
    return MonitoringService.instance;
  }

  /**
   * Initialize all monitoring services (lazy loaded)
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      logger.info('Initializing consolidated monitoring infrastructure');

      // Initialize Sentry (lazy loaded)
      if (this.config.sentry?.dsn) {
        await this.sentryManager.initialize();
      }

      // Initialize error tracking
      if (this.config.errorTracker?.enabled) {
        await this.errorTrackingManager.initialize();
      }

      // Initialize performance monitoring
      if (this.config.performance?.enabled) {
        await this.initPerformanceMonitoring();
      }

      // Initialize health checks
      if (this.config.healthChecks?.enabled) {
        await this.initHealthChecks();
      }

      // Initialize metrics
      if (this.config.metrics?.enabled) {
        await this.initMetrics();
      }

      this.isInitialized = true;
      logger.info('Monitoring infrastructure initialized successfully');
    } catch (error) {
      console.error('Failed to initialize monitoring:', error);
      // Don't throw - monitoring failures shouldn't break the app
    }
  }

  /**
   * Initialize performance monitoring
   */
  private async initPerformanceMonitoring(): Promise<void> {
    // Performance monitoring is handled by the PerformanceMonitor singleton
    // Web vitals tracking is enabled by default
  }

  /**
   * Initialize health checks
   */
  private async initHealthChecks(): Promise<void> {
    // Start periodic health checks
    setInterval(async () => {
      try {
        await healthCheckService.checkNow();
      } catch (error) {
        logger.error('Health check failed', undefined, { error });
      }
    }, this.config.healthChecks?.interval);
  }

  /**
   * Initialize metrics collection
   */
  private async initMetrics(): Promise<void> {
    // Metrics service is already initialized as singleton
    // Set up periodic flush if configured
    if (this.config.metrics?.flushInterval) {
      setInterval(() => {
        metricsService.flush();
      }, this.config.metrics.flushInterval);
    }
  }

  // ============================================================================
  // ERROR TRACKING METHODS (DELEGATED)
  // ============================================================================

  public async captureException(...args: Parameters<ErrorTrackingManager['captureException']>): Promise<void> {
    return this.errorTrackingManager.captureException(...args);
  }

  public async captureMessage(...args: Parameters<ErrorTrackingManager['captureMessage']>): Promise<void> {
    return this.errorTrackingManager.captureMessage(...args);
  }

  public captureError(...args: Parameters<ErrorTrackingManager['captureError']>): void {
    return this.errorTrackingManager.captureError(...args);
  }

  public async addBreadcrumb(...args: Parameters<ErrorTrackingManager['addBreadcrumb']>): Promise<void> {
    return this.errorTrackingManager.addBreadcrumb(...args);
  }

  public async setUserContext(...args: Parameters<ErrorTrackingManager['setUserContext']>): Promise<void> {
    return this.errorTrackingManager.setUserContext(...args);
  }

  // ============================================================================
  // PERFORMANCE MONITORING METHODS
  // ============================================================================

  /**
   * Start transaction for performance monitoring
   */
  public async startTransaction(
    name: string,
    operation: string,
    data?: Record<string, unknown>
  ): Promise<unknown> {
    // Note: startTransaction is not available in current Sentry version
    // This is a placeholder for future implementation
    console.log(`[Monitoring] Transaction: ${name} (${operation})`, data);
    return null;
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics() {
    return performanceMonitor.getMetrics();
  }

  // ============================================================================
  // HEALTH CHECK METHODS
  // ============================================================================

  /**
   * Run health checks
   */
  public async runHealthChecks() {
    return await healthCheckService.checkNow();
  }

  /**
   * Get health status
   */
  public getHealthStatus() {
    return healthCheckService.isHealthy();
  }

  // ============================================================================
  // METRICS METHODS
  // ============================================================================

  /**
   * Track custom metric
   */
  public trackMetric(name: string, value: number, tags?: Record<string, string>) {
    // Use existing metrics service methods
    // This is a simplified implementation - extend as needed
    console.log(`[Monitoring] Metric: ${name}=${value}`, tags);
  }

  /**
   * Get metrics summary
   */
  public getMetricsSummary() {
    // Return basic metrics info - extend as needed
    return {
      timestamp: Date.now(),
      message: 'Metrics summary not fully implemented'
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Cleanup all monitoring services
   */
  public destroy(): void {
    metricsService.destroy();
    healthCheckService.destroy();
    performanceMonitor.destroy();
    logger.destroy();
    this.isInitialized = false;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Singleton instance of the monitoring service
 */
export const monitoringService = MonitoringService.getInstance();