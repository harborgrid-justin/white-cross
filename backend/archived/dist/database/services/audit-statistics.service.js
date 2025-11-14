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
const audit_log_model_1 = require("../models/audit-log.model");
const base_1 = require("../../common/base");
let AuditStatisticsService = class AuditStatisticsService extends base_1.BaseService {
    auditLogModel;
    constructor(auditLogModel) {
        super("AuditStatisticsService");
        this.auditLogModel = auditLogModel;
    }
    async getAuditStatistics(startDate, endDate) {
        try {
            const where = {
                createdAt: {
                    [sequelize_2.Op.gte]: startDate,
                    [sequelize_2.Op.lte]: endDate,
                },
            };
            const [totalLogs, phiAccessCount, failedOperations] = await Promise.all([
                this.auditLogModel.count({ where }),
                this.auditLogModel.count({ where: { ...where, isPHI: true } }),
                this.auditLogModel.count({ where: { ...where, success: false } }),
            ]);
            const actionCounts = await this.auditLogModel.findAll({
                where,
                attributes: [
                    'action',
                    [this.auditLogModel.sequelize.fn('COUNT', '*'), 'count'],
                ],
                group: ['action'],
                raw: true,
            });
            const byAction = {};
            for (const row of actionCounts) {
                byAction[row.action] = parseInt(row.count, 10);
            }
            const entityCounts = await this.auditLogModel.findAll({
                where,
                attributes: [
                    'entityType',
                    [this.auditLogModel.sequelize.fn('COUNT', '*'), 'count'],
                ],
                group: ['entityType'],
                raw: true,
                limit: 10,
            });
            const byEntityType = {};
            for (const row of entityCounts) {
                byEntityType[row.entityType] = parseInt(row.count, 10);
            }
            const userCounts = await this.auditLogModel.findAll({
                where: { ...where, userId: { [sequelize_2.Op.ne]: null } },
                attributes: [
                    'userId',
                    [this.auditLogModel.sequelize.fn('COUNT', '*'), 'count'],
                ],
                group: ['userId'],
                raw: true,
                limit: 10,
            });
            const byUser = {};
            for (const row of userCounts) {
                byUser[row.userId] = parseInt(row.count, 10);
            }
            const severityCounts = await this.auditLogModel.findAll({
                where,
                attributes: [
                    'severity',
                    [this.auditLogModel.sequelize.fn('COUNT', '*'), 'count'],
                ],
                group: ['severity'],
                raw: true,
            });
            const bySeverity = {};
            for (const row of severityCounts) {
                bySeverity[row.severity] = parseInt(row.count, 10);
            }
            const complianceCounts = await this.auditLogModel.findAll({
                where,
                attributes: [
                    'complianceType',
                    [this.auditLogModel.sequelize.fn('COUNT', '*'), 'count'],
                ],
                group: ['complianceType'],
                raw: true,
            });
            const byComplianceType = {};
            for (const row of complianceCounts) {
                byComplianceType[row.complianceType] = parseInt(row.count, 10);
            }
            return {
                totalLogs,
                phiAccessCount,
                failedOperations,
                byAction,
                byEntityType,
                byUser,
                bySeverity,
                byComplianceType,
            };
        }
        catch (error) {
            this.logError(`Failed to get audit statistics: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.AuditStatisticsService = AuditStatisticsService;
exports.AuditStatisticsService = AuditStatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(audit_log_model_1.AuditLog)),
    __metadata("design:paramtypes", [Object])
], AuditStatisticsService);
//# sourceMappingURL=audit-statistics.service.js.map