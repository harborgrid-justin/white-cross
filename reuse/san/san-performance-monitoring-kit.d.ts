/**
 * SAN Performance Monitoring Kit
 *
 * Comprehensive toolkit for monitoring Storage Area Network (SAN) performance
 * in healthcare environments. Provides real-time monitoring, historical analysis,
 * alerting, and anomaly detection for storage infrastructure.
 *
 * @module san-performance-monitoring-kit
 * @category Storage Performance
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * IOPS (Input/Output Operations Per Second) metrics
 */
export interface IOPS {
    read: number;
    write: number;
    total: number;
    timestamp: Date;
    volumeId?: string;
    lunId?: string;
}
/**
 * Latency metrics in milliseconds
 */
export interface Latency {
    read: number;
    write: number;
    average: number;
    p50: number;
    p95: number;
    p99: number;
    timestamp: Date;
    volumeId?: string;
}
/**
 * Throughput metrics in MB/s
 */
export interface Throughput {
    read: number;
    write: number;
    total: number;
    timestamp: Date;
    volumeId?: string;
    peakRead: number;
    peakWrite: number;
}
/**
 * Comprehensive performance metrics
 */
export interface PerformanceMetrics {
    id?: string;
    timestamp: Date;
    volumeId: string;
    lunId?: string;
    storagePoolId?: string;
    iops: IOPS;
    latency: Latency;
    throughput: Throughput;
    capacity: {
        total: number;
        used: number;
        free: number;
        usagePercent: number;
    };
    queueDepth: number;
    queueLatency: number;
    cacheHitRate: number;
    cacheMissRate: number;
    errorCount: number;
    retryCount: number;
    healthScore: number;
    status: 'healthy' | 'warning' | 'critical' | 'degraded';
}
/**
 * Performance baseline for comparison
 */
export interface PerformanceBaseline {
    volumeId: string;
    timeRange: string;
    metrics: {
        avgIops: number;
        avgLatency: number;
        avgThroughput: number;
        peakIops: number;
        peakLatency: number;
        peakThroughput: number;
    };
    calculatedAt: Date;
    sampleCount: number;
}
/**
 * Performance alert configuration
 */
export interface PerformanceAlert {
    id?: string;
    volumeId: string;
    alertType: 'latency' | 'iops' | 'throughput' | 'capacity' | 'error';
    threshold: number;
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    severity: 'info' | 'warning' | 'critical';
    enabled: boolean;
    cooldownMinutes: number;
    recipients: string[];
}
/**
 * Detected performance anomaly
 */
export interface PerformanceAnomaly {
    id?: string;
    volumeId: string;
    detectedAt: Date;
    anomalyType: string;
    severity: number;
    description: string;
    metrics: Partial<PerformanceMetrics>;
    baseline: Partial<PerformanceBaseline>;
    deviationPercent: number;
    resolved: boolean;
    resolvedAt?: Date;
}
/**
 * Time-series aggregation configuration
 */
export interface TimeSeriesConfig {
    interval: '1m' | '5m' | '15m' | '1h' | '6h' | '1d';
    aggregation: 'avg' | 'sum' | 'max' | 'min' | 'p95' | 'p99';
    startTime: Date;
    endTime: Date;
    volumeIds?: string[];
}
/**
 * Performance trend data
 */
export interface PerformanceTrend {
    timestamp: Date;
    value: number;
    metric: string;
    volumeId: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    changePercent: number;
}
/**
 * Storage health report
 */
export interface StorageHealthReport {
    generatedAt: Date;
    overallHealth: number;
    volumes: Array<{
        volumeId: string;
        healthScore: number;
        status: string;
        issues: string[];
        recommendations: string[];
    }>;
    alerts: PerformanceAlert[];
    anomalies: PerformanceAnomaly[];
    summary: {
        totalVolumes: number;
        healthyVolumes: number;
        warningVolumes: number;
        criticalVolumes: number;
    };
}
/**
 * Query optimization options for metrics collection
 */
export interface MetricsQueryOptions {
    useIndex?: boolean;
    batchSize?: number;
    parallelQueries?: boolean;
    cacheResults?: boolean;
    cacheTTL?: number;
    includeAggregates?: boolean;
}
/**
 * 1. Collect current performance metrics for a volume
 */
export declare function collectCurrentMetrics(sequelize: Sequelize, volumeId: string, options?: MetricsQueryOptions): Promise<PerformanceMetrics>;
/**
 * 2. Collect metrics for multiple volumes in parallel
 */
export declare function collectMultiVolumeMetrics(sequelize: Sequelize, volumeIds: string[], options?: MetricsQueryOptions): Promise<Map<string, PerformanceMetrics>>;
/**
 * 3. Get real-time IOPS for a volume
 */
export declare function getCurrentIOPS(sequelize: Sequelize, volumeId: string): Promise<IOPS>;
/**
 * 4. Get real-time latency metrics
 */
export declare function getCurrentLatency(sequelize: Sequelize, volumeId: string): Promise<Latency>;
/**
 * 5. Get real-time throughput metrics
 */
export declare function getCurrentThroughput(sequelize: Sequelize, volumeId: string): Promise<Throughput>;
/**
 * 6. Monitor queue depth and latency
 */
export declare function monitorQueueMetrics(sequelize: Sequelize, volumeId: string, thresholdDepth?: number): Promise<{
    queueDepth: number;
    queueLatency: number;
    isOverThreshold: boolean;
}>;
/**
 * 7. Monitor cache performance
 */
export declare function monitorCachePerformance(sequelize: Sequelize, volumeId: string): Promise<{
    hitRate: number;
    missRate: number;
    efficiency: string;
}>;
/**
 * 8. Get capacity utilization metrics
 */
export declare function getCapacityMetrics(sequelize: Sequelize, volumeId: string): Promise<{
    total: number;
    used: number;
    free: number;
    usagePercent: number;
    projectedFullDate?: Date;
}>;
/**
 * 9. Monitor error rates
 */
export declare function monitorErrorRates(sequelize: Sequelize, volumeId: string, timeWindowMinutes?: number): Promise<{
    errorCount: number;
    retryCount: number;
    errorRate: number;
    isAnomalous: boolean;
}>;
/**
 * 10. Get health score for a volume
 */
export declare function getVolumeHealthScore(sequelize: Sequelize, volumeId: string): Promise<{
    healthScore: number;
    status: string;
    factors: Record<string, number>;
}>;
/**
 * 11. Stream real-time metrics (for dashboards)
 */
export declare function streamRealTimeMetrics(sequelize: Sequelize, volumeIds: string[], intervalSeconds?: number): AsyncGenerator<Map<string, PerformanceMetrics>>;
/**
 * 12. Get aggregated metrics across all volumes
 */
export declare function getAggregatedSystemMetrics(sequelize: Sequelize): Promise<{
    totalIops: number;
    totalThroughput: number;
    avgLatency: number;
    totalCapacityGB: number;
    usedCapacityGB: number;
    volumeCount: number;
}>;
/**
 * 13. Get historical metrics for a time range
 */
export declare function getHistoricalMetrics(sequelize: Sequelize, volumeId: string, startTime: Date, endTime: Date, options?: MetricsQueryOptions): Promise<PerformanceMetrics[]>;
/**
 * 14. Get time-series aggregated metrics
 */
export declare function getTimeSeriesMetrics(sequelize: Sequelize, config: TimeSeriesConfig): Promise<PerformanceTrend[]>;
/**
 * 15. Calculate performance statistics for a time period
 */
export declare function calculatePerformanceStats(sequelize: Sequelize, volumeId: string, startTime: Date, endTime: Date): Promise<{
    iops: {
        min: number;
        max: number;
        avg: number;
        stddev: number;
    };
    latency: {
        min: number;
        max: number;
        avg: number;
        p95: number;
        p99: number;
    };
    throughput: {
        min: number;
        max: number;
        avg: number;
    };
    sampleCount: number;
}>;
/**
 * 16. Compare performance across time periods
 */
export declare function comparePerformancePeriods(sequelize: Sequelize, volumeId: string, period1Start: Date, period1End: Date, period2Start: Date, period2End: Date): Promise<{
    period1: any;
    period2: any;
    comparison: {
        iopsChange: number;
        latencyChange: number;
        throughputChange: number;
    };
}>;
/**
 * 17. Get peak performance periods
 */
export declare function getPeakPerformancePeriods(sequelize: Sequelize, volumeId: string, metric: 'iops' | 'latency' | 'throughput', startTime: Date, endTime: Date, limit?: number): Promise<Array<{
    timestamp: Date;
    value: number;
    rank: number;
}>>;
/**
 * 18. Analyze performance patterns by time of day
 */
export declare function analyzePerformanceByTimeOfDay(sequelize: Sequelize, volumeId: string, daysBack?: number): Promise<Array<{
    hour: number;
    avgIops: number;
    avgLatency: number;
    avgThroughput: number;
    sampleCount: number;
}>>;
/**
 * 19. Get performance degradation events
 */
export declare function getPerformanceDegradationEvents(sequelize: Sequelize, volumeId: string, startTime: Date, endTime: Date, thresholdPercent?: number): Promise<Array<{
    startTime: Date;
    endTime: Date;
    duration: number;
    degradationPercent: number;
    affectedMetric: string;
}>>;
/**
 * 20. Calculate capacity growth rate
 */
export declare function calculateCapacityGrowthRate(sequelize: Sequelize, volumeId: string, daysBack?: number): Promise<{
    dailyGrowthGB: number;
    weeklyGrowthGB: number;
    monthlyGrowthGB: number;
    projectedFullDate: Date | null;
}>;
/**
 * 21. Get historical percentile metrics
 */
export declare function getHistoricalPercentiles(sequelize: Sequelize, volumeId: string, metric: 'iops' | 'latency' | 'throughput', startTime: Date, endTime: Date): Promise<{
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
}>;
/**
 * 22. Analyze correlation between metrics
 */
export declare function analyzeMetricCorrelations(sequelize: Sequelize, volumeId: string, startTime: Date, endTime: Date): Promise<{
    iopsLatencyCorrelation: number;
    iopsThroughputCorrelation: number;
    latencyErrorCorrelation: number;
}>;
/**
 * 23. Calculate performance baseline
 */
export declare function calculatePerformanceBaseline(sequelize: Sequelize, volumeId: string, daysBack?: number): Promise<PerformanceBaseline>;
/**
 * 24. Store performance baseline
 */
export declare function storePerformanceBaseline(sequelize: Sequelize, baseline: PerformanceBaseline, transaction?: Transaction): Promise<void>;
/**
 * 25. Get stored baseline
 */
export declare function getStoredBaseline(sequelize: Sequelize, volumeId: string, timeRange?: string): Promise<PerformanceBaseline | null>;
/**
 * 26. Compare metrics against baseline
 */
export declare function compareAgainstBaseline(sequelize: Sequelize, volumeId: string, currentMetrics: PerformanceMetrics): Promise<{
    isWithinBaseline: boolean;
    deviations: {
        iops: number;
        latency: number;
        throughput: number;
    };
    baseline: PerformanceBaseline;
}>;
/**
 * 27. Update baselines for all volumes
 */
export declare function updateAllBaselines(sequelize: Sequelize, daysBack?: number): Promise<{
    updated: number;
    errors: number;
}>;
/**
 * 28. Get baseline compliance report
 */
export declare function getBaselineComplianceReport(sequelize: Sequelize, volumeIds?: string[]): Promise<Array<{
    volumeId: string;
    compliant: boolean;
    deviations: any;
    lastChecked: Date;
}>>;
/**
 * 29. Detect performance anomalies using statistical methods
 */
export declare function detectPerformanceAnomalies(sequelize: Sequelize, volumeId: string, sensitivityStdDev?: number): Promise<PerformanceAnomaly[]>;
/**
 * 30. Detect sudden performance drops
 */
export declare function detectPerformanceDrops(sequelize: Sequelize, volumeId: string, dropThresholdPercent?: number): Promise<PerformanceAnomaly[]>;
/**
 * 31. Detect latency spikes
 */
export declare function detectLatencySpikes(sequelize: Sequelize, volumeId: string, spikeThresholdMs?: number): Promise<PerformanceAnomaly[]>;
/**
 * 32. Detect capacity threshold breaches
 */
export declare function detectCapacityAnomalies(sequelize: Sequelize, volumeId: string, warningThreshold?: number, criticalThreshold?: number): Promise<PerformanceAnomaly[]>;
/**
 * 33. Store detected anomaly
 */
export declare function storeAnomaly(sequelize: Sequelize, anomaly: PerformanceAnomaly, transaction?: Transaction): Promise<string>;
/**
 * 34. Get unresolved anomalies
 */
export declare function getUnresolvedAnomalies(sequelize: Sequelize, volumeId?: string): Promise<PerformanceAnomaly[]>;
/**
 * 35. Resolve anomaly
 */
export declare function resolveAnomaly(sequelize: Sequelize, anomalyId: string, transaction?: Transaction): Promise<void>;
/**
 * 36. Auto-resolve anomalies based on current metrics
 */
export declare function autoResolveAnomalies(sequelize: Sequelize, volumeId: string): Promise<{
    resolved: number;
}>;
/**
 * 37. Create performance alert
 */
export declare function createPerformanceAlert(sequelize: Sequelize, alert: PerformanceAlert, transaction?: Transaction): Promise<string>;
/**
 * 38. Evaluate alert conditions
 */
export declare function evaluateAlertConditions(sequelize: Sequelize, volumeId: string): Promise<Array<{
    alert: PerformanceAlert;
    triggered: boolean;
    currentValue: number;
}>>;
/**
 * 40. Trigger alert notification
 */
export declare function triggerAlertNotification(sequelize: Sequelize, alert: PerformanceAlert, currentValue: number, metrics: PerformanceMetrics, transaction?: Transaction): Promise<void>;
/**
 * 42. Get alert history
 */
export declare function getAlertHistory(sequelize: Sequelize, volumeId?: string, startTime?: Date, endTime?: Date, limit?: number): Promise<Array<{
    alertId: string;
    volumeId: string;
    triggeredAt: Date;
    alertType: string;
    severity: string;
    currentValue: number;
    threshold: number;
}>>;
/**
 * 43. Generate storage health report
 */
export declare function generateStorageHealthReport(sequelize: Sequelize, volumeIds?: string[]): Promise<StorageHealthReport>;
/**
 * 44. Export performance data for external analysis
 */
export declare function exportPerformanceData(sequelize: Sequelize, volumeId: string, startTime: Date, endTime: Date, format?: 'json' | 'csv'): Promise<string>;
//# sourceMappingURL=san-performance-monitoring-kit.d.ts.map