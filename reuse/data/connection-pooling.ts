/**
 * LOC: CONNPOOL1234
 * File: /reuse/data/connection-pooling.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize 6.x core
 *   - @nestjs/common for dependency injection
 *   - ioredis for connection state management
 *
 * DOWNSTREAM (imported by):
 *   - Backend database configuration
 *   - Service layer data access
 *   - Performance monitoring systems
 */

/**
 * File: /reuse/data/connection-pooling.ts
 * Locator: WC-DATA-POOL-001
 * Purpose: Enterprise-grade Connection Pool Optimization & Management
 *
 * Upstream: Sequelize 6.x, NestJS, Node.js
 * Downstream: ../backend/*, services, database configuration
 * Dependencies: TypeScript 5.x, Sequelize 6.x, @nestjs/common, ioredis
 * Exports: 35 functions for connection pool optimization, health checks, monitoring, leak detection
 *
 * LLM Context: Production-ready connection pool management for White Cross healthcare system.
 * Provides connection pool optimization, dynamic pool sizing, connection lifecycle management,
 * health checks, pool monitoring and metrics, connection leak detection, pool draining strategies,
 * connection retry logic, read replica routing, master-slave coordination, and healthcare-specific
 * connection patterns for high-availability medical data access.
 */

import { Sequelize, ConnectionOptions, Options } from 'sequelize';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter } from 'events';
import * as os from 'os';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PoolConfig {
  max?: number;
  min?: number;
  idle?: number;
  acquire?: number;
  evict?: number;
  maxUses?: number;
  validate?: (connection: any) => boolean;
  handleDisconnects?: boolean;
}

export interface DynamicPoolConfig {
  minSize: number;
  maxSize: number;
  targetUtilization: number;
  scaleUpThreshold: number;
  scaleDownThreshold: number;
  evaluationInterval: number;
  cooldownPeriod: number;
}

export interface PoolMetrics {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
  totalCreated: number;
  totalDestroyed: number;
  totalAcquired: number;
  totalReleased: number;
  totalTimedOut: number;
  averageWaitTime: number;
  averageConnectionLife: number;
  poolUtilization: number;
  errorRate: number;
}

export interface ConnectionHealth {
  isHealthy: boolean;
  responseTime: number;
  lastChecked: number;
  consecutiveFailures: number;
  metadata: Record<string, any>;
}

export interface ConnectionLeak {
  connectionId: string;
  acquiredAt: number;
  stackTrace: string;
  duration: number;
  query?: string;
}

export interface ReplicaConfig {
  read: Sequelize[];
  write: Sequelize;
  loadBalancing: 'round-robin' | 'least-connections' | 'weighted';
  weights?: Map<Sequelize, number>;
}

export interface PoolDrainConfig {
  timeout: number;
  forceAfterTimeout: boolean;
  graceful: boolean;
}

export interface ConnectionRetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  connectionTimeout: number;
}

export interface PoolOptimizationRecommendation {
  currentConfig: PoolConfig;
  recommendedConfig: PoolConfig;
  reasoning: string[];
  expectedImprovements: string[];
  risks: string[];
}

export enum PoolState {
  INITIALIZING = 'INITIALIZING',
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  DRAINING = 'DRAINING',
  CLOSED = 'CLOSED',
  ERROR = 'ERROR'
}

export interface ConnectionPoolEvent {
  type: 'acquire' | 'release' | 'create' | 'destroy' | 'timeout' | 'error';
  timestamp: number;
  connectionId?: string;
  duration?: number;
  error?: Error;
}

// ============================================================================
// POOL SIZE CALCULATION (Functions 1-4)
// ============================================================================

/**
 * Calculates optimal pool size based on system resources
 * @param cpuCores - Number of CPU cores (defaults to system cores)
 * @param connectionLatency - Average connection latency in ms
 * @param avgQueryTime - Average query execution time in ms
 * @param targetUtilization - Target CPU utilization (0-1)
 * @returns Recommended pool configuration
 */
export function calculateOptimalPoolSize(
  cpuCores: number = os.cpus().length,
  connectionLatency: number = 50,
  avgQueryTime: number = 100,
  targetUtilization: number = 0.7
): PoolConfig {
  // Formula: connections = cores * (1 + wait_time / service_time) * utilization
  const waitTime = connectionLatency;
  const serviceTime = avgQueryTime;

  const optimalConnections = Math.ceil(
    cpuCores * (1 + waitTime / serviceTime) * targetUtilization
  );

  return {
    max: Math.max(optimalConnections, 10),
    min: Math.max(Math.floor(optimalConnections * 0.3), 2),
    idle: 10000,
    acquire: 30000,
    evict: 1000
  };
}

/**
 * Calculates pool size based on expected concurrent users
 * @param concurrentUsers - Expected number of concurrent users
 * @param requestsPerUser - Average requests per user per second
 * @param avgRequestDuration - Average request duration in ms
 * @param safetyMargin - Safety margin multiplier (default: 1.2)
 * @returns Recommended pool configuration
 */
export function calculatePoolSizeByLoad(
  concurrentUsers: number,
  requestsPerUser: number,
  avgRequestDuration: number,
  safetyMargin: number = 1.2
): PoolConfig {
  const totalRequestsPerSecond = concurrentUsers * requestsPerUser;
  const avgDurationSeconds = avgRequestDuration / 1000;

  const requiredConnections = Math.ceil(
    totalRequestsPerSecond * avgDurationSeconds * safetyMargin
  );

  return {
    max: Math.max(requiredConnections, 10),
    min: Math.max(Math.floor(requiredConnections * 0.2), 2),
    idle: 10000,
    acquire: 30000,
    evict: 1000
  };
}

/**
 * Adjusts pool size based on current metrics
 * @param currentConfig - Current pool configuration
 * @param metrics - Current pool metrics
 * @param targetUtilization - Target pool utilization (0-1)
 * @returns Adjusted pool configuration
 */
export function adjustPoolSize(
  currentConfig: PoolConfig,
  metrics: PoolMetrics,
  targetUtilization: number = 0.7
): PoolConfig {
  const currentUtilization = metrics.poolUtilization;
  const adjustedConfig = { ...currentConfig };

  // Scale up if utilization is too high
  if (currentUtilization > 0.9 && adjustedConfig.max) {
    adjustedConfig.max = Math.min(
      Math.ceil(adjustedConfig.max * 1.5),
      100 // Hard cap
    );
  }

  // Scale down if utilization is too low
  if (currentUtilization < 0.3 && adjustedConfig.max) {
    adjustedConfig.max = Math.max(
      Math.floor(adjustedConfig.max * 0.8),
      10 // Minimum size
    );
  }

  // Adjust min size proportionally
  if (adjustedConfig.max && adjustedConfig.min) {
    adjustedConfig.min = Math.max(
      Math.floor(adjustedConfig.max * 0.2),
      2
    );
  }

  return adjustedConfig;
}

/**
 * Validates pool configuration for correctness
 * @param config - Pool configuration to validate
 * @returns Validation result with errors if any
 */
export function validatePoolConfig(
  config: PoolConfig
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (config.max && config.min && config.max < config.min) {
    errors.push('max must be greater than or equal to min');
  }

  if (config.max && config.max < 1) {
    errors.push('max must be at least 1');
  }

  if (config.min && config.min < 0) {
    errors.push('min cannot be negative');
  }

  if (config.idle && config.idle < 0) {
    errors.push('idle timeout cannot be negative');
  }

  if (config.acquire && config.acquire < 0) {
    errors.push('acquire timeout cannot be negative');
  }

  if (config.max && config.max > 1000) {
    errors.push('max pool size seems excessive (>1000), consider reviewing');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ============================================================================
// CONNECTION LIFECYCLE MANAGEMENT (Functions 5-10)
// ============================================================================

/**
 * Connection pool manager with lifecycle hooks
 */
@Injectable()
export class ConnectionPoolManager implements OnModuleDestroy {
  private readonly logger = new Logger(ConnectionPoolManager.name);
  private readonly eventEmitter = new EventEmitter();
  private pools = new Map<string, Sequelize>();
  private metrics = new Map<string, PoolMetrics>();
  private healthStatus = new Map<string, ConnectionHealth>();

  /**
   * Registers a connection pool for management
   * @param name - Pool identifier
   * @param sequelize - Sequelize instance
   */
  registerPool(name: string, sequelize: Sequelize): void {
    this.pools.set(name, sequelize);
    this.initializeMetrics(name);
    this.setupLifecycleHooks(name, sequelize);
    this.logger.log(`Registered connection pool: ${name}`);
  }

  /**
   * Initializes metrics tracking for a pool
   * @param name - Pool identifier
   */
  private initializeMetrics(name: string): void {
    this.metrics.set(name, {
      totalConnections: 0,
      activeConnections: 0,
      idleConnections: 0,
      waitingRequests: 0,
      totalCreated: 0,
      totalDestroyed: 0,
      totalAcquired: 0,
      totalReleased: 0,
      totalTimedOut: 0,
      averageWaitTime: 0,
      averageConnectionLife: 0,
      poolUtilization: 0,
      errorRate: 0
    });
  }

  /**
   * Sets up lifecycle hooks for connection monitoring
   * @param name - Pool identifier
   * @param sequelize - Sequelize instance
   */
  private setupLifecycleHooks(name: string, sequelize: Sequelize): void {
    const pool = (sequelize.connectionManager as any).pool;

    if (!pool) {
      this.logger.warn(`No pool found for ${name}`);
      return;
    }

    // Hook into pool events if available
    pool.on('createSuccess', () => {
      this.trackEvent(name, 'create');
    });

    pool.on('destroySuccess', () => {
      this.trackEvent(name, 'destroy');
    });

    pool.on('acquireSuccess', () => {
      this.trackEvent(name, 'acquire');
    });

    pool.on('release', () => {
      this.trackEvent(name, 'release');
    });

    pool.on('acquireTimeout', () => {
      this.trackEvent(name, 'timeout');
    });
  }

  /**
   * Tracks connection pool events
   * @param poolName - Pool identifier
   * @param eventType - Type of event
   */
  private trackEvent(
    poolName: string,
    eventType: ConnectionPoolEvent['type']
  ): void {
    const metrics = this.metrics.get(poolName);
    if (!metrics) return;

    switch (eventType) {
      case 'create':
        metrics.totalCreated++;
        break;
      case 'destroy':
        metrics.totalDestroyed++;
        break;
      case 'acquire':
        metrics.totalAcquired++;
        break;
      case 'release':
        metrics.totalReleased++;
        break;
      case 'timeout':
        metrics.totalTimedOut++;
        break;
    }

    this.eventEmitter.emit('pool:event', {
      pool: poolName,
      type: eventType,
      timestamp: Date.now()
    });
  }

  /**
   * Gracefully closes a connection pool
   * @param name - Pool identifier
   * @param config - Drain configuration
   */
  async closePool(name: string, config?: PoolDrainConfig): Promise<void> {
    const sequelize = this.pools.get(name);
    if (!sequelize) {
      throw new Error(`Pool ${name} not found`);
    }

    const drainConfig: PoolDrainConfig = {
      timeout: 30000,
      forceAfterTimeout: true,
      graceful: true,
      ...config
    };

    this.logger.log(`Closing pool ${name}...`);

    try {
      if (drainConfig.graceful) {
        await this.drainPool(sequelize, drainConfig);
      }

      await sequelize.close();
      this.pools.delete(name);
      this.metrics.delete(name);
      this.healthStatus.delete(name);

      this.logger.log(`Pool ${name} closed successfully`);
    } catch (error: any) {
      this.logger.error(`Error closing pool ${name}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Drains connections from a pool
   * @param sequelize - Sequelize instance
   * @param config - Drain configuration
   */
  private async drainPool(
    sequelize: Sequelize,
    config: PoolDrainConfig
  ): Promise<void> {
    const pool = (sequelize.connectionManager as any).pool;
    const startTime = Date.now();

    while (Date.now() - startTime < config.timeout) {
      const activeConnections = pool?.used?.length || 0;

      if (activeConnections === 0) {
        this.logger.debug('Pool drained successfully');
        return;
      }

      this.logger.debug(`Waiting for ${activeConnections} connections to close...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (config.forceAfterTimeout) {
      this.logger.warn('Drain timeout reached, forcing pool closure');
    } else {
      throw new Error('Pool drain timeout exceeded');
    }
  }

  /**
   * Gets current metrics for a pool
   * @param name - Pool identifier
   * @returns Current pool metrics
   */
  getMetrics(name: string): PoolMetrics | undefined {
    const sequelize = this.pools.get(name);
    if (!sequelize) return undefined;

    const pool = (sequelize.connectionManager as any).pool;
    const metrics = this.metrics.get(name);

    if (!metrics || !pool) return metrics;

    // Update real-time metrics
    metrics.activeConnections = pool.used?.length || 0;
    metrics.idleConnections = pool.free?.length || 0;
    metrics.waitingRequests = pool.pending?.length || 0;
    metrics.totalConnections = metrics.activeConnections + metrics.idleConnections;

    const maxConnections = pool.options?.max || 1;
    metrics.poolUtilization =
      metrics.totalConnections / maxConnections;

    return metrics;
  }

  /**
   * Cleanup on module destruction
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.log('Closing all connection pools...');

    const closePromises = Array.from(this.pools.keys()).map(name =>
      this.closePool(name, { timeout: 10000, forceAfterTimeout: true, graceful: true })
    );

    await Promise.allSettled(closePromises);
  }
}

// ============================================================================
// CONNECTION HEALTH CHECKS (Functions 11-15)
// ============================================================================

/**
 * Performs a health check on a database connection
 * @param sequelize - Sequelize instance
 * @param timeout - Health check timeout
 * @returns Health status
 */
export async function checkConnectionHealth(
  sequelize: Sequelize,
  timeout: number = 5000
): Promise<ConnectionHealth> {
  const startTime = Date.now();
  let isHealthy = false;
  let consecutiveFailures = 0;
  let metadata: Record<string, any> = {};

  try {
    await Promise.race([
      sequelize.authenticate(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Health check timeout')), timeout)
      )
    ]);

    isHealthy = true;
    metadata.lastSuccessfulCheck = new Date().toISOString();
  } catch (error: any) {
    isHealthy = false;
    consecutiveFailures++;
    metadata.lastError = error.message;
  }

  const responseTime = Date.now() - startTime;

  return {
    isHealthy,
    responseTime,
    lastChecked: Date.now(),
    consecutiveFailures,
    metadata
  };
}

/**
 * Validates a specific connection
 * @param connection - Database connection to validate
 * @param sequelize - Sequelize instance
 * @returns True if valid, false otherwise
 */
export async function validateConnection(
  connection: any,
  sequelize: Sequelize
): Promise<boolean> {
  try {
    // Check if connection is still alive
    if (!connection || connection._closed || connection.destroyed) {
      return false;
    }

    // Perform a simple query
    const dialect = sequelize.getDialect();
    const query = dialect === 'postgres' ? 'SELECT 1' :
                  dialect === 'mysql' ? 'SELECT 1' :
                  'SELECT 1';

    await sequelize.query(query, { raw: true });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Monitors connection health continuously
 * @param sequelize - Sequelize instance
 * @param interval - Check interval in milliseconds
 * @param onHealthChange - Callback for health status changes
 * @returns Function to stop monitoring
 */
export function monitorConnectionHealth(
  sequelize: Sequelize,
  interval: number = 30000,
  onHealthChange?: (health: ConnectionHealth) => void
): () => void {
  let previousHealth: ConnectionHealth | null = null;
  const logger = new Logger('ConnectionHealthMonitor');

  const intervalId = setInterval(async () => {
    const health = await checkConnectionHealth(sequelize);

    // Detect health changes
    if (
      !previousHealth ||
      previousHealth.isHealthy !== health.isHealthy
    ) {
      logger.log(
        `Connection health changed: ${health.isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`
      );

      if (onHealthChange) {
        onHealthChange(health);
      }
    }

    previousHealth = health;
  }, interval);

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    logger.debug('Stopped connection health monitoring');
  };
}

/**
 * Performs deep health check including query execution
 * @param sequelize - Sequelize instance
 * @param testQueries - Optional test queries to execute
 * @returns Detailed health report
 */
export async function deepHealthCheck(
  sequelize: Sequelize,
  testQueries?: string[]
): Promise<{
  overall: boolean;
  authentication: boolean;
  queryExecution: boolean;
  poolStatus: boolean;
  details: Record<string, any>;
}> {
  const details: Record<string, any> = {};

  // Test authentication
  let authentication = false;
  try {
    await sequelize.authenticate();
    authentication = true;
    details.authentication = 'SUCCESS';
  } catch (error: any) {
    details.authentication = error.message;
  }

  // Test query execution
  let queryExecution = false;
  try {
    const queries = testQueries || ['SELECT 1 as health_check'];
    for (const query of queries) {
      await sequelize.query(query);
    }
    queryExecution = true;
    details.queryExecution = 'SUCCESS';
  } catch (error: any) {
    details.queryExecution = error.message;
  }

  // Check pool status
  let poolStatus = false;
  try {
    const pool = (sequelize.connectionManager as any).pool;
    const activeConnections = pool?.used?.length || 0;
    const idleConnections = pool?.free?.length || 0;
    const maxConnections = pool?.options?.max || 0;

    poolStatus = activeConnections + idleConnections > 0;
    details.poolStatus = {
      active: activeConnections,
      idle: idleConnections,
      max: maxConnections,
      utilization: (activeConnections + idleConnections) / maxConnections
    };
  } catch (error: any) {
    details.poolStatus = error.message;
  }

  const overall = authentication && queryExecution && poolStatus;

  return {
    overall,
    authentication,
    queryExecution,
    poolStatus,
    details
  };
}

/**
 * Creates a health check endpoint function
 * @param sequelize - Sequelize instance
 * @returns Health check function for use in health endpoints
 */
export function createHealthCheckEndpoint(
  sequelize: Sequelize
): () => Promise<{
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  responseTime: number;
  details: ConnectionHealth;
}> {
  return async () => {
    const health = await checkConnectionHealth(sequelize);

    let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';

    if (!health.isHealthy) {
      status = 'unhealthy';
    } else if (health.responseTime > 1000) {
      status = 'degraded';
    } else if (health.consecutiveFailures > 0) {
      status = 'degraded';
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      responseTime: health.responseTime,
      details: health
    };
  };
}

// ============================================================================
// POOL MONITORING AND METRICS (Functions 16-20)
// ============================================================================

/**
 * Advanced pool metrics collector
 */
@Injectable()
export class PoolMetricsCollector {
  private readonly logger = new Logger(PoolMetricsCollector.name);
  private metricsHistory: Map<string, PoolMetrics[]> = new Map();
  private readonly maxHistorySize = 1000;

  /**
   * Collects current metrics from a pool
   * @param sequelize - Sequelize instance
   * @param poolName - Pool identifier
   * @returns Current pool metrics
   */
  async collectMetrics(
    sequelize: Sequelize,
    poolName: string
  ): Promise<PoolMetrics> {
    const pool = (sequelize.connectionManager as any).pool;

    const metrics: PoolMetrics = {
      totalConnections: 0,
      activeConnections: pool?.used?.length || 0,
      idleConnections: pool?.free?.length || 0,
      waitingRequests: pool?.pending?.length || 0,
      totalCreated: 0,
      totalDestroyed: 0,
      totalAcquired: 0,
      totalReleased: 0,
      totalTimedOut: 0,
      averageWaitTime: 0,
      averageConnectionLife: 0,
      poolUtilization: 0,
      errorRate: 0
    };

    metrics.totalConnections =
      metrics.activeConnections + metrics.idleConnections;

    const maxConnections = pool?.options?.max || 1;
    metrics.poolUtilization = metrics.totalConnections / maxConnections;

    // Store in history
    this.addToHistory(poolName, metrics);

    return metrics;
  }

  /**
   * Adds metrics to history
   * @param poolName - Pool identifier
   * @param metrics - Metrics to store
   */
  private addToHistory(poolName: string, metrics: PoolMetrics): void {
    let history = this.metricsHistory.get(poolName);

    if (!history) {
      history = [];
      this.metricsHistory.set(poolName, history);
    }

    history.push({ ...metrics });

    // Limit history size
    if (history.length > this.maxHistorySize) {
      history.shift();
    }
  }

  /**
   * Gets aggregated metrics over a time period
   * @param poolName - Pool identifier
   * @param samples - Number of recent samples to aggregate
   * @returns Aggregated metrics
   */
  getAggregatedMetrics(poolName: string, samples: number = 100): {
    avgUtilization: number;
    maxUtilization: number;
    avgActiveConnections: number;
    maxActiveConnections: number;
    avgWaitingRequests: number;
    maxWaitingRequests: number;
  } {
    const history = this.metricsHistory.get(poolName) || [];
    const recentHistory = history.slice(-samples);

    if (recentHistory.length === 0) {
      return {
        avgUtilization: 0,
        maxUtilization: 0,
        avgActiveConnections: 0,
        maxActiveConnections: 0,
        avgWaitingRequests: 0,
        maxWaitingRequests: 0
      };
    }

    const sum = recentHistory.reduce(
      (acc, m) => ({
        utilization: acc.utilization + m.poolUtilization,
        active: acc.active + m.activeConnections,
        waiting: acc.waiting + m.waitingRequests
      }),
      { utilization: 0, active: 0, waiting: 0 }
    );

    return {
      avgUtilization: sum.utilization / recentHistory.length,
      maxUtilization: Math.max(...recentHistory.map(m => m.poolUtilization)),
      avgActiveConnections: sum.active / recentHistory.length,
      maxActiveConnections: Math.max(...recentHistory.map(m => m.activeConnections)),
      avgWaitingRequests: sum.waiting / recentHistory.length,
      maxWaitingRequests: Math.max(...recentHistory.map(m => m.waitingRequests))
    };
  }

  /**
   * Generates a metrics report
   * @param poolName - Pool identifier
   * @returns Formatted metrics report
   */
  generateReport(poolName: string): string {
    const current = this.metricsHistory.get(poolName)?.slice(-1)[0];
    const aggregated = this.getAggregatedMetrics(poolName);

    if (!current) {
      return `No metrics available for pool: ${poolName}`;
    }

    return `
Connection Pool Metrics Report: ${poolName}
===========================================

Current Status:
- Active Connections: ${current.activeConnections}
- Idle Connections: ${current.idleConnections}
- Waiting Requests: ${current.waitingRequests}
- Pool Utilization: ${(current.poolUtilization * 100).toFixed(2)}%

Aggregated (Last 100 samples):
- Avg Utilization: ${(aggregated.avgUtilization * 100).toFixed(2)}%
- Max Utilization: ${(aggregated.maxUtilization * 100).toFixed(2)}%
- Avg Active Connections: ${aggregated.avgActiveConnections.toFixed(2)}
- Max Active Connections: ${aggregated.maxActiveConnections}
- Avg Waiting Requests: ${aggregated.avgWaitingRequests.toFixed(2)}
- Max Waiting Requests: ${aggregated.maxWaitingRequests}
`;
  }

  /**
   * Detects anomalies in pool metrics
   * @param poolName - Pool identifier
   * @param thresholds - Anomaly detection thresholds
   * @returns Array of detected anomalies
   */
  detectAnomalies(
    poolName: string,
    thresholds: {
      utilizationThreshold?: number;
      waitingRequestsThreshold?: number;
      errorRateThreshold?: number;
    } = {}
  ): string[] {
    const {
      utilizationThreshold = 0.9,
      waitingRequestsThreshold = 10,
      errorRateThreshold = 0.05
    } = thresholds;

    const anomalies: string[] = [];
    const current = this.metricsHistory.get(poolName)?.slice(-1)[0];

    if (!current) {
      return anomalies;
    }

    if (current.poolUtilization > utilizationThreshold) {
      anomalies.push(
        `High pool utilization: ${(current.poolUtilization * 100).toFixed(2)}%`
      );
    }

    if (current.waitingRequests > waitingRequestsThreshold) {
      anomalies.push(
        `High number of waiting requests: ${current.waitingRequests}`
      );
    }

    if (current.errorRate > errorRateThreshold) {
      anomalies.push(
        `High error rate: ${(current.errorRate * 100).toFixed(2)}%`
      );
    }

    return anomalies;
  }
}

// ============================================================================
// CONNECTION LEAK DETECTION (Functions 21-24)
// ============================================================================

/**
 * Connection leak detector
 */
@Injectable()
export class ConnectionLeakDetector {
  private readonly logger = new Logger(ConnectionLeakDetector.name);
  private trackedConnections = new Map<string, {
    acquiredAt: number;
    stackTrace: string;
    metadata: any;
  }>();
  private readonly leakThreshold: number;

  constructor(leakThreshold: number = 30000) {
    this.leakThreshold = leakThreshold;
  }

  /**
   * Starts tracking a connection
   * @param connectionId - Connection identifier
   * @param metadata - Optional metadata
   */
  trackConnection(connectionId: string, metadata?: any): void {
    const stackTrace = new Error().stack || 'No stack trace available';

    this.trackedConnections.set(connectionId, {
      acquiredAt: Date.now(),
      stackTrace,
      metadata
    });
  }

  /**
   * Stops tracking a connection (connection released)
   * @param connectionId - Connection identifier
   */
  releaseConnection(connectionId: string): void {
    this.trackedConnections.delete(connectionId);
  }

  /**
   * Detects potential connection leaks
   * @returns Array of detected leaks
   */
  detectLeaks(): ConnectionLeak[] {
    const now = Date.now();
    const leaks: ConnectionLeak[] = [];

    for (const [connectionId, info] of this.trackedConnections) {
      const duration = now - info.acquiredAt;

      if (duration > this.leakThreshold) {
        leaks.push({
          connectionId,
          acquiredAt: info.acquiredAt,
          stackTrace: info.stackTrace,
          duration,
          query: info.metadata?.query
        });

        this.logger.warn(
          `Potential connection leak detected: ${connectionId} (held for ${duration}ms)`
        );
      }
    }

    return leaks;
  }

  /**
   * Gets leak detection report
   * @returns Formatted leak report
   */
  getLeakReport(): string {
    const leaks = this.detectLeaks();

    if (leaks.length === 0) {
      return 'No connection leaks detected';
    }

    let report = `Connection Leak Report\n${'='.repeat(50)}\n\n`;

    for (const leak of leaks) {
      report += `Connection ID: ${leak.connectionId}\n`;
      report += `Duration: ${leak.duration}ms\n`;
      report += `Acquired At: ${new Date(leak.acquiredAt).toISOString()}\n`;
      if (leak.query) {
        report += `Query: ${leak.query}\n`;
      }
      report += `Stack Trace:\n${leak.stackTrace}\n`;
      report += `${'-'.repeat(50)}\n`;
    }

    return report;
  }

  /**
   * Starts automatic leak detection
   * @param interval - Detection interval in milliseconds
   * @returns Function to stop detection
   */
  startAutoDetection(interval: number = 60000): () => void {
    const intervalId = setInterval(() => {
      const leaks = this.detectLeaks();

      if (leaks.length > 0) {
        this.logger.warn(`Detected ${leaks.length} potential connection leaks`);
      }
    }, interval);

    return () => {
      clearInterval(intervalId);
      this.logger.debug('Stopped automatic leak detection');
    };
  }
}

// ============================================================================
// CONNECTION RETRY LOGIC (Functions 25-28)
// ============================================================================

/**
 * Creates a Sequelize instance with connection retry logic
 * @param config - Sequelize configuration
 * @param retryConfig - Retry configuration
 * @returns Sequelize instance with retry logic
 */
export async function createSequelizeWithRetry(
  config: Options,
  retryConfig: ConnectionRetryConfig
): Promise<Sequelize> {
  const {
    maxRetries,
    initialDelay,
    maxDelay,
    backoffMultiplier,
    connectionTimeout
  } = retryConfig;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const sequelize = new Sequelize({
        ...config,
        pool: {
          ...config.pool,
          acquire: connectionTimeout
        }
      });

      // Test connection
      await Promise.race([
        sequelize.authenticate(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Connection timeout')),
            connectionTimeout
          )
        )
      ]);

      const logger = new Logger('SequelizeConnectionRetry');
      logger.log('Database connection established successfully');

      return sequelize;
    } catch (error: any) {
      lastError = error;

      if (attempt === maxRetries) {
        throw new Error(
          `Failed to connect after ${maxRetries} retries: ${error.message}`
        );
      }

      const delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      );

      const logger = new Logger('SequelizeConnectionRetry');
      logger.warn(
        `Connection attempt ${attempt + 1} failed, retrying in ${delay}ms...`
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Connection failed');
}

/**
 * Retries a database operation with exponential backoff
 * @param operation - Operation to retry
 * @param retryConfig - Retry configuration
 * @returns Result of operation
 */
export async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  retryConfig: Partial<ConnectionRetryConfig> = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2
  } = retryConfig;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Check if error is retryable
      const isRetryable = /ECONNREFUSED|ETIMEDOUT|ENOTFOUND|ECONNRESET/.test(
        error.message
      );

      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      const delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Operation failed');
}

/**
 * Implements circuit breaker for database connections
 * @param sequelize - Sequelize instance
 * @param failureThreshold - Number of failures before opening circuit
 * @param resetTimeout - Time before attempting to close circuit
 * @returns Wrapped Sequelize instance with circuit breaker
 */
export function withCircuitBreaker(
  sequelize: Sequelize,
  failureThreshold: number = 5,
  resetTimeout: number = 60000
): Sequelize {
  let failures = 0;
  let lastFailureTime = 0;
  let circuitOpen = false;

  const originalQuery = sequelize.query.bind(sequelize);

  (sequelize as any).query = async function(...args: any[]) {
    // Check if circuit should be closed
    if (circuitOpen && Date.now() - lastFailureTime > resetTimeout) {
      circuitOpen = false;
      failures = 0;
    }

    if (circuitOpen) {
      throw new Error('Circuit breaker is open');
    }

    try {
      const result = await originalQuery(...args);
      failures = 0; // Reset on success
      return result;
    } catch (error) {
      failures++;
      lastFailureTime = Date.now();

      if (failures >= failureThreshold) {
        circuitOpen = true;
      }

      throw error;
    }
  };

  return sequelize;
}

/**
 * Adds connection timeout protection
 * @param sequelize - Sequelize instance
 * @param timeout - Default query timeout
 * @returns Wrapped Sequelize instance with timeout protection
 */
export function withConnectionTimeout(
  sequelize: Sequelize,
  timeout: number = 30000
): Sequelize {
  const originalQuery = sequelize.query.bind(sequelize);

  (sequelize as any).query = async function(...args: any[]) {
    return Promise.race([
      originalQuery(...args),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Query timeout exceeded')),
          timeout
        )
      )
    ]);
  };

  return sequelize;
}

// ============================================================================
// READ REPLICA ROUTING (Functions 29-32)
// ============================================================================

/**
 * Read replica router for load balancing
 */
@Injectable()
export class ReadReplicaRouter {
  private readonly logger = new Logger(ReadReplicaRouter.name);
  private currentIndex = 0;
  private connectionCounts = new Map<Sequelize, number>();

  constructor(private readonly config: ReplicaConfig) {
    // Initialize connection counts
    for (const replica of config.read) {
      this.connectionCounts.set(replica, 0);
    }
  }

  /**
   * Gets a read replica based on load balancing strategy
   * @param preferredReplica - Optional preferred replica
   * @returns Selected read replica
   */
  getReadReplica(preferredReplica?: Sequelize): Sequelize {
    if (preferredReplica && this.config.read.includes(preferredReplica)) {
      return preferredReplica;
    }

    switch (this.config.loadBalancing) {
      case 'round-robin':
        return this.getRoundRobinReplica();
      case 'least-connections':
        return this.getLeastConnectionsReplica();
      case 'weighted':
        return this.getWeightedReplica();
      default:
        return this.getRoundRobinReplica();
    }
  }

  /**
   * Gets write instance (master)
   * @returns Write database instance
   */
  getWriteInstance(): Sequelize {
    return this.config.write;
  }

  /**
   * Round-robin selection
   */
  private getRoundRobinReplica(): Sequelize {
    const replica = this.config.read[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.config.read.length;
    return replica;
  }

  /**
   * Least connections selection
   */
  private getLeastConnectionsReplica(): Sequelize {
    let minConnections = Infinity;
    let selectedReplica = this.config.read[0];

    for (const replica of this.config.read) {
      const connections = this.connectionCounts.get(replica) || 0;
      if (connections < minConnections) {
        minConnections = connections;
        selectedReplica = replica;
      }
    }

    return selectedReplica;
  }

  /**
   * Weighted selection
   */
  private getWeightedReplica(): Sequelize {
    if (!this.config.weights || this.config.weights.size === 0) {
      return this.getRoundRobinReplica();
    }

    const totalWeight = Array.from(this.config.weights.values()).reduce(
      (sum, weight) => sum + weight,
      0
    );

    let random = Math.random() * totalWeight;

    for (const [replica, weight] of this.config.weights) {
      random -= weight;
      if (random <= 0) {
        return replica;
      }
    }

    return this.config.read[0];
  }

  /**
   * Tracks connection acquisition
   * @param replica - Replica instance
   */
  trackAcquisition(replica: Sequelize): void {
    const current = this.connectionCounts.get(replica) || 0;
    this.connectionCounts.set(replica, current + 1);
  }

  /**
   * Tracks connection release
   * @param replica - Replica instance
   */
  trackRelease(replica: Sequelize): void {
    const current = this.connectionCounts.get(replica) || 0;
    this.connectionCounts.set(replica, Math.max(0, current - 1));
  }
}

// ============================================================================
// POOL OPTIMIZATION (Functions 33-35)
// ============================================================================

/**
 * Analyzes pool performance and provides recommendations
 * @param sequelize - Sequelize instance
 * @param metrics - Current pool metrics
 * @returns Optimization recommendations
 */
export async function analyzePoolPerformance(
  sequelize: Sequelize,
  metrics: PoolMetrics
): Promise<PoolOptimizationRecommendation> {
  const pool = (sequelize.connectionManager as any).pool;
  const currentConfig: PoolConfig = {
    max: pool?.options?.max || 10,
    min: pool?.options?.min || 2,
    idle: pool?.options?.idle || 10000,
    acquire: pool?.options?.acquire || 30000,
    evict: pool?.options?.evict || 1000
  };

  const reasoning: string[] = [];
  const expectedImprovements: string[] = [];
  const risks: string[] = [];

  const recommendedConfig: PoolConfig = { ...currentConfig };

  // Analyze utilization
  if (metrics.poolUtilization > 0.9) {
    recommendedConfig.max = Math.min((currentConfig.max || 10) * 1.5, 100);
    reasoning.push('High pool utilization detected, increasing max connections');
    expectedImprovements.push('Reduced waiting time for connections');
    risks.push('Increased memory usage');
  } else if (metrics.poolUtilization < 0.3) {
    recommendedConfig.max = Math.max((currentConfig.max || 10) * 0.7, 5);
    reasoning.push('Low pool utilization, decreasing max connections');
    expectedImprovements.push('Reduced memory footprint');
    risks.push('Potential connection wait time increase under load');
  }

  // Analyze waiting requests
  if (metrics.waitingRequests > 10) {
    recommendedConfig.max = Math.min((currentConfig.max || 10) * 1.3, 100);
    recommendedConfig.acquire = Math.max((currentConfig.acquire || 30000) * 1.5, 45000);
    reasoning.push('High number of waiting requests, increasing pool size and timeout');
    expectedImprovements.push('Better handling of concurrent requests');
  }

  // Adjust min based on max
  if (recommendedConfig.max) {
    recommendedConfig.min = Math.max(
      Math.floor(recommendedConfig.max * 0.2),
      2
    );
  }

  return {
    currentConfig,
    recommendedConfig,
    reasoning,
    expectedImprovements,
    risks
  };
}

/**
 * Implements dynamic pool sizing
 * @param sequelize - Sequelize instance
 * @param config - Dynamic pool configuration
 * @returns Function to stop dynamic sizing
 */
export function enableDynamicPoolSizing(
  sequelize: Sequelize,
  config: DynamicPoolConfig
): () => void {
  const logger = new Logger('DynamicPoolSizing');
  let lastScaleTime = 0;
  const metricsCollector = new PoolMetricsCollector();

  const intervalId = setInterval(async () => {
    const metrics = await metricsCollector.collectMetrics(sequelize, 'main');
    const now = Date.now();

    // Check cooldown period
    if (now - lastScaleTime < config.cooldownPeriod) {
      return;
    }

    const pool = (sequelize.connectionManager as any).pool;
    const currentMax = pool?.options?.max || config.minSize;

    // Scale up
    if (metrics.poolUtilization > config.scaleUpThreshold) {
      const newMax = Math.min(
        Math.ceil(currentMax * 1.5),
        config.maxSize
      );

      if (newMax > currentMax) {
        pool.options.max = newMax;
        lastScaleTime = now;
        logger.log(`Scaled up pool: ${currentMax} -> ${newMax}`);
      }
    }

    // Scale down
    if (metrics.poolUtilization < config.scaleDownThreshold) {
      const newMax = Math.max(
        Math.floor(currentMax * 0.8),
        config.minSize
      );

      if (newMax < currentMax) {
        pool.options.max = newMax;
        lastScaleTime = now;
        logger.log(`Scaled down pool: ${currentMax} -> ${newMax}`);
      }
    }
  }, config.evaluationInterval);

  return () => {
    clearInterval(intervalId);
    logger.debug('Stopped dynamic pool sizing');
  };
}

/**
 * Optimizes pool configuration for specific workload
 * @param workloadType - Type of workload (read-heavy, write-heavy, mixed, batch)
 * @param baseConfig - Base configuration to optimize from
 * @returns Optimized pool configuration
 */
export function optimizeForWorkload(
  workloadType: 'read-heavy' | 'write-heavy' | 'mixed' | 'batch',
  baseConfig?: PoolConfig
): PoolConfig {
  const base: PoolConfig = baseConfig || {
    max: 10,
    min: 2,
    idle: 10000,
    acquire: 30000,
    evict: 1000
  };

  switch (workloadType) {
    case 'read-heavy':
      return {
        ...base,
        max: Math.max((base.max || 10) * 1.5, 15),
        min: Math.max((base.min || 2) * 1.5, 3),
        idle: 30000, // Keep connections longer
        evict: 5000
      };

    case 'write-heavy':
      return {
        ...base,
        max: Math.min((base.max || 10), 20),
        min: Math.max((base.min || 2), 5),
        idle: 5000, // Shorter idle time
        acquire: 45000, // Longer acquire timeout
        evict: 500
      };

    case 'mixed':
      return {
        ...base,
        max: (base.max || 10) * 1.2,
        min: (base.min || 2) * 1.2,
        idle: 15000,
        evict: 2000
      };

    case 'batch':
      return {
        ...base,
        max: Math.max((base.max || 10) * 2, 25),
        min: base.min || 2,
        idle: 60000, // Very long idle
        acquire: 60000, // Very long acquire
        evict: 10000
      };

    default:
      return base;
  }
}

// Export all classes
export {
  ConnectionPoolManager,
  PoolMetricsCollector,
  ConnectionLeakDetector,
  ReadReplicaRouter
};
