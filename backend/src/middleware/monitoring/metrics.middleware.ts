/**
 * LOC: WC-MID-METRICS-001
 * NestJS Metrics Collection Middleware
 *
 * Enterprise-grade metrics collection middleware with healthcare-specific monitoring.
 * Collects performance metrics, usage statistics, and system health indicators.
 */

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

/**
 * Metric types for categorization
 */
export enum MetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',
  TIMER = 'timer',
  RATE = 'rate',
}

/**
 * Healthcare-specific metric categories
 */
export enum HealthcareMetricCategory {
  PATIENT_ACCESS = 'patient_access',
  PHI_ACCESS = 'phi_access',
  MEDICATION_ADMIN = 'medication_administration',
  EMERGENCY_ACCESS = 'emergency_access',
  AUDIT_EVENTS = 'audit_events',
  COMPLIANCE = 'compliance',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  USAGE = 'usage',
}

/**
 * Metric data structure
 */
export interface MetricData {
  name: string;
  type: MetricType;
  category: HealthcareMetricCategory;
  value: number;
  timestamp: Date;
  tags: Record<string, string>;
  unit?: string;
  description?: string;
}

/**
 * Configuration interface for metrics middleware
 */
export interface IMetricsConfig {
  enabled: boolean;
  sampleRate: number;
  enableHealthcareMetrics: boolean;
  enablePerformanceMetrics: boolean;
  enableUserMetrics: boolean;
  enableErrorMetrics: boolean;
  batchSize: number;
  flushInterval: number;
  retentionDays: number;
  defaultTags: Record<string, string>;
  excludePaths: string[];
  enableAlerts: boolean;
  alertThresholds: {
    responseTime: number;
    errorRate: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

/**
 * Default configuration for metrics middleware
 */
export const DEFAULT_METRICS_CONFIG: IMetricsConfig = {
  enabled: true,
  sampleRate: 1.0,
  enableHealthcareMetrics: true,
  enablePerformanceMetrics: true,
  enableUserMetrics: true,
  enableErrorMetrics: true,
  batchSize: 100,
  flushInterval: 30000, // 30 seconds
  retentionDays: 90,
  defaultTags: {
    service: 'white-cross-healthcare',
    environment: process.env.NODE_ENV || 'development',
  },
  excludePaths: ['/health', '/metrics', '/favicon.ico'],
  enableAlerts: true,
  alertThresholds: {
    responseTime: 2000, // 2 seconds
    errorRate: 0.05, // 5%
    memoryUsage: 0.85, // 85%
    cpuUsage: 0.8, // 80%
  },
};

/**
 * Metrics context for request processing
 */
interface MetricsContext {
  requestId: string;
  startTime: number;
  timestamp: Date;
  user?: any;
  method: string;
  path: string;
  statusCode?: number;
  responseTime?: number;
  facility?: string | null;
  userAgent: string;
  clientIP: string;
  bytes?: {
    in: number;
    out: number;
  };
}

/**
 * In-memory metrics store for batching
 */
class MetricsStore {
  private metrics: MetricData[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(
    private batchSize: number,
    private flushInterval: number,
    private onFlush: (metrics: MetricData[]) => Promise<void>,
  ) {
    this.startFlushTimer();
  }

  public add(metric: MetricData): void {
    this.metrics.push(metric);

    if (this.metrics.length >= this.batchSize) {
      this.flush();
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      if (this.metrics.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  private async flush(): Promise<void> {
    if (this.metrics.length === 0) return;

    const metricsToFlush = [...this.metrics];
    this.metrics = [];

    try {
      await this.onFlush(metricsToFlush);
    } catch (error) {
      console.error('[MetricsStore] Error flushing metrics:', error);
      // Re-add metrics for retry (simple strategy)
      this.metrics.unshift(...metricsToFlush);
    }
  }

  public async forceFlush(): Promise<void> {
    await this.flush();
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush(); // Final flush
  }
}

/**
 * System metrics collector
 */
class SystemMetricsCollector {
  private memoryThreshold: number;
  private cpuThreshold: number;
  private lastCpuUsage: NodeJS.CpuUsage;

  constructor(memoryThreshold: number, cpuThreshold: number) {
    this.memoryThreshold = memoryThreshold;
    this.cpuThreshold = cpuThreshold;
    this.lastCpuUsage = process.cpuUsage();
  }

  public collectSystemMetrics(tags: Record<string, string>): MetricData[] {
    const metrics: MetricData[] = [];
    const now = new Date();

    // Memory metrics
    const memUsage = process.memoryUsage();
    const os = require('os');
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUtilization = usedMemory / totalMemory;

    metrics.push({
      name: 'system.memory.heap_used',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: memUsage.heapUsed,
      timestamp: now,
      tags: { ...tags, unit: 'bytes' },
      unit: 'bytes',
    });

    metrics.push({
      name: 'system.memory.utilization',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: memoryUtilization,
      timestamp: now,
      tags: { ...tags, unit: 'percent' },
      unit: 'percent',
    });

    // CPU metrics
    const currentCpuUsage = process.cpuUsage(this.lastCpuUsage);
    const totalCpuTime = currentCpuUsage.user + currentCpuUsage.system;
    const cpuUtilization = totalCpuTime / 1000000; // Convert to seconds
    this.lastCpuUsage = process.cpuUsage();

    metrics.push({
      name: 'system.cpu.utilization',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: cpuUtilization,
      timestamp: now,
      tags: { ...tags, unit: 'seconds' },
      unit: 'seconds',
    });

    // Event loop lag (approximate)
    const hrTime = process.hrtime();
    const eventLoopLag = hrTime[0] * 1000 + hrTime[1] / 1000000;

    metrics.push({
      name: 'system.event_loop.lag',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: eventLoopLag,
      timestamp: now,
      tags: { ...tags, unit: 'ms' },
      unit: 'ms',
    });

    return metrics;
  }

  public checkThresholds(
    memoryUtilization: number,
    cpuUtilization: number,
  ): string[] {
    const alerts: string[] = [];

    if (memoryUtilization > this.memoryThreshold) {
      alerts.push(
        `Memory utilization ${(memoryUtilization * 100).toFixed(2)}% exceeds threshold ${(this.memoryThreshold * 100).toFixed(2)}%`,
      );
    }

    if (cpuUtilization > this.cpuThreshold) {
      alerts.push(
        `CPU utilization ${(cpuUtilization * 100).toFixed(2)}% exceeds threshold ${(this.cpuThreshold * 100).toFixed(2)}%`,
      );
    }

    return alerts;
  }
}

/**
 * Enterprise metrics middleware with healthcare compliance
 */
@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(MetricsMiddleware.name);
  private config: IMetricsConfig;
  private metricsStore: MetricsStore;
  private systemCollector: SystemMetricsCollector;
  private requestCounts: Map<string, number> = new Map();
  private errorCounts: Map<string, number> = new Map();
  private responseTimeBuckets: Map<string, number[]> = new Map();
  private systemMetricsInterval?: NodeJS.Timeout;

  constructor() {
    this.config = DEFAULT_METRICS_CONFIG;

    if (this.config.enabled) {
      this.metricsStore = new MetricsStore(
        this.config.batchSize,
        this.config.flushInterval,
        this.onMetricsFlush.bind(this),
      );

      this.systemCollector = new SystemMetricsCollector(
        this.config.alertThresholds.memoryUsage,
        this.config.alertThresholds.cpuUsage,
      );

      // Start periodic system metrics collection
      this.systemMetricsInterval = setInterval(() => {
        if (this.shouldSample()) {
          this.collectSystemMetrics();
        }
      }, 60000); // Every minute
    }
  }

  /**
   * NestJS middleware entry point
   */
  use(req: Request, res: Response, next: NextFunction): void {
    if (!this.config.enabled || !this.shouldSample()) {
      return next();
    }

    // Skip excluded paths
    if (this.config.excludePaths.some((path) => req.path.includes(path))) {
      return next();
    }

    const metricsContext = this.createContext(req);

    // Collect request metrics
    this.collectRequestMetrics(metricsContext).catch((err) => {
      this.logger.error('Error collecting request metrics', err);
    });

    // Enhance response object to capture metrics on completion
    this.instrumentResponse(res, metricsContext);

    next();
  }

  /**
   * Create metrics context from request
   */
  private createContext(req: any): MetricsContext {
    const user = req.user;

    return {
      requestId: req.headers['x-request-id'] || this.generateRequestId(),
      startTime: Date.now(),
      timestamp: new Date(),
      user,
      method: req.method,
      path: req.path || req.url,
      facility: user?.facilityId || null,
      userAgent: req.headers['user-agent'] || 'Unknown',
      clientIP: this.getClientIP(req),
      bytes: {
        in: this.calculateRequestSize(req),
        out: 0,
      },
    };
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Extract client IP address
   */
  private getClientIP(req: any): string {
    return (
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.headers['x-real-ip']?.toString() ||
      req.ip ||
      'unknown'
    );
  }

  /**
   * Calculate request size in bytes
   */
  private calculateRequestSize(req: any): number {
    let size = 0;

    // Headers size
    Object.entries(req.headers).forEach(([key, value]) => {
      size +=
        key.length +
        (Array.isArray(value) ? value.join('').length : String(value).length);
    });

    // Body size (if available)
    if (req.body && typeof req.body === 'string') {
      size += Buffer.byteLength(req.body, 'utf8');
    } else if (req.body && typeof req.body === 'object') {
      size += Buffer.byteLength(JSON.stringify(req.body), 'utf8');
    }

    return size;
  }

  /**
   * Check if request should be sampled
   */
  private shouldSample(): boolean {
    return Math.random() < this.config.sampleRate;
  }

  /**
   * Collect request-level metrics
   */
  private async collectRequestMetrics(context: MetricsContext): Promise<void> {
    const tags = {
      ...this.config.defaultTags,
      method: context.method,
      path: this.normalizePath(context.path),
      facility: context.facility || 'unknown',
      user_role: context.user?.role || 'anonymous',
    };

    // Request counter
    this.recordMetric({
      name: 'http.requests.total',
      type: MetricType.COUNTER,
      category: HealthcareMetricCategory.USAGE,
      value: 1,
      timestamp: context.timestamp,
      tags,
      description: 'Total number of HTTP requests',
    });

    // User activity metrics
    if (this.config.enableUserMetrics && context.user) {
      await this.collectUserMetrics(context, tags);
    }

    // Healthcare-specific metrics
    if (this.config.enableHealthcareMetrics) {
      await this.collectHealthcareMetrics(context, tags);
    }

    // Update internal counters
    const pathKey = `${context.method}:${this.normalizePath(context.path)}`;
    this.requestCounts.set(pathKey, (this.requestCounts.get(pathKey) || 0) + 1);
  }

  /**
   * Instrument response object for completion metrics
   */
  private instrumentResponse(res: Response, context: MetricsContext): void {
    const originalEnd = res.end;

    res.end = ((...args: any[]) => {
      context.responseTime = Date.now() - context.startTime;
      context.statusCode = res.statusCode;

      // Calculate response size
      if (args.length > 0 && args[0]) {
        const responseData = args[0];
        context.bytes!.out = Buffer.byteLength(
          typeof responseData === 'string'
            ? responseData
            : JSON.stringify(responseData),
          'utf8',
        );
      }

      // Collect response metrics asynchronously
      setImmediate(() => {
        this.collectResponseMetrics(context).catch((err) => {
          this.logger.error('Error collecting response metrics', err);
        });
      });

      return originalEnd.apply(res, args);
    }) as any;
  }

  /**
   * Collect response completion metrics
   */
  private async collectResponseMetrics(context: MetricsContext): Promise<void> {
    if (!context.responseTime || !context.statusCode) return;

    const tags = {
      ...this.config.defaultTags,
      method: context.method,
      path: this.normalizePath(context.path),
      status_code: context.statusCode.toString(),
      facility: context.facility || 'unknown',
      user_role: context.user?.role || 'anonymous',
    };

    // Response time metrics
    if (this.config.enablePerformanceMetrics) {
      this.recordMetric({
        name: 'http.request.duration',
        type: MetricType.HISTOGRAM,
        category: HealthcareMetricCategory.PERFORMANCE,
        value: context.responseTime,
        timestamp: new Date(),
        tags: { ...tags, unit: 'ms' },
        unit: 'ms',
        description: 'HTTP request duration in milliseconds',
      });

      // Check response time thresholds
      if (
        this.config.enableAlerts &&
        context.responseTime > this.config.alertThresholds.responseTime
      ) {
        this.logger.warn(
          `Slow response detected: ${context.responseTime}ms for ${context.method} ${context.path}`,
        );
      }
    }

    // Error metrics
    if (this.config.enableErrorMetrics && context.statusCode >= 400) {
      this.recordMetric({
        name: 'http.errors.total',
        type: MetricType.COUNTER,
        category: HealthcareMetricCategory.SECURITY,
        value: 1,
        timestamp: new Date(),
        tags,
        description: 'Total number of HTTP errors',
      });

      const pathKey = `${context.method}:${this.normalizePath(context.path)}`;
      this.errorCounts.set(pathKey, (this.errorCounts.get(pathKey) || 0) + 1);
    }

    // Bandwidth metrics
    this.recordMetric({
      name: 'http.request.bytes.in',
      type: MetricType.HISTOGRAM,
      category: HealthcareMetricCategory.USAGE,
      value: context.bytes?.in || 0,
      timestamp: new Date(),
      tags: { ...tags, unit: 'bytes' },
      unit: 'bytes',
    });

    this.recordMetric({
      name: 'http.response.bytes.out',
      type: MetricType.HISTOGRAM,
      category: HealthcareMetricCategory.USAGE,
      value: context.bytes?.out || 0,
      timestamp: new Date(),
      tags: { ...tags, unit: 'bytes' },
      unit: 'bytes',
    });
  }

  /**
   * Collect user-specific metrics
   */
  private async collectUserMetrics(
    context: MetricsContext,
    tags: Record<string, string>,
  ): Promise<void> {
    if (!context.user) return;

    // User session activity
    this.recordMetric({
      name: 'user.activity.total',
      type: MetricType.COUNTER,
      category: HealthcareMetricCategory.USAGE,
      value: 1,
      timestamp: context.timestamp,
      tags: {
        ...tags,
        user_id: context.user.userId,
        user_role: context.user.role,
        facility: context.user.facilityId || 'unknown',
      },
      description: 'User activity counter',
    });
  }

  /**
   * Collect healthcare-specific metrics
   */
  private async collectHealthcareMetrics(
    context: MetricsContext,
    tags: Record<string, string>,
  ): Promise<void> {
    // PHI access detection
    if (this.isPHIAccess(context.path)) {
      this.recordMetric({
        name: 'healthcare.phi.access.total',
        type: MetricType.COUNTER,
        category: HealthcareMetricCategory.PHI_ACCESS,
        value: 1,
        timestamp: context.timestamp,
        tags: {
          ...tags,
          access_type: this.getAccessType(context.path),
          user_role: context.user?.role || 'anonymous',
        },
        description: 'PHI access events',
      });
    }

    // Emergency access tracking
    if (this.isEmergencyAccess(context.path)) {
      this.recordMetric({
        name: 'healthcare.emergency.access.total',
        type: MetricType.COUNTER,
        category: HealthcareMetricCategory.EMERGENCY_ACCESS,
        value: 1,
        timestamp: context.timestamp,
        tags,
        description: 'Emergency access events',
      });
    }

    // Medication administration tracking
    if (this.isMedicationAdmin(context.path)) {
      this.recordMetric({
        name: 'healthcare.medication.admin.total',
        type: MetricType.COUNTER,
        category: HealthcareMetricCategory.MEDICATION_ADMIN,
        value: 1,
        timestamp: context.timestamp,
        tags,
        description: 'Medication administration events',
      });
    }
  }

  /**
   * Collect system-wide metrics
   */
  private collectSystemMetrics(): void {
    const metrics = this.systemCollector.collectSystemMetrics(
      this.config.defaultTags,
    );
    metrics.forEach((metric) => this.recordMetric(metric));
  }

  /**
   * Record a metric
   */
  private recordMetric(metric: MetricData): void {
    if (this.metricsStore) {
      this.metricsStore.add(metric);
    }
  }

  /**
   * Normalize path for consistent grouping
   */
  private normalizePath(path: string): string {
    // Replace IDs and UUIDs with placeholders
    return path
      .replace(/\/\d+/g, '/:id')
      .replace(/\/[a-f0-9-]{36}/gi, '/:uuid')
      .replace(/\/[a-f0-9]{24}/gi, '/:objectid');
  }

  /**
   * Check if path involves PHI access
   */
  private isPHIAccess(path: string): boolean {
    const phiPaths = [
      '/api/patients',
      '/api/health-records',
      '/api/medical-history',
      '/api/medications',
      '/api/immunizations',
    ];

    return phiPaths.some((phiPath) => path.startsWith(phiPath));
  }

  /**
   * Get access type from path
   */
  private getAccessType(path: string): string {
    if (path.includes('/emergency')) return 'emergency';
    if (path.includes('/break-glass')) return 'break_glass';
    return 'routine';
  }

  /**
   * Check if path is emergency access
   */
  private isEmergencyAccess(path: string): boolean {
    return path.includes('/emergency') || path.includes('/break-glass');
  }

  /**
   * Check if path is medication administration
   */
  private isMedicationAdmin(path: string): boolean {
    return path.includes('/medications') && path.includes('/administer');
  }

  /**
   * Handle metrics flush
   */
  private async onMetricsFlush(metrics: MetricData[]): Promise<void> {
    try {
      // In production, this would send to a metrics service like Prometheus, DataDog, etc.
      this.logger.debug(`Flushing ${metrics.length} metrics`);

      // Group metrics by category for structured logging
      const groupedMetrics = this.groupMetricsByCategory(metrics);

      for (const [category, categoryMetrics] of Object.entries(
        groupedMetrics,
      )) {
        this.logger.debug(
          `[METRICS][${category}] ${categoryMetrics.length} metrics`,
          categoryMetrics,
        );
      }
    } catch (error) {
      this.logger.error('Error in metrics flush', error);
      throw error;
    }
  }

  /**
   * Group metrics by category for organized output
   */
  private groupMetricsByCategory(
    metrics: MetricData[],
  ): Record<string, MetricData[]> {
    return metrics.reduce(
      (groups, metric) => {
        const category = metric.category;
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(metric);
        return groups;
      },
      {} as Record<string, MetricData[]>,
    );
  }

  /**
   * Get current metrics summary
   */
  public getMetricsSummary(): any {
    return {
      requestCounts: Object.fromEntries(this.requestCounts),
      errorCounts: Object.fromEntries(this.errorCounts),
      config: this.config,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Cleanup resources
   */
  onModuleDestroy(): void {
    if (this.metricsStore) {
      this.metricsStore.destroy();
    }
    if (this.systemMetricsInterval) {
      clearInterval(this.systemMetricsInterval);
    }
  }
}

/**
 * Factory function to create metrics middleware with healthcare defaults
 */
export function createMetricsMiddleware(
  config: Partial<IMetricsConfig> = {},
): MetricsMiddleware {
  const middleware = new MetricsMiddleware();
  (middleware as any).config = { ...DEFAULT_METRICS_CONFIG, ...config };
  return middleware;
}

export default MetricsMiddleware;
