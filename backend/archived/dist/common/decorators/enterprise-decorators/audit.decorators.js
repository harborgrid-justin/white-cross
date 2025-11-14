"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseAuditService = exports.AUDIT_METADATA = void 0;
exports.AuditLog = AuditLog;
exports.AuditPHI = AuditPHI;
exports.AuditDataExport = AuditDataExport;
exports.AuditAuth = AuditAuth;
exports.AuditConfigChange = AuditConfigChange;
exports.AuditEmergencyAccess = AuditEmergencyAccess;
const common_1 = require("@nestjs/common");
exports.AUDIT_METADATA = 'enterprise:audit';
let EnterpriseAuditService = class EnterpriseAuditService {
    auditLogs = [];
    maxLogsInMemory = 10000;
    async logAuditEvent(entry) {
        const auditEntry = {
            id: this.generateAuditId(),
            timestamp: new Date(),
            ...entry
        };
        this.auditLogs.push(auditEntry);
        if (this.auditLogs.length > this.maxLogsInMemory) {
            this.auditLogs = this.auditLogs.slice(-this.maxLogsInMemory);
        }
        const logLevel = auditEntry.containsPHI ? 'warn' : 'info';
        const message = `AUDIT: ${auditEntry.action} on ${auditEntry.resource} by ${auditEntry.userId}`;
        if (logLevel === 'warn') {
            console.warn(message, {
                resourceId: auditEntry.resourceId,
                correlationId: auditEntry.correlationId,
                success: auditEntry.success
            });
        }
        else {
            console.log(message, {
                resourceId: auditEntry.resourceId,
                correlationId: auditEntry.correlationId,
                success: auditEntry.success
            });
        }
    }
    getAuditLogs(filters) {
        let filteredLogs = this.auditLogs;
        if (filters) {
            filteredLogs = filteredLogs.filter(log => {
                if (filters.userId && log.userId !== filters.userId)
                    return false;
                if (filters.resource && log.resource !== filters.resource)
                    return false;
                if (filters.action && log.action !== filters.action)
                    return false;
                if (filters.containsPHI !== undefined && log.containsPHI !== filters.containsPHI)
                    return false;
                if (filters.startDate && log.timestamp < filters.startDate)
                    return false;
                if (filters.endDate && log.timestamp > filters.endDate)
                    return false;
                return true;
            });
        }
        return filteredLogs
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, filters?.limit || 100);
    }
    generateAuditId() {
        return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    containsPHI(data) {
        if (!data)
            return false;
        const phiIndicators = [
            'ssn', 'socialSecurity', 'medicalRecord', 'diagnosis', 'medication',
            'health', 'patient', 'doctor', 'insurance', 'policy'
        ];
        const checkObject = (obj) => {
            if (typeof obj === 'string') {
                const lower = obj.toLowerCase();
                return phiIndicators.some(indicator => lower.includes(indicator));
            }
            else if (typeof obj === 'object' && obj !== null) {
                return Object.values(obj).some(value => checkObject(value));
            }
            return false;
        };
        return checkObject(data);
    }
};
exports.EnterpriseAuditService = EnterpriseAuditService;
exports.EnterpriseAuditService = EnterpriseAuditService = __decorate([
    (0, common_1.Injectable)()
], EnterpriseAuditService);
function AuditLog(options) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const auditService = this.auditService;
            const request = this.request;
            if (!auditService || !request) {
                console.warn(`Audit service or request context not available for ${methodName}`);
                return await originalMethod.apply(this, args);
            }
            const auditData = options.dataExtractor
                ? options.dataExtractor({})
                : {};
            const containsPHI = options.containsPHI || auditService.containsPHI(args);
            let success = false;
            let errorMessage;
            let result;
            try {
                result = await originalMethod.apply(this, args);
                success = true;
                return result;
            }
            catch (error) {
                errorMessage = error.message;
                throw error;
            }
            finally {
                await auditService.logAuditEvent({
                    userId: request.userContext?.id || 'anonymous',
                    userRole: request.userContext?.roles?.[0] || 'unknown',
                    action: options.eventType,
                    resource: target.constructor.name,
                    resourceId: auditData.resourceId,
                    ipAddress: request.ip,
                    userAgent: request.get('User-Agent') || '',
                    correlationId: request.correlationId,
                    containsPHI,
                    success,
                    details: auditData,
                    errorMessage
                });
            }
        };
        (0, common_1.SetMetadata)(exports.AUDIT_METADATA, options)(target, propertyKey, descriptor);
    };
}
function AuditPHI(action) {
    return AuditLog({
        eventType: action,
        containsPHI: true,
        level: 'warn'
    });
}
function AuditDataExport(resourceType) {
    return AuditLog({
        eventType: 'DATA_EXPORT',
        containsPHI: true,
        dataExtractor: (context) => ({
            resourceType,
            exportTimestamp: new Date(),
        })
    });
}
function AuditAuth(action) {
    return AuditLog({
        eventType: `AUTH_${action}`,
        containsPHI: false,
        dataExtractor: (context) => ({
            authAction: action,
            timestamp: new Date()
        })
    });
}
function AuditConfigChange() {
    return AuditLog({
        eventType: 'CONFIG_CHANGE',
        containsPHI: false,
        dataExtractor: (context) => ({
            changeType: 'configuration',
            timestamp: new Date()
        })
    });
}
function AuditEmergencyAccess(reason) {
    return AuditLog({
        eventType: 'EMERGENCY_ACCESS',
        containsPHI: true,
        level: 'critical',
        dataExtractor: (context) => ({
            emergencyReason: reason,
            timestamp: new Date(),
            requiresApproval: true
        })
    });
}
//# sourceMappingURL=audit.decorators.js.map