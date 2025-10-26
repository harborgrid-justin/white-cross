/**
 * Security Configuration
 *
 * Centralized security configuration for the application
 * including CSP, CORS, rate limiting, and HIPAA compliance settings.
 *
 * @module lib/security/config
 */

/**
 * Content Security Policy (CSP) Configuration
 */
export const CSP_DIRECTIVES = {
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

/**
 * Generate CSP header value
 */
export function generateCSPHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

/**
 * Security Headers Configuration
 */
export const SECURITY_HEADERS = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // XSS Protection
  'X-XSS-Protection': '1; mode=block',

  // MIME type sniffing prevention
  'X-Content-Type-Options': 'nosniff',

  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions Policy
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',

  // HSTS (HTTP Strict Transport Security)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Content Security Policy
  'Content-Security-Policy': generateCSPHeader(),
};

/**
 * CORS Configuration
 */
export const CORS_CONFIG = {
  allowedOrigins: process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

/**
 * Rate Limiting Configuration
 */
export const RATE_LIMIT_CONFIG = {
  // General API requests
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
  },

  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per window
  },

  // PHI access endpoints
  phi: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
  },
};

/**
 * Session Configuration (HIPAA Compliant)
 */
export const SESSION_CONFIG = {
  // Idle timeout (15 minutes for HIPAA)
  idleTimeout: 15 * 60 * 1000,

  // Session warning time (2 minutes before expiry)
  warningTime: 2 * 60 * 1000,

  // Maximum session duration (24 hours)
  maxDuration: 24 * 60 * 60 * 1000,

  // Token refresh interval (50 minutes)
  refreshInterval: 50 * 60 * 1000,

  // Activity check interval (30 seconds)
  activityCheckInterval: 30 * 1000,
};

/**
 * Password Policy Configuration
 */
export const PASSWORD_POLICY = {
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

/**
 * Audit Logging Configuration
 */
export const AUDIT_CONFIG = {
  // Enable audit logging
  enabled: true,

  // Log retention period (7 years for HIPAA)
  retentionDays: 2557, // ~7 years

  // Batch size for log transmission
  batchSize: 50,

  // Batch interval (5 seconds)
  batchInterval: 5000,

  // Local storage limit
  localStorageLimit: 100,

  // PHI access logging (always enabled for HIPAA)
  logPHIAccess: true,

  // Authentication logging
  logAuth: true,

  // Authorization logging
  logAuthz: true,

  // System event logging
  logSystem: true,
};

/**
 * File Upload Configuration
 */
export const UPLOAD_CONFIG = {
  // Maximum file size (10MB)
  maxFileSize: 10 * 1024 * 1024,

  // Allowed file types
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],

  // Virus scanning enabled
  virusScanEnabled: true,

  // Encrypt files at rest
  encryptAtRest: true,
};

/**
 * PHI Detection Patterns
 */
export const PHI_PATTERNS = {
  // Social Security Number
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,

  // Medical Record Number
  mrn: /\bMRN[:\s]?\d+\b/gi,

  // Date of Birth
  dob: /\b(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}\b/g,

  // Phone Number
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,

  // Email
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
};

/**
 * Check if data contains PHI
 */
export function containsPHI(data: string): boolean {
  if (typeof data !== 'string') return false;

  return Object.values(PHI_PATTERNS).some(pattern => pattern.test(data));
}

/**
 * Redact PHI from data
 */
export function redactPHI(data: string): string {
  if (typeof data !== 'string') return data;

  let redacted = data;

  // Redact SSN
  redacted = redacted.replace(PHI_PATTERNS.ssn, '***-**-****');

  // Redact MRN
  redacted = redacted.replace(PHI_PATTERNS.mrn, 'MRN:****');

  // Redact DOB
  redacted = redacted.replace(PHI_PATTERNS.dob, '**/**/****');

  // Redact phone
  redacted = redacted.replace(PHI_PATTERNS.phone, '***-***-****');

  // Redact email
  redacted = redacted.replace(PHI_PATTERNS.email, '****@****.***');

  return redacted;
}
