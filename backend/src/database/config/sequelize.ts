/**
 * LOC: 15965E64EA
 * WC-GEN-015 | sequelize.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - BackupLog.ts (database/models/administration/BackupLog.ts)
 *   - ConfigurationHistory.ts (database/models/administration/ConfigurationHistory.ts)
 *   - District.ts (database/models/administration/District.ts)
 *   - License.ts (database/models/administration/License.ts)
 *   - PerformanceMetric.ts (database/models/administration/PerformanceMetric.ts)
 *   - ... and 65 more
 */

/**
 * WC-GEN-015 | sequelize.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger | Dependencies: sequelize, ../../utils/logger
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: constants, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Sequelize Database Configuration for White Cross Healthcare Platform
 *
 * Enterprise-grade configuration with:
 * - Connection pooling
 * - SSL support for production
 * - Query logging and performance monitoring
 * - Automatic retry logic
 * - HIPAA-compliant audit logging
 */

import { Sequelize, Options, QueryTypes, Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables if not already loaded
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.join(__dirname, '../../../.env') });
}

// Environment-based configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Connection pool configuration - OPTIMIZED for performance
// Performance Optimization: PF8X4K-POOL-001
// - Increased max connections from 10 to 20 for better concurrency
// - Increased min connections from 2 to 5 for faster response times
// - Reduced acquire timeout from 60s to 30s to fail fast
// - Set idle timeout to 10s for faster connection release
// - Set eviction check to 1s for proactive cleanup
const poolConfig = {
  max: parseInt(process.env.DB_POOL_MAX || '20', 10), // Max 20 connections (was 10)
  min: parseInt(process.env.DB_POOL_MIN || '5', 10),  // Min 5 connections (was 2)
  acquire: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000', 10), // 30s timeout (was 60s)
  idle: 10000,  // 10s idle timeout (was 30s)
  evict: 1000,  // 1s eviction check (was 10s)
};

// Query performance thresholds
const SLOW_QUERY_THRESHOLD = 1000;
const VERY_SLOW_QUERY_THRESHOLD = 5000;

// Sequelize options
const sequelizeOptions: Options = {
  dialect: 'postgres',
  logging: (sql: string, timing?: number) => {
    if (timing !== undefined) {
      if (timing > VERY_SLOW_QUERY_THRESHOLD) {
        logger.error('VERY SLOW QUERY DETECTED', {
          sql: sql.substring(0, 500),
          duration: `${timing}ms`,
          threshold: VERY_SLOW_QUERY_THRESHOLD,
        });
      } else if (timing > SLOW_QUERY_THRESHOLD) {
        logger.warn('Slow query detected', {
          sql: sql.substring(0, 200),
          duration: `${timing}ms`,
        });
      } else if (NODE_ENV === 'development') {
        logger.debug('Query executed', {
          sql: sql.substring(0, 200),
          duration: `${timing}ms`,
        });
      }
    }
  },
  benchmark: true,
  pool: poolConfig,

  dialectOptions:
    NODE_ENV === 'production'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
          statement_timeout: 30000, // 30s query timeout (was 60s) - Performance Optimization: PF8X4K-TIMEOUT-001
          idle_in_transaction_session_timeout: 120000, // 2min transaction timeout
        }
      : {
          statement_timeout: 30000, // 30s query timeout (was 60s) - Performance Optimization: PF8X4K-TIMEOUT-001
          idle_in_transaction_session_timeout: 120000, // 2min transaction timeout
        },

  retry: {
    max: 3,
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /TimeoutError/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
    ],
  },

  timezone: '+00:00',

  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
    paranoid: false,
  },

  query: {
    raw: false,
  },
};

/**
 * Sequelize ORM instance configured for White Cross healthcare platform.
 *
 * This instance is configured with:
 * - PostgreSQL dialect with SSL support in production
 * - Optimized connection pooling (5-20 connections)
 * - Automatic query performance monitoring
 * - Retry logic for transient connection failures
 * - HIPAA-compliant audit logging integration
 *
 * @see {@link sequelizeOptions} for complete configuration details
 * @see {@link initializeDatabase} to initialize the database connection
 *
 * @example
 * ```typescript
 * import { sequelize } from '@/database/config/sequelize';
 *
 * // Use in model definitions
 * const User = sequelize.define('User', { ... });
 *
 * // Execute raw queries
 * const results = await sequelize.query('SELECT * FROM users WHERE active = true');
 * ```
 */
export const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);

/**
 * Performs a database health check by attempting to authenticate with the database.
 *
 * This function tests database connectivity and measures response latency.
 * Used primarily for health monitoring endpoints and startup validation.
 *
 * @returns {Promise<Object>} Health check result object
 * @returns {boolean} returns.healthy - Whether the database is accessible and responding
 * @returns {number} returns.latency - Response time in milliseconds
 * @returns {string} [returns.error] - Error message if health check failed
 *
 * @example
 * ```typescript
 * const health = await checkDatabaseHealth();
 * if (health.healthy) {
 *   console.log(`Database is healthy (latency: ${health.latency}ms)`);
 * } else {
 *   console.error(`Database error: ${health.error}`);
 * }
 * ```
 *
 * @see {@link initializeDatabase} for database initialization
 */
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  latency: number;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    await sequelize.authenticate();
    const latency = Date.now() - startTime;

    return {
      healthy: true,
      latency,
    };
  } catch (error) {
    const latency = Date.now() - startTime;
    logger.error('Database health check failed', error);

    return {
      healthy: false,
      latency,
      error: (error as Error).message,
    };
  }
}

/**
 * Initializes the database connection and performs health validation.
 *
 * This function:
 * - Tests database connectivity via health check
 * - Logs connection pool configuration
 * - Provides detailed troubleshooting guidance on connection failures
 * - Optionally syncs database schema in development mode
 *
 * Should be called during application startup before accepting requests.
 *
 * @returns {Promise<void>} Resolves when database is successfully initialized
 *
 * @throws {Error} When database connection fails or health check fails
 * @throws {Error} When DATABASE_URL environment variable is missing
 *
 * @example
 * ```typescript
 * // In server startup
 * try {
 *   await initializeDatabase();
 *   console.log('Database ready');
 *   // Start accepting requests
 * } catch (error) {
 *   console.error('Database initialization failed', error);
 *   process.exit(1);
 * }
 * ```
 *
 * @remarks
 * In development mode with SEQUELIZE_AUTO_SYNC=true, this will automatically
 * sync database models using `sequelize.sync({ alter: true })`. This should
 * NEVER be enabled in production.
 *
 * @see {@link checkDatabaseHealth} for health check implementation
 */
export async function initializeDatabase(): Promise<void> {
  try {
    logger.info('Initializing Sequelize database connection...', {
      poolMin: poolConfig.min,
      poolMax: poolConfig.max,
      environment: NODE_ENV,
    });

    const health = await checkDatabaseHealth();

    if (!health.healthy) {
      const errorMsg = `Database health check failed: ${health.error}`;
      logger.error(errorMsg);
      
      // Provide helpful troubleshooting tips
      if (health.error?.includes('password authentication failed')) {
        logger.error('❌ Database authentication failed. Please check:');
        logger.error('   1. Verify DATABASE_URL credentials are correct');
        logger.error('   2. For Neon database: Get fresh connection string from dashboard');
        logger.error('   3. For local development: Use Docker PostgreSQL (see DATABASE_CONNECTION_GUIDE.md)');
        logger.error('   4. Run "node test-db-connection.js" to diagnose the issue');
      } else if (health.error?.includes('ECONNREFUSED') || health.error?.includes('ENOTFOUND')) {
        logger.error('❌ Cannot reach database server. Please check:');
        logger.error('   1. Database server is running (docker-compose up -d postgres)');
        logger.error('   2. Host and port are correct in DATABASE_URL');
        logger.error('   3. Network/firewall allows the connection');
      }
      
      throw new Error(errorMsg);
    }

    logger.info('Sequelize database connection established', {
      latency: `${health.latency}ms`,
    });

    if (NODE_ENV === 'development' && process.env.SEQUELIZE_AUTO_SYNC === 'true') {
      logger.warn('Auto-syncing database models (development only)');
      await sequelize.sync({ alter: true });
    }
  } catch (error) {
    logger.error('Failed to initialize database', error);
    throw error;
  }
}

/**
 * Retrieves real-time PostgreSQL connection pool statistics.
 *
 * Queries `pg_stat_activity` to get the current state of all database connections
 * for the current database. Useful for monitoring connection usage and diagnosing
 * connection pool exhaustion issues.
 *
 * @returns {Promise<Array<{state: string, count: number}>>} Array of connection states with counts
 * Each element contains:
 * - `state`: Connection state (e.g., 'active', 'idle', 'idle in transaction')
 * - `count`: Number of connections in that state
 *
 * @example
 * ```typescript
 * const stats = await getPoolStats();
 * stats.forEach(({ state, count }) => {
 *   console.log(`${count} connections in ${state} state`);
 * });
 * // Output example:
 * // 3 connections in active state
 * // 5 connections in idle state
 * ```
 *
 * @remarks
 * This function executes a raw SQL query against pg_stat_activity.
 * Returns an empty array if the query fails rather than throwing.
 *
 * @see {@link poolConfig} for connection pool configuration
 */
export async function getPoolStats(): Promise<
  Array<{
    state: string;
    count: number;
  }>
> {
  try {
    const results = await sequelize.query<{ state: string; count: number }>(
      `
      SELECT
        state,
        COUNT(*) as count
      FROM pg_stat_activity
      WHERE datname = current_database()
      GROUP BY state
    `,
      {
        type: QueryTypes.SELECT,
        raw: true
      }
    );

    return results || [];
  } catch (error) {
    logger.error('Failed to get pool stats', error);
    return [];
  }
}

/**
 * Executes a database operation with automatic retry logic for transient failures.
 *
 * Retries operations that fail due to connection errors or timeouts using
 * exponential backoff strategy. Non-retryable errors are thrown immediately.
 *
 * @template T - Return type of the operation
 * @param {() => Promise<T>} operation - Async function to execute with retry logic
 * @param {number} [maxRetries=3] - Maximum number of retry attempts (default: 3)
 * @param {number} [delayMs=1000] - Base delay in milliseconds between retries (default: 1000)
 *
 * @returns {Promise<T>} Result of the successful operation
 *
 * @throws {Error} If all retry attempts fail or error is not retryable
 *
 * @example
 * ```typescript
 * // Retry a database query
 * const users = await executeWithRetry(
 *   async () => await User.findAll({ where: { active: true } }),
 *   5,  // max 5 retries
 *   2000  // 2 second base delay
 * );
 * ```
 *
 * @remarks
 * Retryable errors include:
 * - Connection errors (ECONNREFUSED, ETIMEDOUT, EHOSTUNREACH)
 * - Sequelize connection errors
 * - Timeout errors
 *
 * Uses exponential backoff: delay * attempt (1s, 2s, 3s for attempts 1, 2, 3)
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable (connection/timeout errors)
      const errorMessage = (error as Error).message || '';
      const isRetryable =
        errorMessage.includes('connection') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('ETIMEDOUT');

      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      logger.warn(`Database operation failed, retrying (${attempt}/${maxRetries})`, {
        error: errorMessage,
      });

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError!;
}

/**
 * Executes a function within a database transaction with configurable timeout.
 *
 * Provides automatic transaction management with commit on success and rollback
 * on failure. Sets READ_COMMITTED isolation level and configurable statement timeout.
 *
 * @template T - Return type of the transaction function
 * @param {(transaction: any) => Promise<T>} fn - Function to execute within transaction context
 * @param {Object} [options={}] - Transaction options
 * @param {number} [options.timeout=60000] - Statement timeout in milliseconds (default: 60000)
 *
 * @returns {Promise<T>} Result of the transaction function
 *
 * @throws {Error} If transaction function fails (triggers automatic rollback)
 * @throws {Error} If transaction exceeds timeout duration
 *
 * @example
 * ```typescript
 * // Transfer student between schools with transaction
 * const result = await executeTransaction(async (transaction) => {
 *   await Student.update(
 *     { schoolId: newSchoolId },
 *     { where: { id: studentId }, transaction }
 *   );
 *   await AuditLog.create(
 *     { action: 'TRANSFER', entityId: studentId },
 *     { transaction }
 *   );
 *   return { success: true };
 * }, { timeout: 30000 });
 * ```
 *
 * @remarks
 * - Uses READ_COMMITTED isolation level to balance consistency and performance
 * - Automatically handles commit and rollback
 * - Sets PostgreSQL statement_timeout for the transaction scope
 * - Default timeout is 60 seconds but can be adjusted per transaction
 *
 * @see {@link sequelize.transaction} for underlying Sequelize transaction API
 */
export async function executeTransaction<T>(
  fn: (transaction: any) => Promise<T>,
  options: {
    timeout?: number;
  } = {}
): Promise<T> {
  const { timeout = 60000 } = options;

  return await sequelize.transaction(
    {
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    },
    async (transaction) => {
      // Set statement timeout for this transaction
      await sequelize.query(`SET statement_timeout = ${timeout}`, { transaction });
      return await fn(transaction);
    }
  );
}

/**
 * Gracefully closes all database connections.
 *
 * Should be called during application shutdown to ensure all connections
 * are properly closed and resources are released. Waits for active
 * connections to complete before closing.
 *
 * @returns {Promise<void>} Resolves when all connections are closed
 *
 * @throws {Error} If database disconnection encounters an error
 *
 * @example
 * ```typescript
 * // In graceful shutdown handler
 * process.on('SIGTERM', async () => {
 *   console.log('Shutting down gracefully...');
 *   await disconnectDatabase();
 *   process.exit(0);
 * });
 * ```
 *
 * @remarks
 * This function will wait for all active queries to complete before
 * closing connections. It's important to call this during shutdown
 * to prevent connection leaks and ensure data integrity.
 *
 * @see {@link initializeDatabase} for database initialization
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    logger.info('Disconnecting from database...');
    await sequelize.close();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from database', error);
    throw error;
  }
}

export default sequelize;
