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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("./services");
const base_1 = require("../common/base");
let AnalyticsService = class AnalyticsService extends base_1.BaseService {
    dashboardService;
    reportService;
    healthService;
    incidentService;
    medicationService;
    appointmentService;
    constructor(dashboardService, reportService, healthService, incidentService, medicationService, appointmentService) {
        super('AnalyticsService');
        this.dashboardService = dashboardService;
        this.reportService = reportService;
        this.healthService = healthService;
        this.incidentService = incidentService;
        this.medicationService = medicationService;
        this.appointmentService = appointmentService;
    }
    getAnalyticsMetadata() {
        return {
            module: 'Analytics',
            version: '1.0.0',
            description: 'Comprehensive health metrics, analytics, and reporting for school healthcare operations',
            endpoints: 17,
            categories: [
                {
                    name: 'Health Metrics & Trends',
                    endpoints: 4,
                    description: 'Aggregated health data and trend analysis',
                },
                {
                    name: 'Incident Analytics',
                    endpoints: 2,
                    description: 'Safety incident patterns and location-based analysis',
                },
                {
                    name: 'Medication Analytics',
                    endpoints: 2,
                    description: 'Medication usage and adherence tracking',
                },
                {
                    name: 'Appointment Analytics',
                    endpoints: 2,
                    description: 'Appointment trends and no-show rate analysis',
                },
                {
                    name: 'Dashboards',
                    endpoints: 3,
                    description: 'Real-time operational dashboards for nurses and admins',
                },
                {
                    name: 'Custom Reports',
                    endpoints: 2,
                    description: 'Flexible custom report generation and retrieval',
                },
            ],
            capabilities: [
                'Health metrics aggregation',
                'Time-series trend analysis',
                'Incident pattern identification',
                'Medication usage tracking',
                'Adherence monitoring',
                'Appointment analytics',
                'Real-time dashboards',
                'Custom report generation',
                'Compliance reporting',
                'Predictive insights',
            ],
            authentication: 'JWT required for all endpoints',
            compliance: 'HIPAA-compliant with PHI protection',
        };
    }
    async getHealthMetrics(query) {
        return this.healthService.getHealthMetrics(query);
    }
    async getHealthTrends(query) {
        return this.healthService.getHealthTrends(query);
    }
    async getStudentHealthMetrics(studentId, query) {
        return this.healthService.getStudentHealthMetrics(studentId, query);
    }
    async getSchoolMetrics(schoolId, query) {
        return this.healthService.getSchoolMetrics(schoolId, query);
    }
    async getIncidentTrends(query) {
        return this.incidentService.getIncidentTrends(query);
    }
    async getIncidentsByLocation(query) {
        return this.incidentService.getIncidentsByLocation(query);
    }
    async getMedicationUsage(query) {
        return this.medicationService.getMedicationUsage(query);
    }
    async getMedicationAdherence(query) {
        return this.medicationService.getMedicationAdherence(query);
    }
    async getAppointmentTrends(query) {
        return this.appointmentService.getAppointmentTrends(query);
    }
    async getNoShowRate(query) {
        return this.appointmentService.getNoShowRate(query);
    }
    async getNurseDashboard(query) {
        return this.dashboardService.getNurseDashboard(query);
    }
    async getAdminDashboard(query) {
        return this.dashboardService.getAdminDashboard(query);
    }
    async getPlatformSummary(query) {
        return this.dashboardService.getPlatformSummary(query);
    }
    async generateCustomReport(dto, userId) {
        return this.reportService.generateCustomReport(dto, userId);
    }
    async getGeneratedReport(reportId, query) {
        return this.reportService.getGeneratedReport(reportId, query);
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [services_1.AnalyticsDashboardService,
        services_1.AnalyticsReportService,
        services_1.AnalyticsHealthService,
        services_1.AnalyticsIncidentOrchestratorService,
        services_1.AnalyticsMedicationOrchestratorService,
        services_1.AnalyticsAppointmentOrchestratorService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map