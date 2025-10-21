/**
 * Healthcare Middleware Factories
 * Factory functions for creating middleware instances with healthcare-specific configurations
 * 
 * @fileoverview Factory functions for healthcare middleware creation and configuration
 * @version 1.0.0
 * @author Healthcare Platform Team
 */

import {
  IMiddleware,
  MiddlewareFactory,
  AuthenticationConfig,
  SessionConfig,
  RateLimitConfig,
  SecurityHeadersConfig,
  ValidationConfig,
  AuditConfig,
  PerformanceConfig,
  ErrorHandlingConfig,
  UserRole,
  Permission
} from '../types/middleware.types';

/**
 * Healthcare-specific middleware configuration presets
 */
export const HealthcarePresets = {
  /**
   * HIPAA-compliant authentication configuration
   */
  HIPAA_AUTH: {
    jwtSecret: process.env.JWT_SECRET || 'healthcare-secret-key',
    jwtExpiresIn: '8h', // Healthcare shift length
    issuer: 'healthcare-platform',
    audience: 'healthcare-users',
    algorithms: ['HS256'],
    clockTolerance: 30,
    ignoreExpiration: false,
    maxAge: '8h',
    requireHTTPS: true,
    secureCookie: true
  } as AuthenticationConfig,

  /**
   * HIPAA-compliant session configuration
   */
  HIPAA_SESSION: {
    secret: process.env.SESSION_SECRET || 'healthcare-session-secret',
    name: 'healthcare.sid',
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
    secure: true,
    httpOnly: true,
    sameSite: 'strict' as const,
    store: 'redis' as const,
    concurrentSessions: 3, // Allow multiple devices
    timeoutWarningMinutes: 10
  } as SessionConfig,

  /**
   * Healthcare-specific rate limiting
   */
  HEALTHCARE_RATE_LIMITS: {
    // Emergency access - higher limits
    EMERGENCY: {
      windowMs: 60 * 1000, // 1 minute
      max: 100,
      message: 'Emergency access rate limit exceeded',
      standardHeaders: true,
      legacyHeaders: false,
      store: 'redis' as const
    },
    // PHI export - strict limits
    PHI_EXPORT: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10,
      message: 'PHI export limit exceeded. Contact administrator.',
      standardHeaders: true,
      legacyHeaders: false,
      store: 'redis' as const
    },
    // General API access
    GENERAL: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000,
      message: 'Too many requests',
      standardHeaders: true,
      legacyHeaders: false,
      store: 'memory' as const
    }
  } as Record<string, RateLimitConfig>,

  /**
   * HIPAA-compliant security headers
   */
  HIPAA_SECURITY_HEADERS: {
    contentTypeOptions: true,
    frameOptions: 'DENY' as const,
    xssProtection: true,
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: {
      geolocation: ['none'],
      microphone: ['none'],
      camera: ['none'],
      payment: ['none'],
      usb: ['none']
    },
    csp: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'"],
        'font-src': ["'self'"],
        'object-src': ["'none'"],
        'media-src': ["'self'"],
        'frame-src': ["'none'"]
      },
      reportOnly: false
    }
  } as SecurityHeadersConfig,

  /**
   * Healthcare validation configuration
   */
  HEALTHCARE_VALIDATION: {
    enablePhiDetection: true,
    enableSqlInjectionProtection: true,
    enableXssProtection: true,
    maxRequestSize: '10MB',
    allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    customValidators: {
      medicalRecordNumber: (value: string) => /^[A-Z0-9]{6,12}$/.test(value),
      npiNumber: (value: string) => /^\d{10}$/.test(value),
      icd10Code: (value: string) => /^[A-Z]\d{2}(\.[A-Z0-9]{1,4})?$/.test(value),
      cptCode: (value: string) => /^\d{5}$/.test(value)
    }
  } as ValidationConfig,

  /**
   * HIPAA audit configuration
   */
  HIPAA_AUDIT: {
    enabled: true,
    logLevel: 'info' as const,
    retentionDays: 2190, // 6 years for HIPAA compliance
    includeRequestBody: false, // Protect PHI
    includeResponseBody: false, // Protect PHI
    excludeRoutes: ['/health', '/metrics', '/ping'],
    hipaaCompliant: true,
    storage: 'database' as const,
    batchSize: 100,
    flushInterval: 5000 // 5 seconds
  } as AuditConfig,

  /**
   * Healthcare performance monitoring
   */
  HEALTHCARE_PERFORMANCE: {
    enabled: true,
    slowQueryThreshold: 1000, // 1 second
    memoryThreshold: 0.8, // 80%
    cpuThreshold: 0.8, // 80%
    responseTimeThreshold: 2000, // 2 seconds
    enableTracing: true,
    sampleRate: 0.1, // 10%
    excludeRoutes: ['/health', '/metrics']
  } as PerformanceConfig,

  /**
   * HIPAA error handling
   */
  HIPAA_ERROR_HANDLING: {
    logErrors: true,
    includeStackTrace: false, // Security concern
    hipaaCompliant: true,
    customErrorMessages: {
      'UNAUTHORIZED': 'Access denied. Authentication required.',
      'FORBIDDEN': 'Access denied. Insufficient permissions.',
      'PHI_ACCESS_DENIED': 'Access to protected health information denied.',
      'FACILITY_ACCESS_DENIED': 'Access denied for this facility.',
      'BREAK_GLASS_REQUIRED': 'Emergency access authorization required.'
    },
    notifyOnCriticalErrors: true
  } as ErrorHandlingConfig
};

/**
 * Role-based middleware configuration factory
 */
export class RoleBasedMiddlewareFactory {
  /**
   * Creates role-specific rate limiting configuration
   */
  static createRoleBasedRateLimit(role: UserRole): RateLimitConfig {
    const baseLimits = {
      [UserRole.STUDENT]: { windowMs: 15 * 60 * 1000, max: 100 },
      [UserRole.SCHOOL_NURSE]: { windowMs: 15 * 60 * 1000, max: 500 },
      [UserRole.ADMINISTRATOR]: { windowMs: 15 * 60 * 1000, max: 1000 },
      [UserRole.SYSTEM_ADMIN]: { windowMs: 15 * 60 * 1000, max: 2000 }
    };

    return {
      ...baseLimits[role],
      message: `Rate limit exceeded for ${role}`,
      standardHeaders: true,
      legacyHeaders: false,
      store: 'redis' as const
    };
  }

  /**
   * Creates permission-based validation rules
   */
  static createPermissionBasedValidation(permissions: Permission[]): ValidationConfig {
    const baseConfig = { ...HealthcarePresets.HEALTHCARE_VALIDATION };

    // Add stricter validation for high-privilege operations
    if (permissions.includes(Permission.EXPORT_DATA)) {
      baseConfig.customValidators.dataExportReason = (value: string) => 
        value && value.length >= 20; // Require detailed justification
    }

    if (permissions.includes(Permission.BREAK_GLASS_ACCESS)) {
      baseConfig.customValidators.emergencyJustification = (value: string) =>
        value && value.length >= 50; // Require detailed emergency justification
    }

    return baseConfig;
  }

  /**
   * Creates facility-specific configuration
   */
  static createFacilityConfiguration(facilityId: string, facilityType: 'hospital' | 'clinic' | 'school') {
    const config = {
      facilityId,
      facilityType,
      auditLevel: facilityType === 'hospital' ? 'high' : 'standard',
      rateLimits: facilityType === 'hospital' ? 
        HealthcarePresets.HEALTHCARE_RATE_LIMITS.EMERGENCY :
        HealthcarePresets.HEALTHCARE_RATE_LIMITS.GENERAL
    };

    return config;
  }
}

/**
 * Middleware composition factory for healthcare workflows
 */
export class HealthcareWorkflowFactory {
  /**
   * Creates middleware stack for patient data access
   */
  static createPatientAccessWorkflow(): MiddlewareFactory[] {
    return [
      // Authentication
      (config) => createAuthenticationMiddleware({
        ...HealthcarePresets.HIPAA_AUTH,
        ...config
      }),
      
      // Authorization with PHI permissions
      (config) => createAuthorizationMiddleware({
        requiredPermissions: [Permission.VIEW_STUDENT_HEALTH_RECORDS],
        ...config
      }),
      
      // Rate limiting
      (config) => createRateLimitingMiddleware({
        ...HealthcarePresets.HEALTHCARE_RATE_LIMITS.GENERAL,
        ...config
      }),
      
      // Audit logging
      (config) => createAuditMiddleware({
        ...HealthcarePresets.HIPAA_AUDIT,
        includePHI: true,
        ...config
      }),
      
      // Validation
      (config) => createValidationMiddleware({
        ...HealthcarePresets.HEALTHCARE_VALIDATION,
        ...config
      })
    ];
  }

  /**
   * Creates middleware stack for emergency access
   */
  static createEmergencyAccessWorkflow(): MiddlewareFactory[] {
    return [
      // Emergency authentication (relaxed timing)
      (config) => createAuthenticationMiddleware({
        ...HealthcarePresets.HIPAA_AUTH,
        clockTolerance: 300, // 5 minutes tolerance
        ...config
      }),
      
      // Emergency authorization
      (config) => createAuthorizationMiddleware({
        requiredPermissions: [Permission.EMERGENCY_ACCESS],
        allowBreakGlass: true,
        ...config
      }),
      
      // Higher rate limits for emergencies
      (config) => createRateLimitingMiddleware({
        ...HealthcarePresets.HEALTHCARE_RATE_LIMITS.EMERGENCY,
        ...config
      }),
      
      // Enhanced audit logging
      (config) => createAuditMiddleware({
        ...HealthcarePresets.HIPAA_AUDIT,
        includePHI: true,
        emergencyAccess: true,
        ...config
      })
    ];
  }

  /**
   * Creates middleware stack for administrative functions
   */
  static createAdminWorkflow(): MiddlewareFactory[] {
    return [
      // Strong authentication
      (config) => createAuthenticationMiddleware({
        ...HealthcarePresets.HIPAA_AUTH,
        requireHTTPS: true,
        ...config
      }),
      
      // Admin authorization
      (config) => createAuthorizationMiddleware({
        minimumRole: UserRole.ADMINISTRATOR,
        ...config
      }),
      
      // Standard rate limiting
      (config) => createRateLimitingMiddleware({
        ...HealthcarePresets.HEALTHCARE_RATE_LIMITS.GENERAL,
        ...config
      }),
      
      // Comprehensive audit logging
      (config) => createAuditMiddleware({
        ...HealthcarePresets.HIPAA_AUDIT,
        includeRequestBody: true,
        includeResponseBody: true,
        ...config
      }),
      
      // Input validation
      (config) => createValidationMiddleware({
        ...HealthcarePresets.HEALTHCARE_VALIDATION,
        ...config
      })
    ];
  }
}

/**
 * Environment-specific middleware factory
 */
export class EnvironmentMiddlewareFactory {
  /**
   * Creates development-specific middleware configuration
   */
  static createDevelopmentConfig(): Partial<any> {
    return {
      auth: {
        ...HealthcarePresets.HIPAA_AUTH,
        requireHTTPS: false,
        secureCookie: false
      },
      audit: {
        ...HealthcarePresets.HIPAA_AUDIT,
        includeRequestBody: true,
        includeResponseBody: true
      },
      errorHandling: {
        ...HealthcarePresets.HIPAA_ERROR_HANDLING,
        includeStackTrace: true
      }
    };
  }

  /**
   * Creates production-specific middleware configuration
   */
  static createProductionConfig(): Partial<any> {
    return {
      auth: {
        ...HealthcarePresets.HIPAA_AUTH,
        requireHTTPS: true,
        secureCookie: true
      },
      audit: {
        ...HealthcarePresets.HIPAA_AUDIT,
        includeRequestBody: false,
        includeResponseBody: false
      },
      errorHandling: {
        ...HealthcarePresets.HIPAA_ERROR_HANDLING,
        includeStackTrace: false
      },
      performance: {
        ...HealthcarePresets.HEALTHCARE_PERFORMANCE,
        sampleRate: 0.01 // Reduce sampling in production
      }
    };
  }

  /**
   * Creates testing-specific middleware configuration
   */
  static createTestingConfig(): Partial<any> {
    return {
      auth: {
        ...HealthcarePresets.HIPAA_AUTH,
        jwtExpiresIn: '1h',
        requireHTTPS: false
      },
      rateLimit: {
        ...HealthcarePresets.HEALTHCARE_RATE_LIMITS.GENERAL,
        max: 10000 // Higher limits for testing
      },
      audit: {
        ...HealthcarePresets.HIPAA_AUDIT,
        enabled: false // Disable in tests
      }
    };
  }
}

// Placeholder middleware creation functions (these would import from actual middleware modules)
function createAuthenticationMiddleware(config: AuthenticationConfig): IMiddleware {
  return {
    name: 'authentication',
    version: '1.0.0',
    execute: async (request, response, next, context) => {
      // Implementation would be in the actual authentication middleware
      next.call();
    }
  };
}

function createAuthorizationMiddleware(config: any): IMiddleware {
  return {
    name: 'authorization',
    version: '1.0.0',
    execute: async (request, response, next, context) => {
      // Implementation would be in the actual authorization middleware
      next.call();
    }
  };
}

function createRateLimitingMiddleware(config: RateLimitConfig): IMiddleware {
  return {
    name: 'rate-limiting',
    version: '1.0.0',
    execute: async (request, response, next, context) => {
      // Implementation would be in the actual rate limiting middleware
      next.call();
    }
  };
}

function createAuditMiddleware(config: any): IMiddleware {
  return {
    name: 'audit',
    version: '1.0.0',
    execute: async (request, response, next, context) => {
      // Implementation would be in the actual audit middleware
      next.call();
    }
  };
}

function createValidationMiddleware(config: ValidationConfig): IMiddleware {
  return {
    name: 'validation',
    version: '1.0.0',
    execute: async (request, response, next, context) => {
      // Implementation would be in the actual validation middleware
      next.call();
    }
  };
}

export default {
  HealthcarePresets,
  RoleBasedMiddlewareFactory,
  HealthcareWorkflowFactory,
  EnvironmentMiddlewareFactory
};
