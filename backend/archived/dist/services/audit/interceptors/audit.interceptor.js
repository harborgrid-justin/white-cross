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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_action_enum_1 = require("../enums/audit-action.enum");
const audit_service_1 = require("../audit.service");
const base_interceptor_1 = require("../../../common/interceptors/base.interceptor");
let AuditInterceptor = class AuditInterceptor extends base_interceptor_1.BaseInterceptor {
    auditService;
    constructor(auditService) {
        super();
        this.auditService = auditService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const { userId } = this.getUserContext(request);
        const { handler, controller } = this.getHandlerInfo(context);
        const action = this.getActionFromMethod(method);
        const entityType = this.getEntityTypeFromUrl(url);
        const ipAddress = this.getClientIp(request);
        const userAgent = request.headers['user-agent'] || 'unknown';
        this.logRequest('debug', `Audit interception started for ${controller}.${handler}`, {
            method,
            url,
            action,
            entityType,
            userId,
        });
        return next.handle().pipe((0, operators_1.tap)({
            next: (data) => {
                if (this.auditService) {
                    this.auditService
                        .logAction({
                        userId,
                        action,
                        entityType,
                        entityId: data && typeof data === 'object' && 'id' in data ? String(data.id) : undefined,
                        changes: { method, url, success: true },
                        ipAddress,
                        userAgent,
                        success: true,
                    })
                        .catch((error) => {
                        this.logError('Failed to log audit action', error, {
                            controller,
                            handler,
                            method,
                            url,
                        });
                    });
                }
                this.logResponse('debug', `Audit action completed successfully`, {
                    controller,
                    handler,
                    action,
                    entityType,
                    success: true,
                });
            },
            error: (error) => {
                if (this.auditService) {
                    this.auditService
                        .logAction({
                        userId,
                        action,
                        entityType,
                        changes: { method, url, success: false },
                        ipAddress,
                        userAgent,
                        success: false,
                        errorMessage: error.message,
                    })
                        .catch((err) => {
                        this.logError('Failed to log audit action error', err, {
                            controller,
                            handler,
                            method,
                            url,
                            originalError: error.message,
                        });
                    });
                }
                this.logError(`Audit action failed in ${controller}.${handler}`, error, {
                    controller,
                    handler,
                    action,
                    entityType,
                    success: false,
                });
            },
        }));
    }
    getActionFromMethod(method) {
        switch (method.toUpperCase()) {
            case 'POST':
                return audit_action_enum_1.AuditAction.CREATE;
            case 'GET':
                return audit_action_enum_1.AuditAction.READ;
            case 'PUT':
            case 'PATCH':
                return audit_action_enum_1.AuditAction.UPDATE;
            case 'DELETE':
                return audit_action_enum_1.AuditAction.DELETE;
            default:
                return audit_action_enum_1.AuditAction.READ;
        }
    }
    getEntityTypeFromUrl(url) {
        const parts = url.split('/').filter((p) => p && !p.match(/^\d+$/) && p !== 'api');
        if (parts.length > 0) {
            const entity = parts[0];
            return entity.charAt(0).toUpperCase() + entity.slice(1, -1);
        }
        return 'Unknown';
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map