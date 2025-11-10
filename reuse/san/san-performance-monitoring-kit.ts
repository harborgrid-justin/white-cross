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

import { Sequelize, QueryTypes, Op, Transaction } from 'sequelize';

// ============================================================================
// Type Definitions
// ============================================================================

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

  // IOPS metrics
  iops: IOPS;

  // Latency metrics
  latency: Latency;

  // Throughput metrics
  throughput: Throughput;

  // Capacity metrics
  capacity: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  };

  // Queue metrics
  queueDepth: number;
  queueLatency: number;

  // Cache metrics
  cacheHitRate: number;
  cacheMissRate: number;

  // Error metrics
  errorCount: number;
  retryCount: number;

  // Health status
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

// ============================================================================
// Real-Time Monitoring Functions (12 functions)
// ============================================================================

/**
 * 1. Collect current performance metrics for a volume
 */
export async function collectCurrentMetrics(
  sequelize: Sequelize,
  volumeId: string,
  options?: MetricsQueryOptions
): Promise<PerformanceMetrics> {
  const query = `
    SELECT
      volume_id,
      lun_id,
      storage_pool_id,
      read_iops,
      write_iops,
      (read_iops + write_iops) as total_iops,
      read_latency_ms,
      write_latency_ms,
      avg_latency_ms,
      p50_latency_ms,
      p95_latency_ms,
      p99_latency_ms,
      read_throughput_mbps,
      write_throughput_mbps,
      (read_throughput_mbps + write_throughput_mbps) as total_throughput,
      peak_read_throughput_mbps,
      peak_write_throughput_mbps,
      total_capacity_gb,
      used_capacity_gb,
      free_capacity_gb,
      ((used_capacity_gb::float / total_capacity_gb::float) * 100) as usage_percent,
      queue_depth,
      queue_latency_ms,
      cache_hit_rate,
      cache_miss_rate,
      error_count,
      retry_count,
      health_score,
      status,
      timestamp
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
      AND timestamp = (
        SELECT MAX(timestamp)
        FROM san_performance_metrics
        WHERE volume_id = :volumeId
      )
    LIMIT 1
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId },
    type: QueryTypes.SELECT
  }) as any[];

  if (!result) {
    throw new Error(`No metrics found for volume ${volumeId}`);
  }

  return mapToPerformanceMetrics(result);
}

/**
 * 2. Collect metrics for multiple volumes in parallel
 */
export async function collectMultiVolumeMetrics(
  sequelize: Sequelize,
  volumeIds: string[],
  options?: MetricsQueryOptions
): Promise<Map<string, PerformanceMetrics>> {
  const batchSize = options?.batchSize || 10;
  const metricsMap = new Map<string, PerformanceMetrics>();

  // Process in batches for optimal performance
  for (let i = 0; i < volumeIds.length; i += batchSize) {
    const batch = volumeIds.slice(i, i + batchSize);

    const query = `
      WITH latest_metrics AS (
        SELECT DISTINCT ON (volume_id)
          volume_id,
          lun_id,
          storage_pool_id,
          read_iops,
          write_iops,
          read_latency_ms,
          write_latency_ms,
          avg_latency_ms,
          p50_latency_ms,
          p95_latency_ms,
          p99_latency_ms,
          read_throughput_mbps,
          write_throughput_mbps,
          peak_read_throughput_mbps,
          peak_write_throughput_mbps,
          total_capacity_gb,
          used_capacity_gb,
          free_capacity_gb,
          queue_depth,
          queue_latency_ms,
          cache_hit_rate,
          cache_miss_rate,
          error_count,
          retry_count,
          health_score,
          status,
          timestamp
        FROM san_performance_metrics
        WHERE volume_id = ANY(:volumeIds)
        ORDER BY volume_id, timestamp DESC
      )
      SELECT *,
        (read_iops + write_iops) as total_iops,
        (read_throughput_mbps + write_throughput_mbps) as total_throughput,
        ((used_capacity_gb::float / NULLIF(total_capacity_gb::float, 0)) * 100) as usage_percent
      FROM latest_metrics
    `;

    const results = await sequelize.query(query, {
      replacements: { volumeIds: batch },
      type: QueryTypes.SELECT
    }) as any[];

    results.forEach((result: any) => {
      metricsMap.set(result.volume_id, mapToPerformanceMetrics(result));
    });
  }

  return metricsMap;
}

/**
 * 3. Get real-time IOPS for a volume
 */
export async function getCurrentIOPS(
  sequelize: Sequelize,
  volumeId: string
): Promise<IOPS> {
  const query = `
    SELECT
      read_iops,
      write_iops,
      (read_iops + write_iops) as total_iops,
      timestamp,
      volume_id,
      lun_id
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
    ORDER BY timestamp DESC
    LIMIT 1
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId },
    type: QueryTypes.SELECT
  }) as any[];

  return {
    read: result.read_iops,
    write: result.write_iops,
    total: result.total_iops,
    timestamp: result.timestamp,
    volumeId: result.volume_id,
    lunId: result.lun_id
  };
}

/**
 * 4. Get real-time latency metrics
 */
export async function getCurrentLatency(
  sequelize: Sequelize,
  volumeId: string
): Promise<Latency> {
  const query = `
    SELECT
      read_latency_ms,
      write_latency_ms,
      avg_latency_ms,
      p50_latency_ms,
      p95_latency_ms,
      p99_latency_ms,
      timestamp,
      volume_id
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
    ORDER BY timestamp DESC
    LIMIT 1
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId },
    type: QueryTypes.SELECT
  }) as any[];

  return {
    read: result.read_latency_ms,
    write: result.write_latency_ms,
    average: result.avg_latency_ms,
    p50: result.p50_latency_ms,
    p95: result.p95_latency_ms,
    p99: result.p99_latency_ms,
    timestamp: result.timestamp,
    volumeId: result.volume_id
  };
}

/**
 * 5. Get real-time throughput metrics
 */
export async function getCurrentThroughput(
  sequelize: Sequelize,
  volumeId: string
): Promise<Throughput> {
  const query = `
    SELECT
      read_throughput_mbps,
      write_throughput_mbps,
      (read_throughput_mbps + write_throughput_mbps) as total_throughput,
      peak_read_throughput_mbps,
      peak_write_throughput_mbps,
      timestamp,
      volume_id
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
    ORDER BY timestamp DESC
    LIMIT 1
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId },
    type: QueryTypes.SELECT
  }) as any[];

  return {
    read: result.read_throughput_mbps,
    write: result.write_throughput_mbps,
    total: result.total_throughput,
    peakRead: result.peak_read_throughput_mbps,
    peakWrite: result.peak_write_throughput_mbps,
    timestamp: result.timestamp,
    volumeId: result.volume_id
  };
}

/**
 * 6. Monitor queue depth and latency
 */
export async function monitorQueueMetrics(
  sequelize: Sequelize,
  volumeId: string,
  thresholdDepth: number = 32
): Promise<{ queueDepth: number; queueLatency: number; isOverThreshold: boolean }> {
  const query = `
    SELECT
      queue_depth,
      queue_latency_ms,
      timestamp
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
    ORDER BY timestamp DESC
    LIMIT 1
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId },
    type: QueryTypes.SELECT
  }) as any[];

  return {
    queueDepth: result.queue_depth,
    queueLatency: result.queue_latency_ms,
    isOverThreshold: result.queue_depth > thresholdDepth
  };
}

/**
 * 7. Monitor cache performance
 */
export async function monitorCachePerformance(
  sequelize: Sequelize,
  volumeId: string
): Promise<{ hitRate: number; missRate: number; efficiency: string }> {
  const query = `
    SELECT
      cache_hit_rate,
      cache_miss_rate,
      timestamp
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
    ORDER BY timestamp DESC
    LIMIT 1
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId },
    type: QueryTypes.SELECT
  }) as any[];

  const hitRate = result.cache_hit_rate;
  let efficiency: string;

  if (hitRate >= 90) efficiency = 'excellent';
  else if (hitRate >= 75) efficiency = 'good';
  else if (hitRate >= 50) efficiency = 'fair';
  else efficiency = 'poor';

  return {
    hitRate,
    missRate: result.cache_miss_rate,
    efficiency
  };
}

/**
 * 8. Get capacity utilization metrics
 */
export async function getCapacityMetrics(
  sequelize: Sequelize,
  volumeId: string
): Promise<{
  total: number;
  used: number;
  free: number;
  usagePercent: number;
  projectedFullDate?: Date;
}> {
  const query = `
    SELECT
      total_capacity_gb,
      used_capacity_gb,
      free_capacity_gb,
      ((used_capacity_gb::float / total_capacity_gb::float) * 100) as usage_percent,
      timestamp
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
    ORDER BY timestamp DESC
    LIMIT 1
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId },
    type: QueryTypes.SELECT
  }) as any[];

  // Calculate projected full date based on growth trend
  const projectedFullDate = await calculateProjectedFullDate(sequelize, volumeId);

  return {
    total: result.total_capacity_gb,
    used: result.used_capacity_gb,
    free: result.free_capacity_gb,
    usagePercent: result.usage_percent,
    projectedFullDate
  };
}

/**
 * 9. Monitor error rates
 */
export async function monitorErrorRates(
  sequelize: Sequelize,
  volumeId: string,
  timeWindowMinutes: number = 15
): Promise<{
  errorCount: number;
  retryCount: number;
  errorRate: number;
  isAnomalous: boolean;
}> {
  const query = `
    SELECT
      SUM(error_count) as total_errors,
      SUM(retry_count) as total_retries,
      COUNT(*) as sample_count
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
      AND timestamp >= NOW() - INTERVAL '${timeWindowMinutes} minutes'
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId },
    type: QueryTypes.SELECT
  }) as any[];

  const errorRate = result.sample_count > 0
    ? (result.total_errors / result.sample_count)
    : 0;

  return {
    errorCount: result.total_errors || 0,
    retryCount: result.total_retries || 0,
    errorRate,
    isAnomalous: errorRate > 0.05 // More than 5% error rate
  };
}

/**
 * 10. Get health score for a volume
 */
export async function getVolumeHealthScore(
  sequelize: Sequelize,
  volumeId: string
): Promise<{
  healthScore: number;
  status: string;
  factors: Record<string, number>;
}> {
  const metrics = await collectCurrentMetrics(sequelize, volumeId);

  // Calculate health score based on multiple factors
  const factors = {
    latency: calculateLatencyScore(metrics.latency),
    throughput: calculateThroughputScore(metrics.throughput),
    capacity: calculateCapacityScore(metrics.capacity),
    errors: calculateErrorScore(metrics.errorCount, metrics.retryCount),
    cache: metrics.cacheHitRate
  };

  const healthScore = Object.values(factors).reduce((sum, score) => sum + score, 0) / Object.keys(factors).length;

  let status: string;
  if (healthScore >= 90) status = 'healthy';
  else if (healthScore >= 70) status = 'warning';
  else if (healthScore >= 50) status = 'degraded';
  else status = 'critical';

  return { healthScore, status, factors };
}

/**
 * 11. Stream real-time metrics (for dashboards)
 */
export async function* streamRealTimeMetrics(
  sequelize: Sequelize,
  volumeIds: string[],
  intervalSeconds: number = 10
): AsyncGenerator<Map<string, PerformanceMetrics>> {
  while (true) {
    const metrics = await collectMultiVolumeMetrics(sequelize, volumeIds);
    yield metrics;
    await new Promise(resolve => setTimeout(resolve, intervalSeconds * 1000));
  }
}

/**
 * 12. Get aggregated metrics across all volumes
 */
export async function getAggregatedSystemMetrics(
  sequelize: Sequelize
): Promise<{
  totalIops: number;
  totalThroughput: number;
  avgLatency: number;
  totalCapacityGB: number;
  usedCapacityGB: number;
  volumeCount: number;
}> {
  const query = `
    WITH latest_metrics AS (
      SELECT DISTINCT ON (volume_id)
        volume_id,
        read_iops,
        write_iops,
        avg_latency_ms,
        read_throughput_mbps,
        write_throughput_mbps,
        total_capacity_gb,
        used_capacity_gb
      FROM san_performance_metrics
      ORDER BY volume_id, timestamp DESC
    )
    SELECT
      SUM(read_iops + write_iops) as total_iops,
      SUM(read_throughput_mbps + write_throughput_mbps) as total_throughput,
      AVG(avg_latency_ms) as avg_latency,
      SUM(total_capacity_gb) as total_capacity,
      SUM(used_capacity_gb) as used_capacity,
      COUNT(DISTINCT volume_id) as volume_count
    FROM latest_metrics
  `;

  const [result] = await sequelize.query(query, {
    type: QueryTypes.SELECT
  }) as any[];

  return {
    totalIops: result.total_iops || 0,
    totalThroughput: result.total_throughput || 0,
    avgLatency: result.avg_latency || 0,
    totalCapacityGB: result.total_capacity || 0,
    usedCapacityGB: result.used_capacity || 0,
    volumeCount: result.volume_count || 0
  };
}

// ============================================================================
// Historical Analysis Functions (10 functions)
// ============================================================================

/**
 * 13. Get historical metrics for a time range
 */
export async function getHistoricalMetrics(
  sequelize: Sequelize,
  volumeId: string,
  startTime: Date,
  endTime: Date,
  options?: MetricsQueryOptions
): Promise<PerformanceMetrics[]> {
  const query = `
    SELECT
      volume_id,
      lun_id,
      storage_pool_id,
      read_iops,
      write_iops,
      (read_iops + write_iops) as total_iops,
      read_latency_ms,
      write_latency_ms,
      avg_latency_ms,
      p50_latency_ms,
      p95_latency_ms,
      p99_latency_ms,
      read_throughput_mbps,
      write_throughput_mbps,
      (read_throughput_mbps + write_throughput_mbps) as total_throughput,
      peak_read_throughput_mbps,
      peak_write_throughput_mbps,
      total_capacity_gb,
      used_capacity_gb,
      free_capacity_gb,
      ((used_capacity_gb::float / total_capacity_gb::float) * 100) as usage_percent,
      queue_depth,
      queue_latency_ms,
      cache_hit_rate,
      cache_miss_rate,
      error_count,
      retry_count,
      health_score,
      status,
      timestamp
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
      AND timestamp BETWEEN :startTime AND :endTime
    ORDER BY timestamp ASC
  `;

  const results = await sequelize.query(query, {
    replacements: { volumeId, startTime, endTime },
    type: QueryTypes.SELECT
  }) as any[];

  return results.map(mapToPerformanceMetrics);
}

/**
 * 14. Get time-series aggregated metrics
 */
export async function getTimeSeriesMetrics(
  sequelize: Sequelize,
  config: TimeSeriesConfig
): Promise<PerformanceTrend[]> {
  const intervalMap = {
    '1m': '1 minute',
    '5m': '5 minutes',
    '15m': '15 minutes',
    '1h': '1 hour',
    '6h': '6 hours',
    '1d': '1 day'
  };

  const aggregationFunc = config.aggregation === 'avg' ? 'AVG' :
                          config.aggregation === 'sum' ? 'SUM' :
                          config.aggregation === 'max' ? 'MAX' :
                          config.aggregation === 'min' ? 'MIN' :
                          config.aggregation === 'p95' ? 'PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY' :
                          'PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY';

  const volumeFilter = config.volumeIds
    ? `AND volume_id = ANY(:volumeIds)`
    : '';

  const query = `
    WITH time_buckets AS (
      SELECT
        time_bucket('${intervalMap[config.interval]}', timestamp) AS bucket,
        volume_id,
        ${aggregationFunc}(read_iops + write_iops)${config.aggregation.startsWith('p') ? ')' : ''} as iops_value,
        ${aggregationFunc}(avg_latency_ms)${config.aggregation.startsWith('p') ? ')' : ''} as latency_value,
        ${aggregationFunc}(read_throughput_mbps + write_throughput_mbps)${config.aggregation.startsWith('p') ? ')' : ''} as throughput_value
      FROM san_performance_metrics
      WHERE timestamp BETWEEN :startTime AND :endTime
        ${volumeFilter}
      GROUP BY bucket, volume_id
      ORDER BY bucket ASC
    ),
    with_trends AS (
      SELECT
        bucket as timestamp,
        volume_id,
        iops_value,
        latency_value,
        throughput_value,
        LAG(iops_value) OVER (PARTITION BY volume_id ORDER BY bucket) as prev_iops,
        LAG(latency_value) OVER (PARTITION BY volume_id ORDER BY bucket) as prev_latency,
        LAG(throughput_value) OVER (PARTITION BY volume_id ORDER BY bucket) as prev_throughput
      FROM time_buckets
    )
    SELECT
      timestamp,
      volume_id,
      'iops' as metric,
      iops_value as value,
      CASE
        WHEN prev_iops IS NULL THEN 'stable'
        WHEN iops_value > prev_iops * 1.1 THEN 'increasing'
        WHEN iops_value < prev_iops * 0.9 THEN 'decreasing'
        ELSE 'stable'
      END as trend,
      CASE
        WHEN prev_iops IS NULL THEN 0
        ELSE ((iops_value - prev_iops) / NULLIF(prev_iops, 0) * 100)
      END as change_percent
    FROM with_trends

    UNION ALL

    SELECT
      timestamp,
      volume_id,
      'latency' as metric,
      latency_value as value,
      CASE
        WHEN prev_latency IS NULL THEN 'stable'
        WHEN latency_value > prev_latency * 1.1 THEN 'increasing'
        WHEN latency_value < prev_latency * 0.9 THEN 'decreasing'
        ELSE 'stable'
      END as trend,
      CASE
        WHEN prev_latency IS NULL THEN 0
        ELSE ((latency_value - prev_latency) / NULLIF(prev_latency, 0) * 100)
      END as change_percent
    FROM with_trends

    UNION ALL

    SELECT
      timestamp,
      volume_id,
      'throughput' as metric,
      throughput_value as value,
      CASE
        WHEN prev_throughput IS NULL THEN 'stable'
        WHEN throughput_value > prev_throughput * 1.1 THEN 'increasing'
        WHEN throughput_value < prev_throughput * 0.9 THEN 'decreasing'
        ELSE 'stable'
      END as trend,
      CASE
        WHEN prev_throughput IS NULL THEN 0
        ELSE ((throughput_value - prev_throughput) / NULLIF(prev_throughput, 0) * 100)
      END as change_percent
    FROM with_trends
    ORDER BY timestamp, volume_id, metric
  `;

  const results = await sequelize.query(query, {
    replacements: {
      startTime: config.startTime,
      endTime: config.endTime,
      volumeIds: config.volumeIds
    },
    type: QueryTypes.SELECT
  }) as any[];

  return results.map((r: any) => ({
    timestamp: r.timestamp,
    value: r.value,
    metric: r.metric,
    volumeId: r.volume_id,
    trend: r.trend,
    changePercent: r.change_percent
  }));
}

/**
 * 15. Calculate performance statistics for a time period
 */
export async function calculatePerformanceStats(
  sequelize: Sequelize,
  volumeId: string,
  startTime: Date,
  endTime: Date
): Promise<{
  iops: { min: number; max: number; avg: number; stddev: number };
  latency: { min: number; max: number; avg: number; p95: number; p99: number };
  throughput: { min: number; max: number; avg: number };
  sampleCount: number;
}> {
  const query = `
    SELECT
      MIN(read_iops + write_iops) as min_iops,
      MAX(read_iops + write_iops) as max_iops,
      AVG(read_iops + write_iops) as avg_iops,
      STDDEV(read_iops + write_iops) as stddev_iops,
      MIN(avg_latency_ms) as min_latency,
      MAX(avg_latency_ms) as max_latency,
      AVG(avg_latency_ms) as avg_latency,
      PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY avg_latency_ms) as p95_latency,
      PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY avg_latency_ms) as p99_latency,
      MIN(read_throughput_mbps + write_throughput_mbps) as min_throughput,
      MAX(read_throughput_mbps + write_throughput_mbps) as max_throughput,
      AVG(read_throughput_mbps + write_throughput_mbps) as avg_throughput,
      COUNT(*) as sample_count
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
      AND timestamp BETWEEN :startTime AND :endTime
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId, startTime, endTime },
    type: QueryTypes.SELECT
  }) as any[];

  return {
    iops: {
      min: result.min_iops || 0,
      max: result.max_iops || 0,
      avg: result.avg_iops || 0,
      stddev: result.stddev_iops || 0
    },
    latency: {
      min: result.min_latency || 0,
      max: result.max_latency || 0,
      avg: result.avg_latency || 0,
      p95: result.p95_latency || 0,
      p99: result.p99_latency || 0
    },
    throughput: {
      min: result.min_throughput || 0,
      max: result.max_throughput || 0,
      avg: result.avg_throughput || 0
    },
    sampleCount: result.sample_count || 0
  };
}

/**
 * 16. Compare performance across time periods
 */
export async function comparePerformancePeriods(
  sequelize: Sequelize,
  volumeId: string,
  period1Start: Date,
  period1End: Date,
  period2Start: Date,
  period2End: Date
): Promise<{
  period1: any;
  period2: any;
  comparison: {
    iopsChange: number;
    latencyChange: number;
    throughputChange: number;
  };
}> {
  const period1Stats = await calculatePerformanceStats(sequelize, volumeId, period1Start, period1End);
  const period2Stats = await calculatePerformanceStats(sequelize, volumeId, period2Start, period2End);

  return {
    period1: period1Stats,
    period2: period2Stats,
    comparison: {
      iopsChange: ((period2Stats.iops.avg - period1Stats.iops.avg) / period1Stats.iops.avg) * 100,
      latencyChange: ((period2Stats.latency.avg - period1Stats.latency.avg) / period1Stats.latency.avg) * 100,
      throughputChange: ((period2Stats.throughput.avg - period1Stats.throughput.avg) / period1Stats.throughput.avg) * 100
    }
  };
}

/**
 * 17. Get peak performance periods
 */
export async function getPeakPerformancePeriods(
  sequelize: Sequelize,
  volumeId: string,
  metric: 'iops' | 'latency' | 'throughput',
  startTime: Date,
  endTime: Date,
  limit: number = 10
): Promise<Array<{ timestamp: Date; value: number; rank: number }>> {
  const metricColumn = metric === 'iops' ? '(read_iops + write_iops)' :
                       metric === 'latency' ? 'avg_latency_ms' :
                       '(read_throughput_mbps + write_throughput_mbps)';

  const query = `
    SELECT
      timestamp,
      ${metricColumn} as value,
      RANK() OVER (ORDER BY ${metricColumn} DESC) as rank
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
      AND timestamp BETWEEN :startTime AND :endTime
    ORDER BY ${metricColumn} DESC
    LIMIT :limit
  `;

  const results = await sequelize.query(query, {
    replacements: { volumeId, startTime, endTime, limit },
    type: QueryTypes.SELECT
  }) as any[];

  return results.map((r: any) => ({
    timestamp: r.timestamp,
    value: r.value,
    rank: r.rank
  }));
}

/**
 * 18. Analyze performance patterns by time of day
 */
export async function analyzePerformanceByTimeOfDay(
  sequelize: Sequelize,
  volumeId: string,
  daysBack: number = 30
): Promise<Array<{
  hour: number;
  avgIops: number;
  avgLatency: number;
  avgThroughput: number;
  sampleCount: number;
}>> {
  const query = `
    SELECT
      EXTRACT(HOUR FROM timestamp) as hour,
      AVG(read_iops + write_iops) as avg_iops,
      AVG(avg_latency_ms) as avg_latency,
      AVG(read_throughput_mbps + write_throughput_mbps) as avg_throughput,
      COUNT(*) as sample_count
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
      AND timestamp >= NOW() - INTERVAL '${daysBack} days'
    GROUP BY EXTRACT(HOUR FROM timestamp)
    ORDER BY hour
  `;

  const results = await sequelize.query(query, {
    replacements: { volumeId },
    type: QueryTypes.SELECT
  }) as any[];

  return results.map((r: any) => ({
    hour: r.hour,
    avgIops: r.avg_iops,
    avgLatency: r.avg_latency,
    avgThroughput: r.avg_throughput,
    sampleCount: r.sample_count
  }));
}

/**
 * 19. Get performance degradation events
 */
export async function getPerformanceDegradationEvents(
  sequelize: Sequelize,
  volumeId: string,
  startTime: Date,
  endTime: Date,
  thresholdPercent: number = 20
): Promise<Array<{
  startTime: Date;
  endTime: Date;
  duration: number;
  degradationPercent: number;
  affectedMetric: string;
}>> {
  const query = `
    WITH baseline AS (
      SELECT
        AVG(read_iops + write_iops) as avg_iops,
        AVG(avg_latency_ms) as avg_latency,
        AVG(read_throughput_mbps + write_throughput_mbps) as avg_throughput
      FROM san_performance_metrics
      WHERE volume_id = :volumeId
        AND timestamp BETWEEN :startTime AND :endTime
    ),
    degraded_periods AS (
      SELECT
        m.timestamp,
        m.read_iops + m.write_iops as iops,
        m.avg_latency_ms as latency,
        m.read_throughput_mbps + m.write_throughput_mbps as throughput,
        b.avg_iops,
        b.avg_latency,
        b.avg_throughput,
        CASE
          WHEN m.read_iops + m.write_iops < b.avg_iops * (1 - :threshold/100.0) THEN 'iops'
          WHEN m.avg_latency_ms > b.avg_latency * (1 + :threshold/100.0) THEN 'latency'
          WHEN m.read_throughput_mbps + m.write_throughput_mbps < b.avg_throughput * (1 - :threshold/100.0) THEN 'throughput'
        END as affected_metric,
        CASE
          WHEN m.read_iops + m.write_iops < b.avg_iops * (1 - :threshold/100.0)
            THEN ((b.avg_iops - (m.read_iops + m.write_iops)) / b.avg_iops * 100)
          WHEN m.avg_latency_ms > b.avg_latency * (1 + :threshold/100.0)
            THEN ((m.avg_latency_ms - b.avg_latency) / b.avg_latency * 100)
          WHEN m.read_throughput_mbps + m.write_throughput_mbps < b.avg_throughput * (1 - :threshold/100.0)
            THEN ((b.avg_throughput - (m.read_throughput_mbps + m.write_throughput_mbps)) / b.avg_throughput * 100)
        END as degradation_percent
      FROM san_performance_metrics m
      CROSS JOIN baseline b
      WHERE m.volume_id = :volumeId
        AND m.timestamp BETWEEN :startTime AND :endTime
    )
    SELECT
      MIN(timestamp) as start_time,
      MAX(timestamp) as end_time,
      EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp))) as duration_seconds,
      AVG(degradation_percent) as degradation_percent,
      affected_metric
    FROM degraded_periods
    WHERE affected_metric IS NOT NULL
    GROUP BY affected_metric,
             (timestamp - LAG(timestamp, 1, timestamp) OVER (ORDER BY timestamp) > INTERVAL '5 minutes')
    HAVING COUNT(*) >= 3
    ORDER BY start_time DESC
  `;

  const results = await sequelize.query(query, {
    replacements: { volumeId, startTime, endTime, threshold: thresholdPercent },
    type: QueryTypes.SELECT
  }) as any[];

  return results.map((r: any) => ({
    startTime: r.start_time,
    endTime: r.end_time,
    duration: r.duration_seconds,
    degradationPercent: r.degradation_percent,
    affectedMetric: r.affected_metric
  }));
}

/**
 * 20. Calculate capacity growth rate
 */
export async function calculateCapacityGrowthRate(
  sequelize: Sequelize,
  volumeId: string,
  daysBack: number = 90
): Promise<{
  dailyGrowthGB: number;
  weeklyGrowthGB: number;
  monthlyGrowthGB: number;
  projectedFullDate: Date | null;
}> {
  const query = `
    WITH daily_capacity AS (
      SELECT
        DATE(timestamp) as date,
        AVG(used_capacity_gb) as avg_used,
        AVG(total_capacity_gb) as avg_total
      FROM san_performance_metrics
      WHERE volume_id = :volumeId
        AND timestamp >= NOW() - INTERVAL '${daysBack} days'
      GROUP BY DATE(timestamp)
      ORDER BY date
    ),
    growth_calc AS (
      SELECT
        (MAX(avg_used) - MIN(avg_used)) / NULLIF(COUNT(DISTINCT date), 0) as daily_growth,
        MAX(avg_total) as total_capacity,
        MAX(avg_used) as current_used
      FROM daily_capacity
    )
    SELECT
      daily_growth,
      daily_growth * 7 as weekly_growth,
      daily_growth * 30 as monthly_growth,
      total_capacity,
      current_used,
      CASE
        WHEN daily_growth > 0 THEN
          NOW() + ((total_capacity - current_used) / daily_growth || ' days')::INTERVAL
        ELSE NULL
      END as projected_full_date
    FROM growth_calc
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId },
    type: QueryTypes.SELECT
  }) as any[];

  return {
    dailyGrowthGB: result.daily_growth || 0,
    weeklyGrowthGB: result.weekly_growth || 0,
    monthlyGrowthGB: result.monthly_growth || 0,
    projectedFullDate: result.projected_full_date
  };
}

/**
 * 21. Get historical percentile metrics
 */
export async function getHistoricalPercentiles(
  sequelize: Sequelize,
  volumeId: string,
  metric: 'iops' | 'latency' | 'throughput',
  startTime: Date,
  endTime: Date
): Promise<{
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
}> {
  const metricColumn = metric === 'iops' ? '(read_iops + write_iops)' :
                       metric === 'latency' ? 'avg_latency_ms' :
                       '(read_throughput_mbps + write_throughput_mbps)';

  const query = `
    SELECT
      PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY ${metricColumn}) as p50,
      PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY ${metricColumn}) as p75,
      PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY ${metricColumn}) as p90,
      PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY ${metricColumn}) as p95,
      PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY ${metricColumn}) as p99
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
      AND timestamp BETWEEN :startTime AND :endTime
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId, startTime, endTime },
    type: QueryTypes.SELECT
  }) as any[];

  return {
    p50: result.p50,
    p75: result.p75,
    p90: result.p90,
    p95: result.p95,
    p99: result.p99
  };
}

/**
 * 22. Analyze correlation between metrics
 */
export async function analyzeMetricCorrelations(
  sequelize: Sequelize,
  volumeId: string,
  startTime: Date,
  endTime: Date
): Promise<{
  iopsLatencyCorrelation: number;
  iopsThroughputCorrelation: number;
  latencyErrorCorrelation: number;
}> {
  const query = `
    SELECT
      CORR(read_iops + write_iops, avg_latency_ms) as iops_latency_corr,
      CORR(read_iops + write_iops, read_throughput_mbps + write_throughput_mbps) as iops_throughput_corr,
      CORR(avg_latency_ms, error_count) as latency_error_corr
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
      AND timestamp BETWEEN :startTime AND :endTime
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId, startTime, endTime },
    type: QueryTypes.SELECT
  }) as any[];

  return {
    iopsLatencyCorrelation: result.iops_latency_corr || 0,
    iopsThroughputCorrelation: result.iops_throughput_corr || 0,
    latencyErrorCorrelation: result.latency_error_corr || 0
  };
}

// ============================================================================
// Performance Baseline Functions (6 functions)
// ============================================================================

/**
 * 23. Calculate performance baseline
 */
export async function calculatePerformanceBaseline(
  sequelize: Sequelize,
  volumeId: string,
  daysBack: number = 30
): Promise<PerformanceBaseline> {
  const startTime = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
  const endTime = new Date();

  const query = `
    SELECT
      AVG(read_iops + write_iops) as avg_iops,
      AVG(avg_latency_ms) as avg_latency,
      AVG(read_throughput_mbps + write_throughput_mbps) as avg_throughput,
      MAX(read_iops + write_iops) as peak_iops,
      MAX(avg_latency_ms) as peak_latency,
      MAX(read_throughput_mbps + write_throughput_mbps) as peak_throughput,
      COUNT(*) as sample_count
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
      AND timestamp BETWEEN :startTime AND :endTime
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId, startTime, endTime },
    type: QueryTypes.SELECT
  }) as any[];

  return {
    volumeId,
    timeRange: `${daysBack} days`,
    metrics: {
      avgIops: result.avg_iops || 0,
      avgLatency: result.avg_latency || 0,
      avgThroughput: result.avg_throughput || 0,
      peakIops: result.peak_iops || 0,
      peakLatency: result.peak_latency || 0,
      peakThroughput: result.peak_throughput || 0
    },
    calculatedAt: new Date(),
    sampleCount: result.sample_count || 0
  };
}

/**
 * 24. Store performance baseline
 */
export async function storePerformanceBaseline(
  sequelize: Sequelize,
  baseline: PerformanceBaseline,
  transaction?: Transaction
): Promise<void> {
  const query = `
    INSERT INTO san_performance_baselines (
      volume_id,
      time_range,
      avg_iops,
      avg_latency,
      avg_throughput,
      peak_iops,
      peak_latency,
      peak_throughput,
      sample_count,
      calculated_at
    ) VALUES (
      :volumeId,
      :timeRange,
      :avgIops,
      :avgLatency,
      :avgThroughput,
      :peakIops,
      :peakLatency,
      :peakThroughput,
      :sampleCount,
      :calculatedAt
    )
    ON CONFLICT (volume_id, time_range)
    DO UPDATE SET
      avg_iops = EXCLUDED.avg_iops,
      avg_latency = EXCLUDED.avg_latency,
      avg_throughput = EXCLUDED.avg_throughput,
      peak_iops = EXCLUDED.peak_iops,
      peak_latency = EXCLUDED.peak_latency,
      peak_throughput = EXCLUDED.peak_throughput,
      sample_count = EXCLUDED.sample_count,
      calculated_at = EXCLUDED.calculated_at
  `;

  await sequelize.query(query, {
    replacements: {
      volumeId: baseline.volumeId,
      timeRange: baseline.timeRange,
      avgIops: baseline.metrics.avgIops,
      avgLatency: baseline.metrics.avgLatency,
      avgThroughput: baseline.metrics.avgThroughput,
      peakIops: baseline.metrics.peakIops,
      peakLatency: baseline.metrics.peakLatency,
      peakThroughput: baseline.metrics.peakThroughput,
      sampleCount: baseline.sampleCount,
      calculatedAt: baseline.calculatedAt
    },
    transaction
  });
}

/**
 * 25. Get stored baseline
 */
export async function getStoredBaseline(
  sequelize: Sequelize,
  volumeId: string,
  timeRange: string = '30 days'
): Promise<PerformanceBaseline | null> {
  const query = `
    SELECT
      volume_id,
      time_range,
      avg_iops,
      avg_latency,
      avg_throughput,
      peak_iops,
      peak_latency,
      peak_throughput,
      sample_count,
      calculated_at
    FROM san_performance_baselines
    WHERE volume_id = :volumeId
      AND time_range = :timeRange
    ORDER BY calculated_at DESC
    LIMIT 1
  `;

  const [result] = await sequelize.query(query, {
    replacements: { volumeId, timeRange },
    type: QueryTypes.SELECT
  }) as any[];

  if (!result) return null;

  return {
    volumeId: result.volume_id,
    timeRange: result.time_range,
    metrics: {
      avgIops: result.avg_iops,
      avgLatency: result.avg_latency,
      avgThroughput: result.avg_throughput,
      peakIops: result.peak_iops,
      peakLatency: result.peak_latency,
      peakThroughput: result.peak_throughput
    },
    calculatedAt: result.calculated_at,
    sampleCount: result.sample_count
  };
}

/**
 * 26. Compare metrics against baseline
 */
export async function compareAgainstBaseline(
  sequelize: Sequelize,
  volumeId: string,
  currentMetrics: PerformanceMetrics
): Promise<{
  isWithinBaseline: boolean;
  deviations: {
    iops: number;
    latency: number;
    throughput: number;
  };
  baseline: PerformanceBaseline;
}> {
  const baseline = await getStoredBaseline(sequelize, volumeId);

  if (!baseline) {
    throw new Error(`No baseline found for volume ${volumeId}`);
  }

  const deviations = {
    iops: ((currentMetrics.iops.total - baseline.metrics.avgIops) / baseline.metrics.avgIops) * 100,
    latency: ((currentMetrics.latency.average - baseline.metrics.avgLatency) / baseline.metrics.avgLatency) * 100,
    throughput: ((currentMetrics.throughput.total - baseline.metrics.avgThroughput) / baseline.metrics.avgThroughput) * 100
  };

  const isWithinBaseline =
    Math.abs(deviations.iops) < 20 &&
    Math.abs(deviations.latency) < 20 &&
    Math.abs(deviations.throughput) < 20;

  return {
    isWithinBaseline,
    deviations,
    baseline
  };
}

/**
 * 27. Update baselines for all volumes
 */
export async function updateAllBaselines(
  sequelize: Sequelize,
  daysBack: number = 30
): Promise<{ updated: number; errors: number }> {
  const query = `
    SELECT DISTINCT volume_id
    FROM san_performance_metrics
    WHERE timestamp >= NOW() - INTERVAL '${daysBack} days'
  `;

  const volumes = await sequelize.query(query, {
    type: QueryTypes.SELECT
  }) as any[];

  let updated = 0;
  let errors = 0;

  for (const volume of volumes) {
    try {
      const baseline = await calculatePerformanceBaseline(sequelize, volume.volume_id, daysBack);
      await storePerformanceBaseline(sequelize, baseline);
      updated++;
    } catch (error) {
      console.error(`Error updating baseline for volume ${volume.volume_id}:`, error);
      errors++;
    }
  }

  return { updated, errors };
}

/**
 * 28. Get baseline compliance report
 */
export async function getBaselineComplianceReport(
  sequelize: Sequelize,
  volumeIds?: string[]
): Promise<Array<{
  volumeId: string;
  compliant: boolean;
  deviations: any;
  lastChecked: Date;
}>> {
  const volumeFilter = volumeIds
    ? `WHERE volume_id = ANY(:volumeIds)`
    : '';

  const query = `
    SELECT DISTINCT ON (volume_id)
      volume_id,
      read_iops + write_iops as current_iops,
      avg_latency_ms as current_latency,
      read_throughput_mbps + write_throughput_mbps as current_throughput,
      timestamp as last_checked
    FROM san_performance_metrics
    ${volumeFilter}
    ORDER BY volume_id, timestamp DESC
  `;

  const results = await sequelize.query(query, {
    replacements: { volumeIds },
    type: QueryTypes.SELECT
  }) as any[];

  const report = [];

  for (const result of results) {
    const baseline = await getStoredBaseline(sequelize, result.volume_id);

    if (!baseline) {
      report.push({
        volumeId: result.volume_id,
        compliant: false,
        deviations: null,
        lastChecked: result.last_checked
      });
      continue;
    }

    const deviations = {
      iops: ((result.current_iops - baseline.metrics.avgIops) / baseline.metrics.avgIops) * 100,
      latency: ((result.current_latency - baseline.metrics.avgLatency) / baseline.metrics.avgLatency) * 100,
      throughput: ((result.current_throughput - baseline.metrics.avgThroughput) / baseline.metrics.avgThroughput) * 100
    };

    const compliant =
      Math.abs(deviations.iops) < 20 &&
      Math.abs(deviations.latency) < 20 &&
      Math.abs(deviations.throughput) < 20;

    report.push({
      volumeId: result.volume_id,
      compliant,
      deviations,
      lastChecked: result.last_checked
    });
  }

  return report;
}

// ============================================================================
// Anomaly Detection Functions (8 functions)
// ============================================================================

/**
 * 29. Detect performance anomalies using statistical methods
 */
export async function detectPerformanceAnomalies(
  sequelize: Sequelize,
  volumeId: string,
  sensitivityStdDev: number = 2
): Promise<PerformanceAnomaly[]> {
  const query = `
    WITH stats AS (
      SELECT
        AVG(read_iops + write_iops) as avg_iops,
        STDDEV(read_iops + write_iops) as stddev_iops,
        AVG(avg_latency_ms) as avg_latency,
        STDDEV(avg_latency_ms) as stddev_latency,
        AVG(read_throughput_mbps + write_throughput_mbps) as avg_throughput,
        STDDEV(read_throughput_mbps + write_throughput_mbps) as stddev_throughput
      FROM san_performance_metrics
      WHERE volume_id = :volumeId
        AND timestamp >= NOW() - INTERVAL '30 days'
    ),
    recent_metrics AS (
      SELECT
        timestamp,
        read_iops + write_iops as iops,
        avg_latency_ms as latency,
        read_throughput_mbps + write_throughput_mbps as throughput
      FROM san_performance_metrics
      WHERE volume_id = :volumeId
        AND timestamp >= NOW() - INTERVAL '1 hour'
    )
    SELECT
      r.timestamp,
      CASE
        WHEN ABS(r.iops - s.avg_iops) > :sensitivity * s.stddev_iops THEN 'iops_anomaly'
        WHEN ABS(r.latency - s.avg_latency) > :sensitivity * s.stddev_latency THEN 'latency_anomaly'
        WHEN ABS(r.throughput - s.avg_throughput) > :sensitivity * s.stddev_throughput THEN 'throughput_anomaly'
      END as anomaly_type,
      r.iops,
      r.latency,
      r.throughput,
      s.avg_iops,
      s.avg_latency,
      s.avg_throughput,
      ABS(r.iops - s.avg_iops) / NULLIF(s.avg_iops, 0) * 100 as iops_deviation_percent,
      ABS(r.latency - s.avg_latency) / NULLIF(s.avg_latency, 0) * 100 as latency_deviation_percent,
      ABS(r.throughput - s.avg_throughput) / NULLIF(s.avg_throughput, 0) * 100 as throughput_deviation_percent
    FROM recent_metrics r
    CROSS JOIN stats s
    WHERE (
      ABS(r.iops - s.avg_iops) > :sensitivity * s.stddev_iops OR
      ABS(r.latency - s.avg_latency) > :sensitivity * s.stddev_latency OR
      ABS(r.throughput - s.avg_throughput) > :sensitivity * s.stddev_throughput
    )
    ORDER BY r.timestamp DESC
  `;

  const results = await sequelize.query(query, {
    replacements: { volumeId, sensitivity: sensitivityStdDev },
    type: QueryTypes.SELECT
  }) as any[];

  return results.map((r: any) => ({
    volumeId,
    detectedAt: r.timestamp,
    anomalyType: r.anomaly_type,
    severity: calculateAnomalySeverity(r),
    description: generateAnomalyDescription(r),
    metrics: {
      iops: { total: r.iops },
      latency: { average: r.latency },
      throughput: { total: r.throughput }
    },
    baseline: {
      metrics: {
        avgIops: r.avg_iops,
        avgLatency: r.avg_latency,
        avgThroughput: r.avg_throughput
      }
    },
    deviationPercent: Math.max(
      r.iops_deviation_percent,
      r.latency_deviation_percent,
      r.throughput_deviation_percent
    ),
    resolved: false
  } as PerformanceAnomaly));
}

/**
 * 30. Detect sudden performance drops
 */
export async function detectPerformanceDrops(
  sequelize: Sequelize,
  volumeId: string,
  dropThresholdPercent: number = 30
): Promise<PerformanceAnomaly[]> {
  const query = `
    WITH windowed_metrics AS (
      SELECT
        timestamp,
        read_iops + write_iops as current_iops,
        avg_latency_ms as current_latency,
        read_throughput_mbps + write_throughput_mbps as current_throughput,
        LAG(read_iops + write_iops, 1) OVER (ORDER BY timestamp) as prev_iops,
        LAG(avg_latency_ms, 1) OVER (ORDER BY timestamp) as prev_latency,
        LAG(read_throughput_mbps + write_throughput_mbps, 1) OVER (ORDER BY timestamp) as prev_throughput,
        AVG(read_iops + write_iops) OVER (ORDER BY timestamp ROWS BETWEEN 10 PRECEDING AND 1 PRECEDING) as avg_iops,
        AVG(read_throughput_mbps + write_throughput_mbps) OVER (ORDER BY timestamp ROWS BETWEEN 10 PRECEDING AND 1 PRECEDING) as avg_throughput
      FROM san_performance_metrics
      WHERE volume_id = :volumeId
        AND timestamp >= NOW() - INTERVAL '24 hours'
    )
    SELECT
      timestamp,
      current_iops,
      current_latency,
      current_throughput,
      avg_iops,
      avg_throughput,
      ((avg_iops - current_iops) / NULLIF(avg_iops, 0) * 100) as iops_drop_percent,
      ((avg_throughput - current_throughput) / NULLIF(avg_throughput, 0) * 100) as throughput_drop_percent
    FROM windowed_metrics
    WHERE (
      ((avg_iops - current_iops) / NULLIF(avg_iops, 0) * 100) > :threshold OR
      ((avg_throughput - current_throughput) / NULLIF(avg_throughput, 0) * 100) > :threshold
    )
    AND prev_iops IS NOT NULL
    ORDER BY timestamp DESC
  `;

  const results = await sequelize.query(query, {
    replacements: { volumeId, threshold: dropThresholdPercent },
    type: QueryTypes.SELECT
  }) as any[];

  return results.map((r: any) => ({
    volumeId,
    detectedAt: r.timestamp,
    anomalyType: 'performance_drop',
    severity: r.iops_drop_percent > 50 || r.throughput_drop_percent > 50 ? 5 : 3,
    description: `Performance drop detected: IOPS down ${r.iops_drop_percent.toFixed(1)}%, Throughput down ${r.throughput_drop_percent.toFixed(1)}%`,
    metrics: {
      iops: { total: r.current_iops },
      throughput: { total: r.current_throughput }
    },
    baseline: {
      metrics: {
        avgIops: r.avg_iops,
        avgThroughput: r.avg_throughput
      }
    },
    deviationPercent: Math.max(r.iops_drop_percent, r.throughput_drop_percent),
    resolved: false
  } as PerformanceAnomaly));
}

/**
 * 31. Detect latency spikes
 */
export async function detectLatencySpikes(
  sequelize: Sequelize,
  volumeId: string,
  spikeThresholdMs: number = 50
): Promise<PerformanceAnomaly[]> {
  const query = `
    WITH baseline AS (
      SELECT AVG(avg_latency_ms) as avg_latency
      FROM san_performance_metrics
      WHERE volume_id = :volumeId
        AND timestamp >= NOW() - INTERVAL '7 days'
    )
    SELECT
      m.timestamp,
      m.avg_latency_ms as current_latency,
      m.p95_latency_ms,
      m.p99_latency_ms,
      b.avg_latency as baseline_latency,
      ((m.avg_latency_ms - b.avg_latency) / NULLIF(b.avg_latency, 0) * 100) as spike_percent
    FROM san_performance_metrics m
    CROSS JOIN baseline b
    WHERE m.volume_id = :volumeId
      AND m.timestamp >= NOW() - INTERVAL '1 hour'
      AND (m.avg_latency_ms - b.avg_latency) > :threshold
    ORDER BY m.timestamp DESC
  `;

  const results = await sequelize.query(query, {
    replacements: { volumeId, threshold: spikeThresholdMs },
    type: QueryTypes.SELECT
  }) as any[];

  return results.map((r: any) => ({
    volumeId,
    detectedAt: r.timestamp,
    anomalyType: 'latency_spike',
    severity: r.spike_percent > 100 ? 5 : r.spike_percent > 50 ? 3 : 1,
    description: `Latency spike: ${r.current_latency.toFixed(2)}ms (${r.spike_percent.toFixed(1)}% above baseline)`,
    metrics: {
      latency: {
        average: r.current_latency,
        p95: r.p95_latency_ms,
        p99: r.p99_latency_ms
      }
    },
    baseline: {
      metrics: {
        avgLatency: r.baseline_latency
      }
    },
    deviationPercent: r.spike_percent,
    resolved: false
  } as PerformanceAnomaly));
}

/**
 * 32. Detect capacity threshold breaches
 */
export async function detectCapacityAnomalies(
  sequelize: Sequelize,
  volumeId: string,
  warningThreshold: number = 80,
  criticalThreshold: number = 90
): Promise<PerformanceAnomaly[]> {
  const query = `
    SELECT
      timestamp,
      total_capacity_gb,
      used_capacity_gb,
      free_capacity_gb,
      ((used_capacity_gb::float / total_capacity_gb::float) * 100) as usage_percent
    FROM san_performance_metrics
    WHERE volume_id = :volumeId
      AND timestamp >= NOW() - INTERVAL '1 hour'
      AND ((used_capacity_gb::float / total_capacity_gb::float) * 100) >= :warningThreshold
    ORDER BY timestamp DESC
  `;

  const results = await sequelize.query(query, {
    replacements: { volumeId, warningThreshold },
    type: QueryTypes.SELECT
  }) as any[];

  return results.map((r: any) => {
    const isCritical = r.usage_percent >= criticalThreshold;

    return {
      volumeId,
      detectedAt: r.timestamp,
      anomalyType: 'capacity_threshold_breach',
      severity: isCritical ? 5 : 3,
      description: `Capacity at ${r.usage_percent.toFixed(1)}% (${r.used_capacity_gb.toFixed(2)}GB / ${r.total_capacity_gb.toFixed(2)}GB)`,
      metrics: {
        capacity: {
          total: r.total_capacity_gb,
          used: r.used_capacity_gb,
          free: r.free_capacity_gb,
          usagePercent: r.usage_percent
        }
      },
      baseline: {},
      deviationPercent: r.usage_percent - warningThreshold,
      resolved: false
    } as PerformanceAnomaly;
  });
}

/**
 * 33. Store detected anomaly
 */
export async function storeAnomaly(
  sequelize: Sequelize,
  anomaly: PerformanceAnomaly,
  transaction?: Transaction
): Promise<string> {
  const query = `
    INSERT INTO san_performance_anomalies (
      volume_id,
      detected_at,
      anomaly_type,
      severity,
      description,
      metrics_json,
      baseline_json,
      deviation_percent,
      resolved,
      resolved_at
    ) VALUES (
      :volumeId,
      :detectedAt,
      :anomalyType,
      :severity,
      :description,
      :metricsJson,
      :baselineJson,
      :deviationPercent,
      :resolved,
      :resolvedAt
    )
    RETURNING id
  `;

  const [result] = await sequelize.query(query, {
    replacements: {
      volumeId: anomaly.volumeId,
      detectedAt: anomaly.detectedAt,
      anomalyType: anomaly.anomalyType,
      severity: anomaly.severity,
      description: anomaly.description,
      metricsJson: JSON.stringify(anomaly.metrics),
      baselineJson: JSON.stringify(anomaly.baseline),
      deviationPercent: anomaly.deviationPercent,
      resolved: anomaly.resolved,
      resolvedAt: anomaly.resolvedAt || null
    },
    transaction,
    type: QueryTypes.INSERT
  }) as any[];

  return result.id;
}

/**
 * 34. Get unresolved anomalies
 */
export async function getUnresolvedAnomalies(
  sequelize: Sequelize,
  volumeId?: string
): Promise<PerformanceAnomaly[]> {
  const volumeFilter = volumeId ? 'AND volume_id = :volumeId' : '';

  const query = `
    SELECT
      id,
      volume_id,
      detected_at,
      anomaly_type,
      severity,
      description,
      metrics_json,
      baseline_json,
      deviation_percent,
      resolved,
      resolved_at
    FROM san_performance_anomalies
    WHERE resolved = false
      ${volumeFilter}
    ORDER BY severity DESC, detected_at DESC
  `;

  const results = await sequelize.query(query, {
    replacements: { volumeId },
    type: QueryTypes.SELECT
  }) as any[];

  return results.map((r: any) => ({
    id: r.id,
    volumeId: r.volume_id,
    detectedAt: r.detected_at,
    anomalyType: r.anomaly_type,
    severity: r.severity,
    description: r.description,
    metrics: JSON.parse(r.metrics_json),
    baseline: JSON.parse(r.baseline_json),
    deviationPercent: r.deviation_percent,
    resolved: r.resolved,
    resolvedAt: r.resolved_at
  }));
}

/**
 * 35. Resolve anomaly
 */
export async function resolveAnomaly(
  sequelize: Sequelize,
  anomalyId: string,
  transaction?: Transaction
): Promise<void> {
  const query = `
    UPDATE san_performance_anomalies
    SET resolved = true,
        resolved_at = NOW()
    WHERE id = :anomalyId
  `;

  await sequelize.query(query, {
    replacements: { anomalyId },
    transaction
  });
}

/**
 * 36. Auto-resolve anomalies based on current metrics
 */
export async function autoResolveAnomalies(
  sequelize: Sequelize,
  volumeId: string
): Promise<{ resolved: number }> {
  const unresolvedAnomalies = await getUnresolvedAnomalies(sequelize, volumeId);
  const currentMetrics = await collectCurrentMetrics(sequelize, volumeId);

  let resolvedCount = 0;

  for (const anomaly of unresolvedAnomalies) {
    let shouldResolve = false;

    switch (anomaly.anomalyType) {
      case 'latency_spike':
        shouldResolve = currentMetrics.latency.average < (anomaly.baseline.metrics?.avgLatency || 0) * 1.2;
        break;
      case 'performance_drop':
        shouldResolve = currentMetrics.iops.total >= (anomaly.baseline.metrics?.avgIops || 0) * 0.9;
        break;
      case 'capacity_threshold_breach':
        shouldResolve = currentMetrics.capacity.usagePercent < 80;
        break;
      default:
        // Check if metrics are back within 10% of baseline
        shouldResolve = anomaly.deviationPercent < 10;
    }

    if (shouldResolve && anomaly.id) {
      await resolveAnomaly(sequelize, anomaly.id);
      resolvedCount++;
    }
  }

  return { resolved: resolvedCount };
}

// ============================================================================
// Alerting Functions (6 functions)
// ============================================================================

/**
 * 37. Create performance alert
 */
export async function createPerformanceAlert(
  sequelize: Sequelize,
  alert: PerformanceAlert,
  transaction?: Transaction
): Promise<string> {
  const query = `
    INSERT INTO san_performance_alerts (
      volume_id,
      alert_type,
      threshold,
      operator,
      severity,
      enabled,
      cooldown_minutes,
      recipients
    ) VALUES (
      :volumeId,
      :alertType,
      :threshold,
      :operator,
      :severity,
      :enabled,
      :cooldownMinutes,
      :recipients
    )
    RETURNING id
  `;

  const [result] = await sequelize.query(query, {
    replacements: {
      volumeId: alert.volumeId,
      alertType: alert.alertType,
      threshold: alert.threshold,
      operator: alert.operator,
      severity: alert.severity,
      enabled: alert.enabled,
      cooldownMinutes: alert.cooldownMinutes,
      recipients: JSON.stringify(alert.recipients)
    },
    transaction,
    type: QueryTypes.INSERT
  }) as any[];

  return result.id;
}

/**
 * 38. Evaluate alert conditions
 */
export async function evaluateAlertConditions(
  sequelize: Sequelize,
  volumeId: string
): Promise<Array<{ alert: PerformanceAlert; triggered: boolean; currentValue: number }>> {
  const alertsQuery = `
    SELECT
      id,
      volume_id,
      alert_type,
      threshold,
      operator,
      severity,
      enabled,
      cooldown_minutes,
      recipients
    FROM san_performance_alerts
    WHERE volume_id = :volumeId
      AND enabled = true
  `;

  const alerts = await sequelize.query(alertsQuery, {
    replacements: { volumeId },
    type: QueryTypes.SELECT
  }) as any[];

  const currentMetrics = await collectCurrentMetrics(sequelize, volumeId);
  const results = [];

  for (const alertData of alerts) {
    const alert: PerformanceAlert = {
      id: alertData.id,
      volumeId: alertData.volume_id,
      alertType: alertData.alert_type,
      threshold: alertData.threshold,
      operator: alertData.operator,
      severity: alertData.severity,
      enabled: alertData.enabled,
      cooldownMinutes: alertData.cooldown_minutes,
      recipients: JSON.parse(alertData.recipients)
    };

    let currentValue: number = 0;
    let triggered = false;

    switch (alert.alertType) {
      case 'latency':
        currentValue = currentMetrics.latency.average;
        break;
      case 'iops':
        currentValue = currentMetrics.iops.total;
        break;
      case 'throughput':
        currentValue = currentMetrics.throughput.total;
        break;
      case 'capacity':
        currentValue = currentMetrics.capacity.usagePercent;
        break;
      case 'error':
        currentValue = currentMetrics.errorCount;
        break;
    }

    switch (alert.operator) {
      case 'gt':
        triggered = currentValue > alert.threshold;
        break;
      case 'lt':
        triggered = currentValue < alert.threshold;
        break;
      case 'gte':
        triggered = currentValue >= alert.threshold;
        break;
      case 'lte':
        triggered = currentValue <= alert.threshold;
        break;
      case 'eq':
        triggered = currentValue === alert.threshold;
        break;
    }

    // Check cooldown
    if (triggered && alert.id) {
      const inCooldown = await isAlertInCooldown(sequelize, alert.id, alert.cooldownMinutes);
      if (inCooldown) {
        triggered = false;
      }
    }

    results.push({ alert, triggered, currentValue });
  }

  return results;
}

/**
 * 39. Check if alert is in cooldown period
 */
async function isAlertInCooldown(
  sequelize: Sequelize,
  alertId: string,
  cooldownMinutes: number
): Promise<boolean> {
  const query = `
    SELECT COUNT(*) as recent_triggers
    FROM san_alert_history
    WHERE alert_id = :alertId
      AND triggered_at >= NOW() - INTERVAL '${cooldownMinutes} minutes'
  `;

  const [result] = await sequelize.query(query, {
    replacements: { alertId },
    type: QueryTypes.SELECT
  }) as any[];

  return result.recent_triggers > 0;
}

/**
 * 40. Trigger alert notification
 */
export async function triggerAlertNotification(
  sequelize: Sequelize,
  alert: PerformanceAlert,
  currentValue: number,
  metrics: PerformanceMetrics,
  transaction?: Transaction
): Promise<void> {
  // Log alert trigger
  const logQuery = `
    INSERT INTO san_alert_history (
      alert_id,
      volume_id,
      triggered_at,
      alert_type,
      threshold,
      current_value,
      severity,
      metrics_snapshot
    ) VALUES (
      :alertId,
      :volumeId,
      NOW(),
      :alertType,
      :threshold,
      :currentValue,
      :severity,
      :metricsSnapshot
    )
  `;

  await sequelize.query(logQuery, {
    replacements: {
      alertId: alert.id,
      volumeId: alert.volumeId,
      alertType: alert.alertType,
      threshold: alert.threshold,
      currentValue,
      severity: alert.severity,
      metricsSnapshot: JSON.stringify(metrics)
    },
    transaction
  });

  // Send notification to recipients
  const message = formatAlertMessage(alert, currentValue, metrics);

  // Note: Actual notification sending would integrate with email/SMS/Slack services
  console.log(`ALERT [${alert.severity.toUpperCase()}]: ${message}`);
  console.log(`Recipients: ${alert.recipients.join(', ')}`);
}

/**
 * 41. Format alert message
 */
function formatAlertMessage(
  alert: PerformanceAlert,
  currentValue: number,
  metrics: PerformanceMetrics
): string {
  const threshold = alert.threshold;
  const deviation = ((currentValue - threshold) / threshold * 100).toFixed(1);

  let message = `SAN Performance Alert for Volume ${alert.volumeId}\n`;
  message += `Alert Type: ${alert.alertType.toUpperCase()}\n`;
  message += `Severity: ${alert.severity.toUpperCase()}\n`;
  message += `Current Value: ${currentValue.toFixed(2)}\n`;
  message += `Threshold: ${alert.operator} ${threshold}\n`;
  message += `Deviation: ${deviation}%\n`;
  message += `\nCurrent Metrics:\n`;
  message += `- IOPS: ${metrics.iops.total}\n`;
  message += `- Latency: ${metrics.latency.average.toFixed(2)}ms\n`;
  message += `- Throughput: ${metrics.throughput.total.toFixed(2)} MB/s\n`;
  message += `- Capacity: ${metrics.capacity.usagePercent.toFixed(1)}%\n`;
  message += `- Health Score: ${metrics.healthScore}\n`;

  return message;
}

/**
 * 42. Get alert history
 */
export async function getAlertHistory(
  sequelize: Sequelize,
  volumeId?: string,
  startTime?: Date,
  endTime?: Date,
  limit: number = 100
): Promise<Array<{
  alertId: string;
  volumeId: string;
  triggeredAt: Date;
  alertType: string;
  severity: string;
  currentValue: number;
  threshold: number;
}>> {
  const conditions = [];
  const replacements: any = { limit };

  if (volumeId) {
    conditions.push('volume_id = :volumeId');
    replacements.volumeId = volumeId;
  }

  if (startTime) {
    conditions.push('triggered_at >= :startTime');
    replacements.startTime = startTime;
  }

  if (endTime) {
    conditions.push('triggered_at <= :endTime');
    replacements.endTime = endTime;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      alert_id,
      volume_id,
      triggered_at,
      alert_type,
      severity,
      current_value,
      threshold
    FROM san_alert_history
    ${whereClause}
    ORDER BY triggered_at DESC
    LIMIT :limit
  `;

  const results = await sequelize.query(query, {
    replacements,
    type: QueryTypes.SELECT
  }) as any[];

  return results.map((r: any) => ({
    alertId: r.alert_id,
    volumeId: r.volume_id,
    triggeredAt: r.triggered_at,
    alertType: r.alert_type,
    severity: r.severity,
    currentValue: r.current_value,
    threshold: r.threshold
  }));
}

// ============================================================================
// Health Reporting Functions (6 functions)
// ============================================================================

/**
 * 43. Generate storage health report
 */
export async function generateStorageHealthReport(
  sequelize: Sequelize,
  volumeIds?: string[]
): Promise<StorageHealthReport> {
  const volumeFilter = volumeIds
    ? `WHERE volume_id = ANY(:volumeIds)`
    : '';

  const query = `
    SELECT DISTINCT ON (volume_id)
      volume_id,
      health_score,
      status,
      read_iops + write_iops as total_iops,
      avg_latency_ms,
      read_throughput_mbps + write_throughput_mbps as total_throughput,
      ((used_capacity_gb::float / total_capacity_gb::float) * 100) as usage_percent,
      error_count,
      cache_hit_rate,
      timestamp
    FROM san_performance_metrics
    ${volumeFilter}
    ORDER BY volume_id, timestamp DESC
  `;

  const volumes = await sequelize.query(query, {
    replacements: { volumeIds },
    type: QueryTypes.SELECT
  }) as any[];

  const volumeReports = await Promise.all(
    volumes.map(async (v: any) => {
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Analyze issues
      if (v.usage_percent > 90) {
        issues.push(`Critical capacity: ${v.usage_percent.toFixed(1)}%`);
        recommendations.push('Immediate capacity expansion required');
      } else if (v.usage_percent > 80) {
        issues.push(`High capacity usage: ${v.usage_percent.toFixed(1)}%`);
        recommendations.push('Plan capacity expansion');
      }

      if (v.avg_latency_ms > 20) {
        issues.push(`High latency: ${v.avg_latency_ms.toFixed(2)}ms`);
        recommendations.push('Review workload distribution and cache configuration');
      }

      if (v.cache_hit_rate < 70) {
        issues.push(`Low cache hit rate: ${v.cache_hit_rate.toFixed(1)}%`);
        recommendations.push('Optimize cache policies or increase cache size');
      }

      if (v.error_count > 0) {
        issues.push(`Errors detected: ${v.error_count}`);
        recommendations.push('Investigate error logs and storage connectivity');
      }

      return {
        volumeId: v.volume_id,
        healthScore: v.health_score,
        status: v.status,
        issues,
        recommendations
      };
    })
  );

  // Get recent alerts
  const alerts = await sequelize.query(
    `SELECT * FROM san_performance_alerts WHERE enabled = true ${volumeFilter ? 'AND ' + volumeFilter.substring(6) : ''}`,
    {
      replacements: { volumeIds },
      type: QueryTypes.SELECT
    }
  ) as any[];

  // Get unresolved anomalies
  const anomalies = await getUnresolvedAnomalies(sequelize, volumeIds ? volumeIds[0] : undefined);

  const summary = {
    totalVolumes: volumeReports.length,
    healthyVolumes: volumeReports.filter(v => v.status === 'healthy').length,
    warningVolumes: volumeReports.filter(v => v.status === 'warning').length,
    criticalVolumes: volumeReports.filter(v => v.status === 'critical' || v.status === 'degraded').length
  };

  const overallHealth = volumeReports.reduce((sum, v) => sum + v.healthScore, 0) / volumeReports.length || 0;

  return {
    generatedAt: new Date(),
    overallHealth,
    volumes: volumeReports,
    alerts: alerts.map((a: any) => ({
      id: a.id,
      volumeId: a.volume_id,
      alertType: a.alert_type,
      threshold: a.threshold,
      operator: a.operator,
      severity: a.severity,
      enabled: a.enabled,
      cooldownMinutes: a.cooldown_minutes,
      recipients: JSON.parse(a.recipients)
    })),
    anomalies,
    summary
  };
}

/**
 * 44. Export performance data for external analysis
 */
export async function exportPerformanceData(
  sequelize: Sequelize,
  volumeId: string,
  startTime: Date,
  endTime: Date,
  format: 'json' | 'csv' = 'json'
): Promise<string> {
  const metrics = await getHistoricalMetrics(sequelize, volumeId, startTime, endTime);

  if (format === 'csv') {
    const headers = [
      'timestamp',
      'volume_id',
      'read_iops',
      'write_iops',
      'total_iops',
      'read_latency_ms',
      'write_latency_ms',
      'avg_latency_ms',
      'p95_latency_ms',
      'p99_latency_ms',
      'read_throughput_mbps',
      'write_throughput_mbps',
      'total_throughput_mbps',
      'total_capacity_gb',
      'used_capacity_gb',
      'usage_percent',
      'cache_hit_rate',
      'error_count',
      'health_score',
      'status'
    ].join(',');

    const rows = metrics.map(m => [
      m.timestamp.toISOString(),
      m.volumeId,
      m.iops.read,
      m.iops.write,
      m.iops.total,
      m.latency.read,
      m.latency.write,
      m.latency.average,
      m.latency.p95,
      m.latency.p99,
      m.throughput.read,
      m.throughput.write,
      m.throughput.total,
      m.capacity.total,
      m.capacity.used,
      m.capacity.usagePercent,
      m.cacheHitRate,
      m.errorCount,
      m.healthScore,
      m.status
    ].join(','));

    return [headers, ...rows].join('\n');
  }

  return JSON.stringify(metrics, null, 2);
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Map database result to PerformanceMetrics object
 */
function mapToPerformanceMetrics(result: any): PerformanceMetrics {
  return {
    timestamp: result.timestamp,
    volumeId: result.volume_id,
    lunId: result.lun_id,
    storagePoolId: result.storage_pool_id,
    iops: {
      read: result.read_iops,
      write: result.write_iops,
      total: result.total_iops,
      timestamp: result.timestamp,
      volumeId: result.volume_id,
      lunId: result.lun_id
    },
    latency: {
      read: result.read_latency_ms,
      write: result.write_latency_ms,
      average: result.avg_latency_ms,
      p50: result.p50_latency_ms,
      p95: result.p95_latency_ms,
      p99: result.p99_latency_ms,
      timestamp: result.timestamp,
      volumeId: result.volume_id
    },
    throughput: {
      read: result.read_throughput_mbps,
      write: result.write_throughput_mbps,
      total: result.total_throughput,
      peakRead: result.peak_read_throughput_mbps,
      peakWrite: result.peak_write_throughput_mbps,
      timestamp: result.timestamp,
      volumeId: result.volume_id
    },
    capacity: {
      total: result.total_capacity_gb,
      used: result.used_capacity_gb,
      free: result.free_capacity_gb,
      usagePercent: result.usage_percent
    },
    queueDepth: result.queue_depth,
    queueLatency: result.queue_latency_ms,
    cacheHitRate: result.cache_hit_rate,
    cacheMissRate: result.cache_miss_rate,
    errorCount: result.error_count,
    retryCount: result.retry_count,
    healthScore: result.health_score,
    status: result.status
  };
}

/**
 * Calculate latency score (0-100)
 */
function calculateLatencyScore(latency: Latency): number {
  const avgLatency = latency.average;
  if (avgLatency <= 5) return 100;
  if (avgLatency <= 10) return 90;
  if (avgLatency <= 20) return 75;
  if (avgLatency <= 50) return 50;
  return 25;
}

/**
 * Calculate throughput score (0-100)
 */
function calculateThroughputScore(throughput: Throughput): number {
  const utilization = (throughput.total / (throughput.peakRead + throughput.peakWrite)) * 100;
  if (utilization >= 80) return 100;
  if (utilization >= 60) return 85;
  if (utilization >= 40) return 70;
  return 50;
}

/**
 * Calculate capacity score (0-100)
 */
function calculateCapacityScore(capacity: { usagePercent: number }): number {
  const usage = capacity.usagePercent;
  if (usage <= 70) return 100;
  if (usage <= 80) return 85;
  if (usage <= 90) return 60;
  return 30;
}

/**
 * Calculate error score (0-100)
 */
function calculateErrorScore(errorCount: number, retryCount: number): number {
  const totalErrors = errorCount + retryCount;
  if (totalErrors === 0) return 100;
  if (totalErrors <= 5) return 80;
  if (totalErrors <= 20) return 60;
  return 30;
}

/**
 * Calculate projected full date based on growth trend
 */
async function calculateProjectedFullDate(
  sequelize: Sequelize,
  volumeId: string
): Promise<Date | undefined> {
  const growthRate = await calculateCapacityGrowthRate(sequelize, volumeId);
  return growthRate.projectedFullDate || undefined;
}

/**
 * Calculate anomaly severity (1-5)
 */
function calculateAnomalySeverity(anomalyData: any): number {
  const maxDeviation = Math.max(
    anomalyData.iops_deviation_percent || 0,
    anomalyData.latency_deviation_percent || 0,
    anomalyData.throughput_deviation_percent || 0
  );

  if (maxDeviation > 100) return 5;
  if (maxDeviation > 50) return 4;
  if (maxDeviation > 25) return 3;
  if (maxDeviation > 10) return 2;
  return 1;
}

/**
 * Generate anomaly description
 */
function generateAnomalyDescription(anomalyData: any): string {
  const type = anomalyData.anomaly_type;

  switch (type) {
    case 'iops_anomaly':
      return `IOPS anomaly: ${anomalyData.iops.toFixed(0)} (${anomalyData.iops_deviation_percent.toFixed(1)}% deviation from baseline)`;
    case 'latency_anomaly':
      return `Latency anomaly: ${anomalyData.latency.toFixed(2)}ms (${anomalyData.latency_deviation_percent.toFixed(1)}% deviation from baseline)`;
    case 'throughput_anomaly':
      return `Throughput anomaly: ${anomalyData.throughput.toFixed(2)} MB/s (${anomalyData.throughput_deviation_percent.toFixed(1)}% deviation from baseline)`;
    default:
      return `Performance anomaly detected`;
  }
}
