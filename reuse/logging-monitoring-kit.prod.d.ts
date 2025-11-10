/**
 * LOC: LOG_MON_PROD_KIT_001
 * File: /reuse/logging-monitoring-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - winston (logging framework)
 *   - pino (fast JSON logger)
 *   - @opentelemetry/api (distributed tracing)
 *   - @opentelemetry/sdk-node (OpenTelemetry SDK)
 *   - prom-client (Prometheus metrics)
 *   - @sentry/node (error tracking)
 *   - @nestjs/common (NestJS framework)
 *   - sequelize-typescript (ORM)
 *   - zod (validation)
 *
 * DOWNSTREAM (imported by):
 *   - Logger services
 *   - Monitoring middleware
 *   - APM integrations
 *   - Health check endpoints
 *   - Observability dashboards
 *   - Audit logging services
 *   - Performance monitoring
 */
/**
 * File: /reuse/logging-monitoring-kit.prod.ts
 * Locator: WC-LOG-MON-PROD-KIT-001
 * Purpose: Production-Grade Logging & Monitoring Kit - Enterprise observability and monitoring toolkit
 *
 * Upstream: Winston, Pino, OpenTelemetry, Prometheus, Sentry, NestJS, Sequelize, Zod
 * Downstream: ../backend/monitoring/*, Observability, APM, Health checks, Audit services
 * Dependencies: TypeScript 5.x, Node 18+, winston, pino, @opentelemetry/*, prom-client, @sentry/node, zod
 * Exports: 47 production-ready functions for structured logging, distributed tracing, metrics, alerting, monitoring
 *
 * LLM Context: Enterprise-grade logging and monitoring utilities for White Cross healthcare platform.
 * Provides Winston/Pino integration, structured logging with PII redaction, OpenTelemetry distributed tracing,
 * Prometheus metrics collection, Sentry error tracking, performance monitoring, HIPAA-compliant audit logging,
 * health checks, alerting, correlation IDs, log aggregation, and comprehensive observability patterns.
 * Includes NestJS interceptors, middleware, services, and Sequelize hooks for automatic audit trails.
 */
import { NestInterceptor, ExecutionContext, CallHandler, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Observable } from 'rxjs';
import { Model } from 'sequelize-typescript';
import { z } from 'zod';
/**
 * Log level validation schema
 */
export declare const LogLevelSchema: any;
/**
 * Log entry validation schema
 */
export declare const LogEntrySchema: any;
/**
 * Metric validation schema
 */
export declare const MetricSchema: any;
/**
 * Trace context validation schema
 */
export declare const TraceContextSchema: any;
/**
 * Audit log validation schema
 */
export declare const AuditLogSchema: any;
/**
 * Health check validation schema
 */
export declare const HealthCheckSchema: any;
export type LogLevel = z.infer<typeof LogLevelSchema>;
export type LogEntry = z.infer<typeof LogEntrySchema>;
export type CustomMetric = z.infer<typeof MetricSchema>;
export type TraceContext = z.infer<typeof TraceContextSchema>;
export type AuditLogEntry = z.infer<typeof AuditLogSchema>;
export type HealthCheckResult = z.infer<typeof HealthCheckSchema>;
/**
 * Winston logger configuration
 */
export interface WinstonLoggerConfig {
    level: LogLevel;
    format?: 'json' | 'simple' | 'prettyPrint';
    transports?: WinstonTransportConfig[];
    exitOnError?: boolean;
    silent?: boolean;
}
/**
 * Winston transport configuration
 */
export interface WinstonTransportConfig {
    type: 'console' | 'file' | 'http' | 'stream';
    level?: LogLevel;
    filename?: string;
    maxsize?: number;
    maxFiles?: number;
    tailable?: boolean;
    url?: string;
    stream?: any;
}
/**
 * Pino logger configuration
 */
export interface PinoLoggerConfig {
    level: LogLevel;
    prettyPrint?: boolean;
    redact?: string[];
    serializers?: Record<string, (value: any) => any>;
    base?: Record<string, any>;
    timestamp?: boolean | (() => string);
}
/**
 * OpenTelemetry configuration
 */
export interface OpenTelemetryConfig {
    serviceName: string;
    serviceVersion?: string;
    endpoint?: string;
    headers?: Record<string, string>;
    exporterType?: 'jaeger' | 'zipkin' | 'otlp';
    samplingRate?: number;
}
/**
 * Prometheus metrics configuration
 */
export interface PrometheusConfig {
    prefix?: string;
    labels?: Record<string, string>;
    defaultMetrics?: boolean;
    collectInterval?: number;
}
/**
 * Sentry configuration
 */
export interface SentryConfig {
    dsn: string;
    environment?: string;
    release?: string;
    tracesSampleRate?: number;
    profilesSampleRate?: number;
    beforeSend?: (event: any) => any;
    integrations?: any[];
}
/**
 * Correlation ID context
 */
export interface CorrelationContext {
    correlationId: string;
    requestId: string;
    sessionId?: string;
    userId?: string;
    tenantId?: string;
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
 * Alerting rule
 */
export interface AlertRule {
    name: string;
    metric: string;
    threshold: number;
    operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
    window: number;
    severity: 'info' | 'warning' | 'critical';
    actions: AlertAction[];
}
/**
 * Alert action
 */
export interface AlertAction {
    type: 'email' | 'webhook' | 'pagerduty' | 'slack';
    config: Record<string, any>;
}
/**
 * Log rotation configuration
 */
export interface LogRotationConfig {
    maxSize: string;
    maxFiles: number;
    compress?: boolean;
    datePattern?: string;
}
/**
 * PII field patterns for redaction
 */
export declare const PII_PATTERNS: {
    email: RegExp;
    phone: RegExp;
    ssn: RegExp;
    creditCard: RegExp;
    ipAddress: RegExp;
};
/**
 * @function createWinstonLogger
 * @description Creates a Winston logger instance with production configuration
 * @param {WinstonLoggerConfig} config - Winston logger configuration
 * @returns {any} Configured Winston logger
 *
 * @example
 * ```typescript
 * const logger = createWinstonLogger({
 *   level: 'info',
 *   format: 'json',
 *   transports: [
 *     { type: 'console' },
 *     { type: 'file', filename: 'app.log', maxsize: 5242880, maxFiles: 5 }
 *   ]
 * });
 * logger.info('Application started', { version: '1.0.0' });
 * ```
 */
export declare const createWinstonLogger: (config: WinstonLoggerConfig) => any;
/**
 * @function createWinstonFileTransport
 * @description Creates a Winston file transport with rotation
 * @param {string} filename - Log file path
 * @param {LogRotationConfig} rotation - Rotation configuration
 * @returns {WinstonTransportConfig} File transport configuration
 *
 * @example
 * ```typescript
 * const fileTransport = createWinstonFileTransport('logs/app.log', {
 *   maxSize: '10m',
 *   maxFiles: 7,
 *   compress: true,
 *   datePattern: 'YYYY-MM-DD'
 * });
 * ```
 */
export declare const createWinstonFileTransport: (filename: string, rotation: LogRotationConfig) => WinstonTransportConfig;
/**
 * @function createWinstonConsoleTransport
 * @description Creates a Winston console transport with formatting
 * @param {LogLevel} level - Minimum log level
 * @param {boolean} colorize - Enable color output
 * @returns {WinstonTransportConfig} Console transport configuration
 *
 * @example
 * ```typescript
 * const consoleTransport = createWinstonConsoleTransport('debug', true);
 * ```
 */
export declare const createWinstonConsoleTransport: (level: LogLevel, colorize?: boolean) => WinstonTransportConfig;
/**
 * @function createPinoLogger
 * @description Creates a Pino logger instance with production configuration
 * @param {PinoLoggerConfig} config - Pino logger configuration
 * @returns {any} Configured Pino logger
 *
 * @performance Pino is 5x faster than Winston for JSON logging
 *
 * @example
 * ```typescript
 * const logger = createPinoLogger({
 *   level: 'info',
 *   prettyPrint: false,
 *   redact: ['password', 'ssn', 'creditCard'],
 *   timestamp: () => `,"time":"${new Date().toISOString()}"`
 * });
 * logger.info({ userId: 'user-123' }, 'User logged in');
 * ```
 */
export declare const createPinoLogger: (config: PinoLoggerConfig) => any;
/**
 * @function createPinoRedactionConfig
 * @description Creates Pino redaction configuration for PII protection
 * @param {string[]} additionalPaths - Additional JSON paths to redact
 * @returns {object} Pino redaction configuration
 *
 * @security HIPAA-compliant PII redaction
 *
 * @example
 * ```typescript
 * const redactionConfig = createPinoRedactionConfig([
 *   'user.ssn',
 *   'patient.medicalRecordNumber'
 * ]);
 * ```
 */
export declare const createPinoRedactionConfig: (additionalPaths?: string[]) => {
    paths: string[];
    censor: string;
};
/**
 * @function createPinoSerializers
 * @description Creates custom serializers for Pino logger
 * @returns {Record<string, Function>} Serializer functions
 *
 * @example
 * ```typescript
 * const serializers = createPinoSerializers();
 * const logger = pino({ serializers });
 * ```
 */
export declare const createPinoSerializers: () => Record<string, (value: any) => any>;
/**
 * @function redactPII
 * @description Redacts personally identifiable information from log messages
 * @param {string} message - Log message to redact
 * @param {Record<string, RegExp>} customPatterns - Custom PII patterns
 * @returns {string} Redacted message
 *
 * @security HIPAA-compliant PII redaction
 *
 * @example
 * ```typescript
 * const redacted = redactPII(
 *   'User email: john@example.com, SSN: 123-45-6789',
 *   { mrn: /MRN-\d{6}/g }
 * );
 * // Output: 'User email: [EMAIL], SSN: [SSN]'
 * ```
 */
export declare const redactPII: (message: string, customPatterns?: Record<string, RegExp>) => string;
/**
 * @function sanitizeLogData
 * @description Sanitizes log data object by removing/redacting sensitive fields
 * @param {Record<string, any>} data - Log data object
 * @param {string[]} sensitiveFields - Field names to redact
 * @returns {Record<string, any>} Sanitized data
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeLogData(
 *   { username: 'john', password: 'secret123', role: 'admin' },
 *   ['password', 'ssn', 'apiKey']
 * );
 * // Output: { username: 'john', password: '[REDACTED]', role: 'admin' }
 * ```
 */
export declare const sanitizeLogData: (data: Record<string, any>, sensitiveFields?: string[]) => Record<string, any>;
/**
 * @function createSecureLogEntry
 * @description Creates a log entry with automatic PII redaction
 * @param {LogLevel} level - Log level
 * @param {string} message - Log message
 * @param {Partial<LogEntry>} context - Log context
 * @returns {LogEntry} Secure log entry
 *
 * @example
 * ```typescript
 * const log = createSecureLogEntry('info', 'User registered: john@example.com', {
 *   userId: 'user-123',
 *   metadata: { email: 'john@example.com', password: 'secret' }
 * });
 * ```
 */
export declare const createSecureLogEntry: (level: LogLevel, message: string, context?: Partial<LogEntry>) => LogEntry;
/**
 * @function generateCorrelationId
 * @description Generates a unique correlation ID for request tracking
 * @returns {string} Correlation ID (UUID v4)
 *
 * @example
 * ```typescript
 * const correlationId = generateCorrelationId();
 * // Output: "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export declare const generateCorrelationId: () => string;
/**
 * @function extractCorrelationContext
 * @description Extracts correlation context from request headers
 * @param {Request} req - Express request object
 * @returns {CorrelationContext} Correlation context
 *
 * @example
 * ```typescript
 * const context = extractCorrelationContext(req);
 * logger.info('Processing request', { ...context });
 * ```
 */
export declare const extractCorrelationContext: (req: Request) => CorrelationContext;
/**
 * @function injectCorrelationHeaders
 * @description Injects correlation headers into outgoing HTTP requests
 * @param {CorrelationContext} context - Correlation context
 * @returns {Record<string, string>} HTTP headers
 *
 * @example
 * ```typescript
 * const headers = injectCorrelationHeaders(context);
 * axios.get(url, { headers });
 * ```
 */
export declare const injectCorrelationHeaders: (context: CorrelationContext) => Record<string, string>;
/**
 * @class CorrelationIdMiddleware
 * @description NestJS middleware that adds correlation ID to all requests
 *
 * @example
 * ```typescript
 * export class AppModule implements NestModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer.apply(CorrelationIdMiddleware).forRoutes('*');
 *   }
 * }
 * ```
 */
export declare class CorrelationIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
/**
 * @class LoggingInterceptor
 * @description NestJS interceptor for comprehensive request/response logging
 *
 * @example
 * ```typescript
 * @UseInterceptors(LoggingInterceptor)
 * @Controller('users')
 * export class UsersController {}
 * ```
 */
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly logger;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
/**
 * @class PerformanceInterceptor
 * @description NestJS interceptor for performance monitoring
 *
 * @example
 * ```typescript
 * @UseInterceptors(PerformanceInterceptor)
 * @Controller('reports')
 * export class ReportsController {}
 * ```
 */
export declare class PerformanceInterceptor implements NestInterceptor {
    private readonly logger;
    private readonly slowThreshold;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
/**
 * @function initializeOpenTelemetry
 * @description Initializes OpenTelemetry SDK with tracing and metrics
 * @param {OpenTelemetryConfig} config - OpenTelemetry configuration
 * @returns {object} Tracer and meter providers
 *
 * @example
 * ```typescript
 * const { tracer, meter } = initializeOpenTelemetry({
 *   serviceName: 'user-service',
 *   serviceVersion: '1.0.0',
 *   endpoint: 'http://jaeger:4318',
 *   exporterType: 'otlp',
 *   samplingRate: 0.1
 * });
 * ```
 */
export declare const initializeOpenTelemetry: (config: OpenTelemetryConfig) => any;
/**
 * @function generateTraceId
 * @description Generates a W3C-compliant trace ID
 * @returns {string} 32-character hex trace ID
 */
export declare const generateTraceId: () => string;
/**
 * @function generateSpanId
 * @description Generates a W3C-compliant span ID
 * @returns {string} 16-character hex span ID
 */
export declare const generateSpanId: () => string;
/**
 * @function createTraceContext
 * @description Creates a new trace context for distributed tracing
 * @param {string} serviceName - Service name
 * @param {string} operationName - Operation name
 * @param {string} parentSpanId - Parent span ID
 * @returns {TraceContext} Trace context
 *
 * @example
 * ```typescript
 * const trace = createTraceContext('payment-service', 'processPayment');
 * ```
 */
export declare const createTraceContext: (serviceName: string, operationName: string, parentSpanId?: string) => TraceContext;
/**
 * @function finishTrace
 * @description Completes a trace span with timing information
 * @param {TraceContext} trace - Trace context
 * @returns {TraceContext} Completed trace
 */
export declare const finishTrace: (trace: TraceContext) => TraceContext;
/**
 * @function propagateTraceContext
 * @description Propagates trace context via W3C trace context headers
 * @param {TraceContext} trace - Trace context
 * @returns {Record<string, string>} HTTP headers
 *
 * @example
 * ```typescript
 * const headers = propagateTraceContext(trace);
 * axios.get(url, { headers });
 * ```
 */
export declare const propagateTraceContext: (trace: TraceContext) => Record<string, string>;
/**
 * @function createPrometheusRegistry
 * @description Creates a Prometheus metrics registry
 * @param {PrometheusConfig} config - Prometheus configuration
 * @returns {any} Metrics registry
 *
 * @example
 * ```typescript
 * const registry = createPrometheusRegistry({
 *   prefix: 'whitecross_',
 *   labels: { service: 'api', environment: 'production' },
 *   defaultMetrics: true,
 *   collectInterval: 10000
 * });
 * ```
 */
export declare const createPrometheusRegistry: (config: PrometheusConfig) => any;
/**
 * @function createPrometheusCounter
 * @description Creates a Prometheus counter metric
 * @param {string} name - Metric name
 * @param {string} help - Metric description
 * @param {string[]} labelNames - Label names
 * @returns {any} Counter metric
 *
 * @example
 * ```typescript
 * const httpRequests = createPrometheusCounter(
 *   'http_requests_total',
 *   'Total HTTP requests',
 *   ['method', 'status', 'path']
 * );
 * httpRequests.inc({ method: 'GET', status: '200', path: '/users' });
 * ```
 */
export declare const createPrometheusCounter: (name: string, help: string, labelNames?: string[]) => any;
/**
 * @function createPrometheusGauge
 * @description Creates a Prometheus gauge metric
 * @param {string} name - Metric name
 * @param {string} help - Metric description
 * @param {string[]} labelNames - Label names
 * @returns {any} Gauge metric
 *
 * @example
 * ```typescript
 * const activeConnections = createPrometheusGauge(
 *   'active_connections',
 *   'Number of active connections',
 *   ['service']
 * );
 * activeConnections.set({ service: 'api' }, 42);
 * ```
 */
export declare const createPrometheusGauge: (name: string, help: string, labelNames?: string[]) => any;
/**
 * @function createPrometheusHistogram
 * @description Creates a Prometheus histogram metric
 * @param {string} name - Metric name
 * @param {string} help - Metric description
 * @param {number[]} buckets - Histogram buckets
 * @param {string[]} labelNames - Label names
 * @returns {any} Histogram metric
 *
 * @example
 * ```typescript
 * const requestDuration = createPrometheusHistogram(
 *   'http_request_duration_ms',
 *   'HTTP request duration in milliseconds',
 *   [10, 50, 100, 500, 1000, 5000],
 *   ['method', 'path']
 * );
 * requestDuration.observe({ method: 'GET', path: '/users' }, 125);
 * ```
 */
export declare const createPrometheusHistogram: (name: string, help: string, buckets: number[], labelNames?: string[]) => any;
/**
 * @function createMetricsEndpoint
 * @description Creates Express endpoint for Prometheus metrics
 * @param {any} registry - Prometheus registry
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.get('/metrics', createMetricsEndpoint(registry));
 * ```
 */
export declare const createMetricsEndpoint: (registry: any) => (req: Request, res: Response) => Promise<void>;
/**
 * @function initializeSentry
 * @description Initializes Sentry error tracking
 * @param {SentryConfig} config - Sentry configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * initializeSentry({
 *   dsn: 'https://xxx@sentry.io/xxx',
 *   environment: 'production',
 *   release: 'v1.0.0',
 *   tracesSampleRate: 0.1,
 *   profilesSampleRate: 0.1
 * });
 * ```
 */
export declare const initializeSentry: (config: SentryConfig) => void;
/**
 * @function captureSentryException
 * @description Captures exception in Sentry with context
 * @param {Error} error - Error to capture
 * @param {Record<string, any>} context - Additional context
 * @returns {string} Event ID
 *
 * @example
 * ```typescript
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   captureSentryException(error, {
 *     userId: 'user-123',
 *     operation: 'payment',
 *     metadata: { amount: 100 }
 *   });
 * }
 * ```
 */
export declare const captureSentryException: (error: Error, context?: Record<string, any>) => string;
/**
 * @function captureSentryMessage
 * @description Captures message in Sentry
 * @param {string} message - Message to capture
 * @param {string} level - Severity level
 * @param {Record<string, any>} context - Additional context
 * @returns {string} Event ID
 */
export declare const captureSentryMessage: (message: string, level?: "info" | "warning" | "error", context?: Record<string, any>) => string;
/**
 * @function addSentryBreadcrumb
 * @description Adds breadcrumb to Sentry for debugging context
 * @param {string} category - Breadcrumb category
 * @param {string} message - Breadcrumb message
 * @param {Record<string, any>} data - Additional data
 *
 * @example
 * ```typescript
 * addSentryBreadcrumb('auth', 'User login attempt', { email: 'user@example.com' });
 * addSentryBreadcrumb('database', 'Query executed', { duration: 125 });
 * ```
 */
export declare const addSentryBreadcrumb: (category: string, message: string, data?: Record<string, any>) => void;
/**
 * @function createAuditHooks
 * @description Creates Sequelize hooks for automatic audit logging
 * @param {string} modelName - Model name
 * @returns {object} Sequelize hooks
 *
 * @security HIPAA-compliant audit trail
 *
 * @example
 * ```typescript
 * @Table({
 *   hooks: createAuditHooks('Patient')
 * })
 * export class Patient extends Model {}
 * ```
 */
export declare const createAuditHooks: (modelName: string) => {
    beforeCreate: (instance: any, options: any) => Promise<void>;
    afterCreate: (instance: any, options: any) => Promise<void>;
    beforeUpdate: (instance: any, options: any) => Promise<void>;
    afterUpdate: (instance: any, options: any) => Promise<void>;
    afterDestroy: (instance: any, options: any) => Promise<void>;
};
/**
 * @function logDatabaseQuery
 * @description Logs database query for monitoring
 * @param {string} query - SQL query
 * @param {number} duration - Query duration in ms
 * @param {Record<string, any>} metadata - Additional metadata
 *
 * @example
 * ```typescript
 * logDatabaseQuery(
 *   'SELECT * FROM users WHERE id = ?',
 *   45,
 *   { model: 'User', operation: 'findOne' }
 * );
 * ```
 */
export declare const logDatabaseQuery: (query: string, duration: number, metadata?: Record<string, any>) => void;
/**
 * @function performHealthCheck
 * @description Performs comprehensive health check
 * @param {Record<string, Function>} checks - Health check functions
 * @returns {Promise<HealthCheckResult>} Health check result
 *
 * @example
 * ```typescript
 * const health = await performHealthCheck({
 *   database: () => checkDatabaseHealth(sequelize),
 *   redis: () => checkRedisHealth(redis),
 *   memory: () => checkMemoryHealth()
 * });
 * ```
 */
export declare const performHealthCheck: (checks: Record<string, () => Promise<any> | any>) => Promise<HealthCheckResult>;
/**
 * @function checkDatabaseHealth
 * @description Checks database connection health
 * @param {any} sequelize - Sequelize instance
 * @returns {Promise<object>} Database health status
 */
export declare const checkDatabaseHealth: (sequelize: any) => Promise<any>;
/**
 * @function checkMemoryHealth
 * @description Checks memory usage health
 * @param {number} threshold - Memory threshold percentage (0-1)
 * @returns {object} Memory health status
 */
export declare const checkMemoryHealth: (threshold?: number) => any;
/**
 * @function createReadinessProbe
 * @description Creates Kubernetes readiness probe endpoint
 * @param {Record<string, Function>} checks - Readiness checks
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.get('/ready', createReadinessProbe({
 *   database: () => checkDatabaseHealth(sequelize)
 * }));
 * ```
 */
export declare const createReadinessProbe: (checks: Record<string, () => Promise<any> | any>) => (req: Request, res: Response) => Promise<void>;
/**
 * @function createLivenessProbe
 * @description Creates Kubernetes liveness probe endpoint
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.get('/live', createLivenessProbe());
 * ```
 */
export declare const createLivenessProbe: () => (req: Request, res: Response) => void;
/**
 * @function evaluateAlertRule
 * @description Evaluates an alerting rule against current metrics
 * @param {AlertRule} rule - Alert rule configuration
 * @param {number} currentValue - Current metric value
 * @returns {boolean} True if alert should trigger
 *
 * @example
 * ```typescript
 * const shouldAlert = evaluateAlertRule({
 *   name: 'High Error Rate',
 *   metric: 'error_rate',
 *   threshold: 0.05,
 *   operator: 'gt',
 *   window: 300000,
 *   severity: 'critical',
 *   actions: []
 * }, 0.08);
 * ```
 */
export declare const evaluateAlertRule: (rule: AlertRule, currentValue: number) => boolean;
/**
 * @function triggerAlert
 * @description Triggers an alert and executes configured actions
 * @param {AlertRule} rule - Alert rule
 * @param {number} currentValue - Current value that triggered alert
 * @returns {Promise<void>}
 */
export declare const triggerAlert: (rule: AlertRule, currentValue: number) => Promise<void>;
/**
 * @function createLogBatcher
 * @description Creates a log batcher for efficient bulk logging
 * @param {number} batchSize - Maximum batch size
 * @param {number} flushInterval - Flush interval in ms
 * @param {Function} flushFn - Function to call when flushing batch
 * @returns {object} Log batcher
 *
 * @performance Reduces I/O overhead by batching log writes
 *
 * @example
 * ```typescript
 * const batcher = createLogBatcher(100, 5000, async (logs) => {
 *   await logService.writeBatch(logs);
 * });
 * batcher.add(logEntry);
 * ```
 */
export declare const createLogBatcher: (batchSize: number, flushInterval: number, flushFn: (logs: LogEntry[]) => Promise<void>) => {
    add: (log: LogEntry) => Promise<void>;
    flush: () => Promise<void>;
    size: () => number;
};
/**
 * @function aggregateMetrics
 * @description Aggregates metrics over a time window
 * @param {CustomMetric[]} metrics - Array of metrics
 * @param {string} groupBy - Metric name to group by
 * @returns {Record<string, any>} Aggregated metrics
 *
 * @example
 * ```typescript
 * const aggregated = aggregateMetrics(metrics, 'http_requests_total');
 * // { count: 1250, sum: 1250, avg: 1, min: 1, max: 1 }
 * ```
 */
export declare const aggregateMetrics: (metrics: CustomMetric[], groupBy: string) => Record<string, any>;
/**
 * Audit log model for HIPAA compliance
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
 * Application log model for structured logging persistence
 */
export declare class ApplicationLog extends Model {
    id: string;
    timestamp: Date;
    level: string;
    message: string;
    context: string;
    traceId: string;
    spanId: string;
    userId: string;
    tenantId: string;
    requestId: string;
    metadata: Record<string, any>;
    error: any;
    performance: any;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=logging-monitoring-kit.prod.d.ts.map