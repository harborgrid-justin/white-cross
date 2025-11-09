"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.getDatabaseStats = exports.createPerformanceMonitor = exports.trackQueryMetrics = exports.logSlowQueries = exports.executeWithFailover = exports.createFailoverManager = exports.executeCachedQuery = exports.createStatementCache = exports.executeQueryWithOptions = exports.setStatementTimeout = exports.executeWithTimeout = exports.executeOnReplica = exports.routeQuery = exports.createReadReplicaPool = exports.calculateExponentialBackoff = exports.createCircuitBreaker = exports.isRetryableError = exports.executeWithRetry = exports.withConnectionLifecycle = exports.reconnectDatabase = exports.gracefulDisconnect = exports.connectWithRetry = exports.monitorConnectionPool = exports.getConnectionPoolMetrics = exports.validateConnection = exports.pingDatabase = exports.checkConnectionHealth = exports.warmUpConnectionPool = exports.drainConnectionPool = exports.updatePoolSize = exports.calculateOptimalPoolSize = exports.createConnectionPool = void 0;
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
const sequelize_1 = require("sequelize");
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
const createConnectionPool = (options, poolConfig) => {
    return new sequelize_1.Sequelize({
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
exports.createConnectionPool = createConnectionPool;
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
const calculateOptimalPoolSize = (expectedConcurrentRequests, averageQueryTime) => {
    const maxConnections = Math.min(Math.ceil((expectedConcurrentRequests * averageQueryTime) / 1000), 100);
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
exports.calculateOptimalPoolSize = calculateOptimalPoolSize;
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
const updatePoolSize = async (sequelize, max, min) => {
    const pool = sequelize.connectionManager.pool;
    if (pool) {
        pool.options.max = max;
        pool.options.min = min;
    }
};
exports.updatePoolSize = updatePoolSize;
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
const drainConnectionPool = async (sequelize, timeout = 30000) => {
    const pool = sequelize.connectionManager.pool;
    if (!pool) {
        return;
    }
    const drainPromise = new Promise((resolve, reject) => {
        pool.drain(() => {
            pool.clear();
            resolve();
        });
    });
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Pool drain timeout')), timeout);
    });
    await Promise.race([drainPromise, timeoutPromise]);
};
exports.drainConnectionPool = drainConnectionPool;
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
const warmUpConnectionPool = async (sequelize) => {
    const pool = sequelize.connectionManager.pool;
    const minConnections = pool?.options?.min || 1;
    const warmupPromises = Array.from({ length: minConnections }, async () => {
        try {
            await sequelize.authenticate();
        }
        catch (error) {
            console.error('Warmup connection failed:', error);
        }
    });
    await Promise.all(warmupPromises);
};
exports.warmUpConnectionPool = warmUpConnectionPool;
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
const checkConnectionHealth = async (sequelize) => {
    const startTime = Date.now();
    try {
        await sequelize.authenticate();
        const latency = Date.now() - startTime;
        const pool = sequelize.connectionManager.pool;
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
    }
    catch (error) {
        return {
            isHealthy: false,
            latency: Date.now() - startTime,
            timestamp: new Date(),
            error: error,
        };
    }
};
exports.checkConnectionHealth = checkConnectionHealth;
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
const pingDatabase = async (sequelize, timeout = 5000) => {
    try {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Ping timeout')), timeout);
        });
        const pingPromise = sequelize.query('SELECT 1', { type: sequelize_1.QueryTypes.SELECT });
        await Promise.race([pingPromise, timeoutPromise]);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.pingDatabase = pingDatabase;
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
const validateConnection = async (sequelize) => {
    try {
        const result = await sequelize.query('SELECT NOW() as current_time', {
            type: sequelize_1.QueryTypes.SELECT,
        });
        return result.length > 0;
    }
    catch (error) {
        return false;
    }
};
exports.validateConnection = validateConnection;
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
const getConnectionPoolMetrics = (sequelize) => {
    const pool = sequelize.connectionManager.pool;
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
exports.getConnectionPoolMetrics = getConnectionPoolMetrics;
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
const monitorConnectionPool = (sequelize, thresholds) => {
    const metrics = (0, exports.getConnectionPoolMetrics)(sequelize);
    const alerts = [];
    if (thresholds.maxActiveConnections &&
        metrics.activeConnections > thresholds.maxActiveConnections) {
        alerts.push({
            type: 'HIGH_ACTIVE_CONNECTIONS',
            message: `Active connections (${metrics.activeConnections}) exceeds threshold (${thresholds.maxActiveConnections})`,
        });
    }
    if (thresholds.maxWaitingRequests &&
        metrics.waitingRequests > thresholds.maxWaitingRequests) {
        alerts.push({
            type: 'HIGH_WAITING_REQUESTS',
            message: `Waiting requests (${metrics.waitingRequests}) exceeds threshold (${thresholds.maxWaitingRequests})`,
        });
    }
    if (thresholds.minIdleConnections &&
        metrics.idleConnections < thresholds.minIdleConnections) {
        alerts.push({
            type: 'LOW_IDLE_CONNECTIONS',
            message: `Idle connections (${metrics.idleConnections}) below threshold (${thresholds.minIdleConnections})`,
        });
    }
    return alerts;
};
exports.monitorConnectionPool = monitorConnectionPool;
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
const connectWithRetry = async (sequelize, retryConfig) => {
    const config = {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2,
        ...retryConfig,
    };
    let lastError;
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            await sequelize.authenticate();
            return;
        }
        catch (error) {
            lastError = error;
            if (attempt === config.maxRetries) {
                throw new Error(`Failed to connect after ${config.maxRetries} attempts: ${lastError.message}`);
            }
            const delay = Math.min(config.initialDelay * Math.pow(config.backoffMultiplier, attempt), config.maxDelay);
            if (config.onRetry) {
                config.onRetry(attempt + 1, lastError);
            }
            await sleep(delay);
        }
    }
    throw lastError;
};
exports.connectWithRetry = connectWithRetry;
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
const gracefulDisconnect = async (sequelize, timeout = 10000) => {
    const disconnectPromise = sequelize.close();
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Disconnect timeout')), timeout);
    });
    await Promise.race([disconnectPromise, timeoutPromise]);
};
exports.gracefulDisconnect = gracefulDisconnect;
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
const reconnectDatabase = async (sequelize, retryConfig) => {
    try {
        await (0, exports.gracefulDisconnect)(sequelize, 5000);
    }
    catch (error) {
        console.warn('Error during disconnect before reconnect:', error);
    }
    await (0, exports.connectWithRetry)(sequelize, retryConfig);
};
exports.reconnectDatabase = reconnectDatabase;
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
const withConnectionLifecycle = async (sequelize, callback, hooks) => {
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
    }
    catch (error) {
        if (hooks?.onError) {
            await hooks.onError(error);
        }
        throw error;
    }
};
exports.withConnectionLifecycle = withConnectionLifecycle;
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
const executeWithRetry = async (sequelize, queryFn, config) => {
    let lastError;
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            return await queryFn();
        }
        catch (error) {
            lastError = error;
            if (attempt === config.maxRetries || !(0, exports.isRetryableError)(error, config.retryableErrors)) {
                throw error;
            }
            const delay = Math.min(config.initialDelay * Math.pow(config.backoffMultiplier, attempt), config.maxDelay);
            if (config.onRetry) {
                config.onRetry(attempt + 1, lastError);
            }
            await sleep(delay);
        }
    }
    throw lastError;
};
exports.executeWithRetry = executeWithRetry;
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
const isRetryableError = (error, customRetryableErrors) => {
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
    const errorCode = error.code;
    return retryableErrors.some((pattern) => errorMessage.includes(pattern.toUpperCase()) ||
        errorCode === pattern);
};
exports.isRetryableError = isRetryableError;
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
const createCircuitBreaker = (config) => {
    const state = {
        state: 'CLOSED',
        failures: 0,
    };
    const execute = async (fn) => {
        if (state.state === 'OPEN') {
            if (state.nextAttemptTime &&
                Date.now() >= state.nextAttemptTime.getTime()) {
                state.state = 'HALF_OPEN';
            }
            else {
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
        }
        catch (error) {
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
exports.createCircuitBreaker = createCircuitBreaker;
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
const calculateExponentialBackoff = (attempt, baseDelay, maxDelay) => {
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 0.1 * exponentialDelay; // Add 0-10% jitter
    return Math.min(exponentialDelay + jitter, maxDelay);
};
exports.calculateExponentialBackoff = calculateExponentialBackoff;
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
const createReadReplicaPool = (config) => {
    let currentIndex = 0;
    const connectionCounts = new Map();
    config.replicas.forEach((replica) => {
        connectionCounts.set(replica, 0);
    });
    const getReadConnection = () => {
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
    const releaseConnection = (replica) => {
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
exports.createReadReplicaPool = createReadReplicaPool;
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
const routeQuery = async (primary, readReplicas, query, type) => {
    const isReadQuery = type === sequelize_1.QueryTypes.SELECT &&
        !query.trim().toUpperCase().includes('FOR UPDATE');
    const connection = isReadQuery && readReplicas.length > 0
        ? readReplicas[Math.floor(Math.random() * readReplicas.length)]
        : primary;
    return connection.query(query, { type });
};
exports.routeQuery = routeQuery;
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
const executeOnReplica = async (primary, readReplicas, queryFn) => {
    if (readReplicas.length === 0) {
        return queryFn(primary);
    }
    const replica = readReplicas[Math.floor(Math.random() * readReplicas.length)];
    try {
        return await queryFn(replica);
    }
    catch (error) {
        console.warn('Read replica query failed, falling back to primary:', error);
        return queryFn(primary);
    }
};
exports.executeOnReplica = executeOnReplica;
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
const executeWithTimeout = async (sequelize, query, timeout, options) => {
    const queryPromise = sequelize.query(query, options);
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Query timeout after ${timeout}ms`)), timeout);
    });
    return Promise.race([queryPromise, timeoutPromise]);
};
exports.executeWithTimeout = executeWithTimeout;
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
const setStatementTimeout = async (sequelize, timeout) => {
    await sequelize.query(`SET statement_timeout = ${timeout}`);
};
exports.setStatementTimeout = setStatementTimeout;
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
const executeQueryWithOptions = async (sequelize, query, options) => {
    const executeFn = async () => {
        if (options.timeout) {
            return (0, exports.executeWithTimeout)(sequelize, query, options.timeout, {
                type: options.type,
                transaction: options.transaction,
            });
        }
        return sequelize.query(query, {
            type: options.type,
            transaction: options.transaction,
        });
    };
    if (options.retry && options.retryConfig) {
        return (0, exports.executeWithRetry)(sequelize, executeFn, options.retryConfig);
    }
    return executeFn();
};
exports.executeQueryWithOptions = executeQueryWithOptions;
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
const createStatementCache = (config) => {
    const cache = new Map();
    const set = (key, statement) => {
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
    const get = (key) => {
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
exports.createStatementCache = createStatementCache;
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
const executeCachedQuery = async (sequelize, cacheKey, query, cache) => {
    let statement = cache.get(cacheKey);
    if (!statement) {
        cache.set(cacheKey, query);
        statement = query;
    }
    return sequelize.query(statement, { type: sequelize_1.QueryTypes.SELECT });
};
exports.executeCachedQuery = executeCachedQuery;
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
const createFailoverManager = (config) => {
    const state = {
        currentDatabase: 'primary',
        primaryHealthy: true,
        failoverHealthy: true,
    };
    let healthCheckInterval = null;
    const checkHealth = async () => {
        state.primaryHealthy = await (0, exports.pingDatabase)(config.primarySequelize);
        state.failoverHealthy = await (0, exports.pingDatabase)(config.failoverSequelize);
        // Failover to backup if primary is down
        if (!state.primaryHealthy && state.failoverHealthy && state.currentDatabase === 'primary') {
            state.currentDatabase = 'failover';
            state.lastFailover = new Date();
            console.warn('Failover: Switched to failover database');
        }
        // Failback to primary if configured
        if (config.autoFailback &&
            state.primaryHealthy &&
            state.currentDatabase === 'failover' &&
            state.lastFailover &&
            Date.now() - state.lastFailover.getTime() > config.failbackDelay) {
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
    const getCurrentConnection = () => {
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
exports.createFailoverManager = createFailoverManager;
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
const executeWithFailover = async (primary, failover, queryFn) => {
    try {
        return await queryFn(primary);
    }
    catch (error) {
        console.warn('Primary database failed, attempting failover:', error);
        return queryFn(failover);
    }
};
exports.executeWithFailover = executeWithFailover;
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
const logSlowQueries = (sequelize, threshold, callback) => {
    const listener = (query, options) => {
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
    sequelize.addHook('beforeQuery', listener);
    return () => {
        sequelize.removeHook('beforeQuery', listener);
    };
};
exports.logSlowQueries = logSlowQueries;
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
const trackQueryMetrics = (sequelize) => {
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
            }
            else {
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
exports.trackQueryMetrics = trackQueryMetrics;
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
const createPerformanceMonitor = (sequelize, thresholds) => {
    let slowQueryMonitor = null;
    let poolMonitorInterval = null;
    const start = () => {
        if (thresholds.slowQueryThreshold) {
            slowQueryMonitor = (0, exports.logSlowQueries)(sequelize, thresholds.slowQueryThreshold, (log) => {
                if (thresholds.alertCallback) {
                    thresholds.alertCallback({
                        type: 'SLOW_QUERY',
                        message: `Slow query detected: ${log.duration}ms`,
                        data: log,
                    });
                }
            });
        }
        if (thresholds.connectionPoolThreshold) {
            poolMonitorInterval = setInterval(() => {
                const alerts = (0, exports.monitorConnectionPool)(sequelize, thresholds.connectionPoolThreshold);
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
exports.createPerformanceMonitor = createPerformanceMonitor;
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
const getDatabaseStats = async (sequelize) => {
    const pool = (0, exports.getConnectionPoolMetrics)(sequelize);
    const health = await (0, exports.checkConnectionHealth)(sequelize);
    // Get database-specific stats
    let databaseStats = {};
    try {
        const dialect = sequelize.getDialect();
        if (dialect === 'postgres') {
            const [stats] = await sequelize.query(`SELECT
          numbackends as active_connections,
          xact_commit as transactions_committed,
          xact_rollback as transactions_rolled_back,
          blks_read as blocks_read,
          blks_hit as blocks_hit,
          tup_returned as tuples_returned,
          tup_fetched as tuples_fetched
        FROM pg_stat_database
        WHERE datname = current_database()`, { type: sequelize_1.QueryTypes.SELECT });
            databaseStats = stats;
        }
        else if (dialect === 'mysql') {
            const [stats] = await sequelize.query('SHOW STATUS', {
                type: sequelize_1.QueryTypes.SELECT,
            });
            databaseStats = stats;
        }
    }
    catch (error) {
        console.warn('Failed to fetch database stats:', error);
    }
    return {
        pool,
        health,
        database: databaseStats,
    };
};
exports.getDatabaseStats = getDatabaseStats;
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
const sleep = (ms) => {
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
const testConnection = async (sequelize) => {
    const startTime = Date.now();
    try {
        await sequelize.authenticate();
        const canExecuteQueries = await (0, exports.validateConnection)(sequelize);
        const poolMetrics = (0, exports.getConnectionPoolMetrics)(sequelize);
        return {
            success: true,
            latency: Date.now() - startTime,
            canExecuteQueries,
            poolMetrics,
        };
    }
    catch (error) {
        return {
            success: false,
            latency: Date.now() - startTime,
            canExecuteQueries: false,
            poolMetrics: (0, exports.getConnectionPoolMetrics)(sequelize),
            error: error,
        };
    }
};
exports.testConnection = testConnection;
exports.default = {
    // Connection pool management
    createConnectionPool: exports.createConnectionPool,
    calculateOptimalPoolSize: exports.calculateOptimalPoolSize,
    updatePoolSize: exports.updatePoolSize,
    drainConnectionPool: exports.drainConnectionPool,
    warmUpConnectionPool: exports.warmUpConnectionPool,
    // Connection health checks
    checkConnectionHealth: exports.checkConnectionHealth,
    pingDatabase: exports.pingDatabase,
    validateConnection: exports.validateConnection,
    getConnectionPoolMetrics: exports.getConnectionPoolMetrics,
    monitorConnectionPool: exports.monitorConnectionPool,
    // Connection lifecycle
    connectWithRetry: exports.connectWithRetry,
    gracefulDisconnect: exports.gracefulDisconnect,
    reconnectDatabase: exports.reconnectDatabase,
    withConnectionLifecycle: exports.withConnectionLifecycle,
    // Retry and resilience
    executeWithRetry: exports.executeWithRetry,
    isRetryableError: exports.isRetryableError,
    createCircuitBreaker: exports.createCircuitBreaker,
    calculateExponentialBackoff: exports.calculateExponentialBackoff,
    // Read replica and routing
    createReadReplicaPool: exports.createReadReplicaPool,
    routeQuery: exports.routeQuery,
    executeOnReplica: exports.executeOnReplica,
    // Query timeout management
    executeWithTimeout: exports.executeWithTimeout,
    setStatementTimeout: exports.setStatementTimeout,
    executeQueryWithOptions: exports.executeQueryWithOptions,
    // Statement caching
    createStatementCache: exports.createStatementCache,
    executeCachedQuery: exports.executeCachedQuery,
    // Failover
    createFailoverManager: exports.createFailoverManager,
    executeWithFailover: exports.executeWithFailover,
    // Performance monitoring
    logSlowQueries: exports.logSlowQueries,
    trackQueryMetrics: exports.trackQueryMetrics,
    createPerformanceMonitor: exports.createPerformanceMonitor,
    getDatabaseStats: exports.getDatabaseStats,
    // Utilities
    testConnection: exports.testConnection,
};
//# sourceMappingURL=database-connection-kit.js.map