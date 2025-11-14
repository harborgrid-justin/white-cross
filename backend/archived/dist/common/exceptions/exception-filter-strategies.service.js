"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ValidationExceptionFilter_1, DatabaseExceptionFilter_1, SQLInjectionFilter_1, UnauthorizedExceptionFilter_1, ForbiddenExceptionFilter_1, ExternalServiceErrorFilter_1, TimeoutExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMetricsFilter = exports.CriticalErrorFilter = exports.ErrorMaskingFilter = exports.ErrorStandardizationFilter = exports.PHIAccessViolationFilter = exports.PHIAccessViolationException = exports.HIPAAComplianceFilter = exports.BusinessLogicExceptionFilter = exports.BusinessLogicException = exports.TimeoutExceptionFilter = exports.ExternalServiceErrorFilter = exports.NotFoundExceptionFilter = exports.ForbiddenExceptionFilter = exports.UnauthorizedExceptionFilter = exports.SQLInjectionFilter = exports.DatabaseExceptionFilter = exports.EnhancedValidationFilter = exports.ValidationExceptionFilter = exports.HttpExceptionFilter = exports.GlobalExceptionFilter = void 0;
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.ErrorNotificationFilter = ErrorNotificationFilter;
exports.createCustomFilter = createCustomFilter;
exports.combineFilters = combineFilters;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const logger_service_1 = require("../logging/logger.service");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'InternalServerError';
        let stack;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object') {
                message = exceptionResponse.message || message;
                error = exceptionResponse.error || error;
            }
            stack = exception.stack;
        }
        else if (exception instanceof Error) {
            message = exception.message;
            error = exception.name;
            stack = exception.stack;
        }
        const errorResponse = {
            success: false,
            statusCode: status,
            error,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            correlationId: this.getCorrelationId(request),
        };
        if (process.env.NODE_ENV === 'development') {
            errorResponse.stack = stack;
        }
        this.logError(`${request.method} ${request.url} - ${status} - ${message}`, stack);
        response.status(status).json(errorResponse);
    }
    getCorrelationId(request) {
        return (request.headers['x-correlation-id'] ||
            request.correlationId ||
            this.generateCorrelationId());
    }
    generateCorrelationId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    (0, common_1.Injectable)()
], GlobalExceptionFilter);
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        let message;
        let error = 'HttpException';
        let errors;
        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        }
        else if (typeof exceptionResponse === 'object') {
            message = exceptionResponse.message || exception.message;
            error = exceptionResponse.error || error;
            errors = exceptionResponse.errors;
        }
        else {
            message = exception.message;
        }
        const errorResponse = {
            success: false,
            statusCode: status,
            error,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            correlationId: request.headers['x-correlation-id'] || '',
            ...(errors && { errors }),
        };
        this.logWarning(`HTTP ${status} - ${request.method} ${request.url} - ${JSON.stringify(message)}`);
        response.status(status).json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException),
    (0, common_1.Injectable)()
], HttpExceptionFilter);
function AllExceptionsFilter(options) {
    let AllExceptionsFilterImpl = class AllExceptionsFilterImpl {
        catch(exception, host) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            const { status, error, message, stack } = this.parseException(exception);
            const errorResponse = {
                success: false,
                statusCode: status,
                error,
                message,
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
            };
            if (options?.logStackTrace && process.env.NODE_ENV === 'development') {
                errorResponse.stack = stack;
            }
            this.logError(request, errorResponse, options);
            if (options?.alertOnCritical && status >= 500) {
                this.alertCriticalError(errorResponse);
            }
            response.status(status).json(errorResponse);
        }
        parseException(exception) {
            if (exception instanceof common_1.HttpException) {
                return {
                    status: exception.getStatus(),
                    error: exception.name,
                    message: exception.message,
                    stack: exception.stack,
                };
            }
            if (exception instanceof Error) {
                return {
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: exception.name,
                    message: exception.message,
                    stack: exception.stack,
                };
            }
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'UnknownError',
                message: 'An unknown error occurred',
            };
        }
        logError(request, errorResponse, options) {
            const logData = {
                ...errorResponse,
                ip: request.ip,
                userAgent: request.headers['user-agent'],
            };
            if (options?.logRequestBody && request.body) {
                logData.requestBody = this.sanitizeData(request.body, options.sensitiveFields);
            }
            if (options?.logHeaders) {
                logData.headers = this.sanitizeData(request.headers, options.sensitiveFields);
            }
            this.logError(JSON.stringify(logData));
        }
        sanitizeData(data, sensitiveFields) {
            if (!sensitiveFields || sensitiveFields.length === 0) {
                return data;
            }
            const sanitized = { ...data };
            sensitiveFields.forEach((field) => {
                if (field in sanitized) {
                    sanitized[field] = '[REDACTED]';
                }
            });
            return sanitized;
        }
        alertCriticalError(error) {
            this.logError(`CRITICAL ERROR ALERT: ${JSON.stringify(error)}`);
        }
    };
    AllExceptionsFilterImpl = __decorate([
        (0, common_1.Catch)(),
        (0, common_1.Injectable)()
    ], AllExceptionsFilterImpl);
    return new AllExceptionsFilterImpl();
}
let ValidationExceptionFilter = ValidationExceptionFilter_1 = class ValidationExceptionFilter {
    logger = new common_1.Logger(ValidationExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        let validationErrors = [];
        if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
            validationErrors = this.formatValidationErrors(exceptionResponse.message);
        }
        const errorResponse = {
            success: false,
            statusCode: status,
            error: 'ValidationError',
            message: 'Validation failed',
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            errors: validationErrors,
        };
        this.logWarning(`Validation failed: ${JSON.stringify(validationErrors)}`);
        response.status(status).json(errorResponse);
    }
    formatValidationErrors(errors) {
        return errors.map((error) => {
            if (typeof error === 'string') {
                return {
                    field: 'unknown',
                    value: undefined,
                    constraints: { error },
                };
            }
            return {
                field: error.property || 'unknown',
                value: error.value,
                constraints: error.constraints || {},
                ...(error.children?.length > 0 && {
                    children: this.formatValidationErrors(error.children),
                }),
            };
        });
    }
};
exports.ValidationExceptionFilter = ValidationExceptionFilter;
exports.ValidationExceptionFilter = ValidationExceptionFilter = ValidationExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.BadRequestException),
    (0, common_1.Injectable)()
], ValidationExceptionFilter);
let EnhancedValidationFilter = class EnhancedValidationFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const exceptionResponse = exception.getResponse();
        const errorResponse = {
            success: false,
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            error: 'ValidationError',
            message: 'Request validation failed',
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            errors: this.extractValidationErrors(exceptionResponse),
        };
        response.status(common_1.HttpStatus.BAD_REQUEST).json(errorResponse);
    }
    extractValidationErrors(exceptionResponse) {
        if (!exceptionResponse.message) {
            return [];
        }
        if (Array.isArray(exceptionResponse.message)) {
            return exceptionResponse.message.map((error) => ({
                field: error.property || error.field || 'unknown',
                value: error.value,
                constraints: error.constraints || {},
            }));
        }
        return [
            {
                field: 'general',
                value: undefined,
                constraints: { error: exceptionResponse.message },
            },
        ];
    }
};
exports.EnhancedValidationFilter = EnhancedValidationFilter;
exports.EnhancedValidationFilter = EnhancedValidationFilter = __decorate([
    (0, common_1.Catch)(common_1.BadRequestException),
    (0, common_1.Injectable)()
], EnhancedValidationFilter);
let DatabaseExceptionFilter = DatabaseExceptionFilter_1 = class DatabaseExceptionFilter {
    logger = new common_1.Logger(DatabaseExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Database error occurred';
        let error = 'DatabaseError';
        if (exception instanceof sequelize_1.EmptyResultError) {
            status = common_1.HttpStatus.NOT_FOUND;
            message = 'Resource not found';
            error = 'NotFoundError';
        }
        else if (exception instanceof sequelize_1.DatabaseError) {
            const dbError = this.parseQueryError(exception);
            status = dbError.status;
            message = dbError.message;
            error = dbError.error;
        }
        const errorResponse = {
            success: false,
            statusCode: status,
            error,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        };
        this.logError(`Database error: ${message}`, process.env.NODE_ENV === 'development' ? exception.stack : undefined);
        response.status(status).json(errorResponse);
    }
    parseQueryError(exception) {
        const driverError = exception.driverError;
        if (driverError?.code === '23505') {
            return {
                status: common_1.HttpStatus.CONFLICT,
                message: 'Resource already exists',
                error: 'UniqueConstraintViolation',
            };
        }
        if (driverError?.code === '23503') {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Referenced resource does not exist',
                error: 'ForeignKeyViolation',
            };
        }
        if (driverError?.code === '23502') {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Required field is missing',
                error: 'NotNullViolation',
            };
        }
        return {
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Database operation failed',
            error: 'DatabaseError',
        };
    }
};
exports.DatabaseExceptionFilter = DatabaseExceptionFilter;
exports.DatabaseExceptionFilter = DatabaseExceptionFilter = DatabaseExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(sequelize_1.DatabaseError, sequelize_1.EmptyResultError),
    (0, common_1.Injectable)()
], DatabaseExceptionFilter);
let SQLInjectionFilter = SQLInjectionFilter_1 = class SQLInjectionFilter {
    logger = new common_1.Logger(SQLInjectionFilter_1.name);
    suspiciousPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
        /(--|\;|\/\*|\*\/)/,
        /(\bOR\b.*=.*)/i,
        /(\bAND\b.*=.*)/i,
    ];
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const isSuspicious = this.detectSQLInjection(request);
        if (isSuspicious) {
            this.logError(`Potential SQL injection attempt detected from ${request.ip}`);
            const errorResponse = {
                success: false,
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                error: 'InvalidRequest',
                message: 'Invalid request parameters',
                timestamp: new Date().toISOString(),
                path: request.url,
            };
            response.status(common_1.HttpStatus.BAD_REQUEST).json(errorResponse);
        }
        else {
            const errorResponse = {
                success: false,
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'DatabaseError',
                message: 'Database operation failed',
                timestamp: new Date().toISOString(),
                path: request.url,
            };
            response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
        }
    }
    detectSQLInjection(request) {
        const checkValue = (value) => {
            if (typeof value === 'string') {
                return this.suspiciousPatterns.some((pattern) => pattern.test(value));
            }
            if (typeof value === 'object' && value !== null) {
                return Object.values(value).some((v) => checkValue(v));
            }
            return false;
        };
        return (checkValue(request.query) || checkValue(request.body) || checkValue(request.params));
    }
};
exports.SQLInjectionFilter = SQLInjectionFilter;
exports.SQLInjectionFilter = SQLInjectionFilter = SQLInjectionFilter_1 = __decorate([
    (0, common_1.Catch)(sequelize_1.DatabaseError),
    (0, common_1.Injectable)()
], SQLInjectionFilter);
let UnauthorizedExceptionFilter = UnauthorizedExceptionFilter_1 = class UnauthorizedExceptionFilter {
    logger = new common_1.Logger(UnauthorizedExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const errorResponse = {
            success: false,
            statusCode: common_1.HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized',
            message: exception.message || 'Authentication required',
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            meta: {
                authHeader: !!request.headers.authorization,
                loginUrl: '/auth/login',
            },
        };
        this.logWarning(`Unauthorized access attempt: ${request.method} ${request.url}`);
        response.status(common_1.HttpStatus.UNAUTHORIZED).json(errorResponse);
    }
};
exports.UnauthorizedExceptionFilter = UnauthorizedExceptionFilter;
exports.UnauthorizedExceptionFilter = UnauthorizedExceptionFilter = UnauthorizedExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.UnauthorizedException),
    (0, common_1.Injectable)()
], UnauthorizedExceptionFilter);
let ForbiddenExceptionFilter = ForbiddenExceptionFilter_1 = class ForbiddenExceptionFilter {
    logger = new common_1.Logger(ForbiddenExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const user = request.user;
        const errorResponse = {
            success: false,
            statusCode: common_1.HttpStatus.FORBIDDEN,
            error: 'Forbidden',
            message: exception.message || 'Access denied',
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            meta: {
                userId: user?.id,
                roles: user?.roles,
            },
        };
        this.logWarning(`Forbidden access: User ${user?.id} attempted to access ${request.url}`);
        response.status(common_1.HttpStatus.FORBIDDEN).json(errorResponse);
    }
};
exports.ForbiddenExceptionFilter = ForbiddenExceptionFilter;
exports.ForbiddenExceptionFilter = ForbiddenExceptionFilter = ForbiddenExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.ForbiddenException),
    (0, common_1.Injectable)()
], ForbiddenExceptionFilter);
let NotFoundExceptionFilter = class NotFoundExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const errorResponse = {
            success: false,
            statusCode: common_1.HttpStatus.NOT_FOUND,
            error: 'NotFound',
            message: exception.message || 'Resource not found',
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            meta: {
                suggestions: this.generateSuggestions(request.url),
            },
        };
        response.status(common_1.HttpStatus.NOT_FOUND).json(errorResponse);
    }
    generateSuggestions(url) {
        const suggestions = [];
        if (url.includes('/api/')) {
            suggestions.push('Check API documentation for available endpoints');
        }
        if (/\/\d+/.test(url)) {
            suggestions.push('Verify the resource ID is correct');
        }
        return suggestions;
    }
};
exports.NotFoundExceptionFilter = NotFoundExceptionFilter;
exports.NotFoundExceptionFilter = NotFoundExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.NotFoundException),
    (0, common_1.Injectable)()
], NotFoundExceptionFilter);
let ExternalServiceErrorFilter = ExternalServiceErrorFilter_1 = class ExternalServiceErrorFilter {
    logger = new common_1.Logger(ExternalServiceErrorFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if (this.isExternalServiceError(exception)) {
            const errorResponse = {
                success: false,
                statusCode: common_1.HttpStatus.BAD_GATEWAY,
                error: 'ExternalServiceError',
                message: 'External service is currently unavailable',
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
                meta: {
                    service: this.extractServiceName(exception),
                    retryAfter: 60,
                },
            };
            this.logError(`External service error: ${exception.message}`, exception.stack);
            response.status(common_1.HttpStatus.BAD_GATEWAY).json(errorResponse);
        }
    }
    isExternalServiceError(exception) {
        return (exception.code === 'ECONNREFUSED' ||
            exception.code === 'ETIMEDOUT' ||
            exception.code === 'ENOTFOUND' ||
            exception.message?.includes('timeout') ||
            exception.message?.includes('ECONNRESET'));
    }
    extractServiceName(exception) {
        return exception.config?.baseURL || 'Unknown service';
    }
};
exports.ExternalServiceErrorFilter = ExternalServiceErrorFilter;
exports.ExternalServiceErrorFilter = ExternalServiceErrorFilter = ExternalServiceErrorFilter_1 = __decorate([
    (0, common_1.Catch)(),
    (0, common_1.Injectable)()
], ExternalServiceErrorFilter);
let TimeoutExceptionFilter = TimeoutExceptionFilter_1 = class TimeoutExceptionFilter {
    logger = new common_1.Logger(TimeoutExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if (exception.name === 'TimeoutError' || exception.code === 'ETIMEDOUT') {
            const errorResponse = {
                success: false,
                statusCode: common_1.HttpStatus.REQUEST_TIMEOUT,
                error: 'TimeoutError',
                message: 'Request timeout - operation took too long',
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
            };
            this.logWarning(`Request timeout: ${request.method} ${request.url}`);
            response.status(common_1.HttpStatus.REQUEST_TIMEOUT).json(errorResponse);
        }
    }
};
exports.TimeoutExceptionFilter = TimeoutExceptionFilter;
exports.TimeoutExceptionFilter = TimeoutExceptionFilter = TimeoutExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(),
    (0, common_1.Injectable)()
], TimeoutExceptionFilter);
let BusinessLogicException = class BusinessLogicException extends common_1.HttpException {
    errorCode;
    details;
    constructor(logger, message, errorCode, details) {
        super(message, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        this.errorCode = errorCode;
        this.details = details;
    }
};
exports.BusinessLogicException = BusinessLogicException;
exports.BusinessLogicException = BusinessLogicException = __decorate([
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService, String, String, Object])
], BusinessLogicException);
let BusinessLogicExceptionFilter = class BusinessLogicExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const errorResponse = {
            success: false,
            statusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
            error: 'BusinessLogicError',
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            meta: {
                errorCode: exception.errorCode,
                details: exception.details,
            },
        };
        response.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY).json(errorResponse);
    }
};
exports.BusinessLogicExceptionFilter = BusinessLogicExceptionFilter;
exports.BusinessLogicExceptionFilter = BusinessLogicExceptionFilter = __decorate([
    (0, common_1.Catch)(BusinessLogicException),
    (0, common_1.Injectable)()
], BusinessLogicExceptionFilter);
let HIPAAComplianceFilter = class HIPAAComplianceFilter {
    logger = new common_1.Logger('HIPAACompliance');
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const user = request.user;
        this.logHIPAAError(exception, request, user);
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'An error occurred processing your request';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
        }
        const errorResponse = {
            success: false,
            statusCode: status,
            error: 'Error',
            message: this.sanitizeErrorMessage(message),
            timestamp: new Date().toISOString(),
            correlationId: this.generateCorrelationId(),
        };
        response.status(status).json(errorResponse);
    }
    logHIPAAError(exception, request, user) {
        const auditLog = {
            timestamp: new Date().toISOString(),
            userId: user?.id || 'anonymous',
            action: `${request.method} ${request.url}`,
            result: 'ERROR',
            errorType: exception.name,
            ipAddress: request.ip,
            correlationId: this.generateCorrelationId(),
        };
        this.logError(`HIPAA Audit - Error: ${JSON.stringify(auditLog)}`);
    }
    sanitizeErrorMessage(message) {
        return message.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
            .replace(/\b[A-Z0-9]{8,12}\b/g, '[MRN]')
            .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, '[EMAIL]');
    }
    generateCorrelationId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
};
exports.HIPAAComplianceFilter = HIPAAComplianceFilter;
exports.HIPAAComplianceFilter = HIPAAComplianceFilter = __decorate([
    (0, common_1.Catch)(),
    (0, common_1.Injectable)()
], HIPAAComplianceFilter);
class PHIAccessViolationException extends common_1.ForbiddenException {
    constructor(message = 'Unauthorized access to Protected Health Information') {
        super(message);
    }
}
exports.PHIAccessViolationException = PHIAccessViolationException;
let PHIAccessViolationFilter = class PHIAccessViolationFilter {
    logger = new common_1.Logger('PHIAccessViolation');
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const user = request.user;
        this.logError(`PHI Access Violation - User: ${user?.id}, Path: ${request.url}`);
        const errorResponse = {
            success: false,
            statusCode: common_1.HttpStatus.FORBIDDEN,
            error: 'AccessDenied',
            message: 'Access to Protected Health Information denied',
            timestamp: new Date().toISOString(),
            correlationId: `PHI-${Date.now()}`,
        };
        response.status(common_1.HttpStatus.FORBIDDEN).json(errorResponse);
    }
};
exports.PHIAccessViolationFilter = PHIAccessViolationFilter;
exports.PHIAccessViolationFilter = PHIAccessViolationFilter = __decorate([
    (0, common_1.Catch)(PHIAccessViolationException),
    (0, common_1.Injectable)()
], PHIAccessViolationFilter);
let ErrorStandardizationFilter = class ErrorStandardizationFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const standardized = this.standardizeError(exception);
        const errorResponse = {
            success: false,
            statusCode: standardized.status,
            error: standardized.error,
            message: standardized.message,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        };
        response.status(standardized.status).json(errorResponse);
    }
    standardizeError(exception) {
        if (exception instanceof common_1.HttpException) {
            return {
                status: exception.getStatus(),
                error: exception.name,
                message: exception.message,
            };
        }
        const errorMap = {
            ValidationError: { status: common_1.HttpStatus.BAD_REQUEST, error: 'ValidationError' },
            CastError: { status: common_1.HttpStatus.BAD_REQUEST, error: 'InvalidData' },
            MongoError: { status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'DatabaseError' },
            JsonWebTokenError: { status: common_1.HttpStatus.UNAUTHORIZED, error: 'AuthenticationError' },
            TokenExpiredError: { status: common_1.HttpStatus.UNAUTHORIZED, error: 'TokenExpired' },
        };
        const mapped = errorMap[exception.name];
        if (mapped) {
            return {
                status: mapped.status,
                error: mapped.error,
                message: exception.message || 'An error occurred',
            };
        }
        return {
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'InternalServerError',
            message: 'An unexpected error occurred',
        };
    }
};
exports.ErrorStandardizationFilter = ErrorStandardizationFilter;
exports.ErrorStandardizationFilter = ErrorStandardizationFilter = __decorate([
    (0, common_1.Catch)(),
    (0, common_1.Injectable)()
], ErrorStandardizationFilter);
let ErrorMaskingFilter = class ErrorMaskingFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const isDevelopment = process.env.NODE_ENV === 'development';
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'An error occurred';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            message = isDevelopment ? exception.message : this.getMaskedMessage(status);
        }
        const errorResponse = {
            success: false,
            statusCode: status,
            error: isDevelopment ? exception.name : 'Error',
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        };
        if (isDevelopment) {
            errorResponse.stack = exception.stack;
        }
        response.status(status).json(errorResponse);
    }
    getMaskedMessage(status) {
        const messages = {
            400: 'Invalid request',
            401: 'Authentication required',
            403: 'Access denied',
            404: 'Resource not found',
            500: 'Internal server error',
        };
        return messages[status] || 'An error occurred';
    }
};
exports.ErrorMaskingFilter = ErrorMaskingFilter;
exports.ErrorMaskingFilter = ErrorMaskingFilter = __decorate([
    (0, common_1.Catch)(),
    (0, common_1.Injectable)()
], ErrorMaskingFilter);
function ErrorNotificationFilter(config) {
    let ErrorNotificationFilterImpl = class ErrorNotificationFilterImpl {
        logger = new common_1.Logger('ErrorNotification');
        lastNotification = new Map();
        catch(exception, host) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            if (exception instanceof common_1.HttpException) {
                status = exception.getStatus();
            }
            if (config.enabled && this.shouldNotify(status, config)) {
                this.sendNotification(exception, request, status, config);
            }
            const errorResponse = {
                success: false,
                statusCode: status,
                error: exception.name || 'Error',
                message: exception.message || 'An error occurred',
                timestamp: new Date().toISOString(),
                path: request.url,
            };
            response.status(status).json(errorResponse);
        }
        shouldNotify(status, config) {
            if (config.criticalOnly && status < 500) {
                return false;
            }
            if (config.throttleMs) {
                const key = `${status}`;
                const lastSent = this.lastNotification.get(key) || 0;
                const now = Date.now();
                if (now - lastSent < config.throttleMs) {
                    return false;
                }
                this.lastNotification.set(key, now);
            }
            return true;
        }
        sendNotification(exception, request, status, config) {
            const notification = {
                error: exception.name,
                message: exception.message,
                status,
                path: request.url,
                method: request.method,
                timestamp: new Date().toISOString(),
            };
            config.channels.forEach((channel) => {
                switch (channel) {
                    case 'email':
                        this.sendEmailNotification(notification);
                        break;
                    case 'slack':
                        this.sendSlackNotification(notification);
                        break;
                    case 'pagerduty':
                        this.sendPagerDutyNotification(notification);
                        break;
                    case 'webhook':
                        this.sendWebhookNotification(notification);
                        break;
                }
            });
        }
        sendEmailNotification(notification) {
            this.logInfo(`[EMAIL] Error notification: ${JSON.stringify(notification)}`);
        }
        sendSlackNotification(notification) {
            this.logInfo(`[SLACK] Error notification: ${JSON.stringify(notification)}`);
        }
        sendPagerDutyNotification(notification) {
            this.logInfo(`[PAGERDUTY] Error notification: ${JSON.stringify(notification)}`);
        }
        sendWebhookNotification(notification) {
            this.logInfo(`[WEBHOOK] Error notification: ${JSON.stringify(notification)}`);
        }
    };
    ErrorNotificationFilterImpl = __decorate([
        (0, common_1.Catch)(),
        (0, common_1.Injectable)()
    ], ErrorNotificationFilterImpl);
    return new ErrorNotificationFilterImpl();
}
let CriticalErrorFilter = class CriticalErrorFilter {
    logger = new common_1.Logger('CriticalError');
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
        }
        if (status >= 500) {
            this.alertCriticalError(exception, request);
        }
        const errorResponse = {
            success: false,
            statusCode: status,
            error: exception.name || 'CriticalError',
            message: exception.message || 'A critical error occurred',
            timestamp: new Date().toISOString(),
            path: request.url,
            correlationId: this.generateCorrelationId(),
        };
        response.status(status).json(errorResponse);
    }
    alertCriticalError(exception, request) {
        const alert = {
            severity: 'CRITICAL',
            error: exception.name,
            message: exception.message,
            stack: exception.stack,
            path: request.url,
            method: request.method,
            timestamp: new Date().toISOString(),
        };
        this.logError(`CRITICAL ERROR: ${JSON.stringify(alert)}`);
        this.triggerImmediateAlert(alert);
    }
    triggerImmediateAlert(alert) {
        console.error('[CRITICAL ALERT]', alert);
    }
    generateCorrelationId() {
        return `CRIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
};
exports.CriticalErrorFilter = CriticalErrorFilter;
exports.CriticalErrorFilter = CriticalErrorFilter = __decorate([
    (0, common_1.Catch)(),
    (0, common_1.Injectable)()
], CriticalErrorFilter);
let ErrorMetricsFilter = class ErrorMetricsFilter {
    logger = new common_1.Logger('ErrorMetrics');
    errorCounts = new Map();
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
        }
        this.trackErrorMetric(exception.name, status, request.url);
        const errorResponse = {
            success: false,
            statusCode: status,
            error: exception.name || 'Error',
            message: exception.message || 'An error occurred',
            timestamp: new Date().toISOString(),
            path: request.url,
        };
        response.status(status).json(errorResponse);
    }
    trackErrorMetric(errorType, status, path) {
        const key = `${errorType}:${status}:${path}`;
        const count = this.errorCounts.get(key) || 0;
        this.errorCounts.set(key, count + 1);
        this.logInfo(`Error metric: ${key} = ${count + 1}`);
        this.sendMetric({
            type: errorType,
            status,
            path,
            count: count + 1,
            timestamp: Date.now(),
        });
    }
    sendMetric(metric) {
    }
    getMetrics() {
        return this.errorCounts;
    }
};
exports.ErrorMetricsFilter = ErrorMetricsFilter;
exports.ErrorMetricsFilter = ErrorMetricsFilter = __decorate([
    (0, common_1.Catch)(),
    (0, common_1.Injectable)()
], ErrorMetricsFilter);
function createCustomFilter(handler) {
    let CustomExceptionFilter = class CustomExceptionFilter {
        catch(exception, host) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            const errorResponse = handler(exception, request);
            response.status(errorResponse.statusCode).json(errorResponse);
        }
    };
    CustomExceptionFilter = __decorate([
        (0, common_1.Catch)(),
        (0, common_1.Injectable)()
    ], CustomExceptionFilter);
    return new CustomExceptionFilter();
}
function combineFilters(filters) {
    let CombinedExceptionFilter = class CombinedExceptionFilter {
        catch(exception, host) {
            for (const filter of filters) {
                try {
                    filter.catch(exception, host);
                    return;
                }
                catch (error) {
                }
            }
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error',
                message: 'An error occurred',
                timestamp: new Date().toISOString(),
            });
        }
    };
    CombinedExceptionFilter = __decorate([
        (0, common_1.Catch)(),
        (0, common_1.Injectable)()
    ], CombinedExceptionFilter);
    return new CombinedExceptionFilter();
}
//# sourceMappingURL=exception-filter-strategies.service.js.map