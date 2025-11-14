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
exports.EnhancedAuditService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const security_interfaces_1 = require("../interfaces/security.interfaces");
const base_1 = require("../../../common/base");
let EnhancedAuditService = class EnhancedAuditService extends base_1.BaseService {
    configService;
    auditLog = [];
    maxLogSize = 10000;
    constructor(configService) {
        super('EnhancedAuditService');
        this.configService = configService;
    }
    async logEvent(action, resource, result, context, category = security_interfaces_1.AuditCategory.DATA_ACCESS, severity = 'MEDIUM') {
        try {
            const auditEntry = {
                id: this.generateAuditId(),
                timestamp: new Date(),
                action,
                resource,
                result,
                category,
                severity,
                ...context,
            };
            this.auditLog.push(auditEntry);
            if (this.auditLog.length > this.maxLogSize) {
                this.auditLog.shift();
            }
            const logLevel = this.getLogLevel(severity);
            this.logger[logLevel](`Audit Event: ${action} on ${resource} - ${result}`, {
                auditId: auditEntry.id,
                userId: context.userId,
                ipAddress: context.ipAddress,
                metadata: context.metadata,
            });
        }
        catch (error) {
            this.logError('Failed to log audit event:', error);
        }
    }
    getAuditLogs(filter) {
        let filteredLogs = [...this.auditLog];
        if (filter) {
            if (filter.userId) {
                filteredLogs = filteredLogs.filter((log) => log.userId === filter.userId);
            }
            if (filter.action) {
                filteredLogs = filteredLogs.filter((log) => log.action.includes(filter.action));
            }
            if (filter.category) {
                filteredLogs = filteredLogs.filter((log) => log.category === filter.category);
            }
            if (filter.startDate) {
                filteredLogs = filteredLogs.filter((log) => log.timestamp >= filter.startDate);
            }
            if (filter.endDate) {
                filteredLogs = filteredLogs.filter((log) => log.timestamp <= filter.endDate);
            }
            if (filter.severity) {
                filteredLogs = filteredLogs.filter((log) => log.severity === filter.severity);
            }
        }
        return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    generateAuditId() {
        return `audit_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
    getLogLevel(severity) {
        switch (severity) {
            case 'CRITICAL':
            case 'HIGH':
                return 'error';
            case 'MEDIUM':
                return 'warn';
            default:
                return 'log';
        }
    }
};
exports.EnhancedAuditService = EnhancedAuditService;
exports.EnhancedAuditService = EnhancedAuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EnhancedAuditService);
//# sourceMappingURL=audit.service.js.map