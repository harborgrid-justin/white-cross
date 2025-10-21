/**
 * Metrics Middleware
 * 
 * Enterprise-grade metrics collection middleware with healthcare-specific monitoring.
 * Collects performance metrics, usage statistics, and system health indicators.
 * 
 * @module MetricsMiddleware
 * @version 1.0.0
 */

import { IRequest, IResponse, IMiddleware, MiddlewareContext, HealthcareUser, INextFunction } from '../../utils/types/middleware.types';

/**
 * Metric types for categorization
 */
export enum MetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',
  TIMER = 'timer',
  RATE = 'rate'
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
  USAGE = 'usage'
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
  /** Enable metrics collection */
  enabled: boolean;
  /** Sample rate (0.0 to 1.0) for performance */
  sampleRate: number;
  /** Enable healthcare-specific metrics */
  enableHealthcareMetrics: boolean;
  /** Enable performance timing metrics */
  enablePerformanceMetrics: boolean;
  /** Enable user activity metrics */
  enableUserMetrics: boolean;
  /** Enable error metrics */
  enableErrorMetrics: boolean;
  /** Batch size for metric submissions */
  batchSize: number;
  /** Flush interval in milliseconds */
  flushInterval: number;
  /** Metric retention period in days */
  retentionDays: number;
  /** Custom metric tags to include */
  defaultTags: Record<string, string>;
  /** Exclude certain paths from metrics */
  excludePaths: string[];
  /** Enable real-time alerts */
  enableAlerts: boolean;
  /** Threshold configurations for alerts */
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
    environment: process.env.NODE_ENV || 'development'
  },
  excludePaths: ['/health', '/metrics', '/favicon.ico'],
  enableAlerts: true,
  alertThresholds: {
    responseTime: 2000, // 2 seconds
    errorRate: 0.05,    // 5%
    memoryUsage: 0.85,  // 85%
    cpuUsage: 0.80      // 80%
  }
};

/**
 * Metrics context for request processing
 */
interface MetricsContext {
  requestId: string;
  startTime: number;
  timestamp: Date;
  user?: HealthcareUser;
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
    private onFlush: (metrics: MetricData[]) => Promise<void>
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
    const totalMemory = require('os').totalmem();
    const freeMemory = require('os').freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUtilization = usedMemory / totalMemory;

    metrics.push({
      name: 'system.memory.heap_used',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: memUsage.heapUsed,
      timestamp: now,
      tags: { ...tags, unit: 'bytes' },
      unit: 'bytes'
    });

    metrics.push({
      name: 'system.memory.utilization',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: memoryUtilization,
      timestamp: now,
      tags: { ...tags, unit: 'percent' },
      unit: 'percent'
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
      unit: 'seconds'
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
      unit: 'ms'
    });

    return metrics;
  }

  public checkThresholds(memoryUtilization: number, cpuUtilization: number): string[] {
    const alerts: string[] = [];

    if (memoryUtilization > this.memoryThreshold) {
      alerts.push(`Memory utilization ${(memoryUtilization * 100).toFixed(2)}% exceeds threshold ${(this.memoryThreshold * 100).toFixed(2)}%`);
    }

    if (cpuUtilization > this.cpuThreshold) {
      alerts.push(`CPU utilization ${(cpuUtilization * 100).toFixed(2)}% exceeds threshold ${(this.cpuThreshold * 100).toFixed(2)}%`);
    }

    return alerts;
  }
}

/**
 * Enterprise metrics middleware with healthcare compliance
 */
export class MetricsMiddleware implements IMiddleware {
  public readonly name = 'MetricsMiddleware';
  public readonly version = '1.0.0';
  
  private config: IMetricsConfig;
  private metricsStore: MetricsStore;
  private systemCollector: SystemMetricsCollector;
  private requestCounts: Map<string, number> = new Map();
  private errorCounts: Map<string, number> = new Map();
  private responseTimeBuckets: Map<string, number[]> = new Map();

  constructor(config: Partial<IMetricsConfig> = {}) {
    this.config = { ...DEFAULT_METRICS_CONFIG, ...config };
    
    if (this.config.enabled) {
      this.metricsStore = new MetricsStore(
        this.config.batchSize,
        this.config.flushInterval,
        this.onMetricsFlush.bind(this)
      );

      this.systemCollector = new SystemMetricsCollector(
        this.config.alertThresholds.memoryUsage,
        this.config.alertThresholds.cpuUsage
      );

      // Start periodic system metrics collection
      setInterval(() => {
        if (this.shouldSample()) {
          this.collectSystemMetrics();
        }
      }, 60000); // Every minute
    }
  }

  /**
   * Required execute method for IMiddleware interface
   */
  public async execute(
    request: IRequest, 
    response: IResponse, 
    next: INextFunction, 
    _context: MiddlewareContext
  ): Promise<void> {
    if (!this.config.enabled || !this.shouldSample()) {
      next.call();
      return;
    }

    // Skip excluded paths
    if (this.config.excludePaths.some(path => request.path.includes(path))) {
      next.call();
      return;
    }

    const metricsContext = this.createContext(request);
    
    try {
      // Collect request metrics
      await this.collectRequestMetrics(metricsContext);
      
      // Enhance response object to capture metrics on completion
      this.instrumentResponse(response, metricsContext);
      
      next.call();
    } catch (error) {
      console.error('[MetricsMiddleware] Error collecting metrics:', error);
      next.call(error as Error);
    }
  }

  /**
   * Create metrics context from request
   */
  private createContext(req: IRequest): MetricsContext {
    const user = req.user as HealthcareUser | undefined;
    
    return {
      requestId: req.headers['x-request-id'] as string || this.generateRequestId(),
      startTime: Date.now(),
      timestamp: new Date(),
      user,
      method: req.method,
      path: req.path || req.url,
      facility: user?.facilityId || null,
      userAgent: req.headers['user-agent'] as string || 'Unknown',
      clientIP: this.getClientIP(req),
      bytes: {
        in: this.calculateRequestSize(req),
        out: 0
      }
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
  private getClientIP(req: IRequest): string {
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
  private calculateRequestSize(req: IRequest): number {
    let size = 0;
    
    // Headers size
    Object.entries(req.headers).forEach(([key, value]) => {
      size += key.length + (Array.isArray(value) ? value.join('').length : String(value).length);
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
      user_role: context.user?.role || 'anonymous'
    };

    // Request counter
    this.recordMetric({
      name: 'http.requests.total',
      type: MetricType.COUNTER,
      category: HealthcareMetricCategory.USAGE,
      value: 1,
      timestamp: context.timestamp,
      tags,
      description: 'Total number of HTTP requests'
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
  private instrumentResponse(response: IResponse, context: MetricsContext): void {
    const originalEnd = response.end;
    const originalJson = response.json;
    
    // Wrap response.end
    response.end = function(this: any, ...args: any[]) {
      context.responseTime = Date.now() - context.startTime;
      context.statusCode = response.statusCode;
      
      // Calculate response size
      if (args.length > 0 && args[0]) {
        const responseData = args[0];
        context.bytes!.out = Buffer.byteLength(
          typeof responseData === 'string' ? responseData : JSON.stringify(responseData),
          'utf8'
        );
      }
      
      // Collect response metrics asynchronously
      const self = this;
      setImmediate(() => {
        self.collectResponseMetrics(context);
      });
      
      return originalEnd.apply(this, args);
    }.bind(this);

    // Wrap response.json
    response.json = function(this: any, data: any) {
      context.bytes!.out = Buffer.byteLength(JSON.stringify(data), 'utf8');
      return originalJson.call(this, data);
    };
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
      user_role: context.user?.role || 'anonymous'
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
        description: 'HTTP request duration in milliseconds'
      });

      // Check response time thresholds
      if (this.config.enableAlerts && context.responseTime > this.config.alertThresholds.responseTime) {
        console.warn(`[ALERT] Slow response detected: ${context.responseTime}ms for ${context.method} ${context.path}`);
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
        description: 'Total number of HTTP errors'
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
      unit: 'bytes'
    });

    this.recordMetric({
      name: 'http.response.bytes.out',
      type: MetricType.HISTOGRAM,
      category: HealthcareMetricCategory.USAGE,
      value: context.bytes?.out || 0,
      timestamp: new Date(),
      tags: { ...tags, unit: 'bytes' },
      unit: 'bytes'
    });
  }

  /**
   * Collect user-specific metrics
   */
  private async collectUserMetrics(context: MetricsContext, tags: Record<string, string>): Promise<void> {
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
        facility: context.user.facilityId || 'unknown'
      },
      description: 'User activity counter'
    });
  }

  /**
   * Collect healthcare-specific metrics
   */
  private async collectHealthcareMetrics(context: MetricsContext, tags: Record<string, string>): Promise<void> {
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
          user_role: context.user?.role || 'anonymous'
        },
        description: 'PHI access events'
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
        description: 'Emergency access events'
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
        description: 'Medication administration events'
      });
    }
  }

  /**
   * Collect system-wide metrics
   */
  private collectSystemMetrics(): void {
    const metrics = this.systemCollector.collectSystemMetrics(this.config.defaultTags);
    metrics.forEach(metric => this.recordMetric(metric));
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
      '/api/immunizations'
    ];
    
    return phiPaths.some(phiPath => path.startsWith(phiPath));
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
      console.log(`[MetricsMiddleware] Flushing ${metrics.length} metrics`);
      
      // Group metrics by category for structured logging
      const groupedMetrics = this.groupMetricsByCategory(metrics);
      
      for (const [category, categoryMetrics] of Object.entries(groupedMetrics)) {
        console.log(`[METRICS][${category}] ${categoryMetrics.length} metrics:`, 
          JSON.stringify(categoryMetrics, null, 2));
      }
      
    } catch (error) {
      console.error('[MetricsMiddleware] Error in metrics flush:', error);
      throw error;
    }
  }

  /**
   * Group metrics by category for organized output
   */
  private groupMetricsByCategory(metrics: MetricData[]): Record<string, MetricData[]> {
    return metrics.reduce((groups, metric) => {
      const category = metric.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(metric);
      return groups;
    }, {} as Record<string, MetricData[]>);
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
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.metricsStore) {
      this.metricsStore.destroy();
    }
  }
}

/**
 * Factory function to create metrics middleware with healthcare defaults
 */
export function createMetricsMiddleware(config: Partial<IMetricsConfig> = {}): MetricsMiddleware {
  const healthcareConfig: Partial<IMetricsConfig> = {
    enabled: true,
    sampleRate: 0.1, // 10% sampling for production
    enableHealthcareMetrics: true,
    enablePerformanceMetrics: true,
    enableUserMetrics: true,
    enableErrorMetrics: true,
    retentionDays: 90, // HIPAA compliance
    defaultTags: {
      service: 'white-cross-healthcare',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    },
    excludePaths: ['/health', '/metrics', '/favicon.ico', '/.well-known'],
    ...config
  };

  return new MetricsMiddleware(healthcareConfig);
}

export default MetricsMiddleware;
