import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '@/common/base';
import {
  ComplianceMetrics,
  CounterMetric,
  EnterpriseHealthCheck,
  EnterpriseMetricsSnapshot,
  GaugeMetric,
  HistogramMetric,
  ModuleHealthStatus,
  PerformanceMetrics,
  SecurityMetrics,
} from '../interfaces/enterprise-metrics.interface';

@Injectable()
export class EnterpriseMetricsService extends BaseService {
  private counters = new Map<string, CounterMetric>();
  private gauges = new Map<string, GaugeMetric>();
  private histograms = new Map<string, HistogramMetric>();
  private startTime = Date.now();

  constructor(private readonly moduleName: string) {
    this.logInfo(
      `Enterprise metrics service initialized for module: ${moduleName}`,
    );
  }

  /**
   * Increment a counter metric
   */
  incrementCounter(
    name: string,
    value: number = 1,
    labels?: Record<string, string>,
  ): void {
    try {
      const key = this.getMetricKey(name);
      const existing = this.counters.get(key);

      if (existing) {
        existing.value += value;
        existing.labels = { ...existing.labels, ...labels };
      } else {
        this.counters.set(key, {
          value,
          labels,
          description: `Counter metric for ${name} in ${this.moduleName}`,
        });
      }
    } catch (error) {
      this.logError(`Failed to increment counter ${name}:`, error);
    }
  }

  /**
   * Set a gauge metric value
   */
  recordGauge(
    name: string,
    value: number,
    labels?: Record<string, string>,
  ): void {
    try {
      const key = this.getMetricKey(name);
      this.gauges.set(key, {
        value,
        labels,
        description: `Gauge metric for ${name} in ${this.moduleName}`,
      });
    } catch (error) {
      this.logError(`Failed to record gauge ${name}:`, error);
    }
  }

  /**
   * Record a histogram metric value
   */
  recordHistogram(
    name: string,
    value: number,
    labels?: Record<string, string>,
  ): void {
    try {
      const key = this.getMetricKey(name);
      const existing = this.histograms.get(key);

      if (existing) {
        existing.count++;
        existing.sum += value;
        existing.min = Math.min(existing.min, value);
        existing.max = Math.max(existing.max, value);
        existing.avg = existing.sum / existing.count;
        existing.labels = { ...existing.labels, ...labels };
      } else {
        this.histograms.set(key, {
          count: 1,
          sum: value,
          avg: value,
          min: value,
          max: value,
          labels,
          description: `Histogram metric for ${name} in ${this.moduleName}`,
        });
      }
    } catch (error) {
      this.logError(`Failed to record histogram ${name}:`, error);
    }
  }

  /**
   * Record security metrics
   */
  recordSecurityMetrics(metrics: Partial<SecurityMetrics>): void {
    if (metrics.loginAttempts !== undefined) {
      this.recordGauge('security_login_attempts', metrics.loginAttempts);
    }
    if (metrics.failedLogins !== undefined) {
      this.incrementCounter('security_failed_logins', metrics.failedLogins);
    }
    if (metrics.suspiciousActivities !== undefined) {
      this.incrementCounter(
        'security_suspicious_activities',
        metrics.suspiciousActivities,
      );
    }
    if (metrics.blockedRequests !== undefined) {
      this.incrementCounter(
        'security_blocked_requests',
        metrics.blockedRequests,
      );
    }
    if (metrics.sessionCount !== undefined) {
      this.recordGauge('security_active_sessions', metrics.sessionCount);
    }
    if (metrics.averageSessionDuration !== undefined) {
      this.recordGauge(
        'security_avg_session_duration',
        metrics.averageSessionDuration,
      );
    }
  }

  /**
   * Record performance metrics
   */
  recordPerformanceMetrics(metrics: Partial<PerformanceMetrics>): void {
    if (metrics.requestCount !== undefined) {
      this.incrementCounter('performance_requests', metrics.requestCount);
    }
    if (metrics.averageResponseTime !== undefined) {
      this.recordHistogram(
        'performance_response_time',
        metrics.averageResponseTime,
      );
    }
    if (metrics.errorRate !== undefined) {
      this.recordGauge('performance_error_rate', metrics.errorRate);
    }
    if (metrics.cacheHitRate !== undefined) {
      this.recordGauge('performance_cache_hit_rate', metrics.cacheHitRate);
    }
    if (metrics.databaseQueryTime !== undefined) {
      this.recordHistogram(
        'performance_db_query_time',
        metrics.databaseQueryTime,
      );
    }
    if (metrics.memoryUsage !== undefined) {
      this.recordGauge('performance_memory_usage', metrics.memoryUsage);
    }
  }

  /**
   * Record compliance metrics
   */
  recordComplianceMetrics(metrics: Partial<ComplianceMetrics>): void {
    if (metrics.phiAccesses !== undefined) {
      this.incrementCounter('compliance_phi_accesses', metrics.phiAccesses);
    }
    if (metrics.auditLogEntries !== undefined) {
      this.incrementCounter(
        'compliance_audit_entries',
        metrics.auditLogEntries,
      );
    }
    if (metrics.dataRetentionViolations !== undefined) {
      this.incrementCounter(
        'compliance_retention_violations',
        metrics.dataRetentionViolations,
      );
    }
    if (metrics.encryptionFailures !== undefined) {
      this.incrementCounter(
        'compliance_encryption_failures',
        metrics.encryptionFailures,
      );
    }
    if (metrics.accessViolations !== undefined) {
      this.incrementCounter(
        'compliance_access_violations',
        metrics.accessViolations,
      );
    }
  }

  /**
   * Get all metrics snapshot
   */
  getMetrics(): EnterpriseMetricsSnapshot {
    return {
      counters: Object.fromEntries(this.counters.entries()),
      gauges: Object.fromEntries(this.gauges.entries()),
      histograms: Object.fromEntries(this.histograms.entries()),
      timestamp: Date.now(),
    };
  }

  /**
   * Get metrics in Prometheus format
   */
  getPrometheusMetrics(): string {
    const lines: string[] = [];
    const timestamp = Date.now();

    // Add module uptime
    const uptime = Math.round((Date.now() - this.startTime) / 1000);
    lines.push(
      `# HELP ${this.moduleName}_uptime_seconds Module uptime in seconds`,
    );
    lines.push(`# TYPE ${this.moduleName}_uptime_seconds gauge`);
    lines.push(`${this.moduleName}_uptime_seconds ${uptime} ${timestamp}`);

    // Add counters
    for (const [name, counter] of this.counters.entries()) {
      const metricName = `${name}_total`;
      lines.push(
        `# HELP ${metricName} ${counter.description || 'Counter metric'}`,
      );
      lines.push(`# TYPE ${metricName} counter`);

      const labels = this.formatLabels(counter.labels);
      lines.push(`${metricName}${labels} ${counter.value} ${timestamp}`);
    }

    // Add gauges
    for (const [name, gauge] of this.gauges.entries()) {
      lines.push(`# HELP ${name} ${gauge.description || 'Gauge metric'}`);
      lines.push(`# TYPE ${name} gauge`);

      const labels = this.formatLabels(gauge.labels);
      lines.push(`${name}${labels} ${gauge.value} ${timestamp}`);
    }

    // Add histograms
    for (const [name, histogram] of this.histograms.entries()) {
      lines.push(
        `# HELP ${name} ${histogram.description || 'Histogram metric'}`,
      );
      lines.push(`# TYPE ${name} histogram`);

      const labels = this.formatLabels(histogram.labels);
      lines.push(`${name}_count${labels} ${histogram.count} ${timestamp}`);
      lines.push(`${name}_sum${labels} ${histogram.sum} ${timestamp}`);
      lines.push(`${name}_avg${labels} ${histogram.avg} ${timestamp}`);
    }

    return lines.join('\n') + '\n';
  }

  /**
   * Get health check status
   */
  getHealthCheck(): EnterpriseHealthCheck {
    const uptime = Math.round((Date.now() - this.startTime) / 1000);
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for high error rates
    const errorRateGauge = this.gauges.get(
      this.getMetricKey('performance_error_rate'),
    );
    if (errorRateGauge && errorRateGauge.value > 0.1) {
      // 10% error rate
      errors.push(
        `High error rate: ${(errorRateGauge.value * 100).toFixed(2)}%`,
      );
    }

    // Check memory usage
    const memoryGauge = this.gauges.get(
      this.getMetricKey('performance_memory_usage'),
    );
    if (memoryGauge && memoryGauge.value > 1000) {
      // 1GB threshold
      warnings.push(`High memory usage: ${memoryGauge.value}MB`);
    }

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (errors.length > 0) {
      status = 'unhealthy';
    } else if (warnings.length > 0) {
      status = 'degraded';
    }

    const moduleStatus: ModuleHealthStatus = {
      status,
      uptime,
      lastCheck: Date.now(),
      errors,
      warnings,
      dependencies: {}, // To be populated by specific modules
    };

    return {
      module: this.moduleName,
      status: moduleStatus,
      metrics: {
        security: this.extractSecurityMetrics(),
        performance: this.extractPerformanceMetrics(),
        compliance: this.extractComplianceMetrics(),
      },
      timestamp: Date.now(),
    };
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    this.startTime = Date.now();
    this.logInfo(`Metrics reset for module: ${this.moduleName}`);
  }

  /**
   * Get specific counter value
   */
  getCounter(name: string): number {
    const key = this.getMetricKey(name);
    return this.counters.get(key)?.value || 0;
  }

  /**
   * Get specific gauge value
   */
  getGauge(name: string): number | undefined {
    const key = this.getMetricKey(name);
    return this.gauges.get(key)?.value;
  }

  /**
   * Get specific histogram data
   */
  getHistogram(name: string): HistogramMetric | undefined {
    const key = this.getMetricKey(name);
    return this.histograms.get(key);
  }

  /**
   * Generate metric key with module prefix
   */
  private getMetricKey(name: string): string {
    return `${this.moduleName}_${name}`;
  }

  /**
   * Format labels for Prometheus
   */
  private formatLabels(labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return '';
    }

    const labelPairs = Object.entries(labels)
      .map(([key, value]) => `${key}="${value}"`)
      .join(',');

    return `{${labelPairs}}`;
  }

  /**
   * Extract security metrics from stored metrics
   */
  private extractSecurityMetrics(): SecurityMetrics {
    return {
      loginAttempts: this.getGauge('security_login_attempts') || 0,
      failedLogins: this.getCounter('security_failed_logins'),
      suspiciousActivities: this.getCounter('security_suspicious_activities'),
      blockedRequests: this.getCounter('security_blocked_requests'),
      sessionCount: this.getGauge('security_active_sessions') || 0,
      averageSessionDuration:
        this.getGauge('security_avg_session_duration') || 0,
    };
  }

  /**
   * Extract performance metrics from stored metrics
   */
  private extractPerformanceMetrics(): PerformanceMetrics {
    const responseTimeHist = this.getHistogram('performance_response_time');
    return {
      requestCount: this.getCounter('performance_requests'),
      averageResponseTime: responseTimeHist?.avg || 0,
      errorRate: this.getGauge('performance_error_rate') || 0,
      cacheHitRate: this.getGauge('performance_cache_hit_rate') || 0,
      databaseQueryTime:
        this.getHistogram('performance_db_query_time')?.avg || 0,
      memoryUsage: this.getGauge('performance_memory_usage') || 0,
    };
  }

  /**
   * Extract compliance metrics from stored metrics
   */
  private extractComplianceMetrics(): ComplianceMetrics {
    return {
      phiAccesses: this.getCounter('compliance_phi_accesses'),
      auditLogEntries: this.getCounter('compliance_audit_entries'),
      dataRetentionViolations: this.getCounter(
        'compliance_retention_violations',
      ),
      encryptionFailures: this.getCounter('compliance_encryption_failures'),
      accessViolations: this.getCounter('compliance_access_violations'),
    };
  }

  /**
   * Cleanup on service destruction
   */
  onModuleDestroy(): void {
    this.logInfo(
      `Enterprise metrics service destroyed for module: ${this.moduleName}`,
    );
  }
}
