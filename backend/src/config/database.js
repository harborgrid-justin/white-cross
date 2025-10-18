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

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: false
    },
    logging: false
  },
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
