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
exports.AuditStatisticsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../../database");
const base_1 = require("../../../common/base");
let AuditStatisticsService = class AuditStatisticsService extends base_1.BaseService {
    auditLogModel;
    constructor(auditLogModel) {
        super('AuditStatisticsService');
        this.auditLogModel = auditLogModel;
    }
    async getAuditStatistics(startDate, endDate) {
        try {
            const totalLogs = await this.auditLogModel.count({
                where: {
                    createdAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
            });
            const uniqueUsersResult = await this.auditLogModel.findAll({
                where: {
                    createdAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                    userId: {
                        [sequelize_2.Op.ne]: null,
                    },
                },
                attributes: [[(0, sequelize_2.fn)('COUNT', (0, sequelize_2.fn)('DISTINCT', (0, sequelize_2.col)('userId'))), 'count']],
                raw: true,
            });
            const actionDistribution = await this.auditLogModel.findAll({
                where: {
                    createdAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                attributes: ['action', [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('*')), 'count']],
                group: ['action'],
                raw: true,
            });
            const entityTypeDistribution = await this.auditLogModel.findAll({
                where: {
                    createdAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                attributes: ['entityType', [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('*')), 'count']],
                group: ['entityType'],
                raw: true,
            });
            return {
                period: {
                    start: startDate,
                    end: endDate,
                },
                totalLogs,
                uniqueUsers: parseInt(String(uniqueUsersResult[0]?.count || '0'), 10),
                actionDistribution: actionDistribution.map((item) => ({
                    action: item.action,
                    count: typeof item.count === 'string' ? parseInt(item.count, 10) : item.count,
                })),
                entityTypeDistribution: entityTypeDistribution.map((item) => ({
                    entityType: item.entityType,
                    count: typeof item.count === 'string' ? parseInt(item.count, 10) : item.count,
                })),
            };
        }
        catch (error) {
            this.logError('Error getting audit statistics:', error);
            throw new Error('Failed to get audit statistics');
        }
    }
    async getAuditDashboard(startDate, endDate) {
        try {
            const stats = await this.getAuditStatistics(startDate, endDate);
            return {
                period: { start: startDate, end: endDate },
                overview: {
                    totalLogs: stats.totalLogs,
                    uniqueUsers: stats.uniqueUsers,
                },
                distributions: {
                    actions: stats.actionDistribution,
                    entityTypes: stats.entityTypeDistribution,
                },
            };
        }
        catch (error) {
            this.logError('Error getting audit dashboard:', error);
            throw new Error('Failed to get audit dashboard');
        }
    }
};
exports.AuditStatisticsService = AuditStatisticsService;
exports.AuditStatisticsService = AuditStatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.AuditLog)),
    __metadata("design:paramtypes", [Object])
], AuditStatisticsService);
//# sourceMappingURL=audit-statistics.service.js.map