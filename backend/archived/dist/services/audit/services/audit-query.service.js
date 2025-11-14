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
const database_1 = require("../../../database");
const base_1 = require("../../../common/base");
let AuditQueryService = class AuditQueryService extends base_1.BaseService {
    auditLogModel;
    constructor(auditLogModel) {
        super('AuditQueryService');
        this.auditLogModel = auditLogModel;
    }
    async getAuditLogs(filters = {}) {
        try {
            const { userId, entityType, action, startDate, endDate, page = 1, limit = 50 } = filters;
            const skip = (page - 1) * limit;
            const where = {};
            if (userId) {
                where.userId = userId;
            }
            if (entityType) {
                where.entityType = entityType;
            }
            if (action) {
                where.action = action;
            }
            if (startDate || endDate) {
                where.createdAt = {
                    [sequelize_2.Op.between]: [startDate || new Date(0), endDate || new Date()],
                };
            }
            const { rows: data, count: total } = await this.auditLogModel.findAndCountAll({
                where,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit,
            });
            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.logError('Error fetching audit logs:', error);
            throw new Error('Failed to fetch audit logs');
        }
    }
    async getEntityAuditHistory(entityType, entityId, page = 1, limit = 20) {
        try {
            const skip = (page - 1) * limit;
            const { rows: data, count: total } = await this.auditLogModel.findAndCountAll({
                where: {
                    entityType,
                    entityId,
                },
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit,
            });
            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.logError('Error fetching entity audit history:', error);
            throw new Error('Failed to fetch entity audit history');
        }
    }
    async getUserAuditHistory(userId, page = 1, limit = 20) {
        try {
            const skip = (page - 1) * limit;
            const { rows: data, count: total } = await this.auditLogModel.findAndCountAll({
                where: { userId },
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit,
            });
            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.logError('Error fetching user audit history:', error);
            throw new Error('Failed to fetch user audit history');
        }
    }
    async searchAuditLogs(criteria) {
        try {
            const { keyword, page = 1, limit = 20 } = criteria;
            const skip = (page - 1) * limit;
            const whereClause = {
                [sequelize_2.Op.or]: [
                    { entityType: { [sequelize_2.Op.iLike]: `%${keyword}%` } },
                    { entityId: { [sequelize_2.Op.iLike]: `%${keyword}%` } },
                    (0, sequelize_2.literal)(`CAST(changes AS TEXT) ILIKE '${keyword.replace(/'/g, "''")}'`),
                ],
            };
            const { rows: data, count: total } = await this.auditLogModel.findAndCountAll({
                where: whereClause,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit,
            });
            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.logError('Error searching audit logs:', error);
            throw new Error('Failed to search audit logs');
        }
    }
    async getAuditLogsByDateRange(startDate, endDate, page = 1, limit = 50) {
        return this.getAuditLogs({
            startDate,
            endDate,
            page,
            limit,
        });
    }
};
exports.AuditQueryService = AuditQueryService;
exports.AuditQueryService = AuditQueryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.AuditLog)),
    __metadata("design:paramtypes", [Object])
], AuditQueryService);
//# sourceMappingURL=audit-query.service.js.map