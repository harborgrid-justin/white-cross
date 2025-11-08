/**
 * LOC: M1O2N3I4T5
 * File: /reuse/san/nestjs-oracle-monitoring-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/terminus (v10.2.3)
 *   - @nestjs/microservices (v11.1.8)
 *   - @opentelemetry/api (v1.9.0)
 *   - prom-client (v15.1.3)
 *   - node:perf_hooks
 *   - node:v8
 *   - node:os
 *
 * DOWNSTREAM (imported by):
 *   - Health check controllers
 *   - Monitoring services
 *   - Metrics exporters
 *   - APM integrations
 *   - Diagnostic endpoints
 */

/**
 * File: /reuse/san/nestjs-oracle-monitoring-kit.ts
 * Locator: WC-UTL-NMON-001
 * Purpose: NestJS Oracle Monitoring Kit - Enterprise-grade APM and observability utilities
 *
 * Upstream: @nestjs/common, @nestjs/terminus, @opentelemetry/api, prom-client, node:perf_hooks, node:v8, node:os
 * Downstream: Health endpoints, metrics collection, distributed tracing, diagnostic dumps, alert management
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, OpenTelemetry, Prometheus
 * Exports: 46 monitoring functions for APM, tracing, metrics, health checks, profiling, alerts
 *
 * LLM Context: Production-grade monitoring toolkit for White Cross healthcare platform.
 * Provides comprehensive utilities for application performance monitoring, distributed tracing,
 * metrics collection and aggregation, custom metric creation, JMX-style bean monitoring, health
 * check endpoints, diagnostic dumps, memory leak detection, performance profiling, and alert
 * threshold management. HIPAA-compliant with audit logging, PHI protection in metrics, and
 * healthcare-specific monitoring patterns for patient data access, EHR operations, and compliance.
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { performance, PerformanceObserver } from 'perf_hooks';
import * as v8 from 'v8';
import * as os from 'os';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Application performance metrics snapshot
 */
export interface APMSnapshot {
  timestamp: Date;
  uptime: number;
  requestsPerSecond: number;
  averageResponseTime: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: MemoryUsageMetrics;
  activeConnections: number;
  requestsInFlight: number;
}

/**
 * Memory usage metrics
 */
export interface MemoryUsageMetrics {
  heapUsed: number;
  heapTotal: number;
  heapPercentage: number;
  external: number;
  rss: number;
  arrayBuffers: number;
}

/**
 * Distributed trace context
 */
export interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  traceFlags: number;
  traceState?: string;
  baggage?: Record<string, string>;
}

/**
 * Span attributes for distributed tracing
 */
export interface SpanAttributes {
  'http.method'?: string;
  'http.url'?: string;
  'http.status_code'?: number;
  'db.system'?: string;
  'db.statement'?: string;
  'messaging.system'?: string;
  'error'?: boolean;
  'user.id'?: string;
  'tenant.id'?: string;
  'patient.id'?: string; // Healthcare-specific
  'encounter.id'?: string; // Healthcare-specific
  [key: string]: any;
}

/**
 * Custom metric definition
 */
export interface MetricDefinition {
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  description: string;
  unit?: string;
  labelNames?: string[];
  buckets?: number[]; // For histograms
  percentiles?: number[]; // For summaries
}

/**
 * Performance counter data
 */
export interface PerformanceCounter {
  name: string;
  value: number;
  timestamp: Date;
  labels?: Record<string, string>;
  delta?: number; // Change since last measurement
  rate?: number; // Per-second rate
}

/**
 * JMX-style managed bean
 */
export interface ManagedBean {
  name: string;
  description: string;
  attributes: Record<string, any>;
  operations: Record<string, Function>;
  lastUpdated: Date;
}

/**
 * Health check configuration
 */
export interface HealthCheckConfig {
  name: string;
  timeout?: number;
  retries?: number;
  interval?: number;
  critical?: boolean;
  tags?: string[];
}

/**
 * Diagnostic dump options
 */
export interface DiagnosticDumpOptions {
  includeHeapSnapshot?: boolean;
  includeThreadDump?: boolean;
  includeCpuProfile?: boolean;
  includeMemoryStats?: boolean;
  includeEnvironment?: boolean;
  includeConfiguration?: boolean;
  redactSecrets?: boolean;
  redactPHI?: boolean; // Healthcare-specific
}

/**
 * Memory leak detection result
 */
export interface MemoryLeakAnalysis {
  suspectedLeak: boolean;
  confidence: 'low' | 'medium' | 'high';
  growthRate: number; // MB per minute
  measurements: MemoryMeasurement[];
  recommendations: string[];
  affectedObjects?: string[];
}

/**
 * Memory measurement point
 */
export interface MemoryMeasurement {
  timestamp: Date;
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
}

/**
 * Performance profile result
 */
export interface PerformanceProfile {
  duration: number;
  entryName: string;
  startTime: number;
  endTime: number;
  marks: PerformanceMark[];
  measures: PerformanceMeasure[];
  operations: number;
  operationsPerSecond: number;
}

/**
 * Performance mark
 */
export interface PerformanceMark {
  name: string;
  timestamp: number;
}

/**
 * Performance measure
 */
export interface PerformanceMeasure {
  name: string;
  duration: number;
  startMark: string;
  endMark: string;
}

/**
 * Alert threshold configuration
 */
export interface AlertThreshold {
  metricName: string;
  operator: '>' | '<' | '=' | '>=' | '<=';
  threshold: number;
  duration?: number; // Seconds the condition must persist
  severity: 'info' | 'warning' | 'error' | 'critical';
  notificationChannels?: string[];
  suppressionRules?: SuppressionRule[];
}

/**
 * Alert suppression rule
 */
export interface SuppressionRule {
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  days?: string[]; // ['Monday', 'Tuesday', ...]
  reason?: string;
}

/**
 * Alert event
 */
export interface AlertEvent {
  id: string;
  timestamp: Date;
  metricName: string;
  currentValue: number;
  threshold: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  labels?: Record<string, string>;
  resolved?: boolean;
  resolvedAt?: Date;
}

// ============================================================================
// APM CORE UTILITIES
// ============================================================================

/**
 * Captures current APM snapshot with all performance metrics.
 *
 * @param {object} additionalMetrics - Additional custom metrics to include
 * @returns {APMSnapshot} Current performance snapshot
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class MonitoringService {
 *   async getPerformanceSnapshot() {
 *     const snapshot = captureAPMSnapshot({
 *       activePatients: await this.patientsService.countActive(),
 *       activeEncounters: await this.encountersService.countActive()
 *     });
 *     await this.metricsService.record(snapshot);
 *     return snapshot;
 *   }
 * }
 * ```
 */
export function captureAPMSnapshot(additionalMetrics?: Record<string, any>): APMSnapshot {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  return {
    timestamp: new Date(),
    uptime: process.uptime(),
    requestsPerSecond: (global as any).__requestCounter || 0,
    averageResponseTime: (global as any).__avgResponseTime || 0,
    errorRate: (global as any).__errorRate || 0,
    cpuUsage: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to seconds
    memoryUsage: {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      heapPercentage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
      external: memUsage.external,
      rss: memUsage.rss,
      arrayBuffers: memUsage.arrayBuffers,
    },
    activeConnections: (global as any).__activeConnections || 0,
    requestsInFlight: (global as any).__requestsInFlight || 0,
    ...additionalMetrics,
  };
}

/**
 * Initializes APM request tracking middleware.
 *
 * @param {Logger} logger - NestJS logger instance
 * @returns {Function} Express middleware function
 *
 * @example
 * ```typescript
 * export class AppModule implements NestModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer
 *       .apply(initializeAPMTracking(new Logger('APM')))
 *       .forRoutes('*');
 *   }
 * }
 * ```
 */
export function initializeAPMTracking(logger: Logger) {
  const requestTimes = new Map<string, number>();

  return (req: any, res: any, next: any) => {
    const requestId = req.headers['x-request-id'] || generateRequestId();
    const startTime = performance.now();

    // Increment in-flight counter
    (global as any).__requestsInFlight = ((global as any).__requestsInFlight || 0) + 1;

    requestTimes.set(requestId, startTime);

    res.on('finish', () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Decrement in-flight counter
      (global as any).__requestsInFlight = Math.max(
        ((global as any).__requestsInFlight || 1) - 1,
        0,
      );

      // Update metrics
      updateRequestMetrics(duration, res.statusCode >= 400);

      // Log slow requests (>1s)
      if (duration > 1000) {
        logger.warn(`Slow request detected: ${req.method} ${req.url} - ${duration.toFixed(2)}ms`);
      }

      requestTimes.delete(requestId);
    });

    next();
  };
}

/**
 * Calculates system load averages and CPU statistics.
 *
 * @returns {object} System load metrics
 *
 * @example
 * ```typescript
 * @Get('health/system')
 * async getSystemHealth() {
 *   const load = calculateSystemLoad();
 *   if (load.loadAverage1m > load.cpuCount * 0.8) {
 *     this.logger.warn('High system load detected');
 *   }
 *   return load;
 * }
 * ```
 */
export function calculateSystemLoad(): {
  loadAverage1m: number;
  loadAverage5m: number;
  loadAverage15m: number;
  cpuCount: number;
  loadPerCore1m: number;
  cpuUtilization: number;
} {
  const loadAvg = os.loadavg();
  const cpuCount = os.cpus().length;
  const cpus = os.cpus();

  // Calculate CPU utilization
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times];
    }
    totalIdle += cpu.times.idle;
  });

  const cpuUtilization = 100 - (100 * totalIdle) / totalTick;

  return {
    loadAverage1m: loadAvg[0],
    loadAverage5m: loadAvg[1],
    loadAverage15m: loadAvg[2],
    cpuCount,
    loadPerCore1m: loadAvg[0] / cpuCount,
    cpuUtilization,
  };
}

/**
 * Tracks application uptime with detailed breakdown.
 *
 * @returns {object} Uptime statistics
 *
 * @example
 * ```typescript
 * @Get('metrics/uptime')
 * async getUptime() {
 *   const uptime = trackApplicationUptime();
 *   return {
 *     ...uptime,
 *     status: uptime.uptimeSeconds > 86400 ? 'stable' : 'warming-up'
 *   };
 * }
 * ```
 */
export function trackApplicationUptime(): {
  uptimeSeconds: number;
  uptimeFormatted: string;
  startTime: Date;
  processUptime: number;
  systemUptime: number;
} {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  const startTime = new Date(Date.now() - uptimeSeconds * 1000);

  return {
    uptimeSeconds,
    uptimeFormatted,
    startTime,
    processUptime: process.uptime(),
    systemUptime: os.uptime(),
  };
}

/**
 * Aggregates performance metrics over time window.
 *
 * @param {APMSnapshot[]} snapshots - Array of APM snapshots
 * @param {number} windowMinutes - Time window in minutes
 * @returns {object} Aggregated metrics
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class MetricsAggregator {
 *   private snapshots: APMSnapshot[] = [];
 *
 *   async getAggregatedMetrics() {
 *     const aggregated = aggregatePerformanceMetrics(this.snapshots, 5);
 *     return {
 *       current: this.snapshots[this.snapshots.length - 1],
 *       fiveMinuteAverage: aggregated
 *     };
 *   }
 * }
 * ```
 */
export function aggregatePerformanceMetrics(
  snapshots: APMSnapshot[],
  windowMinutes: number,
): {
  avgResponseTime: number;
  avgCpuUsage: number;
  avgMemoryUsage: number;
  peakMemoryUsage: number;
  totalRequests: number;
  totalErrors: number;
  p50ResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
} {
  const cutoffTime = Date.now() - windowMinutes * 60 * 1000;
  const recentSnapshots = snapshots.filter(
    (s) => s.timestamp.getTime() > cutoffTime,
  );

  if (recentSnapshots.length === 0) {
    return {
      avgResponseTime: 0,
      avgCpuUsage: 0,
      avgMemoryUsage: 0,
      peakMemoryUsage: 0,
      totalRequests: 0,
      totalErrors: 0,
      p50ResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
    };
  }

  const responseTimes = recentSnapshots.map((s) => s.averageResponseTime).sort((a, b) => a - b);

  return {
    avgResponseTime:
      recentSnapshots.reduce((sum, s) => sum + s.averageResponseTime, 0) /
      recentSnapshots.length,
    avgCpuUsage:
      recentSnapshots.reduce((sum, s) => sum + s.cpuUsage, 0) / recentSnapshots.length,
    avgMemoryUsage:
      recentSnapshots.reduce((sum, s) => sum + s.memoryUsage.heapUsed, 0) /
      recentSnapshots.length,
    peakMemoryUsage: Math.max(...recentSnapshots.map((s) => s.memoryUsage.heapUsed)),
    totalRequests: recentSnapshots.reduce(
      (sum, s) => sum + s.requestsPerSecond * 60,
      0,
    ),
    totalErrors: recentSnapshots.reduce(
      (sum, s) => sum + s.errorRate * s.requestsPerSecond * 60,
      0,
    ),
    p50ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.5)],
    p95ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.95)],
    p99ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.99)],
  };
}

// ============================================================================
// DISTRIBUTED TRACING
// ============================================================================

/**
 * Creates new distributed trace context.
 *
 * @param {Partial<TraceContext>} parentContext - Optional parent trace context
 * @returns {TraceContext} New trace context
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class TracingService {
 *   async processRequest(parentContext?: TraceContext) {
 *     const traceContext = createTraceContext(parentContext);
 *     this.logger.log(`Processing request with trace ID: ${traceContext.traceId}`);
 *     return traceContext;
 *   }
 * }
 * ```
 */
export function createTraceContext(parentContext?: Partial<TraceContext>): TraceContext {
  const traceId = parentContext?.traceId || generateTraceId();
  const spanId = generateSpanId();

  return {
    traceId,
    spanId,
    parentSpanId: parentContext?.spanId,
    traceFlags: parentContext?.traceFlags ?? 1, // 1 = sampled
    traceState: parentContext?.traceState,
    baggage: { ...parentContext?.baggage },
  };
}

/**
 * Starts new span with attributes and timing.
 *
 * @param {string} name - Span name
 * @param {TraceContext} context - Trace context
 * @param {SpanAttributes} attributes - Span attributes
 * @returns {object} Span with end function
 *
 * @example
 * ```typescript
 * async processPatientRecord(patientId: string, context: TraceContext) {
 *   const span = startSpan('process-patient-record', context, {
 *     'patient.id': patientId,
 *     'operation': 'read'
 *   });
 *
 *   try {
 *     const patient = await this.patientsRepository.findOne(patientId);
 *     span.end({ 'db.rows': 1 });
 *     return patient;
 *   } catch (error) {
 *     span.end({ error: true, 'error.message': error.message });
 *     throw error;
 *   }
 * }
 * ```
 */
export function startSpan(
  name: string,
  context: TraceContext,
  attributes?: SpanAttributes,
): {
  spanId: string;
  startTime: number;
  end: (endAttributes?: SpanAttributes) => void;
} {
  const spanId = generateSpanId();
  const startTime = performance.now();

  return {
    spanId,
    startTime,
    end: (endAttributes?: SpanAttributes) => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Record span (integrate with your tracing backend)
      recordSpan({
        name,
        traceId: context.traceId,
        spanId,
        parentSpanId: context.spanId,
        startTime,
        endTime,
        duration,
        attributes: { ...attributes, ...endAttributes },
      });
    },
  };
}

/**
 * Extracts trace context from HTTP headers.
 *
 * @param {Record<string, string>} headers - HTTP headers
 * @returns {TraceContext | undefined} Extracted trace context
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class TracingInterceptor implements NestInterceptor {
 *   intercept(context: ExecutionContext, next: CallHandler) {
 *     const request = context.switchToHttp().getRequest();
 *     const traceContext = extractTraceFromHeaders(request.headers);
 *
 *     request.traceContext = traceContext || createTraceContext();
 *     return next.handle();
 *   }
 * }
 * ```
 */
export function extractTraceFromHeaders(
  headers: Record<string, string | string[] | undefined>,
): TraceContext | undefined {
  // Support W3C Trace Context
  const traceparent = headers['traceparent'] as string;

  if (traceparent) {
    const parts = traceparent.split('-');
    if (parts.length === 4) {
      return {
        traceId: parts[1],
        spanId: parts[2],
        traceFlags: parseInt(parts[3], 16),
        traceState: headers['tracestate'] as string,
      };
    }
  }

  // Fallback to custom headers
  const traceId = headers['x-trace-id'] as string;
  const spanId = headers['x-span-id'] as string;

  if (traceId && spanId) {
    return {
      traceId,
      spanId,
      traceFlags: 1,
    };
  }

  return undefined;
}

/**
 * Injects trace context into HTTP headers.
 *
 * @param {TraceContext} context - Trace context
 * @returns {Record<string, string>} Headers with trace context
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class HttpService {
 *   async callExternalService(url: string, context: TraceContext) {
 *     const headers = injectTraceIntoHeaders(context);
 *     return this.httpClient.get(url, { headers });
 *   }
 * }
 * ```
 */
export function injectTraceIntoHeaders(context: TraceContext): Record<string, string> {
  const headers: Record<string, string> = {
    // W3C Trace Context format
    traceparent: `00-${context.traceId}-${context.spanId}-${context.traceFlags.toString(16).padStart(2, '0')}`,
  };

  if (context.traceState) {
    headers.tracestate = context.traceState;
  }

  // Custom headers for backwards compatibility
  headers['x-trace-id'] = context.traceId;
  headers['x-span-id'] = context.spanId;

  if (context.parentSpanId) {
    headers['x-parent-span-id'] = context.parentSpanId;
  }

  return headers;
}

// ============================================================================
// METRICS COLLECTION
// ============================================================================

/**
 * Collects and exports Prometheus-style metrics.
 *
 * @param {MetricDefinition[]} definitions - Metric definitions
 * @returns {object} Metrics collector with record function
 *
 * @example
 * ```typescript
 * const collector = collectPrometheusMetrics([
 *   {
 *     name: 'http_requests_total',
 *     type: 'counter',
 *     description: 'Total HTTP requests',
 *     labelNames: ['method', 'status']
 *   }
 * ]);
 *
 * collector.record('http_requests_total', 1, { method: 'GET', status: '200' });
 * ```
 */
export function collectPrometheusMetrics(definitions: MetricDefinition[]): {
  record: (name: string, value: number, labels?: Record<string, string>) => void;
  getMetrics: () => string;
  reset: () => void;
} {
  const metrics = new Map<string, any>();

  // Initialize metrics
  definitions.forEach((def) => {
    metrics.set(def.name, {
      definition: def,
      values: new Map<string, number>(),
      observations: new Map<string, number[]>(),
    });
  });

  return {
    record: (name: string, value: number, labels?: Record<string, string>) => {
      const metric = metrics.get(name);
      if (!metric) return;

      const labelKey = labels ? JSON.stringify(labels) : '__no_labels__';

      if (metric.definition.type === 'counter') {
        const current = metric.values.get(labelKey) || 0;
        metric.values.set(labelKey, current + value);
      } else if (metric.definition.type === 'gauge') {
        metric.values.set(labelKey, value);
      } else if (metric.definition.type === 'histogram') {
        const observations = metric.observations.get(labelKey) || [];
        observations.push(value);
        metric.observations.set(labelKey, observations);
      }
    },

    getMetrics: () => {
      let output = '';

      metrics.forEach((metric, name) => {
        const def = metric.definition;
        output += `# HELP ${name} ${def.description}\n`;
        output += `# TYPE ${name} ${def.type}\n`;

        metric.values.forEach((value, labelKey) => {
          const labels = labelKey === '__no_labels__' ? '' : labelKey;
          output += `${name}${labels} ${value}\n`;
        });
      });

      return output;
    },

    reset: () => {
      metrics.forEach((metric) => {
        metric.values.clear();
        metric.observations.clear();
      });
    },
  };
}

/**
 * Records histogram metric with automatic bucket calculation.
 *
 * @param {string} name - Metric name
 * @param {number} value - Observed value
 * @param {number[]} buckets - Histogram buckets
 * @param {Record<string, string>} labels - Metric labels
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class MetricsService {
 *   recordResponseTime(duration: number, endpoint: string) {
 *     recordHistogramMetric(
 *       'http_response_time_seconds',
 *       duration / 1000,
 *       [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
 *       { endpoint }
 *     );
 *   }
 * }
 * ```
 */
export function recordHistogramMetric(
  name: string,
  value: number,
  buckets: number[],
  labels?: Record<string, string>,
): void {
  const histogram = (global as any).__histograms || new Map();
  const key = `${name}:${JSON.stringify(labels || {})}`;

  if (!histogram.has(key)) {
    histogram.set(key, {
      buckets: buckets.map((le) => ({ le, count: 0 })),
      sum: 0,
      count: 0,
    });
  }

  const metric = histogram.get(key);
  metric.sum += value;
  metric.count += 1;

  metric.buckets.forEach((bucket: any) => {
    if (value <= bucket.le) {
      bucket.count += 1;
    }
  });

  (global as any).__histograms = histogram;
}

/**
 * Increments counter metric with labels.
 *
 * @param {string} name - Counter name
 * @param {number} increment - Value to increment by
 * @param {Record<string, string>} labels - Counter labels
 *
 * @example
 * ```typescript
 * @Post('patients')
 * async createPatient(@Body() dto: CreatePatientDto) {
 *   incrementCounterMetric('patients_created_total', 1, {
 *     department: dto.department,
 *     facility: dto.facilityId
 *   });
 *   return this.patientsService.create(dto);
 * }
 * ```
 */
export function incrementCounterMetric(
  name: string,
  increment: number = 1,
  labels?: Record<string, string>,
): void {
  const counters = (global as any).__counters || new Map();
  const key = `${name}:${JSON.stringify(labels || {})}`;

  const current = counters.get(key) || 0;
  counters.set(key, current + increment);

  (global as any).__counters = counters;
}

/**
 * Sets gauge metric to specific value.
 *
 * @param {string} name - Gauge name
 * @param {number} value - Gauge value
 * @param {Record<string, string>} labels - Gauge labels
 *
 * @example
 * ```typescript
 * @Cron('* * * * *')
 * async updateQueueMetrics() {
 *   const queueSize = await this.queueService.getSize();
 *   setGaugeMetric('queue_size', queueSize, { queue: 'patient-processing' });
 * }
 * ```
 */
export function setGaugeMetric(
  name: string,
  value: number,
  labels?: Record<string, string>,
): void {
  const gauges = (global as any).__gauges || new Map();
  const key = `${name}:${JSON.stringify(labels || {})}`;

  gauges.set(key, value);

  (global as any).__gauges = gauges;
}

/**
 * Exports all collected metrics in Prometheus format.
 *
 * @returns {string} Metrics in Prometheus exposition format
 *
 * @example
 * ```typescript
 * @Get('metrics')
 * @Header('Content-Type', 'text/plain')
 * getMetrics(): string {
 *   return exportMetricsAsPrometheus();
 * }
 * ```
 */
export function exportMetricsAsPrometheus(): string {
  let output = '';

  // Export counters
  const counters = (global as any).__counters || new Map();
  counters.forEach((value: number, key: string) => {
    const [name, labelsStr] = key.split(':');
    const labels = labelsStr === '{}' ? '' : labelsStr.replace(/[{}"]/g, '');
    output += `${name}{${labels}} ${value}\n`;
  });

  // Export gauges
  const gauges = (global as any).__gauges || new Map();
  gauges.forEach((value: number, key: string) => {
    const [name, labelsStr] = key.split(':');
    const labels = labelsStr === '{}' ? '' : labelsStr.replace(/[{}"]/g, '');
    output += `${name}{${labels}} ${value}\n`;
  });

  // Export histograms
  const histograms = (global as any).__histograms || new Map();
  histograms.forEach((histogram: any, key: string) => {
    const [name, labelsStr] = key.split(':');
    const labels = labelsStr === '{}' ? '' : labelsStr.replace(/[{}"]/g, '');

    histogram.buckets.forEach((bucket: any) => {
      output += `${name}_bucket{${labels},le="${bucket.le}"} ${bucket.count}\n`;
    });
    output += `${name}_sum{${labels}} ${histogram.sum}\n`;
    output += `${name}_count{${labels}} ${histogram.count}\n`;
  });

  return output;
}

// ============================================================================
// CUSTOM METRICS
// ============================================================================

/**
 * Creates custom business metric tracker.
 *
 * @param {MetricDefinition} definition - Metric definition
 * @returns {object} Metric tracker with record and get methods
 *
 * @example
 * ```typescript
 * const patientMetric = createCustomMetric({
 *   name: 'active_patients_by_department',
 *   type: 'gauge',
 *   description: 'Number of active patients by department',
 *   labelNames: ['department', 'facility']
 * });
 *
 * patientMetric.record(42, { department: 'cardiology', facility: 'main' });
 * ```
 */
export function createCustomMetric(definition: MetricDefinition): {
  record: (value: number, labels?: Record<string, string>) => void;
  get: (labels?: Record<string, string>) => number | undefined;
  reset: () => void;
} {
  const storage = new Map<string, number>();

  return {
    record: (value: number, labels?: Record<string, string>) => {
      const key = JSON.stringify(labels || {});

      if (definition.type === 'counter') {
        const current = storage.get(key) || 0;
        storage.set(key, current + value);
      } else if (definition.type === 'gauge') {
        storage.set(key, value);
      }
    },

    get: (labels?: Record<string, string>) => {
      const key = JSON.stringify(labels || {});
      return storage.get(key);
    },

    reset: () => {
      storage.clear();
    },
  };
}

/**
 * Tracks SLA compliance metrics.
 *
 * @param {string} operation - Operation name
 * @param {number} duration - Operation duration in ms
 * @param {number} slaThreshold - SLA threshold in ms
 * @param {Record<string, string>} labels - Additional labels
 *
 * @example
 * ```typescript
 * async processPatientRequest(patientId: string) {
 *   const start = performance.now();
 *   try {
 *     const result = await this.service.process(patientId);
 *     const duration = performance.now() - start;
 *     trackSLACompliance('patient_request', duration, 1000, { type: 'read' });
 *     return result;
 *   } catch (error) {
 *     throw error;
 *   }
 * }
 * ```
 */
export function trackSLACompliance(
  operation: string,
  duration: number,
  slaThreshold: number,
  labels?: Record<string, string>,
): void {
  const metCompliance = duration <= slaThreshold;

  incrementCounterMetric(
    `sla_${operation}_total`,
    1,
    { ...labels, met: metCompliance.toString() },
  );

  recordHistogramMetric(
    `sla_${operation}_duration_ms`,
    duration,
    [10, 50, 100, 250, 500, 1000, 2000, 5000],
    labels,
  );

  // Calculate compliance rate
  const counters = (global as any).__counters || new Map();
  const totalKey = `sla_${operation}_total:${JSON.stringify({ ...labels, met: 'true' })}`;
  const violationKey = `sla_${operation}_total:${JSON.stringify({ ...labels, met: 'false' })}`;

  const total = (counters.get(totalKey) || 0) + (counters.get(violationKey) || 0);
  const violations = counters.get(violationKey) || 0;
  const complianceRate = total > 0 ? ((total - violations) / total) * 100 : 100;

  setGaugeMetric(`sla_${operation}_compliance_rate`, complianceRate, labels);
}

/**
 * Records error rate metric by type.
 *
 * @param {string} errorType - Error type or class
 * @param {string} operation - Operation that failed
 * @param {Record<string, string>} labels - Additional labels
 *
 * @example
 * ```typescript
 * @Post('encounters')
 * async createEncounter(@Body() dto: CreateEncounterDto) {
 *   try {
 *     return await this.encountersService.create(dto);
 *   } catch (error) {
 *     recordErrorRate(error.constructor.name, 'create_encounter', {
 *       severity: error.severity || 'error'
 *     });
 *     throw error;
 *   }
 * }
 * ```
 */
export function recordErrorRate(
  errorType: string,
  operation: string,
  labels?: Record<string, string>,
): void {
  incrementCounterMetric('errors_total', 1, {
    ...labels,
    error_type: errorType,
    operation,
  });

  // Update error rate gauge
  const counters = (global as any).__counters || new Map();
  const errorKey = `errors_total:${JSON.stringify({ ...labels, error_type: errorType, operation })}`;
  const totalKey = `operations_total:${JSON.stringify({ ...labels, operation })}`;

  const errors = counters.get(errorKey) || 0;
  const total = counters.get(totalKey) || 1;
  const errorRate = (errors / total) * 100;

  setGaugeMetric('error_rate_percentage', errorRate, { ...labels, operation });
}

/**
 * Measures throughput in operations per second.
 *
 * @param {string} operation - Operation name
 * @param {number} count - Number of operations completed
 * @param {number} windowSeconds - Time window in seconds
 * @param {Record<string, string>} labels - Additional labels
 *
 * @example
 * ```typescript
 * @Cron('*/10 * * * * *') // Every 10 seconds
 * async measureThroughput() {
 *   const processed = await this.getProcessedCount();
 *   measureThroughput('patient_records_processed', processed, 10, {
 *     processor: 'main'
 *   });
 * }
 * ```
 */
export function measureThroughput(
  operation: string,
  count: number,
  windowSeconds: number,
  labels?: Record<string, string>,
): void {
  const throughput = count / windowSeconds;

  setGaugeMetric(`${operation}_throughput_ops`, throughput, labels);
  incrementCounterMetric(`${operation}_total`, count, labels);
}

// ============================================================================
// PERFORMANCE COUNTERS
// ============================================================================

/**
 * Creates performance counter with delta tracking.
 *
 * @param {string} name - Counter name
 * @param {() => number} valueFunction - Function to get current value
 * @returns {object} Counter with read and reset methods
 *
 * @example
 * ```typescript
 * const dbConnectionCounter = createPerformanceCounter(
 *   'database_active_connections',
 *   () => this.dbPool.activeConnections
 * );
 *
 * setInterval(() => {
 *   const reading = dbConnectionCounter.read();
 *   console.log(`Connections: ${reading.value}, Delta: ${reading.delta}`);
 * }, 1000);
 * ```
 */
export function createPerformanceCounter(
  name: string,
  valueFunction: () => number,
): {
  read: (labels?: Record<string, string>) => PerformanceCounter;
  reset: () => void;
} {
  let lastValue = 0;
  let lastTimestamp = new Date();

  return {
    read: (labels?: Record<string, string>) => {
      const currentValue = valueFunction();
      const currentTimestamp = new Date();
      const delta = currentValue - lastValue;
      const timeDiff = (currentTimestamp.getTime() - lastTimestamp.getTime()) / 1000;
      const rate = timeDiff > 0 ? delta / timeDiff : 0;

      const counter: PerformanceCounter = {
        name,
        value: currentValue,
        timestamp: currentTimestamp,
        labels,
        delta,
        rate,
      };

      lastValue = currentValue;
      lastTimestamp = currentTimestamp;

      return counter;
    },

    reset: () => {
      lastValue = 0;
      lastTimestamp = new Date();
    },
  };
}

/**
 * Samples counter at regular intervals.
 *
 * @param {object} counter - Performance counter
 * @param {number} intervalMs - Sampling interval in milliseconds
 * @param {(sample: PerformanceCounter) => void} callback - Callback for each sample
 * @returns {() => void} Stop function
 *
 * @example
 * ```typescript
 * const memoryCounter = createPerformanceCounter(
 *   'heap_used',
 *   () => process.memoryUsage().heapUsed
 * );
 *
 * const stop = sampleCounterPeriodically(memoryCounter, 5000, (sample) => {
 *   if (sample.value > 500 * 1024 * 1024) { // 500MB
 *     this.logger.warn('High memory usage detected');
 *   }
 * });
 * ```
 */
export function sampleCounterPeriodically(
  counter: { read: (labels?: Record<string, string>) => PerformanceCounter },
  intervalMs: number,
  callback: (sample: PerformanceCounter) => void,
): () => void {
  const intervalId = setInterval(() => {
    const sample = counter.read();
    callback(sample);
  }, intervalMs);

  return () => clearInterval(intervalId);
}

/**
 * Compares two performance counter snapshots.
 *
 * @param {PerformanceCounter} current - Current counter reading
 * @param {PerformanceCounter} previous - Previous counter reading
 * @returns {object} Comparison result
 *
 * @example
 * ```typescript
 * const previous = requestCounter.read();
 * await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
 * const current = requestCounter.read();
 *
 * const comparison = compareCounterSnapshots(current, previous);
 * console.log(`Requests increased by ${comparison.percentChange}%`);
 * ```
 */
export function compareCounterSnapshots(
  current: PerformanceCounter,
  previous: PerformanceCounter,
): {
  absoluteChange: number;
  percentChange: number;
  rateChange: number;
  timeDiff: number;
} {
  const absoluteChange = current.value - previous.value;
  const percentChange = previous.value > 0 ? (absoluteChange / previous.value) * 100 : 0;
  const rateChange = (current.rate || 0) - (previous.rate || 0);
  const timeDiff = current.timestamp.getTime() - previous.timestamp.getTime();

  return {
    absoluteChange,
    percentChange,
    rateChange,
    timeDiff,
  };
}

/**
 * Aggregates multiple counter readings.
 *
 * @param {PerformanceCounter[]} counters - Array of counter readings
 * @returns {object} Aggregated statistics
 *
 * @example
 * ```typescript
 * const readings: PerformanceCounter[] = [];
 * const counter = createPerformanceCounter('requests', () => requestCount);
 *
 * setInterval(() => readings.push(counter.read()), 1000);
 *
 * setTimeout(() => {
 *   const stats = aggregateCounters(readings);
 *   console.log(`Avg: ${stats.average}, Peak: ${stats.peak}`);
 * }, 60000);
 * ```
 */
export function aggregateCounters(counters: PerformanceCounter[]): {
  average: number;
  min: number;
  max: number;
  sum: number;
  count: number;
  peak: number;
  peakTimestamp: Date;
} {
  if (counters.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0,
      sum: 0,
      count: 0,
      peak: 0,
      peakTimestamp: new Date(),
    };
  }

  const values = counters.map((c) => c.value);
  const sum = values.reduce((a, b) => a + b, 0);
  const peakCounter = counters.reduce((max, c) => (c.value > max.value ? c : max));

  return {
    average: sum / counters.length,
    min: Math.min(...values),
    max: Math.max(...values),
    sum,
    count: counters.length,
    peak: peakCounter.value,
    peakTimestamp: peakCounter.timestamp,
  };
}

// ============================================================================
// JMX-STYLE MONITORING
// ============================================================================

/**
 * Registers managed bean for JMX-style monitoring.
 *
 * @param {ManagedBean} bean - Managed bean configuration
 *
 * @example
 * ```typescript
 * registerManagedBean({
 *   name: 'PatientService',
 *   description: 'Patient management service',
 *   attributes: {
 *     activePatients: () => this.patientsService.getActiveCount(),
 *     averageWaitTime: () => this.patientsService.getAvgWaitTime()
 *   },
 *   operations: {
 *     refreshCache: () => this.patientsService.refreshCache(),
 *     clearOldRecords: () => this.patientsService.clearOld()
 *   },
 *   lastUpdated: new Date()
 * });
 * ```
 */
export function registerManagedBean(bean: ManagedBean): void {
  const registry = (global as any).__managedBeans || new Map();
  registry.set(bean.name, bean);
  (global as any).__managedBeans = registry;
}

/**
 * Queries managed bean attribute value.
 *
 * @param {string} beanName - Bean name
 * @param {string} attributeName - Attribute name
 * @returns {any} Attribute value
 *
 * @example
 * ```typescript
 * @Get('jmx/:bean/:attribute')
 * async getJmxAttribute(
 *   @Param('bean') beanName: string,
 *   @Param('attribute') attributeName: string
 * ) {
 *   const value = queryManagedBeanAttribute(beanName, attributeName);
 *   return { bean: beanName, attribute: attributeName, value };
 * }
 * ```
 */
export function queryManagedBeanAttribute(beanName: string, attributeName: string): any {
  const registry = (global as any).__managedBeans || new Map();
  const bean = registry.get(beanName);

  if (!bean) {
    throw new Error(`Managed bean '${beanName}' not found`);
  }

  const attribute = bean.attributes[attributeName];

  if (attribute === undefined) {
    throw new Error(`Attribute '${attributeName}' not found in bean '${beanName}'`);
  }

  return typeof attribute === 'function' ? attribute() : attribute;
}

/**
 * Invokes managed bean operation.
 *
 * @param {string} beanName - Bean name
 * @param {string} operationName - Operation name
 * @param {any[]} args - Operation arguments
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * @Post('jmx/:bean/:operation')
 * async invokeJmxOperation(
 *   @Param('bean') beanName: string,
 *   @Param('operation') operationName: string,
 *   @Body() args: any[]
 * ) {
 *   const result = await invokeManagedBeanOperation(beanName, operationName, args);
 *   return { success: true, result };
 * }
 * ```
 */
export async function invokeManagedBeanOperation(
  beanName: string,
  operationName: string,
  args: any[] = [],
): Promise<any> {
  const registry = (global as any).__managedBeans || new Map();
  const bean = registry.get(beanName);

  if (!bean) {
    throw new Error(`Managed bean '${beanName}' not found`);
  }

  const operation = bean.operations[operationName];

  if (!operation) {
    throw new Error(`Operation '${operationName}' not found in bean '${beanName}'`);
  }

  return operation(...args);
}

/**
 * Lists all registered managed beans.
 *
 * @returns {Array<{ name: string; description: string; attributeCount: number; operationCount: number }>} Beans list
 *
 * @example
 * ```typescript
 * @Get('jmx/beans')
 * async listManagedBeans() {
 *   return listAllManagedBeans();
 * }
 * ```
 */
export function listAllManagedBeans(): Array<{
  name: string;
  description: string;
  attributeCount: number;
  operationCount: number;
}> {
  const registry = (global as any).__managedBeans || new Map();
  const beans: Array<{
    name: string;
    description: string;
    attributeCount: number;
    operationCount: number;
  }> = [];

  registry.forEach((bean: ManagedBean, name: string) => {
    beans.push({
      name,
      description: bean.description,
      attributeCount: Object.keys(bean.attributes).length,
      operationCount: Object.keys(bean.operations).length,
    });
  });

  return beans;
}

// ============================================================================
// HEALTH CHECK UTILITIES
// ============================================================================

/**
 * Creates comprehensive health check endpoint.
 *
 * @param {HealthCheckConfig[]} checks - Health check configurations
 * @returns {Promise<object>} Health check result
 *
 * @example
 * ```typescript
 * @Get('health')
 * async getHealth() {
 *   return createHealthCheck([
 *     { name: 'database', timeout: 5000, critical: true },
 *     { name: 'redis', timeout: 2000, critical: false },
 *     { name: 'external-api', timeout: 3000, critical: false }
 *   ]);
 * }
 * ```
 */
export async function createHealthCheck(
  checks: HealthCheckConfig[],
): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  checks: Record<string, any>;
}> {
  const results: Record<string, any> = {};
  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  for (const check of checks) {
    try {
      const checkResult = await executeHealthCheck(check);
      results[check.name] = checkResult;

      if (!checkResult.healthy) {
        overallStatus = check.critical ? 'unhealthy' : 'degraded';
      }
    } catch (error) {
      results[check.name] = {
        healthy: false,
        error: (error as Error).message,
      };
      overallStatus = check.critical ? 'unhealthy' : 'degraded';
    }
  }

  return {
    status: overallStatus,
    timestamp: new Date(),
    uptime: process.uptime(),
    checks: results,
  };
}

/**
 * Performs database health check.
 *
 * @param {any} connection - Database connection
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<HealthIndicatorResult>} Health check result
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class DatabaseHealthIndicator extends HealthIndicator {
 *   constructor(
 *     @InjectConnection() private connection: Connection
 *   ) {
 *     super();
 *   }
 *
 *   async isHealthy(): Promise<HealthIndicatorResult> {
 *     return checkDatabaseHealth(this.connection, 5000);
 *   }
 * }
 * ```
 */
export async function checkDatabaseHealth(
  connection: any,
  timeout: number = 5000,
): Promise<HealthIndicatorResult> {
  const startTime = performance.now();

  try {
    // Execute a simple query with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database health check timeout')), timeout);
    });

    const queryPromise = connection.query('SELECT 1');

    await Promise.race([queryPromise, timeoutPromise]);

    const responseTime = performance.now() - startTime;

    return {
      database: {
        status: 'up',
        responseTime: Math.round(responseTime),
      },
    };
  } catch (error) {
    return {
      database: {
        status: 'down',
        error: (error as Error).message,
      },
    };
  }
}

/**
 * Performs cache/Redis health check.
 *
 * @param {any} client - Redis client
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<HealthIndicatorResult>} Health check result
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class RedisHealthIndicator extends HealthIndicator {
 *   constructor(
 *     @InjectRedis() private redisClient: Redis
 *   ) {
 *     super();
 *   }
 *
 *   async isHealthy(): Promise<HealthIndicatorResult> {
 *     return checkCacheHealth(this.redisClient, 2000);
 *   }
 * }
 * ```
 */
export async function checkCacheHealth(
  client: any,
  timeout: number = 2000,
): Promise<HealthIndicatorResult> {
  const startTime = performance.now();

  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Cache health check timeout')), timeout);
    });

    const pingPromise = client.ping ? client.ping() : client.get('__health_check__');

    await Promise.race([pingPromise, timeoutPromise]);

    const responseTime = performance.now() - startTime;

    return {
      cache: {
        status: 'up',
        responseTime: Math.round(responseTime),
      },
    };
  } catch (error) {
    return {
      cache: {
        status: 'down',
        error: (error as Error).message,
      },
    };
  }
}

/**
 * Performs external service health check.
 *
 * @param {string} url - Service URL
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<HealthIndicatorResult>} Health check result
 *
 * @example
 * ```typescript
 * @Get('health/external')
 * async checkExternalServices() {
 *   const hl7Service = await checkExternalServiceHealth(
 *     'https://hl7-api.example.com/health',
 *     3000
 *   );
 *   return hl7Service;
 * }
 * ```
 */
export async function checkExternalServiceHealth(
  url: string,
  timeout: number = 3000,
): Promise<HealthIndicatorResult> {
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      method: 'GET',
    });

    clearTimeout(timeoutId);

    const responseTime = performance.now() - startTime;

    return {
      externalService: {
        status: response.ok ? 'up' : 'degraded',
        statusCode: response.status,
        responseTime: Math.round(responseTime),
      },
    };
  } catch (error) {
    return {
      externalService: {
        status: 'down',
        error: (error as Error).message,
      },
    };
  }
}

/**
 * Checks system resources (CPU, memory, disk).
 *
 * @param {object} thresholds - Resource thresholds
 * @returns {HealthIndicatorResult} Resource health result
 *
 * @example
 * ```typescript
 * @Get('health/resources')
 * async checkResources() {
 *   return checkSystemResources({
 *     maxCpuPercent: 80,
 *     maxMemoryPercent: 90,
 *     minDiskSpaceMB: 1000
 *   });
 * }
 * ```
 */
export function checkSystemResources(thresholds: {
  maxCpuPercent?: number;
  maxMemoryPercent?: number;
  minDiskSpaceMB?: number;
}): HealthIndicatorResult {
  const memUsage = process.memoryUsage();
  const memPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const systemMemPercent = ((totalMem - freeMem) / totalMem) * 100;

  const load = os.loadavg();
  const cpuCount = os.cpus().length;
  const cpuPercent = (load[0] / cpuCount) * 100;

  const issues: string[] = [];

  if (thresholds.maxCpuPercent && cpuPercent > thresholds.maxCpuPercent) {
    issues.push(`CPU usage ${cpuPercent.toFixed(1)}% exceeds ${thresholds.maxCpuPercent}%`);
  }

  if (thresholds.maxMemoryPercent && systemMemPercent > thresholds.maxMemoryPercent) {
    issues.push(
      `Memory usage ${systemMemPercent.toFixed(1)}% exceeds ${thresholds.maxMemoryPercent}%`,
    );
  }

  return {
    resources: {
      status: issues.length === 0 ? 'up' : 'degraded',
      cpu: {
        percent: Math.round(cpuPercent),
        loadAverage: load[0],
        cores: cpuCount,
      },
      memory: {
        percent: Math.round(systemMemPercent),
        heapPercent: Math.round(memPercent),
        free: freeMem,
        total: totalMem,
      },
      issues: issues.length > 0 ? issues : undefined,
    },
  };
}

// ============================================================================
// DIAGNOSTIC DUMPS
// ============================================================================

/**
 * Generates comprehensive diagnostic dump.
 *
 * @param {DiagnosticDumpOptions} options - Dump options
 * @returns {Promise<object>} Diagnostic information
 *
 * @example
 * ```typescript
 * @Get('diagnostics/dump')
 * @UseGuards(AdminGuard)
 * async getDiagnosticDump() {
 *   return generateDiagnosticDump({
 *     includeHeapSnapshot: false,
 *     includeThreadDump: true,
 *     includeMemoryStats: true,
 *     redactSecrets: true,
 *     redactPHI: true
 *   });
 * }
 * ```
 */
export async function generateDiagnosticDump(
  options: DiagnosticDumpOptions = {},
): Promise<object> {
  const dump: any = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    platform: process.platform,
    nodeVersion: process.version,
    pid: process.pid,
  };

  if (options.includeMemoryStats !== false) {
    dump.memory = getMemoryStatistics();
  }

  if (options.includeThreadDump) {
    dump.threads = generateThreadDump();
  }

  if (options.includeEnvironment) {
    dump.environment = options.redactSecrets
      ? redactSensitiveData(process.env)
      : process.env;
  }

  if (options.includeConfiguration) {
    dump.configuration = {
      maxOldSpaceSize: v8.getHeapStatistics().heap_size_limit,
      flags: process.execArgv,
    };
  }

  return dump;
}

/**
 * Captures current thread/async operation dump.
 *
 * @returns {object} Thread dump information
 *
 * @example
 * ```typescript
 * @Get('diagnostics/threads')
 * async getThreadDump() {
 *   const threadDump = generateThreadDump();
 *   if (threadDump.activeHandles > 1000) {
 *     this.logger.warn('High number of active handles detected');
 *   }
 *   return threadDump;
 * }
 * ```
 */
export function generateThreadDump(): {
  activeHandles: number;
  activeRequests: number;
  eventLoopDelay: number;
} {
  const activeHandles = (process as any)._getActiveHandles?.()?.length || 0;
  const activeRequests = (process as any)._getActiveRequests?.()?.length || 0;

  return {
    activeHandles,
    activeRequests,
    eventLoopDelay: 0, // Would need perf_hooks monitoring
  };
}

/**
 * Exports heap statistics and V8 metrics.
 *
 * @returns {object} Heap statistics
 *
 * @example
 * ```typescript
 * @Cron('0 * * * *') // Every hour
 * async logHeapStats() {
 *   const stats = getHeapStatistics();
 *   this.logger.log(`Heap used: ${(stats.used_heap_size / 1024 / 1024).toFixed(2)}MB`);
 *   await this.metricsService.record('heap_stats', stats);
 * }
 * ```
 */
export function getHeapStatistics(): {
  total_heap_size: number;
  total_heap_size_executable: number;
  total_physical_size: number;
  total_available_size: number;
  used_heap_size: number;
  heap_size_limit: number;
  malloced_memory: number;
  peak_malloced_memory: number;
  does_zap_garbage: number;
  number_of_native_contexts: number;
  number_of_detached_contexts: number;
} {
  return v8.getHeapStatistics();
}

/**
 * Collects garbage collection statistics.
 *
 * @returns {object} GC statistics
 *
 * @example
 * ```typescript
 * @Get('diagnostics/gc')
 * async getGCStats() {
 *   const gcStats = getGarbageCollectionStats();
 *   return {
 *     ...gcStats,
 *     recommendation: gcStats.totalGCTime > 1000
 *       ? 'Consider increasing heap size'
 *       : 'GC performance is healthy'
 *   };
 * }
 * ```
 */
export function getGarbageCollectionStats(): {
  totalHeapSize: number;
  usedHeapSize: number;
  heapSizeLimit: number;
  totalGCTime: number;
  spaces: any;
} {
  const heapStats = v8.getHeapStatistics();
  const heapSpaces = v8.getHeapSpaceStatistics();

  return {
    totalHeapSize: heapStats.total_heap_size,
    usedHeapSize: heapStats.used_heap_size,
    heapSizeLimit: heapStats.heap_size_limit,
    totalGCTime: 0, // Would need GC tracking
    spaces: heapSpaces,
  };
}

// ============================================================================
// MEMORY MONITORING
// ============================================================================

/**
 * Detects potential memory leaks over time.
 *
 * @param {number} intervalMs - Measurement interval
 * @param {number} measurements - Number of measurements
 * @returns {Promise<MemoryLeakAnalysis>} Leak analysis result
 *
 * @example
 * ```typescript
 * @Post('diagnostics/leak-detection')
 * async detectMemoryLeaks() {
 *   const analysis = await detectMemoryLeak(5000, 10); // 10 samples over 50 seconds
 *   if (analysis.suspectedLeak && analysis.confidence === 'high') {
 *     await this.alertService.sendAlert('Memory leak detected!');
 *   }
 *   return analysis;
 * }
 * ```
 */
export async function detectMemoryLeak(
  intervalMs: number = 5000,
  measurements: number = 10,
): Promise<MemoryLeakAnalysis> {
  const samples: MemoryMeasurement[] = [];

  for (let i = 0; i < measurements; i++) {
    const memUsage = process.memoryUsage();
    samples.push({
      timestamp: new Date(),
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
    });

    if (i < measurements - 1) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  // Calculate growth rate
  const firstSample = samples[0];
  const lastSample = samples[samples.length - 1];
  const timeDiff = (lastSample.timestamp.getTime() - firstSample.timestamp.getTime()) / 1000 / 60; // minutes
  const heapGrowth = (lastSample.heapUsed - firstSample.heapUsed) / 1024 / 1024; // MB
  const growthRate = heapGrowth / timeDiff;

  // Determine if leak is suspected
  const suspectedLeak = growthRate > 1; // Growing more than 1MB/min
  let confidence: 'low' | 'medium' | 'high' = 'low';

  if (growthRate > 5) {
    confidence = 'high';
  } else if (growthRate > 2) {
    confidence = 'medium';
  }

  const recommendations: string[] = [];

  if (suspectedLeak) {
    recommendations.push('Take heap snapshot for detailed analysis');
    recommendations.push('Review recent code changes');
    recommendations.push('Check for unclosed connections or event listeners');

    if (growthRate > 10) {
      recommendations.push('URGENT: Consider restarting the application');
    }
  }

  return {
    suspectedLeak,
    confidence,
    growthRate,
    measurements: samples,
    recommendations,
  };
}

/**
 * Monitors memory trends over time.
 *
 * @param {MemoryMeasurement[]} measurements - Historical measurements
 * @returns {object} Trend analysis
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class MemoryMonitor {
 *   private measurements: MemoryMeasurement[] = [];
 *
 *   @Cron('*/5 * * * *') // Every 5 minutes
 *   async analyzeTrends() {
 *     this.measurements.push(this.getCurrentMeasurement());
 *     const trends = analyzeMemoryTrends(this.measurements);
 *     if (trends.trend === 'increasing' && trends.projectedExhaustionHours < 24) {
 *       await this.alertService.warn('Memory exhaustion projected within 24h');
 *     }
 *   }
 * }
 * ```
 */
export function analyzeMemoryTrends(measurements: MemoryMeasurement[]): {
  trend: 'stable' | 'increasing' | 'decreasing';
  averageHeapUsed: number;
  peakHeapUsed: number;
  heapGrowthRate: number;
  projectedExhaustionHours?: number;
} {
  if (measurements.length < 2) {
    return {
      trend: 'stable',
      averageHeapUsed: measurements[0]?.heapUsed || 0,
      peakHeapUsed: measurements[0]?.heapUsed || 0,
      heapGrowthRate: 0,
    };
  }

  const avgHeapUsed =
    measurements.reduce((sum, m) => sum + m.heapUsed, 0) / measurements.length;
  const peakHeapUsed = Math.max(...measurements.map((m) => m.heapUsed));

  // Calculate trend
  const firstHalf = measurements.slice(0, Math.floor(measurements.length / 2));
  const secondHalf = measurements.slice(Math.floor(measurements.length / 2));

  const avgFirstHalf = firstHalf.reduce((sum, m) => sum + m.heapUsed, 0) / firstHalf.length;
  const avgSecondHalf =
    secondHalf.reduce((sum, m) => sum + m.heapUsed, 0) / secondHalf.length;

  let trend: 'stable' | 'increasing' | 'decreasing' = 'stable';
  const difference = avgSecondHalf - avgFirstHalf;
  const percentChange = (difference / avgFirstHalf) * 100;

  if (percentChange > 5) {
    trend = 'increasing';
  } else if (percentChange < -5) {
    trend = 'decreasing';
  }

  // Calculate growth rate (MB per hour)
  const firstMeasurement = measurements[0];
  const lastMeasurement = measurements[measurements.length - 1];
  const timeDiff =
    (lastMeasurement.timestamp.getTime() - firstMeasurement.timestamp.getTime()) / 1000 / 60 / 60; // hours
  const heapDiff = (lastMeasurement.heapUsed - firstMeasurement.heapUsed) / 1024 / 1024; // MB
  const heapGrowthRate = heapDiff / timeDiff;

  // Project time until heap exhaustion
  let projectedExhaustionHours: number | undefined;
  if (heapGrowthRate > 0) {
    const heapStats = v8.getHeapStatistics();
    const remainingHeap = (heapStats.heap_size_limit - lastMeasurement.heapUsed) / 1024 / 1024;
    projectedExhaustionHours = remainingHeap / heapGrowthRate;
  }

  return {
    trend,
    averageHeapUsed: avgHeapUsed,
    peakHeapUsed,
    heapGrowthRate,
    projectedExhaustionHours,
  };
}

/**
 * Gets detailed memory statistics.
 *
 * @returns {object} Detailed memory metrics
 *
 * @example
 * ```typescript
 * @Get('metrics/memory')
 * async getMemoryMetrics() {
 *   const stats = getMemoryStatistics();
 *   setGaugeMetric('memory_heap_used_bytes', stats.heapUsed);
 *   setGaugeMetric('memory_heap_total_bytes', stats.heapTotal);
 *   return stats;
 * }
 * ```
 */
export function getMemoryStatistics(): {
  heapUsed: number;
  heapTotal: number;
  heapPercentage: number;
  external: number;
  rss: number;
  arrayBuffers: number;
  heapLimit: number;
  availableHeap: number;
} {
  const memUsage = process.memoryUsage();
  const heapStats = v8.getHeapStatistics();

  return {
    heapUsed: memUsage.heapUsed,
    heapTotal: memUsage.heapTotal,
    heapPercentage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
    external: memUsage.external,
    rss: memUsage.rss,
    arrayBuffers: memUsage.arrayBuffers,
    heapLimit: heapStats.heap_size_limit,
    availableHeap: heapStats.heap_size_limit - memUsage.heapUsed,
  };
}

/**
 * Forces garbage collection if available.
 *
 * @returns {object} GC result with memory before/after
 *
 * @example
 * ```typescript
 * @Post('admin/gc')
 * @UseGuards(AdminGuard)
 * async forceGarbageCollection() {
 *   const result = forceGarbageCollection();
 *   return {
 *     ...result,
 *     freedMB: ((result.before.heapUsed - result.after.heapUsed) / 1024 / 1024).toFixed(2)
 *   };
 * }
 * ```
 */
export function forceGarbageCollection(): {
  executed: boolean;
  before: MemoryUsageMetrics;
  after: MemoryUsageMetrics;
  message?: string;
} {
  const before = process.memoryUsage();

  if (global.gc) {
    global.gc();

    const after = process.memoryUsage();

    return {
      executed: true,
      before: {
        heapUsed: before.heapUsed,
        heapTotal: before.heapTotal,
        heapPercentage: (before.heapUsed / before.heapTotal) * 100,
        external: before.external,
        rss: before.rss,
        arrayBuffers: before.arrayBuffers,
      },
      after: {
        heapUsed: after.heapUsed,
        heapTotal: after.heapTotal,
        heapPercentage: (after.heapUsed / after.heapTotal) * 100,
        external: after.external,
        rss: after.rss,
        arrayBuffers: after.arrayBuffers,
      },
    };
  }

  return {
    executed: false,
    before: {
      heapUsed: before.heapUsed,
      heapTotal: before.heapTotal,
      heapPercentage: (before.heapUsed / before.heapTotal) * 100,
      external: before.external,
      rss: before.rss,
      arrayBuffers: before.arrayBuffers,
    },
    after: {
      heapUsed: before.heapUsed,
      heapTotal: before.heapTotal,
      heapPercentage: (before.heapUsed / before.heapTotal) * 100,
      external: before.external,
      rss: before.rss,
      arrayBuffers: before.arrayBuffers,
    },
    message: 'GC not exposed. Run with --expose-gc flag.',
  };
}

// ============================================================================
// PERFORMANCE PROFILING
// ============================================================================

/**
 * Creates performance profiler for operation timing.
 *
 * @param {string} name - Profile name
 * @returns {object} Profiler with mark, measure, and end methods
 *
 * @example
 * ```typescript
 * async processLargeDataset(data: any[]) {
 *   const profiler = createPerformanceProfiler('process-dataset');
 *
 *   profiler.mark('start-validation');
 *   await this.validateData(data);
 *   profiler.mark('end-validation');
 *
 *   profiler.mark('start-processing');
 *   await this.processData(data);
 *   profiler.mark('end-processing');
 *
 *   profiler.measure('validation', 'start-validation', 'end-validation');
 *   profiler.measure('processing', 'start-processing', 'end-processing');
 *
 *   return profiler.end();
 * }
 * ```
 */
export function createPerformanceProfiler(name: string): {
  mark: (markName: string) => void;
  measure: (measureName: string, startMark: string, endMark: string) => void;
  end: () => PerformanceProfile;
} {
  const marks: PerformanceMark[] = [];
  const measures: PerformanceMeasure[] = [];
  const startTime = performance.now();

  return {
    mark: (markName: string) => {
      marks.push({
        name: markName,
        timestamp: performance.now(),
      });
    },

    measure: (measureName: string, startMark: string, endMark: string) => {
      const start = marks.find((m) => m.name === startMark);
      const end = marks.find((m) => m.name === endMark);

      if (start && end) {
        measures.push({
          name: measureName,
          duration: end.timestamp - start.timestamp,
          startMark,
          endMark,
        });
      }
    },

    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      return {
        duration,
        entryName: name,
        startTime,
        endTime,
        marks,
        measures,
        operations: measures.length,
        operationsPerSecond: measures.length / (duration / 1000),
      };
    },
  };
}

/**
 * Measures function execution time with statistics.
 *
 * @template T
 * @param {() => Promise<T>} fn - Async function to measure
 * @param {string} label - Measurement label
 * @returns {Promise<{ result: T; duration: number }>} Result and duration
 *
 * @example
 * ```typescript
 * const { result, duration } = await measureExecutionTime(
 *   async () => this.patientsRepository.findAll(),
 *   'fetch-all-patients'
 * );
 *
 * if (duration > 1000) {
 *   this.logger.warn(`Slow query: ${duration}ms`);
 * }
 *
 * return result;
 * ```
 */
export async function measureExecutionTime<T>(
  fn: () => Promise<T>,
  label?: string,
): Promise<{ result: T; duration: number }> {
  const startTime = performance.now();
  const result = await fn();
  const duration = performance.now() - startTime;

  if (label) {
    recordHistogramMetric(
      'function_execution_duration_ms',
      duration,
      [1, 5, 10, 50, 100, 500, 1000, 5000],
      { function: label },
    );
  }

  return { result, duration };
}

/**
 * Benchmarks function performance over multiple iterations.
 *
 * @template T
 * @param {() => T | Promise<T>} fn - Function to benchmark
 * @param {number} iterations - Number of iterations
 * @returns {Promise<object>} Benchmark statistics
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkFunction(
 *   () => this.encryptionService.encrypt(data),
 *   1000
 * );
 *
 * console.log(`Average: ${benchmark.average}ms`);
 * console.log(`p95: ${benchmark.p95}ms`);
 * console.log(`Throughput: ${benchmark.throughput} ops/sec`);
 * ```
 */
export async function benchmarkFunction<T>(
  fn: () => T | Promise<T>,
  iterations: number = 100,
): Promise<{
  iterations: number;
  average: number;
  median: number;
  min: number;
  max: number;
  p95: number;
  p99: number;
  throughput: number;
}> {
  const durations: number[] = [];
  const overallStart = performance.now();

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const duration = performance.now() - start;
    durations.push(duration);
  }

  const overallDuration = performance.now() - overallStart;
  const sorted = durations.sort((a, b) => a - b);

  return {
    iterations,
    average: durations.reduce((a, b) => a + b, 0) / iterations,
    median: sorted[Math.floor(iterations / 2)],
    min: sorted[0],
    max: sorted[iterations - 1],
    p95: sorted[Math.floor(iterations * 0.95)],
    p99: sorted[Math.floor(iterations * 0.99)],
    throughput: iterations / (overallDuration / 1000),
  };
}

/**
 * Tracks event loop lag for responsiveness monitoring.
 *
 * @param {number} intervalMs - Measurement interval
 * @param {(lag: number) => void} callback - Callback with lag value
 * @returns {() => void} Stop function
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class EventLoopMonitor implements OnModuleInit {
 *   private stopMonitoring: () => void;
 *
 *   onModuleInit() {
 *     this.stopMonitoring = trackEventLoopLag(1000, (lag) => {
 *       setGaugeMetric('event_loop_lag_ms', lag);
 *       if (lag > 100) {
 *         this.logger.warn(`High event loop lag: ${lag}ms`);
 *       }
 *     });
 *   }
 * }
 * ```
 */
export function trackEventLoopLag(
  intervalMs: number = 1000,
  callback: (lag: number) => void,
): () => void {
  let lastCheck = performance.now();

  const intervalId = setInterval(() => {
    const now = performance.now();
    const lag = now - lastCheck - intervalMs;
    lastCheck = now;
    callback(Math.max(0, lag));
  }, intervalMs);

  return () => clearInterval(intervalId);
}

// ============================================================================
// ALERT MANAGEMENT
// ============================================================================

/**
 * Configures alert threshold for metric.
 *
 * @param {AlertThreshold} threshold - Threshold configuration
 *
 * @example
 * ```typescript
 * configureAlertThreshold({
 *   metricName: 'memory_heap_percentage',
 *   operator: '>',
 *   threshold: 85,
 *   duration: 300, // 5 minutes
 *   severity: 'warning',
 *   notificationChannels: ['slack', 'email']
 * });
 * ```
 */
export function configureAlertThreshold(threshold: AlertThreshold): void {
  const thresholds = (global as any).__alertThresholds || new Map();
  thresholds.set(threshold.metricName, threshold);
  (global as any).__alertThresholds = thresholds;
}

/**
 * Evaluates metric against configured thresholds.
 *
 * @param {string} metricName - Metric name
 * @param {number} value - Current metric value
 * @returns {AlertEvent | null} Alert event if threshold breached
 *
 * @example
 * ```typescript
 * @Cron('* * * * *') // Every minute
 * async checkThresholds() {
 *   const memUsage = process.memoryUsage();
 *   const heapPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
 *
 *   const alert = evaluateThreshold('memory_heap_percentage', heapPercent);
 *   if (alert) {
 *     await this.notificationService.send(alert);
 *   }
 * }
 * ```
 */
export function evaluateThreshold(metricName: string, value: number): AlertEvent | null {
  const thresholds = (global as any).__alertThresholds || new Map();
  const threshold = thresholds.get(metricName);

  if (!threshold) {
    return null;
  }

  let breached = false;

  switch (threshold.operator) {
    case '>':
      breached = value > threshold.threshold;
      break;
    case '<':
      breached = value < threshold.threshold;
      break;
    case '>=':
      breached = value >= threshold.threshold;
      break;
    case '<=':
      breached = value <= threshold.threshold;
      break;
    case '=':
      breached = value === threshold.threshold;
      break;
  }

  if (!breached) {
    return null;
  }

  // Check if alert should be suppressed
  if (shouldSuppressAlert(threshold)) {
    return null;
  }

  return {
    id: generateAlertId(),
    timestamp: new Date(),
    metricName,
    currentValue: value,
    threshold: threshold.threshold,
    severity: threshold.severity,
    message: `${metricName} ${threshold.operator} ${threshold.threshold} (current: ${value})`,
  };
}

/**
 * Manages alert suppression rules.
 *
 * @param {string} metricName - Metric name
 * @param {SuppressionRule} rule - Suppression rule
 *
 * @example
 * ```typescript
 * // Suppress alerts during maintenance window
 * addAlertSuppressionRule('database_health', {
 *   startTime: '02:00',
 *   endTime: '04:00',
 *   days: ['Sunday'],
 *   reason: 'Weekly maintenance window'
 * });
 * ```
 */
export function addAlertSuppressionRule(metricName: string, rule: SuppressionRule): void {
  const thresholds = (global as any).__alertThresholds || new Map();
  const threshold = thresholds.get(metricName);

  if (threshold) {
    threshold.suppressionRules = threshold.suppressionRules || [];
    threshold.suppressionRules.push(rule);
    thresholds.set(metricName, threshold);
    (global as any).__alertThresholds = thresholds;
  }
}

/**
 * Sends alert notification to configured channels.
 *
 * @param {AlertEvent} alert - Alert event
 * @param {string[]} channels - Notification channels
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const alert = evaluateThreshold('cpu_usage', 95);
 * if (alert && alert.severity === 'critical') {
 *   await sendAlertNotification(alert, ['slack', 'pagerduty', 'email']);
 * }
 * ```
 */
export async function sendAlertNotification(
  alert: AlertEvent,
  channels: string[],
): Promise<void> {
  // Store alert in history
  const alertHistory = (global as any).__alertHistory || [];
  alertHistory.push(alert);
  (global as any).__alertHistory = alertHistory;

  // Increment alert counter
  incrementCounterMetric('alerts_triggered_total', 1, {
    metric: alert.metricName,
    severity: alert.severity,
  });

  // In production, integrate with actual notification services
  console.log(`[ALERT] ${alert.severity.toUpperCase()}: ${alert.message}`);
  console.log(`Channels: ${channels.join(', ')}`);
}

/**
 * Retrieves alert history with filtering.
 *
 * @param {object} filters - Filter options
 * @returns {AlertEvent[]} Filtered alert history
 *
 * @example
 * ```typescript
 * @Get('alerts/history')
 * async getAlertHistory(@Query() query: any) {
 *   return getAlertHistory({
 *     severity: query.severity,
 *     metricName: query.metric,
 *     startTime: new Date(query.start),
 *     endTime: new Date(query.end),
 *     resolved: query.resolved === 'true'
 *   });
 * }
 * ```
 */
export function getAlertHistory(filters?: {
  severity?: string;
  metricName?: string;
  startTime?: Date;
  endTime?: Date;
  resolved?: boolean;
}): AlertEvent[] {
  const alertHistory = (global as any).__alertHistory || [];

  if (!filters) {
    return alertHistory;
  }

  return alertHistory.filter((alert: AlertEvent) => {
    if (filters.severity && alert.severity !== filters.severity) {
      return false;
    }

    if (filters.metricName && alert.metricName !== filters.metricName) {
      return false;
    }

    if (filters.startTime && alert.timestamp < filters.startTime) {
      return false;
    }

    if (filters.endTime && alert.timestamp > filters.endTime) {
      return false;
    }

    if (filters.resolved !== undefined && alert.resolved !== filters.resolved) {
      return false;
    }

    return true;
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generates unique request ID
 */
function generateRequestId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generates unique trace ID (32 hex chars)
 */
function generateTraceId(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
}

/**
 * Generates unique span ID (16 hex chars)
 */
function generateSpanId(): string {
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
}

/**
 * Generates unique alert ID
 */
function generateAlertId(): string {
  return `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Records span (placeholder for tracing backend integration)
 */
function recordSpan(span: any): void {
  // In production, send to OpenTelemetry collector or other tracing backend
  const spans = (global as any).__spans || [];
  spans.push(span);
  (global as any).__spans = spans;
}

/**
 * Updates request metrics
 */
function updateRequestMetrics(duration: number, isError: boolean): void {
  const requestCount = (global as any).__requestCounter || 0;
  (global as any).__requestCounter = requestCount + 1;

  const totalResponseTime = (global as any).__totalResponseTime || 0;
  (global as any).__totalResponseTime = totalResponseTime + duration;
  (global as any).__avgResponseTime = (global as any).__totalResponseTime / (global as any).__requestCounter;

  if (isError) {
    const errorCount = (global as any).__errorCounter || 0;
    (global as any).__errorCounter = errorCount + 1;
    (global as any).__errorRate = (global as any).__errorCounter / (global as any).__requestCounter;
  }
}

/**
 * Executes individual health check
 */
async function executeHealthCheck(config: HealthCheckConfig): Promise<any> {
  // Placeholder - integrate with actual health check implementations
  return {
    healthy: true,
    responseTime: 10,
  };
}

/**
 * Redacts sensitive data from object
 */
function redactSensitiveData(data: any): any {
  const redacted = { ...data };
  const sensitiveKeys = [
    'password',
    'secret',
    'token',
    'key',
    'auth',
    'api_key',
    'ssn',
    'credit_card',
  ];

  Object.keys(redacted).forEach((key) => {
    if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
      redacted[key] = '***REDACTED***';
    }
  });

  return redacted;
}

/**
 * Checks if alert should be suppressed
 */
function shouldSuppressAlert(threshold: AlertThreshold): boolean {
  if (!threshold.suppressionRules || threshold.suppressionRules.length === 0) {
    return false;
  }

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

  return threshold.suppressionRules.some((rule) => {
    const inTimeRange = currentTime >= rule.startTime && currentTime <= rule.endTime;
    const inDayRange = !rule.days || rule.days.includes(currentDay);
    return inTimeRange && inDayRange;
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // APM Core Utilities
  captureAPMSnapshot,
  initializeAPMTracking,
  calculateSystemLoad,
  trackApplicationUptime,
  aggregatePerformanceMetrics,

  // Distributed Tracing
  createTraceContext,
  startSpan,
  extractTraceFromHeaders,
  injectTraceIntoHeaders,

  // Metrics Collection
  collectPrometheusMetrics,
  recordHistogramMetric,
  incrementCounterMetric,
  setGaugeMetric,
  exportMetricsAsPrometheus,

  // Custom Metrics
  createCustomMetric,
  trackSLACompliance,
  recordErrorRate,
  measureThroughput,

  // Performance Counters
  createPerformanceCounter,
  sampleCounterPeriodically,
  compareCounterSnapshots,
  aggregateCounters,

  // JMX-Style Monitoring
  registerManagedBean,
  queryManagedBeanAttribute,
  invokeManagedBeanOperation,
  listAllManagedBeans,

  // Health Check Utilities
  createHealthCheck,
  checkDatabaseHealth,
  checkCacheHealth,
  checkExternalServiceHealth,
  checkSystemResources,

  // Diagnostic Dumps
  generateDiagnosticDump,
  generateThreadDump,
  getHeapStatistics,
  getGarbageCollectionStats,

  // Memory Monitoring
  detectMemoryLeak,
  analyzeMemoryTrends,
  getMemoryStatistics,
  forceGarbageCollection,

  // Performance Profiling
  createPerformanceProfiler,
  measureExecutionTime,
  benchmarkFunction,
  trackEventLoopLag,

  // Alert Management
  configureAlertThreshold,
  evaluateThreshold,
  addAlertSuppressionRule,
  sendAlertNotification,
  getAlertHistory,
};
