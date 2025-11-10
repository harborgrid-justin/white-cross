/**
 * @fileoverview Core Infrastructure Utilities - Main Barrel Export
 * @module core
 *
 * Enterprise-grade core infrastructure utilities for modern TypeScript/NestJS applications.
 * Organized into six main categories:
 *
 * - **Authentication & Authorization** - JWT, OAuth, RBAC, Session, MFA
 * - **API Management** - Gateway, Versioning, Documentation, GraphQL
 * - **Configuration** - Environment, Secrets, Feature Flags, Validation
 * - **Database** - Sequelize ORM, Models, Queries, Transactions, Migrations
 * - **Caching** - Strategies, Redis, Performance Optimization
 * - **Error Handling** - Handlers, Monitoring, Logging, Recovery
 *
 * @example Import specific utilities
 * ```typescript
 * import {
 *   generateJWTToken,
 *   createRateLimiter,
 *   parseEnvArray,
 *   createCacheManager,
 *   createErrorHandler
 * } from '@reuse/core';
 * ```
 *
 * @example Import from category
 * ```typescript
 * import { generateJWTToken, validateJWTToken } from '@reuse/core/auth';
 * import { createRateLimiter } from '@reuse/core/api';
 * import { parseEnvArray } from '@reuse/core/config';
 * ```
 *
 * @example Import from specialty
 * ```typescript
 * import { generateTOTPCode } from '@reuse/core/auth/mfa';
 * import { generatePKCEVerifier } from '@reuse/core/auth/oauth';
 * import { createCacheAside } from '@reuse/core/cache/strategies';
 * ```
 *
 * @version 1.0.0
 * @since 2025-11-08
 */

// ============================================================================
// AUTHENTICATION & AUTHORIZATION
// ============================================================================

/**
 * Authentication and authorization utilities including JWT, OAuth, RBAC,
 * session management, and multi-factor authentication.
 */
export * as Auth from './auth';

// ============================================================================
// API MANAGEMENT
// ============================================================================

/**
 * API management utilities including gateway patterns, versioning,
 * documentation, rate limiting, and GraphQL support.
 */
export * as Api from './api';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Configuration management utilities including environment variables,
 * secrets, feature flags, and validation.
 */
export * as Config from './config';

// ============================================================================
// DATABASE & ORM
// ============================================================================

/**
 * Database and ORM utilities including Sequelize models, queries,
 * associations, transactions, and migrations.
 */
export * as Database from './database';

// ============================================================================
// CACHING & PERFORMANCE
// ============================================================================

/**
 * Caching and performance utilities including strategies, Redis patterns,
 * and optimization tools.
 */
export * as Cache from './cache';

// ============================================================================
// ERROR HANDLING & MONITORING
// ============================================================================

/**
 * Error handling and monitoring utilities including handlers, logging,
 * and recovery strategies.
 */
export * as Errors from './errors';

// ============================================================================
// CONVENIENCE RE-EXPORTS
// ============================================================================

// Most commonly used utilities re-exported at top level for convenience
export {
  // Auth
  generateJWTToken,
  validateJWTToken,
  createSession,
  generateTOTPSetup,
} from './auth';

export {
  // API
  createRateLimiter,
  createVersionRouter,
  formatErrorResponse,
} from './api';

export {
  // Config
  parseEnvArray,
  parseEnvObject,
  parseEnvDuration,
  createConfigHierarchy,
  createFeatureFlagService,
} from './config';

export {
  // Database
  // Add common database utilities here
} from './database';

export {
  // Cache
  // Add common cache utilities here
} from './cache';

export {
  // Errors
  // Add common error utilities here
} from './errors';
