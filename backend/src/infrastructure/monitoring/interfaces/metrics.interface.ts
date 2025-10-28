/**
 * Metrics Type Definitions
 *
 * @module infrastructure/monitoring/interfaces
 * @description Type-safe interfaces for system metrics and performance tracking
 */

/**
 * System resource metrics
 */
export interface SystemMetrics {
  /**
   * CPU usage metrics
   */
  cpu: {
    /** Overall CPU usage percentage (0-100) */
    usage: number;
    /** System-wide CPU usage percentage */
    system: number;
    /** User CPU time percentage */
    user: number;
    /** Number of CPU cores */
    cores: number;
    /** Load average (1, 5, 15 minutes) */
    loadAverage: number[];
  };

  /**
   * Memory usage metrics
   */
  memory: {
    /** Total memory in bytes */
    total: number;
    /** Used memory in bytes */
    used: number;
    /** Free memory in bytes */
    free: number;
    /** Memory usage percentage (0-100) */
    usagePercent: number;
    /** Heap used in bytes */
    heapUsed: number;
    /** Heap total in bytes */
    heapTotal: number;
    /** External memory in bytes */
    external: number;
    /** RSS (Resident Set Size) in bytes */
    rss: number;
  };

  /**
   * Process metrics
   */
  process: {
    /** Process uptime in seconds */
    uptime: number;
    /** Process ID */
    pid: number;
    /** Node.js version */
    nodeVersion: string;
    /** Platform (linux, darwin, win32) */
    platform: string;
  };
}

/**
 * Application performance metrics
 */
export interface PerformanceMetrics {
  /**
   * HTTP request metrics
   */
  requests: {
    /** Total requests per second */
    requestsPerSecond: number;
    /** Average response time in milliseconds */
    averageResponseTime: number;
    /** 95th percentile response time */
    p95ResponseTime: number;
    /** 99th percentile response time */
    p99ResponseTime: number;
    /** Total requests since start */
    totalRequests: number;
    /** Failed requests count */
    failedRequests: number;
    /** Success rate percentage */
    successRate: number;
  };

  /**
   * Database metrics
   */
  database: {
    /** Active database connections */
    activeConnections: number;
    /** Idle connections */
    idleConnections: number;
    /** Average query time in milliseconds */
    averageQueryTime: number;
    /** Slow queries count (>1000ms) */
    slowQueries: number;
  };

  /**
   * Cache metrics
   */
  cache: {
    /** Cache hit rate percentage */
    hitRate: number;
    /** Total cache hits */
    hits: number;
    /** Total cache misses */
    misses: number;
    /** Cache size (number of entries) */
    size: number;
    /** Memory usage in bytes */
    memoryUsage: number;
  };

  /**
   * WebSocket metrics
   */
  websocket: {
    /** Connected clients count */
    connectedClients: number;
    /** Messages sent per second */
    messagesPerSecond: number;
    /** Total messages sent */
    totalMessages: number;
  };

  /**
   * Job queue metrics
   */
  queue: {
    /** Jobs waiting to be processed */
    waitingJobs: number;
    /** Jobs currently being processed */
    activeJobs: number;
    /** Completed jobs count */
    completedJobs: number;
    /** Failed jobs count */
    failedJobs: number;
    /** Average job processing time in milliseconds */
    averageProcessingTime: number;
  };
}

/**
 * Complete metrics snapshot
 */
export interface MetricsSnapshot {
  /** Timestamp of metrics collection */
  timestamp: string;
  /** System resource metrics */
  system: SystemMetrics;
  /** Application performance metrics */
  performance: PerformanceMetrics;
}

/**
 * Alert severity levels
 */
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Alert notification
 */
export interface Alert {
  /** Alert ID */
  id: string;
  /** Alert severity */
  severity: AlertSeverity;
  /** Alert title */
  title: string;
  /** Alert message */
  message: string;
  /** Component that triggered the alert */
  component: string;
  /** Timestamp when alert was triggered */
  timestamp: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
  /** Whether alert has been acknowledged */
  acknowledged: boolean;
  /** Resolution timestamp */
  resolvedAt?: string;
}

/**
 * Alert configuration
 */
export interface AlertConfig {
  /** Enable/disable alerting */
  enabled: boolean;
  /** CPU usage threshold (percentage) */
  cpuThreshold: number;
  /** Memory usage threshold (percentage) */
  memoryThreshold: number;
  /** Response time threshold (milliseconds) */
  responseTimeThreshold: number;
  /** Error rate threshold (percentage) */
  errorRateThreshold: number;
  /** Database connection pool threshold (percentage) */
  dbConnectionThreshold: number;
  /** Failed jobs threshold (count) */
  failedJobsThreshold: number;
}

/**
 * Performance tracking entry
 */
export interface PerformanceEntry {
  /** Operation identifier */
  operation: string;
  /** Duration in milliseconds */
  duration: number;
  /** Timestamp */
  timestamp: string;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Monitoring dashboard data
 */
export interface DashboardData {
  /** Overall system status */
  status: {
    /** System health status */
    health: string;
    /** Uptime in seconds */
    uptime: number;
    /** Environment */
    environment: string;
    /** Version */
    version: string;
  };
  /** Current metrics */
  metrics: MetricsSnapshot;
  /** Active alerts */
  alerts: Alert[];
  /** Recent performance entries */
  recentPerformance: PerformanceEntry[];
  /** Component health summary */
  components: {
    database: string;
    cache: string;
    websocket: string;
    queue: string;
    externalApis: string;
  };
}

/**
 * Log aggregation entry
 */
export interface LogEntry {
  /** Log level */
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  /** Log message */
  message: string;
  /** Timestamp */
  timestamp: string;
  /** Context (module/service name) */
  context: string;
  /** Stack trace for errors */
  stack?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Log query parameters
 */
export interface LogQueryParams {
  /** Log level filter */
  level?: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  /** Context filter */
  context?: string;
  /** Start timestamp */
  startTime?: string;
  /** End timestamp */
  endTime?: string;
  /** Maximum number of entries to return */
  limit?: number;
  /** Search query */
  search?: string;
}
