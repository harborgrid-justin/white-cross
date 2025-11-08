/**
 * LOC: LOG_MONITOR_KIT_001
 * File: /reuse/logging-monitoring-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize-typescript
 *   - winston
 *   - prom-client
 *   - cls-hooked
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
 * Upstream: NestJS, Sequelize, Winston, Prometheus, CLS-Hooked
 * Downstream: ../backend/monitoring/*, Observability, APM, Health checks
 * Dependencies: TypeScript 5.x, Node 18+, winston, prom-client, cls-hooked
 * Exports: 45 logging/monitoring functions for structured logging, metrics, tracing, health
 *
 * LLM Context: Enterprise-grade logging and monitoring utilities for White Cross platform.
 * Provides structured logging, distributed tracing, performance metrics collection, APM
 * integration, error tracking, custom metrics, histogram tracking, log aggregation,
 * contextual logging, audit trails, database query logging, and comprehensive health checks.
 * HIPAA-compliant audit logging and observability patterns for healthcare applications.
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger as NestLogger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import * as os from 'os';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Log levels enumeration
 */
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Log level priority mapping
 */
export const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.TRACE]: 0,
  [LogLevel.DEBUG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.WARN]: 3,
  [LogLevel.ERROR]: 4,
  [LogLevel.FATAL]: 5,
};

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
  logs?: Array<{ timestamp: Date; message: string }>;
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
export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
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
 * APM transaction context
 */
export interface ApmTransaction {
  id: string;
  name: string;
  type: string;
  result?: string;
  duration?: number;
  timestamp: Date;
  context?: Record<string, any>;
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

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Application log model for persistence
 */
@Table({
  tableName: 'application_logs',
  timestamps: true,
  indexes: [
    { fields: ['level'] },
    { fields: ['timestamp'] },
    { fields: ['traceId'] },
    { fields: ['userId'] },
    { fields: ['tenantId'] },
    { fields: ['context'] },
  ],
})
export class ApplicationLog extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  timestamp: Date;

  @Column({
    type: DataType.ENUM(...Object.values(LogLevel)),
    allowNull: false,
  })
  @Index
  level: LogLevel;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  @Column({
    type: DataType.STRING(100),
  })
  @Index
  context: string;

  @Column({
    type: DataType.STRING(64),
  })
  @Index
  traceId: string;

  @Column({
    type: DataType.STRING(64),
  })
  spanId: string;

  @Column({
    type: DataType.UUID,
  })
  @Index
  userId: string;

  @Column({
    type: DataType.UUID,
  })
  @Index
  tenantId: string;

  @Column({
    type: DataType.STRING(64),
  })
  requestId: string;

  @Column({
    type: DataType.JSONB,
  })
  metadata: Record<string, any>;

  @Column({
    type: DataType.JSONB,
  })
  error: ErrorContext;

  @Column({
    type: DataType.JSONB,
  })
  performance: PerformanceMetrics;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Metrics model for time-series data
 */
@Table({
  tableName: 'metrics',
  timestamps: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['timestamp'] },
    { fields: ['type'] },
  ],
})
export class Metric extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  @Index
  name: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  value: number;

  @Column({
    type: DataType.ENUM('counter', 'gauge', 'histogram', 'summary'),
    allowNull: false,
  })
  @Index
  type: string;

  @Column({
    type: DataType.JSONB,
  })
  labels: Record<string, string>;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  timestamp: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Distributed traces model
 */
@Table({
  tableName: 'traces',
  timestamps: true,
  indexes: [
    { fields: ['traceId'] },
    { fields: ['spanId'] },
    { fields: ['serviceName'] },
    { fields: ['startTime'] },
  ],
})
export class Trace extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
  })
  @Index
  traceId: string;

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
  })
  @Index
  spanId: string;

  @Column({
    type: DataType.STRING(64),
  })
  parentSpanId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  @Index
  serviceName: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  operationName: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  startTime: Date;

  @Column({
    type: DataType.DATE,
  })
  endTime: Date;

  @Column({
    type: DataType.INTEGER,
  })
  duration: number;

  @Column({
    type: DataType.JSONB,
  })
  tags: Record<string, string>;

  @Column({
    type: DataType.JSONB,
  })
  logs: Array<{ timestamp: Date; message: string }>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Audit logs model for compliance
 */
@Table({
  tableName: 'audit_logs',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['tenantId'] },
    { fields: ['action'] },
    { fields: ['resource'] },
    { fields: ['timestamp'] },
  ],
})
export class AuditLog extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  timestamp: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  userId: string;

  @Column({
    type: DataType.UUID,
  })
  @Index
  tenantId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  @Index
  action: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  @Index
  resource: string;

  @Column({
    type: DataType.STRING(100),
  })
  resourceId: string;

  @Column({
    type: DataType.JSONB,
  })
  changes: Record<string, any>;

  @Column({
    type: DataType.STRING(45),
  })
  ipAddress: string;

  @Column({
    type: DataType.STRING(500),
  })
  userAgent: string;

  @Column({
    type: DataType.ENUM('success', 'failure'),
    allowNull: false,
  })
  outcome: string;

  @Column({
    type: DataType.TEXT,
  })
  reason: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Alert configuration and history model
 */
@Table({
  tableName: 'alerts',
  timestamps: true,
  indexes: [
    { fields: ['severity'] },
    { fields: ['status'] },
    { fields: ['triggeredAt'] },
  ],
})
export class Alert extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.ENUM('info', 'warning', 'critical'),
    allowNull: false,
  })
  @Index
  severity: string;

  @Column({
    type: DataType.ENUM('triggered', 'acknowledged', 'resolved'),
    allowNull: false,
  })
  @Index
  status: string;

  @Column({
    type: DataType.DATE,
  })
  @Index
  triggeredAt: Date;

  @Column({
    type: DataType.DATE,
  })
  acknowledgedAt: Date;

  @Column({
    type: DataType.DATE,
  })
  resolvedAt: Date;

  @Column({
    type: DataType.STRING(200),
  })
  metricName: string;

  @Column({
    type: DataType.DOUBLE,
  })
  threshold: number;

  @Column({
    type: DataType.DOUBLE,
  })
  currentValue: number;

  @Column({
    type: DataType.JSONB,
  })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

// ============================================================================
// STRUCTURED LOGGING HELPERS
// ============================================================================

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
export const createStructuredLog = (
  level: LogLevel,
  message: string,
  context?: Partial<LogEntry>,
): LogEntry => {
  return {
    timestamp: new Date(),
    level,
    message,
    ...context,
  };
};

/**
 * @function formatLogMessage
 * @description Formats log entry as JSON string for external systems
 * @param {LogEntry} entry - Log entry to format
 * @returns {string} JSON formatted log message
 *
 * @example
 * ```typescript
 * const formatted = formatLogMessage(logEntry);
 * console.log(formatted); // JSON string
 * ```
 */
export const formatLogMessage = (entry: LogEntry): string => {
  return JSON.stringify({
    ...entry,
    timestamp: entry.timestamp.toISOString(),
  });
};

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
export const enrichLogWithContext = (
  entry: LogEntry,
  req: Request,
): LogEntry => {
  return {
    ...entry,
    requestId: req.headers['x-request-id'] as string,
    userId: (req as any).user?.id,
    tenantId: (req as any).tenant?.id,
    metadata: {
      ...entry.metadata,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    },
  };
};

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
export const createErrorLog = (
  error: Error,
  context: string,
  additional?: Partial<LogEntry>,
): LogEntry => {
  return createStructuredLog(LogLevel.ERROR, error.message, {
    context,
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
      ...(error as any).details,
    },
    ...additional,
  });
};

// ============================================================================
// LOG LEVEL MANAGEMENT
// ============================================================================

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
export const shouldLog = (
  messageLevel: LogLevel,
  configuredLevel: LogLevel,
): boolean => {
  return (
    LOG_LEVEL_PRIORITY[messageLevel] >= LOG_LEVEL_PRIORITY[configuredLevel]
  );
};

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
export const parseLogLevel = (level: string): LogLevel => {
  const normalized = level.toLowerCase();
  return Object.values(LogLevel).includes(normalized as LogLevel)
    ? (normalized as LogLevel)
    : LogLevel.INFO;
};

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
export const setDynamicLogLevel = (initialLevel: LogLevel) => {
  let currentLevel = initialLevel;

  return {
    getLevel: () => currentLevel,
    setLevel: (newLevel: LogLevel) => {
      currentLevel = newLevel;
    },
    shouldLog: (messageLevel: LogLevel) =>
      shouldLog(messageLevel, currentLevel),
  };
};

// ============================================================================
// REQUEST/RESPONSE LOGGING INTERCEPTORS
// ============================================================================

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
@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new NestLogger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    const requestLog = createRequestLog(request);
    this.logger.log(formatLogMessage(requestLog));

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const responseLog = createResponseLog(response, duration);
        this.logger.log(formatLogMessage(responseLog));
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const errorLog = createErrorLog(error, 'RequestLoggingInterceptor', {
          performance: { duration, timestamp: new Date() },
        });
        this.logger.error(formatLogMessage(errorLog));
        throw error;
      }),
    );
  }
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
export const createRequestLog = (req: Request): LogEntry => {
  return createStructuredLog(LogLevel.INFO, 'Incoming request', {
    context: 'HTTP',
    requestId: req.headers['x-request-id'] as string,
    metadata: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      contentLength: req.headers['content-length'],
    },
  });
};

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
export const createResponseLog = (res: Response, duration: number): LogEntry => {
  const statusCode = res.statusCode;
  const level =
    statusCode >= 500
      ? LogLevel.ERROR
      : statusCode >= 400
        ? LogLevel.WARN
        : LogLevel.INFO;

  return createStructuredLog(level, 'Response sent', {
    context: 'HTTP',
    performance: { duration, timestamp: new Date() },
    metadata: {
      statusCode,
      contentLength: res.getHeader('content-length'),
    },
  });
};

// ============================================================================
// PERFORMANCE METRICS COLLECTION
// ============================================================================

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
export const measureExecutionTime = async <T>(
  fn: () => Promise<T>,
): Promise<{ result: T; duration: number }> => {
  const startTime = performance.now();
  const result = await fn();
  const duration = performance.now() - startTime;
  return { result, duration };
};

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
export const collectSystemMetrics = (): {
  cpuUsage: NodeJS.CpuUsage;
  memoryUsage: NodeJS.MemoryUsage;
  uptime: number;
  loadAverage: number[];
} => {
  return {
    cpuUsage: process.cpuUsage(),
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    loadAverage: os.loadavg(),
  };
};

/**
 * @function trackPerformanceMetric
 * @description Tracks and logs a performance metric
 * @param {string} operation - Operation name
 * @param {number} duration - Duration in milliseconds
 * @param {Record<string, any>} metadata - Additional metadata
 * @returns {PerformanceMetrics} Performance metrics object
 *
 * @example
 * ```typescript
 * const metrics = trackPerformanceMetric('database.query', 45, {
 *   query: 'SELECT * FROM users'
 * });
 * ```
 */
export const trackPerformanceMetric = (
  operation: string,
  duration: number,
  metadata?: Record<string, any>,
): PerformanceMetrics => {
  const systemMetrics = collectSystemMetrics();

  return {
    duration,
    cpuUsage:
      (systemMetrics.cpuUsage.user + systemMetrics.cpuUsage.system) / 1000000,
    memoryUsage: systemMetrics.memoryUsage.heapUsed / 1024 / 1024, // MB
    timestamp: new Date(),
  };
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
export const createPerformanceTimer = () => {
  let startTime: number | null = null;
  let endTime: number | null = null;

  return {
    start: () => {
      startTime = performance.now();
      endTime = null;
    },
    stop: (): number => {
      if (startTime === null) {
        throw new Error('Timer not started');
      }
      endTime = performance.now();
      return endTime - startTime;
    },
    reset: () => {
      startTime = null;
      endTime = null;
    },
    getDuration: (): number | null => {
      if (startTime === null || endTime === null) {
        return null;
      }
      return endTime - startTime;
    },
  };
};

// ============================================================================
// DISTRIBUTED TRACING
// ============================================================================

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
export const generateTraceId = (): string => {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
};

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
export const generateSpanId = (): string => {
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
};

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
export const createTraceContext = (
  serviceName: string,
  operationName: string,
  parentSpanId?: string,
): TraceContext => {
  return {
    traceId: generateTraceId(),
    spanId: generateSpanId(),
    parentSpanId,
    serviceName,
    operationName,
    startTime: new Date(),
    tags: {},
    logs: [],
  };
};

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
export const finishTrace = (trace: TraceContext): TraceContext => {
  const endTime = new Date();
  return {
    ...trace,
    endTime,
    duration: endTime.getTime() - trace.startTime.getTime(),
  };
};

/**
 * @function addTraceTag
 * @description Adds a tag to trace context
 * @param {TraceContext} trace - Trace context
 * @param {string} key - Tag key
 * @param {string} value - Tag value
 * @returns {TraceContext} Updated trace context
 *
 * @example
 * ```typescript
 * const updatedTrace = addTraceTag(trace, 'userId', 'user-123');
 * ```
 */
export const addTraceTag = (
  trace: TraceContext,
  key: string,
  value: string,
): TraceContext => {
  return {
    ...trace,
    tags: {
      ...trace.tags,
      [key]: value,
    },
  };
};

/**
 * @function addTraceLog
 * @description Adds a log entry to trace context
 * @param {TraceContext} trace - Trace context
 * @param {string} message - Log message
 * @returns {TraceContext} Updated trace context
 *
 * @example
 * ```typescript
 * const updatedTrace = addTraceLog(trace, 'User validation completed');
 * ```
 */
export const addTraceLog = (
  trace: TraceContext,
  message: string,
): TraceContext => {
  return {
    ...trace,
    logs: [...(trace.logs || []), { timestamp: new Date(), message }],
  };
};

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
export const propagateTraceHeaders = (
  trace: TraceContext,
): Record<string, string> => {
  return {
    'x-trace-id': trace.traceId,
    'x-span-id': trace.spanId,
    ...(trace.parentSpanId && { 'x-parent-span-id': trace.parentSpanId }),
  };
};

/**
 * @function extractTraceFromHeaders
 * @description Extracts trace context from HTTP headers
 * @param {Record<string, string>} headers - HTTP headers
 * @returns {Partial<TraceContext>} Extracted trace context
 *
 * @example
 * ```typescript
 * const traceContext = extractTraceFromHeaders(req.headers);
 * ```
 */
export const extractTraceFromHeaders = (
  headers: Record<string, string | string[]>,
): Partial<TraceContext> => {
  const getHeader = (key: string): string | undefined => {
    const value = headers[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    traceId: getHeader('x-trace-id'),
    spanId: getHeader('x-span-id'),
    parentSpanId: getHeader('x-parent-span-id'),
  };
};

// ============================================================================
// APM INTEGRATION HELPERS
// ============================================================================

/**
 * @function createApmTransaction
 * @description Creates APM transaction for monitoring
 * @param {string} name - Transaction name
 * @param {string} type - Transaction type (e.g., 'request', 'job')
 * @returns {ApmTransaction} APM transaction object
 *
 * @example
 * ```typescript
 * const transaction = createApmTransaction('POST /users', 'request');
 * ```
 */
export const createApmTransaction = (
  name: string,
  type: string,
): ApmTransaction => {
  return {
    id: generateTraceId(),
    name,
    type,
    timestamp: new Date(),
    context: {},
  };
};

/**
 * @function finishApmTransaction
 * @description Completes APM transaction with result and duration
 * @param {ApmTransaction} transaction - APM transaction
 * @param {string} result - Transaction result (e.g., 'success', 'error')
 * @returns {ApmTransaction} Completed transaction
 *
 * @example
 * ```typescript
 * const completed = finishApmTransaction(transaction, 'success');
 * ```
 */
export const finishApmTransaction = (
  transaction: ApmTransaction,
  result: string,
): ApmTransaction => {
  const now = new Date();
  return {
    ...transaction,
    result,
    duration: now.getTime() - transaction.timestamp.getTime(),
  };
};

/**
 * @function setApmTransactionContext
 * @description Sets custom context on APM transaction
 * @param {ApmTransaction} transaction - APM transaction
 * @param {string} key - Context key
 * @param {any} value - Context value
 * @returns {ApmTransaction} Updated transaction
 *
 * @example
 * ```typescript
 * const updated = setApmTransactionContext(transaction, 'userId', 'user-123');
 * ```
 */
export const setApmTransactionContext = (
  transaction: ApmTransaction,
  key: string,
  value: any,
): ApmTransaction => {
  return {
    ...transaction,
    context: {
      ...transaction.context,
      [key]: value,
    },
  };
};

// ============================================================================
// ERROR TRACKING AND REPORTING
// ============================================================================

/**
 * @function captureException
 * @description Captures and formats exception for error tracking
 * @param {Error} error - Error to capture
 * @param {Record<string, any>} context - Additional context
 * @returns {ErrorContext} Formatted error context
 *
 * @example
 * ```typescript
 * try {
 *   // ... operation
 * } catch (error) {
 *   const errorContext = captureException(error, { userId: 'user-123' });
 *   await reportError(errorContext);
 * }
 * ```
 */
export const captureException = (
  error: Error,
  context?: Record<string, any>,
): ErrorContext => {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    code: (error as any).code,
    statusCode: (error as any).statusCode,
    details: {
      ...context,
      timestamp: new Date().toISOString(),
    },
  };
};

/**
 * @function classifyError
 * @description Classifies error by type and severity
 * @param {Error} error - Error to classify
 * @returns {object} Error classification
 *
 * @example
 * ```typescript
 * const classification = classifyError(error);
 * // { type: 'DatabaseError', severity: 'critical', recoverable: false }
 * ```
 */
export const classifyError = (
  error: Error,
): { type: string; severity: string; recoverable: boolean } => {
  const statusCode = (error as any).statusCode;

  if (error.name === 'SequelizeError' || error.name.includes('Database')) {
    return { type: 'DatabaseError', severity: 'critical', recoverable: false };
  }

  if (statusCode >= 500) {
    return { type: 'ServerError', severity: 'critical', recoverable: true };
  }

  if (statusCode >= 400) {
    return { type: 'ClientError', severity: 'warning', recoverable: true };
  }

  return { type: 'UnknownError', severity: 'error', recoverable: false };
};

/**
 * @function shouldReportError
 * @description Determines if error should be reported to external service
 * @param {Error} error - Error to evaluate
 * @returns {boolean} True if error should be reported
 *
 * @example
 * ```typescript
 * if (shouldReportError(error)) {
 *   await sendToErrorTracking(error);
 * }
 * ```
 */
export const shouldReportError = (error: Error): boolean => {
  const statusCode = (error as any).statusCode;

  // Don't report client errors (4xx)
  if (statusCode >= 400 && statusCode < 500) {
    return false;
  }

  // Don't report validation errors
  if (error.name === 'ValidationError') {
    return false;
  }

  return true;
};

// ============================================================================
// CUSTOM METRICS AND COUNTERS
// ============================================================================

/**
 * @function incrementCounter
 * @description Increments a counter metric
 * @param {string} name - Metric name
 * @param {number} value - Increment value (default: 1)
 * @param {Record<string, string>} labels - Metric labels
 * @returns {CustomMetric} Counter metric
 *
 * @example
 * ```typescript
 * const metric = incrementCounter('http_requests_total', 1, {
 *   method: 'GET',
 *   status: '200'
 * });
 * ```
 */
export const incrementCounter = (
  name: string,
  value: number = 1,
  labels?: Record<string, string>,
): CustomMetric => {
  return {
    name,
    value,
    type: 'counter',
    labels,
    timestamp: new Date(),
  };
};

/**
 * @function setGauge
 * @description Sets a gauge metric value
 * @param {string} name - Metric name
 * @param {number} value - Gauge value
 * @param {Record<string, string>} labels - Metric labels
 * @returns {CustomMetric} Gauge metric
 *
 * @example
 * ```typescript
 * const metric = setGauge('active_connections', 42, { service: 'api' });
 * ```
 */
export const setGauge = (
  name: string,
  value: number,
  labels?: Record<string, string>,
): CustomMetric => {
  return {
    name,
    value,
    type: 'gauge',
    labels,
    timestamp: new Date(),
  };
};

/**
 * @function recordHistogram
 * @description Records a histogram observation
 * @param {string} name - Metric name
 * @param {number} value - Observed value
 * @param {Record<string, string>} labels - Metric labels
 * @returns {CustomMetric} Histogram metric
 *
 * @example
 * ```typescript
 * const metric = recordHistogram('http_request_duration_ms', 125, {
 *   endpoint: '/users'
 * });
 * ```
 */
export const recordHistogram = (
  name: string,
  value: number,
  labels?: Record<string, string>,
): CustomMetric => {
  return {
    name,
    value,
    type: 'histogram',
    labels,
    timestamp: new Date(),
  };
};

/**
 * @function createMetricRegistry
 * @description Creates a metric registry for in-memory storage
 * @returns {object} Metric registry with add/get/clear methods
 *
 * @example
 * ```typescript
 * const registry = createMetricRegistry();
 * registry.add(incrementCounter('requests', 1));
 * const metrics = registry.getAll();
 * ```
 */
export const createMetricRegistry = () => {
  const metrics: CustomMetric[] = [];

  return {
    add: (metric: CustomMetric) => {
      metrics.push(metric);
    },
    getAll: () => [...metrics],
    clear: () => {
      metrics.length = 0;
    },
    getByName: (name: string) => metrics.filter((m) => m.name === name),
  };
};

// ============================================================================
// HISTOGRAM AND PERCENTILE TRACKING
// ============================================================================

/**
 * @function calculatePercentiles
 * @description Calculates percentile statistics from data points
 * @param {number[]} values - Array of numeric values
 * @returns {PercentileStats} Percentile statistics
 *
 * @example
 * ```typescript
 * const stats = calculatePercentiles([10, 20, 30, 40, 50, 100]);
 * console.log(`p95: ${stats.p95}ms`);
 * ```
 */
export const calculatePercentiles = (values: number[]): PercentileStats => {
  if (values.length === 0) {
    return {
      p50: 0,
      p75: 0,
      p90: 0,
      p95: 0,
      p99: 0,
      min: 0,
      max: 0,
      mean: 0,
      count: 0,
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const getPercentile = (p: number) => {
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  };

  const sum = sorted.reduce((acc, val) => acc + val, 0);

  return {
    p50: getPercentile(50),
    p75: getPercentile(75),
    p90: getPercentile(90),
    p95: getPercentile(95),
    p99: getPercentile(99),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean: sum / sorted.length,
    count: sorted.length,
  };
};

/**
 * @function createHistogramTracker
 * @description Creates a histogram tracker for collecting observations
 * @param {string} name - Histogram name
 * @param {number} maxSize - Maximum observations to keep (default: 1000)
 * @returns {object} Histogram tracker with observe/stats methods
 *
 * @example
 * ```typescript
 * const latencyTracker = createHistogramTracker('api_latency', 1000);
 * latencyTracker.observe(125);
 * const stats = latencyTracker.getStats();
 * ```
 */
export const createHistogramTracker = (name: string, maxSize: number = 1000) => {
  const observations: number[] = [];

  return {
    observe: (value: number) => {
      observations.push(value);
      if (observations.length > maxSize) {
        observations.shift();
      }
    },
    getStats: (): PercentileStats => calculatePercentiles(observations),
    getName: () => name,
    getObservationCount: () => observations.length,
    reset: () => {
      observations.length = 0;
    },
  };
};

// ============================================================================
// LOG AGGREGATION UTILITIES
// ============================================================================

/**
 * @function aggregateLogs
 * @description Aggregates logs by level and context
 * @param {LogEntry[]} logs - Array of log entries
 * @returns {Record<string, any>} Aggregated log statistics
 *
 * @example
 * ```typescript
 * const stats = aggregateLogs(logEntries);
 * // { byLevel: { error: 5, warn: 10 }, byContext: { ... } }
 * ```
 */
export const aggregateLogs = (
  logs: LogEntry[],
): {
  byLevel: Record<LogLevel, number>;
  byContext: Record<string, number>;
  total: number;
} => {
  const byLevel: Record<LogLevel, number> = {
    [LogLevel.TRACE]: 0,
    [LogLevel.DEBUG]: 0,
    [LogLevel.INFO]: 0,
    [LogLevel.WARN]: 0,
    [LogLevel.ERROR]: 0,
    [LogLevel.FATAL]: 0,
  };

  const byContext: Record<string, number> = {};

  logs.forEach((log) => {
    byLevel[log.level]++;

    if (log.context) {
      byContext[log.context] = (byContext[log.context] || 0) + 1;
    }
  });

  return {
    byLevel,
    byContext,
    total: logs.length,
  };
};

/**
 * @function filterLogsByTimeRange
 * @description Filters logs within a time range
 * @param {LogEntry[]} logs - Array of log entries
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @returns {LogEntry[]} Filtered logs
 *
 * @example
 * ```typescript
 * const recentLogs = filterLogsByTimeRange(
 *   logs,
 *   new Date(Date.now() - 3600000),
 *   new Date()
 * );
 * ```
 */
export const filterLogsByTimeRange = (
  logs: LogEntry[],
  startTime: Date,
  endTime: Date,
): LogEntry[] => {
  return logs.filter((log) => {
    const timestamp = new Date(log.timestamp);
    return timestamp >= startTime && timestamp <= endTime;
  });
};

// ============================================================================
// CONTEXTUAL LOGGING
// ============================================================================

/**
 * @function createContextualLogger
 * @description Creates a logger with permanent context
 * @param {string} context - Logger context
 * @param {Partial<LogEntry>} defaultContext - Default context data
 * @returns {object} Contextual logger with log methods
 *
 * @example
 * ```typescript
 * const logger = createContextualLogger('UserService', {
 *   tenantId: 'tenant-123'
 * });
 * logger.info('User created', { userId: 'user-456' });
 * ```
 */
export const createContextualLogger = (
  context: string,
  defaultContext?: Partial<LogEntry>,
) => {
  const log = (level: LogLevel, message: string, additional?: Partial<LogEntry>) => {
    return createStructuredLog(level, message, {
      context,
      ...defaultContext,
      ...additional,
    });
  };

  return {
    trace: (message: string, additional?: Partial<LogEntry>) =>
      log(LogLevel.TRACE, message, additional),
    debug: (message: string, additional?: Partial<LogEntry>) =>
      log(LogLevel.DEBUG, message, additional),
    info: (message: string, additional?: Partial<LogEntry>) =>
      log(LogLevel.INFO, message, additional),
    warn: (message: string, additional?: Partial<LogEntry>) =>
      log(LogLevel.WARN, message, additional),
    error: (message: string, additional?: Partial<LogEntry>) =>
      log(LogLevel.ERROR, message, additional),
    fatal: (message: string, additional?: Partial<LogEntry>) =>
      log(LogLevel.FATAL, message, additional),
  };
};

/**
 * @function attachRequestContext
 * @description Attaches request context to all logs in scope
 * @param {Request} req - Express request
 * @returns {Partial<LogEntry>} Request context
 *
 * @example
 * ```typescript
 * const context = attachRequestContext(req);
 * logger.info('Processing request', context);
 * ```
 */
export const attachRequestContext = (req: Request): Partial<LogEntry> => {
  return {
    requestId: req.headers['x-request-id'] as string,
    userId: (req as any).user?.id,
    tenantId: (req as any).tenant?.id,
    metadata: {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    },
  };
};

// ============================================================================
// AUDIT LOGGING
// ============================================================================

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
export const createAuditLog = (
  entry: Partial<AuditLogEntry>,
): AuditLogEntry => {
  return {
    timestamp: new Date(),
    outcome: 'success',
    ...entry,
  } as AuditLogEntry;
};

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
export const logDataAccess = (
  userId: string,
  resource: string,
  resourceId: string,
  action: string,
): AuditLogEntry => {
  return createAuditLog({
    userId,
    resource,
    resourceId,
    action,
    outcome: 'success',
  });
};

/**
 * @function logDataModification
 * @description Logs data modification with before/after state
 * @param {string} userId - User ID
 * @param {string} resource - Resource type
 * @param {string} resourceId - Resource ID
 * @param {Record<string, any>} changes - Changes made
 * @returns {AuditLogEntry} Audit log entry
 *
 * @security Tracks all data modifications for compliance
 *
 * @example
 * ```typescript
 * const audit = logDataModification('user-123', 'patient', 'patient-456', {
 *   before: { status: 'active' },
 *   after: { status: 'inactive' }
 * });
 * ```
 */
export const logDataModification = (
  userId: string,
  resource: string,
  resourceId: string,
  changes: Record<string, any>,
): AuditLogEntry => {
  return createAuditLog({
    userId,
    resource,
    resourceId,
    action: 'MODIFY',
    changes,
    outcome: 'success',
  });
};

// ============================================================================
// DATABASE QUERY LOGGING
// ============================================================================

/**
 * @function createQueryLogger
 * @description Creates Sequelize query logger
 * @param {LogLevel} level - Log level for queries
 * @returns {Function} Sequelize logging function
 *
 * @example
 * ```typescript
 * const sequelize = new Sequelize({
 *   logging: createQueryLogger(LogLevel.DEBUG)
 * });
 * ```
 */
export const createQueryLogger = (level: LogLevel = LogLevel.DEBUG) => {
  return (query: string, timing?: number) => {
    const log = createStructuredLog(level, 'Database query', {
      context: 'Sequelize',
      metadata: { query },
      performance: timing
        ? { duration: timing, timestamp: new Date() }
        : undefined,
    });
    console.log(formatLogMessage(log));
  };
};

/**
 * @function logSlowQuery
 * @description Logs slow database queries
 * @param {QueryLogEntry} entry - Query log entry
 * @param {number} threshold - Slow query threshold in ms
 * @returns {LogEntry | null} Log entry if query is slow
 *
 * @example
 * ```typescript
 * const log = logSlowQuery({ query: 'SELECT ...', duration: 1500 }, 1000);
 * if (log) {
 *   logger.warn(log);
 * }
 * ```
 */
export const logSlowQuery = (
  entry: QueryLogEntry,
  threshold: number = 1000,
): LogEntry | null => {
  if (entry.duration >= threshold) {
    return createStructuredLog(LogLevel.WARN, 'Slow query detected', {
      context: 'Database',
      metadata: {
        query: entry.query,
        model: entry.model,
        operation: entry.operation,
        rowCount: entry.rowCount,
      },
      performance: {
        duration: entry.duration,
        timestamp: entry.timestamp,
      },
    });
  }
  return null;
};

// ============================================================================
// HEALTH CHECK ENDPOINTS
// ============================================================================

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
export const checkDatabaseHealth = async (
  sequelize: any,
): Promise<ComponentHealth> => {
  const startTime = performance.now();
  try {
    await sequelize.authenticate();
    const responseTime = performance.now() - startTime;

    return {
      status:
        responseTime > 1000 ? HealthStatus.DEGRADED : HealthStatus.HEALTHY,
      message: 'Database connection is healthy',
      responseTime,
    };
  } catch (error) {
    return {
      status: HealthStatus.UNHEALTHY,
      message: error.message,
      responseTime: performance.now() - startTime,
    };
  }
};

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
export const checkMemoryHealth = (threshold: number = 0.85): ComponentHealth => {
  const usage = process.memoryUsage();
  const heapUsedPercent = usage.heapUsed / usage.heapTotal;

  let status = HealthStatus.HEALTHY;
  if (heapUsedPercent > threshold) {
    status = HealthStatus.DEGRADED;
  }
  if (heapUsedPercent > 0.95) {
    status = HealthStatus.UNHEALTHY;
  }

  return {
    status,
    message: `Memory usage: ${(heapUsedPercent * 100).toFixed(2)}%`,
    metadata: {
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
      rss: Math.round(usage.rss / 1024 / 1024),
    },
  };
};

/**
 * @function performHealthCheck
 * @description Performs comprehensive health check
 * @param {object} checks - Health check functions
 * @returns {Promise<HealthCheckResult>} Complete health check result
 *
 * @example
 * ```typescript
 * const health = await performHealthCheck({
 *   database: () => checkDatabaseHealth(sequelize),
 *   memory: () => checkMemoryHealth(0.85)
 * });
 * ```
 */
export const performHealthCheck = async (
  checks: Record<string, () => Promise<ComponentHealth> | ComponentHealth>,
): Promise<HealthCheckResult> => {
  const results: Record<string, ComponentHealth> = {};

  for (const [name, check] of Object.entries(checks)) {
    try {
      results[name] = await check();
    } catch (error) {
      results[name] = {
        status: HealthStatus.UNHEALTHY,
        message: error.message,
      };
    }
  }

  const allHealthy = Object.values(results).every(
    (r) => r.status === HealthStatus.HEALTHY,
  );
  const anyUnhealthy = Object.values(results).some(
    (r) => r.status === HealthStatus.UNHEALTHY,
  );

  return {
    status: anyUnhealthy
      ? HealthStatus.UNHEALTHY
      : allHealthy
        ? HealthStatus.HEALTHY
        : HealthStatus.DEGRADED,
    checks: results,
    timestamp: new Date(),
    uptime: process.uptime(),
  };
};

/**
 * @function createHealthCheckEndpoint
 * @description Creates Express middleware for health check endpoint
 * @param {object} checks - Health check functions
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.get('/health', createHealthCheckEndpoint({
 *   database: () => checkDatabaseHealth(sequelize),
 *   memory: () => checkMemoryHealth()
 * }));
 * ```
 */
export const createHealthCheckEndpoint = (
  checks: Record<string, () => Promise<ComponentHealth> | ComponentHealth>,
) => {
  return async (req: Request, res: Response) => {
    const result = await performHealthCheck(checks);

    const statusCode =
      result.status === HealthStatus.HEALTHY
        ? 200
        : result.status === HealthStatus.DEGRADED
          ? 200
          : 503;

    res.status(statusCode).json(result);
  };
};
