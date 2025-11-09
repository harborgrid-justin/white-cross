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
import { Logger } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
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
    'patient.id'?: string;
    'encounter.id'?: string;
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
    buckets?: number[];
    percentiles?: number[];
}
/**
 * Performance counter data
 */
export interface PerformanceCounter {
    name: string;
    value: number;
    timestamp: Date;
    labels?: Record<string, string>;
    delta?: number;
    rate?: number;
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
    redactPHI?: boolean;
}
/**
 * Memory leak detection result
 */
export interface MemoryLeakAnalysis {
    suspectedLeak: boolean;
    confidence: 'low' | 'medium' | 'high';
    growthRate: number;
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
    duration?: number;
    severity: 'info' | 'warning' | 'error' | 'critical';
    notificationChannels?: string[];
    suppressionRules?: SuppressionRule[];
}
/**
 * Alert suppression rule
 */
export interface SuppressionRule {
    startTime: string;
    endTime: string;
    days?: string[];
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
export declare function captureAPMSnapshot(additionalMetrics?: Record<string, any>): APMSnapshot;
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
export declare function initializeAPMTracking(logger: Logger): (req: any, res: any, next: any) => void;
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
export declare function calculateSystemLoad(): {
    loadAverage1m: number;
    loadAverage5m: number;
    loadAverage15m: number;
    cpuCount: number;
    loadPerCore1m: number;
    cpuUtilization: number;
};
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
export declare function trackApplicationUptime(): {
    uptimeSeconds: number;
    uptimeFormatted: string;
    startTime: Date;
    processUptime: number;
    systemUptime: number;
};
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
export declare function aggregatePerformanceMetrics(snapshots: APMSnapshot[], windowMinutes: number): {
    avgResponseTime: number;
    avgCpuUsage: number;
    avgMemoryUsage: number;
    peakMemoryUsage: number;
    totalRequests: number;
    totalErrors: number;
    p50ResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
};
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
export declare function createTraceContext(parentContext?: Partial<TraceContext>): TraceContext;
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
export declare function startSpan(name: string, context: TraceContext, attributes?: SpanAttributes): {
    spanId: string;
    startTime: number;
    end: (endAttributes?: SpanAttributes) => void;
};
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
export declare function extractTraceFromHeaders(headers: Record<string, string | string[] | undefined>): TraceContext | undefined;
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
export declare function injectTraceIntoHeaders(context: TraceContext): Record<string, string>;
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
export declare function collectPrometheusMetrics(definitions: MetricDefinition[]): {
    record: (name: string, value: number, labels?: Record<string, string>) => void;
    getMetrics: () => string;
    reset: () => void;
};
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
export declare function recordHistogramMetric(name: string, value: number, buckets: number[], labels?: Record<string, string>): void;
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
export declare function incrementCounterMetric(name: string, increment?: number, labels?: Record<string, string>): void;
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
export declare function setGaugeMetric(name: string, value: number, labels?: Record<string, string>): void;
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
export declare function exportMetricsAsPrometheus(): string;
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
export declare function createCustomMetric(definition: MetricDefinition): {
    record: (value: number, labels?: Record<string, string>) => void;
    get: (labels?: Record<string, string>) => number | undefined;
    reset: () => void;
};
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
export declare function trackSLACompliance(operation: string, duration: number, slaThreshold: number, labels?: Record<string, string>): void;
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
export declare function recordErrorRate(errorType: string, operation: string, labels?: Record<string, string>): void;
export declare class DatabaseHealthIndicator extends HealthIndicator {
    constructor(: any, private connection: Connection, : any): Generator<never, void, unknown>;
    (): any;
    async(): any;
    isHealthy(): Promise<HealthIndicatorResult>;
    (): any;
}
export declare class RedisHealthIndicator extends HealthIndicator {
    constructor(: any, private redisClient: Redis, : any): Generator<never, void, unknown>;
    (): any;
    async(): any;
    isHealthy(): Promise<HealthIndicatorResult>;
    (): any;
}
export declare class MemoryMonitor {
    private(): any;
    measurements: MemoryMeasurement[];
    (): any;
    (): any;
    async(): any;
    analyzeTrends(): void;
    (): any;
}
export declare class EventLoopMonitor implements OnModuleInit {
    private(): any;
    stopMonitoring: () => void;
    (): any;
    onModuleInit(): Generator<never, void, unknown>;
    (): any;
}
//# sourceMappingURL=nestjs-oracle-monitoring-kit.d.ts.map