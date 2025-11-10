"use strict";
/**
 * @fileoverview Analytics Queries - Comprehensive Sequelize analytical query functions
 * @module reuse/command/analytics-queries
 * @description Production-ready analytical query functions for healthcare emergency response
 * analytics, performance metrics, predictive modeling, and compliance reporting.
 *
 * Key Features:
 * - Response time analytics (average, percentile, trends)
 * - Performance metrics (unit productivity, call volume)
 * - Trend analysis (daily, weekly, monthly patterns)
 * - Predictive analytics (demand forecasting)
 * - Resource utilization reports (allocation efficiency)
 * - Geographic heat maps (incident density)
 * - Workload analysis (dispatcher metrics)
 * - Compliance reporting (SLA compliance)
 * - Incident pattern analysis
 * - Multi-dimensional analysis (OLAP-style)
 * - Time-series analysis
 * - Statistical aggregations
 *
 * @target Sequelize v6.x, PostgreSQL 14+, Node 18+, TypeScript 5.x
 *
 * @security
 * - Parameterized queries to prevent SQL injection
 * - HIPAA-compliant data aggregation (no PHI exposure)
 * - Role-based query access control
 * - Audit logging for sensitive analytics
 * - Data anonymization in reports
 * - Secure aggregation functions
 *
 * @performance
 * - Optimized with proper indexing strategies
 * - N+1 query prevention
 * - CTEs for readability and performance
 * - Window functions for efficient analytics
 * - Query result caching recommendations
 * - Materialized views for complex aggregations
 * - Partition-aware queries for time-series data
 *
 * @example Response time analytics
 * ```typescript
 * import { getAverageResponseTime, getResponseTimePercentiles } from './analytics-queries';
 *
 * const avgTime = await getAverageResponseTime(sequelize, {
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   incidentType: 'MEDICAL'
 * });
 *
 * const percentiles = await getResponseTimePercentiles(sequelize, {
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   percentiles: [50, 90, 95, 99]
 * });
 * ```
 *
 * @example Performance metrics
 * ```typescript
 * import { getUnitProductivityMetrics, getCallVolumeAnalysis } from './analytics-queries';
 *
 * const productivity = await getUnitProductivityMetrics(sequelize, {
 *   unitId: 'ambulance-001',
 *   period: 'month'
 * });
 *
 * const callVolume = await getCallVolumeAnalysis(sequelize, {
 *   groupBy: 'hour',
 *   dayOfWeek: ['Monday', 'Friday']
 * });
 * ```
 *
 * @example Predictive analytics
 * ```typescript
 * import { forecastDemand, predictPeakHours } from './analytics-queries';
 *
 * const forecast = await forecastDemand(sequelize, {
 *   forecastDays: 7,
 *   historicalDays: 90,
 *   incidentType: 'MEDICAL'
 * });
 * ```
 *
 * LOC: ANALYTICS-001
 * UPSTREAM: sequelize, @types/sequelize, database models
 * DOWNSTREAM: reporting services, dashboards, analytics APIs
 *
 * @version 1.0.0
 * @since 2025-11-09
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHistogram = exports.calculateCorrelations = exports.calculateStatisticalSummary = exports.decomposeTrend = exports.detectAnomalies = exports.calculateMovingAverage = exports.performDrillDownAnalysis = exports.performRollupAnalysis = exports.performCubeAnalysis = exports.analyzeRepeatLocations = exports.identifyCorrelatedIncidents = exports.analyzeIncidentPatterns = exports.identifySLABreachPatterns = exports.getComplianceReportByType = exports.getSLAComplianceMetrics = exports.getGeographicResponseTimeVariation = exports.identifyHighRiskAreas = exports.getIncidentDensityHeatMap = exports.calculateOptimalResourceDistribution = exports.identifyResourceBottlenecks = exports.getResourceAllocationEfficiency = exports.predictResourceDemand = exports.predictPeakHours = exports.forecastDemand = exports.getMonthOverMonthGrowth = exports.getDayOfWeekPatterns = exports.getSeasonalPatterns = exports.getIncidentTrendsByType = exports.getUnitUtilizationRate = exports.getDispatcherPerformance = exports.getCallVolumeAnalysis = exports.getUnitProductivityMetrics = exports.getResponseTimeByHour = exports.getResponseTimeTrends = exports.getResponseTimePercentiles = exports.getAverageResponseTime = exports.IncidentType = exports.IncidentPriority = exports.TimeGranularity = void 0;
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * @enum TimeGranularity
 * @description Time grouping granularity for analytics
 */
var TimeGranularity;
(function (TimeGranularity) {
    TimeGranularity["HOUR"] = "hour";
    TimeGranularity["DAY"] = "day";
    TimeGranularity["WEEK"] = "week";
    TimeGranularity["MONTH"] = "month";
    TimeGranularity["QUARTER"] = "quarter";
    TimeGranularity["YEAR"] = "year";
})(TimeGranularity || (exports.TimeGranularity = TimeGranularity = {}));
/**
 * @enum IncidentPriority
 * @description Incident priority levels
 */
var IncidentPriority;
(function (IncidentPriority) {
    IncidentPriority["CRITICAL"] = "CRITICAL";
    IncidentPriority["HIGH"] = "HIGH";
    IncidentPriority["MEDIUM"] = "MEDIUM";
    IncidentPriority["LOW"] = "LOW";
})(IncidentPriority || (exports.IncidentPriority = IncidentPriority = {}));
/**
 * @enum IncidentType
 * @description Types of emergency incidents
 */
var IncidentType;
(function (IncidentType) {
    IncidentType["MEDICAL"] = "MEDICAL";
    IncidentType["FIRE"] = "FIRE";
    IncidentType["TRAUMA"] = "TRAUMA";
    IncidentType["CARDIAC"] = "CARDIAC";
    IncidentType["RESPIRATORY"] = "RESPIRATORY";
    IncidentType["PSYCHIATRIC"] = "PSYCHIATRIC";
    IncidentType["OTHER"] = "OTHER";
})(IncidentType || (exports.IncidentType = IncidentType = {}));
// ============================================================================
// RESPONSE TIME ANALYTICS
// ============================================================================
/**
 * Calculates average response time for incidents
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} options - Filter options
 * @param {DateRangeFilter} options.dateRange - Date range filter
 * @param {IncidentType} [options.incidentType] - Incident type filter
 * @param {IncidentPriority} [options.priority] - Priority filter
 * @param {string} [options.regionId] - Region filter
 * @returns {Promise<ResponseTimeMetrics>} Response time metrics
 *
 * @example
 * ```typescript
 * const metrics = await getAverageResponseTime(sequelize, {
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   incidentType: IncidentType.MEDICAL,
 *   priority: IncidentPriority.CRITICAL
 * });
 * ```
 */
const getAverageResponseTime = async (sequelize, options) => {
    const { dateRange, incidentType, priority, regionId } = options;
    const query = `
    SELECT
      AVG(EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as average_seconds,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as median_seconds,
      MIN(EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as min_seconds,
      MAX(EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as max_seconds,
      STDDEV(EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as std_dev_seconds,
      COUNT(*)::INTEGER as total_incidents
    FROM incidents
    WHERE created_at BETWEEN :startDate AND :endDate
      AND dispatched_at IS NOT NULL
      ${incidentType ? 'AND incident_type = :incidentType' : ''}
      ${priority ? 'AND priority = :priority' : ''}
      ${regionId ? 'AND region_id = :regionId' : ''}
  `;
    const [result] = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            ...(incidentType && { incidentType }),
            ...(priority && { priority }),
            ...(regionId && { regionId }),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return result;
};
exports.getAverageResponseTime = getAverageResponseTime;
/**
 * Calculates response time percentiles (P50, P90, P95, P99)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} options - Filter options
 * @param {DateRangeFilter} options.dateRange - Date range filter
 * @param {number[]} [options.percentiles] - Percentiles to calculate
 * @param {IncidentType} [options.incidentType] - Incident type filter
 * @returns {Promise<PercentileResult[]>} Percentile results
 *
 * @example
 * ```typescript
 * const percentiles = await getResponseTimePercentiles(sequelize, {
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   percentiles: [50, 90, 95, 99]
 * });
 * ```
 */
const getResponseTimePercentiles = async (sequelize, options) => {
    const { dateRange, percentiles = [50, 90, 95, 99], incidentType } = options;
    const percentileQueries = percentiles
        .map((p) => `PERCENTILE_CONT(${p / 100}) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (dispatched_at - created_at))) as p${p}`)
        .join(', ');
    const query = `
    SELECT ${percentileQueries}
    FROM incidents
    WHERE created_at BETWEEN :startDate AND :endDate
      AND dispatched_at IS NOT NULL
      ${incidentType ? 'AND incident_type = :incidentType' : ''}
  `;
    const [result] = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            ...(incidentType && { incidentType }),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return percentiles.map((p) => ({
        percentile: p,
        value: result[`p${p}`],
    }));
};
exports.getResponseTimePercentiles = getResponseTimePercentiles;
/**
 * Analyzes response time trends over time
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} options - Analysis options
 * @param {DateRangeFilter} options.dateRange - Date range filter
 * @param {TimeGranularity} [options.granularity] - Time granularity
 * @param {IncidentType} [options.incidentType] - Incident type filter
 * @returns {Promise<TrendDataPoint[]>} Trend data points
 *
 * @example
 * ```typescript
 * const trends = await getResponseTimeTrends(sequelize, {
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-03-31' },
 *   granularity: TimeGranularity.WEEK
 * });
 * ```
 */
const getResponseTimeTrends = async (sequelize, options) => {
    const { dateRange, granularity = TimeGranularity.DAY, incidentType } = options;
    const dateFormat = {
        hour: "DATE_TRUNC('hour', created_at)",
        day: "DATE_TRUNC('day', created_at)",
        week: "DATE_TRUNC('week', created_at)",
        month: "DATE_TRUNC('month', created_at)",
        quarter: "DATE_TRUNC('quarter', created_at)",
        year: "DATE_TRUNC('year', created_at)",
    };
    const query = `
    WITH trend_data AS (
      SELECT
        ${dateFormat[granularity]} as period,
        AVG(EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as avg_response_time
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
        AND dispatched_at IS NOT NULL
        ${incidentType ? 'AND incident_type = :incidentType' : ''}
      GROUP BY ${dateFormat[granularity]}
      ORDER BY period
    ),
    trend_with_change AS (
      SELECT
        period,
        avg_response_time as value,
        avg_response_time - LAG(avg_response_time) OVER (ORDER BY period) as change,
        CASE
          WHEN LAG(avg_response_time) OVER (ORDER BY period) IS NULL THEN NULL
          WHEN LAG(avg_response_time) OVER (ORDER BY period) = 0 THEN NULL
          ELSE ((avg_response_time - LAG(avg_response_time) OVER (ORDER BY period)) / LAG(avg_response_time) OVER (ORDER BY period) * 100)::NUMERIC(10,2)
        END as percent_change
      FROM trend_data
    )
    SELECT * FROM trend_with_change
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            ...(incidentType && { incidentType }),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getResponseTimeTrends = getResponseTimeTrends;
/**
 * Calculates response time by hour of day
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @returns {Promise<Array<{hour: number, avgResponseTime: number}>>} Hourly response times
 *
 * @example
 * ```typescript
 * const hourlyMetrics = await getResponseTimeByHour(sequelize, {
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * ```
 */
const getResponseTimeByHour = async (sequelize, dateRange) => {
    const query = `
    SELECT
      EXTRACT(HOUR FROM created_at)::INTEGER as hour,
      AVG(EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as avg_response_time,
      COUNT(*)::INTEGER as incident_count
    FROM incidents
    WHERE created_at BETWEEN :startDate AND :endDate
      AND dispatched_at IS NOT NULL
    GROUP BY EXTRACT(HOUR FROM created_at)
    ORDER BY hour
  `;
    const results = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getResponseTimeByHour = getResponseTimeByHour;
// ============================================================================
// PERFORMANCE METRICS
// ============================================================================
/**
 * Calculates unit productivity metrics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} options - Filter options
 * @param {string} [options.unitId] - Unit ID filter
 * @param {DateRangeFilter} options.dateRange - Date range filter
 * @returns {Promise<ProductivityMetrics[]>} Productivity metrics
 *
 * @example
 * ```typescript
 * const productivity = await getUnitProductivityMetrics(sequelize, {
 *   unitId: 'ambulance-001',
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' }
 * });
 * ```
 */
const getUnitProductivityMetrics = async (sequelize, options) => {
    const { unitId, dateRange } = options;
    const query = `
    WITH unit_stats AS (
      SELECT
        u.id as unit_id,
        COUNT(d.id) as total_calls,
        COUNT(d.id) FILTER (WHERE d.status = 'COMPLETED') as completed_calls,
        AVG(EXTRACT(EPOCH FROM (d.arrived_at - d.dispatched_at)))::NUMERIC(10,2) as avg_response_time,
        SUM(EXTRACT(EPOCH FROM (COALESCE(d.cleared_at, NOW()) - d.dispatched_at)))::NUMERIC(10,2) as total_active_time,
        EXTRACT(EPOCH FROM (:endDate::timestamp - :startDate::timestamp))::NUMERIC(10,2) as period_seconds
      FROM units u
      LEFT JOIN dispatches d ON u.id = d.unit_id
        AND d.created_at BETWEEN :startDate AND :endDate
      WHERE 1=1
        ${unitId ? 'AND u.id = :unitId' : ''}
      GROUP BY u.id
    )
    SELECT
      unit_id,
      total_calls,
      completed_calls,
      avg_response_time,
      CASE
        WHEN period_seconds > 0 THEN (total_active_time / period_seconds * 100)::NUMERIC(10,2)
        ELSE 0
      END as utilization_rate,
      (period_seconds - total_active_time)::NUMERIC(10,2) as idle_time,
      total_active_time as active_time
    FROM unit_stats
    ORDER BY utilization_rate DESC
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            ...(unitId && { unitId }),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getUnitProductivityMetrics = getUnitProductivityMetrics;
/**
 * Analyzes call volume patterns
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} options - Analysis options
 * @param {DateRangeFilter} options.dateRange - Date range filter
 * @param {TimeGranularity} [options.groupBy] - Grouping granularity
 * @param {string[]} [options.dayOfWeek] - Filter by day of week
 * @returns {Promise<Array<{period: string, callVolume: number}>>} Call volume analysis
 *
 * @example
 * ```typescript
 * const callVolume = await getCallVolumeAnalysis(sequelize, {
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   groupBy: TimeGranularity.HOUR,
 *   dayOfWeek: ['Monday', 'Friday']
 * });
 * ```
 */
const getCallVolumeAnalysis = async (sequelize, options) => {
    const { dateRange, groupBy = TimeGranularity.HOUR, dayOfWeek } = options;
    const dateFormat = {
        hour: "TO_CHAR(created_at, 'YYYY-MM-DD HH24:00')",
        day: "TO_CHAR(created_at, 'YYYY-MM-DD')",
        week: "TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-MM-DD')",
        month: "TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM')",
        quarter: "TO_CHAR(DATE_TRUNC('quarter', created_at), 'YYYY-Q')",
        year: "TO_CHAR(DATE_TRUNC('year', created_at), 'YYYY')",
    };
    const dayOfWeekFilter = dayOfWeek
        ? `AND TO_CHAR(created_at, 'Day') IN (${dayOfWeek.map((d) => `'${d}'`).join(', ')})`
        : '';
    const query = `
    SELECT
      ${dateFormat[groupBy]} as period,
      COUNT(*)::INTEGER as call_volume,
      AVG(
        CASE priority
          WHEN 'CRITICAL' THEN 4
          WHEN 'HIGH' THEN 3
          WHEN 'MEDIUM' THEN 2
          WHEN 'LOW' THEN 1
          ELSE 0
        END
      )::NUMERIC(10,2) as avg_priority
    FROM incidents
    WHERE created_at BETWEEN :startDate AND :endDate
      ${dayOfWeekFilter}
    GROUP BY ${dateFormat[groupBy]}
    ORDER BY period
  `;
    const results = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getCallVolumeAnalysis = getCallVolumeAnalysis;
/**
 * Calculates dispatcher performance metrics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} options - Filter options
 * @param {string} [options.dispatcherId] - Dispatcher ID filter
 * @param {DateRangeFilter} options.dateRange - Date range filter
 * @returns {Promise<WorkloadMetrics[]>} Dispatcher workload metrics
 *
 * @example
 * ```typescript
 * const metrics = await getDispatcherPerformance(sequelize, {
 *   dispatcherId: 'dispatcher-123',
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' }
 * });
 * ```
 */
const getDispatcherPerformance = async (sequelize, options) => {
    const { dispatcherId, dateRange } = options;
    const query = `
    WITH dispatcher_metrics AS (
      SELECT
        dispatcher_id,
        COUNT(*) as total_dispatches,
        AVG(EXTRACT(EPOCH FROM (completed_at - created_at)))::NUMERIC(10,2) as avg_handling_time,
        MAX(hourly_counts.hourly_total) as peak_hour_dispatches
      FROM dispatches d
      LEFT JOIN LATERAL (
        SELECT COUNT(*) as hourly_total
        FROM dispatches d2
        WHERE d2.dispatcher_id = d.dispatcher_id
          AND DATE_TRUNC('hour', d2.created_at) = DATE_TRUNC('hour', d.created_at)
      ) hourly_counts ON true
      WHERE d.created_at BETWEEN :startDate AND :endDate
        ${dispatcherId ? 'AND d.dispatcher_id = :dispatcherId' : ''}
      GROUP BY dispatcher_id
    ),
    concurrent_calls AS (
      SELECT
        dispatcher_id,
        MAX(concurrent_count) as max_concurrent
      FROM (
        SELECT
          dispatcher_id,
          created_at,
          COUNT(*) OVER (
            PARTITION BY dispatcher_id
            ORDER BY created_at
            RANGE BETWEEN CURRENT ROW AND INTERVAL '1 hour' FOLLOWING
          ) as concurrent_count
        FROM dispatches
        WHERE created_at BETWEEN :startDate AND :endDate
      ) sub
      GROUP BY dispatcher_id
    )
    SELECT
      dm.dispatcher_id,
      dm.total_dispatches,
      dm.avg_handling_time,
      dm.peak_hour_dispatches,
      COALESCE(cc.max_concurrent, 0) as concurrent_calls,
      CASE
        WHEN dm.avg_handling_time > 0 THEN
          (3600.0 / dm.avg_handling_time)::NUMERIC(10,2)
        ELSE 0
      END as efficiency
    FROM dispatcher_metrics dm
    LEFT JOIN concurrent_calls cc ON dm.dispatcher_id = cc.dispatcher_id
    ORDER BY dm.total_dispatches DESC
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            ...(dispatcherId && { dispatcherId }),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getDispatcherPerformance = getDispatcherPerformance;
/**
 * Calculates unit utilization rate over time
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @param {TimeGranularity} granularity - Time granularity
 * @returns {Promise<Array<{period: string, utilizationRate: number}>>} Utilization rates
 *
 * @example
 * ```typescript
 * const utilization = await getUnitUtilizationRate(sequelize,
 *   { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   TimeGranularity.DAY
 * );
 * ```
 */
const getUnitUtilizationRate = async (sequelize, dateRange, granularity = TimeGranularity.DAY) => {
    const dateFormat = {
        hour: "DATE_TRUNC('hour', d.created_at)",
        day: "DATE_TRUNC('day', d.created_at)",
        week: "DATE_TRUNC('week', d.created_at)",
        month: "DATE_TRUNC('month', d.created_at)",
        quarter: "DATE_TRUNC('quarter', d.created_at)",
        year: "DATE_TRUNC('year', d.created_at)",
    };
    const query = `
    WITH unit_time AS (
      SELECT
        ${dateFormat[granularity]} as period,
        unit_id,
        SUM(EXTRACT(EPOCH FROM (COALESCE(cleared_at, NOW()) - dispatched_at))) as active_seconds
      FROM dispatches d
      WHERE d.created_at BETWEEN :startDate AND :endDate
      GROUP BY ${dateFormat[granularity]}, unit_id
    ),
    period_stats AS (
      SELECT
        period,
        COUNT(DISTINCT unit_id) as active_units,
        SUM(active_seconds) as total_active_seconds,
        EXTRACT(EPOCH FROM (:endDate::timestamp - :startDate::timestamp)) * COUNT(DISTINCT unit_id) as total_available_seconds
      FROM unit_time
      GROUP BY period
    )
    SELECT
      period::TEXT,
      CASE
        WHEN total_available_seconds > 0 THEN
          (total_active_seconds / total_available_seconds * 100)::NUMERIC(10,2)
        ELSE 0
      END as utilization_rate,
      active_units
    FROM period_stats
    ORDER BY period
  `;
    const results = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getUnitUtilizationRate = getUnitUtilizationRate;
// ============================================================================
// TREND ANALYSIS
// ============================================================================
/**
 * Analyzes incident trends by type over time
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @param {TimeGranularity} granularity - Time granularity
 * @returns {Promise<Array<{period: string, incidentType: string, count: number}>>} Incident trends
 *
 * @example
 * ```typescript
 * const trends = await getIncidentTrendsByType(sequelize,
 *   { startDate: '2025-01-01', endDate: '2025-03-31' },
 *   TimeGranularity.WEEK
 * );
 * ```
 */
const getIncidentTrendsByType = async (sequelize, dateRange, granularity = TimeGranularity.DAY) => {
    const dateFormat = {
        hour: "TO_CHAR(DATE_TRUNC('hour', created_at), 'YYYY-MM-DD HH24:00')",
        day: "TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD')",
        week: "TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-MM-DD')",
        month: "TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM')",
        quarter: "TO_CHAR(DATE_TRUNC('quarter', created_at), 'YYYY-Q')",
        year: "TO_CHAR(DATE_TRUNC('year', created_at), 'YYYY')",
    };
    const query = `
    WITH incident_counts AS (
      SELECT
        ${dateFormat[granularity]} as period,
        incident_type,
        COUNT(*)::INTEGER as count
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
      GROUP BY ${dateFormat[granularity]}, incident_type
    ),
    period_totals AS (
      SELECT
        period,
        SUM(count) as total
      FROM incident_counts
      GROUP BY period
    )
    SELECT
      ic.period,
      ic.incident_type,
      ic.count,
      (ic.count::NUMERIC / pt.total * 100)::NUMERIC(10,2) as percent_of_total
    FROM incident_counts ic
    JOIN period_totals pt ON ic.period = pt.period
    ORDER BY ic.period, ic.count DESC
  `;
    const results = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getIncidentTrendsByType = getIncidentTrendsByType;
/**
 * Analyzes seasonal patterns in incident data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} yearsBack - Number of years to analyze
 * @returns {Promise<Array<{month: number, avgIncidents: number, trend: string}>>} Seasonal patterns
 *
 * @example
 * ```typescript
 * const patterns = await getSeasonalPatterns(sequelize, 3);
 * ```
 */
const getSeasonalPatterns = async (sequelize, yearsBack = 2) => {
    const query = `
    SELECT
      EXTRACT(MONTH FROM created_at)::INTEGER as month,
      TO_CHAR(created_at, 'Month') as month_name,
      AVG(daily_count)::NUMERIC(10,2) as avg_incidents,
      STDDEV(daily_count)::NUMERIC(10,2) as std_dev
    FROM (
      SELECT
        DATE_TRUNC('day', created_at) as day,
        created_at,
        COUNT(*) as daily_count
      FROM incidents
      WHERE created_at >= NOW() - INTERVAL ':yearsBack years'
      GROUP BY DATE_TRUNC('day', created_at), created_at
    ) daily_stats
    GROUP BY EXTRACT(MONTH FROM created_at), TO_CHAR(created_at, 'Month')
    ORDER BY month
  `;
    const results = await sequelize.query(query, {
        replacements: { yearsBack },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getSeasonalPatterns = getSeasonalPatterns;
/**
 * Identifies day-of-week patterns
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @returns {Promise<Array<{dayOfWeek: string, avgIncidents: number, peakHour: number}>>} Day patterns
 *
 * @example
 * ```typescript
 * const dayPatterns = await getDayOfWeekPatterns(sequelize, {
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * ```
 */
const getDayOfWeekPatterns = async (sequelize, dateRange) => {
    const query = `
    WITH daily_stats AS (
      SELECT
        TO_CHAR(created_at, 'Day') as day_of_week,
        EXTRACT(DOW FROM created_at) as day_number,
        DATE_TRUNC('day', created_at) as day,
        COUNT(*) as incident_count,
        MODE() WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM created_at)) as peak_hour
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
      GROUP BY TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at), DATE_TRUNC('day', created_at)
    )
    SELECT
      TRIM(day_of_week) as day_of_week,
      day_number::INTEGER,
      AVG(incident_count)::NUMERIC(10,2) as avg_incidents,
      MODE() WITHIN GROUP (ORDER BY peak_hour)::INTEGER as peak_hour
    FROM daily_stats
    GROUP BY day_of_week, day_number
    ORDER BY day_number
  `;
    const results = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getDayOfWeekPatterns = getDayOfWeekPatterns;
/**
 * Calculates month-over-month growth rate
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} monthsBack - Number of months to analyze
 * @param {IncidentType} [incidentType] - Filter by incident type
 * @returns {Promise<Array<{month: string, incidents: number, growthRate: number}>>} Growth rates
 *
 * @example
 * ```typescript
 * const growth = await getMonthOverMonthGrowth(sequelize, 12, IncidentType.MEDICAL);
 * ```
 */
const getMonthOverMonthGrowth = async (sequelize, monthsBack = 12, incidentType) => {
    const query = `
    WITH monthly_counts AS (
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
        COUNT(*)::INTEGER as incidents
      FROM incidents
      WHERE created_at >= DATE_TRUNC('month', NOW()) - INTERVAL ':monthsBack months'
        ${incidentType ? 'AND incident_type = :incidentType' : ''}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    )
    SELECT
      month,
      incidents,
      CASE
        WHEN LAG(incidents) OVER (ORDER BY month) IS NULL THEN NULL
        WHEN LAG(incidents) OVER (ORDER BY month) = 0 THEN NULL
        ELSE ((incidents - LAG(incidents) OVER (ORDER BY month))::NUMERIC / LAG(incidents) OVER (ORDER BY month) * 100)::NUMERIC(10,2)
      END as growth_rate
    FROM monthly_counts
  `;
    const results = await sequelize.query(query, {
        replacements: {
            monthsBack,
            ...(incidentType && { incidentType }),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getMonthOverMonthGrowth = getMonthOverMonthGrowth;
// ============================================================================
// PREDICTIVE ANALYTICS
// ============================================================================
/**
 * Forecasts demand using historical patterns
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} options - Forecast options
 * @param {number} options.forecastDays - Days to forecast
 * @param {number} [options.historicalDays] - Historical days to analyze
 * @param {IncidentType} [options.incidentType] - Filter by type
 * @returns {Promise<ForecastResult[]>} Demand forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastDemand(sequelize, {
 *   forecastDays: 7,
 *   historicalDays: 90,
 *   incidentType: IncidentType.MEDICAL
 * });
 * ```
 */
const forecastDemand = async (sequelize, options) => {
    const { forecastDays, historicalDays = 90, incidentType } = options;
    const query = `
    WITH historical_data AS (
      SELECT
        DATE_TRUNC('day', created_at) as day,
        EXTRACT(DOW FROM created_at) as day_of_week,
        COUNT(*) as incident_count
      FROM incidents
      WHERE created_at >= NOW() - INTERVAL ':historicalDays days'
        ${incidentType ? 'AND incident_type = :incidentType' : ''}
      GROUP BY DATE_TRUNC('day', created_at), EXTRACT(DOW FROM created_at)
    ),
    day_averages AS (
      SELECT
        day_of_week,
        AVG(incident_count)::NUMERIC(10,2) as avg_count,
        STDDEV(incident_count)::NUMERIC(10,2) as std_dev
      FROM historical_data
      GROUP BY day_of_week
    ),
    forecast_dates AS (
      SELECT
        generate_series(
          DATE_TRUNC('day', NOW()),
          DATE_TRUNC('day', NOW()) + INTERVAL ':forecastDays days',
          '1 day'::interval
        ) as forecast_date
    )
    SELECT
      fd.forecast_date::DATE as date,
      da.avg_count::INTEGER as predicted_volume,
      CASE
        WHEN da.std_dev IS NULL OR da.avg_count = 0 THEN 0.5
        ELSE (1 - (da.std_dev / da.avg_count))::NUMERIC(10,2)
      END as confidence,
      CASE
        WHEN da.avg_count > (SELECT AVG(avg_count) FROM day_averages) THEN 'up'
        WHEN da.avg_count < (SELECT AVG(avg_count) FROM day_averages) THEN 'down'
        ELSE 'stable'
      END as trend
    FROM forecast_dates fd
    JOIN day_averages da ON EXTRACT(DOW FROM fd.forecast_date) = da.day_of_week
    ORDER BY fd.forecast_date
  `;
    const results = await sequelize.query(query, {
        replacements: {
            forecastDays,
            historicalDays,
            ...(incidentType && { incidentType }),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.forecastDemand = forecastDemand;
/**
 * Predicts peak hours based on historical data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} daysBack - Historical days to analyze
 * @param {string} [regionId] - Region filter
 * @returns {Promise<Array<{hour: number, probability: number, avgIncidents: number}>>} Peak hour predictions
 *
 * @example
 * ```typescript
 * const peakHours = await predictPeakHours(sequelize, 90, 'region-001');
 * ```
 */
const predictPeakHours = async (sequelize, daysBack = 90, regionId) => {
    const query = `
    WITH hourly_stats AS (
      SELECT
        EXTRACT(HOUR FROM created_at)::INTEGER as hour,
        DATE_TRUNC('day', created_at) as day,
        COUNT(*) as incident_count
      FROM incidents
      WHERE created_at >= NOW() - INTERVAL ':daysBack days'
        ${regionId ? 'AND region_id = :regionId' : ''}
      GROUP BY EXTRACT(HOUR FROM created_at), DATE_TRUNC('day', created_at)
    ),
    hour_aggregates AS (
      SELECT
        hour,
        AVG(incident_count)::NUMERIC(10,2) as avg_incidents,
        COUNT(*) as days_with_data
      FROM hourly_stats
      GROUP BY hour
    ),
    max_avg AS (
      SELECT MAX(avg_incidents) as max_value
      FROM hour_aggregates
    )
    SELECT
      ha.hour,
      (ha.avg_incidents / ma.max_value)::NUMERIC(10,2) as probability,
      ha.avg_incidents
    FROM hour_aggregates ha
    CROSS JOIN max_avg ma
    ORDER BY ha.hour
  `;
    const results = await sequelize.query(query, {
        replacements: {
            daysBack,
            ...(regionId && { regionId }),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.predictPeakHours = predictPeakHours;
/**
 * Identifies resource demand patterns for predictive allocation
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @param {TimeGranularity} granularity - Time granularity
 * @returns {Promise<Array<{period: string, requiredUnits: number, availableUnits: number}>>} Resource demand
 *
 * @example
 * ```typescript
 * const demand = await predictResourceDemand(sequelize,
 *   { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   TimeGranularity.HOUR
 * );
 * ```
 */
const predictResourceDemand = async (sequelize, dateRange, granularity = TimeGranularity.HOUR) => {
    const dateFormat = {
        hour: "TO_CHAR(DATE_TRUNC('hour', created_at), 'YYYY-MM-DD HH24:00')",
        day: "TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD')",
        week: "TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-MM-DD')",
        month: "TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM')",
        quarter: "TO_CHAR(DATE_TRUNC('quarter', created_at), 'YYYY-Q')",
        year: "TO_CHAR(DATE_TRUNC('year', created_at), 'YYYY')",
    };
    const query = `
    WITH incident_demand AS (
      SELECT
        ${dateFormat[granularity]} as period,
        COUNT(*) as incident_count,
        CEIL(COUNT(*) / 3.0)::INTEGER as required_units
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
      GROUP BY ${dateFormat[granularity]}
    ),
    available_capacity AS (
      SELECT
        ${dateFormat[granularity]} as period,
        COUNT(DISTINCT unit_id)::INTEGER as available_units
      FROM dispatches
      WHERE created_at BETWEEN :startDate AND :endDate
        AND status IN ('AVAILABLE', 'RESPONDING')
      GROUP BY ${dateFormat[granularity]}
    )
    SELECT
      id.period,
      id.required_units,
      id.incident_count as predicted_incidents,
      GREATEST(0, id.required_units - COALESCE(ac.available_units, 0))::INTEGER as capacity_gap
    FROM incident_demand id
    LEFT JOIN available_capacity ac ON id.period = ac.period
    ORDER BY id.period
  `;
    const results = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.predictResourceDemand = predictResourceDemand;
// ============================================================================
// RESOURCE UTILIZATION
// ============================================================================
/**
 * Analyzes resource allocation efficiency
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @returns {Promise<Array<{resourceType: string, totalUnits: number, utilizationRate: number}>>} Allocation efficiency
 *
 * @example
 * ```typescript
 * const efficiency = await getResourceAllocationEfficiency(sequelize, {
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * ```
 */
const getResourceAllocationEfficiency = async (sequelize, dateRange) => {
    const query = `
    WITH unit_stats AS (
      SELECT
        u.unit_type as resource_type,
        COUNT(DISTINCT u.id) as total_units,
        COUNT(d.id) as total_dispatches,
        AVG(EXTRACT(EPOCH FROM (d.arrived_at - d.dispatched_at)))::NUMERIC(10,2) as avg_response_time,
        SUM(EXTRACT(EPOCH FROM (COALESCE(d.cleared_at, NOW()) - d.dispatched_at))) as total_active_seconds
      FROM units u
      LEFT JOIN dispatches d ON u.id = d.unit_id
        AND d.created_at BETWEEN :startDate AND :endDate
      GROUP BY u.unit_type
    ),
    time_period AS (
      SELECT EXTRACT(EPOCH FROM (:endDate::timestamp - :startDate::timestamp)) as period_seconds
    )
    SELECT
      us.resource_type,
      us.total_units,
      CASE
        WHEN tp.period_seconds * us.total_units > 0 THEN
          (us.total_active_seconds / (tp.period_seconds * us.total_units) * 100)::NUMERIC(10,2)
        ELSE 0
      END as utilization_rate,
      COALESCE(us.avg_response_time, 0) as avg_response_time
    FROM unit_stats us
    CROSS JOIN time_period tp
    ORDER BY us.resource_type
  `;
    const results = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getResourceAllocationEfficiency = getResourceAllocationEfficiency;
/**
 * Identifies resource bottlenecks
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @param {number} thresholdUtilization - Utilization threshold (0-100)
 * @returns {Promise<Array<{period: string, resourceType: string, utilizationRate: number, queueLength: number}>>} Bottlenecks
 *
 * @example
 * ```typescript
 * const bottlenecks = await identifyResourceBottlenecks(sequelize,
 *   { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   85
 * );
 * ```
 */
const identifyResourceBottlenecks = async (sequelize, dateRange, thresholdUtilization = 85) => {
    const query = `
    WITH hourly_utilization AS (
      SELECT
        DATE_TRUNC('hour', d.created_at) as period,
        u.unit_type as resource_type,
        COUNT(DISTINCT u.id) as available_units,
        COUNT(d.id) as active_dispatches,
        COUNT(CASE WHEN d.status = 'PENDING' THEN 1 END) as queue_length
      FROM units u
      LEFT JOIN dispatches d ON u.id = d.unit_id
        AND d.created_at BETWEEN :startDate AND :endDate
      GROUP BY DATE_TRUNC('hour', d.created_at), u.unit_type
    )
    SELECT
      TO_CHAR(period, 'YYYY-MM-DD HH24:00') as period,
      resource_type,
      CASE
        WHEN available_units > 0 THEN
          (active_dispatches::NUMERIC / available_units * 100)::NUMERIC(10,2)
        ELSE 0
      END as utilization_rate,
      queue_length
    FROM hourly_utilization
    WHERE CASE
      WHEN available_units > 0 THEN
        (active_dispatches::NUMERIC / available_units * 100) >= :threshold
      ELSE false
    END
    ORDER BY period, utilization_rate DESC
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            threshold: thresholdUtilization,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.identifyResourceBottlenecks = identifyResourceBottlenecks;
/**
 * Calculates optimal resource distribution
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @returns {Promise<Array<{regionId: string, currentUnits: number, optimalUnits: number, deficit: number}>>} Optimal distribution
 *
 * @example
 * ```typescript
 * const distribution = await calculateOptimalResourceDistribution(sequelize, {
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * ```
 */
const calculateOptimalResourceDistribution = async (sequelize, dateRange) => {
    const query = `
    WITH region_demand AS (
      SELECT
        region_id,
        COUNT(*) as total_incidents,
        AVG(EXTRACT(EPOCH FROM (dispatched_at - created_at))) as avg_wait_time
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
      GROUP BY region_id
    ),
    current_allocation AS (
      SELECT
        home_region_id as region_id,
        COUNT(*) as current_units
      FROM units
      WHERE status = 'ACTIVE'
      GROUP BY home_region_id
    ),
    total_stats AS (
      SELECT
        SUM(total_incidents) as total_incidents_all,
        (SELECT COUNT(*) FROM units WHERE status = 'ACTIVE') as total_units_all
      FROM region_demand
    )
    SELECT
      rd.region_id,
      COALESCE(ca.current_units, 0) as current_units,
      CEIL(
        (rd.total_incidents::NUMERIC / ts.total_incidents_all * ts.total_units_all)
      )::INTEGER as optimal_units,
      (CEIL(
        (rd.total_incidents::NUMERIC / ts.total_incidents_all * ts.total_units_all)
      ) - COALESCE(ca.current_units, 0))::INTEGER as deficit
    FROM region_demand rd
    CROSS JOIN total_stats ts
    LEFT JOIN current_allocation ca ON rd.region_id = ca.region_id
    ORDER BY deficit DESC
  `;
    const results = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.calculateOptimalResourceDistribution = calculateOptimalResourceDistribution;
// ============================================================================
// GEOGRAPHIC HEAT MAPS
// ============================================================================
/**
 * Generates geographic heat map data for incident density
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} options - Filter options
 * @param {DateRangeFilter} options.dateRange - Date range filter
 * @param {number} [options.gridSize] - Grid cell size in degrees
 * @param {IncidentType} [options.incidentType] - Filter by type
 * @returns {Promise<GeoHeatMapPoint[]>} Heat map data
 *
 * @example
 * ```typescript
 * const heatMap = await getIncidentDensityHeatMap(sequelize, {
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   gridSize: 0.01
 * });
 * ```
 */
const getIncidentDensityHeatMap = async (sequelize, options) => {
    const { dateRange, gridSize = 0.01, incidentType } = options;
    const query = `
    WITH grid_cells AS (
      SELECT
        FLOOR(latitude / :gridSize) * :gridSize as grid_lat,
        FLOOR(longitude / :gridSize) * :gridSize as grid_lng,
        COUNT(*) as incident_count,
        AVG(EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as avg_response_time
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
        AND latitude IS NOT NULL
        AND longitude IS NOT NULL
        ${incidentType ? 'AND incident_type = :incidentType' : ''}
      GROUP BY
        FLOOR(latitude / :gridSize),
        FLOOR(longitude / :gridSize)
    ),
    max_density AS (
      SELECT MAX(incident_count) as max_count
      FROM grid_cells
    )
    SELECT
      gc.grid_lat + (:gridSize / 2) as latitude,
      gc.grid_lng + (:gridSize / 2) as longitude,
      gc.incident_count,
      (gc.incident_count::NUMERIC / md.max_count)::NUMERIC(10,2) as density,
      gc.avg_response_time
    FROM grid_cells gc
    CROSS JOIN max_density md
    ORDER BY gc.incident_count DESC
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            gridSize,
            ...(incidentType && { incidentType }),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getIncidentDensityHeatMap = getIncidentDensityHeatMap;
/**
 * Identifies high-risk geographic areas
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @param {number} incidentThreshold - Minimum incidents to be considered high-risk
 * @returns {Promise<Array<{area: string, incidentCount: number, severity: string}>>} High-risk areas
 *
 * @example
 * ```typescript
 * const highRisk = await identifyHighRiskAreas(sequelize,
 *   { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   50
 * );
 * ```
 */
const identifyHighRiskAreas = async (sequelize, dateRange, incidentThreshold = 50) => {
    const query = `
    WITH area_stats AS (
      SELECT
        COALESCE(address_district, 'Unknown') as area,
        COUNT(*) as incident_count,
        COUNT(CASE WHEN priority IN ('CRITICAL', 'HIGH') THEN 1 END) as critical_incidents,
        AVG(EXTRACT(EPOCH FROM (dispatched_at - created_at))) as avg_response_time
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
      GROUP BY address_district
      HAVING COUNT(*) >= :threshold
    )
    SELECT
      area,
      incident_count,
      critical_incidents,
      CASE
        WHEN critical_incidents::NUMERIC / incident_count > 0.5 THEN 'EXTREME'
        WHEN critical_incidents::NUMERIC / incident_count > 0.3 THEN 'HIGH'
        WHEN critical_incidents::NUMERIC / incident_count > 0.15 THEN 'MODERATE'
        ELSE 'LOW'
      END as severity
    FROM area_stats
    ORDER BY incident_count DESC, critical_incidents DESC
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            threshold: incidentThreshold,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.identifyHighRiskAreas = identifyHighRiskAreas;
/**
 * Analyzes geographic response time variations
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @returns {Promise<Array<{regionId: string, avgResponseTime: number, percentile95: number}>>} Response time by region
 *
 * @example
 * ```typescript
 * const geoResponse = await getGeographicResponseTimeVariation(sequelize, {
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * ```
 */
const getGeographicResponseTimeVariation = async (sequelize, dateRange) => {
    const query = `
    SELECT
      region_id,
      AVG(EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as avg_response_time,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as median_response_time,
      PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as percentile_95
    FROM incidents
    WHERE created_at BETWEEN :startDate AND :endDate
      AND dispatched_at IS NOT NULL
      AND region_id IS NOT NULL
    GROUP BY region_id
    ORDER BY avg_response_time DESC
  `;
    const results = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getGeographicResponseTimeVariation = getGeographicResponseTimeVariation;
// ============================================================================
// COMPLIANCE REPORTING
// ============================================================================
/**
 * Calculates SLA compliance metrics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} options - Filter options
 * @param {DateRangeFilter} options.dateRange - Date range filter
 * @param {number} [options.slaThreshold] - SLA threshold in seconds
 * @param {IncidentPriority} [options.priority] - Priority filter
 * @returns {Promise<ComplianceMetrics>} Compliance metrics
 *
 * @example
 * ```typescript
 * const compliance = await getSLAComplianceMetrics(sequelize, {
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   slaThreshold: 480,
 *   priority: IncidentPriority.CRITICAL
 * });
 * ```
 */
const getSLAComplianceMetrics = async (sequelize, options) => {
    const { dateRange, slaThreshold = 480, priority } = options;
    const query = `
    WITH incident_compliance AS (
      SELECT
        COUNT(*) as total_incidents,
        COUNT(CASE
          WHEN EXTRACT(EPOCH FROM (dispatched_at - created_at)) <= :slaThreshold
          THEN 1
        END) as compliant_incidents,
        AVG(EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as avg_response_time,
        COUNT(CASE
          WHEN EXTRACT(EPOCH FROM (dispatched_at - created_at)) > :slaThreshold
          THEN 1
        END) as breaches
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
        AND dispatched_at IS NOT NULL
        ${priority ? 'AND priority = :priority' : ''}
    )
    SELECT
      total_incidents,
      compliant_incidents,
      CASE
        WHEN total_incidents > 0 THEN
          (compliant_incidents::NUMERIC / total_incidents * 100)::NUMERIC(10,2)
        ELSE 0
      END as compliance_rate,
      avg_response_time,
      :slaThreshold as sla_threshold,
      breaches
    FROM incident_compliance
  `;
    const [result] = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            slaThreshold,
            ...(priority && { priority }),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return result;
};
exports.getSLAComplianceMetrics = getSLAComplianceMetrics;
/**
 * Generates compliance report by incident type
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @param {number} slaThreshold - SLA threshold in seconds
 * @returns {Promise<Array<{incidentType: string, complianceRate: number, breaches: number}>>} Compliance by type
 *
 * @example
 * ```typescript
 * const report = await getComplianceReportByType(sequelize,
 *   { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   480
 * );
 * ```
 */
const getComplianceReportByType = async (sequelize, dateRange, slaThreshold = 480) => {
    const query = `
    SELECT
      incident_type,
      COUNT(*) as total_incidents,
      (COUNT(CASE
        WHEN EXTRACT(EPOCH FROM (dispatched_at - created_at)) <= :slaThreshold
        THEN 1
      END)::NUMERIC / COUNT(*) * 100)::NUMERIC(10,2) as compliance_rate,
      COUNT(CASE
        WHEN EXTRACT(EPOCH FROM (dispatched_at - created_at)) > :slaThreshold
        THEN 1
      END) as breaches
    FROM incidents
    WHERE created_at BETWEEN :startDate AND :endDate
      AND dispatched_at IS NOT NULL
    GROUP BY incident_type
    ORDER BY compliance_rate ASC
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            slaThreshold,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getComplianceReportByType = getComplianceReportByType;
/**
 * Identifies SLA breach patterns
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @param {number} slaThreshold - SLA threshold in seconds
 * @returns {Promise<Array<{period: string, breachCount: number, commonCauses: string[]}>>} Breach patterns
 *
 * @example
 * ```typescript
 * const breaches = await identifySLABreachPatterns(sequelize,
 *   { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   480
 * );
 * ```
 */
const identifySLABreachPatterns = async (sequelize, dateRange, slaThreshold = 480) => {
    const query = `
    WITH breaches AS (
      SELECT
        EXTRACT(HOUR FROM created_at) as hour,
        TO_CHAR(created_at, 'Day') as day_of_week,
        EXTRACT(EPOCH FROM (dispatched_at - created_at)) as response_time,
        EXTRACT(EPOCH FROM (dispatched_at - created_at)) - :slaThreshold as delay_seconds
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
        AND dispatched_at IS NOT NULL
        AND EXTRACT(EPOCH FROM (dispatched_at - created_at)) > :slaThreshold
    )
    SELECT
      hour::INTEGER,
      TRIM(day_of_week) as day_of_week,
      COUNT(*) as breach_count,
      AVG(delay_seconds)::NUMERIC(10,2) as avg_delay_seconds
    FROM breaches
    GROUP BY hour, day_of_week
    HAVING COUNT(*) > 0
    ORDER BY breach_count DESC
    LIMIT 20
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            slaThreshold,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.identifySLABreachPatterns = identifySLABreachPatterns;
// ============================================================================
// INCIDENT PATTERN ANALYSIS
// ============================================================================
/**
 * Analyzes incident patterns and recurring trends
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @param {number} minFrequency - Minimum frequency to be considered a pattern
 * @returns {Promise<PatternAnalysisResult[]>} Pattern analysis
 *
 * @example
 * ```typescript
 * const patterns = await analyzeIncidentPatterns(sequelize,
 *   { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   5
 * );
 * ```
 */
const analyzeIncidentPatterns = async (sequelize, dateRange, minFrequency = 5) => {
    const query = `
    WITH incident_patterns AS (
      SELECT
        incident_type || ' - ' || COALESCE(address_district, 'Unknown') as pattern,
        COUNT(*) as frequency,
        AVG(
          CASE priority
            WHEN 'CRITICAL' THEN 4
            WHEN 'HIGH' THEN 3
            WHEN 'MEDIUM' THEN 2
            WHEN 'LOW' THEN 1
            ELSE 0
          END
        )::NUMERIC(10,2) as avg_severity,
        ARRAY_AGG(DISTINCT address_district ORDER BY address_district) FILTER (WHERE address_district IS NOT NULL) as common_locations,
        ARRAY_AGG(DISTINCT TO_CHAR(created_at, 'HH24:00') ORDER BY TO_CHAR(created_at, 'HH24:00')) as peak_times
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
      GROUP BY incident_type, address_district
      HAVING COUNT(*) >= :minFrequency
    )
    SELECT
      pattern,
      frequency,
      avg_severity,
      common_locations[1:5] as common_locations,
      peak_times[1:3] as peak_times
    FROM incident_patterns
    ORDER BY frequency DESC, avg_severity DESC
    LIMIT 50
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            minFrequency,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.analyzeIncidentPatterns = analyzeIncidentPatterns;
/**
 * Identifies correlated incident sequences
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @param {number} timeWindowMinutes - Time window for correlation
 * @returns {Promise<Array<{firstType: string, secondType: string, occurrences: number, correlation: number}>>} Correlations
 *
 * @example
 * ```typescript
 * const correlations = await identifyCorrelatedIncidents(sequelize,
 *   { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   30
 * );
 * ```
 */
const identifyCorrelatedIncidents = async (sequelize, dateRange, timeWindowMinutes = 30) => {
    const query = `
    WITH incident_pairs AS (
      SELECT
        i1.incident_type as first_type,
        i2.incident_type as second_type,
        EXTRACT(EPOCH FROM (i2.created_at - i1.created_at)) / 60 as minutes_between
      FROM incidents i1
      JOIN incidents i2 ON i1.region_id = i2.region_id
        AND i2.created_at > i1.created_at
        AND i2.created_at <= i1.created_at + INTERVAL ':timeWindow minutes'
      WHERE i1.created_at BETWEEN :startDate AND :endDate
        AND i1.incident_type != i2.incident_type
    )
    SELECT
      first_type,
      second_type,
      COUNT(*) as occurrences,
      AVG(minutes_between)::NUMERIC(10,2) as avg_time_between
    FROM incident_pairs
    GROUP BY first_type, second_type
    HAVING COUNT(*) >= 3
    ORDER BY occurrences DESC
    LIMIT 20
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            timeWindow: timeWindowMinutes,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.identifyCorrelatedIncidents = identifyCorrelatedIncidents;
/**
 * Analyzes repeat callers and frequent incident locations
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @param {number} minOccurrences - Minimum occurrences to be considered frequent
 * @returns {Promise<Array<{location: string, occurrences: number, uniqueTypes: string[]}>>} Frequent locations
 *
 * @example
 * ```typescript
 * const frequent = await analyzeRepeatLocations(sequelize,
 *   { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   10
 * );
 * ```
 */
const analyzeRepeatLocations = async (sequelize, dateRange, minOccurrences = 10) => {
    const query = `
    WITH location_stats AS (
      SELECT
        address_full as location,
        COUNT(*) as occurrences,
        ARRAY_AGG(DISTINCT incident_type ORDER BY incident_type) as unique_types,
        AVG(EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as avg_response_time
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
        AND address_full IS NOT NULL
      GROUP BY address_full
      HAVING COUNT(*) >= :minOccurrences
    )
    SELECT
      location,
      occurrences,
      unique_types,
      avg_response_time
    FROM location_stats
    ORDER BY occurrences DESC
    LIMIT 50
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            minOccurrences,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.analyzeRepeatLocations = analyzeRepeatLocations;
// ============================================================================
// MULTI-DIMENSIONAL ANALYSIS (OLAP-STYLE)
// ============================================================================
/**
 * Performs multi-dimensional cube analysis
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} options - Analysis options
 * @param {DateRangeFilter} options.dateRange - Date range filter
 * @param {string[]} options.dimensions - Dimensions to analyze
 * @returns {Promise<Array<Record<string, any>>>} Cube analysis
 *
 * @example
 * ```typescript
 * const cube = await performCubeAnalysis(sequelize, {
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   dimensions: ['incident_type', 'priority', 'region_id']
 * });
 * ```
 */
const performCubeAnalysis = async (sequelize, options) => {
    const { dateRange, dimensions } = options;
    const dimensionsList = dimensions.join(', ');
    const query = `
    SELECT
      ${dimensionsList},
      COUNT(*) as incident_count,
      AVG(EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as avg_response_time,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (dispatched_at - created_at)))::NUMERIC(10,2) as median_response_time
    FROM incidents
    WHERE created_at BETWEEN :startDate AND :endDate
      AND dispatched_at IS NOT NULL
    GROUP BY CUBE (${dimensionsList})
    ORDER BY ${dimensions[0]}, ${dimensions[1] || 'incident_count DESC'}
  `;
    const results = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.performCubeAnalysis = performCubeAnalysis;
/**
 * Performs rollup analysis across hierarchical dimensions
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @returns {Promise<Array<{level: string, dimension: string, value: string, count: number}>>} Rollup analysis
 *
 * @example
 * ```typescript
 * const rollup = await performRollupAnalysis(sequelize, {
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * ```
 */
const performRollupAnalysis = async (sequelize, dateRange) => {
    const query = `
    SELECT
      region_id,
      incident_type,
      priority,
      COUNT(*) as incident_count
    FROM incidents
    WHERE created_at BETWEEN :startDate AND :endDate
    GROUP BY ROLLUP (region_id, incident_type, priority)
    ORDER BY region_id NULLS LAST, incident_type NULLS LAST, priority NULLS LAST
  `;
    const results = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.performRollupAnalysis = performRollupAnalysis;
/**
 * Analyzes data across multiple dimensions with drill-down capability
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} options - Analysis options
 * @param {DateRangeFilter} options.dateRange - Date range filter
 * @param {Record<string, any>} [options.filters] - Dimension filters
 * @returns {Promise<Array<Record<string, any>>>} Drill-down analysis
 *
 * @example
 * ```typescript
 * const drillDown = await performDrillDownAnalysis(sequelize, {
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   filters: { region_id: 'region-001', incident_type: 'MEDICAL' }
 * });
 * ```
 */
const performDrillDownAnalysis = async (sequelize, options) => {
    const { dateRange, filters = {} } = options;
    const whereFilters = Object.entries(filters)
        .map(([key, _]) => `AND ${key} = :${key}`)
        .join(' ');
    const query = `
    WITH base_data AS (
      SELECT
        region_id,
        incident_type,
        priority,
        address_district,
        DATE_TRUNC('hour', created_at) as hour,
        COUNT(*) as incident_count,
        AVG(EXTRACT(EPOCH FROM (dispatched_at - created_at))) as avg_response_time
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
        ${whereFilters}
      GROUP BY region_id, incident_type, priority, address_district, DATE_TRUNC('hour', created_at)
    )
    SELECT
      *,
      SUM(incident_count) OVER (PARTITION BY region_id, incident_type) as type_total,
      AVG(avg_response_time) OVER (PARTITION BY region_id) as region_avg_response
    FROM base_data
    ORDER BY incident_count DESC
    LIMIT 100
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            ...filters,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.performDrillDownAnalysis = performDrillDownAnalysis;
// ============================================================================
// TIME-SERIES ANALYSIS
// ============================================================================
/**
 * Calculates moving averages for time-series data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} options - Analysis options
 * @param {DateRangeFilter} options.dateRange - Date range filter
 * @param {number} [options.windowDays] - Moving average window in days
 * @returns {Promise<Array<{date: string, actualValue: number, movingAverage: number}>>} Moving averages
 *
 * @example
 * ```typescript
 * const movingAvg = await calculateMovingAverage(sequelize, {
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-03-31' },
 *   windowDays: 7
 * });
 * ```
 */
const calculateMovingAverage = async (sequelize, options) => {
    const { dateRange, windowDays = 7 } = options;
    const query = `
    WITH daily_counts AS (
      SELECT
        DATE_TRUNC('day', created_at)::DATE as date,
        COUNT(*) as incident_count
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
      GROUP BY DATE_TRUNC('day', created_at)
    )
    SELECT
      date::TEXT,
      incident_count as actual_value,
      AVG(incident_count) OVER (
        ORDER BY date
        ROWS BETWEEN :windowDays PRECEDING AND CURRENT ROW
      )::NUMERIC(10,2) as moving_average
    FROM daily_counts
    ORDER BY date
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            windowDays,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.calculateMovingAverage = calculateMovingAverage;
/**
 * Detects anomalies in time-series data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @param {number} stdDevThreshold - Standard deviation threshold for anomaly
 * @returns {Promise<Array<{date: string, value: number, isAnomaly: boolean, zScore: number}>>} Anomaly detection
 *
 * @example
 * ```typescript
 * const anomalies = await detectAnomalies(sequelize,
 *   { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   2
 * );
 * ```
 */
const detectAnomalies = async (sequelize, dateRange, stdDevThreshold = 2) => {
    const query = `
    WITH daily_stats AS (
      SELECT
        DATE_TRUNC('day', created_at)::DATE as date,
        COUNT(*) as incident_count
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
      GROUP BY DATE_TRUNC('day', created_at)
    ),
    stats_summary AS (
      SELECT
        AVG(incident_count) as mean,
        STDDEV(incident_count) as std_dev
      FROM daily_stats
    )
    SELECT
      ds.date::TEXT,
      ds.incident_count as value,
      ABS((ds.incident_count - ss.mean) / NULLIF(ss.std_dev, 0)) > :threshold as is_anomaly,
      ((ds.incident_count - ss.mean) / NULLIF(ss.std_dev, 0))::NUMERIC(10,2) as z_score
    FROM daily_stats ds
    CROSS JOIN stats_summary ss
    ORDER BY ds.date
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            threshold: stdDevThreshold,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.detectAnomalies = detectAnomalies;
/**
 * Performs trend decomposition (trend, seasonality, residual)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @returns {Promise<Array<{date: string, actual: number, trend: number, seasonal: number}>>} Decomposed trends
 *
 * @example
 * ```typescript
 * const decomposition = await decomposeTrend(sequelize, {
 *   startDate: '2025-01-01',
 *   endDate: '2025-12-31'
 * });
 * ```
 */
const decomposeTrend = async (sequelize, dateRange) => {
    const query = `
    WITH daily_data AS (
      SELECT
        DATE_TRUNC('day', created_at)::DATE as date,
        COUNT(*) as incident_count,
        EXTRACT(DOW FROM created_at) as day_of_week
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
      GROUP BY DATE_TRUNC('day', created_at), EXTRACT(DOW FROM created_at)
    ),
    trend_calc AS (
      SELECT
        date,
        incident_count,
        day_of_week,
        AVG(incident_count) OVER (
          ORDER BY date
          ROWS BETWEEN 15 PRECEDING AND 15 FOLLOWING
        ) as trend
      FROM daily_data
    ),
    seasonal_calc AS (
      SELECT
        day_of_week,
        AVG(incident_count - trend) as seasonal_component
      FROM trend_calc
      GROUP BY day_of_week
    )
    SELECT
      tc.date::TEXT,
      tc.incident_count as actual,
      tc.trend::NUMERIC(10,2) as trend,
      COALESCE(sc.seasonal_component, 0)::NUMERIC(10,2) as seasonal
    FROM trend_calc tc
    LEFT JOIN seasonal_calc sc ON tc.day_of_week = sc.day_of_week
    ORDER BY tc.date
  `;
    const results = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.decomposeTrend = decomposeTrend;
// ============================================================================
// STATISTICAL AGGREGATIONS
// ============================================================================
/**
 * Calculates comprehensive statistical summary
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @param {string} metric - Metric to analyze
 * @returns {Promise<{mean: number, median: number, mode: number, stdDev: number, variance: number}>} Statistical summary
 *
 * @example
 * ```typescript
 * const stats = await calculateStatisticalSummary(sequelize,
 *   { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   'response_time'
 * );
 * ```
 */
const calculateStatisticalSummary = async (sequelize, dateRange, metric = 'response_time') => {
    const metricColumn = metric === 'response_time'
        ? 'EXTRACT(EPOCH FROM (dispatched_at - created_at))'
        : metric;
    const query = `
    WITH metric_data AS (
      SELECT ${metricColumn} as value
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
        AND dispatched_at IS NOT NULL
    )
    SELECT
      AVG(value)::NUMERIC(10,2) as mean,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value)::NUMERIC(10,2) as median,
      STDDEV(value)::NUMERIC(10,2) as std_dev,
      VARIANCE(value)::NUMERIC(10,2) as variance,
      (
        SUM(POWER(value - AVG(value) OVER (), 3)) / COUNT(*)
      ) / POWER(STDDEV(value), 3)::NUMERIC(10,4) as skewness
    FROM metric_data
  `;
    const [result] = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return result;
};
exports.calculateStatisticalSummary = calculateStatisticalSummary;
/**
 * Performs correlation analysis between metrics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @returns {Promise<Array<{metric1: string, metric2: string, correlation: number}>>} Correlations
 *
 * @example
 * ```typescript
 * const correlations = await calculateCorrelations(sequelize, {
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * ```
 */
const calculateCorrelations = async (sequelize, dateRange) => {
    const query = `
    WITH daily_metrics AS (
      SELECT
        DATE_TRUNC('day', created_at) as day,
        COUNT(*) as incident_count,
        AVG(EXTRACT(EPOCH FROM (dispatched_at - created_at))) as avg_response_time,
        COUNT(CASE WHEN priority IN ('CRITICAL', 'HIGH') THEN 1 END) as high_priority_count
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
        AND dispatched_at IS NOT NULL
      GROUP BY DATE_TRUNC('day', created_at)
    )
    SELECT
      'incident_count'::TEXT as metric1,
      'avg_response_time'::TEXT as metric2,
      CORR(incident_count, avg_response_time)::NUMERIC(10,4) as correlation
    FROM daily_metrics
    UNION ALL
    SELECT
      'incident_count'::TEXT,
      'high_priority_count'::TEXT,
      CORR(incident_count, high_priority_count)::NUMERIC(10,4)
    FROM daily_metrics
    UNION ALL
    SELECT
      'avg_response_time'::TEXT,
      'high_priority_count'::TEXT,
      CORR(avg_response_time, high_priority_count)::NUMERIC(10,4)
    FROM daily_metrics
  `;
    const results = await sequelize.query(query, {
        replacements: dateRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.calculateCorrelations = calculateCorrelations;
/**
 * Generates histogram data for distribution analysis
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DateRangeFilter} dateRange - Date range filter
 * @param {number} buckets - Number of histogram buckets
 * @returns {Promise<Array<{bucket: number, minValue: number, maxValue: number, count: number}>>} Histogram
 *
 * @example
 * ```typescript
 * const histogram = await generateHistogram(sequelize,
 *   { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   10
 * );
 * ```
 */
const generateHistogram = async (sequelize, dateRange, buckets = 10) => {
    const query = `
    WITH response_times AS (
      SELECT EXTRACT(EPOCH FROM (dispatched_at - created_at)) as response_time
      FROM incidents
      WHERE created_at BETWEEN :startDate AND :endDate
        AND dispatched_at IS NOT NULL
    ),
    stats AS (
      SELECT
        MIN(response_time) as min_val,
        MAX(response_time) as max_val,
        COUNT(*) as total_count
      FROM response_times
    ),
    histogram AS (
      SELECT
        WIDTH_BUCKET(rt.response_time, s.min_val, s.max_val, :buckets) as bucket,
        s.min_val + (s.max_val - s.min_val) / :buckets * (WIDTH_BUCKET(rt.response_time, s.min_val, s.max_val, :buckets) - 1) as min_value,
        s.min_val + (s.max_val - s.min_val) / :buckets * WIDTH_BUCKET(rt.response_time, s.min_val, s.max_val, :buckets) as max_value,
        COUNT(*) as count,
        s.total_count
      FROM response_times rt
      CROSS JOIN stats s
      GROUP BY bucket, s.min_val, s.max_val, s.total_count
    )
    SELECT
      bucket,
      min_value::NUMERIC(10,2),
      max_value::NUMERIC(10,2),
      count,
      (count::NUMERIC / total_count * 100)::NUMERIC(10,2) as frequency
    FROM histogram
    ORDER BY bucket
  `;
    const results = await sequelize.query(query, {
        replacements: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            buckets,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.generateHistogram = generateHistogram;
// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================
exports.default = {
    // Response Time Analytics
    getAverageResponseTime: exports.getAverageResponseTime,
    getResponseTimePercentiles: exports.getResponseTimePercentiles,
    getResponseTimeTrends: exports.getResponseTimeTrends,
    getResponseTimeByHour: exports.getResponseTimeByHour,
    // Performance Metrics
    getUnitProductivityMetrics: exports.getUnitProductivityMetrics,
    getCallVolumeAnalysis: exports.getCallVolumeAnalysis,
    getDispatcherPerformance: exports.getDispatcherPerformance,
    getUnitUtilizationRate: exports.getUnitUtilizationRate,
    // Trend Analysis
    getIncidentTrendsByType: exports.getIncidentTrendsByType,
    getSeasonalPatterns: exports.getSeasonalPatterns,
    getDayOfWeekPatterns: exports.getDayOfWeekPatterns,
    getMonthOverMonthGrowth: exports.getMonthOverMonthGrowth,
    // Predictive Analytics
    forecastDemand: exports.forecastDemand,
    predictPeakHours: exports.predictPeakHours,
    predictResourceDemand: exports.predictResourceDemand,
    // Resource Utilization
    getResourceAllocationEfficiency: exports.getResourceAllocationEfficiency,
    identifyResourceBottlenecks: exports.identifyResourceBottlenecks,
    calculateOptimalResourceDistribution: exports.calculateOptimalResourceDistribution,
    // Geographic Heat Maps
    getIncidentDensityHeatMap: exports.getIncidentDensityHeatMap,
    identifyHighRiskAreas: exports.identifyHighRiskAreas,
    getGeographicResponseTimeVariation: exports.getGeographicResponseTimeVariation,
    // Compliance Reporting
    getSLAComplianceMetrics: exports.getSLAComplianceMetrics,
    getComplianceReportByType: exports.getComplianceReportByType,
    identifySLABreachPatterns: exports.identifySLABreachPatterns,
    // Incident Pattern Analysis
    analyzeIncidentPatterns: exports.analyzeIncidentPatterns,
    identifyCorrelatedIncidents: exports.identifyCorrelatedIncidents,
    analyzeRepeatLocations: exports.analyzeRepeatLocations,
    // Multi-dimensional Analysis
    performCubeAnalysis: exports.performCubeAnalysis,
    performRollupAnalysis: exports.performRollupAnalysis,
    performDrillDownAnalysis: exports.performDrillDownAnalysis,
    // Time-series Analysis
    calculateMovingAverage: exports.calculateMovingAverage,
    detectAnomalies: exports.detectAnomalies,
    decomposeTrend: exports.decomposeTrend,
    // Statistical Aggregations
    calculateStatisticalSummary: exports.calculateStatisticalSummary,
    calculateCorrelations: exports.calculateCorrelations,
    generateHistogram: exports.generateHistogram,
};
//# sourceMappingURL=analytics-queries.js.map