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

import { Injectable, NestInterceptor, ExceptionFilter, Catch, ArgumentsHost, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Model, DataTypes, Sequelize } from 'sequelize';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as crypto from 'crypto';
import { z } from 'zod';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

interface ErrorMetrics {
  errorCode: string;
  count: number;
  firstOccurrence: Date;
  lastOccurrence: Date;
  affectedUsers: Set<string>;
  averageResponseTime: number;
}

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, { status: string; message?: string; responseTime?: number }>;
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

// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================

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
export function defineErrorLogModel(sequelize: Sequelize): typeof Model {
  class ErrorLog extends Model {
    public id!: string;
    public errorCode!: string;
    public message!: string;
    public stackTrace!: string;
    public stackTraceHash!: string;
    public userId!: string;
    public requestId!: string;
    public sessionId!: string;
    public ipAddress!: string;
    public userAgent!: string;
    public severity!: 'low' | 'medium' | 'high' | 'critical';
    public category!: string;
    public context!: Record<string, any>;
    public resolved!: boolean;
    public resolvedBy!: string;
    public resolvedAt!: Date;
    public occurrenceCount!: number;
    public occurredAt!: Date;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  ErrorLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      errorCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'error_code',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      stackTrace: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'stack_trace',
      },
      stackTraceHash: {
        type: DataTypes.STRING(64),
        allowNull: true,
        field: 'stack_trace_hash',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'user_id',
      },
      requestId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'request_id',
      },
      sessionId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'session_id',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'ip_address',
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'user_agent',
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium',
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'general',
      },
      context: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      resolved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      resolvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'resolved_by',
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'resolved_at',
      },
      occurrenceCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'occurrence_count',
      },
      occurredAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'occurred_at',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'error_logs',
      timestamps: true,
      indexes: [
        { fields: ['error_code'] },
        { fields: ['severity'] },
        { fields: ['category'] },
        { fields: ['resolved'] },
        { fields: ['occurred_at'] },
        { fields: ['stack_trace_hash'] },
        { fields: ['user_id'] },
      ],
    }
  );

  return ErrorLog;
}

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
export function definePerformanceMetricModel(sequelize: Sequelize): typeof Model {
  class PerformanceMetric extends Model {
    public id!: string;
    public endpoint!: string;
    public method!: string;
    public responseTime!: number;
    public statusCode!: number;
    public userId!: string;
    public requestId!: string;
    public memoryUsage!: number;
    public cpuUsage!: number;
    public dbQueryCount!: number;
    public dbQueryTime!: number;
    public cacheHit!: boolean;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
  }

  PerformanceMetric.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      endpoint: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      method: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      responseTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'response_time',
        comment: 'Response time in milliseconds',
      },
      statusCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'status_code',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'user_id',
      },
      requestId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'request_id',
      },
      memoryUsage: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'memory_usage',
        comment: 'Memory usage in bytes',
      },
      cpuUsage: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'cpu_usage',
        comment: 'CPU usage percentage',
      },
      dbQueryCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'db_query_count',
      },
      dbQueryTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'db_query_time',
        comment: 'Database query time in milliseconds',
      },
      cacheHit: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: 'cache_hit',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
    },
    {
      sequelize,
      tableName: 'performance_metrics',
      timestamps: false,
      indexes: [
        { fields: ['endpoint'] },
        { fields: ['method'] },
        { fields: ['status_code'] },
        { fields: ['created_at'] },
        { fields: ['response_time'] },
      ],
    }
  );

  return PerformanceMetric;
}

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
export function defineIncidentReportModel(sequelize: Sequelize): typeof Model {
  class IncidentReport extends Model {
    public id!: string;
    public title!: string;
    public description!: string;
    public severity!: 'low' | 'medium' | 'high' | 'critical';
    public status!: 'open' | 'investigating' | 'resolved' | 'closed';
    public affectedServices!: string[];
    public rootCause!: string;
    public resolution!: string;
    public assignedTo!: string;
    public reportedBy!: string;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public resolvedAt!: Date;
    public closedAt!: Date;
  }

  IncidentReport.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium',
      },
      status: {
        type: DataTypes.ENUM('open', 'investigating', 'resolved', 'closed'),
        allowNull: false,
        defaultValue: 'open',
      },
      affectedServices: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        field: 'affected_services',
      },
      rootCause: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'root_cause',
      },
      resolution: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      assignedTo: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'assigned_to',
      },
      reportedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'reported_by',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'resolved_at',
      },
      closedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'closed_at',
      },
    },
    {
      sequelize,
      tableName: 'incident_reports',
      timestamps: false,
      indexes: [
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['created_at'] },
        { fields: ['assigned_to'] },
      ],
    }
  );

  return IncidentReport;
}

// ============================================================================
// ZOD SCHEMAS (4-6)
// ============================================================================

/**
 * Zod schema for error log validation.
 */
export const errorLogSchema = z.object({
  errorCode: z.string().min(1).max(100),
  message: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.string().min(1).max(100),
  stackTrace: z.string().optional(),
  userId: z.string().uuid().optional(),
  context: z.record(z.any()).optional(),
});

/**
 * Zod schema for Sentry configuration validation.
 */
export const sentryConfigSchema = z.object({
  dsn: z.string().url(),
  environment: z.string().min(1),
  release: z.string().optional(),
  tracesSampleRate: z.number().min(0).max(1).optional(),
});

/**
 * Zod schema for alert configuration validation.
 */
export const alertConfigSchema = z.object({
  type: z.enum(['email', 'sms', 'slack', 'pagerduty', 'webhook']),
  destination: z.string().min(1),
  threshold: z.number().min(1),
  timeWindow: z.number().min(60),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  enabled: z.boolean(),
});

/**
 * Zod schema for circuit breaker configuration.
 */
export const circuitBreakerSchema = z.object({
  failureThreshold: z.number().min(1).max(100),
  resetTimeout: z.number().min(1000).max(300000),
  monitoringPeriod: z.number().min(1000).max(3600000),
  halfOpenRequests: z.number().min(1).max(10).optional(),
});

/**
 * Zod schema for retry configuration.
 */
export const retryConfigSchema = z.object({
  maxAttempts: z.number().min(1).max(10),
  initialDelay: z.number().min(100).max(10000),
  maxDelay: z.number().min(1000).max(60000),
  backoffMultiplier: z.number().min(1).max(10),
  retryableErrors: z.array(z.string()).optional(),
});

// ============================================================================
// ERROR LOGGING UTILITIES (7-12)
// ============================================================================

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
export async function logError(errorModel: typeof Model, errorLog: ErrorLog): Promise<any> {
  const stackTraceHash = errorLog.stackTrace
    ? crypto.createHash('sha256').update(errorLog.stackTrace).digest('hex')
    : undefined;

  // Check for existing error with same stack trace
  if (stackTraceHash) {
    const existingError = await errorModel.findOne({
      where: { stackTraceHash, resolved: false },
    });

    if (existingError) {
      await existingError.increment('occurrenceCount');
      await existingError.update({ occurredAt: new Date() });
      return existingError;
    }
  }

  return await errorModel.create({
    errorCode: errorLog.errorCode,
    message: errorLog.message,
    stackTrace: errorLog.stackTrace,
    stackTraceHash,
    userId: errorLog.userId,
    requestId: errorLog.requestId,
    severity: errorLog.severity,
    category: errorLog.category,
    context: errorLog.context || {},
    resolved: false,
    occurredAt: new Date(),
  });
}

/**
 * Categorizes error by type and severity.
 *
 * @param {Error} error - Error object
 * @returns {{category: string, severity: string}} Error categorization
 *
 * @example
 * const { category, severity } = categorizeError(new Error('Connection refused'));
 */
export function categorizeError(error: Error): { category: string; severity: string } {
  const message = error.message.toLowerCase();

  if (message.includes('timeout') || message.includes('econnrefused')) {
    return { category: 'network', severity: 'high' };
  }
  if (message.includes('database') || message.includes('sequelize')) {
    return { category: 'database', severity: 'critical' };
  }
  if (message.includes('unauthorized') || message.includes('forbidden')) {
    return { category: 'authentication', severity: 'medium' };
  }
  if (message.includes('validation') || message.includes('invalid')) {
    return { category: 'validation', severity: 'low' };
  }

  return { category: 'general', severity: 'medium' };
}

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
export function sanitizeError(error: Error, sensitiveFields: string[] = []): Record<string, any> {
  const sanitized: Record<string, any> = {
    message: error.message,
    name: error.name,
    stack: error.stack,
  };

  const defaultSensitiveFields = [
    'password',
    'token',
    'apiKey',
    'secret',
    'creditCard',
    'ssn',
  ];

  const allSensitiveFields = [...defaultSensitiveFields, ...sensitiveFields];

  if (sanitized.stack) {
    for (const field of allSensitiveFields) {
      const regex = new RegExp(`${field}[=:]\\s*[^\\s,}]+`, 'gi');
      sanitized.stack = sanitized.stack.replace(regex, `${field}=[REDACTED]`);
    }
  }

  return sanitized;
}

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
export function enrichErrorContext(
  error: Error,
  context: Record<string, any>
): Record<string, any> {
  return {
    error: {
      message: error.message,
      name: error.name,
      stack: error.stack,
    },
    context: {
      ...context,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
    },
  };
}

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
export async function aggregateErrors(
  errorModel: typeof Model,
  hours: number = 24
): Promise<ErrorAggregation[]> {
  const startDate = new Date(Date.now() - hours * 3600000);

  const errors = await errorModel.findAll({
    where: {
      occurredAt: {
        [Sequelize.Op.gte]: startDate,
      },
    },
  });

  const aggregationMap = new Map<string, ErrorAggregation>();

  for (const error of errors) {
    const hash = error.get('stackTraceHash') as string || error.get('errorCode') as string;

    if (aggregationMap.has(hash)) {
      const agg = aggregationMap.get(hash)!;
      agg.count += error.get('occurrenceCount') as number;
      agg.lastSeen = error.get('occurredAt') as Date;
      if (error.get('userId')) {
        agg.uniqueUsers++;
      }
    } else {
      aggregationMap.set(hash, {
        errorCode: error.get('errorCode') as string,
        message: error.get('message') as string,
        count: error.get('occurrenceCount') as number,
        uniqueUsers: error.get('userId') ? 1 : 0,
        firstSeen: error.get('occurredAt') as Date,
        lastSeen: error.get('occurredAt') as Date,
        stackTraceHash: hash,
      });
    }
  }

  return Array.from(aggregationMap.values()).sort((a, b) => b.count - a.count);
}

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
export async function generateErrorFrequencyReport(
  errorModel: typeof Model,
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  const errors = await errorModel.findAll({
    attributes: [
      'errorCode',
      'severity',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('MIN', Sequelize.col('occurred_at')), 'firstOccurrence'],
      [Sequelize.fn('MAX', Sequelize.col('occurred_at')), 'lastOccurrence'],
    ],
    where: {
      occurredAt: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
    group: ['errorCode', 'severity'],
    order: [[Sequelize.literal('count'), 'DESC']],
    raw: true,
  });

  return {
    period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
    totalErrors: errors.reduce((sum, e: any) => sum + parseInt(e.count), 0),
    errorsByCode: errors,
  };
}

// ============================================================================
// SENTRY INTEGRATION UTILITIES (13-16)
// ============================================================================

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
export function initializeSentry(config: SentryConfig): any {
  const Sentry = require('@sentry/node');

  Sentry.init({
    dsn: config.dsn,
    environment: config.environment,
    release: config.release,
    tracesSampleRate: config.tracesSampleRate || 0.1,
    beforeSend: config.beforeSend,
    integrations: config.integrations,
  });

  return Sentry;
}

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
export function captureSentryException(
  sentry: any,
  error: Error,
  context: Record<string, any> = {}
): string {
  sentry.withScope((scope: any) => {
    if (context.user) {
      scope.setUser(context.user);
    }
    if (context.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    if (context.extra) {
      scope.setExtras(context.extra);
    }

    scope.setLevel(context.level || 'error');
  });

  return sentry.captureException(error);
}

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
export function captureSentryMessage(
  sentry: any,
  message: string,
  level: string = 'info',
  context: Record<string, any> = {}
): string {
  sentry.withScope((scope: any) => {
    if (context.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    scope.setLevel(level);
  });

  return sentry.captureMessage(message);
}

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
export function setSentryUser(sentry: any, user: Record<string, any>): void {
  sentry.setUser(user);
}

// ============================================================================
// CIRCUIT BREAKER UTILITIES (17-20)
// ============================================================================

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
export function createCircuitBreaker(config: CircuitBreakerConfig): CircuitBreakerState {
  return {
    status: 'CLOSED',
    failureCount: 0,
    successCount: 0,
  };
}

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
export async function executeWithCircuitBreaker<T>(
  fn: () => Promise<T>,
  state: CircuitBreakerState,
  config: CircuitBreakerConfig
): Promise<T> {
  if (state.status === 'OPEN') {
    if (state.nextAttemptTime && Date.now() < state.nextAttemptTime) {
      throw new Error('Circuit breaker is OPEN');
    }
    state.status = 'HALF_OPEN';
  }

  try {
    const result = await fn();

    if (state.status === 'HALF_OPEN') {
      state.successCount++;
      if (state.successCount >= (config.halfOpenRequests || 3)) {
        state.status = 'CLOSED';
        state.failureCount = 0;
        state.successCount = 0;
      }
    } else {
      state.successCount++;
      state.failureCount = 0;
    }

    return result;
  } catch (error) {
    state.failureCount++;
    state.successCount = 0;
    state.lastFailureTime = Date.now();

    if (state.failureCount >= config.failureThreshold) {
      state.status = 'OPEN';
      state.nextAttemptTime = Date.now() + config.resetTimeout;
    }

    throw error;
  }
}

/**
 * Resets circuit breaker to closed state.
 *
 * @param {CircuitBreakerState} state - Circuit breaker state
 *
 * @example
 * resetCircuitBreaker(breakerState);
 */
export function resetCircuitBreaker(state: CircuitBreakerState): void {
  state.status = 'CLOSED';
  state.failureCount = 0;
  state.successCount = 0;
  state.lastFailureTime = undefined;
  state.nextAttemptTime = undefined;
}

/**
 * Gets circuit breaker health status.
 *
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @returns {Record<string, any>} Health status
 *
 * @example
 * const health = getCircuitBreakerHealth(breakerState);
 */
export function getCircuitBreakerHealth(state: CircuitBreakerState): Record<string, any> {
  return {
    status: state.status,
    failureCount: state.failureCount,
    successCount: state.successCount,
    healthy: state.status === 'CLOSED',
    lastFailure: state.lastFailureTime ? new Date(state.lastFailureTime).toISOString() : null,
  };
}

// ============================================================================
// RETRY LOGIC UTILITIES (21-24)
// ============================================================================

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
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  let lastError: Error | undefined;
  let delay = config.initialDelay;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (config.retryableErrors) {
        const isRetryable = config.retryableErrors.some(errType =>
          (error as Error).message.includes(errType)
        );
        if (!isRetryable) throw error;
      }

      if (attempt === config.maxAttempts) break;

      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
    }
  }

  throw lastError;
}

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
export function isRetryableError(error: Error, retryableErrors: string[]): boolean {
  return retryableErrors.some(pattern =>
    error.message.toLowerCase().includes(pattern.toLowerCase())
  );
}

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
export function calculateRetryDelay(
  attempt: number,
  baseDelay: number,
  maxDelay: number,
  jitterFactor: number = 0.1
): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  const jitter = exponentialDelay * jitterFactor * Math.random();
  return Math.min(exponentialDelay + jitter, maxDelay);
}

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
export function wrapWithRetry<T>(
  fn: (...args: any[]) => Promise<T>,
  config: RetryConfig
): (...args: any[]) => Promise<T> {
  return async (...args: any[]) => {
    return retryWithBackoff(() => fn(...args), config);
  };
}

// ============================================================================
// ALERTING UTILITIES (25-28)
// ============================================================================

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
export async function sendErrorAlert(config: AlertConfig, error: ErrorLog): Promise<void> {
  if (!config.enabled) return;

  const alertMessage = `[${error.severity.toUpperCase()}] ${error.errorCode}: ${error.message}`;

  switch (config.type) {
    case 'email':
      console.log(`Sending email alert to ${config.destination}: ${alertMessage}`);
      break;
    case 'sms':
      console.log(`Sending SMS alert to ${config.destination}: ${alertMessage}`);
      break;
    case 'slack':
      console.log(`Sending Slack alert to ${config.destination}: ${alertMessage}`);
      break;
    case 'pagerduty':
      console.log(`Sending PagerDuty alert: ${alertMessage}`);
      break;
    case 'webhook':
      console.log(`Sending webhook to ${config.destination}: ${alertMessage}`);
      break;
  }
}

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
export async function checkAlertThreshold(
  errorModel: typeof Model,
  errorCode: string,
  threshold: number,
  timeWindow: number
): Promise<boolean> {
  const startTime = new Date(Date.now() - timeWindow * 1000);

  const count = await errorModel.count({
    where: {
      errorCode,
      occurredAt: {
        [Sequelize.Op.gte]: startTime,
      },
    },
  });

  return count >= threshold;
}

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
export async function createIncidentReport(
  incidentModel: typeof Model,
  incident: Partial<IncidentReport>
): Promise<any> {
  return await incidentModel.create({
    title: incident.title,
    description: incident.description,
    severity: incident.severity,
    status: incident.status || 'open',
    affectedServices: incident.affectedServices || [],
    reportedBy: incident.reportedBy,
  });
}

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
export async function updateIncidentStatus(
  incidentModel: typeof Model,
  incidentId: string,
  status: string,
  resolution?: string
): Promise<any> {
  const updates: Record<string, any> = { status };

  if (status === 'resolved') {
    updates.resolvedAt = new Date();
    updates.resolution = resolution;
  }

  return await incidentModel.update(updates, {
    where: { id: incidentId },
  });
}

// ============================================================================
// PERFORMANCE MONITORING (29-32)
// ============================================================================

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
export async function trackPerformanceMetric(
  metricModel: typeof Model,
  endpoint: string,
  method: string,
  responseTime: number,
  statusCode: number,
  metadata: Record<string, any> = {}
): Promise<any> {
  return await metricModel.create({
    endpoint,
    method,
    responseTime,
    statusCode,
    userId: metadata.userId,
    requestId: metadata.requestId,
    memoryUsage: metadata.memoryUsage,
    cpuUsage: metadata.cpuUsage,
    dbQueryCount: metadata.dbQueryCount,
    dbQueryTime: metadata.dbQueryTime,
    cacheHit: metadata.cacheHit,
    metadata,
  });
}

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
export async function calculatePerformancePercentiles(
  metricModel: typeof Model,
  endpoint: string,
  hours: number = 24
): Promise<Record<string, number>> {
  const startTime = new Date(Date.now() - hours * 3600000);

  const metrics = await metricModel.findAll({
    attributes: ['responseTime'],
    where: {
      endpoint,
      createdAt: {
        [Sequelize.Op.gte]: startTime,
      },
    },
    order: [['responseTime', 'ASC']],
    raw: true,
  });

  const times = metrics.map((m: any) => m.responseTime);
  const count = times.length;

  if (count === 0) {
    return { p50: 0, p95: 0, p99: 0 };
  }

  return {
    p50: times[Math.floor(count * 0.5)],
    p95: times[Math.floor(count * 0.95)],
    p99: times[Math.floor(count * 0.99)],
  };
}

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
export async function identifySlowEndpoints(
  metricModel: typeof Model,
  threshold: number,
  hours: number = 24
): Promise<Array<{ endpoint: string; avgTime: number }>> {
  const startTime = new Date(Date.now() - hours * 3600000);

  const results = await metricModel.findAll({
    attributes: [
      'endpoint',
      [Sequelize.fn('AVG', Sequelize.col('response_time')), 'avgTime'],
    ],
    where: {
      createdAt: {
        [Sequelize.Op.gte]: startTime,
      },
    },
    group: ['endpoint'],
    having: Sequelize.where(
      Sequelize.fn('AVG', Sequelize.col('response_time')),
      Sequelize.Op.gt,
      threshold
    ),
    order: [[Sequelize.literal('avgTime'), 'DESC']],
    raw: true,
  });

  return results.map((r: any) => ({
    endpoint: r.endpoint,
    avgTime: parseFloat(r.avgTime),
  }));
}

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
export async function generatePerformanceReport(
  metricModel: typeof Model,
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  const metrics = await metricModel.findAll({
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalRequests'],
      [Sequelize.fn('AVG', Sequelize.col('response_time')), 'avgResponseTime'],
      [Sequelize.fn('MIN', Sequelize.col('response_time')), 'minResponseTime'],
      [Sequelize.fn('MAX', Sequelize.col('response_time')), 'maxResponseTime'],
    ],
    where: {
      createdAt: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
    raw: true,
  });

  const result = metrics[0] as any;

  return {
    period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
    totalRequests: parseInt(result.totalRequests),
    avgResponseTime: parseFloat(result.avgResponseTime),
    minResponseTime: parseInt(result.minResponseTime),
    maxResponseTime: parseInt(result.maxResponseTime),
  };
}

// ============================================================================
// HEALTH CHECK UTILITIES (33-36)
// ============================================================================

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
export async function performHealthCheck(
  checks: Record<string, () => Promise<boolean>>
): Promise<HealthCheckResult> {
  const results: Record<string, { status: string; message?: string; responseTime?: number }> = {};
  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  for (const [name, checkFn] of Object.entries(checks)) {
    const startTime = Date.now();
    try {
      const healthy = await checkFn();
      const responseTime = Date.now() - startTime;

      results[name] = {
        status: healthy ? 'healthy' : 'unhealthy',
        responseTime,
      };

      if (!healthy) {
        overallStatus = overallStatus === 'healthy' ? 'degraded' : 'unhealthy';
      }
    } catch (error) {
      results[name] = {
        status: 'unhealthy',
        message: (error as Error).message,
        responseTime: Date.now() - startTime,
      };
      overallStatus = 'unhealthy';
    }
  }

  return {
    status: overallStatus,
    checks: results,
    timestamp: new Date(),
  };
}

/**
 * Checks database connectivity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Database health status
 *
 * @example
 * const healthy = await checkDatabaseHealth(sequelize);
 */
export async function checkDatabaseHealth(sequelize: Sequelize): Promise<boolean> {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Checks Redis connectivity.
 *
 * @param {any} redisClient - Redis client
 * @returns {Promise<boolean>} Redis health status
 *
 * @example
 * const healthy = await checkRedisHealth(redis);
 */
export async function checkRedisHealth(redisClient: any): Promise<boolean> {
  try {
    await redisClient.ping();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Monitors system resource usage.
 *
 * @returns {Record<string, any>} Resource usage metrics
 *
 * @example
 * const usage = monitorSystemResources();
 */
export function monitorSystemResources(): Record<string, any> {
  const usage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  return {
    memory: {
      rss: usage.rss,
      heapTotal: usage.heapTotal,
      heapUsed: usage.heapUsed,
      external: usage.external,
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system,
    },
    uptime: process.uptime(),
  };
}

// ============================================================================
// STACK TRACE ANALYSIS (37-40)
// ============================================================================

/**
 * Parses and analyzes stack trace.
 *
 * @param {string} stackTrace - Stack trace string
 * @returns {Array<{file: string, line: number, function: string}>} Parsed stack frames
 *
 * @example
 * const frames = parseStackTrace(error.stack);
 */
export function parseStackTrace(
  stackTrace: string
): Array<{ file: string; line: number; function: string }> {
  const lines = stackTrace.split('\n');
  const frames: Array<{ file: string; line: number; function: string }> = [];

  for (const line of lines) {
    const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):\d+\)/);
    if (match) {
      frames.push({
        function: match[1],
        file: match[2],
        line: parseInt(match[3]),
      });
    }
  }

  return frames;
}

/**
 * Generates stack trace fingerprint for deduplication.
 *
 * @param {string} stackTrace - Stack trace string
 * @returns {string} Stack trace hash
 *
 * @example
 * const fingerprint = generateStackTraceFingerprint(error.stack);
 */
export function generateStackTraceFingerprint(stackTrace: string): string {
  const frames = parseStackTrace(stackTrace);
  const signature = frames
    .slice(0, 5)
    .map(f => `${f.file}:${f.line}`)
    .join('|');

  return crypto.createHash('sha256').update(signature).digest('hex');
}

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
export async function identifyErrorHotspots(
  errorModel: typeof Model,
  hours: number = 24
): Promise<Array<{ file: string; count: number }>> {
  const startTime = new Date(Date.now() - hours * 3600000);

  const errors = await errorModel.findAll({
    attributes: ['stackTrace'],
    where: {
      occurredAt: {
        [Sequelize.Op.gte]: startTime,
      },
      stackTrace: {
        [Sequelize.Op.ne]: null,
      },
    },
  });

  const fileCount = new Map<string, number>();

  for (const error of errors) {
    const stackTrace = error.get('stackTrace') as string;
    if (!stackTrace) continue;

    const frames = parseStackTrace(stackTrace);
    if (frames.length > 0) {
      const file = frames[0].file;
      fileCount.set(file, (fileCount.get(file) || 0) + 1);
    }
  }

  return Array.from(fileCount.entries())
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

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
export function compareStackTraces(stackTrace1: string, stackTrace2: string): number {
  const frames1 = parseStackTrace(stackTrace1);
  const frames2 = parseStackTrace(stackTrace2);

  const maxLength = Math.max(frames1.length, frames2.length);
  if (maxLength === 0) return 0;

  let matchCount = 0;
  const minLength = Math.min(frames1.length, frames2.length);

  for (let i = 0; i < minLength; i++) {
    if (
      frames1[i].file === frames2[i].file &&
      frames1[i].line === frames2[i].line
    ) {
      matchCount++;
    }
  }

  return matchCount / maxLength;
}

// ============================================================================
// NESTJS EXCEPTION FILTER & INTERCEPTOR
// ============================================================================

/**
 * NestJS Global Exception Filter with comprehensive error handling.
 *
 * @example
 * app.useGlobalFilters(new GlobalExceptionFilter(errorLogModel));
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject('ERROR_LOG_MODEL') private errorModel?: typeof Model,
    @Inject('SENTRY') private sentry?: any
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log to database
    if (this.errorModel) {
      logError(this.errorModel, {
        errorCode: `HTTP_${status}`,
        message,
        stackTrace: exception.stack,
        severity: status >= 500 ? 'high' : 'medium',
        category: 'http',
        resolved: false,
        context: {
          url: request.url,
          method: request.method,
          userId: request.user?.id,
        },
        occurredAt: new Date(),
      }).catch(console.error);
    }

    // Send to Sentry
    if (this.sentry) {
      captureSentryException(this.sentry, exception, {
        user: request.user,
        tags: { path: request.url, method: request.method },
      });
    }

    response.status(status).json(errorResponse);
  }
}

/**
 * NestJS Error Monitoring Interceptor.
 *
 * @example
 * @UseInterceptors(ErrorMonitoringInterceptor)
 * @Controller('patients')
 * export class PatientController {}
 */
@Injectable()
export class ErrorMonitoringInterceptor implements NestInterceptor {
  constructor(
    @Inject('ERROR_LOG_MODEL') private errorModel: typeof Model,
    @Inject('PERFORMANCE_METRIC_MODEL') private metricModel: typeof Model
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(async () => {
        const responseTime = Date.now() - startTime;
        await trackPerformanceMetric(
          this.metricModel,
          url,
          method,
          responseTime,
          200,
          { userId: request.user?.id }
        );
      }),
      catchError(async (error) => {
        const responseTime = Date.now() - startTime;

        await Promise.all([
          logError(this.errorModel, {
            errorCode: 'INTERCEPTOR_ERROR',
            message: error.message,
            stackTrace: error.stack,
            severity: 'high',
            category: 'runtime',
            resolved: false,
            context: { url, method },
            occurredAt: new Date(),
          }),
          trackPerformanceMetric(
            this.metricModel,
            url,
            method,
            responseTime,
            500,
            { userId: request.user?.id, error: error.message }
          ),
        ]);

        return throwError(() => error);
      })
    );
  }
}
