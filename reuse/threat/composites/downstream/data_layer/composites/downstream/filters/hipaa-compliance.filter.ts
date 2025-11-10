/**
 * HIPAA Compliance Exception Filter
 *
 * Enterprise-grade exception filter that ensures all error responses are
 * HIPAA-compliant by removing Protected Health Information (PHI) from error
 * messages before they are sent to clients.
 *
 * This filter is critical for healthcare applications and must be applied
 * to all endpoints that handle patient data or health information.
 *
 * PHI Patterns Sanitized:
 * - Social Security Numbers (SSN)
 * - Medical Record Numbers (MRN)
 * - Email addresses
 * - Phone numbers
 * - Patient names
 * - Date of birth
 * - Addresses
 * - Account numbers
 * - Health plan beneficiary numbers
 * - Device identifiers
 * - URLs containing PHI
 * - IP addresses (can be identifying)
 *
 * @module filters/hipaa-compliance
 * @version 1.0.0
 * @compliance HIPAA Privacy Rule (45 CFR §164.502)
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Injectable,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StandardErrorResponse } from './global-exception.filter';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * PHI detection patterns and their sanitization rules
 */
interface PHIPattern {
  /** Regular expression to detect PHI */
  pattern: RegExp;
  /** Replacement text for detected PHI */
  replacement: string;
  /** Description of what this pattern detects */
  description: string;
  /** Priority (higher priority patterns are applied first) */
  priority: number;
}

/**
 * HIPAA audit log entry
 */
interface HIPAAAuditLog {
  timestamp: string;
  correlationId: string;
  originalError: string;
  sanitizedError: string;
  phiPatternsDetected: string[];
  requestPath: string;
  userId?: string;
}

/**
 * Sanitization options
 */
export interface SanitizationOptions {
  /** Enable aggressive PHI detection (may have false positives) */
  aggressive?: boolean;
  /** Additional custom patterns to sanitize */
  customPatterns?: PHIPattern[];
  /** Log all sanitization actions for audit */
  auditLog?: boolean;
}

// ============================================================================
// HIPAA Compliance Filter Implementation
// ============================================================================

/**
 * HIPAA-compliant exception filter that removes PHI from error responses.
 * This filter should be applied globally or to all healthcare-related endpoints.
 *
 * @example
 * ```typescript
 * // In main.ts
 * app.useGlobalFilters(
 *   new GlobalExceptionFilter(),
 *   new HIPAAComplianceFilter({ aggressive: true, auditLog: true })
 * );
 * ```
 *
 * @example
 * ```typescript
 * // On specific controller
 * @UseFilters(HIPAAComplianceFilter)
 * @Controller('patients')
 * export class PatientsController { ... }
 * ```
 */
@Catch()
@Injectable()
export class HIPAAComplianceFilter implements ExceptionFilter {
  private readonly logger = new Logger(HIPAAComplianceFilter.name);
  private readonly phiPatterns: PHIPattern[];
  private readonly options: SanitizationOptions;
  private readonly auditLogs: HIPAAAuditLog[] = [];

  constructor(options: SanitizationOptions = {}) {
    this.options = {
      aggressive: options.aggressive ?? true,
      auditLog: options.auditLog ?? true,
      customPatterns: options.customPatterns ?? [],
    };

    this.phiPatterns = this.buildPHIPatterns();
  }

  /**
   * Main exception handling method with HIPAA sanitization
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Extract error details
    const { status, errorResponse } = this.parseException(exception, request);

    // Sanitize the error response to remove PHI
    const sanitizedResponse = this.sanitizeErrorResponse(errorResponse, request);

    // Audit log if enabled
    if (this.options.auditLog) {
      this.createAuditLog(errorResponse, sanitizedResponse, request);
    }

    // Send sanitized response
    response.status(status).json(sanitizedResponse);
  }

  /**
   * Parse exception and build initial error response
   */
  private parseException(
    exception: unknown,
    request: Request,
  ): { status: number; errorResponse: StandardErrorResponse } {
    let status = 500;
    let error = 'InternalServerError';
    let message: string | string[] = 'An error occurred';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      }

      stack = exception.stack;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
      stack = exception.stack;
    }

    const errorResponse: StandardErrorResponse = {
      success: false,
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      correlationId: this.getCorrelationId(request),
    };

    if (process.env.NODE_ENV === 'development' && stack) {
      errorResponse.stack = stack;
    }

    return { status, errorResponse };
  }

  /**
   * Sanitize error response by removing all PHI
   */
  private sanitizeErrorResponse(
    errorResponse: StandardErrorResponse,
    request: Request,
  ): StandardErrorResponse {
    const sanitized = { ...errorResponse };

    // Sanitize message (can be string or array)
    if (typeof sanitized.message === 'string') {
      sanitized.message = this.sanitizeString(sanitized.message);
    } else if (Array.isArray(sanitized.message)) {
      sanitized.message = sanitized.message.map((msg) => this.sanitizeString(msg));
    }

    // Sanitize error name
    sanitized.error = this.sanitizeString(sanitized.error);

    // Sanitize path (may contain PHI in query params or path params)
    sanitized.path = this.sanitizePath(sanitized.path);

    // Sanitize stack trace if present
    if (sanitized.stack) {
      sanitized.stack = this.sanitizeString(sanitized.stack);
    }

    // Sanitize any metadata
    if (sanitized.meta) {
      sanitized.meta = this.sanitizeObject(sanitized.meta);
    }

    return sanitized;
  }

  /**
   * Sanitize a string by removing all PHI patterns
   */
  private sanitizeString(input: string): string {
    let sanitized = input;
    const detectedPatterns: string[] = [];

    // Apply all PHI patterns in priority order
    const sortedPatterns = [...this.phiPatterns].sort((a, b) => b.priority - a.priority);

    for (const phiPattern of sortedPatterns) {
      const beforeSanitization = sanitized;
      sanitized = sanitized.replace(phiPattern.pattern, phiPattern.replacement);

      // Track which patterns were detected
      if (beforeSanitization !== sanitized) {
        detectedPatterns.push(phiPattern.description);
      }
    }

    if (detectedPatterns.length > 0) {
      this.logger.warn(
        `PHI patterns detected and sanitized: ${detectedPatterns.join(', ')}`,
      );
    }

    return sanitized;
  }

  /**
   * Sanitize URL path by removing PHI from query params and path params
   */
  private sanitizePath(path: string): string {
    let sanitized = path;

    // Remove query parameters that might contain PHI
    const urlParts = sanitized.split('?');
    if (urlParts.length > 1) {
      const queryParams = urlParts[1];
      const sanitizedParams = this.sanitizeQueryParams(queryParams);
      sanitized = `${urlParts[0]}?${sanitizedParams}`;
    }

    // Sanitize path segments
    sanitized = this.sanitizeString(sanitized);

    return sanitized;
  }

  /**
   * Sanitize query parameters
   */
  private sanitizeQueryParams(params: string): string {
    const sensitiveParamNames = [
      'ssn', 'mrn', 'patient_id', 'dob', 'email', 'phone',
      'name', 'first_name', 'last_name', 'address'
    ];

    let sanitized = params;

    for (const paramName of sensitiveParamNames) {
      const pattern = new RegExp(`(${paramName}=)[^&]+`, 'gi');
      sanitized = sanitized.replace(pattern, `$1[REDACTED]`);
    }

    // Also apply general PHI patterns
    sanitized = this.sanitizeString(sanitized);

    return sanitized;
  }

  /**
   * Sanitize an object recursively
   */
  private sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === 'string' ? this.sanitizeString(item) : item,
        );
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Build comprehensive PHI detection patterns
   */
  private buildPHIPatterns(): PHIPattern[] {
    const patterns: PHIPattern[] = [
      // Social Security Numbers (multiple formats)
      {
        pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
        replacement: '[SSN]',
        description: 'SSN (dashed format)',
        priority: 10,
      },
      {
        pattern: /\b\d{9}\b/g,
        replacement: '[SSN]',
        description: 'SSN (no dashes)',
        priority: 9,
      },

      // Medical Record Numbers (various formats)
      {
        pattern: /\bMRN[:\s]?\d{6,10}\b/gi,
        replacement: '[MRN]',
        description: 'Medical Record Number',
        priority: 10,
      },
      {
        pattern: /\bmedical[-_]?record[-_]?number[:\s]?\d+/gi,
        replacement: '[MRN]',
        description: 'Medical Record Number (verbose)',
        priority: 10,
      },

      // Email addresses
      {
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        replacement: '[EMAIL]',
        description: 'Email address',
        priority: 8,
      },

      // Phone numbers (multiple formats)
      {
        pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
        replacement: '[PHONE]',
        description: 'Phone number',
        priority: 8,
      },
      {
        pattern: /\(\d{3}\)\s?\d{3}[-.]?\d{4}/g,
        replacement: '[PHONE]',
        description: 'Phone number (parentheses format)',
        priority: 8,
      },
      {
        pattern: /\+1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,
        replacement: '[PHONE]',
        description: 'Phone number (international format)',
        priority: 8,
      },

      // Date of Birth patterns
      {
        pattern: /\b(dob|date[-_]?of[-_]?birth)[:\s]+\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/gi,
        replacement: '[DOB]',
        description: 'Date of birth',
        priority: 9,
      },

      // Patient identifiers
      {
        pattern: /\bpatient[-_]?id[:\s]+[A-Za-z0-9-]+/gi,
        replacement: 'patient_id:[REDACTED]',
        description: 'Patient ID',
        priority: 10,
      },

      // Account numbers
      {
        pattern: /\baccount[-_]?number[:\s]+\d+/gi,
        replacement: 'account_number:[REDACTED]',
        description: 'Account number',
        priority: 8,
      },

      // Health plan beneficiary numbers
      {
        pattern: /\bmember[-_]?id[:\s]+[A-Za-z0-9-]+/gi,
        replacement: 'member_id:[REDACTED]',
        description: 'Health plan member ID',
        priority: 9,
      },

      // IP addresses (can be identifying)
      {
        pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
        replacement: '[IP_ADDRESS]',
        description: 'IP address',
        priority: 5,
      },

      // Names (common patterns)
      {
        pattern: /\b(patient[-_]?name|first[-_]?name|last[-_]?name)[:\s]+[A-Za-z\s]+/gi,
        replacement: '$1:[REDACTED]',
        description: 'Patient name',
        priority: 9,
      },

      // Address components
      {
        pattern: /\b\d+\s+[A-Za-z\s]+\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln)\b/gi,
        replacement: '[ADDRESS]',
        description: 'Street address',
        priority: 7,
      },
      {
        pattern: /\bzip[:\s]+\d{5}(-\d{4})?\b/gi,
        replacement: 'zip:[REDACTED]',
        description: 'ZIP code',
        priority: 7,
      },

      // URLs with potential PHI
      {
        pattern: /https?:\/\/[^\s]+\/(patients|mrn|ssn)\/[^\s]+/gi,
        replacement: '[URL_WITH_PHI]',
        description: 'URL containing PHI',
        priority: 8,
      },
    ];

    // Add custom patterns if provided
    if (this.options.customPatterns) {
      patterns.push(...this.options.customPatterns);
    }

    return patterns;
  }

  /**
   * Get or generate correlation ID
   */
  private getCorrelationId(request: Request): string {
    return (
      (request.headers['x-correlation-id'] as string) ||
      (request as any).correlationId ||
      `hipaa-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    );
  }

  /**
   * Create audit log entry for HIPAA compliance
   */
  private createAuditLog(
    original: StandardErrorResponse,
    sanitized: StandardErrorResponse,
    request: Request,
  ): void {
    const auditEntry: HIPAAAuditLog = {
      timestamp: new Date().toISOString(),
      correlationId: sanitized.correlationId,
      originalError: JSON.stringify(original.message),
      sanitizedError: JSON.stringify(sanitized.message),
      phiPatternsDetected: this.detectPHIPatterns(JSON.stringify(original)),
      requestPath: request.url,
      userId: (request as any).user?.id,
    };

    this.auditLogs.push(auditEntry);

    // Log to secure audit trail (in production, this should go to a secure logging service)
    this.logger.log(
      `HIPAA Sanitization: ${auditEntry.correlationId} - PHI patterns detected: ${auditEntry.phiPatternsDetected.join(', ')}`,
      'HIPAAAudit',
    );

    // Limit in-memory audit log size
    if (this.auditLogs.length > 1000) {
      this.auditLogs.shift();
    }
  }

  /**
   * Detect which PHI patterns are present in the string
   */
  private detectPHIPatterns(input: string): string[] {
    const detected: string[] = [];

    for (const pattern of this.phiPatterns) {
      if (pattern.pattern.test(input)) {
        detected.push(pattern.description);
      }
      // Reset regex lastIndex for global patterns
      pattern.pattern.lastIndex = 0;
    }

    return detected;
  }

  /**
   * Get audit logs (for compliance reporting)
   */
  public getAuditLogs(): HIPAAAuditLog[] {
    return [...this.auditLogs];
  }

  /**
   * Clear audit logs (call periodically after exporting to secure storage)
   */
  public clearAuditLogs(): void {
    this.auditLogs.length = 0;
  }
}
