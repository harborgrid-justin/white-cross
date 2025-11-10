/**
 * LOC: ERRMON1234567
 * File: /reuse/error-monitoring-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS exception filters
 *   - Error tracking services
 *   - Monitoring services
 *   - Alerting systems
 *   - Sentry integration modules
 */
/**
 * File: /reuse/error-monitoring-kit.ts
 * Locator: WC-UTL-ERRMON-001
 * Purpose: Comprehensive Error Monitoring Kit - Complete error tracking and monitoring toolkit for NestJS
 *
 * Upstream: Independent utility module for error monitoring and tracking
 * Downstream: ../backend/*, Error handlers, Monitoring services, Alert systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @sentry/node, Sequelize, winston
 * Exports: 40+ utility functions for error tracking, exception filters, logging, alerting, aggregation, Sentry integration
 *
 * LLM Context: Enterprise-grade error monitoring utilities for White Cross healthcare platform.
 * Provides comprehensive error tracking (Sentry, custom), exception filtering, structured logging (Winston),
 * error aggregation, alert management, circuit breakers, retry logic, error categorization,
 * stack trace analysis, performance monitoring, health checks, and incident management.
 */
import { NestInterceptor, ExceptionFilter, ArgumentsHost, ExecutionContext, CallHandler } from '@nestjs/common';
import { Model, Sequelize } from 'sequelize';
import { Observable } from 'rxjs';
interface ErrorLog {
    id?: string;
    errorCode: string;
    message: string;
    stackTrace?: string;
    userId?: string;
    requestId?: string;
    context?: Record<string, any>;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    resolved: boolean;
    occurredAt: Date;
}
interface SentryConfig {
    dsn: string;
    environment: string;
    release?: string;
    tracesSampleRate?: number;
    beforeSend?: (event: any, hint: any) => any;
    integrations?: any[];
}
interface AlertConfig {
    type: 'email' | 'sms' | 'slack' | 'pagerduty' | 'webhook';
    destination: string;
    threshold: number;
    timeWindow: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    enabled: boolean;
}
interface CircuitBreakerConfig {
    failureThreshold: number;
    resetTimeout: number;
    monitoringPeriod: number;
    halfOpenRequests?: number;
}
interface CircuitBreakerState {
    status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failureCount: number;
    successCount: number;
    lastFailureTime?: number;
    nextAttemptTime?: number;
}
interface RetryConfig {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    retryableErrors?: string[];
}
interface HealthCheckResult {
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, {
        status: string;
        message?: string;
        responseTime?: number;
    }>;
    timestamp: Date;
}
interface IncidentReport {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'investigating' | 'resolved' | 'closed';
    affectedServices: string[];
    assignedTo?: string;
    createdAt: Date;
    resolvedAt?: Date;
}
interface ErrorAggregation {
    errorCode: string;
    message: string;
    count: number;
    uniqueUsers: number;
    firstSeen: Date;
    lastSeen: Date;
    stackTraceHash: string;
}
/**
 * Sequelize model for Error Logs with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ErrorLog model
 *
 * @example
 * const ErrorLog = defineErrorLogModel(sequelize);
 * await ErrorLog.create({
 *   errorCode: 'ERR_DATABASE',
 *   message: 'Connection timeout',
 *   severity: 'high',
 *   category: 'database'
 * });
 */
export declare function defineErrorLogModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Performance Metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PerformanceMetric model
 *
 * @example
 * const PerformanceMetric = definePerformanceMetricModel(sequelize);
 * await PerformanceMetric.create({
 *   endpoint: '/api/patients',
 *   method: 'GET',
 *   responseTime: 150,
 *   statusCode: 200
 * });
 */
export declare function definePerformanceMetricModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Incident Reports.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IncidentReport model
 *
 * @example
 * const IncidentReport = defineIncidentReportModel(sequelize);
 * await IncidentReport.create({
 *   title: 'Database connection failure',
 *   description: 'Unable to connect to primary database',
 *   severity: 'critical',
 *   status: 'open',
 *   affectedServices: ['api', 'backend']
 * });
 */
export declare function defineIncidentReportModel(sequelize: Sequelize): typeof Model;
/**
 * Zod schema for error log validation.
 */
export declare const errorLogSchema: any;
/**
 * Zod schema for Sentry configuration validation.
 */
export declare const sentryConfigSchema: any;
/**
 * Zod schema for alert configuration validation.
 */
export declare const alertConfigSchema: any;
/**
 * Zod schema for circuit breaker configuration.
 */
export declare const circuitBreakerSchema: any;
/**
 * Zod schema for retry configuration.
 */
export declare const retryConfigSchema: any;
/**
 * Logs error with comprehensive context.
 *
 * @param {typeof Model} errorModel - Error log model
 * @param {ErrorLog} errorLog - Error log entry
 * @returns {Promise<any>} Created error log
 *
 * @example
 * await logError(ErrorLog, {
 *   errorCode: 'ERR_DATABASE',
 *   message: 'Connection timeout',
 *   severity: 'high',
 *   category: 'database',
 *   occurredAt: new Date()
 * });
 */
export declare function logError(errorModel: typeof Model, errorLog: ErrorLog): Promise<any>;
/**
 * Categorizes error by type and severity.
 *
 * @param {Error} error - Error object
 * @returns {{category: string, severity: string}} Error categorization
 *
 * @example
 * const { category, severity } = categorizeError(new Error('Connection refused'));
 */
export declare function categorizeError(error: Error): {
    category: string;
    severity: string;
};
/**
 * Sanitizes error for safe logging (removes sensitive data).
 *
 * @param {Error} error - Error object
 * @param {string[]} sensitiveFields - Fields to redact
 * @returns {Record<string, any>} Sanitized error
 *
 * @example
 * const sanitized = sanitizeError(error, ['password', 'token', 'apiKey']);
 */
export declare function sanitizeError(error: Error, sensitiveFields?: string[]): Record<string, any>;
/**
 * Enriches error with context (user, request, environment).
 *
 * @param {Error} error - Error object
 * @param {Record<string, any>} context - Additional context
 * @returns {Record<string, any>} Enriched error
 *
 * @example
 * const enriched = enrichErrorContext(error, {
 *   userId: 'user-123',
 *   requestId: 'req-456',
 *   environment: 'production'
 * });
 */
export declare function enrichErrorContext(error: Error, context: Record<string, any>): Record<string, any>;
/**
 * Aggregates similar errors for analysis.
 *
 * @param {typeof Model} errorModel - Error log model
 * @param {number} hours - Hours to look back
 * @returns {Promise<ErrorAggregation[]>} Aggregated errors
 *
 * @example
 * const aggregated = await aggregateErrors(ErrorLog, 24);
 */
export declare function aggregateErrors(errorModel: typeof Model, hours?: number): Promise<ErrorAggregation[]>;
/**
 * Generates error frequency report.
 *
 * @param {typeof Model} errorModel - Error log model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>} Error frequency report
 *
 * @example
 * const report = await generateErrorFrequencyReport(ErrorLog, startDate, endDate);
 */
export declare function generateErrorFrequencyReport(errorModel: typeof Model, startDate: Date, endDate: Date): Promise<Record<string, any>>;
/**
 * Initializes Sentry error tracking.
 *
 * @param {SentryConfig} config - Sentry configuration
 * @returns {any} Sentry instance
 *
 * @example
 * const sentry = initializeSentry({
 *   dsn: 'https://xxx@sentry.io/123',
 *   environment: 'production',
 *   tracesSampleRate: 0.1
 * });
 */
export declare function initializeSentry(config: SentryConfig): any;
/**
 * Captures exception with Sentry.
 *
 * @param {any} sentry - Sentry instance
 * @param {Error} error - Error to capture
 * @param {Record<string, any>} context - Additional context
 * @returns {string} Event ID
 *
 * @example
 * const eventId = captureSentryException(sentry, error, {
 *   user: { id: 'user-123' },
 *   tags: { service: 'api' }
 * });
 */
export declare function captureSentryException(sentry: any, error: Error, context?: Record<string, any>): string;
/**
 * Captures custom message with Sentry.
 *
 * @param {any} sentry - Sentry instance
 * @param {string} message - Message to capture
 * @param {string} level - Severity level
 * @param {Record<string, any>} context - Additional context
 * @returns {string} Event ID
 *
 * @example
 * const eventId = captureSentryMessage(sentry, 'Cache miss', 'info', {
 *   tags: { cache: 'redis' }
 * });
 */
export declare function captureSentryMessage(sentry: any, message: string, level?: string, context?: Record<string, any>): string;
/**
 * Sets Sentry user context for tracking.
 *
 * @param {any} sentry - Sentry instance
 * @param {Record<string, any>} user - User information
 *
 * @example
 * setSentryUser(sentry, {
 *   id: 'user-123',
 *   email: 'user@example.com',
 *   username: 'johndoe'
 * });
 */
export declare function setSentryUser(sentry: any, user: Record<string, any>): void;
/**
 * Creates circuit breaker for fault tolerance.
 *
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {CircuitBreakerState} Initial state
 *
 * @example
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   resetTimeout: 60000,
 *   monitoringPeriod: 10000
 * });
 */
export declare function createCircuitBreaker(config: CircuitBreakerConfig): CircuitBreakerState;
/**
 * Executes function with circuit breaker protection.
 *
 * @param {() => Promise<T>} fn - Function to execute
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {Promise<T>} Function result
 *
 * @example
 * const result = await executeWithCircuitBreaker(
 *   async () => await apiCall(),
 *   breakerState,
 *   breakerConfig
 * );
 */
export declare function executeWithCircuitBreaker<T>(fn: () => Promise<T>, state: CircuitBreakerState, config: CircuitBreakerConfig): Promise<T>;
/**
 * Resets circuit breaker to closed state.
 *
 * @param {CircuitBreakerState} state - Circuit breaker state
 *
 * @example
 * resetCircuitBreaker(breakerState);
 */
export declare function resetCircuitBreaker(state: CircuitBreakerState): void;
/**
 * Gets circuit breaker health status.
 *
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @returns {Record<string, any>} Health status
 *
 * @example
 * const health = getCircuitBreakerHealth(breakerState);
 */
export declare function getCircuitBreakerHealth(state: CircuitBreakerState): Record<string, any>;
/**
 * Executes function with exponential backoff retry.
 *
 * @param {() => Promise<T>} fn - Function to execute
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<T>} Function result
 *
 * @example
 * const result = await retryWithBackoff(
 *   async () => await apiCall(),
 *   {
 *     maxAttempts: 3,
 *     initialDelay: 1000,
 *     maxDelay: 10000,
 *     backoffMultiplier: 2
 *   }
 * );
 */
export declare function retryWithBackoff<T>(fn: () => Promise<T>, config: RetryConfig): Promise<T>;
/**
 * Checks if error is retryable.
 *
 * @param {Error} error - Error to check
 * @param {string[]} retryableErrors - List of retryable error patterns
 * @returns {boolean} Whether error is retryable
 *
 * @example
 * const retryable = isRetryableError(error, ['ECONNREFUSED', 'ETIMEDOUT']);
 */
export declare function isRetryableError(error: Error, retryableErrors: string[]): boolean;
/**
 * Calculates next retry delay with jitter.
 *
 * @param {number} attempt - Current attempt number
 * @param {number} baseDelay - Base delay in ms
 * @param {number} maxDelay - Maximum delay in ms
 * @param {number} jitterFactor - Jitter factor (0-1)
 * @returns {number} Delay in ms
 *
 * @example
 * const delay = calculateRetryDelay(3, 1000, 10000, 0.1);
 */
export declare function calculateRetryDelay(attempt: number, baseDelay: number, maxDelay: number, jitterFactor?: number): number;
/**
 * Wraps function with automatic retry on failure.
 *
 * @param {(...args: any[]) => Promise<T>} fn - Function to wrap
 * @param {RetryConfig} config - Retry configuration
 * @returns {(...args: any[]) => Promise<T>} Wrapped function
 *
 * @example
 * const resilientFetch = wrapWithRetry(fetchData, {
 *   maxAttempts: 3,
 *   initialDelay: 1000,
 *   maxDelay: 5000,
 *   backoffMultiplier: 2
 * });
 */
export declare function wrapWithRetry<T>(fn: (...args: any[]) => Promise<T>, config: RetryConfig): (...args: any[]) => Promise<T>;
/**
 * Sends error alert based on configuration.
 *
 * @param {AlertConfig} config - Alert configuration
 * @param {ErrorLog} error - Error to alert
 * @returns {Promise<void>}
 *
 * @example
 * await sendErrorAlert({
 *   type: 'email',
 *   destination: 'oncall@example.com',
 *   threshold: 10,
 *   timeWindow: 300,
 *   severity: 'critical',
 *   enabled: true
 * }, errorLog);
 */
export declare function sendErrorAlert(config: AlertConfig, error: ErrorLog): Promise<void>;
/**
 * Checks if error threshold exceeded for alerting.
 *
 * @param {typeof Model} errorModel - Error log model
 * @param {string} errorCode - Error code to check
 * @param {number} threshold - Error count threshold
 * @param {number} timeWindow - Time window in seconds
 * @returns {Promise<boolean>} Whether threshold exceeded
 *
 * @example
 * const exceeded = await checkAlertThreshold(ErrorLog, 'ERR_DB', 10, 300);
 */
export declare function checkAlertThreshold(errorModel: typeof Model, errorCode: string, threshold: number, timeWindow: number): Promise<boolean>;
/**
 * Creates incident report for critical errors.
 *
 * @param {typeof Model} incidentModel - Incident report model
 * @param {IncidentReport} incident - Incident details
 * @returns {Promise<any>} Created incident
 *
 * @example
 * const incident = await createIncidentReport(IncidentReport, {
 *   title: 'Database connection failure',
 *   description: 'Unable to connect to primary database',
 *   severity: 'critical',
 *   status: 'open',
 *   affectedServices: ['api', 'backend']
 * });
 */
export declare function createIncidentReport(incidentModel: typeof Model, incident: Partial<IncidentReport>): Promise<any>;
/**
 * Updates incident status and resolution.
 *
 * @param {typeof Model} incidentModel - Incident report model
 * @param {string} incidentId - Incident ID
 * @param {string} status - New status
 * @param {string} resolution - Resolution details
 * @returns {Promise<any>} Updated incident
 *
 * @example
 * await updateIncidentStatus(IncidentReport, 'inc-123', 'resolved', 'Restarted database');
 */
export declare function updateIncidentStatus(incidentModel: typeof Model, incidentId: string, status: string, resolution?: string): Promise<any>;
/**
 * Tracks request performance metrics.
 *
 * @param {typeof Model} metricModel - Performance metric model
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {number} responseTime - Response time in ms
 * @param {number} statusCode - HTTP status code
 * @param {Record<string, any>} metadata - Additional metadata
 * @returns {Promise<any>} Created metric
 *
 * @example
 * await trackPerformanceMetric(PerformanceMetric, '/api/patients', 'GET', 150, 200, {});
 */
export declare function trackPerformanceMetric(metricModel: typeof Model, endpoint: string, method: string, responseTime: number, statusCode: number, metadata?: Record<string, any>): Promise<any>;
/**
 * Calculates performance percentiles (p50, p95, p99).
 *
 * @param {typeof Model} metricModel - Performance metric model
 * @param {string} endpoint - API endpoint
 * @param {number} hours - Hours to analyze
 * @returns {Promise<Record<string, number>>} Percentiles
 *
 * @example
 * const percentiles = await calculatePerformancePercentiles(PerformanceMetric, '/api/patients', 24);
 */
export declare function calculatePerformancePercentiles(metricModel: typeof Model, endpoint: string, hours?: number): Promise<Record<string, number>>;
/**
 * Identifies slow endpoints above threshold.
 *
 * @param {typeof Model} metricModel - Performance metric model
 * @param {number} threshold - Response time threshold in ms
 * @param {number} hours - Hours to analyze
 * @returns {Promise<Array<{endpoint: string, avgTime: number}>>} Slow endpoints
 *
 * @example
 * const slow = await identifySlowEndpoints(PerformanceMetric, 1000, 24);
 */
export declare function identifySlowEndpoints(metricModel: typeof Model, threshold: number, hours?: number): Promise<Array<{
    endpoint: string;
    avgTime: number;
}>>;
/**
 * Generates performance summary report.
 *
 * @param {typeof Model} metricModel - Performance metric model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>} Performance report
 *
 * @example
 * const report = await generatePerformanceReport(PerformanceMetric, startDate, endDate);
 */
export declare function generatePerformanceReport(metricModel: typeof Model, startDate: Date, endDate: Date): Promise<Record<string, any>>;
/**
 * Performs comprehensive health check.
 *
 * @param {Record<string, () => Promise<boolean>>} checks - Health check functions
 * @returns {Promise<HealthCheckResult>} Health check result
 *
 * @example
 * const health = await performHealthCheck({
 *   database: async () => await checkDatabase(),
 *   redis: async () => await checkRedis(),
 *   api: async () => await checkExternalApi()
 * });
 */
export declare function performHealthCheck(checks: Record<string, () => Promise<boolean>>): Promise<HealthCheckResult>;
/**
 * Checks database connectivity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Database health status
 *
 * @example
 * const healthy = await checkDatabaseHealth(sequelize);
 */
export declare function checkDatabaseHealth(sequelize: Sequelize): Promise<boolean>;
/**
 * Checks Redis connectivity.
 *
 * @param {any} redisClient - Redis client
 * @returns {Promise<boolean>} Redis health status
 *
 * @example
 * const healthy = await checkRedisHealth(redis);
 */
export declare function checkRedisHealth(redisClient: any): Promise<boolean>;
/**
 * Monitors system resource usage.
 *
 * @returns {Record<string, any>} Resource usage metrics
 *
 * @example
 * const usage = monitorSystemResources();
 */
export declare function monitorSystemResources(): Record<string, any>;
/**
 * Parses and analyzes stack trace.
 *
 * @param {string} stackTrace - Stack trace string
 * @returns {Array<{file: string, line: number, function: string}>} Parsed stack frames
 *
 * @example
 * const frames = parseStackTrace(error.stack);
 */
export declare function parseStackTrace(stackTrace: string): Array<{
    file: string;
    line: number;
    function: string;
}>;
/**
 * Generates stack trace fingerprint for deduplication.
 *
 * @param {string} stackTrace - Stack trace string
 * @returns {string} Stack trace hash
 *
 * @example
 * const fingerprint = generateStackTraceFingerprint(error.stack);
 */
export declare function generateStackTraceFingerprint(stackTrace: string): string;
/**
 * Identifies error hotspots in codebase.
 *
 * @param {typeof Model} errorModel - Error log model
 * @param {number} hours - Hours to analyze
 * @returns {Promise<Array<{file: string, count: number}>>} Error hotspots
 *
 * @example
 * const hotspots = await identifyErrorHotspots(ErrorLog, 24);
 */
export declare function identifyErrorHotspots(errorModel: typeof Model, hours?: number): Promise<Array<{
    file: string;
    count: number;
}>>;
/**
 * Compares stack traces for similarity.
 *
 * @param {string} stackTrace1 - First stack trace
 * @param {string} stackTrace2 - Second stack trace
 * @returns {number} Similarity score (0-1)
 *
 * @example
 * const similarity = compareStackTraces(stack1, stack2);
 */
export declare function compareStackTraces(stackTrace1: string, stackTrace2: string): number;
/**
 * NestJS Global Exception Filter with comprehensive error handling.
 *
 * @example
 * app.useGlobalFilters(new GlobalExceptionFilter(errorLogModel));
 */
export declare class GlobalExceptionFilter implements ExceptionFilter {
    private errorModel?;
    private sentry?;
    constructor(errorModel?: typeof Model, sentry?: any | undefined);
    catch(exception: any, host: ArgumentsHost): void;
}
/**
 * NestJS Error Monitoring Interceptor.
 *
 * @example
 * @UseInterceptors(ErrorMonitoringInterceptor)
 * @Controller('patients')
 * export class PatientController {}
 */
export declare class ErrorMonitoringInterceptor implements NestInterceptor {
    private errorModel;
    private metricModel;
    constructor(errorModel: typeof Model, metricModel: typeof Model);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
export {};
//# sourceMappingURL=error-monitoring-kit.d.ts.map