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
exports.AuditComplianceService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const audit_log_model_1 = require("../models/audit-log.model");
const base_1 = require("../../common/base");
let AuditComplianceService = class AuditComplianceService extends base_1.BaseService {
    auditLogModel;
    constructor(auditLogModel) {
        super("AuditComplianceService");
        this.auditLogModel = auditLogModel;
    }
    async generateComplianceReport(complianceType, startDate, endDate) {
        try {
            const where = {
                complianceType,
                createdAt: {
                    [sequelize_2.Op.gte]: startDate,
                    [sequelize_2.Op.lte]: endDate,
                },
            };
            const [totalAccess, phiAccess, failedAccess, criticalEvents] = await Promise.all([
                this.auditLogModel.count({ where }),
                this.auditLogModel.count({ where: { ...where, isPHI: true } }),
                this.auditLogModel.count({ where: { ...where, success: false } }),
                this.auditLogModel.count({
                    where: { ...where, severity: audit_log_model_1.AuditSeverity.CRITICAL },
                }),
            ]);
            const uniqueUsersResult = await this.auditLogModel.findAll({
                where: { ...where, userId: { [sequelize_2.Op.ne]: null } },
                attributes: [
                    [
                        this.auditLogModel.sequelize.fn('COUNT', this.auditLogModel.sequelize.fn('DISTINCT', this.auditLogModel.sequelize.col('userId'))),
                        'count',
                    ],
                ],
                raw: true,
            });
            const uniqueUsers = parseInt(uniqueUsersResult[0].count, 10);
            const entityCounts = await this.auditLogModel.findAll({
                where,
                attributes: [
                    'entityType',
                    [this.auditLogModel.sequelize.fn('COUNT', '*'), 'count'],
                ],
                group: ['entityType'],
                order: [[this.auditLogModel.sequelize.literal('count'), 'DESC']],
                limit: 10,
                raw: true,
            });
            const topAccessedEntities = entityCounts.map((row) => ({
                entityType: row.entityType,
                count: parseInt(row.count, 10),
            }));
            const userActivity = await this.auditLogModel.findAll({
                where: { ...where, userId: { [sequelize_2.Op.ne]: null } },
                attributes: [
                    'userId',
                    'userName',
                    [this.auditLogModel.sequelize.fn('COUNT', '*'), 'count'],
                ],
                group: ['userId', 'userName'],
                order: [[this.auditLogModel.sequelize.literal('count'), 'DESC']],
                limit: 20,
                raw: true,
            });
            return {
                period: { start: startDate, end: endDate },
                complianceType,
                totalAccess,
                uniqueUsers,
                phiAccess,
                failedAccess,
                criticalEvents,
                topAccessedEntities,
                userActivity: userActivity.map((row) => ({
                    userId: row.userId,
                    userName: row.userName || 'Unknown',
                    accessCount: parseInt(row.count, 10),
                })),
            };
        }
        catch (error) {
            this.logError(`Failed to generate compliance report: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getHIPAAReport(startDate, endDate) {
        return this.generateComplianceReport(audit_log_model_1.ComplianceType.HIPAA, startDate, endDate);
    }
    async getFERPAReport(startDate, endDate) {
        return this.generateComplianceReport(audit_log_model_1.ComplianceType.FERPA, startDate, endDate);
    }
};
exports.AuditComplianceService = AuditComplianceService;
exports.AuditComplianceService = AuditComplianceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(audit_log_model_1.AuditLog)),
    __metadata("design:paramtypes", [Object])
], AuditComplianceService);
//# sourceMappingURL=audit-compliance.service.js.map