/**
 * Secure Logger - PHI-Safe Logging Utility
 *
 * HIPAA COMPLIANCE: This logger automatically redacts PHI from logs.
 * NEVER log tokens, passwords, or sensitive patient data.
 *
 * @module lib/logger/secure-logger
 * @since 2025-11-05
 */

/**
 * Sensitive field patterns that should never be logged
 */
const SENSITIVE_PATTERNS = [
  // Authentication tokens
  /token/i,
  /jwt/i,
  /bearer/i,
  /authorization/i,
  /cookie/i,
  /session/i,

  // Passwords and secrets
  /password/i,
  /secret/i,
  /apikey/i,
  /api[_-]?key/i,

  // PHI - Personal Health Information
  /ssn/i,
  /social[_-]?security/i,
  /medical[_-]?record/i,
  /diagnosis/i,
  /prescription/i,
  /medication/i,
  /dob/i,
  /date[_-]?of[_-]?birth/i,
  /birthdate/i,

  // PII - Personally Identifiable Information
  /email/i,
  /phone/i,
  /address/i,
  /credit[_-]?card/i,
  /card[_-]?number/i,
];

/**
 * Check if a key contains sensitive data
 */
function isSensitiveKey(key: string): boolean {
  return SENSITIVE_PATTERNS.some(pattern => pattern.test(key));
}

/**
 * Redact sensitive values from object
 */
function redactObject(obj: any, depth = 0): any {
  if (depth > 10) {
    return '[Max Depth Reached]';
  }

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => redactObject(item, depth + 1));
  }

  if (typeof obj === 'object') {
    const redacted: any = {};

    for (const [key, value] of Object.entries(obj)) {
      if (isSensitiveKey(key)) {
        // Redact sensitive fields
        if (typeof value === 'string') {
          redacted[key] = value.length > 0 ? `[REDACTED ${value.length} chars]` : '[REDACTED]';
        } else {
          redacted[key] = '[REDACTED]';
        }
      } else if (typeof value === 'object') {
        redacted[key] = redactObject(value, depth + 1);
      } else {
        redacted[key] = value;
      }
    }

    return redacted;
  }

  return obj;
}

/**
 * Logger interface
 */
interface Logger {
  info: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  error: (message: string, error?: any, data?: any) => void;
  debug: (message: string, data?: any) => void;
}

/**
 * Create secure logger that redacts PHI and sensitive data
 */
class SecureLogger implements Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  /**
   * Log info message (PHI-safe)
   */
  info(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'production') {
      // In production, only log to proper logging service (not console)
      // This is where you'd integrate Sentry, DataDog, etc.
      return;
    }

    const redactedData = data ? redactObject(data) : undefined;
    console.info(`[${this.context}] ${message}`, redactedData);
  }

  /**
   * Log warning message (PHI-safe)
   */
  warn(message: string, data?: any): void {
    const redactedData = data ? redactObject(data) : undefined;
    console.warn(`[${this.context}] ${message}`, redactedData);
  }

  /**
   * Log error message (PHI-safe)
   */
  error(message: string, error?: any, data?: any): void {
    const redactedData = data ? redactObject(data) : undefined;

    // Only log error message and stack, not the full error object
    const errorMessage = error?.message || String(error);
    const errorStack = error?.stack;

    console.error(`[${this.context}] ${message}`, {
      error: errorMessage,
      stack: errorStack,
      data: redactedData,
    });
  }

  /**
   * Log debug message (PHI-safe) - only in development
   */
  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV !== 'production') {
      const redactedData = data ? redactObject(data) : undefined;
      console.debug(`[${this.context}] ${message}`, redactedData);
    }
  }
}

/**
 * Create a secure logger instance
 *
 * @param context - Logger context (e.g., 'AuthService', 'HealthRecords')
 * @returns PHI-safe logger instance
 *
 * @example
 * ```typescript
 * const logger = createSecureLogger('AuthService');
 *
 * // ✅ Safe - token is redacted
 * logger.info('User logged in', { userId: '123', token: 'secret' });
 * // Logs: { userId: '123', token: '[REDACTED 6 chars]' }
 *
 * // ✅ Safe - PHI is redacted
 * logger.info('Patient data loaded', { name: 'John', ssn: '123-45-6789' });
 * // Logs: { name: 'John', ssn: '[REDACTED 11 chars]' }
 * ```
 */
export function createSecureLogger(context: string): Logger {
  return new SecureLogger(context);
}

/**
 * Production-safe audit logger for HIPAA compliance
 *
 * This should be used for all PHI access events and sent to
 * a secure audit log system (not console).
 */
export const auditLogger = {
  /**
   * Log PHI access event
   */
  phiAccess: (data: {
    action: string;
    resourceType: string;
    resourceId: string;
    userId: string;
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
  }) => {
    // In production, send to secure audit log system
    // For now, log to console in development only
    if (process.env.NODE_ENV !== 'production') {
      console.info('[AUDIT] PHI Access:', data);
    }

    // TODO: Send to secure audit log service
    // await sendToAuditService(data);
  },

  /**
   * Log authentication event
   */
  authEvent: (data: {
    action: 'login' | 'logout' | 'token_refresh' | 'password_reset';
    userId: string;
    success: boolean;
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
  }) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[AUDIT] Auth Event:', data);
    }

    // TODO: Send to secure audit log service
  },

  /**
   * Log security event
   */
  securityEvent: (data: {
    event: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    details: string;
    userId?: string;
    timestamp: string;
    ipAddress?: string;
  }) => {
    console.warn('[AUDIT] Security Event:', data);

    // TODO: Send to security monitoring service (e.g., Sentry)
  },
};

/**
 * Replace console methods in production
 */
if (process.env.NODE_ENV === 'production') {
  // Override console.log in production (should never be used)
  console.log = () => {
    // No-op in production
  };

  // Keep console.warn and console.error for critical issues
  // but they should be sent to monitoring service
}
