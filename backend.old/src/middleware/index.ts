/**
 * LOC: MIDDLEWARE_INDEX
 * WC-MID-IDX-000 | Enterprise Middleware Index & Factory Registry
 *
 * UPSTREAM (imports from):
 *   - All middleware modules
 *
 * DOWNSTREAM (imported by):
 *   - Server initialization files
 *   - Route handlers
 *   - Application bootstrapping
 */

/**
 * WC-MID-IDX-000 | Enterprise Middleware Index & Factory Registry
 * Purpose: Centralized middleware exports, factory registry, and enterprise configuration
 * Upstream: All middleware components | Dependencies: Framework-agnostic
 * Downstream: Server startup, route configuration | Called by: Application initialization
 * Related: All middleware subdirectories, server configuration files
 * Exports: Middleware factories, configurations, utilities | Key Services: Middleware orchestration
 * Last Updated: 2025-10-21 | Dependencies: TypeScript, Node.js
 * Critical Path: App startup → Middleware registration → Route protection → Request processing
 * LLM Context: Enterprise middleware architecture, SOA compliance, healthcare platform integration
 */

/**
 * Enterprise Middleware Index
 * 
 * This module provides centralized access to all middleware components
 * organized according to enterprise best practices and SOA principles.
 */

// ====================
// IMPORT ALL TYPES AND CLASSES FIRST
// ====================

// Import from authentication
import {
  JwtAuthenticationMiddleware,
  createJwtAuthenticationMiddleware,
  type AuthenticationConfig,
  type UserProfile,
  type AuthenticationResult,
  type TokenPayload
} from './core/authentication/jwt.middleware';

// Import from authorization
import {
  RbacMiddleware,
  createRbacMiddleware,
  UserRole,
  Permission,
  requireRole,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  type AuthorizationResult,
  type RbacConfig,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS
} from './core/authorization/rbac.middleware';

// Import from security headers
import {
  SecurityHeadersMiddleware,
  createSecurityHeadersMiddleware,
  createCORSSecurityHeaders,
  auditSecurityHeaders,
  DEFAULT_SECURITY_CONFIG,
  DEVELOPMENT_SECURITY_CONFIG,
  type SecurityHeadersConfig,
  type SecurityHeaderResult
} from './security/headers/security-headers.middleware';

// Import from rate limiting
import {
  RateLimitingMiddleware,
  createRateLimitingMiddleware,
  createRedisRateLimiting,
  createMemoryRateLimiting,
  createPresetRateLimiter,
  MemoryRateLimitStore,
  RedisRateLimitStore,
  RATE_LIMIT_CONFIGS,
  type RateLimitConfig,
  type RateLimitResult,
  type RateLimitInfo,
  type RateLimitStore,
  type RequestContext
} from './security/rate-limiting/rate-limiting.middleware';

// Import from error handling
import {
  ErrorHandlerMiddleware,
  createErrorHandler,
  createDevelopmentErrorHandler,
  createProductionErrorHandler,
  ErrorType,
  ErrorSeverity,
  type ErrorResponse,
  type ErrorContext,
  type ErrorHandlerConfig
} from './error-handling/handlers/error-handler.middleware';

// Import from session management
import {
  SessionMiddleware,
  createSessionMiddleware,
  createHealthcareSession,
  createAdminSession,
  createRedisSession,
  MemorySessionStore,
  RedisSessionStore,
  SESSION_CONFIGS,
  type SessionConfig,
  type SessionData,
  type SessionResult,
  type SessionStore
} from './core/session/session.middleware';

// Import from validation
import {
  ValidationMiddleware,
  createValidationMiddleware,
  createHealthcareValidationMiddleware,
  createAdminValidationMiddleware,
  HEALTHCARE_PATTERNS,
  VALIDATION_CONFIGS,
  HEALTHCARE_VALIDATION_RULES,
  type ValidationRule,
  type ValidationError,
  type ValidationResult,
  type ValidationConfig
} from './core/validation/validation.middleware';

// Import from performance monitoring
import {
  PerformanceMiddleware,
  createPerformanceMiddleware,
  createHealthcarePerformance,
  createProductionPerformance,
  PERFORMANCE_CONFIGS,
  type PerformanceMetrics,
  type PerformanceConfig,
  type PerformanceSummary
} from './monitoring/performance/performance.middleware';

// Import from audit logging
import {
  AuditMiddleware,
  createAuditMiddleware,
  createHealthcareAudit,
  createProductionAudit,
  AuditEventType,
  AuditSeverity,
  AUDIT_CONFIGS,
  type AuditEvent,
  type AuditConfig,
  type AuditSummary
} from './monitoring/audit/audit.middleware';

// Import new error handling middleware
import {
  NotFoundMiddleware,
  createNotFoundMiddleware,
  notFoundHandler,
  type INotFoundConfig,
  DEFAULT_NOT_FOUND_CONFIG
} from './error-handling/not-found/not-found.middleware';

import {
  ValidationErrorMiddleware,
  createValidationErrorMiddleware,
  HealthcareValidators,
  type IValidationErrorConfig,
  type ValidationErrorDetail,
  type ValidationErrorType
} from './error-handling/validation/validation-error.middleware';

// Import new monitoring middleware
import {
  MetricsMiddleware,
  createMetricsMiddleware,
  type IMetricsConfig,
  type MetricData,
  type HealthcareMetricCategory
} from './monitoring/metrics/metrics.middleware';

import {
  TracingMiddleware,
  createTracingMiddleware,
  type ITracingConfig,
  type TraceSpan,
  type SpanContext
} from './monitoring/tracing/tracing.middleware';

// Import new security middleware
import {
  CorsMiddleware,
  createCorsMiddleware,
  type ICorsConfig,
  type CorsMethod
} from './security/cors/cors.middleware';

import {
  CspMiddleware,
  createCspMiddleware,
  HealthcareCSPPolicies,
  CSPNonceGenerator,
  CSPViolationReporter,
  handleCspViolationReport,
  type CSPConfig,
  type CSPDirectives,
  type CSPViolationReport,
  type CSPMetrics
} from './security/csp/csp.middleware';

// Import framework adapters
import {
  ExpressMiddlewareAdapter,
  ExpressRequestWrapper,
  ExpressResponseWrapper,
  ExpressNextWrapper,
  ExpressMiddlewareUtils
} from './adapters/express/express.adapter';

import {
  HapiMiddlewareAdapter,
  HapiRequestWrapper,
  HapiResponseWrapper,
  HapiNextWrapper,
  HapiMiddlewareUtils
} from './adapters/hapi/hapi.adapter';

import {
  BaseFrameworkAdapter,
  HealthcareMiddlewareUtils,
  ResponseUtils,
  RequestValidationUtils
} from './adapters/shared/base.adapter';

// Import utility modules
import {
  RequireRole,
  RequirePermissions,
  AuditLog,
  PHIAccess,
  RateLimit,
  ValidateInput,
  Cache,
  MetadataKeys
} from './utils/decorators/middleware.decorators';

import {
  HealthcarePresets,
  RoleBasedMiddlewareFactory,
  HealthcareWorkflowFactory,
  EnvironmentMiddlewareFactory
} from './utils/factories/middleware.factories';

// ====================
// RE-EXPORT ALL IMPORTS
// ====================

// Authentication exports
export {
  JwtAuthenticationMiddleware,
  createJwtAuthenticationMiddleware,
  type AuthenticationConfig,
  type UserProfile,
  type AuthenticationResult,
  type TokenPayload
};

// Authorization exports
export {
  RbacMiddleware,
  createRbacMiddleware,
  UserRole,
  Permission,
  requireRole,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  type AuthorizationResult,
  type RbacConfig,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS
};

// Security Headers exports
export {
  SecurityHeadersMiddleware,
  createSecurityHeadersMiddleware,
  createCORSSecurityHeaders,
  auditSecurityHeaders,
  DEFAULT_SECURITY_CONFIG,
  DEVELOPMENT_SECURITY_CONFIG,
  type SecurityHeadersConfig,
  type SecurityHeaderResult
};

// Rate Limiting exports
export {
  RateLimitingMiddleware,
  createRateLimitingMiddleware,
  createRedisRateLimiting,
  createMemoryRateLimiting,
  createPresetRateLimiter,
  MemoryRateLimitStore,
  RedisRateLimitStore,
  RATE_LIMIT_CONFIGS,
  type RateLimitConfig,
  type RateLimitResult,
  type RateLimitInfo,
  type RateLimitStore,
  type RequestContext
};

// Error Handling exports
export {
  ErrorHandlerMiddleware,
  createErrorHandler,
  createDevelopmentErrorHandler,
  createProductionErrorHandler,
  ErrorType,
  ErrorSeverity,
  type ErrorResponse,
  type ErrorContext,
  type ErrorHandlerConfig
};

// Session Management exports
export {
  SessionMiddleware,
  createSessionMiddleware,
  createHealthcareSession,
  createAdminSession,
  createRedisSession,
  MemorySessionStore,
  RedisSessionStore,
  SESSION_CONFIGS,
  type SessionConfig,
  type SessionData,
  type SessionResult,
  type SessionStore
};

// Validation exports
export {
  ValidationMiddleware,
  createValidationMiddleware,
  createHealthcareValidationMiddleware,
  createAdminValidationMiddleware,
  HEALTHCARE_PATTERNS,
  VALIDATION_CONFIGS,
  HEALTHCARE_VALIDATION_RULES,
  type ValidationRule,
  type ValidationError,
  type ValidationResult,
  type ValidationConfig
};

// Performance Monitoring exports
export {
  PerformanceMiddleware,
  createPerformanceMiddleware,
  createHealthcarePerformance,
  createProductionPerformance,
  PERFORMANCE_CONFIGS,
  type PerformanceMetrics,
  type PerformanceConfig,
  type PerformanceSummary
};

// Audit Logging exports
export {
  AuditMiddleware,
  createAuditMiddleware,
  createHealthcareAudit,
  createProductionAudit,
  AuditEventType,
  AuditSeverity,
  AUDIT_CONFIGS,
  type AuditEvent,
  type AuditConfig,
  type AuditSummary
};

// New Error Handling exports
export {
  NotFoundMiddleware,
  createNotFoundMiddleware,
  notFoundHandler,
  type INotFoundConfig,
  DEFAULT_NOT_FOUND_CONFIG
};

export {
  ValidationErrorMiddleware,
  createValidationErrorMiddleware,
  HealthcareValidators,
  type IValidationErrorConfig,
  type ValidationErrorDetail,
  type ValidationErrorType
};

// New Monitoring exports
export {
  MetricsMiddleware,
  createMetricsMiddleware,
  type IMetricsConfig,
  type MetricData,
  type HealthcareMetricCategory
};

export {
  TracingMiddleware,
  createTracingMiddleware,
  type ITracingConfig,
  type TraceSpan,
  type SpanContext
};

// New Security exports
export {
  CorsMiddleware,
  createCorsMiddleware,
  type ICorsConfig,
  type CorsMethod
};

export {
  CspMiddleware,
  createCspMiddleware,
  HealthcareCSPPolicies,
  CSPNonceGenerator,
  CSPViolationReporter,
  handleCspViolationReport,
  type CSPConfig,
  type CSPDirectives,
  type CSPViolationReport,
  type CSPMetrics
};

// ====================
// MIDDLEWARE CONFIGURATIONS
// ====================

/**
 * Healthcare platform middleware configurations
 */
export const HEALTHCARE_MIDDLEWARE_CONFIGS = {
  // HIPAA-compliant authentication
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-here',
    jwtAudience: process.env.JWT_AUDIENCE || 'white-cross-healthcare',
    jwtIssuer: process.env.JWT_ISSUER || 'white-cross-platform',
    maxAgeSec: 24 * 60 * 60, // 24 hours
    timeSkewSec: 30 // 30 seconds
  },

  // Healthcare role-based authorization
  authorization: {
    enableHierarchy: true,
    enableAuditLogging: true
  },

  // OWASP-compliant security headers
  securityHeaders: {
    environment: process.env.NODE_ENV as 'development' | 'staging' | 'production',
    enableStackTrace: process.env.NODE_ENV === 'development',
    sanitizePHI: process.env.NODE_ENV !== 'development'
  },

  // Healthcare-specific rate limiting
  rateLimiting: {
    // More restrictive for healthcare data
    auth: RATE_LIMIT_CONFIGS.auth,
    emergencyAlert: RATE_LIMIT_CONFIGS.emergencyAlert,
    export: RATE_LIMIT_CONFIGS.export,
    api: {
      ...RATE_LIMIT_CONFIGS.api,
      maxRequests: 60 // Reduced for healthcare
    }
  },

  // HIPAA-compliant error handling
  errorHandling: {
    environment: process.env.NODE_ENV as 'development' | 'staging' | 'production',
    enableStackTrace: process.env.NODE_ENV === 'development',
    enableDetailedErrors: process.env.NODE_ENV === 'development',
    sanitizePHI: process.env.NODE_ENV !== 'development'
  }
} as const;

/**
 * Development middleware configurations
 */
export const DEVELOPMENT_MIDDLEWARE_CONFIGS = {
  authentication: {
    ...HEALTHCARE_MIDDLEWARE_CONFIGS.authentication,
    maxAgeSec: 8 * 60 * 60 // 8 hours for development
  },
  authorization: {
    ...HEALTHCARE_MIDDLEWARE_CONFIGS.authorization,
    enableAuditLogging: false // Reduce noise in development
  },
  securityHeaders: {
    environment: 'development' as const,
    enableStackTrace: true,
    sanitizePHI: false
  },
  rateLimiting: {
    auth: {
      ...RATE_LIMIT_CONFIGS.auth,
      maxRequests: 20, // More lenient for development
      windowMs: 5 * 60 * 1000 // 5 minutes
    },
    api: {
      ...RATE_LIMIT_CONFIGS.api,
      maxRequests: 1000 // Very lenient for development
    }
  },
  errorHandling: {
    environment: 'development' as const,
    enableStackTrace: true,
    enableDetailedErrors: true,
    sanitizePHI: false
  }
} as const;

/**
 * Production middleware configurations
 */
export const PRODUCTION_MIDDLEWARE_CONFIGS = {
  authentication: {
    ...HEALTHCARE_MIDDLEWARE_CONFIGS.authentication,
    maxAgeSec: 8 * 60 * 60 // 8 hours
  },
  authorization: {
    ...HEALTHCARE_MIDDLEWARE_CONFIGS.authorization,
    enableAuditLogging: true
  },
  securityHeaders: {
    environment: 'production' as const,
    enableStackTrace: false,
    sanitizePHI: true
  },
  rateLimiting: {
    auth: RATE_LIMIT_CONFIGS.auth,
    emergencyAlert: RATE_LIMIT_CONFIGS.emergencyAlert,
    export: RATE_LIMIT_CONFIGS.export,
    api: {
      ...RATE_LIMIT_CONFIGS.api,
      maxRequests: 30 // Strict for production
    }
  },
  errorHandling: {
    environment: 'production' as const,
    enableStackTrace: false,
    enableDetailedErrors: false,
    sanitizePHI: true
  }
} as const;

// ====================
// MIDDLEWARE FACTORIES
// ====================

/**
 * Middleware factory registry interface
 */
export interface MiddlewareFactory {
  authentication: () => JwtAuthenticationMiddleware;
  authorization: () => RbacMiddleware;
  securityHeaders: () => SecurityHeadersMiddleware;
  rateLimiting: (store?: RateLimitStore) => RateLimitingMiddleware;
  errorHandler: () => ErrorHandlerMiddleware;
}

/**
 * Create middleware factory for specific environment
 */
export function createMiddlewareFactory(
  environment: 'development' | 'staging' | 'production' = 'production',
  userLoader?: (userId: string) => Promise<UserProfile | null>
): MiddlewareFactory {
  const config = environment === 'development' 
    ? DEVELOPMENT_MIDDLEWARE_CONFIGS 
    : PRODUCTION_MIDDLEWARE_CONFIGS;

  return {
    authentication: () => {
      if (!userLoader) {
        throw new Error('User loader function is required for authentication middleware');
      }
      
      return createJwtAuthenticationMiddleware({
        ...config.authentication,
        userLoader
      });
    },

    authorization: () => {
      return createRbacMiddleware(config.authorization);
    },

    securityHeaders: () => {
      return createSecurityHeadersMiddleware(config.securityHeaders);
    },

    rateLimiting: (store?: RateLimitStore) => {
      return createRateLimitingMiddleware(store);
    },

    errorHandler: () => {
      return createErrorHandler(config.errorHandling);
    }
  };
}

/**
 * Create healthcare-specific middleware suite
 */
export function createHealthcareMiddleware(
  userLoader: (userId: string) => Promise<UserProfile | null>,
  options?: {
    environment?: 'development' | 'staging' | 'production';
    redisClient?: any;
    customConfigs?: {
      authentication?: Partial<AuthenticationConfig>;
      authorization?: Partial<RbacConfig>;
      securityHeaders?: Partial<SecurityHeadersConfig>;
      errorHandling?: Partial<ErrorHandlerConfig>;
    };
  }
) {
  const env = options?.environment || process.env.NODE_ENV || 'production';
  const factory = createMiddlewareFactory(env as any, userLoader);
  
  // Override with custom configs if provided
  const authMiddleware = factory.authentication();
  const authzMiddleware = factory.authorization();
  const securityMiddleware = factory.securityHeaders();
  const rateLimitMiddleware = factory.rateLimiting(
    options?.redisClient ? new RedisRateLimitStore(options.redisClient) : undefined
  );
  const errorMiddleware = factory.errorHandler();

  return {
    authentication: authMiddleware,
    authorization: authzMiddleware,
    securityHeaders: securityMiddleware,
    rateLimiting: rateLimitMiddleware,
    errorHandler: errorMiddleware,
    
    // Convenience methods for common operations
    authenticateRequest: (authHeader?: string) => authMiddleware.authenticate(authHeader),
    authorizeUser: (user: UserProfile, permission: Permission) => 
      authzMiddleware.authorizePermission(user, permission),
    checkRateLimit: (identifier: string, config: RateLimitConfig, context: RequestContext) =>
      rateLimitMiddleware.checkRateLimit(identifier, config, context),
    handleError: (error: Error, context?: ErrorContext) => 
      errorMiddleware.handleError(error, context),
    applySecurityHeaders: (existingHeaders?: Record<string, string>) =>
      securityMiddleware.applyHeaders(existingHeaders)
  };
}

// ====================
// UTILITY TYPES
// ====================

/**
 * Middleware suite interface
 */
export interface MiddlewareSuite {
  authentication: JwtAuthenticationMiddleware;
  authorization: RbacMiddleware;
  securityHeaders: SecurityHeadersMiddleware;
  rateLimiting: RateLimitingMiddleware;
  errorHandler: ErrorHandlerMiddleware;
}

/**
 * Middleware configuration interface
 */
export interface MiddlewareConfiguration {
  authentication: AuthenticationConfig;
  authorization: RbacConfig;
  securityHeaders: SecurityHeadersConfig;
  errorHandling: ErrorHandlerConfig;
}

// ====================
// CONSTANTS
// ====================

/**
 * Healthcare compliance constants
 */
export const HEALTHCARE_COMPLIANCE = {
  HIPAA_AUDIT_RETENTION_YEARS: 6,
  PHI_ACCESS_LOG_LEVEL: 'info',
  EMERGENCY_RATE_LIMIT_THRESHOLD: 3,
  SESSION_TIMEOUT_MINUTES: 30,
  PASSWORD_COMPLEXITY_MIN_LENGTH: 12
} as const;

/**
 * Security headers for healthcare compliance
 */
export const HEALTHCARE_SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), payment=()',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin'
} as const;

// ====================
// DEFAULT EXPORT
// ====================

// ====================
// FRAMEWORK ADAPTERS
// ====================

// Express adapter exports
export {
  ExpressMiddlewareAdapter,
  ExpressRequestWrapper,
  ExpressResponseWrapper,
  ExpressNextWrapper,
  ExpressMiddlewareUtils
} from './adapters/express/express.adapter';

// Hapi adapter exports
export {
  HapiMiddlewareAdapter,
  HapiRequestWrapper,
  HapiResponseWrapper,
  HapiNextWrapper,
  HapiMiddlewareUtils
} from './adapters/hapi/hapi.adapter';

// Shared adapter utilities
export {
  BaseFrameworkAdapter,
  HealthcareMiddlewareUtils,
  ResponseUtils,
  RequestValidationUtils
} from './adapters/shared/base.adapter';

// ====================
// UTILITY MODULES
// ====================

// Type definitions
export * from './utils/types/middleware.types';

// Decorators
export {
  RequireRole,
  RequirePermissions,
  AuditLog,
  PHIAccess,
  RateLimit,
  ValidateInput,
  Cache,
  MetadataKeys
} from './utils/decorators/middleware.decorators';

// Factory functions
export {
  HealthcarePresets,
  RoleBasedMiddlewareFactory,
  HealthcareWorkflowFactory,
  EnvironmentMiddlewareFactory
} from './utils/factories/middleware.factories';

/**
 * Default middleware configuration for healthcare platforms
 */
export default {
  createMiddlewareFactory,
  createHealthcareMiddleware,
  HEALTHCARE_MIDDLEWARE_CONFIGS,
  DEVELOPMENT_MIDDLEWARE_CONFIGS,
  PRODUCTION_MIDDLEWARE_CONFIGS,
  HEALTHCARE_COMPLIANCE,
  HEALTHCARE_SECURITY_HEADERS,
  
  // Framework adapters
  ExpressMiddlewareAdapter,
  HapiMiddlewareAdapter,
  BaseFrameworkAdapter,
  
  // Utilities
  HealthcareMiddlewareUtils,
  ResponseUtils,
  RequestValidationUtils,
  HealthcarePresets,
  RoleBasedMiddlewareFactory,
  HealthcareWorkflowFactory,
  EnvironmentMiddlewareFactory
};
