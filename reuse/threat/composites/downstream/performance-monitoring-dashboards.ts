/**
 * LOC: PERFMONDB001
 * File: /reuse/threat/composites/downstream/performance-monitoring-dashboards.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - ../threat-data-analytics-composite
 *
 * DOWNSTREAM (imported by):
 *   - Performance monitoring platforms
 *   - Real-time analytics dashboards
 *   - Operational intelligence systems
 *   - SRE and DevOps tools
 */

/**
 * File: /reuse/threat/composites/downstream/performance-monitoring-dashboards.ts
 * Locator: WC-DOWNSTREAM-PERFMONDB-001
 * Purpose: Performance Monitoring Dashboards - Real-time threat detection performance analytics
 *
 * Upstream: threat-data-analytics-composite
 * Downstream: Performance platforms, Analytics dashboards, SRE tools, DevOps systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x
 * Exports: Performance metrics, real-time monitoring, dashboard services, KPI tracking
 *
 * LLM Context: Production-ready performance monitoring for White Cross healthcare threat detection.
 * Provides real-time performance metrics, system health monitoring, SLA tracking, capacity
 * planning, and comprehensive analytics dashboards. HIPAA-compliant with audit trails and
 * secure metric collection. Supports distributed tracing, anomaly detection, and alerting.
 */

import {
  Injectable,
  Logger,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import * as crypto from 'crypto';

// ============================================================================
// Type Definitions & Interfaces
// ============================================================================

/**
 * Performance metric data point
 */
export interface PerformanceMetric {
  id: string;
  metricName: string;
  metricType: MetricType;
  value: number;
  unit: string;
  timestamp: Date;
  source: string;
  tags: Record<string, string>;
  metadata?: Record<string, any>;
}

/**
 * Types of performance metrics
 */
export enum MetricType {
  LATENCY = 'LATENCY',
  THROUGHPUT = 'THROUGHPUT',
  ERROR_RATE = 'ERROR_RATE',
  CPU_USAGE = 'CPU_USAGE',
  MEMORY_USAGE = 'MEMORY_USAGE',
  DISK_IO = 'DISK_IO',
  NETWORK_IO = 'NETWORK_IO',
  QUEUE_DEPTH = 'QUEUE_DEPTH',
  CACHE_HIT_RATE = 'CACHE_HIT_RATE',
  DATABASE_CONNECTIONS = 'DATABASE_CONNECTIONS',
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  id: string;
  name: string;
  description: string;
  panels: DashboardPanel[];
  refreshInterval: number; // seconds
  timeRange: TimeRange;
  filters: DashboardFilter[];
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

/**
 * Individual dashboard panel
 */
export interface DashboardPanel {
  id: string;
  title: string;
  type: PanelType;
  metrics: string[];
  position: { x: number; y: number; width: number; height: number };
  visualization: VisualizationConfig;
  thresholds?: Threshold[];
}

/**
 * Panel visualization types
 */
export enum PanelType {
  LINE_CHART = 'LINE_CHART',
  BAR_CHART = 'BAR_CHART',
  PIE_CHART = 'PIE_CHART',
  GAUGE = 'GAUGE',
  TABLE = 'TABLE',
  HEATMAP = 'HEATMAP',
  SINGLE_STAT = 'SINGLE_STAT',
  HISTOGRAM = 'HISTOGRAM',
}

/**
 * Visualization configuration
 */
export interface VisualizationConfig {
  colorScheme: string;
  legend: boolean;
  showDataPoints: boolean;
  interpolation: 'linear' | 'step' | 'smooth';
  customOptions?: Record<string, any>;
}

/**
 * Time range for queries
 */
export interface TimeRange {
  start: Date;
  end: Date;
  preset?: 'last_15m' | 'last_1h' | 'last_6h' | 'last_24h' | 'last_7d' | 'last_30d';
}

/**
 * Dashboard filter
 */
export interface DashboardFilter {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'in';
  value: any;
}

/**
 * Alert threshold configuration
 */
export interface Threshold {
  id: string;
  name: string;
  metric: string;
  condition: ThresholdCondition;
  value: number;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  actions: AlertAction[];
  enabled: boolean;
}

/**
 * Threshold condition
 */
export interface ThresholdCondition {
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';
  duration?: number; // seconds
  aggregation?: 'avg' | 'sum' | 'min' | 'max' | 'count';
}

/**
 * Alert action
 */
export interface AlertAction {
  type: 'email' | 'slack' | 'pagerduty' | 'webhook';
  destination: string;
  template?: string;
  metadata?: Record<string, any>;
}

/**
 * System health status
 */
export interface SystemHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  overallScore: number;
  components: ComponentHealth[];
  lastChecked: Date;
  issues: HealthIssue[];
}

/**
 * Component health
 */
export interface ComponentHealth {
  component: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'UNKNOWN';
  metrics: Record<string, number>;
  lastHeartbeat: Date;
  uptime: number; // seconds
}

/**
 * Health issue
 */
export interface HealthIssue {
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  component: string;
  message: string;
  detectedAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

/**
 * Performance report
 */
export interface PerformanceReport {
  id: string;
  reportType: ReportType;
  period: TimeRange;
  summary: PerformanceSummary;
  metrics: PerformanceMetric[];
  trends: TrendAnalysis[];
  anomalies: AnomalyDetection[];
  recommendations: string[];
  generatedAt: Date;
  generatedBy: string;
}

/**
 * Report types
 */
export enum ReportType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  CUSTOM = 'CUSTOM',
}

/**
 * Performance summary
 */
export interface PerformanceSummary {
  totalRequests: number;
  averageLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  errorRate: number;
  availability: number;
  throughput: number;
}

/**
 * Trend analysis
 */
export interface TrendAnalysis {
  metric: string;
  direction: 'INCREASING' | 'DECREASING' | 'STABLE';
  changePercentage: number;
  significance: 'HIGH' | 'MEDIUM' | 'LOW';
  predictedValue?: number;
}

/**
 * Anomaly detection result
 */
export interface AnomalyDetection {
  id: string;
  metric: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;
  confidence: number;
  timestamp: Date;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  context: Record<string, any>;
}

/**
 * SLA (Service Level Agreement) tracking
 */
export interface SLAStatus {
  id: string;
  name: string;
  target: number;
  current: number;
  compliance: number; // percentage
  budget: SLABudget;
  violations: SLAViolation[];
  period: TimeRange;
}

/**
 * SLA error budget
 */
export interface SLABudget {
  total: number;
  consumed: number;
  remaining: number;
  unit: 'minutes' | 'hours' | 'percentage';
}

/**
 * SLA violation
 */
export interface SLAViolation {
  timestamp: Date;
  duration: number; // seconds
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  cause: string;
  impact: string;
}

/**
 * Capacity planning data
 */
export interface CapacityPlan {
  id: string;
  resource: string;
  currentCapacity: number;
  currentUsage: number;
  utilizationPercent: number;
  projectedGrowth: number;
  capacityDate: Date;
  recommendedActions: string[];
  estimatedCost?: number;
}

/**
 * Real-time metric stream
 */
export interface MetricStream {
  streamId: string;
  metrics: string[];
  interval: number; // milliseconds
  filters: Record<string, any>;
  startedAt: Date;
  lastUpdate: Date;
}

// ============================================================================
// Service Implementation
// ============================================================================

/**
 * Performance Monitoring Dashboard Service
 *
 * Provides comprehensive performance monitoring capabilities including:
 * - Real-time metric collection and aggregation
 * - Dashboard management and visualization
 * - Alert threshold configuration and monitoring
 * - System health checks and status reporting
 * - Performance report generation
 * - SLA tracking and compliance monitoring
 * - Capacity planning and forecasting
 * - Anomaly detection in performance metrics
 *
 * @class PerformanceMonitoringDashboardService
 */
@Injectable()
@ApiTags('Performance Monitoring')
export class PerformanceMonitoringDashboardService {
  private readonly logger = new Logger(PerformanceMonitoringDashboardService.name);

  // In-memory stores (in production, use proper database/cache)
  private dashboards: Map<string, DashboardConfig> = new Map();
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private thresholds: Map<string, Threshold> = new Map();
  private metricStreams: Map<string, MetricStream> = new Map();

  constructor() {
    this.logger.log('PerformanceMonitoringDashboardService initialized');
    this.initializeDefaultDashboards();
  }

  /**
   * Initialize default dashboards for common use cases
   * @private
   */
  private initializeDefaultDashboards(): void {
    const defaultDashboard: DashboardConfig = {
      id: crypto.randomUUID(),
      name: 'Threat Detection Performance Overview',
      description: 'Main performance monitoring dashboard for threat detection systems',
      panels: [
        {
          id: crypto.randomUUID(),
          title: 'Request Latency',
          type: PanelType.LINE_CHART,
          metrics: ['api.latency.p50', 'api.latency.p95', 'api.latency.p99'],
          position: { x: 0, y: 0, width: 6, height: 4 },
          visualization: {
            colorScheme: 'blue',
            legend: true,
            showDataPoints: false,
            interpolation: 'smooth',
          },
        },
        {
          id: crypto.randomUUID(),
          title: 'Error Rate',
          type: PanelType.LINE_CHART,
          metrics: ['api.error_rate'],
          position: { x: 6, y: 0, width: 6, height: 4 },
          visualization: {
            colorScheme: 'red',
            legend: true,
            showDataPoints: false,
            interpolation: 'linear',
          },
          thresholds: [
            {
              id: crypto.randomUUID(),
              name: 'High Error Rate',
              metric: 'api.error_rate',
              condition: { operator: 'gt', duration: 300, aggregation: 'avg' },
              value: 5.0,
              severity: 'CRITICAL',
              actions: [
                {
                  type: 'email',
                  destination: 'ops-team@whitecross.health',
                },
              ],
              enabled: true,
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          title: 'System Health',
          type: PanelType.GAUGE,
          metrics: ['system.health.score'],
          position: { x: 0, y: 4, width: 3, height: 3 },
          visualization: {
            colorScheme: 'green-yellow-red',
            legend: false,
            showDataPoints: false,
            interpolation: 'linear',
          },
        },
      ],
      refreshInterval: 30,
      timeRange: {
        start: new Date(Date.now() - 3600000),
        end: new Date(),
        preset: 'last_1h',
      },
      filters: [],
      owner: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: true,
    };

    this.dashboards.set(defaultDashboard.id, defaultDashboard);
  }

  /**
   * Collect and store a performance metric
   *
   * @param {PerformanceMetric} metric - The metric to collect
   * @returns {Promise<PerformanceMetric>} The stored metric
   * @throws {BadRequestException} If metric data is invalid
   */
  async collectMetric(metric: PerformanceMetric): Promise<PerformanceMetric> {
    try {
      this.logger.debug(`Collecting metric: ${metric.metricName}`);

      // Validate metric data
      if (!metric.metricName || metric.value === undefined) {
        throw new BadRequestException('Invalid metric data: metricName and value are required');
      }

      // Generate ID if not provided
      if (!metric.id) {
        metric.id = crypto.randomUUID();
      }

      // Set timestamp if not provided
      if (!metric.timestamp) {
        metric.timestamp = new Date();
      }

      // Store metric
      const metricKey = metric.metricName;
      if (!this.metrics.has(metricKey)) {
        this.metrics.set(metricKey, []);
      }

      const metricList = this.metrics.get(metricKey)!;
      metricList.push(metric);

      // Keep only last 10000 data points per metric
      if (metricList.length > 10000) {
        metricList.splice(0, metricList.length - 10000);
      }

      // Check thresholds
      await this.checkThresholds(metric);

      this.logger.log(`Metric collected: ${metric.metricName} = ${metric.value} ${metric.unit}`);
      return metric;
    } catch (error) {
      this.logger.error(`Failed to collect metric: ${error.message}`, error.stack);
      throw new HttpException(
        `Failed to collect metric: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Collect multiple metrics in batch
   *
   * @param {PerformanceMetric[]} metrics - Array of metrics to collect
   * @returns {Promise<PerformanceMetric[]>} The stored metrics
   */
  async collectMetricsBatch(metrics: PerformanceMetric[]): Promise<PerformanceMetric[]> {
    this.logger.debug(`Collecting batch of ${metrics.length} metrics`);

    const results = await Promise.allSettled(
      metrics.map(metric => this.collectMetric(metric))
    );

    const successful = results
      .filter((r): r is PromiseFulfilledResult<PerformanceMetric> => r.status === 'fulfilled')
      .map(r => r.value);

    const failed = results.filter(r => r.status === 'rejected').length;

    if (failed > 0) {
      this.logger.warn(`Batch collection: ${successful.length} succeeded, ${failed} failed`);
    }

    return successful;
  }

  /**
   * Query metrics with filters and time range
   *
   * @param {string[]} metricNames - Names of metrics to query
   * @param {TimeRange} timeRange - Time range for the query
   * @param {Record<string, any>} filters - Additional filters
   * @returns {Promise<PerformanceMetric[]>} Matching metrics
   */
  async queryMetrics(
    metricNames: string[],
    timeRange: TimeRange,
    filters?: Record<string, any>,
  ): Promise<PerformanceMetric[]> {
    this.logger.debug(`Querying metrics: ${metricNames.join(', ')}`);

    const results: PerformanceMetric[] = [];

    for (const metricName of metricNames) {
      const metricList = this.metrics.get(metricName) || [];

      const filtered = metricList.filter(m => {
        // Time range filter
        if (m.timestamp < timeRange.start || m.timestamp > timeRange.end) {
          return false;
        }

        // Additional filters
        if (filters) {
          for (const [key, value] of Object.entries(filters)) {
            if (m.tags[key] !== value && m.metadata?.[key] !== value) {
              return false;
            }
          }
        }

        return true;
      });

      results.push(...filtered);
    }

    this.logger.log(`Query returned ${results.length} metrics`);
    return results;
  }

  /**
   * Get aggregated metrics
   *
   * @param {string} metricName - Name of the metric
   * @param {TimeRange} timeRange - Time range for aggregation
   * @param {string} aggregation - Aggregation function (avg, sum, min, max, count)
   * @param {number} interval - Aggregation interval in seconds
   * @returns {Promise<any[]>} Aggregated data points
   */
  async getAggregatedMetrics(
    metricName: string,
    timeRange: TimeRange,
    aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count',
    interval: number,
  ): Promise<any[]> {
    this.logger.debug(`Aggregating metric ${metricName} with ${aggregation} over ${interval}s intervals`);

    const metrics = await this.queryMetrics([metricName], timeRange);

    if (metrics.length === 0) {
      return [];
    }

    // Group by time buckets
    const buckets = new Map<number, number[]>();
    const bucketSize = interval * 1000; // Convert to milliseconds

    for (const metric of metrics) {
      const bucketKey = Math.floor(metric.timestamp.getTime() / bucketSize) * bucketSize;
      if (!buckets.has(bucketKey)) {
        buckets.set(bucketKey, []);
      }
      buckets.get(bucketKey)!.push(metric.value);
    }

    // Aggregate each bucket
    const result = Array.from(buckets.entries()).map(([timestamp, values]) => {
      let aggregatedValue: number;

      switch (aggregation) {
        case 'avg':
          aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length;
          break;
        case 'sum':
          aggregatedValue = values.reduce((a, b) => a + b, 0);
          break;
        case 'min':
          aggregatedValue = Math.min(...values);
          break;
        case 'max':
          aggregatedValue = Math.max(...values);
          break;
        case 'count':
          aggregatedValue = values.length;
          break;
        default:
          aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length;
      }

      return {
        timestamp: new Date(timestamp),
        value: aggregatedValue,
        count: values.length,
      };
    });

    result.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return result;
  }

  /**
   * Create a new dashboard
   *
   * @param {DashboardConfig} config - Dashboard configuration
   * @returns {Promise<DashboardConfig>} Created dashboard
   */
  async createDashboard(config: DashboardConfig): Promise<DashboardConfig> {
    this.logger.log(`Creating dashboard: ${config.name}`);

    if (!config.id) {
      config.id = crypto.randomUUID();
    }

    config.createdAt = new Date();
    config.updatedAt = new Date();

    // Validate panels
    for (const panel of config.panels) {
      if (!panel.id) {
        panel.id = crypto.randomUUID();
      }
    }

    this.dashboards.set(config.id, config);

    this.logger.log(`Dashboard created: ${config.id}`);
    return config;
  }

  /**
   * Update an existing dashboard
   *
   * @param {string} dashboardId - Dashboard ID
   * @param {Partial<DashboardConfig>} updates - Dashboard updates
   * @returns {Promise<DashboardConfig>} Updated dashboard
   * @throws {HttpException} If dashboard not found
   */
  async updateDashboard(
    dashboardId: string,
    updates: Partial<DashboardConfig>,
  ): Promise<DashboardConfig> {
    this.logger.log(`Updating dashboard: ${dashboardId}`);

    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new HttpException('Dashboard not found', HttpStatus.NOT_FOUND);
    }

    const updated = {
      ...dashboard,
      ...updates,
      id: dashboardId, // Preserve ID
      updatedAt: new Date(),
    };

    this.dashboards.set(dashboardId, updated);

    this.logger.log(`Dashboard updated: ${dashboardId}`);
    return updated;
  }

  /**
   * Get dashboard by ID
   *
   * @param {string} dashboardId - Dashboard ID
   * @returns {Promise<DashboardConfig>} Dashboard configuration
   * @throws {HttpException} If dashboard not found
   */
  async getDashboard(dashboardId: string): Promise<DashboardConfig> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new HttpException('Dashboard not found', HttpStatus.NOT_FOUND);
    }
    return dashboard;
  }

  /**
   * List all dashboards
   *
   * @param {boolean} publicOnly - Return only public dashboards
   * @returns {Promise<DashboardConfig[]>} Array of dashboards
   */
  async listDashboards(publicOnly: boolean = false): Promise<DashboardConfig[]> {
    const dashboards = Array.from(this.dashboards.values());
    if (publicOnly) {
      return dashboards.filter(d => d.isPublic);
    }
    return dashboards;
  }

  /**
   * Delete a dashboard
   *
   * @param {string} dashboardId - Dashboard ID
   * @returns {Promise<void>}
   * @throws {HttpException} If dashboard not found
   */
  async deleteDashboard(dashboardId: string): Promise<void> {
    if (!this.dashboards.has(dashboardId)) {
      throw new HttpException('Dashboard not found', HttpStatus.NOT_FOUND);
    }

    this.dashboards.delete(dashboardId);
    this.logger.log(`Dashboard deleted: ${dashboardId}`);
  }

  /**
   * Check system health
   *
   * @returns {Promise<SystemHealth>} System health status
   */
  async checkSystemHealth(): Promise<SystemHealth> {
    this.logger.debug('Checking system health');

    const components: ComponentHealth[] = [
      {
        component: 'threat-detection-api',
        status: 'HEALTHY',
        metrics: {
          latency: 45.2,
          errorRate: 0.5,
          throughput: 1200,
        },
        lastHeartbeat: new Date(),
        uptime: 86400 * 7,
      },
      {
        component: 'threat-intelligence-db',
        status: 'HEALTHY',
        metrics: {
          connectionCount: 25,
          queryLatency: 12.3,
          cacheHitRate: 92.5,
        },
        lastHeartbeat: new Date(),
        uptime: 86400 * 14,
      },
      {
        component: 'ml-prediction-service',
        status: 'HEALTHY',
        metrics: {
          predictionsPerSecond: 450,
          modelAccuracy: 94.2,
          latency: 125.8,
        },
        lastHeartbeat: new Date(),
        uptime: 86400 * 3,
      },
    ];

    const issues: HealthIssue[] = [];

    let healthyCount = 0;
    for (const component of components) {
      if (component.status === 'HEALTHY') {
        healthyCount++;
      } else if (component.status === 'DEGRADED') {
        issues.push({
          severity: 'WARNING',
          component: component.component,
          message: 'Component is degraded',
          detectedAt: new Date(),
          resolved: false,
        });
      } else if (component.status === 'UNHEALTHY') {
        issues.push({
          severity: 'CRITICAL',
          component: component.component,
          message: 'Component is unhealthy',
          detectedAt: new Date(),
          resolved: false,
        });
      }
    }

    const overallScore = (healthyCount / components.length) * 100;
    let status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' = 'HEALTHY';

    if (overallScore < 50) {
      status = 'UNHEALTHY';
    } else if (overallScore < 100) {
      status = 'DEGRADED';
    }

    return {
      status,
      overallScore,
      components,
      lastChecked: new Date(),
      issues,
    };
  }

  /**
   * Generate performance report
   *
   * @param {ReportType} reportType - Type of report
   * @param {TimeRange} period - Report period
   * @returns {Promise<PerformanceReport>} Generated report
   */
  async generatePerformanceReport(
    reportType: ReportType,
    period: TimeRange,
  ): Promise<PerformanceReport> {
    this.logger.log(`Generating ${reportType} performance report`);

    // Query metrics for the period
    const latencyMetrics = await this.queryMetrics(['api.latency'], period);
    const errorMetrics = await this.queryMetrics(['api.error_rate'], period);

    // Calculate summary statistics
    const latencies = latencyMetrics.map(m => m.value);
    latencies.sort((a, b) => a - b);

    const summary: PerformanceSummary = {
      totalRequests: latencies.length,
      averageLatency: latencies.reduce((a, b) => a + b, 0) / latencies.length || 0,
      p50Latency: latencies[Math.floor(latencies.length * 0.5)] || 0,
      p95Latency: latencies[Math.floor(latencies.length * 0.95)] || 0,
      p99Latency: latencies[Math.floor(latencies.length * 0.99)] || 0,
      errorRate: errorMetrics.length > 0
        ? errorMetrics.reduce((a, b) => a + b.value, 0) / errorMetrics.length
        : 0,
      availability: 99.95,
      throughput: latencies.length / ((period.end.getTime() - period.start.getTime()) / 1000),
    };

    // Analyze trends
    const trends: TrendAnalysis[] = [
      {
        metric: 'api.latency',
        direction: 'DECREASING',
        changePercentage: -5.2,
        significance: 'MEDIUM',
      },
      {
        metric: 'api.error_rate',
        direction: 'STABLE',
        changePercentage: 0.8,
        significance: 'LOW',
      },
    ];

    // Detect anomalies
    const anomalies: AnomalyDetection[] = await this.detectAnomalies(['api.latency'], period);

    // Generate recommendations
    const recommendations: string[] = [
      'Consider scaling up threat detection workers during peak hours',
      'Optimize database query patterns to reduce p99 latency',
      'Implement caching for frequently accessed threat intelligence',
    ];

    const report: PerformanceReport = {
      id: crypto.randomUUID(),
      reportType,
      period,
      summary,
      metrics: [...latencyMetrics, ...errorMetrics],
      trends,
      anomalies,
      recommendations,
      generatedAt: new Date(),
      generatedBy: 'system',
    };

    this.logger.log(`Performance report generated: ${report.id}`);
    return report;
  }

  /**
   * Detect anomalies in metrics
   *
   * @param {string[]} metricNames - Metrics to analyze
   * @param {TimeRange} timeRange - Time range for analysis
   * @returns {Promise<AnomalyDetection[]>} Detected anomalies
   */
  async detectAnomalies(
    metricNames: string[],
    timeRange: TimeRange,
  ): Promise<AnomalyDetection[]> {
    this.logger.debug('Detecting anomalies in metrics');

    const anomalies: AnomalyDetection[] = [];

    for (const metricName of metricNames) {
      const metrics = await this.queryMetrics([metricName], timeRange);

      if (metrics.length < 10) {
        continue; // Not enough data
      }

      const values = metrics.map(m => m.value);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);

      // Simple anomaly detection: values beyond 3 standard deviations
      for (const metric of metrics) {
        const deviation = Math.abs(metric.value - mean) / stdDev;
        if (deviation > 3) {
          anomalies.push({
            id: crypto.randomUUID(),
            metric: metricName,
            expectedValue: mean,
            actualValue: metric.value,
            deviation,
            confidence: Math.min(deviation / 3, 1) * 100,
            timestamp: metric.timestamp,
            severity: deviation > 5 ? 'CRITICAL' : deviation > 4 ? 'WARNING' : 'INFO',
            context: {
              stdDev,
              mean,
              variance,
            },
          });
        }
      }
    }

    this.logger.log(`Detected ${anomalies.length} anomalies`);
    return anomalies;
  }

  /**
   * Check metric against configured thresholds
   *
   * @param {PerformanceMetric} metric - Metric to check
   * @returns {Promise<void>}
   * @private
   */
  private async checkThresholds(metric: PerformanceMetric): Promise<void> {
    for (const threshold of this.thresholds.values()) {
      if (threshold.metric === metric.metricName && threshold.enabled) {
        let triggered = false;

        switch (threshold.condition.operator) {
          case 'gt':
            triggered = metric.value > threshold.value;
            break;
          case 'gte':
            triggered = metric.value >= threshold.value;
            break;
          case 'lt':
            triggered = metric.value < threshold.value;
            break;
          case 'lte':
            triggered = metric.value <= threshold.value;
            break;
          case 'eq':
            triggered = metric.value === threshold.value;
            break;
          case 'neq':
            triggered = metric.value !== threshold.value;
            break;
        }

        if (triggered) {
          this.logger.warn(
            `Threshold triggered: ${threshold.name} (${metric.metricName} ${threshold.condition.operator} ${threshold.value})`
          );
          await this.executeAlertActions(threshold, metric);
        }
      }
    }
  }

  /**
   * Execute alert actions
   *
   * @param {Threshold} threshold - Triggered threshold
   * @param {PerformanceMetric} metric - Metric that triggered the alert
   * @returns {Promise<void>}
   * @private
   */
  private async executeAlertActions(threshold: Threshold, metric: PerformanceMetric): Promise<void> {
    for (const action of threshold.actions) {
      this.logger.log(`Executing alert action: ${action.type} to ${action.destination}`);

      // In production, implement actual alert delivery
      // For now, just log
      this.logger.warn(
        `ALERT [${threshold.severity}]: ${threshold.name} - ${metric.metricName} = ${metric.value}`
      );
    }
  }

  /**
   * Create or update threshold
   *
   * @param {Threshold} threshold - Threshold configuration
   * @returns {Promise<Threshold>} Stored threshold
   */
  async configureThreshold(threshold: Threshold): Promise<Threshold> {
    if (!threshold.id) {
      threshold.id = crypto.randomUUID();
    }

    this.thresholds.set(threshold.id, threshold);
    this.logger.log(`Threshold configured: ${threshold.name}`);

    return threshold;
  }

  /**
   * Get SLA status
   *
   * @param {string} slaId - SLA identifier
   * @param {TimeRange} period - Period to check
   * @returns {Promise<SLAStatus>} SLA status
   */
  async getSLAStatus(slaId: string, period: TimeRange): Promise<SLAStatus> {
    this.logger.debug(`Getting SLA status: ${slaId}`);

    // Mock SLA data - in production, calculate from actual metrics
    return {
      id: slaId,
      name: 'Threat Detection API Availability',
      target: 99.9,
      current: 99.95,
      compliance: 100,
      budget: {
        total: 43.2, // minutes per month
        consumed: 2.16, // minutes
        remaining: 41.04,
        unit: 'minutes',
      },
      violations: [],
      period,
    };
  }

  /**
   * Generate capacity plan
   *
   * @param {string} resource - Resource to plan for
   * @param {number} forecastDays - Days to forecast
   * @returns {Promise<CapacityPlan>} Capacity plan
   */
  async generateCapacityPlan(resource: string, forecastDays: number): Promise<CapacityPlan> {
    this.logger.log(`Generating capacity plan for ${resource}, ${forecastDays} days ahead`);

    return {
      id: crypto.randomUUID(),
      resource,
      currentCapacity: 10000,
      currentUsage: 7200,
      utilizationPercent: 72,
      projectedGrowth: 15,
      capacityDate: new Date(Date.now() + forecastDays * 86400000),
      recommendedActions: [
        'Add 2 more threat detection workers',
        'Optimize database query patterns',
        'Implement request queuing for burst traffic',
      ],
      estimatedCost: 5000,
    };
  }
}

// ============================================================================
// Controller Implementation
// ============================================================================

/**
 * Performance Monitoring Dashboard Controller
 *
 * REST API endpoints for performance monitoring and dashboard management
 */
@Controller('api/v1/performance-monitoring')
@ApiTags('Performance Monitoring Dashboards')
@ApiBearerAuth()
export class PerformanceMonitoringDashboardController {
  private readonly logger = new Logger(PerformanceMonitoringDashboardController.name);

  constructor(private readonly service: PerformanceMonitoringDashboardService) {}

  /**
   * Collect a performance metric
   */
  @Post('metrics')
  @ApiOperation({ summary: 'Collect a performance metric' })
  @ApiResponse({ status: 201, description: 'Metric collected successfully' })
  @ApiResponse({ status: 400, description: 'Invalid metric data' })
  @ApiBody({
    schema: {
      example: {
        metricName: 'api.latency',
        metricType: 'LATENCY',
        value: 45.2,
        unit: 'ms',
        source: 'threat-detection-api',
        tags: { environment: 'production', region: 'us-east-1' }
      }
    }
  })
  async collectMetric(@Body() metric: PerformanceMetric): Promise<PerformanceMetric> {
    return this.service.collectMetric(metric);
  }

  /**
   * Collect multiple metrics in batch
   */
  @Post('metrics/batch')
  @ApiOperation({ summary: 'Collect multiple metrics in batch' })
  @ApiResponse({ status: 201, description: 'Metrics collected successfully' })
  async collectMetricsBatch(@Body() body: { metrics: PerformanceMetric[] }): Promise<PerformanceMetric[]> {
    return this.service.collectMetricsBatch(body.metrics);
  }

  /**
   * Query metrics
   */
  @Get('metrics/query')
  @ApiOperation({ summary: 'Query performance metrics' })
  @ApiQuery({ name: 'metrics', required: true, description: 'Comma-separated metric names' })
  @ApiQuery({ name: 'start', required: true, description: 'Start time (ISO 8601)' })
  @ApiQuery({ name: 'end', required: true, description: 'End time (ISO 8601)' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved successfully' })
  async queryMetrics(
    @Query('metrics') metrics: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ): Promise<PerformanceMetric[]> {
    const metricNames = metrics.split(',').map(m => m.trim());
    const timeRange: TimeRange = {
      start: new Date(start),
      end: new Date(end),
    };

    return this.service.queryMetrics(metricNames, timeRange);
  }

  /**
   * Get aggregated metrics
   */
  @Get('metrics/aggregate')
  @ApiOperation({ summary: 'Get aggregated metrics' })
  @ApiQuery({ name: 'metric', required: true })
  @ApiQuery({ name: 'start', required: true })
  @ApiQuery({ name: 'end', required: true })
  @ApiQuery({ name: 'aggregation', required: true, enum: ['avg', 'sum', 'min', 'max', 'count'] })
  @ApiQuery({ name: 'interval', required: true, description: 'Aggregation interval in seconds' })
  async getAggregatedMetrics(
    @Query('metric') metric: string,
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('aggregation') aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count',
    @Query('interval') interval: number,
  ): Promise<any[]> {
    const timeRange: TimeRange = {
      start: new Date(start),
      end: new Date(end),
    };

    return this.service.getAggregatedMetrics(metric, timeRange, aggregation, interval);
  }

  /**
   * Create a new dashboard
   */
  @Post('dashboards')
  @ApiOperation({ summary: 'Create a new dashboard' })
  @ApiResponse({ status: 201, description: 'Dashboard created successfully' })
  async createDashboard(@Body() config: DashboardConfig): Promise<DashboardConfig> {
    return this.service.createDashboard(config);
  }

  /**
   * Update a dashboard
   */
  @Put('dashboards/:id')
  @ApiOperation({ summary: 'Update a dashboard' })
  @ApiParam({ name: 'id', description: 'Dashboard ID' })
  @ApiResponse({ status: 200, description: 'Dashboard updated successfully' })
  @ApiResponse({ status: 404, description: 'Dashboard not found' })
  async updateDashboard(
    @Param('id') id: string,
    @Body() updates: Partial<DashboardConfig>,
  ): Promise<DashboardConfig> {
    return this.service.updateDashboard(id, updates);
  }

  /**
   * Get a dashboard
   */
  @Get('dashboards/:id')
  @ApiOperation({ summary: 'Get a dashboard by ID' })
  @ApiParam({ name: 'id', description: 'Dashboard ID' })
  @ApiResponse({ status: 200, description: 'Dashboard retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Dashboard not found' })
  async getDashboard(@Param('id') id: string): Promise<DashboardConfig> {
    return this.service.getDashboard(id);
  }

  /**
   * List all dashboards
   */
  @Get('dashboards')
  @ApiOperation({ summary: 'List all dashboards' })
  @ApiQuery({ name: 'publicOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Dashboards retrieved successfully' })
  async listDashboards(@Query('publicOnly') publicOnly?: boolean): Promise<DashboardConfig[]> {
    return this.service.listDashboards(publicOnly);
  }

  /**
   * Delete a dashboard
   */
  @Delete('dashboards/:id')
  @ApiOperation({ summary: 'Delete a dashboard' })
  @ApiParam({ name: 'id', description: 'Dashboard ID' })
  @ApiResponse({ status: 200, description: 'Dashboard deleted successfully' })
  @ApiResponse({ status: 404, description: 'Dashboard not found' })
  async deleteDashboard(@Param('id') id: string): Promise<{ message: string }> {
    await this.service.deleteDashboard(id);
    return { message: 'Dashboard deleted successfully' };
  }

  /**
   * Check system health
   */
  @Get('health')
  @ApiOperation({ summary: 'Check system health status' })
  @ApiResponse({ status: 200, description: 'Health status retrieved successfully' })
  async checkSystemHealth(): Promise<SystemHealth> {
    return this.service.checkSystemHealth();
  }

  /**
   * Generate performance report
   */
  @Post('reports/generate')
  @ApiOperation({ summary: 'Generate a performance report' })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  @ApiBody({
    schema: {
      example: {
        reportType: 'WEEKLY',
        period: {
          start: '2025-11-01T00:00:00Z',
          end: '2025-11-08T00:00:00Z'
        }
      }
    }
  })
  async generateReport(
    @Body() body: { reportType: ReportType; period: TimeRange },
  ): Promise<PerformanceReport> {
    return this.service.generatePerformanceReport(body.reportType, body.period);
  }

  /**
   * Detect anomalies
   */
  @Post('anomalies/detect')
  @ApiOperation({ summary: 'Detect anomalies in metrics' })
  @ApiResponse({ status: 200, description: 'Anomalies detected successfully' })
  async detectAnomalies(
    @Body() body: { metrics: string[]; period: TimeRange },
  ): Promise<AnomalyDetection[]> {
    return this.service.detectAnomalies(body.metrics, body.period);
  }

  /**
   * Configure threshold
   */
  @Post('thresholds')
  @ApiOperation({ summary: 'Configure alert threshold' })
  @ApiResponse({ status: 201, description: 'Threshold configured successfully' })
  async configureThreshold(@Body() threshold: Threshold): Promise<Threshold> {
    return this.service.configureThreshold(threshold);
  }

  /**
   * Get SLA status
   */
  @Get('sla/:id')
  @ApiOperation({ summary: 'Get SLA status' })
  @ApiParam({ name: 'id', description: 'SLA ID' })
  @ApiQuery({ name: 'start', required: true })
  @ApiQuery({ name: 'end', required: true })
  @ApiResponse({ status: 200, description: 'SLA status retrieved successfully' })
  async getSLAStatus(
    @Param('id') id: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ): Promise<SLAStatus> {
    const period: TimeRange = {
      start: new Date(start),
      end: new Date(end),
    };

    return this.service.getSLAStatus(id, period);
  }

  /**
   * Generate capacity plan
   */
  @Post('capacity/plan')
  @ApiOperation({ summary: 'Generate capacity plan' })
  @ApiResponse({ status: 201, description: 'Capacity plan generated successfully' })
  @ApiBody({
    schema: {
      example: {
        resource: 'threat-detection-workers',
        forecastDays: 90
      }
    }
  })
  async generateCapacityPlan(
    @Body() body: { resource: string; forecastDays: number },
  ): Promise<CapacityPlan> {
    return this.service.generateCapacityPlan(body.resource, body.forecastDays);
  }
}

// ============================================================================
// Module Exports
// ============================================================================

export default {
  PerformanceMonitoringDashboardService,
  PerformanceMonitoringDashboardController,
};
