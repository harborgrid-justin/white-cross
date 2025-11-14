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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const logger_service_1 = require("../logging/logger.service");
const sentry_service_1 = require("../../infrastructure/monitoring/sentry.service");
let BaseInterceptor = class BaseInterceptor {
    logger;
    sentryService;
    sensitiveFields = [
        'password',
        'ssn',
        'socialSecurityNumber',
        'token',
        'refreshToken',
        'accessToken',
        'medicalRecordNumber',
        'mrn',
        'dateOfBirth',
        'dob',
        'email',
        'phone',
        'address',
        'firstName',
        'lastName',
        'fullName',
        'healthData',
        'medicalHistory',
        'diagnosis',
        'treatment',
        'medication',
    ];
    constructor(logger, sentryService) {
        this.logger = logger || new logger_service_1.LoggerService();
        this.sentryService = sentryService;
    }
    getOrGenerateRequestId(request) {
        const existingId = request.headers['x-request-id'];
        if (existingId) {
            return existingId;
        }
        const requestId = (0, uuid_1.v4)();
        request.headers['x-request-id'] = requestId;
        return requestId;
    }
    setRequestIdHeader(response, requestId) {
        response.setHeader('X-Request-ID', requestId);
    }
    getClientIp(request) {
        return (request.headers['x-forwarded-for']?.split(',')[0] ||
            request.headers['x-real-ip'] ||
            request.socket?.remoteAddress ||
            request.connection?.remoteAddress ||
            'unknown');
    }
    getUserContext(request) {
        const user = request.user;
        return {
            userId: user?.id || 'anonymous',
            organizationId: user?.organizationId,
            roles: user?.roles,
        };
    }
    redactSensitiveData(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => this.redactSensitiveData(item));
        }
        const redacted = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (this.isSensitiveField(key)) {
                    redacted[key] = '[REDACTED]';
                }
                else {
                    const value = obj[key];
                    if (typeof value === 'object' && value !== null) {
                        redacted[key] = this.redactSensitiveData(value);
                    }
                    else {
                        redacted[key] = value;
                    }
                }
            }
        }
        return redacted;
    }
    isSensitiveField(field) {
        const fieldLower = field.toLowerCase();
        return this.sensitiveFields.some((sensitive) => fieldLower.includes(sensitive));
    }
    logRequest(level, message, metadata) {
        this.logger.logWithMetadata(level, message, {
            type: 'REQUEST',
            timestamp: new Date().toISOString(),
            ...metadata,
        });
    }
    logResponse(level, message, metadata) {
        this.logger.logWithMetadata(level, message, {
            type: 'RESPONSE',
            timestamp: new Date().toISOString(),
            ...metadata,
        });
    }
    logError(message, error, metadata) {
        this.logger.logWithMetadata('error', message, {
            type: 'ERROR',
            timestamp: new Date().toISOString(),
            error: error.message,
            errorName: error.name,
            stack: error.stack,
            ...metadata,
        });
    }
    addSentryBreadcrumb(message, category, level = 'info', data) {
        if (this.sentryService) {
            this.sentryService.addBreadcrumb({
                message,
                category,
                level,
                data,
            });
        }
    }
    reportToSentry(error, context, level = 'error') {
        if (this.sentryService) {
            this.sentryService.captureException(error, {
                ...context,
                level,
            });
        }
    }
    getDurationString(startTime) {
        const duration = Date.now() - startTime;
        return {
            duration,
            durationMs: `${duration}ms`,
        };
    }
    isSlowExecution(duration, threshold = 1000) {
        return duration > threshold;
    }
    getHandlerInfo(context) {
        return {
            handler: context.getHandler().name,
            controller: context.getClass().name,
        };
    }
};
exports.BaseInterceptor = BaseInterceptor;
exports.BaseInterceptor = BaseInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService, sentry_service_1.SentryService])
], BaseInterceptor);
//# sourceMappingURL=base.interceptor.js.map