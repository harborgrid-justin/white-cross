/**
 * Database Configuration
 * Comprehensive Sequelize database configuration with connection pooling,
 * SSL/TLS support, and environment-specific settings
 *
 * Supports both DATABASE_URL and individual connection parameters
 * Priority: DATABASE_URL > Individual params > Defaults
 */

import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

export interface DatabaseConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  dialect: Dialect;
  logging?: boolean | ((sql: string, timing?: number) => void);
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
    evict?: number;
  };
  dialectOptions?: {
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
    connectTimeout?: number;
  };
  retry?: {
    max: number;
    match?: RegExp[];
  };
  timezone?: string;
  define?: {
    timestamps: boolean;
    underscored: boolean;
    freezeTableName: boolean;
  };
}

/**
 * Parse DATABASE_URL into connection parameters
 * Format: postgresql://user:password@host:port/database?options
 */
export function parseDatabaseUrl(databaseUrl: string): Partial<DatabaseConfig> {
  try {
    const url = new URL(databaseUrl);

    // Parse SSL mode from query parameters
    const sslMode = url.searchParams.get('sslmode') || url.searchParams.get('ssl');
    const requireSSL = sslMode === 'require' || sslMode === 'true' || databaseUrl.includes('sslmode=require');

    return {
      dialect: url.protocol.replace(':', '') as Dialect,
      host: url.hostname,
      port: url.port ? parseInt(url.port, 10) : 5432,
      username: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1), // Remove leading slash
      dialectOptions: requireSSL ? {
        ssl: {
          require: true,
          rejectUnauthorized: false // Configurable via environment
        }
      } : undefined
    };
  } catch (error) {
    console.error('Failed to parse DATABASE_URL:', error);
    throw new Error('Invalid DATABASE_URL format');
  }
}

/**
 * Get database configuration based on environment
 */
export function getDatabaseConfig(
  env: {
    DATABASE_URL?: string;
    DB_HOST?: string;
    DB_PORT?: string;
    DB_USERNAME?: string;
    DB_PASSWORD?: string;
    DB_NAME?: string;
    DB_DIALECT?: string;
    DB_SSL?: string;
    DB_SSL_REJECT_UNAUTHORIZED?: string;
    DB_POOL_MIN?: string;
    DB_POOL_MAX?: string;
    DB_POOL_IDLE?: string;
    DB_POOL_ACQUIRE?: string;
    DB_POOL_EVICT?: string;
    DB_LOGGING?: string;
    DB_TIMEZONE?: string;
    NODE_ENV?: string;
  }
): SequelizeModuleOptions {
  const nodeEnv = env.NODE_ENV || 'development';
  const isDevelopment = nodeEnv === 'development';
  const isProduction = nodeEnv === 'production';
  const isTest = nodeEnv === 'test';

  // Base configuration
  let config: DatabaseConfig = {
    dialect: (env.DB_DIALECT as Dialect) || 'postgres',
    timezone: env.DB_TIMEZONE || '+00:00',

    // Connection pooling
    pool: {
      max: parseInt(env.DB_POOL_MAX || (isProduction ? '20' : '10'), 10),
      min: parseInt(env.DB_POOL_MIN || (isProduction ? '5' : '2'), 10),
      acquire: parseInt(env.DB_POOL_ACQUIRE || '30000', 10), // 30 seconds
      idle: parseInt(env.DB_POOL_IDLE || '10000', 10), // 10 seconds
      evict: parseInt(env.DB_POOL_EVICT || '5000', 10), // 5 seconds
    },

    // Retry configuration
    retry: {
      max: isProduction ? 5 : 3,
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /ENOTFOUND/,
      ],
    },

    // Default model options
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  };

  // Configure logging based on environment
  if (env.DB_LOGGING !== undefined) {
    config.logging = env.DB_LOGGING === 'true' ? console.log : false;
  } else {
    // Default logging behavior
    config.logging = isDevelopment ? console.log : false;
  }

  // Test environment: disable logging
  if (isTest) {
    config.logging = false;
  }

  // Priority 1: Use DATABASE_URL if provided (common for cloud deployments)
  if (env.DATABASE_URL) {
    const urlConfig = parseDatabaseUrl(env.DATABASE_URL);
    config = { ...config, ...urlConfig };

    // Override SSL settings if explicitly provided
    if (env.DB_SSL === 'true' || env.DB_SSL === 'false') {
      const requireSSL = env.DB_SSL === 'true';
      const rejectUnauthorized = env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

      config.dialectOptions = {
        ...config.dialectOptions,
        ssl: requireSSL ? {
          require: true,
          rejectUnauthorized,
        } : undefined,
      };
    }
  } else {
    // Priority 2: Use individual connection parameters
    config = {
      ...config,
      host: env.DB_HOST || 'localhost',
      port: parseInt(env.DB_PORT || '5432', 10),
      username: env.DB_USERNAME || 'postgres',
      password: env.DB_PASSWORD || '',
      database: env.DB_NAME || 'whitecross',
    };

    // Configure SSL for production
    if (env.DB_SSL === 'true') {
      const rejectUnauthorized = env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';
      config.dialectOptions = {
        ssl: {
          require: true,
          rejectUnauthorized,
        },
      };
    }
  }

  // Add connection timeout for dialect options
  config.dialectOptions = {
    ...config.dialectOptions,
    connectTimeout: 10000, // 10 seconds
  };

  return config as SequelizeModuleOptions;
}

/**
 * Get configuration for Sequelize CLI
 * Must be in CommonJS format for CLI compatibility
 */
export function getSequelizeCliConfig(env: NodeJS.ProcessEnv) {
  const config = getDatabaseConfig(env);

  return {
    development: {
      ...config,
      seederStorage: 'sequelize',
      seederStorageTableName: 'sequelize_seeders',
    },
    test: {
      ...config,
      logging: false,
    },
    production: {
      ...config,
      logging: false,
      seederStorage: 'sequelize',
      seederStorageTableName: 'sequelize_seeders',
    },
  };
}

/**
 * Validate database configuration
 */
export function validateDatabaseConfig(config: DatabaseConfig): void {
  if (!config.host && !config.database) {
    throw new Error('Database configuration is incomplete: missing host or database');
  }

  if (!config.username) {
    throw new Error('Database configuration is incomplete: missing username');
  }

  if (config.pool) {
    if (config.pool.min > config.pool.max) {
      throw new Error('Database pool configuration invalid: min cannot be greater than max');
    }
  }
}
