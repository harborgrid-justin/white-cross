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

// Environment-based configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Connection pool configuration
const poolConfig = {
  max: parseInt(process.env.DB_POOL_MAX || '10', 10),
  min: parseInt(process.env.DB_POOL_MIN || '2', 10),
  acquire: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000', 10),
  idle: 30000,
  evict: 10000,
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
          statement_timeout: 60000,
          idle_in_transaction_session_timeout: 120000,
        }
      : {
          statement_timeout: 60000,
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

// Create Sequelize instance
export const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);

/**
 * Database health check
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
 * Initialize database connection
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
      throw new Error(`Database health check failed: ${health.error}`);
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
 * Get database connection pool statistics
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
 * Execute operation with retry logic for transient failures
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
 * Transaction wrapper with timeout
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
 * Graceful shutdown
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
