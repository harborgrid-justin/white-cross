/**
 * @fileoverview Performance Metrics Types
 * @module infrastructure/monitoring/types
 * @description Type definitions for performance monitoring and metrics
 */

export interface RequestMetrics {
  endpoint: string;
  method: string;
  count: number;
  totalDuration: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  p50Duration: number;
  p95Duration: number;
  p99Duration: number;
  statusCodes: Record<number, number>;
  errorCount: number;
  lastAccessed: Date;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
  avgHitDuration: number;
  avgMissDuration: number;
  cacheSize: number;
  evictions: number;
}

export interface PoolMetrics {
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
  totalConnections: number;
  maxConnections: number;
  utilizationPercent: number;
  avgWaitTime: number;
  connectionErrors: number;
}

export interface MemoryMetrics {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  utilizationPercent: number;
  gcPauses: number;
  avgGcDuration: number;
}

export interface QueryPerformanceMetrics {
  totalQueries: number;
  slowQueries: number;
  avgQueryTime: number;
  p50QueryTime: number;
  p95QueryTime: number;
  p99QueryTime: number;
  n1DetectionCount: number;
  queryDistribution: {
    fast: number;
    medium: number;
    slow: number;
    verySlow: number;
  };
}

export interface PerformanceSummary {
  timestamp: Date;
  uptime: number;
  requests: {
    total: number;
    perSecond: number;
    avgDuration: number;
    errorRate: number;
  };
  queries: QueryPerformanceMetrics;
  cache: CacheMetrics;
  pool: PoolMetrics;
  memory: MemoryMetrics;
  topEndpoints: RequestMetrics[];
  slowestEndpoints: RequestMetrics[];
}

export interface PerformanceTrend {
  timestamp: Date;
  metric: string;
  value: number;
  baseline: number;
  percentChange: number;
  trend: 'improving' | 'degrading' | 'stable';
}

export type CacheOperation = 'hit' | 'miss' | 'set' | 'delete' | 'eviction';
