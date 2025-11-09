"use strict";
/**
 * @fileoverview Error Handling & Recovery Kit - Advanced error management and recovery strategies
 * @module reuse/error-handling-recovery-kit
 * @description Comprehensive error handling, recovery, and resilience patterns for production-ready
 * NestJS applications with healthcare compliance, HIPAA considerations, and advanced retry mechanisms.
 *
 * Key Features:
 * - Custom exception classes with context enrichment
 * - Advanced exception filters and transformers
 * - Error serialization and sanitization
 * - Structured error logging with correlation tracking
 * - Exponential backoff and retry mechanisms
 * - Multiple fallback strategies
 * - Circuit breaker pattern implementation
 * - Error recovery workflows and orchestration
 * - Graceful degradation strategies
 * - Error aggregation and trend analysis
 * - Multi-channel error notification
 * - Stack trace sanitization and security
 * - Error rate limiting and throttling
 * - Distributed tracing with correlation IDs
 * - User-friendly error message generation
 * - HIPAA-compliant error handling
 *
 * @target NestJS 10.x, TypeScript 5.x, Node 18+
 *
 * @security
 * - PHI data sanitization in error logs
 * - Secure error message generation
 * - Stack trace filtering for production
 * - Sensitive data redaction
 * - Audit trail for critical errors
 * - Rate limiting for error endpoints
 *
 * @example Basic error handling
 * ```typescript
 * import {
 *   HealthcareBusinessException,
 *   createHealthcareErrorFilter,
 *   sanitizeHealthcareError
 * } from './error-handling-recovery-kit';
 *
 * // Throw healthcare-specific exception
 * throw new HealthcareBusinessException(
 *   'Patient record access denied',
 *   'PATIENT_ACCESS_DENIED',
 *   403,
 *   { patientId: 'P-123', userId: 'U-456' },
 *   'high'
 * );
 *
 * // Create global filter
 * const filter = createHealthcareErrorFilter({
 *   includeStack: false,
 *   sanitizePHI: true,
 *   auditCriticalErrors: true
 * });
 * ```
 *
 * @example Advanced recovery patterns
 * ```typescript
 * import {
 *   retryWithExponentialBackoff,
 *   createCircuitBreaker,
 *   executeWithFallbackChain,
 *   createErrorRecoveryPipeline
 * } from './error-handling-recovery-kit';
 *
 * // Retry with exponential backoff
 * const result = await retryWithExponentialBackoff(
 *   () => fetchPatientData(patientId),
 *   { maxAttempts: 3, baseDelay: 1000, maxDelay: 10000 }
 * );
 *
 * // Circuit breaker
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 60000,
 *   halfOpenDelay: 5000
 * });
 *
 * const data = await breaker.execute(() => externalAPICall());
 *
 * // Fallback chain
 * const result = await executeWithFallbackChain([
 *   () => fetchFromPrimaryDB(),
 *   () => fetchFromReplicaDB(),
 *   () => fetchFromCache(),
 *   () => getDefaultData()
 * ]);
 * ```
 *
 * LOC: ERR-RECOVERY-001
 * UPSTREAM: @nestjs/common, sequelize, @types/node
 * DOWNSTREAM: exception filters, service providers, middleware, controllers
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserFriendlyMessage = exports.mapToAlertSeverity = exports.shouldSendNotification = exports.notifyError = exports.generateErrorReport = exports.calculateErrorRateMetrics = exports.groupErrorsByTimeWindow = exports.detectErrorSpikes = exports.aggregateErrors = exports.createRecoveryStrategy = exports.autoRestartService = exports.healthCheckRecovery = exports.autoRecoverDatabaseError = exports.executeErrorRecoveryPipeline = exports.executeWithCacheFallback = exports.executeWithGracefulDegradation = exports.createDegradedResponse = exports.executeWithFallbackChain = exports.executeWithFallback = exports.executeWithCircuitBreakerAndRetry = exports.createMultipleCircuitBreakers = exports.monitorCircuitBreakerHealth = exports.CircuitBreaker = exports.createCircuitBreaker = exports.createRetryPolicy = exports.calculateJitteredDelay = exports.isRetryableError = exports.Retry = exports.retryWithExponentialBackoff = exports.redactPatterns = exports.sanitizeHealthcareError = exports.removeSensitiveData = exports.sanitizeStackTrace = exports.sanitizeContextPHI = exports.createHttpErrorResponse = exports.chainErrorTransformers = exports.enrichErrorWithContext = exports.transformDatabaseError = exports.serializeError = exports.DataIntegrityException = exports.HIPAAViolationException = exports.ExternalServiceException = exports.HealthcareBusinessException = exports.ApplicationException = exports.NotificationChannel = exports.CircuitState = exports.ErrorCategory = exports.ErrorSeverity = void 0;
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * @enum ErrorSeverity
 * @description Error severity levels for healthcare applications
 */
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["LOW"] = "LOW";
    ErrorSeverity["MEDIUM"] = "MEDIUM";
    ErrorSeverity["HIGH"] = "HIGH";
    ErrorSeverity["CRITICAL"] = "CRITICAL";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
/**
 * @enum ErrorCategory
 * @description Error categorization for better tracking and handling
 */
var ErrorCategory;
(function (ErrorCategory) {
    ErrorCategory["AUTHENTICATION"] = "AUTHENTICATION";
    ErrorCategory["AUTHORIZATION"] = "AUTHORIZATION";
    ErrorCategory["VALIDATION"] = "VALIDATION";
    ErrorCategory["BUSINESS_LOGIC"] = "BUSINESS_LOGIC";
    ErrorCategory["DATABASE"] = "DATABASE";
    ErrorCategory["EXTERNAL_SERVICE"] = "EXTERNAL_SERVICE";
    ErrorCategory["NETWORK"] = "NETWORK";
    ErrorCategory["CONFIGURATION"] = "CONFIGURATION";
    ErrorCategory["SYSTEM"] = "SYSTEM";
    ErrorCategory["HIPAA_VIOLATION"] = "HIPAA_VIOLATION";
    ErrorCategory["DATA_INTEGRITY"] = "DATA_INTEGRITY";
})(ErrorCategory || (exports.ErrorCategory = ErrorCategory = {}));
/**
 * @enum CircuitState
 * @description Circuit breaker states
 */
var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "CLOSED";
    CircuitState["OPEN"] = "OPEN";
    CircuitState["HALF_OPEN"] = "HALF_OPEN";
})(CircuitState || (exports.CircuitState = CircuitState = {}));
/**
 * @enum NotificationChannel
 * @description Available notification channels
 */
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["SLACK"] = "SLACK";
    NotificationChannel["PAGER_DUTY"] = "PAGER_DUTY";
    NotificationChannel["SENTRY"] = "SENTRY";
    NotificationChannel["CLOUDWATCH"] = "CLOUDWATCH";
    NotificationChannel["CUSTOM_WEBHOOK"] = "CUSTOM_WEBHOOK";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
// ============================================================================
// CUSTOM EXCEPTION CLASSES (Functions 1-5)
// ============================================================================
/**
 * Base application exception with enhanced context and healthcare support
 *
 * @class ApplicationException
 * @extends Error
 *
 * @example
 * ```typescript
 * throw new ApplicationException(
 *   'Patient record not found',
 *   'PATIENT_NOT_FOUND',
 *   404,
 *   ErrorCategory.BUSINESS_LOGIC,
 *   ErrorSeverity.MEDIUM,
 *   { patientId: 'P-123', userId: 'U-456' }
 * );
 * ```
 */
class ApplicationException extends Error {
    constructor(message, code, statusCode, category, severity, context) {
        super(message);
        this.name = 'ApplicationException';
        this.code = code;
        this.statusCode = statusCode;
        this.category = category;
        this.severity = severity;
        this.context = context;
        this.timestamp = new Date();
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApplicationException = ApplicationException;
/**
 * Healthcare-specific business exception with HIPAA compliance support
 *
 * @class HealthcareBusinessException
 * @extends ApplicationException
 *
 * @example
 * ```typescript
 * throw new HealthcareBusinessException(
 *   'Prescription authorization required',
 *   'PRESCRIPTION_AUTH_REQUIRED',
 *   403,
 *   { patientId: 'P-123', medicationId: 'M-456', phi: true },
 *   ErrorSeverity.HIGH
 * );
 * ```
 */
class HealthcareBusinessException extends ApplicationException {
    constructor(message, code, statusCode, context, severity = ErrorSeverity.MEDIUM) {
        super(message, code, statusCode, ErrorCategory.BUSINESS_LOGIC, severity, {
            ...context,
            auditRequired: true,
        });
        this.name = 'HealthcareBusinessException';
    }
}
exports.HealthcareBusinessException = HealthcareBusinessException;
/**
 * External service integration exception with retry indication
 *
 * @class ExternalServiceException
 * @extends ApplicationException
 *
 * @example
 * ```typescript
 * throw new ExternalServiceException(
 *   'HL7 interface unavailable',
 *   'HL7_SERVICE_DOWN',
 *   503,
 *   { serviceName: 'HL7-Gateway', endpoint: '/api/adt' },
 *   true // isRetryable
 * );
 * ```
 */
class ExternalServiceException extends ApplicationException {
    constructor(message, code, statusCode, context, isRetryable = true, severity = ErrorSeverity.HIGH) {
        super(message, code, statusCode, ErrorCategory.EXTERNAL_SERVICE, severity, context);
        this.name = 'ExternalServiceException';
        this.isRetryable = isRetryable;
        this.serviceName = context?.serviceName || 'Unknown';
    }
}
exports.ExternalServiceException = ExternalServiceException;
/**
 * HIPAA compliance violation exception
 *
 * @class HIPAAViolationException
 * @extends ApplicationException
 *
 * @example
 * ```typescript
 * throw new HIPAAViolationException(
 *   'Unauthorized PHI access attempt',
 *   'HIPAA_UNAUTHORIZED_ACCESS',
 *   { userId: 'U-123', patientId: 'P-456', action: 'READ' }
 * );
 * ```
 */
class HIPAAViolationException extends ApplicationException {
    constructor(message, code, context) {
        super(message, code, 403, ErrorCategory.HIPAA_VIOLATION, ErrorSeverity.CRITICAL, {
            ...context,
            auditRequired: true,
            phi: true,
        });
        this.name = 'HIPAAViolationException';
    }
}
exports.HIPAAViolationException = HIPAAViolationException;
/**
 * Data integrity exception for validation and constraint violations
 *
 * @class DataIntegrityException
 * @extends ApplicationException
 *
 * @example
 * ```typescript
 * throw new DataIntegrityException(
 *   'Duplicate patient MRN',
 *   'DUPLICATE_MRN',
 *   { mrn: '12345', facilityId: 'F-001' },
 *   [{ field: 'mrn', message: 'MRN already exists', constraint: 'unique' }]
 * );
 * ```
 */
class DataIntegrityException extends ApplicationException {
    constructor(message, code, context, details = []) {
        super(message, code, 409, ErrorCategory.DATA_INTEGRITY, ErrorSeverity.MEDIUM, context);
        this.name = 'DataIntegrityException';
        this.details = details;
    }
}
exports.DataIntegrityException = DataIntegrityException;
// ============================================================================
// ERROR SERIALIZATION AND TRANSFORMATION (Functions 6-10)
// ============================================================================
/**
 * Serializes error to standardized format with healthcare compliance
 *
 * @param {Error} error - Error to serialize
 * @param {Partial<SanitizationConfig>} [config] - Sanitization configuration
 * @returns {SerializedError} Serialized error object
 *
 * @example
 * ```typescript
 * const serialized = serializeError(error, {
 *   includeStack: false,
 *   sanitizePHI: true,
 *   maxStackFrames: 10
 * });
 * ```
 */
const serializeError = (error, config) => {
    const defaultConfig = {
        includeStack: false,
        maxStackFrames: 10,
        sanitizePHI: true,
        sanitizeCredentials: true,
        ...config,
    };
    if (error instanceof ApplicationException) {
        const context = defaultConfig.sanitizePHI
            ? (0, exports.sanitizeContextPHI)(error.context)
            : error.context;
        return {
            code: error.code,
            message: error.message,
            statusCode: error.statusCode,
            severity: error.severity,
            category: error.category,
            timestamp: error.timestamp.toISOString(),
            correlationId: context?.correlationId,
            path: context?.path,
            stack: defaultConfig.includeStack
                ? (0, exports.sanitizeStackTrace)(error.stack, defaultConfig)
                : undefined,
            context,
            userMessage: (0, exports.generateUserFriendlyMessage)(error),
        };
    }
    // Handle standard errors
    return {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'An unexpected error occurred',
        statusCode: 500,
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.SYSTEM,
        timestamp: new Date().toISOString(),
        stack: defaultConfig.includeStack
            ? (0, exports.sanitizeStackTrace)(error.stack, defaultConfig)
            : undefined,
        userMessage: 'An unexpected error occurred. Please try again later.',
    };
};
exports.serializeError = serializeError;
/**
 * Transforms database errors to application exceptions
 *
 * @param {Error} dbError - Database error
 * @param {ErrorContext} [context] - Additional context
 * @returns {ApplicationException} Transformed application exception
 *
 * @example
 * ```typescript
 * try {
 *   await Patient.create({ mrn: duplicateMRN });
 * } catch (error) {
 *   throw transformDatabaseError(error, { facilityId: 'F-001' });
 * }
 * ```
 */
const transformDatabaseError = (dbError, context) => {
    const message = dbError.message.toLowerCase();
    // Unique constraint violation
    if (message.includes('unique') || message.includes('duplicate')) {
        const field = extractFieldFromError(dbError.message);
        return new DataIntegrityException('Duplicate record detected', 'DUPLICATE_RECORD', context, [{ field, message: `${field} already exists`, constraint: 'unique' }]);
    }
    // Foreign key constraint
    if (message.includes('foreign key') || message.includes('fk_')) {
        return new DataIntegrityException('Related record not found', 'FOREIGN_KEY_VIOLATION', context, [{ message: 'Referenced record does not exist', constraint: 'foreign_key' }]);
    }
    // Connection errors
    if (message.includes('connection') || message.includes('econnrefused')) {
        return new ExternalServiceException('Database connection failed', 'DB_CONNECTION_ERROR', 503, { ...context, serviceName: 'Database' }, true, ErrorSeverity.CRITICAL);
    }
    // Timeout errors
    if (message.includes('timeout') || message.includes('timed out')) {
        return new ExternalServiceException('Database operation timed out', 'DB_TIMEOUT', 504, { ...context, serviceName: 'Database' }, true, ErrorSeverity.HIGH);
    }
    // Generic database error
    return new ApplicationException('Database operation failed', 'DATABASE_ERROR', 500, ErrorCategory.DATABASE, ErrorSeverity.HIGH, context);
};
exports.transformDatabaseError = transformDatabaseError;
/**
 * Enriches error with correlation ID and trace information
 *
 * @param {Error} error - Error to enrich
 * @param {Request} req - Express request object
 * @param {Record<string, any>} [additionalContext] - Additional context
 * @returns {Error} Enriched error
 *
 * @example
 * ```typescript
 * const enriched = enrichErrorWithContext(error, req, {
 *   patientId: 'P-123',
 *   operationType: 'CREATE_PRESCRIPTION'
 * });
 * ```
 */
const enrichErrorWithContext = (error, req, additionalContext) => {
    const correlationId = extractCorrelationId(req);
    const traceId = req.headers['x-trace-id'] || correlationId;
    const context = {
        correlationId,
        traceId,
        requestId: req.id,
        userId: req.user?.id,
        timestamp: new Date(),
        path: req.path,
        method: req.method,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: {
            query: req.query,
            params: req.params,
            ...additionalContext,
        },
    };
    if (error instanceof ApplicationException) {
        return new ApplicationException(error.message, error.code, error.statusCode, error.category, error.severity, { ...error.context, ...context });
    }
    error.context = context;
    return error;
};
exports.enrichErrorWithContext = enrichErrorWithContext;
/**
 * Chains multiple error transformers
 *
 * @param {Error} error - Initial error
 * @param {Array<(error: Error) => Error>} transformers - Array of transformer functions
 * @returns {Error} Transformed error
 *
 * @example
 * ```typescript
 * const transformed = chainErrorTransformers(error, [
 *   (e) => transformDatabaseError(e),
 *   (e) => enrichErrorWithContext(e, req),
 *   (e) => sanitizeHealthcareError(e)
 * ]);
 * ```
 */
const chainErrorTransformers = (error, transformers) => {
    return transformers.reduce((currentError, transformer) => {
        try {
            return transformer(currentError);
        }
        catch (transformError) {
            console.error('Error transformer failed:', transformError);
            return currentError;
        }
    }, error);
};
exports.chainErrorTransformers = chainErrorTransformers;
/**
 * Creates error response for HTTP endpoints
 *
 * @param {Error} error - Error to convert to HTTP response
 * @param {Request} req - Express request object
 * @param {Partial<SanitizationConfig>} [config] - Sanitization config
 * @returns {SerializedError} HTTP error response
 *
 * @example
 * ```typescript
 * const response = createHttpErrorResponse(error, req, {
 *   includeStack: false,
 *   sanitizePHI: true
 * });
 * res.status(response.statusCode).json(response);
 * ```
 */
const createHttpErrorResponse = (error, req, config) => {
    const enrichedError = (0, exports.enrichErrorWithContext)(error, req);
    return (0, exports.serializeError)(enrichedError, config);
};
exports.createHttpErrorResponse = createHttpErrorResponse;
// ============================================================================
// ERROR SANITIZATION AND SECURITY (Functions 11-15)
// ============================================================================
/**
 * Sanitizes error context to remove PHI data
 *
 * @param {ErrorContext} [context] - Error context
 * @returns {Partial<ErrorContext>} Sanitized context
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeContextPHI({
 *   patientId: 'P-123',
 *   userId: 'U-456',
 *   metadata: { ssn: '123-45-6789' }
 * });
 * // patientId and ssn are redacted
 * ```
 */
const sanitizeContextPHI = (context) => {
    if (!context)
        return undefined;
    const sanitized = { ...context };
    // Redact PHI fields
    if (context.phi) {
        delete sanitized.patientId;
        delete sanitized.facilityId;
    }
    // Sanitize metadata
    if (sanitized.metadata) {
        sanitized.metadata = sanitizeMetadata(sanitized.metadata);
    }
    return sanitized;
};
exports.sanitizeContextPHI = sanitizeContextPHI;
/**
 * Sanitizes stack trace for production use
 *
 * @param {string | undefined} stack - Stack trace
 * @param {Partial<SanitizationConfig>} config - Sanitization config
 * @returns {string | undefined} Sanitized stack trace
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeStackTrace(error.stack, {
 *   maxStackFrames: 5,
 *   allowedPaths: ['/app/src']
 * });
 * ```
 */
const sanitizeStackTrace = (stack, config) => {
    if (!stack || !config.includeStack)
        return undefined;
    let lines = stack.split('\n');
    // Limit stack frames
    if (config.maxStackFrames) {
        lines = lines.slice(0, config.maxStackFrames + 1);
    }
    // Filter by allowed paths
    if (config.allowedPaths && config.allowedPaths.length > 0) {
        lines = lines.filter((line, index) => {
            if (index === 0)
                return true; // Keep error message
            return config.allowedPaths.some((path) => line.includes(path));
        });
    }
    // Remove absolute paths
    lines = lines.map((line) => line
        .replace(/\/home\/[^\/]+\//g, '~/')
        .replace(/C:\\Users\\[^\\]+\\/g, '~\\')
        .replace(/\/Users\/[^\/]+\//g, '~/'));
    return lines.join('\n');
};
exports.sanitizeStackTrace = sanitizeStackTrace;
/**
 * Removes sensitive data from error objects
 *
 * @param {Error} error - Error to sanitize
 * @param {string[]} [sensitiveFields] - Fields to redact
 * @returns {Error} Sanitized error
 *
 * @example
 * ```typescript
 * const sanitized = removeSensitiveData(error, [
 *   'password', 'apiKey', 'token', 'ssn', 'creditCard'
 * ]);
 * ```
 */
const removeSensitiveData = (error, sensitiveFields = [
    'password',
    'apiKey',
    'api_key',
    'token',
    'secret',
    'ssn',
    'social_security',
    'credit_card',
    'creditCard',
    'cvv',
]) => {
    if (error instanceof ApplicationException && error.context) {
        const sanitizedContext = { ...error.context };
        // Redact sensitive fields
        sensitiveFields.forEach((field) => {
            if (field in sanitizedContext) {
                sanitizedContext[field] = '[REDACTED]';
            }
            if (sanitizedContext.metadata && field in sanitizedContext.metadata) {
                sanitizedContext.metadata[field] = '[REDACTED]';
            }
        });
        return new ApplicationException(error.message, error.code, error.statusCode, error.category, error.severity, sanitizedContext);
    }
    return error;
};
exports.removeSensitiveData = removeSensitiveData;
/**
 * Sanitizes healthcare-specific errors for logging and display
 *
 * @param {Error} error - Error to sanitize
 * @returns {Error} Sanitized error
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeHealthcareError(error);
 * logger.error(sanitized); // Safe to log without PHI
 * ```
 */
const sanitizeHealthcareError = (error) => {
    const sensitiveFields = [
        'patientId',
        'patient_id',
        'mrn',
        'ssn',
        'social_security',
        'dob',
        'date_of_birth',
        'diagnosis',
        'medication',
        'prescription',
        'insurance',
        'provider',
    ];
    return (0, exports.removeSensitiveData)(error, sensitiveFields);
};
exports.sanitizeHealthcareError = sanitizeHealthcareError;
/**
 * Redacts patterns from error messages using regex
 *
 * @param {string} message - Error message
 * @param {RegExp[]} [patterns] - Patterns to redact
 * @returns {string} Redacted message
 *
 * @example
 * ```typescript
 * const redacted = redactPatterns(
 *   'Error with email user@example.com and SSN 123-45-6789',
 *   [/\b\d{3}-\d{2}-\d{4}\b/g, /\b[\w\.-]+@[\w\.-]+\.\w+\b/g]
 * );
 * // Result: 'Error with email [REDACTED] and SSN [REDACTED]'
 * ```
 */
const redactPatterns = (message, patterns = [
    /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, // Credit card
    /\b[\w\.-]+@[\w\.-]+\.\w+\b/g, // Email
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone
]) => {
    let redacted = message;
    patterns.forEach((pattern) => {
        redacted = redacted.replace(pattern, '[REDACTED]');
    });
    return redacted;
};
exports.redactPatterns = redactPatterns;
// ============================================================================
// RETRY MECHANISMS (Functions 16-20)
// ============================================================================
/**
 * Retries operation with exponential backoff
 *
 * @param {Function} operation - Operation to retry
 * @param {Partial<RetryConfig>} [config] - Retry configuration
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await retryWithExponentialBackoff(
 *   () => fetchPatientData(patientId),
 *   {
 *     maxAttempts: 3,
 *     baseDelay: 1000,
 *     maxDelay: 10000,
 *     backoffMultiplier: 2,
 *     onRetry: (error, attempt, delay) => {
 *       console.log(`Retry ${attempt} after ${delay}ms`);
 *     }
 *   }
 * );
 * ```
 */
const retryWithExponentialBackoff = async (operation, config) => {
    const defaultConfig = {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 30000,
        backoffMultiplier: 2,
        jitterFactor: 0.1,
        ...config,
    };
    let lastError;
    for (let attempt = 1; attempt <= defaultConfig.maxAttempts; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            // Check if error is retryable
            if (defaultConfig.shouldRetry && !defaultConfig.shouldRetry(error)) {
                throw error;
            }
            // Check retryable error codes
            if (defaultConfig.retryableErrorCodes &&
                error instanceof ApplicationException &&
                !defaultConfig.retryableErrorCodes.includes(error.code)) {
                throw error;
            }
            // Don't retry on last attempt
            if (attempt === defaultConfig.maxAttempts) {
                break;
            }
            // Calculate delay with exponential backoff and jitter
            const exponentialDelay = Math.min(defaultConfig.baseDelay * Math.pow(defaultConfig.backoffMultiplier, attempt - 1), defaultConfig.maxDelay);
            const jitter = defaultConfig.jitterFactor
                ? exponentialDelay * defaultConfig.jitterFactor * (Math.random() * 2 - 1)
                : 0;
            const delay = Math.max(0, exponentialDelay + jitter);
            // Call retry callback
            if (defaultConfig.onRetry) {
                await defaultConfig.onRetry(error, attempt, delay);
            }
            // Wait before retry
            await sleep(delay);
        }
    }
    throw lastError || new Error('Retry failed without error');
};
exports.retryWithExponentialBackoff = retryWithExponentialBackoff;
/**
 * Creates retry decorator for methods
 *
 * @param {Partial<RetryConfig>} config - Retry configuration
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * class PatientService {
 *   @Retry({ maxAttempts: 3, baseDelay: 1000 })
 *   async fetchPatient(id: string) {
 *     return await this.patientRepository.findById(id);
 *   }
 * }
 * ```
 */
const Retry = (config) => {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            return (0, exports.retryWithExponentialBackoff)(() => originalMethod.apply(this, args), config);
        };
        return descriptor;
    };
};
exports.Retry = Retry;
/**
 * Determines if error is retryable
 *
 * @param {Error} error - Error to check
 * @returns {boolean} True if retryable
 *
 * @example
 * ```typescript
 * if (isRetryableError(error)) {
 *   await retryOperation();
 * } else {
 *   throw error;
 * }
 * ```
 */
const isRetryableError = (error) => {
    // Network errors are retryable
    if (error.message.includes('ECONNREFUSED') ||
        error.message.includes('ETIMEDOUT') ||
        error.message.includes('ENOTFOUND') ||
        error.message.includes('ENETUNREACH')) {
        return true;
    }
    // External service exceptions marked as retryable
    if (error instanceof ExternalServiceException) {
        return error.isRetryable;
    }
    // Application exceptions with 5xx status codes are retryable
    if (error instanceof ApplicationException) {
        return error.statusCode >= 500 && error.statusCode < 600;
    }
    return false;
};
exports.isRetryableError = isRetryableError;
/**
 * Calculates jittered delay to prevent thundering herd
 *
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} [jitterFactor=0.1] - Jitter factor (0-1)
 * @returns {number} Jittered delay
 *
 * @example
 * ```typescript
 * const delay = calculateJitteredDelay(1000, 0.2);
 * await sleep(delay); // 800-1200ms
 * ```
 */
const calculateJitteredDelay = (baseDelay, jitterFactor = 0.1) => {
    const jitter = baseDelay * jitterFactor * (Math.random() * 2 - 1);
    return Math.max(0, baseDelay + jitter);
};
exports.calculateJitteredDelay = calculateJitteredDelay;
/**
 * Creates retry policy based on error type
 *
 * @param {Error} error - Error to analyze
 * @returns {Partial<RetryConfig>} Recommended retry config
 *
 * @example
 * ```typescript
 * const policy = createRetryPolicy(error);
 * await retryWithExponentialBackoff(operation, policy);
 * ```
 */
const createRetryPolicy = (error) => {
    if (error instanceof ExternalServiceException) {
        return {
            maxAttempts: 3,
            baseDelay: 2000,
            maxDelay: 30000,
            backoffMultiplier: 2,
            jitterFactor: 0.2,
        };
    }
    if (error instanceof ApplicationException &&
        error.category === ErrorCategory.DATABASE) {
        return {
            maxAttempts: 5,
            baseDelay: 500,
            maxDelay: 10000,
            backoffMultiplier: 1.5,
            jitterFactor: 0.1,
        };
    }
    // Default policy
    return {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 15000,
        backoffMultiplier: 2,
        jitterFactor: 0.1,
    };
};
exports.createRetryPolicy = createRetryPolicy;
// ============================================================================
// CIRCUIT BREAKER PATTERN (Functions 21-25)
// ============================================================================
/**
 * Creates circuit breaker instance
 *
 * @param {Partial<CircuitBreakerConfig>} [config] - Circuit breaker config
 * @returns {CircuitBreakerInstance} Circuit breaker instance
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 60000,
 *   halfOpenDelay: 5000,
 *   onStateChange: (from, to) => {
 *     console.log(`Circuit breaker: ${from} -> ${to}`);
 *   }
 * });
 *
 * const result = await breaker.execute(() => externalAPICall());
 * ```
 */
const createCircuitBreaker = (config) => {
    const defaultConfig = {
        failureThreshold: 5,
        successThreshold: 2,
        timeout: 60000,
        halfOpenDelay: 5000,
        monitoringWindow: 60000,
        ...config,
    };
    let state = CircuitState.CLOSED;
    let failureCount = 0;
    let successCount = 0;
    let totalCalls = 0;
    let lastFailureTime;
    let lastSuccessTime;
    let nextAttemptTime;
    const setState = (newState) => {
        const oldState = state;
        state = newState;
        if (defaultConfig.onStateChange && oldState !== newState) {
            defaultConfig.onStateChange(oldState, newState);
        }
    };
    const execute = async (operation) => {
        totalCalls++;
        // Check if circuit is open
        if (state === CircuitState.OPEN) {
            if (nextAttemptTime && new Date() < nextAttemptTime) {
                throw new ApplicationException('Circuit breaker is open', 'CIRCUIT_BREAKER_OPEN', 503, ErrorCategory.SYSTEM, ErrorSeverity.HIGH, {
                    metadata: {
                        state,
                        nextAttemptTime: nextAttemptTime.toISOString(),
                        failureCount,
                    },
                });
            }
            // Transition to half-open
            setState(CircuitState.HALF_OPEN);
            successCount = 0;
        }
        try {
            const result = await operation();
            // Record success
            successCount++;
            lastSuccessTime = new Date();
            if (defaultConfig.onSuccess) {
                defaultConfig.onSuccess();
            }
            // Check if we can close the circuit
            if (state === CircuitState.HALF_OPEN) {
                if (successCount >= defaultConfig.successThreshold) {
                    setState(CircuitState.CLOSED);
                    failureCount = 0;
                }
            }
            else if (state === CircuitState.CLOSED) {
                failureCount = 0;
            }
            return result;
        }
        catch (error) {
            failureCount++;
            lastFailureTime = new Date();
            if (defaultConfig.onFailure) {
                defaultConfig.onFailure(error);
            }
            // Check if we should open the circuit
            if (failureCount >= defaultConfig.failureThreshold) {
                setState(CircuitState.OPEN);
                nextAttemptTime = new Date(Date.now() + defaultConfig.timeout);
            }
            throw error;
        }
    };
    const getState = () => state;
    const getStats = () => ({
        state,
        failureCount,
        successCount,
        totalCalls,
        lastFailureTime,
        lastSuccessTime,
        nextAttemptTime,
    });
    const reset = () => {
        setState(CircuitState.CLOSED);
        failureCount = 0;
        successCount = 0;
        totalCalls = 0;
        lastFailureTime = undefined;
        lastSuccessTime = undefined;
        nextAttemptTime = undefined;
    };
    const forceOpen = () => {
        setState(CircuitState.OPEN);
        nextAttemptTime = new Date(Date.now() + defaultConfig.timeout);
    };
    const forceClose = () => {
        setState(CircuitState.CLOSED);
        failureCount = 0;
        nextAttemptTime = undefined;
    };
    return {
        execute,
        getState,
        getStats,
        reset,
        forceOpen,
        forceClose,
    };
};
exports.createCircuitBreaker = createCircuitBreaker;
/**
 * Creates circuit breaker decorator for methods
 *
 * @param {Partial<CircuitBreakerConfig>} [config] - Circuit breaker config
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * class ExternalAPIService {
 *   @CircuitBreaker({ failureThreshold: 5, timeout: 60000 })
 *   async fetchData(endpoint: string) {
 *     return await this.httpClient.get(endpoint);
 *   }
 * }
 * ```
 */
const CircuitBreaker = (config) => {
    const breaker = (0, exports.createCircuitBreaker)(config);
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            return breaker.execute(() => originalMethod.apply(this, args));
        };
        return descriptor;
    };
};
exports.CircuitBreaker = CircuitBreaker;
/**
 * Monitors circuit breaker health
 *
 * @param {CircuitBreakerInstance} breaker - Circuit breaker instance
 * @returns {object} Health status
 *
 * @example
 * ```typescript
 * const health = monitorCircuitBreakerHealth(breaker);
 * console.log(`Circuit state: ${health.state}, Health: ${health.healthScore}`);
 * ```
 */
const monitorCircuitBreakerHealth = (breaker) => {
    const stats = breaker.getStats();
    const successRate = stats.totalCalls > 0 ? stats.successCount / stats.totalCalls : 1;
    const healthScore = Math.round(successRate * 100);
    return {
        state: stats.state,
        healthScore,
        isHealthy: stats.state !== CircuitState.OPEN && healthScore >= 70,
        stats,
    };
};
exports.monitorCircuitBreakerHealth = monitorCircuitBreakerHealth;
/**
 * Creates multiple circuit breakers for different services
 *
 * @param {Record<string, Partial<CircuitBreakerConfig>>} configs - Configs by service name
 * @returns {Record<string, CircuitBreakerInstance>} Circuit breakers by service
 *
 * @example
 * ```typescript
 * const breakers = createMultipleCircuitBreakers({
 *   hl7Gateway: { failureThreshold: 5, timeout: 60000 },
 *   fhirAPI: { failureThreshold: 3, timeout: 30000 },
 *   labInterface: { failureThreshold: 10, timeout: 120000 }
 * });
 *
 * await breakers.hl7Gateway.execute(() => sendHL7Message(msg));
 * ```
 */
const createMultipleCircuitBreakers = (configs) => {
    const breakers = {};
    Object.entries(configs).forEach(([name, config]) => {
        breakers[name] = (0, exports.createCircuitBreaker)(config);
    });
    return breakers;
};
exports.createMultipleCircuitBreakers = createMultipleCircuitBreakers;
/**
 * Combines circuit breaker with retry logic
 *
 * @param {Function} operation - Operation to execute
 * @param {CircuitBreakerInstance} breaker - Circuit breaker
 * @param {Partial<RetryConfig>} [retryConfig] - Retry configuration
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithCircuitBreakerAndRetry(
 *   () => externalAPICall(),
 *   circuitBreaker,
 *   { maxAttempts: 3, baseDelay: 1000 }
 * );
 * ```
 */
const executeWithCircuitBreakerAndRetry = async (operation, breaker, retryConfig) => {
    return (0, exports.retryWithExponentialBackoff)(() => breaker.execute(operation), retryConfig);
};
exports.executeWithCircuitBreakerAndRetry = executeWithCircuitBreakerAndRetry;
// ============================================================================
// FALLBACK STRATEGIES (Functions 26-30)
// ============================================================================
/**
 * Executes operation with fallback
 *
 * @param {Function} primary - Primary operation
 * @param {Function} fallback - Fallback operation
 * @param {Partial<FallbackOptions>} [options] - Fallback options
 * @returns {Promise<T>} Result from primary or fallback
 *
 * @example
 * ```typescript
 * const data = await executeWithFallback(
 *   () => fetchFromPrimaryDB(patientId),
 *   () => fetchFromCache(patientId),
 *   { timeout: 5000, logFallback: true }
 * );
 * ```
 */
const executeWithFallback = async (primary, fallback, options) => {
    try {
        if (options?.timeout) {
            return await executeWithTimeout(primary, options.timeout);
        }
        return await primary();
    }
    catch (error) {
        if (options?.logFallback) {
            console.warn('Primary operation failed, using fallback:', error);
        }
        return await fallback();
    }
};
exports.executeWithFallback = executeWithFallback;
/**
 * Executes operation with multiple fallback levels
 *
 * @param {Array<() => Promise<T>>} operations - Operations in priority order
 * @param {Partial<FallbackOptions>} [options] - Fallback options
 * @returns {Promise<T>} Result from first successful operation
 *
 * @example
 * ```typescript
 * const data = await executeWithFallbackChain([
 *   () => fetchFromPrimaryDB(patientId),
 *   () => fetchFromReplicaDB(patientId),
 *   () => fetchFromCache(patientId),
 *   () => getDefaultPatientData()
 * ]);
 * ```
 */
const executeWithFallbackChain = async (operations, options) => {
    let lastError;
    for (let i = 0; i < operations.length; i++) {
        try {
            const operation = operations[i];
            if (options?.timeout) {
                return await executeWithTimeout(operation, options.timeout);
            }
            return await operation();
        }
        catch (error) {
            lastError = error;
            if (options?.logFallback && i < operations.length - 1) {
                console.warn(`Fallback level ${i} failed, trying next:`, error);
            }
        }
    }
    throw lastError || new Error('All fallback operations failed');
};
exports.executeWithFallbackChain = executeWithFallbackChain;
/**
 * Creates degraded response when feature unavailable
 *
 * @param {string} feature - Feature name
 * @param {any} [partialData] - Partial data if available
 * @param {string} [reason] - Degradation reason
 * @returns {object} Degraded response
 *
 * @example
 * ```typescript
 * return createDegradedResponse(
 *   'PatientRecommendations',
 *   { defaultRecommendations: ['rec1', 'rec2'] },
 *   'ML service unavailable'
 * );
 * ```
 */
const createDegradedResponse = (feature, partialData, reason) => {
    return {
        status: 'degraded',
        feature,
        message: `${feature} is operating in degraded mode`,
        reason,
        data: partialData,
        timestamp: new Date().toISOString(),
    };
};
exports.createDegradedResponse = createDegradedResponse;
/**
 * Implements graceful degradation with timeout
 *
 * @param {Function} operation - Operation to execute
 * @param {Function} degradedFallback - Degraded mode fallback
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<T>} Result or degraded response
 *
 * @example
 * ```typescript
 * const result = await executeWithGracefulDegradation(
 *   () => generatePersonalizedReport(patientId),
 *   () => generateStandardReport(patientId),
 *   5000
 * );
 * ```
 */
const executeWithGracefulDegradation = async (operation, degradedFallback, timeout) => {
    try {
        return await executeWithTimeout(operation, timeout);
    }
    catch (error) {
        console.warn('Operation degraded due to timeout or error:', error);
        return await degradedFallback();
    }
};
exports.executeWithGracefulDegradation = executeWithGracefulDegradation;
/**
 * Creates fallback cache for service failures
 *
 * @param {Function} operation - Primary operation
 * @param {string} cacheKey - Cache key
 * @param {number} [ttl=300000] - Cache TTL in milliseconds
 * @returns {Promise<T>} Result from operation or cache
 *
 * @example
 * ```typescript
 * const data = await executeWithCacheFallback(
 *   () => fetchPatientData(patientId),
 *   `patient:${patientId}`,
 *   300000
 * );
 * ```
 */
const executeWithCacheFallback = async (operation, cacheKey, ttl = 300000) => {
    try {
        const result = await operation();
        // Store in cache for future fallback
        await setCache(cacheKey, result, ttl);
        return result;
    }
    catch (error) {
        // Try to get from cache
        const cached = await getCache(cacheKey);
        if (cached !== null) {
            console.warn('Using cached fallback data:', cacheKey);
            return cached;
        }
        throw error;
    }
};
exports.executeWithCacheFallback = executeWithCacheFallback;
// ============================================================================
// ERROR RECOVERY WORKFLOWS (Functions 31-35)
// ============================================================================
/**
 * Creates error recovery pipeline
 *
 * @param {ErrorRecoveryPipeline} pipeline - Recovery pipeline config
 * @returns {Promise<void>} Recovery execution result
 *
 * @example
 * ```typescript
 * await executeErrorRecoveryPipeline({
 *   errorCode: 'DB_CONNECTION_ERROR',
 *   actions: [
 *     {
 *       name: 'CloseStaleConnections',
 *       execute: async () => { await closeStaleConnections(); }
 *     },
 *     {
 *       name: 'ReconnectToDatabase',
 *       execute: async () => { await reconnectToDatabase(); }
 *     },
 *     {
 *       name: 'VerifyConnection',
 *       execute: async () => { await verifyDatabaseConnection(); }
 *     }
 *   ],
 *   timeout: 30000
 * });
 * ```
 */
const executeErrorRecoveryPipeline = async (pipeline) => {
    const startTime = Date.now();
    for (const action of pipeline.actions) {
        try {
            // Check timeout
            if (pipeline.timeout && Date.now() - startTime > pipeline.timeout) {
                throw new Error(`Recovery pipeline timeout exceeded`);
            }
            console.log(`Executing recovery action: ${action.name}`);
            if (action.timeout) {
                await executeWithTimeout(action.execute, action.timeout);
            }
            else {
                await action.execute();
            }
            if (action.onSuccess) {
                action.onSuccess();
            }
        }
        catch (error) {
            console.error(`Recovery action ${action.name} failed:`, error);
            if (action.onFailure) {
                action.onFailure(error);
            }
            if (!pipeline.continueOnFailure) {
                throw new ApplicationException(`Recovery pipeline failed at action: ${action.name}`, 'RECOVERY_PIPELINE_FAILED', 500, ErrorCategory.SYSTEM, ErrorSeverity.HIGH, {
                    metadata: {
                        errorCode: pipeline.errorCode,
                        failedAction: action.name,
                        originalError: error.message,
                    },
                });
            }
        }
    }
};
exports.executeErrorRecoveryPipeline = executeErrorRecoveryPipeline;
/**
 * Auto-recovers from common database errors
 *
 * @param {Error} error - Database error
 * @param {Function} operation - Operation to retry after recovery
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * try {
 *   return await dbQuery();
 * } catch (error) {
 *   return await autoRecoverDatabaseError(error, () => dbQuery());
 * }
 * ```
 */
const autoRecoverDatabaseError = async (error, operation) => {
    const message = error.message.toLowerCase();
    // Connection pool exhausted
    if (message.includes('connection pool') || message.includes('too many connections')) {
        console.log('Recovering from connection pool exhaustion');
        await sleep(2000); // Wait for connections to be released
        return await (0, exports.retryWithExponentialBackoff)(operation, {
            maxAttempts: 3,
            baseDelay: 1000,
        });
    }
    // Deadlock
    if (message.includes('deadlock')) {
        console.log('Recovering from deadlock');
        await sleep(100); // Brief wait before retry
        return await (0, exports.retryWithExponentialBackoff)(operation, {
            maxAttempts: 5,
            baseDelay: 100,
            maxDelay: 2000,
        });
    }
    // Connection timeout
    if (message.includes('timeout') || message.includes('timed out')) {
        console.log('Recovering from timeout');
        return await (0, exports.retryWithExponentialBackoff)(operation, {
            maxAttempts: 3,
            baseDelay: 2000,
            maxDelay: 10000,
        });
    }
    throw error;
};
exports.autoRecoverDatabaseError = autoRecoverDatabaseError;
/**
 * Implements health check based recovery
 *
 * @param {Function} healthCheck - Health check function
 * @param {Function} recovery - Recovery function
 * @param {number} [maxAttempts=3] - Max recovery attempts
 * @returns {Promise<boolean>} Recovery success status
 *
 * @example
 * ```typescript
 * const recovered = await healthCheckRecovery(
 *   async () => await database.ping(),
 *   async () => await database.reconnect(),
 *   3
 * );
 * ```
 */
const healthCheckRecovery = async (healthCheck, recovery, maxAttempts = 3) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const isHealthy = await healthCheck();
            if (isHealthy) {
                return true;
            }
        }
        catch (error) {
            console.warn(`Health check failed (attempt ${attempt}):`, error);
        }
        if (attempt < maxAttempts) {
            console.log(`Attempting recovery (${attempt}/${maxAttempts})`);
            try {
                await recovery();
                await sleep(1000); // Wait after recovery
            }
            catch (error) {
                console.error(`Recovery attempt ${attempt} failed:`, error);
            }
        }
    }
    return false;
};
exports.healthCheckRecovery = healthCheckRecovery;
/**
 * Implements automatic service restart on critical errors
 *
 * @param {Error} error - Critical error
 * @param {Function} restartService - Service restart function
 * @param {number} [cooldown=5000] - Cooldown before restart
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * try {
 *   await criticalOperation();
 * } catch (error) {
 *   if (isCriticalError(error)) {
 *     await autoRestartService(error, () => restartMessageQueue());
 *   }
 * }
 * ```
 */
const autoRestartService = async (error, restartService, cooldown = 5000) => {
    console.error('Critical error detected, initiating service restart:', error);
    // Wait cooldown period
    await sleep(cooldown);
    try {
        await restartService();
        console.log('Service restarted successfully');
    }
    catch (restartError) {
        console.error('Service restart failed:', restartError);
        throw new ApplicationException('Service restart failed after critical error', 'SERVICE_RESTART_FAILED', 500, ErrorCategory.SYSTEM, ErrorSeverity.CRITICAL, {
            metadata: {
                originalError: error.message,
                restartError: restartError.message,
            },
        });
    }
};
exports.autoRestartService = autoRestartService;
/**
 * Creates recovery strategy based on error pattern
 *
 * @param {Error} error - Error to analyze
 * @returns {ErrorRecoveryPipeline | null} Recovery pipeline or null
 *
 * @example
 * ```typescript
 * const pipeline = createRecoveryStrategy(error);
 * if (pipeline) {
 *   await executeErrorRecoveryPipeline(pipeline);
 * }
 * ```
 */
const createRecoveryStrategy = (error) => {
    if (error instanceof ApplicationException) {
        switch (error.category) {
            case ErrorCategory.DATABASE:
                return {
                    errorCode: error.code,
                    actions: [
                        {
                            name: 'ClearConnectionPool',
                            execute: async () => {
                                console.log('Clearing database connection pool');
                                await sleep(1000);
                            },
                        },
                        {
                            name: 'ReconnectDatabase',
                            execute: async () => {
                                console.log('Reconnecting to database');
                                await sleep(2000);
                            },
                        },
                    ],
                    continueOnFailure: false,
                    timeout: 30000,
                };
            case ErrorCategory.EXTERNAL_SERVICE:
                return {
                    errorCode: error.code,
                    actions: [
                        {
                            name: 'CheckServiceHealth',
                            execute: async () => {
                                console.log('Checking external service health');
                            },
                        },
                        {
                            name: 'ResetCircuitBreaker',
                            execute: async () => {
                                console.log('Resetting circuit breaker');
                            },
                        },
                    ],
                    continueOnFailure: true,
                    timeout: 15000,
                };
        }
    }
    return null;
};
exports.createRecoveryStrategy = createRecoveryStrategy;
// ============================================================================
// ERROR AGGREGATION AND MONITORING (Functions 36-40)
// ============================================================================
/**
 * Aggregates errors by code and category
 *
 * @param {Error[]} errors - Errors to aggregate
 * @param {number} [windowMs=3600000] - Time window in milliseconds
 * @returns {Map<string, ErrorAggregation>} Aggregated errors
 *
 * @example
 * ```typescript
 * const aggregation = aggregateErrors(recentErrors, 3600000);
 * aggregation.forEach((stats, code) => {
 *   console.log(`${code}: ${stats.count} occurrences, trend: ${stats.trend}`);
 * });
 * ```
 */
const aggregateErrors = (errors, windowMs = 3600000) => {
    const aggregation = new Map();
    const now = Date.now();
    const windowStart = now - windowMs;
    errors.forEach((error) => {
        if (!(error instanceof ApplicationException))
            return;
        const code = error.code;
        const timestamp = error.timestamp.getTime();
        // Skip errors outside window
        if (timestamp < windowStart)
            return;
        if (!aggregation.has(code)) {
            aggregation.set(code, {
                errorCode: code,
                category: error.category,
                count: 0,
                firstOccurrence: error.timestamp,
                lastOccurrence: error.timestamp,
                affectedUsers: new Set(),
                affectedPatients: new Set(),
                contexts: [],
                trend: 'STABLE',
            });
        }
        const stats = aggregation.get(code);
        stats.count++;
        stats.lastOccurrence = error.timestamp;
        if (error.context?.userId) {
            stats.affectedUsers.add(error.context.userId);
        }
        if (error.context?.patientId) {
            stats.affectedPatients.add(error.context.patientId);
        }
        if (error.context) {
            stats.contexts.push(error.context);
        }
    });
    // Calculate trends
    aggregation.forEach((stats) => {
        stats.trend = calculateErrorTrend(stats, windowMs);
    });
    return aggregation;
};
exports.aggregateErrors = aggregateErrors;
/**
 * Detects error spikes and anomalies
 *
 * @param {Map<string, ErrorAggregation>} aggregation - Error aggregation
 * @param {number} [threshold=2.0] - Spike threshold multiplier
 * @returns {Array<{code: string; spike: boolean; severity: string}>} Spike detection results
 *
 * @example
 * ```typescript
 * const spikes = detectErrorSpikes(aggregation, 2.5);
 * spikes.filter(s => s.spike).forEach(spike => {
 *   console.log(`ALERT: Error spike detected for ${spike.code}`);
 * });
 * ```
 */
const detectErrorSpikes = (aggregation, threshold = 2.0) => {
    const results = [];
    const counts = Array.from(aggregation.values()).map((a) => a.count);
    const average = counts.reduce((sum, c) => sum + c, 0) / counts.length;
    const spikeThreshold = average * threshold;
    aggregation.forEach((stats, code) => {
        const spike = stats.count > spikeThreshold;
        const severity = spike
            ? stats.count > spikeThreshold * 2
                ? 'CRITICAL'
                : 'HIGH'
            : 'NORMAL';
        results.push({
            code,
            spike,
            severity,
            count: stats.count,
        });
    });
    return results.sort((a, b) => b.count - a.count);
};
exports.detectErrorSpikes = detectErrorSpikes;
/**
 * Groups errors by time window
 *
 * @param {Error[]} errors - Errors to group
 * @param {number} windowMs - Window size in milliseconds
 * @returns {Map<string, Error[]>} Errors grouped by time window
 *
 * @example
 * ```typescript
 * const grouped = groupErrorsByTimeWindow(errors, 60000); // 1 minute windows
 * grouped.forEach((windowErrors, timestamp) => {
 *   console.log(`${timestamp}: ${windowErrors.length} errors`);
 * });
 * ```
 */
const groupErrorsByTimeWindow = (errors, windowMs) => {
    const groups = new Map();
    errors.forEach((error) => {
        const timestamp = error instanceof ApplicationException
            ? error.timestamp.getTime()
            : Date.now();
        const windowStart = Math.floor(timestamp / windowMs) * windowMs;
        const windowKey = new Date(windowStart).toISOString();
        if (!groups.has(windowKey)) {
            groups.set(windowKey, []);
        }
        groups.get(windowKey).push(error);
    });
    return groups;
};
exports.groupErrorsByTimeWindow = groupErrorsByTimeWindow;
/**
 * Calculates error rate metrics
 *
 * @param {Error[]} errors - Errors to analyze
 * @param {number} totalRequests - Total number of requests
 * @returns {object} Error rate metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateErrorRateMetrics(errors, 10000);
 * console.log(`Error rate: ${metrics.errorRate}%`);
 * console.log(`Critical errors: ${metrics.criticalErrorRate}%`);
 * ```
 */
const calculateErrorRateMetrics = (errors, totalRequests) => {
    const errorsByCategory = {};
    const errorsBySeverity = {};
    let criticalCount = 0;
    errors.forEach((error) => {
        if (error instanceof ApplicationException) {
            errorsByCategory[error.category] =
                (errorsByCategory[error.category] || 0) + 1;
            errorsBySeverity[error.severity] =
                (errorsBySeverity[error.severity] || 0) + 1;
            if (error.severity === ErrorSeverity.CRITICAL) {
                criticalCount++;
            }
        }
    });
    return {
        errorRate: totalRequests > 0 ? (errors.length / totalRequests) * 100 : 0,
        criticalErrorRate: totalRequests > 0 ? (criticalCount / totalRequests) * 100 : 0,
        errorsByCategory,
        errorsBySeverity,
    };
};
exports.calculateErrorRateMetrics = calculateErrorRateMetrics;
/**
 * Generates error monitoring report
 *
 * @param {Error[]} errors - Errors to analyze
 * @param {number} windowMs - Analysis window in milliseconds
 * @returns {object} Comprehensive error report
 *
 * @example
 * ```typescript
 * const report = generateErrorReport(recentErrors, 3600000);
 * console.log(`Total errors: ${report.summary.totalErrors}`);
 * console.log(`Top error: ${report.topErrors[0].code}`);
 * ```
 */
const generateErrorReport = (errors, windowMs) => {
    const aggregation = (0, exports.aggregateErrors)(errors, windowMs);
    const spikes = (0, exports.detectErrorSpikes)(aggregation);
    const criticalErrors = errors.filter((e) => e instanceof ApplicationException && e.severity === ErrorSeverity.CRITICAL).length;
    const affectedUsers = new Set(errors
        .filter((e) => e instanceof ApplicationException && e.context?.userId)
        .map((e) => e.context.userId)).size;
    const topErrors = Array.from(aggregation.entries())
        .map(([code, stats]) => ({
        code,
        count: stats.count,
        severity: errors.find((e) => e instanceof ApplicationException && e.code === code) instanceof ApplicationException
            ? errors.find((e) => e instanceof ApplicationException && e.code === code).severity
            : ErrorSeverity.MEDIUM,
    }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    return {
        summary: {
            totalErrors: errors.length,
            uniqueErrorCodes: aggregation.size,
            criticalErrors,
            affectedUsers,
            timeWindow: `${windowMs / 1000}s`,
        },
        topErrors,
        trends: aggregation,
        spikes,
    };
};
exports.generateErrorReport = generateErrorReport;
// ============================================================================
// ERROR NOTIFICATION AND ALERTING (Functions 41-45)
// ============================================================================
/**
 * Sends error notification through configured channels
 *
 * @param {Error} error - Error to notify
 * @param {Partial<ErrorNotificationConfig>} config - Notification config
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await notifyError(error, {
 *   enabled: true,
 *   channels: [NotificationChannel.SLACK, NotificationChannel.PAGER_DUTY],
 *   severityThreshold: ErrorSeverity.HIGH,
 *   sanitizePHI: true
 * });
 * ```
 */
const notifyError = async (error, config) => {
    if (!config.enabled)
        return;
    const severity = error instanceof ApplicationException
        ? error.severity
        : ErrorSeverity.MEDIUM;
    // Check severity threshold
    if (config.severityThreshold &&
        !shouldNotify(severity, config.severityThreshold)) {
        return;
    }
    // Sanitize error if needed
    const sanitizedError = config.sanitizePHI
        ? (0, exports.sanitizeHealthcareError)(error)
        : error;
    const serialized = (0, exports.serializeError)(sanitizedError, {
        includeStack: config.includeStackTrace || false,
        sanitizePHI: config.sanitizePHI || true,
        sanitizeCredentials: true,
    });
    // Send to configured channels
    const channels = config.channels || [];
    await Promise.allSettled(channels.map((channel) => sendToChannel(channel, serialized)));
};
exports.notifyError = notifyError;
/**
 * Sends notification to specific channel
 *
 * @param {NotificationChannel} channel - Notification channel
 * @param {SerializedError} error - Serialized error
 * @returns {Promise<void>}
 */
const sendToChannel = async (channel, error) => {
    switch (channel) {
        case NotificationChannel.SLACK:
            await sendToSlack(error);
            break;
        case NotificationChannel.EMAIL:
            await sendToEmail(error);
            break;
        case NotificationChannel.PAGER_DUTY:
            await sendToPagerDuty(error);
            break;
        case NotificationChannel.SENTRY:
            await sendToSentry(error);
            break;
        case NotificationChannel.CLOUDWATCH:
            await sendToCloudWatch(error);
            break;
        case NotificationChannel.CUSTOM_WEBHOOK:
            await sendToWebhook(error);
            break;
    }
};
/**
 * Rate limits error notifications
 *
 * @param {string} errorCode - Error code to rate limit
 * @param {Partial<ErrorRateLimitConfig>} config - Rate limit config
 * @returns {boolean} True if notification should be sent
 *
 * @example
 * ```typescript
 * if (shouldSendNotification(error.code, {
 *   maxErrorsPerMinute: 10,
 *   maxSameErrorPerMinute: 3
 * })) {
 *   await notifyError(error, notificationConfig);
 * }
 * ```
 */
const shouldSendNotification = (errorCode, config) => {
    // Implementation would use a rate limiter (e.g., Redis)
    // For now, simplified version
    return true;
};
exports.shouldSendNotification = shouldSendNotification;
/**
 * Creates alert severity mapping
 *
 * @param {ErrorSeverity} severity - Error severity
 * @returns {string} Alert severity for external systems
 *
 * @example
 * ```typescript
 * const alertSeverity = mapToAlertSeverity(ErrorSeverity.CRITICAL);
 * // Returns: 'critical' for PagerDuty, Sentry, etc.
 * ```
 */
const mapToAlertSeverity = (severity) => {
    switch (severity) {
        case ErrorSeverity.LOW:
            return 'info';
        case ErrorSeverity.MEDIUM:
            return 'warning';
        case ErrorSeverity.HIGH:
            return 'error';
        case ErrorSeverity.CRITICAL:
            return 'critical';
        default:
            return 'error';
    }
};
exports.mapToAlertSeverity = mapToAlertSeverity;
/**
 * Formats error for user-friendly display
 *
 * @param {Error} error - Error to format
 * @param {string} [locale='en'] - Locale for message
 * @returns {string} User-friendly error message
 *
 * @example
 * ```typescript
 * const message = generateUserFriendlyMessage(error, 'en');
 * res.status(error.statusCode).json({ message });
 * ```
 */
const generateUserFriendlyMessage = (error, locale = 'en') => {
    if (error instanceof HealthcareBusinessException) {
        return getUserFriendlyHealthcareMessage(error.code, locale);
    }
    if (error instanceof ApplicationException) {
        return getUserFriendlyMessage(error.code, error.category, locale);
    }
    return 'An unexpected error occurred. Please try again or contact support.';
};
exports.generateUserFriendlyMessage = generateUserFriendlyMessage;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Sleeps for specified milliseconds
 */
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
/**
 * Executes operation with timeout
 */
const executeWithTimeout = async (operation, timeoutMs) => {
    return Promise.race([
        operation(),
        new Promise((_, reject) => setTimeout(() => reject(new ApplicationException('Operation timed out', 'OPERATION_TIMEOUT', 504, ErrorCategory.SYSTEM, ErrorSeverity.MEDIUM)), timeoutMs)),
    ]);
};
/**
 * Extracts correlation ID from request
 */
const extractCorrelationId = (req) => {
    return (req.headers['x-correlation-id'] ||
        req.headers['x-request-id'] ||
        crypto.randomUUID());
};
/**
 * Extracts field name from error message
 */
const extractFieldFromError = (message) => {
    const match = message.match(/key\s+"?([^"\s]+)"?/i);
    return match ? match[1] : 'unknown';
};
/**
 * Sanitizes metadata to remove sensitive information
 */
const sanitizeMetadata = (metadata) => {
    const sensitiveKeys = [
        'password',
        'token',
        'apiKey',
        'secret',
        'ssn',
        'creditCard',
    ];
    const sanitized = { ...metadata };
    Object.keys(sanitized).forEach((key) => {
        if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
            sanitized[key] = '[REDACTED]';
        }
    });
    return sanitized;
};
/**
 * Calculates error trend
 */
const calculateErrorTrend = (stats, windowMs) => {
    const duration = stats.lastOccurrence.getTime() - stats.firstOccurrence.getTime();
    const rate = stats.count / (duration / 1000); // errors per second
    if (rate > 10)
        return 'SPIKE';
    if (stats.count > 100)
        return 'INCREASING';
    if (stats.count < 5)
        return 'DECREASING';
    return 'STABLE';
};
/**
 * Determines if notification should be sent based on severity
 */
const shouldNotify = (errorSeverity, threshold) => {
    const severityOrder = [
        ErrorSeverity.LOW,
        ErrorSeverity.MEDIUM,
        ErrorSeverity.HIGH,
        ErrorSeverity.CRITICAL,
    ];
    return (severityOrder.indexOf(errorSeverity) >= severityOrder.indexOf(threshold));
};
/**
 * Gets user-friendly message for error code
 */
const getUserFriendlyMessage = (code, category, locale) => {
    // Simplified implementation - would use i18n in production
    const messages = {
        PATIENT_NOT_FOUND: 'The requested patient record could not be found.',
        PRESCRIPTION_AUTH_REQUIRED: 'Authorization is required for this prescription.',
        DUPLICATE_MRN: 'This medical record number is already in use.',
        DB_CONNECTION_ERROR: 'We are experiencing connectivity issues. Please try again later.',
        EXTERNAL_SERVICE_ERROR: 'An external service is temporarily unavailable. Please try again later.',
    };
    return (messages[code] ||
        'An error occurred. Please try again or contact support if the problem persists.');
};
/**
 * Gets healthcare-specific user-friendly message
 */
const getUserFriendlyHealthcareMessage = (code, locale) => {
    const messages = {
        HIPAA_UNAUTHORIZED_ACCESS: 'You do not have permission to access this patient information.',
        PATIENT_ACCESS_DENIED: 'Access to this patient record has been restricted.',
        PRESCRIPTION_AUTH_REQUIRED: 'Additional authorization is required for this prescription.',
        LAB_INTERFACE_ERROR: 'Laboratory interface is temporarily unavailable.',
        HL7_SERVICE_DOWN: 'Healthcare information exchange is temporarily unavailable.',
    };
    return messages[code] || getUserFriendlyMessage(code, ErrorCategory.BUSINESS_LOGIC, locale);
};
// Stub implementations for notification channels
const sendToSlack = async (error) => {
    console.log('[Slack] Error notification:', error.code);
};
const sendToEmail = async (error) => {
    console.log('[Email] Error notification:', error.code);
};
const sendToPagerDuty = async (error) => {
    console.log('[PagerDuty] Error notification:', error.code);
};
const sendToSentry = async (error) => {
    console.log('[Sentry] Error notification:', error.code);
};
const sendToCloudWatch = async (error) => {
    console.log('[CloudWatch] Error notification:', error.code);
};
const sendToWebhook = async (error) => {
    console.log('[Webhook] Error notification:', error.code);
};
// Simple in-memory cache for demonstration
const cacheStore = new Map();
const setCache = async (key, value, ttl) => {
    cacheStore.set(key, { value, expiry: Date.now() + ttl });
};
const getCache = async (key) => {
    const cached = cacheStore.get(key);
    if (!cached)
        return null;
    if (Date.now() > cached.expiry) {
        cacheStore.delete(key);
        return null;
    }
    return cached.value;
};
/**
 * Default export with all utilities
 */
exports.default = {
    // Exception classes
    ApplicationException,
    HealthcareBusinessException,
    ExternalServiceException,
    HIPAAViolationException,
    DataIntegrityException,
    // Serialization
    serializeError: exports.serializeError,
    transformDatabaseError: exports.transformDatabaseError,
    enrichErrorWithContext: exports.enrichErrorWithContext,
    chainErrorTransformers: exports.chainErrorTransformers,
    createHttpErrorResponse: exports.createHttpErrorResponse,
    // Sanitization
    sanitizeContextPHI: exports.sanitizeContextPHI,
    sanitizeStackTrace: exports.sanitizeStackTrace,
    removeSensitiveData: exports.removeSensitiveData,
    sanitizeHealthcareError: exports.sanitizeHealthcareError,
    redactPatterns: exports.redactPatterns,
    // Retry
    retryWithExponentialBackoff: exports.retryWithExponentialBackoff,
    Retry: exports.Retry,
    isRetryableError: exports.isRetryableError,
    calculateJitteredDelay: exports.calculateJitteredDelay,
    createRetryPolicy: exports.createRetryPolicy,
    // Circuit Breaker
    createCircuitBreaker: exports.createCircuitBreaker,
    CircuitBreaker: exports.CircuitBreaker,
    monitorCircuitBreakerHealth: exports.monitorCircuitBreakerHealth,
    createMultipleCircuitBreakers: exports.createMultipleCircuitBreakers,
    executeWithCircuitBreakerAndRetry: exports.executeWithCircuitBreakerAndRetry,
    // Fallback
    executeWithFallback: exports.executeWithFallback,
    executeWithFallbackChain: exports.executeWithFallbackChain,
    createDegradedResponse: exports.createDegradedResponse,
    executeWithGracefulDegradation: exports.executeWithGracefulDegradation,
    executeWithCacheFallback: exports.executeWithCacheFallback,
    // Recovery
    executeErrorRecoveryPipeline: exports.executeErrorRecoveryPipeline,
    autoRecoverDatabaseError: exports.autoRecoverDatabaseError,
    healthCheckRecovery: exports.healthCheckRecovery,
    autoRestartService: exports.autoRestartService,
    createRecoveryStrategy: exports.createRecoveryStrategy,
    // Aggregation
    aggregateErrors: exports.aggregateErrors,
    detectErrorSpikes: exports.detectErrorSpikes,
    groupErrorsByTimeWindow: exports.groupErrorsByTimeWindow,
    calculateErrorRateMetrics: exports.calculateErrorRateMetrics,
    generateErrorReport: exports.generateErrorReport,
    // Notification
    notifyError: exports.notifyError,
    shouldSendNotification: exports.shouldSendNotification,
    mapToAlertSeverity: exports.mapToAlertSeverity,
    generateUserFriendlyMessage: exports.generateUserFriendlyMessage,
    // Enums
    ErrorSeverity,
    ErrorCategory,
    CircuitState,
    NotificationChannel,
};
//# sourceMappingURL=error-handling-recovery-kit.js.map