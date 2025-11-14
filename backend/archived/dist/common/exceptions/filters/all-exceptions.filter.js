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
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("../..");
const logger_service_1 = require("../../logging/logger.service");
const sentry_service_1 = require("../../../infrastructure/monitoring/sentry.service");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    sentryService;
    logger;
    isDevelopment = process.env.NODE_ENV === 'development';
    enableDetailedErrors = process.env.ENABLE_DETAILED_ERRORS === 'true' || this.isDevelopment;
    constructor(sentryService) {
        this.sentryService = sentryService;
        this.logger = new logger_service_1.LoggerService();
        this.logger.setContext(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = (0, common_2.getRequestId)() ||
            request.headers['x-request-id'] ||
            'unknown';
        const isHttpException = exception instanceof common_1.HttpException;
        const status = isHttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorInfo = this.extractErrorInfo(exception, isHttpException);
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
        if (this.enableDetailedErrors && exception instanceof Error) {
            errorResponse.details = {
                name: exception.name,
                cause: exception.cause,
            };
            errorResponse.stack = exception.stack;
        }
        this.logError(exception, request, errorResponse);
        response.status(status).json(errorResponse);
    }
    extractErrorInfo(exception, isHttpException) {
        if (isHttpException) {
            const httpException = exception;
            const response = httpException.getResponse();
            if (typeof response === 'string') {
                return {
                    error: httpException.name,
                    message: response,
                    errorCode: common_2.SystemErrorCodes.INTERNAL_SERVER_ERROR,
                };
            }
            const responseObj = response;
            return {
                error: responseObj.error || httpException.name,
                message: responseObj.message || 'An error occurred',
                errorCode: responseObj.errorCode || common_2.SystemErrorCodes.INTERNAL_SERVER_ERROR,
            };
        }
        if (exception instanceof Error) {
            return this.handleKnownError(exception);
        }
        return {
            error: 'Internal Server Error',
            message: 'An unexpected error occurred',
            errorCode: common_2.SystemErrorCodes.INTERNAL_SERVER_ERROR,
        };
    }
    handleKnownError(error) {
        const errorName = error.name.toLowerCase();
        if (errorName.includes('sequelize') || errorName.includes('database')) {
            return {
                error: 'Database Error',
                message: this.isDevelopment
                    ? error.message
                    : 'A database error occurred',
                errorCode: common_2.SystemErrorCodes.DATABASE_ERROR,
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
                message: 'Request timeout',
                errorCode: common_2.SystemErrorCodes.TIMEOUT,
            };
        }
        if (errorName.includes('config')) {
            return {
                error: 'Configuration Error',
                message: this.isDevelopment
                    ? error.message
                    : 'A configuration error occurred',
                errorCode: common_2.SystemErrorCodes.CONFIGURATION_ERROR,
            };
        }
        return {
            error: error.name,
            message: this.isDevelopment
                ? error.message
                : 'An internal error occurred',
            errorCode: common_2.SystemErrorCodes.INTERNAL_SERVER_ERROR,
        };
    }
    logError(exception, request, errorResponse) {
        const context = (0, common_2.getRequestContext)();
        const userId = context?.userId || request.user?.id;
        const organizationId = context?.organizationId || request.user?.organizationId;
        const loggingContext = {
            category: common_2.ErrorCategory.SYSTEM,
            severity: common_2.ErrorSeverity.CRITICAL,
            requestId: errorResponse.requestId,
            userId,
            organizationId,
            userAgent: request.headers['user-agent'],
            ipAddress: this.getClientIp(request),
            containsPHI: false,
            path: request.url,
            method: request.method,
            statusCode: errorResponse.statusCode,
            errorCode: errorResponse.errorCode,
            errorType: exception instanceof Error ? exception.name : typeof exception,
        };
        const logMessage = `Unhandled exception: ${errorResponse.message}`;
        if (exception instanceof Error) {
            this.logger.logWithMetadata('error', logMessage, {
                ...loggingContext,
                stack: exception.stack,
            });
        }
        else {
            this.logger.logWithMetadata('error', logMessage, {
                ...loggingContext,
                error: String(exception),
            });
        }
        if (errorResponse.statusCode >= 500 && exception instanceof Error) {
            this.sentryService.captureException(exception, {
                userId,
                organizationId,
                tags: {
                    category: common_2.ErrorCategory.SYSTEM,
                    errorCode: errorResponse.errorCode,
                    path: request.url,
                    method: request.method,
                },
                extra: {
                    requestId: errorResponse.requestId,
                    statusCode: errorResponse.statusCode,
                    userAgent: request.headers['user-agent'],
                },
                level: 'fatal',
            });
        }
        if (errorResponse.statusCode >= 500) {
            this.sendAlert(errorResponse, loggingContext);
        }
    }
    getClientIp(request) {
        return (request.headers['x-forwarded-for']?.split(',')[0] ||
            request.headers['x-real-ip'] ||
            request.socket.remoteAddress ||
            'unknown');
    }
    sendAlert(errorResponse, context) {
        this.logger.logWithMetadata('error', 'CRITICAL ERROR ALERT', {
            ...errorResponse,
            ...context,
            alert: true,
            timestamp: new Date().toISOString(),
        });
        this.sentryService.captureMessage(`CRITICAL ERROR: ${errorResponse.error} - ${errorResponse.message}`, 'fatal', {
            userId: context.userId,
            tags: {
                errorCode: errorResponse.errorCode,
                category: context.category,
            },
            extra: {
                requestId: errorResponse.requestId,
                statusCode: errorResponse.statusCode,
                path: errorResponse.path,
            },
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __param(0, (0, common_1.Inject)(sentry_service_1.SentryService)),
    __metadata("design:paramtypes", [sentry_service_1.SentryService])
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map