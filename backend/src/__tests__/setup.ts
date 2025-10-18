/**
 * WC-GEN-369 | setup.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../database/services/sequelize.service | Dependencies: ../database/services/sequelize.service, dotenv
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Jest Test Setup for Sequelize
 *
 * This file runs before all tests and sets up the test environment.
 * It configures the test database connection and provides global utilities.
 *
 * IMPORTANT: Tests should use the TEST database, never production data.
 */

import sequelize from '../database/services/sequelize.service';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test timeout
jest.setTimeout(30000);

// Setup: runs once before all tests
beforeAll(async () => {
  try {
    console.log('Setting up test database connection...');

    // Verify we're using test database
    const dbName = sequelize.config.database;
    if (!dbName?.includes('test')) {
      throw new Error(
        `DANGER: Not using test database! Current database: ${dbName}. ` +
          'Please set NODE_ENV=test and configure test database in .env.test'
      );
    }

    // Test database connection
    await sequelize.authenticate();
    console.log('Test database connection established');

    // Sync models (create tables if they don't exist)
    // Use { force: false } to preserve data between test runs
    // Use { force: true } to drop and recreate all tables
    await sequelize.sync({ force: false });
    console.log('Database models synced');
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
});

// Teardown: runs once after all tests
afterAll(async () => {
  try {
    console.log('Closing test database connection...');
    await sequelize.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Failed to close test database connection:', error);
  }
});

// Export sequelize instance for use in tests
export { sequelize };
