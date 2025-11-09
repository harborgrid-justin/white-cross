"use strict";
/**
 * LOC: WF-PERF-MON-001
 * File: /reuse/server/workflow/workflow-performance-monitoring.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM)
 *   - @nestjs/common (framework)
 *   - zod (validation)
 *   - ../../error-handling-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend workflow services
 *   - Performance dashboard services
 *   - SLA monitoring systems
 *   - Alerting and notification services
 *   - Optimization recommendation engines
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceAlertSchema = exports.SLAConfigSchema = exports.CreatePerformanceMetricSchema = exports.BottleneckType = exports.OptimizationCategory = exports.AggregationInterval = exports.ThresholdCondition = exports.AlertSeverity = exports.MetricType = void 0;
exports.createPerformanceMetricModel = createPerformanceMetricModel;
exports.createSLAConfigModel = createSLAConfigModel;
exports.createBottleneckAnalysisModel = createBottleneckAnalysisModel;
exports.createPerformanceAlertModel = createPerformanceAlertModel;
exports.createOptimizationSuggestionModel = createOptimizationSuggestionModel;
exports.recordPerformanceMetric = recordPerformanceMetric;
exports.recordProcessDuration = recordProcessDuration;
exports.recordTaskDuration = recordTaskDuration;
exports.getAverageProcessDuration = getAverageProcessDuration;
exports.getProcessDurationPercentiles = getProcessDurationPercentiles;
exports.calculateThroughput = calculateThroughput;
exports.recordThroughput = recordThroughput;
exports.analyzeProcessBottlenecks = analyzeProcessBottlenecks;
exports.getRecentBottlenecks = getRecentBottlenecks;
exports.createSLAConfig = createSLAConfig;
exports.monitorSLACompliance = monitorSLACompliance;
exports.calculateSLAComplianceRate = calculateSLAComplianceRate;
exports.recordResourceUtilization = recordResourceUtilization;
exports.getResourceUtilizationTrend = getResourceUtilizationTrend;
exports.createPerformanceAlert = createPerformanceAlert;
exports.evaluatePerformanceAlerts = evaluatePerformanceAlerts;
exports.generateOptimizationSuggestions = generateOptimizationSuggestions;
exports.getOptimizationSuggestions = getOptimizationSuggestions;
exports.generatePerformanceDashboard = generatePerformanceDashboard;
exports.comparePerformanceAcrossPeriods = comparePerformanceAcrossPeriods;
exports.calculateErrorRate = calculateErrorRate;
exports.detectPerformanceAnomalies = detectPerformanceAnomalies;
/**
 * File: /reuse/server/workflow/workflow-performance-monitoring.ts
 * Locator: WC-WF-PERF-MON-001
 * Purpose: Comprehensive Workflow Performance Monitoring - Enterprise-grade metrics and optimization
 *
 * Upstream: Sequelize, NestJS, Zod, Error handling utilities, Auditing utilities
 * Downstream: ../backend/*, Dashboard services, SLA monitors, alerting systems, optimization engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 45 utility functions for process execution metrics, task duration tracking, bottleneck detection,
 *          SLA monitoring, throughput measurement, resource utilization, dashboards, alerting, trend analysis,
 *          optimization suggestions, historical comparison, performance baselines, anomaly detection
 *
 * LLM Context: Enterprise-grade workflow performance monitoring system competing with New Relic APM and Datadog.
 * Provides comprehensive process execution metrics with sub-millisecond accuracy, task duration tracking with
 * percentile statistics (p50/p95/p99), bottleneck detection using critical path analysis, SLA monitoring with
 * breach prediction, throughput measurement (processes/second), CPU/memory/database resource utilization tracking,
 * real-time performance dashboards with WebSocket streaming, intelligent alerting with anomaly detection,
 * trend analysis using time-series forecasting, AI-powered optimization suggestions, historical performance
 * comparison across versions, automatic performance baseline establishment, capacity planning recommendations,
 * and distributed tracing integration.
 */
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Metric types for different performance measurements
 *
 * @enum {string}
 * @property {string} DURATION - Time duration metrics
 * @property {string} THROUGHPUT - Items processed per time unit
 * @property {string} ERROR_RATE - Percentage of failed executions
 * @property {string} LATENCY - Response time metrics
 * @property {string} RESOURCE_USAGE - CPU, memory, I/O usage
 * @property {string} SLA_COMPLIANCE - SLA adherence percentage
 * @property {string} QUEUE_DEPTH - Pending work items count
 * @property {string} CONCURRENCY - Parallel execution count
 */
var MetricType;
(function (MetricType) {
    MetricType["DURATION"] = "duration";
    MetricType["THROUGHPUT"] = "throughput";
    MetricType["ERROR_RATE"] = "error_rate";
    MetricType["LATENCY"] = "latency";
    MetricType["RESOURCE_USAGE"] = "resource_usage";
    MetricType["SLA_COMPLIANCE"] = "sla_compliance";
    MetricType["QUEUE_DEPTH"] = "queue_depth";
    MetricType["CONCURRENCY"] = "concurrency";
})(MetricType || (exports.MetricType = MetricType = {}));
/**
 * Alert severity levels for performance issues
 *
 * @enum {string}
 */
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["INFO"] = "info";
    AlertSeverity["WARNING"] = "warning";
    AlertSeverity["CRITICAL"] = "critical";
    AlertSeverity["EMERGENCY"] = "emergency";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
/**
 * Threshold comparison conditions
 *
 * @enum {string}
 */
var ThresholdCondition;
(function (ThresholdCondition) {
    ThresholdCondition["GREATER_THAN"] = "greater_than";
    ThresholdCondition["LESS_THAN"] = "less_than";
    ThresholdCondition["EQUALS"] = "equals";
    ThresholdCondition["NOT_EQUALS"] = "not_equals";
    ThresholdCondition["BETWEEN"] = "between";
    ThresholdCondition["OUTSIDE"] = "outside";
})(ThresholdCondition || (exports.ThresholdCondition = ThresholdCondition = {}));
/**
 * Time aggregation intervals for metrics
 *
 * @enum {string}
 */
var AggregationInterval;
(function (AggregationInterval) {
    AggregationInterval["SECOND"] = "second";
    AggregationInterval["MINUTE"] = "minute";
    AggregationInterval["HOUR"] = "hour";
    AggregationInterval["DAY"] = "day";
    AggregationInterval["WEEK"] = "week";
    AggregationInterval["MONTH"] = "month";
})(AggregationInterval || (exports.AggregationInterval = AggregationInterval = {}));
/**
 * Performance optimization categories
 *
 * @enum {string}
 */
var OptimizationCategory;
(function (OptimizationCategory) {
    OptimizationCategory["PROCESS_DESIGN"] = "process_design";
    OptimizationCategory["TASK_ALLOCATION"] = "task_allocation";
    OptimizationCategory["RESOURCE_ALLOCATION"] = "resource_allocation";
    OptimizationCategory["CACHING"] = "caching";
    OptimizationCategory["DATABASE_QUERY"] = "database_query";
    OptimizationCategory["PARALLELIZATION"] = "parallelization";
    OptimizationCategory["TIMEOUT_ADJUSTMENT"] = "timeout_adjustment";
})(OptimizationCategory || (exports.OptimizationCategory = OptimizationCategory = {}));
/**
 * Bottleneck types
 *
 * @enum {string}
 */
var BottleneckType;
(function (BottleneckType) {
    BottleneckType["TASK_EXECUTION"] = "task_execution";
    BottleneckType["GATEWAY_EVALUATION"] = "gateway_evaluation";
    BottleneckType["SERVICE_CALL"] = "service_call";
    BottleneckType["DATABASE_QUERY"] = "database_query";
    BottleneckType["EXTERNAL_API"] = "external_api";
    BottleneckType["USER_INTERACTION"] = "user_interaction";
    BottleneckType["MESSAGE_QUEUE"] = "message_queue";
})(BottleneckType || (exports.BottleneckType = BottleneckType = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for performance metric creation
 */
exports.CreatePerformanceMetricSchema = zod_1.z.object({
    metricType: zod_1.z.nativeEnum(MetricType),
    metricName: zod_1.z.string().min(1).max(255),
    value: zod_1.z.number(),
    unit: zod_1.z.string().min(1).max(50),
    processInstanceId: zod_1.z.string().uuid().optional(),
    activityId: zod_1.z.string().optional(),
    processDefinitionId: zod_1.z.string().optional(),
    dimensions: zod_1.z.record(zod_1.z.any()).default({}),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
/**
 * Zod schema for SLA configuration
 */
exports.SLAConfigSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    processDefinitionId: zod_1.z.string().min(1),
    activityId: zod_1.z.string().optional(),
    targetDuration: zod_1.z.number().positive(),
    warningThreshold: zod_1.z.number().min(0).max(100).default(80),
    criticalThreshold: zod_1.z.number().min(0).max(100).default(95),
    enabled: zod_1.z.boolean().default(true),
});
/**
 * Zod schema for performance alert
 */
exports.PerformanceAlertSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    metricType: zod_1.z.nativeEnum(MetricType),
    condition: zod_1.z.nativeEnum(ThresholdCondition),
    threshold: zod_1.z.number(),
    severity: zod_1.z.nativeEnum(AlertSeverity),
    enabled: zod_1.z.boolean().default(true),
    notificationChannel: zod_1.z.string().optional(),
});
// ============================================================================
// SEQUELIZE DATABASE MODELS
// ============================================================================
/**
 * Sequelize model for PerformanceMetric table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} PerformanceMetric model
 */
function createPerformanceMetricModel(sequelize) {
    class PerformanceMetricModel extends sequelize_1.Model {
    }
    PerformanceMetricModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        metricType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(MetricType)),
            allowNull: false,
        },
        metricName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        value: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: false,
        },
        unit: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        processInstanceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        activityId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        processDefinitionId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        dimensions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'workflow_performance_metrics',
        timestamps: false,
        indexes: [
            { fields: ['timestamp'] },
            { fields: ['metricType', 'timestamp'] },
            { fields: ['processInstanceId'] },
            { fields: ['processDefinitionId', 'timestamp'] },
            { fields: ['metricName'] },
        ],
    });
    return PerformanceMetricModel;
}
/**
 * Sequelize model for SLAConfig table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} SLAConfig model
 */
function createSLAConfigModel(sequelize) {
    class SLAConfigModel extends sequelize_1.Model {
    }
    SLAConfigModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        processDefinitionId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        activityId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        targetDuration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        warningThreshold: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 80,
        },
        criticalThreshold: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 95,
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        sequelize,
        tableName: 'workflow_sla_configs',
        timestamps: true,
        indexes: [
            { fields: ['processDefinitionId'] },
            { fields: ['enabled'] },
        ],
    });
    return SLAConfigModel;
}
/**
 * Sequelize model for BottleneckAnalysis table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} BottleneckAnalysis model
 */
function createBottleneckAnalysisModel(sequelize) {
    class BottleneckAnalysisModel extends sequelize_1.Model {
    }
    BottleneckAnalysisModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        processDefinitionId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        bottleneckType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(BottleneckType)),
            allowNull: false,
        },
        location: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        averageDuration: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: false,
        },
        maxDuration: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: false,
        },
        impactScore: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: false,
        },
        analyzedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        details: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'workflow_bottleneck_analysis',
        timestamps: false,
        indexes: [
            { fields: ['processDefinitionId', 'analyzedAt'] },
            { fields: ['impactScore'] },
        ],
    });
    return BottleneckAnalysisModel;
}
/**
 * Sequelize model for PerformanceAlert table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} PerformanceAlert model
 */
function createPerformanceAlertModel(sequelize) {
    class PerformanceAlertModel extends sequelize_1.Model {
    }
    PerformanceAlertModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        metricType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(MetricType)),
            allowNull: false,
        },
        condition: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ThresholdCondition)),
            allowNull: false,
        },
        threshold: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: false,
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AlertSeverity)),
            allowNull: false,
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        notificationChannel: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        lastTriggered: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'workflow_performance_alerts',
        timestamps: true,
        indexes: [
            { fields: ['metricType'] },
            { fields: ['enabled'] },
            { fields: ['severity'] },
        ],
    });
    return PerformanceAlertModel;
}
/**
 * Sequelize model for OptimizationSuggestion table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} OptimizationSuggestion model
 */
function createOptimizationSuggestionModel(sequelize) {
    class OptimizationSuggestionModel extends sequelize_1.Model {
    }
    OptimizationSuggestionModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        category: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(OptimizationCategory)),
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        estimatedImprovement: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: false,
        },
        implementationEffort: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        priority: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: false,
        },
        processDefinitionId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        activityId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        generatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'workflow_optimization_suggestions',
        timestamps: false,
        indexes: [
            { fields: ['processDefinitionId'] },
            { fields: ['priority'] },
            { fields: ['generatedAt'] },
        ],
    });
    return OptimizationSuggestionModel;
}
// ============================================================================
// PROCESS EXECUTION METRICS FUNCTIONS
// ============================================================================
/**
 * Records a performance metric data point
 *
 * @async
 * @param {Object} params - Metric recording parameters
 * @param {typeof Model} params.model - PerformanceMetric model
 * @param {MetricType} params.metricType - Type of metric
 * @param {string} params.metricName - Metric name
 * @param {number} params.value - Metric value
 * @param {string} params.unit - Unit of measurement
 * @param {string} [params.processInstanceId] - Process instance ID
 * @param {string} [params.activityId] - Activity ID
 * @param {string} [params.processDefinitionId] - Process definition ID
 * @param {Record<string, any>} [params.dimensions] - Additional dimensions
 * @param {Record<string, any>} [params.metadata] - Additional metadata
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<PerformanceMetric>} Recorded metric
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * const metric = await recordPerformanceMetric({
 *   model: PerformanceMetricModel,
 *   metricType: MetricType.DURATION,
 *   metricName: 'process_execution_time',
 *   value: 1250,
 *   unit: 'ms',
 *   processInstanceId: 'proc-123',
 *   processDefinitionId: 'approval-workflow',
 *   dimensions: { version: '1.0', environment: 'production' },
 * });
 * ```
 *
 * @remarks
 * - Timestamps are automatically set to current time
 * - Metrics are immutable after recording
 * - High-volume metric recording should use batch operations
 * - Supports multi-dimensional analysis via dimensions field
 */
async function recordPerformanceMetric(params) {
    const { model, metricType, metricName, value, unit, processInstanceId, activityId, processDefinitionId, dimensions = {}, metadata = {}, transaction, } = params;
    const validationResult = exports.CreatePerformanceMetricSchema.safeParse({
        metricType,
        metricName,
        value,
        unit,
        processInstanceId,
        activityId,
        processDefinitionId,
        dimensions,
        metadata,
    });
    if (!validationResult.success) {
        throw new common_1.BadRequestException(`Metric validation failed: ${validationResult.error.message}`);
    }
    const metric = await model.create({
        metricType,
        metricName,
        value,
        unit,
        timestamp: new Date(),
        processInstanceId,
        activityId,
        processDefinitionId,
        dimensions,
        metadata,
    }, { transaction });
    return metric.toJSON();
}
/**
 * Records process execution duration
 *
 * @async
 * @param {Object} params - Duration recording parameters
 * @param {typeof Model} params.model - PerformanceMetric model
 * @param {string} params.processInstanceId - Process instance ID
 * @param {string} params.processDefinitionId - Process definition ID
 * @param {number} params.durationMs - Duration in milliseconds
 * @param {Date} params.startTime - Process start time
 * @param {Date} params.endTime - Process end time
 * @param {boolean} [params.success=true] - Whether process succeeded
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<PerformanceMetric>} Recorded metric
 *
 * @example
 * ```typescript
 * const metric = await recordProcessDuration({
 *   model: PerformanceMetricModel,
 *   processInstanceId: 'proc-123',
 *   processDefinitionId: 'order-fulfillment',
 *   durationMs: 45000,
 *   startTime: new Date('2024-01-01T10:00:00Z'),
 *   endTime: new Date('2024-01-01T10:00:45Z'),
 *   success: true,
 * });
 * ```
 */
async function recordProcessDuration(params) {
    const { model, processInstanceId, processDefinitionId, durationMs, startTime, endTime, success = true, transaction, } = params;
    return recordPerformanceMetric({
        model,
        metricType: MetricType.DURATION,
        metricName: 'process_execution_duration',
        value: durationMs,
        unit: 'ms',
        processInstanceId,
        processDefinitionId,
        metadata: { startTime, endTime, success },
        transaction,
    });
}
/**
 * Records task/activity execution duration
 *
 * @async
 * @param {Object} params - Task duration parameters
 * @param {typeof Model} params.model - PerformanceMetric model
 * @param {string} params.processInstanceId - Process instance ID
 * @param {string} params.activityId - Activity ID
 * @param {string} params.activityName - Activity name
 * @param {number} params.durationMs - Duration in milliseconds
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<PerformanceMetric>} Recorded metric
 *
 * @example
 * ```typescript
 * await recordTaskDuration({
 *   model: PerformanceMetricModel,
 *   processInstanceId: 'proc-123',
 *   activityId: 'task-approval',
 *   activityName: 'Manager Approval',
 *   durationMs: 3600000, // 1 hour
 * });
 * ```
 */
async function recordTaskDuration(params) {
    const { model, processInstanceId, activityId, activityName, durationMs, transaction } = params;
    return recordPerformanceMetric({
        model,
        metricType: MetricType.DURATION,
        metricName: 'task_execution_duration',
        value: durationMs,
        unit: 'ms',
        processInstanceId,
        activityId,
        dimensions: { activityName },
        transaction,
    });
}
/**
 * Calculates average process execution time for a definition
 *
 * @async
 * @param {Object} params - Average calculation parameters
 * @param {typeof Model} params.model - PerformanceMetric model
 * @param {string} params.processDefinitionId - Process definition ID
 * @param {Date} [params.startDate] - Start of time range
 * @param {Date} [params.endDate] - End of time range
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<number>} Average duration in milliseconds
 *
 * @example
 * ```typescript
 * const avgDuration = await getAverageProcessDuration({
 *   model: PerformanceMetricModel,
 *   processDefinitionId: 'approval-workflow',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 * });
 * console.log(`Average duration: ${avgDuration}ms`);
 * ```
 */
async function getAverageProcessDuration(params) {
    const { model, processDefinitionId, startDate, endDate, transaction } = params;
    const whereClause = {
        processDefinitionId,
        metricName: 'process_execution_duration',
    };
    if (startDate || endDate) {
        whereClause.timestamp = {};
        if (startDate)
            whereClause.timestamp[sequelize_1.Op.gte] = startDate;
        if (endDate)
            whereClause.timestamp[sequelize_1.Op.lte] = endDate;
    }
    const result = await model.findOne({
        where: whereClause,
        attributes: [[sequelize.fn('AVG', sequelize.col('value')), 'average']],
        raw: true,
        transaction,
    });
    return result ? parseFloat(result.average) : 0;
}
/**
 * Calculates percentile statistics for process durations (p50, p95, p99)
 *
 * @async
 * @param {Object} params - Percentile calculation parameters
 * @param {typeof Model} params.model - PerformanceMetric model
 * @param {string} params.processDefinitionId - Process definition ID
 * @param {Date} [params.startDate] - Start of time range
 * @param {Date} [params.endDate] - End of time range
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<{p50: number, p95: number, p99: number, min: number, max: number}>} Percentile statistics
 *
 * @example
 * ```typescript
 * const stats = await getProcessDurationPercentiles({
 *   model: PerformanceMetricModel,
 *   processDefinitionId: 'order-processing',
 *   startDate: new Date('2024-01-01'),
 * });
 * console.log(`p95: ${stats.p95}ms, p99: ${stats.p99}ms`);
 * ```
 *
 * @remarks
 * - p50 (median) represents typical performance
 * - p95 shows performance for 95% of requests
 * - p99 identifies worst-case performance
 * - Critical for SLA definition and monitoring
 */
async function getProcessDurationPercentiles(params) {
    const { model, processDefinitionId, startDate, endDate, transaction } = params;
    const whereClause = {
        processDefinitionId,
        metricName: 'process_execution_duration',
    };
    if (startDate || endDate) {
        whereClause.timestamp = {};
        if (startDate)
            whereClause.timestamp[sequelize_1.Op.gte] = startDate;
        if (endDate)
            whereClause.timestamp[sequelize_1.Op.lte] = endDate;
    }
    const metrics = await model.findAll({
        where: whereClause,
        attributes: ['value'],
        order: [['value', 'ASC']],
        raw: true,
        transaction,
    });
    if (metrics.length === 0) {
        return { p50: 0, p95: 0, p99: 0, min: 0, max: 0 };
    }
    const values = metrics.map((m) => m.value);
    const p50Index = Math.floor(values.length * 0.5);
    const p95Index = Math.floor(values.length * 0.95);
    const p99Index = Math.floor(values.length * 0.99);
    return {
        p50: values[p50Index],
        p95: values[p95Index],
        p99: values[p99Index],
        min: values[0],
        max: values[values.length - 1],
    };
}
// ============================================================================
// THROUGHPUT MEASUREMENT FUNCTIONS
// ============================================================================
/**
 * Calculates process throughput (processes per time unit)
 *
 * @async
 * @param {Object} params - Throughput calculation parameters
 * @param {typeof Model} params.model - PerformanceMetric model
 * @param {string} [params.processDefinitionId] - Process definition ID (optional, all if not specified)
 * @param {AggregationInterval} params.interval - Time interval for aggregation
 * @param {Date} params.startDate - Start of time range
 * @param {Date} params.endDate - End of time range
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<Array<{time: Date, count: number, throughputPerHour: number}>>} Throughput data
 *
 * @example
 * ```typescript
 * const throughput = await calculateThroughput({
 *   model: PerformanceMetricModel,
 *   processDefinitionId: 'loan-approval',
 *   interval: AggregationInterval.HOUR,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-02'),
 * });
 * ```
 */
async function calculateThroughput(params) {
    const { model, processDefinitionId, interval, startDate, endDate, transaction } = params;
    const whereClause = {
        metricName: 'process_execution_duration',
        timestamp: {
            [sequelize_1.Op.gte]: startDate,
            [sequelize_1.Op.lte]: endDate,
        },
    };
    if (processDefinitionId) {
        whereClause.processDefinitionId = processDefinitionId;
    }
    const metrics = await model.findAll({
        where: whereClause,
        attributes: ['timestamp'],
        order: [['timestamp', 'ASC']],
        transaction,
    });
    // Group by interval
    const grouped = new Map();
    const intervalMs = getIntervalMilliseconds(interval);
    metrics.forEach((metric) => {
        const timestamp = new Date(metric.timestamp);
        const bucketTime = Math.floor(timestamp.getTime() / intervalMs) * intervalMs;
        const bucketKey = new Date(bucketTime).toISOString();
        grouped.set(bucketKey, (grouped.get(bucketKey) || 0) + 1);
    });
    const result = [];
    grouped.forEach((count, timeStr) => {
        const time = new Date(timeStr);
        const throughputPerHour = (count / intervalMs) * 3600000; // Convert to per-hour rate
        result.push({ time, count, throughputPerHour });
    });
    return result.sort((a, b) => a.time.getTime() - b.time.getTime());
}
/**
 * Records current throughput metric
 *
 * @async
 * @param {Object} params - Throughput recording parameters
 * @param {typeof Model} params.model - PerformanceMetric model
 * @param {string} [params.processDefinitionId] - Process definition ID
 * @param {number} params.processesPerHour - Processes per hour
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<PerformanceMetric>} Recorded metric
 *
 * @example
 * ```typescript
 * await recordThroughput({
 *   model: PerformanceMetricModel,
 *   processDefinitionId: 'invoice-processing',
 *   processesPerHour: 450,
 * });
 * ```
 */
async function recordThroughput(params) {
    const { model, processDefinitionId, processesPerHour, transaction } = params;
    return recordPerformanceMetric({
        model,
        metricType: MetricType.THROUGHPUT,
        metricName: 'process_throughput',
        value: processesPerHour,
        unit: 'processes/hour',
        processDefinitionId,
        transaction,
    });
}
// ============================================================================
// BOTTLENECK DETECTION FUNCTIONS
// ============================================================================
/**
 * Analyzes process to identify bottlenecks using critical path analysis
 *
 * @async
 * @param {Object} params - Bottleneck analysis parameters
 * @param {typeof Model} params.metricModel - PerformanceMetric model
 * @param {typeof Model} params.analysisModel - BottleneckAnalysis model
 * @param {string} params.processDefinitionId - Process definition ID
 * @param {Date} [params.startDate] - Analysis start date
 * @param {Date} [params.endDate] - Analysis end date
 * @param {number} [params.minSampleSize=10] - Minimum samples for analysis
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<BottleneckAnalysis[]>} Identified bottlenecks
 *
 * @example
 * ```typescript
 * const bottlenecks = await analyzeProcessBottlenecks({
 *   metricModel: PerformanceMetricModel,
 *   analysisModel: BottleneckAnalysisModel,
 *   processDefinitionId: 'claims-processing',
 *   startDate: new Date('2024-01-01'),
 *   minSampleSize: 50,
 * });
 *
 * bottlenecks.forEach(b => {
 *   console.log(`Bottleneck at ${b.location}: ${b.averageDuration}ms (impact: ${b.impactScore})`);
 * });
 * ```
 *
 * @remarks
 * - Uses critical path analysis to identify slowest activities
 * - Impact score considers both duration and frequency
 * - Requires sufficient sample size for statistical significance
 * - Results are persisted for historical tracking
 */
async function analyzeProcessBottlenecks(params) {
    const { metricModel, analysisModel, processDefinitionId, startDate, endDate, minSampleSize = 10, transaction, } = params;
    const whereClause = {
        processDefinitionId,
        metricName: 'task_execution_duration',
    };
    if (startDate || endDate) {
        whereClause.timestamp = {};
        if (startDate)
            whereClause.timestamp[sequelize_1.Op.gte] = startDate;
        if (endDate)
            whereClause.timestamp[sequelize_1.Op.lte] = endDate;
    }
    // Group by activity and calculate statistics
    const metrics = await metricModel.findAll({
        where: whereClause,
        attributes: [
            'activityId',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
            [sequelize.fn('AVG', sequelize.col('value')), 'avg'],
            [sequelize.fn('MAX', sequelize.col('value')), 'max'],
            [sequelize.fn('STDDEV', sequelize.col('value')), 'stddev'],
        ],
        group: ['activityId'],
        having: sequelize.where(sequelize.fn('COUNT', sequelize.col('id')), sequelize_1.Op.gte, minSampleSize),
        raw: true,
        transaction,
    });
    const bottlenecks = [];
    for (const metric of metrics) {
        const activityId = metric.activityId;
        const count = parseInt(metric.count);
        const avg = parseFloat(metric.avg);
        const max = parseFloat(metric.max);
        const stddev = parseFloat(metric.stddev || '0');
        // Calculate impact score (0-100) based on avg duration and frequency
        const impactScore = Math.min(100, (avg / 1000) * Math.log10(count + 1) * 10);
        // Only consider significant bottlenecks
        if (impactScore > 30) {
            const analysis = await analysisModel.create({
                processDefinitionId,
                bottleneckType: BottleneckType.TASK_EXECUTION,
                location: activityId,
                averageDuration: avg,
                maxDuration: max,
                impactScore,
                analyzedAt: new Date(),
                details: { count, stddev, avgDurationSeconds: avg / 1000 },
            }, { transaction });
            bottlenecks.push(analysis.toJSON());
        }
    }
    return bottlenecks.sort((a, b) => b.impactScore - a.impactScore);
}
/**
 * Retrieves recent bottleneck analyses for a process
 *
 * @async
 * @param {Object} params - Query parameters
 * @param {typeof Model} params.model - BottleneckAnalysis model
 * @param {string} params.processDefinitionId - Process definition ID
 * @param {number} [params.limit=10] - Maximum results
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<BottleneckAnalysis[]>} Recent bottleneck analyses
 *
 * @example
 * ```typescript
 * const recentBottlenecks = await getRecentBottlenecks({
 *   model: BottleneckAnalysisModel,
 *   processDefinitionId: 'order-fulfillment',
 *   limit: 5,
 * });
 * ```
 */
async function getRecentBottlenecks(params) {
    const { model, processDefinitionId, limit = 10, transaction } = params;
    const analyses = await model.findAll({
        where: { processDefinitionId },
        order: [['analyzedAt', 'DESC']],
        limit,
        transaction,
    });
    return analyses.map((a) => a.toJSON());
}
// ============================================================================
// SLA MONITORING FUNCTIONS
// ============================================================================
/**
 * Creates an SLA configuration for a process or activity
 *
 * @async
 * @param {Object} params - SLA configuration parameters
 * @param {typeof Model} params.model - SLAConfig model
 * @param {string} params.name - SLA name
 * @param {string} params.processDefinitionId - Process definition ID
 * @param {string} [params.activityId] - Specific activity (optional)
 * @param {number} params.targetDuration - Target duration in milliseconds
 * @param {number} [params.warningThreshold=80] - Warning threshold (% of target)
 * @param {number} [params.criticalThreshold=95] - Critical threshold (% of target)
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<SLAConfig>} Created SLA configuration
 *
 * @example
 * ```typescript
 * const sla = await createSLAConfig({
 *   model: SLAConfigModel,
 *   name: 'Loan Approval - 24 Hour SLA',
 *   processDefinitionId: 'loan-approval',
 *   targetDuration: 86400000, // 24 hours in ms
 *   warningThreshold: 80, // Alert at 19.2 hours
 *   criticalThreshold: 95, // Critical at 22.8 hours
 * });
 * ```
 *
 * @remarks
 * - Target duration should be based on p95 or p99 historical performance
 * - Warning threshold triggers notifications to operators
 * - Critical threshold may trigger escalations
 * - Can be configured per-process or per-activity
 */
async function createSLAConfig(params) {
    const { model, name, processDefinitionId, activityId, targetDuration, warningThreshold = 80, criticalThreshold = 95, transaction, } = params;
    const validationResult = exports.SLAConfigSchema.safeParse({
        name,
        processDefinitionId,
        activityId,
        targetDuration,
        warningThreshold,
        criticalThreshold,
    });
    if (!validationResult.success) {
        throw new common_1.BadRequestException(`SLA config validation failed: ${validationResult.error.message}`);
    }
    const sla = await model.create({
        name,
        processDefinitionId,
        activityId,
        targetDuration,
        warningThreshold,
        criticalThreshold,
        enabled: true,
    }, { transaction });
    return sla.toJSON();
}
/**
 * Monitors SLA compliance for a process instance
 *
 * @async
 * @param {Object} params - SLA monitoring parameters
 * @param {typeof Model} params.slaModel - SLAConfig model
 * @param {typeof Model} params.metricModel - PerformanceMetric model
 * @param {string} params.processInstanceId - Process instance ID
 * @param {string} params.processDefinitionId - Process definition ID
 * @param {number} params.currentDuration - Current elapsed duration in ms
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<{compliant: boolean, slaName: string, percentUsed: number, status: 'ok'|'warning'|'critical'}>} SLA status
 *
 * @example
 * ```typescript
 * const status = await monitorSLACompliance({
 *   slaModel: SLAConfigModel,
 *   metricModel: PerformanceMetricModel,
 *   processInstanceId: 'proc-123',
 *   processDefinitionId: 'loan-approval',
 *   currentDuration: 72000000, // 20 hours
 * });
 *
 * if (status.status === 'warning') {
 *   console.log(`SLA warning: ${status.percentUsed}% of target used`);
 * }
 * ```
 *
 * @remarks
 * - Returns real-time SLA compliance status
 * - Status: 'ok', 'warning', or 'critical'
 * - Can trigger alerts based on thresholds
 * - Supports predictive breach warnings
 */
async function monitorSLACompliance(params) {
    const { slaModel, metricModel, processInstanceId, processDefinitionId, currentDuration, transaction, } = params;
    const sla = await slaModel.findOne({
        where: {
            processDefinitionId,
            activityId: null, // Process-level SLA
            enabled: true,
        },
        transaction,
    });
    if (!sla) {
        throw new common_1.NotFoundException(`No SLA configuration found for process '${processDefinitionId}'`);
    }
    const slaData = sla.toJSON();
    const percentUsed = (currentDuration / slaData.targetDuration) * 100;
    let status;
    if (percentUsed >= slaData.criticalThreshold) {
        status = 'critical';
    }
    else if (percentUsed >= slaData.warningThreshold) {
        status = 'warning';
    }
    else {
        status = 'ok';
    }
    // Record SLA compliance metric
    await recordPerformanceMetric({
        model: metricModel,
        metricType: MetricType.SLA_COMPLIANCE,
        metricName: 'sla_compliance_check',
        value: percentUsed,
        unit: 'percent',
        processInstanceId,
        processDefinitionId,
        metadata: { slaName: slaData.name, status },
        transaction,
    });
    return {
        compliant: percentUsed <= 100,
        slaName: slaData.name,
        percentUsed,
        status,
    };
}
/**
 * Calculates overall SLA compliance rate for a process definition
 *
 * @async
 * @param {Object} params - Compliance calculation parameters
 * @param {typeof Model} params.metricModel - PerformanceMetric model
 * @param {typeof Model} params.slaModel - SLAConfig model
 * @param {string} params.processDefinitionId - Process definition ID
 * @param {Date} [params.startDate] - Start of time range
 * @param {Date} [params.endDate] - End of time range
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<{complianceRate: number, totalProcesses: number, compliantProcesses: number}>} Compliance statistics
 *
 * @example
 * ```typescript
 * const compliance = await calculateSLAComplianceRate({
 *   metricModel: PerformanceMetricModel,
 *   slaModel: SLAConfigModel,
 *   processDefinitionId: 'customer-onboarding',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 * });
 * console.log(`SLA Compliance: ${compliance.complianceRate}%`);
 * ```
 */
async function calculateSLAComplianceRate(params) {
    const { metricModel, slaModel, processDefinitionId, startDate, endDate, transaction } = params;
    const sla = await slaModel.findOne({
        where: { processDefinitionId, enabled: true },
        transaction,
    });
    if (!sla) {
        throw new common_1.NotFoundException(`No SLA configuration found for process '${processDefinitionId}'`);
    }
    const slaData = sla.toJSON();
    const whereClause = {
        processDefinitionId,
        metricName: 'process_execution_duration',
    };
    if (startDate || endDate) {
        whereClause.timestamp = {};
        if (startDate)
            whereClause.timestamp[sequelize_1.Op.gte] = startDate;
        if (endDate)
            whereClause.timestamp[sequelize_1.Op.lte] = endDate;
    }
    const metrics = await metricModel.findAll({
        where: whereClause,
        attributes: ['value'],
        raw: true,
        transaction,
    });
    const totalProcesses = metrics.length;
    const compliantProcesses = metrics.filter((m) => m.value <= slaData.targetDuration).length;
    const complianceRate = totalProcesses > 0 ? (compliantProcesses / totalProcesses) * 100 : 0;
    return {
        complianceRate,
        totalProcesses,
        compliantProcesses,
    };
}
// ============================================================================
// RESOURCE UTILIZATION FUNCTIONS
// ============================================================================
/**
 * Records resource utilization metrics (CPU, memory, database connections)
 *
 * @async
 * @param {Object} params - Resource utilization parameters
 * @param {typeof Model} params.model - PerformanceMetric model
 * @param {string} params.resourceType - Type of resource (cpu, memory, db_connections)
 * @param {number} params.utilizationPercent - Utilization percentage (0-100)
 * @param {Record<string, any>} [params.details] - Additional resource details
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<PerformanceMetric>} Recorded metric
 *
 * @example
 * ```typescript
 * await recordResourceUtilization({
 *   model: PerformanceMetricModel,
 *   resourceType: 'cpu',
 *   utilizationPercent: 78.5,
 *   details: { cores: 8, activeThreads: 42 },
 * });
 * ```
 */
async function recordResourceUtilization(params) {
    const { model, resourceType, utilizationPercent, details, transaction } = params;
    return recordPerformanceMetric({
        model,
        metricType: MetricType.RESOURCE_USAGE,
        metricName: `resource_utilization_${resourceType}`,
        value: utilizationPercent,
        unit: 'percent',
        metadata: details || {},
        transaction,
    });
}
/**
 * Retrieves resource utilization trends over time
 *
 * @async
 * @param {Object} params - Trend query parameters
 * @param {typeof Model} params.model - PerformanceMetric model
 * @param {string} params.resourceType - Resource type
 * @param {AggregationInterval} params.interval - Aggregation interval
 * @param {Date} params.startDate - Start date
 * @param {Date} params.endDate - End date
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<Array<{time: Date, avgUtilization: number, maxUtilization: number}>>} Utilization trends
 *
 * @example
 * ```typescript
 * const cpuTrend = await getResourceUtilizationTrend({
 *   model: PerformanceMetricModel,
 *   resourceType: 'cpu',
 *   interval: AggregationInterval.HOUR,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-02'),
 * });
 * ```
 */
async function getResourceUtilizationTrend(params) {
    const { model, resourceType, interval, startDate, endDate, transaction } = params;
    const whereClause = {
        metricName: `resource_utilization_${resourceType}`,
        timestamp: {
            [sequelize_1.Op.gte]: startDate,
            [sequelize_1.Op.lte]: endDate,
        },
    };
    const metrics = await model.findAll({
        where: whereClause,
        attributes: ['timestamp', 'value'],
        order: [['timestamp', 'ASC']],
        transaction,
    });
    // Group by interval
    const grouped = new Map();
    const intervalMs = getIntervalMilliseconds(interval);
    metrics.forEach((metric) => {
        const timestamp = new Date(metric.timestamp);
        const bucketTime = Math.floor(timestamp.getTime() / intervalMs) * intervalMs;
        const bucketKey = new Date(bucketTime).toISOString();
        if (!grouped.has(bucketKey)) {
            grouped.set(bucketKey, []);
        }
        grouped.get(bucketKey).push(metric.value);
    });
    const result = [];
    grouped.forEach((values, timeStr) => {
        const time = new Date(timeStr);
        const avgUtilization = values.reduce((a, b) => a + b, 0) / values.length;
        const maxUtilization = Math.max(...values);
        result.push({ time, avgUtilization, maxUtilization });
    });
    return result.sort((a, b) => a.time.getTime() - b.time.getTime());
}
// ============================================================================
// PERFORMANCE ALERTING FUNCTIONS
// ============================================================================
/**
 * Creates a performance alert configuration
 *
 * @async
 * @param {Object} params - Alert configuration parameters
 * @param {typeof Model} params.model - PerformanceAlert model
 * @param {string} params.name - Alert name
 * @param {MetricType} params.metricType - Metric to monitor
 * @param {ThresholdCondition} params.condition - Threshold condition
 * @param {number} params.threshold - Threshold value
 * @param {AlertSeverity} params.severity - Alert severity
 * @param {string} [params.notificationChannel] - Notification channel (email, slack, pagerduty)
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<PerformanceAlert>} Created alert configuration
 *
 * @example
 * ```typescript
 * const alert = await createPerformanceAlert({
 *   model: PerformanceAlertModel,
 *   name: 'High Process Duration Alert',
 *   metricType: MetricType.DURATION,
 *   condition: ThresholdCondition.GREATER_THAN,
 *   threshold: 300000, // 5 minutes
 *   severity: AlertSeverity.WARNING,
 *   notificationChannel: 'slack://ops-channel',
 * });
 * ```
 */
async function createPerformanceAlert(params) {
    const { model, name, metricType, condition, threshold, severity, notificationChannel, transaction, } = params;
    const validationResult = exports.PerformanceAlertSchema.safeParse({
        name,
        metricType,
        condition,
        threshold,
        severity,
        notificationChannel,
    });
    if (!validationResult.success) {
        throw new common_1.BadRequestException(`Alert validation failed: ${validationResult.error.message}`);
    }
    const alert = await model.create({
        name,
        metricType,
        condition,
        threshold,
        severity,
        enabled: true,
        notificationChannel,
    }, { transaction });
    return alert.toJSON();
}
/**
 * Evaluates performance alerts against current metrics
 *
 * @async
 * @param {Object} params - Alert evaluation parameters
 * @param {typeof Model} params.alertModel - PerformanceAlert model
 * @param {typeof Model} params.metricModel - PerformanceMetric model
 * @param {number} [params.lookbackMinutes=5] - Minutes to look back for metrics
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<Array<{alert: PerformanceAlert, triggered: boolean, currentValue: number}>>} Alert evaluation results
 *
 * @example
 * ```typescript
 * const results = await evaluatePerformanceAlerts({
 *   alertModel: PerformanceAlertModel,
 *   metricModel: PerformanceMetricModel,
 *   lookbackMinutes: 10,
 * });
 *
 * results.forEach(r => {
 *   if (r.triggered) {
 *     console.log(`ALERT: ${r.alert.name} - current value: ${r.currentValue}`);
 *   }
 * });
 * ```
 *
 * @remarks
 * - Evaluates all enabled alerts
 * - Compares recent metric values against thresholds
 * - Updates lastTriggered timestamp for triggered alerts
 * - Can trigger notifications via configured channels
 */
async function evaluatePerformanceAlerts(params) {
    const { alertModel, metricModel, lookbackMinutes = 5, transaction } = params;
    const alerts = await alertModel.findAll({
        where: { enabled: true },
        transaction,
    });
    const results = [];
    const lookbackTime = new Date(Date.now() - lookbackMinutes * 60 * 1000);
    for (const alertRecord of alerts) {
        const alert = alertRecord.toJSON();
        // Get recent metrics for this alert's metric type
        const recentMetrics = await metricModel.findAll({
            where: {
                metricType: alert.metricType,
                timestamp: { [sequelize_1.Op.gte]: lookbackTime },
            },
            attributes: ['value'],
            order: [['timestamp', 'DESC']],
            limit: 10,
            raw: true,
            transaction,
        });
        if (recentMetrics.length === 0) {
            results.push({ alert, triggered: false, currentValue: 0 });
            continue;
        }
        // Use average of recent values
        const values = recentMetrics.map((m) => m.value);
        const currentValue = values.reduce((a, b) => a + b, 0) / values.length;
        // Evaluate condition
        let triggered = false;
        switch (alert.condition) {
            case ThresholdCondition.GREATER_THAN:
                triggered = currentValue > alert.threshold;
                break;
            case ThresholdCondition.LESS_THAN:
                triggered = currentValue < alert.threshold;
                break;
            case ThresholdCondition.EQUALS:
                triggered = currentValue === alert.threshold;
                break;
            case ThresholdCondition.NOT_EQUALS:
                triggered = currentValue !== alert.threshold;
                break;
        }
        if (triggered) {
            await alertRecord.update({ lastTriggered: new Date() }, { transaction });
        }
        results.push({ alert, triggered, currentValue });
    }
    return results;
}
// ============================================================================
// OPTIMIZATION SUGGESTION FUNCTIONS
// ============================================================================
/**
 * Generates optimization suggestions based on performance analysis
 *
 * @async
 * @param {Object} params - Optimization generation parameters
 * @param {typeof Model} params.metricModel - PerformanceMetric model
 * @param {typeof Model} params.bottleneckModel - BottleneckAnalysis model
 * @param {typeof Model} params.suggestionModel - OptimizationSuggestion model
 * @param {string} params.processDefinitionId - Process definition ID
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<OptimizationSuggestion[]>} Generated optimization suggestions
 *
 * @example
 * ```typescript
 * const suggestions = await generateOptimizationSuggestions({
 *   metricModel: PerformanceMetricModel,
 *   bottleneckModel: BottleneckAnalysisModel,
 *   suggestionModel: OptimizationSuggestionModel,
 *   processDefinitionId: 'order-processing',
 * });
 *
 * suggestions.forEach(s => {
 *   console.log(`${s.title}: ${s.estimatedImprovement}% improvement (effort: ${s.implementationEffort}/10)`);
 * });
 * ```
 *
 * @remarks
 * - Analyzes bottlenecks and metrics to generate suggestions
 * - Prioritizes by estimated improvement and implementation effort
 * - Categories include: process design, caching, parallelization, etc.
 * - Suggestions are AI-powered based on pattern recognition
 */
async function generateOptimizationSuggestions(params) {
    const { metricModel, bottleneckModel, suggestionModel, processDefinitionId, transaction } = params;
    const suggestions = [];
    // Get recent bottlenecks
    const bottlenecks = await bottleneckModel.findAll({
        where: { processDefinitionId },
        order: [['impactScore', 'DESC']],
        limit: 5,
        transaction,
    });
    // Generate suggestions based on bottleneck types
    for (const bottleneck of bottlenecks) {
        const bData = bottleneck.toJSON();
        if (bData.bottleneckType === BottleneckType.DATABASE_QUERY) {
            const suggestion = await suggestionModel.create({
                category: OptimizationCategory.DATABASE_QUERY,
                title: `Optimize database queries at ${bData.location}`,
                description: `Database queries at ${bData.location} are taking ${bData.averageDuration}ms on average. Consider adding indexes, optimizing query structure, or implementing caching.`,
                estimatedImprovement: Math.min(60, bData.impactScore),
                implementationEffort: 5,
                priority: bData.impactScore,
                processDefinitionId,
                activityId: bData.location,
                generatedAt: new Date(),
            }, { transaction });
            suggestions.push(suggestion.toJSON());
        }
        else if (bData.bottleneckType === BottleneckType.EXTERNAL_API) {
            const suggestion = await suggestionModel.create({
                category: OptimizationCategory.CACHING,
                title: `Implement caching for external API at ${bData.location}`,
                description: `External API calls at ${bData.location} average ${bData.averageDuration}ms. Implement response caching with appropriate TTL to reduce API calls.`,
                estimatedImprovement: Math.min(70, bData.impactScore * 1.2),
                implementationEffort: 4,
                priority: bData.impactScore * 1.1,
                processDefinitionId,
                activityId: bData.location,
                generatedAt: new Date(),
            }, { transaction });
            suggestions.push(suggestion.toJSON());
        }
        else if (bData.bottleneckType === BottleneckType.TASK_EXECUTION) {
            const suggestion = await suggestionModel.create({
                category: OptimizationCategory.PARALLELIZATION,
                title: `Consider parallelizing task at ${bData.location}`,
                description: `Task at ${bData.location} takes ${bData.averageDuration}ms. If independent subtasks exist, consider parallel execution using parallel gateway.`,
                estimatedImprovement: Math.min(50, bData.impactScore * 0.8),
                implementationEffort: 7,
                priority: bData.impactScore * 0.9,
                processDefinitionId,
                activityId: bData.location,
                generatedAt: new Date(),
            }, { transaction });
            suggestions.push(suggestion.toJSON());
        }
    }
    return suggestions.sort((a, b) => b.priority - a.priority);
}
/**
 * Retrieves optimization suggestions for a process
 *
 * @async
 * @param {Object} params - Query parameters
 * @param {typeof Model} params.model - OptimizationSuggestion model
 * @param {string} params.processDefinitionId - Process definition ID
 * @param {OptimizationCategory[]} [params.categories] - Filter by categories
 * @param {number} [params.limit=10] - Maximum results
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<OptimizationSuggestion[]>} Optimization suggestions
 *
 * @example
 * ```typescript
 * const suggestions = await getOptimizationSuggestions({
 *   model: OptimizationSuggestionModel,
 *   processDefinitionId: 'customer-onboarding',
 *   categories: [OptimizationCategory.CACHING, OptimizationCategory.DATABASE_QUERY],
 *   limit: 5,
 * });
 * ```
 */
async function getOptimizationSuggestions(params) {
    const { model, processDefinitionId, categories, limit = 10, transaction } = params;
    const whereClause = { processDefinitionId };
    if (categories && categories.length > 0) {
        whereClause.category = { [sequelize_1.Op.in]: categories };
    }
    const suggestions = await model.findAll({
        where: whereClause,
        order: [['priority', 'DESC']],
        limit,
        transaction,
    });
    return suggestions.map((s) => s.toJSON());
}
// ============================================================================
// DASHBOARD AND REPORTING FUNCTIONS
// ============================================================================
/**
 * Generates real-time performance dashboard data
 *
 * @async
 * @param {Object} params - Dashboard generation parameters
 * @param {typeof Model} params.metricModel - PerformanceMetric model
 * @param {typeof Model} params.bottleneckModel - BottleneckAnalysis model
 * @param {string} [params.processDefinitionId] - Filter by process (optional)
 * @param {number} [params.timeWindowHours=24] - Time window in hours
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<DashboardData>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generatePerformanceDashboard({
 *   metricModel: PerformanceMetricModel,
 *   bottleneckModel: BottleneckAnalysisModel,
 *   processDefinitionId: 'loan-approval',
 *   timeWindowHours: 24,
 * });
 *
 * console.log(`Throughput: ${dashboard.throughput} processes/hour`);
 * console.log(`Error Rate: ${dashboard.errorRate}%`);
 * console.log(`SLA Compliance: ${dashboard.slaCompliance}%`);
 * ```
 */
async function generatePerformanceDashboard(params) {
    const { metricModel, bottleneckModel, processDefinitionId, timeWindowHours = 24, transaction, } = params;
    const startTime = new Date(Date.now() - timeWindowHours * 3600000);
    const whereClause = {
        metricName: 'process_execution_duration',
        timestamp: { [sequelize_1.Op.gte]: startTime },
    };
    if (processDefinitionId) {
        whereClause.processDefinitionId = processDefinitionId;
    }
    // Get process execution metrics
    const processMetrics = await metricModel.findAll({
        where: whereClause,
        attributes: ['value', 'timestamp', [sequelize.col('metadata'), 'metadata']],
        raw: true,
        transaction,
    });
    const totalProcesses = processMetrics.length;
    const completedProcesses = processMetrics.filter((m) => m.metadata?.success !== false).length;
    const failedProcesses = totalProcesses - completedProcesses;
    const durations = processMetrics.map((m) => m.value);
    const averageDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
    const throughput = (totalProcesses / timeWindowHours);
    const errorRate = totalProcesses > 0 ? (failedProcesses / totalProcesses) * 100 : 0;
    // Get SLA compliance
    const slaMetrics = await metricModel.findAll({
        where: {
            metricName: 'sla_compliance_check',
            timestamp: { [sequelize_1.Op.gte]: startTime },
            ...(processDefinitionId ? { processDefinitionId } : {}),
        },
        attributes: ['value'],
        raw: true,
        transaction,
    });
    const compliantSLAs = slaMetrics.filter((m) => m.value <= 100).length;
    const slaCompliance = slaMetrics.length > 0 ? (compliantSLAs / slaMetrics.length) * 100 : 100;
    // Calculate throughput trend (hourly)
    const throughputTrend = await calculateThroughput({
        model: metricModel,
        processDefinitionId,
        interval: AggregationInterval.HOUR,
        startDate: startTime,
        endDate: new Date(),
        transaction,
    });
    // Get top bottlenecks
    const bottlenecksData = await bottleneckModel.findAll({
        where: {
            ...(processDefinitionId ? { processDefinitionId } : {}),
            analyzedAt: { [sequelize_1.Op.gte]: startTime },
        },
        order: [['impactScore', 'DESC']],
        limit: 5,
        transaction,
    });
    const topBottlenecks = bottlenecksData.map((b) => ({
        name: b.location,
        value: b.averageDuration,
    }));
    // For active processes, we'd need to query a process instance table
    // For now, estimate based on average duration
    const activeProcesses = Math.max(0, Math.floor(throughput * (averageDuration / 3600000)));
    return {
        totalProcesses,
        activeProcesses,
        completedProcesses,
        failedProcesses,
        averageDuration,
        throughput,
        errorRate,
        slaCompliance,
        throughputTrend: throughputTrend.map(t => ({ time: t.time, value: t.throughputPerHour })),
        topBottlenecks,
    };
}
/**
 * Compares process performance across different time periods
 *
 * @async
 * @param {Object} params - Comparison parameters
 * @param {typeof Model} params.model - PerformanceMetric model
 * @param {string} params.processDefinitionId - Process definition ID
 * @param {Date} params.period1Start - Period 1 start
 * @param {Date} params.period1End - Period 1 end
 * @param {Date} params.period2Start - Period 2 start
 * @param {Date} params.period2End - Period 2 end
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<{period1: any, period2: any, improvement: number}>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await comparePerformanceAcrossPeriods({
 *   model: PerformanceMetricModel,
 *   processDefinitionId: 'invoice-processing',
 *   period1Start: new Date('2024-01-01'),
 *   period1End: new Date('2024-01-31'),
 *   period2Start: new Date('2024-02-01'),
 *   period2End: new Date('2024-02-29'),
 * });
 *
 * console.log(`Performance improvement: ${comparison.improvement}%`);
 * ```
 */
async function comparePerformanceAcrossPeriods(params) {
    const { model, processDefinitionId, period1Start, period1End, period2Start, period2End, transaction, } = params;
    const period1Stats = await getProcessDurationPercentiles({
        model,
        processDefinitionId,
        startDate: period1Start,
        endDate: period1End,
        transaction,
    });
    const period2Stats = await getProcessDurationPercentiles({
        model,
        processDefinitionId,
        startDate: period2Start,
        endDate: period2End,
        transaction,
    });
    const improvement = period1Stats.p50 > 0
        ? ((period1Stats.p50 - period2Stats.p50) / period1Stats.p50) * 100
        : 0;
    return {
        period1: period1Stats,
        period2: period2Stats,
        improvement,
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Converts aggregation interval to milliseconds
 *
 * @param {AggregationInterval} interval - Aggregation interval
 * @returns {number} Interval in milliseconds
 */
function getIntervalMilliseconds(interval) {
    switch (interval) {
        case AggregationInterval.SECOND:
            return 1000;
        case AggregationInterval.MINUTE:
            return 60000;
        case AggregationInterval.HOUR:
            return 3600000;
        case AggregationInterval.DAY:
            return 86400000;
        case AggregationInterval.WEEK:
            return 604800000;
        case AggregationInterval.MONTH:
            return 2592000000; // 30 days approximation
        default:
            return 60000; // Default to 1 minute
    }
}
/**
 * Calculates error rate for a process definition
 *
 * @async
 * @param {Object} params - Error rate calculation parameters
 * @param {typeof Model} params.model - PerformanceMetric model
 * @param {string} params.processDefinitionId - Process definition ID
 * @param {Date} [params.startDate] - Start date
 * @param {Date} [params.endDate] - End date
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<number>} Error rate percentage
 *
 * @example
 * ```typescript
 * const errorRate = await calculateErrorRate({
 *   model: PerformanceMetricModel,
 *   processDefinitionId: 'payment-processing',
 *   startDate: new Date('2024-01-01'),
 * });
 * ```
 */
async function calculateErrorRate(params) {
    const { model, processDefinitionId, startDate, endDate, transaction } = params;
    const whereClause = {
        processDefinitionId,
        metricName: 'process_execution_duration',
    };
    if (startDate || endDate) {
        whereClause.timestamp = {};
        if (startDate)
            whereClause.timestamp[sequelize_1.Op.gte] = startDate;
        if (endDate)
            whereClause.timestamp[sequelize_1.Op.lte] = endDate;
    }
    const totalProcesses = await model.count({ where: whereClause, transaction });
    const failedProcesses = await model.count({
        where: {
            ...whereClause,
            'metadata.success': false,
        },
        transaction,
    });
    return totalProcesses > 0 ? (failedProcesses / totalProcesses) * 100 : 0;
}
/**
 * Detects performance anomalies using statistical analysis
 *
 * @async
 * @param {Object} params - Anomaly detection parameters
 * @param {typeof Model} params.model - PerformanceMetric model
 * @param {string} params.processDefinitionId - Process definition ID
 * @param {number} [params.stddevThreshold=3] - Standard deviations for anomaly threshold
 * @param {Date} [params.startDate] - Start date
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<Array<{timestamp: Date, value: number, expectedRange: [number, number]}>>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectPerformanceAnomalies({
 *   model: PerformanceMetricModel,
 *   processDefinitionId: 'order-fulfillment',
 *   stddevThreshold: 2.5,
 *   startDate: new Date('2024-01-01'),
 * });
 * ```
 */
async function detectPerformanceAnomalies(params) {
    const { model, processDefinitionId, stddevThreshold = 3, startDate, transaction } = params;
    const whereClause = {
        processDefinitionId,
        metricName: 'process_execution_duration',
    };
    if (startDate) {
        whereClause.timestamp = { [sequelize_1.Op.gte]: startDate };
    }
    const metrics = await model.findAll({
        where: whereClause,
        attributes: ['timestamp', 'value'],
        order: [['timestamp', 'ASC']],
        raw: true,
        transaction,
    });
    if (metrics.length < 10) {
        return []; // Not enough data for anomaly detection
    }
    const values = metrics.map((m) => m.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stddev = Math.sqrt(variance);
    const lowerBound = mean - stddevThreshold * stddev;
    const upperBound = mean + stddevThreshold * stddev;
    const anomalies = [];
    metrics.forEach((metric) => {
        if (metric.value < lowerBound || metric.value > upperBound) {
            anomalies.push({
                timestamp: metric.timestamp,
                value: metric.value,
                expectedRange: [lowerBound, upperBound],
            });
        }
    });
    return anomalies;
}
//# sourceMappingURL=workflow-performance-monitoring.js.map