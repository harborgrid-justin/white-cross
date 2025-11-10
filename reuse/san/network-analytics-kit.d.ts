/**
 * LOC: NETANLYT1234567
 * File: /reuse/san/network-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network analytics services
 *   - Monitoring dashboards
 *   - SAN reporting backend
 */
/**
 * File: /reuse/san/network-analytics-kit.ts
 * Locator: WC-UTL-NETANLYT-001
 * Purpose: Comprehensive Network Analytics Queries - traffic analysis, performance metrics, capacity planning, anomaly detection, trend analysis
 *
 * Upstream: Independent utility module for network analytics and reporting
 * Downstream: ../backend/*, Analytics services, monitoring systems, reporting engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+ with TimescaleDB
 * Exports: 42 utility functions for network analytics, traffic analysis, performance monitoring, capacity planning, anomaly detection
 *
 * LLM Context: Comprehensive network analytics utilities for implementing production-ready network monitoring, analysis, and forecasting.
 * Provides traffic analysis, performance metrics aggregation, capacity planning queries, anomaly detection algorithms, trend analysis,
 * time-series data processing, and network forecasting for enterprise virtual networks and SAN infrastructure.
 */
import { Sequelize } from 'sequelize';
interface CapacityForecast {
    nodeId: string;
    currentCapacity: number;
    currentUsage: number;
    forecastedUsage: number;
    forecastDate: Date;
    utilizationTrend: 'increasing' | 'decreasing' | 'stable';
    exhaustionDate?: Date;
}
interface TrendAnalysis {
    metricName: string;
    timeRange: {
        start: Date;
        end: Date;
    };
    dataPoints: Array<{
        timestamp: Date;
        value: number;
    }>;
    trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    changePercent: number;
    slope: number;
}
interface TimeSeriesData {
    timestamp: Date;
    value: number;
    metadata?: Record<string, any>;
}
interface ForecastResult {
    timestamps: Date[];
    values: number[];
    confidenceIntervals: Array<{
        lower: number;
        upper: number;
    }>;
    method: string;
    accuracy: number;
}
/**
 * Sequelize model for Network Traffic Metrics (time-series data).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TrafficMetrics model
 *
 * @example
 * ```typescript
 * const TrafficMetrics = createTrafficMetricsModel(sequelize);
 * const metrics = await TrafficMetrics.create({
 *   nodeId: 'node-sw-001',
 *   timestamp: new Date(),
 *   bytesIn: 1024000,
 *   bytesOut: 2048000,
 *   packetsIn: 1500,
 *   packetsOut: 2000
 * });
 * ```
 */
export declare const createTrafficMetricsModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        nodeId: string;
        timestamp: Date;
        bytesIn: number;
        bytesOut: number;
        packetsIn: number;
        packetsOut: number;
        connectionsActive: number;
        connectionsTotal: number;
        metadata: Record<string, any>;
    };
};
/**
 * Sequelize model for Performance Snapshots (time-series data).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PerformanceSnapshot model
 *
 * @example
 * ```typescript
 * const PerformanceSnapshot = createPerformanceSnapshotModel(sequelize);
 * const snapshot = await PerformanceSnapshot.create({
 *   nodeId: 'node-sw-001',
 *   timestamp: new Date(),
 *   cpuUsage: 45.5,
 *   memoryUsage: 62.3,
 *   networkThroughput: 8500
 * });
 * ```
 */
export declare const createPerformanceSnapshotModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        nodeId: string;
        timestamp: Date;
        cpuUsage: number;
        memoryUsage: number;
        diskUsage: number;
        networkThroughput: number;
        responseTime: number;
        errorRate: number;
        metadata: Record<string, any>;
    };
};
/**
 * Sequelize model for Network Anomalies detection log.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkAnomaly model
 *
 * @example
 * ```typescript
 * const NetworkAnomaly = createNetworkAnomalyModel(sequelize);
 * const anomaly = await NetworkAnomaly.create({
 *   nodeId: 'node-sw-001',
 *   timestamp: new Date(),
 *   metricName: 'cpu_usage',
 *   value: 95.5,
 *   expectedValue: 45.0,
 *   severity: 'high'
 * });
 * ```
 */
export declare const createNetworkAnomalyModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        nodeId: string;
        timestamp: Date;
        metricName: string;
        value: number;
        expectedValue: number;
        deviation: number;
        severity: string;
        anomalyType: string;
        resolved: boolean;
        metadata: Record<string, any>;
    };
};
/**
 * Analyzes traffic patterns for a specific node over time range.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Traffic analysis results
 *
 * @example
 * ```typescript
 * const analysis = await analyzeTrafficPatterns('node-1', startDate, endDate, sequelize);
 * ```
 */
export declare const analyzeTrafficPatterns: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
/**
 * Identifies top traffic consumers in the network.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} limit - Number of top consumers
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Top traffic consumers
 *
 * @example
 * ```typescript
 * const topConsumers = await getTopTrafficConsumers(startDate, endDate, 10, sequelize);
 * ```
 */
export declare const getTopTrafficConsumers: (startDate: Date, endDate: Date, limit: number, sequelize: Sequelize) => Promise<any[]>;
/**
 * Detects traffic spikes above threshold.
 *
 * @param {number} threshold - Spike threshold (bytes)
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Traffic spikes
 *
 * @example
 * ```typescript
 * const spikes = await detectTrafficSpikes(100000000, startDate, endDate, sequelize);
 * ```
 */
export declare const detectTrafficSpikes: (threshold: number, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
/**
 * Calculates traffic distribution across network segments.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Traffic distribution by segment
 *
 * @example
 * ```typescript
 * const distribution = await getTrafficDistribution(startDate, endDate, sequelize);
 * ```
 */
export declare const getTrafficDistribution: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
/**
 * Analyzes traffic flow between node pairs.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} limit - Number of top flows
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Traffic flows
 *
 * @example
 * ```typescript
 * const flows = await analyzeTrafficFlows(startDate, endDate, 20, sequelize);
 * ```
 */
export declare const analyzeTrafficFlows: (startDate: Date, endDate: Date, limit: number, sequelize: Sequelize) => Promise<any[]>;
/**
 * Calculates traffic growth rate over time.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Traffic growth metrics
 *
 * @example
 * ```typescript
 * const growth = await calculateTrafficGrowth('node-1', startDate, endDate, sequelize);
 * ```
 */
export declare const calculateTrafficGrowth: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
/**
 * Identifies traffic patterns by time of day.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Traffic by hour of day
 *
 * @example
 * ```typescript
 * const patterns = await getTrafficByTimeOfDay('node-1', startDate, endDate, sequelize);
 * ```
 */
export declare const getTrafficByTimeOfDay: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
/**
 * Calculates comprehensive performance statistics.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Performance statistics
 *
 * @example
 * ```typescript
 * const stats = await getPerformanceStatistics('node-1', startDate, endDate, sequelize);
 * ```
 */
export declare const getPerformanceStatistics: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
/**
 * Compares performance across multiple nodes.
 *
 * @param {string[]} nodeIds - Node IDs
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Comparative performance metrics
 *
 * @example
 * ```typescript
 * const comparison = await compareNodePerformance(['node-1', 'node-2'], startDate, endDate, sequelize);
 * ```
 */
export declare const compareNodePerformance: (nodeIds: string[], startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
/**
 * Identifies performance degradation trends.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Degradation analysis
 *
 * @example
 * ```typescript
 * const degradation = await detectPerformanceDegradation('node-1', startDate, endDate, sequelize);
 * ```
 */
export declare const detectPerformanceDegradation: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
/**
 * Calculates Service Level Agreement (SLA) compliance.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Object} slaThresholds - SLA thresholds
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} SLA compliance metrics
 *
 * @example
 * ```typescript
 * const sla = await calculateSLACompliance('node-1', startDate, endDate, {
 *   maxCpu: 80,
 *   maxResponseTime: 100,
 *   maxErrorRate: 1
 * }, sequelize);
 * ```
 */
export declare const calculateSLACompliance: (nodeId: string, startDate: Date, endDate: Date, slaThresholds: {
    maxCpu: number;
    maxResponseTime: number;
    maxErrorRate: number;
}, sequelize: Sequelize) => Promise<any>;
/**
 * Generates performance heatmap data.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} metric - Metric name
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Heatmap data
 *
 * @example
 * ```typescript
 * const heatmap = await generatePerformanceHeatmap('node-1', startDate, endDate, 'cpu_usage', sequelize);
 * ```
 */
export declare const generatePerformanceHeatmap: (nodeId: string, startDate: Date, endDate: Date, metric: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Identifies performance outliers using statistical methods.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Performance outliers
 *
 * @example
 * ```typescript
 * const outliers = await identifyPerformanceOutliers(startDate, endDate, sequelize);
 * ```
 */
export declare const identifyPerformanceOutliers: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
/**
 * Calculates resource efficiency score.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Efficiency metrics
 *
 * @example
 * ```typescript
 * const efficiency = await calculateResourceEfficiency('node-1', startDate, endDate, sequelize);
 * ```
 */
export declare const calculateResourceEfficiency: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
/**
 * Forecasts future capacity requirements.
 *
 * @param {string} nodeId - Node ID
 * @param {number} forecastDays - Days to forecast
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CapacityForecast>} Capacity forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCapacityRequirements('node-1', 30, sequelize);
 * ```
 */
export declare const forecastCapacityRequirements: (nodeId: string, forecastDays: number, sequelize: Sequelize) => Promise<CapacityForecast | null>;
/**
 * Identifies nodes approaching capacity limits.
 *
 * @param {number} threshold - Capacity threshold percentage
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Nodes near capacity
 *
 * @example
 * ```typescript
 * const nearCapacity = await identifyNodesNearCapacity(85, sequelize);
 * ```
 */
export declare const identifyNodesNearCapacity: (threshold: number, sequelize: Sequelize) => Promise<any[]>;
/**
 * Calculates optimal capacity allocation.
 *
 * @param {string} segmentId - Segment ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Capacity allocation recommendations
 *
 * @example
 * ```typescript
 * const allocation = await calculateOptimalCapacity('vlan-100', sequelize);
 * ```
 */
export declare const calculateOptimalCapacity: (segmentId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Predicts scaling requirements based on trends.
 *
 * @param {string} nodeId - Node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Scaling predictions
 *
 * @example
 * ```typescript
 * const scaling = await predictScalingRequirements('node-1', sequelize);
 * ```
 */
export declare const predictScalingRequirements: (nodeId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Analyzes historical capacity trends.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Capacity trends
 *
 * @example
 * ```typescript
 * const trends = await analyzeCapacityTrends('node-1', startDate, endDate, sequelize);
 * ```
 */
export declare const analyzeCapacityTrends: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
/**
 * Generates capacity planning reports.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Capacity planning report
 *
 * @example
 * ```typescript
 * const report = await generateCapacityReport(sequelize);
 * ```
 */
export declare const generateCapacityReport: (sequelize: Sequelize) => Promise<any[]>;
/**
 * Estimates time to capacity exhaustion.
 *
 * @param {string} nodeId - Node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Exhaustion estimate
 *
 * @example
 * ```typescript
 * const estimate = await estimateCapacityExhaustion('node-1', sequelize);
 * ```
 */
export declare const estimateCapacityExhaustion: (nodeId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Detects statistical anomalies in network metrics.
 *
 * @param {string} nodeId - Node ID
 * @param {string} metricName - Metric name
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} threshold - Z-score threshold
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectStatisticalAnomalies('node-1', 'cpu_usage', startDate, endDate, 3, sequelize);
 * ```
 */
export declare const detectStatisticalAnomalies: (nodeId: string, metricName: string, startDate: Date, endDate: Date, threshold: number, sequelize: Sequelize) => Promise<any[]>;
/**
 * Detects sudden spikes or drops in metrics.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Spike/drop anomalies
 *
 * @example
 * ```typescript
 * const spikes = await detectSpikeAnomalies('node-1', startDate, endDate, sequelize);
 * ```
 */
export declare const detectSpikeAnomalies: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
/**
 * Identifies recurring anomaly patterns.
 *
 * @param {string} nodeId - Node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Recurring patterns
 *
 * @example
 * ```typescript
 * const patterns = await identifyRecurringAnomalies('node-1', sequelize);
 * ```
 */
export declare const identifyRecurringAnomalies: (nodeId: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Detects anomalies using machine learning baseline.
 *
 * @param {string} nodeId - Node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} ML-detected anomalies
 *
 * @example
 * ```typescript
 * const mlAnomalies = await detectMLBasedAnomalies('node-1', sequelize);
 * ```
 */
export declare const detectMLBasedAnomalies: (nodeId: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Correlates anomalies across multiple nodes.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Correlated anomalies
 *
 * @example
 * ```typescript
 * const correlated = await correlateNetworkAnomalies(startDate, endDate, sequelize);
 * ```
 */
export declare const correlateNetworkAnomalies: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
/**
 * Generates anomaly summary report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Anomaly summary
 *
 * @example
 * ```typescript
 * const summary = await generateAnomalySummary(startDate, endDate, sequelize);
 * ```
 */
export declare const generateAnomalySummary: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
/**
 * Predicts potential future anomalies based on trends.
 *
 * @param {string} nodeId - Node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Anomaly predictions
 *
 * @example
 * ```typescript
 * const predictions = await predictFutureAnomalies('node-1', sequelize);
 * ```
 */
export declare const predictFutureAnomalies: (nodeId: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Analyzes long-term metric trends.
 *
 * @param {string} nodeId - Node ID
 * @param {string} metricName - Metric name
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TrendAnalysis>} Trend analysis results
 *
 * @example
 * ```typescript
 * const trend = await analyzeLongTermTrends('node-1', 'cpu_usage', startDate, endDate, sequelize);
 * ```
 */
export declare const analyzeLongTermTrends: (nodeId: string, metricName: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<TrendAnalysis | null>;
/**
 * Identifies seasonal patterns in metrics.
 *
 * @param {string} nodeId - Node ID
 * @param {string} metricName - Metric name
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Seasonal patterns
 *
 * @example
 * ```typescript
 * const patterns = await identifySeasonalPatterns('node-1', 'cpu_usage', sequelize);
 * ```
 */
export declare const identifySeasonalPatterns: (nodeId: string, metricName: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Compares current trends to historical baselines.
 *
 * @param {string} nodeId - Node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Trend comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareToHistoricalBaseline('node-1', sequelize);
 * ```
 */
export declare const compareToHistoricalBaseline: (nodeId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Detects trend reversals and inflection points.
 *
 * @param {string} nodeId - Node ID
 * @param {string} metricName - Metric name
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Trend reversals
 *
 * @example
 * ```typescript
 * const reversals = await detectTrendReversals('node-1', 'cpu_usage', sequelize);
 * ```
 */
export declare const detectTrendReversals: (nodeId: string, metricName: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Calculates trend volatility and stability.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Volatility metrics
 *
 * @example
 * ```typescript
 * const volatility = await calculateTrendVolatility('node-1', startDate, endDate, sequelize);
 * ```
 */
export declare const calculateTrendVolatility: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
/**
 * Generates hourly aggregated metrics report.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Hourly aggregations
 *
 * @example
 * ```typescript
 * const hourly = await generateHourlyReport('node-1', startDate, endDate, sequelize);
 * ```
 */
export declare const generateHourlyReport: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
/**
 * Generates daily aggregated metrics report.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Daily aggregations
 *
 * @example
 * ```typescript
 * const daily = await generateDailyReport('node-1', startDate, endDate, sequelize);
 * ```
 */
export declare const generateDailyReport: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
/**
 * Generates comprehensive network summary report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Network summary
 *
 * @example
 * ```typescript
 * const summary = await generateNetworkSummary(startDate, endDate, sequelize);
 * ```
 */
export declare const generateNetworkSummary: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
/**
 * Retrieves time-series data with downsampling.
 *
 * @param {string} nodeId - Node ID
 * @param {string} metricName - Metric name
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} interval - Sampling interval (e.g., '5 minutes', '1 hour')
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TimeSeriesData[]>} Time-series data
 *
 * @example
 * ```typescript
 * const timeSeries = await getTimeSeriesData('node-1', 'cpu_usage', startDate, endDate, '15 minutes', sequelize);
 * ```
 */
export declare const getTimeSeriesData: (nodeId: string, metricName: string, startDate: Date, endDate: Date, interval: string, sequelize: Sequelize) => Promise<TimeSeriesData[]>;
/**
 * Performs time-series interpolation for missing data.
 *
 * @param {string} nodeId - Node ID
 * @param {string} metricName - Metric name
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TimeSeriesData[]>} Interpolated data
 *
 * @example
 * ```typescript
 * const interpolated = await interpolateTimeSeries('node-1', 'cpu_usage', startDate, endDate, sequelize);
 * ```
 */
export declare const interpolateTimeSeries: (nodeId: string, metricName: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<TimeSeriesData[]>;
/**
 * Generates simple moving average forecast.
 *
 * @param {string} nodeId - Node ID
 * @param {string} metricName - Metric name
 * @param {number} forecastPeriods - Number of periods to forecast
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ForecastResult>} Forecast results
 *
 * @example
 * ```typescript
 * const forecast = await generateMovingAverageForecast('node-1', 'cpu_usage', 24, sequelize);
 * ```
 */
export declare const generateMovingAverageForecast: (nodeId: string, metricName: string, forecastPeriods: number, sequelize: Sequelize) => Promise<ForecastResult>;
declare const _default: {
    createTrafficMetricsModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            nodeId: string;
            timestamp: Date;
            bytesIn: number;
            bytesOut: number;
            packetsIn: number;
            packetsOut: number;
            connectionsActive: number;
            connectionsTotal: number;
            metadata: Record<string, any>;
        };
    };
    createPerformanceSnapshotModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            nodeId: string;
            timestamp: Date;
            cpuUsage: number;
            memoryUsage: number;
            diskUsage: number;
            networkThroughput: number;
            responseTime: number;
            errorRate: number;
            metadata: Record<string, any>;
        };
    };
    createNetworkAnomalyModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            nodeId: string;
            timestamp: Date;
            metricName: string;
            value: number;
            expectedValue: number;
            deviation: number;
            severity: string;
            anomalyType: string;
            resolved: boolean;
            metadata: Record<string, any>;
        };
    };
    analyzeTrafficPatterns: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
    getTopTrafficConsumers: (startDate: Date, endDate: Date, limit: number, sequelize: Sequelize) => Promise<any[]>;
    detectTrafficSpikes: (threshold: number, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
    getTrafficDistribution: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
    analyzeTrafficFlows: (startDate: Date, endDate: Date, limit: number, sequelize: Sequelize) => Promise<any[]>;
    calculateTrafficGrowth: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
    getTrafficByTimeOfDay: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
    getPerformanceStatistics: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
    compareNodePerformance: (nodeIds: string[], startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
    detectPerformanceDegradation: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
    calculateSLACompliance: (nodeId: string, startDate: Date, endDate: Date, slaThresholds: {
        maxCpu: number;
        maxResponseTime: number;
        maxErrorRate: number;
    }, sequelize: Sequelize) => Promise<any>;
    generatePerformanceHeatmap: (nodeId: string, startDate: Date, endDate: Date, metric: string, sequelize: Sequelize) => Promise<any[]>;
    identifyPerformanceOutliers: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
    calculateResourceEfficiency: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
    forecastCapacityRequirements: (nodeId: string, forecastDays: number, sequelize: Sequelize) => Promise<CapacityForecast | null>;
    identifyNodesNearCapacity: (threshold: number, sequelize: Sequelize) => Promise<any[]>;
    calculateOptimalCapacity: (segmentId: string, sequelize: Sequelize) => Promise<any>;
    predictScalingRequirements: (nodeId: string, sequelize: Sequelize) => Promise<any>;
    analyzeCapacityTrends: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
    generateCapacityReport: (sequelize: Sequelize) => Promise<any[]>;
    estimateCapacityExhaustion: (nodeId: string, sequelize: Sequelize) => Promise<any>;
    detectStatisticalAnomalies: (nodeId: string, metricName: string, startDate: Date, endDate: Date, threshold: number, sequelize: Sequelize) => Promise<any[]>;
    detectSpikeAnomalies: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
    identifyRecurringAnomalies: (nodeId: string, sequelize: Sequelize) => Promise<any[]>;
    detectMLBasedAnomalies: (nodeId: string, sequelize: Sequelize) => Promise<any[]>;
    correlateNetworkAnomalies: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
    generateAnomalySummary: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
    predictFutureAnomalies: (nodeId: string, sequelize: Sequelize) => Promise<any[]>;
    analyzeLongTermTrends: (nodeId: string, metricName: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<TrendAnalysis | null>;
    identifySeasonalPatterns: (nodeId: string, metricName: string, sequelize: Sequelize) => Promise<any[]>;
    compareToHistoricalBaseline: (nodeId: string, sequelize: Sequelize) => Promise<any>;
    detectTrendReversals: (nodeId: string, metricName: string, sequelize: Sequelize) => Promise<any[]>;
    calculateTrendVolatility: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
    generateHourlyReport: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
    generateDailyReport: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
    generateNetworkSummary: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any>;
    getTimeSeriesData: (nodeId: string, metricName: string, startDate: Date, endDate: Date, interval: string, sequelize: Sequelize) => Promise<TimeSeriesData[]>;
    interpolateTimeSeries: (nodeId: string, metricName: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<TimeSeriesData[]>;
    generateMovingAverageForecast: (nodeId: string, metricName: string, forecastPeriods: number, sequelize: Sequelize) => Promise<ForecastResult>;
};
export default _default;
//# sourceMappingURL=network-analytics-kit.d.ts.map