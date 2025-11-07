/**
 * Type definitions for database.config.js
 *
 * Provides TypeScript type information for the Sequelize database configuration.
 * This allows TypeScript files to safely import and use the database configuration.
 *
 * @module database/config
 */

import { DatabaseConfiguration } from '../../types/database';

/**
 * Database configuration object exported from database.config.js
 * Contains connection settings for development, test, and production environments.
 */
declare const config: DatabaseConfiguration;

export = config;
