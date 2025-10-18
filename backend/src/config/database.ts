/**
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
 * Database Configuration - Re-export from Sequelize config
 * This file maintains compatibility with existing imports
 */

export {
  sequelize,
  checkDatabaseHealth,
  getPoolStats,
  executeWithRetry,
  executeTransaction,
  disconnectDatabase,
  initializeDatabase,
} from '../database/config/sequelize';

export { default } from '../database/config/sequelize';
