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
exports.ComplianceReportsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let ComplianceReportsService = class ComplianceReportsService extends base_1.BaseService {
    auditLogModel;
    sequelize;
    constructor(auditLogModel, sequelize) {
        super("ComplianceReportsService");
        this.auditLogModel = auditLogModel;
        this.sequelize = sequelize;
    }
    async getComplianceReport(dto) {
        try {
            const { startDate, endDate } = dto;
            const whereClause = {};
            if (startDate || endDate) {
                whereClause.createdAt = {};
                if (startDate && endDate) {
                    whereClause.createdAt = { [sequelize_2.Op.between]: [startDate, endDate] };
                }
                else if (startDate) {
                    whereClause.createdAt = { [sequelize_2.Op.gte]: startDate };
                }
                else if (endDate) {
                    whereClause.createdAt = { [sequelize_2.Op.lte]: endDate };
                }
            }
            const hipaaLogs = await this.auditLogModel.findAll({
                where: {
                    ...whereClause,
                    action: { [sequelize_2.Op.in]: ['VIEW', 'EXPORT', 'ACCESS'] },
                },
                order: [['createdAt', 'DESC']],
                limit: 100,
            });
            const medicationComplianceRaw = await this.sequelize.query(`SELECT "isActive", COUNT("id")::integer as count FROM student_medications GROUP BY "isActive"`, {
                type: sequelize_2.QueryTypes.SELECT,
                raw: true,
            });
            const medicationCompliance = medicationComplianceRaw.map((record) => ({
                isActive: record.isActive,
                count: parseInt(record.count, 10),
            }));
            let incidentQuery = `
        SELECT "legalComplianceStatus", COUNT("id")::integer as count
        FROM incident_reports
      `;
            const incidentReplacements = {};
            if (startDate && endDate) {
                incidentQuery += ' WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate';
                incidentReplacements.startDate = startDate;
                incidentReplacements.endDate = endDate;
            }
            else if (startDate) {
                incidentQuery += ' WHERE "createdAt" >= :startDate';
                incidentReplacements.startDate = startDate;
            }
            else if (endDate) {
                incidentQuery += ' WHERE "createdAt" <= :endDate';
                incidentReplacements.endDate = endDate;
            }
            incidentQuery += ' GROUP BY "legalComplianceStatus"';
            const incidentComplianceRaw = await this.sequelize.query(incidentQuery, {
                replacements: incidentReplacements,
                type: sequelize_2.QueryTypes.SELECT,
                raw: true,
            });
            const incidentCompliance = incidentComplianceRaw.map((record) => ({
                legalComplianceStatus: record.legalComplianceStatus,
                count: parseInt(record.count, 10),
            }));
            let vaccinationQuery = 'SELECT COUNT(*)::integer as count FROM vaccinations';
            const vaccinationReplacements = {};
            if (startDate && endDate) {
                vaccinationQuery += ' WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate';
                vaccinationReplacements.startDate = startDate;
                vaccinationReplacements.endDate = endDate;
            }
            else if (startDate) {
                vaccinationQuery += ' WHERE "createdAt" >= :startDate';
                vaccinationReplacements.startDate = startDate;
            }
            else if (endDate) {
                vaccinationQuery += ' WHERE "createdAt" <= :endDate';
                vaccinationReplacements.endDate = endDate;
            }
            const vaccinationRecords = await this.sequelize.query(vaccinationQuery, {
                replacements: vaccinationReplacements,
                type: sequelize_2.QueryTypes.SELECT,
                raw: true,
            });
            this.logInfo('Compliance report generated successfully');
            return {
                hipaaLogs,
                medicationCompliance,
                incidentCompliance,
                vaccinationRecords: vaccinationRecords[0]?.count || 0,
            };
        }
        catch (error) {
            this.logError('Error generating compliance report:', error);
            throw error;
        }
    }
};
exports.ComplianceReportsService = ComplianceReportsService;
exports.ComplianceReportsService = ComplianceReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.AuditLog)),
    __param(1, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [Object, sequelize_typescript_1.Sequelize])
], ComplianceReportsService);
//# sourceMappingURL=compliance-reports.service.js.map