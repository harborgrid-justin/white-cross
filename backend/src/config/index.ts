/**
 * Configuration Module Index
 * Central export point for all configuration
 */

export { default as appConfig } from './app.config';
export { default as databaseConfig } from './database.config';
export { default as authConfig } from './auth.config';
export { default as securityConfig } from './security.config';
export { default as redisConfig } from './redis.config';

export { validationSchema, validateEnvironment } from './validation.schema';

export type { AppConfig } from './app.config';
export type { DatabaseConfig } from './database.config';
export type { AuthConfig } from './auth.config';
export type { SecurityConfig } from './security.config';
export type { RedisConfig } from './redis.config';

// Export centralized configuration service
export { AppConfigService } from './app-config.service';
