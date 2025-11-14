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
exports.AuditHelperService = void 0;
const common_1 = require("@nestjs/common");
const database_enums_1 = require("../types/database.enums");
const audit_log_model_1 = require("../models/audit-log.model");
const base_1 = require("../../common/base");
let AuditHelperService = class AuditHelperService extends base_1.BaseService {
    constructor() {
        super('AuditHelperService');
    }
    sanitizeSensitiveData(data) {
        if (!data || typeof data !== 'object') {
            return data;
        }
        const sanitized = { ...data };
        for (const field of database_enums_1.SENSITIVE_FIELDS) {
            if (field in sanitized) {
                sanitized[field] = '[REDACTED]';
            }
        }
        for (const [key, value] of Object.entries(sanitized)) {
            if (value && typeof value === 'object') {
                sanitized[key] = this.sanitizeSensitiveData(value);
            }
        }
        return sanitized;
    }
    determineComplianceType(entityType, isPHI) {
        if (isPHI) {
            return audit_log_model_1.ComplianceType.HIPAA;
        }
        const ferpaEntities = [
            'Student',
            'AcademicRecord',
            'GradeTransition',
            'Attendance',
        ];
        if (ferpaEntities.includes(entityType)) {
            return audit_log_model_1.ComplianceType.FERPA;
        }
        return audit_log_model_1.ComplianceType.GENERAL;
    }
    determineSeverity(action, entityType, success) {
        if (!success) {
            return audit_log_model_1.AuditSeverity.HIGH;
        }
        const criticalActions = [
            database_enums_1.AuditAction.DELETE,
            database_enums_1.AuditAction.BULK_DELETE,
            database_enums_1.AuditAction.EXPORT,
        ];
        if (criticalActions.includes(action)) {
            return audit_log_model_1.AuditSeverity.HIGH;
        }
        if ((0, database_enums_1.isPHIEntity)(entityType)) {
            return audit_log_model_1.AuditSeverity.MEDIUM;
        }
        return audit_log_model_1.AuditSeverity.LOW;
    }
    isPHIEntity(entityType) {
        return (0, database_enums_1.isPHIEntity)(entityType);
    }
};
exports.AuditHelperService = AuditHelperService;
exports.AuditHelperService = AuditHelperService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuditHelperService);
//# sourceMappingURL=audit-helper.service.js.map