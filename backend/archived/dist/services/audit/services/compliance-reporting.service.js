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
exports.ComplianceReportingService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../../database");
const base_1 = require("../../../common/base");
let ComplianceReportingService = class ComplianceReportingService extends base_1.BaseService {
    auditLogModel;
    constructor(auditLogModel) {
        super('ComplianceReportingService');
        this.auditLogModel = auditLogModel;
    }
    async getComplianceReport(startDate, endDate) {
        try {
            const phiLogs = await this.auditLogModel.findAll({
                where: {
                    createdAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                    [sequelize_2.Op.and]: [(0, sequelize_2.literal)(`changes->>'isPHIAccess' = 'true'`)],
                },
            });
            const totalAccess = phiLogs.length;
            const failedAccess = phiLogs.filter((log) => log.changes && typeof log.changes === 'object' && 'success' in log.changes && log.changes['success'] === false).length;
            const accessByType = {};
            phiLogs.forEach((log) => {
                const type = (log.changes && typeof log.changes === 'object' && 'accessType' in log.changes)
                    ? String(log.changes['accessType'])
                    : 'UNKNOWN';
                accessByType[type] = (accessByType[type] || 0) + 1;
            });
            const accessByCategory = {};
            phiLogs.forEach((log) => {
                const category = (log.changes && typeof log.changes === 'object' && 'dataCategory' in log.changes)
                    ? String(log.changes['dataCategory'])
                    : 'UNKNOWN';
                accessByCategory[category] = (accessByCategory[category] || 0) + 1;
            });
            return {
                period: {
                    start: startDate,
                    end: endDate,
                },
                summary: {
                    totalAccess,
                    failedAccess,
                    successRate: totalAccess > 0 ? ((totalAccess - failedAccess) / totalAccess) * 100 : 0,
                },
                accessByType: Object.entries(accessByType).map(([type, count]) => ({
                    type,
                    count,
                })),
                accessByCategory: Object.entries(accessByCategory).map(([category, count]) => ({
                    category,
                    count,
                })),
            };
        }
        catch (error) {
            this.logError('Error generating compliance report:', error);
            throw new Error('Failed to generate compliance report');
        }
    }
    async getPHIAccessSummary(startDate, endDate) {
        try {
            const phiLogs = await this.auditLogModel.findAll({
                where: {
                    createdAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                    [sequelize_2.Op.and]: [(0, sequelize_2.literal)(`changes->>'isPHIAccess' = 'true'`)],
                },
            });
            const totalAccess = phiLogs.length;
            const successfulAccess = phiLogs.filter((log) => !(log.changes && typeof log.changes === 'object' && 'success' in log.changes && log.changes['success'] === false)).length;
            const failedAccess = totalAccess - successfulAccess;
            return {
                period: { start: startDate, end: endDate },
                totalAccess,
                successfulAccess,
                failedAccess,
                successRate: totalAccess > 0 ? (successfulAccess / totalAccess) * 100 : 0,
            };
        }
        catch (error) {
            this.logError('Error generating PHI access summary:', error);
            throw new Error('Failed to generate PHI access summary');
        }
    }
};
exports.ComplianceReportingService = ComplianceReportingService;
exports.ComplianceReportingService = ComplianceReportingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.AuditLog)),
    __metadata("design:paramtypes", [Object])
], ComplianceReportingService);
//# sourceMappingURL=compliance-reporting.service.js.map