export interface MetricsSnapshot {
  counters: Record<string, Record<string, number>>;
  histograms: Record<string, Array<{ value: number; labels: Record<string, string>; timestamp: number }>>;
  gauges: Record<string, { value: number; labels: Record<string, string>; timestamp: number }>;
  timestamp: number;
}

export interface PerformanceStats {
  requestCounts: Record<string, number>;
  averageResponseTimes: Record<string, number>;
  errorRates: Record<string, number>;
  cacheHitRates: Record<string, number>;
  memoryUsage: NodeJS.MemoryUsage;
  uptime: number;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    database: boolean;
    cache: boolean;
    memory: boolean;
  };
}

export interface MetricLabels {
  [key: string]: string | number;
}

export interface HistogramEntry {
  value: number;
  labels: Record<string, string>;
  timestamp: number;
}
