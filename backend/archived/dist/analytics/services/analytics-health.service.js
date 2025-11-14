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
exports.AnalyticsHealthService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../database");
const health_trend_analytics_service_1 = require("./health-trend-analytics.service");
const time_period_enum_1 = require("../enums/time-period.enum");
const base_1 = require("../../common/base");
let AnalyticsHealthService = class AnalyticsHealthService extends base_1.BaseService {
    healthTrendService;
    healthRecordModel;
    appointmentModel;
    medicationLogModel;
    constructor(healthTrendService, healthRecordModel, appointmentModel, medicationLogModel) {
        super("AnalyticsHealthService");
        this.healthTrendService = healthTrendService;
        this.healthRecordModel = healthRecordModel;
        this.appointmentModel = appointmentModel;
        this.medicationLogModel = medicationLogModel;
    }
    async getHealthMetrics(query) {
        try {
            const start = query.startDate;
            const end = query.endDate;
            const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            let period = time_period_enum_1.TimePeriod.LAST_30_DAYS;
            if (daysDiff <= 7)
                period = time_period_enum_1.TimePeriod.LAST_7_DAYS;
            else if (daysDiff <= 30)
                period = time_period_enum_1.TimePeriod.LAST_30_DAYS;
            else if (daysDiff <= 90)
                period = time_period_enum_1.TimePeriod.LAST_90_DAYS;
            else if (daysDiff <= 180)
                period = time_period_enum_1.TimePeriod.LAST_6_MONTHS;
            else
                period = time_period_enum_1.TimePeriod.LAST_YEAR;
            const schoolId = query.schoolId || query.districtId || 'default-school';
            const metrics = await this.healthTrendService.getHealthMetrics(schoolId, period);
            let comparisonData = null;
            if (query.compareWithPrevious) {
                const previousStart = new Date(start);
                previousStart.setDate(previousStart.getDate() - daysDiff);
                const previousEnd = new Date(end);
                previousEnd.setDate(previousEnd.getDate() - daysDiff);
                comparisonData = {
                    periodLabel: 'Previous Period',
                    startDate: previousStart,
                    endDate: previousEnd,
                };
            }
            return {
                metrics,
                period: { startDate: start, endDate: end },
                aggregationLevel: query.aggregationLevel || 'SCHOOL',
                comparisonData,
            };
        }
        catch (error) {
            this.logError('Error getting health metrics', error);
            throw error;
        }
    }
    async getHealthTrends(query) {
        try {
            const start = query.startDate;
            const end = query.endDate;
            let period = time_period_enum_1.TimePeriod.LAST_90_DAYS;
            switch (query.timePeriod) {
                case 'DAILY':
                    period = time_period_enum_1.TimePeriod.LAST_7_DAYS;
                    break;
                case 'WEEKLY':
                    period = time_period_enum_1.TimePeriod.LAST_30_DAYS;
                    break;
                case 'MONTHLY':
                    period = time_period_enum_1.TimePeriod.LAST_90_DAYS;
                    break;
                case 'QUARTERLY':
                    period = time_period_enum_1.TimePeriod.LAST_6_MONTHS;
                    break;
                case 'YEARLY':
                    period = time_period_enum_1.TimePeriod.LAST_YEAR;
                    break;
            }
            const schoolId = query.schoolId || query.districtId || 'default-school';
            const conditionTrends = await this.healthTrendService.getConditionTrends(schoolId, query.metrics, period);
            const medicationTrends = await this.healthTrendService.getMedicationTrends(schoolId, period);
            return {
                healthConditionTrends: conditionTrends,
                medicationTrends,
                period: { startDate: start, endDate: end },
                timePeriod: query.timePeriod || 'MONTHLY',
                forecastingEnabled: query.includeForecasting || false,
            };
        }
        catch (error) {
            this.logError('Error getting health trends', error);
            throw error;
        }
    }
    async getStudentHealthMetrics(studentId, query) {
        try {
            const startDate = query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const endDate = query.endDate || new Date();
            const healthRecords = await this.healthRecordModel.findAll({
                where: {
                    studentId,
                    recordDate: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                order: [['recordDate', 'DESC']],
                limit: 100,
            });
            const medicationLogs = await this.medicationLogModel.findAll({
                where: {
                    studentId,
                    administeredAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                order: [['administeredAt', 'DESC']],
                limit: 100,
            });
            const appointments = await this.appointmentModel.findAll({
                where: {
                    studentId,
                    scheduledAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                order: [['scheduledAt', 'DESC']],
                limit: 50,
            });
            const scheduledMedications = medicationLogs.length;
            const medLogs = medicationLogs;
            const administeredMedications = medLogs.filter((log) => log.status === 'ADMINISTERED').length;
            const adherenceRate = scheduledMedications > 0
                ? Math.round((administeredMedications / scheduledMedications) * 100) : 100;
            const vitalSignsRecords = healthRecords
                .filter((record) => record.recordType === 'VITAL_SIGNS_CHECK' &&
                record.metadata?.vitalSigns)
                .map((record) => ({
                date: record.recordDate,
                ...(record.metadata?.vitalSigns || {}),
            }));
            const healthVisitsByType = healthRecords.reduce((acc, record) => {
                acc[record.recordType] = (acc[record.recordType] || 0) + 1;
                return acc;
            }, {});
            const apts = appointments;
            const trends = {
                vitalSigns: vitalSignsRecords,
                healthVisits: healthRecords.map((record) => ({
                    id: record.id, type: record.recordType, title: record.title,
                    date: record.recordDate, provider: record.provider,
                })),
                healthVisitsByType,
                medicationAdherence: {
                    rate: adherenceRate, scheduled: scheduledMedications,
                    administered: administeredMedications, missedDoses: scheduledMedications - administeredMedications,
                },
                appointments: {
                    total: appointments.length,
                    completed: apts.filter((apt) => apt.status === 'COMPLETED').length,
                    upcoming: apts.filter((apt) => apt.status === 'SCHEDULED').length,
                    cancelled: apts.filter((apt) => apt.status === 'CANCELLED').length,
                },
            };
            this.logInfo(`Student health metrics retrieved: ${studentId} (${healthRecords.length} health records, ${medicationLogs.length} medication logs, ${appointments.length} appointments)`);
            return {
                studentId,
                trends,
                period: { startDate, endDate },
                includesHistoricalData: query.includeHistory !== false,
            };
        }
        catch (error) {
            this.logError('Error getting student health metrics', error);
            throw error;
        }
    }
    async getSchoolMetrics(schoolId, query) {
        try {
            const start = query.startDate;
            const end = query.endDate;
            const summary = await this.healthTrendService.getPopulationSummary(schoolId, time_period_enum_1.TimePeriod.CUSTOM, {
                start,
                end,
            });
            const immunizationData = await this.healthTrendService.getImmunizationDashboard(schoolId);
            const incidentAnalytics = await this.healthTrendService.getIncidentAnalytics(schoolId, time_period_enum_1.TimePeriod.LAST_90_DAYS);
            return {
                schoolId,
                summary,
                immunization: immunizationData,
                incidents: incidentAnalytics,
                period: { startDate: start, endDate: end },
                gradeLevel: query.gradeLevel,
                includesComparisons: query.includeComparisons !== false,
            };
        }
        catch (error) {
            this.logError('Error getting school metrics', error);
            throw error;
        }
    }
};
exports.AnalyticsHealthService = AnalyticsHealthService;
exports.AnalyticsHealthService = AnalyticsHealthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(database_1.HealthRecord)),
    __param(2, (0, sequelize_1.InjectModel)(database_1.Appointment)),
    __param(3, (0, sequelize_1.InjectModel)(database_1.MedicationLog)),
    __metadata("design:paramtypes", [health_trend_analytics_service_1.HealthTrendAnalyticsService, Object, Object, Object])
], AnalyticsHealthService);
//# sourceMappingURL=analytics-health.service.js.map