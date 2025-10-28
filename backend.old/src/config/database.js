/**
 * @fileoverview Sequelize CLI Configuration for Migrations and Seeders
 * @module config/database
 * @description Multi-environment database configuration for Sequelize CLI operations
 * @requires dotenv - Environment variable management
 *
 * LOC: 5F5982B191
 * WC-CFG-DJS-054 | Sequelize CLI Configuration & Multi-Environment Database Setup
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-CFG-DJS-054 | Sequelize CLI Configuration & Multi-Environment Database Setup
 * Purpose: Database connection config for Sequelize CLI, migrations, seeders
 * Upstream: Environment variables, .env files | Dependencies: dotenv, sequelize
 * Downstream: migrations/, seeders/, Sequelize CLI | Called by: sequelize-cli commands
 * Related: database.ts, database/config/sequelize.ts, migrations/, seeders/
 * Exports: development, test, production configs | Key Services: DB connection pools
 * Last Updated: 2025-10-18 | Dependencies: dotenv, sequelize (CLI)
 * Critical Path: CLI command → Environment detection → Database connection
 * LLM Context: Sequelize CLI configuration, PostgreSQL SSL, HIPAA-compliant connections
 */

require('dotenv').config();

/**
 * @constant {string} DATABASE_URL
 * @description PostgreSQL database connection string from environment
 * @env DATABASE_URL
 * @default undefined
 * @security Contains sensitive credentials - never commit to version control
 * @example
 * // In .env file:
 * DATABASE_URL=postgresql://username:password@localhost:5432/white_cross_dev
 */

/**
 * @constant {string} TEST_DATABASE_URL
 * @description Test database connection string (optional, falls back to DATABASE_URL)
 * @env TEST_DATABASE_URL
 * @default process.env.DATABASE_URL
 * @example
 * // In .env file:
 * TEST_DATABASE_URL=postgresql://username:password@localhost:5432/white_cross_test
 */

/**
 * @constant {Object} module.exports
 * @description Sequelize CLI multi-environment database configuration
 * @property {Object} development - Development environment configuration
 * @property {Object} test - Test environment configuration
 * @property {Object} production - Production environment configuration
 *
 * @example
 * // Run migrations in development
 * npx sequelize-cli db:migrate
 *
 * // Run migrations in production
 * NODE_ENV=production npx sequelize-cli db:migrate
 *
 * @see {@link https://sequelize.org/docs/v6/other-topics/migrations/}
 */
module.exports = {
  /**
   * @property {Object} development
   * @description Development environment database configuration
   * @property {string} development.url - Database connection URL from DATABASE_URL env var
   * @property {string} development.dialect - Database dialect (postgres)
   * @property {Object} development.dialectOptions - PostgreSQL-specific options
   * @property {Object|boolean} development.dialectOptions.ssl - SSL configuration (auto-detected from URL)
   * @property {Function} development.logging - Console logging enabled for debugging
   * @property {Object} development.pool - Connection pool settings
   * @property {number} development.pool.max - Maximum connections (5)
   * @property {number} development.pool.min - Minimum connections (0)
   * @property {number} development.pool.acquire - Max time (ms) to acquire connection (30s)
   * @property {number} development.pool.idle - Max time (ms) connection can be idle (10s)
   */
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DATABASE_URL.includes('sslmode=require') ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  /**
   * @property {Object} test
   * @description Test environment database configuration
   * @property {string} test.url - Database connection URL from TEST_DATABASE_URL or DATABASE_URL
   * @property {string} test.dialect - Database dialect (postgres)
   * @property {Object} test.dialectOptions - PostgreSQL-specific options
   * @property {boolean} test.dialectOptions.ssl - SSL disabled for local testing
   * @property {boolean} test.logging - Logging disabled for clean test output
   */
  test: {
    url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: false
    },
    logging: false
  },
  /**
   * @property {Object} production
   * @description Production environment database configuration
   * @property {string} production.url - Database connection URL from DATABASE_URL env var
   * @property {string} production.dialect - Database dialect (postgres)
   * @property {Object} production.dialectOptions - PostgreSQL-specific options
   * @property {Object} production.dialectOptions.ssl - SSL required for production security
   * @property {boolean} production.dialectOptions.ssl.require - SSL required
   * @property {boolean} production.dialectOptions.ssl.rejectUnauthorized - Accept self-signed certs
   * @property {boolean} production.logging - Logging disabled for performance
   * @property {Object} production.pool - Connection pool settings (production-optimized)
   * @property {number} production.pool.max - Maximum connections (20)
   * @property {number} production.pool.min - Minimum connections (5)
   * @property {number} production.pool.acquire - Max time (ms) to acquire connection (60s)
   * @property {number} production.pool.idle - Max time (ms) connection can be idle (10s)
   * @security SSL required, credentials managed via environment variables
   * @performance Larger connection pool (20) for concurrent requests
   */
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000
    }
  }
};
