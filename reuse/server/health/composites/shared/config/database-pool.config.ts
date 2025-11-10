/**
 * LOC: HLTH-SHARED-CONFIG-001
 * File: /reuse/server/health/composites/shared/config/database-pool.config.ts
 * PURPOSE: Optimized database connection pooling configuration
 * IMPACT: Prevents connection exhaustion and improves query performance
 */

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

/**
 * TypeORM optimized connection pool configuration
 * Suitable for healthcare applications with high read/write loads
 */
export const typeOrmPoolConfig: Partial<TypeOrmModuleOptions> = {
  // Connection pool settings
  extra: {
    // Maximum number of connections in pool
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),

    // Minimum number of idle connections
    min: parseInt(process.env.DB_POOL_MIN || '5', 10),

    // Maximum time (ms) a connection can be idle before being released
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '10000', 10),

    // Maximum time (ms) to wait for a connection from the pool
    connectionTimeoutMillis: parseInt(
      process.env.DB_POOL_CONNECTION_TIMEOUT || '5000',
      10,
    ),

    // Maximum lifetime (ms) of a connection in the pool
    maxLifetime: parseInt(process.env.DB_POOL_MAX_LIFETIME || '1800000', 10), // 30 min

    // Enable connection validation
    testOnBorrow: true,

    // Statement timeout (ms) - prevents long-running queries
    statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '30000', 10),

    // Query timeout (ms)
    query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT || '30000', 10),

    // Application name for connection tracking
    application_name: 'healthcare-composites',
  },

  // Connection retry settings
  retryAttempts: 3,
  retryDelay: 3000,

  // Automatically load entities
  autoLoadEntities: true,

  // Logging settings
  logging: process.env.DB_LOGGING === 'true' || process.env.NODE_ENV === 'development',
  logger: 'advanced-console',

  // Additional options
  maxQueryExecutionTime: 1000, // Log queries taking longer than 1s
};

/**
 * Sequelize optimized connection pool configuration
 */
export const sequelizePoolConfig: Partial<SequelizeModuleOptions> = {
  pool: {
    // Maximum number of connections in pool
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),

    // Minimum number of connections in pool
    min: parseInt(process.env.DB_POOL_MIN || '5', 10),

    // Maximum time (ms) that a connection can be idle before being released
    idle: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '10000', 10),

    // Maximum time (ms) that pool will try to get connection before throwing error
    acquire: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT || '5000', 10),

    // Maximum time (ms) that a connection can exist before being destroyed
    evict: parseInt(process.env.DB_POOL_MAX_LIFETIME || '1800000', 10),
  },

  // Retry settings
  retry: {
    max: 3,
    timeout: 3000,
  },

  // Logging settings
  logging: process.env.DB_LOGGING === 'true' || process.env.NODE_ENV === 'development'
    ? console.log
    : false,

  // Benchmarking
  benchmark: process.env.DB_BENCHMARK === 'true',

  // Additional options
  dialectOptions: {
    // Statement timeout (PostgreSQL)
    statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '30000', 10),

    // Idle in transaction timeout (PostgreSQL)
    idle_in_transaction_session_timeout: parseInt(
      process.env.DB_IDLE_IN_TRANSACTION_TIMEOUT || '30000',
      10,
    ),

    // Application name
    application_name: 'healthcare-composites',
  },
};

/**
 * MongoDB connection pool configuration
 */
export const mongoPoolConfig = {
  // Maximum number of connections in the pool
  maxPoolSize: parseInt(process.env.MONGO_POOL_MAX || '20', 10),

  // Minimum number of connections in the pool
  minPoolSize: parseInt(process.env.MONGO_POOL_MIN || '5', 10),

  // Maximum time (ms) a connection can be idle
  maxIdleTimeMS: parseInt(process.env.MONGO_POOL_IDLE_TIMEOUT || '10000', 10),

  // Socket timeout (ms)
  socketTimeoutMS: parseInt(process.env.MONGO_SOCKET_TIMEOUT || '45000', 10),

  // Server selection timeout (ms)
  serverSelectionTimeoutMS: parseInt(
    process.env.MONGO_SERVER_SELECTION_TIMEOUT || '5000',
    10,
  ),

  // Connection timeout (ms)
  connectTimeoutMS: parseInt(process.env.MONGO_CONNECTION_TIMEOUT || '10000', 10),

  // Wait queue timeout (ms)
  waitQueueTimeoutMS: parseInt(process.env.MONGO_WAIT_QUEUE_TIMEOUT || '5000', 10),

  // Application name
  appName: 'healthcare-composites',

  // Read preference
  readPreference: 'primaryPreferred',

  // Write concern
  w: 'majority',
  wtimeoutMS: 5000,

  // Retry writes
  retryWrites: true,
  retryReads: true,
};

/**
 * Database pool monitoring and metrics
 */
export class DatabasePoolMonitor {
  private static metrics = {
    activeConnections: 0,
    idleConnections: 0,
    waitingRequests: 0,
    totalAcquired: 0,
    totalReleased: 0,
    totalErrors: 0,
  };

  static recordAcquire(): void {
    this.metrics.totalAcquired++;
    this.metrics.activeConnections++;
    this.metrics.idleConnections = Math.max(0, this.metrics.idleConnections - 1);
  }

  static recordRelease(): void {
    this.metrics.totalReleased++;
    this.metrics.activeConnections = Math.max(0, this.metrics.activeConnections - 1);
    this.metrics.idleConnections++;
  }

  static recordError(): void {
    this.metrics.totalErrors++;
  }

  static recordWaiting(count: number): void {
    this.metrics.waitingRequests = count;
  }

  static getMetrics(): typeof DatabasePoolMonitor.metrics {
    return { ...this.metrics };
  }

  static getHealthStatus(): {
    healthy: boolean;
    utilizationRate: number;
    warnings: string[];
  } {
    const maxPool = parseInt(process.env.DB_POOL_MAX || '20', 10);
    const utilizationRate = (this.metrics.activeConnections / maxPool) * 100;
    const warnings: string[] = [];

    // Check for high utilization
    if (utilizationRate > 80) {
      warnings.push('Connection pool utilization above 80%');
    }

    // Check for waiting requests
    if (this.metrics.waitingRequests > 5) {
      warnings.push(`${this.metrics.waitingRequests} requests waiting for connections`);
    }

    // Check for errors
    const errorRate = this.metrics.totalErrors / Math.max(this.metrics.totalAcquired, 1);
    if (errorRate > 0.01) {
      warnings.push(`High error rate: ${(errorRate * 100).toFixed(2)}%`);
    }

    return {
      healthy: warnings.length === 0 && utilizationRate < 90,
      utilizationRate,
      warnings,
    };
  }

  static reset(): void {
    this.metrics = {
      activeConnections: 0,
      idleConnections: 0,
      waitingRequests: 0,
      totalAcquired: 0,
      totalReleased: 0,
      totalErrors: 0,
    };
  }
}

/**
 * Environment-specific pool configurations
 */
export function getDatabasePoolConfig(environment: string): {
  max: number;
  min: number;
  idleTimeout: number;
} {
  switch (environment) {
    case 'production':
      return {
        max: 20,
        min: 5,
        idleTimeout: 10000,
      };

    case 'staging':
      return {
        max: 15,
        min: 3,
        idleTimeout: 10000,
      };

    case 'development':
      return {
        max: 10,
        min: 2,
        idleTimeout: 30000,
      };

    case 'test':
      return {
        max: 5,
        min: 1,
        idleTimeout: 5000,
      };

    default:
      return {
        max: 10,
        min: 2,
        idleTimeout: 10000,
      };
  }
}
