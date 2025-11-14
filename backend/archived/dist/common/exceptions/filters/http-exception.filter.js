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
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const error_response_types_1 = require("../types/error-response.types");
const error_codes_1 = require("../constants/error-codes");
const logger_service_1 = require("../../logging/logger.service");
const sentry_service_1 = require("../../../infrastructure/monitoring/sentry.service");
const audit_service_1 = require("../../../services/audit/audit.service");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    sentryService;
    auditService;
    logger;
    isDevelopment = process.env.NODE_ENV === 'development';
    enableDetailedErrors = process.env.ENABLE_DETAILED_ERRORS === 'true' || this.isDevelopment;
    constructor(sentryService, auditService) {
        this.sentryService = sentryService;
        this.auditService = auditService;
        this.logger = new logger_service_1.LoggerService();
        this.logger.setContext(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        const requestId = request.headers['x-request-id'] || (0, uuid_1.v4)();
        const errorInfo = this.extractErrorInfo(exceptionResponse, exception);
        const errorResponse = {
            success: false,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            statusCode: status,
            error: errorInfo.error,
            message: errorInfo.message,
            errorCode: errorInfo.errorCode,
            requestId,
        };
        if (this.enableDetailedErrors) {
            errorResponse.details = errorInfo.details;
            errorResponse.stack = exception.stack;
        }
        this.logError(exception, request, errorResponse);
        if (this.shouldAuditLog(status, errorInfo.errorCode)) {
            this.sendToAuditLog(request, errorResponse);
        }
        response.status(status).json(errorResponse);
    }
    extractErrorInfo(exceptionResponse, exception) {
        if (typeof exceptionResponse === 'string') {
            return {
                error: exception.name || 'HttpException',
                message: exceptionResponse,
                errorCode: this.getDefaultErrorCode(exception.getStatus()),
            };
        }
        const response = exceptionResponse;
        return {
            error: response.error || exception.name || 'HttpException',
            message: response.message || 'An error occurred',
            errorCode: response.errorCode || this.getDefaultErrorCode(exception.getStatus()),
            details: response.errors || response.context || response.details,
        };
    }
    getDefaultErrorCode(status) {
        const codeMap = {
            400: 'VALID_001',
            401: 'AUTH_005',
            403: 'AUTHZ_001',
            404: 'BUSINESS_001',
            409: 'BUSINESS_002',
            422: 'VALID_002',
            429: 'SECURITY_001',
            500: 'SYSTEM_001',
            503: 'SYSTEM_002',
        };
        return codeMap[status] || 'SYSTEM_001';
    }
    logError(exception, request, errorResponse) {
        const status = exception.getStatus();
        const severity = this.getErrorSeverity(status);
        const category = this.getErrorCategory(errorResponse.errorCode);
        const userId = request.user?.id;
        const organizationId = request.user?.organizationId;
        const loggingContext = {
            category,
            severity,
            requestId: errorResponse.requestId,
            userId,
            organizationId,
            userAgent: request.headers['user-agent'],
            ipAddress: this.getClientIp(request),
            containsPHI: false,
            metadata: {
                path: request.url,
                method: request.method,
                statusCode: status,
                errorCode: errorResponse.errorCode,
            },
        };
        const logMessage = `[${category}] ${errorResponse.message}`;
        switch (severity) {
            case error_response_types_1.ErrorSeverity.CRITICAL:
                this.logger.logWithMetadata('error', logMessage, {
                    ...loggingContext,
                    stack: exception.stack,
                });
                this.sentryService.captureException(exception, {
                    userId,
                    organizationId,
                    tags: {
                        category,
                        errorCode: errorResponse.errorCode,
                        severity,
                    },
                    extra: {
                        requestId: errorResponse.requestId,
                        path: request.url,
                        method: request.method,
                    },
                    level: 'error',
                });
                break;
            case error_response_types_1.ErrorSeverity.HIGH:
                this.logger.logWithMetadata('error', logMessage, loggingContext);
                if (status === 401 || status === 403) {
                    this.sentryService.captureException(exception, {
                        userId,
                        organizationId,
                        tags: {
                            category,
                            errorCode: errorResponse.errorCode,
                            severity,
                        },
                        extra: {
                            requestId: errorResponse.requestId,
                        },
                        level: 'warning',
                    });
                }
                break;
            case error_response_types_1.ErrorSeverity.MEDIUM:
                this.logger.logWithMetadata('warn', logMessage, loggingContext);
                break;
            case error_response_types_1.ErrorSeverity.LOW:
                this.logger.logWithMetadata('info', logMessage, loggingContext);
                break;
        }
    }
    getErrorSeverity(status) {
        if (status >= 500)
            return error_response_types_1.ErrorSeverity.CRITICAL;
        if (status === 401 || status === 403)
            return error_response_types_1.ErrorSeverity.HIGH;
        if (status === 429)
            return error_response_types_1.ErrorSeverity.MEDIUM;
        return error_response_types_1.ErrorSeverity.LOW;
    }
    getErrorCategory(errorCode) {
        const prefix = (0, error_codes_1.getErrorCodeCategory)(errorCode);
        const categoryMap = {
            AUTH: error_response_types_1.ErrorCategory.SECURITY,
            AUTHZ: error_response_types_1.ErrorCategory.SECURITY,
            VALID: error_response_types_1.ErrorCategory.VALIDATION,
            BUSINESS: error_response_types_1.ErrorCategory.BUSINESS,
            HEALTH: error_response_types_1.ErrorCategory.HEALTHCARE,
            SECURITY: error_response_types_1.ErrorCategory.SECURITY,
            SYSTEM: error_response_types_1.ErrorCategory.SYSTEM,
            COMPLY: error_response_types_1.ErrorCategory.HEALTHCARE,
        };
        return categoryMap[prefix] || error_response_types_1.ErrorCategory.SYSTEM;
    }
    shouldAuditLog(status, errorCode) {
        if (status === 401 || status === 403 || status === 429)
            return true;
        if (status >= 500)
            return true;
        const category = (0, error_codes_1.getErrorCodeCategory)(errorCode);
        return ['HEALTH', 'SECURITY', 'COMPLY'].includes(category);
    }
    async sendToAuditLog(request, errorResponse) {
        const userId = request.user?.id;
        const ipAddress = this.getClientIp(request);
        const userAgent = request.headers['user-agent'];
        try {
            await this.auditService.logAction({
                userId: userId || null,
                action: this.getAuditAction(errorResponse.statusCode, errorResponse.errorCode),
                entityType: 'error_event',
                entityId: errorResponse.requestId,
                changes: {
                    path: errorResponse.path,
                    method: errorResponse.method,
                    statusCode: errorResponse.statusCode,
                    errorCode: errorResponse.errorCode,
                    error: errorResponse.error,
                    message: errorResponse.message,
                },
                ipAddress,
                userAgent,
                success: false,
                errorMessage: Array.isArray(errorResponse.message)
                    ? errorResponse.message.join(', ')
                    : errorResponse.message,
            });
            this.logger.logWithMetadata('info', 'Audit log entry created for security event', {
                requestId: errorResponse.requestId,
                path: errorResponse.path,
                errorCode: errorResponse.errorCode,
                userId,
            });
        }
        catch (error) {
            this.logger.logWithMetadata('error', 'Failed to create audit log entry', {
                requestId: errorResponse.requestId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    getAuditAction(statusCode, errorCode) {
        if (statusCode === 401)
            return 'AUTHENTICATION_FAILED';
        if (statusCode === 403)
            return 'AUTHORIZATION_FAILED';
        if (statusCode === 429)
            return 'RATE_LIMIT_EXCEEDED';
        if (statusCode >= 500)
            return 'SERVER_ERROR';
        const category = (0, error_codes_1.getErrorCodeCategory)(errorCode);
        if (category === 'HEALTH')
            return 'HEALTHCARE_ERROR';
        if (category === 'COMPLY')
            return 'COMPLIANCE_ERROR';
        if (category === 'SECURITY')
            return 'SECURITY_ERROR';
        return 'APPLICATION_ERROR';
    }
    getClientIp(request) {
        return (request.headers['x-forwarded-for']?.split(',')[0] ||
            request.headers['x-real-ip'] ||
            request.socket.remoteAddress ||
            'unknown');
    }
    sanitizeMessage(message) {
        let sanitized = message.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
        sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');
        sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');
        sanitized = sanitized.replace(/\b[A-Z0-9]{6,12}\b/g, '[ID]');
        return sanitized;
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.HttpException),
    __param(0, (0, common_1.Inject)(sentry_service_1.SentryService)),
    __param(1, (0, common_1.Inject)(audit_service_1.AuditService)),
    __metadata("design:paramtypes", [sentry_service_1.SentryService,
        audit_service_1.AuditService])
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map