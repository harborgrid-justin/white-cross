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
exports.IncidentStatisticsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../database");
const incident_severity_enum_1 = require("../enums/incident-severity.enum");
const incident_type_enum_1 = require("../enums/incident-type.enum");
const base_1 = require("../../common/base");
let IncidentStatisticsService = class IncidentStatisticsService extends base_1.BaseService {
    incidentReportModel;
    constructor(incidentReportModel) {
        super('IncidentStatisticsService');
        this.incidentReportModel = incidentReportModel;
    }
    async getIncidentStatistics(dateFrom, dateTo, studentId) {
        try {
            const where = {};
            if (studentId) {
                where.studentId = studentId;
            }
            if (dateFrom && dateTo) {
                where.occurredAt = {
                    [sequelize_2.Op.between]: [dateFrom, dateTo],
                };
            }
            else if (dateFrom) {
                where.occurredAt = {
                    [sequelize_2.Op.gte]: dateFrom,
                };
            }
            else if (dateTo) {
                where.occurredAt = {
                    [sequelize_2.Op.lte]: dateTo,
                };
            }
            const reports = await this.incidentReportModel.findAll({
                where,
                attributes: [
                    'id',
                    'type',
                    'severity',
                    'location',
                    'parentNotified',
                    'followUpRequired',
                    'occurredAt',
                    'createdAt',
                ],
            });
            const total = reports.length;
            const byType = {};
            Object.values(incident_type_enum_1.IncidentType).forEach((type) => {
                byType[type] = 0;
            });
            reports.forEach((report) => {
                byType[report.type] = (byType[report.type] || 0) + 1;
            });
            const bySeverity = {};
            Object.values(incident_severity_enum_1.IncidentSeverity).forEach((severity) => {
                bySeverity[severity] = 0;
            });
            reports.forEach((report) => {
                bySeverity[report.severity] = (bySeverity[report.severity] || 0) + 1;
            });
            const byLocation = {};
            reports.forEach((report) => {
                byLocation[report.location] = (byLocation[report.location] || 0) + 1;
            });
            const parentNotifiedCount = reports.filter((r) => r.parentNotified).length;
            const parentNotificationRate = total > 0 ? (parentNotifiedCount / total) * 100 : 0;
            const followUpCount = reports.filter((r) => r.followUpRequired).length;
            const followUpRate = total > 0 ? (followUpCount / total) * 100 : 0;
            let totalResponseTime = 0;
            reports.forEach((report) => {
                const responseTime = new Date(report.createdAt).getTime() -
                    new Date(report.occurredAt).getTime();
                totalResponseTime += responseTime;
            });
            const averageResponseTime = total > 0 ? totalResponseTime / total / (1000 * 60) : 0;
            return {
                total,
                byType,
                bySeverity,
                byLocation,
                parentNotificationRate,
                followUpRate,
                averageResponseTime: Math.round(averageResponseTime),
            };
        }
        catch (error) {
            this.logError('Error fetching incident statistics:', error);
            throw error;
        }
    }
    async getIncidentsByType(dateFrom, dateTo) {
        try {
            const where = {};
            if (dateFrom && dateTo) {
                where.occurredAt = {
                    [sequelize_2.Op.between]: [dateFrom, dateTo],
                };
            }
            else if (dateFrom) {
                where.occurredAt = {
                    [sequelize_2.Op.gte]: dateFrom,
                };
            }
            else if (dateTo) {
                where.occurredAt = {
                    [sequelize_2.Op.lte]: dateTo,
                };
            }
            const reports = await this.incidentReportModel.findAll({
                where,
                attributes: ['id', 'type'],
            });
            const byType = {};
            Object.values(incident_type_enum_1.IncidentType).forEach((type) => {
                byType[type] = 0;
            });
            reports.forEach((report) => {
                byType[report.type] = (byType[report.type] || 0) + 1;
            });
            return byType;
        }
        catch (error) {
            this.logError('Error fetching incidents by type:', error);
            throw error;
        }
    }
    async getIncidentsBySeverity(dateFrom, dateTo) {
        try {
            const where = {};
            if (dateFrom && dateTo) {
                where.occurredAt = {
                    [sequelize_2.Op.between]: [dateFrom, dateTo],
                };
            }
            else if (dateFrom) {
                where.occurredAt = {
                    [sequelize_2.Op.gte]: dateFrom,
                };
            }
            else if (dateTo) {
                where.occurredAt = {
                    [sequelize_2.Op.lte]: dateTo,
                };
            }
            const reports = await this.incidentReportModel.findAll({
                where,
                attributes: ['id', 'severity'],
            });
            const bySeverity = {};
            Object.values(incident_severity_enum_1.IncidentSeverity).forEach((severity) => {
                bySeverity[severity] = 0;
            });
            reports.forEach((report) => {
                bySeverity[report.severity] = (bySeverity[report.severity] || 0) + 1;
            });
            return bySeverity;
        }
        catch (error) {
            this.logError('Error fetching incidents by severity:', error);
            throw error;
        }
    }
    async getSeverityTrends(dateFrom, dateTo) {
        try {
            const reports = await this.incidentReportModel.findAll({
                where: {
                    occurredAt: {
                        [sequelize_2.Op.between]: [dateFrom, dateTo],
                    },
                },
                attributes: ['id', 'severity', 'occurredAt'],
                order: [['occurredAt', 'ASC']],
            });
            const trendsByMonth = {};
            reports.forEach((report) => {
                const month = new Date(report.occurredAt).toISOString().substring(0, 7);
                if (!trendsByMonth[month]) {
                    trendsByMonth[month] = {};
                    Object.values(incident_severity_enum_1.IncidentSeverity).forEach((severity) => {
                        trendsByMonth[month][severity] = 0;
                    });
                }
                trendsByMonth[month][report.severity] += 1;
            });
            return trendsByMonth;
        }
        catch (error) {
            this.logError('Error fetching severity trends:', error);
            throw error;
        }
    }
};
exports.IncidentStatisticsService = IncidentStatisticsService;
exports.IncidentStatisticsService = IncidentStatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.IncidentReport)),
    __metadata("design:paramtypes", [Object])
], IncidentStatisticsService);
//# sourceMappingURL=incident-statistics.service.js.map