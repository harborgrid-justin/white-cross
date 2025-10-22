/**
 * @fileoverview Database Configuration Module
 * @module config/database
 * @description PostgreSQL database configuration with Sequelize ORM for multi-environment setup
 * @requires ../database/config/sequelize - Sequelize configuration and utilities
 *
 * LOC: F4E8180A28
 * WC-CFG-DB-012 | Database Configuration
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-CFG-DB-012 | Database Configuration
 * Purpose: Sequelize configuration for PostgreSQL connections and environments
 * Upstream: Environment variables, .env files | Dependencies: sequelize, pg
 * Downstream: All database models, services | Called by: Sequelize initialization
 * Related: sequelize.ts, models/index.ts, migrations/, seeders/
 * Exports: Database config object | Key Services: Connection pooling, environment setup
 * Last Updated: 2025-10-17 | Dependencies: sequelize, pg, dotenv
 * Critical Path: Env loading → Config validation → Connection pool setup → Model sync
 * LLM Context: Multi-environment database setup, HIPAA-compliant connection security
 */

/**
 * Database Configuration - Re-export Module
 *
 * This file serves as a compatibility layer, re-exporting database configuration
 * utilities from the main Sequelize configuration module. It maintains backward
 * compatibility with existing imports while centralizing database configuration
 * in the database/config directory.
 *
 * @description Provides access to:
 * - Sequelize instance with configured connection
 * - Database health checking utilities
 * - Connection pool statistics
 * - Retry and transaction helpers
 * - Connection lifecycle management
 *
 * @example
 * // Import database utilities
 * import { sequelize, checkDatabaseHealth } from './config/database';
 *
 * // Check database connectivity
 * const isHealthy = await checkDatabaseHealth();
 *
 * @see {@link ../database/config/sequelize} For main configuration
 */

/**
 * @constant {Sequelize} sequelize
 * @description Main Sequelize instance with PostgreSQL connection
 * @see {@link ../database/config/sequelize}
 */
export {
  sequelize,
  /**
   * @function checkDatabaseHealth
   * @description Verifies database connectivity and returns health status
   * @returns {Promise<boolean>} True if database is healthy and connected
   * @example
   * const isHealthy = await checkDatabaseHealth();
   * if (!isHealthy) console.error('Database connection failed');
   */
  checkDatabaseHealth,
  /**
   * @function getPoolStats
   * @description Retrieves current connection pool statistics
   * @returns {Promise<PoolStats>} Pool statistics including active/idle connections
   * @example
   * const stats = await getPoolStats();
   * console.log(`Active: ${stats.active}, Idle: ${stats.idle}`);
   */
  getPoolStats,
  /**
   * @function executeWithRetry
   * @description Executes a database operation with automatic retry on failure
   * @param {Function} operation - Async operation to execute
   * @param {number} [maxRetries=3] - Maximum number of retry attempts
   * @returns {Promise<T>} Result of the operation
   * @throws {Error} When all retry attempts are exhausted
   */
  executeWithRetry,
  /**
   * @function executeTransaction
   * @description Executes operations within a managed database transaction
   * @param {Function} callback - Async callback receiving transaction object
   * @returns {Promise<T>} Result of the transaction
   * @throws {Error} Rolls back transaction on failure
   */
  executeTransaction,
  /**
   * @function disconnectDatabase
   * @description Gracefully closes all database connections
   * @returns {Promise<void>}
   * @example
   * await disconnectDatabase(); // Call during server shutdown
   */
  disconnectDatabase,
  /**
   * @function initializeDatabase
   * @description Initializes database connection and synchronizes models
   * @returns {Promise<void>}
   * @throws {Error} When database initialization fails
   */
  initializeDatabase,
} from '../database/config/sequelize';

/**
 * @default
 * @description Default export of complete database configuration object
 */
export { default } from '../database/config/sequelize';
