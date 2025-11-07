/**
 * Database Type Definitions
 *
 * Core type definitions for database operations, models, and configurations.
 * Ensures type safety across all database interactions.
 *
 * @module types/database
 */

import { Dialect, Options as SequelizeOptions } from 'sequelize';

/**
 * Database environment configuration
 */
export type DatabaseEnvironment = 'development' | 'test' | 'production';

/**
 * SSL configuration for database connections
 */
export interface DatabaseSSLConfig {
  /**
   * Require SSL connection
   */
  require: boolean;

  /**
   * Reject unauthorized certificates
   */
  rejectUnauthorized: boolean;
}

/**
 * Database dialect options
 */
export interface DatabaseDialectOptions {
  /**
   * SSL configuration (optional)
   */
  ssl?: DatabaseSSLConfig | false;

  /**
   * Additional dialect-specific options
   */
  [key: string]: any;
}

/**
 * Define options for Sequelize models
 */
export interface DatabaseDefineOptions {
  /**
   * Add timestamp fields (createdAt, updatedAt)
   */
  timestamps: boolean;

  /**
   * Use snake_case for automatically added attributes
   */
  underscored: boolean;

  /**
   * Enable paranoid mode (soft deletes with deletedAt)
   */
  paranoid?: boolean;

  /**
   * Custom table name
   */
  tableName?: string;
}

/**
 * Database connection configuration for a specific environment
 */
export interface DatabaseConfig {
  /**
   * Database username
   */
  username: string;

  /**
   * Database password
   */
  password: string;

  /**
   * Database name
   */
  database: string;

  /**
   * Database host
   */
  host: string;

  /**
   * Database port
   */
  port: number;

  /**
   * Database dialect (postgres, mysql, sqlite, etc.)
   */
  dialect: Dialect;

  /**
   * Enable/disable query logging
   */
  logging: boolean | ((sql: string, timing?: number) => void);

  /**
   * Dialect-specific options
   */
  dialectOptions?: DatabaseDialectOptions;

  /**
   * Default model definition options
   */
  define?: DatabaseDefineOptions;

  /**
   * Connection pool configuration
   */
  pool?: {
    max?: number;
    min?: number;
    acquire?: number;
    idle?: number;
  };
}

/**
 * Complete database configuration object with all environments
 */
export interface DatabaseConfiguration {
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
}

/**
 * Query execution context
 */
export interface QueryExecutionContext {
  /**
   * User ID executing the query (for audit trails)
   */
  userId?: string;

  /**
   * Request ID for tracing
   */
  requestId?: string;

  /**
   * Additional context metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Repository query options
 */
export interface RepositoryQueryOptions {
  /**
   * Include soft-deleted records
   */
  paranoid?: boolean;

  /**
   * Execution context
   */
  context?: QueryExecutionContext;

  /**
   * Additional Sequelize options
   */
  [key: string]: any;
}

/**
 * Model timestamps interface
 */
export interface ModelTimestamps {
  /**
   * Record creation timestamp
   */
  readonly createdAt: Date;

  /**
   * Record last update timestamp
   */
  readonly updatedAt: Date;

  /**
   * Record soft delete timestamp (if paranoid mode enabled)
   */
  readonly deletedAt?: Date | null;
}

/**
 * Base model attributes that all models should extend
 */
export interface BaseModelAttributes {
  /**
   * Primary key identifier
   */
  id: string;
}

/**
 * Complete base model including timestamps
 */
export interface BaseModel extends BaseModelAttributes, ModelTimestamps {}
