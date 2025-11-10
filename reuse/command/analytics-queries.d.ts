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
import { Sequelize } from 'sequelize';
/**
 * @enum TimeGranularity
 * @description Time grouping granularity for analytics
 */
export declare enum TimeGranularity {
    HOUR = "hour",
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    QUARTER = "quarter",
    YEAR = "year"
}
/**
 * @enum IncidentPriority
 * @description Incident priority levels
 */
export declare enum IncidentPriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
/**
 * @enum IncidentType
 * @description Types of emergency incidents
 */
export declare enum IncidentType {
    MEDICAL = "MEDICAL",
    FIRE = "FIRE",
    TRAUMA = "TRAUMA",
    CARDIAC = "CARDIAC",
    RESPIRATORY = "RESPIRATORY",
    PSYCHIATRIC = "PSYCHIATRIC",
    OTHER = "OTHER"
}
/**
 * @interface DateRangeFilter
 * @description Date range for analytics queries
 */
export interface DateRangeFilter {
    startDate: Date | string;
    endDate: Date | string;
}
/**
 * @interface ResponseTimeMetrics
 * @description Response time analytics result
 */
export interface ResponseTimeMetrics {
    averageSeconds: number;
    medianSeconds: number;
    minSeconds: number;
    maxSeconds: number;
    stdDevSeconds: number;
    totalIncidents: number;
}
/**
 * @interface PercentileResult
 * @description Percentile calculation result
 */
export interface PercentileResult {
    percentile: number;
    value: number;
}
/**
 * @interface TrendDataPoint
 * @description Time-series trend data point
 */
export interface TrendDataPoint {
    period: string;
    value: number;
    change?: number;
    percentChange?: number;
}
/**
 * @interface ProductivityMetrics
 * @description Unit productivity metrics
 */
export interface ProductivityMetrics {
    unitId: string;
    totalCalls: number;
    completedCalls: number;
    avgResponseTime: number;
    utilizationRate: number;
    idleTime: number;
    activeTime: number;
}
/**
 * @interface GeoHeatMapPoint
 * @description Geographic heat map data point
 */
export interface GeoHeatMapPoint {
    latitude: number;
    longitude: number;
    incidentCount: number;
    density: number;
    avgResponseTime?: number;
}
/**
 * @interface ComplianceMetrics
 * @description SLA compliance metrics
 */
export interface ComplianceMetrics {
    totalIncidents: number;
    compliantIncidents: number;
    complianceRate: number;
    avgResponseTime: number;
    slaThreshold: number;
    breaches: number;
}
/**
 * @interface ForecastResult
 * @description Demand forecast result
 */
export interface ForecastResult {
    date: Date;
    predictedVolume: number;
    confidence: number;
    trend: 'up' | 'down' | 'stable';
}
/**
 * @interface WorkloadMetrics
 * @description Dispatcher workload metrics
 */
export interface WorkloadMetrics {
    dispatcherId: string;
    totalDispatches: number;
    avgHandlingTime: number;
    peakHourDispatches: number;
    concurrentCalls: number;
    efficiency: number;
}
/**
 * @interface PatternAnalysisResult
 * @description Incident pattern analysis
 */
export interface PatternAnalysisResult {
    pattern: string;
    frequency: number;
    avgSeverity: number;
    commonLocations: string[];
    peakTimes: string[];
}
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
export declare const getAverageResponseTime: (sequelize: Sequelize, options: {
    dateRange: DateRangeFilter;
    incidentType?: IncidentType;
    priority?: IncidentPriority;
    regionId?: string;
}) => Promise<ResponseTimeMetrics>;
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
export declare const getResponseTimePercentiles: (sequelize: Sequelize, options: {
    dateRange: DateRangeFilter;
    percentiles?: number[];
    incidentType?: IncidentType;
}) => Promise<PercentileResult[]>;
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
export declare const getResponseTimeTrends: (sequelize: Sequelize, options: {
    dateRange: DateRangeFilter;
    granularity?: TimeGranularity;
    incidentType?: IncidentType;
}) => Promise<TrendDataPoint[]>;
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
export declare const getResponseTimeByHour: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
    hour: number;
    avgResponseTime: number;
    incidentCount: number;
}>>;
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
export declare const getUnitProductivityMetrics: (sequelize: Sequelize, options: {
    unitId?: string;
    dateRange: DateRangeFilter;
}) => Promise<ProductivityMetrics[]>;
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
export declare const getCallVolumeAnalysis: (sequelize: Sequelize, options: {
    dateRange: DateRangeFilter;
    groupBy?: TimeGranularity;
    dayOfWeek?: string[];
}) => Promise<Array<{
    period: string;
    callVolume: number;
    avgPriority: number;
}>>;
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
export declare const getDispatcherPerformance: (sequelize: Sequelize, options: {
    dispatcherId?: string;
    dateRange: DateRangeFilter;
}) => Promise<WorkloadMetrics[]>;
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
export declare const getUnitUtilizationRate: (sequelize: Sequelize, dateRange: DateRangeFilter, granularity?: TimeGranularity) => Promise<Array<{
    period: string;
    utilizationRate: number;
    activeUnits: number;
}>>;
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
export declare const getIncidentTrendsByType: (sequelize: Sequelize, dateRange: DateRangeFilter, granularity?: TimeGranularity) => Promise<Array<{
    period: string;
    incidentType: string;
    count: number;
    percentOfTotal: number;
}>>;
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
export declare const getSeasonalPatterns: (sequelize: Sequelize, yearsBack?: number) => Promise<Array<{
    month: number;
    monthName: string;
    avgIncidents: number;
    stdDev: number;
}>>;
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
export declare const getDayOfWeekPatterns: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
    dayOfWeek: string;
    dayNumber: number;
    avgIncidents: number;
    peakHour: number;
}>>;
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
export declare const getMonthOverMonthGrowth: (sequelize: Sequelize, monthsBack?: number, incidentType?: IncidentType) => Promise<Array<{
    month: string;
    incidents: number;
    growthRate: number;
}>>;
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
export declare const forecastDemand: (sequelize: Sequelize, options: {
    forecastDays: number;
    historicalDays?: number;
    incidentType?: IncidentType;
}) => Promise<ForecastResult[]>;
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
export declare const predictPeakHours: (sequelize: Sequelize, daysBack?: number, regionId?: string) => Promise<Array<{
    hour: number;
    probability: number;
    avgIncidents: number;
}>>;
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
export declare const predictResourceDemand: (sequelize: Sequelize, dateRange: DateRangeFilter, granularity?: TimeGranularity) => Promise<Array<{
    period: string;
    requiredUnits: number;
    predictedIncidents: number;
    capacityGap: number;
}>>;
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
export declare const getResourceAllocationEfficiency: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
    resourceType: string;
    totalUnits: number;
    utilizationRate: number;
    avgResponseTime: number;
}>>;
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
export declare const identifyResourceBottlenecks: (sequelize: Sequelize, dateRange: DateRangeFilter, thresholdUtilization?: number) => Promise<Array<{
    period: string;
    resourceType: string;
    utilizationRate: number;
    queueLength: number;
}>>;
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
export declare const calculateOptimalResourceDistribution: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
    regionId: string;
    currentUnits: number;
    optimalUnits: number;
    deficit: number;
}>>;
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
export declare const getIncidentDensityHeatMap: (sequelize: Sequelize, options: {
    dateRange: DateRangeFilter;
    gridSize?: number;
    incidentType?: IncidentType;
}) => Promise<GeoHeatMapPoint[]>;
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
export declare const identifyHighRiskAreas: (sequelize: Sequelize, dateRange: DateRangeFilter, incidentThreshold?: number) => Promise<Array<{
    area: string;
    incidentCount: number;
    criticalIncidents: number;
    severity: string;
}>>;
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
export declare const getGeographicResponseTimeVariation: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
    regionId: string;
    avgResponseTime: number;
    medianResponseTime: number;
    percentile95: number;
}>>;
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
export declare const getSLAComplianceMetrics: (sequelize: Sequelize, options: {
    dateRange: DateRangeFilter;
    slaThreshold?: number;
    priority?: IncidentPriority;
}) => Promise<ComplianceMetrics>;
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
export declare const getComplianceReportByType: (sequelize: Sequelize, dateRange: DateRangeFilter, slaThreshold?: number) => Promise<Array<{
    incidentType: string;
    totalIncidents: number;
    complianceRate: number;
    breaches: number;
}>>;
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
export declare const identifySLABreachPatterns: (sequelize: Sequelize, dateRange: DateRangeFilter, slaThreshold?: number) => Promise<Array<{
    hour: number;
    dayOfWeek: string;
    breachCount: number;
    avgDelaySeconds: number;
}>>;
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
export declare const analyzeIncidentPatterns: (sequelize: Sequelize, dateRange: DateRangeFilter, minFrequency?: number) => Promise<PatternAnalysisResult[]>;
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
export declare const identifyCorrelatedIncidents: (sequelize: Sequelize, dateRange: DateRangeFilter, timeWindowMinutes?: number) => Promise<Array<{
    firstType: string;
    secondType: string;
    occurrences: number;
    avgTimeBetween: number;
}>>;
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
export declare const analyzeRepeatLocations: (sequelize: Sequelize, dateRange: DateRangeFilter, minOccurrences?: number) => Promise<Array<{
    location: string;
    occurrences: number;
    uniqueTypes: string[];
    avgResponseTime: number;
}>>;
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
export declare const performCubeAnalysis: (sequelize: Sequelize, options: {
    dateRange: DateRangeFilter;
    dimensions: string[];
}) => Promise<Array<Record<string, any>>>;
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
export declare const performRollupAnalysis: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
    regionId: string;
    incidentType: string;
    priority: string;
    incidentCount: number;
}>>;
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
export declare const performDrillDownAnalysis: (sequelize: Sequelize, options: {
    dateRange: DateRangeFilter;
    filters?: Record<string, any>;
}) => Promise<Array<Record<string, any>>>;
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
export declare const calculateMovingAverage: (sequelize: Sequelize, options: {
    dateRange: DateRangeFilter;
    windowDays?: number;
}) => Promise<Array<{
    date: string;
    actualValue: number;
    movingAverage: number;
}>>;
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
export declare const detectAnomalies: (sequelize: Sequelize, dateRange: DateRangeFilter, stdDevThreshold?: number) => Promise<Array<{
    date: string;
    value: number;
    isAnomaly: boolean;
    zScore: number;
}>>;
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
export declare const decomposeTrend: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
    date: string;
    actual: number;
    trend: number;
    seasonal: number;
}>>;
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
export declare const calculateStatisticalSummary: (sequelize: Sequelize, dateRange: DateRangeFilter, metric?: string) => Promise<{
    mean: number;
    median: number;
    stdDev: number;
    variance: number;
    skewness: number;
}>;
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
export declare const calculateCorrelations: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
    metric1: string;
    metric2: string;
    correlation: number;
}>>;
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
export declare const generateHistogram: (sequelize: Sequelize, dateRange: DateRangeFilter, buckets?: number) => Promise<Array<{
    bucket: number;
    minValue: number;
    maxValue: number;
    count: number;
    frequency: number;
}>>;
declare const _default: {
    getAverageResponseTime: (sequelize: Sequelize, options: {
        dateRange: DateRangeFilter;
        incidentType?: IncidentType;
        priority?: IncidentPriority;
        regionId?: string;
    }) => Promise<ResponseTimeMetrics>;
    getResponseTimePercentiles: (sequelize: Sequelize, options: {
        dateRange: DateRangeFilter;
        percentiles?: number[];
        incidentType?: IncidentType;
    }) => Promise<PercentileResult[]>;
    getResponseTimeTrends: (sequelize: Sequelize, options: {
        dateRange: DateRangeFilter;
        granularity?: TimeGranularity;
        incidentType?: IncidentType;
    }) => Promise<TrendDataPoint[]>;
    getResponseTimeByHour: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
        hour: number;
        avgResponseTime: number;
        incidentCount: number;
    }>>;
    getUnitProductivityMetrics: (sequelize: Sequelize, options: {
        unitId?: string;
        dateRange: DateRangeFilter;
    }) => Promise<ProductivityMetrics[]>;
    getCallVolumeAnalysis: (sequelize: Sequelize, options: {
        dateRange: DateRangeFilter;
        groupBy?: TimeGranularity;
        dayOfWeek?: string[];
    }) => Promise<Array<{
        period: string;
        callVolume: number;
        avgPriority: number;
    }>>;
    getDispatcherPerformance: (sequelize: Sequelize, options: {
        dispatcherId?: string;
        dateRange: DateRangeFilter;
    }) => Promise<WorkloadMetrics[]>;
    getUnitUtilizationRate: (sequelize: Sequelize, dateRange: DateRangeFilter, granularity?: TimeGranularity) => Promise<Array<{
        period: string;
        utilizationRate: number;
        activeUnits: number;
    }>>;
    getIncidentTrendsByType: (sequelize: Sequelize, dateRange: DateRangeFilter, granularity?: TimeGranularity) => Promise<Array<{
        period: string;
        incidentType: string;
        count: number;
        percentOfTotal: number;
    }>>;
    getSeasonalPatterns: (sequelize: Sequelize, yearsBack?: number) => Promise<Array<{
        month: number;
        monthName: string;
        avgIncidents: number;
        stdDev: number;
    }>>;
    getDayOfWeekPatterns: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
        dayOfWeek: string;
        dayNumber: number;
        avgIncidents: number;
        peakHour: number;
    }>>;
    getMonthOverMonthGrowth: (sequelize: Sequelize, monthsBack?: number, incidentType?: IncidentType) => Promise<Array<{
        month: string;
        incidents: number;
        growthRate: number;
    }>>;
    forecastDemand: (sequelize: Sequelize, options: {
        forecastDays: number;
        historicalDays?: number;
        incidentType?: IncidentType;
    }) => Promise<ForecastResult[]>;
    predictPeakHours: (sequelize: Sequelize, daysBack?: number, regionId?: string) => Promise<Array<{
        hour: number;
        probability: number;
        avgIncidents: number;
    }>>;
    predictResourceDemand: (sequelize: Sequelize, dateRange: DateRangeFilter, granularity?: TimeGranularity) => Promise<Array<{
        period: string;
        requiredUnits: number;
        predictedIncidents: number;
        capacityGap: number;
    }>>;
    getResourceAllocationEfficiency: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
        resourceType: string;
        totalUnits: number;
        utilizationRate: number;
        avgResponseTime: number;
    }>>;
    identifyResourceBottlenecks: (sequelize: Sequelize, dateRange: DateRangeFilter, thresholdUtilization?: number) => Promise<Array<{
        period: string;
        resourceType: string;
        utilizationRate: number;
        queueLength: number;
    }>>;
    calculateOptimalResourceDistribution: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
        regionId: string;
        currentUnits: number;
        optimalUnits: number;
        deficit: number;
    }>>;
    getIncidentDensityHeatMap: (sequelize: Sequelize, options: {
        dateRange: DateRangeFilter;
        gridSize?: number;
        incidentType?: IncidentType;
    }) => Promise<GeoHeatMapPoint[]>;
    identifyHighRiskAreas: (sequelize: Sequelize, dateRange: DateRangeFilter, incidentThreshold?: number) => Promise<Array<{
        area: string;
        incidentCount: number;
        criticalIncidents: number;
        severity: string;
    }>>;
    getGeographicResponseTimeVariation: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
        regionId: string;
        avgResponseTime: number;
        medianResponseTime: number;
        percentile95: number;
    }>>;
    getSLAComplianceMetrics: (sequelize: Sequelize, options: {
        dateRange: DateRangeFilter;
        slaThreshold?: number;
        priority?: IncidentPriority;
    }) => Promise<ComplianceMetrics>;
    getComplianceReportByType: (sequelize: Sequelize, dateRange: DateRangeFilter, slaThreshold?: number) => Promise<Array<{
        incidentType: string;
        totalIncidents: number;
        complianceRate: number;
        breaches: number;
    }>>;
    identifySLABreachPatterns: (sequelize: Sequelize, dateRange: DateRangeFilter, slaThreshold?: number) => Promise<Array<{
        hour: number;
        dayOfWeek: string;
        breachCount: number;
        avgDelaySeconds: number;
    }>>;
    analyzeIncidentPatterns: (sequelize: Sequelize, dateRange: DateRangeFilter, minFrequency?: number) => Promise<PatternAnalysisResult[]>;
    identifyCorrelatedIncidents: (sequelize: Sequelize, dateRange: DateRangeFilter, timeWindowMinutes?: number) => Promise<Array<{
        firstType: string;
        secondType: string;
        occurrences: number;
        avgTimeBetween: number;
    }>>;
    analyzeRepeatLocations: (sequelize: Sequelize, dateRange: DateRangeFilter, minOccurrences?: number) => Promise<Array<{
        location: string;
        occurrences: number;
        uniqueTypes: string[];
        avgResponseTime: number;
    }>>;
    performCubeAnalysis: (sequelize: Sequelize, options: {
        dateRange: DateRangeFilter;
        dimensions: string[];
    }) => Promise<Array<Record<string, any>>>;
    performRollupAnalysis: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
        regionId: string;
        incidentType: string;
        priority: string;
        incidentCount: number;
    }>>;
    performDrillDownAnalysis: (sequelize: Sequelize, options: {
        dateRange: DateRangeFilter;
        filters?: Record<string, any>;
    }) => Promise<Array<Record<string, any>>>;
    calculateMovingAverage: (sequelize: Sequelize, options: {
        dateRange: DateRangeFilter;
        windowDays?: number;
    }) => Promise<Array<{
        date: string;
        actualValue: number;
        movingAverage: number;
    }>>;
    detectAnomalies: (sequelize: Sequelize, dateRange: DateRangeFilter, stdDevThreshold?: number) => Promise<Array<{
        date: string;
        value: number;
        isAnomaly: boolean;
        zScore: number;
    }>>;
    decomposeTrend: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
        date: string;
        actual: number;
        trend: number;
        seasonal: number;
    }>>;
    calculateStatisticalSummary: (sequelize: Sequelize, dateRange: DateRangeFilter, metric?: string) => Promise<{
        mean: number;
        median: number;
        stdDev: number;
        variance: number;
        skewness: number;
    }>;
    calculateCorrelations: (sequelize: Sequelize, dateRange: DateRangeFilter) => Promise<Array<{
        metric1: string;
        metric2: string;
        correlation: number;
    }>>;
    generateHistogram: (sequelize: Sequelize, dateRange: DateRangeFilter, buckets?: number) => Promise<Array<{
        bucket: number;
        minValue: number;
        maxValue: number;
        count: number;
        frequency: number;
    }>>;
};
export default _default;
//# sourceMappingURL=analytics-queries.d.ts.map