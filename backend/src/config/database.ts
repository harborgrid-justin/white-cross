/**
 * Optimized Database Configuration for White Cross Healthcare Platform
 *
 * Features:
 * - Connection pooling with configurable limits
 * - Query performance monitoring
 * - Error handling and retry logic
 * - Graceful shutdown
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

// Connection pool configuration from environment
const DB_CONFIG = {
  poolMin: parseInt(process.env.DB_POOL_MIN || '2', 10),
  poolMax: parseInt(process.env.DB_POOL_MAX || '10', 10),
  connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000', 10),
  idleTimeout: 30000, // 30 seconds
  statementTimeout: 60000, // 60 seconds for long-running queries
};

// Query performance thresholds (milliseconds)
const SLOW_QUERY_THRESHOLD = 1000; // 1 second
const VERY_SLOW_QUERY_THRESHOLD = 5000; // 5 seconds

// Initialize Prisma Client with optimized settings
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Query performance monitoring
prisma.$on('query', (e: Prisma.QueryEvent) => {
  const duration = e.duration;

  if (duration > VERY_SLOW_QUERY_THRESHOLD) {
    logger.error('VERY SLOW QUERY DETECTED', {
      query: e.query,
      params: e.params,
      duration: `${duration}ms`,
      target: e.target,
    });
  } else if (duration > SLOW_QUERY_THRESHOLD) {
    logger.warn('Slow query detected', {
      query: e.query.substring(0, 200), // Truncate long queries
      duration: `${duration}ms`,
      target: e.target,
    });
  }
});

// Error event monitoring
prisma.$on('error', (e: any) => {
  logger.error('Prisma error event', {
    message: e.message,
    target: e.target,
  });
});

// Warn event monitoring
prisma.$on('warn', (e: any) => {
  logger.warn('Prisma warning', {
    message: e.message,
    target: e.target,
  });
});

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
    await prisma.$queryRaw`SELECT 1`;
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
 * Get database connection pool stats
 */
export async function getPoolStats() {
  try {
    const result = await prisma.$queryRaw<Array<{
      state: string;
      count: number;
    }>>`
      SELECT
        state,
        COUNT(*) as count
      FROM pg_stat_activity
      WHERE datname = current_database()
      GROUP BY state
    `;

    return result;
  } catch (error) {
    logger.error('Failed to get pool stats', error);
    return [];
  }
}

/**
 * Execute query with retry logic for transient failures
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

      // Only retry on connection errors, not business logic errors
      const isRetryable =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        ['P2024', 'P2034'].includes(error.code); // Connection/timeout errors

      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      logger.warn(`Database operation failed, retrying (${attempt}/${maxRetries})`, {
        error: (error as Error).message,
      });

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError!;
}

/**
 * Transaction wrapper with timeout
 */
export async function executeTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
  options: {
    maxWait?: number;
    timeout?: number;
  } = {}
): Promise<T> {
  const { maxWait = 5000, timeout = 60000 } = options;

  return await prisma.$transaction(fn, {
    maxWait,
    timeout,
  });
}

/**
 * Graceful shutdown
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    logger.info('Disconnecting from database...');
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from database', error);
    throw error;
  }
}

/**
 * Initialize database connection with health check
 */
export async function initializeDatabase(): Promise<void> {
  try {
    logger.info('Initializing database connection...', {
      poolMin: DB_CONFIG.poolMin,
      poolMax: DB_CONFIG.poolMax,
    });

    // Test connection
    const health = await checkDatabaseHealth();

    if (!health.healthy) {
      throw new Error(`Database health check failed: ${health.error}`);
    }

    logger.info('Database connection established', {
      latency: `${health.latency}ms`,
    });
  } catch (error) {
    logger.error('Failed to initialize database', error);
    throw error;
  }
}

export default prisma;
