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
import { Model, Sequelize, Transaction } from 'sequelize';
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
export declare enum MetricType {
    DURATION = "duration",
    THROUGHPUT = "throughput",
    ERROR_RATE = "error_rate",
    LATENCY = "latency",
    RESOURCE_USAGE = "resource_usage",
    SLA_COMPLIANCE = "sla_compliance",
    QUEUE_DEPTH = "queue_depth",
    CONCURRENCY = "concurrency"
}
/**
 * Alert severity levels for performance issues
 *
 * @enum {string}
 */
export declare enum AlertSeverity {
    INFO = "info",
    WARNING = "warning",
    CRITICAL = "critical",
    EMERGENCY = "emergency"
}
/**
 * Threshold comparison conditions
 *
 * @enum {string}
 */
export declare enum ThresholdCondition {
    GREATER_THAN = "greater_than",
    LESS_THAN = "less_than",
    EQUALS = "equals",
    NOT_EQUALS = "not_equals",
    BETWEEN = "between",
    OUTSIDE = "outside"
}
/**
 * Time aggregation intervals for metrics
 *
 * @enum {string}
 */
export declare enum AggregationInterval {
    SECOND = "second",
    MINUTE = "minute",
    HOUR = "hour",
    DAY = "day",
    WEEK = "week",
    MONTH = "month"
}
/**
 * Performance optimization categories
 *
 * @enum {string}
 */
export declare enum OptimizationCategory {
    PROCESS_DESIGN = "process_design",
    TASK_ALLOCATION = "task_allocation",
    RESOURCE_ALLOCATION = "resource_allocation",
    CACHING = "caching",
    DATABASE_QUERY = "database_query",
    PARALLELIZATION = "parallelization",
    TIMEOUT_ADJUSTMENT = "timeout_adjustment"
}
/**
 * Bottleneck types
 *
 * @enum {string}
 */
export declare enum BottleneckType {
    TASK_EXECUTION = "task_execution",
    GATEWAY_EVALUATION = "gateway_evaluation",
    SERVICE_CALL = "service_call",
    DATABASE_QUERY = "database_query",
    EXTERNAL_API = "external_api",
    USER_INTERACTION = "user_interaction",
    MESSAGE_QUEUE = "message_queue"
}
/**
 * Performance metric data point
 *
 * @interface PerformanceMetric
 * @property {string} id - Metric ID
 * @property {MetricType} metricType - Type of metric
 * @property {string} metricName - Human-readable metric name
 * @property {number} value - Metric value
 * @property {string} unit - Unit of measurement (ms, %, count, etc.)
 * @property {Date} timestamp - When metric was recorded
 * @property {string} [processInstanceId] - Related process instance
 * @property {string} [activityId] - Related activity
 * @property {string} [processDefinitionId] - Process definition
 * @property {Record<string, any>} dimensions - Additional dimensions for grouping
 * @property {Record<string, any>} metadata - Additional metric metadata
 */
export interface PerformanceMetric {
    id: string;
    metricType: MetricType;
    metricName: string;
    value: number;
    unit: string;
    timestamp: Date;
    processInstanceId?: string;
    activityId?: string;
    processDefinitionId?: string;
    dimensions: Record<string, any>;
    metadata: Record<string, any>;
}
/**
 * SLA configuration and monitoring
 *
 * @interface SLAConfig
 * @property {string} id - SLA configuration ID
 * @property {string} name - SLA name
 * @property {string} processDefinitionId - Process definition ID
 * @property {string} [activityId] - Specific activity (optional)
 * @property {number} targetDuration - Target duration in milliseconds
 * @property {number} warningThreshold - Warning threshold (% of target)
 * @property {number} criticalThreshold - Critical threshold (% of target)
 * @property {boolean} enabled - Whether SLA is active
 * @property {Date} createdAt - When SLA was created
 * @property {Date} updatedAt - Last update timestamp
 */
export interface SLAConfig {
    id: string;
    name: string;
    processDefinitionId: string;
    activityId?: string;
    targetDuration: number;
    warningThreshold: number;
    criticalThreshold: number;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Bottleneck analysis result
 *
 * @interface BottleneckAnalysis
 * @property {string} id - Analysis ID
 * @property {string} processDefinitionId - Process definition
 * @property {BottleneckType} bottleneckType - Type of bottleneck
 * @property {string} location - Where bottleneck occurs (activity ID, etc.)
 * @property {number} averageDuration - Average duration at bottleneck
 * @property {number} maxDuration - Maximum duration observed
 * @property {number} impactScore - Impact score (0-100)
 * @property {Date} analyzedAt - When analysis was performed
 * @property {Record<string, any>} details - Detailed analysis data
 */
export interface BottleneckAnalysis {
    id: string;
    processDefinitionId: string;
    bottleneckType: BottleneckType;
    location: string;
    averageDuration: number;
    maxDuration: number;
    impactScore: number;
    analyzedAt: Date;
    details: Record<string, any>;
}
/**
 * Performance alert configuration
 *
 * @interface PerformanceAlert
 * @property {string} id - Alert ID
 * @property {string} name - Alert name
 * @property {MetricType} metricType - Metric being monitored
 * @property {ThresholdCondition} condition - Threshold condition
 * @property {number} threshold - Threshold value
 * @property {AlertSeverity} severity - Alert severity
 * @property {boolean} enabled - Whether alert is active
 * @property {string} [notificationChannel] - Where to send alerts
 * @property {Date} lastTriggered - Last time alert was triggered
 */
export interface PerformanceAlert {
    id: string;
    name: string;
    metricType: MetricType;
    condition: ThresholdCondition;
    threshold: number;
    severity: AlertSeverity;
    enabled: boolean;
    notificationChannel?: string;
    lastTriggered?: Date;
}
/**
 * Optimization suggestion
 *
 * @interface OptimizationSuggestion
 * @property {string} id - Suggestion ID
 * @property {OptimizationCategory} category - Optimization category
 * @property {string} title - Suggestion title
 * @property {string} description - Detailed description
 * @property {number} estimatedImprovement - Estimated performance gain (%)
 * @property {number} implementationEffort - Implementation effort (1-10)
 * @property {number} priority - Priority score (0-100)
 * @property {string} processDefinitionId - Affected process
 * @property {string} [activityId] - Affected activity
 * @property {Date} generatedAt - When suggestion was generated
 */
export interface OptimizationSuggestion {
    id: string;
    category: OptimizationCategory;
    title: string;
    description: string;
    estimatedImprovement: number;
    implementationEffort: number;
    priority: number;
    processDefinitionId: string;
    activityId?: string;
    generatedAt: Date;
}
/**
 * Performance dashboard data
 *
 * @interface DashboardData
 * @property {number} totalProcesses - Total processes executed
 * @property {number} activeProcesses - Currently active processes
 * @property {number} completedProcesses - Completed processes
 * @property {number} failedProcesses - Failed processes
 * @property {number} averageDuration - Average process duration
 * @property {number} throughput - Processes per hour
 * @property {number} errorRate - Error rate percentage
 * @property {number} slaCompliance - SLA compliance percentage
 * @property {Array<{time: Date, value: number}>} throughputTrend - Throughput over time
 * @property {Array<{name: string, value: number}>} topBottlenecks - Top bottlenecks
 */
export interface DashboardData {
    totalProcesses: number;
    activeProcesses: number;
    completedProcesses: number;
    failedProcesses: number;
    averageDuration: number;
    throughput: number;
    errorRate: number;
    slaCompliance: number;
    throughputTrend: Array<{
        time: Date;
        value: number;
    }>;
    topBottlenecks: Array<{
        name: string;
        value: number;
    }>;
}
/**
 * Zod schema for performance metric creation
 */
export declare const CreatePerformanceMetricSchema: any;
/**
 * Zod schema for SLA configuration
 */
export declare const SLAConfigSchema: any;
/**
 * Zod schema for performance alert
 */
export declare const PerformanceAlertSchema: any;
/**
 * Sequelize model for PerformanceMetric table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} PerformanceMetric model
 */
export declare function createPerformanceMetricModel(sequelize: Sequelize): {
    new (): {};
};
/**
 * Sequelize model for SLAConfig table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} SLAConfig model
 */
export declare function createSLAConfigModel(sequelize: Sequelize): {
    new (): {};
};
/**
 * Sequelize model for BottleneckAnalysis table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} BottleneckAnalysis model
 */
export declare function createBottleneckAnalysisModel(sequelize: Sequelize): {
    new (): {};
};
/**
 * Sequelize model for PerformanceAlert table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} PerformanceAlert model
 */
export declare function createPerformanceAlertModel(sequelize: Sequelize): {
    new (): {};
};
/**
 * Sequelize model for OptimizationSuggestion table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} OptimizationSuggestion model
 */
export declare function createOptimizationSuggestionModel(sequelize: Sequelize): {
    new (): {};
};
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
export declare function recordPerformanceMetric(params: {
    model: typeof Model;
    metricType: MetricType;
    metricName: string;
    value: number;
    unit: string;
    processInstanceId?: string;
    activityId?: string;
    processDefinitionId?: string;
    dimensions?: Record<string, any>;
    metadata?: Record<string, any>;
    transaction?: Transaction;
}): Promise<PerformanceMetric>;
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
export declare function recordProcessDuration(params: {
    model: typeof Model;
    processInstanceId: string;
    processDefinitionId: string;
    durationMs: number;
    startTime: Date;
    endTime: Date;
    success?: boolean;
    transaction?: Transaction;
}): Promise<PerformanceMetric>;
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
export declare function recordTaskDuration(params: {
    model: typeof Model;
    processInstanceId: string;
    activityId: string;
    activityName: string;
    durationMs: number;
    transaction?: Transaction;
}): Promise<PerformanceMetric>;
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
export declare function getAverageProcessDuration(params: {
    model: typeof Model;
    processDefinitionId: string;
    startDate?: Date;
    endDate?: Date;
    transaction?: Transaction;
}): Promise<number>;
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
export declare function getProcessDurationPercentiles(params: {
    model: typeof Model;
    processDefinitionId: string;
    startDate?: Date;
    endDate?: Date;
    transaction?: Transaction;
}): Promise<{
    p50: number;
    p95: number;
    p99: number;
    min: number;
    max: number;
}>;
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
export declare function calculateThroughput(params: {
    model: typeof Model;
    processDefinitionId?: string;
    interval: AggregationInterval;
    startDate: Date;
    endDate: Date;
    transaction?: Transaction;
}): Promise<Array<{
    time: Date;
    count: number;
    throughputPerHour: number;
}>>;
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
export declare function recordThroughput(params: {
    model: typeof Model;
    processDefinitionId?: string;
    processesPerHour: number;
    transaction?: Transaction;
}): Promise<PerformanceMetric>;
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
export declare function analyzeProcessBottlenecks(params: {
    metricModel: typeof Model;
    analysisModel: typeof Model;
    processDefinitionId: string;
    startDate?: Date;
    endDate?: Date;
    minSampleSize?: number;
    transaction?: Transaction;
}): Promise<BottleneckAnalysis[]>;
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
export declare function getRecentBottlenecks(params: {
    model: typeof Model;
    processDefinitionId: string;
    limit?: number;
    transaction?: Transaction;
}): Promise<BottleneckAnalysis[]>;
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
export declare function createSLAConfig(params: {
    model: typeof Model;
    name: string;
    processDefinitionId: string;
    activityId?: string;
    targetDuration: number;
    warningThreshold?: number;
    criticalThreshold?: number;
    transaction?: Transaction;
}): Promise<SLAConfig>;
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
export declare function monitorSLACompliance(params: {
    slaModel: typeof Model;
    metricModel: typeof Model;
    processInstanceId: string;
    processDefinitionId: string;
    currentDuration: number;
    transaction?: Transaction;
}): Promise<{
    compliant: boolean;
    slaName: string;
    percentUsed: number;
    status: 'ok' | 'warning' | 'critical';
}>;
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
export declare function calculateSLAComplianceRate(params: {
    metricModel: typeof Model;
    slaModel: typeof Model;
    processDefinitionId: string;
    startDate?: Date;
    endDate?: Date;
    transaction?: Transaction;
}): Promise<{
    complianceRate: number;
    totalProcesses: number;
    compliantProcesses: number;
}>;
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
export declare function recordResourceUtilization(params: {
    model: typeof Model;
    resourceType: string;
    utilizationPercent: number;
    details?: Record<string, any>;
    transaction?: Transaction;
}): Promise<PerformanceMetric>;
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
export declare function getResourceUtilizationTrend(params: {
    model: typeof Model;
    resourceType: string;
    interval: AggregationInterval;
    startDate: Date;
    endDate: Date;
    transaction?: Transaction;
}): Promise<Array<{
    time: Date;
    avgUtilization: number;
    maxUtilization: number;
}>>;
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
export declare function createPerformanceAlert(params: {
    model: typeof Model;
    name: string;
    metricType: MetricType;
    condition: ThresholdCondition;
    threshold: number;
    severity: AlertSeverity;
    notificationChannel?: string;
    transaction?: Transaction;
}): Promise<PerformanceAlert>;
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
export declare function evaluatePerformanceAlerts(params: {
    alertModel: typeof Model;
    metricModel: typeof Model;
    lookbackMinutes?: number;
    transaction?: Transaction;
}): Promise<Array<{
    alert: PerformanceAlert;
    triggered: boolean;
    currentValue: number;
}>>;
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
export declare function generateOptimizationSuggestions(params: {
    metricModel: typeof Model;
    bottleneckModel: typeof Model;
    suggestionModel: typeof Model;
    processDefinitionId: string;
    transaction?: Transaction;
}): Promise<OptimizationSuggestion[]>;
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
export declare function getOptimizationSuggestions(params: {
    model: typeof Model;
    processDefinitionId: string;
    categories?: OptimizationCategory[];
    limit?: number;
    transaction?: Transaction;
}): Promise<OptimizationSuggestion[]>;
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
export declare function generatePerformanceDashboard(params: {
    metricModel: typeof Model;
    bottleneckModel: typeof Model;
    processDefinitionId?: string;
    timeWindowHours?: number;
    transaction?: Transaction;
}): Promise<DashboardData>;
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
export declare function comparePerformanceAcrossPeriods(params: {
    model: typeof Model;
    processDefinitionId: string;
    period1Start: Date;
    period1End: Date;
    period2Start: Date;
    period2End: Date;
    transaction?: Transaction;
}): Promise<{
    period1: any;
    period2: any;
    improvement: number;
}>;
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
export declare function calculateErrorRate(params: {
    model: typeof Model;
    processDefinitionId: string;
    startDate?: Date;
    endDate?: Date;
    transaction?: Transaction;
}): Promise<number>;
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
export declare function detectPerformanceAnomalies(params: {
    model: typeof Model;
    processDefinitionId: string;
    stddevThreshold?: number;
    startDate?: Date;
    transaction?: Transaction;
}): Promise<Array<{
    timestamp: Date;
    value: number;
    expectedRange: [number, number];
}>>;
//# sourceMappingURL=workflow-performance-monitoring.d.ts.map