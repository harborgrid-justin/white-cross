/**
 * Validation Error Middleware
 * 
 * Enterprise-grade validation error handling middleware with healthcare compliance.
 * Handles validation errors from request validation, input sanitization, and data validation.
 * 
 * @module ValidationErrorMiddleware
 * @version 1.0.0
 */

import { IRequest, IResponse, IMiddleware, MiddlewareContext, HealthcareUser, INextFunction } from '../../utils/types/middleware.types';

/**
 * Validation error types
 */
export enum ValidationErrorType {
  REQUIRED_FIELD = 'required_field',
  INVALID_FORMAT = 'invalid_format',
  INVALID_LENGTH = 'invalid_length',
  INVALID_TYPE = 'invalid_type',
  INVALID_RANGE = 'invalid_range',
  PHI_DETECTED = 'phi_detected',
  SQL_INJECTION = 'sql_injection',
  XSS_DETECTED = 'xss_detected',
  UNSAFE_FILE_TYPE = 'unsafe_file_type',
  FILE_TOO_LARGE = 'file_too_large',
  INVALID_HEALTHCARE_ID = 'invalid_healthcare_id',
  INVALID_NPI = 'invalid_npi',
  INVALID_ICD_CODE = 'invalid_icd_code'
}

/**
 * Validation error detail interface
 */
export interface ValidationErrorDetail {
  field: string;
  type: ValidationErrorType;
  message: string;
  value?: any;
  constraints?: Record<string, any>;
  suggestion?: string;
}

/**
 * Configuration interface for validation error middleware
 */
export interface IValidationErrorConfig {
  /** Enable detailed error messages in responses */
  enableDetailedErrors: boolean;
  /** Enable healthcare-specific validation */
  enableHealthcareValidation: boolean;
  /** Enable PHI detection and sanitization */
  enablePhiDetection: boolean;
  /** Enable security validation (XSS, SQL injection) */
  enableSecurityValidation: boolean;
  /** Maximum number of errors to include in response */
  maxErrorsInResponse: number;
  /** Enable audit logging for validation failures */
  enableAuditLogging: boolean;
  /** Custom error messages by validation type */
  customErrorMessages: Partial<Record<ValidationErrorType, string>>;
  /** Fields to exclude from error logging (for security) */
  excludeFieldsFromLogs: string[];
  /** Enable rate limiting for validation errors from same IP */
  enableRateLimit: boolean;
  /** Maximum validation errors per IP per window */
  maxErrorsPerWindow: number;
  /** Rate limit window in seconds */
  rateLimitWindow: number;
}

/**
 * Default configuration for validation error middleware
 */
export const DEFAULT_VALIDATION_ERROR_CONFIG: IValidationErrorConfig = {
  enableDetailedErrors: process.env.NODE_ENV !== 'production',
  enableHealthcareValidation: true,
  enablePhiDetection: true,
  enableSecurityValidation: true,
  maxErrorsInResponse: 10,
  enableAuditLogging: true,
  customErrorMessages: {},
  excludeFieldsFromLogs: ['password', 'ssn', 'creditCard', 'bankAccount'],
  enableRateLimit: true,
  maxErrorsPerWindow: 50,
  rateLimitWindow: 300 // 5 minutes
};

/**
 * Validation error context interface
 */
interface ValidationErrorContext {
  requestId: string;
  timestamp: Date;
  userAgent: string;
  clientIP: string;
  user?: HealthcareUser;
  method: string;
  path: string;
  facility?: string | null;
  sessionId?: string | null;
  errors: ValidationErrorDetail[];
}

/**
 * Rate limiter for validation errors
 */
class ValidationErrorRateLimiter {
  private store: Map<string, { count: number; resetTime: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor(private windowMs: number, private maxErrors: number) {
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  public isAllowed(ip: string): boolean {
    const now = Date.now();
    const entry = this.store.get(ip);

    if (!entry || now > entry.resetTime) {
      this.store.set(ip, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (entry.count >= this.maxErrors) {
      return false;
    }

    entry.count++;
    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [ip, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(ip);
      }
    }
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

/**
 * Healthcare-specific validators
 */
export class HealthcareValidators {
  /**
   * Validate NPI (National Provider Identifier) number
   */
  static validateNPI(npi: string): boolean {
    if (!npi || typeof npi !== 'string') return false;
    
    // NPI should be exactly 10 digits
    const npiRegex = /^\d{10}$/;
    if (!npiRegex.test(npi)) return false;

    // Luhn algorithm check for NPI
    const digits = npi.split('').map(Number);
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      let digit = digits[i];
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[9];
  }

  /**
   * Validate ICD-10 code format
   */
  static validateICD10(code: string): boolean {
    if (!code || typeof code !== 'string') return false;
    
    // ICD-10 format: Letter + 2 digits + optional decimal + up to 4 more characters
    const icd10Regex = /^[A-Z]\d{2}(\.\w{1,4})?$/;
    return icd10Regex.test(code.toUpperCase());
  }

  /**
   * Detect potential PHI in text
   */
  static detectPHI(text: string): boolean {
    if (!text || typeof text !== 'string') return false;
    
    // Simple PHI detection patterns
    const phiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/g,           // SSN pattern
      /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, // Credit card pattern
      /\b\d{3}-\d{3}-\d{4}\b/g,           // Phone pattern
      /\b\w+@\w+\.\w+\b/g,                // Email pattern (basic)
      /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g   // Date pattern
    ];
    
    return phiPatterns.some(pattern => pattern.test(text));
  }
}

/**
 * Enterprise validation error middleware with healthcare compliance
 */
export class ValidationErrorMiddleware implements IMiddleware {
  public readonly name = 'ValidationErrorMiddleware';
  public readonly version = '1.0.0';
  
  private rateLimiter?: ValidationErrorRateLimiter;
  private config: IValidationErrorConfig;

  constructor(config: Partial<IValidationErrorConfig> = {}) {
    this.config = { ...DEFAULT_VALIDATION_ERROR_CONFIG, ...config };
    
    if (this.config.enableRateLimit) {
      this.rateLimiter = new ValidationErrorRateLimiter(
        this.config.rateLimitWindow * 1000,
        this.config.maxErrorsPerWindow
      );
    }
  }

  /**
   * Required execute method for IMiddleware interface
   */
  public async execute(
    request: IRequest, 
    response: IResponse, 
    next: INextFunction, 
    _context: MiddlewareContext
  ): Promise<void> {
    try {
      // Validate request based on configuration
      const errors = await this.validateRequest(request);
      
      if (errors.length > 0) {
        await this.handleValidationErrors(request, response, errors);
        return;
      }
      
      // Continue to next middleware if validation passes
      next.call();
    } catch (error) {
      console.error('[ValidationErrorMiddleware] Error during validation:', error);
      next.call(error as Error);
    }
  }

  /**
   * Validate incoming request
   */
  private async validateRequest(req: IRequest): Promise<ValidationErrorDetail[]> {
    const errors: ValidationErrorDetail[] = [];

    // Validate request body
    if (req.body) {
      errors.push(...this.validateObject(req.body, 'body'));
    }

    // Validate query parameters
    if (req.query) {
      errors.push(...this.validateObject(req.query, 'query'));
    }

    // Validate route parameters
    if (req.params) {
      errors.push(...this.validateObject(req.params, 'params'));
    }

    return errors;
  }

  /**
   * Validate object properties
   */
  private validateObject(obj: any, prefix: string): ValidationErrorDetail[] {
    const errors: ValidationErrorDetail[] = [];

    if (!obj || typeof obj !== 'object') {
      return errors;
    }

    for (const [key, value] of Object.entries(obj)) {
      const fieldPath = `${prefix}.${key}`;
      
      // PHI detection
      if (this.config.enablePhiDetection && typeof value === 'string') {
        if (HealthcareValidators.detectPHI(value)) {
          errors.push({
            field: fieldPath,
            type: ValidationErrorType.PHI_DETECTED,
            message: 'Potential PHI detected in field',
            value: '[REDACTED]'
          });
        }
      }

      // Security validation
      if (this.config.enableSecurityValidation && typeof value === 'string') {
        // XSS detection
        if (this.detectXSS(value)) {
          errors.push({
            field: fieldPath,
            type: ValidationErrorType.XSS_DETECTED,
            message: 'Potential XSS attack detected',
            value: '[BLOCKED]'
          });
        }

        // SQL injection detection
        if (this.detectSQLInjection(value)) {
          errors.push({
            field: fieldPath,
            type: ValidationErrorType.SQL_INJECTION,
            message: 'Potential SQL injection detected',
            value: '[BLOCKED]'
          });
        }
      }

      // Healthcare-specific validation
      if (this.config.enableHealthcareValidation) {
        errors.push(...this.validateHealthcareField(fieldPath, key, value));
      }
    }

    return errors;
  }

  /**
   * Validate healthcare-specific fields
   */
  private validateHealthcareField(fieldPath: string, fieldName: string, value: any): ValidationErrorDetail[] {
    const errors: ValidationErrorDetail[] = [];

    if (typeof value !== 'string') return errors;

    // NPI validation
    if (fieldName.toLowerCase().includes('npi') && !HealthcareValidators.validateNPI(value)) {
      errors.push({
        field: fieldPath,
        type: ValidationErrorType.INVALID_NPI,
        message: 'Invalid NPI number format',
        value,
        suggestion: 'NPI must be exactly 10 digits and pass Luhn validation'
      });
    }

    // ICD code validation
    if (fieldName.toLowerCase().includes('icd') && !HealthcareValidators.validateICD10(value)) {
      errors.push({
        field: fieldPath,
        type: ValidationErrorType.INVALID_ICD_CODE,
        message: 'Invalid ICD-10 code format',
        value,
        suggestion: 'ICD-10 codes should follow format: Letter + 2 digits + optional decimal + up to 4 characters'
      });
    }

    return errors;
  }

  /**
   * Detect potential XSS attacks
   */
  private detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Detect potential SQL injection
   */
  private detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(union|select|insert|delete|update|drop|create|alter|exec)\b)/gi,
      /(\b(or|and)\s+\d+\s*=\s*\d+)/gi,
      /('\s*(or|and)\s+')/gi,
      /(;|\||&)/g
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Handle validation errors
   */
  private async handleValidationErrors(
    req: IRequest, 
    res: IResponse, 
    errors: ValidationErrorDetail[]
  ): Promise<void> {
    const context = this.createContext(req, errors);
    
    // Check rate limiting
    if (this.rateLimiter && !this.rateLimiter.isAllowed(context.clientIP)) {
      await this.handleRateLimitExceeded(res, context);
      return;
    }

    // Log validation errors for audit
    if (this.config.enableAuditLogging) {
      await this.logValidationErrors(context);
    }

    // Send validation error response
    await this.sendValidationErrorResponse(res, context, errors);
  }

  /**
   * Create context for validation error handling
   */
  private createContext(req: IRequest, errors: ValidationErrorDetail[]): ValidationErrorContext {
    const user = req.user as HealthcareUser | undefined;
    
    return {
      requestId: req.headers['x-request-id'] as string || this.generateRequestId(),
      timestamp: new Date(),
      userAgent: req.headers['user-agent'] as string || 'Unknown',
      clientIP: this.getClientIP(req),
      user,
      method: req.method || 'POST',
      path: req.path || req.url || '/',
      facility: user?.facilityId || null,
      sessionId: req.sessionId || null,
      errors
    };
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Extract client IP address
   */
  private getClientIP(req: IRequest): string {
    return (
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.headers['x-real-ip']?.toString() ||
      req.ip ||
      'unknown'
    );
  }

  /**
   * Log validation errors for audit
   */
  private async logValidationErrors(context: ValidationErrorContext): Promise<void> {
    const sanitizedErrors = context.errors.map(error => ({
      ...error,
      value: this.config.excludeFieldsFromLogs.some(field => 
        error.field.toLowerCase().includes(field.toLowerCase())
      ) ? '[REDACTED]' : error.value
    }));

    const logEntry = {
      event: 'VALIDATION_ERROR',
      requestId: context.requestId,
      timestamp: context.timestamp.toISOString(),
      method: context.method,
      path: context.path,
      userAgent: context.userAgent,
      clientIP: context.clientIP,
      userId: context.user?.userId || null,
      facilityId: context.facility || null,
      sessionId: context.sessionId,
      errorCount: context.errors.length,
      errors: sanitizedErrors,
      severity: this.calculateSeverity(context.errors),
      category: 'INPUT_VALIDATION'
    };

    console.log('[AUDIT] Validation Error:', JSON.stringify(logEntry));
  }

  /**
   * Calculate severity based on error types
   */
  private calculateSeverity(errors: ValidationErrorDetail[]): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const hasSecurityErrors = errors.some(error => 
      [ValidationErrorType.XSS_DETECTED, ValidationErrorType.SQL_INJECTION, ValidationErrorType.PHI_DETECTED]
        .includes(error.type)
    );

    if (hasSecurityErrors) return 'HIGH';
    if (errors.length > 5) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Handle rate limit exceeded
   */
  private async handleRateLimitExceeded(res: IResponse, context: ValidationErrorContext): Promise<void> {
    const logEntry = {
      event: 'VALIDATION_ERROR_RATE_LIMIT_EXCEEDED',
      requestId: context.requestId,
      timestamp: context.timestamp.toISOString(),
      clientIP: context.clientIP,
      severity: 'HIGH',
      category: 'RATE_LIMITING'
    };

    console.log('[SECURITY] Validation Error Rate Limit Exceeded:', JSON.stringify(logEntry));

    res.setStatus(429).json({
      error: 'Too Many Requests',
      message: 'Too many validation errors from this IP address',
      timestamp: context.timestamp.toISOString(),
      requestId: context.requestId
    });
  }

  /**
   * Send validation error response
   */
  private async sendValidationErrorResponse(
    res: IResponse, 
    context: ValidationErrorContext,
    errors: ValidationErrorDetail[]
  ): Promise<void> {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');

    // Limit errors in response
    const responseErrors = errors
      .slice(0, this.config.maxErrorsInResponse)
      .map(error => this.formatErrorForResponse(error));

    const response = {
      error: 'Validation Failed',
      message: 'Request validation failed',
      timestamp: context.timestamp.toISOString(),
      requestId: context.requestId,
      errors: responseErrors,
      totalErrors: errors.length
    };

    // Add additional details if configured
    if (this.config.enableDetailedErrors) {
      response.errors = errors.map(error => this.formatDetailedError(error));
    }

    res.setStatus(400).json(response);
  }

  /**
   * Format error for response (with security considerations)
   */
  private formatErrorForResponse(error: ValidationErrorDetail): any {
    const baseError = {
      field: error.field,
      type: error.type,
      message: this.config.customErrorMessages[error.type] || error.message
    };

    // Only include value and suggestion if detailed errors are enabled
    if (this.config.enableDetailedErrors) {
      return {
        ...baseError,
        suggestion: error.suggestion
      };
    }

    return baseError;
  }

  /**
   * Format detailed error (development mode)
   */
  private formatDetailedError(error: ValidationErrorDetail): any {
    return {
      field: error.field,
      type: error.type,
      message: error.message,
      value: error.value,
      constraints: error.constraints,
      suggestion: error.suggestion
    };
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.rateLimiter) {
      this.rateLimiter.destroy();
    }
  }
}

/**
 * Factory function to create validation error middleware with healthcare defaults
 */
export function createValidationErrorMiddleware(
  config: Partial<IValidationErrorConfig> = {}
): ValidationErrorMiddleware {
  const healthcareConfig: Partial<IValidationErrorConfig> = {
    enableDetailedErrors: false,    // Disable in production
    enableHealthcareValidation: true,
    enablePhiDetection: true,       // Critical for HIPAA compliance
    enableSecurityValidation: true, // Prevent attacks
    enableAuditLogging: true,       // Required for compliance
    maxErrorsInResponse: 5,         // Limit info disclosure
    excludeFieldsFromLogs: ['password', 'ssn', 'creditCard', 'bankAccount', 'medicalRecord'],
    ...config
  };

  return new ValidationErrorMiddleware(healthcareConfig);
}

export default ValidationErrorMiddleware;
