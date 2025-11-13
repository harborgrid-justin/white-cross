/**
 * Configuration Module - Main Export
 *
 * Centralized exports for all configuration utilities including database,
 * caching, security, swagger documentation, and application settings.
 *
 * @module config
 * @version 1.0.0
 */

// Configuration utilities
export * from './helpers';

// Application configuration
export * from './app.config';
export * from './app-config.service';

// Authentication & Security
export * from './auth.config';
export * from './security.config';

// Database configuration
export * from './database.config';
export * from './database-pool-monitor.service';

// Caching & Redis
export * from './cache.config';
export * from './redis.config';

// Queue configuration
export * from './queue.config';

// AWS configuration
export * from './aws.config';

// Swagger/OpenAPI documentation (refactored modular structure)
export * from './swagger';

// Validation schemas
export * from './validation.schema';

// Utility services
export * from './module-loader.helper';
export * from './production-configuration-management.service';
export * from './query-performance-logger.service';

// Note: Large swagger files have been refactored into modular structure
// Old files (swagger-*.service.ts) should be removed after migration
