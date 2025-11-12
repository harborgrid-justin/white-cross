/**
 * Security Configuration Manager
 *
 * Handles security configuration access and management
 */

import type {
  CSPDirectives,
  SecurityHeaders,
  CORSConfig,
  RateLimitConfig,
  SessionConfig,
  PasswordPolicy,
  AuditConfig,
  UploadConfig,
  PHIPatterns,
} from './types';

export class SecurityConfigManager {
  private readonly cspDirectives: CSPDirectives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': ["'self'", process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'object-src': ["'none'"],
    'upgrade-insecure-requests': [],
  };

  private readonly securityHeaders: SecurityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Content-Security-Policy': this.generateCSPHeader(),
  };

  private readonly corsConfig: CORSConfig = {
    allowedOrigins: process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    credentials: true,
    maxAge: 86400,
  };

  private readonly rateLimitConfig: RateLimitConfig = {
    general: { windowMs: 15 * 60 * 1000, max: 100 },
    auth: { windowMs: 15 * 60 * 1000, max: 5 },
    phi: { windowMs: 60 * 1000, max: 60 },
  };

  private readonly sessionConfig: SessionConfig = {
    idleTimeout: 15 * 60 * 1000,
    warningTime: 2 * 60 * 1000,
    maxDuration: 24 * 60 * 60 * 1000,
    refreshInterval: 50 * 60 * 1000,
    activityCheckInterval: 30 * 1000,
  };

  private readonly passwordPolicy: PasswordPolicy = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    specialChars: '@$!%*?&',
    maxLength: 128,
    preventCommonPasswords: true,
    preventUserInfo: true,
  };

  private readonly auditConfig: AuditConfig = {
    enabled: true,
    retentionDays: 2557,
    batchSize: 50,
    batchInterval: 5000,
    localStorageLimit: 100,
    logPHIAccess: true,
    logAuth: true,
    logAuthz: true,
    logSystem: true,
  };

  private readonly uploadConfig: UploadConfig = {
    maxFileSize: 10 * 1024 * 1024,
    allowedTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    virusScanEnabled: true,
    encryptAtRest: true,
  };

  private readonly phiPatterns: PHIPatterns = {
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    mrn: /\bMRN[:\s]?\d+\b/gi,
    dob: /\b(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}\b/g,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  };

  /**
   * Generate CSP header value
   */
  private generateCSPHeader(): string {
    return Object.entries(this.cspDirectives)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ');
  }

  /**
   * Get CSP header
   */
  getCSPHeader(): string {
    return this.generateCSPHeader();
  }

  /**
   * Get security headers
   */
  getSecurityHeaders(): SecurityHeaders {
    return { ...this.securityHeaders };
  }

  /**
   * Get CORS configuration
   */
  getCORSConfig(): CORSConfig {
    return { ...this.corsConfig };
  }

  /**
   * Get rate limiting configuration
   */
  getRateLimitConfig(): RateLimitConfig {
    return { ...this.rateLimitConfig };
  }

  /**
   * Get session configuration
   */
  getSessionConfig(): SessionConfig {
    return { ...this.sessionConfig };
  }

  /**
   * Get password policy
   */
  getPasswordPolicy(): PasswordPolicy {
    return { ...this.passwordPolicy };
  }

  /**
   * Get audit configuration
   */
  getAuditConfig(): AuditConfig {
    return { ...this.auditConfig };
  }

  /**
   * Get upload configuration
   */
  getUploadConfig(): UploadConfig {
    return { ...this.uploadConfig };
  }

  /**
   * Get PHI patterns
   */
  getPHIPatterns(): PHIPatterns {
    return { ...this.phiPatterns };
  }

  /**
   * Get CSP directives
   */
  getCSPDirectives(): CSPDirectives {
    return { ...this.cspDirectives };
  }

  /**
   * Update configuration (for runtime configuration)
   */
  updateConfig(updates: {
    cors?: Partial<CORSConfig>;
    rateLimit?: Partial<RateLimitConfig>;
    session?: Partial<SessionConfig>;
    audit?: Partial<AuditConfig>;
  }): void {
    if (updates.cors) {
      Object.assign(this.corsConfig, updates.cors);
    }
    if (updates.rateLimit) {
      Object.assign(this.rateLimitConfig, updates.rateLimit);
    }
    if (updates.session) {
      Object.assign(this.sessionConfig, updates.session);
    }
    if (updates.audit) {
      Object.assign(this.auditConfig, updates.audit);
    }
  }
}