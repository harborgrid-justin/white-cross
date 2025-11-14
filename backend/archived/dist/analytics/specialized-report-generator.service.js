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
var SpecializedReportGeneratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecializedReportGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_manager_1 = require("@nestjs/cache-manager");
const analytics_report_types_1 = require("./types/analytics-report.types");
const analytics_constants_1 = require("./analytics-constants");
const base_report_generator_service_1 = require("./services/base-report-generator.service");
let SpecializedReportGeneratorService = SpecializedReportGeneratorService_1 = class SpecializedReportGeneratorService extends base_report_generator_service_1.BaseReportGeneratorService {
    constructor(eventEmitter, cacheManager) {
        super(eventEmitter, cacheManager, SpecializedReportGeneratorService_1.name);
    }
    async generateStudentHealthReport(studentId, studentMetrics) {
        return this.generateReport('N/A', analytics_report_types_1.AnalyticsReportType.STUDENT_HEALTH_SUMMARY, studentMetrics.period, { format: 'JSON' }, async () => {
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
                riskAssessment: this.assessStudentRisk(studentMetrics),
                recommendations: this.generateStudentRecommendations(studentMetrics),
                generatedAt: new Date(),
            };
            return { data: studentMetrics, content: reportContent };
        });
    }
    async generateComplianceReport(schoolId, period, complianceData) {
        return this.generateReport(schoolId, analytics_report_types_1.AnalyticsReportType.COMPLIANCE_REPORT, period, { format: 'JSON' }, async () => {
            const complianceScores = {
                overall: this.calculateOverallCompliance(complianceData),
                medication: complianceData.medicationAdherence,
                immunization: complianceData.immunizationCompliance,
                appointments: complianceData.appointmentCompletion,
                incidents: complianceData.incidentReporting,
            };
            const reportContent = {
                title: `Compliance Report - ${schoolId}`,
                schoolId,
                period,
                complianceScores,
                status: this.determineComplianceStatus(complianceScores),
                areasOfConcern: this.identifyComplianceConcerns(complianceScores),
                recommendations: this.generateComplianceRecommendations(complianceScores),
                generatedAt: new Date(),
            };
            return { data: complianceData, content: reportContent };
        });
    }
    async generateDashboardSummaryReport(schoolId, userType, timeRange, dashboardData) {
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
    assessStudentRisk(metrics) {
        const factors = [];
        let riskScore = 0;
        if (metrics.incidents > 5) {
            factors.push('High incident count');
            riskScore += 3;
        }
        else if (metrics.incidents > 2) {
            factors.push('Moderate incident count');
            riskScore += 1;
        }
        if (metrics.appointments > 10) {
            factors.push('Frequent appointments');
            riskScore += 2;
        }
        if (metrics.medicationAdministrations > 20) {
            factors.push('High medication usage');
            riskScore += 2;
        }
        let level;
        if (riskScore >= 5)
            level = 'CRITICAL';
        else if (riskScore >= 3)
            level = 'HIGH';
        else if (riskScore >= 1)
            level = 'MEDIUM';
        else
            level = 'LOW';
        return { level, factors };
    }
    generateStudentRecommendations(metrics) {
        const recommendations = [];
        if (metrics.incidents > 2) {
            recommendations.push('Consider additional supervision or support');
        }
        if (metrics.appointments > 5 && metrics.upcomingAppointments > 2) {
            recommendations.push('Schedule follow-up appointments carefully');
        }
        if (!metrics.lastHealthRecord || metrics.lastHealthRecord < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) {
            recommendations.push('Due for health record update');
        }
        return recommendations;
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
    determineComplianceStatus(scores) {
        const overall = scores.overall;
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
        if (scores.medication < analytics_constants_1.ANALYTICS_CONSTANTS.THRESHOLDS.MEDICATION_ADHERENCE) {
            concerns.push('Medication adherence below threshold');
        }
        if (scores.immunization < analytics_constants_1.ANALYTICS_CONSTANTS.THRESHOLDS.IMMUNIZATION_COMPLIANCE) {
            concerns.push('Immunization compliance below threshold');
        }
        if (scores.appointments < analytics_constants_1.ANALYTICS_CONSTANTS.THRESHOLDS.APPOINTMENT_COMPLETION) {
            concerns.push('Appointment completion below threshold');
        }
        return concerns;
    }
    generateComplianceRecommendations(scores) {
        const recommendations = [];
        if (scores.medication < 85) {
            recommendations.push('Implement medication reminder systems');
        }
        if (scores.immunization < 90) {
            recommendations.push('Enhance immunization tracking and reminders');
        }
        if (scores.appointments < 80) {
            recommendations.push('Review appointment scheduling and follow-up processes');
        }
        return recommendations;
    }
};
exports.SpecializedReportGeneratorService = SpecializedReportGeneratorService;
exports.SpecializedReportGeneratorService = SpecializedReportGeneratorService = SpecializedReportGeneratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2, Object])
], SpecializedReportGeneratorService);
//# sourceMappingURL=specialized-report-generator.service.js.map