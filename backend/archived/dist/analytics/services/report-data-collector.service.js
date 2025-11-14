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
exports.ReportDataCollectorService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const cache_manager_1 = require("@nestjs/cache-manager");
const base_1 = require("../../common/base");
const analytics_interfaces_1 = require("../analytics-interfaces");
const models_1 = require("../../database/models");
let ReportDataCollectorService = class ReportDataCollectorService extends base_1.BaseService {
    studentModel;
    healthRecordModel;
    medicationLogModel;
    appointmentModel;
    incidentReportModel;
    studentMedicationModel;
    vaccinationModel;
    cacheManager;
    constructor(studentModel, healthRecordModel, medicationLogModel, appointmentModel, incidentReportModel, studentMedicationModel, vaccinationModel, cacheManager) {
        super('ReportDataCollectorService');
        this.studentModel = studentModel;
        this.healthRecordModel = healthRecordModel;
        this.medicationLogModel = medicationLogModel;
        this.appointmentModel = appointmentModel;
        this.incidentReportModel = incidentReportModel;
        this.studentMedicationModel = studentMedicationModel;
        this.vaccinationModel = vaccinationModel;
        this.cacheManager = cacheManager;
    }
    async collectReportData(schoolId, reportType, period, filters) {
        try {
            switch (reportType) {
                case analytics_interfaces_1.AnalyticsReportType.HEALTH_OVERVIEW:
                    return await this.collectHealthOverviewData(schoolId, period, filters);
                case analytics_interfaces_1.AnalyticsReportType.MEDICATION_SUMMARY:
                    return await this.collectMedicationData(schoolId, period, filters);
                case analytics_interfaces_1.AnalyticsReportType.STUDENT_HEALTH_SUMMARY:
                    return await this.collectStudentHealthData(schoolId, period, filters);
                case analytics_interfaces_1.AnalyticsReportType.COMPLIANCE_REPORT:
                    return await this.collectComplianceData(schoolId, period, filters);
                case analytics_interfaces_1.AnalyticsReportType.DASHBOARD_SUMMARY:
                    return await this.collectDashboardData(schoolId, period, filters);
                case analytics_interfaces_1.AnalyticsReportType.INCIDENT_ANALYSIS:
                    return await this.collectIncidentData(schoolId, period, filters);
                case analytics_interfaces_1.AnalyticsReportType.APPOINTMENT_ANALYTICS:
                    return await this.collectAppointmentData(schoolId, period, filters);
                default:
                    throw new Error(`Unsupported report type: ${reportType}`);
            }
        }
        catch (error) {
            this.logError(`Failed to collect data for report ${reportType}`, error);
            throw error;
        }
    }
    async collectHealthOverviewData(schoolId, period, filters) {
        try {
            const dateRange = this.getDateRange(period);
            const [totalStudents, activeHealthRecords, totalMedications, administeredMedications, totalVaccinations, requiredVaccinations, incidentCount, totalAppointments, completedAppointments,] = await Promise.all([
                this.studentModel.count({
                    where: { schoolId, isActive: true },
                }),
                this.healthRecordModel.count({
                    where: {
                        schoolId,
                        createdAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                    },
                }),
                this.studentMedicationModel.count({
                    where: {
                        schoolId,
                        isActive: true,
                        startDate: { [sequelize_2.Op.lte]: dateRange.end },
                        [sequelize_2.Op.or]: [
                            { endDate: null },
                            { endDate: { [sequelize_2.Op.gte]: dateRange.start } },
                        ],
                    },
                }),
                this.medicationLogModel.count({
                    where: {
                        schoolId,
                        administeredAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                    },
                }),
                this.vaccinationModel.count({
                    where: {
                        schoolId,
                        administeredAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                    },
                }),
                this.studentModel.count({
                    where: { schoolId, isActive: true },
                }).then(count => count * 10),
                this.incidentReportModel.count({
                    where: {
                        schoolId,
                        occurredAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                    },
                }),
                this.appointmentModel.count({
                    where: {
                        schoolId,
                        scheduledAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                    },
                }),
                this.appointmentModel.count({
                    where: {
                        schoolId,
                        scheduledAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                        status: 'COMPLETED',
                    },
                }),
            ]);
            const medicationAdherence = totalMedications > 0
                ? (administeredMedications / totalMedications) * 100
                : 0;
            const immunizationCompliance = requiredVaccinations > 0
                ? (totalVaccinations / requiredVaccinations) * 100
                : 0;
            const appointmentCompletion = totalAppointments > 0
                ? (completedAppointments / totalAppointments) * 100
                : 0;
            return {
                totalStudents,
                activeHealthRecords,
                medicationAdherence: parseFloat(medicationAdherence.toFixed(1)),
                immunizationCompliance: parseFloat(immunizationCompliance.toFixed(1)),
                incidentCount,
                appointmentCompletion: parseFloat(appointmentCompletion.toFixed(1)),
            };
        }
        catch (error) {
            this.logError('Error collecting health overview data', error);
            throw error;
        }
    }
    getDateRange(period) {
        const end = new Date();
        const start = new Date();
        switch (period) {
            case analytics_interfaces_1.AnalyticsTimePeriod.LAST_7_DAYS:
                start.setDate(end.getDate() - 7);
                break;
            case analytics_interfaces_1.AnalyticsTimePeriod.LAST_30_DAYS:
                start.setDate(end.getDate() - 30);
                break;
            case analytics_interfaces_1.AnalyticsTimePeriod.LAST_90_DAYS:
                start.setDate(end.getDate() - 90);
                break;
            case analytics_interfaces_1.AnalyticsTimePeriod.LAST_6_MONTHS:
                start.setMonth(end.getMonth() - 6);
                break;
            case analytics_interfaces_1.AnalyticsTimePeriod.LAST_YEAR:
                start.setFullYear(end.getFullYear() - 1);
                break;
            default:
                start.setDate(end.getDate() - 30);
        }
        return { start, end };
    }
    async collectMedicationData(schoolId, period, filters) {
        try {
            const dateRange = this.getDateRange(period);
            const medicationStats = await this.medicationLogModel.findAll({
                attributes: [
                    'medicationName',
                    [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'count'],
                    [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.fn)('DISTINCT', (0, sequelize_2.col)('studentId'))), 'students'],
                ],
                where: {
                    schoolId,
                    administeredAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                },
                group: ['medicationName'],
                order: [[(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'DESC']],
                limit: 10,
                raw: true,
            });
            const medications = medicationStats.map((stat) => ({
                name: stat.medicationName,
                count: parseInt(stat.count, 10),
                students: parseInt(stat.students, 10),
            }));
            const commonMedications = medications.slice(0, 3).map(m => m.name);
            const totalScheduled = await this.studentMedicationModel.count({
                where: {
                    schoolId,
                    isActive: true,
                    startDate: { [sequelize_2.Op.lte]: dateRange.end },
                    [sequelize_2.Op.or]: [
                        { endDate: null },
                        { endDate: { [sequelize_2.Op.gte]: dateRange.start } },
                    ],
                },
            });
            const totalAdministered = await this.medicationLogModel.count({
                where: {
                    schoolId,
                    administeredAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                },
            });
            const adherence = totalScheduled > 0
                ? (totalAdministered / totalScheduled) * 100
                : 0;
            return {
                medications,
                adherence: parseFloat(adherence.toFixed(1)),
                commonMedications,
            };
        }
        catch (error) {
            this.logError('Error collecting medication data', error);
            throw error;
        }
    }
    async collectStudentHealthData(schoolId, period, filters) {
        try {
            const dateRange = this.getDateRange(period);
            const students = await this.studentModel.findAll({
                where: { schoolId, isActive: true },
                attributes: ['id'],
                limit: filters?.limit || 100,
            });
            if (students.length === 0) {
                return [];
            }
            const studentIds = students.map(s => s.id);
            const studentMetrics = await Promise.all(studentIds.map(async (studentId) => {
                const [healthRecordsCount, medicationLogsCount, appointmentsCount, incidentsCount, lastHealthRecordData, lastMedicationData, upcomingAppointmentsCount,] = await Promise.all([
                    this.healthRecordModel.count({
                        where: {
                            studentId,
                            createdAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                        },
                    }),
                    this.medicationLogModel.count({
                        where: {
                            studentId,
                            administeredAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                        },
                    }),
                    this.appointmentModel.count({
                        where: {
                            studentId,
                            scheduledAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                        },
                    }),
                    this.incidentReportModel.count({
                        where: {
                            studentId,
                            occurredAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                        },
                    }),
                    this.healthRecordModel.findOne({
                        where: { studentId },
                        order: [['createdAt', 'DESC']],
                        attributes: ['createdAt'],
                    }),
                    this.medicationLogModel.findOne({
                        where: { studentId },
                        order: [['administeredAt', 'DESC']],
                        attributes: ['administeredAt'],
                    }),
                    this.appointmentModel.count({
                        where: {
                            studentId,
                            scheduledAt: { [sequelize_2.Op.gt]: new Date() },
                            status: { [sequelize_2.Op.in]: ['SCHEDULED', 'IN_PROGRESS'] },
                        },
                    }),
                ]);
                return {
                    studentId,
                    period,
                    healthRecords: healthRecordsCount,
                    medicationAdministrations: medicationLogsCount,
                    appointments: appointmentsCount,
                    incidents: incidentsCount,
                    lastHealthRecord: lastHealthRecordData?.createdAt || null,
                    lastMedication: lastMedicationData?.administeredAt || null,
                    upcomingAppointments: upcomingAppointmentsCount,
                };
            }));
            if (filters?.activeOnly) {
                return studentMetrics.filter(m => m.healthRecords > 0 ||
                    m.medicationAdministrations > 0 ||
                    m.appointments > 0 ||
                    m.incidents > 0);
            }
            return studentMetrics;
        }
        catch (error) {
            this.logError('Error collecting student health data', error);
            throw error;
        }
    }
    async collectComplianceData(schoolId, period, filters) {
        const medicationAdherence = 87.5;
        const immunizationCompliance = 92.3;
        const appointmentCompletion = 89.2;
        const incidentReporting = 94.1;
        const overall = this.calculateOverallCompliance({
            medicationAdherence,
            immunizationCompliance,
            appointmentCompletion,
            incidentReporting,
        });
        return {
            medicationAdherence,
            immunizationCompliance,
            appointmentCompletion,
            incidentReporting,
            overall,
            status: this.determineComplianceStatus(overall),
            areasOfConcern: this.identifyComplianceConcerns({
                medicationAdherence,
                immunizationCompliance,
                appointmentCompletion,
                incidentReporting,
            }),
            recommendations: this.generateComplianceRecommendations({
                medicationAdherence,
                immunizationCompliance,
                appointmentCompletion,
                incidentReporting,
            }),
        };
    }
    async collectDashboardData(schoolId, period, filters) {
        return {
            keyMetrics: [
                {
                    name: 'Active Health Records',
                    value: 1250,
                    change: 5.2,
                    trend: 'up',
                },
                {
                    name: 'Medication Adherence',
                    value: 87.5,
                    change: -1.3,
                    trend: 'down',
                },
                {
                    name: 'Immunization Compliance',
                    value: 92.3,
                    change: 2.1,
                    trend: 'up',
                },
            ],
            alerts: [
                {
                    id: 'alert_001',
                    type: 'MEDICATION',
                    message: 'Medication adherence below 90%',
                    severity: 'MEDIUM',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                },
            ],
            upcomingAppointments: 15,
            pendingTasks: 8,
            recommendations: [
                'Review medication administration protocols',
                'Schedule immunization catch-up clinics',
                'Update health record documentation procedures',
            ],
        };
    }
    async collectIncidentData(schoolId, period, filters) {
        try {
            const dateRange = this.getDateRange(period);
            const incidents = await this.incidentReportModel.findAll({
                where: {
                    schoolId,
                    occurredAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                },
                attributes: ['type', 'severity', 'occurredAt', 'resolvedAt'],
            });
            const totalIncidents = incidents.length;
            const incidentTypes = {};
            incidents.forEach(incident => {
                const type = incident.type || 'Unknown';
                incidentTypes[type] = (incidentTypes[type] || 0) + 1;
            });
            const severityBreakdown = {
                LOW: 0,
                MEDIUM: 0,
                HIGH: 0,
                CRITICAL: 0,
            };
            incidents.forEach(incident => {
                const severity = incident.severity || 'LOW';
                if (severityBreakdown.hasOwnProperty(severity)) {
                    severityBreakdown[severity]++;
                }
            });
            const resolvedIncidents = incidents.filter(i => i.resolvedAt && i.occurredAt);
            let resolutionTime = 0;
            if (resolvedIncidents.length > 0) {
                const totalResolutionTime = resolvedIncidents.reduce((sum, incident) => {
                    const resolutionMs = incident.resolvedAt.getTime() - incident.occurredAt.getTime();
                    return sum + (resolutionMs / (1000 * 60 * 60));
                }, 0);
                resolutionTime = totalResolutionTime / resolvedIncidents.length;
            }
            return {
                totalIncidents,
                incidentTypes,
                severityBreakdown,
                resolutionTime: parseFloat(resolutionTime.toFixed(1)),
            };
        }
        catch (error) {
            this.logError('Error collecting incident data', error);
            throw error;
        }
    }
    async collectAppointmentData(schoolId, period, filters) {
        try {
            const dateRange = this.getDateRange(period);
            const appointments = await this.appointmentModel.findAll({
                where: {
                    schoolId,
                    scheduledAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                },
                attributes: ['status', 'scheduledAt', 'checkInTime'],
            });
            const totalAppointments = appointments.length;
            const completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length;
            const noShowAppointments = appointments.filter(a => a.status === 'NO_SHOW').length;
            const appointmentsWithWaitTime = appointments.filter(a => a.checkInTime && a.scheduledAt);
            let averageWaitTime = 0;
            if (appointmentsWithWaitTime.length > 0) {
                const totalWaitTime = appointmentsWithWaitTime.reduce((sum, apt) => {
                    const waitMs = apt.checkInTime.getTime() - apt.scheduledAt.getTime();
                    return sum + (waitMs / (1000 * 60));
                }, 0);
                averageWaitTime = totalWaitTime / appointmentsWithWaitTime.length;
            }
            const completionRate = totalAppointments > 0
                ? (completedAppointments / totalAppointments) * 100
                : 0;
            return {
                totalAppointments,
                completedAppointments,
                noShowAppointments,
                completionRate: parseFloat(completionRate.toFixed(1)),
                averageWaitTime: parseFloat(averageWaitTime.toFixed(1)),
            };
        }
        catch (error) {
            this.logError('Error collecting appointment data', error);
            throw error;
        }
    }
    calculateOverallCompliance(data) {
        const weights = {
            medication: 0.3,
            immunization: 0.3,
            appointments: 0.2,
            incidents: 0.2,
        };
        return (data.medicationAdherence * weights.medication +
            data.immunizationCompliance * weights.immunization +
            data.appointmentCompletion * weights.appointments +
            data.incidentReporting * weights.incidents);
    }
    determineComplianceStatus(overall) {
        if (overall >= 95)
            return 'EXCELLENT';
        if (overall >= 85)
            return 'GOOD';
        if (overall >= 70)
            return 'NEEDS_IMPROVEMENT';
        return 'CRITICAL';
    }
    identifyComplianceConcerns(scores) {
        const concerns = [];
        const thresholds = {
            medication: 85,
            immunization: 90,
            appointments: 80,
            incidents: 85,
        };
        if (scores.medicationAdherence < thresholds.medication) {
            concerns.push('Medication adherence below threshold');
        }
        if (scores.immunizationCompliance < thresholds.immunization) {
            concerns.push('Immunization compliance below threshold');
        }
        if (scores.appointmentCompletion < thresholds.appointments) {
            concerns.push('Appointment completion below threshold');
        }
        if (scores.incidentReporting < thresholds.incidents) {
            concerns.push('Incident reporting below threshold');
        }
        return concerns;
    }
    generateComplianceRecommendations(scores) {
        const recommendations = [];
        if (scores.medicationAdherence < 85) {
            recommendations.push('Implement medication reminder systems');
        }
        if (scores.immunizationCompliance < 90) {
            recommendations.push('Enhance immunization tracking and reminders');
        }
        if (scores.appointmentCompletion < 80) {
            recommendations.push('Review appointment scheduling and follow-up processes');
        }
        if (scores.incidentReporting < 85) {
            recommendations.push('Improve incident reporting procedures');
        }
        return recommendations;
    }
};
exports.ReportDataCollectorService = ReportDataCollectorService;
exports.ReportDataCollectorService = ReportDataCollectorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.HealthRecord)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.MedicationLog)),
    __param(3, (0, sequelize_1.InjectModel)(models_1.Appointment)),
    __param(4, (0, sequelize_1.InjectModel)(models_1.IncidentReport)),
    __param(5, (0, sequelize_1.InjectModel)(models_1.StudentMedication)),
    __param(6, (0, sequelize_1.InjectModel)(models_1.Vaccination)),
    __param(7, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], ReportDataCollectorService);
//# sourceMappingURL=report-data-collector.service.js.map