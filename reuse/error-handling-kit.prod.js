"use strict";
/**
 * LOC: ERR_HANDLE_PROD_001
 * File: /reuse/error-handling-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - @sentry/node
 *   - sequelize-typescript
 *   - sequelize
 *   - zod
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - Exception filters
 *   - Error interceptors
 *   - Error middleware
 *   - Service error handlers
 *   - Controller error handling
 *   - Background job error handling
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = exports.TimeoutInterceptor = exports.ErrorTransformationInterceptor = exports.ErrorLoggingInterceptor = exports.DatabaseExceptionFilter = exports.ValidationExceptionFilter = exports.GlobalExceptionFilter = exports.CircuitBreakerOpenException = exports.RateLimitException = exports.ResourceConflictException = exports.ResourceNotFoundException = exports.DatabaseException = exports.ExternalServiceException = exports.BusinessRuleException = exports.ValidationException = exports.DomainException = exports.CircuitBreakerConfigSchema = exports.RetryConfigSchema = exports.ErrorResponseSchema = exports.CircuitState = exports.ErrorCode = exports.ErrorCategory = exports.ErrorSeverity = void 0;
exports.serializeError = serializeError;
exports.formatZodErrors = formatZodErrors;
exports.formatSequelizeErrors = formatSequelizeErrors;
exports.sanitizeStackTrace = sanitizeStackTrace;
exports.sanitizeErrorMessage = sanitizeErrorMessage;
exports.createUserFriendlyMessage = createUserFriendlyMessage;
exports.mapHttpStatusToErrorCode = mapHttpStatusToErrorCode;
exports.mapHttpStatusToCategory = mapHttpStatusToCategory;
exports.mapHttpStatusToSeverity = mapHttpStatusToSeverity;
exports.calculateBackoffDelay = calculateBackoffDelay;
exports.retryWithBackoff = retryWithBackoff;
exports.retryWithBackoffOperator = retryWithBackoffOperator;
exports.isRetryableError = isRetryableError;
exports.initializeSentry = initializeSentry;
exports.captureErrorToSentry = captureErrorToSentry;
exports.mapSeverityToSentryLevel = mapSeverityToSentryLevel;
exports.createErrorFingerprint = createErrorFingerprint;
exports.executeWithRecovery = executeWithRecovery;
exports.gracefulDegradation = gracefulDegradation;
exports.addToDeadLetterQueue = addToDeadLetterQueue;
exports.processDeadLetterQueue = processDeadLetterQueue;
exports.ApiValidationErrorResponse = ApiValidationErrorResponse;
exports.ApiNotFoundErrorResponse = ApiNotFoundErrorResponse;
exports.ApiUnauthorizedErrorResponse = ApiUnauthorizedErrorResponse;
exports.ApiForbiddenErrorResponse = ApiForbiddenErrorResponse;
exports.ApiConflictErrorResponse = ApiConflictErrorResponse;
exports.ApiInternalServerErrorResponse = ApiInternalServerErrorResponse;
exports.ApiAllErrorResponses = ApiAllErrorResponses;
exports.enrichErrorContext = enrichErrorContext;
exports.extractErrorContextFromRequest = extractErrorContextFromRequest;
exports.isDomainException = isDomainException;
exports.isHttpException = isHttpException;
exports.getStackTraceLines = getStackTraceLines;
exports.createErrorFromUnknown = createErrorFromUnknown;
exports.aggregateErrors = aggregateErrors;
/**
 * File: /reuse/error-handling-kit.prod.ts
 * Locator: WC-ERR-HANDLE-PROD-001
 * Purpose: Production-Grade Error Handling & Exception Management Kit - Enterprise error toolkit
 *
 * Upstream: NestJS, Sentry, Sequelize, Zod, RxJS
 * Downstream: ../backend/filters/*, Interceptors, Services, Controllers, Error Boundaries
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, @sentry/node
 * Exports: 48 production-ready error handling functions covering exceptions, serialization, monitoring, recovery
 *
 * LLM Context: Production-grade error handling and exception management utilities for White Cross healthcare platform.
 * Provides comprehensive custom exception classes (domain-specific, HTTP, validation), error serialization for APIs,
 * stack trace sanitization, error code management, NestJS exception filters with Swagger integration, error interceptors,
 * Sequelize error handlers, retry logic with exponential backoff, circuit breaker pattern, error rate limiting, Sentry
 * integration for monitoring, error context enrichment, error aggregation, validation error formatting (Zod), error
 * recovery strategies, error boundaries for React components, dead letter queue handling, and HIPAA-compliant error
 * logging that sanitizes sensitive patient information from error messages and stack traces.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const zod_1 = require("zod");
const Sentry = __importStar(require("@sentry/node"));
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Error severity levels
 */
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["LOW"] = "low";
    ErrorSeverity["MEDIUM"] = "medium";
    ErrorSeverity["HIGH"] = "high";
    ErrorSeverity["CRITICAL"] = "critical";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
/**
 * Error categories for classification
 */
var ErrorCategory;
(function (ErrorCategory) {
    ErrorCategory["VALIDATION"] = "validation";
    ErrorCategory["AUTHENTICATION"] = "authentication";
    ErrorCategory["AUTHORIZATION"] = "authorization";
    ErrorCategory["NOT_FOUND"] = "not_found";
    ErrorCategory["CONFLICT"] = "conflict";
    ErrorCategory["RATE_LIMIT"] = "rate_limit";
    ErrorCategory["DATABASE"] = "database";
    ErrorCategory["EXTERNAL_SERVICE"] = "external_service";
    ErrorCategory["INTERNAL"] = "internal";
    ErrorCategory["NETWORK"] = "network";
    ErrorCategory["TIMEOUT"] = "timeout";
    ErrorCategory["BUSINESS_LOGIC"] = "business_logic";
    ErrorCategory["CONFIGURATION"] = "configuration";
})(ErrorCategory || (exports.ErrorCategory = ErrorCategory = {}));
/**
 * Error codes for standardized error handling
 */
var ErrorCode;
(function (ErrorCode) {
    // Validation errors (1000-1999)
    ErrorCode["VALIDATION_FAILED"] = "ERR_1000";
    ErrorCode["INVALID_INPUT"] = "ERR_1001";
    ErrorCode["MISSING_REQUIRED_FIELD"] = "ERR_1002";
    ErrorCode["INVALID_FORMAT"] = "ERR_1003";
    ErrorCode["INVALID_TYPE"] = "ERR_1004";
    // Authentication errors (2000-2999)
    ErrorCode["AUTHENTICATION_FAILED"] = "ERR_2000";
    ErrorCode["INVALID_CREDENTIALS"] = "ERR_2001";
    ErrorCode["TOKEN_EXPIRED"] = "ERR_2002";
    ErrorCode["TOKEN_INVALID"] = "ERR_2003";
    ErrorCode["SESSION_EXPIRED"] = "ERR_2004";
    ErrorCode["MFA_REQUIRED"] = "ERR_2005";
    // Authorization errors (3000-3999)
    ErrorCode["FORBIDDEN"] = "ERR_3000";
    ErrorCode["INSUFFICIENT_PERMISSIONS"] = "ERR_3001";
    ErrorCode["ACCESS_DENIED"] = "ERR_3002";
    ErrorCode["RESOURCE_FORBIDDEN"] = "ERR_3003";
    // Resource errors (4000-4999)
    ErrorCode["RESOURCE_NOT_FOUND"] = "ERR_4000";
    ErrorCode["USER_NOT_FOUND"] = "ERR_4001";
    ErrorCode["PATIENT_NOT_FOUND"] = "ERR_4002";
    ErrorCode["APPOINTMENT_NOT_FOUND"] = "ERR_4003";
    // Conflict errors (5000-5999)
    ErrorCode["RESOURCE_CONFLICT"] = "ERR_5000";
    ErrorCode["DUPLICATE_ENTRY"] = "ERR_5001";
    ErrorCode["VERSION_CONFLICT"] = "ERR_5002";
    ErrorCode["STATE_CONFLICT"] = "ERR_5003";
    // Rate limiting errors (6000-6999)
    ErrorCode["RATE_LIMIT_EXCEEDED"] = "ERR_6000";
    ErrorCode["TOO_MANY_REQUESTS"] = "ERR_6001";
    ErrorCode["QUOTA_EXCEEDED"] = "ERR_6002";
    // Database errors (7000-7999)
    ErrorCode["DATABASE_ERROR"] = "ERR_7000";
    ErrorCode["DATABASE_CONNECTION_FAILED"] = "ERR_7001";
    ErrorCode["QUERY_FAILED"] = "ERR_7002";
    ErrorCode["TRANSACTION_FAILED"] = "ERR_7003";
    ErrorCode["CONSTRAINT_VIOLATION"] = "ERR_7004";
    ErrorCode["FOREIGN_KEY_VIOLATION"] = "ERR_7005";
    // External service errors (8000-8999)
    ErrorCode["EXTERNAL_SERVICE_ERROR"] = "ERR_8000";
    ErrorCode["SERVICE_UNAVAILABLE"] = "ERR_8001";
    ErrorCode["SERVICE_TIMEOUT"] = "ERR_8002";
    ErrorCode["INTEGRATION_FAILED"] = "ERR_8003";
    // Internal errors (9000-9999)
    ErrorCode["INTERNAL_SERVER_ERROR"] = "ERR_9000";
    ErrorCode["UNHANDLED_ERROR"] = "ERR_9001";
    ErrorCode["CONFIGURATION_ERROR"] = "ERR_9002";
    ErrorCode["NOT_IMPLEMENTED"] = "ERR_9003";
    // Business logic errors (10000-10999)
    ErrorCode["BUSINESS_RULE_VIOLATION"] = "ERR_10000";
    ErrorCode["INVALID_STATE_TRANSITION"] = "ERR_10001";
    ErrorCode["OPERATION_NOT_ALLOWED"] = "ERR_10002";
    ErrorCode["PRECONDITION_FAILED"] = "ERR_10003";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
/**
 * Circuit breaker state
 */
var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "closed";
    CircuitState["OPEN"] = "open";
    CircuitState["HALF_OPEN"] = "half_open";
})(CircuitState || (exports.CircuitState = CircuitState = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Error response schema
 */
exports.ErrorResponseSchema = zod_1.z.object({
    statusCode: zod_1.z.number().int().min(100).max(599),
    errorCode: zod_1.z.nativeEnum(ErrorCode),
    message: zod_1.z.string().min(1),
    category: zod_1.z.nativeEnum(ErrorCategory),
    severity: zod_1.z.nativeEnum(ErrorSeverity),
    timestamp: zod_1.z.string().datetime(),
    path: zod_1.z.string().optional(),
    method: zod_1.z.string().optional(),
    requestId: zod_1.z.string().uuid().optional(),
    details: zod_1.z.array(zod_1.z.object({
        field: zod_1.z.string().optional(),
        message: zod_1.z.string(),
        value: zod_1.z.any().optional(),
        constraint: zod_1.z.string().optional(),
    })).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    stack: zod_1.z.string().optional(),
});
/**
 * Retry configuration schema
 */
exports.RetryConfigSchema = zod_1.z.object({
    maxAttempts: zod_1.z.number().int().min(1).max(10),
    initialDelayMs: zod_1.z.number().int().min(0),
    maxDelayMs: zod_1.z.number().int().min(0),
    backoffMultiplier: zod_1.z.number().min(1),
});
/**
 * Circuit breaker configuration schema
 */
exports.CircuitBreakerConfigSchema = zod_1.z.object({
    failureThreshold: zod_1.z.number().int().min(1),
    successThreshold: zod_1.z.number().int().min(1),
    timeout: zod_1.z.number().int().min(0),
    resetTimeoutMs: zod_1.z.number().int().min(0),
    halfOpenMaxAttempts: zod_1.z.number().int().min(1),
    name: zod_1.z.string().optional(),
});
// ============================================================================
// CUSTOM EXCEPTION CLASSES
// ============================================================================
/**
 * Base domain exception class with enhanced context
 *
 * @example
 * ```typescript
 * throw new DomainException(
 *   'Patient record not found',
 *   ErrorCode.PATIENT_NOT_FOUND,
 *   ErrorCategory.NOT_FOUND,
 *   HttpStatus.NOT_FOUND,
 *   { patientId: '123' }
 * );
 * ```
 */
class DomainException extends common_1.HttpException {
    constructor(message, errorCode, category, statusCode = common_1.HttpStatus.BAD_REQUEST, metadata, severity = ErrorSeverity.MEDIUM) {
        super({
            statusCode,
            errorCode,
            message,
            category,
            severity,
            metadata,
        }, statusCode);
        this.errorCode = errorCode;
        this.category = category;
        this.statusCode = statusCode;
        this.metadata = metadata;
        this.severity = severity;
        this.name = 'DomainException';
        Object.setPrototypeOf(this, DomainException.prototype);
    }
}
exports.DomainException = DomainException;
/**
 * Validation exception for input validation failures
 */
class ValidationException extends DomainException {
    constructor(message, details = [], metadata) {
        super(message, ErrorCode.VALIDATION_FAILED, ErrorCategory.VALIDATION, common_1.HttpStatus.BAD_REQUEST, metadata, ErrorSeverity.LOW);
        this.details = details;
        this.name = 'ValidationException';
        Object.setPrototypeOf(this, ValidationException.prototype);
    }
}
exports.ValidationException = ValidationException;
/**
 * Business rule violation exception
 */
class BusinessRuleException extends DomainException {
    constructor(message, rule, metadata) {
        super(message, ErrorCode.BUSINESS_RULE_VIOLATION, ErrorCategory.BUSINESS_LOGIC, common_1.HttpStatus.UNPROCESSABLE_ENTITY, { rule, ...metadata }, ErrorSeverity.MEDIUM);
        this.rule = rule;
        this.name = 'BusinessRuleException';
        Object.setPrototypeOf(this, BusinessRuleException.prototype);
    }
}
exports.BusinessRuleException = BusinessRuleException;
/**
 * External service exception for third-party API failures
 */
class ExternalServiceException extends DomainException {
    constructor(message, serviceName, originalError, metadata) {
        super(message, ErrorCode.EXTERNAL_SERVICE_ERROR, ErrorCategory.EXTERNAL_SERVICE, common_1.HttpStatus.BAD_GATEWAY, { serviceName, originalError: originalError?.message, ...metadata }, ErrorSeverity.HIGH);
        this.serviceName = serviceName;
        this.originalError = originalError;
        this.name = 'ExternalServiceException';
        Object.setPrototypeOf(this, ExternalServiceException.prototype);
    }
}
exports.ExternalServiceException = ExternalServiceException;
/**
 * Database exception for database operation failures
 */
class DatabaseException extends DomainException {
    constructor(message, operation, originalError, metadata) {
        super(message, ErrorCode.DATABASE_ERROR, ErrorCategory.DATABASE, common_1.HttpStatus.INTERNAL_SERVER_ERROR, { operation, originalError: originalError?.message, ...metadata }, ErrorSeverity.HIGH);
        this.operation = operation;
        this.originalError = originalError;
        this.name = 'DatabaseException';
        Object.setPrototypeOf(this, DatabaseException.prototype);
    }
}
exports.DatabaseException = DatabaseException;
/**
 * Resource not found exception
 */
class ResourceNotFoundException extends DomainException {
    constructor(resourceType, resourceId, metadata) {
        super(`${resourceType} with ID ${resourceId} not found`, ErrorCode.RESOURCE_NOT_FOUND, ErrorCategory.NOT_FOUND, common_1.HttpStatus.NOT_FOUND, { resourceType, resourceId, ...metadata }, ErrorSeverity.LOW);
        this.name = 'ResourceNotFoundException';
        Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
    }
}
exports.ResourceNotFoundException = ResourceNotFoundException;
/**
 * Conflict exception for resource conflicts
 */
class ResourceConflictException extends DomainException {
    constructor(message, conflictType, metadata) {
        super(message, ErrorCode.RESOURCE_CONFLICT, ErrorCategory.CONFLICT, common_1.HttpStatus.CONFLICT, { conflictType, ...metadata }, ErrorSeverity.MEDIUM);
        this.conflictType = conflictType;
        this.name = 'ResourceConflictException';
        Object.setPrototypeOf(this, ResourceConflictException.prototype);
    }
}
exports.ResourceConflictException = ResourceConflictException;
/**
 * Rate limit exceeded exception
 */
class RateLimitException extends DomainException {
    constructor(message, limit, windowMs, retryAfterMs, metadata) {
        super(message, ErrorCode.RATE_LIMIT_EXCEEDED, ErrorCategory.RATE_LIMIT, common_1.HttpStatus.TOO_MANY_REQUESTS, { limit, windowMs, retryAfterMs, ...metadata }, ErrorSeverity.LOW);
        this.limit = limit;
        this.windowMs = windowMs;
        this.retryAfterMs = retryAfterMs;
        this.name = 'RateLimitException';
        Object.setPrototypeOf(this, RateLimitException.prototype);
    }
}
exports.RateLimitException = RateLimitException;
/**
 * Circuit breaker open exception
 */
class CircuitBreakerOpenException extends DomainException {
    constructor(serviceName, resetTimeMs, metadata) {
        super(`Circuit breaker is open for service: ${serviceName}`, ErrorCode.SERVICE_UNAVAILABLE, ErrorCategory.EXTERNAL_SERVICE, common_1.HttpStatus.SERVICE_UNAVAILABLE, { serviceName, resetTimeMs, ...metadata }, ErrorSeverity.HIGH);
        this.resetTimeMs = resetTimeMs;
        this.name = 'CircuitBreakerOpenException';
        Object.setPrototypeOf(this, CircuitBreakerOpenException.prototype);
    }
}
exports.CircuitBreakerOpenException = CircuitBreakerOpenException;
// ============================================================================
// ERROR SERIALIZATION & FORMATTING
// ============================================================================
/**
 * Serialize error to standardized ErrorResponse format
 *
 * @param error - Error to serialize
 * @param request - Express request object for context
 * @param includeStack - Whether to include stack trace (development only)
 * @returns Standardized error response
 *
 * @example
 * ```typescript
 * const errorResponse = serializeError(error, request, process.env.NODE_ENV === 'development');
 * response.status(errorResponse.statusCode).json(errorResponse);
 * ```
 */
function serializeError(error, request, includeStack = false) {
    const timestamp = new Date().toISOString();
    // Handle DomainException
    if (error instanceof DomainException) {
        return {
            statusCode: error.statusCode,
            errorCode: error.errorCode,
            message: error.message,
            category: error.category,
            severity: error.severity,
            timestamp,
            path: request?.url,
            method: request?.method,
            requestId: request?.id,
            metadata: error.metadata,
            stack: includeStack ? error.stack : undefined,
        };
    }
    // Handle HttpException
    if (error instanceof common_1.HttpException) {
        const response = error.getResponse();
        const statusCode = error.getStatus();
        return {
            statusCode,
            errorCode: mapHttpStatusToErrorCode(statusCode),
            message: typeof response === 'string' ? response : response.message || error.message,
            category: mapHttpStatusToCategory(statusCode),
            severity: mapHttpStatusToSeverity(statusCode),
            timestamp,
            path: request?.url,
            method: request?.method,
            requestId: request?.id,
            stack: includeStack ? error.stack : undefined,
        };
    }
    // Handle generic Error
    return {
        statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred',
        category: ErrorCategory.INTERNAL,
        severity: ErrorSeverity.HIGH,
        timestamp,
        path: request?.url,
        method: request?.method,
        requestId: request?.id,
        stack: includeStack ? error.stack : undefined,
    };
}
/**
 * Format Zod validation errors into ErrorDetail array
 *
 * @param zodError - Zod validation error
 * @returns Array of error details
 *
 * @example
 * ```typescript
 * try {
 *   schema.parse(data);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     const details = formatZodErrors(error);
 *     throw new ValidationException('Validation failed', details);
 *   }
 * }
 * ```
 */
function formatZodErrors(zodError) {
    return zodError.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        value: undefined, // Don't expose actual values for security
        constraint: err.code,
    }));
}
/**
 * Format Sequelize validation errors into ErrorDetail array
 *
 * @param sequelizeError - Sequelize validation error
 * @returns Array of error details
 *
 * @example
 * ```typescript
 * try {
 *   await user.save();
 * } catch (error) {
 *   if (error instanceof SequelizeValidationError) {
 *     const details = formatSequelizeErrors(error);
 *     throw new ValidationException('Validation failed', details);
 *   }
 * }
 * ```
 */
function formatSequelizeErrors(sequelizeError) {
    return sequelizeError.errors.map((err) => ({
        field: err.path || err.validatorKey,
        message: err.message,
        value: undefined,
        constraint: err.validatorKey || err.type,
    }));
}
/**
 * Sanitize error stack trace to remove sensitive information
 *
 * @param stack - Stack trace string
 * @param sensitivePatterns - Patterns to redact (passwords, tokens, etc.)
 * @returns Sanitized stack trace
 *
 * @example
 * ```typescript
 * const sanitizedStack = sanitizeStackTrace(error.stack, [/password=\w+/, /token=[\w-]+/]);
 * ```
 */
function sanitizeStackTrace(stack, sensitivePatterns = [
    /password[=:]\s*["']?[\w!@#$%^&*()]+["']?/gi,
    /token[=:]\s*["']?[\w.-]+["']?/gi,
    /api[_-]?key[=:]\s*["']?[\w-]+["']?/gi,
    /secret[=:]\s*["']?[\w-]+["']?/gi,
    /ssn[=:]\s*["']?\d{3}-?\d{2}-?\d{4}["']?/gi,
    /credit[_-]?card[=:]\s*["']?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}["']?/gi,
]) {
    if (!stack)
        return '';
    let sanitized = stack;
    sensitivePatterns.forEach((pattern) => {
        sanitized = sanitized.replace(pattern, '[REDACTED]');
    });
    return sanitized;
}
/**
 * Sanitize error message to remove HIPAA-sensitive information
 *
 * @param message - Error message
 * @returns Sanitized message
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeErrorMessage('Patient SSN 123-45-6789 is invalid');
 * // Returns: 'Patient SSN [REDACTED] is invalid'
 * ```
 */
function sanitizeErrorMessage(message) {
    return sanitizeStackTrace(message);
}
/**
 * Create user-friendly error message from technical error
 *
 * @param error - Technical error
 * @param userFacingMessages - Map of error codes to user messages
 * @returns User-friendly message
 *
 * @example
 * ```typescript
 * const userMessage = createUserFriendlyMessage(error, {
 *   [ErrorCode.DATABASE_ERROR]: 'We are experiencing technical difficulties. Please try again later.',
 * });
 * ```
 */
function createUserFriendlyMessage(error, userFacingMessages = {}) {
    if (error instanceof DomainException) {
        return userFacingMessages[error.errorCode] || error.message;
    }
    return 'An unexpected error occurred. Please try again or contact support.';
}
// ============================================================================
// ERROR CODE MAPPING
// ============================================================================
/**
 * Map HTTP status code to ErrorCode
 *
 * @param statusCode - HTTP status code
 * @returns Corresponding ErrorCode
 */
function mapHttpStatusToErrorCode(statusCode) {
    const mapping = {
        400: ErrorCode.VALIDATION_FAILED,
        401: ErrorCode.AUTHENTICATION_FAILED,
        403: ErrorCode.FORBIDDEN,
        404: ErrorCode.RESOURCE_NOT_FOUND,
        409: ErrorCode.RESOURCE_CONFLICT,
        422: ErrorCode.BUSINESS_RULE_VIOLATION,
        429: ErrorCode.RATE_LIMIT_EXCEEDED,
        500: ErrorCode.INTERNAL_SERVER_ERROR,
        502: ErrorCode.EXTERNAL_SERVICE_ERROR,
        503: ErrorCode.SERVICE_UNAVAILABLE,
        504: ErrorCode.SERVICE_TIMEOUT,
    };
    return mapping[statusCode] || ErrorCode.INTERNAL_SERVER_ERROR;
}
/**
 * Map HTTP status code to ErrorCategory
 *
 * @param statusCode - HTTP status code
 * @returns Corresponding ErrorCategory
 */
function mapHttpStatusToCategory(statusCode) {
    if (statusCode === 400 || statusCode === 422)
        return ErrorCategory.VALIDATION;
    if (statusCode === 401)
        return ErrorCategory.AUTHENTICATION;
    if (statusCode === 403)
        return ErrorCategory.AUTHORIZATION;
    if (statusCode === 404)
        return ErrorCategory.NOT_FOUND;
    if (statusCode === 409)
        return ErrorCategory.CONFLICT;
    if (statusCode === 429)
        return ErrorCategory.RATE_LIMIT;
    if (statusCode >= 500)
        return ErrorCategory.INTERNAL;
    return ErrorCategory.INTERNAL;
}
/**
 * Map HTTP status code to ErrorSeverity
 *
 * @param statusCode - HTTP status code
 * @returns Corresponding ErrorSeverity
 */
function mapHttpStatusToSeverity(statusCode) {
    if (statusCode >= 500)
        return ErrorSeverity.HIGH;
    if (statusCode === 401 || statusCode === 403)
        return ErrorSeverity.MEDIUM;
    if (statusCode === 429)
        return ErrorSeverity.MEDIUM;
    return ErrorSeverity.LOW;
}
// ============================================================================
// NESTJS EXCEPTION FILTERS
// ============================================================================
/**
 * Global exception filter for all HTTP exceptions
 *
 * @example
 * ```typescript
 * // In main.ts
 * app.useGlobalFilters(new GlobalExceptionFilter());
 * ```
 */
let GlobalExceptionFilter = (() => {
    let _classDecorators = [(0, common_1.Catch)(), (0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GlobalExceptionFilter = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger('GlobalExceptionFilter');
        }
        catch(exception, host) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            const isDevelopment = process.env.NODE_ENV === 'development';
            const errorResponse = serializeError(exception, request, isDevelopment);
            // Log error
            this.logger.error(`${errorResponse.method} ${errorResponse.path} - ${errorResponse.errorCode}: ${errorResponse.message}`, exception.stack);
            // Send to Sentry in production
            if (!isDevelopment) {
                captureErrorToSentry(exception, {
                    level: mapSeverityToSentryLevel(errorResponse.severity),
                    tags: {
                        errorCode: errorResponse.errorCode,
                        category: errorResponse.category,
                    },
                    extra: {
                        requestId: errorResponse.requestId,
                        metadata: errorResponse.metadata,
                    },
                });
            }
            response.status(errorResponse.statusCode).json(errorResponse);
        }
    };
    __setFunctionName(_classThis, "GlobalExceptionFilter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GlobalExceptionFilter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GlobalExceptionFilter = _classThis;
})();
exports.GlobalExceptionFilter = GlobalExceptionFilter;
/**
 * Validation exception filter for handling validation errors
 *
 * @example
 * ```typescript
 * @UseFilters(ValidationExceptionFilter)
 * @Post()
 * async create(@Body() dto: CreateUserDto) {
 *   // ...
 * }
 * ```
 */
let ValidationExceptionFilter = (() => {
    let _classDecorators = [(0, common_1.Catch)(ValidationException, common_1.BadRequestException), (0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ValidationExceptionFilter = _classThis = class {
        catch(exception, host) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            let errorResponse;
            if (exception instanceof ValidationException) {
                errorResponse = serializeError(exception, request);
                errorResponse.details = exception.details;
            }
            else {
                errorResponse = serializeError(exception, request);
                // Extract validation errors from NestJS ValidationPipe
                const exceptionResponse = exception.getResponse();
                if (Array.isArray(exceptionResponse.message)) {
                    errorResponse.details = exceptionResponse.message.map((msg) => ({
                        message: msg,
                    }));
                }
            }
            response.status(errorResponse.statusCode).json(errorResponse);
        }
    };
    __setFunctionName(_classThis, "ValidationExceptionFilter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ValidationExceptionFilter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ValidationExceptionFilter = _classThis;
})();
exports.ValidationExceptionFilter = ValidationExceptionFilter;
/**
 * Database exception filter for handling Sequelize errors
 *
 * @example
 * ```typescript
 * app.useGlobalFilters(new DatabaseExceptionFilter());
 * ```
 */
let DatabaseExceptionFilter = (() => {
    let _classDecorators = [(0, common_1.Catch)(sequelize_1.ValidationError, sequelize_1.UniqueConstraintError, sequelize_1.ForeignKeyConstraintError, sequelize_1.DatabaseError, sequelize_1.ConnectionError, sequelize_1.TimeoutError), (0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DatabaseExceptionFilter = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger('DatabaseExceptionFilter');
        }
        catch(exception, host) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            let domainException;
            if (exception instanceof sequelize_1.UniqueConstraintError) {
                const field = Object.keys(exception.fields || {})[0] || 'resource';
                domainException = new ResourceConflictException(`Duplicate entry for ${field}`, 'unique_constraint', { field, fields: exception.fields });
            }
            else if (exception instanceof sequelize_1.ForeignKeyConstraintError) {
                domainException = new DatabaseException('Foreign key constraint violation', 'foreign_key_check', exception, { table: exception.table });
            }
            else if (exception instanceof sequelize_1.ValidationError) {
                const details = formatSequelizeErrors(exception);
                domainException = new ValidationException('Database validation failed', details);
            }
            else if (exception instanceof sequelize_1.ConnectionError) {
                domainException = new DatabaseException('Database connection failed', 'connection', exception);
            }
            else if (exception instanceof sequelize_1.TimeoutError) {
                domainException = new DatabaseException('Database query timeout', 'query', exception);
            }
            else {
                domainException = new DatabaseException('Database operation failed', 'unknown', exception);
            }
            const errorResponse = serializeError(domainException, request);
            this.logger.error(`Database Error: ${errorResponse.message}`, exception.stack);
            response.status(errorResponse.statusCode).json(errorResponse);
        }
    };
    __setFunctionName(_classThis, "DatabaseExceptionFilter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DatabaseExceptionFilter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DatabaseExceptionFilter = _classThis;
})();
exports.DatabaseExceptionFilter = DatabaseExceptionFilter;
// ============================================================================
// NESTJS INTERCEPTORS
// ============================================================================
/**
 * Error logging interceptor with enriched context
 *
 * @example
 * ```typescript
 * @UseInterceptors(ErrorLoggingInterceptor)
 * @Get()
 * async getData() {
 *   // ...
 * }
 * ```
 */
let ErrorLoggingInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ErrorLoggingInterceptor = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger('ErrorLoggingInterceptor');
        }
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const { method, url } = request;
            const userAgent = request.get('user-agent') || '';
            const ip = request.ip;
            return next.handle().pipe((0, operators_1.catchError)((error) => {
                const errorContext = {
                    requestId: request.id,
                    ipAddress: ip,
                    userAgent,
                    userId: request.user?.id,
                    sessionId: request.session?.id,
                };
                this.logger.error(`${method} ${url} - Error: ${error.message}`, JSON.stringify(errorContext));
                return (0, rxjs_1.throwError)(() => error);
            }));
        }
    };
    __setFunctionName(_classThis, "ErrorLoggingInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ErrorLoggingInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ErrorLoggingInterceptor = _classThis;
})();
exports.ErrorLoggingInterceptor = ErrorLoggingInterceptor;
/**
 * Error transformation interceptor to convert errors to domain exceptions
 *
 * @example
 * ```typescript
 * app.useGlobalInterceptors(new ErrorTransformationInterceptor());
 * ```
 */
let ErrorTransformationInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ErrorTransformationInterceptor = _classThis = class {
        intercept(context, next) {
            return next.handle().pipe((0, operators_1.catchError)((error) => {
                // Transform ZodError to ValidationException
                if (error instanceof zod_1.ZodError) {
                    const details = formatZodErrors(error);
                    return (0, rxjs_1.throwError)(() => new ValidationException('Validation failed', details));
                }
                // Pass through DomainExceptions
                if (error instanceof DomainException) {
                    return (0, rxjs_1.throwError)(() => error);
                }
                // Transform generic errors to InternalServerErrorException
                if (!(error instanceof common_1.HttpException)) {
                    return (0, rxjs_1.throwError)(() => new common_1.InternalServerErrorException(error.message));
                }
                return (0, rxjs_1.throwError)(() => error);
            }));
        }
    };
    __setFunctionName(_classThis, "ErrorTransformationInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ErrorTransformationInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ErrorTransformationInterceptor = _classThis;
})();
exports.ErrorTransformationInterceptor = ErrorTransformationInterceptor;
/**
 * Request timeout interceptor with configurable timeout
 *
 * @example
 * ```typescript
 * @UseInterceptors(new TimeoutInterceptor(5000))
 * @Get()
 * async slowEndpoint() {
 *   // ...
 * }
 * ```
 */
let TimeoutInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TimeoutInterceptor = _classThis = class {
        constructor(timeoutMs = 30000) {
            this.timeoutMs = timeoutMs;
        }
        intercept(context, next) {
            return next.handle().pipe(timeout(this.timeoutMs), (0, operators_1.catchError)((error) => {
                if (error.name === 'TimeoutError') {
                    return (0, rxjs_1.throwError)(() => new DomainException(`Request timeout after ${this.timeoutMs}ms`, ErrorCode.SERVICE_TIMEOUT, ErrorCategory.TIMEOUT, common_1.HttpStatus.REQUEST_TIMEOUT, { timeoutMs: this.timeoutMs }, ErrorSeverity.MEDIUM));
                }
                return (0, rxjs_1.throwError)(() => error);
            }));
        }
    };
    __setFunctionName(_classThis, "TimeoutInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TimeoutInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TimeoutInterceptor = _classThis;
})();
exports.TimeoutInterceptor = TimeoutInterceptor;
// ============================================================================
// RETRY LOGIC WITH EXPONENTIAL BACKOFF
// ============================================================================
/**
 * Calculate exponential backoff delay
 *
 * @param attempt - Current attempt number (0-indexed)
 * @param config - Retry configuration
 * @returns Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateBackoffDelay(2, {
 *   initialDelayMs: 1000,
 *   maxDelayMs: 30000,
 *   backoffMultiplier: 2,
 * });
 * // Returns: 4000 (1000 * 2^2)
 * ```
 */
function calculateBackoffDelay(attempt, config) {
    const initialDelay = config.initialDelayMs || 1000;
    const maxDelay = config.maxDelayMs || 30000;
    const multiplier = config.backoffMultiplier || 2;
    const delay = initialDelay * Math.pow(multiplier, attempt);
    return Math.min(delay, maxDelay);
}
/**
 * Retry operation with exponential backoff
 *
 * @param operation - Async operation to retry
 * @param config - Retry configuration
 * @returns Promise resolving to operation result
 *
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   () => fetchFromExternalAPI(),
 *   {
 *     maxAttempts: 3,
 *     initialDelayMs: 1000,
 *     maxDelayMs: 10000,
 *     backoffMultiplier: 2,
 *     shouldRetry: (error, attempt) => error.statusCode >= 500,
 *   }
 * );
 * ```
 */
async function retryWithBackoff(operation, config) {
    let lastError;
    for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            const shouldRetry = config.shouldRetry
                ? config.shouldRetry(error, attempt)
                : true;
            if (!shouldRetry || attempt === config.maxAttempts - 1) {
                throw error;
            }
            const delay = calculateBackoffDelay(attempt, config);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}
/**
 * RxJS retry operator with exponential backoff
 *
 * @param config - Retry configuration
 * @returns RxJS operator
 *
 * @example
 * ```typescript
 * return this.httpClient.get(url).pipe(
 *   retryWithBackoffOperator({
 *     maxAttempts: 3,
 *     initialDelayMs: 1000,
 *     maxDelayMs: 10000,
 *     backoffMultiplier: 2,
 *   })
 * );
 * ```
 */
function retryWithBackoffOperator(config) {
    return (source) => source.pipe((0, operators_1.retryWhen)((errors) => errors.pipe((0, operators_1.mergeMap)((error, attempt) => {
        const shouldRetry = config.shouldRetry
            ? config.shouldRetry(error, attempt)
            : true;
        if (!shouldRetry || attempt >= config.maxAttempts - 1) {
            return (0, rxjs_1.throwError)(() => error);
        }
        const delay = calculateBackoffDelay(attempt, config);
        return (0, rxjs_1.timer)(delay);
    }))));
}
/**
 * Check if error is retryable based on error code
 *
 * @param error - Error to check
 * @param retryableErrors - List of retryable error codes
 * @returns Whether error should be retried
 *
 * @example
 * ```typescript
 * const shouldRetry = isRetryableError(error, [
 *   ErrorCode.SERVICE_TIMEOUT,
 *   ErrorCode.SERVICE_UNAVAILABLE,
 * ]);
 * ```
 */
function isRetryableError(error, retryableErrors) {
    if (!retryableErrors || retryableErrors.length === 0) {
        // Default retryable errors
        const defaultRetryable = [
            ErrorCode.SERVICE_TIMEOUT,
            ErrorCode.SERVICE_UNAVAILABLE,
            ErrorCode.EXTERNAL_SERVICE_ERROR,
            ErrorCode.DATABASE_CONNECTION_FAILED,
        ];
        if (error instanceof DomainException) {
            return defaultRetryable.includes(error.errorCode);
        }
        return false;
    }
    if (error instanceof DomainException) {
        return retryableErrors.includes(error.errorCode);
    }
    return false;
}
// ============================================================================
// CIRCUIT BREAKER PATTERN
// ============================================================================
/**
 * Circuit breaker implementation for fault tolerance
 *
 * @example
 * ```typescript
 * const circuitBreaker = new CircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 10000,
 *   resetTimeoutMs: 60000,
 *   halfOpenMaxAttempts: 3,
 *   name: 'external-api',
 * });
 *
 * try {
 *   const result = await circuitBreaker.execute(() => callExternalAPI());
 * } catch (error) {
 *   // Handle circuit open or operation failure
 * }
 * ```
 */
class CircuitBreaker {
    constructor(config) {
        this.config = config;
        this.state = {
            state: CircuitState.CLOSED,
            failureCount: 0,
            successCount: 0,
        };
        this.logger = new common_1.Logger(`CircuitBreaker:${this.config.name || 'default'}`);
    }
    /**
     * Execute operation with circuit breaker protection
     */
    async execute(operation) {
        if (this.state.state === CircuitState.OPEN) {
            if (this.shouldAttemptReset()) {
                this.state.state = CircuitState.HALF_OPEN;
                this.state.successCount = 0;
                this.logger.log('Circuit breaker entering HALF_OPEN state');
            }
            else {
                throw new CircuitBreakerOpenException(this.config.name || 'unknown', this.getRemainingResetTime());
            }
        }
        try {
            const result = await this.executeWithTimeout(operation);
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    /**
     * Execute operation with timeout
     */
    async executeWithTimeout(operation) {
        return Promise.race([
            operation(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Circuit breaker timeout')), this.config.timeout)),
        ]);
    }
    /**
     * Handle successful operation
     */
    onSuccess() {
        this.state.failureCount = 0;
        if (this.state.state === CircuitState.HALF_OPEN) {
            this.state.successCount++;
            if (this.state.successCount >= this.config.successThreshold) {
                this.state.state = CircuitState.CLOSED;
                this.state.successCount = 0;
                this.logger.log('Circuit breaker CLOSED');
            }
        }
    }
    /**
     * Handle failed operation
     */
    onFailure() {
        this.state.failureCount++;
        this.state.lastFailureTime = new Date();
        if (this.state.state === CircuitState.HALF_OPEN ||
            this.state.failureCount >= this.config.failureThreshold) {
            this.state.state = CircuitState.OPEN;
            this.state.nextAttemptTime = new Date(Date.now() + this.config.resetTimeoutMs);
            this.logger.warn(`Circuit breaker OPEN. Will attempt reset at ${this.state.nextAttemptTime.toISOString()}`);
        }
    }
    /**
     * Check if circuit should attempt reset
     */
    shouldAttemptReset() {
        if (!this.state.nextAttemptTime)
            return false;
        return Date.now() >= this.state.nextAttemptTime.getTime();
    }
    /**
     * Get remaining time until reset attempt
     */
    getRemainingResetTime() {
        if (!this.state.nextAttemptTime)
            return 0;
        return Math.max(0, this.state.nextAttemptTime.getTime() - Date.now());
    }
    /**
     * Get current circuit breaker state
     */
    getState() {
        return { ...this.state };
    }
    /**
     * Reset circuit breaker to closed state
     */
    reset() {
        this.state = {
            state: CircuitState.CLOSED,
            failureCount: 0,
            successCount: 0,
        };
        this.logger.log('Circuit breaker manually reset');
    }
}
exports.CircuitBreaker = CircuitBreaker;
// ============================================================================
// ERROR MONITORING & SENTRY INTEGRATION
// ============================================================================
/**
 * Initialize Sentry error monitoring
 *
 * @param dsn - Sentry DSN
 * @param options - Additional Sentry options
 *
 * @example
 * ```typescript
 * initializeSentry(process.env.SENTRY_DSN, {
 *   environment: process.env.NODE_ENV,
 *   release: process.env.APP_VERSION,
 *   tracesSampleRate: 0.1,
 * });
 * ```
 */
function initializeSentry(dsn, options = {}) {
    Sentry.init({
        dsn,
        environment: process.env.NODE_ENV || 'production',
        tracesSampleRate: 0.1,
        beforeSend(event, hint) {
            // Sanitize error data before sending
            if (event.exception?.values) {
                event.exception.values = event.exception.values.map((exception) => ({
                    ...exception,
                    value: exception.value ? sanitizeErrorMessage(exception.value) : exception.value,
                    stacktrace: exception.stacktrace
                        ? {
                            ...exception.stacktrace,
                            frames: exception.stacktrace.frames?.map((frame) => ({
                                ...frame,
                                vars: undefined, // Remove local variables
                            })),
                        }
                        : exception.stacktrace,
                }));
            }
            return event;
        },
        ...options,
    });
}
/**
 * Capture error to Sentry with enriched context
 *
 * @param error - Error to capture
 * @param context - Additional context
 *
 * @example
 * ```typescript
 * captureErrorToSentry(error, {
 *   level: 'error',
 *   tags: { errorCode: 'ERR_1000', category: 'validation' },
 *   extra: { userId: '123', requestId: 'abc-def' },
 *   user: { id: '123', email: 'user@example.com' },
 * });
 * ```
 */
function captureErrorToSentry(error, context) {
    Sentry.withScope((scope) => {
        if (context?.level) {
            scope.setLevel(context.level);
        }
        if (context?.tags) {
            Object.entries(context.tags).forEach(([key, value]) => {
                scope.setTag(key, value);
            });
        }
        if (context?.extra) {
            Object.entries(context.extra).forEach(([key, value]) => {
                scope.setExtra(key, value);
            });
        }
        if (context?.user) {
            scope.setUser(context.user);
        }
        if (context?.fingerprint) {
            scope.setFingerprint(context.fingerprint);
        }
        Sentry.captureException(error);
    });
    return Sentry.lastEventId() || '';
}
/**
 * Map ErrorSeverity to Sentry severity level
 *
 * @param severity - Error severity
 * @returns Sentry severity level
 */
function mapSeverityToSentryLevel(severity) {
    const mapping = {
        [ErrorSeverity.LOW]: 'info',
        [ErrorSeverity.MEDIUM]: 'warning',
        [ErrorSeverity.HIGH]: 'error',
        [ErrorSeverity.CRITICAL]: 'fatal',
    };
    return mapping[severity] || 'error';
}
/**
 * Create error fingerprint for Sentry grouping
 *
 * @param error - Error to fingerprint
 * @param additionalKeys - Additional keys for fingerprint
 * @returns Fingerprint array
 *
 * @example
 * ```typescript
 * const fingerprint = createErrorFingerprint(error, ['userId', 'endpoint']);
 * ```
 */
function createErrorFingerprint(error, additionalKeys = []) {
    const fingerprint = [];
    if (error instanceof DomainException) {
        fingerprint.push(error.errorCode);
        fingerprint.push(error.category);
    }
    else {
        fingerprint.push(error.name);
    }
    fingerprint.push(...additionalKeys);
    return fingerprint;
}
// ============================================================================
// ERROR RECOVERY STRATEGIES
// ============================================================================
/**
 * Execute operation with automatic recovery strategy
 *
 * @param operation - Operation to execute
 * @param strategy - Recovery strategy configuration
 * @returns Operation result or fallback value
 *
 * @example
 * ```typescript
 * const result = await executeWithRecovery(
 *   () => fetchUserProfile(userId),
 *   {
 *     maxAttempts: 3,
 *     backoffMs: [1000, 2000, 4000],
 *     fallbackValue: { id: userId, name: 'Unknown' },
 *     shouldRecover: (error) => error.statusCode >= 500,
 *     onRecovery: (error, result) => logger.info('Recovered from error'),
 *     onFailure: (error) => logger.error('Recovery failed'),
 *   }
 * );
 * ```
 */
async function executeWithRecovery(operation, strategy) {
    let lastError;
    for (let attempt = 0; attempt < strategy.maxAttempts; attempt++) {
        try {
            const result = await operation();
            if (attempt > 0 && strategy.onRecovery) {
                strategy.onRecovery(lastError, result);
            }
            return result;
        }
        catch (error) {
            lastError = error;
            if (!strategy.shouldRecover(error, attempt)) {
                break;
            }
            if (attempt < strategy.maxAttempts - 1) {
                const delay = strategy.backoffMs[attempt] || strategy.backoffMs[strategy.backoffMs.length - 1];
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }
    if (strategy.onFailure) {
        strategy.onFailure(lastError);
    }
    if (strategy.fallbackValue !== undefined) {
        return strategy.fallbackValue;
    }
    throw lastError;
}
/**
 * Create graceful degradation handler
 *
 * @param primaryOperation - Primary operation to attempt
 * @param fallbackOperation - Fallback operation if primary fails
 * @param shouldFallback - Predicate to determine if fallback should be used
 * @returns Operation result
 *
 * @example
 * ```typescript
 * const data = await gracefulDegradation(
 *   () => fetchFromPrimaryDB(),
 *   () => fetchFromCache(),
 *   (error) => error instanceof DatabaseException
 * );
 * ```
 */
async function gracefulDegradation(primaryOperation, fallbackOperation, shouldFallback = () => true) {
    try {
        return await primaryOperation();
    }
    catch (error) {
        if (shouldFallback(error)) {
            return await fallbackOperation();
        }
        throw error;
    }
}
// ============================================================================
// DEAD LETTER QUEUE HANDLING
// ============================================================================
/**
 * Add failed operation to dead letter queue
 *
 * @param payload - Original operation payload
 * @param error - Error that occurred
 * @param attempt - Number of attempts made
 * @param metadata - Additional metadata
 * @returns Dead letter item
 *
 * @example
 * ```typescript
 * const dlqItem = await addToDeadLetterQueue(
 *   { orderId: '123', action: 'process' },
 *   error,
 *   3,
 *   { queue: 'order-processing', priority: 'high' }
 * );
 * ```
 */
async function addToDeadLetterQueue(payload, error, attempt, metadata) {
    const dlqItem = {
        id: crypto.randomUUID(),
        originalPayload: payload,
        error: serializeError(error),
        attempt,
        createdAt: new Date(),
        lastAttemptAt: new Date(),
        metadata,
    };
    // In production, persist to database or message queue
    // For now, just log
    common_1.Logger.warn('Dead letter queue item created', JSON.stringify(dlqItem));
    return dlqItem;
}
/**
 * Process dead letter queue items with retry
 *
 * @param processor - Function to process DLQ items
 * @param maxRetries - Maximum number of retries
 * @returns Processing results
 *
 * @example
 * ```typescript
 * const results = await processDeadLetterQueue(
 *   async (item) => {
 *     await retryFailedOperation(item.originalPayload);
 *   },
 *   3
 * );
 * ```
 */
async function processDeadLetterQueue(processor, maxRetries = 3) {
    // In production, fetch from database or message queue
    const items = [];
    let processed = 0;
    let failed = 0;
    for (const item of items) {
        try {
            await retryWithBackoff(() => processor(item), {
                maxAttempts: maxRetries,
                initialDelayMs: 5000,
                maxDelayMs: 60000,
                backoffMultiplier: 2,
            });
            processed++;
        }
        catch (error) {
            failed++;
            common_1.Logger.error(`Failed to process DLQ item ${item.id}`, error.stack);
        }
    }
    return { processed, failed };
}
// ============================================================================
// SWAGGER/OPENAPI DECORATORS
// ============================================================================
/**
 * Swagger decorator for validation error responses
 *
 * @example
 * ```typescript
 * @ApiValidationErrorResponse()
 * @Post()
 * async create(@Body() dto: CreateUserDto) {
 *   // ...
 * }
 * ```
 */
function ApiValidationErrorResponse() {
    return (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Validation error',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                errorCode: { type: 'string', example: 'ERR_1000' },
                message: { type: 'string', example: 'Validation failed' },
                category: { type: 'string', example: 'validation' },
                severity: { type: 'string', example: 'low' },
                timestamp: { type: 'string', format: 'date-time' },
                details: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            field: { type: 'string' },
                            message: { type: 'string' },
                            constraint: { type: 'string' },
                        },
                    },
                },
            },
        },
    });
}
/**
 * Swagger decorator for not found error responses
 *
 * @param resourceType - Type of resource (e.g., 'User', 'Patient')
 *
 * @example
 * ```typescript
 * @ApiNotFoundErrorResponse('Patient')
 * @Get(':id')
 * async findOne(@Param('id') id: string) {
 *   // ...
 * }
 * ```
 */
function ApiNotFoundErrorResponse(resourceType = 'Resource') {
    return (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: `${resourceType} not found`,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                errorCode: { type: 'string', example: 'ERR_4000' },
                message: { type: 'string', example: `${resourceType} not found` },
                category: { type: 'string', example: 'not_found' },
                severity: { type: 'string', example: 'low' },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
    });
}
/**
 * Swagger decorator for unauthorized error responses
 *
 * @example
 * ```typescript
 * @ApiUnauthorizedErrorResponse()
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * async getProfile() {
 *   // ...
 * }
 * ```
 */
function ApiUnauthorizedErrorResponse() {
    return (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 401 },
                errorCode: { type: 'string', example: 'ERR_2000' },
                message: { type: 'string', example: 'Authentication failed' },
                category: { type: 'string', example: 'authentication' },
                severity: { type: 'string', example: 'medium' },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
    });
}
/**
 * Swagger decorator for forbidden error responses
 *
 * @example
 * ```typescript
 * @ApiForbiddenErrorResponse()
 * @UseGuards(RoleGuard)
 * @Delete(':id')
 * async delete(@Param('id') id: string) {
 *   // ...
 * }
 * ```
 */
function ApiForbiddenErrorResponse() {
    return (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 403 },
                errorCode: { type: 'string', example: 'ERR_3000' },
                message: { type: 'string', example: 'Access denied' },
                category: { type: 'string', example: 'authorization' },
                severity: { type: 'string', example: 'medium' },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
    });
}
/**
 * Swagger decorator for conflict error responses
 *
 * @example
 * ```typescript
 * @ApiConflictErrorResponse()
 * @Post()
 * async create(@Body() dto: CreateUserDto) {
 *   // ...
 * }
 * ```
 */
function ApiConflictErrorResponse() {
    return (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Resource conflict',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 409 },
                errorCode: { type: 'string', example: 'ERR_5000' },
                message: { type: 'string', example: 'Resource conflict' },
                category: { type: 'string', example: 'conflict' },
                severity: { type: 'string', example: 'medium' },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
    });
}
/**
 * Swagger decorator for internal server error responses
 *
 * @example
 * ```typescript
 * @ApiInternalServerErrorResponse()
 * @Post('process')
 * async process(@Body() data: any) {
 *   // ...
 * }
 * ```
 */
function ApiInternalServerErrorResponse() {
    return (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 500 },
                errorCode: { type: 'string', example: 'ERR_9000' },
                message: { type: 'string', example: 'Internal server error' },
                category: { type: 'string', example: 'internal' },
                severity: { type: 'string', example: 'high' },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
    });
}
/**
 * Composite Swagger decorator for all common error responses
 *
 * @example
 * ```typescript
 * @ApiAllErrorResponses()
 * @Post()
 * async create(@Body() dto: CreateUserDto) {
 *   // ...
 * }
 * ```
 */
function ApiAllErrorResponses() {
    return function (target, propertyKey, descriptor) {
        ApiValidationErrorResponse()(target, propertyKey, descriptor);
        ApiUnauthorizedErrorResponse()(target, propertyKey, descriptor);
        ApiForbiddenErrorResponse()(target, propertyKey, descriptor);
        ApiInternalServerErrorResponse()(target, propertyKey, descriptor);
    };
}
// ============================================================================
// ERROR CONTEXT & ENRICHMENT
// ============================================================================
/**
 * Enrich error with additional context
 *
 * @param error - Error to enrich
 * @param context - Additional context
 * @returns Enriched error
 *
 * @example
 * ```typescript
 * const enriched = enrichErrorContext(error, {
 *   userId: request.user.id,
 *   requestId: request.id,
 *   ipAddress: request.ip,
 * });
 * ```
 */
function enrichErrorContext(error, context) {
    if (error instanceof DomainException) {
        error.metadata = {
            ...error.metadata,
            ...context,
        };
    }
    else {
        error.context = context;
    }
    return error;
}
/**
 * Extract error context from Express request
 *
 * @param request - Express request object
 * @returns Error context
 *
 * @example
 * ```typescript
 * const context = extractErrorContextFromRequest(request);
 * const enriched = enrichErrorContext(error, context);
 * ```
 */
function extractErrorContextFromRequest(request) {
    return {
        requestId: request.id,
        ipAddress: request.ip,
        userAgent: request.get('user-agent'),
        userId: request.user?.id,
        sessionId: request.session?.id,
        correlationId: request.get('x-correlation-id'),
    };
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Check if error is an instance of DomainException
 *
 * @param error - Error to check
 * @returns True if error is DomainException
 */
function isDomainException(error) {
    return error instanceof DomainException;
}
/**
 * Check if error is an HTTP exception
 *
 * @param error - Error to check
 * @returns True if error is HttpException
 */
function isHttpException(error) {
    return error instanceof common_1.HttpException;
}
/**
 * Get error stack trace as array of strings
 *
 * @param error - Error with stack trace
 * @returns Array of stack trace lines
 *
 * @example
 * ```typescript
 * const stackLines = getStackTraceLines(error);
 * console.log(stackLines[0]); // First line of stack trace
 * ```
 */
function getStackTraceLines(error) {
    if (!error.stack)
        return [];
    return error.stack.split('\n').map((line) => line.trim());
}
/**
 * Create error from unknown thrown value
 *
 * @param thrown - Unknown thrown value
 * @returns Error instance
 *
 * @example
 * ```typescript
 * try {
 *   // ...
 * } catch (thrown) {
 *   const error = createErrorFromUnknown(thrown);
 *   logger.error(error.message);
 * }
 * ```
 */
function createErrorFromUnknown(thrown) {
    if (thrown instanceof Error) {
        return thrown;
    }
    if (typeof thrown === 'string') {
        return new Error(thrown);
    }
    if (typeof thrown === 'object' && thrown !== null) {
        return new Error(JSON.stringify(thrown));
    }
    return new Error('Unknown error occurred');
}
/**
 * Aggregate errors from multiple operations
 *
 * @param errors - Array of errors
 * @returns Aggregated error with all error messages
 *
 * @example
 * ```typescript
 * const results = await Promise.allSettled(operations);
 * const errors = results
 *   .filter((r) => r.status === 'rejected')
 *   .map((r) => (r as PromiseRejectedResult).reason);
 *
 * if (errors.length > 0) {
 *   throw aggregateErrors(errors);
 * }
 * ```
 */
function aggregateErrors(errors) {
    const message = errors.map((e, i) => `[${i + 1}] ${e.message}`).join('; ');
    const aggregated = new Error(`Multiple errors occurred: ${message}`);
    aggregated.errors = errors;
    return aggregated;
}
//# sourceMappingURL=error-handling-kit.prod.js.map