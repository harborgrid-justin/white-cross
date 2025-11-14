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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const swagger_1 = require("@nestjs/swagger");
const analytics_service_1 = require("./analytics.service");
const custom_reports_dto_1 = require("./dto/custom-reports.dto");
const dashboard_dto_1 = require("./dto/dashboard.dto");
const appointment_analytics_dto_1 = require("./dto/appointment-analytics.dto");
const health_metrics_dto_1 = require("./dto/health-metrics.dto");
const analytics_query_dto_1 = require("./dto/analytics-query.dto");
const incident_analytics_dto_1 = require("./dto/incident-analytics.dto");
const medication_analytics_dto_1 = require("./dto/medication-analytics.dto");
const report_generation_dto_1 = require("./dto/report-generation.dto");
const base_1 = require("../common/base");
let AnalyticsController = class AnalyticsController extends base_1.BaseController {
    analyticsService;
    constructor(analyticsService) {
        super();
        this.analyticsService = analyticsService;
    }
    getAnalyticsMetadata() {
        return this.analyticsService.getAnalyticsMetadata();
    }
    async getHealthMetrics(query) {
        return this.analyticsService.getHealthMetrics(query);
    }
    async getHealthTrends(query) {
        return this.analyticsService.getHealthTrends(query);
    }
    async getStudentHealthMetrics(params, query) {
        return this.analyticsService.getStudentHealthMetrics(params.studentId, query);
    }
    async getSchoolMetrics(params, query) {
        return this.analyticsService.getSchoolMetrics(params.schoolId, query);
    }
    async getIncidentTrends(query) {
        return this.analyticsService.getIncidentTrends(query);
    }
    async getIncidentsByLocation(query) {
        return this.analyticsService.getIncidentsByLocation(query);
    }
    async getMedicationUsage(query) {
        return this.analyticsService.getMedicationUsage(query);
    }
    async getMedicationAdherence(query) {
        return this.analyticsService.getMedicationAdherence(query);
    }
    async getAppointmentTrends(query) {
        return this.analyticsService.getAppointmentTrends(query);
    }
    async getNoShowRate(query) {
        return this.analyticsService.getNoShowRate(query);
    }
    async getNurseDashboard(query) {
        return this.analyticsService.getNurseDashboard(query);
    }
    async getAdminDashboard(query) {
        return this.analyticsService.getAdminDashboard(query);
    }
    async getPlatformSummary(query) {
        return this.analyticsService.getPlatformSummary(query);
    }
    async generateCustomReport(dto, req) {
        const userId = req.user?.id || 'system';
        return this.analyticsService.generateCustomReport(dto, userId);
    }
    async getGeneratedReport(params, query) {
        return this.analyticsService.getGeneratedReport(params.id, query);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "MODULE METADATA ENDPOINT", summary: 'Get analytics module metadata',
        description: 'Returns information about the analytics module including available endpoint categories, capabilities, and authentication requirements. No authentication required for metadata access.' }),
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Analytics module metadata retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getAnalyticsMetadata", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "HEALTH METRICS & TRENDS ENDPOINTS", summary: 'Get aggregated health metrics',
        description: 'Retrieves comprehensive health metrics for specified time period. Includes visit counts, incident rates, medication administration counts, chronic condition prevalence, immunization compliance, and emergency contact coverage. Supports school/district-level aggregation and period-over-period comparison. Essential for population health management and performance tracking.' }),
    (0, common_1.Get)('health-metrics'),
    (0, cache_manager_1.CacheTTL)(300),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health metrics retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [health_metrics_dto_1.GetHealthMetricsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getHealthMetrics", null);
__decorate([
    (0, common_1.Get)('health-trends'),
    (0, cache_manager_1.CacheTTL)(900),
    (0, swagger_1.ApiOperation)({
        summary: 'Get health trend analysis',
        description: 'Provides time-series trend analysis for health conditions and medications. Tracks changes over time with daily/weekly/monthly/quarterly/yearly aggregation. Identifies seasonal patterns, emerging health issues, and medication usage trends. Supports optional predictive forecasting for proactive health management. Critical for identifying outbreaks and planning interventions.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health trends retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof analytics_query_dto_1.GetHealthTrendsQueryDto !== "undefined" && analytics_query_dto_1.GetHealthTrendsQueryDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getHealthTrends", null);
__decorate([
    (0, common_1.Get)('health-metrics/student/:studentId'),
    (0, cache_manager_1.CacheTTL)(300),
    (0, swagger_1.ApiOperation)({
        summary: 'Get student health trends',
        description: '**PHI ENDPOINT** - Returns detailed health trend data for individual student. Includes vital signs history, health visit patterns, medication adherence, chronic condition management, and growth metrics. Requires proper authorization and access logging per HIPAA. Used for personalized health tracking and care plan monitoring.',
    }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student health metrics retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid student ID' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions for student data',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [health_metrics_dto_1.GetStudentHealthMetricsParamDto,
        health_metrics_dto_1.GetStudentHealthMetricsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getStudentHealthMetrics", null);
__decorate([
    (0, common_1.Get)('health-metrics/school/:schoolId'),
    (0, cache_manager_1.CacheTTL)(900),
    (0, swagger_1.ApiOperation)({
        summary: 'Get school-wide health metrics',
        description: 'Comprehensive school-level health analytics dashboard. Includes population health summary, immunization compliance by vaccine and grade, incident analysis by type/location/time, chronic condition management, and medication usage patterns. Supports grade-level filtering and district-wide comparisons. Essential for school health program evaluation and resource planning.',
    }),
    (0, swagger_1.ApiParam)({ name: 'schoolId', description: 'School ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'School metrics retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid school ID' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions for school data',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'School not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [health_metrics_dto_1.GetSchoolMetricsParamDto,
        health_metrics_dto_1.GetSchoolMetricsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSchoolMetrics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "INCIDENT ANALYTICS ENDPOINTS", summary: 'Get incident trends',
        description: 'Analyzes incident patterns over time with multiple grouping options (type, location, time of day, day of week, severity). Identifies high-risk areas, peak incident times, and seasonal patterns. Tracks incident rate trends (increasing/decreasing/stable). Used for safety planning, staff allocation, and preventive interventions. Supports filtering by incident type and severity.' }),
    (0, common_1.Get)('incidents/trends'),
    (0, cache_manager_1.CacheTTL)(900),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Incident trends retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [incident_analytics_dto_1.GetIncidentTrendsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getIncidentTrends", null);
__decorate([
    (0, common_1.Get)('incidents/by-location'),
    (0, cache_manager_1.CacheTTL)(900),
    (0, swagger_1.ApiOperation)({
        summary: 'Get incidents by location',
        description: 'Spatial analysis of incident distribution across school facilities. Identifies high-incident areas (playground, gymnasium, cafeteria, etc.) for targeted safety interventions. Optional heat map visualization for facilities planning. Used for facility risk assessment, supervision planning, and safety equipment placement. Supports location-specific filtering.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Location-based incident data retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [incident_analytics_dto_1.GetIncidentsByLocationQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getIncidentsByLocation", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "MEDICATION ANALYTICS ENDPOINTS", summary: 'Get medication usage statistics',
        description: 'Comprehensive medication administration analytics. Tracks most-administered medications, usage by category (bronchodilators, stimulants, NSAIDs, etc.), administration frequency, and trends. Includes adherence rate calculations and common administration reasons. Essential for inventory management, controlled substance tracking, and identifying medication needs. Supports grouping by medication, category, student, or time.' }),
    (0, common_1.Get)('medications/usage'),
    (0, cache_manager_1.CacheTTL)(900),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication usage statistics retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [medication_analytics_dto_1.GetMedicationUsageQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getMedicationUsage", null);
__decorate([
    (0, common_1.Get)('medications/adherence'),
    (0, cache_manager_1.CacheTTL)(900),
    (0, swagger_1.ApiOperation)({
        summary: 'Get medication adherence rates',
        description: 'Medication adherence monitoring and compliance tracking. Calculates adherence percentages for chronic medications, identifies students below adherence threshold, tracks missed doses, and analyzes adherence trends. Supports student-specific and medication-specific filtering. Critical for chronic disease management, parent communication about medication compliance, and health outcome optimization.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication adherence data retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [medication_analytics_dto_1.GetMedicationAdherenceQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getMedicationAdherence", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "APPOINTMENT ANALYTICS ENDPOINTS", summary: 'Get appointment trends',
        description: 'Appointment scheduling and completion analytics. Tracks appointment volume by type (screening, medication check, follow-up, immunization), completion rates, cancellation rates, and seasonal patterns. Analyzes trends by day/week/month and appointment status (scheduled, completed, cancelled, no-show). Used for capacity planning, appointment scheduling optimization, and identifying access barriers.' }),
    (0, common_1.Get)('appointments/trends'),
    (0, cache_manager_1.CacheTTL)(900),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Appointment trends retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [appointment_analytics_dto_1.GetAppointmentTrendsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAppointmentTrends", null);
__decorate([
    (0, common_1.Get)('appointments/no-show-rate'),
    (0, cache_manager_1.CacheTTL)(900),
    (0, swagger_1.ApiOperation)({
        summary: 'Get appointment no-show statistics',
        description: 'Detailed no-show rate analysis and root cause identification. Calculates overall and type-specific no-show rates, tracks reasons for missed appointments (student absent, no consent, scheduling conflict), compares against target rates, and identifies trends. Includes actionable insights for reducing no-shows. Critical for appointment policy optimization and parent communication strategies.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'No-show statistics retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [appointment_analytics_dto_1.GetNoShowRateQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getNoShowRate", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "DASHBOARD & SUMMARY ENDPOINTS", summary: 'Get nurse dashboard data',
        description: "Real-time operational dashboard for school nurses. Displays today's/this week's key metrics: total patients, active appointments, critical alerts, bed occupancy, average vital signs, and department status. Includes active health alerts (tachycardia, fever, hypoxemia, etc.) prioritized by severity. Shows upcoming tasks (medication administrations, screenings, follow-ups) with time and priority. Essential daily tool for nursing workflow management." }),
    (0, common_1.Get)('dashboard/nurse'),
    (0, cache_manager_1.CacheTTL)(60),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Nurse dashboard data retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_dto_1.GetNurseDashboardQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getNurseDashboard", null);
__decorate([
    (0, common_1.Get)('dashboard/admin'),
    (0, cache_manager_1.CacheTTL)(300),
    (0, swagger_1.ApiOperation)({
        summary: 'Get admin dashboard data',
        description: 'Executive-level healthcare analytics dashboard for administrators. Provides population health summary, compliance metrics (immunization, documentation, training, audit readiness), predictive insights (outbreak risk, stock shortages, capacity warnings), and top health conditions/medications. Supports district and school-level views with month/quarter/year time ranges. Optional financial data integration. Used for strategic planning and compliance oversight.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Admin dashboard data retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin role required',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_dto_1.GetAdminDashboardQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAdminDashboard", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, cache_manager_1.CacheTTL)(300),
    (0, swagger_1.ApiOperation)({
        summary: 'Get overall platform summary',
        description: 'System-wide health platform analytics. Aggregates data across districts and schools: total students, health visits, medication administrations, incidents, immunization compliance. Shows system-wide alerts and operational status. Supports multi-school/district filtering. Used for district-level reporting, board presentations, and system health monitoring. Provides big-picture view of healthcare operations.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Platform summary retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_dto_1.GetPlatformSummaryQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getPlatformSummary", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "CUSTOM REPORT ENDPOINTS", summary: 'Generate custom report',
        description: 'Flexible custom report generation with multiple report types and formats. Supports: Health Metrics, Incident Analysis, Medication Usage, Appointment Summary, Compliance Status, Student Health Summary, and Immunization Reports. Output formats: JSON, PDF, CSV, XLSX. Configurable date ranges, filters (school, district, grade, students), and optional features (charts, trends, comparisons). Can schedule recurring reports and email to recipients. Generated reports are stored and accessible via report ID.' }),
    (0, common_1.Post)('reports/custom'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Custom report generated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid report parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Report generation failed' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [custom_reports_dto_1.AnalyticsGenerateCustomReportDto, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "generateCustomReport", null);
__decorate([
    (0, common_1.Get)('reports/:id'),
    (0, cache_manager_1.CacheTTL)(3600),
    (0, swagger_1.ApiOperation)({
        summary: 'Get generated report',
        description: 'Retrieves previously generated report by ID. Returns full report data including sections, findings, recommendations, charts, and tables. Supports metadata-only mode (includeData=false) for listing reports without downloading large datasets. Can override output format on retrieval. Used for accessing historical reports, compliance documentation, and scheduled report delivery.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Report ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Report retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid report ID' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof report_generation_dto_1.GetReportParamDto !== "undefined" && report_generation_dto_1.GetReportParamDto) === "function" ? _b : Object, typeof (_c = typeof report_generation_dto_1.GetReportQueryDto !== "undefined" && report_generation_dto_1.GetReportQueryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getGeneratedReport", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map