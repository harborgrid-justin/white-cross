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
  rate: number; // 0-1, percentage of logs to keep
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
    { fields: ['correlationId'] },
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
    type: DataType.STRING(64),
  })
  @Index
  correlationId: string;

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
export const formatLogAsJSON = (entry: LogEntry): string => {
  return JSON.stringify({
    ...entry,
    timestamp: entry.timestamp.toISOString(),
  });
};

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
export const formatLogAsText = (entry: LogEntry): string => {
  const timestamp = entry.timestamp.toISOString();
  const context = entry.context ? `[${entry.context}]` : '';
  const traceId = entry.traceId ? `trace=${entry.traceId}` : '';
  return `[${timestamp}] ${entry.level.toUpperCase()} ${context} ${entry.message} ${traceId}`.trim();
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
    correlationId: req.headers['x-correlation-id'] as string,
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
      code: (error as any).code,
      statusCode: (error as any).statusCode,
      details: (error as any).details,
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
// CORRELATION ID MANAGEMENT
// ============================================================================

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
export const generateCorrelationId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `corr-${timestamp}-${randomPart}`;
};

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
export const extractCorrelationId = (req: Request): string => {
  return (
    (req.headers['x-correlation-id'] as string) ||
    (req.headers['x-request-id'] as string) ||
    generateCorrelationId()
  );
};

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
export const propagateCorrelationId = (
  correlationId: string,
): Record<string, string> => {
  return {
    'x-correlation-id': correlationId,
    'x-request-id': correlationId,
  };
};

// ============================================================================
// PII/PHI REDACTION
// ============================================================================

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
export const redactPII = (data: any, config: RedactionConfig): any => {
  if (!config.enabled || !data) {
    return data;
  }

  if (typeof data !== 'object') {
    return data;
  }

  const redacted = Array.isArray(data) ? [...data] : { ...data };
  const replacement = config.replacement || '[REDACTED]';

  const redactObject = (obj: any): any => {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const result = Array.isArray(obj) ? [...obj] : { ...obj };

    for (const key in result) {
      // Redact specific fields
      if (config.fields.includes(key.toLowerCase())) {
        result[key] = replacement;
        continue;
      }

      // Apply pattern matching
      if (config.patterns && typeof result[key] === 'string') {
        for (const pattern of config.patterns) {
          result[key] = result[key].replace(pattern, replacement);
        }
      }

      // Recursively redact nested objects
      if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = redactObject(result[key]);
      }
    }

    return result;
  };

  return redactObject(redacted);
};

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
export const createPHIRedactionConfig = (): RedactionConfig => {
  return {
    enabled: true,
    fields: [
      'ssn',
      'socialsecuritynumber',
      'dateofbirth',
      'dob',
      'email',
      'phone',
      'phonenumber',
      'address',
      'medicalrecordnumber',
      'mrn',
      'healthplanbeneficiarynumber',
      'accountnumber',
      'certificatenumber',
      'licensenumber',
      'vehicleidentifier',
      'deviceidentifier',
      'biometricidentifier',
      'fullface',
      'ipaddress',
      'password',
      'token',
      'apikey',
    ],
    patterns: [
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN pattern
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone pattern
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email pattern
    ],
    replacement: '[PHI_REDACTED]',
  };
};

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
export const redactLogEntry = (
  entry: LogEntry,
  config: RedactionConfig,
): LogEntry => {
  return {
    ...entry,
    metadata: entry.metadata ? redactPII(entry.metadata, config) : undefined,
    error: entry.error
      ? {
          ...entry.error,
          details: entry.error.details
            ? redactPII(entry.error.details, config)
            : undefined,
        }
      : undefined,
  };
};

// ============================================================================
// LOG SAMPLING
// ============================================================================

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
export const shouldSampleLog = (
  entry: LogEntry,
  config: SamplingConfig,
): boolean => {
  if (!config.enabled) {
    return true;
  }

  // Never sample excluded levels (e.g., always keep errors)
  if (config.excludeLevels?.includes(entry.level)) {
    return true;
  }

  // Sample based on rate
  return Math.random() < config.rate;
};

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
export const createAdaptiveSampler = (targetRatePerMinute: number) => {
  let windowStart = Date.now();
  let logCount = 0;
  let currentRate = 1.0;

  return {
    shouldSample: (entry: LogEntry): boolean => {
      const now = Date.now();
      const windowDuration = 60000; // 1 minute

      // Reset window if needed
      if (now - windowStart >= windowDuration) {
        const actualRate = logCount / (windowDuration / 60000);
        currentRate = Math.min(1.0, targetRatePerMinute / Math.max(1, actualRate));
        windowStart = now;
        logCount = 0;
      }

      logCount++;

      // Always keep high-priority logs
      if (
        entry.level === LogLevel.ERROR ||
        entry.level === LogLevel.FATAL ||
        entry.level === LogLevel.WARN
      ) {
        return true;
      }

      return Math.random() < currentRate;
    },
    getStats: () => ({
      currentRate,
      logCount,
      windowAge: Date.now() - windowStart,
    }),
  };
};

// ============================================================================
// CUSTOM LOG TRANSPORTS
// ============================================================================

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
export const createConsoleTransport = (
  minLevel: LogLevel = LogLevel.INFO,
  colorize: boolean = true,
): LogTransport => {
  const colors: Record<LogLevel, string> = {
    [LogLevel.TRACE]: '\x1b[90m', // Gray
    [LogLevel.DEBUG]: '\x1b[36m', // Cyan
    [LogLevel.INFO]: '\x1b[32m', // Green
    [LogLevel.WARN]: '\x1b[33m', // Yellow
    [LogLevel.ERROR]: '\x1b[31m', // Red
    [LogLevel.FATAL]: '\x1b[35m', // Magenta
  };
  const reset = '\x1b[0m';

  return {
    name: 'console',
    level: minLevel,
    log: (entry: LogEntry) => {
      if (!shouldLog(entry.level, minLevel)) {
        return;
      }

      const message = formatLogAsText(entry);
      const color = colorize ? colors[entry.level] : '';
      console.log(`${color}${message}${colorize ? reset : ''}`);
    },
  };
};

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
export const createFileTransport = (
  filePath: string,
  minLevel: LogLevel = LogLevel.INFO,
): LogTransport => {
  const fs = require('fs');
  const stream = fs.createWriteStream(filePath, { flags: 'a' });

  return {
    name: 'file',
    level: minLevel,
    log: (entry: LogEntry) => {
      if (!shouldLog(entry.level, minLevel)) {
        return;
      }

      stream.write(formatLogAsJSON(entry) + '\n');
    },
  };
};

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
export const createHttpTransport = (
  url: string,
  minLevel: LogLevel = LogLevel.WARN,
): LogTransport => {
  return {
    name: 'http',
    level: minLevel,
    log: async (entry: LogEntry) => {
      if (!shouldLog(entry.level, minLevel)) {
        return;
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: formatLogAsJSON(entry),
        });

        if (!response.ok) {
          console.error(`HTTP transport failed: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`HTTP transport error:`, error);
      }
    },
  };
};

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
export const createMultiTransport = (
  transports: LogTransport[],
): LogTransport => {
  return {
    name: 'multi',
    level: LogLevel.TRACE, // Let individual transports filter
    log: async (entry: LogEntry) => {
      await Promise.all(
        transports.map((transport) => {
          try {
            return transport.log(entry);
          } catch (error) {
            console.error(`Transport ${transport.name} failed:`, error);
          }
        }),
      );
    },
  };
};

// ============================================================================
// REQUEST/RESPONSE LOGGING
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
    this.logger.log(formatLogAsJSON(requestLog));

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const responseLog = createResponseLog(response, duration);
        this.logger.log(formatLogAsJSON(responseLog));
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const errorLog = createErrorLog(error, 'RequestLoggingInterceptor', {
          performance: { duration, timestamp: new Date() },
        });
        this.logger.error(formatLogAsJSON(errorLog));
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
    correlationId: extractCorrelationId(req),
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
// PERFORMANCE METRICS
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
// PROMETHEUS METRICS
// ============================================================================

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
export const formatPrometheusMetric = (metric: PrometheusMetric): string => {
  const lines: string[] = [];

  // Add HELP and TYPE
  lines.push(`# HELP ${metric.name} ${metric.help}`);
  lines.push(`# TYPE ${metric.name} ${metric.type}`);

  // Add values
  for (const value of metric.values) {
    const labelsStr = value.labels
      ? `{${Object.entries(value.labels)
          .map(([k, v]) => `${k}="${v}"`)
          .join(',')}}`
      : '';

    const timestampStr = value.timestamp ? ` ${value.timestamp}` : '';
    lines.push(`${metric.name}${labelsStr} ${value.value}${timestampStr}`);
  }

  return lines.join('\n');
};

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
export const createPrometheusRegistry = () => {
  const metrics = new Map<string, PrometheusMetric>();

  return {
    register: (metric: PrometheusMetric) => {
      metrics.set(metric.name, metric);
    },
    collect: (): string => {
      const output: string[] = [];
      for (const metric of metrics.values()) {
        output.push(formatPrometheusMetric(metric));
      }
      return output.join('\n\n');
    },
    getMetric: (name: string) => metrics.get(name),
    clear: () => metrics.clear(),
  };
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
export const incrementPrometheusCounter = (
  name: string,
  value: number = 1,
  labels?: Record<string, string>,
): PrometheusMetric => {
  return {
    name,
    help: `${name} counter`,
    type: 'counter',
    values: [{ value, labels }],
  };
};

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
export const setPrometheusGauge = (
  name: string,
  value: number,
  labels?: Record<string, string>,
): PrometheusMetric => {
  return {
    name,
    help: `${name} gauge`,
    type: 'gauge',
    values: [{ value, labels }],
  };
};

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
export const recordPrometheusHistogram = (
  name: string,
  value: number,
  buckets: number[],
  labels?: Record<string, string>,
): PrometheusMetric => {
  const values = buckets.map((bucket) => ({
    value: value <= bucket ? 1 : 0,
    labels: { ...labels, le: bucket.toString() },
  }));

  // Add +Inf bucket
  values.push({
    value: 1,
    labels: { ...labels, le: '+Inf' },
  });

  return {
    name: `${name}_bucket`,
    help: `${name} histogram`,
    type: 'histogram',
    values,
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

// ============================================================================
// HEALTH CHECKS
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
 * @function createLivenessProbe
 * @description Creates a liveness probe for Kubernetes
 * @returns {Function} Express middleware for liveness
 *
 * @example
 * ```typescript
 * app.get('/healthz/live', createLivenessProbe());
 * ```
 */
export const createLivenessProbe = () => {
  return (req: Request, res: Response) => {
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
    });
  };
};

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
export const createReadinessProbe = (
  checks: Record<string, () => Promise<ComponentHealth> | ComponentHealth>,
) => {
  return async (req: Request, res: Response) => {
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

    const isReady = Object.values(results).every(
      (r) => r.status === HealthStatus.HEALTHY || r.status === HealthStatus.DEGRADED,
    );

    res.status(isReady ? 200 : 503).json({
      status: isReady ? 'ready' : 'not_ready',
      checks: results,
      timestamp: new Date().toISOString(),
    });
  };
};

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
export const createStartupProbe = (
  initCheck: () => Promise<boolean>,
) => {
  let isStarted = false;

  return async (req: Request, res: Response) => {
    if (!isStarted) {
      try {
        isStarted = await initCheck();
      } catch (error) {
        res.status(503).json({
          status: 'starting',
          message: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }

    res.status(200).json({
      status: 'started',
      timestamp: new Date().toISOString(),
    });
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
export const createAuditMiddleware = (
  persistFn: (log: AuditLogEntry) => Promise<void>,
) => {
  return async (req: Request, res: Response, next: any) => {
    const startTime = Date.now();

    res.on('finish', async () => {
      const auditLog = createAuditLog({
        userId: (req as any).user?.id || 'anonymous',
        tenantId: (req as any).tenant?.id,
        action: `${req.method} ${req.path}`,
        resource: req.path.split('/')[1] || 'unknown',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        outcome: res.statusCode < 400 ? 'success' : 'failure',
      });

      try {
        await persistFn(auditLog);
      } catch (error) {
        console.error('Failed to persist audit log:', error);
      }
    });

    next();
  };
};
