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
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../../../database");
const base_1 = require("../../../common/base");
let AuditLogService = class AuditLogService extends base_1.BaseService {
    auditLogModel;
    constructor(auditLogModel) {
        super('AuditLogService');
        this.auditLogModel = auditLogModel;
    }
    async logAction(entry) {
        try {
            await this.auditLogModel.create({
                userId: entry.userId || null,
                action: entry.action,
                entityType: entry.entityType,
                entityId: entry.entityId || null,
                changes: {
                    ...entry.changes,
                    success: entry.success !== undefined ? entry.success : true,
                    errorMessage: entry.errorMessage,
                    details: entry.changes || {},
                },
                ipAddress: entry.ipAddress || null,
                userAgent: entry.userAgent || null,
                isPHI: false,
                complianceType: database_1.ComplianceType.GENERAL,
                severity: database_1.AuditSeverity.LOW,
                success: entry.success !== undefined ? entry.success : true,
                tags: [],
            });
            this.logInfo(`Audit: ${entry.action} on ${entry.entityType}${entry.entityId ? ` (ID: ${entry.entityId})` : ''} by user ${entry.userId || 'SYSTEM'}`);
        }
        catch (error) {
            this.logError('Failed to create audit log:', error);
        }
    }
    async getAuditLogById(id) {
        try {
            return await this.auditLogModel.findByPk(id);
        }
        catch (error) {
            this.logError('Error fetching audit log by ID:', error);
            throw new Error('Failed to fetch audit log');
        }
    }
    async getRecentAuditLogs(limit = 50) {
        try {
            return await this.auditLogModel.findAll({
                order: [['createdAt', 'DESC']],
                limit: limit,
            });
        }
        catch (error) {
            this.logError('Error fetching recent audit logs:', error);
            throw new Error('Failed to fetch recent audit logs');
        }
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.AuditLog)),
    __metadata("design:paramtypes", [Object])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map