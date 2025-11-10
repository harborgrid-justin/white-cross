/**
 * LOC: LOG_MONITOR_KIT_001
 * File: /reuse/logging-monitoring-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize-typescript
 *   - express
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - Logger services
 *   - Monitoring middleware
 *   - APM integrations
 *   - Health check endpoints
 *   - Observability dashboards
 */
/**
 * File: /reuse/logging-monitoring-kit.ts
 * Locator: WC-LOG-MONITOR-KIT-001
 * Purpose: Comprehensive Logging & Monitoring Kit - Enterprise observability toolkit
 *
 * Upstream: NestJS, Sequelize, Express, RxJS
 * Downstream: ../backend/monitoring/*, Observability, APM, Health checks
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45 logging/monitoring functions for structured logging, metrics, tracing, health
 *
 * LLM Context: Enterprise-grade logging and monitoring utilities for White Cross platform.
 * Provides structured logging with PII/PHI redaction, distributed tracing, performance metrics
 * collection, Prometheus format support, APM integration, error tracking, custom metrics,
 * histogram tracking, log aggregation, contextual logging, audit trails, database query logging,
 * comprehensive health checks, log sampling, custom transports, and correlation IDs.
 * HIPAA-compliant audit logging and observability patterns for healthcare applications.
 */
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { Model } from 'sequelize-typescript';
/**
 * Log levels enumeration
 */
export declare enum LogLevel {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal"
}
/**
 * Log level priority mapping
 */
export declare const LOG_LEVEL_PRIORITY: Record<LogLevel, number>;
/**
 * Structured log entry
 */
export interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    message: string;
    context?: string;
    traceId?: string;
    spanId?: string;
    correlationId?: string;
    userId?: string;
    tenantId?: string;
    requestId?: string;
    metadata?: Record<string, any>;
    error?: ErrorContext;
    performance?: PerformanceMetrics;
}
/**
 * Error context for logging
 */
export interface ErrorContext {
    name: string;
    message: string;
    stack?: string;
    code?: string;
    statusCode?: number;
    details?: Record<string, any>;
}
/**
 * Performance metrics
 */
export interface PerformanceMetrics {
    duration: number;
    cpuUsage?: number;
    memoryUsage?: number;
    timestamp: Date;
}
/**
 * Request context for logging
 */
export interface RequestContext {
    requestId: string;
    method: string;
    url: string;
    ip: string;
    userAgent?: string;
    userId?: string;
    tenantId?: string;
    headers?: Record<string, string>;
}
/**
 * Response context for logging
 */
export interface ResponseContext {
    statusCode: number;
    duration: number;
    responseSize?: number;
    headers?: Record<string, string>;
}
/**
 * Distributed trace context
 */
export interface TraceContext {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    serviceName: string;
    operationName: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    tags?: Record<string, string>;
    logs?: Array<{
        timestamp: Date;
        message: string;
    }>;
}
/**
 * Custom metric
 */
export interface CustomMetric {
    name: string;
    value: number;
    type: 'counter' | 'gauge' | 'histogram' | 'summary';
    labels?: Record<string, string>;
    timestamp: Date;
}
/**
 * Prometheus metric format
 */
export interface PrometheusMetric {
    name: string;
    help: string;
    type: 'counter' | 'gauge' | 'histogram' | 'summary';
    values: Array<{
        value: number;
        labels?: Record<string, string>;
        timestamp?: number;
    }>;
}
/**
 * Histogram bucket configuration
 */
export interface HistogramConfig {
    name: string;
    help: string;
    buckets: number[];
    labels?: string[];
}
/**
 * Health check status
 */
export declare enum HealthStatus {
    HEALTHY = "healthy",
    DEGRADED = "degraded",
    UNHEALTHY = "unhealthy"
}
/**
 * Health check result
 */
export interface HealthCheckResult {
    status: HealthStatus;
    checks: Record<string, ComponentHealth>;
    timestamp: Date;
    version?: string;
    uptime?: number;
}
/**
 * Component health status
 */
export interface ComponentHealth {
    status: HealthStatus;
    message?: string;
    responseTime?: number;
    metadata?: Record<string, any>;
}
/**
 * Audit log entry
 */
export interface AuditLogEntry {
    timestamp: Date;
    userId: string;
    tenantId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    changes?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    outcome: 'success' | 'failure';
    reason?: string;
}
/**
 * Query log entry
 */
export interface QueryLogEntry {
    query: string;
    duration: number;
    timestamp: Date;
    model?: string;
    operation?: string;
    rowCount?: number;
    parameters?: any[];
}
/**
 * Percentile statistics
 */
export interface PercentileStats {
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
    min: number;
    max: number;
    mean: number;
    count: number;
}
/**
 * Log transport interface
 */
export interface LogTransport {
    name: string;
    level: LogLevel;
    log: (entry: LogEntry) => void | Promise<void>;
}
/**
 * Log sampling configuration
 */
export interface SamplingConfig {
    enabled: boolean;
    rate: number;
    excludeLevels?: LogLevel[];
}
/**
 * PII/PHI redaction configuration
 */
export interface RedactionConfig {
    enabled: boolean;
    fields: string[];
    patterns?: RegExp[];
    replacement?: string;
}
/**
 * Application log model for persistence
 */
export declare class ApplicationLog extends Model {
    id: string;
    timestamp: Date;
    level: LogLevel;
    message: string;
    context: string;
    traceId: string;
    spanId: string;
    correlationId: string;
    userId: string;
    tenantId: string;
    requestId: string;
    metadata: Record<string, any>;
    error: ErrorContext;
    performance: PerformanceMetrics;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Audit logs model for compliance
 */
export declare class AuditLog extends Model {
    id: string;
    timestamp: Date;
    userId: string;
    tenantId: string;
    action: string;
    resource: string;
    resourceId: string;
    changes: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    outcome: string;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @function createStructuredLog
 * @description Creates a structured log entry with consistent formatting
 * @param {LogLevel} level - Log level
 * @param {string} message - Log message
 * @param {Partial<LogEntry>} context - Additional context
 * @returns {LogEntry} Structured log entry
 *
 * @example
 * ```typescript
 * const log = createStructuredLog(LogLevel.INFO, 'User logged in', {
 *   userId: 'user-123',
 *   traceId: 'trace-abc',
 *   metadata: { loginMethod: 'oauth' }
 * });
 * ```
 */
export declare const createStructuredLog: (level: LogLevel, message: string, context?: Partial<LogEntry>) => LogEntry;
/**
 * @function formatLogAsJSON
 * @description Formats log entry as JSON string for external systems
 * @param {LogEntry} entry - Log entry to format
 * @returns {string} JSON formatted log message
 *
 * @example
 * ```typescript
 * const formatted = formatLogAsJSON(logEntry);
 * console.log(formatted); // {"timestamp":"2025-01-01T00:00:00.000Z",...}
 * ```
 */
export declare const formatLogAsJSON: (entry: LogEntry) => string;
/**
 * @function formatLogAsText
 * @description Formats log entry as human-readable text
 * @param {LogEntry} entry - Log entry to format
 * @returns {string} Text formatted log message
 *
 * @example
 * ```typescript
 * const formatted = formatLogAsText(logEntry);
 * // [2025-01-01 00:00:00] INFO [UserService] User logged in
 * ```
 */
export declare const formatLogAsText: (entry: LogEntry) => string;
/**
 * @function enrichLogWithContext
 * @description Enriches log entry with additional contextual information
 * @param {LogEntry} entry - Base log entry
 * @param {Request} req - Express request object
 * @returns {LogEntry} Enriched log entry
 *
 * @example
 * ```typescript
 * const enrichedLog = enrichLogWithContext(baseLog, request);
 * ```
 */
export declare const enrichLogWithContext: (entry: LogEntry, req: Request) => LogEntry;
/**
 * @function createErrorLog
 * @description Creates structured log entry for errors with stack traces
 * @param {Error} error - Error object
 * @param {string} context - Error context
 * @param {Partial<LogEntry>} additional - Additional log data
 * @returns {LogEntry} Error log entry
 *
 * @security Sanitizes stack traces for production
 *
 * @example
 * ```typescript
 * try {
 *   // ... operation
 * } catch (error) {
 *   const errorLog = createErrorLog(error, 'UserService.createUser');
 *   logger.error(errorLog);
 * }
 * ```
 */
export declare const createErrorLog: (error: Error, context: string, additional?: Partial<LogEntry>) => LogEntry;
/**
 * @function shouldLog
 * @description Determines if a message should be logged based on configured level
 * @param {LogLevel} messageLevel - Level of the message
 * @param {LogLevel} configuredLevel - Configured minimum log level
 * @returns {boolean} True if message should be logged
 *
 * @example
 * ```typescript
 * if (shouldLog(LogLevel.DEBUG, LogLevel.INFO)) {
 *   // This returns false, DEBUG is lower priority than INFO
 * }
 * ```
 */
export declare const shouldLog: (messageLevel: LogLevel, configuredLevel: LogLevel) => boolean;
/**
 * @function parseLogLevel
 * @description Parses string log level to enum value
 * @param {string} level - Log level string
 * @returns {LogLevel} Parsed log level or INFO as default
 *
 * @example
 * ```typescript
 * const level = parseLogLevel(process.env.LOG_LEVEL || 'info');
 * ```
 */
export declare const parseLogLevel: (level: string) => LogLevel;
/**
 * @function setDynamicLogLevel
 * @description Creates a function to dynamically adjust log level
 * @param {LogLevel} initialLevel - Initial log level
 * @returns {object} Log level getter and setter
 *
 * @example
 * ```typescript
 * const { getLevel, setLevel } = setDynamicLogLevel(LogLevel.INFO);
 * setLevel(LogLevel.DEBUG); // Enable debug logging
 * ```
 */
export declare const setDynamicLogLevel: (initialLevel: LogLevel) => {
    getLevel: () => LogLevel;
    setLevel: (newLevel: LogLevel) => void;
    shouldLog: (messageLevel: LogLevel) => boolean;
};
/**
 * @function generateCorrelationId
 * @description Generates a unique correlation ID for request tracking
 * @returns {string} Correlation ID
 *
 * @example
 * ```typescript
 * const correlationId = generateCorrelationId();
 * // Returns: "corr-1234567890abcdef"
 * ```
 */
export declare const generateCorrelationId: () => string;
/**
 * @function extractCorrelationId
 * @description Extracts correlation ID from request headers
 * @param {Request} req - Express request object
 * @returns {string} Correlation ID or newly generated one
 *
 * @example
 * ```typescript
 * const correlationId = extractCorrelationId(req);
 * ```
 */
export declare const extractCorrelationId: (req: Request) => string;
/**
 * @function propagateCorrelationId
 * @description Creates headers for correlation ID propagation
 * @param {string} correlationId - Correlation ID
 * @returns {Record<string, string>} HTTP headers
 *
 * @example
 * ```typescript
 * const headers = propagateCorrelationId(correlationId);
 * // Use in HTTP client: axios.get(url, { headers });
 * ```
 */
export declare const propagateCorrelationId: (correlationId: string) => Record<string, string>;
/**
 * @function redactPII
 * @description Redacts PII/PHI from log data for HIPAA compliance
 * @param {any} data - Data to redact
 * @param {RedactionConfig} config - Redaction configuration
 * @returns {any} Redacted data
 *
 * @security HIPAA-compliant PII/PHI redaction
 *
 * @example
 * ```typescript
 * const redacted = redactPII(userData, {
 *   enabled: true,
 *   fields: ['ssn', 'dateOfBirth', 'email'],
 *   replacement: '[REDACTED]'
 * });
 * ```
 */
export declare const redactPII: (data: any, config: RedactionConfig) => any;
/**
 * @function createPHIRedactionConfig
 * @description Creates standard PHI redaction configuration for healthcare
 * @returns {RedactionConfig} PHI redaction configuration
 *
 * @example
 * ```typescript
 * const config = createPHIRedactionConfig();
 * const safeLog = redactPII(logData, config);
 * ```
 */
export declare const createPHIRedactionConfig: () => RedactionConfig;
/**
 * @function redactLogEntry
 * @description Redacts sensitive data from log entry
 * @param {LogEntry} entry - Log entry
 * @param {RedactionConfig} config - Redaction configuration
 * @returns {LogEntry} Redacted log entry
 *
 * @example
 * ```typescript
 * const safeLog = redactLogEntry(logEntry, createPHIRedactionConfig());
 * ```
 */
export declare const redactLogEntry: (entry: LogEntry, config: RedactionConfig) => LogEntry;
/**
 * @function shouldSampleLog
 * @description Determines if a log should be sampled (kept) based on configuration
 * @param {LogEntry} entry - Log entry
 * @param {SamplingConfig} config - Sampling configuration
 * @returns {boolean} True if log should be kept
 *
 * @example
 * ```typescript
 * const config = { enabled: true, rate: 0.1, excludeLevels: [LogLevel.ERROR] };
 * if (shouldSampleLog(logEntry, config)) {
 *   persistLog(logEntry);
 * }
 * ```
 */
export declare const shouldSampleLog: (entry: LogEntry, config: SamplingConfig) => boolean;
/**
 * @function createAdaptiveSampler
 * @description Creates an adaptive sampler that adjusts rate based on volume
 * @param {number} targetRatePerMinute - Target logs per minute
 * @returns {object} Adaptive sampler with shouldSample method
 *
 * @example
 * ```typescript
 * const sampler = createAdaptiveSampler(1000);
 * if (sampler.shouldSample(logEntry)) {
 *   logger.log(logEntry);
 * }
 * ```
 */
export declare const createAdaptiveSampler: (targetRatePerMinute: number) => {
    shouldSample: (entry: LogEntry) => boolean;
    getStats: () => {
        currentRate: number;
        logCount: number;
        windowAge: number;
    };
};
/**
 * @function createConsoleTransport
 * @description Creates a console log transport
 * @param {LogLevel} minLevel - Minimum log level
 * @param {boolean} colorize - Enable color output
 * @returns {LogTransport} Console transport
 *
 * @example
 * ```typescript
 * const transport = createConsoleTransport(LogLevel.INFO, true);
 * transport.log(logEntry);
 * ```
 */
export declare const createConsoleTransport: (minLevel?: LogLevel, colorize?: boolean) => LogTransport;
/**
 * @function createFileTransport
 * @description Creates a file log transport
 * @param {string} filePath - Log file path
 * @param {LogLevel} minLevel - Minimum log level
 * @returns {LogTransport} File transport
 *
 * @example
 * ```typescript
 * const transport = createFileTransport('/var/log/app.log', LogLevel.DEBUG);
 * transport.log(logEntry);
 * ```
 */
export declare const createFileTransport: (filePath: string, minLevel?: LogLevel) => LogTransport;
/**
 * @function createHttpTransport
 * @description Creates an HTTP log transport for external services
 * @param {string} url - HTTP endpoint URL
 * @param {LogLevel} minLevel - Minimum log level
 * @returns {LogTransport} HTTP transport
 *
 * @example
 * ```typescript
 * const transport = createHttpTransport('https://logs.example.com/ingest', LogLevel.WARN);
 * await transport.log(logEntry);
 * ```
 */
export declare const createHttpTransport: (url: string, minLevel?: LogLevel) => LogTransport;
/**
 * @function createMultiTransport
 * @description Combines multiple transports into one
 * @param {LogTransport[]} transports - Array of transports
 * @returns {LogTransport} Multi transport
 *
 * @example
 * ```typescript
 * const transport = createMultiTransport([
 *   createConsoleTransport(LogLevel.DEBUG),
 *   createFileTransport('/var/log/app.log', LogLevel.INFO)
 * ]);
 * ```
 */
export declare const createMultiTransport: (transports: LogTransport[]) => LogTransport;
/**
 * @class RequestLoggingInterceptor
 * @description NestJS interceptor for automatic request/response logging
 *
 * @example
 * ```typescript
 * @UseInterceptors(RequestLoggingInterceptor)
 * @Controller('users')
 * export class UsersController {}
 * ```
 */
export declare class RequestLoggingInterceptor implements NestInterceptor {
    private readonly logger;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
/**
 * @function createRequestLog
 * @description Creates structured log entry for HTTP requests
 * @param {Request} req - Express request object
 * @returns {LogEntry} Request log entry
 *
 * @example
 * ```typescript
 * const requestLog = createRequestLog(req);
 * logger.log(requestLog);
 * ```
 */
export declare const createRequestLog: (req: Request) => LogEntry;
/**
 * @function createResponseLog
 * @description Creates structured log entry for HTTP responses
 * @param {Response} res - Express response object
 * @param {number} duration - Request duration in ms
 * @returns {LogEntry} Response log entry
 *
 * @example
 * ```typescript
 * const responseLog = createResponseLog(res, 125);
 * logger.log(responseLog);
 * ```
 */
export declare const createResponseLog: (res: Response, duration: number) => LogEntry;
/**
 * @function measureExecutionTime
 * @description Measures execution time of async function
 * @param {Function} fn - Async function to measure
 * @returns {Promise} Result and duration
 *
 * @example
 * ```typescript
 * const { result, duration } = await measureExecutionTime(async () => {
 *   return await expensiveOperation();
 * });
 * console.log(`Operation took ${duration}ms`);
 * ```
 */
export declare const measureExecutionTime: <T>(fn: () => Promise<T>) => Promise<{
    result: T;
    duration: number;
}>;
/**
 * @function collectSystemMetrics
 * @description Collects current system resource metrics
 * @returns {object} System metrics including CPU and memory
 *
 * @example
 * ```typescript
 * const metrics = collectSystemMetrics();
 * console.log(`Memory usage: ${metrics.memoryUsage.heapUsed}MB`);
 * ```
 */
export declare const collectSystemMetrics: () => {
    cpuUsage: NodeJS.CpuUsage;
    memoryUsage: NodeJS.MemoryUsage;
    uptime: number;
    loadAverage: number[];
};
/**
 * @function createPerformanceTimer
 * @description Creates a reusable performance timer
 * @returns {object} Timer with start, stop, and reset methods
 *
 * @example
 * ```typescript
 * const timer = createPerformanceTimer();
 * timer.start();
 * // ... operation
 * const duration = timer.stop();
 * ```
 */
export declare const createPerformanceTimer: () => {
    start: () => void;
    stop: () => number;
    reset: () => void;
    getDuration: () => number | null;
};
/**
 * @function formatPrometheusMetric
 * @description Formats metric in Prometheus exposition format
 * @param {PrometheusMetric} metric - Metric to format
 * @returns {string} Prometheus format string
 *
 * @example
 * ```typescript
 * const formatted = formatPrometheusMetric({
 *   name: 'http_requests_total',
 *   help: 'Total HTTP requests',
 *   type: 'counter',
 *   values: [{ value: 100, labels: { method: 'GET' } }]
 * });
 * ```
 */
export declare const formatPrometheusMetric: (metric: PrometheusMetric) => string;
/**
 * @function createPrometheusRegistry
 * @description Creates a registry for Prometheus metrics
 * @returns {object} Registry with register/collect methods
 *
 * @example
 * ```typescript
 * const registry = createPrometheusRegistry();
 * registry.register({ name: 'http_requests_total', ... });
 * const output = registry.collect();
 * ```
 */
export declare const createPrometheusRegistry: () => {
    register: (metric: PrometheusMetric) => void;
    collect: () => string;
    getMetric: (name: string) => PrometheusMetric | undefined;
    clear: () => void;
};
/**
 * @function incrementPrometheusCounter
 * @description Increments a Prometheus counter metric
 * @param {string} name - Counter name
 * @param {number} value - Increment value
 * @param {Record<string, string>} labels - Metric labels
 * @returns {PrometheusMetric} Updated counter metric
 *
 * @example
 * ```typescript
 * const counter = incrementPrometheusCounter('http_requests_total', 1, {
 *   method: 'GET',
 *   status: '200'
 * });
 * ```
 */
export declare const incrementPrometheusCounter: (name: string, value?: number, labels?: Record<string, string>) => PrometheusMetric;
/**
 * @function setPrometheusGauge
 * @description Sets a Prometheus gauge metric value
 * @param {string} name - Gauge name
 * @param {number} value - Gauge value
 * @param {Record<string, string>} labels - Metric labels
 * @returns {PrometheusMetric} Gauge metric
 *
 * @example
 * ```typescript
 * const gauge = setPrometheusGauge('memory_usage_bytes', 1024000, {
 *   type: 'heap'
 * });
 * ```
 */
export declare const setPrometheusGauge: (name: string, value: number, labels?: Record<string, string>) => PrometheusMetric;
/**
 * @function recordPrometheusHistogram
 * @description Records observation in Prometheus histogram
 * @param {string} name - Histogram name
 * @param {number} value - Observed value
 * @param {number[]} buckets - Histogram buckets
 * @param {Record<string, string>} labels - Metric labels
 * @returns {PrometheusMetric} Histogram metric
 *
 * @example
 * ```typescript
 * const histogram = recordPrometheusHistogram(
 *   'http_request_duration_seconds',
 *   0.125,
 *   [0.1, 0.5, 1, 2, 5],
 *   { endpoint: '/users' }
 * );
 * ```
 */
export declare const recordPrometheusHistogram: (name: string, value: number, buckets: number[], labels?: Record<string, string>) => PrometheusMetric;
/**
 * @function generateTraceId
 * @description Generates unique trace ID for distributed tracing
 * @returns {string} Hexadecimal trace ID
 *
 * @example
 * ```typescript
 * const traceId = generateTraceId();
 * // Returns: "a1b2c3d4e5f678901234567890abcdef"
 * ```
 */
export declare const generateTraceId: () => string;
/**
 * @function generateSpanId
 * @description Generates unique span ID for distributed tracing
 * @returns {string} Hexadecimal span ID
 *
 * @example
 * ```typescript
 * const spanId = generateSpanId();
 * // Returns: "a1b2c3d4e5f67890"
 * ```
 */
export declare const generateSpanId: () => string;
/**
 * @function createTraceContext
 * @description Creates a new trace context for distributed tracing
 * @param {string} serviceName - Name of the service
 * @param {string} operationName - Name of the operation
 * @param {string} parentSpanId - Parent span ID if exists
 * @returns {TraceContext} Trace context object
 *
 * @example
 * ```typescript
 * const trace = createTraceContext('user-service', 'createUser');
 * ```
 */
export declare const createTraceContext: (serviceName: string, operationName: string, parentSpanId?: string) => TraceContext;
/**
 * @function finishTrace
 * @description Completes a trace span with end time and duration
 * @param {TraceContext} trace - Trace context to finish
 * @returns {TraceContext} Completed trace context
 *
 * @example
 * ```typescript
 * const completedTrace = finishTrace(trace);
 * await persistTrace(completedTrace);
 * ```
 */
export declare const finishTrace: (trace: TraceContext) => TraceContext;
/**
 * @function propagateTraceHeaders
 * @description Creates HTTP headers for trace propagation
 * @param {TraceContext} trace - Trace context
 * @returns {Record<string, string>} HTTP headers
 *
 * @example
 * ```typescript
 * const headers = propagateTraceHeaders(trace);
 * // Use in HTTP client: axios.get(url, { headers });
 * ```
 */
export declare const propagateTraceHeaders: (trace: TraceContext) => Record<string, string>;
/**
 * @function checkDatabaseHealth
 * @description Checks database connection health
 * @param {any} sequelize - Sequelize instance
 * @returns {Promise<ComponentHealth>} Database health status
 *
 * @example
 * ```typescript
 * const dbHealth = await checkDatabaseHealth(sequelize);
 * ```
 */
export declare const checkDatabaseHealth: (sequelize: any) => Promise<ComponentHealth>;
/**
 * @function checkMemoryHealth
 * @description Checks memory usage health
 * @param {number} threshold - Memory threshold percentage (0-1)
 * @returns {ComponentHealth} Memory health status
 *
 * @example
 * ```typescript
 * const memHealth = checkMemoryHealth(0.85); // 85% threshold
 * ```
 */
export declare const checkMemoryHealth: (threshold?: number) => ComponentHealth;
/**
 * @function createLivenessProbe
 * @description Creates a liveness probe for Kubernetes
 * @returns {Function} Express middleware for liveness
 *
 * @example
 * ```typescript
 * app.get('/healthz/live', createLivenessProbe());
 * ```
 */
export declare const createLivenessProbe: () => (req: Request, res: Response) => void;
/**
 * @function createReadinessProbe
 * @description Creates a readiness probe for Kubernetes
 * @param {object} checks - Health check functions
 * @returns {Function} Express middleware for readiness
 *
 * @example
 * ```typescript
 * app.get('/healthz/ready', createReadinessProbe({
 *   database: () => checkDatabaseHealth(sequelize)
 * }));
 * ```
 */
export declare const createReadinessProbe: (checks: Record<string, () => Promise<ComponentHealth> | ComponentHealth>) => (req: Request, res: Response) => Promise<void>;
/**
 * @function createStartupProbe
 * @description Creates a startup probe for Kubernetes
 * @param {Function} initCheck - Initialization check function
 * @returns {Function} Express middleware for startup
 *
 * @example
 * ```typescript
 * app.get('/healthz/startup', createStartupProbe(async () => {
 *   return await checkAppInitialized();
 * }));
 * ```
 */
export declare const createStartupProbe: (initCheck: () => Promise<boolean>) => (req: Request, res: Response) => Promise<void>;
/**
 * @function createAuditLog
 * @description Creates HIPAA-compliant audit log entry
 * @param {Partial<AuditLogEntry>} entry - Audit log data
 * @returns {AuditLogEntry} Complete audit log entry
 *
 * @security HIPAA-compliant audit trail
 *
 * @example
 * ```typescript
 * const auditLog = createAuditLog({
 *   userId: 'user-123',
 *   action: 'VIEW_PATIENT_RECORD',
 *   resource: 'patient',
 *   resourceId: 'patient-456',
 *   outcome: 'success'
 * });
 * ```
 */
export declare const createAuditLog: (entry: Partial<AuditLogEntry>) => AuditLogEntry;
/**
 * @function logDataAccess
 * @description Logs data access for compliance
 * @param {string} userId - User ID
 * @param {string} resource - Resource type
 * @param {string} resourceId - Resource ID
 * @param {string} action - Action performed
 * @returns {AuditLogEntry} Audit log entry
 *
 * @security Required for HIPAA compliance
 *
 * @example
 * ```typescript
 * const audit = logDataAccess('user-123', 'patient', 'patient-456', 'READ');
 * await persistAuditLog(audit);
 * ```
 */
export declare const logDataAccess: (userId: string, resource: string, resourceId: string, action: string) => AuditLogEntry;
/**
 * @function createAuditMiddleware
 * @description Creates Express middleware for automatic audit logging
 * @param {Function} persistFn - Function to persist audit logs
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(createAuditMiddleware(async (log) => {
 *   await AuditLog.create(log);
 * }));
 * ```
 */
export declare const createAuditMiddleware: (persistFn: (log: AuditLogEntry) => Promise<void>) => (req: Request, res: Response, next: any) => Promise<void>;
//# sourceMappingURL=logging-monitoring-kit.d.ts.map