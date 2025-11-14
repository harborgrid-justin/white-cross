"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
const Sentry = __importStar(require("@sentry/node"));
const config_1 = require("@nestjs/config");
let SentryService = class SentryService extends base_1.BaseService {
    configService;
    isInitialized = false;
    constructor(logger, configService) {
        super({
            serviceName: 'SentryService',
            logger,
            enableAuditLogging: true,
        });
        this.configService = configService;
    }
    onModuleInit() {
        this.initialize();
    }
    initialize() {
        const dsn = this.configService.get('SENTRY_DSN');
        const environment = this.configService.get('NODE_ENV', 'development');
        const release = this.configService.get('APP_VERSION', '1.0.0');
        if (!dsn || environment === 'test') {
            this.logWarning('Sentry not initialized: DSN not configured or test environment');
            return;
        }
        try {
            Sentry.init({
                dsn,
                environment,
                release: `white-cross-api@${release}`,
                tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
                profilesSampleRate: environment === 'production' ? 0.1 : 1.0,
                integrations: [
                    Sentry.httpIntegration(),
                ],
                beforeSend: (event, hint) => {
                    return this.sanitizeEvent(event);
                },
                beforeBreadcrumb: (breadcrumb) => {
                    return this.sanitizeBreadcrumb(breadcrumb);
                },
                sendDefaultPii: false,
                ignoreErrors: [
                    'ValidationError',
                    'UnauthorizedException',
                    'NotFoundException',
                ],
            });
            this.isInitialized = true;
            this.logInfo(`Sentry initialized for environment: ${environment}`);
        }
        catch (error) {
            this.logError('Failed to initialize Sentry', error);
        }
    }
    captureException(exception, context) {
        if (!this.isInitialized)
            return;
        try {
            Sentry.withScope((scope) => {
                if (context?.userId) {
                    scope.setUser({
                        id: context.userId,
                    });
                }
                if (context?.organizationId) {
                    scope.setTag('organization_id', context.organizationId);
                }
                if (context?.tags) {
                    Object.entries(context.tags).forEach(([key, value]) => {
                        scope.setTag(key, value);
                    });
                }
                if (context?.extra) {
                    Object.entries(context.extra).forEach(([key, value]) => {
                        scope.setExtra(key, this.sanitizeValue(value));
                    });
                }
                if (context?.level) {
                    scope.setLevel(context.level);
                }
                if (typeof exception === 'string') {
                    Sentry.captureMessage(exception, context?.level || 'error');
                }
                else {
                    Sentry.captureException(exception);
                }
            });
        }
        catch (error) {
            this.logError('Failed to capture exception in Sentry', error);
        }
    }
    captureMessage(message, level = 'info', context) {
        if (!this.isInitialized)
            return;
        try {
            Sentry.withScope((scope) => {
                if (context?.userId) {
                    scope.setUser({ id: context.userId });
                }
                if (context?.tags) {
                    Object.entries(context.tags).forEach(([key, value]) => {
                        scope.setTag(key, value);
                    });
                }
                if (context?.extra) {
                    Object.entries(context.extra).forEach(([key, value]) => {
                        scope.setExtra(key, this.sanitizeValue(value));
                    });
                }
                Sentry.captureMessage(message, level);
            });
        }
        catch (error) {
            this.logError('Failed to capture message in Sentry', error);
        }
    }
    addBreadcrumb(breadcrumb) {
        if (!this.isInitialized)
            return;
        try {
            Sentry.addBreadcrumb({
                message: breadcrumb.message,
                category: breadcrumb.category || 'custom',
                level: breadcrumb.level || 'info',
                data: breadcrumb.data ? this.sanitizeValue(breadcrumb.data) : undefined,
                timestamp: Date.now() / 1000,
            });
        }
        catch (error) {
            this.logError('Failed to add breadcrumb to Sentry', error);
        }
    }
    setUser(userId, organizationId) {
        if (!this.isInitialized)
            return;
        try {
            if (userId) {
                Sentry.setUser({
                    id: userId,
                });
                if (organizationId) {
                    Sentry.setTag('organization_id', organizationId);
                }
            }
            else {
                Sentry.setUser(null);
            }
        }
        catch (error) {
            this.logError('Failed to set user in Sentry', error);
        }
    }
    clearUser() {
        if (!this.isInitialized)
            return;
        Sentry.setUser(null);
    }
    sanitizeEvent(event) {
        if (event.request) {
            delete event.request.cookies;
            if (event.request.headers) {
                const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
                sensitiveHeaders.forEach((header) => {
                    if (event.request?.headers?.[header]) {
                        event.request.headers[header] = '[REDACTED]';
                    }
                });
            }
            if (event.request.query_string) {
                event.request.query_string = this.sanitizeQueryString(event.request.query_string);
            }
            if (event.request.data) {
                event.request.data = this.sanitizeValue(event.request.data);
            }
        }
        if (event.breadcrumbs) {
            event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => this.sanitizeBreadcrumb(breadcrumb));
        }
        if (event.extra) {
            event.extra = this.sanitizeValue(event.extra);
        }
        return event;
    }
    sanitizeBreadcrumb(breadcrumb) {
        if (breadcrumb.data) {
            breadcrumb.data = this.sanitizeValue(breadcrumb.data);
        }
        return breadcrumb;
    }
    sanitizeQueryString(queryString) {
        if (typeof queryString === 'string') {
            const sensitiveParams = ['token', 'password', 'ssn', 'dob', 'mrn'];
            let sanitized = queryString;
            sensitiveParams.forEach((param) => {
                const regex = new RegExp(`(${param}=)[^&]*`, 'gi');
                sanitized = sanitized.replace(regex, `$1[REDACTED]`);
            });
            return sanitized;
        }
        else if (Array.isArray(queryString)) {
            return queryString
                .map(([key, value]) => {
                const sensitiveParams = ['token', 'password', 'ssn', 'dob', 'mrn'];
                if (sensitiveParams.includes(key.toLowerCase())) {
                    return `${key}=[REDACTED]`;
                }
                return `${key}=${value}`;
            })
                .join('&');
        }
        else {
            const params = Object.entries(queryString);
            return params
                .map(([key, value]) => {
                const sensitiveParams = ['token', 'password', 'ssn', 'dob', 'mrn'];
                if (sensitiveParams.includes(key.toLowerCase())) {
                    return `${key}=[REDACTED]`;
                }
                return `${key}=${value}`;
            })
                .join('&');
        }
    }
    sanitizeValue(value) {
        if (value === null || value === undefined)
            return value;
        if (typeof value === 'string') {
            return this.sanitizeString(value);
        }
        if (Array.isArray(value)) {
            return value.map((item) => this.sanitizeValue(item));
        }
        if (typeof value === 'object') {
            const sanitized = {};
            const sensitiveFields = [
                'password',
                'ssn',
                'socialSecurityNumber',
                'dateOfBirth',
                'dob',
                'medicalRecordNumber',
                'mrn',
                'token',
                'accessToken',
                'refreshToken',
                'email',
                'phone',
                'address',
                'firstName',
                'lastName',
                'name',
            ];
            for (const [key, val] of Object.entries(value)) {
                const keyLower = key.toLowerCase();
                if (sensitiveFields.some((field) => keyLower.includes(field))) {
                    sanitized[key] = '[REDACTED]';
                }
                else {
                    sanitized[key] = this.sanitizeValue(val);
                }
            }
            return sanitized;
        }
        return value;
    }
    sanitizeString(str) {
        let sanitized = str;
        sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
        sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');
        sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');
        sanitized = sanitized.replace(/\b[A-Z0-9]{8,12}\b/g, '[ID]');
        return sanitized;
    }
    async flush(timeout = 2000) {
        if (!this.isInitialized)
            return true;
        try {
            return await Sentry.close(timeout);
        }
        catch (error) {
            this.logError('Failed to flush Sentry', error);
            return false;
        }
    }
};
exports.SentryService = SentryService;
exports.SentryService = SentryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService])
], SentryService);
//# sourceMappingURL=sentry.service.js.map