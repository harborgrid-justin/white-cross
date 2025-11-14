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
exports.IncidentReportsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let IncidentReportsService = class IncidentReportsService extends base_1.BaseService {
    incidentReportModel;
    sequelize;
    constructor(incidentReportModel, sequelize) {
        super("IncidentReportsService");
        this.incidentReportModel = incidentReportModel;
        this.sequelize = sequelize;
    }
    async getIncidentStatistics(dto) {
        try {
            const { startDate, endDate, incidentType, severity } = dto;
            const whereClause = {};
            if (startDate || endDate) {
                whereClause.occurredAt = {};
                if (startDate && endDate) {
                    whereClause.occurredAt = { [sequelize_2.Op.between]: [startDate, endDate] };
                }
                else if (startDate) {
                    whereClause.occurredAt = { [sequelize_2.Op.gte]: startDate };
                }
                else if (endDate) {
                    whereClause.occurredAt = { [sequelize_2.Op.lte]: endDate };
                }
            }
            if (incidentType) {
                whereClause.type = incidentType;
            }
            if (severity) {
                whereClause.severity = severity;
            }
            const incidents = await this.incidentReportModel.findAll({
                where: whereClause,
                include: ['student', 'reportedBy'],
                order: [['occurredAt', 'DESC']],
            });
            const incidentsByTypeRaw = await this.incidentReportModel.findAll({
                where: whereClause,
                attributes: ['type', [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'count']],
                group: ['type'],
                raw: true,
            });
            const incidentsByType = incidentsByTypeRaw.map((record) => ({
                type: record.type,
                count: parseInt(record.count, 10),
            }));
            const incidentsBySeverityRaw = await this.incidentReportModel.findAll({
                where: whereClause,
                attributes: ['severity', [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'count']],
                group: ['severity'],
                raw: true,
            });
            const incidentsBySeverity = incidentsBySeverityRaw.map((record) => ({
                severity: record.severity,
                count: parseInt(record.count, 10),
            }));
            const defaultStartDate = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
            const defaultEndDate = endDate || new Date();
            const incidentsByMonthRaw = await this.sequelize.query(`SELECT
          DATE_TRUNC('month', "occurredAt") as month,
          type,
          COUNT(*)::integer as count
        FROM incident_reports
        WHERE "occurredAt" >= $1
          AND "occurredAt" <= $2
        GROUP BY month, type
        ORDER BY month DESC`, {
                bind: [defaultStartDate, defaultEndDate],
                type: sequelize_2.QueryTypes.SELECT,
            });
            const incidentsByMonth = incidentsByMonthRaw.map((record) => ({
                month: new Date(record.month),
                type: record.type,
                count: parseInt(String(record.count), 10),
            }));
            const injuryStatsRaw = await this.incidentReportModel.findAll({
                where: whereClause,
                attributes: ['type', 'severity', [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'count']],
                group: ['type', 'severity'],
                raw: true,
            });
            const injuryStats = injuryStatsRaw.map((record) => ({
                type: record.type,
                severity: record.severity,
                count: parseInt(record.count, 10),
            }));
            const notificationStatsRaw = await this.incidentReportModel.findAll({
                where: whereClause,
                attributes: ['parentNotified', [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'count']],
                group: ['parentNotified'],
                raw: true,
            });
            const notificationStats = notificationStatsRaw.map((record) => ({
                parentNotified: record.parentNotified,
                count: parseInt(record.count, 10),
            }));
            const complianceStatsRaw = await this.incidentReportModel.findAll({
                where: whereClause,
                attributes: [
                    'legalComplianceStatus',
                    [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'count'],
                ],
                group: ['legalComplianceStatus'],
                raw: true,
            });
            const complianceStats = complianceStatsRaw.map((record) => ({
                legalComplianceStatus: record.legalComplianceStatus,
                count: parseInt(record.count, 10),
            }));
            this.logInfo(`Incident statistics report generated: ${incidents.length} total incidents, ${incidentsByType.length} types, ${incidentsBySeverity.length} severity levels`);
            return {
                incidents,
                incidentsByType,
                incidentsBySeverity,
                incidentsByMonth,
                injuryStats,
                notificationStats,
                complianceStats,
                totalIncidents: incidents.length,
            };
        }
        catch (error) {
            this.logError('Error getting incident statistics:', error);
            throw error;
        }
    }
};
exports.IncidentReportsService = IncidentReportsService;
exports.IncidentReportsService = IncidentReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.IncidentReport)),
    __param(1, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [Object, sequelize_typescript_1.Sequelize])
], IncidentReportsService);
//# sourceMappingURL=incident-reports.service.js.map