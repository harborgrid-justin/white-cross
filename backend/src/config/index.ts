/**
 * Configuration Module Index
 * Central export point for all configuration
 */

export { default as appConfig } from './app.config';
export { default as databaseConfig } from './database.config';
export { default as authConfig } from './auth.config';
export { default as securityConfig } from './security.config';
export { default as redisConfig } from './redis.config';
export { default as awsConfig } from './aws.config';
export { default as cacheConfig } from './cache.config';
export { default as queueConfig } from './queue.config';

export { validationSchema, validateEnvironment } from './validation.schema';

export type { AppConfig } from './app.config';
export type { DatabaseConfig } from './database.config';
export type { AuthConfig } from './auth.config';
export type { SecurityConfig } from './security.config';
export type { RedisConfig } from './redis.config';
export type { AwsConfig } from './aws.config';
export type { CacheConfig } from './cache.config';
export type { QueueConfig } from './queue.config';

// Export centralized configuration service
export { AppConfigService } from './app-config.service';

// Export module loader helpers for conditional module loading
export { loadConditionalModules, FeatureFlags } from './module-loader.helper';
export type { ConditionalModuleConfig } from './module-loader.helper';

export * from './database-pool-monitor.service';
export * from './query-performance-logger.service';
export * from './swagger-documentation-automation.service';
export * from './swagger-endpoint-documentation.service';
export * from './swagger-response-builders.service';
export * from './swagger-schema-generators.service';
export * from './swagger-security-schemes.service';
export * from './swagger-config.service';
export * from './production-configuration-management.service';
