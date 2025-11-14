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
var AnalyticsReportGeneratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsReportGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_manager_1 = require("@nestjs/cache-manager");
const analytics_report_types_1 = require("./types/analytics-report.types");
const base_report_generator_service_1 = require("./services/base-report-generator.service");
const report_data_collector_service_1 = require("./services/report-data-collector.service");
const report_formatter_service_1 = require("./services/report-formatter.service");
const health_insights_service_1 = require("./services/health-insights.service");
let AnalyticsReportGeneratorService = AnalyticsReportGeneratorService_1 = class AnalyticsReportGeneratorService extends base_report_generator_service_1.BaseReportGeneratorService {
    dataCollector;
    formatter;
    healthInsights;
    constructor(eventEmitter, cacheManager, dataCollector, formatter, healthInsights) {
        super(eventEmitter, cacheManager, AnalyticsReportGeneratorService_1.name);
        this.dataCollector = dataCollector;
        this.formatter = formatter;
        this.healthInsights = healthInsights;
    }
    async generateAnalyticsReport(schoolId, reportType, period, options = {}) {
        return this.generateReport(schoolId, reportType, period, options, async () => {
            const reportData = await this.dataCollector.collectReportData(schoolId, reportType, period, options.filters);
            const reportContent = await this.generateReportContent(reportData, reportType, options);
            return { data: reportData, content: reportContent };
        });
    }
    async generateDashboardReport(schoolId, userType, timeRange, dashboardData) {
        return this.generateReport(schoolId, analytics_report_types_1.AnalyticsReportType.DASHBOARD_SUMMARY, analytics_report_types_1.AnalyticsTimePeriod.LAST_30_DAYS, { format: 'JSON' }, async () => {
            const reportContent = {
                title: `Dashboard Summary - ${schoolId}`,
                generatedFor: userType,
                timeRange,
                summary: {
                    totalAlerts: dashboardData.alerts?.length || 0,
                    criticalAlerts: dashboardData.alerts?.filter((a) => a.severity === 'CRITICAL').length || 0,
                    upcomingAppointments: dashboardData.upcomingAppointments || 0,
                    pendingTasks: dashboardData.pendingTasks || 0,
                },
                keyMetrics: dashboardData.keyMetrics || [],
                alerts: dashboardData.alerts || [],
                recommendations: dashboardData.recommendations || [],
                generatedAt: new Date(),
            };
            return { data: dashboardData, content: reportContent };
        });
    }
    async generateStudentHealthReport(studentId, studentMetrics) {
        return this.generateReport('N/A', analytics_report_types_1.AnalyticsReportType.STUDENT_HEALTH_SUMMARY, studentMetrics.period, { format: 'JSON' }, async () => {
            const riskAssessment = this.healthInsights.assessStudentRisk(studentMetrics);
            const reportContent = {
                title: `Student Health Summary - ${studentId}`,
                studentId,
                period: studentMetrics.period,
                overview: {
                    totalHealthRecords: studentMetrics.healthRecords,
                    medicationAdministrations: studentMetrics.medicationAdministrations,
                    appointments: studentMetrics.appointments,
                    incidents: studentMetrics.incidents,
                },
                timeline: {
                    lastHealthRecord: studentMetrics.lastHealthRecord,
                    lastMedication: studentMetrics.lastMedication,
                    upcomingAppointments: studentMetrics.upcomingAppointments,
                },
                riskAssessment,
                recommendations: this.healthInsights.generateStudentRecommendations(studentMetrics),
                generatedAt: new Date(),
            };
            return { data: studentMetrics, content: reportContent };
        });
    }
    async generateComplianceReport(schoolId, period, complianceData) {
        return this.generateReport(schoolId, analytics_report_types_1.AnalyticsReportType.COMPLIANCE_REPORT, period, { format: 'JSON' }, async () => {
            const reportContent = {
                title: `Compliance Report - ${schoolId}`,
                schoolId,
                period,
                complianceScores: {
                    overall: complianceData.overall,
                    medication: complianceData.medicationAdherence,
                    immunization: complianceData.immunizationCompliance,
                    appointments: complianceData.appointmentCompletion,
                    incidents: complianceData.incidentReporting,
                },
                status: complianceData.status,
                areasOfConcern: complianceData.areasOfConcern,
                recommendations: complianceData.recommendations,
                generatedAt: new Date(),
            };
            return { data: complianceData, content: reportContent };
        });
    }
    async generateReportContent(data, reportType, options) {
        const baseContent = {
            title: `${reportType.replace('_', ' ')} Report`,
            type: reportType,
            generatedAt: new Date(),
            data,
        };
        switch (reportType) {
            case analytics_report_types_1.AnalyticsReportType.HEALTH_OVERVIEW:
                return {
                    ...baseContent,
                    summary: {
                        totalStudents: data.totalStudents,
                        healthRecordCoverage: (data.activeHealthRecords / data.totalStudents * 100).toFixed(1) + '%',
                        medicationAdherence: data.medicationAdherence + '%',
                        immunizationCompliance: data.immunizationCompliance + '%',
                    },
                    insights: this.healthInsights.generateHealthInsights(data),
                };
            case analytics_report_types_1.AnalyticsReportType.MEDICATION_SUMMARY:
                return {
                    ...baseContent,
                    summary: {
                        totalMedications: data.medications.reduce((sum, med) => sum + med.count, 0),
                        uniqueMedications: data.medications.length,
                        totalStudents: data.medications.reduce((sum, med) => sum + med.students, 0),
                    },
                    topMedications: data.medications,
                    insights: this.healthInsights.generateMedicationInsights(data),
                };
            default:
                return baseContent;
        }
    }
};
exports.AnalyticsReportGeneratorService = AnalyticsReportGeneratorService;
exports.AnalyticsReportGeneratorService = AnalyticsReportGeneratorService = AnalyticsReportGeneratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2, Object, report_data_collector_service_1.ReportDataCollectorService,
        report_formatter_service_1.ReportFormatterService,
        health_insights_service_1.HealthInsightsService])
], AnalyticsReportGeneratorService);
//# sourceMappingURL=analytics-report-generator.service.js.map