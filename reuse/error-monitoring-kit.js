"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMonitoringInterceptor = exports.GlobalExceptionFilter = exports.retryConfigSchema = exports.circuitBreakerSchema = exports.alertConfigSchema = exports.sentryConfigSchema = exports.errorLogSchema = void 0;
exports.defineErrorLogModel = defineErrorLogModel;
exports.definePerformanceMetricModel = definePerformanceMetricModel;
exports.defineIncidentReportModel = defineIncidentReportModel;
exports.logError = logError;
exports.categorizeError = categorizeError;
exports.sanitizeError = sanitizeError;
exports.enrichErrorContext = enrichErrorContext;
exports.aggregateErrors = aggregateErrors;
exports.generateErrorFrequencyReport = generateErrorFrequencyReport;
exports.initializeSentry = initializeSentry;
exports.captureSentryException = captureSentryException;
exports.captureSentryMessage = captureSentryMessage;
exports.setSentryUser = setSentryUser;
exports.createCircuitBreaker = createCircuitBreaker;
exports.executeWithCircuitBreaker = executeWithCircuitBreaker;
exports.resetCircuitBreaker = resetCircuitBreaker;
exports.getCircuitBreakerHealth = getCircuitBreakerHealth;
exports.retryWithBackoff = retryWithBackoff;
exports.isRetryableError = isRetryableError;
exports.calculateRetryDelay = calculateRetryDelay;
exports.wrapWithRetry = wrapWithRetry;
exports.sendErrorAlert = sendErrorAlert;
exports.checkAlertThreshold = checkAlertThreshold;
exports.createIncidentReport = createIncidentReport;
exports.updateIncidentStatus = updateIncidentStatus;
exports.trackPerformanceMetric = trackPerformanceMetric;
exports.calculatePerformancePercentiles = calculatePerformancePercentiles;
exports.identifySlowEndpoints = identifySlowEndpoints;
exports.generatePerformanceReport = generatePerformanceReport;
exports.performHealthCheck = performHealthCheck;
exports.checkDatabaseHealth = checkDatabaseHealth;
exports.checkRedisHealth = checkRedisHealth;
exports.monitorSystemResources = monitorSystemResources;
exports.parseStackTrace = parseStackTrace;
exports.generateStackTraceFingerprint = generateStackTraceFingerprint;
exports.identifyErrorHotspots = identifyErrorHotspots;
exports.compareStackTraces = compareStackTraces;
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
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const crypto = __importStar(require("crypto"));
const zod_1 = require("zod");
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
function defineErrorLogModel(sequelize) {
    class ErrorLog extends sequelize_1.Model {
    }
    ErrorLog.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        errorCode: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'error_code',
        },
        message: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        stackTrace: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'stack_trace',
        },
        stackTraceHash: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: true,
            field: 'stack_trace_hash',
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'user_id',
        },
        requestId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'request_id',
        },
        sessionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'session_id',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            field: 'ip_address',
        },
        userAgent: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'user_agent',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'medium',
        },
        category: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'general',
        },
        context: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        resolved: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        resolvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'resolved_by',
        },
        resolvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'resolved_at',
        },
        occurrenceCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            field: 'occurrence_count',
        },
        occurredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'occurred_at',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
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
    });
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
function definePerformanceMetricModel(sequelize) {
    class PerformanceMetric extends sequelize_1.Model {
    }
    PerformanceMetric.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        endpoint: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        method: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
        },
        responseTime: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'response_time',
            comment: 'Response time in milliseconds',
        },
        statusCode: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'status_code',
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'user_id',
        },
        requestId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'request_id',
        },
        memoryUsage: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: true,
            field: 'memory_usage',
            comment: 'Memory usage in bytes',
        },
        cpuUsage: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
            field: 'cpu_usage',
            comment: 'CPU usage percentage',
        },
        dbQueryCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            field: 'db_query_count',
        },
        dbQueryTime: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            field: 'db_query_time',
            comment: 'Database query time in milliseconds',
        },
        cacheHit: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: true,
            field: 'cache_hit',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
    }, {
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
    });
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
function defineIncidentReportModel(sequelize) {
    class IncidentReport extends sequelize_1.Model {
    }
    IncidentReport.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'medium',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('open', 'investigating', 'resolved', 'closed'),
            allowNull: false,
            defaultValue: 'open',
        },
        affectedServices: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            field: 'affected_services',
        },
        rootCause: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'root_cause',
        },
        resolution: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        assignedTo: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'assigned_to',
        },
        reportedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'reported_by',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        resolvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'resolved_at',
        },
        closedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'closed_at',
        },
    }, {
        sequelize,
        tableName: 'incident_reports',
        timestamps: false,
        indexes: [
            { fields: ['severity'] },
            { fields: ['status'] },
            { fields: ['created_at'] },
            { fields: ['assigned_to'] },
        ],
    });
    return IncidentReport;
}
// ============================================================================
// ZOD SCHEMAS (4-6)
// ============================================================================
/**
 * Zod schema for error log validation.
 */
exports.errorLogSchema = zod_1.z.object({
    errorCode: zod_1.z.string().min(1).max(100),
    message: zod_1.z.string().min(1),
    severity: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    category: zod_1.z.string().min(1).max(100),
    stackTrace: zod_1.z.string().optional(),
    userId: zod_1.z.string().uuid().optional(),
    context: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for Sentry configuration validation.
 */
exports.sentryConfigSchema = zod_1.z.object({
    dsn: zod_1.z.string().url(),
    environment: zod_1.z.string().min(1),
    release: zod_1.z.string().optional(),
    tracesSampleRate: zod_1.z.number().min(0).max(1).optional(),
});
/**
 * Zod schema for alert configuration validation.
 */
exports.alertConfigSchema = zod_1.z.object({
    type: zod_1.z.enum(['email', 'sms', 'slack', 'pagerduty', 'webhook']),
    destination: zod_1.z.string().min(1),
    threshold: zod_1.z.number().min(1),
    timeWindow: zod_1.z.number().min(60),
    severity: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    enabled: zod_1.z.boolean(),
});
/**
 * Zod schema for circuit breaker configuration.
 */
exports.circuitBreakerSchema = zod_1.z.object({
    failureThreshold: zod_1.z.number().min(1).max(100),
    resetTimeout: zod_1.z.number().min(1000).max(300000),
    monitoringPeriod: zod_1.z.number().min(1000).max(3600000),
    halfOpenRequests: zod_1.z.number().min(1).max(10).optional(),
});
/**
 * Zod schema for retry configuration.
 */
exports.retryConfigSchema = zod_1.z.object({
    maxAttempts: zod_1.z.number().min(1).max(10),
    initialDelay: zod_1.z.number().min(100).max(10000),
    maxDelay: zod_1.z.number().min(1000).max(60000),
    backoffMultiplier: zod_1.z.number().min(1).max(10),
    retryableErrors: zod_1.z.array(zod_1.z.string()).optional(),
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
async function logError(errorModel, errorLog) {
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
function categorizeError(error) {
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
function sanitizeError(error, sensitiveFields = []) {
    const sanitized = {
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
function enrichErrorContext(error, context) {
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
async function aggregateErrors(errorModel, hours = 24) {
    const startDate = new Date(Date.now() - hours * 3600000);
    const errors = await errorModel.findAll({
        where: {
            occurredAt: {
                [sequelize_1.Sequelize.Op.gte]: startDate,
            },
        },
    });
    const aggregationMap = new Map();
    for (const error of errors) {
        const hash = error.get('stackTraceHash') || error.get('errorCode');
        if (aggregationMap.has(hash)) {
            const agg = aggregationMap.get(hash);
            agg.count += error.get('occurrenceCount');
            agg.lastSeen = error.get('occurredAt');
            if (error.get('userId')) {
                agg.uniqueUsers++;
            }
        }
        else {
            aggregationMap.set(hash, {
                errorCode: error.get('errorCode'),
                message: error.get('message'),
                count: error.get('occurrenceCount'),
                uniqueUsers: error.get('userId') ? 1 : 0,
                firstSeen: error.get('occurredAt'),
                lastSeen: error.get('occurredAt'),
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
async function generateErrorFrequencyReport(errorModel, startDate, endDate) {
    const errors = await errorModel.findAll({
        attributes: [
            'errorCode',
            'severity',
            [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('id')), 'count'],
            [sequelize_1.Sequelize.fn('MIN', sequelize_1.Sequelize.col('occurred_at')), 'firstOccurrence'],
            [sequelize_1.Sequelize.fn('MAX', sequelize_1.Sequelize.col('occurred_at')), 'lastOccurrence'],
        ],
        where: {
            occurredAt: {
                [sequelize_1.Sequelize.Op.between]: [startDate, endDate],
            },
        },
        group: ['errorCode', 'severity'],
        order: [[sequelize_1.Sequelize.literal('count'), 'DESC']],
        raw: true,
    });
    return {
        period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
        totalErrors: errors.reduce((sum, e) => sum + parseInt(e.count), 0),
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
function initializeSentry(config) {
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
function captureSentryException(sentry, error, context = {}) {
    sentry.withScope((scope) => {
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
function captureSentryMessage(sentry, message, level = 'info', context = {}) {
    sentry.withScope((scope) => {
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
function setSentryUser(sentry, user) {
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
function createCircuitBreaker(config) {
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
async function executeWithCircuitBreaker(fn, state, config) {
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
        }
        else {
            state.successCount++;
            state.failureCount = 0;
        }
        return result;
    }
    catch (error) {
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
function resetCircuitBreaker(state) {
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
function getCircuitBreakerHealth(state) {
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
async function retryWithBackoff(fn, config) {
    let lastError;
    let delay = config.initialDelay;
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (config.retryableErrors) {
                const isRetryable = config.retryableErrors.some(errType => error.message.includes(errType));
                if (!isRetryable)
                    throw error;
            }
            if (attempt === config.maxAttempts)
                break;
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
function isRetryableError(error, retryableErrors) {
    return retryableErrors.some(pattern => error.message.toLowerCase().includes(pattern.toLowerCase()));
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
function calculateRetryDelay(attempt, baseDelay, maxDelay, jitterFactor = 0.1) {
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
function wrapWithRetry(fn, config) {
    return async (...args) => {
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
async function sendErrorAlert(config, error) {
    if (!config.enabled)
        return;
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
async function checkAlertThreshold(errorModel, errorCode, threshold, timeWindow) {
    const startTime = new Date(Date.now() - timeWindow * 1000);
    const count = await errorModel.count({
        where: {
            errorCode,
            occurredAt: {
                [sequelize_1.Sequelize.Op.gte]: startTime,
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
async function createIncidentReport(incidentModel, incident) {
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
async function updateIncidentStatus(incidentModel, incidentId, status, resolution) {
    const updates = { status };
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
async function trackPerformanceMetric(metricModel, endpoint, method, responseTime, statusCode, metadata = {}) {
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
async function calculatePerformancePercentiles(metricModel, endpoint, hours = 24) {
    const startTime = new Date(Date.now() - hours * 3600000);
    const metrics = await metricModel.findAll({
        attributes: ['responseTime'],
        where: {
            endpoint,
            createdAt: {
                [sequelize_1.Sequelize.Op.gte]: startTime,
            },
        },
        order: [['responseTime', 'ASC']],
        raw: true,
    });
    const times = metrics.map((m) => m.responseTime);
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
async function identifySlowEndpoints(metricModel, threshold, hours = 24) {
    const startTime = new Date(Date.now() - hours * 3600000);
    const results = await metricModel.findAll({
        attributes: [
            'endpoint',
            [sequelize_1.Sequelize.fn('AVG', sequelize_1.Sequelize.col('response_time')), 'avgTime'],
        ],
        where: {
            createdAt: {
                [sequelize_1.Sequelize.Op.gte]: startTime,
            },
        },
        group: ['endpoint'],
        having: sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('AVG', sequelize_1.Sequelize.col('response_time')), sequelize_1.Sequelize.Op.gt, threshold),
        order: [[sequelize_1.Sequelize.literal('avgTime'), 'DESC']],
        raw: true,
    });
    return results.map((r) => ({
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
async function generatePerformanceReport(metricModel, startDate, endDate) {
    const metrics = await metricModel.findAll({
        attributes: [
            [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('id')), 'totalRequests'],
            [sequelize_1.Sequelize.fn('AVG', sequelize_1.Sequelize.col('response_time')), 'avgResponseTime'],
            [sequelize_1.Sequelize.fn('MIN', sequelize_1.Sequelize.col('response_time')), 'minResponseTime'],
            [sequelize_1.Sequelize.fn('MAX', sequelize_1.Sequelize.col('response_time')), 'maxResponseTime'],
        ],
        where: {
            createdAt: {
                [sequelize_1.Sequelize.Op.between]: [startDate, endDate],
            },
        },
        raw: true,
    });
    const result = metrics[0];
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
async function performHealthCheck(checks) {
    const results = {};
    let overallStatus = 'healthy';
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
        }
        catch (error) {
            results[name] = {
                status: 'unhealthy',
                message: error.message,
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
async function checkDatabaseHealth(sequelize) {
    try {
        await sequelize.authenticate();
        return true;
    }
    catch (error) {
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
async function checkRedisHealth(redisClient) {
    try {
        await redisClient.ping();
        return true;
    }
    catch (error) {
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
function monitorSystemResources() {
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
function parseStackTrace(stackTrace) {
    const lines = stackTrace.split('\n');
    const frames = [];
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
function generateStackTraceFingerprint(stackTrace) {
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
async function identifyErrorHotspots(errorModel, hours = 24) {
    const startTime = new Date(Date.now() - hours * 3600000);
    const errors = await errorModel.findAll({
        attributes: ['stackTrace'],
        where: {
            occurredAt: {
                [sequelize_1.Sequelize.Op.gte]: startTime,
            },
            stackTrace: {
                [sequelize_1.Sequelize.Op.ne]: null,
            },
        },
    });
    const fileCount = new Map();
    for (const error of errors) {
        const stackTrace = error.get('stackTrace');
        if (!stackTrace)
            continue;
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
function compareStackTraces(stackTrace1, stackTrace2) {
    const frames1 = parseStackTrace(stackTrace1);
    const frames2 = parseStackTrace(stackTrace2);
    const maxLength = Math.max(frames1.length, frames2.length);
    if (maxLength === 0)
        return 0;
    let matchCount = 0;
    const minLength = Math.min(frames1.length, frames2.length);
    for (let i = 0; i < minLength; i++) {
        if (frames1[i].file === frames2[i].file &&
            frames1[i].line === frames2[i].line) {
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
let GlobalExceptionFilter = (() => {
    let _classDecorators = [(0, common_1.Catch)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GlobalExceptionFilter = _classThis = class {
        constructor(errorModel, sentry) {
            this.errorModel = errorModel;
            this.sentry = sentry;
        }
        catch(exception, host) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            const status = exception instanceof common_1.HttpException
                ? exception.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const message = exception instanceof common_1.HttpException
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
    };
    __setFunctionName(_classThis, "GlobalExceptionFilter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GlobalExceptionFilter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GlobalExceptionFilter = _classThis;
})();
exports.GlobalExceptionFilter = GlobalExceptionFilter;
/**
 * NestJS Error Monitoring Interceptor.
 *
 * @example
 * @UseInterceptors(ErrorMonitoringInterceptor)
 * @Controller('patients')
 * export class PatientController {}
 */
let ErrorMonitoringInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ErrorMonitoringInterceptor = _classThis = class {
        constructor(errorModel, metricModel) {
            this.errorModel = errorModel;
            this.metricModel = metricModel;
        }
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const { method, url } = request;
            const startTime = Date.now();
            return next.handle().pipe((0, operators_1.tap)(async () => {
                const responseTime = Date.now() - startTime;
                await trackPerformanceMetric(this.metricModel, url, method, responseTime, 200, { userId: request.user?.id });
            }), (0, operators_1.catchError)(async (error) => {
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
                    trackPerformanceMetric(this.metricModel, url, method, responseTime, 500, { userId: request.user?.id, error: error.message }),
                ]);
                return (0, rxjs_1.throwError)(() => error);
            }));
        }
    };
    __setFunctionName(_classThis, "ErrorMonitoringInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ErrorMonitoringInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ErrorMonitoringInterceptor = _classThis;
})();
exports.ErrorMonitoringInterceptor = ErrorMonitoringInterceptor;
//# sourceMappingURL=error-monitoring-kit.js.map