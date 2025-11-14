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
var HipaaExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HipaaExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const error_response_types_1 = require("../types/error-response.types");
const error_codes_1 = require("../constants/error-codes");
const sentry_service_1 = require("../../../infrastructure/monitoring/sentry.service");
const request_context_middleware_1 = require("../../middleware/request-context.middleware");
let HipaaExceptionFilter = HipaaExceptionFilter_1 = class HipaaExceptionFilter {
    sentryService;
    logger;
    isDevelopment = process.env.NODE_ENV === 'development';
    enableDetailedErrors = process.env.ENABLE_DETAILED_ERRORS === 'true' || this.isDevelopment;
    phiPatterns = [
        { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '***-**-****', name: 'SSN' },
        { pattern: /\b\d{9}\b/g, replacement: '[REDACTED_SSN]', name: 'SSN_NO_DASH' },
        { pattern: /\bMRN[:\s]*[A-Z0-9]{6,12}\b/gi, replacement: 'MRN:[REDACTED]', name: 'MRN' },
        { pattern: /\b[A-Z]{2,3}\d{6,10}\b/g, replacement: '[REDACTED_MRN]', name: 'MRN_ALPHA' },
        { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '[EMAIL_REDACTED]', name: 'EMAIL' },
        { pattern: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: '[PHONE_REDACTED]', name: 'PHONE' },
        { pattern: /\b\(\d{3}\)\s*\d{3}[-.\s]?\d{4}\b/g, replacement: '[PHONE_REDACTED]', name: 'PHONE_PAREN' },
        { pattern: /\b1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: '[PHONE_REDACTED]', name: 'PHONE_INT' },
        { pattern: /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g, replacement: '[DATE_REDACTED]', name: 'DATE' },
        { pattern: /\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b/g, replacement: '[DATE_REDACTED]', name: 'DATE_ISO' },
        { pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, replacement: '[CARD_REDACTED]', name: 'CREDIT_CARD' },
        { pattern: /\b(?:account|acct)[:\s#]*\d{8,16}\b/gi, replacement: 'Account:[REDACTED]', name: 'ACCOUNT' },
        { pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, replacement: '[IP_REDACTED]', name: 'IP_ADDRESS' },
        { pattern: /\b(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}\b/gi, replacement: '[IPV6_REDACTED]', name: 'IPV6' },
        { pattern: /\b(patient|user|doctor|provider|staff)\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/gi, replacement: '$1 [NAME_REDACTED]', name: 'NAME' },
        { pattern: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi, replacement: '[ADDRESS_REDACTED]', name: 'ADDRESS' },
        { pattern: /\b\d{5}(?:-\d{4})?\b/g, replacement: '[ZIP_REDACTED]', name: 'ZIP_CODE' },
        { pattern: /\b[A-Z]{2}[-\s]?\d{6,8}\b/g, replacement: '[DL_REDACTED]', name: 'DRIVERS_LICENSE' },
        { pattern: /\b(?:RX|Rx)[:\s#]*[A-Z0-9]{6,12}\b/gi, replacement: 'RX:[REDACTED]', name: 'PRESCRIPTION' },
        { pattern: /\b(?:policy|insurance)[:\s#]*[A-Z0-9]{6,20}\b/gi, replacement: 'Policy:[REDACTED]', name: 'INSURANCE' },
    ];
    constructor(sentryService) {
        this.sentryService = sentryService;
        this.logger = new common_1.Logger(HipaaExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = (0, request_context_middleware_1.getRequestId)() ||
            request.headers['x-request-id'] ||
            this.generateRequestId();
        this.logFullErrorServerSide(exception, request, requestId);
        const isHttpException = exception instanceof common_1.HttpException;
        const status = isHttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorInfo = this.extractErrorInfo(exception, isHttpException);
        const sanitizedMessage = this.sanitizeMessage(errorInfo.message);
        const sanitizedError = this.sanitizeMessage(errorInfo.error);
        const errorResponse = {
            success: false,
            timestamp: new Date().toISOString(),
            path: this.sanitizePath(request.url),
            method: request.method,
            statusCode: status,
            error: sanitizedError,
            message: sanitizedMessage,
            errorCode: errorInfo.errorCode,
            requestId,
        };
        if (this.isDevelopment && exception instanceof Error) {
            errorResponse.stack = this.sanitizeMessage(exception.stack || '');
        }
        this.logSanitizedError(errorResponse, request);
        response.status(status).json(errorResponse);
    }
    logFullErrorServerSide(exception, request, requestId) {
        const context = (0, request_context_middleware_1.getRequestContext)();
        const userId = context?.userId || request.user?.id;
        const organizationId = context?.organizationId || request.user?.organizationId;
        const fullErrorLog = {
            message: exception instanceof Error ? exception.message : String(exception),
            stack: exception instanceof Error ? exception.stack : undefined,
            name: exception instanceof Error ? exception.name : typeof exception,
            path: request.url,
            method: request.method,
            requestId,
            userId,
            organizationId,
            userAgent: request.headers['user-agent'],
            ip: this.getClientIp(request),
            timestamp: new Date().toISOString(),
            category: error_response_types_1.ErrorCategory.SYSTEM,
            severity: error_response_types_1.ErrorSeverity.CRITICAL,
            containsPHI: true,
        };
        this.logger.error('EXCEPTION_CAUGHT', JSON.stringify(fullErrorLog, null, 2));
        if (exception instanceof Error && this.shouldReportToSentry(exception)) {
            this.sentryService.captureException(exception, {
                userId,
                organizationId,
                tags: {
                    category: error_response_types_1.ErrorCategory.SYSTEM,
                    path: request.url,
                    method: request.method,
                },
                extra: {
                    requestId,
                    userAgent: request.headers['user-agent'],
                },
                level: 'error',
            });
        }
    }
    logSanitizedError(errorResponse, request) {
        const context = (0, request_context_middleware_1.getRequestContext)();
        const auditLog = {
            ...errorResponse,
            userId: context?.userId || request.user?.id,
            organizationId: context?.organizationId || request.user?.organizationId,
            userAgent: request.headers['user-agent'],
            containsPHI: false,
        };
        this.logger.warn('SANITIZED_ERROR_RESPONSE', JSON.stringify(auditLog));
    }
    extractErrorInfo(exception, isHttpException) {
        if (isHttpException) {
            const httpException = exception;
            const response = httpException.getResponse();
            if (typeof response === 'string') {
                return {
                    error: httpException.name,
                    message: response,
                    errorCode: this.getErrorCode(httpException.getStatus()),
                };
            }
            const responseObj = response;
            return {
                error: responseObj.error || httpException.name,
                message: responseObj.message || 'An error occurred',
                errorCode: responseObj.errorCode || this.getErrorCode(httpException.getStatus()),
            };
        }
        if (exception instanceof Error) {
            return this.handleKnownError(exception);
        }
        return {
            error: 'Internal Server Error',
            message: 'An unexpected error occurred',
            errorCode: error_codes_1.SystemErrorCodes.INTERNAL_SERVER_ERROR,
        };
    }
    handleKnownError(error) {
        const errorName = error.name.toLowerCase();
        if (errorName.includes('sequelize') || errorName.includes('database')) {
            return {
                error: 'Database Error',
                message: this.isDevelopment
                    ? error.message
                    : 'A database error occurred. Please try again.',
                errorCode: error_codes_1.SystemErrorCodes.DATABASE_ERROR,
            };
        }
        if (errorName.includes('validation')) {
            return {
                error: 'Validation Error',
                message: error.message,
                errorCode: 'VALID_001',
            };
        }
        if (errorName.includes('timeout')) {
            return {
                error: 'Timeout Error',
                message: 'Request timeout. Please try again.',
                errorCode: error_codes_1.SystemErrorCodes.TIMEOUT,
            };
        }
        if (errorName.includes('config')) {
            return {
                error: 'Configuration Error',
                message: this.isDevelopment
                    ? error.message
                    : 'A configuration error occurred',
                errorCode: error_codes_1.SystemErrorCodes.CONFIGURATION_ERROR,
            };
        }
        return {
            error: error.name,
            message: this.isDevelopment
                ? error.message
                : 'An internal error occurred. Please try again.',
            errorCode: error_codes_1.SystemErrorCodes.INTERNAL_SERVER_ERROR,
        };
    }
    sanitizeMessage(message) {
        if (!message) {
            return 'An error occurred';
        }
        let sanitized = message;
        let redactionCount = 0;
        for (const { pattern, replacement, name } of this.phiPatterns) {
            const beforeLength = sanitized.length;
            sanitized = sanitized.replace(pattern, replacement);
            if (sanitized.length !== beforeLength) {
                redactionCount++;
                this.logger.debug(`PHI_REDACTION: ${name} pattern redacted`);
            }
        }
        if (redactionCount > 0) {
            this.logger.warn(`PHI_SANITIZATION: ${redactionCount} PHI patterns redacted from error message`);
        }
        sanitized = sanitized.replace(/\b(value|values|data|record|field)[:\s]*['"]\w+['"]/gi, '$1: [REDACTED]');
        return sanitized;
    }
    sanitizePath(path) {
        try {
            const url = new URL(path, 'http://localhost');
            url.searchParams.forEach((value, key) => {
                const sanitizedValue = this.sanitizeMessage(value);
                if (sanitizedValue !== value) {
                    url.searchParams.set(key, sanitizedValue);
                }
            });
            const sanitizedPathname = this.sanitizeMessage(url.pathname);
            return sanitizedPathname + url.search;
        }
        catch {
            return this.sanitizeMessage(path);
        }
    }
    getErrorCode(status) {
        const errorCodeMap = {
            400: 'VALID_001',
            401: 'AUTH_001',
            403: 'AUTH_002',
            404: 'RES_001',
            409: 'CONFLICT_001',
            422: 'VALID_002',
            429: 'RATE_001',
            500: error_codes_1.SystemErrorCodes.INTERNAL_SERVER_ERROR,
            503: error_codes_1.SystemErrorCodes.SERVICE_UNAVAILABLE,
        };
        return errorCodeMap[status] || error_codes_1.SystemErrorCodes.INTERNAL_SERVER_ERROR;
    }
    getClientIp(request) {
        return (request.headers['x-forwarded-for']?.split(',')[0] ||
            request.headers['x-real-ip'] ||
            request.socket.remoteAddress ||
            'unknown');
    }
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    shouldReportToSentry(exception) {
        const errorName = exception.name.toLowerCase();
        if (errorName.includes('notfound') ||
            errorName.includes('badrequest') ||
            errorName.includes('unauthorized') ||
            errorName.includes('forbidden')) {
            return false;
        }
        return true;
    }
};
exports.HipaaExceptionFilter = HipaaExceptionFilter;
exports.HipaaExceptionFilter = HipaaExceptionFilter = HipaaExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __param(0, (0, common_1.Inject)(sentry_service_1.SentryService)),
    __metadata("design:paramtypes", [sentry_service_1.SentryService])
], HipaaExceptionFilter);
//# sourceMappingURL=hipaa-exception.filter.js.map