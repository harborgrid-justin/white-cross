/**
 * Middleware Library Module
 *
 * Centralized exports for all middleware utilities, types, and classes.
 * This module provides rate limiting, audit logging, and related functionality.
 *
 * @module lib/middleware
 * @since 2025-11-04
 */

// ============================================================================
// Rate Limiter Exports
// ============================================================================

export {
  RateLimiter,
  RATE_LIMIT_CONFIGS,
  getRateLimiter,
  getIdentifier,
  getRouteType,
  createRateLimitHeaders,
} from './rateLimiter';

// Export types from rateLimiter
export type {
  RateLimitConfig,
  RateLimitStore,
} from './rateLimiter';

// ============================================================================
// Audit Logger Exports
// ============================================================================

export {
  AuditEventType,
  auditLogger,
  isPHIRoute,
  extractResourceInfo,
} from './auditLogger';

// Export types from auditLogger
export type {
  AuditEvent,
} from './auditLogger';

// ============================================================================
// Rate Limit HOF Exports (withRateLimit)
// ============================================================================

export {
  withRateLimit,
} from './withRateLimit';

// Export types from withRateLimit
export type {
  RouteHandler,
} from './withRateLimit';
