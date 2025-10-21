/**
 * LOC: 3835B8CB7D
 * WC-MID-ERR-045 | Framework-Agnostic HIPAA-Compliant Error Handler & Sequelize Error Management
 *
 * UPSTREAM (imports from):
 *   - utils/logger (logging utilities)
 *
 * DOWNSTREAM (imported by):
 *   - adapters/hapi/error-handler.adapter.ts
 *   - adapters/express/error-handler.adapter.ts
 */

/**
 * WC-MID-ERR-045 | Framework-Agnostic HIPAA-Compliant Error Handler & Sequelize Error Management
 * Purpose: Centralized error handling, PHI protection, Sequelize error mapping
 * Upstream: utils/logger, @hapi/boom, sequelize validation errors
 * Downstream: All routes and services | Called by: Framework-specific adapters
 * Related: utils/logger.ts, monitoring/audit/*, database/models/*
 * Exports: ErrorHandlerMiddleware class | Key Services: Error sanitization, logging
 * Last Updated: 2025-10-21 | Dependencies: Framework-agnostic
 * Critical Path: Error detection → Classification → Sanitization → Response
 * LLM Context: HIPAA compliance, prevents PHI leakage, detailed audit logging
 */

/**
 * Framework-agnostic Error Handler Middleware with Sequelize Error Support
 *
 * HIPAA Compliance: Ensures error messages don't leak PHI while maintaining
 * detailed logging for security audits and debugging.
 *
 * Security: Sanitizes error messages in production to prevent information disclosure.
 */

import { logger } from '../../../utils/logger';

/**
 * Error classification types
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  SYSTEM = 'SYSTEM',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * Standardized error response interface
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    type: ErrorType;
    severity: ErrorSeverity;
    details?: any;
    timestamp: string;
    requestId?: string;
    traceId?: string;
  };
}

/**
 * Error context interface
 */
export interface ErrorContext {
  requestId?: string;
  traceId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
  method?: string;
  timestamp?: number;
}

/**
 * Error handler configuration
 */
export interface ErrorHandlerConfig {
  environment?: 'development' | 'staging' | 'production';
  enableStackTrace?: boolean;
  enableDetailedErrors?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  sanitizePHI?: boolean;
  customErrorCodes?: Record<string, string>;
}

/**
 * Sequelize error interfaces (to avoid direct dependency)
 */
interface SequelizeValidationError extends Error {
  name: 'SequelizeValidationError';
  errors: Array<{
    message: string;
    type: string;
    path: string;
    value: any;
  }>;
}

interface SequelizeUniqueConstraintError extends Error {
  name: 'SequelizeUniqueConstraintError';
  errors: Array<{
    message: string;
    path: string;
    value: any;
  }>;
}

interface SequelizeForeignKeyConstraintError extends Error {
  name: 'SequelizeForeignKeyConstraintError';
  table: string;
  fields: Record<string, any>;
}

interface SequelizeConnectionError extends Error {
  name: 'SequelizeConnectionError';
  parent: Error;
}

interface SequelizeTimeoutError extends Error {
  name: 'SequelizeTimeoutError';
  sql: string;
}

interface SequelizeDatabaseError extends Error {
  name: 'SequelizeDatabaseError';
  sql: string;
  parameters?: any[];
}

/**
 * Default error handler configuration
 */
const DEFAULT_CONFIG: ErrorHandlerConfig = {
  environment: 'production',
  enableStackTrace: false,
  enableDetailedErrors: false,
  logLevel: 'error',
  sanitizePHI: true,
  customErrorCodes: {}
};

/**
 * Development error handler configuration
 */
const DEVELOPMENT_CONFIG: ErrorHandlerConfig = {
  environment: 'development',
  enableStackTrace: true,
  enableDetailedErrors: true,
  logLevel: 'debug',
  sanitizePHI: false,
  customErrorCodes: {}
};

/**
 * Error Handler Middleware Class
 */
export class ErrorHandlerMiddleware {
  private config: ErrorHandlerConfig;

  constructor(config?: ErrorHandlerConfig) {
    const env = config?.environment || process.env.NODE_ENV || 'production';
    const defaultConfig = env === 'development' ? DEVELOPMENT_CONFIG : DEFAULT_CONFIG;
    
    this.config = {
      ...defaultConfig,
      ...config
    };
  }

  /**
   * Classify error type and severity
   */
  private classifyError(error: Error): { type: ErrorType; severity: ErrorSeverity } {
    const errorName = error.name;
    const errorMessage = error.message.toLowerCase();

    // Authentication errors
    if (errorName.includes('Authentication') || errorMessage.includes('unauthorized')) {
      return { type: ErrorType.AUTHENTICATION, severity: ErrorSeverity.MEDIUM };
    }

    // Authorization errors
    if (errorName.includes('Authorization') || errorMessage.includes('forbidden')) {
      return { type: ErrorType.AUTHORIZATION, severity: ErrorSeverity.MEDIUM };
    }

    // Validation errors
    if (errorName.includes('Validation') || errorMessage.includes('invalid')) {
      return { type: ErrorType.VALIDATION, severity: ErrorSeverity.LOW };
    }

    // Rate limiting errors
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
      return { type: ErrorType.RATE_LIMIT, severity: ErrorSeverity.MEDIUM };
    }

    // Not found errors
    if (errorMessage.includes('not found') || errorName.includes('NotFound')) {
      return { type: ErrorType.NOT_FOUND, severity: ErrorSeverity.LOW };
    }

    // Database errors
    if (errorName.includes('Sequelize') || errorName.includes('Database')) {
      return { type: ErrorType.DATABASE, severity: ErrorSeverity.HIGH };
    }

    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return { type: ErrorType.NETWORK, severity: ErrorSeverity.HIGH };
    }

    // System errors
    if (errorMessage.includes('internal') || errorName.includes('System')) {
      return { type: ErrorType.SYSTEM, severity: ErrorSeverity.CRITICAL };
    }

    return { type: ErrorType.UNKNOWN, severity: ErrorSeverity.MEDIUM };
  }

  /**
   * Sanitize error message to remove PHI
   */
  private sanitizeErrorMessage(message: string): string {
    if (!this.config.sanitizePHI) {
      return message;
    }

    // Common PHI patterns to sanitize
    const phiPatterns = [
      // Email addresses
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      // Phone numbers
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      // SSN patterns
      /\b\d{3}-?\d{2}-?\d{4}\b/g,
      // Credit card patterns
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
      // Medical record numbers (simple pattern)
      /\bMRN[-:\s]*\d+\b/gi,
      // Common sensitive field names with values
      /\b(password|ssn|social|credit|card|dob|birthdate)[\s=:]+[^\s,}]+/gi
    ];

    let sanitized = message;

    phiPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    return sanitized;
  }

  /**
   * Generate error code based on error type and details
   */
  private generateErrorCode(error: Error, type: ErrorType): string {
    const prefix = type.substring(0, 3).toUpperCase();
    
    // Use custom error codes if available
    if (this.config.customErrorCodes?.[error.name]) {
      return this.config.customErrorCodes[error.name];
    }

    // Generate standard error codes
    switch (type) {
      case ErrorType.VALIDATION:
        return `${prefix}_VALIDATION_FAILED`;
      case ErrorType.AUTHENTICATION:
        return `${prefix}_AUTH_FAILED`;
      case ErrorType.AUTHORIZATION:
        return `${prefix}_ACCESS_DENIED`;
      case ErrorType.NOT_FOUND:
        return `${prefix}_NOT_FOUND`;
      case ErrorType.RATE_LIMIT:
        return `${prefix}_RATE_LIMIT_EXCEEDED`;
      case ErrorType.DATABASE:
        return `${prefix}_DATABASE_ERROR`;
      case ErrorType.NETWORK:
        return `${prefix}_NETWORK_ERROR`;
      case ErrorType.BUSINESS_LOGIC:
        return `${prefix}_BUSINESS_ERROR`;
      case ErrorType.SYSTEM:
        return `${prefix}_SYSTEM_ERROR`;
      default:
        return `${prefix}_UNKNOWN_ERROR`;
    }
  }

  /**
   * Handle Sequelize validation errors
   */
  private handleSequelizeValidationError(error: SequelizeValidationError, context: ErrorContext): ErrorResponse {
    const sanitizedErrors = error.errors.map(err => ({
      field: err.path,
      message: this.sanitizeErrorMessage(err.message),
      type: err.type
    }));

    logger.warn('Sequelize validation error', {
      errors: sanitizedErrors,
      userId: context.userId,
      requestId: context.requestId,
      path: context.path
    });

    return {
      success: false,
      error: {
        code: 'VAL_VALIDATION_FAILED',
        message: 'Validation failed',
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.LOW,
        details: this.config.enableDetailedErrors ? sanitizedErrors : undefined,
        timestamp: new Date().toISOString(),
        requestId: context.requestId,
        traceId: context.traceId
      }
    };
  }

  /**
   * Handle Sequelize unique constraint errors
   */
  private handleSequelizeUniqueConstraintError(error: SequelizeUniqueConstraintError, context: ErrorContext): ErrorResponse {
    const fields = error.errors.map(err => err.path).join(', ');

    logger.warn('Sequelize unique constraint violation', {
      fields,
      userId: context.userId,
      requestId: context.requestId,
      path: context.path
    });

    return {
      success: false,
      error: {
        code: 'DAT_UNIQUE_CONSTRAINT_VIOLATION',
        message: `A record with the provided ${fields} already exists`,
        type: ErrorType.DATABASE,
        severity: ErrorSeverity.MEDIUM,
        timestamp: new Date().toISOString(),
        requestId: context.requestId,
        traceId: context.traceId
      }
    };
  }

  /**
   * Handle Sequelize foreign key constraint errors
   */
  private handleSequelizeForeignKeyConstraintError(error: SequelizeForeignKeyConstraintError, context: ErrorContext): ErrorResponse {
    logger.error('Sequelize foreign key constraint violation', {
      table: error.table,
      fields: error.fields,
      userId: context.userId,
      requestId: context.requestId,
      path: context.path
    });

    return {
      success: false,
      error: {
        code: 'DAT_FOREIGN_KEY_CONSTRAINT_VIOLATION',
        message: 'Invalid reference to related data',
        type: ErrorType.DATABASE,
        severity: ErrorSeverity.MEDIUM,
        timestamp: new Date().toISOString(),
        requestId: context.requestId,
        traceId: context.traceId
      }
    };
  }

  /**
   * Handle Sequelize connection errors
   */
  private handleSequelizeConnectionError(error: SequelizeConnectionError, context: ErrorContext): ErrorResponse {
    logger.error('Sequelize connection error', {
      error: error.parent?.message || error.message,
      userId: context.userId,
      requestId: context.requestId,
      path: context.path
    });

    return {
      success: false,
      error: {
        code: 'DAT_CONNECTION_ERROR',
        message: 'Database connection error. Please try again later.',
        type: ErrorType.DATABASE,
        severity: ErrorSeverity.CRITICAL,
        timestamp: new Date().toISOString(),
        requestId: context.requestId,
        traceId: context.traceId
      }
    };
  }

  /**
   * Handle Sequelize timeout errors
   */
  private handleSequelizeTimeoutError(error: SequelizeTimeoutError, context: ErrorContext): ErrorResponse {
    logger.error('Sequelize timeout error', {
      sql: this.config.enableDetailedErrors ? error.sql : 'SQL query',
      userId: context.userId,
      requestId: context.requestId,
      path: context.path
    });

    return {
      success: false,
      error: {
        code: 'DAT_TIMEOUT_ERROR',
        message: 'Request timed out. Please try again.',
        type: ErrorType.DATABASE,
        severity: ErrorSeverity.HIGH,
        timestamp: new Date().toISOString(),
        requestId: context.requestId,
        traceId: context.traceId
      }
    };
  }

  /**
   * Handle generic Sequelize database errors
   */
  private handleSequelizeDatabaseError(error: SequelizeDatabaseError, context: ErrorContext): ErrorResponse {
    logger.error('Sequelize database error', {
      sql: this.config.enableDetailedErrors ? error.sql : 'SQL query',
      parameters: this.config.enableDetailedErrors ? error.parameters : undefined,
      userId: context.userId,
      requestId: context.requestId,
      path: context.path
    });

    return {
      success: false,
      error: {
        code: 'DAT_DATABASE_ERROR',
        message: this.config.enableDetailedErrors 
          ? `Database error: ${this.sanitizeErrorMessage(error.message)}`
          : 'A database error occurred',
        type: ErrorType.DATABASE,
        severity: ErrorSeverity.HIGH,
        details: this.config.enableDetailedErrors ? {
          sql: error.sql,
          parameters: error.parameters
        } : undefined,
        timestamp: new Date().toISOString(),
        requestId: context.requestId,
        traceId: context.traceId
      }
    };
  }

  /**
   * Handle standard errors
   */
  private handleStandardError(error: Error, context: ErrorContext): ErrorResponse {
    const { type, severity } = this.classifyError(error);
    const errorCode = this.generateErrorCode(error, type);
    const sanitizedMessage = this.sanitizeErrorMessage(error.message);

    // Log based on severity
    const logData = {
      errorCode,
      errorType: type,
      severity,
      message: sanitizedMessage,
      stack: this.config.enableStackTrace ? error.stack : undefined,
      userId: context.userId,
      requestId: context.requestId,
      path: context.path,
      method: context.method,
      ip: context.ip
    };

    switch (severity) {
      case ErrorSeverity.CRITICAL:
        logger.error('Critical error occurred', logData);
        break;
      case ErrorSeverity.HIGH:
        logger.error('High severity error occurred', logData);
        break;
      case ErrorSeverity.MEDIUM:
        logger.warn('Medium severity error occurred', logData);
        break;
      default:
        logger.info('Low severity error occurred', logData);
        break;
    }

    return {
      success: false,
      error: {
        code: errorCode,
        message: this.config.enableDetailedErrors ? sanitizedMessage : 'An error occurred',
        type,
        severity,
        details: this.config.enableDetailedErrors && this.config.enableStackTrace ? {
          stack: error.stack
        } : undefined,
        timestamp: new Date().toISOString(),
        requestId: context.requestId,
        traceId: context.traceId
      }
    };
  }

  /**
   * Main error handling method
   */
  handleError(error: Error, context: ErrorContext = {}): ErrorResponse {
    // Add timestamp to context
    context.timestamp = context.timestamp || Date.now();

    // Handle specific Sequelize errors
    switch (error.name) {
      case 'SequelizeValidationError':
        return this.handleSequelizeValidationError(error as SequelizeValidationError, context);
      
      case 'SequelizeUniqueConstraintError':
        return this.handleSequelizeUniqueConstraintError(error as SequelizeUniqueConstraintError, context);
      
      case 'SequelizeForeignKeyConstraintError':
        return this.handleSequelizeForeignKeyConstraintError(error as SequelizeForeignKeyConstraintError, context);
      
      case 'SequelizeConnectionError':
        return this.handleSequelizeConnectionError(error as SequelizeConnectionError, context);
      
      case 'SequelizeTimeoutError':
        return this.handleSequelizeTimeoutError(error as SequelizeTimeoutError, context);
      
      case 'SequelizeDatabaseError':
        return this.handleSequelizeDatabaseError(error as SequelizeDatabaseError, context);
      
      default:
        return this.handleStandardError(error, context);
    }
  }

  /**
   * Handle HTTP status code errors
   */
  handleHttpError(statusCode: number, message?: string, context: ErrorContext = {}): ErrorResponse {
    let type: ErrorType;
    let severity: ErrorSeverity;
    let defaultMessage: string;

    switch (statusCode) {
      case 400:
        type = ErrorType.VALIDATION;
        severity = ErrorSeverity.LOW;
        defaultMessage = 'Bad Request';
        break;
      case 401:
        type = ErrorType.AUTHENTICATION;
        severity = ErrorSeverity.MEDIUM;
        defaultMessage = 'Unauthorized';
        break;
      case 403:
        type = ErrorType.AUTHORIZATION;
        severity = ErrorSeverity.MEDIUM;
        defaultMessage = 'Forbidden';
        break;
      case 404:
        type = ErrorType.NOT_FOUND;
        severity = ErrorSeverity.LOW;
        defaultMessage = 'Not Found';
        break;
      case 429:
        type = ErrorType.RATE_LIMIT;
        severity = ErrorSeverity.MEDIUM;
        defaultMessage = 'Too Many Requests';
        break;
      case 500:
        type = ErrorType.SYSTEM;
        severity = ErrorSeverity.CRITICAL;
        defaultMessage = 'Internal Server Error';
        break;
      default:
        type = ErrorType.UNKNOWN;
        severity = ErrorSeverity.MEDIUM;
        defaultMessage = 'Unknown Error';
    }

    const errorCode = `HTTP_${statusCode}`;
    const finalMessage = message || defaultMessage;

    const logMethod = severity === ErrorSeverity.CRITICAL ? 'error' : 'warn';
    logger[logMethod](`HTTP ${statusCode} error`, {
      statusCode,
      message: finalMessage,
      type,
      severity,
      userId: context.userId,
      requestId: context.requestId,
      path: context.path
    });

    return {
      success: false,
      error: {
        code: errorCode,
        message: this.sanitizeErrorMessage(finalMessage),
        type,
        severity,
        timestamp: new Date().toISOString(),
        requestId: context.requestId,
        traceId: context.traceId
      }
    };
  }

  /**
   * Get HTTP status code from error response
   */
  getHttpStatusCode(errorResponse: ErrorResponse): number {
    switch (errorResponse.error.type) {
      case ErrorType.VALIDATION:
        return 400;
      case ErrorType.AUTHENTICATION:
        return 401;
      case ErrorType.AUTHORIZATION:
        return 403;
      case ErrorType.NOT_FOUND:
        return 404;
      case ErrorType.RATE_LIMIT:
        return 429;
      case ErrorType.DATABASE:
        return 500;
      case ErrorType.SYSTEM:
        return 500;
      default:
        return 500;
    }
  }

  /**
   * Create factory method
   */
  static create(config?: ErrorHandlerConfig): ErrorHandlerMiddleware {
    return new ErrorHandlerMiddleware(config);
  }
}

/**
 * Factory function for creating error handler middleware
 */
export function createErrorHandler(config?: ErrorHandlerConfig): ErrorHandlerMiddleware {
  return ErrorHandlerMiddleware.create(config);
}

/**
 * Create development error handler
 */
export function createDevelopmentErrorHandler(): ErrorHandlerMiddleware {
  return new ErrorHandlerMiddleware(DEVELOPMENT_CONFIG);
}

/**
 * Create production error handler
 */
export function createProductionErrorHandler(): ErrorHandlerMiddleware {
  return new ErrorHandlerMiddleware(DEFAULT_CONFIG);
}

/**
 * Default export
 */
export default ErrorHandlerMiddleware;
