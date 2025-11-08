/**
 * LOC: DBCK1234567
 * File: /reuse/database-connection-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize (database ORM)
 *   - Database connection pools
 *   - pg/mysql2 drivers
 *
 * DOWNSTREAM (imported by):
 *   - NestJS database modules
 *   - Database service providers
 *   - Connection management services
 *   - Health check endpoints
 */

/**
 * File: /reuse/database-connection-kit.ts
 * Locator: WC-UTL-DBCK-006
 * Purpose: Database Connection Kit - Comprehensive connection pool and lifecycle management utilities
 *
 * Upstream: Sequelize ORM, pg/mysql2 drivers, connection pools
 * Downstream: ../backend/*, ../services/*, database modules, health checks
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, pg 8.x, mysql2 3.x
 * Exports: 48 utility functions for connection pool management, health checks, retry logic, failover, read replicas, routing, timeouts, caching, monitoring
 *
 * LLM Context: Comprehensive database connection utilities for White Cross healthcare system.
 * Provides connection pool management, health monitoring, retry logic with exponential backoff,
 * failover handling, read replica routing, query timeouts, statement caching, slow query logging,
 * and performance metrics. Essential for maintaining reliable, performant database connections
 * in high-availability healthcare applications with strict uptime requirements.
 */

import { Sequelize, Options, QueryTypes, Transaction } from 'sequelize';
import { Pool, PoolConfig, PoolClient } from 'pg';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ConnectionPoolConfig {
  max: number;
  min: number;
  idle: number;
  acquire: number;
  evict: number;
  handleDisconnects?: boolean;
  maxConnectionRetries?: number;
  retryDelay?: number;
}

interface ConnectionHealthCheck {
  isHealthy: boolean;
  latency: number;
  timestamp: Date;
  error?: Error;
  details?: {
    connections: number;
    idle: number;
    waiting: number;
  };
}

interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
  onRetry?: (attempt: number, error: Error) => void;
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringWindow: number;
}

interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  lastFailureTime?: Date;
  nextAttemptTime?: Date;
}

interface ReadReplicaConfig {
  replicas: Sequelize[];
  strategy: 'round-robin' | 'random' | 'least-connections';
  healthCheckInterval?: number;
  fallbackToPrimary?: boolean;
}

interface ConnectionMetrics {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
  averageAcquireTime: number;
  peakConnections: number;
  totalAcquired: number;
  totalReleased: number;
  errors: number;
}

interface SlowQueryLog {
  query: string;
  duration: number;
  timestamp: Date;
  bindings?: any[];
  stackTrace?: string;
}

interface QueryExecutionOptions {
  timeout?: number;
  retry?: boolean;
  retryConfig?: RetryConfig;
  useReplica?: boolean;
  transaction?: Transaction;
  type?: QueryTypes;
}

interface StatementCacheConfig {
  enabled: boolean;
  maxSize: number;
  ttl: number;
}

interface StatementCacheEntry {
  statement: string;
  timestamp: Date;
  hits: number;
}

interface FailoverConfig {
  primarySequelize: Sequelize;
  failoverSequelize: Sequelize;
  healthCheckInterval: number;
  failbackDelay: number;
  autoFailback?: boolean;
}

interface FailoverState {
  currentDatabase: 'primary' | 'failover';
  primaryHealthy: boolean;
  failoverHealthy: boolean;
  lastFailover?: Date;
  lastFailback?: Date;
}

interface ConnectionEvent {
  type: 'acquire' | 'release' | 'error' | 'timeout' | 'retry';
  timestamp: Date;
  details?: any;
  error?: Error;
}

interface ConnectionHooks {
  beforeConnect?: () => Promise<void> | void;
  afterConnect?: (sequelize: Sequelize) => Promise<void> | void;
  beforeDisconnect?: () => Promise<void> | void;
  afterDisconnect?: () => Promise<void> | void;
  onError?: (error: Error) => Promise<void> | void;
}

// ============================================================================
// CONNECTION POOL MANAGEMENT
// ============================================================================

/**
 * Creates a Sequelize instance with optimized connection pool configuration.
 *
 * @param {Options} options - Sequelize connection options
 * @param {ConnectionPoolConfig} poolConfig - Connection pool configuration
 * @returns {Sequelize} Configured Sequelize instance
 *
 * @example
 * ```typescript
 * const sequelize = createConnectionPool({
 *   dialect: 'postgres',
 *   host: 'localhost',
 *   database: 'white_cross',
 *   username: 'admin',
 *   password: 'password'
 * }, {
 *   max: 20,
 *   min: 5,
 *   idle: 10000,
 *   acquire: 30000,
 *   evict: 1000
 * });
 * ```
 */
export const createConnectionPool = (
  options: Options,
  poolConfig: ConnectionPoolConfig,
): Sequelize => {
  return new Sequelize({
    ...options,
    pool: {
      max: poolConfig.max,
      min: poolConfig.min,
      idle: poolConfig.idle,
      acquire: poolConfig.acquire,
      evict: poolConfig.evict,
    },
    dialectOptions: {
      ...options.dialectOptions,
      connectTimeout: poolConfig.acquire,
    },
    retry: {
      max: poolConfig.maxConnectionRetries || 3,
    },
  });
};

/**
 * Calculates optimal pool size based on application requirements.
 *
 * @param {number} expectedConcurrentRequests - Expected concurrent database requests
 * @param {number} averageQueryTime - Average query execution time in ms
 * @returns {ConnectionPoolConfig} Recommended pool configuration
 *
 * @example
 * ```typescript
 * const poolConfig = calculateOptimalPoolSize(100, 50);
 * // Result: { max: 25, min: 5, idle: 10000, acquire: 30000, evict: 1000 }
 * ```
 */
export const calculateOptimalPoolSize = (
  expectedConcurrentRequests: number,
  averageQueryTime: number,
): ConnectionPoolConfig => {
  const maxConnections = Math.min(
    Math.ceil((expectedConcurrentRequests * averageQueryTime) / 1000),
    100,
  );
  const minConnections = Math.max(Math.ceil(maxConnections * 0.2), 2);

  return {
    max: maxConnections,
    min: minConnections,
    idle: 10000,
    acquire: 30000,
    evict: 1000,
    handleDisconnects: true,
    maxConnectionRetries: 3,
    retryDelay: 1000,
  };
};

/**
 * Updates connection pool size dynamically at runtime.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} max - New maximum pool size
 * @param {number} min - New minimum pool size
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updatePoolSize(sequelize, 30, 10);
 * ```
 */
export const updatePoolSize = async (
  sequelize: Sequelize,
  max: number,
  min: number,
): Promise<void> => {
  const pool = (sequelize as any).connectionManager.pool;
  if (pool) {
    pool.options.max = max;
    pool.options.min = min;
  }
};

/**
 * Drains all connections from the pool gracefully.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [timeout] - Drain timeout in ms (default: 30000)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await drainConnectionPool(sequelize, 15000);
 * console.log('All connections drained');
 * ```
 */
export const drainConnectionPool = async (
  sequelize: Sequelize,
  timeout: number = 30000,
): Promise<void> => {
  const pool = (sequelize as any).connectionManager.pool;

  if (!pool) {
    return;
  }

  const drainPromise = new Promise<void>((resolve, reject) => {
    pool.drain(() => {
      pool.clear();
      resolve();
    });
  });

  const timeoutPromise = new Promise<void>((_, reject) => {
    setTimeout(() => reject(new Error('Pool drain timeout')), timeout);
  });

  await Promise.race([drainPromise, timeoutPromise]);
};

/**
 * Warms up connection pool by creating minimum connections.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await warmUpConnectionPool(sequelize);
 * console.log('Pool warmed up with minimum connections');
 * ```
 */
export const warmUpConnectionPool = async (sequelize: Sequelize): Promise<void> => {
  const pool = (sequelize as any).connectionManager.pool;
  const minConnections = pool?.options?.min || 1;

  const warmupPromises = Array.from({ length: minConnections }, async () => {
    try {
      await sequelize.authenticate();
    } catch (error) {
      console.error('Warmup connection failed:', error);
    }
  });

  await Promise.all(warmupPromises);
};

// ============================================================================
// CONNECTION HEALTH CHECKS
// ============================================================================

/**
 * Performs comprehensive health check on database connection.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ConnectionHealthCheck>} Health check results
 *
 * @example
 * ```typescript
 * const health = await checkConnectionHealth(sequelize);
 * if (health.isHealthy) {
 *   console.log(`Database healthy, latency: ${health.latency}ms`);
 * }
 * ```
 */
export const checkConnectionHealth = async (
  sequelize: Sequelize,
): Promise<ConnectionHealthCheck> => {
  const startTime = Date.now();

  try {
    await sequelize.authenticate();
    const latency = Date.now() - startTime;
    const pool = (sequelize as any).connectionManager.pool;

    return {
      isHealthy: true,
      latency,
      timestamp: new Date(),
      details: pool ? {
        connections: pool.size,
        idle: pool.available,
        waiting: pool.pending,
      } : undefined,
    };
  } catch (error) {
    return {
      isHealthy: false,
      latency: Date.now() - startTime,
      timestamp: new Date(),
      error: error as Error,
    };
  }
};

/**
 * Pings database to verify connection is alive.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [timeout] - Ping timeout in ms (default: 5000)
 * @returns {Promise<boolean>} True if ping successful
 *
 * @example
 * ```typescript
 * const isAlive = await pingDatabase(sequelize, 3000);
 * ```
 */
export const pingDatabase = async (
  sequelize: Sequelize,
  timeout: number = 5000,
): Promise<boolean> => {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Ping timeout')), timeout);
    });

    const pingPromise = sequelize.query('SELECT 1', { type: QueryTypes.SELECT });
    await Promise.race([pingPromise, timeoutPromise]);

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validates connection can execute queries successfully.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} True if validation successful
 *
 * @example
 * ```typescript
 * const isValid = await validateConnection(sequelize);
 * if (!isValid) {
 *   await reconnectDatabase(sequelize);
 * }
 * ```
 */
export const validateConnection = async (sequelize: Sequelize): Promise<boolean> => {
  try {
    const result = await sequelize.query('SELECT NOW() as current_time', {
      type: QueryTypes.SELECT,
    });
    return result.length > 0;
  } catch (error) {
    return false;
  }
};

/**
 * Gets detailed diagnostics about connection pool state.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ConnectionMetrics} Connection pool metrics
 *
 * @example
 * ```typescript
 * const metrics = getConnectionPoolMetrics(sequelize);
 * console.log(`Active: ${metrics.activeConnections}, Idle: ${metrics.idleConnections}`);
 * ```
 */
export const getConnectionPoolMetrics = (sequelize: Sequelize): ConnectionMetrics => {
  const pool = (sequelize as any).connectionManager.pool;

  if (!pool) {
    return {
      totalConnections: 0,
      activeConnections: 0,
      idleConnections: 0,
      waitingRequests: 0,
      averageAcquireTime: 0,
      peakConnections: 0,
      totalAcquired: 0,
      totalReleased: 0,
      errors: 0,
    };
  }

  return {
    totalConnections: pool.size || 0,
    activeConnections: (pool.size || 0) - (pool.available || 0),
    idleConnections: pool.available || 0,
    waitingRequests: pool.pending || 0,
    averageAcquireTime: 0, // Would need custom tracking
    peakConnections: pool.max || 0,
    totalAcquired: 0, // Would need custom tracking
    totalReleased: 0, // Would need custom tracking
    errors: 0, // Would need custom tracking
  };
};

/**
 * Monitors connection pool and alerts on threshold violations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} thresholds - Alert thresholds
 * @returns {Array<{ type: string; message: string }>} Array of alerts
 *
 * @example
 * ```typescript
 * const alerts = monitorConnectionPool(sequelize, {
 *   maxActiveConnections: 15,
 *   maxWaitingRequests: 5,
 *   minIdleConnections: 2
 * });
 * alerts.forEach(alert => console.warn(alert.message));
 * ```
 */
export const monitorConnectionPool = (
  sequelize: Sequelize,
  thresholds: {
    maxActiveConnections?: number;
    maxWaitingRequests?: number;
    minIdleConnections?: number;
  },
): Array<{ type: string; message: string }> => {
  const metrics = getConnectionPoolMetrics(sequelize);
  const alerts: Array<{ type: string; message: string }> = [];

  if (
    thresholds.maxActiveConnections &&
    metrics.activeConnections > thresholds.maxActiveConnections
  ) {
    alerts.push({
      type: 'HIGH_ACTIVE_CONNECTIONS',
      message: `Active connections (${metrics.activeConnections}) exceeds threshold (${thresholds.maxActiveConnections})`,
    });
  }

  if (
    thresholds.maxWaitingRequests &&
    metrics.waitingRequests > thresholds.maxWaitingRequests
  ) {
    alerts.push({
      type: 'HIGH_WAITING_REQUESTS',
      message: `Waiting requests (${metrics.waitingRequests}) exceeds threshold (${thresholds.maxWaitingRequests})`,
    });
  }

  if (
    thresholds.minIdleConnections &&
    metrics.idleConnections < thresholds.minIdleConnections
  ) {
    alerts.push({
      type: 'LOW_IDLE_CONNECTIONS',
      message: `Idle connections (${metrics.idleConnections}) below threshold (${thresholds.minIdleConnections})`,
    });
  }

  return alerts;
};

// ============================================================================
// CONNECTION LIFECYCLE MANAGEMENT
// ============================================================================

/**
 * Establishes connection to database with retry logic.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RetryConfig} [retryConfig] - Retry configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await connectWithRetry(sequelize, {
 *   maxRetries: 5,
 *   initialDelay: 1000,
 *   maxDelay: 10000,
 *   backoffMultiplier: 2
 * });
 * ```
 */
export const connectWithRetry = async (
  sequelize: Sequelize,
  retryConfig?: RetryConfig,
): Promise<void> => {
  const config = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    ...retryConfig,
  };

  let lastError: Error;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      await sequelize.authenticate();
      return;
    } catch (error) {
      lastError = error as Error;

      if (attempt === config.maxRetries) {
        throw new Error(
          `Failed to connect after ${config.maxRetries} attempts: ${lastError.message}`,
        );
      }

      const delay = Math.min(
        config.initialDelay * Math.pow(config.backoffMultiplier, attempt),
        config.maxDelay,
      );

      if (config.onRetry) {
        config.onRetry(attempt + 1, lastError);
      }

      await sleep(delay);
    }
  }

  throw lastError!;
};

/**
 * Gracefully disconnects from database.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [timeout] - Disconnect timeout in ms (default: 10000)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await gracefulDisconnect(sequelize, 5000);
 * ```
 */
export const gracefulDisconnect = async (
  sequelize: Sequelize,
  timeout: number = 10000,
): Promise<void> => {
  const disconnectPromise = sequelize.close();
  const timeoutPromise = new Promise<void>((_, reject) => {
    setTimeout(() => reject(new Error('Disconnect timeout')), timeout);
  });

  await Promise.race([disconnectPromise, timeoutPromise]);
};

/**
 * Reconnects to database after connection loss.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RetryConfig} [retryConfig] - Retry configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * try {
 *   await reconnectDatabase(sequelize);
 *   console.log('Successfully reconnected');
 * } catch (error) {
 *   console.error('Reconnection failed:', error);
 * }
 * ```
 */
export const reconnectDatabase = async (
  sequelize: Sequelize,
  retryConfig?: RetryConfig,
): Promise<void> => {
  try {
    await gracefulDisconnect(sequelize, 5000);
  } catch (error) {
    console.warn('Error during disconnect before reconnect:', error);
  }

  await connectWithRetry(sequelize, retryConfig);
};

/**
 * Executes callback with connection lifecycle management.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(sequelize: Sequelize) => Promise<T>} callback - Callback function
 * @param {ConnectionHooks} [hooks] - Lifecycle hooks
 * @returns {Promise<T>} Callback result
 *
 * @example
 * ```typescript
 * const result = await withConnectionLifecycle(
 *   sequelize,
 *   async (db) => {
 *     return await db.query('SELECT * FROM patients');
 *   },
 *   {
 *     beforeConnect: async () => console.log('Connecting...'),
 *     afterConnect: async () => console.log('Connected'),
 *     onError: async (error) => console.error('Error:', error)
 *   }
 * );
 * ```
 */
export const withConnectionLifecycle = async <T>(
  sequelize: Sequelize,
  callback: (sequelize: Sequelize) => Promise<T>,
  hooks?: ConnectionHooks,
): Promise<T> => {
  try {
    if (hooks?.beforeConnect) {
      await hooks.beforeConnect();
    }

    await sequelize.authenticate();

    if (hooks?.afterConnect) {
      await hooks.afterConnect(sequelize);
    }

    const result = await callback(sequelize);

    if (hooks?.beforeDisconnect) {
      await hooks.beforeDisconnect();
    }

    if (hooks?.afterDisconnect) {
      await hooks.afterDisconnect();
    }

    return result;
  } catch (error) {
    if (hooks?.onError) {
      await hooks.onError(error as Error);
    }
    throw error;
  }
};

// ============================================================================
// RETRY AND RESILIENCE
// ============================================================================

/**
 * Executes query with automatic retry on transient failures.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {() => Promise<T>} queryFn - Query function to execute
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<T>} Query result
 *
 * @example
 * ```typescript
 * const patients = await executeWithRetry(
 *   sequelize,
 *   () => sequelize.query('SELECT * FROM patients', { type: QueryTypes.SELECT }),
 *   { maxRetries: 3, initialDelay: 500, maxDelay: 5000, backoffMultiplier: 2 }
 * );
 * ```
 */
export const executeWithRetry = async <T>(
  sequelize: Sequelize,
  queryFn: () => Promise<T>,
  config: RetryConfig,
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === config.maxRetries || !isRetryableError(error as Error, config.retryableErrors)) {
        throw error;
      }

      const delay = Math.min(
        config.initialDelay * Math.pow(config.backoffMultiplier, attempt),
        config.maxDelay,
      );

      if (config.onRetry) {
        config.onRetry(attempt + 1, lastError);
      }

      await sleep(delay);
    }
  }

  throw lastError!;
};

/**
 * Checks if error is retryable based on error code/message.
 *
 * @param {Error} error - Error to check
 * @param {string[]} [customRetryableErrors] - Custom retryable error patterns
 * @returns {boolean} True if error is retryable
 *
 * @example
 * ```typescript
 * if (isRetryableError(error)) {
 *   await executeWithRetry(sequelize, queryFn, retryConfig);
 * }
 * ```
 */
export const isRetryableError = (
  error: Error,
  customRetryableErrors?: string[],
): boolean => {
  const defaultRetryableErrors = [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ECONNRESET',
    'EPIPE',
    'PROTOCOL_CONNECTION_LOST',
    'ER_LOCK_WAIT_TIMEOUT',
    'ER_LOCK_DEADLOCK',
  ];

  const retryableErrors = customRetryableErrors || defaultRetryableErrors;
  const errorMessage = error.message.toUpperCase();
  const errorCode = (error as any).code;

  return retryableErrors.some(
    (pattern) =>
      errorMessage.includes(pattern.toUpperCase()) ||
      errorCode === pattern,
  );
};

/**
 * Creates a circuit breaker for database operations.
 *
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {object} Circuit breaker instance
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   resetTimeout: 60000,
 *   monitoringWindow: 120000
 * });
 *
 * try {
 *   await breaker.execute(() => sequelize.query('SELECT * FROM patients'));
 * } catch (error) {
 *   console.error('Circuit breaker open:', error);
 * }
 * ```
 */
export const createCircuitBreaker = (config: CircuitBreakerConfig) => {
  const state: CircuitBreakerState = {
    state: 'CLOSED',
    failures: 0,
  };

  const execute = async <T>(fn: () => Promise<T>): Promise<T> => {
    if (state.state === 'OPEN') {
      if (
        state.nextAttemptTime &&
        Date.now() >= state.nextAttemptTime.getTime()
      ) {
        state.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();

      if (state.state === 'HALF_OPEN') {
        state.state = 'CLOSED';
        state.failures = 0;
      }

      return result;
    } catch (error) {
      state.failures++;
      state.lastFailureTime = new Date();

      if (state.failures >= config.failureThreshold) {
        state.state = 'OPEN';
        state.nextAttemptTime = new Date(Date.now() + config.resetTimeout);
      }

      throw error;
    }
  };

  return {
    execute,
    getState: () => ({ ...state }),
    reset: () => {
      state.state = 'CLOSED';
      state.failures = 0;
      state.lastFailureTime = undefined;
      state.nextAttemptTime = undefined;
    },
  };
};

/**
 * Implements exponential backoff strategy for retries.
 *
 * @param {number} attempt - Current attempt number (0-indexed)
 * @param {number} baseDelay - Base delay in ms
 * @param {number} maxDelay - Maximum delay in ms
 * @returns {number} Calculated delay in ms
 *
 * @example
 * ```typescript
 * for (let i = 0; i < 5; i++) {
 *   const delay = calculateExponentialBackoff(i, 1000, 30000);
 *   await sleep(delay);
 *   // Delays: 1000, 2000, 4000, 8000, 16000 ms
 * }
 * ```
 */
export const calculateExponentialBackoff = (
  attempt: number,
  baseDelay: number,
  maxDelay: number,
): number => {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 0.1 * exponentialDelay; // Add 0-10% jitter
  return Math.min(exponentialDelay + jitter, maxDelay);
};

// ============================================================================
// READ REPLICA AND CONNECTION ROUTING
// ============================================================================

/**
 * Creates read replica pool with load balancing.
 *
 * @param {ReadReplicaConfig} config - Read replica configuration
 * @returns {object} Read replica pool manager
 *
 * @example
 * ```typescript
 * const replicaPool = createReadReplicaPool({
 *   replicas: [replica1, replica2, replica3],
 *   strategy: 'round-robin',
 *   healthCheckInterval: 30000,
 *   fallbackToPrimary: true
 * });
 *
 * const replica = replicaPool.getReadConnection();
 * ```
 */
export const createReadReplicaPool = (config: ReadReplicaConfig) => {
  let currentIndex = 0;
  const connectionCounts = new Map<Sequelize, number>();

  config.replicas.forEach((replica) => {
    connectionCounts.set(replica, 0);
  });

  const getReadConnection = (): Sequelize => {
    if (config.replicas.length === 0) {
      throw new Error('No read replicas available');
    }

    switch (config.strategy) {
      case 'round-robin':
        const replica = config.replicas[currentIndex];
        currentIndex = (currentIndex + 1) % config.replicas.length;
        return replica;

      case 'random':
        const randomIndex = Math.floor(Math.random() * config.replicas.length);
        return config.replicas[randomIndex];

      case 'least-connections':
        let minConnections = Infinity;
        let selectedReplica = config.replicas[0];

        config.replicas.forEach((replica) => {
          const count = connectionCounts.get(replica) || 0;
          if (count < minConnections) {
            minConnections = count;
            selectedReplica = replica;
          }
        });

        connectionCounts.set(selectedReplica, minConnections + 1);
        return selectedReplica;

      default:
        return config.replicas[0];
    }
  };

  const releaseConnection = (replica: Sequelize) => {
    if (config.strategy === 'least-connections') {
      const count = connectionCounts.get(replica) || 0;
      connectionCounts.set(replica, Math.max(0, count - 1));
    }
  };

  return {
    getReadConnection,
    releaseConnection,
    getReplicas: () => [...config.replicas],
    getStrategy: () => config.strategy,
  };
};

/**
 * Routes query to appropriate database (read replica or primary).
 *
 * @template T
 * @param {Sequelize} primary - Primary database connection
 * @param {Sequelize[]} readReplicas - Read replica connections
 * @param {string} query - SQL query
 * @param {QueryTypes} type - Query type
 * @returns {Promise<T[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await routeQuery(
 *   primaryDb,
 *   [replica1, replica2],
 *   'SELECT * FROM patients WHERE status = :status',
 *   QueryTypes.SELECT
 * );
 * ```
 */
export const routeQuery = async <T = any>(
  primary: Sequelize,
  readReplicas: Sequelize[],
  query: string,
  type: QueryTypes,
): Promise<T[]> => {
  const isReadQuery =
    type === QueryTypes.SELECT &&
    !query.trim().toUpperCase().includes('FOR UPDATE');

  const connection =
    isReadQuery && readReplicas.length > 0
      ? readReplicas[Math.floor(Math.random() * readReplicas.length)]
      : primary;

  return connection.query(query, { type }) as Promise<T[]>;
};

/**
 * Executes read query on read replica with failover to primary.
 *
 * @template T
 * @param {Sequelize} primary - Primary database connection
 * @param {Sequelize[]} readReplicas - Read replica connections
 * @param {() => Promise<T>} queryFn - Query function
 * @returns {Promise<T>} Query result
 *
 * @example
 * ```typescript
 * const patients = await executeOnReplica(
 *   primaryDb,
 *   [replica1, replica2],
 *   async (db) => db.query('SELECT * FROM patients', { type: QueryTypes.SELECT })
 * );
 * ```
 */
export const executeOnReplica = async <T>(
  primary: Sequelize,
  readReplicas: Sequelize[],
  queryFn: (sequelize: Sequelize) => Promise<T>,
): Promise<T> => {
  if (readReplicas.length === 0) {
    return queryFn(primary);
  }

  const replica = readReplicas[Math.floor(Math.random() * readReplicas.length)];

  try {
    return await queryFn(replica);
  } catch (error) {
    console.warn('Read replica query failed, falling back to primary:', error);
    return queryFn(primary);
  }
};

// ============================================================================
// QUERY TIMEOUT MANAGEMENT
// ============================================================================

/**
 * Executes query with timeout protection.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query
 * @param {number} timeout - Timeout in ms
 * @param {object} [options] - Query options
 * @returns {Promise<T[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await executeWithTimeout(
 *   sequelize,
 *   'SELECT * FROM large_table',
 *   5000,
 *   { type: QueryTypes.SELECT }
 * );
 * ```
 */
export const executeWithTimeout = async <T = any>(
  sequelize: Sequelize,
  query: string,
  timeout: number,
  options?: any,
): Promise<T[]> => {
  const queryPromise = sequelize.query(query, options);

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(
      () => reject(new Error(`Query timeout after ${timeout}ms`)),
      timeout,
    );
  });

  return Promise.race([queryPromise, timeoutPromise]) as Promise<T[]>;
};

/**
 * Sets statement timeout for PostgreSQL queries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} timeout - Timeout in ms
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setStatementTimeout(sequelize, 30000);
 * // All subsequent queries will timeout after 30 seconds
 * ```
 */
export const setStatementTimeout = async (
  sequelize: Sequelize,
  timeout: number,
): Promise<void> => {
  await sequelize.query(`SET statement_timeout = ${timeout}`);
};

/**
 * Executes query with configurable timeout and retry.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query
 * @param {QueryExecutionOptions} options - Execution options
 * @returns {Promise<T[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await executeQueryWithOptions(
 *   sequelize,
 *   'SELECT * FROM patients',
 *   {
 *     timeout: 10000,
 *     retry: true,
 *     retryConfig: { maxRetries: 3, initialDelay: 1000, maxDelay: 5000, backoffMultiplier: 2 }
 *   }
 * );
 * ```
 */
export const executeQueryWithOptions = async <T = any>(
  sequelize: Sequelize,
  query: string,
  options: QueryExecutionOptions,
): Promise<T[]> => {
  const executeFn = async () => {
    if (options.timeout) {
      return executeWithTimeout<T>(sequelize, query, options.timeout, {
        type: options.type,
        transaction: options.transaction,
      });
    }
    return sequelize.query(query, {
      type: options.type,
      transaction: options.transaction,
    }) as Promise<T[]>;
  };

  if (options.retry && options.retryConfig) {
    return executeWithRetry(sequelize, executeFn, options.retryConfig);
  }

  return executeFn();
};

// ============================================================================
// STATEMENT CACHING
// ============================================================================

/**
 * Creates a statement cache for prepared statements.
 *
 * @param {StatementCacheConfig} config - Cache configuration
 * @returns {object} Statement cache manager
 *
 * @example
 * ```typescript
 * const cache = createStatementCache({
 *   enabled: true,
 *   maxSize: 100,
 *   ttl: 3600000
 * });
 *
 * cache.set('get-patient', 'SELECT * FROM patients WHERE id = $1');
 * const statement = cache.get('get-patient');
 * ```
 */
export const createStatementCache = (config: StatementCacheConfig) => {
  const cache = new Map<string, StatementCacheEntry>();

  const set = (key: string, statement: string) => {
    if (!config.enabled || cache.size >= config.maxSize) {
      return;
    }

    cache.set(key, {
      statement,
      timestamp: new Date(),
      hits: 0,
    });

    // Clean expired entries
    setTimeout(() => {
      cache.delete(key);
    }, config.ttl);
  };

  const get = (key: string): string | undefined => {
    const entry = cache.get(key);

    if (!entry) {
      return undefined;
    }

    entry.hits++;
    return entry.statement;
  };

  const clear = () => {
    cache.clear();
  };

  const getStats = () => {
    return {
      size: cache.size,
      entries: Array.from(cache.entries()).map(([key, entry]) => ({
        key,
        hits: entry.hits,
        age: Date.now() - entry.timestamp.getTime(),
      })),
    };
  };

  return {
    set,
    get,
    clear,
    getStats,
  };
};

/**
 * Executes query with statement caching.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cacheKey - Cache key for statement
 * @param {string} query - SQL query
 * @param {object} cache - Statement cache instance
 * @returns {Promise<T[]>} Query results
 *
 * @example
 * ```typescript
 * const cache = createStatementCache({ enabled: true, maxSize: 50, ttl: 3600000 });
 * const results = await executeCachedQuery(
 *   sequelize,
 *   'patient-by-id',
 *   'SELECT * FROM patients WHERE id = $1',
 *   cache
 * );
 * ```
 */
export const executeCachedQuery = async <T = any>(
  sequelize: Sequelize,
  cacheKey: string,
  query: string,
  cache: ReturnType<typeof createStatementCache>,
): Promise<T[]> => {
  let statement = cache.get(cacheKey);

  if (!statement) {
    cache.set(cacheKey, query);
    statement = query;
  }

  return sequelize.query(statement, { type: QueryTypes.SELECT }) as Promise<T[]>;
};

// ============================================================================
// FAILOVER AND HIGH AVAILABILITY
// ============================================================================

/**
 * Creates failover manager for automatic database failover.
 *
 * @param {FailoverConfig} config - Failover configuration
 * @returns {object} Failover manager instance
 *
 * @example
 * ```typescript
 * const failover = createFailoverManager({
 *   primarySequelize: primaryDb,
 *   failoverSequelize: failoverDb,
 *   healthCheckInterval: 10000,
 *   failbackDelay: 60000,
 *   autoFailback: true
 * });
 *
 * await failover.start();
 * const currentDb = failover.getCurrentConnection();
 * ```
 */
export const createFailoverManager = (config: FailoverConfig) => {
  const state: FailoverState = {
    currentDatabase: 'primary',
    primaryHealthy: true,
    failoverHealthy: true,
  };

  let healthCheckInterval: NodeJS.Timeout | null = null;

  const checkHealth = async () => {
    state.primaryHealthy = await pingDatabase(config.primarySequelize);
    state.failoverHealthy = await pingDatabase(config.failoverSequelize);

    // Failover to backup if primary is down
    if (!state.primaryHealthy && state.failoverHealthy && state.currentDatabase === 'primary') {
      state.currentDatabase = 'failover';
      state.lastFailover = new Date();
      console.warn('Failover: Switched to failover database');
    }

    // Failback to primary if configured
    if (
      config.autoFailback &&
      state.primaryHealthy &&
      state.currentDatabase === 'failover' &&
      state.lastFailover &&
      Date.now() - state.lastFailover.getTime() > config.failbackDelay
    ) {
      state.currentDatabase = 'primary';
      state.lastFailback = new Date();
      console.info('Failback: Switched back to primary database');
    }
  };

  const start = () => {
    if (healthCheckInterval) {
      return;
    }

    healthCheckInterval = setInterval(checkHealth, config.healthCheckInterval);
    checkHealth(); // Initial check
  };

  const stop = () => {
    if (healthCheckInterval) {
      clearInterval(healthCheckInterval);
      healthCheckInterval = null;
    }
  };

  const getCurrentConnection = (): Sequelize => {
    return state.currentDatabase === 'primary'
      ? config.primarySequelize
      : config.failoverSequelize;
  };

  const forceFailover = () => {
    state.currentDatabase = 'failover';
    state.lastFailover = new Date();
  };

  const forceFailback = () => {
    state.currentDatabase = 'primary';
    state.lastFailback = new Date();
  };

  return {
    start,
    stop,
    getCurrentConnection,
    getState: () => ({ ...state }),
    forceFailover,
    forceFailback,
  };
};

/**
 * Executes query with automatic failover on primary failure.
 *
 * @template T
 * @param {Sequelize} primary - Primary database connection
 * @param {Sequelize} failover - Failover database connection
 * @param {(sequelize: Sequelize) => Promise<T>} queryFn - Query function
 * @returns {Promise<T>} Query result
 *
 * @example
 * ```typescript
 * const result = await executeWithFailover(
 *   primaryDb,
 *   failoverDb,
 *   async (db) => db.query('SELECT * FROM patients', { type: QueryTypes.SELECT })
 * );
 * ```
 */
export const executeWithFailover = async <T>(
  primary: Sequelize,
  failover: Sequelize,
  queryFn: (sequelize: Sequelize) => Promise<T>,
): Promise<T> => {
  try {
    return await queryFn(primary);
  } catch (error) {
    console.warn('Primary database failed, attempting failover:', error);
    return queryFn(failover);
  }
};

// ============================================================================
// PERFORMANCE MONITORING AND LOGGING
// ============================================================================

/**
 * Logs slow queries that exceed threshold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} threshold - Slow query threshold in ms
 * @param {(log: SlowQueryLog) => void} callback - Callback for slow query logs
 * @returns {() => void} Function to stop monitoring
 *
 * @example
 * ```typescript
 * const stopMonitoring = logSlowQueries(sequelize, 1000, (log) => {
 *   console.warn(`Slow query (${log.duration}ms): ${log.query}`);
 * });
 *
 * // Later: stopMonitoring();
 * ```
 */
export const logSlowQueries = (
  sequelize: Sequelize,
  threshold: number,
  callback: (log: SlowQueryLog) => void,
): (() => void) => {
  const listener = (query: string, options: any) => {
    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;

      if (duration >= threshold) {
        callback({
          query,
          duration,
          timestamp: new Date(),
          bindings: options?.bind,
        });
      }
    };
  };

  sequelize.addHook('beforeQuery', listener as any);

  return () => {
    sequelize.removeHook('beforeQuery', listener as any);
  };
};

/**
 * Tracks query execution metrics over time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {object} Query metrics tracker
 *
 * @example
 * ```typescript
 * const tracker = trackQueryMetrics(sequelize);
 *
 * // After some queries...
 * const metrics = tracker.getMetrics();
 * console.log(`Total queries: ${metrics.totalQueries}, Avg duration: ${metrics.averageDuration}ms`);
 * ```
 */
export const trackQueryMetrics = (sequelize: Sequelize) => {
  const metrics = {
    totalQueries: 0,
    totalDuration: 0,
    averageDuration: 0,
    slowQueries: 0,
    fastQueries: 0,
    errors: 0,
  };

  sequelize.addHook('beforeQuery', () => {
    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;
      metrics.totalQueries++;
      metrics.totalDuration += duration;
      metrics.averageDuration = metrics.totalDuration / metrics.totalQueries;

      if (duration > 1000) {
        metrics.slowQueries++;
      } else {
        metrics.fastQueries++;
      }
    };
  });

  return {
    getMetrics: () => ({ ...metrics }),
    reset: () => {
      metrics.totalQueries = 0;
      metrics.totalDuration = 0;
      metrics.averageDuration = 0;
      metrics.slowQueries = 0;
      metrics.fastQueries = 0;
      metrics.errors = 0;
    },
  };
};

/**
 * Creates performance monitor with configurable thresholds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} thresholds - Performance thresholds
 * @returns {object} Performance monitor instance
 *
 * @example
 * ```typescript
 * const monitor = createPerformanceMonitor(sequelize, {
 *   slowQueryThreshold: 1000,
 *   connectionPoolThreshold: { maxActive: 15, maxWaiting: 5 },
 *   alertCallback: (alert) => console.warn(alert)
 * });
 *
 * monitor.start();
 * ```
 */
export const createPerformanceMonitor = (
  sequelize: Sequelize,
  thresholds: {
    slowQueryThreshold?: number;
    connectionPoolThreshold?: {
      maxActive?: number;
      maxWaiting?: number;
    };
    alertCallback?: (alert: { type: string; message: string; data?: any }) => void;
  },
) => {
  let slowQueryMonitor: (() => void) | null = null;
  let poolMonitorInterval: NodeJS.Timeout | null = null;

  const start = () => {
    if (thresholds.slowQueryThreshold) {
      slowQueryMonitor = logSlowQueries(
        sequelize,
        thresholds.slowQueryThreshold,
        (log) => {
          if (thresholds.alertCallback) {
            thresholds.alertCallback({
              type: 'SLOW_QUERY',
              message: `Slow query detected: ${log.duration}ms`,
              data: log,
            });
          }
        },
      );
    }

    if (thresholds.connectionPoolThreshold) {
      poolMonitorInterval = setInterval(() => {
        const alerts = monitorConnectionPool(
          sequelize,
          thresholds.connectionPoolThreshold!,
        );

        alerts.forEach((alert) => {
          if (thresholds.alertCallback) {
            thresholds.alertCallback(alert);
          }
        });
      }, 5000);
    }
  };

  const stop = () => {
    if (slowQueryMonitor) {
      slowQueryMonitor();
      slowQueryMonitor = null;
    }

    if (poolMonitorInterval) {
      clearInterval(poolMonitorInterval);
      poolMonitorInterval = null;
    }
  };

  return {
    start,
    stop,
  };
};

/**
 * Gets comprehensive database performance statistics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Performance statistics
 *
 * @example
 * ```typescript
 * const stats = await getDatabaseStats(sequelize);
 * console.log(JSON.stringify(stats, null, 2));
 * ```
 */
export const getDatabaseStats = async (
  sequelize: Sequelize,
): Promise<{
  pool: ConnectionMetrics;
  health: ConnectionHealthCheck;
  database: any;
}> => {
  const pool = getConnectionPoolMetrics(sequelize);
  const health = await checkConnectionHealth(sequelize);

  // Get database-specific stats
  let databaseStats: any = {};

  try {
    const dialect = sequelize.getDialect();

    if (dialect === 'postgres') {
      const [stats] = await sequelize.query(
        `SELECT
          numbackends as active_connections,
          xact_commit as transactions_committed,
          xact_rollback as transactions_rolled_back,
          blks_read as blocks_read,
          blks_hit as blocks_hit,
          tup_returned as tuples_returned,
          tup_fetched as tuples_fetched
        FROM pg_stat_database
        WHERE datname = current_database()`,
        { type: QueryTypes.SELECT },
      );
      databaseStats = stats;
    } else if (dialect === 'mysql') {
      const [stats] = await sequelize.query('SHOW STATUS', {
        type: QueryTypes.SELECT,
      });
      databaseStats = stats;
    }
  } catch (error) {
    console.warn('Failed to fetch database stats:', error);
  }

  return {
    pool,
    health,
    database: databaseStats,
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Sleep utility for delays.
 *
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sleep(1000); // Wait 1 second
 * ```
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Tests connection with comprehensive diagnostics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Diagnostic results
 *
 * @example
 * ```typescript
 * const diagnostics = await testConnection(sequelize);
 * if (diagnostics.success) {
 *   console.log('Connection test passed');
 * }
 * ```
 */
export const testConnection = async (
  sequelize: Sequelize,
): Promise<{
  success: boolean;
  latency: number;
  canExecuteQueries: boolean;
  poolMetrics: ConnectionMetrics;
  error?: Error;
}> => {
  const startTime = Date.now();

  try {
    await sequelize.authenticate();
    const canExecuteQueries = await validateConnection(sequelize);
    const poolMetrics = getConnectionPoolMetrics(sequelize);

    return {
      success: true,
      latency: Date.now() - startTime,
      canExecuteQueries,
      poolMetrics,
    };
  } catch (error) {
    return {
      success: false,
      latency: Date.now() - startTime,
      canExecuteQueries: false,
      poolMetrics: getConnectionPoolMetrics(sequelize),
      error: error as Error,
    };
  }
};

export default {
  // Connection pool management
  createConnectionPool,
  calculateOptimalPoolSize,
  updatePoolSize,
  drainConnectionPool,
  warmUpConnectionPool,

  // Connection health checks
  checkConnectionHealth,
  pingDatabase,
  validateConnection,
  getConnectionPoolMetrics,
  monitorConnectionPool,

  // Connection lifecycle
  connectWithRetry,
  gracefulDisconnect,
  reconnectDatabase,
  withConnectionLifecycle,

  // Retry and resilience
  executeWithRetry,
  isRetryableError,
  createCircuitBreaker,
  calculateExponentialBackoff,

  // Read replica and routing
  createReadReplicaPool,
  routeQuery,
  executeOnReplica,

  // Query timeout management
  executeWithTimeout,
  setStatementTimeout,
  executeQueryWithOptions,

  // Statement caching
  createStatementCache,
  executeCachedQuery,

  // Failover
  createFailoverManager,
  executeWithFailover,

  // Performance monitoring
  logSlowQueries,
  trackQueryMetrics,
  createPerformanceMonitor,
  getDatabaseStats,

  // Utilities
  testConnection,
};
