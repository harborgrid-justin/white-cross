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
var AnalyticsDashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsDashboardService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../database");
const health_trend_analytics_service_1 = require("./health-trend-analytics.service");
const time_period_enum_1 = require("../enums/time-period.enum");
let AnalyticsDashboardService = AnalyticsDashboardService_1 = class AnalyticsDashboardService extends base_1.BaseService {
    healthTrendService;
    healthRecordModel;
    appointmentModel;
    medicationLogModel;
    incidentReportModel;
    constructor(healthTrendService, healthRecordModel, appointmentModel, medicationLogModel, incidentReportModel) {
        super(AnalyticsDashboardService_1.name);
        this.healthTrendService = healthTrendService;
        this.healthRecordModel = healthRecordModel;
        this.appointmentModel = appointmentModel;
        this.medicationLogModel = medicationLogModel;
        this.incidentReportModel = incidentReportModel;
    }
    async getNurseDashboard(query) {
        try {
            const schoolId = query.schoolId || 'default-school';
            const timeRange = query.timeRange || 'TODAY';
            let startDate;
            const endDate = new Date();
            switch (timeRange) {
                case 'TODAY':
                    startDate = new Date();
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'WEEK':
                    startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'MONTH':
                    startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = new Date();
                    startDate.setHours(0, 0, 0, 0);
            }
            const todayHealthRecords = await this.healthRecordModel.count({
                where: {
                    recordDate: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
            });
            const todayAppointments = await this.appointmentModel.findAll({
                where: {
                    scheduledAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                    status: {
                        [sequelize_2.Op.in]: ['SCHEDULED', 'IN_PROGRESS'],
                    },
                },
            });
            const criticalIncidents = await this.incidentReportModel.findAll({
                where: {
                    occurredAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                    severity: {
                        [sequelize_2.Op.in]: ['CRITICAL', 'HIGH'],
                    },
                },
                limit: 10,
                order: [['occurredAt', 'DESC']],
            });
            const upcomingMedications = await this.medicationLogModel.findAll({
                where: {
                    scheduledAt: {
                        [sequelize_2.Op.between]: [
                            new Date(),
                            new Date(Date.now() + 4 * 60 * 60 * 1000),
                        ],
                    },
                    status: 'PENDING',
                },
                order: [['scheduledAt', 'ASC']],
                limit: 20,
            });
            const metricsOverview = {
                totalPatients: todayHealthRecords,
                activeAppointments: todayAppointments.length,
                criticalAlerts: criticalIncidents.length,
                pendingMedications: upcomingMedications.length,
                status: criticalIncidents.length > 5 ? 'ATTENTION_REQUIRED' : 'OPERATIONAL',
            };
            const alerts = query.includeAlerts
                ? criticalIncidents.map((incident) => ({
                    id: incident.id,
                    type: incident.type,
                    severity: incident.severity,
                    studentId: incident.studentId,
                    description: incident.description,
                    time: incident.occurredAt,
                }))
                : [];
            const upcomingTasks = query.includeUpcoming
                ? [
                    ...upcomingMedications.map((med) => ({
                        type: 'Medication Administration',
                        studentId: med.studentId,
                        medicationId: med.medicationId,
                        time: med.scheduledAt,
                        priority: 'HIGH',
                    })),
                    ...todayAppointments
                        .slice(0, 10)
                        .map((apt) => ({
                        type: 'Appointment',
                        studentId: apt.studentId,
                        appointmentType: apt.type,
                        time: apt.scheduledAt,
                        priority: 'MEDIUM',
                    })),
                ]
                : [];
            this.logger.log(`Nurse dashboard loaded: ${metricsOverview.totalPatients} patients, ${metricsOverview.activeAppointments} appointments, ${metricsOverview.criticalAlerts} critical alerts, ${metricsOverview.pendingMedications} pending medications`);
            return {
                overview: metricsOverview,
                alerts,
                upcomingTasks,
                timeRange,
                lastUpdated: new Date(),
            };
        }
        catch (error) {
            this.logger.error('Error getting nurse dashboard', error);
            throw error;
        }
    }
    async getAdminDashboard(query) {
        try {
            const schoolId = query.schoolId || 'default-school';
            let period = time_period_enum_1.TimePeriod.LAST_30_DAYS;
            switch (query.timeRange) {
                case 'TODAY':
                case 'WEEK':
                    period = time_period_enum_1.TimePeriod.LAST_7_DAYS;
                    break;
                case 'MONTH':
                    period = time_period_enum_1.TimePeriod.LAST_30_DAYS;
                    break;
                case 'QUARTER':
                    period = time_period_enum_1.TimePeriod.LAST_90_DAYS;
                    break;
                case 'YEAR':
                    period = time_period_enum_1.TimePeriod.LAST_YEAR;
                    break;
            }
            const summary = await this.healthTrendService.getPopulationSummary(schoolId, period);
            const complianceMetrics = query.includeComplianceMetrics
                ? {
                    immunizationCompliance: summary.immunizationComplianceRate,
                    documentationCompliance: 98.5,
                    staffTrainingCompliance: 92.3,
                    auditReadiness: 94.7,
                }
                : null;
            const insights = await this.healthTrendService.getPredictiveInsights(schoolId);
            return {
                summary,
                complianceMetrics,
                insights,
                timeRange: query.timeRange || 'MONTH',
                includesFinancialData: query.includeFinancialData || false,
                lastUpdated: new Date(),
            };
        }
        catch (error) {
            this.logger.error('Error getting admin dashboard', error);
            throw error;
        }
    }
    async getPlatformSummary(query) {
        try {
            const targetSchoolId = (query.schoolIds && query.schoolIds.length > 0 && query.schoolIds[0]) ||
                'default-school';
            const summary = await this.healthTrendService.getPopulationSummary(targetSchoolId, time_period_enum_1.TimePeriod.LAST_30_DAYS);
            const platformSummary = {
                totalStudents: summary.totalStudents,
                totalSchools: query.schoolIds ? query.schoolIds.length : 1,
                totalDistricts: query.districtId ? 1 : 0,
                healthMetrics: {
                    totalHealthVisits: summary.totalHealthVisits,
                    totalMedicationAdministrations: summary.totalMedicationAdministrations,
                    totalIncidents: summary.totalIncidents,
                    immunizationCompliance: summary.immunizationComplianceRate,
                },
                alerts: summary.alerts,
                systemStatus: 'OPERATIONAL',
                lastUpdated: new Date(),
            };
            return {
                summary: platformSummary,
                details: query.includeDetails ? summary : null,
                period: {
                    startDate: query.startDate || null,
                    endDate: query.endDate || null,
                },
            };
        }
        catch (error) {
            this.logger.error('Error getting platform summary', error);
            throw error;
        }
    }
};
exports.AnalyticsDashboardService = AnalyticsDashboardService;
exports.AnalyticsDashboardService = AnalyticsDashboardService = AnalyticsDashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(database_1.HealthRecord)),
    __param(2, (0, sequelize_1.InjectModel)(database_1.Appointment)),
    __param(3, (0, sequelize_1.InjectModel)(database_1.MedicationLog)),
    __param(4, (0, sequelize_1.InjectModel)(database_1.IncidentReport)),
    __metadata("design:paramtypes", [health_trend_analytics_service_1.HealthTrendAnalyticsService, Object, Object, Object, Object])
], AnalyticsDashboardService);
//# sourceMappingURL=analytics-dashboard.service.js.map