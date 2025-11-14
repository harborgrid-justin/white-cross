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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let AuditService = class AuditService extends base_1.BaseService {
    auditLogModel;
    constructor(auditLogModel) {
        super();
        this.auditLogModel = auditLogModel;
    }
    async createAuditLog(entry) {
        try {
            const auditLog = await this.auditLogModel.create({
                userId: entry.userId,
                userName: entry.userName,
                action: entry.action,
                entityType: entry.entityType,
                entityId: entry.entityId,
                description: entry.description,
                metadata: entry.metadata,
                ipAddress: entry.ipAddress,
                userAgent: entry.userAgent,
                timestamp: new Date(),
            });
            this.logInfo(`Audit log created: ${entry.action} on ${entry.entityType}`);
            return auditLog;
        }
        catch (error) {
            this.logError('Error creating audit log:', error);
            throw error;
        }
    }
    async getAuditLogs(filters = {}) {
        try {
            const { userId, entityType, entityId, action, startDate, endDate, page = 1, limit = 50, } = filters;
            const whereClause = {};
            if (userId)
                whereClause.userId = userId;
            if (entityType)
                whereClause.entityType = entityType;
            if (entityId)
                whereClause.entityId = entityId;
            if (action)
                whereClause.action = action;
            if (startDate || endDate) {
                whereClause.timestamp = {};
                if (startDate)
                    whereClause.timestamp.$gte = startDate;
                if (endDate)
                    whereClause.timestamp.$lte = endDate;
            }
            const offset = (page - 1) * limit;
            const { rows: logs, count: total } = await this.auditLogModel.findAndCountAll({
                where: whereClause,
                order: [['timestamp', 'DESC']],
                limit,
                offset,
            });
            const pages = Math.ceil(total / limit);
            this.logInfo(`Retrieved ${logs.length} audit logs (page ${page}/${pages})`);
            return {
                logs,
                total,
                page,
                pages,
            };
        }
        catch (error) {
            this.logError('Error getting audit logs:', error);
            throw error;
        }
    }
    async getEntityAuditLogs(entityType, entityId, page = 1, limit = 20) {
        try {
            const offset = (page - 1) * limit;
            const logs = await this.auditLogModel.findAll({
                where: {
                    entityType,
                    entityId,
                },
                order: [['timestamp', 'DESC']],
                limit,
                offset,
            });
            this.logInfo(`Retrieved ${logs.length} audit logs for ${entityType}:${entityId}`);
            return logs;
        }
        catch (error) {
            this.logError(`Error getting entity audit logs for ${entityType}:${entityId}:`, error);
            throw error;
        }
    }
    async getUserAuditLogs(userId, page = 1, limit = 20) {
        try {
            const offset = (page - 1) * limit;
            const logs = await this.auditLogModel.findAll({
                where: { userId },
                order: [['timestamp', 'DESC']],
                limit,
                offset,
            });
            this.logInfo(`Retrieved ${logs.length} audit logs for user ${userId}`);
            return logs;
        }
        catch (error) {
            this.logError(`Error getting user audit logs for ${userId}:`, error);
            throw error;
        }
    }
    async logComplianceEvent(action, entityType, entityId, userId, description, metadata) {
        return this.createAuditLog({
            userId,
            action,
            entityType,
            entityId,
            description,
            metadata: {
                ...metadata,
                complianceEvent: true,
            },
        });
    }
    async logPHIAccess(entityType, entityId, userId, action, description, metadata) {
        return this.createAuditLog({
            userId,
            action,
            entityType,
            entityId,
            description,
            metadata: {
                ...metadata,
                PHIAccess: true,
                complianceEvent: true,
            },
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.AuditLog)),
    __metadata("design:paramtypes", [Object])
], AuditService);
//# sourceMappingURL=audit.service.js.map