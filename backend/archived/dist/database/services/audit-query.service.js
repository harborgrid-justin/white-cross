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
exports.AuditQueryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const audit_log_model_1 = require("../models/audit-log.model");
const base_1 = require("../../common/base");
let AuditQueryService = class AuditQueryService extends base_1.BaseService {
    auditLogModel;
    constructor(auditLogModel) {
        super("AuditQueryService");
        this.auditLogModel = auditLogModel;
    }
    async queryAuditLogs(filters = {}, options = {}) {
        const page = options.page || 1;
        const limit = options.limit || 50;
        const offset = (page - 1) * limit;
        const sortBy = options.sortBy || 'createdAt';
        const sortOrder = options.sortOrder || 'DESC';
        const where = {};
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.entityType)
            where.entityType = filters.entityType;
        if (filters.entityId)
            where.entityId = filters.entityId;
        if (filters.action)
            where.action = filters.action;
        if (filters.isPHI !== undefined)
            where.isPHI = filters.isPHI;
        if (filters.complianceType)
            where.complianceType = filters.complianceType;
        if (filters.severity)
            where.severity = filters.severity;
        if (filters.success !== undefined)
            where.success = filters.success;
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt[sequelize_2.Op.gte] = filters.startDate;
            if (filters.endDate)
                where.createdAt[sequelize_2.Op.lte] = filters.endDate;
        }
        if (filters.tags && filters.tags.length > 0) {
            where.tags = {
                [sequelize_2.Op.overlap]: filters.tags,
            };
        }
        if (filters.searchTerm) {
            where[sequelize_2.Op.or] = [
                { userName: { [sequelize_2.Op.iLike]: `%${filters.searchTerm}%` } },
                { entityType: { [sequelize_2.Op.iLike]: `%${filters.searchTerm}%` } },
                { entityId: { [sequelize_2.Op.iLike]: `%${filters.searchTerm}%` } },
            ];
        }
        try {
            const { rows: logs, count: total } = await this.auditLogModel.findAndCountAll({
                where,
                offset,
                limit,
                order: [[sortBy, sortOrder]],
            });
            return {
                logs,
                total,
                page,
                pages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            this.logError(`Failed to query audit logs: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getEntityAuditHistory(entityType, entityId, options = {}) {
        const result = await this.queryAuditLogs({ entityType, entityId }, { ...options, sortOrder: 'ASC' });
        return result.logs;
    }
    async getUserAuditHistory(userId, options = {}) {
        const result = await this.queryAuditLogs({ userId }, { ...options, sortOrder: 'DESC' });
        return result.logs;
    }
    async getPHIAccessLogs(startDate, endDate, options = {}) {
        const result = await this.queryAuditLogs({ isPHI: true, startDate, endDate }, { ...options, sortOrder: 'DESC' });
        return result.logs;
    }
};
exports.AuditQueryService = AuditQueryService;
exports.AuditQueryService = AuditQueryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(audit_log_model_1.AuditLog)),
    __metadata("design:paramtypes", [Object])
], AuditQueryService);
//# sourceMappingURL=audit-query.service.js.map