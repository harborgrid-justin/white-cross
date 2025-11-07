/**
 * @fileoverview Configuration Module Exports
 * @module services/core/config
 * @category Configuration
 *
 * Centralized exports for the configuration module.
 * Provides type definitions, validators, and loaders for application configuration.
 *
 * @example
 * ```typescript
 * import { AppConfiguration, validateConfig, loadConfig } from '@/services/core/config';
 *
 * const config = loadConfig();
 * validateConfig(config);
 * ```
 */

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type {
  ApiConfig,
  SecurityConfig,
  CacheConfig,
  AuditConfig,
  ResilienceConfig,
  PerformanceConfig,
  AppConfiguration,
} from './types';

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

export {
  validateApiUrl,
  parseNumber,
  validateConfiguration,
} from './validator';

// ==========================================
// CONFIGURATION LOADER
// ==========================================

export {
  loadApiConfig,
  loadSecurityConfig,
  loadCacheConfig,
  loadAuditConfig,
  loadResilienceConfig,
  loadPerformanceConfig,
  loadConfiguration,
  getEnvironment,
} from './loader';
